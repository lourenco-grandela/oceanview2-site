#!/usr/bin/env python3
"""OceanView 2 (v3) — gerador do site estático, sem dependências.

Lê as páginas de src/paginas/, junta as partes comuns de src/parciais/ e os
textos de src/i18n/, e escreve o site pronto em _site/ (português em / e
inglês em /en/). Copia também as letras, o CSS, o JavaScript, as imagens
otimizadas de assets/, os dados de data/ e o config.js.

Uso:
    python3 ferramentas/construir.py             # constrói em _site/
    python3 ferramentas/construir.py --servir    # constrói, serve em
                                                 # http://localhost:8000/ e
                                                 # reconstrói ao gravar

Sintaxe das páginas (ver src/LEIA-ME.md):
    ---                         cabeçalho da página (chave: valor)
    url_pt: /apartamentos/
    url_en: /en/apartments/
    titulo_pt: Apartamentos
    titulo_en: Apartments
    ---
    {% incluir nome %}          parte comum de src/parciais/nome.html
    {% pt %}…{% en %}…{% fim %} texto em cada língua
    {{ t.menu.abrir }}          texto de src/i18n/<língua>.json
    {{ url:/apartamentos/ }}    endereço com a base certa
    {{ base }}, {{ lang }}, {{ titulo }}, {{ url_outra }} …
"""
from __future__ import annotations

import argparse
import functools
import html
import http.server
import json
import os
import re
import shutil
import sys
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import dados_site  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / "src"
SAIDA = RAIZ / "_site"
LINGUAS = ("pt", "en")

# Enquanto a v3 não estiver aprovada, nenhuma página é indexada.
INDEXAR = False

RE_CABECALHO = re.compile(r"\A---\n(.*?)\n---\n", re.S)
RE_INCLUIR = re.compile(r"{%\s*incluir\s+([\w\-/]+)\s*%}")
RE_LINGUA = re.compile(r"{%\s*pt\s*%}(.*?){%\s*en\s*%}(.*?){%\s*fim\s*%}", re.S)
RE_VAR = re.compile(r"{{\s*([^{}]+?)\s*}}")
RE_IMAGEM = re.compile(r"{%\s*imagem\s+(.*?)%}", re.S)
RE_ATRIB = re.compile(r'([\w\-]+)(?:="([^"]*)")?')


def tamanho_webp(caminho: Path) -> tuple[int, int]:
    """Largura e altura de um WebP (VP8, VP8L ou VP8X), sem bibliotecas."""
    b = caminho.read_bytes()[:40]
    tipo = b[12:16]
    if tipo == b"VP8 ":
        return int.from_bytes(b[26:28], "little") & 0x3FFF, int.from_bytes(b[28:30], "little") & 0x3FFF
    if tipo == b"VP8L":
        v = int.from_bytes(b[21:25], "little")
        return (v & 0x3FFF) + 1, ((v >> 14) & 0x3FFF) + 1
    if tipo == b"VP8X":
        return int.from_bytes(b[24:27], "little") + 1, int.from_bytes(b[27:30], "little") + 1
    raise ValueError(f"WebP desconhecido: {caminho}")


def imagem_html(atributos: str, lang: str, base: str) -> str:
    """{% imagem nome="foto-5" sizes="100vw" alt_pt="…" alt_en="…" classe="…" prioridade %}
    Usa todas as larguras que existirem em assets/img/<nome>-<largura>.webp
    (e .avif). Sem «prioridade», a imagem é carregada só quando se aproxima."""
    a = {k: (v if v is not None else True) for k, v in RE_ATRIB.findall(atributos)}
    nome = a["nome"]
    larguras = sorted(int(f.stem.rsplit("-", 1)[1]) for f in (RAIZ / "assets" / "img").glob(f"{nome}-*.webp")
                      if f.stem.rsplit("-", 1)[1].isdigit())
    if not larguras:
        raise SystemExit(f"imagem «{nome}» não existe em assets/img/")
    w, h = tamanho_webp(RAIZ / "assets" / "img" / f"{nome}-{larguras[-1]}.webp")
    sizes = a.get("sizes", "100vw")
    alt = html_escape(a.get(f"alt_{lang}", ""))
    url = lambda l, ext: f"{base}assets/img/{nome}-{l}.{ext}"
    srcset = lambda ext: ", ".join(f"{url(l, ext)} {l}w" for l in larguras)
    meio = larguras[min(1, len(larguras) - 1)]
    carregar = ' fetchpriority="high"' if a.get("prioridade") else ' loading="lazy"'
    classe = f' class="{a["classe"]}"' if a.get("classe") else ""
    tem_avif = (RAIZ / "assets" / "img" / f"{nome}-{larguras[0]}.avif").exists()
    fonte = f'<source type="image/avif" srcset="{srcset("avif")}" sizes="{sizes}">' if tem_avif else ""
    return (f'<picture>{fonte}<img{classe} src="{url(meio, "webp")}" srcset="{srcset("webp")}" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{alt}"{carregar} decoding="async"></picture>')


def html_escape(texto: str) -> str:
    return html.escape(texto, quote=True)


def ler_cabecalho(texto: str) -> tuple[dict, str]:
    m = RE_CABECALHO.match(texto)
    if not m:
        return {}, texto
    meta = {}
    for linha in m.group(1).splitlines():
        if ":" in linha and not linha.lstrip().startswith("#"):
            k, v = linha.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, texto[m.end():]


def incluir(texto: str, profundidade: int = 0) -> str:
    if profundidade > 8:
        raise RuntimeError("Inclusões em ciclo")

    def sub(m):
        caminho = SRC / "parciais" / f"{m.group(1)}.html"
        return incluir(caminho.read_text(encoding="utf-8"), profundidade + 1)

    return RE_INCLUIR.sub(sub, texto)


def procurar(ctx: dict, chave: str):
    valor = ctx
    for parte in chave.split("."):
        if isinstance(valor, dict) and parte in valor:
            valor = valor[parte]
        else:
            raise KeyError(chave)
    return valor


def ligacao(base: str, url: str) -> str:
    if re.match(r"^(https?:|mailto:|tel:|#)", url):
        return url
    return base + url.lstrip("/")


def preencher(texto: str, lang: str, ctx: dict, origem: str) -> str:
    texto = RE_LINGUA.sub(lambda m: m.group(1 if lang == "pt" else 2), texto)
    texto = RE_IMAGEM.sub(lambda m: imagem_html(m.group(1), lang, ctx["base"]), texto)

    def sub(m):
        expr = m.group(1)
        if expr.startswith("url:"):
            return ligacao(ctx["base"], expr[4:].strip())
        try:
            valor = procurar(ctx, expr)
        except KeyError:
            raise SystemExit(f"{origem}: chave desconhecida «{expr}» ({lang})")
        return str(valor)

    # Duas passagens: os textos de i18n podem ter {{ url:… }} e {{ base }}.
    return RE_VAR.sub(sub, RE_VAR.sub(sub, texto))


def menu_html(menu: list, lang: str, ativo: str, base: str) -> str:
    linhas = []
    visiveis = [m for m in menu if not m.get("escondido")]
    for i, item in enumerate(visiveis, 1):
        d = item[lang]
        atual = ' aria-current="page"' if item["id"] == ativo else ""
        linhas.append(
            f'<li><a class="menu-ecra__ligacao" href="{ligacao(base, d["url"])}"{atual}>'
            f'<span class="menu-ecra__num">{i:02d}</span>'
            f'<span class="menu-ecra__nome">{d["nome"]}</span></a></li>'
        )
    return "\n".join(linhas)


def atalhos_html(menu: list, lang: str, base: str) -> str:
    itens = sorted((m for m in menu if m.get("atalho")), key=lambda m: m["atalho"])
    return "\n".join(
        f'<li><a href="{ligacao(base, m[lang]["url"])}">{m[lang]["nome"]}'
        f' <span aria-hidden="true">↗</span></a></li>' for m in itens)


def paginas():
    for caminho in sorted((SRC / "paginas").rglob("*.html")):
        if caminho.name.startswith("_"):
            continue
        meta, corpo = ler_cabecalho(caminho.read_text(encoding="utf-8"))
        yield caminho, meta, corpo


def escrever(url: str, html: str):
    destino = SAIDA / url.lstrip("/")
    if url.endswith("/"):
        destino = destino / "index.html"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(html, encoding="utf-8")


def copiar(origem: Path, destino: Path):
    if not origem.exists():
        return
    if origem.is_dir():
        shutil.copytree(origem, destino, dirs_exist_ok=True)
    else:
        destino.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(origem, destino)


def construir(base: str = "/") -> int:
    textos = {l: json.loads((SRC / "i18n" / f"{l}.json").read_text(encoding="utf-8")) for l in LINGUAS}
    menu = json.loads((SRC / "i18n" / "menu.json").read_text(encoding="utf-8"))
    documento = (SRC / "parciais" / "_documento.html").read_text(encoding="utf-8")

    if SAIDA.exists():
        shutil.rmtree(SAIDA)
    SAIDA.mkdir()

    lista = list(paginas())
    urls_feitas = {m.get(f"url_{l}") for _, m, _ in lista for l in LINGUAS}

    # Páginas do menu que ainda não existem: página «em preparação».
    meta_eb, corpo_eb = ler_cabecalho((SRC / "paginas" / "_em-preparacao.html").read_text(encoding="utf-8"))
    for item in menu:
        if item.get("escondido") or item["pt"]["url"].startswith("#"):
            continue
        if item["pt"]["url"] not in urls_feitas:
            meta = dict(meta_eb, menu=item["id"], url_pt=item["pt"]["url"], url_en=item["en"]["url"],
                        titulo_pt=item["pt"]["nome"], titulo_en=item["en"]["nome"])
            lista.append((SRC / "paginas" / "_em-preparacao.html", meta, corpo_eb))

    dados = {l: dados_site.calcular(RAIZ, l, base) for l in LINGUAS}
    n = 0
    for caminho, meta, corpo in lista:
        for lang in LINGUAS:
            url = meta.get(f"url_{lang}")
            if not url:
                continue
            outra = "en" if lang == "pt" else "pt"
            url_outra = meta.get(f"url_{outra}") or ("/en/" if outra == "en" else "/")
            ctx = {
                "lang": lang,
                "base": base,
                "t": textos[lang],
                "titulo": meta.get(f"titulo_{lang}", ""),
                "descricao": meta.get(f"descricao_{lang}", textos[lang]["site"]["descricao"]),
                "url_atual": ligacao(base, url),
                "url_pt": ligacao(base, meta.get("url_pt", "/")),
                "url_en": ligacao(base, meta.get("url_en", "/en/")),
                "url_outra": ligacao(base, url_outra),
                "lang_outra": outra.upper(),
                "classe": meta.get("classe", ""),
                "cabecalho_tema": meta.get("cabecalho", "claro"),
                "css_extra": "".join(
                    f'<link rel="stylesheet" href="{base}assets/css/{c}.css">'
                    for c in meta.get("css", "").split() if c),
                "js_extra": "".join(
                    f'<script src="{base}assets/js/{j}.js" defer></script>'
                    for j in meta.get("js", "").split() if j),
                "robots": '<meta name="robots" content="noindex, nofollow">'
                if (not INDEXAR or meta.get("noindex")) else "",
                "menu_links": menu_html(menu, lang, meta.get("menu", ""), base),
                "menu_atalhos": atalhos_html(menu, lang, base),
                "ano": time.strftime("%Y"),
                "d": dados[lang],
            }
            conteudo = preencher(incluir(corpo), lang, ctx, caminho.name)
            ctx["conteudo"] = conteudo
            html = preencher(incluir(documento.replace("{{ conteudo }}", "§CONTEUDO§")), lang, ctx, "_documento")
            escrever(url, html.replace("§CONTEUDO§", conteudo))
            n += 1

    copiar(SRC / "assets", SAIDA / "assets")
    for pasta in ("img", "docs"):
        copiar(RAIZ / "assets" / pasta, SAIDA / "assets" / pasta)
    copiar(RAIZ / "data", SAIDA / "data")
    copiar(RAIZ / "config.js", SAIDA / "config.js")
    (SAIDA / ".nojekyll").write_text("")
    return n


def assinatura() -> float:
    pastas = [SRC, RAIZ / "data", RAIZ / "assets", RAIZ / "config.js"]
    ultimo = 0.0
    for p in pastas:
        if p.is_file():
            ultimo = max(ultimo, p.stat().st_mtime)
            continue
        for f in p.rglob("*"):
            if f.is_file():
                ultimo = max(ultimo, f.stat().st_mtime)
    return ultimo


def vigiar():
    atual = assinatura()
    while True:
        time.sleep(1)
        nova = assinatura()
        if nova != atual:
            atual = nova
            try:
                n = construir()
                print(f"  reconstruído ({n} páginas) — {time.strftime('%H:%M:%S')}")
            except SystemExit as erro:
                print(f"  ERRO: {erro}")
            except Exception as erro:  # noqa: BLE001 — manter o servidor vivo
                print(f"  ERRO: {erro!r}")


class Pedido(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--servir", action="store_true", help="servir em localhost e reconstruir ao gravar")
    ap.add_argument("--porta", type=int, default=8000)
    ap.add_argument("--base", default=os.environ.get("BASE", "/"), help="caminho base (por omissão /)")
    args = ap.parse_args()

    n = construir(args.base)
    print(f"Site construído em _site/ ({n} páginas).")
    if not args.servir:
        return

    threading.Thread(target=vigiar, daemon=True).start()
    servidor = http.server.ThreadingHTTPServer(
        ("127.0.0.1", args.porta), functools.partial(Pedido, directory=str(SAIDA)))
    print(f"\n  Abrir: http://localhost:{args.porta}/\n  (Ctrl+C para parar)\n")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nParado.")
        sys.exit(0)


if __name__ == "__main__":
    main()

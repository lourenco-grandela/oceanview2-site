#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Preenche o site com os dados do lançamento (dados-lancamento.json).

    .venv/bin/python ferramentas/preencher.py --verificar   # só diz o que falta
    .venv/bin/python ferramentas/preencher.py               # preenche

O que faz:
- Valida os dados (formatos de email, telefones, datas, domínio, IDs...). Se algum
  estiver mal escrito, pára sem mexer em nada.
- Preenche cada marcador <span data-dado="..."> das páginas (português e
  inglês, landing e política), os textos da descrição da página, o config.js
  (WhatsApp, GA4, Meta) e o domínio em todos os endereços absolutos.
- Pode correr-se as vezes que for preciso: os marcadores ficam no HTML (sem a
  classe .todo), por isso um valor corrigido no JSON volta a ser escrito.
- Com o domínio: gera o robots.txt, o sitemap.xml e os QR codes com UTM para a
  lona e a brochura (pasta qr/).
- Só quando NÃO falta nada obrigatório: escreve o CNAME e apaga os comentários
  TODO das páginas. O CNAME é o que faz o workflow publicar no domínio, sem
  noindex. Enquanto faltar alguma coisa, o site fica em pré-visualização.
- Os emails AVISAR não são escritos em ficheiro nenhum (o repositório é
  público): o script mostra a linha para colar no Apps Script.

Opções: --dados FICHEIRO (por omissão dados-lancamento.json na raiz) e
--raiz PASTA (por omissão a pasta do site; usar uma cópia para testar).
Precisa de: pip install segno (QR codes).
"""
import argparse
import datetime as dt
import html
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ_OMISSAO = os.path.dirname(AQUI)

PAGINAS = {
    "index.html": "pt",
    "en/index.html": "en",
    "privacidade.html": "pt",
    "en/privacy.html": "en",
}
DOMINIO_PROVISORIO = "TODO-dominio.pt"
CAMPANHA = "lancamento-2026-09"  # CLAUDE.md, «Ligações com origem»
QR = [  # nome do ficheiro, página, utm_source
    ("qr-lona", "", "lona"),
    ("qr-brochura", "", "brochura"),
    ("qr-brochura-en", "en/", "brochura"),
]

MESES = {
    "pt": ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
           "agosto", "setembro", "outubro", "novembro", "dezembro"],
    "en": ["January", "February", "March", "April", "May", "June", "July",
           "August", "September", "October", "November", "December"],
}
ROTULO_MAPS = {"pt": "Abrir no Google Maps", "en": "Open in Google Maps"}
CLASSES = ["A+", "A", "B", "B-", "C", "D", "E", "F"]


# ------------------------------------------------------------ campos
# chave no HTML, caminho no JSON, tipo, obrigatório, quem dá
CAMPOS = [
    ("whatsapp", ("whatsapp",), "whatsapp", True, "clientes"),
    ("whatsapp_contactos", ("whatsapp_contactos",), "contactos", False, "clientes"),
    ("mediadora", ("comercializacao", "mediadora"), "texto", True, "clientes"),
    ("ami", ("comercializacao", "ami"), "ami", True, "clientes"),
    # Os dois agentes (nome, telefone, email) no rodapé: clientes, 19/10/2026.
    ("agentes", ("comercializacao", "agentes"), "agentes", True, "clientes"),
    ("classe_energetica", ("classe_energetica",), "classe", True, "clientes"),
    # Responsáveis pelo tratamento: a Inês e o Carlos, identificados no próprio
    # texto da política (content/privacidade.*.md). Sem NIF nem morada
    # (clientes, 19/10/2026): o script já não os pede nem os escreve.
    ("prazo_conservacao_meses", ("politica", "prazo_conservacao_meses"), "meses", True, "clientes"),
    ("email_direitos", ("politica", "email_direitos"), "emails_texto", True, "clientes"),
    ("texto_aprovado", ("politica", "texto_aprovado"), "sim", True, "clientes (e jurista)"),
    ("data_publicacao_politica", ("politica", "data_publicacao"), "data", False, "tu (fica a data do lançamento)"),
    ("avisar", ("avisar",), "emails", True, "clientes"),
    ("dominio", ("dominio",), "dominio", True, "clientes"),
    ("praia_a_pe_min", ("distancias", "praia_a_pe_min"), "minutos", True, "tu"),
    ("peniche_carro_min", ("distancias", "peniche_carro_min"), "minutos", True, "tu"),
    ("obidos_carro_min", ("distancias", "obidos_carro_min"), "minutos", True, "tu"),
    ("lisboa_carro_min", ("distancias", "lisboa_carro_min"), "minutos", True, "tu"),
    ("data_medicao", ("distancias", "data_medicao"), "mes", True, "tu"),
    ("google_maps", ("google_maps",), "maps", True, "clientes / tu"),
    ("arquitetura_validada", ("arquitetura_validada",), "sim", True, "clientes"),
    ("ga4", ("medicao", "ga4"), "ga4", False, "clientes / tu"),
    ("meta_pixel", ("medicao", "meta_pixel"), "meta", False, "clientes / tu"),
]


def ler(dados, caminho):
    valor = dados
    for parte in caminho:
        if not isinstance(valor, dict):
            return None
        valor = valor.get(parte)
    if isinstance(valor, str):
        valor = valor.strip()
        if valor == "":
            return None
    return valor


EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")


def validar(tipo, valor):
    """Devolve (valor normalizado, erro ou None)."""
    if tipo == "texto":
        return str(valor), None
    if tipo == "whatsapp":
        digitos = re.sub(r"\D", "", str(valor))
        if len(digitos) == 9:
            return None, "falta o indicativo do país (ex.: +351 912 345 678)"
        if not 10 <= len(digitos) <= 15:
            return None, "não parece um número internacional"
        return digitos, None
    if tipo == "telefone":
        digitos = re.sub(r"\D", "", str(valor))
        if len(digitos) < 9:
            return None, "tem menos de 9 dígitos"
        return str(valor), None
    if tipo == "email":
        if not EMAIL.match(str(valor)):
            return None, "não parece um email"
        return str(valor), None
    if tipo == "emails_texto":
        # Um ou mais emails separados por «;» (ex.: os dois agentes).
        emails = [e.strip() for e in str(valor).split(";") if e.strip()]
        maus = [e for e in emails if not EMAIL.match(e)]
        if not emails or maus:
            return None, "emails inválidos: " + ", ".join(maus or [str(valor)])
        return emails, None
    if tipo == "agentes":
        if not isinstance(valor, list) or not valor:
            return None, None if valor in (None, []) else "tem de ser uma lista de agentes"
        for a in valor:
            if not isinstance(a, dict) or not str(a.get("nome") or "").strip():
                return None, "cada agente precisa de nome, telefone e email"
            if len(re.sub(r"\D", "", str(a.get("telefone") or ""))) < 9:
                return None, "telefone de %s com menos de 9 dígitos" % a["nome"]
            if not EMAIL.match(str(a.get("email") or "")):
                return None, "email de %s não parece um email" % a["nome"]
        return [{"nome": a["nome"].strip(), "telefone": str(a["telefone"]).strip(),
                 "email": str(a["email"]).strip()} for a in valor], None
    if tipo == "contactos":
        if not isinstance(valor, list) or not valor:
            return None, None if valor in (None, []) else "tem de ser uma lista de contactos"
        saida = []
        for c in valor:
            if not isinstance(c, dict) or not str(c.get("nome") or "").strip():
                return None, "cada contacto precisa de nome e número"
            numero, erro = validar("whatsapp", c.get("numero"))
            if erro:
                return None, "%s: %s" % (c["nome"], erro)
            saida.append({"nome": c["nome"].strip(), "numero": numero})
        return saida, None
    if tipo == "emails":
        if not isinstance(valor, list) or not valor:
            return None, None if valor in (None, []) else "tem de ser uma lista de emails"
        maus = [e for e in valor if not EMAIL.match(str(e))]
        if maus:
            return None, "emails inválidos: " + ", ".join(map(str, maus))
        return valor, None
    if tipo == "ami":
        if not re.fullmatch(r"\d{3,6}", str(valor)):
            return None, "o n.º AMI são só algarismos"
        return str(valor), None
    if tipo == "classe":
        if str(valor) not in CLASSES:
            return None, "tem de ser uma de " + ", ".join(CLASSES)
        return str(valor), None
    if tipo in ("meses", "minutos"):
        if isinstance(valor, bool) or not isinstance(valor, int) or valor <= 0:
            return None, "tem de ser um número inteiro positivo"
        if tipo == "meses" and valor > 120:
            return None, "mais de 10 anos? confirmar"
        return valor, None
    if tipo == "mes":
        # Mês da medição: AAAA-MM (ou uma data completa, de que só conta o mês).
        m = re.fullmatch(r"(\d{4})-(\d{2})(?:-\d{2})?", str(valor))
        if not m or not 1 <= int(m.group(2)) <= 12:
            return None, "mês no formato AAAA-MM"
        return dt.date(int(m.group(1)), int(m.group(2)), 1), None
    if tipo == "data":
        try:
            return dt.date.fromisoformat(str(valor)), None
        except ValueError:
            return None, "data no formato AAAA-MM-DD"
    if tipo == "dominio":
        d = str(valor).lower()
        if d.startswith(("http://", "https://")) or d.startswith("www."):
            return None, "só o domínio, sem https:// nem www (ex.: oceanview2.pt)"
        if not re.fullmatch(r"[a-z0-9-]+(\.[a-z0-9-]+)+", d):
            return None, "não parece um domínio"
        return d, None
    if tipo == "maps":
        if not re.match(r"https://(maps\.app\.goo\.gl/|goo\.gl/maps/|(www\.)?google\.[a-z.]+/maps|maps\.google\.)", str(valor)):
            return None, "não parece uma ligação do Google Maps (https://maps.app.goo.gl/...)"
        return str(valor), None
    if tipo == "ga4":
        if not re.fullmatch(r"G-[A-Z0-9]{6,12}", str(valor)):
            return None, "o ID do GA4 tem a forma G-XXXXXXXXXX"
        return str(valor), None
    if tipo == "meta":
        if not re.fullmatch(r"\d{10,20}", str(valor)):
            return None, "o ID do píxel da Meta são só algarismos"
        return str(valor), None
    if tipo == "sim":
        return (valor is True), None
    raise ValueError(tipo)


def recolher(dados):
    valores, faltam, erros = {}, [], []
    for chave, caminho, tipo, obrigatorio, quem in CAMPOS:
        bruto = ler(dados, caminho)
        if bruto is None or (tipo == "sim" and bruto is not True):
            if tipo == "sim":
                valores[chave] = False
            faltam.append((chave, ".".join(caminho), obrigatorio, quem))
            continue
        valor, erro = validar(tipo, bruto)
        if erro:
            erros.append("%s: %s" % (".".join(caminho), erro))
        elif valor is None:
            faltam.append((chave, ".".join(caminho), obrigatorio, quem))
        else:
            valores[chave] = valor
    return valores, faltam, erros


# ----------------------------------------------------------- escrita
def mes_por_extenso(data, lingua):
    mes = MESES[lingua][data.month - 1]
    return "%s de %d" % (mes, data.year) if lingua == "pt" else "%s %d" % (mes, data.year)


def duracao(minutos, unidade=None):
    """A partir de 60 min, «1h15» (sem unidade). Até 59: o número, seguido da
    unidade do marcador (data-unidade=" minutos", " min", "-minute"...), para
    o mesmo marcador servir «50 minutos» e «1h15» sem mexer no HTML. Sem
    data-unidade, só o número (a página escreve a unidade a seguir)."""
    if minutos < 60:
        return str(minutos) + (unidade or "")
    return "%dh%02d" % divmod(minutos, 60) if minutos % 60 else "%dh" % (minutos // 60)


def data_por_extenso(data, lingua):
    mes = MESES[lingua][data.month - 1]
    return "%d de %s de %d" % (data.day, mes, data.year) if lingua == "pt" else "%d %s %d" % (data.day, mes, data.year)


def telefone_href(numero):
    digitos = re.sub(r"\D", "", numero)
    if len(digitos) == 9:
        digitos = "351" + digitos
    return "tel:+" + digitos


def conteudo(chave, valor, lingua, unidade=None):
    """HTML a pôr dentro do <span data-dado>. None = não mexer no conteúdo."""
    e = html.escape
    if chave == "data_medicao":
        return e(mes_por_extenso(valor, lingua))
    if chave == "data_publicacao_politica":
        return e(data_por_extenso(valor, lingua))
    if chave.endswith("_min"):
        return e(duracao(valor, unidade))
    if chave == "agentes":
        return "<br>".join('%s · <a href="%s">%s</a> · <a href="mailto:%s">%s</a>' % (
            e(a["nome"]), telefone_href(a["telefone"]), e(a["telefone"]), e(a["email"]), e(a["email"]))
            for a in valor)
    if chave == "email_direitos":
        ligacoes = ['<a href="mailto:%s">%s</a>' % (e(m), e(m)) for m in valor]
        e_ou = " ou " if lingua == "pt" else " or "
        return ", ".join(ligacoes[:-1]) + e_ou + ligacoes[-1] if len(ligacoes) > 1 else ligacoes[0]
    if chave == "google_maps":
        return '<a class="btn btn--claro" href="%s" target="_blank" rel="noopener">%s</a>' % (e(valor), ROTULO_MAPS[lingua])
    if chave == "arquitetura_validada":
        return None
    return e(str(valor))


MARCADOR = re.compile(r'<span(?: class="todo")? data-dado="([a-z_]+)"(?: data-unidade="([^"]*)")?>(.*?)</span>', re.S)


def preco_minimo(raiz):
    """Valor mais baixo das frações disponíveis, do data/fracoes.json (ou None)."""
    try:
        with open(os.path.join(raiz, "data", "fracoes.json"), encoding="utf-8") as f:
            fracoes = json.load(f)
    except (OSError, ValueError):
        return None
    precos = [f["preco"] for f in fracoes
              if f.get("estado") == "disponivel" and isinstance(f.get("preco"), (int, float))]
    return min(precos) if precos else None


def formatar_preco(valor, lingua):
    """250.000 € em português, €250,000 em inglês (como no content/)."""
    n = "{:,}".format(int(round(valor)))
    return n.replace(",", ".") + " €" if lingua == "pt" else "€" + n


def preencher_descricao(texto, lingua, raiz):
    """«desde 250.000 €» / «from €250,000» na descrição da página, a partir do
    data/fracoes.json: o valor nunca fica escrito à mão."""
    minimo = preco_minimo(raiz)
    if minimo is None:
        return texto
    palavra = "desde " if lingua == "pt" else "from "
    return re.sub(r'(<meta (?:name="description"|property="og:description") content="[^"]*?%s)(\[valor\]|\[value\]|[\d.]+ €|€[\d,]+)' % palavra,
                  lambda m: m.group(1) + formatar_preco(minimo, lingua), texto)


def preencher_pagina(texto, lingua, valores):
    preenchidos, por_preencher = set(), set()

    def trocar(m):
        chave, unidade, dentro = m.group(1), m.group(2), m.group(3)
        if chave == "arquitetura_validada":
            if valores.get(chave):
                preenchidos.add(chave)
                return '<span data-dado="%s">%s</span>' % (chave, dentro)
            por_preencher.add(chave)
            return '<span class="todo" data-dado="%s">%s</span>' % (chave, dentro)
        if chave not in valores:
            por_preencher.add(chave)
            return m.group(0)
        preenchidos.add(chave)
        atributo = ' data-unidade="%s"' % unidade if unidade is not None else ""
        return '<span data-dado="%s"%s>%s</span>' % (chave, atributo, conteudo(chave, valores[chave], lingua, unidade))

    texto = MARCADOR.sub(trocar, texto)

    # Descrição da página (meta description e og:description): os minutos a pé.
    if "praia_a_pe_min" in valores:
        texto = re.sub(r'(<meta (?:name="description"|property="og:description") content="[^"]*?)(\[X\]|\d+)([ -]minut)',
                       lambda m: m.group(1) + str(valores["praia_a_pe_min"]) + m.group(3), texto)
    return texto, preenchidos, por_preencher


def dominio_atual(raiz):
    with open(os.path.join(raiz, "index.html"), encoding="utf-8") as f:
        m = re.search(r'<link rel="canonical" href="https://([^/"]+)/">', f.read())
    return m.group(1) if m else DOMINIO_PROVISORIO


def trocar_dominio(texto, antigo, novo):
    for d in {antigo, DOMINIO_PROVISORIO}:
        texto = texto.replace("https://" + d + "/", "https://" + novo + "/")
    return texto


def escrever_config(raiz, valores):
    caminho = os.path.join(raiz, "config.js")
    with open(caminho, encoding="utf-8") as f:
        s = f.read()
    for chave_js, chave in (("whatsapp", "whatsapp"), ("ga4", "ga4"), ("metaPixel", "meta_pixel")):
        if chave in valores:
            s, n = re.subn(r"(\n\s*%s: )'[^']*'" % chave_js, lambda m: m.group(1) + "'%s'" % valores[chave], s)
            if n != 1:
                raise SystemExit("config.js: não encontrei a linha %s" % chave_js)
    if "whatsapp_contactos" in valores:
        lista = json.dumps(valores["whatsapp_contactos"], ensure_ascii=False)
        s, n = re.subn(r"(\n\s*whatsappContactos: )\[[^\]]*\]", lambda m: m.group(1) + lista, s)
        if n != 1:
            raise SystemExit("config.js: não encontrei a linha whatsappContactos")
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(s)


def escrever_robots_sitemap(raiz, dominio):
    hoje = dt.date.today().isoformat()
    with open(os.path.join(raiz, "robots.txt"), "w", encoding="utf-8") as f:
        f.write("User-agent: *\nAllow: /\n\nSitemap: https://%s/sitemap.xml\n" % dominio)
    u = "https://" + dominio + "/"
    paginas = [  # endereço, alternativas (pt, en), prioridade, frequência
        ("", ("", "en/"), "1.0", "weekly"),
        ("en/", ("", "en/"), "0.9", "weekly"),
        ("privacidade.html", ("privacidade.html", "en/privacy.html"), "0.3", "yearly"),
        ("en/privacy.html", ("privacidade.html", "en/privacy.html"), "0.3", "yearly"),
    ]
    linhas = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<!-- Gerado pelo ferramentas/preencher.py. -->',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
              '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for loc, (pt, en), prioridade, freq in paginas:
        linhas += ["  <url>", "    <loc>%s%s</loc>" % (u, loc),
                   '    <xhtml:link rel="alternate" hreflang="pt-PT" href="%s%s"/>' % (u, pt),
                   '    <xhtml:link rel="alternate" hreflang="en-GB" href="%s%s"/>' % (u, en),
                   '    <xhtml:link rel="alternate" hreflang="x-default" href="%s%s"/>' % (u, pt),
                   "    <lastmod>%s</lastmod>" % hoje,
                   "    <changefreq>%s</changefreq>" % freq,
                   "    <priority>%s</priority>" % prioridade, "  </url>"]
    linhas.append("</urlset>")
    with open(os.path.join(raiz, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write("\n".join(linhas) + "\n")


def gerar_qr(raiz, dominio):
    try:
        import segno
    except ImportError:
        print("  ! QR codes não gerados: falta o segno (.venv/bin/pip install segno)")
        return []
    pasta = os.path.join(raiz, "qr")
    os.makedirs(pasta, exist_ok=True)
    feitos = []
    for nome, pagina, origem in QR:
        url = "https://%s/%s?utm_source=%s&utm_medium=qr&utm_campaign=%s" % (dominio, pagina, origem, CAMPANHA)
        # Nível Q (25% de redundância): aguenta uma lona suja ou dobrada.
        qr = segno.make(url, error="q", micro=False)
        qr.save(os.path.join(pasta, nome + ".svg"), scale=10, border=4, dark="#14303A")
        qr.save(os.path.join(pasta, nome + ".png"), scale=20, border=4, dark="#14303A")
        feitos.append((nome, url))
    with open(os.path.join(pasta, "LEIA.txt"), "w", encoding="utf-8") as f:
        f.write("QR codes do OceanView 2, gerados pelo ferramentas/preencher.py.\n"
                "SVG para a gráfica (vetorial), PNG para pré-visualizar. Testar sempre\n"
                "com o telemóvel antes de imprimir. Tamanho mínimo impresso: 2 cm na\n"
                "brochura; na lona, pelo menos 1/10 da distância de leitura.\n\n" +
                "\n".join("%s  %s" % (n, u) for n, u in feitos) + "\n")
    return feitos


def limpar_comentarios_todo(texto):
    return re.sub(r"[ \t]*<!-- TODO.*?-->\n?", "", texto, flags=re.S)


# ---------------------------------------------------------- relatório
def contar_marcadores(raiz):
    contagem = {}
    for pagina in PAGINAS:
        caminho = os.path.join(raiz, pagina)
        if os.path.exists(caminho):
            with open(caminho, encoding="utf-8") as f:
                s = f.read()
            contagem[pagina] = (s.count('class="todo"'), s.count(DOMINIO_PROVISORIO))
    return contagem


def relatorio(faltam, erros, raiz):
    if erros:
        print("\nDados mal escritos (corrigir no JSON):")
        for e in erros:
            print("  ✗ " + e)
    obrig = [f for f in faltam if f[2]]
    opc = [f for f in faltam if not f[2]]
    if obrig:
        print("\nFaltam %d dados obrigatórios:" % len(obrig))
        for _, caminho, _, quem in obrig:
            print("  · %-36s %s" % (caminho, quem))
    if opc:
        print("\nRecomendado (não impede o lançamento):")
        for _, caminho, _, quem in opc:
            print("  · %-36s %s" % (caminho, quem))
    print("\nMarcadores .todo visíveis nas páginas:")
    for pagina, (todo, dom) in contar_marcadores(raiz).items():
        print("  %-20s %2d .todo%s" % (pagina, todo, ("  · domínio provisório em %d sítios" % dom) if dom else ""))
    cname = os.path.join(raiz, "CNAME")
    print("\nPublicação: " + ("DOMÍNIO (CNAME: %s)" % open(cname).read().strip() if os.path.exists(cname)
                              else "pré-visualização com noindex (sem CNAME)"))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--verificar", action="store_true", help="só diz o que falta; não escreve nada")
    ap.add_argument("--dados", help="ficheiro JSON (por omissão dados-lancamento.json na raiz)")
    ap.add_argument("--raiz", default=RAIZ_OMISSAO, help="pasta do site (usar uma cópia para testar)")
    args = ap.parse_args()
    raiz = os.path.abspath(args.raiz)
    caminho_dados = args.dados or os.path.join(raiz, "dados-lancamento.json")
    with open(caminho_dados, encoding="utf-8") as f:
        dados = json.load(f)

    valores, faltam, erros = recolher(dados)
    obrigatorios_em_falta = [f for f in faltam if f[2]]

    if args.verificar:
        print("OceanView 2 — verificação (%s)" % raiz)
        relatorio(faltam, erros, raiz)
        pronto = not erros and not obrigatorios_em_falta
        print("\n" + ("PRONTO para lançar: correr sem --verificar." if pronto
                      else "AINDA NÃO: o site fica em pré-visualização."))
        sys.exit(0 if pronto else 1)

    if erros:
        relatorio(faltam, erros, raiz)
        sys.exit("\nNada foi alterado: corrigir os dados acima e voltar a correr.")

    completo = not obrigatorios_em_falta
    if completo and "data_publicacao_politica" not in valores:
        # Fixa a data no JSON: correr outra vez mais tarde não muda a política.
        hoje = dt.date.today()
        valores["data_publicacao_politica"] = hoje
        dados.setdefault("politica", {})["data_publicacao"] = hoje.isoformat()
        with open(caminho_dados, "w", encoding="utf-8") as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print("  data de publicação da política fixada em %s no %s" % (hoje.isoformat(), os.path.basename(caminho_dados)))
        faltam = [f for f in faltam if f[0] != "data_publicacao_politica"]
    antigo = dominio_atual(raiz)
    print("OceanView 2 — a preencher %s" % raiz)

    for pagina, lingua in PAGINAS.items():
        caminho = os.path.join(raiz, pagina)
        with open(caminho, encoding="utf-8") as f:
            texto = f.read()
        texto, feitos, falta = preencher_pagina(texto, lingua, valores)
        texto = preencher_descricao(texto, lingua, raiz)
        if "dominio" in valores:
            texto = trocar_dominio(texto, antigo, valores["dominio"])
        if completo:
            texto = limpar_comentarios_todo(texto)
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(texto)
        print("  %-20s %d dados preenchidos%s" % (pagina, len(feitos), (", faltam: " + ", ".join(sorted(falta))) if falta else ""))

    escrever_config(raiz, valores)
    no_config = [k for k in ("whatsapp", "whatsapp_contactos", "ga4", "meta_pixel") if k in valores]
    print("  config.js            " + (", ".join(no_config) if no_config else "nada por preencher ainda"))

    if "dominio" in valores:
        escrever_robots_sitemap(raiz, valores["dominio"])
        print("  robots.txt e sitemap.xml para https://%s/" % valores["dominio"])
        for nome, url in gerar_qr(raiz, valores["dominio"]):
            print("  qr/%s.svg/.png   %s" % (nome, url))

    cname = os.path.join(raiz, "CNAME")
    if completo:
        with open(cname, "w", encoding="utf-8") as f:
            f.write(valores["dominio"] + "\n")
        print("  CNAME                %s  → o workflow passa a publicar no domínio, sem noindex" % valores["dominio"])
    elif os.path.exists(cname):
        os.remove(cname)
        print("  CNAME                apagado: faltam dados, volta a pré-visualização")

    if "avisar" in valores:
        print("\nLinha AVISAR para colar no Apps Script (não fica em nenhum ficheiro):")
        print("  var AVISAR = [%s];" % ", ".join("'%s'" % e for e in valores["avisar"]))

    relatorio(faltam, [], raiz)
    print("\n" + ("Tudo preenchido. Próximo passo: docs/LANCAMENTO.md, «Publicar»." if completo
                  else "Ainda faltam dados: o site continua em pré-visualização."))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera as imagens do site em assets/img/ a partir dos originais em material/.

    .venv/bin/pip install pillow "fonttools[woff]" brotli
    .venv/bin/python ferramentas/gerar-imagens.py

- Renders do promotor (material/imagens-promotor/) em AVIF e WebP, nas
  larguras do srcset. Os originais têm 1536 px de largura: não se amplia acima
  disso. O AVIF fica cerca de 20% mais leve; o WebP serve os browsers antigos.
- Esboço de arquiteto (material/design/img/esboco.png) num só WebP sem perdas,
  com transparência, à largura original (1479 px). Reduzido a 1040 px pesava
  mais (121–214 KB contra 42 KB), porque a redução enche a transparência de
  meios-tons; por isso não tem srcset.
- Imagens de partilha (Open Graph) em português e inglês, 1200 × 630, em JPEG
  (é o formato que todas as redes leem).
- Favicon e ícone do iPhone com o símbolo «Vigia».

A pasta material/ não se publica; os ficheiros gerados ficam em assets/img/.
Se aparecerem fotografias reais em material/fotos/, acrescentá-las a IMAGENS.
"""
import io
import math
import os

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEM = os.path.join(RAIZ, "material")
DESTINO = os.path.join(RAIZ, "assets", "img")

ATLANTICO = (20, 48, 58)
LUZ = (201, 142, 69)
BRANCO = (255, 255, 255)

# nome de saída, original, larguras
IMAGENS = [
    ("fachada-noite", "imagens-promotor/fachada-noite.png", (640, 1024, 1536)),
    ("quarto", "imagens-promotor/quarto.png", (640, 1024, 1536)),
    ("sala", "imagens-promotor/sala.png", (640, 1024, 1536)),
]
ESBOCO = ("esboco", "design/img/esboco.png")

QUALIDADE = 74
QUALIDADE_AVIF = 55


def guardar_webp(img, caminho, **opcoes):
    img.save(caminho, "WEBP", method=6, **opcoes)
    return os.path.getsize(caminho)


def redimensionar(img, largura):
    if largura >= img.width:
        return img.copy()
    altura = round(img.height * largura / img.width)
    return img.resize((largura, altura), Image.LANCZOS)


def renders():
    for nome, origem, larguras in IMAGENS:
        img = Image.open(os.path.join(ORIGEM, origem)).convert("RGB")
        for largura in larguras:
            saida = redimensionar(img, largura)
            caminho = os.path.join(DESTINO, "%s-%d.webp" % (nome, largura))
            tamanho = guardar_webp(saida, caminho, quality=QUALIDADE)
            print("%-28s %4d×%-4d %6.1f KB" % (os.path.basename(caminho), saida.width, saida.height, tamanho / 1024))
            caminho = os.path.join(DESTINO, "%s-%d.avif" % (nome, largura))
            saida.save(caminho, "AVIF", quality=QUALIDADE_AVIF)
            print("%-28s %4d×%-4d %6.1f KB" % (os.path.basename(caminho), saida.width, saida.height, os.path.getsize(caminho) / 1024))


def esboco():
    nome, origem = ESBOCO
    img = Image.open(os.path.join(ORIGEM, origem)).convert("RGBA")
    caminho = os.path.join(DESTINO, "%s.webp" % nome)
    tamanho = guardar_webp(img, caminho, lossless=True, quality=100)
    print("%-28s %4d×%-4d %6.1f KB" % (os.path.basename(caminho), img.width, img.height, tamanho / 1024))


# --------------------------------------------------------------- símbolo
def desenhar_vigia(desenho, x, y, lado, cor, traco):
    """Símbolo Vigia num quadrado de `lado` px com canto em (x, y).
    Mesma geometria do SVG do docs/DESIGN.md (viewBox 24)."""
    u = lado / 24.0
    cx, cy, r = x + 12 * u, y + 12 * u, 10.5 * u
    caixa = (cx - r, cy - r, cx + r, cy + r)
    # metade de baixo: corda 0,8 unidades abaixo do centro. Desenhada como
    # polígono: o chord() do Pillow risca a figura com coordenadas não inteiras.
    a = math.asin(0.8 / 10.5)
    pontos = [(cx + r * math.cos(a + (math.pi - 2 * a) * i / 180),
               cy + r * math.sin(a + (math.pi - 2 * a) * i / 180)) for i in range(181)]
    desenho.polygon(pontos, fill=cor)
    desenho.ellipse(caixa, outline=cor, width=max(1, round(traco * u)))
    rs = 2.1 * u
    desenho.ellipse((cx - rs, y + 8.2 * u - rs, cx + rs, y + 8.2 * u + rs), fill=LUZ)


def icone_png(lado, caminho, raio):
    escala = 8
    grande = Image.new("RGBA", (lado * escala, lado * escala), (0, 0, 0, 0))
    d = ImageDraw.Draw(grande)
    d.rounded_rectangle((0, 0, lado * escala - 1, lado * escala - 1), radius=raio * escala, fill=ATLANTICO)
    margem = lado * escala * 0.14
    desenhar_vigia(d, margem, margem, lado * escala - 2 * margem, BRANCO, 1.7)
    grande.resize((lado, lado), Image.LANCZOS).save(caminho, "PNG", optimize=True)
    print("%-28s %4d×%-4d %6.1f KB" % (os.path.basename(caminho), lado, lado, os.path.getsize(caminho) / 1024))


FAVICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#14303A"/>
  <g transform="translate(4.5 4.5) scale(0.958)">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="#FFFFFF" stroke-width="1.7"/>
    <path d="M1.53 12.8 L22.47 12.8 A10.5 10.5 0 0 1 1.53 12.8 Z" fill="#FFFFFF"/>
    <circle cx="12" cy="8.2" r="2.1" fill="#C98E45"/>
  </g>
</svg>
"""


def favicons():
    with open(os.path.join(DESTINO, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(FAVICON_SVG)
    print("favicon.svg")
    icone_png(32, os.path.join(DESTINO, "favicon-32.png"), 7)
    # O iPhone arredonda os cantos sozinho: o ícone vai em quadrado cheio.
    icone_png(180, os.path.join(DESTINO, "apple-touch-icon.png"), 0)


# --------------------------------------------------------- Open Graph
def fonte_archivo(tamanho, peso, largura):
    tff = TTFont(os.path.join(RAIZ, "fonts", "archivo-latin.woff2"))
    tff.flavor = None
    tampao = io.BytesIO()
    tff.save(tampao)
    tampao.seek(0)
    fonte = ImageFont.truetype(tampao, tamanho)
    fonte.set_variation_by_axes([peso, largura])
    return fonte


def escrever(desenho, xy, texto, fonte, cor, espacamento_em=0.0):
    """Texto com espaçamento entre letras (o Pillow não o faz sozinho)."""
    x, y = xy
    extra = fonte.size * espacamento_em
    for i, letra in enumerate(texto):
        desenho.text((x + fonte.getlength(texto[:i]) + i * extra, y), letra, font=fonte, fill=cor)
    return fonte.getlength(texto) + (len(texto) - 1) * extra


def imagem_partilha(linhas, nota, caminho):
    L, A = 1200, 630
    base = Image.open(os.path.join(ORIGEM, "imagens-promotor/fachada-noite.png")).convert("RGB")
    escala = max(L / base.width, A / base.height)
    base = base.resize((round(base.width * escala), round(base.height * escala)), Image.LANCZOS)
    # mesmo enquadramento do hero: object-position 50% 60%
    x0 = round((base.width - L) * 0.5)
    y0 = round((base.height - A) * 0.6)
    img = base.crop((x0, y0, x0 + L, y0 + A)).convert("RGBA")

    # véu do hero (docs/DESIGN.md)
    paragens = [(0.0, 0.55), (0.26, 0.0), (0.44, 0.0), (1.0, 0.82)]
    veu = Image.new("RGBA", (L, A))
    pv = veu.load()
    for yy in range(A):
        t = yy / (A - 1)
        for (t0, a0), (t1, a1) in zip(paragens, paragens[1:]):
            if t0 <= t <= t1:
                alfa = a0 + (a1 - a0) * (t - t0) / (t1 - t0)
                break
        for xx in range(L):
            pv[xx, yy] = ATLANTICO + (round(alfa * 255),)
    img = Image.alpha_composite(img, veu)

    d = ImageDraw.Draw(img)
    margem = 56
    # marca
    escala_simbolo = 4
    simbolo = Image.new("RGBA", (36 * escala_simbolo, 36 * escala_simbolo), (0, 0, 0, 0))
    desenhar_vigia(ImageDraw.Draw(simbolo), 0, 0, 36 * escala_simbolo, BRANCO, 1.4)
    img.alpha_composite(simbolo.resize((36, 36), Image.LANCZOS), (margem, 44))
    escrever(d, (margem + 50, 51), "OCEANVIEW 2", fonte_archivo(18, 600, 125), BRANCO, 0.16)

    # título do hero
    fonte = fonte_archivo(96, 800, 96)
    altura_linha = round(96 * 0.88)
    topo = A - margem - altura_linha * len(linhas) + 10
    for i, linha in enumerate(linhas):
        escrever(d, (margem - 4, topo + i * altura_linha - 18), linha, fonte, BRANCO, -0.045)

    # nota de imagem ilustrativa
    fn = fonte_archivo(16, 400, 100)
    largura = fn.getlength(nota)
    d.text((L - margem - largura, A - margem - 8), nota, font=fn, fill=(255, 255, 255, 214))

    img.convert("RGB").save(caminho, "JPEG", quality=84, optimize=True, progressive=True)
    print("%-28s %4d×%-4d %6.1f KB" % (os.path.basename(caminho), L, A, os.path.getsize(caminho) / 1024))


def main():
    os.makedirs(DESTINO, exist_ok=True)
    renders()
    esboco()
    favicons()
    imagem_partilha(["UMA NOVA", "FORMA DE", "CHEGAR", "A CASA."],
                    "Imagem ilustrativa, não contratual.",
                    os.path.join(DESTINO, "og-oceanview2.jpg"))
    imagem_partilha(["A NEW", "WAY OF", "COMING", "HOME."],
                    "Illustrative image, not contractual.",
                    os.path.join(DESTINO, "og-oceanview2-en.jpg"))


if __name__ == "__main__":
    main()

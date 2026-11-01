#!/usr/bin/env python3
"""Imagens da v3: gera AVIF e WebP em assets/img/ a partir de referencia-v3/imagens/.

    python3 ferramentas/imagens_v3.py            # todas
    python3 ferramentas/imagens_v3.py foto-5     # só algumas (nome de saída)

Precisa do Pillow (pip install pillow). Nunca amplia acima da largura do
original. Fotografias: só as editadas pelo Lourenço (foto-1 a foto-7).
"""
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "referencia-v3" / "imagens"
DESTINO = RAIZ / "assets" / "img"

# saída: (original, larguras)
IMAGENS = {
    "axonometrica": ("axonometrica-branca-oceanview2.png", (768, 1152, 1536)),
    "wc": ("wc.png", (640, 1024, 1536)),
    "foto-1": ("foto-1.jpg", (640, 1024, 1600, 2400)),
    "foto-2": ("foto-2.jpg", (640, 1024, 1600, 2400)),
    "foto-3": ("foto-3.jpg", (640, 1024, 1600, 2400)),
    "foto-4": ("foto-4.jpg", (480, 800, 1200)),
    "foto-5": ("foto-5.jpg", (640, 1024, 1600, 2040)),
    "foto-6": ("foto-6.jpg", (640, 1024, 1600, 2030)),
    "foto-7": ("foto-7.jpg", (640, 1024, 1600, 2040)),
}


def gerar(nome, original, larguras):
    im = Image.open(ORIGEM / original).convert("RGB")
    for w in larguras:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        r.save(DESTINO / f"{nome}-{w}.webp", "WEBP", quality=80, method=6)
        r.save(DESTINO / f"{nome}-{w}.avif", "AVIF", quality=58, speed=6)
        print(f"{nome}-{w}: {w}×{h}")


def main():
    nomes = sys.argv[1:] or list(IMAGENS)
    for n in nomes:
        gerar(n, *IMAGENS[n])


if __name__ == "__main__":
    main()

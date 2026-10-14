#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera os WOFF2 desta pasta a partir das fontes variáveis do google/fonts.

Só é preciso correr isto se houver que atualizar as fontes ou alargar o
conjunto de carateres. Os ficheiros gerados estão versionados, por isso o site
não depende deste script para funcionar.

    python3 -m venv .venv && .venv/bin/pip install "fonttools[woff]" brotli
    .venv/bin/python fonts/gerar-subconjuntos.py

A fonte é o Archivo, com licença OFL (ver OFL-Archivo.txt nesta pasta). A
licença obriga a manter o aviso de copyright junto do ficheiro, e é isso que
esse ficheiro faz. Desde a versão 2 do design (14/10/2026) o site usa só o
Archivo: o Newsreader saiu.
"""
import os
import tempfile
import urllib.request

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl"

# Subconjunto «latin» do Google Fonts, sem o U+FEFF (não desenha nada e faz
# tropeçar o subsetter). Cobre os acentos todos do português, as aspas «»,
# o ·, o º e os traços.
INTERVALOS = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
    "U+2212,U+2215,U+FFFD"
)

# origem no google/fonts, ficheiro de saída, limites dos eixos.
# Os eixos são estreitados ao que o site usa de facto: ver o estilo.css.
TRABALHOS = [
    # wght 400–800: 400 no texto corrido, 800 no título do hero.
    # wdth 96–125: 96 no título do hero, 100 no resto, 125 na marca.
    ("archivo/Archivo%5Bwdth,wght%5D.ttf", "archivo-latin.woff2",
     {"wght": (400, 400, 800), "wdth": (96, 100, 125)}),
]

LICENCAS = [("archivo/OFL.txt", "OFL-Archivo.txt")]


def unicodes(intervalos):
    saida = set()
    for parte in intervalos.split(","):
        parte = parte.strip()[2:]
        if "-" in parte:
            inicio, fim = parte.split("-")
            saida.update(range(int(inicio, 16), int(fim, 16) + 1))
        else:
            saida.add(int(parte, 16))
    return saida


def descarregar(caminho):
    with urllib.request.urlopen(BASE + "/" + caminho) as resposta:
        return resposta.read()


def gerar(origem, saida, limites, codigos):
    with tempfile.NamedTemporaryFile(suffix=".ttf", delete=False) as tmp:
        tmp.write(descarregar(origem))
        bruto = tmp.name

    fonte = TTFont(bruto)
    # 1) Estreitar os eixos.
    fonte = instancer.instantiateVariableFont(fonte, limites, updateFontNames=False)

    # 2) Gravar e reabrir: a tabela gvar precisa de ficar completa, senão o
    #    subsetter rebenta com um KeyError num glifo sem variações.
    with tempfile.NamedTemporaryFile(suffix=".ttf", delete=False) as tmp:
        intermedio = tmp.name
    fonte.save(intermedio)
    fonte.close()

    # 3) Ficar só com os glifos latinos, mantendo kerning e ligaduras.
    fonte = TTFont(intermedio)
    opcoes = subset.Options()
    opcoes.layout_features = ["*"]
    opcoes.name_IDs = ["*"]
    opcoes.name_legacy = True
    opcoes.notdef_outline = True
    opcoes.recalc_bounds = True
    opcoes.drop_tables += ["DSIG"]
    sub = subset.Subsetter(options=opcoes)
    sub.populate(unicodes=codigos)
    sub.subset(fonte)

    # 4) Gravar em WOFF2.
    fonte.flavor = "woff2"
    destino = os.path.join(AQUI, saida)
    fonte.save(destino)
    fonte.close()

    os.unlink(bruto)
    os.unlink(intermedio)
    return os.path.getsize(destino)


def main():
    codigos = unicodes(INTERVALOS)
    for origem, saida, limites in TRABALHOS:
        tamanho = gerar(origem, saida, limites, codigos)
        print("%-30s %6.1f KB" % (saida, tamanho / 1024))
    for origem, saida in LICENCAS:
        with open(os.path.join(AQUI, saida), "wb") as f:
            f.write(descarregar(origem))
        print("%-30s licença" % saida)


if __name__ == "__main__":
    main()

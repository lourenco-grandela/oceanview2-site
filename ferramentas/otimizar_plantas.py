#!/usr/bin/env python3
"""Otimiza as plantas vetoriais por piso do arquiteto para o explorador.

Lê referencia-v3/explorador/*.svg (exportações do ZWCAD, ~1,3 MB cada) e
escreve data/explorador/*.svg prontas para a web:
- tira os metadados (c2pa) e o tamanho fixo (fica só o viewBox);
- arredonda as coordenadas (o desenho não muda à escala do ecrã);
- tira traços invisíveis e atributos com o valor por omissão;
- passa as cores para a paleta v3 (preto -> azul oceano, cinzentos -> tons frios).

Copia também o fracoes-poligonos.json (sem alterações às coordenadas).

Uso: python3 ferramentas/otimizar_plantas.py
"""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "referencia-v3" / "explorador"
DESTINO = RAIZ / "data" / "explorador"

CORES = {
    "rgb(0%, 0%, 0%)": "#0F2E4C",
    "rgb(100%, 100%, 100%)": "#FFFFFF",
}


def cinzento(m):
    v = float(m.group(1))
    if v < 10:
        return "#0F2E4C"
    if v < 55:
        return "#7D8C99"   # linhas secundárias (cotas, mobiliário)
    if v < 75:
        return "#A7B2BC"
    return "#E6DED0"       # preenchimentos claros


def numero(m):
    n = float(m.group(0))
    a = abs(n)
    if a >= 1000:
        return str(int(round(n)))
    if a >= 10:
        s = f"{n:.1f}"
    else:
        s = f"{n:.2f}"
    s = s.rstrip("0").rstrip(".")
    return s if s not in ("-0", "") else "0"


def otimizar(svg: str) -> str:
    svg = re.sub(r"<\?xml[^>]*>\s*", "", svg)
    svg = re.sub(r"<metadata>.*?</metadata>", "", svg, flags=re.S)
    svg = svg.replace(' xmlns:c2pa="http://c2pa.org/manifest"', "")
    svg = re.sub(r'(<svg[^>]*?)\s(width|height)="[^"]*"', r"\1", svg, count=1)
    svg = re.sub(r'(<svg[^>]*?)\s(width|height)="[^"]*"', r"\1", svg, count=1)
    # Traços invisíveis
    svg = re.sub(r'<path fill="none" stroke-width="0\.00001"[^>]*/>\s*', "", svg)
    for k, v in CORES.items():
        svg = svg.replace(k, v)
    svg = re.sub(r"rgb\(([\d.]+)%, \1%, \1%\)", cinzento, svg)
    for attr in (' stroke-opacity="1"', ' fill-opacity="1"', ' stroke-miterlimit="10"'):
        svg = svg.replace(attr, "")
    # Arredondar números dentro de d="…" e atributos numéricos (não nos transform: escalas pequenas)
    svg = re.sub(r'(d|x|y|width|height|stroke-width)="([^"]*)"',
                 lambda m: f'{m.group(1)}="' + re.sub(r"-?\d+\.\d+", numero, m.group(2)) + '"', svg)
    svg = re.sub(r">\s+<", "><", svg)
    return svg.strip() + "\n"


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    for f in sorted(ORIGEM.glob("*.svg")):
        antes = f.stat().st_size
        out = DESTINO / f.name
        out.write_text(otimizar(f.read_text(encoding="utf-8")), encoding="utf-8")
        print(f"{f.name}: {antes/1024:.0f} KB -> {out.stat().st_size/1024:.0f} KB")
    dados = json.loads((ORIGEM / "fracoes-poligonos.json").read_text(encoding="utf-8"))
    (DESTINO / "fracoes-poligonos.json").write_text(
        json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("fracoes-poligonos.json copiado.")


if __name__ == "__main__":
    main()

"""Blocos do site calculados a partir dos dados (data/fracoes.json e
data/site.json). Usado por construir.py: nas páginas, {{ d.chave }}.

Nada aqui é escrito à mão: contagens, áreas, valores e a tabela das frações
saem do JSON. Se mostrar_precos for false, todos os valores passam a
«Sob consulta».
"""
from __future__ import annotations

import html
import json
from pathlib import Path

TIPOLOGIAS = (("T1", "T1"), ("T2", "T2"), ("T22", "T2+2"))

TXT = {
    "pt": {
        "sob_consulta": "Sob consulta", "desde": "Desde", "a": "a",
        "apartamento": "apartamento", "apartamentos": "apartamentos",
        "com_sotao": "com sótão", "pisos": {0: "Piso 0", 1: "Piso 1", 2: "Piso 2"},
        "mais_sotao": " + sótão", "estados": {"disponivel": "Disponível", "reservada": "Reservada", "vendida": "Vendida"},
        "cab": ["Fração", "Tipologia", "Piso", "Área bruta privativa", "Área total", "Exterior", "Estacionamento", "Valor", "Estado", "Planta"],
        "ver": "Ver", "ver_planta_de": "Ver a planta da fração {f} (PDF)", "ver_explorador": "Ver a fração {f} no explorador",
        "nota_tabela": "Áreas em m², do quadro de áreas do projeto. Nas frações I a L, a área total inclui o sótão. "
                       "Exterior: varandas, terraços e alpendres. O estacionamento (14 m², frações C a L) não entra nas áreas. Valores sujeitos a confirmação.",
        "a_pe": "a pé", "de_carro": "de carro",
    },
    "en": {
        "sob_consulta": "Price on request", "desde": "From", "a": "to",
        "apartamento": "apartment", "apartamentos": "apartments",
        "com_sotao": "including attic", "pisos": {0: "Ground floor", 1: "First floor", 2: "Second floor"},
        "mais_sotao": " + attic", "estados": {"disponivel": "Available", "reservada": "Reserved", "vendida": "Sold"},
        "cab": ["Unit", "Type", "Floor", "Gross private area", "Total area", "Outdoor", "Parking", "Price", "Status", "Plan"],
        "ver": "View", "ver_planta_de": "View the floor plan of unit {f} (PDF)", "ver_explorador": "See unit {f} in the explorer",
        "nota_tabela": "Areas in m², from the project's area schedule. In units I to L, the total area includes the attic. "
                       "Outdoor: balconies, terraces and porches. Parking (14 m², units C to L) is not included in the areas. Prices subject to confirmation.",
        "a_pe": "on foot", "de_carro": "by car",
    },
}


def _area(n, lang, casas=2):
    if n is None:
        return "—"
    s = f"{n:,.{casas}f}"
    if lang == "pt":
        s = s.replace(",", " ").replace(".", ",").replace(" ", ".")
    return f"{s} m²"


def _preco(n, lang, mostrar):
    if n is None or not mostrar:
        return TXT[lang]["sob_consulta"]
    s = f"{round(n):,}"
    return s.replace(",", ".") + " €" if lang == "pt" else "€" + s


def _piso(f, lang):
    t = TXT[lang]
    return t["pisos"].get(f["piso"], str(f["piso"])) + (t["mais_sotao"] if f.get("area_sotao_m2") else "")


def calcular(raiz: Path, lang: str, base: str) -> dict:
    fracoes = json.loads((raiz / "data" / "fracoes.json").read_text(encoding="utf-8"))
    site = json.loads((raiz / "data" / "site.json").read_text(encoding="utf-8"))
    mostrar = site.get("mostrar_precos", True)
    t = TXT[lang]
    esc = html.escape

    disponiveis = [f for f in fracoes if f["estado"] == "disponivel"]
    precos = [f["preco"] for f in fracoes if f["preco"] is not None]
    d = {
        "n_fracoes": len(fracoes),
        "n_disponiveis": len(disponiveis),
        "preco_desde": _preco(min(precos), lang, mostrar) if precos else t["sob_consulta"],
        "area_min": round(min(f["area_privativa_m2"] for f in fracoes)),
        "area_max": round(max((f["area_privativa_m2"] or 0) + (f.get("area_sotao_m2") or 0) + (f.get("area_exterior_m2") or 0) for f in fracoes)),
        "tip": {},
    }

    # Resumo por tipologia
    for chave, nome in TIPOLOGIAS:
        grupo = [f for f in fracoes if f["tipologia"] == nome]
        if not grupo:
            continue
        areas = [f["area_total_m2"] for f in grupo]
        a0, a1 = round(min(areas)), round(max(areas))
        area = f"{a0} m²" if a0 == a1 else f"{a0} {t['a']} {a1} m²"
        if any(f.get("area_sotao_m2") for f in grupo):
            area += f", {t['com_sotao']}"
        ps = [f["preco"] for f in grupo if f["preco"] is not None]
        if ps and mostrar:
            preco = _preco(min(ps), lang, True)
            if len(grupo) > 1:
                preco = f"{t['desde']} {preco}"
        else:
            preco = t["sob_consulta"]
        n = len(grupo)
        d["tip"][chave] = {
            "nome": nome,
            "n": n,
            "contagem": f"{n} {t['apartamento'] if n == 1 else t['apartamentos']}",
            "area": area,
            "preco": preco,
            "fracoes": " · ".join(f["fracao"] for f in grupo),
        }

    # Tabela completa (computador) e cartões (telemóvel) da página Apartamentos
    cab = t["cab"]
    linhas = []
    cartoes = []
    for f in fracoes:
        l = f["fracao"]
        estado = t["estados"].get(f["estado"], f["estado"])
        estac = _area(f["estacionamento"], lang, 0) if f["estacionamento"] else "—"
        planta = (f'<a class="tabela__ver" href="{base}{esc(f["planta_pdf"])}" target="_blank" rel="noopener" '
                  f'aria-label="{esc(t["ver_planta_de"].format(f=l))}">{t["ver"]} <span class="seta" aria-hidden="true">↗</span></a>'
                  if f.get("planta_pdf") else "—")
        letra = (f'<a class="tabela__letra" href="?fracao={l}#explorador" '
                 f'aria-label="{esc(t["ver_explorador"].format(f=l))}">{l}</a>')
        celulas = [letra, f["tipologia"], _piso(f, lang), _area(f["area_privativa_m2"], lang),
                   _area(f["area_total_m2"], lang), _area(f["area_exterior_m2"], lang), estac,
                   _preco(f["preco"], lang, mostrar),
                   f'<span class="estado estado--{f["estado"]}">{estado}</span>', planta]
        linhas.append("<tr>" + "".join(
            (f'<th scope="row">{c}</th>' if i == 0 else f'<td data-col="{i}">{c}</td>') for i, c in enumerate(celulas)) + "</tr>")
        dados = "".join(f"<div><dt>{cab[i]}</dt><dd>{celulas[i]}</dd></div>" for i in (2, 3, 4, 5, 6, 7))
        cartoes.append(
            f'<li class="cartao-fracao"><div class="cartao-fracao__topo">{letra}'
            f'<span class="cartao-fracao__tip">{f["tipologia"]}</span>{celulas[8]}</div>'
            f'<dl>{dados}</dl>{planta}</li>')
    d["tabela"] = (
        '<table class="tabela"><thead><tr>' + "".join(f'<th scope="col">{c}</th>' for c in cab) +
        "</tr></thead><tbody>" + "".join(linhas) + "</tbody></table>")
    d["cartoes"] = '<ul class="cartoes-fracao">' + "".join(cartoes) + "</ul>"
    d["nota_tabela"] = t["nota_tabela"]

    # Tempos (clientes, 21/10/2026)
    tempos = site.get("tempos", [])
    d["tempos"] = "".join(
        f'<li><span class="tempos__valor"><span class="alg">{x["minutos"]}</span> min</span>'
        f'<span class="tempos__sitio">{esc(x[lang])}</span><span class="tempos__modo">{t[x["modo"]]}</span></li>'
        for x in tempos)
    d["maps"] = site.get("google_maps", "")
    return d

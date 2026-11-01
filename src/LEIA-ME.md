# Site v3 — fontes

O site é gerado por `ferramentas/construir.py` (Python 3, sem dependências) e
sai em `_site/`, que não vai para o git.

```bash
python3 ferramentas/construir.py --servir
```

Abre em http://localhost:8000/ e reconstrói sozinho quando se grava um ficheiro.

## Pastas

- `paginas/` — uma página por ficheiro. Ficheiros começados por `_` não geram
  página (ex.: `_em-preparacao.html`, usado para as páginas do menu que ainda
  não existem).
- `parciais/` — partes comuns (`_documento.html` envolve todas as páginas;
  `cabecalho`, `rodape`, `explorador`, `marca`…).
- `i18n/` — textos comuns em `pt.json` e `en.json`; o menu em `menu.json`.
- `assets/` — CSS, JS, letras (OFL) e logótipos. As imagens otimizadas e os
  PDFs continuam em `/assets/img` e `/assets/docs` na raiz e são copiados.

Os dados vêm de `/data` (frações, explorador, opções) e o `config.js` da raiz
(WhatsApp, URL do formulário) é copiado tal como está.

## Sintaxe

```
---
url_pt: /apartamentos/
url_en: /en/apartments/
titulo_pt: Apartamentos
titulo_en: Apartments
cabecalho: escuro        (opcional: cabeçalho claro sobre fotografia)
css: explorador          (opcional: CSS extra de assets/css/)
js: explorador           (opcional: JS extra de assets/js/)
menu: apartamentos       (opcional: item do menu assinalado)
---
{% incluir explorador %}
{% pt %}Texto em português{% en %}English text{% fim %}
{{ t.nav.contactar }}   {{ url:/apartamentos/ }}   {{ base }}
```

Não encaixar um `{% pt %}` dentro de outro.

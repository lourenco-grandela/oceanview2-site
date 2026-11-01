# OceanView 2 — site (v3)

Site do empreendimento OceanView 2, na Consolação (Peniche): Início,
Projeto, Apartamentos (com o explorador de frações), Localização, Galeria e
política de privacidade, em português (`/`) e inglês (`/en/`). Linguagem
visual inspirada no Bellevue Cascais (brief em `referencia-v3/REFERENCIA.md`),
com a marca OceanView 2. Regras do projeto em [`CLAUDE.md`](CLAUDE.md),
sistema visual em [`docs/DESIGN.md`](docs/DESIGN.md) e ponto de situação em
[`docs/ESTADO.md`](docs/ESTADO.md).

## Ver em local

Precisa só do Python 3 (já vem no Mac com as ferramentas de linha de comandos).

```bash
python3 ferramentas/construir.py --servir
```

Abre em http://localhost:8000/ e reconstrói sozinho quando se grava um
ficheiro. O site gerado fica em `_site/` (fora do git).

## Pastas

```
src/                  fontes do site (ver src/LEIA-ME.md)
  paginas/            uma página por ficheiro (PT e EN no mesmo ficheiro)
  parciais/           cabeçalho, menu, contacto e formulário, rodapé, cookies, explorador
  i18n/               textos comuns e menu
  assets/             CSS, JS, letras (Italiana e Archivo, OFL) e logótipos
  arquivo/            páginas de teste da v3 (fora do build)
data/fracoes.json     tabela única das 12 frações (preços, áreas, estado, plantas)
data/site.json        opções (mostrar_precos), tempos e Google Maps
data/explorador/      axonometria (pisos), plantas por piso e polígonos das frações
assets/img/           imagens otimizadas (AVIF/WebP)
assets/docs/          PDFs (tabela de valores, plantas)
config.js             WhatsApp, URL do formulário (Apps Script), IDs de medição
formulario/Codigo.gs  Apps Script do formulário (ver docs/FORMULARIO.md)
ferramentas/          construir.py (site), dados_site.py (blocos do JSON),
                      imagens_v3.py (imagens), otimizar_plantas.py (plantas),
                      preencher.py (dados do lançamento), gerar-imagens.py (OG, favicon)
referencia-v3/        brief, plantas do arquiteto, logótipo, fotografias e textos (não se publica)
content/              textos aprovados (landing v2.1, privacidade)
docs/                 DESIGN, ESTADO, FORMULARIO, LANCAMENTO
.github/workflows/    publicação no GitHub Pages (só a partir do main)
```

## Publicação

O workflow `.github/workflows/pre-visualizacao.yml` corre em cada `push` para
o `main`: constrói o site com `ferramentas/construir.py` e publica só a pasta
`_site/`. Com `CNAME` (oceanview2.pt) publica no domínio, sem noindex, com
`robots.txt` e `sitemap.xml`; sem `CNAME`, em pré-visualização com noindex.
O ramo `v3` não publica nada até ser juntado ao `main`.

## Dados pessoais e segredos

`dados-lancamento.json` (emails AVISAR, etc.) fica fora do git. O
`ferramentas/preencher.py` lê-o e escreve o `config.js`, os tempos em
`data/site.json` e o `CNAME`, e mostra a linha AVISAR para colar no Apps
Script (ver `docs/LANCAMENTO.md`).

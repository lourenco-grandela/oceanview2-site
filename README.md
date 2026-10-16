# OceanView 2 — site

Site estático do empreendimento OceanView 2, na Consolação (Peniche).
Fase 1: landing page em português e inglês, com o design da versão 2
(`docs/DESIGN.md`, aprovado a 14/10/2026). O brief completo está em
[`CLAUDE.md`](CLAUDE.md) e o ponto de situação em [`docs/ESTADO.md`](docs/ESTADO.md).

## Ficheiros

```
index.html            landing page em português
en/index.html         landing page em inglês
privacidade.html      política de privacidade em português
en/privacy.html       política de privacidade em inglês
404.html              página de erro, bilingue (o GitHub Pages só usa uma)
dados-lancamento.json dados em falta para o lançamento (fora do git, ver docs/LANCAMENTO.md)
config.js             número de WhatsApp, URL do formulário e IDs de medição
assets/css/estilo.css sistema visual (cores, tipografia, componentes)
assets/js/principal.js formulário, UTM, WhatsApp, cookies
assets/img/           imagens otimizadas (AVIF/WebP), ver «Imagens»
fonts/                Archivo alojado aqui, ver «Tipos de letra»
ferramentas/          gerar-imagens.py (imagens) e preencher.py (dados do lançamento)
qr/                   QR codes com UTM, gerados pelo preencher.py (não se publicam)
content/landing.*.md  textos da landing page (português e inglês)
content/privacidade.pt.md texto da política de privacidade
data/fracoes.json     tabela única das 12 frações (o seletor só aparece
                      quando as 12 tiverem tipologia)
docs/FORMULARIO.md    contrato do formulário (campos, envio, instalação)
docs/DESIGN.md        sistema visual (versão 2)
docs/ESTADO.md        estado do projeto
docs/LANCAMENTO.md    passo a passo do dia do lançamento
.github/workflows/    pré-visualização no GitHub Pages (com noindex)
```

## Ver o site em local

Basta abrir `index.html` no browser. Para o `fetch` do formulário funcionar
igual ao que estará em produção, servir por HTTP:

```bash
python3 -m http.server 8000
```

## Pré-visualização (enquanto faltam dados)

O workflow `.github/workflows/pre-visualizacao.yml` publica o site no GitHub
Pages em cada `push` para o `main`. Sem `CNAME`, em modo pré-visualização, em
`https://<utilizador>.github.io/<repositório>/`.
É uma **exceção aprovada à regra dos TODO, só para mostrar aos clientes**:

- publica só os ficheiros do site (`index.html`, `en/`, `privacidade.html`,
  `404.html`, `config.js`, `assets/`, `fonts/`, `data/`);
- acrescenta `<meta name="robots" content="noindex, nofollow">` às quatro
  páginas no momento da publicação — os ficheiros do repositório não o têm;
- os caminhos são todos relativos (fontes incluídas), por isso o site funciona
  no subcaminho do repositório.

Para ligar: no repositório, **Settings › Pages › Build and deployment ›
Source: GitHub Actions**. A ligação da pré-visualização é pública para quem a
tiver, mesmo com o `noindex`: não pôr lá nada que não possa ser visto.

## Publicar no domínio (lançamento)

Tudo o que falta está no `dados-lancamento.json`. O passo a passo completo
(dados, script, DNS, domínio no GitHub Pages, HTTPS, Search Console e teste do
formulário) está em [`docs/LANCAMENTO.md`](docs/LANCAMENTO.md). Em resumo:

```bash
.venv/bin/python ferramentas/preencher.py --verificar   # o que falta
.venv/bin/python ferramentas/preencher.py               # preenche
```

- Cada dado em falta está no HTML como `<span class="todo" data-dado="chave">`.
  O script troca o conteúdo e tira a classe `.todo`; o marcador fica, por isso
  pode correr-se outra vez com um valor corrigido.
- Só quando não falta nenhum dado obrigatório é que o script escreve o
  `CNAME`. É isso que faz o workflow publicar **no domínio, sem `noindex`**.
  Mesmo com `CNAME`, o workflow recusa publicar se houver um `.todo` visível.
- Os emails da linha `AVISAR` ficam só no `dados-lancamento.json` (fora do
  git): o script mostra a linha para colar no Apps Script.

> **Regra:** nada vai para o domínio com marcadores `.todo` visíveis. Para
> confirmar à mão:
>
> ```bash
> grep -o 'class="todo"' index.html en/index.html privacidade.html en/privacy.html | cut -d: -f1 | uniq -c
> ```

O ficheiro `.nojekyll` está na raiz para o GitHub servir os ficheiros tal como
estão, sem os processar.

## Antes de publicar: o que falta preencher

Tudo o que falta está marcado com `TODO` no código e visível na página com um
sublinhado tracejado (classe `.todo`). **Não pode ficar nenhum `.todo` visível
na página publicada.** Para os encontrar:

```bash
grep -rn "TODO" --include="*.html" --include="*.js" --include="*.css" --include="*.md" --include="*.txt" --include="*.xml" .
```

Lista curta:

- `config.js` — número de WhatsApp, URL da Web App do formulário, IDs do GA4 e do píxel da Meta.
- `index.html` e `privacidade.html` — trocar `TODO-dominio.pt` pelo domínio real (canonical, `og:url`, `og:image`).
- `index.html` — contactos comerciais, denominação da mediadora, n.º AMI e classe energética (as distâncias e o Google Maps já estão preenchidos).
- `privacidade.html` — responsável pelo tratamento, prazos de conservação e transferências de dados.
- `assets/img/` — trocar os renders pelas imagens novas, sem ripas, quando existirem.
- `robots.txt` e `sitemap.xml` — domínio definitivo.

## Imagens

As imagens em `assets/img/` são geradas a partir dos originais em `material/`
(que não se publica) pelo `ferramentas/gerar-imagens.py`:

```bash
.venv/bin/pip install pillow "fonttools[woff]" brotli
.venv/bin/python ferramentas/gerar-imagens.py
```

- Renders do promotor em AVIF e WebP, a 640, 1024 e 1536 px, com `srcset`. Os
  originais têm 1536 px de largura, por isso não há versões de 2400: ampliar
  não acrescenta nitidez. Quando chegarem originais maiores, acrescentar a
  largura no script e no `srcset`.
- Esboço de arquiteto num só WebP sem perdas (1479 px, 42 KB): reduzido pesava
  mais, porque a redução enche a transparência de meios-tons.
- Imagens de partilha (`og-oceanview2.jpg` e `og-oceanview2-en.jpg`), favicon
  e ícone do iPhone com o símbolo Vigia.
- Fotografias editadas pelo Lourenço (`material/fotos/`), recortadas e
  reduzidas pelo script (lista `FOTOS`): três cartões de Viver aqui em 4:5 e
  o bloco da Localização. Só se usam fotografias editadas; nunca de drone
  sem edição. Para gerar só algumas: `gerar-imagens.py viver-praia localizacao`.
- Manter a menção «Imagem ilustrativa, não contratual» em tudo o que não seja
  fotografia final.

## Formulário

O formulário envia por `fetch` para a aplicação web do Google Apps Script que
grava na folha «OceanView 2 — Contactos». O contrato (nomes dos campos, formato
do corpo e instalação) está em [`docs/FORMULARIO.md`](docs/FORMULARIO.md) — é
esse o documento a seguir.

O `FORM_URL` está preenchido no `config.js`. Se ficar vazio, o formulário valida
os campos mas não envia, e mostra a alternativa por WhatsApp.

## Português e inglês

O português está em `/` e o inglês em `/en/`. As duas páginas partilham o
`estilo.css`, o `principal.js`, as imagens e as fontes — só o HTML é que muda.

- A troca PT/EN está no cabeçalho das duas, e há `hreflang` (`pt-PT`, `en-GB`
  e `x-default`) nas duas e no `sitemap.xml`.
- Os textos que o JavaScript escreve (erros do formulário, mensagem de
  sucesso, mensagem do WhatsApp) existem nas duas línguas dentro do
  `principal.js` e são escolhidos pelo `lang` do `<html>`.
- **No formulário inglês os rótulos estão em inglês, mas os valores enviados
  são os mesmos do português** (`Segunda habitação`, `Até 3 meses`, …): é a
  mesma folha de contactos e as mesmas colunas. O campo `pagina` diz
  `/en/index.html`, o que permite saber de que versão veio cada contacto.
- A política de privacidade existe nas duas línguas (`privacidade.html` e
  `en/privacy.html`), com `hreflang` entre elas.
- A página 404 é uma só, bilingue: o GitHub Pages serve o mesmo `404.html`
  para qualquer endereço. Os caminhos partem do `<base href>`, que o workflow
  ajusta ao modo (raiz do repositório na pré-visualização, `/` no domínio).

## Tipos de letra

Uma só família, o **Archivo**, servida a partir de `fonts/` e não do Google
Fonts: o site não faz um único pedido a outro servidor. É a versão variável do
repositório [google/fonts](https://github.com/google/fonts), com licença OFL
(`fonts/OFL-Archivo.txt`, tem de acompanhar o ficheiro). O Newsreader saiu com
o design da versão 2.

| Ficheiro | Eixos | Tamanho |
| --- | --- | --- |
| `archivo-latin.woff2` | `wght` 400–800, `wdth` 96–125 | 78 KB |

Reduzido ao alfabeto latino e aos acentos do português. O 800 e a largura 96
são do título do hero; a largura 125 é da marca. É adiantado com `preload` no
`<head>` de todas as páginas.

Os caminhos são **relativos** (`fonts/...` no `preload`, `../../fonts/...` no
`estilo.css`), por isso o site funciona tanto na raiz do domínio como num
subcaminho (`utilizador.github.io/repositorio/`).

Para voltar a gerar os ficheiros (só é preciso ao atualizar as fontes):

```bash
python3 -m venv .venv && .venv/bin/pip install "fonttools[woff]" brotli
.venv/bin/python fonts/gerar-subconjuntos.py
```

O `estilo.css` define ainda um tipo de recurso (`Archivo recurso`) com
`size-adjust: 97.7%`, para o caso de a rede ser lenta: põe o Helvetica Neue
(ou o Arial) à largura do Archivo, de modo que a troca não mude o texto de
linha. O valor foi medido no browser; se a fonte mudar, voltar a medi-lo.

## Medição

O Google Analytics 4 e o píxel da Meta só são carregados depois de a pessoa
autorizar no banner de cookies. A escolha fica em `localStorage`, na chave
`oceanview2:consentimento`, e pode ser mudada em «Definições de cookies», no
rodapé.

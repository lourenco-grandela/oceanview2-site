# OceanView 2 — site do empreendimento

Este ficheiro é a memória do projeto para o Claude Code: lê-o no início de cada sessão e segue-o. A gestão do projeto (calendário, decisões, feedback dos clientes) vive no painel do chat de projeto; aqui está só o que o site precisa.

> Não guardar neste repositório valores do contrato, dados pessoais dos clientes nem segredos (chaves, tokens). O repositório pode ser público.

## O projeto

- Empreendimento OceanView 2, na Consolação (Peniche): 12 apartamentos, 1 T1, 7 T2 e 4 T2+2, com áreas privativas totais de 56 a 253 m², estacionamento em cave e varandas e terraços conforme a fração. Promotor: NS RMA.
- Objetivo do site: gerar contactos qualificados (registo de interesse e WhatsApp) e apresentar as frações com rigor.
- Público: primeira e segunda habitação, investidores e compradores estrangeiros.

## Fases e prazos

1. Landing page v2/v2.1: publicada em oceanview2.pt a 20/10/2026 (ramo `main`).
2. **Site v3 (01/11/2026), ramo `v3`**: site completo com a linguagem do Bellevue Cascais (brief em `referencia-v3/REFERENCIA.md`, que substitui as partes deste ficheiro sobre o sistema visual). Início, Projeto, Apartamentos com explorador de frações, Localização, Galeria, PT/EN, formulário em 4 passos. O site publicado não mexe até o Lourenço aprovar e o `v3` ser juntado ao `main`.

## Stack e alojamento

- Site estático, sem mensalidade. **v3**: gerador próprio em Python, sem dependências (`ferramentas/construir.py`): fontes em `src/` (páginas PT/EN no mesmo ficheiro, partes comuns, textos), dados em `data/`, site gerado em `_site/` (fora do git). Ver local: `python3 ferramentas/construir.py --servir`. Sintaxe em `src/LEIA-ME.md`.
- Alojamento: GitHub Pages, domínio oceanview2.pt (`CNAME`). O workflow corre só no `main`, constrói com `--publicar` e publica `_site/` (com CNAME: sem noindex, com robots e sitemap; sem CNAME: noindex).
- Formulário: envia por `fetch` para a Web App do Google Apps Script (`FORM_URL` em `config.js`), que grava na Google Sheet e envia o alerta. Na v3 manda também `fracao` e `lingua` (colunas novas no fim da folha; ver `docs/FORMULARIO.md`).
- Analytics: GA4 e píxel da Meta, carregados só depois do consentimento no banner de cookies.

## Sistema visual

**Desde 01/11/2026 vale o `docs/DESIGN.md` (versão 3).** Resumo:

- Creme `#F2EEE7`, areia `#E6DED0`, pedra `#CFC2AA`, azul oceano `#0F2E4C` (secções escuras, botões cheios, texto forte); dourado `#C98E45` só em pormenores (sol, piso ativo, «Reservada»).
- Letras alojadas: Italiana (títulos enormes em maiúsculas) e Archivo Light (texto). Números nos títulos em `<span class="alg">` para ficarem à altura das maiúsculas.
- Botões retangulares de linha fina, maiúsculas espaçadas e ↗. Sem cantos arredondados, sem sombras, linhas finas, muito espaço.
- Logótipo oficial em `referencia-v3/logo/` (cópias limpas em `src/assets/img/logo-*.svg`): símbolo Vigia + OCEANVIEW 2 em azul oceano; branco sobre fotografia.
- Sem ripas de madeira em nenhum elemento desenhado: o edifício terá acrílico.

Os sistemas anteriores (v1 e v2: arestas vivas, Newsreader, pílulas, `#F5F5F1`) estão **substituídos**: não os reutilizar.

## Regras de conteúdo

- Português de Portugal e inglês britânico. Na v3 o tom pode ser mais evocativo, como nos textos aprovados da Inês (que usam «exclusivo»), mas sem inventar dados nem afirmações.
- Botões no infinitivo: «Registar interesse», «Ver apartamentos», «Marcar visita», «Pedir plantas». Exceção: «Contacte-nos» no cabeçalho (Lourenço, 01/11/2026).
- Distâncias: as indicadas pelos clientes (21/10, em `data/site.json`), sempre com «a pé» ou «de carro». Valores do `data/fracoes.json` («Sob consulta» quando o preço for `null`).
- Obrigatório no rodapé e junto das imagens: denominação da mediadora, n.º AMI, classe energética e «Imagem ilustrativa, não contratual» nas imagens que não sejam fotografia final.
- Não inventar dados: o que faltar fica marcado com `TODO:` e entra nas perguntas de `docs/ESTADO.md`.
- Os textos chegam do chat de projeto em `content/`; não os reescrever sem pedido.

## Páginas (v3)

Textos aprovados em `content/landing.*.md` (21/10) e textos da Inês em `referencia-v3/textos-cliente.md` (Projeto e Localização; as listas de divisões e áreas desse documento têm erros: não usar). Números e tabela sempre de `data/fracoes.json`; tempos e Google Maps de `data/site.json`.

- **Início**, **Projeto**, **Apartamentos** (tipologias, explorador, tabela, PDFs), **Localização**, **Galeria**, **Privacidade** (texto aprovado, não muda), 404. Contacto (`#contacto`) no fim de todas.
- **Explorador**: axonometria branca com polígonos por piso + planta do piso com a fração (`data/explorador/`). Polígonos por fração na axonometria só depois de confirmada a correspondência fachada ↔ plantas.

### Formulário

- 4 passos: Sobre si (nome, finalidade) · O seu contacto (email, telemóvel) · A sua casa ideal (tipologia, fração, prazo) · Uma nota pessoal (mensagem, consentimento).
- Obrigatórios: nome, email, telemóvel e consentimento (com ligação à política de privacidade). Escondidos: `utm_source`, `utm_medium`, `utm_campaign`, página; armadilha `empresa`.
- «Pedir informação» no explorador preenche a fração e a tipologia. Sucesso na mesma página; em erro, WhatsApp com a Inês ou o Carlos.

### WhatsApp

Ligação `https://wa.me/<número>?text=` com escolha entre a Inês e o Carlos (`whatsappContactos` no `config.js`). Mensagem geral: «Olá, gostava de receber informação sobre o OceanView 2.»; no explorador, com a fração.

### Ligações com origem

`utm_campaign=lancamento-2026-09`; `utm_source`: instagram, facebook, lona, brochura, whatsapp; `utm_medium`: bio, stories, anuncio, qr.

## Tabela única: `data/fracoes.json`

- Uma entrada por fração (A a L): tipologia, piso, áreas (`area_privativa_m2`, `area_sotao_m2`, `area_exterior_m2`, `area_total_m2`), estacionamento, preço, estado (`disponivel`, `reservada` ou `vendida`), `planta_pdf` e `planta_img`.
- `preco: null` mostra «Sob consulta»; `mostrar_precos: false` em `data/site.json` esconde todos.
- Os valores só mudam a partir da tabela dos clientes; o site lê daqui e nada fica escrito à mão nas páginas.

## Qualidade antes de publicar

- Mobile first e teste num telemóvel real.
- Lighthouse de 90 ou mais em desempenho, acessibilidade, boas práticas e SEO.
- Imagens em WebP ou AVIF com `srcset`, `loading="lazy"` fora do hero e `alt` descritivo.
- Contraste AA, foco visível e navegação por teclado.
- `<title>`, descrição e Open Graph em português e inglês, e favicon.
- Formulário testado de ponta a ponta: o pedido chega à folha e ao email.

## Decisões de 15/10/2026 (versão 2.1)

- A landing page passa à **versão 2.1**: o design da v2 mantém-se tal como está, com dados reais e as secções novas Frações e valores (recolhível), Viver aqui e Para quem. Textos em `content/landing.*.md` (v2.1), aspeto em `material/design-v2-1/referencia-v2-1.html`, regras no fim do `docs/DESIGN.md`. A v3 (material/arquivo-v3) foi posta de parte: não a usar.
- **Hero com a fachada de dia**, não a de noite. A de noite pode continuar noutros sítios (ex.: bloco do formulário).
- **Tipologias como os clientes as apresentam**: 1 T1 (D), 7 T2 (A, B, C, E, F, G, H) e 4 T2+2 (I, J, K, L). Usar sempre «T2+2» para I a L.
- **Valores públicos no site.** Todas as frações disponíveis. Dados em `data/fracoes.json` (preço, áreas de habitação, exterior, sótão, permilagem): o site lê daí e nada fica escrito à mão. Tabela em PDF: `assets/docs/OceanView2_Tabela_de_Valores.pdf`.
- **Tempos medidos** (outubro de 2026): praia da Consolação 6 min a pé · Peniche 10 min de carro · Óbidos 18 min de carro · Lisboa 1h15 de carro. Google Maps: https://maps.app.goo.gl/fyuLWXY6xwbT7Fyo8
- **Fotografias**: só as fotografias editadas pelo Lourenço, que ele põe em `material/fotos/`. Nunca usar fotografias de drone sem edição.

## Dados dos clientes (19/10/2026)

- **Áreas**: nas frações I, J, K e L a área apresentada inclui o sótão (pedido dos clientes): I 166,70 · J 155,25 · K 153,20 · L 165,90 m². No site usar sempre `area_total_m2` do `data/fracoes.json`; não mostrar o sótão numa coluna à parte.
- **Comercialização**: IAD Portugal, AMI n.º 11220. Agentes: Inês Caiado (+351 918 559 623, ines.caiado@iadportugal.pt) e Carlos Lopes (+351 934 915 924, c.lopes@iadportugal.pt). Os dois aparecem no rodapé.
- **WhatsApp**: os dois números. O botão de WhatsApp deixa escolher entre a Inês e o Carlos (ver `whatsapp_contactos` no `dados-lancamento.json`).
- **Classe energética**: A+.
- **Avisos do formulário**: Inês, Carlos e Lourenço.
- **Política de privacidade**: os responsáveis pelos dados são a Inês Caiado e o Carlos Lopes (são eles que guardam e tratam os contactos). Texto em `content/privacidade.pt.md` e `.en.md`, **aprovado pelos clientes** (20/10/2026). NIF e morada não entram (basta identidade e contactos). Prazo de conservação: 24 meses.
- **Frase da Arquitetura validada** pelos clientes (19/10).
- **Logótipo**: opção 2, «Azul oceano» **#0F2E4C**, para o símbolo Vigia e a palavra OCEANVIEW 2 (rodapé, favicon, imagem de partilha). O sol mantém #C98E45. Sobre fotografia continua branco. O resto da paleta do site não muda.
- **Domínio**: oceanview2.pt **registado e ativo** (20/10/2026), na PTisp; DNS para o GitHub Pages e `dominio` no `dados-lancamento.json`. O site publica-se no domínio (ficheiro `CNAME`, sem `noindex`).
- **Ainda em falta**: IDs do GA4 e do píxel da Meta (recomendado).

## Alterações dos clientes (21/10/2026)

- **Tempos** indicados pela Inês e pelo Carlos (substituem os medidos a 15/10): praia da Consolação 5 min a pé · Peniche 10 min de carro · Óbidos 15 min de carro · Lisboa 50 min de carro. Estão no `dados-lancamento.json`; a nota «Tempos medidos em…» saiu do site.
- Textos novos do hero, O projeto, Frações e valores, Arquitetura («Linhas simples. / Maré de luz.»), Localização, Viver aqui (Praia, Lisboa, Estacionamento) e Próximos passos: em `content/landing.*.md`.

## Pastas

- `material/`: originais no computador do Lourenço (no `.gitignore`, não vai para o GitHub).
- `referencia-v3/` (só no ramo `v3`, não se publica): brief, plantas do arquiteto, logótipo, fotografias editadas (foto-1 a foto-7, as únicas que se podem usar), renders, axonometria e textos da Inês.
- O site usa só as versões otimizadas em `assets/img/` (geradas por `ferramentas/imagens_v3.py`) e `data/explorador/` (`ferramentas/otimizar_plantas.py`).

## Fim de cada sessão

1. Atualizar `docs/ESTADO.md`: data, feito, em curso, falta e perguntas.
2. Dar ao Lourenço um resumo de cinco linhas para colar no chat de projeto.

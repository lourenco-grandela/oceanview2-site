# OceanView 2 — site do empreendimento

Este ficheiro é a memória do projeto para o Claude Code: lê-o no início de cada sessão e segue-o. A gestão do projeto (calendário, decisões, feedback dos clientes) vive no painel do chat de projeto; aqui está só o que o site precisa.

> Não guardar neste repositório valores do contrato, dados pessoais dos clientes nem segredos (chaves, tokens). O repositório pode ser público.

## O projeto

- Empreendimento OceanView 2, na Consolação (Peniche): 12 apartamentos, 1 T1, 7 T2 e 4 T2+2, com áreas privativas totais de 56 a 253 m², estacionamento em cave e varandas e terraços conforme a fração. Promotor: NS RMA.
- Objetivo do site: gerar contactos qualificados (registo de interesse e WhatsApp) e apresentar as frações com rigor.
- Público: primeira e segunda habitação, investidores e compradores estrangeiros.

## Fases e prazos

1. **Landing page com o novo design (versão 2), em português e inglês.** Reconstrução a partir de 15/10/2026. Publica-se assim que chegarem os dados obrigatórios (alvo: semana de 19/10/2026). É a prioridade do projeto: os clientes querem divulgá-la já nas redes.
2. Site completo (seletor e páginas de fração, acabamentos, evolução da obra): quando chegar a tabela das frações.

## Stack e alojamento

- Site estático, sem mensalidade: HTML, CSS e JavaScript. No site completo pode usar-se um gerador estático (por exemplo Astro) para criar as páginas de fração a partir de `data/fracoes.json`.
- Alojamento: GitHub Pages, com domínio próprio registado em nome dos clientes (ficheiro `CNAME` no repositório e registos DNS no registador).
- Formulário: envia por `fetch` para uma Web App do Google Apps Script, que grava numa Google Sheet de contactos e envia um email de alerta. O URL da Web App fica em `config.js`; o script valida os campos e rejeita pedidos sem consentimento.
- Analytics: Google Analytics 4 e píxel da Meta, carregados só depois do consentimento no banner de cookies.

## Sistema visual

**Desde 14/10/2026 vale o `docs/DESIGN.md` (versão 2).** O alvo visual é `material/design/referencia.html`, com capturas em `material/design/captura-*.jpg`. Resumo:

- Uma só família, Archivo (pesos 400–800, larguras 96–125), alojada no site. O Newsreader sai.
- Fundo `#F5F5F1`, cartões brancos, títulos Atlântico `#14303A`, texto `#5F6C70`. `#C98E45` só no botão do formulário e no sol do símbolo.
- Cantos arredondados (24 / 18 / 12 px) e botões em pílula. Sem sombras.
- Título do hero enorme, em maiúsculas; o resto em frase.
- Marca provisória: símbolo «Vigia» + «OCEANVIEW 2» (código no `docs/DESIGN.md`), até os clientes escolherem o logótipo.
- Esboço de arquiteto do edifício na secção Arquitetura.
- Sem ripas de madeira em nenhum elemento: o edifício terá acrílico.

O sistema anterior (arestas vivas, Newsreader, temas Dia e Hora azul) está **substituído**: não o reutilizar.

## Regras de conteúdo

- Português de Portugal e inglês britânico. Tom calmo e factual, sem «luxo», «exclusivo», «único» ou «paraíso».
- Botões no infinitivo: «Registar interesse», «Ver frações», «Marcar visita», «Pedir plantas».
- Distâncias só medidas, sempre com «a pé» ou «de carro». Até haver tabela final, «Preços sob consulta».
- Obrigatório no rodapé e junto das imagens: denominação da mediadora, n.º AMI, classe energética e «Imagem ilustrativa, não contratual» nas imagens que não sejam fotografia final.
- Não inventar dados: o que faltar fica marcado com `TODO:` e entra nas perguntas de `docs/ESTADO.md`.
- Os textos chegam do chat de projeto em `content/`; não os reescrever sem pedido.

## Landing page (versão 2)

Textos em `content/landing.pt.md` e `content/landing.en.md`; ordem e aspeto em `material/design/referencia.html`.

1. Hero sobre fotografia: marca, «UMA NOVA FORMA DE CHEGAR A CASA.», subtítulo, «Registar interesse» e WhatsApp.
2. O projeto: imagem, título, texto e quatro números.
3. Imagem grande da sala.
4. Tipologias: três cartões (T1, T2, T2+2), cada um leva ao formulário com a tipologia escolhida.
5. Frações: seletor de A a L e ficha. **Só aparece quando o `data/fracoes.json` tiver tipologia nas 12 frações**; até lá fica escondido (o código fica pronto).
6. Arquitetura: título centrado e esboço de arquiteto.
7. Localização: texto, tempos medidos e fotografia de drone (ou bloco de espera) com ligação ao Google Maps. Sem mapas incorporados: o site não faz pedidos a outros servidores.
8. Próximos passos: três cartões (plantas, visita, WhatsApp).
9. Registo de interesse: bloco escuro com o formulário e uma imagem.
10. Rodapé legal, política de privacidade e definições de cookies.

### Formulário

- Campos obrigatórios: nome, email, telemóvel e consentimento (com ligação à política de privacidade).
- Campos de qualificação: tipologia de interesse (T1, T2, T2+2, ainda não sei), finalidade (habitação própria, segunda habitação, investimento), prazo de compra (até 3 meses, 3 a 12 meses, mais de 12 meses) e mensagem.
- Campos escondidos: `utm_source`, `utm_medium`, `utm_campaign`, página, data e hora.
- Mensagem de sucesso na mesma página; em caso de erro, alternativa pelo WhatsApp.

### WhatsApp

Ligação `https://wa.me/<número>?text=` com mensagem pré-preenchida: «Olá, gostava de receber informação sobre o OceanView 2.» No site completo, a mensagem inclui a fração.

### Ligações com origem

`utm_campaign=lancamento-2026-09`; `utm_source`: instagram, facebook, lona, brochura, whatsapp; `utm_medium`: bio, stories, anuncio, qr.

## Site completo (fase 2)

Início, Localização, Frações (seletor de A a L com o estado de cada uma e legenda em palavras), página por fração (planta, áreas, piso, exposição solar, ficha PDF e WhatsApp com a fração), Acabamentos, Evolução da obra e Contactos. Português em `/` e inglês em `/en/`.

### Tabela única: `data/fracoes.json`

```json
[
  {
    "fracao": "A",
    "tipologia": null,
    "piso": null,
    "area_privativa_m2": null,
    "area_exterior_m2": null,
    "estacionamento": null,
    "preco": null,
    "estado": "disponivel",
    "planta": null,
    "ficha_pdf": null
  }
]
```

- `preco: null` mostra «Sob consulta». `estado` é `disponivel`, `reservada` ou `vendida`.
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

## Pastas

- `material/`: originais, referência de design e fotografias. **Não se publica** (está no `.gitignore`). O site usa só as versões otimizadas em `assets/img/`.

## Fim de cada sessão

1. Atualizar `docs/ESTADO.md`: data, feito, em curso, falta e perguntas.
2. Dar ao Lourenço um resumo de cinco linhas para colar no chat de projeto.

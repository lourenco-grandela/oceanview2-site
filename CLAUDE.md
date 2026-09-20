# OceanView 2 — site do empreendimento

Este ficheiro é a memória do projeto para o Claude Code: lê-o no início de cada sessão e segue-o. A gestão do projeto (calendário, decisões, feedback dos clientes) vive no painel do chat de projeto; aqui está só o que o site precisa.

> Não guardar neste repositório valores do contrato, dados pessoais dos clientes nem segredos (chaves, tokens). O repositório pode ser público.

## O projeto

- Empreendimento OceanView 2, na Consolação (Peniche): 12 apartamentos, 1 T1, 7 T2 e 4 T2+2, com áreas privativas totais de 56 a 253 m², estacionamento em cave e varandas e terraços conforme a fração. Promotor: NS RMA.
- Objetivo do site: gerar contactos qualificados (registo de interesse e WhatsApp) e apresentar as frações com rigor.
- Público: primeira e segunda habitação, investidores e compradores estrangeiros.

## Fases e prazos

1. Landing page de lançamento, em português: online a 25/09/2026. A versão inglesa entra na semana seguinte.
2. Site completo em português e inglês: até 16/10/2026.

## Stack e alojamento

- Site estático, sem mensalidade: HTML, CSS e JavaScript. No site completo pode usar-se um gerador estático (por exemplo Astro) para criar as páginas de fração a partir de `data/fracoes.json`.
- Alojamento: GitHub Pages, com domínio próprio registado em nome dos clientes (ficheiro `CNAME` no repositório e registos DNS no registador).
- Formulário: envia por `fetch` para uma Web App do Google Apps Script, que grava numa Google Sheet de contactos e envia um email de alerta. O URL da Web App fica em `config.js`; o script valida os campos e rejeita pedidos sem consentimento.
- Analytics: Google Analytics 4 e píxel da Meta, carregados só depois do consentimento no banner de cookies.

## Sistema visual

Usar exatamente estes valores (contrastes já verificados para texto AA):

```css
:root {
  /* marca */
  --atlantico: #14303A; --mare: #2E5560; --cal: #EEF0EC; --moleanos: #DCD5C6;
  --sargaco: #5B6446; --luz: #C98E45; --bronze: #8F6229;
  /* tema Dia (por omissão) */
  --surface: #FFFFFF; --surface-alt: #EEF0EC; --ink: #1B2A30; --ink-muted: #5F6C70;
  --heading: #14303A; --line: #CBD1CD; --accent-text: #8F6229;
  --action: #14303A; --action-hover: #2E5560; --on-action: #FFFFFF; --focus-ring: #2E5560;
  --fracao-disponivel: #2E5560; --fracao-reservada: #8F6229; --fracao-vendida: #6C7875;
  --scrim: #14303ADB;
}
[data-theme="hora-azul"] {
  --surface: #14303A; --surface-alt: #233D46; --ink: #F3F5F2; --ink-muted: #B7C5C4;
  --heading: #F3F5F2; --line: #F3F5F224; --accent-text: #D29A55;
  --action: #C98E45; --action-hover: #D29A55; --on-action: #14303A; --focus-ring: #C98E45;
  --fracao-disponivel: #EEF0EC; --fracao-reservada: #C98E45; --fracao-vendida: #8E9996;
}
```

- Tipografia: Archivo (Google Fonts, com o eixo de largura `wdth` 100 a 125) para títulos, marca e interface; Newsreader para texto corrido.
- Marca provisória: «OCEANVIEW 2» em Archivo com largura 125, peso 500, maiúsculas e espaçamento de 0,06em. O logótipo definitivo está a ser desenhado a partir do nome OceanView e vai substituí-la.
- Não usar ripas de madeira em nenhum elemento: o edifício terá acrílico. O sistema visual antigo está desatualizado nesse ponto.
- Arestas vivas (raio 0; 2 px só em chips e campos), filetes em vez de sombras, muito espaço e composições horizontais. `--luz` é só acento, até 3% da área, e nunca texto sobre fundo claro.
- Dois temas: Dia (fundo branco e Cal) e Hora azul (fundo Atlântico), usado no hero e sobre fotografia com o véu `--scrim`.

## Regras de conteúdo

- Português de Portugal e inglês britânico. Tom calmo e factual, sem «luxo», «exclusivo», «único» ou «paraíso».
- Botões no infinitivo: «Registar interesse», «Ver frações», «Marcar visita», «Pedir plantas».
- Distâncias só medidas, sempre com «a pé» ou «de carro». Até haver tabela final, «Preços sob consulta».
- Obrigatório no rodapé e junto das imagens: denominação da mediadora, n.º AMI, classe energética e «Imagem ilustrativa, não contratual» nas imagens que não sejam fotografia final.
- Não inventar dados: o que faltar fica marcado com `TODO:` e entra nas perguntas de `docs/ESTADO.md`.
- Os textos chegam do chat de projeto em `content/`; não os reescrever sem pedido.

## Landing page (fase 1)

1. Hero em Hora azul: marca, frase «Uma nova forma de chegar a casa.», localização e botões «Registar interesse» e WhatsApp.
2. O essencial: 12 apartamentos · T1, T2 e T2+2 · 56 a 253 m² · estacionamento em cave · varandas e terraços.
3. Localização: fotografias reais de drone e tempos medidos até à praia.
4. Galeria: imagens do promotor e fotografias, com a indicação de imagem ilustrativa onde se aplica.
5. Registo de interesse: formulário com qualificação e consentimento.
6. Rodapé legal, política de privacidade e definições de cookies.

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

## Fim de cada sessão

1. Atualizar `docs/ESTADO.md`: data, feito, em curso, falta e perguntas.
2. Dar ao Lourenço um resumo de cinco linhas para colar no chat de projeto.

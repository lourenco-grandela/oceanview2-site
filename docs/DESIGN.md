# OceanView 2 — sistema visual (versão 2, aprovada a 14/10/2026)

Substitui por completo o sistema visual anterior (arestas vivas, Newsreader no texto, tema «Hora azul» em secções inteiras, marca tipográfica sem símbolo). A página de referência é `material/design/referencia.html`, com capturas em `material/design/captura-desktop-*.jpg` e `captura-telemovel-*.jpg`. **O alvo é reproduzir essa página com fidelidade**, mas com o código, a acessibilidade, o formulário, os cookies e o desempenho do site atual.

Inspiração: sites imobiliários editoriais (título enorme sobre fotografia, muito espaço, cantos arredondados, cartões brancos, botões em pílula). O que faz o site parecer uma peça única é a repetição das mesmas regras em todas as secções, por isso não há exceções «só aqui».

## Cores

```css
:root {
  --fundo: #F5F5F1;          /* fundo de toda a página */
  --cartao: #FFFFFF;         /* cartões e ficha da fração */
  --borda-cartao: #E3E6E1;   /* contorno dos cartões */
  --filete: #DCE0DB;         /* linhas divisórias e separadores de números */
  --contorno: #C9CFCA;       /* botões secundários, setas circulares, chips */
  --atlantico: #14303A;      /* títulos, texto forte, botão principal, bloco escuro */
  --mare: #2E5560;           /* hover de ligações, estado «Disponível» */
  --texto-2: #5F6C70;        /* texto corrido, legendas, etiquetas */
  --texto-claro: #B7C5C4;    /* texto secundário sobre Atlântico */
  --luz: #C98E45;            /* SÓ: botão do formulário (sobre Atlântico) e o sol do símbolo */
  --pedra: #E6E2D8;          /* fundo de blocos sem imagem (ex.: espera do mapa) */
}
```

- Texto corrido em `--texto-2` (5,0:1 sobre o fundo; 5,4:1 sobre branco). Títulos em `--atlantico`.
- `--luz` nunca é texto e nunca aparece em mais do que esses dois sítios.
- Sem sombras. Separar com `--filete` e cartões brancos com `--borda-cartao`.
- Véu sobre a fotografia do hero: `linear-gradient(180deg, rgba(20,48,58,.55) 0%, rgba(20,48,58,0) 26%, rgba(20,48,58,0) 44%, rgba(20,48,58,.82) 100%)`. É funcional (legibilidade), não decorativo.

## Forma

| Elemento | Raio |
| --- | --- |
| Hero, imagens grandes, ficha da fração, bloco do formulário, bloco do mapa | 24 px |
| Cartões | 18 px |
| Imagens dentro de cartões | 12 px |
| Campos do formulário | 14 px |
| Botões, chips, etiquetas, setas | 999 px (pílula / círculo) |

O hero não encosta às margens: tem 12 px de recuo em todo o contorno.

## Tipografia

Uma só família: **Archivo**, alojada no site. Regenerar `fonts/archivo-latin.woff2` com `wght` 400–800 e `wdth` 96–125 (o hero usa 800 e largura 96; a marca usa 125). **Retirar o Newsreader** do site e os seus ficheiros.

| Uso | Tamanho | Peso | Outros |
| --- | --- | --- | --- |
| Título do hero (só aqui em maiúsculas) | `clamp(54px, 8.4vw, 124px)` | 800 | `font-stretch: 96%`, `letter-spacing: -0.045em`, `line-height: .88` |
| Títulos de secção (h2) | `clamp(34px, 3.6vw, 52px)` a `clamp(40px, 5.2vw, 76px)` | 600 | `letter-spacing: -0.04em`, `line-height: 1` |
| Números grandes | `clamp(44px, 4.4vw, 64px)` | 600 | algarismos tabulares, unidade a 45% |
| Subtítulo do hero | `clamp(20px, 1.9vw, 26px)` | 500 | `line-height: 1.22` |
| Texto corrido | 17–18 px | 400 | `line-height: 1.6`, máx. 560 px de largura |
| Etiqueta de secção | 11 px | 600 | maiúsculas, `letter-spacing: .18em`, `--texto-2` |
| Marca «OCEANVIEW 2» | 15 px | 600 | `font-stretch: 125%`, `letter-spacing: .16em`, sem quebra de linha |
| Legendas e notas legais | 12–13 px | 400 | `--texto-2` |

Títulos em frase (só a primeira maiúscula), com ponto final. Nada de itálicos.

## Espaço e grelha

- Contentor: `max-width: 1320px`, margens laterais `clamp(16px, 4vw, 56px)`.
- Entre secções: `clamp(72px, 9vw, 128px)`; antes de Arquitetura, Localização, Próximos passos e Registo: `clamp(88px, 10vw, 150px)`.
- Duas colunas: 5/7 (O projeto), 1/1 (ficha da fração, Localização), 11/9 (Registo). Abaixo de 900 px tudo passa a uma coluna.
- Números do projeto: 4 colunas com filete à esquerda; no telemóvel 2 × 2, sem filetes laterais.

## Componentes

- **Botão principal**: pílula Atlântico, texto branco 15 px/600, altura 48, seta à direita. Sobre fotografia: pílula branca com texto Atlântico.
- **Botão secundário**: pílula com contorno `--contorno` (sobre fotografia: branco a 60%), texto 500.
- **Botão do formulário**: pílula `--luz` com texto Atlântico 700, altura 52.
- **Seta circular**: 44 px, contorno `--contorno`; ao passar no cartão fica Atlântico com seta branca.
- **Cartão de tipologia**: branco, 12 px de padding, imagem 16:10, número «01», nome, linha de texto, seta circular.
- **Cartão de ação** (Próximos passos): branco, 28 px de padding, ícone de traço 1,5 px, título 22 px, texto, seta circular.
- **Chip de fração**: círculo 52 px; selecionado = Atlântico com letra branca; `aria-pressed`.
- **Etiqueta de estado**: pílula com contorno e ponto; sempre com a palavra («Disponível», «Reservada», «Vendida»), a cor nunca é o único sinal.
- **Legenda de imagem**: pílula branca a 92% no canto inferior esquerdo da imagem, 12 px: «Imagem ilustrativa, não contratual.»
- **Campos** (sobre Atlântico): altura 50, fundo branco a 6%, contorno branco a 20%, raio 14, rótulo por cima em `--texto-claro`. As opções de escolha (tipologia, finalidade, prazo) são pílulas com `aria-pressed`, não `<select>`.
- **Ícones**: só traço, 1,5 px, sem preenchimento, `aria-hidden`.

## Símbolo provisório («Vigia»)

Até os clientes escolherem o logótipo, a marca é o símbolo Vigia + «OCEANVIEW 2». Branco sobre fotografia, Atlântico sobre fundo claro; o sol é sempre `--luz`.

```html
<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
  <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <path d="M1.53 12.8 L22.47 12.8 A10.5 10.5 0 0 1 1.53 12.8 Z" fill="currentColor"/>
  <circle cx="12" cy="8.2" r="2.1" fill="#C98E45"/>
</svg>
```

Usar o mesmo símbolo no favicon (fundo Atlântico, desenho branco, sol `--luz`).

## Imagens

- Originais em `material/imagens-promotor/` (renders do promotor) e, quando existirem, fotografias reais em `material/fotos/`. A pasta `material/` não é publicada (fica no `.gitignore`).
- Gerar WebP (e AVIF se compensar) em 640, 1024, 1600 e 2400 px de largura, com `srcset` e `sizes`, `width`/`height` e `loading="lazy"` fora do hero.
- **Hero**: se houver em `material/fotos/` uma fotografia de drone com o edifício e o mar, usar essa; senão `fachada-noite.png`. Enquadramento `object-position: 50% 60%`.
- **Esboço de arquiteto**: `material/design/img/esboco.png` (linhas Atlântico sobre transparente). Exportar WebP com transparência a 1040 e 2080 px. Vai sobre o fundo da página, sem moldura.
- Todas as imagens que não sejam fotografia final levam a legenda de imagem ilustrativa.

## Movimento

Discreto e opcional: entrada das secções com `opacity` e `translateY(16px)` em 500 ms, só com `prefers-reduced-motion: no-preference`. Nada de parallax nem carrosséis automáticos.

## Telemóvel

- Abaixo de 900 px: navegação escondida, fica a marca e o botão «Registar interesse» (sem quebra de linha); grelhas a uma coluna; imagem do bloco do formulário passa para baixo com 280 px de altura.
- Hero com `min-height` de 640 px no telemóvel.
- Testar a 360, 390 e 430 px de largura, sem barra horizontal.

## Versão 2.1 (15/10/2026): o que muda

A v3 foi posta de parte. **Mantém-se exatamente o estilo da v2** (hero, tipografia, cartões, ordem). Referência: `material/design-v2-1/referencia-v2-1.html` (lista de frações fechada) e `referencia-v2-1-lista-aberta.html` (aberta), com capturas `captura-v21-*.jpg`.

- **Hero**: imagem da **fachada de dia** (`material/imagens-promotor/fachada-dia.png`), `object-position: 50% 45%`. Véu: `linear-gradient(180deg, rgba(20,48,58,.50) 0%, rgba(20,48,58,0) 24%, rgba(20,48,58,0) 40%, rgba(20,48,58,.85) 100%)`. Título igual à v2 mas **mais pequeno**: `clamp(46px, 6.6vw, 98px)`, `line-height: .9`.
- **Cartões de tipologia**: acrescentar uma linha com o valor (17 px/600): «250.000 €», «Desde 295.000 €», «Desde 490.000 €», calculados do JSON.
- **Frações e valores (nova)**, entre Tipologias e Arquitetura: cartão branco (raio 24) com um resumo sempre visível (três valores de 26 px/600: frações disponíveis, valores desde, tipologias) e dois botões: «Tabela em PDF» (contorno) e «Ver as 12 frações» (Atlântico, com seta). **A lista começa fechada**; o botão abre-a por baixo, dentro do mesmo cartão (`aria-expanded`, `aria-controls`), e passa a «Fechar a lista». Aberta: filtros em pílula e tabela (letra num círculo de 36 px, valor a 600, «Pedir planta» em pílula). Abaixo de 700 px, cartões em vez de tabela. No telemóvel, o resumo fica numa coluna.
- **Localização**: tempos reais; o bloco da direita tem «Consolação, Peniche» e o botão «Abrir no Google Maps». Sem mapa incorporado. Quando houver fotografia editada da zona em `material/fotos/`, passa a ser a imagem deste bloco.
- **Viver aqui (nova)**, depois da Localização: três cartões-fotografia de 500 px de altura, raio 24, véu Atlântico em baixo, título 26 px/600 e frase. **Só fotografias editadas pelo Lourenço, da pasta `material/fotos/`.** Enquanto a pasta estiver vazia, blocos `--pedra` com a indicação da fotografia em falta (não publicar assim).
- **Para quem (nova)**, logo a seguir: três cartões brancos (raio 18) com número, título 22 px/600 e frase.
- **Barra fixa no telemóvel** (abaixo de 900 px): «WhatsApp» e «Registar interesse».
- Fotografias reais: legenda com mês e ano. Renders: sempre «Imagem ilustrativa, não contratual.»

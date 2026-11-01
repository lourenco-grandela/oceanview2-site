# OceanView 2 — sistema visual (versão 3, 01/11/2026)

Substitui o sistema da v2/v2.1 (pílulas, cantos arredondados, fundo
`#F5F5F1`, uma só família de letra). Referência: Bellevue Cascais, traduzido
para a marca OceanView 2 (brief em `referencia-v3/REFERENCIA.md`). A v2 está
no histórico do git e no ramo `main` até a v3 ser publicada.

O que faz o site parecer uma peça única é repetir as mesmas regras em todas
as páginas: muito espaço, poucas palavras, títulos enormes em maiúsculas,
imagens grandes sem cantos, linhas finas e aparecimento suave ao rolar.

## Cores (`src/assets/css/base.css`)

```css
--creme: #F2EEE7;     /* fundo de toda a página */
--areia: #E6DED0;     /* blocos secundários (ex.: Interiores), hover de linhas */
--pedra: #CFC2AA;     /* contornos dos botões do explorador */
--oceano: #0F2E4C;    /* azul oceano: marca, texto forte, secções escuras, botões cheios */
--texto-2: #4F5E6C;   /* texto secundário e legendas (5,8:1 no creme, 5,0:1 na areia) */
--texto-claro: #C9D3DC; /* texto secundário sobre azul oceano (9,1:1) */
--filete: #D6CCBA;    /* linhas finas */
--dourado: #C98E45;   /* só pormenores: o sol, o piso ativo no explorador, estado «Reservada» */
```

Sem sombras. Separar com linhas finas. O dourado nunca é texto corrido.

## Letras

Alojadas no site (OFL), escolhidas pelo Lourenço a 01/11/2026:

- **Italiana** (títulos, sempre em maiúsculas): `.titulo-ecra` (hero),
  `.titulo-1`, `.titulo-2`, `.titulo-3`.
- **Archivo Light** (texto, etiquetas, botões); o logótipo também é Archivo.
- A Italiana só tem algarismos de estilo antigo. Nos títulos, cada número vai
  em `<span class="alg">` (1,4 em, mesma linha de base) para ficar à altura das
  maiúsculas — é o caso do «2» de «OCEANVIEW 2».
- Etiquetas: 11 px (12 px no telemóvel), maiúsculas, espaçamento 0,28 em.
- Nada de itálicos.

## Botões e ligações

- Retangulares, de linha fina, texto em maiúsculas espaçadas e seta ↗.
  `.botao` (cheio azul oceano), `.botao--linha` (contorno), `.botao--claro` e
  `.botao--linha-clara` (sobre azul oceano ou fotografia).
- Ao passar o rato, o fundo enche da esquerda para a direita e a seta sobe.
- `.ligacao-seta`: texto com filete que se recolhe e ↗.
- Textos no infinitivo («Registar interesse», «Ver apartamentos», «Marcar
  visita»); exceção decidida pelo Lourenço: «Contacte-nos» no cabeçalho.

## Cabeçalho e menu

- Cabeçalho: emblema Vigia à esquerda; à direita EN/PT, «Contacte-nos»
  (leva a `#contacto`) e três linhas. Transparente sobre fotografia
  (`cabecalho: escuro` no topo da página), creme ao descer; esconde ao descer
  e volta ao subir.
- Menu em ecrã inteiro, azul oceano: Início, Projeto, Apartamentos,
  Localização, Galeria, Contactos (Vídeo escondido até haver vídeo), contactos
  da Inês e do Carlos e atalhos ↗. Esc fecha, foco preso, volta ao botão.

## Páginas (todas terminam no contacto e no rodapé)

- **Início**: hero com a fachada de dia e zoom lento, nome enorme e
  «Consolação · Peniche»; abertura; faixa azul com 5 características; «O
  projeto»; resumo das tipologias; localização com citação; contacto.
- **Projeto**: conceito, arquitetura com o esboço, interiores, quem faz.
- **Apartamentos**: entrada com números, tipologias, «Do primeiro olhar…»,
  explorador, tabela das 12 frações.
- **Localização**: tempos, Google Maps, Consolação, Peniche (5 temas), mosaico.
- **Galeria**: grelha e visualizador (setas, teclado, toque).

## Explorador de frações

- Imagem principal: axonometria branca com um polígono por piso; o piso
  ativo acende a dourado. Polígonos por fração na axonometria são opcionais
  (`axonometrica.fracoes`) e ficam desligados até se confirmar que fachada
  corresponde a que lado das plantas.
- Por baixo: planta vetorial do piso com a fração acesa e a etiqueta escura
  «C · Disponível».
- À direita: «Escolha o piso», «Escolha uma residência» (grelha de botões) e
  «Residência selecionada» (letra enorme, estado, dados, «Ver planta ↗»,
  «Pedir informação ↗», WhatsApp com a Inês ou o Carlos).

## Formulário (secção `#contacto`)

4 passos (Sobre si · O seu contacto · A sua casa ideal · Uma nota pessoal),
barra de passos e «Passo 01 de 04», campos com rótulo em maiúsculas e linha
por baixo, escolhas em pílulas retas (rádios nativos). Mesmo Apps Script.

## Imagens

- AVIF + WebP com `srcset` (`{% imagem %}` no gerador), `loading="lazy"` fora
  do topo, `alt` descritivo.
- Renders: legenda «Imagem ilustrativa, não contratual.» Fotografias: só as
  editadas pelo Lourenço (`referencia-v3/imagens/foto-*.jpg`), legenda com o
  lugar (e mês e ano quando os tivermos).
- Sem cantos arredondados.

## Movimento

Aparecimento ao rolar (`data-revelar`), zoom lento no hero, abertura do menu
em cortina. Tudo desligado com `prefers-reduced-motion`.

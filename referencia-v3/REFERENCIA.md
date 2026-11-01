# OceanView 2 · Site v3 — referência Bellevue Cascais

Brief para o Claude Code. Escrito a 01/11/2026 a partir da análise do site de referência no browser.
Referência suprema: **https://bellevuecascais.com/pt/** (Re Studios). O objetivo é que o OceanView 2 tenha o mesmo nível de luxo, calma e exclusividade: mesma lógica de páginas, de menu, de ritmo, de botões e do explorador de residências. **Não copiar** texto, imagens, código, logótipos nem os ficheiros de letra deles; copiar a linguagem.

---

## 1. O que o Bellevue faz (observado)

**Estrutura (multi-página, PT e EN em `/pt/` e `/`):**
Início · Projeto · Apartamentos · Localização · Galeria · Vídeo · Contactos (âncora `#form` em todas as páginas).

**Cabeçalho:** só o emblema do logótipo à esquerda; à direita `EN`, botão retangular fino `CONTACTE-NOS` e ícone de menu (três linhas). Transparente sobre o hero, sólido ao descer.
**Menu:** abre em ecrã inteiro, links grandes em maiúsculas (INÍCIO, PROJETO, APARTAMENTOS, LOCALIZAÇÃO, GALERIA, VÍDEO, CONTACTOS), email e telefone em baixo, e pequenos atalhos “Localização ↗ / Projeto ↗ / Apartamentos ↗”.

**Início (por ordem):**
1. Hero em vídeo (`intro.mp4`) com o nome do empreendimento enorme ao centro e “PRIME LUXURY APARTMENTS · CASCAIS” por baixo; indicação “SCROLL”.
2. Bloco de abertura: título gigante em duas linhas (“EXTRA / ORDINARY”), um parágrafo curto, dois CTA: link de texto “EXPLORAR O PROJETO ↗” e botão cheio “ENTRE EM CONTACTO ↗”; imagem grande à direita.
3. Faixa escura (castanho) com 5 características com ícone de linha, separadas por linhas verticais finas (“Condomínio de luxo · Apartamentos T2 a T4 · Piscinas · Ginásio · Parque privado”), e título “LUXO EM CADA DETALHE”.
4. “CONFORTO INTEGRADO”: imagem grande a toda a altura de um lado, texto do outro, dois CTA.
5. Explorador de residências resumido (3 linhas + “VER MAIS”).
6. Localização: citação grande entre aspas + parágrafo + “EXPLORAR CASCAIS ↗”, com vídeo de pôr do sol (`sunset.mp4`).
7. Contacto “UMA NOVA VIDA ESPERA-O” com formulário em **4 passos** (01 Sobre si · 02 O seu contacto · 03 A sua casa ideal · 04 Uma nota pessoal), barra de passos, “PASSO 01 DE 04”, título “VAMOS CONHECER-NOS.”, campos com rótulo em maiúsculas, botão “CONFIRME O SEU INTERESSE ↗”.
8. Rodapé: logótipos do promotor e comercialização, email, redes, Privacidade · Cookies · Disclaimer, crédito do estúdio.

**Apartamentos:** hero com título; tipologias em cartões com imagem (Penthouse / Terrace / Garden, uma frase cada); “UM OLHAR DE LUXO” (imagem e frase); **explorador** (ver 3); tabela completa (fração, tipo, tipologia, área interior, exterior, total, estado, `Ver` → PDF da planta); “VER BROCHURA ↗”.

**Projeto / Localização:** páginas curtas e editoriais — título grande, 2 ou 3 blocos imagem + texto, CTA para Apartamentos e Contacto, formulário no fim.
**Galeria:** só título e grelha de imagens com visualizador.

**Linguagem visual:**
- Cores: creme `#F2EDE4` (fundo), areia `#E7DDCC` e `#D9C8A8` (secundárias), castanho `#59473B` (secções escuras, botões cheios, texto).
- Letras: display fina de alto contraste (Accent Graphic Light) para títulos enormes em maiúsculas; grotesca leve (Neue Haas Display Light) para texto e rótulos com espaçamento largo. **Ambas comerciais: não usar.**
- Botões retangulares de linha fina (não pílulas), texto em maiúsculas espaçadas e seta ↗. Etiquetas de estado em caixa preta (“VENDIDO”) ou contorno (“DISPONÍVEL”).
- Muito espaço, poucas palavras, imagens enormes sem cantos arredondados, linhas finas como separadores, aparecimento suave ao fazer scroll.

## 2. Tradução para o OceanView 2

**Não é o Bellevue com outro nome.** Mantém-se a identidade OceanView 2 (logótipo Vigia em `referencia-v3/logo/`, azul oceano `#0F2E4C`, sol `#C98E45`) com a linguagem Bellevue:

| Bellevue | OceanView 2 |
| --- | --- |
| creme `#F2EDE4` | creme `#F2EEE7` (fundo) |
| areia `#E7DDCC` / `#D9C8A8` | areia `#E6DED0` / pedra `#CFC2AA` (linhas, blocos secundários) |
| castanho `#59473B` (secções escuras, botões) | azul oceano `#0F2E4C` |
| — | dourado `#C98E45` só em pormenores (o sol, filetes, estado “Reservado”) |

**Letras:** fazer primeiro uma página de teste com 3 pares e mostrar ao Lourenço antes de avançar. Sugestões livres (OFL, alojadas no site): títulos em **Italiana** ou **Cormorant Garamond Light** ou **Marcellus**; texto em **Archivo Light/Regular** (já é a letra da marca, do book e do logótipo) ou **Inter Tight Light**. O logótipo continua em Archivo Expanded (já está em vetor, não redesenhar).

**Botões:** passam de pílula para retangulares finos, como no Bellevue. É uma mudança intencional.

## 3. O explorador de residências (peça principal)

No Bellevue, o “modelo 3D” não é 3D: é **uma imagem axonométrica branca do edifício** (`Upscaled_Diagram.jpeg`) com **sobreposições SVG** por bloco e por fração, que acendem ao passar o rato e ao selecionar na lista. O Lourenço cola a captura do explorador do Bellevue na conversa (não fica no repositório, que é público).

Layout: imagem grande à esquerda com a fração selecionada assinalada (etiqueta preta “A.1.1 VENDIDO”); à direita “ESCOLHA O EDIFÍCIO” (cartões com mini planta), “ESCOLHA UMA RESIDÊNCIA” (grelha de botões com código, tipo e estado), e “RESIDÊNCIA SELECIONADA” (código enorme, estado, tipologia, piso, área total, estacionamento, “VER PLANTA”).

**No OceanView 2 (um só edifício):**
- “ESCOLHA O PISO”: Piso 0 · Piso 1 · Piso 2 · Sótão (em vez de blocos).
- **Fase 1, já possível:** a imagem principal é a **planta vetorial do piso** (`referencia-v3/explorador/piso-*.svg`) com os **polígonos clicáveis de cada fração** (`referencia-v3/explorador/fracoes-poligonos.json`, coordenadas no viewBox de cada SVG). Hover e seleção acendem a fração (preenchimento suave + contorno), com sincronia nos dois sentidos com a lista. Por cima, uma miniatura da fachada de dia com o piso ativo assinalado por uma faixa (só pisos, não frações, porque não temos o mapeamento exato das frações na fachada).
- **Fase 2, quando houver:** substituir a imagem principal por uma **axonométrica branca do edifício** pedida ao arquiteto/promotor (sai do mesmo modelo 3D dos renders), com polígonos por fração desenhados sobre ela. A estrutura do componente tem de permitir esta troca sem refazer o resto.
- Painel “RESIDÊNCIA SELECIONADA”: fração (letra enorme), estado, tipologia, piso, área bruta privativa, área total, estacionamento (14 m² de C a L; na A e B “—”), botões “VER PLANTA ↗” (PDF da fração já em `assets/docs/plantas/`) e “PEDIR INFORMAÇÃO ↗” (formulário com a fração preenchida).
- Estados: Disponível · Reservado · Vendido, a partir de `data/fracoes.json` (hoje todas disponíveis).

## 4. Páginas do OceanView 2

PT em `/` e EN em `/en/` (como hoje). Todos os números vêm de `data/fracoes.json` e dos dados de lançamento; nada escrito à mão.

1. **Início** — hero com o nome enorme e “CONSOLAÇÃO · PENICHE”. Vídeo quando o editor entregar o institucional; até lá, fachada de dia em ecrã inteiro com zoom lento (não usar fotografias de drone sem o Lourenço indicar quais). Abertura · faixa azul com 5 características (12 apartamentos · T1, T2 e T2+2 · Estacionamento em cave · Classe energética A+ · Praia a 5 minutos a pé) · “O projeto” · explorador resumido · localização com citação · contacto em 4 passos.
2. **Projeto** — conceito, arquitetura (“Linhas simples. Maré de luz.” + texto aprovado), interiores (sala, quarto, casa de banho), esboço do arquiteto, construção NS Construções e promotor NS RMA (logótipos quando chegarem).
3. **Apartamentos** — tipologias T1 · T2 · T2+2 em cartões com imagem e frase; explorador completo; tabela completa com `Ver planta`; “Tabela de valores (PDF)” e “Plantas (PDF)”.
4. **Localização** — Consolação e Peniche com os textos da Inês (`textos-cliente.md`: Consolação; Peniche — surf, Berlengas, história e cultura, gastronomia, golfe), distâncias (5 min a pé · 10 · 15 · 50 min, de `dados-lancamento.json`), mapa/link Google Maps, fotografias editadas do Lourenço (`referencia-v3/imagens/foto-*.jpg`).
5. **Galeria** — renders e fotografias editadas, grelha com visualizador.
6. **Vídeo** — só quando houver vídeo; até lá não aparece no menu.
7. **Contactos** — secção no fim de todas as páginas (âncora `#contacto`).
8. Política de privacidade (PT/EN) e cookies, como hoje.

## 5. Regras que não podem mudar

- Domínio `oceanview2.pt` (CNAME), GitHub Pages, publicação pelo workflow atual.
- Formulário ligado ao **mesmo Apps Script** (`FORM_URL` em `config.js`). Se os campos mudarem com os 4 passos, atualizar `formulario/Codigo.gs` e dizer ao Lourenço que tem de publicar uma nova versão no Apps Script (o URL não muda). O campo da fração (“Pedir informação” de uma fração) tem de chegar à folha.
- Botões de WhatsApp com escolha entre Inês e Carlos; menções obrigatórias no rodapé: IAD Portugal · AMI 11220 e Classe energética A+.
- Banner de cookies com consentimento antes de GA4/Meta; política de privacidade aprovada (texto não muda).
- Dados pessoais de `dados-lancamento.json` (gitignored) continuam fora do git; `ferramentas/preencher.py` continua a funcionar, ou é substituído por algo equivalente e documentado.
- Decisões dos clientes em vigor: distâncias 5/10/15/50 min; todas as cozinhas em open space; alpendres nas áreas; construtor NS Construções (sem o nome do arquiteto); estacionamento 14 m² de C a L; textos aprovados de 21/10 (hero, O projeto, Frações e valores, Arquitetura, Localização, Viver aqui, Próximos passos).
- Os textos do `textos-cliente.md` servem para Projeto e Localização. **As listas de divisões e áreas desse documento têm erros: não usar** (as áreas vêm do JSON e das plantas).
- SEO: um `title`/`description` por página, `hreflang` PT/EN, sitemap, OG por página. Lighthouse ≥ 90.
- Acessibilidade: contraste AA, foco visível, explorador utilizável com teclado (lista de botões), `prefers-reduced-motion` desliga zooms e animações.

## 6. Como trabalhar

1. Ramo `v3`; o site publicado não mexe até aprovação.
2. Primeiro: página de teste de letras + componente de botões + cabeçalho/menu. Mostrar.
3. Depois: Início e Apartamentos com o explorador (fase 1). Mostrar.
4. Depois: Projeto, Localização, Galeria, EN.
5. Antes de juntar ao `main`: testes em telemóvel e computador, formulário de ponta a ponta, Lighthouse, e lista do que mudou.

## 7. O que esta versão substitui no CLAUDE.md

A v3 substitui o sistema visual da v2/v2.1 (`docs/DESIGN.md`): saem as pílulas, os cantos arredondados, o fundo `#F5F5F1` e a regra de uma só família de letra. O tom pode ser mais evocativo, como nos textos aprovados da Inês (que usam «exclusivo»), mas continua a regra de não inventar dados nem afirmações. Tudo o resto do CLAUDE.md mantém-se (dados, formulário, cookies, menções legais, fotografias só editadas pelo Lourenço). No fim, atualizar o CLAUDE.md e o `docs/DESIGN.md` com o sistema v3.

## 8. Materiais nesta pasta (`referencia-v3/`, só no ramo `v3`, não se publica)

- `logo/` — logótipo em SVG e PNG (horizontal, vertical, símbolo; azul e branco).
- `explorador/piso-0.svg`, `piso-1.svg`, `piso-2.svg`, `sotao.svg` — plantas vetoriais por piso; `fracoes-poligonos.json` — polígonos das frações em cada piso.
- `textos-cliente.md` — textos da Inês (book): Consolação, Peniche, interiores.
- `imagens/` — fotografias editadas pelo Lourenço (`foto-1` a `foto-7`, 3400 px; as únicas fotografias que se podem usar) e renders do promotor (fachada de dia e de noite, sala, quarto, casa de banho) e o esboço do arquiteto. A pasta `material/` não está no GitHub (está no `.gitignore`): usar esta.
- Já no repositório: versões otimizadas em `assets/img/`, PDFs das plantas em `assets/docs/plantas/`, pré-visualizações das plantas em `assets/img/plantas/`, tabela de valores e “Frações e plantas” em `assets/docs/`.

## 9. Em falta (pedido aos clientes)

- Axonométrica branca do edifício (para a fase 2 do explorador) e renders em alta resolução.
- Vídeo institucional (para o hero e a página Vídeo).
- Logótipos em vetor de IAD, NS RMA e NS Construções.
- Decisão: os preços continuam visíveis no site ou passam a “sob consulta”? Até haver decisão, manter como está, com uma opção no JSON para esconder.

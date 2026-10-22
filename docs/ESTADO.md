# Estado do site OceanView 2

Última atualização: 2026-10-22

## Feito

### Plantas por fração (2026-10-22)

- `data/fracoes.json`: `planta_pdf` e `planta_img` em cada fração
  (`assets/docs/plantas/oceanview2-fracao-*.pdf` e
  `assets/img/plantas/fracao-*.webp`). Conferido: cada imagem e cada PDF é o
  da fração certa; os 12 PDFs têm uma página e abrem; o conjunto
  (`OceanView2_Fracoes_e_Plantas.pdf`) tem 15 páginas.
- **«Ver planta»** em cada linha (tabela e cartões do telemóvel) abre um
  `<dialog>` com a planta (alt «Planta da fração X»; a imagem só é pedida ao
  abrir), «Abrir PDF» (nova janela, `download`) e «Pedir condições», que fecha,
  desce até ao formulário, põe o foco no Nome e escolhe a tipologia, com a
  mensagem «Gostava de receber as condições da fração X.» (frase minha, a
  validar). Esc, ✕ e clicar fora fecham; o foco volta ao botão da linha.
  Testado com teclado. A imagem (1075 px) fica nítida: é mostrada a cerca de
  470 px no computador e 316 px no telemóvel.
- **«Plantas em PDF»** ao lado de «Tabela em PDF».
- **Inglês**: «See floor plan», «Open PDF», «Request details», «Floor plans
  (PDF)», com «(in Portuguese)» nos três PDFs (e `hreflang="pt"`).
- **Arquitetura**: «Ver plantas» / «See floor plans» leva a Frações e valores
  e abre a lista.
- Sem barra horizontal a 360, 390, 430 e 1440 px, com a lista aberta.

### Alterações dos clientes (2026-10-21)

- **Tempos novos** (Inês e Carlos): praia 5 min a pé, Peniche 10, Óbidos 15,
  Lisboa 50 min de carro, no `dados-lancamento.json` e aplicados pelo
  `preencher.py` no hero, O projeto (número e texto), Localização (título,
  texto e lista), Viver aqui, Para quem e descrição da página, nas duas
  línguas. Nota «Tempos medidos em…» / «Times measured…» retirada.
- **Marcadores de tempo com a unidade lá dentro** (`data-unidade=" minutos"`,
  `" min"`, `"-minute"`, `" minutes"`): o `preencher.py` escreve «50 minutos»
  ou «1h15» conforme o valor, sem mexer no HTML. Antes, «Lisboa — 1h15 de
  carro» passaria a «50 de carro».
- **Textos novos** em PT, com tradução para inglês britânico: subtítulo do
  hero (garagem / garage parking), O projeto, Frações e valores (dois
  parágrafos), Arquitetura («Linhas simples. / Maré de luz.» — «Simple
  lines. / A tide of light.»), Localização, Viver aqui (Praia — A 5 minutos a
  pé · Lisboa — A 50 minutos de carro · Estacionamento — Interior e privado;
  fotografias iguais) e Próximos passos. `content/landing.*.md` atualizados.
- Verificado em local: 0 `.todo` nas quatro páginas; nenhum «6 min»,
  «6-minute», «18 min», «1h15», «Seis minutos» nem «six-minute» em PT ou EN;
  sem barra horizontal a 360, 390, 430 e 1440 px.

### Lançamento no domínio (2026-10-20)

- **No ar em <https://oceanview2.pt/>** (e `/en/`, `/privacidade.html`,
  `/en/privacy.html`), sem `noindex`.
- `preencher.py --verificar` deu «PRONTO para lançar» (só os IDs do GA4 e da
  Meta como recomendados). Corrido completo: 0 marcadores `.todo` nas quatro
  páginas (o portão do `grep` devolve vazio), domínio em todos os endereços
  absolutos, data da política fixada em 20/10/2026, `robots.txt`,
  `sitemap.xml` (quatro páginas com `hreflang`), QR codes em `qr/` e `CNAME`.
- Revisto em local: rodapé (IAD Portugal, AMI 11220, os dois agentes com
  telefone e email clicáveis, A+), tempos em todos os sítios, Google Maps,
  resumo e lista de frações iguais ao JSON, três botões de WhatsApp com a
  escolha, frase da Arquitetura sem marcador, políticas com prazo, emails e
  data.
- **Cor do logótipo #0F2E4C** («Azul oceano»): símbolo e palavra no rodapé e
  nos cabeçalhos das políticas e da 404 (variável `--logo`); branco no hero.
  Fundo do favicon e do ícone do iPhone regenerados. A imagem de partilha não
  mudou: o logótipo está sobre fotografia, por isso fica branco.
- Commit «Lançamento: dados finais e domínio» (`3efcd54`). Actions: run
  [39445047302](https://github.com/lourenco-grandela/oceanview2-site/actions/runs/39445047302),
  «Modo: DOMÍNIO (oceanview2.pt)», verde.
- **DNS** (PTisp, `ns5`/`ns6.mydnspt.net`): os quatro A `185.199.108–111.153`
  e `www` CNAME `lourenco-grandela.github.io.`. **Sem registos AAAA** (IPv6):
  o site funciona, mas o `docs/LANCAMENTO.md` recomenda os quatro.
- **GitHub Pages**: Custom domain `oceanview2.pt` definido pela API,
  certificado `approved`, **Enforce HTTPS ligado**.
- **Verificações do passo 8**:
  - `https://oceanview2.pt/` abre com certificado válido.
  - `https://www.oceanview2.pt/`, `http://www.oceanview2.pt/` e o antigo
    `lourenco-grandela.github.io/oceanview2-site/` levam a
    `https://oceanview2.pt/` (o `/en/` também).
  - `https://oceanview2.pt/qualquer-coisa` e `/en/qualquer/coisa`: 404 com a
    página bilingue (`<base href="/">`).
  - Sem `noindex` nas landing pages; `robots.txt` e `sitemap.xml` abrem.
  - `http://oceanview2.pt/` → 301 para `https://oceanview2.pt/` (demorou
    cerca de 20 minutos a propagar depois de ligar o Enforce HTTPS).

### Dados dos clientes aplicados (2026-10-19)

- **Área total na lista de frações**: a coluna «Área» usa o `area_total_m2`
  do `data/fracoes.json` (nas frações I a L inclui o sótão: 166,70 · 155,25 ·
  153,20 · 165,90 m²); a coluna Sótão saiu, na tabela e nos cartões do
  telemóvel. Cartão T2+2: «4 apartamentos · 153 a 167 m², com sótão» (EN
  «…, including attic»). Nota da lista com a frase nova do `content/`. O PDF
  novo da tabela confere com o JSON.
- **WhatsApp com os dois agentes**: `whatsapp_contactos` passa para o
  `config.js` (`whatsappContactos`). Com dois contactos, os botões do hero,
  dos Próximos passos, da barra do telemóvel e da mensagem de erro do
  formulário abrem um `<dialog>` com «Inês Caiado» e «Carlos Lopes» (nome e
  número), cada um com a sua ligação `wa.me` e a mensagem pré-preenchida.
  Testado só com teclado: Enter e Espaço abrem, o foco vai para o primeiro
  contacto, Tab passa ao segundo, Esc fecha e o foco volta ao botão de origem;
  clicar fora também fecha. Leitores de ecrã: os botões têm `role="button"` e
  `aria-haspopup="dialog"`; cada contacto diz «Falar com … por WhatsApp (abre
  numa nova janela)».
- **Botão de WhatsApp de volta ao hero** («Falar por WhatsApp»), ao lado de
  «Registar interesse» e «Ver frações e valores». Está visível de origem:
  aparecer depois do JavaScript fazia saltar o hero (CLS 0,045).
- **Rodapé**: «IAD Portugal · AMI n.º 11220», os dois agentes com telefone e
  email clicáveis (lista `comercializacao.agentes`, escrita pelo
  `preencher.py`), classe energética A+.
- **Políticas de privacidade novas** na `privacidade.html` e na
  `en/privacy.html`, com o texto do `content/` (responsáveis: Inês Caiado e
  Carlos Lopes, com email e telefone; frase da Google fora da UE). Prazo de 24
  meses e emails dos direitos vêm do `dados-lancamento.json`. «Última
  atualização» fica por preencher até ao lançamento.
- **`preencher.py`**: já não pede NIF, morada nem os outros campos
  `responsavel_*` (os responsáveis estão no texto da política); aceita vários
  emails separados por «;» (`email_direitos`), a lista de agentes e os
  contactos de WhatsApp. Testado primeiro numa cópia e depois corrido no site.
  **Domínio não mexido**: sem `CNAME`, `robots.txt` nem `sitemap.xml`.
  `texto_aprovado` continua `false`.
- **Diálogos centrados**: o `* { margin: 0 }` tirava a centragem nativa do
  `<dialog>` (também afetava as definições de cookies, que abriam no canto).

### Qualidade (2026-10-19)

Lighthouse 13.5, servido em local num subcaminho (sem `noindex`):

| Página | Telemóvel | Desktop |
| --- | --- | --- |
| `index.html` | 97 / 100 / 100 / 100, CLS 0 | 100 / 100 / 100 / 100 |
| `en/index.html` | 96 / 100 / 100 / 100, CLS 0 | 100 / 100 / 100 / 100 |
| `privacidade.html` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `en/privacy.html` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

Sem barra horizontal a 360, 390, 430 e 1440 px nas quatro páginas (lista de
frações aberta).

### Versão 2.1 da landing page (2026-10-16)

O design da v2 mantém-se; mudou só o que a v2.1 pede (`docs/DESIGN.md`,
«Versão 2.1»; alvo `material/design-v2-1/referencia-v2-1*.html`), nas duas
línguas, com os textos v2.1 do `content/` tal como estão.

- **Hero com a fachada de dia** (`fachada-dia` em AVIF/WebP a 640, 1024 e
  1536 px), `object-position: 50% 45%`, véu e título da v2.1
  (`clamp(46px, 6.6vw, 98px)`, `line-height: .9`). Botões «Registar
  interesse» e «Ver frações e valores». Navegação: O projeto · Frações e
  valores · Viver aqui · Localização · Contacto.
- **Cartões de tipologia com valores calculados do `data/fracoes.json`**:
  número de apartamentos, áreas (arredondadas) e «desde» saem do JSON
  (1 apartamento · 56 m² · 250.000 €; 7 · 75 a 97 m² · Desde 295.000 €;
  4 · 82 a 97 m² e sótão · Desde 490.000 €). Confere com o `content/`.
- **Frações e valores (nova)**, entre Tipologias e Arquitetura: resumo sempre
  visível (12 disponíveis · 250.000 € · T1, T2 e T2+2, calculados do JSON),
  «Tabela em PDF» (→ `assets/docs/OceanView2_Tabela_de_Valores.pdf`, conferido
  linha a linha com o JSON) e «Ver as 12 frações», que abre a lista no mesmo
  cartão (`aria-expanded`, `aria-controls`; passa a «Fechar a lista»). **A
  lista começa fechada.** Filtros gerados dos pisos do JSON (Todas · Piso 0 ·
  Piso 1 · Piso 2 · T2+2), contagem anunciada a leitores de ecrã, tabela acima
  de 700 px e cartões abaixo. Nada escrito à mão: se o JSON falhar, a secção
  esconde-se.
- **«Pedir planta»** leva ao formulário com a tipologia escolhida e a
  mensagem «Gostava de receber a planta da fração K.» (editável; só se escreve
  com a caixa vazia). A folha não ganhou colunas: o contrato do formulário não
  mudou.
- **Tempos e Google Maps no `dados-lancamento.json`** e aplicados pelo
  `preencher.py` em todos os sítios (hero, O projeto, Localização, Viver aqui,
  Para quem, descrição da página). O script passou a escrever 75 min como
  «1h15», a data da medição só com mês e ano («outubro de 2026» /
  «October 2026», formato `AAAA-MM`) e o «desde» da descrição a partir do
  `data/fracoes.json`.
- **Localização** com a foto-1 (Consolação vista do ar), «Consolação,
  Peniche» e «Abrir no Google Maps» por cima. Sem mapa incorporado.
- **Viver aqui (nova)**: Praia (foto-5), Surf (foto-4), Perto de tudo
  (foto-3), recortadas em 4:5 pelo `gerar-imagens.py` (lista `FOTOS`), em
  AVIF e WebP com `srcset`. **Sem legenda**, a pedido do Lourenço.
- **Para quem (nova)**: três cartões brancos com número, título e frase.
- **Barra fixa no telemóvel** (abaixo de 900 px): aparece depois do hero e
  esconde-se com o formulário à vista; «WhatsApp» só aparece com número.
- **Removido**: o seletor de frações com ficha da v2 (HTML, CSS e JS),
  substituído pela lista; a nota «Preços sob consulta» das Tipologias.
- **Imagem de partilha** continua a da fachada ao anoitecer: experimentei a de
  dia e o título branco lê-se mal sobre a fachada clara.

### Qualidade da versão 2.1 (2026-10-16)

Lighthouse 13.5, servido em local num subcaminho (sem `noindex`):

| Página | Telemóvel | Desktop | CLS |
| --- | --- | --- | --- |
| `index.html` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `en/index.html` | 96 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |

(LCP no telemóvel simulado: 2,6 s, a imagem do hero.) Testado a **360, 390,
430 e 1440 px** nas duas línguas, com a lista aberta: sem barra horizontal.
Testados no browser: abrir e fechar a lista, filtros, contagem, «Pedir
planta» (tipologia e mensagem), barra fixa e valores em inglês (€250,000,
78.80 m², Ground floor).

### Site fechado do nosso lado (2026-10-15)

- **Um só ficheiro para os dados em falta: `dados-lancamento.json`** (fora do
  git, porque vai ter os emails da linha AVISAR, que são dados pessoais dos
  clientes; o repositório é público). Cada bloco diz quem dá o quê.
- **`ferramentas/preencher.py`** lê esse ficheiro e:
  - valida os formatos (email, NIF com dígito de controlo, AMI, classe
    energética, domínio, datas, minutos, ligação do Maps, IDs do GA4 e da
    Meta) e, se algum estiver mal, pára sem mexer em nada;
  - preenche os 19 marcadores de cada landing page e os 11 de cada política
    (cada um é um `<span data-dado="chave">`, que fica no HTML sem a classe
    `.todo`, por isso o script pode correr outra vez com um valor corrigido),
    a descrição da página, o `config.js` e o domínio em todos os endereços;
  - gera o `robots.txt`, o `sitemap.xml` (quatro páginas, com `hreflang`) e
    os QR codes com UTM em `qr/` (lona, brochura, brochura em inglês; SVG e
    PNG, correção de erros nível Q);
  - **só escreve o `CNAME` quando não falta nada obrigatório**, e é o `CNAME`
    que faz o workflow publicar no domínio sem `noindex`;
  - mostra a linha AVISAR para colar no Apps Script, sem a gravar em
    ficheiro nenhum;
  - `--verificar` diz o que falta, quem dá e quantos `.todo` ficam.
- **Testado numa cópia, com dados fictícios** (nunca no repositório): dados
  mal escritos → recusa sem alterar nada; dados parciais → preenche o que há,
  sem `CNAME`; dados completos → 0 `.todo`, `CNAME`, QR codes, `robots.txt` e
  `sitemap.xml` certos; segunda passagem com um valor mudado → atualizado nos
  seis sítios e na descrição.
- **Workflow com dois modos**: sem `CNAME`, pré-visualização com `noindex`;
  com `CNAME`, domínio com `robots.txt`, `sitemap.xml` e sem `noindex` — e
  recusa publicar se houver algum `.todo` visível. Simulado localmente nos
  dois modos e no caso de recusa.
- **`en/privacy.html`** a partir do `content/privacidade.en.md`, no novo
  design, com `hreflang` entre as duas políticas; a landing inglesa, o
  consentimento e o banner de cookies ligam-lhe. A troca PT/EN da política
  portuguesa leva à inglesa.
- **Página 404 bilingue** (`404.html`). O GitHub Pages serve o mesmo ficheiro
  a qualquer profundidade, por isso os caminhos partem de um `<base>` que o
  workflow ajusta; os SVG estão em linha para não dependerem do `<base>`.
  Os textos curtos da 404 («Página não encontrada.» / «Page not found.») são
  meus.
- **Mensagem com `maxlength="500"` e contador** (o corte do script da folha).
  O contador está ligado à caixa por `aria-describedby` e só é anunciado a
  leitores de ecrã quando faltam 50 caracteres e no limite.
- **`docs/apps-script.gs` apagado.**
- **`docs/LANCAMENTO.md`**: o dia do lançamento passo a passo.
- **Domínios (whois, 15/10/2026): `oceanview2.pt`, `oceanview2.com` e
  `oceanviewconsolacao.pt` estão todos livres** («No Match» na DNS.PT e na
  Verisign, confirmado também na pesquisa da DNS.PT). Não foram registados:
  o registo é em nome dos clientes.
- **Pré-visualização no ar**: <https://lourenco-grandela.github.io/oceanview2-site/>,
  com `noindex`.

### Qualidade das páginas novas (2026-10-15)

| Página | Telemóvel (sem `noindex`) |
| --- | --- |
| `en/privacy.html` | 100 / 100 / 100 / 100 |
| `404.html` | 100 / 100 / 100 / — (tem `noindex` de propósito) |
| `index.html` (pré-visualização) | 97 / 100 / 100 / 66 — o 66 é o `noindex` |

### Versão 2 da landing page (2026-10-14)

- **`index.html` e `en/index.html` reconstruídos com o design da versão 2**
  (`docs/DESIGN.md`, alvo `material/design/referencia.html`), pela ordem da
  referência: hero sobre fotografia, O projeto com os quatro números, imagem
  grande da sala, Tipologias (três cartões), Frações (escondida), Arquitetura
  com o esboço, Localização, Próximos passos, Registo de interesse e rodapé.
- **Textos do `content/landing.pt.md` e do `content/landing.en.md` (versão 2)
  aplicados tal como estão.** A versão inglesa deixou de ter marcadores de
  «texto em falta»: só ficam os dados que faltam nas duas línguas.
- **`privacidade.html` passou para o novo design** (cabeçalho, rodapé e
  cookies); o texto da política não mudou.
- **Mantido**: formulário com o contrato do `docs/FORMULARIO.md`, UTM,
  WhatsApp (escondido sem número), banner e definições de cookies, `hreflang`,
  JSON-LD, salto para o conteúdo, rótulos e erros acessíveis, e os marcadores
  `.todo` onde faltam dados.
- **Opções do formulário em pílulas com `aria-pressed`** (tipologia,
  finalidade, prazo). Cada grupo escreve num campo escondido com o mesmo nome
  de antes, por isso o envio não mudou. Na página inglesa os rótulos são
  ingleses e os valores enviados continuam portugueses.
- **Os cartões de tipologia, a ficha da fração e «Registar interesse» levam ao
  formulário com a tipologia já escolhida.**
- **Seletor de frações pronto e escondido.** O `principal.js` lê o
  `data/fracoes.json` e só mostra a secção quando as 12 frações tiverem
  tipologia (T1, T2 ou T2+2). Nada está escrito à mão: tipologia, quartos
  (derivados da tipologia), área, piso, estado em palavras e preço vêm do JSON;
  `preco: null` dá «Preço sob consulta» e um valor em falta dá «—». Testado
  numa cópia temporária com dados de teste (que não entraram no repositório):
  aparece, muda de ficha, mostra «Reservada»/«Vendida» em palavras e passa a
  tipologia ao formulário. Com o JSON atual (tudo a `null`) fica escondida.
- **Archivo regenerado** com `wght` 400–800 e `wdth` 96–125 (78 KB, um só
  ficheiro). **Newsreader retirado** do site, do CSS e da pasta `fonts/`
  (antes eram 147 KB entre os dois). O tipo de recurso foi medido de novo:
  `size-adjust: 97.7%` para o Helvetica Neue.
- **Caminhos relativos em tudo, fontes incluídas** (`fonts/...` no `preload`,
  `../../fonts/...` no CSS). Testado servido num subcaminho
  (`/oceanview2-site/`): fonte carregada, nenhum pedido com erro.
- **Imagens geradas** pelo `ferramentas/gerar-imagens.py` a partir de
  `material/`: renders do promotor (fachada ao anoitecer, quarto, sala) em
  AVIF e WebP a 640, 1024 e 1536 px com `srcset`/`sizes`, `width`/`height`,
  `loading="lazy"` fora do hero e `alt` descritivo; esboço em WebP sem perdas
  (42 KB); imagens de partilha em português e inglês (1200 × 630, fachada ao
  anoitecer com o título e a nota de imagem ilustrativa). Os SVG provisórios e
  a imagem de partilha antiga saíram. **Não há `material/fotos/`**, por isso o
  hero usa a `fachada-noite.png` e a Localização tem o bloco de espera.
- **Favicon com o símbolo Vigia** (SVG, PNG de 32 px e ícone do iPhone de
  180 px: fundo Atlântico, desenho branco, sol `--luz`).
- **Pré-visualização preparada**: `.github/workflows/pre-visualizacao.yml`
  publica só os ficheiros do site no GitHub Pages e acrescenta `noindex,
  nofollow` às três páginas no momento da publicação (os ficheiros do
  repositório ficam limpos para o lançamento). Exceção à regra dos TODO
  aprovada só para esta pré-visualização. Passos no `README.md`.

### Qualidade medida (2026-10-14)

Lighthouse 12, servido em local num subcaminho, com as imagens verdadeiras:

| Página | Telemóvel | Desktop | CLS |
| --- | --- | --- | --- |
| `index.html` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `en/index.html` | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `privacidade.html` | 99 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |

(Desempenho / acessibilidade / boas práticas / SEO. LCP no telemóvel simulado:
2,6 s, a imagem do hero.)

- Testado a **360, 390, 430 e 1440 px**: sem barra horizontal em nenhuma, e o
  cabeçalho do telemóvel (marca + «Registar interesse») cabe sem quebrar.
- Formulário testado no browser **com o envio interceptado** (não foi gravado
  nada na folha): sem consentimento é recusado e o foco vai para a caixa; com
  consentimento segue o `POST` com os 13 campos do contrato, valores em
  português a partir da página inglesa, UTM traduzidas para `origem`, `meio`
  e `campanha`, e aparece a mensagem de sucesso; com `{"ok":false}` aparece o
  erro e o botão volta.
- **Não foi feito um envio real** à aplicação web nesta versão. O contrato não
  mudou, mas o teste de ponta a ponta (linha na folha e email) tem de ser
  repetido na pré-visualização antes do lançamento.

### O formulário (2026-09-21)

- `FORM_URL` no `config.js`, a apontar para a aplicação web dos clientes.
- O `GET` ao URL devolve `{"ok":true,"servico":"OceanView 2"}`.
- O envio segue o `docs/FORMULARIO.md`: `POST` com o corpo em JSON e
  `Content-Type: text/plain;charset=utf-8`, com os campos `nome`, `email`,
  `telefone`, `consentimento`, `tipologia`, `finalidade`, `prazo`, `mensagem`,
  `origem`, `meio`, `campanha`, `pagina` e `empresa`.
- O ecrã e a folha falam línguas diferentes, e o site faz a tradução:
  `telemóvel` → `telefone`, `utm_source` → `origem`, `utm_medium` → `meio`,
  `utm_campaign` → `campanha`. Está em `montarDados()`, no `principal.js`.
- Se o browser bloquear a leitura da resposta, o envio repete-se em `no-cors`,
  como o documento manda. Uma recusa do script **não** é tratada como sucesso:
  só um erro de rede justifica a repetição.
- **Envio de teste a partir do site: resposta `ok:true`** e mensagem de sucesso
  na página. O registo ficou com o nome «TESTE — apagar».
- Também verificado que o script recusa o que tem de recusar: sem consentimento
  e sem telefone devolve `{"ok":false,"erro":"campos_em_falta"}`, e nesse caso
  a página mostra o erro com a alternativa do WhatsApp.

- Os 13 campos que o site envia batem certo, nos dois sentidos, com os que o
  `formulario/Codigo.gs` lê: nenhum campo enviado é ignorado e nenhum campo
  lido fica por enviar.
- **O formulário inglês escreve na mesma folha e nas mesmas colunas.** Os
  rótulos estão em inglês, mas os valores enviados são os portugueses
  (`Segunda habitação`, `Até 3 meses`, …) — confirmado a interceptar o envio.
  O campo `pagina` diz `/en/index.html`, por isso dá para saber de que versão
  veio cada contacto sem acrescentar colunas.

**Onde isto vive, e a quem chega.** A folha «OceanView 2 — Contactos» e a
aplicação web estão na **conta Google do Lourenço**. No
`formulario/Codigo.gs`, a linha `AVISAR` tem só
`grandelalourenco@gmail.com`: **os avisos de cada registo vão só para ele**
enquanto os emails da Inês e do Carlos não entrarem ali (passo 6 do
`docs/FORMULARIO.md`). Duas consequências, enquanto isto for assim:

- Se o Lourenço não estiver disponível, ninguém mais é avisado de um contacto
  novo. Os registos ficam na folha na mesma, mas ninguém sabe que chegaram.
- A folha tem dados pessoais de terceiros numa conta pessoal. Antes do
  lançamento é preciso decidir de quem fica a titularidade, porque é isso que a
  política de privacidade vai dizer em «Quem trata os seus dados».

## Diferenças em relação à referência

### Versão 2.1 (`material/design-v2-1/`)

1. **Véu do hero mais escuro abaixo de 900 px.** Na referência, o título e o
   subtítulo brancos caem sobre a fachada branca de dia e não têm contraste
   AA no telemóvel. No desktop fica o véu da referência.
2. **Lista de frações em cartões abaixo de 700 px** (pedido), em vez da
   tabela com deslocamento horizontal da referência.
3. **Cartões de tipologia levam ao formulário** com a tipologia escolhida
   (regra do CLAUDE.md); na referência levam a `#fracoes`.
4. **Fotografias sem legenda** (decisão de 16/10/2026), apesar de o
   `docs/DESIGN.md` pedir mês e ano.
5. **Localização com fotografia** (foto-1) em vez do bloco liso, como o
   `docs/DESIGN.md` manda quando há fotografia editada da zona.
6. **Filtro «Piso 2 · T2+2»** num só botão, como na referência (o `content/`
   lista «Piso 2 · T2+2» sem dizer se são dois).

### Versão 2 (`material/design/referencia.html`)

O que fica diferente, e porquê:

1. **Textos.** Onde a referência e o `content/` divergem, ganhou o `content/`
   (regra do projeto): botão secundário do hero «Falar por WhatsApp» em vez de
   «Ver frações»; navegação com «Tipologias» em vez de «Frações»; «Pedir
   plantas» em vez de «Ver todas as frações»; linhas dos cartões; texto da
   Arquitetura e da Localização; a linha «Baleal» saiu dos tempos; o bloco do
   mapa não tem a frase de apoio, que não está no `content/`.
2. **Sem número de WhatsApp**: o hero fica com um só botão e os Próximos passos
   com dois cartões (a meias, para não deixar uma coluna vazia). Volta tudo
   sozinho quando o número entrar no `config.js`.
3. **Frações escondida** até o `data/fracoes.json` estar preenchido.
4. **Formulário mais comprido**: o brief pede finalidade, prazo, mensagem,
   marcas de obrigatório e erros por campo, que a referência não mostra. O bloco
   escuro fica mais alto e a imagem ao lado mais recortada.
5. **Legenda «Imagem ilustrativa, não contratual» em todas as imagens de render**
   (O projeto, cartões, ficha da fração, bloco do formulário). A referência só a
   tem no hero e na sala; a regra do projeto pede-a em todas.
6. **Números no telemóvel** a 34–44 px em vez de 44: na referência, «56–253 m²»
   parte em «56–» / «253» abaixo de 440 px.
7. **Cabeçalho no telemóvel**: abaixo de 440 px a marca fica a 12 px e o botão
   mais estreito. Na referência o botão sai do ecrã a 390 px.
8. **Nitidez em ecrãs de alta densidade**: os originais têm 1536 px, por isso
   o hero e a sala ficam um pouco suaves num portátil retina (precisariam de
   2400–2800 px). Não ampliei: só se resolve com originais maiores.
9. **Troca PT/EN escondida abaixo de 900 px**, como na referência; no telemóvel
   a outra língua fica só no rodapé.
10. **Cor de erro sobre o bloco escuro** (`#F6B9AE`, 8,1:1): não está na paleta,
    que não tem nenhuma cor de erro. A mensagem tem sempre texto.

## Regra de publicação

**No domínio, nada é publicado enquanto houver marcadores `.todo` visíveis.**
Agora é automático: o `preencher.py` só escreve o `CNAME` com os dados todos,
e o workflow recusa publicar no domínio se encontrar um `.todo`. Hoje: **0 nas
quatro páginas** (20/10/2026).

Exceção aprovada a 14/10/2026: a pré-visualização no GitHub Pages, com
`noindex`, só para mostrar aos clientes.

## Em curso

- Nada do nosso lado: o que falta está abaixo.

## Falta

Tudo no `dados-lancamento.json`; `--verificar` dá a lista atualizada.

### Dos clientes

1. IDs do GA4 e do píxel da Meta (recomendado; ou tu, se gerires os anúncios).

### Do Lourenço

2. Colar a linha AVISAR no Apps Script (Inês, Carlos e Lourenço) e fazer uma
   nova implementação da aplicação web (passo 5 do `docs/LANCAMENTO.md`).
3. Teste do formulário de ponta a ponta em `https://oceanview2.pt/` e `/en/`,
   e apagar as linhas de teste da folha (passo 10).
4. Recomendado: os quatro registos AAAA no DNS da PTisp e verificar o domínio
   na conta do GitHub (registo TXT), passo 6.
5. Google Search Console: propriedade de domínio, sitemap e pedido de
   indexação (passo 9).
6. Ler os QR codes de `qr/` com o telemóvel e enviar os `.svg` à gráfica
   (passo 11).
7. Lighthouse no endereço final e teste num telemóvel real (passo 12).
8. Imagens novas, sem as ripas de madeira dos renders atuais (o hero de dia
   ainda as tem).

## Decisões (15/10/2026)

- Os renders com ripas ficam por agora, com a nota de imagem ilustrativa; o
  Lourenço vai fazer imagens novas.
- Não há originais maiores do que 1536 px.
- A cor de erro `#F6B9AE` está aprovada.
- O repositório fica público.
- O inglês está validado.
- `docs/apps-script.gs` apagado.
- `maxlength` de 500 na mensagem, com contador.
- A linha de teste da folha é apagada pelo Lourenço depois do teste de ponta a
  ponta.

## Decisões (16/10/2026)

- Fotografias de Viver aqui: foto-5 (Praia), foto-4 (Surf), foto-3 (Perto de
  tudo). Não há fotografia de surfistas: o cartão Surf leva as ondas no areal.
- Fotografias sem legenda.
- Localização com a foto-1.

## Decisões (19/10/2026)

- Áreas das frações I a L com o sótão incluído (`area_total_m2`); sem coluna
  de sótão.
- Comercialização: IAD Portugal, AMI 11220; Inês Caiado e Carlos Lopes no
  rodapé e no WhatsApp; classe energética A+.
- Responsáveis pelos dados: a Inês e o Carlos, sem NIF nem morada; 24 meses.
- Domínio `oceanview2.pt` aprovado; só se regista depois da confirmação deles.

## Perguntas

1. O `docs/DESIGN.md` ainda diz «Fotografias reais: legenda com mês e ano».
   Atualizo-o para «sem legenda», ou fica a regra para o site completo?
2. A frase do «Pedir planta» («Gostava de receber a planta da fração K.» /
   «I would like to receive the floor plan for apartment K.») é minha:
   validar no chat de projeto.
3. Em «O projeto», o número «56–253 m² · Áreas privativas totais» vem do
   `content/` e soma habitação, exterior e sótão (253 ≈ I: 97 + 86,15 +
   69,70). A lista mostra agora no máximo 166,70 m². Mantém-se o 253, ou
   passa a «56–167 m²»?
4. O botão «Falar por WhatsApp» voltou ao hero (pedido de 19/10), que fica com
   três botões; o `content/` v2.1 só lista dois. Fica assim?
5. O PDF novo da tabela tem 3,4 MB (o anterior tinha 1,6 MB). Não pesa na
   página (só descarrega quando se carrega no botão), mas no telemóvel demora.
   Peço uma versão mais leve?
6. **«Empreendimento exclusivo» / «exclusive development»** (texto de O
   projeto, pedido dos clientes a 21/10): o CLAUDE.md proíbe «exclusivo» no
   tom do site. Apliquei como pediram; confirmar se fica.
7. **Tempos sem medição**: os novos (5 a pé, 15 e 50 de carro) vêm dos
   clientes; os medidos a 15/10 eram 6, 18 e 75 (1h15). A regra do CLAUDE.md
   é «distâncias só medidas». Confirmar com eles, sobretudo Lisboa em 50 min.
8. **Viver aqui**: o título continua «Mar, surf e Lisboa à distância certa.»,
   mas o cartão Surf saiu. E, com as fotografias mantidas, o cartão Lisboa
   mostra as ondas no areal (foto-4) e o Estacionamento a Consolação vista do
   ar (foto-3). Mudar o título ou as fotografias?

9. **Áreas das plantas diferentes das do site**: a «Área total» de cada
   planta soma habitação, exterior e sótão (E 137,95 · F 101,40 · G 101,40 ·
   H 137,15 · I 252,85 · J 195,45 · K 191,70 · L 252,15 m²), mas a coluna
   «Área» do site usa o `area_total_m2` (habitação + sótão: E 97,00 ·
   I 166,70 m²…), como pedido a 19/10. Um comprador vê dois «totais»
   diferentes para a mesma fração. Qual fica? Ou muda-se o rótulo no site
   (ex.: «Área habitável»)?

## Registo

- 2026-09-20: repositório criado com o CLAUDE.md e este ficheiro.
- 2026-09-20: landing page de lançamento montada — estrutura, sistema visual,
  formulário, cookies, política de privacidade e dados das frações.
- 2026-09-21: formulário ligado à aplicação web dos clientes e testado de ponta
  a ponta (`ok:true`); textos do `content/landing.pt.md` aplicados; Lighthouse
  100/100/100/100. À espera dos contactos, das distâncias medidas, das imagens
  e do domínio.
- 2026-09-21: política de privacidade aplicada a partir do
  `content/privacidade.pt.md`, com o parágrafo «Quem pode ter acesso»
  reescrito a pedido. Publicação travada até não haver TODO visíveis.
  Confirmado, contra o `formulario/Codigo.gs`, que os 13 campos enviados batem
  certo com os que o script lê, que a data e a hora são carimbadas do lado do
  servidor e que os avisos vão só para a conta do Lourenço.
- 2026-09-21: Archivo e Newsreader passaram a ser alojados no próprio site, em
  `/fonts/`, e todas as ligações ao Google Fonts saíram. O salto de layout
  passou de 0,17 para 0 nas duas páginas.
- 2026-09-22: eixo ótico do Newsreader estreitado para 11–36 (menos 7 KB, sem
  diferença visível); texto da Localização corrigido no `index.html` e no
  `content/landing.pt.md`; versão inglesa montada em `/en/` com troca PT/EN e
  `hreflang`, à espera dos textos do `content/landing.en.md`.
- 2026-10-14: landing page reconstruída com o design da versão 2, em português
  e inglês (textos do `content/` v2), política de privacidade no novo design,
  Archivo 400–800 / 96–125 e Newsreader retirado, imagens AVIF/WebP com
  `srcset` a partir dos renders do promotor, favicon Vigia, seletor de frações
  escondido até haver tipologias, caminhos relativos e workflow de
  pré-visualização com `noindex`. Lighthouse 97–100 no telemóvel e 100 no
  desktop, CLS 0.
- 2026-10-15: site fechado do nosso lado — `dados-lancamento.json` e
  `ferramentas/preencher.py` (com `--verificar`, testado numa cópia com dados
  fictícios), workflow com modo pré-visualização / domínio, `en/privacy.html`,
  página 404 bilingue, contador de 500 caracteres, `docs/LANCAMENTO.md`,
  `docs/apps-script.gs` apagado. Domínios candidatos livres. Pré-visualização
  no ar.
- 2026-10-16: versão 2.1 — fachada de dia no hero, valores do
  `data/fracoes.json` nas Tipologias e na nova secção Frações e valores
  (recolhível, tabela/cartões, PDF), tempos e Google Maps aplicados pelo
  `preencher.py`, Localização com fotografia, Viver aqui e Para quem, barra
  fixa no telemóvel. Lighthouse 96–97 no telemóvel e 100 no desktop, CLS 0.
- 2026-10-19: dados dos clientes — área total nas frações (sem coluna de
  sótão), WhatsApp com escolha entre a Inês e o Carlos, rodapé IAD Portugal
  com os dois agentes, classe A+, políticas de privacidade novas (à espera de
  aprovação), `preencher.py` sem NIF nem morada. Domínio por registar.
- 2026-10-20: lançamento em https://oceanview2.pt/ — dados finais, política
  aprovada, logótipo #0F2E4C, `CNAME`, run em modo DOMÍNIO, Custom domain e
  Enforce HTTPS no Pages.
- 2026-10-21: alterações dos clientes — tempos 5/10/15/50, textos novos em PT
  e EN (hero, O projeto, Frações e valores, Arquitetura, Localização, Viver
  aqui, Próximos passos), nota da medição retirada.
- 2026-10-22: plantas por fração — «Ver planta» com diálogo, PDF por fração e
  PDF conjunto, «Ver plantas» na Arquitetura.

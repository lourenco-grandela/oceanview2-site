# Estado do site OceanView 2

Última atualização: 2026-10-15

## Feito

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

O que fica diferente de `material/design/referencia.html`, e porquê:

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
e o workflow recusa publicar no domínio se encontrar um `.todo`. Hoje: **19 no
`index.html`, 19 no `en/index.html`, 11 na `privacidade.html` e 11 na
`en/privacy.html`**.

Exceção aprovada a 14/10/2026: a pré-visualização no GitHub Pages, com
`noindex`, só para mostrar aos clientes.

## Em curso

- Nada do nosso lado: o site está à espera dos dados. Quando chegarem,
  `docs/LANCAMENTO.md`.

## Falta

Tudo no `dados-lancamento.json`; `--verificar` dá a lista atualizada.

### Dos clientes

1. Número de WhatsApp.
2. Mediadora, n.º AMI, nome, telefone e email do agente.
3. Classe energética.
4. Política: responsável (nome ou empresa, NIF, morada, email, telefone),
   prazo de conservação, email para os direitos e aprovação do texto (com
   jurista).
5. Emails Google para a linha AVISAR.
6. Domínio registado em nome deles (os três candidatos estão livres).
7. Validação da frase da Arquitetura.
8. Localização exata do edifício, para a ligação do Google Maps.
9. IDs do GA4 e do píxel da Meta (recomendado; ou tu, se gerires os anúncios).

### Do Lourenço

10. Distâncias medidas (praia a pé; Peniche, Óbidos e Lisboa de carro) e a
    data da medição.
11. Fotografia de drone (não impede o lançamento: há o bloco de espera).
12. Imagens novas, sem as ripas de madeira dos renders atuais.
13. Teste do formulário de ponta a ponta no domínio e apagar as linhas de
    teste da folha.

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

## Perguntas

Nenhuma pendente do nosso lado.

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

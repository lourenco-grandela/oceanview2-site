# Estado do site OceanView 2

Última atualização: 2026-10-14

## Feito

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

**No domínio, nada é publicado enquanto houver marcadores TODO visíveis** em
qualquer uma das três páginas:

```bash
grep -o 'class="todo"' index.html en/index.html privacidade.html | cut -d: -f1 | uniq -c
```

Hoje devolve **19 no `index.html`, 19 no `en/index.html` e 11 na
`privacidade.html`.**

**Exceção aprovada a 14/10/2026: a pré-visualização no GitHub Pages**, com
`noindex`, só para mostrar aos clientes. Não serve para divulgar nas redes.

## Em curso

- **Pasta ligada ao GitHub** (`lourenco-grandela/oceanview2-site`, público).
  O `main` do GitHub tinha só o CLAUDE.md e o ESTADO.md antigos; o histórico
  foi mantido e os dois ficheiros foram substituídos pelas versões atuais.
- **Falta enviar o commit do workflow da pré-visualização.** O GitHub recusou-o
  porque o token guardado neste Mac não tem a permissão `workflow`. Está em
  local, à frente do `origin/main`. Para o enviar: dar ao token a permissão
  `workflow` (ou criar um novo com ela) e correr `git push`. Depois, no
  repositório: Settings › Pages › Source: **GitHub Actions**. A
  pré-visualização fica em `https://lourenco-grandela.github.io/oceanview2-site/`.

## Falta

### Bloqueia o lançamento

1. **Número de WhatsApp** — `config.js`.
2. **Comercialização**: mediadora, n.º AMI, nome do agente, telefone e email —
   rodapé das duas landing pages (e mediadora e AMI na política).
3. **Classe energética** — rodapé das três páginas.
4. **Política de privacidade**: responsável, NIF, morada, email, telefone,
   prazo de conservação, email para os direitos e data de publicação; e a
   validação pelos clientes e por um jurista.
5. **Domínio registado** — trocar `TODO-dominio.pt` (canonical, `hreflang`,
   `og:url`, `og:image`, `robots.txt`, `sitemap.xml`), criar o `CNAME` e mudar
   o workflow (README, «Publicar no domínio»).
6. **Distâncias medidas** ([X] praia a pé, [Y] Peniche, [Z] Óbidos e [W]
   Lisboa de carro) e a data da medição. Aparecem no subtítulo do hero, no
   texto e nos números de O projeto, no título, texto e lista da Localização e
   na descrição da página.
7. **Texto da Arquitetura validado pela Inês e pelo Carlos** — está marcado.
8. **Ligação do Google Maps** para o local do edifício.
9. **Teste de ponta a ponta do formulário** a partir da pré-visualização
   (linha na folha e email).

### Entra assim que chegar

10. **Fotografia de drone** (`material/fotos/`) para o hero e a Localização.
11. **Renders em alta resolução** (2400 px ou mais de largura).
12. **IDs do GA4 e do píxel da Meta** — `config.js`.
13. **Logótipo definitivo** (hoje é o símbolo Vigia provisório).
14. **Tabela das frações** — `data/fracoes.json`; o seletor aparece sozinho
    quando as 12 tiverem tipologia.
15. **Política de privacidade em inglês.** A versão inglesa liga à portuguesa.

## Perguntas

1. **Os renders mostram painéis verticais com ripas castanhas na fachada**
   (parecem madeira, junto às varandas). O CLAUDE.md diz que o edifício terá
   acrílico e nada de ripas de madeira. Os renders ficam como estão, com a
   nota de imagem ilustrativa, ou o promotor manda versões corrigidas antes de
   irem para as redes?
2. **Há originais dos renders com mais de 1536 px?** Num ecrã retina o hero
   fica ligeiramente suave.
3. **Cor de erro do formulário** (`#F6B9AE`, fora da paleta): aprovam, ou
   preferem outra?
4. **Repositório público ou privado?** O GitHub Pages grátis só funciona com
   repositório público. Se for público, ficam visíveis o `docs/`, o
   `content/`, o URL da aplicação web (não é segredo, segundo o
   `docs/FORMULARIO.md`) e o email do Lourenço na linha `AVISAR` do
   `formulario/Codigo.gs` e neste ficheiro.
5. **Quem valida o inglês?** Os textos vêm do `content/landing.en.md`; o que
   escrevi eu foi só interface (definições de cookies, «Map of Consolação»,
   «Fields marked * are required», mensagens de erro).
6. **Política de privacidade em inglês**: fazemos, ou a versão inglesa liga à
   portuguesa no lançamento?
7. **Apagar o registo «TESTE — apagar» da folha de contactos.**
8. O rascunho da política tem de ser **validado pelos clientes e por um
   jurista**: quem trata disso, e quando?
9. **Quando entram os emails da Inês e do Carlos na linha `AVISAR`?** E a
   folha fica na conta do Lourenço ou passa para uma conta dos clientes?
10. O `docs/apps-script.gs` é um rascunho antigo, com outros nomes de campos.
    **Apago-o?**
11. O script corta cada campo aos **500 caracteres**. **Ponho um `maxlength`
    de 500 na caixa da mensagem?**
12. Número de WhatsApp comercial: é o mesmo que o telefone do rodapé?
13. Quem mede as distâncias, e em que dia?

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

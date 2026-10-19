# Dia do lançamento — passo a passo

Para passar o site da pré-visualização (`lourenco-grandela.github.io/oceanview2-site/`,
com `noindex`) para o domínio dos clientes. Fazer pela ordem; cada passo diz como
confirmar que ficou bem antes de seguir.

Tempo: cerca de 1 hora de trabalho, mais a espera do DNS e do certificado (de
minutos a algumas horas). Não fazer à sexta à tarde.

---

## 0. Antes do dia

- [ ] O domínio está registado **em nome dos clientes** e tu tens acesso à
      gestão do DNS (no registador ou onde os clientes indicarem).
- [ ] A pré-visualização está a funcionar (Settings › Pages › Source:
      **GitHub Actions**).
- [ ] Os clientes deram tudo o que está em «Faltam» no `--verificar` (passo 2).

## 1. Preencher os dados

Abrir o `dados-lancamento.json` (na raiz da pasta, **não vai para o GitHub**) e
preencher cada `null`. Cada bloco diz quem dá o quê. Formatos:

| Campo | Exemplo |
| --- | --- |
| `whatsapp` | `"+351 912 345 678"` (principal) |
| `whatsapp_contactos` | `[{"nome": "Inês Caiado", "numero": "+351 ..."}, ...]` — com dois ou mais, os botões abrem a escolha |
| `comercializacao.agentes` | `[{"nome": ..., "telefone": ..., "email": ...}, ...]` — todos aparecem no rodapé |
| `comercializacao.ami` | `"12345"` (só algarismos) |
| `classe_energetica` | `"A"` (A+, A, B, B-, C, D, E ou F) |
| `politica.prazo_conservacao_meses` | `24` (número, sem aspas) |
| `politica.texto_aprovado` | `true` quando os clientes e o jurista aprovarem |
| `avisar` | `["ines@...", "carlos@..."]` |
| `dominio` | `"oceanview2.pt"` (sem `https://` nem `www`) |
| `distancias.*_min` | `6` (minutos inteiros, sem aspas; `75` aparece como «1h15») |
| `distancias.data_medicao` | `"2026-10"` (mês da medição; a página diz «outubro de 2026») |
| `google_maps` | `"https://maps.app.goo.gl/..."` (Google Maps › Partilhar › Copiar link) |
| `arquitetura_validada` | `true` quando a Inês e o Carlos aprovarem a frase |
| `medicao.ga4` / `medicao.meta_pixel` | `"G-XXXXXXXXXX"` / `"1234567890"` (recomendado) |

`politica.data_publicacao` pode ficar `null`: o script põe a data do dia em
que correr completo e grava-a no JSON.

## 2. Verificar

```bash
.venv/bin/python ferramentas/preencher.py --verificar
```

Diz o que falta, quem o dá, e se algum dado está mal escrito. Repetir até
aparecer **«PRONTO para lançar»**. Os IDs do GA4 e da Meta aparecem como
recomendados: não impedem o lançamento, mas sem eles não há medição.

## 3. Preencher o site

```bash
.venv/bin/python ferramentas/preencher.py
```

O script:

- preenche as quatro páginas (português e inglês, landing e política), o
  `config.js` e o domínio em todos os endereços;
- gera o `robots.txt`, o `sitemap.xml` e os QR codes em `qr/` (lona,
  brochura e brochura em inglês, com `utm_source`, `utm_medium=qr` e
  `utm_campaign=lancamento-2026-09`);
- escreve o `CNAME` — é isto que faz o workflow publicar **no domínio, sem
  `noindex`**;
- mostra a linha **AVISAR** (passo 5). Copiá-la: não fica em ficheiro nenhum.

Pode correr-se as vezes que for preciso: se um dado estiver errado, corrigir
no JSON e voltar a correr.

## 4. Rever em local

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/`, `/en/`, `/privacidade.html` e
`/en/privacy.html`. Confirmar:

- [ ] Nenhum sublinhado tracejado (marcador `.todo`) em nenhuma das quatro.
- [ ] Rodapé: mediadora, AMI, agente, telefone e email certos; o telefone e o
      email abrem a chamada e o email.
- [ ] Distâncias certas em todos os sítios de cada língua (hero, O projeto,
      Localização, Viver aqui e Para quem).
- [ ] Frações e valores: resumo, «desde» dos cartões e lista iguais ao
      `data/fracoes.json` e ao PDF da tabela.
- [ ] «Abrir no Google Maps» abre o local certo.
- [ ] O botão de WhatsApp aparece no hero e nos Próximos passos e abre a
      conversa com a mensagem pré-preenchida.

O portão automático:

```bash
grep -o 'class="todo"' index.html en/index.html privacidade.html en/privacy.html | cut -d: -f1 | uniq -c
```

Não pode devolver nada.

## 5. Avisos do formulário (Apps Script)

Na folha «OceanView 2 — Contactos»: **Extensões › Apps Script**.

1. Trocar a linha `var AVISAR = [...]` pela que o script mostrou.
2. Guardar.
3. **Implementar › Gerir implementações** › lápis › Versão: **Nova versão** ›
   Implementar. O URL da aplicação web **não muda**, por isso o `config.js`
   não se mexe.

Não pôr estes emails no `formulario/Codigo.gs` do repositório: é público.

## 6. DNS do domínio (no registador)

Para o domínio principal (`@`), quatro registos **A** e quatro **AAAA**:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | lourenco-grandela.github.io. |

Apagar outros registos A/AAAA/CNAME do `@` e do `www` que o registador tenha
posto por omissão (páginas de estacionamento). Confirmar os valores na ajuda do
GitHub Pages («Managing a custom domain») no próprio dia: são estes desde há
anos, mas é a fonte certa.

Confirmar (pode demorar de minutos a algumas horas):

```bash
dig +short oceanview2.pt A
```

Tem de devolver os quatro `185.199.x.153`.

**Recomendado:** verificar o domínio na conta do GitHub (a tua foto ›
Settings › Pages › **Add a domain**), com o registo TXT que o GitHub indicar.
Impede que outra conta use o domínio se o site algum dia sair do ar.

## 7. Publicar

```bash
git add -A
git commit -m "Lançamento: dados finais e domínio"
git push
```

Em **Actions**, o run «Publicação (pré-visualização ou domínio)» tem de dizer
**Modo: DOMÍNIO** e acabar a verde. Se disser «Há marcadores por preencher»,
voltar ao passo 4.

## 8. Domínio no GitHub Pages e HTTPS

Repositório › **Settings › Pages**:

1. **Custom domain**: escrever o domínio (ex.: `oceanview2.pt`) › **Save**.
   Com publicação por GitHub Actions, é esta caixa que conta (o ficheiro
   `CNAME` serve ao workflow para saber o modo).
2. Esperar pelo «DNS check successful».
3. Quando ficar disponível (de minutos a 24 h): ligar **Enforce HTTPS**.

Confirmar no browser:

- [ ] `https://oceanview2.pt/` abre o site, com cadeado.
- [ ] `http://oceanview2.pt/`, `https://www.oceanview2.pt/` e o endereço
      antigo do `github.io` levam ao `https://oceanview2.pt/`.
- [ ] `https://oceanview2.pt/qualquer-coisa` mostra a página 404 com o
      aspeto certo.
- [ ] Ver o código-fonte da página: **não** tem `noindex`.
- [ ] `https://oceanview2.pt/robots.txt` e `/sitemap.xml` abrem.

## 9. Google Search Console

1. <https://search.google.com/search-console> › Adicionar propriedade ›
   **Domínio** › `oceanview2.pt`.
2. Pôr no DNS o registo TXT que a Google indicar e carregar em Verificar.
3. **Sitemaps** › `https://oceanview2.pt/sitemap.xml` › Enviar.
4. **Inspeção de URL** › `https://oceanview2.pt/` › Pedir indexação. O mesmo
   para `/en/`.
5. Dar acesso aos clientes (Definições › Utilizadores e autorizações), se o
   quiserem.

## 10. Teste do formulário de ponta a ponta

No site publicado, de preferência num **telemóvel**:

1. Abrir `https://oceanview2.pt/?utm_source=teste&utm_medium=teste&utm_campaign=teste`.
2. Preencher com o nome **«TESTE — apagar»**, escolher uma tipologia, uma
   finalidade e um prazo, aceitar o consentimento e enviar.
3. Confirmar:
   - [ ] A mensagem de sucesso aparece na página.
   - [ ] Na folha há uma linha nova, com `origem`/`meio`/`campanha` = `teste`
         e `pagina` = `/`.
   - [ ] **O email de aviso chegou à Inês e ao Carlos** (perguntar-lhes; ver
         também o spam).
4. Repetir a partir de `https://oceanview2.pt/en/`: os valores na folha têm de
   vir em português e `pagina` = `/en/`.
5. Apagar as linhas de teste da folha (e a antiga «TESTE — apagar»).

## 11. Medição e QR codes

- [ ] Aceitar os cookies no site e ver a visita em **GA4 › Relatórios › Tempo
      real**; no **Meta Events Manager**, ver o `PageView`.
- [ ] Recusar os cookies numa janela privada e confirmar que nada é carregado
      (consola do browser › Rede: nenhum pedido a `googletagmanager.com` nem a
      `facebook.net`).
- [ ] Ler cada QR code de `qr/` com o telemóvel: tem de abrir o site com os
      `utm_` certos. Enviar os `.svg` à gráfica (vetoriais). Tamanho mínimo:
      2 cm na brochura; na lona, pelo menos 1/10 da distância de leitura.

## 12. Fechar

- [ ] Lighthouse no endereço final (telemóvel e desktop): 90 ou mais nas
      quatro categorias.
- [ ] Atualizar o `docs/ESTADO.md` (data, feito, o que falta) e fazer push.
- [ ] Mandar aos clientes o endereço, os QR codes e as ligações com UTM para as
      redes (`utm_source`: instagram, facebook, whatsapp; `utm_medium`: bio,
      stories, anuncio).

---

## Se alguma coisa correr mal

- **Dado errado no site:** corrigir no `dados-lancamento.json`, correr o
  `preencher.py` e fazer push. Em 1–2 minutos está corrigido.
- **Voltar à pré-visualização:** apagar o `CNAME`, fazer push e, em Settings ›
  Pages, remover o Custom domain. O site volta ao `github.io` com `noindex`.
- **O formulário não grava:** abrir o URL do `FORM_URL` (no `config.js`) no
  browser — tem de devolver `{"ok":true,...}`. Se não, rever a implementação no
  Apps Script (passo 5). Enquanto isso, o site mostra a alternativa do WhatsApp.

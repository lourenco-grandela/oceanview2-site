# Formulário de registo de interesse

O formulário do site envia para uma aplicação web do Google Apps Script, que grava na folha «OceanView 2 — Contactos» e avisa por email. O código está em `formulario/Codigo.gs`.

## Instalação (uma vez, cerca de 15 minutos)

1. Criar uma folha nova no Google Sheets com o nome **OceanView 2 — Contactos**.
2. Nessa folha: **Extensões → Apps Script**. Apagar o que lá estiver e colar o conteúdo de `formulario/Codigo.gs`.
3. Escolher a função **preparar** e carregar em **Executar**. O Google pede autorização: Avançadas → Aceder ao projeto → Permitir. Isto cria o cabeçalho e a lista de estados.
4. **Implementar → Nova implementação → Aplicação web**. Executar como: **eu**. Quem tem acesso: **qualquer pessoa**.
5. Copiar o URL que termina em `/exec`: é o `FORM_URL` do site.
6. Acrescentar os emails da Inês e do Carlos na linha `AVISAR` e voltar a implementar (**Implementar → Gerir implementações → editar → nova versão**).

Testes: abrir o URL no browser deve devolver `{"ok":true,...}`; depois submeter o formulário do site e confirmar que aparece uma linha na folha e um email na caixa de entrada.

## O que o site envia

`POST` para o `FORM_URL`, corpo JSON, com `Content-Type: text/plain;charset=utf-8` (evita o pedido prévio de CORS).

```js
const FORM_URL = '<URL da aplicação web, termina em /exec>';

async function enviarRegisto(dados) {
  const resposta = await fetch(FORM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(dados)
  });
  const res = await resposta.json();
  if (!res.ok) throw new Error(res.erro || 'erro');
}
```

Campos do objeto `dados`:

| Campo | Obrigatório | Valores |
| --- | --- | --- |
| `nome` | sim | texto |
| `email` | sim | texto |
| `telefone` | sim | texto |
| `consentimento` | sim | `true` (a caixa tem de estar marcada) |
| `tipologia` | não | T1, T2, T2+2, Ainda não sei |
| `finalidade` | não | Habitação própria, Segunda habitação, Investimento |
| `prazo` | não | Até 3 meses, 3 a 12 meses, Mais de 12 meses |
| `mensagem` | não | texto |
| `origem`, `meio`, `campanha` | não | `utm_source`, `utm_medium`, `utm_campaign` lidos do endereço |
| `pagina` | não | `location.pathname` |
| `empresa` | não | campo escondido (armadilha para robôs): se vier preenchido, o registo é ignorado |

Se o browser bloquear a leitura da resposta, mudar para `mode: 'no-cors'` e dar o envio por bom quando o `fetch` não falha: o registo fica na folha na mesma. Em qualquer erro, mostrar a alternativa do WhatsApp.

## Regras

- Nada é enviado sem o consentimento marcado.
- O `FORM_URL` fica em `config.js` e pode estar no repositório: não é uma chave secreta, e o script só aceita os campos acima.
- A folha de contactos é a base de dados dos clientes: o site nunca lê dela.

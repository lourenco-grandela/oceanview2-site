/* =======================================================================
   ATENÇÃO — RASCUNHO ANTIGO, NÃO É O SCRIPT QUE ESTÁ A SER USADO.
   A aplicação web em produção segue o docs/FORMULARIO.md e o seu código
   vive em formulario/Codigo.gs. Este ficheiro foi escrito antes disso e
   usa outros nomes de campos (telemovel, utm_*). Colar isto por cima da
   implementação a funcionar parte o formulário.
   Manter só como histórico, ou apagar.
   ======================================================================= */

/**
 * OceanView 2 — receção do formulário de registo de interesse.
 *
 * Como instalar (uma vez):
 *  1. Criar uma Google Sheet nova chamada «OceanView 2 — contactos».
 *  2. Extensões › Apps Script e colar este ficheiro.
 *  3. Preencher EMAIL_ALERTA em baixo.
 *  4. Implementar › Nova implementação › Aplicação Web
 *       Executar como: eu
 *       Quem tem acesso: qualquer pessoa
 *  5. Copiar o URL da aplicação web para o campo `formularioUrl` do config.js.
 *  6. Testar de ponta a ponta: o registo tem de chegar à folha e ao email.
 *
 * Nota: a folha guarda dados pessoais. Não a tornar pública nem partilhar
 * fora de quem precisa.
 */

// TODO: email (ou emails separados por vírgula) que recebe o alerta de cada registo.
var EMAIL_ALERTA = '';

var COLUNAS = [
  'data_hora', 'nome', 'email', 'telemovel', 'tipologia', 'finalidade',
  'prazo', 'mensagem', 'consentimento', 'utm_source', 'utm_medium',
  'utm_campaign', 'pagina'
];

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    // Armadilha para robôs: se vier preenchida, responde ok e descarta.
    if (dados.empresa) return resposta({ ok: true });

    var falhas = validar(dados);
    if (falhas.length) {
      return resposta({ ok: false, erro: 'Campos inválidos: ' + falhas.join(', ') });
    }

    var folha = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (folha.getLastRow() === 0) folha.appendRow(COLUNAS);

    var linha = COLUNAS.map(function (coluna) {
      if (coluna === 'data_hora') return dados.data_hora || new Date().toISOString();
      if (coluna === 'consentimento') return dados.consentimento ? 'sim' : 'não';
      return dados[coluna] || '';
    });
    folha.appendRow(linha);

    if (EMAIL_ALERTA) enviarAlerta(dados);

    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  }
}

function validar(dados) {
  var falhas = [];
  if (!dados.nome || String(dados.nome).trim().length < 2) falhas.push('nome');
  if (!dados.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(dados.email).trim())) falhas.push('email');
  if (!dados.telemovel || String(dados.telemovel).replace(/\D/g, '').length < 9) falhas.push('telemóvel');
  // Sem consentimento o pedido é recusado.
  if (dados.consentimento !== true && dados.consentimento !== 'true') falhas.push('consentimento');
  return falhas;
}

function enviarAlerta(dados) {
  var corpo = [
    'Novo registo de interesse no OceanView 2.',
    '',
    'Nome: ' + (dados.nome || ''),
    'Email: ' + (dados.email || ''),
    'Telemóvel: ' + (dados.telemovel || ''),
    'Tipologia: ' + (dados.tipologia || '—'),
    'Finalidade: ' + (dados.finalidade || '—'),
    'Prazo: ' + (dados.prazo || '—'),
    'Mensagem: ' + (dados.mensagem || '—'),
    '',
    'Origem: ' + [dados.utm_source, dados.utm_medium, dados.utm_campaign].filter(String).join(' / '),
    'Página: ' + (dados.pagina || ''),
    'Data e hora: ' + (dados.data_hora || '')
  ].join('\n');

  MailApp.sendEmail({
    to: EMAIL_ALERTA,
    subject: 'OceanView 2 — registo de ' + (dados.nome || 'contacto'),
    body: corpo
  });
}

function resposta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

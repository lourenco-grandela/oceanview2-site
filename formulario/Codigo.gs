/**
 * OceanView 2 — recebe os registos de interesse do site, grava na folha
 * «Contactos» e avisa por email.
 *
 * Instalação: folha nova no Google Sheets → Extensões → Apps Script → colar
 * este ficheiro → executar «preparar» uma vez → Implementar como aplicação web.
 * Passos com detalhe em docs/FORMULARIO.md.
 */

var FOLHA = 'Contactos';

// Emails que recebem o aviso de cada novo contacto.
var AVISAR = ['grandelalourenco@gmail.com'];

var CABECALHO = ['Data e hora', 'Nome', 'Email', 'Telemóvel', 'Tipologia', 'Finalidade',
                 'Prazo de compra', 'Mensagem', 'Consentimento', 'Origem', 'Meio', 'Campanha',
                 'Página', 'Estado', 'Responsável', 'Próxima ação', 'Notas'];

var ESTADOS = ['Novo', 'Contactado', 'Qualificado', 'Visita marcada', 'Proposta', 'CPCV',
               'Escritura', 'Perdido'];

/** Correr uma vez, antes de publicar: cria o cabeçalho e a lista de estados. */
function preparar() {
  var folha = obterFolha();
  folha.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]).setFontWeight('bold');
  folha.setFrozenRows(1);
  var estado = SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).build();
  folha.getRange(2, 14, folha.getMaxRows() - 1, 1).setDataValidation(estado);
  folha.autoResizeColumns(1, CABECALHO.length);
}

function obterFolha() {
  var livro = SpreadsheetApp.getActiveSpreadsheet();
  var folha = livro.getSheetByName(FOLHA);
  if (!folha) {
    folha = livro.insertSheet(FOLHA);
  }
  return folha;
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // Armadilha para robôs: o campo «empresa» está escondido no formulário.
    if (d.empresa) {
      return resposta({ ok: true });
    }
    if (!d.nome || !d.email || !d.telefone || d.consentimento !== true) {
      return resposta({ ok: false, erro: 'campos_em_falta' });
    }

    var folha = obterFolha();
    if (folha.getLastRow() === 0) {
      preparar();
    }
    folha.appendRow([new Date(), limpar(d.nome), limpar(d.email), limpar(d.telefone),
                     limpar(d.tipologia), limpar(d.finalidade), limpar(d.prazo),
                     limpar(d.mensagem), 'Sim', limpar(d.origem), limpar(d.meio),
                     limpar(d.campanha), limpar(d.pagina), 'Novo', '', '', '']);
    avisar(d);
    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  }
}

/** Serve para testar no browser que a aplicação web está no ar. */
function doGet() {
  return resposta({ ok: true, servico: 'OceanView 2' });
}

function limpar(valor) {
  return String(valor === undefined || valor === null ? '' : valor).substring(0, 500);
}

function avisar(d) {
  var assunto = 'OceanView 2: novo contacto de ' + limpar(d.nome);
  var corpo = ['Nome: ' + limpar(d.nome),
               'Email: ' + limpar(d.email),
               'Telemóvel: ' + limpar(d.telefone),
               'Tipologia: ' + limpar(d.tipologia),
               'Finalidade: ' + limpar(d.finalidade),
               'Prazo: ' + limpar(d.prazo),
               'Mensagem: ' + limpar(d.mensagem),
               'Origem: ' + limpar(d.origem) + ' / ' + limpar(d.meio) + ' / ' + limpar(d.campanha),
               'Página: ' + limpar(d.pagina)].join('\n');
  for (var i = 0; i < AVISAR.length; i++) {
    if (AVISAR[i]) {
      MailApp.sendEmail(AVISAR[i], assunto, corpo);
    }
  }
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

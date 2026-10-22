/* OceanView 2 — comportamento da landing page.
 * Sem dependências. Tudo o que é configurável vive em config.js.
 */
(function () {
  'use strict';

  var CFG = window.OCEANVIEW || {};
  var CHAVE_CONSENTIMENTO = 'oceanview2:consentimento';
  var CHAVE_UTM = 'oceanview2:utm';

  /* Os textos que o JavaScript escreve no ecrã existem nas duas línguas. A
     escolha vem do lang do <html>, por isso a página inglesa em /en/ não
     precisa de um ficheiro seu. O que segue para a folha de contactos é
     sempre igual: os valores dos campos estão em português nas duas versões
     (ver os <option> do formulário). */
  var IDIOMA = (document.documentElement.lang || 'pt').toLowerCase().indexOf('en') === 0 ? 'en' : 'pt';
  var TEXTOS = {
    pt: {
      nome: 'Indique o seu nome.',
      email: 'Indique um email válido.',
      telefone: 'Indique um telemóvel com pelo menos 9 dígitos.',
      consentimento: 'É preciso autorizar o contacto para podermos responder.',
      emFalta: 'Faltam dados para enviar o registo. Verifique os campos assinalados.',
      aEnviar: 'A enviar…',
      sucesso: '<strong>Recebemos o seu registo.</strong> Entramos em contacto em breve.',
      erro: 'Não foi possível enviar. Tente outra vez',
      erroFim: '.',
      ouWhatsApp: ' ou fale connosco pelo WhatsApp',
      semLigacao: 'O envio ainda não está ligado.',
      peloWhatsApp: ' Fale connosco pelo WhatsApp',
      maisTarde: ' Tente novamente mais tarde.',
      whatsapp: 'Olá, gostava de receber informação sobre o OceanView 2.',
      whatsappTitulo: 'Falar por WhatsApp',
      whatsappEscolha: 'Escolha com quem quer falar.',
      whatsappCom: 'Falar com {nome} por WhatsApp (abre numa nova janela)',
      fechar: 'Fechar',
      faltam: 'Faltam {n} caracteres.',
      limite: 'Chegou ao limite de 500 caracteres.',
      fracao: 'Fração',
      estados: { disponivel: 'Disponível', reservada: 'Reservada', vendida: 'Vendida' },
      precoConsulta: 'Sob consulta',
      // Frações e valores (versão 2.1)
      apartamentos: function (n) { return n === 1 ? '1 apartamento' : n + ' apartamentos'; },
      areas: function (a, b) { return a === b ? a + ' m²' : a + ' a ' + b + ' m²'; },
      comSotao: ', com sótão',
      desde: 'Desde {v}',
      disponiveis: '{n} disponíveis',
      e: ' e ',
      verLista: 'Ver as {n} frações',
      fecharLista: 'Fechar a lista',
      todas: 'Todas',
      piso: function (n) { return 'Piso ' + n; },
      aMostrar: function (n) { return n === 1 ? 'A mostrar 1 fração.' : 'A mostrar ' + n + ' frações.'; },
      area: 'Área',
      exterior: 'Exterior',
      estacionamento: 'Estacionamento',
      pedirPlanta: 'Pedir planta',
      pedirPlantaDe: 'Pedir planta da fração {f}',
      verPlanta: 'Ver planta',
      verPlantaDe: 'Ver planta da fração {f}',
      plantaAlt: 'Planta da fração {f}',
      abrirPdf: 'Abrir PDF',
      emPortugues: '',
      pedirCondicoes: 'Pedir condições',
      fecharPlanta: 'Fechar a planta',
      mensagemPlanta: 'Gostava de receber as condições da fração {f}.',
      milhares: '.',
      decimal: ',',
      moeda: function (n) { return n + ' €'; }
    },
    en: {
      nome: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      telefone: 'Please enter a phone number with at least 9 digits.',
      consentimento: 'We need your permission to get in touch.',
      emFalta: 'Some details are missing. Please check the highlighted fields.',
      aEnviar: 'Sending…',
      sucesso: '<strong>Thank you, we have received your details</strong> and will be in touch soon.',
      erro: 'We could not send your details. Please try again',
      erroFim: '.',
      ouWhatsApp: ' or message us on WhatsApp',
      semLigacao: 'The form is not connected yet.',
      peloWhatsApp: ' Message us on WhatsApp',
      maisTarde: ' Please try again later.',
      whatsapp: 'Hello, I would like to receive information about OceanView 2.',
      whatsappTitulo: 'Message us on WhatsApp',
      whatsappEscolha: 'Choose who you would like to talk to.',
      whatsappCom: 'Message {nome} on WhatsApp (opens in a new window)',
      fechar: 'Close',
      faltam: '{n} characters left.',
      limite: 'You have reached the 500-character limit.',
      fracao: 'Apartment',
      estados: { disponivel: 'Available', reservada: 'Reserved', vendida: 'Sold' },
      precoConsulta: 'On request',
      apartamentos: function (n) { return n === 1 ? '1 apartment' : n + ' apartments'; },
      areas: function (a, b) { return a === b ? a + ' m²' : a + ' to ' + b + ' m²'; },
      comSotao: ', including attic',
      desde: 'From {v}',
      disponiveis: '{n} available',
      e: ' and ',
      verLista: 'See all {n} apartments',
      fecharLista: 'Close the list',
      todas: 'All',
      piso: function (n) { return ['Ground floor', 'First floor', 'Second floor', 'Third floor'][n] || 'Floor ' + n; },
      aMostrar: function (n) { return n === 1 ? 'Showing 1 apartment.' : 'Showing ' + n + ' apartments.'; },
      area: 'Area',
      exterior: 'Outdoor',
      estacionamento: 'Parking',
      pedirPlanta: 'Request floor plan',
      pedirPlantaDe: 'Request the floor plan for apartment {f}',
      verPlanta: 'See floor plan',
      verPlantaDe: 'See the floor plan for apartment {f}',
      plantaAlt: 'Floor plan of apartment {f}',
      abrirPdf: 'Open PDF',
      emPortugues: '(in Portuguese)',
      pedirCondicoes: 'Request details',
      fecharPlanta: 'Close the floor plan',
      mensagemPlanta: 'I would like to receive the details for apartment {f}.',
      milhares: ',',
      decimal: '.',
      moeda: function (n) { return '€' + n; }
    }
  };
  var T = TEXTOS[IDIOMA];

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  /* ------------------------------------------------------------- WhatsApp */
  function mensagemWhatsApp() {
    var porIdioma = IDIOMA === 'en' ? CFG.whatsappMensagemEn : CFG.whatsappMensagem;
    return porIdioma || T.whatsapp;
  }

  function soDigitos(n) { return String(n || '').replace(/\D/g, ''); }

  function urlWhatsApp(numero) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagemWhatsApp());
  }

  // Contactos do config.js; sem lista, vale o número principal.
  function contactosWhatsApp() {
    var lista = (CFG.whatsappContactos || []).map(function (c) {
      return { nome: c.nome || '', numero: soDigitos(c.numero) };
    }).filter(function (c) { return c.numero; });
    if (!lista.length && soDigitos(CFG.whatsapp)) lista = [{ nome: '', numero: soDigitos(CFG.whatsapp) }];
    return lista;
  }

  // +351 918 559 623, a partir dos dígitos (indicativo de 3 algarismos).
  function numeroLegivel(d) {
    return '+' + d.slice(0, 3) + ' ' + d.slice(3).replace(/(\d{3})(?=\d)/g, '$1 ');
  }

  /* Com dois ou mais contactos (a Inês e o Carlos), qualquer botão de
     WhatsApp abre um <dialog> com a escolha: foco preso no diálogo, Esc
     fecha, clicar fora fecha e o foco volta ao botão de origem. Os botões
     continuam a ser ligações (href para o primeiro contacto, caso o diálogo
     falhe), com role="button" e espaço a ativar, como um botão. */
  function criarEscolhaWhatsApp(contactos) {
    var dialogo = el('dialog', 'escolha-whatsapp');
    dialogo.setAttribute('aria-labelledby', 'titulo-escolha-whatsapp');
    var interior = el('div', 'escolha-whatsapp__interior');
    var titulo = el('h2', '', T.whatsappTitulo);
    titulo.id = 'titulo-escolha-whatsapp';
    interior.appendChild(titulo);
    interior.appendChild(el('p', 'nota', T.whatsappEscolha));
    var lista = el('ul', 'escolha-whatsapp__lista');
    contactos.forEach(function (c) {
      var a = el('a', 'escolha-whatsapp__contacto');
      a.href = urlWhatsApp(c.numero);
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', T.whatsappCom.replace('{nome}', c.nome || numeroLegivel(c.numero)));
      var textos = el('span', 'escolha-whatsapp__textos');
      textos.appendChild(el('span', 'escolha-whatsapp__nome', c.nome || numeroLegivel(c.numero)));
      if (c.nome) textos.appendChild(el('span', 'escolha-whatsapp__numero', numeroLegivel(c.numero)));
      a.appendChild(textos);
      var seta = el('span', 'seta');
      seta.setAttribute('aria-hidden', 'true');
      seta.innerHTML = '<svg><use href="#seta"></use></svg>';
      a.appendChild(seta);
      a.addEventListener('click', function () { fechar(); });
      var li = el('li');
      li.appendChild(a);
      lista.appendChild(li);
    });
    interior.appendChild(lista);
    var botaoFechar = el('button', 'btn btn--contorno btn--pequeno', T.fechar);
    botaoFechar.type = 'button';
    interior.appendChild(botaoFechar);
    dialogo.appendChild(interior);
    document.body.appendChild(dialogo);

    var origem = null;
    function fechar() { if (dialogo.open) dialogo.close(); }
    botaoFechar.addEventListener('click', fechar);
    dialogo.addEventListener('click', function (ev) { if (ev.target === dialogo) fechar(); });
    dialogo.addEventListener('close', function () {
      if (origem && document.contains(origem)) origem.focus();
      origem = null;
    });

    return function abrir(botao) {
      origem = botao;
      if (typeof dialogo.showModal === 'function') dialogo.showModal();
      else dialogo.setAttribute('open', '');
      var primeiro = $('.escolha-whatsapp__contacto', dialogo);
      if (primeiro) primeiro.focus();
    };
  }

  function iniciarWhatsApp() {
    var contactos = contactosWhatsApp();
    var ligacoes = $$('[data-whatsapp]');
    var alternativas = $$('[data-sem-whatsapp]');

    if (!contactos.length) {
      // TODO: sem número em config.js os botões ficam escondidos, para não
      // publicar ligações partidas. Preencher antes do lançamento.
      ligacoes.forEach(function (a) { a.hidden = true; });
      if (window.console) console.warn('[OceanView 2] Falta o número de WhatsApp em config.js.');
      return;
    }

    var escolha = contactos.length > 1 && window.HTMLDialogElement ? criarEscolhaWhatsApp(contactos) : null;

    ligacoes.forEach(function (a) {
      a.href = urlWhatsApp(contactos[0].numero);
      a.target = '_blank';
      a.rel = 'noopener';
      a.hidden = false;
      if (escolha) {
        a.setAttribute('role', 'button');
        a.setAttribute('aria-haspopup', 'dialog');
        a.removeAttribute('target');
      }
    });
    alternativas.forEach(function (el) { el.hidden = true; });
    $$('[data-whatsapp-item]').forEach(function (el) { el.hidden = false; });

    if (!escolha) return;
    // Delegação: serve também a ligação criada na mensagem de erro do formulário.
    document.addEventListener('click', function (ev) {
      var alvo = ev.target.closest ? ev.target.closest('[data-whatsapp]') : null;
      if (!alvo) return;
      ev.preventDefault();
      escolha(alvo);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== ' ' && ev.key !== 'Spacebar') return;
      var alvo = ev.target.closest ? ev.target.closest('[data-whatsapp]') : null;
      if (!alvo) return;
      ev.preventDefault();
      escolha(alvo);
    });
  }

  /* ------------------------------------------------- origem da visita (utm) */
  function guardarUtm() {
    var params = new URLSearchParams(window.location.search);
    var campos = ['utm_source', 'utm_medium', 'utm_campaign'];
    var tem = campos.some(function (c) { return params.get(c); });

    if (tem) {
      var dados = {};
      campos.forEach(function (c) { dados[c] = params.get(c) || ''; });
      try { sessionStorage.setItem(CHAVE_UTM, JSON.stringify(dados)); } catch (e) {}
      return dados;
    }

    try {
      var guardado = sessionStorage.getItem(CHAVE_UTM);
      if (guardado) return JSON.parse(guardado);
    } catch (e) {}

    return { utm_source: '', utm_medium: '', utm_campaign: '' };
  }

  function preencherEscondidos(form) {
    var utm = guardarUtm();
    function por(nome, valor) {
      var campo = form.elements[nome];
      if (campo) campo.value = valor;
    }
    por('utm_source', utm.utm_source || '');
    por('utm_medium', utm.utm_medium || '');
    por('utm_campaign', utm.utm_campaign || CFG.utmCampanhaOmissao || '');
    por('pagina', window.location.pathname || '/');
    // A data e a hora ficam no formulário (o CLAUDE.md pede-as), mas não
    // seguem no envio: quem as carimba é a aplicação web, com o relógio do
    // servidor — o formulario/Codigo.gs grava `new Date()` na primeira coluna.
    por('data_hora', new Date().toISOString());
  }

  /* ---------------------------------------------------- pílulas de escolha */
  /* As opções de tipologia, finalidade e prazo são botões com aria-pressed
     (docs/DESIGN.md). Cada grupo escreve o valor escolhido num campo
     escondido com o nome que o resto do código já lê, por isso o
     montarDados() não muda. O valor é sempre o português (data-valor), também
     na página inglesa. Carregar outra vez na opção escolhida desmarca-a. */
  function escolher(grupo, valor) {
    var campo = $('input[type="hidden"]', grupo);
    $$('[data-valor]', grupo).forEach(function (b) {
      var sim = b.getAttribute('data-valor') === valor;
      b.setAttribute('aria-pressed', sim ? 'true' : 'false');
    });
    if (campo) campo.value = valor || '';
  }

  function iniciarEscolhas() {
    $$('[data-escolha]').forEach(function (grupo) {
      $$('[data-valor]', grupo).forEach(function (botao) {
        botao.addEventListener('click', function () {
          var ja = botao.getAttribute('aria-pressed') === 'true';
          escolher(grupo, ja ? '' : botao.getAttribute('data-valor'));
        });
      });
    });

    // Cartões de tipologia e «Pedir planta» da lista de frações: levam ao
    // formulário com a tipologia já escolhida. O «Pedir planta» indica também
    // a fração na mensagem, que a pessoa pode mudar (a folha não tem coluna
    // própria para a fração: docs/FORMULARIO.md). Só se escreve na mensagem
    // se estiver vazia ou ainda com o texto que o próprio site lá pôs.
    var mensagemAutomatica = '';
    document.addEventListener('click', function (ev) {
      var alvo = ev.target.closest ? ev.target.closest('[data-pre-tipologia]') : null;
      if (!alvo) return;
      var grupo = $('[data-escolha="tipologia"]');
      if (grupo) escolher(grupo, alvo.getAttribute('data-pre-tipologia'));
      var fracao = alvo.getAttribute('data-pre-fracao');
      var caixa = $('#mensagem');
      if (fracao && caixa && (!caixa.value.trim() || caixa.value === mensagemAutomatica)) {
        caixa.value = mensagemAutomatica = T.mensagemPlanta.replace('{f}', fracao);
        caixa.dispatchEvent(new Event('input'));
      }
    });
  }

  /* ----------------------------------------------------------- formulário */
  var REGRAS = {
    nome: {
      valida: function (v) { return v.trim().length >= 2; },
      erro: T.nome
    },
    email: {
      valida: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      erro: T.email
    },
    telemovel: {
      valida: function (v) { return v.replace(/\D/g, '').length >= 9; },
      erro: T.telefone
    }
  };

  function marcarErro(nome, mensagem) {
    var bloco = document.querySelector('[data-campo="' + nome + '"]');
    if (!bloco) return;
    var alvo = $('.campo__erro', bloco);
    bloco.setAttribute('data-erro', mensagem ? 'true' : 'false');
    if (alvo) alvo.textContent = mensagem || '';
    var campo = bloco.querySelector('input, select, textarea');
    if (campo) campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  }

  function validar(form) {
    var problemas = [];

    Object.keys(REGRAS).forEach(function (nome) {
      var campo = form.elements[nome];
      if (!campo) return;
      var ok = REGRAS[nome].valida(campo.value);
      marcarErro(nome, ok ? '' : REGRAS[nome].erro);
      if (!ok) problemas.push(campo);
    });

    var consentimento = form.elements.consentimento;
    if (consentimento && !consentimento.checked) {
      marcarErro('consentimento', T.consentimento);
      problemas.push(consentimento);
    } else {
      marcarErro('consentimento', '');
    }

    return problemas;
  }

  function mensagemAlternativa(texto) {
    var contactos = contactosWhatsApp();
    if (!contactos.length) return '';
    var url = urlWhatsApp(contactos[0].numero);
    // data-whatsapp: com dois contactos, abre a mesma escolha dos outros botões.
    return '<a href="' + url + '" target="_blank" rel="noopener" data-whatsapp>' +
      (texto || ' Pode também falar connosco por WhatsApp') + '</a>';
  }

  /* Passa os campos do formulário para os nomes que a aplicação web espera.
     O contrato está em docs/FORMULARIO.md: o ecrã fala em «telemóvel» e em
     «utm», a folha de contactos fala em «telefone», «origem», «meio» e
     «campanha». O campo escondido «empresa» segue tal como está: é o próprio
     script que ignora o registo quando vem preenchido. */
  function montarDados(form) {
    function v(nome) {
      var campo = form.elements[nome];
      return campo ? String(campo.value || '').trim() : '';
    }
    return {
      nome: v('nome'),
      email: v('email'),
      telefone: v('telemovel'),
      consentimento: !!form.elements.consentimento.checked,
      tipologia: v('tipologia'),
      finalidade: v('finalidade'),
      prazo: v('prazo'),
      mensagem: v('mensagem'),
      origem: v('utm_source'),
      meio: v('utm_medium'),
      campanha: v('utm_campaign'),
      pagina: v('pagina'),
      empresa: v('empresa')
    };
  }

  function pedido(dados, opcoes) {
    return fetch(CFG.FORM_URL, {
      method: 'POST',
      mode: opcoes && opcoes.semLeitura ? 'no-cors' : 'cors',
      // text/plain evita o pedido prévio de CORS ao Apps Script.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(dados)
    });
  }

  function enviarRegisto(dados) {
    return pedido(dados)
      .then(function (r) {
        if (!r.ok) throw new Error('resposta ' + r.status);
        return r.json();
      })
      .then(function (res) {
        if (!res || res.ok !== true) throw new Error((res && res.erro) || 'recusado');
        return res;
      })
      .catch(function (erro) {
        // Só um erro de rede (ou a leitura bloqueada pelo browser) justifica
        // repetir sem leitura da resposta: o registo fica na folha na mesma.
        // Uma recusa do script é uma recusa e tem de chegar à pessoa.
        if (!(erro instanceof TypeError)) throw erro;
        if (window.console) console.warn('[OceanView 2] Resposta ilegível; a repetir em no-cors.');
        return pedido(dados, { semLeitura: true }).then(function () {
          return { ok: true, semLeitura: true };
        });
      });
  }

  function iniciarFormulario() {
    var form = $('#form-registo');
    if (!form) return;

    var estado = $('#estado-formulario');
    var botao = $('#btn-enviar');
    preencherEscondidos(form);

    // Limpa o erro assim que a pessoa corrige o campo.
    $$('input, select, textarea', form).forEach(function (campo) {
      campo.addEventListener('input', function () {
        var bloco = campo.closest('[data-campo]');
        if (bloco && bloco.getAttribute('data-erro') === 'true') {
          marcarErro(bloco.getAttribute('data-campo'), '');
        }
      });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      estado.innerHTML = '';
      estado.classList.remove('formulario__estado--erro');

      var problemas = validar(form);
      if (problemas.length) {
        estado.classList.add('formulario__estado--erro');
        estado.textContent = T.emFalta;
        problemas[0].focus();
        return;
      }

      if (!CFG.FORM_URL) {
        estado.innerHTML = T.semLigacao +
          (mensagemAlternativa(T.peloWhatsApp) || T.maisTarde);
        if (window.console) console.warn('[OceanView 2] Falta FORM_URL em config.js.');
        return;
      }

      preencherEscondidos(form);

      botao.disabled = true;
      var conteudoBotao = botao.innerHTML; // texto e seta
      botao.textContent = T.aEnviar;

      enviarRegisto(montarDados(form))
        .then(function () {
          form.hidden = true;
          estado.classList.remove('formulario__estado--erro');
          estado.innerHTML = T.sucesso;
          estado.setAttribute('tabindex', '-1');
          estado.focus();
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'generate_lead', { form_id: 'registo-interesse' });
          }
          if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
        })
        .catch(function (erro) {
          if (window.console) console.error('[OceanView 2] Envio falhou:', erro);
          estado.classList.add('formulario__estado--erro');
          estado.innerHTML = T.erro + (mensagemAlternativa(T.ouWhatsApp) || '') + T.erroFim;
          botao.disabled = false;
          botao.innerHTML = conteudoBotao;
        });
    });
  }

  /* ------------------------------------------------------------- cookies */
  function lerConsentimento() {
    try {
      var guardado = localStorage.getItem(CHAVE_CONSENTIMENTO);
      return guardado ? JSON.parse(guardado) : null;
    } catch (e) { return null; }
  }

  function gravarConsentimento(medicao, marketing) {
    var valor = { medicao: !!medicao, marketing: !!marketing, data: new Date().toISOString(), versao: 1 };
    try { localStorage.setItem(CHAVE_CONSENTIMENTO, JSON.stringify(valor)); } catch (e) {}
    aplicarConsentimento(valor);
    return valor;
  }

  var carregado = { medicao: false, marketing: false };

  function carregarGA4(id) {
    if (carregado.medicao || !id) return;
    carregado.medicao = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  function carregarMetaPixel(id) {
    if (carregado.marketing || !id) return;
    carregado.marketing = true;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  }

  function aplicarConsentimento(valor) {
    if (!valor) return;
    if (valor.medicao) carregarGA4(CFG.ga4);
    if (valor.marketing) carregarMetaPixel(CFG.metaPixel);
  }

  function mostrarQuandoEstavel(aco) {
    var feito = false;
    function uma_vez() { if (!feito) { feito = true; aco(); } }
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
      document.fonts.ready.then(uma_vez);
      setTimeout(uma_vez, 1500); // rede lenta: não deixar o banner por mostrar
    } else {
      uma_vez();
    }
  }

  function iniciarCookies() {
    var banner = $('#banner-cookies');
    var dialogo = $('#dialogo-cookies');
    var formCookies = $('#form-cookies');
    if (!banner || !dialogo) return;

    var guardado = lerConsentimento();
    if (guardado) {
      aplicarConsentimento(guardado);
    } else {
      // Só mostrar o banner depois de os tipos de letra estarem prontos: assim
      // aparece já com a altura final e não empurra nada (evita salto de layout).
      mostrarQuandoEstavel(function () { banner.hidden = false; });
    }

    function fecharBanner() { banner.hidden = true; }

    function abrirDefinicoes() {
      var atual = lerConsentimento() || { medicao: false, marketing: false };
      $('#cookie-medicao').checked = !!atual.medicao;
      $('#cookie-marketing').checked = !!atual.marketing;
      if (typeof dialogo.showModal === 'function') dialogo.showModal();
      else dialogo.setAttribute('open', '');
    }

    $('#cookies-aceitar').addEventListener('click', function () {
      gravarConsentimento(true, true);
      fecharBanner();
    });

    $('#cookies-recusar').addEventListener('click', function () {
      gravarConsentimento(false, false);
      fecharBanner();
    });

    $('#cookies-definicoes').addEventListener('click', abrirDefinicoes);

    var abrirNoRodape = $('#abrir-definicoes-cookies');
    if (abrirNoRodape) abrirNoRodape.addEventListener('click', abrirDefinicoes);

    $('#cookies-fechar').addEventListener('click', function () {
      if (typeof dialogo.close === 'function') dialogo.close();
      else dialogo.removeAttribute('open');
    });

    formCookies.addEventListener('submit', function () {
      gravarConsentimento($('#cookie-medicao').checked, $('#cookie-marketing').checked);
      fecharBanner();
    });
  }

  /* --------------------------------------------- contador da mensagem */
  /* A caixa tem maxlength de 500, que é o corte do script da folha. O número
     visível acompanha a escrita; para leitores de ecrã, o contador está ligado
     à caixa por aria-describedby e só é anunciado (aria-live) quando faltam
     50 caracteres e quando chega ao limite, para não falar a cada tecla. */
  function iniciarContador() {
    $$('[data-contador]').forEach(function (contador) {
      var caixa = document.getElementById(contador.getAttribute('data-contador'));
      var usados = $('[data-usados]', contador);
      if (!caixa || !usados) return;
      var limite = Number(caixa.getAttribute('maxlength')) || 500;
      var aviso = document.createElement('span');
      aviso.className = 'so-leitor';
      aviso.setAttribute('aria-live', 'polite');
      contador.appendChild(aviso);
      var ultimoAviso = '';

      function atualizar() {
        var n = caixa.value.length;
        usados.textContent = String(n);
        contador.classList.toggle('campo__contador--perto', n >= limite - 50);
        var faltam = limite - n;
        var texto = faltam === 0 ? T.limite : (faltam <= 50 ? T.faltam.replace('{n}', faltam) : '');
        var marco = faltam === 0 ? 'fim' : (faltam <= 50 ? 'perto' : '');
        if (marco !== ultimoAviso) { aviso.textContent = texto; ultimoAviso = marco; }
      }
      caixa.addEventListener('input', atualizar);
      atualizar();
    });
  }

  /* ------------------------------------------------ frações e valores */
  /* Versão 2.1: tudo o que é número na secção #fracoes e nos cartões de
     tipologia vem do data/fracoes.json — resumo, «desde», áreas, filtros,
     tabela (acima de 700 px) e cartões (abaixo). A área mostrada é sempre o
     area_total_m2 (nas frações I a L inclui o sótão: pedido dos clientes,
     19/10/2026); o sótão não tem coluna própria.
     Nada fica escrito à mão no HTML. A secção está visível de origem (para não saltar ao carregar) e só
     se esconde se o JSON não chegar ou não tiver as 12 frações com tipologia.
     O caminho do JSON vem de data-fonte, para servir as duas línguas. */
  var TIPOLOGIAS = ['T1', 'T2', 'T2+2'];

  function fracoesCompletas(lista) {
    return Array.isArray(lista) && lista.length === 12 && lista.every(function (f) {
      return f && TIPOLOGIAS.indexOf(f.tipologia) !== -1;
    });
  }

  function vazio(v) { return v === null || v === undefined || v === ''; }

  function agrupar(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, T.milhares);
  }

  function formatarPreco(valor) {
    if (vazio(valor)) return T.precoConsulta;
    return T.moeda(agrupar(Math.round(Number(valor))));
  }

  // Áreas com duas casas decimais, como no quadro de áreas: 78,80 m².
  function formatarArea(valor) {
    if (vazio(valor)) return '—';
    var partes = Number(valor).toFixed(2).split('.');
    return agrupar(partes[0]) + T.decimal + partes[1] + ' m²';
  }

  // «14 m²» (sem casas decimais), ou «—» sem estacionamento.
  function formatarEstacionamento(valor) {
    if (vazio(valor)) return '—';
    var n = Number(valor);
    return (n % 1 ? formatarArea(n).replace(' m²', '') : agrupar(n)) + ' m²';
  }

  function juntar(lista) {
    if (lista.length < 2) return lista.join('');
    return lista.slice(0, -1).join(', ') + T.e + lista[lista.length - 1];
  }

  function disponivel(f) { return (f.estado || 'disponivel') === 'disponivel'; }

  function minimo(lista) {
    var precos = lista.filter(function (f) { return disponivel(f) && !vazio(f.preco); })
      .map(function (f) { return Number(f.preco); });
    return precos.length ? Math.min.apply(null, precos) : null;
  }

  // «250.000 €» quando só há um valor; «Desde 295.000 €» quando há vários.
  function valorDesde(lista) {
    var m = minimo(lista);
    if (m === null) return T.precoConsulta;
    var varios = lista.filter(function (f) { return disponivel(f) && !vazio(f.preco); })
      .some(function (f) { return Number(f.preco) !== m; });
    return varios ? T.desde.replace('{v}', formatarPreco(m)) : formatarPreco(m);
  }

  function preencherTipologias(lista) {
    TIPOLOGIAS.forEach(function (tipo) {
      var dela = lista.filter(function (f) { return f.tipologia === tipo; });
      var linha = $('[data-tipologia-linha="' + tipo + '"]');
      var valor = $('[data-tipologia-valor="' + tipo + '"]');
      if (!dela.length) return;
      var areas = dela.map(function (f) { return f.area_total_m2; }).filter(function (a) { return !vazio(a); })
        .map(function (a) { return Math.round(Number(a)); });
      var texto = T.apartamentos(dela.length);
      if (areas.length) {
        texto += ' · ' + T.areas(Math.min.apply(null, areas), Math.max.apply(null, areas));
        if (dela.every(function (f) { return !vazio(f.area_sotao_m2); })) texto += T.comSotao;
      }
      if (linha) linha.textContent = texto;
      if (valor) valor.textContent = valorDesde(dela);
    });
  }

  // Um filtro por piso. Se as frações de um piso forem exatamente as de uma
  // tipologia, o rótulo diz as duas coisas («Piso 2 · T2+2»).
  function filtrosDe(lista) {
    var pisos = [];
    lista.forEach(function (f) { if (!vazio(f.piso) && pisos.indexOf(f.piso) === -1) pisos.push(f.piso); });
    pisos.sort(function (a, b) { return a - b; });
    return pisos.map(function (p) {
      var noPiso = lista.filter(function (f) { return f.piso === p; });
      var tipo = noPiso[0].tipologia;
      var igual = noPiso.every(function (f) { return f.tipologia === tipo; }) &&
        lista.filter(function (f) { return f.tipologia === tipo; }).length === noPiso.length;
      return { piso: p, rotulo: T.piso(p) + (igual ? ' · ' + tipo : '') };
    });
  }

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  /* «Ver planta» abre o diálogo da planta (22/10/2026). Sem planta no JSON,
     fica o «Pedir planta» de antes, que leva ao formulário. */
  function botaoPlanta(f) {
    if (f.planta_img && f.planta_pdf && abrirPlanta) {
      var b = el('button', 'btn btn--contorno btn--planta', T.verPlanta);
      b.type = 'button';
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-label', T.verPlantaDe.replace('{f}', f.fracao));
      b.addEventListener('click', function () { abrirPlanta(f, b); });
      return b;
    }
    var a = el('a', 'btn btn--contorno btn--planta', T.pedirPlanta);
    a.href = '#registo';
    a.setAttribute('data-pre-tipologia', f.tipologia);
    a.setAttribute('data-pre-fracao', f.fracao);
    a.setAttribute('aria-label', T.pedirPlantaDe.replace('{f}', f.fracao));
    return a;
  }

  /* Diálogo da planta: imagem (só se pede ao abrir), «Abrir PDF» e «Pedir
     condições». Esc, o ✕ e clicar fora fecham, e o foco volta ao botão da
     linha; «Pedir condições» fecha e segue para o formulário com a tipologia
     e a fração indicadas (mesma delegação do data-pre-tipologia). Os caminhos
     do JSON são relativos à raiz do site: a base vem do data-fonte, para
     servir /en/ e qualquer subcaminho. */
  var abrirPlanta = null;

  function criarDialogoPlanta(base) {
    if (!window.HTMLDialogElement) return null;
    var dialogo = el('dialog', 'dialogo-planta');
    dialogo.setAttribute('aria-labelledby', 'titulo-planta');
    var interior = el('div', 'dialogo-planta__interior');
    var topo = el('div', 'dialogo-planta__topo');
    var titulos = el('div');
    var titulo = el('h2', 'dialogo-planta__titulo');
    titulo.id = 'titulo-planta';
    var detalhe = el('p', 'nota');
    titulos.appendChild(titulo);
    titulos.appendChild(detalhe);
    topo.appendChild(titulos);
    var fecharBotao = el('button', 'dialogo-planta__fechar');
    fecharBotao.type = 'button';
    fecharBotao.setAttribute('aria-label', T.fecharPlanta);
    fecharBotao.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    topo.appendChild(fecharBotao);
    interior.appendChild(topo);

    var imagem = el('img', 'dialogo-planta__imagem');
    imagem.width = 1075;
    imagem.height = 1521;
    imagem.loading = 'lazy';
    imagem.decoding = 'async';
    interior.appendChild(imagem);

    var botoes = el('div', 'grupo-botoes dialogo-planta__botoes');
    var pdf = el('a', 'btn btn--contorno');
    pdf.target = '_blank';
    pdf.rel = 'noopener';
    pdf.type = 'application/pdf';
    if (T.emPortugues) pdf.hreflang = 'pt';
    var pedir = el('a', 'btn btn--principal', T.pedirCondicoes);
    pedir.href = '#registo';
    botoes.appendChild(pdf);
    botoes.appendChild(pedir);
    interior.appendChild(botoes);
    dialogo.appendChild(interior);
    document.body.appendChild(dialogo);

    var origem = null;
    function fechar() { if (dialogo.open) dialogo.close(); }
    fecharBotao.addEventListener('click', fechar);
    dialogo.addEventListener('click', function (ev) { if (ev.target === dialogo) fechar(); });
    // O foco volta ao botão da linha; depois de «Pedir condições», vai para
    // o campo Nome (origem aponta para ele). No evento close, e não antes,
    // porque o próprio browser devolve o foco ao fechar.
    dialogo.addEventListener('close', function () {
      if (origem && document.contains(origem)) origem.focus({ preventScroll: origem.id === 'nome' });
      origem = null;
    });
    pdf.addEventListener('click', fechar);
    pedir.addEventListener('click', function (ev) {
      // Segue para o formulário em vez de voltar à linha. Desce sempre até
      // ele (um link para o #registo onde já se está não desloca a página).
      // A tipologia e a mensagem são escritas pela delegação do data-pre-*.
      var registo = document.getElementById('registo');
      origem = document.getElementById('nome');
      fechar();
      if (!registo) return;
      ev.preventDefault();
      registo.scrollIntoView();
    });

    return function (f, botao) {
      origem = botao;
      titulo.textContent = T.fracao + ' ' + f.fracao;
      detalhe.textContent = f.tipologia + (vazio(f.piso) ? '' : ' · ' + T.piso(f.piso)) +
        (vazio(f.estacionamento) ? '' : ' · ' + T.estacionamento + ' ' + formatarEstacionamento(f.estacionamento));
      imagem.alt = T.plantaAlt.replace('{f}', f.fracao);
      imagem.src = base + f.planta_img;
      pdf.href = base + f.planta_pdf;
      pdf.setAttribute('download', '');
      pdf.innerHTML = '<svg aria-hidden="true" focusable="false"><use href="#descarregar"></use></svg>';
      pdf.appendChild(document.createTextNode(T.abrirPdf));
      if (T.emPortugues) {
        pdf.appendChild(document.createTextNode(' '));
        pdf.appendChild(el('span', 'btn__nota', T.emPortugues));
      }
      pedir.setAttribute('data-pre-tipologia', f.tipologia);
      pedir.setAttribute('data-pre-fracao', f.fracao);
      dialogo.showModal();
      fecharBotao.focus();
    };
  }

  function valorOuEstado(f) {
    return disponivel(f) ? formatarPreco(f.preco) : (T.estados[f.estado] || f.estado);
  }

  function linhaTabela(f) {
    var tr = el('tr');
    tr.setAttribute('data-piso', f.piso);
    var td = el('td');
    td.appendChild(el('span', 'letra', f.fracao));
    tr.appendChild(td);
    tr.appendChild(el('td', 'forte', f.tipologia));
    tr.appendChild(el('td', 'fraco', vazio(f.piso) ? '—' : T.piso(f.piso)));
    tr.appendChild(el('td', 'num', formatarArea(f.area_total_m2)));
    tr.appendChild(el('td', 'num fraco', formatarArea(f.area_exterior_m2)));
    // Estacionamento em m² (clientes, 22/10/2026): só informação, não entra
    // na área nem em nenhum total.
    tr.appendChild(el('td', 'num fraco', formatarEstacionamento(f.estacionamento)));
    tr.appendChild(el('td', 'num forte', valorOuEstado(f)));
    td = el('td');
    td.appendChild(botaoPlanta(f));
    tr.appendChild(td);
    return tr;
  }

  function cartaoFracao(f) {
    var li = el('li', 'cartao-fracao');
    li.setAttribute('data-piso', f.piso);
    var topo = el('div', 'cartao-fracao__topo');
    var letra = el('span', 'letra', f.fracao);
    letra.setAttribute('aria-hidden', 'true');
    topo.appendChild(letra);
    var nomes = el('div');
    nomes.appendChild(el('h3', 'cartao-fracao__nome', T.fracao + ' ' + f.fracao + ' · ' + f.tipologia));
    nomes.appendChild(el('p', 'cartao-fracao__piso', vazio(f.piso) ? '' : T.piso(f.piso)));
    topo.appendChild(nomes);
    li.appendChild(topo);

    var dl = el('dl', 'cartao-fracao__areas');
    [[T.area, formatarArea(f.area_total_m2)], [T.exterior, formatarArea(f.area_exterior_m2)],
      [T.estacionamento, formatarEstacionamento(f.estacionamento)]].forEach(function (par) {
      var d = el('div');
      d.appendChild(el('dt', '', par[0]));
      d.appendChild(el('dd', '', par[1]));
      dl.appendChild(d);
    });
    li.appendChild(dl);

    var base = el('div', 'cartao-fracao__base');
    base.appendChild(el('p', 'cartao-fracao__valor', valorOuEstado(f)));
    base.appendChild(botaoPlanta(f));
    li.appendChild(base);
    return li;
  }

  function iniciarValores() {
    var seccao = $('#fracoes');
    if (!seccao || !window.fetch) return;
    var fonte = seccao.getAttribute('data-fonte');
    if (!fonte) return;
    abrirPlanta = criarDialogoPlanta(fonte.replace(/data\/fracoes\.json$/, ''));

    fetch(fonte, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (lista) {
        if (!fracoesCompletas(lista)) throw new Error('faltam frações ou tipologias no JSON');
        lista = lista.slice().sort(function (a, b) { return a.fracao < b.fracao ? -1 : 1; });

        preencherTipologias(lista);

        // Resumo sempre visível
        var tipos = TIPOLOGIAS.filter(function (t) { return lista.some(function (f) { return f.tipologia === t; }); });
        $('[data-resumo="disponiveis"]', seccao).textContent = T.disponiveis.replace('{n}', lista.filter(disponivel).length);
        $('[data-resumo="desde"]', seccao).textContent = formatarPreco(minimo(lista));
        $('[data-resumo="tipologias"]', seccao).textContent = juntar(tipos);

        // Tabela e cartões
        var corpo = $('[data-linhas]', seccao);
        var cartoes = $('[data-cartoes]', seccao);
        lista.forEach(function (f) {
          corpo.appendChild(linhaTabela(f));
          cartoes.appendChild(cartaoFracao(f));
        });

        // Filtros
        var caixaFiltros = $('[data-filtros]', seccao);
        var contagem = $('[data-contagem]', seccao);
        var opcoes = [{ piso: null, rotulo: T.todas }].concat(filtrosDe(lista));
        var botoes = opcoes.map(function (o) {
          var b = el('button', 'filtro', o.rotulo);
          b.type = 'button';
          b.setAttribute('aria-pressed', o.piso === null ? 'true' : 'false');
          b.addEventListener('click', function () {
            botoes.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
            var n = 0;
            $$('[data-piso]', seccao).forEach(function (linha) {
              var mostra = o.piso === null || linha.getAttribute('data-piso') === String(o.piso);
              linha.hidden = !mostra;
              if (mostra && linha.tagName === 'TR') n++;
            });
            contagem.textContent = T.aMostrar(n);
          });
          caixaFiltros.appendChild(b);
          return b;
        });

        // Abrir e fechar a lista (começa fechada)
        var botao = $('[data-abrir-lista]', seccao);
        var rotulo = $('[data-rotulo]', botao);
        var listaEl = document.getElementById(botao.getAttribute('aria-controls'));
        var textoAbrir = T.verLista.replace('{n}', lista.length);
        rotulo.textContent = textoAbrir;
        botao.addEventListener('click', function () {
          var abrir = botao.getAttribute('aria-expanded') !== 'true';
          botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
          rotulo.textContent = abrir ? T.fecharLista : textoAbrir;
          listaEl.hidden = !abrir;
        });

        // «Ver plantas» (Arquitetura): vai à secção e abre a lista.
        $$('[data-mostrar-lista]').forEach(function (a) {
          a.addEventListener('click', function () {
            if (botao.getAttribute('aria-expanded') !== 'true') botao.click();
          });
        });
      })
      .catch(function (erro) {
        seccao.hidden = true;
        $$('a[href="#fracoes"]').forEach(function (a) { a.hidden = true; });
        if (window.console) console.warn('[OceanView 2] Frações e valores escondida:', erro.message || erro);
      });
  }

  /* ------------------------------------------------------ barra fixa */
  /* Abaixo de 900 px: aparece depois do hero e esconde-se enquanto o
     formulário estiver no ecrã (aí já há o botão de enviar). */
  function iniciarBarraFixa() {
    var barra = $('[data-barra-fixa]');
    var hero = $('.hero');
    var registo = $('#registo');
    if (!barra || !hero || !registo || !('IntersectionObserver' in window)) return;
    var visivel = { hero: true, registo: false };
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { visivel[e.target === hero ? 'hero' : 'registo'] = e.isIntersecting; });
      barra.hidden = visivel.hero || visivel.registo;
    });
    observador.observe(hero);
    observador.observe(registo);
  }

  /* ------------------------------------------------------------ movimento */
  function iniciarMovimento() {
    if (!('IntersectionObserver' in window)) return;
    if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('revelada');
        e.target.classList.remove('a-revelar');
        observador.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    // Só se esconde o que ainda está abaixo do ecrã.
    $$('[data-revelar]').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('a-revelar');
      observador.observe(el);
    });
  }

  /* ---------------------------------------------------------------- ano */
  function iniciarAno() {
    var ano = $('#ano');
    if (ano) ano.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------- arranque */
  function arrancar() {
    iniciarWhatsApp();
    iniciarEscolhas();
    iniciarFormulario();
    iniciarContador();
    iniciarValores();
    iniciarBarraFixa();
    iniciarMovimento();
    iniciarCookies();
    iniciarAno();

    if (window.console) {
      var porFazer = document.querySelectorAll('.todo').length;
      if (porFazer) console.info('[OceanView 2] ' + porFazer + ' marcadores TODO visíveis na página.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();

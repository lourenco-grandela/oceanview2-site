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
      fracao: 'Fração',
      quartos: { 'T1': '1', 'T2': '2', 'T2+2': '2 + 2' },
      descricao: {
        'T1': 'Um quarto, sala e cozinha.',
        'T2': 'Dois quartos.',
        'T2+2': 'Dois quartos e duas divisões extra.'
      },
      estados: { disponivel: 'Disponível', reservada: 'Reservada', vendida: 'Vendida' },
      precoConsulta: 'Preço sob consulta',
      local: 'pt-PT'
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
      fracao: 'Apartment',
      quartos: { 'T1': '1', 'T2': '2', 'T2+2': '2 + 2' },
      descricao: {
        'T1': 'One bedroom, living room and kitchen.',
        'T2': 'Two bedrooms.',
        'T2+2': 'Two bedrooms and two additional rooms.'
      },
      estados: { disponivel: 'Available', reservada: 'Reserved', vendida: 'Sold' },
      precoConsulta: 'Price on request',
      local: 'en-GB'
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

  function iniciarWhatsApp() {
    var numero = String(CFG.whatsapp || '').replace(/\D/g, '');
    var ligacoes = $$('[data-whatsapp]');
    var alternativas = $$('[data-sem-whatsapp]');

    if (!numero) {
      // TODO: sem número em config.js os botões ficam escondidos, para não
      // publicar ligações partidas. Preencher antes do lançamento.
      if (window.console) console.warn('[OceanView 2] Falta o número de WhatsApp em config.js.');
      return;
    }

    var url = 'https://wa.me/' + numero + '?text=' +
      encodeURIComponent(mensagemWhatsApp());

    ligacoes.forEach(function (a) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.hidden = false;
    });
    alternativas.forEach(function (el) { el.hidden = true; });
    $$('[data-whatsapp-item]').forEach(function (el) { el.hidden = false; });
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

    // Cartões de tipologia, ficha da fração e botões «Pedir plantas»: levam
    // ao formulário com a tipologia já escolhida.
    document.addEventListener('click', function (ev) {
      var alvo = ev.target.closest ? ev.target.closest('[data-pre-tipologia]') : null;
      if (!alvo) return;
      var grupo = $('[data-escolha="tipologia"]');
      if (grupo) escolher(grupo, alvo.getAttribute('data-pre-tipologia'));
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
    var numero = String(CFG.whatsapp || '').replace(/\D/g, '');
    if (!numero) return '';
    var url = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagemWhatsApp());
    return '<a href="' + url + '" target="_blank" rel="noopener">' +
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

  /* ------------------------------------------------- seletor de frações */
  /* A secção #fracoes está escrita no HTML com o atributo hidden e só aparece
     quando o data/fracoes.json tiver a tipologia das 12 frações. Nada aqui
     inventa valores: o que vier a null aparece como «—», e o preço a null
     como «Preço sob consulta». O caminho do JSON vem de data-fonte, para
     servir as duas línguas e qualquer subcaminho. */
  var TIPOLOGIAS = ['T1', 'T2', 'T2+2'];

  function fracoesCompletas(lista) {
    return Array.isArray(lista) && lista.length === 12 && lista.every(function (f) {
      return f && TIPOLOGIAS.indexOf(f.tipologia) !== -1;
    });
  }

  function formatarArea(valor) {
    if (valor === null || valor === undefined || valor === '') return '—';
    return Number(valor).toLocaleString(T.local, { maximumFractionDigits: 2 }) + ' m²';
  }

  function formatarPreco(valor) {
    if (valor === null || valor === undefined || valor === '') return T.precoConsulta;
    return Number(valor).toLocaleString(T.local, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }

  function mostrarFracao(seccao, f) {
    var imagens = { 'T1': 'quarto', 'T2': 'sala', 'T2+2': 'fachada-noite' };
    var ficha = $('[data-ficha]', seccao);
    $('[data-f="titulo"]', ficha).textContent = T.fracao + ' ' + f.fracao;
    $('[data-f="tipologia"]', ficha).textContent = f.tipologia;
    $('[data-f="descricao"]', ficha).textContent = T.descricao[f.tipologia] || '';
    $('[data-f="quartos"]', ficha).textContent = T.quartos[f.tipologia] || '—';
    $('[data-f="area"]', ficha).textContent = formatarArea(f.area_privativa_m2);
    $('[data-f="piso"]', ficha).textContent = (f.piso === null || f.piso === undefined || f.piso === '') ? '—' : String(f.piso);
    $('[data-f="preco"]', ficha).textContent = formatarPreco(f.preco);

    var estado = $('[data-f="estado"]', ficha);
    var chave = T.estados[f.estado] ? f.estado : 'disponivel';
    estado.textContent = T.estados[chave];
    estado.className = 'estado estado--' + chave;

    // A imagem é a da tipologia (ilustrativa), até haver planta por fração.
    var base = seccao.getAttribute('data-imagens') || 'assets/img/';
    var nome = imagens[f.tipologia];
    var foto = $('[data-f="imagem"]', ficha);
    $$('source', foto).forEach(function (s) {
      var tipo = s.type === 'image/avif' ? 'avif' : 'webp';
      s.srcset = [640, 1024, 1536].map(function (w) {
        return base + nome + '-' + w + '.' + tipo + ' ' + w + 'w';
      }).join(', ');
    });
    $('img', foto).src = base + nome + '-1024.webp';

    $$('[data-pre-tipologia]', ficha).forEach(function (a) {
      a.setAttribute('data-pre-tipologia', f.tipologia);
    });
  }

  function iniciarFracoes() {
    var seccao = $('#fracoes');
    if (!seccao || !window.fetch) return;
    var fonte = seccao.getAttribute('data-fonte');
    if (!fonte) return;

    fetch(fonte, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (lista) {
        if (!fracoesCompletas(lista)) return; // fica escondida
        var porLetra = {};
        lista.forEach(function (f) { porLetra[f.fracao] = f; });

        var chips = $$('[data-fracao]', seccao);
        chips.forEach(function (chip) {
          var f = porLetra[chip.getAttribute('data-fracao')];
          if (!f) { chip.hidden = true; return; }
          var chave = T.estados[f.estado] ? f.estado : 'disponivel';
          chip.setAttribute('aria-label', T.fracao + ' ' + f.fracao + ', ' + f.tipologia + ', ' + T.estados[chave]);
          if (chave !== 'disponivel') chip.classList.add('chip--indisponivel');
          chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
            mostrarFracao(seccao, f);
          });
        });

        var primeira = lista.filter(function (f) { return f.estado === 'disponivel'; })[0] || lista[0];
        var chipInicial = $('[data-fracao="' + primeira.fracao + '"]', seccao);
        if (chipInicial) chipInicial.setAttribute('aria-pressed', 'true');
        mostrarFracao(seccao, primeira);

        seccao.hidden = false;
        $$('[data-so-com-fracoes]').forEach(function (el) { el.hidden = false; });
      })
      .catch(function (erro) {
        if (window.console) console.info('[OceanView 2] Seletor de frações escondido:', erro.message || erro);
      });
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
    iniciarFracoes();
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

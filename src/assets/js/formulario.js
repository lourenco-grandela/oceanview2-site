/* OceanView 2 (v3) — registo de interesse em 4 passos e WhatsApp.
 *
 * Envia para a mesma aplicação web do Google Apps Script (FORM_URL em
 * config.js), com os mesmos campos da v2 e mais «fracao» e «lingua» (ver
 * formulario/Codigo.gs e docs/FORMULARIO.md). Os valores das escolhas seguem
 * sempre em português, nas duas línguas do site.
 */
(function () {
  'use strict';
  var CFG = window.OCEANVIEW || {};
  var form = document.querySelector('[data-form-registo]');
  var caixaTextos = document.querySelector('[data-form-textos]');
  if (!form || !caixaTextos) return;
  var T = JSON.parse(caixaTextos.textContent);
  var lingua = document.documentElement.lang.indexOf('en') === 0 ? 'en' : 'pt';
  var contactos = CFG.whatsappContactos || [];

  var passos = Array.prototype.slice.call(form.querySelectorAll('[data-passo]'));
  var barra = form.querySelectorAll('.passos__barra li');
  var btn = {
    voltar: form.querySelector('[data-voltar]'),
    seguinte: form.querySelector('[data-seguinte]'),
    enviar: form.querySelector('[data-enviar]')
  };
  var contagem = form.querySelector('[data-contagem] [data-n]');
  var estadoEl = form.querySelector('[data-estado]');
  var sucesso = document.querySelector('[data-sucesso]');
  var atual = 0;

  /* ---------- WhatsApp: escolha entre a Inês e o Carlos ---------- */
  function ligacoesWhatsApp(mensagem) {
    return contactos.map(function (c) {
      return '<a class="ligacao-seta" href="https://wa.me/' + c.numero + '?text=' + encodeURIComponent(mensagem) +
        '" target="_blank" rel="noopener">' + T.whatsapp + ' · ' + c.nome.split(' ')[0] +
        ' <span class="seta" aria-hidden="true">↗</span></a>';
    }).join('');
  }
  var lista = document.querySelector('[data-whatsapp-lista]');
  var msgBase = lingua === 'en' ? (CFG.whatsappMensagemEn || CFG.whatsappMensagem) : CFG.whatsappMensagem;
  if (lista && contactos.length && msgBase) lista.innerHTML = ligacoesWhatsApp(msgBase);

  /* ---------- Campos escondidos: origem da visita ---------- */
  function preencherEscondidos() {
    var q = new URLSearchParams(location.search);
    var guardado = {};
    try { guardado = JSON.parse(sessionStorage.getItem('ov2-utm') || '{}'); } catch (e) {}
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
      if (q.get(k)) guardado[k] = q.get(k).slice(0, 100);
    });
    try { sessionStorage.setItem('ov2-utm', JSON.stringify(guardado)); } catch (e) {}
    form.elements.utm_source.value = guardado.utm_source || '';
    form.elements.utm_medium.value = guardado.utm_medium || '';
    form.elements.utm_campaign.value = guardado.utm_campaign || CFG.utmCampanhaOmissao || '';
    form.elements.pagina.value = location.pathname;
  }
  preencherEscondidos();

  /* ---------- Fração vinda do explorador ou da tabela ---------- */
  function escolherFracao(l) {
    if (!l) return;
    var sel = form.elements.fracao;
    if (!sel.querySelector('option[value="' + l + '"]')) return;
    sel.value = l;
    var tip = sel.selectedOptions[0].textContent.split('·')[1];
    tip = tip && tip.trim();
    var radio = tip && form.querySelector('input[name="tipologia"][value="' + tip + '"]');
    if (radio) radio.checked = true;
  }
  try { escolherFracao(sessionStorage.getItem('ov2-fracao')); } catch (e) {}
  document.addEventListener('ov2:pedir-informacao', function (e) { escolherFracao(e.detail && e.detail.fracao); });

  /* ---------- Validação ---------- */
  function erro(nome, texto) {
    var bloco = form.querySelector('[data-campo="' + nome + '"]');
    if (!bloco) return;
    bloco.toggleAttribute('data-erro', !!texto);
    var campo = bloco.querySelector('input, textarea, select');
    if (campo) campo.setAttribute('aria-invalid', texto ? 'true' : 'false');
    var p = bloco.querySelector('.campo__erro');
    if (p) p.textContent = texto || '';
  }
  function validarPasso(i) {
    var problemas = [];
    var el = form.elements;
    if (i === 0) {
      var okNome = el.nome.value.trim().length >= 2;
      erro('nome', okNome ? '' : T.nome); if (!okNome) problemas.push(el.nome);
    }
    if (i === 1) {
      var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim());
      erro('email', okEmail ? '' : T.email); if (!okEmail) problemas.push(el.email);
      var okTel = el.telemovel.value.replace(/\D/g, '').length >= 9;
      erro('telemovel', okTel ? '' : T.telefone); if (!okTel) problemas.push(el.telemovel);
    }
    if (i === 3) {
      var okCons = el.consentimento.checked;
      erro('consentimento', okCons ? '' : T.consentimento); if (!okCons) problemas.push(el.consentimento);
    }
    if (problemas.length) problemas[0].focus();
    return !problemas.length;
  }
  form.addEventListener('input', function (e) {
    var bloco = e.target.closest('[data-campo]');
    if (bloco && bloco.hasAttribute('data-erro')) erro(bloco.dataset.campo, '');
  });

  /* ---------- Passos ---------- */
  function mostrar(i, focar) {
    atual = i;
    passos.forEach(function (p, k) { p.hidden = k !== i; });
    Array.prototype.forEach.call(barra, function (li, k) {
      li.classList.toggle('is-atual', k === i);
      li.classList.toggle('is-feito', k < i);
    });
    contagem.textContent = '0' + (i + 1);
    btn.voltar.hidden = i === 0;
    btn.seguinte.hidden = i === passos.length - 1;
    btn.enviar.hidden = i !== passos.length - 1;
    if (focar) {
      var legenda = passos[i].querySelector('legend');
      var primeiro = passos[i].querySelector('input:not([type="hidden"]):not([tabindex="-1"]), textarea, select');
      (primeiro || legenda).focus({ preventScroll: true });
      var topo = form.getBoundingClientRect().top;
      if (topo < 0 || topo > innerHeight * 0.6) form.scrollIntoView({ block: 'start' });
    }
  }
  btn.seguinte.addEventListener('click', function () {
    if (validarPasso(atual)) mostrar(atual + 1, true);
  });
  btn.voltar.addEventListener('click', function () { mostrar(atual - 1, true); });
  // Enter num campo de texto avança em vez de enviar o formulário a meio.
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && atual < passos.length - 1) {
      e.preventDefault();
      btn.seguinte.click();
    }
  });

  /* ---------- Contador da mensagem ---------- */
  var msg = form.elements.mensagem, contador = form.querySelector('[data-contador]');
  function contar() {
    var resta = 500 - msg.value.length;
    contador.textContent = resta <= 0 ? T.limite : (resta <= 100 ? T.faltam.replace('{n}', resta) : '');
  }
  msg.addEventListener('input', contar);

  /* ---------- Envio ---------- */
  function valor(nome) {
    var c = form.elements[nome];
    if (!c) return '';
    if (c instanceof RadioNodeList || (c.length && c[0] && c[0].type === 'radio')) {
      var marcado = form.querySelector('input[name="' + nome + '"]:checked');
      return marcado ? marcado.value : '';
    }
    return String(c.value || '').trim();
  }
  function dados() {
    return {
      nome: valor('nome'), email: valor('email'), telefone: valor('telemovel'),
      consentimento: !!form.elements.consentimento.checked,
      tipologia: valor('tipologia'), fracao: valor('fracao'), finalidade: valor('finalidade'),
      prazo: valor('prazo'), mensagem: valor('mensagem'),
      origem: valor('utm_source'), meio: valor('utm_medium'), campanha: valor('utm_campaign'),
      pagina: valor('pagina'), lingua: lingua, empresa: valor('empresa')
    };
  }
  function pedido(d, semLeitura) {
    return fetch(CFG.FORM_URL, {
      method: 'POST',
      mode: semLeitura ? 'no-cors' : 'cors',
      // text/plain evita o pedido prévio de CORS ao Apps Script.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(d)
    });
  }
  function enviar(d) {
    return pedido(d).then(function (r) {
      if (!r.ok) throw new Error('resposta ' + r.status);
      return r.json();
    }).then(function (res) {
      if (!res || res.ok !== true) throw new Error((res && res.erro) || 'recusado');
      return res;
    }).catch(function (e) {
      // Só um erro de rede ou a leitura bloqueada justifica repetir sem leitura.
      if (!(e instanceof TypeError)) throw e;
      return pedido(d, true).then(function () { return { ok: true, semLeitura: true }; });
    });
  }
  function falhou(texto) {
    var d = dados();
    var m = d.fracao ? T.mensagemFracao.replace('{f}', d.fracao) : msgBase;
    estadoEl.innerHTML = '<p>' + texto + '</p><div class="passos__whatsapp">' + ligacoesWhatsApp(m || '') + '</div>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    for (var i = 0; i < passos.length; i++) {
      if (!validarPasso(i)) { mostrar(i, false); validarPasso(i); return; }
    }
    if (!CFG.FORM_URL) { falhou(T.semLigacao); return; }
    btn.enviar.disabled = true;
    estadoEl.textContent = T.aEnviar;
    enviar(dados()).then(function () {
      form.hidden = true;
      sucesso.hidden = false;
      sucesso.focus();
      try { sessionStorage.removeItem('ov2-fracao'); } catch (err) {}
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_id: 'registo-interesse' });
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    }).catch(function () {
      btn.enviar.disabled = false;
      falhou(T.erro);
    });
  });

  form.classList.add('is-js');
  mostrar(0, false);
})();

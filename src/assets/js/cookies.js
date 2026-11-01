/* OceanView 2 (v3) — consentimento de cookies. GA4 e píxel da Meta só são
   carregados depois de aceites (IDs em config.js). Mesma chave da v2, por
   isso a escolha de quem já visitou o site mantém-se. */
(function () {
  'use strict';
  var CFG = window.OCEANVIEW || {};
  var CHAVE = 'oceanview2:consentimento';
  var banner = document.querySelector('[data-cookies-banner]');
  var dialogo = document.querySelector('[data-cookies-dialogo]');
  if (!banner || !dialogo) return;
  var carregado = { medicao: false, marketing: false };

  function ler() {
    try { var g = localStorage.getItem(CHAVE); return g ? JSON.parse(g) : null; } catch (e) { return null; }
  }
  function gravar(medicao, marketing) {
    var v = { medicao: !!medicao, marketing: !!marketing, data: new Date().toISOString(), versao: 1 };
    try { localStorage.setItem(CHAVE, JSON.stringify(v)); } catch (e) {}
    aplicar(v);
    banner.hidden = true;
  }
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
  function carregarMeta(id) {
    if (carregado.marketing || !id) return;
    carregado.marketing = true;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  }
  function aplicar(v) {
    if (!v) return;
    if (v.medicao) carregarGA4(CFG.ga4);
    if (v.marketing) carregarMeta(CFG.metaPixel);
  }
  function abrir() {
    var v = ler() || {};
    dialogo.querySelector('#cookie-medicao').checked = !!v.medicao;
    dialogo.querySelector('#cookie-marketing').checked = !!v.marketing;
    if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute('open', '');
  }

  var guardado = ler();
  if (guardado) aplicar(guardado);
  else {
    // Mostrar depois das letras: o banner aparece já com a altura final.
    var feito = false;
    var mostrar = function () { if (!feito) { feito = true; banner.hidden = false; } };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(mostrar);
    setTimeout(mostrar, 1500);
  }
  banner.querySelector('[data-cookies-aceitar]').addEventListener('click', function () { gravar(true, true); });
  banner.querySelector('[data-cookies-recusar]').addEventListener('click', function () { gravar(false, false); });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookies-abrir]')) abrir();
  });
  dialogo.querySelector('[data-cookies-fechar]').addEventListener('click', function () { dialogo.close(); });
  dialogo.querySelector('[data-cookies-form]').addEventListener('submit', function () {
    gravar(dialogo.querySelector('#cookie-medicao').checked, dialogo.querySelector('#cookie-marketing').checked);
  });
})();

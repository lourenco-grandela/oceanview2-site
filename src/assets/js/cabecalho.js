/* OceanView 2 (v3) — cabeçalho, menu em ecrã inteiro e revelação ao rolar. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var base = document.body.dataset.base || '/';
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Cabeçalho: fundo ao rolar, esconde ao descer ---------- */
  var cab = document.querySelector('[data-cabecalho]');
  var ultimoY = window.scrollY;
  var pendente = false;
  function aoRolar() {
    pendente = false;
    var y = window.scrollY;
    cab.classList.toggle('is-rolado', y > 24);
    var descer = y > ultimoY && y > 320;
    if (Math.abs(y - ultimoY) > 6) cab.classList.toggle('is-escondido', descer && !document.body.classList.contains('menu-aberto'));
    ultimoY = y;
  }
  if (cab) {
    window.addEventListener('scroll', function () {
      if (!pendente) { pendente = true; requestAnimationFrame(aoRolar); }
    }, { passive: true });
    aoRolar();
    cab.addEventListener('focusin', function () { cab.classList.remove('is-escondido'); });
  }

  /* ---------- Menu em ecrã inteiro ---------- */
  var menu = document.querySelector('[data-menu]');
  var abrir = document.querySelector('[data-menu-abrir]');
  var fechar = menu && menu.querySelector('[data-menu-fechar]');
  var imagem = menu && menu.querySelector('[data-menu-imagem]');
  var temporizador;

  function focaveis() {
    return Array.prototype.filter.call(
      menu.querySelectorAll('a[href], button:not([disabled])'),
      function (el) { return el.offsetParent !== null; });
  }

  function abrirMenu() {
    clearTimeout(temporizador);
    menu.hidden = false;
    document.body.classList.add('menu-aberto');
    abrir.setAttribute('aria-expanded', 'true');
    // Dois quadros para a transição de entrada arrancar a partir do estado fechado.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        menu.classList.add('is-aberto');
        fechar.focus({ preventScroll: true });
      });
    });
    temporizador = setTimeout(function () { menu.classList.add('is-pronto'); }, reduzido.matches ? 0 : 1100);
    document.addEventListener('keydown', teclado);
  }

  function fecharMenu(semFoco) {
    clearTimeout(temporizador);
    menu.classList.remove('is-aberto', 'is-pronto');
    abrir.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', teclado);
    temporizador = setTimeout(function () {
      menu.hidden = true;
      document.body.classList.remove('menu-aberto');
    }, reduzido.matches ? 0 : 850);
    if (!semFoco) abrir.focus({ preventScroll: true });
  }

  function teclado(e) {
    if (e.key === 'Escape') { e.preventDefault(); fecharMenu(); return; }
    if (e.key !== 'Tab') return;
    var lista = focaveis();
    if (!lista.length) return;
    var primeiro = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  }

  function trocarImagem(nome) {
    if (!imagem || !nome) return;
    var src = base + 'assets/img/' + nome + '-1024.webp';
    if (imagem.getAttribute('src') === src) return;
    imagem.classList.add('is-trocar');
    var nova = new Image();
    nova.onload = function () {
      imagem.src = src;
      imagem.classList.remove('is-trocar');
    };
    nova.src = src;
  }

  if (menu && abrir) {
    abrir.addEventListener('click', abrirMenu);
    fechar.addEventListener('click', function () { fecharMenu(); });
    menu.querySelectorAll('.menu-ecra__ligacao').forEach(function (a) {
      var nome = a.getAttribute('data-imagem');
      a.addEventListener('mouseenter', function () { trocarImagem(nome); });
      a.addEventListener('focus', function () { trocarImagem(nome); });
    });
    // Ligações para a própria página (ex.: âncoras) fecham o menu.
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (a && a.pathname === location.pathname && a.hash) fecharMenu(true);
    });
  }

  /* ---------- Revelação ao rolar ---------- */
  var alvos = document.querySelectorAll('[data-revelar]');
  if ('IntersectionObserver' in window && alvos.length) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visivel'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    alvos.forEach(function (el) { obs.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('is-visivel'); });
  }
})();

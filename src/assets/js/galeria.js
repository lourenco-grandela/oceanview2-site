/* OceanView 2 (v3) — visualizador da galeria: setas, teclado e toque. */
(function () {
  'use strict';
  var d = document.querySelector('[data-visualizador]');
  if (!d) return;
  var botoes = Array.prototype.slice.call(document.querySelectorAll('[data-galeria-abrir]'));
  var img = d.querySelector('[data-visualizador-img]');
  var leg = d.querySelector('[data-visualizador-legenda]');
  var cont = d.querySelector('[data-visualizador-contagem]');
  var atual = 0, origem = null;

  function mostrar(i) {
    atual = (i + botoes.length) % botoes.length;
    var b = botoes[atual], miniatura = b.querySelector('img');
    img.src = b.dataset.maior;
    img.alt = miniatura ? miniatura.alt : '';
    leg.textContent = b.dataset.legenda;
    cont.textContent = (atual + 1) + ' / ' + botoes.length;
    // Pré-carregar a seguinte
    var s = botoes[(atual + 1) % botoes.length];
    if (s) { var pre = new Image(); pre.src = s.dataset.maior; }
  }
  botoes.forEach(function (b, i) {
    b.addEventListener('click', function () {
      origem = b;
      mostrar(i);
      if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    });
  });
  d.querySelector('[data-visualizador-ant]').addEventListener('click', function () { mostrar(atual - 1); });
  d.querySelector('[data-visualizador-seg]').addEventListener('click', function () { mostrar(atual + 1); });
  d.querySelector('[data-visualizador-fechar]').addEventListener('click', function () { d.close(); });
  d.addEventListener('close', function () { if (origem) origem.focus(); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(atual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(atual + 1); }
  });
  d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  var x0 = null;
  d.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  d.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();

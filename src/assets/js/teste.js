/* Escolha do par de letras em teste: aplica ao site inteiro (menu e explorador
   incluídos) e guarda a escolha neste browser. */
(function () {
  'use strict';
  var botoes = document.querySelectorAll('[data-par-escolher]');
  function marcar(par) {
    botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.parEscolher === par)); });
  }
  function aplicar(par) {
    if (par === '1') delete document.documentElement.dataset.par;
    else document.documentElement.dataset.par = par;
    try { localStorage.setItem('ov2-par', par); } catch (e) {}
    marcar(par);
  }
  botoes.forEach(function (b) { b.addEventListener('click', function () { aplicar(b.dataset.parEscolher); }); });
  marcar(document.documentElement.dataset.par || '1');
})();

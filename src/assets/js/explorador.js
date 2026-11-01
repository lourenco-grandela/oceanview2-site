/* OceanView 2 (v3) — explorador de frações.
 *
 * Imagem principal: axonometria branca do edifício com um polígono por piso
 * (data/explorador/explorador.json → axonometrica.pisos). Escolher um piso ou
 * uma fração acende o piso. Polígonos por fração na axonometria são opcionais
 * (axonometrica.fracoes): só se desenham quando estiver confirmado que
 * fachada corresponde a que lado das plantas.
 *
 * Por baixo: a planta vetorial do piso (data/explorador/<piso>.svg) com os
 * polígonos de cada fração (fracoes-poligonos.json, no viewBox de cada SVG).
 * A fração selecionada acende na planta, com a etiqueta escura «C · DISPONÍVEL».
 *
 * Os dados das frações vêm todos de data/fracoes.json; nada é escrito à mão.
 */
(function () {
  'use strict';
  var raiz = document.querySelector('[data-explorador]');
  if (!raiz) return;

  var SVGNS = 'http://www.w3.org/2000/svg';
  var base = raiz.dataset.base || '/';
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var T = JSON.parse(raiz.querySelector('[data-explorador-textos]').textContent);
  var el = {
    axo: raiz.querySelector('[data-axo]'),
    pisoAtivo: raiz.querySelector('[data-piso-ativo]'),
    palco: raiz.querySelector('[data-palco]'),
    plantaLegenda: raiz.querySelector('[data-planta-legenda]'),
    marcador: raiz.querySelector('[data-marcador]'),
    pisos: raiz.querySelector('[data-pisos]'),
    fracoes: raiz.querySelector('[data-fracoes]'),
    selecionada: raiz.querySelector('[data-selecionada]'),
    dialogo: raiz.querySelector('[data-planta-dialogo]')
  };

  var cfg, site, poligonos, dados = {};
  var axoPisos = {}, axoFracoes = {}, plantaEls = {}, cachePlantas = {};
  var estado = { piso: null, fracao: null };

  function obter(url) {
    return fetch(base + url.replace(/^\//, ''), { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ': ' + r.status);
      return url.slice(-4) === '.svg' ? r.text() : r.json();
    });
  }
  function infoPiso(id) { return cfg.pisos.filter(function (p) { return p.id === id; })[0]; }

  /* ---------- Formatação ---------- */
  function area(n) {
    if (n == null) return '—';
    return n.toLocaleString(T.lang === 'pt' ? 'pt-PT' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²';
  }
  function preco(n) {
    if (n == null || !site.mostrar_precos) return T.sobConsulta;
    var s = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, T.lang === 'pt' ? '.' : ',');
    return T.lang === 'pt' ? s + ' €' : '€' + s;
  }
  function nomePiso(f) {
    var p = infoPiso('piso-' + f.piso);
    return f.area_sotao_m2 ? T.pisoSotao : (p ? p.nome[T.lang] : T.piso + ' ' + f.piso);
  }
  function textoEstado(f) { return T.estados[f.estado] || f.estado; }

  /* ---------- Geometria ---------- */
  function normalizar(mapa) {
    var out = {};
    Object.keys(mapa || {}).forEach(function (k) {
      if (k.charAt(0) === '_') return;
      var pts = mapa[k];
      if (typeof pts === 'string') pts = pts.trim().split(/\s+/).map(function (par) { return par.split(',').map(Number); });
      out[k] = pts;
    });
    return out;
  }
  function normalizarPoligonos(bruto) {
    var pisos = bruto.pisos || bruto, out = {};
    Object.keys(pisos).forEach(function (id) {
      if (id.charAt(0) === '_') return;
      var p = pisos[id];
      var fr = normalizar(p.fracoes || p), mapa = {};
      Object.keys(fr).forEach(function (l) { mapa[l.toUpperCase()] = fr[l]; });
      out[id] = { viewBox: p.viewBox, fracoes: mapa };
    });
    return out;
  }
  function dentro(pts, x, y) {
    var ok = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ok = !ok;
    }
    return ok;
  }
  function distSeg(x, y, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)));
    var px = a[0] + t * dx - x, py = a[1] + t * dy - y;
    return Math.sqrt(px * px + py * py);
  }
  // Ponto bem dentro do polígono (para a letra), também em frações em L.
  function centro(pts) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var melhor = [(x0 + x1) / 2, (y0 + y1) / 2], dist = -1, N = 24;
    for (var a = 1; a < N; a++) {
      for (var b = 1; b < N; b++) {
        var x = x0 + (x1 - x0) * a / N, y = y0 + (y1 - y0) * b / N;
        if (!dentro(pts, x, y)) continue;
        var d = Infinity;
        for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) d = Math.min(d, distSeg(x, y, pts[j], pts[i]));
        if (d > dist) { dist = d; melhor = [x, y]; }
      }
    }
    return { x: melhor[0], y: melhor[1], raio: dist };
  }
  function poligono(pts, classe, chave, comLetra) {
    var g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', classe);
    g.dataset.chave = chave;
    var poly = document.createElementNS(SVGNS, 'polygon');
    poly.setAttribute('points', pts.map(function (p) { return p.join(','); }).join(' '));
    g.appendChild(poly);
    if (comLetra) {
      var c = centro(pts);
      var txt = document.createElementNS(SVGNS, 'text');
      txt.setAttribute('x', c.x.toFixed(1));
      txt.setAttribute('y', c.y.toFixed(1));
      txt.setAttribute('font-size', Math.max(18, Math.min(46, c.raio * 0.9)).toFixed(1));
      txt.textContent = chave;
      g.appendChild(txt);
    }
    return g;
  }

  /* ---------- Axonometria (pisos e, se houver, frações) ---------- */
  function desenharAxo() {
    var ax = cfg.axonometrica;
    el.axo.setAttribute('viewBox', '0 0 ' + ax.largura + ' ' + ax.altura);
    var pisos = normalizar(ax.pisos);
    Object.keys(pisos).forEach(function (id) {
      var g = poligono(pisos[id], 'exp-axo-piso', id, false);
      g.addEventListener('mouseenter', function () { destacarPiso(id, true); });
      g.addEventListener('mouseleave', function () { destacarPiso(id, false); });
      g.addEventListener('click', function () { mudarPiso(id); });
      el.axo.appendChild(g);
      axoPisos[id] = g;
    });
    var fr = normalizar(ax.fracoes);
    Object.keys(fr).forEach(function (l) {
      var g = poligono(fr[l], 'exp-axo-fracao', l.toUpperCase(), false);
      g.addEventListener('click', function () { selecionar(l.toUpperCase(), true); });
      el.axo.appendChild(g);
      axoFracoes[l.toUpperCase()] = g;
    });
  }
  function destacarPiso(id, ligado) {
    if (axoPisos[id]) axoPisos[id].classList.toggle('is-destaque', ligado);
    var b = el.pisos.querySelector('[data-piso="' + id + '"]');
    if (b) b.classList.toggle('is-destaque', ligado);
  }

  /* ---------- Planta do piso ---------- */
  function letrasDoPiso(piso) { return Object.keys((poligonos[piso] || {}).fracoes || {}).sort(); }

  function mostrarPlanta(piso) {
    var info = infoPiso(piso);
    var pedido = cachePlantas[piso] || (cachePlantas[piso] = obter(info.planta));
    return pedido.then(function (texto) {
      var tmp = document.createElement('div');
      tmp.innerHTML = texto;
      var svg = tmp.querySelector('svg');
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.setAttribute('class', 'exp-planta');
      svg.setAttribute('focusable', 'false');
      var p = poligonos[piso];
      if (p && p.viewBox && !svg.getAttribute('viewBox')) svg.setAttribute('viewBox', p.viewBox.join(' '));
      plantaEls = {};
      var g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'exp-poligonos');
      Object.keys(p ? p.fracoes : {}).sort().forEach(function (l) {
        var f = poligono(p.fracoes[l], 'exp-fracao' + (dados[l] ? ' exp-fracao--' + dados[l].estado : ''), l, true);
        f.addEventListener('mouseenter', function () { destacar(l, true); });
        f.addEventListener('mouseleave', function () { destacar(l, false); });
        f.addEventListener('click', function () { selecionar(l, true); });
        g.appendChild(f);
        plantaEls[l] = f;
      });
      svg.appendChild(g);
      el.palco.replaceChildren(svg);
      el.plantaLegenda.textContent = T.plantaDoPiso.replace('{p}', info.nome[T.lang]);
    });
  }

  /* ---------- Painel ---------- */
  function desenharBotoesPisos() {
    el.pisos.innerHTML = cfg.pisos.map(function (p) {
      return '<button type="button" class="exp-piso" data-piso="' + p.id + '" aria-pressed="false">' +
        '<span class="exp-piso__nome">' + p.nome[T.lang] + '</span>' +
        '<span class="exp-piso__conta">' + letrasDoPiso(p.id).length + ' ' + T.fracoes + '</span></button>';
    }).join('');
  }

  function desenharBotoesFracoes() {
    el.fracoes.innerHTML = letrasDoPiso(estado.piso).map(function (l) {
      var f = dados[l];
      return '<button type="button" class="exp-res exp-res--' + f.estado + '" data-fracao="' + l + '" aria-pressed="false">' +
        '<span class="exp-res__letra"><span class="visualmente-escondido">' + T.fracao + ' </span>' + l + '</span>' +
        '<span class="exp-res__info"><span>' + f.tipologia + '</span><span>' + textoEstado(f) + '</span></span>' +
        '</button>';
    }).join('');
  }

  function destacar(l, ligado) {
    if (plantaEls[l]) plantaEls[l].classList.toggle('is-destaque', ligado);
    if (axoFracoes[l]) axoFracoes[l].classList.toggle('is-destaque', ligado);
    var b = el.fracoes.querySelector('[data-fracao="' + l + '"]');
    if (b) b.classList.toggle('is-destaque', ligado);
  }

  function mudarPiso(piso) {
    if (piso === estado.piso) return Promise.resolve();
    estado.piso = piso;
    el.pisos.querySelectorAll('[data-piso]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.piso === piso));
    });
    Object.keys(axoPisos).forEach(function (id) { axoPisos[id].classList.toggle('is-ativo', id === piso); });
    el.pisoAtivo.textContent = infoPiso(piso).nome[T.lang];
    raiz.classList.add('is-a-mudar');
    var espera = new Promise(function (r) { setTimeout(r, reduzido.matches ? 0 : 220); });
    return Promise.all([mostrarPlanta(piso), espera]).then(function () {
      desenharBotoesFracoes();
      var letras = letrasDoPiso(piso);
      // Mantém a fração se existir neste piso (ex.: I no Piso 2 e no Sótão).
      var alvo = letras.indexOf(estado.fracao) !== -1 ? estado.fracao : letras[0];
      estado.fracao = null;
      selecionar(alvo, false);
      requestAnimationFrame(function () { raiz.classList.remove('is-a-mudar'); });
    });
  }

  function guardarNaMorada(l) {
    try {
      var u = new URL(location.href);
      u.searchParams.set('fracao', l);
      history.replaceState(null, '', u);
    } catch (e) {}
  }

  function selecionar(l, pelaInterface) {
    var f = dados[l];
    if (!f) return;
    if (pelaInterface) guardarNaMorada(l);
    if (letrasDoPiso(estado.piso).indexOf(l) === -1) {
      estado.fracao = l;
      mudarPiso('piso-' + f.piso);
      return;
    }
    estado.fracao = l;
    Object.keys(plantaEls).forEach(function (k) { plantaEls[k].classList.toggle('is-selecionada', k === l); });
    Object.keys(axoFracoes).forEach(function (k) { axoFracoes[k].classList.toggle('is-selecionada', k === l); });
    el.fracoes.querySelectorAll('[data-fracao]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.fracao === l));
    });
    el.marcador.hidden = false;
    el.marcador.className = 'explorador__marcador exp-marcador--' + f.estado;
    el.marcador.innerHTML = '<span class="exp-marcador__letra">' + l + '</span><span aria-hidden="true">·</span><span>' + textoEstado(f) + '</span>';
    painel(f);
  }

  function painel(f) {
    var l = f.fracao;
    var linhas = [
      [T.tipologia, f.tipologia],
      [T.piso, nomePiso(f)],
      [T.areaPrivativa, area(f.area_privativa_m2)],
      [T.areaTotal, area(f.area_total_m2) + (f.area_sotao_m2 ? ' <small>(' + T.incluiSotao + ')</small>' : '')],
      [T.exterior, area(f.area_exterior_m2)],
      [T.estacionamento, f.estacionamento ? area(f.estacionamento).replace(/[,.]00 /, ' ') : '—'],
      [T.valor, preco(f.preco)]
    ];
    var contactos = (window.OCEANVIEW && window.OCEANVIEW.whatsappContactos) || [];
    var mensagem = encodeURIComponent(T.whatsappMensagem.replace('{f}', l));
    var whats = contactos.map(function (c) {
      return '<a class="ligacao-seta" href="https://wa.me/' + c.numero + '?text=' + mensagem + '" target="_blank" rel="noopener">' +
        T.whatsapp + ' · ' + c.nome.split(' ')[0] + ' <span class="seta" aria-hidden="true">↗</span></a>';
    }).join('');

    el.selecionada.innerHTML =
      '<div class="exp-sel__topo"><span class="etiqueta">' + el.selecionada.dataset.rotulo + '</span>' +
        '<span class="estado estado--' + f.estado + '">' + textoEstado(f) + '</span></div>' +
      '<p class="exp-sel__letra"><span class="visualmente-escondido">' + T.fracao + ' </span>' + l + '</p>' +
      '<dl class="exp-sel__dados">' + linhas.map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
      }).join('') + '</dl>' +
      '<div class="exp-sel__acoes">' +
        (f.planta_pdf ? '<a class="botao botao--linha" href="' + base + f.planta_pdf + '" target="_blank" rel="noopener">' + T.verPlanta + ' <span class="seta" aria-hidden="true">↗</span></a>' : '') +
        '<a class="botao" href="#contacto" data-pedir="' + l + '">' + T.pedirInfo + ' <span class="seta" aria-hidden="true">↗</span></a>' +
      '</div>' +
      (f.planta_img ? '<button type="button" class="exp-sel__planta" data-ver-planta="' + l + '">' +
        '<img src="' + base + f.planta_img + '" alt="" width="1075" height="1521" decoding="async">' +
        '<span class="ligacao-seta">' + T.verPlantaImagem + ' <span class="seta" aria-hidden="true">↗</span></span></button>' : '') +
      (whats ? '<div class="exp-sel__whatsapp">' + whats + '</div>' : '');
  }

  function abrirPlanta(l) {
    var f = dados[l], d = el.dialogo;
    d.querySelector('[data-planta-titulo]').textContent = T.fracao + ' ' + l + ' · ' + f.tipologia;
    var img = d.querySelector('[data-planta-img]');
    img.src = base + f.planta_img;
    img.alt = T.verPlantaImagem + ' ' + l + ' (' + f.tipologia + ', ' + nomePiso(f) + ')';
    d.querySelector('[data-planta-pdf]').href = base + f.planta_pdf;
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  }

  function ligarEventos() {
    el.selecionada.dataset.rotulo = el.selecionada.querySelector('.etiqueta').textContent;
    el.pisos.addEventListener('click', function (e) {
      var b = e.target.closest('[data-piso]');
      if (b) mudarPiso(b.dataset.piso);
    });
    ['mouseover', 'focusin'].forEach(function (ev) {
      el.pisos.addEventListener(ev, function (e) { var b = e.target.closest('[data-piso]'); if (b) destacarPiso(b.dataset.piso, true); });
      el.fracoes.addEventListener(ev, function (e) { var b = e.target.closest('[data-fracao]'); if (b) destacar(b.dataset.fracao, true); });
    });
    ['mouseout', 'focusout'].forEach(function (ev) {
      el.pisos.addEventListener(ev, function (e) { var b = e.target.closest('[data-piso]'); if (b) destacarPiso(b.dataset.piso, false); });
      el.fracoes.addEventListener(ev, function (e) { var b = e.target.closest('[data-fracao]'); if (b) destacar(b.dataset.fracao, false); });
    });
    el.fracoes.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fracao]');
      if (b) selecionar(b.dataset.fracao, true);
    });
    // Setas entre residências (grelha de duas colunas)
    el.fracoes.addEventListener('keydown', function (e) {
      var passo = { ArrowRight: 1, ArrowDown: 2, ArrowLeft: -1, ArrowUp: -2 }[e.key];
      if (!passo) return;
      var bs = Array.prototype.slice.call(el.fracoes.querySelectorAll('[data-fracao]'));
      var i = bs.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      bs[Math.max(0, Math.min(bs.length - 1, i + passo))].focus();
    });
    el.selecionada.addEventListener('click', function (e) {
      var v = e.target.closest('[data-ver-planta]');
      if (v) { abrirPlanta(v.dataset.verPlanta); return; }
      var p = e.target.closest('[data-pedir]');
      if (p) {
        // O formulário lê a fração daqui e preenche-a.
        try { sessionStorage.setItem('ov2-fracao', p.dataset.pedir); } catch (err) {}
        document.dispatchEvent(new CustomEvent('ov2:pedir-informacao', { detail: { fracao: p.dataset.pedir } }));
      }
    });
    var d = el.dialogo;
    d.querySelector('[data-planta-fechar]').addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    // Ligações «?fracao=X#explorador» na mesma página (tabela): seleciona sem recarregar.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="?fracao="]');
      if (!a) return;
      var l = new URL(a.href).searchParams.get('fracao');
      if (!dados[l]) return;
      e.preventDefault();
      selecionar(l, true);
      raiz.scrollIntoView({ behavior: reduzido.matches ? 'auto' : 'smooth' });
    });
  }

  function fracaoInicial() {
    var q = new URLSearchParams(location.search).get('fracao');
    var h = /^#fracao-([a-l])$/i.exec(location.hash);
    var l = (q || (h && h[1]) || '').toUpperCase();
    return dados[l] ? l : null;
  }

  /* ---------- Arranque ---------- */
  // O explorador fica abaixo da primeira dobra: só arranca quando se aproxima
  // (ou logo, se a morada pedir uma fração), para não pesar no carregamento.
  function arrancar() {
  Promise.all([
    obter('data/explorador/explorador.json'),
    obter('data/fracoes.json'),
    obter('data/site.json').catch(function () { return { mostrar_precos: true }; })
  ]).then(function (r) {
    cfg = r[0];
    r[1].forEach(function (f) { dados[f.fracao] = f; });
    site = r[2];
    return obter(cfg.poligonos);
  }).then(function (pol) {
    poligonos = normalizarPoligonos(pol);
    if (cfg.axonometrica) desenharAxo();
    ligarEventos();
    desenharBotoesPisos();
    var l = fracaoInicial();
    if (l) estado.fracao = l;
    return mudarPiso(l ? 'piso-' + dados[l].piso : (cfg.piso_inicial || cfg.pisos[cfg.pisos.length - 1].id));
  }).then(function () {
    raiz.classList.add('is-pronto');
  }).catch(function (erro) {
    console.error('Explorador:', erro);
    raiz.classList.add('is-erro');
  });
  }

  if (/[?&]fracao=|#fracao-|#explorador/.test(location.search + location.hash) || !('IntersectionObserver' in window)) {
    arrancar();
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      if (entradas.some(function (e) { return e.isIntersecting; })) { obs.disconnect(); arrancar(); }
    }, { rootMargin: '800px 0px' });
    obs.observe(raiz);
  }
})();

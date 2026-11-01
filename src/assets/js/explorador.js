/* OceanView 2 (v3) — explorador de frações.
 *
 * Fase 1 (modo «pisos»): a imagem principal é a planta vetorial do piso
 * (data/explorador/<piso>.svg), com os polígonos de cada fração por cima
 * (data/explorador/fracoes-poligonos.json, no viewBox de cada SVG).
 * Fase 2 (modo «axonometrica»): uma só imagem do edifício com um polígono por
 * fração; os pisos passam a filtrar. Só muda a «vista»; a lista, o painel e a
 * sincronia ficam iguais.
 *
 * Os dados das frações vêm todos de data/fracoes.json; nada é escrito à mão.
 */
(function () {
  'use strict';
  var raiz = document.querySelector('[data-explorador]');
  if (!raiz) return;

  var SVGNS = 'http://www.w3.org/2000/svg';
  var base = raiz.dataset.base || '/';
  var T = JSON.parse(raiz.querySelector('[data-explorador-textos]').textContent);
  var el = {
    palco: raiz.querySelector('[data-palco]'),
    marcador: raiz.querySelector('[data-marcador]'),
    faixa: raiz.querySelector('[data-faixa]'),
    nota: raiz.querySelector('[data-nota-provisoria]'),
    pisos: raiz.querySelector('[data-pisos]'),
    fracoes: raiz.querySelector('[data-fracoes]'),
    selecionada: raiz.querySelector('[data-selecionada]'),
    dialogo: raiz.querySelector('[data-planta-dialogo]')
  };

  var cfg, dados = {}, site, poligonos, vista;
  var estado = { piso: null, fracao: null };

  function obter(url) {
    return fetch(base + url.replace(/^\//, ''), { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ': ' + r.status);
      return url.slice(-4) === '.svg' ? r.text() : r.json();
    });
  }

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
    var p = cfg.pisos.filter(function (x) { return x.id === 'piso-' + f.piso; })[0];
    var nome = p ? p.nome[T.lang] : T.piso + ' ' + f.piso;
    return f.area_sotao_m2 ? T.pisoSotao : nome;
  }
  function textoEstado(f) { return T.estados[f.estado] || f.estado; }
  function etiquetaEstado(f) {
    return '<span class="estado estado--' + f.estado + '">' + textoEstado(f) + '</span>';
  }

  /* ---------- Polígonos: normalizar formatos ---------- */
  function normalizarPoligonos(bruto) {
    var pisos = bruto.pisos || bruto;
    var out = {};
    Object.keys(pisos).forEach(function (id) {
      if (id.charAt(0) === '_') return;
      var p = pisos[id];
      var fr = p.fracoes || p;
      var mapa = {};
      Object.keys(fr).forEach(function (letra) {
        var pts = fr[letra];
        if (typeof pts === 'string') {
          pts = pts.trim().split(/\s+/).map(function (par) { return par.split(',').map(Number); });
        }
        mapa[letra.toUpperCase()] = pts;
      });
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
  // Ponto bem dentro do polígono (para a letra): procura numa grelha o ponto
  // mais afastado das arestas. Funciona com frações em L.
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
        for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          d = Math.min(d, distSeg(x, y, pts[j], pts[i]));
        }
        if (d > dist) { dist = d; melhor = [x, y]; }
      }
    }
    return { x: melhor[0], y: melhor[1], raio: dist };
  }
  function distSeg(x, y, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var t = ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1);
    t = Math.max(0, Math.min(1, t));
    var px = a[0] + t * dx - x, py = a[1] + t * dy - y;
    return Math.sqrt(px * px + py * py);
  }

  function desenharPoligonos(svg, mapa, letrasDoPiso) {
    var g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'exp-poligonos');
    var els = {};
    Object.keys(mapa).sort().forEach(function (letra) {
      var pts = mapa[letra];
      var grupo = document.createElementNS(SVGNS, 'g');
      grupo.setAttribute('class', 'exp-fracao');
      grupo.dataset.fracao = letra;
      if (dados[letra]) grupo.classList.add('exp-fracao--' + dados[letra].estado);
      if (letrasDoPiso && letrasDoPiso.indexOf(letra) === -1) grupo.classList.add('is-fora');
      var poly = document.createElementNS(SVGNS, 'polygon');
      poly.setAttribute('points', pts.map(function (p) { return p.join(','); }).join(' '));
      grupo.appendChild(poly);
      var c = centro(pts);
      var txt = document.createElementNS(SVGNS, 'text');
      txt.setAttribute('x', c.x.toFixed(1));
      txt.setAttribute('y', c.y.toFixed(1));
      txt.setAttribute('font-size', Math.max(18, Math.min(46, c.raio * 0.9)).toFixed(1));
      txt.textContent = letra;
      grupo.appendChild(txt);
      g.appendChild(grupo);
      els[letra] = grupo;
    });
    svg.appendChild(g);
    return els;
  }

  /* ---------- Vistas ---------- */
  // Fase 1: uma planta por piso.
  function VistaPisos() {
    var cache = {};
    this.els = {};
    this.mostrar = function (piso) {
      var self = this;
      var info = cfg.pisos.filter(function (p) { return p.id === piso; })[0];
      var pedido = cache[piso] || (cache[piso] = obter(info.planta));
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
        self.els = p ? desenharPoligonos(svg, p.fracoes) : {};
        el.palco.replaceChildren(svg);
      });
    };
    this.letras = function (piso) {
      return Object.keys((poligonos[piso] || {}).fracoes || {}).sort();
    };
  }

  // Fase 2: imagem única (axonométrica) com um polígono por fração.
  function VistaAxonometrica() {
    var ax = cfg.axonometrica;
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + ax.largura + ' ' + ax.altura);
    svg.setAttribute('class', 'exp-planta exp-planta--axonometrica');
    var img = document.createElementNS(SVGNS, 'image');
    img.setAttribute('href', base + ax.imagem);
    img.setAttribute('width', ax.largura);
    img.setAttribute('height', ax.altura);
    svg.appendChild(img);
    var mapa = normalizarPoligonos({ x: { fracoes: ax.fracoes } }).x.fracoes;
    this.els = desenharPoligonos(svg, mapa);
    el.palco.replaceChildren(svg);
    this.letras = function (piso) {
      return Object.keys(dados).filter(function (l) {
        var f = dados[l];
        return piso === 'sotao' ? !!f.area_sotao_m2 : 'piso-' + f.piso === piso;
      }).sort();
    };
    this.mostrar = function (piso) {
      var dentroPiso = this.letras(piso);
      var els = this.els;
      Object.keys(els).forEach(function (l) { els[l].classList.toggle('is-fora', dentroPiso.indexOf(l) === -1); });
      return Promise.resolve();
    };
  }

  /* ---------- Interface ---------- */
  function desenharBotoesPisos() {
    el.pisos.innerHTML = cfg.pisos.map(function (p) {
      var n = vista.letras(p.id).length;
      return '<button type="button" class="exp-piso" data-piso="' + p.id + '" aria-pressed="false">' +
        '<span class="exp-piso__nome">' + p.nome[T.lang] + '</span>' +
        '<span class="exp-piso__conta">' + n + ' ' + T.fracoes + '</span></button>';
    }).join('');
    el.pisos.addEventListener('click', function (e) {
      var b = e.target.closest('[data-piso]');
      if (b) mudarPiso(b.dataset.piso, true);
    });
  }

  function desenharBotoesFracoes() {
    var letras = vista.letras(estado.piso);
    el.fracoes.innerHTML = letras.map(function (l) {
      var f = dados[l];
      return '<button type="button" class="exp-res exp-res--' + f.estado + '" data-fracao="' + l + '" aria-pressed="false" ' +
        'aria-label="' + T.selecionarFracao.replace('{f}', l) + ', ' + f.tipologia + ', ' + textoEstado(f) + '">' +
        '<span class="exp-res__letra" aria-hidden="true">' + l + '</span>' +
        '<span class="exp-res__info" aria-hidden="true"><span>' + f.tipologia + '</span><span>' + textoEstado(f) + '</span></span>' +
        '</button>';
    }).join('');
  }

  function ligarPoligonos() {
    Object.keys(vista.els).forEach(function (l) {
      var g = vista.els[l];
      g.addEventListener('mouseenter', function () { destacar(l, true); });
      g.addEventListener('mouseleave', function () { destacar(l, false); });
      g.addEventListener('click', function () { selecionar(l, true); });
    });
  }

  function destacar(l, ligado) {
    if (vista.els[l]) vista.els[l].classList.toggle('is-destaque', ligado);
    var b = el.fracoes.querySelector('[data-fracao="' + l + '"]');
    if (b) b.classList.toggle('is-destaque', ligado);
  }

  function mudarPiso(piso, pelaInterface) {
    if (piso === estado.piso) return Promise.resolve();
    estado.piso = piso;
    el.pisos.querySelectorAll('[data-piso]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.piso === piso));
    });
    var info = cfg.pisos.filter(function (p) { return p.id === piso; })[0];
    if (info && info.faixa && el.faixa) {
      el.faixa.style.left = info.faixa[0] + '%';
      el.faixa.style.top = info.faixa[1] + '%';
      el.faixa.style.width = info.faixa[2] + '%';
      el.faixa.style.height = info.faixa[3] + '%';
    }
    raiz.classList.add('is-a-mudar');
    var espera = new Promise(function (r) { setTimeout(r, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220); });
    return Promise.all([vista.mostrar(piso), espera]).then(function () {
      ligarPoligonos();
      desenharBotoesFracoes();
      var letras = vista.letras(piso);
      // Mantém a fração se existir neste piso (ex.: I no Piso 2 e no Sótão).
      var alvo = letras.indexOf(estado.fracao) !== -1 ? estado.fracao : letras[0];
      estado.fracao = null;
      selecionar(alvo, pelaInterface && false);
      requestAnimationFrame(function () { raiz.classList.remove('is-a-mudar'); });
    });
  }

  function selecionar(l, pelaInterface) {
    var f = dados[l];
    if (!f) return;
    var letras = vista.letras(estado.piso);
    if (letras.indexOf(l) === -1) {
      // Fração noutro piso: muda de piso primeiro.
      estado.fracao = l;
      var destino = 'piso-' + f.piso;
      mudarPiso(destino, pelaInterface);
      return;
    }
    estado.fracao = l;
    Object.keys(vista.els).forEach(function (k) { vista.els[k].classList.toggle('is-selecionada', k === l); });
    el.fracoes.querySelectorAll('[data-fracao]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.fracao === l));
    });
    el.marcador.hidden = false;
    el.marcador.innerHTML = '<span class="exp-marcador__letra">' + l + '</span><span>' + textoEstado(f) + '</span>';
    el.marcador.className = 'explorador__marcador exp-marcador--' + f.estado;
    painel(f);
    if (pelaInterface) {
      try {
        var u = new URL(location.href);
        u.searchParams.set('fracao', l);
        history.replaceState(null, '', u);
      } catch (e) {}
    }
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
      '<div class="exp-sel__topo"><span class="etiqueta">' + el.selecionada.dataset.rotulo + '</span>' + etiquetaEstado(f) + '</div>' +
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
    var f = dados[l];
    var d = el.dialogo;
    d.querySelector('[data-planta-titulo]').textContent = T.fracao + ' ' + l + ' · ' + f.tipologia;
    var img = d.querySelector('[data-planta-img]');
    img.src = base + f.planta_img;
    img.alt = T.verPlantaImagem + ' ' + l + ' (' + f.tipologia + ', ' + nomePiso(f) + ')';
    d.querySelector('[data-planta-pdf]').href = base + f.planta_pdf;
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  }

  function ligarPainel() {
    el.selecionada.dataset.rotulo = el.selecionada.querySelector('.etiqueta').textContent;
    el.fracoes.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fracao]');
      if (b) selecionar(b.dataset.fracao, true);
    });
    el.fracoes.addEventListener('mouseover', function (e) {
      var b = e.target.closest('[data-fracao]');
      if (b) destacar(b.dataset.fracao, true);
    });
    el.fracoes.addEventListener('mouseout', function (e) {
      var b = e.target.closest('[data-fracao]');
      if (b) destacar(b.dataset.fracao, false);
    });
    el.fracoes.addEventListener('focusin', function (e) {
      var b = e.target.closest('[data-fracao]');
      if (b) destacar(b.dataset.fracao, true);
    });
    el.fracoes.addEventListener('focusout', function (e) {
      var b = e.target.closest('[data-fracao]');
      if (b) destacar(b.dataset.fracao, false);
    });
    // Setas entre residências
    el.fracoes.addEventListener('keydown', function (e) {
      var teclas = { ArrowRight: 1, ArrowDown: 2, ArrowLeft: -1, ArrowUp: -2 };
      if (!(e.key in teclas)) return;
      var bs = Array.prototype.slice.call(el.fracoes.querySelectorAll('[data-fracao]'));
      var i = bs.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var n = bs[Math.max(0, Math.min(bs.length - 1, i + teclas[e.key]))];
      n.focus();
    });
    el.selecionada.addEventListener('click', function (e) {
      var v = e.target.closest('[data-ver-planta]');
      if (v) { abrirPlanta(v.dataset.verPlanta); return; }
      var p = e.target.closest('[data-pedir]');
      if (p) {
        // O formulário (próxima entrega) lê a fração daqui e preenche-a.
        try { sessionStorage.setItem('ov2-fracao', p.dataset.pedir); } catch (err) {}
        document.dispatchEvent(new CustomEvent('ov2:pedir-informacao', { detail: { fracao: p.dataset.pedir } }));
      }
    });
    var d = el.dialogo;
    d.querySelector('[data-planta-fechar]').addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  }

  function fracaoInicial() {
    var q = new URLSearchParams(location.search).get('fracao');
    var h = /^#fracao-([a-l])$/i.exec(location.hash);
    var l = (q || (h && h[1]) || '').toUpperCase();
    return dados[l] ? l : null;
  }

  /* ---------- Arranque ---------- */
  Promise.all([
    obter('data/explorador/explorador.json'),
    obter('data/fracoes.json'),
    obter('data/site.json').catch(function () { return { mostrar_precos: true }; })
  ]).then(function (r) {
    cfg = r[0];
    r[1].forEach(function (f) { dados[f.fracao] = f; });
    site = r[2];
    return cfg.modo === 'axonometrica' && cfg.axonometrica ? null : obter(cfg.poligonos);
  }).then(function (pol) {
    if (pol) poligonos = normalizarPoligonos(pol);
    vista = (cfg.modo === 'axonometrica' && cfg.axonometrica) ? new VistaAxonometrica() : new VistaPisos();
    if (el.nota) el.nota.hidden = !cfg.provisorio;
    ligarPainel();
    desenharBotoesPisos();
    var l = fracaoInicial();
    if (l) estado.fracao = l;
    var piso = l ? 'piso-' + dados[l].piso : (cfg.piso_inicial || cfg.pisos[cfg.pisos.length - 1].id);
    return mudarPiso(piso).then(function () { raiz.classList.add('is-pronto'); });
  }).catch(function (erro) {
    console.error('Explorador:', erro);
    raiz.classList.add('is-erro');
  });
})();

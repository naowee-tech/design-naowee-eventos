/* Núcleo de la pestaña Inscripciones: cálculo, helpers de tarjeta y el ⓘ. Los componentes cuelgan de window.NWIN. */
(function () {
  window.Tabs = window.Tabs || {};
  var C = window.NWIN = {};
  /* NWS (utilidades compartidas) lo define otra pestaña; se lee al renderizar, no al cargar. */
  function U() { return window.NWS; }
  function esc(s) { return U().esc(s); }
  function num(n) { return U().num(n); }

  var GEN = { F: 'Femenino', M: 'Masculino', X: 'Mixto', U: 'Sin género en la prueba' };
  var GCOL = { F: '#9c1f85', M: '#3d86f5' };
  /* El modelo no trae individual/conjunto: se clasifica por nombre (aproximado). */
  var CONJUNTO = /(futbol|voleibol|baloncesto|balonmano|hockey|rugby|polo acuatico|softbol|beisbol|waterpolo)/;
  var INICIAL = 8;
  var INFO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>';

  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function plural(n, s, p) { return n + ' ' + (n === 1 ? s : p); }

  /* Todo se calcula acá a partir de data.pruebas; sin resultados también funciona (usa solo inscritos). */
  function calc(data) {
    var N = U(), ev = {}, seen = {}, A = {}, S = {}, T = {}, dias = {}, insDia = {}, ins = 0, insEq = 0, i;
    var tot = { F: 0, M: 0, X: 0, U: 0 };
    function sx(p) { return p.sexo === 'F' || p.sexo === 'M' || p.sexo === 'X' ? p.sexo : 'U'; }
    function sp(p) {
      return S[p.deporte] || (S[p.deporte] = { codigo: p.deporte, nombre: p.deporteNombre || p.deporte, ath: {}, athN: 0, eq: 0, ins: 0, F: 0, M: 0, X: 0, U: 0, pruebas: 0, pc: 0, conj: CONJUNTO.test(N.norm((p.deporteNombre || '') + ' ' + p.deporte)) });
    }
    (data.pruebas || []).forEach(function (p) {
      var k = p.deporte + '|' + p.nombre + '|' + (p.sexo || ''), e = ev[k], s = sp(p), g = sx(p);
      if (!e) { e = ev[k] = { col: false, dep: s.nombre, nombre: p.nombre, sx: g, fecha: p.fecha }; s.pruebas++; }
      if (p.participa && !e.col) { e.col = true; s.pc++; }
      dias[p.fecha] = (dias[p.fecha] || 0) + 1;
      (p.colombianos || []).forEach(function (c) {
        /* Revisión COC (17): el modelo real nombra al equipo solo «Colombia», sin paréntesis. */
        var eq = String(c.deportista).indexOf('(') >= 0 || N.norm(c.deportista) === 'colombia', ik = (eq ? 'E|' : 'D|') + k + '|' + c.deportista;
        if (seen[ik]) return;
        seen[ik] = 1; ins++; s.ins++; s[g]++; tot[g]++; insDia[p.fecha] = (insDia[p.fecha] || 0) + 1;
        if (eq) { insEq++; s.eq++; return; }
        if (!s.ath[c.deportista]) { s.ath[c.deportista] = 1; s.athN++; }
        var a = A[c.deportista] || (A[c.deportista] = { sx: null });
        if (!a.sx && (g === 'F' || g === 'M')) a.sx = g;
      });
    });
    var deps = Object.keys(S).map(function (c) { return S[c]; });
    deps.forEach(function (s) {
      var t = T[s.conj ? 'Conjunto' : 'Individual'] || (T[s.conj ? 'Conjunto' : 'Individual'] = { ins: 0, F: 0, M: 0, X: 0, U: 0, deps: 0, pruebas: 0, pc: 0, ath: 0 });
      t.ins += s.ins; t.F += s.F; t.M += s.M; t.X += s.X; t.U += s.U; t.deps++; t.pruebas += s.pruebas; t.pc += s.pc; t.ath += s.athN;
    });
    var names = Object.keys(A), g = { F: 0, M: 0, U: 0 };
    names.forEach(function (n) { g[A[n].sx || 'U']++; });
    var listSum = deps.reduce(function (a, s) { return a + s.athN; }, 0);
    var fechas = Object.keys(dias), base = (data.dias || []).slice();
    fechas.forEach(function (f) { if (base.indexOf(f) < 0) base.push(f); });
    base.sort();
    return {
      t: tiempo(data), deportistas: names.length, ins: ins, insEq: insEq, tot: tot, genero: g, listSum: listSum,
      /* Nominal: solo se lleva lo de Colombia. Nada de pruebas o deportes del evento sin Colombia, ni de cuántos hay en total. */
      pruebasCol: Object.keys(ev).filter(function (k) { return ev[k].col; }).length,
      deps: deps.filter(function (s) { return s.pc > 0 || s.ins > 0; }), tipos: T,
      jornadas: base.map(function (f) { return { fecha: f, n: insDia[f] || 0 }; }).filter(function (j) { return j.n > 0; })
    };
  }

  /* El ⓘ guarda lo que mide la gráfica; el cuerpo queda solo con datos (acordado con Jorge). */
  function info(paras, label) {
    return '<details class="nwtab-in-info"><summary class="nwtab-in-info__s" aria-label="' + esc(label || 'Qué mide esta gráfica') + '">' + INFO + '</summary><div class="nwtab-in-info__p">' + paras.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div></details>';
  }

  /* Estándar de Medallería: título fuera de la tarjeta, ⓘ arriba a la derecha y la tarjeta debajo. */
  function card(id, titulo, paras, cuerpo, extra, mod) {
    return '<div class="nwtab-md-sec"><div class="nwtab-md-card__h has-info"><div class="nwtab-md-card__hd"><h3 class="nwtab-md-card__t" id="in-' + id + '">' + esc(titulo) + '</h3></div>' + (extra || '') + info(paras) + '</div>' +
      '<section class="nwtab-md-card' + (mod ? ' ' + mod : '') + '" aria-labelledby="in-' + id + '">' + cuerpo + '</section></div>';
  }

  /* El estado del evento manda los copies: pasado = Finalizado, presente = En curso, futuro = Próximo. */
  function tiempo(data) {
    var e = data.estado || (data.evento && data.evento.estado);
    return e === 'Finalizado' ? 'pasado' : e === 'Próximo' ? 'futuro' : 'presente';
  }
  function por(c, o) { return o[c.t] != null ? o[c.t] : o.presente; }

  function seg(items, cur, kp) {
    return '<div class="nwtab-seg nwtab-in-seg" role="group" aria-label="' + esc(kp.label) + '">' + items.map(function (it) {
      return '<button type="button" class="nwtab-seg__b" data-k="in-' + kp.key + '-' + it[0] + '" data-in-' + kp.key + '="' + it[0] + '" aria-pressed="' + (cur === it[0]) + '">' + esc(it[1]) + '</button>';
    }).join('') + '</div>';
  }

  function vacio(t, d) { return '<div class="nwtab-emptyb"><b>' + esc(t) + '</b><span>' + esc(d) + '</span></div>'; }

  /* El ⓘ abierto se cierra con Escape o al tocar fuera; un solo oyente para toda la página. */
  function cerrarInfo() {
    if (window.__nwtabInfo) return;
    window.__nwtabInfo = true;
    document.addEventListener('click', function (e) { document.querySelectorAll('.nwtab-in-info[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.querySelectorAll('.nwtab-in-info[open]').forEach(function (d) { d.removeAttribute('open'); d.querySelector('summary').focus(); }); });
  }


  C.U = U; C.esc = esc; C.num = num; C.GEN = GEN; C.GCOL = GCOL; C.INICIAL = INICIAL; C.pct = pct; C.plural = plural;
  C.calc = calc; C.por = por; C.info = info; C.card = card; C.seg = seg; C.vacio = vacio; C.cerrarInfo = cerrarInfo;
})();

/* Componente: «Por deporte» de la nominal. Solo deportes y pruebas con Colombia: sin faltantes, sin «N de M». */
(function () {
  var C = window.NWIN, esc = C.esc, num = C.num, card = C.card, vacio = C.vacio, por = C.por;
  var ORD = { dep: 'Deporte', ath: 'Deportistas', ins: 'Participaciones', cob: 'Pruebas' };
  var DIR = { dep: 'asc', ath: 'desc', ins: 'desc', cob: 'desc' };

  function fila(s, maxP) {
    var nota = s.conj ? (s.ins === 1 ? '1 equipo' : s.ins + ' equipos') : s.eq ? s.eq + ' de equipo' : '';
    return '<tr><th scope="row" class="nwtab-in-d__n">' + esc(s.nombre) + '</th>' +
      '<td class="nwtab-in-d__a' + (s.conj ? ' is-na' : '') + '">' + (s.conj ? '<span aria-label="No aplica">—</span>' : '<b>' + num(s.athN) + '</b>') + '</td>' +
      '<td class="nwtab-in-d__i"><b>' + num(s.ins) + '</b>' + (nota ? '<small>' + nota + '</small>' : '') + '</td>' +
      '<td class="nwtab-in-d__q"><b>' + num(s.pc) + '</b></td></tr>';
  }

  function grupo(nombre, nota, arr) {
    return arr.length ? '<tr class="nwtab-in-d__gr"><th scope="rowgroup" colspan="4">' + nombre + ' <span>' + arr.length + (arr.length === 1 ? ' deporte' : ' deportes') + nota + '</span></th></tr>' + arr.map(fila).join('') : '';
  }

  function porDeporte(c, ui) {
    var tit = por(c, { pasado: '¿En qué deportes y pruebas participó Colombia?', presente: '¿En qué deportes y pruebas participa Colombia?', futuro: '¿En qué deportes y pruebas participará Colombia?' });
    var paras = ['Deportes y pruebas con deportistas de Colombia.', 'Deportistas no se suma: una misma persona puede competir en varios deportes (son ' + num(c.deportistas) + ' distintas).'];
    var con = c.deps;
    if (!con.length) return card('dep', tit, paras, vacio('Todavía no hay deportistas en la nominal', 'La tabla aparece cuando haya deportistas de Colombia en algún deporte.'), '', 'nwtab-in-card--dep');

    var k = ORD[ui.orden] ? ui.orden : 'ins', d = ui.ordenD === 'asc' || ui.ordenD === 'desc' ? ui.ordenD : DIR[k];
    var flip = d === DIR[k] ? 1 : -1;
    var cmp = {
      dep: function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); },
      ath: function (a, b) { return b.athN - a.athN; },
      ins: function (a, b) { return b.ins - a.ins; },
      cob: function (a, b) { return b.pc - a.pc; }
    }[k];
    var orden = function (arr) { return arr.slice().sort(function (a, b) { return flip * cmp(a, b) || a.nombre.localeCompare(b.nombre, 'es'); }); };

    var tools = '<div class="nwtab-in-dtools"><div class="nwtab-in-dsum"><strong>' + num(con.length) + '</strong> deportes · <strong>' + num(c.pruebasCol) + '</strong> pruebas</div></div>';

    var th = function (key, al) {
      var on = k === key, arrow = on ? (d === 'desc' ? '↓' : '↑') : '↕';
      return '<th scope="col" class="' + al + '" aria-sort="' + (on ? (d === 'desc' ? 'descending' : 'ascending') : 'none') + '"><button type="button" class="nwtab-in-dth' + (on ? ' is-on' : '') + '" data-k="in-orden-' + key + '" data-in-orden="' + key + '">' + ORD[key] + ' <span aria-hidden="true">' + arrow + '</span></button></th>';
    };
    var cuerpo = tools + '<table class="nw-table nwtab-in-d"><caption class="nwtab-vh">Deportistas, participaciones y pruebas de Colombia en cada deporte</caption><thead><tr>' + th('dep', 'l') + th('ath', 'r') + th('ins', 'r') + th('cob', 'r') + '</tr></thead><tbody>' +
      grupo('Deportes individuales', '', orden(con.filter(function (s) { return !s.conj; }))) +
      grupo('Deportes de conjunto', ' · participan equipos, no deportistas', orden(con.filter(function (s) { return s.conj; }))) + '</tbody></table>';
    return card('dep', tit, paras, cuerpo, '', 'nwtab-in-card--dep');
  }
  C.deportes = porDeporte;
})();

/* ═══════════════════════════════════════════════════════════════════════
   REPORTERÍA — renderers de charts en SVG inline (vanilla, sin libs)
   Adaptado de los mockups de Diego, reskineado a tokens (var(--accent)…).
   Cada fn devuelve un string HTML; animateBars() dispara los .go al montar.
   ═══════════════════════════════════════════════════════════════════════ */
const num = (n) => (n || 0).toLocaleString('es-CO');

/* ── Barras diarias (con línea de promedio o acumulado) ──────────────── */
export function dailyChart(daily, mode, startLabel) {
  const data = daily.map((x) => (mode === 'a' ? x.a : x.d));
  const mx = Math.max(1, ...data);
  const W = 760, H = 230, PL = 44, PT = 12, PB = 28, PR = 12;
  const cW = W - PL - PR, cH = H - PT - PB;
  const bW = Math.max(2, Math.floor(cW / data.length) - 2);
  const avg = Math.round(daily.reduce((s, x) => s + x.d, 0) / daily.length);

  const gridY = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = PT + cH * (1 - f);
    const v = Math.round(mx * f);
    const vl = v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v;
    return `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="var(--border)" stroke-width="1"/>
      <text x="${PL - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--text-secondary)">${vl}</text>`;
  }).join('');

  const bars = data.map((v, i) => {
    const x = PL + i * (cW / data.length);
    const bh = (v / mx) * cH;
    const y = PT + cH - bh;
    const isHigh = mode === 'd' && v === Math.max(...data);
    return `<rect x="${x + 1}" y="${y}" width="${bW}" height="${bh}" rx="2" fill="${isHigh ? 'var(--accent)' : 'var(--blue-info)'}" opacity="${isHigh ? 1 : 0.72}"/>`;
  }).join('');

  const avgY = PT + cH - (avg / mx) * cH;
  const avgLine = mode === 'd'
    ? `<line x1="${PL}" y1="${avgY}" x2="${W - PR}" y2="${avgY}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="5,3" opacity=".55"/>
       <text x="${W - PR + 2}" y="${avgY + 4}" font-size="9" fill="var(--accent)">prom</text>`
    : '';

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:230px">
    ${gridY}<g>${bars}</g>${avgLine}</svg>`;
}

/* ── Barras horizontales ──────────────────────────────────────────────── */
/* r.hi === true → resalta la fila (país seguido = Colombia). El label puede
   traer bandera emoji embebida desde el panel (por país). */
export function hbars(rows, color) {
  const mx = Math.max(1, ...rows.map((r) => r.v));
  return rows.map((r) => `
    <div class="rep-hb${r.hi ? ' is-co' : ''}">
      <span class="rep-hb__lbl" title="${r.lbl}">${r.lbl}</span>
      <div class="rep-hb__track"><div class="rep-hb__fill" style="background:${r.c || color};width:${(r.v / mx * 100).toFixed(1)}%"></div></div>
      <span class="rep-hb__val">${num(r.v)}</span>
    </div>`).join('');
}

/* ── Donut ────────────────────────────────────────────────────────────── */
export function donut(segs) {
  const tot = segs.reduce((s, x) => s + x.val, 0) || 1;
  const R = 42, CX = 58, CY = 58, C = 2 * Math.PI * R;
  let off = C * 0.25;
  const circles = segs.map((s) => {
    const d = (s.val / tot) * C;
    const so = off; off -= d;
    return `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${s.c}" stroke-width="18" stroke-dasharray="${d} ${C - d}" stroke-dashoffset="${so}"/>`;
  }).join('');
  const legend = segs.map((s) => `<div class="rep-leg__row"><div class="rep-leg__dot" style="background:${s.c}"></div><span class="rep-leg__name">${s.lbl}</span><span class="rep-leg__pct">${Math.round(s.val / tot * 100)}%</span></div>`).join('');
  const totLabel = tot >= 1000 ? (tot / 1000).toFixed(1) + 'k' : tot;
  return `<div class="rep-donut">
    <div class="rep-donut__ring"><svg viewBox="0 0 116 116" style="transform:rotate(-90deg);width:110px;height:110px">
      <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="var(--border)" stroke-width="18"/>${circles}</svg>
      <div class="rep-donut__ctr"><span class="rep-donut__num">${totLabel}</span><span class="rep-donut__lbl">total</span></div>
    </div>
    <div class="rep-leg">${legend}</div>
  </div>`;
}

/* ── Progreso (lista de barras done/total) ────────────────────────────── */
export function progress(rows) {
  return rows.map((p) => {
    const pc = p.total > 0 ? Math.round(p.done / p.total * 100) : 0;
    return `<div>
      <div class="rep-prog__hd"><span class="rep-prog__title">${p.title}</span><span class="rep-prog__pct" style="color:${p.c}">${pc}%</span></div>
      <div class="rep-prog__track"><div class="rep-prog__fill" style="background:${p.c};width:${pc}%"></div></div>
      <div class="rep-prog__sub">${num(p.done)} / ${num(p.total)}</div>
    </div>`;
  }).join('');
}

/* ── Podio (top 3) — jerarquía: 1º con corona + avatar mayor; medalla metálica
   con número (disco con anillo blanco); anillo del avatar por metal; pedestal
   con gradiente metálico + brillo superior. ────────────────────────────── */
export function podio(top3, avatars) {
  if (top3.length < 3) return '';
  const order = [top3[1], top3[0], top3[2]];   // orden visual: 2º · 1º · 3º
  const cls = ['p2', 'p1', 'p3'];
  return order.map((r, i) => `
    <div class="rep-podio__item ${cls[i]}${r.isCol ? ' is-co' : ''}">
      ${cls[i] === 'p1' ? '<div class="rep-podio__crown" aria-hidden="true">👑</div>' : ''}
      <div class="rep-podio__avatar" style="background:${avatars[r.pos - 1]}">${r.av}</div>
      <div class="rep-podio__name">${r.dep}</div>
      <div class="rep-podio__org">${r.flag ? r.flag + ' ' : ''}${r.org}</div>
      <div class="rep-podio__marca">${r.marca}</div>
      <div class="rep-podio__block"><span class="rep-podio__pos">${r.pos}°</span></div>
    </div>`).join('');
}

/* ── Barras apiladas (medallero por organismo) ────────────────────────── */
export function stackedBars(orgs) {
  const max = Math.max(1, ...orgs.map((d) => d.oro + d.plata + d.bronce));
  return orgs.map((d) => {
    const tot = d.oro + d.plata + d.bronce;
    const pct = tot / max * 100;
    const oP = tot ? d.oro / tot * 100 : 0, sP = tot ? d.plata / tot * 100 : 0, bP = tot ? d.bronce / tot * 100 : 0;
    return `<div class="rep-shb${d.isCol ? ' is-co' : ''}">
      <span class="rep-shb__lbl" title="${d.name}">${d.flag ? d.flag + ' ' : ''}${d.name.replace('Liga ', '')}</span>
      <div class="rep-shb__track" style="width:${pct}%">
        <div class="rep-shb__seg" style="width:${oP}%;background:var(--rep-gold-fill)"></div>
        <div class="rep-shb__seg" style="width:${sP}%;background:var(--rep-silver-fill)"></div>
        <div class="rep-shb__seg" style="width:${bP}%;background:var(--rep-bronze-fill)"></div>
      </div>
      <span class="rep-shb__total">${tot}</span>
    </div>`;
  }).join('');
}

/* Dispara la animación de barras (clip-path) tras montar el panel. */
export function animateBars(root) {
  requestAnimationFrame(() => {
    (root || document).querySelectorAll('.rep-hb__fill, .rep-prog__fill, .rep-shb__seg').forEach((el) => el.classList.add('go'));
  });
}

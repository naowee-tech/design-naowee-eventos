/* ═══════════════════════════════════════════════════════════════════════
   CATÁLOGO DE PAÍSES — fuente única (eventos internacionales)
   ───────────────────────────────────────────────────────────────────────
   En un evento internacional la dimensión "equipo/organismo" es el PAÍS.
   Colombia es el país que se SIGUE (default, destacado). Este catálogo lo
   consumen cargue.html (captura de resultados internacionales) y
   reporteria-data.js (breakdowns por país). Antes vivía inline en
   cargue.html; se extrajo aquí para no duplicarlo (fuente única).
   Label incluye la bandera emoji: "🇨🇴 Colombia".
   ═══════════════════════════════════════════════════════════════════════ */

export const PAIS_REGIONS = [
  { region: 'América', paises: [
    { value: 'CO', label: '🇨🇴 Colombia' }, { value: 'AR', label: '🇦🇷 Argentina' }, { value: 'BR', label: '🇧🇷 Brasil' },
    { value: 'CL', label: '🇨🇱 Chile' }, { value: 'PE', label: '🇵🇪 Perú' }, { value: 'EC', label: '🇪🇨 Ecuador' },
    { value: 'VE', label: '🇻🇪 Venezuela' }, { value: 'UY', label: '🇺🇾 Uruguay' }, { value: 'PY', label: '🇵🇾 Paraguay' },
    { value: 'BO', label: '🇧🇴 Bolivia' }, { value: 'MX', label: '🇲🇽 México' }, { value: 'US', label: '🇺🇸 Estados Unidos' },
    { value: 'CA', label: '🇨🇦 Canadá' }, { value: 'CR', label: '🇨🇷 Costa Rica' }, { value: 'PA', label: '🇵🇦 Panamá' },
    { value: 'CU', label: '🇨🇺 Cuba' }, { value: 'DO', label: '🇩🇴 Rep. Dominicana' }, { value: 'GT', label: '🇬🇹 Guatemala' },
    { value: 'HN', label: '🇭🇳 Honduras' }, { value: 'PR', label: '🇵🇷 Puerto Rico' }
  ] },
  { region: 'Europa', paises: [
    { value: 'ES', label: '🇪🇸 España' }, { value: 'FR', label: '🇫🇷 Francia' }, { value: 'DE', label: '🇩🇪 Alemania' },
    { value: 'IT', label: '🇮🇹 Italia' }, { value: 'PT', label: '🇵🇹 Portugal' }, { value: 'GB', label: '🇬🇧 Reino Unido' },
    { value: 'NL', label: '🇳🇱 Países Bajos' }, { value: 'BE', label: '🇧🇪 Bélgica' }, { value: 'CH', label: '🇨🇭 Suiza' },
    { value: 'SE', label: '🇸🇪 Suecia' }, { value: 'NO', label: '🇳🇴 Noruega' }, { value: 'DK', label: '🇩🇰 Dinamarca' },
    { value: 'FI', label: '🇫🇮 Finlandia' }, { value: 'RU', label: '🇷🇺 Rusia' }, { value: 'PL', label: '🇵🇱 Polonia' },
    { value: 'AT', label: '🇦🇹 Austria' }, { value: 'GR', label: '🇬🇷 Grecia' }, { value: 'UA', label: '🇺🇦 Ucrania' },
    { value: 'HR', label: '🇭🇷 Croacia' }, { value: 'RS', label: '🇷🇸 Serbia' }, { value: 'IE', label: '🇮🇪 Irlanda' },
    { value: 'CZ', label: '🇨🇿 Chequia' }, { value: 'HU', label: '🇭🇺 Hungría' }
  ] },
  { region: 'Asia', paises: [
    { value: 'JP', label: '🇯🇵 Japón' }, { value: 'CN', label: '🇨🇳 China' }, { value: 'KR', label: '🇰🇷 Corea del Sur' },
    { value: 'IN', label: '🇮🇳 India' }, { value: 'IR', label: '🇮🇷 Irán' }, { value: 'IL', label: '🇮🇱 Israel' },
    { value: 'SA', label: '🇸🇦 Arabia Saudita' }, { value: 'QA', label: '🇶🇦 Catar' }, { value: 'TH', label: '🇹🇭 Tailandia' },
    { value: 'KZ', label: '🇰🇿 Kazajistán' }, { value: 'ID', label: '🇮🇩 Indonesia' }, { value: 'PH', label: '🇵🇭 Filipinas' },
    { value: 'TR', label: '🇹🇷 Turquía' }
  ] },
  { region: 'África', paises: [
    { value: 'MA', label: '🇲🇦 Marruecos' }, { value: 'EG', label: '🇪🇬 Egipto' }, { value: 'NG', label: '🇳🇬 Nigeria' },
    { value: 'ZA', label: '🇿🇦 Sudáfrica' }, { value: 'KE', label: '🇰🇪 Kenia' }, { value: 'ET', label: '🇪🇹 Etiopía' },
    { value: 'DZ', label: '🇩🇿 Argelia' }, { value: 'TN', label: '🇹🇳 Túnez' }, { value: 'CM', label: '🇨🇲 Camerún' },
    { value: 'GH', label: '🇬🇭 Ghana' }, { value: 'SN', label: '🇸🇳 Senegal' }
  ] },
  { region: 'Oceanía', paises: [
    { value: 'AU', label: '🇦🇺 Australia' }, { value: 'NZ', label: '🇳🇿 Nueva Zelanda' }, { value: 'FJ', label: '🇫🇯 Fiyi' }
  ] }
];

/** Lista plana (la usan el podio internacional, el medallero por país y paisLbl). */
export const PAISES = PAIS_REGIONS.flatMap((r) => r.paises);

/** País por código ISO (o undefined). */
export function paisByValue(v) { return PAISES.find((p) => p.value === v); }

/** Bandera emoji del país (primer token del label). '' si no existe. */
export function paisFlag(v) {
  const p = paisByValue(v);
  return p ? p.label.split(' ')[0] : '';
}

/** Nombre del país SIN la bandera. '' si no existe. */
export function paisName(v) {
  const p = paisByValue(v);
  return p ? p.label.replace(/^\S+\s/, '') : '';
}

/** Label completo "🇨🇴 Colombia" (o '' si no existe). */
export function paisLabel(v) {
  const p = paisByValue(v);
  return p ? p.label : '';
}

/** Región del país (América/Europa/Asia/África/Oceanía). '' si no existe. */
export function paisRegion(v) {
  const r = PAIS_REGIONS.find((reg) => reg.paises.some((p) => p.value === v));
  return r ? r.region : '';
}

/** Código ISO del país que se sigue (Colombia). */
export const PAIS_SEGUIDO = 'CO';

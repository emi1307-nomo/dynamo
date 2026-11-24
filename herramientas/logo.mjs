// Genera las versiones del logo de Dynamo (redibujo en vector del original, mismo diseño):
//   img/logo-dynamo.svg          horizontal, a color
//   img/logo-dynamo-blanco.svg   horizontal, en blanco (para fondos oscuros)
//   img/isotipo-dynamo.svg       solo la figura con el anillo, a color
//   img/isotipo-dynamo-blanco.svg
//   img/isotipo-dynamo-animado.svg  el isotipo a color con el anillo que gira (portada de la web)
//   img/favicon.svg
// Uso: node herramientas/logo.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const IMG = join(dirname(fileURLToPath(import.meta.url)), '..', 'img');

// figura en X (brazos arriba, piernas abiertas) y cabeza; el anillo queda detrás y se recorta donde la toca
const FIGURA = 'M112 62C88 52 60 44 32 40C55 56 76 72 92 88C100 108 106 130 108 150C80 190 45 232 10 265C48 240 86 205 116 170C138 190 160 210 185 228C165 200 140 175 122 150C124 130 130 108 138 86C158 62 178 40 198 15C170 30 140 48 118 62Z';
const CABEZA = { cx: 115, cy: 36, r: 14.5 };

// "Dynamo" dibujado con trazos (no depende de una tipografía): altura de mayúscula 80, de x 52, trazo 10
const LETRAS = `
    <path d="M5-75H23A35 35 0 0 1 58-40A35 35 0 0 1 23-5H5Z"/>
    <g transform="translate(76 0)"><path d="M5-52V-23C5-12 12-5 23-5C34-5 41-12 41-23"/><path d="M41-52V4C41 14 34 20 24 20H12"/></g>
    <g transform="translate(132 0)"><path d="M5 0V-52"/><path d="M5-30C5-41 13-47 23-47C33-47 41-41 41-30V0"/></g>
    <g transform="translate(188 0)"><path d="M8-47H22C32-47 39-41 39-31V0"/><path d="M39-27H18C10-27 5-22 5-15.5C5-9 10-5 18-5C30-5 39-10 39-18"/></g>
    <g transform="translate(242 0)"><path d="M5 0V-52"/><path d="M5-30C5-41 11-47 19-47C27-47 33-41 33-30V0"/><path d="M33-30C33-41 39-47 47-47C55-47 61-41 61-30V0"/></g>
    <g transform="translate(318 0)"><ellipse cx="23" cy="-26" rx="18" ry="21"/></g>`;

function defs(p, color) {
  const g = color ? `
    <linearGradient id="${p}anillo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7DB8EC"/><stop offset=".55" stop-color="#3F86D0"/><stop offset="1" stop-color="#2A6DB8"/></linearGradient>
    <radialGradient id="${p}figura" cx="52%" cy="44%" r="62%"><stop offset="0" stop-color="#E6F2FD"/><stop offset=".38" stop-color="#9CCAF2"/><stop offset="1" stop-color="#3A82CE"/></radialGradient>
    <linearGradient id="${p}letras" x1="0" y1="-80" x2="0" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#69A9E4"/><stop offset="1" stop-color="#2E71BC"/></linearGradient>` : '';
  return `<defs>${g}
    <mask id="${p}corte" maskUnits="userSpaceOnUse" x="-20" y="-20" width="260" height="320">
      <rect x="-20" y="-20" width="260" height="320" fill="#fff"/>
      <path d="${FIGURA}" fill="#000" stroke="#000" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="${CABEZA.cx}" cy="${CABEZA.cy}" r="${CABEZA.r + 3.5}" fill="#000"/>
    </mask>
  </defs>`;
}
function isotipo(p, color) {
  const anillo = color ? `url(#${p}anillo)` : '#fff', figura = color ? `url(#${p}figura)` : '#fff';
  return `<circle cx="112" cy="128" r="72" fill="none" stroke="${anillo}" stroke-width="17" mask="url(#${p}corte)"/>
    <circle cx="${CABEZA.cx}" cy="${CABEZA.cy}" r="${CABEZA.r}" fill="${figura}"/>
    <path d="${FIGURA}" fill="${figura}"/>`;
}
const encabezado = (vb, titulo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${titulo}">
  <!-- Redibujo en vector del logo de Dynamo (mismo diseño que el original, a mejor calidad). Generado con herramientas/logo.mjs -->`;

function horizontal(color) {
  const p = color ? 'dy-' : 'dyb-', letras = color ? `url(#${p}letras)` : '#fff', bajada = color ? '#2E71BC' : '#fff';
  return `${encabezado('0 0 600 280', 'Dynamo · Kinesiología y fisioterapia')}
  ${defs(p, color)}
  <g transform="translate(6 4)">
    ${isotipo(p, color)}
  </g>
  <g transform="translate(232 168)" fill="none" stroke="${letras}" stroke-width="10" stroke-linejoin="round">${LETRAS}
  </g>
  <text x="340" y="201" textLength="254" lengthAdjust="spacingAndGlyphs" fill="${bajada}"
    font-family="Ubuntu, 'Segoe UI', Tahoma, sans-serif" font-size="15" font-weight="500" letter-spacing=".4">KINESIOLOGÍA Y FISIOTERAPIA</text>
</svg>
`;
}
function soloIsotipo(color) {
  const p = color ? 'dyi-' : 'dyib-';
  return `${encabezado('0 4 212 272', 'Dynamo')}
  ${defs(p, color)}
  ${isotipo(p, color)}
</svg>
`;
}

// Variante animada del isotipo, para la portada de la web (mismo dibujo que isotipo-dynamo.svg):
//   1) el anillo se dibuja en sentido horario mientras la figura se estira, como un dínamo que arranca;
//   2) después, un brillo con estela gira lento alrededor del anillo, sin parar.
// Trae su propio CSS y se queda quieto con prefers-reduced-motion (la página además usa el isotipo quieto en ese caso).
function animado() {
  const p = 'dya-';
  // estela del brillo: un arco de 110° que termina a las 3 en punto (la cabeza) y se desvanece hacia atrás.
  // El degradé va de la cola a la cabeza en línea recta: en un arco de menos de 180° eso alcanza para que sea parejo.
  const LARGO = 110, rad = (g) => (g * Math.PI) / 180, r2 = (n) => Math.round(n * 10) / 10;
  const cola = { x: r2(112 + 72 * Math.cos(rad(-LARGO))), y: r2(128 + 72 * Math.sin(rad(-LARGO))) };
  const estela = `<circle cx="112" cy="128" r="72" pathLength="360" stroke="url(#${p}estela)" stroke-dasharray="${LARGO} ${360 - LARGO}" stroke-dashoffset="${LARGO}"/>`;
  const degradeEstela = `<linearGradient id="${p}estela" gradientUnits="userSpaceOnUse" x1="${cola.x}" y1="${cola.y}" x2="184" y2="128"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".22"/><stop offset=".92" stop-color="#fff" stop-opacity=".62"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></linearGradient>`;
  return `${encabezado('0 4 212 272', 'Dynamo')}
  <style>
    .dya-anillo { animation: dya-dibujar 1.3s cubic-bezier(.45,.05,.25,1) .1s both; }
    .dya-fig { transform-box: view-box; transform-origin: 112px 150px; animation: dya-estirar 1.6s cubic-bezier(.3,.7,.35,1) .1s both; }
    .dya-cabeza { transform-box: view-box; transform-origin: 115px 36px; animation: dya-cabeza 1.1s cubic-bezier(.3,.7,.35,1) .45s both; }
    .dya-brillo { transform-box: view-box; transform-origin: 112px 128px; animation: dya-girar 12s linear infinite; }
    .dya-brillo-luz { animation: dya-encender 1.4s ease 1.1s both; }
    @keyframes dya-dibujar { from { stroke-dasharray: 0 360; } to { stroke-dasharray: 360 0; } }
    @keyframes dya-estirar { 0% { transform: translateY(10px) scale(.9, .8); } 62% { transform: translateY(-2px) scale(1.012, 1.03); } 100% { transform: none; } }
    @keyframes dya-cabeza { from { transform: translateY(9px); } to { transform: none; } }
    @keyframes dya-girar { to { transform: rotate(360deg); } }
    @keyframes dya-encender { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .dya-anillo, .dya-fig, .dya-cabeza, .dya-brillo, .dya-brillo-luz { animation: none; } .dya-brillo-luz { opacity: 0; } }
  </style>
  <defs>
    <linearGradient id="${p}anillo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7DB8EC"/><stop offset=".55" stop-color="#3F86D0"/><stop offset="1" stop-color="#2A6DB8"/></linearGradient>
    <radialGradient id="${p}figura" cx="52%" cy="44%" r="62%"><stop offset="0" stop-color="#E6F2FD"/><stop offset=".38" stop-color="#9CCAF2"/><stop offset="1" stop-color="#3A82CE"/></radialGradient>
    ${degradeEstela}
    <mask id="${p}corte" maskUnits="userSpaceOnUse" x="-20" y="-20" width="260" height="320">
      <rect x="-20" y="-20" width="260" height="320" fill="#fff"/>
      <g class="dya-fig">
        <path d="${FIGURA}" fill="#000" stroke="#000" stroke-width="7" stroke-linejoin="round"/>
        <circle class="dya-cabeza" cx="${CABEZA.cx}" cy="${CABEZA.cy}" r="${CABEZA.r + 3.5}" fill="#000"/>
      </g>
    </mask>
  </defs>
  <g mask="url(#${p}corte)">
    <circle class="dya-anillo" cx="112" cy="128" r="72" pathLength="360" fill="none" stroke="url(#${p}anillo)" stroke-width="17"/>
    <g class="dya-brillo-luz"><g class="dya-brillo" fill="none" stroke-width="17">
      ${estela}
    </g></g>
  </g>
  <g class="dya-fig">
    <circle class="dya-cabeza" cx="${CABEZA.cx}" cy="${CABEZA.cy}" r="${CABEZA.r}" fill="url(#${p}figura)"/>
    <path d="${FIGURA}" fill="url(#${p}figura)"/>
  </g>
</svg>
`;
}

writeFileSync(join(IMG, 'isotipo-dynamo-animado.svg'), animado());
writeFileSync(join(IMG, 'logo-dynamo.svg'), horizontal(true));
writeFileSync(join(IMG, 'logo-dynamo-blanco.svg'), horizontal(false));
writeFileSync(join(IMG, 'isotipo-dynamo.svg'), soloIsotipo(true));
writeFileSync(join(IMG, 'isotipo-dynamo-blanco.svg'), soloIsotipo(false));
// favicon: el isotipo sobre un cuadrado azul redondeado, en blanco (se lee mejor chiquito)
writeFileSync(join(IMG, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#2E71BC"/>
  <svg x="8" y="5" width="48" height="54" viewBox="0 4 212 272">${defs('f-', false)}${isotipo('f-', false)}</svg>
</svg>
`);
console.log('logos generados en', IMG);

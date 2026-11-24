// Dynamo · kinesiología y fisioterapia — interacción de la página (sin librerías)
// 1. apariciones al bajar · 2. abierto/cerrado con la hora de Córdoba · 3. armador del turno · 4. barra fija del celular
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  // A CONFIRMAR: no sabemos si el 0351 460-6845 tiene WhatsApp
  const WHATSAPP = '543514606845';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const hayObservador = 'IntersectionObserver' in window;

  /* ---------- 1. apariciones suaves al bajar ---------- */
  const aparecen = $$('.aparece');
  if (hayObservador) {
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    aparecen.forEach((el) => io.observe(el));
  } else {
    aparecen.forEach((el) => el.classList.add('visto'));
  }

  /* ---------- 2. abierto / cerrado (lunes a viernes de 8 a 20 h, hora de Córdoba) ---------- */
  const reloj = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Cordoba', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  const NUM_DIA = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  function estadoHorario(fecha = new Date()) {
    const p = Object.fromEntries(reloj.formatToParts(fecha).map((x) => [x.type, x.value]));
    const dia = NUM_DIA[p.weekday];
    const minuto = (Number(p.hour) % 24) * 60 + Number(p.minute);
    const habil = dia >= 1 && dia <= 5;
    if (habil && minuto >= 8 * 60 && minuto < 20 * 60) return { abierto: true, texto: 'Abierto ahora', cuando: 'hasta las 20 h' };
    if (habil && minuto < 8 * 60) return { abierto: false, texto: 'Cerrado ahora', cuando: 'abre hoy a las 8 h' };
    if (dia === 0 || (dia >= 1 && dia <= 4)) return { abierto: false, texto: 'Cerrado ahora', cuando: 'abre mañana a las 8 h' };
    return { abierto: false, texto: 'Cerrado ahora', cuando: 'abre el lunes a las 8 h' };
  }
  function pintarEstado() {
    const e = estadoHorario();
    // la versión corta (portada) dice solo «Abierto» o «Cerrado»
    $$('[data-estado]').forEach((el) => {
      const corto = el.dataset.estado === 'corto';
      el.textContent = `${corto ? e.texto.replace(' ahora', '') : e.texto} · ${e.cuando}`;
      el.classList.toggle('abierto', e.abierto);
    });
  }
  pintarEstado();
  setInterval(pintarEstado, 60 * 1000);

  /* ---------- 3. armador del turno ---------- */
  const form = $('#armador');
  if (form) {
    const MOTIVO = { lesion: 'lesión o dolor', operacion: 'rehabilitación después de una operación', masajes: 'masajes' };
    const PEDIDO = { si: 'sí, lo tengo', no: 'no', nose: 'no sé si lo necesito' };
    const DIA = { lun: 'lunes', mar: 'martes', mie: 'miércoles', jue: 'jueves', vie: 'viernes' };
    const FRANJA = { manana: 'mañana (8\u00a0a\u00a012\u00a0h)', mediodia: 'mediodía (12\u00a0a\u00a016\u00a0h)', tarde: 'tarde (16\u00a0a\u00a020\u00a0h)' };

    const el = {
      mensaje: $('#mensaje'), estado: $('#estado-armado'), vista: $('.vista'), carga: $('.progreso-carga'),
      faltan: $('#faltan'), aviso: $('#aviso'), wa: $('#enviar-wa'), copiar: $('#copiar'),
      cual: $('#cual'), detalleEtiqueta: $('#detalle-etiqueta'),
    };
    const ETIQUETA_DETALLE = el.detalleEtiqueta.innerHTML;
    let intento = false; // los errores se muestran recién después de intentar mandar o copiar

    const limpio = (v) => String(v || '').replace(/\s+/g, ' ').trim();
    // "lunes, martes y viernes" / "mañana o tarde"
    const enLista = (items, y) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${y} ${items[items.length - 1]}`);

    function leer() {
      const f = new FormData(form);
      return {
        nombre: limpio(f.get('nombre')),
        motivo: f.get('motivo'),
        detalle: limpio(f.get('detalle')),
        cobertura: f.get('cobertura'),
        cual: limpio(f.get('cual')),
        pedido: f.get('pedido'),
        dias: f.getAll('dias'),
        franjas: f.getAll('franja'),
      };
    }

    // cada dato del mensaje: cómo se escribe, qué pasa si falta y dónde poner el foco
    const CAMPOS = [
      {
        id: 'nombre', etiqueta: 'Nombre', falta: 'tu nombre',
        valor: (d) => (d.nombre.length >= 2 ? d.nombre : null),
        hueco: () => 'tu nombre y apellido',
        error: () => 'Escribí tu nombre y apellido.',
        foco: () => $('#nombre'),
      },
      {
        id: 'motivo', etiqueta: 'Motivo', falta: 'el motivo',
        valor: (d) => {
          if (!d.motivo) return null;
          if (d.motivo === 'otro') return d.detalle || null;
          return MOTIVO[d.motivo] + (d.detalle ? ` (${d.detalle})` : '');
        },
        hueco: (d) => (d.motivo === 'otro' ? 'contá el motivo' : 'elegí un motivo'),
        error: (d) => (d.motivo === 'otro' ? 'Contá brevemente el motivo.' : 'Elegí un motivo.'),
        foco: (d) => (d.motivo === 'otro' ? $('#detalle') : $('input[name="motivo"]')),
      },
      {
        id: 'cobertura', etiqueta: 'Cobertura', falta: (d) => (d.cobertura === 'obra' ? 'cuál es tu obra social o prepaga' : 'cómo te atendés'),
        valor: (d) => {
          if (d.cobertura === 'particular') return 'particular';
          if (d.cobertura === 'obra') return d.cual ? `obra social o prepaga (${d.cual})` : null;
          return null;
        },
        hueco: (d) => (d.cobertura === 'obra' ? 'escribí cuál es tu obra social o prepaga' : 'obra social, prepaga o particular'),
        error: (d) => (d.cobertura === 'obra' ? 'Escribí cuál es tu obra social o prepaga.' : 'Elegí cómo te atendés.'),
        foco: (d) => (d.cobertura === 'obra' ? $('#cual-nombre') : $('input[name="cobertura"]')),
      },
      {
        id: 'pedido', etiqueta: 'Pedido médico', falta: 'si tenés pedido médico',
        valor: (d) => (d.pedido ? PEDIDO[d.pedido] : null),
        hueco: () => 'sí, no o no sé',
        error: () => 'Elegí una opción.',
        foco: () => $('input[name="pedido"]'),
      },
      {
        id: 'dias', etiqueta: 'Días', falta: 'los días',
        valor: (d) => {
          if (!d.dias.length) return null;
          if (d.dias.length === 5) return 'cualquier día, de lunes a viernes';
          return enLista(d.dias.map((x) => DIA[x]), 'y');
        },
        hueco: () => 'qué días podés',
        error: () => 'Marcá al menos un día.',
        foco: () => $('input[name="dias"]'),
      },
      {
        id: 'franja', etiqueta: 'Horario', falta: 'el horario',
        valor: (d) => {
          if (!d.franjas.length) return null;
          if (d.franjas.length === 3) return 'cualquier horario, de 8 a 20 h';
          return enLista(d.franjas.map((x) => FRANJA[x]), 'o');
        },
        hueco: () => 'en qué horario',
        error: () => 'Marcá al menos un horario.',
        foco: () => $('input[name="franja"]'),
      },
    ];

    const SALUDO = 'Hola, Dynamo. Quiero pedir un turno.';
    const CIERRE = 'Gracias.';

    function textoFinal(d) {
      const lineas = CAMPOS.map((c) => `${c.etiqueta}: ${c.valor(d)}`);
      return `${SALUDO}\n\n${lineas.join('\n')}\n\n${CIERRE}`;
    }

    function pintarVista(d) {
      const frag = document.createDocumentFragment();
      frag.append(`${SALUDO}\n\n`);
      CAMPOS.forEach((c, i) => {
        const v = c.valor(d);
        frag.append(`${c.etiqueta}: `);
        if (v) frag.append(v);
        else { const s = document.createElement('span'); s.className = 'falta'; s.textContent = c.hueco(d); frag.append(s); }
        if (i < CAMPOS.length - 1) frag.append('\n');
      });
      frag.append(`\n\n${CIERRE}`);
      el.mensaje.replaceChildren(frag);
    }

    function pintarErrores(d, faltantes) {
      for (const c of CAMPOS) {
        const caja = $(`#campo-${c.id}`);
        const err = $(`#error-${c.id}`);
        const mal = intento && faltantes.includes(c);
        caja.classList.toggle('con-error', mal);
        err.hidden = !mal;
        if (mal) err.textContent = c.error(d);
        $$('input', caja).forEach((inp) => {
          if (inp.type === 'text') {
            const vacio = !limpio(inp.value);
            // solo se marca el campo de texto que de verdad falta
            const marcar = mal && vacio && (c.id === 'nombre' || (c.id === 'motivo' && d.motivo === 'otro' && inp.id === 'detalle') || (c.id === 'cobertura' && d.cobertura === 'obra'));
            if (marcar) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid');
          }
        });
      }
      if (intento && faltantes.length) {
        el.faltan.hidden = false;
        const que = faltantes.map((c) => (typeof c.falta === 'function' ? c.falta(d) : c.falta));
        el.faltan.textContent = `Para que te respondan de una, te falta completar ${enLista(que, 'y')}.`;
      } else {
        el.faltan.hidden = true;
      }
    }

    function actualizar() {
      const d = leer();

      // campos que dependen de otros
      el.cual.hidden = d.cobertura !== 'obra';
      if (d.motivo === 'otro') el.detalleEtiqueta.textContent = 'Contá brevemente el motivo';
      else if (el.detalleEtiqueta.innerHTML !== ETIQUETA_DETALLE) el.detalleEtiqueta.innerHTML = ETIQUETA_DETALLE;

      const faltantes = CAMPOS.filter((c) => !c.valor(d));
      const hechos = CAMPOS.length - faltantes.length;
      const listo = faltantes.length === 0;

      pintarVista(d);
      el.carga.style.strokeDasharray = `${(hechos / CAMPOS.length) * 100} 100`;
      el.vista.classList.toggle('listo', listo);
      el.estado.classList.toggle('listo', listo);
      el.estado.textContent = listo ? 'Listo: ya podés mandarlo' : `${faltantes.length === 1 ? 'Falta 1 dato' : `Faltan ${faltantes.length} datos`}`;
      // el enlace lleva el texto solo cuando el mensaje está completo (nunca se manda nada a medias)
      el.wa.href = listo ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(textoFinal(d))}` : `https://wa.me/${WHATSAPP}`;
      pintarErrores(d, faltantes);
      return { d, faltantes, listo };
    }

    function frenarSiFalta() {
      intento = true;
      const { d, faltantes } = actualizar();
      if (!faltantes.length) return false;
      const primero = faltantes[0].foco(d);
      if (primero) {
        primero.focus({ preventScroll: true });
        primero.closest('.campo').scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
      return true;
    }

    let avisoTimer;
    function avisar(texto, mal = false) {
      clearTimeout(avisoTimer);
      el.aviso.textContent = texto;
      el.aviso.classList.toggle('mal', mal);
      avisoTimer = setTimeout(() => { el.aviso.textContent = ''; }, 6000);
    }

    form.addEventListener('input', actualizar);
    form.addEventListener('change', actualizar);
    form.addEventListener('submit', (e) => e.preventDefault());

    el.wa.addEventListener('click', (e) => {
      if (frenarSiFalta()) { e.preventDefault(); return; }
      avisar('Se abrió WhatsApp con tu mensaje: revisalo y tocá enviar.');
    });

    async function alPortapapeles(texto) {
      try {
        await navigator.clipboard.writeText(texto);
        return true;
      } catch {
        const ta = document.createElement('textarea');
        ta.value = texto;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
        document.body.append(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        ta.remove();
        return ok;
      }
    }

    const etiquetaCopiar = $('span', el.copiar);
    let copiarTimer;
    el.copiar.addEventListener('click', async () => {
      if (frenarSiFalta()) return;
      const ok = await alPortapapeles(textoFinal(leer()));
      clearTimeout(copiarTimer);
      if (ok) {
        el.copiar.classList.add('copiado');
        etiquetaCopiar.textContent = 'Copiado';
        avisar('Mensaje copiado. Pegalo en el chat con el consultorio.');
        copiarTimer = setTimeout(() => { el.copiar.classList.remove('copiado'); etiquetaCopiar.textContent = 'Copiar el mensaje'; }, 2500);
      } else {
        avisar('No se pudo copiar. Seleccioná el texto del mensaje y copialo a mano.', true);
      }
    });

    actualizar();
  }

  /* ---------- 4. barra fija del celular: se esconde en la portada, en el armador y en el pie ---------- */
  const barra = $('#barra');
  if (barra && hayObservador) {
    const tapan = [$('.portada-acciones'), $('#turno'), $('.pie')].filter(Boolean);
    const enVista = new Set();
    const pintarBarra = () => {
      const mostrar = enVista.size === 0;
      barra.classList.toggle('visible', mostrar);
      barra.inert = !mostrar;
    };
    const ob = new IntersectionObserver((entradas) => {
      for (const e of entradas) { if (e.isIntersecting) enVista.add(e.target); else enVista.delete(e.target); }
      pintarBarra();
    });
    tapan.forEach((t) => ob.observe(t));
    barra.inert = true;
  }
})();

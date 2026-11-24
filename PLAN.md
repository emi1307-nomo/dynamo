# Dynamo · plan de la web

Consultorio REAL de kinesiología y fisioterapia en Nueva Córdoba. Página pedida: **simple e informativa**, con forma
de pedir información y turno, preguntas frecuentes y alguna animación que le dé vida.

Ver en la compu: `node servidor.mjs` → http://localhost:8089 (config "dynamo" en el launch.json de la sesión).
Página estática. Tiene `noindex` hasta que la aprueben.

Regla de oro: **nada inventado.** Todo lo que se afirma sale de las fuentes de abajo. Lo que no se sabe se manda a
consultar ("Consultalo al pedir el turno").

## Relevamiento (21/11/2026)
**Google Maps** (vista limitada, sin sesión):
- Nombre: "Dynamo kinesiologia y fisioterapia". Rubro: Fisioterapeuta.
- **4,6 ★ con 20 opiniones** (17 de 5 ★, 1 de 4 ★, 2 de 1 ★). Entrada accesible para silla de ruedas.
- Dirección: **Ituzaingó 946, X5000IJT Córdoba** (Nueva Córdoba). Coordenadas: -31.4277802, -64.1862847. Ficha: https://maps.google.com/?cid=3237220981094217512 (el mapa y "Cómo llegar" buscan por nombre y dirección, así abren la ficha y no un punto suelto).
- Horario: **lunes a viernes de 8 a 20 h**; sábado y domingo cerrado (Google avisa que en feriados puede variar).
- Teléfono: **0351 460-6845** (`tel:+543514606845`). Su "sitio web" en Google es la página de Facebook.
- Frases del resumen de opiniones: "Buena gente y buen ambiente." · "Excelente ubicación, buenos profesionales" ·
  "Excelente la atención, el tratamiento y seguimiento de la fisioterapeuta, un 💯".
- Opiniones de 5 ★ visibles (nombre de pila + inicial en la web):
  - David Iván P.: "Excelente atención de las secretarias y todos los/as kines. Atención personalizada, buena onda y
    profesionalismo que garantizan una óptima recuperación. Súper recomendado"
  - Alan A.: "Excelente atención, buena onda siempre, y sobre todo por cada lesión que vine me fui en excelente
    estado... MUY RECOMENDABLE... Cada rehabilitación que tengo que hacer, solo vengo acá..." (original con "x" y "tngo q")
  - Lourdes A.: "Súper recomendado!!! Lau y Yami son lo más! Mucha calidez y profesionalismo!"
  - Vanesa L.: "Buena atención"
- Opinión de 1 ★ (María Eugenia G., hace 5 meses): se queja de la **demora en responder los turnos por mensaje** y de
  la administración; destaca "excelente atención por parte de los profesionales". Menciona pedido médico y pago por
  transferencia. **No se usa en la web**, pero es el gancho: una web que junte todos los datos en un solo mensaje
  ordenado ahorra idas y vueltas.

**Facebook** (https://www.facebook.com/people/Dynamo-kinesiologia-y-fisioterapia/100043464566807/):
- 597 seguidores. Página · Fisioterapeuta. "Recomendado por el 100 % (6 opiniones)".
- Descripción: "Consultorio de rehabilitación en el corazón de Nueva Córdoba. MASAJES DESESTRESANTES Y APARATOLOG[ÍA]"
  (cortado en el original).
- Dirección completa: **Ituzaingó 946, piso 2 A (portero 021)**.
- Publicación del 10/06/2020: "Solicita tu turno. Consulta por cobertura de obra social y prepagas." (placa "Ya
  estamos trabajando", apertura 7.30 h y cierre 21 h en ese momento: el horario vigente es el de Google).
- Comentario de Emilio A. (hace 5 años): "Buena atención, como así también buen desempeño y seguimiento
  profesional. Recomiendo Dynamo".
- Portada: imagen de stock con un cuerpo corriendo y la frase "(un) cuerpo tenés solo…".

**Lo que se puede afirmar:** consultorio de rehabilitación; kinesiología y fisioterapia; masajes desestresantes;
aparatología (sin nombrar aparatos); atienden con obra social y prepaga (hay que consultar la cobertura); hay un
equipo (secretarias y varios kinesiólogos/as, según las opiniones); pedido médico (lo menciona una opinión, lo habitual
con obra social). **No se sabe:** qué obras sociales, precios, nombres y matrículas del equipo (solo "Lau y Yami" en
una opinión), si el teléfono tiene WhatsApp, especialidades puntuales, si hay ascensor.

## Marca
- Logo redibujado en vector (mismo diseño que el original): `img/logo-dynamo.svg` (color), `img/logo-dynamo-blanco.svg`,
  `img/isotipo-dynamo.svg`, `img/isotipo-dynamo-blanco.svg`, `img/favicon.svg`. Se generan con
  `node herramientas/logo.mjs`. Comparación antes/después: `logo-antes-despues.png`.
- Colores del logo: azul `#2E71BC`, celeste `#7DB8EC`, celeste claro `#EAF3FC`, azul profundo para texto `#123A66`.
  En sus placas de Facebook usaban un verde para "Solicitá turnos" (`#2BB673` aprox.).
- La bajada del logo usa una sans tipo Neo Sans: en la web, **Ubuntu** (Google Fonts) es la más parecida.

## El gancho para presentarla
1. Su "sitio web" en Google es un Facebook con la última publicación visible de 2020.
2. Una opinión de 1 ★ se queja de la demora para sacar turno por mensaje y de tener que mandar los datos dos veces.
   La web arma **un solo mensaje con todos los datos** (nombre, motivo, obra social o particular, pedido médico, días y
   horario), así la secretaría responde de una.
3. El logo, hoy borroso, pasa a vector nítido.

## Para preguntarle a Dynamo
1. ¿El 0351 460-6845 tiene WhatsApp? Si no, ¿qué número usan para los turnos por mensaje?
2. ¿Con qué obras sociales y prepagas trabajan? ¿Qué piden (pedido médico, autorización, DNI, carnet)?
3. ¿Quiénes son los profesionales (nombres, matrículas, especialidades)? ¿Fotos del equipo y del consultorio?
4. ¿Qué aparatología usan y qué incluye "masajes desestresantes"? ¿Atienden deportistas, adultos mayores, chicos?
5. ¿Hay ascensor al piso 2? ¿Qué hacer si alguien no puede ir a una sesión (política de faltas)?
6. ¿Tienen el logo original en vector? ¿Usan Instagram?

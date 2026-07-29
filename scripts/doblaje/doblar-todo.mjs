// Dobla las 13 piezas de AO BALCÃO con ElevenLabs.
//
// DECISIÓN DE MODELO. El skill dice: narradora con multilingual_v2 y
// personajes con v3 y etiquetas de emoción. Aquí va TODO con
// multilingual_v2, y el motivo es que los guiones nuevos no llevan
// etiquetas: llevan una columna de dirección en prosa con los ppm
// escritos. Sin etiquetas, v3 no aporta actuación y en cambio PIERDE el
// control de velocidad, que es lo único que separa las capas al oído.
// Entre actuación difusa y separación de capas, la separación gana:
// es la mecánica pedagógica de la serie.
//
// MAPEO ppm → speed. No es inventado. El skill midió la narradora a 142
// ppm con speed 0.7, luego speed 1.0 ≈ 203 ppm — que cuadra con los 202
// ppm medidos del habla real a velocidad por defecto. De ahí:
//     speed = ppm_objetivo / 203, recortado a [0.7, 1.2]
// El suelo de 0.7 es de la API: las réplicas que piden 60 o 105 ppm no
// son alcanzables sin trocear y meter silencio en post.
import fs from 'node:fs';
import path from 'node:path';

const REPO = '/Users/lalo/idiomas/portugues-app';
const OUT = process.env.OUT || '/Users/lalo/Desktop/ao-balcao-doblaje';
const PISTAS = process.argv[2];
const SOLO = process.env.SOLO ? new Set(process.env.SOLO.split(',')) : null;

const KEY = fs.readFileSync(path.join(REPO, '.env.local'), 'utf8')
  .split('\n').find((l) => l.startsWith('ELEVENLABS_API_KEY=')).split('=')[1].trim();

fs.mkdirSync(OUT, { recursive: true });

// ── Reparto ──────────────────────────────────────────────────────
// Los seis primeros vienen del skill y ya están validados en el ep. 1.
// El resto se asigna por metadatos (género, edad, acento europeo).
const VOCES = {
  NARRADORA:   ['nJ5NFqyKb8kn9JBPmo6i', 'Joana — natural y suave, fuera del reparto'],
  ORIENTA:     ['lQFpy8cEH4bDaHre2DpA', 'JOSE es-MX — la voz del alumno'],
  MIGUE:       ['lQFpy8cEH4bDaHre2DpA', 'JOSE es-MX leyendo portugués'],
  FÁTIMA:      ['IZipF5JhqPlWzpduTV0E', 'Daniela — contralto con autoridad'],
  KILU:        ['HbqJvmNWS8QoO8r8Gs9F', 'Tchize — voz angoleña real'],
  MARTA:       ['NkpT2jezTenCDRKHkWiX', 'Benedita — joven'],
  ALMEIDA:     ['pjqwOzrEUZ3n3m4rMWWL', 'Vasco — barítono seco'],
  MEGAFONE:    ['pjqwOzrEUZ3n3m4rMWWL', 'Vasco = Almeida, filtro en post'],
  // Aurora tiene 79 años y NO EXISTE ninguna voz femenina europea mayor
  // en la biblioteca: las siete disponibles son young o middle_aged. Ésta
  // es la más cercana en carácter; la edad hay que dársela en post o
  // aceptar que no la tiene. Va documentado, no disimulado.
  AURORA:      ['iLelOQ6m5mpSeNH8fRob', 'Maria — seria y calma (NO es mayor: no hay)'],
  MOTORISTA:   ['WgE8iWzGVoJYLb5V7l2d', 'Hugo Mendonça — cortés y directo'],
  // Microhistorias: personajes propios, independientes entre piezas.
  NICO:        ['c0rzOw18hxEhaSybUod2', 'Tiago — joven, escéptico'],
  VITÓRIA:     ['JGnWZj684pcXmK2SxYIv', 'Claudia — joven, cercana'],
  AUGUSTO:     ['xwVJ1SoRe0v1T88zEwBN', 'Vicente — mayor, cálido y rasgado'],
  ILDA:        ['bBNhdwrIjl4fcVYiRbT2', 'Marta — madura, agradable'],
  LOURENÇO:    ['Fij0Q07RV232HQv4oaiV', 'Lourenço — joven, casual'],
  RITA:        ['zKjRewuiqTkXNUVAMwat', 'Mariza — fría y calma'],
  SÓNIA:       ['JGnWZj684pcXmK2SxYIv', 'Claudia — joven'],
  MÃE:         ['bBNhdwrIjl4fcVYiRbT2', 'Marta — madura (llamada, va filtrada)'],
  RAQUEL:      ['zKjRewuiqTkXNUVAMwat', 'Mariza — joven'],
  BRUNO:       ['a2m6tcgyJTe32Q3VSi6f', 'Bruno — calmado y amable'],
  VÍTOR:       ['aLFUti4k8YKvtQGXv0UO', 'Paulo — diplomático'],
  CIDÁLIA:     ['bBNhdwrIjl4fcVYiRbT2', 'Marta — madura'],
  FUNCIONÁRIA: ['JGnWZj684pcXmK2SxYIv', 'Claudia — ventanilla'],
  VOZ:         ['iLelOQ6m5mpSeNH8fRob', 'Maria — la señora de la sala de espera'],
};

const PPM_POR_DEFECTO = { N: 142, '2': 110, '1': 175, '0': 150 };

function velocidadDe(capa, direccion) {
  const m = direccion.match(/(\d{2,3})\s*ppm/);
  const ppm = m ? Number(m[1]) : (PPM_POR_DEFECTO[capa] ?? 175);
  let speed = Math.min(1.2, Math.max(0.7, +(ppm / 203).toFixed(2)));

  // SUELO DE LA CAPA 1. El segundo piloto dejó la narradora a 137 ppm y
  // el habla real a 143: un 4 % de separación donde el diseño pide 42 %.
  // El motivo es que las voces corren a ~185 ppm a velocidad natural, así
  // que aplicarles el 0,86 que pedía su dirección las frenaba POR DEBAJO
  // de su propio ritmo — y el habla real dejaba de sonar a habla real.
  //
  // El contraste entre capas es la mecánica pedagógica; los ppm por línea
  // son textura. Cuando chocan, gana la mecánica: la Capa 1 nunca baja de
  // su velocidad natural.
  //
  // Con una excepción que sí hay que respetar: cuando la dirección pide
  // menos de 130 ppm en Capa 1 no está pidiendo textura, está pidiendo
  // que un personaje TITUBEE — Migue deletreando «En... cer... ra... do»,
  // Nico sin saber qué decir. Esa lentitud es el contenido.
  if (capa === '1' && ppm >= 130) speed = Math.max(1.0, speed);

  return { ppm, speed };
}

// La estabilidad separa la narradora (constante, sin dramatizar) del
// habla real (variable, viva). No es cosmético: si la narradora fluctúa,
// deja de ser el suelo firme contra el que se mide todo lo demás.
const ESTABILIDAD = { N: 0.75, '2': 0.65, '1': 0.45, '0': 0.5 };

// PAUSAS. El primer piloto salió con la separación de capas INVERTIDA:
// narradora a 158 ppm y habla real a 154, cuando el diseño pide 142
// contra 202. La causa es que `speed` no controla los ppm de verdad —lo
// que manda es la puntuación— y 0.7 es el suelo de la API, así que la
// narradora no podía bajar más.
//
// La salida estaba escrita en las propias direcciones, que llevan las
// pausas anotadas desde el guion («tres frases con 0,7 s») y que nadie
// estaba ejecutando. `<break>` sí funciona en multilingual_v2: medido,
// dos pausas de 0,8 s bajan una línea de narradora de 128 a 103 ppm.
//
// Así que las pausas dejan de ser una nota para el actor y pasan a ser
// parte del texto. Sólo en Capa N y Capa 2: en el habla real las pausas
// son actuación y meterlas a mano la vuelve robótica.
const PAUSA_POR_DEFECTO = { N: 0.45, '2': 0.9 };

function conPausas(texto, capa, direccion) {
  const base = PAUSA_POR_DEFECTO[capa];
  if (!base) return texto;
  const m = (direccion || '').match(/(\d)[,.](\d)\s*s\b/);
  const seg = m ? Number(`${m[1]}.${m[2]}`) : base;
  // Entre oraciones, no dentro: el corte va detrás del signo y sólo si
  // queda algo después, para no dejar una pausa colgando al final.
  return texto.replace(/([.!?…])\s+(?=\S)/g, `$1 <break time="${seg}s" /> `);
}

async function tts(texto, voz, speed, stability, archivo) {
  for (let i = 1; i <= 4; i++) {
    let r;
    try {
      r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}`, {
        method: 'POST',
        headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: texto,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability, similarity_boost: 0.75, speed },
        }),
      });
    } catch (e) {
      await new Promise((s) => setTimeout(s, 900 * i));
      continue;
    }
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 1024) return { ok: false, motivo: `mp3 de ${buf.length} bytes` };
      fs.writeFileSync(path.join(OUT, archivo), buf);
      return { ok: true, bytes: buf.length };
    }
    const cuerpo = await r.text().catch(() => '');
    if (r.status !== 500 && r.status !== 429) return { ok: false, motivo: `http ${r.status} ${cuerpo.slice(0, 160)}` };
    await new Promise((s) => setTimeout(s, 900 * i));
  }
  return { ok: false, motivo: 'agotados los 4 intentos' };
}

const pistas = JSON.parse(fs.readFileSync(PISTAS, 'utf8'));
const trabajo = pistas.filter((p) => !SOLO || SOLO.has(p.pieza));

const sinVoz = [...new Set(trabajo.map((p) => p.quien))].filter((q) => !VOCES[q]);
if (sinVoz.length) { console.error('SIN VOZ ASIGNADA:', sinVoz.join(', ')); process.exit(1); }

const totalChars = trabajo.reduce((a, p) => a + p.texto.length, 0);
console.log(`${trabajo.length} réplicas · ${totalChars} caracteres · destino ${OUT}\n`);

let ok = 0, fallos = [];
for (const [i, p] of trabajo.entries()) {
  // La Capa 0 va SIEMPRE con la voz es-MX, diga lo que diga la columna
  // de personaje. En los eps. 9-15 la firma Migue, que es mexicano, pero
  // en las microhistorias la firma su protagonista, que es portugués — y
  // una voz portuguesa leyendo español suena a acento extranjero justo en
  // la única capa que existe para que el alumno se sienta en casa. La
  // Capa 0 no es un personaje: es orientación en la lengua del alumno.
  const [voz] = p.capa === '0' ? VOCES.ORIENTA : VOCES[p.quien];
  const { ppm, speed } = velocidadDe(p.capa, p.direccion ?? '');
  const stability = ESTABILIDAD[p.capa] ?? 0.5;
  const archivo = `${p.pieza}-${String(p.n).padStart(3, '0')}-${p.quien.toLowerCase().replace(/[^a-z]/g, '')}.mp3`;

  const emitido = conPausas(p.texto, p.capa, p.direccion);
  const r = await tts(emitido, voz, speed, stability, archivo);
  Object.assign(p, { archivo, voz, ppm, speed, stability, emitido, ok: r.ok, motivo: r.motivo });
  if (r.ok) { ok++; process.stdout.write('.'); }
  else { fallos.push(`${archivo}: ${r.motivo}`); process.stdout.write('x'); }
  if ((i + 1) % 60 === 0) process.stdout.write(` ${i + 1}\n`);
}

fs.writeFileSync(path.join(OUT, 'manifiesto.json'), JSON.stringify({ voces: VOCES, pistas: trabajo }, null, 2));
console.log(`\n\n${ok}/${trabajo.length} pistas · ${totalChars} caracteres`);
if (fallos.length) console.log('\nFALLOS:\n' + fallos.map((f) => '  ' + f).join('\n'));

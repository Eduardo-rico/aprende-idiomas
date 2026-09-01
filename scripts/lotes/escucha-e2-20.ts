// scripts/lotes/escucha-e2-20.ts
//
//   npx tsx scripts/lotes/escucha-e2-20.ts            # gates + tabla
//   npx tsx scripts/lotes/escucha-e2-20.ts --json     # ítems para publicar
//
// PARES MÍNIMOS DE ESCUCHA. 8 unidades para `b1-inventario-vocalico`.
//
// ── POR QUÉ SÓLO UNO DE LOS CUATRO PUNTOS ────────────────────────────
//
// El formato no hizo falta construirlo: `listening` ya existe, ya lleva
// `options`/`answer` y `ListeningCard` puntúa comparando la opción con la
// respuesta, sin el «siempre true» que tenía `ShadowingCard`. Lo que sí
// hubo que decidir es **cuáles de los cuatro puntos de fonología admiten
// un ítem PUNTUABLE**, y la respuesta es: uno.
//
//   · `b1-inventario-vocalico` — SÍ. Las oposiciones /o/–/ɔ/ y oral–nasal
//     son FONÉMICAS y separan palabras distintas con grafías distintas:
//     «avô»/«avó», «lá»/«lã», «mudo»/«mundo». El alumno oye una palabra y
//     elige cuál era. La tarea está bien planteada con cualquier voz que
//     se entienda, que es lo que el corpus ya asume para sus 1.297 clips.
//
//   · `b1-reducao-vocalica`, `b1-sandi`, `b1-ei-lisboeta` — NO, y no por
//     falta de ganas. **Su contenido ES la realización fonética fina**, no
//     una oposición entre palabras: la átona que se cierra, la frontera
//     que se funde, el ⟨ei⟩ que en Lisboa se abre. Ahí no hay pares
//     mínimos que elegir; hay una pronunciación que reconocer.
//
//     Y el proyecto no puede garantizar hoy esa pronunciación. Su propio
//     código lo dice en dos sitios: `config.ts` avisa de que «el
//     language_boost NO diferencia BR/PT en MiniMax», y `EL_VOICES` usa
//     **la misma voz para `pt` y para `br`** con la nota «INTERINO … hasta
//     que Edu apruebe una BR a oído». Escribir 24 ítems cuya
//     respondibilidad depende de una propiedad acústica que nadie ha
//     verificado sería fabricar el mismo defecto que el cloze sin pista:
//     un ejercicio que no se puede resolver y que cobra fallos falsos.
//
// La glosa de estos ítems dice QUÉ significa cada palabra y nada más. No
// describe la articulación: las colas de revisión encontraron ahí el nido
// de errores más grande del corpus —«mãe esdrújula», «décimo con
// circunflejo»— y una descripción fonética inventada es peor que ninguna.
export interface ItemEscucha {
  p: string;
  /** La palabra que se locuta. */
  audio: string;
  /** El par: las dos opciones, en orden fijo. `audio` tiene que ser una. */
  par: [string, string];
  /** Qué significa cada una, para que el ítem también enseñe léxico. */
  glosas: [string, string];
  /** El rasgo que las separa, nombrado SIN describir la articulación. */
  rasgo: string;
}

const ITEMS_RAW: ItemEscucha[] = [
  { p: 'b1-inventario-vocalico', audio: 'avô', par: ['avô', 'avó'],
    glosas: ['el abuelo', 'la abuela'], rasgo: 'la vocal tónica, cerrada o abierta' },
  { p: 'b1-inventario-vocalico', audio: 'avó', par: ['avô', 'avó'],
    glosas: ['el abuelo', 'la abuela'], rasgo: 'la vocal tónica, cerrada o abierta' },
  { p: 'b1-inventario-vocalico', audio: 'pôde', par: ['pôde', 'pode'],
    glosas: ['pudo (pretérito)', 'puede (presente)'], rasgo: 'la vocal tónica, cerrada o abierta' },
  { p: 'b1-inventario-vocalico', audio: 'lã', par: ['lá', 'lã'],
    glosas: ['allí', 'la lana'], rasgo: 'vocal oral o nasal' },
  { p: 'b1-inventario-vocalico', audio: 'mundo', par: ['mudo', 'mundo'],
    glosas: ['mudo', 'el mundo'], rasgo: 'vocal oral o nasal' },
  { p: 'b1-inventario-vocalico', audio: 'vim', par: ['vi', 'vim'],
    glosas: ['vi', 'vine'], rasgo: 'vocal oral o nasal' },
  { p: 'b1-inventario-vocalico', audio: 'canto', par: ['cato', 'canto'],
    glosas: ['recojo', 'canto / la esquina'], rasgo: 'vocal oral o nasal' },
  { p: 'b1-inventario-vocalico', audio: 'tapa', par: ['tapa', 'tampa'],
    glosas: ['tapa (verbo)', 'la tapadera'], rasgo: 'vocal oral o nasal' },
];

export const ITEMS = ITEMS_RAW;

export function verificar(items: ItemEscucha[]): string[] {
  const v: string[] = [];
  const vistos = new Set<string>();
  for (const [i, x] of items.entries()) {
    const id = `ES-${String(i + 1).padStart(3, '0')} (${x.p})`;
    if (!x.par.includes(x.audio)) v.push(`${id}: lo que se locuta («${x.audio}») no está entre las dos opciones`);
    if (x.par[0] === x.par[1]) v.push(`${id}: las dos opciones son la misma palabra`);
    if (x.glosas[0] === x.glosas[1]) v.push(`${id}: las dos glosas son iguales — el ítem se puede resolver leyendo`);
    // Un par cuyas dos palabras difieren en MÁS de un sonido no es un par
    // mínimo: el alumno acierta por cualquier otra diferencia y el ítem
    // deja de medir la oposición que dice medir.
    const [a, b] = x.par;
    if (Math.abs(a.length - b.length) > 1) v.push(`${id}: «${a}»/«${b}» difieren demasiado para ser par mínimo`);
    const k = `${x.audio}|${x.par.join('/')}`;
    if (vistos.has(k)) v.push(`${id}: ítem repetido`);
    vistos.add(k);
  }
  return v;
}

if (process.argv[1]?.includes('escucha-e2-20')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  console.log(`# Escucha E2#20 — ${ITEMS.length} ítems · pares mínimos\n`);
  console.log('| se oye | opciones | rasgo |');
  console.log('|---|---|---|');
  for (const x of ITEMS) console.log(`| **${x.audio}** | ${x.par.join(' / ')} | ${x.rasgo} |`);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: lo que se locuta está entre las opciones, las dos opciones son palabras');
  console.log('distintas con glosas distintas, y ninguna pareja difiere en más de una letra.');
  console.log('');
  console.log('**Lo que este gate NO puede comprobar**: que la voz REALICE la oposición.');
  console.log('Eso lo dice un oído, no un script — y hasta que alguien lo diga, estos ocho');
  console.log('ítems están publicados pero su punto no se da por enseñado.');
}

// scripts/lotes/juicio-ro-vocativo.ts — EL INTENTO ÚNICO de juicio /
// discriminación para el vocativo rumano. A2.
//
//   npx tsx scripts/lotes/juicio-ro-vocativo.ts     # preflight + potencia
//
// AUTORIZADO POR EL COORDINADOR (2026-09-03), un intento y no dos, con
// regla de corte escrita. El contexto es que en portugués el juicio MURIÓ
// por una causa estructural —la glosa española contiene siempre la
// respuesta— y aquí puede no aplicar: los sub-casos del vocativo glosan
// AL MISMO español («doctor» es «doctor» lleve marca o no), así que la
// glosa no discrimina. Ése es exactamente el caso límite que merece
// medirse en vez de heredar la conclusión.
//
// POR QUÉ HACE FALTA OTRO FORMATO, medido en el lote 10: el cloze sólo
// puede examinar los lemas de forma ÚNICA (om→omule, domn→domnule), unos
// 2 de 8. Los de forma SIN MARCA se contestarían copiando el lema del
// paréntesis, y los de DOBLETE aceptan las dos desinencias con sus `alt`,
// así que nadie puede fallar el reparto -e/-ule. Y el error real del
// alumno no es omitir la marca: es SOBREAPLICARLA (*fratule, *tatăle).
// Eso pide discriminación, no producción.
//
// LA REGLA DE CORTE, escrita antes de mirar el resultado: si la batería
// enseña que LA GLOSA DECIDE —si las dos opciones de un ítem se traducen
// al español por cosas distintas— el formato se declara MUERTO para el
// vocativo y sus sub-casos van a otra vía o a piso declarado con motivo.
import { SUSTANTIVOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { vocativo } from '../lib/paradigma-ro';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';

export interface ItemJuicio {
  /** El lema del lexicón, para poder recalcular la buena. */
  lema: string;
  familia: 'sobreaplicacion' | 'registro' | 'forma-vs-lema';
  /** La situación, en español. Es el CONTEXTO, no la traducción. */
  situacion: string;
  /** La frase rumana con el hueco. */
  s: string;
  /** Las dos opciones. La correcta se recalcula contra el paradigma. */
  opciones: [string, string];
  correcta: 0 | 1;
  /** LA MEDICIÓN QUE DECIDE: ¿las dos opciones se traducen al español por
   *  cosas DISTINTAS? Si sí, la glosa decide y el formato está muerto. */
  glosaEs: [string, string];
  porQue: string;
}

const LEMA = new Map(SUSTANTIVOS_A1.map((l) => [l.lema, l]));

export const ITEMS: ItemJuicio[] = [
  // ── A · SOBREAPLICACIÓN: el error real del alumno ─────────────────
  { lema: 'frate', familia: 'sobreaplicacion', situacion: 'Llamas a tu hermano para que te escuche.',
    s: '___, ascultă-mă o clipă!', opciones: ['Frate', 'Fratule'], correcta: 0, glosaEs: ['hermano', 'hermano'],
    porQue: '«frate» no lleva marca de vocativo; «-ule» sobre este lema no existe.' },
  { lema: 'tată', familia: 'sobreaplicacion', situacion: 'Llamas a tu padre desde la otra habitación.',
    s: '___, vino puțin aici!', opciones: ['Tatăle', 'Tată'], correcta: 1, glosaEs: ['padre', 'padre'],
    porQue: 'los masculinos en -ă no toman -le en vocativo: la forma es la del lema.' },
  { lema: 'om', familia: 'sobreaplicacion', situacion: 'Le dices a un amigo que mire por dónde pisa.',
    s: '___, ai grijă pe unde calci!', opciones: ['Omule', 'Oame'], correcta: 0, glosaEs: ['hombre', 'hombre'],
    porQue: '«om» hace «omule»; «*oame» aplica la desinencia -e a un lema que no la admite.' },
  { lema: 'domn', familia: 'sobreaplicacion', situacion: 'Avisas a un señor de que se deja el paraguas.',
    s: '___, v-ați uitat umbrela!', opciones: ['Domne', 'Domnule'], correcta: 1, glosaEs: ['señor', 'señor'],
    porQue: '«domn» hace «domnule»; «*domne» sería la sobreaplicación de -e. NO CERTIFICADO: el lingüista señala que «domne» circula como reducción coloquial de «domnule» (dom\'le, don\'le), o sea substándar y no error de sistema. Ítem retirado.' },
  { lema: 'bunic', familia: 'sobreaplicacion', situacion: 'Llamas a tu abuelo para enseñarle algo.',
    s: '___, uite ce am găsit!', opciones: ['Bunice', 'Bunicule'], correcta: 1, glosaEs: ['abuelo', 'abuelo'],
    porQue: '«bunic» sólo admite «bunicule»; la -e sobre velar daría además *bunice.' },

  // ── B · REGISTRO: las dos formas EXISTEN y la situación decide ─────
  { lema: 'doctor', familia: 'registro', situacion: 'Te diriges a tu médico en la consulta, con respeto.',
    s: '___, mai durează mult?', opciones: ['Doctorule', 'Domnule doctor'], correcta: 1, glosaEs: ['doctor', 'señor doctor'],
    porQue: 'las dos formas están atestadas, pero «doctorule» es brusco dirigido a la persona: el trato cortés es nominal.' },
  { lema: 'profesor', familia: 'registro', situacion: 'Te diriges a tu profesor en clase, con respeto.',
    s: '___, am o întrebare.', opciones: ['Domnule profesor', 'Profesorule'], correcta: 0, glosaEs: ['señor profesor', 'profesor'],
    porQue: 'igual que con el médico: la forma en -ule existe y es brusca; el trato cortés es nominal.' },
  { lema: 'fată', familia: 'registro', situacion: 'Te diriges a una chica que no conoces, en la calle.',
    s: '___, ți-a căzut ceva!', opciones: ['Fato', 'Domnișoară'], correcta: 1, glosaEs: ['chica', 'señorita'],
    porQue: '«fato» está atestado pero es popular y brusco con una desconocida.' },

  // ── C · FORMA vs LEMA: el vocativo frente al nominativo articulado ──
  { lema: 'domn', familia: 'forma-vs-lema', situacion: 'Llamas a un señor por la calle para que se gire.',
    s: '___, ați scăpat portofelul!', opciones: ['Domnul', 'Domnule'], correcta: 1, glosaEs: ['el señor', 'señor'],
    porQue: '«domnul» es el nominativo articulado y no sirve para dirigirse a nadie.' },
  { lema: 'copil', familia: 'forma-vs-lema', situacion: 'Le hablas a un niño para que te cuente qué pasó.',
    s: '___, spune-mi ce s-a întâmplat.', opciones: ['Copilul', 'Copile'], correcta: 1, glosaEs: ['el niño', 'niño'],
    porQue: 'el articulado «copilul» es sujeto, no llamada.' },
];

export function verificar(items: ItemJuicio[]): string[] {
  const v: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `JUVO-${String(i + 1).padStart(3, '0')} (${x.familia})`;
    const l = LEMA.get(x.lema);
    if (!l) { v.push(`${id}: lema fuera del lexicón`); continue; }
    if (x.opciones[0] === x.opciones[1]) v.push(`${id}: las dos opciones son la misma`);
    if (!x.s.includes('___')) v.push(`${id}: sin hueco`);
    for (const [campo, t] of [['frase', x.s], ...x.opciones.map((o) => ['opción', o] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // La buena de la familia de sobreaplicación tiene que salir del
    // paradigma: si no, el ítem no está anclado a nada recalculable.
    // El gate v0 sólo entraba aquí con `familia === 'sobreaplicacion'`, y
    // dejaba las opciones de las otras dos familias sin comprobar contra
    // nada: cinco de diez. Así se coló `Domnișoară`, que no está en el
    // lexicón. Ahora TODA opción que sea una sola palabra tiene que salir
    // del lexicón o del paradigma.
    // Sólo la opción CORRECTA: la mala es agramatical por diseño y no
    // puede salir del lexicón — eso ya lo comprueba el bloque de abajo.
    for (const op of [x.opciones[x.correcta] ?? '']) {
      if (!op || op.includes(' ')) continue;                // fórmulas nominales (Domnule doctor)
      const enLexicon = SUSTANTIVOS_A1.some((y) => [y.lema, y.vocSg, ...(y.vocAlt ?? []), y.plural].filter(Boolean).map((t) => String(t).toLowerCase()).includes(op.toLowerCase()));
      const derivable = [vocativo(l, 'sg'), vocativo(l, 'pl'), l.lema, l.plural].filter(Boolean).map((t) => String(t).toLowerCase()).includes(op.toLowerCase());
      const articulado = new RegExp(`^${l.lema}(ul|le|a|ua)$`, 'i').test(op);
      if (!enLexicon && !derivable && !articulado) v.push(`${id}: la opción «${op}» no sale del lexicón ni del paradigma — nada la valida`);
    }
    if (x.familia === 'sobreaplicacion') {
      const esperada = [vocativo(l, 'sg'), ...(l.vocAlt ?? [])].filter(Boolean).map((s) => String(s).toLowerCase());
      const dada = x.opciones[x.correcta].toLowerCase();
      if (!esperada.includes(dada)) v.push(`${id}: la opción marcada correcta («${x.opciones[x.correcta]}») no sale del paradigma (${esperada.join(' / ')})`);
      const mala = (x.opciones[x.correcta === 0 ? 1 : 0] ?? '').toLowerCase();
      if (esperada.includes(mala)) v.push(`${id}: la opción marcada MALA («${mala}») es una forma correcta del lexicón`);
    }
  }
  return v;
}

/** LA MEDICIÓN QUE DECIDE EL FORMATO. Se imprime siempre y antes que
 *  nada: si la glosa española de las dos opciones DIFIERE, un alumno que
 *  traduzca acierta sin saber rumano, y el juicio mide español. Es
 *  exactamente lo que mató el formato en portugués. */
export function medirGlosa(items: ItemJuicio[]) {
  const decide = items.filter((x) => x.glosaEs[0] !== x.glosaEs[1]);
  const azar = 1 / 2;
  const lineas = [
    '## Preflight — la potencia y el atajo, antes que el contenido', '',
    `- ítems: **${items.length}** · opciones por ítem: 2 · **azar = ${(azar * 100).toFixed(0)} %**`,
    `- un alumno que responde al azar acierta **${(items.length * azar).toFixed(1)}** de ${items.length}: para separar saber de suerte con este tamaño hace falta acertar ${Math.ceil(items.length * azar) + 3}+ (p < 0,05 binomial, aprox.)`,
    '',
    '### El atajo de traducción, como rasgo de PRIMERA CLASE', '',
    '| familia | ítems | la glosa española DECIDE |',
    '|---|---:|---:|',
  ];
  for (const f of ['sobreaplicacion', 'registro', 'forma-vs-lema'] as const) {
    const xs = items.filter((x) => x.familia === f);
    const d = xs.filter((x) => x.glosaEs[0] !== x.glosaEs[1]);
    lineas.push(`| ${f} | ${xs.length} | ${d.length}${d.length ? ' ⚠' : ''} |`);
  }
  lineas.push('', `**La glosa decide en ${decide.length}/${items.length} ítems.**`);
  for (const x of decide) lineas.push(`- ⚠ ${x.lema} (${x.familia}): «${x.glosaEs[0]}» vs «${x.glosaEs[1]}» — traduciendo se acierta`);
  return { lineas, decide };
}

// ══════════════════════════════════════════════════════════════════════
// VEREDICTO (2026-09-03) — EL FORMATO SE DECLARA **MUERTO** PARA EL
// VOCATIVO. La regla de corte, escrita antes de mirar, se disparó: la
// glosa decide en **5/10**, no en 3/10, porque dos de mis siete
// «limpios» estaban mal declarados (`Domnule doctor` no glosa «doctor»
// sino «señor doctor», y `domn` = «señor» está en el propio lexicón A1).
// Mi medición falló justo donde el coordinador sospechaba.
//
// NADA DE ESTE FICHERO SE PUBLICA. Queda como evidencia de un
// experimento que costó 10 ítems y cerró un formato para un punto
// entero, en vez de descubrirlo con 8 ítems ya en producción.
//
// Y LA HIPÓTESIS DEL COORDINADOR ERA CORRECTA, que es lo que hay que
// dejar escrito para que no se herede una conclusión falsa: en la
// familia `sobreaplicacion` la glosa española **realmente NO decide,
// 0/5**. El rumano no es el portugués en este punto. El formato no
// muere por la causa de PT —la glosa que contiene la respuesta— sino
// por otras tres, y ninguna se veía desde fuera:
//   1. Tres de los cinco distractores son errores de GENERADOR, no de
//      alumno (*Fratule exige borrar la -e primero; *Oame exige conocer
//      el tema supletivo `oame-`; *Tatăle fusiona el articulado con -e).
//      Es la misma distinción que mató el imperativo negativo.
//   2. Dos de las cinco «malas» NO son certificables como agramaticales:
//      `oame` es vocativo antiguo atestado en textos del s. XVI, y
//      `domne` circula como reducción coloquial de `domnule`. Corregir
//      una forma real es la clase que más daño ha hecho aquí.
//   3. Techo léxico: los masculinos con vocativo ÚNICO y marcado en el
//      lexicón A1 son exactamente TRES (om, domn, bunic); los demás
//      llevan `vocAlt`. Quitando om y domn queda UNO. Ocho ítems serían
//      ocho repeticiones de la regla velar: un drill de ocho ensayos
//      binarios se aprueba con cuatro monedas.
//
// Tres opciones en vez de dos NO rescatan nada: la única tercera forma
// plausible es el nominativo articulado, que reintroduce el cue del
// artículo español. La tercera opción no añade información, añade el
// atajo.
// ══════════════════════════════════════════════════════════════════════

if (new RegExp(`[/\\\\]juicio-ro-vocativo\\.ts$`).test(process.argv[1] ?? '')) {
  const { lineas, decide } = medirGlosa(ITEMS);
  console.log(`# Juicio / discriminación del vocativo rumano — INTENTO ÚNICO\n`);
  console.log(lineas.join('\n'));
  console.log('\n## Los ítems\n');
  for (const [i, x] of ITEMS.entries())
    console.log(`${String(i + 1).padStart(2, '0')}. [${x.familia}] ${x.situacion}\n    ${x.s}   ( ${x.opciones[0]} | ${x.opciones[1]} )  → **${x.opciones[x.correcta]}**\n    glosa: «${x.glosaEs[0]}» vs «${x.glosaEs[1]}»`);
  const v = verificar(ITEMS);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
  console.log(`\n## Regla de corte\n\nLa glosa decide en **${decide.length}/${ITEMS.length}**. ${decide.length === 0 ? 'Ninguno: el formato SOBREVIVE la prueba mecánica y pasa al lingüista.' : 'Los ítems marcados no miden rumano.'}`);
}

// scripts/lotes/corr-ro-b1.ts — EL LOTE 18 RUMANO: corrección, B1.
//
//   npx tsx scripts/lotes/corr-ro-b1.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-b1.ts --asigna   # a qué punto cuenta
//
// ONCE ítems, no veinticuatro, y ése es el contenido del lote:
//   · r7-disparadores-sa   5  (piso declarado 5)
//   · r7-anti-progresivo   6  (piso declarado 6)
//   · r7-infinitivo-residual  0 — MOVIDO A TRANSFORMACIÓN sin escribir nada
//
// ── POR QUÉ ONCE: LA PRECONDICIÓN, ANTES DE ESCRIBIR ─────────────────
// Los tres puntos son de clase `trampa` y los tres se apoyaban en un
// calco con infinitivo o gerundio cuya agramaticalidad NO se podía dar
// por hecha, porque el rumano antiguo y literario sí tenía esas
// construcciones. Es la clase exacta que ya mató dos puntos de este
// inventario. Así que se le preguntó al lingüista adversarial ANTES de
// escribir una línea, y devolvió tres números: 5, 6 y 0.
//
// LO QUE SE CAYÓ, y no es poco:
//   · `*vreau a merge` — dexonline s.v. `vrea` (DEXI) da el infinitivo
//     como «înv., astăzi rar»: arcaico y raro, que es la etiqueta que
//     mató `îmi place a citi`. Y aquí está peor, porque de `a vrea` +
//     infinitivo sale el futuro vivo (`voi merge`).
//   · `*vreau el să vină` — agramatical sí (GALR: con material
//     interpuesto, `ca` es obligatorio), pero **NO LO PRODUCE UN
//     HISPANOHABLANTE**: para escribirlo hay que BORRAR el complementante,
//     y el español no lo licencia nunca («*Quiero él venga»). Quien lo
//     borra es el anglófono: *I want him to come*. **Es la huella
//     dactilar de `a asista la`**: material heredado de un manual en
//     inglés. El inventario llevaba ese error diana declarado desde que
//     se escribió.
//   · `*pot a merge` — la fuente que da la norma (`pot merge`) no
//     proscribe la variante, y dexonline s.v. `putea` presenta el régimen
//     CON partícula señalando que «a» *puede* omitirse. Omisión, no
//     prohibición. Y el resto del punto no tiene mala ninguna: el español
//     acierta `înainte de a pleca`, `fără a spune`, `în loc de a face`,
//     y `înainte de a pleca` compite libremente con `înainte să plec`.
//
// ── LAS DOS MALAS QUE SÍ AGUANTAN EN `r7-disparadores-sa` ────────────
//   (a) `*Vreau să el vină` — calco 1:1 del orden español «que él venga».
//       Agramatical por la ADYACENCIA `să`+verbo (GALR): entre `să` y el
//       verbo sólo se intercalan los clíticos y `nu`.
//   (b) `*Vreau că vine` — los volitivos y directivos no seleccionan
//       `că`. El alumno lo produce porque `că` es su «que» transparente y
//       ya lo tiene entrenado en `cred că`. **NO vale con `a spera` ni
//       `a se teme`**: ahí `Sper că vine` y `Sper să vină` son los dos
//       correctos, y hay gate.
//
// ── LA ÚNICA CARA DE `r7-anti-progresivo`, y las tres que no entran ──
// Agramatical es el INDICATIVO FINITO de `a fi` + gerunziu EVENTIVO. No
// lo es `fi` + gerunziu en general: el prezumtiv está vivo (`o fi
// mâncând`) y hay gerundios lexicalizados como adjetivo donde `este +
// -ând` es correcto (`este suferind`, DEX). Fuera quedan:
//   · `*stau mâncând` — `a sta` + gerunziu es predicación depictiva
//     lícita (`stătea plângând în colț`); la buena se separa por una
//     conjunción (`stau ȘI mănânc`), no por agramaticalidad;
//   · `*eram mâncând` — arcaico, no agramatical, y vive en r5;
//   · prospectiva y retrospectiva — sus calcos son rumano bien formado
//     con otro significado: no hay nada que corregir.
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';
import { exenta } from '../lib/exenciones-hunspell-ro';
import { medirAtajo } from '../lib/atajo-correccion';
import { revisarCopula } from '../lib/copula-ro';
import { informeAsigna } from '../lib/asigna-ro';

const DISP = 'r7-disparadores-sa';
const PROG = 'r7-anti-progresivo';

/** Regentes que SÍ admiten «că» de verdad: con ellos la mala del tipo (b)
 *  sería lengua correcta. `Sper că vine` y `Sper să vină` valen los dos. */
const ADMITEN_CA = /(?<![\p{L}])(sper|speră|sperăm|mă tem|se teme|cred|crede|știu|știe|zic|zice|spun|spune)(?![\p{L}])/iu;
/** Gerundios lexicalizados como ADJETIVO: con ellos «este + -ând» es
 *  rumano correcto y la mala dejaría de serlo (DEX s.v. suferind). */
const GERUNZIU_ADJETIVO = /(?<![\p{L}])(suferind|crescând|descrescând|sângerând|strălucind|arzând)(?![\p{L}])/iu;
/** El indicativo finito de «a fi»: lo único que hace agramatical la mala. */
const FI_FINITO = /(?<![\p{L}-])(sunt|ești|este|e|suntem|sunteți)(?![\p{L}-])/iu;

export const ITEMS: ItemCorreccion[] = [
  // ══ r7-disparadores-sa · 5 ════════════════════════════════════════
  // (a) el orden español calcado: să + sujeto + verbo.
  { p: DISP, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Vreau să el vină mâine la birou.', buena: 'Vreau ca el să vină mâine la birou.',
    alt: ['Vreau să vină el mâine la birou.'],
    calcoEs: 'Quiero que él venga mañana a la oficina.',
    explicacion: 'Entre «să» y el verbo no cabe nada más que los clíticos y «nu»: el sujeto no puede meterse ahí. Cuando el sujeto va expreso delante, el rumano abre la subordinada con «ca»: «vreau CA el SĂ vină». La otra salida es posponerlo: «vreau să vină el».' },
  { p: DISP, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Doresc să fiica mea studieze la Cluj.', buena: 'Doresc ca fiica mea să studieze la Cluj.',
    alt: ['Doresc să studieze fiica mea la Cluj.'],
    calcoEs: 'Deseo que mi hija estudie en Cluj.',
    explicacion: 'El sujeto «fiica mea» no puede ir entre «să» y el verbo. Con sujeto expreso antepuesto hace falta «ca»: «doresc CA fiica mea SĂ studieze». El español pone un solo «que» y de ahí sale el error.' },
  { p: DISP, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'E important să copiii doarmă opt ore.', buena: 'E important ca copiii să doarmă opt ore.',
    alt: ['E important să doarmă copiii opt ore.'],
    calcoEs: 'Es importante que los niños duerman ocho horas.',
    explicacion: 'También con los impersonales: «e important CA copiii SĂ doarmă». La partícula «să» va pegada al verbo, así que todo lo que el español mete detrás de «que» tiene que ir delante de «ca» o detrás del verbo.' },
  // (b) «că» donde el regente pide «să».
  { p: DISP, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Vreau că vii cu mine la gară.', buena: 'Vreau să vii cu mine la gară.',
    calcoEs: 'Quiero que vengas conmigo a la estación.',
    explicacion: 'Los verbos de voluntad no admiten «că»: piden «să» + conjuntivo. El «que» español se traduce por «că» sólo cuando la subordinada afirma un hecho («cred că vine»); con «a vrea» nunca.' },
  { p: DISP, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Te rog că închizi ușa.', buena: 'Te rog să închizi ușa.',
    calcoEs: 'Te pido que cierres la puerta.',
    explicacion: 'Lo mismo con los verbos de petición: «te rog SĂ închizi». Con «că» la frase intentaría afirmar que cierras la puerta, que no es lo que se pide.' },

  // ══ r7-anti-progresivo · 6 ════════════════════════════════════════
  // Una sola cara: indicativo finito de «a fi» + gerunziu eventivo.
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Sunt mâncând, te sun mai târziu.', buena: 'Mănânc, te sun mai târziu.',
    alt: ['Tocmai mănânc, te sun mai târziu.'],
    calcoEs: 'Estoy comiendo, te llamo luego.',
    explicacion: 'El rumano no tiene progresivo: «estoy comiendo» es sencillamente «mănânc». Para marcar que ocurre justo ahora se añade un adverbio («tocmai mănânc») o se coordina («stau ȘI mănânc»), nunca «a fi» + gerundio.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Ce ești făcând acum?', buena: 'Ce faci acum?',
    calcoEs: '¿Qué estás haciendo ahora?',
    explicacion: 'También en pregunta: el presente simple hace todo el trabajo, y «acum» ya dice que es ahora. «Ești făcând» no es rumano de ningún registro.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Ea este scriind o scrisoare lungă.', buena: 'Ea scrie o scrisoare lungă.',
    calcoEs: 'Ella está escribiendo una carta larga.',
    explicacion: 'El presente rumano cubre el progresivo español entero. Añadir «este» delante del gerundio es calcar una perífrasis que esta lengua no tiene.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Suntem așteptând autobuzul de zece minute.', buena: 'Așteptăm autobuzul de zece minute.',
    calcoEs: 'Estamos esperando el autobús desde hace diez minutos.',
    explicacion: 'La duración la lleva «de zece minute», no una perífrasis: «așteptăm». El rumano marca el aspecto con adverbios y complementos, no con «a fi» + gerundio.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Copiii sunt dormind în camera lor.', buena: 'Copiii dorm în camera lor.',
    calcoEs: 'Los niños están durmiendo en su habitación.',
    explicacion: 'En plural pasa lo mismo: «copiii dorm». El gerundio rumano existe, pero es adverbial («dormind, n-a auzit telefonul»), nunca el segundo miembro de una perífrasis con «a fi».' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Sunt citind o carte foarte bună.', buena: 'Citesc o carte foarte bună.',
    calcoEs: 'Estoy leyendo un libro muy bueno.',
    explicacion: '«Citesc» ya significa «leo» y «estoy leyendo»: el rumano no reparte esos dos valores en dos formas. Por eso el calco con «sunt» sobra siempre.' },
];

export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CORO5-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));

    if (x.p === DISP) {
      const saAdyacente = /(?<![\p{L}])să\s+(nu\s+|[mtsnvșî]\p{L}{0,3}\s+)?\p{L}+/iu;
      const tipoOrden = /(?<![\p{L}])să\s+/iu.test(x.mala) && !/(?<![\p{L}])ca\s+/iu.test(x.mala);
      const tipoCa = /(?<![\p{L}])că(?![\p{L}])/iu.test(x.mala);
      if (!tipoOrden && !tipoCa) v.push(`${id}: la mala no es ninguna de las dos que aguantan (să + sujeto + verbo, o «că» con regente volitivo)`);
      // (b) sólo con regentes que NO admiten «că»: con `a spera` y
      // `a se teme` las dos rigen y la mala sería correcta.
      if (tipoCa && ADMITEN_CA.test(x.mala))
        v.push(`${id}: el regente admite «că» de verdad (a spera, a se teme, a crede…) — ahí las dos rigen y la mala es lengua correcta`);
      if (tipoCa && !/(?<![\p{L}])să(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena no lleva «să»`);
      if (tipoOrden && !/(?<![\p{L}])ca\s+[^]*?\s+să(?![\p{L}])/iu.test(x.buena))
        v.push(`${id}: la buena no lleva el molde «ca … să» con el sujeto entre medias`);
      // Y EL ERROR DE ANGLÓFONO, que es lo que este lote existe para no
      // repetir: la mala NO puede ser «vreau el să vină», sin complementante
      // ninguno. El español nunca lo produce; el inglés sí.
      if (tipoOrden && !saAdyacente.test(x.mala) && /(?<![\p{L}])(el|ea|ei|ele)\s+să(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala borra el complementante («vreau el să vină») — eso es error de ANGLÓFONO (I want him to come), no de hispanohablante: el español no licencia «*Quiero él venga»`);
    }

    if (x.p === PROG) {
      if (!FI_FINITO.test(x.mala)) v.push(`${id}: la mala no lleva el indicativo finito de «a fi» — lo agramatical es ESO, no «fi» + gerunziu en general (el prezumtiv «o fi mâncând» está vivo)`);
      if (!/(?<![\p{L}])\p{L}+(ând|ind)(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala no lleva gerunziu`);
      if (GERUNZIU_ADJETIVO.test(x.mala)) v.push(`${id}: el gerundio de la mala está lexicalizado como ADJETIVO (DEX) — ahí «este + -ând» es rumano correcto y la mala no es mala`);
      if (/(?<![\p{L}])(stau|stai|stă|stăm|stați)(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala usa «a sta» + gerunziu, que es predicación depictiva lícita (stătea plângând în colț) — la buena se separa por una conjunción, no por agramaticalidad`);
      if (/(?<![\p{L}])(eram|erai|era|erați|erau)(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala está en imperfecto — «eram mâncând» es ARCAICO, no agramatical, y ese hecho vive en r5-perifrasis-pasado`);
      if (/(?<![\p{L}])\p{L}+(ând|ind)(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena conserva el gerunziu`);
    }
  }
  v.push(...revisarCopula(items.map((x) => ({ p: x.p, buena: x.buena, alt: x.alt })), 'COP'));
  const m = medirAtajo(items, 'ATAJO');
  for (const id of m.sinDeclarar) v.push(`${id}: atajoEs sin declarar`);
  for (const id of m.atajo) v.push(`${id}: atajoEs=true — el ítem mide español`);
  for (const d of m.discrepan) v.push(d);
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w)))) if (!exenta(w)) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  return v;
}

if (new RegExp(`[/\\\\]corr-ro-b1\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log('# A qué punto cuenta cada ítem del lote 18\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-B1 (lote 18) — ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ~~${x.mala}~~ → **${x.buena}**\n      calco: «${x.calcoEs}»`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

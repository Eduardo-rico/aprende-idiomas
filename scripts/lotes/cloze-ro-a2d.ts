// scripts/lotes/cloze-ro-a2d.ts — EL OCTAVO LOTE RUMANO: los pasados, por
// la máquina verbal. A1-A2.
//
//   npx tsx scripts/lotes/cloze-ro-a2d.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a2d.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, los tres por `paradigmaVerbal` y el mismo
// lexicón — el criterio del coordinador: puntos BAJO EL PISO y máquina ya
// madura.
//   · r5-participios            `participio(v)`
//   · r5-imperfect              `imperfecto(v, per)`
//   · r3-perfect-compus-intro   `perfectCompus(v, per)`
//
// Cada uno con la casilla que el INVENTARIO nombra como la que confunde:
//   · participios: los IRREGULARES, que es donde el instinto falla
//     (*scriut por scris). Los regulares se derivan solos.
//   · imperfect y perfect compus: la FORMA, con la persona 1.ª — pero no
//     por lo que la v0 de este comentario decía.
//
// LA PREMISA DE LA v0 ERA FALSA, y la desmontó el lingüista. Decía que
// los bloques B y C examinan el sincretismo 1.ª sg = 1.ª pl «que el
// español no tiene». Ese sincretismo es exactamente lo que vuelve el
// ítem INFALSIFICABLE en producción: `eu mergeam` = `noi mergeam` y
// `eu am mers` = `noi am mers`, así que un alumno que ignore la persona
// y conjugue en singular escribe LA MISMA CADENA y acierta. No existe
// respuesta errónea derivada de ignorar la persona. El sincretismo es un
// hecho de RECONOCIMIENTO y un cloze de producción no lo puede tocar.
//
// Y mi gate tenía el motivo AL REVÉS: decía «sin noi el hueco admite la
// 1.ª del singular ⇒ indeterminado», cuando el hueco admite la 1.ª del
// singular y por eso NO queda indeterminado — las dos dan la misma clave.
// Lo que hay que excluir es `tu/el/voi/ei` (mergeai, mergea, mergeați,
// mergeau), y para eso `eu` vale igual que `noi`. Era la cicatriz de
// CLRO-003 del lote 1 aplicada por analogía a un caso donde no aplica, y
// fabricó ocho «noi» de manual en una lengua pro-drop.
//
// Lo que se hace en su lugar: los bloques B y C ALTERNAN `eu` y `noi`,
// con la misma clave, y un gate exige que las DOS personas aparezcan en
// cada bloque. Así el sincretismo se ve donde sí se puede aprender —en
// el repaso, con los dos ítems al lado— en vez de declararse en una
// cabecera. Lo que el ítem puntúa es la FORMA; y en el bloque C, el
// AUXILIAR, que es donde vive el error real: *avem mâncat, del que calca
// «hemos» y va a buscar el presente pleno de `a avea`. Por eso los ocho
// participios de C son REGULARES: todo lo que el ítem examina es el
// auxiliar.
import { verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';

const PART = 'r5-participios';
const IMPF = 'r5-imperfect';
const PC = 'r3-perfect-compus-intro';

export const ITEMS: ClozeRo[] = [
  // ── r5-participios · 8 · los irregulares, que es donde falla ──────
  { p: PART, inf: 'a scrie', t: 'participio', s: 'Am ___ (a scrie) un mesaj lung.', pista: 'escribir — participio; irregular, no sale de la raíz', ancla: 'un mesaj lung', transparenteLatin: false },
  { p: PART, inf: 'a spune', t: 'participio', s: 'Mi-a ___ (a spune) totul aseară.', pista: 'decir — participio; irregular', ancla: 'totul aseară', transparenteLatin: false },
  { p: PART, inf: 'a merge', t: 'participio', s: 'Ieri am ___ (a merge) la piață pe jos.', pista: 'ir — participio; irregular', ancla: 'la piață pe jos', transparenteLatin: false },
  { p: PART, inf: 'a pune', t: 'participio', s: 'Unde ai ___ (a pune) cheile?', pista: 'poner — participio; irregular', ancla: 'cheile', transparenteLatin: false },
  { p: PART, inf: 'a face', t: 'participio', s: 'Ce ai ___ (a face) sâmbătă?', pista: 'hacer — participio; irregular: la vocal del tema se reduce a ă en sílaba átona (a → ă)', ancla: 'sâmbătă', transparenteLatin: false },
  { p: PART, inf: 'a vedea', t: 'participio', s: 'Nu am ___ (a vedea) filmul acela.', pista: 'ver — participio; irregular: desde «a vedea» cambian DOS cosas, la vocal (e → ă) y la consonante (d → z)', ancla: 'filmul acela', transparenteLatin: false },
  { p: PART, inf: 'a bea', t: 'participio', s: 'Copiii au ___ (a bea) toată apa.', pista: 'beber — participio; irregular: la vocal del tema se reduce a ă en sílaba átona (e → ă)', ancla: 'toată apa', transparenteLatin: false },
  { p: PART, inf: 'a fi', t: 'participio', s: 'Anul trecut am ___ (a fi) în România.', pista: 'ser/estar — participio; irregular', ancla: 'Anul trecut', transparenteLatin: false },

  // ── r5-imperfect · 8 · la casilla «noi», por el sincretismo ───────
  { p: IMPF, inf: 'a merge', per: 'noi', t: 'imperfecto', s: 'În fiecare vară noi ___ (a merge) la mare.', pista: 'ir — imperfecto, 1.ª del PLURAL (misma forma que la 1.ª del singular)', ancla: 'În fiecare vară noi', transparenteLatin: false },
  { p: IMPF, inf: 'a fi', per: 'eu', t: 'imperfecto', s: 'Pe atunci eu ___ (a fi) student la Cluj.', pista: 'ser/estar — imperfecto, 1.ª del SINGULAR; irregular (misma forma que la del plural)', ancla: 'Pe atunci eu', transparenteLatin: false },
  { p: IMPF, inf: 'a avea', per: 'noi', t: 'imperfecto', s: 'În copilărie noi ___ (a avea) un câine.', pista: 'tener — imperfecto, 1.ª del plural', ancla: 'În copilărie noi', transparenteLatin: false },
  { p: IMPF, inf: 'a face', per: 'noi', t: 'imperfecto', s: 'Duminica noi ___ (a face) prăjituri împreună.', pista: 'hacer — imperfecto, 1.ª del plural («Duminica», con artículo, = los domingos)', ancla: 'Duminica noi', transparenteLatin: false },
  { p: IMPF, inf: 'a locui', per: 'eu', t: 'imperfecto', s: 'Înainte eu ___ (a locui) într-un apartament mic.', pista: 'vivir (residir) — imperfecto, 1.ª del SINGULAR; tema en vocal', ancla: 'Înainte eu', transparenteLatin: false },
  { p: IMPF, inf: 'a vorbi', per: 'noi', t: 'imperfecto', s: 'Acasă noi ___ (a vorbi) mereu spaniolă.', pista: 'hablar — imperfecto, 1.ª del plural', ancla: 'Acasă noi', transparenteLatin: false },
  { p: IMPF, inf: 'a da', per: 'noi', t: 'imperfecto', s: 'În studenție noi ___ (a da) meditații la matematică.', pista: 'dar — imperfecto, 1.ª del plural; irregular', ancla: 'În studenție noi', transparenteLatin: false },
  { p: IMPF, inf: 'a citi', per: 'eu', t: 'imperfecto', s: 'Seara eu ___ (a citi) până târziu.', pista: 'leer — imperfecto, 1.ª del SINGULAR', ancla: 'Seara eu', transparenteLatin: false },

  // ── r3-perfect-compus-intro · 8 · «am» = 1.ª sg Y 1.ª pl ──────────
  { p: PC, inf: 'a mânca', per: 'noi', t: 'perfect-compus', s: 'Aseară noi ___ (a mânca) la restaurant.', pista: 'comer — pretérito (perfect compus), 1.ª del plural: el auxiliar NO es el presente pleno de «a avea»', ancla: 'Aseară noi', transparenteLatin: false },
  { p: PC, inf: 'a veni', per: 'noi', t: 'perfect-compus', s: 'Azi noi ___ (a veni) cu trenul de dimineață.', pista: 'venir — pretérito, 1.ª del plural', ancla: 'cu trenul de dimineață', transparenteLatin: false },
  { p: PC, inf: 'a vizita', per: 'noi', t: 'perfect-compus', s: 'Noi ___ (a vizita) expoziția săptămâna trecută.', pista: 'visitar — pretérito, 1.ª del plural', ancla: 'săptămâna trecută', transparenteLatin: false },
  { p: PC, inf: 'a cumpăra', per: 'eu', t: 'perfect-compus', s: 'Eu ___ (a cumpăra) biletele ieri.', pista: 'comprar — pretérito, 1.ª del SINGULAR (mismo auxiliar que el plural)', ancla: 'biletele ieri', transparenteLatin: false },
  { p: PC, inf: 'a pleca', per: 'noi', t: 'perfect-compus', s: 'Duminică noi ___ (a pleca) la munte.', pista: 'irse — pretérito, 1.ª del plural («Duminică», sin artículo, = el domingo pasado)', ancla: 'Duminică noi', transparenteLatin: false },
  { p: PC, inf: 'a citi', per: 'eu', t: 'perfect-compus', s: 'Eu ___ (a citi) cartea până la capăt.', pista: 'leer — pretérito, 1.ª del SINGULAR', ancla: 'cartea până la capăt', transparenteLatin: false },
  { p: PC, inf: 'a plăti', per: 'eu', t: 'perfect-compus', s: 'Eu ___ (a plăti) deja chiria pe trei luni.', pista: 'pagar — pretérito, 1.ª del singular', ancla: 'deja chiria pe trei luni', transparenteLatin: false },
  { p: PC, inf: 'a găti', per: 'noi', t: 'perfect-compus', s: 'De Crăciunul trecut noi ___ (a găti) sarmale.', pista: 'cocinar — pretérito, 1.ª del plural', ancla: 'De Crăciunul trecut noi', transparenteLatin: false },
];

/** Participios que el lexicón GUARDA por irregulares. Se comprueba contra
 *  el lexicón y no contra una lista escrita aquí: una lista copiada se
 *  desincroniza, y esa cicatriz ya se pagó tres veces en esta fase. */
const REGULAR = /(at|ut|it|ât)$/;

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO5-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x);
    if (!r) continue;
    const resto = x.s.replace('___', '').replace(/\([^)]*\)/g, ' ');

    // PART: el punto declara que lo que falla son los IRREGULARES. Un
    // participio regular en -at/-ut/-it/-ât se deriva solo y no examina
    // nada; y si además coincide con lo que el instinto produce, el ítem
    // mide reconocimiento. `fost` y `băut` son irregulares aunque acaben
    // en -ut: se comprueba contra el lexicón, que es quien lo sabe.
    if (x.p === PART) {
      if (x.t !== 'participio') v.push(`${id}: el punto es el participio y el tiempo declarado es «${x.t}»`);
      if (x.per) v.push(`${id}: un participio no lleva persona`);
    }

    // IMPF y PC: hace falta un testigo de PERSONA, pero no por lo que
    // decía la v0. `eu` y `noi` dan la MISMA clave, así que ninguno de
    // los dos desambigua respecto del otro —ni falta— y con cualquiera
    // de los dos basta. Lo que el testigo excluye es `tu/el/voi/ei`
    // (mergeai, mergea, mergeați, mergeau), que sí dan otra forma.
    if ((x.p === IMPF || x.p === PC) && x.per !== 'noi' && x.per !== 'eu')
      v.push(`${id}: el punto se examina en 1.ª persona y la declarada es «${x.per}»`);
    if ((x.p === IMPF || x.p === PC) && !/(?<![\p{L}])(noi|eu)(?![\p{L}])/iu.test(resto))
      v.push(`${id}: sin testigo de persona (eu / noi) el hueco admite tu/el/voi/ei, que SÍ dan otra forma`);
    // Y el testigo tiene que ser el de la persona DECLARADA: un ítem con
    // `per: 'eu'` y un «noi» en la frase enseña la forma con la etiqueta
    // cambiada, y la clave sería la misma — invisible sin este gate.
    if ((x.p === IMPF || x.p === PC) && x.per && !new RegExp(`(?<![\\p{L}])${x.per}(?![\\p{L}])`, 'iu').test(resto))
      v.push(`${id}: declara «${x.per}» y la frase no lo lleva`);

    if (x.p === IMPF && x.t !== 'imperfecto') v.push(`${id}: el punto es el imperfecto y el tiempo declarado es «${x.t}»`);
    if (x.p === PC && x.t !== 'perfect-compus') v.push(`${id}: el punto es el perfect compus y el tiempo declarado es «${x.t}»`);
    // El perfect compus es AUXILIAR + participio: dos palabras o no es él.
    if (x.p === PC && r.split(' ').length !== 2) v.push(`${id}: «${r}» no es auxiliar + participio`);
    // Y el imperfecto NO puede coincidir con el presente, o no se ve nada.
    if (x.p === IMPF && !/(am|ai|a|ați|au)$/.test(r)) v.push(`${id}: «${r}» no lleva desinencia de imperfecto`);
  }
  const irregulares = items.filter((x) => x.p === PART && !REGULAR.test(String(respuestaDe(x) ?? '')));
  if (items.some((x) => x.p === PART) && irregulares.length < 4)
    v.push(`sólo ${irregulares.length} de los participios son irregulares de forma — el punto dice que ahí es donde falla el instinto`);
  // El sincretismo no se puede PUNTUAR en producción, pero sí se puede
  // VER: exigiendo las dos personas en el bloque, el repaso pone `eram`
  // con «eu» y con «noi» al lado y el alumno lo lee. Es la única forma
  // que este formato tiene de enseñarlo, y sustituye a la declaración de
  // cabecera que el lingüista desmontó.
  for (const p of [IMPF, PC]) {
    const xs = items.filter((x) => x.p === p);
    if (!xs.length) continue;
    const pers = new Set(xs.map((x) => x.per));
    if (pers.size < 2) v.push(`${p}: una sola persona en el bloque (${[...pers].join(', ')}) — el sincretismo eu/noi no se ve en ningún sitio`);
  }
  // Y el punto real del perfect compus es el AUXILIAR (*avem mâncat, del
  // que calca «hemos»): con participios irregulares el ítem se reparte
  // entre dos dificultades y el bloque A ya los da.
  const pcIrreg = items.filter((x) => x.p === PC && !REGULAR.test(String(respuestaDe(x) ?? '').split(' ')[1] ?? ''));
  if (pcIrreg.length) v.push(`${pcIrreg.length} ítems de perfect compus llevan participio irregular — el punto de este bloque es el auxiliar, y el bloque A ya examina el participio`);
  return v;
}

// EL GUARDIÁN DEL BLOQUE PRINCIPAL VA ANCLADO AL FINAL. La v0 usaba
// `includes('<nombre>')`, y `cloze-ro-a1` es PREFIJO de `cloze-ro-a1c`,
// `cloze-ro-a2` lo es de a2b/a2c/a2d/a2e y `corr-ro-a1` de `corr-ro-a1b`:
// al importar un lote hijo, el bloque principal del padre corría entero
// —imprimía su tabla y podía llamar a `process.exit(1)` con SUS gates—.
// Falso rojo hoy; falso verde el día que alguien lea sólo el código de
// salida y se lo atribuya al lote equivocado. Lo cazó el lingüista
// adversarial en el lote 11. Tres colisiones reales en once ficheros.
if (new RegExp(`[/\\\\]cloze-ro-a2d\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 8\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze derivado RO-A2d — pasados · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

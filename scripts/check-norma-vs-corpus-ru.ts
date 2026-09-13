// scripts/check-norma-vs-corpus-ru.ts
//
//   npx tsx scripts/check-norma-vs-corpus-ru.ts
//   npx tsx scripts/check-norma-vs-corpus-ru.ts --todo   (imprime también lo limpio)
//
// ══ LA PREGUNTA QUE ESTE GATE HACE, Y QUE NO LA HACE NINGÚN OTRO ═════
//
// **¿La biblioteca que el alumno lee contradice la norma que el punto le
// enseña?**
//
// Es una clase que no estaba en ningún relevo y que se encontró POR
// CASUALIDAD, midiendo otra cosa: `u10-sintagma-numeral-adjetivo` enseña el
// reparto moderno del adjetivo tras 2-4 (masculino → genitivo plural), y en
// las 2.180 lecturas `два большие` sale **7** frente a `два больших` 10, y
// `два молодые` **6** frente a `два молодых` **0**. Leídos uno a uno: son
// masculinos de verdad, de Dostoievski, Turguéniev y Chéjov.
//
// **El eje es estructural y no es ruso.** La biblioteca de inmersión de las
// cuatro lenguas es de DOMINIO PÚBLICO, o sea de hace un siglo o más. Así
// que todo punto que enseñe una norma moderna está expuesto a que el
// material que el alumno lee use la otra forma. Hasta ahora eso sólo se
// había notado como «prosa de otro siglo» en la asimetría de la AUSENCIA
// —«el corpus tiene fecha, si no sale no prohíbe»—; aquí va **activamente
// en contra**.
//
// ⚠ Y LO QUE LO SEPARA DE TODO LO ANTERIOR: en rumano y en latín el corpus
// refutaba AFIRMACIONES DEL MATERIAL y ganaba el corpus. Aquí refuta la
// NORMA, y **gana la norma**. Es la primera vez que el corpus pierde, y por
// eso hace falta una regla aparte en vez de reusar la de siempre: lo que
// sale de aquí no es «el punto está mal», es «el alumno va a leer la otra
// forma, y si la lección no se lo dice, la inmersión desenseña el punto».
//
// ══ ESTE GATE NO DECIDE NADA, Y ESO ES DELIBERADO ════════════════════
//
// Imprime «el punto enseña X y la biblioteca trae Y, n veces». El juicio lo
// pone quien escriba el lote, y va al campo `contradiceElCorpus` del punto.
// Un gate que decidiera aquí estaría eligiendo entre la norma y el corpus
// sin fuente, que es justo lo que el §0 prohíbe.
//
// ══ LO QUE CUBRE Y LO QUE NO, ESCRITO EN VEZ DE DISIMULADO ═══════════
//
// Barre los ejemplos en cirílico que los 93 puntos escriben en su propia
// prosa (`descripcion`, `cita`, `motivo`, `gratis`). No lee la prosa: sólo
// saca las cadenas. Eso significa:
//
//   · **NO ve un punto que enseñe una norma sin escribir el ejemplo.** Su
//     cobertura es la de la prosa del inventario, y se imprime.
//   · Los rivales salen de UNA lista cerrada de sustituciones de desinencia
//     confundibles. No es la morfología entera: es el conjunto de pares que
//     de verdad compiten en la historia de la lengua.
//   · Un rival que gana **no prueba nada por sí solo**: hay que LEERLO. El
//     gate lo dice en su salida, porque contar no separa una forma que
//     compite de un homógrafo de otro lema.
import { PUNTOS_RU } from '../lib/data/languages/ru/inventario-puntos';
import { buscar, controles } from './corpus-ru';

/** Los pares de desinencia que COMPITEN de verdad, con su caso testigo.
 *  No es «todas las desinencias del ruso»: es la lista de los sitios donde
 *  la norma de hoy y la lengua del XIX pueden separarse, o donde dos formas
 *  correctas conviven. Cada entrada tiene que poder nombrarse. */
const RIVALES: { de: RegExp; a: string; porQue: string }[] = [
  // El que destapó la clase: adjetivo plural tras numeral 2-4.
  { de: /ых$/, a: 'ые', porQue: 'adjetivo plural: genitivo/acusativo frente a nominativo' },
  { de: /ые$/, a: 'ых', porQue: 'ídem, al revés' },
  { de: /их$/, a: 'ие', porQue: 'ídem, tema blando' },
  { de: /ие$/, a: 'их', porQue: 'ídem, al revés' },
  // El reparto que la v0 del inventario tenía invertido.
  { de: /ы$/, a: 'и', porQue: 'plural: tema duro frente a blando o regla ortográfica' },
  { de: /и$/, a: 'ы', porQue: 'ídem, al revés' },
  // El segundo locativo.
  { de: /у$/, a: 'е', porQue: 'segundo locativo frente a prepositivo regular' },
  { de: /е$/, a: 'у', porQue: 'ídem, al revés' },
  // Instrumental: duro frente a blando, y la variante literaria en -ою.
  { de: /ой$/, a: 'ою', porQue: 'instrumental femenino: la variante literaria del XIX' },
  { de: /ом$/, a: 'ем', porQue: 'instrumental masculino: duro frente a blando' },
  // La ortografía antigua que el corpus trae y la de hoy no.
  { de: /ого$/, a: 'аго', porQue: 'genitivo del adjetivo en ortografía prerreforma' },
];

/** Saca las cadenas cirílicas de DOS O MÁS palabras. Una palabra suelta no
 *  sirve: sin contexto es homógrafo de media lengua, y el proyecto ya tiene
 *  escrito que con cadenas cortas no se cuenta, se lee. */
function ejemplosDe(texto: string): string[] {
  const out: string[] = [];
  // ⚠ `\w` y `\b` están PROHIBIDOS en ruso: en cirílico devuelven cero
  // limpio y sin error. Clases unicode y nada más.
  for (const m of texto.matchAll(/\p{Script=Cyrillic}+(?:[ -]\p{Script=Cyrillic}+)+/gu)) {
    const s = m[0].trim().toLowerCase();
    if (s.split(/[ -]/).length >= 2 && s.split(/[ -]/).length <= 4) out.push(s);
  }
  return out;
}

/** Toda la prosa del punto, en minúsculas: donde se busca si el rival lo
 *  escribe el propio punto. */
const prosaDe = (p: { descripcion: string; cita: string; motivo: string; gratis: string; varianza?: string; abierto?: string }) =>
  [p.descripcion, p.cita, p.motivo, p.gratis, p.varianza ?? '', p.abierto ?? ''].join(' ').toLowerCase();

export interface Choque {
  punto: string; ensena: string; nEnsena: number;
  rival: string; nRival: number; porQue: string;
}

export function barrer(): { choques: Choque[]; medidos: number; puntosConEjemplo: number; cero: string[] } {
  const choques: Choque[] = [];
  const cero: string[] = [];
  const vistos = new Set<string>();
  let medidos = 0;
  let puntosConEjemplo = 0;

  for (const p of PUNTOS_RU) {
    const ejs = [...new Set([
      ...ejemplosDe(p.descripcion), ...ejemplosDe(p.cita),
      ...ejemplosDe(p.motivo), ...ejemplosDe(p.gratis),
    ])];
    if (ejs.length) puntosConEjemplo++;
    for (const e of ejs) {
      const clave = `${p.id}|${e}`;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      medidos++;
      const n = buscar(e).n;
      if (n === 0) cero.push(`${p.id}\t${e}`);
      // ⚠ SOBRE CUALQUIER PALABRA, NO SOBRE LA ÚLTIMA. La v0 cambiaba sólo
      // la desinencia final y por eso **no redescubría el caso que motivó
      // este gate**: en `два новых дома` la forma que compite es la de EN
      // MEDIO (`новых`/`новые`), no la del sustantivo. Un gate escrito a
      // partir de un hallazgo que no caza su propio hallazgo es el §4.27, y
      // se vio porque el criterio de aceptación era justo ése.
      const trozos = e.split(' ');
      for (let i = 0; i < trozos.length; i++) {
        for (const r of RIVALES) {
          if (!r.de.test(trozos[i]!)) continue;
          const alt = [...trozos];
          alt[i] = trozos[i]!.replace(r.de, r.a);
          const rival = alt.join(' ');
          if (rival === e) continue;
          // ⚠ Y EL FILTRO QUE HACE QUE ESTO NO SEA UN GATE APAGADO. Si la
          // PROSA DEL PROPIO PUNTO escribe también el rival, el punto no
          // está enseñando una norma contra la que el corpus vaya: está
          // enseñando el CONTRASTE entre las dos, y las dos son correctas.
          // Es el caso de `u4-acusativo-direccion`, cuyo contenido entero es
          // «в школу» frente a «в школе» — el único hallazgo de la v0, y era
          // ruido. Un gate que marca lo que el punto enseña a propósito
          // nadie lo lee.
          if (prosaDe(p).includes(rival)) continue;
          const nRival = buscar(rival).n;
          // El criterio es el mismo que el del gate del paradigma: un rival a
          // CERO no dice nada, y uno que iguala o gana es lo que hay que leer.
          if (nRival > 0 && nRival >= n) {
            choques.push({ punto: p.id, ensena: e, nEnsena: n, rival, nRival, porQue: r.porQue });
            continue;
          }
          // ⚠ Y SI LOS DOS DAN CERO, EL PAR NO ESTÁ LIMPIO: ES INMEDIBLE CON
          // ESE LEXEMA, y callarse es el fallo que devuelve un cero
          // plausible. Fue literalmente el caso de este gate: la prosa de
          // `u10` escribe `два новых дома`, y `новый` es demasiado raro en
          // la biblioteca — `два новых` 1, `два новые` 0—, así que el par
          // exacto no dice nada. El hallazgo salió de sustituir el adjetivo
          // por uno frecuente.
          //
          // Se abstrae el LEXEMA y se mide el PATRÓN: `два \p{L}+ых` frente
          // a `два \p{L}+ые`. Eso sí encuentra `два большие` 7 contra
          // `два больших` 10 y `два молодые` 6 contra `два молодых` 0, que es
          // de donde salió la clase. Un patrón cuenta MUCHAS palabras a la
          // vez, así que sus números son todavía más una tarea de lectura que
          // los de una cadena exacta.
          if (n === 0 && nRival === 0) {
            const conPatron = (j: number, fin: string) =>
              trozos.map((t, k) => (k === j ? `\\p{L}+${fin}` : t)).join(' ');
            const pEns = conPatron(i, trozos[i]!.match(r.de)![0]);
            const pRiv = conPatron(i, r.a);
            const nPE = buscar(pEns).n;
            const nPR = buscar(pRiv).n;
            if (nPR > 0 && nPR >= nPE * 0.5) {
              choques.push({
                punto: p.id, ensena: `${e}   [patrón ${pEns}]`, nEnsena: nPE,
                rival: `[patrón ${pRiv}]`, nRival: nPR,
                porQue: `${r.porQue} — MEDIDO SOBRE EL PATRÓN, no sobre el lexema: «${e}» y «${rival}» dan los dos CERO en la biblioteca`,
              });
            }
          }
        }
      }
    }
  }
  return { choques, medidos, puntosConEjemplo, cero };
}

if (/[/\\]check-norma-vs-corpus-ru\.ts$/.test(process.argv[1] ?? '')) {
  const c = controles();
  if (!c.ok) { console.error(`CONTROLES EN ROJO (${c.positivo}/${c.negativo}). Ningún número es fiable.`); process.exit(1); }
  console.log(`corpus OK — canario positivo ${c.positivo} · negativo ${c.negativo}\n`);

  const { choques, medidos, puntosConEjemplo, cero } = barrer();

  console.log('── COBERTURA DEL BARRIDO, que es la de la PROSA del inventario ──');
  console.log(`   puntos con al menos un ejemplo en cirílico: ${puntosConEjemplo} de ${PUNTOS_RU.length}`);
  console.log(`   cadenas medidas: ${medidos} · sin una sola aparición en la biblioteca: ${cero.length}`);
  console.log('   ⚠ un punto que enseñe una norma SIN escribir el ejemplo es invisible aquí.\n');

  if (choques.length === 0) {
    console.log('Ningún choque. Y eso también es información: significa que, de lo que');
    console.log('el inventario escribe en cirílico, la biblioteca no contradice nada más.');
  } else {
    console.log(`── ${choques.length} CHOQUES: el punto enseña una forma y la biblioteca trae otra ──`);
    console.log('   Esto NO decide nada. Un rival que gana hay que LEERLO —`corpus-ru.ts --ctx`—');
    console.log('   porque contar no separa una forma que compite de un homógrafo de otro lema.\n');
    for (const x of choques) {
      console.log(`  ${x.punto}`);
      console.log(`    enseña  «${x.ensena}»  ${x.nEnsena}`);
      console.log(`    trae    «${x.rival}»  ${x.nRival}   (${x.porQue})`);
    }
    console.log('\nCuando lo hayas leído, el juicio va al campo `contradiceElCorpus` del punto,');
    console.log('con las cifras y la fecha. En prosa no: hoy mismo se ha pagado que una lectura');
    console.log('escrita en un comentario es una lectura que ningún gate puede ver.');
  }

  if (process.argv.includes('--todo') && cero.length) {
    console.log('\n── CADENAS DEL INVENTARIO QUE LA BIBLIOTECA NO TRAE ──');
    console.log('   Cero NO es «está mal»: la biblioteca es del XIX y el ejemplo puede ser');
    console.log('   ruso de hoy perfectamente correcto. Se imprime para que se vea.');
    for (const z of cero) console.log(`  ${z}`);
  }
  // No tumba nada: es un informe. Decidir aquí sería elegir entre la norma y
  // el corpus sin fuente, que es lo que el §0 prohíbe.
  process.exit(0);
}

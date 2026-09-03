// scripts/lotes/cloze-ro-a1d.ts — EL DECIMOTERCER LOTE RUMANO: la
// ortografía del bloque 1. A1.
//
//   npx tsx scripts/lotes/cloze-ro-a1d.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a1d.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, los tres de clase `ortografico` y los tres con
// la MISMA mecánica: **cloze del GRAFEMA, no de la palabra**. Es lo que
// el propio inventario manda («cloze del grafema», motivo de
// `r1-ortografia-a-i`) y no es un detalle de forma: si el hueco fuera la
// palabra entera, el ítem mediría vocabulario —quien sabe «puerta = ușă»
// la escribe— y no la correspondencia grafía↔sonido, que es el punto.
// El hueco cae DENTRO de la palabra y lo único que se decide es qué
// letra o dígrafo va ahí.
//   · r1-consonantes-ausentes  ș ț j z y los dígrafos ce/ge/che/ghe
//   · r1-ortografia-a-i        â interior / î inicial, final y de raíz
//   · r1-diptongos             ea oa ia ie io iu
//
// LA PISTA NO PUEDE LLEVAR LA LETRA, y aquí el gate base ya lo impone
// solo por una razón bonita: `normalizeAnswer` quita los diacríticos, así
// que una pista que dijera «â interior» se normaliza a «a interior» y el
// gate la caza como deletreo de la respuesta. La pista dice la POSICIÓN
// y el sonido, nunca el grafema.
//
// `r1-diacriticos-coma` se queda FUERA a propósito, y su propio motivo lo
// dice: «se enseña una vez y lo vigila el gate de escritura, NO un lote
// entero». Un punto cuyo contenido es «usa U+0219 y no U+015F» no da
// ocho ítems distintos: daría ocho veces el mismo. Queda declarado para
// que el coordinador decida si baja su piso o si el gate ES su cobertura.
import { verificar as verificarBase, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';
import { PREFIJOS } from '../../lib/lang/ortografia-ro';

const CONS = 'r1-consonantes-ausentes';
const AI = 'r1-ortografia-a-i';
const DIP = 'r1-diptongos';

/** Los grafemas de cada punto. La respuesta tiene que ser UNO de ellos:
 *  si no lo es, el hueco no está examinando este punto sino otra cosa. */
const GRAFEMAS: Record<string, string[]> = {
  [CONS]: ['ș', 'ț', 'j', 'z', 'ce', 'ci', 'ge', 'gi', 'che', 'chi', 'ghe', 'ghi'],
  [AI]: ['â', 'î'],
  [DIP]: ['ea', 'oa', 'ia', 'ie', 'io', 'iu'],
};

export const ITEMS: ClozeRo[] = [
  // ── r1-consonantes-ausentes · 8 · EL ESTÍMULO ES EL SONIDO ────────
  // Reescrito entero: la v0 daba la traducción española y el lingüista
  // midió que así el ítem se contesta desde la memoria visual de la
  // palabra —22 de 24— y mide vocabulario con otro disfraz. Aquí la
  // pista da la PRONUNCIACIÓN reescrita para que un hispanohablante la
  // lea, que es el estímulo que el punto pide sin necesitar audio.
  { p: CONS, r: 'ș', s: 'Am închis u___a de la intrare.', pista: 'suena «úsha» — la puerta; el sonido de «Xochimilco», que el español de España no tiene', ancla: 'de la intrare', transparenteLatin: false },
  { p: CONS, r: 'ț', s: 'Bunicii mei locuiesc la ___ară.', pista: 'suena «tsára» — el campo (no la ciudad); la z del italiano «pizza»', ancla: 'Bunicii mei locuiesc', transparenteLatin: false },
  { p: CONS, r: 'j', s: 'Cartea a căzut ___os, sub masă.', pista: 'suena «yos» con la ll porteña de «lluvia» — abajo; el español estándar no tiene ese sonido', ancla: 'sub masă', transparenteLatin: false },
  { p: CONS, r: 'z', s: 'Afară sunt ___ero grade.', pista: 'suena «séro» con la ese SONORA de «mismo» o «desde» — cero; en rumano es letra propia y distingue palabras (rasă «raza» ≠ rază «rayo»)', ancla: 'Afară sunt', transparenteLatin: true },
  { p: CONS, r: 'ce', s: 'Beau un ___ai cald dimineața.', pista: 'suena «chai» — té; la ch española exacta, escrita a la latina', ancla: 'cald dimineața', transparenteLatin: false },
  { p: CONS, r: 'ge', s: 'Am spart un ___am din bucătărie.', pista: 'suena como la g del italiano «gelato» o la j inglesa de «jeans» — cristal de ventana; lleva una d pegada delante', ancla: 'din bucătărie', transparenteLatin: false },
  { p: CONS, r: 'che', s: 'Nu găsesc ___ia de la casă.', pista: 'suena «kéia» — la llave; la k dura ante e, con una letra de apoyo que hace lo que la u de «que» (ojo: la h rumana sola SÍ suena, como en «hotel»)', ancla: 'de la casă', transparenteLatin: false },
  { p: CONS, r: 'ghe', s: 'Mi-am luat ___te noi de la magazin.', pista: 'suena «guéte» — botas; la g dura ante e, con la misma letra de apoyo que la u de «gue»', ancla: 'de la magazin', transparenteLatin: false },

  // ── r1-ortografia-a-i · 8 · EL ESTÍMULO ES LA PALABRA SIN DIACRÍTICOS ──
  // Aquí el sonido NO decide: `â` e `î` son el MISMO fonema /ɨ/ y lo que
  // separa las dos letras es la POSICIÓN, que es una regla ortográfica
  // pura. Así que el estímulo correcto es la palabra tal como la teclea
  // medio internet rumano, sin diacríticos: el alumno ya tiene la
  // palabra y lo único que decide es dónde manda DOOM3 cada signo.
  { p: AI, r: 'â', s: 'Eu sunt rom___n, dar locuiesc de mult la Madrid.', pista: 'tecleado sin diacríticos: «roman» — la vocal central va en el INTERIOR de la palabra', ancla: 'dar locuiesc', transparenteLatin: false },
  { p: AI, r: 'â', s: 'Ne vedem m___ine la ora nouă.', pista: 'tecleado sin diacríticos: «maine» — vocal central en el interior', ancla: 'la ora nouă', transparenteLatin: false },
  { p: AI, r: 'â', s: 'Nu știu c___nd ajunge trenul.', pista: 'tecleado sin diacríticos: «cand» — vocal central en el interior', ancla: 'ajunge trenul', transparenteLatin: false },
  { p: AI, r: 'â', s: 'Am cumpărat p___ine de la brutărie.', pista: 'tecleado sin diacríticos: «paine» — vocal central en el interior', ancla: 'de la brutărie', transparenteLatin: false },
  { p: AI, r: 'î', s: 'Filmul a ___nceput acum zece minute.', pista: 'tecleado sin diacríticos: «inceput» — vocal central al PRINCIPIO de la palabra', ancla: 'acum zece minute', transparenteLatin: false },
  { p: AI, r: 'î', s: 'Te ___ntreb pentru ultima dată.', pista: 'tecleado sin diacríticos: «intreb» — vocal central al principio de la palabra', ancla: 'pentru ultima dată', transparenteLatin: false },
  // La v0 ponía «Vreau să coborî…», que es AGRAMATICAL: `să` rige
  // conjuntivo y nunca infinitivo (GALR II), y la frase correcta sería
  // «să cobor», sin la `î` que el ítem examina. El ítem enseñaba la
  // construcción errónea y además chocaba con el lote 1, que ya usa
  // `a coborî` con la misma escena. Ahora un infinitivo REAL, tras
  // «pentru a».
  { p: AI, r: 'î', s: 'Apasă butonul pentru a cobor___ aici.', pista: 'tecleado sin diacríticos: «cobori» — vocal central al FINAL de la palabra', ancla: 'pentru a', transparenteLatin: false },
  { p: AI, r: 'î', s: 'A muncit ne___ncetat trei zile.', pista: 'tecleado sin diacríticos: «neincetat» — lleva un PREFIJO delante, y la vocal central abre la RAÍZ aunque no abra la palabra', ancla: 'trei zile', transparenteLatin: false },

  // ── r1-diptongos · 8 ──────────────────────────────────────────────
  // LIMITACIÓN DECLARADA, no tapada: aquí ni el sonido reescrito ni la
  // palabra sin diacríticos sirven de estímulo —`ea` y `oa` no llevan
  // diacrítico, así que la forma sin ellos ES la respuesta—, y la pista
  // tiene que dar la glosa. El lingüista midió que eso deja el ítem a
  // merced de la memoria léxica. Se publica con la descripción fonética
  // CORREGIDA, que era lo peor de la v0: decía «diptongo de a/o abierta»
  // y no hay ninguna vocal abierta — son diptongos ASCENDENTES /e̯a/ y
  // /o̯a/, y la formulación vieja invitaba a pronunciar una vocal larga,
  // que es EXACTAMENTE el error del hispanohablante ante `seara` y
  // `soare`. La pista enseñaba la pronunciación equivocada del rasgo que
  // examina. Queda escrito que este bloque mide menos que los otros dos.
  { p: DIP, r: 'ea', s: 'S___ra citesc o oră în pat.', pista: 'tarde-noche — dos vocales en UNA sola sílaba: una e brevísima que resbala hacia la a; no es una vocal larga', ancla: 'citesc o oră', transparenteLatin: false },
  { p: DIP, r: 'ea', s: 'Casa lor este pe un d___l mic.', pista: 'colina — el mismo diptongo, aquí ante l', ancla: 'Casa lor este pe un', transparenteLatin: false },
  { p: DIP, r: 'oa', s: 'Azi este s___re și cald.', pista: 'sol — dos vocales en una sola sílaba: una o brevísima que resbala hacia la a; nunca «so-re»', ancla: 'și cald', transparenteLatin: false },
  { p: DIP, r: 'oa', s: 'Am deschis p___rta de la grădină.', pista: 'portón — el mismo diptongo que en «sol»', ancla: 'de la grădină', transparenteLatin: false },
  { p: DIP, r: 'ia', s: '___rna este foarte lungă aici.', pista: 'invierno — el diptongo que abre la palabra con «i» semiconsonante', ancla: 'foarte lungă aici', transparenteLatin: false },
  { p: DIP, r: 'ie', s: 'Biletul a fost foarte ___ftin.', pista: 'barato — el diptongo con «i» semiconsonante ante «e»', ancla: 'Biletul a fost', transparenteLatin: false },
  { p: DIP, r: 'iu', s: 'Mama ne ___bește foarte mult.', pista: 'querer, amar — el diptongo con «i» semiconsonante ante «u»', ancla: 'Mama ne', transparenteLatin: false },
  { p: DIP, r: 'io', s: 'Am desenat cu un cre___n roșu.', pista: 'lápiz — el diptongo con «i» semiconsonante ante «o»', ancla: 'roșu', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO8-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = x.r ?? '';

    // 1 · La respuesta tiene que ser un GRAFEMA del punto. Si es una
    // palabra, el ítem mide vocabulario y no la correspondencia
    // grafía↔sonido — que es la trampa entera de este bloque.
    if (!GRAFEMAS[x.p]?.includes(r))
      v.push(`${id}: «${r}» no es un grafema de este punto (${GRAFEMAS[x.p]?.join(', ')}) — con la palabra entera el ítem mediría vocabulario`);

    // 2 · El hueco tiene que ir DENTRO de una palabra: pegado a letra por
    // los dos lados, o por uno si el grafema abre o cierra la palabra.
    const [antes = '', despues = ''] = x.s.split('___');
    const pegadoIzq = /\p{L}$/u.test(antes);
    const pegadoDer = /^\p{L}/u.test(despues);
    if (!pegadoIzq && !pegadoDer)
      v.push(`${id}: el hueco no está dentro de una palabra — este punto examina el grafema, no la palabra`);

    // 3 · Y el grafema NO puede estar ya en la misma palabra: si está, se
    // copia. El gate base sólo mira la palabra suelta, y aquí el hueco
    // vive dentro de una.
    const palabra = (antes.match(/\p{L}*$/u)?.[0] ?? '') + r + (despues.match(/^\p{L}*/u)?.[0] ?? '');
    const resto = palabra.slice(0, (antes.match(/\p{L}*$/u)?.[0] ?? '').length) + palabra.slice((antes.match(/\p{L}*$/u)?.[0] ?? '').length + r.length);
    if (resto.includes(r)) v.push(`${id}: el grafema «${r}» ya aparece en la misma palabra («${palabra}») — se contesta copiando`);

    // 4 · Invariante del punto â/î: la letra la decide la POSICIÓN, así
    // que la posición tiene que ser inequívoca. `â` sólo en interior;
    // `î` sólo al principio, al final, o abriendo raíz tras prefijo.
    if (x.p === AI) {
      const inicial = !pegadoIzq;
      const final = !pegadoDer;
      // La lista de prefijos se IMPORTA de `lib/lang/ortografia-ro.ts`.
      // La v0 la copiaba a mano con cinco entradas —y una de más, «în»,
      // que no es prefijo— contra las 23 de la canónica. Tercera
      // aparición de «una regla copiada se desincroniza» en esta fase.
      const trasPrefijo = new RegExp(`(?:^|[^\\p{L}])(?:${PREFIJOS.join('|')})$`, 'u').test(antes);
      if (r === 'â' && (inicial || final))
        v.push(`${id}: «â» en posición inicial o final — DOOM3 la reserva al interior y el ítem enseñaría lo contrario`);
      if (r === 'î' && !inicial && !final && !trasPrefijo)
        v.push(`${id}: «î» en interior sin prefijo delante — DOOM3 pide «â» ahí`);
    }
  }
  // FUGA CRUZADA: la respuesta de un ítem escrita en la frase de OTRO.
  // Ningún gate por ítem puede verla, y el lote salía «Limpio» con cinco
  // dentro. Acotado a propósito: `ș ț î â ea oa` son los grafemas más
  // frecuentes del rumano y es materialmente imposible escribir 24
  // frases naturales sin ellos — un gate que marcara las ~20 apariciones
  // sería un gate apagado. Sólo cuenta lo que el alumno puede COPIAR:
  //   · el grafema abriendo palabra a menos de tres palabras del hueco, o
  //   · una palabra que comparte raíz con la del hueco.
  for (const [i, x] of items.entries()) {
    const [antes = '', despues = ''] = x.s.split('___');
    const raizHueco = ((antes.match(/\p{L}*$/u)?.[0] ?? '') + (x.r ?? '') + (despues.match(/^\p{L}*/u)?.[0] ?? '')).toLowerCase().slice(0, 4);
    // Los vacíos se filtran ANTES de cortar: «Am zece degete și ___ero»
    // parte en [...,'și',''] y la cadena vacía empujaba «zece» fuera de
    // la ventana de tres, así que el gate no veía la fuga que el
    // lingüista había nombrado. El fallo estaba en el corte, no en la
    // regla.
    const trozos = (t: string) => t.split(/\s+/).filter(Boolean);
    const cerca = [...trozos(antes).slice(-3), ...trozos(despues).slice(0, 3)];
    // Y lo que se cuenta es EL GRAFEMA DE ESTE ÍTEM abriendo otra palabra
    // cerca, no el de cualquiera. La v0 del gate miraba los grafemas
    // AJENOS y marcaba 6 de 24: ver otra «î» en «închis» no te dice si
    // *esta* palabra lleva «ș». Un gate que marca la cuarta parte del
    // lote por ruido es un gate apagado, y el lingüista lo avisó antes
    // de que lo escribiera.
    if (x.r && cerca.some((w) => new RegExp(`^${x.r}`, 'iu').test(w.replace(/[^\p{L}]/gu, ''))))
      v.push(`CLRO8-${String(i + 1).padStart(3, '0')}: «${x.r}» abre una palabra a menos de tres del hueco y es SU PROPIA respuesta — se copia`);
    if (raizHueco.length >= 4) {
      const palabras = x.s.replace('___', '\u0000').split(/[^\p{L}\u0000]+/u).filter((w) => w && !w.includes('\u0000'));
      if (palabras.some((w) => w.toLowerCase().startsWith(raizHueco)))
        v.push(`CLRO8-${String(i + 1).padStart(3, '0')}: la frase repite la raíz «${raizHueco}» del hueco en otra palabra — se copia`);
    }
  }
  // El reparto por grafema DENTRO del punto: con un solo grafema el
  // bloque no enseña un reparto, enseña una constante.
  for (const p of [CONS, AI, DIP]) {
    const xs = items.filter((x) => x.p === p);
    if (!xs.length) continue;
    const distintos = new Set(xs.map((x) => x.r));
    const min = p === AI ? 2 : 4;   // â/î es binario por naturaleza
    if (distintos.size < min) v.push(`${p}: sólo ${distintos.size} grafema(s) distinto(s) en ${xs.length} ítems — el punto pide al menos ${min}`);
  }
  return v;
}

if (new RegExp(`[/\\\\]cloze-ro-a1d\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(x.r ?? '')), hintEs: x.pista, answer: String(x.r ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 13\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO-A1d — ortografía del bloque 1 · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s.replace('___', '[' + x.r + ']')}  → **${x.r}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

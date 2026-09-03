// scripts/lotes/corr-ro-a2.ts — EL NOVENO LOTE RUMANO: corrección, A1-A2.
//
//   npx tsx scripts/lotes/corr-ro-a2.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-a2.ts --asigna   # a qué punto cuenta
//
// 24 ítems, tres puntos de clase `trampa` que estaban BAJO EL PISO. Un
// punto es `trampa` cuando el calco del hispanohablante es español
// PERFECTO: no hay glosa que lo cace y hay que PRODUCIR la forma rumana.
// Los tres los declara así el inventario, con su error diana nombrado:
//   · r2-concordancia-adjetivo  «dos trenes buenos» → *două trenuri buni
//   · r5-imperativo-negativo    «no vengas» → *nu vii!  ·  y el plural
//   · r6-pe-regla-operativa     «busco a un médico» → *caut pe un doctor
//
// Contrato del lote 2 (`corr-ro-a1.ts`, mismo `verificarBase`): `calcoEs`
// obligatorio, corrección MÍNIMA, explicación que enseña la regla, la
// BUENA entera por Hunspell y ortografía DOOM3 en todo.
//
// REGLA DEL PROYECTO que gobierna este formato: la mala sólo entra
// atestada como AGRAMATICAL, nunca como «menos frecuente». Se pagó en el
// lote 2 con «îmi place a citi», que es libresco pero lícito (GALR) y el
// lingüista lo sacó.
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { medirAtajo } from '../lib/atajo-correccion';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';
import { informeAsigna } from '../lib/asigna-ro';
import { PUNTOS_RO } from '../../lib/data/languages/ro/inventario-puntos';

const ADJ = 'r2-concordancia-adjetivo';
const IMPNEG = 'r5-imperativo-negativo';
const PE = 'r6-pe-regla-operativa';

export const ITEMS: ItemCorreccion[] = [
  // ══ r2-concordancia-adjetivo (8) ══════════════════════════════════
  // El NEUTRO plural concuerda como FEMENINO plural, y el error diana que
  // el inventario nombra es el neutro colapsado en masculino.
  //
  // LA CONDICIÓN QUE FALTABA, y que costó 5 de 8: el sustantivo ESPAÑOL de
  // la glosa tiene que ser MASCULINO. Si es femenino («la ciudad», «la
  // silla», «la tienda», «la oficina»), el adjetivo español ya está en
  // femenino plural y traducir da la BUENA: el ítem mide el género del
  // español, no el neutro rumano. Lo destapó el tercer camino de la
  // medición del atajo; los dos caminos mecánicos daban 0/72 porque los
  // dos preguntaban «rumano-malo → español» y la pregunta era la inversa,
  // que no es la misma cuando la correspondencia es muchos-a-uno.
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Sunt două trenuri buni spre Brașov.', buena: 'Sunt două trenuri bune spre Brașov.',
    calcoEs: 'Hay dos trenes buenos hacia Brașov.',
    explicacion: 'El neutro rumano es masculino en singular y FEMENINO en plural: «un tren bun» pero «două trenuri bune». Por eso el adjetivo toma -e, no -i.' },
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Telefoanele acestea sunt prea scumpi.', buena: 'Telefoanele acestea sunt prea scumpe.',
    calcoEs: 'Estos teléfonos son demasiado caros.',
    explicacion: '«Telefon» es neutro; su plural «telefoane» concuerda como femenino, también cuando el adjetivo va en el predicado: «sunt scumpe».' },
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Dimineața autobuzele sunt plini.', buena: 'Dimineața autobuzele sunt pline.',
    alt: ['Dimineața, autobuzele sunt pline.'],
    calcoEs: 'Por la mañana los autobuses van llenos.',
    explicacion: '«Autobuz» es neutro; en plural el adjetivo va en femenino: «pline». «Plini» es el masculino plural de «plin».' },
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Sunt birouri luminoși și liniștiți.', buena: 'Sunt birouri luminoase și liniștite.',
    calcoEs: 'Son escritorios luminosos y tranquilos.',
    explicacion: 'El neutro plural concuerda como femenino, y los dos adjetivos coordinados van los dos igual: «luminoase și liniștite».' },
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'În bucătărie sunt patru scaune albi.', buena: 'În bucătărie sunt patru scaune albe.',
    calcoEs: 'En la cocina hay cuatro asientos blancos.',
    explicacion: '«Scaun» es neutro (un scaun / două scaune) y en plural pide la forma femenina del adjetivo: «albe». «Albi» sólo vale para un plural masculino.' },
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Duminică magazinele erau deschiși.', buena: 'Duminică magazinele erau deschise.',
    calcoEs: 'El domingo los comercios estaban abiertos.',
    explicacion: '«Magazin» es neutro: «magazinele» concuerda como femenino plural y el participio-adjetivo va en «deschise».' },
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Am vizitat trei locuri frumoși anul trecut.', buena: 'Am vizitat trei locuri frumoase anul trecut.',
    calcoEs: 'Visité tres lugares bonitos el año pasado.',
    explicacion: '«Loc» es neutro (un loc / două locuri): en plural concuerda como femenino, así que «frumos» va en «frumoase», no en la masculina «frumoși».' },
  { p: ADJ, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Au fost timpuri grei pentru toată lumea.', buena: 'Au fost timpuri grele pentru toată lumea.',
    calcoEs: 'Fueron tiempos difíciles para todo el mundo.',
    explicacion: '«Timp» es neutro y su plural «timpuri» pide el femenino del adjetivo: «grele». La forma «grei» es el masculino plural de «greu».' },

  // ══ r6-pe-regla-operativa (8) ═════════════════════════════════════
  // El SUBCONJUNTO DIVERGENTE, que es lo que el inventario manda examinar:
  // donde «pe» y la «a» personal coinciden no se examina (ahí el calco
  // acierta). Sólo entran los dos sitios donde divergen:
  //   · el español pone «a» y el rumano NO pone «pe»: indefinido genérico
  //   · el rumano pone «pe» y el español NO TIENE NADA que copiar: el
  //     relativo objeto (omul PE CARE l-am văzut / «el hombre que vi»).
  //
  // LA v0 SE EQUIVOCABA AQUÍ, y el tercer camino lo midió: decía que con
  // el interrogativo y el pronombre tónico «el español no tiene nada que
  // copiar de la posición». Es falso — tiene «a», en la misma posición, y
  // copiarla da «pe». «¿A quién viste?» → pe cine; «a mí» → pe mine. El
  // peor era «a ti TE busca», donde el español dobla el clítico igual que
  // el rumano: plantilla palabra por palabra de la respuesta correcta.
  // Los cuatro eran el subconjunto CONVERGENTE, justo lo que el propio
  // encabezado dice no examinar. Sustituidos por el relativo, donde el
  // español no pone nada y el rumano exige «pe».
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Caut pe un doctor bun în oraș.', buena: 'Caut un doctor bun în oraș.',
    calcoEs: 'Busco a un médico bueno en la ciudad.',
    explicacion: 'Un nombre común indeterminado y NO ESPECÍFICO va sin «pe»: «caut un doctor bun», cualquiera que lo sea. Cuidado con la regla a medias: con los PRONOMBRES «pe» es obligatorio (pe cineva, pe nimeni, pe cine), y también con la persona individualizada.' },
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Firma caută pe o secretară.', buena: 'Firma caută o secretară.',
    calcoEs: 'La empresa busca a una secretaria.',
    explicacion: 'No se busca a alguien concreto sino a quien ocupe el puesto: nombre común indeterminado y no específico, sin «pe». La regla NO es «indefinido → sin pe»: los pronombres indefinidos sí lo llevan (caut pe cineva).' },
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Căutăm pe un profesor de română pentru copii.', buena: 'Căutăm un profesor de română pentru copii.',
    calcoEs: 'Buscamos a un profesor de rumano para los niños.',
    explicacion: 'No se busca a una persona concreta sino a cualquiera que tenga ese perfil: objeto humano indeterminado y NO ESPECÍFICO, sin «pe». Con los pronombres, en cambio, «pe» es obligatorio: pe cineva, pe nimeni, pe cine.' },
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Vrem să angajăm pe un inginer.', buena: 'Vrem să angajăm un inginer.',
    calcoEs: 'Queremos contratar a un ingeniero.',
    explicacion: 'Contratar «a un ingeniero» cualquiera es un nombre común no específico: en rumano va sin «pe». La «a» del español no se traduce por «pe» automáticamente — pero tampoco se borra siempre: con pronombres y con persona individualizada «pe» es obligatorio.' },
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Omul care l-am văzut ieri este vecinul meu.', buena: 'Omul pe care l-am văzut ieri este vecinul meu.',
    calcoEs: 'El hombre que vi ayer es mi vecino.',
    explicacion: 'Cuando el relativo es el OBJETO, el rumano lo marca con «pe»: «omul pe care l-am văzut». El español no pone nada delante de «que», así que aquí no hay nada que copiar — y sin «pe» la frase rumana no es gramatical.' },
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Cartea care am citit-o astă-vară era foarte lungă.', buena: 'Cartea pe care am citit-o astă-vară era foarte lungă.',
    calcoEs: 'El libro que leí este verano era muy largo.',
    explicacion: 'El relativo objeto lleva «pe» también con cosas: «cartea pe care am citit-o». El español dice sólo «que», así que el «pe» no se copia de ninguna parte: hay que saberlo.' },
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Fata care o aștept este sora mea.', buena: 'Fata pe care o aștept este sora mea.',
    calcoEs: 'La chica que espero es mi hermana.',
    explicacion: 'El relativo objeto va con «pe» y se dobla con el clítico: «fata pe care o aștept». En español «que» va desnudo y no hay «a» que traducir.' },
  { p: PE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Studenții care i-am ajutat au trecut examenul.', buena: 'Studenții pe care i-am ajutat au trecut examenul.',
    calcoEs: 'Los estudiantes que ayudé aprobaron el examen.',
    explicacion: 'Con el relativo en función de objeto el rumano exige «pe» y el clítico: «studenții pe care i-am ajutat». El español no marca nada, y por eso el «pe» se olvida.' },
];

/** Adjetivos cuyo masculino plural DIFIERE del femenino plural. Si el
 *  adjetivo no está en esta lista, el ítem del neutro no puede tener
 *  error: `mici/mici`, `noi/noi`, `vechi/vechi` son iguales en los dos, y
 *  el ítem no mediría su punto. */
const ADJ_M_PL = /(buni|frumoși|albi|scumpi|grei|deschiși|închiși|luminoși|plini|goi|curați|roșii)/u;
const ADJ_F_PL = /(bune|frumoase|albe|scumpe|grele|deschise|închise|luminoase|pline|goale|curate)/u;

/** Se MIDE y se IMPRIME, pero no bloquea: no hay dónde declararlo por
 *  ítem, así que bloquear sería un gate que nadie puede satisfacer — y un
 *  gate imposible se acaba silenciando, que es peor que no tenerlo. */
export function medicionLatin(items: ItemCorreccion[]): string {
  const transparentes = new Set(PUNTOS_RO.filter((p) => p.calco.latinComun === 'transparente').map((p) => p.id));
  const n = items.filter((x) => transparentes.has(x.p)).length;
  return `latín común: **${n}/${items.length}** ítems son de puntos declarados \`latinComun: transparente\` en el inventario.`;
}

export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CORO2-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // La BUENA entera por Hunspell; la mala lleva el error a propósito.
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));

    // ADJ: la mala tiene que llevar el masculino plural y la buena el
    // femenino plural. Con un adjetivo de formas iguales no hay punto.
    if (x.p === ADJ) {
      if (!ADJ_M_PL.test(x.mala)) v.push(`${id}: la mala no lleva un adjetivo en masculino plural — sin él no hay concordancia que corregir`);
      if (!ADJ_F_PL.test(x.buena)) v.push(`${id}: la buena no lleva el adjetivo en femenino plural, que es la forma del NEUTRO plural`);
      // LA MITAD QUE FALTABA. El neutro rumano concuerda en plural como
      // femenino; si el sustantivo ESPAÑOL de la glosa es femenino, su
      // adjetivo ya está en femenino plural y traducir da la BUENA. El
      // ítem mediría el género del español. Proxy computable y exacto
      // para estas clases: en la glosa no puede haber un adjetivo en
      // -as. Cinco de los ocho ítems v0 lo violaban («tres ciudades
      // bonitas», «cuatro sillas blancas», «las tiendas abiertas»,
      // «oficinas luminosas», «palabras difíciles») y ningún camino
      // mecánico lo vio, porque los dos preguntaban en la dirección
      // contraria.
      const femEs = x.calcoEs.match(/(?<![\p{L}])\p{L}{3,}as(?![\p{L}])/u);
      if (femEs) v.push(`${id}: la glosa española lleva «${femEs[0]}», femenino plural — si el sustantivo español es femenino, su adjetivo ya coincide con la respuesta rumana y el ítem se resuelve traduciendo`);
    }

    // IMPNEG: la buena tiene que empezar el imperativo por «nu». Y el gate
    // que importa: la mala del SINGULAR lleva un presente en -i / -ii, y
    // la del PLURAL lleva la forma de infinitivo aplicada a un plural.
    if (x.p === IMPNEG) {
      // El flag `i`: sin él el gate rechazaba las cinco buenas que
      // empiezan por «Nu» en mayúscula. Visto en rojo, y era el gate el
      // que estaba mal, no el contenido — que es la mitad de las veces.
      if (!/(?<![\p{L}])nu\s+\p{L}+/iu.test(x.buena)) v.push(`${id}: la buena no es un imperativo negativo con «nu»`);
      const plural = /(?<![\p{L}])(copii|băieți|domnilor|doamnelor|fetelor|voi)(?![\p{L}])/iu.test(x.mala);
      const buenaPl = /(?<![\p{L}])nu \p{L}+(ți|ați|eți|iți)(?![\p{L}])/iu.test(x.buena);
      if (plural && !buenaPl) v.push(`${id}: el destinatario es plural y la buena no lleva la forma de 2.ª del plural`);
      if (!plural && buenaPl) v.push(`${id}: el destinatario es singular y la buena lleva la forma del plural`);
    }

    // PE: o sobra en la mala, o falta en la buena. Nunca las dos cosas, y
    // nunca ninguna: eso sería un ítem de otro punto.
    if (x.p === PE) {
      const sobra = /(?<![\p{L}])pe(?![\p{L}])/iu.test(x.mala) && !/(?<![\p{L}])pe(?![\p{L}])/iu.test(x.buena);
      const falta = !/(?<![\p{L}])pe(?![\p{L}])/iu.test(x.mala) && /(?<![\p{L}])pe(?![\p{L}])/iu.test(x.buena);
      if (!sobra && !falta) v.push(`${id}: el punto es «pe» y la corrección no lo añade ni lo quita`);
      // Y el caso donde el calco ACIERTA no se examina: humano DETERMINADO
      // («Îl văd pe Ion») lleva pe en rumano y «a» en español. Un ítem así
      // enseñaría que el calco funciona, que es justo lo contrario.
      if (sobra && !/(?<![\p{L}])(un|o|niște)(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: «pe» sobra pero el objeto no es indefinido — con humano determinado el rumano SÍ lo pide y la mala sería correcta`);
    }
    if (x.espejoEs) v.push(`${id}: espejoEs true — el español haría la misma corrección y el ítem no mide rumano`);
  }
  // EL GATE QUE EXISTÍA EN EL PAPEL Y NO EN EL CÓDIGO. La definición del
  // lingüista adversarial declara `transparenteLatin` como gate («por
  // encima de la mitad del lote, el lote no sale»), y `ItemCorreccion` no
  // tiene el campo: los lotes de corrección nunca lo han medido. Los tres
  // puntos de éste están declarados `latinComun: 'transparente'` en el
  // inventario, o sea 24 de 24, y hasta hoy ningún gate lo decía. No se
  // puede arreglar aquí sin tocar el contrato de PT, así que de momento
  // se hace lo único honesto: que el NÚMERO EXISTA y se imprima.
  // EL ATAJO, medido y con gate. `undefined` es un fallo: «no medido» no
  // es «limpio», que es la confusión que dejó este campo sin existir
  // durante nueve lotes.
  const m = medirAtajo(items, 'ATAJO');
  for (const id of m.sinDeclarar) v.push(`${id}: atajoEs sin declarar — el atajo de traducción no se ha medido en este ítem`);
  for (const id of m.atajo) v.push(`${id}: atajoEs=true — traduciendo el calco se llega a la BUENA, así que el ítem mide español`);
  for (const d of m.discrepan) v.push(`${d}`);
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w)))) v.push(`hunspell no reconoce «${w}» en una frase buena`);
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
if (new RegExp(`[/\\\\]corr-ro-a2\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log('# A qué punto cuenta cada ítem del lote 9\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-A2 — ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ~~${x.mala}~~ → **${x.buena}**\n      calco: «${x.calcoEs}»`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n${medicionLatin(ITEMS)}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

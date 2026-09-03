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
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';
import { informeAsigna } from '../lib/asigna-ro';
import { PUNTOS_RO } from '../../lib/data/languages/ro/inventario-puntos';

const ADJ = 'r2-concordancia-adjetivo';
const IMPNEG = 'r5-imperativo-negativo';
const PE = 'r6-pe-regla-operativa';

export const ITEMS: ItemCorreccion[] = [
  // ══ r2-concordancia-adjetivo (8) ══════════════════════════════════
  // El NEUTRO plural concuerda como FEMENINO plural. El error diana que
  // el inventario nombra es el neutro colapsado en masculino. Sólo entran
  // adjetivos cuyo masculino plural DIFIERE del femenino plural
  // (bun: buni/bune): con `mic` (mici/mici) o `nou` (noi/noi) no habría
  // nada que corregir y el ítem no mediría su punto.
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'Sunt două trenuri buni spre Brașov.', buena: 'Sunt două trenuri bune spre Brașov.',
    calcoEs: 'Hay dos trenes buenos hacia Brașov.',
    explicacion: 'El neutro rumano es masculino en singular y FEMENINO en plural: «un tren bun» pero «două trenuri bune». Por eso el adjetivo toma -e, no -i.' },
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'Am vizitat trei orașe frumoși anul trecut.', buena: 'Am vizitat trei orașe frumoase anul trecut.',
    calcoEs: 'Visité tres ciudades bonitas el año pasado.',
    explicacion: '«Oraș» es neutro: en plural concuerda como femenino, así que «frumos» va en su forma femenina plural, «frumoase», no en la masculina «frumoși».' },
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'În bucătărie sunt patru scaune albi.', buena: 'În bucătărie sunt patru scaune albe.',
    calcoEs: 'En la cocina hay cuatro sillas blancas.',
    explicacion: '«Scaun» es neutro (un scaun / două scaune) y en plural pide la forma femenina del adjetivo: «albe». «Albi» sólo vale para un plural masculino.' },
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'Telefoanele acestea sunt prea scumpi.', buena: 'Telefoanele acestea sunt prea scumpe.',
    calcoEs: 'Estos teléfonos son demasiado caros.',
    explicacion: '«Telefon» es neutro; su plural «telefoane» concuerda como femenino, también cuando el adjetivo va en el predicado: «sunt scumpe».' },
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'Sunt cuvinte grei în lecția de azi.', buena: 'Sunt cuvinte grele în lecția de azi.',
    calcoEs: 'Hay palabras difíciles en la lección de hoy.',
    explicacion: '«Cuvânt» es neutro y su plural «cuvinte» pide el femenino del adjetivo: «grele». La forma «grei» es el masculino plural de «greu».' },
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'Toate magazinele erau deschiși duminică.', buena: 'Toate magazinele erau deschise duminică.',
    calcoEs: 'Todas las tiendas estaban abiertas el domingo.',
    explicacion: '«Magazin» es neutro: «magazinele» concuerda como femenino plural y el participio-adjetivo va en «deschise».' },
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'Sunt birouri luminoși și liniștiți.', buena: 'Sunt birouri luminoase și liniștite.',
    calcoEs: 'Son oficinas luminosas y tranquilas.',
    explicacion: 'El neutro plural concuerda como femenino, y los dos adjetivos coordinados van los dos igual: «luminoase și liniștite».' },
  { p: ADJ, pasada: 1, espejoEs: false,
    mala: 'Dimineața autobuzele sunt plini.', buena: 'Dimineața autobuzele sunt pline.',
    alt: ['Dimineața, autobuzele sunt pline.'],
    calcoEs: 'Por la mañana los autobuses van llenos.',
    explicacion: '«Autobuz» es neutro; en plural el adjetivo va en femenino: «pline». «Plini» es el masculino plural de «plin».' },

  // ══ r5-imperativo-negativo (8) ════════════════════════════════════
  // DOS errores diana, no uno, y el inventario los nombra los dos:
  //   · 2.ª sg: el imperativo negativo es el INFINITIVO corto, no el
  //     presente. «no vengas» → *nu vii! por nu veni!
  //   · 2.ª pl: es IGUAL que el afirmativo. Un generador con la regla
  //     «negativo = infinitivo» produce *nu veni! para un plural.
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Nu vino mâine la mine!', buena: 'Nu veni mâine la mine!',
    alt: ['Să nu vii mâine la mine!'],
    calcoEs: 'No vengas mañana a mi casa.',
    explicacion: 'El afirmativo de «a veni» es irregular, «vino!», y esa forma NO puede ir con «nu»: el imperativo negativo de tú es el infinitivo sin «a», «nu veni!». La otra salida normativa es el prohibitivo con conjuntivo: «să nu vii!».' },
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Nu zi nimic despre asta!', buena: 'Nu zice nimic despre asta!',
    alt: ['Să nu zici nimic despre asta!'],
    calcoEs: 'No digas nada sobre eso.',
    explicacion: 'Afirmativo «zi!», negativo «nu zice!»: el negativo de tú es el infinitivo corto, y la forma corta «zi» sólo vale para la orden afirmativa. La doble negación con «nimic» es obligatoria en rumano.' },
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Nu fii trist, te rog!', buena: 'Nu fi trist, te rog!',
    alt: ['Să nu fii trist, te rog!'],
    calcoEs: 'No estés triste, por favor.',
    explicacion: 'El afirmativo es «fii!» (fii atent!), pero el negativo va con el infinitivo: «nu fi trist!», con una sola «i». Es el par que DOOM3 registra expresamente para «a fi».' },
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Nu să bei toată apa!', buena: 'Nu bea toată apa!',
    alt: ['Să nu bei toată apa!'],
    calcoEs: 'No te bebas toda el agua.',
    explicacion: 'El español pone la negación delante («no bebas»), pero el rumano la mete DENTRO del conjuntivo: «să nu bei». Y la forma propia del imperativo negativo de tú es el infinitivo: «nu bea!».' },
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Copii, nu veni în bucătărie!', buena: 'Copii, nu veniți în bucătărie!',
    alt: ['Copii, să nu veniți în bucătărie!'],
    calcoEs: 'Niños, no vengáis a la cocina.',
    explicacion: 'En PLURAL el imperativo negativo es idéntico al afirmativo: «nu veniți!». El infinitivo («nu veni!») sólo vale para el singular; usarlo con varios interlocutores es el error del que aplica la regla a medias.' },
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Domnilor, nu face zgomot!', buena: 'Domnilor, nu faceți zgomot!',
    alt: ['Domnilor, să nu faceți zgomot!'],
    calcoEs: 'Señores, no hagan ruido.',
    explicacion: 'Con «dumneavoastră» y con cualquier plural, el negativo repite el afirmativo: «nu faceți!». «Nu face» es el singular.' },
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Băieți, nu pleca încă!', buena: 'Băieți, nu plecați încă!',
    alt: ['Băieți, să nu plecați încă!'],
    calcoEs: 'Chicos, no os vayáis todavía.',
    explicacion: 'El destinatario es plural, así que el negativo coincide con el afirmativo: «nu plecați!». «Nu pleca» es la orden a una sola persona.' },
  { p: IMPNEG, pasada: 1, espejoEs: false,
    mala: 'Nu să scrii pe pereți!', buena: 'Nu scrie pe pereți!',
    alt: ['Să nu scrii pe pereți!'],
    calcoEs: 'No escribas en las paredes.',
    explicacion: 'Con «să» la negación va detrás: «să nu scrii». Y el imperativo negativo propio es el infinitivo corto: «nu scrie!», que aquí coincide en forma con el afirmativo «scrie!».' },

  // ══ r6-pe-regla-operativa (8) ═════════════════════════════════════
  // El SUBCONJUNTO DIVERGENTE, que es lo que el inventario manda examinar:
  // donde «pe» y la «a» personal coinciden no se examina (ahí el calco
  // acierta). Sólo entran los dos sitios donde divergen:
  //   · el español pone «a» y el rumano NO pone «pe»: indefinido genérico
  //   · el rumano pone «pe» y el español no tiene nada que copiar de la
  //     posición: el interrogativo y el pronombre tónico
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Caut pe un doctor bun în oraș.', buena: 'Caut un doctor bun în oraș.',
    calcoEs: 'Busco a un médico bueno en la ciudad.',
    explicacion: 'Un nombre común indeterminado y NO ESPECÍFICO va sin «pe»: «caut un doctor bun», cualquiera que lo sea. Cuidado con la regla a medias: con los PRONOMBRES «pe» es obligatorio (pe cineva, pe nimeni, pe cine), y también con la persona individualizada.' },
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Firma caută pe o secretară.', buena: 'Firma caută o secretară.',
    calcoEs: 'La empresa busca a una secretaria.',
    explicacion: 'No se busca a alguien concreto sino a quien ocupe el puesto: nombre común indeterminado y no específico, sin «pe». La regla NO es «indefinido → sin pe»: los pronombres indefinidos sí lo llevan (caut pe cineva).' },
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Căutăm pe un profesor de română pentru copii.', buena: 'Căutăm un profesor de română pentru copii.',
    calcoEs: 'Buscamos a un profesor de rumano para los niños.',
    explicacion: 'No se busca a una persona concreta sino a cualquiera que tenga ese perfil: objeto humano indeterminado y NO ESPECÍFICO, sin «pe». Con los pronombres, en cambio, «pe» es obligatorio: pe cineva, pe nimeni, pe cine.' },
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Vrem să angajăm pe un inginer.', buena: 'Vrem să angajăm un inginer.',
    calcoEs: 'Queremos contratar a un ingeniero.',
    explicacion: 'Contratar «a un ingeniero» cualquiera es un nombre común no específico: en rumano va sin «pe». La «a» del español no se traduce por «pe» automáticamente — pero tampoco se borra siempre: con pronombres y con persona individualizada «pe» es obligatorio.' },
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Cine ai văzut la gară?', buena: 'Pe cine ai văzut la gară?',
    calcoEs: '¿A quién viste en la estación?',
    explicacion: 'Como OBJETO, «quién» es «pe cine»: el rumano marca siempre el pronombre interrogativo de persona. Sin «pe», «cine» sólo puede ser el SUJETO, y con «ai văzut» (2.ª persona) eso es imposible: la frase no es gramatical.' },
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Cine întrebi când nu știi?', buena: 'Pe cine întrebi când nu știi?',
    calcoEs: '¿A quién preguntas cuando no sabes?',
    explicacion: 'El interrogativo de persona en función de objeto lleva «pe» obligatoriamente: «pe cine întrebi». Sin «pe», «cine» se lee como sujeto.' },
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Mie nu mă întreabă nimeni niciodată.', buena: 'Pe mine nu mă întreabă nimeni niciodată.',
    alt: ['Pe mine nu mă întreabă niciodată nimeni.'],
    calcoEs: 'A mí no me pregunta nadie nunca.',
    explicacion: 'La «a» española tapa la diferencia de caso: «mie» es el tónico de DATIVO y aquí el verbo pide ACUSATIVO, que en forma tónica es «pe mine» y se dobla con el clítico «mă».' },
  { p: PE, pasada: 1, espejoEs: false,
    mala: 'Ție te caută cineva la ușă.', buena: 'Pe tine te caută cineva la ușă.',
    calcoEs: 'A ti te busca alguien en la puerta.',
    explicacion: '«Ție» es dativo; con «te caută» el objeto es acusativo y el tónico acusativo lleva «pe» siempre: «pe tine te caută».' },
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
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w)))) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  return v;
}

if (process.argv[1]?.includes('corr-ro-a2')) {
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

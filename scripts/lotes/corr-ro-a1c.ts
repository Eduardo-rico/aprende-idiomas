// scripts/lotes/corr-ro-a1c.ts — EL DUODÉCIMO LOTE RUMANO: corrección, A1.
//
//   npx tsx scripts/lotes/corr-ro-a1c.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-a1c.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos de clase `trampa` bajo el piso. Uno de ellos ESTRENA:
//   · r3-negacion-antepuesta  «nunca viene» → *Niciodată vine  ← PUNTO NUEVO
//   · r4-gd-lui-formula       «el coche de Ion» → *mașina de Ion
//   · r3-futuro-o-sa          «vamos a ir» → *om să mergem
//
// El punto nuevo lo abrió el lingüista atacando el lote 11: `r3-negacion-nu`
// trataba la doble negación como un regalo que transfiere entero del
// español, y transfiere sólo la MITAD. Con el negativo POSPUESTO coincide
// (nu văd nimic / «no veo nada»); con el ANTEPUESTO diverge duramente,
// porque el rumano conserva «nu» y el español lo PROHÍBE. Es la clase de
// hueco que sólo se ve cuando alguien pregunta por la otra mitad.
//
// Contrato del lote 2, más `intencion` en vocabulario CERRADO (aprobada
// por el coordinador tras la medición del atajo) y `atajoEs` declarado.
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';
import { exenta } from '../lib/exenciones-hunspell-ro';
import { medirAtajo } from '../lib/atajo-correccion';
import { revisarCopula } from '../lib/copula-ro';
import { informeAsigna } from '../lib/asigna-ro';

const ANTE = 'r3-negacion-antepuesta';
const LUI = 'r4-gd-lui-formula';
const OSA = 'r3-futuro-o-sa';

/** Las palabras negativas que, ANTEPUESTAS, siguen exigiendo «nu». */
const NEGATIVAS = ['niciodată', 'nimeni', 'nimic', 'nicăieri', 'niciun', 'nicio', 'nici'];

export const ITEMS: ItemCorreccion[] = [
  // ══ r3-negacion-antepuesta (8) ═══════════════════════════════════
  // El español PROHÍBE el «no» cuando el negativo va delante («nunca
  // viene», jamás «*nunca no viene»); el rumano lo EXIGE. El calco es
  // español perfecto y produce la mala exacta.
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · siempre',
    mala: 'Niciodată vine la timp.', buena: 'Niciodată nu vine la timp.',
    calcoEs: 'Nunca viene a tiempo.',
    explicacion: 'Cuando la palabra negativa va DELANTE del verbo, el rumano mantiene «nu»: «niciodată NU vine». El español hace lo contrario y prohíbe el «no», y de ahí sale el error. La otra salida es posponerla: «nu vine niciodată».' },
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'afirmación · negación',
    mala: 'Nimeni știe ce s-a întâmplat.', buena: 'Nimeni nu știe ce s-a întâmplat.',
    calcoEs: 'Nadie sabe qué ha pasado.',
    explicacion: 'Con «nimeni» delante del verbo el «nu» es obligatorio: «nimeni NU știe». En español «nadie no sabe» es imposible, y por eso el «nu» se olvida.' },
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'afirmación · negación',
    mala: 'Nimic s-a schimbat de anul trecut.', buena: 'Nimic nu s-a schimbat de anul trecut.',
    calcoEs: 'Nada ha cambiado desde el año pasado.',
    explicacion: '«Nimic» antepuesto pide «nu»: «nimic NU s-a schimbat». La negación rumana es doble siempre que hay una palabra negativa, vaya delante o detrás.' },
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'yo · antes',
    mala: 'Nicăieri am găsit cartea aceea.', buena: 'Nicăieri nu am găsit cartea aceea.',
    alt: ['Nicăieri n-am găsit cartea aceea.'],
    calcoEs: 'En ninguna parte encontré ese libro.',
    explicacion: 'También con «nicăieri»: antepuesto, el verbo conserva «nu». Y como el auxiliar empieza por vocal, la contracción «n-am» es la forma corriente.' },
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'ellos · siempre',
    mala: 'Niciun student vine sâmbăta.', buena: 'Niciun student nu vine sâmbăta.',
    calcoEs: 'Ningún estudiante viene los sábados.',
    explicacion: 'El determinante negativo «niciun» tampoco quita el «nu»: «niciun student NU vine». El español dice «ningún estudiante viene», sin «no», y ése es el calco.' },
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'ella · antes',
    mala: 'Nicio scrisoare a ajuns până acum.', buena: 'Nicio scrisoare nu a ajuns până acum.',
    alt: ['Nicio scrisoare n-a ajuns până acum.'],
    calcoEs: 'Ninguna carta ha llegado hasta ahora.',
    explicacion: 'Con «nicio» delante, el verbo lleva «nu»: «nicio scrisoare NU a ajuns». La forma contracta «n-a» es la corriente.' },
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'nosotros · antes',
    mala: 'Niciodată am fost la Iași.', buena: 'Niciodată nu am fost la Iași.',
    alt: ['Niciodată n-am fost la Iași.'],
    calcoEs: 'Nunca hemos estado en Iași.',
    explicacion: 'Con el negativo antepuesto y un pasado compuesto, el «nu» va delante del auxiliar: «niciodată NU am fost». En español el «no» no cabe, y de ahí el olvido.' },
  { p: ANTE, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'afirmación · negación',
    mala: 'Nimeni a spus nimic la ședință.', buena: 'Nimeni nu a spus nimic la ședință.',
    alt: ['Nimeni n-a spus nimic la ședință.'],
    calcoEs: 'Nadie ha dicho nada en la reunión.',
    explicacion: 'Con DOS palabras negativas el verbo sigue exigiendo «nu»: «nimeni NU a spus nimic». El español, que ya tiene «nadie», prohíbe el «no», y de ahí el olvido. (El rumano incluso admite las dos delante — «nimeni nimic nu a spus» —, pero «nu» no desaparece nunca.)' },

  // ══ r4-gd-lui-formula (8) ════════════════════════════════════════
  // «de + nombre» es español perfecto y el rumano usa «lui» invariable
  // ante nombre propio masculino. En A1 se memoriza como fórmula.
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · uno',
    mala: 'Mașina de Ion este în fața casei.', buena: 'Mașina lui Ion este în fața casei.',
    alt: ['Mașina lui Ion e în fața casei.'],
    calcoEs: 'El coche de Ion está delante de la casa.',
    explicacion: 'El rumano no usa «de» para la posesión: ante nombre propio masculino pone «lui» DELANTE del nombre — «mașina lui Ion». «De» ahí significa «hecho de» o «procedente de».' },
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · uno',
    mala: 'Rucsacul de Mihai este pe masă.', buena: 'Rucsacul lui Mihai este pe masă.',
    alt: ['Rucsacul lui Mihai e pe masă.'],
    calcoEs: 'La mochila de Mihai está en la mesa.',
    explicacion: 'Con nombre propio masculino el genitivo es analítico: «lui» + nombre, sin cambiar el nombre. Se elige una mochila y no un libro a propósito: con una obra, «de» sí marca el autor y la frase sería correcta.' },
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · uno',
    mala: 'Casa de tata este la țară.', buena: 'Casa lui tata este la țară.',
    alt: ['Casa lui tata e la țară.'],
    calcoEs: 'La casa de papá está en el pueblo.',
    explicacion: 'Los nombres de parentesco articulados («tata», «mama») se comportan como propios y toman «lui»: «casa lui tata». No es «de».' },
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · varios',
    mala: 'Prietenii de Andrei vin diseară.', buena: 'Prietenii lui Andrei vin diseară.',
    calcoEs: 'Los amigos de Andrei vienen esta noche.',
    explicacion: '«Lui» es invariable: no concuerda con lo poseído ni cambia en plural. «Prietenii lui Andrei», aunque los amigos sean varios.' },
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · uno',
    mala: 'Telefonul de Radu nu funcționează.', buena: 'Telefonul lui Radu nu funcționează.',
    calcoEs: 'El teléfono de Radu no funciona.',
    explicacion: 'Ante nombre propio masculino, la posesión va con «lui» antepuesto al nombre. El «de» del español no se traduce aquí.' },
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · uno',
    mala: 'Am reparat bicicleta de Vlad.', buena: 'Am reparat bicicleta lui Vlad.',
    calcoEs: 'He arreglado la bicicleta de Vlad.',
    explicacion: 'Para la posesión ante nombre propio masculino el rumano pone «lui» delante del nombre: «bicicleta lui Vlad». El «de» del español no vale aquí. (Ojo: con obras SÍ existe «de» para el autor — «o carte de Eminescu» —, pero ése es otro valor.)' },
  // EL ÚNICO ÍTEM DE FRONTERA QUE EL CORPUS TENÍA, y estaba mal etiquetado
  // en los DOS campos. Reetiquetado el 2026-09-03 en la auditoría hacia
  // atrás del valor por omisión `origenError: 'calco'`: su error NO es el
  // calco del español —«la oficina del señor Popescu» traducida palabra por
  // palabra da la BUENA, `Biroul domnului Popescu`, nunca `lui`— sino la
  // SOBREAPLICACIÓN de la regla del `lui` que el propio punto acaba de
  // enseñar. Por eso `atajoEs` es true: traducir SÍ resuelve, y eso es lo
  // que lo hace la frontera. Estaba declarado false.
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: true, origenError: 'sobreaplicacion', intencion: 'él · uno',
    mala: 'Biroul lui domnul Popescu este la etajul doi.', buena: 'Biroul domnului Popescu este la etajul doi.',
    alt: ['Biroul domnului Popescu e la etajul doi.'],
    calcoEs: 'La oficina del señor Popescu está en el segundo piso.',
    explicacion: 'Cuidado con la mitad de la regla: «lui» es para el nombre propio SOLO. Con un común delante («domnul»), el genitivo va en el común: «biroul DOMNULUI Popescu».' },
  { p: LUI, pasada: 1, espejoEs: false, atajoEs: false, intencion: 'él · uno',
    mala: 'Fratele de Ion lucrează la spital.', buena: 'Fratele lui Ion lucrează la spital.',
    calcoEs: 'El hermano de Ion trabaja en el hospital.',
    explicacion: 'La posesión ante nombre propio masculino es «lui» + nombre: «fratele lui Ion». El «de» calca el español y no existe con este valor.' },

  // ══ r3-futuro-o-sa (8) ═══════════════════════════════════════════
  // LA v0 DE ESTE BLOQUE CAYÓ ENTERA, y con la prueba dentro del propio
  // repo. Marcaba como error `om să mergem`, `or să vină`, `oi să plec`,
  // `oți să veniți`, `o merge`, `om merge`: son el **viitor popular**
  // (oi/ăi/o/om/oți/or + infinitivo, y su variante con `să`, donde el
  // auxiliar SÍ se flexiona). Popular y regional, no agramatical — y el
  // inventario de este proyecto lo ENSEÑA en A2:
  //   `r5-futuro-cuatro-registros`, cita del currículo: «los cuatro
  //   registros (voi merge formal/escrito, o să merg coloquial estándar,
  //   am să merg coloquial, **oi merge popular**)»
  // O sea que el lote corregía el cuarto registro que el curso enseña
  // ochenta líneas más abajo. Sexta aparición de «corregir algo que no
  // está mal», y la explicación además enunciaba una regla FALSA («la o
  // no se conjuga NUNCA»), que fabrica un alumno que corrige a un rumano.
  // Y EL GATE ERA CÓMPLICE: exigía que la mala llevara la «o» flexionada,
  // o sea que OBLIGABA a que cada mala fuera un viitor popular. No
  // comprobaba lo único que importaba: que la mala no sea rumano posible.
  //
  // El punto sólo es corregible en 3.ª PERSONA, que es la única donde el
  // conjuntivo diverge del indicativo. `să` selecciona conjuntivo (GALR),
  // así que `*o să merge` es categóricamente mal formado — y es el error
  // real del hispanohablante, porque «va a ir» no lleva subjuntivo en
  // español. En 1.ª y 2.ª las dos formas coinciden y no hay nada que ver.
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'O să merge la doctor săptămâna viitoare.', buena: 'O să meargă la doctor săptămâna viitoare.',
    alt: ['Are să meargă la doctor săptămâna viitoare.'],
    calcoEs: 'Va a ir al médico la semana que viene.',
    explicacion: 'Detrás de «să» el verbo va en CONJUNTIVO, y en 3.ª persona el conjuntivo tiene forma propia: «să meargă», no «merge». El español dice «va a ir» sin subjuntivo, y de ahí sale el error. En 1.ª y 2.ª persona no se nota porque las dos formas coinciden.' },
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Copiii o să sunt acasă la cinci.', buena: 'Copiii o să fie acasă la cinci.',
    alt: ['Copiii au să fie acasă la cinci.'],
    calcoEs: 'Los niños van a estar en casa a las cinco.',
    explicacion: '«A fi» tiene conjuntivo propio en 3.ª: «să fie», nunca «să sunt». El indicativo detrás de «să» es el calco del español, que en «van a estar» no marca subjuntivo.' },
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Vecinii o să au o casă nouă.', buena: 'Vecinii o să aibă o casă nouă.',
    alt: ['Vecinii au să aibă o casă nouă.'],
    calcoEs: 'Los vecinos van a tener una casa nueva.',
    explicacion: '«A avea» hace «să aibă» en 3.ª persona: es una de las formas de conjuntivo que más se aparta del indicativo («au»). Detrás de «să» nunca va el indicativo.' },
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Maria o să face o prăjitură duminică.', buena: 'Maria o să facă o prăjitură duminică.',
    alt: ['Maria are să facă o prăjitură duminică.'],
    calcoEs: 'María va a hacer un pastel el domingo.',
    explicacion: 'El conjuntivo de 3.ª de «a face» es «să facă», con -ă final. La forma «face» es el indicativo y detrás de «să» no cabe.' },
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Profesorul o să spune adevărul.', buena: 'Profesorul o să spună adevărul.',
    alt: ['Profesorul are să spună adevărul.'],
    calcoEs: 'El profesor va a decir la verdad.',
    explicacion: '«A spune» hace «să spună». La diferencia con el indicativo «spune» es sólo la vocal final, y por eso se cuela: el español no tiene ahí ningún subjuntivo que recordar.' },
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'El o să poate veni mâine.', buena: 'El o să poată veni mâine.',
    alt: ['El are să poată veni mâine.'],
    calcoEs: 'Él va a poder venir mañana.',
    explicacion: '«A putea» hace «să poată» en 3.ª. Y ojo: el segundo verbo sí va en infinitivo («poată veni»), porque quien rige es «a putea».' },
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Ea o să dă un telefon diseară.', buena: 'Ea o să dea un telefon diseară.',
    alt: ['Ea are să dea un telefon diseară.'],
    calcoEs: 'Ella va a dar un telefonazo esta noche.',
    explicacion: 'El conjuntivo de «a da» es «să dea», no «să dă». Es de los pocos donde la forma cambia de verdad y se oye la diferencia.' },
  { p: OSA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Vremea o să este frumoasă mâine.', buena: 'Vremea o să fie frumoasă mâine.',
    alt: ['Vremea are să fie frumoasă mâine.'],
    calcoEs: 'El tiempo va a estar bueno mañana.',
    explicacion: 'Con «a fi» el contraste es el más visible: indicativo «este», conjuntivo «să fie». Detrás de «o să» sólo cabe el segundo.' },
];

export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  const etiquetaId = (k: number) => `CORO3-${String(k + 1).padStart(3, '0')}`;
  for (const [i, x] of items.entries()) {
    const id = `${etiquetaId(i)} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));

    // ANTE: la palabra negativa tiene que ir ANTEPUESTA al verbo (si va
    // detrás, el español también pone «no» y el punto no diverge), la
    // mala NO puede llevar «nu» y la buena SÍ.
    if (x.p === ANTE) {
      const neg = NEGATIVAS.find((n) => new RegExp(`^${n}(?![\\p{L}])`, 'iu').test(x.mala.trim()));
      if (!neg) v.push(`${id}: la mala no empieza por una palabra negativa — el punto es el negativo ANTEPUESTO y con él pospuesto el español también pone «no»`);
      if (/(?<![\p{L}])(nu|n-)/iu.test(x.mala)) v.push(`${id}: la mala ya lleva «nu» y el error de este punto es justamente omitirlo`);
      if (!/(?<![\p{L}])(nu|n-)/iu.test(x.buena)) v.push(`${id}: la buena no lleva «nu», que es lo que el punto enseña a conservar`);
      // Y el calco español NO puede llevar «no»: si lo lleva, el español
      // no prohíbe nada y la divergencia que el punto declara no existe.
      if (/(?<![\p{L}])no(?![\p{L}])/iu.test(x.calcoEs)) v.push(`${id}: el calco español lleva «no» — entonces el español no prohíbe la doble negación aquí y este ítem no examina la divergencia`);
    }

    // LUI: la mala usa «de» donde va «lui», y «lui» va DELANTE del propio.
    if (x.p === LUI) {
      // DOS malas legítimas, no una: (a) el calco `de` + propio, y (b) la
      // SOBREAPLICACIÓN `lui` + común articulado, que es la otra mitad de
      // la regla y la que el alumno produce al generalizar «lui».
      const calcoDe = /(?<![\p{L}])de (\p{Lu}|tata|mama)/u.test(x.mala);
      const sobreLui = /(?<![\p{L}])lui (domnul|doamna|domnișoara|\p{L}+ul|\p{L}+a)(?![\p{L}])/u.test(x.mala);
      if (!calcoDe && !sobreLui)
        v.push(`${id}: la mala no lleva ni el «de» posesivo ni la sobreaplicación «lui» + común articulado — el punto no está examinado`);
      if (!/(?<![\p{L}])(lui|\p{L}+ului)(?![\p{L}])/u.test(x.buena))
        v.push(`${id}: la buena no lleva «lui» ni un genitivo sintético — el punto no está examinado`);
    }

    // OSA: la buena lleva «o să» y la mala lleva la «o» FLEXIONADA, que
    // es el error diana; si la mala no flexiona, el ítem examina otra cosa.
    if (x.p === OSA) {
      // El flag `i`: sin él rechazaba las seis buenas que empiezan por
      // «O să» en mayúscula. TERCERA vez esta ola que un gate mío falla
      // por la mayúscula inicial (el imperativo del lote 9, el `nu` de
      // aquí, y esto). Es siempre el mismo descuido y siempre lo paga un
      // ítem correcto: el proxy que dice que NO.
      if (!/(?<![\p{L}])o să(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena no lleva «o să»`);
      // EL GATE INVERTIDO. La v0 exigía la «o» FLEXIONADA en la mala, o
      // sea que obligaba a que cada mala fuera un viitor popular bien
      // formado (oi/om/or + infinitivo o + să), que es rumano de registro
      // popular y que este mismo curso enseña en A2. El gate no
      // comprobaba lo único que importaba —que la mala no sea rumano
      // posible— sino que garantizaba lo contrario. Ahora lo PROHÍBE.
      const VIITOR_POPULAR = /(?<![\p{L}])(oi|ăi|ei|îi|om|oți|eți|or)\s+(să\s+)?\p{L}+(?![\p{L}])/iu;
      if (VIITOR_POPULAR.test(x.mala))
        v.push(`${id}: la mala es un VIITOR POPULAR bien formado (oi/om/or + infinitivo o + să) — es rumano de registro popular, que el propio inventario enseña en r5-futuro-cuatro-registros, y sólo entra lo atestado como AGRAMATICAL`);
      // El error diana real: «o să» seguido de INDICATIVO en 3.ª persona,
      // que es la única casilla donde el conjuntivo diverge.
      if (!/(?<![\p{L}])o să (merge|este|sunt|au|face|spune|poate|dă|vine|are|dau)(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala no lleva «o să» + indicativo de 3.ª — el error diana de este punto no aparece`);
      // Y la política de `alt`, escrita: la serie `am/ai/are/avem/aveți/au
      // să` es registro coloquial estándar (inventario, r5-futuro), así
      // que toda buena de este punto nace con ella. O todas o ninguna: la
      // v0 la declaraba en dos ítems de tres del mismo caso.
      if (!(x.alt ?? []).some((a) => /(?<![\p{L}])(am|ai|are|avem|aveți|au) să(?![\p{L}])/iu.test(a)))
        v.push(`${id}: falta la alternativa con «are/au să», que es registro coloquial estándar y la tarjeta compara exacto`);
    }
  }
  // La cópula `este`/`e`: la invariante vive AQUÍ y no en el comparador,
  // que es ciego a la lengua y aceptaría la conjunción «y» portuguesa
  // como el demostrativo. Allowlist: falla cerrado en todo punto que no
  // declare que la alternancia es libre.
  v.push(...revisarCopula(items.map((x) => ({ p: x.p, buena: x.buena, alt: x.alt })), 'COP'));
  const m = medirAtajo(items, 'ATAJO');
  for (const id of m.sinDeclarar) v.push(`${id}: atajoEs sin declarar`);
  for (const id of m.atajo) v.push(`${id}: atajoEs=true — el ítem mide español`);
  for (const d of m.discrepan) v.push(d);
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w)))) if (!exenta(w)) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  return v;
}

if (new RegExp(`[/\\\\]corr-ro-a1c\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log('# A qué punto cuenta cada ítem del lote 12\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-A1c — ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ~~${x.mala}~~ → **${x.buena}**\n      calco: «${x.calcoEs}» · intención: «${x.intencion}»`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

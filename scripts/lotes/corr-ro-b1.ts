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
import { camposSinDeclarar } from '../lib/gates-por-formato';

const DISP = 'r7-disparadores-sa';
const COMPL = 'r8-completivas-ca-sa';
const PROG = 'r7-anti-progresivo';

/** LOS REGENTES QUE SELECCIONAN `să`, EN ALLOWLIST.
 *
 *  La v0 era `ADMITEN_CA`: una lista de seis lemas que admiten `că`, para
 *  RECHAZAR el ítem. O sea una **denylist disfrazada de allowlist** — todo
 *  lo que no estaba, pasaba. Faltaban `a promite`, `a hotărî`, `a decide`,
 *  `a se aștepta`, `a-și aminti`, `a se bucura`… y con cualquiera de ellos
 *  el ítem entraba con la mala siendo lengua correcta (`Promit că vin` y
 *  `Promit să vin` valen las dos, DEX s.v. *promite*). Contradecía la
 *  doctrina escrita en `copula-ro.ts` —«allowlist, no exenciones»— en el
 *  mismo lote que la cita. Ahora falla cerrado: lo que no se declara, se
 *  suspende. */
const RIGEN_SA = /(?<![\p{L}])(vreau|vrea|vrem|doresc|dorește|dorim|rog|roagă|rugăm|cer|cere|cerem|poruncesc|insist)(?![\p{L}])/iu;
/** Gerundios lexicalizados como ADJETIVO: con ellos «este + -ând» es
 *  rumano correcto y la mala dejaría de serlo (DEX). La v0 tenía seis; el
 *  lingüista añadió `tremurând` y `fumegând`, que también tienen entrada
 *  `adj.` con forma concordada. */
const GERUNZIU_ADJETIVO = /(?<![\p{L}])(suferind|crescând|descrescând|sângerând|strălucind|arzând|tremurând|fumegând)(?![\p{L}])/iu;
/** EL PROGRESIVO CALCADO, en UN SOLO regex y con ADYACENCIA.
 *
 *  La v0 hacía dos pruebas sueltas —«¿hay indicativo de a fi?» y «¿hay un
 *  gerunziu en algún sitio?»— y las leía como «¿hay una perífrasis
 *  progresiva?». No es la misma frase: `E cald, iar copiii vin alergând.`
 *  las pasa las dos y es rumano correcto (predicación depictiva con verbo
 *  de movimiento, la misma clase que `stătea plângând în colț`). El `e` de
 *  una oración y el gerundio de OTRA no forman perífrasis. */
const PROGRESIVO = /(?<![\p{L}-])(sunt|ești|este|e|suntem|sunteți)\s+(?:nu\s+|mai\s+)?\p{L}+(ând|ind)(?![\p{L}])/iu;
/** El campo preverbal del rumano: lo ÚNICO que cabe entre `să` y el verbo
 *  son los clíticos pronominales, `nu` y los semiadverbios `mai/și/tot/
 *  prea/cam` (GALR, *Verbul*). La v0 de esta lista vivía dentro del gate
 *  como `[mtsnvșî]\p{L}{0,3}`, que aceptaba cualquier palabra de hasta
 *  cuatro letras empezada por esas seis: `să mama vină` pasaba limpio. */
const CAMPO_PREVERBAL = /^(nu|mai|și|tot|prea|cam|mă|te|se|ne|vă|îmi|îți|își|îl|o|îi|le|i|l|ți|mi|ni|vi|li)$/iu;

export const ITEMS: ItemCorreccion[] = [
  // ══ r7-disparadores-sa · 5 ════════════════════════════════════════
  // (a) el orden español calcado: să + sujeto + verbo.
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Vreau să el vină mâine la birou.', buena: 'Vreau ca el să vină mâine la birou.',
    alt: ['Vreau să vină el mâine la birou.'],
    calcoEs: 'Quiero que él venga mañana a la oficina.',
    explicacion: 'Entre «să» y el verbo sólo caben los clíticos pronominales, la negación «nu» y los adverbios clíticos «mai, și, tot, prea, cam» (să mai stau, să nu mai vină): nada más se mete ahí. Cuando algo se ADELANTA delante del verbo —aquí el sujeto, pero igual valdría un complemento o un adverbio: «vreau CA MÂINE să vină»— el rumano abre la subordinada con «ca». La otra salida es posponer el sujeto: «vreau să vină el», que va SIN «ca» aunque el sujeto siga expreso.' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Doresc să fiica mea studieze la Cluj.', buena: 'Doresc ca fiica mea să studieze la Cluj.',
    alt: ['Doresc să studieze fiica mea la Cluj.'],
    calcoEs: 'Deseo que mi hija estudie en Cluj.',
    explicacion: 'El grupo «fiica mea» no puede ir entre «să» y el verbo. Lo que pide «ca» no es que el sujeto EXISTA, sino que algo vaya ADELANTADO delante del verbo: «doresc CA fiica mea SĂ studieze». El español pone un solo «que» y de ahí sale el error.' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'E important să copiii doarmă opt ore.', buena: 'E important ca copiii să doarmă opt ore.',
    alt: ['Este important ca copiii să doarmă opt ore.', 'E important să doarmă copiii opt ore.'],
    calcoEs: 'Es importante que los niños duerman ocho horas.',
    explicacion: 'También con los impersonales: «e important CA copiii SĂ doarmă». La partícula «să» va pegada al verbo, así que todo lo que el español mete detrás de «que» o se adelanta —y entonces entra «ca»— o se pospone al verbo, y entonces «ca» no aparece.' },
  // (b) «că» donde el regente pide «să».
  { p: DISP, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Vreau că vii cu mine la gară.', buena: 'Vreau să vii cu mine la gară.',
    calcoEs: 'Quiero que vengas conmigo a la estación.',
    explicacion: 'Los verbos de voluntad no admiten «că»: piden «să» + conjuntivo. El «que» español se traduce por «că» sólo cuando la subordinada afirma un hecho («cred că vine»); con «a vrea» nunca.' },
  { p: DISP, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Te rog că închizi ușa.', buena: 'Te rog să închizi ușa.',
    calcoEs: 'Te pido que cierres la puerta.',
    explicacion: 'Lo mismo con los verbos de petición: «te rog SĂ închizi». Con «că» la frase intentaría afirmar que cierras la puerta, que no es lo que se pide.' },

  // ══ r7-anti-progresivo · 6 ════════════════════════════════════════
  // Una sola cara: indicativo finito de «a fi» + gerunziu eventivo.
  //
  // LA FORMA DEL PRESENTE VA REGALADA EN EL ENUNCIADO, y ésa es la
  // reescritura del 2026-09-03. La v0 pedía al alumno dos cosas a la vez:
  // borrar «sunt» Y producir la forma del presente — `mănânc` (doble
  // alternancia), `citesc` (sufijo -esc), `faci` (palatalización). Eso es
  // `r3-presente-4-conjugaciones` y `r3-sufijo-ez-esc`, o sea A1, y la
  // operación anti-progresiva se aprende en el primer ítem: a partir del
  // segundo, lo que separaba acierto de fallo era la morfología. **El FSRS
  // le cargaba a un punto de B1 un fallo de A1**, y el alumno acababa
  // repasando lo que ya sabe creyendo que fallaba lo otro. Lo cazó el
  // lingüista contando qué hace distintos a los seis ítems entre sí.
  //
  // Ahora cada frase trae el mismo verbo ya conjugado en la persona que
  // toca, en una cláusula contrastiva, así que **lo único en manos del
  // alumno es la operación**. Y hay gate: la corrección sólo puede BORRAR
  // —ninguna palabra de la buena puede faltar en la mala—, que es la forma
  // exacta y computable de decir «la morfología va dada».
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'De obicei mănânc la ora unu, dar azi sunt mâncând mai devreme.', buena: 'De obicei mănânc la ora unu, dar azi mănânc mai devreme.',
    alt: ['De obicei mănânc la ora unu, dar azi stau și mănânc mai devreme.'],
    calcoEs: 'Normalmente como a la una, pero hoy estoy comiendo más temprano.',
    explicacion: 'El rumano no tiene progresivo: el presente hace todo el trabajo, y por eso la segunda mitad de la frase repite la misma forma que la primera. Para marcar que ocurre justo ahora se añade un adverbio («tocmai mănânc») o se coordina («stau și mănânc»), nunca «a fi» + gerundio.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: true,
    mala: 'Faci mereu ordine; acum ce ești făcând?', buena: 'Faci mereu ordine; acum ce faci?',
    calcoEs: 'Siempre ordenas; ¿ahora qué estás haciendo?',
    explicacion: 'La forma «faci» ya está en la primera mitad: lo único que sobra en la segunda es «ești». El presente rumano cubre el progresivo español entero, también en pregunta.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: true,
    mala: 'Ea scrie zilnic, iar acum este scriind o scrisoare lungă.', buena: 'Ea scrie zilnic, iar acum scrie o scrisoare lungă.',
    calcoEs: 'Ella escribe a diario, y ahora está escribiendo una carta larga.',
    explicacion: '«Scrie» sirve para «escribe» y para «está escribiendo»: es la misma forma que ya aparece antes en la frase. Añadir «este» delante del gerundio es calcar una perífrasis que esta lengua no tiene.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Așteptăm mereu în stație, iar azi suntem așteptând de zece minute.', buena: 'Așteptăm mereu în stație, iar azi așteptăm de zece minute.',
    calcoEs: 'Siempre esperamos en la parada, y hoy estamos esperando desde hace diez minutos.',
    explicacion: 'La duración la lleva «de zece minute», no una perífrasis. La forma «așteptăm» ya está escrita en la primera mitad y es la misma que hace falta en la segunda.' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Copiii dorm mult; acum sunt dormind în camera lor.', buena: 'Copiii dorm mult; acum dorm în camera lor.',
    calcoEs: 'Los niños duermen mucho; ahora están durmiendo en su habitación.',
    explicacion: 'En plural pasa lo mismo, y «dorm» ya está en la primera mitad. El gerundio rumano existe, pero es adverbial («dormind, n-a auzit telefonul»), nunca el segundo miembro de una perífrasis con «a fi» EN INDICATIVO. Con «a fi» en prezumtiv sí existe y significa otra cosa: «o fi dormind» es «estará durmiendo».' },
  { p: PROG, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Citesc în fiecare seară, iar acum sunt citind o carte foarte bună.', buena: 'Citesc în fiecare seară, iar acum citesc o carte foarte bună.',
    calcoEs: 'Leo todas las tardes, y ahora estoy leyendo un libro muy bueno.',
    explicacion: '«Citesc» ya significa «leo» y «estoy leyendo»: el rumano no reparte esos dos valores en dos formas, y la forma está delante, en la primera mitad de la frase.' },
];

export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CORO5-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));

    // ── r8-completivas-ca-sa · el SUJETO INTERPUESTO ──────────────────
    // La mala es mala porque hay un SN entre `să` y el verbo. La v0
    // preguntaba «¿hay un să y no hay un ca?» y se leía como «¿hay sujeto
    // interpuesto?»: con eso aceptaba como mala `Vreau să vină el`, que es
    // el `alt` DECLARADO del ítem 1 — el gate daba por mala una frase que
    // el propio lote da por buena. Ahora se comprueba lo único que la hace
    // mala: la palabra que sigue a `să` no es del campo preverbal.
    if (x.p === COMPL) {
      const m = /(?<![\p{L}])să\s+(\p{L}+)/iu.exec(x.mala);
      if (!m) v.push(`${id}: la mala no lleva «să»`);
      else if (CAMPO_PREVERBAL.test(m[1]!))
        v.push(`${id}: tras «să» va «${m[1]}», que es campo preverbal legítimo (clítico, «nu» o semiadverbio mai/și/tot/prea/cam) — no hay sujeto interpuesto y la mala no es mala`);
      // Y LA COMPROBACIÓN EXACTA, que no necesita saber qué es un sujeto:
      // el sintagma que la BUENA coloca entre «ca» y «să» tiene que ser el
      // que en la MALA va justo detrás de «să». Es lo único que convierte
      // la mala en mala, y sin ella el gate aceptaba `Vreau să vină el`
      // —que es el `alt` declarado del propio ítem— como si fuera error.
      const sn = /(?<![\p{L}])ca\s+((?:(?!să)\p{L}+\s+){1,3}?)să(?![\p{L}])/iu.exec(x.buena);
      if (sn && m) {
        const esperado = sn[1]!.trim().split(/\s+/)[0]!;
        if (m[1]!.toLowerCase() !== esperado.toLowerCase())
          v.push(`${id}: la buena mete «${sn[1]!.trim()}» entre «ca» y «să», pero en la mala detrás de «să» va «${m[1]}» — si el sujeto no está interpuesto, la frase no es agramatical (Vreau să vină el es correcto)`);
      }
      // Y la buena tiene que llevar el molde con un SN ENTRE «ca» y «să»:
      // sin esa condición, `Am venit ca ei să nu fie singuri` —que es la
      // FINAL, contenido de r8-circunstanciales— pasaba con nota máxima.
      if (!/(?<![\p{L}])ca\s+(?!să)\p{L}[^]{0,40}?\s+să(?![\p{L}])/iu.test(x.buena))
        v.push(`${id}: la buena no lleva «ca» + sintagma nominal + «să» — sin el sujeto entre medias eso sería la final «ca să», que es r8-circunstanciales`);
      if (/(?<![\p{L}])(pentru ca|ca să)(?![\p{L}])/iu.test(x.buena))
        v.push(`${id}: la buena es una final («pentru ca», «ca să»), no una completiva con sujeto expreso`);
      // EL GATE ANTI-ANGLÓFONO, que en la v0 NO DISPARABA NUNCA. Llevaba
      // un `!saAdyacente` que se satisface con cualquier «să» + verbo, o
      // sea con todas las malas: la condición era inalcanzable. Es el gate
      // que el inventario declara como la lección de `a asista la`, y era
      // decorativo. Lo cazó el lingüista corriéndolo contra el ítem sonda.
      if (/(?<![\p{L}])(?:el|ea|ei|ele)\s+să(?![\p{L}])/iu.test(x.mala)
          && !/(?<![\p{L}])ca\s+(?:el|ea|ei|ele)\s+să(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala borra el complementante («vreau el să vină») — eso es error de ANGLÓFONO (I want him to come), no de hispanohablante: el español no licencia «*Quiero él venga»`);
    }

    // ── r7-disparadores-sa · la SELECCIÓN del complementante ──────────
    if (x.p === DISP) {
      if (!/(?<![\p{L}])că(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala no lleva «că» — lo que este punto examina es qué complementante RIGE el verbo`);
      if (!/(?<![\p{L}])să(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena no lleva «să»`);
      if (!RIGEN_SA.test(x.mala))
        v.push(`${id}: el regente no está en la allowlist de los que seleccionan «să» — falla cerrado, porque con a promite, a hotărî, a se aștepta y muchos otros las DOS rigen y la mala sería lengua correcta`);
    }

    if (x.p === PROG) {
      if (!PROGRESIVO.test(x.mala)) v.push(`${id}: la mala no lleva el indicativo de «a fi» PEGADO al gerunziu — lo agramatical es la perífrasis, no que las dos formas aparezcan en la frase`);
      if (GERUNZIU_ADJETIVO.test(x.mala)) v.push(`${id}: el gerundio de la mala está lexicalizado como ADJETIVO (DEX) — ahí «este + -ând» es rumano correcto y la mala no es mala`);
      if (/(?<![\p{L}])(stau|stai|stă|stăm|stați)\s+\p{L}+(ând|ind)(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala usa «a sta» + gerunziu, que es predicación depictiva lícita (stătea plângând în colț)`);
      if (/(?<![\p{L}])(eram|erai|era|erați|erau)\s+\p{L}+(ând|ind)(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala está en imperfecto — «eram mâncând» es ARCAICO, no agramatical, y ese hecho vive en r5-perifrasis-pasado`);
      if (/(?<![\p{L}])\p{L}+(ând|ind)(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena conserva el gerunziu`);
      // LA MORFOLOGÍA VA DADA, y esto es la forma computable de decirlo: la
      // corrección sólo puede BORRAR. Si la buena introduce una palabra que
      // no está en la mala, el alumno tiene que PRODUCIRLA, y entonces el
      // ítem mide también r3-presente-4-conjugaciones o r3-sufijo-ez-esc —
      // A1— mientras el fallo se le carga a este punto, que es B1.
      const enMala = new Set(x.mala.toLowerCase().replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean));
      const nuevas = x.buena.toLowerCase().replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean).filter((w) => !enMala.has(w));
      if (nuevas.length) v.push(`${id}: la buena introduce ${nuevas.map((w) => `«${w}»`).join(', ')}, que no está en la mala — el alumno tendría que PRODUCIR la forma del presente, y eso es r3 (A1); aquí sólo se examina borrar la perífrasis`);
    }
  }
  // Y el invariante del formato: lo que la definición declara como gate
  // tiene que estar DECLARADO en cada ítem. «No medido» no es «limpio».
  for (const [i, x] of items.entries())
    for (const c of camposSinDeclarar('correccion', x as unknown as Record<string, unknown>))
      v.push(`CORO5-${String(i + 1).padStart(3, '0')} (${x.p}): no declara «${c}», que la definición del formato declara gate`);
  v.push(...revisarCopula(items.map((x) => ({ p: x.p, buena: x.buena, alt: x.alt })), 'COP'));
  const m = medirAtajo(items, 'ATAJO');
  for (const id of m.sinDeclarar) v.push(`${id}: atajoEs sin declarar`);
  for (const id of m.atajo) v.push(`${id}: atajoEs=true — el ítem mide español`);
  for (const d of m.discrepan) v.push(d);
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else {
    // LA v0 FILTRABA POR MAYÚSCULA INICIAL, o sea que dejaba fuera la
    // PRIMERA PALABRA de las quince frases buenas — y ahí va el verbo
    // conjugado en cinco de los once ítems (Mănânc, Așteptăm, Citesc,
    // Doresc, Vreau). El segundo camino tenía un agujero de una palabra
    // por frase. Ahora se baja a minúscula y los nombres propios se
    // exentan por lista, que es lo que la mayúscula intentaba aproximar.
    const PROPIOS = new Set(['cluj', 'ion', 'maria', 'brașov', 'bucurești', 'andrei']);
    const revisables = palabras.map((w) => w.toLowerCase()).filter((w) => w && !PROPIOS.has(w));
    for (const w of desconocidas(revisables)) if (!exenta(w)) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  }
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

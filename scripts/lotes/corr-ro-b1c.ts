// scripts/lotes/corr-ro-b1c.ts — LOTE 19: los cinco que le faltan a
// `r8-completivas-ca-sa` y los OCHO de `r8-relativas-pe-care` reescritos.
//
//   npx tsx scripts/lotes/corr-ro-b1c.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-b1c.ts --asigna   # a qué punto cuenta
//
// ── LA PRECONDICIÓN DEL BLOQUE 8, Y LO QUE DEVOLVIÓ ──────────────────
// El lote 19 estaba planeado como «bloque 8, corrección pura», y el
// bloque tenía TRES errores diana SIN VERIFICAR. Se le pasaron al
// lingüista adversarial ANTES de escribir un solo ítem, y **los tres
// fallaron**:
//
//   · `*deși să plouă` (r8-circunstanciales) — DISCUTIBLE: **cero
//     atestaciones** de `deși să`, pero tampoco cita normativa que lo
//     proscriba. Bajo la regla del §0 eso no basta para escribir. Y
//     encima compite con `deși plouă`, que es CORRECTO (con el
//     significado factual): el error real del hispanohablante ahí no es
//     de modo sino de CONECTOR (`deși` factual por `chiar dacă`
//     hipotético), y eso pide contexto que un par mínimo no da.
//   · `*dacă să am bani` (r8-circunstanciales / r11-periodo-condicional)
//     — INVÁLIDA por partida doble. (i) `dacă să` EXISTE en la lengua:
//     interrogativa indirecta con conjuntivo deliberativo, `nu știu dacă
//     să plec` (dexonline s.v. `dacă`, ocho valores). Marcarlo malo en
//     abstracto es falso; lo imposible es sólo en la PRÓTASIS, y por una
//     razón estructural — `să` es él mismo conector condicional (`Să ai
//     bani, ai putea cumpăra orice`) y está en distribución
//     complementaria con `dacă`. (ii) **no lo produce un
//     hispanohablante**: el español PROHÍBE el presente de subjuntivo
//     tras «si» (*«si tenga dinero»), así que la prótasis irreal
//     española lleva imperfecto de subjuntivo y llegar a un conjuntivo
//     PRESENTE rumano no es un calco, es un salto. Los dos sistemas son
//     casi isomorfos (`dacă aș avea bani, aș pleca`).
//   · `*omul care văd` (r8-relativas-pe-care) — VÁLIDA, pero **los
//     cuatro ítems publicados que la instanciaban NO**. Ver abajo.
//
// Se escribe, pues, contra los dos puntos que sí tienen mala verificada:
// `r8-completivas-ca-sa`, cuya mala se dictaminó en el lote 18
// (`*Vreau să el vină`), y `r8-relativas-pe-care` reinstanciado.
//
// LA MALA, con su fuente: entre `să` y el verbo el rumano sólo intercala
// los clíticos pronominales, la negación `nu` y los semiadverbios
// `mai/și/tot/prea/cam` (GALR, *Verbul*). Un sujeto ahí es agramatical, y
// con sujeto expreso antepuesto la subordinada se abre con `ca`.
//
// Y LA MALA QUE **NO** SE USA, que es la mitad del valor de este fichero:
// `*Vreau el să vină` es agramatical de verdad y **no la produce un
// hispanohablante** — para escribirla hay que BORRAR el complementante, y
// el español no lo licencia nunca («*Quiero él venga»). Quien la produce
// es el anglófono (*I want him to come*). El gate anti-anglófono de
// `corr-ro-b1.ts` la prohíbe, y este lote lo hereda entero en vez de
// copiarlo: una regla copiada se desincroniza.
//
// ── EL GATE NUEVO DE ESTE LOTE, Y POR QUÉ NO ES UNA NORMA ────────────
// El sujeto pospuesto (`Vreau să vină fratele meu`) es rumano CORRECTO y
// es la otra salida de cada uno de estos ítems. La comparación de la
// tarjeta es exacta: **lo que no se declara en `alt`, se suspende**. O
// sea que un ítem sin esa alternativa declarada le pone «mal» a un
// alumno que ha escrito rumano bueno, y ningún gate del formato lo ve
// —`verificar` sólo mira que las alternativas declaradas no sobren, no
// que falte la que hace falta—.
//
// Se podría escribir como convención en un comentario. No se escribe:
// una norma se hereda mal y un invariante se ejecuta. El invariante es
// COMPUTABLE desde la propia buena — si la buena tiene la forma `X ca SN
// să V …`, entonces `X să V SN …` es lengua correcta y tiene que estar
// declarada —, así que el gate la CONSTRUYE y comprueba que está.
import { verificar as verificarB1 } from './corr-ro-b1';
import { preflight, type ItemCorreccion } from '../lib/correccion';
import { answersMatchCard } from '../../lib/exercises/normalize';
import { informeAsigna } from '../lib/asigna-ro';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente, perfectCompus } from '../lib/paradigma-ro';

/** El ítem de relativa declara SU LEMA, y no por comodidad: sin él el
 *  gate del paradigma no puede preguntar cuál sería la 3.ª persona, y
 *  tendría que juzgar la concordancia a ojo. */
type ItemRo = ItemCorreccion & { inf?: string };

const COMPL = 'r8-completivas-ca-sa';
const REL = 'r8-relativas-pe-care';

export const ITEMS: ItemRo[] = [
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Aștept să prietenii mei sosească la timp.', buena: 'Aștept ca prietenii mei să sosească la timp.',
    alt: ['Aștept să sosească prietenii mei la timp.'],
    calcoEs: 'Aguardo a que mis amigos lleguen a tiempo.',
    explicacion: 'El grupo «prietenii mei» no cabe entre «să» y el verbo: ahí sólo entran los clíticos, «nu» y los adverbios «mai, și, tot, prea, cam». Lo que hace aparecer «ca» es que algo vaya ADELANTADO delante del verbo, sea el sujeto o no; la otra salida es posponerlo, y entonces «ca» no hace falta.' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'E necesar să studenții vină mai devreme.', buena: 'E necesar ca studenții să vină mai devreme.',
    alt: ['E necesar să vină studenții mai devreme.', 'Este necesar ca studenții să vină mai devreme.', 'Este necesar să vină studenții mai devreme.'],
    calcoEs: 'Es necesario que los estudiantes vengan más temprano.',
    explicacion: 'También con los impersonales. El español encadena «que» + sujeto + verbo y el rumano no puede: «să» va pegado al verbo, así que lo adelantado sale fuera y aparece «ca» delante. Con el sujeto pospuesto —«e necesar să vină studenții»— no hay nada adelantado y «ca» no entra.' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Profesorul cere să elevii citească textul acasă.', buena: 'Profesorul cere ca elevii să citească textul acasă.',
    alt: ['Profesorul cere să citească elevii textul acasă.'],
    calcoEs: 'El profesor pide que los alumnos lean el texto en casa.',
    explicacion: 'Con los verbos de petición pasa lo mismo que con los de voluntad: «cere CA elevii SĂ citească». Lo que decide no es el verbo principal ni que haya sujeto: es si algo va ADELANTADO delante del verbo subordinado, porque entre «să» y el verbo no cabe.' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Vreau să vecinii noștri închidă poarta.', buena: 'Vreau ca vecinii noștri să închidă poarta.',
    alt: ['Vreau să închidă vecinii noștri poarta.'],
    calcoEs: 'Quiero que nuestros vecinos cierren la puerta.',
    explicacion: 'El grupo «vecinii noștri» no puede quedarse entre la partícula y el verbo. Adelantado, pide «ca» delante, y así el orden del español se conserva entero; pospuesto («vreau să închidă vecinii noștri poarta») no pide nada.' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'E bine să părinții vorbească cu profesorii.', buena: 'E bine ca părinții să vorbească cu profesorii.',
    alt: ['E bine să vorbească părinții cu profesorii.', 'Este bine ca părinții să vorbească cu profesorii.', 'Este bine să vorbească părinții cu profesorii.'],
    calcoEs: 'Es bueno que los padres hablen con los profesores.',
    explicacion: 'La partícula «să» y el verbo forman una unidad que nada rompe. Cuando el español mete algo detrás de «que», el rumano o lo adelanta y abre con «ca», o lo pospone al verbo y entonces «ca» no aparece.' },

// ══ r8-relativas-pe-care · 8 ══════════════════════════════════════════
//
// ── LO QUE EL LINGÜISTA TUMBÓ, Y ES EL HALLAZGO CARO DE ESTE LOTE ────
// Los cuatro ítems publicados de este molde (que vivían declarados en
// `r6-pe-regla-operativa` y que el coordinador iba a REASIGNAR aquí)
// ponían como mala `Omul care L-am văzut`, `Cartea care am citit-O`,
// `Fata care O aștept`, `Studenții care I-am ajutat`: **sin `pe` pero
// CON el clítico**. Eso no es el calco del español: es la RELATIVA
// RESUMPTIVA del rumano coloquial y dialectal, con `care` degradado a
// mero conector y un pronombre reasuntivo haciendo el papel sintáctico
// (Blanca Croitor, «Dublarea sintactică în limba română», *Limba
// Română* 1/2016, Inst. de Lingvistică al Academiei, p. 7, con ejemplos
// de corpus: «am pierdu suvelniţa CARE ţeseam CU EA»; el mismo patrón
// existe en italiano septentrional y en alemán de Suiza). Y hay
// ejemplos vivos de prensa y TV: «Ce piesă aţi avea CARE SĂ O ŞTIM şi
// noi?» (*Limba Română* Chișinău, nr. 1441).
//
// O sea que los cuatro **corregían habla rumana real**. Y fallaban
// además el filtro que ningún gate ve: **el `l-` no sale del español**.
// El español no tiene doblado clítico con relativo (*«el hombre que lo
// vi ayer») ni conserva la «a» personal en la relativa (*«el hombre a
// que vi»): el calco literal de «el hombre que vi ayer» es `omul care
// am văzut ieri`, **sin `pe` Y SIN clítico**. Los cuatro están
// retirados con ese motivo escrito.
//
// ── LA MALA QUE SÍ VALE, y por qué es agramatical de otra manera ─────
// Sin clítico, `care` sólo puede leerse como SUJETO, y entonces el
// verbo no concuerda con el antecedente: `*Omul care am văzut ieri` no
// es sub-estándar, **no tiene análisis posible**. La norma:
// «în poziţia de complement direct, pronumele *care* apare obligatoriu
// însoţit de prepoziţia-morfem *pe* şi dublat de un clitic»
// (*Limba Română* Chișinău nr. 1441; GALR II: 401-403).
//
// ── LO QUE ESO OBLIGA A CAMBIAR EN EL PUNTO ─────────────────────────
// **No existe ningún contexto en que falte SÓLO `pe`**: si el clítico
// está, la frase es habla real e inutilizable como mala; si falta, hay
// que arreglar dos piezas. Así que el objeto de enseñanza no es la
// preposición sino la construcción entera `pe care` + reluare clitică,
// y el ítem pide las dos a la vez. El inventario se ha reescrito.
//
// ── Y LOS DOS GATES QUE SALEN DE AHÍ ────────────────────────────────
// (1) `desnudar(buena) === mala`: la corrección consiste EXACTAMENTE en
//     insertar `pe` y el clítico, nada más. Es el invariante estructural
//     que implica la intención («la mala es el calco y sólo el calco»),
//     computable y no cumplible a medias — y de regalo prohíbe la mala
//     resumptiva, porque una mala CON clítico nunca puede ser el
//     desnudo de su buena.
// (2) el PARADIGMA, preguntado y no supuesto: si la forma verbal que
//     sigue a `care` es la 3.ª persona que concuerda con el antecedente,
//     `care` se lee como sujeto y **la mala es rumano correcto**. Es la
//     trampa que ya cazó `r4-dativo-oi` (el sincretismo 1.ª sg / 3.ª pl:
//     `Colegii care cunosc` es «los colegas que conocen»). No se juzga a
//     ojo: se le pide la forma a `paradigma-ro.ts`.

  // ── LOS OCHO, TODOS EN PRESENTE, y ésa es la reescritura ──────────
  // La v0 los repartía entre perfect compus y presente, y el lingüista
  // midió lo que eso costaba: la varianza del lote entera vivía en el
  // CLÍTICO, sobre siete realizaciones (`l-`, `-o`, `o`, `i-`, `le-`,
  // `îl`, `le`, `îi`) y TRES subdestrezas —concordancia, elisión ante
  // auxiliar, enclisis de `o` al participio—, dos de las cuales son de
  // otro punto (`r6-cliticos-acusativo`, cubierto con 8 ítems) y una no
  // está en el inventario en ninguna parte. Insertar `pe` es INVARIANTE
  // en los ocho: se aprende en el primero y ya no discrimina a nadie.
  // O sea que todo lo que separaba acierto de fallo era el clítico, y el
  // fallo se le cargaba a este punto. Es el mismo defecto que se
  // reescribió en `r7-anti-progresivo`.
  //
  // En PRESENTE sólo quedan las formas plenas `îl / o / îi / le`: se va
  // la elisión ante auxiliar, se va la enclisis del participio, y lo que
  // queda es la concordancia — que la explicación da hecha, y que además
  // es la mitad del punto renombrado.
  { p: REL, inf: 'a aștepta', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Omul care aștept este vecinul meu.', buena: 'Omul pe care îl aștept este vecinul meu.',
    alt: ['Omul pe care-l aștept este vecinul meu.', 'Omul pe care îl aștept e vecinul meu.', 'Omul pe care-l aștept e vecinul meu.'],
    calcoEs: 'El hombre que espero es mi vecino.',
    explicacion: 'Cuando el relativo es el OBJETO, el rumano pide DOS piezas que van juntas y no se separan: la marca «pe» delante de «care» y el clítico que lo repite junto al verbo. Con antecedente masculino singular el clítico es «îl». El español no pone nada delante de «que» ni repite nada, así que aquí no hay de dónde copiar.' },
  { p: REL, inf: 'a vedea', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Filmul care vedem acum este nou.', buena: 'Filmul pe care îl vedem acum este nou.',
    alt: ['Filmul pe care-l vedem acum este nou.', 'Filmul pe care îl vedem acum e nou.', 'Filmul pe care-l vedem acum e nou.'],
    calcoEs: 'La película que vemos ahora es nueva.',
    explicacion: 'Los neutros se comportan como masculinos en singular, así que el clítico vuelve a ser «îl». Y «pe» hace falta igual aunque el antecedente sea una cosa: ahí el rumano va más lejos que la «a» española, que sólo marca personas.' },
  { p: REL, inf: 'a aștepta', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Fata care aștept este sora mea.', buena: 'Fata pe care o aștept este sora mea.',
    alt: ['Fata pe care o aștept e sora mea.'],
    calcoEs: 'La chica que espero es mi hermana.',
    explicacion: 'Misma frase y mismo verbo que con «omul», y cambia sólo el clítico: femenino singular «o». La marca «pe» no cambia nunca; lo que hay que elegir es a quién repite el clítico.' },
  { p: REL, inf: 'a citi', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Cartea care citim acum este foarte lungă.', buena: 'Cartea pe care o citim acum este foarte lungă.',
    alt: ['Cartea pe care o citim acum e foarte lungă.'],
    calcoEs: 'El libro que leemos ahora es muy largo.',
    explicacion: '«Cartea» es femenino singular, así que el clítico es «o» aunque no sea una persona. Y conviene mirar la persona del verbo: «citim» es «leemos», o sea que el sujeto somos nosotros y «cartea» sólo puede ser el objeto.' },
  { p: REL, inf: 'a aștepta', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Colegii care așteptăm vin cu trenul.', buena: 'Colegii pe care îi așteptăm vin cu trenul.',
    alt: ['Colegii pe care-i așteptăm vin cu trenul.'],
    calcoEs: 'Los compañeros que esperamos vienen en tren.',
    explicacion: 'Masculino plural: el clítico es «îi». «Așteptăm» es «esperamos», así que el sujeto somos nosotros y «colegii» es el objeto — por eso hay que marcarlo con «pe» y repetirlo.' },
  { p: REL, inf: 'a vizita', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Prietenii care vizităm sunt din Cluj.', buena: 'Prietenii pe care îi vizităm sunt din Cluj.',
    alt: ['Prietenii pe care-i vizităm sunt din Cluj.'],
    calcoEs: 'Los amigos que visitamos son de Cluj.',
    explicacion: 'Otra vez masculino plural, «îi», con otro verbo. Las dos piezas van siempre juntas: sin el clítico la frase no se sostiene, y sin «pe» tampoco.' },
  { p: REL, inf: 'a învăța', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Lecțiile care învăț sunt grele.', buena: 'Lecțiile pe care le învăț sunt grele.',
    calcoEs: 'Las lecciones que estudio son difíciles.',
    explicacion: 'Femenino plural: el clítico es «le». La frase sin «pe» y sin clítico obligaría a leer «care» como sujeto, y entonces el verbo tendría que ser «învață», no «învăț».' },
  { p: REL, inf: 'a cumpăra', pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false,
    mala: 'Florile care cumpăr sunt pentru mama.', buena: 'Florile pe care le cumpăr sunt pentru mama.',
    alt: ['Florile pe care le cumpăr sunt pentru mama mea.'],
    calcoEs: 'Las flores que compro son para mi madre.',
    explicacion: 'Plural otra vez, con «le». Y ojo a la persona: «cumpăr» es «compro», de manera que «florile» no puede ser quien compra — es lo comprado, y va marcado con «pe» y repetido por el clítico.' },
];


/** LOS CLÍTICOS DE ACUSATIVO que pueden repetir al relativo, en clase
 *  CERRADA y en un solo sitio. Proclíticos sueltos, proclíticos con
 *  guion (ante auxiliar) y el enclítico `-o` del participio. */
const CLITICO_SUELTO = /^(îl|o|îi|le)$/iu;
const CLITICO_GUION = /^(l|i|le|o)-$/iu;


/** LAS FORMAS QUE PRUEBAN QUE UNA CLÁUSULA ES DE 1.ª O 2.ª PERSONA.
 *
 *  Por qué hace falta: la ÚNICA lectura en que `care` sería sujeto con un
 *  verbo de 1.ª persona es la APOSITIVA a un pronombre de 1.ª — «noi,
 *  colegii, care așteptăm, suntem obosiți» es rumano correcto—, y en
 *  estos ítems lo que la bloquea es que el verbo de la PRINCIPAL vaya en
 *  3.ª. Eso es una condición del molde que nadie recordaría dentro de dos
 *  meses: escrita como norma en un comentario se erosiona, y el día que
 *  alguien ponga la principal en 1.ª plural la mala se vuelve gramatical
 *  y el ítem muere en silencio. Aquí se ejecuta.
 *
 *  Y se construye FALLANDO ABIERTO donde no puede probar nada: una forma
 *  que además es 3.ª persona (`sunt`, `vin`, `văd`, `citesc` — el
 *  sincretismo 1.ª sg / 3.ª pl) NO demuestra que la cláusula sea de
 *  primera, así que se excluye. Si se incluyera, el gate marcaría la
 *  mitad del lote por ruido y nadie lo leería. */
const FORMAS_12 = (() => {
  const s = new Set<string>();
  for (const v of VERBOS_A1) {
    const terceras = new Set([presente(v, 'el'), presente(v, 'ei')].filter(Boolean) as string[]);
    for (const p of ['eu', 'tu', 'noi', 'voi'] as const) {
      const f = presente(v, p);
      if (f && !terceras.has(f)) s.add(f.toLowerCase());
    }
  }
  return s;
})();
/** Los pronombres que licencian la aposición, y los auxiliares de 1.ª/2.ª
 *  del perfect compus, que no salen de `presente()`. */
const PRONOMBRE_12 = /^(eu|noi|tu|voi)$/iu;
const AUXILIAR_12 = /^(am|ai|ați)$/iu;

/** Las palabras de la frase que NO son ni «care» ni el verbo de la
 *  relativa: o sea el antecedente y la principal. En este molde el verbo
 *  de la relativa es UNA sola palabra —los ocho ítems van en presente—,
 *  así que es el primer token tras `care`. */
export function fueraDeLaRelativa(mala: string): string[] {
  const i = mala.search(/(?<![\p{L}])care(?![\p{L}])/iu);
  if (i < 0) return mala.split(/\s+/);
  const antes = mala.slice(0, i);
  const despues = mala.slice(i).replace(/^care\s*/iu, '');
  const resto = despues.split(/\s+/).slice(1).join(' ');
  return `${antes} ${resto}`.replace(/[^\p{L}\s-]/gu, ' ').split(/\s+/).filter(Boolean);
}

/** ¿La relativa de esta frase lleva un clítico que repita al relativo?
 *
 *  Pregunta UNA cosa y hay que decirlo, porque la v0 preguntaba otra:
 *  miraba sólo la palabra pegada a `care` y se leía como ésta. Con eso
 *  `Cartea care am citit-o` —uno de los cuatro ítems retirados— pasaba
 *  limpio, porque su clítico va ENCLÍTICO en el participio. Devuelve el
 *  clítico encontrado, o null. */
export function cliticoEnLaRelativa(frase: string): string | null {
  const i = frase.search(/(?<![\p{L}])care(?![\p{L}])/iu);
  if (i < 0) return null;
  const tras = frase.slice(i).replace(/^care\s*/iu, '');
  const pro = /^((?:l|i|le|o)-)/iu.exec(tras) ?? /^((?:îl|o|îi|le))(?![\p{L}])/iu.exec(tras);
  if (pro) return pro[1]!;
  const enc = /(?<![\p{L}])\p{L}+-(o|l)(?![\p{L}])/iu.exec(tras);
  return enc ? `-${enc[1]}` : null;
}

/** DESNUDAR: quitarle a la buena EXACTAMENTE las dos piezas que el punto
 *  enseña —la marca `pe` y el clítico que repite al relativo—. Si lo que
 *  queda no es la mala, la corrección pide algo más que esas dos piezas
 *  y el ítem ha dejado de medir su punto.
 *
 *  Es el invariante que sustituye a la norma escrita: no dice «que la
 *  mala sea el calco», construye el calco y lo compara. Y como efecto
 *  colateral prohíbe la mala RESUMPTIVA (`Omul care l-am văzut`), que es
 *  habla rumana real: una mala con clítico no puede ser nunca el desnudo
 *  de su propia buena. */
export function desnudar(buena: string): string {
  let s = buena.replace(/(?<![\p{L}])pe\s+(?=care(?![\p{L}]))/iu, '');
  s = s.replace(/((?<![\p{L}])care\s+)((?:\p{L}+-)|(?:\p{L}+\s+))/iu,
    (_m, cabeza: string, cli: string) =>
      (CLITICO_GUION.test(cli) || CLITICO_SUELTO.test(cli.trim())) ? cabeza : cabeza + cli);
  s = s.replace(/(\p{L})-o(?![\p{L}])/iu, '$1');
  return s.replace(/\s+/g, ' ').trim();
}

/** Las formas de 3.ª persona con las que `care` SÍ podría ser el sujeto.
 *  Se le piden al paradigma; no se escriben a mano. */
export function tercerasPersonas(inf: string): string[] {
  const v = VERBOS_A1.find((x) => x.inf === inf);
  if (!v) return [];
  return [presente(v, 'el'), presente(v, 'ei'), perfectCompus(v, 'el'), perfectCompus(v, 'ei')]
    .filter((f): f is string => !!f);
}

/** EL SUJETO POSPUESTO, CONSTRUIDO DESDE LA BUENA.
 *
 *  De `X ca SN să V R` sale `X să V SN R`, que es rumano correcto. No es
 *  una opinión sobre el ítem: es la misma frase con el sujeto detrás del
 *  verbo, y el rumano la admite libremente. Devuelve null si la buena no
 *  tiene ese molde (entonces el ítem ya lo suspende otro gate). */
export function sujetoPospuesto(buena: string): string | null {
  const m = /^(.*?)\bca\s+((?:(?!să\b)\p{L}+\s+){1,3}?)să\s+(\p{L}+)\s*(.*)$/iu.exec(buena);
  if (!m) return null;
  const [, antes, sn, verbo, resto] = m;
  return `${antes}să ${verbo} ${sn!.trim()}${resto ? ' ' + resto : ''}`.replace(/\s+/g, ' ').trim();
}

export function verificar(items: ItemRo[]): string[] {
  const v = verificarB1(items);
  for (const [i, x] of items.entries()) {
    const id = `CORO19A-${String(i + 1).padStart(3, '0')} (${x.p})`;

    if (x.p === REL) {
      // (1) LA CORRECCIÓN ES EXACTAMENTE «pe» + CLÍTICO, y nada más.
      const desnuda = desnudar(x.buena);
      if (desnuda !== x.mala)
        v.push(`${id}: desnudar la buena de «pe» y del clítico da «${desnuda}», que no es la mala — la corrección pide algo más que las dos piezas del punto`);
      // (2) Y LA MALA NO PUEDE LLEVAR CLÍTICO: con él es la relativa
      // RESUMPTIVA del rumano coloquial y dialectal (Croitor, LR 1/2016),
      // o sea habla real, y además el español no da de dónde copiarla.
      // El clítico puede ir PROCLÍTICO tras «care» (`care l-am văzut`,
      // `care o aștept`) o ENCLÍTICO pegado al participio (`care am
      // citit-O`). La v0 sólo miraba lo primero, y por eso dejaba pasar
      // uno de los cuatro ítems retirados: preguntaba «¿hay un clítico
      // justo detrás de care?» y se leía como «¿la mala es resumptiva?».
      // No es la misma frase, y lo cazó el testigo rojo — que son los
      // cuatro publicados, no un ítem inventado.
      if (!/(?<![\p{L}])care(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala no lleva «care»`);
      const cli = cliticoEnLaRelativa(x.mala);
      if (cli)
        v.push(`${id}: la mala lleva el clítico «${cli}» en la relativa — eso es la relativa RESUMPTIVA, atestiguada en el rumano coloquial y dialectal (Croitor, «Dublarea sintactică», LR 1/2016), no el calco del español: corregiría habla real`);
      if (/(?<![\p{L}])pe\s+care(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala ya lleva «pe care»`);
      if (!/(?<![\p{L}])pe\s+care(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena no lleva «pe care»`);
      // (3) EL PARADIGMA, PREGUNTADO: si el verbo que sigue a «care» es la
      // 3.ª persona, «care» se lee como SUJETO y la mala es rumano
      // correcto. Es el sincretismo que ya cazó r4-dativo-oi.
      if (!x.inf) v.push(`${id}: no declara «inf» — sin lema el gate del paradigma no puede preguntar cuál sería la 3.ª persona`);
      else {
        const terceras = tercerasPersonas(x.inf);
        if (!terceras.length) v.push(`${id}: «${x.inf}» no está en el lexicón — el gate del paradigma no corrió`);
        const tras = x.mala.replace(/^.*?(?<![\p{L}])care\s+/iu, '');
        for (const f of terceras)
          if (new RegExp(`^${f}(?![\\p{L}])`, 'iu').test(tras))
            v.push(`${id}: tras «care» va «${f}», que es 3.ª persona de «${x.inf}» — «care» se leería como SUJETO y la mala sería rumano correcto`);
      }
      // (4) LA PRINCIPAL VA EN 3.ª PERSONA, o `care` admite la lectura
      // APOSITIVA («noi, colegii, care așteptăm, suntem obosiți») y la
      // mala pasa a ser rumano correcto. En los ítems de este lote lo
      // único que bloquea esa lectura es la persona del verbo principal.
      for (const w of fueraDeLaRelativa(x.mala)) {
        const k = w.toLowerCase();
        if (PRONOMBRE_12.test(k))
          v.push(`${id}: la frase lleva el pronombre «${w}» fuera de la relativa — con un antecedente de 1.ª/2.ª persona «care» admite la lectura APOSITIVA y la mala sería rumano correcto`);
        else if (FORMAS_12.has(k) || AUXILIAR_12.test(k))
          v.push(`${id}: «${w}» es 1.ª o 2.ª persona y está fuera de la relativa — la principal tiene que ir en 3.ª, o «care» admite la lectura apositiva y la mala deja de ser mala`);
      }
    }
    if (x.p !== COMPL) continue;
    const pos = sujetoPospuesto(x.buena);
    if (!pos) { v.push(`${id}: no se puede construir el sujeto pospuesto desde la buena`); continue; }
    if (!(x.alt ?? []).some((a) => answersMatchCard(a, pos)))
      v.push(`${id}: falta en «alt» el sujeto pospuesto «${pos}», que es rumano correcto — sin declararlo la tarjeta suspende a quien lo escriba`);
  }
  return v;
}

if (new RegExp(`[/\\\\]corr-ro-b1c\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log('# A qué punto cuenta cada ítem del lote 19-A\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-B1c (lote 19) — ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ~~${x.mala}~~ → **${x.buena}**\n      calco: «${x.calcoEs}»\n      ${x.p === COMPL ? `pospuesto: «${sujetoPospuesto(x.buena)}»` : `desnuda:   «${desnudar(x.buena)}»`}`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

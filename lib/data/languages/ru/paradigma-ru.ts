// lib/data/languages/ru/paradigma-ru.ts
//
// LA MÁQUINA DE FORMAS DEL RUSO A1-A2: las tres declinaciones en los seis
// casos, singular y plural; el presente de las dos conjugaciones, el
// pasado y el imperativo.
//
// ══ POR QUÉ ESTE FICHERO NO PUEDE VALIDARSE A SÍ MISMO ════════════════
//
// El sitio de máximo daño del inventario ruso está escrito en
// `u3-plural-nominativo`: la v0 decía que el reparto `-ы/-и` es
// ORTOGRÁFICO y es primero de TEMA (duro/blando). Una regla así produce
// `*коны`, `*музеы`, `*деревны`, `*дверы` — y el `motivo` del punto dice
// «deriva por regla; el gate lo recalcula», o sea que **el gate las
// aprueba todas, porque recalcula la misma regla**. Un gate que compara lo
// declarado con lo derivado hereda todos los fallos del derivador y los
// convierte en APROBACIONES.
//
// Por eso el segundo camino de esta máquina **no es otra copia de estas
// reglas**: es el CORPUS (`scripts/check-paradigma-ru.ts`, 7,7 M de
// palabras) y es `lib/lang/ortografia-ru.ts`, que lo escribió otra pasada
// para otra pregunta. Dos copias de la misma regla coinciden en el error;
// lo que mide su cruce es la deriva entre copias, nunca el acierto.
//
// ⚠ Y LA ASIMETRÍA DEL CORPUS TAMBIÉN SE ROMPE AQUÍ, medido. «La
// PRESENCIA prueba» vale a escala y NO vale a una aparición: `книгы` sale
// **1 vez** en los 7,7 M —«как владельцу оной бесценной книгы», la
// inscripción de un semianalfabeto citada entre comillas— frente a `книги`
// 597. O sea que la forma que esta máquina NO debe producir jamás está
// atestada. El gate compara RAZONES, nunca presencia: una forma con el
// 0,17 % de su rival no es lengua, es caracterización de personaje.

import { revisarOrtografiaRu, quitarAcento } from '../../../lang/ortografia-ru';

export type CasoRu = 'nom' | 'ac' | 'gen' | 'dat' | 'instr' | 'prep';
export type NumeroRu = 'sg' | 'pl';
export type GeneroRu = 'm' | 'f' | 'n';

/** Las tres declinaciones, con la numeración escolar rusa.
 *  1.ª = `-а/-я` (книга, деревня, папа) · 2.ª = masculino sin desinencia y
 *  neutro (стол, конь, музей, окно, море) · 3.ª = femenino en `-ь`
 *  (дверь, ночь). */
export type DeclinacionRu = 1 | 2 | 3;

/** El TEMA, que es lo primero que se decide y lo que la v0 del inventario
 *  tenía mal. NO es una propiedad ortográfica: es de la consonante final
 *  del tema, y la grafía sólo la refleja.
 *
 *  - `duro`   — la desinencia empieza por vocal dura (ы а о у)
 *  - `blando` — la desinencia empieza por vocal blanda (и я е ю), y el
 *    lema lo señala con `ь`, `й`, `я`, `е`
 *  - `iy`     — el subtipo `-ия/-ий/-ие`, que además de blando cambia el
 *    dativo y el prepositivo singular a `-ии` (в здании, о России). No es
 *    un capricho: es la única clase donde el prepositivo no acaba en `-е`
 *    y sin ella la máquina produce `*в здание`.
 */
export type TemaRu = 'duro' | 'blando' | 'iy';

export interface EntradaNominal {
  /** Nominativo singular, con la ё escrita siempre (es la grafía
   *  informativa y la que el TTS necesita). Sin tilde de acento: aquí es
   *  campo de DATO, y la tilde es presentación. */
  lema: string;
  genero: GeneroRu;
  tema: TemaRu;
  glosa: string;
  /** La animacidad no se lee en la forma y decide el acusativo de todo el
   *  masculino singular y de TODOS los plurales (`u5-animacidad-acusativo`).
   *  Es dato, nunca derivación. */
  animado?: boolean;

  // ── LO QUE NO SE DERIVA, Y POR QUÉ CADA COSA ES DATO ───────────────
  /** Nominativo plural cuando no sale de la regla: la clase masculina en
   *  `-а́` tónica (дом → дома́, город → города́) y los supletivos (друг →
   *  друзья́, ребёнок → де́ти). Es el ítem de sobreaplicación de
   *  `u3-plural-nominativo`: la regla ortográfica acierta la letra y falla
   *  la casilla. */
  nomPlIrreg?: string;
  /** Genitivo plural cuando no sale de la regla. Incluye toda la clase de
   *  desinencia CERO con vocal de apoyo (сестра → сестёр, окно → окон),
   *  que es la casilla más cara del idioma y NO tiene regla: la vocal
   *  aparece en сестёр y no aparece en карт. El ítem de sobreaplicación de
   *  `u5-genitivo-plural` es exactamente ése (`карт`, no `*карот`). */
  genPlIrreg?: string;
  /** Tema del plural cuando difiere del singular (друг → друзь-, сын →
   *  сынов-). Si está, TODO el plural oblicuo sale de aquí. */
  temaPl?: string;
  /** ⚠ Y EL TEMA DE PLURAL PUEDE CAMBIAR TAMBIÉN LA CLASE, que es la
   *  segunda mitad que `temaPl` solo no trae. `друг` es tema DURO y su
   *  plural `друзь-` es BLANDO: sin declararlo, la máquina produce
   *  `*друзьам`, `*друзьами`, `*друзьах` en vez de друзьям (47), друзьями
   *  (100), друзьях (10). Y `люд-` acaba en consonante dura y aun así toma
   *  las desinencias blandas (людям 695, людях 260), o sea que tampoco se
   *  deriva de la letra final: es dato puro. */
  temaPlTema?: TemaRu;
  /** ⚠ LA VOCAL FUGAZ, que es una clase y no una lista de excepciones.
   *  `день` → `дня`, `отец` → `отца`, `конец` → `концa`: la vocal del
   *  nominativo desaparece en TODAS las demás casillas, singular y plural.
   *  No se deriva —`лес` no la pierde y tiene la misma forma— así que es
   *  dato, y va como TEMA y no como seis casillas sueltas: guardarlas
   *  sueltas es la regla escrita seis veces, que se desincroniza en la
   *  copia N+1 que nadie añadió. */
  temaOblicuo?: string;
  /** ⚠ EL SEGUNDO LOCATIVO. Una clase de masculinos toma `-у́` tónica tras
   *  в/на con valor locativo: `в лесу́` 381 frente a `в лесе` 3, `в саду́`
   *  416 frente a `в саде` 0, `на берегу́` 203, `на полу́` 374. El
   *  inventario no lo declaraba y **envenena este generador**: la regla de
   *  prepositivo produce `*в лесе`.
   *
   *  La defensa NO es acordarse: es que `prepositivoSg()` EXIGE el regente
   *  y `paradigmaNominal()` devuelve el prepositivo de `о`, con ese nombre.
   *  Una firma que no se puede llamar mal vale más que un comentario.
   *
   *  ⚠ Y LA PREPOSICIÓN VA CON LA FORMA, porque es LÉXICA y no libre. La
   *  v0 guardaba sólo la forma y el gate probaba `в` para todas: `в берегу`
   *  sale 0 y `на берегу` 203; `в полу` 12 y `на полу` 374. Peor todavía,
   *  la comparación de `пол` medía OTRA PALABRA — `в поле` 428 es el
   *  prepositivo del neutro `поле` «campo», no de `пол` «suelo». Un número
   *  correcto sobre una forma ambigua es un número verdadero que mide otra
   *  cosa, y aquí la ambigüedad cruzaba dos entradas del lexicón. */
  locativo2?: {
    forma: string;
    regente: 'в' | 'на';
    /** ⚠ EL RIVAL DE ESTA CASILLA ES HOMÓGRAFO DE OTRO LEMA, y entonces la
     *  comparación del gate NO mide este lema. `пол` «suelo» hace
     *  `на полу` (374) y su rival regular sería `на поле`… que sale 105
     *  veces y es ÍNTEGRAMENTE el prepositivo de `поле` «campo», un neutro
     *  distinto. La comparación sale bien —374 > 105— y sale bien POR LA
     *  RAZÓN EQUIVOCADA. Declararlo convierte un verde falso en un «no
     *  puedo certificarlo», que es lo que de verdad se sabe. */
    rivalContaminado?: string;
  };
  /** Casillas sueltas que la regla falla y que el corpus corrigió. La
   *  clave es `<caso>.<numero>`. Existe para que una excepción medida se
   *  guarde COMO DATO en vez de moverle el agujero a la regla. */
  irregular?: Partial<Record<`${CasoRu}.${NumeroRu}`, string>>;
  /** Sin plural (время no, pero молоко sí). `paradigmaNominal` devuelve
   *  `null` en plural en vez de derivar algo plausible. */
  soloSingular?: boolean;
  /** Por qué esta entrada está en el lexicón, cuando el motivo no es «es
   *  frecuente». Lo lee el gate y lo imprime. */
  nota?: string;
}

// ── LAS TABLAS ────────────────────────────────────────────────────────
//
// El orden es SIEMPRE [nom, ac, gen, dat, instr, prep]. El acusativo va
// como `null` cuando lo decide la animacidad: no se pone una forma por
// defecto, porque una forma por defecto en esa casilla es exactamente el
// fallo que devuelve un número plausible.
const ORDEN: CasoRu[] = ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'];

type Fila = (string | null)[];

// 1.ª declinación: -а / -я
const D1: Record<TemaRu, Record<NumeroRu, Fila>> = {
  duro:   { sg: ['а', 'у', 'ы', 'е', 'ой', 'е'],   pl: ['ы', null, '', 'ам', 'ами', 'ах'] },
  blando: { sg: ['я', 'ю', 'и', 'е', 'ей', 'е'],   pl: ['и', null, 'ь', 'ям', 'ями', 'ях'] },
  // -ия: dat y prep singular en -ии. El plural es el blando normal salvo
  // el genitivo, que va en -ий (лекций, армий).
  iy:     { sg: ['я', 'ю', 'и', 'и', 'ей', 'и'],   pl: ['и', null, 'й', 'ям', 'ями', 'ях'] },
};

// 2.ª masculina. El lema aporta su propia desinencia de nominativo
// (`-Ø`, `-ь`, `-й`), así que el tema se obtiene QUITÁNDOLA y la fila la
// vuelve a poner: es la misma jugada que el genitivo latino, el dato manda
// sobre la forma de diccionario.
const D2M: Record<TemaRu, Record<NumeroRu, Fila>> = {
  duro:   { sg: ['', null, 'а', 'у', 'ом', 'е'],   pl: ['ы', null, 'ов', 'ам', 'ами', 'ах'] },
  blando: { sg: ['ь', null, 'я', 'ю', 'ем', 'е'],  pl: ['и', null, 'ей', 'ям', 'ями', 'ях'] },
  iy:     { sg: ['й', null, 'я', 'ю', 'ем', 'и'],  pl: ['и', null, 'ев', 'ям', 'ями', 'ях'] },
};
/** El masculino en `-й` NO es la clase `-ий`. `музей` hace `о музее` y
 *  `санаторий` hace `о санатории`: sólo la segunda mete la `и`. Por eso
 *  hay dos filas y no una, y el lexicón declara cuál. */
const D2M_J: Record<NumeroRu, Fila> = {
  sg: ['й', null, 'я', 'ю', 'ем', 'е'],
  pl: ['и', null, 'ев', 'ям', 'ями', 'ях'],
};

// 2.ª neutra: -о / -е
const D2N: Record<TemaRu, Record<NumeroRu, Fila>> = {
  duro:   { sg: ['о', 'о', 'а', 'у', 'ом', 'е'],   pl: ['а', null, '', 'ам', 'ами', 'ах'] },
  blando: { sg: ['е', 'е', 'я', 'ю', 'ем', 'е'],   pl: ['я', null, 'ей', 'ям', 'ями', 'ях'] },
  iy:     { sg: ['е', 'е', 'я', 'ю', 'ем', 'и'],   pl: ['я', null, 'й', 'ям', 'ями', 'ях'] },
};

// 3.ª: femenino en -ь. El acusativo singular ES el nominativo también en
// los animados (мать, дочь), o sea que aquí la animacidad NO manda: es la
// única declinación donde no manda, y por eso va escrito.
const D3: Record<NumeroRu, Fila> = {
  sg: ['ь', 'ь', 'и', 'и', 'ью', 'и'],
  pl: ['и', null, 'ей', 'ям', 'ями', 'ях'],
};

/** El tema: el lema menos su desinencia de nominativo. */
export function temaDe(e: EntradaNominal): string {
  const l = quitarAcento(e.lema);
  if (e.genero === 'f' && declinacionDe(e) === 3) return l.slice(0, -1);
  if (/[аяоеьй]$/.test(l)) return l.slice(0, -1);
  return l;
}

/** La declinación, desde el género y la terminación. Las dos hacen falta:
 *  `дверь` y `конь` acaban igual y son 3.ª y 2.ª. */
export function declinacionDe(e: EntradaNominal): DeclinacionRu {
  const l = quitarAcento(e.lema);
  if (/[ая]$/.test(l)) return 1;
  if (e.genero === 'f' && l.endsWith('ь')) return 3;
  return 2;
}

/** La fila de desinencias que le toca a esta entrada. */
function filaDe(e: EntradaNominal, num: NumeroRu): Fila {
  const d = declinacionDe(e);
  const tema = num === 'pl' && e.temaPlTema ? e.temaPlTema : e.tema;
  if (d === 1) return D1[tema][num];
  if (d === 3) return D3[num];
  if (e.genero === 'n') return D2N[tema][num];
  if (tema === 'blando' && quitarAcento(e.lema).endsWith('й')) return D2M_J[num];
  return D2M[tema][num];
}

// ── LA ORTOGRAFÍA, QUE VA DESPUÉS Y NUNCA ANTES ──────────────────────
//
// Éste es el orden que la v0 del inventario tenía invertido, y el que
// produce `*коны` si se hace al revés. Primero decide el TEMA —que es de
// la lengua— y sólo entonces la grafía convierte lo que no se puede
// escribir. `книга` es tema DURO y da `-ы`; la regla velar la escribe `и`.
// `конь` es tema BLANDO y da `-и` DE ENTRADA, sin pasar por aquí.
const VELAR_O_SIBILANTE = /[кгхжшщч]$/;
/** Las cuatro sustituciones que la norma impone (Правила 1956, §13). No
 *  incluye `ц`: `цы` es grafía correcta y frecuente (отцы, огурцы) y
 *  meterla produciría una mala que es lengua real. El motivo está escrito
 *  en `ortografia-ru.ts` y no se duplica: se importa la comprobación. */
export function ortografiar(tema: string, desinencia: string): string {
  if (!desinencia) return tema;
  let d = desinencia;
  if (VELAR_O_SIBILANTE.test(tema)) {
    if (d.startsWith('ы')) d = 'и' + d.slice(1);
  }
  if (/[жшщч]$/.test(tema)) {
    if (d.startsWith('я')) d = 'а' + d.slice(1);
    if (d.startsWith('ю')) d = 'у' + d.slice(1);
  }
  return tema + d;
}

/** Una casilla. Devuelve `null` donde la máquina NO SABE, que es lo
 *  contrario de devolver la forma de al lado.
 *
 *  ⚠ EL PREPOSITIVO QUE DEVUELVE ES EL DE `о`. Para в/на hay que llamar a
 *  `prepositivoSg()`, que exige el regente. Ver `locativo2`. */
export function casillaNominal(e: EntradaNominal, caso: CasoRu, num: NumeroRu): string | null {
  if (num === 'pl' && e.soloSingular) return null;
  const guardada = e.irregular?.[`${caso}.${num}`];
  if (guardada) return guardada;

  if (num === 'pl' && caso === 'nom' && e.nomPlIrreg) return e.nomPlIrreg;
  if (num === 'pl' && caso === 'gen' && e.genPlIrreg) return e.genPlIrreg;

  // El acusativo no tiene desinencia propia: la animacidad lo manda al
  // nominativo o al genitivo. En la 1.ª declinación sí la tiene (-у/-ю) y
  // por eso la fila la trae; en la 3.ª es el nominativo SIEMPRE, animado o
  // no (о мать, вижу мать), y eso no es derivable de la animacidad.
  if (caso === 'ac') {
    const d = declinacionDe(e);
    if (d === 3) return casillaNominal(e, 'nom', num);
    const propia = filaDe(e, num)[ORDEN.indexOf('ac')] ?? null;
    if (propia !== null) return ortografiar(temaPara(e, num, 'ac'), propia);
    return casillaNominal(e, e.animado ? 'gen' : 'nom', num);
  }

  const des = filaDe(e, num)[ORDEN.indexOf(caso)] ?? null;
  if (des === null) return null;
  return ortografiar(temaPara(e, num, caso), des);
}

/** El tema del número pedido. `друг` → `друзь-` en plural; `день` → `дн-`
 *  en todo lo oblicuo. `temaPl` gana sobre `temaOblicuo` porque un lema
 *  puede tener los dos y el plural es el más específico. */
function temaPara(e: EntradaNominal, num: NumeroRu, caso: CasoRu): string {
  // El nominativo SINGULAR es la única casilla que conserva la vocal
  // fugaz: es justo la forma donde está. Sacarlo del tema oblicuo daría
  // «дн» en vez de «день», y sin lanzar.
  if (num === 'sg' && caso === 'nom') return temaDe(e);
  if (num === 'pl' && e.temaPl) return e.temaPl;
  if (e.temaOblicuo) return e.temaOblicuo;
  return temaDe(e);
}

/** EL PREPOSITIVO CON SU REGENTE, y la firma es el invariante.
 *
 *  No existe un «prepositivo» a secas de un sustantivo que tenga segundo
 *  locativo: `о лесе` y `в лесу́` son dos formas vivas de la misma casilla
 *  y la preposición decide. Pedir el regente hace imposible producir
 *  `*в лесе` por descuido, que es lo que un comentario no impide. */
export function prepositivoSg(e: EntradaNominal, regente: 'о' | 'в' | 'на' | 'при'): string | null {
  if (e.locativo2 && regente === e.locativo2.regente) return e.locativo2.forma;
  return casillaNominal(e, 'prep', 'sg');
}

export type TablaNominal = Record<NumeroRu, Partial<Record<CasoRu, string>>>;

/** El paradigma entero. El prepositivo que trae es **el de `о`** y la
 *  clave lo dice: leerlo como universal es el fallo que este fichero
 *  existe para impedir. */
export function paradigmaNominal(e: EntradaNominal): { sg: Record<string, string>; pl: Record<string, string> | null } {
  const uno = (num: NumeroRu) => {
    const o: Record<string, string> = {};
    for (const c of ORDEN) {
      const f = casillaNominal(e, c, num);
      if (f) o[c === 'prep' ? 'prepDeO' : c] = f;
    }
    if (num === 'sg' && e.locativo2) o.locativo2 = e.locativo2.forma;
    return o;
  };
  return { sg: uno('sg'), pl: e.soloSingular ? null : uno('pl') };
}

// ══════════════════════════════════════════════════════════════════════
// EL VERBO
// ══════════════════════════════════════════════════════════════════════

export type PersonaRu = '1sg' | '2sg' | '3sg' | '1pl' | '2pl' | '3pl';
export const PERSONAS: PersonaRu[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

export interface EntradaVerbal {
  /** Infinitivo, con ё escrita. */
  lema: string;
  /** I o II. No se deduce del infinitivo —`говорить` es II y `жить` es I,
   *  y los dos acaban en `-ить`/`-ыть`— así que es dato. */
  clase: 1 | 2;
  /** ⚠ OBLIGATORIO, Y ES EL INVARIANTE QUE CIERRA EL §4.2 RUMANO.
   *
   *  El tema del PRESENTE. En rumano `temaInfinitivo()` tenía un fallback
   *  que devolvía el verbo entero y no explotaba **porque ninguna rama
   *  llegaba a él**: habría explotado el día que alguien quitara un
   *  record. Aquí no hay fallback y no hay derivación desde el infinitivo:
   *  el tema es CAMPO OBLIGATORIO, así que la alternancia
   *  (`писать` → `пиш-`, `сказать` → `скаж-`) no se puede olvidar.
   *  Olvidarla no produce `*писаю`: produce un error de compilación. */
  temaPresente: string;
  /** El tema de la 1.ª persona singular cuando difiere del resto: la
   *  epéntesis de `л` labial (`любить` → `любл-ю` pero `люб-ишь`) y las
   *  alternancias que sólo tocan esa casilla. Es data por la misma razón. */
  tema1sg?: string;
  /** ⚠ DOS CAMPOS Y NO UNO, Y ÉSTA ES LA MEDIA REGLA QUE ESTE FICHERO
   *  ESTUVO A PUNTO DE ESCRIBIR. La v0 tenía un solo `desinenciaTonica`
   *  para gobernar las dos cosas que el acento decide sobre la GRAFÍA:
   *
   *    · la `ё` de la conjugación I  → depende del acento de la **2.ª sg**
   *    · la `-и` del imperativo      → depende del acento de la **1.ª sg**
   *
   *  Y no son el mismo hecho: `писа́ть` tiene la 1.ª sg tónica (`пишу́`) y
   *  la 2.ª átona (`пи́шешь`), o sea `пиши́!` con `-и` y `пишешь` con `е`.
   *  Un solo campo obliga a elegir cuál de las dos formas se escribe mal.
   *  Es la regla a la que le falta una mitad, cazada por aplicarla a un
   *  lema que no estaba en la lista con la que se escribió.
   *
   *  `acento2sgDesinencial` — la 2.ª sg lleva el acento en la desinencia:
   *  gobierna la `ё` (`идёшь`, `живёшь`) y NADA MÁS. Irrelevante en la
   *  conjugación II, donde la desinencia no tiene forma con `ё`. */
  acento2sgDesinencial: boolean;
  /** `acento1sgDesinencial` — la 1.ª sg lleva el acento en la desinencia:
   *  gobierna el imperativo (`пиши́`, `учи́`, `говори́` frente a `бу́дь`,
   *  `отве́ть`). Es el único sitio del fichero donde el acento de una
   *  casilla decide la LETRA de otra. */
  acento1sgDesinencial: boolean;
  glosa: string;
  aspecto: 'impf' | 'pf';
  /** El tema del pasado cuando no es `lema` menos `-ть`: `мочь` → `мог-`,
   *  `идти` → `шё-`/`ш-`, `нести` → `нёс-`. */
  pasadoIrreg?: { m: string; f: string; n: string; pl: string };
  /** Un verbo que no sigue ninguna clase (`хотеть` cambia de conjugación
   *  a mitad del paradigma) se guarda ENTERO. Si está marcado `irregular`
   *  y no trae las seis casillas, `presente()` devuelve `null`: nunca una
   *  forma plausible. */
  irregular?: Partial<Record<PersonaRu, string>>;
  /** Imperativo guardado cuando la regla falla o el verbo no lo tiene. */
  imperativoIrreg?: string | null;
  /** Reflexivo: `-ся` tras consonante, `-сь` tras vocal. La alternancia es
   *  ortográfica y la hace la máquina; que el verbo lo lleve es léxico. */
  reflexivo?: boolean;
  nota?: string;
}

// Desinencias del presente. La conjugación I tiene DOS juegos y la
// diferencia es el ACENTO, no el tema: `пи́шешь` frente a `идёшь`. Es la
// única parte de este fichero donde el acento cambia una LETRA, y por eso
// es dato y no presentación.
const P1_ATONA:  Record<PersonaRu, string> = { '1sg': 'ю', '2sg': 'ешь', '3sg': 'ет', '1pl': 'ем', '2pl': 'ете', '3pl': 'ют' };
const P1_TONICA: Record<PersonaRu, string> = { '1sg': 'ю', '2sg': 'ёшь', '3sg': 'ёт', '1pl': 'ём', '2pl': 'ёте', '3pl': 'ют' };
const P2:        Record<PersonaRu, string> = { '1sg': 'ю', '2sg': 'ишь', '3sg': 'ит', '1pl': 'им', '2pl': 'ите', '3pl': 'ят' };

/** ⚠ LA REGLA ES DISTINTA EN LAS DOS CONJUGACIONES, Y LA v0 ESCRIBIÓ UNA
 *  SOLA PARA LAS DOS. Es la media regla en su forma de manual: acertaba
 *  entera en la conjugación I —que es donde se escribió— y producía
 *  `*говорат`, `*любат`, `*люблу`, `*помну` en la II. Ningún camino propio
 *  lo vio; lo cazó el corpus, que es de otra naturaleza: `говорят` 2.531
 *  frente a `говорат` 0.
 *
 *  Y la asimetría no es un capricho ortográfico, es de la LENGUA:
 *
 *  - **Conjugación I**: el tema acabado en consonante es DURO, así que la
 *    desinencia pierde la blandura — `иду`, `идут`, `жду`, `беру`. Sólo
 *    conservan la vocal blanda los temas en vocal (`читаю`) y los en
 *    `ь`/`й` (`пью`, `пьют`).
 *  - **Conjugación II**: el tema es SIEMPRE blando por definición de la
 *    clase —`говор'-`, `люб'-`, `помн'-`— así que la desinencia NO se
 *    endurece nunca… salvo tras sibilante, donde la endurece la
 *    ORTOGRAFÍA y no la fonología: `учу`, `учат`, `держат`.
 *
 *  La sibilante es lo único común a las dos, y es justo lo que impide
 *  `*пишю`, la forma que produce la regla ingenua. */
function durezaVerbal(tema: string, des: string, clase: 1 | 2): string {
  let d = des;
  const endurece = () => { 
    if (d.startsWith('ю')) d = 'у' + d.slice(1);
    if (d.startsWith('я')) d = 'а' + d.slice(1);
  };
  if (/[жшщч]$/.test(tema)) endurece();
  else if (clase === 1 && !/[аеёиоуыэюяьй]$/.test(tema)) endurece();
  return tema + d;
}

const SE = (f: string, refl?: boolean) => (refl ? f + (/[аеёиоуыэюя]$/.test(f) ? 'сь' : 'ся') : f);

/** El presente. `null` si el verbo está marcado irregular y le falta la
 *  casilla: la máquina no inventa una forma plausible. */
export function presente(v: EntradaVerbal, p: PersonaRu): string | null {
  if (v.irregular) {
    const f = v.irregular[p];
    return f ? SE(f, v.reflexivo) : null;
  }
  const tabla = v.clase === 2 ? P2 : v.acento2sgDesinencial ? P1_TONICA : P1_ATONA;
  const tema = p === '1sg' && v.tema1sg ? v.tema1sg : v.temaPresente;
  return SE(durezaVerbal(tema, tabla[p], v.clase), v.reflexivo);
}

export function paradigmaPresente(v: EntradaVerbal): Record<PersonaRu, string | null> {
  return Object.fromEntries(PERSONAS.map((p) => [p, presente(v, p)])) as Record<PersonaRu, string | null>;
}

export type FormaPasado = 'm' | 'f' | 'n' | 'pl';

/** El pasado, que concuerda en GÉNERO y no en persona (`u7-pasado-genero`).
 *  Es un participio, y por eso la regla sale del infinitivo y no del tema
 *  de presente. */
export function pasado(v: EntradaVerbal, g: FormaPasado): string | null {
  if (v.pasadoIrreg) return SE(v.pasadoIrreg[g], v.reflexivo);
  const l = quitarAcento(v.lema).replace(/ся$/, '');
  if (!l.endsWith('ть')) return null; // идти, мочь, нести: van con dato
  const t = l.slice(0, -2);
  return SE(t + { m: 'л', f: 'ла', n: 'ло', pl: 'ли' }[g], v.reflexivo);
}

/** EL IMPERATIVO, y su capa prestada declarada.
 *
 *  La regla sale del tema de presente Y DEL ACENTO (`u7-imperativo-forma`
 *  lo dice: «пиши́ frente a бу́дь»), o sea que carga la capa `acento`, cuyos
 *  tres dueños están a piso cero. Aquí eso no bloquea porque el acento es
 *  DATO del lexicón (`desinenciaTonica`) y no respuesta del alumno; lo que
 *  bloquea es pedirlo, y eso es decisión del lote, no de esta función. */
export function imperativo(v: EntradaVerbal): string | null {
  if (v.imperativoIrreg !== undefined) return v.imperativoIrreg;
  const t = v.temaPresente;
  if (/[аеёиоуыэюя]$/.test(t)) return SE(t + 'й', v.reflexivo);
  if (v.acento1sgDesinencial) return SE(t + 'и', v.reflexivo);
  // Átono y con grupo consonántico delante también toma `-и`: `помни`,
  // `кончи`. La `-ь` sólo con UNA consonante final.
  if (/[бвгдджзйклмнпрстфхцчшщ]{2}$/.test(t)) return SE(t + 'и', v.reflexivo);
  return SE(t + 'ь', v.reflexivo);
}

// ══════════════════════════════════════════════════════════════════════
// LOS INVARIANTES
// ══════════════════════════════════════════════════════════════════════

export interface Aviso { lema: string; clase: string; detalle: string }

/** Lo que esta máquina puede comprobar SOBRE SÍ MISMA, que es poco a
 *  propósito. Lo que de verdad la valida es el corpus, y vive en
 *  `scripts/check-paradigma-ru.ts`.
 *
 *  Aquí sólo van las condiciones que no dependen de la misma regla que
 *  genera: que ninguna forma producida viole la ortografía (la comprueba
 *  un módulo escrito por otra pasada para otra pregunta), que ninguna
 *  lleve tilde en un campo de dato, y que ninguna casilla salga vacía. */
export function invariantesNominales(entradas: EntradaNominal[]): Aviso[] {
  const out: Aviso[] = [];
  for (const e of entradas) {
    const t = paradigmaNominal(e);
    for (const [num, celdas] of Object.entries(t)) {
      if (!celdas) continue;
      for (const [caso, forma] of Object.entries(celdas as Record<string, string>)) {
        if (!forma || !forma.trim()) {
          out.push({ lema: e.lema, clase: 'casilla-vacia', detalle: `${caso}.${num}` });
          continue;
        }
        for (const h of revisarOrtografiaRu(forma)) {
          out.push({ lema: e.lema, clase: `ortografia:${h.clase}`, detalle: `${caso}.${num} = ${forma}${h.nota ? ' — ' + h.nota : ''}` });
        }
      }
    }
    // El segundo locativo se declara o no existe, pero si se declara tiene
    // que ser distinto del prepositivo regular: si coinciden, la entrada
    // está diciendo algo que no dice nada y el gate lo aprobaría igual.
    if (e.locativo2 && e.locativo2.forma === casillaNominal(e, 'prep', 'sg')) {
      out.push({ lema: e.lema, clase: 'locativo2-inutil', detalle: `coincide con el prepositivo regular (${e.locativo2.forma})` });
    }
  }
  return out;
}

export function invariantesVerbales(verbos: EntradaVerbal[]): Aviso[] {
  const out: Aviso[] = [];
  for (const v of verbos) {
    // Un verbo marcado irregular al que le falta una casilla devuelve
    // null, y eso es correcto — pero un lexicón con huecos silenciosos es
    // el §4.2 esperando. Se cuenta.
    for (const p of PERSONAS) {
      const f = presente(v, p);
      if (f === null) {
        out.push({ lema: v.lema, clase: 'presente-incompleto', detalle: p });
        continue;
      }
      for (const h of revisarOrtografiaRu(f)) {
        out.push({ lema: v.lema, clase: `ortografia:${h.clase}`, detalle: `${p} = ${f}` });
      }
    }
    for (const g of ['m', 'f', 'n', 'pl'] as FormaPasado[]) {
      if (pasado(v, g) === null) out.push({ lema: v.lema, clase: 'pasado-sin-dato', detalle: g });
    }
    // ⚠ EL INVARIANTE QUE CIERRA EL §4.2, y se comprueba al revés de como
    // apetece. No se pregunta «¿está guardada la alternancia?» —eso ya lo
    // garantiza el tipo— sino «¿la regla ingenua habría acertado?». Si NO
    // habría acertado y el lexicón no lo dice en `nota`, la alternancia
    // está viva y muda, y el siguiente que lea el fichero creerá que el
    // tema sale del infinitivo.
    const ingenuo = temaIngenuo(v.lema);
    if (ingenuo !== null && ingenuo !== v.temaPresente && !v.nota) {
      out.push({
        lema: v.lema, clase: 'alternancia-sin-nota',
        detalle: `la regla ingenua da «${ingenuo}-» y el tema es «${v.temaPresente}-»: eso produciría ${durezaVerbal(ingenuo, (v.clase === 2 ? P2 : P1_ATONA)['1sg'], v.clase)}`,
      });
    }
    // La alternancia de 1.ª sg (`любить` → `любл-ю`, `видеть` → `виж-у`) es
    // la misma clase de dato y no la ve el aviso de arriba, porque el tema
    // general SÍ coincide con el ingenuo. Sin esta rama, la mitad de las
    // alternancias del ruso pasaban mudas.
    if (v.tema1sg && v.tema1sg !== v.temaPresente && !v.nota) {
      out.push({
        lema: v.lema, clase: 'alternancia-1sg-sin-nota',
        detalle: `la 1.ª sg sale de «${v.tema1sg}-» y el resto de «${v.temaPresente}-»`,
      });
    }
  }
  return out;
}

/** EL TEMA QUE LA REGLA SOLA DERIVARÍA — y existe SÓLO para medirse contra
 *  el dato, nunca para producir.
 *
 *  Es la contramedida del §4.2 rumano en su forma directa: allí el
 *  fallback estaba escondido en la máquina y no explotaba porque ninguna
 *  rama llegaba a él. Aquí está fuera, tiene nombre, y lo único que hace
 *  es decirle al invariante qué habría pasado sin el dato. Con `писать`
 *  devuelve `писа-`, o sea `*писаю`, que es la forma falsa de control. */
export function temaIngenuo(lema: string): string | null {
  const l = quitarAcento(lema).replace(/ся$/, '');
  if (l.endsWith('ать') || l.endsWith('ять') || l.endsWith('еть') || l.endsWith('ыть') || l.endsWith('уть')) return l.slice(0, -2);
  if (l.endsWith('ить')) return l.slice(0, -3);
  return null;
}

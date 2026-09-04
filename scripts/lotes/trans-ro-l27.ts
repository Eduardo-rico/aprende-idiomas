// scripts/lotes/trans-ro-l27.ts — LOTE 27: `r4-cel-proforma`, a PISO 2.
//
//   npx tsx scripts/lotes/trans-ro-l27.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l27.ts --asigna   # a qué punto cuenta cada ítem
//
// Quinto punto de la máquina de transformación, tercero re-encuadrado antes
// de escribir un ítem — y **el primero que se publica POR DEBAJO del piso
// con dictamen escrito**, como `r7-supin` se quedó en 5. No es un lote
// incompleto: es el tamaño que el punto aguanta.
//
// ══ 1 · CASI TODO ESTE PUNTO YA ESTABA COBRADO ═══════════════════════
//
// La precondición al lingüista (§3.1: antes de re-encuadrar, pregunta si la
// mitad útil ya vive en otro sitio) devolvió que **tres cuartas partes del
// punto no son suyas**:
//
//   · la CONCORDANCIA de `cel/cea/cei/cele` la publica entera
//     `r8-comparativo`, con OCHO ítems, las cuatro formas y la misma trampa
//     del género español que este punto habría usado;
//   · `cei doi` / `cele două` lo publica `r2-genero-tres-valores` con el
//     mismo par `doi`/`două` (lote 26);
//   · la PROFORMA (`cel de acolo`) es transferencia pura: el español tiene
//     «el de allí» y el portugués `o de lá`, y este alumno llega con
//     portugués C2. Elegir la forma sólo exige el género, que es otro punto;
//   · `băiatul cel mic` **no está determinado** —el artículo adjetival es
//     opcional (GALR I; GBLR 2010)—, y la elisión `Cea a lui Ion` tiene
//     tres salidas correctas y 0 apariciones en el corpus.
//
// ══ 2 · LO QUE NO TIENE DUEÑO, Y ES LO ÚNICO QUE QUEDA ═══════════════
//
// **Dónde se marca la definitud dentro del grupo del superlativo.** La
// definitud se marca UNA vez, en el borde izquierdo del grupo nominal, y el
// enclítico queda excluido cuando un determinante antepuesto ya la porta —
// exactamente como `acest băiat` / `*acest băiatul` (GALR I, *Articolul*;
// Avram, *Gramatica pentru toți*, cap. del artículo). De ahí las dos caras:
//
//   · **POSPUESTO** → el nombre CONSERVA su enclítico y además aparece
//     `cel`: `prietenul cel mai bun`. **DOS marcas**, donde el español y el
//     portugués ponen una.
//   · **ANTEPUESTO** → `cel` carga la definitud y el nombre va **DESNUDO**:
//     `cel mai bun prieten`, nunca `*cel mai bun prietenul`. **Cero marcas**
//     sobre el nombre.
//
// `r2-articulo-enclitico-sg` enseña que el enclítico EXISTE; **ningún punto
// publicado enseña dónde está PROHIBIDO.** Eso no es una coocurrencia entre
// dos puntos ajenos: es una regla sin dueño, y es la razón por la que el
// dictamen no bajó a piso cero.
//
// ══ 3 · POR QUÉ DOS Y NO CUATRO — Y LA OBJECIÓN ERA MÍA ══════════════
//
// El primer dictamen traía CUATRO ítems, uno por cada forma de `cel`
// (`peretele cel mai gros`, `pâinea cea mai bună`, `norii cei mai negri`,
// `podurile cele mai lungi`). Se le devolvió la pregunta obligatoria del
// §4.25 —**¿qué VARÍA entre los ítems?**— y el lingüista aceptó el conteo:
//
//   > `+cel` y `+mai` son INVARIANTES en los cuatro, o sea que la marca
//   > doble —todo el contenido nuevo— se aprende en el primer ítem. Lo
//   > único que discrimina del segundo en adelante es la FORMA de `cel`
//   > (que es `r8-comparativo`, ocho veces) y la del ENCLÍTICO (que es
//   > `r2-articulo-enclitico-sg`). **Cobertura real 1, no 4.**
//
// Es `r8-relativas-pe-care` otra vez, cazado esta vez ANTES de escribir.
//
// ══ 4 · Y LA FRONTERA QUE EL PRIMER DICTAMEN TRAÍA ESTÁ MUERTA ═══════
//
// Traía un ítem de frontera contra `*cel mai bun decât`, apoyado en un cero
// del corpus. **El cero nunca se corrió.** Al medirlo: `cel mai X decât`
// da 1 y `ce(a|i|le) mai X decât` da 8, y de las nueve al menos dos no
// admiten lectura de proforma —«magazia **cea mai deschisă decât toate**»,
// «slugile **cele mai vechi decât dânsul**»—, con el nombre ya articulado.
// GALR I reparte los régimenes (`mai` + `decât`/`ca`; `cel mai` +
// `din`/`dintre`) pero **no marca la cadena como agramatical**, y el corpus
// la atestigua: bajo §0.3 es **vieja**, no **mala**. El lingüista lo
// concedió y retiró el ítem. Queda escrito porque el error fue suyo y no
// del punto — y porque es el §4.14 en su forma más barata: un recuento
// citado sin correr.
//
// ══ 5 · LA FRONTERA QUE SÍ VIVE, Y ESTÁ DENTRO DE LA REGLA ═══════════
//
// No hace falta una frontera externa, porque **las dos caras fallan en
// sentidos opuestos**:
//
//   · en el pospuesto se falla por DEFECTO (`*prieten cel mai bun`,
//     `*prietenul mai bun`): el alumno pone UNA marca porque su lengua pone
//     una;
//   · en el antepuesto se falla por EXCESO (`*cel mai bun prietenul`), y lo
//     falla **precisamente quien acaba de aprender la otra cara**.
//
// O sea que el ítem de sobreaplicación del §0.6 **es la segunda cara del
// propio punto**, no un apéndice. Es el mejor sitio en el que puede estar.
//
// ══ 6 · EL PAR MÍNIMO, LLEVADO AL LÍMITE ═════════════════════════════
//
// Los dos ítems comparten **marco, sustantivo y adjetivo**, y los dos son
// masculino singular. Sólo cambian el nombre propio del sujeto —la
// diferencia más pequeña que permite que las dos fuentes no sean la misma
// frase— y la cláusula de POSICIÓN de la consigna.
//
// Eso no es elegancia: **a n = 2 toda propiedad que distinga las dos
// fuentes separa las clases al 100 % por construcción**, así que la única
// defensa posible es que no haya ninguna propiedad que distinguirlas salvo
// la examinada. Es el §4.40 —«el arreglo bueno no es un umbral, es
// ESTRUCTURA»— llevado a su caso extremo, y por la misma razón **este lote
// no corre ninguna búsqueda de composiciones**: a n = 8 la nula ya no
// rechaza nada (§4.41), y a n = 2 la pregunta no significa nada. Lo que
// protege a este lote son las estrategias CIEGAS ejecutadas y los gates
// estructurales de aquí abajo.
//
// ══ 7 · LOS DOS 50 % SON EL SUELO, NO HOLGURA ════════════════════════
//
// Las dos sobregeneralizaciones opuestas se EJECUTAN y cada una acierta
// exactamente 1 de 2. Con una respuesta binaria **la mitad ES el azar**
// (corolario del §4.35 que ya fijó el tamaño de los lotes 24 y 26):
// cualquier diseño que prometa margen por debajo está midiendo otra cosa.
// Y fija el tamaño: cargar de un lado subiría una de las dos por encima
// del tope.
import {
  verificar, informe, norm, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion,
} from '../lib/transformacion-ro';
import { SUSTANTIVOS_A1, ADJETIVOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { articulado, adjetivo, type Genero, type LemaAdjetival, type LemaNominal } from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const PUNTO = 'r4-cel-proforma';

const lema = (l: string): LemaNominal => {
  const v = SUSTANTIVOS_A1.find((x) => x.lema === l);
  if (!v) throw new Error(`el lote 27 pide «${l}», que no está en el lexicón`);
  return v;
};
const adj = (a: string, extra: readonly LemaAdjetival[] = []): LemaAdjetival => {
  const v = [...extra, ...ADJETIVOS_A1].find((x) => x.lema === a);
  if (!v) throw new Error(`el lote 27 pide el adjetivo «${a}», que no está en el lexicón`);
  return v;
};

/** LAS DOS CONSIGNAS, y lo único que las separa es la palabra de POSICIÓN.
 *
 *  **1 · «superlativo relativo, no “muy bueno” sino “el mejor”».** Sin esa
 *  cláusula, `Ion este un prieten foarte bun` —el *superlativ absolut*— es
 *  una respuesta CORRECTA que la clave suspendería. Es el fallo de los
 *  lotes 25 y 26 (`Doi dintre prietenii Mariei`, el numeral en cifras) en
 *  su tercera piel, y esta vez se cerró antes de escribir la clave.
 *
 *  **2 · DETRÁS / DELANTE es el gate entero**, y tiene la propiedad que
 *  hacía falta: nombra el ORDEN, no la FORMA. De «va detrás» a «el nombre
 *  lleva enclítico» hay exactamente el paso que el punto examina, así que
 *  la consigna no deletrea nada. Lo que cierra en cada ítem es,
 *  literalmente, **la clave del otro** — las dos son rumano perfecto, y si
 *  esta cláusula se cayera del enunciado el lote entero quedaría
 *  indeterminado.
 *
 *  **3 · «No añadas ningún complemento»** cierra `din toți`, `dintre
 *  prietenii mei`, `al meu` — el superlativo relativo pide dominio con
 *  naturalidad (las dos apariciones del corpus lo llevan: «cel mai bun
 *  prieten **al meu**») y sin la cláusula serían respuestas correctas
 *  suspendidas.
 *
 *  **4 · «no cambies nada más»** congela `este`, el sujeto y el orden del
 *  resto — pero NO dice «no añadas ni quites palabras», que haría ilegal la
 *  respuesta correcta: aquí hay que añadir dos palabras y quitar `un`. Es
 *  la coda del lote 25, que el lingüista dejó dicho que se puede reutilizar
 *  y que cierra por propiedades sin filtrar que haya que añadir algo. */
const COMUN = 'Di la misma frase con el adjetivo en superlativo relativo —no «muy bueno», sino «el mejor»— y ';
const CODA = ' No añadas ningún complemento y no cambies nada más.';
export const CONSIGNA_POS = `${COMUN}déjalo DETRÁS del sustantivo.${CODA}`;
export const CONSIGNA_ANTE = `${COMUN}ponlo DELANTE del sustantivo.${CODA}`;

export interface Decl {
  adjExtra?: readonly LemaAdjetival[];
  /** el sujeto, que es lo ÚNICO que distingue las dos fuentes */
  sujeto: string;
  n: string;
  a: string;
  /** `'pos'` = adjetivo detrás (dos marcas) · `'ante'` = delante (nombre desnudo) */
  posicion: 'pos' | 'ante';
  nota: string;
}

export const DECL: Decl[] = [
  {
    sujeto: 'Ion', n: 'prieten', a: 'bun', posicion: 'pos',
    nota: 'LA MARCA DOBLE: el nombre conserva su enclítico Y aparece `cel`, donde el español y el portugués ponen UNA sola marca («el mejor amigo», «o melhor amigo»). El error del alumno es por DEFECTO: *prietenul mai bun, *prieten cel mai bun. Atestado con este mismo lema y este mismo adjetivo: «dacă vecinul ți-ar fi PRIETENUL CEL MAI BUN» (leído con --ctx, no contado)',
  },
  {
    sujeto: 'Radu', n: 'prieten', a: 'bun', posicion: 'ante',
    nota: 'EL ÍTEM DE SOBREAPLICACIÓN, y es la segunda cara del punto y no un apéndice: quien acaba de aprender el ítem anterior escribe *cel mai bun prietenul. Antepuesto, `cel` carga la definitud y el nombre va DESNUDO (GALR I, Articolul; el paralelo es acest băiat / *acest băiatul). Atestado con el mismo lema y adjetivo: «era CEL MAI BUN PRIETEN al meu», «CEL MAI BUN PRIETEN al lui Ghica»',
  },
];

const may = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** LA CONSTRUCCIÓN, Y NINGUNA FORMA SE ESCRIBE A MANO. El enclítico sale de
 *  `articulado()` y la concordancia del adjetivo de `adjetivo()`, o sea que
 *  las dos claves las deriva el paradigma: si alguien cambiara la regla del
 *  enclítico, las claves cambiarían con ella en vez de quedarse mintiendo.
 *  Es lo que el lote 26 hizo con `concordanciaDe()`. */
export function construir(d: Decl): {
  p: string; pasada: number; s: string; instruccion: string; r: string; alt: string[];
  foco: string; nucleo: string; espejoEs: boolean; transparenteLatin: boolean;
  sobreaplicacion: boolean; d: Decl; l: LemaNominal; a: LemaAdjetival; g: Genero;
} {
  const l = lema(d.n);
  const a = adj(d.a, d.adjExtra);
  const g: Genero = l.genero;
  const sg = adjetivo(a, g, 'sg');
  const art = articulado(l, 'sg');
  if (!sg) throw new Error(`sin adjetivo para «${d.a}»`);
  if (!art) throw new Error(`sin artículo enclítico para «${d.n}»`);
  const s = `${d.sujeto} este un ${l.lema} ${sg}.`;
  // POSPUESTO: nombre articulado + `cel mai` + adjetivo.
  // ANTEPUESTO: `cel mai` + adjetivo + nombre DESNUDO.
  const r = d.posicion === 'pos'
    ? `${d.sujeto} este ${art} cel mai ${sg}.`
    : `${d.sujeto} este cel mai ${sg} ${l.lema}.`;
  return {
    p: PUNTO, pasada: 1,
    s: may(s), instruccion: d.posicion === 'pos' ? CONSIGNA_POS : CONSIGNA_ANTE, r: may(r),
    // LA ÚNICA VARIACIÓN LIBRE: `este` / `e`. Se cuentan los EJES y se
    // multiplica (§4.28): hay UN eje y dos valores, así que UNA alternativa
    // por ítem y no falta ninguna esquina. La elisión de `este` es corriente
    // y no es lo que se mide: sin declararla, un alumno impecable suspende.
    alt: [r.replace(' este ', ' e ')].map(may),
    foco: l.lema,
    // El núcleo es la forma del NOMBRE en la respuesta, que es la casilla
    // examinada: articulada en el pospuesto, desnuda en el antepuesto. En el
    // antepuesto núcleo y foco COINCIDEN, y ése es el ítem cuya respuesta
    // correcta es no tocar la palabra (ver `juicios.copia`).
    nucleo: d.posicion === 'pos' ? art : l.lema,
    // ¿Se llega traduciendo? NO, en la lectura OPERATIVA que el campo pide
    // —la misma por la que `faci`→`fă` va false pese a ser estructuralmente
    // «haces»→«haz»—: el español no produce la cadena rumana, porque el «el»
    // español no da `cel` y el alumno tiene que suplir las cuatro palabras.
    // ⚠ PERO HAY UNA ASIMETRÍA ESTRUCTURAL REAL Y VA DICHA, porque el campo
    // sola no la ve: la ESTRUCTURA del antepuesto (una marca delante, nombre
    // desnudo) ES la del español, y la del pospuesto no lo es. Por eso no se
    // deja en una declaración: se EJECUTA como estrategia (`ESTRUCTURA_ES`),
    // que es un camino y no una opinión.
    espejoEs: false,
    // El latín tenía el superlativo sintético (`optimus`) y no esta
    // perífrasis con artículo, así que la raíz románica común no da ninguna
    // de las dos casillas. Se declara para un público sólo hispanohablante.
    transparenteLatin: false,
    sobreaplicacion: d.posicion === 'ante',
    d, l, a, g,
  };
}

export const CONSTRUIDOS = DECL.map(construir);
export const ITEMS: ItemTransRo[] = CONSTRUIDOS.map(({ d: _d, l: _l, a: _a, g: _g, ...x }) => x);
export type Construido = ReturnType<typeof construir>;

// ══ LAS DOS SOBREGENERALIZACIONES OPUESTAS, EJECUTADAS ═══════════════
//
// Las dos se construyen desde la VISTA —nunca desde la respuesta— y las dos
// van contra la RESPUESTA entera y no contra el núcleo, porque un alumno que
// aplica una regla de colocación escribe la frase, no una palabra. La
// comparación es la del PRODUCTO (`answersMatchCard`, dentro de `correr`):
// una estrategia acierta si y sólo si la tarjeta se la daría por buena.
//
// ⚠ Y LAS DOS USAN MORFOLOGÍA QUE EL ALUMNO YA TRAE: pegar `-ul` a un
// masculino en consonante es A1 (`r2-articulo-enclitico-sg`). Es la lección
// del §7 del lote 24 —enumerar las rutas libres es enumerar sus
// COMPOSICIONES con lo que el alumno ya sabe—, y por eso la regla falsa se
// escribe entera y se ejecuta, en vez de confiar en que no exista.
const PATRON = /^(\p{Lu}[\p{L}]*) este un ([\p{L}]+) ([\p{L}]+)\.$/u;

/** «Pon siempre el nombre articulado y `cel mai` detrás» — la regla del que
 *  sólo vio la primera cara. Acierta el pospuesto y falla el antepuesto. */
export const SIEMPRE_POSPUESTO: Estrategia = {
  nombre: 'poner siempre el nombre articulado y «cel mai» detrás',
  objetivo: 'respuesta',
  aplicar: (x) => {
    const m = PATRON.exec(x.s);
    if (!m) return null;
    const [, suj, n, a] = m;
    return `${suj} este ${n}${/[aeiouăâî]$/u.test(n!) ? 'le' : 'ul'} cel mai ${a}.`;
  },
};

/** «Pon siempre `cel mai` + adjetivo delante y el nombre desnudo» — que es
 *  además LA ESTRUCTURA DEL ESPAÑOL («el mejor amigo») y del portugués («o
 *  melhor amigo»). Acierta el antepuesto y falla el pospuesto. Es la mitad
 *  que `espejoEs` no puede expresar, y por eso se ejecuta. */
export const ESTRUCTURA_ES: Estrategia = {
  nombre: 'la estructura del español: «el mejor amigo», nombre desnudo detrás',
  objetivo: 'respuesta',
  aplicar: (x) => {
    const m = PATRON.exec(x.s);
    if (!m) return null;
    const [, suj, n, a] = m;
    return `${suj} este cel mai ${a} ${n}.`;
  },
};

/** «Ignoro la posición y pongo las DOS marcas» — la sobreaplicación pura del
 *  §0.6, que es el error que el ítem 2 existe para castigar. Tiene que
 *  acertar CERO: si acertara alguno, el lote estaría premiando el error que
 *  dice enseñar a evitar. */
export const LAS_DOS_MARCAS: Estrategia = {
  nombre: 'poner las dos marcas siempre (*cel mai bun prietenul)',
  objetivo: 'respuesta',
  aplicar: (x) => {
    const m = PATRON.exec(x.s);
    if (!m) return null;
    const [, suj, n, a] = m;
    return `${suj} este cel mai ${a} ${n}${/[aeiouăâî]$/u.test(n!) ? 'le' : 'ul'}.`;
  },
};

// ══ LOS GATES PROPIOS DEL PUNTO ══════════════════════════════════════

export function revisar(xs: readonly Construido[]): string[] {
  const v: string[] = [];

  // 1 · LAS CLAVES SE DERIVAN DEL PARADIGMA, NO SE ESCRIBEN.
  for (const x of xs) {
    const sg = adjetivo(x.a, x.g, 'sg');
    const art = articulado(x.l, 'sg');
    const esperada = may(x.d.posicion === 'pos'
      ? `${x.d.sujeto} este ${art} cel mai ${sg}.`
      : `${x.d.sujeto} este cel mai ${sg} ${x.l.lema}.`);
    if (x.r !== esperada) v.push(`${x.d.sujeto}: la respuesta «${x.r}» no es la que deriva el paradigma («${esperada}»)`);
  }

  // 2 · EL PAR MÍNIMO: MISMO SUSTANTIVO, MISMO ADJETIVO, MISMO MARCO. Es el
  //     gate que sostiene el lote entero. A n = 2 cualquier otra diferencia
  //     entre las dos fuentes separa las clases al 100 % por construcción,
  //     así que la ÚNICA defensa es que no exista ninguna salvo la posición.
  const lemas = new Set(xs.map((x) => x.l.lema));
  const adjs = new Set(xs.map((x) => x.a.lema));
  if (lemas.size !== 1) v.push(`PAR MÍNIMO: los ítems usan ${lemas.size} sustantivos ({${[...lemas].join(', ')}}) — con más de uno, el sustantivo predice la respuesta y deja de medirse la posición`);
  if (adjs.size !== 1) v.push(`PAR MÍNIMO: los ítems usan ${adjs.size} adjetivos ({${[...adjs].join(', ')}}) — con más de uno, el adjetivo predice la respuesta`);

  // 3 · LOS DOS, MASCULINO SINGULAR. Si el género variara, volvería a entrar
  //     como confusor la variable de `r8-comparativo` y no se sabría cuál de
  //     las dos cosas discriminó. Es la respuesta directa a la objeción de
  //     varianza que tumbó el primer dictamen.
  for (const x of xs)
    if (x.g !== 'm') v.push(`${x.d.sujeto}: género «${x.g}» — los dos ítems tienen que ser masculinos, o la forma de «cel» vuelve a ser la variable y eso es r8-comparativo`);

  // 4 · UNO DE CADA POSICIÓN, Y NI UNO MÁS. Con respuesta binaria el reparto
  //     tiene que ser la mitad exacta: cargar de un lado sube una de las dos
  //     sobregeneralizaciones opuestas por encima del tope del 50 %.
  const pos = xs.filter((x) => x.d.posicion === 'pos').length;
  if (pos * 2 !== xs.length) v.push(`REPARTO: ${pos} pospuestos de ${xs.length} — tiene que ser la mitad exacta, o una de las dos sobregeneralizaciones pasa del tope`);

  // ⚠ Las comprobaciones 5 y 6 son INDEPENDIENTES y por eso NO comparten
  // bucle ni `continue`: en el lote 21 un gate nuevo no disparó nunca porque
  // iba detrás de un `continue` ajeno, y el lote salía «Limpio» (§0.8).

  // 5 · EL POSPUESTO LLEVA LAS DOS MARCAS. El nombre articulado tiene que
  //     estar en la respuesta, y `cel` detrás de él.
  for (const x of xs.filter((y) => y.d.posicion === 'pos')) {
    const art = articulado(x.l, 'sg')!;
    if (!new RegExp(`(?<![\\p{L}-])${art} cel mai(?![\\p{L}-])`, 'u').test(norm(x.r)))
      v.push(`${x.d.sujeto}: el pospuesto tiene que llevar las DOS marcas («${art} cel mai …»), y su respuesta es «${x.r}»`);
  }

  // 6 · EL ANTEPUESTO LLEVA EL NOMBRE DESNUDO. Es la mitad que el alumno
  //     sobreaplica, así que es la que hay que blindar: si alguien escribe
  //     aquí la forma articulada, el lote enseña justo el error que existe
  //     para castigar, y ningún otro gate lo vería.
  for (const x of xs.filter((y) => y.d.posicion === 'ante')) {
    const art = articulado(x.l, 'sg')!;
    if (new RegExp(`(?<![\\p{L}-])${norm(art)}(?![\\p{L}-])`, 'u').test(norm(x.r)))
      v.push(`${x.d.sujeto}: el antepuesto NO puede llevar el nombre articulado («${art}»), y su respuesta es «${x.r}»`);
    if (!new RegExp(`(?<![\\p{L}-])cel mai [\\p{L}]+ ${norm(x.l.lema)}(?![\\p{L}-])`, 'u').test(norm(x.r)))
      v.push(`${x.d.sujeto}: el antepuesto tiene que ser «cel mai <adj> ${x.l.lema}», y su respuesta es «${x.r}»`);
  }

  // 7 · CADA CONSIGNA NOMBRA SU POSICIÓN, Y EXCLUYE EL SUPERLATIVO ABSOLUTO.
  //     Las dos cláusulas son gates: sin la primera el lote queda
  //     indeterminado (la clave del otro ítem es rumano perfecto), y sin la
  //     segunda `foarte bun` es una respuesta correcta que la clave
  //     suspende. La promesa de una consigna tiene que tener un gate, o la
  //     consigna y las claves se desincronizan en el ítem que alguien añada.
  // ⚠ LAS PALABRAS VAN EN EL ALFABETO DE LA NORMALIZACIÓN, NO EN EL DEL
  //   ESPAÑOL. `norm()` pasa por NFD y borra los diacríticos, así que
  //   comparar contra «detrás» CON tilde no dispara nunca sobre texto
  //   normalizado. Este gate se escribió mal la primera vez y **se cazó a
  //   sí mismo**: marcó el ítem pospuesto y no el antepuesto, porque
  //   «delante» no lleva tilde y «detrás» sí. Es §4.37 exacto, y es la
  //   segunda vez que muerde en este repositorio.
  for (const x of xs) {
    const esperada = x.d.posicion === 'pos' ? 'detras' : 'delante';
    const otra = x.d.posicion === 'pos' ? 'delante' : 'detras';
    if (!norm(x.instruccion).includes(esperada)) v.push(`${x.d.sujeto}: la consigna no dice «${esperada.toUpperCase()}», así que la respuesta no está determinada — la clave del otro ítem también es correcta`);
    if (norm(x.instruccion).includes(otra)) v.push(`${x.d.sujeto}: la consigna dice «${otra}», que es la posición del OTRO ítem`);
    if (!/muy bueno/i.test(x.instruccion)) v.push(`${x.d.sujeto}: la consigna no excluye el superlativo ABSOLUTO, así que «foarte ${x.a.lema}» es una respuesta correcta que la clave suspendería`);
  }

  // 8 · LA VARIACIÓN LIBRE, DECLARADA ENTERA. Un eje (`este`/`e`), dos
  //     valores, una alternativa. Se comprueba que esté y que sea la que es.
  for (const x of xs) {
    const esperada = may(x.r.replace(' este ', ' e '));
    if (!(x.alt ?? []).some((a) => norm(a) === norm(esperada)))
      v.push(`${x.d.sujeto}: falta la alternativa con «e» por «este» («${esperada}») — es rumano corriente y sin declararla se suspende a un alumno impecable`);
  }

  return v;
}

const gatesPropios = (items: readonly ItemTransRo[]): string[] => [
  ...(items.length === CONSTRUIDOS.length ? [] : ['el lote y la declaración se han desincronizado']),
  ...revisar(CONSTRUIDOS),
];

// ══ LAS AFIRMACIONES DEL LOTE, CONTRA LOS 2,9 M DE PALABRAS ══════════
//
// ⚠ Se consulta y se publica con el MISMO instrumento: estos números salen
// de `INI`+patrón+`FIN`, igual que el gate. Y ⚠ los patrones van con
// `[\p{L}]` y NUNCA con `\w`: en JS `\w` es `[A-Za-z0-9_]` incluso con el
// flag `u`, así que no casa `ă â î ș ț` y SUBCUENTA en silencio — medido
// aquí mismo, `[\p{L}]+ cel mai` da 821 y `\w+ cel mai` da 625. Ese fallo
// se pagó en este mismo punto (di 709 donde eran 912) y desde el 2026-09-04
// `corpus-ro.ts` rechaza `\w` con su testigo rojo.
export const COMPROBACIONES: Comprobacion[] = [
  { afirmacion: 'LA MARCA DOBLE del superlativo pospuesto es rumano corriente: nombre articulado + «cel mai»', patron: '[\\p{L}]+ul cel mai', espera: 'presente' },
  { afirmacion: 'y con el adjetivo de este lote: «… ul cel mai bun»', patron: '[\\p{L}]+ul cel mai bun', espera: 'presente' },
  { afirmacion: 'la clave del ítem pospuesto, con SU lema: «prietenul cel mai» — LEÍDA con --ctx, no contada: «dacă vecinul ți-ar fi prietenul cel mai bun»', patron: 'prietenul cel mai', espera: 'presente' },
  { afirmacion: 'EL ANTEPUESTO con el nombre DESNUDO: «cel mai bun …»', patron: 'cel mai bun [\\p{L}]+', espera: 'presente' },
  { afirmacion: 'la clave del ítem antepuesto, con SU lema: «cel mai bun prieten» — LEÍDA: «era cel mai bun prieten al meu», «cel mai bun prieten al lui Ghica»', patron: 'cel mai bun prieten', espera: 'presente' },
  // EL `AUSENTE`, Y CON SU DEBILIDAD ESCRITA. Un cero no demuestra nada —la
  // ausencia no prohíbe y el corpus es prosa del XIX-XX—, y éste es
  // especialmente débil porque `cel mai bun X` sólo sale 44 veces en total,
  // así que el cero podría ser de escasez y no de prohibición. La
  // prohibición la da GALR I (*Articolul*): la definitud se marca UNA vez,
  // en el borde izquierdo del grupo. El corpus sólo dice que no lo refuta.
  { afirmacion: 'el antepuesto NO articula el nombre (*cel mai bun prietenul) — la prohibición es de GALR I, Articolul; el corpus sólo NO LA REFUTA, y con 44 apariciones de «cel mai bun X» el cero es débil', patron: 'cel mai bun [\\p{L}]+ul', espera: 'ausente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  estrategias: [SIEMPRE_POSPUESTO, ESTRUCTURA_ES, LAS_DOS_MARCAS],
  gatesPropios,
  // A n = 2 la semilla casi no tiene trabajo —el detector de posición sólo
  // mira clases con ≥2 dentro y ≥2 fuera, así que aquí no puede disparar—,
  // pero se declara igual porque el campo es obligatorio y porque el día que
  // alguien añada ítems el orden publicado tiene que ser el que el gate mira.
  semilla: 27,
  juicios: {
    copia: 'UNO de los dos se contesta copiando el foco, y ese uno es forzoso, no un descuido: el punto es DÓNDE se marca la definitud, y en el antepuesto la respuesta correcta es precisamente NO tocar el nombre (`cel mai bun prieten`, con el nombre desnudo). Ni cero ni dos valdrían. Con cero —los dos articulados— el lote enseñaría «al poner el superlativo, articula siempre», que es exactamente la sobreaplicación que el ítem 2 existe para castigar y que produce *cel mai bun prietenul; con dos, «deja el nombre como está» resolvería el lote entero y no se examinaría nada. Medido ejecutando: copiar el foco 1/2, copiar la frase entera 0/2 y la edición modal del lote 0/2 — y ese cero de la modal no es una virtud, es un artefacto de n = 2: la modal es leave-one-out, así que con un solo «otro» ítem copia la edición contraria y falla siempre. El número que protege a este lote no es ése, son las tres estrategias ejecutadas (poner siempre las dos marcas detrás 1/2, la estructura del español 1/2, poner las dos marcas a la vez 0/2) y sobre todo la ESTRUCTURA: los dos ítems comparten marco, sustantivo y adjetivo, y sólo cambian el nombre propio del sujeto y la cláusula de posición, así que no queda ninguna propiedad de la frase que pueda separar las clases salvo la examinada.',
    frontera: 'La regla es «la definitud se marca UNA vez, en el borde izquierdo del grupo» (GALR I, Articolul), y su contexto negativo NO es externo al punto: es su segunda cara. El ítem antepuesto (`Radu`) va marcado `sobreaplicacion` porque lo falla precisamente quien acaba de aprender el pospuesto — aprende «pon el enclítico y cel mai» y escribe *cel mai bun prietenul, con las dos marcas. Los dos modos de fallar son de signo contrario: por DEFECTO en el pospuesto (*prietenul mai bun, una sola marca, que es lo que da el español) y por EXCESO en el antepuesto. Y va escrito lo que este lote NO trae, con su motivo: la frontera comparativa que el primer dictamen proponía —un ítem contra *cel mai bun decât— está RETIRADA, porque el cero en que se apoyaba nunca se corrió: al medirlo, `cel mai X decât` da 1 y `ce(a|i|le) mai X decât` da 8, y al menos dos no admiten lectura de proforma («magazia cea mai deschisă decât toate», «slugile cele mai vechi decât dânsul», las dos con el nombre articulado). GALR I reparte los régimenes pero no marca la cadena como agramatical, así que bajo §0.3 es vieja, no mala, y no entra.',
    varianza: 'Lo que varía entre los dos ítems, y ES el punto, es la POSICIÓN del adjetivo y con ella dónde cae la marca de definitud: pospuesto, el nombre conserva su enclítico y además aparece `cel` (dos marcas); antepuesto, `cel` la carga entera y el nombre va desnudo (cero marcas sobre el nombre). Las piezas invariantes son `+cel`, `+mai` y `-un`, en los dos ítems, y esa invariancia es de la LENGUA y no del lote: las dos casillas SON superlativos relativos, así que `cel mai` está en las dos por definición, igual que `+nu` en r3-negacion-antepuesta. Lo que varía en su lugar —la presencia o ausencia del enclítico en el nombre— pertenece a ESTE punto y a ningún otro: r2-articulo-enclitico-sg enseña que el enclítico existe y cómo se forma, pero ningún punto publicado enseña dónde está PROHIBIDO. Y va escrito por qué el lote tiene DOS ítems y no cuatro, porque es la corrección de un diseño anterior: la primera versión traía uno por cada forma de cel (peretele/pâinea/norii/podurile) y en ella `+cel` y `+mai` eran igualmente invariantes, pero lo único que discriminaba del segundo ítem en adelante era la FORMA de cel —que es r8-comparativo, ocho ítems publicados con la misma trampa del género español— y la del enclítico —que es r2—, o sea cobertura real 1 y no 4. Por eso los dos ítems de aquí son los dos masculino singular a propósito: con el género constante, la forma `cel` es la misma en los dos y no puede discriminar nada, y la posición queda como única variable.',
  },
};

if (/[/\\]trans-ro-l27\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 27 · transformación · ${ITEMS.length} ítems · ${PUNTO}\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const x of CONSTRUIDOS)
    console.log(`- [${x.d.posicion}] \`${x.s}\` → \`${x.r}\`  (alt: ${(x.alt ?? []).join(' · ')})`);
  console.log('');
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  console.log('\n⚠ Este lote NO corre búsqueda de composiciones: a n = 8 la nula por permutación ya no rechaza ni un atajo plantado del 100 % (§4.41), y a n = 2 la pregunta no significa nada. Lo que protege al lote son las estrategias CIEGAS ejecutadas contra el tope del 50 % y los gates estructurales (par mínimo de marco, género constante, reparto exacto).');
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}

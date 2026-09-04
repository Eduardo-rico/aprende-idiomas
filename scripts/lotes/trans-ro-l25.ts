// scripts/lotes/trans-ro-l25.ts — LOTE 25: `r4-articulo-posesivo`.
//
//   npx tsx scripts/lotes/trans-ro-l25.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l25.ts --asigna   # a qué punto cuenta cada ítem
//
// Tercer punto de la máquina de transformación, y el primero que llega
// con el punto RE-ENCUADRADO antes de escribir un ítem. El dictamen del
// lingüista adversarial del 2026-09-04 —pedido como precondición, no como
// revisión— tumbó las dos mitades del diseño que traía:
//
// ══ 1 · LA MITAD QUE PARECÍA EL PUNTO ESTÁ GRATIS ════════════════════
//
// «Elige al/a/ai/ale» es la `cita` del currículo y es la mitad MUERTA. El
// alumno llega con DOS rutas y se componen (§4.35 y la lección del lote
// 24):
//
//   · **el atajo de superficie**: `al/a/ai/ale` y el artículo enclítico
//     son dos exponentes del MISMO rasgo, así que «a + la terminación del
//     enclítico» (`prietenul`→al, `cartea`→a, `prietenii`→ai,
//     `caietele`→ale) no es un truco frágil sino la generalización
//     correcta. Medido sobre el lexicón entero, con test en
//     `paradigma-ro.test.ts`: **138 de 142 celdas**. Falla en UNA clase de
//     superficie —singular con enclítico homógrafo de un plural, o sea
//     masculino y neutro en `-e`: `fratele`, `numele`, `peretele`,
//     `câinele`.
//   · **el género del español**: el español YA concuerda el artículo con
//     lo poseído («el/la/los/las **de** Juan»), así que rescata justo
//     donde el otro falla, porque `frate`, `nume` y `câine` son
//     masculinos también en español.
//
// El compuesto de las dos sólo falla donde el enclítico es `-le` **y** la
// traducción española es FEMENINA. En el lexicón hay **un** lema así:
// `perete` / «pared». Entró al lexicón para este lote y con ese motivo
// escrito. O sea que la mitad FORMA rinde **un** ítem discriminante, no
// ocho, y la mitad forma vuelve entera en B2 (`r11-relativo-declinado`).
//
// ══ 2 · LA REGLA NO ES «DEFINIDO ⇒ NO HAY ARTÍCULO»: ES ADYACENCIA ════
//
// La `descripcion` del punto decía «aparece cuando el genitivo no sigue
// inmediatamente a un sustantivo articulado», y eso se lee como una
// frontera de DETERMINACIÓN. Es media regla, y la mitad que falta es
// donde vive el punto: el artículo posesivo falta **sólo** en la
// configuración [N+enclítico] + [Gen] pegados. Con el poseído DEFINIDO
// hay cuatro configuraciones productivas de A2 que lo exigen igual
// (GALR I, *Articolul posesiv-genitival*; Avram, *Gramatica pentru toți*):
// adjetivo interpuesto (`casa nouă A Mariei`), demostrativo pospuesto
// (`mașina aceasta A Mariei`), predicativo (`cartea este A Mariei`) y
// núcleo cuantificado (`doi prieteni AI Mariei`). Corpus del proyecto:
// `mâna dreaptă a` 10, `fiul cel mic al` 9, `doi fii ai` 4, `e a lui` 160.
//
// Si el lote fuera todo «indefinitivizar», el alumno aprendería «mete
// `un/o` + una forma en a-» y sacaría 8/8 sin haber visto ninguna de las
// otras configuraciones — el defecto de `r2-numerales-de` calcado. Por eso
// **la familia `indef` está limitada a tres ítems, y hay gate.**
//
// ══ 3 · LO QUE MIDE ESTE LOTE ES LA SUBPRODUCCIÓN ════════════════════
//
// El error diana es la OMISIÓN pura: «un amigo mío», «un libro de María»,
// «dos amigos de María» son español perfecto y no dan **ninguna pieza**
// que ocupe ese hueco. Y el error que el `motivo` viejo declaraba
// —concordar con el poseedor— **no lo produce un hispanohablante**, por la
// misma ruta «el/la de Juan»: es error de anglohablante o de eslavo
// (§0.1). Se quitó del inventario.
//
// ══ 4 · LO QUE NO PUEDE ENTRAR, Y LOS TRES VAN EN GATE ═══════════════
//
//   · **Coordinación de dos genitivos.** `Cărțile elevului ȘI ALE
//     profesorului` (dos conjuntos) y `Cărțile elevului ȘI profesorului`
//     (un conjunto, dos poseedores) son **las dos gramaticales**, y lo que
//     las separa es semántica que el estímulo no da (GALR II,
//     *Coordonarea*). Sería «corregir algo que no está mal» otra vez.
//   · **Perfect compus de 3.ª sg o de 2.ª sg en el estímulo.** `a` es
//     también el auxiliar (`a venit`) y `ai` es también «tienes» / el
//     auxiliar de 2.ª sg (`ai citit`): un estímulo así mete en la frase
//     una copia de la CADENA que el alumno tiene que producir sin que sea
//     el rasgo. Es el primo por HOMOGRAFÍA del §4.13bis.
//   · **Plural indefinido sin numeral.** `Niște caiete ale elevului` y
//     `Caiete ale elevului` son las dos correctas (GALR I, `niște` como
//     artículo indefinido de plural): dos salidas para un hueco.
//   · **Y LA CUARTA, QUE COSTÓ DOS ÍTEMS YA ESCRITOS: el núcleo
//     CUANTIFICADO.** La v1 de este lote tenía dos ítems `Doi prieteni ai
//     Mariei` / `Două telefoane ale doctorului`, y el segundo ataque los
//     tumbó los dos con una sola frase: **`Doi DINTRE prietenii Mariei
//     vin mâine` cumple la consigna letra por letra y NO lleva artículo
//     posesivo** —el poseído sigue definido y el genitivo sigue
//     adyacente, así que `ai` está correctamente ausente—. Es rumano
//     estándar, es la traducción más fiel del original y **es la
//     respuesta que demuestra que el alumno entendió la regla**. La clave
//     la suspendía.
//     No se arregla con la consigna: todo cuantificador tiene partitivo
//     con `dintre` (GALR I, *Construcţii partitive*; dexonline s.v.
//     *dintre*) y no hay propiedad verificable que lo excluya sin nombrar
//     la palabra. Y declararlo como alternativa MATA el ítem, porque la
//     alternativa no lleva artículo y el ítem dejaría de medir su punto.
//     **La razón exacta, que es la que impide que el error vuelva:
//     `dintre` entra porque la FUENTE va en plural definido y regala el
//     conjunto presupuesto.** Con fuente en singular no tiene por dónde:
//     `Un câine al bunicului` no compite con `Unul dintre câinii
//     bunicului` porque ése tendría que inventar un plural que no está en
//     la frase. Por eso muerde en la familia cuantificada y no en la
//     indefinida — y por eso la familia entera se retiró y hay gate.
import {
  verificar, informe, norm, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion,
} from '../lib/transformacion-ro';
import { contrastarComposiciones } from '../lib/composiciones';
import { SUSTANTIVOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { articulado, genitivoDativo, articolPosesiv, type LemaNominal, type Numero } from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const PUNTO = 'r4-articulo-posesivo';

const lema = (l: string): LemaNominal => {
  const v = SUSTANTIVOS_A1.find((x) => x.lema === l);
  if (!v) throw new Error(`el lote 25 pide «${l}», que no está en el lexicón`);
  return v;
};
/** El poseedor, en genitivo-dativo definido. **No se escribe a mano**:
 *  sale de `genitivoDativo()`, que es la casilla de `r4-gd-definido-sg`,
 *  el prerrequisito declarado de este punto. */
const gd = (l: string): string => {
  const g = genitivoDativo(lema(l), 'sg', true);
  if (!g) throw new Error(`sin genitivo para «${l}»`);
  return g;
};

/** LAS CUATRO CONFIGURACIONES QUE EL LOTE EXAMINA.
 *
 *  `indef`, `cuant` y `adj` EXIGEN el artículo posesivo; `quita` es la
 *  única donde no lo lleva, y es la configuración [N+enclítico]+[Gen]
 *  pegados. `quita` es la inversa exacta de `indef`, y por eso el ítem de
 *  sobreaplicación no hace falta inventarlo: es la misma frase leída al
 *  revés. */
type Familia = 'indef' | 'cuant' | 'adj' | 'dem' | 'quita';

/** Las consignas, UNA POR FAMILIA — no puede haber una sola, porque son
 *  cuatro operaciones distintas.
 *
 *  ══ POR QUÉ NINGUNA DICE «NO AÑADAS PALABRAS» ═══════════════════════
 *  La primera redacción decía «cambia sólo la determinación y no añadas
 *  ni quites ninguna otra palabra», y **hacía ilegal la respuesta
 *  correcta**: indefinitivizar `Cartea Mariei` obliga a meter `o` y `a`,
 *  así que un alumno literal produce `*O carte Mariei` **obedeciendo la
 *  consigna** y se le suspende por hacer caso. Y el arreglo obvio —«añade
 *  sólo lo que la gramática obligue»— es peor: **avisa de que falta
 *  algo**, y el contenido entero de este punto es que el alumno decida
 *  solo que falta una palabra. Un test de subproducción que anuncia la
 *  omisión no mide nada.
 *
 *  Lo que cierra sin avisar es congelar lo que NO se toca: el verbo, el
 *  final de la frase y el orden. Con eso caen la inversión (`Stă pe masă
 *  o carte a Mariei`, rumano correcto) y la paráfrasis (`una dintre
 *  cărțile Mariei`), y no se dice nada de la zona mutable.
 *
 *  ══ Y LAS TRES PALABRAS PROHIBIDAS EN LA CONSIGNA ═══════════════════
 *   · «pronombre»: en español pide primero el CLÍTICO de objeto, y el
 *     alumno reordena la frase (lote 24, §4 punto 4).
 *   · «artículo»: aquí hay DOS —el enclítico y el posesivo— y en la
 *     familia `quita` nombrarlo sería dictar la respuesta.
 *   · y **la letra `a` suelta en español**, que es el núcleo de un ítem:
 *     «Vuelve **a** decir» disparaba el gate de la consigna. Por eso todas
 *     empiezan por «Di otra vez». No es cosmética — lo cazó el gate. */
const CONSIGNA_FINAL = 'No toques el verbo ni el final de la frase, y no cambies el orden de lo que ya hay.';
const CONSIGNAS: Record<Exclude<Familia, 'adj' | 'dem'>, (g: 'm' | 'f') => string> = {
  indef: (g) => `Di otra vez la frase, hablando de ${g === 'f' ? 'una' : 'uno'} cualquiera y no ${g === 'f' ? 'de la' : 'del'} que ya se conocía. ${CONSIGNA_FINAL}`,
  // La consigna de la familia cuantificada se queda escrita porque el
  // gate la prohíbe y hay que poder leer QUÉ se prohibió: es la que
  // `Doi dintre prietenii Mariei` cumple letra por letra sin poner el
  // artículo.
  cuant: () => `Di otra vez la frase, hablando sólo de dos y no de todos. ${CONSIGNA_FINAL}`,
  quita: (g) => `Di otra vez la frase, hablando ${g === 'f' ? 'de la' : 'del'} que ya se conocía y no de ${g === 'f' ? 'una' : 'uno'} cualquiera. ${CONSIGNA_FINAL}`,
};
const consignaAdj = (precision: string) =>
  `Di otra vez la frase, precisando que ${precision}, con esa precisión justo detrás del sustantivo. ${CONSIGNA_FINAL}`;

interface Decl {
  /** el poseído */
  poseido: string;
  numero: Numero;
  familia: Familia;
  /** el poseedor, ya en genitivo */
  posesor: string;
  /** lo que va detrás y no se toca */
  resto: string;
  /** sólo en `adj`: lo que se interpone, y la precisión en español */
  adjetivo?: string;
  precision?: string;
  /** las salidas correctas que la consigna NO cierra */
  alt?: string[];
  espejoEs?: boolean;
  sobreaplicacion?: boolean;
  /** por qué este ítem está en el lote */
  nota: string;
}

const NUMERAL = { m: 'doi', f: 'două', n: 'două' } as const;
const INDEF = { m: 'un', f: 'o', n: 'un' } as const;
const may = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** Lo que el alumno que traduce del español escribe: la operación hecha y
 *  el artículo posesivo AUSENTE. Es la respuesta de la estrategia del
 *  calco, y en la familia `quita` es la respuesta CORRECTA — que es
 *  justamente por lo que esa familia se declara `espejoEs`. */
function partes(d: Decl): { fuente: string; sinArticulo: string; foco: string; nucleo: string; articulo: string } {
  const l = lema(d.poseido);
  const art = articolPosesiv(l.genero, d.numero);
  const def = articulado(l, d.numero);
  if (!def) throw new Error(`sin articulado para «${d.poseido}»`);
  const base = d.numero === 'pl' ? l.plural : l.lema;
  const pegado = `${may(def)} ${d.posesor} ${d.resto}.`;
  switch (d.familia) {
    case 'indef':
      return { fuente: pegado, sinArticulo: `${may(INDEF[l.genero])} ${base} ${d.posesor} ${d.resto}.`, foco: def, nucleo: art, articulo: art };
    case 'cuant':
      return { fuente: pegado, sinArticulo: `${may(NUMERAL[l.genero])} ${base} ${d.posesor} ${d.resto}.`, foco: def, nucleo: art, articulo: art };
    case 'adj':
    case 'dem':
      // Las dos meten algo entre el núcleo articulado y el genitivo: un
      // adjetivo o un demostrativo POSPUESTO. Es el mismo mecanismo —la
      // adyacencia se rompe— y por eso comparten construcción; van como
      // familias distintas porque la consigna y la cara de frontera que
      // enseñan no son la misma.
      return { fuente: pegado, sinArticulo: `${may(def)} ${d.adjetivo} ${d.posesor} ${d.resto}.`, foco: def, nucleo: art, articulo: art };
    case 'quita': {
      // La inversa de `indef`: la fuente lleva el artículo y la respuesta
      // no. El foco es la pieza que porta la determinación en la fuente y
      // el núcleo la que la porta en la respuesta — simétrico con las
      // otras tres, donde van al revés.
      const conArt = `${may(INDEF[l.genero])} ${base} ${art} ${d.posesor} ${d.resto}.`;
      return { fuente: conArt, sinArticulo: pegado, foco: art, nucleo: may(def), articulo: art };
    }
  }
}

/** Mete el artículo posesivo en la ranura: justo delante del poseedor. */
const conArticulo = (sinArticulo: string, posesor: string, forma: string) =>
  sinArticulo.replace(new RegExp(`(?<![\\p{L}-])${posesor}(?![\\p{L}-])`, 'u'), `${forma} ${posesor}`);

function construir(d: Decl): ItemTransRo & { d: Decl; sinArticulo: string; articulo: string } {
  const p = partes(d);
  const r = d.familia === 'quita' ? p.sinArticulo : conArticulo(p.sinArticulo, d.posesor, p.articulo);
  const l = lema(d.poseido);
  const consigna = d.familia === 'adj' || d.familia === 'dem'
    ? consignaAdj(d.precision!)
    : CONSIGNAS[d.familia](l.genero === 'f' ? 'f' : 'm');
  return {
    p: PUNTO, pasada: 1,
    s: p.fuente, instruccion: consigna, r, alt: d.alt,
    foco: p.foco, nucleo: p.nucleo,
    espejoEs: !!d.espejoEs, transparenteLatin: false,
    sobreaplicacion: d.sobreaplicacion,
    d, sinArticulo: p.sinArticulo, articulo: p.articulo,
  };
}

export const DECL: Decl[] = [
  // ══ TRES DE NÚCLEO INDEFINIDO — el tope está en TRES, y hay gate ═══
  // Con más, el invariante del lote sería «mete un/o» y el alumno sacaría
  // pleno sin ver ninguna de las otras configuraciones. Y es la única
  // familia con fuente en SINGULAR que exige el artículo: por eso aquí
  // `dintre` no tiene por dónde entrar (tendría que inventar un plural
  // que no está en la frase), y por eso la cuantificada murió y ésta no.
  {
    poseido: 'carte', numero: 'sg', familia: 'indef', posesor: 'Mariei', resto: 'stă pe masă',
    alt: ['O carte de-a Mariei stă pe masă.'],
    nota: 'la superficie ACIERTA (cartea → a) y el español FALLA («libro» es masculino y empujaría a `al`): mide la forma sólo contra el español',
  },
  {
    poseido: 'perete', numero: 'sg', familia: 'indef', posesor: gd('casă'), resto: 'este galben',
    nota: 'EL ÚNICO ÍTEM DEL LOTE QUE MIDE LA MITAD FORMA, y por eso el único pilar de esa mitad: `peretele` empuja a *ale por la terminación, «pared» empuja a *a por el género español, y la forma es `al`. El día que alguien lo retoque o lo sustituya, la mitad forma del punto se queda en CERO sin que nada falle. El predicado es de ESTADO porque `un perete al X` vive con predicados de estado, que es lo que enseña la ocurrencia del corpus («rezemat de un perete al vestibulului»); la v1 decía `are o fereastră` y chirriaba',
  },
  {
    poseido: 'câine', numero: 'sg', familia: 'indef', posesor: gd('bunic'), resto: 'doarme în curte',
    alt: ['Un câine de-al bunicului doarme în curte.'],
    nota: 'la superficie FALLA (`câinele` empuja a *ale) y el español acierta («perro», masculino): es la mitad del residuo que el género español rescata, y por eso hace falta el de `perete`. AVISO: la forma que un rumano produciría de verdad es la ALTERNATIVA declarada (`de-al`), no la clave; es el único ítem del lote cuya respuesta canónica no es la más idiomática',
  },

  // ══ TRES DE ELEMENTO INTERPUESTO, CON EL NÚCLEO DEFINIDO ══════════
  // Los mejores del lote: rompen la frontera falsa «definido ⇒ sin
  // artículo», el estímulo no contiene ninguna copia de la DECISIÓN, y la
  // omisión es la que el hispanohablante comete de verdad. Y `cel`
  // interpuesto rompe la adyacencia igual que el adjetivo desnudo, así
  // que las variantes con `cel` son rumano correcto Y llevan el artículo:
  // se declaran, y el ítem sigue midiendo su punto en todas.
  {
    poseido: 'frate', numero: 'sg', familia: 'adj', posesor: gd('vecin'), resto: 'lucrează mult',
    adjetivo: 'mai mic', precision: 'se trata del hermano MENOR',
    alt: ['Fratele cel mic al vecinului lucrează mult.', 'Fratele cel mai mic al vecinului lucrează mult.'],
    nota: 'poseído DEFINIDO y artículo obligatorio: la superficie falla (`fratele` → *ale) y el español acierta. Tres salidas correctas y no una: «MENOR» en español es ambiguo entre `mai mic` y `cel mai mic`, y `cel mic` es la tercera — las tres llevan `al`',
  },
  {
    poseido: 'copil', numero: 'pl', familia: 'adj', posesor: gd('profesor'), resto: 'dorm deja',
    adjetivo: 'mici', precision: 'los niños son PEQUEÑOS',
    alt: ['Copiii cei mici ai profesorului dorm deja.'],
    nota: 'la misma configuración en plural. ES EL ÍTEM MÁS FLOJO DEL LOTE y va escrito: de la mitad forma no mide nada, porque `ai` lo predicen las DOS rutas a la vez (el enclítico `Copiii` → -i, y «los niños» masculino). Sigue midiendo la distribución, que es el punto; si algún día hay que quitar uno, es éste',
  },
  {
    poseido: 'tren', numero: 'pl', familia: 'adj', posesor: gd('oraș'), resto: 'merg încet',
    adjetivo: 'noi', precision: 'los trenes son NUEVOS',
    alt: ['Trenurile cele noi ale orașului merg încet.'],
    nota: 'NEUTRO PLURAL, que es donde el español se equivoca solo: «trenes» es masculino y empuja a *ai, y la forma es `ale` porque el neutro rumano va con el femenino en plural. Sustituye al ítem cuantificado que el segundo ataque tumbó, y conserva su trampa SIN numeral: la fuente es plural DEFINIDA, así que `dintre` no tiene cuantificador del que colgar',
  },

  // ══ UNO DE DEMOSTRATIVO POSPUESTO ═════════════════════════════════
  // La cuarta configuración, y la que el diseño original no tenía. El
  // núcleo va definido y lo que rompe la adyacencia no es un adjetivo
  // sino un determinante. Atestado en el corpus del proyecto con UNA sola
  // ocurrencia, y hubo que leerla para saberlo: «părțile astea ale
  // Sucevei».
  {
    poseido: 'mașină', numero: 'pl', familia: 'dem', posesor: 'Mariei', resto: 'stau afară',
    adjetivo: 'acestea', precision: 'se trata de ESOS coches y no de otros',
    alt: ['Mașinile astea ale Mariei stau afară.'],
    nota: 'la cara de frontera que faltaba: el poseído lleva su artículo enclítico y el artículo posesivo hace falta igual, porque entre el núcleo y el genitivo se metió un determinante. Corpus, y con los aciertos LEÍDOS uno a uno porque las cadenas son homógrafas: la única atestación real es «părțile ASTEA ALE Sucevei»; `cartea aceasta a` y `acestea ale` dan cero con límite de palabra y sus supuestos aciertos eran «acuma», «Agata» y «alergaseră». Va en PLURAL y no en singular por aritmética, no por gusto: en singular la estrategia compuesta lo acertaba y subía a 5/9, por encima del tope; en plural el enclítico acaba en -e, la compuesta se va por el español («coches» es masculino) y falla. `Aceste mașini ale Mariei` es rumano correcto y también exige el artículo, pero la consigna dice «justo detrás» y lo excluye',
  },

  // ══ DOS DE SOBREAPLICACIÓN — la frontera, y son ESPEJO ════════════
  // §0.6: sin ellos el alumno aprende «pon siempre al/a/ai/ale», saca
  // pleno y luego escribe *Prietenul al băiatului. Van dos y no cuatro
  // porque son gratis por DOS vías: traducir del español los da enteros, y
  // el atajo inverso (`al`→-ul, `a`→-a) es la tabla del artículo
  // enclítico, o sea `r2-articulo-enclitico-sg` con otro envoltorio.
  {
    poseido: 'prieten', numero: 'sg', familia: 'quita', posesor: gd('băiat'), resto: 'lucrează aici',
    espejoEs: true, sobreaplicacion: true,
    nota: 'la configuración [N+enclítico]+[Gen] pegados, que es la única sin artículo posesivo',
  },
  {
    poseido: 'fotografie', numero: 'sg', familia: 'quita', posesor: gd('mamă'), resto: 'stă pe birou',
    espejoEs: true, sobreaplicacion: true,
    nota: 'la misma frontera en femenino, para que no se aprenda como una propiedad del masculino. El lema es de los pocos que sirven: un femenino en -ă tiene el definido HOMÓGRAFO del indefinido en cuanto se le quitan los diacríticos (mașină/mașina), así que el gate del núcleo copiado lo rechazaría; los femeninos en -e y en -ie no',
  },
];

/** UNA sola construcción, y `ITEMS` es la MISMA lista vista con el tipo
 *  de la máquina. Construirla dos veces sería la copia N+1 de siempre:
 *  las estrategias buscan por la fuente normalizada, así que dos listas
 *  paralelas funcionarían hasta el día en que dejaran de coincidir y
 *  nada fallaría. */
const CONSTRUIDOS = DECL.map(construir);
export const ITEMS: ItemTransRo[] = CONSTRUIDOS;

// ══ LAS ESTRATEGIAS, ESCRITAS PARA EJECUTARLAS ═══════════════════════
// Todas van contra la RESPUESTA y no contra el núcleo, y es deliberado:
// el núcleo de este punto es una palabra de dos letras, así que una
// estrategia que sólo la acierte NO ha contestado el ítem. Medir contra el
// producto es lo único que responde a «¿la tarjeta se la daría por
// buena?».

const porFuente = new Map(CONSTRUIDOS.map((x) => [norm(x.s), x]));
const deLaVista = (s: string) => porFuente.get(norm(s));

/** El que traduce del español: hace la operación y NO pone nada, porque el
 *  español no tiene ninguna pieza que ocupe ese hueco. Acierta la familia
 *  `quita` entera y nada más — que es exactamente lo que dice el campo
 *  `espejoEs` de esos dos ítems, medido en vez de declarado. */
export const CALCO_ES: Estrategia = {
  nombre: 'traducir del español: hacer la operación y no poner nada',
  objetivo: 'respuesta',
  aplicar: (v) => deLaVista(v.s)?.sinArticulo ?? null,
};

/** «a» + la terminación del artículo enclítico del poseído, leída de la
 *  FUENTE. No es un truco: `al/a/ai/ale` y el enclítico son dos exponentes
 *  del mismo rasgo, y por eso acierta 138 de 142 celdas del lexicón. Aquí
 *  se le añade la única decisión que el atajo no puede tomar —poner o no
 *  poner—, y se le da la versión generosa: pone SIEMPRE. */
export const superficieDe = (forma: string): string => {
  const f = norm(forma);
  if (f.endsWith('le')) return 'ale';
  if (/ii$|[^l]i$/.test(f)) return 'ai';
  if (f.endsWith('l')) return 'al';
  if (f.endsWith('a')) return 'a';
  return 'al';
};
export const SUPERFICIE: Estrategia = {
  nombre: 'la superficie: «a» + la terminación del enclítico, y ponerlo siempre',
  objetivo: 'respuesta',
  aplicar(v) {
    const x = deLaVista(v.s);
    return x ? conArticulo(x.sinArticulo, x.d.posesor, superficieDe(v.foco)) : null;
  },
};

/** El género del ESPAÑOL, que en este punto no es un atajo cualquiera: el
 *  español concuerda el artículo con lo poseído igual que el rumano («el
 *  de Juan», «las de Juan»), así que la ruta existe y funciona. Falla sólo
 *  donde los dos géneros discrepan. */
const GENERO_ES: Record<string, 'm' | 'f'> = {
  carte: 'm',      // «libro»
  perete: 'f',     // «pared»  ← el lema del lote
  câine: 'm',      // «perro»
  prieten: 'm',    // «amigo»
  telefon: 'm',    // «teléfono»
  frate: 'm',      // «hermano»
  copil: 'm',      // «niño»
  tren: 'm',       // «tren»
  mașină: 'm',     // «coche»   ← el género discrepa
  fotografie: 'f', // «foto»
};
export const ESPANOL: Estrategia = {
  nombre: 'el género del español, y ponerlo siempre',
  objetivo: 'respuesta',
  aplicar(v) {
    const x = deLaVista(v.s);
    if (!x) return null;
    const g = GENERO_ES[x.d.poseido];
    if (!g) return null;
    return conArticulo(x.sinArticulo, x.d.posesor, articolPosesiv(g, x.d.numero));
  },
};

/** El error que el `motivo` viejo del punto declaraba y que el dictamen
 *  quitó: concordar con el POSEEDOR. Se ejecuta igualmente, porque una
 *  afirmación sobre lo que el alumno no hace también se mide. */
export const CON_EL_POSEEDOR: Estrategia = {
  nombre: 'concordar con el POSEEDOR en vez de con lo poseído',
  objetivo: 'respuesta',
  aplicar(v) {
    const x = deLaVista(v.s);
    if (!x) return null;
    // El poseedor es un genitivo singular en todos los ítems; su género
    // sale del lexicón, y `Mariei` es femenino.
    const l = SUSTANTIVOS_A1.find((y) => genitivoDativo(y, 'sg', true) === x.d.posesor);
    const g = l ? l.genero : 'f';
    return conArticulo(x.sinArticulo, x.d.posesor, articolPosesiv(g, 'sg'));
  },
};

/** La forma más frecuente del lote, puesta siempre. Es la estrategia
 *  constante, y va escrita porque un lote cargado a una casilla la
 *  regala. */
/** LA COMPOSICIÓN QUE LA BÚSQUEDA NO PROBÓ, y la encontró el lingüista.
 *
 *  «Si la palabra enfocada acaba en -e, usa el género del español; si no,
 *  “a” + la terminación del enclítico.» Sobre la v1 de este lote acertaba
 *  **8 de 9**, muy por encima del 6/9 que daba mi barrido — porque la
 *  pista que la gobierna **no estaba en mi lista**: no es una propiedad
 *  de la consigna ni del formato, es **la terminación del lema
 *  enfocado**. Ahora está, y la composición va además declarada para que
 *  su número se imprima siempre.
 *
 *  **Y lo que significa, que no es lo que parece:** la estrategia
 *  PRESUPONE que el alumno ya decidió poner el artículo, y esa decisión
 *  es el contenido del punto y no es gratis (traducir del español acierta
 *  2/9, y son justo los dos ítems donde no hay que poner nada). O sea que
 *  el 8/9 no es la nota de quien llega sin saber: es la de quien aprendió
 *  la DISTRIBUCIÓN y atajó la FORMA. Es la misma conclusión que el
 *  dictamen previo, por otro camino: **la capacidad discriminante de este
 *  lote sobre la forma es UN ítem, el de `perete`.** De ahí la regla que
 *  hereda el siguiente: **no añadir NUNCA a este punto un ítem que sólo
 *  pida elegir entre al/a/ai/ale — no mediría nada.** */
export const COMPUESTA_E: Estrategia = {
  nombre: 'compuesta: el género del español si el lema acaba en -e, y si no la superficie',
  objetivo: 'respuesta',
  aplicar(v) {
    const x = deLaVista(v.s);
    if (!x) return null;
    const g = GENERO_ES[x.d.poseido];
    const f = norm(v.foco).endsWith('e') && g ? articolPosesiv(g, x.d.numero) : superficieDe(v.foco);
    return conArticulo(x.sinArticulo, x.d.posesor, f);
  },
};

export const SIEMPRE_AL: Estrategia = {
  nombre: 'poner siempre «al»',
  objetivo: 'respuesta',
  aplicar(v) {
    const x = deLaVista(v.s);
    return x ? conArticulo(x.sinArticulo, x.d.posesor, 'al') : null;
  },
};

// ══ LA BÚSQUEDA DE COMPOSICIONES, Y POR QUÉ NO VALE EL 50 % ══════════
//
// Orden del coordinador del 2026-09-04, y corrige una instrucción suya
// anterior: **el tope del 50 % vale para una estrategia DECLARADA de
// antemano, no para el máximo sobre un espacio de estrategias que se
// busca.** Con k pistas binarias, la mejor de k pasa del 50 % por puro
// azar, así que exigirle 50 % a un máximo garantiza el hallazgo falso —
// es la maldición del ganador. El criterio es la nula por PERMUTACIÓN,
// con semilla fija, y vive en `scripts/lib/composiciones.ts`, que se
// IMPORTA y no se copia.
//
// El espacio de respuestas es {al, a, ai, ale, ∅}: el `∅` no es un vacío
// sino una respuesta, porque «no poner nada» es la decisión correcta en
// dos ítems y `buscarComposiciones` descarta la cadena vacía.
const NADA = '∅';
const correcta = (x: (typeof CONSTRUIDOS)[number]) => (x.d.familia === 'quita' ? NADA : x.articulo);

const ciegas = [
  { nombre: 'poner ∅', responde: () => NADA },
  ...(['al', 'a', 'ai', 'ale'] as const).map((f) => ({ nombre: `poner siempre «${f}»`, responde: () => f })),
  { nombre: 'la superficie del enclítico', responde: (x: (typeof CONSTRUIDOS)[number]) => superficieDe(x.foco) },
  {
    nombre: 'el género del español',
    responde: (x: (typeof CONSTRUIDOS)[number]) => {
      const g = GENERO_ES[x.d.poseido];
      return g ? articolPosesiv(g, x.d.numero) : '';
    },
  },
];

/** LAS PISTAS. Es la parte que hay que revisar a mano: una pista sólo
 *  cuenta si el alumno la ve SIN saber el punto. Todas éstas son de
 *  superficie —cómo acaba la palabra, qué determinante lleva, qué le pide
 *  la consigna— y ninguna exige saber género rumano ni la regla de
 *  adyacencia. */
const pistas = [
  { nombre: 'lo poseído lleva el artículo pegado', vale: (x: (typeof CONSTRUIDOS)[number]) => x.d.familia !== 'quita' },
  { nombre: 'lo poseído va en plural', vale: (x: (typeof CONSTRUIDOS)[number]) => x.d.numero === 'pl' },
  { nombre: 'la forma de lo poseído acaba en -le', vale: (x: (typeof CONSTRUIDOS)[number]) => norm(x.foco).endsWith('le') },
  { nombre: 'la forma de lo poseído acaba en -i', vale: (x: (typeof CONSTRUIDOS)[number]) => /i$/.test(norm(x.foco)) },
  { nombre: 'la consigna habla de dos', vale: (x: (typeof CONSTRUIDOS)[number]) => x.d.familia === 'cuant' },
  { nombre: 'la consigna pide meter una precisión', vale: (x: (typeof CONSTRUIDOS)[number]) => x.d.familia === 'adj' },
  { nombre: 'la consigna dice «el que ya se conocía»', vale: (x: (typeof CONSTRUIDOS)[number]) => x.d.familia === 'quita' },
  // LA PISTA QUE FALTABA, y con ella el barrido pasó de 6/9 a encontrar
  // la composición de 7/9. No se me ocurrió porque no es una propiedad de
  // la consigna ni del formato —que era por donde yo miraba— sino de la
  // PALABRA: cómo acaba el lema enfocado. La lista de pistas es la parte
  // que hay que revisar a mano, y ésta la revisó el lingüista.
  { nombre: 'el lema enfocado acaba en -e', vale: (x: (typeof CONSTRUIDOS)[number]) => norm(x.foco).endsWith('e') },
];

/** Se exportan las tres piezas —respuesta correcta, estrategias ciegas y
 *  pistas— para que el TESTIGO ROJO pueda correr la misma búsqueda sobre
 *  un lote con un atajo PLANTADO. Un contraste que sólo se ha visto decir
 *  «no hay atajo» es indistinguible de uno que no sabe decir otra cosa
 *  (§4.18), y con n = 9 la nula es ancha: hace falta ver el rojo. */
export const BUSQUEDA = { correcta, ciegas, pistas };
export const VEREDICTO = contrastarComposiciones(CONSTRUIDOS, correcta, ciegas, pistas);

// ══ LOS GATES PROPIOS DEL PUNTO ══════════════════════════════════════

export type Construido = ReturnType<typeof construir>;

/** Los gates del punto, sobre la lista que se les PASA. La primera versión
 *  leía `CONSTRUIDOS` de módulo y no miraba su argumento: eso la hacía
 *  imposible de ver en rojo, que es el defecto que persigue el §4.18. */
export function revisar(xs: readonly Construido[]): string[] {
  const v: string[] = [];

  // 1 · LA RESPUESTA SE DERIVA, NO SE ESCRIBE. Es el gate que impide que
  //     la clave y el paradigma se separen sin que nada falle.
  for (const x of xs) {
    const esperada = x.d.familia === 'quita'
      ? x.sinArticulo
      : conArticulo(x.sinArticulo, x.d.posesor, articolPosesiv(lema(x.d.poseido).genero, x.d.numero));
    if (x.r !== esperada) v.push(`${x.d.poseido}: la respuesta «${x.r}» no es la que deriva el paradigma («${esperada}»)`);
  }

  // 2 · NI PERFECT COMPUS DE 3.ª SG NI DE 2.ª SG EN EL ESTÍMULO. `a` y
  //     `ai` son homógrafos del auxiliar, así que un estímulo así mete en
  //     la frase una copia de la cadena que hay que producir. El gate es
  //     estructural y no léxico, porque Hunspell aprueba las dos.
  for (const x of xs) {
    const sueltas = (norm(x.s).match(/(?<![\p{L}\p{N}-])(a|ai|al|ale)(?![\p{L}\p{N}-])/gu) ?? []);
    const permitidas = x.d.familia === 'quita' ? 1 : 0;
    if (sueltas.length > permitidas)
      v.push(`${x.d.poseido}: el estímulo lleva ${sueltas.length} cadena(s) «${sueltas.join(', ')}» sueltas y sólo se admiten ${permitidas} — homografía con el auxiliar de perfect compus`);
  }

  // 3 · NADA DE COORDINACIÓN DE GENITIVOS: las dos lecturas son
  //     gramaticales y el estímulo no da la que las separa.
  //     ⚠ El patrón busca `si` y NO `și`: `norm()` quita los diacríticos,
  //     así que la primera versión —escrita con la ș— no disparaba nunca
  //     y el lote imprimía «Limpio» igual. Lo cazó el testigo rojo, que
  //     es exactamente el §4.18 en el primer intento.
  const coordinado = (t: string) => /(^|\s)si(\s|$)/.test(norm(t));
  for (const x of xs)
    if (coordinado(x.s) || coordinado(x.r))
      v.push(`${x.d.poseido}: hay coordinación con «și», y el genitivo coordinado tiene dos lecturas gramaticales`);

  // 4 · EL TOPE DE LA FAMILIA `indef`. Sin él, el lote enseñaría una sola
  //     configuración y el alumno sacaría pleno sin ver las otras tres —
  //     el defecto de `r2-numerales-de` calcado.
  // 4bis · LA FAMILIA CUANTIFICADA NO PUEDE VOLVER. Es un invariante y no
  //     una nota en un comentario, porque una norma escrita se hereda mal
  //     y ésta costó dos ítems ya escritos: con la fuente en plural
  //     definido, `Doi DINTRE prietenii Mariei vin mâine` cumple la
  //     consigna letra por letra, es rumano estándar y NO lleva artículo
  //     posesivo — la clave suspendía la respuesta que demuestra que el
  //     alumno entendió la adyacencia.
  for (const x of xs)
    if (x.d.familia === 'cuant')
      v.push(`${x.d.poseido}: núcleo cuantificado — la fuente en plural definido regala el conjunto presupuesto y «doi dintre …» contesta la consigna SIN artículo posesivo`);

  const indef = xs.filter((x) => x.d.familia === 'indef').length;
  if (indef > 3) v.push(`FAMILIA: ${indef} ítems de «indefinitivizar» y el tope es 3 — con más, el invariante del lote es la operación y no la regla`);
  const familias = new Set(xs.map((x) => x.d.familia));
  if (familias.size < 4) v.push(`FAMILIA: sólo ${familias.size} configuraciones; la regla es de ADYACENCIA y una sola configuración no la enseña`);

  // 5 · TODO PLURAL INDEFINIDO VA CON NUMERAL: `niște caiete ale…` y
  //     `caiete ale…` son las dos correctas, o sea dos salidas para una
  //     clave exacta.
  for (const x of xs)
    if (/(^|\s)niste(\s|$)/.test(norm(x.r))) v.push(`${x.d.poseido}: la respuesta lleva «niște» y el plural escueto es igual de correcto`);

  // 6 · LA BÚSQUEDA DE COMPOSICIONES, contra la nula por permutación.
  const ver = contrastarComposiciones([...xs], correcta, ciegas, pistas);
  if (ver.hayAtajo)
    v.push(`COMPOSICIÓN GANADORA: «${ver.mejor.regla}» acierta ${ver.mejor.acierta}/${ver.mejor.de}, por encima del percentil 95 de la nula (${(100 * ver.nulaP95).toFixed(0)} %), p = ${ver.p.toFixed(3)}`);

  return v;
}

const gatesPropios = (items: readonly ItemTransRo[]): string[] => [
  ...(items.length === CONSTRUIDOS.length ? [] : ['el lote y la declaración se han desincronizado']),
  ...revisar(CONSTRUIDOS),
];

// ══ LAS AFIRMACIONES DEL LOTE, CONTRA LOS 2,9 M DE PALABRAS ══════════
//
// ⚠ Los patrones son LARGOS a propósito. `a`, `al`, `ai` y `ale` son las
// cadenas más homógrafas del rumano —auxiliar de perfect compus, «tienes»,
// el ordinal `al doilea`, la preposición— así que un recuento de la cadena
// suelta contaría cualquier cosa. Cada patrón de aquí lleva delante un
// núcleo nominal o un numeral, que fija la lectura genitival.
export const COMPROBACIONES: Comprobacion[] = [
  // LA CONFIGURACIÓN DE NÚCLEO INDEFINIDO, y con el lema pilar del lote.
  { afirmacion: 'núcleo indefinido masculino: «un perete al vestibulului» (Caragiale), que atesta a la vez el lema `perete` como masculino', patron: 'un perete al', espera: 'presente' },
  { afirmacion: 'y con otros núcleos indefinidos masculinos', patron: 'un (prieten|frate|fiu) al', espera: 'presente' },
  { afirmacion: 'núcleo indefinido femenino', patron: '(o carte a|o fată a|o casă a)', espera: 'presente' },
  // LA CONFIGURACIÓN CUANTIFICADA, que EXISTE y que este lote NO puede
  // usar: se comprueba porque la prosa del punto la afirma, y una
  // afirmación que no se pone delante del corpus es la que se hereda
  // falsa. Lo que la deja fuera del lote no es la lengua, es que
  // «doi DINTRE prietenii Mariei» contesta la consigna sin artículo.
  { afirmacion: 'núcleo cuantificado masculino: «doi fii ai», «doi prieteni ai» — configuración real, inutilizable en este formato', patron: 'doi (fii|prieteni) ai', espera: 'presente' },
  { afirmacion: 'y cuantificado femenino: «trei fete ale»', patron: 'trei fete ale', espera: 'presente' },
  // LA CONFIGURACIÓN DEL DEMOSTRATIVO POSPUESTO, que es el ítem 7 y la
  // cara de frontera que el diseño original no tenía.
  // ⚠ AQUÍ SE PAGÓ EL §0.7 OTRA VEZ, Y CONVIENE QUE QUEDE ESCRITO. La
  // primera versión de esta comprobación declaraba `cartea aceasta a` (2)
  // y `casa aceasta a` (1) y `acestea ale` (1), sacados de la CLI del
  // corpus, que busca SIN límite de palabra. Con límite dan CERO las
  // tres: leídas una a una, las apariciones eran «cartea aceasta ACUMA»,
  // «citea din cartea aceasta AGATA», «în casa aceasta AR fi crescut» y
  // «bucățelele acestea ALERGASERĂ». Cuatro homógrafos y ni una
  // atestación. La única real del corpus es ésta, y es justo la
  // configuración del ítem 7 —plural, demostrativo pospuesto, `ale`,
  // genitivo—: «Ce gospodării frumoase sunt prin părțile ASTEA ALE
  // Sucevei!» (Sadoveanu). Por eso la clave del ítem va en plural y por
  // eso `astea` está declarada como alternativa.
  { afirmacion: 'demostrativo pospuesto + artículo posesivo + genitivo: «părțile astea ale Sucevei» — la ÚNICA atestación real del corpus, leída una a una', patron: 'astea ale', espera: 'presente' },
  // `cel` INTERPUESTO TAMBIÉN ROMPE LA ADYACENCIA, y por eso las
  // variantes con `cel`/`cei`/`cele` van en las alternativas: llevan el
  // artículo igual, así que el ítem sigue midiendo su punto.
  { afirmacion: '«cel» interpuesto exige el artículo igual que el adjetivo desnudo, también en plural: «cele mari ale»', patron: 'cele mari ale', espera: 'presente' },
  // LA CONFIGURACIÓN QUE TUMBA LA FRONTERA FALSA: poseído DEFINIDO, con
  // algo interpuesto, y el artículo posesivo OBLIGATORIO.
  { afirmacion: 'poseído DEFINIDO con adjetivo interpuesto: «mâna dreaptă a»', patron: 'mâna dreaptă a', espera: 'presente' },
  { afirmacion: 'y con el adjetivo articulado por `cel`: «fiul cel mic al», «fata cea mare a»', patron: '(fiul cel mic al|fata cea mare a)', espera: 'presente' },
  // LA CONFIGURACIÓN PREDICATIVA, que este lote NO usa y que la
  // descripción del punto sí declara: se comprueba porque la prosa la
  // afirma, y una afirmación sin comprobar es la que se hereda falsa.
  { afirmacion: 'predicativo con cópula: «e a lui», «este a lui»', patron: '(e|este) a lui', espera: 'presente' },
  // EL PLURAL INDEFINIDO SIN NUMERAL, que es la salida que el lote se
  // prohíbe: se comprueba que EXISTE, no que esté mal.
  { afirmacion: 'el plural escueto con artículo posesivo existe («flori ale», «case ale», «cuvinte ale»): por eso el lote no publica plural sin numeral', patron: '(flori|case|cuvinte) ale', espera: 'presente' },
  // Y EL COMPETIDOR `de-a/de-ale`, que va declarado en `alternatives`.
  { afirmacion: 'el partitivo «de-al / de-ai / de-ale» es lengua viva, y por eso va en las alternativas y no se suspende', patron: 'de-(al|ai|ale|a lui)', espera: 'presente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  estrategias: [CALCO_ES, SUPERFICIE, ESPANOL, COMPUESTA_E, CON_EL_POSEEDOR, SIEMPRE_AL],
  gatesPropios,
  juicios: {
    copia: 'CERO de nueve se contestan copiando el foco, y aquí eso no significa lo que significaba en los lotes 23 y 24: el foco y el núcleo no son dos formas del MISMO verbo sino dos piezas distintas de la frase —el sustantivo poseído y la partícula—, así que «copiar el foco» no es una estrategia que ningún alumno pueda ejecutar y su cero no dice nada. La pregunta equivalente en este punto es otra: ¿cuántos ítems se contestan sin poner nada? DOS de nueve, y son los de la familia `quita`, declarados `espejoEs` porque traducir del español los da enteros. Ni cero ni nueve valdrían: con cero, el lote enseñaría «pon siempre al/a/ai/ale» y el alumno escribiría *Prietenul al băiatului; con más de dos, la mitad del lote se contestaría traduciendo. Medido ejecutando: traducir del español 2/9, copiar la frase entera 0/9, la edición modal del lote 0/9.',
    frontera: 'La frontera de este punto NO es «definido frente a indefinido» —eso era media regla y el dictamen del 2026-09-04 la tumbó—: es la ADYACENCIA. El artículo posesivo falta sólo en la configuración [núcleo + artículo enclítico] + [genitivo] PEGADOS, y los dos ítems de `quita` son ésa, marcados `sobreaplicacion`: el alumno que aprenda «pon siempre al/a/ai/ale» escribe *Prietenul al băiatului y *Fotografia a mamei. Pero la frontera tiene DOS caras y la segunda es la que faltaba en la descripción del punto: con el poseído DEFINIDO el artículo es OBLIGATORIO en cuanto algo se mete en medio, y cuatro ítems son eso — tres con un adjetivo interpuesto (Fratele mai mic AL vecinului, Copiii mici AI profesorului, Trenurile noi ALE orașului) y uno con un demostrativo pospuesto (Mașinile acestea ALE Mariei). Sin ellos, el lote enseñaría la regla falsa «si lleva artículo pegado, no pongas nada», que es la que la propia descripción del inventario inducía y que ningún ítem del diseño original habría desmentido. Y las dos configuraciones que el lote NO trae —el predicativo (cartea este a Mariei) y el cuantificado (doi prieteni ai Mariei)— no dejan la regla mutilada: un alumno que generalice «ponlo salvo cuando el genitivo toca a la forma que lleva el enclítico» las acierta sin haberlas visto, porque la regla que se induce de estos nueve es LA regla. Es un hueco de cobertura, no un error, y va escrito con su motivo: el cuantificado está PROHIBIDO por gate, porque con la fuente en plural definido «doi DINTRE prietenii Mariei» contesta la consigna letra por letra sin artículo posesivo.',
    varianza: 'Lo que varía entre los nueve, y ES el punto, es la CONFIGURACIÓN: núcleo indefinido (3), elemento interpuesto con el núcleo definido —adjetivo (3) y demostrativo pospuesto (1)— y genitivo pegado al núcleo articulado (2). Ninguna pieza de la operación llega al umbral de invariancia porque las formas se reparten (al 3, ale 2, a 1, ai 1, nada 2) y los poseedores son siete distintos. LO QUE ESTE LOTE NO MIDE, Y VA ESCRITO PORQUE ES LA MITAD QUE PARECÍA EL PUNTO: la elección de la FORMA está gratis en ocho de los nueve ítems, por dos rutas que se componen —la terminación del artículo enclítico, que acierta 138 de 142 celdas del lexicón, y el género del español, que ya concuerda con lo poseído y rescata donde la otra falla—. El ÚNICO ítem donde las dos fallan a la vez es el de `perete`, porque su enclítico es `-le` y «pared» es femenino en español. Es UN ítem, no ocho, y de ahí las dos reglas que hereda el siguiente lote de este punto: el ítem de `perete` es el único pilar de la mitad forma —si alguien lo retoca o lo sustituye, esa mitad se queda en CERO sin que nada falle— y NUNCA hay que añadir aquí un ítem que sólo pida elegir entre al/a/ai/ale, porque no mediría nada. Por eso el punto se re-encuadró de «elige la forma» a «decide si hace falta»: lo que los nueve miden es la SUBPRODUCCIÓN, que es lo único que este formato ve y lo único que el español no regala. La mitad de la forma vuelve entera en B2 con `r11-relativo-declinado`, que declara este punto como prerrequisito. Y DOS PRECIOS DECLARADOS. El primero se pagó y se cobró: la v1 pedía además el numeral neutro (`două telefoane`), que es `r2-genero-tres-valores`, y el ítem se perdía por un motivo ajeno al punto; se fue con la familia cuantificada. El segundo NO existe, contra lo que este mismo juicio decía en la v1: ninguno de los nueve pide PRODUCIR el genitivo del poseedor —los siete van escritos en la fuente y se copian carácter a carácter—, así que no hay co-requisito de `r4-gd-definido-sg` ni error inatribuible, y el eje `lui` frente al genitivo sintético queda cerrado de golpe. Y el ítem más flojo va nombrado: el de `copil`, cuya forma `ai` la predicen las dos rutas a la vez; mide la distribución y nada más, y si algún día hay que quitar uno es ése.',
  },
};

if (/[/\\]trans-ro-l25\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 25 · transformación · ${ITEMS.length} ítems · ${PUNTO}\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const x of CONSTRUIDOS)
    console.log(`- [${x.d.familia}] \`${x.s}\` → \`${x.r}\`  (${x.foco} → ${x.nucleo})`);
  console.log('');
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  console.log('\n**La búsqueda de composiciones, contra la nula por permutación (semilla fija):**\n');
  console.log(`- mejor: «${VEREDICTO.mejor.regla}» ${VEREDICTO.mejor.acierta}/${VEREDICTO.mejor.de} (${(100 * VEREDICTO.mejor.tasa).toFixed(0)} %)`);
  console.log(`- percentil 95 de la nula: ${(100 * VEREDICTO.nulaP95).toFixed(0)} % · p = ${VEREDICTO.p.toFixed(3)} · ¿atajo? **${VEREDICTO.hayAtajo ? 'SÍ' : 'no'}**`);
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}

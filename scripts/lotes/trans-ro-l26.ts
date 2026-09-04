// scripts/lotes/trans-ro-l26.ts — LOTE 26: `r2-genero-tres-valores`.
//
//   npx tsx scripts/lotes/trans-ro-l26.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l26.ts --asigna   # a qué punto cuenta cada ítem
//
// Cuarto punto de la máquina de transformación, y el segundo que llega
// con el punto RE-ENCUADRADO antes de escribir un ítem. El dictamen del
// lingüista adversarial del 2026-09-04 —pedido como PRECONDICIÓN— dio la
// vuelta a dos tercios del diseño que traía, y la parte que confirmó la
// confirmó por una razón distinta de la mía.
//
// ══ 1 · EL NEUTRO NO TIENE NINGUNA FORMA PROPIA ══════════════════════
//
// El *ambigen* se define por DISTRIBUCIÓN, no por forma (GALR I,
// *Substantivul · Genul*; GBLR 2010): ni el indefinido (`un tren` = `un
// elev`), ni el enclítico (`trenul` = `elevul`), ni el genitivo-dativo
// (`trenului` = `elevului`), ni el demostrativo (`acest tren` = `acest
// elev`) separan masculino de neutro en SINGULAR. De ahí la consecuencia
// que decide el lote entero:
//
//   > **Ninguna casilla del singular puede discriminar masculino de
//   > neutro. El punto vive entero en el plural, y ahí es BINARIO.**
//
// Eso mata de golpe tres diseños que parecían buenos: el que va de plural
// a singular (la respuesta es `un` para masculino Y para neutro, o sea
// que sólo distingue femenino de no-femenino), el que usa `*o oraș` como
// diana (mismo defecto: el neutro no participa) y el del demostrativo
// (`acest/această/acești/aceste` mapea 1:1 contra este/esta/estos/estas,
// igual de calcable que el adjetivo).
//
// ══ 2 · LO QUE ESTE PUNTO NO PUEDE EXAMINAR, PORQUE YA ESTÁ PAGADO ═══
//
// `r2-concordancia-adjetivo` tiene sus OCHO ítems en la casilla del
// adjetivo en plural neutro (`Sunt două trenuri buni` → `bune`). Repetir
// eso aquí sería la tercera duplicación del proyecto (§4.20). Y el error
// `*două trenuri buni` **presupone que el alumno ya acertó `două`**, o sea
// que ya clasificó bien el sustantivo: es de un estadio posterior y su
// casa es aquél, no éste.
//
// Lo que queda —y el lingüista corrigió que NO es «un resto», es lo único
// que puede quedar— es **el numeral `doi`/`două`**, y su valor está en una
// propiedad que ninguna otra casilla del lote tiene:
//
//   > **«dos» es INVARIABLE en español. Es la única casilla del punto
//   > donde la L1 no puede ni acertar ni fallar: sólo callarse.**
//
// Frente al adjetivo, donde el español provee activamente una respuesta
// equivocada («buenos»), aquí no provee ninguna. Por eso el numeral gana a
// `mult`, `tot`, `alt`, `câți`, los ordinales y el posesivo.
//
// ══ 3 · Y LO QUE NO ESTÁ COBRADO PERO SÍ DECLARADO EN OTRO SITIO ═════
//
// `r2-numerales-de` declara en su propia descripción «doi/două concuerda
// en género», y el lote 25 construye respuestas con un `NUMERAL` escrito a
// mano. En los dos el numeral es RELLENO; aquí es la variable examinada.
// Queda escrito para que el próximo auditor no lo lea como duplicado — y
// esa copia a mano se ha retirado: `numeralDos()` vive ahora en
// `paradigma-ro.ts` junto a `concordanciaDe()`, que es la regla del
// ambigen escrita UNA vez para las tres piezas que la usaban sin nombre.
//
// ══ 4 · EL ATAJO DE SUPERFICIE QUE DECIDE LA DIRECCIÓN ═══════════════
//
// Medido sobre el lexicón entero antes de escribir nada, y confirmado con
// fuente por el lingüista (DOOM3; GALR I): **dentro del par {masculino,
// neutro} la desinencia de plural es un discriminador SIN EXCEPCIONES** —
// masculino en `-i` (24 de 24 del lexicón), neutro en `-e` o `-uri` (14 de
// 14), ningún masculino en `-e`, ningún neutro en `-i`. Lo que la rompe es
// el FEMENINO, que solapa con las tres (`case`, `cărți`, y `vremuri`,
// `treburi`, `mărfuri` en `-uri`: **`-uri` NO es marca de neutro**, y
// publicar esa regla se paga después).
//
// Consecuencia operativa: **en cuanto la forma PLURAL es visible, el ítem
// se contesta leyendo la desinencia y mide `r2-plural-i-e-uri`.** Por eso
// la fuente va en SINGULAR y no hay ni un ítem con la fuente en plural, ni
// desnuda ni articulada.
//
// Y el precio no es el que parecía: obligar a recuperar el plural NO
// arrastra `r2-plural-i-e-uri` como prerrequisito accidental, porque para
// masculino y neutro **la clase de plural y el género son el mismo hecho
// léxico almacenado**. Se distingue de aquel punto en que allí la clase va
// IMPRESA en la pista («tren — plural (neutro en -uri)») y el numeral
// concordado ya está escrito en la frase (`Sunt două ___ (tren)`); aquí no
// se imprime nada. Es la diferencia entre aplicar una clase y recuperarla,
// y es exactamente lo que dice la `cita` del currículo: «clasificar
// sustantivos NUEVOS».
//
// ══ 5 · LA ARITMÉTICA, QUE FIJA EL LOTE ANTES QUE LA PEDAGOGÍA ═══════
//
// Con la fuente en singular indefinido y `M`, `F`, `N` los sustantivos de
// cada género:
//
//   · **A** «pon siempre `două`» acierta `N+F`;
//   · **C** «si la fuente lleva `un` di `doi`, si lleva `o` di `două`»
//     acierta `M+F` — porque **el artículo de la fuente delata el
//     femenino**.
//
// `A ≤ n/2` y `C ≤ n/2` sumadas dan **`F ≤ 0`**: el lote no puede llevar ni
// un femenino. Y eso no es un obstáculo, es el resultado: con `F = 0` la
// fuente siempre lleva `un`, C colapsa sobre «pon siempre `doi`», y con
// `M = N = 4` las dos constantes quedan **exactamente en el 50 %**. Con
// respuesta binaria las dos suman 100 %, así que **el 50 % es el suelo
// teórico y no un defecto**: cualquier diseño que prometa margen por
// debajo en este punto está midiendo otra cosa. Es el corolario del §4.35
// que ya fijó el tamaño del lote 24.
//
// Excluir el femenino es además correcto por CONTENIDO: un femenino sólo
// entra por la vía `o … → două …`, que es femenino frente a no-femenino,
// la oposición de dos valores que el español ya tiene. No enseña el
// ambigen, y `r2-articulo-indefinido` ya lleva el femenino.
//
// ══ 6 · LA MITAD QUE AÑADÍ AL DICTAMEN, Y EL MOTIVO QUE ESCRIBÍ MAL ══
//
// El dictamen daba los cuatro neutros con traducción española MASCULINA
// (`tren`, `telefon`, `metrou`, `nume`) y afirmaba que así el espejo del
// español sale «0/4 por construcción». Eso deja el espejo en 3/8 y su
// INVERSO —«haz lo contrario de lo que dice el español»— en 5/8, por
// encima del tope. Nadie llega de casa invirtiendo su propia lengua, pero
// es la regla que un lote MAL REPARTIDO enseña, y el daño es sobre el
// intervalo del FSRS (§4.34). Así que salió `metrou` y entró `oraș`,
// neutro con traducción española FEMENINA, y el espejo y su inverso
// quedaron los dos en 4/8.
//
// **Y el motivo que escribí para justificarlo era FALSO**, lo cazó el
// segundo ataque, y queda aquí corregido porque es lo que leerá el
// siguiente. Escribí que sin `oraș` el inverso pasa el tope, y eso sólo es
// cierto **manteniendo `perete` fijo**: hay otra solución 4-4 sin ningún
// neutro regalado —todos los lemas con glosa española masculina, con
// `câine` o `frate` en lugar de `perete`, que también son masculinos en
// `-e` y conservan el bolsillo opaco—. `oraș` NO es forzoso por la
// aritmética.
//
// La razón buena es otra: **en esa solución alternativa el género español
// sería CONSTANTE (masculino en los ocho) y el lote no demostraría nada
// sobre él.** Con `perete` (español femenino → `doi`) y `oraș` (español
// femenino → `două`) la única pista española del lote **varía y cruza la
// respuesta**: sale un masculino y un neutro. Eso es una demostración, no
// un cuadre.
//
// Y `oraș` es, en la casilla examinada, un ítem REGALADO: traducir da
// `două` y `frumoase`, las dos concordancias. Lo que no da es el plural
// `orașe` —el alumno puede escribir `*orașuri` con el numeral perfecto—,
// que es el mismo perfil que `nume`: acierta la mitad que el punto examina
// y puede fallar la otra.
//
// ══ 7 · TRES COSAS QUE ESTE LOTE ENSEÑA SIN QUERER, Y SUS ANTÍDOTOS ══
//
// **(a) «El artículo indefinido rumano es `un`.»** La pieza invariante
// `-un` sale 8/8 y no es neutra: además de «el singular no discrimina»,
// dice «sólo hay un artículo». Es el precio inevitable de excluir el
// femenino (§5), y **el antídoto es `r2-articulo-indefinido`**, que lleva
// `o` y `niște` con ocho ítems. No cuenta como cobertura de este punto:
// cuenta como reparación de esta falsedad.
//
// **(b) `vecin` es ANIMADO y por eso casi no discrimina.** El neutro
// rumano es, salvo residuos, una clase de inanimados (GALR I, *Genul*), y
// el alumno que ha internalizado «neutro = objeto» acierta `vecin` por
// semántica sin recuperar nada del léxico. La generalización es
// verdadera, así que no enseña nada falso, y como pista no llega a atajo
// —«animado ⇒ doi» da 5/8—. Se queda por frecuencia y porque su marco
// forma el par mínimo con `Am un telefon alb`, pero **si alguien mete un
// segundo animado, la pista sube**: los sustitutos serían `leu` o `brad`.
//
// **(c) `transparenteLatin: false` es correcto, y por el motivo
// contrario al que parece.** El latín SÍ distinguía (`duo`/`duae`) y el
// rumano lo conserva: `doi` < DUO, `două` < DUAE. **Lo que se perdió fue
// en español**, que dejó «dos» invariable. O sea que la ruta no está
// cerrada porque el latín no la tuviera, sino porque la L1 la borró.
// ⚠ Y hay una tercera lengua en la sala que el campo no contempla: este
// alumno viene de un PORTUGUÉS a C2, y el portugués tiene `dois/duas`.
// No le regala ningún ítem —las glosas portuguesas (`parede` f, `vizinho`,
// `ano`, `saco`, `trem`, `telefone`, `cidade` f, `nome`) tienen los mismos
// géneros que las españolas, así que la ruta portuguesa acierta las mismas
// 4/8— pero le regala el MECANISMO: llega sabiendo que «dos» puede
// concordar. Es una ventaja, no un atajo, y el campo está declarado «para
// un público sólo hispanohablante», que este público no es del todo.
//
// ══ 8 · POR QUÉ EL NORMALIZADOR SE QUEDA ESTRICTO ════════════════════
//
// `normalizeAnswer` no quita diacríticos (sólo unifica cedilla/coma), así
// que `Vad doua trenuri goale` se suspende. **Aquí eso es CORRECTO y no
// hay que aflojarlo**, y va escrito porque el próximo que vea fallos por
// acentos va a querer hacerlo: `doua` no es `două` mal escrito — **`a
// doua` es el ordinal femenino «segunda»** (DOOM3, *Numeralul ordinal*),
// una palabra distinta que se separa de la cardinal exactamente por la
// `ă`. Relajarlo sería «la normalización tapa el rasgo examinado» en
// estado puro: las dos colapsarían y el ítem no podría fallar por el
// motivo bueno.
import {
  verificar, informe, norm, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion,
} from '../lib/transformacion-ro';
import { buscarComposiciones, contrastarComposiciones } from '../lib/composiciones';
import { SUSTANTIVOS_A1, ADJETIVOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { adjetivo, cuatroFormas, numeralDos, type Genero, type LemaAdjetival, type LemaNominal } from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const PUNTO = 'r2-genero-tres-valores';

const lema = (l: string): LemaNominal => {
  const v = SUSTANTIVOS_A1.find((x) => x.lema === l);
  if (!v) throw new Error(`el lote 26 pide «${l}», que no está en el lexicón`);
  return v;
};
/** Los adjetivos del lote salen del lexicón. El segundo argumento existe
 *  sólo para los TESTIGOS ROJOS: un testigo que quiera probar el gate de
 *  la longitud del adjetivo tiene que poder meter uno que no está en el
 *  lexicón sin romper a la vez el gate de la clave derivada — si rompe
 *  dos, no se sabe cuál lo suspendió. */
const adj = (a: string, extra: readonly LemaAdjetival[] = []): LemaAdjetival => {
  const v = [...extra, ...ADJETIVOS_A1].find((x) => x.lema === a);
  if (!v) throw new Error(`el lote 26 pide el adjetivo «${a}», que no está en el lexicón`);
  return v;
};

/** LA CONSIGNA, ÚNICA PARA LOS OCHO, y las cuatro cosas que decide.
 *
 *  **1 · Es única a propósito.** Si hubiera una consigna por casilla, la
 *  consigna diría la respuesta —que es lo que pasa, legítimamente, en los
 *  lotes 23 y 24, donde «díselo a tu amigo / a los dos» ES la casilla—.
 *  Aquí el alumno tiene que sacar del sustantivo algo que nadie le dice, y
 *  por eso el gate del orden publicado tiene aquí trabajo de verdad: con
 *  una sola consigna, agrupar los cuatro `doi` y los cuatro `două` sería
 *  el fallo del latín exacto.
 *
 *  **2 · Va con DÍGITOS.** «hablando de dos» metería en la consigna una
 *  palabra española cuya traducción rumana ES la respuesta; y «hablando de
 *  una / de uno» deletrearía el género, que es lo que el gate de la
 *  consigna cazó en el lote 25.
 *
 *  **3 · «CON EL NÚMERO ESCRITO EN LETRAS», y esta cláusula la puso el
 *  segundo ataque.** Es la contrapartida exacta del acierto de los
 *  dígitos: la consigna dice «2», escribir el numeral en cifras es
 *  ortográficamente legítimo en rumano (DOOM3, *Scrierea numeralelor*), y
 *  `normalizeAnswer` compara cadenas — así que `Văd 2 trenuri goale`
 *  **se marcaba mal**. Un alumno que obedece la consigna letra por letra,
 *  suspendido: es el fallo del lote 25 (`Doi dintre prietenii Mariei`) en
 *  otra piel. Y la cláusula no filtra el género, porque el español da
 *  «dos» invariable.
 *
 *  **4 · La coda congela lo que no se toca**, y NO dice «no añadas ni
 *  quites palabras»: aquí hay que cambiar tres (el numeral, el sustantivo
 *  y el adjetivo), así que una coda literal haría ilegal la respuesta
 *  correcta y suspendería a quien obedece. Lo que se congela es el verbo y
 *  el orden, con lo que caen la inversión y la paráfrasis sin avisar de
 *  nada.
 *
 *  Y hace algo que nadie le pidió y conviene dejar escrito: **desambigua
 *  QUÉ sintagma se pluraliza.** En `Casa are un perete negru`, `Văd un sac
 *  plin` y `Fata are un nume scurt` hay dos candidatos, y pluralizar el
 *  sujeto obligaría `are → au`, que la coda prohíbe. Sin esa cláusula,
 *  `Două case au un perete negru` sería una lectura defendible. El día que
 *  un ítem ponga el plural en el sujeto, la coda deja de proteger y
 *  empieza a mentir. */
const CONSIGNA = 'Di otra vez la frase hablando de 2 en vez de 1, con el número escrito en letras. No toques el verbo y no cambies el orden de lo que ya hay.';

export interface Decl {
  /** SÓLO PARA TESTIGOS: un adjetivo que no está en el lexicón. */
  adjExtra?: readonly LemaAdjetival[];
  /** el sustantivo, por lema */
  n: string;
  /** el adjetivo, por lema */
  a: string;
  /** lo que va delante del grupo nominal (sujeto y verbo), y no se toca */
  antes: string;
  /** lo que va detrás, y tampoco */
  despues?: string;
  /** el género de la traducción ESPAÑOLA del sustantivo — es lo que decide
   *  `espejoEs`, y se declara aquí porque el lexicón guarda el género
   *  rumano y este lote necesita el otro. */
  es: {
    gloss: string;
    genero: 'm' | 'f';
    /** ¿Es ANIMADO? No lo usa ninguna clave: es una PISTA del buscador. El
     *  neutro rumano es, salvo residuos, una clase de inanimados (GALR I,
     *  *Genul*), así que un alumno que haya internalizado «neutro =
     *  objeto» acierta los animados por semántica sin recuperar nada del
     *  léxico. Lo trajo el segundo ataque y hay que poder medirlo. */
    animado: boolean;
  };
  /** por qué este ítem está en el lote */
  nota: string;
}

/** Los ocho, escritos AGRUPADOS por género porque así se revisan. Lo que
 *  se publica va barajado con la semilla declarada en `OPCIONES`: el orden
 *  del fichero es una pista, y cuatro lotes de latín se resolvían
 *  contándola. */
export const DECL: Decl[] = [
  // ══ CUATRO MASCULINOS · `doi` ═════════════════════════════════════
  {
    n: 'perete', a: 'negru', antes: 'Casa are', es: { gloss: 'pared', genero: 'f', animado: false },
    nota: 'el ÚNICO masculino del lexicón con traducción española femenina junto a `obraz`, y el ítem donde traducir empuja ACTIVAMENTE hacia la respuesta equivocada (pared → *două pereți): el mejor del lote. Acaba en -e, que es el bolsillo opaco: `perete`(m), `carte`(f) y `nume`(n) acaban igual, así que la terminación del singular no predice nada — y va emparejado con `nume`, que es el otro -e del lote y es neutro',
  },
  {
    n: 'vecin', a: 'bun', antes: 'Am', es: { gloss: 'vecino', genero: 'm', animado: true },
    nota: 'masculino donde el español acierta: uno de los cuatro que impiden que «invertir el género del español» pase del tope. ⚠ ES EL FLOJO DEL LOTE y va marcado: es ANIMADO y humano, y el neutro rumano es salvo residuos una clase de inanimados (GALR I, Genul), así que quien haya internalizado «neutro = objeto» lo acierta por semántica sin recuperar nada del léxico. Como pista no llega a atajo (animado ⇒ doi da 5/8) y se queda por frecuencia y porque su marco forma el par mínimo con `Am un telefon alb`; si alguien mete un SEGUNDO animado, la pista sube, y los sustitutos son `leu` o `brad`',
  },
  {
    n: 'an', a: 'greu', antes: 'Am avut', es: { gloss: 'año', genero: 'm', animado: false },
    nota: 'el masculino más frecuente del corpus con numeral (`doi ani` ×159): ancla el lote en lengua corriente',
  },
  {
    n: 'sac', a: 'plin', antes: 'Văd', es: { gloss: 'saco', genero: 'm', animado: false },
    nota: 'masculino de una sílaba y consonante final, indistinguible en el singular de `tren` — que es justo el par que el punto existe para separar, y desde el segundo ataque comparten además el MARCO (`Văd un …`), así que dentro del par no queda nada que decida salvo el sustantivo',
  },
  // ══ CUATRO NEUTROS · `două` ═══════════════════════════════════════
  {
    n: 'tren', a: 'gol', antes: 'Văd', es: { gloss: 'tren', genero: 'm', animado: false },
    nota: 'el neutro del ejemplo canónico de la prueba un…/două…, y el que forma par mínimo con `sac`: mismo marco, misma longitud, final consonántico los dos y el español los da masculinos a los dos',
  },
  {
    n: 'telefon', a: 'alb', antes: 'Am', es: { gloss: 'teléfono', genero: 'm', animado: false },
    nota: 'neutro con plural en -e y no en -uri: el reparto -e/-uri no es predecible y el lote no puede enseñar «-uri ⇒ neutro», que además es falso (vremuri, treburi, mărfuri son femeninos). Lleva `alb` y el marco `Am` por el segundo ataque: con `negru` y `Am cumpărat` los cuatro neutros quedaban con los adjetivos largos y con una `ă` o una `ș` en la frase, y eso daba dos atajos de 7/8 y una disyunción de 8/8',
  },
  {
    n: 'oraș', a: 'frumos', antes: 'Am vizitat', es: { gloss: 'ciudad', genero: 'f', animado: false },
    nota: 'EL ÍTEM QUE NO ESTABA EN EL DICTAMEN: neutro con traducción española FEMENINA, o sea el único neutro donde traducir acierta. En la casilla examinada es un ítem REGALADO y hay que decirlo; lo que NO regala es el plural `orașe` (*orașuri con el numeral perfecto), que es el mismo perfil que `nume`. Y NO está aquí por la aritmética —hay otra solución 4-4 con `câine` o `frate` en lugar de `perete`, así que no es forzoso— sino porque con `perete` hace que la única pista española del lote VARÍE y cruce la respuesta: un masculino y un neutro. Eso es una demostración y no un cuadre. Ver §6',
  },
  {
    n: 'nume', a: 'scurt', antes: 'Fata are', es: { gloss: 'nombre', genero: 'm', animado: false },
    nota: 'EL ÍTEM DE FRONTERA DEL PLURAL: `nume` es el único del lexicón cuyo plural es idéntico al singular, así que rompe «el plural siempre se ve distinto» y castiga la sobreaplicación `*numuri`. Y acaba en -e, emparejado con `perete`',
  },
];

const may = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** LA CONSTRUCCIÓN, Y NINGUNA FORMA SE ESCRIBE A MANO. La fuente sale de
 *  `l.lema` + `adjetivo(a, genero, 'sg')` y la respuesta de
 *  `numeralDos(genero)` + `l.plural` + `adjetivo(a, genero, 'pl')`. Las
 *  tres pasan por `concordanciaDe()`, o sea que **la regla del ambigen
 *  está escrita en un solo sitio y este lote la importa**: si alguien la
 *  cambiara, las ocho claves cambiarían con ella en vez de quedarse
 *  mintiendo. */
export function construir(d: Decl): {
  p: string; pasada: number; s: string; instruccion: string; r: string;
  foco: string; nucleo: string; espejoEs: boolean; transparenteLatin: boolean;
  sobreaplicacion: boolean; d: Decl; l: LemaNominal; a: LemaAdjetival; g: Genero;
} {
  const l = lema(d.n);
  const a = adj(d.a, d.adjExtra);
  const g: Genero = l.genero;
  const sg = adjetivo(a, g, 'sg');
  const pl = adjetivo(a, g, 'pl');
  if (!sg || !pl) throw new Error(`sin adjetivo para «${d.a}»`);
  const cola = d.despues ? ` ${d.despues}` : '';
  const s = `${d.antes} un ${l.lema} ${sg}${cola}.`;
  const r = `${d.antes} ${numeralDos(g)} ${l.plural} ${pl}${cola}.`;
  return {
    p: PUNTO, pasada: 1,
    s: may(s), instruccion: CONSIGNA, r: may(r),
    foco: 'un', nucleo: numeralDos(g),
    // ══ QUÉ SIGNIFICA `espejoEs` EN ESTE LOTE, y hay que decirlo ══════
    // El campo pregunta si se llega a la respuesta traduciendo, en su
    // lectura OPERATIVA. Aquí la forma plural del sustantivo NO sale de
    // traducir —es recuperación léxica, y el alumno la necesita de todos
    // modos—, así que lo que se declara es lo que el punto examina: **si
    // el género de la traducción española produce la CONCORDANCIA
    // correcta**, numeral y adjetivo a la vez. Se declara y además se
    // EJECUTA (`ESPANOL`), que son dos caminos y no uno.
    espejoEs: d.es.genero === (l.genero === 'm' ? 'm' : 'f'),
    // El español da «dos» invariable, así que la raíz románica común no
    // deja acertar ninguna de las ocho: el latín tenía duo/duae y el
    // español perdió la distinción entera. Se declara para un público
    // SÓLO hispanohablante, que es el de este curso.
    transparenteLatin: false,
    // La sobreaplicación de la regla del punto —«el singular con `un`
    // esconde un neutro, luego el plural pide `două`»— cae justo en los
    // masculinos: son el caso negativo, y sin ellos el alumno saca 8/8
    // escribiendo `*două pereți` fuera del examen.
    sobreaplicacion: g === 'm',
    d, l, a, g,
  };
}

export const CONSTRUIDOS = DECL.map(construir);
export const ITEMS: ItemTransRo[] = CONSTRUIDOS.map(({ d: _d, l: _l, a: _a, g: _g, ...x }) => x);
export type Construido = ReturnType<typeof construir>;

// ══ LAS ESTRATEGIAS DEL ALUMNO, EJECUTADAS ═══════════════════════════
//
// Todas van contra el NÚCLEO, que es el numeral: es la casilla que el
// punto examina y la única sobre la que un alumno que no sabe rumano
// puede tener una regla. Una estrategia contra la respuesta entera
// tendría que inventarse el plural del sustantivo, que no es de este
// punto y que ningún atajo produce.
const deLaFuente = (s: string) => CONSTRUIDOS.find((x) => x.s === s) ?? null;

export const SIEMPRE_DOI: Estrategia = { nombre: 'poner siempre «doi»', aplicar: () => 'doi' };
export const SIEMPRE_DOUA: Estrategia = { nombre: 'poner siempre «două»', aplicar: () => 'două' };

/** «La fuente lleva `un`, luego masculino, luego `doi`.» Es la estrategia
 *  C de la aritmética, y con cero femeninos en el lote colapsa sobre
 *  «siempre doi»: se ejecuta igualmente para que su número se imprima y
 *  para que el día que alguien meta un femenino se vea subir. */
export const DEL_ARTICULO: Estrategia = {
  nombre: 'si la fuente lleva «un», poner «doi»',
  aplicar: (x) => (/(^|\s)un(\s|$)/.test(norm(x.s)) ? 'doi' : 'două'),
};

export const ESPANOL: Estrategia = {
  nombre: 'el género de la traducción española',
  aplicar: (x) => { const c = deLaFuente(x.s); return c ? (c.d.es.genero === 'm' ? 'doi' : 'două') : null; },
};

/** «Lo contrario de lo que dice el español.» NO es una ruta que el alumno
 *  traiga de casa —nadie llega invirtiendo su propia lengua— y aun así se
 *  ejecuta y cuenta, porque es la regla que un lote MAL REPARTIDO enseña:
 *  si el español fallara en siete de ocho, el alumno aprendería a
 *  invertirlo y marcaría «fácil» sin haber aprendido el género de una sola
 *  palabra. El daño es sobre el intervalo del FSRS, que es el del §4.34. */
export const ESPANOL_INVERTIDO: Estrategia = {
  nombre: 'lo contrario del género de la traducción española',
  aplicar: (x) => { const c = deLaFuente(x.s); return c ? (c.d.es.genero === 'm' ? 'două' : 'doi') : null; },
};

// ══ LA BÚSQUEDA DE COMPOSICIONES, Y POR QUÉ AQUÍ ES UN INFORME ═══════
//
// El tope del 50 % vale para una estrategia DECLARADA de antemano; para el
// máximo sobre un espacio que se busca hay que contrastar contra la nula,
// o la maldición del ganador garantiza el hallazgo falso (§4.36). Eso
// sigue siendo cierto. Lo que este lote midió, y hay que saberlo antes de
// leer su verde:
//
//   > **A n = 8 la nula SATURA y el contraste no puede rechazar nada.**
//   > Se plantó un atajo que acierta **8 de 8** —«si el lema acaba en -e,
//   > `doi`; si no, `două`»—, condicionado por una pista, que es el único
//   > tipo que la nula puede ver. Lo mide en 100 %… y **no lo rechaza**:
//   > p = 0,299 con las nueve pistas y **p = 0,076 con UNA SOLA**, o sea
//   > que el problema no es el número de pistas sino el de ítems. Con la
//   > respuesta repartida 4-4, una pista barajada cae alineada con el
//   > reparto lo bastante a menudo como para que el percentil 95 de la
//   > nula sea el máximo posible.
//
// En el lote 25 (n = 9) el p95 ya coincidía con lo observado y se escribió
// que «el instrumento casi no puede rechazar»; aquí se midió el caso
// extremo y **no puede en absoluto**. Así que el «¿atajo? no» de este lote
// **no es prueba de nada** y se imprime como informe, con su denominador y
// con quién revisó las pistas. Lo que de verdad defiende a un lote de este
// tamaño son las estrategias CIEGAS declaradas contra el tope del 50 %
// —donde el tope sí es el criterio correcto— y los gates de reparto de
// aquí abajo. Está en `tests/unit/lote26-ro.test.ts` con las dos cifras.
//
// (La mejor composición observada sobre el lote real es 6/8, y su regla
// —«el género del español si el lema empieza por vocal, si no lo contrario
// del género del español»— no es una ruta que nadie traiga de casa: es una
// conjunción a posteriori entre 648 reglas probadas. A este tamaño 6/8 es
// lo que da el azar: la nula lo pone en el 88 %.)
const correcta = (x: Construido) => numeralDos(x.g);

const ciegas = [
  { nombre: 'poner siempre «doi»', responde: () => 'doi' },
  { nombre: 'poner siempre «două»', responde: () => 'două' },
  { nombre: 'el género del español', responde: (x: Construido) => (x.d.es.genero === 'm' ? 'doi' : 'două') },
  { nombre: 'lo contrario del género del español', responde: (x: Construido) => (x.d.es.genero === 'm' ? 'două' : 'doi') },
];

/** LAS PISTAS, y ésta es la parte que hay que revisar A MANO: el
 *  algoritmo es exhaustivo sobre la lista, y la lista la escribe una
 *  persona — la peor situada, porque es la misma que escribió los ítems.
 *  En el lote 25 el barrido salió limpio sobre siete pistas y el lingüista
 *  encontró después una composición de 8/9 cuya pista era la terminación
 *  del LEMA, que es justo la clase en la que yo no había mirado.
 *
 *  Todas éstas son de superficie: se ven sin saber una palabra de rumano
 *  ni la regla del punto. */
const pistas = [
  { nombre: 'el lema acaba en -e', vale: (x: Construido) => /e$/.test(norm(x.l.lema)) },
  { nombre: 'el lema empieza por vocal', vale: (x: Construido) => /^[aeiouăâî]/.test(norm(x.l.lema)) },
  { nombre: 'el lema tiene una sola vocal escrita', vale: (x: Construido) => (norm(x.l.lema).match(/[aeiou]/g) ?? []).length === 1 },
  { nombre: 'la frase empieza por el verbo', vale: (x: Construido) => /^(am|vad)/.test(norm(x.s)) },
  { nombre: 'la frase está en pasado (am + participio)', vale: (x: Construido) => /(^|\s)am\s\w+t(\s|$)/.test(norm(x.s)) },
  { nombre: 'el adjetivo de la fuente acaba en -u', vale: (x: Construido) => /u$/.test(norm(x.a.lema)) },
  { nombre: 'el adjetivo de la fuente acaba en consonante', vale: (x: Construido) => /[bcdfglmnprstv]$/.test(norm(x.a.lema)) },
  { nombre: 'la traducción española del lema es femenina', vale: (x: Construido) => x.d.es.genero === 'f' },
  // ══ LAS SIETE CLASES QUE FALTABAN, y las trajo el segundo ataque ═══
  // Mi lista tenía nueve pistas y salía 6/8. Corrida con 72, el máximo
  // subía a **7/8 por dos reglas** que yo no había escrito, y su
  // disyunción a **8 de 8**. Las dos son de superficie pura y ninguna es
  // gramática, que es exactamente por lo que no se me ocurrieron.
  //
  //   · «si la fuente lleva una letra con rabito (ă â î ș ț) → două» 7/8
  //   · «si el adjetivo tiene 5 letras o más → două» 7/8
  //   · su disyunción: **8/8**
  //
  // Salían de una coincidencia del reparto: los cuatro masculinos
  // llevaban por casualidad los cuatro adjetivos más cortos y frases
  // enteramente ASCII, y tres de los cuatro neutros los largos y una `ă` o
  // una `ș`. El diacrítico es la peor pista imaginable —tipográfica, no
  // lingüística, y un hispanohablante con cero rumano la ve de un
  // vistazo— y es la misma clase que la terminación del lema del lote 25:
  // **un rasgo del SIGNIFICANTE, que nadie mira porque no es gramática.**
  { nombre: 'la fuente lleva alguna letra con diacrítico', vale: (x: Construido) => /[ăâîșț]/.test(x.s.toLowerCase()) },
  { nombre: 'el lema lleva alguna letra con diacrítico', vale: (x: Construido) => /[ăâîșț]/.test(x.l.lema) },
  // Los umbrales de longitud van BARRIDOS y no fijados a ojo: mi pista
  // «más de seis letras» sólo separaba `telefon` y dejaba invisible el
  // umbral informativo, que era otro.
  ...[3, 4, 5, 6].map((k) => ({ nombre: `el adjetivo tiene ${k} letras o más`, vale: (x: Construido) => x.a.lema.length >= k })),
  ...[3, 4, 5, 6, 7].map((k) => ({ nombre: `el lema tiene ${k} letras o más`, vale: (x: Construido) => x.l.lema.length >= k })),
  ...[4, 5].map((k) => ({ nombre: `la fuente tiene ${k} palabras o más`, vale: (x: Construido) => x.s.split(/\s+/).length >= k })),
  // La identidad del VERBO, no sólo «empieza por verbo»: son cuatro
  // marcos y cada uno podría alinearse con la respuesta.
  ...['are', 'am', 'vad'].map((v) => ({ nombre: `el verbo de la frase es «${v}»`, vale: (x: Construido) => new RegExp(`(^|\\s)${v}(\\s|$)`).test(norm(x.s)) })),
  // La ANIMACIDAD: el neutro rumano es casi por definición una clase de
  // inanimados (GALR I), así que «animado ⇒ doi» es una regla semántica
  // que el alumno puede sacar sin saber el género de nada.
  { nombre: 'el sustantivo es animado', vale: (x: Construido) => x.d.es.animado },
  // Y la GLOSA española por su forma, que no es lo mismo que su género.
  { nombre: 'la glosa española acaba en -a', vale: (x: Construido) => /a$/.test(x.d.es.gloss) },
  { nombre: 'la glosa española acaba en -o', vale: (x: Construido) => /o$/.test(x.d.es.gloss) },
  { nombre: 'la glosa española tiene más de cinco letras', vale: (x: Construido) => x.d.es.gloss.length > 5 },
];

/** LAS DISYUNCIONES DE DOS PISTAS. `buscarComposiciones` condiciona con
 *  UNA pista, y el atajo de 8/8 que el segundo ataque encontró era una
 *  disyunción de dos («lleva diacrítico **o** el adjetivo es largo»). No
 *  se toca el buscador —vive en `composiciones.ts`, es de las cuatro
 *  lenguas y lo lleva otra sesión—: se le pasan las disyunciones como
 *  pistas derivadas, que es lo mismo sin copiar nada. */
export const pistasConDisyunciones = [
  ...pistas,
  ...pistas.flatMap((a, i) => pistas.slice(i + 1).map((b) => ({
    nombre: `${a.nombre} O BIEN ${b.nombre}`,
    vale: (x: Construido) => a.vale(x) || b.vale(x),
  }))),
];


/** Se exportan las tres piezas para que el TESTIGO ROJO pueda correr la
 *  misma búsqueda sobre un lote con un atajo PLANTADO. A n = 8 la nula es
 *  ancha, así que un «no hay atajo» que nunca se ha visto decir que sí no
 *  vale nada; y sólo sirve plantar un atajo CONDICIONADO por una pista,
 *  porque las estrategias ciegas no se barajan y puntúan igual en la nula. */
export const BUSQUEDA = { correcta, ciegas, pistas };
export const VEREDICTO = contrastarComposiciones(CONSTRUIDOS, correcta, ciegas, {
  pistas,
  revisadaPor: 'linguista-adversarial-ro (2026-09-04, segundo ataque sobre el lote escrito)',
});

// ══ LOS GATES PROPIOS DEL PUNTO ══════════════════════════════════════

export function revisar(xs: readonly Construido[]): string[] {
  const v: string[] = [];
  const n = xs.length;

  // 1 · LA RESPUESTA SE DERIVA, NO SE ESCRIBE. Si la clave y
  //     `concordanciaDe()` se separan, nada más lo vería.
  for (const x of xs) {
    const pl = adjetivo(x.a, x.g, 'pl');
    const esperada = `${may(`${x.d.antes} ${numeralDos(x.g)} ${x.l.plural} ${pl}`)}${x.d.despues ? ` ${x.d.despues}` : ''}.`;
    if (x.r !== esperada) v.push(`${x.d.n}: la respuesta «${x.r}» no es la que deriva el paradigma («${esperada}»)`);
  }

  // 2 · NI UN FEMENINO. Es la aritmética del §5 hecha invariante y no
  //     nota en un comentario: con un solo femenino, «si lleva `un` di
  //     `doi`» sube a 5/8 y el lote deja de medir el ambigen para medir
  //     femenino frente a no-femenino, que es otro punto.
  for (const x of xs)
    if (x.g === 'f') v.push(`${x.d.n}: FEMENINO — el artículo de la fuente lo delata y el ítem pasa a medir femenino/no-femenino, que es r2-articulo-indefinido`);

  // 3 · TODO ADJETIVO, DE CUATRO FORMAS. `nou/nouă/noi/noi`,
  //     `mic/mică/mici/mici`, `mare`, `verde`, `dulce`, `vechi`,
  //     `roșu/roșie/roșii` tienen los DOS plurales homógrafos: un ítem con
  //     uno de ésos **aprueba sin distinguir el género** y parece
  //     impecable. Es §4.13bis y aquí es invisible.
  for (const x of xs)
    if (!cuatroFormas(x.a)) v.push(`${x.d.n}: el adjetivo «${x.a.lema}» tiene el masculino y el femenino plural homógrafos («${x.a.mPl}»), así que el ítem no examina el género`);

  // 4 · LA FUENTE VA EN SINGULAR INDEFINIDO, SIEMPRE. Con la forma plural
  //     a la vista, la desinencia decide el numeral sin excepción dentro
  //     del par {masculino, neutro} y el ítem pasa a medir
  //     `r2-plural-i-e-uri`. El gate es estructural: la fuente tiene que
  //     ser exactamente `… un <lema> <adj sg> …`.
  // ⚠ Las DOS comprobaciones de aquí abajo son independientes y por eso NO
  // comparten bucle ni `continue`: en el lote 21 un gate nuevo no disparó
  // nunca porque iba detrás de un `continue` ajeno, y salía «Limpio»
  // (§0.8). La de la forma plural no necesita el adjetivo para nada.
  for (const x of xs)
    if (x.l.plural !== x.l.lema && new RegExp(`(?<![\\p{L}-])${norm(x.l.plural)}(?![\\p{L}-])`, 'u').test(norm(x.s)))
      v.push(`${x.d.n}: la forma PLURAL está en la fuente y su desinencia decide el numeral sin saber el género`);

  for (const x of xs) {
    const sg = adjetivo(x.a, x.g, 'sg');
    if (!sg) { v.push(`${x.d.n}: el paradigma no da singular para «${x.a.lema}»`); continue; }
    // ⚠ EL PATRÓN VA EN EL ALFABETO DE LA NORMALIZACIÓN, no en el de la
    // lengua: `norm()` pasa por NFD y borra los diacríticos, así que un
    // patrón escrito con `ș` no dispara nunca sobre texto normalizado y
    // el lote imprimiría «Limpio» igual (§4.37, el gate del `și` del lote
    // 25). Aquí la primera versión comparaba `norm(x.s)` contra el lema
    // SIN normalizar y falló en `oraș` — al revés que el §4.37, pero el
    // mismo defecto: dos alfabetos en la misma comparación.
    if (!new RegExp(`(?<![\\p{L}-])un ${norm(x.l.lema)} ${norm(sg)}(?![\\p{L}-])`, 'u').test(norm(x.s)))
      v.push(`${x.d.n}: la fuente no es «un ${x.l.lema} ${sg}» — o va en plural, o lleva otro determinante`);
  }

  // 5 · EL REPARTO. Masculinos y neutros a la mitad: es el suelo teórico
  //     de una respuesta binaria, y cargar de un lado sube una de las dos
  //     constantes por encima del tope.
  const m = xs.filter((x) => x.g === 'm').length;
  if (m * 2 !== n) v.push(`REPARTO: ${m} masculinos de ${n} — con respuesta binaria el reparto tiene que ser la mitad, o una de las dos constantes pasa del 50 %`);

  // 6 · Y EL REPARTO DEL ESPEJO, que es el que el dictamen no traía. Con
  //     el español acertando en menos de la mitad, «invertir el español»
  //     pasa el tope y el lote enseña esa regla falsa.
  const espejo = xs.filter((x) => x.d.es.genero === (x.g === 'm' ? 'm' : 'f')).length;
  if (espejo * 2 !== n) v.push(`ESPEJO: el género del español acierta ${espejo}/${n} — tiene que ser la mitad exacta, o su INVERSO pasa del tope y el lote enseña «haz lo contrario del español»`);

  // 7 · LA TERMINACIÓN DEL LEMA NO PUEDE PREDECIR LA CLASE. `perete`(m),
  //     `carte`(f) y `nume`(n) acaban igual: es el bolsillo opaco del
  //     rumano y el lote lo usa a propósito, con uno de cada.
  const enE = xs.filter((x) => /e$/.test(norm(x.l.lema)));
  if (enE.length && new Set(enE.map((x) => x.g)).size < 2)
    v.push(`SUPERFICIE: los ${enE.length} lemas en -e son todos del mismo género, así que la terminación del singular predice el numeral`);

  // 8 · LOS CUATRO PARES MÍNIMOS DE MARCO, que es lo que de verdad mata
  //     las pistas de superficie. Lo trajo el segundo ataque, y es mejor
  //     que cualquier umbral: **cada marco lleva un masculino y un
  //     neutro**, así que toda pista que sea propiedad del MARCO —el
  //     verbo, el número de palabras, el tiempo— es constante dentro del
  //     par y no puede separar las clases. No es un parche para cuadrar un
  //     buscador: es la forma correcta del punto, porque dentro de cada
  //     par lo único que decide la respuesta es el sustantivo.
  const marcos = new Map<string, Genero[]>();
  for (const x of xs) {
    const k = /^am \w+$/i.test(x.d.antes) ? 'am + participio' : norm(x.d.antes).split(' ').pop()!;
    if (!marcos.has(k)) marcos.set(k, []);
    marcos.get(k)!.push(x.g);
  }
  for (const [k, gs] of marcos)
    if (gs.length !== 2 || new Set(gs).size !== 2)
      v.push(`MARCO «${k}»: lleva ${gs.length} ítem(s) de género(s) {${[...new Set(gs)].join(', ')}} — cada marco tiene que llevar un masculino y un neutro, o alguna propiedad del marco separa las clases`);

  // 9 · EL DIACRÍTICO NO PUEDE PREDECIR LA CLASE. Es la peor pista
  //     posible —tipográfica, no lingüística, y visible de un vistazo para
  //     quien no sabe una palabra de rumano— y en la v1 de este lote daba
  //     **7 de 8**: los cuatro masculinos salían en frases enteramente
  //     ASCII y tres de los cuatro neutros arrastraban una `ă` o una `ș`.
  //     Es la clase «rasgo del significante» del lote 25, que nadie mira
  //     porque no es gramática.
  const conDiacritico = (x: Construido) => /[ăâîșț]/.test(x.s.toLowerCase());
  for (const g of ['m', 'n'] as const) {
    const de = xs.filter((x) => x.g === g);
    if (de.length && (de.every(conDiacritico) || !de.some(conDiacritico)))
      v.push(`DIACRÍTICO: los ${de.length} ítems de género «${g}» son todos ${de.every(conDiacritico) ? 'CON' : 'SIN'} diacrítico en la fuente — la ortografía predice la respuesta sin saber rumano`);
  }

  // 10 · NI LA LONGITUD DEL ADJETIVO. En la v1 daba otros 7 de 8, y su
  //      disyunción con el diacrítico daba **8 de 8**: los cuatro
  //      masculinos llevaban por casualidad los cuatro adjetivos más
  //      cortos. Se barren TODOS los umbrales y no uno elegido a ojo, que
  //      es como se me escapó la primera vez.
  const largos = [...new Set(xs.map((x) => x.a.lema.length))];
  for (const k of largos) {
    const clase = (x: Construido) => x.a.lema.length >= k;
    if (new Set(xs.filter(clase).map((x) => x.g)).size === 1 && new Set(xs.filter((x) => !clase(x)).map((x) => x.g)).size === 1 && xs.some(clase) && xs.some((x) => !clase(x)))
      v.push(`LONGITUD DEL ADJETIVO: el umbral «${k} letras o más» separa masculinos de neutros al 100 %`);
  }

  // 8 · LA BÚSQUEDA DE COMPOSICIONES, contra la nula por permutación.
  const ver = contrastarComposiciones([...xs], correcta, ciegas, { pistas, revisadaPor: VEREDICTO.revisadaPor });
  // ⚠ Y NO SE PONE UMBRAL AL MÁXIMO DE LA BÚSQUEDA CON DISYUNCIONES, por
  // mucho que sea la que encontró el 8/8 de la v1. Son 4.876 reglas sobre
  // 8 ítems: a ese tamaño un 7/8 lo da el azar sin ninguna dificultad, y
  // exigirle un techo a un máximo buscado es justo el error del §4.36 —la
  // sesión del latín «arregló» así un lote que no estaba roto y lo dejó
  // peor. El máximo se IMPRIME con su denominador y lo juzga una persona;
  // lo que bloquea son los gates 8, 9 y 10, que son estructurales.
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
// ⚠ Se consulta y se publica con el MISMO instrumento. `comprobarEnCorpus`
// envuelve el patrón en límites de palabra y la CLI no, y en el lote 25
// tres atestaciones declaradas resultaron ser homógrafos por consultar con
// una y publicar con la otra. Estos números salen de `INI`+patrón+`FIN`.
export const COMPROBACIONES: Comprobacion[] = [
  // EL NUMERAL MASCULINO CON LOS LEMAS DEL LOTE.
  { afirmacion: 'el numeral masculino con los lemas del lote: «doi ani» (×159), «doi saci», «doi pereți», «doi vecini»', patron: 'doi (ani|saci|pereți|vecini)', espera: 'presente' },
  // EL NUMERAL FEMENINO CON NEUTROS, que es la casilla que el punto
  // examina y la que el español no da.
  { afirmacion: 'el numeral femenino con sustantivos NEUTROS: «două trenuri», «două orașe», «două nume»', patron: 'două (trenuri|orașe|nume)', espera: 'presente' },
  // LA CONCORDANCIA DEL ADJETIVO EN PLURAL, en las dos direcciones, que es
  // el segundo exponente del mismo rasgo.
  // ⚠ Estas cuatro atestan la CONCORDANCIA masculina plural con los lemas
  // del lote, no las claves literales: `pereți negri` no sale en el corpus
  // (`pereți albi` sí) y `două telefoane albe` tampoco —el corpus es prosa
  // del XIX y no tiene teléfonos—. Las claves de esos dos ítems las deriva
  // `adjetivo()` y las respalda DOOM3, no el corpus, y eso va escrito aquí
  // en vez de dejar que el número parezca cubrirlas: **un número correcto
  // sobre otra forma es un número verdadero que mide otra cosa.**
  { afirmacion: 'plural masculino del adjetivo con los lemas del lote: «pereți albi», «ani grei», «saci plini», «vecini buni»', patron: '(pereți albi|ani grei|saci plini|vecini buni)', espera: 'presente' },
  { afirmacion: 'y el plural NEUTRO tomando la forma femenina del adjetivo: «două scaune albe», «două orașe mici»', patron: 'două (scaune albe|orașe mici)', espera: 'presente' },
  // LA FUENTE EN SINGULAR: `un` + neutro es rumano corriente, que es
  // exactamente lo que hace opaco el singular.
  { afirmacion: 'el singular indefinido del NEUTRO es idéntico al del masculino: «un tren», «un oraș», «un scaun», «un cuvânt»', patron: 'un (tren|oraș|scaun|cuvânt)', espera: 'presente' },
  // Las tres fuentes masculinas del lote, tal cual, y una de ellas es la
  // frase entera: «un perete negru» sale en el corpus.
  { afirmacion: 'las fuentes masculinas del lote, tal cual: «un perete negru», «un vecin bun», «un sac plin»', patron: '(un perete negru|un vecin bun|un sac plin)', espera: 'presente' },
  // EL LEMA DE LA FRONTERA: `nume` con plural idéntico al singular.
  { afirmacion: '`nume` tiene el plural idéntico al singular, y el numeral es lo ÚNICO que lo marca: «două nume»', patron: 'două nume', espera: 'presente' },
  // Y LA AFIRMACIÓN QUE EL LOTE HACE SOBRE LA LENGUA Y QUE MÁS CARO
  // SALDRÍA SI FUERA FALSA: que el masculino plural NO toma `două`. Es un
  // `ausente`, y un `ausente` con cero NO demuestra nada — sólo dice que
  // el corpus no lo refuta. La prohibición viene de DOOM3 y GALR I.
  { afirmacion: 'el masculino plural no toma el numeral femenino (*două ani, *două pereți, *două saci) — DOOM3, GALR I; el corpus no lo refuta, y eso no lo demuestra', patron: 'două (ani|pereți|saci|vecini)', espera: 'ausente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  estrategias: [SIEMPRE_DOI, SIEMPRE_DOUA, DEL_ARTICULO, ESPANOL, ESPANOL_INVERTIDO],
  gatesPropios,
  // EL ORDEN PUBLICADO, BARAJADO CON SEMILLA FIJA. El fichero está escrito
  // agrupado —cuatro masculinos y luego cuatro neutros, porque así se
  // revisa— y con una consigna ÚNICA para los ocho, o sea la forma exacta
  // del fallo que costó cuatro lotes en latín: al alumno le bastaría notar
  // que a partir del quinto la respuesta cambia. Ni alternancia estricta,
  // que el mismo detector caza por paridad, ni azar sin semilla, que haría
  // que el veredicto cambiara entre corridas.
  semilla: 3,
  juicios: {
    copia: 'CERO de ocho se contestan copiando el foco, y el cero es forzoso, no una virtud: el foco es el artículo `un` y el núcleo es el numeral, o sea dos piezas distintas de la frase, así que «copiar el foco» no es una estrategia que ningún alumno pueda ejecutar. La pregunta equivalente en este punto es cuántos se contestan sin cambiar nada, y son cero también, porque el numeral cambia en los ocho: la fuente dice «1» y la respuesta dice «2». Lo que sí tiene una copia es el SUSTANTIVO, y ahí el número correcto es UNO de ocho: `nume`, el único lema del lexicón cuyo plural es idéntico al singular. Ni cero ni más de uno valdrían. Con cero, el lote enseñaría «el plural siempre se ve distinto» y el alumno escribiría *două numuri, que es la sobreaplicación que este ítem existe para castigar; con dos o más, «deja el sustantivo como está» empezaría a ser una estrategia. Medido ejecutando: copiar el foco 0/8, copiar la frase entera 0/8 y la edición modal del lote 0/8 — y ese cero de la modal NO es una virtud del lote, es un artefacto que conviene dejar escrito para que nadie lo lea como holgura: la modal es leave-one-out, y con el reparto exacto 4-4 el ítem que se deja fuera desempata siempre hacia el otro lado, así que la estrategia acierta el contrario en los ocho. Con 5-3 subiría a 5/8 de golpe. El número que protege al lote aquí no es ése, son los cuatro de las cinco estrategias constantes, y sobre todo la estructura: CUATRO PARES MÍNIMOS DE MARCO —`Casa are`/`Fata are`, `Am`/`Am`, `Am avut`/`Am vizitat`, `Văd`/`Văd`—, uno masculino y uno neutro cada uno, así que toda pista que sea propiedad del marco es constante dentro del par y no puede separar las clases. Eso lo trajo el segundo ataque y hay gate.',
    frontera: 'La regla del punto es «el neutro concuerda como femenino en plural», y su contexto negativo son los MASCULINOS: el alumno que aprende que el singular con `un` esconde un neutro sobregeneraliza a «pon siempre două» y escribe *două pereți, *două ani, *două saci. Los cuatro masculinos van marcados `sobreaplicacion` y son la mitad del lote, no un ítem suelto, y eso es forzoso: la respuesta es binaria y la mitad ES el caso negativo. Hay una SEGUNDA frontera, y es la que se ve peor: `nume`, cuyo plural es idéntico al singular. Quien haya aprendido «neutro ⇒ el plural añade -e o -uri» escribe *două numuri con el numeral bien puesto, o sea que acierta la mitad que este punto examina y falla la otra; sin él, el lote enseñaría que el plural siempre se ve. Y lo que el lote NO trae, con su motivo: ni un solo FEMENINO. No es un hueco de cobertura elegido por comodidad sino por aritmética —el artículo `un`/`o` de la fuente delata el femenino, así que «si lleva un di doi» acertaría masculinos y femeninos y pasaría el tope con un solo femenino dentro— y por contenido: un femenino sólo puede examinar femenino frente a no-femenino, que es la oposición de dos valores que el español ya tiene y que `r2-articulo-indefinido` ya cubre con ocho ítems. La cara femenina del género vive allí, no aquí.',
    varianza: 'Lo que varía entre los ocho, y ES el punto, es el GÉNERO del sustantivo: cuatro masculinos que piden `doi` y cuatro neutros que piden `două`, sin ninguna pista en la frase que lo diga. La pieza invariante es `-un`, en los ocho, y es invariancia de la LENGUA y no del lote: el rumano no tiene otro artículo indefinido para masculino ni para neutro, y que las dos casillas se escriban igual en singular es exactamente por lo que este punto existe. Lo que varía en su lugar son las dos respuestas del numeral, los ocho lemas y las ocho concordancias del adjetivo. LO QUE ESTE LOTE NO MIDE, Y VA ESCRITO: la CONCORDANCIA DEL ADJETIVO en plural neutro está publicada entera en `r2-concordancia-adjetivo`, con ocho ítems, y aquí viaja como segundo exponente del mismo rasgo, no como variable propia — quien acierte el numeral y falle el adjetivo está fallando aquel punto y no éste, y ningún ítem los separa. Se acepta porque los dos exponentes se deciden con la misma pieza de conocimiento (el género del lema) y porque el error es distinguible: *două trenuri buni acierta el numeral y *doi trenuri pline lo falla. Y hay un SEGUNDO precio, declarado: la respuesta pide la forma PLURAL del sustantivo, que es `r2-plural-i-e-uri`. No es un arrastre accidental — para masculino y neutro la clase de plural y el género son el mismo hecho léxico almacenado, y lo que separa los dos puntos es que allí la clase va impresa en la pista («tren — plural (neutro en -uri)») y el numeral concordado ya está escrito en la frase, mientras que aquí no se imprime nada. Es la diferencia entre aplicar una clase y recuperarla, y es lo que dice la cita del currículo: clasificar sustantivos NUEVOS. Y la razón por la que la fuente no puede ir en plural: dentro del par masculino/neutro la desinencia decide el numeral sin excepción —masculino en -i 24 de 24 del lexicón, neutro en -e o -uri 14 de 14—, así que con el plural a la vista el ítem se contesta leyendo y mide aquel punto y no éste.',
  },
};

if (/[/\\]trans-ro-l26\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 26 · transformación · ${ITEMS.length} ítems · ${PUNTO}\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const x of CONSTRUIDOS)
    console.log(`- [${x.g}] \`${x.s}\` → \`${x.r}\`  (es: ${x.d.es.gloss} ${x.d.es.genero}${x.espejoEs ? ', espejo' : ''})`);
  console.log('');
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  console.log('\n**La búsqueda de composiciones, contra la nula por permutación (semilla fija):**\n');
  console.log(`- pistas (${VEREDICTO.pistasUsadas.length}), revisadas por: ${VEREDICTO.revisadaPor}`);
  console.log(`- mejor: «${VEREDICTO.mejor.regla}» ${VEREDICTO.mejor.acierta}/${VEREDICTO.mejor.de} (${(100 * VEREDICTO.mejor.tasa).toFixed(0)} %)`);
  console.log(`- percentil 95 de la nula: ${(100 * VEREDICTO.nulaP95).toFixed(0)} % · p = ${VEREDICTO.p.toFixed(3)} · ¿atajo? **${VEREDICTO.hayAtajo ? 'SÍ' : 'no'}**`);
  console.log('  ⚠ a n = 8 la nula SATURA: no rechaza ni un atajo plantado del 100 % (p = 0,299; con UNA pista, 0,076). Este veredicto es un informe, no un certificado.');
  const cd = buscarComposiciones([...CONSTRUIDOS], correcta, ciegas, pistasConDisyunciones);
  console.log(`- con DISYUNCIONES de dos pistas (${pistasConDisyunciones.length} pistas, ${cd.length} reglas): mejor ${cd[0]!.acierta}/${cd[0]!.de} — «${cd[0]!.regla}»`);
  console.log('  (sin umbral a propósito: exigirle un techo a un máximo buscado sobre 4.876 reglas es el §4.36. La v1 de este lote daba 8/8 aquí, y lo que lo arregló son los gates de marco, diacrítico y longitud.)');
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}

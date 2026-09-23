// scripts/lib/lotes-ru.ts — EL REGISTRO DE LOTES RUSOS, en UN sitio.
//
// Vivía dentro de `publicar-cloze-ru.ts`. Salió de ahí el 2026-09-23 porque
// hizo falta un segundo lector (`resincronizar-pista-ru.ts`, que corrige lo
// publicado) y la alternativa era copiar el registro: la copia N+1 que se
// desincroniza (§C4). Un lote nuevo se registra aquí y lo ven los dos.
import * as A1 from '../lotes/cloze-ru-a1';
import * as A1B from '../lotes/cloze-ru-a1b';
import * as A1C from '../lotes/cloze-ru-a1c';
import * as A1D from '../lotes/cloze-ru-a1d';
import * as A2 from '../lotes/cloze-ru-a2';
import * as A2B from '../lotes/cloze-ru-a2b';

/** ⚠ EL REGISTRO ES GENÉRICO Y NO ESTÁ TIPADO AL LOTE 1, y el motivo importa.
 *  La v0 importaba `respuestaDe` y `alternativasDe` de `cloze-ru-a1` **por
 *  nombre y a nivel de módulo**, y las llamaba sobre el ítem de cualquier lote:
 *  mientras hubo un solo lote eso era correcto y con el segundo habría llamado
 *  a la máquina NOMINAL sobre un ítem VERBAL. No habría explotado —
 *  `casillaNominal()` recibe un objeto sin `genero` y devuelve `null`— y el
 *  publicador habría dicho «sin respuesta derivada» en los diez ítems, o peor,
 *  habría derivado algo plausible. Es el mismo defecto que la elección de
 *  lección: una expresión correcta con un solo caso delante.
 *
 *  Cada lote trae sus propias funciones y sus propias etiquetas. `Item` es
 *  `unknown` a propósito: el publicador no sabe nada del ítem salvo `p` y `s`,
 *  y todo lo que depende de la forma del ítem lo pone el lote. */
export interface LoteRu<T> {
  items: T[];
  verificar: (xs: T[]) => string[];
  respuestaDe: (x: T) => string | null;
  alternativasDe: (x: T) => string[];
  /** El punto del inventario y la frase, que es lo único que el publicador lee
   *  directamente del ítem. */
  punto: (x: T) => string;
  frase: (x: T) => string;
  pista: (x: T) => string;
  /** Las etiquetas propias del lote: el eje que el ítem instancia. Sin esto,
   *  el publicador escribiría `caso-undefined` en un lote verbal. */
  tags: (x: T) => string[];
}

/** El lote con su tipo BORRADO, que es lo único que el publicador necesita. El
 *  casting ocurre UNA vez, aquí, y con el tipo del lote comprobado a la
 *  entrada: cada entrada del registro se escribe con su `T` explícito, así que
 *  un campo mal leído (`x.caso` en un lote verbal) es un error de compilación y
 *  no un `caso-undefined` en una etiqueta publicada. */
export type LoteAnonimo = LoteRu<unknown>;
const deLote = <T>(l: LoteRu<T>): LoteAnonimo => l as LoteAnonimo;

export const LOTES: Record<string, LoteAnonimo> = {
  a1: deLote<A1.ClozeRu>({
    items: A1.ITEMS, verificar: A1.verificar, respuestaDe: A1.respuestaDe,
    alternativasDe: A1.alternativasDe,
    punto: (x) => x.p, frase: (x) => x.s, pista: (x) => x.pista,
    tags: (x) => [`caso-${x.caso}`, ...(x.frontera ? ['frontera-sobreaplicacion'] : [])],
  }),
  a1b: deLote<A1B.ClozeVerboRu>({
    items: A1B.ITEMS, verificar: A1B.verificar, respuestaDe: A1B.respuestaDe,
    alternativasDe: A1B.alternativasDe,
    punto: (x) => x.p, frase: (x) => x.s, pista: (x) => x.pista,
    tags: (x) => [`persona-${x.persona}`, `eje-${x.eje}`, ...(x.frontera ? [`frontera-${x.frontera.regla}`] : [])],
  }),
  // ⚠ EL TERCER LOTE NO ESCRIBE SU FRASE: la compone `frase()` metiendo la
  // forma NOMINAL derivada. Si el publicador leyera `x.marco` publicaría
  // `{N}` literal, y el ítem saldría con una llave dentro sin que nada
  // fallara — el fallo que devuelve algo plausible. Por eso el registro pide
  // la frase a la función del lote y no a un campo.
  a1c: deLote<A1C.ClozeAdjRu>({
    items: A1C.ITEMS, verificar: A1C.verificar, respuestaDe: A1C.respuestaDe,
    alternativasDe: A1C.alternativasDe,
    punto: (x) => x.p, frase: (x) => A1C.frase(x), pista: (x) => x.pista,
    tags: (x) => [`caso-${x.caso}`, `num-${x.num}`, `eje-${x.eje}`, ...(x.frontera ? [`frontera-${x.frontera.regla}`] : [])],
  }),
  // El CUARTO lote tampoco escribe su frase: la compone `frase()` metiendo el
  // lema en el paréntesis. Y su `caso` no se etiqueta porque no varía —el punto
  // ES el nominativo plural—: una etiqueta constante no distingue nada y
  // fingiría una dimensión que el lote no tiene.
  a1d: deLote<A1D.ClozePlRu>({
    items: A1D.ITEMS, verificar: A1D.verificar, respuestaDe: A1D.respuestaDe,
    alternativasDe: A1D.alternativasDe,
    punto: (x) => x.p, frase: (x) => A1D.frase(x), pista: (x) => x.pista,
    tags: (x) => [`eje-${x.eje}`, ...(x.frontera ? [`frontera-${x.frontera.regla}`] : [])],
  }),
  // El QUINTO lote, primero de A2. Aquí el caso SÍ varía (dat/instr/prep, cuatro
  // de cada) y se etiqueta; el número no, porque es plural en los doce.
  a2: deLote<A2.ClozeOblRu>({
    items: A2.ITEMS, verificar: A2.verificar, respuestaDe: A2.respuestaDe,
    alternativasDe: A2.alternativasDe,
    punto: (x) => x.p, frase: (x) => A2.frase(x), pista: (x) => x.pista,
    tags: (x) => [`caso-${x.caso}`, `eje-${x.eje}`, ...(x.frontera ? [`frontera-${x.frontera.regla}`] : [])],
  }),
  // El SEXTO lote, segundo de A2. La casilla es UNA (genitivo plural) y no se
  // etiqueta, como en el lote 4; lo que varía es la DESINENCIA elegida, y ésa
  // sí se etiqueta, leída contra el tema del lema y no en la cola (§A6).
  a2b: deLote<A2B.ClozeGenRu>({
    items: A2B.ITEMS, verificar: A2B.verificar, respuestaDe: A2B.respuestaDe,
    alternativasDe: A2B.alternativasDe,
    punto: (x) => x.p, frase: (x) => A2B.frase(x), pista: (x) => x.pista,
    tags: (x) => [`des-${A2B.desinenciaDe(A2B.respuestaDe(x) ?? '', x.lema)}`, `eje-${x.eje}`, ...(x.frontera ? [`frontera-${x.frontera.regla}`] : [])],
  }),
};


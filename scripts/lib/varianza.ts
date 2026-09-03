// scripts/lib/varianza.ts — ¿QUÉ VARÍA ENTRE LOS ÍTEMS DE UN PUNTO?
//
// UNA implementación para las CUATRO lenguas. No hay versión `-ro`: la
// regla vive aquí y quien la necesite la importa, porque una regla
// copiada falla en la copia N+1 que nadie añade — y ésta ya nació dos
// veces el mismo día, una aquí y otra en la máquina del coordinador.
//
// ══ POR QUÉ EXISTE ═══════════════════════════════════════════════════
// El lote 19 escribió ocho ítems de `r8-relativas-pe-care`. Las ocho
// buenas correctas, las ocho malas verificadas imparseables una por una,
// tres gates nuevos, «Limpio». Y el conjunto no medía su punto:
// **insertar `pe` era INVARIANTE en los ocho**, así que se aprendía en el
// primero y a partir del segundo lo único que separaba acierto de fallo
// era el clítico — que es `r6-cliticos-acusativo`, otro punto, cubierto.
//
// **Eran UN ítem repetido ocho veces.** Y eso NO es propiedad de ningún
// ítem: ningún gate por ítem puede verlo, por impecable que sea cada uno.
// Es propiedad del CONJUNTO.
//
// Lo que ataca es la métrica con la que se decide si el curso está
// terminado. «Ocho ítems por punto» presupone que los ocho miden el
// punto; si el rasgo diana no varía, **la cobertura real es 1, no 8**.
//
// ══ QUÉ CONTESTA, Y SÓLO ESO ═════════════════════════════════════════
// «¿Qué pieza de la operación se repite en (casi) todos los ítems?» La
// operación se lee del ítem, no de la prosa:
//   · corrección → el DIFF mala→buena: qué palabras entran y cuáles
//     salen. Es literalmente lo que se le pide al alumno.
//   · cloze      → la respuesta del hueco.
//
// ══ QUÉ **NO** CONTESTA, Y AQUÍ ESTÁ TODO ════════════════════════════
// **No sabe cuál es el rasgo diana del punto**: eso vive en la prosa del
// inventario y no es computable. La señal es NECESARIA Y NO SUFICIENTE:
// dice «esta pieza es invariante», y la pregunta que decide es **qué
// varía en su lugar y si eso pertenece a este punto**. Esa mitad es
// juicio humano. Medido sobre el rumano: de siete puntos marcados, tres
// eran instancias reales, uno parcial y **tres eran legítimos** —
// `r3-negacion-antepuesta` pone `nu` en los ocho porque en rumano NO HAY
// palabra negativa que no lo exija: la invariancia es propiedad de la
// LENGUA, no del lote. Un gate que suspendiera por la señal sola
// suspendería lengua bien enseñada.
//
// Por eso esto no bloquea: CUENTA, y exige que cada punto marcado lleve
// su juicio ESCRITO. Es la forma del `pisoCero` y la de la cuarentena —
// el invariante no es un número, es «cero marcados sin motivo escrito».
const norm = (s: string) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}-]/gu, '').trim();
const toks = (s: string) => s.split(/\s+/).map(norm).filter(Boolean);

/** El umbral del coordinador: una pieza que aparece en ≥80 % de los ítems
 *  ya se aprende en el primero. No es 100 % a propósito — `r4-gd-lui-formula`
 *  pone `lui` en 7 de 8, y el octavo es justamente su contraejemplo. */
export const UMBRAL = 0.8;

/** Las piezas con signo que separan una frase de la otra: `+w` la que
 *  entra, `-w` la que sale. Es la operación que se le pide al alumno, y
 *  la comparten la corrección (mala→buena) y la transformación
 *  (fuente→respuesta). Escrita UNA vez a propósito. */
function diff(antes: string, despues: string): string[] {
  const bolsa = new Map<string, number>();
  for (const w of toks(antes)) bolsa.set(w, (bolsa.get(w) ?? 0) + 1);
  const entran: string[] = [];
  for (const w of toks(despues)) { const c = bolsa.get(w) ?? 0; if (c > 0) bolsa.set(w, c - 1); else entran.push(`+${w}`); }
  const salen = [...bolsa].flatMap(([w, n]) => Array<string>(n).fill(`-${w}`));
  return [...entran, ...salen].sort();
}

/** La OPERACIÓN que el ítem pide, como piezas con signo. `null` si el
 *  formato no se sabe leer: «no medido» no es «limpio». */
export function operacionDe(x: any): string[] | null {
  if (x?.type === 'error_correction') return diff(String(x.data?.sentence ?? ''), String(x.data?.correct ?? ''));
  // TRANSFORMACIÓN (rumano, desde el lote 23). Es el MISMO diff que la
  // corrección —fuente → respuesta, qué palabras entran y cuáles salen—
  // porque es literalmente lo que se le pide al alumno. Va aquí y no en
  // la máquina del formato: la primera versión de esta lectura nació
  // dentro de `transformacion-ro.ts`, o sea la copia N+1 de una regla que
  // ya existía, y se retiró antes de publicarse. **Y hacía falta de
  // verdad**: sin esta rama, `operacionDe` devuelve null para todo ítem
  // de transformación y la pasada de varianza los cuenta como «no
  // medidos», que es exactamente lo que pasa con los 24 de mediación.
  if (x?.type === 'transformation') return diff(String(x.data?.source ?? ''), String(x.data?.answer ?? ''));
  if (x?.type === 'fill_blank')
    return ((x.data?.blanks ?? []) as any[]).map((b) => `=${norm(String(b?.answer ?? ''))}`).sort();
  return null;
}

export interface Varianza {
  punto: string;
  n: number;
  /** Operaciones DISTINTAS entre los ítems legibles. */
  distintas: number;
  sinLeer: number;
  /** Piezas presentes en ≥ UMBRAL de los ítems, con su cuenta. */
  invariantes: { pieza: string; en: number }[];
  /** Lo que varía en su lugar. Es lo que hay que mirar para juzgar. */
  variable: string[];
  /** NINGÚN ítem legible. «No medido» NO es «cobertura 1»: la primera
   *  versión devolvía `distintas: 0` para los ocho ítems de mediación de
   *  `r10-registro-tramite` y el informe los listaba como «operación
   *  idéntica en todos» — ni error ni cero, el número de al lado. */
  medido: boolean;
}

export function varianzaDe(punto: string, xs: any[]): Varianza {
  const ops = xs.map(operacionDe);
  const leidas = ops.filter((o): o is string[] => o !== null);
  const cuenta = new Map<string, number>();
  for (const o of leidas) for (const w of new Set(o)) cuenta.set(w, (cuenta.get(w) ?? 0) + 1);
  const invariantes = [...cuenta]
    .filter(([, n]) => leidas.length > 0 && n / leidas.length >= UMBRAL)
    .map(([pieza, en]) => ({ pieza, en }))
    .sort((a, b) => b.en - a.en || a.pieza.localeCompare(b.pieza));
  const fijas = new Set(invariantes.map((i) => i.pieza));
  return {
    punto, n: xs.length, distintas: new Set(leidas.map((o) => o.join(' '))).size,
    sinLeer: ops.length - leidas.length, invariantes,
    variable: [...cuenta.keys()].filter((w) => !fijas.has(w)).sort(),
    medido: leidas.length > 0,
  };
}

/** Los puntos cuya operación tiene una pieza invariante. `minimo` evita
 *  marcar puntos con dos o tres ítems, donde «el 80 %» no dice nada. */
export function puntosConRasgoInvariante(
  porPunto: Map<string, any[]>, minimo = 4,
): Varianza[] {
  const r: Varianza[] = [];
  for (const [p, xs] of porPunto) {
    if (xs.length < minimo) continue;
    const v = varianzaDe(p, xs);
    if (v.medido && v.invariantes.length) r.push(v);
  }
  return r.sort((a, b) => a.punto.localeCompare(b.punto));
}

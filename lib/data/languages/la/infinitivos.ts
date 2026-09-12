// lib/data/languages/la/infinitivos.ts
//
// LOS CINCO INFINITIVOS. Punto: `l8-infinitivo-sustantivo`.
//
// «El infinitivo como sujeto y como objeto: `errāre hūmānum est`.
// Transfiere casi entero desde el español.» Y por eso el `varia` no es la
// función —que es un regalo— sino **el tiempo y la voz**: lo que hay que
// saber producir son cinco formas, no una.
//
// ── LO QUE LA MÁQUINA TENÍA ANTES DE ESTO ────────────────────────────
//
// Uno solo. El presente activo está en el lexicón como DATO (`infinitivo`),
// porque de él sale la conjugación. Los otros cuatro no existían, así que
// el punto no se podía escribir: su `varia` pide tiempo y voz y la máquina
// sólo daba una casilla de cinco.
//
// ── LOS CINCO, CON SU CUENTA EN EL CORPUS ────────────────────────────
//
// Sumados sobre los 24 verbos de L1, en 227.301 tokens:
//
//     presente activo    570    `amāre`, `habēre`, `dīcere`, `audīre`
//     perfecto pasivo    185    `amātus esse`  (perifrástico)
//     presente pasivo    116    `amārī`, `habērī`, `dīcī`, `audīrī`
//     perfecto activo     40    `amāvisse`
//     futuro activo       20    `amātūrus esse`  (perifrástico)
//
// Los cinco existen. Ninguno es una forma de manual.
//
// ── LA REGLA DEL PASIVO NO ES UNA, SON DOS ───────────────────────────
//
// La 1.ª, la 2.ª y la 4.ª cambian la `-e` final por `-ī`: `amāre` → `amārī`.
// La 3.ª pierde la sílaba entera: `dūcere` → `dūcī`, no *`dūcerī`. Es el
// mismo perfil que el futuro de `l5-futuro-dos-formas`: dos reglas
// presentadas como una es como se fabrica un error sistemático.
//
// ── Y UNA SUPLECIÓN, MEDIDA ──────────────────────────────────────────
//
// `faciō` NO hace *`facī`: su pasivo es `fierī`, que es el infinitivo de
// `fīō`. Comprobado en el corpus: `facī` ×0, `fierī` ×118. No es una
// rareza de gramática — es la forma corriente, y `irregulares.ts` ya
// declara que `fīō` hace de pasivo de `faciō`.
import type { EntradaVerbal } from './paradigma-la';
import { conjugacionDe, esMixta, temaDePerfecto } from './paradigma-la';

export type TiempoInfinitivo = 'presente' | 'perfecto' | 'futuro';
export type VozInfinitivo = 'activa' | 'pasiva';

export interface Infinitivo {
  forma: string;
  tiempo: TiempoInfinitivo;
  voz: VozInfinitivo;
  /** Los de perfecto pasivo y futuro activo son DOS palabras y su primera
   *  concuerda con el sujeto. Quien los examine tiene que fijar el género y
   *  el número, o el ítem no tiene una respuesta sola. */
  perifrastico: boolean;
}

/** Los que hacen su pasivo con otro verbo. Lista cerrada y medida, no una
 *  regla: `facī` ×0 contra `fierī` ×118. */
export const PASIVO_SUPLETIVO: Record<string, string> = {
  'faciō': 'fierī',
};

/** Los que NO TIENEN pasiva, con el motivo. No es un `catch` silencioso: si
 *  un verbo nuevo no encaja en las cuatro conjugaciones hay que decidir qué
 *  es, no dejar que un `try` se lo trague. */
export const SIN_PASIVA: Record<string, string> = {
  'sum': 'es intransitivo y su infinitivo `esse` no pertenece a ninguna de las cuatro conjugaciones: no hay pasiva que formar',
};

export function infinitivoPresenteActivo(e: EntradaVerbal): string {
  return e.infinitivo.normalize('NFC');
}

/** La 1.ª, 2.ª y 4.ª cambian `-e` por `-ī`; la 3.ª pierde `-ere` entero. */
export function infinitivoPresentePasivo(e: EntradaVerbal): string | null {
  if (SIN_PASIVA[e.lema.normalize('NFC')]) return null;
  const sup = PASIVO_SUPLETIVO[e.lema.normalize('NFC')];
  if (sup) return sup;
  const inf = infinitivoPresenteActivo(e);
  // La mixta (`capiō/capere`) se comporta como la 3.ª: `capī`.
  const comoTercera = conjugacionDe(e) === 3 || esMixta(e);
  return comoTercera ? inf.replace(/ere$/, 'ī') : inf.replace(/e$/, 'ī');
}

export function infinitivoPerfectoActivo(e: EntradaVerbal): string | null {
  const t = temaDePerfecto(e);
  return t === null ? null : `${t}isse`;
}

/** El participio de perfecto, del supino. `null` si el verbo no lo declara. */
function participioPerfecto(e: EntradaVerbal): string | null {
  const s = (e as EntradaVerbal & { supino?: string }).supino;
  return s ? s.normalize('NFC').replace(/um$/, 'us') : null;
}

/** El caso del participio en los perifrásticos. NO es un adorno.
 *
 *  Lo destapó el pase adversarial sobre el primer lote, ya verde: el marco
 *  decía `Sē rēgem ___ dīcit` —acusativo con infinitivo— y la respuesta
 *  escrita era `vīsūrus esse`, en nominativo. En esa construcción el
 *  participio concuerda con el sujeto ACUSATIVO: `vīsūrum esse`. El gate no
 *  podía cazarlo porque la máquina no sabía declinarlo, así que el error
 *  estaba en los dos sitios a la vez.
 *
 *  Con `dīcitur`, `vidētur` y demás pasivas personales el sujeto es
 *  nominativo y va `vīsūrus esse`. Los dos existen y el ítem tiene que
 *  decir cuál. */
export type CasoDelParticipio = 'nom' | 'ac';

function concordar(base: string, genero: 'm' | 'f' | 'n', caso: CasoDelParticipio): string {
  if (caso === 'nom') return genero === 'f' ? `${base}a` : genero === 'n' ? `${base}um` : `${base}us`;
  return genero === 'f' ? `${base}am` : genero === 'n' ? `${base}um` : `${base}um`;
}

/** Perfecto pasivo: `amātus esse` / `amātum esse`. Perifrástico, y la
 *  primera palabra concuerda en género Y caso con el sujeto. */
export function infinitivoPerfectoPasivo(e: EntradaVerbal, genero: 'm' | 'f' | 'n' = 'm', caso: CasoDelParticipio = 'nom'): string | null {
  const p = participioPerfecto(e);
  if (p === null) return null;
  return `${concordar(p.replace(/us$/, ''), genero, caso)} esse`;
}

/** Futuro activo: `amātūrus esse` / `amātūrum esse`. */
export function infinitivoFuturoActivo(e: EntradaVerbal, genero: 'm' | 'f' | 'n' = 'm', caso: CasoDelParticipio = 'nom'): string | null {
  const s = (e as EntradaVerbal & { supino?: string }).supino;
  if (!s) return null;
  return `${concordar(s.normalize('NFC').replace(/um$/, 'ūr'), genero, caso)} esse`;
}

/** Los cinco de un verbo, saltándose los que no puede formar. */
export function todosLosInfinitivos(e: EntradaVerbal, genero: 'm' | 'f' | 'n' = 'm', caso: CasoDelParticipio = 'nom'): Infinitivo[] {
  const out: Infinitivo[] = [
    { forma: infinitivoPresenteActivo(e), tiempo: 'presente', voz: 'activa', perifrastico: false },
  ];
  const pres = infinitivoPresentePasivo(e);
  if (pres !== null) out.push({ forma: pres, tiempo: 'presente', voz: 'pasiva', perifrastico: false });
  const pa = infinitivoPerfectoActivo(e);
  if (pa) out.push({ forma: pa, tiempo: 'perfecto', voz: 'activa', perifrastico: false });
  const pp = infinitivoPerfectoPasivo(e, genero, caso);
  if (pp) out.push({ forma: pp, tiempo: 'perfecto', voz: 'pasiva', perifrastico: true });
  const fa = infinitivoFuturoActivo(e, genero, caso);
  if (fa) out.push({ forma: fa, tiempo: 'futuro', voz: 'activa', perifrastico: true });
  return out;
}

/** Lo que escribiría quien aplicara la regla de la 1.ª a todos: cambiar la
 *  `-e` por `-ī`. En la 3.ª da *`dūcerī`, que no existe. */
export function pasivoIngenuo(e: EntradaVerbal): string {
  return infinitivoPresenteActivo(e).replace(/e$/, 'ī');
}

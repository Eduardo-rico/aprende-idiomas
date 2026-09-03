// lib/data/languages/la/cantidad.ts
//
// LA CANTIDAD VOCÁLICA, COMPROBABLE.
//
// Existe porque el test que decía «el latín pasa la norma ortográfica»
// era un no-op para los mácrons. Ejecutado sobre el primer lote:
//
//     bueno        : []
//     SIN mácron   : []      (Filium pater amat.)
//     mácron FALSO : []      (Fīlīum pāter āmāt.)
//
// Verde con los mácrons correctos, con ninguno y con todos inventados.
// En aquel lote estaban bien —el latinista los verificó uno a uno— pero
// **eso no lo sabía el repositorio**, y vienen 46 lotes más de este
// formato. Un gate que no puede distinguir el acierto del disparate no
// está midiendo lo que su nombre dice.
//
// ── LOS DOS CAMINOS, Y EL SEGUNDO ES INDEPENDIENTE ────────────────────
//
// Un validador que recomputa la cantidad con las mismas reglas con las
// que se escribió se da la razón a sí mismo. Así que hay dos:
//
//   1. `lexicon-l1.ts` + la máquina de paradigmas: los lemas llevan su
//      cantidad (Lewis & Short, Allen & Greenough) y `paradigma-la.ts`
//      deriva las formas. Es lo que compara `revisarCantidad`.
//
//      **Fuente única a propósito.** Hubo aquí una segunda tabla con los
//      mismos lemas, y al ir a envenenarla para el control positivo se vio
//      que el auditor ya no la leía: era el mismo dato en dos sitios, que
//      es la forma de que uno de los dos envejezca sin que falle nada.
//   2. `REFLEJOS`: la evolución al español, que **no consulta el mácrón**.
//      Que `servum` diera «siervo» prueba que la e es BREVE, porque sólo
//      ĕ diptonga; que `amīcum` diera «amigo» prueba que la i es LARGA,
//      porque ĭ habría dado e. Audita el lexicón desde fuera, y es además
//      el camino que le sirve al alumno de este curso.
//
// Los pares que discriminan son ĕ/ē, ŏ/ō, ĭ/ī y ŭ/ū; ă/ā no deja huella.

//
// ── UNA CORRECCIÓN, Y LA DESTAPÓ LA MÁQUINA DE PARADIGMAS ─────────────
//
// La primera versión indexaba por la forma SIN mácrons y guardaba UNA
// macronización por clave. En la 1.ª declinación eso colapsa justo el par
// que el mácrón distingue: `puella` (nominativo) y `puellā` (ablativo)
// tienen la misma clave. Resultado, medido:
//
//     revisarCantidad('puellā')  →  ["cantidad-erronea"]
//
// El gate rechazaba latín correcto, que es peor que no tenerlo — «un gate
// ruidoso es un gate apagado». Ahora las formas aceptables se DERIVAN de
// la máquina de paradigmas sobre el léxico de L1, así que una clave puede
// tener varias macronizaciones válidas y todas se aceptan.
//
// El límite queda declarado y no disimulado: sin análisis morfológico,
// una comprobación sobre el texto **no puede** rechazar `puellā` donde
// tocaba `puella`. Lo que sí caza, que es lo que importa, es la forma que
// NINGUNA celda del paradigma produce: `amicus` sin mácrón, `āmīcus` con
// mácrons inventados, `amāt` con la temática larga ante -t.
//
// Y la circularidad se rompe por fuera: los mácrons de los LEMAS los
// audita `REFLEJOS`, que no consulta ni el lexicón ni la máquina.


/** El camino independiente: la evolución al español no mira el mácrón.
 *  `[forma latina, descendiente, cantidad que EXIGE el reflejo]` */
export const REFLEJOS: [string, string, 'larga' | 'breve', string][] = [
  ['servum', 'siervo', 'breve', 'sólo ĕ diptonga en ie'],
  ['dominam', 'dueña', 'breve', 'sólo ŏ diptonga en ue'],
  ['videt', 've', 'breve', 'ĭ > e; ī habría dado i'],
  ['timet', 'teme', 'breve', 'ĭ > e'],
  ['mittunt', 'meten', 'breve', 'ĭ > e'],
  ['amicum', 'amigo', 'larga', 'ī > i; ĭ habría dado e'],
  ['filium', 'hijo', 'larga', 'ī > i'],
  ['ducit', 'aduce', 'larga', 'ū > u; ŭ habría dado o'],
];

import { paradigmaNominal, paradigmaVerbal, declinar, conjugar } from './paradigma-la';
import { NOMBRES_L1, VERBOS_L1 } from './lexicon-l1';

const VOCAL_LARGA = /[āēīōūĀĒĪŌŪ]/;
export const sinMacron = (s: string) =>
  s.normalize('NFD').replace(/̄/g, '').normalize('NFC').toLowerCase();

export interface HallazgoCantidad { forma: string; esperado: string; clase: 'cantidad-erronea' | 'forma-desconocida' }

/** Compara la cantidad de cada palabra del texto contra el lexicón.
 *  Una forma que no está en el lexicón es un hallazgo, no un permiso:
 *  callar ante lo desconocido es como el gate anterior no medía nada. */
/** clave sin mácrons → todas las macronizaciones que el paradigma produce.
 *  Se construye una vez, a partir de la máquina y del léxico de L1. */
let CACHE: Map<string, Set<string>> | null = null;
export function formasValidas(): Map<string, Set<string>> {
  if (CACHE) return CACHE;
  const m = new Map<string, Set<string>>();
  const mete = (f: string) => {
    const k = sinMacron(f);
    if (!m.has(k)) m.set(k, new Set());
    m.get(k)!.add(f.normalize('NFC').toLowerCase());
  };
  for (const e of NOMBRES_L1) for (const f of Object.values(paradigmaNominal(e))) mete(f);
  for (const e of VERBOS_L1) for (const f of Object.values(paradigmaVerbal(e))) mete(f);
  CACHE = m;
  return m;
}

/** Invalida la caché. Existe para el CONTROL POSITIVO del auditor: sin
 *  esto no hay forma de meterle una cantidad falsa y comprobar que se
 *  queja, y un auditor que nunca se ha visto fallar es un sello. */
export function _invalidarCache(): void { CACHE = null; }

export function revisarCantidad(texto: string): HallazgoCantidad[] {
  const out: HallazgoCantidad[] = [];
  const validas = formasValidas();
  for (const bruta of texto.normalize('NFC').split(/[^\p{L}̄]+/u).filter(Boolean)) {
    const clave = sinMacron(bruta);
    const opciones = validas.get(clave);
    if (!opciones) { out.push({ forma: bruta, esperado: '(no está en el léxico de L1)', clase: 'forma-desconocida' }); continue; }
    if (!opciones.has(bruta.normalize('NFC').toLowerCase())) {
      out.push({ forma: bruta, esperado: [...opciones].join(' o '), clase: 'cantidad-erronea' });
    }
  }
  return out;
}

/** Audita el LEXICÓN contra los reflejos romances, que es el camino que
 *  no lo consulta. Devuelve [] si el lexicón y la evolución concuerdan. */
export function auditarPorReflejos(): string[] {
  const out: string[] = [];
  for (const [forma, esp, exige, razon] of REFLEJOS) {
    // Se busca en las formas que la MÁQUINA produce, no sólo en el
    // lexicón: así el reflejo audita lo generado, que es donde un error
    // se replica en cientos de formas. Sigue sin ser circular — que
    // `servum` diera «siervo» no lo sabe ni el lexicón ni la máquina.
    const opciones = formasValidas().get(sinMacron(forma));
    if (!opciones || opciones.size === 0) { out.push(`«${forma}» no lo produce la máquina y el reflejo «${esp}» lo exige`); continue; }
    if (opciones.size > 1) { out.push(`«${forma}» tiene ${opciones.size} macronizaciones válidas (${[...opciones].join(', ')}): el reflejo «${esp}» no puede decidir`); continue; }
    const real = [...opciones][0]!;
    const tieneLarga = VOCAL_LARGA.test(real.normalize('NFC'));
    if (exige === 'larga' && !tieneLarga) out.push(`«${real}» sin vocal larga, pero «${esp}» la exige (${razon})`);
    if (exige === 'breve' && tieneLarga) out.push(`«${real}» con vocal larga, pero «${esp}» exige breve (${razon})`);
  }
  return out;
}

/** El lema declarado y la forma que la máquina deriva del GENITIVO tienen
 *  que coincidir. Es el gate que la tabla duplicada tapaba: la máquina no
 *  usa el lema para nada en la 2.ª declinación regular, así que un lema
 *  mal macronizado no cambiaba ni una forma generada — y por eso
 *  envenenarlo no hacía saltar a nadie. Ahora sí. */
export function revisarCoherenciaLexico(): string[] {
  const out: string[] = [];
  for (const e of NOMBRES_L1) {
    // Los `-er`/`-ir` devuelven el lema por construcción: ahí no hay nada
    // que contrastar, y se dice en vez de fingir cobertura.
    if (/(er|ir)$/.test(e.lema.normalize('NFC')) && e.genero !== 'n') continue;
    const derivado = declinar(e, 'nom', 'sg');
    if (derivado.normalize('NFC') !== e.lema.normalize('NFC')) {
      out.push(`«${e.lema}»: del genitivo «${e.genitivo}» la máquina deriva «${derivado}»`);
    }
  }
  for (const e of VERBOS_L1) {
    const derivado = conjugar(e, '1sg');
    if (derivado.normalize('NFC') !== e.lema.normalize('NFC')) {
      out.push(`«${e.lema}»: del infinitivo «${e.infinitivo}» la máquina deriva «${derivado}»`);
    }
  }
  return out;
}

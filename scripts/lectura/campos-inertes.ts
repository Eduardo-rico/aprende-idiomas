// scripts/lectura/campos-inertes.ts
//
// QUÉ CAMPOS DEL LEXICÓN NO TIENEN CONSECUENCIA.
//
//   npx tsx scripts/lectura/campos-inertes.ts
//
// ── DE DÓNDE SALE ESTO ───────────────────────────────────────────────
//
// El 2026-09-13 una fuente externa encontró dos cantidades mal en el
// lexicón —`bestia` por `bēstia`, `anxius` por `ānxius`— y las dos habían
// sobrevivido por el mismo motivo: **no mueven el acento**. Las dos palabras
// son esdrújulas con la vocal larga o breve, así que el error era invisible
// en la única consecuencia que el sistema deriva de la cantidad.
//
// > Un lexicón que sólo se valida por sus consecuencias no puede cazar un
// > dato del que no cuelga ninguna consecuencia visible.
//
// De ahí la pregunta que este script contesta: **¿qué OTROS campos son
// inertes hoy?** Ahí no hay gate posible por construcción, y ahí vive la
// siguiente pareja de `bēstia`.
//
// ── CÓMO SE MIDE ─────────────────────────────────────────────────────
//
// Mutando. Para cada campo de cada entrada se cambia el valor y se vuelve a
// pedir TODO lo que la máquina saca de esa entrada —paradigma nominal,
// infectum, perfectum, pasiva, subjuntivo, participios, infinitivos—. Si la
// huella no cambia, el campo es inerte para esa entrada: nada de lo que se
// produce depende de él, así que ningún gate que mire lo producido puede
// verlo.
//
// Inerte NO significa mal. Significa que si estuviera mal, no se notaría.
import {
  NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1,
} from '../../lib/data/languages/la/lexicon-l1';
import { ADJETIVOS_3A, paradigmaAdjetivo3a } from '../../lib/data/languages/la/adjetivos-3a';
import {
  paradigmaNominal, paradigmaVerbal, infectum, perfectum, pasivaInfectum, declinarAdjetivo,
} from '../../lib/data/languages/la/paradigma-la';
import { todosLosParticipios } from '../../lib/data/languages/la/participios';
import { todosLosInfinitivos } from '../../lib/data/languages/la/infinitivos';
import { paradigmaSubjuntivo } from '../../lib/data/languages/la/subjuntivo';

type Entrada = Record<string, unknown>;

/** La huella son las FORMAS, no las glosas.
 *
 *  La primera versión de este script metía la salida entera en el JSON y
 *  entonces `VERBOS_L1.glosa` salía «consumida» al 0 % de inercia — porque
 *  la glosa del verbo se cuela en la del participio (`que ${glosa}`). Eso es
 *  consumo COSMÉTICO, no verificación: nada comprueba esa cadena, sólo se
 *  arrastra. El instrumento estaba diciendo que un campo estaba vigilado
 *  cuando lo único que hacía era viajar.
 *
 *  Es exactamente la clase de error que este script existe para cazar, y me
 *  la comí escribiéndolo. Las claves `glosa` se quitan de la huella. */
export function sinGlosas(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(sinGlosas);
  if (x && typeof x === 'object') {
    return Object.fromEntries(Object.entries(x as Record<string, unknown>)
      .filter(([k]) => k !== 'glosa').map(([k, v]) => [k, sinGlosas(v)]));
  }
  return x;
}
const seguro = (f: () => unknown) => { try { return JSON.stringify(sinGlosas(f())); } catch { return 'ERROR'; } };

export const huellaNombre = (n: Entrada) => seguro(() => paradigmaNominal(n as never));
export const huellaVerbo = (v: Entrada) => seguro(() => [
  infectum(v as never), perfectum(v as never), pasivaInfectum(v as never),
  paradigmaSubjuntivo(v as never), todosLosParticipios(v as never),
  todosLosInfinitivos(v as never), paradigmaVerbal(v as never),
]);
export const huellaAdj = (a: Entrada) => seguro(() =>
  (['m', 'f', 'n'] as const).flatMap((g) => (['sg', 'pl'] as const).flatMap((n) =>
    (['nom', 'gen', 'dat', 'ac', 'abl', 'voc'] as const).map((c) => declinarAdjetivo(a as never, g, c, n)))));
export const huella3a = (a: Entrada) => seguro(() => paradigmaAdjetivo3a(a as never));

export interface CampoInerte { tabla: string; campo: string; inertes: string[]; conDato: number }

/** Cómo se estropea cada campo. Cambiar una cadena por otra cadena no vale
 *  para el género ni para el número de terminaciones, que son enumerados. */
const MUTAR: Record<string, (v: unknown) => unknown> = {
  genero: (v) => (v === 'm' ? 'f' : v === 'f' ? 'm' : 'm'),
  terminaciones: (v) => (v === 2 ? 1 : 2),
};
const porDefecto = (v: unknown) => (typeof v === 'string' ? `${v}X` : v);

export function barrer(tabla: string, entradas: Entrada[], campos: string[], huella: (e: Entrada) => string): CampoInerte[] {
  return campos.map((campo) => {
    const inertes: string[] = [];
    let conDato = 0;
    for (const e of entradas) {
      if (!(campo in e) || e[campo] === undefined) continue;
      conDato++;
      const antes = huella(e);
      if (huella({ ...e, [campo]: (MUTAR[campo] ?? porDefecto)(e[campo]) }) === antes) inertes.push(String(e.lema));
    }
    return { tabla, campo, inertes, conDato };
  });
}

export function todosLosCampos(): CampoInerte[] {
  return [
    ...barrer('NOMBRES_L1', NOMBRES_L1 as unknown as Entrada[], ['genitivo', 'genero', 'glosa'], huellaNombre),
    ...barrer('VERBOS_L1', VERBOS_L1 as unknown as Entrada[], ['infinitivo', 'perfecto', 'supino', 'glosa'], huellaVerbo),
    ...barrer('ADJETIVOS_L1', ADJETIVOS_L1 as unknown as Entrada[], ['tema', 'glosa'], huellaAdj),
    ...barrer('ADJETIVOS_3A', ADJETIVOS_3A as unknown as Entrada[], ['genitivo', 'terminaciones', 'glosa'], huella3a),
  ];
}

async function main() {
  const campos = todosLosCampos();
  console.log('CAMPO                          inertes / con dato');
  for (const c of campos.sort((a, b) => (b.inertes.length / Math.max(1, b.conDato)) - (a.inertes.length / Math.max(1, a.conDato)))) {
    const pct = c.conDato ? Math.round((100 * c.inertes.length) / c.conDato) : 0;
    const marca = pct === 100 ? '  ★ INERTE DEL TODO' : pct > 0 ? '  ⚠ inerte a medias' : '';
    console.log(`  ${`${c.tabla}.${c.campo}`.padEnd(26)} ${String(c.inertes.length).padStart(4)} / ${String(c.conDato).padStart(3)}  ${String(pct).padStart(3)} %${marca}`);
    if (pct > 0 && pct < 100) console.log(`      ${c.inertes.slice(0, 8).join(' ')}${c.inertes.length > 8 ? ' …' : ''}`);
  }
  console.log(`
LO QUE ESTO DICE, al 2026-09-13:

  · la GLOSA es inerte del todo en LAS CUATRO tablas que la llevan —la de
    los verbos también: parecía consumida porque se arrastra a la glosa del
    participio, pero arrastrarse no es verificarse—. Nada de
    lo que la máquina produce depende de ella, y **es lo que el alumno
    lee**. Los tres gates que la tocan —\`glosa-sin-hueco\`,
    \`glosa-regala-la-respuesta\`, \`glosa-sin-giro\`— miran su FORMA y
    ninguno su CONTENIDO. Una glosa falsa pasa todos los gates del
    proyecto.

  · el GÉNERO es inerte en el 83 % de los nombres, porque la 1.ª y la 2.ª
    declinación dan las mismas formas en masculino y femenino. Cruzado
    contra el corpus (\`Gender=\` del treebank): 82 de 83 coinciden, y el
    único que choca —\`diēs\`, m=283 f=370— es de los dos géneros de verdad.
    Inerte, pero correcto.

  · \`terminaciones\` es inerte en \`ācer\`, porque su entrada lleva además
    \`femenino\` y \`neutro\` explícitos. Redundante, no erróneo.

LO QUE NO SE PUEDE HACER DESDE DENTRO: verificar una glosa. El corpus es
latín y la glosa es española; no hay tercer camino en el repositorio. Lo
que la verificaría es una fuente bilingüe o el lingüista adversarial, que
el proyecto ya tiene como skill. Queda dicho, que es lo que se puede
hacer.`);
}
if (process.argv[1]?.endsWith('campos-inertes.ts')) void main();

// lib/data/languages/la/lotes/l5-partes-principales.ts
//
// PRIMER LOTE DE LAS CUATRO PARTES. Punto: `l5-partes-principales`.
//
// «amō, amāre, amāvī, amātum. De la primera sale la persona, de la segunda
// la conjugación, de la tercera todo el perfectum y de la cuarta los
// participios y el supino. No es un apéndice: es el lugar donde vive lo que
// no se deduce.»
//
// ── EL GRADIENTE, MEDIDO SOBRE LOS 22 VERBOS DEL LEXICÓN ─────────────
//
//     0    doce regulares del todo   amō, habeō, audiō, portō…
//     1    `doceō`                   supino `doctum`, no *`docitum`
//     2    `videō`, `inveniō`        perfecto Y supino desviados
//     —    `faciō`, `capiō`, `dūcō`, `mittō`, `legō`
//          3.ª y mixta: NO HAY REGLA que prediga el perfecto
//
// Ese último grupo no es «muy irregular»: es que **para la 3.ª no existe
// patrón**. `dūxī`, `mīsī`, `lēgī`, `fēcī` y `cēpī` no se derivan de nada, y
// por eso el punto dice que las partes principales son el lugar donde vive
// lo que no se deduce. Un lote que no llegue hasta ahí enseña una regla y no
// el motivo de que la ficha tenga cuatro casillas en vez de dos.
//
// El eje va declarado con `null` —no con un número grande— porque «no hay
// regla» y «se aparta mucho» son cosas distintas, y confundirlas haría
// pensar que basta con memorizar más.
//
// ── LA RUTA CIEGA ES APLICAR EL PATRÓN, Y SU PISO ES EXACTO ──────────
//
// Aplicar la regla de la conjugación acierta en los regulares por derecho:
// eso es saber, no adivinar. Su piso es exactamente la fracción de verbos
// regulares del lote, y el gate exige que no lo pase ni por un ítem. Si lo
// pasa, es que algún verbo declarado como desviado en realidad no lo está.
import type { ItemPartes } from '../../../../../scripts/lib/gate-partes-principales';
import { cuantoSeAparta } from '../../../../../scripts/lib/gate-partes-principales';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

const NO_HAY_REGLA = 'es de la 3.ª (o mixta) y para esa clase NO EXISTE patrón que prediga el perfecto: «dūxī», «mīsī», «lēgī», «fēcī» y «cēpī» no se derivan de nada. Hay que guardarlo, y por eso la ficha tiene cuatro casillas';

type Def = [id: string, lema: string, parte: ItemPartes['parte'], pista: string];

const PISTA_REGLA = 'Si es regular, la conjugación lo predice.';
const PISTA_GUARDA = 'Este no lo predice ninguna regla: o se sabe o no se sabe.';

const DEFS: Def[] = [
  // ── SEIS REGULARES · la regla los da ──
  ['la-5p-01', 'amō', 'perfecto', PISTA_REGLA],
  ['la-5p-02', 'portō', 'supino', PISTA_REGLA],
  ['la-5p-03', 'moneō', 'perfecto', PISTA_REGLA],
  ['la-5p-04', 'audiō', 'perfecto', PISTA_REGLA],
  ['la-5p-05', 'custōdiō', 'supino', PISTA_REGLA],
  ['la-5p-06', 'habeō', 'supino', PISTA_REGLA],

  // ── TRES DESVIADOS · la regla existe y falla ──
  ['la-5p-07', 'doceō', 'supino', 'La regla daría *«docitum». No es eso.'],
  ['la-5p-08', 'videō', 'perfecto', 'La regla daría *«viduī». No es eso.'],
  ['la-5p-09', 'inveniō', 'perfecto', 'La regla daría *«invenīvī». No es eso.'],

  // ── CINCO SIN REGLA · el corazón del punto ──
  ['la-5p-10', 'dūcō', 'perfecto', PISTA_GUARDA],
  ['la-5p-11', 'mittō', 'perfecto', PISTA_GUARDA],
  ['la-5p-12', 'legō', 'supino', PISTA_GUARDA],
  ['la-5p-13', 'faciō', 'perfecto', PISTA_GUARDA],
  ['la-5p-14', 'capiō', 'supino', PISTA_GUARDA],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemPartes[] = DEFS.map(([id, lema, parte, pista]) => {
  const verbo = V(lema);
  const seAparta = cuantoSeAparta(verbo);
  // La entrada muestra la primera parte y el infinitivo —de donde sale la
  // conjugación—, y nunca la parte que se pide.
  const entrada = parte === 'supino' && verbo.perfecto
    ? `${verbo.lema}, ${verbo.infinitivo}, ${verbo.perfecto}, ___`
    : `${verbo.lema}, ${verbo.infinitivo}, ___`;
  return {
    id, punto: 'l5-partes-principales', verbo, parte, entrada, pista,
    respuesta: (parte === 'perfecto' ? verbo.perfecto : parte === 'supino' ? verbo.supino : verbo.infinitivo)!,
    ejes: { seAparta, ...(seAparta === null ? { porQueNoHayRegla: NO_HAY_REGLA } : {}) },
  };
});

export const LOTE_PARTES = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

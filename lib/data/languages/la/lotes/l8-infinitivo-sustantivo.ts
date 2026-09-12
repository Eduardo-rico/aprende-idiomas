// lib/data/languages/la/lotes/l8-infinitivo-sustantivo.ts
//
// PRIMER LOTE DEL INFINITIVO. Punto: `l8-infinitivo-sustantivo`.
//
// «El infinitivo como sujeto y como objeto: `errāre hūmānum est`.
// Transfiere casi entero desde el español.»
//
// ── EL PUNTO DECLARA QUÉ *NO* SE EXAMINA, Y ESO MANDA ────────────────
//
// `invarianciaJustificada`: «la función sustantiva del infinitivo es
// idéntica a la española en todos los contextos: variar aquí sería inventar
// dificultad». O sea que la FUNCIÓN es un regalo y no se mide. Lo que se
// mide es la FORMA, y el `varia` lo dice: **el tiempo y la voz**. Son cinco
// casillas y el lote las toca las cinco.
//
// ── LA MÁQUINA TENÍA UNA DE LAS CINCO ────────────────────────────────
//
// El presente activo está en el lexicón como dato, porque de él sale la
// conjugación. Los otros cuatro no existían: `lib/data/languages/la/
// infinitivos.ts` entra con este lote. Sumados sobre los 24 verbos de L1:
//
//     presente activo    570 tokens      perfecto activo     40
//     presente pasivo    234             futuro activo       20
//     perfecto pasivo    185
//
// ── LAS DOS REGLAS DEL PASIVO, QUE SON EL TRABAJO DEL LOTE ───────────
//
// La 1.ª, la 2.ª y la 4.ª cambian la `-e` por `-ī`: `vidēre` → `vidērī`.
// La 3.ª pierde la sílaba entera: `dīcere` → `dīcī`, **no** *`dīcerī`.
// Mismo perfil que `l5-futuro-dos-formas`: dos reglas presentadas como una
// fabrican un error sistemático. Cuatro de los cinco pasivos del lote son
// de 3.ª o mixta —los que refutan la regla ingenua— y el quinto, `vidērī`,
// está para que el alumno vea DÓNDE sí vale.
//
// ── Y UNA SUPLECIÓN MEDIDA ───────────────────────────────────────────
//
// `faciō` no hace *`facī`: su pasivo es `fierī`, el infinitivo de `fīō`.
// `facī` ×0 contra `fierī` ×118. No es una rareza — es la forma corriente,
// y es la que un alumno que aplique cualquier regla no va a producir nunca.
//
// ── LOS DOS ÍTEMS «GRATIS», DECLARADOS COMO TALES ────────────────────
//
// Los de presente activo se contestan copiando el infinitivo del lexicón.
// Están porque el `varia` son cinco casillas y dejarlos fuera sería no
// tocar una; y el gate mide exactamente cuánto regalan —`copiar el
// infinitivo` sale al 17 %— en vez de que el lote lo disimule.
//
// ── LOS PERIFRÁSTICOS DECLARAN GÉNERO **Y CASO** ─────────────────────
//
// `factus esse` concuerda con el sujeto en las dos cosas. Lo del caso salió
// del pase adversarial sobre este lote ya verde: un marco decía `Sē rēgem
// ___ dīcit` —acusativo con infinitivo— y la respuesta escrita era
// `vīsūrus esse`, en nominativo. En esa construcción va `vīsūrum esse`. El
// gate no podía cazarlo porque **la máquina tampoco sabía declinarlo**: el
// error estaba en los dos sitios a la vez, que es como no se caza solo.
//
// Ahora el lote toca los dos casos —10 y 11 en nominativo con pasiva
// personal, 12 en acusativo— y el 10 lleva sujeto NEUTRO, para que la
// concordancia no se pueda acertar poniendo `-us` a todo.
//
// ── Y EL MARCO USA SÓLO PALABRAS DE L1 ───────────────────────────────
//
// Cuatro de los doce marcos de la primera versión usaban palabras que la
// máquina no produce: `scīmus`, `crēdunt`, `mundus`, `nūntius`, `vērum`. El
// gate miraba la respuesta y no el contexto. Un ítem cuyo marco no se
// entiende no mide la forma: mide si adivinas de qué va la frase.
import type { ItemInfinitivo } from '../../../../../scripts/lib/gate-infinitivo';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, tiempo: ItemInfinitivo['tiempo'], voz: ItemInfinitivo['voz'],
            respuesta: string, marco: string, pista: string, glosa: string,
            genero?: 'm' | 'f' | 'n', caso?: 'nom' | 'ac'];

const DEFS: Def[] = [
  // ── PRESENTE ACTIVO · la casilla que el lexicón ya da ──
  ['la-inf-01', 'habeō', 'presente', 'activa', 'habēre', '___ bonum est.',
   'infinitivo de presente, voz activa — sujeto de la frase', 'Tener es bueno.'],
  ['la-inf-02', 'audiō', 'presente', 'activa', 'audīre', 'Discipulus ___ vult.',
   'infinitivo de presente, voz activa — objeto de «vult»', 'El discípulo quiere oír.'],

  // ── PRESENTE PASIVO · la 3.ª pierde la sílaba, y ahí está el punto ──
  ['la-inf-03', 'dīcō', 'presente', 'pasiva', 'dīcī', 'Nōmen ___ potest.',
   'infinitivo de presente, voz PASIVA, verbo de 3.ª', 'El nombre puede ser dicho.'],
  ['la-inf-04', 'dūcō', 'presente', 'pasiva', 'dūcī', 'Populus ___ potest.',
   'infinitivo de presente, voz PASIVA, verbo de 3.ª', 'El pueblo puede ser conducido.'],
  ['la-inf-05', 'mittō', 'presente', 'pasiva', 'mittī', 'Litterae ___ possunt.',
   'infinitivo de presente, voz PASIVA, verbo de 3.ª', 'La carta puede ser enviada.'],
  ['la-inf-06', 'faciō', 'presente', 'pasiva', 'fierī', 'Id ___ nōn potest.',
   'infinitivo de presente, voz PASIVA — y este verbo lo hace con otro',
   'Eso no puede hacerse.'],
  // El contraste: aquí la regla de la 1.ª SÍ vale, y sin este ítem el
  // alumno aprendería que nunca vale, que es el error simétrico.
  ['la-inf-07', 'videō', 'presente', 'pasiva', 'vidērī', 'Rēx ___ vult.',
   'infinitivo de presente, voz PASIVA, verbo de 2.ª', 'El rey quiere ser visto.'],

  // ── PERFECTO ACTIVO · del tema de perfecto, no del infinitivo ──
  ['la-inf-08', 'dīcō', 'perfecto', 'activa', 'dīxisse', 'Rēgem ___ audīmus.',
   'infinitivo de PERFECTO, voz activa', 'Oímos que el rey habló.'],
  ['la-inf-09', 'habeō', 'perfecto', 'activa', 'habuisse', 'Poētam ___ dīcunt.',
   'infinitivo de PERFECTO, voz activa', 'Dicen que el poeta tuvo.'],

  // ── PERFECTO PASIVO · dos palabras y concordancia ──
  ['la-inf-10', 'faciō', 'perfecto', 'pasiva', 'factum esse', 'Caelum ___ dīcitur.',
   'infinitivo de PERFECTO, voz PASIVA — el sujeto es NEUTRO y va en nominativo',
   'Se dice que el cielo fue hecho.', 'n', 'nom'],
  ['la-inf-11', 'mittō', 'perfecto', 'pasiva', 'missus esse', 'Servus ___ vidētur.',
   'infinitivo de PERFECTO, voz PASIVA — el sujeto es masculino y va en nominativo',
   'Parece que el siervo fue enviado.', 'm', 'nom'],

  // ── FUTURO ACTIVO · perifrástico, y en ACUSATIVO con infinitivo ──
  // El participio sigue al sujeto: aquí `rēgem` es acusativo y el
  // participio también. Con `dīcitur` el sujeto sería nominativo y la
  // respuesta `vīsūrus esse`. Los dos existen y el ítem dice cuál.
  ['la-inf-12', 'videō', 'futuro', 'activa', 'vīsūrum esse', 'Rēgem ___ dīcunt.',
   'infinitivo de FUTURO, voz activa — el sujeto «rēgem» es ACUSATIVO y el participio lo sigue',
   'Dicen que el rey verá.', 'm', 'ac'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemInfinitivo[] = DEFS.map(([id, lema, tiempo, voz, respuesta, marco, pista, glosa, genero, caso]) => ({
  id, punto: 'l8-infinitivo-sustantivo', verbo: V(lema), tiempo, voz, respuesta, marco, pista, glosa,
  ejes: { perifrastico: respuesta.includes(' '), ...(genero ? { genero } : {}), ...(caso ? { caso } : {}) },
}));

export const LOTE_INFINITIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// lib/data/languages/la/lotes/l5-imperfecto.ts
//
// PRIMER LOTE DEL IMPERFECTO. Punto: `l5-imperfecto`.
//
// «amābam, monēbam, regēbam. Un solo infijo para las cinco clases, y coincide
// en valor con el imperfecto español.» `varia`: **la conjugación, porque el
// infijo es `-bā-` en la 1.ª y la 2.ª y `-ēbā-` en las otras tres**.
//
// ── EL VARIA, VERIFICADO CONTRA LA MÁQUINA ───────────────────────────
//
//     1.ª     amābam       -bā-
//     2.ª     monēbam      -bā-
//     3.ª     legēbam      -ēbā-
//     4.ª     audiēbam     -ēbā-
//     mixta   capiēbam     -ēbā-
//
// Exacto. Y el lote tiene que traer los DOS infijos o su eje no existe: el
// gate lo exige leyendo el infijo de la forma producida, no de una etiqueta.
//
// ── EL VALOR SÍ TRANSFIERE, Y ESO NO ES POCO ─────────────────────────
//
// El punto lo declara `regalo` con razón: el imperfecto latino y el español
// coinciden en valor —acción no acabada, trasfondo, costumbre—, así que el
// alumno no tiene que aprender CUÁNDO usarlo. Lo que cuesta es la forma, y
// dentro de la forma, saber a qué clase pertenece el verbo.
//
// Por eso la ruta ciega que se mide es la misma que en el presente: aplicar
// la clase equivocada. Un alumno que trate `legere` como `monēre` escribirá
// *«legēbam» con el infijo corto y se equivocará en las tres clases altas.
import type { ItemConjugar } from '../../../../../scripts/lib/gate-conjugar';
import { claseDe } from '../../../../../scripts/lib/gate-conjugar';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import { conjugar } from '../paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, persona: ItemConjugar['persona'],
            marco: string, glosa: string];

const DEFS: Def[] = [
  // ── INFIJO CORTO · 1.ª y 2.ª ──
  ['la-5i-01', 'amō', '1sg', 'Rosam ___.', 'Amaba la rosa.'],
  ['la-5i-02', 'portō', '3sg', 'Donum ___.', 'Llevaba el regalo.'],
  ['la-5i-03', 'laudō', '2pl', 'Poetam ___.', 'Alababan al poeta.'],
  ['la-5i-04', 'moneō', '1pl', 'Discipulos ___.', 'Advertíamos a los discípulos.'],
  ['la-5i-05', 'videō', '2sg', 'Reginam ___.', 'Veías a la reina.'],
  ['la-5i-06', 'timeō', '3pl', 'Bellum ___.', 'Temían la guerra.'],

  // ── INFIJO LARGO · 3.ª, 4.ª y mixta ──
  ['la-5i-07', 'legō', '1sg', 'Verba ___.', 'Leía las palabras.'],
  ['la-5i-08', 'mittō', '3sg', 'Dona ___.', 'Enviaba los regalos.'],
  ['la-5i-09', 'dūcō', '2sg', 'Servos ___.', 'Guiabas a los esclavos.'],
  ['la-5i-10', 'audiō', '1pl', 'Poetam ___.', 'Oíamos al poeta.'],
  ['la-5i-11', 'custōdiō', '3pl', 'Templum ___.', 'Guardaban el templo.'],
  ['la-5i-12', 'inveniō', '2pl', 'Terram ___.', 'Encontraban la tierra.'],
  ['la-5i-13', 'capiō', '1sg', 'Gladium ___.', 'Cogía la espada.'],
  ['la-5i-14', 'faciō', '3sg', 'Opus ___.', 'Hacía la obra.'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemConjugar[] = DEFS.map(([id, lema, persona, marco, glosa]) => {
  const verbo = V(lema);
  return {
    id, punto: 'l5-imperfecto', verbo, persona, tiempo: 'imperfecto' as const, marco, glosa,
    respuesta: conjugar(verbo, persona, 'imperfecto'),
    pista: `«${verbo.lema}, ${verbo.infinitivo}» — el infijo depende de la clase.`,
    ejes: { clase: claseDe(verbo) },
  };
});

export const LOTE_IMPERFECTO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

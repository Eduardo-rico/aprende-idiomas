// lib/data/languages/la/lotes/l6-deponentes.ts
//
// `l6-deponentes` — la misma forma, el sentido contrario.
//
//     Servus dominum sequitur.     DEPONENTE   «el esclavo SIGUE al señor»
//     Servus ā dominō vocātur.     PASIVA      «el esclavo ES LLAMADO»
//
// `sequitur` y `vocātur` son morfológicamente idénticos: misma desinencia,
// mismo tiempo, misma voz aparente. Lo único que los separa es el lema, y
// ése es el punto entero.
//
// ── POR QUÉ LA MITAD DEL LOTE NO ES DEPONENTE ────────────────────────
//
// Si los catorce fueran deponentes, «leer todo `-tur` en activo» los
// acertaría todos y el lote instalaría la regla contraria de la que quita.
// Con dos lecturas, activa y pasiva son complementarias y sus tasas suman
// uno: siete y siete es la única salida. Es el mismo diseño que
// `l7-no-coincide-espanol`, por el mismo motivo.
//
// ── EL VARIA ES OTRA TRAMPA DENTRO DE LA MISMA ───────────────────────
//
// «si el deponente lleva objeto en acusativo o en ablativo (ūtor rige
// ablativo)». De los ocho deponentes de L1 sólo `ūtor` rige ablativo, y va
// en el lote: quien haya aprendido que el deponente es activo todavía puede
// equivocarse de caso.
//
// ── Y SU PERFECTO ES EL DE LA PASIVA PERIFRÁSTICA ────────────────────
//
// `locūtus est` ×35 y `amātus est` son la misma construcción y significan lo
// contrario: «habló» y «fue amado». El lote de `l6-pasiva-perifrastica` tuvo
// que dejar fuera precisamente estas formas, y aquí están.
import type { ItemDeponente, Rige } from '../../../../../scripts/lib/gate-deponentes';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, lema: string, forma: string, esDeponente: boolean, rige: Rige,
            latin: string, glosa: string, respuesta: string, error: string];

const DEFS: Def[] = [
  // ── DEPONENTES · forma pasiva, sentido activo ──
  ['la-dp-01', 'sequor', 'sequitur', true, 'acusativo',
   'Servus dominum sequitur.', 'El esclavo ___ al señor.', 'sigue', 'es seguido por'],
  ['la-dp-02', 'loquor', 'loquitur', true, 'acusativo',
   'Puer verbum loquitur.', 'El niño ___ la palabra.', 'habla', 'es hablado por'],
  ['la-dp-03', 'hortor', 'hortātur', true, 'acusativo',
   'Discipulōs magister hortātur.', 'El maestro ___ a los discípulos.', 'anima', 'es animado por'],
  ['la-dp-04', 'morior', 'moritur', true, 'ninguno',
   'Fīlius moritur.', 'El hijo ___.', 'muere', 'es muerto'],
  ['la-dp-05', 'proficīscor', 'proficīscitur', true, 'ninguno',
   'Nauta ad urbem proficīscitur.', 'El marinero ___ hacia la ciudad.', 'parte', 'es partido'],
  ['la-dp-06', 'patior', 'patiuntur', true, 'acusativo',
   'Servī īram patiuntur.', 'Los esclavos ___ la ira.', 'sufren', 'son sufridos por'],
  // EL DEL VARIA: rige ABLATIVO, no acusativo.
  ['la-dp-07', 'ūtor', 'ūtitur', true, 'ablativo',
   'Magister gladiō ūtitur.', 'El maestro ___ la espada.', 'usa', 'es usado por'],

  // ── PASIVAS DE VERDAD · la misma desinencia, el sentido que parece ──
  ['la-dp-08', 'vocō', 'vocātur', false, 'ninguno',
   'Servus ā dominō vocātur.', 'El esclavo ___ por el señor.', 'es llamado', 'llama'],
  ['la-dp-09', 'videō', 'vidētur', false, 'ninguno',
   'Signum ā rēge vidētur.', 'La señal ___ por el rey.', 'es vista', 've'],
  ['la-dp-10', 'mittō', 'mittuntur', false, 'ninguno',
   'Puerī ā magistrō mittuntur.', 'Los niños ___ por el maestro.', 'son enviados', 'envían'],
  ['la-dp-11', 'dīcō', 'dīcitur', false, 'ninguno',
   'Verbum ā magistrō dīcitur.', 'La palabra ___ por el maestro.', 'es dicha', 'dice'],
  ['la-dp-12', 'audiō', 'audītur', false, 'ninguno',
   'Vōx ā populō audītur.', 'La voz ___ por el pueblo.', 'es oída', 'oye'],
  // Aquí estuvo `fīunt`, la pasiva de `faciō`. El gate lo rechazó y tenía
  // razón: es supletiva —sale de `fīō`— y su desinencia `-unt` es ACTIVA de
  // forma. Una pasiva que no parece pasiva no examina este punto, porque la
  // trampa es justamente que se parecen.
  ['la-dp-13', 'laudō', 'laudantur', false, 'ninguno',
   'Discipulī ā rēge laudantur.', 'Los discípulos ___ por el rey.', 'son alabados', 'alaban'],
  ['la-dp-14', 'custōdiō', 'custōdītur', false, 'ninguno',
   'Templum ā servīs custōdītur.', 'El templo ___ por los esclavos.', 'es custodiado', 'custodia'],
];

const FUENTE: ItemDeponente[] = DEFS.map(([id, lema, forma, esDep, rige, latin, glosa, respuesta, error]) => ({
  id, punto: 'l6-deponentes', lema, forma, rige, latin, glosa, respuesta, elErrorDiana: error,
  ejes: { esDeponente: esDep, rige },
}));

export const LOTE_DEPONENTES = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

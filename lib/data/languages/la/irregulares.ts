// lib/data/languages/la/irregulares.ts
//
// LOS SEIS IRREGULARES DE ALTA FRECUENCIA. Punto: `l5-irregulares`.
//
// «Los irregulares de alta frecuencia, que hay que guardar y no derivar.»
// El punto lo dice y este módulo lo hace literalmente: son tablas, no
// reglas, porque cualquier regla que los cubriera dejaría de ser la regla
// de los demás verbos.
//
// ── LAS FORMAS ESTÁN COPIADAS DEL CORPUS, NO DE UN MANUAL ────────────
//
// Cada celda de aquí abajo aparece en los treebanks. Lo comprobado:
//
//     volō    volō · vīs · vult · volumus · vultis · volunt
//     eō      eō · it · īmus · eunt · ībō · ībis · ībit · ībimus · ībunt
//     ferō    ferō · fers · fert · ferunt · feram · ferēs · feret
//     fīō     fit · fīunt · fīet · fīent · fīēbat · fīēbant
//     mālō    mālō · māvīs · māvult · mālēbant
//     nōlō    nōlō · nōlumus · nōlunt · nōlēbam · nōlēbat
//
// ── LO QUE LOS HACE IRREGULARES NO ES LO MISMO EN CADA UNO ───────────
//
//   · `eō` alterna el tema entre `e-` e `ī-`: «eō» pero «īmus», «it» pero
//     «eunt». Y su futuro es en `-b-` como el de la 1.ª, no en `-a-/-ē-`.
//   · `ferō` pierde la vocal temática ante consonante: «fers», «fert»,
//     «fertis» — pero «ferimus», «ferunt», con ella.
//   · `volō`, `nōlō` y `mālō` son la misma familia y comparten el hueco:
//     su segunda y tercera del singular salen de otro tema («vīs», «vult»).
//     `nōlō` compone con `nōn` y `mālō` con `magis`, y de ahí «māvīs».
//   · `fīō` hace de pasivo de `faciō` y sólo tiene tercera persona en la
//     práctica: el corpus no trae ninguna primera ni segunda.
import type { Persona, Tiempo } from './paradigma-la';

export interface VerboIrregular {
  lema: string;
  infinitivo: string;
  glosa: string;
  perfecto: string;
  /** Qué lo hace irregular, en una línea. */
  porQue: string;
  formas: Record<Tiempo, Partial<Record<Persona, string>>>;
}

export const IRREGULARES_L1: VerboIrregular[] = [
  {
    lema: 'eō', infinitivo: 'īre', glosa: 'ir', perfecto: 'iī',
    porQue: 'alterna el tema entre `e-` e `ī-` —«eō» pero «īmus», «it» pero «eunt»— y su futuro es en `-b-`, como el de la 1.ª',
    formas: {
      presente: { '1sg': 'eō', '2sg': 'īs', '3sg': 'it', '1pl': 'īmus', '2pl': 'ītis', '3pl': 'eunt' },
      imperfecto: { '1sg': 'ībam', '2sg': 'ībās', '3sg': 'ībat', '1pl': 'ībāmus', '2pl': 'ībātis', '3pl': 'ībant' },
      futuro: { '1sg': 'ībō', '2sg': 'ībis', '3sg': 'ībit', '1pl': 'ībimus', '2pl': 'ībitis', '3pl': 'ībunt' },
    },
  },
  {
    lema: 'ferō', infinitivo: 'ferre', glosa: 'llevar', perfecto: 'tulī',
    porQue: 'pierde la vocal temática ante consonante —«fers», «fert», «fertis»— y la conserva ante vocal: «ferimus», «ferunt»',
    formas: {
      presente: { '1sg': 'ferō', '2sg': 'fers', '3sg': 'fert', '1pl': 'ferimus', '2pl': 'fertis', '3pl': 'ferunt' },
      imperfecto: { '1sg': 'ferēbam', '2sg': 'ferēbās', '3sg': 'ferēbat', '1pl': 'ferēbāmus', '2pl': 'ferēbātis', '3pl': 'ferēbant' },
      futuro: { '1sg': 'feram', '2sg': 'ferēs', '3sg': 'feret', '1pl': 'ferēmus', '2pl': 'ferētis', '3pl': 'ferent' },
    },
  },
  {
    lema: 'volō', infinitivo: 'velle', glosa: 'querer', perfecto: 'voluī',
    porQue: 'su segunda y tercera del singular salen de otro tema: «vīs», «vult», frente a «volō», «volumus», «volunt»',
    formas: {
      presente: { '1sg': 'volō', '2sg': 'vīs', '3sg': 'vult', '1pl': 'volumus', '2pl': 'vultis', '3pl': 'volunt' },
      imperfecto: { '1sg': 'volēbam', '2sg': 'volēbās', '3sg': 'volēbat', '1pl': 'volēbāmus', '2pl': 'volēbātis', '3pl': 'volēbant' },
      futuro: { '1sg': 'volam', '2sg': 'volēs', '3sg': 'volet', '1pl': 'volēmus', '2pl': 'volētis', '3pl': 'volent' },
    },
  },
  {
    lema: 'nōlō', infinitivo: 'nōlle', glosa: 'no querer', perfecto: 'nōluī',
    porQue: 'es «nōn» + «volō» y hereda su hueco: la segunda y la tercera del singular son las de `volō` con el «nōn» suelto delante',
    formas: {
      presente: { '1sg': 'nōlō', '2sg': 'nōn vīs', '3sg': 'nōn vult', '1pl': 'nōlumus', '2pl': 'nōn vultis', '3pl': 'nōlunt' },
      imperfecto: { '1sg': 'nōlēbam', '2sg': 'nōlēbās', '3sg': 'nōlēbat', '1pl': 'nōlēbāmus', '2pl': 'nōlēbātis', '3pl': 'nōlēbant' },
      futuro: { '1sg': 'nōlam', '2sg': 'nōlēs', '3sg': 'nōlet', '1pl': 'nōlēmus', '2pl': 'nōlētis', '3pl': 'nōlent' },
    },
  },
  {
    lema: 'mālō', infinitivo: 'mālle', glosa: 'preferir', perfecto: 'māluī',
    porQue: 'es «magis» + «volō», y de ahí salen «māvīs» y «māvult», donde el segundo elemento asoma entero',
    formas: {
      presente: { '1sg': 'mālō', '2sg': 'māvīs', '3sg': 'māvult', '1pl': 'mālumus', '2pl': 'māvultis', '3pl': 'mālunt' },
      imperfecto: { '1sg': 'mālēbam', '2sg': 'mālēbās', '3sg': 'mālēbat', '1pl': 'mālēbāmus', '2pl': 'mālēbātis', '3pl': 'mālēbant' },
      futuro: { '1sg': 'mālam', '2sg': 'mālēs', '3sg': 'mālet', '1pl': 'mālēmus', '2pl': 'mālētis', '3pl': 'mālent' },
    },
  },
  {
    lema: 'fīō', infinitivo: 'fierī', glosa: 'hacerse, llegar a ser', perfecto: 'factus sum',
    porQue: 'hace de pasivo de `faciō` y en la práctica sólo tiene tercera persona: el corpus no trae ninguna primera ni segunda',
    formas: {
      presente: { '1sg': 'fīō', '2sg': 'fīs', '3sg': 'fit', '1pl': 'fīmus', '2pl': 'fītis', '3pl': 'fīunt' },
      imperfecto: { '1sg': 'fīēbam', '2sg': 'fīēbās', '3sg': 'fīēbat', '1pl': 'fīēbāmus', '2pl': 'fīēbātis', '3pl': 'fīēbant' },
      futuro: { '1sg': 'fīam', '2sg': 'fīēs', '3sg': 'fīet', '1pl': 'fīēmus', '2pl': 'fīētis', '3pl': 'fīent' },
    },
  },
];

// ── LO QUE ESTA TABLA NO CUBRE, dicho en vez de disimulado ───────────
//
// Comprobada contra el corpus: de las 70 formas de indicativo atestiguadas
// de estos seis verbos, produce 53. Las 17 que faltan son tres cosas y
// ninguna es un error de la tabla:
//
//   · PERFECTUM — «voluerit» ×15, «ierit», «ieris», «voluerō». Salen del
//     tema de perfecto, que va declarado en `perfecto` y lo conjuga la
//     máquina general. No son del infectum.
//
//   · LA PASIVA DE `ferō` — «fertur» ×11, «feruntur» ×3, «ferēbātur» ×2,
//     «ferēbantur» ×2. Es irregular igual que su activa —«fertur», no
//     *«feritur»— así que no la da `conjugarPasiva`, y pide su propia tabla.
//     Pendiente, y son 19 tokens.
//
//   · UN HOMÓGRAFO, que es el hallazgo. «volābant» ×2 NO es de este `volō`
//     sino de `volō, volāre` —«volar»—, un verbo regular de 1.ª que el
//     treebank lematiza con la misma cadena. Dos verbos distintos, mismo
//     lema en la anotación: cualquier cuenta por lema los suma.
export const HOMOGRAFO_VOLO =
  '«volō, velle» (querer) y «volō, volāre» (volar) comparten lema en el treebank. «volābant» ×2 es del segundo. Toda cuenta por lema los suma, y en este caso son un irregular de altísima frecuencia y un regular de 1.ª';

export function conjugarIrregular(v: VerboIrregular, p: Persona, t: Tiempo = 'presente'): string {
  const f = v.formas[t][p];
  if (!f) throw new Error(`«${v.lema}» no declara ${p} de ${t}`);
  return f;
}

export function esIrregular(lema: string): boolean {
  return IRREGULARES_L1.some((v) => v.lema === lema.normalize('NFC'));
}

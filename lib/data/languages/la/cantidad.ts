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
//   1. `LEXICON`: las formas con su cantidad, tomadas de Lewis & Short y
//      Allen & Greenough. Es lo que compara `revisarCantidad`.
//   2. `REFLEJOS`: la evolución al español, que **no consulta el mácrón**.
//      Que `servum` diera «siervo» prueba que la e es BREVE, porque sólo
//      ĕ diptonga; que `amīcum` diera «amigo» prueba que la i es LARGA,
//      porque ĭ habría dado e. Audita el lexicón desde fuera, y es además
//      el camino que le sirve al alumno de este curso.
//
// Los pares que discriminan son ĕ/ē, ŏ/ō, ĭ/ī y ŭ/ū; ă/ā no deja huella.

/** Forma sin mácrons (minúsculas) → forma con la cantidad marcada. */
export const LEXICON: Record<string, string> = {
  // ── nombres, 1.ª ──
  puella: 'puella', puellam: 'puellam', puellae: 'puellae', puellas: 'puellās',
  amica: 'amīca', amicam: 'amīcam', amicae: 'amīcae', amicas: 'amīcās',
  vicina: 'vīcīna', vicinam: 'vīcīnam', vicinae: 'vīcīnae', vicinas: 'vīcīnās',
  filia: 'fīlia', filiam: 'fīliam', filiae: 'fīliae', filias: 'fīliās',
  regina: 'rēgīna', reginam: 'rēgīnam', reginae: 'rēgīnae', reginas: 'rēgīnās',
  domina: 'domina', dominam: 'dominam', dominae: 'dominae', dominas: 'dominās',
  // ── nombres, 1.ª masculina ──
  nauta: 'nauta', nautam: 'nautam', nautae: 'nautae', nautas: 'nautās',
  agricola: 'agricola', agricolam: 'agricolam', agricolae: 'agricolae', agricolas: 'agricolās',
  // ── nombres, 2.ª ──
  amicus: 'amīcus', amicum: 'amīcum', amici: 'amīcī', amicos: 'amīcōs',
  vicinus: 'vīcīnus', vicinum: 'vīcīnum', vicini: 'vīcīnī', vicinos: 'vīcīnōs',
  filius: 'fīlius', filium: 'fīlium', filii: 'fīliī', filios: 'fīliōs',
  servus: 'servus', servum: 'servum', servi: 'servī', servos: 'servōs',
  medicus: 'medicus', medicum: 'medicum', medici: 'medicī', medicos: 'medicōs',
  discipulus: 'discipulus', discipulum: 'discipulum', discipuli: 'discipulī', discipulos: 'discipulōs',
  colonus: 'colōnus', colonum: 'colōnum', coloni: 'colōnī', colonos: 'colōnōs',
  puer: 'puer', puerum: 'puerum', pueri: 'puerī', pueros: 'puerōs',
  // ── verbos. La vocal temática se ABREVIA ante -t y -nt finales
  //    (Allen & Greenough §603.f, *brevis brevians*): `amat`, no `amāt`.
  amat: 'amat', amant: 'amant',
  vocat: 'vocat', vocant: 'vocant',
  laudat: 'laudat', laudant: 'laudant',
  salutat: 'salūtat', salutant: 'salūtant',
  exspectat: 'exspectat', exspectant: 'exspectant',
  videt: 'videt', vident: 'vident',
  timet: 'timet', timent: 'timent',
  monet: 'monet', monent: 'monent',
  ducit: 'dūcit', ducunt: 'dūcunt',
  mittit: 'mittit', mittunt: 'mittunt',
  audit: 'audit', audiunt: 'audiunt',
  invenit: 'invenit', inveniunt: 'inveniunt',
};

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

const VOCAL_LARGA = /[āēīōūĀĒĪŌŪ]/;
export const sinMacron = (s: string) =>
  s.normalize('NFD').replace(/̄/g, '').normalize('NFC').toLowerCase();

export interface HallazgoCantidad { forma: string; esperado: string; clase: 'cantidad-erronea' | 'forma-desconocida' }

/** Compara la cantidad de cada palabra del texto contra el lexicón.
 *  Una forma que no está en el lexicón es un hallazgo, no un permiso:
 *  callar ante lo desconocido es como el gate anterior no medía nada. */
export function revisarCantidad(texto: string): HallazgoCantidad[] {
  const out: HallazgoCantidad[] = [];
  for (const bruta of texto.normalize('NFC').split(/[^\p{L}̄]+/u).filter(Boolean)) {
    const clave = sinMacron(bruta);
    const esperado = LEXICON[clave];
    if (!esperado) { out.push({ forma: bruta, esperado: '(no está en el lexicón)', clase: 'forma-desconocida' }); continue; }
    if (bruta.normalize('NFC').toLowerCase() !== esperado.normalize('NFC').toLowerCase()) {
      out.push({ forma: bruta, esperado, clase: 'cantidad-erronea' });
    }
  }
  return out;
}

/** Audita el LEXICÓN contra los reflejos romances, que es el camino que
 *  no lo consulta. Devuelve [] si el lexicón y la evolución concuerdan. */
export function auditarPorReflejos(): string[] {
  const out: string[] = [];
  for (const [forma, esp, exige, razon] of REFLEJOS) {
    const enLexicon = LEXICON[forma];
    if (!enLexicon) { out.push(`«${forma}» no está en el lexicón y el reflejo «${esp}» lo exige`); continue; }
    const tieneLarga = VOCAL_LARGA.test(enLexicon.normalize('NFC'));
    if (exige === 'larga' && !tieneLarga) out.push(`«${enLexicon}» sin vocal larga, pero «${esp}» la exige (${razon})`);
    if (exige === 'breve' && tieneLarga) out.push(`«${enLexicon}» con vocal larga, pero «${esp}» exige breve (${razon})`);
  }
  return out;
}

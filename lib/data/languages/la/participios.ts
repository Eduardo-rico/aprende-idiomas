// lib/data/languages/la/participios.ts
//
// LOS PARTICIPIOS. Bloquean SIETE puntos del inventario —todo el bloque 8
// más `l6-pasiva-perifrastica`— y hasta ahora no existían.
//
// ── LOS CUATRO, Y DE DÓNDE SALE CADA UNO ─────────────────────────────
//
//     presente activo   amāns, amantis      del INFINITIVO
//     perfecto pasivo   amātus, -a, -um     del SUPINO (4.ª parte)
//     futuro activo     amātūrus, -a, -um   del SUPINO
//     gerundivo         amandus, -a, -um    del INFINITIVO
//
// Los tres últimos se declinan como adjetivos de 1.ª clase, que la máquina
// ya tenía. El de presente es un adjetivo de 3.ª de UNA terminación, que es
// la pieza que acaba de entrar — y por eso este módulo no se pudo escribir
// antes.
//
// ── EL GENITIVO DEL PARTICIPIO DE PRESENTE ACORTA LA VOCAL ───────────
//
// `amāns` tiene `ā` larga y `amantis` la tiene breve: la vocal se abrevia
// ante `-ns` y ante `-nt-`. Es la misma ley que obligó a sacar la 3.ª del
// singular pasiva de la 2.ª del plural, y aquí muerde al revés: hay que
// ACORTAR al derivar el genitivo, no alargar.
//
//     amāns → amantis      monēns → monentis
//     legēns → legentis    audiēns → audientis
//
// Atestiguados: `vidēns`, `dīcēns`, `veniēns`, `aperiēns`, `volentī`,
// `persequentibus`, `cōnsentiēns` — 2.967 tokens de participio de presente
// en el corpus.
import type { EntradaVerbal } from './paradigma-la';
import { esMixta } from './paradigma-la';
import type { EntradaAdjetivo3a } from './adjetivos-3a';

/** Acorta SÓLO LA ÚLTIMA vocal, que es la que la ley toca.
 *
 *  La primera versión usaba un `sinM` que quitaba todos los macrones de la
 *  cadena, y `dūcēns` daba «ducentis» en vez de «dūcentis»: la `ū` del tema
 *  no tiene nada que ver con el acortamiento ante `-nt-`. El gerundivo tenía
 *  el mismo fallo y habría dado *«salutandus» por «salūtandus».
 *
 *  Es la clase de error que sólo se ve en un verbo con DOS vocales largas, y
 *  el lexicón tenía uno. */
const acortaLaUltima = (s: string): string => {
  const f = s.normalize('NFC');
  const i = f.search(/[āēīōū](?![a-zāēīōū])/);
  if (i < 0) return f;
  const corta = f[i]!.normalize('NFD').replace(/[\u0304]/g, '').normalize('NFC');
  return f.slice(0, i) + corta + f.slice(i + 1);
};

/** El participio de presente, con su genitivo: es un adjetivo de 3.ª de una
 *  terminación y se devuelve como tal, para que lo declinen las mismas
 *  funciones que a `omnis` o a `fēlīx`. */
export function participioPresente(e: EntradaVerbal): EntradaAdjetivo3a {
  const inf = e.infinitivo.normalize('NFC');
  let nom: string;
  if (inf.endsWith('āre') || inf.endsWith('ēre')) nom = `${inf.slice(0, -2)}ns`;
  else if (inf.endsWith('īre')) nom = `${inf.slice(0, -3)}iēns`;
  else if (esMixta(e)) nom = `${inf.slice(0, -3)}iēns`;
  else nom = `${inf.slice(0, -3)}ēns`;
  // El genitivo acorta la vocal ante `-nt-`: «amāns» → «amantis».
  const gen = `${acortaLaUltima(nom.slice(0, -2))}ntis`;
  return {
    lema: nom, genitivo: gen, glosa: `que ${e.glosa}`, terminaciones: 1,
  };
}

export interface ParticipioAdjetival {
  /** El nominativo masculino singular, que es como se cita. */
  lema: string;
  glosa: string;
}

/** Del SUPINO, la cuarta parte principal. `null` si el verbo no la declara
 *  —`timeō` no tiene supino y `sum` hace `futūrum`, que es participio de
 *  futuro y no supino—. */
export function participioPerfecto(e: EntradaVerbal): ParticipioAdjetival | null {
  if (!e.supino) return null;
  return { lema: `${e.supino.normalize('NFC').slice(0, -2)}us`, glosa: `${e.glosa} (participio de perfecto)` };
}

/** Los futuros que NO salen del supino porque el verbo no lo tiene. `sum`
 *  hace `futūrus` —28 formas atestiguadas en el corpus— y su cuarta parte
 *  principal es precisamente ese participio, no un supino. Devolver `null`
 *  para `sum` era perder la forma más frecuente de esta casilla. */
const FUTUROS_IRREGULARES: Record<string, string> = { sum: 'futūrus' };

export function participioFuturo(e: EntradaVerbal): ParticipioAdjetival | null {
  const irr = FUTUROS_IRREGULARES[e.lema.normalize('NFC')];
  if (irr) return { lema: irr, glosa: `que va a ${e.glosa}` };
  if (!e.supino) return null;
  return { lema: `${e.supino.normalize('NFC').slice(0, -2)}ūrus`, glosa: `que va a ${e.glosa}` };
}

/** El gerundivo, o participio de futuro pasivo. Del infinitivo, con la
 *  misma partición de clases que el de presente. */
export function gerundivo(e: EntradaVerbal): ParticipioAdjetival {
  const inf = e.infinitivo.normalize('NFC');
  let base: string;
  if (inf.endsWith('āre') || inf.endsWith('ēre')) base = `${acortaLaUltima(inf.slice(0, -2))}ndus`;
  else if (inf.endsWith('īre')) base = `${inf.slice(0, -3)}iendus`;
  else if (esMixta(e)) base = `${inf.slice(0, -3)}iendus`;
  else base = `${inf.slice(0, -3)}endus`;
  return { lema: base, glosa: `que hay que ${e.glosa}` };
}

/** El gerundivo ARCAICO en `-undus` por `-endus`, que la 3.ª y la 4.ª
 *  admiten: «faciundīs», «dīcundī» en el corpus. No es una licencia
 *  poética; es la forma vieja, y el brief del latinista avisa de que el
 *  latín escolar le pone asterisco indebidamente. */
export function gerundivoArcaico(e: EntradaVerbal): string | null {
  const g = gerundivo(e).lema;
  return g.endsWith('endus') ? `${g.slice(0, -5)}undus` : null;
}

export function todosLosParticipios(e: EntradaVerbal): {
  presente: EntradaAdjetivo3a; perfecto: ParticipioAdjetival | null;
  futuro: ParticipioAdjetival | null; gerundivo: ParticipioAdjetival;
} {
  return {
    presente: participioPresente(e),
    perfecto: participioPerfecto(e),
    futuro: participioFuturo(e),
    gerundivo: gerundivo(e),
  };
}

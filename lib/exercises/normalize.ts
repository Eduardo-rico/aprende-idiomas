// lib/exercises/normalize.ts
// Shared answer normalizer for text-input exercise cards. Accents are
// significant (PT minimal pairs like estão/estao differ); we only trim,
// lowercase, and NFC-normalize so composed vs decomposed accents match.
//
// Fase F (2026-09-01): además, ș/ț con cedilla se leen como ș/ț con coma
// (`canonicalRo`). «şi» y «și» son la misma palabra en dos codificaciones
// y el alumno escribe con el teclado que tiene; sin esto, una respuesta
// correcta se marca mal. Es inocuo para el portugués (cero cedillas s/t
// en todo su plano de datos) y NO toca la «ç».
import { canonicalRo } from '@/lib/lang/ortografia-ro';

// ⚠ EL LATÍN NO PASA POR AQUÍ, y es a propósito. Su comparación vive en
// `lib/lang/ortografia-la.ts` (`comparaLa`) porque necesita algo que esta
// función no puede dar: **dos modos**. Por defecto es insensible al
// mácrón —el alumno escribe con el teclado que tiene— pero los puntos
// cuyo tema ES la cantidad vocálica tienen que compararse en modo
// sensible, o `malus` pasaría por `mālus` y **el ítem no podría fallar
// nunca**. Es «la normalización tapa el rasgo examinado», que este
// proyecto ya pagó tres veces.
//
// Cuando existan ítems latinos, la tarjeta debe llamar a `comparaLa` con
// `sensibleACantidad` tomado del punto declarado — NO reimplementar la
// normalización aquí, que es como se desincronizan las reglas.

export function normalizeAnswer(s: string): string {
  return canonicalRo(s.trim().toLowerCase());
}
export function answersMatch(a: string, b: string): boolean {
  return normalizeAnswer(a) === normalizeAnswer(b);
}

/** Igual que `answersMatch`, pero el SIGNO FINAL de la clave es opcional.
 *
 *  Existe porque en un ejercicio cuya respuesta es una frase entera, el
 *  punto final no es lengua: quien escribe «Comprei-a na estação» sin
 *  punto ha hecho la transformación perfecta, y suspenderlo mete un fallo
 *  falso en el FSRS — la misma familia que el cloze sin pista y el
 *  multi-hueco. Lo destapó una auditoría sobre el primer lote de
 *  transformación: 7 de 24 respuestas eran frases terminadas en punto.
 *
 *  **Sólo se hace opcional el signo QUE LA CLAVE LLEVA**, no cualquiera.
 *  Si se ignorara todo signo terminal, «Comprei-a na estação?» pasaría
 *  como equivalente de la afirmativa — y en una transformación de
 *  afirmativa a interrogativa el signo ES la respuesta.
 *
 *  ── LA MITAD QUE FALTABA, y es la forma exacta del defecto que esta
 *  función existe para arreglar (rumano, lote 23) ──
 *  El arreglo original neutraliza «la clave lleva punto y el alumno no lo
 *  pone» y deja abierta la simétrica: **«la clave lleva ADMIRACIÓN y el
 *  alumno pone punto»**. Los ocho imperativos del primer lote de
 *  transformación rumana tienen la clave en `!`, y el rumano escribe
 *  imperativos con punto rutinariamente — el corpus del proyecto trae «și
 *  stai lângă mine.» tal cual. Quien escribe `Mergi la piață.` ha hecho la
 *  transformación perfecta y entraba como fallo en el FSRS.
 *
 *  Así que cuando la clave acaba en `!`, el conjunto aceptado es
 *  {`!`, `.`, sin signo}: la admiración es énfasis tipográfico, no lengua.
 *  **El `?` sigue siendo estricto** y por la razón de arriba: ahí el signo
 *  ES la respuesta. Medido antes de tocarlo: de las 516 respuestas
 *  publicadas en portugués, **cero** acaban en `!`, así que esto no
 *  reinterpreta ni un ítem existente. Si algún día hay una transformación
 *  cuyo punto sea EXCLAMAR, esta línea deja de valer para ella y hará
 *  falta declararlo en el ítem. */
export function answersMatchFinal(a: string, b: string): boolean {
  const A = normalizeAnswer(a), B = normalizeAnswer(b);
  if (A === B) return true;
  const signo = B.match(/[.!?…]$/)?.[0];
  if (!signo) return false;
  // Con `endsWith` y no con una regex construida: `new RegExp('?$')` es un
  // cuantificador sin nada delante y REVIENTA, así que la versión con
  // regex habría muerto justo en el signo que hay que dejar estricto.
  const aceptados = signo === '!' ? ['!', '.'] : [signo];
  const quita = (s: string) => {
    for (const g of aceptados) if (s.endsWith(g)) return s.slice(0, -g.length).trimEnd();
    return s;
  };
  return quita(A) === quita(B);
}

/** La coma ante una conjunción adversativa: opcional al comparar.
 *
 *  En «Portugal é um país pequeno mas variado» la coma ante «mas» es
 *  admisible —y en el período largo, normativa—, así que quien corrige o
 *  traduce BIEN lo que el ítem examina puede caer por una coma que nadie
 *  juzga. Es la misma familia que el punto final: puntuación que no es el
 *  punto y que sin embargo decide el acierto, metiendo un fallo falso en
 *  el FSRS.
 *
 *  No colisiona con ningún contenido: el único punto de puntuación del
 *  currículo, `b11-pontuacao-sintatica`, está declarado piso cero, y su
 *  descripción cubre la coma entre sujeto y verbo, la explicativa y los
 *  dos puntos — nunca ésta.
 *
 *  Exige espacio DESPUÉS del conector, así que la parentética «Ele,
 *  porém, não veio» no entra: ahí las dos comas son un par y quitar una
 *  sola sí cambia la frase. */
const COMA_ADVERSATIVA = /,(\s+(?:mas|porém|contudo|todavia)\s)/gi;
const sinComaAdversativa = (s: string) => s.replace(COMA_ADVERSATIVA, '$1');

/** El criterio COMPLETO con el que una tarjeta acepta una respuesta
 *  escrita: `answersMatchFinal` más la coma de la adversativa.
 *
 *  Existe como función aparte para que el nombre no mienta —
 *  `answersMatchFinal` sigue significando exactamente lo que dice y se
 *  compone aquí— y para que los gates de producción puedan importar EL
 *  MISMO criterio en vez de copiarlo: una alternativa declarada a mano
 *  sólo hace falta cuando esta función diría que no. */
export function answersMatchCard(a: string, b: string): boolean {
  if (answersMatchFinal(a, b)) return true;
  return answersMatchFinal(sinComaAdversativa(a), sinComaAdversativa(b));
}

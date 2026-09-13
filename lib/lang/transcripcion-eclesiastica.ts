// lib/lang/transcripcion-eclesiastica.ts
//
// CÓMO SUENA UNA PALABRA LATINA, ESCRITO PARA UN HISPANOHABLANTE.
//
// ══ NO ES `textoParaVoz`, Y CONFUNDIRLAS SERÍA APLICAR TODO DOS VECES ═
//
// `textoParaVoz` prepara el texto para una voz ITALIANA, que ya hace sola
// la mitad de estas reglas: sus propios comentarios lo dicen —«y así `c`+e
// da /tʃ/», «el italiano da /k/ ante consonante»—. Por eso NO respeliza
// `ce`, `ge` ni `gn`: hacerlo produciría `chichero` y la voz leería
// /kikero/ o peor.
//
// Esta función contesta otra pregunta: **qué tiene que leer un alumno
// castellano para pronunciarlo bien**. Es lo que examinan los cinco puntos
// de lectura eclesiástica mientras el canal de escucha esté parado — el
// `motivo` de `l1-eclesiastica-ce` lo dice: «hasta entonces se examina
// eligiendo la transcripción, que es lo que sí se puede medir por escrito».
//
// ══ LA NOTACIÓN NO ME LA INVENTO: LA TRAEN LOS DESCRIPTORES ══════════
//
//   Cicerō  = «Chíchero»    descendit = «deshéndit»   regem  = «réyem»
//   caelum  = «chélum»      poena     = «péna»
//   grātia  = «grátsia»     nātiō     = «natsio»
//   agnus   = «áñus»        magnus    = «máñus»       rēgnum = «réñum»
//   mihi    = «mí-i»
//
// Esos ocho son el juego de control de esta función, y vienen del material,
// no de mí.
//
// ══ LAS EXCEPCIONES TAMBIÉN, Y SON LA MITAD DEL TRABAJO ══════════════
//
//   `ca`, `co`, `cu` siguen siendo /k/ — el que sobreaplique dirá *«chása»
//   la DIÉRESIS rompe el dígrafo: `aër`, `poëta`, `coëmō`
//   tras `s`, `t` o `x` el `ti` NO se africa: `bestia`, `mixtiō`
import { acentoDe } from './ortografia-la';

/** Cada regla con el punto que la enseña, para que un ítem pueda declarar
 *  cuál examina y el gate lo compruebe. */
export type ReglaEclesiastica = 'ce-ci' | 'ge-gi' | 'sc-e-i' | 'ae-oe' | 'ti-vocal' | 'gn' | 'h-muda';

export const PUNTO_DE_LA_REGLA: Record<ReglaEclesiastica, string> = {
  'ce-ci': 'l1-eclesiastica-ce',
  'ge-gi': 'l1-eclesiastica-ce',
  'sc-e-i': 'l1-eclesiastica-ce',
  'ae-oe': 'l1-eclesiastica-ae',
  'ti-vocal': 'l1-eclesiastica-ti',
  'gn': 'l1-eclesiastica-gn',
  'h-muda': 'l1-h-muda',
};

const V = 'aeiouāēīōū';

/** Qué reglas se aplican de verdad a esta palabra. Es lo que hace que un
 *  ítem pueda declarar «éste examina el `ti`» y se pueda comprobar. */
export function reglasQueAplican(palabra: string): ReglaEclesiastica[] {
  const orig = palabra.normalize('NFC').toLowerCase();
  const out: ReglaEclesiastica[] = [];
  // ── EL ORDEN TAMBIÉN AQUÍ ──
  //
  // La `c` de `caelum` queda ante `e` SÓLO después de fundir el dígrafo, y
  // por eso `caelum` es «chélum». La primera versión miraba el original y
  // clasificaba `caelō` como caso NEGATIVO de la regla `ce` cuando su
  // transcripción es `chélo`: el detector contestaba sobre un texto que ya
  // no existe cuando la regla actúa.
  const w = orig.replace(/aë/g, 'a-e').replace(/oë/g, 'o-e').replace(/ae/g, 'e').replace(/oe/g, 'e');
  if (/[ëï]/.test(orig)) out.push('ae-oe');
  if (/sc[eiēī]/.test(w)) out.push('sc-e-i');
  if (/(?<!s)c[eiēī]/.test(w)) out.push('ce-ci');
  if (/g[eiēī]/.test(w) && !/gn/.test(w.replace(/g[eiēī]/, ''))) out.push('ge-gi');
  else if (/g[eiēī]/.test(w)) out.push('ge-gi');
  if (/(ae|oe)/.test(orig) && !/[ëï]/.test(orig)) out.push('ae-oe');
  if (new RegExp(`(?<![stx])ti(?=[${V}])`).test(w)) out.push('ti-vocal');
  if (/gn/.test(w)) out.push('gn');
  if (/h/.test(orig)) out.push('h-muda');
  return [...new Set(out)];
}

/** La transcripción, en la notación de los descriptores y SIN el acento
 *  gráfico: el acento lo pone `transcribir`, que es quien sabe dónde cae. */
function respelizar(palabra: string): string {
  let w = palabra.normalize('NFC').toLowerCase().replace(/j/g, 'i');
  // ── EL ORDEN NO ES NEGOCIABLE, Y LO ENSEÑARON LOS FALLOS ──
  //
  // Tres de los once ejemplos de control salieron mal por el orden, y los
  // tres tenían la misma forma: un paso deshacía lo que otro acababa de
  // escribir.
  //
  //  · `ae` → `e` va ANTES que `ce` → `che`, porque `caelum` es «chélum»:
  //    primero se funde el dígrafo y ENTONCES la `c` queda ante `e`. Es lo
  //    que ya decía el comentario de `RESPELIZACION`, y aun así lo puse al
  //    revés.
  //  · la `h` que escriben `ch` y `sh` NO es la `h` latina. Quitarlas
  //    juntas convertía `chíchero` en `cícero` y `deshéndit` en
  //    `deséndit`. Se protegen con un marcador.
  //  · y la `h` latina entre vocales deja HIATO —`mihi` = «mí-i»—, que es
  //    el punto entero de `l1-h-muda`: no basta con borrarla.
  w = w.replace(/ph/g, 'f').replace(/th/g, 't');
  w = w.replace(/ch/g, 'k');                       // `pulcher` → `pulker`, /k/
  // La diéresis ROMPE el dígrafo, así que se marca antes de fundirlo.
  w = w.replace(/aë/g, 'a\u0001e').replace(/oë/g, 'o\u0001e');
  w = w.replace(/ae/g, 'e').replace(/oe/g, 'e');
  // La `h` latina: entre vocales deja hiato, en otro sitio desaparece.
  w = w.replace(new RegExp(`([${V}])h(?=[${V}])`, 'g'), '$1\u0001');
  w = w.replace(/h/g, '');
  w = w.replace(/gn/g, 'ñ');                       // antes que `ge/gi`
  w = w.replace(/sc([eiēī])/g, 's\u0002$1');      // antes que `ce/ci`
  w = w.replace(/c([eiēī])/g, 'c\u0002$1');
  w = w.replace(/g([eiēī])/g, 'y$1');
  w = w.replace(new RegExp(`(?<![stx])ti(?=[${V}])`, 'g'), 'tsi');
  w = w.replace(/y(?![aeiouāēīōū])/g, 'i');        // la `y` griega es vocal
  // ── EL HIATO QUE MARCA EL MÁCRÓN, ANTES DE QUITARLO ──
  //
  // `poēta` no es `poe-ta`: el mácrón de la `ē` dice que no hay dígrafo, y
  // es la excepción que declara `l1-eclesiastica-ae`. Si se quitan los
  // mácrones primero, esa información se pierde y el acento acaba en
  // `póeta`. Se marca el hiato con un carácter invisible que sólo sirve
  // para contar sílabas y se borra al final — el mismo error que tuve con
  // `Deus`, donde re-derivé una lista de diptongos en vez de usar la del
  // proyecto.
  w = w.replace(new RegExp(`([aeiou])([āēīōū])`, 'g'), '$1\u0003$2');
  return w.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC')
    .replace(/\u0002/g, 'h').replace(/\u0001/g, '-');
}

/** La transcripción con su acento gráfico, como en los descriptores:
 *  `Cicerō` → `chíchero`. El acento sale de la cantidad, que es lo que el
 *  material marca con mácrones. */
export function transcribir(palabra: string): string {
  const base = respelizar(palabra).replace(/\u0003/g, '');
  const a = acentoDe(palabra);
  if (a === null) return base;                     // monosílabo: no se tilda
  const silabasDeLaTranscripcion = base.split('-');
  // El acento se pone sobre la vocal de la sílaba tónica CONTANDO SOBRE LA
  // TRANSCRIPCIÓN, que puede tener menos sílabas que el original (`caelum`
  // pierde una al fundir el dígrafo).
  const nucleos: number[] = [];
  const plano = silabasDeLaTranscripcion.join('-');
  // Los ÚNICOS diptongos que quedan en la transcripción son `au`, `eu` y
  // `ei`: `ae` y `oe` ya se fundieron en `e`. Tratar cualquier par de
  // vocales como diptongo ponía `póeta` donde va `poéta` — el `oe` de
  // `poēta` no es dígrafo, y eso lo dice el mácrón de la `ē`, que es
  // exactamente la excepción que el punto `l1-eclesiastica-ae` declara.
  // La transcripción marca sus hiatos con `\u0003`, así que aquí sólo
  // quedan diptongos de verdad. `eu` NO entra: `Deus` es `de-us`, y ésa es
  // la lista cerrada que el proyecto ya tiene en `cuanto-duele`.
  const DIPTONGOS = ['au', 'ei'];
  for (let i = 0; i < plano.length; i++) {
    if (!'aeiou'.includes(plano[i]!)) continue;
    if (nucleos.length && i === nucleos[nucleos.length - 1]! + 1
        && DIPTONGOS.includes(plano.slice(i - 1, i + 1))) continue;
    nucleos.push(i);
  }
  if (nucleos.length < 2) return plano;
  const idx = a === 'llana' ? nucleos[nucleos.length - 2]! : nucleos[nucleos.length - 3] ?? nucleos[0]!;
  const TILDE: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
  return plano.slice(0, idx) + (TILDE[plano[idx]!] ?? plano[idx]!) + plano.slice(idx + 1);
}

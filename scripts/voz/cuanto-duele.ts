// scripts/voz/cuanto-duele.ts
//
// ¿DE CUÁNTAS PALABRAS ESTAMOS HABLANDO?
//
// Cuatro tandas de sonda optimizando la solución sin conocer el tamaño del
// problema. El defecto del motor NO es aleatorio, es exactamente predecible:
//
//     el motor acentúa SIEMPRE la penúltima
//     el latín acentúa la penúltima SI ES LARGA, y si no la antepenúltima
//
// Así que el motor acierta en todas las palabras de penúltima larga y falla
// en todas las de penúltima breve — y cuáles son se sabe de antemano, porque
// el lexicón está macronizado.
//
// Si el daño es el 10 %, no hay problema de ingeniería sino un problema de
// contenido acotado. Si es el 40 %, merece la conversación cara.
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { paradigmaNominal, infectum, perfectum, declinacionDe } from '../../lib/data/languages/la/paradigma-la';

/** Sílabas de una palabra latina macronizada, como listas de caracteres.
 *  Regla: una consonante entre vocales va con la siguiente sílaba; dos o más
 *  se reparten, salvo muta cum liquida, que va entera con la siguiente. */
const VOCALES = 'aeiouāēīōūyȳ';
// `ui` NO está, y ahí estaba el fallo. Latín lo tiene como diptongo sólo en
// `cui` y `huic` —y `hui`, interjección—, no en `habuit`, `monuit` ni
// `fuimus`, que son `ha-bu-it`, `mo-nu-it`, `fu-i-mus`. Tratarlo como
// diptongo siempre convertía `habuit` en bisílabo y le daba el acento a la
// penúltima, cuando la palabra es esdrújula: HA-bu-it.
//
// Lo destapó cruzar esta función con `acentoDe` de `lib/lang/ortografia-la`,
// que es la MISMA REGLA escrita dos veces en el repositorio: 9 formas de
// 1.405 discrepaban, y las nueve eran este caso. La duplicación sigue —las
// dos funciones devuelven cosas distintas y la de `lib` no expone las
// sílabas— pero ya no puede desincronizarse en silencio: hay un test que
// las cruza sobre todas las formas de L1.
// Y `eu` y `ei` tampoco, por el mismo motivo y con el mismo tipo de fallo.
// `Deus` es `De-us` —el tema sale del genitivo `Deī`, o sea `De-`— y las dos
// implementaciones del repositorio lo daban por monosílabo. Son 432 tokens
// del corpus: `Deus` ×271 y `Deum` ×161, la palabra más frecuente de la
// mitad vulgata. Lo mismo con `meus` = `me-us`.
const DIPTONGOS = ['ae', 'au', 'oe'];
/** Las palabras donde estos pares SÍ son diptongo. Listas cerradas, no
 *  heurísticos: en latín son un puñado y fuera de ellas hay hiato. */
const UI_DIPTONGO = ['cui', 'huic', 'hui'];
const EU_DIPTONGO = ['heu', 'heus', 'eheu', 'ceu', 'seu', 'neu'];
const EI_DIPTONGO = ['deinde', 'dein', 'hei', 'deinceps'];
const MUTAS = 'pbtdcgf', LIQUIDAS = 'lr';

function esDiptongo(w: string, i: number): boolean {
  const par = w.slice(i, i + 2);
  if (DIPTONGOS.includes(par)) return true;
  if (par === 'ui') return UI_DIPTONGO.includes(w);
  if (par === 'eu') return EU_DIPTONGO.includes(w);
  if (par === 'ei') return EI_DIPTONGO.includes(w);
  return false;
}

export function silabas(p: string): string[] {
  const w = p.normalize('NFC').toLowerCase();
  const nucleos: number[] = [];
  for (let i = 0; i < w.length; i++) {
    if (!VOCALES.includes(w[i]!)) continue;
    if (nucleos.length && i === nucleos[nucleos.length - 1]! + 1
        && esDiptongo(w, i - 1)) continue;   // el diptongo es un núcleo
    nucleos.push(i);
  }
  if (nucleos.length <= 1) return [w];
  const cortes: number[] = [];
  for (let k = 0; k < nucleos.length - 1; k++) {
    let ini = nucleos[k]!;
    while (ini + 1 < w.length && VOCALES.includes(w[ini + 1]!) && esDiptongo(w, ini)) ini++;
    const fin = nucleos[k + 1]!;
    const cons = w.slice(ini + 1, fin);
    if (cons.length === 0) cortes.push(fin);
    else if (cons.length === 1) cortes.push(fin - 1);
    else if (cons.length === 2 && MUTAS.includes(cons[0]!) && LIQUIDAS.includes(cons[1]!)) cortes.push(fin - 2);
    else cortes.push(ini + 2);
  }
  const out: string[] = []; let prev = 0;
  for (const c of cortes) { out.push(w.slice(prev, c)); prev = c; }
  out.push(w.slice(prev));
  return out;
}

/** ¿Es larga esta sílaba? Por naturaleza (vocal larga o diptongo) o por
 *  posición (cerrada por consonante). */
export function silabaLarga(s: string, siguiente: string | undefined): boolean {
  if (/[āēīōūȳ]/.test(s)) return true;
  for (const d of DIPTONGOS) if (s.includes(d)) return true;
  for (const [par, lista] of [['ui', UI_DIPTONGO], ['eu', EU_DIPTONGO], ['ei', EI_DIPTONGO]] as [string, string[]][])
    if (s.includes(par) && lista.some((q) => q.includes(s))) return true;
  const trasNucleo = s.replace(new RegExp(`^[^${VOCALES}]*[${VOCALES}]+`), '');
  if (trasNucleo.length > 0) return true;                      // cerrada por su propia coda
  if (siguiente) {
    const arranque = siguiente.match(new RegExp(`^[^${VOCALES}]*`))?.[0] ?? '';
    if (arranque.length >= 2 && !(MUTAS.includes(arranque[0]!) && LIQUIDAS.includes(arranque[1]!))) return true;
  }
  return false;
}

export type Acento = 'penultima' | 'antepenultima' | 'monosilabo' | 'bisilabo';

/** Dónde cae el acento latino. Y con él, si el motor italiano acierta:
 *  acierta siempre que el acento caiga en la penúltima. */
export function acentoLatino(p: string): { acento: Acento; silabas: string[]; elMotorAcierta: boolean } {
  const s = silabas(p);
  if (s.length === 1) return { acento: 'monosilabo', silabas: s, elMotorAcierta: true };
  if (s.length === 2) return { acento: 'bisilabo', silabas: s, elMotorAcierta: true };
  const larga = silabaLarga(s[s.length - 2]!, s[s.length - 1]);
  return {
    acento: larga ? 'penultima' : 'antepenultima',
    silabas: s,
    elMotorAcierta: larga,
  };
}

if (process.argv[1]?.includes('cuanto-duele')) {
  const formas = new Set<string>();
  for (const n of NOMBRES_L1) { try { declinacionDe(n); } catch { continue; }
    for (const f of Object.values(paradigmaNominal(n))) formas.add(f); }
  for (const v of VERBOS_L1) { for (const f of Object.values(infectum(v))) formas.add(f);
    for (const f of Object.values(perfectum(v))) formas.add(f); }
  for (const a of ADJETIVOS_L1) formas.add(a.lema);

  const cuenta = { penultima: 0, antepenultima: 0, monosilabo: 0, bisilabo: 0 };
  const fallan: string[] = [];
  for (const f of formas) {
    const r = acentoLatino(f);
    cuenta[r.acento]++;
    if (!r.elMotorAcierta && fallan.length < 12) fallan.push(`${f} (${r.silabas.join('-')})`);
  }
  const total = formas.size;
  const acierta = cuenta.penultima + cuenta.monosilabo + cuenta.bisilabo;
  console.log(`  formas que la máquina produce: ${total}\n`);
  console.log(`    monosílabas            ${String(cuenta.monosilabo).padStart(5)}   el motor acierta por fuerza`);
  console.log(`    bisílabas              ${String(cuenta.bisilabo).padStart(5)}   idem: el acento sólo puede ir en la primera`);
  console.log(`    penúltima LARGA        ${String(cuenta.penultima).padStart(5)}   el motor acierta`);
  console.log(`    penúltima BREVE        ${String(cuenta.antepenultima).padStart(5)}   ← EL MOTOR FALLA`);
  console.log(`\n  el motor acierta en ${acierta} de ${total} = ${(100 * acierta / total).toFixed(1)} %`);
  console.log(`  falla en ${cuenta.antepenultima} = ${(100 * cuenta.antepenultima / total).toFixed(1)} %`);
  console.log(`\n  ejemplos de las que fallan: ${fallan.slice(0, 8).join(' · ')}`);
}

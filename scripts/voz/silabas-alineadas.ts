// scripts/voz/silabas-alineadas.mjs
//
// EL INSTRUMENTO BUENO: energía por sílaba sobre las fronteras REALES.
//
// Las cuatro tandas anteriores partieron el audio en trozos iguales, y eso
// arrastró un sesgo declarado pero incurable: «dis» y «lum» son cerradas y
// más largas que «ci» y «pu», así que el tercer cuarto podía no ser «pu». En
// dos voces la declinación se comió la señal y hubo que declarar los
// veredictos ilegibles.
//
// No hace falta construir alineación forzada: **la API ya la da**. El
// endpoint `/v1/text-to-speech/{voz}/with-timestamps` devuelve, para cada
// CARÁCTER del texto, su tiempo de inicio y de fin. Y es el mismo endpoint
// con el que se construyó el karaoke del portugués
// (`scripts/lectura/karaoke-desde-catalogo.mjs`), así que ya está integrado
// y su aprendizaje ya está pagado.
//
// Comprobado contra la API, no contra la documentación: **v3 y v2 lo
// admiten los dos** y devuelven los 10 caracteres de «discipulum» alineados.
import { spawnSync } from 'node:child_process';
import { silabas } from './cuanto-duele';

export interface Alineacion {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}
export interface Frontera { silaba: string; desde: number; hasta: number }

/** Las fronteras de cada sílaba en segundos, a partir de la alineación por
 *  carácter que devuelve la API. La palabra se silabea con la misma función
 *  que usa el resto del proyecto, así que las fronteras son las del latín y
 *  no las de un reparto igual. */
export function fronterasSilabicas(palabra: string, alignment: Alineacion, desplazamiento = 0): Frontera[] | null {
  const sil = silabas(palabra);
  const chars = alignment.characters;
  const ini = alignment.character_start_times_seconds;
  const fin = alignment.character_end_times_seconds;
  // Localizar la palabra dentro del texto alineado, sin distinguir cantidad.
  const sinM = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase();
  const texto = sinM(chars.join(''));
  const pos = texto.indexOf(sinM(palabra), desplazamiento);
  if (pos < 0) return null;
  const out: Frontera[] = [];
  let c = pos;
  for (const s of sil) {
    const desde = ini[c]!;
    c += s.length;
    out.push({ silaba: s, desde, hasta: fin[c - 1]! });
  }
  return out;
}

/** RMS dentro de cada tramo real. */
export function energiaPorSilaba(mp3: string, fronteras: Frontera[]): number[] | null {
  const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'],
    { maxBuffer: 1 << 28 }).stdout;
  if (!raw || raw.length === 0) return null;
  const x = new Int16Array(raw.buffer, raw.byteOffset, raw.length >> 1);
  const e = fronteras.map(({ desde, hasta }) => {
    const a = Math.max(0, Math.floor(desde * 16000));
    const b = Math.min(x.length, Math.ceil(hasta * 16000));
    let s = 0, c = 0;
    for (let j = a; j < b; j++) { const v = x[j]!; s += v * v; c++; }
    return c > 0 ? Math.sqrt(s / c) : 0;
  });
  const m = Math.max(...e);
  return m > 0 ? e.map((v) => v / m) : null;
}

/** La duración de cada sílaba, que es la OTRA marca del acento y que los
 *  cuartos iguales no podían ver por construcción: en latín la sílaba
 *  acentuada se alarga, y eso es independiente de la energía. */
export function duracionPorSilaba(fronteras: Frontera[]): number[] | null {
  const d = fronteras.map(({ desde, hasta }) => hasta - desde);
  const m = Math.max(...d);
  return m > 0 ? d.map((v) => v / m) : null;
}

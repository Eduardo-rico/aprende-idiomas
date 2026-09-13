// scripts/lib/barrido-vocabulario-marcos.ts
//
// ¿CUÁNTOS MARCOS USAN PALABRAS QUE EL ALUMNO NO HA VISTO?
//
//   npx tsx scripts/lib/barrido-vocabulario-marcos.ts
//
// ── LA PREGUNTA NO SE PUEDE FORMULAR IGUAL EN TODAS LAS LENGUAS ──────
//
// Y por eso este barrido contesta primero **si puede preguntar**, antes de
// dar un número. Aplicar el criterio latino al rumano daría una cifra
// catastrófica que no querría decir nada, y un número que no significa nada
// es peor que ninguno porque parece una medida.
//
//   LATÍN    el curso es de vocabulario CERRADO en L1: la máquina enumera
//            las 2.787 formas que el alumno puede haber visto, y un marco
//            que use otra cosa está usando algo que no se le ha enseñado.
//            La pregunta se formula y se contesta.
//
//   RUMANO   el lexicón cubre A1 (79 lemas) y hay lotes de A2 y B1. El
//            criterio del vocabulario cerrado NO se puede aplicar ahí.
//            Pero el rumano ya hace esta comprobación **con mejor
//            instrumento que el latín**: hunspell, que pregunta «¿es
//            rumano?» en vez de «¿está en nuestra lista?». Lo que sí se
//            puede medir es CUÁNTOS LOTES la llaman.
//
//   RUSO     no tiene lotes todavía. No hay nada que medir, y eso también
//            es un resultado.
//
//   PORTUGUÉS  ni lexicón cerrado ni hunspell: la pregunta no se formula
//            de ninguna de las dos maneras.
import fs from 'node:fs';
import path from 'node:path';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { PUNTOS_LA, formatoDeLa } from '../../lib/data/languages/la/inventario-puntos';

const LOTES_LA = 'lib/data/languages/la/lotes';
const LOTES_OTROS = 'scripts/lotes';

/** ── QUÉ CAMPO ES EL LATÍN, Y POR QUÉ NO SE PUEDE CABLEAR ──
 *
 *  La primera versión sacaba las cadenas con `___` y dio **139 marcos
 *  sucios de 358**, un número catastrófico y falso. En el formato
 *  `cloze-en-glosa` —13 de los 40 lotes— **el hueco va en la TRADUCCIÓN
 *  ESPAÑOLA**, así que estaba marcando cada palabra en español como
 *  vocabulario de fuera. Es el mismo error contra el que avisaba el
 *  coordinador para el rumano, cometido dentro del latín: aplicar un
 *  criterio donde la pregunta tiene otra forma.
 *
 *  Tampoco vale cablear nombres de campo: los lotes no comparten tipo y el
 *  latín se llama `marco` en unos y `latin` en otros.
 *
 *  Así que se AUTOCALIBRA: de cada campo de texto se mide qué fracción de
 *  sus palabras produce la máquina de L1. Un campo latino sale cerca del
 *  100 % y uno español cerca del 0 %, y la separación es tan grande que no
 *  hay zona gris. El barrido imprime qué campo eligió en cada lote, para
 *  que una elección mala se vea en vez de esconderse en el total. */
const CAMPOS_IGNORADOS = new Set(['id', 'punto', 'pista', 'glosa']);

/** Los formatos que NO tienen marco. Un `flashcard` enseña vocabulario: sus
 *  campos latinos son el CONTENIDO, no el contexto, así que preguntarles si
 *  usan palabras de fuera es preguntarles si enseñan palabras nuevas — que
 *  es lo que hacen. La primera versión marcó `l11-falsos-regalos` con 5 de
 *  12 por eso: `carō`, `quaerō`, `dēbeō`, `turba`, `familia` son los falsos
 *  amigos que el lote existe para enseñar. */
const FORMATOS_SIN_MARCO = new Set(['flashcard']);

function esLatin(textos: string[]): boolean {
  const palabras = textos.flatMap((t) => t.replace('___', ' ').split(/[^\p{L}]+/u)).filter((w) => w.length > 0);
  if (palabras.length < 4) return false;
  const fuera = palabras.filter((w) => palabrasDesconocidas(w).length > 0).length;
  return fuera / palabras.length < 0.5;
}

function camposDeTexto(items: Record<string, unknown>[]): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const it of items)
    for (const [k, v] of Object.entries(it)) {
      if (CAMPOS_IGNORADOS.has(k) || typeof v !== 'string') continue;
      if (!out.has(k)) out.set(k, []);
      out.get(k)!.push(v);
    }
  // UN MARCO ES UNA FRASE, NO UNA PALABRA. Los campos de una sola palabra
  // son CONTENIDO —el lema que el flashcard enseña, la palabra que
  // `l10-que-enclitico` analiza— y preguntarles si usan vocabulario de
  // fuera es preguntarles si enseñan palabras nuevas, que es su trabajo.
  // Marcó `itaque`, `quīnque` y `ūsque`, que son exactamente las tres que
  // ese lote existe para explicar.
  for (const [k, v] of [...out])
    if (v.every((t) => t.trim().split(/\s+/).length < 2)) out.delete(k);
  return out;
}

async function main() {
  console.log('\n  BARRIDO DEL VOCABULARIO DE LOS MARCOS\n');

  // ── LATÍN: la pregunta se formula ──
  console.log('  LATÍN — vocabulario cerrado: la pregunta se formula y se contesta');
  let totalMarcos = 0, sucios = 0, lotesMirados = 0, sinCampoLatino = 0;
  const filas: string[] = [];
  for (const f of fs.readdirSync(LOTES_LA).filter((x) => x.endsWith('.ts') && !x.startsWith('_'))) {
    const fuente = fs.readFileSync(path.join(LOTES_LA, f), 'utf8');
  const idPunto = fuente.match(/punto:\s*'([^']+)'/)?.[1];
  const punto = PUNTOS_LA.find((p) => p.id === idPunto);
  if (punto && FORMATOS_SIN_MARCO.has(formatoDeLa(punto))) continue;
  const mod = await import(path.resolve(LOTES_LA, f)) as Record<string, unknown>;
    const items = Object.values(mod).find((v): v is Record<string, unknown>[] =>
      Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null);
    if (!items) continue;
    lotesMirados++;
    const campos = [...camposDeTexto(items)].filter(([, v]) => esLatin(v));
    if (campos.length === 0) { sinCampoLatino++; filas.push(`    ${f.replace('.ts', '').padEnd(30)} — sin campo latino identificable`); continue; }
    for (const [nombre, textos] of campos) {
      const malos = textos.map((m) => [m, palabrasDesconocidas(m)] as const).filter(([, d]) => d.length > 0);
      totalMarcos += textos.length; sucios += malos.length;
      if (malos.length > 0)
        filas.push(`    ${f.replace('.ts', '').padEnd(28)} ${nombre.padEnd(7)} ${String(malos.length).padStart(3)}/${String(textos.length).padEnd(3)} ${[...new Set(malos.flatMap(([, d]) => d))].slice(0, 9).join(' ')}`);
    }
  }
  console.log(`    ${lotesMirados} lotes · ${totalMarcos} marcos latinos · ${sucios} con vocabulario de fuera · ${sinCampoLatino} sin campo latino\n`);
  for (const r of filas) console.log(r);

  // ── LAS OTRAS: se mide lo que SÍ se puede medir ──
  const porLengua: Record<string, { total: number; conCheck: number }> = {};
  for (const f of fs.readdirSync(LOTES_OTROS).filter((x) => x.endsWith('.ts'))) {
    const lang = /-ro-|ro-l/.test(f) ? 'ro' : /-ru-/.test(f) ? 'ru' : 'pt';
    const s = fs.readFileSync(path.join(LOTES_OTROS, f), 'utf8');
    (porLengua[lang] ??= { total: 0, conCheck: 0 }).total++;
    if (/hunspell|desconocidas/.test(s)) porLengua[lang]!.conCheck++;
  }
  console.log('\n  LAS DEMÁS — el criterio latino NO se puede aplicar; se mide si el lote se comprueba a sí mismo');
  for (const [l, v] of Object.entries(porLengua))
    console.log(`    ${l}  ${v.conCheck} de ${v.total} lotes llaman a un comprobador de vocabulario`);
  console.log('    ru  0 lotes: no hay nada que medir todavía, y eso también es un resultado');
}

main();

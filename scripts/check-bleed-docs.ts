// scripts/check-bleed-docs.ts
//
// Pasa los documentos de currículo por el detector de escrituras ajenas.
//
// Existe porque la revisión lingüística encontró DOS CARACTERES CHINOS
// (操作) incrustados donde debía decir «Операция „Ы“», en el anexo ruso.
// No es una errata: es contaminación de otra escritura — el fenómeno que
// el propio proyecto ya detecta en el contenido generado
// (scripts/lib/latin-guard.ts) pero no en los documentos de diseño, que
// son justamente las líneas desde las que se genera material a escala.
//
// El ruso y el checo usan cirílico y latino con diacríticos; lo que NO
// debe aparecer nunca es CJK, kana, hangul, hebreo, árabe o devanagari.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const RANGOS: [string, RegExp][] = [
  ['CJK (chino/japonés)', /[一-鿿㐀-䶿]/u],
  ['hiragana/katakana', /[぀-ヿ]/u],
  ['hangul', /[가-힯ᄀ-ᇿ]/u],
  ['hebreo', /[֐-׿]/u],
  ['árabe', /[؀-ۿ]/u],
  ['devanagari', /[ऀ-ॿ]/u],
  ['tailandés', /[฀-๿]/u],
];

async function main() {
  const dir = path.join(process.cwd(), 'docs', 'plans');
  const objetivo = process.argv[2];
  const files = objetivo
    ? [objetivo]
    : (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f));

  let hallazgos = 0;
  for (const f of files) {
    const lineas = (await fs.readFile(f, 'utf8')).split('\n');
    lineas.forEach((linea, i) => {
      for (const [nombre, re] of RANGOS) {
        const m = linea.match(re);
        if (!m) continue;
        hallazgos++;
        const ctx = linea.slice(Math.max(0, (m.index ?? 0) - 45), (m.index ?? 0) + 45);
        console.log(`${path.basename(f)}:${i + 1}  ${nombre}  «${m[0]}»`);
        console.log(`    …${ctx.replace(/\s+/g, ' ')}…`);
      }
    });
  }
  console.log(hallazgos === 0 ? '\nLimpio: ninguna escritura ajena.' : `\n${hallazgos} hallazgos.`);
  if (process.argv.includes('--strict') && hallazgos > 0) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });

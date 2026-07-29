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
// ── Revisión del 2026-07-29 ──────────────────────────────────────
//
// La primera versión sólo miraba bloques de código-punto ajenos, o sea
// el caso FÁCIL: un ideograma chino salta a la vista de cualquiera. El
// ataque adversarial lo probó con `обособление` llevando una `o` y una
// `c` LATINAS dentro y respondió «Limpio».
//
// Ése es el caso que de verdad importa, porque es el invisible: nadie
// distingue а de a mirando. Y para un corpus ruso o checo es el error
// que sobrevive hasta el TTS, donde una `c` latina en medio de una
// palabra cirílica la parte en dos y el sintetizador la deletrea.
//
// Segundo defecto: `String.match` sin `/g` devolvía UNA coincidencia por
// línea y por rango, así que una línea con cinco ideogramas contaba uno.
//
// Tercer defecto, el que más lo habría matado: el guard se ponía rojo
// sobre los documentos que DESCRIBEN el problema, porque citan los
// caracteres ofensores como ejemplo. Un gate que denuncia su propia
// documentación se ignora en dos días, y a partir de ahí un gate rojo
// deja de significar nada — que es justo lo que le pasó a
// verify-content, rojo desde `fa1a107` hasta hoy y por eso incapaz de
// avisar de los seis errores nuevos que se le metieron ayer. Por eso
// ahora hay una exención EXPLÍCITA por línea: `<!-- bleed-ok -->`.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const RANGOS: [string, RegExp][] = [
  ['CJK (chino/japonés)', /[一-鿿㐀-䶿]/gu],
  ['hiragana/katakana', /[぀-ヿ]/gu],
  ['hangul', /[가-힯ᄀ-ᇿ]/gu],
  ['hebreo', /[֐-׿]/gu],
  ['árabe', /[؀-ۿ]/gu],
  ['devanagari', /[ऀ-ॿ]/gu],
  ['tailandés', /[฀-๿]/gu],
];

/** Marca que exime la línea. Se escribe a mano y a la vista. */
const EXENCION = /<!--\s*bleed-ok/;

// Homóglifos: una MISMA palabra que mezcla cirílico y latino. Es el caso
// invisible, y en un texto real no hay motivo legítimo para que ocurra —
// las transliteraciones («ы» = y) van en palabras separadas.
const PALABRA = /[\p{L}̀-ͯ]+/gu;
const CIRILICO = /\p{Script=Cyrillic}/u;
const LATINO = /\p{Script=Latin}/u;

interface Hallazgo {
  archivo: string;
  linea: number;
  clase: string;
  muestra: string;
  contexto: string;
}

function contextoDe(linea: string, i: number): string {
  return linea.slice(Math.max(0, i - 45), i + 45).replace(/\s+/g, ' ');
}

function revisarLinea(linea: string, archivo: string, n: number): Hallazgo[] {
  if (EXENCION.test(linea)) return [];
  const out: Hallazgo[] = [];

  for (const [nombre, re] of RANGOS) {
    re.lastIndex = 0;
    for (const m of linea.matchAll(re)) {
      out.push({
        archivo, linea: n, clase: nombre, muestra: m[0],
        contexto: contextoDe(linea, m.index ?? 0),
      });
    }
  }

  PALABRA.lastIndex = 0;
  for (const m of linea.matchAll(PALABRA)) {
    const w = m[0];
    if (!CIRILICO.test(w) || !LATINO.test(w)) continue;
    // Señala QUÉ letras son las intrusas, que es lo único accionable:
    // «обособление» y «обособление» se ven igual en pantalla.
    const intrusas = [...w]
      .map((c, i) => ({ c, i, latina: LATINO.test(c) }))
      .filter((x) => x.latina)
      .map((x) => `${x.c}@${x.i} (U+${x.c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')})`);
    out.push({
      archivo, linea: n,
      clase: 'homóglifo latino en palabra cirílica',
      muestra: `${w} → ${intrusas.join(', ')}`,
      contexto: contextoDe(linea, m.index ?? 0),
    });
  }

  return out;
}

async function main() {
  const dir = path.join(process.cwd(), 'docs', 'plans');
  const objetivo = process.argv.find((a) => a.endsWith('.md'));
  const files = objetivo
    ? [objetivo]
    : (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f));

  const hallazgos: Hallazgo[] = [];
  for (const f of files) {
    const lineas = (await fs.readFile(f, 'utf8')).split('\n');
    lineas.forEach((linea, i) => hallazgos.push(...revisarLinea(linea, f, i + 1)));
  }

  for (const h of hallazgos) {
    console.log(`${path.basename(h.archivo)}:${h.linea}  ${h.clase}  «${h.muestra}»`);
    console.log(`    …${h.contexto}…`);
  }
  console.log(
    hallazgos.length === 0
      ? `\nLimpio: ninguna escritura ajena en ${files.length} documento(s).`
      : `\n${hallazgos.length} hallazgos.`,
  );
  if (process.argv.includes('--strict') && hallazgos.length > 0) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });

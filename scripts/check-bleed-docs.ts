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

// Homóglifos: una MISMA palabra que mezcla dos escrituras. Es el caso
// invisible, y en un texto real no hay motivo legítimo para que ocurra —
// las transliteraciones («ы» = y) van en palabras separadas.
//
// ── Revisión del 2026-09-03 (Paso 0 de latín y griego) ────────────
//
// Hasta hoy esto sólo miraba CIRÍLICO con latinas dentro, y por tanto era
// CIEGO al griego: este gate daba «Limpio» sobre un documento con miles
// de caracteres griegos. Allí el verde era correcto —el griego era
// legítimo en ese documento—, pero el mismo verde saldría con griego
// colado en el anexo del ruso, que es el escenario que hizo nacer el
// gate.
//
// Por qué la defensa NO puede ser meter el griego en `RANGOS`: el
// cirílico tampoco está, y a propósito. `2026-07-28-curriculos-completos.md`
// lleva las cuatro lenguas en un solo fichero, así que una escritura que
// el proyecto ENSEÑA no se puede prohibir entera. La defensa de una
// escritura propia es ésta: el homóglifo.
//
// Y se generaliza en vez de duplicarse, que es la lección de
// «una regla copiada se desincroniza»: en vez de una regla por par de
// escrituras, se cuentan las letras por escritura y se denuncian las de
// la MINORÍA. Eso caza los tres pares (lat↔cir, lat↔gr, gr↔cir) y
// cualquiera que venga, y además mejora el caso cirílico, que sólo
// miraba en una dirección: `Ρoma` con Rho griega delante era invisible.
const PALABRA = /[\p{L}̀-ͯ]+/gu;
/** Las escrituras que el proyecto usa. Los diacríticos combinantes son
 *  `Script=Inherited` y no cuentan: si contaran, toda palabra griega
 *  politónica parecería mezclada consigo misma. */
const ESCRITURAS: [string, RegExp][] = [
  ['latina', /\p{Script=Latin}/u],
  ['cirílica', /\p{Script=Cyrillic}/u],
  ['griega', /\p{Script=Greek}/u],
];

export interface Hallazgo {
  archivo: string;
  linea: number;
  clase: string;
  muestra: string;
  contexto: string;
}

function contextoDe(linea: string, i: number): string {
  return linea.slice(Math.max(0, i - 45), i + 45).replace(/\s+/g, ' ');
}

export function revisarLinea(linea: string, archivo: string, n: number): Hallazgo[] {
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
    // Cada letra a su escritura; lo que no cae en ninguna (combinantes,
    // cifras) no participa ni como base ni como intrusa.
    const letras = [...w].map((c, i) => ({
      c, i, escritura: ESCRITURAS.find(([, re]) => re.test(c))?.[0] ?? null,
    }));
    const cuenta = new Map<string, number>();
    for (const l of letras) if (l.escritura) cuenta.set(l.escritura, (cuenta.get(l.escritura) ?? 0) + 1);
    if (cuenta.size < 2) continue;

    // La MAYORÍA es la base de la palabra; el resto son las intrusas, que
    // es lo único accionable: «обособление» y «обособление» se ven igual.
    const [base] = [...cuenta.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]!;
    const intrusas = letras
      .filter((l) => l.escritura !== null && l.escritura !== base)
      .map((l) => `${l.c}@${l.i} (U+${l.c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}, ${l.escritura})`);
    out.push({
      archivo, linea: n,
      clase: `homóglifo: palabra ${base} con letras de otra escritura`,
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
  // EL DENOMINADOR, dentro del script. Un «Limpio» sin él no distingue
  // «no hay nada» de «no he mirado» — y dos barridos de este proyecto ya
  // dieron 0 porque no ensamblaban el texto que decían mirar. Aquí se
  // cuenta además por ESCRITURA, que es lo que hace la diferencia
  // visible: si un documento con griego dentro reporta 0 palabras
  // griegas, el que está roto es el gate.
  const vistas = new Map<string, number>();
  let palabras = 0, lineasTotal = 0;
  for (const f of files) {
    const lineas = (await fs.readFile(f, 'utf8')).split('\n');
    lineasTotal += lineas.length;
    lineas.forEach((linea, i) => {
      hallazgos.push(...revisarLinea(linea, f, i + 1));
      PALABRA.lastIndex = 0;
      for (const m of linea.matchAll(PALABRA)) {
        palabras++;
        for (const [nombre, re] of ESCRITURAS) if (re.test(m[0])) vistas.set(nombre, (vistas.get(nombre) ?? 0) + 1);
      }
    });
  }

  for (const h of hallazgos) {
    console.log(`${path.basename(h.archivo)}:${h.linea}  ${h.clase}  «${h.muestra}»`);
    console.log(`    …${h.contexto}…`);
  }
  const porEscritura = ESCRITURAS.map(([n]) => `${n} ${vistas.get(n) ?? 0}`).join(' · ');
  console.log(
    `\nmirado: ${files.length} documento(s) · ${lineasTotal} líneas · ${palabras} palabras (${porEscritura})`,
  );
  console.log(hallazgos.length === 0 ? 'Limpio: ninguna escritura ajena.' : `${hallazgos.length} hallazgos.`);
  if (process.argv.includes('--strict') && hallazgos.length > 0) process.exit(1);
}
// Sólo corre como CLI: importarlo desde un test no debe ejecutar nada.
const esCli = process.argv[1]?.includes('check-bleed-docs');
if (esCli) main().catch((e) => { console.error(e); process.exit(1); });

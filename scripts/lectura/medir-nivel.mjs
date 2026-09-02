// Graduación por nivel MEDIDA — el instrumento de la biblioteca.
//
// Contexto (léase antes de tocar los cortes). La Ola L graduó «contra
// anclas» y dejó escritos en el plan maestro tres valores —A Aia 22,7
// (B1) · O Defunto 27,3 (B2) · Civilização 35 (C1)— y un corte, B1 ≤
// 23,5. El script que los produjo NUNCA se commiteó: sólo sobreviven los
// números. Esto es su re-derivación, y se documenta como tal.
//
// LA MÉTRICA: densidad polisilábica = % de palabras de tres o más
// sílabas, contando grupos vocálicos (el diptongo cuenta uno). Es el eje
// que separa el portugués narrativo concreto del portugués abstracto
// culto: «casa, correr, gato» frente a «civilização, melancolicamente,
// substancialmente». No mide longitud de frase a propósito — el diálogo
// abundante acorta la frase sin facilitar el texto, y en este catálogo
// la longitud de frase resultó plana entre B1 y C1 (18,1 / 16,6 / 18,0).
//
// POR QUÉ SE CREE QUE ES LA FAMILIA CORRECTA — dos comprobaciones sobre
// el catálogo ya publicado, no sobre una intuición:
//  1. Reproduce el ancla A Aia: 22,6 medido contra 22,7 publicado, y
//     conserva el ORDEN de las tres anclas (A Aia 22,6 < O Defunto 24,9
//     < Civilização 28,7).
//  2. El corte B1 ≤ 23,5 del plan cae exactamente donde debe: de las 20
//     lecturas B1 publicadas, la más densa mide 23,1 — ninguna lo cruza.
//
// Los cortes altos se calibraron contra las 224 lecturas de la Ola L
// (medianas B1 19,7 · B2 23,6 · C1 26,5). C2 NO es una decisión de
// densidad: en la Ola L lo fue Os Maias (25,5 de densidad, o sea B2 en
// este eje) por escala y carga referencial social. Se declara a mano por
// obra, nunca se infiere.
import fs from 'node:fs';
import path from 'node:path';

// POR LENGUA (fase F): el eje es el mismo —densidad polisilábica— pero
// el inventario de vocales y los cortes no se heredan: se miden. Los
// cortes del rumano salen de `anclas-ro.mjs` (criterio escrito allí:
// basme de Ispirescu/Creangă abajo, Caragiale en medio, Slavici/Odobescu
// arriba) y se pegan aquí con la medición que los produjo.
const LENGUAS = {
  pt: {
    vocales: 'aeiouáéíóúâêôàãõü',
    cortes: { A2: 18.0, B1: 23.5, B2: 26.0 },   // el corte B1 es el del plan maestro, verificado
  },
  ro: {
    // ă/â/î son vocales propias; el diptongo (ea, oa, ia, ie, iu…) cuenta
    // uno, igual que en PT: la subcuenta del hiato es constante.
    vocales: 'aeiouăâî',
    // Medido 2026-09-01 (node scripts/lectura/anclas-ro.mjs, 18 obras):
    //   abajo  — Creangă 17,1 (Capra) · 18,1 (Harap-Alb) · 19,3 (Amintiri)
    //            · 20,6 (Punguța); Ispirescu 19,4 · 20,4 · 21,9.
    //   medio  — Caragiale: Vizită 20,5 · D-l Goe 24,0 · În vreme de
    //            război 24,6 · Două loturi 25,3 · O scrisoare pierdută 28,9.
    //   arriba — Odobescu 27,4 (Pseudo-Kynegetikos) · 30,3 (Doamna
    //            Chiajna); Hogaș 24,9; Eminescu (Sărmanul Dionis) 24,3;
    //            **Slavici 16,5-16,6** (Moara cu noroc, Pădureanca).
    // La métrica reproduce el orden basme < Caragiale < Odobescu. NO
    // reproduce a Slavici: su léxico es llano y la dificultad está en la
    // frase larga y en la escala (nuvele de 40.000 palabras) — eso lo
    // recoge el piso por escala (≥8.000 → B2), no la densidad. La prosa
    // de Eminescu (filosófica, 24,3) se declara C1 a mano en la tanda:
    // la densidad la subestima igual que subestimaba Os Maias en PT.
    // Los cortes caen ENTRE familias, no encima de una obra: 18,5 deja
    // los cuentos cortos de Creangă en A2 y Amintiri/Ispirescu en B1;
    // 22,5 separa Ispirescu de las schițe largas de Caragiale; 26,0
    // separa Caragiale/Hogaș de Odobescu y del teatro de Caragiale.
    cortes: { A2: 18.5, B1: 22.5, B2: 26.0 },
  },
  cs: {
    // a e i o u y + las largas y ě/ů. Las «r» y «l» silábicas (vlk, prst,
    // krk) no se cuentan: subcuenta constante entre textos, que es lo
    // que importa para comparar. El «au» de la grafía pre-1849 (saud) y
    // el «ou» actual cuentan uno igual; la «j» por «í» de la bratrská
    // (gegj) subcuenta una sílaba en esas piezas, y se acepta porque las
    // anclas y el catálogo se miden con la misma regla.
    vocales: 'aeiouyáéíóúýěů',
    // Medido 2026-09-02 (node scripts/lectura/anclas-cs.mjs, 22 obras):
    //   abajo  — pohádky: Němcová (Báchorky 1845) 16,3 (Honza) · 24,1
    //            (Bajaja) · 25,7 (Sedmero krkavců); Erben 22,0 · 22,2 ·
    //            26,5; Havlíček (Král Lávra) 17,4.   mediana 22,2
    //   medio  — Neruda (Malostranské) 21,9 · 24,6 · 24,9; Hálek 19,5 ·
    //            20,4; Babička/I 28,9; Sv. Čech (Brouček) 34,6.  mediana 24,6
    //   arriba — Zeyer 26,0 · Arbes 28,5 · 28,6 · Klostermann 26,3 ·
    //            Mrštík 24,4 · Mácha (prosa) 25,2.   mediana 26,2
    // La métrica reproduce el orden de las MEDIANAS (22,2 < 24,6 < 26,2)
    // pero no separa obra a obra: el checo flexivo alarga todas las
    // palabras y una pohádka formal (Sedmero krkavců) mide como Zeyer.
    // Se probaron dos ejes más —% de palabras de 4+ sílabas y letras por
    // palabra— y solapan igual; la longitud de frase separa el diálogo
    // (Neruda 13) de la descripción (Mácha 37), no el nivel. Por eso los
    // cortes van ENTRE familias y anchos: 20,0 deja en A2 la pohádka
    // corta y a Hálek; 26,5 mantiene TODAS las pohádky de las anclas en
    // ≤B1 (criterio: cuentos para A2-B1); 28,5 separa Arbes, Babička y
    // Čech (C1) del resto. La zona 24-26,5, donde conviven Neruda, Zeyer
    // y Klostermann, la decide el PISO POR ESCALA (novela ≥8.000 → B2);
    // lo que el criterio marcó «a mano» (Švejk, Máj, Mácha en prosa,
    // Zeyer) se declara en la tanda.
    cortes: { A2: 20.0, B1: 26.5, B2: 28.5 },
  },
};

const VOCALES = LENGUAS.pt.vocales;
// Sin flag global en las que se usan con .test(): un regex /g es
// stateful y `test` alterna true/false llamada a llamada — el bug se
// comió un tercio de las palabras la primera vez.
const RE_PALABRA = new RegExp(`[${VOCALES}a-zà-ÿ]+`, 'g');
const RE_GRUPO_G = new RegExp(`[${VOCALES}]+`, 'g');
const RE_VOCAL = new RegExp(`[${VOCALES}]`);

/** Sílabas aproximadas: un grupo vocálico = una sílaba (el diptongo,
 *  que es lo frecuente en portugués, cuenta uno; el hiato se subcuenta,
 *  y esa subcuenta es constante entre textos, que es lo que importa
 *  para comparar). */
export function silabas(palabra, lang = 'pt') {
  const re = lang === 'pt' ? RE_GRUPO_G : new RegExp(`[${LENGUAS[lang].vocales}]+`, 'g');
  return Math.max(1, (palabra.match(re) ?? []).length);
}

/** Densidad polisilábica en % (el índice). */
export function densidad(texto, lang = 'pt') {
  const L = LENGUAS[lang];
  if (!L) throw new Error(`medir-nivel: lengua sin calibrar «${lang}»`);
  const rePalabra = lang === 'pt' ? RE_PALABRA : new RegExp(`[${L.vocales}\\p{L}]+`, 'gu');
  const reVocal = lang === 'pt' ? RE_VOCAL : new RegExp(`[${L.vocales}]`);
  const palabras = (texto.toLowerCase().match(rePalabra) ?? []).filter((p) => reVocal.test(p));
  if (palabras.length === 0) return { indice: 0, palabras: 0 };
  const largas = palabras.filter((p) => silabas(p, lang) >= 3).length;
  return { indice: (100 * largas) / palabras.length, palabras: palabras.length };
}

/** Nivel MCER sugerido por el índice. C2 no sale de aquí (ver cabecera). */
export function nivelPorDensidad(indice, lang = 'pt') {
  const c = LENGUAS[lang].cortes;
  if (indice <= c.A2) return 'A2';
  if (indice <= c.B1) return 'B1';
  if (indice <= c.B2) return 'B2';
  return 'C1';
}

const ORDEN = ['A2', 'B1', 'B2', 'C1', 'C2'];

/** PISO POR ESCALA — segundo eje medido, y también heredado de la Ola L.
 *
 *  La densidad mide la frase; no mide la resistencia. Machado escribe
 *  una novela de 66.000 palabras con densidad 22,4 (B1 en el eje
 *  léxico), y una novela entera NUNCA es B1: el muro no es la palabra,
 *  es sostener el hilo tres semanas. La Ola L ya lo aplicó sin nombrarlo
 *  —Amor de Perdição (48.832 pal, densidad 23,5) quedó B2, no B1— y aquí
 *  se escribe como regla, con las palabras MEDIDAS como entrada.
 *
 *  Sólo aplica a obra continua (novela, memorias): en un volumen de
 *  contos la unidad de lectura es el conto, no el volumen. */
export function pisoPorEscala(palabrasObra) {
  if (palabrasObra >= 120000) return 'C1';
  if (palabrasObra >= 8000) return 'B2';
  return 'A2';
}

export function mayorNivel(a, b) {
  return ORDEN.indexOf(a) >= ORDEN.indexOf(b) ? a : b;
}

export function textoDeLectura(lectura) {
  return lectura.parrafos.map((p) => p.texto).join('\n\n');
}

// ── CLI ──────────────────────────────────────────────────────────
// uso: node scripts/lectura/medir-nivel.mjs <archivo.json | directorio>
//      añade --discrepancias para listar sólo lo que no coincide.
if (import.meta.url === `file://${process.argv[1]}`) {
  const objetivo = process.argv[2] ?? 'lib/data/languages/pt/lecturas';
  const soloDisc = process.argv.includes('--discrepancias');
  const lang = process.argv.includes('--lang') ? process.argv[process.argv.indexOf('--lang') + 1] : (objetivo.match(/languages\/(\w+)\//)?.[1] ?? 'pt');
  const archivos = fs.statSync(objetivo).isDirectory()
    ? fs.readdirSync(objetivo).filter((f) => f.endsWith('.json')).sort().map((f) => path.join(objetivo, f))
    : [objetivo];

  let coinciden = 0, total = 0;
  for (const a of archivos) {
    const l = JSON.parse(fs.readFileSync(a, 'utf8'));
    const { indice, palabras } = densidad(textoDeLectura(l), lang);
    const sugerido = nivelPorDensidad(indice, lang);
    // C2 declarado a mano no se contradice: es decisión de escala.
    const ok = l.nivel === sugerido || l.nivel === 'C2';
    total += 1; if (ok) coinciden += 1;
    if (soloDisc && ok) continue;
    console.log(
      `${path.basename(a, '.json').padEnd(44)} ${String(palabras).padStart(7)} pal  ` +
      `densidad ${indice.toFixed(1).padStart(5)}  declarado ${(l.nivel ?? '?').padEnd(3)} sugerido ${sugerido}${ok ? '' : '  ←'}`,
    );
  }
  console.log(`\n${coinciden}/${total} coinciden con el nivel declarado (C2 exento: es decisión de escala)`);
}

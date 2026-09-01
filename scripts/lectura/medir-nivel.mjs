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

const VOCALES = 'aeiouáéíóúâêôàãõü';
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
export function silabas(palabra) {
  return Math.max(1, (palabra.match(RE_GRUPO_G) ?? []).length);
}

/** Densidad polisilábica en % (el índice). */
export function densidad(texto) {
  const palabras = (texto.toLowerCase().match(RE_PALABRA) ?? []).filter((p) => RE_VOCAL.test(p));
  if (palabras.length === 0) return { indice: 0, palabras: 0 };
  const largas = palabras.filter((p) => silabas(p) >= 3).length;
  return { indice: (100 * largas) / palabras.length, palabras: palabras.length };
}

/** Nivel MCER sugerido por el índice. C2 no sale de aquí (ver cabecera). */
export function nivelPorDensidad(indice) {
  if (indice <= 18.0) return 'A2';
  if (indice <= 23.5) return 'B1';  // el corte del plan maestro, verificado
  if (indice <= 26.0) return 'B2';
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
  const archivos = fs.statSync(objetivo).isDirectory()
    ? fs.readdirSync(objetivo).filter((f) => f.endsWith('.json')).sort().map((f) => path.join(objetivo, f))
    : [objetivo];

  let coinciden = 0, total = 0;
  for (const a of archivos) {
    const l = JSON.parse(fs.readFileSync(a, 'utf8'));
    const { indice, palabras } = densidad(textoDeLectura(l));
    const sugerido = nivelPorDensidad(indice);
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

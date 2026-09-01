// scripts/auditar-cloze-sin-pista.ts
//
//   npx tsx scripts/auditar-cloze-sin-pista.ts [--muestra N]
//
// ¿CUÁNTOS `fill_blank` PUBLICADOS SON INRESOLUBLES?
//
// La cicatriz de E2#11, escrita en la skill: **un gate que deriva la
// respuesta no comprueba que la PREGUNTA la determine.** «Antes do almoço
// já ___ o relatório» admite terei/terás/terá/teremos/terão, y el gate lo
// bendecía porque la forma declarada sí salía del paradigma.
//
// Es la misma familia que el multi-hueco: un ejercicio que el alumno no
// puede resolver **cobra fallos falsos**, y el fallo entra en el FSRS y
// hunde el mastery de un punto que sí sabe. El multi-hueco cobraba
// aciertos de más; éste cobra fallos de más. Los dos invalidan la
// evidencia.
//
// LA CRIBA, declarada — no es un veredicto, es un orden de lectura:
//   1. ¿tiene pista? Un paréntesis en la frase o un `hintEs`.
//   2. si no la tiene, ¿la respuesta es DERIVABLE del enunciado?
//      Se considera derivable si es palabra de clase cerrada
//      (preposición, artículo, contracción, pronombre, conjunción) o si
//      tiene forma de verbo — porque entonces el hueco lo fija la
//      sintaxis, no el mundo.
//   3. lo que queda es SOSPECHOSO: hueco léxico abierto sin pista, del
//      tipo «Vou à ___», que admite escola, loja, praia…
//
// La criba no dictamina: marca. El dictamen sale del muestreo a mano,
// con el freno del proyecto (≥1 error real en la muestra ⇒ se revisa la
// cola entera).
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const N_MUESTRA = Number(process.argv[process.argv.indexOf('--muestra') + 1]) || 20;

const CERRADA = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'pelos', 'pelas', 'para',
  'com', 'sem', 'sobre', 'entre', 'até', 'desde', 'ao', 'aos', 'à', 'às', 'num',
  'numa', 'dum', 'duma', 'neste', 'nesta', 'deste', 'desta', 'nesse', 'nessa',
  'e', 'ou', 'mas', 'que', 'se', 'não', 'sim', 'já', 'muito', 'mais', 'menos',
  'me', 'te', 'lhe', 'nos', 'lhes', 'se', 'mim', 'ti', 'si', 'ele', 'ela', 'eu', 'tu',
  'meu', 'minha', 'teu', 'tua', 'seu', 'sua', 'nosso', 'nossa', 'este', 'esta', 'isso',
  'quando', 'onde', 'como', 'porque', 'qual', 'quem', 'quanto', 'cujo', 'cuja',
]);

/** ¿Tiene forma de verbo? Conservador a propósito: sólo desinencias
 *  inequívocas. Un falso NEGATIVO manda el ítem a revisión, que es el
 *  lado barato del error. */
const PARECE_VERBO = (w: string) =>
  /(?:ar|er|ir|ôr|ando|endo|indo|ado|ido|[aeiou](?:mos|ram|rão|rei|rás|ria|riam|sse|ssem|res|rem|rmos)|ou|ei|eu|iu|am|em|o|a|e)$/i.test(w)
  && w.length >= 3;

interface Sospecha { id: string; bloque: string; sentence: string; answer: string; alternativas: number; motivo: string }

const items: { fichero: string; ex: any }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) items.push({ fichero: f, ex });

const cloze = items.filter(({ ex }) => ex.type === 'fill_blank');
const conPista: any[] = [], derivables: any[] = [], sospechosos: Sospecha[] = [];

for (const { fichero, ex } of cloze) {
  const s = String(ex.data?.sentence ?? '');
  const blanks = ex.data?.blanks ?? [];
  const tienePista = /\([^)]+\)/.test(s) || typeof ex.data?.hintEs === 'string';
  if (tienePista) { conPista.push(ex); continue; }
  // Un ítem se salva si TODOS sus huecos son derivables.
  const abiertos = blanks.filter((b: any) => {
    const w = String(b.answer ?? '').toLowerCase().trim();
    return !CERRADA.has(w) && !PARECE_VERBO(w);
  });
  if (!abiertos.length) { derivables.push(ex); continue; }
  sospechosos.push({
    id: ex.id, bloque: fichero.replace('.json', ''), sentence: s,
    answer: blanks.map((b: any) => b.answer).join(' · '),
    alternativas: blanks.reduce((a: number, b: any) => a + (b.alternatives?.length ?? 0), 0),
    motivo: `hueco léxico abierto sin pista: ${abiertos.map((b: any) => `«${b.answer}»`).join(', ')}`,
  });
}

console.log(`# \`fill_blank\` publicados — ${cloze.length}\n`);
console.log('| clase | n | % |');
console.log('|---|---:|---:|');
const pct = (n: number) => `${((n / cloze.length) * 100).toFixed(1)} %`;
console.log(`| con pista (paréntesis o \`hintEs\`) | ${conPista.length} | ${pct(conPista.length)} |`);
console.log(`| sin pista pero DERIVABLE (clase cerrada o forma verbal) | ${derivables.length} | ${pct(derivables.length)} |`);
console.log(`| **SOSPECHOSO: hueco léxico abierto sin pista** | **${sospechosos.length}** | **${pct(sospechosos.length)}** |`);

console.log(`\n## Los sospechosos, por bloque\n`);
const porBloque = new Map<string, number>();
for (const s of sospechosos) porBloque.set(s.bloque, (porBloque.get(s.bloque) ?? 0) + 1);
for (const [b, n] of [...porBloque].sort((a, b) => b[1] - a[1])) console.log(`- ${b}: ${n}`);

console.log(`\n## Muestra de ${Math.min(N_MUESTRA, sospechosos.length)} para dictamen a mano\n`);
console.log('El muestreo lleva FRENO: ≥1 inresoluble real ⇒ se revisa la cola entera.\n');
const paso = Math.max(1, Math.floor(sospechosos.length / N_MUESTRA));
const muestra = sospechosos.filter((_, i) => i % paso === 0).slice(0, N_MUESTRA);
for (const s of muestra) {
  console.log(`### \`${s.id}\` [${s.bloque}]`);
  console.log(`   ${s.sentence}`);
  console.log(`   clave: **${s.answer}**${s.alternativas ? ` (+${s.alternativas} alternativas)` : ' · SIN alternativas'}`);
}
console.log(`\n_Total sospechosos: ${sospechosos.length}. Muestra: ${muestra.length}._`);

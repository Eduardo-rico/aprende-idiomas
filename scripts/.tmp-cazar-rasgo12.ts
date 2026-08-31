// Caza del rasgo nº12 — revisor pedagógico, lote 11.
// Usa medirRasgo/pValor DEL REPO. Fórmula: acierto sobre N, nunca recall.
import fs from 'node:fs';
import { medirRasgo, pValor, SOSPECHOSO, type ItemJuicio } from './lib/atajos';

const DOC = process.argv[2]!;
const txt = fs.readFileSync(DOC, 'utf8');
interface Item extends ItemJuicio { repair?: string; explicacion: string }
const items: Item[] = [];
for (const sec of txt.split(/\n### /).slice(1)) {
  const cab = sec.split('\n')[0]!;
  const m = cab.match(/^GJ-(\d+)\s+·\s+\*\*(MAL|BIEN)\*\*/);
  if (!m) continue;
  const campo = (etq: string) => (sec.match(new RegExp(`\\*\\*${etq}:\\*\\*\\s*«([\\s\\S]*?)»`))?.[1] ?? '').replace(/\s+/g, ' ').trim();
  items.push({
    id: `GJ-${m[1]}`, verdict: m[2] === 'BIEN', sentence: campo('sentence'),
    repair: campo('repair') || undefined,
    explicacion: (sec.match(/\*\*explicación:\*\*\s*([\s\S]*?)(?=\n\n|\n### |$)/)?.[1] ?? '').replace(/\s+/g, ' ').trim(),
  });
}
items.forEach((x, i) => (x.pos = i));
console.log(`Ítems: ${items.length} · BIEN ${items.filter(x=>x.verdict).length} · MAL ${items.filter(x=>!x.verdict).length}`);

const W = (s: string) => s.trim().split(/\s+/);

// ── ANOTACIÓN DECLARADA: glosa palabra-por-palabra al español ────────
// Para cada ítem: la traducción literal (mantenida la estructura) y si
// ESA glosa es español bien formado. Es juicio mío, declarado y
// auditable, no un regex.
const GLOSA: Record<string, [string, boolean]> = {
  'GJ-01': ['Para los críos entender el ejercicio, el profesor explicó todo otra vez.', false],
  'GJ-02': ['Antes de salir de casa, comprueben si cerraron bien la llave del gas.', true],
  'GJ-03': ['Es mejor esperar aquí dentro hasta la lluvia pasar del todo.', false],
  'GJ-04': ['Traje los documentos para el señor los firmar antes de irse.', false],
  'GJ-05': ['Después de ellos salió de la oficina, nos quedamos ordenando todas las cajas.', false],
  'GJ-06': ['Es preciso que hacermos alguna cosa antes de que sea demasiado tarde.', false],
  'GJ-07': ['Después de yo haber hablado con ella por teléfono, todo quedó mucho más claro.', true],
  'GJ-08': ['Sin ellos saber lo que pasó, es difícil pedirles una opinión.', true],
  'GJ-09': ['Conviene que la propuesta sea entregada antes del viernes al mediodía.', true],
  'GJ-10': ['Antes de que salgas de casa, deja la llave debajo del felpudo de la entrada.', true],
  'GJ-11': ['Sin los críos supieren de nada, los padres lo arreglaron todo en una sola tarde.', false],
  'GJ-12': ['Al llegar a lo alto de la sierra, ya no se veía nada por causa de la niebla.', true],
  'GJ-13': ['La cena de despedida es en el restaurante de siempre, hacia las ocho.', true],
  'GJ-14': ['La reunión con los inversores está a las tres de la tarde en la sala grande.', false],
  'GJ-15': ['La biblioteca queda al fondo de la calle, justo al lado de correos.', true],
  'GJ-16': ['La puerta estuvo abierta toda la noche y entró frío por toda la casa.', true],
  'GJ-17': ['Estoy portugués, pero vivo en España desde los dieciocho años.', false],
  'GJ-18': ['Antonio es enfermo desde la semana pasada y no va a trabajar.', false],
  'GJ-19': ['Ella es profesora de Historia, aunque este año esté dando Portugués.', true],
  'GJ-20': ['El concierto está en el Coliseo el próximo sábado, a las nueve y media.', false],
  'GJ-21': ['Este café es frío, debe de haberse quedado en la máquina desde la hora de comer.', false],
  'GJ-22': ['La entrada es gratuita para los socios, pero hoy está agotado el aforo.', true],
  'GJ-23': ['La fiesta de cumpleaños de mi sobrina está el domingo en casa de los abuelos.', false],
  'GJ-24': ['El edificio es del siglo diecinueve, pero está todo remodelado por dentro.', true],
};

// ── candidatos hechos a mano ─────────────────────────────────────────
type F = (x: Item, todos: Item[]) => boolean;
const CAND: [string, F][] = [
  ['★ GLOSA COGNADA: la traducción literal al español es español CORRECTO', (x) => GLOSA[x.id]![1]],
  ['sujeto = EVENTO (reunião/concerto/festa/jantar/casamento)', (x) => /(?<![\p{L}])(reunião|concerto|festa|jantar|casamento|almoço|espetáculo)(?![\p{L}])/iu.test(x.sentence)],
  ['primer verbo copulativo de la frase es una forma de ESTAR', (x) => (x.sentence.match(/(?<![\p{L}])(é|sou|está|estou|esteve|fica)(?![\p{L}])/iu)?.[1] ?? '').toLowerCase().startsWith('est')],
  ['lleva a la vez una forma de SER y una de ESTAR', (x) => /(?<![\p{L}])(é|sou|são|era|foi|seja)(?![\p{L}])/iu.test(x.sentence) && /(?<![\p{L}])(está|estou|estás|estão|esteve|estava|esteja)(?![\p{L}])/iu.test(x.sentence)],
  ['lleva alguna forma de ESTAR', (x) => /(?<![\p{L}])(está|estou|estás|estão|esteve|estava|esteja|estar)(?![\p{L}])/iu.test(x.sentence)],
  ['lleva alguna forma de SER', (x) => /(?<![\p{L}])(é|sou|és|são|era|foi|seja|ser)(?![\p{L}])/iu.test(x.sentence)],
  ['lleva infinitivo flexionado visible (-rem/-rmos/-res/-rdes)', (x) => /[\p{L}](?:rem|rmos|res|rdes)(?![\p{L}])/iu.test(x.sentence)],
  ['lleva sujeto expreso entre preposición e infinitivo', (x) => /(?<![\p{L}])(para|sem|depois de|antes de|até|ao)\s+(?:os|as|o|a|eles|elas|eu|tu|nós)\s+\p{L}+/iu.test(x.sentence)],
  ['lleva conjunción «que» subordinante', (x) => /(?<![\p{L}])que(?![\p{L}])/iu.test(x.sentence)],
  ['lleva forma de conjuntivo', (x) => /(?<![\p{L}])(seja|façamos|esteja|saiba|souberem|passe|venha|fosse|estejas)(?![\p{L}])/iu.test(x.sentence)],
  ['lleva nombre propio a mitad de frase', (x) => /\s[A-ZÁÉÍÓÚÂÊÔÃÕ]\p{L}+/u.test(x.sentence)],
  ['lleva numeral o expresión de hora', (x) => /(?<![\p{L}])(uma|duas|três|oito|nove|dez|meia|dezoito|dezanove|meio-dia|horas?)(?![\p{L}])|\d/iu.test(x.sentence)],
  ['lleva «mas» adversativo', (x) => /(?<![\p{L}])mas(?![\p{L}])/iu.test(x.sentence)],
  ['lleva «desde»', (x) => /(?<![\p{L}])desde(?![\p{L}])/iu.test(x.sentence)],
  ['lleva posesivo (minha/meu/sua/tua)', (x) => /(?<![\p{L}])(minha|meu|sua|seu|tua|teu|nossa|nosso)(?![\p{L}])/iu.test(x.sentence)],
  ['lleva «miúdos»', (x) => /miúdos/iu.test(x.sentence)],
  ['primera palabra es artículo definido', (x) => /^(?:O|A|Os|As|Este|Esta|Ela|Ele)\s/u.test(x.sentence)],
  ['primera palabra es preposición', (x) => /^(?:Para|Sem|Depois|Antes|Ao|Em|Com|Por)\s/u.test(x.sentence)],
  ['primera palabra es un verbo finito', (x) => /^(?:É|Estou|Trouxe|Convém|Verifiquem|Deixa|Está|Sou)(?![\p{L}])/u.test(x.sentence)],
  ['segunda mitad del lote', (x) => (x.pos ?? 0) >= 12],
  ['sección B (ser/estar)', (x) => (x.pos ?? 0) >= 12],
  ['posición impar dentro de su sección', (x) => ((x.pos ?? 0) % 12) % 2 === 0],
  ['lleva verbo en pretérito perfeito simples', (x) => /(?<![\p{L}])(explicou|ficámos|passou|trouxe|ficou|trataram|via|entrou|esteve|foi|fecharam|saiu)(?![\p{L}])/iu.test(x.sentence)],
  ['la frase describe una acción concreta con agente humano', (x) => /(?<![\p{L}])(professor|miúdos|pais|eles|eu|senhor|António|Ela|sócios|investidores|avós|sobrinha)(?![\p{L}])/iu.test(x.sentence)],
  ['lleva 2 o más preposiciones contraídas', (x) => (x.sentence.match(/(?<![\p{L}])(do|da|dos|das|no|na|nos|nas|ao|aos|à|às|pelo|pela|num|numa)(?![\p{L}])/giu) ?? []).length >= 2],
  ['lleva 3 o más preposiciones contraídas', (x) => (x.sentence.match(/(?<![\p{L}])(do|da|dos|das|no|na|nos|nas|ao|aos|à|às|pelo|pela|num|numa)(?![\p{L}])/giu) ?? []).length >= 3],
  ['termina en sintagma preposicional', (x) => /(?<![\p{L}])(de|da|do|em|na|no|a|à|por|com|para)\s+\p{L}+[.!?]?$/iu.test(x.sentence)],
  ['lleva dos verbos finitos o más', (x) => (x.sentence.match(/(?<![\p{L}])(é|está|estou|esteve|fica|vivo|explicou|ficámos|trouxe|convém|verifiquem|deixa|via|ficou|trataram|passou|entrou|vai|deve|fecharam|saiu|tenho)(?![\p{L}])/giu) ?? []).length >= 2],
];

// ── candidatos numéricos: todos los umbrales ─────────────────────────
const NUM: [string, (x: Item) => number][] = [
  ['nº de palabras', (x) => W(x.sentence).length],
  ['nº de caracteres', (x) => x.sentence.length],
  ['nº de comas', (x) => (x.sentence.match(/,/g) ?? []).length],
  ['palabras en la coleta tras la 1.ª coma (0 si no hay coma)', (x) => x.sentence.includes(',') ? W(x.sentence.split(',').slice(1).join(',')).length : 0],
  ['caracteres en la coleta tras la 1.ª coma', (x) => x.sentence.includes(',') ? x.sentence.split(',').slice(1).join(',').trim().length : 0],
  ['palabras ANTES de la 1.ª coma', (x) => x.sentence.includes(',') ? W(x.sentence.split(',')[0]!).length : W(x.sentence).length],
  ['largo de la palabra más larga', (x) => Math.max(...W(x.sentence).map((w) => w.replace(/[^\p{L}]/gu, '').length))],
  ['nº de palabras de ≥8 letras', (x) => W(x.sentence).filter((w) => w.replace(/[^\p{L}]/gu, '').length >= 8).length],
  ['nº de tildes', (x) => (x.sentence.match(/[áéíóúâêôãõà]/giu) ?? []).length],
];

interface Fila { nombre: string; aciertos: number; n: number; dir: string; pres: number; p: number }
const filas: Fila[] = [];
for (const [nombre, f] of CAND) {
  const a = medirRasgo(nombre, (x) => f(x as Item, items), items);
  filas.push({ nombre, aciertos: a.aciertos, n: a.n, dir: a.direccion, pres: a.presentes, p: pValor(a.aciertos, a.n) });
}
for (const [nombre, g] of NUM) {
  const vals = [...new Set(items.map(g))].sort((a, b) => a - b);
  for (const t of vals.slice(0, -1)) {
    const nom = `${nombre} > ${t}`;
    const a = medirRasgo(nom, (x) => g(x as Item) > t, items);
    filas.push({ nombre: nom, aciertos: a.aciertos, n: a.n, dir: a.direccion, pres: a.presentes, p: pValor(a.aciertos, a.n) });
  }
}
// bolsa de palabras: cada token presente en 3..21 ítems
const toks = new Map<string, Set<string>>();
for (const x of items) for (const w of new Set(x.sentence.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/\p{L}+/gu) ?? [])) {
  if (!toks.has(w)) toks.set(w, new Set());
  toks.get(w)!.add(x.id);
}
const bow: Fila[] = [];
for (const [w, ids] of toks) {
  if (ids.size < 3 || ids.size > 21) continue;
  const a = medirRasgo(`palabra «${w}»`, (x) => ids.has(x.id), items);
  bow.push({ nombre: `palabra «${w}»`, aciertos: a.aciertos, n: a.n, dir: a.direccion, pres: a.presentes, p: pValor(a.aciertos, a.n) });
}

const tabla = (fs2: Fila[], tit: string) => {
  console.log(`\n## ${tit}\n`);
  console.log('| rasgo | acierto | % | dirección | presente en | p | |');
  console.log('|---|---:|---:|---|---:|---:|:-:|');
  for (const f of fs2.sort((a, b) => b.aciertos - a.aciertos)) {
    console.log(`| ${f.nombre} | ${f.aciertos}/${f.n} | ${Math.round(100 * f.aciertos / f.n)} % | ${f.dir} | ${f.pres} | ${f.p.toFixed(4)} | ${f.p < SOSPECHOSO ? '**BLOQUEA**' : ''} |`);
  }
};
tabla(filas, 'Candidatos de diseño');
tabla(bow.filter((f) => f.p < 0.2), 'Bolsa de palabras (sólo p<0,20; ojo a las comparaciones múltiples)');
console.log(`\nBolsa de palabras: ${bow.length} tokens probados, ${bow.filter(f=>f.p<SOSPECHOSO).length} por debajo de p=0,05 (esperados por azar: ${(bow.length*0.032).toFixed(1)}).`);

// desglose del ★
console.log('\n## Desglose ítem a ítem del rasgo ★ (glosa cognada)\n');
const dirBien = medirRasgo('g', (x) => GLOSA[(x as Item).id]![1], items).direccion === 'presente⇒BIEN';
console.log('```');
for (const x of items) {
  const g = GLOSA[x.id]!;
  const pred = dirBien ? g[1] : !g[1];
  console.log(`${x.id} · glosa ${g[1] ? 'ES CORRECTA ' : 'ES INCORRECTA'} ⇒ predice ${pred ? 'BIEN' : 'MAL '} · real ${x.verdict ? 'BIEN' : 'MAL '} · ${pred === x.verdict ? 'ACIERTA' : 'falla'}`);
}
console.log('```');
console.log(`\np binomial de referencia N=24: 16⇒${pValor(16,24).toFixed(4)} · 17⇒${pValor(17,24).toFixed(4)} · 18⇒${pValor(18,24).toFixed(4)} · 19⇒${pValor(19,24).toFixed(4)} · 20⇒${pValor(20,24).toFixed(4)} · 21⇒${pValor(21,24).toFixed(4)}`);
console.log(`p binomial N=12 (por sección): 9⇒${pValor(9,12).toFixed(4)} · 10⇒${pValor(10,12).toFixed(4)} · 11⇒${pValor(11,12).toFixed(4)} · 12⇒${pValor(12,12).toFixed(4)}`);

// el ★ por secciones
for (const [tit, sub] of [['sección A (GJ-01..12)', items.slice(0,12)], ['sección B (GJ-13..24)', items.slice(12)]] as [string, Item[]][]) {
  const a = medirRasgo('glosa', (x) => GLOSA[(x as Item).id]![1], sub);
  console.log(`★ glosa cognada en ${tit}: ${a.aciertos}/${a.n} (${Math.round(100*a.acierto)} %) ${a.direccion} · p=${pValor(a.aciertos, a.n).toFixed(4)}`);
}

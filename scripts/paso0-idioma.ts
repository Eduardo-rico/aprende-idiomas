// scripts/paso0-idioma.ts — HAY / PIDE / FALTA de una lengua, por nivel y
// por destreza, contra su sección del currículo.
//
//   npx tsx scripts/paso0-idioma.ts --lang=ro
//   npx tsx scripts/paso0-idioma.ts --lang=pt     # la misma cuenta, para comparar
//
// Es el Paso 0 de la fase F, y existe porque en portugués el Paso 0 se
// hizo A MANO (E1, 2026-08-11) y por eso no se podía repetir: la cifra
// «~430 de mediación» resultó ser del RUSO, y nadie lo vio hasta que un
// script la recalculó. Aquí la cuenta es un comando, parametrizado por
// lengua, para que arrancar RO, CS y RU no dependa de que alguien rehaga
// el cálculo — ni de que lo rehaga bien.
//
// QUÉ MIDE, y de dónde:
//
//   PIDE — de `docs/plans/2026-07-28-curriculos-completos.md`, sección
//   `## <Lengua>`. Por nivel: los descriptores «Sabrá hacer», etiquetados
//   por destreza, y la línea «Material a producir» (palabras · minutos ·
//   ejercicios · tareas). Los descriptores de PRODUCCIÓN ORAL e
//   INTERACCIÓN (oral y escrita) se cuentan APARTE, como excluidos: es la
//   decisión de Edu del 2026-08-11 y vale para las cuatro lenguas.
//
//   HAY — del plano de datos `lib/data/languages/<lang>/`: conceptos y
//   lecciones del currículo en código, ejercicios de `blocks/` (servibles
//   y por tipo), historias, lecturas y sus palabras con el contador
//   honesto (token = contiene una letra; ver E2#29), y voces declaradas.
//
// LO QUE NO MIDE, dicho: los minutos de audio (no hay índice de duración
// por lengua) y los descriptores DEMOSTRADOS (no hay `cefr.json` fuera de
// PT). Salen como «sin medir», nunca como cero.
//
// EL GATE QUE LLEVA DENTRO: la cabecera de cada nivel declara cuántos
// descriptores tiene —«**Sabrá hacer (14):**»— y el parser cuenta los que
// encuentra. Si no coinciden, el script FALLA. Un contador que lee el
// documento equivocado, o un documento al que alguien borró una línea,
// tiene que sonar, no imprimir un número plausible.
import fs from 'node:fs';
import path from 'node:path';
import { hasLocale, type LanguageId } from '../lib/locales';
import { dataDir, blocksDir, storiesDir } from '../lib/data/registry';
import { servibleAlAlumno } from './lib/estado-item';
import { VOICES } from './config';
import { EL_VOICES } from './lib/elevenlabs-tts';

export const TITULO: Record<LanguageId, string> = { pt: 'Portugués', ro: 'Rumano', cs: 'Checo', ru: 'Ruso' };
export const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type Nivel = (typeof NIVELES)[number];

/** Las destrezas del proyecto, y a cuál va cada etiqueta del currículo.
 *  Una etiqueta que no esté aquí hace FALLAR el parser: meterla en una
 *  bolsa por defecto sería contar sin saber qué. */
export type Destreza = 'lectura' | 'escucha' | 'escritura' | 'mediacion' | 'sistema' | 'EXCLUIDO' | 'SIN_ETIQUETA';
export const DESTREZA_DE: Record<string, Destreza> = {
  'COMPRENSIÓN LECTORA': 'lectura',
  'COMPRENSIÓN ORAL': 'escucha',
  'COMPRENSIÓN AUDIOVISUAL': 'escucha',
  'PRODUCCIÓN ESCRITA': 'escritura',
  'MEDIACIÓN': 'mediacion',
  'GRAMÁTICA': 'sistema',
  'LÉXICO': 'sistema',
  'FONOLOGÍA': 'sistema',
  'PRAGMÁTICA': 'sistema',
  'CULTURA': 'sistema',
  'ESCRITURA HISTÓRICA': 'sistema',
  'VARIANTE': 'sistema',
  // Excluidas por decisión de Edu (2026-08-11): sin `interaccion` ni
  // `produccion_oral`. Se cuentan para que se vea cuánto queda fuera.
  'PRODUCCIÓN ORAL': 'EXCLUIDO',
  'INTERACCIÓN ORAL': 'EXCLUIDO',
  'INTERACCIÓN ESCRITA': 'EXCLUIDO',
  'INTERACCIÓN': 'EXCLUIDO',
};

export interface Material { palabras: number; audioMin: number; ejercicios: number; tareas: number }
export interface NivelCurriculo {
  nivel: Nivel;
  horas: number | null;
  declarados: number;
  descriptores: { etiqueta: string; destreza: Destreza }[];
  material: Material | null;
}

const num = (s: string) => Number(s.replace(/[.,]/g, ''));

/** La sección `## <Lengua>` del documento, cortada en niveles. */
export function parsearCurriculo(md: string, lang: LanguageId): NivelCurriculo[] {
  const titulo = TITULO[lang];
  const lineas = md.split('\n');
  const ini = lineas.findIndex((l) => l.trim() === `## ${titulo}`);
  if (ini < 0) throw new Error(`no hay sección «## ${titulo}» en el currículo`);
  let fin = lineas.findIndex((l, i) => i > ini && /^## /.test(l));
  if (fin < 0) fin = lineas.length;
  const seccion = lineas.slice(ini, fin);

  const out: NivelCurriculo[] = [];
  // El ruso funde «pre_A1 + A1» en una cabecera y da las horas como
  // intervalo («60-90 h + 170-240 h»): el nivel se lee, las horas no.
  const cab = new RegExp(`^### ${titulo} · (?:pre_A1 \\+ )?(A1|A2|B1|B2|C1|C2)\\b(?: — (\\d+) h)?`);
  for (let i = 0; i < seccion.length; i++) {
    const m = seccion[i].match(cab);
    if (!m) continue;
    let j = i + 1;
    while (j < seccion.length && !/^### /.test(seccion[j])) j++;
    const cuerpo = seccion.slice(i + 1, j);
    const nivel = m[1] as Nivel;
    const horas = m[2] ? Number(m[2]) : null;

    const decl = cuerpo.map((l) => l.match(/\*\*Sabrá hacer \((\d+)\):\*\*/)).find(Boolean);
    if (!decl) throw new Error(`${lang} ${nivel}: sin cabecera «Sabrá hacer (N)»`);
    const declarados = Number(decl[1]);

    // Los descriptores son las viñetas que siguen a la cabecera «Sabrá
    // hacer», hasta la primera línea que no es viñeta. RO y CS los
    // etiquetan («- [GRAMÁTICA · CASO] …»); PT y RU no. Sin etiqueta no se
    // adivina la destreza: se cuenta como SIN_ETIQUETA y se dice.
    const k0 = cuerpo.findIndex((l) => /\*\*Sabrá hacer \(\d+\):\*\*/.test(l));
    const descriptores: { etiqueta: string; destreza: Destreza }[] = [];
    for (let k = k0 + 1; k < cuerpo.length; k++) {
      const l = cuerpo[k];
      if (l.trim() === '' && descriptores.length === 0) continue;
      if (!/^- /.test(l)) break;
      const tag = l.match(/^- \[([^\]]+)\]/);
      if (!tag) { descriptores.push({ etiqueta: '', destreza: 'SIN_ETIQUETA' }); continue; }
      const etiqueta = tag[1].trim();
      const categoria = etiqueta.split('·')[0].trim();
      const destreza = DESTREZA_DE[categoria];
      if (!destreza) throw new Error(`${lang} ${nivel}: etiqueta desconocida «${categoria}» — decláralo en DESTREZA_DE`);
      descriptores.push({ etiqueta, destreza });
    }
    if (descriptores.length !== declarados) {
      throw new Error(`${lang} ${nivel}: la cabecera declara ${declarados} descriptores y el parser cuenta ${descriptores.length}`);
    }

    const mat = cuerpo
      .map((l) => l.match(/\*\*Material a producir:\*\* ([\d.,]+) palabras de lectura · ([\d.,]+) min de audio · ([\d.,]+) ejercicios · ([\d.,]+) tareas/))
      .find(Boolean);
    const material = mat ? { palabras: num(mat[1]), audioMin: num(mat[2]), ejercicios: num(mat[3]), tareas: num(mat[4]) } : null;
    out.push({ nivel, horas, declarados, descriptores, material });
  }
  if (out.length !== NIVELES.length) throw new Error(`${lang}: el currículo tiene ${out.length} niveles parseables, no ${NIVELES.length}`);
  return out;
}

export interface Corpus {
  conceptos: number;
  bloques: number;
  lecciones: number;
  ejercicios: number;
  servibles: number;
  porTipo: Record<string, number>;
  mediaciones: number;
  historias: number;
  lecturas: number;
  palabrasLectura: number;
  /** El estante privado (`lecturas-privadas/`): se cuenta APARTE porque el
   *  gate E5 no lo cuenta, y dos cifras de lectura con el mismo nombre
   *  son la forma conocida de que una sesión se crea la equivocada. */
  lecturasPrivadas: number;
  palabrasPrivadas: number;
  voces: string[];
}

const conLetra = (t: string) => /\p{L}/u.test(t);
const palabras = (s: string) => s.split(/\s+/).filter(conLetra).length;

const jsonsDe = (dir: string): string[] =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f)) : [];

/** Lo que HAY en `lib/data/languages/<lang>/`, medido y no supuesto. */
export async function medirCorpus(lang: LanguageId): Promise<Corpus> {
  const cur = await import(`../lib/data/languages/${lang}/curriculum`);
  const bloques = (cur.BLOCKS ?? []) as { lessons?: unknown[] }[];
  const lecciones = bloques.reduce((n, b) => n + (b.lessons?.length ?? 0), 0);

  const items: any[] = [];
  for (const f of jsonsDe(blocksDir(lang))) {
    const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (Array.isArray(d)) items.push(...d);
  }
  const porTipo: Record<string, number> = {};
  for (const x of items) porTipo[x.type ?? '?'] = (porTipo[x.type ?? '?'] ?? 0) + 1;

  const cuentaLecturas = (sub: string) => {
    let n = 0, w = 0;
    for (const f of jsonsDe(path.join(dataDir(lang), sub))) {
      const d = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (!Array.isArray(d.parrafos)) continue;
      n += 1;
      // La MISMA regla que `gate-e5.ts`: en las lecturas con karaoke las
      // palabras viven en `parrafos[].palabras[].t`; en el resto, en
      // `texto`. Dos contadores con reglas distintas dan dos cifras con el
      // mismo nombre (la primera versión de éste daba 191 más).
      for (const p of d.parrafos) {
        const toks = (p.palabras as { t: string }[] | undefined)?.filter((x) => conLetra(String(x.t ?? ''))).length;
        w += toks ?? palabras(String(p.texto ?? ''));
      }
    }
    return { n, w };
  };
  const pub = cuentaLecturas('lecturas');
  const priv = cuentaLecturas('lecturas-privadas');

  const voces = [
    ...Object.keys(VOICES).filter((k) => k.startsWith(lang)).map((k) => `MiniMax:${k}`),
    ...Object.entries(EL_VOICES).filter(([k]) => lang === 'pt' && (k === 'pt' || k === 'br')).map(([, v]) => `ElevenLabs:${v.name}`),
  ];

  return {
    conceptos: (cur.ALL_CONCEPTS ?? []).length,
    bloques: bloques.length,
    lecciones,
    ejercicios: items.length,
    servibles: items.filter(servibleAlAlumno).length,
    porTipo,
    mediaciones: items.filter((x) => x.type === 'mediation').length,
    historias: jsonsDe(storiesDir(lang)).length,
    lecturas: pub.n,
    palabrasLectura: pub.w,
    lecturasPrivadas: priv.n,
    palabrasPrivadas: priv.w,
    voces,
  };
}

const fmt = (n: number) => n.toLocaleString('es-ES');

export function informe(lang: LanguageId, niveles: NivelCurriculo[], corpus: Corpus): string {
  const L: string[] = [];
  L.push(`# Paso 0 · ${TITULO[lang]} (\`${lang}\`) — HAY / PIDE / FALTA\n`);
  L.push(`Currículo: \`docs/plans/2026-07-28-curriculos-completos.md\` §${TITULO[lang]} · corpus: \`lib/data/languages/${lang}/\`\n`);

  L.push('## Material, por nivel (pide = «Material a producir» del currículo)\n');
  L.push('| nivel | horas | palabras pide | ejercicios pide | tareas pide | audio min pide |');
  L.push('|---|---:|---:|---:|---:|---:|');
  const tot = { palabras: 0, ejercicios: 0, tareas: 0, audioMin: 0 };
  for (const n of niveles) {
    const m = n.material;
    if (m) { tot.palabras += m.palabras; tot.ejercicios += m.ejercicios; tot.tareas += m.tareas; tot.audioMin += m.audioMin; }
    L.push(`| ${n.nivel} | ${n.horas ?? '—'} | ${m ? fmt(m.palabras) : 'sin línea'} | ${m ? fmt(m.ejercicios) : '—'} | ${m ? fmt(m.tareas) : '—'} | ${m ? fmt(m.audioMin) : '—'} |`);
  }
  L.push(`| **Σ** | | **${fmt(tot.palabras)}** | **${fmt(tot.ejercicios)}** | **${fmt(tot.tareas)}** | **${fmt(tot.audioMin)}** |`);

  L.push('\n## Totales: hay / pide / falta\n');
  L.push('| eje | HAY (medido) | PIDE | FALTA |');
  L.push('|---|---:|---:|---:|');
  const fila = (eje: string, hay: number, pide: number) => L.push(`| ${eje} | ${fmt(hay)} | ${fmt(pide)} | **${fmt(Math.max(0, pide - hay))}** |`);
  fila('palabras de lectura (catálogo público, la cifra del gate E5)', corpus.palabrasLectura, tot.palabras);
  if (corpus.lecturasPrivadas) L.push(`| palabras en el estante privado (no cuentan en el gate) | ${fmt(corpus.palabrasPrivadas)} · ${corpus.lecturasPrivadas} lecturas | — | — |`);
  fila('ejercicios (servibles)', corpus.servibles, tot.ejercicios);
  fila('tareas de producción/mediación', corpus.mediaciones, tot.tareas);
  L.push(`| minutos de audio | sin medir aquí | ${fmt(tot.audioMin)} | — |`);
  L.push('');
  L.push(`Corpus en código: **${corpus.conceptos} conceptos · ${corpus.bloques} bloques · ${corpus.lecciones} lecciones · ${corpus.ejercicios} ejercicios (${corpus.servibles} servibles) · ${corpus.historias} historias · ${corpus.lecturas} lecturas**. Voces declaradas: ${corpus.voces.length ? corpus.voces.join(', ') : '**ninguna**'}.`);
  if (corpus.ejercicios) {
    L.push('Por tipo: ' + Object.entries(corpus.porTipo).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(' · ') + '.');
  }

  L.push('\n## Descriptores «Sabrá hacer», por nivel y destreza (pide)\n');
  const destrezas: Destreza[] = ['lectura', 'escucha', 'escritura', 'mediacion', 'sistema'];
  L.push('| nivel | ' + destrezas.join(' | ') + ' | **en alcance** | excluidos (oral/interacción) | sin etiqueta | declarados |');
  L.push('|---|' + destrezas.map(() => '---:').join('|') + '|---:|---:|---:|---:|');
  const sum: Record<string, number> = {};
  for (const n of niveles) {
    const c: Record<string, number> = {};
    for (const d of n.descriptores) c[d.destreza] = (c[d.destreza] ?? 0) + 1;
    for (const k of Object.keys(c)) sum[k] = (sum[k] ?? 0) + c[k];
    const enAlcance = n.descriptores.filter((d) => d.destreza !== 'EXCLUIDO' && d.destreza !== 'SIN_ETIQUETA').length;
    L.push(`| ${n.nivel} | ${destrezas.map((d) => c[d] ?? 0).join(' | ')} | **${enAlcance}** | ${c.EXCLUIDO ?? 0} | ${c.SIN_ETIQUETA ?? 0} | ${n.declarados} |`);
  }
  const totalAlcance = destrezas.reduce((a, d) => a + (sum[d] ?? 0), 0);
  L.push(`| **Σ** | ${destrezas.map((d) => `**${sum[d] ?? 0}**`).join(' | ')} | **${totalAlcance}** | **${sum.EXCLUIDO ?? 0}** | **${sum.SIN_ETIQUETA ?? 0}** | **${niveles.reduce((a, n) => a + n.declarados, 0)}** |`);
  if (sum.SIN_ETIQUETA) L.push(`\n**${sum.SIN_ETIQUETA} descriptores sin etiqueta de destreza**: la sección de ${TITULO[lang]} no los etiqueta y este script no adivina. Para repartirlos por destreza hay que etiquetarlos en el documento.`);
  L.push('');
  L.push(`Descriptores DEMOSTRADOS: sin medir aquí (no hay \`cefr.json\` ni ancla de descriptores para \`${lang}\`${lang === 'pt' ? ', salvo el eje MCER de PT, que se mide en `anchor.ts`' : ''}). Los ${sum.EXCLUIDO ?? 0} excluidos son decisión de Edu (2026-08-11): sin \`interaccion\` ni \`produccion_oral\`.`);
  L.push('');
  L.push(`Gate del parser: en los ${niveles.length} niveles, los descriptores contados coinciden con los declarados en cabecera (si no, este script no imprime nada: falla).`);
  return L.join('\n');
}

async function main() {
  const arg = process.argv.find((a) => a.startsWith('--lang'));
  const lang = (arg ? (arg.includes('=') ? arg.split('=')[1] : process.argv[process.argv.indexOf(arg) + 1]) : 'ro') ?? '';
  if (!hasLocale(lang)) throw new Error(`--lang=${lang}: no es una lengua del proyecto`);
  const md = fs.readFileSync(path.join(process.cwd(), 'docs/plans/2026-07-28-curriculos-completos.md'), 'utf8');
  const niveles = parsearCurriculo(md, lang);
  const corpus = await medirCorpus(lang);
  console.log(informe(lang, niveles, corpus));
}

if (process.argv[1] && path.basename(process.argv[1]) === 'paso0-idioma.ts') {
  main().catch((e) => { console.error(`✖ ${e.message}`); process.exit(1); });
}

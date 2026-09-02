// scripts/lotes/cloze-ro-a1.ts — EL PRIMER LOTE RUMANO: cloze derivado, A1.
//
//   npx tsx scripts/lotes/cloze-ro-a1.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a1.ts --json     # ítems para publicar
//
// 24 ítems, tres puntos de clase `paradigma` del inventario (8 cada uno):
//   · r2-articulo-enclitico-sg  — la respuesta la deriva `articulado()`
//   · r3-presente-4-conjugaciones — la deriva `presente()`
//   · r3-sufijo-ez-esc — la deriva `presente()`, y el gate comprueba que
//     la forma lleve el sufijo
//
// El contrato es el de PT (`cloze-e2-15.ts`), con los gates portados —un
// hueco, paréntesis que nombra el lema, pista que DETERMINA y no deletrea,
// ancla literal en la frase, ninguna respuesta domina su punto— y con los
// tres que el rumano añade (Paso 0 §5-§6):
//   1. ORTOGRAFÍA: frase, pista y respuesta pasan `revisarOrtografiaRo`.
//   2. HUNSPELL: la frase ENTERA con el hueco relleno, palabra a palabra,
//      contra ro_RO. Es el segundo camino: el autor no habla rumano de
//      nacimiento y una frase con una palabra inventada no puede llegar al
//      lingüista con cara de buena.
//   3. `transparenteLatin`, declarado por ítem: ¿la raíz común deja
//      acertar sin saber rumano? El preflight imprime la proporción y el
//      lote no sale por encima de la mitad — el tope de `espejoEs` en PT.
//
// NO se publica: `ro` no tiene bloques ni lecciones todavía, y el
// coordinador pidió el lote preparado, no en el corpus. Y antes de
// publicarse pasa por el lingüista adversarial.
import { SUSTANTIVOS_A1, VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { articulado, presente, type Persona } from '../lib/paradigma-ro';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';

export interface ClozeRo {
  p: string;
  s: string;              // frase con ___ y el lema entre paréntesis
  pista: string;          // hintEs: determina, no deletrea
  ancla: string;          // trozo literal que excluye las alternativas
  /** derivada: sustantivo articulado */
  lema?: string;
  /** derivada: verbo + persona */
  inf?: string; per?: Persona;
  /** declarada, donde el paradigma no llega */
  r?: string;
  alt?: string[];
  /** ¿La raíz latina común deja acertar sin saber la morfología? Declarado. */
  transparenteLatin: boolean;
}

export const ITEMS: ClozeRo[] = [
  // ── r2-articulo-enclitico-sg · 8 ─────────────────────────────────
  // El contexto exige el DEFINIDO (un referente ya dado o único): el
  // ancla es lo que lo exige. El instinto castellano pone «el/la» delante
  // y deja el sustantivo desnudo; aquí el hueco pide la forma con el
  // artículo dentro.
  { p: 'r2-articulo-enclitico-sg', lema: 'om', s: '___ (om) de la fereastră este vecinul meu.', pista: 'hombre — con el artículo definido, que va pegado al final', ancla: 'de la fereastră este vecinul meu', transparenteLatin: false },
    // «casa» es la misma cadena en español y en rumano: glosar es deletrear
  // (la cicatriz de PT, tres veces). Se describe la cosa.
  { p: 'r2-articulo-enclitico-sg', lema: 'casă', s: '___ (casă) noastră este lângă parc.', pista: 'el sitio donde vive una familia — con artículo definido enclítico (femenino en -ă)', ancla: 'noastră', transparenteLatin: true },
  { p: 'r2-articulo-enclitico-sg', lema: 'tren', s: '___ (tren) de București pleacă la ora opt.', pista: 'tren — con artículo definido enclítico (neutro)', ancla: 'de București pleacă la ora opt', transparenteLatin: true },
  { p: 'r2-articulo-enclitico-sg', lema: 'carte', s: '___ (carte) aceasta este foarte interesantă.', pista: 'libro — con artículo definido enclítico (femenino en -e)', ancla: 'aceasta', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'frate', s: '___ (frate) meu locuiește la Cluj.', pista: 'hermano — con artículo definido enclítico (masculino en -e)', ancla: 'meu locuiește', transparenteLatin: true },
  { p: 'r2-articulo-enclitico-sg', lema: 'metrou', s: '___ (metrou) din Cluj nu există încă.', pista: 'metro — con artículo definido enclítico (neutro en -u)', ancla: 'din Cluj nu există încă', transparenteLatin: true },
  { p: 'r2-articulo-enclitico-sg', lema: 'zi', s: '___ (zi) de azi este foarte frumoasă.', pista: 'día — con artículo definido enclítico (femenino en -i)', ancla: 'de azi', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'ușă', s: '___ (ușă) de la intrare este deschisă.', pista: 'puerta — con artículo definido enclítico (femenino en -ă); lema opaco, sin cognado', ancla: 'de la intrare este deschisă', transparenteLatin: false },

  // ── r3-presente-4-conjugaciones · 8 ──────────────────────────────
  // Las casillas que DIVERGEN (motivo del inventario): 3.ª pl = 3.ª sg en
  // -a; 1.ª sg = 3.ª pl en -e/-i; y la 2.ª sg con palatalización.
  { p: 'r3-presente-4-conjugaciones', inf: 'a cânta', per: 'ei', s: 'Copiii ___ (a cânta) în fiecare dimineață la școală.', pista: 'presente, 3.ª del plural — conjugación en -a', ancla: 'Copiii', transparenteLatin: true },
  { p: 'r3-presente-4-conjugaciones', inf: 'a merge', per: 'ei', s: 'Ei ___ (a merge) la piață sâmbăta.', pista: 'presente, 3.ª del plural — conjugación en -e', ancla: 'Ei', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a dormi', per: 'ei', s: 'Bunicii ___ (a dormi) după masă.', pista: 'presente, 3.ª del plural — conjugación en -i', ancla: 'Bunicii', transparenteLatin: true },
  { p: 'r3-presente-4-conjugaciones', inf: 'a vedea', per: 'tu', s: 'Tu ___ (a vedea) marea de la fereastră?', pista: 'presente, 2.ª del singular — conjugación en -ea, con cambio de consonante', ancla: 'Tu', transparenteLatin: true },
  { p: 'r3-presente-4-conjugaciones', inf: 'a pleca', per: 'tu', s: 'Tu ___ (a pleca) mâine la Brașov?', pista: 'presente, 2.ª del singular — conjugación en -a', ancla: 'Tu', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a ști', per: 'noi', s: 'Noi ___ (a ști) unde este gara.', pista: 'presente, 1.ª del plural — conjugación en -i, tema en vocal', ancla: 'Noi', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a coborî', per: 'voi', s: 'Voi ___ (a coborî) la stația următoare?', pista: 'presente, 2.ª del plural — conjugación en -î', ancla: 'Voi', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a mânca', per: 'noi', s: 'Noi ___ (a mânca) la restaurant duminica.', pista: 'presente, 1.ª del plural — conjugación en -a, desde el tema del infinitivo', ancla: 'Noi', transparenteLatin: true },

  // ── r3-sufijo-ez-esc · 8 ─────────────────────────────────────────
  // Donde la raíz se reconoce, el instinto produce *lucr, *cit: el ítem
  // pide la forma con el sufijo, y la pista nombra el sufijo como
  // paradigma (no la forma).
  { p: 'r3-sufijo-ez-esc', inf: 'a lucra', per: 'eu', s: 'Eu ___ (a lucra) la o bancă din centru.', pista: 'presente, 1.ª del singular — verbo con sufijo -ez', ancla: 'Eu', transparenteLatin: true },
  { p: 'r3-sufijo-ez-esc', inf: 'a lucra', per: 'el', s: 'Ea ___ (a lucra) de acasă vinerea.', pista: 'presente, 3.ª del singular — verbo con sufijo -ez', ancla: 'Ea', transparenteLatin: true },
  { p: 'r3-sufijo-ez-esc', inf: 'a citi', per: 'eu', s: 'Eu ___ (a citi) o carte în fiecare lună.', pista: 'presente, 1.ª del singular — verbo con sufijo -esc', ancla: 'Eu', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a citi', per: 'tu', s: 'Tu ___ (a citi) ziarul dimineața?', pista: 'presente, 2.ª del singular — verbo con sufijo -esc, palatalizado', ancla: 'Tu', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a vorbi', per: 'el', s: 'Profesorul ___ (a vorbi) rar și clar.', pista: 'presente, 3.ª del singular — verbo con sufijo -esc', ancla: 'Profesorul', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a locui', per: 'ei', s: 'Părinții mei ___ (a locui) la țară.', pista: 'presente, 3.ª del plural — verbo con sufijo -esc', ancla: 'Părinții mei', transparenteLatin: true },
  { p: 'r3-sufijo-ez-esc', inf: 'a plăti', per: 'eu', s: 'Eu ___ (a plăti) chiria pe data de întâi.', pista: 'presente, 1.ª del singular — verbo con sufijo -esc', ancla: 'Eu', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a găti', per: 'el', s: 'Mama ___ (a găti) ciorbă duminica.', pista: 'presente, 3.ª del singular — verbo con sufijo -esc', ancla: 'Mama', transparenteLatin: false },
];

const NOM = new Map(SUSTANTIVOS_A1.map((l) => [l.lema, l]));
const VERB = new Map(VERBOS_A1.map((v) => [v.inf, v]));

export function respuestaDe(x: ClozeRo): string | null {
  if (x.r) return x.r;
  if (x.lema) { const l = NOM.get(x.lema); return l ? articulado(l, 'sg') : null; }
  if (x.inf && x.per) { const v = VERB.get(x.inf); return v ? presente(v, x.per) : null; }
  return null;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const fraseRellena = (x: ClozeRo, r: string) => x.s.replace('___', r).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();

export function verificar(items: ClozeRo[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CLRO-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: el paradigma no cubre «${x.lema ?? x.inf}» y no hay respuesta declarada`); continue; }
    const huecos = x.s.split('___').length - 1;
    if (huecos !== 1) v.push(`${id}: ${huecos} huecos, tiene que haber 1`);
    if ((x.lema || x.inf) && !/\([^)]+\)/.test(x.s)) v.push(`${id}: pide una forma derivada y no nombra el lema entre paréntesis`);
    if (!x.pista.trim()) v.push(`${id}: sin pista`);
    if (!x.ancla.trim()) v.push(`${id}: sin ancla declarada`);
    else if (!x.s.includes(x.ancla)) v.push(`${id}: el ancla «${x.ancla}» no está en la frase`);
    // La pista no deletrea la respuesta, ni la frase la lleva fuera del hueco.
    const rn = norm(r);
    if (new RegExp(`(?<![\\p{L}])${rn}(?![\\p{L}])`, 'iu').test(norm(x.pista))) v.push(`${id}: la pista deletrea la respuesta «${r}»`);
    if (new RegExp(`(?<![\\p{L}])${r}(?![\\p{L}])`, 'iu').test(x.s.replace('___', ''))) v.push(`${id}: la respuesta «${r}» ya está escrita en la frase`);
    // El hueco de sufijo tiene que llevar el sufijo: si no, el punto no mide su punto.
    if (x.p === 'r3-sufijo-ez-esc' && !/(ez|ezi|ează|esc|ești|ește)$/.test(r)) v.push(`${id}: el punto es el sufijo y la forma «${r}» no lo lleva`);
    // Un ítem de artículo cuya respuesta es igual al lema no examina nada.
    if (x.lema && r === x.lema) v.push(`${id}: la forma articulada coincide con el lema`);
    // ORTOGRAFÍA DOOM3 en todo lo que el alumno ve.
    for (const [campo, t] of [['frase', x.s], ['pista', x.pista], ['respuesta', r]] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // Sujeto pospuesto al hueco en declarativa: orden de ejercicio, no de lengua.
    if (!x.s.includes('?') && /___ \([^)]*\)\s+(eu|tu|el|ea|noi|voi|ei|ele)(?![\p{L}])/u.test(x.s)) v.push(`${id}: sujeto pospuesto al hueco en una declarativa`);
    const clave = norm(x.s.replace(/\s+/g, ' ').trim());
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
    palabras.push(...fraseRellena(x, r).replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean));
  }
  // Reparto por punto: ninguna respuesta domina.
  const porPunto = new Map<string, Map<string, number>>();
  for (const x of items) { const r = respuestaDe(x); if (!r) continue; const m = porPunto.get(x.p) ?? new Map(); m.set(r, (m.get(r) ?? 0) + 1); porPunto.set(x.p, m); }
  for (const [p, m] of porPunto) {
    const n = [...m.values()].reduce((a, b) => a + b, 0);
    const [top, k] = [...m].sort((a, b) => b[1] - a[1])[0]!;
    if (n >= 4 && k / n > 0.5) v.push(`${p}: la respuesta «${top}» sale ${k} de ${n} veces`);
  }
  // El atajo del latín común: declarado, medido, con tope en la mitad.
  const trans = items.filter((x) => x.transparenteLatin).length;
  if (items.length >= 8 && trans / items.length > 0.5) v.push(`transparenteLatin: ${trans} de ${items.length} ítems se aciertan por la raíz común — por encima de la mitad el lote mide reconocimiento, no rumano`);
  // HUNSPELL sobre la frase entera, rellena: el segundo camino.
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió y esto no es verde');
  else {
    const malas = desconocidas(palabras.map((w) => w.replace(/^-|-$/g, '')).filter((w) => !/^[A-ZĂÂÎȘȚ]/.test(w) || w.length > 12));
    // Los nombres propios (București, Cluj, Brașov) no están en ro_RO: se
    // dejan fuera por mayúscula inicial, y se dice.
    for (const w of malas) v.push(`hunspell no reconoce «${w}» en el lote`);
  }
  return v;
}

if (process.argv[1]?.includes('cloze-ro-a1')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x, i) => ({ ...x, id: `clro1-${String(i + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Cloze derivado RO-A1 — ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | derivados | transparentes al latín |');
  console.log('|---|---:|---:|---:|');
  for (const [p, n] of porPunto) {
    const xs = ITEMS.filter((x) => x.p === p);
    console.log(`| \`${p}\` | ${n} | ${xs.filter((x) => !x.r).length} | ${xs.filter((x) => x.transparenteLatin).length} |`);
  }
  console.log(`\ntransparenteLatin: ${ITEMS.filter((x) => x.transparenteLatin).length} de ${ITEMS.length} (tope: la mitad).`);
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: un hueco y una pista por ítem, ancla en la frase, respuesta recalculada contra el paradigma,');
  console.log('ortografía DOOM3, frase entera por Hunspell, ninguna respuesta domina, latín común bajo la mitad.');
}

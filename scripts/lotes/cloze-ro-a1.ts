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
import { articulado, presente, paradigmaNominal, diminutivo, PERSONAS, type Persona } from '../lib/paradigma-ro';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';

export interface ClozeRo {
  p: string;
  s: string;              // frase con ___ y el lema entre paréntesis
  pista: string;          // hintEs: determina, no deletrea
  ancla: string;          // trozo literal que excluye las alternativas
  /** derivada: sustantivo, por la casilla del paradigma nominal (por
   *  defecto el artículo singular; el lote 4 usa plural, artículo plural y
   *  genitivo-dativo definido singular). */
  lema?: string;
  casilla?: 'N pl' | 'N pl art' | 'GD sg indef' | 'GD sg def' | 'GD pl def' | 'DIM sg';
  /** derivada: verbo + persona */
  inf?: string; per?: Persona;
  /** declarada, donde el paradigma no llega */
  r?: string;
  alt?: string[];
  /** ¿La CADENA que escribiría un hispanohablante sin morfología rumana
   *  coincide con la respuesta? Si no coincide, es `false` aunque la raíz
   *  se reconozca: «tren» se reconoce y «trenul» no se produce; «lucra» se
   *  reconoce y produce *lucr. El lingüista cazó 7 `true` que contestaban
   *  «¿se reconoce la raíz?» — otra pregunta — y dejaban el lote rozando el
   *  tope sin motivo. Declarado, y con este criterio. */
  transparenteLatin: boolean;
}

export const ITEMS: ClozeRo[] = [
  // ── r2-articulo-enclitico-sg · 8 ─────────────────────────────────
  // El contexto exige el DEFINIDO y, sobre todo, el SINGULAR: el testigo
  // de número no puede ser un verbo de la 1.ª conjugación en presente,
  // donde 3.ª sg = 3.ª pl (CLRO-003 v0: «Trenul/Trenurile de București
  // pleacă» — indeterminado; lo cazó el lingüista, y ahora un gate).
  // Las seis clases del artículo, sin repetir, y no todas en posición
  // inicial: el alumno no debe aprender «primera casilla ⇒ -ul».
  // v1 decía «Am văzut ___ (om) de la fereastră»: con OD humano DEFINIDO el
  // rumano exige «pe» + doblado (GALR II) y la respuesta ya no era «omul»
  // sino «pe omul». Error, no matiz — lo cazó el coordinador y lo dictaminó
  // el lingüista. Marco predicativo: «pe» no aplica nunca en el predicado.
  { p: 'r2-articulo-enclitico-sg', lema: 'om', s: 'Vecinul meu este ___ (om) de la fereastră.', pista: 'hombre — con artículo definido enclítico (masculino en consonante)', ancla: 'Vecinul meu este', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'tată', s: '___ (tată) meu lucrează la spital.', pista: 'padre — con artículo definido enclítico (masculino en -ă)', ancla: 'meu lucrează', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'tren', s: '___ (tren) de București este deja în gară.', pista: 'tren — con artículo definido enclítico (neutro en consonante)', ancla: 'este deja în gară', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'carte', s: '___ (carte) aceasta este foarte interesantă.', pista: 'libro — con artículo definido enclítico (femenino en -e)', ancla: 'aceasta', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'frate', s: '___ (frate) meu locuiește la Cluj.', pista: 'hermano — con artículo definido enclítico (masculino en -e)', ancla: 'meu locuiește', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'metrou', s: '___ (metrou) din București este foarte aglomerat seara.', pista: 'metro — con artículo definido enclítico (neutro en -u)', ancla: 'este foarte aglomerat', transparenteLatin: false },
  { p: 'r2-articulo-enclitico-sg', lema: 'zi', s: '___ (zi) de naștere a fratelui meu este mâine.', pista: 'día — con artículo definido enclítico (femenino en -i)', ancla: 'de naștere a fratelui meu este', transparenteLatin: false },
  // «ușă» es opaca (sin cognado): la nota va aquí, no en la pista.
  { p: 'r2-articulo-enclitico-sg', lema: 'ușă', s: '___ (ușă) de la intrare este deschisă.', pista: 'puerta — con artículo definido enclítico (femenino en -ă)', ancla: 'de la intrare este deschisă', transparenteLatin: false },

  // ── r3-presente-4-conjugaciones · 8 ──────────────────────────────
  // Las casillas que DIVERGEN (motivo del inventario): 3.ª pl = 3.ª sg en
  // -a; 1.ª sg = 3.ª pl en -e/-i; y la 2.ª sg con palatalización. El
  // pronombre explícito sólo donde el contexto lo licencia (contraste):
  // el rumano es pro-drop y nueve «Tu …» seguidos son prosa de manual.
  { p: 'r3-presente-4-conjugaciones', inf: 'a cânta', per: 'ei', s: 'Copiii ___ (a cânta) în fiecare dimineață la școală.', pista: 'presente, 3.ª del plural — conjugación en -a', ancla: 'Copiii', transparenteLatin: true },
  { p: 'r3-presente-4-conjugaciones', inf: 'a merge', per: 'ei', s: 'Ei ___ (a merge) la piață sâmbăta.', pista: 'presente, 3.ª del plural — conjugación en -e', ancla: 'Ei', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a dormi', per: 'ei', s: 'Bunicii ___ (a dormi) după masă.', pista: 'presente, 3.ª del plural — conjugación en -i', ancla: 'Bunicii', transparenteLatin: true },
  { p: 'r3-presente-4-conjugaciones', inf: 'a vedea', per: 'tu', s: 'Tu ___ (a vedea) marea de la balcon?', pista: 'presente, 2.ª del singular — conjugación en -ea, con cambio de consonante', ancla: 'Tu', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a pleca', per: 'tu', s: 'Eu rămân, tu ___ (a pleca) mâine la Brașov?', pista: 'presente, 2.ª del singular — conjugación en -a', ancla: 'Eu rămân, tu', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a ști', per: 'noi', s: 'Noi ___ (a ști) unde este gara, ei nu.', pista: 'presente, 1.ª del plural — conjugación en -i, tema en vocal', ancla: 'Noi', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a coborî', per: 'voi', s: 'Voi ce faceți, ___ (a coborî) la stația următoare?', pista: 'presente, 2.ª del plural — conjugación en -î', ancla: 'Voi ce faceți', transparenteLatin: false },
  { p: 'r3-presente-4-conjugaciones', inf: 'a mânca', per: 'noi', s: 'Noi ___ (a mânca) la restaurant, voi acasă.', pista: 'presente, 1.ª del plural — conjugación en -a, desde el tema del infinitivo', ancla: 'Noi', transparenteLatin: false },

  // ── r3-sufijo-ez-esc · 8 ─────────────────────────────────────────
  // Donde la raíz se reconoce, el instinto produce *lucr, *cit: el ítem
  // pide la forma con el sufijo. La mitad -ez con DOS lemas distintos
  // (lucra, vizita), o el ítem mide memoria de «lucrez» y no la clase.
  { p: 'r3-sufijo-ez-esc', inf: 'a lucra', per: 'eu', s: 'Eu ___ (a lucra) la o bancă din centru.', pista: 'presente, 1.ª del singular — verbo con sufijo -ez', ancla: 'Eu', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a vizita', per: 'el', s: 'Ea ___ (a vizita) muzeul cu copiii.', pista: 'presente, 3.ª del singular — verbo con sufijo -ez', ancla: 'Ea', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a citi', per: 'eu', s: 'Eu ___ (a citi) o carte în fiecare lună.', pista: 'presente, 1.ª del singular — verbo con sufijo -esc', ancla: 'Eu', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a citi', per: 'tu', s: 'Tu ___ (a citi) ziarul dimineața?', pista: 'presente, 2.ª del singular — verbo con sufijo -esc, palatalizado', ancla: 'Tu', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a vorbi', per: 'el', s: 'Profesorul ___ (a vorbi) rar și clar.', pista: 'presente, 3.ª del singular — verbo con sufijo -esc', ancla: 'Profesorul', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a locui', per: 'ei', s: 'Părinții mei ___ (a locui) la țară.', pista: 'presente, 3.ª del plural — verbo con sufijo -esc', ancla: 'Părinții mei', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a plăti', per: 'eu', s: 'Eu ___ (a plăti) chiria pe data de întâi.', pista: 'presente, 1.ª del singular — verbo con sufijo -esc', ancla: 'Eu', transparenteLatin: false },
  { p: 'r3-sufijo-ez-esc', inf: 'a găti', per: 'el', s: 'Mama ___ (a găti) ciorbă duminica.', pista: 'presente, 3.ª del singular — verbo con sufijo -esc', ancla: 'Mama', transparenteLatin: false },
];

const NOM = new Map(SUSTANTIVOS_A1.map((l) => [l.lema, l]));
const VERB = new Map(VERBOS_A1.map((v) => [v.inf, v]));

export function respuestaDe(x: ClozeRo): string | null {
  if (x.r) return x.r;
  if (x.lema) {
    const l = NOM.get(x.lema);
    if (!l) return null;
    // El diminutivo NO está en `paradigmaNominal`: no es una casilla que se
    // derive, es una forma guardada con su fuente. Va por su propia puerta.
    if (x.casilla === 'DIM sg') return diminutivo(l);
    return x.casilla ? paradigmaNominal(l)[x.casilla] ?? null : articulado(l, 'sg');
  }
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
    if (x.p === 'r3-sufijo-ez-esc' && !/(ez|ezi|ează|esc|ești|ește)$/.test(r)) { /* ya avisado */ }
    // SINCRETISMO: en un ítem de artículo SINGULAR el único testigo de número
    // no puede ser un verbo de 1.ª conjugación en presente (pleacă, există:
    // 3.ª sg = 3.ª pl). Hace falta un testigo singular explícito.
    if (x.p === 'r2-articulo-enclitico-sg' && x.lema && !x.casilla) {
      const resto = x.s.replace('___', '').replace(/\([^)]*\)/g, '');
      const testigo = /(?<![\p{L}])(este|e|era|a fost|meu|mea|nostru|noastră|tău|ta|acesta|aceasta|acest|această|acela|aceea)(?![\p{L}])/iu.test(resto);
      if (!testigo) v.push(`${id}: sin testigo singular explícito — con «pleacă»/«există» la frase admite el plural (trenurile) y el ítem no está determinado`);
    }
    // INVARIANTE (lingüista, 2026-09-01): en el punto del artículo el hueco
    // NUNCA va en posición de objeto directo, porque con humano definido el
    // OD exige «pe» + doblado y eso es otro punto (r6). Se detecta un verbo
    // finito o un perfect compus DELANTE del hueco que no sea la cópula.
    if (x.p === 'r2-articulo-enclitico-sg' && x.lema && !x.casilla) {
      const antes = x.s.split('___')[0] ?? '';
      const formas = new Set(VERBOS_A1.flatMap((v) => PERSONAS.map((q) => presente(v, q)).filter(Boolean) as string[]));
      const toks = antes.toLowerCase().replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean);
      const verboAntes = toks.find((t) => (formas.has(t) && !/^(este|e|sunt|era)$/.test(t)) || /^(am|ai|a|ați|au)$/.test(t) && toks.includes('văzut'));
      if (verboAntes || /\b(am|ai|a|ați|au) \p{L}+t ___/u.test(x.s)) v.push(`${id}: el hueco de artículo está en posición de objeto directo («${verboAntes ?? 'perfect compus'}» delante) — con humano definido pide «pe» + doblado, que es otro punto`);
    }
    // Un ítem de artículo cuya respuesta es igual al lema no examina nada.
    if (x.p === 'r2-articulo-enclitico-sg' && x.lema && !x.casilla && r === x.lema) v.push(`${id}: la forma articulada coincide con el lema`);
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
  // La mitad -ez del punto del sufijo con al menos DOS lemas distintos.
  const ez = new Set(items.filter((x) => x.p === 'r3-sufijo-ez-esc' && /ez|ează/.test(respuestaDe(x) ?? '')).map((x) => x.inf));
  if (items.some((x) => x.p === 'r3-sufijo-ez-esc') && ez.size < 2) v.push(`r3-sufijo-ez-esc: la mitad -ez descansa en ${ez.size} lema(s) — con uno solo el ítem mide memoria de «lucrez», no la clase`);
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

// scripts/lectura/glosas-a-revisar.ts
//
// PONE CADA GLOSA AL LADO DE LA DEFINICIÓN DE LA FUENTE.
//
//   npx tsx scripts/lectura/glosas-a-revisar.ts
//
// ── POR QUÉ EXISTE ───────────────────────────────────────────────────
//
// `campos-inertes.ts` encontró que la GLOSA es el campo más inerte del
// lexicón: 141 campos, inertes al 100 % en las cuatro tablas, y es lo que el
// alumno lee. Los tres gates que la tocan miran su FORMA, ninguno su
// CONTENIDO. Yo di por hecho que no había tercer camino dentro del
// repositorio, y me equivoqué: **la misma página de la que sale la cantidad
// trae la definición**. Mismo fetch, misma caché.
//
// Cobertura medida: **117 de 141 (83,0 %)**, casi la misma que la de las
// cantidades. Las otras 24 salen `no verificable`, que NO es `mal`.
//
// ── LO QUE SE PROBÓ Y NO FUNCIONA, que hay que dejar escrito ─────────
//
// El triaje automático por SOLAPAMIENTO LÉXICO —marcar las glosas que no
// comparten ninguna raíz con la definición— **no sirve**. Medido:
//
//     solapan (nada que mirar) ......  14   12 %
//     no solapan (a revisar) ........ 103   88 %
//
// El español y el inglés no comparten raíz aunque la glosa sea perfecta:
// `niña`/«girl», `agua`/«water», `hija`/«daughter`. Marcar 103 de 117 es
// marcar ninguna, que es el gotcha de «un gate ruidoso es un gate apagado».
// Queda escrito para que nadie lo reintente creyendo que es barato.
//
// ── LO QUE SÍ SIRVE ──────────────────────────────────────────────────
//
// Poner las dos cosas juntas. El juicio lo da el lingüista adversarial —que
// es skill del proyecto— y esto le ahorra buscar 117 definiciones. El valor
// no está en automatizar el juicio: está en que el que juzga tenga la
// evidencia delante.
//
// Y hay una señal que el listado ordena arriba sin decidir nada: las glosas
// cuya definición NO comparte ninguna raíz Y es corta (un solo sentido),
// donde una divergencia real se ve de un vistazo. `nātiō` glosado «nación,
// pueblo» con la fuente diciendo «birth» sale el primero.
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { ADJETIVOS_3A } from '../../lib/data/languages/la/adjetivos-3a';
import REGISTRO from '../../lib/data/languages/la/macrones.json';

const sinM = (x: string) => x.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC')
  .toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');
const desacentuar = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase();
const VACIAS = new Set(['a', 'an', 'the', 'of', 'or', 'to', 'be', 'is', 'in', 'for', 'with', 'that',
  'and', 'it', 'one', 'often', 'used', 'as', 'esp', 'especially', 'etc', 'something', 'someone',
  'who', 'which', 'se', 'de', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'o', 'que', 'por', 'en', 'con', 'lo', 'su']);
export const raices = (s: string) => new Set(desacentuar(s).split(/[^a-z]+/)
  .filter((w) => w.length >= 3 && !VACIAS.has(w)).map((w) => w.slice(0, 4)));

export interface GlosaParaRevisar {
  lema: string; tabla: string; glosa: string;
  definicion: string | null;
  solapa: boolean;
  /** `true` cuando la fuente no trae definición. NO es «mal». */
  noVerificable: boolean;
}

export function glosasParaRevisar(): GlosaParaRevisar[] {
  const def = new Map((REGISTRO as { filas: { clave: string; definicion?: string }[] }).filas
    .filter((f) => f.definicion).map((f) => [f.clave, f.definicion!]));
  const todas = [
    ...NOMBRES_L1.map((n) => ({ lema: n.lema, glosa: n.glosa, tabla: 'NOMBRES_L1' })),
    ...VERBOS_L1.map((v) => ({ lema: v.lema, glosa: v.glosa, tabla: 'VERBOS_L1' })),
    ...ADJETIVOS_L1.map((a) => ({ lema: a.lema, glosa: a.glosa, tabla: 'ADJETIVOS_L1' })),
    ...ADJETIVOS_3A.map((a) => ({ lema: a.lema, glosa: a.glosa, tabla: 'ADJETIVOS_3A' })),
  ];
  return todas.map((t) => {
    const d = def.get(sinM(t.lema)) ?? null;
    const a = raices(t.glosa);
    const b = d ? raices(d) : new Set<string>();
    return { ...t, definicion: d, solapa: d !== null && [...a].some((r) => b.has(r)), noVerificable: d === null };
  });
}

async function main() {
  const todas = glosasParaRevisar();
  const conDef = todas.filter((g) => !g.noVerificable);
  const solapan = conDef.filter((g) => g.solapa);
  console.log(`glosas del lexicón: ${todas.length}`);
  console.log(`  con definición en la fuente: ${conDef.length}  (${((100 * conDef.length) / todas.length).toFixed(1)} %)`);
  console.log(`  NO VERIFICABLES (la fuente calla): ${todas.length - conDef.length}`);
  console.log(`\n  el triaje por solapamiento marca ${conDef.length - solapan.length} de ${conDef.length} (${Math.round((100 * (conDef.length - solapan.length)) / conDef.length)} %): NO SIRVE como filtro.`);
  console.log('  se lista todo, ordenado por lo que más se ve de un vistazo.\n');
  // Arriba las de definición corta y sin solapamiento: ahí una divergencia
  // real se ve sin saber latín.
  const orden = [...conDef].sort((a, b) =>
    (Number(a.solapa) - Number(b.solapa)) || ((a.definicion ?? '').length - (b.definicion ?? '').length));
  for (const g of orden.slice(0, 30))
    console.log(`  ${g.lema.padEnd(13)} «${g.glosa}»`.padEnd(42) + `→ ${g.definicion}`);
  console.log(`\n  … y ${orden.length - 30} más. El juicio lo da el lingüista: esto sólo le pone la evidencia delante.`);
  const sinDef = todas.filter((g) => g.noVerificable);
  console.log(`\n  NO VERIFICABLES (${sinDef.length}): ${sinDef.map((g) => g.lema).join(' ')}`);
}
if (process.argv[1]?.endsWith('glosas-a-revisar.ts')) void main();

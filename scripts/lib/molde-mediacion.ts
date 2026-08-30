// scripts/lib/molde-mediacion.ts
//
// El TERCER eje del gate de virginidad: el MOLDE de las mediaciones.
//
// Los dos ejes que ya existían miran lo que una mediación clonada
// cambia (las palabras) y lo que todas comparten (el concept), así que
// entre los dos dejaban un agujero exacto del tamaño de una plantilla:
// en E2#6, doce mediaciones de un lote dieron **0 pares** y dos de
// ellas eran clones. Este eje mira lo que el clon CONSERVA:
//
//   1. el esqueleto del sourceText con los huecos variables tapados
//      (números, horas, precios, fechas, nombres propios) — porque una
//      plantilla es justamente eso: el mismo texto con otro relleno;
//   2. la firma de la rúbrica, casilla a casilla, sin sus valores;
//   3. la tupla de clase (tipo × dirección × registro × address ×
//      wordRange), que un clon copia entera sin darse cuenta;
//   4. la audiencia;
//   5. la FUENTE: dos mediaciones que citan la misma lectura son un
//      hallazgo por sí mismas, con o sin score — es la clase 133 ⊂ 132.
//
// Diseñado contra clones REALES (ver tests/unit/molde-mediacion.test.ts),
// y calibrado para NO marcar la línea B industrial, que tiene molde por
// diseño: dos avisos de la misma plantilla con género y datos distintos
// deben pasar limpios o el gate no sirve para producir a escala.

export interface MedData {
  mediationType: string;
  sourceLang: string;
  targetLang: string;
  audience: string;
  wordRange: { min: number; max: number };
  rubric: string[];
  sourceText: string;
  sourceRef?: string;
  modelAnswer?: string;
}
export interface MedIndexable {
  id: string;
  register?: string;
  address?: string;
  tags?: string[];
  data: MedData;
}

/** Umbral del CÓDIGO. Se audita a este número, no a uno elegido a ojo
 *  después de ver los resultados (cicatriz del lote 5). */
export const UMBRAL_MOLDE = 0.6;

const MESES = 'janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|enero|marzo|mayo|junio|julio|septiembre|octubre|noviembre|diciembre';
const DIAS = 'segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado|domingo|lunes|martes|miércoles|jueves|viernes|sábado|domingo';

/** Tapa los huecos variables de la plantilla. Dos avisos con el mismo
 *  esqueleto y distinto relleno tienen que colapsar al MISMO texto. */
export function enmascarar(texto: string): string {
  let t = ` ${texto} `;
  // Horas y franjas primero (llevan dígitos dentro).
  t = t.replace(/\b\d{1,2}\s*[:hH]\s*\d{0,2}\b/g, ' #HORA ');
  t = t.replace(/\b\d+\s*(?:€|euros?|reais?)\b/gi, ' #PRECIO ');
  t = t.replace(new RegExp(`\\b(?:${DIAS})\\b`, 'gi'), ' #DIA ');
  t = t.replace(new RegExp(`\\b(?:${MESES})\\b`, 'gi'), ' #MES ');
  t = t.replace(/\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wáéíóúâêôãõçñ-]{2,}\b/g, ' #NOME ');
  t = t.replace(/\b\d+\b/g, ' #NUM ');
  // Puntuación fuera: el molde no depende de las comas.
  t = t.replace(/[^\p{L}\p{N}#\s-]+/gu, ' ');
  return t.toLowerCase().replace(/\s+/g, ' ').trim();
}

const PARENTESIS = /\([^)]*\)|«[^»]*»|"[^"]*"|'[^']*'/g;

/** La rúbrica sin sus valores: lo que queda es el molde de la casilla.
 *  «¿Traslada los CUATRO datos: jueves→viernes 10h…?» y «¿Traslada los
 *  CUATRO datos: miércoles 11:30…?» tienen que dar lo mismo. */
export function firmaRubrica(rubric: string[]): string[] {
  return rubric
    .map((c) => {
      let s = c.replace(PARENTESIS, ' ');
      s = s.replace(/:[\s\S]*$/, ''); // todo lo que va tras los dos puntos es relleno
      s = enmascarar(s);
      return s.split(' ').filter((w) => w.length > 2).slice(0, 6).join(' ');
    })
    .filter(Boolean)
    .sort();
}

function tokens(t: string): string[] {
  return (t.match(/[\p{L}\p{N}#-]+/gu) ?? []).map((w) => w.toLowerCase()).filter((w) => w.length > 2);
}

function jaccard(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const A = new Set(a); const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Contención: |A∩B| / min(|A|,|B|). Es la métrica que separa de verdad
 *  —medido— cuando los dos textos tienen longitudes distintas, que es lo
 *  normal entre un aviso y su clon. En los fixtures reales: 0,278 para el
 *  clon 108v1↔64 y 0,000 para el no-clon 113↔64, donde el jaccard de
 *  trigramas se quedaba en 0,132 y no discriminaba. */
function contencion(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const A = new Set(a); const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / Math.min(A.size, B.size);
}

function ngramas(ts: string[], n = 3): string[] {
  const out: string[] = [];
  for (let i = 0; i + n <= ts.length; i++) out.push(ts.slice(i, i + n).join(' '));
  return out;
}

/** Refs de fuente compartidas (los synthesise unen refs con «+»). */
function refsDe(d: MedData): string[] {
  return (d.sourceRef ?? '').split('+').map((r) => r.trim()).filter(Boolean);
}

export interface ResultadoMolde {
  score: number;
  motivos: string[];
  esHallazgo: boolean;
  desglose: Record<string, number>;
}

export function similitudMolde(a: MedIndexable, b: MedIndexable): ResultadoMolde {
  const motivos: string[] = [];

  // 1 · Esqueleto del sourceText (trigramas sobre el texto enmascarado).
  const esqA = tokens(enmascarar(a.data.sourceText));
  const esqB = tokens(enmascarar(b.data.sourceText));
  const esqueleto = Math.max(
    jaccard(ngramas(esqA), ngramas(esqB)),
    contencion(ngramas(esqA), ngramas(esqB)),
    contencion(esqA, esqB) * 0.7,
  );
  if (esqueleto >= 0.25) motivos.push('esqueleto-compartido');

  // 2 · Firma de rúbrica.
  const fA = firmaRubrica(a.data.rubric); const fB = firmaRubrica(b.data.rubric);
  const rubrica = jaccard(fA, fB);
  if (rubrica >= 0.5) motivos.push('rubrica-calcada');

  // 3 · Tupla de clase.
  const mismoTipo = a.data.mediationType === b.data.mediationType;
  const mismaDir = a.data.sourceLang === b.data.sourceLang && a.data.targetLang === b.data.targetLang;
  const mismoReg = (a.register ?? '') === (b.register ?? '');
  const mismoAddr = (a.address ?? '') === (b.address ?? '');
  const mismoRango = a.data.wordRange.min === b.data.wordRange.min && a.data.wordRange.max === b.data.wordRange.max;
  const tupla = [mismoTipo, mismaDir, mismoReg, mismoAddr, mismoRango].filter(Boolean).length / 5;
  if (mismoTipo && mismaDir && mismoReg && mismoRango) motivos.push('tupla-de-clase-identica');

  // 4 · Audiencia.
  const audiencia = jaccard(tokens(a.data.audience), tokens(b.data.audience));
  if (audiencia >= 0.5) motivos.push('audiencia-calcada');

  // 5 · Fuente compartida: hallazgo por sí mismo.
  const refsA = refsDe(a.data); const refsB = refsDe(b.data);
  const fuenteCompartida = refsA.some((r) => refsB.includes(r));
  if (fuenteCompartida) motivos.push('fuente-compartida');

  const score = 0.30 * esqueleto + 0.35 * rubrica + 0.25 * tupla + 0.10 * audiencia;

  // La decisión es por REGLAS COMBINADAS, no por un número mágico: un
  // clon de plantilla puede tener el texto entero distinto (mismo molde,
  // otro asunto) o la rúbrica entera distinta (mismo texto, otra tarea),
  // y un único umbral sobre la media deja pasar los dos casos.
  const clonDeRubrica = rubrica >= 0.5 && tupla >= 0.8;   // 53v1 ↔ med-38
  const clonDeEsqueleto = esqueleto >= 0.25 && tupla >= 0.6; // 108v1 ↔ med-64
  if (clonDeRubrica) motivos.push('clon-de-rubrica');
  if (clonDeEsqueleto) motivos.push('clon-de-esqueleto');

  return {
    score: Number(score.toFixed(3)),
    motivos,
    esHallazgo: fuenteCompartida || clonDeRubrica || clonDeEsqueleto || score >= UMBRAL_MOLDE,
    desglose: {
      esqueleto: Number(esqueleto.toFixed(3)),
      rubrica: Number(rubrica.toFixed(3)),
      tupla: Number(tupla.toFixed(3)),
      audiencia: Number(audiencia.toFixed(3)),
    },
  };
}

export interface ParMolde {
  id: string;
  contra: string;
  score: number;
  motivos: string[];
  desglose: Record<string, number>;
}

/** Barrido: cada candidato contra el corpus de mediaciones. */
export function buscarClonesMolde(
  corpus: MedIndexable[],
  candidatos: MedIndexable[],
  umbral = UMBRAL_MOLDE,
): ParMolde[] {
  const out: ParMolde[] = [];
  for (const c of candidatos) {
    for (const x of corpus) {
      if (x.id === c.id) continue;
      const r = similitudMolde(c, x);
      if (r.esHallazgo && (r.score >= umbral || r.motivos.some((m) => m === 'fuente-compartida' || m === 'clon-de-rubrica' || m === 'clon-de-esqueleto'))) {
        out.push({ id: c.id, contra: x.id, score: r.score, motivos: r.motivos, desglose: r.desglose });
      }
    }
  }
  return out.sort((p, q) => q.score - p.score);
}

/** Extrae las mediaciones de un corpus heterogéneo. */
export function mediacionesDe(items: Array<{ id: string; type?: string; data?: unknown } & Record<string, unknown>>): MedIndexable[] {
  return items
    .filter((x) => x.type === 'mediation' && x.data)
    .map((x) => ({
      id: x.id,
      register: x.register as string | undefined,
      address: x.address as string | undefined,
      tags: (x.tags as string[]) ?? [],
      data: x.data as MedData,
    }))
    .filter((x) => Array.isArray(x.data.rubric) && typeof x.data.sourceText === 'string');
}

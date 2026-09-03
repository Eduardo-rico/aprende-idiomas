// lib/data/cefr.ts
//
// El eje MCER. Hasta hoy la app NO SABÍA en qué nivel estaba el alumno:
// lo único que decía «C2» era `components/home/XpBar.tsx:41`, que repartía
// los seis niveles a 500 XP por escalón — se llegaba a «C2» antes de
// terminar el Bloque 3. Eso no es una medida de competencia: es una barra
// de progreso con nombres prestados.
//
// TRES CAPAS, y la separación importa (plan §2.1):
//
//   Descriptor  — el libro mayor. Qué SABE HACER el alumno, en abstracto.
//   TaskSpec    — la tarea concreta que produce evidencia para un descriptor.
//                 Aquí viven los enunciados numéricos («transcribe 20 frases
//                 a 140 ppm con ≥80 % de aciertos»), que NO son descriptores.
//   Evidence    — el desempeño observado. Nunca autoinforme.
//
// Por qué el nivel NO vive en `Concept`: sería una propiedad del CONTENIDO,
// no del ALUMNO. Un ejercicio puede ser «de B1»; sólo una persona puede
// estar en B1, y sólo demostrándolo.
import { z } from 'zod';
import type { LanguageId } from '@/lib/locales';

// `pre_A1` no es decoración: ruso y checo tienen una fase de
// descodificación (alfabeto → sílaba → palabra) anterior a cualquier
// descriptor A1.
//
// ⚠ LÍMITE CONOCIDO (fase G, 2026-09-03): esta escala es la del MCER y
// vale para las CUATRO lenguas vivas. **No vale para el latín ni para el
// griego antiguo**, cuyos peldaños son `NIVELES_DE.la` (L1…L5) y
// `NIVELES_DE.grc` (G1…G5) en `scripts/paso0-idioma.ts` — el MCER
// describe lo que alguien puede HACER con una lengua viva, y no hay
// transacción cotidiana en latín (docs/plans/2026-09-03-la-grc-paso0.md
// §0).
//
// Hoy eso NO rompe nada, y por eso no se ha tocado: `Descriptor.language`
// y `Evidence.language` son `z.string()` abiertos, `anclarEjercicio`
// toma `lang = 'pt'`, y `la`/`grc` no tienen todavía ni un ejercicio del
// que sacar evidencia. **El día que lo tengan, `CefrLevel` hay que
// parametrizarlo por lengua igual que se hizo con `NIVELES`**, y no
// reutilizar «B1» como nombre opaco de peldaño: quien lo lea creerá que
// significa lo que significa en portugués.
export const CEFR_LEVELS = ['pre_A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

/** Las seis del Companion Volume 2020. La app tenía las dos primeras y
 *  cero de las cuatro restantes. */
export const SKILLS = [
  'comprension_lectora',
  'comprension_oral',
  'produccion_escrita',
  'produccion_oral',
  'interaccion',
  'mediacion',
] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABEL: Record<Skill, string> = {
  comprension_lectora: 'Comprensión lectora',
  comprension_oral: 'Comprensión oral',
  produccion_escrita: 'Producción escrita',
  produccion_oral: 'Producción oral',
  interaccion: 'Interacción',
  mediacion: 'Mediación',
};

/** Hasta dónde puede llegar este descriptor DENTRO de la app.
 *  Es la pieza que impide prometer lo que no se puede evidenciar: sin
 *  ella, el producto declara niveles que sólo un evaluador humano puede
 *  certificar. Se pinta en la interfaz, no se esconde. */
export const ATTAINABILITY = [
  'in_app',
  'app_prepares_external_certifies',
  'requires_human_hours',
] as const;
export type Attainability = (typeof ATTAINABILITY)[number];

export const DescriptorSchema = z.object({
  id: z.string().min(1),
  cefr: z.enum(CEFR_LEVELS),
  skill: z.enum(SKILLS),
  /** El enunciado can-do, en español. */
  textEs: z.string().min(1),
  /** En la lengua meta, para autoevaluación. Opcional mientras se traduce. */
  textTarget: z.string().optional(),
  /** `cv2020` = verbatim del Companion Volume. `local` = escrito por nosotros.
   *  HOY TODOS SON `local`: los descriptores vienen de los currículos que se
   *  diseñaron el 2026-07-28, no del Companion Volume. Marcarlos `cv2020`
   *  para pasar un gate sería exactamente el tipo de mentira que este eje
   *  viene a eliminar. */
  source: z.enum(['cv2020', 'local']),
  sourceRef: z.string().optional(),
  /** Evidencias independientes que lo dan por demostrado. Dos como mínimo:
   *  una sola observación no distingue saber de acertar. */
  evidenceThreshold: z.number().int().min(1).default(2),
  attainability: z.enum(ATTAINABILITY).default('in_app'),
  /** Vacío = vale para todos los idiomas. */
  languages: z.array(z.string()).optional(),
});
export type Descriptor = z.infer<typeof DescriptorSchema>;

/** Modo físico que la tarea exige. Es lo que hace posible componer una
 *  sesión de 25 minutos: en el metro con ruido no se puede grabar la voz
 *  ni hacer un dictado, y ofrecer esa tarea ahí es perder al alumno. */
export const CONTEXT_MODES = ['anywhere', 'quiet', 'headphones', 'keyboard', 'mic'] as const;
export type ContextMode = (typeof CONTEXT_MODES)[number];

/** Capa 2: la tarea concreta que produce evidencia para un descriptor.
 *  Aquí viven los enunciados numéricos de los currículos —«transcribe 20
 *  frases a 140 ppm con ≥80 %»—, que NO son descriptores: un descriptor
 *  dice qué sabes hacer, una TaskSpec dice cómo se comprueba. */
export const TaskSpecSchema = z.object({
  id: z.string().min(1),
  descriptorIds: z.array(z.string()),
  language: z.string().min(1),
  cefr: z.enum(CEFR_LEVELS),
  statementEs: z.string().min(1),
  /** Destreza. `null` = la clasificación automática no se atrevió, y va a
   *  revisión humana. Un hueco visible es mejor que un número falso: una
   *  tarea mal clasificada desplaza el nivel entero de esa destreza. */
  skill: z.enum(SKILLS).nullable(),
  skillConfidence: z.enum(['alta', 'media', 'baja', 'sin_asignar']),
  contextModes: z.array(z.enum(CONTEXT_MODES)),
  minObservations: z.number().int().min(1).default(2),
  fallbackTaskSpecId: z.string().optional(),
});
export type TaskSpec = z.infer<typeof TaskSpecSchema>;

export const DescriptorFileSchema = z.object({
  language: z.string().min(1),
  generatedAt: z.string(),
  note: z.string().optional(),
  descriptors: z.array(DescriptorSchema),
  taskSpecs: z.array(TaskSpecSchema).default([]),
});
export type DescriptorFile = z.infer<typeof DescriptorFileSchema>;

// ─── Progreso ───────────────────────────────────────────────────────
export interface LevelProgress {
  cefr: CefrLevel;
  /** Descriptores con evidencia suficiente. */
  demostrados: number;
  total: number;
  pct: number;
  /** Por destreza, porque el nivel global es el MÍNIMO de las destrezas:
   *  alguien que lee de maravilla y no habla no está en ese nivel. */
  porDestreza: Partial<Record<Skill, { demostrados: number; total: number; pct: number }>>;
}

/** Cuenta evidencias por descriptor y decide cuáles están demostrados.
 *
 *  `evidencias` es un recuento simple id→nº de evidencias independientes.
 *  La regla de independencia (no vale repetir la misma tarea el mismo día)
 *  la aplica quien registra la evidencia, no esta función.
 */
export function levelProgress(
  descriptores: Descriptor[],
  evidencias: Record<string, number>,
): LevelProgress[] {
  const porNivel = new Map<CefrLevel, Descriptor[]>();
  for (const d of descriptores) {
    const arr = porNivel.get(d.cefr) ?? [];
    arr.push(d);
    porNivel.set(d.cefr, arr);
  }

  const demostrado = (d: Descriptor) => (evidencias[d.id] ?? 0) >= d.evidenceThreshold;

  return CEFR_LEVELS.filter((n) => porNivel.has(n)).map((cefr) => {
    const ds = porNivel.get(cefr)!;
    const demostrados = ds.filter(demostrado).length;
    const porDestreza: LevelProgress['porDestreza'] = {};
    for (const s of SKILLS) {
      const dsS = ds.filter((d) => d.skill === s);
      if (dsS.length === 0) continue;
      const dem = dsS.filter(demostrado).length;
      porDestreza[s] = { demostrados: dem, total: dsS.length, pct: Math.round((dem / dsS.length) * 100) };
    }
    return {
      cefr,
      demostrados,
      total: ds.length,
      pct: ds.length === 0 ? 0 : Math.round((demostrados / ds.length) * 100),
      porDestreza,
    };
  });
}

/** El nivel que el alumno puede declarar.
 *
 *  Es el último nivel COMPLETO, y «completo» se mide por la destreza más
 *  floja, no por la media. Alguien que lee como un B2 y no sostiene una
 *  conversación no está en B2 — el MCER define el nivel por lo que puedes
 *  hacer, y no puedes hacer la mitad.
 */
export function nivelAlcanzado(progreso: LevelProgress[], umbralPct = 80): CefrLevel | null {
  let alcanzado: CefrLevel | null = null;
  for (const n of CEFR_LEVELS) {
    const p = progreso.find((x) => x.cefr === n);
    if (!p || p.total === 0) continue;
    const destrezas = Object.values(p.porDestreza);
    const minimo = destrezas.length === 0 ? 0 : Math.min(...destrezas.map((d) => d.pct));
    if (minimo >= umbralPct) alcanzado = n;
    else break; // no se saltan niveles
  }
  return alcanzado;
}

/** Cuánto falta para el siguiente nivel, en descriptores. Es la respuesta
 *  a «¿cuánto me falta para B2?», que hoy la app no puede dar. */
export function faltanPara(progreso: LevelProgress[], objetivo: CefrLevel): number | null {
  const p = progreso.find((x) => x.cefr === objetivo);
  if (!p) return null;
  return Math.max(0, p.total - p.demostrados);
}

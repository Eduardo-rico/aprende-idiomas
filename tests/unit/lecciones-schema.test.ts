// tests/unit/lecciones-schema.test.ts
//
// EL GATE QUE ESTABA DECLARADO Y AUSENTE. `LessonSchema` existe en
// `lib/data/zod-schemas.ts` con sus topes y su comentario de checklist, y **no
// lo corre nadie sobre las lecciones escritas a mano**: sólo lo usa
// `propose-lessons.ts`, que es el generador por LLM. Las lecciones del
// repositorio entran por `import … from './lessons/bN.json'` con un `as
// Lesson[]`, o sea sin validar nada. Un schema que promete topes y no los
// comprueba es el gate declarado y ausente: la definición promete una
// cobertura que nadie da.
//
// Lo que este fichero hace, y las dos mitades importan:
//
//   1. **RU pasa entero.** La lengua que se está escribiendo ahora no añade
//      deuda.
//   2. **La deuda vieja se CUENTA, no se tiñe de verde.** PT y RO ya
//      incumplen los topes en cuatro sitios, y el número exacto está aquí
//      escrito: así una violación NUEVA sale en rojo sin tener que arreglar
//      antes contenido de otra lengua que no es de esta sesión. Un invariante
//      que sólo mira lo nuevo deja lo viejo invisible para siempre.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LessonListSchema } from '@/lib/data/zod-schemas';
import { BLOQUES_RU } from '@/lib/data/languages/ru/inventario-puntos';
import { BLOQUES_RO } from '@/lib/data/languages/ro/inventario-puntos';

const LANGS = ['pt', 'ro', 'la', 'ru', 'cs'] as const;

/** Sólo los ficheros con forma `bN.json`: `pt/lessons/audio-refs.json` existe y
 *  no es una lista de lecciones. Un gate que lo mirara marcaría un falso a la
 *  primera corrida, y un gate ruidoso es un gate apagado. */
const listasDeLecciones = (lang: string) => {
  const d = path.join('lib/data/languages', lang, 'lessons');
  if (!fs.existsSync(d)) return [] as { fichero: string; json: unknown }[];
  return fs.readdirSync(d).filter((f) => /^b\d+\.json$/.test(f))
    .map((f) => ({ fichero: `${lang}/${f}`, json: JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) }));
};

describe('LessonSchema sobre las lecciones ESCRITAS A MANO', () => {
  it('el ruso pasa entero, fichero por fichero', () => {
    const listas = listasDeLecciones('ru');
    expect(listas.length).toBeGreaterThan(0);   // si no, el test no mira nada
    for (const { fichero, json } of listas) {
      const r = LessonListSchema.safeParse(json);
      expect(r.success, `${fichero}: ${r.success ? '' : JSON.stringify(r.error?.issues)}`).toBe(true);
    }
  });

  // LA DEUDA VIEJA, CONTADA. Medido el 2026-09-12: cinco incumplimientos en
  // cuatro ficheros, todos de TOPE y ninguno de forma —`pt/b11` dos vocabKey,
  // `pt/b12` un conceptIds, `ro/b2` y `ro/b3` un vocabKey cada uno—. No se
  // arreglan aquí porque tocar el contenido de otra lengua no es de esta
  // sesión; se cuentan para que el quinto no pase inadvertido.
  it('la deuda de PT y RO es EXACTAMENTE la medida, y ni una más', () => {
    const fallos: string[] = [];
    for (const lang of LANGS) for (const { fichero, json } of listasDeLecciones(lang)) {
      const r = LessonListSchema.safeParse(json);
      if (!r.success) for (const i of r.error.issues) fallos.push(`${fichero} · ${i.path.join('.')}`);
    }
    expect(fallos.sort()).toEqual([
      'pt/b11.json · 4.vocabKey',
      'pt/b11.json · 7.vocabKey',
      'pt/b12.json · 0.conceptIds',
      'ro/b2.json · 0.vocabKey',
      'ro/b3.json · 0.vocabKey',
    ]);
  });

  // ⚠ EL TOPE DE `blockId` ES UNA BOMBA DE RELOJ Y YA EXPLOTÓ DOS VECES: en
  // el C2 del portugués con el 11 (408 unidades inalcanzables) y en los
  // bloques 13-15 del ruso con el 12 (21 puntos). El antídoto no es acordarse
  // del checklist: es que el número lo compruebe un test contra los
  // inventarios, que es donde viven los bloques de verdad.
  it('el tope de blockId cubre el bloque más alto de TODOS los inventarios', () => {
    const maxRu = Math.max(...BLOQUES_RU.map((b) => b.id));
    const maxRo = Math.max(...BLOQUES_RO.map((b) => b.id));
    const maximo = Math.max(maxRu, maxRo);
    const leccionFalsa = {
      id: `b${maximo}-l1-prueba`, blockId: maximo, name: 'prueba', objectives: ['x'],
      conceptIds: ['x'], vocabKey: ['x'], conceptNotesPath: `b${maximo}/l1-prueba.mdx`, exerciseRefs: [],
    };
    const r = LessonListSchema.safeParse([leccionFalsa]);
    expect(r.success, `LessonSchema.blockId no llega al bloque ${maximo}: los puntos de ese bloque no pueden recibir un ítem`).toBe(true);
    // Y SU CONTROL NEGATIVO, porque un tope que aprueba todo también aprueba
    // el bloque 15 y su verde es idéntico: un bloque que no existe en ningún
    // inventario tiene que seguir rechazándose. Si alguien «arregla» este test
    // poniendo `max(999)`, esta línea lo caza.
    const inexistente = { ...leccionFalsa, id: `b${maximo + 1}-l1-prueba`, blockId: maximo + 1, conceptNotesPath: `b${maximo + 1}/l1-prueba.mdx` };
    expect(LessonListSchema.safeParse([inexistente]).success).toBe(false);
  });
});

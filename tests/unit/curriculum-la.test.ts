// tests/unit/curriculum-la.test.ts — EL CURRÍCULO DEL LATÍN.
//
// Hasta el 2026-09-10 `BLOCKS` era `[]` y ÉSE era el bloqueo del latín:
// 454 ítems escritos y cero publicados, porque no había dónde ponerlos.
// El currículo se DERIVA del inventario —que es lo que el latinista
// adversarial atacó— y lo único escrito a mano es el tallado en lecciones
// y los `objectives`. Estos tests protegen las dos costuras: que la
// derivación no se rompa, y que la prosa generada no se desincronice.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS, TALLAS, SIN_TALLAR, getBlock, getLesson } from '@/lib/data/languages/la/curriculum';
import { PUNTOS_LA, BLOQUES_LA } from '@/lib/data/languages/la/inventario-puntos';
import { mdxDe } from '@/scripts/generate-mdx-la';

const LECCIONES = BLOCKS.flatMap((b) => b.lessons);

describe('currículo del latín · derivado del inventario', () => {
  it('los conceptos SON los puntos del inventario, 1:1 y sin reescribir', () => {
    expect(ALL_CONCEPTS).toHaveLength(PUNTOS_LA.length);
    for (const p of PUNTOS_LA) {
      const c = ALL_CONCEPTS.find((x) => x.id === p.id);
      expect(c, p.id).toBeTruthy();
      // Si alguien «mejora» una descripción aquí en vez de en el
      // inventario, el alumno y el inventario dejan de decir lo mismo.
      expect(c!.description, p.id).toBe(p.descripcion);
      expect(c!.name, p.id).toBe(p.nombre);
      expect(c!.blockId, p.id).toBe(p.bloque);
    }
  });

  it('cada punto declarado en una lección existe, y ninguno está en dos', () => {
    const ids = new Set(PUNTOS_LA.map((p) => p.id));
    const vistos = new Set<string>();
    for (const t of TALLAS) for (const c of t.conceptIds) {
      expect(ids.has(c), `${t.id} declara «${c}», que no está en el inventario`).toBe(true);
      expect(vistos.has(c), `«${c}» está en dos lecciones`).toBe(false);
      vistos.add(c);
    }
  });

  it('el punto de una lección vive en el bloque de esa lección', () => {
    for (const t of TALLAS) for (const c of t.conceptIds) {
      const p = PUNTOS_LA.find((x) => x.id === c)!;
      expect(p.bloque, `${c} es del bloque ${p.bloque} y está en la lección ${t.id} (bloque ${t.blockId})`).toBe(t.blockId);
    }
  });

  // El orden importa: una lección no puede presuponer un punto que el
  // alumno no ha visto. Los prereqs de fuera del currículo publicado se
  // toleran —el inventario tiene 117 puntos y sólo hay lote para 35— pero
  // los de DENTRO tienen que venir antes.
  it('ninguna lección presupone un punto publicado que venga después', () => {
    const orden = new Map<string, number>();
    LECCIONES.forEach((l, i) => { for (const c of l.conceptIds) orden.set(c, i); });
    const fallos: string[] = [];
    for (const [c, i] of orden) {
      const p = PUNTOS_LA.find((x) => x.id === c)!;
      for (const pre of p.prereqs) {
        const j = orden.get(pre);
        if (j !== undefined && j > i) fallos.push(`«${c}» (lección ${i}) necesita «${pre}», que va en la ${j}`);
      }
    }
    expect(fallos).toEqual([]);
  });

  it('sólo se declaran bloques CON lecciones, y cada lección tiene puntos y objetivos', () => {
    for (const b of BLOCKS) {
      expect(b.lessons.length, `bloque ${b.id} sin lecciones`).toBeGreaterThan(0);
      expect(BLOQUES_LA.some((x) => x.id === b.id), `bloque ${b.id} no está en el inventario`).toBe(true);
      for (const l of b.lessons) {
        expect(l.conceptIds.length, `${l.id} sin puntos`).toBeGreaterThan(0);
        expect(l.objectives.length, `${l.id} sin objetivos`).toBeGreaterThan(0);
        for (const o of l.objectives) expect(o.length, `${l.id}: objetivo demasiado corto`).toBeGreaterThan(30);
      }
    }
  });

  it('getBlock y getLesson ya no lanzan para lo publicado, y siguen lanzando para lo que no existe', () => {
    expect(getBlock(BLOCKS[0]!.id).id).toBe(BLOCKS[0]!.id);
    expect(getLesson(LECCIONES[0]!.id).id).toBe(LECCIONES[0]!.id);
    // Esto decía `getBlock(1)` —«b1 no tiene lote todavía»— y caducó el
    // 2026-09-23 PORQUE EL TRABAJO SE HIZO: b1 recibió su lote. Un control
    // anclado a una carencia transitoria muere cuando la carencia se cura
    // (§B8 de la doctrina). Lo que NO caduca es su propósito: que un
    // bloque sin lecciones lance en vez de devolver algo vacío. Así que se
    // pregunta a los bloques REALES que siguen sin lección —mientras
    // quede alguno— y a uno imposible por construcción, que no caduca nunca.
    const conLeccion = new Set(BLOCKS.map((b) => b.id));
    for (const b of BLOQUES_LA.filter((x) => !conLeccion.has(x.id))) {
      expect(() => getBlock(b.id), `b${b.id} no tiene lecciones y aun así no lanza`).toThrow();
    }
    expect(() => getBlock(Math.max(...BLOQUES_LA.map((x) => x.id)) + 1)).toThrow();
    expect(() => getLesson('la-no-existe')).toThrow();
  });
});

describe('las notas de lección están GENERADAS y no se han desincronizado', () => {
  // Es el fallo que el portugués tuvo meses sin que nadie lo viera:
  // `concepts.json` congelado en 50 de 241 conceptos porque su generador
  // no se volvió a correr. Aquí la prosa que lee el alumno ES la del
  // inventario, y esto lo comprueba.
  it('cada MDX existe y coincide EXACTAMENTE con lo que el generador produce hoy', () => {
    const raiz = path.join(process.cwd(), 'lib/data/languages/la/mdx');
    const drift: string[] = [];
    for (const t of TALLAS) {
      const f = path.join(raiz, t.mdx);
      if (!fs.existsSync(f)) { drift.push(`${t.mdx}: no existe`); continue; }
      if (fs.readFileSync(f, 'utf8') !== mdxDe(t)) drift.push(`${t.mdx}: desincronizado del inventario`);
    }
    expect(drift).toEqual([]);
  });

  it('cada regla del MDX es la descripción literal de su punto', () => {
    for (const t of TALLAS) {
      const texto = fs.readFileSync(path.join(process.cwd(), 'lib/data/languages/la/mdx', t.mdx), 'utf8');
      for (const c of t.conceptIds) {
        const p = PUNTOS_LA.find((x) => x.id === c)!;
        // Se compara un trozo largo y sin caracteres que el MDX escape.
        const trozo = p.descripcion.replace(/[<{}]/gu, ' ').slice(0, 60).trim();
        expect(texto.includes(trozo), `${t.mdx} no contiene la descripción de «${c}»`).toBe(true);
      }
    }
  });
});

describe('nada se promete sin que algo lo mida', () => {
  // ES LA REGLA DE ESTE FICHERO APLICADA A LA LECCIÓN Y NO SÓLO AL BLOQUE.
  // El latinista adversarial la encontró rota el 2026-09-10: seis
  // objetivos prometían destrezas cuyo lote estaba aplazado, y `la-b5-l1`
  // tenía DOS de sus tres objetivos sin un solo ejercicio. Es `b8-l1` del
  // rumano, que promete discurso indirecto con el punto BLOQUEADO.
  it('ningún punto aplazado está declarado en una lección', () => {
    const declarados = new Set(TALLAS.flatMap((t) => t.conceptIds));
    const colados = Object.keys(SIN_TALLAR).filter((p) => declarados.has(p));
    expect(colados, 'puntos aplazados que una lección sigue prometiendo').toEqual([]);
  });

  it('cada punto declarado en una lección tiene AL MENOS UN ejercicio publicado', () => {
    const dir = path.join(process.cwd(), 'lib/data/languages/la/blocks');
    const conEjercicio = new Set<string>();
    for (const f of fs.readdirSync(dir).filter((x) => /^b\d+\.json$/.test(x)))
      for (const ex of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as { concepts: string[] }[])
        for (const c of ex.concepts) conEjercicio.add(c);
    const vacios = TALLAS.flatMap((t) => t.conceptIds).filter((c) => !conEjercicio.has(c));
    expect(vacios, 'puntos declarados en una lección y sin ningún ejercicio').toEqual([]);
  });

  it('cada lección publicada tiene al menos un ejercicio', () => {
    const dir = path.join(process.cwd(), 'lib/data/languages/la/blocks');
    const porLeccion = new Map<string, number>();
    for (const f of fs.readdirSync(dir).filter((x) => /^b\d+\.json$/.test(x)))
      for (const ex of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as { lessonId: string }[])
        porLeccion.set(ex.lessonId, (porLeccion.get(ex.lessonId) ?? 0) + 1);
    const vacias = TALLAS.filter((t) => !porLeccion.get(t.id)).map((t) => t.id);
    expect(vacias).toEqual([]);
  });

  it('todo punto aplazado lleva su motivo escrito, y ninguno vacío', () => {
    for (const [p, m] of Object.entries(SIN_TALLAR)) {
      expect(ALL_CONCEPTS.some((c) => c.id === p), `${p} no existe en el inventario`).toBe(true);
      expect(m.trim().length, `${p} aplazado sin motivo`).toBeGreaterThan(40);
    }
  });
});

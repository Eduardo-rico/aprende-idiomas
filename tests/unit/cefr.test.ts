// tests/unit/cefr.test.ts
//
// El eje MCER. Lo que sustituye a `XpBar.tsx:41`, que repartía los seis
// niveles a 500 XP por escalón y declaraba «C2» antes del Bloque 3.
//
// La regla que estos tests protegen: **el nivel es el mínimo de las
// destrezas, no la media**. Alguien que lee como un B2 y no sostiene una
// conversación NO está en B2 — el MCER define el nivel por lo que puedes
// hacer, y no puedes hacer la mitad.
import { describe, it, expect } from 'vitest';
import {
  levelProgress,
  nivelAlcanzado,
  faltanPara,
  DescriptorFileSchema,
  type Descriptor,
} from '@/lib/data/cefr';
import ptCefr from '@/lib/data/languages/pt/cefr.json';

const d = (
  id: string,
  cefr: Descriptor['cefr'],
  skill: Descriptor['skill'],
  evidenceThreshold = 2,
): Descriptor => ({
  id,
  cefr,
  skill,
  textEs: `can-do ${id}`,
  source: 'local',
  evidenceThreshold,
  attainability: 'in_app',
});

describe('levelProgress', () => {
  it('cuenta demostrado sólo con evidencias suficientes', () => {
    const ds = [d('a', 'A1', 'comprension_lectora'), d('b', 'A1', 'comprension_oral')];
    const p = levelProgress(ds, { a: 2, b: 1 })[0]!;
    expect(p.demostrados).toBe(1);
    expect(p.total).toBe(2);
    expect(p.pct).toBe(50);
  });

  it('una sola evidencia no basta: saber no es acertar una vez', () => {
    const ds = [d('a', 'A1', 'comprension_lectora', 2)];
    expect(levelProgress(ds, { a: 1 })[0]!.demostrados).toBe(0);
    expect(levelProgress(ds, { a: 2 })[0]!.demostrados).toBe(1);
  });

  it('desglosa por destreza y omite las que no tienen descriptores', () => {
    const ds = [d('a', 'A1', 'comprension_lectora'), d('b', 'A1', 'mediacion')];
    const p = levelProgress(ds, { a: 2 })[0]!;
    expect(p.porDestreza.comprension_lectora).toEqual({ demostrados: 1, total: 1, pct: 100 });
    expect(p.porDestreza.mediacion).toEqual({ demostrados: 0, total: 1, pct: 0 });
    expect(p.porDestreza.produccion_oral).toBeUndefined();
  });

  it('sin evidencias, todo a cero — y eso es la verdad, no un fallo', () => {
    const ds = [d('a', 'A1', 'comprension_lectora'), d('b', 'B1', 'mediacion')];
    const p = levelProgress(ds, {});
    expect(p.every((x) => x.demostrados === 0)).toBe(true);
  });
});

describe('nivelAlcanzado — el mínimo manda', () => {
  it('no declara el nivel si una destreza va floja', () => {
    // Lee perfecto, no habla nada. No es A1.
    const ds = [
      d('r1', 'A1', 'comprension_lectora'), d('r2', 'A1', 'comprension_lectora'),
      d('o1', 'A1', 'produccion_oral'), d('o2', 'A1', 'produccion_oral'),
    ];
    const p = levelProgress(ds, { r1: 2, r2: 2 });
    expect(p[0]!.pct).toBe(50); // la media diría "medio A1"
    expect(nivelAlcanzado(p)).toBeNull(); // el mínimo dice que no
  });

  it('declara el nivel cuando TODAS las destrezas pasan el umbral', () => {
    const ds = [d('r', 'A1', 'comprension_lectora'), d('o', 'A1', 'produccion_oral')];
    expect(nivelAlcanzado(levelProgress(ds, { r: 2, o: 2 }))).toBe('A1');
  });

  it('no salta niveles: sin A1 no hay A2 aunque A2 esté completo', () => {
    const ds = [
      d('a1', 'A1', 'comprension_lectora'),
      d('a2', 'A2', 'comprension_lectora'),
    ];
    // A2 al 100 %, A1 a cero.
    const p = levelProgress(ds, { a2: 2 });
    expect(nivelAlcanzado(p)).toBeNull();
  });
});

describe('faltanPara — la pregunta que la app no sabía responder', () => {
  it('dice cuántos descriptores faltan para el nivel objetivo', () => {
    const ds = [
      d('x', 'B2', 'comprension_lectora'),
      d('y', 'B2', 'mediacion'),
      d('z', 'B2', 'produccion_escrita'),
    ];
    expect(faltanPara(levelProgress(ds, { x: 2 }), 'B2')).toBe(2);
  });

  it('devuelve null si el nivel no existe en el currículo', () => {
    expect(faltanPara(levelProgress([d('x', 'A1', 'mediacion')], {}), 'C2')).toBeNull();
  });
});

describe('los datos reales de portugués', () => {
  const file = DescriptorFileSchema.parse(ptCefr);

  it('validan contra el esquema y cubren los seis niveles', () => {
    const niveles = new Set(file.descriptors.map((x) => x.cefr));
    for (const n of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) expect(niveles.has(n as never)).toBe(true);
  });

  it('NINGÚN descriptor se declara verbatim del Companion Volume', () => {
    // Son nuestros. Marcarlos `cv2020` para pasar un gate sería la misma
    // mentira que este eje viene a eliminar.
    expect(file.descriptors.every((x) => x.source === 'local')).toBe(true);
  });

  it('las tareas sin destreza asignada quedan visibles, no repartidas', () => {
    const sinAsignar = file.taskSpecs.filter((t) => t.skill === null);
    expect(sinAsignar.every((t) => t.skillConfidence === 'sin_asignar')).toBe(true);
    // Que existan es el estado real: la clasificación automática no llega,
    // y esconderlas repartiéndolas falsearía el progreso por destreza.
    expect(sinAsignar.length).toBeGreaterThan(0);
  });

  it('marca como no alcanzables en la app las destrezas que exigen una persona', () => {
    const interaccionAlta = file.descriptors.filter(
      (x) => x.skill === 'interaccion' && ['B1', 'B2', 'C1', 'C2'].includes(x.cefr),
    );
    expect(interaccionAlta.length).toBeGreaterThan(0);
    expect(interaccionAlta.every((x) => x.attainability === 'requires_human_hours')).toBe(true);
  });

  it('cada TaskSpec con destreza apunta a un descriptor que existe', () => {
    const ids = new Set(file.descriptors.map((x) => x.id));
    const rotos = file.taskSpecs
      .filter((t) => t.skill !== null)
      .flatMap((t) => t.descriptorIds)
      .filter((id) => !ids.has(id));
    expect(rotos).toEqual([]);
  });
});

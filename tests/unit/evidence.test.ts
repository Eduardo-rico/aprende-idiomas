// tests/unit/evidence.test.ts
//
// La regla de recuento del eje MCER. Es lo único de esta capa que puede
// mentir, así que es lo que hay que fijar:
//
//   · cuentan los EJERCICIOS distintos, no las respuestas;
//   · con umbral ≥2 se exigen además DOS DÍAS distintos.
//
// Sin la segunda condición, una sola sesión larga «demostraría» un nivel
// entero — la misma inflación que hacía que el XP declarara «C2» antes del
// Bloque 3, sólo que con otro disfraz.
import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '@/lib/db/schema';
import { registrarEvidencia, contarEvidencias, progresoDeNivel, diaLocal } from '@/lib/db/evidence';
import { nivelAlcanzado, type Descriptor } from '@/lib/data/cefr';

const desc = (id: string, cefr: Descriptor['cefr'], skill: Descriptor['skill'], th = 2): Descriptor => ({
  id, cefr, skill, textEs: id, source: 'local', evidenceThreshold: th, attainability: 'in_app',
});

// b6 → B2 en el mapeo de bloques; error_correction → producción escrita.
const D_B2_ESCRITA = 'pt.B2.produccion_escrita';
const dia = (iso: string) => new Date(`${iso}T10:00:00`);

beforeEach(async () => {
  await db.evidence.clear();
});

describe('registrarEvidencia', () => {
  it('registra sólo los aciertos', async () => {
    await registrarEvidencia({ exerciseId: 'a', type: 'error_correction', blockId: 6, correct: true });
    await registrarEvidencia({ exerciseId: 'b', type: 'error_correction', blockId: 6, correct: false });
    expect(await db.evidence.count()).toBe(1);
  });

  it('no registra lo que no ancla a ningún descriptor', async () => {
    const r = await registrarEvidencia({ exerciseId: 'x', type: 'lesson', blockId: 6, correct: true });
    expect(r).toBeNull();
    expect(await db.evidence.count()).toBe(0);
  });

  it('es idempotente por ejercicio y día: repetir la tarjeta no suma filas', async () => {
    for (let i = 0; i < 5; i++) {
      await registrarEvidencia({ exerciseId: 'a', type: 'error_correction', blockId: 6, correct: true, now: dia('2026-07-28') });
    }
    expect(await db.evidence.count()).toBe(1);
  });
});

describe('la regla de recuento', () => {
  const ds = [desc(D_B2_ESCRITA, 'B2', 'produccion_escrita', 2)];

  it('machacar la MISMA tarjeta muchas veces es UNA evidencia', async () => {
    for (const d of ['2026-07-28', '2026-07-29', '2026-07-30']) {
      await registrarEvidencia({ exerciseId: 'misma', type: 'error_correction', blockId: 6, correct: true, now: dia(d) });
    }
    // Tres días, pero un solo ejercicio distinto.
    expect((await contarEvidencias(ds))[D_B2_ESCRITA]).toBe(1);
  });

  it('dos ejercicios distintos EL MISMO DÍA no bastan', async () => {
    await registrarEvidencia({ exerciseId: 'a', type: 'error_correction', blockId: 6, correct: true, now: dia('2026-07-28') });
    await registrarEvidencia({ exerciseId: 'b', type: 'fill_blank', blockId: 6, correct: true, now: dia('2026-07-28') });
    // Acertar dos veces seguidas es memoria de trabajo, no aprendizaje.
    expect((await contarEvidencias(ds))[D_B2_ESCRITA]).toBe(1);
  });

  it('dos ejercicios distintos en DOS DÍAS distintos sí demuestran', async () => {
    await registrarEvidencia({ exerciseId: 'a', type: 'error_correction', blockId: 6, correct: true, now: dia('2026-07-28') });
    await registrarEvidencia({ exerciseId: 'b', type: 'fill_blank', blockId: 6, correct: true, now: dia('2026-07-29') });
    expect((await contarEvidencias(ds))[D_B2_ESCRITA]).toBe(2);

    const p = await progresoDeNivel(ds);
    expect(p.find((x) => x.cefr === 'B2')!.demostrados).toBe(1);
  });

  it('con umbral 1 no se exige dispersión temporal', async () => {
    const suelto = [desc('pt.B2.produccion_escrita', 'B2', 'produccion_escrita', 1)];
    await registrarEvidencia({ exerciseId: 'a', type: 'error_correction', blockId: 6, correct: true, now: dia('2026-07-28') });
    expect((await contarEvidencias(suelto))[D_B2_ESCRITA]).toBe(1);
  });
});

describe('el efecto en el nivel', () => {
  it('una destreza sin evidencia impide declarar el nivel entero', async () => {
    const ds = [
      desc('pt.B2.produccion_escrita', 'B2', 'produccion_escrita'),
      desc('pt.B2.interaccion', 'B2', 'interaccion'),
    ];
    await registrarEvidencia({ exerciseId: 'a', type: 'error_correction', blockId: 6, correct: true, now: dia('2026-07-28') });
    await registrarEvidencia({ exerciseId: 'b', type: 'fill_blank', blockId: 6, correct: true, now: dia('2026-07-29') });

    const p = await progresoDeNivel(ds);
    expect(p[0]!.porDestreza.produccion_escrita!.pct).toBe(100);
    expect(p[0]!.porDestreza.interaccion!.pct).toBe(0);
    // Y por tanto no hay B2, por mucho que la mitad esté al 100 %.
    expect(nivelAlcanzado(p)).toBeNull();
  });
});

describe('diaLocal', () => {
  it('usa la fecha local, que es la que percibe el alumno', () => {
    expect(diaLocal(new Date(2026, 6, 28, 23, 30))).toBe('2026-07-28');
    expect(diaLocal(new Date(2026, 6, 29, 0, 30))).toBe('2026-07-29');
  });
});

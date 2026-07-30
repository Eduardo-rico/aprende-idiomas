// Evidencia MCER por lectura terminada (Ola L): terminar una lectura de
// nivel N es evidencia de comprensión lectora de N. Reglas heredadas de
// la capa de evidencia: idempotente por día, cuenta por LECTURAS
// distintas (releer no infla), y el umbral ≥2 sigue exigiendo dos días.
import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '@/lib/db/schema';
import { registrarLecturaTerminada, lecturaYaTerminada, contarEvidencias } from '@/lib/db/evidence';
import type { Descriptor } from '@/lib/data/cefr';

const desc = (id: string, cefr: Descriptor['cefr'], skill: Descriptor['skill'], th = 2): Descriptor => ({
  id, cefr, skill, textEs: id, source: 'local', evidenceThreshold: th, attainability: 'in_app',
});
const D_B1_LECTORA = desc('pt.B1.comprension_lectora', 'B1', 'comprension_lectora');
const dia = (iso: string) => new Date(`${iso}T10:00:00`);

beforeEach(async () => {
  await db.evidence.clear();
});

describe('registrarLecturaTerminada', () => {
  it('registra contra el descriptor de comprensión lectora del nivel', async () => {
    const r = await registrarLecturaTerminada({ lecturaId: 'o-tesoiro', nivel: 'B1', now: dia('2026-07-29') });
    expect(r).toBe('pt.B1.comprension_lectora');
    const filas = await db.evidence.toArray();
    expect(filas).toHaveLength(1);
    expect(filas[0]!.exerciseId).toBe('lectura:o-tesoiro');
  });

  it('es idempotente el mismo día', async () => {
    await registrarLecturaTerminada({ lecturaId: 'o-tesoiro', nivel: 'B1', now: dia('2026-07-29') });
    await registrarLecturaTerminada({ lecturaId: 'o-tesoiro', nivel: 'B1', now: dia('2026-07-29') });
    expect(await db.evidence.count()).toBe(1);
  });

  it('releer otro día añade fila pero sigue contando como UNA lectura', async () => {
    await registrarLecturaTerminada({ lecturaId: 'o-tesoiro', nivel: 'B1', now: dia('2026-07-29') });
    await registrarLecturaTerminada({ lecturaId: 'o-tesoiro', nivel: 'B1', now: dia('2026-07-30') });
    expect(await db.evidence.count()).toBe(2);
    const n = await contarEvidencias([D_B1_LECTORA]);
    expect(n['pt.B1.comprension_lectora']).toBe(1);
  });

  it('dos lecturas en dos días alcanzan el umbral de 2', async () => {
    await registrarLecturaTerminada({ lecturaId: 'o-tesoiro', nivel: 'B1', now: dia('2026-07-29') });
    await registrarLecturaTerminada({ lecturaId: 'a-aia', nivel: 'B1', now: dia('2026-07-30') });
    const n = await contarEvidencias([D_B1_LECTORA]);
    expect(n['pt.B1.comprension_lectora']).toBe(2);
  });

  it('rechaza un nivel que no es MCER', async () => {
    const r = await registrarLecturaTerminada({ lecturaId: 'x', nivel: 'Z9', now: dia('2026-07-29') });
    expect(r).toBeNull();
    expect(await db.evidence.count()).toBe(0);
  });
});

describe('lecturaYaTerminada', () => {
  it('dice si esta lectura ya se marcó alguna vez', async () => {
    expect(await lecturaYaTerminada('o-tesoiro', 'B1')).toBe(false);
    await registrarLecturaTerminada({ lecturaId: 'o-tesoiro', nivel: 'B1', now: dia('2026-07-29') });
    expect(await lecturaYaTerminada('o-tesoiro', 'B1')).toBe(true);
  });
});

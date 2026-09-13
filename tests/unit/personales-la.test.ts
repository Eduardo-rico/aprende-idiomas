// tests/unit/personales-la.test.ts
//
// LOS PRONOMBRES PERSONALES — la tabla que entró sin que la mirara nadie.
//
// Se escribió el 2026-09-12 y tenía CERO tests y CERO gates. Lo destapó la
// pregunta que hay que hacerse al meter una máquina nueva: no «qué
// invariantes existen» sino **cuáles la miran**.
import { describe, it, expect } from 'vitest';
import { PERSONALES_L1, formasDe, GENITIVO_PARTITIVO } from '@/lib/data/languages/la/personales-la';
import atestacion from '@/lib/data/languages/la/atestacion-l1.json';
import { formasUnicasDeL1 } from '@/lib/data/languages/la/todas-las-formas';

const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u');

describe('el paradigma es supletivo y por eso va en tabla', () => {
  it('ninguna forma sale de un tema común: por eso no cabe en pronombres-la', () => {
    const ego = PERSONALES_L1.find((p) => p.lema === 'ego')!;
    expect(formasDe(ego).sort()).toEqual(['ego', 'meī', 'mihi', 'mē', 'mē'].sort());
    // `ego` y `meī` no comparten ni la primera letra del tema
    expect(ego.formas.nom).toBe('ego');
    expect(ego.formas.gen).toBe('meī');
  });

  it('el reflexivo NO tiene nominativo, y va declarado con null', () => {
    const se = PERSONALES_L1.find((p) => p.lema === 'suī')!;
    expect(se.formas.nom).toBeNull();
    expect(formasDe(se)).not.toContain('');
    expect(formasDe(se).sort()).toEqual(['sē', 'sē', 'sibi', 'suī'].sort());
  });

  it('el genitivo partitivo es OTRA forma y significa otra cosa', () => {
    // `nostrī` es el objetivo y `nostrum` el partitivo. Las dos
    // atestiguadas: 150 y 100.
    expect(GENITIVO_PARTITIVO['nōs']).toBe('nostrum');
    expect(PERSONALES_L1.find((p) => p.lema === 'nōs')!.formas.gen).toBe('nostrī');
  });
});

describe('todas sus formas están atestiguadas, y no de refilón', () => {
  it('cada forma aparece en el corpus', () => {
    const cong = (atestacion as { lemas: Record<string, Record<string, { forma: string; n: number }>> }).lemas;
    for (const p of PERSONALES_L1) {
      const celdas = cong[p.lema];
      expect(celdas, `${p.lema} no está en atestacion-l1.json`).toBeDefined();
      for (const f of formasDe(p)) {
        const hay = Object.values(celdas!).some((c) => sinM(c.forma) === sinM(f) && c.n > 0);
        expect(hay, `${p.lema}/${f} sin atestiguar`).toBe(true);
      }
    }
  });

  it('y el enumerador del dominio las produce', () => {
    const dominio = new Set(formasUnicasDeL1().map(sinM));
    for (const p of PERSONALES_L1)
      for (const f of formasDe(p)) expect(dominio.has(sinM(f)), `${p.lema}/${f}`).toBe(true);
  });
});

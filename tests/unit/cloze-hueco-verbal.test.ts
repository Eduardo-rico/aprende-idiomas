// Un hueco verbal sin lema ni paradigma no publica.
//
// No es un defecto de ítems concretos, es una propiedad del formato: «Eu
// ___ os documentos para a reunião» admite «trarei» y «levarei» igual de
// bien. Medido sobre los 182 cloze publicados sin pista, en los bloques de
// verbo catorce de cada veintidós lo necesitaban.
import { describe, it, expect } from 'vitest';
import { verificar } from '@/scripts/lotes/cloze-e2-15';

const item = (extra: Record<string, unknown>) => ([{
  p: 'x', pasada: 1, s: 'Eu ___ os documentos na segunda-feira.',
  pista: 'los papeles de la reunión', ancla: 'na segunda-feira', ...extra,
}] as any);
const marca = (xs: any) => verificar(xs).filter((m) => m.includes('hueco verbal'));

describe('hueco verbal', () => {
  it('SIN lema ni paradigma: no pasa', () => {
    expect(marca(item({ r: 'trarei' })).length).toBe(1);
  });
  it('CON el paradigma en la pista: pasa', () => {
    expect(marca(item({ r: 'trarei', pista: 'futuro de «trazer», 1.ª persona' })).length).toBe(0);
  });
  it('CON el lema en el molde: pasa', () => {
    expect(marca(item({ r: 'trarei', s: 'Eu ___ (trazer) os documentos na segunda-feira.' })).length).toBe(0);
  });
  it('un sustantivo con terminación parecida NO se marca', () => {
    // «-ar», «-er», «-ado» e «-ido» quedan fuera a propósito: chocan con
    // lugar, mulher, mercado y vestido.
    for (const r of ['lugar', 'mulher', 'prazer', 'mercado', 'vestido'])
      expect(marca(item({ r }))).toEqual([]);
  });
});

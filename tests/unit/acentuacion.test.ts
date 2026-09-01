// El clasificador tiene que acertar ANTES de que un gate lo use para
// bloquear: un gate que marca de más se deja de leer.
import { describe, it, expect } from 'vitest';
import { claseDe } from '@/scripts/lib/acentuacion';

describe('claseDe', () => {
  it('las que el corpus tenía MAL', () => {
    expect(claseDe('Brasil')).toBe('oxitona');        // decía paroxítona
    expect(claseDe('ônibus')).toBe('proparoxitona');  // decía paroxítona
    expect(claseDe('difícil')).toBe('paroxitona');    // decía esdrújula
    expect(claseDe('difíceis')).toBe('paroxitona');
    expect(claseDe('mãe')).toBe('oxitona');           // decía esdrújula (E2#3)
  });
  it('las que el corpus tenía BIEN', () => {
    expect(claseDe('hábito')).toBe('proparoxitona');
    expect(claseDe('táxi')).toBe('paroxitona');
    expect(claseDe('café')).toBe('oxitona');
    expect(claseDe('lápis')).toBe('paroxitona');
    expect(claseDe('fácil')).toBe('paroxitona');
    expect(claseDe('mamãe')).toBe('oxitona');
    expect(claseDe('médico')).toBe('proparoxitona');
    expect(claseDe('sábado')).toBe('proparoxitona');
    expect(claseDe('gostávamos')).toBe('proparoxitona');
  });
  it('la regla general, sin acento gráfico', () => {
    expect(claseDe('casa')).toBe('paroxitona');
    expect(claseDe('falam')).toBe('paroxitona');
    expect(claseDe('homens')).toBe('paroxitona');
    expect(claseDe('papel')).toBe('oxitona');
    expect(claseDe('falar')).toBe('oxitona');
    expect(claseDe('feliz')).toBe('oxitona');
    expect(claseDe('comum')).toBe('oxitona');
    expect(claseDe('caqui')).toBe('oxitona');
  });
  it('el til marca la tónica cuando no hay otro acento', () => {
    expect(claseDe('irmã')).toBe('oxitona');
    expect(claseDe('coração')).toBe('oxitona');
    expect(claseDe('órgão')).toBe('paroxitona');   // el agudo manda sobre el til
  });
  it('los hiatos no se funden', () => {
    expect(claseDe('saída')).toBe('paroxitona');
    expect(claseDe('país')).toBe('oxitona');
    expect(claseDe('poeta')).toBe('paroxitona');
  });
  it('calla ante lo que no sabe, en vez de arriesgar', () => {
    expect(claseDe('guarda-chuva')).toBeNull();
    expect(claseDe('')).toBeNull();
  });
});

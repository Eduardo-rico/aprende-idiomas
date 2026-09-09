// tests/unit/lote-interrogativas-la.test.ts
//
// Las interrogativas. Es de los pocos puntos `sin-equivalente` puros: el
// español no tiene NINGUNA palabra que haga esto, así que el alumno no
// puede equivocarse por transferencia — tiene un hueco, y un hueco se
// rellena enseñando, no cazando trampas.
import { describe, it, expect } from 'vitest';
import {
  LOTE_INTERROGATIVAS, ESPERA, EN_ESPANOL, FRECUENCIA, POR_QUE_NO_SE_CUENTA_NE,
  type Particula,
} from '@/lib/data/languages/la/lotes/l5-interrogativas';

const PARTICULAS: Particula[] = ['ne', 'num', 'nonne'];

describe('las interrogativas · en verde', () => {
  it('las tres partículas, cuatro ítems cada una', () => {
    // El varia lo dice literal: «hay que traer las tres o el punto no mide
    // nada».
    for (const p of PARTICULAS)
      expect(LOTE_INTERROGATIVAS.filter((it) => it.ejes.particula === p), p).toHaveLength(4);
  });

  it('la respuesta esperada sale de la tabla, no del ítem', () => {
    for (const it of LOTE_INTERROGATIVAS)
      expect(it.respuesta, it.id).toBe(ESPERA[it.ejes.particula]);
  });

  it('contestar siempre lo mismo da exactamente el azar de tres valores', () => {
    const c = new Map<string, number>();
    for (const it of LOTE_INTERROGATIVAS) c.set(it.respuesta, (c.get(it.respuesta) ?? 0) + 1);
    expect(Math.max(...c.values()) / LOTE_INTERROGATIVAS.length).toBeCloseTo(1 / 3, 9);
  });

  it('el latín lleva la partícula que el ítem declara', () => {
    for (const it of LOTE_INTERROGATIVAS) {
      const l = it.latin.toLowerCase();
      if (it.ejes.particula === 'nonne') expect(l, it.id).toContain('nonne');
      else if (it.ejes.particula === 'num') expect(l, it.id).toContain('num');
      else expect(l, it.id).toMatch(/ne\?|nesne|sne|tne/);
    }
  });
});

describe('lo que no se pudo contar, y por qué', () => {
  it('`nōnne` y `num` tienen cifra; `-ne` no, y va declarado', () => {
    expect(FRECUENCIA.nonne).toBe(60);
    expect(FRECUENCIA.num).toBe(22);
    expect(FRECUENCIA.ne).toBeNull();
    expect(POR_QUE_NO_SE_CUENTA_NE).toContain('no distingue');
  });

  it('un null NO es un cero: es «no se puede contar»', () => {
    // Dar «3 apariciones» —los tokens PART/discourse— habría sido inventar
    // una cifra: los 963 ADV/advmod con lema `ne` mezclan el interrogativo
    // con el negativo «nē» de las prohibiciones.
    expect(FRECUENCIA.ne).not.toBe(0);
    expect(FRECUENCIA.ne).toBeNull();
  });
});

describe('por qué es `sin-equivalente` de verdad', () => {
  it('ninguna de las tres se traduce con UNA palabra española', () => {
    // Son perífrasis o entonación. Por eso el alumno no puede transferir
    // mal: no tiene de dónde.
    for (const p of PARTICULAS) {
      expect(EN_ESPANOL[p], p).toBeTruthy();
      expect(EN_ESPANOL[p], p).toMatch(/entonación|perífrasis|coletilla/);
    }
  });

  it('y las tres esperan cosas distintas, que es el contenido', () => {
    expect(new Set(Object.values(ESPERA)).size).toBe(3);
    expect(ESPERA.num).toBe('no');
    expect(ESPERA.nonne).toBe('si');
    expect(ESPERA.ne).toBe('ninguna');
  });
});

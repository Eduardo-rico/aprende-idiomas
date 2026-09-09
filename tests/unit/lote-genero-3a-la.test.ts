// tests/unit/lote-genero-3a-la.test.ts
//
// El género de la 3.ª. El eje no es que la terminación no informe —eso es
// la mitad— sino que el alumno usa el género de la palabra ESPAÑOLA que
// conoce, y ésa es la que acierta o falla.
import { describe, it, expect } from 'vitest';
import { LOTE_GENERO_3A } from '@/lib/data/languages/la/lotes/l2-genero-3a';
import { declinacionDe, declinar } from '@/lib/data/languages/la/paradigma-la';

describe('el género de la 3.ª · en verde', () => {
  it('todos los lemas son de 3.ª', () => {
    for (const it of LOTE_GENERO_3A) expect(declinacionDe(it.entrada), it.id).toBe('3ª');
  });

  it('la respuesta lleva el adjetivo concordando, que es lo que la hace medible', () => {
    // Sin saber el género no se puede escribir «magnum» ni «magna».
    for (const it of LOTE_GENERO_3A) {
      expect(it.respuesta, it.id).toContain(declinar(it.entrada, 'nom', 'sg'));
      expect(it.respuesta, it.id).toMatch(/^magn(us|a|um) /);
    }
  });

  it('la ficha muestra lema y genitivo y NO el género', () => {
    for (const it of LOTE_GENERO_3A) {
      expect(it.ficha, it.id).toContain(it.entrada.lema);
      expect(it.ficha, it.id).toContain(it.entrada.genitivo);
      // OJO CON `\b`: no funciona con letras acentuadas, así que `/\bn\b/`
      // casa con la «n» de «nōmen» —la `ō` no es carácter de palabra para
      // JavaScript—. Es el gotcha que ya nos costó una tarde en portugués.
      // La forma correcta es la de lookaround con `\p{L}` y flag `u`.
      expect(it.ficha, it.id).not.toMatch(/masculino|femenino|neutro/);
      expect(it.ficha, it.id).not.toMatch(/(?<!\p{L})[mfn](?!\p{L})/u);
    }
  });

  it('el eje se calcula, no se declara: neutro NUNCA coincide', () => {
    for (const it of LOTE_GENERO_3A) {
      expect(it.ejes.coincide, it.id).toBe(it.entrada.genero === it.ejes.generoEspanol);
      if (it.ejes.generoLatino === 'n') expect(it.ejes.coincide, it.id).toBe(false);
    }
  });
});

describe('los dos tipos de fallo, y no son el mismo', () => {
  it('el NEUTRO falla porque el español no tiene esa opción', () => {
    const neutros = LOTE_GENERO_3A.filter((it) => it.ejes.generoLatino === 'n');
    expect(neutros.length).toBeGreaterThan(3);
    for (const it of neutros) {
      expect(it.ejes.coincide).toBe(false);
      expect(it.ejes.laPalabraQueDesvia, it.id).toContain('el español no tiene esa opción');
    }
  });

  it('`arbor` falla de otra manera: las dos lenguas seguras y en desacuerdo', () => {
    const arbor = LOTE_GENERO_3A.find((it) => it.entrada.lema === 'arbor')!;
    expect(arbor.entrada.genero).toBe('f');       // latín femenino
    expect(arbor.ejes.generoEspanol).toBe('m');   // «el árbol»
    expect(arbor.ejes.laPalabraQueDesvia).toContain('igual de seguras');
    // Y es el único no neutro que falla: por eso hace falta.
    const noNeutrosQueFallan = LOTE_GENERO_3A.filter(
      (it) => !it.ejes.coincide && it.ejes.generoLatino !== 'n');
    expect(noNeutrosQueFallan.map((it) => it.entrada.lema)).toEqual(['arbor']);
  });
});

describe('los que coinciden no son relleno', () => {
  it('ocho de catorce, y sin ellos el lote enseñaría a desconfiar siempre', () => {
    const coinciden = LOTE_GENERO_3A.filter((it) => it.ejes.coincide);
    expect(coinciden.length).toBe(8);
    // El alumno tiene que salir sabiendo que su instinto acierta más de la
    // mitad de las veces, no que no sirve.
    expect(coinciden.length / LOTE_GENERO_3A.length).toBeGreaterThan(0.5);
  });

  it('y tres de ellos acaban igual y tienen géneros distintos', () => {
    // `rēx` (m), `lēx` (f), `vōx` (f): la terminación no informa, que es la
    // primera mitad del punto.
    const enX = LOTE_GENERO_3A.filter((it) => it.entrada.lema.endsWith('x'));
    expect(enX.length).toBeGreaterThanOrEqual(3);
    expect(new Set(enX.map((it) => it.entrada.genero)).size).toBeGreaterThan(1);
  });
});

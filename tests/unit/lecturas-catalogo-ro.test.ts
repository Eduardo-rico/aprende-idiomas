// tests/unit/lecturas-catalogo-ro.test.ts
//
// El catálogo RUMANO pasa los mismos invariantes que el portugués
// (`lecturas-catalogo.invariantes.ts`) más los suyos: diacríticos de la
// norma actual (ș/ț con coma, nunca cedilla), texto CON diacríticos, y
// el gate probado EN ROJO — un gate visto sólo en verde no está probado.
//
// Cifras: `node scripts/lectura/medir-catalogo.mjs ro` — nunca a ojo.
import { describe, it, expect } from 'vitest';
import { invariantesDelCatalogo, cargarCatalogo } from './lecturas-catalogo.invariantes';
// Módulo .mjs del pipeline: es la MISMA regla que usa la ingesta (allowJs).
import { normalizarDiacriticos, gateDiacriticos, sinDiacriticos, contarPalabras, tieneCedilla } from '../../scripts/lectura/texto-ro.mjs';

invariantesDelCatalogo({
  lang: 'ro',
  variantes: ['ro'],
  // Medido 2026-09-01, tanda F-RO-T1 (Creangă + Ispirescu):
  // 64 lecturas · 6 series · 226.055 palabras.
  lecturas: 64,
  palabras: 226_055,
  // Wikisource: la navegación «▲ Începutul paginii», el pie de
  // ilustración («Greuceanu artwork» se coló en la primera corrida) y
  // las llamadas de nota «[1]» huérfanas.
  aparato: /Începutul paginii|\bartwork\b|\[\d{1,3}\]/i,
  extra: (catalogo) => {
    it('ș y ț llevan COMA debajo en todos los campos con texto — cero cedillas', () => {
      const conCedilla = catalogo
        .filter(({ l }) => tieneCedilla(l.titulo) || tieneCedilla(l.notaOrtografia) || l.parrafos.some((p) => tieneCedilla(p.texto)))
        .map((x) => x.archivo);
      expect(conCedilla).toEqual([]);
    });

    it('toda lectura pasa el gate de diacríticos (un texto sin ă/â/î/ș/ț no es rumano correcto)', () => {
      const rotas = catalogo
        .filter(({ l }) => !gateDiacriticos(l.parrafos.map((p) => p.texto).join('\n')).ok)
        .map((x) => x.archivo);
      expect(rotas).toEqual([]);
    });

    it('toda lectura declara su grafía medida en notaOrtografia', () => {
      for (const { archivo, l } of catalogo) {
        expect(l.notaOrtografia, archivo).toMatch(/ș y ț con coma/);
      }
    });

    it('toda lectura es modo texto (cero audio en la fase F)', () => {
      for (const { archivo, l } of catalogo) expect(l.modo, archivo).toBe('texto');
    });
  },
});

describe('gates del texto rumano, probados en rojo', () => {
  const primera = cargarCatalogo('ro')[0];
  if (!primera) throw new Error('catálogo RO vacío');
  const muestra = primera.l.parrafos.map((p) => p.texto).join('\n');

  it('el gate de diacríticos RECHAZA el mismo texto despojado de diacríticos', () => {
    expect(gateDiacriticos(muestra).ok).toBe(true);
    const pelado = sinDiacriticos(muestra);
    expect(gateDiacriticos(pelado).ok).toBe(false);
    expect(gateDiacriticos(pelado).ratio).toBe(0);
  });

  it('el gate RECHAZA un texto con ă/â/î pero sin ș/ț (la transcripción a medias)', () => {
    const aMedias = muestra.replace(/[șȘ]/g, 's').replace(/[țȚ]/g, 't');
    expect(gateDiacriticos(aMedias).ok).toBe(false);
  });

  it('la normalización pasa la cedilla (precompuesta Y descompuesta) a coma, y no toca nada más', () => {
    expect(normalizarDiacriticos('Ştefan ţine paşii')).toBe('Ștefan ține pașii');
    expect(normalizarDiacriticos('s\u0327i t\u0327ara')).toBe('și țara');
    expect(normalizarDiacriticos('și țara, când sînt')).toBe('și țara, când sînt');
  });

  it('el contador cuenta PALABRAS (algo con una letra), no tokens: la raya no es una palabra', () => {
    expect(contarPalabras([{ texto: '— Ei, cum? — zise el.' }])).toBe(4);
    expect(contarPalabras([{ texto: '* * *' }])).toBe(0);
  });
});

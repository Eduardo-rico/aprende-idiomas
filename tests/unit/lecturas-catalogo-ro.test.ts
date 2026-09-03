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
import { normalizarDiacriticos, gateDiacriticos, sinDiacriticos, contarPalabras, tieneCedilla, medirGrafia } from '../../scripts/lectura/texto-ro.mjs';

invariantesDelCatalogo({
  lang: 'ro',
  variantes: ['ro'],
  // Medido 2026-09-01, tandas F-RO-T1 (Creangă + Ispirescu), T2
  // (Caragiale + Slavici + Gârleanu + Delavrancea) y T3 (novela, memoria
  // y crónica: Filimon, Odobescu, Hogaș, Zamfirescu, Gane, Hasdeu,
  // Vlahuță, Russo, Negruzzi, Alecsandri, Pop-Reteganul, Eminescu, Ghica…):
  // 817 lecturas · 77 series · 2.830.946 palabras (tras la auditoría OCR:
  // fuera zamfirescu-nuvele, OCR crudo en la fuente).
  lecturas: 817,
  palabras: 2_830_965,
  // Wikisource: la navegación «▲ Începutul paginii», el pie de
  // ilustración («Greuceanu artwork» se coló en la primera corrida) y
  // las llamadas de nota «[1]» huérfanas.
  aparato: /Începutul paginii|\bartwork\b|\[\d{1,3}\]|\^/i,
  extra: (catalogo) => {
    it('ș y ț llevan COMA debajo en todos los campos con texto — cero cedillas', () => {
      const conCedilla = catalogo
        .filter(({ l, texto }) => tieneCedilla(l.titulo) || tieneCedilla(l.notaOrtografia) || l.parrafos.some((p) => tieneCedilla(p.texto)))
        .map((x) => x.archivo);
      expect(conCedilla).toEqual([]);
    });

    it('toda lectura pasa el gate de diacríticos (un texto sin ă/â/î/ș/ț no es rumano correcto)', () => {
      const rotas = catalogo
        .filter(({ l, texto }) => !gateDiacriticos(texto).ok)
        .map((x) => x.archivo);
      expect(rotas).toEqual([]);
    });

    it('toda lectura declara su grafía medida en notaOrtografia', () => {
      for (const { archivo, l, texto } of catalogo) {
        expect(l.notaOrtografia, archivo).toMatch(/ș y ț con coma/);
      }
    });

    it('toda lectura es modo texto (cero audio en la fase F)', () => {
      for (const { archivo, l, texto } of catalogo) expect(l.modo, archivo).toBe('texto');
    });
  },
});

describe('gates del texto rumano, probados en rojo', () => {
  const primera = cargarCatalogo('ro')[0];
  if (!primera) throw new Error('catálogo RO vacío');
  const muestra = primera.texto;

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

  it('la medición de grafía ve el apóstrofo de elisión pre-1953, y NO lo ve en el mismo texto con guion', () => {
    const viejo = 'Într’o zi s’a dus și n’am știut nimic; m’a lăsat într’un sat. Era când toți dormeau.';
    const nuevo = viejo.replace(/(\p{L})’(\p{L})/gu, '$1-$2');
    expect(medirGrafia(viejo).elision).toBe(true);
    expect(medirGrafia(viejo).nota).toMatch(/apóstrofo de elisión anterior a la reforma de 1953/);
    expect(medirGrafia(nuevo).elision).toBe(false);
    expect(medirGrafia(nuevo).nota).not.toMatch(/apóstrofo/);
    // «dom'le» de Caragiale es habla de personaje, no norma: no cuenta
    expect(medirGrafia("dom'le, dom'le, dom'le, văz't că vin't când toți dormeau").elision).toBe(false);
  });

  it('«mixta con pocas formas»: dos «cînd» en un texto moderno se DECLARAN; el mismo texto sin ellos, no', () => {
    // ocho formas modernas con â y, en la variante, dos restos con î: la
    // edición es «actual» (â domina 6 a 2) pero tiene restos que declarar
    const moderno = 'Când a venit, era târziu și toți dormeau în sat. Când s-a dus, nimeni nu l-a văzut; câinii tăceau, vântul cânta printre pâlcuri. Pământul era rece.';
    const conRestos = moderno.replace('Când s-a', 'Cînd s-a').replace('Pământul', 'Pămîntul');
    expect(medirGrafia(moderno).nota).not.toMatch(/sin modernizar/);
    expect(medirGrafia(conRestos).nota).toMatch(/Quedan 2 formas .* sin modernizar/);
    expect(medirGrafia(conRestos).nota).toMatch(/1953-1993/);
    // exenciones: prefijo que abre raíz, interjección, francés
    expect(medirGrafia('preaînalt nemaiîncăpând subtîmpărțesc hîîî psîîîî maître entraîne când sunt').nota).not.toMatch(/sin modernizar/);
  });

  it('el contador cuenta PALABRAS (algo con una letra), no tokens: la raya no es una palabra', () => {
    expect(contarPalabras([{ texto: '— Ei, cum? — zise el.' }])).toBe(4);
    expect(contarPalabras([{ texto: '* * *' }])).toBe(0);
  });
});

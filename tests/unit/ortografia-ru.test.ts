import { describe, it, expect } from 'vitest';
import {
  canonicalRu, quitarAcento, plegarYo, normalizarRespuestaRu,
  homoglifosRu, revisarOrtografiaRu, ACENTO, GRAVE,
} from '@/lib/lang/ortografia-ru';

// UN GATE VISTO SÓLO EN VERDE NO ESTÁ PROBADO. Cada bloque de aquí lleva
// su testigo ROJO —un caso que el gate DEBE cazar— y su testigo VERDE —un
// caso de lengua correcta que NO debe marcar—, porque sin el segundo un
// gate ruidoso pasa por bueno y sin el primero uno muerto también.

describe('ortografia-ru · acento', () => {
  it('quita el combinante suelto y deja la palabra', () => {
    expect(quitarAcento('за́мок')).toBe('замок');
    expect(quitarAcento('что̀')).toBe('что');
  });

  it('ROJO YA PAGADO: NO convierte `ќ` (U+045C) en `к`', () => {
    // Bajo NFD `ќ` ES `к` + U+0301, así que la versión descompuesta de
    // esta función destruía una letra de verdad. El testigo es el caso
    // real que lo destapó: el gallo de Odóievski.
    expect('ќ'.normalize('NFD')).toBe('к' + ACENTO);
    expect(quitarAcento('Кукуреќу')).toBe('Кукуреќу');
    expect(revisarOrtografiaRu('Кукуреќу')).toEqual([]);
  });

  it('ROJO: marca la tilde en un campo de dato, y la admite si se declara presentación', () => {
    expect(revisarOrtografiaRu('за́мок').map((h) => h.clase)).toEqual(['acento-en-dato']);
    expect(revisarOrtografiaRu('за́мок', { acentoPermitido: true })).toEqual([]);
  });

  it('el grave editorial NO es acento y no se cuenta como tal', () => {
    expect(GRAVE).not.toBe(ACENTO);
    // `что̀` lleva grave, no aguda: no es un campo con acento didáctico.
    expect(revisarOrtografiaRu('что̀').map((h) => h.clase)).toEqual([]);
  });
});

describe('ortografia-ru · ё', () => {
  it('pliega SÓLO al comparar, y `canonicalRu` (el hash) la conserva', () => {
    expect(plegarYo('пришёл')).toBe('пришел');
    expect(canonicalRu('всё')).toBe('всё');
    expect(normalizarRespuestaRu('Пришёл')).toBe('пришел');
    expect(normalizarRespuestaRu('пришел')).toBe('пришел');
  });

  it('LA LÍNEA QUE SEPARA EL RUSO DEL RUMANO: el hash NO pliega, porque все ≠ всё', () => {
    // En rumano `ş`/`ș` son dos CODIFICACIONES de un dato y plegarlas une
    // dos ids que son uno. Aquí son dos PALABRAS: plegarlas en el hash
    // fundiría dos ítems y pagaría un MP3 que dice la otra.
    expect(canonicalRu('все')).not.toBe(canonicalRu('всё'));
  });
});

describe('ortografia-ru · homóglifos', () => {
  it('ROJO: caza la latina dentro de la palabra rusa y dice cuál', () => {
    const h = homoglifosRu('он сказал cлово'); // «с» latina
    expect(h).toHaveLength(1);
    expect(h[0]!.latinas).toEqual(['c']);
    expect(h[0]!.sugerencia).toBe('слово');
  });

  it('VERDE: una palabra enteramente latina no es un homóglifo', () => {
    expect(homoglifosRu('он читал Hamlet')).toEqual([]);
    expect(homoglifosRu('он сказал слово')).toEqual([]);
  });
});

describe('ortografia-ru · grafía tras sibilante y velar', () => {
  it('ROJO: caza lo que un generador por regla produce solo', () => {
    // `*книгы` es exactamente lo que sale de «plural = raíz + ы» sin la
    // regla velar, y `*жыть` de «ы tras dura».
    expect(revisarOrtografiaRu('книгы').map((h) => h.clase)).toEqual(['velar-y']);
    expect(revisarOrtografiaRu('жыть').map((h) => h.clase)).toEqual(['sibilante-y']);
    expect(revisarOrtografiaRu('чясто').map((h) => h.clase)).toEqual(['sibilante-ya']);
    expect(revisarOrtografiaRu('чюдо').map((h) => h.clase)).toEqual(['sibilante-yu']);
  });

  it('VERDE: las excepciones van POR RAÍZ, no por forma — la lengua declina', () => {
    // La v0 las enumeraba como palabras y el gate marcó 174 apariciones
    // correctas de la biblioteca (`брошюру`, `брошюрках`, `парашютист`).
    for (const w of ['жюри', 'брошюра', 'брошюру', 'брошюрках', 'парашют', 'парашютист', 'сброшюрованных'])
      expect(revisarOrtografiaRu(w), w).toEqual([]);
  });

  it('VERDE: `цы` NO se marca — es grafía correcta y frecuente', () => {
    // Meter `ц` en la regla produciría una mala que es lengua real, y es
    // lo primero que el siguiente va a querer añadir.
    for (const w of ['отцы', 'огурцы', 'цыган', 'цыплёнок'])
      expect(revisarOrtografiaRu(w), w).toEqual([]);
  });

  it('VERDE: ruso corriente no dispara nada', () => {
    expect(revisarOrtografiaRu('Он жил в большом городе и читал книги каждый день.')).toEqual([]);
  });
});

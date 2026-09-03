// tests/unit/hash-audio-latin.test.ts
//
// EL HASH DEL AUDIO ES LA IDENTIDAD DEL CLIP, y en latín el texto que se
// muestra no es el que se envía (mácrons + respelización eclesiástica).
// Si el hash se calcula sobre el mostrado, `Rōma` y `Roma` son dos
// ficheros del mismo audio; si `generate-audio` transforma y
// `check-audio-stale` no, todos los clips latinos salen caducos para
// siempre y el gate se vuelve ilegible.
//
// El portugués ya pagó esa clase: 5.451 MP3 para 2.576 referencias, dos
// eras de ficheros. Esto se cierra ANTES del primer clip y antes del
// inventario, porque recalcular hashes sobre material ya escrito es la
// operación en la que un fallo devuelve un número plausible.
import { describe, it, expect } from 'vitest';
import { elevenTtsHash, textoDeTts } from '@/scripts/lib/elevenlabs-tts';
import { textoParaVoz } from '@/lib/lang/ortografia-la';

describe('el texto que se ENVÍA', () => {
  it('en latín pasa por `textoParaVoz`', () => {
    expect(textoDeTts('la', 'caelum')).toBe(textoParaVoz('caelum'));
    expect(textoDeTts('la', 'Rōma')).toBe('roma');
  });

  it('en las demás lenguas NO se toca — sin regresión', () => {
    for (const v of ['pt', 'br', 'ro'] as const) {
      expect(textoDeTts(v, 'Está aqui, não?')).toBe('Está aqui, não?');
      expect(textoDeTts(v, 'ș și ț')).toBe('ș și ț');
    }
  });
});

describe('el hash se calcula sobre el texto ENVIADO', () => {
  it('`Rōma` y `Roma` dan UN SOLO hash: un audio, un fichero', () => {
    expect(elevenTtsHash({ text: 'Rōma', variant: 'la' }))
      .toBe(elevenTtsHash({ text: 'Roma', variant: 'la' }));
  });

  it('`caelum` y `celum` también, porque suenan igual', () => {
    // La respelización existe justo para que la voz diga «chélum»; si el
    // hash no la aplicara, el mismo audio se pagaría dos veces.
    expect(elevenTtsHash({ text: 'caelum', variant: 'la' }))
      .toBe(elevenTtsHash({ text: 'celum', variant: 'la' }));
    expect(elevenTtsHash({ text: 'grātia', variant: 'la' }))
      .toBe(elevenTtsHash({ text: 'gratsia', variant: 'la' }));
  });

  it('y textos que suenan DISTINTO siguen dando hashes distintos', () => {
    // El control en la otra dirección: una normalización que lo funde
    // todo también «pasaría» las aserciones de arriba.
    expect(elevenTtsHash({ text: 'caelum', variant: 'la' }))
      .not.toBe(elevenTtsHash({ text: 'caecum', variant: 'la' }));
  });

  it('la variante entra en el hash: el mismo texto en dos lenguas no colisiona', () => {
    expect(elevenTtsHash({ text: 'Roma', variant: 'la' }))
      .not.toBe(elevenTtsHash({ text: 'Roma', variant: 'pt' }));
  });

  it('es ESTABLE: el mismo texto da el mismo hash en dos llamadas', () => {
    const a = elevenTtsHash({ text: 'arma virumque canō', variant: 'la' });
    const b = elevenTtsHash({ text: 'arma virumque canō', variant: 'la' });
    expect(a).toBe(b);
  });
});

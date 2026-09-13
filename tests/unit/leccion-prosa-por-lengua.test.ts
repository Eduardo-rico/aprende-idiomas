import { describe, it, expect } from 'vitest';
import { LANGUAGES, LANG_LECCION } from '@/lib/locales';

// EL BUG QUE ESTE TEST FIJA (2026-09-12).
//
// La prosa de la página de lección estaba escrita A MANO EN PORTUGUÉS,
// en `loaders.ts` y en la propia página, y se servía a las SEIS lenguas.
// Una lección de ruso mostraba:
//
//   · «Ouça as duas variantes e note a diferença de cadência e timbre.»
//   · «Conteúdo da lição X em breve — gerado pelo orquestrador.»
//   · «Exemplo com "X"» · «Capítulo N — bloque»
//   · dos botones de audio etiquetados PT-BR y PT-PT, SIN audio detrás.
//
// No era sólo un fallo de traducción: la primera frase **afirma un hecho
// del portugués** —que tiene dos variantes— que el ruso no tiene. El
// alumno leería una afirmación falsa sobre la lengua que estudia.
//
// Nadie lo cazó porque no rompe nada: la página renderiza, los tipos
// cuadran y los tests pasaban. Es «la prosa publicada no tiene gate»
// aplicado al chrome de la lección en vez de a los objectives.

const PALABRAS_SOLO_PORTUGUESAS = [
  'Ouça', 'Conteúdo', 'lição', 'Exemplo', 'duas', 'diferença', 'cadência',
  'orquestrador', 'Capítulo com', 'PT-BR', 'PT-PT',
];

describe('la prosa de la lección no es portuguesa en las demás lenguas', () => {
  it('sólo `pt` tiene texto portugués', () => {
    for (const lang of LANGUAGES) {
      if (lang === 'pt') continue;
      const p = LANG_LECCION[lang];
      const todo = [
        p.cuerpo,
        p.sinContenido('X'),
        p.ejemplo('X'),
        p.capitulo(1, 'B'),
        p.variantes ? `${p.variantes.intro} ${p.variantes.a} ${p.variantes.b}` : '',
      ].join(' · ');
      for (const mala of PALABRAS_SOLO_PORTUGUESAS) {
        expect(todo, `${lang} sirve prosa portuguesa: «${mala}»`).not.toContain(mala);
      }
    }
  });

  // Y el control por el otro lado: si `pt` dejara de tener su texto, el
  // test de arriba seguiría en verde sobre una lista vacía. Un detector
  // que sólo comprueba ausencias aprueba el borrado.
  it('CONTROL: `pt` SÍ conserva el suyo, palabra por palabra', () => {
    const p = LANG_LECCION.pt;
    expect(p.cuerpo).toContain('Ouça as duas variantes');
    expect(p.sinContenido('X')).toContain('Conteúdo');
    expect(p.variantes?.a).toBe('PT-BR');
    expect(p.variantes?.b).toBe('PT-PT');
  });

  it('`variantes` es null en todas menos `pt`: no se ofrece un contraste que no existe', () => {
    for (const lang of LANGUAGES) {
      if (lang === 'pt') expect(LANG_LECCION[lang].variantes).not.toBeNull();
      else expect(LANG_LECCION[lang].variantes, lang).toBeNull();
    }
  });

  it('ninguna lengua se queda sin entrada', () => {
    for (const lang of LANGUAGES) {
      expect(LANG_LECCION[lang], lang).toBeDefined();
      expect(typeof LANG_LECCION[lang].sinContenido('X')).toBe('string');
    }
  });
});

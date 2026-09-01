// Una persona que no es del paradigma tiene que dar null, no una palabra
// inventada.
//
// `per: 'vocês'` es una persona real del idioma pero no una CLAVE del
// paradigma, que usa 'eles' para la 3.ª del plural. El tipo lo prohibía y
// el tipo sólo protege a quien compila: el lote pasó sus propios gates,
// pasó el publicador, pasó `verify:content` y llegó al corpus con
// «trouxeundefined» — el tema concatenado con una desinencia inexistente.
// Cinco ítems servidos así.
//
// Y el gate que RECALCULA la respuesta no lo vio, porque recalculaba lo
// mismo y coincidía consigo mismo. Un derivador que no comprueba que la
// derivación salió es un gate que se da la razón.
import { describe, it, expect } from 'vitest';
import { conjugar, imperfeitoConjuntivo, futuroConjuntivo, formaValida, esPersona } from '@/scripts/lib/paradigma-pt';

describe('persona fuera del paradigma', () => {
  it('«vocês» y «elas» no son claves del paradigma', () => {
    expect(esPersona('vocês')).toBe(false);
    expect(esPersona('elas')).toBe(false);
    expect(esPersona('eles')).toBe(true);
  });
  it('devuelven null en vez de concatenar undefined', () => {
    expect(imperfeitoConjuntivo('dar', 'vocês' as any)).toBeNull();
    expect(futuroConjuntivo('trazer', 'vocês' as any)).toBeNull();
    expect(conjugar('falar', 'presente', 'elas' as any)).toBeNull();
  });
  it('las formas buenas siguen saliendo', () => {
    expect(imperfeitoConjuntivo('dar', 'eles')).toBe('dessem');
    expect(futuroConjuntivo('trazer', 'eles')).toBe('trouxerem');
  });
  it('`formaValida` ataja cualquier residuo de una derivación rota', () => {
    expect(formaValida('trouxeundefined')).toBeNull();
    expect(formaValida('estiveundefined')).toBeNull();
    expect(formaValida('')).toBeNull();
    expect(formaValida('trouxerem')).toBe('trouxerem');
  });
});

// El gate del tiempo declarado, probado EN ROJO.
//
// Su primera versión dio 4 hallazgos y los 4 eran míos: leía la pista por
// especificidad en vez de por posición —«imperfeito por FUTURO DEL PASADO»
// lo clasificaba como futuro— y anclaba el futuro sólo en «-rei», con lo
// que el pretérito «comprei» pasaba por futuro. Los dos fallos producían
// hallazgos FALSOS, que es la forma de matar un gate: nadie vuelve a
// leerlo.
//
// Así que aquí van los dos casos que lo tumbaron, más un choque de verdad
// para comprobar que sigue disparando. Un gate visto sólo en verde no está
// probado.
import { describe, it, expect } from 'vitest';
import { declarado, real } from '../../scripts/barrido-tiempo-declarado';

describe('lo que la pista declara', () => {
  it('lee el PRIMER tiempo nombrado, no el más específico que aparezca', () => {
    expect(declarado('imperfeito por FUTURO DEL PASADO: lo que iba a pasar después')).toBe('imperfeito');
    expect(declarado('presente de «ir», 1.ª del plural — sin «a» delante del infinitivo')).toBe('presente');
  });
  it('«imperfeito do conjuntivo» le gana a «imperfeito», que empieza donde él', () => {
    expect(declarado('imperfeito do conjuntivo de «ser», 3.ª persona')).toBe('subj-imperf');
    expect(declarado('imperfeito de «ser», 3.ª persona')).toBe('imperfeito');
  });
  it('calla ante lo que tiene dos verbos o clítico pegado', () => {
    expect(declarado('futuro simple con el clítico encajado DENTRO del verbo: la mesóclisis')).toBeNull();
    expect(declarado('imperativo formal de «dizer» con el clítico enclítico')).toBeNull();
  });
});

describe('lo que la respuesta es', () => {
  it('no confunde el pretérito con el futuro: el futuro se forma sobre el infinitivo entero', () => {
    expect(real('comprei')).toBe('perfeito');
    expect(real('comprarei')).toBe('futuro');
    expect(real('será')).toBe('futuro');
  });
  it('los presentes en «-ou» no son pretéritos', () => {
    expect(real('dou')).toBe('presente');
    expect(real('vou')).toBe('presente');
    expect(real('falou')).toBe('perfeito');
  });
  it('calla ante «-ria», que es condicional y también imperfeito de «querer»', () => {
    expect(real('queria')).toBeNull();
    expect(real('faria')).toBeNull();
  });
  it('calla ante compuestos y clíticos, que no llevan el tiempo en el sufijo', () => {
    expect(real('terei terminado')).toBeNull();
    expect(real('far-lhe-á')).toBeNull();
  });
});

describe('el gate dispara de verdad', () => {
  it('caza una pista que dice un tiempo y una respuesta que trae otro', () => {
    const d = declarado('pretérito perfeito de «falar», 3.ª persona');
    expect(d).toBe('perfeito');
    expect(real('falava')).toBe('imperfeito');
    expect(d).not.toBe(real('falava'));
  });
});

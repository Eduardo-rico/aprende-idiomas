// El barrido «no mide su punto», probado EN ROJO.
//
// Su primera versión dio 26 avisos y **20 eran falsos**, por dos
// homonimias que nadie ve hasta que las mira:
//
//   · `b4-contr-narrativa` y `b6-contr-duvida` empiezan por `contr-` y NO
//     son contracciones: son CONTRASTES. 17 avisos falsos de golpe.
//   · «mo», «ta», «lho» SON contracciones, pero de dos clíticos, no de
//     preposición y artículo. Otros 3.
//
// Y el detector de nasal escribía `[aeiou]` sin las acentuadas, así que
// «alguém» —que es literalmente el ejemplo del punto «nasal por -m
// final»— salía marcada como que no tiene nasal.
//
// Tres formas distintas de producir hallazgos falsos en un barrido de
// veintiséis. Un gate que miente no es un gate flojo: nadie vuelve a
// leerlo.
import { describe, it, expect } from 'vitest';
import { REGLAS } from '../../scripts/barrido-punto-examinado';

const regla = (punto: string) => REGLAS.find((g) => g.puntos.test(punto));

describe('a qué puntos se aplica cada regla', () => {
  it('«contr-» de CONTRASTE no es «contr-» de contracción', () => {
    expect(regla('b4-contr-narrativa')).toBeUndefined();
    expect(regla('b6-contr-duvida')).toBeUndefined();
    expect(regla('b4-contr-marcador-imperfeito')).toBeUndefined();
    expect(regla('b2-art-contr-de')?.nombre).toMatch(/preposición y artículo/);
  });
  it('las contracciones de clítico van por su propia regla', () => {
    expect(regla('b3-pron-contracoes')?.nombre).toMatch(/dos clíticos/);
  });
  it('cada sub-punto de nasal exige SU rasgo, no «alguna nasal»', () => {
    expect(regla('b1-nasal-ao-oes')?.exhibe('uma', '')).toBe(false);
    expect(regla('b1-nasal-ao-oes')?.exhibe('pães', '')).toBe(true);
    expect(regla('b1-nasal-m-final')?.exhibe('alguém', '')).toBe(true);
  });
  it('calla ante los puntos sin firma en la cadena', () => {
    expect(regla('b6-contraste-indicativo-subjuntivo')).toBeUndefined();
    expect(regla('b10-reg-tratamento')).toBeUndefined();
  });
});

describe('el barrido dispara de verdad', () => {
  it('caza el hueco puesto en la palabra equivocada', () => {
    // Los dos casos reales que motivaron el barrido.
    expect(regla('b2-plural-l')?.exhibe('lições', '')).toBe(false);
    expect(regla('b2-art-contr-de')?.exhibe('filhos', '')).toBe(false);
    // Y aprueba los mismos puntos bien planteados.
    expect(regla('b2-plural-l')?.exhibe('jornais', '')).toBe(true);
    expect(regla('b2-art-contr-de')?.exhibe('da', '')).toBe(true);
  });
});

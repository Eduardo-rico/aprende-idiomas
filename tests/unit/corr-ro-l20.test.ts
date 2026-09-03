// Los gates del lote 20 — los ítems de FRONTERA —, vistos en ROJO antes
// que en verde y con dos sondas cada uno: la que lo pasa con nota máxima
// y la que lo suspende. Un gate que nunca ha dicho que no, no ha dicho
// nada: el anti-anglófono del lote 18 llevaba una condición inalcanzable
// y el lote imprimía «Limpio» exactamente igual.
import { describe, it, expect } from 'vitest';
import { verificar, ITEMS, concuerdaComoSujeto } from '../../scripts/lotes/corr-ro-l20';
import type { ItemCorreccion } from '../../scripts/lib/correccion';

const base = { pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false,
  origenError: 'sobreaplicacion' as const };
const EXPL = 'La regla tiene una frontera y aquí queda fuera, así que la pieza que se ha puesto de más se borra.';
const it_ = (p: string, mala: string, buena: string, extra: Record<string, unknown> = {}) =>
  ({ ...base, p, mala, buena, calcoEs: 'Frase española de la que sale el error.', explicacion: EXPL, ...extra }) as ItemCorreccion;
const marca = (x: ItemCorreccion, re: RegExp) => verificar([x]).some((s) => re.test(s));

describe('la frontera del 19/20 en `r2-numerales-de`', () => {
  it('SUSPENDE si el numeral es ≥20, donde «de» es OBLIGATORIO y la mala sería correcta', () => {
    expect(marca(it_('r2-numerales-de', 'Am cumpărat douăzeci de mere.', 'Am cumpărat douăzeci mere.'),
      /no lleva un numeral MENOR QUE 20/)).toBe(true);
  });
  it('APRUEBA con un numeral menor que 20', () => {
    expect(marca(it_('r2-numerales-de', 'Am cumpărat cinci de mere.', 'Am cumpărat cinci mere.'),
      /no lleva un numeral MENOR QUE 20/)).toBe(false);
  });
});

describe('la frontera del «ca» en `r8-completivas-ca-sa`', () => {
  it('SUSPENDE si entre «ca» y «să» hay un sujeto — ahí la mala es CORRECTA y el ítem está invertido', () => {
    expect(marca(it_('r8-completivas-ca-sa', 'Vreau ca el să vină mâine.', 'Vreau să vină el mâine.'),
      /el ítem está invertido/)).toBe(true);
  });
  it('APRUEBA «ca să» adyacente, que es la sobreaplicación', () => {
    expect(marca(it_('r8-completivas-ca-sa', 'Vreau ca să vin mâine.', 'Vreau să vin mâine.'),
      /el ítem está invertido|no lleva «ca să» adyacente/)).toBe(false);
  });
});

describe('la frontera del «pe» en `r8-relativas-pe-care`: el paradigma AL REVÉS que en el lote 19', () => {
  // En el lote 19 la forma tras `care` NO podía ser la 3.ª que concuerda
  // con el antecedente; aquí TIENE que serlo. Misma pregunta a la misma
  // máquina, respuesta opuesta — y por eso se le pregunta a ella.
  it('SUSPENDE si «care» no puede ser el sujeto: la buena no sería una relativa de sujeto', () => {
    expect(marca(it_('r8-relativas-pe-care', 'Omul pe care aștept este vecinul meu.',
      'Omul care aștept este vecinul meu.', { inf: 'a aștepta' }), /no es la 3\.ª persona/)).toBe(true);
  });
  it('APRUEBA la relativa de sujeto de verdad', () => {
    expect(marca(it_('r8-relativas-pe-care', 'Omul pe care vine acum este vecinul meu.',
      'Omul care vine acum este vecinul meu.', { inf: 'a veni' }), /no es la 3\.ª persona/)).toBe(false);
  });
  it('SUSPENDE si la buena conserva el clítico — la relativa de sujeto va DESNUDA', () => {
    expect(marca(it_('r8-relativas-pe-care', 'Omul pe care îl vine acum este vecinul meu.',
      'Omul care îl vine acum este vecinul meu.', { inf: 'a veni' }), /va desnuda/)).toBe(true);
  });
  it('y le pregunta al paradigma, no a una lista escrita a mano', () => {
    expect(concuerdaComoSujeto('a veni', 'vine')).toBe(true);
    expect(concuerdaComoSujeto('a veni', 'vin')).toBe(true);   // 3.ª plural
    expect(concuerdaComoSujeto('a veni', 'aștept')).toBe(false);
    expect(concuerdaComoSujeto('a inventar', 'vine')).toBe(false); // lema fuera del lexicón
  });
});

describe('el invariante de la clase: un ítem de frontera sólo puede BORRAR', () => {
  it('SUSPENDE si la buena introduce una palabra que no está en la mala', () => {
    expect(marca(it_('r2-numerales-de', 'Am cumpărat cinci de mere.', 'Am cumpărat cinci pere.'),
      /sólo puede BORRAR/)).toBe(true);
  });
  it('SUSPENDE al ítem que no se declara de sobreaplicación', () => {
    const x = { ...it_('r2-numerales-de', 'Am cumpărat cinci de mere.', 'Am cumpărat cinci mere.') };
    delete (x as Record<string, unknown>).origenError;
    expect(marca(x, /todos declaran origenError/)).toBe(true);
  });
  it('APRUEBA el borrado limpio', () => {
    expect(marca(it_('r2-numerales-de', 'Am cumpărat cinci de mere.', 'Am cumpărat cinci mere.'),
      /sólo puede BORRAR|todos declaran origenError/)).toBe(false);
  });
});

describe('los cinco del lote', () => {
  it('pasan todos los gates y los cinco son de frontera', () => {
    expect(verificar(ITEMS)).toEqual([]);
    expect(ITEMS.length).toBe(5);
    expect(ITEMS.every((x) => x.origenError === 'sobreaplicacion')).toBe(true);
  });
  it('y el atajo NO los suspende: en un lote de frontera es la propiedad definitoria', async () => {
    // Los cinco declaran `atajoEs: true` —traducir del español SÍ da la
    // buena— y aun así el lote sale limpio. Si esto se pusiera en rojo,
    // el ítem de frontera sería inescribible y el defecto §0.6 no tendría
    // arreglo dentro del formato.
    const { medirAtajo } = await import('../../scripts/lib/atajo-correccion');
    const m = medirAtajo(ITEMS, 'T');
    expect(m.frontera.length).toBe(5);
    expect(m.atajo.length).toBe(0);
    expect(verificar(ITEMS)).toEqual([]);
  });
});

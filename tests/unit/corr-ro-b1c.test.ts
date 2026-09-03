// El gate del SUJETO POSPUESTO, visto en ROJO antes que en verde.
//
// Un gate que nunca ha dicho que no, no ha dicho nada: el gate
// anti-anglófono del lote 18 llevaba una condición inalcanzable, no
// marcaba jamás, y el lote imprimía «Limpio» exactamente igual. Por eso
// aquí hay DOS sondas por gate — la que lo pasa con nota máxima y la que
// lo suspende —, y la que lo suspende va primero.
//
// Lo que el gate garantiza: `Vreau să vină fratele meu` es rumano
// correcto y es la otra salida de estos ítems. La comparación de la
// tarjeta es exacta, así que una alternativa no declarada le pone «mal»
// a un alumno que escribió bien. El gate no lo pide como norma: lo
// CONSTRUYE desde la propia buena y comprueba que está declarado.
import { describe, it, expect } from 'vitest';
import { verificar, sujetoPospuesto, ITEMS } from '../../scripts/lotes/corr-ro-b1c';
import type { ItemCorreccion } from '../../scripts/lib/correccion';

const base = { pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false, p: 'r8-completivas-ca-sa' } as const;
const EXPL = 'El sujeto no cabe entre la partícula «să» y el verbo, así que sale delante y la subordinada se abre con «ca».';
const SONDA = {
  ...base,
  mala: 'Aștept să colegii mei termine raportul.',
  buena: 'Aștept ca colegii mei să termine raportul.',
  calcoEs: 'Espero que mis colegas terminen el informe.',
  explicacion: EXPL,
} satisfies ItemCorreccion;
const FALTA = /falta en «alt» el sujeto pospuesto/;
const caza = (x: ItemCorreccion) => verificar([x]).some((s) => FALTA.test(s));

describe('el gate del sujeto pospuesto DICE QUE NO', () => {
  it('SUSPENDE al ítem que no declara la alternativa correcta', () => {
    expect(caza(SONDA)).toBe(true);
  });
  it('SUSPENDE también al que declara otra alternativa cualquiera', () => {
    expect(caza({ ...SONDA, alt: ['Aștept ca ei să termine raportul.'] })).toBe(true);
  });
  it('APRUEBA al que la declara — el mismo ítem con nota máxima', () => {
    expect(caza({ ...SONDA, alt: ['Aștept să termine colegii mei raportul.'] })).toBe(false);
  });
});

describe('la construcción de la alternativa, no la norma escrita', () => {
  it('saca el sujeto de detrás de «ca» y lo pone detrás del verbo', () => {
    expect(sujetoPospuesto('Aștept ca prietenii mei să sosească la timp.'))
      .toBe('Aștept să sosească prietenii mei la timp.');
  });
  it('devuelve null cuando la buena no tiene el molde, en vez de inventar una frase', () => {
    // Lo que costó `temaInfinitivo()`: un fallback que devuelve algo
    // plausible en vez de nada no explota, y la frase mala se publica.
    expect(sujetoPospuesto('Vreau să vin mâine.')).toBe(null);
  });
});

describe('los cinco del lote', () => {
  it('pasan todos los gates: 5 de r8-completivas-ca-sa y 8 de r8-relativas-pe-care', () => {
    expect(verificar(ITEMS)).toEqual([]);
    expect(ITEMS.filter((x) => x.p === 'r8-completivas-ca-sa').length).toBe(5);
    expect(ITEMS.filter((x) => x.p === 'r8-relativas-pe-care').length).toBe(8);
    expect(ITEMS.length).toBe(13);
  });
});

// ── LOS GATES DE `r8-relativas-pe-care`, EN ROJO PRIMERO ──────────────
//
// El testigo rojo del primero NO es un ítem inventado: son los CUATRO
// ítems que estaban PUBLICADOS y que el lingüista tumbó. Un gate que se
// escribe después del hallazgo tiene que cazar el hallazgo, y si no lo
// caza es decorativo.
import { desnudar, tercerasPersonas, fueraDeLaRelativa } from '../../scripts/lotes/corr-ro-b1c';

const REL = 'r8-relativas-pe-care';
const rel = (mala: string, buena: string, inf: string, alt?: string[]): ItemCorreccion & { inf: string } => ({
  ...base, p: REL, inf, mala, buena, alt,
  calcoEs: 'El hombre que vi ayer es mi vecino.',
  explicacion: 'El relativo objeto pide la marca «pe» delante de «care» y el clítico que lo repite junto al verbo; el español no tiene ninguna de las dos piezas.',
});
const marca = (x: ItemCorreccion, re: RegExp) => verificar([x]).some((s) => re.test(s));

describe('la mala RESUMPTIVA, que es habla rumana real y estaba publicada', () => {
  // Las cuatro malas de los ítems retirados el 2026-09-03, tal cual.
  const PUBLICADOS: [string, string, string][] = [
    ['Omul care l-am văzut ieri este vecinul meu.', 'Omul pe care l-am văzut ieri este vecinul meu.', 'a vedea'],
    ['Cartea care am citit-o astă-vară era foarte lungă.', 'Cartea pe care am citit-o astă-vară era foarte lungă.', 'a citi'],
    ['Fata care o aștept este sora mea.', 'Fata pe care o aștept este sora mea.', 'a aștepta'],
    ['Studenții care i-am ajutat au trecut examenul.', 'Studenții pe care i-am ajutat au trecut examenul.', 'a citi'],
  ];
  it('los CUATRO retirados quedan suspendidos por el gate del clítico', () => {
    for (const [mala, buena, inf] of PUBLICADOS)
      expect(marca(rel(mala, buena, inf), /relativa RESUMPTIVA/), mala).toBe(true);
  });
  it('y los ocho del lote NO lo activan', () => {
    for (const x of ITEMS.filter((i) => i.p === REL))
      expect(marca(x, /relativa RESUMPTIVA/), x.mala).toBe(false);
  });
});

describe('la corrección es EXACTAMENTE «pe» + clítico', () => {
  it('SUSPENDE cuando la buena cambia además otra cosa', () => {
    expect(marca(rel('Omul care am văzut ieri este vecinul meu.',
      'Omul pe care l-am văzut ieri era vecinul meu.', 'a vedea'), /que no es la mala/)).toBe(true);
  });
  it('SUSPENDE la mala resumptiva también por aquí (no puede ser el desnudo de su buena)', () => {
    expect(marca(rel('Omul care l-am văzut ieri este vecinul meu.',
      'Omul pe care l-am văzut ieri este vecinul meu.', 'a vedea'), /que no es la mala/)).toBe(true);
  });
  it('APRUEBA el par que sólo se diferencia en las dos piezas', () => {
    expect(marca(rel('Omul care am văzut ieri este vecinul meu.',
      'Omul pe care l-am văzut ieri este vecinul meu.', 'a vedea',
      ['Omul pe care l-am văzut ieri e vecinul meu.']), /que no es la mala/)).toBe(false);
  });
  it('desnudar quita las dos piezas y nada más', () => {
    expect(desnudar('Omul pe care l-am văzut ieri este vecinul meu.')).toBe('Omul care am văzut ieri este vecinul meu.');
    expect(desnudar('Cartea pe care am citit-o astă-vară era foarte lungă.')).toBe('Cartea care am citit astă-vară era foarte lungă.');
    expect(desnudar('Fata pe care o aștept este sora mea.')).toBe('Fata care aștept este sora mea.');
    expect(desnudar('Filmul pe care îl vedem acum este nou.')).toBe('Filmul care vedem acum este nou.');
  });
  it('y NO se come una palabra que sólo se parece a un clítico', () => {
    // `le` es clítico, pero `lecția` no. Si el borrado fuera por prefijo,
    // esto saldría mal y nadie lo vería: la buena quedaría descabezada.
    expect(desnudar('Fata pe care o vedem acolo este sora mea.')).toBe('Fata care vedem acolo este sora mea.');
    expect(desnudar('Omul pe care îl caut lucrează aici.')).toBe('Omul care caut lucrează aici.');
  });
});

describe('el paradigma preguntado: el sincretismo que haría CORRECTA a la mala', () => {
  it('SUSPENDE «Colegii care cunosc», donde «cunosc» es también 3.ª plural', () => {
    // `a cunoaște` no está en el lexicón A1, así que el sincretismo se
    // demuestra con uno que sí: `a vedea` hace `văd` en 1.ª sg Y 3.ª pl.
    expect(marca(rel('Oamenii care văd bine nu poartă ochelari.',
      'Oamenii pe care îi văd bine nu poartă ochelari.', 'a vedea'), /se leería como SUJETO/)).toBe(true);
  });
  it('APRUEBA «Colegii care așteptăm», donde la 3.ª plural es «așteaptă»', () => {
    expect(marca(rel('Colegii care așteptăm vin cu trenul.',
      'Colegii pe care îi așteptăm vin cu trenul.', 'a aștepta'), /se leería como SUJETO/)).toBe(false);
  });
  it('SUSPENDE al ítem que no declara su lema, en vez de callar', () => {
    const { inf, ...sinLema } = rel('Omul care am văzut ieri este vecinul meu.',
      'Omul pe care l-am văzut ieri este vecinul meu.', 'a vedea');
    expect(marca(sinLema as ItemCorreccion, /no declara «inf»/)).toBe(true);
  });
  it('las 3.ª personas salen del paradigma, no de una lista escrita a mano', () => {
    expect(tercerasPersonas('a vedea')).toEqual(expect.arrayContaining(['vede', 'văd', 'a văzut', 'au văzut']));
    expect(tercerasPersonas('a inventar')).toEqual([]);
  });
});

describe('la principal en 3.ª persona: la lectura APOSITIVA que resucita la mala', () => {
  // El contraejemplo es del lingüista: «noi, colegii, care așteptăm,
  // suntem obosiți» es rumano correcto. Si la principal se pone en 1.ª,
  // la mala del ítem deja de ser mala y el ítem muere en silencio.
  it('SUSPENDE cuando la principal va en 1.ª plural', () => {
    expect(marca(rel('Colegii care așteptăm venim cu trenul.',
      'Colegii pe care îi așteptăm venim cu trenul.', 'a aștepta'), /tiene que ir en 3\.ª/)).toBe(true);
  });
  it('SUSPENDE cuando hay un pronombre de 1.ª que licencia la aposición', () => {
    expect(marca(rel('Noi, colegii care așteptăm, stăm aici.',
      'Noi, colegii pe care îi așteptăm, stăm aici.', 'a aștepta'), /lectura APOSITIVA/)).toBe(true);
  });
  it('APRUEBA la principal en 3.ª — los ocho del lote', () => {
    for (const x of ITEMS.filter((i) => i.p === REL))
      expect(marca(x, /lectura APOSITIVA|tiene que ir en 3\.ª/), x.mala).toBe(false);
  });
  it('y NO marca por SINCRETISMO: «sunt» y «vin» son también 3.ª plural', () => {
    // Si el gate contara toda forma de 1.ª, marcaría cuatro de los ocho
    // ítems por ruido — y un gate que marca medio lote nadie lo lee.
    expect(fueraDeLaRelativa('Florile care cumpăr sunt pentru mama.')).toContain('sunt');
    expect(marca(rel('Florile care cumpăr sunt pentru mama.',
      'Florile pe care le cumpăr sunt pentru mama.', 'a cumpăra'), /3\.ª|APOSITIVA/)).toBe(false);
  });
  it('deja fuera el verbo de la RELATIVA, que es de 1.ª por diseño', () => {
    expect(fueraDeLaRelativa('Colegii care așteptăm vin cu trenul.')).toEqual(['Colegii', 'vin', 'cu', 'trenul']);
  });
});

// Los gates del lote 17 (cloze B1: conjuntivo, conjuntivo perfecto,
// gerunziu), CADA UNO contra un caso que DEBE cazar.
//
// El que justifica el fichero entero es el del gerunziu: su v0 preguntaba
// «¿está guardado?» y se leía como «¿el tema alterna?». No es la misma
// frase — 2.ª y 3.ª conjugación se guardan ENTERAS por clase, así que
// `a merge` y `a scrie` tienen `ger` y la regla los acierta igual —, y el
// gate marcaba 4 donde hay 2. Habría obligado a sacar del lote justamente
// `scriind`, que es el ítem que SOSTIENE el punto.
import { describe, it, expect } from 'vitest';
import { verificar, ITEMS } from '../../scripts/lotes/cloze-ro-b1';
import type { ClozeRo } from '../../scripts/lotes/cloze-ro-a1';
import { gerAlterna, gerunziuPorRegla } from '../../scripts/lib/paradigma-ro';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';

const caza = (items: ClozeRo[], re: RegExp) => verificar(items).some((s) => re.test(s));
const V = (inf: string) => VERBOS_A1.find((v) => v.inf === inf)!;

describe('r7-conjuntivo-presente', () => {
  const base = { p: 'r7-conjuntivo-presente', t: 'conjuntivo', transparenteLatin: false } as const;

  // EL GATE DEL PUNTO: no se declara qué verbos divergen, se RECALCULA.
  it('caza el verbo cuyo conjuntivo COINCIDE con el indicativo (a ști → să știe)', () => {
    expect(caza([{ ...base, inf: 'a ști', per: 'el', s: 'Vreau ca el să ___ (a ști) adevărul.', pista: 'saber — conjuntivo, 3.ª persona', ancla: 'ca el să' }],
      /IGUAL que el indicativo/)).toBe(true);
  });
  it('y los otros tres que el inventario nombra como no construibles, EN SINGULAR', () => {
    for (const [inf, gl] of [['a lua', 'tomar'], ['a vrea', 'querer'], ['a scrie', 'escribir']] as const)
      expect(caza([{ ...base, inf, per: 'el', s: `Vreau ca el să ___ (${inf}) asta.`, pista: `${gl} — conjuntivo, 3.ª persona`, ancla: 'ca el să' }],
        /IGUAL que el indicativo/), inf).toBe(true);
  });

  // LA CORRECCIÓN QUE ABRE CONTENIDO. La coincidencia de esos cuatro es
  // sólo del SINGULAR: contra la 3.ª plural (iau, vor, știu, scriu) las
  // cuatro divergen. La v0 del gate comparaba siempre contra
  // `presente(v,'el')` y habría cerrado la casilla plural contestando por
  // la casilla equivocada.
  it('pero en 3.ª PLURAL esos mismos cuatro divergen y el gate NO los cierra', () => {
    for (const [inf, gl] of [['a lua', 'tomar'], ['a vrea', 'querer'], ['a ști', 'saber'], ['a scrie', 'escribir']] as const)
      expect(caza([{ ...base, inf, per: 'ei', s: `Nu vreau ca ei să ___ (${inf}) asta.`, pista: `${gl} — conjuntivo, 3.ª persona`, ancla: 'ca ei să' }],
        /IGUAL que el indicativo/), inf).toBe(false);
  });
  it('y NO se dispara con los que sí divergen', () => {
    expect(caza([{ ...base, inf: 'a merge', per: 'el', s: 'Vreau ca el să ___ (a merge) acolo.', pista: 'ir — conjuntivo, 3.ª persona', ancla: 'ca el să' }],
      /IGUAL que el indicativo/)).toBe(false);
  });

  it('caza el hueco que se tragaría el «să» (mediría también r3-sa-vs-infinitivo)', () => {
    expect(caza([{ ...base, inf: 'a merge', per: 'el', s: 'Vreau ca el ___ (a merge) acolo.', pista: 'ir — conjuntivo, 3.ª persona', ancla: 'ca el' }],
      /no va precedido de «să»/)).toBe(true);
  });
  it('caza la persona fuera de la 3.ª, donde no hay divergencia que examinar', () => {
    expect(caza([{ ...base, inf: 'a merge', per: 'eu', s: 'Vreau ca eu să ___ (a merge) acolo.', pista: 'ir — conjuntivo, 1.ª persona', ancla: 'ca eu să' }],
      /fuera de la 3\.ª/)).toBe(true);
  });
  it('caza la frase sin sujeto explícito entre «ca» y «să»: el hueco admitiría otra persona', () => {
    expect(caza([{ ...base, inf: 'a merge', per: 'el', s: 'Trebuie să ___ (a merge) acum la gară.', pista: 'ir — conjuntivo, 3.ª persona', ancla: 'Trebuie să' }],
      /sin sujeto explícito/)).toBe(true);
  });
});

describe('la regla ingenua «-e → -ă», contada y no supuesta', () => {
  const c = (inf: string, per: 'el' | 'ei', s: string): ClozeRo =>
    ({ p: 'r7-conjuntivo-presente', inf, per, t: 'conjuntivo', s, pista: 'x — conjuntivo, 3.ª persona', ancla: 'ca el să', transparenteLatin: false });
  it('caza el lote donde la regla que el proyecto sabe FALSA acierta demasiadas veces', () => {
    // facă, poată y vină salen bien con «-e → -ă»: un lote hecho sólo de
    // ésos se acierta aplicando la regla mala, sin aprender nada.
    const soloIngenuos = [
      c('a face', 'el', 'E posibil ca el să ___ (a face) asta.'),
      c('a putea', 'el', 'Sper ca el să ___ (a putea) veni.'),
      c('a veni', 'el', 'Trebuie ca el să ___ (a veni) acum.'),
      c('a face', 'ei', 'Vreau ca ei să ___ (a face) curat.'),
    ];
    expect(caza(soloIngenuos, /sobreviven a la regla ingenua/)).toBe(true);
  });
  it('y NO se dispara en el lote publicado, donde sobreviven cinco de ocho', () => {
    expect(caza(ITEMS, /sobreviven a la regla ingenua/)).toBe(false);
  });
});

describe('la anterioridad anclada en la FRASE y no en la etiqueta', () => {
  it('caza el conjuntivo perfecto sin ancla, donde el presente cabe y es correcto', () => {
    expect(caza([{ p: 'r7-conjuntivo-perfecto', inf: 'a spune', t: 'conjuntivo-perfecto', transparenteLatin: false,
      s: 'E puțin probabil ca ea să ___ (a spune) așa ceva.', pista: 'decir — conjuntivo perfecto', ancla: 'ca ea să' }],
      /sin ancla de anterioridad/)).toBe(true);
  });
  it('caza el conjuntivo PRESENTE que lleva un ancla, donde cabría el perfecto', () => {
    expect(caza([{ p: 'r7-conjuntivo-presente', inf: 'a merge', per: 'el', t: 'conjuntivo', transparenteLatin: false,
      s: 'E posibil ca el să ___ (a merge) deja acasă.', pista: 'ir — conjuntivo, 3.ª persona', ancla: 'ca el să' }],
      /ancla de anterioridad y el ítem pide el conjuntivo PRESENTE/)).toBe(true);
  });
});

describe('r7-conjuntivo-perfecto', () => {
  const base = { p: 'r7-conjuntivo-perfecto', t: 'conjuntivo-perfecto', transparenteLatin: false } as const;

  it('caza la respuesta que conjuga «fi», que es justo el error diana del punto', () => {
    expect(caza([{ ...base, inf: 'a merge', r: 'fie mers', s: 'E posibil ca el să ___ (a merge) acolo.', pista: 'ir — conjuntivo perfecto', ancla: 'ca el să' }],
      /no empieza por «fi»/)).toBe(true);
  });
  it('caza la forma conjugada de «a fi» escrita en la frase, que el alumno copiaría', () => {
    expect(caza([{ ...base, inf: 'a merge', s: 'E posibil ca el să ___ (a merge) și să fie obosit.', pista: 'ir — conjuntivo perfecto', ancla: 'ca el să' }],
      /forma conjugada de «a fi»/)).toBe(true);
  });
  it('caza el participio ya escrito en la frase', () => {
    expect(caza([{ ...base, inf: 'a merge', s: 'A mers mult; e posibil ca el să ___ (a merge) pe jos.', pista: 'ir — conjuntivo perfecto', ancla: 'e posibil ca el să' }],
      /participio «mers» ya está en la frase/)).toBe(true);
  });
});

describe('r7-gerunziu', () => {
  const g = (inf: string, s: string, pista: string, ancla: string): ClozeRo =>
    ({ p: 'r7-gerunziu', inf, t: 'gerunziu', s, pista, ancla, transparenteLatin: false });
  const SOLO_AND = [
    g('a merge', '___ (a merge) pe stradă, l-am văzut.', 'ir — gerundio', 'pe stradă'),
    g('a pleca', '___ (a pleca) devreme, am prins trenul.', 'irse — gerundio', 'devreme'),
    g('a face', '___ (a face) curat, am găsit poza.', 'hacer — gerundio', 'curat'),
    g('a vedea', '___ (a vedea) că plouă, am luat umbrela.', 'ver — gerundio', 'că plouă'),
  ];

  it('caza el lote que sólo tiene una desinencia: enseñaría una regla falsa por omisión', () => {
    expect(caza(SOLO_AND, /hacen falta al menos dos de cada/)).toBe(true);
  });
  it('caza la falta del caso que contradice la conjugación POR ABAJO (a scrie, de 3.ª, con -ind)', () => {
    expect(caza(SOLO_AND, /por abajo/)).toBe(true);
  });
  it('caza la falta del caso que la contradice POR ARRIBA (a coborî, de -î, con -ând)', () => {
    expect(caza(SOLO_AND, /por arriba/)).toBe(true);
  });
  it('caza el hueco detrás de la cópula, que es el progresivo calcado (r7-anti-progresivo)', () => {
    expect(caza([g('a merge', 'El este ___ (a merge) pe stradă acum.', 'ir — gerundio', 'El este')],
      /progresivo calcado/)).toBe(true);
  });

  // LA DISTINCIÓN QUE EL GATE v0 NO SABÍA HACER.
  it('«guardado» y «alternante» NO son la misma pregunta', () => {
    // Los cuatro están guardados (2.ª y 3.ª se guardan por clase)…
    for (const inf of ['a merge', 'a scrie', 'a face', 'a vedea']) expect(V(inf).ger, inf).toBeTruthy();
    // …y sólo dos ALTERNAN de verdad: la regla sola acierta los otros dos.
    expect(gerunziuPorRegla(V('a merge'))).toBe('mergând');
    expect(gerunziuPorRegla(V('a scrie'))).toBe('scriind');
    expect(gerunziuPorRegla(V('a face'))).toBe('facând');   // la regla sola falla
    expect(gerunziuPorRegla(V('a vedea'))).toBe('vedând');  // la regla sola falla
    expect(gerAlterna(V('a merge'))).toBe(false);
    expect(gerAlterna(V('a scrie'))).toBe(false);
    expect(gerAlterna(V('a face'))).toBe(true);
    expect(gerAlterna(V('a vedea'))).toBe(true);
  });

  // COBERTURA DECLARADA: la rama «más de dos alternantes» NO puede
  // ejercitarse, porque el lexicón A1 sólo tiene DOS verbos con gerunziu
  // alternante (a face, a vedea). Se dice en vez de fingir que está
  // probada; el día que entre un tercero (a crede → crezând), este test
  // es el sitio donde escribirlo.
  it('el lexicón A1 sólo tiene dos gerundios alternantes, así que esa rama no está ejercitada', () => {
    expect(VERBOS_A1.filter(gerAlterna).map((v) => v.inf).sort()).toEqual(['a face', 'a vedea']);
  });
});

describe('el lote publicado', () => {
  it('sale limpio y con los 24 ítems repartidos 8/8/8', () => {
    expect(verificar(ITEMS)).toEqual([]);
    for (const p of ['r7-conjuntivo-presente', 'r7-conjuntivo-perfecto', 'r7-gerunziu'])
      expect(ITEMS.filter((x) => x.p === p).length, p).toBe(8);
  });
});

// Los gates del lote 18, cada uno contra EL ÍTEM QUE LO PASABA CON NOTA
// MÁXIMA. Los cinco sondas son literalmente los que el lingüista usó para
// demostrar que cuatro de cinco gates contestaban otra pregunta y el
// quinto no disparaba nunca.
//
// El caso que justifica el fichero: el gate anti-anglófono —el que el
// inventario declara como la lección de `a asista la`— llevaba un
// `!saAdyacente` que se satisface con cualquier «să» + verbo, o sea con
// TODAS las malas. La condición era inalcanzable: el gate estaba muerto,
// no invertido, y el lote salía «Limpio» igual.
import { describe, it, expect } from 'vitest';
import { verificar, ITEMS } from '../../scripts/lotes/corr-ro-b1';
import type { ItemCorreccion } from '../../scripts/lib/correccion';

const base = { pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false } as const;
const caza = (item: ItemCorreccion, re: RegExp) => verificar([item]).some((s) => re.test(s));
const EXPL = 'El regente selecciona el complementante y el sujeto no cabe entre la partícula y el verbo.';
// Todos los sondas declaran `transparenteLatin`: desde el lote 18 es gate
// del formato y «no declarado» no es «limpio».

describe('el gate anti-anglófono, que estaba MUERTO', () => {
  it('caza «Vreau el să vină», que es la mala que este lote existe para prohibir', () => {
    expect(caza({ ...base, p: 'r8-completivas-ca-sa', mala: 'Vreau el să vină mâine la birou.',
      buena: 'Vreau ca el să vină mâine la birou.', calcoEs: 'Quiero que él venga mañana a la oficina.', explicacion: EXPL },
      /error de ANGLÓFONO/)).toBe(true);
  });
  it('y NO toca los tres ítems del lote, cuyo pronombre precede al VERBO y no a «să»', () => {
    for (const x of ITEMS.filter((i) => i.p === 'r8-completivas-ca-sa'))
      expect(caza(x, /error de ANGLÓFONO/), x.mala).toBe(false);
  });
});

describe('el sujeto interpuesto: la v0 daba por mala una frase que el lote da por buena', () => {
  it('caza como no-mala «Vreau să vină el», que es el `alt` DECLARADO del ítem 1', () => {
    expect(caza({ ...base, p: 'r8-completivas-ca-sa', mala: 'Vreau să vină el mâine la birou.',
      buena: 'Vreau ca el să vină mâine la birou.', calcoEs: 'Quiero que venga él mañana.', explicacion: EXPL },
      /no hay sujeto interpuesto/)).toBe(false);
    // «vină» no es campo preverbal, así que el gate del sujeto no lo salva;
    // lo que sí tiene que decir es que ahí no hay nada interpuesto.
    expect(verificar([{ ...base, p: 'r8-completivas-ca-sa', mala: 'Vreau să vină el mâine la birou.',
      buena: 'Vreau ca el să vină mâine la birou.', calcoEs: 'Quiero que venga él mañana.', explicacion: EXPL }]).length)
      .toBeGreaterThan(0);
  });
  it('caza el campo preverbal legítimo: «să mai stau» no lleva sujeto interpuesto', () => {
    expect(caza({ ...base, p: 'r8-completivas-ca-sa', mala: 'Vreau să mai stau puțin aici.',
      buena: 'Vreau ca el să mai stea puțin aici.', calcoEs: 'Quiero quedarme un poco más.', explicacion: EXPL },
      /campo preverbal legítimo/)).toBe(true);
  });
  it('caza la FINAL disfrazada de completiva («Am venit ca ei să nu fie singuri»)', () => {
    expect(caza({ ...base, p: 'r8-completivas-ca-sa', mala: 'Am venit ca să ei nu fie singuri.',
      buena: 'Am venit ca să nu fie singuri.', calcoEs: 'He venido para que no estén solos.', explicacion: EXPL },
      /sería la final|es una final/)).toBe(true);
  });
});

describe('la allowlist de regentes: la v0 era una denylist disfrazada', () => {
  it('caza «Promit că vin», donde las DOS rigen y la mala es lengua correcta', () => {
    expect(caza({ ...base, p: 'r7-disparadores-sa', mala: 'Promit că vin mâine la birou.',
      buena: 'Promit să vin mâine la birou.', calcoEs: 'Prometo que vengo mañana a la oficina.', explicacion: EXPL },
      /no está en la allowlist/)).toBe(true);
  });
  it('y deja pasar los dos del lote, cuyos regentes sí seleccionan «să»', () => {
    for (const x of ITEMS.filter((i) => i.p === 'r7-disparadores-sa'))
      expect(caza(x, /no está en la allowlist/), x.mala).toBe(false);
  });
});

describe('el progresivo: la v0 buscaba las dos formas en CUALQUIER parte de la frase', () => {
  // LA MORFOLOGÍA VA DADA: la corrección sólo puede BORRAR.
  it('caza la buena que introduce una palabra que no está en la mala', () => {
    expect(caza({ ...base, p: 'r7-anti-progresivo', transparenteLatin: false,
      mala: 'Sunt citind o carte foarte bună.', buena: 'Citesc o carte foarte bună.',
      calcoEs: 'Estoy leyendo un libro muy bueno.', explicacion: EXPL },
      /tendría que PRODUCIR la forma del presente/)).toBe(true);
  });
  it('y NO se dispara en los seis reescritos, que traen la forma en la propia frase', () => {
    for (const x of ITEMS.filter((i) => i.p === 'r7-anti-progresivo'))
      expect(caza(x, /tendría que PRODUCIR/), x.mala).toBe(false);
  });

  it('caza «vin alergând», predicación depictiva lícita con verbo de movimiento', () => {
    expect(caza({ ...base, p: 'r7-anti-progresivo', mala: 'E cald, iar copiii vin alergând.',
      buena: 'E cald, iar copiii vin repede.', calcoEs: 'Hace calor y los niños vienen corriendo.', explicacion: EXPL },
      /no lleva el indicativo de «a fi» PEGADO/)).toBe(true);
  });
  it('caza «plec fugind», que también pasaba limpio', () => {
    expect(caza({ ...base, p: 'r7-anti-progresivo', mala: 'Nu e nimic, plec fugind spre casă.',
      buena: 'Nu e nimic, plec repede spre casă.', calcoEs: 'No es nada, me voy corriendo a casa.', explicacion: EXPL },
      /no lleva el indicativo de «a fi» PEGADO/)).toBe(true);
  });
  it('caza el gerundio lexicalizado como adjetivo, donde «este + -ând» es correcto', () => {
    expect(caza({ ...base, p: 'r7-anti-progresivo', mala: 'Bunicul este suferind de mult timp.',
      buena: 'Bunicul suferă de mult timp.', calcoEs: 'El abuelo está sufriendo desde hace mucho.', explicacion: EXPL },
      /lexicalizado como ADJETIVO/)).toBe(true);
  });
  it('y muerde los seis del lote', () => {
    for (const x of ITEMS.filter((i) => i.p === 'r7-anti-progresivo'))
      expect(caza(x, /no lleva el indicativo de «a fi» PEGADO/), x.mala).toBe(false);
  });
});

describe('el lote publicado', () => {
  it('sale limpio y reparte 2 + 3 + 6', () => {
    expect(verificar(ITEMS)).toEqual([]);
    const n = (p: string) => ITEMS.filter((x) => x.p === p).length;
    expect(n('r7-disparadores-sa')).toBe(2);
    expect(n('r8-completivas-ca-sa')).toBe(3);
    expect(n('r7-anti-progresivo')).toBe(6);
  });
  it('la cópula suelta declara su contraparte, que la tarjeta compara EXACTO', () => {
    const x = ITEMS.find((i) => i.buena.startsWith('E important'))!;
    expect(x.alt).toContain('Este important ca copiii să doarmă opt ore.');
  });
  it('y la tercera salida que la propia explicación enseña está declarada', () => {
    const x = ITEMS.find((i) => i.p === 'r7-anti-progresivo' && i.buena.startsWith('De obicei'))!;
    expect(x.alt).toContain('De obicei mănânc la ora unu, dar azi stau și mănânc mai devreme.');
  });
});

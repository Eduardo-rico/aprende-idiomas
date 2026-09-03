// La pasada de VARIANZA, vista en rojo antes que en verde.
//
// El instrumento existe porque el lote 19 escribió ocho ítems de
// `r8-relativas-pe-care` impecables uno por uno —las ocho buenas
// correctas, las ocho malas verificadas imparseables— y el conjunto no
// medía su punto: insertar `pe` era INVARIANTE en los ocho, así que se
// aprendía en el primero y a partir del segundo lo único que discriminaba
// era el clítico, que es OTRO punto. **No es propiedad de ningún ítem:
// es propiedad del conjunto**, y por eso ningún gate por ítem podía
// verlo.
import { describe, it, expect } from 'vitest';
import { operacionDe, varianzaDe, puntosConRasgoInvariante } from '../../scripts/lib/varianza';

const corr = (sentence: string, correct: string) => ({ type: 'error_correction', data: { sentence, correct } });
const cloze = (answer: string) => ({ type: 'fill_blank', data: { blanks: [{ answer }] } });

describe('la operación que el ítem pide', () => {
  it('en corrección es el DIFF, no la frase', () => {
    expect(operacionDe(corr('Am douăzeci ani.', 'Am douăzeci de ani.'))).toEqual(['+de']);
    expect(operacionDe(corr('Omul care aștept este vecinul meu.', 'Omul pe care îl aștept este vecinul meu.')))
      .toEqual(['+pe', '+îl']);
  });
  it('devuelve null en el formato que no sabe leer, en vez de un número plausible', () => {
    expect(operacionDe({ type: 'mediation', data: {} })).toBe(null);
  });
});

describe('DICE QUE NO: el punto cuya operación no varía', () => {
  it('caza los ocho ítems que piden lo mismo', () => {
    const v = varianzaDe('p', Array.from({ length: 8 }, (_, i) => corr(`Am ${i} ani.`, `Am ${i} de ani.`)));
    expect(v.distintas).toBe(1);
    expect(v.invariantes).toEqual([{ pieza: '+de', en: 8 }]);
    expect(v.variable).toEqual([]);
    expect(v.medido).toBe(true);
  });
  it('y separa la parte CONSTANTE de la variable cuando hay las dos — el caso del lote 19', () => {
    const v = varianzaDe('p', [
      corr('Omul care aștept e vecinul meu.', 'Omul pe care îl aștept e vecinul meu.'),
      corr('Fata care aștept e sora mea.', 'Fata pe care o aștept e sora mea.'),
    ]);
    expect(v.invariantes.map((i) => i.pieza)).toEqual(['+pe']); // el diana: no discrimina
    expect(v.variable).toEqual(['+o', '+îl']);                  // lo que discrimina: otro punto
  });
  it('APRUEBA al punto cuya operación varía de verdad', () => {
    const v = varianzaDe('p', [cloze('casei'), cloze('fetei'), cloze('mesei')]);
    expect(v.distintas).toBe(3);
    expect(v.invariantes).toEqual([]);
  });
});

describe('«no medido» NO es «cobertura 1» — el bug que tuvo la v0', () => {
  // La v0 devolvía `distintas: 0` para un punto entero de mediación y el
  // informe lo listaba como «operación idéntica en todos». Ni error ni
  // cero: el número de al lado. Es la clase que este proyecto ya tiene
  // escrita como la más cara.
  it('marca el punto ilegible como NO MEDIDO, no como invariante', () => {
    const v = varianzaDe('p', Array.from({ length: 8 }, () => ({ type: 'mediation', data: {} })));
    expect(v.medido).toBe(false);
    expect(v.sinLeer).toBe(8);
  });
  it('y un punto medio legible sí se mide, contando los que no pudo leer', () => {
    const v = varianzaDe('p', [cloze('casei'), { type: 'mediation', data: {} }]);
    expect(v.medido).toBe(true);
    expect(v.sinLeer).toBe(1);
  });
});

describe('el umbral del 80 % y el suelo de 4 ítems', () => {
  it('marca la pieza que está en 7 de 8 — el caso de `r4-gd-lui-formula`', () => {
    const xs = [...Array(7).keys()].map((i) => corr(`Casa de X${i}.`, `Casa lui X${i}.`));
    xs.push(corr('Biroul lui domnul Popescu.', 'Biroul domnului Popescu.'));
    const v = varianzaDe('p', xs);
    expect(v.invariantes.map((i) => i.pieza).sort()).toEqual(['+lui', '-de']);
  });
  it('NO marca un punto de tres ítems, donde «el 80 %» no dice nada', () => {
    const m = new Map([['p', [corr('a b.', 'a de b.'), corr('c d.', 'c de d.'), corr('e f.', 'e de f.')]]]);
    expect(puntosConRasgoInvariante(m)).toEqual([]);
  });
  it('y NO devuelve como invariante un punto que sólo tiene ítems ilegibles', () => {
    const m = new Map([['p', Array.from({ length: 8 }, () => ({ type: 'mediation', data: {} }))]]);
    expect(puntosConRasgoInvariante(m)).toEqual([]);
  });
});

// ── EL INVARIANTE SOBRE EL CORPUS REAL ───────────────────────────────
// «Cero puntos marcados sin juicio escrito», que es la forma del
// `pisoCero` y la de la cuarentena: la señal no decide nada por sí sola
// —marcaría `r3-negacion-antepuesta`, donde la invariancia es propiedad
// de la LENGUA—, así que lo que se exige no es un número sino que nadie
// pueda quedarse callado.
describe('el corpus rumano: ningún punto marcado sin juicio escrito', () => {
  it('los siete marcados llevan su juicio en el inventario', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { PUNTOS_RO } = await import('@/lib/data/languages/ro/inventario-puntos');
    const dir = path.join(process.cwd(), 'lib/data/languages/ro/blocks');
    const items = fs.readdirSync(dir).filter((f) => /^b\d+\.json$/.test(f))
      .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as any[]);
    const porPunto = new Map<string, any[]>();
    for (const x of items.filter((i) => i?.variantStatus !== 'needs-human'))
      for (const c of ((x.concepts ?? []) as string[])) { const g = porPunto.get(c) ?? []; g.push(x); porPunto.set(c, g); }
    const marcados = puntosConRasgoInvariante(porPunto);
    // Si esto baja a 0 es porque alguien los arregló de verdad, y entonces
    // el test debe fallar para que se retire la línea a conciencia en vez
    // de dejar un invariante vigilando el vacío.
    expect(marcados.length).toBeGreaterThan(0);
    const juicio = new Map(PUNTOS_RO.map((p) => [p.id, p.varianza]));
    const mudos = marcados.filter((v) => !String(juicio.get(v.punto) ?? '').trim()).map((v) => v.punto);
    expect(mudos, `marcados sin juicio escrito: ${mudos.join(', ')}`).toEqual([]);
  });
  it('y el juicio dice si es DEFECTO o LEGÍTIMO, no una frase cualquiera', async () => {
    const { PUNTOS_RO } = await import('@/lib/data/languages/ro/inventario-puntos');
    const conJuicio = PUNTOS_RO.filter((p) => p.varianza);
    expect(conJuicio.length).toBeGreaterThan(0);
    for (const p of conJuicio)
      expect(/^(LEGÍTIMO|INSTANCIA REAL|PARCIAL)/.test(p.varianza!), p.id).toBe(true);
  });
});

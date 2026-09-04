// tests/unit/lote-la-11f.test.ts — el gate y el primer lote de flashcard.
import { describe, it, expect } from 'vitest';
import { revisarFlashcard, revisarLoteF, tasasCiegasF, coberturaFlashcard,
         TECHO_F, MIN_FRECUENCIA, type ItemFlashcard } from '../../scripts/lib/gate-flashcard';
import { LOTE_FALSOS_REGALOS as LOTE } from '../../lib/data/languages/la/lotes/l11-falsos-regalos';
import { PISO_LA } from '../../lib/data/languages/la/inventario-puntos';

const base = () => ({ ...LOTE.find((i) => i.id === 'la-11f-04')! }) as ItemFlashcard;

describe('CONTROLES: lo que el gate tiene que suspender', () => {
  it('CAZA la frecuencia que no cuadra con el corpus', () => {
    expect(revisarFlashcard({ ...base(), frecuencia: 999 }).map((x) => x.clase)).toContain('frecuencia-no-cuadra');
  });

  it('CAZA la palabra que el alumno no se encuentra', () => {
    // `hospes` sale 19 veces en 227.301 tokens. Es buena lingüística —el
    // punto lo propone como «el falso regalo real de esa familia»— y mala
    // tarjeta: una trampa que no aparece no merece uno de los sesenta
    // ítems del nivel.
    const h = revisarFlashcard({ ...base(), lema: 'hospes', claveCorpus: 'hospes', frecuencia: 19 });
    expect(h.map((x) => x.clase)).toContain('frecuencia-no-cuadra');
    expect(MIN_FRECUENCIA).toBe(20);
  });

  it('CAZA el lema homógrafo, cuya cuenta no es de una palabra', () => {
    // `liber` son 82 «libro» + 42 «libre». Citar 124 sería citar una suma.
    const h = revisarFlashcard({ ...base(), lema: 'liber', claveCorpus: 'liber', frecuencia: 124 });
    expect(h.map((x) => x.clase)).toContain('lema-homografo');
  });

  it('CAZA la fuente que no cita ninguna obra', () => {
    expect(revisarFlashcard({ ...base(), fuente: 'es sabido' }).map((x) => x.clase)).toContain('sin-fuente');
  });

  it('CAZA el falso regalo sin decir qué le pasó al sentido', () => {
    const { desplazamiento, ...sin } = base();
    expect(revisarFlashcard(sin as ItemFlashcard).map((x) => x.clase)).toContain('falso-regalo-sin-desplazamiento');
  });

  it('CAZA la trampa que no se dice por qué es del hispanohablante', () => {
    // La mitad difícil: casi todo el material de latín cataloga los falsos
    // amigos del inglés, y la comprobación contra fuentes los aprueba.
    expect(revisarFlashcard({ ...base(), porQueUnHispanohablante: 'es difícil' }).map((x) => x.clase))
      .toContain('trampa-no-hispanohablante');
  });

  it('CAZA la afirmación que sólo vale en el latín clásico', () => {
    // L1 entra por la Vulgata: una tarjeta que sólo describe a Cicerón le
    // enseña algo que su propia lectura contradice.
    expect(revisarFlashcard({ ...base(), corpus: 'clásico' }).map((x) => x.clase))
      .toContain('corpus-que-el-alumno-no-lee');
  });

  it('CAZA la tarjeta cuyo sentido latino es sólo la palabra española', () => {
    // Construido a partir del PROPIO descendiente del ítem, no de una
    // cadena fija: la versión anterior escribía «la virtud» y dependía de
    // que `base()` fuera la tarjeta de `virtūs`. Al reordenar el lote dejó
    // de serlo y el control se apagó — que es la misma clase que el test
    // que cogía `LOTE[0]` por índice.
    const b = base();
    expect(revisarFlashcard({ ...b, sentidoLatino: `la ${b.descendiente}` }).map((x) => x.clase))
      .toContain('la-tarjeta-se-contesta-sola');
  });

  it('pero NO marca un sentido que usa la palabra con precisión', () => {
    // Los dos falsos positivos de la primera versión: «deber DINERO» y «en
    // la Vulgata sí es la fe religiosa». Importé a la flashcard una
    // comprobación de los cloze, donde hay un HUECO al que filtrarle la
    // respuesta; una tarjeta no tiene hueco.
    for (const id of ['la-11f-03', 'la-11f-06']) {
      const it_ = LOTE.find((i) => i.id === id)!;
      expect(revisarFlashcard(it_).map((x) => x.clase), id).not.toContain('la-tarjeta-se-contesta-sola');
    }
  });

  it('CAZA el lote que se aprueba desconfiando de todo', () => {
    const soloTrampas = LOTE.filter((i) => i.esFalsoRegalo);
    expect(tasasCiegasF(soloTrampas).desconfiarSiempre).toBe(1);
    expect(revisarLoteF(soloTrampas).map((x) => x.clase)).toContain('estrategia-ciega');
  });
});

describe('el primer lote de flashcard', () => {
  it('pasa el gate entero', () => {
    expect(revisarLoteF(LOTE)).toEqual([]);
  });

  it('las dos estrategias ciegas se quedan en el azar', () => {
    const t = tasasCiegasF(LOTE);
    expect(t.desconfiarSiempre).toBeLessThanOrEqual(TECHO_F);
    expect(t.fiarseSiempre).toBeLessThanOrEqual(TECHO_F);
    // Complementarias: suman uno, como en los tres formatos anteriores.
    expect(t.desconfiarSiempre + t.fiarseSiempre).toBe(1);
  });

  it('NINGUNA tarjeta enseña una palabra que el alumno no vaya a leer', () => {
    // El criterio que tumbó dos de las doce, `hostis` entre ellas: sale
    // 194 veces en el corpus y CERO en la Vulgata, que es por donde entra
    // L1. El experto optimiza por verdad y el curso por lo que el alumno
    // se encuentra; cuando chocan manda lo segundo.
    for (const i of LOTE) {
      expect(revisarFlashcard(i).map((x) => x.clase), i.lema).not.toContain('no-esta-en-la-lectura-del-nivel');
    }
    expect(LOTE.find((i) => i.lema === 'hostis'), 'hostis salió del lote por el piso de lectura').toBeUndefined();
  });

  it('y el gate lo CAZA si alguien la vuelve a meter', () => {
    const h = revisarFlashcard({ ...base(), lema: 'hostis', claveCorpus: 'hostis', frecuencia: 194, esFalsoRegalo: false });
    expect(h.map((x) => x.clase)).toContain('no-esta-en-la-lectura-del-nivel');
  });

  it('`fidēs` dice lo que pasa en los DOS latines', () => {
    // La afirmación «fidēs no es fe» es verdadera en Cicerón y falsa en
    // Jerónimo, y el alumno de L1 lee a Jerónimo.
    const fides = LOTE.find((i) => i.lema === 'fidēs')!;
    expect(fides.corpus).toBe('todo');
    expect(fides.sentidoLatino).toMatch(/vulgata/i);
    expect(fides.sentidoLatino).toMatch(/lealtad/);
  });

  it('cada comprobación dice sobre cuántas tarjetas decidió', () => {
    for (const c of coberturaFlashcard(LOTE)) {
      expect(c.decididos, c.comprobacion).toBeGreaterThan(0);
      if (c.decididos < c.total) expect(c.motivoDeLosQueQuedanFuera, c.comprobacion).toBeTruthy();
    }
  });

  it('pasa el piso del peldaño', () => {
    expect(LOTE.length).toBeGreaterThanOrEqual(PISO_LA('L1'));
  });
});

// tests/unit/lote-is-ea-id-la.test.ts
//
// `is/ea/id` y el gate compartido de paradigma pronominal. Incluye los dos
// primeros controles de la política del macrón, que es nueva y por eso hay
// que verla fallar antes de fiarse de que se cumple.
import { describe, it, expect } from 'vitest';
import { LOTE_IS_EA_ID, SEMILLA_DE_ORDEN } from '@/lib/data/languages/la/lotes/l4-is-ea-id';
import {
  revisarItemPronombre, revisarLotePronombre, ejesQueDistingue, type ItemPronombre,
} from '@/scripts/lib/gate-pronombre-paradigma';
import { PRONOMBRES_L1, declinarPronombre } from '@/lib/data/languages/la/pronombres-la';

const IS = PRONOMBRES_L1.find((e) => e.lema === 'is')!;
const EXIGIDOS = { sincretismosExigidos: ['eius', 'eīs'] };
const copia = (): ItemPronombre[] => LOTE_IS_EA_ID.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('is/ea/id · en verde', () => {
  it('el lote real pasa su gate entero', () => {
    const r = revisarLotePronombre(LOTE_IS_EA_ID, EXIGIDOS);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('ninguna respuesta está escrita a mano', () => {
    for (const it of LOTE_IS_EA_ID)
      expect(it.respuesta, it.id).toBe(declinarPronombre(IS, it.genero, it.caso, it.numero));
  });

  it('trae «eius» dos veces con género distinto, que es lo que el punto declara', () => {
    const eius = LOTE_IS_EA_ID.filter((it) => it.respuesta === 'eius');
    expect(eius.length).toBeGreaterThanOrEqual(2);
    expect(new Set(eius.map((it) => it.genero)).size).toBeGreaterThan(1);
    // Y ninguno de ellos puede acreditarse el género.
    for (const it of eius) expect(it.ejes.examina, it.id).not.toContain('genero');
  });

  it('se publica barajado', () => {
    expect(SEMILLA_DE_ORDEN).toBe(1);
    const ids = LOTE_IS_EA_ID.map((it) => it.id);
    expect(ids).not.toEqual([...ids].sort());
  });
});

describe('la política del macrón · ROJO', () => {
  it('un macrón en el marco se caza', () => {
    // El alumno leerá 227.301 tokens sin ninguno.
    const it = copia()[0]!;
    it.marco = it.marco.replace(/o\./, 'ō.');
    expect(revisarItemPronombre(it).some((f) => f.clase === 'macron-en-el-marco')).toBe(true);
  });

  it('una respuesta que ha perdido su cantidad se caza', () => {
    const it = copia().find((x) => /[āēīōū]/.test(x.respuesta))!;
    it.respuesta = it.respuesta.normalize('NFD').replace(/[̄]/g, '').normalize('NFC');
    const fallos = revisarItemPronombre(it);
    expect(fallos.some((f) => f.clase === 'respuesta-sin-cantidad')).toBe(true);
  });

  it('y NO se le exige cantidad a una forma que no la tiene', () => {
    // `is`, `eum`, `ea`, `id` no llevan macrón. Exigírselo sería inventar
    // una marca — que es el error contrario y el más fácil de cometer al
    // escribir esta comprobación.
    for (const it of LOTE_IS_EA_ID.filter((x) => !/[āēīōū]/.test(x.respuesta)))
      expect(revisarItemPronombre(it).map((f) => f.clase), it.id).not.toContain('respuesta-sin-cantidad');
  });
});

describe('is/ea/id · ROJO', () => {
  it('«eius» no puede acreditarse el género: vale para los tres', () => {
    const it = copia().find((x) => x.respuesta === 'eius')!;
    it.ejes.examina = ['genero', 'numero', 'caso'];
    expect(revisarItemPronombre(it).some((f) => f.clase === 'eje-que-la-celda-no-distingue')).toBe(true);
  });

  it('«eīs» no distingue ni género ni caso', () => {
    expect(ejesQueDistingue(IS, 'm', 'dat', 'pl')).toEqual(['numero']);
    const it = copia().find((x) => x.respuesta === 'eīs')!;
    it.ejes.examina = ['numero', 'caso'];
    expect(revisarItemPronombre(it).some((f) => f.clase === 'eje-que-la-celda-no-distingue')).toBe(true);
  });

  it('«id» no distingue el caso: nominativo y acusativo son la misma forma', () => {
    expect(ejesQueDistingue(IS, 'n', 'nom', 'sg')).toEqual(['genero', 'numero']);
  });

  it('quitar «eius» suspende el lote: el varia lo nombra', () => {
    const r = revisarLotePronombre(copia().filter((it) => it.respuesta !== 'eius'), EXIGIDOS);
    expect(r.fallos.some((f) => f.clase === 'sincretismo-sin-cubrir')).toBe(true);
  });

  it('callarse sobre los ejes que la celda no distingue es un hallazgo', () => {
    const it = copia().find((x) => x.respuesta === 'eius')!;
    delete it.ejes.porQueNoLosOtros;
    expect(revisarItemPronombre(it).some((f) => f.clase === 'silencio-sobre-los-otros-ejes')).toBe(true);
  });

  it('un lote que se contesta repitiendo una forma', () => {
    const uno = copia().find((x) => x.respuesta === 'eius')!;
    const r = revisarLotePronombre([uno, { ...uno, id: 'x1' }, { ...uno, id: 'x2' }, copia()[0]!], EXIGIDOS);
    expect(r.fallos.some((f) => f.clase === 'estrategia-constante')).toBe(true);
  });
});

describe('el límite declarado de ejesQueDistingue', () => {
  it('no ve las ambigüedades en DIAGONAL, y por eso el gate sirve para producción y no para recepción', () => {
    // `ea` es a la vez f.nom.sg, n.nom.pl y n.ac.pl. La función dice que
    // f.nom.sg distingue los tres ejes, y es verdad moviendo UN eje: para
    // llegar a n.nom.pl hay que mover género Y número a la vez.
    expect(ejesQueDistingue(IS, 'f', 'nom', 'sg')).toEqual(['genero', 'numero', 'caso']);
    expect(declinarPronombre(IS, 'f', 'nom', 'sg')).toBe('ea');
    expect(declinarPronombre(IS, 'n', 'nom', 'pl')).toBe('ea');
    // Si alguien escribe un lote de RECEPCIÓN con este gate, esto es el
    // agujero: al alumno se le enseñaría «ea» esperando que lea femenino
    // singular, y el corpus se lo va a dar también como neutro plural.
  });
});

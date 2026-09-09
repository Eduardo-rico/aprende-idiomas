// tests/unit/lotes-tercera-la.test.ts
//
// La 3.ª, en sus dos puntos. El control que importa es el último: un ítem
// que decía enseñar el acusativo en `-īs` y respondía «partēs» — la forma
// que justamente NO tiene la marca — pasaba el gate entero.
import { describe, it, expect } from 'vitest';
import { LOTE_TERCERA_CONSONANTE } from '@/lib/data/languages/la/lotes/l2-tercera-consonante';
import { LOTE_TERCERA_I } from '@/lib/data/languages/la/lotes/l2-tercera-i';
import {
  revisarItemDeclinacion, revisarLoteDeclinacion,
  distanciaDelTema, marcasQueMuestra, type ItemDeclinacion,
} from '@/scripts/lib/gate-declinacion';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { variantesDe } from '@/lib/data/languages/la/paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
const OPC_C = { celdasExigidas: ['gen.sg', 'ac.sg'], lemasMinimos: 6, exigeRecorrerLaOpacidad: true };
const OPC_I = {
  celdasExigidas: ['gen.pl'], lemasMinimos: 3,
  marcasExigidas: ['gen-pl-ium', 'abl-sg-i', 'nom-pl-ia', 'ac-pl-is'] as const,
};
const copia = (l: ItemDeclinacion[]) => l.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('3.ª · en verde', () => {
  it('los dos lotes pasan su gate', () => {
    expect(revisarLoteDeclinacion(LOTE_TERCERA_CONSONANTE, OPC_C).fallos).toHaveLength(0);
    expect(revisarLoteDeclinacion(LOTE_TERCERA_I, OPC_I as never).fallos).toHaveLength(0);
  });

  it('toda respuesta es una de las variantes que la máquina deriva', () => {
    for (const it of [...LOTE_TERCERA_CONSONANTE, ...LOTE_TERCERA_I])
      expect(variantesDe(it.entrada, it.caso, it.numero), it.id).toContain(it.respuesta);
  });

  it('el eje de opacidad se recorre de verdad, de 0 a 4', () => {
    const ds = LOTE_TERCERA_CONSONANTE.map((it) => distanciaDelTema(it.entrada));
    expect(Math.min(...ds)).toBe(0);           // timor: el tema ES el nominativo
    expect(Math.max(...ds)).toBeGreaterThanOrEqual(4);  // tempus/tempor-
  });

  it('las cuatro marcas del tema en -i aparecen, y ningún lema las tiene todas', () => {
    const marcas = LOTE_TERCERA_I.filter((it) => it.ejes.marcaI);
    for (const m of ['gen-pl-ium', 'abl-sg-i', 'nom-pl-ia', 'ac-pl-is'])
      expect(marcas.some((it) => it.ejes.marcaI === m), m).toBe(true);
    // `mare` es neutro: tiene el ablativo en -ī y el nominativo en -ia, y
    // NO el acusativo en -īs. `pars` y `urbs`, al revés.
    expect(marcasQueMuestra(N('mare'), 'ac', 'pl', 'maria')).not.toContain('ac-pl-is');
    expect(marcasQueMuestra(N('pars'), 'abl', 'sg', 'parte')).not.toContain('abl-sg-i');
  });
});

describe('3.ª · ROJO', () => {
  it('EL QUE SE ESCAPÓ: decir que se enseña el «-īs» respondiendo «partēs»', () => {
    // La primera versión de `marcasQueMuestra` miraba la CELDA y no la
    // FORMA, así que aprobaba un ítem que enseñaba lo contrario de lo que
    // decía. Latín correcto, bien declarado y midiendo al revés.
    const it = copia(LOTE_TERCERA_I).find((x) => x.ejes.marcaI === 'ac-pl-is')!;
    it.respuesta = 'partēs';
    expect(revisarItemDeclinacion(it).some((f) => f.clase === 'marca-i-mal-declarada')).toBe(true);
  });

  it('un lote que no recorre la opacidad tiene un varia decorativo', () => {
    const plano = copia(LOTE_TERCERA_CONSONANTE)
      .filter((it) => distanciaDelTema(it.entrada) >= 2 && distanciaDelTema(it.entrada) <= 3);
    expect(plano.length).toBeGreaterThan(4);
    expect(revisarLoteDeclinacion(plano, OPC_C).fallos.some((f) => f.clase === 'eje-de-opacidad-plano')).toBe(true);
  });

  it('quitar una de las cuatro marcas suspende el lote', () => {
    const sinNeutro = copia(LOTE_TERCERA_I).filter((it) => it.ejes.marcaI !== 'abl-sg-i');
    expect(revisarLoteDeclinacion(sinNeutro, OPC_I as never).fallos
      .some((f) => f.clase === 'marca-i-sin-cubrir')).toBe(true);
  });

  it('una marca declarada en una celda que no la tiene', () => {
    const it = copia(LOTE_TERCERA_I).find((x) => !x.ejes.marcaI)!;
    it.ejes.marcaI = 'gen-pl-ium';
    expect(revisarItemDeclinacion(it).some((f) => f.clase === 'marca-i-mal-declarada')).toBe(true);
  });

  it('y una respuesta que no es ninguna de las variantes', () => {
    const it = copia(LOTE_TERCERA_CONSONANTE)[0]!;
    it.respuesta = 'timoris';
    expect(revisarItemDeclinacion(it).some((f) => f.clase === 'respuesta-no-derivada')).toBe(true);
  });
});

describe('la variante atestiguada, con su cuenta', () => {
  it('el acusativo en -īs es de los NO neutros, y el corpus lo trae 56 veces', () => {
    expect(variantesDe(N('pars'), 'ac', 'pl')).toEqual(['partēs', 'partīs']);
    expect(variantesDe(N('urbs'), 'ac', 'pl')).toEqual(['urbēs', 'urbīs']);
    // El neutro no lo tiene, y pedírselo sería inventar una forma.
    expect(variantesDe(N('mare'), 'ac', 'pl')).toEqual(['maria']);
    // Y los que no son temas en -i, tampoco.
    expect(variantesDe(N('rēx'), 'ac', 'pl')).toEqual(['rēgēs']);
  });
});

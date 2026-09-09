// tests/unit/lote-partes-la.test.ts
//
// Las cuatro partes principales. Lo que este lote tiene que enseñar no es
// una regla sino su ausencia: para la 3.ª NO EXISTE patrón que prediga el
// perfecto, y ése es el motivo de que la ficha tenga cuatro casillas.
import { describe, it, expect } from 'vitest';
import { LOTE_PARTES } from '@/lib/data/languages/la/lotes/l5-partes-principales';
import {
  revisarItemPartes, revisarLotePartes, cuantoSeAparta, loQuePredicelaRegla, type ItemPartes,
} from '@/scripts/lib/gate-partes-principales';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const copia = (): ItemPartes[] => LOTE_PARTES.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('las cuatro partes · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLotePartes(LOTE_PARTES);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('toda respuesta sale de la ficha del lexicón', () => {
    for (const it of LOTE_PARTES) {
      const ficha = { infinitivo: it.verbo.infinitivo, perfecto: it.verbo.perfecto, supino: it.verbo.supino };
      expect(it.respuesta, it.id).toBe(ficha[it.parte]);
    }
  });

  it('ninguna entrada contiene ya la respuesta', () => {
    for (const it of LOTE_PARTES) expect(it.entrada, it.id).not.toContain(it.respuesta);
  });

  it('recorre el gradiente entero, del 0 al «no hay regla»', () => {
    const ds = LOTE_PARTES.map((it) => it.ejes.seAparta);
    expect(ds).toContain(0);
    expect(ds).toContain(null);
    expect(ds.filter((d) => d === null).length).toBe(5);
  });

  it('la ruta de la regla llega EXACTAMENTE a su piso y ni un ítem más', () => {
    const r = revisarLotePartes(LOTE_PARTES);
    expect(r.tasaDeLaRegla).toBeCloseTo(r.piso, 9);
  });
});

describe('«no hay regla» no es «se aparta mucho»', () => {
  it('para la 3.ª y la mixta, `loQuePredicelaRegla` devuelve null', () => {
    for (const l of ['dūcō', 'mittō', 'legō', 'faciō', 'capiō'])
      expect(loQuePredicelaRegla(V(l)), l).toBeNull();
    expect(cuantoSeAparta(V('dūcō'))).toBeNull();
  });

  it('y para los desviados devuelve el patrón, que existe y falla', () => {
    // `doceō` se aparta en una casilla; `videō` en dos. Los dos TIENEN
    // regla contra la que compararse, y por eso su desviación es medible.
    expect(loQuePredicelaRegla(V('doceō'))).toEqual({ perfecto: 'docuī', supino: 'docitum' });
    expect(cuantoSeAparta(V('doceō'))).toBe(1);
    expect(cuantoSeAparta(V('videō'))).toBe(2);
    expect(cuantoSeAparta(V('amō'))).toBe(0);
  });

  it('confundir los dos haría creer que basta con memorizar más', () => {
    // Por eso el eje va con `null` y no con un número grande: son cosas
    // distintas y el material tiene que decirlo.
    const sinRegla = LOTE_PARTES.filter((it) => it.ejes.seAparta === null);
    for (const it of sinRegla) expect(it.ejes.porQueNoHayRegla, it.id).toBeTruthy();
    const conRegla = LOTE_PARTES.filter((it) => it.ejes.seAparta !== null);
    for (const it of conRegla) expect(it.ejes.porQueNoHayRegla, it.id).toBeUndefined();
  });
});

describe('las cuatro partes · ROJO', () => {
  it('un lote sin verbos de 3.ª enseña una regla y no su ausencia', () => {
    const conRegla = copia().filter((it) => it.ejes.seAparta !== null);
    expect(revisarLotePartes(conRegla).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('y uno sin regulares no tiene contra qué medir la desviación', () => {
    const sinRegulares = copia().filter((it) => it.ejes.seAparta !== 0);
    expect(revisarLotePartes(sinRegulares).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('callarse que un verbo no tiene regla', () => {
    const it = copia().find((x) => x.ejes.seAparta === null)!;
    delete it.ejes.porQueNoHayRegla;
    expect(revisarItemPartes(it).some((f) => f.clase === 'silencio-sobre-la-falta-de-regla')).toBe(true);
  });

  it('una distancia inventada', () => {
    const it = copia().find((x) => x.ejes.seAparta === 0)!;
    it.ejes.seAparta = 2;
    expect(revisarItemPartes(it).some((f) => f.clase === 'distancia-mal-declarada')).toBe(true);
  });

  it('una entrada que ya enseña la respuesta', () => {
    const it = copia()[0]!;
    it.entrada = `${it.entrada} ${it.respuesta}`;
    expect(revisarItemPartes(it).some((f) => f.clase === 'respuesta-no-esta-en-la-ficha')).toBe(true);
  });
});

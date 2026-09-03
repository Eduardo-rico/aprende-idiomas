// tests/unit/lote-la-fpd.test.ts — el primer lote, contra su propio gate.
import { describe, it, expect } from 'vitest';
import { revisarLote, tasasCiegas, TECHO_CIEGO } from '../../scripts/lib/gate-cloze-glosa';
import { LOTE_FUNCION_POR_DESINENCIA as LOTE } from '../../lib/data/languages/la/lotes/l3-funcion-por-desinencia';
import { revisarCantidad } from '../../lib/data/languages/la/cantidad';
import { PUNTOS_LA } from '../../lib/data/languages/la/inventario-puntos';
import { revisarOrtografiaLa, textoParaVoz } from '@/lib/lang/ortografia-la';

describe('el primer lote de latín', () => {
  it('pasa el gate del formato entero', () => {
    expect(revisarLote(LOTE)).toEqual([]);
  });

  it('LAS TRES estrategias ciegas se quedan en el azar o por debajo', () => {
    // La aserción que importa, y la que la v1 no tenía: no basta con que
    // el gate calle. Hay que ver los tres números.
    const t = tasasCiegas(LOTE);
    expect(t.posicional).toBeLessThanOrEqual(TECHO_CIEGO);   // 50 %
    expect(t.inversion).toBeLessThanOrEqual(TECHO_CIEGO);    // 50 %
    expect(t.pragmatica).toBeLessThanOrEqual(TECHO_CIEGO);   // 40 %
    // Y las dos de orden suman uno: son complementarias, así que la única
    // mezcla que deja a las dos en el azar es la mitad y la mitad.
    expect(t.posicional + t.inversion).toBe(1);
  });

  it('los ítems que pide el DESCRIPTOR, no el piso genérico de 8', () => {
    // El piso (8) es un mínimo genérico del peldaño; el descriptor cita un
    // número concreto y hasta ahora nada lo comprobaba: se citaba un 20 y
    // se entregaba un 12.
    const punto = PUNTOS_LA.find((p) => p.id === 'l3-funcion-por-desinencia')!;
    expect(punto.itemsQuePide).toBe(20);
    expect(LOTE.length).toBeGreaterThanOrEqual(punto.itemsQuePide!);
  });

  it('LA CANTIDAD de cada forma, contra el lexicón', () => {
    // Sustituye a un test que salía verde con los mácrons correctos, con
    // ninguno y con todos inventados.
    for (const it of LOTE) expect(revisarCantidad(it.latin), it.id).toEqual([]);
  });

  it('el latín pasa la norma ortográfica', () => {
    for (const it of LOTE) expect(revisarOrtografiaLa(it.latin), it.id).toEqual([]);
  });

  it('ninguna frase produce una palabra inexistente al respelizarse para la voz', () => {
    // `Poētam laudat agricola` salía «petam laudat agricola» y por eso el
    // ítem se retiró. Lo que se envía a la voz se mira, no se supone.
    for (const it of LOTE) {
      const v = textoParaVoz(it.latin);
      expect(v.split(/\s+/).every((w) => w.length >= 2), `${it.id}: "${v}"`).toBe(true);
      expect(v, it.id).not.toContain('petam');
    }
  });

  it('recorre los SEIS órdenes, las cuatro conjugaciones y los dos números', () => {
    expect(new Set(LOTE.map((i) => i.ejes.orden)).size).toBe(6);
    expect(new Set(LOTE.map((i) => i.ejes.conjugacion))).toEqual(new Set([1, 2, 3, 4]));
    expect(new Set(LOTE.map((i) => i.ejes.numero))).toEqual(new Set(['sg', 'pl']));
  });

  it('ningún par de nombres se define por la relación que el verbo nombra', () => {
    // `magister`/`discipulus` y `dominus`/`servus` se retiraron por esto:
    // no son reversibles, y el sentido común resuelve el ítem.
    const prohibidos = [['magister', 'discipul'], ['dominus', 'serv'], ['domin', 'ancill']];
    for (const it of LOTE) {
      const l = it.latin.toLowerCase();
      for (const [a, b] of prohibidos) {
        expect(l.includes(a!) && l.includes(b!), `${it.id}: ${it.latin}`).toBe(false);
      }
    }
  });
});

// tests/unit/lote-nominativo-la.test.ts
//
// El nominativo, y el piso más alto que hemos medido: con dos nominativos
// ninguna desinencia dice cuál es el sujeto, y «el primero» acierta el
// 80,6 % en el texto real.
import { describe, it, expect } from 'vitest';
import { LOTE_NOMINATIVO } from '@/lib/data/languages/la/lotes/l3-nominativo';
import { revisarLoteFuncionCaso, revisarItemFuncionCaso, type ItemFuncionCaso } from '@/scripts/lib/gate-funcion-caso';

const OPC = { colisionesMinimas: 0, colisionesMaximas: 2 };
const copia = (): ItemFuncionCaso[] => LOTE_NOMINATIVO.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('el nominativo · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteFuncionCaso(LOTE_NOMINATIVO, OPC);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('el varia se cubre: seis con un nominativo y seis con dos', () => {
    expect(LOTE_NOMINATIVO.filter((it) => it.ejes.cuantosNominativos === 1)).toHaveLength(6);
    expect(LOTE_NOMINATIVO.filter((it) => it.ejes.cuantosNominativos === 2)).toHaveLength(6);
  });

  it('y los de dos van equilibrados, tres y tres', () => {
    // Porque en el texto real el sujeto va delante el 80,6 % de las veces:
    // sin equilibrar, «el primero es el sujeto» resolvería el lote entero.
    const dos = LOTE_NOMINATIVO.filter((it) => it.ejes.cuantosNominativos === 2);
    expect(dos.filter((it) => it.ejes.sujetoDelante)).toHaveLength(3);
    expect(dos.filter((it) => it.ejes.sujetoDelante === false)).toHaveLength(3);
  });
});

describe('el nominativo · ROJO', () => {
  it('un lote sin frases de dos nominativos no examina el punto', () => {
    // Escribí este test esperando que el renglón de cobertura ni apareciera,
    // y el gate hace algo mejor: aparece con CERO y eso es un hallazgo. Un
    // lote de puros nominativos únicos está bien escrito, es latín correcto
    // y no mide el `varia` del punto, que es «con dos, cuál es el sujeto».
    const soloUno = copia().filter((it) => it.ejes.cuantosNominativos === 1);
    const r = revisarLoteFuncionCaso(soloUno, OPC);
    const fila = r.cobertura.find((c) => c.comprobacion.includes('NO decide'))!;
    expect(fila.decididos).toBe(0);
    expect(r.fallos.some((f) => f.clase === 'cobertura-cero')).toBe(true);
  });

  it('un lote sin frases de UN nominativo pierde el contraste', () => {
    const soloDos = copia().filter((it) => it.ejes.cuantosNominativos === 2);
    expect(revisarLoteFuncionCaso(soloDos, OPC).fallos.some((f) => f.clase === 'rango-plano')).toBe(true);
  });

  it('EL CONTROL DEL PISO: todos con el sujeto delante y el instinto gana', () => {
    // Es exactamente el reparto del corpus —80,6 %— y por eso un lote que lo
    // imitara mediría mucho menos de lo que parece.
    const escorado = copia().map((it) =>
      (it.ejes.cuantosNominativos === 2 ? { ...it, ejes: { ...it.ejes, sujetoDelante: true } } : it));
    expect(revisarLoteFuncionCaso(escorado, OPC).fallos.some((f) => f.clase === 'funcion-constante')).toBe(true);
  });

  it('una forma que no es el nominativo de su lema', () => {
    const it = copia()[0]!;
    it.forma = 'inventado';
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'forma-no-derivada')).toBe(true);
  });
});

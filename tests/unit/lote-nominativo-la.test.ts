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

  it('son SEIS, todos de un solo nominativo: el eje de los dos se retiró', () => {
    // Los seis de «Rex dominus est.» salieron el 2026-09-11. El eje que
    // decían medir no es medible con hueco en la glosa: la glosa nombra ya
    // a uno de los dos nominativos, así que sólo queda una palabra para el
    // hueco. La estrategia «pon el sustantivo que la glosa no menciona» se
    // EJECUTÓ sobre ellos y acertó 6 de 6.
    expect(LOTE_NOMINATIVO).toHaveLength(6);
    expect(LOTE_NOMINATIVO.every((it) => it.ejes.cuantosNominativos === 1)).toBe(true);
  });

  it('y el cero de la fila de cobertura está DECLARADO como resultado, no callado', () => {
    const r = revisarLoteFuncionCaso(LOTE_NOMINATIVO, OPC);
    const fila = r.cobertura.find((c) => c.comprobacion.includes('NO decide'))!;
    expect(fila.decididos).toBe(0);
    expect(fila.elCeroEsUnResultado).toMatch(/no se puede medir/);
  });

});

// ── TRES TESTIGOS BORRADOS el 2026-09-11, y el motivo, que es lo que
//    importa: probaban el equilibrado de los ítems de DOS nominativos —que
//    hubiera de los dos tipos, y que el sujeto fuera delante en la mitad—.
//    Ese equilibrado estaba bien pensado y era INSUFICIENTE: con dos
//    nominativos la glosa española nombra ya a uno, así que «pon el
//    sustantivo que la glosa no menciona» acierta el 100 % sin mirar el
//    orden. Medido, 6 de 6. Los ítems se retiraron y el eje está prohibido
//    en este formato, así que los tres testigos probaban una propiedad de
//    algo que ya no puede existir. Se borran en vez de dejarlos en `skip`:
//    un test saltado sin motivo escrito es peor que no tenerlo.
describe('el nominativo · ROJO', () => {
  it('ROJO · un ítem de DOS nominativos ya no se puede declarar', () => {
    const dos = copia().map((it) => ({ ...it, ejes: { ...it.ejes, cuantosNominativos: 2 as const, sujetoDelante: true } }));
    const r = revisarLoteFuncionCaso(dos, OPC);
    expect(r.fallos.some((f) => f.clase === 'eje-no-medible-en-este-formato')).toBe(true);
    expect(r.fallos.find((f) => f.clase === 'eje-no-medible-en-este-formato')!.detalle).toMatch(/6\/6/);
  });




  it('una forma que no es el nominativo de su lema', () => {
    const it = copia()[0]!;
    it.forma = 'inventado';
    expect(revisarItemFuncionCaso(it).some((f) => f.clase === 'forma-no-derivada')).toBe(true);
  });
});

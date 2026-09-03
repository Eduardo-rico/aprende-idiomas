// EL INVARIANTE QUE CIERRA LA CLASE: todo gate que un formato DECLARA
// existe de verdad para ese tipo de ítem, y cada ítem lo declara.
//
// Dos veces ha pasado lo mismo: un gate declarado en la definición del
// formato y ausente del tipo. `atajoEs` (lote 9) — el atajo de traducción
// era gate de la corrección y en nueve lotes no se midió una sola vez.
// `transparenteLatin` (lote 18) — la misma definición lo declara gate y el
// cloze rumano lo lleva desde su primer lote; la corrección, nunca.
//
// Un gate declarado y AUSENTE es peor que no tenerlo: la definición promete
// una cobertura que nadie da y el lote sale «Limpio». Arreglar sólo la
// instancia garantizaba una tercera vez, así que esto se escribe una vez y
// vale para los formatos que vengan.
import { describe, it, expect } from 'vitest';
import { CAMPOS_EXIGIDOS, camposSinDeclarar } from '../../scripts/lib/gates-por-formato';
import { ITEMS as CORR_A1 } from '../../scripts/lotes/corr-ro-a1';
import { ITEMS as CORR_A1B } from '../../scripts/lotes/corr-ro-a1b';
import { ITEMS as CORR_A1C } from '../../scripts/lotes/corr-ro-a1c';
import { ITEMS as CORR_A2 } from '../../scripts/lotes/corr-ro-a2';
import { ITEMS as CORR_A2B } from '../../scripts/lotes/corr-ro-a2b';
import { ITEMS as CORR_B1 } from '../../scripts/lotes/corr-ro-b1';
import { ITEMS as CLOZE_B1 } from '../../scripts/lotes/cloze-ro-b1';
import { ITEMS as CLOZE_B1B } from '../../scripts/lotes/cloze-ro-b1b';

describe('el gate declarado existe de verdad', () => {
  it('ROJO: un ítem que no declara un campo exigido se denuncia por nombre', () => {
    const { transparenteLatin, ...sinCampo } = CORR_B1[0]! as unknown as Record<string, unknown>;
    expect(camposSinDeclarar('correccion', sinCampo)).toEqual(['transparenteLatin']);
    // Y «false» SÍ es declarar: `undefined` es lo que falla, no la ausencia
    // de atajo. Ésa es la confusión que dejó `atajoEs` sin existir.
    expect(camposSinDeclarar('correccion', { ...sinCampo, transparenteLatin: false })).toEqual([]);
  });

  it('ROJO: un ítem sin NINGÚN campo declarado los denuncia todos', () => {
    expect(camposSinDeclarar('correccion', {})).toEqual(['espejoEs', 'atajoEs', 'transparenteLatin']);
    expect(camposSinDeclarar('cloze-con-pista', {})).toEqual(['transparenteLatin']);
  });

  // EL LOTE 18 ES EL PRIMERO QUE DECLARA LOS TRES. Los anteriores nacieron
  // antes de que el campo existiera, así que se comprueba lo que hay y se
  // dice qué falta: el objetivo no es teñir de verde, es que la deuda esté
  // contada.
  it('el lote 18 declara los tres campos que la corrección exige', () => {
    for (const x of CORR_B1) expect(camposSinDeclarar('correccion', x as unknown as Record<string, unknown>), x.mala).toEqual([]);
  });

  it('los cloze rumanos declaran transparenteLatin, que es su gate', () => {
    for (const x of [...CLOZE_B1, ...CLOZE_B1B])
      expect(camposSinDeclarar('cloze-con-pista', x as unknown as Record<string, unknown>), x.s).toEqual([]);
  });

  // LA DEUDA, CONTADA Y NO TAPADA: los lotes de corrección anteriores al 18
  // no declaran `transparenteLatin` porque el campo no existía. El número
  // baja cuando alguien los revise; que esté escrito impide que se olvide.
  it('la deuda de los lotes anteriores está contada', () => {
    const viejos = [...CORR_A1, ...CORR_A1B, ...CORR_A1C, ...CORR_A2, ...CORR_A2B];
    const sinDeclarar = viejos.filter((x) => camposSinDeclarar('correccion', x as unknown as Record<string, unknown>).length);
    expect(sinDeclarar.length).toBe(viejos.length);
    expect(viejos.every((x) => camposSinDeclarar('correccion', x as unknown as Record<string, unknown>).join() === 'transparenteLatin')).toBe(true);
  });

  it('el registro no declara campos para formatos sin máquina', () => {
    // `transformacion`, `flashcard`, `escucha`, `mediacion` y
    // `preferencia-registro` no tienen lotes: declararles gates sería
    // prometer cobertura que no existe.
    expect(Object.keys(CAMPOS_EXIGIDOS).sort()).toEqual(['cloze-con-pista', 'correccion']);
  });
});

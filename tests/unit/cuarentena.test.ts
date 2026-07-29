// Cuarentena de contenido defectuoso.
//
// El 2026-07-28 se marcaron 102 ítems con `variantStatus: 'needs-human'`
// y se dieron por "aparcados" en el informe. No lo estaban: la marca se
// escribía en el JSON y se declaraba en el schema, pero ningún punto del
// runtime la leía, así que los 102 se siguieron sirviendo intactos.
//
// El test que faltaba no es el del predicado —ése habría pasado igual
// con el filtro desconectado— sino el que interroga al CORPUS REAL a
// través de la misma puerta que usa la app. Por eso el segundo bloque
// no usa fixtures.
import { describe, it, expect } from 'vitest';
import { loadBlock, loadAllBlocks } from '@/lib/data/loaders';

interface ItemConEstado {
  id?: string;
  variantStatus?: string;
}

describe('cuarentena — puerta de servicio', () => {
  it('retira los ítems en cuarentena del corpus servido', async () => {
    const servidos = (await loadAllBlocks('pt')) as ItemConEstado[];
    const rotos = servidos.filter((x) => x?.variantStatus === 'needs-human');
    expect(rotos.map((x) => x.id)).toEqual([]);
  });

  it('los sigue devolviendo cuando se piden explícitamente', async () => {
    const todos = (await loadAllBlocks('pt', { incluirEnCuarentena: true })) as ItemConEstado[];
    const enCuarentena = todos.filter((x) => x?.variantStatus === 'needs-human');
    // Si esto baja a 0 es porque alguien los arregló de verdad; el test
    // debe fallar entonces, para que se retire la cuarentena a conciencia
    // en vez de quedarse como código muerto que aparenta proteger.
    expect(enCuarentena.length).toBeGreaterThan(0);
  });

  it('el filtro cuesta lo que dice costar y no más', async () => {
    const servidos = await loadAllBlocks('pt');
    const todos = await loadAllBlocks('pt', { incluirEnCuarentena: true });
    const retirados = todos.length - servidos.length;
    expect(retirados).toBeGreaterThan(0);
    // Cota de seguridad: si un cambio de marcado dejara en cuarentena a
    // media app, esto lo caza antes que el alumno.
    expect(retirados / todos.length).toBeLessThan(0.15);
  });

  it('loadBlock filtra igual que loadAllBlocks', async () => {
    // b1 es el bloque con más cuarentena (35/258 al escribir esto), así
    // que es el que delata una divergencia entre las dos puertas.
    const servidos = ((await loadBlock('pt', 1)) ?? []) as ItemConEstado[];
    const todos = ((await loadBlock('pt', 1, { incluirEnCuarentena: true })) ?? []) as ItemConEstado[];
    expect(servidos.some((x) => x?.variantStatus === 'needs-human')).toBe(false);
    expect(todos.length).toBeGreaterThan(servidos.length);
  });

  it('no retira `unchecked` ni `divergent`', async () => {
    // `unchecked` es el 90% del corpus: filtrarlo dejaría la app vacía.
    // `divergent` está verificado como divergencia real y es contenido bueno.
    const servidos = (await loadAllBlocks('pt')) as ItemConEstado[];
    expect(servidos.some((x) => x?.variantStatus === 'unchecked')).toBe(true);
    expect(servidos.some((x) => x?.variantStatus === 'divergent')).toBe(true);
  });
});

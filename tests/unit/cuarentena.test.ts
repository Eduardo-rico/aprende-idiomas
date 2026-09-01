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
    // Cota de seguridad contra el marcado accidental. Estaba en 0,15
    // cuando la cuarentena eran los 102 de la Ola V (5 %). En E2#22 se
    // retiraron 595 ítems más POR DECISIÓN MEDIDA —excedente sin dictamen
    // sobre puntos que ya llegan al piso— y la cuarentena pasó al 28 %.
    // La cota se sube porque el estado cambió, no porque estorbara; lo que
    // de verdad protege es el test de abajo, que mira el efecto en vez del
    // volumen.
    expect(retirados / todos.length).toBeLessThan(0.35);
  });

  it('retirar la cuarentena no deja NINGÚN punto por debajo de su piso', async () => {
    // El invariante que importa, y que el volumen sólo aproximaba: se
    // puede retirar de servicio lo que sobra, nunca lo que sostiene un
    // punto. Si un solo punto cruza de «llega» a «no llega» por la
    // cuarentena, la selección está mal y hay que deshacerla.
    const { contarPuntos, pisoCero, conPisoCero, conPadreCubierto } = await import('@/scripts/lib/conceptos-finos');
    const todos = (await loadAllBlocks('pt', { incluirEnCuarentena: true })) as any[];
    const pisoBase = conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), pisoCero());
    // Se aísla la decisión de E2#22: se comparan los servibles contra los
    // servibles MÁS el excedente devuelto. La cuarentena VIEJA (Ola V) sí
    // deja 25 puntos bajo el piso, pero eso es déficit real y declarado —
    // mezclarlo aquí haría que este test midiera otra cosa y no cazara
    // nunca una mala selección de excedente.
    const esExcedente = (x: any) => String(x?.variantVerificacion ?? '').includes('excedente sobre la cobertura');
    const servibles = todos.filter((x) => x?.variantStatus !== 'needs-human');
    const conExcedente = [...servibles, ...todos.filter(esExcedente)];
    const antes = contarPuntos(conExcedente, { incluirCuarentena: true }).cuenta;
    const despues = contarPuntos(servibles).cuenta;
    // El piso de un PADRE cubierto es 0: su déficit es inalcanzable por
    // construcción. Sin esto, `b8-colocacao-pronominal` —cuyos sub-puntos
    // están todos cubiertos— aparecía como caída y no lo es.
    const piso = conPadreCubierto(pisoBase, despues);
    const caen: string[] = [];
    for (const [id, n] of antes) if (n >= piso(id) && (despues.get(id) ?? 0) < piso(id)) caen.push(id);
    expect(caen).toEqual([]);
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

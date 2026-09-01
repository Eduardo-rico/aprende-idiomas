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
import fs from 'node:fs';
import path from 'node:path';

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
    // La cota de PORCENTAJE se retiró en E2#29, después de subirla dos
    // veces —0,15 → 0,35— y verla saltar otra vez. Cada retirada ha sido
    // deliberada y comprobada por el invariante de abajo, así que subir el
    // número cada vez es un trinquete: una cota que se afloja siempre que
    // molesta no protege de nada, y encima da la impresión contraria.
    //
    // La sustituye una cota que NO se puede arrastrar, porque no depende
    // de cuánto se ha retirado sino de si queda bastante para enseñar:
    // **el corpus servible tiene que cubrir la suma de todos los pisos.**
    // Si un día no la cubre, el curso no puede alcanzar su propia meta por
    // mucho que el porcentaje parezca razonable.
    const { contarPuntos, pisoCero, conPisoCero, conPadreCubierto } = await import('@/scripts/lib/conceptos-finos');
    const { ALL_CONCEPTS } = await import('@/lib/data/languages/pt/curriculum');
    const { CONCEPTOS_FINOS } = await import('@/lib/data/languages/pt/conceptos-finos.generated');
    const { cuenta } = contarPuntos(servidos as any[]);
    for (const c of [...ALL_CONCEPTS, ...CONCEPTOS_FINOS]) if (!cuenta.has(c.id)) cuenta.set(c.id, 0);
    const piso = conPadreCubierto(conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), pisoCero()), cuenta);
    const sumaPisos = [...cuenta.keys()].reduce((a, id) => a + piso(id), 0);
    expect((servidos as any[]).length).toBeGreaterThan(sumaPisos);
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

// ── E2#29: retirar algo exige DECIR POR QUÉ ───────────────────────────
//
// El gate de cierre pedía «cero needs-human», y esa meta quedó derogada
// cuando Edu aprobó la cuarentena por excedente en E2#22: 1.161 ítems
// retirados a propósito no son deuda, son la decisión funcionando. Pero al
// re-etiquetar la línea hay que sustituir el número por un INVARIANTE que
// no se pueda ganar cuarentenando — y ése es que cada retirada lleve su
// motivo escrito EN EL PROPIO ÍTEM.
//
// Es lo que hizo falta cuando la reversibilidad se probó y salieron 100
// ítems de la cuarentena vieja SIN motivo: la razón vivía en un comentario
// de `loaders.ts` y no se podían deshacer caso a caso.
describe('nada se retira ni se aparca sin decir por qué', () => {
  const dir = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
  const todos = fs.readdirSync(dir).filter((f) => /^b\d+\.json$/.test(f))
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as
      { id: string; variantStatus?: string; variantVerificacion?: string }[]);
  const conMotivo = (x: { variantVerificacion?: string }) => String(x.variantVerificacion ?? '').trim() !== '';

  it('todo ítem en cuarentena lleva su motivo', () => {
    const mudos = todos.filter((x) => x.variantStatus === 'needs-human' && !conMotivo(x));
    expect(mudos.slice(0, 5).map((x) => x.id)).toEqual([]);
  });
  it('todo ítem sin dictaminar lleva escrito a qué espera', () => {
    const mudos = todos.filter((x) => (x.variantStatus ?? 'unchecked') === 'unchecked' && !conMotivo(x));
    expect(mudos.slice(0, 5).map((x) => x.id)).toEqual([]);
  });
});

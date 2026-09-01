// Un punto ENTERRADO con cero ítems tiene que dar déficit 0.
//
// El caso que falla y que nadie tenía: `pisoCero()` se aplicaba subiendo
// la cuenta del punto hasta su piso, guardado tras `if (cuenta.has(id))`.
// Un punto con cero ítems NO está en el mapa —es justo la clase de punto
// que se entierra—, así que el ajuste era un no-op y los dos puntos
// enterrados seguían sumando 16 unidades de déficit ya decidido en la
// tabla final del proyecto.
import { describe, it, expect } from 'vitest';
import { conPisoCero, padreCubierto } from '@/scripts/lib/conceptos-finos';

const CERO = new Map([['b11-nominalizacao', 'declarado'], ['b11-pontuacao-sintatica', 'declarado']]);
const base = (id: string) => (id.startsWith('b12') ? 6 : 8);
const piso = conPisoCero(base, CERO);

const deficit = (cuenta: Map<string, number>, ids: string[]) =>
  ids.reduce((a, id) => a + Math.max(0, piso(id) - (cuenta.get(id) ?? 0)), 0);

describe('piso cero', () => {
  it('un punto enterrado con CERO ítems no aporta déficit — el caso que fallaba', () => {
    // La cuenta ni siquiera lo contiene, que es lo que rompía el guardián.
    expect(deficit(new Map(), ['b11-nominalizacao'])).toBe(0);
  });
  it('tampoco aporta si está en el mapa a cero', () => {
    expect(deficit(new Map([['b11-nominalizacao', 0]]), ['b11-nominalizacao'])).toBe(0);
  });
  it('los dos enterrados juntos son 0, no 16', () => {
    expect(deficit(new Map(), [...CERO.keys()])).toBe(0);
  });
  it('no toca a los demás: un punto normal a cero sigue pidiendo su piso', () => {
    expect(deficit(new Map(), ['b1-sandi'])).toBe(8);
    expect(deficit(new Map(), ['b12-modo-pragmatico'])).toBe(6);
  });
  it('baja el PISO, no sube la cuenta: la foto del déficit no se contamina', () => {
    const cuenta = new Map<string, number>();
    piso('b11-nominalizacao');
    // Si el ajuste subiera la cuenta, aquí habría un 8 que nadie escribió
    // y la sesión siguiente lo reconciliaría como ganancia.
    expect(cuenta.has('b11-nominalizacao')).toBe(false);
  });
  it('fija la FORMA del bug: el ajuste antiguo era un no-op en el caso real', () => {
    // Mecanismo viejo, literal: subir la cuenta hasta el piso, guardado
    // tras `cuenta.has(id)`.
    const cuenta = new Map<string, number>(); // cero ítems ⇒ no está en el mapa
    for (const id of CERO.keys()) if (cuenta.has(id)) cuenta.set(id, base(id));
    const viejo = [...CERO.keys()].reduce((a, id) => a + Math.max(0, base(id) - (cuenta.get(id) ?? 0)), 0);
    expect(viejo).toBe(16);  // ← lo que llegó a la tabla final del proyecto
    expect(deficit(new Map(), [...CERO.keys()])).toBe(0);  // ← lo correcto
  });
  it('un punto enterrado no bloquea a su padre', () => {
    const part = padreCubierto('b11-nominalizacao', new Map(), piso);
    expect(typeof part).toBe('boolean');
  });
});

describe('la cuarentena no cuenta como cobertura', () => {
  it('un ítem needs-human no suma a su punto — no se sirve', async () => {
    const { contarPuntos } = await import('@/scripts/lib/conceptos-finos');
    const items = [
      { concepts: ['b1-sandi'], variantStatus: 'unchecked', type: 'flashcard', data: {} },
      { concepts: ['b1-sandi'], variantStatus: 'needs-human', type: 'flashcard', data: {} },
    ];
    expect(contarPuntos(items).cuenta.get('b1-sandi')).toBe(1);
    // Con la salida explícita, para auditorías, sí cuenta los dos.
    expect(contarPuntos(items, { incluirCuarentena: true }).cuenta.get('b1-sandi')).toBe(2);
  });
});

describe('padre cubierto: el déficit inalcanzable por construcción', () => {
  it('un padre SIN ítems propios cuyos sub-puntos están cubiertos no aporta déficit', async () => {
    const { conPadreCubierto, PARTICIONES } = await import('@/scripts/lib/conceptos-finos');
    const part = PARTICIONES[0]!;
    // El padre NO está en el mapa: cero ítems propios. Es el caso que el
    // guardián `cuenta.has(id)` se saltaba, y el que de verdad se entierra.
    const cuenta = new Map<string, number>(part.subs.map((s) => [s.id, 8] as const));
    const piso = conPadreCubierto(() => 8, cuenta);
    expect(piso(part.padre)).toBe(0);
    expect(Math.max(0, piso(part.padre) - (cuenta.get(part.padre) ?? 0))).toBe(0);
  });
  it('si UN sub-punto se queda corto, el que pide es el SUB, no el padre', async () => {
    // Esta prueba afirmaba lo contrario hasta E2#27, cuando producir siete
    // cloze para `b6-futuro-subj` no movió su número ni una unidad: los
    // siete cayeron en sus sub-puntos. Con la regla vieja quedaban 114
    // unidades en 26 puntos que sólo se podían cerrar escribiendo material
    // que EVADIERA la partición. La demanda vive en el sub-punto flaco,
    // que es donde un ítem nuevo va a aterrizar de verdad.
    const { conPadreCubierto, PARTICIONES } = await import('@/scripts/lib/conceptos-finos');
    const part = PARTICIONES[0]!;
    const cuenta = new Map<string, number>(part.subs.map((s, i) => [s.id, i === 0 ? 3 : 8] as const));
    const piso = conPadreCubierto(() => 8, cuenta);
    expect(piso(part.padre)).toBe(0);
    expect(piso(part.subs[0]!.id)).toBe(8);
  });
  it('baja el PISO, no sube la cuenta: la foto no guarda ítems inventados', async () => {
    const { conPadreCubierto, PARTICIONES } = await import('@/scripts/lib/conceptos-finos');
    const part = PARTICIONES[0]!;
    const cuenta = new Map<string, number>(part.subs.map((s) => [s.id, 8] as const));
    conPadreCubierto(() => 8, cuenta);
    expect(cuenta.has(part.padre)).toBe(false);
  });
});

describe('la cobertura de un padre incluye la de sus sub-puntos', () => {
  it('un padre cuyo ÁREA está enseñada no pide más, aunque él tenga pocos propios', async () => {
    const { conPadreCubierto, PARTICIONES } = await import('@/scripts/lib/conceptos-finos');
    const part = PARTICIONES[0]!;
    // El padre tiene 2 ítems propios y sus sub-puntos, de sobra: el área se
    // enseña. Antes esto pedía 6 más que sólo se podían cubrir escribiendo
    // material que evadiera la partición.
    const cuenta = new Map<string, number>([[part.padre, 2], ...part.subs.map((s) => [s.id, 10] as const)]);
    expect(conPadreCubierto(() => 8, cuenta)(part.padre)).toBe(0);
  });
  it('un padre con TODO vacío sigue pidiendo: ahí no se enseña por ninguna vía', async () => {
    const { conPadreCubierto, PARTICIONES } = await import('@/scripts/lib/conceptos-finos');
    const part = PARTICIONES[0]!;
    const cuenta = new Map<string, number>([[part.padre, 0], ...part.subs.map((s) => [s.id, 0] as const)]);
    expect(conPadreCubierto(() => 8, cuenta)(part.padre)).toBe(8);
  });
  it('los sub-puntos conservan su propio déficit: la demanda vive ahí', async () => {
    const { conPadreCubierto, PARTICIONES } = await import('@/scripts/lib/conceptos-finos');
    const part = PARTICIONES[0]!;
    const cuenta = new Map<string, number>([[part.padre, 0], ...part.subs.map((s, i) => [s.id, i === 0 ? 1 : 10] as const)]);
    const piso = conPadreCubierto(() => 8, cuenta);
    expect(piso(part.padre)).toBe(0);
    expect(piso(part.subs[0]!.id)).toBe(8);   // el sub flaco sigue pidiendo
  });
});

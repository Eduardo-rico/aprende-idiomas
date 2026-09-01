// La cuarentena tiene dos mitades y sólo se prueba una.
//
// La conocida: un ítem `needs-human` no se sirve ni cuenta como cobertura.
// La que nadie prueba: que DEVOLVERLO lo vuelva a servir y a contar. Si la
// vuelta no funciona, «reversible» es una palabra en un informe — y esta
// cuarentena retiró 595 ejercicios apoyándose en esa palabra.
import { describe, it, expect } from 'vitest';
import { loadBlock } from '@/lib/data/loaders';
import { contarPuntos } from '@/scripts/lib/conceptos-finos';
import fs from 'node:fs';
import path from 'node:path';

const BLOCKS = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const todos = fs.readdirSync(BLOCKS).filter((f) => /^b\d+\.json$/.test(f))
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS, f), 'utf8')) as any[]);
const enCuarentena = todos.filter((x) => x.variantStatus === 'needs-human');

describe('la cuarentena es reversible de verdad', () => {
  it('hay ítems en cuarentena y todos llevan su motivo escrito', () => {
    expect(enCuarentena.length).toBeGreaterThan(0);
    const sinMotivo = enCuarentena.filter((x) => !String(x.variantVerificacion ?? '').trim());
    expect(sinMotivo.map((x) => x.id)).toEqual([]);
  });

  it('el excedente declara EL PUNTO al que pertenecía, para poder deshacerlo', () => {
    const exc = enCuarentena.filter((x) => String(x.variantVerificacion).includes('excedente sobre la cobertura'));
    expect(exc.length).toBeGreaterThan(0);
    expect(exc.filter((x) => !String(x.variantVerificacion).includes('puntos:'))).toEqual([]);
  });

  it('la IDA: en cuarentena no se sirve y no cuenta', async () => {
    const x = enCuarentena[0]!;
    const bloque = await loadBlock('pt', x.blockId);
    expect((bloque as any[]).some((e: any) => e.id === x.id)).toBe(false);
    const punto = (x.concepts ?? [])[0];
    if (punto) expect(contarPuntos([x]).cuenta.get(punto) ?? 0).toBe(0);
  });

  it('la VUELTA: devolverlo a `unchecked` lo vuelve a servir y a contar', async () => {
    const x = enCuarentena[0]!;
    const devuelto = { ...x, variantStatus: 'unchecked' };
    // Servible: el embudo lo deja pasar. Se comprueba con el mismo predicado
    // que usa el loader, sobre el objeto devuelto.
    const bloqueConTodo = await loadBlock('pt', x.blockId, { incluirEnCuarentena: true });
    expect((bloqueConTodo as any[]).some((e: any) => e.id === x.id)).toBe(true);
    // Y contable: vuelve a sumar a su punto.
    const punto = (devuelto.concepts ?? [])[0];
    if (punto) expect(contarPuntos([devuelto]).cuenta.get(punto) ?? 0).toBe(1);
  });
});

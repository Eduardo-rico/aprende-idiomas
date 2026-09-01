// Las máquinas escriben el sello al publicar.
//
// Es la mitad DURABLE de la calibración de E2#22: sellar 612 ítems a mano
// resuelve el montón de hoy, y si los publicadores siguen escribiendo
// `unchecked` el montón se reconstruye lote a lote. Este test existe para
// que ese descuido no vuelva en silencio.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const S = path.join(process.cwd(), 'scripts');
const lee = (f: string) => fs.readFileSync(path.join(S, f), 'utf8');
const AUTOSELLAN = ['publicar-cloze.ts', 'publicar-mediacion.ts', 'publicar-transformacion.ts', 'publicar-correccion.ts'];

describe('los publicadores sellan al publicar', () => {
  it.each(AUTOSELLAN)('%s escribe `neutral` y no `unchecked`', (f) => {
    const s = lee(f);
    expect(s).toContain("variantStatus: 'neutral'");
    expect(s).not.toContain("variantStatus: 'unchecked'");
  });

  it('escucha es la EXCEPCIÓN y sigue en `unchecked`', () => {
    // Su pregunta abierta es de variante: nadie ha comprobado a oído que
    // la voz realice el rasgo europeo, y `EL_VOICES` usa la misma voz para
    // pt y br. Un sello aquí afirmaría lo que está en duda.
    const s = lee('publicar-escucha.ts');
    expect(s).toContain("variantStatus: 'unchecked'");
    expect(s).not.toContain("variantStatus: 'neutral'");
  });
});

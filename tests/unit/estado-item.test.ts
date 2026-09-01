// Una definición, un sitio — y un test que impide abrir el segundo.
//
// `sellado()` llegó a significar tres cosas distintas en tres scripts:
// uno mandaba a cuarentena lo que otro contaba como cobertura. Es la
// cuarta vez esta semana que un concepto con nombre y sin definición
// única muerde, así que la contramedida no es recordarlo.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { selladoDeVariante, servibleAlAlumno, esDeEscucha, enCuarentena } from '@/scripts/lib/estado-item';

describe('estado de un ítem', () => {
  it('sellado es el ESTADO, no el rastro', () => {
    // Las colas 1-2 tienen `variantVerificacion` y NO están selladas: su
    // dictamen no cubría variante. Confundir las dos cosas fue el bug.
    expect(selladoDeVariante({ variantStatus: 'unchecked', variantVerificacion: 'revisión manual (informe-cola1)' })).toBe(false);
    expect(selladoDeVariante({ variantStatus: 'neutral' })).toBe(true);
    expect(selladoDeVariante({ variantStatus: 'divergent' })).toBe(true);
    expect(selladoDeVariante({ variantStatus: 'needs-human' })).toBe(false);
  });
  it('servible y cuarentena son complementarios', () => {
    for (const st of ['unchecked', 'neutral', 'divergent']) {
      expect(servibleAlAlumno({ variantStatus: st })).toBe(true);
      expect(enCuarentena({ variantStatus: st })).toBe(false);
    }
    expect(servibleAlAlumno({ variantStatus: 'needs-human' })).toBe(false);
    expect(enCuarentena({ variantStatus: 'needs-human' })).toBe(true);
  });
  it('escucha se reconoce por su sello', () => {
    expect(esDeEscucha({ variantVerificacion: 'par mínimo publicado E2#20' })).toBe(true);
    expect(esDeEscucha({ variantVerificacion: 'Cloze con pista E2#16' })).toBe(false);
  });

  it('NINGÚN script define su propia versión del criterio', () => {
    // El test que de verdad cierra la familia: si alguien vuelve a
    // escribir `const sellado = (x) => ...` en un script, esto falla.
    const dir = path.join(process.cwd(), 'scripts');
    const ficheros = fs.readdirSync(dir).filter((f) => f.endsWith('.ts'))
      .concat(fs.readdirSync(path.join(dir, 'lib')).filter((f) => f.endsWith('.ts')).map((f) => `lib/${f}`));
    const culpables: string[] = [];
    for (const f of ficheros) {
      if (f === 'lib/estado-item.ts') continue;
      const s = fs.readFileSync(path.join(dir, f), 'utf8');
      // Una definición local es la que asigna una FUNCIÓN, no la que
      // apunta al criterio compartido (`const sellado = selladoDeVariante`).
      if (/const\s+(sellado|servible|esEscucha|enCuarentena)\s*=\s*\(/.test(s)) culpables.push(f);
    }
    expect(culpables).toEqual([]);
  });
});

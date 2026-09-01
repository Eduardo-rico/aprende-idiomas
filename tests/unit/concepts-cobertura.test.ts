// tests/unit/concepts-cobertura.test.ts
//
// Un ítem publicado con `concepts: []` **no se cuenta en ningún punto**
// —el bucle de asignación itera `x.concepts`—, así que no está mal
// contado: es invisible para la tabla que gobierna el calendario. En
// E2#14 eran 109, el 4,5 % del corpus, y etiquetarlos cerró cinco puntos
// sin escribir un solo ítem.
//
// Este test es la puerta: impide que vuelva a acumularse en silencio.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CONCEPTS } from '@/lib/data/languages/pt/curriculum';
import { CONCEPTOS_FINOS } from '@/lib/data/languages/pt/conceptos-finos.generated';
import { PARTICIONES, TRANSVERSALES } from '@/scripts/lib/conceptos-finos';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const items: any[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) items.push(ex);

const decl = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs/plans/etiquetado-e2-14.json'), 'utf8'));
const declaradosSinPunto = new Set(
  Object.entries(decl).filter(([k, v]) => !k.startsWith('_') && v === null).map(([k]) => k));

const VALIDOS = new Set<string>([...ALL_CONCEPTS, ...CONCEPTOS_FINOS].map((c) => c.id));
for (const p of PARTICIONES) for (const s of p.subs) VALIDOS.add(s.id);
for (const t of TRANSVERSALES) VALIDOS.add(t.id);

describe('cobertura de `concepts`', () => {
  it('ningún ítem publicado se queda sin punto por olvido', () => {
    const huerfanos = items
      .filter((e) => !(e.concepts ?? []).length && !declaradosSinPunto.has(e.id))
      .map((e) => `${e.id} [${e.type}]`);
    expect(huerfanos).toEqual([]);
  });

  it('ninguna etiqueta se inventa un punto que no existe', () => {
    const malas = items.flatMap((e) =>
      (e.concepts ?? []).filter((c: string) => !VALIDOS.has(c)).map((c: string) => `${e.id}: ${c}`));
    expect(malas).toEqual([]);
  });

  it('los declarados SIN punto son una decisión escrita, no una lista vacía', () => {
    // Si alguien vacía el JSON para hacer pasar el primer test, este
    // falla: la exención tiene que existir y tener motivo al lado.
    expect(declaradosSinPunto.size).toBeGreaterThan(0);
    const motivos = Object.keys(decl).filter((k) => k.startsWith('_'));
    expect(motivos.length).toBeGreaterThanOrEqual(4);
  });
});

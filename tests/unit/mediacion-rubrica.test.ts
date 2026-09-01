// tests/unit/mediacion-rubrica.test.ts
//
// EL INVARIANTE: la casilla de la rúbrica propone una forma que el MODELO
// contiene. No es un detalle de estilo — la rúbrica es lo que CALIFICA, y
// una casilla que propone algo que el modelo no dice es una casilla que
// premia otra cosa que la respuesta trabajada.
//
// Nace de un caso real: tres rúbricas publicadas proponían «Informam-se
// que…», que no es gramatical (la pasiva impersonal con oración
// completiva va en singular: «Informa-se que…»; el plural pide sujeto
// expreso, «Informam-se os utentes de que…»). Sus propios modelos
// escribían «Informa-se». El alumno que obedecía la rúbrica escribía mal
// y la casilla lo aprobaba. Lo encontró una auditoría externa leyendo el
// par rúbrica↔modelo entero; el patrón ingenuo daba 44 falsos positivos
// de 46 porque las casillas dicen «o un equivalente» a propósito.
//
// Desde entonces `rubricaDe` DERIVA la propuesta del modelo, así que la
// clase es imposible por construcción. Este test lo fija.
import { describe, it, expect } from 'vitest';
import { rubricaDe, ITEMS as L12 } from '@/scripts/lotes/lote12-mediacion';
import { ITEMS as L14 } from '@/scripts/lotes/lote14-mediacion';
import { ITEMS as L15 } from '@/scripts/lotes/lote15-mediacion';

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();

describe('rúbrica de mediación', () => {
  const todos = [...L12, ...L14, ...L15];

  it('cubre los tres lotes publicados', () => {
    expect(todos.length).toBeGreaterThanOrEqual(70);
  });

  it('cada casilla propone una forma que el modelo USA', () => {
    for (const x of todos) {
      const modelo = norm(x.modelo);
      for (const c of rubricaDe(x)) {
        const m = c.match(/^¿Sustituye «[^»]+» por «([^»]+)»/);
        if (!m) continue;   // las casillas de dato y las negativas no proponen forma
        expect(modelo, `${x.id}: la casilla propone «${m[1]}» y el modelo no lo dice`)
          .toContain(norm(m[1]!));
      }
    }
  });

  it('«Informam-se que» no vuelve a aparecer en ninguna rúbrica ni modelo', () => {
    for (const x of todos) {
      expect(norm(x.modelo)).not.toContain('informam se que');
      for (const c of rubricaDe(x)) expect(norm(c)).not.toContain('informam se');
    }
  });
});

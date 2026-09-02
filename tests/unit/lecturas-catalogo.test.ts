// tests/unit/lecturas-catalogo.test.ts
//
// Invariantes del catálogo PÚBLICO de lectura PT, sobre las lecturas
// reales — no sobre un fixture. La Ola E3 los escribió al pasar el
// catálogo de 224 a 967 piezas; la fase F los sacó a
// `lecturas-catalogo.invariantes.ts` para que RO (y luego CS/RU) pasen
// LOS MISMOS sin copiarlos. Aquí sólo queda lo que es de PT: el piso
// medido y las variantes.
//
// Si una tanda nueva sube las cifras, se actualizan MEDIDAS con
// `node scripts/lectura/medir-catalogo.mjs pt` — nunca a ojo.
import { invariantesDelCatalogo } from './lecturas-catalogo.invariantes';

invariantesDelCatalogo({
  lang: 'pt',
  // E2#17: el campo pasa a ser OBLIGATORIO. Las 224 de la Ola L no lo
  // declaraban y heredaban 'pt' por un `?? 'pt'` copiado en tres sitios;
  // el default acertaba, que es justo lo que hace peligroso un valor
  // implícito. Ahora las 967 lo estampan y el gate exige el campo.
  variantes: ['pt', 'pt-br'],
  // Medido 2026-09-01 al cierre de E3: 967 lecturas · 52 series ·
  // 3.219.799 palabras (pt 2.091.688 · pt-br 1.128.111).
  lecturas: 967,
  palabras: 3_219_799,
  // La meta de inmersión del plan es PT-PT: el estante brasileño no la paga.
  inmersion: { variante: 'pt', palabras: 1_900_000 },
});

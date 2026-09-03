// tests/unit/check-bleed-docs.test.ts
//
// El gate de escrituras ajenas en los DOCUMENTOS de diseño, con los casos
// que tiene que cazar metidos como test — porque un gate visto sólo en
// verde no está probado.
//
// Nace de una ceguera medida el 2026-09-03 (Paso 0 de latín y griego):
// `check-bleed-docs` daba «Limpio» sobre un documento con miles de
// caracteres griegos dentro. Ahí el verde era correcto por accidente (el
// griego era legítimo en ese documento), pero el MISMO verde saldría con
// griego colado en el anexo del ruso — que es literalmente el escenario
// que hizo nacer este gate (dos ideogramas chinos donde debía decir
// «Операция „Ы“»).
//
// La protección para una escritura que el proyecto USA no puede ser
// bloquearla entera: `2026-07-28-curriculos-completos.md` lleva las
// cuatro lenguas en un solo fichero y el cirílico es legítimo ahí. Por
// eso el cirílico nunca estuvo en la lista de rangos prohibidos y su
// defensa era otra: el HOMÓGLIFO, la palabra que mezcla dos escrituras y
// que nadie distingue mirando. El griego necesita exactamente esa misma
// defensa, y por las mismas razones: ο (U+03BF) y o (U+006F) son
// indistinguibles en pantalla, y una letra latina dentro de una palabra
// griega la parte en dos en el TTS.
import { describe, it, expect } from 'vitest';
import { revisarLinea } from '@/scripts/check-bleed-docs';

const clases = (linea: string) => revisarLinea(linea, 'x.md', 1).map((h) => h.clase);

describe('check-bleed-docs · escrituras ajenas en bloque', () => {
  it('caza el ideograma chino que hizo nacer el gate', () => {
    const h = revisarLinea('el anexo decía 操作 donde iba «Операция»', 'x.md', 1);
    expect(h.map((x) => x.clase)).toContain('CJK (chino/japonés)');
  });

  it('no marca un documento de diseño corriente', () => {
    expect(revisarLinea('La ș rumana lleva coma, no cedilla.', 'x.md', 1)).toEqual([]);
  });
});

describe('check-bleed-docs · homóglifos, el caso invisible', () => {
  // El que ya cazaba: cirílico con latinas dentro.
  it('caza una palabra cirílica con letras latinas dentro', () => {
    // «обособление» con o y c LATINAS en lugar de о y с.
    const h = revisarLinea('la palabra oбocобление aparece en el anexo', 'x.md', 1);
    expect(h).toHaveLength(1);
    expect(h[0]!.clase).toMatch(/homóglifo/);
  });

  // Los que NO cazaba, y son los que abre el griego.
  it('caza una palabra GRIEGA con una latina dentro (o por ómicron)', () => {
    // λόγoς: la última vocal es o LATINA (U+006F), no ο (U+03BF).
    const h = revisarLinea('el término λόγoς abre el evangelio', 'x.md', 1);
    expect(h).toHaveLength(1);
    expect(h[0]!.clase).toMatch(/homóglifo/);
    // Lo único accionable es DÓNDE está la intrusa y qué punto de código es.
    expect(h[0]!.muestra).toContain('U+006F');
  });

  it('caza una palabra LATINA con una griega dentro (Rho por R)', () => {
    // Ρoma: la primera letra es Rho griega (U+03A1), no R latina.
    const h = revisarLinea('la ciudad de Ρoma cayó', 'x.md', 1);
    expect(h).toHaveLength(1);
    expect(h[0]!.muestra).toContain('U+03A1');
  });

  it('caza el griego mezclado con cirílico', () => {
    // Sin latinas por medio: la defensa no puede depender del latín.
    const h = revisarLinea('форма λόγoс rara', 'x.md', 1);
    expect(h.length).toBeGreaterThanOrEqual(1);
  });
});

describe('check-bleed-docs · lo que NO debe marcar (o el gate se apaga solo)', () => {
  it('deja pasar una palabra griega íntegra junto a prosa española', () => {
    expect(revisarLinea('el genitivo absoluto usa el participio: λέγοντος αὐτοῦ.', 'x.md', 1)).toEqual([]);
  });

  it('deja pasar politónico con espíritus, circunflejo y iota suscrita', () => {
    expect(revisarLinea('Ἀγαμέμνων, ᾳ suscrita, ἁ y ἀ, μῆνιν ἄειδε θεά', 'x.md', 1)).toEqual([]);
  });

  it('deja pasar el latín con mácrons', () => {
    expect(revisarLinea('Gallia est omnis dīvīsa in partēs trēs.', 'x.md', 1)).toEqual([]);
  });

  it('deja pasar cirílico íntegro', () => {
    expect(revisarLinea('la película «Операция „Ы“» de 1965', 'x.md', 1)).toEqual([]);
  });

  it('respeta la exención explícita por línea', () => {
    expect(clases('un ejemplo de 操作 <!-- bleed-ok: documenta el propio fallo -->')).toEqual([]);
  });
});

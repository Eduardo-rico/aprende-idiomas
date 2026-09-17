import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { LANGUAGES } from '@/lib/locales';
import { TITULO } from '@/scripts/paso0-idioma';

// ── POR QUÉ EXISTE (2026-09-17) ─────────────────────────────────────
//
// El griego antiguo llevaba DESDE EL 3 DE SEPTIEMBRE en `LANGUAGES`
// **sin currículo**, y nadie lo notó en dos semanas: se añadió con un
// Paso 0 que nunca pudo correr, y el fallo sólo se ve ejecutándolo a
// mano. El griego moderno entró igual el 13.
//
// Una lengua en el registro sin currículo no es medio idioma: es un
// idioma que **no se puede dimensionar**. El inventario de puntos se
// DERIVA del currículo, así que sin él no hay piso, no hay déficit y no
// hay forma de saber cuánto falta — que es justo lo que Edu pregunta.
//
// Esto no obliga a tener currículo: obliga a DECLARAR que no lo tienes.
// Una lengua puede estar legítimamente a cero —`grc` lo está por
// decisión de Edu, «los dos, moderno primero»— y entonces se pone en la
// lista de abajo, con su motivo. Lo que no puede es entrar sin que nadie
// se dé cuenta.

const CURRICULOS = 'docs/plans/2026-07-28-curriculos-completos.md';

/** Lenguas que HOY no tienen currículo, y por qué. Quitar una de aquí
 *  cuando se le escriba; añadir una obliga a escribir el motivo. */
const SIN_CURRICULO_DECLARADO: Partial<Record<(typeof LANGUAGES)[number], string>> = {
  el: 'Entró el 2026-09-13 por decisión de Edu («griego es griego moderno»). Su currículo es su PRIMER paso, antes del inventario, y pasa por el panel adversarial como pasaron los otros cinco.',
  grc: 'Entró el 2026-09-03 junto al latín, sin currículo y sin que nadie lo notara en dos semanas. Aparcado a cero por decisión de Edu («los dos, moderno primero»).',
};

describe('ninguna lengua del registro se queda sin currículo en silencio', () => {
  const doc = readFileSync(CURRICULOS, 'utf8');
  const secciones = [...doc.matchAll(/^## (.+)$/gm)].map((m) => m[1]!.trim());

  it('el extractor encuentra secciones de verdad', () => {
    // Sin esto, un cambio de formato en el documento dejaría la
    // comprobación de abajo en verde sobre una lista vacía — el cero que
    // sólo dice «no he mirado» (§A2 de la doctrina).
    expect(secciones.length, `no se hallaron secciones «## » en ${CURRICULOS}`).toBeGreaterThan(3);
  });

  for (const lang of LANGUAGES) {
    it(`${lang} (${TITULO[lang]}): tiene currículo, o está declarada sin él`, () => {
      const tiene = secciones.includes(TITULO[lang]);
      const declarada = SIN_CURRICULO_DECLARADO[lang];
      if (tiene) {
        expect(declarada, `${TITULO[lang]} YA tiene currículo: sácala de SIN_CURRICULO_DECLARADO`).toBeUndefined();
      } else {
        expect(
          declarada,
          `«## ${TITULO[lang]}» no está en ${CURRICULOS} y nadie lo ha declarado. ` +
            `Una lengua sin currículo no se puede dimensionar: el inventario se deriva de él. ` +
            `Escríbelo, o declara aquí por qué no lo tiene.`,
        ).toBeTruthy();
        expect(declarada!.length, `el motivo de ${lang} tiene que decir algo`).toBeGreaterThan(40);
      }
    });
  }
});

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// ── POR QUÉ EXISTE (2026-09-23) ─────────────────────────────────────
//
// El agente del latín encontró que NINGÚN gate de lote rechaza una
// alternativa que el ítem no pueda justificar: con `alternativas:
// ['timēret']` el ERROR DIANA se publicaba como respuesta buena con cero
// fallos. Lo cerró en su gate; los demás gates no lo miran.
//
// Medido sobre lo publicado ese día: 317 alternativas, y TODAS de dos
// clases legítimas —
//   · 248 son la respuesta SIN MÁCRONES (el texto real no los escribe, y
//     sin esa alternativa el ítem suspende a quien teclea lo que leyó);
//   · 69 sólo cambian el DETERMINANTE ESPAÑOL de la glosa («a la» /
//     «a una»), porque el latín no tiene artículo y las dos valen.
// Ninguna aceptaba otra forma latina. O sea que el agujero no había
// dejado pasar nada TODAVÍA.
//
// Este test lo mira sobre el dato FINAL —lo que el alumno ve—, no gate a
// gate: así cubre también los lotes cuyo gate no se ha revisado. Toda
// alternativa tiene que ser de una de esas dos clases, o estar en la
// lista de abajo con su motivo. Una alternativa que cambia la palabra de
// contenido es exactamente la forma que tiene el error diana de colarse.

const DIR = 'lib/data/languages/la/blocks';
const sinMacron = (x: string) => x.normalize('NFD').replace(/\p{Mn}/gu, '').normalize('NFC').toLowerCase().trim();
const DET = /(?<!\p{L})(el|la|los|las|un|una|unos|unas|al|del|a|de|su|sus|lo)(?!\p{L})/gu;
const nucleo = (x: string) => sinMacron(x).replace(DET, ' ').split(/\s+/).filter(Boolean).join(' ');

/** Alternativas que cambian la palabra de contenido Y son correctas, con
 *  su motivo. Vacío a propósito: la primera que entre tiene que decir
 *  por qué no es el error que su punto examina. */
const DECLARADAS: Record<string, string> = {};

function alternativas() {
  const out: Array<{ id: string; punto: string; respuesta: string; alt: string }> = [];
  for (const f of readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    for (const it of JSON.parse(readFileSync(join(DIR, f), 'utf8')) as Array<Record<string, any>>) {
      const d = it.data ?? {};
      const pares: Array<[string, string[]]> = [];
      if (Array.isArray(d.alternatives)) pares.push([String(d.answer ?? ''), d.alternatives]);
      for (const b of d.blanks ?? []) if (Array.isArray(b.alternatives)) pares.push([String(b.answer ?? ''), b.alternatives]);
      for (const [respuesta, alts] of pares) for (const alt of alts)
        out.push({ id: String(it.id), punto: String(it.concepts?.[0] ?? '?'), respuesta, alt: String(alt) });
    }
  }
  return out;
}

describe('ninguna alternativa publicada del latín acepta otra forma', () => {
  const todas = alternativas();

  it('el extractor ve alternativas de verdad', () => {
    // §A2: si cambia el formato, el test de abajo aprobaría sobre nada.
    expect(todas.length).toBeGreaterThan(200);
  });

  it('toda alternativa es la respuesta sin mácrón, o sólo cambia el determinante español', () => {
    const raras = todas.filter((a) =>
      sinMacron(a.alt) !== sinMacron(a.respuesta) &&
      nucleo(a.alt) !== nucleo(a.respuesta) &&
      !(`${a.id}:${a.alt}` in DECLARADAS));
    expect(
      raras.map((a) => `${a.id} (${a.punto}): clave «${a.respuesta}», acepta «${a.alt}»`),
      'alternativas que cambian la palabra de contenido — así es como el error diana se publica como respuesta buena',
    ).toEqual([]);
  });
});

// Exportado para el testigo en rojo.
export { nucleo, sinMacron };

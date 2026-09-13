import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// ── POR QUÉ EXISTE ESTE TEST (2026-09-12) ───────────────────────────
//
// Hay marcas que la lengua distingue y que el texto real NO ESCRIBE:
//
//   · el MÁCRÓN latino — 0 en los 227.301 tokens del corpus;
//   · la Ё rusa — 1.295 de 1.488 lecturas no la escriben NUNCA.
//
// Así que una clave que las lleve **suspende a quien teclea lo que ha
// leído**, que es el error simétrico exacto. Los dos equipos lo
// resolvieron ÍTEM POR ÍTEM y bien —139 respuestas latinas con mácrón y
// 1 rusa con ё, y las 140 traen su alternativa sin la marca, medido—
// pero el mecanismo central de las dos lenguas (`comparaLa` con
// `sensibleACantidad`, `variantesSinYo`) **no está conectado a ninguna
// tarjeta**: funciona porque cada autor se acordó.
//
// Este test convierte «se acordaron» en «no se puede olvidar». No
// reimplementa la normalización —eso es como se desincronizan las
// reglas— sino que exige el DATO: si la respuesta lleva la marca, tiene
// que haber una alternativa sin ella.
//
// ⚠ Y con su EXCEPCIÓN declarada, porque si no sería «la normalización
// tapa el rasgo examinado»: los puntos cuyo CONTENIDO ES la marca deben
// exigirla, o el ítem no podría fallar nunca.

const MARCAS = [
  {
    lang: 'la',
    nombre: 'mácrón',
    re: /[āēīōūȳĀĒĪŌŪȲ]/,
    // Puntos cuyo tema ES la cantidad vocálica: ahí la marca se exige.
    examinan: new Set(['l1-cantidad-fonemica', 'l1-larga-por-posicion']),
  },
  {
    lang: 'ru',
    nombre: 'ё',
    re: /[ёЁ]/,
    examinan: new Set(['u1-yo-doble-ortografia']),
  },
] as const;

function items(lang: string): Array<Record<string, unknown>> {
  const dir = `lib/data/languages/${lang}/blocks`;
  let ficheros: string[];
  try { ficheros = readdirSync(dir).filter((f) => f.endsWith('.json')); }
  catch { return []; }
  const out: Array<Record<string, unknown>> = [];
  for (const f of ficheros) {
    const raw = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const arr = Array.isArray(raw) ? raw : ((raw as { items?: unknown[] }).items ?? []);
    for (const it of arr) out.push(it as Record<string, unknown>);
  }
  return out;
}

/** Respuestas y alternativas de un ítem, sea cual sea su formato. */
function clavesDe(it: Record<string, unknown>) {
  const d = (it.data ?? {}) as Record<string, unknown>;
  const respuestas: string[] = [];
  const alternativas: string[] = [];
  const empuja = (dst: string[], v: unknown) => {
    if (typeof v === 'string' && v.trim()) dst.push(v);
    else if (Array.isArray(v)) for (const x of v) empuja(dst, x);
  };
  for (const k of ['answer', 'respuesta', 'correct', 'solution']) empuja(respuestas, d[k]);
  empuja(alternativas, d.alternatives);
  for (const b of (d.blanks as Array<Record<string, unknown>> | undefined) ?? []) {
    empuja(respuestas, b.answer);
    empuja(alternativas, b.alternatives);
  }
  return { respuestas, alternativas };
}

describe('una clave no puede exigir una marca que el texto real no escribe', () => {
  for (const m of MARCAS) {
    it(`${m.lang}: toda respuesta con ${m.nombre} trae su alternativa sin ${m.nombre}`, () => {
      const todos = items(m.lang);
      let conMarca = 0;
      const malos: string[] = [];
      for (const it of todos) {
        const puntos = (it.concepts as string[] | undefined) ?? [];
        if (puntos.some((p) => m.examinan.has(p))) continue; // la exige a propósito
        const { respuestas, alternativas } = clavesDe(it);
        const sinMarca = alternativas.filter((a) => !m.re.test(a));
        for (const r of respuestas) {
          if (!m.re.test(r)) continue;
          conMarca++;
          if (sinMarca.length === 0) malos.push(`${String(it.id)} «${r}» (${puntos.join(',')})`);
        }
      }
      expect(malos, `respuestas que suspenden a quien no teclea el ${m.nombre}:\n  ${malos.join('\n  ')}`).toEqual([]);
      // CONTROL: si el extractor dejara de encontrar respuestas, lo de
      // arriba saldría verde sobre una lista vacía. Es el fallo que este
      // proyecto ha pagado cuatro veces: el cero que sólo dice «no miré».
      if (todos.length > 0) {
        expect(conMarca, `${m.lang} tiene ${todos.length} ítems y el extractor no halló ni una respuesta con ${m.nombre}: ¿sigue leyendo el formato?`).toBeGreaterThan(0);
      }
    });
  }

  it('el extractor ve ítems de verdad en las dos lenguas', () => {
    expect(items('la').length, 'la').toBeGreaterThan(100);
    expect(items('ru').length, 'ru').toBeGreaterThan(0);
  });
});

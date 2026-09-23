// scripts/cita-ru.ts — DE DÓNDE SALE UNA CITA, leído del corpus y no de la memoria.
//
//   npx tsx scripts/cita-ru.ts "Местов много"
//   npx tsx scripts/cita-ru.ts "Местов много" --autor Достоевский     # exit 1: mal atribuida
//   npx tsx scripts/cita-ru.ts "Местов много" --autor Чехов --obra "Гордый человек"
//
// ── POR QUÉ EXISTE ───────────────────────────────────────────────────
// Dos lotes seguidos (§71 y §78 del relevo) publicaron una cita atribuida a
// la obra o al hablante equivocados, y el segundo lo hizo CON la regla del
// primero escrita delante («localiza la fuente con `grep -l` antes de escribir
// el campo»). El §78 dice el mecanismo exacto: la lista de obras salía de un
// comando y las citas de otro, y se EMPAREJARON DE MEMORIA. Cuando una regla
// escrita falla dos veces, no hace falta una regla mejor: hace falta que el
// paso que falla no dependa de acordarse. Esta herramienta devuelve, para
// una cadena, el FICHERO, el AUTOR, la OBRA y el PÁRRAFO donde aparece, en
// una sola salida — la cita y su obra salen juntas, no se casan después.
//
// ── LO QUE COMPRUEBA Y LO QUE NO ─────────────────────────────────────
// - `localizarCita()` encuentra la cadena, con la ё plegada (el corpus es
//   bimodal por edición: 1.295 lecturas no la escriben nunca) y sin
//   distinguir mayúsculas (la v0 del localizador del §78 perdía la cita que
//   abría una réplica con mayúscula). Devuelve el párrafo ENTERO y sus dos
//   vecinos, porque en el diálogo quien habla suele estar en el párrafo de
//   antes.
// - `verificarCita()` comprueba AUTOR y OBRA contra los metadatos del fichero.
//   Es la parte que falló dos veces y la que se puede automatizar.
// - ⚠ El HABLANTE no se puede comprobar desde los metadatos. `enContexto`
//   exige que unas palabras aparezcan en el párrafo o en sus vecinos, y eso
//   es una condición NECESARIA, no suficiente: que «брюнет» esté en el
//   párrafo no dice que el брюнет sea quien habla (en «Гордый человек» está,
//   y es a quien le hablan). Por eso la salida imprime el párrafo: el
//   hablante se LEE en la salida de esta herramienta, nunca en otra.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'lib/data/languages/ru/lecturas';

export interface Parrafo { i: number; texto: string; plegado: string }
export interface Lectura { fichero: string; id: string; autor: string; titulo: string; serie: string; parrafos: Parrafo[] }

let cache: Lectura[] | null = null;

/** El texto de un párrafo. En modo karaoke el párrafo es un objeto con
 *  `texto` y `palabras[]`; se lee SÓLO `texto`, porque recorrer las hojas del
 *  objeto duplicaría cada palabra (y `JSON.stringify` fabricó en su día 167
 *  «homóglifos» que eran un `\n` escapado: §3.3). */
function textoDe(p: unknown): string | null {
  if (typeof p === 'string') return p;
  if (p && typeof p === 'object' && typeof (p as { texto?: unknown }).texto === 'string') return (p as { texto: string }).texto;
  return null;
}

export function lecturas(): Lectura[] {
  if (cache) return cache;
  const out: Lectura[] = [];
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json')).sort()) {
    const d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as Record<string, unknown>;
    const ps = Array.isArray(d.parrafos) ? d.parrafos : [];
    const parrafos: Parrafo[] = [];
    ps.forEach((p, i) => { const t = textoDe(p); if (t !== null) parrafos.push({ i, texto: t, plegado: plegar(t) }); });
    out.push({
      fichero: f, id: String(d.id ?? f.replace(/\.json$/, '')), autor: String(d.autor ?? ''),
      titulo: String(d.titulo ?? ''), serie: String((d.serie as { titulo?: string } | undefined)?.titulo ?? ''), parrafos,
    });
  }
  if (out.length === 0) throw new Error(`cita-ru: 0 lecturas en ${DIR} — un cero aquí es «no he mirado», no «no está» (§A2)`);
  cache = out;
  return out;
}

/** Plegado para BUSCAR: ё→е, minúsculas, espacios colapsados, y las comillas
 *  y guiones tipográficos a su forma simple. No se usa para comparar
 *  respuestas: sólo para encontrar la cadena en un texto de otra edición. */
export function plegar(s: string): string {
  return s.normalize('NFC').toLowerCase().replace(/ё/g, 'е')
    .replace(/[«»„“”"]/g, '"').replace(/[—–]/g, '-').replace(/…/g, '...').replace(/\s+/g, ' ').trim();
}

export interface Hallazgo {
  fichero: string; id: string; autor: string; titulo: string; serie: string;
  parrafo: number; texto: string; anterior: string | null; siguiente: string | null;
}

export function localizarCita(cadena: string): Hallazgo[] {
  const q = plegar(cadena);
  if (q.length < 6) throw new Error(`cita-ru: «${cadena}» es demasiado corta para localizar una CITA (mínimo 6 caracteres plegados); para contar una forma usa scripts/corpus-ru.ts`);
  const out: Hallazgo[] = [];
  for (const l of lecturas()) {
    l.parrafos.forEach((p, k) => {
      if (!p.plegado.includes(q)) return;
      out.push({
        fichero: l.fichero, id: l.id, autor: l.autor, titulo: l.titulo, serie: l.serie, parrafo: p.i, texto: p.texto,
        anterior: l.parrafos[k - 1]?.texto ?? null, siguiente: l.parrafos[k + 1]?.texto ?? null,
      });
    });
  }
  return out;
}

/** Lo que el material AFIRMA de una cita. `autor` y `obra` se comparan
 *  plegados y por inclusión (`Чехов` casa con «Антон Чехов»; `obra` casa con
 *  el título, la serie o el id del fichero). */
export interface CitaDeclarada {
  cita: string;
  autor?: string;
  obra?: string;
  /** Palabras que tienen que estar en el párrafo o en sus vecinos.
   *  NECESARIO, NO SUFICIENTE para el hablante: ver la cabecera. */
  enContexto?: string[];
}

export interface Veredicto { ok: boolean; hallazgos: Hallazgo[]; problemas: string[] }

export function verificarCita(c: CitaDeclarada): Veredicto {
  const hallazgos = localizarCita(c.cita);
  const problemas: string[] = [];
  if (hallazgos.length === 0) {
    problemas.push(`«${c.cita}» NO aparece en ninguna de las ${lecturas().length} lecturas`);
    return { ok: false, hallazgos, problemas };
  }
  const casa = (h: Hallazgo): string[] => {
    const p: string[] = [];
    if (c.autor && !plegar(h.autor).includes(plegar(c.autor))) p.push(`autor «${h.autor}», no «${c.autor}»`);
    if (c.obra) {
      const o = plegar(c.obra);
      if (![h.titulo, h.serie, h.id].some((x) => plegar(x).includes(o))) p.push(`obra «${h.titulo}» (${h.serie}), no «${c.obra}»`);
    }
    for (const w of c.enContexto ?? []) {
      const ctx = plegar([h.anterior ?? '', h.texto, h.siguiente ?? ''].join(' '));
      if (!ctx.includes(plegar(w))) p.push(`«${w}» no está en el párrafo ni en sus vecinos`);
    }
    return p;
  };
  const porHallazgo = hallazgos.map(casa);
  // Basta con que UNA aparición case: la misma cadena puede estar en dos
  // obras y la declaración señala una. Si ninguna casa, se dicen todas.
  if (!porHallazgo.some((p) => p.length === 0)) {
    hallazgos.forEach((h, k) => problemas.push(`${h.fichero} §${h.parrafo}: ${porHallazgo[k]!.join('; ')}`));
  }
  return { ok: problemas.length === 0, hallazgos, problemas };
}

if (/[/\\]cita-ru\.ts$/.test(process.argv[1] ?? '')) {
  const args = process.argv.slice(2);
  const opt = (n: string) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const libres = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1]!.startsWith('--')));
  const cita = libres[0];
  if (!cita) { console.error('uso: npx tsx scripts/cita-ru.ts "<cita>" [--autor X] [--obra Y] [--contexto palabra]'); process.exit(2); }
  const v = verificarCita({ cita, autor: opt('--autor'), obra: opt('--obra'), enContexto: opt('--contexto') ? [opt('--contexto')!] : undefined });
  console.log(`«${cita}» — ${v.hallazgos.length} aparición(es) en ${lecturas().length} lecturas\n`);
  for (const h of v.hallazgos) {
    console.log(`■ ${h.fichero}  §${h.parrafo}\n  ${h.autor} — «${h.titulo}» (${h.serie})`);
    if (h.anterior) console.log(`  [antes] ${h.anterior.slice(-300)}`);
    console.log(`  [PÁRRAFO] ${h.texto}`);
    if (h.siguiente) console.log(`  [después] ${h.siguiente.slice(0, 300)}`);
    console.log('');
  }
  if (!v.ok) { console.log('✗ LA ATRIBUCIÓN DECLARADA NO CASA:'); for (const p of v.problemas) console.log(`  - ${p}`); process.exit(1); }
  if (opt('--autor') || opt('--obra')) console.log('✓ autor/obra casan. ⚠ El HABLANTE se lee en el párrafo de arriba: esta herramienta no lo certifica.');
}

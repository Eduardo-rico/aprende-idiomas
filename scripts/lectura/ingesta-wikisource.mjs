// Ingesta por TANDAS de obras de Wikisource a la biblioteca de un idioma.
//
// Es el motor de la fase F (RO/CS/RU): lo que `ingesta-gutenberg.mjs`
// hace con los TXT de Gutenberg, éste lo hace con las páginas de
// `<lang>.wikisource.org`, que es donde vive la literatura rumana de
// dominio público (Gutenberg tiene casi nada en rumano). Mismo circuito:
// descargar → gate de procedencia → limpiar → segmentar → medir →
// publicar JSON de `modo: 'texto'`. Cero TTS, cero créditos.
//
// uso: node scripts/lectura/ingesta-wikisource.mjs <tanda.json> [--lang ro]
//        [--solo slug] [--dry] [--piezas] [--rehacer]
//
// La tanda es un array de obras:
// {
//   "slug": "amintiri-din-copilarie", "titulo": "Amintiri din copilărie",
//   "autor": "Ion Creangă", "muerteAutor": 1889, "publicacion": 1881,
//   "modo": "entero" | "secciones" | "subpaginas" | "coleccion",
//   "pagina": "Amintiri din copilărie",     // entero / secciones / subpaginas
//   "paginas": ["Capra cu trei iezi", …],   // coleccion: lista explícita, en orden
//   "autorPagina": "Ion Creangă",           // coleccion: o bien la sección de la
//   "seccion": "Povești",                   //   página Autor:, en el orden del volumen
//   "excluir": ["Prefață la poveștile mele"],
//   "agrupar": 1800,        // capítulos/secciones que se juntan hasta N palabras
//   "minPalabras": 200,     // una pieza más corta al principio/final es portadilla
//   "nivel": "B1",          // declarado: si falta, lo mide `medir-nivel.mjs`
//   "versos": true,         // poesía: los saltos de línea son forma
//   "etiquetaPieza": "Capitolul",
//   "edicion": "Opere, Editura Minerva, 1970",   // opcional, va a `fuente`
//   "notaOrtografia": "…"   // opcional: se AÑADE a la nota medida
// }
//
// LO QUE ESTE SCRIPT HACE Y POR QUÉ (pagado en PT o medido aquí):
// - Trabaja sobre el HTML parseado (`action=parse`), no sobre el wikitext
//   ni sobre `prop=extracts`: el extract pierde la diferencia entre salto
//   de párrafo y salto de línea duro (Moara cu noroc trae las líneas
//   cortadas a ~70 columnas DENTRO de cada <p>), y las tablas/notas.
// - Fuera el aparato de Wikisource: cabecera, navegación, licencia,
//   índice, números de página del escaneo, y TODAS las notas al pie
//   (`sup.reference`, `ol.references`, sección «Note»). Las notas son
//   el único sitio donde vive el aparato de un editor MODERNO (la
//   edición Minerva de Odobescu explica a Ovidio en la nota 132): al
//   quitarlas queda sólo el texto del autor, que es lo libre.
// - Diacríticos a la norma de la Academia: ș/ț con COMA (U+0219/U+021B),
//   nunca cedilla. La grafía de época (î interior, «sînt») NO se toca y
//   se declara medida en `notaOrtografia`.
// - Gate de diacríticos: un texto sin ă/â/î/ș/ț no es rumano correcto
//   y no entra (la web está llena de transcripciones sin diacríticos).
// - Las páginas duplicadas por cedilla («Mara/Ani de tinereţe» y
//   «Mara/Ani de tinerețe» existen las dos) se deduplican por título
//   normalizado; se prefiere la que existe con coma.
// - Palabra = algo con una LETRA dentro. Contar tokens contaba rayas.
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { verificarProcedencia, dominioPublico } from './gate-procedencia.mjs';
import { densidad, nivelPorDensidad, pisoPorEscala, mayorNivel } from './medir-nivel.mjs';
import { normalizarDiacriticos, gateDiacriticos, medirGrafia, contarPalabras } from './texto-ro.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const valor = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const tandaPath = args.find((a) => a.endsWith('.json'));
if (!tandaPath) { console.error('uso: node ingesta-wikisource.mjs <tanda.json> [--lang ro] [--solo slug] [--dry] [--piezas] [--rehacer]'); process.exit(1); }
const LANG = valor('--lang', 'ro');
const DRY = flag('--dry');
const SOLO = valor('--solo', null);
const PIEZAS = flag('--piezas');
const REHACER = flag('--rehacer');

const HOST = `https://${LANG}.wikisource.org`;
const CACHE = path.join(process.cwd(), 'scripts/.cache/lectura', `ws-${LANG}`);
const SALIDA = path.join(process.cwd(), 'lib/data/languages', LANG, 'lecturas');
fs.mkdirSync(CACHE, { recursive: true });
if (!DRY) fs.mkdirSync(SALIDA, { recursive: true });
const UA = { 'user-agent': 'aprende-idiomas-lectura/1.0 (https://github.com/; emrs94@gmail.com)' };

const slugify = (t) => t.toLowerCase()
  .replace(/ș/g, 's').replace(/ț/g, 't').replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── descarga (con caché en disco) ────────────────────────────────
async function api(params) {
  const u = new URL(`${HOST}/w/api.php`);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set('format', 'json');
  for (let intento = 0; intento < 4; intento++) {
    try {
      const r = await fetch(u, { headers: UA });
      if (r.ok) return r.json();
      if (r.status === 429 || r.status >= 500) { await new Promise((ok) => setTimeout(ok, 1500 * (intento + 1))); continue; }
      throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      if (intento === 3) throw e;
      await new Promise((ok) => setTimeout(ok, 1500 * (intento + 1)));
    }
  }
}

/** HTML parseado de una página; `null` si no existe. */
async function bajarHtml(titulo) {
  const f = path.join(CACHE, `${slugify(titulo)}-${hash(titulo)}.html`);
  if (fs.existsSync(f)) {
    const t = fs.readFileSync(f, 'utf8');
    return t === '' ? null : t;
  }
  const d = await api({ action: 'parse', page: titulo, prop: 'text', disableeditsection: 1, redirects: 1 });
  if (d.error) {
    if (d.error.code === 'missingtitle') { fs.writeFileSync(f, ''); return null; }
    throw new Error(`${titulo}: ${d.error.info}`);
  }
  const html = d.parse.text['*'];
  fs.writeFileSync(f, html);
  return html;
}

function hash(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.codePointAt(0)) >>> 0;
  return h.toString(36);
}

/** Wikitext crudo de una página (para leer la página Autor: en orden). */
async function bajarRaw(titulo) {
  const f = path.join(CACHE, `raw-${slugify(titulo)}-${hash(titulo)}.txt`);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const r = await fetch(`${HOST}/w/index.php?title=${encodeURIComponent(titulo)}&action=raw`, { headers: UA });
  if (!r.ok) throw new Error(`${titulo}: HTTP ${r.status}`);
  const t = await r.text();
  fs.writeFileSync(f, t);
  return t;
}

// ── HTML → bloques ───────────────────────────────────────────────
//
// Un bloque es {h: nivel, texto} (encabezado) o {texto, versos?}
// (párrafo). Se recorre el cuerpo EN ORDEN, no por selector: el orden
// es el capítulo.
const QUITAR = [
  '.ws-header', '.ws-noexport', '#ws-data', 'style', 'script', '.mw-editsection',
  'sup.reference', 'ol.references', '.references', '.reflist', 'span.pagenum', 'img',
  '.navbox', '.licence', '.licenta', '#toc', '.toc', '.mw-cite-backlink', 'meta', 'link',
  '.wst-header', '.headertemplate', '.header_notes', '.plainSister', 'table.navbox',
  // La ilustración y su pie («Greuceanu artwork») no son texto del autor.
  'figure', 'figcaption', '.thumb', '.gallery', '.mw-halign-left', '.mw-halign-right',
];
const NOTAS = /^(note|notă|nota|referințe|referinţe|cuprins|surse|bibliografie)\b/i;

function bloquesDe(html) {
  const dom = new JSDOM(`<body>${html}</body>`);
  const doc = dom.window.document;
  for (const sel of QUITAR) for (const n of doc.querySelectorAll(sel)) n.remove();
  // comentarios HTML
  const walker = doc.createTreeWalker(doc.body, 128 /* COMMENT */);
  const coms = [];
  while (walker.nextNode()) coms.push(walker.currentNode);
  for (const c of coms) c.remove();

  const bloques = [];
  const tablas = { n: 0, palabras: 0 };
  const limpiar = (s) => normalizarDiacriticos(s).replace(/ /g, ' ').replace(/[ \t\r\f\v]+/g, ' ');
  const prosa = (s) => limpiar(s.replace(/\s*\n\s*/g, ' ')).trim();
  const versos = (s) => limpiar(s).split('\n').map((l) => l.trim()).filter(Boolean).join('\n');

  // Un <p> con <br> dentro es verso (Eminescu mete estrofas en la
  // prosa de Sărmanul Dionis; los <div class="poem"> son <p> con <br>).
  // Se parte en estrofas por línea en blanco y cada estrofa es párrafo.
  const textoConSaltos = (el) => {
    const clon = el.cloneNode(true);
    for (const br of clon.querySelectorAll('br')) br.replaceWith('\n');
    return clon.textContent;
  };
  const meterVersos = (el) => {
    const t = versos(textoConSaltos(el).replace(/\n[ \t]*\n/g, '\n\n'));
    for (const estrofa of textoConSaltos(el).split(/\n[ \t]*\n/)) {
      const v = versos(estrofa);
      if (v) bloques.push({ texto: v, versos: true });
    }
    return t;
  };

  const visitar = (el) => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { // texto suelto fuera de <p>
        const t = prosa(n.textContent);
        if (t) bloques.push({ texto: t });
        continue;
      }
      if (n.nodeType !== 1) continue;
      const tag = n.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) { bloques.push({ h: Number(tag[1]), texto: prosa(n.textContent) }); continue; }
      if (tag === 'table') { tablas.n += 1; tablas.palabras += contarPalabras([{ texto: n.textContent }]); continue; }
      // Una <dl> de varias <dd> es una estrofa indentada con «:» en el
      // wikitext (la canción de la capra en Creangă: «Frunze-n buze, /
      // Lapte-n țâțe»): se publica como UN párrafo de versos, no como
      // ocho párrafos de dos palabras.
      if (tag === 'dl') {
        const dds = [...n.children].filter((c) => /^d[dt]$/i.test(c.tagName));
        if (dds.length >= 2 && !dds.some((d) => d.querySelector('p, dl, div'))) {
          const lineas = dds.map((d) => prosa(textoConSaltos(d))).filter(Boolean);
          if (lineas.length) bloques.push({ texto: lineas.join('\n'), versos: true });
          continue;
        }
        visitar(n); continue;
      }
      if (tag === 'p' || tag === 'dd' || tag === 'dt' || tag === 'li' || tag === 'pre' || tag === 'blockquote' && !n.querySelector('p')) {
        if (n.querySelector('br')) meterVersos(n);
        else if (n.querySelector('div.poem')) visitar(n);
        else { const t = prosa(n.textContent); if (t) bloques.push({ texto: t }); }
        continue;
      }
      if (n.classList.contains('poem')) { meterVersos(n); continue; }
      visitar(n); // div, span, center, dl, ul, ol, section…
    }
  };
  visitar(doc.body);

  // Fuera la sección de notas (y lo que cuelga de ella hasta el
  // siguiente encabezado del mismo nivel o superior).
  const out = [];
  let saltando = null;
  for (const b of bloques) {
    if (b.h !== undefined) {
      if (saltando !== null && b.h <= saltando) saltando = null;
      if (saltando === null && NOTAS.test(b.texto)) { saltando = b.h; continue; }
    }
    if (saltando === null) out.push(b);
  }
  return { bloques: out, tablas };
}

const palabrasDe = (bloques) => contarPalabras(bloques.filter((b) => b.h === undefined));

// ── segmentación ─────────────────────────────────────────────────

/** Nivel de encabezado que parte la obra: el más frecuente con ≥2
 *  apariciones, prefiriendo el más alto (h2 antes que h3). */
function nivelDeCorte(bloques) {
  const cuenta = new Map();
  for (const b of bloques) if (b.h !== undefined) cuenta.set(b.h, (cuenta.get(b.h) ?? 0) + 1);
  const candidatos = [...cuenta.entries()].filter(([, n]) => n >= 2).sort((a, b) => a[0] - b[0]);
  return candidatos.length ? candidatos[0][0] : null;
}

/** Parte los bloques en {titulo, bloques} por encabezados de `nivel`.
 *  Lo anterior al primer encabezado es el preámbulo. Los encabezados
 *  de nivel inferior se quedan DENTRO como párrafo (son escenas,
 *  secciones numeradas de un capítulo). */
function partirPorEncabezados(bloques, nivel) {
  const trozos = [];
  let actual = { titulo: null, bloques: [] };
  for (const b of bloques) {
    if (b.h !== undefined && b.h <= nivel) {
      trozos.push(actual);
      actual = { titulo: b.texto, bloques: [] };
      continue;
    }
    if (b.h !== undefined) { if (b.texto) actual.bloques.push({ texto: b.texto }); continue; }
    actual.bloques.push(b);
  }
  trozos.push(actual);
  const preambulo = trozos.shift();
  return { preambulo, trozos };
}

/** Agrupa trozos consecutivos hasta `objetivo` palabras (mismo criterio
 *  que la ingesta de Gutenberg: capítulos minúsculos no son lectura).
 *  El título de cada trozo agrupado entra como párrafo propio. */
function agrupar(trozos, objetivo) {
  if (!objetivo) return trozos.map((t) => ({ titulos: [t.titulo], bloques: t.bloques, palabras: palabrasDe(t.bloques) }));
  const grupos = [];
  let actual = null;
  for (const t of trozos) {
    if (!actual) actual = { trozos: [], palabras: 0 };
    actual.trozos.push(t);
    actual.palabras += palabrasDe(t.bloques);
    if (actual.palabras >= objetivo) { grupos.push(actual); actual = null; }
  }
  if (actual) {
    if (grupos.length && actual.palabras < objetivo / 2) {
      const u = grupos.at(-1);
      u.trozos.push(...actual.trozos); u.palabras += actual.palabras;
    } else grupos.push(actual);
  }
  // Un capítulo suelto no lleva su marcador dentro (el título de la
  // pieza lo sustituye); un grupo de varios sí, como párrafo propio.
  return grupos.map((g) => ({
    titulos: g.trozos.map((t) => t.titulo),
    palabras: g.palabras,
    bloques: g.trozos.length === 1 ? g.trozos[0].bloques
      : g.trozos.flatMap((t) => (t.titulo ? [{ texto: t.titulo }, ...t.bloques] : t.bloques)),
  }));
}

/** Enlaces a subpáginas «Título/…» de la página madre, en orden y sin
 *  duplicados por cedilla. */
function subpaginasDe(html, pagina) {
  const dom = new JSDOM(`<body>${html}</body>`);
  const pref = `/wiki/${encodeURI(pagina.replace(/ /g, '_'))}/`;
  const vistos = new Map();
  for (const a of dom.window.document.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    let dec;
    try { dec = decodeURIComponent(href); } catch { continue; }
    if (!dec.startsWith(decodeURIComponent(pref))) continue;
    const titulo = normalizarDiacriticos(dec.slice('/wiki/'.length).replace(/_/g, ' ').split('#')[0]);
    if (vistos.has(titulo)) continue;
    vistos.set(titulo, { titulo, texto: normalizarDiacriticos(a.textContent.trim()), rojo: a.classList.contains('new') });
  }
  return [...vistos.values()];
}

/** Enlaces de una sección de la página Autor:, en el orden del volumen. */
function enlacesDeSeccion(raw, seccion) {
  const lineas = raw.replace(/\r\n/g, '\n').split('\n');
  const norm = (s) => normalizarDiacriticos(s).replace(/[=\s]+/g, ' ').trim().toLowerCase();
  const i = lineas.findIndex((l) => /^=+/.test(l) && norm(l) === norm(seccion));
  if (i < 0) throw new Error(`sección «${seccion}» no está en la página Autor:`);
  const nivel = (lineas[i].match(/^=+/) ?? [''])[0].length;
  const out = [];
  for (let k = i + 1; k < lineas.length; k++) {
    const m = lineas[k].match(/^(=+)[^=]/);
    if (m && m[1].length <= nivel) break;
    for (const e of lineas[k].matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g)) {
      const t = normalizarDiacriticos(e[1].trim());
      if (/^(Imagine|Fișier|File|Image|Categorie|Autor|Format):/i.test(t)) continue;
      out.push({ titulo: t, texto: normalizarDiacriticos((e[2] ?? e[1]).trim()) });
    }
  }
  return out;
}

// ── ingesta de una obra ──────────────────────────────────────────
async function ingerir(obra) {
  const min = obra.minPalabras ?? 200;
  const dp = dominioPublico(obra.muerteAutor, obra.publicacion);
  if (!dp.libre) throw new Error(`NO libre — UE ${dp.ue} · MX ${dp.mx} · US ${dp.us ?? '?'}`);

  // 1) piezas crudas: [{titulo, bloques, pagina}]
  let crudas = [];
  let preambulo = null;
  let tablas = { n: 0, palabras: 0 };
  const suma = (t) => { tablas.n += t.n; tablas.palabras += t.palabras; };
  const rojas = [];
  let fuenteTitulo = obra.pagina ?? obra.autorPagina ?? obra.titulo;

  if (obra.modo === 'entero' || obra.modo === 'secciones') {
    const html = await bajarHtml(obra.pagina);
    if (!html) throw new Error(`la página «${obra.pagina}» no existe`);
    const b = bloquesDe(html); suma(b.tablas);
    if (obra.modo === 'entero') {
      crudas = [{ titulo: obra.titulo, bloques: b.bloques.map((x) => (x.h !== undefined ? { texto: x.texto } : x)) }];
    } else {
      const nivel = obra.nivelSeccion ?? nivelDeCorte(b.bloques);
      if (nivel === null) throw new Error('sin encabezados repetidos — usa modo «entero» o declara nivelSeccion');
      const p = partirPorEncabezados(b.bloques, nivel);
      preambulo = p.preambulo;
      crudas = p.trozos;
    }
  } else if (obra.modo === 'subpaginas') {
    const html = await bajarHtml(obra.pagina);
    if (!html) throw new Error(`la página madre «${obra.pagina}» no existe`);
    const subs = subpaginasDe(html, obra.pagina).filter((s) => !(obra.excluir ?? []).includes(s.texto) && !(obra.excluir ?? []).includes(s.titulo));
    if (subs.length < 2) throw new Error(`la página madre sólo enlaza ${subs.length} subpáginas`);
    for (const s of subs) {
      const h = await bajarHtml(s.titulo);
      if (!h) { rojas.push(s.titulo); continue; }
      const b = bloquesDe(h); suma(b.tablas);
      crudas.push({ titulo: s.texto, bloques: b.bloques.map((x) => (x.h !== undefined ? { texto: x.texto } : x)), pagina: s.titulo });
    }
    if (rojas.length) throw new Error(`${rojas.length} subpáginas no existen (${rojas.slice(0, 3).join(', ')}) — me niego a publicar la obra incompleta`);
  } else if (obra.modo === 'coleccion') {
    let lista;
    if (obra.paginas) lista = obra.paginas.map((p) => (typeof p === 'string' ? { titulo: p, texto: p.replace(/ \([^)]*\)$/, '') } : p));
    else lista = enlacesDeSeccion(await bajarRaw(`Autor:${obra.autorPagina}`), obra.seccion);
    const excluir = new Set((obra.excluir ?? []).map(normalizarDiacriticos));
    lista = lista.filter((e) => !excluir.has(e.titulo) && !excluir.has(e.texto));
    const vistos = new Set();
    for (const e of lista) {
      if (vistos.has(e.titulo)) continue;
      vistos.add(e.titulo);
      const h = await bajarHtml(e.titulo);
      if (!h) { rojas.push(e.titulo); continue; }
      const b = bloquesDe(h); suma(b.tablas);
      crudas.push({ titulo: e.texto, bloques: b.bloques.map((x) => (x.h !== undefined ? { texto: x.texto } : x)), pagina: e.titulo });
    }
    if (!crudas.length) throw new Error('la colección no tiene ni una página existente');
  } else throw new Error(`modo desconocido «${obra.modo}»`);

  // 2) preámbulo: contenido real si llega a `min`; si no, fuera y se reporta
  let prePalabras = 0, prePieza = null;
  if (preambulo && preambulo.bloques.length) {
    prePalabras = palabrasDe(preambulo.bloques);
    if (prePalabras >= (obra.minPreambulo ?? min)) prePieza = { titulos: [obra.tituloPreambulo ?? 'Prolog'], bloques: preambulo.bloques, palabras: prePalabras, pre: true };
  }

  // 3) agrupar / medir cada pieza
  const esColeccion = obra.modo === 'coleccion' || obra.modo === 'subpaginas' && obra.piezasSueltas;
  let piezas = agrupar(crudas, obra.agrupar ?? 0);
  // Una colección de poemas cortos: los que no llegan a `min` se pegan al
  // siguiente, con los dos títulos. Nada se pierde.
  if (esColeccion && !obra.agrupar) {
    const fusionadas = [];
    let pendiente = null;
    for (const p of piezas) {
      if (pendiente) { p.titulos = [...pendiente.titulos, ...p.titulos]; p.bloques = [...pendiente.bloques, ...p.bloques]; p.palabras += pendiente.palabras; pendiente = null; }
      if (p.palabras < min) { p.bloques = p.titulos.length === 1 ? [{ texto: p.titulos[0] }, ...p.bloques] : p.bloques; pendiente = p; continue; }
      fusionadas.push(p);
    }
    if (pendiente) { if (fusionadas.length) { const u = fusionadas.at(-1); u.titulos.push(...pendiente.titulos); u.bloques.push(...pendiente.bloques); u.palabras += pendiente.palabras; } else fusionadas.push(pendiente); }
    piezas = fusionadas;
  }

  // 4) portadillas y trozos rotos
  let vacias = 0;
  for (let k = piezas.length - 1; k >= 0; k--) if (piezas[k].palabras === 0) { piezas.splice(k, 1); vacias += 1; }
  let fuera = 0, fueraPiezas = 0;
  if (!esColeccion) {
    while (piezas.length > 1 && piezas[0].palabras < min) { fuera += piezas[0].palabras; fueraPiezas += 1; piezas.shift(); }
    while (piezas.length > 1 && piezas.at(-1).palabras < min) { fuera += piezas.at(-1).palabras; fueraPiezas += 1; piezas.pop(); }
    const cortos = piezas.filter((p) => p.palabras < min);
    if (cortos.length && !obra.permitirCortos) {
      throw new Error(`${cortos.length} piezas de <${min} palabras EN MEDIO (${cortos.slice(0, 4).map((p) => `«${p.titulos[0]}»=${p.palabras}`).join(', ')}) — segmentación rota, me niego.`);
    }
  }
  if (prePieza) piezas.unshift(prePieza);
  if (!piezas.length) throw new Error('cero piezas tras el filtro');

  // 5) gates de texto sobre la obra entera
  const todo = piezas.map((p) => p.bloques.map((b) => b.texto).join('\n')).join('\n');
  const gd = gateDiacriticos(todo);
  if (!gd.ok) throw new Error(`sin diacríticos: ${gd.detalle} — no es rumano correcto, no entra`);
  const grafia = medirGrafia(todo);
  const total = piezas.reduce((a, p) => a + p.palabras, 0);
  const { indice } = densidad(todo, LANG);
  const porDensidad = nivelPorDensidad(indice, LANG);
  // En una colección la unidad de lectura es la pieza, no el volumen:
  // el piso por escala se mide sobre la pieza MEDIANA (Harap-Alb tiene
  // 17.800 palabras, pero el volumen de Creangă se lee cuento a cuento).
  const tam = piezas.map((p) => p.palabras).sort((a, b) => a - b);
  const mediana = tam[Math.floor(tam.length / 2)];
  const piso = esColeccion ? pisoPorEscala(mediana) : pisoPorEscala(total);
  const nivel = obra.nivel ?? mayorNivel(porDensidad, piso);

  // 6) escribir
  const serie = piezas.length > 1 ? { id: obra.slug, titulo: obra.titulo } : null;
  if (REHACER && !DRY && fs.existsSync(SALIDA)) {
    for (const f of fs.readdirSync(SALIDA)) {
      if (!f.endsWith('.json')) continue;
      const base = f.slice(0, -5);
      if (base === obra.slug || base.startsWith(`${obra.slug}-`)) fs.unlinkSync(path.join(SALIDA, f));
    }
  }
  const urlDe = (t) => `${HOST}/wiki/${encodeURI(t.replace(/ /g, '_'))}`;
  const etq = obra.etiquetaPieza ?? 'Capitolul';
  const esNumeral = (t) => /^(?:[IVXLC]+|\d{1,3})\.?$/.test(String(t ?? '').trim());
  const usados = new Set();
  const escritos = [];
  for (const [i, p] of piezas.entries()) {
    const nCap = i + 1 - (prePieza ? 1 : 0);
    const tituloPieza = obra.modo === 'entero' ? obra.titulo
      : p.pre ? p.titulos[0]
        : esColeccion ? p.titulos.filter(Boolean).join(' · ')
          : p.titulos.length === 1 ? (p.titulos[0] ? (esNumeral(p.titulos[0]) ? `${etq} ${p.titulos[0]}` : p.titulos[0]) : `${etq} ${nCap}`)
            : p.titulos.every(esNumeral) ? `${etq} ${p.titulos[0]}-${p.titulos.at(-1)}`
              : `${etq} ${nCap}: ${p.titulos.filter(Boolean).join(' · ')}`;
    let id = piezas.length === 1 ? obra.slug
      : p.pre ? `${obra.slug}-p00`
        : esColeccion ? `${obra.slug}--${slugify(p.titulos.filter(Boolean)[0] ?? String(nCap))}`
          : `${obra.slug}-c${String(nCap).padStart(2, '0')}`;
    if (usados.has(id)) id = `${id}-${nCap}`;
    usados.add(id);
    const pagina = crudas.find((c) => c.titulo === p.titulos[0])?.pagina ?? fuenteTitulo;
    // La grafía se mide POR PIEZA: en un volumen conviven páginas
    // transcritas con «sunt» y páginas con «sînt» (Creangă, Postume).
    const grafiaPieza = medirGrafia(p.bloques.map((b) => b.texto).join('\n'));
    const notaPieza = grafiaPieza.nota + (obra.notaOrtografia ? ` ${obra.notaOrtografia}` : '');
    const meta = {
      id,
      titulo: normalizarDiacriticos(tituloPieza),
      autor: obra.autor,
      muerteAutor: obra.muerteAutor,
      fuenteUrl: urlDe(pagina),
      fuente: `${LANG}.wikisource.org, «${obra.titulo}»${obra.edicion ? ` (${obra.edicion})` : ''}`,
      licencia: `dominio público (autor muerto en ${obra.muerteAutor})`,
      nivel,
      notaOrtografia: notaPieza,
      ...(serie ? { serie: { ...serie, orden: i + 1 } } : {}),
      variante: obra.variante ?? LANG,
      modo: 'texto',
    };
    verificarProcedencia(meta);
    const parrafos = p.bloques.filter((b) => b.texto.trim()).map((b) => ({ texto: b.texto }));
    if (!DRY) fs.writeFileSync(path.join(SALIDA, `${id}.json`), JSON.stringify({ ...meta, parrafos }, null, 1));
    if (PIEZAS) console.log(`    ${String(i + 1).padStart(3)}. ${meta.titulo.slice(0, 50).padEnd(50)} ${String(p.palabras).padStart(6)} pal`);
    escritos.push(id);
  }
  return { piezas: piezas.length, total, nivel, indice, porDensidad, piso, prePalabras, prePieza: !!prePieza, fuera, fueraPiezas, vacias, tablas, rojas, grafia, gd, escritos };
}

// ── correr la tanda ──────────────────────────────────────────────
const tanda = JSON.parse(fs.readFileSync(tandaPath, 'utf8'));
let granTotal = 0, granPiezas = 0;
const fallos = [];
for (const obra of tanda) {
  if (SOLO && obra.slug !== SOLO) continue;
  try {
    const r = await ingerir(obra);
    granTotal += r.total; granPiezas += r.piezas;
    console.log(
      `✔ ${obra.slug.padEnd(36)} ${String(r.piezas).padStart(3)} piezas ${String(r.total).padStart(7)} pal  ` +
      `${r.nivel}${obra.nivel ? '·decl' : `·dens ${r.indice.toFixed(1)}→${r.porDensidad}/piso ${r.piso}`}  ` +
      `diacr ${(100 * r.gd.ratio).toFixed(0)}% · ${r.grafia.etiqueta}${r.grafia.cedillas ? ` · ${r.grafia.cedillas} cedillas→coma` : ''}` +
      `${r.prePieza ? '  +preámbulo publicado' : (r.prePalabras ? `  preámbulo fuera ${r.prePalabras} pal` : '')}` +
      `${r.fueraPiezas ? `  portadillas fuera ${r.fueraPiezas}/${r.fuera} pal` : ''}` +
      `${r.vacias ? `  vacías fuera ${r.vacias}` : ''}` +
      `${r.tablas.n ? `  tablas fuera ${r.tablas.n}/${r.tablas.palabras} pal` : ''}` +
      `${r.rojas.length ? `  páginas rojas ${r.rojas.length}` : ''}`,
    );
  } catch (e) {
    fallos.push(`${obra.slug}: ${e.message}`);
    console.log(`✗ ${obra.slug.padEnd(36)} ${e.message}`);
  }
}
console.log(`\nTANDA: ${granPiezas} piezas · ${granTotal.toLocaleString('es-MX')} palabras${DRY ? '  (DRY: no se escribió nada)' : ''}`);
if (fallos.length) console.log(`fuera (${fallos.length}): se listan arriba con ✗`);

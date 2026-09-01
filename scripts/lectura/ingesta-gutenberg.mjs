// Ingesta por TANDAS de obras de Project Gutenberg a la biblioteca.
//
// Es el motor de la Ola E3 (714k → 1,9M palabras). Hace de una vez lo
// que la Ola L hizo obra a obra: descargar → gate de procedencia →
// segmentar → medir → publicar los JSON de `modo: 'texto'`. Cero TTS,
// cero créditos: el karaoke se cerró en E4 y no se toca.
//
// uso: node scripts/lectura/ingesta-gutenberg.mjs <tanda.json> [--solo slug] [--dry]
//
// La tanda es un array de obras:
// {
//   "gutenberg": 55752, "slug": "dom-casmurro",
//   "titulo": "Dom Casmurro", "autor": "Machado de Assis",
//   "muerteAutor": 1908, "publicacion": 1899, "variante": "pt-br",
//   "notaOrtografia": "…",
//   "modo": "capitulos" | "titulos" | "mayusculas" | "entero",
//   "patron": "^CAPITULO ",        // capitulos: regex; ausente = autodetectar
//   "esperados": 148,              // capitulos: número EXACTO; otro = gate rojo
//   "titulos": ["…"],              // titulos: lista exacta de piezas
//   "corte": "^NOTAS$",            // opcional: línea que cierra una pieza
//   "minPalabras": 200,            // opcional
//   "nivel": "C2",                 // opcional: si falta, lo mide el índice
//   "versos": true                 // opcional: poesía (conserva los saltos)
// }
//
// GOTCHAS YA PAGADOS que este script implementa (no re-descubrirlos):
// - Gutenberg viene en CRLF: se normaliza al leer o los gates fallan en falso.
// - Los «preámbulos» PUEDEN ser contenido real (así entraron el Prefácio de
//   Camilo y la Nota de Eça): un preámbulo ≥ `minPalabras` se PUBLICA como
//   pieza 0; uno más corto se tira y se REPORTA con su cuenta.
// - Los índices/portadillas fragmentados van fuera, y se reportan.
// - Un trozo corto EN MEDIO no es portadilla: es segmentación rota ⇒ gate rojo.
import fs from 'node:fs';
import path from 'node:path';
import { verificarProcedencia, construirParrafos, contarPalabras, dominioPublico } from './gate-procedencia.mjs';
import { densidad, nivelPorDensidad, pisoPorEscala, mayorNivel } from './medir-nivel.mjs';

const [, , tandaPath, ...flags] = process.argv;
if (!tandaPath) { console.error('uso: node ingesta-gutenberg.mjs <tanda.json> [--solo slug] [--dry]'); process.exit(1); }
const DRY = flags.includes('--dry');
const SOLO = flags.includes('--solo') ? flags[flags.indexOf('--solo') + 1] : null;
// --preambulos vuelca a la caché lo que quedó ANTES del primer marcador,
// para leerlo antes de tirarlo: así aparecieron el Prefácio de Camilo y
// la Nota de Eça en la Ola L (el preámbulo puede ser contenido real).
const PREAMBULOS = flags.includes('--preambulos');
const PIEZAS = flags.includes('--piezas');   // lista título y palabras de cada pieza

const CACHE = path.join(process.cwd(), 'scripts/.cache/lectura');
const SALIDA = path.join(process.cwd(), 'lib/data/languages/pt/lecturas');
fs.mkdirSync(CACHE, { recursive: true });

const slugify = (t) => t.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── descarga ─────────────────────────────────────────────────────
async function bajar(id) {
  const destino = path.join(CACHE, `pg${id}.txt`);
  if (fs.existsSync(destino) && fs.statSync(destino).size > 5000) return destino;
  const urls = [
    `https://www.gutenberg.org/ebooks/${id}.txt.utf-8`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
  ];
  for (const u of urls) {
    try {
      const r = await fetch(u, { redirect: 'follow' });   // gutendex/gutenberg dan 301: hay que seguir
      if (!r.ok) continue;
      const t = await r.text();
      if (t.length < 5000) continue;
      fs.writeFileSync(destino, t);
      return destino;
    } catch { /* siguiente URL */ }
  }
  throw new Error(`no pude bajar el #${id}`);
}

// ── cuerpo limpio ────────────────────────────────────────────────
function cuerpoGutenberg(crudo) {
  const t = crudo.replace(/\r\n/g, '\n').replace(/﻿/g, '');
  const desde = t.split(/\*\*\* ?START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\n/i)[1];
  if (desde === undefined) throw new Error('sin marcador START — no es un TXT de Gutenberg');
  const hasta = desde.split(/\*\*\* ?END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK/i)[0];
  const italicas = (hasta.match(/_/g) ?? []).length;
  return { texto: hasta.replace(/_/g, ''), italicas };
}

// ── segmentadores ────────────────────────────────────────────────
// El candidato «romano con texto detrás» NO existe a propósito: en
// portugués «D.» es Dom/Dona y `^[IVXLCDM]+[-—.]` se traga media novela
// («D. Fernanda abriu o album…»). Costó cuatro obras del primer dry-run.
const CANDIDATOS = [
  { nombre: 'CAPITULO romano',  re: /^CAP[IÍ]TULOS?\s+[IVXLCDM]+\.?$/i },
  { nombre: 'CAPITULO libre',   re: /^CAP[IÍ]TULO\b.{0,40}$/i },
  { nombre: 'romano solo',      re: /^(?:[IVX][IVXLCDM]*|[LCDM][IVXLCDM]+)\.?$/ },
  { nombre: 'arábigo solo',     re: /^\d{1,3}\.?$/ },
];

function marcasPorRegex(lineas, re) {
  const out = [];
  for (let i = 0; i < lineas.length; i++) if (re.test(lineas[i].trim())) out.push(i);
  return out;
}

function palabrasEntre(lineas, a, b) {
  return lineas.slice(a, b).join(' ').split(/\s+/).filter(Boolean).length;
}

function autodetectar(lineas) {
  const total = palabrasEntre(lineas, 0, lineas.length);
  let mejor = null;
  for (const c of CANDIDATOS) {
    const marcas = marcasPorRegex(lineas, c.re);
    if (marcas.length < 3) continue;
    // El mejor marcador es el que cubre casi todo el libro Y lo parte en
    // trozos parejos. Sin el término de regularidad, «CAPITULO romano»
    // ganaba en Iaiá Garcia con 3 marcas y dejaba la novela en 1 pieza.
    const cubre = palabrasEntre(lineas, marcas[0], lineas.length) / total;
    const tam = marcas.map((m, i) => palabrasEntre(lineas, m + 1, i + 1 < marcas.length ? marcas[i + 1] : lineas.length));
    const media = tam.reduce((a, b) => a + b, 0) / tam.length;
    const desv = Math.sqrt(tam.reduce((a, b) => a + (b - media) ** 2, 0) / tam.length) / (media || 1);
    const puntaje = cubre * 100 + Math.min(marcas.length, 40) - Math.min(desv, 4) * 12;
    if (!mejor || puntaje > mejor.puntaje) mejor = { ...c, marcas, puntaje };
  }
  if (!mejor) throw new Error('no pude autodetectar el marcador de capítulo — declara `patron` en la tanda');
  return mejor;
}

/** Encabezados en MAYÚSCULAS aislados por línea en blanco: el molde de
 *  los volúmenes de contos de Gutenberg.
 *
 *  Tres filtros, cada uno pagado con un fallo del primer dry-run:
 *  - fuera los numerales romanos (son secciones DENTRO de un conto);
 *  - fuera las líneas repetidas (son nombres de personaje en el diálogo
 *    teatral: «CLEANTHIS» / «MERCURIO» partían el conto en 14 trozos);
 *  - fuera los encabezados con menos de `min` palabras detrás (índices,
 *    portadillas, «FIM DA EGREJA DO DIABO»). Lo rechazado NO se pierde:
 *    se queda como texto dentro de la pieza anterior. */
function marcasMayusculas(lineas, min) {
  const veces = new Map();
  const crudas = [];
  for (let i = 1; i < lineas.length - 1; i++) {
    const l = lineas[i].trim();
    if (l.length < 3 || l.length > 70) continue;
    if (!/^[A-ZÀ-ÝÇ0-9 .,;:!?'’«»()—-]+$/.test(l)) continue;
    if (!/[A-ZÀ-ÝÇ]{3}/.test(l)) continue;
    if (/^[IVXLCDM]+\.?$/.test(l)) continue;
    // «CAPITULO II» en un volumen de contos NUNCA es el título de un
    // conto: es una sección dentro de uno. Se coló en Histórias sem Data
    // y se llevó por delante el capítulo I de «A Egreja do Diabo».
    if (/^CAP[IÍ]TULO\b/i.test(l) || /^(FIM|PARTE)\b/i.test(l)) continue;
    if (lineas[i - 1].trim() !== '' || lineas[i + 1].trim() !== '') continue;
    veces.set(l, (veces.get(l) ?? 0) + 1);
    crudas.push(i);
  }
  const unicas = crudas.filter((i) => veces.get(lineas[i].trim()) === 1);
  // pasada de fusión: un encabezado con poco texto detrás no parte nada
  let marcas = unicas;
  for (;;) {
    const fuera = marcas.findIndex((m, k) => palabrasEntre(lineas, m + 1, k + 1 < marcas.length ? marcas[k + 1] : lineas.length) < min);
    if (fuera < 0) break;
    marcas = marcas.filter((_, k) => k !== fuera);
    if (marcas.length === 0) break;
  }
  return marcas;
}

/** Segmentación POR EL ÍNDICE del propio volumen — la vía fiable para
 *  los libros de contos, y la que se verifica sola.
 *
 *  Los encabezados en mayúsculas no bastan: en Histórias sem Data las
 *  secciones internas de «A Egreja do Diabo» («ENTRE DEUS E DIABO»,
 *  «A BOA NOVA AOS HOMENS») son mayúsculas aisladas igual que los
 *  títulos, y partían los contos en trozos. El índice sí sabe cuáles son
 *  los contos: se leen sus entradas y se busca cada una en el cuerpo. Si
 *  alguna no aparece, es gate rojo — el volumen entraría incompleto. */
function marcasPorIndice(lineas) {
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const iIndice = lineas.findIndex((l) => /^(Í|I)NDICE\.?$|^SUM[MÁA]RIO\.?$|^INDEX\.?$/i.test(l.trim()));
  if (iIndice < 0) throw new Error('sin línea de ÍNDICE — usa `modo: "titulos"` con la lista a mano');

  // Dos pasadas: con número de página (lo normal) y, si eso no da nada,
  // con líneas peladas — el índice de Papéis Avulsos es sólo la lista.
  let titulos = [], finIndice = iIndice;
  for (const conPagina of [true, false]) {
    titulos = []; finIndice = iIndice;
    let blancasSeguidas = 0;
    for (let i = iIndice + 1; i < lineas.length && titulos.length < 80; i++) {
      const l = lineas[i].trim();
      if (!l) { if (++blancasSeguidas >= 4 && titulos.length) break; continue; }
      blancasSeguidas = 0;
      if (/^pags?\.?$/i.test(l)) continue;
      // entrada = título + relleno + número de página (arábigo o romano;
      // «vij» y «xiij» incluidos: la numeración romana de imprenta usa j final)
      const m = l.match(/^(.+?)[\s.]{2,}(?:\d+|[ivxlcdmj]+)\.?$/i) ?? l.match(/^(.+?)\s+(\d{1,4})$/);
      const bruto = m ? m[1] : conPagina ? null : l;
      const t = bruto === null ? '' : bruto.replace(/[\s.]+$/, '').trim();
      if (!t) { if (titulos.length) break; continue; }
      if (t.length >= 3 && t.length <= 70) { titulos.push(t); finIndice = i; }
      else if (titulos.length) break;
    }
    if (titulos.length >= 2) break;
  }
  if (titulos.length < 2) throw new Error('el ÍNDICE no dio 2+ entradas legibles');

  const marcas = [];
  const perdidos = [];
  const aproximados = [];
  // El índice puede ir al PRINCIPIO (Histórias sem Data) o al FINAL
  // (Papéis Avulsos): se busca en todo el libro excluyendo el bloque del
  // índice, y las marcas se asignan EN ORDEN creciente. Sin el orden, el
  // título casaba con la portadilla de la primera página y el volumen
  // perdía sus primeros contos.
  const alFrente = iIndice < lineas.length / 2;
  const fuera = (i) => (i < iIndice || i > finIndice) && (alFrente || i < iIndice);
  let previa = alFrente ? finIndice : -1;
  for (const t of titulos) {
    const n = norm(t);
    let hallada = -1;
    for (let i = previa + 1; i < lineas.length; i++) if (fuera(i) && norm(lineas[i]) === n) { hallada = i; break; }
    if (hallada < 0) {
      // El índice y el cuerpo no siempre traen la MISMA grafía
      // pre-Acordo: «MANUSCRIPTO DE UM SACRISTÃO» en el índice,
      // «MANUSCRITO DE UM SACHRISTÃO» en el cuerpo. Se admite un
      // parecido muy alto, y se REPORTA cada vez que se usa.
      let mejor = { i: -1, d: Infinity };
      for (let i = previa + 1; i < lineas.length; i++) {
        if (!fuera(i)) continue;
        const c = norm(lineas[i]);
        if (!c || Math.abs(c.length - n.length) > 4) continue;
        const d = distancia(n, c);
        if (d < mejor.d) mejor = { i, d };
      }
      if (mejor.i >= 0 && mejor.d <= Math.max(2, Math.floor(n.length * 0.12))) {
        hallada = mejor.i;
        aproximados.push(`«${t}» ≈ «${lineas[mejor.i].trim()}» (d=${mejor.d})`);
      }
    }
    if (hallada < 0) perdidos.push(t); else { marcas.push(hallada); previa = hallada; }
  }
  if (perdidos.length) {
    throw new Error(`${perdidos.length} entradas del índice no aparecen en el cuerpo ` +
      `(${perdidos.slice(0, 3).map((t) => `«${t}»`).join(', ')}) — me niego a publicar el volumen incompleto.`);
  }
  if (aproximados.length) console.log(`    grafía del índice ≠ la del cuerpo en ${aproximados.length}: ${aproximados.join(' · ')}`);
  marcas.sort((a, b) => a - b);
  return marcas;
}

/** Levenshtein, para el cotejo índice↔cuerpo y nada más. */
function distancia(a, b) {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** Agrupa capítulos consecutivos hasta juntar `objetivo` palabras.
 *  Machado escribió novelas de 160 capítulos de 300 palabras: publicar
 *  cada uno suelto da unidades de lectura que no son lectura. Nada se
 *  descarta — la línea del marcador entra como párrafo propio, igual que
 *  el numeral romano que la Ola L conservaba en `parrafos[0]`. */
function agrupar(marcas, lineas, objetivo, fin) {
  const grupos = [];
  let actual = null;
  for (const [k, m] of marcas.entries()) {
    const hasta = k + 1 < marcas.length ? marcas[k + 1] : fin;
    const n = palabrasEntre(lineas, m + 1, hasta);
    if (!actual) actual = { desde: k, hasta: k, ini: m, fin: hasta, palabras: 0 };
    actual.hasta = k; actual.fin = hasta; actual.palabras += n;
    if (actual.palabras >= objetivo) { grupos.push(actual); actual = null; }
  }
  if (actual) {
    if (grupos.length && actual.palabras < objetivo / 2) {
      const u = grupos.at(-1); u.hasta = actual.hasta; u.fin = actual.fin; u.palabras += actual.palabras;
    } else grupos.push(actual);
  }
  return grupos;
}

// ── ingesta de una obra ──────────────────────────────────────────
async function ingerir(obra) {
  const min = obra.minPalabras ?? 200;
  const archivo = await bajar(obra.gutenberg);
  const { texto, italicas } = cuerpoGutenberg(fs.readFileSync(archivo, 'utf8'));
  const lineas = texto.split('\n');

  // procedencia por aritmética, no por suposición
  const dp = dominioPublico(obra.muerteAutor, obra.publicacion);
  if (!dp.libre) throw new Error(`${obra.slug}: NO libre — UE ${dp.ue} · MX ${dp.mx} · US ${dp.us ?? '?'}`);

  // 1) marcas
  let marcas, detectado = obra.patron ?? obra.modo;
  if (obra.modo === 'entero') marcas = [-1];
  else if (obra.modo === 'titulos') {
    marcas = obra.titulos.map((t) => {
      const i = lineas.findIndex((l) => l.trim() === t);
      if (i < 0) throw new Error(`título no encontrado: «${t}» — me niego a seguir con el volumen incompleto`);
      return i;
    }).sort((a, b) => a - b);
  } else if (obra.modo === 'indice') {
    marcas = marcasPorIndice(lineas);
  } else if (obra.modo === 'mayusculas') {
    marcas = marcasMayusculas(lineas, min);
    if (marcas.length < 2) throw new Error(`${obra.slug}: 0-1 encabezados en mayúsculas — segmentación imposible`);
  } else if (obra.patron) {
    marcas = marcasPorRegex(lineas, new RegExp(obra.patron));
  } else {
    const d = autodetectar(lineas);
    marcas = d.marcas; detectado = d.nombre;
  }
  if (obra.esperados && marcas.length !== obra.esperados) {
    throw new Error(`${obra.slug}: esperaba ${obra.esperados} piezas y encontré ${marcas.length} — me niego.`);
  }

  // 2) trozos. Los capítulos se AGRUPAN hasta `agrupar` palabras (ver
  //    la función): la novela de capítulos minúsculos no se publica en
  //    trozos que no son lectura, y no se pierde ni una línea.
  const corte = obra.corte ? new RegExp(obra.corte) : null;
  const iCorte = corte ? lineas.findIndex((l, k) => k > (marcas[0] ?? 0) && corte.test(l.trim())) : -1;
  const fin = iCorte >= 0 ? iCorte : lineas.length;
  const cortadas = iCorte >= 0 ? palabrasEntre(lineas, iCorte, lineas.length) : 0;
  const esConto = obra.modo === 'titulos' || obra.modo === 'mayusculas' || obra.modo === 'indice';
  const objetivo = obra.agrupar ?? 0;

  const grupos = objetivo > 0
    ? agrupar(marcas, lineas, objetivo, fin)
    : marcas.map((m, k) => ({ desde: k, hasta: k, ini: m, fin: k + 1 < marcas.length ? marcas[k + 1] : fin, palabras: 0 }));

  const piezas = [];
  for (const g of grupos) {
    // Un grupo de varios capítulos conserva DENTRO las líneas de
    // marcador; un capítulo suelto no (el título de la pieza la sustituye).
    const cuerpo = g.desde === g.hasta
      ? lineas.slice(g.ini + 1, g.fin).join('\n')
      : lineas.slice(g.ini, g.fin).join('\n');
    const parrafos = construirParrafos(cuerpo, obra);
    piezas.push({
      marcador: g.ini >= 0 ? lineas[g.ini].trim() : '',
      desde: g.desde, hasta: g.hasta,
      parrafos, palabras: contarPalabras(parrafos),
    });
  }

  // 3) preámbulo — puede ser contenido real (gotcha de la Ola L). En
  //    Machado lo es SIEMPRE: la portadilla y el «OBRAS DO AUTOR» van
  //    delante, y detrás vienen «Ao leitor» (Brás Cubas), la advertência
  //    sobre la palabra «reproche» (Papéis Avulsos) o el prólogo de
  //    Relíquias. `preambuloDesde` marca dónde empieza lo publicable.
  let iniPre = 0;
  if (obra.preambuloDesde) {
    const re = new RegExp(obra.preambuloDesde);
    const k = lineas.findIndex((l, j) => j < (marcas[0] ?? lineas.length) && re.test(l.trim()));
    if (k < 0) throw new Error(`${obra.slug}: «preambuloDesde» no casó con ninguna línea del preámbulo`);
    iniPre = k;
  }
  const preTexto = marcas[0] > iniPre ? lineas.slice(iniPre, marcas[0]).join('\n') : '';
  const preParrafos = construirParrafos(preTexto, obra);
  const prePalabras = contarPalabras(preParrafos);
  // El umbral del preámbulo NO es el de segmentación: una advertência de
  // Machado son 120 palabras y es texto de autor, no portadilla.
  let preambulo = null;
  if (obra.publicarPreambulo && prePalabras >= 60) {
    preambulo = { marcador: obra.tituloPreambulo ?? 'Prefácio', parrafos: preParrafos, palabras: prePalabras, pre: true };
  }

  // 4) portadillas: sólo se toleran al PRINCIPIO y se reportan
  let fuera = 0, fueraPiezas = 0;
  while (piezas.length && piezas[0].palabras < min) { fuera += piezas[0].palabras; fueraPiezas += 1; piezas.shift(); }
  while (piezas.length && piezas.at(-1).palabras < min) { fuera += piezas.at(-1).palabras; fueraPiezas += 1; piezas.pop(); }
  const cortosDentro = piezas.filter((p) => p.palabras < min);
  if (cortosDentro.length && !obra.permitirCortos) {
    throw new Error(`${obra.slug}: ${cortosDentro.length} piezas de <${min} palabras EN MEDIO ` +
      `(${cortosDentro.slice(0, 4).map((p) => `«${p.marcador}»=${p.palabras}`).join(', ')}) — segmentación rota, me niego.`);
  }
  if (preambulo) piezas.unshift(preambulo);
  if (piezas.length === 0) throw new Error(`${obra.slug}: cero piezas tras el filtro`);

  // 5) nivel MEDIDO sobre la obra entera (como la Ola L: por obra, no
  //    por trozo), en los dos ejes: densidad léxica y piso por escala.
  const todo = piezas.map((p) => p.parrafos.map((x) => x.texto).join(' ')).join(' ');
  const { indice } = densidad(todo);
  const total = piezas.reduce((a, p) => a + p.palabras, 0);
  const porDensidad = nivelPorDensidad(indice);
  const piso = esConto ? 'A2' : pisoPorEscala(total);
  const nivel = obra.nivel ?? mayorNivel(porDensidad, piso);

  // 6) JSON
  const serie = piezas.length > 1 ? { id: obra.slug, titulo: obra.titulo } : null;
  const escritos = [];
  const usados = new Set();
  const etq = obra.etiquetaPieza ?? 'Capítulo';
  // `offsetCapitulo` para las ediciones a las que les falta el marcador
  // del capítulo I (O Ateneu): el capítulo 1 entra como preámbulo y la
  // numeración de los demás se corre para que siga cuadrando con el libro.
  const off = obra.offsetCapitulo ?? 0;
  for (const [i, p] of piezas.entries()) {
    const nCap = i + 1 - (preambulo ? 1 : 0) + off;
    const tituloPieza = obra.modo === 'entero' ? obra.titulo
      : p.pre ? p.marcador
        : esConto ? tituloBonito(p.marcador)
          : p.desde === p.hasta ? `${etq} ${p.desde + 1 + off}`
            : `${etq}s ${p.desde + 1 + off}-${p.hasta + 1 + off}`;
    let id = piezas.length === 1 ? obra.slug
      : p.pre ? `${obra.slug}-p00`
        : esConto ? `${obra.slug}--${slugify(p.marcador.replace(/\[\d+\]/g, ''))}`
          : `${obra.slug}-c${String(nCap).padStart(2, '0')}`;
    if (usados.has(id)) id = `${id}-${nCap}`;   // dos contos homónimos en un volumen
    usados.add(id);
    const meta = {
      id,
      titulo: tituloPieza,
      autor: obra.autor,
      muerteAutor: obra.muerteAutor,
      fuenteUrl: `https://www.gutenberg.org/ebooks/${obra.gutenberg}`,
      fuente: `Project Gutenberg #${obra.gutenberg}, «${obra.titulo}»`,
      licencia: `dominio público (autor muerto en ${obra.muerteAutor})`,
      nivel,
      ...(obra.notaOrtografia ? { notaOrtografia: obra.notaOrtografia } : {}),
      ...(serie ? { serie: { ...serie, orden: i + 1 } } : {}),
      variante: obra.variante ?? 'pt',
      modo: 'texto',
    };
    verificarProcedencia(meta);
    if (!DRY) fs.writeFileSync(path.join(SALIDA, `${id}.json`), JSON.stringify({ ...meta, parrafos: p.parrafos }, null, 1));
    if (PIEZAS) console.log(`    ${String(i + 1).padStart(3)}. ${tituloPieza.padEnd(46)} ${String(p.palabras).padStart(6)} pal`);
    escritos.push(id);
  }

  if (PREAMBULOS && prePalabras > 0 && !preambulo) {
    fs.writeFileSync(path.join(CACHE, `preambulo-${obra.slug}.txt`), preParrafos.map((p) => p.texto).join('\n\n'));
  }

  return { obra, piezas: piezas.length, total, nivel, indice, porDensidad, piso, detectado, italicas, prePalabras, preambulo: !!preambulo, fuera, fueraPiezas, cortadas, escritos, dp };
}

/** «O SEGREDO DO BONZO[1]» → «O segredo do bonzo»; «D. BENEDICTA» →
 *  «D. Benedicta». Se quitan las llamadas de nota del encabezado (son
 *  aparato de la edición, no título) y se recapitaliza tras punto. */
function tituloBonito(t) {
  const s = t.replace(/\[\d+\]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  return s.replace(/(^|\.\s+)([a-zà-ÿ])/g, (_, p, c) => p + c.toUpperCase());
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
      `✔ ${obra.slug.padEnd(34)} ${String(r.piezas).padStart(3)} piezas ${String(r.total).padStart(7)} pal  ` +
      `${r.nivel}${obra.nivel ? '·decl' : `·dens ${r.indice.toFixed(1)}→${r.porDensidad}/piso ${r.piso}`}  [${r.detectado}]` +
      `${r.preambulo ? '  +preámbulo publicado' : (r.prePalabras ? `  preámbulo fuera ${r.prePalabras} pal` : '')}` +
      `${r.fueraPiezas ? `  portadillas fuera ${r.fueraPiezas}/${r.fuera} pal` : ''}` +
      `${r.cortadas ? `  cortadas por «corte» ${r.cortadas} pal` : ''}`,
    );
  } catch (e) {
    fallos.push(`${obra.slug}: ${e.message}`);
    console.log(`✗ ${obra.slug.padEnd(34)} ${e.message}`);
  }
}
console.log(`\nTANDA: ${granPiezas} piezas · ${granTotal.toLocaleString('es-MX')} palabras${DRY ? '  (DRY: no se escribió nada)' : ''}`);
if (fallos.length) console.log(`fuera (${fallos.length}): se listan arriba con ✗`);

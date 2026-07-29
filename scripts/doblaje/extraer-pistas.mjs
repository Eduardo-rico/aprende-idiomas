// Extrae todas las pistas doblables de los documentos de contenido.
//
// Una fila de pista es la que empieza por una capa (0 · N · 1 · 2) seguida
// de un personaje. Todo lo demás en esos documentos son tablas de
// correcciones, cuadros de entrega y fichas — que también son tablas, y
// por eso el filtro va por la PRIMERA celda y no por el número de columnas.
import fs from 'node:fs';

const DOCS = [
  ['eps-nuevos', '/Users/lalo/idiomas/portugues-app/docs/contenido/2026-07-29-episodios-nuevos.md'],
  ['ep1', '/Users/lalo/idiomas/portugues-app/docs/contenido/2026-07-28-ep1-narrado.md'],
  ['eps2-8', '/Users/lalo/idiomas/portugues-app/docs/contenido/2026-07-29-eps-2-8-narrados.md'],
];

// El ep. 1 usa otro encabezado (| Capa | Quién | Portugués | Glosa |
// Función |) y otras etiquetas de capa: «habla real» y «manejable».
//
// La primera versión de este regex no las reconocía y DESCARTÓ EN
// SILENCIO 23 réplicas de diálogo del ep. 1 — el episodio se dobló y se
// montó con sólo la narradora, y el hueco no lo vio nadie hasta que otro
// script fue a buscar una réplica de Fátima que debía existir. Por eso
// ahora hay dos defensas: el mapa de capas es explícito, y una fila que
// PARECE de pista pero trae una capa desconocida revienta el script en
// vez de desaparecer.
const CAPAS = {
  '0': '0', N: 'N', '1': '1', '2': '2',
  'español': '0', 'narrador': 'N', 'habla real': '1', 'manejable': '2',
};
const FILA_PISTA = /^\|\s*(0|N|1|2|español|narrador|habla real|manejable)\s*\|\s*([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ ]*?)\s*\|\s*(.+?)\s*\|/u;
// Caza el caso «fila de pista con capa que nadie mapeó»: misma forma,
// primera celda corta y en minúsculas, personaje en mayúsculas.
const FILA_SOSPECHOSA = /^\|\s*([a-záéíóúñ][a-záéíóúñ ]{0,15}?)\s*\|\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ ]*\s*\|/u;
const TITULO = /^##+\s*(?:[✅🔒⛔]\s*)?(ep\.\s*\d+|P\d+)\s*·\s*«([^»]+)»/u;

const pistas = [];
let piezaActual = null;

for (const [etiqueta, f] of DOCS) {
  if (!fs.existsSync(f)) { console.error('falta', f); continue; }
  const lineas = fs.readFileSync(f, 'utf8').split('\n');
  let enHistorial = false;

  lineas.forEach((linea, i) => {
    // Todo lo que va bajo «Historial» es la versión tumbada: no se dobla.
    if (/^##\s*Historial/.test(linea)) enHistorial = true;
    if (/^#\s/.test(linea)) enHistorial = false;

    const t = linea.match(TITULO);
    if (t) {
      piezaActual = { id: t[1].replace(/\s+/g, '').replace('ep.', 'ep'), titulo: t[2], doc: etiqueta };
      return;
    }
    if (etiqueta === 'ep1' && piezaActual === null) {
      piezaActual = { id: 'ep1', titulo: 'Ao balcão', doc: 'ep1' };
    }
    if (enHistorial || !piezaActual) return;

    const m = linea.match(FILA_PISTA);
    if (!m) {
      const s = linea.match(FILA_SOSPECHOSA);
      if (s && !(s[1] in CAPAS)) {
        throw new Error(
          `${f}:${i + 1} — fila con forma de pista y capa desconocida «${s[1]}». ` +
          `Mapéala en CAPAS o corrige el documento; no se descarta en silencio.`,
        );
      }
      return;
    }
    let [, capa, quien, texto] = m;
    capa = CAPAS[capa];
    quien = quien.trim();
    if (!quien || quien === 'PERSONAJE' || quien === 'DÓNDE') return;

    // Limpia el markdown de énfasis y las acotaciones en cursiva
    const limpio = texto
      .replace(/\*\(español\)\*/g, '')
      // Etiquetas de emoción de la era eleven_v3 ([shouting], [slowly]…):
      // el doc del ep. 1 las conserva y multilingual_v2 NO las entiende —
      // las lee en voz alta. Se descubrió porque el ep. 1 se redobló con
      // «[shouting]» como texto literal. Fuera del texto, siempre.
      .replace(/\[[a-z][a-z ]*\]\s*/gi, '')
      .replace(/\*\*/g, '')
      .replace(/^\s*«|»\s*$/g, '')
      .replace(/`/g, '')
      .trim();
    if (!limpio || limpio === '—') return;

    // La dirección de voz es la ÚLTIMA celda de la fila: en el documento
    // nuevo la tabla tiene 4 columnas y en el ep. 1 tiene 5 (lleva glosa
    // en medio). Tomar la última en vez de un índice fijo hace que las
    // dos formas funcionen sin un caso especial.
    const celdas = linea.split('|').slice(1, -1).map((c) => c.trim());
    const direccion = celdas.length ? celdas[celdas.length - 1] : '';

    pistas.push({
      pieza: piezaActual.id, titulo: piezaActual.titulo, doc: piezaActual.doc,
      n: pistas.length, capa, quien, texto: limpio, direccion, linea: i + 1,
    });
  });
  piezaActual = null;
}

// Resumen
const porPieza = {};
for (const p of pistas) {
  porPieza[p.pieza] ??= { n: 0, chars: 0, titulo: p.titulo, voces: new Set() };
  porPieza[p.pieza].n++;
  porPieza[p.pieza].chars += p.texto.length;
  porPieza[p.pieza].voces.add(p.quien);
}

let total = 0, replicas = 0;
console.log('pieza      réplicas  chars   título');
for (const [k, v] of Object.entries(porPieza)) {
  console.log(`${k.padEnd(10)} ${String(v.n).padStart(5)}  ${String(v.chars).padStart(6)}   ${v.titulo}`);
  total += v.chars; replicas += v.n;
}
console.log(`\nTOTAL: ${replicas} réplicas · ${total} caracteres`);

const voces = new Set(pistas.map((p) => p.quien));
console.log('\nvoces requeridas:', [...voces].sort().join(' · '));

fs.writeFileSync(process.argv[2] ?? '/tmp/pistas.json', JSON.stringify(pistas, null, 2));

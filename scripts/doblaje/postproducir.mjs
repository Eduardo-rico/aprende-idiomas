// Post-producción: filtros de espacio y montaje continuo por pieza.
//
// DOS COSAS QUE NO SE INFIEREN POR PALABRAS CLAVE.
//
// 1. Un primer intento detectó los filtros buscando «cristal», «teléfono»
//    y «megafonía» en la columna de dirección. Cazó a la NARRADORA tres
//    veces — porque su texto DESCRIBE el cristal («não se percebe tudo:
//    há um vidro») sin estar detrás de él. Filtrarla habría sido el peor
//    error posible del proyecto: es la referencia fija contra la que el
//    alumno mide todo lo demás, y su timbre tiene que ser idéntico en las
//    trece piezas. La lista es EXPLÍCITA por eso.
//
// 2. El filtro va por QUIÉN ESTÁ DETRÁS DEL CRISTAL, no por quién lo
//    menciona. En el ep. 10 Fátima está dentro y Migue fuera: se filtra
//    ella. En P12 la funcionária está detrás del vidrio de la ventanilla
//    y Vítor delante: se filtra ella. En P10 la madre está al otro lado
//    del teléfono y Sónia en la calle: se filtra la madre.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIR = process.env.DIR || '/Users/lalo/Desktop/ao-balcao-doblaje';
const FIN = path.join(DIR, 'episodios');
const TMP = path.join(DIR, '.tmp');
const FILTRADAS = path.join(DIR, 'filtradas');
fs.mkdirSync(FIN, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(FILTRADAS, { recursive: true });

const m = JSON.parse(fs.readFileSync(path.join(DIR, 'manifiesto.json'), 'utf8'));

// ── Filtros ──────────────────────────────────────────────────────
// Las cadenas salen de lo que pide la dirección, no de mi gusto: la del
// ep. 15 llega a especificar «pasa-banda 300-3400 Hz, compresión dura,
// reverb de sala».
const CADENAS = {
  megafonia: 'highpass=f=300,lowpass=f=3400,acompressor=threshold=-20dB:ratio=6:attack=5:release=50,aecho=0.8:0.7:55:0.28,volume=1.35',
  // «pasa-banda estrecho, sin agudos. Debe entenderse la mitad, y ésa es
  // la instrucción» — el ep. 10 pide explícitamente que cueste.
  cristal:   'highpass=f=260,lowpass=f=1700,acompressor=threshold=-24dB:ratio=3,volume=0.72',
  telefono:  'highpass=f=400,lowpass=f=3200,acompressor=threshold=-20dB:ratio=5,volume=1.1',
  // «al fondo de la sala y fuera de foco»: no es un filtro de aparato,
  // es distancia.
  fondo:     'lowpass=f=5200,aecho=0.85:0.6:75:0.32,volume=0.42',
};

// Qué se filtra, anclado a CONTENIDO y no a números de réplica.
//
// La primera versión usaba el número global `n` del manifiesto — que
// cambia entero en cuanto alguien edita un documento y reextrae las
// pistas. Los filtros habrían caído en réplicas equivocadas sin ningún
// aviso: exactamente la clase de acople silencioso que la revisión de
// hoy encontró tres veces en el corpus. El ancla es (pieza, personaje,
// arranque del texto): sobrevive a la renumeración, y si el texto cambia
// lo bastante como para no casar, el script REVIENTA en vez de callar.
const FILTRAR = [
  // ep10 — Fátima dentro de la pastelaria; Migue NO: está en la calle.
  ['ep10', 'FÁTIMA', 'Ó Zé! Ó Zé, isto hoje não abre', 'cristal'],
  ['ep10', 'FÁTIMA', 'Ao domingo está fechado!', 'cristal'],
  ['ep10', 'FÁTIMA', 'Está fechado! Ao domingo', 'cristal'],
  // ep11 — la megafonía del autocarro.
  ['ep11', 'MEGAFONE', 'Próxima paragem: Alvalade', 'megafonia'],
  ['ep11', 'MEGAFONE', 'Próxima paragem: Campo Grande', 'megafonia'],
  // ep15 — sólo la llamada de Kilu; el resto de sus réplicas son en persona.
  ['ep15', 'KILU', 'Migue, sou eu. Olha, estou no centro', 'telefono'],
  ['ep15', 'MEGAFONE', 'Fátima Andrade. Gabinete', 'megafonia'],
  // P10 — la madre al otro lado del teléfono; Sónia NO: está en la calle.
  ['P10', 'MÃE', 'Está lá? Ó Sónia?', 'telefono'],
  ['P10', 'MÃE', 'Ó filha. Quanto tempo', 'telefono'],
  ['P10', 'MÃE', 'Doze. Pronto.', 'telefono'],
  ['P10', 'MÃE', 'Está tudo bem. Vai trabalhar.', 'telefono'],
  ['P10', 'MÃE', 'Não é preciso.', 'telefono'],
  ['P10', 'MÃE', 'Não é preciso, filha.', 'telefono'],
  ['P10', 'MÃE', 'Vai. Vai trabalhar.', 'telefono'],
  // P12 — la funcionária tras el vidrio; Vítor NO: está delante.
  ['P12', 'FUNCIONÁRIA', 'O senhor tem senha?', 'cristal'],
  ['P12', 'FUNCIONÁRIA', 'Tem de tirar senha', 'cristal'],
  ['P12', 'FUNCIONÁRIA', 'Maria de Lurdes Pinto?', 'cristal'],
  ['P12', 'FUNCIONÁRIA', 'Maria de Lurdes Pinto!', 'cristal'],
  ['P12', 'VOZ', 'Sou eu.', 'fondo'],
];

const usados = new Set();
const filtroDe = (p) => {
  for (const [i, [pieza, quien, arranque, filtro]] of FILTRAR.entries()) {
    if (p.pieza === pieza && p.quien === quien && p.texto.startsWith(arranque)) {
      usados.add(i);
      return filtro;
    }
  }
  return null;
};

// Al final del script se comprueba que TODAS las anclas casaron con
// alguna réplica: un ancla huérfana significa que el guion cambió por
// debajo, y eso debe parar el montaje, no degradarlo en silencio.
function verificaAnclas() {
  const huerfanas = FILTRAR.filter((_, i) => !usados.has(i));
  if (huerfanas.length) {
    console.error('\nANCLAS SIN RÉPLICA — el guion cambió por debajo de los filtros:');
    for (const [pieza, quien, arranque] of huerfanas) console.error(`  ✗ ${pieza} ${quien} «${arranque}»`);
    process.exit(1);
  }
}

// ── Silencios entre réplicas ─────────────────────────────────────
// La narradora necesita aire a los dos lados: es un cambio de plano, no
// un turno de conversación. Y cuando la dirección pide un silencio
// concreto («1,5 s de silencio detrás»), manda la dirección.
function huecoTras(p, sig) {
  const d = (p.direccion || '');
  const exp = d.match(/(\d)[,.](\d)\s*s\s+(?:de\s+silencio|en que no se mueve|de aire)/i);
  if (exp) return Number(`${exp[1]}.${exp[2]}`);
  if (!sig) return 0;
  if (p.capa === 'N' || sig.capa === 'N' || p.capa === '0' || sig.capa === '0') return 0.75;
  return 0.4;
}

const sh = (bin, args) => execFileSync(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] });

// Silencios cacheados: los mismos cuatro o cinco valores se repiten en
// las 361 réplicas, así que generarlos una vez ahorra ~350 procesos.
const silencios = new Map();
function silencio(seg) {
  const k = seg.toFixed(2);
  if (silencios.has(k)) return silencios.get(k);
  const f = path.join(TMP, `sil-${k}.mp3`);
  sh('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', k, '-c:a', 'libmp3lame', '-b:a', '128k', f]);
  silencios.set(k, f);
  return f;
}

const pistas = m.pistas.filter((x) => x.ok);
const ORDEN = ['ep1', 'ep9', 'ep10', 'ep11', 'ep13', 'ep14', 'ep15', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12'];
const piezas = ORDEN.filter((k) => pistas.some((p) => p.pieza === k));

let filtradas = 0;
const resumen = [];

for (const pieza of piezas) {
  const rs = pistas.filter((p) => p.pieza === pieza).sort((a, b) => a.n - b.n);
  const partes = [];

  for (const [i, p] of rs.entries()) {
    let fuente = path.join(DIR, p.archivo);
    const f = filtroDe(p);
    if (f) {
      // La versión filtrada se GUARDA, no se tira. Si sólo viviera dentro
      // del montaje, la página etiquetaría una réplica como «tras el
      // cristal» y su reproductor individual serviría el original limpio
      // — justo el tipo de discrepancia entre lo que se dice y lo que
      // suena que este proyecto lleva días persiguiendo.
      const dest = path.join(FILTRADAS, p.archivo);
      sh('ffmpeg', ['-y', '-i', fuente, '-af', CADENAS[f], '-c:a', 'libmp3lame', '-b:a', '128k', dest]);
      fuente = dest;
      p.filtro = f;
      p.archivoFiltrado = `filtradas/${p.archivo}`;
      filtradas++;
    } else {
      // Reencodar todo al mismo perfil: concat con -c copy sobre mp3 de
      // parámetros distintos produce desincronía silenciosa.
      const dest = path.join(TMP, `n-${p.archivo}`);
      sh('ffmpeg', ['-y', '-i', fuente, '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', '-ac', '1', dest]);
      fuente = dest;
    }
    partes.push(fuente);
    const hueco = huecoTras(p, rs[i + 1]);
    if (hueco > 0) partes.push(silencio(hueco));
  }

  const lista = path.join(TMP, `${pieza}.txt`);
  fs.writeFileSync(lista, partes.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
  const salida = path.join(FIN, `${pieza}.mp3`);
  sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c:a', 'libmp3lame', '-b:a', '128k', salida]);

  const dur = parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', salida]).toString());
  resumen.push({ pieza, titulo: rs[0].titulo, replicas: rs.length, min: +(dur / 60).toFixed(2), archivo: `episodios/${pieza}.mp3` });
  process.stdout.write(`${pieza} `);
}

verificaAnclas();
fs.writeFileSync(path.join(DIR, 'manifiesto.json'), JSON.stringify(m, null, 2));
fs.writeFileSync(path.join(FIN, 'episodios.json'), JSON.stringify(resumen, null, 2));

console.log('\n');
for (const r of resumen) console.log(`  ${r.pieza.padEnd(6)} ${String(r.min).padStart(5)} min  ${r.replicas} réplicas  ${r.titulo}`);
console.log(`\n${resumen.length} episodios montados · ${filtradas} réplicas filtradas · ${resumen.reduce((a, r) => a + r.min, 0).toFixed(1)} min`);
fs.rmSync(TMP, { recursive: true, force: true });

// scripts/split-conceptos.ts
//
//   npx tsx scripts/split-conceptos.ts            # informe, no escribe
//   npx tsx scripts/split-conceptos.ts --write    # re-etiqueta el corpus
//
// Aplica la partición de `scripts/lib/conceptos-finos.ts` al corpus y
// saca la tabla de cobertura por nivel: cuántos puntos hay, cuántos
// ítems tiene cada uno y cuántos quedan por debajo del piso.
//
// El sub-punto se asigna por PRIMERA REGLA QUE CASA, y las reglas van de
// la más específica a la más general dentro de cada concepto — por eso
// el orden del fichero de particiones importa y está declarado ahí.
//
// Lo que no casa con ningún sub-punto se queda en el concepto padre y se
// REPORTA: el residuo es información. En la primera pasada destapó ítems
// de regência verbal viviendo bajo «pretérito perfeito irregular».
import fs from 'node:fs';
import path from 'node:path';
import { PARTICIONES, TRANSVERSALES, contarPuntos, textoItem, padreCubierto, pisoCero, conPisoCero } from './lib/conceptos-finos';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { reconciliar, informe, type PorPunto } from './lib/reconciliar-deficit';
// Importado, NO copiado: la copia local no se enteró de que nacía el
// bloque 12 y los ocho puntos de C2 se evaporaron de la tabla.
import { BLOQUE_A_NIVEL } from '../lib/data/anchor';
import { formatoDe } from './lib/formato-punto';

const WRITE = process.argv.includes('--write');
// ── EL PISO, decisión de Edu (E2#15) ─────────────────────────────────
// Baja de 12 a **8** ítems por punto, y a **6** en C2. El 12 era un
// número redondo elegido a ojo hace tres sesiones; con FSRS repitiendo,
// ocho ítems variados por punto sobran. Y en C2 lo que de verdad enseña
// es leer, para lo cual ya existe la Biblioteca: seis bastan para dejar
// el punto tocado y medible.
const PISO_POR_NIVEL: Record<string, number> = { A1: 8, A2: 8, B1: 8, B2: 8, C1: 8, C2: 6 };
const PISO_BASE = Number(process.env.PISO ?? 8);
const pisoDe = (nivel: string) => PISO_POR_NIVEL[nivel] ?? PISO_BASE;
const PISO = PISO_BASE;

const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/** El texto que se mira para decidir el sub-punto: la frase ENSAMBLADA
 *  (la del hueco relleno) más todo lo didáctico. Aquí no se busca si el
 *  ítem está en portugués sino QUÉ ENSEÑA, así que entra todo. */
const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const ficheros = fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort();
const porFichero = new Map<string, any[]>();
for (const f of ficheros) porFichero.set(f, JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));
const items = [...porFichero.values()].flat();

// El conteo es el CANÓNICO y vive en la librería: lo comparten este
// script y `hueco.ts`, que antes lo re-implementaba y daba 15 unidades
// menos por no aplicar particiones ni transversales.
const { cuenta, residuo, ejemplosResiduo, reasignados, porGlosa } = contarPuntos(items);


// ── Informe 1 · qué hizo la partición ────────────────────────────────
console.log(`# Partición de conceptos — ${PARTICIONES.length} conceptos gruesos → ${PARTICIONES.reduce((a, p) => a + p.subs.length, 0)} sub-puntos\n`);
console.log(`ítems del corpus: ${items.length} · asignaciones movidas a un sub-punto: ${reasignados} (de ellas ${porGlosa} sólo casan mirando la explicación, no el contenido: más débiles)\n`);
console.log('| concepto padre | ítems | → sub-puntos | residuo |');
console.log('|---|---:|---|---:|');
for (const p of PARTICIONES) {
  const tot = p.subs.reduce((a, s) => a + (cuenta.get(s.id) ?? 0), 0) + (residuo.get(p.padre) ?? 0);
  const det = p.subs.map((s) => `${s.id.replace(/^b\d+-/, '')}:${cuenta.get(s.id) ?? 0}`).join(' · ');
  console.log(`| ${p.padre} | ${tot} | ${det} | ${residuo.get(p.padre) ?? 0} |`);
}

const totalResiduo = [...residuo.values()].reduce((a, b) => a + b, 0);
console.log(`\n**Residuo total: ${totalResiduo}** — ítems que no casan con ningún sub-punto de su concepto.`);
console.log('No es basura: es la lista de lo que probablemente esté mal etiquetado de origen.\n');
for (const [c, n] of [...residuo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  console.log(`  ${c} — ${n} sin sub-punto`);
  for (const e of ejemplosResiduo.get(c) ?? []) console.log(`     ${e}`);
}

// ── Informe 2 · LA TABLA DE COBERTURA ────────────────────────────────
// El nivel sale del blockId declarado del concepto; los transversales
// (reg-verbal-*) no llevan prefijo de bloque en el id y sin esto salían
// sin nivel.
const BLOQUE_DE = new Map([...ALL_CONCEPTS, ...CONCEPTOS_FINOS].map((c) => [c.id, c.blockId]));
const nivelDe = (id: string): string => {
  const b = BLOQUE_DE.get(id) ?? Number(id.match(/^b(\d+)-/)?.[1] ?? 0);
  return BLOQUE_A_NIVEL[b] ?? '?';
};
// Un PADRE cuyos sub-puntos están todos cubiertos no cuenta como déficit:
// su cuenta es el residuo, no una carencia, y subirla exigiría escribir
// ítems que no casen con ningún sub-punto. Se ajusta aquí, una sola vez,
// para que todas las tablas de abajo vean lo mismo.
const CERO = pisoCero();
const pisoId = conPisoCero((id: string) => pisoDe(nivelDe(id)), CERO);
const padresCubiertos = [...cuenta.keys()].filter((id) => cuenta.get(id)! < pisoId(id) && padreCubierto(id, cuenta, pisoId));
for (const id of padresCubiertos) cuenta.set(id, pisoId(id));

// Los del piso bajado a cero POR DECISIÓN DECLARADA ya salen de
// `conPisoCero`, que baja el PISO en vez de subir la cuenta. Se imprimen
// siempre: una resta silenciosa es cómo se maquilla un número — y una
// NO-resta silenciosa engaña en la otra dirección, haciendo creer que
// queda trabajo que ya se decidió que no existe.
if (CERO.size) {
  console.log(`\n**${CERO.size} puntos con el piso a CERO por decisión declarada** (docs/plans/puntos-piso-cero.json):`);
  for (const [id, motivo] of CERO) console.log(`- \`${id}\`: ${motivo}`);
}
// EL INVENTARIO DE PUNTOS son los conceptos DECLARADOS, no los que
// resultan tener ítems. La v1 medía el déficit sobre `cuenta`, que sólo
// contiene conceptos con al menos una asignación, así que **un punto a
// cero era invisible**: no aparecía en la lista de déficit ni sumaba sus
// 12. Medido en E2#12: 15 puntos declarados están a cero y valían 180
// unidades que la tabla no veía.
//
// Ése es el motivo de que E2#11 publicara 24 ítems, cerrara dos puntos
// (uno de 0→12 y otro de 1→13, −23 de déficit real) y el total sólo
// bajara 1: el punto que iba de CERO nunca había estado contado, así que
// llenarlo no descontó nada. Un indicador que no ve el trabajo que se
// hace convierte el calendario en ficción.
const PUNTOS_DECLARADOS = [...new Set([...ALL_CONCEPTS, ...CONCEPTOS_FINOS].map((c) => c.id))];
for (const id of PUNTOS_DECLARADOS) if (!cuenta.has(id)) cuenta.set(id, 0);

const stats = (xs: number[]) => {
  if (!xs.length) return { min: 0, p50: 0, max: 0 };
  const s = [...xs].sort((a, b) => a - b);
  return { min: s[0]!, p50: s[Math.floor(s.length / 2)]!, max: s[s.length - 1]! };
};

console.log(`\n\n# COBERTURA — piso de ${PISO} ítems por punto\n`);
console.log('| nivel | puntos | ítems | mín | mediana | máx | puntos <' + PISO + ' | faltan para el piso |');
console.log('|-------|-------:|------:|----:|--------:|----:|----------:|--------------------:|');
let tPuntos = 0, tItems = 0, tBajo = 0, tFaltan = 0;
for (const n of NIVELES) {
  const ids = [...cuenta.keys()].filter((id) => nivelDe(id) === n);
  const vs = ids.map((id) => cuenta.get(id)!);
  const s = stats(vs);
  // Por ID, no por valor: el piso de un punto enterrado es 0 y eso sólo
  // se sabe mirando cuál es. Con el piso del NIVEL, los dos enterrados
  // seguían contando 8 cada uno en esta tabla y en la lista de abajo,
  // aunque el total de la reconciliación ya no los contara.
  const bajoIds = ids.filter((id) => cuenta.get(id)! < pisoId(id));
  const bajo = bajoIds;
  const faltan = bajoIds.reduce((a, id) => a + (pisoId(id) - cuenta.get(id)!), 0);
  console.log(`| ${n}    | ${String(ids.length).padStart(6)} | ${String(vs.reduce((a, b) => a + b, 0)).padStart(5)} | ${String(s.min).padStart(3)} | ${String(s.p50).padStart(7)} | ${String(s.max).padStart(3)} | ${String(bajo.length).padStart(9)} | ${String(faltan).padStart(19)} |`);
  tPuntos += ids.length; tItems += vs.reduce((a, b) => a + b, 0); tBajo += bajo.length; tFaltan += faltan;
}
console.log(`| **Σ** | ${String(tPuntos).padStart(6)} | ${String(tItems).padStart(5)} | | | | ${String(tBajo).padStart(9)} | ${String(tFaltan).padStart(19)} |`);

console.log(`\nPuntos por debajo del piso (${tBajo}), con lo que le falta a cada uno y CON QUÉ FORMATO se examina:`);
for (const [id, n] of [...cuenta.entries()].filter(([id2, v]) => v < pisoId(id2)).sort((a, b) => a[1] - b[1])) {
  const f = formatoDe(id);
  const piso = pisoId(id);
  console.log(`  ${String(n).padStart(3)}/${piso}  [${nivelDe(id)}] ${id.padEnd(34)} faltan ${String(piso - n).padStart(2)}  →  ${f.formato.padEnd(15)} (${f.clase}, ${f.confianza})`);
}

// ── Informe 2 bis · EL REPARTO POR FORMATO ───────────────────────────
// El criterio, en una línea: un punto se examina con JUICIO BINARIO si y
// sólo si el error que enseña produce, traducido palabra por palabra,
// español BIEN FORMADO. Si el calco también rompe el español, el alumno
// acierta traduciendo y el ítem no mide portugués.
console.log(`\n\n# CON QUÉ FORMATO SE EXAMINA CADA PUNTO\n`);
console.log('Criterio: **juicio binario si y sólo si el calco produce español bien formado.**');
console.log('Si el error rompe también el español, la glosa cognada lo caza y el ítem');
console.log('mide español, no portugués — medido tres veces: 20/24, 12/12 y 11/14.\n');
const porFormato = new Map<string, { total: number; deficit: number; medidos: number; defecto: number }>();
for (const [id, n] of cuenta) {
  const f = formatoDe(id);
  const o = porFormato.get(f.formato) ?? { total: 0, deficit: 0, medidos: 0, defecto: 0 };
  o.total++; o.deficit += Math.max(0, pisoId(id) - n);
  if (f.confianza === 'medido') o.medidos++;
  if (f.confianza === 'defecto') o.defecto++;
  porFormato.set(f.formato, o);
}
console.log('| formato | puntos | déficit que arrastra | medidos con cifras | por defecto de bloque |');
console.log('|---|---:|---:|---:|---:|');
for (const [f, o] of [...porFormato].sort((a, b) => b[1].deficit - a[1].deficit))
  console.log(`| ${f} | ${o.total} | ${o.deficit} | ${o.medidos} | ${o.defecto} |`);
console.log(`\n**Honestidad de la columna**: ${[...porFormato.values()].reduce((a, o) => a + o.defecto, 0)} de ${cuenta.size} puntos llevan el valor por DEFECTO de su bloque, sin mirar el punto.`);
console.log('Un defecto no es una medición: es el punto de partida que los overrides corrigen.');

// Y la vista que decide QUÉ LÍNEA produce lo que queda de C1 y C2, que
// es la mitad del déficit y donde el corpus está vacío.
console.log(`\n## C1 y C2 declarados — la columna que decide quién los produce\n`);
console.log('| punto | nivel | tiene | falta | formato | por qué |');
console.log('|---|---|---:|---:|---|---|');
for (const [id, n] of [...cuenta].filter(([id]) => ['C1', 'C2'].includes(nivelDe(id))).sort()) {
  const f = formatoDe(id);
  console.log(`| \`${id}\` | ${nivelDe(id)} | ${n} | ${Math.max(0, pisoId(id) - n)} | **${f.formato}** | ${f.motivo} |`);
}


// ── Informe 3 · CONTRA LO QUE EL CURRÍCULO DECLARA ───────────────────
// La tabla de arriba mide los puntos que el corpus TIENE. Falta la otra
// mitad: los que el currículo declara y el corpus no tiene siquiera
// empezados — que es donde vive C1 y C2 entero.
// «SIN EMPEZAR» son los puntos que el currículo enumera y para los que
// **ni siquiera hay un concepto declarado** — no los que tienen cero
// ítems, que ahora sí entran en la tabla de arriba con su déficit
// completo. Mezclarlos era la segunda mitad del descuadre: el término
// `max(0, currículo − puntosConItems)` daba 0 para A2/B1/B2 (la
// partición hizo más puntos que los que el currículo enumera) y por eso
// cerrar un punto a cero en B1 no descontaba nada por ninguna vía.
// C1 y C2 NO llevan la cuenta del regex (32 y 34) sino la DICTAMINADA.
// El recuento parte la prosa del currículo por comas y puntos y comas, y
// en C1/C2 eso produce segmentos que no son puntos de enseñanza: ocho
// comprensiones o producciones ORALES —a cero por decisión de Edu—,
// nueve metas de vocabulario que se cubren leyendo, tres colas de frase
// partidas por una coma («evaluada sobre transcripción.»), un objetivo
// profesional y **cuatro trozos de prosa técnica del propio documento**
// («'relay'|'summarise'|…», «fidelityAnchors: string[]}`»). Contarlos
// metía **188 unidades de déficit inexistentes**, el 31 % del total.
// El dictamen, punto a punto, en docs/plans/puntos-c1c2-dictamen.json;
// el recuento, en `npx tsx scripts/dictamen-c1c2.ts`.
// A1 dictaminado en E2#18: de sus «8 sin empezar» eran 5 puntos reales
// (4 de fonología, 1 de interrogativos), 2 metas de léxico y 3 fragmentos.
// PENDIENTE: A2, B1 y B2 no están dictaminados, pero su `sinEmpezar` ya
// era 0 porque la partición hizo más puntos que la prosa — así que su
// sesgo, si lo hay, no infla el déficit.
const DICT = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs/plans/puntos-c1c2-dictamen.json'), 'utf8'));
const reales = (n: string) => (DICT[n] as { clase: string }[]).filter((x) => ['declarado', 'nuevo'].includes(x.clase)).length;
const PUNTOS_CURRICULO: Record<string, number> = { A1: reales('A1'), A2: 31, B1: 27, B2: 31, C1: reales('C1'), C2: reales('C2') };
console.log(`\n\n# LO QUE FALTA PARA CUBRIR — piso ${PISO}, contra los puntos que enumera el currículo\n`);
console.log('| nivel | puntos currículo | puntos con corpus | puntos SIN empezar | déficit de los empezados | × piso los nuevos | FALTA |');
console.log('|-------|-----------------:|------------------:|-------------------:|-------------------------:|------------------:|------:|');
let gTot = 0;
for (const n of NIVELES) {
  const ids = [...cuenta.keys()].filter((id) => nivelDe(id) === n);
  const vs = ids.map((id) => cuenta.get(id)!);
  const piso = pisoDe(n);
  // El déficit de los EMPEZADOS va por id, para que los puntos enterrados
  // valgan 0 aquí igual que en la reconciliación. Con el piso del nivel,
  // esta tabla decía FALTA 40 mientras la reconciliación decía 24, y las
  // dos son la misma cuenta.
  const deficit = ids.filter((id) => cuenta.get(id)! < pisoId(id)).reduce((a, id) => a + (pisoId(id) - cuenta.get(id)!), 0);
  const pc = PUNTOS_CURRICULO[n] ?? 0;
  // `ids` ya son los DECLARADOS del nivel (los ceros incluidos), así que
  // esto cuenta sólo lo que falta por declarar.
  const sinEmpezar = Math.max(0, pc - ids.length);
  const nuevos = sinEmpezar * piso;
  const falta = deficit + nuevos;
  gTot += falta;
  console.log(`| ${n}    | ${String(pc).padStart(16)} | ${String(ids.length).padStart(17)} | ${String(sinEmpezar).padStart(18)} | ${String(deficit).padStart(24)} | ${String(nuevos).padStart(17)} | ${String(falta).padStart(5)} |`);
}
console.log(`| **Σ** | ${String(Object.values(PUNTOS_CURRICULO).reduce((a, b) => a + b, 0)).padStart(16)} | ${String([...cuenta.keys()].length).padStart(17)} | | | | **${gTot}** |`);
console.log(`\nB1 y B2 tienen MÁS puntos que los que el currículo enumera: la partición`);
console.log(`salió más fina que la prosa del currículo, así que ahí no hay puntos sin`);
console.log(`empezar y el trabajo es sólo llenar los que están por debajo del piso.`);

// ── Informe 4 · RECONCILIACIÓN, obligatoria ──────────────────────────
// Cada sesión tiene que cerrar la cuenta: cuánto había, qué entró, qué
// puntos nacieron o murieron, y cuánto queda. Con `--registrar` se
// guarda la foto para que la próxima sesión reconcilie contra ella.
const HIST = path.join(process.cwd(), 'docs/plans/deficit-historico.json');
const porPuntoAhora: PorPunto = Object.fromEntries(cuenta);
const historico: { fecha: string; nota?: string; porPunto: PorPunto }[] =
  fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : [];

console.log('\n');
if (historico.length) {
  const ultima = historico[historico.length - 1]!;
  // Con `pisoId`, no con el piso crudo: las dos fotos tienen que medirse
  // con el MISMO piso o el residuo miente. Si una sesión entierra un punto
  // y la reconciliación sigue pidiéndole 8, la bajada aparece como déficit
  // sin explicar.
  const r = reconciliar(ultima.porPunto, porPuntoAhora, pisoId);
  console.log(informe(r, '8, C2 6'));
  console.log(`\n(foto anterior: ${ultima.fecha}${ultima.nota ? ' — ' + ultima.nota : ''})`);
  if (r.residuo !== 0) {
    console.log(`\n✗ RESIDUO ${r.residuo}: hay déficit sin explicar. No se cierra la sesión así.`);
    process.exitCode = 1;
  }
} else {
  console.log('## Reconciliación del déficit\n');
  console.log('No hay foto anterior: ésta es la primera. Se registra con `--registrar`.');
}

if (process.argv.includes('--registrar')) {
  // La nota es el POSICIONAL de detrás de `--registrar`, pero es natural
  // escribir `--nota "..."` y entonces se pierde en silencio: la foto
  // queda sin explicación y la sesión siguiente reconcilia a ciegas. Se
  // aceptan las dos formas.
  const iN = process.argv.indexOf('--nota');
  const nota = iN >= 0 ? process.argv[iN + 1] : process.argv[process.argv.indexOf('--registrar') + 1];
  historico.push({ fecha: new Date().toISOString().slice(0, 10), nota: nota && !nota.startsWith('--') ? nota : undefined, porPunto: porPuntoAhora });
  fs.writeFileSync(HIST, JSON.stringify(historico, null, 1) + '\n');
  console.log(`\nFoto registrada en ${path.relative(process.cwd(), HIST)} (${historico.length} en el histórico).`);
}

// ── Escritura ────────────────────────────────────────────────────────
if (!WRITE) { console.log('\nDRY-RUN: el corpus no se ha tocado.'); process.exit(0); }
let escritos = 0;
for (const [f, arr] of porFichero) {
  for (const x of arr) {
    if (!x.__nuevos) continue;
    const antes = JSON.stringify(x.concepts ?? []);
    x.concepts = x.__nuevos;
    delete x.__nuevos;
    if (JSON.stringify(x.concepts) !== antes) escritos++;
  }
  fs.writeFileSync(path.join(DIR, f), JSON.stringify(arr, null, 2) + '\n');
}
console.log(`\nESCRITO: ${escritos} ítems re-etiquetados en ${porFichero.size} ficheros.`);

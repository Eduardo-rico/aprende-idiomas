// scripts/triage-variante.ts — la Ola V en un comando.
//
//   npx tsx scripts/triage-variante.ts            → dry-run (no escribe)
//   npx tsx scripts/triage-variante.ts --aplicar  → escribe los bloques
//
// Clasifica SOLO los ítems `unchecked` con la regla de triage-inerte.
//
// IMPORTANTE — la consagración a `neutral` está DESACTIVADA: la
// auditoría de calibración del 2026-07-29 (120 sellables al azar, tercer
// lingüista adversarial) encontró 19 ERROR y 15 AVISO — el criterio
// precomprometido era 0 y ≤3. Una regla de superficie no valida lengua:
// se le escapan regencias, posesivo sin artículo, español crudo y
// portugués roto en ambas normas. Los «inertes» se REPORTAN como
// candidatos (ordenan la cola humana) pero NO se escribe ningún
// `neutral`. Lo único que se aplica es la cuarentena por marcador
// inequívoco, cuya muestra sí pasó auditoría.
//
// Nada se pierde: cada ítem termina en exactamente uno de los tres
// destinos y la conciliación lo comprueba — si las cuentas no cuadran,
// aborta sin escribir.
import fs from 'node:fs';
import path from 'node:path';
import { triage, SELLO } from './lib/triage-inerte';
import type { Ex } from './lib/variant-guard';

const APLICAR = process.argv.includes('--aplicar');
const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');

let total = 0, unchecked = 0;
const destinos = { 'needs-human': 0, neutral: 0, unchecked: 0 };
const motivos: Record<string, number> = {};
const riesgos: Record<string, number> = {};
const porBloque: Record<string, string> = {};

for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json')).sort()) {
  const ruta = path.join(DIR, f);
  const json = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  const items: Ex[] = json.exercises ?? json.items ?? json;
  let cambiados = 0;
  for (const ex of items) {
    total++;
    if ((ex as { variantStatus?: string }).variantStatus !== 'unchecked') continue;
    unchecked++;
    const r = triage(ex);
    destinos[r.destino]++;
    if (r.destino === 'needs-human') {
      motivos[r.motivo] = (motivos[r.motivo] ?? 0) + 1;
      if (APLICAR) {
        (ex as Record<string, unknown>).variantStatus = 'needs-human';
        (ex as Record<string, unknown>).variantVerificacion = `${SELLO}: ${r.motivo}`;
        cambiados++;
      }
    } else if (r.destino === 'neutral') {
      // NO se escribe: la calibración falló (ver cabecera). El conteo
      // queda como «candidato-inerte» para priorizar la cola humana.
    } else {
      for (const x of r.riesgos) riesgos[x] = (riesgos[x] ?? 0) + 1;
    }
  }
  if (APLICAR && cambiados > 0) {
    fs.writeFileSync(ruta, JSON.stringify(json, null, 1) + '\n');
  }
  porBloque[f] = `${cambiados} cambiados`;
}

// Conciliación: todo unchecked debe estar en exactamente un destino.
const suma = destinos['needs-human'] + destinos.neutral + destinos.unchecked;
if (suma !== unchecked) {
  console.error(`CONCILIACIÓN ROTA: ${suma} clasificados ≠ ${unchecked} unchecked — nada es de fiar.`);
  process.exit(1);
}

console.log(`${APLICAR ? 'APLICADO (solo cuarentena)' : 'DRY-RUN'} · ${total} ítems, ${unchecked} unchecked`);
console.log(`→ needs-human: ${destinos['needs-human']} · candidatos-inertes (${SELLO}, NO escritos): ${destinos.neutral} · con riesgos: ${destinos.unchecked}`);
console.log('\nmotivos de cuarentena:');
for (const [m, n] of Object.entries(motivos).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${m}`);
console.log('\nriesgos de los retenidos:');
for (const [m, n] of Object.entries(riesgos).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${m}`);
if (APLICAR) {
  console.log('\ncambios por bloque:');
  for (const [f, c] of Object.entries(porBloque)) console.log(`  ${f}: ${c}`);
}

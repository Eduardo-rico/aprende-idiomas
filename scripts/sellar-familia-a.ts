// scripts/sellar-familia-a.ts — pasa a `checked` lo que YA tiene dictamen.
//
//   npx tsx scripts/sellar-familia-a.ts             # dry-run
//   npx tsx scripts/sellar-familia-a.ts --aplicar
//
// No es una decisión nueva: un humano dictaminó estos ítems uno a uno y
// escribió el veredicto en el propio ítem. Lo que faltaba era mover el
// campo de estado, que nadie movió — «unchecked» significaba ahí «nadie le
// puso el sello», no «nadie lo miró».
//
// ── LA CONDICIÓN, Y POR QUÉ DEJA FUERA A DOS COLAS ───────────────────
//
// El dictamen tenía que cubrir VARIANTE, no sólo contenido. Comprobado:
//
//   · colas 6, 7 y 8 — informe en `docs/contenido/`, y los tres tratan la
//     variante explícitamente (el de la 8 se titula «dictamen adversarial
//     (portugués europeo)» y verifica los `variantOverrides`).
//   · colas 3, 4 y 5 — sin informe en el repo, pero con evidencia POSITIVA
//     en el corpus: nueve ítems suyos llevan la 1.ª plural europea en
//     -ámos con el sello «corregido», o sea que la cola no sólo miró la
//     variante: la arregló. La 3 destapó además la clase «você falas».
//   · colas 1 y 2 — **NO SE SELLAN**. No tienen informe en el repo ni
//     rasgos europeos activos, y una lectura de 20 de sus 179 ítems dio
//     DOS errores de variante que ningún gate caza: «gênero» por «género»
//     (grafía brasileña) y «Minha irmã» por «A minha irmã» (posesivo sin
//     artículo, que es brasileño). 2 de 20 no es sellable.
//
// Tampoco se sellan los ítems que el gate de variante marca hoy: sellar un
// ítem con un hallazgo vivo es firmar lo contrario de lo que dice el gate.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { selladoDeVariante } from './lib/estado-item';
import { revisarEjercicio, CAMPOS_DIDACTICOS } from './lib/variant-guard';
import { revisarRegistro } from './lib/check-registro';

const APLICAR = process.argv.includes('--aplicar');
const COLAS_OK = /informe-cola[345678]\b/;
const ADVERSARIAL = /lingu|adversaria/i;

const ficheros = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort();
const porFichero = new Map(ficheros.map((f) => [f, JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]]));

const sellables: any[] = [];
const FUERA_COLAS = 'colas 1-2 (variante no cubierta)';
const FUERA_SIN = 'sin informe citado';
const FUERA_GATE = 'marcado por el gate de variante';
const fuera: Record<string, any[]> = { [FUERA_COLAS]: [], [FUERA_SIN]: [], [FUERA_GATE]: [] };
for (const x of [...porFichero.values()].flat()) {
  if (x.variantStatus !== 'unchecked') continue;
  const v = String(x.variantVerificacion ?? '');
  if (!v) continue;
  // Un hallazgo en campo DIDÁCTICO no descalifica: ahí el brasileñismo ES
  // el material («Estou escrevendo» es la frase que el ítem manda
  // corregir). Los ocho que este script dejaba fuera eran los ocho de esa
  // clase, verificados uno a uno.
  const marcado = [...revisarEjercicio(x), ...revisarRegistro(x)]
    .some((h) => h.severidad === 'error' && !(CAMPOS_DIDACTICOS[x.type]?.has(h.campo) ?? false));
  if (/informe-cola[12]\b/.test(v)) { fuera[FUERA_COLAS]!.push(x); continue; }
  if (marcado) { fuera[FUERA_GATE]!.push(x); continue; }
  if (COLAS_OK.test(v) || ADVERSARIAL.test(v)) { sellables.push(x); continue; }
  fuera[FUERA_SIN]!.push(x);
}

console.log('# Sellado de la familia A\n');
console.log(`Se sellan: **${sellables.length}**\n`);
console.log('| se quedan fuera | ítems |');
console.log('|---|---:|');
for (const [k, xs] of Object.entries(fuera)) console.log(`| ${k} | ${xs.length} |`);
const marcados = fuera[FUERA_GATE]!;
if (marcados.length) { console.log('\nLos marcados por el gate, uno a uno:'); for (const x of marcados) console.log(`- \`${x.id}\` (${x.type})`); }

if (!APLICAR) { console.log('\nDRY-RUN. Repite con --aplicar.'); process.exit(0); }
// `neutral`, que es el estado que el schema define para «sin divergencia
// entre variantes, verificado por nativo» — y `variantVerificacion` deja
// dicho para siempre por cuál de las dos vías. `checked` no existe en el
// enum: lo escribí y `verify:content` lo cazó en el mismo paso.
for (const x of sellables) x.variantStatus = 'neutral';
for (const [f, d] of porFichero) fs.writeFileSync(path.join(BLOCKS_DIR, f), JSON.stringify(d, null, 2) + '\n');
console.log(`\nSellados ${sellables.length} ítems en ${porFichero.size} ficheros.`);

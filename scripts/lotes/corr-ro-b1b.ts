// scripts/lotes/corr-ro-b1b.ts — LA REESCRITURA DE `r7-anti-progresivo`.
//
//   npx tsx scripts/lotes/corr-ro-b1b.ts
//
// Los seis ítems del punto, reescritos para que **midan sólo su punto**, y
// en fichero aparte porque los otros cinco del lote 18 ya están publicados
// y el publicador rechaza el lote entero si una frase se repite.
//
// El diagnóstico, del lingüista y confirmado por el coordinador: la v0
// pedía dos cosas a la vez —borrar «sunt» Y producir la forma del presente
// (`mănânc`, `citesc`, `faci`)—, y la segunda es A1. La operación
// anti-progresiva se aprende en el primer ítem, así que a partir del
// segundo lo que separaba acierto de fallo era la morfología: **el FSRS le
// cargaba a un punto de B1 un fallo de A1**. Los seis viejos están
// retirados con ese motivo escrito, no borrados.
//
// La forma va REGALADA en el enunciado, en una cláusula contrastiva de la
// propia frase, y el gate lo exige de la única manera computable: **la
// corrección sólo puede BORRAR**.
import { ITEMS as TODOS, verificar as verificarB1 } from './corr-ro-b1';
import { preflight, type ItemCorreccion } from '../lib/correccion';
import { informeAsigna } from '../lib/asigna-ro';

export const ITEMS: ItemCorreccion[] = TODOS.filter((x) => x.p === 'r7-anti-progresivo');
export const verificar = verificarB1;

if (new RegExp(`[/\\\\]corr-ro-b1b\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-B1b — r7-anti-progresivo reescrito · ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ~~${x.mala}~~ → **${x.buena}**`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

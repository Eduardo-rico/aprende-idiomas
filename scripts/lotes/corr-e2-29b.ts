// scripts/lotes/corr-e2-29b.ts
//
//   npx tsx scripts/lotes/corr-e2-29b.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-e2-29b.ts --json     # ítems para publicar
//
// E2#29 · **4 unidades, y son las últimas de contenido escribible del
// proyecto** que no dependen del oído de Edu.
//
// El plan pedía 38 al empezar la sesión. Después de leer los 64 ítems de
// la cola de dictamen quedan 4: sellar un ítem viejo lo convierte en
// cobertura, y 34 de las 38 estaban ya escritas desde hace meses esperando
// que alguien las mirara. Es la demostración más limpia de la doctrina que
// gobernó la sesión —**antes de escribir, medir; y antes de medir,
// dictaminar**— y de por qué el número que gobierna es el de lo SELLADO.
//
// Los tres puntos son de indefinidos y posesivos, y los tres tienen calco
// español defendible, que es la condición 1 del formato: el error que el
// ítem enseña a corregir tiene que ser uno que el hispanohablante cometa
// de verdad, no uno inventado.
import { verificar, preflight, type ItemCorreccion } from '../lib/correccion';

const OUTRO = 'b2-indef-outro-mesmo';
const CADA = 'b2-indef-cada-qualquer';
const POSS = 'b2-poss-formas';

export const ITEMS: ItemCorreccion[] = [
  // ══ b2-indef-outro-mesmo (2) ══════════════════════════════════════
  //
  // El español pone artículo indefinido delante de «otro» sólo por error,
  // pero el portugués lo PROHÍBE de forma tajante —«um outro» existe con
  // otro valor— y, sobre todo, **«outro» ya lleva el indefinido dentro**.
  // El calco de verdad es el del español «otro día más», y el de «lo
  // mismo», que en portugués pide «o mesmo» con artículo.
  { p: OUTRO, pasada: 1, espejoEs: false,
    mala: 'Preciso de mais um outro dia para acabar isto.',
    buena: 'Preciso de mais um dia para acabar isto.',
    calcoEs: 'Necesito un día más para terminar esto.',
    explicacion: '«Mais um outro» amontona dos indefinidos donde el portugués sólo pone uno: «mais um dia». La forma «um outro» existe, pero sirve para contraponer —«um outro caminho», otro distinto—, no para sumar.',
    varianteEsperada: 'dos indefinidos amontonados' },
  { p: OUTRO, pasada: 1, espejoEs: false,
    mala: 'Ela disse mesmo que eu, palavra por palavra.',
    buena: 'Ela disse o mesmo que eu, palavra por palavra.',
    calcoEs: 'Ella dijo lo mismo que yo, palabra por palabra.',
    explicacion: 'El español «lo mismo» se dice en portugués «o mesmo», con artículo masculino: el portugués no tiene el neutro «lo», así que lo resuelve con «o».',
    varianteEsperada: 'el neutro «lo» del español, que el portugués no tiene' },

  // ══ b2-indef-cada-qualquer (1) ════════════════════════════════════
  //
  // «Cada» en español puede ir con numeral y con plural —«cada dos
  // días»—, y el portugués lo admite, así que ahí no hay divergencia. La
  // que sí existe es «cada uno» → «cada um», donde el español permite
  // «cada quien» y el portugués no tiene equivalente con «quem».
  { p: CADA, pasada: 1, espejoEs: false,
    mala: 'Cada quem trouxe a sua própria bebida para a festa.',
    buena: 'Cada um trouxe a sua própria bebida para a festa.',
    calcoEs: 'Cada quien trajo su propia bebida para la fiesta.',
    explicacion: 'El español «cada quien» no tiene equivalente en portugués: «cada quem» no existe. Se dice «cada um» —o «cada pessoa»—, y el verbo va en singular.',
    varianteEsperada: 'locución española sin equivalente' },

  // ══ b2-poss-formas (1) ════════════════════════════════════════════
  //
  // El artículo delante del posesivo, que es LA marca que separa el
  // europeo del brasileño — y la que más veces ha salido hoy en la cola
  // de dictamen: seis ítems viejos la incumplían.
  { p: POSS, pasada: 1, espejoEs: false,
    mala: 'Minha irmã trabalha num hospital perto daqui.',
    buena: 'A minha irmã trabalha num hospital perto daqui.',
    calcoEs: 'Mi hermana trabaja en un hospital cerca de aquí.',
    explicacion: 'El portugués europeo pone el artículo DELANTE del posesivo: «a minha irmã», «o meu carro». El español no lo lleva, y el portugués de Brasil tampoco, así que el hispanohablante lo omite por partida doble.',
    varianteEsperada: 'posesivo sin artículo, que es la forma brasileña' },
];

if (process.argv[1]?.includes('corr-e2-29b')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección E2#29b — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Preflight\n`);
  for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

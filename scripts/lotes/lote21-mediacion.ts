// scripts/lotes/lote21-mediacion.ts
//
//   npx tsx scripts/lotes/lote21-mediacion.ts            # doc + gates
//   npx tsx scripts/lotes/lote21-mediacion.ts --json     # ítems para publicar
//
// LOTE 21 · las 6 últimas unidades del bucket de mediación:
// `b12-traducao-literaria`. **Con éstas, mediación queda en cero.**
//
// El punto se juzga por registro y efecto además de por contenido, que es
// exactamente lo que una rúbrica de mediación mide — y por eso vive aquí
// y no en un tipo «translation», donde sólo se compararía el contenido.
//
// Los marcadores son los falsos amigos y los calcos que NO pueden
// sobrevivir: no son vocabulario suelto, son las trampas concretas que
// una traducción entre lenguas vecinas se come. Tres en cada dirección,
// porque traducir hacia la lengua propia y hacia la ajena fallan de
// maneras distintas.
import { rubricaDe, verificar, inventadosProbables, type ItemMed } from './lote12-mediacion';

const TRD = 'b12-traducao-literaria';

export const ITEMS: ItemMed[] = [
  {
    id: 'MED-21-01', concepto: TRD, registroFuente: 'es-literario', registroDestino: 'pt-literario',
    sourceLang: 'es',
    sourceText: 'Se quedó en el vano de la puerta, sin entrar del todo, como quien pide permiso a una casa que fue suya.',
    audience: 'los lectores de una antología bilingüe, que van a leer las dos versiones en páginas enfrentadas',
    instruccion: 'Tradúcelo al portugués conservando el ritmo y el final suspendido. La versión va al lado del original, así que la comparación es inmediata.',
    marcadores: [['vano de la puerta', 'ombreira', 'vão da porta', 'à porta'], ['que fue suya', 'que foi sua', 'que já foi sua', 'que fora sua']],
    datos: [['sin entrar del todo', 'sem entrar', 'sem chegar a entrar'], ['pide permiso', 'pede licença', 'pedisse licença']],
    modelo: 'Ficou na ombreira da porta, sem chegar a entrar, como quem pede licença a uma casa que já foi sua.',
    wordRange: [14, 35], register: 'neutro',
  },
  {
    id: 'MED-21-02', concepto: TRD, registroFuente: 'es-literario', registroDestino: 'pt-literario',
    sourceLang: 'es',
    sourceText: 'Nadie le había avisado de que envejecer consistía sobre todo en enterrar a los que sabían tu nombre de niño.',
    audience: 'la misma antología, y el traductor sabe que la frase es la que cierra el capítulo',
    instruccion: 'Tradúcelo cuidando el final: la frase cierra capítulo y el peso tiene que quedar en la última palabra.',
    marcadores: [['Nadie le había avisado', 'Ninguém o tinha avisado', 'Ninguém lhe dissera', 'Ninguém o avisara'], ['consistía sobre todo en', 'era sobretudo', 'consistia sobretudo em', 'era acima de tudo']],
    // En un ítem de TRADUCCIÓN el dato canónico —el primero— se busca en la
    // FUENTE, así que va en la lengua de la fuente; las aceptadas son las
    // del destino. Puesto al revés, el gate dice que la casilla exige algo
    // que la fuente no da, y tiene razón.
    datos: [['envejecer', 'envelhecer'], ['nombre de niño', 'nome de criança', 'nome de menino']],
    modelo: 'Ninguém o tinha avisado de que envelhecer era sobretudo enterrar os que sabiam o seu nome de criança.',
    wordRange: [12, 32], register: 'neutro',
  },
  {
    id: 'MED-21-03', concepto: TRD, registroFuente: 'es-literario', registroDestino: 'pt-literario',
    sourceLang: 'es',
    sourceText: 'La ciudad, que presumía de puertos, no tenía ya barcos; y sin embargo seguía oliendo a despedida.',
    audience: 'la antología, en un pasaje donde el autor español juega con el tópico marítimo',
    instruccion: 'Tradúcelo sin caer en los dos falsos amigos que la frase pone por delante.',
    marcadores: [['presumía de', 'que se gabava', 'gabava-se', 'que se orgulhava'], ['sin embargo', 'no entanto', 'contudo', 'e no entanto']],
    datos: [['puertos', 'portos'], ['despedida', 'despedida', 'adeus']],
    modelo: 'A cidade, que se gabava dos seus portos, já não tinha barcos; e no entanto continuava a cheirar a despedida.',
    wordRange: [14, 35], register: 'neutro',
  },
  {
    id: 'MED-21-04', concepto: TRD, registroFuente: 'pt-literario', registroDestino: 'es-literario',
    targetLang: 'es',
    sourceText: 'Ficou-se pelo adro, à espera de uma coragem que não chegou, e voltou para casa com o ramo na mão.',
    audience: 'los lectores españoles de la misma antología, en la página enfrentada',
    instruccion: 'Tradúcelo al español sin explicar de más: el original no dice a quién iban las flores y la traducción tampoco debe decirlo.',
    marcadores: [['Ficou-se pelo adro', 'Se quedó en el atrio', 'Se quedó fuera', 'atrio'], ['à espera de', 'esperando', 'a la espera de', 'esperando una']],
    datos: [['coragem', 'valor', 'coraje'], ['ramo', 'ramo', 'las flores']],
    modelo: 'Se quedó en el atrio, esperando un valor que no llegó, y volvió a casa con el ramo en la mano.',
    wordRange: [14, 35], register: 'neutro',
  },
  {
    id: 'MED-21-05', concepto: TRD, registroFuente: 'pt-literario', registroDestino: 'es-literario',
    targetLang: 'es',
    sourceText: 'Era um homem de poucas falas e muitas manias, e as duas coisas lhe vinham do pai, que também assim fora.',
    audience: 'la antología, en un retrato irónico que no debe volverse cariñoso al traducir',
    instruccion: 'Tradúcelo conservando la ironía seca. Cuidado con «manias», que en español no significa lo que parece.',
    marcadores: [['de poucas falas', 'de pocas palabras', 'poco hablador', 'callado'], ['muitas manias', 'muchas rarezas', 'muchas manías', 'sus rarezas']],
    datos: [['do pai', 'del padre'], ['também assim fora', 'también había sido así', 'lo había sido', 'igual']],
    modelo: 'Era hombre de pocas palabras y muchas rarezas, y las dos cosas le venían del padre, que también lo había sido.',
    wordRange: [14, 35], register: 'neutro',
  },
  {
    id: 'MED-21-06', concepto: TRD, registroFuente: 'pt-literario', registroDestino: 'es-literario',
    targetLang: 'es',
    sourceText: 'Ao fim da tarde punha-se à janela, não para ver quem passava, mas para que alguém o visse a ele.',
    audience: 'la antología; el original europeo usa la ênclise y el español no tiene forma de reproducirla',
    instruccion: 'Tradúcelo asumiendo que la colocación del clítico no viaja: lo que sí tiene que viajar es la vuelta que da el final.',
    marcadores: [['punha-se à janela', 'se asomaba', 'se ponía a la ventana', 'a la ventana'], ['para que alguém o visse a ele', 'para que alguien lo viera a él', 'lo vieran a él', 'para que lo vieran']],
    datos: [['Ao fim da tarde', 'Al caer la tarde', 'A última hora de la tarde'], ['quem passava', 'quién pasaba', 'los que pasaban']],
    modelo: 'Al caer la tarde se asomaba a la ventana, no para ver quién pasaba, sino para que alguien lo viera a él.',
    wordRange: [14, 35], register: 'neutro',
  },
];

if (process.argv[1]?.includes('lote21-mediacion')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const d = new Map<string, number>();
  for (const x of ITEMS) { const k = `${x.registroFuente}→${x.registroDestino}`; d.set(k, (d.get(k) ?? 0) + 1); }
  console.log(`# Lote 21 — traducción literaria · ${ITEMS.length} ítems\n`);
  console.log(`\`${TRD}\`: ${[...d].map(([k, n]) => `${k} ×${n}`).join(' · ')}\n`);
  const sos = ITEMS.map((x) => [x.id, inventadosProbables(x)] as const).filter(([, w]) => w.length);
  if (sos.length) {
    console.log(`## Aviso · cifras y nombres del modelo que no están en la fuente\n`);
    for (const [id, w] of sos) console.log(`- ${id}: ${w.join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

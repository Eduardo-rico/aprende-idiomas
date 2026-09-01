// scripts/lotes/trans-e2-29.ts
//
//   npx tsx scripts/lotes/trans-e2-29.ts            # gates + informe espejo
//   npx tsx scripts/lotes/trans-e2-29.ts --json     # ítems para publicar
//
// E2#29 · 22 unidades de transformación, contra el hueco recalculado justo
// antes de escribir: 35 unidades en 11 puntos, de las que estas cuatro son
// las que piden ≥5.
//
// El atajo del formato es el ESPEJO: si el español hace la misma
// transformación, el alumno la resuelve traduciendo y el ítem no mide
// portugués. Se declara por ítem y se imprime el porcentaje, porque no se
// puede calcular. Aquí sale bajo por construcción:
//
//   · `b4-mqp-simples` — el pluscuamperfecto simple («falara») no existe
//     en español moderno, así que no hay nada que copiar.
//   · `b5-se-futuro-conj` y `b6-fut-subj-se` — el futuro do conjuntivo
//     tampoco: donde el portugués lo exige, el español pone presente.
//   · `b7-gerundio-adverbial` — lo declaré espejo y estaba MAL. El espejo
//     no es si las dos lenguas tienen la construcción de partida, sino si
//     el español hace la MISMA transformación: traducir «Saiu de casa
//     correndo» da «Salió de casa corriendo», que no le dice a nadie que
//     escriba «a correr». El gate rechazó el punto entero fiándose de mi
//     declaración falsa — el ítem estaba bien y la etiqueta no.
import { verificar, informeEspejo, type ItemTrans } from '../lib/transformacion';

export const ITEMS: ItemTrans[] = [
  // ══ b4-mqp-simples (7) — «tinha falado» → «falara». La forma simple es
  // de la lengua escrita y no tiene equivalente en español moderno.
  { p: 'b4-mqp-simples', pasada: 1, espejoEs: false, lema: 'falar', t: 'mqpSimples', per: 'ele',
    s: 'Ele tinha falado com o diretor antes da reunião.',
    molde: 'Ele {} com o diretor antes da reunião.',
    instruccion: 'Sustituye el pluscuamperfecto compuesto por la forma SIMPLE, la de la lengua escrita, y reescribe la frase entera.',
    hint: 'una sola palabra en vez de «tinha» + participio' },
  { p: 'b4-mqp-simples', pasada: 1, espejoEs: false, lema: 'fazer', t: 'mqpSimples', per: 'eles',
    s: 'Eles tinham feito tudo antes de eu chegar.',
    molde: 'Eles {} tudo antes de eu chegar.',
    instruccion: 'Pasa el pluscuamperfecto compuesto a la forma simple y reescribe la frase entera.',
    hint: 'irregular: el tema del pretérito más la terminación' },
  { p: 'b4-mqp-simples', pasada: 1, espejoEs: false, lema: 'ver', t: 'mqpSimples', per: 'eu',
    s: 'Eu tinha visto aquele filme muitos anos antes.',
    molde: 'Eu {} aquele filme muitos anos antes.',
    instruccion: 'Pasa el pluscuamperfecto compuesto a la forma simple y reescribe la frase entera.',
    hint: 'irregular, primera persona' },
  { p: 'b4-mqp-simples', pasada: 1, espejoEs: false, lema: 'dizer', t: 'mqpSimples', per: 'ele',
    s: 'Ela tinha dito o mesmo na véspera.',
    molde: 'Ela {} o mesmo na véspera.',
    instruccion: 'Pasa el pluscuamperfecto compuesto a la forma simple y reescribe la frase entera.',
    hint: 'irregular, tercera persona' },
  { p: 'b4-mqp-simples', pasada: 1, espejoEs: false, lema: 'ser', t: 'mqpSimples', per: 'nós',
    s: 'Nós tínhamos sido os primeiros a chegar.',
    molde: 'Nós {} os primeiros a chegar.',
    instruccion: 'Pasa el pluscuamperfecto compuesto a la forma simple y reescribe la frase entera.',
    hint: 'primera del plural, con acento' },
  { p: 'b4-mqp-simples', pasada: 1, espejoEs: false, lema: 'estar', t: 'mqpSimples', per: 'eles',
    s: 'Eles tinham estado ali toda a tarde.',
    molde: 'Eles {} ali toda a tarde.',
    instruccion: 'Pasa el pluscuamperfecto compuesto a la forma simple y reescribe la frase entera.',
    hint: 'irregular, tercera del plural' },
  { p: 'b4-mqp-simples', pasada: 1, espejoEs: false, lema: 'partir', t: 'mqpSimples', per: 'tu',
    s: 'Tu tinhas partido antes de a carta chegar.',
    molde: 'Tu {} antes de a carta chegar.',
    instruccion: 'Pasa el pluscuamperfecto compuesto a la forma simple y reescribe la frase entera.',
    hint: 'regular de -ir, segunda persona' },

  // ══ b5-se-futuro-conj (5) — «se» + futuro do conjuntivo, donde el
  // español pone presente de indicativo.
  { p: 'b5-se-futuro-conj', pasada: 1, espejoEs: false, lema: 'poder', t: 'futSubj', per: 'tu',
    s: 'Talvez possas vir amanhã.',
    molde: 'Se {} vir amanhã, avisa-me.',
    instruccion: 'Reescribe la idea como una condición con «se», acabando en «avisa-me», y pon el verbo en el tiempo que esa conjunción exige.',
    hint: 'no es presente: el portugués tiene un tiempo propio para la condición futura' },
  { p: 'b5-se-futuro-conj', pasada: 1, espejoEs: false, lema: 'querer', t: 'futSubj', per: 'eles',
    s: 'Eles talvez queiram ficar mais uns dias.',
    molde: 'Se {} ficar mais uns dias, há lugar.',
    instruccion: 'Reescribe la idea como una condición con «se», acabando en «há lugar», y pon el verbo en el tiempo que esa conjunción exige.',
    hint: 'irregular, tercera del plural' },
  { p: 'b5-se-futuro-conj', pasada: 1, espejoEs: false, lema: 'ver', t: 'futSubj', per: 'tu',
    s: 'Talvez vejas o Miguel na festa.',
    molde: 'Se {} o Miguel na festa, dá-lhe um abraço.',
    instruccion: 'Reescribe la idea como una condición con «se», acabando en «dá-lhe um abraço», y pon el verbo en el tiempo que esa conjunción exige.',
    hint: 'irregular, segunda persona' },
  { p: 'b5-se-futuro-conj', pasada: 1, espejoEs: false, lema: 'ter', t: 'futSubj', per: 'nós',
    s: 'Talvez tenhamos tempo depois do almoço.',
    molde: 'Se {} tempo depois do almoço, passamos por lá.',
    instruccion: 'Reescribe la idea como una condición con «se», acabando en «passamos por lá», y pon el verbo en el tiempo que esa conjunción exige.',
    hint: 'irregular, primera del plural' },
  { p: 'b5-se-futuro-conj', pasada: 1, espejoEs: false, lema: 'ser', t: 'futSubj', per: 'ele',
    s: 'Talvez seja preciso mudar a data.',
    molde: 'Se {} preciso mudar a data, digam-me a tempo.',
    instruccion: 'Reescribe la idea como una condición con «se», acabando en «digam-me a tempo», y pon el verbo en el tiempo que esa conjunción exige.',
    hint: 'irregular, tercera persona' },

  // ══ b6-fut-subj-se (5) — el mismo tiempo con «se», visto desde el
  // bloque del conjuntivo: aquí la transformación es de tiempo, no de
  // conjunción.
  { p: 'b6-fut-subj-se', pasada: 1, espejoEs: false, lema: 'fazer', t: 'futSubj', per: 'tu',
    s: 'Se fazes isso, avisa-me.',
    molde: 'Se {} isso, avisa-me.',
    instruccion: 'Corrige el tiempo del verbo de la condición: en portugués, una condición sobre el futuro no va en presente.',
    hint: 'irregular, segunda persona' },
  { p: 'b6-fut-subj-se', pasada: 1, espejoEs: false, lema: 'dizer', t: 'futSubj', per: 'eles',
    s: 'Se dizem alguma coisa, não respondas.',
    molde: 'Se {} alguma coisa, não respondas.',
    instruccion: 'Corrige el tiempo del verbo de la condición: en portugués, una condición sobre el futuro no va en presente.',
    hint: 'irregular, tercera del plural' },
  { p: 'b6-fut-subj-se', pasada: 1, espejoEs: false, lema: 'trazer', t: 'futSubj', per: 'ele',
    s: 'Se traz o carro, cabemos todos.',
    molde: 'Se {} o carro, cabemos todos.',
    instruccion: 'Corrige el tiempo del verbo de la condición: en portugués, una condición sobre el futuro no va en presente.',
    hint: 'irregular, tercera persona' },
  { p: 'b6-fut-subj-se', pasada: 1, espejoEs: false, lema: 'pôr', t: 'futSubj', per: 'nós',
    s: 'Se pomos tudo no carro, não sobra espaço.',
    molde: 'Se {} tudo no carro, não sobra espaço.',
    instruccion: 'Corrige el tiempo del verbo de la condición: en portugués, una condición sobre el futuro no va en presente.',
    hint: 'irregular, primera del plural' },
  { p: 'b6-fut-subj-se', pasada: 1, espejoEs: false, lema: 'estar', t: 'futSubj', per: 'eles',
    s: 'Se estão prontos às seis, saímos juntos.',
    molde: 'Se {} prontos às seis, saímos juntos.',
    instruccion: 'Corrige el tiempo del verbo de la condición: en portugués, una condición sobre el futuro no va en presente.',
    hint: 'irregular, tercera del plural' },

  // ══ b7-gerundio-adverbial (5) — el gerundio de valor adverbial, que en
  // portugués europeo convive con «a + infinitivo». Aquí SÍ hay espejo: el
  // español hace la misma construcción, y se declara.
  { p: 'b7-gerundio-adverbial', pasada: 1, espejoEs: false, r: 'Saiu de casa a correr.',
    s: 'Saiu de casa correndo.',
    instruccion: 'Pasa el gerundio adverbial a la construcción con preposición que el portugués europeo prefiere, y reescribe la frase entera.',
    hint: '«a» + infinitivo' },
  { p: 'b7-gerundio-adverbial', pasada: 1, espejoEs: false, r: 'Respondeu-me a sorrir.',
    s: 'Respondeu-me sorrindo.',
    instruccion: 'Pasa el gerundio adverbial a la construcción con preposición que el portugués europeo prefiere, y reescribe la frase entera.',
    hint: '«a» + infinitivo, y el pronombre no se mueve' },
  { p: 'b7-gerundio-adverbial', pasada: 1, espejoEs: false, r: 'Entrou na sala a tremer.',
    s: 'Entrou na sala tremendo.',
    instruccion: 'Pasa el gerundio adverbial a la construcción con preposición que el portugués europeo prefiere, y reescribe la frase entera.',
    hint: '«a» + infinitivo' },
  { p: 'b7-gerundio-adverbial', pasada: 1, espejoEs: false, r: 'Passou a tarde toda a chorar.',
    s: 'Passou a tarde toda chorando.',
    instruccion: 'Pasa el gerundio adverbial a la construcción con preposición que el portugués europeo prefiere, y reescribe la frase entera.',
    hint: '«a» + infinitivo' },
  { p: 'b7-gerundio-adverbial', pasada: 1, espejoEs: false, r: 'Ficou à porta a ver o carro afastar-se.',
    s: 'Ficou à porta vendo o carro afastar-se.',
    instruccion: 'Pasa el gerundio adverbial a la construcción con preposición que el portugués europeo prefiere, y reescribe la frase entera.',
    hint: '«a» + infinitivo, y el resto de la frase no cambia' },
];

if (process.argv[1]?.includes('trans-e2-29')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Transformación E2#29 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Atajo de traducción\n`);
  for (const l of informeEspejo(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

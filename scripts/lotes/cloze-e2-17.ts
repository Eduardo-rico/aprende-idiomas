// scripts/lotes/cloze-e2-17.ts
//
//   npx tsx scripts/lotes/cloze-e2-17.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-17.ts --json     # ítems para publicar
//
// E2#17 · el lote más pequeño del plan, y a propósito: **el hueco de
// cloze son 16 unidades**. Medido, no elegido — `formato-punto.ts` deja
// hoy sólo tres puntos de cloze bajo el piso, y uno (`b3-pron-directo`)
// está aparcado porque el formato no le sirve. Escribir 24 «porque el
// lote es de 24» pondría ocho ítems por encima del piso, que descuentan
// cero.
//
// Los dos puntos son de C1 y son de ELECCIÓN, no de morfología: la forma
// no se discute, se discute cuál de las tres o cuál valor toca. Por eso
// la pista nombra el VALOR o el REGISTRO, no la persona.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b11-imperfeito-valores · el imperfeito más allá del hábito. Es un
  // punto de C1 porque la forma ya se sabe desde b4: lo que se aprende
  // aquí es CUÁNDO un portugués lo usa donde el español pondría otra cosa.
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'querer', t: 'imperfeito', per: 'eu',
    s: 'Boa tarde, ___ (querer) falar com o gerente, se faz favor.', pista: 'imperfeito de CORTESÍA: suaviza la petición, no habla del pasado', ancla: 'se faz favor' },
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'poder', t: 'imperfeito', per: 'ele',
    s: 'Desculpe, ___ (poder) o senhor dizer-me onde fica a estação?', pista: 'imperfeito de CORTESÍA, 3.ª persona: más suave que el presente', ancla: 'Desculpe' },
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'ser', t: 'imperfeito', per: 'eu',
    s: 'Na brincadeira, eu ___ (ser) o médico e tu eras o doente.', pista: 'imperfeito LÚDICO: el de los niños repartiendo papeles', ancla: 'Na brincadeira' },
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'vir', t: 'imperfeito', per: 'eu',
    s: 'Se soubesse que estavas doente, não ___ (vir) hoje.', pista: 'imperfeito por CONDICIONAL, que es lo corriente al hablar', ancla: 'Se soubesse' },
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'partir', t: 'imperfeito', per: 'ele',
    s: 'No dia seguinte, o primeiro-ministro ___ (partir) para Bruxelas.', pista: 'imperfeito NARRATIVO, el de la crónica: un hecho puntual contado así', ancla: 'No dia seguinte' },
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'chegar', t: 'imperfeito', per: 'ele',
    s: 'Ele avisou que ___ (chegar) mais tarde por causa do trânsito.', pista: 'imperfeito por FUTURO DEL PASADO: lo que iba a pasar después', ancla: 'Ele avisou que' },
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'fazer', t: 'imperfeito', per: 'eu',
    s: 'Se tivesse tempo, eu ___ (fazer) o bolo em casa.', pista: 'imperfeito en la apódosis, donde el español pone condicional', ancla: 'Se tivesse tempo' },
  { p: 'b11-imperfeito-valores', pasada: 1, lema: 'dar', t: 'imperfeito', per: 'eles',
    s: 'Naquele café ___ (dar) o pequeno-almoço até ao meio-dia.', pista: 'imperfeito HABITUAL, 3.ª del plural impersonal: lo que se hacía siempre', ancla: 'até ao meio-dia' },

  // ══ b11-haver-ter-existir · los tres existenciales. No es gramática,
  // es REGISTRO y variedad: «há» neutro, «existe» escrito y con
  // concordancia, «tem» brasileño.
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'haver', t: 'presente', per: 'ele',
    s: '___ (haver) muita gente à porta do teatro.', pista: 'el existencial NEUTRO y corriente del portugués europeo, presente', ancla: 'à porta do teatro' },
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'existir', t: 'presente', per: 'eles',
    s: 'Segundo o relatório, ___ (existir) três hipóteses por avaliar.', pista: 'el existencial de registro ESCRITO, que CONCUERDA con su sujeto', ancla: 'Segundo o relatório' },
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'ter', t: 'presente', per: 'ele',
    s: 'Em São Paulo diz-se «___ (ter) muita gente na rua»; em Lisboa, não.', pista: 'el existencial BRASILEÑO, presente — el que en Portugal no se usa', ancla: 'em Lisboa, não' },
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'haver', t: 'imperfeito', per: 'ele',
    s: 'Nos anos oitenta ___ (haver) aqui uma fábrica de conservas.', pista: 'el existencial neutro en imperfeito', ancla: 'Nos anos oitenta' },
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'existir', t: 'presente', per: 'ele',
    s: 'O estudo conclui que ___ (existir) uma relação entre os dois fatores.', pista: 'el existencial escrito, concordando con un sujeto SINGULAR', ancla: 'O estudo conclui que' },
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'ter', t: 'imperfeito', per: 'ele',
    s: 'O meu primo do Rio dizia sempre que ___ (ter) fila no banco.', pista: 'el existencial brasileño en imperfeito', ancla: 'O meu primo do Rio' },
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'haver', t: 'presente', per: 'ele',
    s: '___ (haver) alguma coisa que eu possa fazer por si?', pista: 'el existencial neutro, presente, en una pregunta de servicio', ancla: 'que eu possa fazer por si' },
  { p: 'b11-haver-ter-existir', pasada: 1, lema: 'existir', t: 'imperfeito', per: 'ele',
    s: 'Antigamente ___ (existir) neste sítio uma ponte de madeira.', pista: 'el existencial escrito en imperfeito, con sujeto singular', ancla: 'uma ponte de madeira' },
];

if (process.argv[1]?.includes('cloze-e2-17')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x, i) => ({ ...x, id: `cl17-${String(i + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Cloze E2#17 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems | respuestas |');
  console.log('|---|---:|---|');
  for (const [p, n] of porPunto)
    console.log(`| \`${p}\` | ${n} | ${ITEMS.filter((x) => x.p === p).map((x) => respuestaDe(x)).join(' · ')} |`);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

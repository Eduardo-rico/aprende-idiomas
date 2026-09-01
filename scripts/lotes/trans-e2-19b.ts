// scripts/lotes/trans-e2-19b.ts
//
//   npx tsx scripts/lotes/trans-e2-19b.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-e2-19b.ts --json     # ítems para publicar
//
// SEGUNDA PASADA DE TRANSFORMACIÓN. 17 unidades: `b11-topico` (8),
// `b2-plural-l` (5) y `b7-inf-pess-preposicao` (4).
//
// **Por qué 17 y no 24, y por qué estos tres.** De los doce puntos que
// quedan, éstos son los que NO se resuelven traduciendo. Los otros hay
// que mirarlos antes de escribirlos, y uno merece aviso explícito:
//
// `b11-nominalizacao` es casi todo espejo. El español nominaliza con los
// mismos sufijos y la misma sintaxis —«el incumplimiento», «la llegada»,
// «el haber llegado tarde»— así que un lote de ocho ítems ahí mediría
// sobre todo castellano. No es que el punto no exista: es que en este
// formato no discrimina, y escribirlo «porque toca» sería exactamente lo
// que el mapa formato↔punto existe para impedir. Queda para decidir con
// Edu, no para producir a ciegas.
//
// Y una nota sobre `b11-topico`, que parece espejo y no lo es: el español
// también antepone el tema («Ese libro, ya lo leí»), pero **exige el
// clítico**. El portugués europeo admite el OBJETO NULO —«Esse livro, já
// li»— y ésa es la construcción que estos ítems piden. Si se pidiera la
// versión con clítico, los ocho serían espejo.
import { verificar, respuestaDe, informeEspejo, type ItemTrans } from '../lib/transformacion';

export const ITEMS: ItemTrans[] = [
  // ══ b11-topico (8) — anteponer el tema y dejar el objeto NULO.
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'Esse livro já li.',
    s: 'Já li esse livro.',
    instruccion: 'Antepón el tema al principio de la frase y deja el objeto sin repetir, que es lo que el portugués europeo permite.',
    hint: 'no pongas ningún pronombre: el hueco del objeto se queda vacío' },
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'O relatório entreguei ontem.',
    s: 'Entreguei o relatório ontem.',
    instruccion: 'Antepón el tema al principio y deja el objeto sin repetir con pronombre.',
    hint: 'el objeto no se retoma' },
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'Essa camisa nunca uso.',
    s: 'Nunca uso essa camisa.',
    instruccion: 'Antepón el tema al principio y deja el objeto sin repetir con pronombre.',
    hint: 'sin retomar el objeto' },
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'Dessa história já toda a gente sabe.',
    s: 'Toda a gente já sabe dessa história.',
    instruccion: 'Antepón al principio el complemento con su preposición, sin repetirlo después.',
    hint: 'la preposición viaja con el tema' },
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'Ao teu irmão contei tudo.',
    s: 'Contei tudo ao teu irmão.',
    instruccion: 'Antepón al principio el complemento con su preposición, sin retomarlo con pronombre.',
    hint: 'nada de «lhe»' },
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'Com esse dinheiro não conto.',
    s: 'Não conto com esse dinheiro.',
    instruccion: 'Antepón al principio el complemento con su preposición, dejando la negación en su sitio.',
    hint: 'el «não» se queda pegado al verbo' },
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'Desses vizinhos ninguém se queixa.',
    s: 'Ninguém se queixa desses vizinhos.',
    instruccion: 'Antepón al principio el complemento con su preposición, sin repetirlo.',
    hint: 'el reflexivo se queda donde está' },
  { p: 'b11-topico', pasada: 2, espejoEs: false, r: 'Essas fotografias ainda não vi.',
    s: 'Ainda não vi essas fotografias.',
    instruccion: 'Antepón el tema al principio y deja el objeto sin repetir con pronombre.',
    hint: 'sin «as»' },

  // ══ b2-plural-l (5) — el plural de las palabras en -l, que el español
  // no tiene: «papel» → «papeles» allí, «papéis» aquí.
  { p: 'b2-plural-l', pasada: 2, espejoEs: false, r: 'os papéis',
    s: 'o papel',
    instruccion: 'Pon el sintagma en plural, con su artículo.',
    hint: 'la -l cae y aparece un acento' },
  { p: 'b2-plural-l', pasada: 2, espejoEs: false, r: 'os animais',
    s: 'o animal',
    instruccion: 'Pon el sintagma en plural, con su artículo.',
    hint: 'la -l cae; aquí no hace falta acento' },
  { p: 'b2-plural-l', pasada: 2, espejoEs: false, r: 'os azuis',
    s: 'o azul',
    instruccion: 'Pon el sintagma en plural, con su artículo.',
    hint: 'la -l cae tras -u' },
  { p: 'b2-plural-l', pasada: 2, espejoEs: false, r: 'os níveis',
    s: 'o nível',
    instruccion: 'Pon el sintagma en plural, con su artículo.',
    hint: 'la -l cae y el acento se mantiene sobre la misma vocal' },
  { p: 'b2-plural-l', pasada: 2, espejoEs: false, r: 'os difíceis',
    s: 'o difícil',
    instruccion: 'Pon el sintagma en plural, con su artículo.',
    hint: 'esdrújula: la -l cae y el acento se queda donde estaba' },

  // ══ b7-inf-pess-preposicao (4) — infinitivo pessoal tras preposición.
  { p: 'b7-inf-pess-preposicao', pasada: 2, espejoEs: false,
    s: 'Antes que tu saias, fecha as janelas. → Antes de ____, fecha as janelas.',
    instruccion: 'Reescríbelo con infinitivo personal detrás de la preposición. Escribe sólo la forma verbal.',
    lema: 'sair', t: 'infPess', per: 'tu' },
  { p: 'b7-inf-pess-preposicao', pasada: 2, espejoEs: false,
    s: 'Para que nós cheguemos a horas, temos de sair já. → Para ____ a horas, temos de sair já.',
    instruccion: 'Reescríbelo con infinitivo personal detrás de la preposición. Escribe sólo la forma verbal.',
    lema: 'chegar', t: 'infPess', per: 'nós' },
  { p: 'b7-inf-pess-preposicao', pasada: 2, espejoEs: false,
    s: 'Depois que eles fizerem o trabalho, vamos passear. → Depois de ____ o trabalho, vamos passear.',
    instruccion: 'Reescríbelo con infinitivo personal detrás de la preposición. Ojo: no es la forma que la fuente usa.',
    lema: 'fazer', t: 'infPess', per: 'eles' },
  { p: 'b7-inf-pess-preposicao', pasada: 2, espejoEs: false,
    s: 'Sem que eles deem autorização, não avançamos. → Sem ____ autorização, não avançamos.',
    instruccion: 'Reescríbelo con infinitivo personal detrás de la preposición. Escribe sólo la forma verbal.',
    lema: 'dar', t: 'infPess', per: 'eles' },
];

if (process.argv[1]?.includes('trans-e2-19b')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x, i) => ({ ...x, id: `tr19b-${String(i + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, ItemTrans[]>();
  for (const x of ITEMS) { const g = porPunto.get(x.p) ?? []; g.push(x); porPunto.set(x.p, g); }
  console.log(`# Transformación E2#19b — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems | respuestas |');
  console.log('|---|---:|---|');
  for (const [p, xs] of porPunto)
    console.log(`| \`${p}\` | ${xs.length} | ${xs.map((x) => respuestaDe(x)).join(' · ')} |`);
  console.log(`\n## Preflight · el atajo de traducción\n`);
  for (const l of informeEspejo(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

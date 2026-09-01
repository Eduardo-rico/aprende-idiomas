// scripts/lotes/trans-e2-19.ts
//
//   npx tsx scripts/lotes/trans-e2-19.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-e2-19.ts --json     # ítems para publicar
//
// PRIMER LOTE DE TRANSFORMACIÓN. 24 unidades exactas en cuatro puntos:
// `b3-pron-directo` (7), `b12-mqp-simples-literario` (6),
// `b6-fut-subj-formacao` (6) y `b7-inf-pess-impessoais` (5).
//
// Los cuatro comparten una propiedad que decidió el orden: **la respuesta
// se DERIVA**. La colocación sale de `encliseReal`, el mais-que-perfeito
// simples de `mqpSimples`, el futuro do conjuntivo de `futuroConjuntivo`
// y el infinitivo pessoal de `infinitivoPessoal`. Ningún ítem declara su
// respuesta a mano, así que el gate la recalcula contra el paradigma en
// vez de creerme.
//
// Y `b3-pron-directo` estrena el formato por el que se aparcó en E2#16:
// en cloze el clítico quedaba escrito al lado del hueco, porque es
// homógrafo del artículo del antecedente. Aquí es la SALIDA.
import { verificar, respuestaDe, informeEspejo, type ItemTrans } from '../lib/transformacion';

export const ITEMS: ItemTrans[] = [
  // ══ b3-pron-directo (7) — sustituir el OD por su clítico.
  // El español hace la misma operación, así que TODOS serían espejo si no
  // se eligieran los casos en que la forma portuguesa diverge: la
  // ênclise (el español antepone) y los alomorfos -lo/-no, que no existen
  // en español. Cuatro de los siete caen ahí y por eso NO son espejo.
  { p: 'b3-pron-directo', pasada: 1, espejoEs: false,
    s: 'Comprei a revista na estação.',
    instruccion: 'Sustituye el complemento directo por el pronombre que le corresponde, sin cambiar nada más.',
    molde: '{} na estação.', coloc: { verbo: 'Comprei', clitico: 'a' },
    hint: 'el pronombre va DETRÁS del verbo y con guion' },
  { p: 'b3-pron-directo', pasada: 1, espejoEs: false,
    s: 'O advogado entregou os documentos.',
    instruccion: 'Sustituye el complemento directo por el pronombre que le corresponde, sin cambiar nada más.',
    molde: 'O advogado {}.', coloc: { verbo: 'entregou', clitico: 'os' },
    hint: 'plural masculino, enclítico' },
  { p: 'b3-pron-directo', pasada: 1, espejoEs: false,
    s: 'A empresa fez o relatório em dois dias.',
    instruccion: 'Sustituye el complemento directo por su pronombre. Ojo al verbo: termina en una consonante que cae.',
    molde: 'A empresa {} em dois dias.', coloc: { verbo: 'fez', clitico: 'o' },
    hint: 'el verbo acaba en -z: esa letra desaparece y el pronombre cambia de forma' },
  { p: 'b3-pron-directo', pasada: 1, espejoEs: false,
    s: 'A vizinha tem as chaves do portão.',
    instruccion: 'Sustituye el complemento directo por su pronombre. El verbo termina en nasal y eso lo cambia.',
    molde: 'A vizinha {}.', coloc: { verbo: 'tem', clitico: 'as' },
    hint: 'tras nasal, el pronombre de tercera toma otra forma' },
  { p: 'b3-pron-directo', pasada: 1, espejoEs: true,
    s: 'Vi o Pedro na paragem do autocarro.',
    instruccion: 'Sustituye el complemento directo por el pronombre que le corresponde, sin cambiar nada más.',
    molde: '{} na paragem do autocarro.', coloc: { verbo: 'Vi', clitico: 'o' } },
  { p: 'b3-pron-directo', pasada: 1, espejoEs: true,
    s: 'Encontrámos as tuas irmãs no mercado.',
    instruccion: 'Sustituye el complemento directo por el pronombre que le corresponde, sin cambiar nada más.',
    molde: '{} no mercado.', coloc: { verbo: 'Encontrámos', clitico: 'as' } },
  { p: 'b3-pron-directo', pasada: 1, espejoEs: false,
    s: 'Eles não pagaram a conta da luz.',
    instruccion: 'Sustituye el complemento directo por su pronombre. La negación cambia dónde va el pronombre.',
    molde: 'Eles não {}.', coloc: { verbo: 'pagaram', clitico: 'a', proclitico: true },
    hint: 'con «não» delante, el pronombre se adelanta al verbo' },

  // ══ b12-mqp-simples-literario (6) — «tinha falado» → «falara».
  // NINGUNO es espejo: el español perdió esta forma («hablara» ya sólo
  // vive como subjuntivo), así que no hay nada que traducir de vuelta.
  { p: 'b12-mqp-simples-literario', pasada: 1, espejoEs: false,
    s: 'Quando ela chegou, ele já tinha saído.',
    instruccion: 'Pon el pluscuamperfecto en la forma simple, la de la narración literaria. Escribe sólo el verbo.',
    lema: 'sair', t: 'mqpSimples', per: 'ele' },
  { p: 'b12-mqp-simples-literario', pasada: 1, espejoEs: false,
    s: 'O soldado tinha morrido antes do amanhecer.',
    instruccion: 'Pon el pluscuamperfecto en la forma simple, la de la narración literaria. Escribe sólo el verbo.',
    lema: 'morrer', t: 'mqpSimples', per: 'ele' },
  { p: 'b12-mqp-simples-literario', pasada: 1, espejoEs: false,
    s: 'Nós tínhamos falado disso muitas vezes.',
    instruccion: 'Pon el pluscuamperfecto en la forma simple. Escribe sólo el verbo, con su acento.',
    lema: 'falar', t: 'mqpSimples', per: 'nós' },
  { p: 'b12-mqp-simples-literario', pasada: 1, espejoEs: false,
    s: 'Ele tinha feito tudo o que podia.',
    instruccion: 'Pon el pluscuamperfecto en la forma simple. Escribe sólo el verbo, que es irregular.',
    lema: 'fazer', t: 'mqpSimples', per: 'ele' },
  { p: 'b12-mqp-simples-literario', pasada: 1, espejoEs: false,
    s: 'Aquilo tinha sido uma noite longa.',
    instruccion: 'Pon el pluscuamperfecto en la forma simple. Escribe sólo el verbo, que es de los más irregulares.',
    lema: 'ser', t: 'mqpSimples', per: 'ele' },
  { p: 'b12-mqp-simples-literario', pasada: 1, espejoEs: false,
    s: 'Nós tínhamos dito que não voltávamos.',
    instruccion: 'Pon el pluscuamperfecto en la forma simple. Escribe sólo el verbo, con su acento.',
    lema: 'dizer', t: 'mqpSimples', per: 'nós' },

  // ══ b6-fut-subj-formacao (6) — formar el futuro do conjuntivo.
  // Tampoco hay espejo: el español lo perdió del todo.
  { p: 'b6-fut-subj-formacao', pasada: 1, espejoEs: false,
    s: 'Tu chegas a casa. → Quando ____ a casa, telefona-me.',
    instruccion: 'Pon el verbo en futuro do conjuntivo. Escribe sólo la forma verbal.',
    lema: 'chegar', t: 'futSubj', per: 'tu' },
  { p: 'b6-fut-subj-formacao', pasada: 1, espejoEs: false,
    s: 'Eles querem. → Se ____, podem vir connosco.',
    instruccion: 'Pon el verbo en futuro do conjuntivo. Escribe sólo la forma verbal; es irregular.',
    lema: 'querer', t: 'futSubj', per: 'eles' },
  { p: 'b6-fut-subj-formacao', pasada: 1, espejoEs: false,
    s: 'Nós podemos. → Logo que ____, tratamos disso.',
    instruccion: 'Pon el verbo en futuro do conjuntivo. Escribe sólo la forma verbal; es irregular.',
    lema: 'poder', t: 'futSubj', per: 'nós' },
  { p: 'b6-fut-subj-formacao', pasada: 1, espejoEs: false,
    s: 'Ela vê o resultado. → Assim que ____ o resultado, avisa-nos.',
    instruccion: 'Pon el verbo en futuro do conjuntivo. Escribe sólo la forma verbal, que no coincide con el infinitivo.',
    lema: 'ver', t: 'futSubj', per: 'ele' },
  { p: 'b6-fut-subj-formacao', pasada: 1, espejoEs: false,
    s: 'Vocês trazem os papéis. → Quando ____ os papéis, entramos.',
    instruccion: 'Pon el verbo en futuro do conjuntivo. Escribe sólo la forma verbal; el tema es irregular.',
    lema: 'trazer', t: 'futSubj', per: 'eles' },
  { p: 'b6-fut-subj-formacao', pasada: 1, espejoEs: false,
    s: 'Eu estou pronto. → Se ____ pronto, aviso-te.',
    instruccion: 'Pon el verbo en futuro do conjuntivo. Escribe sólo la forma verbal; el tema es irregular.',
    lema: 'estar', t: 'futSubj', per: 'eu' },

  // ══ b7-inf-pess-impessoais (5) — infinitivo pessoal tras impersonal.
  // Es la forma que el español no tiene: cero espejo por definición.
  { p: 'b7-inf-pess-impessoais', pasada: 1, espejoEs: false,
    s: 'É preciso que vocês cheguem cedo. → É preciso ____ cedo.',
    instruccion: 'Reescríbelo con infinitivo personal en vez de la subordinada. Escribe sólo la forma verbal.',
    lema: 'chegar', t: 'infPess', per: 'eles' },
  { p: 'b7-inf-pess-impessoais', pasada: 1, espejoEs: false,
    s: 'É melhor que nós esperemos aqui. → É melhor ____ aqui.',
    instruccion: 'Reescríbelo con infinitivo personal en vez de la subordinada. Escribe sólo la forma verbal.',
    lema: 'esperar', t: 'infPess', per: 'nós' },
  { p: 'b7-inf-pess-impessoais', pasada: 1, espejoEs: false,
    s: 'Convém que tu leias isto antes. → Convém ____ isto antes.',
    instruccion: 'Reescríbelo con infinitivo personal en vez de la subordinada. Escribe sólo la forma verbal.',
    lema: 'ler', t: 'infPess', per: 'tu' },
  { p: 'b7-inf-pess-impessoais', pasada: 1, espejoEs: false,
    s: 'Basta que eles saiam a horas. → Basta ____ a horas.',
    instruccion: 'Reescríbelo con infinitivo personal. Escribe sólo la forma verbal, con su acento.',
    lema: 'sair', t: 'infPess', per: 'eles' },
  { p: 'b7-inf-pess-impessoais', pasada: 1, espejoEs: false,
    s: 'É pena que vocês percam a viagem. → É pena ____ a viagem.',
    instruccion: 'Reescríbelo con infinitivo personal en vez de la subordinada. Escribe sólo la forma verbal.',
    lema: 'perder', t: 'infPess', per: 'eles' },
];

if (process.argv[1]?.includes('trans-e2-19')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x, i) => ({ ...x, id: `tr19-${String(i + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, ItemTrans[]>();
  for (const x of ITEMS) { const g = porPunto.get(x.p) ?? []; g.push(x); porPunto.set(x.p, g); }
  console.log(`# Transformación E2#19 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems | respuestas |');
  console.log('|---|---:|---|');
  for (const [p, xs] of porPunto)
    console.log(`| \`${p}\` | ${xs.length} | ${xs.map((x) => respuestaDe(x)).join(' · ')} |`);

  // EL PREFLIGHT DEL FORMATO, impreso siempre.
  console.log(`\n## Preflight · el atajo de traducción\n`);
  for (const l of informeEspejo(ITEMS)) console.log(l);
  console.log('');
  console.log('Un ítem «espejo» es uno que se resuelve traduciendo al español,');
  console.log('transformando allí y traduciendo de vuelta. No se puede detectar por');
  console.log('regex: cada ítem lo DECLARA y aquí se mide. Tope por punto: 50 %.');

  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

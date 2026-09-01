// scripts/lotes/cloze-e2-27.ts
//
//   npx tsx scripts/lotes/cloze-e2-27.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-27.ts --asigna   # DÓNDE cae cada ítem
//   npx tsx scripts/lotes/cloze-e2-27.ts --json     # ítems para publicar
//
// E2#27 · 30 unidades sobre seis puntos HOJA de b8, los de más déficit de
// la sintaxis. Hoja y no padre a propósito: los siete cloze que E2#22
// escribió para `b6-futuro-subj` cayeron todos en sus sub-puntos y el
// padre siguió pidiendo siete. Producir contra un padre es producir contra
// nada.
//
// Por eso este lote trae `--asigna`: **corre el contador canónico sobre
// los borradores y dice a qué punto van a contar de verdad**, antes de
// publicar. Es el segundo camino independiente aplicado a la producción —
// escribir para un punto y comprobar que el ítem aterriza en él no son la
// misma comprobación.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b8-coloc-proclise-negacao (5) — la negación antepuesta atrae el
  // clítico. El hueco lleva las DOS piezas para que se examine el orden y
  // no sólo el pronombre.
  { p: 'b8-coloc-proclise-negacao', pasada: 1, r: 'me contou',
    s: 'Ele não ___ (contar + me) nada do que se passou ontem.', pista: 'la negación antepuesta atrae el pronombre: va DELANTE, con el verbo en pretérito', ancla: 'do que se passou ontem' },
  { p: 'b8-coloc-proclise-negacao', pasada: 1, r: 'te disse',
    s: 'Ela nunca ___ (dizer + te) a verdade sobre aquele assunto.', pista: '«nunca» es negativo y atrae el pronombre: delante, verbo en pretérito', ancla: 'sobre aquele assunto' },
  { p: 'b8-coloc-proclise-negacao', pasada: 1, r: 'nos avisou',
    s: 'Ninguém ___ (avisar + nos) de que a reunião tinha mudado.', pista: '«ninguém» es negativo y atrae el pronombre: delante, verbo en pretérito', ancla: 'de que a reunião tinha mudado' },
  { p: 'b8-coloc-proclise-negacao', pasada: 1, r: 'me lembro',
    s: 'Não ___ (lembrar-se) do nome dele, por mais que tente.', pista: 'reflexivo con la negación delante: pronombre antepuesto, presente, 1.ª persona', ancla: 'por mais que tente' },
  { p: 'b8-coloc-proclise-negacao', pasada: 1, r: 'lhe deu',
    s: 'Ela não ___ (dar + lhe) a resposta que ele esperava.', pista: 'la negación atrae el pronombre de complemento indirecto: delante, verbo en pretérito', ancla: 'a resposta que ele esperava' },

  // ══ b8-coloc-proclise-adverbio (5) — el adverbio antepuesto hace lo
  // mismo que la negación, sin ser negativo.
  { p: 'b8-coloc-proclise-adverbio', pasada: 1, r: 'te disse',
    s: 'Já ___ (dizer + te) isso na semana passada, e não me ouviste.', pista: '«já» antepuesto atrae el pronombre: delante, verbo en pretérito, 1.ª persona', ancla: 'e não me ouviste' },
  { p: 'b8-coloc-proclise-adverbio', pasada: 1, r: 'me lembro',
    s: 'Ainda ___ (lembrar-se) daquele verão em Sesimbra.', pista: '«ainda» antepuesto atrae el pronombre: delante, presente, 1.ª persona', ancla: 'daquele verão em Sesimbra' },
  { p: 'b8-coloc-proclise-adverbio', pasada: 1, r: 'nos contou',
    s: 'Só ___ (contar + nos) a verdade quando já era tarde.', pista: '«só» antepuesto atrae el pronombre: delante, verbo en pretérito', ancla: 'quando já era tarde' },
  { p: 'b8-coloc-proclise-adverbio', pasada: 1, r: 'me avisaram',
    s: 'Eles também ___ (avisar + me) a mim, não fiques preocupado.', pista: '«também» antepuesto atrae el pronombre: delante, pretérito, 3.ª del plural', ancla: 'não fiques preocupado' },
  { p: 'b8-coloc-proclise-adverbio', pasada: 1, r: 'se sente',
    s: 'Hoje ela ___ (sentir-se) muito melhor do que ontem.', pista: 'con el adverbio de tiempo delante el pronombre se antepone: presente, 3.ª persona', ancla: 'muito melhor do que ontem' },

  // ══ b8-con-contraste (5) — los conectores adversativos, cada uno
  // identificado por su forma para que la pista determine cuál es.
  { p: 'b8-con-contraste', pasada: 1, r: 'contrário',
    s: 'Não é caro; pelo ___, é dos mais baratos da loja.', pista: 'al revés de lo dicho — completa la locución «pelo …»', ancla: 'é dos mais baratos da loja' },
  { p: 'b8-con-contraste', pasada: 1, r: 'porém',
    s: 'A casa é pequena; ___, tem uma vista magnífica.', pista: 'sin embargo — el adversativo culto de dos sílabas', ancla: 'tem uma vista magnífica' },
  { p: 'b8-con-contraste', pasada: 1, r: 'no entanto',
    s: 'Disseram que vinham; ___, ninguém apareceu.', pista: 'sin embargo — el único de los adversativos portugueses que se escribe en DOS palabras', ancla: 'ninguém apareceu' },
  { p: 'b8-con-contraste', pasada: 1, r: 'mas',
    s: 'É um bairro tranquilo, ___ um pouco longe do centro.', pista: 'pero — el adversativo corriente, de tres letras', ancla: 'um pouco longe do centro' },
  { p: 'b8-con-contraste', pasada: 1, r: 'em vez disso',
    s: 'Ele não telefonou; ___, mandou uma mensagem a avisar.', pista: 'en vez de eso — la locución portuguesa equivalente, de tres palabras', ancla: 'mandou uma mensagem a avisar' },

  // ══ b8-sub-substantivas (5) — la completiva, con el modo repartido por
  // el verbo de la principal. La cuarta lo contrasta: «parece que» va con
  // indicativo.
  { p: 'b8-sub-substantivas', pasada: 1, lema: 'chegar', t: 'presSubj', per: 'tu',
    s: 'É importante que tu ___ (chegar) a horas à entrevista.', pista: 'presente do conjuntivo, 2.ª persona — lo pide «é importante que»', ancla: 'à entrevista' },
  { p: 'b8-sub-substantivas', pasada: 1, lema: 'saber', t: 'presSubj', per: 'eles',
    s: 'Duvido que eles ___ (saber) o que se passou naquela noite.', pista: 'presente do conjuntivo, 3.ª del plural — lo pide «duvido que»', ancla: 'naquela noite' },
  { p: 'b8-sub-substantivas', pasada: 1, lema: 'estar', t: 'presente', per: 'ele',
    s: 'Parece que ela ___ (estar) muito melhor esta semana.', pista: 'INDICATIVO, presente, 3.ª persona: «parece que» no pide conjuntivo', ancla: 'muito melhor esta semana' },
  { p: 'b8-sub-substantivas', pasada: 1, lema: 'poder', t: 'presSubj', per: 'eles',
    s: 'Lamento que vocês não ___ (poder) vir ao jantar de sábado.', pista: 'presente do conjuntivo, 3.ª del plural — lo pide «lamento que»', ancla: 'ao jantar de sábado' },
  { p: 'b8-sub-substantivas', pasada: 1, lema: 'conseguir', t: 'presSubj', per: 'nós',
    s: 'Espero que nós ___ (conseguir) acabar isto antes das seis.', pista: 'presente do conjuntivo, 1.ª del plural — lo pide «espero que»', ancla: 'antes das seis' },

  // ══ b8-sub-concessivas (5) — «embora», «ainda que», «por muito que»,
  // «mesmo que» piden conjuntivo; «apesar de» pide infinitivo, y con
  // sujeto propio va flexionado.
  { p: 'b8-sub-concessivas', pasada: 1, lema: 'fazer', t: 'imperfSubj', per: 'ele',
    s: 'Embora ___ (fazer) muito frio, saímos à mesma.', pista: 'imperfeito do conjuntivo, 3.ª persona — lo pide «embora»', ancla: 'saímos à mesma' },
  { p: 'b8-sub-concessivas', pasada: 1, lema: 'querer', t: 'imperfSubj', per: 'eles',
    s: 'Ainda que eles ___ (querer), não chegavam a tempo.', pista: 'imperfeito do conjuntivo, 3.ª del plural — lo pide «ainda que»', ancla: 'não chegavam a tempo' },
  { p: 'b8-sub-concessivas', pasada: 1, lema: 'estar', t: 'infPess', per: 'nós',
    s: 'Apesar de nós ___ (estar) cansados, ficámos até ao fim.', pista: 'infinitivo pessoal, 1.ª del plural — «apesar de» pide infinitivo, y con sujeto propio va flexionado', ancla: 'ficámos até ao fim' },
  { p: 'b8-sub-concessivas', pasada: 1, lema: 'insistir', t: 'presSubj', per: 'tu',
    s: 'Por muito que tu ___ (insistir), ela não muda de ideias.', pista: 'presente do conjuntivo, 2.ª persona — lo pide «por muito que»', ancla: 'ela não muda de ideias' },
  { p: 'b8-sub-concessivas', pasada: 1, r: 'chova',
    s: 'Mesmo que ___ (chover), a festa não se cancela.', pista: 'presente do conjuntivo, 3.ª persona — lo pide «mesmo que»', ancla: 'a festa não se cancela' },

  // ══ b8-sub-adjetivas-que (5) — la relativa con «que». El hueco es el
  // VERBO de la relativa, no el relativo: un cloze cuya respuesta fuera
  // siempre «que» no enseñaría nada.
  //
  // Tres van DECLARADOS porque el conjugador no tiene pretérito simple —
  // sólo presente, imperfeito, presSubj, imperativoTu y los compuestos—,
  // y `tsc` lo cazó antes de publicar, que es exactamente lo que no pasó
  // con las seis respuestas «…undefined» de E2#22.
  { p: 'b8-sub-adjetivas-que', pasada: 1, r: 'chegaram',
    s: 'Os miúdos que ___ (chegar) atrasados ficaram sem lugar.', pista: 'pretérito, 3.ª del plural: concuerda con «os miúdos», el antecedente', ancla: 'ficaram sem lugar' },
  { p: 'b8-sub-adjetivas-que', pasada: 1, lema: 'estar', t: 'presente', per: 'ele',
    s: 'A rapariga que ___ (estar) à porta é a minha prima.', pista: 'presente, 3.ª persona: concuerda con «a rapariga», el antecedente', ancla: 'é a minha prima' },
  { p: 'b8-sub-adjetivas-que', pasada: 1, r: 'trouxeste',
    s: 'O livro que tu ___ (trazer) da biblioteca está na mesa.', pista: 'pretérito, 2.ª persona — irregular; el sujeto de la relativa es «tu»', ancla: 'está na mesa' },
  { p: 'b8-sub-adjetivas-que', pasada: 1, lema: 'viver', t: 'presente', per: 'eles',
    s: 'As pessoas que ___ (viver) naquele prédio queixam-se do barulho.', pista: 'presente, 3.ª del plural: concuerda con «as pessoas»', ancla: 'queixam-se do barulho' },
  { p: 'b8-sub-adjetivas-que', pasada: 1, r: 'fizemos',
    s: 'O trabalho que nós ___ (fazer) no ano passado ainda serve.', pista: 'pretérito, 1.ª del plural — irregular; el sujeto de la relativa es «nós»', ancla: 'ainda serve' },
];

if (process.argv[1]?.includes('cloze-e2-27')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, r: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  if (process.argv.includes('--asigna')) {
    // El contador CANÓNICO sobre los borradores: dice a qué punto va a
    // contar cada ítem de verdad, que no tiene por qué ser el declarado.
    void (async () => {
      const { contarPuntos } = await import('../lib/conceptos-finos');
      const falsos = ITEMS.map((x, i) => ({
        id: `draft-${i}`, type: 'fill_blank', concepts: [x.p],
        data: { sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, blanks: [{ position: 0, answer: respuestaDe(x) ?? '' }] },
      }));
      const { cuenta } = contarPuntos(falsos, { incluirCuarentena: true });
      console.log('# A qué punto va a contar cada ítem\n');
      const decl = new Map<string, number>();
      for (const x of ITEMS) decl.set(x.p, (decl.get(x.p) ?? 0) + 1);
      console.log('| punto declarado | escritos | cuentan ahí | se van a otro |');
      console.log('|---|---:|---:|---|');
      for (const [p, n] of decl) {
        const real = cuenta.get(p) ?? 0;
        const fuera = [...cuenta].filter(([k]) => !decl.has(k)).map(([k, m]) => `${k} ${m}`);
        console.log(`| \`${p}\` | ${n} | ${real} | ${real < n ? fuera.join(', ') || '(sub-puntos)' : '—'} |`);
      }
    })();
  } else {
    const porPunto = new Map<string, number>();
    for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
    console.log(`# Cloze E2#27 — ${ITEMS.length} ítems · ${porPunto.size} puntos HOJA\n`);
    console.log('| punto | ítems | derivados |'); console.log('|---|---:|---:|');
    for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} | ${ITEMS.filter((x) => x.p === p && x.lema).length} |`);
    console.log(`\n**${ITEMS.filter((x) => x.lema).length}/${ITEMS.length} derivados del paradigma.**\n`);
    console.log('## Gates\n');
    if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
    console.log('Limpio.');
  }
}

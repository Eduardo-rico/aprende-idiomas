// scripts/lotes/cloze-e2-28.ts
//
//   npx tsx scripts/lotes/cloze-e2-28.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-28.ts --asigna   # dónde cae cada uno
//   npx tsx scripts/lotes/cloze-e2-28.ts --json     # ítems para publicar
//
// E2#28 · 30 unidades sobre seis puntos HOJA de b1: acentuación y
// correspondencias gráficas con el español. Dimensionado contra el hueco
// recalculado justo antes de escribir —132 unidades de cloze en hojas— y
// no contra el de la pasada anterior, que es de donde salió el falso
// «hueco 92→62» del informe de E2#27.
//
// Las pistas que nombran una clase de acentuación las comprueba
// `check-acentuacion.ts` contra la palabra, así que aquí el gate corre
// sobre mi propio trabajo: si escribo «llana» de una aguda, salta.
//
// Y cuando el español y el portugués COINCIDEN («hotel», «papel»), la
// glosa española es la respuesta y deja de ser pista: ahí se describe la
// cosa en vez de traducirla. Es el mismo hallazgo que «de ti» y
// «contigo» en la pasada anterior — la tercera vez que aparece.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b1-tonica-paroxitona (7) — las llanas que SÍ llevan tilde, que son
  // las que no acaban en -a/-e/-o. Es el reparto contrario al español.
  { p: 'b1-tonica-paroxitona', pasada: 1, r: 'fácil',
    s: 'Este exercício é ___ de fazer, não te preocupes.', pista: 'lo contrario de difícil — llana terminada en -l, y por eso lleva tilde', ancla: 'não te preocupes' },
  { p: 'b1-tonica-paroxitona', pasada: 1, r: 'útil',
    s: 'Este dicionário é muito ___ para quem traduz.', pista: 'lo que sirve para algo — llana terminada en -l, lleva tilde', ancla: 'para quem traduz' },
  { p: 'b1-tonica-paroxitona', pasada: 1, r: 'álbum',
    s: 'Trouxe o ___ de fotografias da viagem.', pista: 'el libro donde se pegan las fotografías — llana terminada en -m, lleva tilde', ancla: 'de fotografias da viagem' },
  { p: 'b1-tonica-paroxitona', pasada: 1, r: 'táxi',
    s: 'Chamámos um ___ para ir ao aeroporto.', pista: 'el coche que se paga por carrera — llana terminada en -i, lleva tilde', ancla: 'para ir ao aeroporto' },
  { p: 'b1-tonica-paroxitona', pasada: 1, r: 'lápis',
    s: 'Empresta-me um ___, que o meu não escreve.', pista: 'lápiz — llana terminada en -s, lleva tilde', ancla: 'que o meu não escreve' },
  { p: 'b1-tonica-paroxitona', pasada: 1, r: 'ténis',
    s: 'Comprei uns ___ novos para correr de manhã.', pista: 'zapatillas — llana terminada en -s, lleva tilde; y en Portugal el acento es agudo', ancla: 'para correr de manhã' },
  { p: 'b1-tonica-paroxitona', pasada: 1, r: 'amável',
    s: 'Foi muito ___ da tua parte teres vindo.', pista: 'amable — llana terminada en -l, lleva tilde', ancla: 'teres vindo' },

  // ══ b1-acento-agudo (6) — el agudo marca la vocal ABIERTA, que es lo
  // que lo opone al circunflejo. La primera y la primera del bloque
  // siguiente son el par mínimo del sistema entero.
  { p: 'b1-acento-agudo', pasada: 1, r: 'avó',
    s: 'A minha ___ faz o melhor bolo de laranja do mundo.', pista: 'abuela — el agudo abre la «o»; con circunflejo sería el abuelo', ancla: 'bolo de laranja' },
  { p: 'b1-acento-agudo', pasada: 1, r: 'pé',
    s: 'Torci o ___ a descer as escadas do metro.', pista: 'pie — el agudo abre la «e»', ancla: 'as escadas do metro' },
  { p: 'b1-acento-agudo', pasada: 1, r: 'país',
    s: 'Portugal é um ___ pequeno mas com muita costa.', pista: 'el territorio con su gobierno y sus fronteras — el acento agudo rompe el diptongo', ancla: 'mas com muita costa' },
  { p: 'b1-acento-agudo', pasada: 1, r: 'só',
    s: 'Ela mora ___ desde que os filhos saíram de casa.', pista: 'sola — con acento agudo', ancla: 'desde que os filhos saíram de casa' },
  { p: 'b1-acento-agudo', pasada: 1, r: 'até',
    s: 'Ficámos ___ ao fim do concerto, já de madrugada.', pista: 'hasta — con acento agudo en la última', ancla: 'já de madrugada' },
  { p: 'b1-acento-agudo', pasada: 1, r: 'água',
    s: 'Traz uma garrafa de ___ da cozinha, se faz favor.', pista: 'lo que se bebe cuando se tiene sed — el agudo marca la tónica sobre la primera vocal', ancla: 'da cozinha' },

  // ══ b1-acento-circunflexo (5) — el circunflejo marca la vocal CERRADA.
  { p: 'b1-acento-circunflexo', pasada: 1, r: 'avô',
    s: 'O meu ___ tem noventa anos e ainda anda de bicicleta.', pista: 'abuelo — el circunflejo cierra la «o»; con agudo sería la abuela', ancla: 'ainda anda de bicicleta' },
  { p: 'b1-acento-circunflexo', pasada: 1, r: 'mês',
    s: 'O ___ de agosto foi o mais quente de sempre.', pista: 'cada una de las doce partes del año — el circunflejo cierra la «e»', ancla: 'o mais quente de sempre' },
  { p: 'b1-acento-circunflexo', pasada: 1, r: 'três',
    s: 'Tenho ___ irmãos mais novos do que eu.', pista: 'el número que sigue al dos — el circunflejo cierra la «e»', ancla: 'mais novos do que eu' },
  { p: 'b1-acento-circunflexo', pasada: 1, r: 'português',
    s: 'Estou a aprender ___ há quase dois anos.', pista: 'la lengua que se estudia aquí — circunflejo en la última sílaba', ancla: 'há quase dois anos' },
  { p: 'b1-acento-circunflexo', pasada: 1, r: 'pêssegos',
    s: 'Comprei ___ maduros no mercado da praça.', pista: 'melocotones — con circunflejo', ancla: 'no mercado da praça' },

  // ══ b1-corresp-ll-lh (4) — la «ll» española es «lh».
  { p: 'b1-corresp-ll-lh', pasada: 1, r: 'toalha',
    s: 'Passa-me uma ___ para as mãos, que estão molhadas.', pista: 'toalla — la «ll» española da «lh»', ancla: 'que estão molhadas' },
  { p: 'b1-corresp-ll-lh', pasada: 1, r: 'medalha',
    s: 'Ganhou a ___ de ouro na natação.', pista: 'medalla — ll → lh', ancla: 'de ouro na natação' },
  { p: 'b1-corresp-ll-lh', pasada: 1, r: 'batalha',
    s: 'Estudámos a ___ de Aljubarrota na escola primária.', pista: 'batalla — ll → lh', ancla: 'de Aljubarrota na escola primária' },
  { p: 'b1-corresp-ll-lh', pasada: 1, r: 'maravilha',
    s: 'A vista daqui de cima é uma ___.', pista: 'maravilla — ll → lh', ancla: 'daqui de cima' },

  // ══ b1-tonica-oxitona (4) — las agudas que NO llevan tilde, que en
  // español sí la llevarían.
  { p: 'b1-tonica-oxitona', pasada: 1, r: 'hotel',
    s: 'Ficámos num ___ pequeno perto da praia.', pista: 'el sitio donde se duerme cuando se viaja — aguda terminada en -l, y por eso NO lleva tilde en portugués', ancla: 'pequeno perto da praia' },
  { p: 'b1-tonica-oxitona', pasada: 1, r: 'papel',
    s: 'Preciso de uma folha de ___ para apontar isto.', pista: 'la hoja sobre la que se escribe — aguda en -l, sin tilde', ancla: 'para apontar isto' },
  { p: 'b1-tonica-oxitona', pasada: 1, r: 'rapaz',
    s: 'Aquele ___ é o filho da vizinha do terceiro.', pista: 'chico — aguda terminada en -z, sin tilde', ancla: 'da vizinha do terceiro' },
  { p: 'b1-tonica-oxitona', pasada: 1, r: 'jardim',
    s: 'Temos um ___ pequeno nas traseiras da casa.', pista: 'jardín — aguda terminada en -m, y en portugués no lleva tilde', ancla: 'nas traseiras da casa' },

  // ══ b1-corresp-h-f (4) — la «h» muda del español viene de una «f»
  // latina que el portugués conservó.
  { p: 'b1-corresp-h-f', pasada: 1, r: 'filho',
    s: 'O meu ___ mais velho está a estudar medicina.', pista: 'hijo — la «h» muda española corresponde a «f» en portugués', ancla: 'está a estudar medicina' },
  { p: 'b1-corresp-h-f', pasada: 1, r: 'falar',
    s: 'Vamos ___ com o professor amanhã de manhã.', pista: 'hablar — h muda → f', ancla: 'amanhã de manhã' },
  { p: 'b1-corresp-h-f', pasada: 1, r: 'fazer',
    s: 'Preciso de ___ o jantar antes das oito.', pista: 'hacer — h muda → f', ancla: 'antes das oito' },
  { p: 'b1-corresp-h-f', pasada: 1, r: 'farinha',
    s: 'Comprei ___ e fermento para o pão de domingo.', pista: 'harina — h muda → f', ancla: 'para o pão de domingo' },
];

if (process.argv[1]?.includes('cloze-e2-28')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, r: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  if (process.argv.includes('--asigna')) {
    void (async () => {
      const { contarPuntos } = await import('../lib/conceptos-finos');
      const falsos = ITEMS.map((x, i) => ({
        id: `draft-${i}`, type: 'fill_blank', concepts: [x.p],
        data: { sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, blanks: [{ position: 0, answer: respuestaDe(x) ?? '' }] },
      }));
      const { cuenta } = contarPuntos(falsos, { incluirCuarentena: true });
      const decl = new Map<string, number>();
      for (const x of ITEMS) decl.set(x.p, (decl.get(x.p) ?? 0) + 1);
      console.log('| punto declarado | escritos | cuentan ahí |');
      console.log('|---|---:|---:|');
      for (const [p, n] of decl) console.log(`| \`${p}\` | ${n} | ${cuenta.get(p) ?? 0} |`);
      const fuera = [...cuenta].filter(([k]) => !decl.has(k));
      if (fuera.length) console.log(`\n**Se van a otro punto:** ${fuera.map(([k, m]) => `${k} ${m}`).join(', ')}`);
      else console.log('\nNinguno se desvía.');
    })();
  } else {
    const porPunto = new Map<string, number>();
    for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
    console.log(`# Cloze E2#28 — ${ITEMS.length} ítems · ${porPunto.size} puntos HOJA\n`);
    console.log('| punto | ítems |'); console.log('|---|---:|');
    for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
    console.log('\n## Gates\n');
    if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
    console.log('Limpio.');
  }
}

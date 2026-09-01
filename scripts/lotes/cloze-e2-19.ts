// scripts/lotes/cloze-e2-19.ts
//
//   npx tsx scripts/lotes/cloze-e2-19.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-19.ts --json     # ítems para publicar
//
// E2#19 · **16 ítems, y con éstos la línea de cloze queda vacía.**
//
// El hueco de cloze son 23 unidades, pero 7 de ellas son
// `b3-pron-directo` y ése no se puede examinar así: el clítico de OD es
// homógrafo del artículo que lo precede, y el ítem necesita el
// antecedente en la frase, así que la respuesta queda siempre escrita al
// lado. Va a transformación, donde el clítico es la SALIDA.
//
// Los nueve puntos de aquí ya tienen ítems de pasadas anteriores; éstos
// son el resto exacto, entre 1 y 3 por punto.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b3-imperativo (3) — imperativo de tu, con verbos que no salieron
  // en las pasadas anteriores.
  { p: 'b3-imperativo', pasada: 1, lema: 'abrir', t: 'imperativoTu', per: 'tu',
    s: '___ (abrir) a janela, que está muito calor aqui dentro.', pista: 'imperativo de tú', ancla: 'muito calor aqui dentro' },
  { p: 'b3-imperativo', pasada: 1, lema: 'trazer', t: 'imperativoTu', per: 'tu',
    s: '___ (trazer) o guarda-chuva, que a previsão não é boa.', pista: 'imperativo de tú, irregular', ancla: 'a previsão não é boa' },
  { p: 'b3-imperativo', pasada: 1, lema: 'pôr', t: 'imperativoTu', per: 'tu',
    s: '___ (pôr) a chave no sítio do costume quando saíres.', pista: 'imperativo de tú, irregular', ancla: 'no sítio do costume' },

  // ══ b4-mais-que-perfeito (3) — el compuesto, en contextos nuevos.
  { p: 'b4-mais-que-perfeito', pasada: 1, lema: 'sair', t: 'mqp', per: 'eles',
    s: 'Quando a chuva começou, eles já ___ (sair) da praia.', pista: 'ya habían salido — mais-que-perfeito composto', ancla: 'Quando a chuva começou' },
  { p: 'b4-mais-que-perfeito', pasada: 1, lema: 'fechar', t: 'mqp', per: 'eu',
    s: 'Eu já ___ (fechar) a conta quando ela chegou ao restaurante.', pista: 'ya había cerrado — mais-que-perfeito composto', ancla: 'quando ela chegou' },
  { p: 'b4-mais-que-perfeito', pasada: 1, lema: 'escrever', t: 'mqp', per: 'nós',
    s: 'Nós já ___ (escrever) a carta antes de sabermos a notícia.', pista: 'ya habíamos escrito — mais-que-perfeito composto', ancla: 'antes de sabermos a notícia' },

  // ══ b3-presente-irregular (2)
  { p: 'b3-presente-irregular', pasada: 1, lema: 'saber', t: 'presente', per: 'eu',
    s: 'Eu não ___ (saber) o caminho; vamos perguntar a alguém.', pista: 'presente, 1.ª persona — irregular', ancla: 'vamos perguntar a alguém' },
  { p: 'b3-presente-irregular', pasada: 1, lema: 'trazer', t: 'presente', per: 'eles',
    s: 'Eles ___ (trazer) sempre qualquer coisa quando vêm cá jantar.', pista: 'presente, 3.ª del plural — irregular', ancla: 'quando vêm cá jantar' },

  // ══ b4-perfeito-regular (2)
  { p: 'b4-perfeito-regular', pasada: 1, r: 'abrimos',
    s: 'Nós ___ (abrir) a loja às nove em ponto.', pista: 'pretérito perfeito regular de -ir, 1.ª del plural', ancla: 'às nove em ponto' },
  { p: 'b4-perfeito-regular', pasada: 1, r: 'trabalhaste',
    s: 'Tu ___ (trabalhar) muito bem no projeto da semana passada.', pista: 'pretérito perfeito regular de -ar, 2.ª persona', ancla: 'da semana passada' },

  // ══ b6-presente-subj (2)
  { p: 'b6-presente-subj', pasada: 1, lema: 'partir', t: 'presSubj', per: 'eles',
    s: 'É melhor que eles ___ (partir) antes que anoiteça.', pista: 'presente do conjuntivo, 3.ª del plural', ancla: 'antes que anoiteça' },
  { p: 'b6-presente-subj', pasada: 1, lema: 'ficar', t: 'presSubj', per: 'tu',
    s: 'Quero que tu ___ (ficar) com a chave, para o caso de eu me atrasar.', pista: 'presente do conjuntivo, 2.ª persona — ojo al cambio ortográfico', ancla: 'para o caso de eu me atrasar' },

  // ══ Los puntos que sólo necesitan uno ═══════════════════════════
  { p: 'b1-acentos', pasada: 1, r: 'até',
    s: 'Ficámos à conversa ___ às tantas da noite.', pista: 'hasta — lleva acento agudo en la última sílaba', ancla: 'às tantas da noite' },
  { p: 'b3-pronomes', pasada: 1, r: 'nos',
    s: 'Eles convidaram-___ para o casamento da filha.', pista: 'a nosotros — complemento directo enclítico', ancla: 'para o casamento da filha' },
  { p: 'b5-futuro-composto', pasada: 1, r: 'terá acabado',
    s: 'Até domingo o pintor já ___ (acabar) o quarto todo.', pista: 'futuro composto, 3.ª persona: «ter» en futuro + particípio', ancla: 'Até domingo' },
  { p: 'b6-imperfeito-subj', pasada: 1, lema: 'trazer', t: 'imperfSubj', per: 'eles',
    s: 'Pedi-lhes que ___ (trazer) o contrato assinado.', pista: 'imperfeito do conjuntivo, 3.ª del plural — irregular', ancla: 'o contrato assinado' },
];

if (process.argv[1]?.includes('cloze-e2-19')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x, i) => ({ ...x, id: `cl19-${String(i + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Cloze E2#19 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems | respuestas |');
  console.log('|---|---:|---|');
  for (const [p] of porPunto)
    console.log(`| \`${p}\` | ${ITEMS.filter((x) => x.p === p).length} | ${ITEMS.filter((x) => x.p === p).map((x) => respuestaDe(x)).join(' · ')} |`);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

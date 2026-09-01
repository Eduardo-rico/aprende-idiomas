// scripts/lotes/cloze-e2-22.ts
//
//   npx tsx scripts/lotes/cloze-e2-22.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-22.ts --json     # ítems para publicar
//
// E2#22 · 30 unidades. **Primera pasada de la estrategia nueva**: en vez
// de leer los 387 ítems viejos sin sello para salvar a la mitad, se
// produce material nuevo contra el déficit de lo SELLADO. Los números que
// lo decidieron, medidos en el tramo 1 de la cola: leer rinde 27 unidades
// selladas por sesión y producir rinde 100-180 — y los viejos se están
// sirviendo mientras tanto con un 55 % de error.
//
// Cuando un punto queda cubierto con material nuevo y sellado, sus ítems
// viejos sin leer pasan a ser excedente **por definición**, y salen por la
// vía que ya existe: cuarentena con motivo, reversible, con el invariante
// de que ningún punto caiga y con `rescatar-excedente.ts` de red.
//
// Los cuatro puntos de conjuntivo son los de más déficit del plan y sus
// respuestas se DERIVAN del paradigma, así que el gate las recalcula. Los
// cuatro de clítico van declarados: ahí no hay paradigma que derivar.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b6-futuro-subj (7) — el futuro do conjuntivo, que el español no
  // tiene: donde él pone presente de indicativo, el portugués lo exige.
  { p: 'b6-futuro-subj', pasada: 1, lema: 'fazer', t: 'futSubj', per: 'eles',
    s: 'Quando eles ___ (fazer) as contas, avisam-nos logo.', pista: 'futuro do conjuntivo, 3.ª del plural — irregular', ancla: 'avisam-nos logo' },
  { p: 'b6-futuro-subj', pasada: 1, lema: 'ver', t: 'futSubj', per: 'tu',
    s: 'Se tu ___ (ver) o António, diz-lhe que me ligue.', pista: 'futuro do conjuntivo, 2.ª persona — irregular', ancla: 'diz-lhe que me ligue' },
  { p: 'b6-futuro-subj', pasada: 1, lema: 'trazer', t: 'futSubj', per: 'vocês',
    s: 'Assim que vocês ___ (trazer) os papéis, tratamos disso.', pista: 'futuro do conjuntivo, 3.ª del plural — irregular', ancla: 'tratamos disso' },
  { p: 'b6-futuro-subj', pasada: 1, lema: 'pôr', t: 'futSubj', per: 'nós',
    s: 'Logo que nós ___ (pôr) tudo no sítio, fechamos a loja.', pista: 'futuro do conjuntivo, 1.ª del plural — irregular', ancla: 'fechamos a loja' },
  { p: 'b6-futuro-subj', pasada: 1, lema: 'querer', t: 'futSubj', per: 'ele',
    s: 'Enquanto ele ___ (querer) continuar, ninguém o impede.', pista: 'futuro do conjuntivo, 3.ª persona — irregular', ancla: 'ninguém o impede' },
  { p: 'b6-futuro-subj', pasada: 1, lema: 'dizer', t: 'futSubj', per: 'eu',
    s: 'Quando eu ___ (dizer) que sim, podem começar a servir.', pista: 'futuro do conjuntivo, 1.ª persona — irregular', ancla: 'podem começar a servir' },
  { p: 'b6-futuro-subj', pasada: 1, lema: 'estar', t: 'futSubj', per: 'elas',
    s: 'Se elas ___ (estar) prontas às oito, saímos todos juntos.', pista: 'futuro do conjuntivo, 3.ª del plural — irregular', ancla: 'saímos todos juntos' },

  // ══ b6-imperfeito-subj (6) — fuera de la condicional, disparado por el
  // verbo de la principal.
  { p: 'b6-imperfeito-subj', pasada: 1, lema: 'vir', t: 'imperfSubj', per: 'tu',
    s: 'Ela pediu que tu ___ (vir) mais cedo do que o costume.', pista: 'imperfeito do conjuntivo, 2.ª persona — irregular', ancla: 'do que o costume' },
  { p: 'b6-imperfeito-subj', pasada: 1, lema: 'dar', t: 'imperfSubj', per: 'vocês',
    s: 'Era bom que vocês ___ (dar) uma resposta ainda esta semana.', pista: 'imperfeito do conjuntivo, 3.ª del plural — irregular', ancla: 'ainda esta semana' },
  { p: 'b6-imperfeito-subj', pasada: 1, lema: 'poder', t: 'imperfSubj', per: 'ele',
    s: 'Não havia ali ninguém que ___ (poder) resolver aquilo.', pista: 'imperfeito do conjuntivo, 3.ª persona — irregular', ancla: 'Não havia ali ninguém' },
  { p: 'b6-imperfeito-subj', pasada: 1, lema: 'trazer', t: 'imperfSubj', per: 'eles',
    s: 'Mandei que eles ___ (trazer) as cadeiras da sala de cima.', pista: 'imperfeito do conjuntivo, 3.ª del plural — irregular', ancla: 'da sala de cima' },
  { p: 'b6-imperfeito-subj', pasada: 1, lema: 'querer', t: 'imperfSubj', per: 'eu',
    s: 'Ele falou como se eu ___ (querer) ir-me embora dali.', pista: 'imperfeito do conjuntivo, 1.ª persona — irregular', ancla: 'ir-me embora dali' },
  { p: 'b6-imperfeito-subj', pasada: 1, lema: 'fazer', t: 'imperfSubj', per: 'nós',
    s: 'O chefe insistiu para que nós ___ (fazer) o relatório outra vez.', pista: 'imperfeito do conjuntivo, 1.ª del plural — irregular', ancla: 'o relatório outra vez' },

  // ══ b6-se-hipotetico (7) — «se» + imperfeito do conjuntivo, con la
  // principal en imperfeito de indicativo, que es lo corriente en el
  // portugués europeo hablado.
  { p: 'b6-se-hipotetico', pasada: 1, lema: 'ganhar', t: 'imperfSubj', per: 'eu',
    s: 'Se eu ___ (ganhar) o suficiente, mudava-me para o centro.', pista: 'imperfeito do conjuntivo, 1.ª persona', ancla: 'mudava-me para o centro' },
  { p: 'b6-se-hipotetico', pasada: 1, lema: 'falar', t: 'imperfSubj', per: 'tu',
    s: 'Se tu ___ (falar) com ela, se calhar mudava de ideias.', pista: 'imperfeito do conjuntivo, 2.ª persona', ancla: 'se calhar mudava de ideias' },
  { p: 'b6-se-hipotetico', pasada: 1, lema: 'haver', t: 'imperfSubj', per: 'ele',
    s: 'Se ___ (haver) mais lugares, levávamos os miúdos também.', pista: 'imperfeito do conjuntivo del existencial, 3.ª persona', ancla: 'levávamos os miúdos também' },
  { p: 'b6-se-hipotetico', pasada: 1, lema: 'conseguir', t: 'imperfSubj', per: 'nós',
    s: 'Se nós ___ (conseguir) o desconto, comprávamos os dois.', pista: 'imperfeito do conjuntivo, 1.ª del plural', ancla: 'comprávamos os dois' },
  { p: 'b6-se-hipotetico', pasada: 1, lema: 'ler', t: 'imperfSubj', per: 'vocês',
    s: 'Se vocês ___ (ler) o contrato todo, percebiam o problema.', pista: 'imperfeito do conjuntivo, 3.ª del plural', ancla: 'percebiam o problema' },
  { p: 'b6-se-hipotetico', pasada: 1, lema: 'ir', t: 'imperfSubj', per: 'eles',
    s: 'Se eles ___ (ir) de comboio, chegavam mesmo à hora.', pista: 'imperfeito do conjuntivo, 3.ª del plural — irregular', ancla: 'chegavam mesmo à hora' },
  { p: 'b6-se-hipotetico', pasada: 1, lema: 'perder', t: 'imperfSubj', per: 'eu',
    s: 'Se eu ___ (perder) o autocarro, apanhava o seguinte.', pista: 'imperfeito do conjuntivo, 1.ª persona', ancla: 'apanhava o seguinte' },

  // ══ b6-se-irreal-passado (6) — el irreal del pasado: «se» + tivesse +
  // particípio. El hueco es el auxiliar, así que se deriva igual.
  { p: 'b6-se-irreal-passado', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'eu',
    s: 'Se eu ___ (ter) sabido isso antes, não tinha vindo.', pista: 'auxiliar en imperfeito do conjuntivo, 1.ª persona', ancla: 'não tinha vindo' },
  { p: 'b6-se-irreal-passado', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'nós',
    s: 'Se nós ___ (ter) chegado a horas, não perdíamos o avião.', pista: 'auxiliar en imperfeito do conjuntivo, 1.ª del plural', ancla: 'não perdíamos o avião' },
  { p: 'b6-se-irreal-passado', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'eles',
    s: 'Se eles ___ (ter) avisado, tínhamos mudado o plano todo.', pista: 'auxiliar en imperfeito do conjuntivo, 3.ª del plural', ancla: 'tínhamos mudado o plano todo' },
  { p: 'b6-se-irreal-passado', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'tu',
    s: 'Se tu ___ (ter) ficado mais um dia, conhecias a minha irmã.', pista: 'auxiliar en imperfeito do conjuntivo, 2.ª persona', ancla: 'conhecias a minha irmã' },
  { p: 'b6-se-irreal-passado', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'ela',
    s: 'Se ela ___ (ter) estudado mais, tinha passado no exame.', pista: 'auxiliar en imperfeito do conjuntivo, 3.ª persona', ancla: 'tinha passado no exame' },
  { p: 'b6-se-irreal-passado', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'vocês',
    s: 'Se vocês ___ (ter) dito alguma coisa, eu tinha ajudado.', pista: 'auxiliar en imperfeito do conjuntivo, 3.ª del plural', ancla: 'eu tinha ajudado' },

  // ══ b3-pron-indirecto (4) — el clítico de OI. Declarados: aquí no hay
  // paradigma verbal que derivar, y la pista tiene que nombrar a quién
  // señala el pronombre o el hueco admite varios.
  { p: 'b3-pron-indirecto', pasada: 1, r: 'lhe',
    s: 'A Ana está à espera: telefona-___ antes das oito.', pista: 'a ella — clítico de complemento indirecto, enclítico', ancla: 'A Ana está à espera' },
  { p: 'b3-pron-indirecto', pasada: 1, r: 'lhes',
    s: 'Ainda não ___ disse nada aos teus pais sobre a mudança.', pista: 'a ellos — clítico de complemento indirecto, proclítico tras la negación', ancla: 'aos teus pais' },
  { p: 'b3-pron-indirecto', pasada: 1, r: 'lhes',
    s: 'Se os teus irmãos perguntarem, diz-___ que já saímos.', pista: 'a ellos — clítico de complemento indirecto, enclítico', ancla: 'Se os teus irmãos perguntarem' },
  { p: 'b3-pron-indirecto', pasada: 1, r: 'nos',
    s: 'O professor explicou-___ a matéria outra vez, que não percebemos.', pista: 'a nosotros — clítico de complemento indirecto, enclítico', ancla: 'que não percebemos' },
];

if (process.argv[1]?.includes('cloze-e2-22')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, r: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Cloze E2#22 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems | derivados |'); console.log('|---|---:|---:|');
  for (const [p, n] of porPunto) {
    const der = ITEMS.filter((x) => x.p === p && x.lema).length;
    console.log(`| \`${p}\` | ${n} | ${der} |`);
  }
  console.log(`\n**${ITEMS.filter((x) => x.lema).length}/${ITEMS.length} con la respuesta DERIVADA del paradigma**, que el gate recalcula.\n`);
  console.log('## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

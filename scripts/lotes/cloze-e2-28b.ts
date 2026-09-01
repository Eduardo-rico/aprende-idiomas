// scripts/lotes/cloze-e2-28b.ts
//
//   npx tsx scripts/lotes/cloze-e2-28b.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-28b.ts --asigna   # dónde cae cada uno
//   npx tsx scripts/lotes/cloze-e2-28b.ts --json     # ítems para publicar
//
// E2#28 · **brazo PRODUCIR del experimento leer-vs-producir.** El par puso
// el umbral de la vía —producir si el punto pide ≥5, leer si pide ≤4— a
// ojo, y ahora hay datos para comprobarlo. Los dos brazos se miden en la
// misma sesión, contra la misma línea base (250 unidades) y con puntos
// emparejados en tamaño:
//
//   · brazo LEER:     b8-indireto-deicticos (4), b8-indireto-interrogativa
//                     (4), b4-perf-irr-monos (3), b6-imperf-subj-formacao (3)
//   · brazo PRODUCIR: b5-se-imperfeito-conj (4), b3-pres-irr-ir-dar-ver
//                     (4), b3-imper-formal (3), b4-perf-irr-ive (3)
//
// Catorce unidades cada uno. La métrica es **unidades cerradas por ítem
// manejado**, que es lo único que se puede medir sin cronómetro; el coste
// por ítem de cada vía se declara aparte, y como juicio, no como medición.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b5-se-imperfeito-conj (4) — la condicional irreal del bloque 5.
  { p: 'b5-se-imperfeito-conj', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'ele',
    s: 'Se ele ___ (ter) mais paciência, resolvia isto sozinho.', pista: 'imperfeito do conjuntivo, 3.ª persona — irregular', ancla: 'resolvia isto sozinho' },
  { p: 'b5-se-imperfeito-conj', pasada: 1, lema: 'vir', t: 'imperfSubj', per: 'eles',
    s: 'Se vocês ___ (vir) mais cedo, apanhavam o comboio das seis.', pista: 'imperfeito do conjuntivo, 3.ª del plural — irregular', ancla: 'o comboio das seis' },
  { p: 'b5-se-imperfeito-conj', pasada: 1, lema: 'poder', t: 'imperfSubj', per: 'eu',
    s: 'Se eu ___ (poder) escolher, ficava em casa a ler.', pista: 'imperfeito do conjuntivo, 1.ª persona — irregular', ancla: 'ficava em casa a ler' },
  { p: 'b5-se-imperfeito-conj', pasada: 1, lema: 'saber', t: 'imperfSubj', per: 'nós',
    s: 'Se nós ___ (saber) cozinhar, não jantávamos fora tantas vezes.', pista: 'imperfeito do conjuntivo, 1.ª del plural — irregular', ancla: 'não jantávamos fora tantas vezes' },

  // ══ b3-pres-irr-ir-dar-ver (4) — los tres presentes irregulares que el
  // español tiene igual de irregulares, pero con otras formas.
  { p: 'b3-pres-irr-ir-dar-ver', pasada: 1, lema: 'ir', t: 'presente', per: 'eu',
    s: 'Eu ___ (ir) ao mercado todas as sextas de manhã.', pista: 'presente de «ir», 1.ª persona', ancla: 'todas as sextas de manhã' },
  { p: 'b3-pres-irr-ir-dar-ver', pasada: 1, lema: 'dar', t: 'presente', per: 'nós',
    s: 'Nós ___ (dar) sempre uma volta depois do jantar.', pista: 'presente de «dar», 1.ª del plural', ancla: 'depois do jantar' },
  { p: 'b3-pres-irr-ir-dar-ver', pasada: 1, lema: 'ver', t: 'presente', per: 'tu',
    s: 'Tu ___ (ver) bem daqui ou queres trocar de lugar?', pista: 'presente de «ver», 2.ª persona — lleva circunflejo', ancla: 'ou queres trocar de lugar' },
  { p: 'b3-pres-irr-ir-dar-ver', pasada: 1, lema: 'ir', t: 'presente', per: 'eles',
    s: 'Eles ___ (ir) de comboio para o Porto amanhã de manhã.', pista: 'presente de «ir», 3.ª del plural', ancla: 'para o Porto amanhã de manhã' },

  // ══ b3-imper-formal (3) — el imperativo de «o senhor», que se forma
  // sobre el presente do conjuntivo y no sobre el indicativo.
  { p: 'b3-imper-formal', pasada: 1, lema: 'entrar', t: 'presSubj', per: 'ele',
    s: '___ (entrar), se faz favor, que o doutor já o recebe.', pista: 'imperativo de «o senhor» — se forma con el presente do conjuntivo', ancla: 'que o doutor já o recebe' },
  { p: 'b3-imper-formal', pasada: 1, lema: 'fazer', t: 'presSubj', per: 'ele',
    s: '___ (fazer) o favor de assinar aqui em baixo.', pista: 'imperativo de «o senhor», irregular — sobre el presente do conjuntivo', ancla: 'de assinar aqui em baixo' },
  { p: 'b3-imper-formal', pasada: 1, lema: 'sair', t: 'presSubj', per: 'ele',
    s: 'Não ___ (sair) sem falar primeiro com a receção.', pista: 'imperativo negativo de «o senhor» — sobre el presente do conjuntivo', ancla: 'sem falar primeiro com a receção' },

  // ══ b4-perf-irr-ive (3) — el pretérito de tema en -ive. Declarados: el
  // conjugador no tiene pretérito simple, y el gate ya avisó de que
  // adivinarlo consagra formas falsas.
  { p: 'b4-perf-irr-ive', pasada: 1, r: 'estive',
    s: 'Ontem ___ (estar) o dia todo em casa a arrumar armários.', pista: 'pretérito de «estar», 1.ª persona — tema en -ive', ancla: 'a arrumar armários' },
  { p: 'b4-perf-irr-ive', pasada: 1, r: 'tivemos',
    s: 'Nós ___ (ter) de esperar duas horas no aeroporto.', pista: 'pretérito de «ter», 1.ª del plural — tema en -ive', ancla: 'duas horas no aeroporto' },
  { p: 'b4-perf-irr-ive', pasada: 1, r: 'estiveram',
    s: 'Eles ___ (estar) cá em janeiro e não me avisaram.', pista: 'pretérito de «estar», 3.ª del plural — tema en -ive', ancla: 'e não me avisaram' },
];

if (process.argv[1]?.includes('cloze-e2-28b')) {
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
      console.log(fuera.length ? `\n**Se desvían:** ${fuera.map(([k, m]) => `${k} ${m}`).join(', ')}` : '\nNinguno se desvía.');
    })();
  } else {
    const porPunto = new Map<string, number>();
    for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
    console.log(`# Cloze E2#28b — ${ITEMS.length} ítems · brazo PRODUCIR del experimento\n`);
    console.log('| punto | ítems |'); console.log('|---|---:|');
    for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
    console.log('\n## Gates\n');
    if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
    console.log('Limpio.');
  }
}

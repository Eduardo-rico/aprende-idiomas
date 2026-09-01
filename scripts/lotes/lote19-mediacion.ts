// scripts/lotes/lote19-mediacion.ts
//
//   npx tsx scripts/lotes/lote19-mediacion.ts            # doc + gates
//   npx tsx scripts/lotes/lote19-mediacion.ts --json     # ítems para publicar
//
// LOTE 19 · 11 unidades: los dos puntos de mediación que quedan y que son
// transposición de registro. `b11-mediacao-especializada` (8) y
// `b10-var-tratamento` (3).
//
// En el especializado las dos direcciones son las dos reales de la
// profesión: explicar un texto técnico a quien no es del campo, y
// levantar a registro técnico lo que alguien cuenta con sus palabras. La
// segunda es la que hace un médico al escribir la nota clínica y la que
// hace un abogado al recoger una declaración, y falla igual de fácil:
// por añadir precisión que el paciente no dio.
import { rubricaDe, verificar, inventadosProbables, type ItemMed } from './lote12-mediacion';

const ESP = 'b11-mediacao-especializada';
const TRA = 'b10-var-tratamento';

export const ITEMS: ItemMed[] = [
  {
    id: 'MED-19-01', concepto: ESP, registroFuente: 'tecnico', registroDestino: 'llano',
    sourceText: 'A biópsia revelou hiperplasia benigna sem sinais de atipia celular. Recomenda-se vigilância semestral por imagem.',
    audience: 'o doente, de setenta anos, que ficou branco ao ler a palavra biópsia',
    instruccion: 'Explícaselo tú. Sin quitar ninguna de las dos informaciones: qué salió y qué hay que hacer.',
    marcadores: [['hiperplasia benigna', 'não é cancro', 'não é maligno', 'é benigno'], ['vigilância semestral por imagem', 'de seis em seis meses', 'duas vezes por ano', 'cada seis meses']],
    datos: [['sem sinais de atipia', 'não há células estranhas', 'nada estranho', 'sem alterações']],
    modelo: 'O resultado é bom: o que apareceu não é cancro, é um crescimento benigno, e não há células estranhas nenhumas. O que o médico pede é só ir fazendo um exame de imagem de seis em seis meses, para ver que continua igual.',
    wordRange: [25, 60], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-19-02', concepto: ESP, registroFuente: 'tecnico', registroDestino: 'llano',
    sourceText: 'A cláusula sexta prevê a resolução do contrato por incumprimento reiterado, sem prejuízo da indemnização por danos emergentes.',
    audience: 'o teu inquilino, que não é jurista e quer saber o que lhe pode acontecer',
    instruccion: 'Explícaselo en lenguaje corriente, sin suavizar la consecuencia.',
    marcadores: [['resolução do contrato', 'acabar o contrato', 'pôr fim ao contrato', 'fica sem contrato'], ['incumprimento reiterado', 'falhar várias vezes', 'repetidamente', 'mais do que uma vez'], ['danos emergentes', 'pagar os prejuízos', 'os prejuízos', 'o que se estragou']],
    datos: [['cláusula sexta', 'a sexta', 'cláusula 6']],
    modelo: 'A cláusula sexta diz isto: se falhar várias vezes, e não só uma, podem acabar o contrato. E acabar o contrato não o livra de pagar os prejuízos que essas falhas tenham causado — são duas coisas separadas e podem vir as duas.',
    wordRange: [25, 60], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-19-03', concepto: ESP, registroFuente: 'tecnico', registroDestino: 'llano',
    sourceText: 'Detetou-se corrosão nas armaduras da laje do piso -1, com destacamento parcial do recobrimento. Preconiza-se intervenção estrutural a curto prazo.',
    audience: 'a assembleia de condóminos, que vai votar o orçamento',
    instruccion: 'Dilo de modo que voten sabiendo qué pasa. Sin dramatizar y sin quitar la urgencia.',
    marcadores: [['corrosão nas armaduras', 'os ferros estão a enferrujar', 'ferros', 'ferrugem'], ['destacamento parcial do recobrimento', 'está a soltar-se', 'está a cair', 'solta-se'], ['Preconiza-se intervenção estrutural a curto prazo', 'tem de se arranjar em breve', 'não pode esperar', 'obras já']],
    datos: [['piso -1', 'a cave', 'piso menos um']],
    modelo: 'O relatório diz que na laje da cave os ferros estão a enferrujar e o betão à volta está a soltar-se. Não é uma questão estética: é a estrutura, e tem de se arranjar em breve. Por isso é que a obra aparece no orçamento e não pode ficar para o ano que vem.',
    wordRange: [28, 65], register: 'neutro',
  },
  {
    id: 'MED-19-04', concepto: ESP, registroFuente: 'tecnico', registroDestino: 'llano',
    sourceText: 'O estudo não permite estabelecer causalidade, dada a natureza observacional da amostra e a possível presença de fatores de confundimento não controlados.',
    audience: 'a tua irmã, que leu um titular a dizer que aquilo cura',
    instruccion: 'Explícale por qué el titular no se sostiene, sin decirle que el estudio no vale.',
    marcadores: [['não permite estabelecer causalidade', 'não prova que seja por isso', 'não prova', 'não diz que cause'], ['natureza observacional', 'só observaram', 'observaram', 'não experimentaram'], ['fatores de confundimento', 'outras causas', 'pode haver outra coisa', 'outra explicação']],
    datos: [['estudo']],
    modelo: 'O estudo não é mau, mas não prova que seja por isso. Eles só observaram o que já acontecia, não experimentaram nada, e por isso pode haver outra coisa a explicar o resultado — quem faz aquilo talvez faça também outras coisas. O titular saltou por cima disso tudo.',
    wordRange: [28, 65], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-19-05', concepto: ESP, registroFuente: 'llano', registroDestino: 'tecnico',
    sourceText: 'Doí-me aqui à noite, sobretudo quando me deito de lado. De manhã passa. Já dura para aí um mês.',
    audience: 'a nota clínica que fica no processo do doente',
    instruccion: 'Recógelo como nota clínica. Todo lo que él dijo, y nada que él no haya dicho.',
    marcadores: [['Doí-me aqui', 'Refere dor', 'Queixa-se de dor', 'dor referida'], ['para aí um mês', 'com cerca de um mês de evolução', 'um mês de evolução', 'há aproximadamente um mês']],
    datos: [['à noite', 'noturna', 'período noturno'], ['de lado', 'decúbito lateral', 'ao deitar-se de lado'], ['De manhã passa', 'alívio matinal', 'cede de manhã', 'melhora de manhã']],
    modelo: 'Refere dor de predomínio noturno, agravada em decúbito lateral, com alívio matinal espontâneo. Quadro com cerca de um mês de evolução. Sem outra sintomatologia referida pelo doente.',
    wordRange: [20, 55], register: 'formal',
  },
  {
    id: 'MED-19-06', concepto: ESP, registroFuente: 'llano', registroDestino: 'tecnico',
    sourceText: 'Eu ia a passar e o carro dele saiu do lugar sem pôr o pisca. Travei, mas ele bateu-me na porta do lado.',
    audience: 'a participação de sinistro que vai para a seguradora',
    instruccion: 'Redáctalo como parte. Nada de responsabilidad declarada: sólo lo que él dice que ocurrió.',
    marcadores: [['Eu ia a passar', 'circulava', 'seguia', 'o participante circulava'], ['sem pôr o pisca', 'sem sinalizar', 'sem sinalização', 'não sinalizou'], ['bateu-me na porta do lado', 'embate na lateral', 'colisão lateral', 'na lateral']],
    datos: [['Travei', 'travagem', 'travou', 'imobilização']],
    modelo: 'O participante circulava na via quando o segundo veículo iniciou manobra de saída do estacionamento sem sinalizar. Apesar da travagem efetuada, verificou-se embate na lateral do primeiro veículo. Descrição prestada pelo participante.',
    wordRange: [22, 60], register: 'formal',
  },
  {
    id: 'MED-19-07', concepto: ESP, registroFuente: 'llano', registroDestino: 'tecnico',
    sourceText: 'A máquina começou a fazer um barulho esquisito e depois deitou fumo. Desliguei-a logo e não voltei a ligar.',
    audience: 'o relatório de avaria que vai com o equipamento para a assistência',
    instruccion: 'Escríbelo como reporte de avería. Sin diagnosticar: tú no sabes qué se rompió.',
    marcadores: [['barulho esquisito', 'ruído anómalo', 'ruído não habitual', 'ruído'], ['deitou fumo', 'emissão de fumo', 'libertação de fumo', 'fumo'], ['Desliguei-a logo', 'corte imediato', 'desligado de imediato', 'imobilizado']],
    datos: [['não voltei a ligar', 'não foi reativado', 'sem nova tentativa', 'não se voltou a ligar']],
    modelo: 'O equipamento apresentou ruído anómalo em funcionamento, seguido de libertação de fumo. Procedeu-se ao corte imediato da alimentação. O equipamento não foi reativado desde então.',
    wordRange: [20, 55], register: 'formal',
  },
  {
    id: 'MED-19-08', concepto: ESP, registroFuente: 'llano', registroDestino: 'tecnico',
    sourceText: 'O miúdo não quer ir à escola desde que mudou de turma. Chora de manhã e diz que lhe dói a barriga, mas ao fim de semana está bem.',
    audience: 'o relatório que a psicóloga escolar junta ao processo',
    instruccion: 'Recógelo como observación. Describe lo que la madre cuenta, sin ponerle nombre clínico.',
    marcadores: [['não quer ir à escola', 'recusa escolar', 'recusa em frequentar', 'resistência à ida'], ['diz que lhe dói a barriga', 'queixas somáticas', 'queixas abdominais', 'sintomatologia somática'], ['ao fim de semana está bem', 'ausência de sintomatologia ao fim de semana', 'não se verificam ao fim de semana', 'remitem ao fim de semana']],
    datos: [['mudou de turma', 'mudança de turma'], ['Chora de manhã', 'choro matinal', 'choro', 'de manhã']],
    modelo: 'Relata a mãe recusa escolar com início coincidente com a mudança de turma. Descreve choro matinal e queixas abdominais, com ausência de sintomatologia ao fim de semana. Sem outros dados fornecidos pela mãe.',
    wordRange: [22, 60], register: 'formal',
  },

  // ── b10-var-tratamento (3) ───────────────────────────────────────
  {
    id: 'MED-19-09', concepto: TRA, registroFuente: 'pt-br', registroDestino: 'pt-pt',
    sourceText: 'Oi, professor! Você pode me mandar o arquivo que a gente viu na aula? Obrigado desde já!',
    audience: 'o mesmo professor, mas numa universidade portuguesa',
    instruccion: 'Reescríbelo como se lo escribiría un estudiante en Portugal. El tratamiento brasileño a un profesor no es el portugués.',
    marcadores: [['Você pode', 'O senhor pode', 'poderia', 'pode o senhor'], ['a gente viu', 'vimos', 'que demos', 'que foi dado'], ['Obrigado desde já', 'Com os melhores cumprimentos', 'Cumprimentos', 'Muito obrigado']],
    datos: [['arquivo', 'ficheiro'], ['aula']],
    modelo: 'Bom dia, Professor. Poderia enviar-me o ficheiro que vimos na aula? Muito obrigado. Com os melhores cumprimentos.',
    wordRange: [12, 40], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-19-10', concepto: TRA, registroFuente: 'pt-br', registroDestino: 'pt-pt',
    sourceText: 'Dona Maria, a senhora quer que eu passe aí amanhã cedo pra gente resolver isso?',
    audience: 'a mesma vizinha, mas em Lisboa',
    instruccion: 'Pásalo al trato portugués. El «dona + nombre» y el «pra gente» no se dicen así en Lisboa.',
    marcadores: [['Dona Maria', 'Ó senhora Maria', 'D. Maria', 'senhora Maria'], ['pra gente resolver', 'para resolvermos', 'para tratarmos', 'para vermos']],
    datos: [['amanhã cedo', 'amanhã de manhã', 'de manhã']],
    modelo: 'Ó senhora Maria, quer que eu passe aí amanhã de manhã para resolvermos isso?',
    wordRange: [10, 35], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-19-11', concepto: TRA, registroFuente: 'pt-pt', registroDestino: 'pt-br',
    sourceText: 'Ó senhor doutor, faz favor: o senhor pode ver-me isto antes de eu ir embora?',
    audience: 'o mesmo médico, mas num consultório em São Paulo',
    instruccion: 'Dilo como allí. El «senhor doutor» y la ênclise no son el registro brasileño equivalente.',
    marcadores: [['Ó senhor doutor', 'Doutor', 'Doutor, por favor', 'Oi, doutor'], ['faz favor', 'por favor', 'por gentileza'], ['ver-me isto', 'ver isso pra mim', 'olhar isso', 'dar uma olhada']],
    datos: [['antes de eu ir embora', 'antes de eu ir', 'antes de sair']],
    modelo: 'Doutor, por favor: o senhor pode olhar isso pra mim antes de eu ir embora?',
    wordRange: [10, 35], register: 'formal', address: 'o_senhor',
  },
];

if (process.argv[1]?.includes('lote19-mediacion')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Lote 19 — mediación de registro · ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | direcciones |');
  console.log('|---|---:|---|');
  for (const c of [ESP, TRA]) {
    const xs = ITEMS.filter((x) => x.concepto === c);
    const d = new Map<string, number>();
    for (const x of xs) { const k = `${x.registroFuente}→${x.registroDestino}`; d.set(k, (d.get(k) ?? 0) + 1); }
    console.log(`| \`${c}\` | ${xs.length} | ${[...d].map(([k, n]) => `${k} ×${n}`).join(' · ')} |`);
  }
  const sos = ITEMS.map((x) => [x.id, inventadosProbables(x)] as const).filter(([, w]) => w.length);
  if (sos.length) {
    console.log(`\n## Aviso · cifras y nombres del modelo que no están en la fuente\n`);
    for (const [id, w] of sos) console.log(`- ${id}: ${w.join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

// scripts/lotes/lote14-mediacion.ts
//
//   npx tsx scripts/lotes/lote14-mediacion.ts            # doc + gates
//   npx tsx scripts/lotes/lote14-mediacion.ts --json     # ítems para publicar
//
// LOTE 14 · pasada 1 de las 140 unidades de mediación (E2#18).
//
// Los tres puntos de esta pasada llegaron aquí por el mismo camino: el
// mapa formato↔punto los tenía en `juicio` **por defecto del bloque**, y
// un juicio binario no los mide porque en los tres **las dos formas son
// gramaticales**. Lo que cambia es el registro, y el registro se examina
// moviéndolo.
//
// Reutiliza entero el aparato del lote 12 —`ItemMed`, `rubricaDe`,
// `verificar`—: la rúbrica se DERIVA de los marcadores y los datos
// declarados, y el gate comprueba casilla a casilla que el modelo cumple
// su propia rúbrica. Es el mecanismo que mata el trasvase roto
// rúbrica↔gold, la clase que se llevó 12 de los 20 fallos del lote de 44.
//
// LAS DOS DIRECCIONES son obligatorias por gate y no por gusto: un punto
// de ELECCIÓN al que sólo se le pide una dirección vuelve a ser una
// regla, que es de lo que se le sacó.
import { rubricaDe, verificar, inventadosProbables, type ItemMed } from './lote12-mediacion';

const COL = 'b11-coloc-registro';
const NOR = 'b11-norma-culta-oral';
const CON = 'b11-conectores-discursivos';

export const ITEMS: ItemMed[] = [
  // ── A · La colocación como registro ──────────────────────────────
  // Cuatro que BAJAN el registro (la ênclise administrativa y el «se»
  // impersonal se deshacen) y cuatro que lo SUBEN.
  {
    id: 'MED-14-01', concepto: COL, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Comunica-se aos utentes que se encontra encerrado o balcão n.º 3. Solicita-se que se dirijam ao balcão n.º 5, onde serão atendidos com a maior brevidade.',
    audience: 'a tua mãe, que está na fila e não percebeu o aviso',
    instruccion: 'Dile lo que pasa, en voz normal. El «comunica-se» y el «solicita-se» del aviso no se dicen en voz alta: usa un verbo con sujeto.',
    marcadores: [['Comunica-se', 'avisam', 'dizem', 'estão a avisar'], ['Solicita-se', 'temos de', 'é para', 'pedem']],
    datos: [['balcão n.º 3', 'balcão 3'], ['balcão n.º 5', 'balcão 5']],
    modelo: 'Ó mãe, o balcão 3 está fechado. Temos de ir ao balcão 5, que é onde atendem agora — dizem que é rápido.',
    wordRange: [18, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-14-02', concepto: COL, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Informa-se que a chave do portão se encontra na portaria. Deverá o condómino identificar-se antes de a levantar.',
    audience: 'o teu irmão, que chega esta noite e não tem chave',
    instruccion: 'Explícaselo por mensaje. Nadie dice «identificar-se» a un hermano: cuéntalo con palabras de casa.',
    marcadores: [['Informa-se', 'a chave está', 'está'], ['identificar-se', 'dizes quem és', 'dizer quem és', 'dizeres quem és']],
    datos: [['portaria']],
    modelo: 'A chave do portão está na portaria. Chegas lá, dizes quem és e dão-ta — não te esqueças de levar alguma coisa com o teu nome.',
    wordRange: [18, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-14-03', concepto: COL, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Recorda-se aos senhores passageiros que não é permitido fumar em todo o recinto. Aos infratores aplicar-se-á a coima prevista no regulamento.',
    audience: 'um amigo que acabou de acender um cigarro à porta',
    instruccion: 'Avísale antes de que le caiga la multa. Díselo como se lo dirías de verdad, sin la voz del altavoz.',
    marcadores: [['Recorda-se', 'não podes', 'não se pode', 'olha que'], ['aplicar-se-á', 'levas', 'apanhas', 'vais levar']],
    datos: [['coima', 'multa'], ['fumar']],
    modelo: 'Ó pá, aqui não se pode fumar em lado nenhum, nem à porta. Se te apanham, levas multa — apaga isso e vamos ali para fora.',
    wordRange: [18, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-14-04', concepto: COL, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Agradece-se que se evite o uso do elevador durante os trabalhos. Qualquer avaria deverá comunicar-se de imediato à administração.',
    audience: 'a vizinha do lado, que sobe sempre de elevador',
    instruccion: 'Cuéntaselo en el rellano. El «agradece-se» y el «comunicar-se» son de circular: tú tienes voz.',
    marcadores: [['Agradece-se', 'é melhor', 'pedem', 'pediram'], ['comunicar-se', 'avisar', 'diz', 'dizer']],
    datos: [['elevador'], ['administração', 'à administração']],
    modelo: 'Ó vizinha, pediram para não usarmos o elevador enquanto durarem as obras. Se avariar alguma coisa, é avisar já a administração.',
    wordRange: [18, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-14-05', concepto: COL, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Ó Zé, diz aos outros que amanhã não venham cedo, que a água vai estar cortada de manhã. Se alguém precisar de alguma coisa, que me ligue.',
    audience: 'os colegas do escritório, num aviso que fica afixado na porta',
    instruccion: 'Pásalo a aviso escrito para la puerta. Un aviso no tutea ni nombra a nadie: la colocación culta hace ese trabajo.',
    marcadores: [['diz aos outros', 'Informam-se', 'Informa-se', 'Comunica-se'], ['que me ligue', 'deverá contactar', 'queira contactar', 'contactar']],
    datos: [['água'], ['de manhã', 'da manhã', 'período da manhã']],
    modelo: 'AVISO — Informa-se que o abastecimento de água estará suspenso durante o período da manhã de amanhã. Solicita-se que se evite a chegada antecipada. Qualquer necessidade deverá contactar-se o responsável.',
    wordRange: [20, 50], register: 'formal',
  },
  {
    id: 'MED-14-06', concepto: COL, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Malta, a sala grande fica ocupada na quinta toda. Quem tiver reunião, mude para a pequena e avise-me se não der.',
    audience: 'todos os departamentos, num correio interno que fica em arquivo',
    instruccion: 'Escríbelo como correo interno archivable. Sin «malta» y sin imperativos de tú: que la forma culta lleve el tono.',
    marcadores: [['Malta', 'Informam-se', 'Informa-se', 'Comunica-se'], ['avise-me', 'deverá comunicar-se', 'queiram comunicar', 'comunicar-se']],
    datos: [['sala grande'], ['quinta', 'quinta-feira']],
    modelo: 'Comunica-se que a sala grande se encontrará ocupada durante todo o dia de quinta-feira. As reuniões previstas deverão realizar-se na sala pequena; qualquer impossibilidade deverá comunicar-se atempadamente.',
    wordRange: [20, 50], register: 'formal',
  },
  {
    id: 'MED-14-07', concepto: COL, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Olha, diz-lhes que as inscrições acabam no dia 30 e que depois não aceito mais nada, nem que venham chorar.',
    audience: 'os candidatos, numa nota publicada no sítio da instituição',
    instruccion: 'Conviértelo en nota pública. Lo que en la conversación es una amenaza, por escrito es una cláusula.',
    marcadores: [['diz-lhes', 'Informam-se', 'Informa-se', 'Comunica-se'], ['não aceito mais nada', 'não serão aceites', 'não se aceitarão', 'não serão consideradas']],
    datos: [['inscrições', 'inscrição', 'candidaturas'], ['dia 30', '30']],
    modelo: 'Informa-se que o prazo de inscrição termina no dia 30. As candidaturas submetidas após essa data não serão aceites, independentemente do motivo invocado.',
    wordRange: [20, 50], register: 'formal',
  },
  {
    id: 'MED-14-08', concepto: COL, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Manda-lhes dizer que o pagamento sai na sexta e que quem não tiver os dados certos que trate disso já, senão fica para o mês seguinte.',
    audience: 'os prestadores de serviços, numa circular da contabilidade',
    instruccion: 'Redáctalo como circular. La orden dicha de viva voz se convierte en condición escrita.',
    marcadores: [['Manda-lhes dizer', 'Informa-se', 'Comunica-se', 'Informam-se'], ['que trate disso já', 'deverão regularizar', 'deverá proceder-se', 'regularizar']],
    datos: [['sexta', 'sexta-feira'], ['mês seguinte', 'mês subsequente']],
    modelo: 'Comunica-se que o processamento dos pagamentos se realizará na sexta-feira. Os prestadores cujos dados bancários se encontrem incorretos deverão regularizar a situação até essa data, sob pena de o pagamento transitar para o mês subsequente.',
    wordRange: [22, 55], register: 'formal',
  },

  // ── B · Norma culta escrita frente a uso oral culto ───────────────
  // El punto NO es corregir: las dos formas son de portugueses
  // instruidos. Es saber en qué lado del par está cada una.
  {
    id: 'MED-14-09', concepto: NOR, registroFuente: 'oral-culto', registroDestino: 'escrito-culto',
    sourceText: 'A gente já falou com o arquiteto e ele disse que dava para mudar a porta, mas que ia custar mais.',
    audience: 'o cliente, num relatório de obra que fica no processo',
    instruccion: 'Pásalo a relatório. «A gente» es de portugués culto hablando; en el processo se escribe la otra forma.',
    marcadores: [['A gente já falou', 'Foi contactado', 'Contactámos', 'foi consultado'], ['dava para', 'ser possível', 'é possível', 'seria possível']],
    datos: [['arquiteto'], ['porta'], ['custar mais', 'acréscimo', 'custo adicional']],
    modelo: 'Contactámos o arquiteto, que confirmou ser possível alterar a porta. A alteração implica, no entanto, um acréscimo de custo.',
    wordRange: [16, 50], register: 'formal',
  },
  {
    id: 'MED-14-10', concepto: NOR, registroFuente: 'oral-culto', registroDestino: 'escrito-culto',
    sourceText: 'Eu acho que não vale a pena insistir. Já mandámos dois emails e eles não responderam a nenhum dos dois.',
    audience: 'a direção, numa nota interna que vai a ata',
    instruccion: 'Escríbelo para el acta. Lo que en la reunión es una opinión, en el acta es una constatación.',
    marcadores: [['Eu acho que', 'Considera-se', 'Entende-se', 'É entendimento'], ['não vale a pena', 'não se afigura útil', 'não se justifica', 'afigura-se inútil']],
    datos: [['dois emails', 'dois correios', 'duas mensagens'], ['não responderam', 'sem resposta', 'não obtiveram resposta']],
    modelo: 'Considera-se que não se justifica nova insistência. Foram enviadas duas mensagens, ambas sem resposta por parte do destinatário.',
    wordRange: [16, 45], register: 'formal',
  },
  {
    id: 'MED-14-11', concepto: NOR, registroFuente: 'oral-culto', registroDestino: 'escrito-culto',
    sourceText: 'Tem muita gente a queixar-se do barulho à noite, principalmente do lado da rua de trás.',
    audience: 'a câmara municipal, numa exposição escrita',
    instruccion: 'Redáctalo como exposición. «Tem» existencial es de conversación incluso entre gente instruida: por escrito se pide el otro.',
    marcadores: [['Tem muita gente', 'Têm sido registadas', 'Registaram-se', 'Verifica-se']],
    datos: [['barulho', 'ruído'], ['à noite', 'período noturno', 'noturno'], ['rua de trás', 'arruamento posterior', 'traseiras']],
    modelo: 'Têm sido registadas queixas reiteradas relativas a ruído no período noturno, com particular incidência no arruamento posterior.',
    wordRange: [16, 45], register: 'formal',
  },
  {
    id: 'MED-14-12', concepto: NOR, registroFuente: 'oral-culto', registroDestino: 'escrito-culto',
    sourceText: 'O relatório que eu te falei ontem já está pronto, só falta a assinatura do chefe.',
    audience: 'o departamento jurídico, num correio que fica registado',
    instruccion: 'Pásalo a correo registrado. «O relatório que eu te falei» es lo que se dice; el jurídico espera la regência completa.',
    marcadores: [['que eu te falei', 'a que me referi', 'referido', 'mencionado']],
    datos: [['assinatura'], ['chefe', 'responsável', 'superior hierárquico']],
    modelo: 'O relatório a que me referi ontem encontra-se concluído, aguardando apenas a assinatura do superior hierárquico.',
    wordRange: [14, 40], register: 'formal',
  },
  {
    id: 'MED-14-13', concepto: NOR, registroFuente: 'escrito-culto', registroDestino: 'oral-culto',
    sourceText: 'Informa-se que a documentação submetida se encontra incompleta, devendo o requerente proceder à junção dos elementos em falta no prazo de dez dias úteis.',
    audience: 'o requerente, ao balcão, que não percebeu a carta',
    instruccion: 'Explícaselo de viva voz, sin bajar de registro culto: sigues siendo funcionario, pero estás hablando.',
    marcadores: [['Informa-se', 'Falta', 'O que falta', 'falta-lhe'], ['proceder à junção', 'entregar', 'trazer', 'juntar']],
    datos: [['dez dias úteis', 'dez dias'], ['documentação', 'documentos', 'papéis']],
    modelo: 'O senhor tem os documentos incompletos: falta juntar alguns elementos. Tem dez dias úteis para os entregar — se quiser, aponto-lhe aqui quais são.',
    wordRange: [16, 45], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-14-14', concepto: NOR, registroFuente: 'escrito-culto', registroDestino: 'oral-culto',
    sourceText: 'Mais se informa que o pagamento deverá ser efetuado por transferência bancária, não se aceitando numerário em caso algum.',
    audience: 'um cliente ao telefone, que pergunta se pode pagar em dinheiro',
    instruccion: 'Respóndele al teléfono. La fórmula escrita no se dice: dilo culto pero hablado.',
    marcadores: [['Mais se informa', 'Olhe', 'É assim', 'Diga-me'], ['não se aceitando numerário', 'não aceitamos dinheiro', 'não podemos aceitar dinheiro', 'não recebemos em dinheiro']],
    datos: [['transferência bancária', 'transferência']],
    modelo: 'Olhe, o pagamento tem mesmo de ser por transferência bancária. Não aceitamos dinheiro, nem aqui nem em nenhum balcão — é a regra da casa.',
    wordRange: [16, 45], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-14-15', concepto: NOR, registroFuente: 'escrito-culto', registroDestino: 'oral-culto',
    sourceText: 'Aquando da chegada, deverão os participantes dirigir-se à receção, onde lhes será entregue o respetivo crachá identificativo.',
    audience: 'os participantes, por megafone à porta do auditório',
    instruccion: 'Dilo por megáfono. «Aquando da» no se pronuncia: sigue siendo formal, pero es voz.',
    marcadores: [['Aquando da chegada', 'Quando chegarem', 'Ao chegar', 'À chegada'], ['lhes será entregue', 'entregamos', 'damos-lhes', 'recebem']],
    datos: [['receção'], ['crachá', 'crachá identificativo']],
    modelo: 'Bom dia. Quando chegarem, façam o favor de passar pela receção, que é onde entregamos o crachá identificativo a cada participante.',
    wordRange: [16, 45], register: 'formal',
  },
  {
    id: 'MED-14-16', concepto: NOR, registroFuente: 'escrito-culto', registroDestino: 'oral-culto',
    sourceText: 'Não obstante o atraso verificado, mantém-se a data prevista para a entrega, cujo cumprimento se reputa essencial.',
    audience: 'a equipa, numa reunião de segunda-feira de manhã',
    instruccion: 'Dilo en la reunión. «Não obstante» y «reputa-se» son de papel: la reunión pide otra cosa sin perder seriedad.',
    marcadores: [['Não obstante', 'Apesar do', 'Apesar de', 'Mesmo com'], ['se reputa essencial', 'é essencial', 'não podemos falhar', 'é mesmo importante']],
    datos: [['atraso'], ['data prevista', 'a data', 'prazo']],
    modelo: 'Apesar do atraso que tivemos, a data de entrega mantém-se. É mesmo importante cumpri-la — não podemos falhar essa.',
    wordRange: [16, 45], register: 'neutro',
  },

  // ── C · Conectores de nivel discursivo ────────────────────────────
  // El error no es de gramática: es poner el conector de la conversación
  // en un texto argumentativo, o al revés.
  {
    id: 'MED-14-17', concepto: CON, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Choveu muito. E depois a estrada estava cortada. E então tivemos de dar a volta toda e chegámos tarde.',
    audience: 'a seguradora, na descrição do sinistro',
    instruccion: 'Escríbelo para el seguro. Los «e depois / e então» de la conversación no articulan un texto: usa conectores que digan la relación.',
    marcadores: [['E depois', 'Acresce que', 'A isto acresce', 'Além disso'], ['E então', 'Em consequência', 'Por conseguinte', 'Consequentemente']],
    datos: [['estrada', 'via'], ['tarde', 'atraso', 'com atraso']],
    modelo: 'Registou-se precipitação intensa. Acresce que a via se encontrava cortada ao trânsito. Em consequência, foi necessário efetuar um desvio, do que resultou a chegada com atraso considerável.',
    wordRange: [20, 55], register: 'formal',
  },
  {
    id: 'MED-14-18', concepto: CON, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'O produto é bom, sim. Mas é caro. E também não há assistência cá. Por isso eu não compraria.',
    audience: 'a direção, num parecer técnico',
    instruccion: 'Redáctalo como parecer. La concesión y la conclusión piden conectores que las marquen, no un «mas» y un «por isso».',
    marcadores: [['Mas', 'Não obstante', 'Todavia', 'Contudo'], ['E também', 'Acresce ainda', 'A que acresce', 'Acresce que'], ['Por isso', 'Pelo exposto', 'Nestes termos', 'Em face do exposto']],
    datos: [['caro', 'preço', 'custo'], ['assistência', 'assistência técnica']],
    modelo: 'O produto apresenta qualidade técnica reconhecida. Não obstante, o seu custo é elevado. Acresce que não existe assistência técnica no país. Pelo exposto, não se recomenda a aquisição.',
    wordRange: [20, 55], register: 'formal',
  },
  {
    id: 'MED-14-19', concepto: CON, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Olha, a proposta deles é mais barata. Só que o prazo é o dobro. Ao fim ao cabo, sai o mesmo ou pior.',
    audience: 'o conselho, numa nota de apreciação de propostas',
    instruccion: 'Pásalo a nota de apreciación. «Só que» y «ao fim ao cabo» son de café: el consejo espera la articulación escrita.',
    marcadores: [['Só que', 'Sucede que', 'Porém', 'Todavia'], ['Ao fim ao cabo', 'Em suma', 'Em última análise', 'Conclui-se que']],
    datos: [['prazo'], ['o dobro', 'dobro', 'duplo']],
    modelo: 'A proposta apresenta um valor inferior ao das concorrentes. Sucede que o prazo de execução é o dobro do previsto. Em última análise, a vantagem financeira anula-se, podendo mesmo inverter-se.',
    wordRange: [20, 55], register: 'formal',
  },
  {
    id: 'MED-14-20', concepto: CON, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Não é só o barulho. É também o pó. E há o problema do estacionamento, que ninguém resolve.',
    audience: 'a assembleia de condóminos, na ata',
    instruccion: 'Escríbelo para el acta. Una enumeración de quejas necesita conectores que las jerarquicen.',
    marcadores: [['Não é só', 'Em primeiro lugar', 'Desde logo', 'Por um lado'], ['É também', 'Em segundo lugar', 'Por outro lado', 'A isto acresce'], ['E há', 'Por último', 'Finalmente', 'Acresce ainda']],
    datos: [['pó', 'poeira'], ['estacionamento']],
    modelo: 'Em primeiro lugar, foi reportado o ruído. Em segundo lugar, a poeira. Por último, mantém-se por resolver a questão do estacionamento, que ninguém tem resolvido.',
    wordRange: [20, 55], register: 'formal',
  },
  {
    id: 'MED-14-21', concepto: CON, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Não obstante o atraso, a entrega manteve-se. Acresce que os custos não sofreram agravamento. Pelo exposto, considera-se o balanço positivo.',
    audience: 'um colega novo, ao almoço, que perguntou como correu',
    instruccion: 'Cuéntaselo al almuerzo. Los conectores del informe no se dicen: usa los de hablar.',
    marcadores: [['Não obstante', 'Apesar do', 'Apesar de', 'Mesmo assim'], ['Acresce que', 'E ainda por cima', 'E além disso', 'E o melhor é que'], ['Pelo exposto', 'No fundo', 'Portanto', 'Ou seja']],
    datos: [['atraso'], ['custos', 'custou', 'dinheiro']],
    modelo: 'Correu bem. Apesar do atraso, entregámos na data. E ainda por cima não custou mais do que estava previsto. No fundo, saímos a ganhar.',
    wordRange: [16, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-14-22', concepto: CON, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Em face do exposto, e porquanto se mantêm as condições anteriormente descritas, entende-se dever manter-se a decisão. Todavia, admite-se reapreciação mediante novos elementos.',
    audience: 'o teu primo, que é quem fez o pedido e não percebeu a carta',
    instruccion: 'Tradúceselo a lenguaje de familia. Sin conectores de despacho, pero sin perder ni una condición.',
    marcadores: [['Em face do exposto', 'Portanto', 'Então', 'Resumindo'], ['Todavia', 'Mas', 'Agora', 'Só que']],
    datos: [['manter-se a decisão', 'não mudam', 'mantêm a decisão', 'fica na mesma'], ['novos elementos', 'coisas novas', 'papéis novos', 'provas novas']],
    modelo: 'Resumindo: como não mudou nada, a decisão fica na mesma. Mas dizem que voltam a olhar para o caso se apresentares papéis novos — vale a pena tentar.',
    wordRange: [16, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-14-23', concepto: CON, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Por um lado, a solução é mais económica. Por outro, exige formação adicional. Em suma, a decisão dependerá do prazo disponível.',
    audience: 'a tua equipa, num mensagem de grupo',
    instruccion: 'Mándaselo al grupo. La estructura de dos platos se dice de otra manera.',
    marcadores: [['Por um lado', 'É mais barata', 'Fica mais barata', 'Sai mais barato'], ['Por outro', 'mas', 'só que', 'agora'], ['Em suma', 'Ou seja', 'Portanto', 'Depende']],
    datos: [['formação', 'formação adicional', 'treino'], ['prazo', 'tempo']],
    modelo: 'É mais barata, sim, mas obriga a formação extra. Ou seja: se tivermos tempo, compensa; se estivermos com o prazo em cima, não.',
    wordRange: [16, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-14-24', concepto: CON, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Cumpre esclarecer que a alteração decorre de imposição legal. Consequentemente, não se afigura possível manter as condições anteriores.',
    audience: 'uma cliente antiga, ao balcão, que está a ficar irritada',
    instruccion: 'Explícaselo en el mostrador. Tiene que entender que no es decisión tuya, sin que le sueltes la circular.',
    marcadores: [['Cumpre esclarecer', 'É por causa', 'A lei mudou', 'Isto vem'], ['Consequentemente', 'por isso', 'e por isso', 'daí que']],
    datos: [['imposição legal', 'lei', 'a lei'], ['condições anteriores', 'condições de antes', 'como era antes']],
    modelo: 'A lei mudou e obriga-nos a isto — não fomos nós que decidimos. Por isso é que não podemos manter as condições de antes. Lamento mesmo, minha senhora.',
    wordRange: [16, 45], register: 'formal', address: 'o_senhor',
  },
];

if (process.argv[1]?.includes('lote14-mediacion')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Lote 14 — mediación, pasada 1 · ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | direcciones |');
  console.log('|---|---:|---|');
  for (const c of [COL, NOR, CON]) {
    const xs = ITEMS.filter((x) => x.concepto === c);
    const dirs = new Map<string, number>();
    for (const x of xs) {
      const k = `${x.registroFuente}→${x.registroDestino}`;
      dirs.set(k, (dirs.get(k) ?? 0) + 1);
    }
    console.log(`| \`${c}\` | ${xs.length} | ${[...dirs].map(([d, n]) => `${d} ×${n}`).join(' · ')} |`);
  }
  // AVISO, no bloqueo: números y nombres que el modelo trae y la fuente
  // no. La casilla negativa de la rúbrica es humana; esto es la parte de
  // ella que un script sí puede mirar.
  const sospechosos = ITEMS.map((x) => [x.id, inventadosProbables(x)] as const).filter(([, w]) => w.length);
  if (sospechosos.length) {
    console.log(`\n## Aviso · cifras y nombres del modelo que no están en la fuente\n`);
    for (const [id, w] of sospechosos) console.log(`- ${id}: ${w.join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

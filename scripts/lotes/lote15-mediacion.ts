// scripts/lotes/lote15-mediacion.ts
//
//   npx tsx scripts/lotes/lote15-mediacion.ts            # doc + gates
//   npx tsx scripts/lotes/lote15-mediacion.ts --json     # ítems para publicar
//
// LOTE 15 · pasada 2 de las 140 unidades de mediación (E2#18).
//
// **22 ítems, no 24**: es lo que cierran exactamente los tres puntos de
// esta pasada. El 24 es un techo de control de calidad, no una cuota, y
// un ítem por encima del piso baja el déficit en cero.
//
// Los tres son puntos de REGISTRO donde las dos versiones son correctas y
// lo que cambia es la relación entre quien habla y quien escucha. Un
// juicio binario sobre «descortesía calculada» no significa nada: ser
// cortante a propósito es gramatical por definición.
import { rubricaDe, verificar, inventadosProbables, type ItemMed } from './lote12-mediacion';

const JER = 'b11-jerarquias-profissionais';
const DES = 'b11-descortesia-calculada';
const REP = 'b12-repertorio-sociolinguistico';

export const ITEMS: ItemMed[] = [
  // ── A · Jerarquías profesionales ─────────────────────────────────
  // Cuatro hacia ARRIBA (el mismo contenido, dicho a quien manda) y
  // cuatro hacia ABAJO o en horizontal. El punto es que la información
  // no cambia y el envoltorio sí.
  {
    id: 'MED-15-01', concepto: JER, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Não vou conseguir acabar isto até sexta. Tenho a auditoria em cima e não dá para as duas coisas.',
    audience: 'o diretor do departamento, a quem tratas por «o senhor»',
    instruccion: 'Díselo al director. La información es la misma; lo que cambia es que ahora pides, no anuncias.',
    marcadores: [['Não vou conseguir', 'não me será possível', 'não será possível', 'receio não conseguir'], ['não dá para', 'não é compatível', 'não me permite', 'inviabiliza']],
    datos: [['sexta', 'sexta-feira'], ['auditoria']],
    modelo: 'Venho informar que receio não conseguir concluir o trabalho até sexta-feira. A preparação da auditoria está a absorver a totalidade do tempo disponível e não me permite assegurar as duas tarefas com qualidade. Agradeço que me indique qual devo priorizar.',
    wordRange: [25, 60], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-02', concepto: JER, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Aquilo que combinámos na reunião não está a acontecer. A equipa do outro lado não responde e ninguém faz nada.',
    audience: 'a administradora, num correio que fica em arquivo',
    instruccion: 'Escríbeselo a la administradora. Quejarse hacia arriba se hace constatando, no acusando.',
    marcadores: [['não está a acontecer', 'não tem sido cumprido', 'não se verificou', 'não foi executado'], ['ninguém faz nada', 'sem que se registe', 'não se registaram', 'sem resposta']],
    datos: [['reunião'], ['equipa do outro lado', 'a outra equipa', 'equipa homóloga']],
    modelo: 'Venho dar conta de que o calendário acordado em reunião não tem sido cumprido. Os pedidos dirigidos à equipa homóloga permanecem sem resposta, sem que se registem desenvolvimentos. Solicito orientação quanto ao passo seguinte.',
    wordRange: [25, 60], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-03', concepto: JER, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Preciso de mais uma pessoa. Assim não chego lá e depois a culpa vai ser minha.',
    audience: 'a chefia, num pedido formal de reforço de equipa',
    instruccion: 'Conviértelo en petición formal. Hacia arriba, el reproche anticipado se convierte en riesgo declarado.',
    marcadores: [['Preciso de', 'Solicito', 'Venho solicitar', 'requer-se'], ['a culpa vai ser minha', 'o risco', 'compromete', 'não posso assegurar']],
    datos: [['mais uma pessoa', 'um elemento', 'reforço']],
    modelo: 'Venho solicitar o reforço da equipa com um elemento adicional. Com a composição atual, não posso assegurar o cumprimento dos prazos definidos, e considero preferível sinalizar esse risco antes de ele se concretizar.',
    wordRange: [25, 55], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-04', concepto: JER, registroFuente: 'informal', registroDestino: 'formal',
    sourceText: 'Olha, aquela proposta que mandaste tem um erro nas contas. O total não bate certo com as parcelas.',
    audience: 'o teu superior hierárquico, que foi quem a assinou',
    instruccion: 'Díselo a quien la firmó. Corregir hacia arriba se hace sin nombrar culpa y dejando la salida abierta.',
    marcadores: [['tem um erro', 'poderá conter', 'aparente', 'parece haver'], ['não bate certo', 'não corresponde', 'diverge', 'não coincide']],
    datos: [['total'], ['parcelas']],
    modelo: 'Ao rever a proposta, parece haver uma divergência: o total apresentado não corresponde à soma das parcelas. Pode ser leitura minha, mas preferi assinalar antes de o documento seguir.',
    wordRange: [20, 55], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-05', concepto: JER, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Solicita-se aos colaboradores que procedam ao registo diário das horas afetas a cada projeto, com efeitos a partir do próximo dia 1.',
    audience: 'a tua equipa, num mensagem de grupo, e tu és quem a chefia',
    instruccion: 'Pásalo a tu equipo. Hacia abajo cambia el tono y la persona, pero no inventes motivos: la circular no los da y tú tampoco los tienes.',
    marcadores: [['Solicita-se aos colaboradores', 'a partir do dia 1 vamos', 'temos de', 'vamos ter de']],
    datos: [['registo', 'registar', 'apontar'], ['dia 1'], ['projeto', 'projetos']],
    modelo: 'Pessoal, a partir do dia 1 temos de apontar as horas de cada projeto, todos os dias. Sei que é uma chatice, mas é o que passou a ser pedido. Se alguém não souber onde registar, digam-me.',
    wordRange: [25, 60], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-15-06', concepto: JER, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Comunica-se que não será possível autorizar férias no mês de dezembro, atenta a acumulação de trabalho prevista para esse período.',
    audience: 'um colaborador teu que já tinha reservado a viagem',
    instruccion: 'Díselo tú. Hacia abajo, una negativa se da con la cara y con la razón, no con la fórmula.',
    marcadores: [['Comunica-se', 'não te posso', 'não vou poder', 'infelizmente não'], ['atenta a acumulação', 'é o mês em que cai tudo', 'porque', 'por causa']],
    datos: [['dezembro'], ['férias']],
    modelo: 'Tenho de te dizer que não vou poder aprovar férias em dezembro — é o mês em que cai tudo em cima. Sei que já tinhas marcado, e lamento a sério. Vamos ver como se arranja a viagem para janeiro.',
    wordRange: [25, 60], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-15-07', concepto: JER, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Informa-se que a avaliação de desempenho decorrerá durante a primeira quinzena de março, devendo cada colaborador submeter previamente a autoavaliação.',
    audience: 'a equipa, numa reunião curta de segunda-feira',
    instruccion: 'Dilo en la reunión. Hacia abajo puedes desdramatizar sin quitarle obligatoriedad.',
    marcadores: [['Informa-se', 'A avaliação é', 'Vamos ter', 'É já'], ['devendo cada colaborador', 'cada um', 'temos todos de', 'toca a']],
    datos: [['primeira quinzena de março', 'primeira quinzena', 'março'], ['autoavaliação']],
    modelo: 'Duas coisas rápidas: a avaliação é na primeira quinzena de março e cada um tem de entregar a autoavaliação antes. Não se esqueçam dessa parte, que sem ela a conversa fica coxa.',
    wordRange: [25, 60], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-15-08', concepto: JER, registroFuente: 'formal', registroDestino: 'informal',
    sourceText: 'Mais se informa que os pedidos de material deverão ser submetidos através do formulário próprio, não sendo considerados os efetuados por outra via.',
    audience: 'um colega de outra equipa, que te pediu material por mensagem',
    instruccion: 'Respóndele de colega a colega. En horizontal no hay ni orden ni petición: hay un aviso útil.',
    marcadores: [['Mais se informa', 'Olha', 'É assim', 'Diz-me'], ['não sendo considerados', 'senão não conta', 'senão perde-se', 'senão não chega']],
    datos: [['formulário', 'formulário próprio'], ['material']],
    modelo: 'Olha, o material tens mesmo de o pedir pelo formulário — por mensagem senão perde-se e depois ninguém o vê. Se quiseres, mando-te já o link e tratas disso agora.',
    wordRange: [20, 55], register: 'informal', address: 'tu',
  },

  // ── B · Descortesía calculada ────────────────────────────────────
  // Cuatro que ENFRÍAN (la cordialidad se retira a propósito y con
  // precisión) y cuatro que DESHIELAN. Lo que se aprende es que la
  // distancia se marca con recursos concretos, no con insultos.
  {
    id: 'MED-15-09', concepto: DES, registroFuente: 'cordial', registroDestino: 'frio',
    sourceText: 'Bom dia! Espero que esteja tudo bem consigo. Só para lembrar, com todo o carinho, que ainda estou à espera daquele relatório. Um abraço!',
    audience: 'o mesmo destinatário, que já não respondeu a três lembretes',
    instruccion: 'Es el cuarto recordatorio. Retira la cordialidad a propósito: sin una palabra de más y sin una grosería.',
    marcadores: [['Espero que esteja tudo bem consigo', 'Reitero', 'É a quarta vez', 'Volto a solicitar'], ['com todo o carinho', 'sem mais', 'até ao final do dia', 'com carácter de urgência'], ['Um abraço', 'Com os melhores cumprimentos', 'Cumprimentos', 'Atentamente']],
    datos: [['relatório']],
    modelo: 'Bom dia. Volto a solicitar o relatório, com carácter de urgência. É o quarto pedido sobre o mesmo assunto. Com os melhores cumprimentos.',
    wordRange: [14, 45], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-10', concepto: DES, registroFuente: 'cordial', registroDestino: 'frio',
    sourceText: 'Olá! Obrigada pela proposta, gostámos muito da ideia. Como sabe, temos várias em cima da mesa, mas vamos analisar com todo o interesse. Falamos em breve!',
    audience: 'o mesmo proponente, depois de a proposta ter sido rejeitada',
    instruccion: 'La respuesta ya es no. Escríbela sin ninguna de las suavidades anteriores y sin dejar puerta abierta.',
    marcadores: [['Obrigada pela proposta, gostámos muito da ideia', 'A proposta não foi selecionada', 'Não foi selecionada', 'Informa-se que a proposta não'], ['com todo o interesse', 'não haverá', 'não se prevê', 'está encerrado'], ['Falamos em breve', 'Cumprimentos', 'Atentamente', 'Com os melhores cumprimentos']],
    datos: [['proposta']],
    modelo: 'Informa-se que a proposta não foi selecionada. O processo está encerrado e não se prevê reapreciação. Cumprimentos.',
    wordRange: [12, 40], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-11', concepto: DES, registroFuente: 'cordial', registroDestino: 'frio',
    sourceText: 'Boa tarde! Que pena, sinto muito pelo transtorno. Vamos ver o que se pode fazer e eu própria trato disso, prometo. Beijinhos.',
    audience: 'a mesma cliente, que insultou duas funcionárias ao telefone',
    instruccion: 'La relación cambió. Sigue siendo correcto y deja de ser cálido: la frialdad es la respuesta, no el enfado.',
    marcadores: [['Que pena, sinto muito pelo transtorno', 'Registámos a ocorrência', 'Foi registada', 'Tomámos nota'], ['eu própria trato disso, prometo', 'será tratado pelos canais próprios', 'seguirá os canais', 'será encaminhado'], ['Beijinhos', 'Cumprimentos', 'Atentamente', 'Com os melhores cumprimentos']],
    datos: [['transtorno', 'ocorrência', 'situação']],
    modelo: 'Boa tarde. Foi registada a ocorrência, que seguirá os canais próprios. Não haverá acompanhamento individual. Cumprimentos.',
    wordRange: [12, 40], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-12', concepto: DES, registroFuente: 'cordial', registroDestino: 'frio',
    sourceText: 'Olá, tudo bem? Desculpa estar sempre a chatear, mas será que davas uma vista de olhos naquilo quando puderes? Sem pressa nenhuma!',
    audience: 'a mesma pessoa, três semanas depois e com o prazo a acabar amanhã',
    instruccion: 'Mañana vence. Quita las atenuaciones una a una: cada «desculpa» y cada «sem pressa» que sobreviva desactiva el mensaje.',
    marcadores: [['Desculpa estar sempre a chatear', 'O prazo termina', 'Termina amanhã', 'Preciso'], ['quando puderes', 'até amanhã', 'hoje', 'até ao final do dia'], ['Sem pressa nenhuma', 'É a última vez que peço', 'Não volto a pedir', 'Fico a aguardar']],
    datos: [['vista de olhos', 'rever', 'revisão', 'olhar']],
    modelo: 'O prazo termina amanhã. Preciso da tua revisão até ao final do dia de hoje. Não volto a pedir.',
    wordRange: [12, 40], register: 'neutro', address: 'tu',
  },
  {
    id: 'MED-15-13', concepto: DES, registroFuente: 'frio', registroDestino: 'cordial',
    sourceText: 'Recebido. O pedido não cumpre os requisitos. Indeferido. Cumprimentos.',
    audience: 'o requerente, que é um senhor de oitenta anos e veio ao balcão',
    instruccion: 'Díselo de viva voz al señor. La decisión no cambia; lo que cambia es que hay alguien delante.',
    marcadores: [['Indeferido', 'não posso aceitar', 'não foi aceite', 'não deu para aceitar'], ['Cumprimentos', 'com certeza', 'se precisar', 'estou aqui']],
    datos: [['requisitos', 'requisito', 'o que falta', 'papéis']],
    modelo: 'Faça favor de se sentar um bocadinho. O pedido não deu para aceitar porque faltam requisitos. Eu aponto-lhe aqui quais são e o senhor volta quando quiser, que estou aqui.',
    wordRange: [22, 60], register: 'formal', address: 'o_senhor',
  },
  {
    id: 'MED-15-14', concepto: DES, registroFuente: 'frio', registroDestino: 'cordial',
    sourceText: 'Não. Já foi explicado duas vezes. Consulte o regulamento, artigo 14.º.',
    audience: 'uma colega nova, que fez a pergunta pela primeira vez',
    instruccion: 'Es su primera vez, no la tercera. Responde como se responde a quien acaba de llegar.',
    marcadores: [['Já foi explicado duas vezes', 'é normal perguntares', 'ninguém sabe isso', 'não é nada óbvio'], ['Consulte o regulamento', 'Está no regulamento', 'olha o artigo', 'vem no artigo']],
    datos: [['artigo 14.º', 'artigo 14', '14.º']],
    modelo: 'Não dá, mas não é nada óbvio — é normal perguntares. Está no regulamento, no artigo 14.º, que ninguém lê até precisar. Se quiseres, explico-te a lógica num instante.',
    wordRange: [20, 55], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-15-15', concepto: DES, registroFuente: 'frio', registroDestino: 'cordial',
    sourceText: 'Fica registado o incumprimento do prazo. Aguarda-se justificação por escrito no prazo de 48 horas.',
    audience: 'o colaborador, que teve a mãe internada essa semana e ainda não o disse',
    instruccion: 'Sabes lo del hospital. Escríbelo sin retirar la obligación pero sin la temperatura del acta.',
    marcadores: [['Fica registado', 'Soube o que', 'sei que', 'imagino'], ['Aguarda-se justificação por escrito', 'escreve-me duas linhas', 'manda-me duas linhas', 'diz-me por escrito']],
    datos: [['prazo'], ['48 horas', 'dois dias']],
    modelo: 'Soube o que se passou com a tua mãe — o prazo é o que menos importa esta semana. Ainda assim tenho de o justificar lá em cima: manda-me duas linhas quando puderes, dentro de dois dias, e eu trato do resto.',
    wordRange: [22, 60], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-15-16', concepto: DES, registroFuente: 'frio', registroDestino: 'cordial',
    sourceText: 'A reclamação foi analisada. Não assiste razão ao reclamante. Processo encerrado.',
    audience: 'a reclamante, numa carta que tem de manter a decisão',
    instruccion: 'La decisión se mantiene. Escríbela de modo que se entienda por qué, sin que la cortesía la vuelva ambigua.',
    marcadores: [['Não assiste razão ao reclamante', 'não podemos dar-lhe razão', 'não lhe assiste razão', 'não é possível atender'], ['Processo encerrado', 'por encerrado', 'fica encerrado', 'encerramos']],
    datos: [['reclamação']],
    modelo: 'Analisámos a sua reclamação com atenção. Lamentamos, mas não é possível atender o pedido apresentado. Damos assim por encerrado o processo, e agradecemos a sua compreensão.',
    wordRange: [22, 60], register: 'formal', address: 'o_senhor',
  },

  // ── C · Repertorio sociolingüístico (C2) ─────────────────────────
  // Aquí no se cambia una fórmula: se SOSTIENE un registro entero a lo
  // largo de un texto. Tres que suben del café al despacho y tres que
  // bajan, sin que se arrastren marcas del anterior.
  {
    id: 'MED-15-17', concepto: REP, registroFuente: 'coloquial', registroDestino: 'academico',
    sourceText: 'A malta lê cada vez menos, isso vê-se. E não é por falta de livros — é que não há tempo nem cabeça. Depois queixam-se de que os miúdos não percebem nada do que leem.',
    audience: 'os leitores de uma revista universitária',
    instruccion: 'Sostén el registro académico de principio a fin. No basta con cambiar «malta»: si sobrevive un «isso vê-se», el texto se cae.',
    marcadores: [['A malta', 'A população', 'Os leitores', 'Verifica-se'], ['isso vê-se', 'observável nos indicadores', 'os dados', 'segundo os indicadores'], ['não há tempo nem cabeça', 'disponibilidade', 'condições de atenção', 'tempo e atenção'], ['queixam-se', 'lamenta-se', 'assinala-se', 'constata-se']],
    datos: [['livros'], ['miúdos', 'crianças', 'jovens', 'alunos']],
    modelo: 'Verifica-se uma redução continuada dos hábitos de leitura, observável nos indicadores disponíveis. A causa não reside na escassez de livros, mas nas condições de atenção e no tempo efetivamente disponível. Constata-se depois, com alguma incoerência, a dificuldade de compreensão leitora entre os jovens.',
    wordRange: [30, 70], register: 'formal',
  },
  {
    id: 'MED-15-18', concepto: REP, registroFuente: 'coloquial', registroDestino: 'juridico',
    sourceText: 'Combinámos que ele pagava metade das obras e eu ficava com a casa. Se não pagar até ao fim do ano, o negócio cai e cada um fica como estava.',
    audience: 'o notário, que vai redigir a cláusula',
    instruccion: 'Escríbelo como cláusula. El registro jurídico se sostiene entero: si queda un «cai», la cláusula no vale.',
    marcadores: [['Combinámos', 'As partes acordam', 'Acordam as partes', 'Fica convencionado'], ['o negócio cai', 'resolve-se o contrato', 'fica sem efeito', 'caduca'], ['cada um fica como estava', 'repristinando-se', 'restituindo-se', 'sem direito a indemnização']],
    datos: [['metade das obras', 'metade', 'metade do custo'], ['fim do ano', '31 de dezembro', 'final do ano']],
    modelo: 'Acordam as partes que o segundo outorgante suportará metade do custo das obras, transmitindo-se-lhe a primeira outorgante a propriedade do imóvel. Não sendo o pagamento efetuado até ao final do ano, o presente contrato fica sem efeito, restituindo-se as partes à situação anterior, sem direito a indemnização.',
    wordRange: [30, 75], register: 'solene',
  },
  {
    id: 'MED-15-19', concepto: REP, registroFuente: 'coloquial', registroDestino: 'jornalistico',
    sourceText: 'Estiveram lá umas mil pessoas, se tanto. Gritaram um bocado, cantaram, e às sete já não estava lá ninguém. A polícia nem apareceu.',
    audience: 'os leitores de um diário, na notícia da manifestação',
    instruccion: 'Escríbelo como noticia. El registro periodístico ni menosprecia ni celebra: si sobrevive un «se tanto», se nota la opinión.',
    marcadores: [['se tanto', 'segundo a organização', 'de acordo com', 'estima-se'], ['Gritaram um bocado', 'entoaram palavras de ordem', 'palavras de ordem', 'entoaram'], ['nem apareceu', 'não se registou presença', 'não foi mobilizada', 'sem presença policial']],
    datos: [['mil pessoas', 'mil'], ['sete', 'às sete', '19h', '19 horas']],
    modelo: 'A concentração reuniu cerca de mil pessoas, de acordo com a organização. Os participantes entoaram palavras de ordem e cânticos durante a tarde, tendo o protesto terminado por volta das 19 horas. Não se registou presença policial no local.',
    wordRange: [30, 70], register: 'neutro',
  },
  {
    id: 'MED-15-20', concepto: REP, registroFuente: 'academico', registroDestino: 'coloquial',
    sourceText: 'Os dados sugerem uma correlação positiva entre a exposição precoce à leitura e o desempenho lexical posterior, ainda que a causalidade não possa ser inferida a partir do presente desenho metodológico.',
    audience: 'a tua irmã, que tem um filho de três anos e te perguntou se vale a pena',
    instruccion: 'Explícaselo a tu hermana. Sostén el registro de casa entero, y no le mientas: la cautela del estudio tiene que sobrevivir.',
    marcadores: [['Os dados sugerem', 'parece que', 'pelos vistos', 'ao que parece'], ['correlação positiva', 'costumam ter mais', 'andam juntas', 'vai a par'], ['a causalidade não possa ser inferida', 'não quer dizer que seja por causa', 'não prova', 'não significa que']],
    datos: [['leitura', 'ler'], ['desempenho lexical', 'vocabulário', 'palavras']],
    modelo: 'Ao que parece, as crianças a quem se lê cedo costumam ter mais vocabulário depois. Agora atenção: isso não quer dizer que seja por causa da leitura — pode ser que as famílias que leem façam também outras coisas. De qualquer maneira, ler não faz mal a ninguém.',
    wordRange: [30, 70], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-15-21', concepto: REP, registroFuente: 'juridico', registroDestino: 'coloquial',
    sourceText: 'Fica o arrendatário obrigado a facultar o acesso ao locado para a realização de obras urgentes, mediante pré-aviso de quarenta e oito horas, sob pena de resolução do contrato.',
    audience: 'o teu vizinho, que recebeu esta carta e está assustado',
    instruccion: 'Tranquilízalo sin quitarle una obligación. El registro de vecindad, entero: si sobrevive un «locado», no lo has traducido.',
    marcadores: [['Fica o arrendatário obrigado', 'tens de', 'és obrigado a', 'tens mesmo de'], ['facultar o acesso ao locado', 'deixar entrar', 'abrir a porta', 'dar-lhes entrada'], ['sob pena de resolução do contrato', 'podem pôr-te na rua', 'podem acabar com o contrato', 'perdes a casa']],
    datos: [['quarenta e oito horas', '48 horas', 'dois dias'], ['obras urgentes', 'obras']],
    modelo: 'Calma, não é nada do outro mundo. Diz que tens de os deixar entrar quando houver obras urgentes, mas têm de avisar com dois dias de antecedência. Se te recusares, aí sim podem acabar com o contrato — por isso é só combinares uma hora que te dê jeito.',
    wordRange: [30, 70], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-15-22', concepto: REP, registroFuente: 'jornalistico', registroDestino: 'coloquial',
    sourceText: 'O executivo aprovou ontem a revisão em alta das taxas municipais, medida que entrará em vigor no primeiro dia do próximo trimestre e que abrangerá a totalidade dos munícipes.',
    audience: 'o teu pai, ao telefone, que quer saber se lhe vai custar mais',
    instruccion: 'Cuéntaselo por teléfono. Sin una palabra de periódico, y sin perder ni la fecha ni a quién afecta.',
    marcadores: [['O executivo aprovou', 'a câmara decidiu', 'a câmara vai', 'decidiram'], ['revisão em alta', 'vão subir', 'sobem', 'vai custar mais'], ['a totalidade dos munícipes', 'toda a gente', 'todos', 'a todos']],
    datos: [['taxas municipais', 'taxas'], ['próximo trimestre', 'daqui a três meses', 'trimestre']],
    modelo: 'Ó pai, a câmara decidiu ontem que as taxas sobem. Começa no princípio do próximo trimestre e é para toda a gente, não é só para uns. A ti também te apanha, portanto.',
    wordRange: [25, 65], register: 'informal', address: 'tu',
  },
];

if (process.argv[1]?.includes('lote15-mediacion')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Lote 15 — mediación, pasada 2 · ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | direcciones |');
  console.log('|---|---:|---|');
  for (const c of [JER, DES, REP]) {
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

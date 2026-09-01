// scripts/lotes/lote16-mediacion.ts
//
//   npx tsx scripts/lotes/lote16-mediacion.ts            # doc + gates
//   npx tsx scripts/lotes/lote16-mediacion.ts --json     # ítems para publicar
//
// LOTE 16 · pasada 3 de mediación (E2#18). 24 unidades, cuatro puntos que
// cierran exactos.
//
// Los cuatro son transposición de registro o de variedad, que es lo que
// esta máquina sabe hacer. **Los que quedan en el bucket después de éste
// NO lo son** —alusión cultural, humor, ironía, leer la posición social—:
// esos piden `explain_concept`, donde no hay «marcador que tiene que
// desaparecer» sino un efecto que hay que explicar. La rúbrica derivada
// de marcadores no les sirve, y forzarlos a esta plantilla sería fingir
// que se enseñan. Queda anotado para la pasada siguiente.
import { rubricaDe, verificar, inventadosProbables, type ItemMed } from './lote12-mediacion';

const GER = 'b10-var-gerundio';
const DES = 'b12-descortesia-precisa';
const MOD = 'b12-modo-pragmatico';
const MIT = 'b10-reg-mitigacao';

export const ITEMS: ItemMed[] = [
  // ── A · Gerundio brasileño ↔ «estar a + infinitivo» europeo ───────
  // No es un error que corregir: son dos variedades. Lo que se aprende es
  // moverse entre ellas a voluntad, que es lo que el punto pide.
  {
    id: 'MED-16-01', concepto: GER, registroFuente: 'pt-br', registroDestino: 'pt-pt',
    sourceText: 'Oi! Estou chegando agora no escritório. Já estou vendo os arquivos que você mandou e vou te responder ainda hoje.',
    audience: 'um colega de Lisboa, no mesmo canal de trabalho',
    instruccion: 'Reescríbelo como lo escribiría un lisboeta. No es corregir: es cambiar de variedad, y el progresivo europeo no usa gerundio.',
    marcadores: [['Estou chegando', 'Estou a chegar', 'Cheguei agora', 'estou a chegar'], ['estou vendo', 'estou a ver', 'já estou a ver', 'estou a olhar'], ['você mandou', 'que mandaste', 'me mandaste', 'enviaste']],
    datos: [['escritório'], ['hoje']],
    modelo: 'Olá! Estou a chegar agora ao escritório. Já estou a ver os ficheiros que me mandaste e respondo-te ainda hoje.',
    wordRange: [14, 40], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-16-02', concepto: GER, registroFuente: 'pt-br', registroDestino: 'pt-pt',
    sourceText: 'A gente tá esperando o técnico desde as oito. Ele ficou de vir, mas não tá atendendo o telefone.',
    audience: 'a administração do prédio, em Lisboa, por mensagem',
    instruccion: 'Pásalo a portugués europeo. Cambian el progresivo y el pronombre de sujeto, no la queja.',
    marcadores: [['tá esperando', 'estamos à espera', 'estamos a esperar', 'à espera'], ['não tá atendendo', 'não atende', 'não está a atender', 'não atende o telemóvel']],
    datos: [['técnico'], ['oito', 'as oito', 'às oito']],
    modelo: 'Estamos à espera do técnico desde as oito. Ficou de vir e agora não atende o telemóvel.',
    wordRange: [12, 40], register: 'neutro', address: 'tu',
  },
  {
    id: 'MED-16-03', concepto: GER, registroFuente: 'pt-br', registroDestino: 'pt-pt',
    sourceText: 'O sistema está rodando devagar desde ontem. Os usuários estão reclamando e a equipe está tentando entender o que aconteceu.',
    audience: 'a direção de uma empresa portuguesa, numa nota de incidente',
    instruccion: 'Reescríbelo para la nota portuguesa. Además del progresivo, dos palabras del texto son brasileñas y tienen equivalente europeo.',
    marcadores: [['está rodando', 'está a funcionar', 'está lento', 'tem estado lento'], ['estão reclamando', 'estão a reclamar', 'têm reclamado', 'queixam-se'], ['equipe', 'equipa'], ['usuários', 'utilizadores']],
    datos: [['ontem'], ['sistema']],
    modelo: 'O sistema está a funcionar devagar desde ontem. Os utilizadores têm reclamado e a equipa está a tentar perceber o que se passou.',
    wordRange: [14, 40], register: 'neutro',
  },
  {
    id: 'MED-16-04', concepto: GER, registroFuente: 'pt-br', registroDestino: 'pt-pt',
    sourceText: 'Estamos organizando o evento e vamos precisar de mais cadeiras. Você consegue trazer as suas?',
    audience: 'uma amiga de Coimbra, a quem tratas por tu',
    instruccion: 'Dilo en europeo. El «você» de la fuente no es de tuteo portugués: en Portugal, a una amiga, se le habla de tú.',
    marcadores: [['Estamos organizando', 'Estamos a organizar', 'Andamos a organizar', 'estamos a organizar'], ['Você consegue', 'Consegues', 'Podes', 'achas que consegues']],
    datos: [['cadeiras'], ['evento']],
    modelo: 'Estamos a organizar o evento e vamos precisar de mais cadeiras. Consegues trazer as tuas?',
    wordRange: [12, 35], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-16-05', concepto: GER, registroFuente: 'pt-pt', registroDestino: 'pt-br',
    sourceText: 'Estou a acabar o relatório e depois estou a pensar em passar por aí. Estás a trabalhar até tarde?',
    audience: 'um colega de São Paulo, no chat da equipa',
    instruccion: 'Reescríbelo como lo diría él. Mismo mensaje, la otra variedad.',
    marcadores: [['Estou a acabar', 'Estou terminando', 'Tô terminando', 'Estou acabando'], ['estou a pensar', 'estou pensando', 'tô pensando', 'penso'], ['Estás a trabalhar', 'Você está trabalhando', 'Tá trabalhando', 'Você vai trabalhar']],
    datos: [['relatório'], ['tarde']],
    modelo: 'Estou terminando o relatório e depois estou pensando em passar aí. Você está trabalhando até tarde?',
    wordRange: [12, 35], register: 'informal',
  },
  {
    id: 'MED-16-06', concepto: GER, registroFuente: 'pt-pt', registroDestino: 'pt-br',
    sourceText: 'A malta está a preparar a apresentação, mas o ficheiro não está a abrir. Estamos à espera do informático.',
    audience: 'a equipa do Rio, que vai assistir à mesma apresentação',
    instruccion: 'Pásalo a brasileño para que lo entiendan sin tropiezos. Tres palabras además del progresivo.',
    marcadores: [['A malta', 'O pessoal', 'A galera', 'O time'], ['está a preparar', 'está preparando', 'tá preparando', 'estamos preparando'], ['ficheiro', 'arquivo'], ['não está a abrir', 'não está abrindo', 'não abre', 'não tá abrindo']],
    datos: [['apresentação'], ['informático', 'suporte', 'técnico', 'TI']],
    modelo: 'O pessoal está preparando a apresentação, mas o arquivo não está abrindo. Estamos esperando o suporte.',
    wordRange: [12, 35], register: 'informal',
  },
  {
    id: 'MED-16-07', concepto: GER, registroFuente: 'pt-pt', registroDestino: 'pt-br',
    sourceText: 'Estamos a receber muitas chamadas sobre o mesmo assunto. O que está a acontecer com a vossa plataforma?',
    audience: 'o serviço de apoio de uma empresa brasileira, por escrito',
    instruccion: 'Escríbelo para el soporte brasileño. El progresivo y el posesivo de segunda persona cambian los dos.',
    marcadores: [['Estamos a receber', 'Estamos recebendo', 'Temos recebido', 'estamos recebendo'], ['está a acontecer', 'está acontecendo', 'tá acontecendo', 'aconteceu'], ['vossa', 'de vocês', 'sua']],
    datos: [['chamadas', 'ligações', 'chamados'], ['plataforma']],
    modelo: 'Estamos recebendo muitas ligações sobre o mesmo tema. Podem nos dizer o que está acontecendo com a plataforma de vocês?',
    wordRange: [12, 35], register: 'neutro',
  },

  // ── B · Descortesía PRECISA (C2) ─────────────────────────────────
  // Un grado más fino que `b11-descortesia-calculada`: allí se retiraba
  // la calidez entera; aquí se ofende EXACTAMENTE una cosa y ninguna más
  // — la decisión y no la persona, o al revés.
  {
    id: 'MED-16-08', concepto: DES, registroFuente: 'difuso', registroDestino: 'preciso',
    sourceText: 'Isto está tudo mal. Não sei em que estavas a pensar, nem sei se alguém reviu isto antes de me chegar às mãos.',
    audience: 'o autor do documento, um colega competente que desta vez falhou',
    instruccion: 'La crítica es merecida; el desprecio no. Reescríbelo de modo que hiera al trabajo y a nada más.',
    marcadores: [['Não sei em que estavas a pensar', 'não é o teu costume', 'não é o que costumas fazer', 'desta vez'], ['nem sei se alguém reviu', 'passou sem revisão', 'não foi revisto', 'falta uma revisão']],
    datos: [['isto', 'o documento', 'o texto']],
    modelo: 'Este documento não está em condições de seguir: não é o teu costume e por isso estranho. Passou sem revisão e nota-se em quase todas as páginas. Refá-lo e volta a mandar-mo.',
    wordRange: [18, 50], register: 'neutro', address: 'tu',
  },
  {
    id: 'MED-16-09', concepto: DES, registroFuente: 'difuso', registroDestino: 'preciso',
    sourceText: 'Vocês nunca fazem nada bem. Já é a terceira vez que temos problemas com a vossa empresa e ninguém aí parece capaz de resolver o que quer que seja.',
    audience: 'o gestor de conta do fornecedor, que não é quem causou o problema',
    instruccion: 'Reclama con fuerza y sin brocha gorda: lo que falló es el proceso, no todas las personas.',
    marcadores: [['Vocês nunca fazem nada bem', 'É a terceira falha', 'Regista-se a terceira', 'A terceira ocorrência'], ['ninguém aí parece capaz', 'não há um responsável identificado', 'falta um responsável', 'sem responsável designado']],
    datos: [['terceira vez', 'terceira', 'três vezes']],
    modelo: 'É a terceira ocorrência do mesmo tipo com a vossa empresa. Não ponho em causa quem atende, ponho em causa o processo: não há um responsável identificado para escalar e isso repete-se. Quero um nome e uma data.',
    wordRange: [20, 55], register: 'formal',
  },
  {
    id: 'MED-16-10', concepto: DES, registroFuente: 'difuso', registroDestino: 'preciso',
    sourceText: 'Que ideia mais absurda. Só a alguém que nunca pisou uma obra lhe podia passar isso pela cabeça.',
    audience: 'o colega que a propôs, num correio que vai com cópia a mais gente',
    instruccion: 'La propuesta es mala y hay público. Rechaza la idea sin dejar al colega en ridículo delante de todos.',
    marcadores: [['Que ideia mais absurda', 'A proposta não é viável', 'Não é exequível', 'não é viável'], ['nunca pisou uma obra', 'em obra', 'no terreno', 'na prática']],
    datos: [['ideia', 'proposta']],
    modelo: 'A proposta não é viável no terreno: em obra, aquela sequência obriga a parar frentes que têm de andar em paralelo. Sugiro que a discutamos antes de a levar à reunião.',
    wordRange: [18, 50], register: 'formal',
  },
  {
    id: 'MED-16-11', concepto: DES, registroFuente: 'preciso', registroDestino: 'difuso',
    sourceText: 'O relatório tem um erro na página 4: a série de 2019 está trocada com a de 2020. O resto está correto e é bom trabalho.',
    audience: 'a mesma pessoa, mas agora tu queres que ela pare de te mandar coisas',
    instruccion: 'Ahora quieres que deje de escribirte. Retira la precisión: sin dato concreto, la crítica se vuelve inatacable y desalienta.',
    marcadores: [['tem um erro na página 4', 'tem erros', 'tem coisas trocadas', 'não está fiável'], ['O resto está correto e é bom trabalho', 'convém rever tudo', 'é melhor rever', 'reveja-se']],
    datos: [['relatório']],
    modelo: 'O relatório tem coisas trocadas. Convém rever tudo antes de voltar a enviar.',
    wordRange: [10, 30], register: 'neutro',
  },
  {
    id: 'MED-16-12', concepto: DES, registroFuente: 'preciso', registroDestino: 'difuso',
    sourceText: 'Não posso aprovar a despesa porque falta a fatura. Assim que ma enviares, aprovo no mesmo dia.',
    audience: 'a mesma pessoa, a quem já não queres facilitar nada',
    instruccion: 'Quita el porqué y quita la salida. Fíjate en lo que la vaguedad hace: la misma negativa se vuelve un muro.',
    marcadores: [['porque falta a fatura', 'não reúne condições', 'como está', 'nestes termos'], ['Assim que ma enviares, aprovo no mesmo dia', 'quando estiver em condições', 'oportunamente', 'será reavaliada']],
    datos: [['despesa']],
    modelo: 'A despesa não reúne condições para aprovação. Será reavaliada oportunamente.',
    wordRange: [8, 28], register: 'formal',
  },
  {
    id: 'MED-16-13', concepto: DES, registroFuente: 'preciso', registroDestino: 'difuso',
    sourceText: 'Cheguei tarde porque o comboio ficou parado quarenta minutos em Entrecampos. Peço desculpa e recupero as horas hoje.',
    audience: 'a chefia, mas desta vez não queres dar explicações nenhumas',
    instruccion: 'Sin causa, sin disculpa y sin compensación. Es lo mismo dicho de manera que no ofrece nada.',
    marcadores: [['porque o comboio ficou parado', 'por motivos alheios', 'por razões alheias', 'imprevisto'], ['Peço desculpa e recupero as horas hoje', 'fica registado', 'para os devidos efeitos', 'toma nota']],
    datos: [['tarde', 'atraso']],
    modelo: 'Cheguei com atraso, por motivos alheios. Fica registado para os devidos efeitos.',
    wordRange: [8, 28], register: 'formal',
  },

  // ── C · Alternancias de modo con valor pragmático (C2) ───────────
  // Indicativo y conjuntivo son los dos gramaticales: lo que cambia es
  // cuánto se compromete quien habla con lo que dice.
  {
    id: 'MED-16-14', concepto: MOD, registroFuente: 'comprometido', registroDestino: 'cauteloso',
    sourceText: 'Talvez a medida vai ter efeito já este ano, e é provável que os números melhoram no próximo trimestre.',
    audience: 'os leitores de um relatório institucional que ninguém quer ver desmentido',
    instruccion: 'La institución no puede prometer. Pon el modo que retira el compromiso: con «talvez» y con «é provável que», el portugués cuidado pide conjuntivo.',
    marcadores: [['vai ter efeito', 'venha a ter efeito', 'possa ter efeito', 'tenha efeito'], ['melhoram', 'melhorem', 'venham a melhorar', 'possam melhorar']],
    datos: [['este ano'], ['próximo trimestre', 'trimestre']],
    modelo: 'Talvez a medida venha a ter efeito ainda este ano. É provável que os números melhorem no próximo trimestre, sem que daí se retire qualquer garantia.',
    wordRange: [16, 45], register: 'formal',
  },
  {
    id: 'MED-16-15', concepto: MOD, registroFuente: 'comprometido', registroDestino: 'cauteloso',
    sourceText: 'Não creio que o prazo é realista, e duvido que a equipa consegue entregar sem mais gente.',
    audience: 'a direção, num parecer escrito que vai a arquivo',
    instruccion: 'Es un parecer, no una acusación. Con «não creio que» y «duvido que», el modo que corresponde deja la duda en quien escribe.',
    marcadores: [['é realista', 'seja realista', 'venha a ser realista', 'possa ser realista'], ['consegue entregar', 'consiga entregar', 'venha a conseguir', 'possa entregar']],
    datos: [['prazo'], ['mais gente', 'reforço', 'mais pessoas']],
    modelo: 'Não creio que o prazo seja realista, e duvido que a equipa consiga entregar sem reforço. Deixo a apreciação a quem decidir.',
    wordRange: [16, 45], register: 'formal',
  },
  {
    id: 'MED-16-16', concepto: MOD, registroFuente: 'comprometido', registroDestino: 'cauteloso',
    sourceText: 'Embora o orçamento está aprovado, é possível que a obra começa só em setembro.',
    audience: 'os moradores, num aviso que a administração não quer ter de desmentir',
    instruccion: 'La administración se está comprometiendo sin querer. Con «embora» y con «é possível que», el modo cambia y con él la promesa.',
    marcadores: [['está aprovado', 'esteja aprovado', 'tenha sido aprovado'], ['começa', 'comece', 'venha a começar', 'só venha a começar']],
    datos: [['orçamento'], ['setembro']],
    modelo: 'Embora o orçamento esteja aprovado, é possível que a obra só comece em setembro. A administração informará logo que haja data firme.',
    wordRange: [16, 45], register: 'formal',
  },
  {
    id: 'MED-16-17', concepto: MOD, registroFuente: 'cauteloso', registroDestino: 'comprometido',
    sourceText: 'Não digo que a decisão seja errada, nem afirmo que tenha havido má-fé. Admito que possa ter existido descuido.',
    audience: 'a comissão, agora que há prova documental e é preciso dizerlo',
    instruccion: 'Ya hay prueba: la cautela pasa a ser evasiva. Pon el modo que asume lo que se afirma.',
    marcadores: [['Não digo que a decisão seja errada', 'A decisão foi errada', 'foi errada', 'está errada'], ['nem afirmo que tenha havido', 'houve', 'existiu', 'verificou-se'], ['Admito que possa ter existido', 'Não se tratou de descuido', 'não foi descuido', 'não houve descuido']],
    datos: [['decisão'], ['descuido']],
    modelo: 'A decisão foi errada e houve má-fé, como os documentos agora mostram. Não se tratou de descuido, e digo-o com esta clareza porque a prova o permite.',
    wordRange: [16, 50], register: 'formal',
  },
  {
    id: 'MED-16-18', concepto: MOD, registroFuente: 'cauteloso', registroDestino: 'comprometido',
    sourceText: 'É possível que o problema esteja no fornecedor, embora não seja seguro. Talvez convenha esperar mais uns dias.',
    audience: 'a equipa, depois de o diagnóstico ter ficado fechado esta manhã',
    instruccion: 'El diagnóstico ya está cerrado. Cambia el modo y verás cómo el mismo contenido pasa de sospecha a instrucción.',
    marcadores: [['É possível que o problema esteja', 'O problema está', 'está no fornecedor', 'é do fornecedor'], ['embora não seja seguro', 'está confirmado', 'confirmado', 'sem margem para dúvida'], ['Talvez convenha esperar', 'Não esperamos', 'avançamos', 'não vamos esperar']],
    datos: [['fornecedor']],
    modelo: 'O problema está no fornecedor e isso ficou confirmado esta manhã. Não vamos esperar mais: avançamos hoje com a substituição.',
    wordRange: [14, 45], register: 'neutro', address: 'tu',
  },
  {
    id: 'MED-16-19', concepto: MOD, registroFuente: 'cauteloso', registroDestino: 'comprometido',
    sourceText: 'Talvez fosse melhor que alguém verificasse os acessos, caso houvesse algum descuido de configuração.',
    audience: 'a equipa de sistemas, depois de o incidente já ter acontecido',
    instruccion: 'Ya ocurrió: la cortesía condicional aquí retrasa. Pon el modo que da la orden sin dejar de ser educado.',
    marcadores: [['Talvez fosse melhor que alguém verificasse', 'Verifiquem', 'É preciso verificar', 'peço que verifiquem'], ['caso houvesse', 'houve', 'há', 'existe']],
    datos: [['acessos'], ['configuração']],
    modelo: 'Peço que verifiquem hoje os acessos: houve um descuido de configuração e já produziu efeitos. Digam-me até ao fim do dia o que encontraram.',
    wordRange: [14, 45], register: 'formal',
  },

  // ── D · Mitigación ───────────────────────────────────────────────
  {
    id: 'MED-16-20', concepto: MIT, registroFuente: 'direto', registroDestino: 'mitigado',
    sourceText: 'Está errado. Faz outra vez.',
    audience: 'um estagiário no primeiro mês, que se esforçou',
    instruccion: 'Tiene que rehacerlo igual. Mitiga sin volverlo ambiguo: si acaba sin saber que hay que rehacerlo, la mitigación falló.',
    marcadores: [['Está errado', 'não está bem', 'há aqui um problema', 'falhou uma coisa'], ['Faz outra vez', 'obriga a refazer', 'vale a pena refazer', 'tens de repetir']],
    datos: [['outra vez', 'refazer', 'repetir']],
    modelo: 'Olha, há aqui um problema que obriga a refazer — não é do teu esforço, é do método. Explico-te já e repetes com calma.',
    wordRange: [14, 45], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-16-21', concepto: MIT, registroFuente: 'direto', registroDestino: 'mitigado',
    sourceText: 'Não vamos comprar isso. É caro e não serve.',
    audience: 'o fornecedor que passou a manhã a apresentar a proposta',
    instruccion: 'La respuesta sigue siendo no. Mitiga la forma sin dejar dudas sobre el fondo.',
    marcadores: [['Não vamos comprar isso', 'não vamos avançar', 'não avançamos', 'não seguimos'], ['É caro e não serve', 'não se ajusta', 'o valor e o âmbito', 'nem o preço nem o âmbito']],
    datos: [['caro', 'valor', 'preço']],
    modelo: 'Agradeço a apresentação, que foi detalhada. Não vamos avançar: nem o preço nem o âmbito se ajustam ao que precisamos este ano. Se isso mudar, falamos.',
    wordRange: [16, 45], register: 'formal',
  },
  {
    id: 'MED-16-22', concepto: MIT, registroFuente: 'direto', registroDestino: 'mitigado',
    sourceText: 'Chegaste tarde três vezes esta semana. Não pode ser.',
    audience: 'a colaboradora, numa conversa a sós',
    instruccion: 'El aviso tiene que llegar. Mitiga la entrada, no la consecuencia.',
    marcadores: [['Não pode ser', 'tem de deixar de acontecer', 'não pode continuar', 'temos de resolver']],
    datos: [['três vezes', 'três'], ['semana']],
    modelo: 'Queria falar contigo um bocadinho. Tenho reparado que esta semana chegaste tarde três vezes — não sei se se passa alguma coisa. Seja o que for, tem de deixar de acontecer, e prefiro dizer-to agora e a sós.',
    wordRange: [20, 55], register: 'neutro', address: 'tu',
  },
  {
    id: 'MED-16-23', concepto: MIT, registroFuente: 'mitigado', registroDestino: 'direto',
    sourceText: 'Não sei se me estou a explicar bem, e talvez seja impressão minha, mas parece-me que se calhar convinha ver isso com algum cuidado, se não for incómodo.',
    audience: 'a equipa de urgência, que tem dois minutos e uma fuga de água',
    instruccion: 'Hay una fuga. Quita todas las capas de mitigación: aquí atenuar es esconder.',
    marcadores: [['Não sei se me estou a explicar bem', 'Há uma fuga', 'Fuga de água', 'Temos uma fuga'], ['talvez seja impressão minha', 'no piso', 'agora', 'já'], ['se não for incómodo', 'venham já', 'é urgente', 'agora']],
    datos: [['cuidado', 'ver', 'verificar']],
    modelo: 'Há uma fuga de água. Venham já verificar, é urgente.',
    wordRange: [6, 25], register: 'neutro',
  },
  {
    id: 'MED-16-24', concepto: MIT, registroFuente: 'mitigado', registroDestino: 'direto',
    sourceText: 'Se calhar, e sem querer estar a incomodar, talvez pudesses ver, quando tiveres um bocadinho, se por acaso aquilo do pagamento ficou tratado.',
    audience: 'o mesmo colega, mas o prazo era ontem e a fatura vai a multa',
    instruccion: 'El plazo pasó. Quita la atenuación entera y deja el dato y la consecuencia.',
    marcadores: [['Se calhar', 'O prazo', 'O pagamento', 'Preciso'], ['sem querer estar a incomodar', 'era ontem', 'passou ontem', 'já passou'], ['quando tiveres um bocadinho', 'hoje', 'agora', 'até ao fim do dia']],
    datos: [['pagamento']],
    modelo: 'O prazo do pagamento era ontem e a partir de agora conta multa. Preciso que trates disso hoje e que me digas quando estiver feito.',
    wordRange: [12, 40], register: 'neutro', address: 'tu',
  },
];

if (process.argv[1]?.includes('lote16-mediacion')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Lote 16 — mediación, pasada 3 · ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | direcciones |');
  console.log('|---|---:|---|');
  for (const c of [GER, DES, MOD, MIT]) {
    const xs = ITEMS.filter((x) => x.concepto === c);
    const dirs = new Map<string, number>();
    for (const x of xs) {
      const k = `${x.registroFuente}→${x.registroDestino}`;
      dirs.set(k, (dirs.get(k) ?? 0) + 1);
    }
    console.log(`| \`${c}\` | ${xs.length} | ${[...dirs].map(([d, n]) => `${d} ×${n}`).join(' · ')} |`);
  }
  const sospechosos = ITEMS.map((x) => [x.id, inventadosProbables(x)] as const).filter(([, w]) => w.length);
  if (sospechosos.length) {
    console.log(`\n## Aviso · cifras y nombres del modelo que no están en la fuente\n`);
    for (const [id, w] of sospechosos) console.log(`- ${id}: ${w.join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

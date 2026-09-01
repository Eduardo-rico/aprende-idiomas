// scripts/lotes/lote12-mediacion.ts
//
//   npx tsx scripts/lotes/lote12-mediacion.ts            # doc + gates
//   npx tsx scripts/lotes/lote12-mediacion.ts --json     # ítems para publicar
//
// LOTE 12 — INDUSTRIAL DE MEDIACIÓN, el formato que sus puntos piden.
//
// El lote 12 nació como juicios de gramaticalidad y murió dos veces. El
// mapa formato↔punto dice por qué: `b12-mesoclise-estilistica` es
// `pragmatico` —el punto pide ELECCIÓN de registro, y en un binario la
// mesóclise sólo puede salir obligatoria o imposible, nunca elegida—.
// Aquí el alumno **mueve un texto de un registro a otro**, que es
// exactamente la destreza que el currículo de C2 nombra: «saber cuándo
// usarla y, sobre todo, cuándo callarla».
//
// ── LA RÚBRICA SE DERIVA, NO SE ESCRIBE ──────────────────────────────
//
// La clase de error que mató al lote industrial de 44 (12 de 20 fallos)
// fue **trasvase roto rúbrica↔gold**: la casilla nombra un dato que la
// respuesta modelo no dice, o exige uno que la fuente no da. Pasa porque
// la rúbrica y su modelo se escriben en paralelo y se separan.
//
// Aquí no se escriben en paralelo: cada ítem declara los MARCADORES que
// tienen que cambiar y los DATOS que tienen que sobrevivir, y de ahí
// salen **la rúbrica y sus comprobaciones**. Un gate verifica, casilla a
// casilla y por script, que el modelo cumple su propia rúbrica — que es
// lo que en el lote 5 se hizo a ojo y falló en tres de seis.
import fs from 'node:fs';
import path from 'node:path';

export interface ItemMed {
  id: string;
  concepto: string;
  registroFuente: string;
  registroDestino: string;
  sourceText: string;
  audience: string;
  /** la consigna, que dice QUÉ hacer sin decir CÓMO */
  instruccion: string;
  /** [lo que está en la fuente, lo que tiene que aparecer en su lugar,
   *  ...formas alternativas que también valen].
   *
   *  Las alternativas no son un descuento: una mediación BUENA
   *  reformula, y un gate que exija la cadena literal castiga
   *  precisamente lo que se pide. Lo que no admite alternativa es el
   *  lado izquierdo: el marcador de la fuente tiene que desaparecer. */
  marcadores: [string, ...string[]][];
  /** Los datos que tienen que sobrevivir. Como cadena, se busca por
   *  palabra de contenido; como lista, la primera es la de la fuente y
   *  las demás son PARÁFRASIS aceptadas — «prorrogação» ⇒ «mais tempo». */
  datos: (string | string[])[];
  modelo: string;
  wordRange: [number, number];
  register: string;
  address?: string;
}

const MES = 'b12-mesoclise-estilistica';
const ARC = 'b12-arcaismo-juridico';

// ── A · La mesóclise como ELECCIÓN de registro ───────────────────────
// Seis en cada dirección: seis que la QUITAN (el aviso solemne pasa a
// mensaje normal) y seis que la PONEN (el recado llano pasa a aviso
// oficial). Sin las dos direcciones el punto no es una elección: es una
// regla, que es justo lo que el binario ya no podía enseñar.
export const ITEMS: ItemMed[] = [
  {
    id: 'MED-01', concepto: MES, registroFuente: 'solene', registroDestino: 'informal',
    sourceText: 'AVISO AOS CONDÓMINOS — Proceder-se-á à substituição do elevador entre 4 e 15 de março. Durante esse período, utilizar-se-á exclusivamente a escada. Comunicar-se-á por escrito qualquer alteração ao calendário.',
    audience: 'a tua vizinha do quarto andar, que tem um bebé e um carrinho',
    instruccion: 'Cuéntaselo por mensaje, como se lo dirías de viva voz. La mesóclise del aviso no cabe en un mensaje a una vecina: dilo con el verbo entero.',
    marcadores: [['Proceder-se-á', 'vão'], ['utilizar-se-á', 'só há'], ['Comunicar-se-á', 'avisam']],
    datos: ['4 e 15 de março', 'escada'],
    modelo: 'Olá! Vão mudar o elevador entre 4 e 15 de março, e nesses dias só há a escada. Se mudarem alguma coisa no calendário, avisam por escrito. Digo-te já para te organizares com o carrinho.',
    wordRange: [30, 60], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-02', concepto: MES, registroFuente: 'solene', registroDestino: 'informal',
    sourceText: 'A direção informa que encerrar-se-ão os serviços administrativos no dia 2 de maio. Os pedidos pendentes tratar-se-ão na semana seguinte, por ordem de entrada.',
    audience: 'um colega que entregou um pedido na semana passada e está à espera',
    instruccion: 'Dile lo que le toca, en tono de colega. El verbo partido del aviso suena a circular: usa la forma normal.',
    marcadores: [['encerrar-se-ão', 'fecham', 'fecha'], ['tratar-se-ão', 'tratam', 'vão tratando', 'tratam-se']],
    datos: ['2 de maio', ['ordem de entrada', 'por ordem de entrada']],
    modelo: 'Olha, a parte administrativa fecha no dia 2 de maio. O que já entrou fica para a semana a seguir e vão tratando por ordem de entrada — o teu não se perde, só anda mais devagar.',
    wordRange: [28, 55], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-03', concepto: MES, registroFuente: 'solene', registroDestino: 'neutro',
    sourceText: 'Informa-se que a biblioteca municipal reabrirá a 12 de setembro. Aos leitores com obras em atraso perdoar-se-lhes-ão as multas até essa data.',
    audience: 'o grupo de leitura de que fazes parte, num recado para todos',
    instruccion: 'Pásalo al grupo en tono normal, ni solemne ni de confianza. La forma triple del aviso no se dice fuera del papel.',
    marcadores: [['perdoar-se-lhes-ão', 'perdoam']],
    datos: ['12 de setembro', 'multas'],
    modelo: 'A biblioteca municipal reabre a 12 de setembro. A quem tiver livros em atraso, perdoam as multas até essa data — vale a pena aproveitar antes de irmos buscar os próximos.',
    wordRange: [25, 50], register: 'neutro',
  },
  {
    id: 'MED-04', concepto: MES, registroFuente: 'solene', registroDestino: 'informal',
    sourceText: 'EDITAL — Publicar-se-á a lista definitiva de admitidos no dia 20. Aos candidatos excluídos dar-se-lhes-á prazo de cinco dias úteis para reclamação.',
    audience: 'o teu primo, que se candidatou e está nervoso',
    instruccion: 'Explícaselo como se lo dirías por teléfono. Nada de verbos partidos: no es una circular, es tu primo.',
    marcadores: [['Publicar-se-á', 'sai'], ['dar-se-lhes-á', 'dão']],
    datos: ['dia 20', 'cinco dias úteis'],
    modelo: 'A lista definitiva sai no dia 20. Se ficares de fora, dão-te cinco dias úteis para reclamar, por isso não é o fim do mundo. Fica atento ao dia 20 e depois falamos.',
    wordRange: [28, 55], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-05', concepto: MES, registroFuente: 'solene', registroDestino: 'neutro',
    sourceText: 'A administração comunica que far-se-á a leitura dos contadores na primeira semana de outubro. Não se encontrando ninguém em casa, deixar-se-á aviso na caixa do correio.',
    audience: 'os teus pais, que passam o dia fora e nunca leem os avisos da caixa',
    instruccion: 'Resúmeselo en un recado normal, con lo que tienen que hacer. El aviso parte los verbos; tú no.',
    marcadores: [['far-se-á', 'fazem'], ['deixar-se-á', 'deixam']],
    datos: ['primeira semana de outubro', 'caixa do correio'],
    modelo: 'Na primeira semana de outubro fazem a leitura dos contadores. Se não estiver ninguém em casa, deixam um aviso na caixa do correio — convém irem lá ver, que essa semana passam por cá.',
    wordRange: [28, 55], register: 'neutro',
  },
  {
    id: 'MED-06', concepto: MES, registroFuente: 'solene', registroDestino: 'informal',
    sourceText: 'Aos sócios em atraso enviar-se-lhes-á a segunda via da quota. Findo o prazo de trinta dias, suspender-se-ão os direitos de utilização do campo.',
    audience: 'um amigo do clube que está em atraso e não sabe',
    instruccion: 'Avísalo antes de que se le pase, en confianza. La mesóclise del regulamento no se dice a un amigo.',
    marcadores: [['enviar-se-lhes-á', 'mandam'], ['suspender-se-ão', 'cortam']],
    datos: ['segunda via', 'trinta dias'],
    modelo: 'Olha que mandam a segunda via da quota a quem está em atraso. Se passarem trinta dias, cortam o direito a usar o campo — paga isso antes que dês por ti sem jogar no domingo.',
    wordRange: [28, 55], register: 'informal', address: 'tu',
  },
  // ── la dirección contraria: el registro PIDE la mesóclise
  {
    id: 'MED-07', concepto: MES, registroFuente: 'informal', registroDestino: 'solene',
    sourceText: 'Malta, na quinta vamos cortar a água das dez ao meio-dia para arranjar o cano do terceiro. Depois avisamos se ficar tudo bem.',
    audience: 'todos os condóminos, num aviso para afixar no átrio',
    instruccion: 'Pásalo a aviso oficial para el portal. En ese registro el futuro se parte: es la marca que separa el papel del mensaje.',
    marcadores: [['vamos cortar', 'cortar-se-á'], ['avisamos', 'comunicar-se-á']],
    datos: ['quinta', 'das dez ao meio-dia'],
    modelo: 'AVISO — Na próxima quinta-feira cortar-se-á o abastecimento de água das dez ao meio-dia, para reparação da conduta do terceiro andar. Concluída a intervenção, comunicar-se-á o restabelecimento do serviço.',
    wordRange: [25, 55], register: 'formal',
  },
  {
    id: 'MED-08', concepto: MES, registroFuente: 'informal', registroDestino: 'solene',
    sourceText: 'Pessoal, a partir de janeiro vamos aceitar inscrições só até ao dia 10 de cada mês. Quem se atrasar fica para o mês seguinte.',
    audience: 'os utentes, numa circular da direção',
    instruccion: 'Conviértelo en circular. Aquí el verbo partido no es adorno: es lo que hace que el texto suene a institución y no a recado.',
    marcadores: [['vamos aceitar', 'aceitar-se-ão'], ['fica para', 'transitará para']],
    datos: ['janeiro', 'dia 10 de cada mês'],
    modelo: 'A partir de janeiro, aceitar-se-ão inscrições apenas até ao dia 10 de cada mês. A inscrição entregue fora desse prazo transitará para o mês seguinte, sem prejuízo da ordem de entrada.',
    wordRange: [25, 55], register: 'formal',
  },
  {
    id: 'MED-09', concepto: MES, registroFuente: 'informal', registroDestino: 'solene',
    sourceText: 'Vamos mandar os resultados por email na próxima semana. Se alguém quiser ver a prova, é só pedir nos primeiros cinco dias.',
    audience: 'os candidatos, num comunicado oficial',
    instruccion: 'Escríbelo como comunicado. El futuro partido marca el registro; ponlo donde el texto lo pide y no en cada frase.',
    marcadores: [['Vamos mandar', 'Enviar-se-ão'], ['é só pedir', 'poderá ser requerida']],
    datos: ['próxima semana', 'cinco dias'],
    modelo: 'COMUNICADO — Enviar-se-ão os resultados por correio eletrónico na próxima semana. A consulta da prova poderá ser requerida nos primeiros cinco dias após a divulgação.',
    wordRange: [22, 50], register: 'formal',
  },
  {
    id: 'MED-10', concepto: MES, registroFuente: 'informal', registroDestino: 'solene',
    sourceText: 'Olha, no sábado vamos fechar a piscina de manhã para limpar o fundo. À tarde já dá para ir, e não vamos cobrar esse dia.',
    audience: 'os sócios, num aviso da direção do clube',
    instruccion: 'Hazlo aviso de la dirección. Recuerda que la mesóclise sólo cabe cuando nada la impide: si hay «não» delante, el clítico va antes.',
    marcadores: [['vamos fechar', 'encerrar-se-á'], ['não vamos cobrar', 'não se cobrará']],
    datos: ['sábado', 'de manhã'],
    modelo: 'AVISO — No sábado, encerrar-se-á a piscina durante a manhã para limpeza do fundo. O acesso será retomado à tarde e não se cobrará a utilização desse dia.',
    wordRange: [22, 50], register: 'formal',
  },
  {
    id: 'MED-11', concepto: MES, registroFuente: 'informal', registroDestino: 'solene',
    sourceText: 'A partir de outubro vamos dar os livros na primeira aula. Quem chegar depois tem de os pedir na secretaria.',
    audience: 'os encarregados de educação, numa comunicação da escola',
    instruccion: 'Pásalo a comunicación de la escuela. Cuidado con el segundo verbo: tras «quem» el clítico va delante y la mesóclise no cabe.',
    marcadores: [['vamos dar', 'distribuir-se-ão'], ['tem de os pedir', 'os deverá requerer']],
    datos: ['outubro', 'primeira aula'],
    modelo: 'A partir de outubro, distribuir-se-ão os manuais na primeira aula. O aluno que se inscrever depois dessa data os deverá requerer na secretaria, mediante impresso próprio.',
    wordRange: [22, 50], register: 'formal',
  },
  {
    id: 'MED-12', concepto: MES, registroFuente: 'informal', registroDestino: 'solene',
    sourceText: 'Vamos pôr as fotos do arraial no site para toda a gente ver. Quem não quiser aparecer, que diga até ao fim do mês.',
    audience: 'os moradores, num aviso da junta de freguesia',
    instruccion: 'Escríbelo como aviso de la junta. Un solo verbo partido basta: si los pones todos, suena a parodia.',
    marcadores: [['Vamos pôr', 'Publicar-se-ão'], ['que diga', 'deverá comunicá-lo']],
    datos: ['arraial', 'fim do mês'],
    modelo: 'AVISO — Publicar-se-ão no sítio da junta as fotografias do arraial. Quem não pretenda ver a sua imagem divulgada deverá comunicá-lo até ao fim do mês, por escrito ou presencialmente.',
    wordRange: [22, 50], register: 'formal',
  },

  // ── B · El arcaísmo jurídico: la destreza es saber CALLARLO ─────────
  {
    id: 'MED-13', concepto: ARC, registroFuente: 'solene', registroDestino: 'neutro',
    sourceText: 'Outrossim, cumpre esclarecer que o prazo de entrega se conta a partir da data do registo, e não da data da assinatura. Porquanto assim se estabeleceu em cláusula própria, não assiste ao requerente o direito a prorrogação.',
    audience: 'o teu cliente, uma senhora de setenta anos que não é jurista',
    instruccion: 'Explícaselo en portugués llano. Nada de fórmulas de escritura: la señora tiene que entender qué cuenta y desde cuándo.',
    marcadores: [['Outrossim', 'Além disso'], ['Porquanto', 'Como'], ['não assiste ao requerente o direito a', 'não tem direito a']],
    datos: ['data do registo', ['prorrogação', 'mais tempo']],
    modelo: 'Além disso, convém esclarecer que o prazo começa a contar na data do registo, e não na da assinatura. Como isso ficou escrito numa cláusula própria, não tem direito a pedir mais tempo.',
    wordRange: [25, 55], register: 'neutro',
  },
  {
    id: 'MED-14', concepto: ARC, registroFuente: 'solene', registroDestino: 'neutro',
    sourceText: 'Destarte, e não obstante o alegado, mantém-se o indeferimento. Doravante, todos os pedidos serão submetidos por via eletrónica, sendo liminarmente rejeitados os que derem entrada em papel.',
    audience: 'os colegas do departamento, num email interno',
    instruccion: 'Resúmeselo al equipo en un email normal. Lo que importa es qué cambia y desde cuándo, no el estilo del papel.',
    marcadores: [['Destarte', 'Portanto'], ['não obstante o alegado', 'apesar do que foi dito'], ['Doravante', 'A partir de agora']],
    datos: ['indeferimento', 'via eletrónica'],
    modelo: 'Portanto, e apesar do que foi dito, o indeferimento mantém-se. A partir de agora todos os pedidos entram por via eletrónica: os que chegarem em papel são recusados logo à entrada.',
    wordRange: [25, 55], register: 'neutro',
  },
  {
    id: 'MED-15', concepto: ARC, registroFuente: 'solene', registroDestino: 'informal',
    sourceText: 'Conquanto o contrato preveja a renovação automática, cumpre notificar a contraparte com trinta dias de antecedência, sob pena de caducidade. Amiúde se verifica que tal notificação é omitida.',
    audience: 'o teu irmão, que arrendou uma loja e não leu o contrato',
    instruccion: 'Dile lo que tiene que hacer y cuándo, como se lo dirías en la cocina. Sin una sola palabra de notario.',
    marcadores: [['Conquanto', 'Embora'], ['cumpre notificar', 'tens de avisar'], ['Amiúde se verifica', 'Acontece muitas vezes']],
    datos: ['trinta dias', ['renovação automática', 'renove sozinho']],
    modelo: 'Embora o contrato se renove sozinho, tens de avisar a outra parte com trinta dias de antecedência, senão perdes o direito. Acontece muitas vezes as pessoas esquecerem-se disso — marca já no calendário.',
    wordRange: [28, 58], register: 'informal', address: 'tu',
  },
  {
    id: 'MED-16', concepto: ARC, registroFuente: 'solene', registroDestino: 'neutro',
    sourceText: 'Não obstante a entrega tardia, e porquanto se demonstrou justo impedimento, defere-se o pedido. Outrossim, adverte-se de que idêntica tolerância não será concedida em futuras candidaturas.',
    audience: 'a candidata, numa carta que ela vai ler sozinha em casa',
    instruccion: 'Escríbelo para que se entienda a la primera: qué le conceden y qué le advierten. Que no parezca una sentencia.',
    marcadores: [['Não obstante', 'Apesar de', 'Apesar da'], ['porquanto', 'uma vez que'], ['Outrossim, adverte-se', 'Fica avisada']],
    datos: ['justo impedimento', 'futuras candidaturas'],
    modelo: 'Apesar da entrega fora de prazo, e uma vez que ficou provado o impedimento, o pedido foi aceite. Fica avisada de que em candidaturas futuras não haverá a mesma tolerância.',
    wordRange: [25, 55], register: 'neutro',
  },
  {
    id: 'MED-17', concepto: ARC, registroFuente: 'solene', registroDestino: 'informal',
    sourceText: 'Doravante, e sem prejuízo do disposto no artigo anterior, o utente deverá fazer-se acompanhar de documento de identificação, porquanto a entrada sem identificação não será consentida.',
    audience: 'a tua avó, que vai ao centro de saúde na terça',
    instruccion: 'Dile lo que tiene que llevar y por qué, en dos frases. Ni «doravante» ni «porquanto»: tu abuela no lee editais.',
    marcadores: [['Doravante', 'A partir de agora'], ['deverá fazer-se acompanhar de', 'tem de levar'], ['porquanto', 'porque']],
    datos: ['documento de identificação'],
    modelo: 'A partir de agora tem de levar sempre o cartão de identificação. Porque sem ele não a deixam entrar, e não vale a pena fazer a viagem para voltar para trás.',
    wordRange: [22, 50], register: 'informal', address: 'o_senhor',
  },
  {
    id: 'MED-18', concepto: ARC, registroFuente: 'solene', registroDestino: 'neutro',
    sourceText: 'Cumpre informar que, findo o prazo, se procederá à devolução das quantias, deduzidas as despesas de expediente. Outrossim, os interessados poderão requerer certidão, mediante o pagamento do respetivo emolumento.',
    audience: 'os participantes de um curso cancelado, num aviso no site',
    instruccion: 'Ponlo en el sitio web en lenguaje claro. Tienen que saber qué les devuelven y qué les descuentan.',
    marcadores: [['Cumpre informar', 'Informamos'], ['se procederá à devolução', 'devolvemos'], ['Outrossim', 'Também'], ['mediante o pagamento do respetivo emolumento', 'pagando uma taxa']],
    datos: ['despesas de expediente', 'certidão'],
    modelo: 'Informamos que, acabado o prazo, devolvemos o dinheiro, menos as despesas de expediente. Também pode pedir uma certidão, pagando uma taxa — o pedido faz-se no mesmo balcão.',
    wordRange: [25, 55], register: 'neutro',
  },
  // ── y la dirección contraria: el registro que SÍ pide el arcaísmo
  {
    id: 'MED-19', concepto: ARC, registroFuente: 'neutro', registroDestino: 'solene',
    sourceText: 'Recebemos a sua reclamação. Como também apresentou os recibos, vamos rever a conta. Mas o prazo para pedir juros já passou, por isso essa parte não entra.',
    audience: 'o reclamante, numa resposta oficial que fica no processo',
    instruccion: 'Redáctalo como respuesta oficial. Aquí el arcaísmo es la lengua del registro, no un adorno: usa el que corresponde a cada bisagra.',
    marcadores: [['Como também apresentou', 'Outrossim, tendo apresentado'], ['Mas', 'Não obstante'], ['por isso essa parte não entra', 'não pode a mesma ser atendida']],
    datos: ['recibos', 'juros'],
    modelo: 'Acusamos a receção da sua reclamação. Outrossim, tendo apresentado os recibos, procederá esta entidade à revisão da conta. Não obstante, encontra-se decorrido o prazo para peticionar juros, pelo que não pode a mesma ser atendida nessa parte.',
    wordRange: [28, 60], register: 'solene',
  },
  {
    id: 'MED-20', concepto: ARC, registroFuente: 'neutro', registroDestino: 'solene',
    sourceText: 'A partir de hoy la entrada es sólo por la puerta lateral. Y como la obra sigue, tampoco se puede aparcar en el patio hasta que acabe.',
    audience: 'os funcionários, num despacho interno que fica arquivado',
    instruccion: 'Pásalo a despacho interno, en portugués. Es el único ítem cuya fuente está en español: media la lengua además del registro.',
    marcadores: [['A partir de hoy', 'Doravante'], ['Y como la obra sigue', 'Porquanto se mantêm os trabalhos']],
    datos: ['puerta lateral', 'patio'],
    modelo: 'DESPACHO — Doravante, o acesso far-se-á exclusivamente pela porta lateral. Porquanto se mantêm os trabalhos em curso, fica igualmente vedado o estacionamento no pátio até à conclusão da empreitada.',
    wordRange: [22, 50], register: 'solene',
  },
  {
    id: 'MED-21', concepto: ARC, registroFuente: 'neutro', registroDestino: 'solene',
    sourceText: 'Pedimos desculpa pelo atraso. Como houve um problema informático, os certificados só saem na semana que vem. Quem tiver pressa pode pedir uma declaração provisória.',
    audience: 'os alunos, num aviso institucional afixado e publicado',
    instruccion: 'Escríbelo como aviso institucional. Y una advertencia: el registro pide arcaísmo, pero uno por bisagra — si los amontonas, suena a burla.',
    marcadores: [['Como houve', 'Porquanto ocorreu'], ['Quem tiver pressa pode pedir', 'poderá o interessado requerer']],
    datos: [['problema informático', 'anomalia informática'], 'declaração provisória'],
    modelo: 'Lamenta-se o atraso verificado. Porquanto ocorreu uma anomalia informática, a emissão dos certificados fica remetida para a próxima semana. Em caso de urgência, poderá o interessado requerer declaração provisória nos serviços académicos.',
    wordRange: [25, 58], register: 'solene',
  },
  {
    id: 'MED-22', concepto: ARC, registroFuente: 'neutro', registroDestino: 'solene',
    sourceText: 'Já respondemos duas vezes ao mesmo pedido. Como não veio nada novo, mantemos o que dissemos. Se quiser insistir, tem de apresentar provas.',
    audience: 'o requerente, num ofício que encerra o processo',
    instruccion: 'Redáctalo como oficio de cierre. Fíjate en que el registro cambia también la persona: el «nosotros» pasa a impersonal.',
    marcadores: [['Como não veio nada novo', 'Porquanto nada de novo foi aduzido'], ['mantemos o que dissemos', 'mantém-se o anteriormente decidido']],
    datos: ['duas vezes', ['provas', 'elementos probatórios']],
    modelo: 'Tendo já sido apreciado por duas vezes o mesmo pedido, e porquanto nada de novo foi aduzido, mantém-se o anteriormente decidido. Qualquer nova pretensão deverá vir acompanhada de elementos probatórios.',
    wordRange: [25, 55], register: 'solene',
  },
  {
    id: 'MED-23', concepto: ARC, registroFuente: 'neutro', registroDestino: 'solene',
    sourceText: 'Aprovámos a compra do material. Também decidimos que o pagamento é feito em duas vezes. E a partir de agora as faturas passam pelo gabinete jurídico.',
    audience: 'a ata da reunião, que assinam os presentes',
    instruccion: 'Escríbelo como acta. Aquí «outrossim» está en su casa: es la bisagra que enlaza dos deliberaciones.',
    marcadores: [['Também decidimos', 'Outrossim, deliberou-se'], ['a partir de agora', 'doravante']],
    datos: ['duas vezes', 'gabinete jurídico'],
    modelo: 'Foi aprovada a aquisição do material. Outrossim, deliberou-se que o pagamento se efetuará em duas prestações. Mais ficou assente que, doravante, as faturas serão remetidas ao gabinete jurídico antes do pagamento.',
    wordRange: [25, 55], register: 'solene',
  },
  {
    id: 'MED-24', concepto: ARC, registroFuente: 'neutro', registroDestino: 'solene',
    sourceText: 'Não aceitamos o pedido porque chegou fora de prazo. Mesmo assim, se aparecer alguma vaga, avisamos os que ficaram de fora.',
    audience: 'o candidato excluído, numa notificação escrita',
    instruccion: 'Notifícaselo por escrito, en registro oficial. Un solo arcaísmo bien puesto vale más que tres amontonados.',
    marcadores: [['Não aceitamos o pedido porque chegou', 'Indefere-se o pedido, porquanto deu entrada'], ['Mesmo assim', 'Sem prejuízo do exposto']],
    datos: ['fora de prazo', 'vaga'],
    modelo: 'Indefere-se o pedido, porquanto deu entrada fora do prazo fixado. Sem prejuízo do exposto, ocorrendo vaga, serão notificados os candidatos excluídos pela ordem em que se apresentaram.',
    wordRange: [22, 50], register: 'solene',
  },
];

// ── La rúbrica, DERIVADA ─────────────────────────────────────────────
export function rubricaDe(x: ItemMed): string[] {
  const r: string[] = [];
  for (const [de, a] of x.marcadores)
    r.push(`¿Sustituye «${de}» por «${a}» (o un equivalente del registro de destino)?`);
  for (const d of x.datos) r.push(`¿Traslada el dato «${literal(d)}»?`);
  r.push('¿NO añade ningún dato que la fuente no dé? (casilla negativa: se marca sólo si no inventa nada)');
  r.push('¿No copia más de 6 palabras seguidas de la fuente? (comprobable por script)');
  return r;
}

const palabras = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
const contiene = (texto: string, aguja: string) => norm(texto).includes(norm(aguja));
const literal = (d: string | string[]) => (Array.isArray(d) ? d[0]! : d);
const acepta = (d: string | string[]) => (Array.isArray(d) ? d : [d]);

/** n-gramas de 7 palabras compartidos entre modelo y fuente: la casilla
 *  verificable por script, que «vale por tres de juicio». */
export function copiaLarga(fuente: string, modelo: string, n = 7): string | null {
  const f = norm(fuente).split(' '), m = norm(modelo).split(' ');
  const set = new Set<string>();
  for (let i = 0; i + n <= f.length; i++) set.add(f.slice(i, i + n).join(' '));
  for (let i = 0; i + n <= m.length; i++) if (set.has(m.slice(i, i + n).join(' '))) return m.slice(i, i + n).join(' ');
  return null;
}

// ── Los gates: el MODELO cumple su propia rúbrica, casilla a casilla ──
export function verificar(items: ItemMed[]): string[] {
  const v: string[] = [];
  for (const x of items) {
    if (!x.marcadores.length) v.push(`${x.id}: sin marcadores — la rúbrica saldría vacía`);
    for (const [de, ...aceptadas] of x.marcadores) {
      if (!contiene(x.sourceText, de)) v.push(`${x.id}: el marcador «${de}» NO está en la fuente`);
      if (contiene(x.modelo, de)) v.push(`${x.id}: el modelo conserva «${de}», que la consigna manda cambiar`);
      if (!aceptadas.some((a) => contiene(x.modelo, a)))
        v.push(`${x.id}: el modelo no trae ninguna de «${aceptadas.join(' / ')}», que es lo que la casilla exige`);
    }
    for (const d of x.datos) {
      if (!contiene(x.sourceText, literal(d)))
        v.push(`${x.id}: el dato «${literal(d)}» NO está en la fuente — la casilla exigiría algo que la fuente no da`);
      // Un dato puede reformularse: se acepta el literal o cualquiera de
      // sus paráfrasis declaradas, y dentro de cada una basta con una
      // palabra de contenido.
      const ok = acepta(d).some((forma) => {
        const clave = palabras(forma).filter((w) => w.length > 3).map(norm);
        return clave.length ? clave.some((w) => norm(x.modelo).includes(w)) : contiene(x.modelo, forma);
      });
      if (!ok) v.push(`${x.id}: el modelo no traslada «${literal(d)}» — el trasvase rúbrica↔gold roto, que es la clase que mató al lote de 44`);
    }
    const n = palabras(x.modelo).length;
    if (n < x.wordRange[0] || n > x.wordRange[1])
      v.push(`${x.id}: el modelo tiene ${n} palabras y el rango es ${x.wordRange[0]}-${x.wordRange[1]}`);
    // Los DATOS se copian por obligación —son lo que tiene que
    // sobrevivir—, así que se enmascaran antes de buscar plagio. Sin
    // esto el gate castigaba «entre 4 e 15 de março», que es justo lo
    // que la rúbrica exige trasladar.
    const enmascarar = (t: string) => x.datos.reduce<string>((acc, d) => acc.split(literal(d)).join(' ◻ '), t);
    const copia = copiaLarga(enmascarar(x.sourceText), enmascarar(x.modelo));
    if (copia) v.push(`${x.id}: el modelo copia 7 palabras seguidas de la fuente — «${copia}»`);
    if (!x.instruccion.trim() || !x.audience.trim()) v.push(`${x.id}: sin consigna o sin destinatario`);
  }
  // Variedad: si todas las fuentes son del mismo género, el lote es una
  // plantilla repetida. Es la cicatriz «variar taskType×fuente».
  const porConcepto = new Map<string, Set<string>>();
  for (const x of items) {
    const s = porConcepto.get(x.concepto) ?? new Set<string>();
    s.add(`${x.registroFuente}→${x.registroDestino}`);
    porConcepto.set(x.concepto, s);
  }
  for (const [c, dirs] of porConcepto)
    if (dirs.size < 2) v.push(`${c}: todos los ítems van en la misma dirección de registro (${[...dirs]}) — el punto es una ELECCIÓN y con una sola dirección vuelve a ser una regla`);
  return v;
}

if (process.argv[1]?.includes('lote12-mediacion')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2)); process.exit(v.length ? 1 : 0); }
  console.log(`# Lote 12 — mediación industrial · ${ITEMS.length} ítems\n`);
  for (const c of [MES, ARC]) {
    const xs = ITEMS.filter((x) => x.concepto === c);
    const dirs = new Map<string, number>();
    for (const x of xs) dirs.set(`${x.registroFuente}→${x.registroDestino}`, (dirs.get(`${x.registroFuente}→${x.registroDestino}`) ?? 0) + 1);
    console.log(`- \`${c}\`: **${xs.length}** ítems · direcciones: ${[...dirs].map(([d, n]) => `${d} ×${n}`).join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio. Cada marcador está en la fuente y NO en el modelo; cada sustituto SÍ está en el modelo;');
  console.log('cada dato está en la fuente y se traslada; ningún modelo copia 7 palabras seguidas; todos caben');
  console.log('en su rango; y los dos puntos llevan las DOS direcciones de registro.');
  console.log(`\n## Ejemplo de rúbrica derivada (${ITEMS[0]!.id})\n`);
  for (const c of rubricaDe(ITEMS[0]!)) console.log(`- [ ] ${c}`);
}

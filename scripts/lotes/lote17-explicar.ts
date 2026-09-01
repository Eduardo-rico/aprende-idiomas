// scripts/lotes/lote17-explicar.ts
//
//   npx tsx scripts/lotes/lote17-explicar.ts            # doc + gates
//   npx tsx scripts/lotes/lote17-explicar.ts --json     # ítems para publicar
//
// LOTE 17 · pasada 4 de mediación, y la primera de la familia EXPLICAR.
//
// 22 unidades exactas en cuatro puntos: 6 + 8 + 4 + 4, que es el hueco
// medido de cada uno. Ninguno se podía hacer con la
// plantilla de registro: en «ironía y understatement» no hay marcador que
// sustituir, hay un efecto que el hispanohablante no ve. Lo que el alumno
// produce es una explicación para alguien que no la tiene, y lo que la
// califica son los PUNTOS CLAVE declarados.
import {
  rubricaDe, verificar, inventadosProbables, type ItemExplica,
} from '../lib/explicar-mediacion';

const IRO = 'b11-ironia-understatement';
const ALU = 'b11-alusao-cultural';
const JOG = 'b12-humor-jogo-palavras';
const POS = 'b12-ler-posicao-social';

export const ITEMS: ItemExplica[] = [
  // ── A · Ironía y understatement ──────────────────────────────────
  // El punto es que el hispanohablante OYE la frase y entiende lo
  // contrario de lo que significa. Explicarla es la prueba de que la vio.
  {
    id: 'EXP-17-01', concepto: IRO, lenguaExplicacion: 'es',
    sourceText: '— Então, gostaste do jantar? — Olha, não estava mau.',
    audience: 'un amigo mexicano que se quedó preocupado, porque cree que la comida estuvo regular',
    instruccion: 'Explícale por qué su lectura es la contraria de la que se dijo, y qué habría dicho un portugués si la cena hubiera estado regular de verdad.',
    puntosClave: [
      { dice: 'que «não estava mau» es un elogio, no una queja', ancla: ['es un elogio'] },
      { dice: 'que el portugués atenúa el elogio en vez de exagerarlo', ancla: ['rebaja el elogio'] },
      { dice: 'que para decir que estuvo mal se diría otra cosa', ancla: ['habría cambiado de tema'] },
    ],
    modelo: 'Cuidado, que te lo tomaste al revés: «não estava mau» es un elogio y bastante claro. El portugués rebaja el elogio en lugar de subirlo, así que decir que algo «no estaba mal» equivale a decir que estaba muy bueno. Si la cena hubiera estado regular de verdad, tu amigo no habría dicho eso: habría cambiado de tema o habría hablado del sitio y no de la comida.',
    wordRange: [45, 100], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-17-02', concepto: IRO, lenguaExplicacion: 'es',
    sourceText: 'Estivemos três horas à espera. Enfim, uma tarde muito bem passada.',
    audience: 'una compañera que está traduciendo el texto y lo va a poner en positivo',
    instruccion: 'Explícale qué hace el «enfim» y por qué traducir la frase literalmente destruiría el sentido.',
    puntosClave: [
      { dice: 'que la frase es irónica y significa lo contrario', ancla: ['lo contrario de lo que parece', 'es sarcasmo'] },
      { dice: 'que el «enfim» es la señal que marca la ironía', ancla: ['«enfim» es la señal'] },
      { dice: 'que traducirla en positivo perdería el sentido', ancla: ['Si lo traduces literal'] },
    ],
    modelo: 'No la pongas en positivo: la frase dice justo lo contrario de lo que parece. Después de tres horas de espera, llamar a eso una tarde bien aprovechada es sarcasmo, y el «enfim» es la señal que lo marca — funciona como un «en fin» resignado que avisa de que viene la puñalada. Si lo traduces literal, el lector entiende que lo pasaron bien.',
    wordRange: [45, 100], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-03', concepto: IRO, lenguaExplicacion: 'pt',
    sourceText: '— O relatório está pronto? — Está quase, quase. Falta só passá-lo a limpo, e escrevê-lo.',
    audience: 'um colega brasileiro que ficou tranquilo, porque entendeu que falta pouco',
    instruccion: 'Explica-lhe em português onde está a piada e o que a frase realmente informa sobre o estado do relatório.',
    puntosClave: [
      { dice: 'que o relatório não está começado', ancla: ['nem começou'] },
      { dice: 'que a ordem das duas tarefas é o que faz a piada', ancla: ['Repara na ordem', 'A piada está aí'] },
      { dice: 'que quem responde está a admitir isso sem o dizer', ancla: ['confessar sem confessar'] },
    ],
    modelo: 'Não te fiques pelo «está quase». Repara na ordem: primeiro passá-lo a limpo e só depois escrevê-lo — ora, se ainda falta escrever, não há nada para passar a limpo. A piada está aí, e serve para confessar sem confessar: o relatório nem começou. Quem responde sabe-o e prefere dizê-lo a rir.',
    wordRange: [40, 95], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-17-04', concepto: IRO, lenguaExplicacion: 'es',
    sourceText: 'O senhor engenheiro, com a sua reconhecida paciência, esperou vinte minutos antes de desligar o telefone à cliente.',
    audience: 'un lector español que entendió que el ingeniero se portó bien',
    instruccion: 'Explícale qué hace el elogio dentro de esa frase y contra quién va.',
    puntosClave: [
      { dice: 'que el elogio es irónico y va contra el ingeniero', ancla: ['se está riendo del ingeniero'] },
      { dice: 'que colgar el teléfono contradice la paciencia elogiada', ancla: ['le colgó el teléfono', 'desmiente a la otra'] },
      { dice: 'que la ironía nace del choque entre el elogio y el hecho', ancla: ['el choque'] },
    ],
    modelo: 'El elogio no es un elogio: el narrador se está riendo del ingeniero. Fíjate en el choque — lo alaba por su reconocida paciencia y a renglón seguido cuenta que le colgó el teléfono a una clienta. Una cosa desmiente a la otra, y ahí está la crítica: cuanto más solemne suena la alabanza, más dura es. En español haría falta marcarlo, porque leído en serio parece un cumplido.',
    wordRange: [45, 100], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-05', concepto: IRO, lenguaExplicacion: 'pt',
    sourceText: '— Correu bem a reunião? — Correu. Não me mandaram embora.',
    audience: 'uma colega que quer saber se pode contar com a aprovação do projeto',
    instruccion: 'Explica-lhe em português o que a resposta diz de verdade sobre a reunião, e porquê.',
    puntosClave: [
      { dice: 'que a reunião correu mal', ancla: ['correu mal'] },
      { dice: 'que baixar a fasquia ao mínimo é a forma de o dizer', ancla: ['baixa a fasquia'] },
      { dice: 'que não há aprovação nenhuma', ancla: ['Não contes com a aprovação'] },
    ],
    modelo: 'Não contes com a aprovação. Repara no que ele dá como bom: não ter sido posto na rua. Quando alguém baixa a fasquia até esse ponto para dizer que correu bem, está a dizer que correu mal e a poupar-te o relatório. Se houvesse aprovação, seria a primeira coisa que diria.',
    wordRange: [40, 90], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-17-06', concepto: IRO, lenguaExplicacion: 'es',
    sourceText: 'Foi uma obra rápida: só levou dois anos mais do que estava previsto.',
    audience: 'un periodista español que quiere citar la frase como dato',
    instruccion: 'Explícale por qué no puede citarla como dato y qué información sí contiene.',
    puntosClave: [
      { dice: 'que la frase es irónica y no un dato neutro', ancla: ['es una pulla', 'lo contrario de un elogio'] },
      { dice: 'que el «só» es la señal de la ironía', ancla: ['el «só»'] },
      { dice: 'que el dato real es el retraso, no la rapidez', ancla: ['El único dato citable'] },
    ],
    modelo: 'No la cites como si fuera una valoración: es una pulla. Llamar rápida a una obra y añadir a continuación que se pasó del plazo es lo contrario de un elogio, y el «só» —ese «sólo» minimizador— es la señal que lo marca. El único dato citable de ahí es el retraso; la rapidez es exactamente lo que el autor está negando.',
    wordRange: [45, 100], register: 'neutro', address: 'tu',
  },

  // ── B · Alusión cultural ─────────────────────────────────────────
  // Un texto adulto da por sabidas cosas que el lector extranjero no
  // tiene. Explicarlas es mediación, y sin ellas el texto es opaco.
  {
    id: 'EXP-17-07', concepto: ALU, lenguaExplicacion: 'es',
    sourceText: 'Depois do 25 de Abril, a avó dela deixou de guardar o açúcar no fundo do armário.',
    audience: 'un lector mexicano que no sabe qué pasó ese día ni por qué guardaba azúcar',
    instruccion: 'Explícale la alusión y qué dice el detalle del azúcar sobre la vida anterior.',
    puntosClave: [
      { dice: 'que el 25 de Abril de 1974 es la revolución que acabó con la dictadura', ancla: ['cincuenta años de dictadura', '1974'] },
      { dice: 'que antes había escasez y se escondían los alimentos', ancla: ['había escasez'] },
      { dice: 'que el detalle del azúcar muestra el cambio sin nombrarlo', ancla: ['sin decir nunca la palabra miedo'] },
    ],
    modelo: 'El 25 de Abril es el 25 de abril de 1974, el día en que un golpe militar sin apenas sangre acabó con casi cincuenta años de dictadura en Portugal. Cualquier lector portugués lo tiene incorporado, igual que tú tienes otras fechas. Y el azúcar no es un capricho: en aquellos años había escasez y la gente escondía lo que conseguía. Por eso el detalle vale por un párrafo entero — cuenta que la abuela dejó de tener miedo sin decir nunca la palabra miedo.',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-08', concepto: ALU, lenguaExplicacion: 'es',
    sourceText: 'Cantava fado como quem paga uma dívida antiga, e ninguém no Bairro Alto lhe pedia bis.',
    audience: 'una lectora española que entendió que cantaba mal',
    instruccion: 'Explícale la alusión al fado y por qué nadie pide bis, que no es lo que ella cree.',
    puntosClave: [
      { dice: 'que el fado no es un espectáculo que se aplauda a mitad', ancla: ['se escucha en silencio'] },
      { dice: 'que no pedir bis es respeto, no rechazo', ancla: ['no es un desaire'] },
      { dice: 'que el Bairro Alto es un barrio de Lisboa donde se canta fado', ancla: ['el barrio de Lisboa'] },
    ],
    modelo: 'No cantaba mal: al revés. El fado se escucha en silencio y no se interrumpe — en las casas de fado hasta se apagan las luces y se calla el que habla. Que nadie le pidiera bis no es un desaire sino lo contrario, la señal de que se respetó lo que hizo. El Bairro Alto, además, es el barrio de Lisboa donde eso ocurre cada noche, así que la frase sitúa a la cantante entre quien sabe escuchar.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-09', concepto: ALU, lenguaExplicacion: 'es',
    sourceText: 'O tio voltou de Angola em setenta e cinco, com duas malas e sem uma palavra sobre o que lá deixou.',
    audience: 'un lector argentino que no sabe por qué volvió ni de dónde',
    instruccion: 'Explícale qué ocurrió y por qué el silencio del tío es parte de lo que la frase cuenta.',
    puntosClave: [
      { dice: 'que Angola fue colonia portuguesa hasta su independencia', ancla: ['colonia portuguesa'] },
      { dice: 'que en esos años volvieron a Portugal cientos de miles de personas', ancla: ['cientos de miles de personas', 'retornados'] },
      { dice: 'que el silencio es un rasgo reconocible de esa generación', ancla: ['toda esa generación'] },
    ],
    modelo: 'Angola fue colonia portuguesa hasta que se independizó, y en aquellos meses regresaron a Portugal cientos de miles de personas que habían nacido o vivido allí toda su vida. Se les llama retornados y llegaron casi sin nada, como el tío con sus dos maletas. El silencio tampoco es un rasgo suyo: es el de toda esa generación, que rehízo su vida sin contar lo que había perdido. La frase se apoya en eso y por eso no necesita explicarlo a un lector portugués.',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-10', concepto: ALU, lenguaExplicacion: 'pt',
    sourceText: 'Explicou-lhe tudo com aquela paciência de quem já esteve do outro lado do balcão da troika.',
    audience: 'um colega brasileiro que não sabe o que foi a troika em Portugal',
    instruccion: 'Explica-lhe em português a alusão e o que ela diz sobre a personagem.',
    puntosClave: [
      { dice: 'que a troika foi o resgate financeiro e a austeridade que se lhe seguiu', ancla: ['resgate financeiro', 'austeridade'] },
      { dice: 'que «do outro lado do balcão» significa ter sofrido as medidas', ancla: ['sofreu essas medidas'] },
      { dice: 'que por isso a personagem tem paciência com quem passa por isso', ancla: ['É daí que vem a paciência'] },
    ],
    modelo: 'A troika foi o conjunto de credores que entrou em Portugal com o resgate financeiro, e o nome ficou a designar os anos de austeridade que se lhe seguiram: cortes, desemprego, filas. Dizer que alguém esteve do outro lado do balcão é dizer que sofreu essas medidas em vez de as aplicar. É daí que vem a paciência: quem passou por aquilo reconhece quem está a passar agora.',
    wordRange: [50, 110], register: 'neutro', address: 'tu',
  },

  {
    id: 'EXP-17-19', concepto: ALU, lenguaExplicacion: 'es',
    sourceText: 'Leu-lhe o poema do menino da sua mãe e nenhum dos dois conseguiu acabar o jantar.',
    audience: 'un lector chileno que no entiende por qué un poema arruina una cena',
    instruccion: 'Explícale de qué poema se trata, qué cuenta y por qué la alusión basta para producir ese efecto.',
    puntosClave: [
      { dice: 'que es un poema de Pessoa sobre un soldado muerto', ancla: ['Pessoa'] },
      { dice: 'que el poema está dicho desde la madre que no sabe que murió', ancla: ['donde lo esperan todavía', 'lo esperan'] },
      { dice: 'que la alusión funciona porque el lector portugués lo tiene memorizado', ancla: ['lo saben de memoria', 'de memoria'] },
    ],
    modelo: 'El poema es de Fernando Pessoa y trata de un soldado muy joven que yace muerto en un llano, con la sangre marcándole el uniforme y, caída del bolsillo, la pitillera que le había dado su madre. El título lo llama el niño de su madre, y el peso del poema está ahí: en la casa donde lo esperan todavía. En Portugal se estudia en la escuela y muchos adultos lo saben de memoria, así que nombrarlo trae encima todo eso sin citar un verso — por eso a los dos se les quita el hambre.',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-20', concepto: ALU, lenguaExplicacion: 'es',
    sourceText: 'O pai fazia contas em escudos até morrer, e ninguém em casa se atrevia a corrigi-lo.',
    audience: 'una lectora joven que no sabe qué es un escudo ni por qué nadie le corregía',
    instruccion: 'Explícale qué era el escudo y qué dice de ese hombre seguir contando así.',
    puntosClave: [
      { dice: 'que el escudo era la moneda portuguesa antes del euro', ancla: ['antes del euro', 'la moneda portuguesa'] },
      { dice: 'que mucha gente mayor siguió calculando en escudos durante años', ancla: ['siguió calculando', 'gente mayor'] },
      { dice: 'que no corregirle es una forma de respeto, no de descuido', ancla: ['una forma de respeto'] },
    ],
    modelo: 'El escudo era la moneda portuguesa antes del euro, que entró en 2002. Mucha gente mayor siguió calculando en escudos durante años, sobre todo para las cosas grandes: una casa, un coche, un sueldo. Que nadie en casa le corrigiera no es descuido — es una forma de respeto muy reconocible, la de dejar a alguien vivir en su medida del mundo. La frase cuenta eso sin decirlo.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-21', concepto: ALU, lenguaExplicacion: 'pt',
    sourceText: 'Chamavam-lhe o engenheiro, embora nunca tivesse acabado o curso, e ele nunca desmentiu ninguém.',
    audience: 'um colega brasileiro que não percebe porque é que o tratamento importa tanto',
    instruccion: 'Explica-lhe em português o que os títulos fazem em Portugal e o que o silêncio da personagem revela.',
    puntosClave: [
      { dice: 'que em Portugal os títulos académicos se usam como tratamento diário', ancla: ['tratamento', 'no dia a dia'] },
      { dice: 'que o título dá posição social e não só profissão', ancla: ['posição social'] },
      { dice: 'que não desmentir é aceitar essa posição sem a reclamar', ancla: ['sem a reclamar', 'aceitar'] },
    ],
    modelo: 'Em Portugal os títulos académicos usam-se como tratamento no dia a dia: chama-se doutor ou engenheiro a alguém em vez do nome, e isso ouve-se no café e ao balcão. O título não indica só a profissão — dá posição social, e quem o recebe fica situado acima de quem o dá. Por isso o silêncio dele diz tanto: ao não desmentir, está a aceitar essa posição sem a reclamar, que é a maneira mais cómoda de a manter.',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-22', concepto: ALU, lenguaExplicacion: 'es',
    sourceText: 'Voltaram da emigração com a casa feita na aldeia e ninguém para a habitar.',
    audience: 'un lector peruano que no ve qué tiene de particular esa casa',
    instruccion: 'Explícale a qué emigración alude la frase y por qué esas casas están vacías.',
    puntosClave: [
      { dice: 'que entre los años sesenta y setenta emigraron cientos de miles de portugueses', ancla: ['emigraron', 'cientos de miles'] },
      { dice: 'que muchos construían una casa en el pueblo con lo ahorrado fuera', ancla: ['construían una casa', 'con lo ahorrado'] },
      { dice: 'que los hijos ya no volvieron a vivir allí', ancla: ['los hijos'] },
    ],
    modelo: 'Alude a la emigración de los años sesenta y setenta, cuando cientos de miles de portugueses se fueron a Francia y a Alemania, muchos de ellos a pie y sin papeles. Casi todos construían una casa en el pueblo con lo ahorrado fuera, y esas casas se levantaron para una vuelta que se fue aplazando. Los hijos crecieron allá y ya no volvieron a vivir aquí. Por eso hay pueblos enteros de casas nuevas y cerradas, y la frase cuenta esa historia en una línea.',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },

  // ── C · Humor y juego de palabras (C2) ───────────────────────────
  {
    id: 'EXP-17-11', concepto: JOG, lenguaExplicacion: 'es',
    sourceText: '— O meu marido é um santo. — Coitada, também tenho um em casa que não faz nada.',
    audience: 'un amigo colombiano que no le ve la gracia',
    instruccion: 'Explícale dónde está el chiste: qué dos lecturas tiene la palabra y cómo la segunda mujer aprovecha una para responder a la otra.',
    puntosClave: [
      { dice: 'que «santo» significa a la vez hombre bondadoso e imagen de yeso', ancla: ['una figura de yeso'] },
      { dice: 'que la segunda mujer contesta a la lectura literal', ancla: ['agarrándose a la otra'] },
      { dice: 'que el chiste está en pasar de una lectura a la otra', ancla: ['El salto de un sentido al otro'] },
    ],
    modelo: 'La palabra tiene dos lecturas: un hombre bondadoso y una figura de yeso de las que hay en las iglesias. La primera mujer usa la primera; la segunda le contesta agarrándose a la otra, y de ahí sale que en su casa también hay uno y que no hace nada — que es lo que hacen las figuras. El salto de un sentido al otro es todo el chiste, y por eso no sobrevive traducido si la palabra elegida no tiene las dos lecturas.',
    wordRange: [50, 110], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-17-12', concepto: JOG, lenguaExplicacion: 'es',
    sourceText: 'Ao balcão: — Um copo de água, se faz favor. — Com gás? — Não, com pressa.',
    audience: 'una amiga que tradujo el diálogo y le quedó sin gracia',
    instruccion: 'Explícale qué estructura hace el chiste y por qué su traducción lo pierde.',
    puntosClave: [
      { dice: 'que el camarero pregunta por el tipo de agua', ancla: ['qué tipo de agua quiere'] },
      { dice: 'que el cliente responde a la preposición y no a la pregunta', ancla: ['se agarra a la preposición'] },
      { dice: 'que el chiste depende de que las dos respuestas empiecen igual', ancla: ['empiecen exactamente igual'] },
    ],
    modelo: 'El camarero pregunta qué tipo de agua quiere, y la respuesta esperada es sí o no. El cliente, en cambio, se agarra a la preposición: mantiene el «com» y le cuelga otra cosa, de modo que deja de hablar del agua y pasa a hablar de sí mismo. El chiste vive de que las dos respuestas empiecen exactamente igual, así que sólo funciona en una lengua donde esa preposición sirva para las dos cosas — si al traducir cambias una de las dos, se cae.',
    wordRange: [50, 115], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-17-13', concepto: JOG, lenguaExplicacion: 'pt',
    sourceText: 'A professora perguntou o que era um paradoxo. O aluno respondeu: dois médicos.',
    audience: 'uma colega espanhola que não percebeu a resposta do aluno',
    instruccion: 'Explica-lhe em português como o aluno partiu a palavra e porque é que a piada não passa para espanhol.',
    puntosClave: [
      { dice: 'que o aluno partiu a palavra em duas', ancla: ['partiu a palavra ao meio'] },
      { dice: 'que a segunda parte soa como a palavra que designa quem cura', ancla: ['designa quem cura'] },
      { dice: 'que em espanhol a palavra não se parte da mesma maneira', ancla: ['não se deixa partir assim'] },
    ],
    modelo: 'O aluno não respondeu à pergunta: partiu a palavra ao meio e leu cada metade como se fosse outra coisa. A primeira metade dá a ideia de par, de dois, e a segunda soa como a palavra que designa quem cura. Juntando as duas leituras saem os dois médicos. Em espanhol a palavra existe, mas não se deixa partir assim, e por isso a piada não passa — teria de se procurar outra que se partisse do mesmo modo.',
    wordRange: [50, 115], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-17-14', concepto: JOG, lenguaExplicacion: 'es',
    sourceText: 'Reclamação no livro amarelo: «O empregado foi impecável. O peixe também tinha sido, em vida.»',
    audience: 'un lector español que leyó la frase como un elogio doble',
    instruccion: 'Explícale qué hace el «tinha sido» y contra qué va la queja.',
    puntosClave: [
      { dice: 'que la segunda frase es una queja, no un elogio', ancla: ['Sólo la primera es un elogio'] },
      { dice: 'que el pluscuamperfecto sitúa la calidad en el pasado', ancla: ['un pasado que ya terminó'] },
      { dice: 'que la queja va contra la frescura del pescado, no contra el camarero', ancla: ['va contra la cocina'] },
    ],
    modelo: 'Sólo la primera es un elogio. En la segunda, el tiempo verbal hace todo el trabajo: al decir que el pescado también lo había sido, y añadir «en vida», el cliente coloca esa cualidad en un pasado que ya terminó. Es decir, que llegó a la mesa en un estado que no invita a hablar de frescura. La queja va contra la cocina y no contra el camarero, a quien de paso deja bien parado — que es lo que la vuelve elegante.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },

  // ── D · Leer la posición social por el habla (C2) ────────────────
  {
    id: 'EXP-17-15', concepto: POS, lenguaExplicacion: 'es',
    sourceText: '— O senhor doutor deseja mais alguma coisa? — Não, obrigado, minha senhora. Traga só a conta, se não se importa.',
    audience: 'un estudiante que cree que los dos se tratan con la misma cortesía',
    instruccion: 'Explícale qué dice cada tratamiento sobre quién es cada uno y por qué no es simétrico.',
    puntosClave: [
      { dice: 'que «senhor doutor» marca respeto hacia arriba', ancla: ['reconocimiento de posición'] },
      { dice: 'que «minha senhora» es cortés pero no reconoce título', ancla: ['no le atribuye ningún título'] },
      { dice: 'que la relación es asimétrica pese a ser cordial', ancla: ['Ahí está la asimetría', 'no están al mismo nivel'] },
    ],
    modelo: 'Los dos son corteses, pero no están al mismo nivel. Ella le da «senhor doutor», que en Portugal se usa con quien tiene estudios superiores y funciona como reconocimiento de posición, no sólo como educación. Él responde con «minha senhora», que es amable y no le atribuye ningún título ni oficio. Ahí está la asimetría: uno recibe un tratamiento que sitúa, el otro recibe uno que sólo respeta. El «se não se importa» suaviza la orden, pero no iguala nada.',
    wordRange: [50, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-16', concepto: POS, lenguaExplicacion: 'es',
    sourceText: '— Ó menina, isso é para levar? — Se faz favor, trate-me por você ou pelo meu nome.',
    audience: 'una lectora que cree que la segunda persona se enfadó sin motivo',
    instruccion: 'Explícale qué hace el «menina» aquí y por qué la respuesta no es una exageración.',
    puntosClave: [
      { dice: 'que «menina» aplicado a una adulta la coloca en posición inferior', ancla: ['una posición inferior'] },
      { dice: 'que se usa sobre todo hacia mujeres jóvenes en el trabajo', ancla: ['empleadas jóvenes'] },
      { dice: 'que pedir otro tratamiento es reclamar posición, no enfadarse', ancla: ['reclamando el lugar que le corresponde'] },
    ],
    modelo: 'No es una exageración: es una corrección precisa. Llamar «menina» a una mujer adulta la coloca en una posición inferior, y en Portugal eso se oye sobre todo dirigido a empleadas jóvenes en tiendas y oficinas. Quien lo dice puede no pretender ofender, pero el tratamiento sitúa igual. Al pedir otro, ella no está molesta por la forma sino reclamando el lugar que le corresponde en la conversación — y lo hace con la fórmula más cortés que existe.',
    wordRange: [50, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-17', concepto: POS, lenguaExplicacion: 'pt',
    sourceText: '— Ele disse que «havemos de nos encontrar», e eu fiquei sem perceber se era um convite.',
    audience: 'um colega que quer saber se deve marcar o encontro ou esperar',
    instruccion: 'Explica-lhe em português o que essa fórmula diz sobre quem a usa e se é ou não um convite.',
    puntosClave: [
      { dice: 'que a fórmula é cordial mas não compromete', ancla: ['para não comprometer'] },
      { dice: 'que pertence a um registo cuidado, de gente que evita recusar', ancla: ['registo cuidado'] },
      { dice: 'que não se deve tratar como convite firme', ancla: ['não como um convite'] },
    ],
    modelo: 'Não marques nada com base nisso. A fórmula é cordial e serve precisamente para não comprometer: diz que seria bom e não diz quando. Pertence a um registo cuidado, o de quem prefere deixar a porta encostada a fechá-la na cara de alguém — em vez de recusar, adia sem data. Se ele quisesse mesmo encontrar-se contigo, teria proposto um dia. Trata aquilo como uma amabilidade e não como um convite.',
    wordRange: [50, 110], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-17-18', concepto: POS, lenguaExplicacion: 'es',
    sourceText: '— A gente vai lá amanhã. — Nós iremos amanhã, se o senhor não vir inconveniente.',
    audience: 'un estudiante que cree que las dos frases dicen lo mismo con otras palabras',
    instruccion: 'Explícale qué distingue a quien habla en cada una, sin dar a entender que una sea incorrecta.',
    puntosClave: [
      { dice: 'que las dos son portugués correcto', ancla: ['las dos son portugués correcto'] },
      { dice: 'que «a gente» pertenece al habla corriente y «nós» al registro cuidado', ancla: ['el habla corriente', 'registro cuidado'] },
      { dice: 'que el futuro y la fórmula de cortesía sitúan al segundo hablante', ancla: ['acaba de situar a quien habla'] },
    ],
    modelo: 'Ninguna de las dos está mal: las dos son portugués correcto y las dicen personas instruidas. Lo que cambia es dónde se coloca cada hablante. «A gente» con verbo en singular es el habla corriente, la de todos los días; «nós» con futuro sintético pertenece al registro cuidado y suena a escrito incluso dicho en voz alta. Y la fórmula final, que pide permiso al interlocutor tratándolo de usted, acaba de situar a quien habla: alguien que se dirige hacia arriba y lo marca.',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },
];

if (process.argv[1]?.includes('lote17-explicar')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Lote 17 — mediación EXPLICAR, pasada 4 · ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | lengua de la explicación |');
  console.log('|---|---:|---|');
  for (const c of [IRO, ALU, JOG, POS]) {
    const xs = ITEMS.filter((x) => x.concepto === c);
    const l = new Map<string, number>();
    for (const x of xs) l.set(x.lenguaExplicacion, (l.get(x.lenguaExplicacion) ?? 0) + 1);
    console.log(`| \`${c}\` | ${xs.length} | ${[...l].map(([k, n]) => `${k} ×${n}`).join(' · ')} |`);
  }
  const sos = ITEMS.map((x) => [x.id, inventadosProbables(x)] as const).filter(([, w]) => w.length);
  if (sos.length) {
    console.log(`\n## Comprobar · datos que el modelo APORTA y la fuente no da\n`);
    console.log('En esta familia aportar información ES la tarea, así que la lista no');
    console.log('señala invención: señala **lo que hay que verificar que sea cierto**.');
    console.log('Un nombre de autor, una fecha o un país mal puestos aquí se publican');
    console.log('como enseñanza. Es lo contrario del aviso homónimo de la familia de');
    console.log('registro, donde cualquier dato nuevo es sospechoso por definición.\n');
    for (const [id, w] of sos) console.log(`- ${id}: ${w.join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
  console.log(`\n## Ejemplo de rúbrica derivada (${ITEMS[0]!.id})\n`);
  for (const c of rubricaDe(ITEMS[0]!)) console.log(`- [ ] ${c}`);
}

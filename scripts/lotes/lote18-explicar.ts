// scripts/lotes/lote18-explicar.ts
//
//   npx tsx scripts/lotes/lote18-explicar.ts            # doc + gates
//   npx tsx scripts/lotes/lote18-explicar.ts --json     # ítems para publicar
//
// LOTE 18 · pasada 5 de mediación. 20 unidades exactas: 8 + 6 + 6.
//
// Una nota sobre las fuentes de `b12-sintaxe-literaria`: son frases
// CONSTRUIDAS en registro literario, no citas. Se decidió así a
// propósito. Citar de memoria a Eça o a Garrett es la manera conocida de
// publicar una cita falsa —ya pasó dos veces en esta ola— y aquí lo que
// se enseña es la licencia sintáctica, que una frase construida exhibe
// igual de bien y con la ventaja de aislar el rasgo. Cuando el punto
// pida autor, se cita del corpus de lecturas, que está verificado.
import {
  rubricaDe, verificar, inventadosProbables, type ItemExplica,
} from '../lib/explicar-mediacion';

const HUM = 'b11-humor-autodepreciativo';
const CON = 'b12-concordancia-discutida';
const SIN = 'b12-sintaxe-literaria';

export const ITEMS: ItemExplica[] = [
  // ── A · Humor autodepreciativo ───────────────────────────────────
  // El movimiento existe para crear vínculo. Las dos maneras de
  // estropearlo son consolar y darle la razón con entusiasmo.
  {
    id: 'EXP-18-01', concepto: HUM, lenguaExplicacion: 'es',
    sourceText: '— Vocês têm um país lindo. — Temos, temos. Pena é o resto.',
    audience: 'una turista mexicana que se quedó cortada y no supo qué contestar',
    instruccion: 'Explícale qué hizo su interlocutor con esa respuesta y qué se espera que ella conteste.',
    puntosClave: [
      { dice: 'que la queja no busca que se le dé la razón', ancla: ['pidiendo que le dieras la razón'] },
      { dice: 'que es una forma de rebajar el elogio y crear cercanía', ancla: ['movimiento de cercanía'] },
      { dice: 'que consolarlo o darle la razón con entusiasmo son las dos maneras de fallar', ancla: ['las dos maneras de fallar', 'consolar'] },
    ],
    modelo: 'No te estaba pidiendo que le dieras la razón ni que lo consolaras. Rebajar el elogio al propio país es un movimiento de cercanía: quita solemnidad y te invita a hablar de tú a tú. Consolarlo suena a extranjero educado, y darle la razón con entusiasmo suena a que estás de acuerdo en que el país es un desastre — ésas son las dos maneras de fallar. Lo que se espera es que sigas la broma con algo tuyo del mismo tono.',
    wordRange: [50, 115], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-18-02', concepto: HUM, lenguaExplicacion: 'es',
    sourceText: '— Parabéns pelo prémio! — Ah, isso deram a toda a gente. Até a mim.',
    audience: 'un colega que quiere saber si el premio tiene valor o no',
    instruccion: 'Explícale qué hace esa respuesta y por qué no puede deducir de ella nada sobre el premio.',
    puntosClave: [
      { dice: 'que quitarse mérito es una fórmula de cortesía, no una evaluación', ancla: ['fórmula de cortesía', 'no es una evaluación'] },
      { dice: 'que el «até a mim» es la marca de la autoironía', ancla: ['«até a mim»'] },
      { dice: 'que del premio no se puede concluir nada por esa respuesta', ancla: ['no puedes concluir nada', 'no deduzcas'] },
    ],
    modelo: 'No deduzcas nada del premio por ahí. Quitarse mérito delante de quien felicita es una fórmula de cortesía en Portugal, casi obligatoria, y no es una evaluación de nada. El «até a mim» es la marca: se incluye a sí mismo en la lista de los indignos para que la broma no caiga sobre nadie más. Si quieres saber qué vale el premio, pregunta por él; esa frase sólo te dice que la persona sabe comportarse.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-03', concepto: HUM, lenguaExplicacion: 'pt',
    sourceText: '— Como é que aprendeste a cozinhar assim? — À força de comer mal o que eu próprio fazia.',
    audience: 'uma colega espanhola que percebeu a frase como uma queixa',
    instruccion: 'Explica-lhe em português o que a resposta faz e o que ela deve responder para não cortar a conversa.',
    puntosClave: [
      { dice: 'que a resposta é uma piada à custa de si próprio', ancla: ['à custa de si', 'piada'] },
      { dice: 'que serve para desviar o elogio sem o recusar', ancla: ['desviar o elogio'] },
      { dice: 'que a resposta esperada é seguir a brincadeira', ancla: ['sigas a brincadeira'] },
    ],
    modelo: 'Não é uma queixa: é uma piada à custa de si próprio. Serve para desviar o elogio sem o recusar — em vez de dizer «sim, cozinho bem», atribui o mérito a anos de comida má, e assim aceita o cumprimento sem se gabar. Se responderes com pena, cortas a conversa. O que se espera é que sigas a brincadeira, com uma história tua do mesmo género.',
    wordRange: [45, 110], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-18-04', concepto: HUM, lenguaExplicacion: 'es',
    sourceText: '— O senhor é o diretor? — Sou o que sobrou depois de todos dizerem que não.',
    audience: 'una estudiante que entendió que el hombre no quería el cargo',
    instruccion: 'Explícale qué hace ese hombre con su propio cargo y qué relación establece al decirlo.',
    puntosClave: [
      { dice: 'que se rebaja a sí mismo para rebajar la distancia jerárquica', ancla: ['la distancia', 'jerárquica'] },
      { dice: 'que no es una queja sobre el cargo', ancla: ['no es una queja'] },
      { dice: 'que la respuesta adecuada es tratarlo con normalidad, no con más respeto', ancla: ['con normalidad'] },
    ],
    modelo: 'No es una queja ni te está diciendo que no quería el puesto. Al presentarse como el que quedó cuando todos se negaron, rebaja la distancia jerárquica que la pregunta acababa de levantar — hace de director sin hacer de jefe. Y te está diciendo cómo quiere que sigas: con normalidad. Si a partir de ahí lo tratas con más respeto del que había, deshaces exactamente lo que él acaba de hacer.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-05', concepto: HUM, lenguaExplicacion: 'es',
    sourceText: '— Estiveste doente? — Estive. Nada de grave: o costume, o meu corpo a lembrar-me que existe.',
    audience: 'un amigo que no sabe si insistir en preguntar o dejarlo pasar',
    instruccion: 'Explícale qué señal le está dando la persona y qué haría un portugués a continuación.',
    puntosClave: [
      { dice: 'que la broma sirve para cerrar el tema sin cortar', ancla: ['cerrar el tema'] },
      { dice: 'que quita gravedad para no obligar al otro a preocuparse', ancla: ['quita gravedad', 'sin obligar'] },
      { dice: 'que insistir después de esa señal resulta invasivo', ancla: ['invasivo', 'insistir'] },
    ],
    modelo: 'Te está dando una señal: la broma sirve para cerrar el tema sin cortarte. Quita gravedad al asunto justamente para no obligarte a preocuparte ni a preguntar más. Un portugués recogería el tono, diría algo del mismo registro y cambiaría de asunto. Insistir después de esa señal resulta invasivo, aunque venga de buena intención — si de verdad quieres saber, se pregunta después y a solas.',
    wordRange: [50, 115], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-18-06', concepto: HUM, lenguaExplicacion: 'pt',
    sourceText: '— Falas muito bem inglês. — Falo à portuguesa: percebem-me em todo o lado e em nenhum me levam a sério.',
    audience: 'um colega brasileiro que ficou sem saber se aquilo era modéstia ou desânimo',
    instruccion: 'Explica-lhe em português o que a resposta faz e porque é que não é nem uma coisa nem outra.',
    puntosClave: [
      { dice: 'que não é modéstia nem desânimo, é um movimento de aproximação', ancla: ['aproximação'] },
      { dice: 'que a piada se estende ao país inteiro e não só a quem fala', ancla: ['ao país', 'não é só sobre ele'] },
      { dice: 'que responder com elogio insistente estraga o efeito', ancla: ['estraga', 'insistir no elogio'] },
    ],
    modelo: 'Não é modéstia nem desânimo: é um movimento de aproximação. Ao rir-se de si, e de passagem do país inteiro, tira solenidade ao elogio e põe-vos ao mesmo nível — repara que a piada não é só sobre ele. Se insistires no elogio, estragas o efeito e obrigas a pessoa a repetir a manobra. O melhor é rir e contar uma tua do mesmo género.',
    wordRange: [45, 110], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-18-07', concepto: HUM, lenguaExplicacion: 'es',
    sourceText: '— Trabalhas há quantos anos nisto? — Há tantos que já ninguém se lembra de perguntar porquê.',
    audience: 'una lectora que interpretó la frase como amargura',
    instruccion: 'Explícale por qué la lectura amarga probablemente no es la correcta y qué hay que mirar para decidirlo.',
    puntosClave: [
      { dice: 'que la frase puede ser broma o amargura y el tono decide', ancla: ['el tono', 'decide'] },
      { dice: 'que en portugués este molde suele ser humorístico', ancla: ['suele ser', 'molde'] },
      { dice: 'que leerla como queja obliga al otro a consolar sin motivo', ancla: ['consolar'] },
    ],
    modelo: 'La frase admite las dos lecturas y lo que decide es el tono, no las palabras. Ahora bien, este molde —exagerar el tiempo hasta el absurdo para hablar de uno mismo— suele ser humorístico en portugués, y ésa es la lectura por defecto. Si la tomas como queja, obligas a tu interlocutor a consolarte sin que te haya pedido nada, y a él le toca deshacer el malentendido. Ante la duda, responde en broma: si era amargura, ya lo dirá.',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-08', concepto: HUM, lenguaExplicacion: 'es',
    sourceText: '— Que casa tão bonita! — É pequena, mas tem uma vantagem: limpa-se num instante e ninguém quer ficar a dormir.',
    audience: 'una invitada que empezó a decir que la casa no era pequeña',
    instruccion: 'Explícale por qué contradecirlo no era la respuesta y cuál era.',
    puntosClave: [
      { dice: 'que contradecir el rebajamiento obliga a repetirlo', ancla: ['obligas a repetir'] },
      { dice: 'que el remate humorístico indica que no busca consuelo', ancla: ['no busca consuelo', 'el remate'] },
      { dice: 'que lo esperado es seguir el chiste o alabar algo concreto', ancla: ['seguir el chiste'] },
    ],
    modelo: 'Al decirle que la casa no es pequeña le obligas a repetir el rebajamiento, y así puede seguir toda la tarde. Fíjate en el remate: si buscara consuelo no habría añadido una ventaja graciosa. Lo que hace es aceptar tu elogio quitándole peso, que es la forma cortés de recibirlo. Lo esperado era seguir el chiste, o pasar a alabar algo concreto — la luz, la vista, el sitio — que ya no admite rebaja.',
    wordRange: [50, 120], register: 'informal', address: 'tu',
  },

  // ── B · Concordancia discutida (C2) ──────────────────────────────
  // Puntos donde la norma no da un veredicto limpio. Explicar por qué se
  // discute es la destreza; elegir un bando por decreto no lo es.
  {
    id: 'EXP-18-09', concepto: CON, lenguaExplicacion: 'es',
    sourceText: 'Houve problemas na entrega. / Houveram problemas na entrega.',
    audience: 'un estudiante que oyó la segunda forma a un portugués y cree que la gramática se equivoca',
    instruccion: 'Explícale qué dice la norma, por qué se oye la otra y qué debe escribir él.',
    puntosClave: [
      { dice: 'que «haver» existencial es impersonal y va en singular', ancla: ['impersonal', 'singular'] },
      { dice: 'que la forma con plural se oye porque el hablante la reinterpreta como sujeto', ancla: ['reinterpreta', 'como sujeto'] },
      { dice: 'que por escrito debe usar el singular', ancla: ['por escrito', 'escribe el singular'] },
    ],
    modelo: 'La norma es clara y la primera es la buena: cuando «haver» significa existir es impersonal, no tiene sujeto, y por eso se queda en singular por muchos problemas que hubiera. La otra se oye, y a hablantes cultos, porque quien la dice reinterpreta «problemas» como sujeto y le hace concordar el verbo — es un cambio en marcha, no un descuido. Tú por escrito usa el singular; oírla no te obliga a escribirla.',
    wordRange: [50, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-10', concepto: CON, lenguaExplicacion: 'es',
    sourceText: 'A maioria dos alunos faltou. / A maioria dos alunos faltaram.',
    audience: 'una correctora que quiere marcar una de las dos como error',
    instruccion: 'Explícale por qué no puede marcar ninguna y qué cambia entre una y otra.',
    puntosClave: [
      { dice: 'que las dos están admitidas', ancla: ['las dos están admitidas', 'ninguna es un error'] },
      { dice: 'que el singular concuerda con el núcleo y el plural con el sentido', ancla: ['con el núcleo', 'con el sentido'] },
      { dice: 'que lo que cambia es el foco, no la corrección', ancla: ['el foco'] },
    ],
    modelo: 'No marques ninguna: las dos están admitidas y aparecen en autores cuidados. El singular concuerda con el núcleo del sujeto, que es «a maioria»; el plural concuerda con el sentido, porque quien falta son los alumnos. Lo que cambia no es la corrección sino el foco: la primera mira al grupo como bloque, la segunda a los individuos. Lo único exigible es no alternar las dos dentro del mismo texto.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-11', concepto: CON, lenguaExplicacion: 'pt',
    sourceText: 'Vossa Excelência está enganado. / Vossa Excelência está enganada.',
    audience: 'um colega que vai escrever a um deputado e não sabe qual usar',
    instruccion: 'Explica-lhe em português de que depende a escolha e porque é que a forma de tratamento não decide nada.',
    puntosClave: [
      { dice: 'que a forma de tratamento é feminina mas não manda no adjetivo', ancla: ['não manda', 'não decide'] },
      { dice: 'que o adjetivo concorda com o sexo da pessoa tratada', ancla: ['a pessoa a quem se escreve'] },
      { dice: 'que o verbo vai na terceira pessoa em qualquer caso', ancla: ['terceira pessoa'] },
    ],
    modelo: 'A forma de tratamento é feminina, mas isso não decide nada: quem manda no adjetivo é a pessoa a quem se escreve. Se for homem, «enganado»; se for mulher, «enganada». O verbo, esse, vai sempre na terceira pessoa do singular, seja quem for — é aí que a maioria dos hispanofalantes tropeça, porque em espanhol o tratamento equivalente também leva terceira pessoa mas o adjetivo costuma alinhar-se de outra maneira. Confirma o nome antes de enviar.',
    wordRange: [55, 125], register: 'formal', address: 'tu',
  },
  {
    id: 'EXP-18-12', concepto: CON, lenguaExplicacion: 'es',
    sourceText: 'É proibido entrada. / É proibida a entrada.',
    audience: 'un traductor que quiere poner un cartel y no sabe cuál es correcto',
    instruccion: 'Explícale de qué depende y por qué el cartel de la calle suele llevar la primera.',
    puntosClave: [
      { dice: 'que sin artículo la expresión queda invariable', ancla: ['sin artículo', 'invariable'] },
      { dice: 'que con artículo el adjetivo concuerda', ancla: ['con artículo', 'concuerda'] },
      { dice: 'que las dos son correctas si se respeta esa condición', ancla: ['las dos son correctas'] },
    ],
    modelo: 'Depende del artículo, y las dos son correctas si respetas la condición. Sin artículo, la expresión funciona como una fórmula fija y queda invariable, que es por lo que los carteles llevan la primera: son breves por diseño. En cuanto pones el artículo, el sustantivo se vuelve determinado y el adjetivo concuerda con él. Lo que no puedes escribir es mezclar las dos cosas — artículo con adjetivo invariable.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-13', concepto: CON, lenguaExplicacion: 'es',
    sourceText: 'Faz dois anos que não o vejo. / Fazem dois anos que não o vejo.',
    audience: 'un estudiante que dice que en Brasil oye la segunda todo el tiempo',
    instruccion: 'Explícale por qué la norma prefiere una y qué hace la otra tan común.',
    puntosClave: [
      { dice: 'que «fazer» de tiempo transcurrido es impersonal', ancla: ['impersonal'] },
      { dice: 'que por eso la norma pide el singular', ancla: ['pide el singular', 'el singular'] },
      { dice: 'que el plural es frecuente en el habla y sobre todo en Brasil', ancla: ['en el habla', 'en Brasil'] },
    ],
    modelo: 'Cuando «fazer» indica tiempo transcurrido es impersonal —no hay nadie ni nada que haga— y por eso la norma pide el singular por muchos años que sean. El plural es frecuentísimo en el habla, y más en Brasil, porque el hablante toma «dos años» por sujeto: la misma reinterpretación que ocurre con «haver». Reconócelo cuando lo oigas y escribe el singular, sobre todo si escribes para Portugal.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-14', concepto: CON, lenguaExplicacion: 'es',
    sourceText: 'Foi um dos que mais trabalhou. / Foi um dos que mais trabalharam.',
    audience: 'una editora que tiene que elegir una para un texto que va a imprenta',
    instruccion: 'Explícale qué defiende cada forma y cuál elegiría un texto cuidado.',
    puntosClave: [
      { dice: 'que el relativo puede referirse a «um» o al grupo', ancla: ['al grupo', 'a «um»'] },
      { dice: 'que la tradición gramatical prefiere el plural', ancla: ['prefiere el plural', 'el plural'] },
      { dice: 'que el singular está extendido y no se considera error grave', ancla: ['no se considera error', 'está extendido'] },
    ],
    modelo: 'La duda está en a qué se refiere el relativo: puede apuntar a «um», y entonces el verbo va en singular, o al grupo del que se le extrae, y entonces va en plural. La tradición gramatical prefiere el plural, porque los que trabajaron fueron varios y él es uno de ellos. El singular está muy extendido y no se considera error grave, pero para imprenta yo iría al plural: es la forma que nadie te va a discutir.',
    wordRange: [55, 125], register: 'neutro', address: 'tu',
  },

  // ── C · Sintaxis literaria (C2) ──────────────────────────────────
  // Frases CONSTRUIDAS, no citas: se enseña la licencia sintáctica y una
  // frase construida la aísla mejor. Citar de memoria es como se publican
  // citas falsas, y en esta ola ya pasó dos veces.
  {
    id: 'EXP-18-15', concepto: SIN, lenguaExplicacion: 'es',
    sourceText: 'De sua mãe recebera o nome; do pai, a teimosia e as dívidas.',
    audience: 'un estudiante que quiere saber por qué la segunda mitad no tiene verbo',
    instruccion: 'Explícale qué figura hay ahí y qué gana la frase con ella.',
    puntosClave: [
      { dice: 'que el verbo se elide porque se recupera del primer miembro', ancla: ['se elide', 'se recupera'] },
      { dice: 'que la coma marca el hueco del verbo', ancla: ['la coma'] },
      { dice: 'que la construcción crea paralelismo y da peso al final', ancla: ['paralelismo'] },
    ],
    modelo: 'El verbo no falta: se elide porque el lector lo recupera del primer miembro, y la coma que ves después de «do pai» marca exactamente su hueco. Es un recurso corriente en la prosa cuidada portuguesa. Lo que gana la frase es paralelismo —dos herencias enfrentadas con la misma estructura— y, sobre todo, peso en el final: al no repetir el verbo, la última palabra queda desnuda y golpea.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-16', concepto: SIN, lenguaExplicacion: 'es',
    sourceText: 'Longa foi a espera, e inútil.',
    audience: 'una traductora que quiere reordenarla para que suene natural',
    instruccion: 'Explícale qué se pierde si la reordena y por qué el adjetivo va delante.',
    puntosClave: [
      { dice: 'que el adjetivo antepuesto es enfático, no descriptivo', ancla: ['no describe: enfatiza', 'enfatiza'] },
      { dice: 'que el segundo adjetivo llega después como remate', ancla: ['remate'] },
      { dice: 'que reordenarla la vuelve neutra y le quita el efecto', ancla: ['neutra', 'quita el efecto'] },
    ],
    modelo: 'El adjetivo va delante porque no describe: enfatiza. Puesto detrás, informaría de cuánto duró la espera; puesto delante, la valora antes de nombrarla. Y el segundo llega separado, después de la coma, como un remate que corrige el sentido de todo lo anterior. Si la reordenas a sujeto-verbo-adjetivos, la frase queda neutra y le quitas el efecto — pierdes justamente aquello por lo que el autor la escribió así.',
    wordRange: [50, 115], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-17', concepto: SIN, lenguaExplicacion: 'pt',
    sourceText: 'Ao velho, que de tudo se ria, coube a única coisa de que ninguém ri.',
    audience: 'um colega que não percebe porque é que a frase começa pelo complemento',
    instruccion: 'Explica-lhe em português o que a anteposição faz e como se lê a frase.',
    puntosClave: [
      { dice: 'que o complemento indireto foi anteposto para criar contraste', ancla: ['anteposto', 'contraste'] },
      { dice: 'que a relativa encaixada suspende a frase antes do verbo', ancla: ['suspende'] },
      { dice: 'que o verbo só chega no fim e por isso pesa', ancla: ['no fim', 'pesa'] },
    ],
    modelo: 'O complemento foi anteposto de propósito, para pôr o velho no início e criar contraste com o que lhe acontece. A relativa que vem a seguir suspende a frase: quem lê já tem o velho e a sua maneira de estar no mundo, mas ainda não sabe o que lhe coube. O verbo só chega no fim, e por isso pesa — a informação que interessa fica guardada até à última linha, que é o que a anteposição serve para fazer.',
    wordRange: [55, 125], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-18', concepto: SIN, lenguaExplicacion: 'es',
    sourceText: 'Não que lhe faltasse coragem: faltava-lhe, isso sim, quem a visse.',
    audience: 'un lector que se pierde en la doble negación y cree que hay un error',
    instruccion: 'Explícale cómo se articula la frase y qué papel juega cada parte.',
    puntosClave: [
      { dice: 'que «não que» abre una negación anticipada de una lectura posible', ancla: ['«não que»', 'anticipada'] },
      { dice: 'que los dos puntos introducen la corrección', ancla: ['los dos puntos'] },
      { dice: 'que «isso sim» refuerza el miembro que sí se afirma', ancla: ['«isso sim»'] },
    ],
    modelo: 'No hay error: la frase adelanta una lectura para descartarla. Ese «não que» con subjuntivo niega algo que el lector podría estar suponiendo —que le faltara valor— sin llegar a afirmarlo nunca. Los dos puntos introducen la corrección, es decir lo que sí faltaba. Y el «isso sim», intercalado, refuerza ese segundo miembro por contraste con el primero. Leída así, la frase no es oscura: está construida para que el matiz llegue en dos tiempos.',
    wordRange: [55, 125], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-19', concepto: SIN, lenguaExplicacion: 'es',
    sourceText: 'E dizia-o com uma calma — a calma de quem já perdeu tudo — que ninguém lhe conhecia.',
    audience: 'un estudiante que no sabe qué hacen los guiones ahí',
    instruccion: 'Explícale la función del inciso y por qué la frase se entiende igual si se quita.',
    puntosClave: [
      { dice: 'que el inciso amplía el sustantivo sin romper la sintaxis', ancla: ['sin romper'] },
      { dice: 'que al quitarlo la frase sigue completa', ancla: ['sigue completa', 'se sostiene'] },
      { dice: 'que los guiones separan más que las comas y por eso se usan aquí', ancla: ['separan más', 'guiones'] },
    ],
    modelo: 'El inciso amplía el sustantivo sin romper la sintaxis: si lo tapas con el dedo, la frase sigue completa y la relativa final sigue enganchada a «uma calma». Ésa es la prueba. Los guiones, en vez de comas, marcan una separación mayor: avisan de que lo de dentro pertenece a otro plano, casi a otra voz. Con comas se leería como una simple aposición; con guiones, como una intromisión del narrador.',
    wordRange: [50, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-18-20', concepto: SIN, lenguaExplicacion: 'es',
    sourceText: 'Chegaram as cartas. Não as que esperava.',
    audience: 'una traductora que quiere unir las dos frases en una',
    instruccion: 'Explícale qué hace el punto y qué se pierde al unirlas.',
    puntosClave: [
      { dice: 'que el punto crea una pausa que retrasa la corrección', ancla: ['retrasa'] },
      { dice: 'que la segunda frase es un fragmento sin verbo, deliberado', ancla: ['sin verbo', 'fragmento'] },
      { dice: 'que unirlas con «pero» las vuelve neutras', ancla: ['las vuelve neutras', 'neutras'] },
    ],
    modelo: 'El punto no es un descuido de puntuación: crea una pausa que retrasa la corrección y deja al lector un instante creyendo la buena noticia. La segunda es un fragmento sin verbo, y lo es a propósito — el verbo se recupera de la anterior y su ausencia acelera el golpe. Si las unes con un «pero», las vuelves neutras: la información es la misma y el efecto desaparece, que era lo único que justificaba escribirlo así.',
    wordRange: [50, 120], register: 'neutro', address: 'tu',
  },
];

if (process.argv[1]?.includes('lote18-explicar')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Lote 18 — mediación EXPLICAR, pasada 5 · ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | lengua |');
  console.log('|---|---:|---|');
  for (const c of [HUM, CON, SIN]) {
    const xs = ITEMS.filter((x) => x.concepto === c);
    const l = new Map<string, number>();
    for (const x of xs) l.set(x.lenguaExplicacion, (l.get(x.lenguaExplicacion) ?? 0) + 1);
    console.log(`| \`${c}\` | ${xs.length} | ${[...l].map(([k, n]) => `${k} ×${n}`).join(' · ')} |`);
  }
  const sos = ITEMS.map((x) => [x.id, inventadosProbables(x)] as const).filter(([, w]) => w.length);
  if (sos.length) {
    console.log(`\n## Comprobar · datos que el modelo APORTA y la fuente no da\n`);
    console.log('Aportar información ES la tarea aquí: la lista no señala invención,');
    console.log('señala lo que hay que verificar que sea CIERTO.\n');
    for (const [id, w] of sos) console.log(`- ${id}: ${w.join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

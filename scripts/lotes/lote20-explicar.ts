// scripts/lotes/lote20-explicar.ts
//
//   npx tsx scripts/lotes/lote20-explicar.ts            # doc + gates
//   npx tsx scripts/lotes/lote20-explicar.ts --json     # ítems para publicar
//
// LOTE 20 · 11 unidades, y con el 19 y el 21 **el bucket de mediación
// queda en cero**: `b12-cortesia-pt-br-es` (6) y
// `b11-mediacao-intercultural` (5).
//
// Los dos puntos tienen la misma trampa para quien los escribe: pedir que
// se EXPLIQUE un sistema de cortesía invita a soltar una regla general
// («en Portugal se es más formal»), y una regla general es lo que el
// alumno ya trae mal aprendido. Cada ítem parte de un caso concreto en el
// que alguien ya se equivocó, y lo que se explica es ese caso.
import {
  rubricaDe, verificar, inventadosProbables, type ItemExplica,
} from '../lib/explicar-mediacion';

const COR = 'b12-cortesia-pt-br-es';
const INT = 'b11-mediacao-intercultural';

export const ITEMS: ItemExplica[] = [
  // ── A · Cortesía PT / BR / hispanoamericana, explicada ───────────
  {
    id: 'EXP-20-01', concepto: COR, lenguaExplicacion: 'es',
    sourceText: 'Um brasileiro escreve a um professor português: «Oi, professor! Tudo bem? Você pode me mandar o material?»',
    audience: 'un estudiante mexicano que quiere saber qué falla, si el mensaje le parece educado',
    instruccion: 'Explícale qué hace ese mensaje en cada uno de los tres sistemas y por qué en Portugal cae mal sin ser grosero.',
    puntosClave: [
      { dice: 'que en Brasil «você» es el trato neutro y no marca distancia', ancla: ['no marca distancia', 'trato neutro'] },
      { dice: 'que en Portugal «você» a un superior resulta descortés', ancla: ['a un superior', 'resulta descortés'] },
      { dice: 'que el sistema portugués usa la tercera persona sin pronombre', ancla: ['tercera persona sin pronombre', 'sin pronombre'] },
    ],
    modelo: 'El mensaje es educado en Brasil y no lo es en Portugal, y la palabra que lo decide es «você». En Brasil es el trato neutro: no marca distancia ni la quita, así que sirve para un profesor igual que para un amigo. En Portugal marca una familiaridad que a un superior resulta descortés, aunque quien la use no pretenda faltar. El sistema portugués resuelve la cortesía con la tercera persona sin pronombre, o con el cargo: «o professor pode enviar-me…». Y el español americano hace una tercera cosa, porque su «usted» sí tiene forma propia.',
    wordRange: [60, 140], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-02', concepto: COR, lenguaExplicacion: 'es',
    sourceText: 'Numa loja em Lisboa: «Faz favor, a menina pode ver se têm isto no armazém?»',
    audience: 'una lectora argentina que traduciría «a menina» por «la señorita» sin más',
    instruccion: 'Explícale qué hace ese tratamiento en portugués y por qué su traducción no transmite lo mismo.',
    puntosClave: [
      { dice: 'que «a menina» sitúa a la persona por edad y por posición laboral', ancla: ['por edad', 'posición'] },
      { dice: 'que la traducción por «señorita» pierde esa carga', ancla: ['pierde', 'no transmite'] },
      { dice: 'que hoy es un tratamiento discutido en Portugal', ancla: ['discutido', 'discute'] },
    ],
    modelo: 'No es sólo una fórmula amable: «a menina» sitúa a la persona por edad y por posición, y se oye sobre todo hacia empleadas jóvenes. Tu «señorita» transmite la cortesía y pierde esa carga, que es justamente lo que hay que trasladar. En Portugal el tratamiento se discute hoy por eso mismo — hay quien lo usa sin pensarlo y hay quien pide que no se lo apliquen. Si traduces para un lector americano, conviene una nota: la palabra sola no dice lo que la escena dice.',
    wordRange: [55, 130], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-03', concepto: COR, lenguaExplicacion: 'pt',
    sourceText: 'Um português em São Paulo diz a um colega da mesma idade: «O senhor sabe onde fica a sala?»',
    audience: 'um colega brasileiro que achou a pergunta estranha e não sabe porquê',
    instruccion: 'Explica-lhe em português o que aconteceu e porque é que a intenção era boa.',
    puntosClave: [
      { dice: 'que no Brasil «o senhor» entre pares cria distância', ancla: ['cria distância', 'distância'] },
      { dice: 'que em Portugal seria a escolha prudente com um desconhecido', ancla: ['prudente', 'com um desconhecido'] },
      { dice: 'que o erro é de calibragem, não de educação', ancla: ['de calibragem', 'não é falta de educação'] },
    ],
    modelo: 'A intenção era boa e o efeito foi o contrário. No Brasil, «o senhor» entre colegas da mesma idade cria distância e pode soar a ironia ou a frieza; o neutro ali é «você». Em Portugal, esse mesmo «o senhor» seria a escolha prudente com alguém que não se conhece, e é isso que ele trouxe de casa. O erro é de calibragem e não de educação — trocou o grau, não a intenção.',
    wordRange: [50, 120], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-04', concepto: COR, lenguaExplicacion: 'es',
    sourceText: '— Queria um café, se faz favor. — Um café. Mais alguma coisa? — Não, obrigado.',
    audience: 'un estudiante que aprendió que hay que decir «por favor» y no entiende el «se faz favor»',
    instruccion: 'Explícale la diferencia entre las dos fórmulas y qué elige un portugués en cada situación.',
    puntosClave: [
      { dice: 'que «se faz favor» es la fórmula corriente en Portugal', ancla: ['la fórmula corriente', 'corriente en Portugal'] },
      { dice: 'que «por favor» también existe pero suena algo más marcado', ancla: ['más marcado', 'más enfático'] },
      { dice: 'que «obrigado» concuerda con quien habla y no con el interlocutor', ancla: ['con quien habla'] },
    ],
    modelo: 'Las dos son correctas y no son intercambiables sin más. «Se faz favor» es la fórmula corriente al pedir algo en Portugal, la de todos los días; «por favor» también existe, pero suena algo más marcado y se oye más en ruegos o en avisos. Y fíjate en el final, que es donde tropieza casi todo hispanohablante: «obrigado» concuerda con quien habla, no con el interlocutor. Una mujer dice «obrigada» aunque se dirija a un hombre.',
    wordRange: [55, 130], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-05', concepto: COR, lenguaExplicacion: 'es',
    sourceText: 'Correo de una empresa española a una portuguesa: «Hola María, ¿me confirmas el pedido? Gracias, un saludo.»',
    audience: 'la propia autora, que no entiende por qué le contestaron con tres fórmulas y su apellido',
    instruccion: 'Explícale qué señal envió sin querer y qué diferencia hay entre los dos usos profesionales.',
    puntosClave: [
      { dice: 'que el nombre de pila y el tuteo son neutros en España y no en Portugal', ancla: ['neutros en España', 'en España'] },
      { dice: 'que la respuesta formal no es un reproche sino el registro por defecto', ancla: ['no es un reproche', 'registro por defecto'] },
      { dice: 'que en un primer contacto profesional Portugal parte de la distancia', ancla: ['parte de la distancia', 'primer contacto'] },
    ],
    modelo: 'No te contestaron así por molestia. En España el nombre de pila y el tuteo son neutros en un correo de trabajo; en Portugal, en un primer contacto profesional, se parte de la distancia y se baja después, si se baja. Tu mensaje pedía cercanía desde el minuto uno y ella respondió en el registro por defecto, que incluye apellido y fórmula de cierre. No es un reproche: es el punto de partida. Si el trato continúa, el registro irá bajando solo.',
    wordRange: [55, 130], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-06', concepto: COR, lenguaExplicacion: 'pt',
    sourceText: 'Um mexicano num jantar em Lisboa: «Con permiso» ao levantar-se da mesa, e ninguém percebeu.',
    audience: 'o próprio, que ficou sem saber se tinha sido mal-educado',
    instruccion: 'Explica-lhe em português o que se diz em cada sistema e porque é que o silêncio dos outros não foi censura.',
    puntosClave: [
      { dice: 'que a fórmula existe em português mas com outro uso', ancla: ['outro uso', 'usa-se noutro'] },
      { dice: 'que ao levantar-se da mesa em Portugal se diz outra coisa', ancla: ['diz-se outra coisa', 'com licença'] },
      { dice: 'que ninguém o interpretou como falta de educação', ancla: ['ninguém', 'não foi lido como'] },
    ],
    modelo: 'Não foi mal-educado. A fórmula existe em português — «com licença» — mas usa-se noutro momento: sobretudo ao passar à frente de alguém ou ao interromper. Ao levantar-se da mesa, o mais comum em Portugal é dizer-se outra coisa, um «dão licença» ou um simples «já venho». Ninguém o leu como falta de educação: leram-no como estrangeiro, que é diferente. A prova é que ninguém reagiu.',
    wordRange: [50, 120], register: 'neutro', address: 'tu',
  },

  // ── B · Mediación intercultural ES↔PT ────────────────────────────
  // El punto declara algo incómodo y concreto: cómo se percibe al
  // hispanohablante en Portugal, y que su español es a la vez ventaja y
  // ruido. Los ítems parten de ese ruido.
  {
    id: 'EXP-20-07', concepto: INT, lenguaExplicacion: 'es',
    sourceText: 'Um espanhol numa reunião em Lisboa: «Bueno, yo os lo explico en español que nos entendemos todos, ¿vale?»',
    audience: 'el propio, que lo dijo para facilitar las cosas y notó que el ambiente se enfrió',
    instruccion: 'Explícale por qué esa frase cuesta cara y qué habría funcionado mejor.',
    puntosClave: [
      { dice: 'que el portugués entiende español mejor de lo que el español entiende portugués', ancla: ['mejor de lo que'] },
      { dice: 'que por eso proponerlo suena a que el esfuerzo lo hacen ellos', ancla: ['el esfuerzo lo hacen ellos', 'el esfuerzo'] },
      { dice: 'que pedir permiso en portugués cambia por completo el efecto', ancla: ['pedir permiso', 'en portugués'] },
    ],
    modelo: 'La frase parece práctica y no lo es. El portugués suele entender español mucho mejor de lo que el español entiende portugués, así que proponer el español como lengua común no reparte el esfuerzo: lo pone entero del lado de ellos, y encima da por hecho que aceptan. Lo que funciona es lo contrario: empezar en portugués aunque sea mal, y pedir permiso para pasar al español si hace falta. Lo mismo dicho al revés se recibe al revés.',
    wordRange: [55, 130], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-08', concepto: INT, lenguaExplicacion: 'es',
    sourceText: 'Um cliente espanhol ao telefone: «¡Qué bien hablas español! Casi no se te nota el acento.»',
    audience: 'el propio, que lo dijo como cumplido y notó que la conversación se acortó',
    instruccion: 'Explícale por qué el cumplido no llegó como cumplido.',
    puntosClave: [
      { dice: 'que muchos portugueses hablan español sin haberlo estudiado', ancla: ['sin haberlo estudiado', 'sin estudiarlo'] },
      { dice: 'que elogiarlo señala que se le ve como el que se adapta', ancla: ['el que se adapta', 'se adapta'] },
      { dice: 'que el cumplido equivalente sería elogiar algo que él eligió', ancla: ['algo que él eligió', 'que eligió'] },
    ],
    modelo: 'El elogio da por hecho justo lo que molesta. Muchos portugueses hablan español razonablemente sin haberlo estudiado, por exposición, y elogiárselo señala que se le ve como el que se adapta a ti — que es la posición en la que ya estaba antes de que hablaras. Si quieres hacer un cumplido, elogia algo que él eligió: su trabajo, una decisión, una explicación clara. La lengua no la eligió, la puso para que tú estuvieras cómodo.',
    wordRange: [55, 130], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-09', concepto: INT, lenguaExplicacion: 'pt',
    sourceText: 'Numa negociação, o espanhol interrompe duas vezes para adiantar a conclusão e o português cala-se até ao fim.',
    audience: 'o mediador, que tem de explicar a cada lado o que aconteceu',
    instruccion: 'Explica em português o que cada um julgou do outro e como se desfaz o mal-entendido.',
    puntosClave: [
      { dice: 'que a interrupção em Espanha marca envolvimento e não desrespeito', ancla: ['envolvimento'] },
      { dice: 'que o silêncio português foi lido como desinteresse quando era o contrário', ancla: ['desinteressado'] },
      { dice: 'que dizer a norma de cada lado em voz alta resolve mais do que corrigir', ancla: ['em voz alta', 'dizer a norma'] },
    ],
    modelo: 'Cada um leu o outro pela sua norma. Em Espanha, interromper marca envolvimento e mostra que se está a acompanhar; o silêncio prolongado é que preocupa. Em Portugal é ao contrário: espera-se o turno, e quem corta parece atropelar. Assim, um pareceu agressivo e o outro pareceu desinteressado, e nenhum dos dois era. O que resolve não é corrigir ninguém: é dizer a norma de cada lado em voz alta, no início, para que a leitura mude.',
    wordRange: [55, 130], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-10', concepto: INT, lenguaExplicacion: 'es',
    sourceText: 'Um espanhol pergunta a um português: «¿Y vosotros no os sentís un poco españoles?»',
    audience: 'el propio, que lo preguntó con curiosidad genuina y recibió una respuesta muy seca',
    instruccion: 'Explícale qué contiene esa pregunta sin que él lo pusiera, y cómo se pregunta lo mismo sin ese fondo.',
    puntosClave: [
      { dice: 'que la pregunta presupone que Portugal es una variante de España', ancla: ['presupone', 'una variante'] },
      { dice: 'que hay una historia larga detrás de esa sensibilidad', ancla: ['una historia', 'historia'] },
      { dice: 'que la misma curiosidad cabe en una pregunta simétrica', ancla: ['simétrica', 'al revés'] },
    ],
    modelo: 'Tu curiosidad era genuina y la pregunta no lo parecía. Tal como está formulada presupone que Portugal es una variante de España, y detrás de esa sensibilidad hay una historia larga que en España casi no se estudia y en Portugal sí. Por eso la respuesta llegó seca. La misma curiosidad cabe en una pregunta simétrica: qué se parece y qué no entre los dos países, preguntado de manera que la respuesta pueda ir en las dos direcciones.',
    wordRange: [55, 130], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-20-11', concepto: INT, lenguaExplicacion: 'es',
    sourceText: 'Numa empresa, o espanhol responde a um pedido com «eso es imposible» e o assunto morre ali.',
    audience: 'el propio, que quería ganar tiempo y no cerrar la puerta',
    instruccion: 'Explícale qué se oyó al otro lado y cómo se dice lo mismo sin cerrar nada.',
    puntosClave: [
      { dice: 'que la negativa directa es más frecuente y menos grave en España', ancla: ['menos grave', 'más frecuente'] },
      { dice: 'que en Portugal la negativa se atenúa y una directa se lee como final', ancla: ['se lee como definitiva'] },
      { dice: 'que decir la dificultad concreta mantiene la conversación abierta', ancla: ['la dificultad concreta', 'abierta'] },
    ],
    modelo: 'Al otro lado se oyó un portazo. La negativa directa es más frecuente y menos grave en España, donde se discute a partir de ella; en Portugal la negativa se atenúa casi siempre, así que una directa se lee como definitiva y nadie insiste. Lo que mantiene la conversación abierta es decir la dificultad concreta en lugar del veredicto: qué falta, qué plazo haría falta, de qué depende. Con eso el asunto sigue vivo y tú ganas el tiempo que querías.',
    wordRange: [55, 135], register: 'neutro', address: 'tu',
  },
];

if (process.argv[1]?.includes('lote20-explicar')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, rubric: rubricaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Lote 20 — mediación EXPLICAR · ${ITEMS.length} ítems\n`);
  console.log('| punto | ítems | lengua |');
  console.log('|---|---:|---|');
  for (const c of [COR, INT]) {
    const xs = ITEMS.filter((x) => x.concepto === c);
    const l = new Map<string, number>();
    for (const x of xs) l.set(x.lenguaExplicacion, (l.get(x.lenguaExplicacion) ?? 0) + 1);
    console.log(`| \`${c}\` | ${xs.length} | ${[...l].map(([k, n]) => `${k} ×${n}`).join(' · ')} |`);
  }
  const sos = ITEMS.map((x) => [x.id, inventadosProbables(x)] as const).filter(([, w]) => w.length);
  if (sos.length) {
    console.log(`\n## Comprobar · datos que el modelo APORTA y la fuente no da\n`);
    for (const [id, w] of sos) console.log(`- ${id}: ${w.join(' · ')}`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

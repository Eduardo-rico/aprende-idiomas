// scripts/lotes/lote29-explicar.ts
//
//   npx tsx scripts/lotes/lote29-explicar.ts            # gates
//   npx tsx scripts/lotes/lote29-explicar.ts --json     # para publicar
//
// E2#28 · 15 unidades de mediación EXPLICAR sobre los cinco puntos vivos
// de b10, que es el único bloque virgen del corpus: sólo el 5 % de sus
// ítems pasó alguna vez por una cola, frente al 12-48 % de los demás.
//
// Se producen en vez de leerse por la regla nueva del par —leer donde el
// bloque ya pasó por cola, producir donde es virgen—, y porque leer b10
// acaba de medirse al **62 % de error**: la tarjeta que afirmaba que «tu»
// es regional en Portugal, otra con la «r» carioca descrita como apical,
// «manteram-se» por «mantiveram-se».
//
// El formato EXPLICAR encaja aquí mejor que ningún otro: el punto de b10
// no es producir una forma, es **saber qué diferencia hay y poder
// contarla**. Si el alumno la explica, la ha visto.
import { verificar, inventadosProbables, type ItemExplica } from '../lib/explicar-mediacion';

const COL = 'b10-var-colocacao';
const FOR = 'b10-reg-formulas';
const LEX = 'b10-var-lexico';
const TRA = 'b10-var-tratamento';
const GER = 'b10-var-gerundio';

export const ITEMS: ItemExplica[] = [
  // ── b10-var-colocacao (4) ────────────────────────────────────────
  {
    id: 'EXP-29-01', concepto: COL, lenguaExplicacion: 'es',
    sourceText: '🇧🇷 «Me disseram que você chegou ontem.» · 🇵🇹 «Disseram-me que chegaste ontem.»',
    audience: 'un compañero que aprendió portugués en Brasil y va a trabajar en Lisboa',
    instruccion: 'Explícale qué cambia entre las dos frases y por qué la primera se nota inmediatamente en Portugal.',
    puntosClave: [
      { dice: 'que el pronombre va detrás del verbo en la norma europea', ancla: ['detrás del verbo'] },
      { dice: 'que empezar la frase con el pronombre es la marca brasileña', ancla: ['empezar la frase'] },
      { dice: 'que el guion no es un adorno: es obligatorio', ancla: ['guion'] },
    ],
    modelo: 'Lo que cambia es dónde se pone el pronombre. En la norma europea va detrás del verbo y unido con guion: «disseram-me». En Brasil se antepone, y empezar la frase con el pronombre —«Me disseram»— es una de las marcas que más rápido se oyen en Portugal. El guion no es opcional ni decorativo: sin él la palabra está mal escrita. De paso, la segunda frase tutea, que es lo corriente en Portugal entre compañeros.',
    wordRange: [45, 100], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-29-02', concepto: COL, lenguaExplicacion: 'es',
    sourceText: '🇧🇷 «Ela se lembra de tudo.» · 🇵🇹 «Ela lembra-se de tudo.»',
    audience: 'una amiga que está corrigiendo un texto y no sabe cuál de las dos dejar',
    instruccion: 'Dile cuál corresponde a la norma europea y qué regla decide la posición.',
    puntosClave: [
      { dice: 'que en europeo el reflexivo va enclítico cuando nada lo atrae', ancla: ['nada lo atrae'] },
      { dice: 'que hay palabras que sí lo atraen y entonces se antepone', ancla: ['se antepone'] },
      { dice: 'que la negación es la más frecuente de esas palabras', ancla: ['negación'] },
    ],
    modelo: 'Para un texto europeo deja «lembra-se». La regla es que el pronombre va detrás del verbo siempre que nada lo atraiga hacia delante; en una afirmativa sin más, nada lo atrae. Ahora bien, hay palabras que sí lo atraen y entonces se antepone: la negación es la más frecuente —«não se lembra»—, y también los adverbios delante del verbo, «que», los interrogativos y los indefinidos negativos. Con eso resuelves casi todos los casos.',
    wordRange: [45, 100], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-29-03', concepto: COL, lenguaExplicacion: 'es',
    sourceText: '🇧🇷 «Vou te ligar amanhã.» · 🇵🇹 «Vou ligar-te amanhã.»',
    audience: 'un alumno que ya domina la regla de la enclisis pero falla en las perífrasis',
    instruccion: 'Explícale dónde se coloca el pronombre cuando hay dos verbos y por qué la versión brasileña lo pone en otro sitio.',
    puntosClave: [
      { dice: 'que en la perífrasis el pronombre se apoya en el infinitivo', ancla: ['infinitivo'] },
      { dice: 'que el brasileño lo mete entre los dos verbos', ancla: ['entre los dos verbos'] },
      { dice: 'que la forma europea también admite ponerlo antes del auxiliar si algo lo atrae', ancla: ['antes del auxiliar'] },
    ],
    modelo: 'Con dos verbos, la norma europea apoya el pronombre en el infinitivo y con guion: «ligar-te». El brasileño lo coloca entre los dos verbos, suelto —«vou te ligar»—, y eso es lo que suena extranjero en Lisboa. Ojo con una excepción que no es excepción: si algo atrae el pronombre, como una negación, en europeo puede irse antes del auxiliar —«não te vou ligar»— y sigue siendo correcto. Lo que no se hace es dejarlo suelto en medio sin nada que lo justifique.',
    wordRange: [45, 100], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-29-04', concepto: COL, lenguaExplicacion: 'es',
    sourceText: '🇧🇷 «Não me disseram nada.» · 🇵🇹 «Não me disseram nada.»',
    audience: 'un compañero que cree que las dos normas nunca coinciden en la colocación',
    instruccion: 'Explícale por qué aquí las dos frases son idénticas y qué le enseña eso sobre la regla.',
    puntosClave: [
      { dice: 'que con negación las dos normas anteponen el pronombre', ancla: ['las dos normas'] },
      { dice: 'que la diferencia sólo aparece cuando nada lo atrae', ancla: ['cuando nada lo atrae'] },
      { dice: 'que por eso conviene aprender la lista de atractores y no una regla de país', ancla: ['lista de atractores'] },
    ],
    modelo: 'Aquí no hay diferencia ninguna: con «não» delante, las dos normas anteponen el pronombre y la frase sale igual. Eso es lo interesante, porque enseña dónde está de verdad la divergencia: sólo aparece cuando nada lo atrae, es decir en las afirmativas sin adverbio ni conjunción delante. Ahí el europeo pospone y el brasileño antepone. Por eso conviene aprenderse la lista de atractores —negación, adverbio antepuesto, «que», interrogativo, indefinido negativo— en vez de una regla por países, que falla la mitad de las veces.',
    wordRange: [45, 110], register: 'neutro', address: 'tu',
  },

  // ── b10-reg-formulas (4) ─────────────────────────────────────────
  {
    id: 'EXP-29-05', concepto: FOR, lenguaExplicacion: 'es',
    sourceText: 'Com os melhores cumprimentos,\nJoana Nunes',
    audience: 'un compañero que va a escribir su primer correo a un cliente portugués',
    instruccion: 'Explícale qué registro tiene esta despedida y con qué la confundiría si viniera del español o del brasileño.',
    puntosClave: [
      { dice: 'que es la despedida formal corriente en Portugal', ancla: ['formal corriente'] },
      { dice: 'que «atenciosamente» es más brasileña', ancla: ['brasileña'] },
      { dice: 'que traducir «un saludo» literalmente queda corto', ancla: ['queda corto'] },
    ],
    modelo: 'Ésa es la despedida formal corriente en Portugal, la que pondrías en un correo a un cliente o a alguien de otra empresa. «Atenciosamente» también se entiende, pero suena más brasileña y en Portugal se usa menos. Y cuidado con traducir del español: «un saludo» pasado a «uma saudação» no existe como fórmula, y «cumprimentos» a secas queda corto para un primer contacto. Si dudas, «Com os melhores cumprimentos» no falla nunca.',
    wordRange: [45, 100], register: 'formal', address: 'tu',
  },
  {
    id: 'EXP-29-06', concepto: FOR, lenguaExplicacion: 'es',
    sourceText: '— Estou?\n— Estou sim, bom dia. É da clínica?',
    audience: 'una amiga que va a llamar por teléfono a Portugal por primera vez',
    instruccion: 'Explícale qué se dice al descolgar en Portugal y por qué lo que ella diría no sirve.',
    puntosClave: [
      { dice: 'que al descolgar se dice «estou»', ancla: ['al descolgar'] },
      { dice: 'que «alô» es brasileño y «diga» es español', ancla: ['brasileño'] },
      { dice: 'que la fórmula se repite para confirmar que se oye', ancla: ['confirmar que se oye'] },
    ],
    modelo: 'Al descolgar, en Portugal se dice «Estou?», que literalmente es «¿estoy?» y funciona como nuestro «¿diga?». Lo que tú dirías no sirve: «diga» es español y «alô» es brasileño, y ninguno de los dos se oye en un teléfono portugués. La segunda vez, «Estou sim», sirve para confirmar que se oye del otro lado, algo así como nuestro «sí, sí, te escucho». Después ya viene el saludo normal.',
    wordRange: [45, 100], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-29-07', concepto: FOR, lenguaExplicacion: 'es',
    sourceText: '— Um café, se faz favor.\n— Com certeza. Mais alguma coisa?',
    audience: 'un alumno que dice siempre «por favor» y quiere sonar menos extranjero',
    instruccion: 'Explícale la diferencia de uso entre las dos fórmulas de cortesía en Portugal.',
    puntosClave: [
      { dice: 'que «se faz favor» es la corriente en Portugal', ancla: ['la corriente en Portugal'] },
      { dice: 'que «por favor» existe pero suena más neutro o más brasileño', ancla: ['más brasileño'] },
      { dice: 'que «faz favor» también sirve para llamar la atención de alguien', ancla: ['llamar la atención'] },
    ],
    modelo: 'Las dos se entienden, pero la corriente en Portugal es «se faz favor», sobre todo al pedir algo en un café o en una tienda. «Por favor» existe y nadie te va a mirar raro, aunque suena más neutro o más brasileño, y usarlo siempre es una de esas cosas que delatan al extranjero sin ser un error. Y hay un uso extra que el español no tiene: «faz favor» a secas sirve para llamar la atención de un camarero o de alguien por la calle, como nuestro «oiga, perdone».',
    wordRange: [50, 110], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-29-08', concepto: FOR, lenguaExplicacion: 'es',
    sourceText: '— Aqui tem o troco. — Obrigada.\n(la que habla es una mujer)',
    audience: 'un amigo que dice «obrigada» cuando habla con una mujer',
    instruccion: 'Explícale con qué concuerda «obrigado» y por qué su regla está invertida.',
    puntosClave: [
      { dice: 'que concuerda con QUIEN habla, no con quien escucha', ancla: ['quien habla'] },
      { dice: 'que es un participio y por eso se refiere al que da las gracias', ancla: ['participio'] },
      { dice: 'que en español no hay nada equivalente y por eso se calca mal', ancla: ['no hay nada equivalente'] },
    ],
    modelo: 'La palabra concuerda con quien habla, no con quien escucha: una mujer dice siempre «obrigada» y un hombre siempre «obrigado», hablen con quien hablen. Tú lo estás usando al revés. La razón es que no es una interjección sino un participio —viene a ser «quedo obligado»—, así que se refiere al que da las gracias. En español no hay nada equivalente, y por eso es de los calcos más fáciles de cometer y de los que más se notan.',
    wordRange: [45, 100], register: 'informal', address: 'tu',
  },

  // ── b10-var-lexico (4) ───────────────────────────────────────────
  {
    id: 'EXP-29-09', concepto: LEX, lenguaExplicacion: 'es',
    sourceText: '🇵🇹 «Apanhei o comboio das oito e fui de casa de banho em casa de banho.» · 🇧🇷 «Peguei o trem das oito…»',
    audience: 'una compañera que estudió con materiales brasileños y va a vivir a Oporto',
    instruccion: 'Explícale qué palabras cambian y cuáles de las suyas no la van a entender.',
    puntosClave: [
      { dice: 'que el tren es «comboio» en Portugal', ancla: ['comboio'] },
      { dice: 'que «apanhar» sustituye a «pegar» para transportes', ancla: ['apanhar'] },
      { dice: 'que «casa de banho» es el cuarto de baño', ancla: ['casa de banho'] },
    ],
    modelo: 'Tres cambian de golpe. El tren es «comboio» en Portugal y «trem» en Brasil, y ahí no hay término medio: «trem» en Lisboa no se dice. Para cogerlo se usa «apanhar» —«apanhei o comboio»—, mientras que «pegar» es lo brasileño; en Portugal «pegar» es más bien agarrar o pegarse algo. Y el cuarto de baño es «casa de banho», no «banheiro», que allí es quien vigila la playa. Con esas tres ya evitas la mitad de los malentendidos del primer mes.',
    wordRange: [50, 110], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-29-10', concepto: LEX, lenguaExplicacion: 'es',
    sourceText: '🇵🇹 «A rapariga que trabalha no café é muito simpática.»',
    audience: 'un compañero que aprendió portugués en Brasil y se ha quedado helado al oír la frase',
    instruccion: 'Explícale por qué en Portugal la frase es completamente neutra y qué palabra usaría un brasileño.',
    puntosClave: [
      { dice: 'que en Portugal «rapariga» significa simplemente chica', ancla: ['simplemente chica'] },
      { dice: 'que en Brasil la palabra es ofensiva', ancla: ['ofensiva'] },
      { dice: 'que el brasileño diría «moça» o «menina»', ancla: ['moça'] },
    ],
    modelo: 'En Portugal «rapariga» significa simplemente chica, sin ninguna connotación: es la palabra normal, la que usarías para una compañera de trabajo o para la hija de un vecino. En Brasil, en cambio, la palabra es ofensiva y por eso te ha sonado como te ha sonado. Un brasileño diría «moça» o «menina». Es el ejemplo más citado de que las dos normas no sólo cambian de vocabulario: a veces la misma palabra tiene cargas opuestas, y conviene saberlo antes de usarla.',
    wordRange: [50, 110], register: 'neutro', address: 'tu',
  },
  {
    id: 'EXP-29-11', concepto: LEX, lenguaExplicacion: 'es',
    sourceText: '🇵🇹 «Já paguei a propina deste semestre.»',
    audience: 'un amigo mexicano que ha entendido que alguien ha sobornado a la universidad',
    instruccion: 'Explícale qué significa «propina» en Portugal y por qué su lectura es la del español.',
    puntosClave: [
      { dice: 'que en Portugal es la tasa de matrícula', ancla: ['tasa de matrícula'] },
      { dice: 'que su lectura viene del español', ancla: ['del español'] },
      { dice: 'que para la propina del camarero se dice «gorjeta»', ancla: ['gorjeta'] },
    ],
    modelo: 'Tranquilo, que nadie ha sobornado a nadie: en Portugal «propina» es la tasa de matrícula que se paga a la universidad cada semestre. Tu lectura viene del español, donde la palabra significa lo que le das al camarero, y en México además arrastra lo del soborno. Para lo del camarero, el portugués dice «gorjeta». Es un falso amigo con trampa doble, porque las tres lecturas existen en alguna de las lenguas y ninguna coincide con la otra.',
    wordRange: [50, 110], register: 'informal', address: 'tu',
  },
  {
    id: 'EXP-29-12', concepto: LEX, lenguaExplicacion: 'es',
    sourceText: '🇵🇹 «Deu-me boleia até à estação e nem quis dinheiro do pequeno-almoço.»',
    audience: 'una alumna que sólo conoce el vocabulario brasileño',
    instruccion: 'Explícale las dos palabras marcadas y con qué las sustituiría un brasileño.',
    puntosClave: [
      { dice: 'que «boleia» es llevar a alguien en coche', ancla: ['en coche'] },
      { dice: 'que el brasileño dice «carona»', ancla: ['carona'] },
      { dice: 'que el desayuno es «pequeno-almoço» y no «café da manhã»', ancla: ['pequeno-almoço'] },
    ],
    modelo: 'Hay dos. «Boleia» es llevar a alguien en coche sin cobrarle, lo que nosotros llamamos llevar a alguien o hacerle un puente; el brasileño dice «carona». Y «pequeno-almoço» es el desayuno, literalmente el almuerzo pequeño, mientras que en Brasil es «café da manhã». Ojo con esta segunda, porque en Portugal «almoço» a secas es la comida del mediodía: si dices «almoço» pensando en el desayuno, quedas para el mediodía.',
    wordRange: [50, 110], register: 'informal', address: 'tu',
  },

  // ── b10-var-tratamento (2) ───────────────────────────────────────
  {
    id: 'EXP-29-13', concepto: TRA, lenguaExplicacion: 'es',
    sourceText: '— O senhor Almeida já almoçou? — Já, obrigado.',
    audience: 'un compañero que trata de «você» a todo el mundo en la oficina de Lisboa',
    instruccion: 'Explícale qué hace esa pregunta y por qué su «você» no es el equivalente cómodo que él cree.',
    puntosClave: [
      { dice: 'que en Portugal se trata a alguien nombrándolo en tercera persona', ancla: ['tercera persona'] },
      { dice: 'que «você» puede sonar áspero con un superior o un desconocido', ancla: ['áspero'] },
      { dice: 'que la salida corriente es el nombre o el cargo', ancla: ['el nombre o el cargo'] },
    ],
    modelo: 'Fíjate en que no aparece ningún pronombre: en Portugal se trata a alguien nombrándolo y poniendo el verbo en tercera persona, «o senhor Almeida já almoçou». Tu «você» no es el equivalente cómodo de nuestro «usted»; puede sonar áspero con un superior o con un desconocido, y mucha gente lo evita justamente así. La salida corriente es el nombre o el cargo: «o Pedro quer um café?», «a doutora precisa de alguma coisa?». Con los amigos y los compañeros de tu edad, «tu» y sin miedo.',
    wordRange: [50, 110], register: 'formal', address: 'tu',
  },
  {
    id: 'EXP-29-14', concepto: TRA, lenguaExplicacion: 'es',
    sourceText: '🇧🇷 «Você viu o e-mail que eu te mandei?» · 🇵🇹 «Viste o e-mail que te mandei?»',
    audience: 'una amiga que va a escribir a un compañero portugués de su edad',
    instruccion: 'Explícale por qué la segunda frase es la natural en Portugal y qué chirría en la primera.',
    puntosClave: [
      { dice: 'que entre iguales en Portugal se tutea', ancla: ['se tutea'] },
      { dice: 'que el sujeto se omite porque el verbo ya lo dice', ancla: ['se omite'] },
      { dice: 'que la brasileña mezcla «você» con «te», que en Portugal no casan', ancla: ['no casan'] },
    ],
    modelo: 'Entre iguales, en Portugal se tutea sin más: «viste», segunda persona, y el sujeto se omite porque el verbo ya lo dice. La frase brasileña chirría por dos motivos: usa «você», que allí es el informal normal pero en Portugal marca distancia, y luego lo combina con «te», que es de tutear. Esas dos piezas no casan en la norma europea, donde o vas de «tu/te» o vas de «o senhor/lhe». Escribe la segunda y no te equivocas.',
    wordRange: [50, 110], register: 'informal', address: 'tu',
  },

  // ── b10-var-gerundio (1) ─────────────────────────────────────────
  {
    id: 'EXP-29-15', concepto: GER, lenguaExplicacion: 'es',
    sourceText: '🇵🇹 «Estou a preparar o jantar, mas o tempo vai piorando.» · 🇧🇷 «Estou preparando o jantar…»',
    audience: 'un alumno al que le han dicho que el gerundio no existe en portugués europeo',
    instruccion: 'Explícale qué es verdad y qué es falso en esa afirmación, con las dos formas de la frase delante.',
    puntosClave: [
      { dice: 'que el progresivo europeo es «estar a + infinitivo»', ancla: ['estar a'] },
      { dice: 'que el gerundio SÍ existe en europeo con otro valor', ancla: ['sí existe'] },
      { dice: 'que «ir + gerúndio» expresa avance gradual y es plenamente europeo', ancla: ['avance gradual'] },
    ],
    modelo: 'Te han dicho media verdad. Es cierto que el progresivo europeo se hace con «estar a» más infinitivo —«estou a preparar»— y que «estou preparando» suena brasileño. Pero el gerundio sí existe en portugués europeo, sólo que con otro valor: fíjate en la segunda mitad de la frase, «vai piorando», que es «ir» más gerundio y expresa avance gradual, algo que empeora poco a poco. Eso es plenamente europeo y se oye a diario. La regla útil no es «el gerundio no existe», sino «el progresivo no se hace con gerundio».',
    wordRange: [55, 120], register: 'neutro', address: 'tu',
  },
];

if (process.argv[1]?.includes('lote29-explicar')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.concepto, (porPunto.get(x.concepto) ?? 0) + 1);
  console.log(`# Explicar E2#29 — ${ITEMS.length} ítems · ${porPunto.size} puntos de b10\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  // El preflight de esta familia es el barrido de datos inventados: una
  // explicación de 90 palabras puede colar una fecha o una cifra que la
  // fuente no da, y eso enseña algo falso con el tono de un dato.
  const inv = ITEMS.flatMap((x) => inventadosProbables(x).map((s2) => `${x.id}: ${s2}`));
  console.log(`\n## Datos posiblemente inventados: ${inv.length}\n`);
  for (const l of inv) console.log(`- ${l}`);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

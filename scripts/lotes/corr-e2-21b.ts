// scripts/lotes/corr-e2-21b.ts
//
//   npx tsx scripts/lotes/corr-e2-21b.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-e2-21b.ts --json     # ítems para publicar
//
// CORRECCIÓN · pasada 2. 24 unidades: `b3-interrogativos` (8),
// `b2-dem-neutros` (7), `b2-plural-m-r-s` (7) y `b2-genero-divergente` (2).
//
// **Una nota sobre `b3-interrogativos`, que obligó a rehacer el punto.**
// Su override decía que es trampa y no lo es: los interrogativos
// portugueses y españoles son casi paralelos —«Qual é o teu nome?» /
// «¿Cuál es tu nombre?», «Que livro preferes?» / «¿Qué libro prefieres?»—
// y un lote construido sobre eso no mediría nada. Lo que SÍ diverge, y es
// donde el hispanohablante falla de verdad, son dos cosas: el **número**
// de «Que horas são?» frente a «¿Qué hora es?», y la ortografía de
// **porquê / por que / porque**, que en portugués distingue cuatro
// formas donde el español tiene dos. Los ocho ítems van ahí.
import { verificar, preflight, type ItemCorreccion } from '../lib/correccion';

const INT = 'b3-interrogativos';
const NEU = 'b2-dem-neutros';
const PLU = 'b2-plural-m-r-s';
const DIV = 'b2-genero-divergente';

export const ITEMS: ItemCorreccion[] = [
  // ══ b3-interrogativos (8)
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Que hora é agora?', buena: 'Que horas são agora?',
    calcoEs: '¿Qué hora es ahora?',
    explicacion: 'El portugués pregunta la hora en PLURAL: «que horas são». El español lo hace en singular y de ahí sale el calco, que además arrastra el verbo.',
    varianteEsperada: 'singular calcado del español' },
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Que é isto que está aqui?', buena: 'O que é isto que está aqui?',
    calcoEs: '¿Qué es esto que está aquí?',
    explicacion: 'Cuando «que» va solo, sin sustantivo detrás, el portugués corriente pide «o que». El español no tiene ese artículo y el calco lo deja desnudo.',
    alt: ['O que é que é isto que está aqui?'],
    varianteEsperada: '«que» sin el artículo que el portugués exige' },
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Não sei que fazer com isto.', buena: 'Não sei o que fazer com isto.',
    calcoEs: 'No sé qué hacer con esto.',
    explicacion: 'También en interrogativa indirecta: «não sei o que fazer». El artículo no es opcional cuando «que» va sin sustantivo.',
    varianteEsperada: '«que» sin artículo' },
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Por que não vieste ontem?', buena: 'Porque não vieste ontem?',
    calcoEs: '¿Por qué no viniste ayer?',
    explicacion: 'En la pregunta directa el portugués europeo escribe «porque» junto y sin acento. El español separa «por qué» y el calco copia la separación.',
    alt: ['Por que razão não vieste ontem?'],
    varianteEsperada: 'separación calcada del español' },
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Não vieste e não sei por que.', buena: 'Não vieste e não sei porquê.',
    calcoEs: 'No viniste y no sé por qué.',
    explicacion: 'Al final de la frase, aislado, el portugués usa «porquê» junto y con acento. Es la forma tónica, y el español no tiene esa distinción gráfica.',
    varianteEsperada: 'forma separada donde el portugués usa la tónica' },
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Explicou-me o por que da decisão.', buena: 'Explicou-me o porquê da decisão.',
    calcoEs: 'Me explicó el porqué de la decisión.',
    explicacion: 'Como sustantivo lleva artículo y va junto y con acento: «o porquê». El español también lo escribe junto aquí, pero el calco arrastra la forma separada de las otras posiciones.',
    varianteEsperada: 'sustantivo escrito separado' },
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Não fui porquê estava doente.', buena: 'Não fui porque estava doente.',
    calcoEs: 'No fui porque estaba enfermo.',
    explicacion: 'La conjunción causal va junta y SIN acento: «porque». El acento es sólo de la forma tónica, la que va aislada o sustantivada.',
    varianteEsperada: 'acento donde no toca' },
  { p: INT, pasada: 2, espejoEs: false,
    mala: 'Porque caminho vamos hoje?', buena: 'Por que caminho vamos hoje?',
    calcoEs: '¿Por qué camino vamos hoy?',
    explicacion: 'Cuando «por que» va seguido de un sustantivo se escribe SEPARADO: «por que caminho», «por que motivo». Es la cuarta forma del paradigma, y la que se pierde en cuanto uno aprende que la pregunta suelta va junta.',
    varianteEsperada: 'forma junta donde el portugués separa' },

  // ══ b2-dem-neutros (7) — la contracción obligatoria con el neutro.
  { p: NEU, pasada: 2, espejoEs: false,
    mala: 'Não gosto de isto.', buena: 'Não gosto disto.',
    calcoEs: 'No me gusta esto.',
    explicacion: 'La preposición se contrae obligatoriamente con el demostrativo neutro: de + isto = «disto». El español los deja separados y por eso el calco no contrae.',
    varianteEsperada: 'preposición sin contraer' },
  { p: NEU, pasada: 2, espejoEs: false,
    mala: 'Ninguém falou de isso na reunião.', buena: 'Ninguém falou disso na reunião.',
    calcoEs: 'Nadie habló de eso en la reunión.',
    explicacion: 'de + isso = «disso». La contracción no es opcional ni de registro: es obligatoria.',
    varianteEsperada: 'preposición sin contraer' },
  { p: NEU, pasada: 2, espejoEs: false,
    mala: 'Não quero pensar em aquilo agora.', buena: 'Não quero pensar naquilo agora.',
    calcoEs: 'No quiero pensar en aquello ahora.',
    explicacion: 'em + aquilo = «naquilo». El español mantiene «en aquello» separado, y el calco copia esa separación.',
    varianteEsperada: 'preposición sin contraer' },
  { p: NEU, pasada: 2, espejoEs: false,
    mala: 'Em isto estamos todos de acordo.', buena: 'Nisto estamos todos de acordo.',
    calcoEs: 'En esto estamos todos de acuerdo.',
    explicacion: 'em + isto = «nisto», también al principio de la frase.',
    varianteEsperada: 'preposición sin contraer' },
  { p: NEU, pasada: 2, espejoEs: false,
    mala: 'Ele nunca se lembra de aquilo que promete.', buena: 'Ele nunca se lembra daquilo que promete.',
    calcoEs: 'Él nunca se acuerda de aquello que promete.',
    explicacion: 'de + aquilo = «daquilo». La contracción se mantiene aunque siga una relativa.',
    varianteEsperada: 'preposición sin contraer' },
  { p: NEU, pasada: 2, espejoEs: false,
    mala: 'Não me refiro a isto, refiro-me a aquilo.', buena: 'Não me refiro a isto, refiro-me àquilo.',
    calcoEs: 'No me refiero a esto, me refiero a aquello.',
    explicacion: 'a + aquilo = «àquilo», con acento grave. Con «isto» y «isso» la preposición «a» no se contrae, y por eso la primera mitad de la frase se queda como está: la contracción sólo ocurre con el grado lejano.',
    varianteEsperada: 'sin crase con «aquilo»' },
  { p: NEU, pasada: 2, espejoEs: false,
    mala: 'Isso é o que eu dizia, este mesmo.', buena: 'Isso é o que eu dizia, isso mesmo.',
    calcoEs: 'Eso es lo que yo decía, eso mismo.',
    explicacion: 'El neutro no tiene forma masculina: para referirse a una idea, y no a un objeto de género conocido, se repite «isso» y no «este».',
    varianteEsperada: 'masculino donde el portugués pide neutro' },

  // ══ b2-plural-m-r-s (7) — plurales que el español no tiene.
  { p: PLU, pasada: 2, espejoEs: false,
    mala: 'Vieram três homems à porta.', buena: 'Vieram três homens à porta.',
    calcoEs: 'Vinieron tres hombres a la puerta.',
    explicacion: 'Las palabras acabadas en -m hacen el plural en -ns: «homem» → «homens». El español no tiene esa alternancia y el calco añade la -s directamente.',
    varianteEsperada: 'plural formado a la española' },
  { p: PLU, pasada: 2, espejoEs: false,
    mala: 'A cidade tem muitos jardims.', buena: 'A cidade tem muitos jardins.',
    calcoEs: 'La ciudad tiene muchos jardines.',
    explicacion: '-m → -ns: «jardim» → «jardins». La regla no admite excepciones útiles.',
    varianteEsperada: 'plural formado a la española' },
  { p: PLU, pasada: 2, espejoEs: false,
    mala: 'Faltam dois viagems no relatório.', buena: 'Faltam duas viagens no relatório.',
    calcoEs: 'Faltan dos viajes en el informe.',
    explicacion: 'Doble error de calco: «viagem» es femenino y su plural es «viagens», con -ns.',
    varianteEsperada: 'género y plural calcados' },
  { p: PLU, pasada: 2, espejoEs: false,
    mala: 'Conheço duas mulhers desta terra.', buena: 'Conheço duas mulheres desta terra.',
    calcoEs: 'Conozco a dos mujeres de esta tierra.',
    explicacion: 'Las acabadas en -r añaden -es: «mulher» → «mulheres». El calco pone sólo la -s, como en español.',
    varianteEsperada: 'plural formado a la española' },
  { p: PLU, pasada: 2, espejoEs: false,
    mala: 'Visitámos dois países vizinhos e três mars.', buena: 'Visitámos dois países vizinhos e três mares.',
    calcoEs: 'Visitamos dos países vecinos y tres mares.',
    explicacion: '«Mar» → «mares», con -es como todas las acabadas en -r.',
    varianteEsperada: 'plural formado a la española' },
  { p: PLU, pasada: 2, espejoEs: false,
    mala: 'Passaram-se seis mêses desde então.', buena: 'Passaram-se seis meses desde então.',
    calcoEs: 'Pasaron seis meses desde entonces.',
    explicacion: '«Mês» pierde el acento en plural: «meses». El circunflejo sólo hace falta en singular, donde marca la tónica final.',
    varianteEsperada: 'acento conservado en plural' },
  { p: PLU, pasada: 2, espejoEs: false,
    mala: 'Comprei dois lápises azuis.', buena: 'Comprei dois lápis azuis.',
    calcoEs: 'Compré dos lápices azules.',
    explicacion: 'Las palabras esdrújulas acabadas en -s son invariables: «o lápis» / «os lápis». El español las pluraliza y el calco inventa una forma que no existe.',
    varianteEsperada: 'plural inventado sobre invariable' },

  // ══ b2-genero-divergente (2)
  { p: DIV, pasada: 2, espejoEs: false,
    mala: 'A leite está fria.', buena: 'O leite está frio.',
    calcoEs: 'La leche está fría.',
    explicacion: '«O leite» es masculino en portugués y femenino en español. El calco arrastra el artículo y el adjetivo.',
    varianteEsperada: 'género calcado del español' },
  { p: DIV, pasada: 2, espejoEs: false,
    mala: 'Atravessámos o ponte a pé.', buena: 'Atravessámos a ponte a pé.',
    calcoEs: 'Cruzamos el puente a pie.',
    explicacion: '«A ponte» es femenino en portugués y «el puente» masculino en español: es de los pares de género que más se fallan.',
    varianteEsperada: 'género calcado del español' },
];

if (process.argv[1]?.includes('corr-e2-21b')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección E2#21b — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Preflight\n`);
  for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

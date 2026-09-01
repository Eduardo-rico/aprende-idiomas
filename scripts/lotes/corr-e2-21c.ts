// scripts/lotes/corr-e2-21c.ts
//
//   npx tsx scripts/lotes/corr-e2-21c.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-e2-21c.ts --json     # ítems para publicar
//
// CORRECCIÓN · pasada 3. 25 unidades: `b2-demonstrativos` (7),
// `b12-borde-gramaticalidad` (6), `b2-indef-cada-qualquer` (6) y
// `b2-indef-outro-mesmo` (6).
//
// `b12-borde-gramaticalidad` es el punto que da nombre a la clase: «lo
// que el español permite y el portugués no». Sus seis ítems son las
// construcciones que un hispanohablante culto produce sin sospechar nada,
// porque en su lengua son impecables.
import { verificar, preflight, type ItemCorreccion } from '../lib/correccion';

const DEM = 'b2-demonstrativos';
const BOR = 'b12-borde-gramaticalidad';
const CAD = 'b2-indef-cada-qualquer';
const OUT = 'b2-indef-outro-mesmo';

export const ITEMS: ItemCorreccion[] = [
  // ══ b2-demonstrativos (7) — el sistema de tres grados y sus formas.
  { p: DEM, pasada: 3, espejoEs: false,
    mala: 'Esse livro que tenho aqui é ótimo.', buena: 'Este livro que tenho aqui é ótimo.',
    calcoEs: 'Ese libro que tengo aquí es estupendo.',
    explicacion: 'Lo que está junto a quien habla es «este», no «esse». El español usa «ese» con más soltura y de ahí sale el desplazamiento de grado.',
    varianteEsperada: 'grado desplazado por calco' },
  { p: DEM, pasada: 3, espejoEs: false,
    mala: 'Passa-me este livro que tens aí.', buena: 'Passa-me esse livro que tens aí.',
    calcoEs: 'Pásame este libro que tienes ahí.',
    explicacion: 'Lo que está junto a quien escucha es «esse». El portugués mantiene los tres grados con más rigor que el español coloquial.',
    varianteEsperada: 'grado desplazado por calco' },
  { p: DEM, pasada: 3, espejoEs: false,
    mala: 'Aquele senhor que está aqui ao meu lado perguntou por ti.', buena: 'Este senhor que está aqui ao meu lado perguntou por ti.',
    calcoEs: 'Aquel señor que está aquí a mi lado preguntó por ti.',
    explicacion: '«Aquele» es el grado lejano, incompatible con «aqui ao meu lado». El adverbio y el demostrativo tienen que ir en el mismo grado.',
    varianteEsperada: 'grado incompatible con el adverbio' },
  { p: DEM, pasada: 3, espejoEs: false,
    mala: 'Prefiro esta camisa a essa outra que viste.', buena: 'Prefiro esta camisa àquela outra que viste.',
    calcoEs: 'Prefiero esta camisa a esa otra que viste.',
    explicacion: 'Al contrastar con lo lejano, el portugués va al tercer grado y contrae: a + aquela = «àquela». El español se queda en dos grados y no contrae.',
    varianteEsperada: 'segundo grado y sin crase' },
  { p: DEM, pasada: 3, espejoEs: false,
    mala: 'Naquele tempo em que agora vivemos tudo é rápido.', buena: 'Neste tempo em que agora vivemos tudo é rápido.',
    calcoEs: 'En aquel tiempo en que ahora vivimos todo es rápido.',
    explicacion: 'El tiempo presente pide el primer grado: «neste tempo». «Naquele» remite a un pasado lejano y choca con «agora».',
    varianteEsperada: 'grado incompatible con el tiempo verbal' },
  { p: DEM, pasada: 3, espejoEs: false,
    mala: 'Essa é a mesma coisa que eu disse ontem.', buena: 'Isso é a mesma coisa que eu disse ontem.',
    calcoEs: 'Esa es la misma cosa que yo dije ayer.',
    explicacion: 'Cuando el demostrativo no remite a un sustantivo concreto sino a lo dicho, el portugués usa el neutro «isso». El español no distingue la forma y arrastra el femenino.',
    varianteEsperada: 'femenino donde el portugués pide neutro' },
  { p: DEM, pasada: 3, espejoEs: false,
    mala: 'Este aqui e aquele ali são de esse senhor.', buena: 'Este aqui e aquele ali são desse senhor.',
    calcoEs: 'Este de aquí y aquel de allí son de ese señor.',
    explicacion: 'de + esse = «desse». La contracción es obligatoria también con el segundo grado.',
    varianteEsperada: 'preposición sin contraer' },

  // ══ b12-borde-gramaticalidad (6) — lo que el español permite y el
  // portugués no. Frases que un hispanohablante culto escribe sin dudar.
  { p: BOR, pasada: 3, espejoEs: false,
    mala: 'Vou a falar com ele amanhã.', buena: 'Vou falar com ele amanhã.',
    calcoEs: 'Voy a hablar con él mañana.',
    explicacion: 'La perífrasis de futuro no lleva preposición en portugués: «vou falar». El español la exige y el calco la trae puesta.',
    varianteEsperada: 'preposición espuria calcada' },
  { p: BOR, pasada: 3, espejoEs: false,
    mala: 'Ela disse-me de que não vinha.', buena: 'Ela disse-me que não vinha.',
    calcoEs: 'Ella me dijo de que no venía.',
    explicacion: 'El «de» sobra: «dizer que», sin preposición. El error existe también en español —es el dequeísmo— pero en portugués no tiene ni la coartada del habla descuidada.',
    varianteEsperada: 'dequeísmo trasladado' },
  { p: BOR, pasada: 3, espejoEs: false,
    mala: 'Todos os alunos que estudaram passaram no exame, mas alguns não estudou.', buena: 'Todos os alunos que estudaram passaram no exame, mas alguns não estudaram.',
    calcoEs: 'Todos los alumnos que estudiaron aprobaron el examen, pero algunos no estudió.',
    explicacion: 'El sujeto «alguns» es plural y arrastra el verbo. El error nace de tratar el indefinido como singular, que es lo que el español permite en algunos giros y el portugués no.',
    varianteEsperada: 'concordancia con indefinido' },
  { p: BOR, pasada: 3, espejoEs: false,
    mala: 'Foi ele quem me disse isso a mim.', buena: 'Foi ele que me disse isso a mim.',
    calcoEs: 'Fue él quien me dijo eso a mí.',
    explicacion: 'En la construcción de relieve el portugués europeo corriente usa «que», no «quem». El español prefiere «quien» y el calco lo trae.',
    alt: ['Foi ele quem mo disse a mim.'],
    varianteEsperada: 'relativo calcado del español' },
  { p: BOR, pasada: 3, espejoEs: false,
    mala: 'Preciso que me ajudes com isto, se podes.', buena: 'Preciso que me ajudes com isto, se puderes.',
    calcoEs: 'Necesito que me ayudes con esto, si puedes.',
    explicacion: 'Tras «se» con valor de condición posible, el portugués exige futuro do conjuntivo: «se puderes». El español usa presente de indicativo y ahí se cuela el error.',
    varianteEsperada: 'presente donde el portugués pide futuro do conjuntivo' },
  { p: BOR, pasada: 3, espejoEs: false,
    mala: 'Ele está aqui desde faz duas semanas.', buena: 'Ele está aqui desde há duas semanas.',
    calcoEs: 'Él está aquí desde hace dos semanas.',
    explicacion: 'El portugués usa «há» para el tiempo transcurrido, no «faz»: «desde há duas semanas». «Faz» es el calco directo del español.',
    alt: ['Ele está aqui há duas semanas.'],
    varianteEsperada: '«faz» temporal calcado del español' },

  // ══ b2-indef-cada-qualquer (6)
  { p: CAD, pasada: 3, espejoEs: false,
    mala: 'Cada um dos livros custa dez euros cada.', buena: 'Cada um dos livros custa dez euros.',
    calcoEs: 'Cada uno de los libros cuesta diez euros cada uno.',
    explicacion: '«Cada» no se repite al final como refuerzo: o va delante o no va. La repetición viene del español coloquial.',
    varianteEsperada: 'repetición calcada' },
  { p: CAD, pasada: 3, espejoEs: false,
    mala: 'Podes escolher cada um destes três.', buena: 'Podes escolher qualquer um destes três.',
    calcoEs: 'Puedes elegir cada uno de estos tres.',
    explicacion: 'Para «uno indeterminado, el que sea» el portugués usa «qualquer», no «cada». «Cada» distribuye uno a uno y aquí no distribuye nada.',
    varianteEsperada: 'distributivo donde toca indefinido' },
  { p: CAD, pasada: 3, espejoEs: false,
    mala: 'Qualquer dia da semana vem cá alguém diferente.', buena: 'Cada dia da semana vem cá alguém diferente.',
    calcoEs: 'Cualquier día de la semana viene alguien diferente.',
    explicacion: 'Aquí sí se distribuye —un día, una persona—, así que toca «cada». «Qualquer» dejaría el día indeterminado y rompe la correspondencia.',
    varianteEsperada: 'indefinido donde toca distributivo' },
  { p: CAD, pasada: 3, espejoEs: false,
    mala: 'Não aceito cada desculpa que me deem.', buena: 'Não aceito qualquer desculpa que me deem.',
    calcoEs: 'No acepto cualquier excusa que me den.',
    explicacion: 'En contexto negativo, «qualquer» es el que da el matiz de «ninguna sea cual sea». «Cada» no funciona ahí.',
    varianteEsperada: 'distributivo en contexto negativo' },
  { p: CAD, pasada: 3, espejoEs: false,
    mala: 'Cada quer que venha será bem recebido.', buena: 'Qualquer que venha será bem recebido.',
    calcoEs: 'Cualquiera que venga será bien recibido.',
    explicacion: '«Cualquiera» es una sola palabra en portugués —«qualquer»— y no se descompone. El calco parte la palabra siguiendo el español.',
    varianteEsperada: 'palabra partida por calco' },
  { p: CAD, pasada: 3, espejoEs: false,
    mala: 'Faltaram quaisqueres documentos importantes.', buena: 'Faltaram quaisquer documentos importantes.',
    calcoEs: 'Faltaron cualesquiera documentos importantes.',
    explicacion: 'El plural de «qualquer» es «quaisquer»: cambia por dentro y no añade -es al final.',
    varianteEsperada: 'plural formado a la española' },

  // ══ b2-indef-outro-mesmo (6)
  { p: OUT, pasada: 3, espejoEs: false,
    mala: 'Dá-me um outro café, se faz favor.', buena: 'Dá-me outro café, se faz favor.',
    calcoEs: 'Dame otro café, por favor.',
    explicacion: 'En portugués «outro» no lleva artículo indefinido delante. El «um outro» existe pero significa «uno distinto entre varios», y aquí sobra.',
    varianteEsperada: 'artículo espurio delante de «outro»' },
  { p: OUT, pasada: 3, espejoEs: false,
    mala: 'Vimos a mesma coisa o mesmo dia.', buena: 'Vimos a mesma coisa no mesmo dia.',
    calcoEs: 'Vimos la misma cosa el mismo día.',
    explicacion: 'El complemento de tiempo con «mesmo» pide preposición: «no mesmo dia». El español lo deja sin ella y el calco copia.',
    varianteEsperada: 'complemento temporal sin preposición' },
  { p: OUT, pasada: 3, espejoEs: false,
    mala: 'Ele mesmo veio buscar as chaves ele próprio.', buena: 'Ele próprio veio buscar as chaves.',
    calcoEs: 'Él mismo vino a buscar las llaves él mismo.',
    explicacion: 'El refuerzo va una vez, y en portugués europeo «próprio» es más natural que «mesmo» para el enfático de persona.',
    varianteEsperada: 'refuerzo duplicado' },
  { p: OUT, pasada: 3, espejoEs: false,
    mala: 'Trouxe-te uns outros papéis que faltavam.', buena: 'Trouxe-te outros papéis que faltavam.',
    calcoEs: 'Te traje unos otros papeles que faltaban.',
    explicacion: 'En plural tampoco lleva artículo indefinido: «outros papéis».',
    varianteEsperada: 'artículo espurio en plural' },
  { p: OUT, pasada: 3, espejoEs: false,
    mala: 'Quero outro mais, se faz favor.', buena: 'Quero mais outro, se faz favor.',
    calcoEs: 'Quiero otro más, por favor.',
    explicacion: 'El orden es el contrario del español: «mais outro», no «outro mais». Lo mismo con «mais um», «mais uma vez».',
    varianteEsperada: 'orden calcado del español' },
  { p: OUT, pasada: 3, espejoEs: false,
    mala: 'É a mesma pessoa de sempre, a mesma que conheces.', buena: 'É a mesma pessoa de sempre, aquela que conheces.',
    calcoEs: 'Es la misma persona de siempre, la misma que conoces.',
    explicacion: 'Repetir «a mesma» en la aposición suena redundante en portugués; lo natural es el demostrativo lejano «aquela». El español tolera la repetición.',
    varianteEsperada: 'repetición tolerada en español' },
];

if (process.argv[1]?.includes('corr-e2-21c')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección E2#21c — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Preflight\n`);
  for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

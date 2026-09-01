// scripts/lotes/corr-e2-21d.ts
//
//   npx tsx scripts/lotes/corr-e2-21d.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-e2-21d.ts --json     # ítems para publicar
//
// CORRECCIÓN · pasada 4, la última de E2#21. 21 unidades:
// `b2-poss-seu-ambiguo` (5), `b3-exist-ter-br` (5), `reg-verbal-por-para`
// (5), `b2-genero-comum` (2), `b2-indef-todo-tudo` (2) y
// `reg-verbal-zero` (2).
//
// ── LO QUE SE MIDIÓ ANTES DE ESCRIBIR `b3-exist-ter-br` ──────────────
//
// Es el único de los seis donde el error NO nace del español, y por poco
// no se escribe. El existencial puro —«Tem muita gente na praia» por «Há
// muita gente na praia»— falla las dos condiciones a la vez:
//
//   1. No es lo que un hispanohablante produce: sale de la exposición al
//      brasileño, no del calco. El español no tiene «tener» existencial.
//   2. Es ESPEJO del español. El español pone «hay» justo donde el
//      portugués europeo pone «há», así que traducir entrega la
//      corrección entera. Es el atajo que mató al juicio en E2#20, aquí
//      por la otra puerta: el error no es el calco, es lo contrario del
//      calco, y el calco es la respuesta.
//
// Hay un sub-dominio donde ninguna de las dos se cumple: el «tem»
// TEMPORAL brasileño. «Tem dois anos que moro aqui» se corrige con «Há
// dois anos», y el español ahí NO ayuda — da «hace», que en portugués
// sale «faz» y es igual de brasileño. Las tres lenguas se separan en tres
// direcciones, así que traducir no entrega nada. Los cinco ítems del
// punto viven en ese sub-dominio; el existencial puro queda sin cubrir en
// este formato, dicho aquí en vez de rellenado.
import { verificar, preflight, type ItemCorreccion } from '../lib/correccion';

const SEU = 'b2-poss-seu-ambiguo';
const TER = 'b3-exist-ter-br';
const PPA = 'reg-verbal-por-para';
const GEN = 'b2-genero-comum';
const TUD = 'b2-indef-todo-tudo';
const ZER = 'reg-verbal-zero';

export const ITEMS: ItemCorreccion[] = [
  // ══ b2-poss-seu-ambiguo (5) — «seu» se lee como «de você» en la norma
  // europea, así que la tercera persona se dice POSPUESTA: dele/dela. El
  // español no tiene el conflicto: su «su» no compite con el tratamiento.
  { p: SEU, pasada: 4, espejoEs: false,
    mala: 'Falei com a Ana sobre o seu irmão.', buena: 'Falei com a Ana sobre o irmão dela.',
    calcoEs: 'Hablé con Ana sobre su hermano.',
    explicacion: 'Con la Ana delante, «o seu irmão» se entiende como «el hermano de usted», no como el de ella. Para la tercera persona el portugués pospone: «o irmão dela».',
    varianteEsperada: 'posesivo antepuesto calcado del español' },
  { p: SEU, pasada: 4, espejoEs: false,
    mala: 'Encontrei a Sofia e o seu marido no mercado.', buena: 'Encontrei a Sofia e o marido dela no mercado.',
    calcoEs: 'Encontré a Sofía y a su marido en el mercado.',
    explicacion: 'Igual: «o seu marido» dicho a alguien es el marido de esa persona. El de la Sofia es «o marido dela».',
    varianteEsperada: 'posesivo antepuesto calcado del español' },
  { p: SEU, pasada: 4, espejoEs: false,
    mala: 'Perguntei ao doutor Silva pela sua filha.', buena: 'Perguntei ao doutor Silva pela filha dele.',
    calcoEs: 'Le pregunté al doctor Silva por su hija.',
    explicacion: 'Aquí la ambigüedad es doble, porque al doctor se le trata de «o senhor» y «sua» apunta justo a ese tratamiento. «A filha dele» deshace las dos lecturas.',
    varianteEsperada: 'posesivo antepuesto calcado del español' },
  { p: SEU, pasada: 4, espejoEs: false,
    mala: 'Gosto da Ana, mas não suporto o seu namorado.', buena: 'Gosto da Ana, mas não suporto o namorado dela.',
    calcoEs: 'Ana me cae bien, pero no soporto a su novio.',
    explicacion: 'El poseedor no es quien habla ni a quien se habla: es la Ana, tercera persona. Por eso «dela».',
    varianteEsperada: 'posesivo antepuesto calcado del español' },
  { p: SEU, pasada: 4, espejoEs: false,
    mala: 'Estive em casa dos meus tios e vi as suas fotografias antigas.', buena: 'Estive em casa dos meus tios e vi as fotografias antigas deles.',
    calcoEs: 'Estuve en casa de mis tíos y vi sus fotografías antiguas.',
    explicacion: 'Con poseedor plural de tercera persona, «deles». Va al final del sintagma, detrás del adjetivo.',
    varianteEsperada: 'posesivo antepuesto calcado del español' },

  // ══ b3-exist-ter-br (5) — el «tem» temporal brasileño. Ver la cabecera:
  // el existencial puro es espejo del español y no se escribe.
  { p: TER, pasada: 4, espejoEs: false,
    mala: 'Tem dois anos que moro aqui.', buena: 'Há dois anos que moro aqui.',
    calcoEs: 'Hace dos años que vivo aquí.',
    explicacion: 'El marcador temporal es «há». El brasileño admite «tem» y el español dice «hace» —que tienta a poner «faz»—, pero la norma europea sólo tiene «há».',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: el ítem enseña la frontera de variedad, no un error absoluto' },
  { p: TER, pasada: 4, espejoEs: false,
    mala: 'Tem muito tempo que não o vejo.', buena: 'Há muito tempo que não o vejo.',
    calcoEs: 'Hace mucho tiempo que no lo veo.',
    explicacion: 'Mismo marcador con cantidad imprecisa: «há muito tempo». Ni «tem» ni «faz».',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: el ítem enseña la frontera de variedad, no un error absoluto' },
  { p: TER, pasada: 4, espejoEs: false,
    mala: 'Tem uma semana que chegaram de férias.', buena: 'Há uma semana que chegaram de férias.',
    calcoEs: 'Hace una semana que volvieron de vacaciones.',
    explicacion: 'El verbo de la subordinada va en pretérito y el marcador sigue siendo «há»: el tiempo del marcador no depende del de la frase.',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: el ítem enseña la frontera de variedad, no un error absoluto' },
  { p: TER, pasada: 4, espejoEs: false,
    mala: 'Tem três dias que o telemóvel não funciona.', buena: 'Há três dias que o telemóvel não funciona.',
    calcoEs: 'Hace tres días que el móvil no funciona.',
    explicacion: 'Con la subordinada en presente, igual. Y nótese que «telemóvel» es la palabra europea: el brasileño diría «celular», que es otra frontera de la misma frase.',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: el ítem enseña la frontera de variedad, no un error absoluto' },
  { p: TER, pasada: 4, espejoEs: false,
    mala: 'Faz dois meses que não chove.', buena: 'Há dois meses que não chove.',
    calcoEs: 'Hace dos meses que no llueve.',
    explicacion: 'Ésta es la entrada por el español: «hace» sale «faz» palabra por palabra, y «faz» en función temporal también es brasileño. La forma europea vuelve a ser «há».',
    varianteEsperada: 'el calco español y la variante brasileña coinciden en la misma forma' },

  // ══ reg-verbal-por-para (5) — el español pone otra preposición, o
  // ninguna, justo donde el portugués pide «por» o «para».
  { p: PPA, pasada: 4, espejoEs: false,
    mala: 'O meu irmão apaixonou-se da vizinha.', buena: 'O meu irmão apaixonou-se pela vizinha.',
    calcoEs: 'Mi hermano se enamoró de la vecina.',
    explicacion: 'El portugués rige «apaixonar-se POR», y «por + a» se contrae en «pela». El «de» viene del español.',
    varianteEsperada: 'preposición calcada del español' },
  { p: PPA, pasada: 4, espejoEs: false,
    mala: 'O bebé olhava a mãe com atenção.', buena: 'O bebé olhava para a mãe com atenção.',
    calcoEs: 'El bebé miraba a la madre con atención.',
    explicacion: '«Olhar» pide «para» cuando hay alguien o algo a quien se mira. Sin preposición, el español suena natural y el portugués queda cojo.',
    varianteEsperada: 'preposición ausente por calco' },
  { p: PPA, pasada: 4, espejoEs: false,
    mala: 'A janela da cozinha dá ao jardim.', buena: 'A janela da cozinha dá para o jardim.',
    calcoEs: 'La ventana de la cocina da al jardín.',
    explicacion: '«Dar para» es la regencia fija de la orientación de un vano. El «a» del español no vale aquí.',
    varianteEsperada: 'preposición calcada del español' },
  { p: PPA, pasada: 4, espejoEs: false,
    mala: 'Traduziu o livro ao português.', buena: 'Traduziu o livro para português.',
    alt: ['Traduziu o livro para o português.'],
    calcoEs: 'Tradujo el libro al portugués.',
    explicacion: 'La lengua de llegada va con «para», no con «a»: el español contrae «a + el» y de ahí sale el error. Lo normal es dejarla sin artículo —«para português», «para francês»—, pero con artículo también corre.',
    varianteEsperada: 'preposición y artículo calcados del español' },
  { p: PPA, pasada: 4, espejoEs: false,
    mala: 'Vou a casa, que já é tarde e quero deitar-me.', buena: 'Vou para casa, que já é tarde e quero deitar-me.',
    calcoEs: 'Me voy a casa, que ya es tarde y quiero acostarme.',
    explicacion: 'El portugués distingue con la preposición lo que el español deja al contexto: «ir a» es ida y vuelta breve, «ir para» es quedarse. Quien se acuesta va «para» casa.',
    varianteEsperada: 'preposición calcada del español' },

  // ══ b2-genero-comum (2) — sustantivos de una sola forma para los dos
  // géneros, ahí donde el español SÍ tiene femenino en -a.
  { p: GEN, pasada: 4, espejoEs: false,
    mala: 'A chefa nova chegou hoje.', buena: 'A chefe nova chegou hoje.',
    calcoEs: 'La jefa nueva llegó hoy.',
    explicacion: '«Chefe» es de género común: sólo cambia el artículo. El español tiene «jefa» y el portugués no tiene «chefa».',
    varianteEsperada: 'femenino en -a inventado desde el español' },
  { p: GEN, pasada: 4, espejoEs: false,
    mala: 'A clienta esperou meia hora ao balcão.', buena: 'A cliente esperou meia hora ao balcão.',
    calcoEs: 'La clienta esperó media hora en el mostrador.',
    explicacion: 'Igual que «chefe»: «cliente» no tiene forma femenina propia. El español sí admite «clienta», y de ahí sale el calco.',
    varianteEsperada: 'femenino en -a inventado desde el español' },

  // ══ b2-indef-todo-tudo (2) — el español tiene una palabra para lo que
  // el portugués parte en dos.
  { p: TUD, pasada: 4, espejoEs: false,
    mala: 'Todo está pronto para a festa.', buena: 'Tudo está pronto para a festa.',
    calcoEs: 'Todo está listo para la fiesta.',
    explicacion: 'Cuando «todo» no acompaña a ningún sustantivo y significa «el conjunto de las cosas», el portugués usa «tudo», que es invariable. «Todo» es adjetivo y concuerda.',
    varianteEsperada: 'una sola palabra en español, dos en portugués' },
  { p: TUD, pasada: 4, espejoEs: false,
    mala: 'Obrigado por todo, foste muito simpático.', buena: 'Obrigado por tudo, foste muito simpático.',
    calcoEs: 'Gracias por todo, has sido muy amable.',
    explicacion: 'La fórmula fija es «obrigado por tudo». Detrás de la preposición sigue sin haber sustantivo, así que sigue siendo «tudo».',
    varianteEsperada: 'una sola palabra en español, dos en portugués' },

  // ══ reg-verbal-zero (2) — el español pone preposición donde el
  // portugués no pone ninguna. El calco es español impecable.
  { p: ZER, pasada: 4, espejoEs: false,
    mala: 'Vou a buscar o pão à padaria.', buena: 'Vou buscar o pão à padaria.',
    calcoEs: 'Voy a buscar el pan a la panadería.',
    explicacion: '«Ir buscar» va sin preposición. El «a» del español se cuela porque allí es obligatorio, y aquí convierte la perífrasis en otra cosa.',
    varianteEsperada: 'preposición espuria del español' },
  { p: ZER, pasada: 4, espejoEs: false,
    mala: 'Tentei de explicar tudo com calma.', buena: 'Tentei explicar tudo com calma.',
    calcoEs: 'Traté de explicarle todo con calma.',
    explicacion: '«Tentar» rige infinitivo sin preposición: el «de» sale de «tratar de», donde el español sí lo pide.',
    varianteEsperada: 'preposición espuria del español' },
];

if (process.argv[1]?.includes('corr-e2-21d')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección E2#21d — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Preflight\n`);
  for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

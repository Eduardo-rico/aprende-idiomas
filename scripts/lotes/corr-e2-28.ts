// scripts/lotes/corr-e2-28.ts
//
//   npx tsx scripts/lotes/corr-e2-28.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-e2-28.ts --json     # ítems para publicar
//
// E2#28 · 20 unidades de corrección, contra el hueco recalculado justo
// antes de escribir: 73 unidades en 19 puntos, de las que estos cuatro
// son los que piden ≥5 y por tanto van por producción.
//
// La condición dura del formato sigue siendo la primera: **la frase de
// partida tiene que ser la que un hispanohablante produce de verdad.** Los
// cuatro puntos la cumplen por motivos distintos:
//
//   · `b2-art-contr-em` — el español no contrae «en + el», así que
//     escribir «em o» es literalmente traducir palabra por palabra.
//   · `b7-gerundio-brasileiro` — aquí el calco español y la forma
//     brasileña son LA MISMA: «estoy comiendo» sale «estou comendo». Es el
//     único punto de variedad donde la condición 1 se cumple sola.
//   · `b2-genero-comum` — el español tiene femenino en -a donde el
//     portugués tiene una sola forma: «presidenta», «asistenta».
//   · `reg-verbal-zero` — el español pone preposición donde el portugués
//     no pone ninguna, y el calco es español impecable.
import { verificar, preflight, type ItemCorreccion } from '../lib/correccion';

const EM = 'b2-art-contr-em';
const GER = 'b7-gerundio-brasileiro';
const GEN = 'b2-genero-comum';
const ZER = 'reg-verbal-zero';

export const ITEMS: ItemCorreccion[] = [
  // ══ b2-art-contr-em (7) — em + artículo se funden siempre.
  { p: EM, pasada: 1, espejoEs: false,
    mala: 'Moro em o centro da cidade desde 2019.', buena: 'Moro no centro da cidade desde 2019.',
    calcoEs: 'Vivo en el centro de la ciudad desde 2019.',
    explicacion: 'em + o = «no». La contracción es obligatoria: el español no funde «en el» y por eso el calco las deja sueltas.',
    varianteEsperada: 'preposición y artículo sin contraer' },
  { p: EM, pasada: 1, espejoEs: false,
    mala: 'Deixei as chaves em a mesa da cozinha.', buena: 'Deixei as chaves na mesa da cozinha.',
    calcoEs: 'Dejé las llaves en la mesa de la cocina.',
    explicacion: 'em + a = «na». Igual que la anterior, en femenino.',
    varianteEsperada: 'preposición y artículo sin contraer' },
  { p: EM, pasada: 1, espejoEs: false,
    mala: 'Os miúdos estão em os quartos deles.', buena: 'Os miúdos estão nos quartos deles.',
    calcoEs: 'Los niños están en sus cuartos.',
    explicacion: 'em + os = «nos». La contracción también es obligatoria en plural.',
    varianteEsperada: 'preposición y artículo sin contraer' },
  { p: EM, pasada: 1, espejoEs: false,
    mala: 'Pus os livros em as prateleiras de cima.', buena: 'Pus os livros nas prateleiras de cima.',
    calcoEs: 'Puse los libros en las estanterías de arriba.',
    explicacion: 'em + as = «nas».',
    varianteEsperada: 'preposición y artículo sin contraer' },
  { p: EM, pasada: 1, espejoEs: false,
    mala: 'Ficámos em um hotel perto da praia.', buena: 'Ficámos num hotel perto da praia.',
    calcoEs: 'Nos quedamos en un hotel cerca de la playa.',
    explicacion: 'La contracción alcanza también al indefinido: em + um = «num». El español no la tiene y por eso ésta se escapa incluso a quien ya hace «no» y «na».',
    varianteEsperada: 'preposición e indefinido sin contraer' },
  { p: EM, pasada: 1, espejoEs: false,
    mala: 'Vivo em uma aldeia muito pequena.', buena: 'Vivo numa aldeia muito pequena.',
    calcoEs: 'Vivo en un pueblo muy pequeño.',
    explicacion: 'em + uma = «numa». La misma regla del indefinido, en femenino.',
    varianteEsperada: 'preposición e indefinido sin contraer' },
  { p: EM, pasada: 1, espejoEs: false,
    mala: 'Acredito em o que dizes, não te preocupes.', buena: 'Acredito no que dizes, não te preocupes.',
    calcoEs: 'Creo en lo que dices, no te preocupes.',
    explicacion: 'También con el artículo neutro: «no que», nunca «em o que». El español dice «en lo que» y ahí no hay nada que contraer.',
    varianteEsperada: 'preposición y artículo sin contraer' },

  // ══ b7-gerundio-brasileiro (7) — el progresivo europeo es «estar a +
  // infinitivo». El gerundio con «estar» es la norma brasileña, y el
  // hispanohablante lo produce solo porque su lengua hace igual.
  { p: GER, pasada: 1, espejoEs: false,
    mala: 'Estou comendo agora, ligo-te daqui a bocado.', buena: 'Estou a comer agora, ligo-te daqui a bocado.',
    calcoEs: 'Estoy comiendo ahora, te llamo dentro de un rato.',
    explicacion: 'El progresivo del estándar europeo es «estar a + infinitivo». El gerundio con «estar» es la norma brasileña, y coincide con la española: por eso sale solo.',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: aquí se corrige a la norma europea' },
  { p: GER, pasada: 1, espejoEs: false,
    mala: 'Ela está estudando para o exame de sexta.', buena: 'Ela está a estudar para o exame de sexta.',
    calcoEs: 'Está estudiando para el examen del viernes.',
    explicacion: '«Estar a + infinitivo», no «estar + gerúndio».',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: aquí se corrige a la norma europea' },
  { p: GER, pasada: 1, espejoEs: false,
    mala: 'Estamos esperando há mais de uma hora.', buena: 'Estamos à espera há mais de uma hora.',
    alt: ['Estamos a esperar há mais de uma hora.'],
    calcoEs: 'Llevamos más de una hora esperando.',
    explicacion: 'Con «esperar», el europeo prefiere la locución «estar à espera»; «estar a esperar» también corre. Lo que no corre es el gerundio.',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: aquí se corrige a la norma europea' },
  { p: GER, pasada: 1, espejoEs: false,
    mala: 'Eles estão trabalhando no jardim das traseiras.', buena: 'Eles estão a trabalhar no jardim das traseiras.',
    calcoEs: 'Están trabajando en el jardín de atrás.',
    explicacion: '«Estar a + infinitivo» también en plural: el auxiliar concuerda y el infinitivo no cambia.',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: aquí se corrige a la norma europea' },
  { p: GER, pasada: 1, espejoEs: false,
    mala: 'Estava chovendo quando saímos de casa.', buena: 'Estava a chover quando saímos de casa.',
    calcoEs: 'Estaba lloviendo cuando salimos de casa.',
    explicacion: 'La perífrasis funciona igual en pasado: «estava a chover».',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: aquí se corrige a la norma europea' },
  { p: GER, pasada: 1, espejoEs: false,
    mala: 'Estou lendo um livro muito bom sobre Lisboa.', buena: 'Estou a ler um livro muito bom sobre Lisboa.',
    calcoEs: 'Estoy leyendo un libro muy bueno sobre Lisboa.',
    explicacion: 'Con verbos en -er es igual: «estou a ler».',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: aquí se corrige a la norma europea' },
  { p: GER, pasada: 1, espejoEs: false,
    mala: 'Ele está dormindo, não faças barulho.', buena: 'Ele está a dormir, não faças barulho.',
    calcoEs: 'Está durmiendo, no hagas ruido.',
    explicacion: 'Y con verbos en -ir: «está a dormir».',
    varianteEsperada: 'la frase de partida es portugués de Brasil correcto: aquí se corrige a la norma europea' },

  // ══ b2-genero-comum (3) — el español tiene un femenino en -a que el
  // portugués no tiene: una sola forma para los dos géneros.
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'A presidenta da associação falou primeiro.', buena: 'A presidente da associação falou primeiro.',
    calcoEs: 'La presidenta de la asociación habló primero.',
    explicacion: '«Presidente» es de género común: sólo cambia el artículo. El español tiene «presidenta» y el portugués no.',
    varianteEsperada: 'femenino en -a inventado desde el español' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'A assistenta social veio cá na semana passada.', buena: 'A assistente social veio cá na semana passada.',
    calcoEs: 'La asistenta social vino la semana pasada.',
    explicacion: 'Igual: «assistente» no tiene forma femenina propia, y el español sí tiene «asistenta».',
    varianteEsperada: 'femenino en -a inventado desde el español' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'A parenta que veio de Lisboa fica cá dois dias.', buena: 'A parente que veio de Lisboa fica cá dois dias.',
    calcoEs: 'La parienta que vino de Lisboa se queda dos días.',
    explicacion: '«Parente» es de género común. El español coloquial dice «parienta» y de ahí sale el calco.',
    varianteEsperada: 'femenino en -a inventado desde el español' },

  // ══ reg-verbal-zero (3) — el español pone preposición donde el
  // portugués no pone ninguna.
  { p: ZER, pasada: 1, espejoEs: false,
    mala: 'Ameaçou com ir-se embora se não o ouvissem.', buena: 'Ameaçou ir-se embora se não o ouvissem.',
    calcoEs: 'Amenazó con irse si no lo escuchaban.',
    explicacion: '«Ameaçar» rige infinitivo sin preposición. El «con» viene del español, que sí la pide.',
    varianteEsperada: 'preposición espuria del español' },
  { p: ZER, pasada: 1, espejoEs: false,
    mala: 'Esperámos a que ele chegasse para começar.', buena: 'Esperámos que ele chegasse para começar.',
    calcoEs: 'Esperamos a que llegara para empezar.',
    explicacion: '«Esperar que» va sin preposición cuando lleva subordinada. El «a» es el del español «esperar a que».',
    varianteEsperada: 'preposición espuria del español' },
  { p: ZER, pasada: 1, espejoEs: false,
    mala: 'Vou a levar o carro à oficina amanhã.', buena: 'Vou levar o carro à oficina amanhã.',
    calcoEs: 'Voy a llevar el coche al taller mañana.',
    explicacion: 'La perífrasis de futuro es «ir + infinitivo», sin «a». El español la construye con «a» y ahí se cuela.',
    varianteEsperada: 'preposición espuria del español' },
];

if (process.argv[1]?.includes('corr-e2-28')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección E2#28 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Preflight\n`);
  for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

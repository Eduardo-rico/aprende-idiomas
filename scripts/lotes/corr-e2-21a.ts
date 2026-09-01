// scripts/lotes/corr-e2-21a.ts
//
//   npx tsx scripts/lotes/corr-e2-21a.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-e2-21a.ts --json     # ítems para publicar
//
// CORRECCIÓN · pasada 1. 24 unidades: `b2-art-com-nome` (8),
// `b2-genero-agem-dade` (8) y `b2-art-com-posesivo` (7), más uno de
// `b2-artigos`.
//
// Son los tres puntos con los que murió el juicio en E2#20, y aquí está
// la diferencia: allí el alumno elegía entre dos frases y la glosa
// española le decía cuál —19 aciertos de 24 sin saber portugués—; aquí
// tiene que ESCRIBIR «a minha casa», y para eso no hay traducción que
// consultar.
//
// Cada frase mala sale de un calco declarado. No son errores inventados:
// son las frases que un hispanohablante escribe al traducir literalmente,
// que es lo único que hace que el ejercicio mida su interlengua.
import { verificar, preflight, type ItemCorreccion } from '../lib/correccion';

const NOM = 'b2-art-com-nome';
const GEN = 'b2-genero-agem-dade';
const POS = 'b2-art-com-posesivo';
const ART = 'b2-artigos';

export const ITEMS: ItemCorreccion[] = [
  // ══ b2-art-com-nome (8) — el artículo delante del nombre propio.
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'João chegou atrasado outra vez.', buena: 'O João chegou atrasado outra vez.',
    calcoEs: 'Juan llegó tarde otra vez.',
    explicacion: 'En portugués europeo el nombre propio de persona lleva artículo cuando se habla de alguien conocido: «o João», «a Maria». El español lo omite, y de ahí sale el error.',
    varianteEsperada: 'la frase mala es la brasileña/española: sin artículo' },
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'Encontrei Rita no mercado.', buena: 'Encontrei a Rita no mercado.',
    calcoEs: 'Encontré a Rita en el mercado.',
    explicacion: 'Con nombre propio de persona hace falta el artículo, y aquí además desaparece la «a» de complemento directo que el español pone y el portugués no.',
    varianteEsperada: 'sin artículo delante del nombre' },
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'Falei com Pedro sobre o assunto.', buena: 'Falei com o Pedro sobre o assunto.',
    calcoEs: 'Hablé con Pedro sobre el asunto.',
    explicacion: 'La preposición no basta: el nombre propio sigue pidiendo artículo. En Portugal «falar com Pedro» marca al hablante como extranjero.',
    varianteEsperada: 'sin artículo tras preposición' },
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'O livro é de Ana.', buena: 'O livro é da Ana.',
    calcoEs: 'El libro es de Ana.',
    explicacion: 'Con artículo, la preposición se contrae: de + a = «da». Sin él no hay contracción y la frase queda con el molde español.',
    varianteEsperada: 'sin contracción, porque falta el artículo' },
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'Perguntei a Sofia se vinha.', buena: 'Perguntei à Sofia se vinha.',
    calcoEs: 'Le pregunté a Sofía si venía.',
    explicacion: 'a + a = «à», con acento grave. El español tiene la misma preposición pero no el artículo, así que la contracción no aparece nunca al traducir literalmente.',
    varianteEsperada: 'sin crase, porque falta el artículo' },
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'Vamos com Carlos e Teresa.', buena: 'Vamos com o Carlos e a Teresa.',
    calcoEs: 'Vamos con Carlos y Teresa.',
    explicacion: 'Cada nombre propio lleva su artículo, y cada uno el suyo por género. En una enumeración el error se duplica.',
    varianteEsperada: 'dos nombres propios sin artículo' },
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'Dei o recado a Miguel ontem.', buena: 'Dei o recado ao Miguel ontem.',
    calcoEs: 'Le di el recado a Miguel ayer.',
    explicacion: 'a + o = «ao». La contracción sólo aparece si se pone el artículo que el portugués exige delante del nombre.',
    varianteEsperada: 'sin contracción por falta de artículo' },
  { p: NOM, pasada: 1, espejoEs: false,
    mala: 'A casa de Manuel fica ali.', buena: 'A casa do Manuel fica ali.',
    calcoEs: 'La casa de Manuel queda allí.',
    explicacion: 'de + o = «do». El español dice «de Manuel» y el portugués «do Manuel», porque el nombre propio va determinado.',
    varianteEsperada: 'sin contracción por falta de artículo' },

  // ══ b2-genero-agem-dade (8) — el género del sufijo.
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'Adiámos o viagem por causa do tempo.', buena: 'Adiámos a viagem por causa do tempo.',
    calcoEs: 'Aplazamos el viaje por culpa del tiempo.',
    explicacion: 'Los sustantivos en -agem son femeninos en portugués. El masculino viene del español «el viaje», que es donde nace el error.',
    varianteEsperada: 'género calcado del español' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'Deixámos o carro no garagem.', buena: 'Deixámos o carro na garagem.',
    calcoEs: 'Dejamos el coche en el garaje.',
    explicacion: 'Como «a garagem» es femenino, la contracción es «na» y no «no». El error de género arrastra al de contracción.',
    varianteEsperada: 'contracción masculina por género calcado' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'A massagem foi muito bom.', buena: 'A massagem foi muito boa.',
    calcoEs: 'El masaje estuvo muy bueno.',
    explicacion: 'El adjetivo tiene que concordar con «a massagem», que es femenino como todo sustantivo en -agem. El español «el masaje» empuja al masculino.',
    varianteEsperada: 'adjetivo en masculino por calco' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'A paisagem é muito bonito.', buena: 'A paisagem é muito bonita.',
    calcoEs: 'El paisaje es muy bonito.',
    explicacion: 'El artículo ya iba bien, pero el adjetivo se quedó en masculino por el español «el paisaje». Con -agem todo concuerda en femenino.',
    varianteEsperada: 'adjetivo en masculino por calco' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'Visitámos o cidade inteiro num dia.', buena: 'Visitámos a cidade inteira num dia.',
    calcoEs: 'Visitamos la ciudad entera en un día.',
    explicacion: 'Los sustantivos en -dade son femeninos. Aquí el español no ayuda ni estorba —«la ciudad» también lo es— así que el error es del sufijo, no del calco.',
    varianteEsperada: 'género equivocado del sufijo -dade' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'Ninguém duvidou do verdade.', buena: 'Ninguém duvidou da verdade.',
    calcoEs: 'Nadie dudó de la verdad.',
    explicacion: 'de + a = «da», porque «a verdade» es femenino como todos los sustantivos en -dade.',
    varianteEsperada: 'contracción masculina con sustantivo femenino' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'A universidade está fechado hoje.', buena: 'A universidade está fechada hoje.',
    calcoEs: 'La universidad está cerrado hoy.',
    explicacion: 'El participio concuerda con «a universidade», femenino como todos los sustantivos en -dade. Aquí el descuido no viene del español, que también lo tiene femenino: viene de no aplicar el sufijo.',
    varianteEsperada: 'participio sin concordar' },
  { p: GEN, pasada: 1, espejoEs: false,
    mala: 'Fizemos uma reportagem sobre o mesmo tema, muito completo.', buena: 'Fizemos uma reportagem sobre o mesmo tema, muito completa.',
    calcoEs: 'Hicimos un reportaje sobre el mismo tema, muy completo.',
    explicacion: 'El adjetivo final describe la reportagem, que es femenina; el español «un reportaje» empuja al masculino y arrastra la concordancia a distancia.',
    varianteEsperada: 'concordancia a distancia calcada' },

  // ══ b2-art-com-posesivo (7) — el artículo delante del posesivo.
  { p: POS, pasada: 1, espejoEs: false,
    mala: 'Minha casa fica perto da estação.', buena: 'A minha casa fica perto da estação.',
    calcoEs: 'Mi casa queda cerca de la estación.',
    explicacion: 'El portugués europeo pone artículo delante del posesivo. Sin él la frase es española o brasileña, pero no de Lisboa.',
    varianteEsperada: 'posesivo sin artículo: forma brasileña' },
  { p: POS, pasada: 1, espejoEs: false,
    mala: 'Deixei tuas chaves em cima da mesa.', buena: 'Deixei as tuas chaves em cima da mesa.',
    calcoEs: 'Dejé tus llaves encima de la mesa.',
    explicacion: 'También en plural: «as tuas chaves». El artículo va delante del posesivo, no se elige.',
    varianteEsperada: 'posesivo sin artículo' },
  { p: POS, pasada: 1, espejoEs: false,
    mala: 'Perdi meu guarda-chuva no comboio.', buena: 'Perdi o meu guarda-chuva no comboio.',
    calcoEs: 'Perdí mi paraguas en el tren.',
    explicacion: 'Artículo y posesivo van juntos: «o meu guarda-chuva». Es de las marcas que más rápido delatan a un hispanohablante en Portugal.',
    varianteEsperada: 'posesivo sin artículo' },
  { p: POS, pasada: 1, espejoEs: false,
    mala: 'Falámos com teus pais no domingo.', buena: 'Falámos com os teus pais no domingo.',
    calcoEs: 'Hablamos con tus padres el domingo.',
    explicacion: 'Ni siquiera los nombres de parentesco en plural se libran: «os teus pais».',
    varianteEsperada: 'posesivo sin artículo' },
  { p: POS, pasada: 1, espejoEs: false,
    mala: 'Gosto muito de sua ideia.', buena: 'Gosto muito da sua ideia.',
    calcoEs: 'Me gusta mucho su idea.',
    explicacion: 'Con artículo la preposición se contrae: de + a = «da sua ideia». Sin él, la contracción desaparece y queda el molde español.',
    varianteEsperada: 'sin contracción por falta de artículo' },
  { p: POS, pasada: 1, espejoEs: false,
    mala: 'Em nosso escritório trabalham oito pessoas.', buena: 'No nosso escritório trabalham oito pessoas.',
    calcoEs: 'En nuestra oficina trabajan ocho personas.',
    explicacion: 'em + o = «no». El artículo que el posesivo exige es el que permite la contracción.',
    varianteEsperada: 'sin contracción por falta de artículo' },
  { p: POS, pasada: 1, espejoEs: false,
    mala: 'Trouxe isto para vosso filho.', buena: 'Trouxe isto para o vosso filho.',
    calcoEs: 'Traje esto para vuestro hijo.',
    explicacion: 'Con «para» no hay contracción, pero el artículo sigue haciendo falta: «para o vosso filho».',
    varianteEsperada: 'posesivo sin artículo' },

  // ══ b2-artigos (1) — el punto padre, con lo que le falta.
  { p: ART, pasada: 1, espejoEs: false,
    mala: 'Portugal é país pequeno mas variado.', buena: 'Portugal é um país pequeno mas variado.',
    calcoEs: 'Portugal es país pequeño pero variado.',
    explicacion: 'El español admite el predicado nominal sin artículo en este giro; el portugués pide el indefinido: «é um país».',
    varianteEsperada: 'predicado nominal sin artículo, calcado' },
];

if (process.argv[1]?.includes('corr-e2-21a')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección E2#21a — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Preflight\n`);
  for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

// scripts/lotes/juicio-e2-20.ts
//
//   npx tsx scripts/lotes/juicio-e2-20.ts            # preflight completo
//   npx tsx scripts/lotes/juicio-e2-20.ts --json     # ítems para publicar
//
// EL INTENTO ÚNICO DEL JUICIO DE GRAMATICALIDAD.
//
// Cuatro sesiones murieron en este formato y la moratoria se levanta
// acotada: **un lote, con todo el instrumental, y sin segundo intento**.
// Si publica, la línea vuelve; si no, el formato se declara muerto y sus
// puntos se reasignan.
//
// ── LOS TRES PUNTOS, Y POR QUÉ ÉSTOS ─────────────────────────────────
//
// Un juicio sólo mide portugués donde el calco **suena bien en español**.
// De los 19 puntos que quedan, la mayoría lleva el motivo por DEFECTO del
// bloque, no una trampa comprobada. Se revisaron uno a uno y se
// descartaron los que no la tienen — entre ellos `b3-interrogativos`,
// cuyo override yo mismo escribí y no se sostiene: «Qual é o teu nome?»
// glosa a «¿Cuál es tu nombre?», que es español correcto y PARALELO, o
// sea que no hay trampa que medir.
//
// Los tres elegidos tienen la trampa demostrable:
//   · `b2-genero-agem-dade` — «a viagem» es femenino y «el viaje» es
//     masculino, así que *«o viagem» glosa a español perfecto.
//   · `b2-art-com-nome` — «O João chegou»; el calco *«João chegou» glosa
//     a «Juan llegó», impecable en español.
//   · `b2-art-com-posesivo` — «A minha casa»; el calco *«Minha casa»
//     glosa a «Mi casa», impecable en español.
//
// ── LO QUE ESTE LOTE NO PUEDE ESCONDER ───────────────────────────────
//
// En un punto-trampa la glosa española del MAL suena bien y la del BIEN
// no. Eso hace que el rasgo 12 de la batería —la glosa cognada— prediga
// la etiqueta AL REVÉS, y un rasgo invertido sigue siendo un atajo: basta
// con aprender «el que suena raro en español es el bueno».
//
// La única forma honesta de neutralizarlo es incluir pares donde el
// español COINCIDA, y aquí hay una que no es un truco: el punto de
// `-agem/-dade` cubre los dos sufijos, y **«a cidade» sí es femenino en
// español**. Los pares de -dade van en la dirección contraria a los de
// -agem por la lengua, no por conveniencia.
//
// El preflight mide el rasgo y lo imprime. Si sale por encima del umbral,
// el lote NO publica y el formato se declara muerto — que es exactamente
// lo que se acordó.
import { expandir, verificarPar, patronesPublicados, type ParMinimo } from '../lib/pares-minimos';
import { bateria, potenciaGate, umbralAcierto, N_SUELO_DEL_GATE, type ItemJuicio } from '../lib/atajos';
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from '../config';

const GEN = 'b2-genero-agem-dade';
const NOM = 'b2-art-com-nome';
const POS = 'b2-art-com-posesivo';

export const PARES: ParMinimo[] = [
  // ── b2-genero-agem-dade · dos de -agem (trampa) y dos de -dade
  // (paralelo con el español). La dirección la pone la lengua.
  {
    id: 'P-01', concepto: GEN, rasgo: 'el género de los sustantivos en -agem, femenino en portugués',
    esqueleto: 'Adiámos {} por causa do tempo.',
    bien: 'a viagem', mal: 'o viagem',
    explicacionBien: 'Los sustantivos en -agem son femeninos en portugués: «a viagem», «a garagem», «a paisagem».',
    explicacionMal: 'El género viene del español, donde «el viaje» es masculino. En portugués el sufijo -agem es femenino sin excepción útil.',
    glosaBien: 'la viaje', glosaMal: 'el viaje',
  },
  {
    id: 'P-02', concepto: GEN, rasgo: 'el género de los sustantivos en -agem, femenino en portugués',
    esqueleto: 'Deixámos o carro n{} do prédio.',
    bien: 'a garagem', mal: 'o garagem',
    explicacionBien: '«A garagem» es femenino, como todos los sustantivos en -agem.',
    explicacionMal: 'Calco del español «el garaje». El sufijo -agem es femenino en portugués.',
    glosaBien: 'la garaje', glosaMal: 'el garaje',
  },
  {
    id: 'P-03', concepto: GEN, rasgo: 'el género de los sustantivos en -dade, femenino en portugués',
    esqueleto: 'Visitámos {} inteira num dia.',
    bien: 'a cidade', mal: 'o cidade',
    explicacionBien: 'Los sustantivos en -dade son femeninos: «a cidade», «a verdade», «a liberdade».',
    explicacionMal: 'Aquí el error no viene del español —«la ciudad» también es femenino—: es un descuido del sufijo.',
    glosaBien: 'la ciudad', glosaMal: 'el ciudad',
  },
  {
    id: 'P-04', concepto: GEN, rasgo: 'el género de los sustantivos en -dade, femenino en portugués',
    esqueleto: 'Ninguém duvidou d{} do relato.',
    bien: 'a verdade', mal: 'o verdade',
    explicacionBien: '«A verdade» es femenino, como todos los sustantivos en -dade.',
    explicacionMal: 'También en español «la verdad» es femenino, así que el error no se explica por calco: es el sufijo.',
    glosaBien: 'la verdad', glosaMal: 'el verdad',
  },

  // ── b2-art-com-nome · el artículo delante del nombre propio.
  {
    id: 'P-05', concepto: NOM, rasgo: 'el artículo obligatorio delante del nombre propio de persona',
    esqueleto: 'Hoje {} chegou atrasado outra vez.',
    bien: 'o João', mal: 'João',
    explicacionBien: 'El portugués europeo pone artículo delante del nombre propio de persona: «o João», «a Maria».',
    explicacionMal: 'Sin artículo suena a español o a brasileño. En Portugal, hablando de alguien conocido, el artículo es obligatorio.',
    glosaBien: 'El Juan llegó tarde otra vez', glosaMal: 'Juan llegó tarde otra vez',
  },
  {
    id: 'P-06', concepto: NOM, rasgo: 'el artículo obligatorio delante del nombre propio de persona',
    esqueleto: 'Encontrei {} no mercado esta manhã.',
    bien: 'a Rita', mal: 'Rita',
    explicacionBien: 'Con nombre propio de persona, el artículo es obligatorio: «encontrei a Rita».',
    explicacionMal: 'El calco del español deja el nombre desnudo, y en portugués europeo eso no se dice.',
    glosaBien: 'Encontré a la Rita en el mercado', glosaMal: 'Encontré a Rita en el mercado',
  },
  {
    id: 'P-07', concepto: NOM, rasgo: 'el artículo obligatorio delante del nombre propio de persona',
    esqueleto: 'Falei com {} sobre o assunto todo.',
    bien: 'o Pedro', mal: 'Pedro',
    explicacionBien: 'Con nombre propio de persona el artículo es obligatorio: «falei com o Pedro».',
    explicacionMal: 'Sin artículo la frase queda exactamente como el español, que es de donde viene el error.',
    glosaBien: 'Hablé con el Pedro sobre el asunto', glosaMal: 'Hablé con Pedro sobre el asunto',
  },
  {
    id: 'P-08', concepto: NOM, rasgo: 'el artículo obligatorio delante del nombre propio de persona',
    esqueleto: 'O livro é d{} que mo emprestou.',
    bien: 'a Ana ', mal: 'e Ana ',
    explicacionBien: '«De» se contrae con el artículo femenino: «o livro é da Ana».',
    explicacionMal: 'Sin artículo la contracción desaparece y queda «de Ana», que es el orden español.',
    glosaBien: 'El libro es de la Ana que me lo prestó', glosaMal: 'El libro es de Ana que me lo prestó',
  },

  // ── b2-art-com-posesivo · el artículo delante del posesivo.
  {
    id: 'P-09', concepto: POS, rasgo: 'el artículo obligatorio delante del posesivo',
    esqueleto: 'Sei que {} casa fica perto da estação.',
    bien: 'a minha', mal: 'minha',
    explicacionBien: 'El portugués europeo pone artículo delante del posesivo: «a minha casa», «o meu carro».',
    explicacionMal: 'Sin artículo es español o brasileño. En Portugal el artículo va casi siempre.',
    glosaBien: 'La mi casa queda cerca de la estación', glosaMal: 'Mi casa queda cerca de la estación',
  },
  {
    id: 'P-10', concepto: POS, rasgo: 'el artículo obligatorio delante del posesivo',
    esqueleto: 'Deixei {} chaves em cima da mesa.',
    bien: 'as tuas', mal: 'tuas',
    explicacionBien: 'Con posesivo, artículo: «as tuas chaves».',
    explicacionMal: 'El calco del español suprime el artículo, y en portugués europeo suena incompleto.',
    glosaBien: 'Dejé las tus llaves encima de la mesa', glosaMal: 'Dejé tus llaves encima de la mesa',
  },
  {
    id: 'P-11', concepto: POS, rasgo: 'el artículo obligatorio delante del posesivo',
    esqueleto: 'Falámos com {} pais no domingo.',
    bien: 'os teus', mal: 'teus',
    explicacionBien: 'También con nombres de parentesco en plural el artículo se mantiene: «os teus pais».',
    explicacionMal: 'Sin artículo, el sintagma queda como el español «tus padres».',
    glosaBien: 'Hablamos con los tus padres el domingo', glosaMal: 'Hablamos con tus padres el domingo',
  },
  {
    id: 'P-12', concepto: POS, rasgo: 'el artículo obligatorio delante del posesivo',
    esqueleto: 'Perdi {} guarda-chuva no comboio.',
    bien: 'o meu', mal: 'meu',
    explicacionBien: '«O meu guarda-chuva»: artículo y posesivo van juntos.',
    explicacionMal: 'El calco del español deja el posesivo solo, y en Portugal eso marca al hablante como extranjero o brasileño.',
    glosaBien: 'Perdí el mi paraguas en el tren', glosaMal: 'Perdí mi paraguas en el tren',
  },
];

function corpus() {
  const out: { id: string; type: string; data: unknown }[] = [];
  for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
    for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
      out.push({ id: ex.id, type: ex.type, data: ex.data });
  return out;
}

export function generar() {
  const publicados = [...patronesPublicados(corpus()).values()];
  return expandir(PARES, { semilla: 'e2-20-juicio-intento-unico', publicados });
}

if (process.argv[1]?.includes('juicio-e2-20')) {
  const malos = PARES.flatMap(verificarPar);
  if (malos.length) {
    console.log(`**${malos.length} PARES NO MÍNIMOS:**`);
    for (const m of malos) console.log(`- ${m}`);
    process.exit(1);
  }
  const items = generar();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(items, null, 2)); process.exit(0); }

  console.log(`# Juicio E2#20 — el intento único · ${items.length} ítems de ${PARES.length} pares\n`);
  console.log(`Patrón: \`${items.map((x) => (x.verdict ? 'B' : 'M')).join('')}\`\n`);

  // ── LA POTENCIA, PRIMERO ─────────────────────────────────────────
  const n = items.length;
  console.log(`## Potencia del gate\n`);
  console.log(`Con N = ${n}, el binomial exige **${umbralAcierto(n)} aciertos** para marcar un rasgo,`);
  console.log(`y detecta un atajo del 75 % el **${Math.round(potenciaGate(n, 0.75) * 100) } %** de las veces.`);
  console.log(`Suelo del gate: N ≥ ${N_SUELO_DEL_GATE}. Por debajo, «preflight limpio» es una tautología.\n`);

  const juicios: ItemJuicio[] = items.map((x) => {
    const par = PARES.find((p) => p.id === x.parId)!;
    return {
      id: x.id,
      sentence: x.sentence, verdict: x.verdict, concepto: x.concepto,
      repair: x.repair, explicacion: x.explicacion,
      glosaEsCorrecta: x.verdict ? esGlosaCorrecta(par.glosaBien) : esGlosaCorrecta(par.glosaMal),
    } as ItemJuicio;
  });

  console.log(`## Batería de atajos\n`);
  const res = bateria(juicios);
  // `bateria` ya devuelve los aciertos de LA MEJOR de las dos
  // direcciones, así que un rasgo invertido —«el que suena raro en
  // español es el bueno»— cuenta igual que uno directo. Era justo la
  // preocupación de este lote y la maquinaria ya la tenía cubierta.
  const umbral = umbralAcierto(n);
  console.log(`Umbral con N=${n}: **${umbral} aciertos**. Se marca lo que llegue o pase.\n`);
  console.log('| rasgo | aciertos | de | acierto | dirección | presentes |');
  console.log('|---|---:|---:|---:|---|---:|');
  let bloquean = 0;
  for (const r of res) {
    const marca = r.aciertos >= umbral ? ' **←**' : '';
    if (r.aciertos >= umbral) bloquean++;
    console.log(`| ${r.nombre} | ${r.aciertos}${marca} | ${r.n} | ${(r.acierto * 100).toFixed(0)} % | ${r.direccion} | ${r.presentes} |`);
  }
  console.log('');
  if (bloquean) {
    console.log(`**${bloquean} rasgos por encima del umbral.** El lote NO publica.`);
    process.exit(1);
  }
  console.log('Ningún rasgo por encima del umbral.');
}

/** Una glosa es «correcta» si es español bien formado en ALGÚN registro.
 *  El criterio se fijó en E2#13, cuando declaré incorrectas «Diéronme» y
 *  «Casóse» por parecerme raras: son español arcaico bien formado, y con
 *  las dos corregidas el atajo subía de 9/14 a 11/14. */
function esGlosaCorrecta(g?: string): boolean {
  if (!g) return false;
  // Las glosas de este lote llevan el artículo espurio («la viaje», «el
  // mi paraguas») justo donde el portugués lo exige y el español no.
  return !/\b(la viaje|el viaje…|el ciudad|el verdad|la garaje)\b/i.test(g)
    && !/\b(el|la|los|las) (mi|tu|su|mis|tus|sus)\b/i.test(g)
    && !/\b(El|La) [A-ZÁÉÍÓÚ]/.test(g)
    && !/ a la [A-ZÁÉÍÓÚ]/.test(g)
    && !/ de la [A-ZÁÉÍÓÚ]/.test(g)
    && !/ al [A-ZÁÉÍÓÚ]/.test(g);
}

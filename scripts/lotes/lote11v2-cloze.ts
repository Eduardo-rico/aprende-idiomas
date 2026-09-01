// scripts/lotes/lote11v2-cloze.ts
//
//   npx tsx scripts/lotes/lote11v2-cloze.ts            # doc + gates
//   npx tsx scripts/lotes/lote11v2-cloze.ts --json     # ítems para publicar
//
// LOTE 11 v2 — el mismo contenido, EL FORMATO QUE SU PUNTO PIDE.
//
// La v1 murió con 8 bloqueantes y ninguno era de redacción: la sección
// de ser/estar declaraba enseñar dónde el portugués NO coincide con el
// español y **once de sus doce ítems coincidían**, así que la glosa
// cognada resolvía el lote (20/24, p=0,0008; 12/12 en esa sección). No
// falló el lote: falló el formato.
//
// El mapa formato↔punto lo dice ahora antes de escribir: los dos puntos
// piden **cloze con pista**, no juicio binario. Y un cloze no tiene
// etiqueta BIEN/MAL, así que **la familia entera de atajos de la batería
// deja de aplicar** — no hay nada que adivinar traduciendo: hay que
// producir la forma.
//
// Lo que sí hay que vigilar, y es la cicatriz de E2#11: **un gate que
// deriva la respuesta no comprueba que la PREGUNTA la determine.** En
// aquel lote, cinco de seis huecos admitían las cinco personas. Aquí
// cada ítem declara su ANCLA: el trozo del contexto que excluye las
// alternativas. Sin ancla presente en la frase, el gate bloquea.
import { infinitivoPessoal, type Persona } from '../lib/paradigma-pt';

export interface ItemCloze {
  id: string;
  concepto: string;
  sentence: string;      // con exactamente un ___
  answer: string;
  alternatives: string[];
  /** El trozo del contexto que DETERMINA la respuesta. Tiene que estar
   *  literalmente en la frase: el gate lo comprueba. */
  ancla: string;
  hintEs: string;
  /** sólo en la sección A: permite recalcular la respuesta */
  lema?: string;
  persona?: Persona;
  construccion?: 'pessoal' | 'conjuntivo-presente' | 'conjuntivo-futuro';
}

const A = 'b11-alternancia-infinitivo';
const B = 'b11-ser-estar-divergente';

// ── A · la ELECCIÓN entre infinitivo pessoal y conjuntivo ────────────
// Seis + seis, y las dos clases están FORZADAS por el contexto:
//   · preposición + sujeto EXPRESO ⇒ infinitivo pessoal, sin alternativa
//   · conjunción «que» + sujeto ⇒ conjuntivo, sin alternativa
// Se deja fuera el infinitivo SIMPLES a propósito: con sujeto plural,
// «sem dizer nada» y «sem dizerem nada» son las dos correctas, así que
// un hueco que lo pidiera sería inresoluble. Es exactamente la cicatriz
// de E2#11, aplicada antes de escribir en vez de después del round.
export const ITEMS: ItemCloze[] = [
  { id: 'CL-01', concepto: A, lema: 'apanhar', persona: 'eles', construccion: 'pessoal',
    sentence: 'Para os teus colegas ___ o comboio das seis, temos de sair já.',
    answer: 'apanharem', alternatives: [], ancla: 'Para os teus colegas',
    hintEs: 'apanhar — para que tus compañeros cojan el tren' },
  { id: 'CL-02', concepto: A, lema: 'sair', persona: 'eles', construccion: 'pessoal',
    sentence: 'Antes de eles ___ de casa, deixámos a chave no sítio do costume.',
    answer: 'saírem', alternatives: [], ancla: 'Antes de eles',
    hintEs: 'sair — antes de que ellos salieran' },
  { id: 'CL-03', concepto: A, lema: 'dar', persona: 'eles', construccion: 'pessoal',
    sentence: 'Sem os vizinhos ___ por nada, mudámos o piano para o outro andar.',
    answer: 'darem', alternatives: [], ancla: 'Sem os vizinhos',
    hintEs: 'dar (por) — sin que los vecinos se dieran cuenta' },
  { id: 'CL-04', concepto: A, lema: 'assinar', persona: 'nós', construccion: 'pessoal',
    sentence: 'Depois de nós ___ o contrato, tudo ficou muito mais simples.',
    answer: 'assinarmos', alternatives: [], ancla: 'Depois de nós',
    hintEs: 'assinar — después de que nosotros firmáramos' },
  { id: 'CL-05', concepto: A, lema: 'pôr', persona: 'eles', construccion: 'pessoal',
    sentence: 'Trouxe os documentos para os senhores ___ a assinatura hoje mesmo.',
    answer: 'porem', alternatives: [], ancla: 'para os senhores',
    hintEs: 'pôr — para que ustedes pongan la firma' },
  { id: 'CL-06', concepto: A, lema: 'ser', persona: 'eles', construccion: 'pessoal',
    sentence: 'É difícil os alunos ___ todos pontuais logo à primeira aula.',
    answer: 'serem', alternatives: [], ancla: 'os alunos',
    hintEs: 'ser — es difícil que los alumnos sean' },
  // Las cinco frases que siguen NO son las que escribí primero. El gate
  // de virginidad, que desde E2#13 indexa también los <Example> de las
  // lecciones, cazó que CUATRO de ellas eran ejemplos literales de
  // `b11-l5-eleccion-c1` — la lección que yo mismo escribí en E2#13 A
  // PARTIR DE ESTE LOTE (0,795 · 0,754 · 0,751 · 0,478). Es la cicatriz
  // del lote 10 en dirección contraria: allí el lote copiaba la lección,
  // aquí la lección se había escrito copiando el lote, y el resultado es
  // el mismo — el alumno acaba de leer la respuesta.
  { id: 'CL-07', concepto: A, lema: 'fazer', persona: 'eles', construccion: 'conjuntivo-presente',
    sentence: 'É preciso que vocês ___ uma escolha antes do fim do mês.',
    answer: 'façam', alternatives: [], ancla: 'que vocês',
    hintEs: 'fazer — hace falta que hagáis una elección' },
  { id: 'CL-08', concepto: A, lema: 'ser', persona: 'ele', construccion: 'conjuntivo-presente',
    sentence: 'Convém que a proposta ___ entregue antes de sexta-feira ao meio-dia.',
    answer: 'seja', alternatives: [], ancla: 'que a proposta',
    hintEs: 'ser — conviene que la propuesta sea entregada' },
  { id: 'CL-09', concepto: A, lema: 'trazer', persona: 'tu', construccion: 'conjuntivo-presente',
    sentence: 'Espero que tu ___ o contrato assinado à reunião de amanhã.',
    answer: 'tragas', alternatives: [], ancla: 'que tu',
    hintEs: 'trazer — espero que traigas' },
  // Con un verbo REGULAR este ítem no discriminaba: «chegares» es a la
  // vez futuro do conjuntivo e infinitivo pessoal, así que el alumno
  // podía producirlo desde la regla equivocada y acertar igual. Lo cazó
  // el gate de derivación, no el round. Con un irregular las dos formas
  // se separan —«vires» frente a «veres»— y el ítem vuelve a medir la
  // elección.
  { id: 'CL-10', concepto: A, lema: 'ver', persona: 'tu', construccion: 'conjuntivo-futuro',
    sentence: 'Quando tu ___ o teu irmão, dá-lhe os parabéns da minha parte.',
    answer: 'vires', alternatives: [], ancla: 'Quando tu',
    hintEs: 'ver — cuando veas a tu hermano (futuro)' },
  { id: 'CL-11', concepto: A, lema: 'querer', persona: 'eles', construccion: 'conjuntivo-futuro',
    sentence: 'Se eles ___ vir connosco no domingo, ainda há lugar no carro.',
    answer: 'quiserem', alternatives: [], ancla: 'Se eles',
    hintEs: 'querer — si quieren venir (futuro)' },
  { id: 'CL-12', concepto: A, lema: 'saber', persona: 'nós', construccion: 'conjuntivo-futuro',
    sentence: 'Assim que nós ___ alguma coisa de concreto, avisamos toda a gente.',
    answer: 'soubermos', alternatives: [], ancla: 'Assim que nós',
    hintEs: 'saber — en cuanto sepamos algo' },

  // ── B · SER / ESTAR / FICAR donde el español elige distinto ────────
  // Cada ancla es el trozo que excluye la alternativa. La lección del
  // round de la v1: «diverge en pocos casos y hay que ELEGIRLOS, no
  // suponerlos» — de los doce ítems que se escribieron suponiendo,
  // once coincidían con el español.
  { id: 'CL-13', concepto: B,
    sentence: 'O jantar de despedida ___ na quinta-feira, num sítio ainda por combinar.',
    answer: 'é', alternatives: [], ancla: 'O jantar de despedida',
    hintEs: 'un evento OCURRE: en portugués va con ser' },
  { id: 'CL-14', concepto: B,
    sentence: 'O concerto ___ no Coliseu no próximo sábado, às nove e meia.',
    answer: 'é', alternatives: [], ancla: 'O concerto',
    hintEs: 'otro evento con lugar y fecha: sigue siendo ser' },
  { id: 'CL-15', concepto: B,
    sentence: 'A festa de anos da minha sobrinha ___ no domingo em casa dos avós.',
    answer: 'é', alternatives: [], ancla: 'A festa',
    hintEs: 'si el sujeto se puede sustituir por «tem lugar», va con ser' },
  { id: 'CL-16', concepto: B,
    sentence: 'O António ___ doente e hoje não vem, mas na segunda já cá anda.',
    answer: 'está', alternatives: [], ancla: 'na segunda já cá anda',
    hintEs: 'estado pasajero — la segunda mitad dice que se le pasa' },
  { id: 'CL-17', concepto: B,
    sentence: 'A comida ___ fria, ninguém se lembrou de a tapar quando saímos.',
    answer: 'está', alternatives: [], ancla: 'ninguém se lembrou de a tapar',
    hintEs: 'se ha enfriado: estado resultante, no cualidad' },
  { id: 'CL-18', concepto: B,
    sentence: 'O tribunal ___ mesmo ao lado da estação, num prédio dos anos trinta.',
    answer: 'fica', alternatives: ['está'], ancla: 'num prédio dos anos trinta',
    hintEs: 'la localización de un edificio prefiere ficar, que el español no tiene en este uso' },
  { id: 'CL-19', concepto: B,
    sentence: 'Eu ___ português, mas vivo em Espanha desde os dezoito anos.',
    answer: 'sou', alternatives: [], ancla: 'português',
    hintEs: 'nacionalidad con ser, por muy temporal que sea la situación' },
  { id: 'CL-20', concepto: B,
    sentence: 'Ela ___ professora de História, embora este ano esteja a dar Português.',
    answer: 'é', alternatives: [], ancla: 'professora de História',
    hintEs: 'profesión con ser, y el contraste con «esteja a dar» en la misma frase' },
  { id: 'CL-21', concepto: B,
    sentence: 'A porta ___ aberta a noite toda e entrou frio pela casa dentro.',
    answer: 'esteve', alternatives: [], ancla: 'a noite toda',
    hintEs: 'estado resultante en un periodo cerrado' },
  { id: 'CL-22', concepto: B,
    sentence: 'A entrada ___ gratuita para os sócios durante todo o mês de agosto.',
    answer: 'é', alternatives: [], ancla: 'gratuita para os sócios',
    hintEs: 'característica del billete, no estado de hoy' },
  { id: 'CL-23', concepto: B,
    sentence: 'O prédio ___ do século dezanove, mas está todo remodelado por dentro.',
    answer: 'é', alternatives: [], ancla: 'do século dezanove',
    hintEs: 'lo que el edificio ES —su época— frente a cómo está ahora' },
  { id: 'CL-24', concepto: B,
    sentence: 'Como ___ o tempo aí no Porto? Aqui o céu não abre há uma semana.',
    answer: 'está', alternatives: [], ancla: 'o céu não abre há uma semana',
    hintEs: 'el tiempo de hoy: estar' },
];

// ── Gates ────────────────────────────────────────────────────────────
export function verificar(items: ItemCloze[]): string[] {
  const v: string[] = [];
  for (const x of items) {
    const huecos = x.sentence.split('___').length - 1;
    if (huecos !== 1) v.push(`${x.id}: ${huecos} huecos, tiene que haber exactamente 1`);
    if (!x.answer.trim()) v.push(`${x.id}: sin respuesta`);
    if (!x.hintEs.trim()) v.push(`${x.id}: sin pista`);

    // LA CICATRIZ DE E2#11: la pregunta tiene que DETERMINAR la
    // respuesta. El ancla es el trozo que excluye las alternativas, y
    // tiene que estar literalmente en la frase.
    if (!x.ancla.trim()) v.push(`${x.id}: sin ancla declarada`);
    else if (!x.sentence.includes(x.ancla)) v.push(`${x.id}: el ancla «${x.ancla}» no está en la frase`);

    // DERIVACIÓN: donde la forma se calcula, se recalcula y se compara.
    if (x.construccion === 'pessoal') {
      const esperado = infinitivoPessoal(x.lema!, x.persona!);
      if (esperado !== x.answer)
        v.push(`${x.id}: el paradigma da «${esperado}» para ${x.lema}/${x.persona} y el ítem dice «${x.answer}»`);
    }
    if (x.construccion?.startsWith('conjuntivo')) {
      if (x.answer === x.lema) v.push(`${x.id}: la respuesta es el lema — un conjuntivo no puede coincidir con el infinitivo`);
      if (x.answer === infinitivoPessoal(x.lema!, x.persona!))
        v.push(`${x.id}: la respuesta coincide con el infinitivo pessoal, así que el ítem no distingue las dos construcciones`);
    }
    // La respuesta no puede aparecer ya escrita en la propia frase.
    if (new RegExp(`(?<![\\p{L}])${x.answer}(?![\\p{L}])`, 'iu').test(x.sentence.replace('___', '')))
      v.push(`${x.id}: la respuesta «${x.answer}» ya está en la frase`);
  }
  // Reparto: si una sola respuesta domina, el lote se resuelve por
  // frecuencia. No es un atajo de la batería —un cloze no tiene
  // etiqueta— pero es el equivalente en este formato.
  const porPunto = new Map<string, Map<string, number>>();
  for (const x of items) {
    const m = porPunto.get(x.concepto) ?? new Map();
    m.set(x.answer, (m.get(x.answer) ?? 0) + 1);
    porPunto.set(x.concepto, m);
  }
  for (const [c, m] of porPunto) {
    const n = [...m.values()].reduce((a, b) => a + b, 0);
    const [top, k] = [...m].sort((a, b) => b[1] - a[1])[0]!;
    if (k / n > 0.5) v.push(`${c}: la respuesta «${top}» sale ${k} de ${n} veces — se resuelve por frecuencia`);
  }
  return v;
}

if (process.argv[1]?.includes('lote11v2-cloze')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  console.log(`# Lote 11 v2 — ${ITEMS.length} ítems de CLOZE CON PISTA\n`);
  console.log(`\`${A}\`: ${ITEMS.filter((x) => x.concepto === A).length} · \`${B}\`: ${ITEMS.filter((x) => x.concepto === B).length}\n`);
  console.log('| id | frase | respuesta | ancla que la determina |');
  console.log('|---|---|---|---|');
  for (const x of ITEMS) console.log(`| ${x.id} | ${x.sentence} | **${x.answer}**${x.alternatives.length ? ` (o ${x.alternatives.join('/')})` : ''} | ${x.ancla} |`);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: un hueco por ítem, ancla presente en la frase, formas recalculadas contra el paradigma, y ninguna respuesta domina su punto.');
}

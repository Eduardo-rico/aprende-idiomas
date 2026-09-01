// lib/data/languages/pt/curriculum.ts
// Curricular source of truth: blocks, lessons, concepts.
//
// B1 is hand-authored in TS (B1_CONCEPTS + B1_LESSONS) — it's small, mature,
// and rarely changes. B2-B10 lessons live in ./lessons/bN.json and
// are LLM-proposed by scripts/propose-lessons.ts; this module static-imports
// the JSON so the app reaches lessons through the same `BLOCKS[i].lessons`
// path that getLesson() iterates. JSON files start as `[]` and get populated
// during Phases B/C/D of the content-generation plan.

import b2Lessons from "./lessons/b2.json";
import b3Lessons from "./lessons/b3.json";
import b4Lessons from "./lessons/b4.json";
import b5Lessons from "./lessons/b5.json";
import b6Lessons from "./lessons/b6.json";
import b7Lessons from "./lessons/b7.json";
import b8Lessons from "./lessons/b8.json";
import b9Lessons from "./lessons/b9.json";
import b10Lessons from "./lessons/b10.json";
import b11Lessons from "./lessons/b11.json";
import b12Lessons from "./lessons/b12.json";

import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
export type { Block, Concept, Lesson, ConceptId, LessonId };

// --- Block 1: Fonética e ortografía ---
const B1_CONCEPTS: Concept[] = [
  { id: 'b1-alfabeto', name: 'Alfabeto portugués', blockId: 1, description: 'Letras y nombres en portugués', prereqs: [] },
  { id: 'b1-acentos', name: 'Acentos diacríticos', blockId: 1, description: 'Agudo, grave, circunflejo, tilde, cedilha', prereqs: [] },
  { id: 'b1-silaba-tonica', name: 'Sílaba tónica', blockId: 1, description: 'Reglas de acentuación tónica', prereqs: ['b1-acentos'] },
  { id: 'b1-corresp-on-ao', name: 'Correspondencia -ón → -ão', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-corresp-ll-lh', name: 'Correspondencia -ll- → -lh-', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  { id: 'b1-corresp-nh-ny', name: 'Correspondencia -ñ → -nh-', blockId: 1, description: 'Pasaje sistemático ES→PT', prereqs: [] },
  // Condicionada, no general: sólo vale donde la h- española viene de F-
  // latina (hijo/filho), no donde ya era h- (hombre/homem). Enunciarla como
  // regla sin condición fabrica *fomem, *fora, *foje.
  { id: 'b1-corresp-h-f', name: 'Correspondencia h- → f-', blockId: 1, description: 'Sólo donde la h- viene de F- latina; prueba del cultismo (hijo/filial)', prereqs: ['b1-h-muda'] },
  { id: 'b1-h-muda', name: 'H muda', blockId: 1, description: 'H inicial siempre muda', prereqs: [] },
  { id: 'b1-vogais-nasais', name: 'Vocales nasales', blockId: 1, description: 'ã, õ, am, em, im, om, um', prereqs: [] },
  { id: 'b1-pron-rr-r', name: 'Pronunciación rr/r inicial', blockId: 1, description: 'En BR como /h/; en PT vibrante', prereqs: [] },
  { id: 'b1-pron-s-final', name: 'Pronunciación de "s" final', blockId: 1, description: 'BR /s/; PT /ʃ/', prereqs: [] },
  // ── E2#18 · los puntos de FONOLOGÍA que A1 enumera y nadie había
  // declarado. Son de PERCEPCIÓN: se enseñan con pares mínimos y audio
  // A/B, no con texto, así que su formato es `escucha` y no cualquiera de
  // los cuatro de producción escrita.
  //
  // `b1-reducao-vocalica` merece un aviso: **el propio currículo dice que
  // hoy tiene CERO menciones en todo el corpus**, y es lo que separa oír
  // portugués europeo de oír una sopa. Era el agujero real de A1, y la
  // aritmética de «8 puntos sin empezar» lo tapaba en vez de señalarlo.
  { id: 'b1-inventario-vocalico', name: 'Inventario vocálico PT-PT', blockId: 1, description: 'Las 9 vocales orales y las 5 nasales del portugués europeo, contra las 5 del español: el alumno tiene que OÍR las que su lengua no distingue antes de intentar decirlas', prereqs: [] },
  { id: 'b1-reducao-vocalica', name: 'Redução vocálica átona', blockId: 1, description: 'La átona se cierra y a menudo se elide: /e/→[ɨ] («telefone» → t\'lfon), /o/→[u], /a/→[ɐ]. Es LA marca del portugués europeo frente al brasileño y la causa de que un hispanohablante no reconozca palabras que sabe', prereqs: ['b1-inventario-vocalico'] },
  { id: 'b1-sandi', name: 'Sândi entre palabras', blockId: 1, description: 'Lo que pasa en la frontera de dos palabras al hablar seguido: elisión, ligadura y crase de vocales — por qué «uma amiga» suena a una sola palabra', prereqs: ['b1-reducao-vocalica'] },
  { id: 'b1-ei-lisboeta', name: '⟨ei⟩ lisboeta [ɐj]', blockId: 1, description: 'El diptongo ⟨ei⟩ que en Lisboa se abre a [ɐj] («leite», «primeiro») y en el norte y en Brasil no: rasgo diatópico que el alumno debe reconocer, no imitar por obligación', prereqs: ['b1-inventario-vocalico'] },
];

const B1_LESSONS: Lesson[] = [
  {
    id: 'b1-l1-alfabeto-acentos',
    blockId: 1,
    name: 'Alfabeto y acentos',
    objectives: [
      'Reconocer todas las letras del alfabeto portugués',
      'Identificar y nombrar los acentos (´ ` ^ ~ ¸)',
    ],
    conceptIds: ['b1-alfabeto', 'b1-acentos'],
    vocabKey: ['a', 'e', 'i', 'o', 'u', 'á', 'à', 'â', 'ã', 'ç'] as const,
    conceptNotesPath: 'b1/l1-alfabeto-acentos.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l2-silaba-tonica',
    blockId: 1,
    name: 'Sílaba tónica y reglas de acentuación',
    objectives: [
      'Identificar la sílaba tónica en cualquier palabra',
      'Aplicar reglas de acentuación gráfica',
    ],
    conceptIds: ['b1-silaba-tonica'],
    vocabKey: ['fácil', 'difícil', 'café', 'avó', 'avô', 'táxi', 'lápis'] as const,
    conceptNotesPath: 'b1/l2-silaba-tonica.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l3-correspondencias-es-pt',
    blockId: 1,
    name: 'Correspondencias sistemáticas español → portugués',
    objectives: [
      'Aplicar las reglas -ón→-ão, -ll-→-lh-, -ñ-→-nh-',
      'Reconocer h muda',
      'Aplicar h-→f- sólo donde procede, con la prueba del cultismo',
    ],
    conceptIds: ['b1-corresp-on-ao', 'b1-corresp-ll-lh', 'b1-corresp-nh-ny', 'b1-h-muda', 'b1-corresp-h-f'],
    vocabKey: ['coração', 'canção', 'mulher', 'olho', 'manhã', 'banho', 'hotel', 'hora'] as const,
    conceptNotesPath: 'b1/l3-correspondencias.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l4-vogais-nasais',
    blockId: 1,
    name: 'Vocales nasales',
    objectives: [
      'Reconocer y producir vocales nasales',
      'Distinguir vocal nasal de vocal + n/m',
    ],
    conceptIds: ['b1-vogais-nasais', 'b1-inventario-vocalico'],
    vocabKey: ['mãe', 'pão', 'cão', 'irmão', 'bem', 'bom', 'ruim', 'um'] as const,
    conceptNotesPath: 'b1/l4-vogais-nasais.mdx',
    exerciseRefs: [],
  },
  {
    id: 'b1-l5-pron-rr-s',
    blockId: 1,
    name: 'Pronunciación de rr/r y s final (BR vs PT)',
    objectives: [
      'Reconocer pronunciación de rr/r inicial en BR vs PT',
      'Reconocer "s" final en BR vs PT',
    ],
    conceptIds: ['b1-pron-rr-r', 'b1-pron-s-final'],
    vocabKey: ['rato', 'carro', 'rua', 'dois', 'mais', 'meses', 'olhos'] as const,
    conceptNotesPath: 'b1/l5-pron-rr-s.mdx',
    exerciseRefs: [],
  },
];

const B1: Block = {
  id: 1,
  slug: 'fonetica',
  name: 'Sistema fonético y ortográfico',
  description: 'Alfabeto, acentos, sílaba tónica, correspondencias sistemáticas ES→PT, h muda, vocales nasales, diferencias clave de pronunciación BR vs PT.',
  durationWeeks: 2,
  prereqs: [],
  freeDrill: false,
  lessons: B1_LESSONS,
};

// --- Block 2: Morfología nominal ---
const B2_CONCEPTS: Concept[] = [
  { id: 'b2-artigos', name: 'Artigos', blockId: 2, description: 'Definidos (o, a, os, as), indefinidos (um, uma, uns, umas) y contracciones (ao, à, do, da, no, na, pelo, pela)', prereqs: [] },
  { id: 'b2-genero', name: 'Gênero gramatical', blockId: 2, description: 'Reglas de masculino/femenino: terminación -o/-a, sustantivos comunes en cuanto a género, excepciones', prereqs: [] },
  { id: 'b2-numero', name: 'Número (singular/plural)', blockId: 2, description: 'Reglas de plural: -s, -es, -ões, -ães, casos irregulares', prereqs: [] },
  { id: 'b2-possessivos', name: 'Pronomes possessivos', blockId: 2, description: 'meu/minha, teu/tua, seu/sua, nosso/nossa, vosso/vossa, seu/sua (3ª persona), posicionamento pre/postnominal', prereqs: [] },
  { id: 'b2-demonstrativos', name: 'Demonstrativos', blockId: 2, description: 'este/esta, esse/essa, aquele/aquela + formas plural; uso para señalar distancia', prereqs: [] },
  { id: 'b2-indefinidos', name: 'Indefinidos', blockId: 2, description: 'todo, muito, pouco, algum, nenhum, certo, vários, qualquer', prereqs: [] },
];

const B2: Block = {
  id: 2,
  slug: 'morfologia-nominal',
  name: 'Morfología nominal',
  description: 'Artigos, gênero, número, possessivos, demonstrativos e indefinidos — el sistema de modificación nominal que cubre todas las frases sin verbo principal.',
  durationWeeks: 4,
  prereqs: [1],
  freeDrill: false,
  lessons: b2Lessons as Lesson[],
};

// --- Block 3: Presente e imperativo ---
const B3_CONCEPTS: Concept[] = [
  { id: 'b3-presente-regular', name: 'Presente do indicativo regular', blockId: 3, description: 'Conjugación regular de verbos en -ar, -er, -ir', prereqs: [] },
  { id: 'b3-presente-irregular', name: 'Presente irregular frecuente', blockId: 3, description: 'ser, estar, ter, ir, fazer, dizer, vir, ver, poder, querer, saber, dar, traer', prereqs: [] },
  { id: 'b3-pronomes', name: 'Pronomes pessoais', blockId: 3, description: 'Retos (eu, tu, ele/ela, nós, vós, eles/elas) y oblícuos (me, te, se, o, a, lhe, nos, vos, os, as, lhes)', prereqs: [] },
  { id: 'b3-imperativo', name: 'Imperativo', blockId: 3, description: 'Afirmativo (fala, fale, falemos) y negativo (não fales, não fale) — irregulares y reflexivos', prereqs: [] },
  { id: 'b3-existenciais', name: 'Existenciales (haver/ter)', blockId: 3, description: 'Há = existe(n) (impersonal) vs tem = tiene (también existencial en BR). Distribución y registros.', prereqs: [] },
  { id: 'b3-interrogativos', name: 'Interrogativos', blockId: 3, description: 'que / o que / qual / quem / onde / quando / como / porquê, con la trampa que el español garantiza: «qual» donde el español pone «cuál» pero también donde pone «qué» («Qual é o teu nome?»)', prereqs: [] },
];

const B3: Block = {
  id: 3,
  slug: 'presente-imperativo',
  name: 'Verbal: presente e imperativo',
  description: 'Presente regular e irregular, pronomes pessoais, imperativo afirmativo y negativo, y la distinción haver/ter existencial.',
  durationWeeks: 4,
  prereqs: [2],
  freeDrill: false,
  lessons: b3Lessons as Lesson[],
};

// --- Block 4: Pasados ---
const B4_CONCEPTS: Concept[] = [
  { id: 'b4-perfeito-regular', name: 'Pretérito perfeito regular', blockId: 4, description: 'Conjugación regular: -ei, -aste, -ou, -amos, -astes, -aram (verbos en -ar); -i, -este, -eu, -emos, -estes, -eram (-er/-ir)', prereqs: [] },
  { id: 'b4-perfeito-irregular', name: 'Pretérito perfeito irregular', blockId: 4, description: 'ir, ser, estar, ter, fazer, dizer, vir, ver, poder, querer, saber, dar, trazer, pôr', prereqs: [] },
  { id: 'b4-imperfeito', name: 'Pretérito imperfeito', blockId: 4, description: 'Conjugación regular: -ava, -avas, -ava, -ávamos, -áveis, -avam (-ar); -ia, -ias, -ia, -íamos, -íeis, -iam (-er/-ir). Irregular: ser, ir, ver', prereqs: [] },
  { id: 'b4-mais-que-perfeito', name: 'Pretérito mais-que-perfeito', blockId: 4, description: 'Composto (tinha + particípio) y simples (falara) — uso literario', prereqs: [] },
  { id: 'b4-contraste-passado', name: 'Contraste perfeito/imperfeito', blockId: 4, description: 'Perfeito = evento puntual/cerrado; imperfeito = descripción/hábito/fondo. Marcadores temporales (ontem, sempre, enquanto)', prereqs: [] },
];

const B4: Block = {
  id: 4,
  slug: 'pasados',
  name: 'Verbal: pasados',
  description: 'Pretérito perfeito regular e irregular, imperfeito, mais-que-perfeito composto, y el contraste entre perfeito (evento) e imperfeito (hábito/fondo).',
  durationWeeks: 6,
  prereqs: [3],
  freeDrill: false,
  lessons: b4Lessons as Lesson[],
};

// --- Block 5: Futuros y condicional ---
const B5_CONCEPTS: Concept[] = [
  { id: 'b5-futuro-presente', name: 'Futuro do presente (simples)', blockId: 5, description: 'Conjugación de falarei, falarás...; irregulares (ser, estar, ter, ir, fazer, dizer, vir, ver, poder, querer, saber, dar, trazer, pôr)', prereqs: [] },
  { id: 'b5-futuro-composto', name: 'Futuro composto (ir + infinitivo)', blockId: 5, description: 'Vou falar, vais falar, vai falar...; uso informal/coloquial y como sustituto del futuro simple en BR', prereqs: [] },
  { id: 'b5-condicional', name: 'Condicional simple', blockId: 5, description: 'Conjugación de falaria, falarias...; irregulares; uso para deseo cortés y reporte de discurso indirecto', prereqs: [] },
  { id: 'b5-se-condicional', name: 'Se + futuro/condicional', blockId: 5, description: 'Oraciones condicionales tipo 1 (si presente, futuro) y tipo 2 (si imperfeito subjuntivo, condicional)', prereqs: [] },
];

const B5: Block = {
  id: 5,
  slug: 'futuros-condicional',
  name: 'Verbal: futuros y condicional',
  description: 'Futuro do presente (simple) y composto (ir + infinitivo), condicional simple, y oraciones condicionales tipo 1 y 2.',
  durationWeeks: 3,
  prereqs: [4],
  freeDrill: false,
  lessons: b5Lessons as Lesson[],
};

// --- Block 6: Subjuntivo ---
const B6_CONCEPTS: Concept[] = [
  { id: 'b6-presente-subj', name: 'Presente do conjuntivo', blockId: 6, description: 'Conjugación regular e irregular (ser, estar, ter, ir, fazer, dizer, vir, ver, poder, querer, saber, dar, trazer, pôr)', prereqs: [] },
  { id: 'b6-imperfeito-subj', name: 'Imperfeito do conjuntivo', blockId: 6, description: 'Derivación del imperfeito (-ar → -asse; -er/-ir → -esse); irregulares (ser, estar, ter, ir, fazer, ver, vir)', prereqs: [] },
  { id: 'b6-futuro-subj', name: 'Futuro do conjuntivo', blockId: 6, description: 'Derivación del perfeito (-ar → -ar; -er/-ir → -er); uso con quando, se, assim que, como se', prereqs: [] },
  { id: 'b6-se-subjuntivo', name: 'Se + conjuntivo', blockId: 6, description: 'Condicionales tipo 3 (imperfeito subj) y 4 (mais-que-perfeito subj) — hipótesis improbable/irreal', prereqs: [] },
  { id: 'b6-contraste-indicativo-subjuntivo', name: 'Contraste indicativo/conjuntivo', blockId: 6, description: 'Certeza/hecho (indicativo) vs deseo/duda/temor/emotion (conjuntivo); expresiones impessoales (é importante que, é possível que)', prereqs: [] },
];

const B6: Block = {
  id: 6,
  slug: 'subjuntivo',
  name: 'Conjuntivo',
  description: 'Presente, imperfeito y futuro do conjuntivo, condicionales con conjuntivo, y el contraste indicativo/conjuntivo (certeza vs duda/deseo/emotion).',
  durationWeeks: 8,
  prereqs: [5],
  freeDrill: false,
  lessons: b6Lessons as Lesson[],
};

// --- Block 7: Formas no personales ---
const B7_CONCEPTS: Concept[] = [
  { id: 'b7-infinitivo-pessoal', name: 'Infinitivo pessoal', blockId: 7, description: 'Forma portuguesa única: falar (general) vs falar eu, falares tu, falar ele; uso en lugar de conjuntivo/infinitivo compuesto', prereqs: [] },
  { id: 'b7-gerundio', name: 'Gerúndio', blockId: 7, description: 'Conjugación regular (-ando, -endo, -indo); uso con estar, andar, ir, vir (estar falando); construcción progresiva', prereqs: [] },
  { id: 'b7-participio', name: 'Particípio', blockId: 7, description: 'Regular (-ado, -ido) e irregulares (feito, dito, escrito, visto, posto, ganho, morto, nado); uso con ter/haver y como adjetivo', prereqs: [] },
];

const B7: Block = {
  id: 7,
  slug: 'formas-no-personales',
  name: 'Formas no personales',
  description: 'Infinitivo pessoal (singular de la PT), gerúndio, y particípio (regular e irregular) con sus construcciones (estar + ger, ter/haver + part, voz pasiva).',
  durationWeeks: 3,
  prereqs: [6],
  freeDrill: false,
  lessons: b7Lessons as Lesson[],
};

// --- Block 8: Sintaxis y conectores ---
const B8_CONCEPTS: Concept[] = [
  { id: 'b8-conectores', name: 'Conectores', blockId: 8, description: 'Causales (porque, pois, já que), consecutivos (por isso, então, logo), adversativos (porém, contudo, entretanto, mas), concessivos (embora, apesar de, ainda que)', prereqs: [] },
  { id: 'b8-oracoes-subordinadas', name: 'Orações subordinadas', blockId: 8, description: 'Substantivas (que, se, quem, qual), adjetivas (que, cujo, onde, quem), adverbiais (quando, onde, como, porque)', prereqs: [] },
  { id: 'b8-colocacao-pronominal', name: 'Colocação pronominal', blockId: 8, description: 'Próclise (conjunción + verbo: não me diga), ênclise (verbo + pronombre: diga-me), mesóclise (futuro/cnj + pronombre: dir-se-á)', prereqs: [] },
  { id: 'b8-discurso-indireto', name: 'Discurso indireto', blockId: 8, description: 'Transformación de tiempos: presente→imperfeito, perfeito→mais-que-perfeito, futuro→condicional; cambios pronominales y deícticos', prereqs: [] },
];

const B8: Block = {
  id: 8,
  slug: 'sintaxis-conectores',
  name: 'Sintaxis y conectores',
  description: 'Conectores discursivos, oraciones subordinadas (substantivas, adjetivas, adverbiales), colocación pronominal, y transformación al discurso indirecto.',
  durationWeeks: 4,
  prereqs: [7],
  freeDrill: false,
  lessons: b8Lessons as Lesson[],
};

// --- Block 9: Léxico (freeDrill) ---
// B9 no genera lecciones — es un modo de drill libre sobre el catálogo de
// vocabulario (lib/data/vocab-catalog.json). Por eso lessons es [] y el bloque
// se salta completamente en generate-content y generate-stories. El catálogo
// de vocab se enriquece automáticamente a medida que las stories se generan.
const B9: Block = {
  id: 9,
  slug: 'lexico',
  name: 'Léxico por campos',
  description: 'Modo de drill libre sobre el vocabulario acumulado de las historias (141+ palabras). Sin lecciones estructuradas — el usuario practica a su ritmo.',
  durationWeeks: null,
  prereqs: [],
  freeDrill: true,
  lessons: b9Lessons as Lesson[],
};

// --- Block 10: Registros y variación ---
const B9_CONCEPTS: Concept[] = [
  // Declarado en E2#14 por el barrido de etiquetado. NO se inventa para
  // que cuadre una cifra: **doce juicios publicados llevaban desde el
  // lote 1 enseñando exactamente esto y no tenían dónde vivir**
  // (estornudar, bocadillo, embarazada, taller, botella, camarero,
  // cenar, disculpas, prohibido, vacações, aficionado, olvidar). Sin el
  // punto, los doce eran invisibles para la tabla de cobertura, porque
  // el bucle de asignación itera `concepts` y el suyo estaba vacío.
  //
  // Es distinto del FALSO AMIGO, que ya tiene su punto en C1: el falso
  // amigo existe en portugués con otro sentido («polvo» es pulpo,
  // «esquisito» es raro); el hispanismo simplemente NO existe. Uno se
  // enseña desactivando una lectura, el otro sustituyendo una palabra.
  { id: 'b9-lexico-anti-calco', name: 'Hispanismo léxico: la palabra española que el portugués no tiene', blockId: 9, description: 'Palabras españolas que se cuelan porque el portugués tiene otra distinta y no un homógrafo: estornudar/espirrar, bocadillo/sandes, embarazada/grávida, taller/oficina, botella/garrafa, camarero/empregado, cenar/jantar, disculpas/desculpas, vacaciones/férias, aficionado/adepto, olvidar/esquecer', prereqs: [] },
];

const B10_CONCEPTS: Concept[] = [
  { id: 'b10-registro', name: 'Registro formal/informal', blockId: 10, description: 'Marcadores de formalidad (vocabulario, tratamiento você/o senhor/a senhora, conectores, pronombres), cartas/e-mails vs conversación', prereqs: [] },
  { id: 'b10-variacao-diatopica', name: 'Variação diatópica + norma culta', blockId: 10, description: 'Diferencias BR↔PT (léxico, fonética, gramática), variantes regionales (norte/sul de BR, Açores/Madeira), norma culta escrita vs uso coloquial', prereqs: [] },
  // Ancla propia de la línea B industrial (E2#5): sin ella, cientos de
  // relays de aviso colgarían de b10-registro y cegarían el eje de
  // concepts del gate de virginidad dentro de su propia clase.
  { id: 'b10-relay-avisos', name: 'Relay de avisos e recados', blockId: 10, description: 'Mediación de información práctica: extraer los datos de un aviso/SMS/recado (día, franja, lugar, acción, condición, contacto), decidir cuáles viajan para cada destinatario y trasladarlos entre pt y es sin calcos ni datos inventados', prereqs: ['b10-registro'] },
  { id: 'b10-fidelidad-relay', name: 'Fidelidade de relay', blockId: 10, description: 'Fidelidad de relay: auditar un recado ya escrito contra su aviso y nombrar qué le pasa — plazo adelantado («até X» incluye X), dato omitido, dato inventado, valor alterado o agente reasignado —, o reconocer que es fiel', prereqs: ['b10-relay-avisos'] },
];

const B10: Block = {
  id: 10,
  slug: 'registros-variacion',
  name: 'Registros y variación',
  description: 'Registro formal vs informal, tratamiento personal, y variación diatópica entre Brasil y Portugal (léxico, gramática, norma culta).',
  durationWeeks: 2,
  prereqs: [8],
  freeDrill: false,
  lessons: b10Lessons as Lesson[],
};

// Bloque 11 (Ola B2C2, 2026-07-30): las lecciones PROPIAS del tramo
// C1 — anti-calco y falsos amigos. Los ítems de juicio de los lotes
// b2c2-* dejan de archivarse en lecciones prestadas conforme estas
// existan. Los ejercicios propios del bloque llegarán con los lotes.
// Conceptos del bloque 11. Vivían DENTRO de B10_CONCEPTS —funcionaban,
// porque ALL_CONCEPTS los arrastraba en el spread, pero cualquiera que
// añadiera un concepto de b11 lo habría puesto en el array equivocado.
const B11_CONCEPTS: Concept[] = [
  { id: 'b11-regencias', name: 'Regências que traem', blockId: 11, description: 'Regencias portuguesas que difieren del español (apaixonar-se por, preocupar-se com, assistir a) y la herencia de la preposición en las relativas', prereqs: [] },
  { id: 'b11-falsos-amigos', name: 'Falsos amigos C1', blockId: 11, description: 'Falsos amigos de alta frecuencia con sentido portugués divergente (esquisito, polvo, oficina, pelo, esperto, constipado) y sus pares resolutivos', prereqs: [] },
  { id: 'b11-morfologia-enganosa', name: 'Morfología que engaña', blockId: 11, description: 'Morfología portuguesa sin aviso desde el español: plurales en -ão (-ãos/-ães/-ões), clíticos -lo/-la tras -r/-s/-z, lhe dativo frente al leísmo, adjetivos invariables en género', prereqs: [] },
  { id: 'b11-alternancia-infinitivo', name: 'Alternancia infinitivo pessoal / conjuntivo / infinitivo simples', blockId: 11, description: 'La elección entre las tres, que en C1 ya no es de forma sino de criterio: sujeto propio y expreso pide infinitivo pessoal; sujeto distinto tras conjunción pide conjuntivo; mismo sujeto y sin conjunción, infinitivo simple', prereqs: [] },
  { id: 'b11-conectores-discursivos', name: 'Conectores de nivel discursivo', blockId: 11, description: 'Los que ordenan el texto y no la oración (não obstante, com efeito, isto é, ora bem, de resto, aliás, quando muito, tanto mais que): su régimen sintáctico y su registro, que el español reparte de otra manera', prereqs: [] },
  { id: 'b11-ser-estar-divergente', name: 'Ser y estar donde el español elige distinto', blockId: 11, description: 'Los usos en que la elección portuguesa no coincide con la española: los eventos van con SER (a reunião é às três), la nacionalidad y la profesión con SER aunque sean temporales, y el estado resultante con ESTAR', prereqs: [] },
  { id: 'b11-aspecto-tempo', name: 'Aspecto y tiempo sin calco', blockId: 11, description: 'Valores aspectuales que el español no traslada: pretérito perfeito composto durativo (no es "he hablado"), estar a + infinitivo frente a andar a + infinitivo, perífrasis de probabilidad', prereqs: [] },

  // ── E2#17 · los puntos de C1 que el currículo enumera y nadie había
  // declarado. NO son los 25 que decía la resta «32 − 7»: sacado el texto
  // de cada segmento, ocho son comprensión o producción ORAL (a cero por
  // decisión), cinco son metas de vocabulario que se cubren leyendo, y uno
  // era la cola de una frase partida por una coma. Quedan éstos, que sí se
  // enseñan y sí se ejercitan. Dictamen en docs/plans/puntos-c1c2-dictamen.json.
  { id: 'b11-coloc-registro', name: 'Colocación como recurso de registro', blockId: 11, description: 'A C1 la colocación ya no se acierta, se ELIGE: cuándo la ênclise suena culta y cuándo pedante, cuándo la próclise sin atractor marca oralidad, y qué dice de un texto la mesóclise que nadie usa al hablar', prereqs: ['b8-colocacao-pronominal'] },
  { id: 'b11-ordem-foco', name: 'Orden de constituyentes y foco', blockId: 11, description: 'El portugués coloca para informar: qué se antepone, qué se pospone y qué queda al final porque es lo nuevo — la ventaja del hispanohablante, cuya lengua ya lo hace, y las diferencias que le traicionan', prereqs: [] },
  { id: 'b11-topico', name: 'Construcciones de tópico', blockId: 11, description: 'Sacar un elemento al frente como tema del que se habla («Esse livro, já o li»), con o sin retomada por clítico, y la frontera con la dislocación que el portugués no admite', prereqs: ['b11-ordem-foco'] },
  { id: 'b11-imperfeito-valores', name: 'Valores del imperfeito', blockId: 11, description: 'Más allá del hábito y de la descripción: el imperfeito de cortesía, el lúdico, el de contrafactual coloquial («se soubesse, ia») y el narrativo — valores en los que el español no siempre acompaña', prereqs: ['b4-imperfeito'] },
  { id: 'b11-haver-ter-existir', name: 'haver / ter / existir', blockId: 11, description: 'Los tres existenciales en el registro culto: «há» neutro, «existe» con concordancia y sabor escrito, «tem» brasileño — y por qué la elección es de registro y de variedad antes que de gramática', prereqs: ['b3-existenciais'] },
  { id: 'b11-nominalizacao', name: 'Nominalización y estilo denso', blockId: 11, description: 'Convertir el verbo en nombre para comprimir la frase, que es como escribe la prensa y la administración portuguesas — y saber deshacerlo al leer', prereqs: [] },
  { id: 'b11-pontuacao-sintatica', name: 'Puntuación como recurso sintáctico', blockId: 11, description: 'La coma que el portugués prohíbe entre sujeto y verbo, la que separa una explicativa de una especificativa, y los dos puntos y el punto y coma como articulación del período largo', prereqs: [] },
  { id: 'b11-norma-culta-oral', name: 'Norma culta escrita frente a uso oral culto', blockId: 11, description: 'Lo que un portugués instruido escribe pero no dice, y lo que dice pero no escribiría: concordancias, clíticos, «a gente», y saber en qué lado del par está cada forma', prereqs: [] },
  { id: 'b11-ironia-understatement', name: 'Ironía y understatement portugueses', blockId: 11, description: 'La atenuación que dice menos para significar más, el elogio que es reproche y el «não está mau» que es un elogio — leerlo y explicarlo, que es donde el hispanohablante se pierde', prereqs: [] },
  { id: 'b11-alusao-cultural', name: 'Alusión cultural mínima', blockId: 11, description: 'Las referencias que un texto adulto da por sabidas: 25 de Abril, Estado Novo, o Império y la descolonización, saudade y fado, Camões, Pessoa, Saramago, Amália, a troika, a diáspora', prereqs: [] },
  { id: 'b11-humor-autodepreciativo', name: 'Humor autodepreciativo', blockId: 11, description: 'Reírse de uno mismo y del propio país como forma de vínculo, y por qué responderlo con consuelo o con acuerdo entusiasta son las dos maneras de equivocarse', prereqs: [] },
  { id: 'b11-descortesia-calculada', name: 'Descortesía calculada', blockId: 11, description: 'Ser cortante a propósito y con precisión: qué recursos marcan distancia deliberada sin ser groseros, y cómo se reconoce que lo son', prereqs: ['b10-registro'] },
  { id: 'b11-jerarquias-profissionais', name: 'Gestión de jerarquías profesionales', blockId: 11, description: 'Cómo se dirige uno hacia arriba, hacia abajo y en horizontal en una empresa portuguesa: tratamiento, atenuación, quién escribe primero y qué se pide por escrito', prereqs: ['b10-reg-tratamento'] },
  { id: 'b11-mediacao-especializada', name: 'Mediación de textos especializados', blockId: 11, description: 'Trasladar un texto técnico, jurídico o médico a alguien que no es del campo, sin perder el dato que importa ni fingir una precisión que no se tiene', prereqs: [] },
  { id: 'b11-mediacao-intercultural', name: 'Mediación intercultural ES↔PT', blockId: 11, description: 'Mediar sabiendo cómo se percibe al hispanohablante en Portugal y que su español es a la vez ventaja y ruido: anticipar el malentendido y desactivarlo antes de que ocurra', prereqs: [] },
];

const B11: Block = {
  id: 11,
  slug: 'anti-calco-c1',
  name: 'Anti-calco C1',
  description: 'Falsos amigos, regencias y perífrasis donde el español sabotea al C1: el reflejo de pararse cuando el contexto rechina.',
  durationWeeks: 2,
  prereqs: [8, 10],
  freeDrill: false,
  lessons: b11Lessons as Lesson[],
};


// ── BLOQUE 12 · C2 ──────────────────────────────────────────────────
// Nace en E2#13 (2026-09-03). Hasta aquí C2 eran **408 unidades de
// déficit inalcanzables**: el currículo enumera 34 puntos de C2 y no
// había ni un concepto declarado ni un bloque donde aterrizar un ítem,
// porque `LessonSchema.blockId` topaba en 11.
//
// Se declaran los OCHO puntos de la línea de GRAMÁTICA del currículo de
// C2, que son los que un juicio de gramaticalidad puede atacar hoy. Los
// otros (léxico opaco, fonología, pragmática, mediación profesional) se
// declararán cuando exista el formato que los ejercita — declararlos
// antes sería fingir cobertura.
//
// Declararlos NO crea trabajo: lo hace visible. En la tabla de déficit
// pasan de la columna «sin empezar» a la de «declarados con cero», que
// es la que la línea de reconciliación vigila, y el total no se mueve.
// Es la lección de E2#12: un punto a cero era invisible para la métrica.
const B12_CONCEPTS: Concept[] = [
  { id: 'b12-borde-gramaticalidad', name: 'El borde de la gramaticalidad ES/PT', blockId: 12, description: 'Las estructuras que el español permite y el portugués no, y al revés: duplicación del clítico, neutro «lo», infinitivo flexionado con sujeto propio, sujeto de infinitivo, orden de constituyentes admisible en una lengua y no en la otra', prereqs: ['b11-alternancia-infinitivo'] },
  { id: 'b12-concordancia-discutida', name: 'Concordancia en casos discutidos', blockId: 12, description: 'Los casos que la propia norma portuguesa debate: «fazer» impersonal con expresiones de tiempo, «um dos que» + singular o plural, concordancia del participio con ter y con ser, sujeto colectivo, porcentajes y cuantificadores partitivos', prereqs: [] },
  { id: 'b12-regencia-rara', name: 'Régimen de verbos de baja frecuencia', blockId: 12, description: 'La regência de los verbos que no aparecen en el uso corriente y para los que el hablante avanzado ya no tiene modelo: aludir a, obstar a, precaver-se contra, imiscuir-se em, arrogar-se, comprazer-se em', prereqs: ['b11-regencias'] },
  { id: 'b12-arcaismo-juridico', name: 'Arcaísmos vivos del registro jurídico y notarial', blockId: 12, description: 'Las formas que están muertas en la lengua corriente y vivas en su registro (outrossim, porquanto, destarte, conquanto, doravante, amiúde) y, sobre todo, la destreza de saber cuándo NO usarlas', prereqs: ['b10-registro'] },
  { id: 'b12-sintaxe-literaria', name: 'Sintaxis literaria', blockId: 12, description: 'Hipérbaton, anteposición del complemento, encabalgamiento sintáctico y otras licencias de la prosa literaria portuguesa: reconocerlas al leer y calibrarlas al escribir', prereqs: [] },
  { id: 'b12-mesoclise-estilistica', name: 'La mesóclise como recurso de estilo', blockId: 12, description: 'La mesóclise a C2 ya no es una forma obligada sino una elección de registro: cuándo un futuro o un condicional con clítico pide mesóclise, cuándo la próclise por atractor la desactiva y cuándo usarla suena a impostura', prereqs: ['b8-coloc-mesoclise'] },
  { id: 'b12-mqp-simples-literario', name: 'Mais-que-perfeito simples en narración', blockId: 12, description: 'El «falara» de la narración literaria frente al «tinha falado» corriente: valor, registro y los contextos en que el simples es la única forma natural', prereqs: [] },
  { id: 'b12-modo-pragmatico', name: 'Alternancias de modo con valor pragmático', blockId: 12, description: 'Los casos en que indicativo y conjuntivo son los dos gramaticales y lo que cambia es lo que el hablante da por sabido, por dudoso o por cortés — el modo como acto de habla, no como concordancia', prereqs: ['b6-contraste-indicativo-subjuntivo'] },

  // ── E2#17 · los de C2, por el mismo dictamen. De los 26 que decía la
  // resta «34 − 8» quedan ocho: siete eran orales, cuatro metas de
  // vocabulario, dos colas de frase, uno un objetivo profesional — y
  // CUATRO eran prosa técnica del propio documento que el separador
  // convirtió en «puntos» («'relay'|'summarise'|…», «fidelityAnchors»).
  { id: 'b12-derivacao-produtiva', name: 'Derivación productiva', blockId: 12, description: 'Crear palabra con los sufijos vivos del portugués —-agem, -ada, -ório, -ez, -ice— y que suene natural, que es lo que separa al que sabe la lengua del que sabe sus palabras', prereqs: [] },
  { id: 'b12-repertorio-sociolinguistico', name: 'Repertorio sociolingüístico completo', blockId: 12, description: 'Moverse por todos los registros a voluntad y sostener cada uno: del despacho al café y del café al despacho, sin arrastrar marcas del anterior', prereqs: ['b10-registro'] },
  { id: 'b12-humor-jogo-palavras', name: 'Humor y juego de palabras', blockId: 12, description: 'El chiste que vive en la doble lectura de una palabra o de una sintaxis, y la capacidad de explicarlo — que es la prueba de que se entendió', prereqs: [] },
  { id: 'b12-descortesia-precisa', name: 'Descortesía con precisión', blockId: 12, description: 'Ofender exactamente lo que se quiere ofender y nada más: la diferencia entre el corte medido y el exabrupto, que a C2 ya es una elección técnica', prereqs: ['b11-descortesia-calculada'] },
  { id: 'b12-ler-posicao-social', name: 'Leer la posición social por el habla', blockId: 12, description: 'Deducir origen, edad, clase y grado de instrucción de un hablante por sus marcas — y saber qué se hace con esa información y qué no', prereqs: [] },
  { id: 'b12-cortesia-pt-br-es', name: 'Cortesía PT / BR / hispanoamericana, explicada', blockId: 12, description: 'La competencia específica del hispanohablante experto: no sólo cambiar de variedad sino EXPLICAR en qué se diferencian los tres sistemas de cortesía, como objeto de mediación profesional', prereqs: ['b10-var-tratamento'] },
  { id: 'b12-traducao-literaria', name: 'Traducción literaria y de opinión', blockId: 12, description: 'Trasladar registro y efecto además de contenido: el texto que se juzga por cómo suena, no sólo por lo que dice', prereqs: [] },
  { id: 'b12-mediacao-de-textos', name: 'Mediación de textos', blockId: 12, description: 'Mediación de textos en el sentido del Companion Volume: resumir, sintetizar fuentes que se contradicen y trasladar lo que importa a un destinatario concreto', prereqs: [] },
];

const B12: Block = {
  id: 12,
  slug: 'passar-por-portugues-c2',
  name: 'Pasar por portugués (C2)',
  description: 'Precisión, matiz y control del registro sin que el español asome: el borde de la gramaticalidad, la concordancia discutida y lo que a este nivel ya es estilo y no regla.',
  durationWeeks: 3,
  prereqs: [11],
  freeDrill: false,
  lessons: b12Lessons as Lesson[],
};

export const BLOCKS: Block[] = [B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12];

import { CONCEPTOS_FINOS } from './conceptos-finos.generated';

export const ALL_CONCEPTS: Concept[] = [
  // Los sub-puntos en que se parten los conceptos gruesos (E2#10).
  // Generados desde scripts/lib/conceptos-finos.ts.
  ...CONCEPTOS_FINOS,
  ...B1_CONCEPTS,
  ...B2_CONCEPTS,
  ...B3_CONCEPTS,
  ...B4_CONCEPTS,
  ...B5_CONCEPTS,
  ...B6_CONCEPTS,
  ...B7_CONCEPTS,
  ...B8_CONCEPTS,
  // B9 is freeDrill — no Concept[] (it drills whatever vocab the catalog has).
  ...B10_CONCEPTS,
  ...B9_CONCEPTS,
  ...B11_CONCEPTS,
  ...B12_CONCEPTS,
];

export function getBlock(id: number): Block {
  const b = BLOCKS.find(b => b.id === id);
  if (!b) throw new Error(`Block ${id} not found`);
  return b;
}

export function getLesson(id: LessonId): Lesson {
  for (const b of BLOCKS) {
    const l = b.lessons.find(l => l.id === id);
    if (l) return l;
  }
  throw new Error(`Lesson ${id} not found`);
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  return ids.map(id => {
    const c = ALL_CONCEPTS.find(c => c.id === id);
    if (!c) throw new Error(`Concept ${id} not found`);
    return c;
  });
}

// scripts/lib/conceptos-finos.ts
//
// LA PARTICIÓN DE LOS CONCEPTOS GRUESOS.
//
// El inventario de 51 conceptos no es un inventario de puntos de
// enseñanza: `b10-registro` tenía 125 ítems y `b6-contraste-indicativo-
// subjuntivo` 90, no porque sobren sino porque cada uno es una familia
// entera. Medido en E2#9: densidad 48 ítems por concepto, mediana 53,
// máximo 125. Con esa granularidad, cualquier criterio de «N ítems por
// punto» mide el inventario tanto como el curso.
//
// Aquí cada concepto grueso se parte en SUB-PUNTOS, y el criterio de
// partición es el que un profesor usaría: **una cosa que se enseña de
// una vez y se puede preguntar**. Donde la gramática da una forma
// distintiva (una raíz fuerte, una contracción, un atractor de próclise),
// la regla es sobre la FORMA, que es objetiva. Donde no la hay, se dice.
//
// Los ítems que no casan con ningún sub-punto se quedan en el concepto
// padre y se REPORTAN: el residuo es información, no basura. En la
// primera pasada destapó ítems mal etiquetados de origen — diez ítems de
// regência verbal («precisou de», «lembrei-me de») viviendo bajo
// «pretérito perfeito irregular».

export interface SubPunto {
  id: string;
  nombre: string;
  re: RegExp;
}
export interface Particion {
  padre: string;
  /** por qué se parte así, en una línea: el criterio tiene que ser discutible */
  criterio: string;
  subs: SubPunto[];
}

const w = (...xs: string[]) => new RegExp(`(?<![\\p{L}])(?:${xs.join('|')})(?![\\p{L}])`, 'iu');


/** Reglas TRANSVERSALES: puntos que atraviesan el corpus entero y que el
 *  etiquetado original repartió entre conceptos que no son el suyo.
 *
 *  El caso que las motiva, medido: hay **180 ítems `verb_preposition`
 *  repartidos entre 43 conceptos distintos**, y el reparto es de CINCO
 *  por concepto casi exacto — o sea, un generador espolvoreó regência
 *  verbal por todos lados sin mirar el tema. Un ítem que pregunta si
 *  «gostar» rige DE no enseña el género del sustantivo ni el pretérito
 *  irregular, por mucho que viva bajo esa etiqueta.
 *
 *  Tienen PRECEDENCIA sobre la partición del concepto padre. */
export interface Transversal {
  id: string;
  nombre: string;
  aplica: (x: any) => boolean;
}

const prep = (...ps: string[]) => (x: any) => {
  if (x.type !== 'verb_preposition') return false;
  const a = String(x.data?.answer ?? '').trim().toLowerCase();
  return ps.includes(a);
};

export const TRANSVERSALES: Transversal[] = [
  { id: 'reg-verbal-de', nombre: 'Regência: verbo + DE (gostar de, precisar de)', aplica: prep('de', 'do', 'da', 'dos', 'das') },
  { id: 'reg-verbal-em', nombre: 'Regência: verbo + EM (pensar em, acreditar em)', aplica: prep('em', 'no', 'na', 'nos', 'nas') },
  { id: 'reg-verbal-a', nombre: 'Regência: verbo + A (assistir a, obedecer a)', aplica: prep('a', 'ao', 'à', 'aos', 'às') },
  { id: 'reg-verbal-com', nombre: 'Regência: verbo + COM (sonhar com, contar com)', aplica: prep('com') },
  { id: 'reg-verbal-por-para', nombre: 'Regência: verbo + POR / PARA', aplica: prep('por', 'pelo', 'pela', 'para') },
  { id: 'reg-verbal-zero', nombre: 'Regência CERO donde el español pone preposición', aplica: prep('∅', '—', '-', '') },
  { id: 'reg-verbal-otras', nombre: 'Regência: otras preposiciones', aplica: (x: any) => x.type === 'verb_preposition' },
];

export const PARTICIONES: Particion[] = [
  // ── B1 · fonética y ortografía ──────────────────────────────────
  {
    padre: 'b1-vogais-nasais',
    criterio: 'por grafía de la nasal, que es lo que el alumno tiene que reconocer y producir',
    subs: [
      { id: 'b1-nasal-ao-oes', nombre: 'Plural -ão/-ões/-ães', re: w('ão', 'ões', 'ães', 'pão', 'pães', 'mão', 'mãos', 'coração', 'corações', 'irmão', 'irmãos', 'alemão') },
      { id: 'b1-nasal-til', nombre: 'Til sobre a/o', re: w('ã', 'õ', 'irmã', 'manhã', 'amanhã', 'lã', 'põe', 'limões') },
      { id: 'b1-nasal-m-final', nombre: 'Nasal por -m final (em, im, om, um)', re: w('bem', 'sim', 'tem', 'som', 'um', 'bom', 'homem', 'jovem', 'ninguém', 'também', 'alguém', 'nuvem', 'ordem', 'viagem') },
      { id: 'b1-nasal-n-interior', nombre: 'Nasal por n/m ante consonante', re: w('banco', 'canto', 'campo', 'tempo', 'ponte', 'onde', 'quando', 'branco', 'lento', 'centro', 'sempre') },
    ],
  },
  {
    padre: 'b1-silaba-tonica',
    criterio: 'por posición del acento y por el desplazamiento en el paradigma verbal, que es donde el español interfiere',
    subs: [
      { id: 'b1-tonica-desplazamiento-verbal', nombre: 'Desplazamiento del acento en el verbo (falo/falámos)', re: w('fal[áa]mos', 'cant[áa]mos', 'trabalh[áa]mos', 'estud[áa]mos', 'chegámos', 'gostámos', 'ficámos') },
      { id: 'b1-tonica-oxitona', nombre: 'Aguda (café, avó, jardim)', re: w('café', 'avó', 'avô', 'jardim', 'português', 'francês', 'inglês', 'irmã', 'até', 'você', 'jacaré') },
      { id: 'b1-tonica-proparoxitona', nombre: 'Esdrújula (médico, música, prático)', re: w('médico', 'música', 'prático', 'público', 'número', 'árvore', 'último', 'rápido', 'sábado', 'básico', 'fábrica') },
      { id: 'b1-tonica-paroxitona', nombre: 'Llana, la default sin tilde', re: w('casa', 'mesa', 'livro', 'porta', 'janela', 'escola', 'amigo', 'cidade', 'noite') },
    ],
  },
  {
    padre: 'b1-acentos',
    criterio: 'por diacrítico, que es lo que hay que elegir al escribir',
    subs: [
      { id: 'b1-acento-agudo', nombre: 'Agudo: vocal abierta', re: w('á', 'é', 'í', 'ó', 'ú', 'início', 'café', 'avó', 'árvore', 'médico') },
      { id: 'b1-acento-circunflexo', nombre: 'Circunflejo: vocal cerrada', re: w('â', 'ê', 'ô', 'você', 'português', 'avô', 'três', 'mês', 'câmara') },
      { id: 'b1-acento-crase', nombre: 'Grave: crase a+a', re: /à/iu },
      { id: 'b1-acento-cedilha', nombre: 'Cedilla', re: /ç/iu },
    ],
  },

  // ── B2 · determinantes ──────────────────────────────────────────
  {
    padre: 'b2-artigos',
    criterio: 'la contracción es el punto real: el artículo suelto ya lo tiene el hispanohablante, lo que no tiene es de+o=do',
    subs: [
      { id: 'b2-art-contr-de', nombre: 'Contracción con de (do, da, dos, das)', re: w('do', 'da', 'dos', 'das', 'dum', 'duma') },
      { id: 'b2-art-contr-em', nombre: 'Contracción con em (no, na, nos, nas)', re: w('no', 'na', 'nos', 'nas', 'num', 'numa') },
      { id: 'b2-art-contr-a-por', nombre: 'Contracción con a y por (ao, à, pelo, pela)', re: /(?<![\p{L}])(?:ao|aos|à|às|pelo|pela|pelos|pelas)(?![\p{L}])/iu },
      { id: 'b2-art-com-posesivo', nombre: 'Artículo ante posesivo (a minha mãe)', re: /(?<![\p{L}])(?:o|a|os|as)\s+(?:meu|minha|teu|tua|seu|sua|nosso|nossa)(?![\p{L}])/iu },
      { id: 'b2-art-com-nome', nombre: 'Artículo ante nombre propio (o Tomás)', re: /(?<![\p{L}])(?:o|a)\s+[A-ZÁÉÍÓÚ][a-záéíóúâêôãõç]{2,}/u },
    ],
  },
  {
    padre: 'b2-genero',
    criterio: 'por terminación y, aparte, los que DIVERGEN del español — que es el único subpunto que cuesta',
    subs: [
      { id: 'b2-genero-divergente', nombre: 'Género divergente del español (o sangue, a árvore)', re: w('sangue', 'leite', 'legume', 'legumes', 'nariz', 'sinal', 'costume', 'protesto', 'árvore', 'viagem', 'origem', 'garagem', 'equipa', 'cor', 'dor') },
      { id: 'b2-genero-agem-dade', nombre: 'Femeninos en -agem, -dade, -ção', re: w('viagem', 'passagem', 'mensagem', 'cidade', 'verdade', 'saudade', 'ação', 'estação', 'canção', 'lição') },
      { id: 'b2-genero-comum', nombre: 'Comunes de dos (o/a estudante)', re: w('estudante', 'cliente', 'jovem', 'gerente', 'colega', 'artista', 'turista', 'dentista') },
    ],
  },
  {
    padre: 'b2-numero',
    criterio: 'por el tipo de plural irregular, que es donde está toda la dificultad',
    subs: [
      { id: 'b2-plural-ao', nombre: 'Plural de -ão (pães, mãos, corações)', re: w('pães', 'mãos', 'corações', 'irmãos', 'alemães', 'cães', 'limões', 'aviões', 'razões') },
      { id: 'b2-plural-l', nombre: 'Plural de -l (papéis, animais, difíceis)', re: w('papéis', 'animais', 'difíceis', 'hotéis', 'espanhóis', 'azuis', 'jornais', 'hospitais') },
      { id: 'b2-plural-m-r-s', nombre: 'Plural de -m, -r, -s (homens, flores, meses)', re: w('homens', 'jovens', 'viagens', 'flores', 'mulheres', 'meses', 'países', 'lápis') },
    ],
  },
  {
    padre: 'b2-possessivos',
    criterio: 'la forma la comparten con el español; lo que no comparten es el artículo y la ambigüedad de «seu»',
    subs: [
      { id: 'b2-poss-com-artigo', nombre: 'Posesivo con artículo (a minha casa)', re: /(?<![\p{L}])(?:o|a|os|as)\s+(?:meu|minha|meus|minhas|teu|tua|nosso|nossa|seu|sua)(?![\p{L}])/iu },
      { id: 'b2-poss-seu-ambiguo', nombre: '«Seu» ambiguo y su desambiguación (dele/dela)', re: w('dele', 'dela', 'deles', 'delas') },
      { id: 'b2-poss-formas', nombre: 'Formas del posesivo', re: w('meu', 'minha', 'teu', 'tua', 'nosso', 'nossa', 'vosso', 'vossa', 'seu', 'sua') },
    ],
  },
  {
    padre: 'b2-demonstrativos',
    criterio: 'por grado deíctico y por la contracción, que es lo que no existe en español',
    subs: [
      { id: 'b2-dem-contracciones', nombre: 'Contracciones (neste, desse, àquele)', re: w('neste', 'nesta', 'nesse', 'nessa', 'naquele', 'naquela', 'deste', 'desta', 'desse', 'dessa', 'daquele', 'daquela', 'nisto', 'nisso', 'naquilo', 'disto', 'disso', 'daquilo', 'àquele', 'àquela') },
      { id: 'b2-dem-neutros', nombre: 'Neutros (isto, isso, aquilo)', re: w('isto', 'isso', 'aquilo') },
      { id: 'b2-dem-tres-graus', nombre: 'Los tres grados (este/esse/aquele)', re: w('este', 'esta', 'esse', 'essa', 'aquele', 'aquela', 'estes', 'essas', 'aqueles') },
    ],
  },
  {
    padre: 'b2-indefinidos',
    criterio: 'por serie léxica: cada una tiene su trampa propia frente al español',
    subs: [
      { id: 'b2-indef-algum-nenhum', nombre: 'Algum / nenhum', re: w('algum', 'alguma', 'alguns', 'algumas', 'nenhum', 'nenhuma', 'alguém', 'ninguém') },
      { id: 'b2-indef-todo-tudo', nombre: 'Todo frente a tudo', re: w('todo', 'toda', 'todos', 'todas', 'tudo') },
      { id: 'b2-indef-cada-qualquer', nombre: 'Cada / qualquer', re: w('cada', 'qualquer', 'quaisquer') },
      { id: 'b2-indef-outro-mesmo', nombre: 'Outro / mesmo / próprio', re: w('outro', 'outra', 'outros', 'outras', 'mesmo', 'mesma', 'próprio', 'própria') },
    ],
  },

  // ── B3 · presente, pronombres, existenciales ────────────────────
  {
    padre: 'b3-presente-regular',
    criterio: 'por conjugación, más la alternancia vocálica, que es la que sorprende',
    subs: [
      { id: 'b3-pres-alternancia', nombre: 'Alternancia vocálica (dormir → durmo)', re: w('durmo', 'subo', 'cubro', 'sirvo', 'visto', 'sigo', 'peço', 'meço', 'consigo', 'prefiro', 'repito') },
      { id: 'b3-pres-ar', nombre: 'Presente de -ar', re: w('falo', 'falas', 'fala', 'falamos', 'falam', 'trabalho', 'estudo', 'gosto', 'moro', 'compro') },
      { id: 'b3-pres-er', nombre: 'Presente de -er', re: w('como', 'comes', 'come', 'comemos', 'comem', 'bebo', 'vendo', 'aprendo', 'escrevo', 'corro') },
      { id: 'b3-pres-ir', nombre: 'Presente de -ir', re: w('parto', 'partes', 'parte', 'partimos', 'partem', 'abro', 'decido', 'divido', 'assisto') },
    ],
  },
  {
    padre: 'b3-presente-irregular',
    criterio: 'por familia de irregularidad; agrupar es más enseñable que un punto por verbo',
    subs: [
      { id: 'b3-pres-irr-ser-estar', nombre: 'Ser y estar', re: w('sou', 'és', 'somos', 'são', 'estou', 'estás', 'está', 'estamos', 'estão') },
      { id: 'b3-pres-irr-ter-vir', nombre: 'Ter y vir', re: w('tenho', 'tens', 'tem', 'temos', 'têm', 'venho', 'vens', 'vem', 'vimos', 'vêm') },
      { id: 'b3-pres-irr-ir-dar-ver', nombre: 'Ir, dar y ver', re: w('vou', 'vais', 'vai', 'vamos', 'vão', 'dou', 'dás', 'dá', 'damos', 'dão', 'vejo', 'vês', 'vê', 'veem') },
      { id: 'b3-pres-irr-fazer-dizer', nombre: 'Fazer, dizer, poder, querer, saber', re: w('faço', 'fazes', 'faz', 'fazemos', 'fazem', 'digo', 'dizes', 'diz', 'posso', 'podes', 'pode', 'quero', 'queres', 'quer', 'sei', 'sabes', 'sabe') },
    ],
  },
  {
    padre: 'b3-pronomes',
    criterio: 'por función sintáctica: cada serie tiene su forma y su posición',
    subs: [
      { id: 'b3-pron-contracoes', nombre: 'Contracciones de clíticos (mo, to, lho)', re: w('mo', 'ma', 'to', 'ta', 'lho', 'lha', 'lhos', 'lhas', 'no-lo', 'no-la') },
      { id: 'b3-pron-preposicionado', nombre: 'Preposicionados (mim, ti, si, consigo)', re: w('mim', 'ti', 'si', 'consigo', 'connosco', 'comigo', 'contigo') },
      { id: 'b3-pron-indirecto', nombre: 'Oblicuo indirecto (lhe, lhes)', re: w('lhe', 'lhes') },
      // Enclítico con guion, o clítico en minúscula seguido de verbo. La
      // v1 aceptaba cualquier «se» y se tragaba la CONJUNCIÓN: «Se quer
      // ver a conta» entraba como pronombre reflexivo. Lo cazó la
      // validación a mano de 20 asignaciones.
      { id: 'b3-pron-reflexivo', nombre: 'Reflexivos y pronominales', re: /-(?:me|te|se|nos|vos)(?![\p{L}])|(?<![\p{L}])(?<!^)(?:me|te|se|nos)\s+[a-záéíóúâêôãõç]+(?:o|as|a|es|em|amos|emos|imos|ou|eu|iu)(?![\p{L}])/u },
      { id: 'b3-pron-directo', nombre: 'Oblicuo directo (o, a, os, as; -lo, -la)', re: /-(?:lo|la|los|las|no|na)(?![\p{L}])/iu },
      { id: 'b3-pron-sujeito', nombre: 'Pronombre sujeto y su omisión', re: w('eu', 'tu', 'ele', 'ela', 'nós', 'eles', 'elas', 'a gente') },
    ],
  },
  {
    padre: 'b3-existenciais',
    criterio: 'por verbo: haver, ter y ficar reparten en portugués lo que el español hace con haber/estar',
    subs: [
      { id: 'b3-exist-haver', nombre: 'Haver impersonal (há, havia)', re: w('há', 'havia', 'houve', 'haverá', 'haja') },
      { id: 'b3-exist-ter-br', nombre: '«Tem» existencial (brasileño) frente a «há»', re: /(?<![\p{L}])tem\s+(?:muita|muito|um|uma|dois|várias?|gente|pessoas)(?![\p{L}])/iu },
      { id: 'b3-exist-ficar', nombre: 'Ficar de localización (fica no centro)', re: w('fica', 'ficam', 'ficava', 'situa-se') },
      { id: 'b3-exist-ser-estar', nombre: 'Ser frente a estar en la localización', re: /(?<![\p{L}])(?:é|são|está|estão)\s+(?:em|no|na|nos|nas|aqui|ali|lá)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b3-imperativo',
    criterio: 'el negativo es conjuntivo y el formal es tercera persona: son tres puntos, no uno',
    subs: [
      { id: 'b3-imper-negativo', nombre: 'Imperativo negativo (= conjuntivo)', re: /(?<![\p{L}])não\s+\w+(?:es|as|a|e)(?![\p{L}])/iu },
      { id: 'b3-imper-formal', nombre: 'Imperativo formal de 3.ª (fale, faça)', re: w('fale', 'faça', 'diga', 'venha', 'tenha', 'esteja', 'seja', 'abra', 'feche', 'espere') },
      { id: 'b3-imper-tu', nombre: 'Imperativo afirmativo de tu (fala, come)', re: w('fala', 'come', 'abre', 'escreve', 'bebe', 'parte', 'olha', 'espera', 'anda') },
    ],
  },

  // ── B4 · pasados ────────────────────────────────────────────────
  {
    padre: 'b4-perfeito-regular',
    criterio: 'por conjugación, y aparte el «-ámos» de 1.ª plural, que es la marca europea que Brasil no escribe',
    subs: [
      { id: 'b4-perf-amos-europeo', nombre: '«-ámos»: 1.ª plural europea con acento', re: w('falámos', 'cantámos', 'trabalhámos', 'estudámos', 'chegámos', 'gostámos', 'ficámos', 'comprámos', 'jantámos', 'acabámos') },
      // por MORFOLOGÍA, no por lista de verbos: la v1 listaba diez verbos
      // por conjugación y dejaba 37 de 57 sin asignar
      { id: 'b4-perf-ar', nombre: 'Perfeito de -ar (-ei, -aste, -ou, -aram)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{2,}(?:ei|aste|ou|ámos|amos|aram)(?![\p{L}])/iu },
      { id: 'b4-perf-er', nombre: 'Perfeito de -er (-i, -este, -eu, -eram)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{2,}(?:este|eu|emos|eram)(?![\p{L}])/iu },
      { id: 'b4-perf-ir', nombre: 'Perfeito de -ir (-i, -iste, -iu, -iram)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{2,}(?:iste|iu|imos|iram)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b4-perfeito-irregular',
    criterio: 'por FAMILIA de raíz fuerte: las catorce del currículo se enseñan en cinco grupos, no de una en una',
    subs: [
      { id: 'b4-perf-irr-ser-ir', nombre: 'Fui: ser e ir comparten paradigma', re: w('fui', 'foste', 'foi', 'fomos', 'foram') },
      { id: 'b4-perf-irr-z', nombre: 'Fiz, disse, trouxe (raíces en -z-/-ss-/-ux-)', re: w('fiz', 'fizeste', 'fez', 'fizemos', 'fizeram', 'disse', 'disseste', 'dissemos', 'disseram', 'trouxe', 'trouxeste', 'trouxemos', 'trouxeram') },
      { id: 'b4-perf-irr-ive', nombre: 'Tive, estive (raíz en -ive)', re: w('tive', 'tiveste', 'teve', 'tivemos', 'tiveram', 'estive', 'estiveste', 'esteve', 'estivemos', 'estiveram') },
      { id: 'b4-perf-irr-u', nombre: 'Pude, soube, quis, houve', re: w('pude', 'pudeste', 'pôde', 'pode', 'pudemos', 'puderam', 'soube', 'soubeste', 'soubemos', 'souberam', 'quis', 'quiseste', 'quisemos', 'quiseram', 'houve') },
      { id: 'b4-perf-irr-monos', nombre: 'Vi, vim, dei, pus (monosilábicos)', re: w('vi', 'viste', 'viu', 'viram', 'vim', 'vieste', 'veio', 'viemos', 'vieram', 'dei', 'deste', 'deu', 'demos', 'deram', 'pus', 'puseste', 'pôs', 'pusemos', 'puseram') },
    ],
  },
  {
    padre: 'b4-imperfeito',
    criterio: 'los cuatro irregulares son un punto propio; el resto se separa por lo que el imperfecto SIGNIFICA',
    subs: [
      { id: 'b4-imperf-irregulares', nombre: 'Los cuatro irregulares (era, tinha, vinha, punha)', re: w('era', 'eras', 'éramos', 'eram', 'tinha', 'tinhas', 'tínhamos', 'tinham', 'vinha', 'vinham', 'punha', 'punham') },
      { id: 'b4-imperf-habitual', nombre: 'Uso habitual (sempre, dantes, todos os dias)', re: w('sempre', 'dantes', 'antigamente', 'costumava', 'todos os dias', 'às vezes', 'geralmente') },
      { id: 'b4-imperf-cortesia', nombre: 'Imperfecto de cortesía (queria, podia)', re: /(?<![\p{L}])(?:queria|podia|gostava|desejava)(?:\s+(?:um|uma|de|que|falar|saber|pedir))/iu },
      { id: 'b4-imperf-formas', nombre: 'Formas regulares del imperfecto', re: w('falava', 'falavas', 'falávamos', 'falavam', 'comia', 'comias', 'comíamos', 'comiam', 'partia', 'partiam', 'trabalhava', 'estudava', 'morava') },
    ],
  },
  {
    padre: 'b4-contraste-passado',
    criterio: 'el contraste se decide por el MARCADOR: es lo único que el alumno puede ver',
    subs: [
      { id: 'b4-contr-marcador-perfeito', nombre: 'Marcadores de perfeito (ontem, na semana passada)', re: w('ontem', 'anteontem', 'na semana passada', 'no ano passado', 'no mês passado', 'de repente', 'nesse dia') },
      { id: 'b4-contr-marcador-imperfeito', nombre: 'Marcadores de imperfeito (sempre, enquanto)', re: w('enquanto', 'dantes', 'antigamente', 'todos os dias', 'naquela época', 'nesse tempo') },
      { id: 'b4-contr-narrativa', nombre: 'Los dos en la misma frase: fondo y suceso', re: /(?<![\p{L}])(?:quando|enquanto)\b[\s\S]{0,60}(?:ou|eu|iu|aram|eram|amos)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b4-mais-que-perfeito',
    criterio: 'el simple (falara) y el compuesto (tinha falado) son dos formas distintas de un mismo valor, y el simple es literario',
    subs: [
      { id: 'b4-mqp-simples', nombre: 'Mais-que-perfeito simples (falara), literario', re: w('falara', 'dissera', 'fizera', 'chegara', 'partira', 'vira', 'fora', 'tivera', 'estivera', 'saíra') },
      { id: 'b4-mqp-composto', nombre: 'Mais-que-perfeito composto (tinha falado)', re: /(?<![\p{L}])(?:tinha|tinhas|tínhamos|tinham|havia|haviam)\s+\w+(?:ado|ido|to|sto|ito|eito)(?![\p{L}])/iu },
      { id: 'b4-mqp-anterioridade', nombre: 'Su valor: anterioridad a otro pasado', re: /(?<![\p{L}])(?:quando|depois de que|já)\b[\s\S]{0,50}(?:tinha|havia)(?![\p{L}])/iu },
    ],
  },

  // ── B5 · futuro y condicional ───────────────────────────────────
  {
    padre: 'b5-futuro-presente',
    criterio: 'sólo tres verbos son irregulares y el perifrástico es otra construcción: tres puntos claros',
    subs: [
      { id: 'b5-fut-irregulares', nombre: 'Los tres irregulares (direi, farei, trarei)', re: w('direi', 'dirás', 'dirá', 'diremos', 'dirão', 'farei', 'farás', 'fará', 'faremos', 'farão', 'trarei', 'trará', 'traremos', 'trarão') },
      { id: 'b5-fut-perifrastico', nombre: 'Perifrástico: «vou falar», nunca «vou A falar»', re: /(?<![\p{L}])(?:vou|vais|vai|vamos|vão)\s+(?:a\s+)?[a-záéíóúâêôãõç]+(?:ar|er|ir)(?![\p{L}])/iu },
      { id: 'b5-fut-suposicao', nombre: 'Futuro de suposición (serão umas dez)', re: /(?<![\p{L}])(?:será|serão|estará|estarão|terá|haverá)\b[\s\S]{0,30}\?/iu },
      { id: 'b5-fut-regular', nombre: 'Futuro regular (-ei, -ás, -á, -emos, -ão)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{3,}(?:arei|erei|irei|arás|erás|irás|ará|erá|irá|aremos|eremos|iremos|arão|erão|irão)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b5-condicional',
    criterio: 'la cortesía es el uso más rentable y va aparte; los irregulares son los mismos tres',
    subs: [
      { id: 'b5-cond-irregulares', nombre: 'Los tres irregulares (diria, faria, traria)', re: w('diria', 'dirias', 'diríamos', 'diriam', 'faria', 'farias', 'faríamos', 'fariam', 'traria', 'traríamos', 'trariam') },
      { id: 'b5-cond-cortesia', nombre: 'Condicional de cortesía (gostaria, poderia)', re: /(?<![\p{L}])(?:gostaria|poderia|queria|desejaria|importaria)(?:\s+(?:de|que|se|um|uma))/iu },
      { id: 'b5-cond-hipotetico', nombre: 'Condicional en la apódosis hipotética', re: /(?<![\p{L}])se\b[\s\S]{0,60}(?:aria|eria|iria)(?![\p{L}])/iu },
      { id: 'b5-cond-regular', nombre: 'Condicional regular (-aria, -eria, -iria)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{3,}(?:aria|erias?|iria|aríamos|eríamos|iríamos|ariam|eriam|iriam)(?![\p{L}])/iu },
    ],
  },
  {
    // HALLAZGO DE LA PARTICIÓN: este concepto NO enseña lo que su nombre
    // dice. De sus 54 ítems, **47 son «ir + infinitivo»** (futuro
    // perifrástico) y **CERO** son «terei + particípio». El futuro
    // composto, que el currículo pide, no existe en el corpus: lo que hay
    // etiquetado con su nombre es otra cosa. Se parte por lo que de
    // verdad enseña y el hueco queda a la vista.
    padre: 'b5-futuro-composto',
    criterio: 'por lo que los ítems enseñan DE VERDAD: perifrástico, no compuesto — el compuesto está a cero',
    subs: [
      { id: 'b5-futcomp-composto-real', nombre: 'Futuro composto real (terei feito) — a CERO en el corpus', re: /(?<![\p{L}])(?:terei|terás|terá|teremos|terão)\s+\w+(?:ado|ido|to|sto|ito|eito)(?![\p{L}])/iu },
      { id: 'b5-perifrastico-ir', nombre: 'Futuro perifrástico: ir + infinitivo (sin «a»)', re: /(?<![\p{L}])(?:vou|vais|vai|vamos|vão|ia|ias|íamos|iam)\s+(?:a\s+)?[a-záéíóúâêôãõç]{2,}(?:ar|er|ir|ôr)(?![\p{L}])/iu },
      { id: 'b5-perifrastico-formas', nombre: 'Formas del auxiliar ir', re: /(?<![\p{L}])(?:vou|vais|vai|vamos|vão)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b5-se-condicional',
    criterio: 'por el tiempo de la prótasis: es lo que decide si la condición es real, hipotética o irreal',
    subs: [
      { id: 'b5-se-futuro-conj', nombre: 'Se + futuro do conjuntivo (condición real)', re: /(?<![\p{L}])se\s+(?:eu\s+|tu\s+|ele\s+|nós\s+|eles\s+)?(?:for|fores|formos|forem|tiver|tiveres|tivermos|tiverem|puder|puderes|puderem|vier|vierem|fizer|fizerem|quiser|quiserem|souber|souberem|estiver|estiverem)(?![\p{L}])/iu },
      { id: 'b5-se-imperfeito-conj', nombre: 'Se + imperfeito do conjuntivo (hipotética)', re: /(?<![\p{L}])se\s+(?:eu\s+|tu\s+|ele\s+|nós\s+|eles\s+)?\w+(?:sse|sses|ssem|ssemos)(?![\p{L}])/iu },
      { id: 'b5-se-irreal', nombre: 'Se + mais-que-perfeito (irreal de pasado)', re: /(?<![\p{L}])se\b[\s\S]{0,40}(?:tivesse|tivessem|houvesse)\s+\w+(?:ado|ido|to)(?![\p{L}])/iu },
    ],
  },

  // ── B6 · conjuntivo ─────────────────────────────────────────────
  {
    padre: 'b6-presente-subj',
    criterio: 'formación por conjugación, irregulares aparte, y los disparadores, que es lo que decide cuándo usarlo',
    subs: [
      { id: 'b6-pres-subj-irregulares', nombre: 'Irregulares (seja, esteja, vá, saiba, queira, haja, dê)', re: w('seja', 'sejas', 'sejamos', 'sejam', 'esteja', 'estejam', 'vá', 'vão', 'saiba', 'saibam', 'queira', 'queiram', 'haja', 'dê', 'deem') },
      { id: 'b6-pres-subj-disparadores', nombre: 'Disparadores (espero que, é importante que)', re: /(?<![\p{L}])(?:espero que|quero que|é importante que|é preciso que|é necessário que|é possível que|duvido que|talvez|oxalá|embora|para que|antes que)(?![\p{L}])/iu },
      { id: 'b6-pres-subj-ar', nombre: 'Formación de -ar (fale, fales, falemos)', re: w('fale', 'fales', 'falemos', 'falem', 'trabalhe', 'estude', 'compre', 'chegue', 'fique') },
      { id: 'b6-pres-subj-er-ir', nombre: 'Formación de -er/-ir (coma, parta)', re: w('coma', 'comas', 'comamos', 'comam', 'parta', 'partam', 'abra', 'abram', 'escreva', 'beba', 'viva') },
    ],
  },
  {
    padre: 'b6-imperfeito-subj',
    criterio: 'la formación sale del perfeito de 3.ª plural; la correlación temporal es el uso, y va aparte',
    subs: [
      { id: 'b6-imperf-subj-irregulares', nombre: 'Irregulares (fosse, tivesse, viesse, fizesse)', re: w('fosse', 'fossem', 'tivesse', 'tivessem', 'viesse', 'viessem', 'fizesse', 'fizessem', 'dissesse', 'dissessem', 'pudesse', 'pudessem', 'soubesse', 'quisesse', 'estivesse', 'houvesse') },
      { id: 'b6-imperf-subj-correlacao', nombre: 'Correlación con un pasado en la principal', re: /(?<![\p{L}])(?:esperava|queria|duvidava|pediu|disse|era)\b[\s\S]{0,40}(?:sse|ssem)(?![\p{L}])/iu },
      { id: 'b6-imperf-subj-formacao', nombre: 'Formación regular (-asse, -esse, -isse)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{3,}(?:asse|esse|isse|ássemos|êssemos|íssemos|assem|essem|issem)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b6-futuro-subj',
    criterio: 'es el tiempo que el español NO tiene: se separa por el conector que lo dispara, que es lo que hay que reconocer',
    subs: [
      { id: 'b6-fut-subj-irregulares', nombre: 'Irregulares (for, tiver, vier, puser, disser, fizer)', re: w('for', 'fores', 'formos', 'forem', 'tiver', 'tiveres', 'tivermos', 'tiverem', 'vier', 'vierem', 'puser', 'puserem', 'disser', 'disserem', 'fizer', 'fizerem', 'puder', 'puderem', 'quiser', 'quiserem', 'souber', 'souberem', 'estiver', 'estiverem') },
      { id: 'b6-fut-subj-quando', nombre: 'Tras quando / assim que / logo que / sempre que', re: /(?<![\p{L}])(?:quando|assim que|logo que|sempre que|enquanto|depois que)(?![\p{L}])/iu },
      { id: 'b6-fut-subj-se', nombre: 'Tras «se» de condición real', re: /(?<![\p{L}])se\s+[\s\S]{0,25}(?:ar|er|ir|for|tiver|puder)(?![\p{L}])/iu },
      { id: 'b6-fut-subj-formacao', nombre: 'Formación: infinitivo del perfeito de 3.ª plural', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{3,}(?:ares|ermos|irmos|arem|erem|irem)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b6-contraste-indicativo-subjuntivo',
    criterio: 'por el disparador, y «talvez» va SOLO porque su asimetría con el español es el punto más caro del bloque',
    subs: [
      { id: 'b6-contr-talvez', nombre: '«Talvez»: antepuesto conjuntivo, pospuesto indicativo', re: w('talvez') },
      { id: 'b6-contr-duvida', nombre: 'Verbos de duda y negación (duvidar, não crer)', re: /(?<![\p{L}])(?:duvido|duvida|duvidar|não creio|não acho|não penso|não acredito)(?![\p{L}])/iu },
      { id: 'b6-contr-certeza-indicativo', nombre: 'Certeza: indicativo (sei que, é certo que)', re: /(?<![\p{L}])(?:sei que|é certo que|é verdade que|acho que|penso que|creio que|tenho a certeza)(?![\p{L}])/iu },
      { id: 'b6-contr-impessoais', nombre: 'Impersonales (é importante/preciso/possível que)', re: /(?<![\p{L}])é\s+(?:importante|preciso|necessário|possível|provável|melhor|natural|estranho)\s+que(?![\p{L}])/iu },
      { id: 'b6-contr-emocao', nombre: 'Emoción y voluntad (espero, quero, lamento que)', re: /(?<![\p{L}])(?:espero que|quero que|lamento que|gosto que|receio que|tenho pena que|oxalá)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b6-se-subjuntivo',
    criterio: 'por grado de realidad de la condición, que es lo que elige el tiempo',
    subs: [
      { id: 'b6-se-irreal-passado', nombre: 'Irreal de pasado (se tivesse sabido)', re: /(?<![\p{L}])se\b[\s\S]{0,40}(?:tivesse|houvesse)\s+\w+(?:ado|ido|to)(?![\p{L}])/iu },
      { id: 'b6-se-hipotetico', nombre: 'Hipotética (se soubesse, dizia-te)', re: /(?<![\p{L}])se\s+(?:eu\s+|tu\s+|ele\s+|nós\s+|eles\s+)?\w+(?:sse|ssem)(?![\p{L}])/iu },
      { id: 'b6-se-real', nombre: 'Real (se + futuro do conjuntivo / indicativo)', re: /(?<![\p{L}])se\s+(?:for|tiver|puder|quiser|vier|fizer|é|está|tem)(?![\p{L}])/iu },
    ],
  },

  // ── B7 · formas no personales ───────────────────────────────────
  {
    padre: 'b7-gerundio',
    criterio: 'el punto es la OPOSICIÓN: el progresivo europeo no lleva gerundio, y hay gerundios legítimos que sí',
    subs: [
      { id: 'b7-estar-a-infinitivo', nombre: 'Progresivo europeo: estar a + infinitivo', re: /(?<![\p{L}])(?:estou|estás|está|estamos|estão|estava|estavam|ficou|continua)\s+a\s+[a-záéíóúâêôãõç]+(?:ar|er|ir)(?![\p{L}])/iu },
      { id: 'b7-gerundio-brasileiro', nombre: 'El progresivo con gerundio, que es brasileño', re: /(?<![\p{L}])(?:estou|estás|está|estamos|estão|estava|estavam|ficou|continua|vem)\s+[a-záéíóúâêôãõç]+ndo(?![\p{L}])/iu },
      { id: 'b7-gerundio-aspectual', nombre: 'Ir/andar/vir + gerundio (aspecto), que sí es europeo', re: /(?<![\p{L}])(?:vai|vão|ia|iam|anda|andam|andava|vem|vêm|continua|continuam|acaba|acabou)\s+[a-záéíóúâêôãõç]+ndo(?![\p{L}])/iu },
      { id: 'b7-gerundio-adverbial', nombre: 'Gerundio adverbial legítimo (saiu correndo, sendo assim)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{3,}ndo(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b7-infinitivo-pessoal',
    criterio: 'por el contexto que lo pide: es lo único que decide entre flexionarlo o no',
    subs: [
      { id: 'b7-inf-pess-preposicao', nombre: 'Tras preposición (para, antes de, depois de, sem)', re: /(?<![\p{L}])(?:para|antes de|depois de|sem|até|por)\s+(?:nós\s+|eles\s+|vocês\s+)?[a-záéíóúâêôãõç]+(?:armos|ermos|irmos|arem|erem|irem|ares|eres|ires)(?![\p{L}])/iu },
      { id: 'b7-inf-pess-impessoais', nombre: 'Tras impersonal (é melhor, é preciso)', re: /(?<![\p{L}])é\s+(?:melhor|preciso|necessário|importante|bom|difícil|fácil)\s+[a-záéíóúâêôãõç]+(?:armos|ermos|irmos|arem|erem|irem)(?![\p{L}])/iu },
      { id: 'b7-inf-pess-formas', nombre: 'Formas flexionadas (-es, -mos, -em)', re: /(?<![\p{L}])[a-záéíóúâêôãõç]{3,}(?:armos|ermos|irmos|arem|erem|irem|ares|eres|ires)(?![\p{L}])/iu },
      { id: 'b7-inf-pess-contraste', nombre: 'Contraste con el infinitivo no flexionado', re: /(?<![\p{L}])(?:infinitivo pessoal|infinitivo flexionado|não flexionado)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b7-participio',
    criterio: 'los participios dobles y el compuesto «ter + particípio» son dos puntos distintos, y el segundo es el calco caro',
    subs: [
      { id: 'b7-part-duplos', nombre: 'Participios dobles (aceite/aceitado, entregue/entregado)', re: w('aceite', 'aceitado', 'entregue', 'entregado', 'ganho', 'ganhado', 'gasto', 'gastado', 'pago', 'pagado', 'acendido', 'aceso', 'morto', 'matado', 'salvo', 'salvado', 'limpo', 'limpado') },
      { id: 'b7-part-composto-duracion', nombre: '«Ter + particípio»: repetición o duración, NO el perfecto español', re: /(?<![\p{L}])(?:tenho|tens|tem|temos|têm)\s+\w+(?:ado|ido|to|sto|ito|eito)(?![\p{L}])/iu },
      { id: 'b7-part-passiva', nombre: 'Voz pasiva (ser + particípio, concordancia)', re: /(?<![\p{L}])(?:foi|foram|é|são|será|serão|está|estão)\s+\w+(?:ado|ada|ados|adas|ido|ida|idos|idas)(?![\p{L}])/iu },
    ],
  },

  // ── B8 · sintaxis ───────────────────────────────────────────────
  {
    padre: 'b8-colocacao-pronominal',
    criterio: 'ênclise por defecto y próclise por ATRACTOR: el punto es reconocer el atractor, no memorizar posiciones',
    subs: [
      { id: 'b8-coloc-mesoclise', nombre: 'Mesóclise (dir-te-ei), culta, futuro y condicional',
        // Los ALOMORFOS -lo-/-la-/-los-/-las- faltaban: tras -r el clítico
        // toma la ele («comunicá-LO-á», «enviá-LA-ei»), que es la mitad de
        // las mesóclises reales. Medido en E2#13: de las 30 del corpus la
        // partición sólo reconocía 18. Y la clase de la izquierda tiene que
        // ser \p{L}, no [a-z…]: la 1.ª conjugación deja VOCAL ACENTUADA
        // delante del guion.
        re: /[\p{L}]+-(?:me|te|lhe|nos|lhes|o|a|os|as|lo|la|los|las|no|na|nos|nas)-(?:ei|ás|á|emos|ão|ia|ias|íamos|iam)(?![\p{L}])/iu },
      { id: 'b8-coloc-proclise-negacao', nombre: 'Próclise por negación (não me disse)', re: /(?<![\p{L}])(?:não|nunca|nada|ninguém|nenhum|jamais)\s+(?:me|te|se|lhe|nos|lhes|o|a|os|as)\s/iu },
      { id: 'b8-coloc-proclise-adverbio', nombre: 'Próclise por adverbio o cuantificador (já me, também se)', re: /(?<![\p{L}])(?:já|também|sempre|ainda|só|talvez|todos|tudo|quem|que|onde|quando)\s+(?:me|te|se|lhe|nos|lhes)\s/iu },
      { id: 'b8-coloc-infinitivo', nombre: 'Con infinitivo y perífrasis (vou dizer-te / vou te dizer)', re: /(?<![\p{L}])(?:vou|vais|vai|vamos|quero|posso|tenho de|preciso de)\s+[a-záéíóúâêôãõç]+-(?:me|te|lhe|nos|lhes|o|a|los|las)(?![\p{L}])/iu },
      { id: 'b8-coloc-enclise', nombre: 'Ênclise por defecto (disse-me, chamo-me)', re: /[a-záéíóúâêôãõç]{3,}-(?:me|te|se|lhe|nos|lhes|o|a|os|as|lo|la|los|las)(?![\p{L}-])/iu },
    ],
  },
  {
    padre: 'b8-oracoes-subordinadas',
    criterio: 'por tipo de subordinada, que es la clasificación con la que se enseñan y se preguntan',
    subs: [
      { id: 'b8-sub-relativas-cujo', nombre: 'Relativas con cujo / onde / o qual', re: w('cujo', 'cuja', 'cujos', 'cujas', 'o qual', 'a qual', 'os quais', 'as quais') },
      { id: 'b8-sub-concessivas', nombre: 'Concesivas (embora, ainda que, mesmo que)', re: /(?<![\p{L}])(?:embora|ainda que|mesmo que|apesar de|se bem que|conquanto)(?![\p{L}])/iu },
      { id: 'b8-sub-adverbiais-tempo', nombre: 'Adverbiales de tiempo (quando, assim que, enquanto)', re: /(?<![\p{L}])(?:quando|assim que|logo que|enquanto|antes que|depois que|sempre que)(?![\p{L}])/iu },
      { id: 'b8-sub-substantivas', nombre: 'Sustantivas (que, se, quem, o que)', re: /(?<![\p{L}])(?:disse que|acho que|sei que|pergunto se|não sei se|é que)(?![\p{L}])/iu },
      { id: 'b8-sub-adjetivas-que', nombre: 'Adjetivas con «que» y su antecedente', re: /(?<![\p{L}])(?:o|a|os|as|um|uma)\s+[a-záéíóúâêôãõç]+\s+que\s/iu },
    ],
  },
  {
    padre: 'b8-conectores',
    criterio: 'por relación lógica: es como se buscan al escribir',
    subs: [
      { id: 'b8-con-contraste', nombre: 'Contraste (mas, porém, contudo, no entanto)', re: /(?<![\p{L}])(?:mas|porém|contudo|no entanto|todavia|entretanto|apesar disso)(?![\p{L}])/iu },
      { id: 'b8-con-causa', nombre: 'Causa (porque, pois, visto que, uma vez que)', re: /(?<![\p{L}])(?:porque|pois|visto que|uma vez que|já que|dado que|como)(?![\p{L}])/iu },
      { id: 'b8-con-consequencia', nombre: 'Consecuencia (por isso, portanto, logo, assim)', re: /(?<![\p{L}])(?:por isso|portanto|logo|assim|de modo que|por conseguinte)(?![\p{L}])/iu },
      { id: 'b8-con-adicao', nombre: 'Adición y precisión (além disso, aliás, ou seja)', re: /(?<![\p{L}])(?:além disso|aliás|ou seja|isto é|também|ainda por cima|de resto)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b8-discurso-indireto',
    criterio: 'lo que cambia al pasar a indirecto son tres cosas independientes: tiempo, deícticos y persona',
    subs: [
      { id: 'b8-indireto-deicticos', nombre: 'Deícticos (hoje→nesse dia, aqui→ali, este→aquele)', re: /(?<![\p{L}])(?:nesse dia|no dia seguinte|na véspera|ali|naquele|naquela|no dia anterior)(?![\p{L}])/iu },
      { id: 'b8-indireto-interrogativa', nombre: 'Interrogativas indirectas (perguntou se / o que)', re: /(?<![\p{L}])(?:perguntou se|perguntou o que|quis saber se|queria saber)(?![\p{L}])/iu },
      { id: 'b8-indireto-correlacao', nombre: 'Correlación temporal (disse que + imperfeito)', re: /(?<![\p{L}])(?:disse que|contou que|afirmou que|respondeu que|explicou que)(?![\p{L}])/iu },
      { id: 'b8-indireto-imperativo', nombre: 'Órdenes en indirecto (pediu para / pediu que + conjuntivo)', re: /(?<![\p{L}])(?:pediu que|mandou que|pediu para|disse para)(?![\p{L}])/iu },
    ],
  },

  // ── B10 · registro y variación ──────────────────────────────────
  {
    padre: 'b10-registro',
    criterio: 'por el recurso que marca el registro: tratamiento, fórmula o léxico. Es el concepto más heterogéneo del corpus',
    subs: [
      { id: 'b10-reg-tratamento', nombre: 'Tratamiento: tu / você / o senhor / 3.ª con nombre', re: /(?<![\p{L}])(?:o senhor|a senhora|você|vocês|tu|vossa excelência|o doutor|a doutora)(?![\p{L}])/iu },
      { id: 'b10-reg-formulas', nombre: 'Fórmulas de cortesía (se faz favor, com os melhores cumprimentos)', re: /(?<![\p{L}])(?:se faz favor|por favor|com os melhores cumprimentos|atenciosamente|obrigad[oa]|desculpe|com licença|faça favor)(?![\p{L}])/iu },
      { id: 'b10-reg-mitigacao', nombre: 'Mitigación (se calhar, não sei se, talvez fosse melhor)', re: /(?<![\p{L}])(?:se calhar|não sei se|talvez fosse melhor|olhe que|se não se importa|era capaz de)(?![\p{L}])/iu },
      { id: 'b10-reg-anti-calco', nombre: 'Anti-calco léxico del español', re: /(?<![\p{L}])(?:anti-calco|falso amigo|falso-amigo)(?![\p{L}])/iu },
    ],
  },
  {
    padre: 'b10-variacao-diatopica',
    criterio: 'por nivel lingüístico en el que la variedad se separa: léxico, gramática o fonética',
    subs: [
      { id: 'b10-var-colocacao', nombre: 'Colocación pronominal (me diga / diga-me)', re: /(?<![\p{L}])(?:me diga|me liga|me dá|me fala|te ligo|se chama)(?![\p{L}])|[a-z]+-(?:me|te|se|lhe)(?![\p{L}-])/iu },
      { id: 'b10-var-tratamento', nombre: 'Tratamiento (tu europeo / você brasileño)', re: /(?<![\p{L}])(?:você|vocês|a gente|o senhor|tu)(?![\p{L}])/iu },
      { id: 'b10-var-gerundio', nombre: 'Gerundio brasileño frente a «estar a + infinitivo»', re: /(?<![\p{L}])(?:estou|está|estamos|estão|estava)\s+(?:a\s+)?[a-záéíóúâêôãõç]+(?:ndo|ar|er|ir)(?![\p{L}])/iu },
      { id: 'b10-var-lexico', nombre: 'Léxico divergente (comboio/trem, autocarro/ônibus)', re: w('comboio', 'trem', 'autocarro', 'ônibus', 'telemóvel', 'celular', 'casa de banho', 'banheiro', 'pequeno-almoço', 'café da manhã', 'sumo', 'suco', 'rapariga', 'garota', 'fixe', 'legal', 'bica', 'cafezinho') },
    ],
  },
];

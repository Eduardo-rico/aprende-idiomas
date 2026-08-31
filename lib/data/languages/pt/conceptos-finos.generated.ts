// lib/data/languages/pt/conceptos-finos.generated.ts
//
// GENERADO por scripts/split-conceptos.ts (E2#10). No editar a mano:
// la fuente es `scripts/lib/conceptos-finos.ts`, donde cada partición
// lleva escrito su criterio.
//
// Son los puntos de enseñanza en que se parten los conceptos gruesos:
// el inventario de 51 no era un inventario de puntos, era uno de
// familias (b10-registro tenía 125 ítems).
import type { Concept } from '../../curriculum-types';

export const CONCEPTOS_FINOS: Concept[] = [
  // b1-vogais-nasais — por grafía de la nasal, que es lo que el alumno tiene que reconocer y producir
  { id: 'b1-nasal-ao-oes', name: 'Plural -ão/-ões/-ães', blockId: 1, description: 'Plural -ão/-ões/-ães (sub-punto de b1-vogais-nasais)', prereqs: ['b1-vogais-nasais'] },
  { id: 'b1-nasal-til', name: 'Til sobre a/o', blockId: 1, description: 'Til sobre a/o (sub-punto de b1-vogais-nasais)', prereqs: ['b1-vogais-nasais'] },
  { id: 'b1-nasal-m-final', name: 'Nasal por -m final (em, im, om, um)', blockId: 1, description: 'Nasal por -m final (em, im, om, um) (sub-punto de b1-vogais-nasais)', prereqs: ['b1-vogais-nasais'] },
  { id: 'b1-nasal-n-interior', name: 'Nasal por n/m ante consonante', blockId: 1, description: 'Nasal por n/m ante consonante (sub-punto de b1-vogais-nasais)', prereqs: ['b1-vogais-nasais'] },
  // b1-silaba-tonica — por posición del acento y por el desplazamiento en el paradigma verbal, que es donde el español interfiere
  { id: 'b1-tonica-desplazamiento-verbal', name: 'Desplazamiento del acento en el verbo (falo/falámos)', blockId: 1, description: 'Desplazamiento del acento en el verbo (falo/falámos) (sub-punto de b1-silaba-tonica)', prereqs: ['b1-silaba-tonica'] },
  { id: 'b1-tonica-oxitona', name: 'Aguda (café, avó, jardim)', blockId: 1, description: 'Aguda (café, avó, jardim) (sub-punto de b1-silaba-tonica)', prereqs: ['b1-silaba-tonica'] },
  { id: 'b1-tonica-proparoxitona', name: 'Esdrújula (médico, música, prático)', blockId: 1, description: 'Esdrújula (médico, música, prático) (sub-punto de b1-silaba-tonica)', prereqs: ['b1-silaba-tonica'] },
  { id: 'b1-tonica-paroxitona', name: 'Llana, la default sin tilde', blockId: 1, description: 'Llana, la default sin tilde (sub-punto de b1-silaba-tonica)', prereqs: ['b1-silaba-tonica'] },
  // b1-acentos — por diacrítico, que es lo que hay que elegir al escribir
  { id: 'b1-acento-agudo', name: 'Agudo: vocal abierta', blockId: 1, description: 'Agudo: vocal abierta (sub-punto de b1-acentos)', prereqs: ['b1-acentos'] },
  { id: 'b1-acento-circunflexo', name: 'Circunflejo: vocal cerrada', blockId: 1, description: 'Circunflejo: vocal cerrada (sub-punto de b1-acentos)', prereqs: ['b1-acentos'] },
  { id: 'b1-acento-crase', name: 'Grave: crase a+a', blockId: 1, description: 'Grave: crase a+a (sub-punto de b1-acentos)', prereqs: ['b1-acentos'] },
  { id: 'b1-acento-cedilha', name: 'Cedilla', blockId: 1, description: 'Cedilla (sub-punto de b1-acentos)', prereqs: ['b1-acentos'] },
  // b2-artigos — la contracción es el punto real: el artículo suelto ya lo tiene el hispanohablante, lo que no tiene es de+o=do
  { id: 'b2-art-contr-de', name: 'Contracción con de (do, da, dos, das)', blockId: 2, description: 'Contracción con de (do, da, dos, das) (sub-punto de b2-artigos)', prereqs: ['b2-artigos'] },
  { id: 'b2-art-contr-em', name: 'Contracción con em (no, na, nos, nas)', blockId: 2, description: 'Contracción con em (no, na, nos, nas) (sub-punto de b2-artigos)', prereqs: ['b2-artigos'] },
  { id: 'b2-art-contr-a-por', name: 'Contracción con a y por (ao, à, pelo, pela)', blockId: 2, description: 'Contracción con a y por (ao, à, pelo, pela) (sub-punto de b2-artigos)', prereqs: ['b2-artigos'] },
  { id: 'b2-art-com-posesivo', name: 'Artículo ante posesivo (a minha mãe)', blockId: 2, description: 'Artículo ante posesivo (a minha mãe) (sub-punto de b2-artigos)', prereqs: ['b2-artigos'] },
  { id: 'b2-art-com-nome', name: 'Artículo ante nombre propio (o Tomás)', blockId: 2, description: 'Artículo ante nombre propio (o Tomás) (sub-punto de b2-artigos)', prereqs: ['b2-artigos'] },
  // b2-genero — por terminación y, aparte, los que DIVERGEN del español — que es el único subpunto que cuesta
  { id: 'b2-genero-divergente', name: 'Género divergente del español (o sangue, a árvore)', blockId: 2, description: 'Género divergente del español (o sangue, a árvore) (sub-punto de b2-genero)', prereqs: ['b2-genero'] },
  { id: 'b2-genero-agem-dade', name: 'Femeninos en -agem, -dade, -ção', blockId: 2, description: 'Femeninos en -agem, -dade, -ção (sub-punto de b2-genero)', prereqs: ['b2-genero'] },
  { id: 'b2-genero-comum', name: 'Comunes de dos (o/a estudante)', blockId: 2, description: 'Comunes de dos (o/a estudante) (sub-punto de b2-genero)', prereqs: ['b2-genero'] },
  // b2-numero — por el tipo de plural irregular, que es donde está toda la dificultad
  { id: 'b2-plural-ao', name: 'Plural de -ão (pães, mãos, corações)', blockId: 2, description: 'Plural de -ão (pães, mãos, corações) (sub-punto de b2-numero)', prereqs: ['b2-numero'] },
  { id: 'b2-plural-l', name: 'Plural de -l (papéis, animais, difíceis)', blockId: 2, description: 'Plural de -l (papéis, animais, difíceis) (sub-punto de b2-numero)', prereqs: ['b2-numero'] },
  { id: 'b2-plural-m-r-s', name: 'Plural de -m, -r, -s (homens, flores, meses)', blockId: 2, description: 'Plural de -m, -r, -s (homens, flores, meses) (sub-punto de b2-numero)', prereqs: ['b2-numero'] },
  // b2-possessivos — la forma la comparten con el español; lo que no comparten es el artículo y la ambigüedad de «seu»
  { id: 'b2-poss-com-artigo', name: 'Posesivo con artículo (a minha casa)', blockId: 2, description: 'Posesivo con artículo (a minha casa) (sub-punto de b2-possessivos)', prereqs: ['b2-possessivos'] },
  { id: 'b2-poss-seu-ambiguo', name: '«Seu» ambiguo y su desambiguación (dele/dela)', blockId: 2, description: '«Seu» ambiguo y su desambiguación (dele/dela) (sub-punto de b2-possessivos)', prereqs: ['b2-possessivos'] },
  { id: 'b2-poss-formas', name: 'Formas del posesivo', blockId: 2, description: 'Formas del posesivo (sub-punto de b2-possessivos)', prereqs: ['b2-possessivos'] },
  // b2-demonstrativos — por grado deíctico y por la contracción, que es lo que no existe en español
  { id: 'b2-dem-contracciones', name: 'Contracciones (neste, desse, àquele)', blockId: 2, description: 'Contracciones (neste, desse, àquele) (sub-punto de b2-demonstrativos)', prereqs: ['b2-demonstrativos'] },
  { id: 'b2-dem-neutros', name: 'Neutros (isto, isso, aquilo)', blockId: 2, description: 'Neutros (isto, isso, aquilo) (sub-punto de b2-demonstrativos)', prereqs: ['b2-demonstrativos'] },
  { id: 'b2-dem-tres-graus', name: 'Los tres grados (este/esse/aquele)', blockId: 2, description: 'Los tres grados (este/esse/aquele) (sub-punto de b2-demonstrativos)', prereqs: ['b2-demonstrativos'] },
  // b2-indefinidos — por serie léxica: cada una tiene su trampa propia frente al español
  { id: 'b2-indef-algum-nenhum', name: 'Algum / nenhum', blockId: 2, description: 'Algum / nenhum (sub-punto de b2-indefinidos)', prereqs: ['b2-indefinidos'] },
  { id: 'b2-indef-todo-tudo', name: 'Todo frente a tudo', blockId: 2, description: 'Todo frente a tudo (sub-punto de b2-indefinidos)', prereqs: ['b2-indefinidos'] },
  { id: 'b2-indef-cada-qualquer', name: 'Cada / qualquer', blockId: 2, description: 'Cada / qualquer (sub-punto de b2-indefinidos)', prereqs: ['b2-indefinidos'] },
  { id: 'b2-indef-outro-mesmo', name: 'Outro / mesmo / próprio', blockId: 2, description: 'Outro / mesmo / próprio (sub-punto de b2-indefinidos)', prereqs: ['b2-indefinidos'] },
  // b3-presente-regular — por conjugación, más la alternancia vocálica, que es la que sorprende
  { id: 'b3-pres-alternancia', name: 'Alternancia vocálica (dormir → durmo)', blockId: 3, description: 'Alternancia vocálica (dormir → durmo) (sub-punto de b3-presente-regular)', prereqs: ['b3-presente-regular'] },
  { id: 'b3-pres-ar', name: 'Presente de -ar', blockId: 3, description: 'Presente de -ar (sub-punto de b3-presente-regular)', prereqs: ['b3-presente-regular'] },
  { id: 'b3-pres-er', name: 'Presente de -er', blockId: 3, description: 'Presente de -er (sub-punto de b3-presente-regular)', prereqs: ['b3-presente-regular'] },
  { id: 'b3-pres-ir', name: 'Presente de -ir', blockId: 3, description: 'Presente de -ir (sub-punto de b3-presente-regular)', prereqs: ['b3-presente-regular'] },
  // b3-presente-irregular — por familia de irregularidad; agrupar es más enseñable que un punto por verbo
  { id: 'b3-pres-irr-ser-estar', name: 'Ser y estar', blockId: 3, description: 'Ser y estar (sub-punto de b3-presente-irregular)', prereqs: ['b3-presente-irregular'] },
  { id: 'b3-pres-irr-ter-vir', name: 'Ter y vir', blockId: 3, description: 'Ter y vir (sub-punto de b3-presente-irregular)', prereqs: ['b3-presente-irregular'] },
  { id: 'b3-pres-irr-ir-dar-ver', name: 'Ir, dar y ver', blockId: 3, description: 'Ir, dar y ver (sub-punto de b3-presente-irregular)', prereqs: ['b3-presente-irregular'] },
  { id: 'b3-pres-irr-fazer-dizer', name: 'Fazer, dizer, poder, querer, saber', blockId: 3, description: 'Fazer, dizer, poder, querer, saber (sub-punto de b3-presente-irregular)', prereqs: ['b3-presente-irregular'] },
  // b3-pronomes — por función sintáctica: cada serie tiene su forma y su posición
  { id: 'b3-pron-contracoes', name: 'Contracciones de clíticos (mo, to, lho)', blockId: 3, description: 'Contracciones de clíticos (mo, to, lho) (sub-punto de b3-pronomes)', prereqs: ['b3-pronomes'] },
  { id: 'b3-pron-preposicionado', name: 'Preposicionados (mim, ti, si, consigo)', blockId: 3, description: 'Preposicionados (mim, ti, si, consigo) (sub-punto de b3-pronomes)', prereqs: ['b3-pronomes'] },
  { id: 'b3-pron-indirecto', name: 'Oblicuo indirecto (lhe, lhes)', blockId: 3, description: 'Oblicuo indirecto (lhe, lhes) (sub-punto de b3-pronomes)', prereqs: ['b3-pronomes'] },
  { id: 'b3-pron-reflexivo', name: 'Reflexivos y pronominales', blockId: 3, description: 'Reflexivos y pronominales (sub-punto de b3-pronomes)', prereqs: ['b3-pronomes'] },
  { id: 'b3-pron-directo', name: 'Oblicuo directo (o, a, os, as; -lo, -la)', blockId: 3, description: 'Oblicuo directo (o, a, os, as; -lo, -la) (sub-punto de b3-pronomes)', prereqs: ['b3-pronomes'] },
  { id: 'b3-pron-sujeito', name: 'Pronombre sujeto y su omisión', blockId: 3, description: 'Pronombre sujeto y su omisión (sub-punto de b3-pronomes)', prereqs: ['b3-pronomes'] },
  // b3-existenciais — por verbo: haver, ter y ficar reparten en portugués lo que el español hace con haber/estar
  { id: 'b3-exist-haver', name: 'Haver impersonal (há, havia)', blockId: 3, description: 'Haver impersonal (há, havia) (sub-punto de b3-existenciais)', prereqs: ['b3-existenciais'] },
  { id: 'b3-exist-ter-br', name: '«Tem» existencial (brasileño) frente a «há»', blockId: 3, description: '«Tem» existencial (brasileño) frente a «há» (sub-punto de b3-existenciais)', prereqs: ['b3-existenciais'] },
  { id: 'b3-exist-ficar', name: 'Ficar de localización (fica no centro)', blockId: 3, description: 'Ficar de localización (fica no centro) (sub-punto de b3-existenciais)', prereqs: ['b3-existenciais'] },
  { id: 'b3-exist-ser-estar', name: 'Ser frente a estar en la localización', blockId: 3, description: 'Ser frente a estar en la localización (sub-punto de b3-existenciais)', prereqs: ['b3-existenciais'] },
  // b3-imperativo — el negativo es conjuntivo y el formal es tercera persona: son tres puntos, no uno
  { id: 'b3-imper-negativo', name: 'Imperativo negativo (= conjuntivo)', blockId: 3, description: 'Imperativo negativo (= conjuntivo) (sub-punto de b3-imperativo)', prereqs: ['b3-imperativo'] },
  { id: 'b3-imper-formal', name: 'Imperativo formal de 3.ª (fale, faça)', blockId: 3, description: 'Imperativo formal de 3.ª (fale, faça) (sub-punto de b3-imperativo)', prereqs: ['b3-imperativo'] },
  { id: 'b3-imper-tu', name: 'Imperativo afirmativo de tu (fala, come)', blockId: 3, description: 'Imperativo afirmativo de tu (fala, come) (sub-punto de b3-imperativo)', prereqs: ['b3-imperativo'] },
  // b4-perfeito-regular — por conjugación, y aparte el «-ámos» de 1.ª plural, que es la marca europea que Brasil no escribe
  { id: 'b4-perf-amos-europeo', name: '«-ámos»: 1.ª plural europea con acento', blockId: 4, description: '«-ámos»: 1.ª plural europea con acento (sub-punto de b4-perfeito-regular)', prereqs: ['b4-perfeito-regular'] },
  { id: 'b4-perf-ar', name: 'Perfeito de -ar (-ei, -aste, -ou, -aram)', blockId: 4, description: 'Perfeito de -ar (-ei, -aste, -ou, -aram) (sub-punto de b4-perfeito-regular)', prereqs: ['b4-perfeito-regular'] },
  { id: 'b4-perf-er', name: 'Perfeito de -er (-i, -este, -eu, -eram)', blockId: 4, description: 'Perfeito de -er (-i, -este, -eu, -eram) (sub-punto de b4-perfeito-regular)', prereqs: ['b4-perfeito-regular'] },
  { id: 'b4-perf-ir', name: 'Perfeito de -ir (-i, -iste, -iu, -iram)', blockId: 4, description: 'Perfeito de -ir (-i, -iste, -iu, -iram) (sub-punto de b4-perfeito-regular)', prereqs: ['b4-perfeito-regular'] },
  // b4-perfeito-irregular — por FAMILIA de raíz fuerte: las catorce del currículo se enseñan en cinco grupos, no de una en una
  { id: 'b4-perf-irr-ser-ir', name: 'Fui: ser e ir comparten paradigma', blockId: 4, description: 'Fui: ser e ir comparten paradigma (sub-punto de b4-perfeito-irregular)', prereqs: ['b4-perfeito-irregular'] },
  { id: 'b4-perf-irr-z', name: 'Fiz, disse, trouxe (raíces en -z-/-ss-/-ux-)', blockId: 4, description: 'Fiz, disse, trouxe (raíces en -z-/-ss-/-ux-) (sub-punto de b4-perfeito-irregular)', prereqs: ['b4-perfeito-irregular'] },
  { id: 'b4-perf-irr-ive', name: 'Tive, estive (raíz en -ive)', blockId: 4, description: 'Tive, estive (raíz en -ive) (sub-punto de b4-perfeito-irregular)', prereqs: ['b4-perfeito-irregular'] },
  { id: 'b4-perf-irr-u', name: 'Pude, soube, quis, houve', blockId: 4, description: 'Pude, soube, quis, houve (sub-punto de b4-perfeito-irregular)', prereqs: ['b4-perfeito-irregular'] },
  { id: 'b4-perf-irr-monos', name: 'Vi, vim, dei, pus (monosilábicos)', blockId: 4, description: 'Vi, vim, dei, pus (monosilábicos) (sub-punto de b4-perfeito-irregular)', prereqs: ['b4-perfeito-irregular'] },
  // b4-imperfeito — los cuatro irregulares son un punto propio; el resto se separa por lo que el imperfecto SIGNIFICA
  { id: 'b4-imperf-irregulares', name: 'Los cuatro irregulares (era, tinha, vinha, punha)', blockId: 4, description: 'Los cuatro irregulares (era, tinha, vinha, punha) (sub-punto de b4-imperfeito)', prereqs: ['b4-imperfeito'] },
  { id: 'b4-imperf-habitual', name: 'Uso habitual (sempre, dantes, todos os dias)', blockId: 4, description: 'Uso habitual (sempre, dantes, todos os dias) (sub-punto de b4-imperfeito)', prereqs: ['b4-imperfeito'] },
  { id: 'b4-imperf-cortesia', name: 'Imperfecto de cortesía (queria, podia)', blockId: 4, description: 'Imperfecto de cortesía (queria, podia) (sub-punto de b4-imperfeito)', prereqs: ['b4-imperfeito'] },
  { id: 'b4-imperf-formas', name: 'Formas regulares del imperfecto', blockId: 4, description: 'Formas regulares del imperfecto (sub-punto de b4-imperfeito)', prereqs: ['b4-imperfeito'] },
  // b4-contraste-passado — el contraste se decide por el MARCADOR: es lo único que el alumno puede ver
  { id: 'b4-contr-marcador-perfeito', name: 'Marcadores de perfeito (ontem, na semana passada)', blockId: 4, description: 'Marcadores de perfeito (ontem, na semana passada) (sub-punto de b4-contraste-passado)', prereqs: ['b4-contraste-passado'] },
  { id: 'b4-contr-marcador-imperfeito', name: 'Marcadores de imperfeito (sempre, enquanto)', blockId: 4, description: 'Marcadores de imperfeito (sempre, enquanto) (sub-punto de b4-contraste-passado)', prereqs: ['b4-contraste-passado'] },
  { id: 'b4-contr-narrativa', name: 'Los dos en la misma frase: fondo y suceso', blockId: 4, description: 'Los dos en la misma frase: fondo y suceso (sub-punto de b4-contraste-passado)', prereqs: ['b4-contraste-passado'] },
  // b4-mais-que-perfeito — el simple (falara) y el compuesto (tinha falado) son dos formas distintas de un mismo valor, y el simple es literario
  { id: 'b4-mqp-simples', name: 'Mais-que-perfeito simples (falara), literario', blockId: 4, description: 'Mais-que-perfeito simples (falara), literario (sub-punto de b4-mais-que-perfeito)', prereqs: ['b4-mais-que-perfeito'] },
  { id: 'b4-mqp-composto', name: 'Mais-que-perfeito composto (tinha falado)', blockId: 4, description: 'Mais-que-perfeito composto (tinha falado) (sub-punto de b4-mais-que-perfeito)', prereqs: ['b4-mais-que-perfeito'] },
  { id: 'b4-mqp-anterioridade', name: 'Su valor: anterioridad a otro pasado', blockId: 4, description: 'Su valor: anterioridad a otro pasado (sub-punto de b4-mais-que-perfeito)', prereqs: ['b4-mais-que-perfeito'] },
  // b5-futuro-presente — sólo tres verbos son irregulares y el perifrástico es otra construcción: tres puntos claros
  { id: 'b5-fut-irregulares', name: 'Los tres irregulares (direi, farei, trarei)', blockId: 5, description: 'Los tres irregulares (direi, farei, trarei) (sub-punto de b5-futuro-presente)', prereqs: ['b5-futuro-presente'] },
  { id: 'b5-fut-perifrastico', name: 'Perifrástico: «vou falar», nunca «vou A falar»', blockId: 5, description: 'Perifrástico: «vou falar», nunca «vou A falar» (sub-punto de b5-futuro-presente)', prereqs: ['b5-futuro-presente'] },
  { id: 'b5-fut-suposicao', name: 'Futuro de suposición (serão umas dez)', blockId: 5, description: 'Futuro de suposición (serão umas dez) (sub-punto de b5-futuro-presente)', prereqs: ['b5-futuro-presente'] },
  { id: 'b5-fut-regular', name: 'Futuro regular (-ei, -ás, -á, -emos, -ão)', blockId: 5, description: 'Futuro regular (-ei, -ás, -á, -emos, -ão) (sub-punto de b5-futuro-presente)', prereqs: ['b5-futuro-presente'] },
  // b5-condicional — la cortesía es el uso más rentable y va aparte; los irregulares son los mismos tres
  { id: 'b5-cond-irregulares', name: 'Los tres irregulares (diria, faria, traria)', blockId: 5, description: 'Los tres irregulares (diria, faria, traria) (sub-punto de b5-condicional)', prereqs: ['b5-condicional'] },
  { id: 'b5-cond-cortesia', name: 'Condicional de cortesía (gostaria, poderia)', blockId: 5, description: 'Condicional de cortesía (gostaria, poderia) (sub-punto de b5-condicional)', prereqs: ['b5-condicional'] },
  { id: 'b5-cond-hipotetico', name: 'Condicional en la apódosis hipotética', blockId: 5, description: 'Condicional en la apódosis hipotética (sub-punto de b5-condicional)', prereqs: ['b5-condicional'] },
  { id: 'b5-cond-regular', name: 'Condicional regular (-aria, -eria, -iria)', blockId: 5, description: 'Condicional regular (-aria, -eria, -iria) (sub-punto de b5-condicional)', prereqs: ['b5-condicional'] },
  // b5-futuro-composto — por lo que los ítems enseñan DE VERDAD: perifrástico, no compuesto — el compuesto está a cero
  { id: 'b5-futcomp-composto-real', name: 'Futuro composto real (terei feito) — a CERO en el corpus', blockId: 5, description: 'Futuro composto real (terei feito) — a CERO en el corpus (sub-punto de b5-futuro-composto)', prereqs: ['b5-futuro-composto'] },
  { id: 'b5-perifrastico-ir', name: 'Futuro perifrástico: ir + infinitivo (sin «a»)', blockId: 5, description: 'Futuro perifrástico: ir + infinitivo (sin «a») (sub-punto de b5-futuro-composto)', prereqs: ['b5-futuro-composto'] },
  { id: 'b5-perifrastico-formas', name: 'Formas del auxiliar ir', blockId: 5, description: 'Formas del auxiliar ir (sub-punto de b5-futuro-composto)', prereqs: ['b5-futuro-composto'] },
  // b5-se-condicional — por el tiempo de la prótasis: es lo que decide si la condición es real, hipotética o irreal
  { id: 'b5-se-futuro-conj', name: 'Se + futuro do conjuntivo (condición real)', blockId: 5, description: 'Se + futuro do conjuntivo (condición real) (sub-punto de b5-se-condicional)', prereqs: ['b5-se-condicional'] },
  { id: 'b5-se-imperfeito-conj', name: 'Se + imperfeito do conjuntivo (hipotética)', blockId: 5, description: 'Se + imperfeito do conjuntivo (hipotética) (sub-punto de b5-se-condicional)', prereqs: ['b5-se-condicional'] },
  { id: 'b5-se-irreal', name: 'Se + mais-que-perfeito (irreal de pasado)', blockId: 5, description: 'Se + mais-que-perfeito (irreal de pasado) (sub-punto de b5-se-condicional)', prereqs: ['b5-se-condicional'] },
  // b6-presente-subj — formación por conjugación, irregulares aparte, y los disparadores, que es lo que decide cuándo usarlo
  { id: 'b6-pres-subj-irregulares', name: 'Irregulares (seja, esteja, vá, saiba, queira, haja, dê)', blockId: 6, description: 'Irregulares (seja, esteja, vá, saiba, queira, haja, dê) (sub-punto de b6-presente-subj)', prereqs: ['b6-presente-subj'] },
  { id: 'b6-pres-subj-disparadores', name: 'Disparadores (espero que, é importante que)', blockId: 6, description: 'Disparadores (espero que, é importante que) (sub-punto de b6-presente-subj)', prereqs: ['b6-presente-subj'] },
  { id: 'b6-pres-subj-ar', name: 'Formación de -ar (fale, fales, falemos)', blockId: 6, description: 'Formación de -ar (fale, fales, falemos) (sub-punto de b6-presente-subj)', prereqs: ['b6-presente-subj'] },
  { id: 'b6-pres-subj-er-ir', name: 'Formación de -er/-ir (coma, parta)', blockId: 6, description: 'Formación de -er/-ir (coma, parta) (sub-punto de b6-presente-subj)', prereqs: ['b6-presente-subj'] },
  // b6-imperfeito-subj — la formación sale del perfeito de 3.ª plural; la correlación temporal es el uso, y va aparte
  { id: 'b6-imperf-subj-irregulares', name: 'Irregulares (fosse, tivesse, viesse, fizesse)', blockId: 6, description: 'Irregulares (fosse, tivesse, viesse, fizesse) (sub-punto de b6-imperfeito-subj)', prereqs: ['b6-imperfeito-subj'] },
  { id: 'b6-imperf-subj-correlacao', name: 'Correlación con un pasado en la principal', blockId: 6, description: 'Correlación con un pasado en la principal (sub-punto de b6-imperfeito-subj)', prereqs: ['b6-imperfeito-subj'] },
  { id: 'b6-imperf-subj-formacao', name: 'Formación regular (-asse, -esse, -isse)', blockId: 6, description: 'Formación regular (-asse, -esse, -isse) (sub-punto de b6-imperfeito-subj)', prereqs: ['b6-imperfeito-subj'] },
  // b6-futuro-subj — es el tiempo que el español NO tiene: se separa por el conector que lo dispara, que es lo que hay que reconocer
  { id: 'b6-fut-subj-irregulares', name: 'Irregulares (for, tiver, vier, puser, disser, fizer)', blockId: 6, description: 'Irregulares (for, tiver, vier, puser, disser, fizer) (sub-punto de b6-futuro-subj)', prereqs: ['b6-futuro-subj'] },
  { id: 'b6-fut-subj-quando', name: 'Tras quando / assim que / logo que / sempre que', blockId: 6, description: 'Tras quando / assim que / logo que / sempre que (sub-punto de b6-futuro-subj)', prereqs: ['b6-futuro-subj'] },
  { id: 'b6-fut-subj-se', name: 'Tras «se» de condición real', blockId: 6, description: 'Tras «se» de condición real (sub-punto de b6-futuro-subj)', prereqs: ['b6-futuro-subj'] },
  { id: 'b6-fut-subj-formacao', name: 'Formación: infinitivo del perfeito de 3.ª plural', blockId: 6, description: 'Formación: infinitivo del perfeito de 3.ª plural (sub-punto de b6-futuro-subj)', prereqs: ['b6-futuro-subj'] },
  // b6-contraste-indicativo-subjuntivo — por el disparador, y «talvez» va SOLO porque su asimetría con el español es el punto más caro del bloque
  { id: 'b6-contr-talvez', name: '«Talvez»: antepuesto conjuntivo, pospuesto indicativo', blockId: 6, description: '«Talvez»: antepuesto conjuntivo, pospuesto indicativo (sub-punto de b6-contraste-indicativo-subjuntivo)', prereqs: ['b6-contraste-indicativo-subjuntivo'] },
  { id: 'b6-contr-duvida', name: 'Verbos de duda y negación (duvidar, não crer)', blockId: 6, description: 'Verbos de duda y negación (duvidar, não crer) (sub-punto de b6-contraste-indicativo-subjuntivo)', prereqs: ['b6-contraste-indicativo-subjuntivo'] },
  { id: 'b6-contr-certeza-indicativo', name: 'Certeza: indicativo (sei que, é certo que)', blockId: 6, description: 'Certeza: indicativo (sei que, é certo que) (sub-punto de b6-contraste-indicativo-subjuntivo)', prereqs: ['b6-contraste-indicativo-subjuntivo'] },
  { id: 'b6-contr-impessoais', name: 'Impersonales (é importante/preciso/possível que)', blockId: 6, description: 'Impersonales (é importante/preciso/possível que) (sub-punto de b6-contraste-indicativo-subjuntivo)', prereqs: ['b6-contraste-indicativo-subjuntivo'] },
  { id: 'b6-contr-emocao', name: 'Emoción y voluntad (espero, quero, lamento que)', blockId: 6, description: 'Emoción y voluntad (espero, quero, lamento que) (sub-punto de b6-contraste-indicativo-subjuntivo)', prereqs: ['b6-contraste-indicativo-subjuntivo'] },
  // b6-se-subjuntivo — por grado de realidad de la condición, que es lo que elige el tiempo
  { id: 'b6-se-irreal-passado', name: 'Irreal de pasado (se tivesse sabido)', blockId: 6, description: 'Irreal de pasado (se tivesse sabido) (sub-punto de b6-se-subjuntivo)', prereqs: ['b6-se-subjuntivo'] },
  { id: 'b6-se-hipotetico', name: 'Hipotética (se soubesse, dizia-te)', blockId: 6, description: 'Hipotética (se soubesse, dizia-te) (sub-punto de b6-se-subjuntivo)', prereqs: ['b6-se-subjuntivo'] },
  { id: 'b6-se-real', name: 'Real (se + futuro do conjuntivo / indicativo)', blockId: 6, description: 'Real (se + futuro do conjuntivo / indicativo) (sub-punto de b6-se-subjuntivo)', prereqs: ['b6-se-subjuntivo'] },
  // b7-gerundio — el punto es la OPOSICIÓN: el progresivo europeo no lleva gerundio, y hay gerundios legítimos que sí
  { id: 'b7-estar-a-infinitivo', name: 'Progresivo europeo: estar a + infinitivo', blockId: 7, description: 'Progresivo europeo: estar a + infinitivo (sub-punto de b7-gerundio)', prereqs: ['b7-gerundio'] },
  { id: 'b7-gerundio-brasileiro', name: 'El progresivo con gerundio, que es brasileño', blockId: 7, description: 'El progresivo con gerundio, que es brasileño (sub-punto de b7-gerundio)', prereqs: ['b7-gerundio'] },
  { id: 'b7-gerundio-aspectual', name: 'Ir/andar/vir + gerundio (aspecto), que sí es europeo', blockId: 7, description: 'Ir/andar/vir + gerundio (aspecto), que sí es europeo (sub-punto de b7-gerundio)', prereqs: ['b7-gerundio'] },
  { id: 'b7-gerundio-adverbial', name: 'Gerundio adverbial legítimo (saiu correndo, sendo assim)', blockId: 7, description: 'Gerundio adverbial legítimo (saiu correndo, sendo assim) (sub-punto de b7-gerundio)', prereqs: ['b7-gerundio'] },
  // b7-infinitivo-pessoal — por el contexto que lo pide: es lo único que decide entre flexionarlo o no
  { id: 'b7-inf-pess-preposicao', name: 'Tras preposición (para, antes de, depois de, sem)', blockId: 7, description: 'Tras preposición (para, antes de, depois de, sem) (sub-punto de b7-infinitivo-pessoal)', prereqs: ['b7-infinitivo-pessoal'] },
  { id: 'b7-inf-pess-impessoais', name: 'Tras impersonal (é melhor, é preciso)', blockId: 7, description: 'Tras impersonal (é melhor, é preciso) (sub-punto de b7-infinitivo-pessoal)', prereqs: ['b7-infinitivo-pessoal'] },
  { id: 'b7-inf-pess-formas', name: 'Formas flexionadas (-es, -mos, -em)', blockId: 7, description: 'Formas flexionadas (-es, -mos, -em) (sub-punto de b7-infinitivo-pessoal)', prereqs: ['b7-infinitivo-pessoal'] },
  { id: 'b7-inf-pess-contraste', name: 'Contraste con el infinitivo no flexionado', blockId: 7, description: 'Contraste con el infinitivo no flexionado (sub-punto de b7-infinitivo-pessoal)', prereqs: ['b7-infinitivo-pessoal'] },
  // b7-participio — los participios dobles y el compuesto «ter + particípio» son dos puntos distintos, y el segundo es el calco caro
  { id: 'b7-part-duplos', name: 'Participios dobles (aceite/aceitado, entregue/entregado)', blockId: 7, description: 'Participios dobles (aceite/aceitado, entregue/entregado) (sub-punto de b7-participio)', prereqs: ['b7-participio'] },
  { id: 'b7-part-composto-duracion', name: '«Ter + particípio»: repetición o duración, NO el perfecto español', blockId: 7, description: '«Ter + particípio»: repetición o duración, NO el perfecto español (sub-punto de b7-participio)', prereqs: ['b7-participio'] },
  { id: 'b7-part-passiva', name: 'Voz pasiva (ser + particípio, concordancia)', blockId: 7, description: 'Voz pasiva (ser + particípio, concordancia) (sub-punto de b7-participio)', prereqs: ['b7-participio'] },
  // b8-colocacao-pronominal — ênclise por defecto y próclise por ATRACTOR: el punto es reconocer el atractor, no memorizar posiciones
  { id: 'b8-coloc-mesoclise', name: 'Mesóclise (dir-te-ei), culta, futuro y condicional', blockId: 8, description: 'Mesóclise (dir-te-ei), culta, futuro y condicional (sub-punto de b8-colocacao-pronominal)', prereqs: ['b8-colocacao-pronominal'] },
  { id: 'b8-coloc-proclise-negacao', name: 'Próclise por negación (não me disse)', blockId: 8, description: 'Próclise por negación (não me disse) (sub-punto de b8-colocacao-pronominal)', prereqs: ['b8-colocacao-pronominal'] },
  { id: 'b8-coloc-proclise-adverbio', name: 'Próclise por adverbio o cuantificador (já me, também se)', blockId: 8, description: 'Próclise por adverbio o cuantificador (já me, também se) (sub-punto de b8-colocacao-pronominal)', prereqs: ['b8-colocacao-pronominal'] },
  { id: 'b8-coloc-infinitivo', name: 'Con infinitivo y perífrasis (vou dizer-te / vou te dizer)', blockId: 8, description: 'Con infinitivo y perífrasis (vou dizer-te / vou te dizer) (sub-punto de b8-colocacao-pronominal)', prereqs: ['b8-colocacao-pronominal'] },
  { id: 'b8-coloc-enclise', name: 'Ênclise por defecto (disse-me, chamo-me)', blockId: 8, description: 'Ênclise por defecto (disse-me, chamo-me) (sub-punto de b8-colocacao-pronominal)', prereqs: ['b8-colocacao-pronominal'] },
  // b8-oracoes-subordinadas — por tipo de subordinada, que es la clasificación con la que se enseñan y se preguntan
  { id: 'b8-sub-relativas-cujo', name: 'Relativas con cujo / onde / o qual', blockId: 8, description: 'Relativas con cujo / onde / o qual (sub-punto de b8-oracoes-subordinadas)', prereqs: ['b8-oracoes-subordinadas'] },
  { id: 'b8-sub-concessivas', name: 'Concesivas (embora, ainda que, mesmo que)', blockId: 8, description: 'Concesivas (embora, ainda que, mesmo que) (sub-punto de b8-oracoes-subordinadas)', prereqs: ['b8-oracoes-subordinadas'] },
  { id: 'b8-sub-adverbiais-tempo', name: 'Adverbiales de tiempo (quando, assim que, enquanto)', blockId: 8, description: 'Adverbiales de tiempo (quando, assim que, enquanto) (sub-punto de b8-oracoes-subordinadas)', prereqs: ['b8-oracoes-subordinadas'] },
  { id: 'b8-sub-substantivas', name: 'Sustantivas (que, se, quem, o que)', blockId: 8, description: 'Sustantivas (que, se, quem, o que) (sub-punto de b8-oracoes-subordinadas)', prereqs: ['b8-oracoes-subordinadas'] },
  { id: 'b8-sub-adjetivas-que', name: 'Adjetivas con «que» y su antecedente', blockId: 8, description: 'Adjetivas con «que» y su antecedente (sub-punto de b8-oracoes-subordinadas)', prereqs: ['b8-oracoes-subordinadas'] },
  // b8-conectores — por relación lógica: es como se buscan al escribir
  { id: 'b8-con-contraste', name: 'Contraste (mas, porém, contudo, no entanto)', blockId: 8, description: 'Contraste (mas, porém, contudo, no entanto) (sub-punto de b8-conectores)', prereqs: ['b8-conectores'] },
  { id: 'b8-con-causa', name: 'Causa (porque, pois, visto que, uma vez que)', blockId: 8, description: 'Causa (porque, pois, visto que, uma vez que) (sub-punto de b8-conectores)', prereqs: ['b8-conectores'] },
  { id: 'b8-con-consequencia', name: 'Consecuencia (por isso, portanto, logo, assim)', blockId: 8, description: 'Consecuencia (por isso, portanto, logo, assim) (sub-punto de b8-conectores)', prereqs: ['b8-conectores'] },
  { id: 'b8-con-adicao', name: 'Adición y precisión (além disso, aliás, ou seja)', blockId: 8, description: 'Adición y precisión (além disso, aliás, ou seja) (sub-punto de b8-conectores)', prereqs: ['b8-conectores'] },
  // b8-discurso-indireto — lo que cambia al pasar a indirecto son tres cosas independientes: tiempo, deícticos y persona
  { id: 'b8-indireto-deicticos', name: 'Deícticos (hoje→nesse dia, aqui→ali, este→aquele)', blockId: 8, description: 'Deícticos (hoje→nesse dia, aqui→ali, este→aquele) (sub-punto de b8-discurso-indireto)', prereqs: ['b8-discurso-indireto'] },
  { id: 'b8-indireto-interrogativa', name: 'Interrogativas indirectas (perguntou se / o que)', blockId: 8, description: 'Interrogativas indirectas (perguntou se / o que) (sub-punto de b8-discurso-indireto)', prereqs: ['b8-discurso-indireto'] },
  { id: 'b8-indireto-correlacao', name: 'Correlación temporal (disse que + imperfeito)', blockId: 8, description: 'Correlación temporal (disse que + imperfeito) (sub-punto de b8-discurso-indireto)', prereqs: ['b8-discurso-indireto'] },
  { id: 'b8-indireto-imperativo', name: 'Órdenes en indirecto (pediu para / pediu que + conjuntivo)', blockId: 8, description: 'Órdenes en indirecto (pediu para / pediu que + conjuntivo) (sub-punto de b8-discurso-indireto)', prereqs: ['b8-discurso-indireto'] },
  // b10-registro — por el recurso que marca el registro: tratamiento, fórmula o léxico. Es el concepto más heterogéneo del corpus
  { id: 'b10-reg-tratamento', name: 'Tratamiento: tu / você / o senhor / 3.ª con nombre', blockId: 10, description: 'Tratamiento: tu / você / o senhor / 3.ª con nombre (sub-punto de b10-registro)', prereqs: ['b10-registro'] },
  { id: 'b10-reg-formulas', name: 'Fórmulas de cortesía (se faz favor, com os melhores cumprimentos)', blockId: 10, description: 'Fórmulas de cortesía (se faz favor, com os melhores cumprimentos) (sub-punto de b10-registro)', prereqs: ['b10-registro'] },
  { id: 'b10-reg-mitigacao', name: 'Mitigación (se calhar, não sei se, talvez fosse melhor)', blockId: 10, description: 'Mitigación (se calhar, não sei se, talvez fosse melhor) (sub-punto de b10-registro)', prereqs: ['b10-registro'] },
  { id: 'b10-reg-anti-calco', name: 'Anti-calco léxico del español', blockId: 10, description: 'Anti-calco léxico del español (sub-punto de b10-registro)', prereqs: ['b10-registro'] },
  // b10-variacao-diatopica — por nivel lingüístico en el que la variedad se separa: léxico, gramática o fonética
  { id: 'b10-var-colocacao', name: 'Colocación pronominal (me diga / diga-me)', blockId: 10, description: 'Colocación pronominal (me diga / diga-me) (sub-punto de b10-variacao-diatopica)', prereqs: ['b10-variacao-diatopica'] },
  { id: 'b10-var-tratamento', name: 'Tratamiento (tu europeo / você brasileño)', blockId: 10, description: 'Tratamiento (tu europeo / você brasileño) (sub-punto de b10-variacao-diatopica)', prereqs: ['b10-variacao-diatopica'] },
  { id: 'b10-var-gerundio', name: 'Gerundio brasileño frente a «estar a + infinitivo»', blockId: 10, description: 'Gerundio brasileño frente a «estar a + infinitivo» (sub-punto de b10-variacao-diatopica)', prereqs: ['b10-variacao-diatopica'] },
  { id: 'b10-var-lexico', name: 'Léxico divergente (comboio/trem, autocarro/ônibus)', blockId: 10, description: 'Léxico divergente (comboio/trem, autocarro/ônibus) (sub-punto de b10-variacao-diatopica)', prereqs: ['b10-variacao-diatopica'] },
  // TRANSVERSALES: puntos que el etiquetado original repartió entre
  // conceptos que no eran el suyo. Van al bloque 3, que es donde el
  // currículo introduce la regência verbal.
  { id: 'reg-verbal-de', name: 'Regência: verbo + DE (gostar de, precisar de)', blockId: 3, description: 'Regência: verbo + DE (gostar de, precisar de)', prereqs: [] },
  { id: 'reg-verbal-em', name: 'Regência: verbo + EM (pensar em, acreditar em)', blockId: 3, description: 'Regência: verbo + EM (pensar em, acreditar em)', prereqs: [] },
  { id: 'reg-verbal-a', name: 'Regência: verbo + A (assistir a, obedecer a)', blockId: 3, description: 'Regência: verbo + A (assistir a, obedecer a)', prereqs: [] },
  { id: 'reg-verbal-com', name: 'Regência: verbo + COM (sonhar com, contar com)', blockId: 3, description: 'Regência: verbo + COM (sonhar com, contar com)', prereqs: [] },
  { id: 'reg-verbal-por-para', name: 'Regência: verbo + POR / PARA', blockId: 3, description: 'Regência: verbo + POR / PARA', prereqs: [] },
  { id: 'reg-verbal-zero', name: 'Regência CERO donde el español pone preposición', blockId: 3, description: 'Regência CERO donde el español pone preposición', prereqs: [] },
  { id: 'reg-verbal-otras', name: 'Regência: otras preposiciones', blockId: 3, description: 'Regência: otras preposiciones', prereqs: [] },
];

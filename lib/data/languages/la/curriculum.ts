// lib/data/languages/la/curriculum.ts — EL CURRÍCULO DEL LATÍN.
//
// Hasta el 2026-09-10 esto era un scaffold vacío (`BLOCKS = []`) y ése era
// **el bloqueo real del latín**, no el publicador ni la voz: había 465
// ítems escritos en 35 lotes y CERO ejercicios publicados, porque no había
// dónde publicarlos. El traspaso apuntaba a «portar publicar-cloze-ro.ts»
// y el eslabón que faltaba era éste, el que `2026-09-03-la-grc-paso0.md`
// §2.1 ya llamaba «el caro»: «en rumano el currículo existía; aquí no».
//
// ══ NO SE INVENTA NADA: SE DERIVA DEL INVENTARIO ═════════════════════
//
// Los conceptos y los bloques **salen de `inventario-puntos.ts`**, que es
// el documento que el latinista adversarial ya atacó. No se copian: se
// derivan en tiempo de módulo, así que no pueden desincronizarse. El mismo
// dato en dos ficheros se separa solo, y aquí el dato son 117 puntos.
//
// Lo ÚNICO escrito a mano es el TALLADO EN LECCIONES —qué puntos van
// juntos y en qué orden—, y sigue las cadenas de `prereqs` del propio
// inventario. Los `objectives` se redactan aquí y por eso son la
// superficie de riesgo: es prosa que el alumno lee, y la prosa publicada
// no tiene gate. Van al `latinista-adversarial-la` antes de publicar nada.
//
// ══ SÓLO LOS BLOQUES CON CONTENIDO ESCRITO ═══════════════════════════
//
// Se declaran los 7 bloques que tienen ítems (2, 3, 4, 5, 6, 10, 11) y no
// los 13 del inventario. Un bloque sin lecciones es una promesa que nada
// cumple —es `b8-l1` del rumano prometiendo discurso indirecto con el
// punto BLOQUEADO— y además rompe al publicador, que busca lección por
// `conceptIds`. Los otros seis entran cuando tengan lote.
//
// Todos los puntos publicados son del peldaño **L1**. Los peldaños del
// latín NO son A1…C2: el MCER no aplica a una lengua que nadie habla
// (ver `scripts/paso0-idioma.ts`).
import type { Block, Concept, Lesson, ConceptId, LessonId } from "@/lib/data/curriculum-types";
import { PUNTOS_LA, BLOQUES_LA } from "./inventario-puntos";
export type { Block, Concept, Lesson, ConceptId, LessonId };

/** Los conceptos SON los puntos del inventario, 1:1 y sin reescribir. */
export const ALL_CONCEPTS: Concept[] = PUNTOS_LA.map((p) => ({
  id: p.id,
  name: p.nombre,
  blockId: p.bloque,
  description: p.descripcion,
  prereqs: p.prereqs,
}));

const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));

/** El tallado en lecciones: lo único escrito a mano. Cada lección declara
 *  sus puntos en el orden de sus `prereqs`, y un test comprueba que ningún
 *  punto declarado aquí falte en el inventario ni aparezca dos veces. */
interface Talla {
  id: LessonId;
  blockId: number;
  name: string;
  objectives: string[];
  conceptIds: ConceptId[];
  mdx: string;
}

/** LOS PUNTOS QUE ESTÁN ESCRITOS Y NO SE TALLAN TODAVÍA, con el motivo.
 *
 *  Un objetivo cuyo punto no tiene ni un ejercicio es una promesa que nada
 *  mide —es `b8-l1` del rumano prometiendo discurso indirecto con el punto
 *  BLOQUEADO— y este fichero declara esa prohibición en su cabecera para
 *  los BLOQUES. El latinista adversarial señaló el 2026-09-10 que la regla
 *  se había aplicado al bloque y no a la lección: seis objetivos prometían
 *  destrezas cuyo lote está aplazado. Se retiran de las lecciones y quedan
 *  aquí, que es lo contrario de perderlos.
 *
 *  Los motivos largos viven en `scripts/publicar-la.ts`
 *  (`APLAZADOS_CON_MOTIVO`), que es donde se comprueban. */
export const SIN_TALLAR: Record<string, string> = {
  'l1-acento-penultima': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l1-eclesiastica-ae': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l1-eclesiastica-ce': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l1-eclesiastica-gn': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l1-eclesiastica-ti': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l1-h-muda': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l1-larga-por-posicion': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l1-uv-ij': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l3-dativo-posesivo': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l4-reflexivo': 'forma H —latín → «sí»/«no»— y NO hay pantalla para ella; publicarla es inventar la tarjeta. ⚠ Y antes de inventarla hay que decidir si vale: el JUICIO BINARIO con una L1 cercana ya se midió en portugués y la traducción predecía la etiqueta 19 de 24 veces. Aplazado el 2026-09-23 al descubrir que el publicador lo aplazaba y el currículo no lo sabía — dos registros de «qué está aplazado» que no coincidían',
  'l2-genero-3a': 'su marco «magnus ___» ya da el adjetivo, que es lo único que revela el género',
  'l2-cuarta': 'la CANTIDAD es su punto: sin mácrón el ítem no discrimina, y con mácrón no se teclea',
  'l3-acusativo-od': 'forma D: «a la madre» es la única clave y suspende «a su madre», que es la traducción natural',
  'l3-ablativo-abanico': 'forma D, y dos ítems cuya única clave da español agramatical («de el templo»)',
  'l5-conjugacion-por-infinitivo': 'clasifica en CINCO clases y multiple_choice topa en 4 opciones',
  'l5-interrogativas': 'necesita 12 `explanationEs` que hay que escribir, no derivar',
  'l5-pro-drop': 'forma D: 9 de 12 admiten una segunda respuesta correcta que la clave suspende',
  'l10-que-enclitico': 'su respuesta es una lista y el mapeo obliga a decidir qué se muestra y qué se pide',
  // ⚠ `l2-primera` ESTUVO AQUÍ y ya no está: el 2026-09-11 se le escribió
  //   lote. Era el hueco que el latinista encontró mirando otra cosa —la
  //   primera declinación, prerrequisito del punto central del curso, sin
  //   un solo ítem— y así es como se encuentran: una pieza que falta se
  //   manifiesta como uniformidad, y nadie busca un hueco que parece una
  //   elección.
};

export const TALLAS: Talla[] = [
  // ── b1 · Ortografía y cantidad ───────────────────────────────────
  {
    id: 'la-b1-l1-cantidad', blockId: 1, mdx: 'b1/l1-cantidad.mdx',
    name: 'La cantidad vocálica distingue palabras',
    conceptIds: ['l1-cantidad-fonemica'],
    objectives: [
      'La cantidad vocálica distingue palabras',
    ],
  },
  // ── b2 · Sustantivo ────────────────────────────────────────────────
  {
    id: 'la-b2-l1-entrada-del-lexico', blockId: 2, mdx: 'b2/l1-entrada-del-lexico.mdx',
    name: 'La entrada del léxico: lema y genitivo (y por qué no hay artículo)',
    conceptIds: ['l2-genitivo-clave', 'l2-sin-articulo'],
    objectives: [
      'Leer la entrada del léxico como lema + genitivo, y sacar el tema del GENITIVO: de «rēx» no se deduce nada, de «rēgis» sale el paradigma entero',
      'Suplir el artículo que el latín no tiene ELIGIENDO entre tres: indefinido en la primera mención, definido cuando el nombre ya salió, y NINGUNO en el atributo con «sum» — «el señor es maestro», que es donde el hispanohablante mete «un» sin darse cuenta',
    ],
  },
  {
    id: 'la-b2-l2-primera', blockId: 2, mdx: 'b2/l2-primera.mdx',
    name: 'Primera declinación: doce celdas y siete formas',
    conceptIds: ['l2-primera'],
    objectives: [
      'Declinar la primera entera y ver que sus doce celdas producen sólo SIETE cadenas distintas: «-a», «-am», «-ae», «-ā», «-ās», «-ārum», «-īs»',
      'Reconocer que «-ae» cubre CUATRO celdas —genitivo singular, dativo singular, nominativo plural y vocativo plural—, así que producirla es fácil y leerla no: cuál de las cuatro es en cada frase se resuelve más adelante, con el contexto',
      'Declinar también los masculinos en «-a» (nauta, agricola, poēta), que siguen la primera sin ser femeninos — como «el poeta» y «el mapa» en español',
    ],
  },
  {
    id: 'la-b2-l3-segunda-y-neutro', blockId: 2, mdx: 'b2/l3-segunda-y-neutro.mdx',
    name: 'Segunda declinación, vocativo y el neutro en -a',
    conceptIds: ['l2-segunda', 'l2-vocativo', 'l2-neutro-a', 'l2-neutro-regla', 'l2-plural-tantum'],
    objectives: [
      'Declinar la segunda, incluidos los «-er» que sincopan (ager/agrī) y los que conservan la vocal (puer/puerī), sacando el tema del genitivo',
      'Saber que el vocativo ES el nominativo salvo en la 2.ª en «-us» (domine), que es donde están los 217 casos que difieren de los 589 medidos en la Vulgata',
      'No leer la «-a» final como femenino singular: en «arma», «castra», «templa» marca NEUTRO PLURAL, y es el falso regalo más caro del latín',
      'Saber que en el neutro nominativo y acusativo coinciden SIEMPRE, así que la forma sola no dice si es sujeto u objeto',
      'Traducir en singular los plurales que lo piden (castra = el campamento, litterae = la carta) sin generalizar: «arma» y «cōpiae» sí son plurales en español',
    ],
  },
  {
    id: 'la-b2-l4-tercera', blockId: 2, mdx: 'b2/l4-tercera.mdx',
    name: 'La tercera declinación: tema en consonante, temas en -i y el género',
    conceptIds: ['l2-tercera-consonante', 'l2-tercera-i'],
    objectives: [
      'Sacar el tema del genitivo en la tercera, donde el nominativo casi nunca lo dice: rēx/rēgis, corpus/corporis, iter/itineris, homō/hominis',
      'Reconocer las tres marcas del tema en «-i», que no aparecen todas en cada lema: genitivo plural en «-ium», acusativo plural en «-īs» posible en masculinos y femeninos (los neutros hacen «-ia») y ablativo singular en «-ī» en los neutros',
    ],
  },
  {
    id: 'la-b2-l5-quinta', blockId: 2, mdx: 'b2/l5-quinta.mdx',
    name: 'Quinta declinación',
    conceptIds: ['l2-quinta'],
    objectives: [
      'Declinar la quinta (rēs/reī, diēs/diēī) sabiendo que son femeninos salvo «merīdiēs» y «diēs» — y que «diēs» en SINGULAR aparece también en femenino, así que no puede ser la respuesta única de nada',
    ],
  },
  // ── b3 · El caso ───────────────────────────────────────────────────
  {
    id: 'la-b3-l1-funcion-por-desinencia', blockId: 3, mdx: 'b3/l1-funcion-por-desinencia.mdx',
    name: 'La función va en la desinencia: nominativo y acusativo',
    conceptIds: ['l3-funcion-por-desinencia', 'l3-nominativo'],
    objectives: [
      'Asignar la función por la DESINENCIA y no por la posición: «Fīlium pater amat» y «Pater fīlium amat» significan lo mismo, y la lectura española del primero es coherente y FALSA',
      'Reconocer el nominativo como sujeto — y saber que cuando la frase lleva DOS nominativos, como «Caesar imperātor est», ninguna desinencia dice cuál es el sujeto: ahí deciden el orden y el sentido',
    ],
  },
  // ⚠ ESTA LECCIÓN SE RETIRÓ EL 2026-09-10 Y VOLVIÓ EL 2026-09-11, con
  //   un punto menos. Se retiró porque sus tres puntos eran de forma D y
  //   quedaba con tres objetivos y cero ejercicios; vuelve porque dos de
  //   ellos ya publican —la clave lleva ahora la alternativa de
  //   determinante que el latín exige, y se les arreglaron diez ítems
  //   indeterminados—. El ABLATIVO sigue fuera: dos de sus ítems tienen
  //   como única clave aceptada una frase española agramatical («de el
  //   templo»), y eso se arregla en el lote, no aquí.
  {
    id: 'la-b3-l2-genitivo-y-dativo', blockId: 3, mdx: 'b3/l2-genitivo-y-dativo.mdx',
    name: 'Genitivo y dativo: el poseedor y el destinatario',
    conceptIds: ['l3-genitivo-posesivo', 'l3-dativo-ci'],
    objectives: [
      'Reconocer el genitivo posesivo, que es el caso más transparente para un hispanohablante («liber puerī»), y leerlo también cuando va ANTEPUESTO a su núcleo, que es donde el instinto español se estrella',
      'Reconocer el dativo de complemento indirecto («puerō librum dō»), que transfiere casi entero desde el español',
      'Desconfiar cuando la forma es la misma para los dos: en la 1.ª y en la 5.ª el genitivo y el dativo se escriben igual, y entonces lo que decide es el verbo y qué palabra tiene al lado',
    ],
  },
  // ── b4 · Adjetivo y pronombre ──────────────────────────────────────
  {
    id: 'la-b4-l1-concordancia', blockId: 4, mdx: 'b4/l1-concordancia.mdx',
    name: 'La concordancia no es la rima',
    conceptIds: ['l4-concordancia'],
    objectives: [
      'Concordar el adjetivo en género, número y caso, NO en declinación: «rēs pūblica», «magnum opus», «omnis homō» concuerdan aunque las terminaciones no rimen',
    ],
  },
  {
    id: 'la-b4-l2-pronombres', blockId: 4, mdx: 'b4/l2-pronombres.mdx',
    name: 'is/ea/id, los demostrativos y el relativo',
    conceptIds: ['l4-is-ea-id', 'l4-demostrativos', 'l4-relativo'],
    objectives: [
      'Manejar «is/ea/id», el anafórico más frecuente del latín después del relativo —4.572 apariciones contra 6.190 de «quī» en los treebanks del curso—, que hace de «él/ella/ello» y de «ese», con paradigma irregular',
      'Distinguir los tres grados de deixis —hic, iste, ille— sabiendo en qué latín vale la equivalencia con «este/ese/aquel»',
      'Aplicar la regla de dos mitades del relativo: género y número vienen del ANTECEDENTE, el caso viene de SU PROPIA oración («vir quem videō»)',
    ],
  },
  {
    id: 'la-b4-l3-adjetivo-3a-y-grado', blockId: 4, mdx: 'b4/l3-adjetivo-3a-y-grado.mdx',
    name: 'Adjetivos de la tercera y los grados del adjetivo',
    conceptIds: ['l4-adjetivo-3a', 'l4-comparativo'],
    objectives: [
      'Adjetivos de la tercera: tres, dos y una terminación',
      'Comparativo y superlativo, regulares e irregulares',
    ],
  },
  // ── b5 · Verbo I ───────────────────────────────────────────────────
  {
    id: 'la-b5-l1-partes-y-presente', blockId: 5, mdx: 'b5/l1-partes-y-presente.mdx',
    name: 'Las cuatro partes principales, la conjugación y el presente',
    conceptIds: ['l5-partes-principales', 'l5-presente'],
    objectives: [
      'Leer la entrada verbal como cuatro partes (amō, amāre, amāvī, amātum) y saber qué sale de cada una',
      'Conjugar el presente de indicativo activo de las cinco clases: amō, moneō, regō, audiō, capiō',
    ],
  },
  {
    id: 'la-b5-l2-imperfecto-futuro-sum', blockId: 5, mdx: 'b5/l2-imperfecto-futuro-sum.mdx',
    name: 'Imperfecto, futuro y el verbo sum',
    conceptIds: ['l5-imperfecto', 'l5-futuro-dos-formas', 'l5-sum-y-compuestos'],
    objectives: [
      'Formar el imperfecto con el SUFIJO «-bā-» en la 1.ª y la 2.ª (amābam, monēbam) y «-ēbā-» en la 3.ª, la 4.ª y la mixta (regēbam, audiēbam, capiēbam): es una sola regla con dos formas, y coincide en valor con el imperfecto español',
      'Usar las DOS marcas del futuro según la conjugación —«-bō/-bi-» en la 1.ª y la 2.ª, «-am/-ē-» en la 3.ª y la 4.ª— y saber que «regam» es a la vez futuro de indicativo y presente de subjuntivo',
      'Conjugar «sum» y sus compuestos (possum, adsum, absum, prōsum), irregulares y de altísima frecuencia',
    ],
  },
  {
    id: 'la-b5-l3-imperativo-negacion-preguntas', blockId: 5, mdx: 'b5/l3-imperativo-negacion-preguntas.mdx',
    name: 'Imperativo, negación, interrogativas y el sujeto omitido',
    conceptIds: ['l5-imperativo', 'l5-negacion'],
    objectives: [
      'Formar el imperativo (amā/amāte) y saber sus cuatro irregulares: «dīc, dūc, fac» pierden la vocal SÓLO en el singular (el plural es regular: dīcite, dūcite, facite), mientras que «fer» es atemático y la pierde también en plural (ferte, no *ferite)',
      'Negar con «nōn» delante del verbo, que transfiere entero desde el español',
    ],
  },
  {
    id: 'la-b5-l4-irregulares', blockId: 5, mdx: 'b5/l4-irregulares.mdx',
    name: 'Los verbos irregulares',
    conceptIds: ['l5-irregulares'],
    objectives: [
      'Conjugar los irregulares eō, ferō, volō, nōlō, mālō y fīō',
    ],
  },
  // ── b6 · Verbo II ──────────────────────────────────────────────────
  {
    id: 'la-b6-l1-perfectum', blockId: 6, mdx: 'b6/l1-perfectum.mdx',
    name: 'El tema de perfecto y sus tres tiempos',
    conceptIds: ['l6-perfectum'],
    objectives: [
      'Formar los tres tiempos del tema de perfecto (amāvī, amāveram, amāverō) con sus desinencias propias, y reconocer las dos formas de la 3.ª plural: «-ērunt» y «-ēre»',
    ],
  },
  {
    id: 'la-b6-l2-pasiva-y-deponentes', blockId: 6, mdx: 'b6/l2-pasiva-y-deponentes.mdx',
    name: 'La voz pasiva y los deponentes',
    conceptIds: ['l6-pasiva-infectum', 'l6-pasiva-perifrastica', 'l6-deponentes'],
    objectives: [
      'Pasiva del infectum: las desinencias en -r',
      'Pasiva del perfectum: participio + sum, y el participio CONCUERDA',
      'Deponentes: forma pasiva, sentido activo',
    ],
  },
  // ── b7 · Subjuntivo ──────────────────────────────────────────────
  {
    id: 'la-b7-l1-morfologia', blockId: 7, mdx: 'b7/l1-morfologia.mdx',
    name: 'Los cuatro tiempos del subjuntivo',
    conceptIds: ['l7-morfologia-subj'],
    objectives: [
      'Los cuatro tiempos del subjuntivo',
    ],
  },
  {
    id: 'la-b7-l2-oraciones-con-ut', blockId: 7, mdx: 'b7/l2-oraciones-con-ut.mdx',
    name: 'Las oraciones con ut',
    conceptIds: ['l7-ut-final', 'l7-ut-consecutiva', 'l7-completivas-ut'],
    objectives: [
      'Reconocer las oraciones finales con ut y con nē',
      'Consecutivas con ut y su anticipador',
      'Completivas con ut tras verbos de voluntad',
    ],
  },
  {
    id: 'la-b7-l3-interrogativa-y-contraste', blockId: 7, mdx: 'b7/l3-interrogativa-y-contraste.mdx',
    name: 'La interrogativa indirecta y el contraste con el español',
    conceptIds: ['l7-interrogativa-indirecta', 'l7-no-coincide-espanol'],
    objectives: [
      'La interrogativa indirecta va en subjuntivo',
      'El subjuntivo latino NO coincide con el español',
    ],
  },
  {
    id: 'la-b7-l4-consecutio', blockId: 7, mdx: 'b7/l4-consecutio.mdx',
    name: 'Concordancia de tiempos',
    conceptIds: ['l7-consecutio'],
    objectives: [
      'Aplicar la concordancia de tiempos',
    ],
  },
  // ── b8 · Formas nominales del verbo ──────────────────────────────
  {
    id: 'la-b8-l1-participios', blockId: 8, mdx: 'b8/l1-participios.mdx',
    name: 'Los participios',
    conceptIds: ['l8-tres-participios', 'l8-participio-concertado', 'l8-ablativo-absoluto'],
    objectives: [
      'Los tres participios y sus tres tiempos relativos',
      'Reconocer y traducir el participio concertado',
      'Reconocer y traducir el ablativo absoluto',
    ],
  },
  {
    id: 'la-b8-l2-infinitivo', blockId: 8, mdx: 'b8/l2-infinitivo.mdx',
    name: 'El infinitivo',
    conceptIds: ['l8-infinitivo-sustantivo'],
    objectives: [
      'El infinitivo como sujeto y como objeto',
    ],
  },
  // ── b10 · Orden ────────────────────────────────────────────────────
  //
  // ⚠ SIN LECCIÓN TODAVÍA, A PROPÓSITO. `l10-que-enclitico` tiene 12
  // ítems escritos, pero su forma —«palabra + glosa → respuesta como
  // lista»— no trae la superficie del ejercicio: habría que INVENTAR la
  // pantalla que el alumno ve, y eso es una decisión de producto, no un
  // port. Declarar aquí la lección la dejaría prometiendo una destreza
  // que nada mide, que es el defecto que el rumano tiene abierto en
  // `b8-l1` con el discurso indirecto. Entra cuando su forma se decida.
  // ── b11 · Léxico ───────────────────────────────────────────────────
  {
    id: 'la-b11-l1-falsos-regalos', blockId: 11, mdx: 'b11/l1-falsos-regalos.mdx',
    name: 'Los falsos regalos',
    conceptIds: ['l11-falsos-regalos'],
    objectives: [
      'Desconfiar de la palabra que se reconoce: «virtūs» es valor y hombría y no virtud moral, «turba» es la multitud sin juicio sobre su conducta, «causa» es el pleito antes que el motivo — y NO desconfiar de todas, porque «frāter», «nōmen» y «terra» son lo que parecen',
    ],
  },
  {
    id: 'la-b11-l2-preposiciones-caso', blockId: 11, mdx: 'b11/l2-preposiciones-caso.mdx',
    name: 'Preposiciones que rigen dos casos',
    conceptIds: ['l11-preposiciones-caso'],
    objectives: [
      'Preposiciones que rigen dos casos',
    ],
  },
];

const LECCIONES: Lesson[] = TALLAS.map((t) => ({
  id: t.id,
  blockId: t.blockId,
  name: t.name,
  objectives: t.objectives,
  conceptIds: t.conceptIds,
  vocabKey: [] as readonly string[],
  conceptNotesPath: t.mdx,
  exerciseRefs: [] as string[],
}));

/** Sólo los bloques que TIENEN lecciones: un bloque vacío es una promesa
 *  que nada cumple, y además rompe al publicador. */
export const BLOCKS: Block[] = BLOQUES_LA
  .filter((b) => LECCIONES.some((l) => l.blockId === b.id))
  .map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.nombre,
    description: b.nombre,
    durationWeeks: null,
    prereqs: [],
    freeDrill: false,
    lessons: LECCIONES.filter((l) => l.blockId === b.id),
  }));

export function getBlock(id: number): Block {
  const b = BLOCKS.find((x) => x.id === id);
  if (!b) throw new Error(`la: el bloque ${id} no tiene lecciones declaradas todavía`);
  return b;
}

export function getLesson(id: LessonId): Lesson {
  const l = LECCIONES.find((x) => x.id === id);
  if (!l) throw new Error(`la: no existe la lección ${id}`);
  return l;
}

export function getConceptsByIds(ids: ConceptId[]): Concept[] {
  return ids.map((i) => CONCEPTO.get(i)).filter((c): c is Concept => !!c);
}

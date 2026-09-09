// lib/data/languages/la/lexicon-l1.ts — el vocabulario de L1 que la máquina
// de paradigmas declina y conjuga. Entrada = lema + genitivo (o infinitivo),
// que es el punto `l2-genitivo-clave`.
import type { EntradaNominal, EntradaVerbal, EntradaAdjetivo } from './paradigma-la';

export const NOMBRES_L1: EntradaNominal[] = [
  { lema: 'puella', genitivo: 'puellae', genero: 'f', glosa: 'niña' },
  { lema: 'amīca', genitivo: 'amīcae', genero: 'f', glosa: 'amiga' },
  { lema: 'vīcīna', genitivo: 'vīcīnae', genero: 'f', glosa: 'vecina' },
  { lema: 'fīlia', genitivo: 'fīliae', genero: 'f', glosa: 'hija' },
  { lema: 'rēgīna', genitivo: 'rēgīnae', genero: 'f', glosa: 'reina' },
  { lema: 'domina', genitivo: 'dominae', genero: 'f', glosa: 'señora' },
  { lema: 'rosa', genitivo: 'rosae', genero: 'f', glosa: 'rosa' },
  { lema: 'terra', genitivo: 'terrae', genero: 'f', glosa: 'tierra' },
  // 1.ª MASCULINA: la forma es de 1.ª y el género no. No es una trampa
  // para un hispanohablante —el español tiene *el poeta, el atleta, el
  // mapa*— pero sí obliga a que el adjetivo concuerde en masculino.
  { lema: 'nauta', genitivo: 'nautae', genero: 'm', glosa: 'marinero' },
  { lema: 'agricola', genitivo: 'agricolae', genero: 'm', glosa: 'campesino' },
  { lema: 'poēta', genitivo: 'poētae', genero: 'm', glosa: 'poeta' },
  // 2.ª
  { lema: 'amīcus', genitivo: 'amīcī', genero: 'm', glosa: 'amigo' },
  { lema: 'vīcīnus', genitivo: 'vīcīnī', genero: 'm', glosa: 'vecino' },
  { lema: 'fīlius', genitivo: 'fīliī', genero: 'm', glosa: 'hijo' },
  { lema: 'servus', genitivo: 'servī', genero: 'm', glosa: 'esclavo' },
  { lema: 'dominus', genitivo: 'dominī', genero: 'm', glosa: 'señor' },
  { lema: 'medicus', genitivo: 'medicī', genero: 'm', glosa: 'médico' },
  { lema: 'discipulus', genitivo: 'discipulī', genero: 'm', glosa: 'discípulo' },
  { lema: 'colōnus', genitivo: 'colōnī', genero: 'm', glosa: 'colono' },
  // 2.ª en -er: la síncopa está en el DATO (el genitivo), no en el código.
  { lema: 'puer', genitivo: 'puerī', genero: 'm', glosa: 'niño' },
  { lema: 'ager', genitivo: 'agrī', genero: 'm', glosa: 'campo' },
  { lema: 'magister', genitivo: 'magistrī', genero: 'm', glosa: 'maestro' },
  // CONSERVA la vocal teniendo CONSONANTE delante, que es lo que rompe la
  // regla falsa que el lote enseñaba sin querer. Atestiguado cinco veces
  // en los propios Evangelios: `adultera` (Mt 12, Mt 16, Mc 8) y
  // `adulterī` (Lc 18, 1 Co 6).
  { lema: 'adulter', genitivo: 'adulterī', genero: 'm', glosa: 'adúltero' },
  // Préstamo griego, declinado a la griega y con paradigma declarado en
  // `IRREGULARES`. 846 apariciones: el nombre propio más frecuente.
  { lema: 'Iēsus', genitivo: 'Iēsū', genero: 'm', glosa: 'Jesús', soloSingular: true },
  { lema: 'gladius', genitivo: 'gladiī', genero: 'm', glosa: 'espada' },
  { lema: 'annus', genitivo: 'annī', genero: 'm', glosa: 'año' },
  { lema: 'cūra', genitivo: 'cūrae', genero: 'f', glosa: 'cuidado' },
  { lema: 'īra', genitivo: 'īrae', genero: 'f', glosa: 'ira' },
  { lema: 'gaudium', genitivo: 'gaudiī', genero: 'n', glosa: 'alegría' },
  { lema: 'timor', genitivo: 'timōris', genero: 'm', glosa: 'miedo' },
  { lema: 'tempus', genitivo: 'temporis', genero: 'n', glosa: 'tiempo' },
  // ── 3.ª. El nominativo NO se deduce del tema y el tema NO se deduce del
  //    nominativo: es el punto `l2-genitivo-clave` en su forma más pura.
  { lema: 'rēx', genitivo: 'rēgis', genero: 'm', glosa: 'rey' },
  // ── LOS QUE FALTABAN Y PESAN EN LA LECTURA DECLARADA ──
  //
  // `Deus` con 1.127 apariciones estaba FUERA del lexicón de un curso cuya
  // lectura es la Vulgata. No es un hueco de cobertura: es el hueco que
  // parece estilo, porque nadie echa de menos la palabra más frecuente del
  // texto — su ausencia no rompe nada, sólo hace que ningún ítem la use.
  { lema: 'Deus', genitivo: 'Deī', genero: 'm', glosa: 'Dios' },
  { lema: 'Chrīstus', genitivo: 'Chrīstī', genero: 'm', glosa: 'Cristo' },
  { lema: 'caelum', genitivo: 'caelī', genero: 'n', glosa: 'cielo' },
  { lema: 'populus', genitivo: 'populī', genero: 'm', glosa: 'pueblo' },
  { lema: 'locus', genitivo: 'locī', genero: 'm', glosa: 'lugar' },
  { lema: 'vir', genitivo: 'virī', genero: 'm', glosa: 'varón' },
  { lema: 'lēx', genitivo: 'lēgis', genero: 'f', glosa: 'ley' },
  { lema: 'frāter', genitivo: 'frātris', genero: 'm', glosa: 'hermano' },
  { lema: 'pars', genitivo: 'partis', genero: 'f', glosa: 'parte', iStem: true },
  { lema: 'spīritus', genitivo: 'spīritūs', genero: 'm', glosa: 'espíritu' },
  { lema: 'manus', genitivo: 'manūs', genero: 'f', glosa: 'mano' },
  { lema: 'diēs', genitivo: 'diēī', genero: 'm', glosa: 'día' },
  // ── LA 4.ª Y LA 5.ª, que tenían dos lemas y uno ──
  //
  // Con dos lemas de 4.ª y uno de 5.ª, un lote de esas declinaciones habría
  // sido un paradigma repetido y no una declinación. Elegidos por frecuencia
  // medida en el corpus, no por costumbre de manual.
  { lema: 'rēs', genitivo: 'reī', genero: 'f', glosa: 'cosa, asunto' },        // 853
  { lema: 'fidēs', genitivo: 'fideī', genero: 'f', glosa: 'fe, confianza' },   // 214
  { lema: 'speciēs', genitivo: 'speciēī', genero: 'f', glosa: 'aspecto' },     // 22
  { lema: 'senātus', genitivo: 'senātūs', genero: 'm', glosa: 'senado' },      // 160
  { lema: 'exercitus', genitivo: 'exercitūs', genero: 'm', glosa: 'ejército' },// 130
  { lema: 'frūctus', genitivo: 'frūctūs', genero: 'm', glosa: 'fruto' },       // 89
  { lema: 'metus', genitivo: 'metūs', genero: 'm', glosa: 'miedo' },           // 39
  // ── Y tres de 3.ª que faltaban, dos de ellas neutras en -us ──
  { lema: 'cīvitās', genitivo: 'cīvitātis', genero: 'f', glosa: 'ciudad, ciudadanía' },
  { lema: 'iūs', genitivo: 'iūris', genero: 'n', glosa: 'derecho' },
  { lema: 'homō', genitivo: 'hominis', genero: 'm', glosa: 'hombre' },
  { lema: 'pater', genitivo: 'patris', genero: 'm', glosa: 'padre' },
  { lema: 'māter', genitivo: 'mātris', genero: 'f', glosa: 'madre' },
  { lema: 'urbs', genitivo: 'urbis', genero: 'f', glosa: 'ciudad', iStem: true },
  // Neutros de 3.ª: los únicos que rompen la colinealidad entre «rima» y
  // «el género español engaña», porque un neutro de 2.ª rima siempre.
  { lema: 'opus', genitivo: 'operis', genero: 'n', glosa: 'obra' },
  { lema: 'corpus', genitivo: 'corporis', genero: 'n', glosa: 'cuerpo' },
  { lema: 'nōmen', genitivo: 'nōminis', genero: 'n', glosa: 'nombre' },
  { lema: 'mare', genitivo: 'maris', genero: 'n', glosa: 'mar', iStem: true },
  // 2.ª neutra
  { lema: 'bellum', genitivo: 'bellī', genero: 'n', glosa: 'guerra' },
  { lema: 'dōnum', genitivo: 'dōnī', genero: 'n', glosa: 'regalo' },
  { lema: 'verbum', genitivo: 'verbī', genero: 'n', glosa: 'palabra' },
  { lema: 'templum', genitivo: 'templī', genero: 'n', glosa: 'templo' },
];

export const VERBOS_L1: EntradaVerbal[] = [
  // `habeō` entra por una razón concreta y medida: es el verbo transitivo
  // más frecuente que acepta SUJETO NEUTRO —11 sujetos neutros distintos
  // anotados en el corpus, «mare», «flūmen», «ferrum»…—, y sin él el punto
  // `l2-neutro-regla` no podía tener ítems de DOS neutros. Todos los demás
  // que aceptan sujeto inanimado son intransitivos (`veniō`, `maneō`,
  // `cadō`, `stō`) y no forman pareja sujeto-objeto.
  { lema: 'habeō', infinitivo: 'habēre', glosa: 'tener', perfecto: 'habuī', supino: 'habitum' },
  // ── LA CONJUGACIÓN MIXTA, QUE NO TENÍA NI UN VERBO ──
  //
  // El `varia` de `l5-conjugacion-por-infinitivo` dice literalmente «hay que
  // traer la mixta, que es la que nadie ve», y el lexicón no tenía ninguno:
  // el punto era insatisfacible por construcción. Entran los dos más
  // frecuentes del corpus, medidos, y son además los que hacen visible el
  // problema — `capere` se escribe igual que un infinitivo de 3.ª y sólo el
  // `-iō` de la primera parte principal lo delata.
  { lema: 'faciō', infinitivo: 'facere', glosa: 'hacer', perfecto: 'fēcī', supino: 'factum' },
  { lema: 'capiō', infinitivo: 'capere', glosa: 'tomar, coger', perfecto: 'cēpī', supino: 'captum' },
  // Los dos verbos de doble acusativo que `l3-acusativo-od` nombra, con su
  // cuenta medida: `doceō` 113 —el número que el punto ya declaraba— y
  // `rogō` 140. Entran para que ese eje del punto sea escribible.
  { lema: 'doceō', infinitivo: 'docēre', glosa: 'enseñar', perfecto: 'docuī', supino: 'doctum' },
  { lema: 'rogō', infinitivo: 'rogāre', glosa: 'preguntar, pedir', perfecto: 'rogāvī', supino: 'rogātum' },
  // El más frecuente del latín, y el que ninguna regla produce: su
  // infinitivo no encaja en las cuatro conjugaciones y su tema alterna.
  // Declarado en `VERBOS_IRREGULARES`, con el imperfecto que el inventario
  // señala como trampa: `eram`, no *`esbam`.
  { lema: 'sum', infinitivo: 'esse', perfecto: 'fuī', glosa: 'ser' },
  { lema: 'amō', infinitivo: 'amāre', perfecto: 'amāvī', supino: 'amātum', glosa: 'amar' },
  { lema: 'vocō', infinitivo: 'vocāre', perfecto: 'vocāvī', supino: 'vocātum', glosa: 'llamar' },
  { lema: 'laudō', infinitivo: 'laudāre', perfecto: 'laudāvī', supino: 'laudātum', glosa: 'alabar' },
  { lema: 'salūtō', infinitivo: 'salūtāre', perfecto: 'salūtāvī', supino: 'salūtātum', glosa: 'saludar' },
  { lema: 'exspectō', infinitivo: 'exspectāre', perfecto: 'exspectāvī', supino: 'exspectātum', glosa: 'esperar' },
  { lema: 'videō', infinitivo: 'vidēre', perfecto: 'vīdī', supino: 'vīsum', glosa: 'ver' },
  { lema: 'timeō', infinitivo: 'timēre', perfecto: 'timuī', glosa: 'temer' },
  { lema: 'moneō', infinitivo: 'monēre', perfecto: 'monuī', supino: 'monitum', glosa: 'advertir' },
  { lema: 'dūcō', infinitivo: 'dūcere', perfecto: 'dūxī', supino: 'ductum', glosa: 'guiar' },
  { lema: 'mittō', infinitivo: 'mittere', perfecto: 'mīsī', supino: 'missum', glosa: 'enviar' },
  { lema: 'legō', infinitivo: 'legere', perfecto: 'lēgī', supino: 'lēctum', glosa: 'leer' },
  { lema: 'audiō', infinitivo: 'audīre', perfecto: 'audīvī', supino: 'audītum', glosa: 'oír' },
  { lema: 'inveniō', infinitivo: 'invenīre', perfecto: 'invēnī', supino: 'inventum', glosa: 'encontrar' },
  { lema: 'custōdiō', infinitivo: 'custōdīre', perfecto: 'custōdīvī', supino: 'custōdītum', glosa: 'guardar' },
  { lema: 'portō', infinitivo: 'portāre', perfecto: 'portāvī', supino: 'portātum', glosa: 'llevar' },
];

// Adjetivos de la primera clase. El `tema` va aparte del lema por el mismo
// motivo que el genitivo en los nombres: en los `-er` no se deduce
// (`pulcher/pulchr-` lo pierde, `miser/miser-` lo conserva), y el alumno
// tampoco puede deducirlo. Los de la 3.ª (`ācer`, `omnis`, `fēlīx`) son el
// punto `l4-adjetivo-3a` y esperan a que la máquina tenga la 3.ª.
export const ADJETIVOS_L1: EntradaAdjetivo[] = [
  { lema: 'bonus', tema: 'bon', glosa: 'bueno' },
  { lema: 'magnus', tema: 'magn', glosa: 'grande' },
  { lema: 'parvus', tema: 'parv', glosa: 'pequeño' },
  { lema: 'longus', tema: 'long', glosa: 'largo' },
  { lema: 'pulcher', tema: 'pulchr', glosa: 'hermoso' },
  { lema: 'miser', tema: 'miser', glosa: 'desdichado' },
  { lema: 'prīmus', tema: 'prīm', glosa: 'primero' },
];

// ── LO QUE NO SE DECLINA, Y LOS COMPARATIVOS ─────────────────────────
//
// Las preposiciones no tienen paradigma y hacen falta desde el primer
// ablativo: `cum` sale 1.148 veces en la Vulgata y `ex` 437. Sin ellas, el
// gate de cantidad las marca como formas desconocidas y no se puede
// escribir un ítem de compañía ni de lugar de donde.
//
// Y los comparativos van aquí COMO FORMAS SUELTAS, no como paradigma: el
// grado es el punto `l4-grados` y su declinación —`fortior, fortius,
// fortiōris`— no está en la máquina. Declarar las dos formas que un lote
// necesita es honesto; fingir que la máquina las deriva no lo sería.
export const INDECLINABLES_L1: string[] = [
  // ── PREPOSICIONES ──
  'cum', 'ex', 'ē', 'in', 'ad', 'ab', 'ā', 'dē', 'per', 'prō', 'sine', 'sub', 'ante', 'post',
  // ── CONJUNCIONES Y PARTÍCULAS ──
  //
  // `et` es la palabra más frecuente del latín (11.407) y `nōn` la
  // duodécima (2.931), y ninguna de las dos estaba después de ocho lotes.
  // Sin ellas no se puede escribir una frase coordinada ni una negación, y
  // se nota en los lotes ya escritos: casi toda frase es N-V-N de tres
  // palabras. Juntas, este bloque es el 13,7 % del corpus.
  'et', 'nōn', 'ut', 'autem', 'sed', 'enim', 'quia', 'quod', 'aut', 'atque',
  'nec', 'neque', 'sī', 'nē', 'quam', 'ecce', 'iam', 'tunc', 'etiam', 'quoque',
  // ── ENCLÍTICOS ──
  //
  // `-que` no se separa por espacios: va pegado (`populusque`). No basta
  // con listarlo — hay que trocear, y eso es `separarEnclitico`.
  'que', 'ne', 've',
  // ── COMPARATIVOS, formas sueltas (ver arriba) ──
  'fortior', 'sanctior',
];

/** Las palabras que ACABAN en `-que`, `-ne` o `-ve` sin llevar enclítico.
 *  Sin esta lista, el troceo partiría `neque` en `ne`+`que` y `quisque` en
 *  `quis`+`que`, que son palabras enteras. Es la mitad que evita partir de
 *  más, y va escrita porque no se deduce. */
export const NO_LLEVAN_ENCLITICO: string[] = [
  'neque', 'quisque', 'usque', 'dēnique', 'itaque', 'atque', 'quaeque', 'quodque',
  'utique', 'undique', 'plērīque', 'quīcumque', 'nēve', 'sīve', 'bene', 'sine',
  'ante', 'omne', 'īre', 'plēne', 'iuvene',
];

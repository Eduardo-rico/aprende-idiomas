// lib/data/languages/la/lexicon-l1.ts — el vocabulario de L1 que la máquina
// de paradigmas declina y conjuga. Entrada = lema + genitivo (o infinitivo),
// que es el punto `l2-genitivo-clave`.
import type { EntradaNominal, EntradaVerbal, EntradaAdjetivo } from './paradigma-la';

export const NOMBRES_L1: EntradaNominal[] = [
  { lema: 'puella', genitivo: 'puellae', genero: 'f', glosa: 'niña' },
  // Mismo motivo que los verbos: los marcos ya las usaban. `causa` ×157,
  // `aqua` ×31 en acusativo.
  { lema: 'causa', genitivo: 'causae', genero: 'f', glosa: 'causa, motivo' },
  { lema: 'aqua', genitivo: 'aquae', genero: 'f', glosa: 'agua' },
  // Léxico básico que los marcos piden y el lexicón no tenía. Medido:
  // `vīta` ×229, `via` ×129. Son de las palabras más corrientes del corpus
  // y `l11-nucleo-800` sigue en 120 lemas de 800, así que además suman.
  { lema: 'vīta', genitivo: 'vītae', genero: 'f', glosa: 'vida' },
  { lema: 'via', genitivo: 'viae', genero: 'f', glosa: 'camino, calle' },
  // ── ENTRAN EL 2026-09-12 PARA DESBLOQUEAR DOS PUNTOS ──
  //
  // Son las palabras que los propios descriptores nombran, y sin ellas dos
  // puntos no se pueden escribir con material honesto:
  //
  //  · `l1-eclesiastica-ti` («grātia = grátsia, nātiō = natsio») no tenía
  //    NI UN caso negativo: su excepción es «tras s, t o x no se aplica —
  //    bestia, mixtiō» y en L1 no había ninguna forma con `ti`+vocal
  //    precedida de esas tres. Cero, no pocas.
  //  · `l1-eclesiastica-gn` («agnus = áñus, magnus = máñus, rēgnum =
  //    réñum») tenía UN solo lema, `magnus`, así que el lote habría medido
  //    un lema trece veces.
  //
  // Atestiguadas: `grātia` ×232, `rēgnum` ×189, `signum` ×137, `bestia`
  // ×54, `agnus` ×38, `nātiō` ×17.
  { lema: 'grātia', genitivo: 'grātiae', genero: 'f', glosa: 'gracia, favor' },
  { lema: 'bestia', genitivo: 'bestiae', genero: 'f', glosa: 'bestia, animal' },
  { lema: 'nātiō', genitivo: 'nātiōnis', genero: 'f', glosa: 'nación, pueblo' },
  { lema: 'agnus', genitivo: 'agnī', genero: 'm', glosa: 'cordero' },
  { lema: 'rēgnum', genitivo: 'rēgnī', genero: 'n', glosa: 'reino' },
  { lema: 'signum', genitivo: 'signī', genero: 'n', glosa: 'signo, señal' },
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
  // El segundo femenino de 4.ª, que `l2-cuarta` nombra y sin el cual su
  // `varia` era insatisfacible. Es irregular —mezcla 2.ª y 4.ª— y su
  // paradigma está declarado entero en `IRREGULARES`.
  { lema: 'domus', genitivo: 'domūs', genero: 'f', glosa: 'casa' },
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
  // ── PARA `l2-genero-3a`: el género no se lee en la terminación ──
  //
  // «mōns es masculino, mēns femenino, mare neutro, y las tres terminan
  // igual de poco informativas.» Elegidos por frecuencia y para que el eje
  // del punto —si el género coincide con el del descendiente español— tenga
  // los dos valores. `arbor` es el caso canónico: femenino en latín y «el
  // árbol» masculino en español.
  { lema: 'arbor', genitivo: 'arboris', genero: 'f', glosa: 'árbol' },        // 79
  { lema: 'mōns', genitivo: 'montis', genero: 'm', glosa: 'monte', iStem: true },   // 95
  { lema: 'mēns', genitivo: 'mentis', genero: 'f', glosa: 'mente', iStem: true },   // 56
  { lema: 'vōx', genitivo: 'vōcis', genero: 'f', glosa: 'voz' },              // 210
  { lema: 'virtūs', genitivo: 'virtūtis', genero: 'f', glosa: 'virtud' },     // 187
  { lema: 'nox', genitivo: 'noctis', genero: 'f', glosa: 'noche', iStem: true },    // 127
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
  // Segundo lema para la muta cum liquida, por el mismo motivo que
  // `integer`: `vo-lu-crēs`, `vo-lu-crem`, `vo-lu-cris`. Atestiguado:
  // `volucres` ×9, `volucris` ×3, `volucrum` ×3.
  // `iStem: false` y lo dice el CORPUS, no un manual: `uolucrum` ×3,
  // `uolucrium` ×0. Lo entré como tema en -i por la pinta del nominativo y
  // la auditoría invertida lo cazó al día siguiente — que es justo para lo
  // que existe: preguntar qué trae el corpus que la máquina no produce.
  { lema: 'volucris', genitivo: 'volucris', genero: 'f', glosa: 'ave' },
  // 2.ª neutra
  { lema: 'bellum', genitivo: 'bellī', genero: 'n', glosa: 'guerra' },
  { lema: 'dōnum', genitivo: 'dōnī', genero: 'n', glosa: 'regalo' },
  { lema: 'verbum', genitivo: 'verbī', genero: 'n', glosa: 'palabra' },
  { lema: 'templum', genitivo: 'templī', genero: 'n', glosa: 'templo' },
];

export const VERBOS_L1: EntradaVerbal[] = [
  // ── ENTRAN EL 2026-09-12 POR MEDICIÓN, NO POR GUSTO ──
  //
  // El barrido de vocabulario de los marcos encontró que doce lotes ya
  // PUBLICADOS usan estos verbos en sus frases y el lexicón no los tenía:
  // `tacet` en tres lotes, `ambulat` en cuatro, `respondit`, `venis`,
  // `habitat`, `laborat`. O sea que el material daba por sabido lo que el
  // curso no enseña. Los siete están atestiguados y no poco:
  //
  //   veniō 453 · respondeō 139 · ambulō 31 · habitō 23 · labōrō 12 · taceō 9
  //
  // `dō` NO entra aquí aunque sale ×290: su infinitivo `dare` lleva `a`
  // BREVE y `conjugacionDe` lo rechaza, con razón —no es de la 1.ª como
  // `amāre`—. Es irregular y necesita tabla propia, como `eō` o `ferō`.
  { lema: 'veniō', infinitivo: 'venīre', glosa: 'venir', perfecto: 'vēnī', supino: 'ventum' },
  { lema: 'respondeō', infinitivo: 'respondēre', glosa: 'responder', perfecto: 'respondī', supino: 'respōnsum' },
  { lema: 'ambulō', infinitivo: 'ambulāre', glosa: 'caminar', perfecto: 'ambulāvī', supino: 'ambulātum' },
  { lema: 'habitō', infinitivo: 'habitāre', glosa: 'habitar', perfecto: 'habitāvī', supino: 'habitātum' },
  { lema: 'labōrō', infinitivo: 'labōrāre', glosa: 'trabajar', perfecto: 'labōrāvī', supino: 'labōrātum' },
  { lema: 'taceō', infinitivo: 'tacēre', glosa: 'callar', perfecto: 'tacuī', supino: 'tacitum' },
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
  // ── PERFECTOS REDUPLICADOS ──
  //
  // `l6-perfectum` enumera cuatro formaciones de tema —reduplicado, en -v-,
  // en -s- y con alargamiento— y el lexicón no tenía NINGÚN reduplicado, así
  // que su `varia` era insatisfacible.
  //
  // Elegidos por frecuencia medida: `stō` 178 y `cadō` 98. El más frecuente
  // de todos es `dō` con 745, y NO entra: su infinitivo es `dare` con `a`
  // BREVE, así que `claseDe` lo mandaría a la 3.ª —acaba en `-are`, no en
  // `-āre`— y estaría mal. `dō` es de 1.ª con tema breve, una irregularidad
  // propia, y meterlo pide declararla antes.
  // `dīcō` entra por el imperativo: es uno de los cuatro que pierden la
  // vocal final —«dīc» ×24 en el corpus— y sin él el `varia` de
  // `l5-imperativo` sólo tendría dos de sus cuatro casos.
  { lema: 'dīcō', infinitivo: 'dīcere', glosa: 'decir', perfecto: 'dīxī', supino: 'dictum' },
  { lema: 'stō', infinitivo: 'stāre', glosa: 'estar de pie', perfecto: 'stetī', supino: 'statum' },
  { lema: 'cadō', infinitivo: 'cadere', glosa: 'caer', perfecto: 'cecidī', supino: 'cāsum' },
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
  // ENTRA EL 2026-09-12 por un motivo concreto y medido: `l1-larga-por-posicion`
  // examina la muta cum liquida, y con `tenebrae` sola el lote mediría un
  // lema tres veces. `in-te-gra`, `in-te-grum` e `in-te-grae` son formas
  // donde el grupo `gr` NO alarga la penúltima breve, que es el punto.
  // Atestiguado: `integra` ×4.
  { lema: 'integer', tema: 'integr', glosa: 'entero, intacto' },
  // `certa` sale en un marco de `l5-negacion` y está atestiguado ×11.
  { lema: 'certus', tema: 'cert', glosa: 'cierto, seguro' },
  // `vērus` ×387, y su neutro `vērum` es «la verdad» sustantivado, que es
  // como sale en casi todos los marcos.
  { lema: 'vērus', tema: 'vēr', glosa: 'verdadero; y en neutro, «la verdad»' },
  // `anxia` sale en un marco de `l5-negacion`. El FEMENINO no aparece en el
  // corpus, pero el lema sí (`anxius` ×3): una forma regular de un lema
  // atestiguado no es un invento, que es lo que el congelador ya declara.
  { lema: 'anxius', tema: 'anxi', glosa: 'angustiado, inquieto' },
  // ── LOS POSESIVOS, EL 2026-09-12 ──
  //
  // `suus` es **el contraejemplo que el descriptor de `l1-uv-ij` da**
  // —«"uolo"→"volo" pero "suus" se queda»— y no estaba en el lexicón, así
  // que la excepción del punto no se podía examinar. Entran los cuatro
  // porque van juntos y son de los más frecuentes del corpus: `suus` ×933,
  // `meus` ×753, `tuus` ×506, `noster` ×495. Y hacen falta además para
  // `l5-pro-drop`: el posesivo es lo que el latín SÍ pone donde el español
  // pone artículo.
  { lema: 'suus', tema: 'su', glosa: 'suyo' },
  { lema: 'meus', tema: 'me', glosa: 'mío' },
  { lema: 'tuus', tema: 'tu', glosa: 'tuyo' },
  { lema: 'noster', tema: 'nostr', glosa: 'nuestro' },
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
  // ── ENTRAN EL 2026-09-12, por el barrido de los marcos ──
  // Los lotes ya las usaban: `At` en `l4-demostrativos`, `Cūr` en el de los
  // irregulares, `satis` y `semper` en el de la negación. Atestiguadas:
  // `at` ×197, `semper` ×109, `satis` ×104, `cūr` ×20.
  'at', 'cūr', 'satis', 'semper',
  // Las dos partículas interrogativas, que `l5-interrogativas` usa en sus
  // doce marcos y no estaban: `nōnne` ×60, `num` ×22. Y `salvē`, el saludo
  // con el que empieza un lote de la 1.ª (×2).
  'nōnne', 'num', 'salvē',
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
  'neque', 'quisque', 'ūsque', 'dēnique', 'itaque', 'atque', 'quaeque', 'quodque',
  'utique', 'undique', 'plērīque', 'quīcumque', 'nēve', 'sīve', 'bene', 'sine',
  'ante', 'omne', 'īre', 'plēne', 'iuvene',
  // AÑADIDOS 2026-09-09 tras contarlos en el corpus. Las palabras que acaban
  // en `-que` sin llevar enclítico son MUCHÍSIMAS —el treebank separa el
  // enclítico de verdad, así que todo lo que queda acabado en `-que` en el
  // flujo de tokens es palabra entera—:
  //
  //   atque 462 · itaque 170 · ūsque 151 · quoque 95 · quīnque 80 ·
  //   quīcumque 52 · quaecumque 44 · quisque 37 · utique 32 ·
  //   ūnusquisque 32 · neque 29 · plērumque 27 · undique 23 · dēnique 20
  //
  // `quīnque` es «cinco» y no `quīn`+`que`; `ūsque` es «hasta»; `quoque` es
  // «también». Un alumno que haya aprendido «-que significa "y"» las partirá
  // todas y sacará basura.
  'quoque', 'quīnque', 'quaecumque', 'quodcumque', 'ūnusquisque', 'utraque',
  'uterque', 'plērumque', 'namque', 'ubīque', 'quandōque', 'cumque',
];

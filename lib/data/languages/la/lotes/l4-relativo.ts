// lib/data/languages/la/lotes/l4-relativo.ts
//
// PRIMER LOTE DEL RELATIVO. Punto: `l4-relativo`.
//
// «La regla de dos mitades: género y número vienen de fuera, el caso de
// dentro. *vir quem videō*». El motivo declarado: el español tiene «que»
// invariable, así que el alumno ignora la forma del relativo.
//
// ── EL SUELO QUE PONE LA LENGUA, Y POR QUÉ ESTE LOTE LO DECLARA ──────
//
// El `varia` del punto exige cubrir nominativo, acusativo y genitivo. Medido
// celda a celda sobre las 30 usables, resulta que en dos de esos tres casos
// **la lengua regala media regla**, y no hay ítem que lo evite:
//
//     nom  NINGUNA celda mide las dos mitades
//          `quī` = m.sg y m.pl · `quae` = f.sg, f.pl y n.pl · `quod` = nom y ac
//     ac   quem (m.sg) · quōs (m.pl) · quam (f.sg) · quās (f.pl)
//     gen  `cuius` es el mismo para los tres géneros; sólo `quārum` mide las dos
//
// Había tres salidas. Cubrir los tres casos y callarse habría dado un lote
// **verde midiendo media regla**, invisible para todos los detectores porque
// el sincretismo no es un defecto del ítem. Recortar el `varia` al acusativo
// habría sacrificado el caso más frecuente del relativo en la Vulgata para
// que el instrumento quedara cómodo — el instrumento mandando sobre el
// temario. La tercera, que es la tomada: **declarar la asimetría como
// contenido**.
//
// Cada ítem dice cuál de las dos mitades examina; el lote trae las dos; y
// ningún ítem puede acreditarse una mitad que su celda no distingue. Que en
// `cuius` el género no se lea deja de ser una limitación del ejercicio y pasa
// a ser lo que es: **información que el alumno necesita**, porque cuando se
// encuentre un `cuius` va a tener que sacar el género del antecedente.
//
// ── LA TERCERA FUGA, QUE SÓLO SE VIO AL BUSCARLA ─────────────────────
//
// La primera versión de este lote salió LIMPIA con 14 ítems, y eso era la
// señal de que faltaba una comprobación. El punto se apoya en que el español
// tiene «que» invariable — y eso **sólo vale para el nominativo y el
// acusativo**. El genitivo se traduce «cuyo», el dativo «al que», el ablativo
// «con el que»: la glosa dice el caso antes de que el alumno mire el latín.
//
// Al contarlo, tres ítems de genitivo pasaron a **no medir absolutamente
// nada**: `cuius` no distingue el género (mitad de fuera) y «cuyo» ya había
// entregado el caso (mitad de dentro). Estaban bien escritos, eran latín
// correcto y su gate anterior los aprobaba.
//
// De todo el genitivo, la única celda que mide algo es `quārum`, y mide sólo
// la mitad de fuera. Así que el `varia` del punto se cubre con ella, y se
// conserva UN `cuius` marcado `enseñaSinMedir`: está para que el alumno vea
// que el género no se lee —información que necesita al leer— y no para
// examinarlo. Es la única excusa admitida y va escrita.
//
// ── LAS PISTAS NO PUEDEN DECIR NI UNA MITAD NI LA OTRA ───────────────
//
// Las primeras decían «el relativo es el OBJETO de *veo* — masculino
// singular»: o sea, el caso Y el género Y el número. Las tres cosas que el
// punto examina, regaladas en una línea. Es la misma fuga que en el lote de
// concordancia sacaba 14 de 14 leyendo sólo la pista.
//
// Ahora la pista es **la misma en los catorce ítems** y enuncia la regla sin
// resolver ningún ítem. Una pista invariante no puede filtrar: no hay nada
// en ella que varíe con la respuesta.
//
// ── POR QUÉ `examina` VA ESCRITO A MANO ──────────────────────────────
//
// En el lote de concordancia, la etiqueta `rima` se DERIVA de los datos
// porque era un hecho duplicado, y un hecho duplicado se desincroniza. Aquí
// es al revés: `examina` es **la afirmación de quien escribe el ítem**, y el
// gate la contrasta contra `mitadesQueMide`, que la calcula moviendo el rasgo
// y mirando si la forma cambia. Derivarla dejaría la comprobación en un
// validador que se recomputa a sí mismo y se da la razón. Son dos casos
// opuestos y conviene no confundirlos.
import type { ItemRelativo } from '../../../../../scripts/lib/gate-relativo';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { declinarPronombre, PRONOMBRES_L1 } from '../pronombres-la';

const QUI = PRONOMBRES_L1.find((e) => e.lema === 'quī')!;

type Def = [
  id: string, g: 'm' | 'f' | 'n', caso: ItemRelativo['caso'], num: 'sg' | 'pl',
  ant: string, antGlosa: string, casoAnt: ItemRelativo['caso'],
  marco: string, glosa: string, pista: string,
  examina: ItemRelativo['ejes']['examina'], porQueNoLaOtra?: string,
  enseñaSinMedir?: { motivo: string },
];

const NO_LEE_EL_NUMERO = '«quī» es la misma forma en el singular y en el plural del masculino: el número no se lee, hay que traerlo del antecedente';
const NO_LEE_EL_GENERO_QUAE = '«quae» sirve para el femenino singular, el femenino plural y el neutro plural: la forma no dice cuál de los tres';
const NO_LEE_EL_CASO_QUOD = '«quod» es la misma forma en nominativo y en acusativo: el caso no se lee, hay que sacarlo de la función';
const NO_LEE_EL_GENERO_CUIUS = '«cuius» es el mismo para los tres géneros —111 apariciones en el corpus y ni una distingue—: al leer, el género sale del antecedente y nunca de la forma';
const NO_LEE_EL_GENERO_QUAE_PL = '«quae» vale para el femenino singular, el femenino plural y el neutro plural: el género y el número salen del antecedente';
const EL_ESPANOL_YA_DIJO_EL_CASO = 'la glosa española usa «cuyo», que ya dice que hay posesión: el caso no lo decide el alumno, lo decide la traducción';

/** La misma para los catorce. Enuncia la regla y no resuelve ningún ítem:
 *  una pista invariante no puede filtrar nada. */
const PISTA = 'El género y el número vienen del ANTECEDENTE; el caso, de lo que el relativo hace dentro de su propia oración.';

const DEFS: Def[] = [
  // ── NOMINATIVO · ninguna celda mide las dos mitades ──
  ['la-4r-01', 'm', 'nom', 'sg', 'servum', 'al esclavo', 'ac',
   'Puella servum videt ___ rosās portat.',
   'La niña ve al esclavo ___ lleva las rosas.',
   PISTA,
   ['dentro'], NO_LEE_EL_NUMERO],
  ['la-4r-02', 'm', 'nom', 'pl', 'servōs', 'a los esclavos', 'ac',
   'Dominus servōs vocat ___ agrum custōdiunt.',
   'El señor llama a los esclavos ___ guardan el campo.',
   PISTA,
   ['dentro'], NO_LEE_EL_NUMERO],
  ['la-4r-03', 'f', 'nom', 'sg', 'rēgīnam', 'a la reina', 'ac',
   'Poēta rēgīnam laudat ___ dōna mittit.',
   'El poeta alaba a la reina ___ envía los regalos.',
   PISTA,
   ['dentro'], NO_LEE_EL_GENERO_QUAE],
  ['la-4r-04', 'n', 'nom', 'sg', 'templum', 'el templo', 'ac',
   'Discipulus templum videt ___ in urbe est.',
   'El discípulo ve el templo ___ está en la ciudad.',
   PISTA,
   ['fuera'], NO_LEE_EL_CASO_QUOD],

  // ── ACUSATIVO · las cuatro celdas que miden la REGLA ENTERA ──
  ['la-4r-05', 'm', 'ac', 'sg', 'Servus', 'el esclavo', 'nom',
   'Servus ___ videō rosās portat.',
   'El esclavo ___ veo lleva las rosas.',
   PISTA,
   ['fuera', 'dentro']],
  ['la-4r-06', 'm', 'ac', 'pl', 'Discipulī', 'los discípulos', 'nom',
   'Discipulī ___ magister monet verba audiunt.',
   'Los discípulos ___ el maestro advierte oyen las palabras.',
   PISTA,
   ['fuera', 'dentro']],
  ['la-4r-07', 'f', 'ac', 'sg', 'Puella', 'la niña', 'nom',
   'Puella ___ amō rosās portat.',
   'La niña ___ amo lleva las rosas.',
   PISTA,
   ['fuera', 'dentro']],
  ['la-4r-08', 'f', 'ac', 'pl', 'Rosae', 'las rosas', 'nom',
   'Rosae ___ puella portat pulchrae sunt.',
   'Las rosas ___ la niña lleva son hermosas.',
   PISTA,
   ['fuera', 'dentro']],
  ['la-4r-09', 'n', 'ac', 'sg', 'Dōnum', 'el regalo', 'nom',
   'Dōnum ___ exspectō magnum est.',
   'El regalo ___ espero es grande.',
   PISTA,
   ['fuera'], NO_LEE_EL_CASO_QUOD],
  ['la-4r-10', 'n', 'ac', 'pl', 'Verba', 'las palabras', 'nom',
   'Verba ___ audiō bona sunt.',
   'Las palabras ___ oigo son buenas.',
   PISTA,
   ['fuera'], '«quae» es la misma forma en el nominativo y en el acusativo del neutro plural: el caso no se lee'],

  // ── GENITIVO · «cuius» no distingue género, y el español SÍ ──
  //
  // Aquí el español ayuda y estorba a la vez, y conviene que el alumno lo
  // sepa: «cuyo» concuerda con lo poseído y por eso da género y número
  // ESPAÑOLES que el latín pone en otro sitio. `cuius` no concuerda con nada.
  // NO MIDE NADA, y se queda por eso mismo: es el ítem donde el alumno ve
  // que `cuius` no dice el género. Marcado `enseñaSinMedir` para que no se
  // cuente jamás como cobertura.
  ['la-4r-11', 'm', 'gen', 'sg', 'Poēta', 'el poeta', 'nom',
   'Poēta ___ verba audiō bonus est.',
   'El poeta ___ palabras oigo es bueno.',
   PISTA,
   [], undefined, { motivo: `${NO_LEE_EL_GENERO_CUIUS}. Y ${EL_ESPANOL_YA_DIJO_EL_CASO}. Las dos mitades entregadas: el ítem no examina nada y está aquí para enseñar precisamente eso` }],

  // ── DOS MÁS DE NOMINATIVO Y UNO DE ABLATIVO ──
  ['la-4r-12', 'f', 'nom', 'pl', 'Puellās', 'a las niñas', 'ac',
   'Poēta puellās laudat ___ rosās portant.',
   'El poeta alaba a las niñas ___ llevan las rosas.',
   PISTA,
   ['dentro'], NO_LEE_EL_GENERO_QUAE_PL],
  ['la-4r-14', 'f', 'abl', 'sg', 'Puella', 'la niña', 'nom',
   'Puella cum ___ ambulō amīca est.',
   'La niña con ___ camino es una amiga.',
   PISTA,
   ['fuera'], 'el ablativo se traduce con preposición —«con la que»—, así que el español ya ha dicho el caso; lo que sí queda por decidir es el género, porque «quā» sólo vale para el femenino singular'],
  // La ÚNICA celda del genitivo que mide algo. Y ojo con la coincidencia:
  // «cuyas» concuerda en español con lo POSEÍDO («rosas») y `quārum` con el
  // antecedente («puellae»). Aquí salen las dos femenino plural por
  // casualidad, y esa casualidad es justo lo que el alumno no debe aprender.
  ['la-4r-13', 'f', 'gen', 'pl', 'Puellae', 'las niñas', 'nom',
   'Puellae ___ rosās videō amīcae sunt.',
   'Las niñas ___ rosas veo son amigas.',
   PISTA,
   ['fuera'], EL_ESPANOL_YA_DIJO_EL_CASO],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemRelativo[] = DEFS.map(
  ([id, g, caso, num, ant, antGlosa, casoAnt, marco, glosa, pista, examina, porQueNoLaOtra, enseñaSinMedir]) => ({
    id, punto: 'l4-relativo', marco,
    antecedente: { forma: ant, glosa: antGlosa, genero: g, numero: num },
    caso, casoDelAntecedente: casoAnt,
    // La forma NUNCA se escribe a mano: sale de la tabla pronominal, que a su
    // vez está contrastada contra la anotación del treebank.
    respuesta: declinarPronombre(QUI, g, caso, num),
    glosa, pista,
    ejes: {
      examina,
      ...(porQueNoLaOtra ? { porQueNoLaOtra } : {}),
      ...(enseñaSinMedir ? { enseñaSinMedir } : {}),
    },
  }));

/** El lote tal como se publica: barajado con `SEMILLA_DE_ORDEN`, porque
 *  escrito agrupado por caso el alumno lo resuelve contando. */
export const LOTE_RELATIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

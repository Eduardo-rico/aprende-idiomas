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
  // ── 3.ª. El nominativo NO se deduce del tema y el tema NO se deduce del
  //    nominativo: es el punto `l2-genitivo-clave` en su forma más pura.
  { lema: 'rēx', genitivo: 'rēgis', genero: 'm', glosa: 'rey' },
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
];

export const VERBOS_L1: EntradaVerbal[] = [
  // El más frecuente del latín, y el que ninguna regla produce: su
  // infinitivo no encaja en las cuatro conjugaciones y su tema alterna.
  // Declarado en `VERBOS_IRREGULARES`, con el imperfecto que el inventario
  // señala como trampa: `eram`, no *`esbam`.
  { lema: 'sum', infinitivo: 'esse', glosa: 'ser' },
  { lema: 'amō', infinitivo: 'amāre', glosa: 'amar' },
  { lema: 'vocō', infinitivo: 'vocāre', glosa: 'llamar' },
  { lema: 'laudō', infinitivo: 'laudāre', glosa: 'alabar' },
  { lema: 'salūtō', infinitivo: 'salūtāre', glosa: 'saludar' },
  { lema: 'exspectō', infinitivo: 'exspectāre', glosa: 'esperar' },
  { lema: 'videō', infinitivo: 'vidēre', glosa: 'ver' },
  { lema: 'timeō', infinitivo: 'timēre', glosa: 'temer' },
  { lema: 'moneō', infinitivo: 'monēre', glosa: 'advertir' },
  { lema: 'dūcō', infinitivo: 'dūcere', glosa: 'guiar' },
  { lema: 'mittō', infinitivo: 'mittere', glosa: 'enviar' },
  { lema: 'legō', infinitivo: 'legere', glosa: 'leer' },
  { lema: 'audiō', infinitivo: 'audīre', glosa: 'oír' },
  { lema: 'inveniō', infinitivo: 'invenīre', glosa: 'encontrar' },
  { lema: 'custōdiō', infinitivo: 'custōdīre', glosa: 'guardar' },
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
];

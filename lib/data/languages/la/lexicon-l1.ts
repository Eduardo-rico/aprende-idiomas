// lib/data/languages/la/lexicon-l1.ts — el vocabulario de L1 que la máquina
// de paradigmas declina y conjuga. Entrada = lema + genitivo (o infinitivo),
// que es el punto `l2-genitivo-clave`.
import type { EntradaNominal, EntradaVerbal } from './paradigma-la';

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
  // 2.ª neutra
  { lema: 'bellum', genitivo: 'bellī', genero: 'n', glosa: 'guerra' },
  { lema: 'dōnum', genitivo: 'dōnī', genero: 'n', glosa: 'regalo' },
  { lema: 'verbum', genitivo: 'verbī', genero: 'n', glosa: 'palabra' },
];

export const VERBOS_L1: EntradaVerbal[] = [
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

// lib/data/languages/la/lotes/l6-pasiva-perfectum.ts
//
// `l6-pasiva-perifrastica` — «amātus est» NO ES «es amado».
//
// El punto es `trampa` y `via: recepcion`: el alumno no falla construyendo,
// falla LEYENDO. `est` es «es» en todas las demás frases que ha visto, y el
// participio concuerda igual que en español. Las dos cosas que reconoce le
// dan la respuesta equivocada, y no hay nada en la forma que le avise.
//
//     amātus est      fue amado          y NO «es amado»
//     amātus erat     había sido amado   y NO «era amado»
//     amātus erit     habrá sido amado   y NO «será amado»
//
// ── LOS TRECE PARES SON LOS QUE EXISTEN ──────────────────────────────
//
// No están elegidos por sonar bien: son pares que el corpus atestigua, con
// el participio contado por RASGO y no por cadena —`facta` es a la vez
// femenino singular y neutro plural, y la cadena no los separa; el par con
// su auxiliar sí—. Del más frecuente al único: `factum est` ×113 hasta
// `facta erunt` ×1.
//
// El reparto de los tiempos no es libre: seis perfectos, cinco
// pluscuamperfectos y dos futuros perfectos. Con siete perfectos —que es
// como estuvo— «contestar siempre en perfecto» sacaba el 54 % del lote sin
// mirar el auxiliar, que es justo lo único que este punto examina.
//
// El futuro perfecto casi no existe en este corpus: de los 1.424 pares,
// **ocho** llevan `erit`/`erunt` y sólo dos tienen el participio de un
// verbo de L1. Son los dos que van aquí. No hace falta excusa escrita
// porque no hay nada que excusar: son los que hay.
//
// ── LA CONCORDANCIA NO PUEDE SER LO ÚNICO QUE VARÍE ──────────────────
//
// El español también concuerda el participio («fue escrita»), así que esa
// mitad se acierta por herencia. Diez de los trece ítems no son masculino
// singular, que es donde «poner siempre el masculino» se puede distinguir.
import type { ItemPerfectum, Auxiliar, Genero, Numero, TiempoDelValor } from '../../../../../scripts/lib/gate-pasiva-perfectum';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, lema: string, participio: string, auxiliar: Auxiliar,
            genero: Genero, numero: Numero, tiempo: TiempoDelValor,
            generoEspanol: 'm' | 'f', latin: string, glosa: string, respuesta: string];

const DEFS: Def[] = [
  // ── PERFECTO · «est» que no es «es» ──
  ['la-pf-01', 'faciō', 'factum', 'est', 'n', 'sg', 'perfecto', 'f',
   'Signum ā Deō factum est.', 'La señal ___ por Dios.', 'fue hecha'],
  ['la-pf-02', 'faciō', 'facta', 'est', 'f', 'sg', 'perfecto', 'f',
   'Vōx in caelō facta est.', 'Una voz ___ en el cielo.', 'fue hecha'],
  ['la-pf-03', 'faciō', 'factus', 'est', 'm', 'sg', 'perfecto', 'm',
   'Vir rēx factus est.', 'El varón ___ rey.', 'fue hecho'],
  ['la-pf-04', 'dīcō', 'dictum', 'est', 'n', 'sg', 'perfecto', 'f',
   'Verbum ā rēge dictum est.', 'La palabra ___ por el rey.', 'fue dicha'],
  ['la-pf-05', 'faciō', 'factae', 'sunt', 'f', 'pl', 'perfecto', 'm',
   'Viae ā colōnīs factae sunt.', 'Los caminos ___ por los colonos.', 'fueron hechos'],
  ['la-pf-06', 'dīcō', 'dicta', 'erant', 'n', 'pl', 'pluscuamperfecto', 'f',
   'Verba ā rēge dicta erant.', 'Las palabras ___ por el rey.', 'habían sido dichas'],
  ['la-pf-07', 'videō', 'vīsa', 'sunt', 'n', 'pl', 'perfecto', 'f',
   'Signa in caelō vīsa sunt.', 'Las señales ___ en el cielo.', 'fueron vistas'],

  // ── PLUSCUAMPERFECTO · «erat» que no es «era» ──
  ['la-pf-08', 'mittō', 'missī', 'erant', 'm', 'pl', 'pluscuamperfecto', 'm',
   'Nautae ā dominō missī erant.', 'Los marineros ___ por el señor.', 'habían sido enviados'],
  ['la-pf-09', 'faciō', 'factum', 'erat', 'n', 'sg', 'pluscuamperfecto', 'f',
   'Opus ā servō factum erat.', 'La obra ___ por el esclavo.', 'había sido hecha'],
  ['la-pf-10', 'faciō', 'factae', 'erant', 'f', 'pl', 'pluscuamperfecto', 'f',
   'Lēgēs ā senātū factae erant.', 'Las leyes ___ por el senado.', 'habían sido hechas'],
  ['la-pf-11', 'dīcō', 'dicta', 'erat', 'f', 'sg', 'pluscuamperfecto', 'f',
   'Causa ā poētā dicta erat.', 'La causa ___ por el poeta.', 'había sido dicha'],

  // ── FUTURO PERFECTO · los dos únicos pares de L1 que existen ──
  ['la-pf-12', 'faciō', 'factus', 'erit', 'm', 'sg', 'futuro-perfecto', 'm',
   'Fīlius rēx factus erit.', 'El hijo ___ rey.', 'habrá sido hecho'],
  ['la-pf-13', 'faciō', 'facta', 'erunt', 'n', 'pl', 'futuro-perfecto', 'f',
   'Opera ā servīs facta erunt.', 'Las obras ___ por los esclavos.', 'habrán sido hechas'],
];

const FUENTE: ItemPerfectum[] = DEFS.map(([id, lema, participio, auxiliar, genero, numero, tiempo, generoEspanol, latin, glosa, respuesta]) => ({
  id, punto: 'l6-pasiva-perifrastica', verbo: V(lema), auxiliar, participio, latin, glosa, respuesta,
  ejes: { genero, numero, tiempo, generoEspanol },
}));

export const LOTE_PASIVA_PERFECTUM = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

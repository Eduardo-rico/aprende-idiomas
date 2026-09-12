// lib/data/languages/la/lotes/l4-adjetivo-3a.ts
//
// PRIMER LOTE DEL ADJETIVO DE LA TERCERA. Punto: `l4-adjetivo-3a`.
//
// `varia`: **el número de terminaciones del adjetivo**. Y antes de escribir
// un solo ítem hubo que medir dónde se puede examinar eso, porque el
// descriptor —«ācer/ācris/ācre, omnis/omne, fēlīx»— presenta un eje de tres
// valores que en producción casi no existe.
//
// ── LO QUE DICE LA MÁQUINA, Y CAMBIA EL LOTE ENTERO ──────────────────
//
// Comparadas las 36 celdas de un representante de cada tipo:
//
//   **el número de terminaciones se ve en 6 celdas de 36**, y las seis son
//   nominativo y vocativo singular de los tres géneros.
//
// Y dentro de esas seis hay un escalón más fino:
//
//   · `fēlīx` (UNA) se separa de los otros dos en las tres: el masculino,
//     el femenino y el neutro del nominativo singular son la misma palabra.
//   · `ācer` (TRES) se separa de `omnis` (DOS) **en UNA celda de las 36**:
//     el masculino. `ācris` y `ācre` son exactamente lo que da la regla de
//     los de dos sobre el tema `ācr-`.
//
// Así que un lote que «cubriera el varia» repartiendo los tres tipos por
// casillas cualesquiera no lo examinaría en ninguna: serían ocho ítems
// donde el rasgo diana no varía, o sea un ítem repetido ocho veces. Los
// siete ítems que lo examinan están todos en nominativo singular, y el
// gate mide la cobertura sobre esa cuenta y no sobre el lote.
//
// ── EL ÍTEM 01 CARGA CON EL PUNTO ENTERO ─────────────────────────────
//
// `Gladius ___ est.` con `ācer` es el único ítem del lote —y de cualquier
// lote posible— donde la regla de los de dos falla. Quien la aplique
// escribe *`ācris`, que es una palabra latina real y la forma correcta del
// femenino. No hay ninguna pista que pueda arreglar eso: hay que saberse
// que `ācer` es de tres.
//
// Y sí, ahí la respuesta coincide con el lema. No es un regalo: el lema es
// lo que el alumno tiene delante **junto con `ācris`**, y la pregunta es
// cuál de los dos va en el masculino. La estrategia que el ítem refuta no
// es copiar, es derivar mal.
//
// ── LA OTRA MITAD DEL DESCRIPTOR, QUE SE OLVIDA ──────────────────────
//
// «Y todos declinan como tema en -i, con ablativo en -ī». Eso no se ve
// mirando el adjetivo solo: se ve **contra el nombre**, que hace `-e`. Por
// eso el ítem 08 pone los dos juntos —`cum mente gravī`— y la respuesta
// incorrecta `grave` no es un invento, es el neutro del mismo adjetivo.
//
// ── Y LA EXCEPCIÓN QUE EL INVENTARIO DECLARA ─────────────────────────
//
// «Los participios de presente en función verbal hacen ablativo en -e y no
// en -ī: la misma forma, dos declinaciones según la función». Van los dos
// lados, 09 y 10, con el mismo `praesēns`:
//
//   `cum amīcō praesentī`     adjetiva  → -ī
//   `praesente dominō`        verbal    → -e   (ablativo absoluto)
//
// El 10 no puede llevar un nombre de la tercera al lado: en un ablativo
// absoluto con `patre` los dos acabarían en `-e` y se acertaría copiando.
// Con `dominō` no, y el gate lo comprueba.
import type { ItemAdjetivo3a } from '../../../../../scripts/lib/gate-adjetivo-3a';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { ADJETIVOS_3A } from '../adjetivos-3a';

const A = (l: string) => ADJETIVOS_3A.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, celda: ItemAdjetivo3a['celda'], respuesta: string,
            marco: string, nombre: string, desinencia: string, pista: string, glosa: string,
            examina: ItemAdjetivo3a['ejes']['examina'], funcion?: 'adjetiva' | 'verbal'];

const DEFS: Def[] = [
  // ── EL NÚMERO DE TERMINACIONES · las únicas celdas que lo deciden ──
  ['la-a3-01', 'ācer', 'm.nom.sg', 'ācer', 'Gladius ___ est.', 'Gladius', 'us',
   'concuerda con el sujeto: masculino singular', 'La espada es afilada.', 'terminaciones'],
  ['la-a3-02', 'ācer', 'f.nom.sg', 'ācris', 'Mēns ___ est.', 'Mēns', 's',
   'concuerda con el sujeto: femenino singular', 'La mente es aguda.', 'terminaciones'],
  ['la-a3-03', 'ācer', 'n.nom.sg', 'ācre', 'Bellum ___ est.', 'Bellum', 'um',
   'concuerda con el sujeto: neutro singular', 'La guerra es encarnizada.', 'terminaciones'],
  // No lleva `Rēx` a propósito, aunque encajaba: `rēx` y `fēlīx` acaban las
  // dos en `-x` y el ítem se podría acertar por rima sin saber nada del
  // adjetivo. `Frāter` no rima con nada de la respuesta.
  ['la-a3-04', 'fēlīx', 'm.nom.sg', 'fēlīx', 'Frāter ___ est.', 'Frāter', 'er',
   'concuerda con el sujeto: masculino singular', 'El hermano es afortunado.', 'terminaciones'],
  ['la-a3-05', 'fēlīx', 'f.nom.sg', 'fēlīx', 'Rēgīna ___ est.', 'Rēgīna', 'a',
   'concuerda con el sujeto: femenino singular', 'La reina es afortunada.', 'terminaciones'],
  ['la-a3-06', 'fēlīx', 'n.nom.sg', 'fēlīx', 'Gaudium ___ est.', 'Gaudium', 'um',
   'concuerda con el sujeto: neutro singular', 'La alegría es afortunada.', 'terminaciones'],
  ['la-a3-07', 'omnis', 'n.nom.sg', 'omne', '___ tempus bonum est.', 'tempus', 'us',
   'acompaña a «tempus»: neutro, nominativo singular', 'Todo tiempo es bueno.', 'terminaciones'],

  // ── EL ABLATIVO EN -ī, QUE SÓLO SE VE CONTRA EL -e DEL NOMBRE ──
  ['la-a3-08', 'fortis', 'm.abl.sg', 'fortī', 'Cum virō ___ est.', 'virō', 'ō',
   'acompaña a «virō» tras «cum»: masculino, ablativo singular', 'Está con un hombre valiente.', 'ablativo-i'],
  ['la-a3-09', 'gravis', 'f.abl.sg', 'gravī', 'Cum mente ___ labōrat.', 'mente', 'e',
   'acompaña a «mente» tras «cum»: femenino, ablativo singular', 'Trabaja con mente seria.', 'ablativo-i'],

  // ── LA EXCEPCIÓN DECLARADA: la misma palabra, dos declinaciones ──
  ['la-a3-10', 'praesēns', 'm.abl.sg', 'praesentī', 'Cum amīcō ___ est.', 'amīcō', 'ō',
   'acompaña a «amīcō» tras «cum»: masculino, ablativo singular — aquí el participio CALIFICA al amigo',
   'Está con el amigo presente.', 'ablativo-i', 'adjetiva'],
  ['la-a3-11', 'praesēns', 'm.abl.sg', 'praesente', '___ dominō, servus tacet.', 'dominō', 'ō',
   'ablativo absoluto con «dominō»: aquí el participio no califica, PREDICA',
   'Estando presente el amo, el siervo calla.', 'participio-e', 'verbal'],

  // ── EL TEMA EN -i, LA OTRA MITAD DEL DESCRIPTOR ──
  ['la-a3-12', 'omnis', 'f.gen.pl', 'omnium', 'Cūra ___ puellārum magna est.', 'puellārum', 'ārum',
   'acompaña a «puellārum»: femenino, genitivo plural', 'El cuidado de todas las niñas es grande.', 'tema-en-i'],
  ['la-a3-13', 'fortis', 'n.nom.pl', 'fortia', 'Corpora ___ sunt.', 'Corpora', 'a',
   'concuerda con el sujeto: neutro plural', 'Los cuerpos son fuertes.', 'tema-en-i'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemAdjetivo3a[] = DEFS.map(
  ([id, lema, celda, respuesta, marco, nombreEnElMarco, desinenciaDelNombre, pista, glosa, examina, funcion]) => ({
    id, punto: 'l4-adjetivo-3a', adjetivo: A(lema), celda, respuesta, marco, pista, glosa,
    nombreEnElMarco, desinenciaDelNombre,
    ejes: { terminaciones: A(lema).terminaciones, examina, ...(funcion ? { funcion } : {}) },
  }),
);

export const LOTE_ADJETIVO_3A = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

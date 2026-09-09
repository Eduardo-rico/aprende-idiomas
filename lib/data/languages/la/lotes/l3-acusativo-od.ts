// lib/data/languages/la/lotes/l3-acusativo-od.ts
//
// PRIMER LOTE DEL ACUSATIVO OBJETO. Punto: `l3-acusativo-od`.
//
// «La función más frecuente del caso, y la que el español marca con "a"
// sólo cuando el objeto es humano y determinado.» `varia`: si el objeto es
// animado o inanimado, y si el verbo lleva UN acusativo o DOS.
//
// ── DÓNDE SE ACABA LA TRANSFERENCIA ──────────────────────────────────
//
// El latín marca el objeto con el caso SIEMPRE. El español lo marca con
// «a» sólo cuando es animado y determinado, y con un objeto inanimado no lo
// marca de ninguna manera: sólo queda la posición.
//
//     videt puellam   →  «ve A la niña»     el español tiene marca
//     videt rosam     →  «ve la rosa»       el español no tiene ninguna
//
// Así que la mitad animada del lote le da al alumno una marca a la que
// agarrarse y la inanimada no. Sin las dos clases no se ve dónde deja de
// ayudar el instinto, y el gate lo exige. La cobertura cuenta los
// inanimados aparte: son los que examinan de verdad.
//
// ── EL SEGUNDO EJE EXISTE Y ES RARO, Y SE DICE ───────────────────────
//
// El punto nombra el doble acusativo y cita «doceō (113 en el treebank)».
// Verificado: `doceō` sale exactamente 113 veces y `rogō` 140. Pero frases
// con DOS acusativos dependiendo del mismo verbo hay **7 en los 227.301
// tokens del corpus**.
//
// O sea que el eje existe —el punto no se lo inventa— y el alumno se lo va a
// encontrar una vez cada treinta mil palabras. Dos ítems, declarados como lo
// que son: una construcción real y rara, no una alternativa corriente a la
// otra mitad del lote. Fingir que es corriente habría inflado su peso en el
// repaso espaciado.
import type { ItemFuncionCaso } from '../../../../../scripts/lib/gate-funcion-caso';
import { colisionesDentro } from '../../../../../scripts/lib/gate-funcion-caso';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

const RARO = 'construcción de doble acusativo: existe —«doceō» sale 113 veces y «rogō» 140— pero frases con dos acusativos del mismo verbo hay 7 en todo el corpus, así que es real y rara';

type Def = [id: string, lema: string, num: 'sg' | 'pl', animado: boolean,
            marco: string, glosa: string, respuesta: string, doble?: string];

const DEFS: Def[] = [
  // ── SEIS INANIMADOS · el español no pone ninguna marca ──
  ['la-3a-01', 'rosa', 'sg', false, 'Puella rosam portat.', 'La niña lleva ___.', 'la rosa'],
  ['la-3a-02', 'templum', 'sg', false, 'Exercitus templum custodit.', 'El ejército guarda ___.', 'el templo'],
  ['la-3a-03', 'verbum', 'pl', false, 'Discipulus verba audit.', 'El discípulo oye ___.', 'las palabras'],
  ['la-3a-04', 'gladius', 'sg', false, 'Rex gladium portat.', 'El rey lleva ___.', 'la espada'],
  ['la-3a-05', 'lēx', 'sg', false, 'Populus legem audit.', 'El pueblo oye ___.', 'la ley'],
  ['la-3a-06', 'urbs', 'pl', false, 'Exercitus urbes custodit.', 'El ejército guarda ___.', 'las ciudades'],

  // ── CUATRO ANIMADOS · el español pone «a» ──
  ['la-3a-07', 'puella', 'sg', true, 'Poeta puellam videt.', 'El poeta ve ___.', 'a la niña'],
  ['la-3a-08', 'servus', 'pl', true, 'Dominus servos vocat.', 'El señor llama ___.', 'a los esclavos'],
  ['la-3a-09', 'rēx', 'sg', true, 'Populus regem salutat.', 'El pueblo saluda ___.', 'al rey'],
  ['la-3a-10', 'māter', 'sg', true, 'Filia matrem audit.', 'La hija oye ___.', 'a la madre'],

  // ── DOS DE DOBLE ACUSATIVO · real y raro, declarado ──
  ['la-3a-11', 'discipulus', 'pl', true, 'Magister discipulos verba docet.',
   'El maestro enseña las palabras ___.', 'a los discípulos', RARO],
  ['la-3a-12', 'puer', 'sg', true, 'Poeta puerum verba rogat.',
   'El poeta pregunta las palabras ___.', 'al niño', RARO],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemFuncionCaso[] = DEFS.map(
  ([id, lema, numero, animado, marco, glosa, respuesta, doble]) => {
    const entrada = N(lema);
    return {
      id, punto: 'l3-acusativo-od', entrada, funcion: 'objeto-directo' as const, numero,
      marco, glosa, respuesta,
      forma: declinar(entrada, 'ac', numero),
      ejes: {
        colisiones: colisionesDentro(entrada, 'ac', numero).length,
        objetoAnimado: animado,
        ...(doble ? { dobleAcusativo: doble } : {}),
      },
    };
  });

export const LOTE_ACUSATIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

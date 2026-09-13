// lib/data/languages/la/lotes/l1-h-muda.ts
//
// Punto: `l1-h-muda`. «En la lectura eclesiástica "h" no suena y no impide
// la elisión ni cierra sílaba: "mihi" = "mí-i".»
//
// `varia`: «nada: la regla no tiene contexto». `invarianciaJustificada`:
// «la operación es la misma en todos los contextos porque la regla no tiene
// excepción: es propiedad de la lengua, no del lote».
//
// ── EL PUNTO DECLARA SU PROPIA INVARIANCIA Y EL GATE LA RESPETA ──────
//
// Este es el único de los cinco sin caso negativo, y no por descuido: no
// existe contexto donde la `h` latina suene. El gate acepta la exención
// porque va con motivo escrito — una exención sin motivo es un agujero que
// nadie revisa.
//
// ── LO QUE SÍ VARÍA ES DÓNDE ESTÁ LA `h`, Y NO DA PARA SEIS ──────────
//
// Al principio desaparece y ya (`habet` = «ábet»); ENTRE VOCALES deja
// hiato y la palabra conserva sus dos sílabas (`mihi` = «mí-i»), que es lo
// que el descriptor subraya con el guion.
//
// **En L1 hay UNA sola forma con `h` intervocálica: `mihi`**, que es
// justamente el ejemplo del descriptor. No son pocas, es una — medido
// sobre las 3.416 formas del dominio. Así que el lote la trae y dice esto,
// en vez de repartir seis y seis inventando material.
import { itemsDe, type DefEc } from './_ayuda-eclesiastica';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const DEFS: DefEc[] = [
  // ── `h` inicial: desaparece ──
  ['la-eh-01', 'habet', 'tiene', 'la «h» va al principio'],
  ['la-eh-02', 'homō', 'el hombre', 'la «h» va al principio'],
  ['la-eh-03', 'hominis', 'del hombre', 'la «h» va al principio'],
  ['la-eh-04', 'hōc', 'con esto', 'la «h» va al principio'],
  ['la-eh-05', 'hīs', 'con éstos', 'la «h» va al principio'],
  ['la-eh-06', 'habēre', 'tener', 'la «h» va al principio'],
  // ── `h` entre vocales: deja HIATO, y la palabra sigue teniendo dos sílabas ──
  ['la-eh-07', 'mihi', 'a mí', 'la «h» va ENTRE vocales: ¿se juntan?'],
  // `nihil` estaba aquí y el gate lo tiró: no es forma de L1. Es la
  // segunda palabra con `h` intervocálica que uno piensa, y el proyecto no
  // la tiene.
  ['la-eh-08', 'habēbat', 'tenía', 'la «h» va al principio'],
  ['la-eh-09', 'haec', 'ésta', 'la «h» va al principio y hay dígrafo detrás'],
  ['la-eh-10', 'hic', 'éste', 'la «h» va al principio'],
  ['la-eh-11', 'habent', 'tienen', 'la «h» va al principio'],
  ['la-eh-12', 'hominibus', 'a los hombres', 'la «h» va al principio'],
];

export const SEMILLA_DE_ORDEN = 1;
export const INVARIANCIA_H =
  'el punto lo declara: la operación es la misma en todos los contextos porque la regla no tiene excepción — es propiedad de la lengua, no del lote';
export const LOTE_H_MUDA = ordenPublicado(itemsDe('h-muda', DEFS), SEMILLA_DE_ORDEN);

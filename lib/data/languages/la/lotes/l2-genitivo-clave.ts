// lib/data/languages/la/lotes/l2-genitivo-clave.ts
//
// PRIMER LOTE DEL GENITIVO COMO CLAVE. Punto: `l2-genitivo-clave`.
//
// «De "rēx" no se deduce nada; de "rēgis" sale todo el paradigma. La entrada
// del lexicón es lema + genitivo, y el alumno tiene que aprender a leerla
// así.» `varia`: la declinación y si el tema cambia entre nominativo y
// genitivo.
//
// ── LA PREGUNTA, MEDIDA SOBRE LOS 64 NOMBRES DEL LEXICÓN ─────────────
//
// ¿Sale el tema del nominativo, o sea basta con quitarle la desinencia?
//
//     1.ª   13 de 13   siempre
//     4.ª    6 de  6   siempre
//     5.ª    4 de  4   siempre
//     2.ª   23 de 25   salvo `ager`→`agr-` y `magister`→`magistr-`
//     3.ª    3 de 16   casi nunca
//
//     en total: 49 de 64, el 77 %
//
// O sea que el consejo «usa el genitivo» es innecesario tres de cada cuatro
// veces y **imprescindible en la 3.ª**, que es la declinación más numerosa
// del latín. Un lote que no lo refleje enseña una precaución sin motivo.
//
// ── Y LOS DOS DE 2.ª SON EL MEJOR ÍTEM DEL LOTE ──────────────────────
//
// `ager`/`agrī` y `magister`/`magistrī` son de la SEGUNDA —la declinación
// que el alumno cree transparente— y su tema no está en el nominativo: la
// `e` se cae. Quien haya aprendido «la 2.ª es fácil, quítale el `-us`» hará
// *«agerī» y *«agerum».
//
// Son la prueba de que la regla no es «desconfía de la 3.ª» sino «lee el
// genitivo siempre», que es exactamente lo que el punto dice y lo que un
// lote de puros `rēx` no enseñaría.
//
// ── NO ES LO MISMO QUITAR UNA DESINENCIA QUE NO PODER DEDUCIR ────────
//
// `puella`→`puell-` pierde una letra y es perfectamente predecible;
// `rēx`→`rēg-` no lo es, porque la `g` no está en `rēx` por ninguna parte.
// Medir la distancia entre las dos cadenas confunde las dos cosas, y por eso
// el eje es «¿es el tema un PREFIJO del nominativo?» y no «¿cuánto se
// parecen?».
import type { ItemDeclinacion } from '../../../../../scripts/lib/gate-declinacion';
import { elTemaSaleDelNominativo, temaReal, celdasQueSoloElMacronSepara } from '../../../../../scripts/lib/gate-declinacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, declinacionDe } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, caso: ItemDeclinacion['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string];

const DEFS: Def[] = [
  // ── SEIS DONDE EL NOMINATIVO BASTA · el contraste ──
  ['la-2g-01', 'puella', 'gen', 'sg', 'Rosa ___ pulchra est.', 'La rosa de la niña es hermosa.', 'genitivo singular'],
  ['la-2g-02', 'servus', 'ac', 'pl', 'Dominus ___ vocat.', 'El señor llama a los esclavos.', 'objeto directo, plural'],
  ['la-2g-03', 'templum', 'abl', 'sg', 'In ___ est.', 'Está en el templo.', 'ablativo singular'],
  ['la-2g-04', 'manus', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado de la mano es grande.', 'genitivo singular'],
  ['la-2g-05', 'rēs', 'dat', 'sg', 'Curam ___ dat.', 'Da cuidado al asunto.', 'dativo singular'],
  ['la-2g-06', 'rēgīna', 'ac', 'sg', 'Poeta ___ laudat.', 'El poeta alaba a la reina.', 'objeto directo, singular'],

  // ── LOS DOS DE 2.ª QUE ROMPEN LA CONFIANZA ──
  ['la-2g-07', 'ager', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado del campo es grande.',
   'genitivo singular — la entrada es «ager, agrī»'],
  ['la-2g-08', 'magister', 'ac', 'pl', 'Discipuli ___ audiunt.', 'Los discípulos oyen a los maestros.',
   'objeto directo, plural — la entrada es «magister, magistrī»'],

  // ── SEIS DE 3.ª · donde el genitivo es imprescindible ──
  ['la-2g-09', 'rēx', 'ac', 'sg', 'Populus ___ salutat.', 'El pueblo saluda al rey.',
   'objeto directo, singular — la entrada es «rēx, rēgis»'],
  ['la-2g-10', 'tempus', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado del tiempo es grande.',
   'genitivo singular — la entrada es «tempus, temporis»'],
  ['la-2g-11', 'homō', 'dat', 'sg', 'Donum ___ dat.', 'Da un regalo al hombre.',
   'dativo singular — la entrada es «homō, hominis»'],
  ['la-2g-12', 'corpus', 'nom', 'pl', '___ magna sunt.', 'Los cuerpos son grandes.',
   'sujeto, plural — la entrada es «corpus, corporis»'],
  ['la-2g-13', 'iūs', 'abl', 'sg', 'Cum ___ est.', 'Está con el derecho.',
   'ablativo singular — la entrada es «iūs, iūris»'],
  ['la-2g-14', 'māter', 'gen', 'pl', 'Cura ___ magna est.', 'El cuidado de las madres es grande.',
   'genitivo plural — la entrada es «māter, mātris»'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemDeclinacion[] = DEFS.map(([id, lema, caso, numero, marco, glosa, pista]) => {
  const entrada = N(lema);
  const colapsa = celdasQueSoloElMacronSepara(entrada, caso, numero);
  return {
    id, punto: 'l2-genitivo-clave', entrada, caso, numero, marco, glosa, pista,
    respuesta: declinar(entrada, caso, numero),
    ejes: {
      declinacion: declinacionDe(entrada),
      ...(colapsa.length > 0 ? { colapsaAlLeer: `sin el macrón se escribe igual que ${colapsa.join(', ')}` } : {}),
    },
  };
});

/** Los ítems donde el nominativo NO basta: es lo que el punto examina. */
export const NECESITAN_EL_GENITIVO = FUENTE.filter((it) => !elTemaSaleDelNominativo(it.entrada));

export const LOTE_GENITIVO_CLAVE = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

/** Para el informe: qué tema tiene cada uno y si sale del nominativo. */
export const TEMAS = FUENTE.map((it) => ({
  lema: it.entrada.lema, tema: temaReal(it.entrada), sale: elTemaSaleDelNominativo(it.entrada),
}));

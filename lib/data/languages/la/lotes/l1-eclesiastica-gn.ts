// lib/data/languages/la/lotes/l1-eclesiastica-gn.ts
//
// Punto: `l1-eclesiastica-gn`. «agnus = "áñus", magnus = "máñus", rēgnum =
// "réñum". Es la regla de lectura eclesiástica más frecuente de todas y el
// italiano la da gratis.»
//
// `varia`: «la posición del dígrafo y si el descendiente español conserva
// la ñ (signum→seña) o no (magnus→magno)». Sin excepción declarada.
//
// ── EL LOTE TENÍA UN SOLO LEMA HASTA HACE UNA HORA ───────────────────
//
// `magnus`, y nada más: el lote habría medido un lema trece veces, que es
// el defecto cazado en la 4.ª y la 5.ª. Entraron `agnus` ×38, `rēgnum`
// ×189 y `signum` ×137 — los tres que el descriptor nombra o implica.
//
// ── Y EL `varia` DEL DESCENDIENTE ESPAÑOL VA EN LA GLOSA ─────────────
//
// «signum → seña» conserva la ñ y «magnus → magno» no. Es lo que separa a
// un hispanohablante que reconoce el sonido de uno que lo deduce: en
// «seña» ya lo tiene y en «magno» no. Las glosas lo traen.
import { itemsDe, type DefEc } from './_ayuda-eclesiastica';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const DEFS: DefEc[] = [
  // El español CONSERVA la ñ: el alumno ya tiene el sonido
  ['la-eg-01', 'signum', 'el signo — y en español «seña», que conserva la ñ', '¿cómo suena «gn»?'],
  ['la-eg-02', 'signa', 'los signos — «seña» conserva la ñ', '¿cómo suena «gn»?'],
  ['la-eg-03', 'rēgnum', 'el reino', '¿cómo suena «gn»?'],
  ['la-eg-04', 'rēgnō', 'en el reino', '¿cómo suena «gn»?'],
  // El español NO la conserva: hay que deducirlo
  ['la-eg-05', 'magnus', 'grande — y en español «magno», SIN ñ', '¿cómo suena «gn»?'],
  ['la-eg-06', 'magna', 'grande (femenino) — «magna», sin ñ', '¿cómo suena «gn»?'],
  ['la-eg-07', 'magnum', 'grande (acusativo)', '¿cómo suena «gn»?'],
  ['la-eg-08', 'agnus', 'el cordero — y en español «agnóstico» no vale: aquí es ñ', '¿cómo suena «gn»?'],
  ['la-eg-09', 'agnī', 'del cordero', '¿cómo suena «gn»?'],
  ['la-eg-10', 'agnō', 'al cordero', '¿cómo suena «gn»?'],
  ['la-eg-11', 'magnō', 'grande (dativo)', '¿cómo suena «gn»?'],
  ['la-eg-12', 'signō', 'con el signo', '¿cómo suena «gn»?'],
];

export const SEMILLA_DE_ORDEN = 1;
/** El punto no declara excepción: no hay contexto donde `gn` NO suene /ɲ/.
 *  Se declara aquí con el motivo, y por eso el gate no exige negativos. */
export const INVARIANCIA_GN =
  'el punto no declara excepción y la máquina lo confirma: no hay en L1 ningún contexto donde `gn` no suene /ɲ/, así que un caso negativo tendría que inventarse';
export const LOTE_ECLESIASTICA_GN = ordenPublicado(itemsDe('gn', DEFS), SEMILLA_DE_ORDEN);

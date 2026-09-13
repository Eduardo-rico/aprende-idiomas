// lib/data/languages/la/lotes/l1-larga-por-posicion.ts
//
// PRIMER LOTE DE LA LARGA POR POSICIÓN. Punto: `l1-larga-por-posicion`.
//
// «Una vocal breve seguida de dos consonantes cuenta como sílaba larga para
// el acento: "magíster" es llana porque "gis" está cerrada por s, y
// "ténebrae" es esdrújula porque "br" es muta cum liquida y NO alarga.»
//
// ── ESTE LOTE NO SE PODÍA ESCRIBIR ESTA MAÑANA ───────────────────────
//
// El gate de satisfacibilidad lo declaró bloqueado: en L1 no había ni una
// forma donde la muta cum liquida decidiera el acento. **Y no faltaba
// vocabulario** — faltaba que la máquina declinara `tenebrae`, que llevaba
// en `PLURALIA_TANTUM` desde el principio con 44 tokens medidos y sin
// producir formas. Con eso arreglado y con `volucris` e `integer` dentro,
// hay 14 formas en tres lemas.
//
// ── LA ESTRATEGIA CIEGA ES LA REGLA DEL MANUAL ───────────────────────
//
// «Dos consonantes alargan» acierta en todos los grupos menos en muta cum
// liquida, y es lo que el alumno traerá de cualquier manual — el propio
// punto lo dice: «el manual escolar lo presenta como absoluto y no lo es».
// Así que el lote la refuta en la MITAD de sus ítems, no en uno: seis
// alargan y seis no, y el umbral del equilibrio va absoluto.
//
// ── Y LOS TRES LEMAS SON LOS TRES QUE HAY ────────────────────────────
//
// `tenebrae`, `volucris`, `integer`. Con uno solo el lote mediría un lema y
// no la regla, que es el defecto que ya se cazó en la 4.ª y la 5.ª — así
// que el gate exige los tres.
//
// ── LOS GRUPOS QUE SÍ ALARGAN VAN VARIADOS ───────────────────────────
//
// `nt`, `nd`, `ss`, `st`: repetir `nt` seis veces sería un ítem seis veces.
import type { ItemLarga } from '../../../../../scripts/lib/gate-larga-por-posicion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

type Def = [id: string, palabra: string, respuesta: string, grupo: string, alarga: boolean, glosa: string];

const DEFS: Def[] = [
  // ── ALARGAN · la penúltima es breve y el grupo la cierra ──
  ['la-lp-01', 'dīcentēs', 'cen', 'nt', true, 'los que dicen'],
  ['la-lp-02', 'respondit', 'pon', 'nd', true, 'respondió'],
  ['la-lp-03', 'fuisse', 'is', 'ss', true, 'haber sido'],
  ['la-lp-04', 'magister', 'gis', 'st', true, 'el maestro'],
  ['la-lp-05', 'potestis', 'tes', 'st', true, 'podéis'],
  ['la-lp-06', 'videntēs', 'den', 'nt', true, 'los que ven'],

  // ── NO ALARGAN · oclusiva + líquida, la excepción que el punto declara ──
  ['la-lp-07', 'tenebrīs', 'te', 'br', false, 'con las tinieblas'],
  ['la-lp-08', 'tenebrae', 'te', 'br', false, 'las tinieblas'],
  ['la-lp-09', 'volucrēs', 'vo', 'cr', false, 'las aves'],
  ['la-lp-10', 'volucris', 'vo', 'cr', false, 'el ave'],
  ['la-lp-11', 'integra', 'in', 'gr', false, 'íntegra'],
  ['la-lp-12', 'integrum', 'in', 'gr', false, 'íntegro'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemLarga[] = DEFS.map(([id, palabra, respuesta, grupo, alarga, glosa]) => ({
  id, punto: 'l1-larga-por-posicion', palabra, respuesta, glosa,
  // La pista da el grupo y NO dice si alarga: eso es lo que se examina.
  pista: `la penúltima es breve y va seguida del grupo «${grupo}» · ¿dónde cae el acento?`,
  ejes: { grupo, alarga },
}));

export const LOTE_LARGA_POR_POSICION = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// scripts/lib/copula-ro.ts — LA CÓPULA `este` / `e`: la invariante vive
// en EL GATE, no en el comparador.
//
// ══ POR QUÉ NO EN EL COMPARADOR ══════════════════════════════════════
// La decisión inicial era meter la equivalencia en `answersMatchCard`,
// con el precedente de la coma adversativa: trece declaraciones son
// trece copias de una regla y la catorce es la que nadie añade. El
// razonamiento es correcto y se conserva entero aquí — lo que cambia es
// la CAPA, porque la verificación previa (que el coordinador exigió
// hacer ANTES de implementar) encontró que `answersMatchCard` es ciego a
// la lengua y sirve a cuatro:
//
//   · En PORTUGUÉS `este` es demostrativo y `e` es la conjunción «y».
//     Hay un ítem PUBLICADO cuya respuesta ES `este`
//     (pt/blocks/b2.json id 3c93369c, punto b2-dem-tres-graus:
//     «Eu quero ___ moletom aqui, não aquele.»). Medido en este repo:
//         answersMatchCard('e', 'este')                → false   (hoy)
//         con la equivalencia ciega                     → TRUE   ← acepta «y»
//   · En RUMANO, la dirección `e`→`este` fabrica una forma inexistente,
//     porque en JS el guion es frontera de palabra:
//         'Mi-e foame'.replace(/\be\b/g,'este')  →  'Mi-este foame'
//     y la aceptaría contra la clave `Mi-e foame`. Falso verde en el
//     punto exacto de la cicatriz «la normalización tapa el rasgo».
//
// El precedente de la coma NO cubría esto: la coma no es una palabra de
// ningún otro idioma ni una casilla de ningún paradigma. `este` es las
// dos cosas.
//
// ══ LA NORMA, VERIFICADA ANTES DE ESCRIBIR NADA ══════════════════════
// DOOM3 (2021) s.v. `fi¹`, ind. prez. 3 sg.: **este** [pron. ĭeste] /
// neacc. **e** [pron. ĭe]; (fam.) -i, i-; (reg.) îi.
//   · `e` NO lleva etiqueta de registro: está DENTRO de la norma
//     literaria. Las etiquetas cuelgan de las otras variantes.
//   · `neacc.` es una condición PROSÓDICA, no de estilo: `este` es la
//     forma que puede portar acento, `e` la átona. En una declarativa
//     escrita —lo único que compara la tarjeta— las dos valen.
//   · Sólo la 3.ª SINGULAR. DOOM3 no da forma breve para `ești`,
//     `suntem`, `sunteți`; y para 1 sg./3 pl. da `-s` (pop.) e `îs`
//     (reg.), las dos ETIQUETADAS y por tanto FUERA. `îs` está vivo en
//     el corpus de lecturas (Creangă, Reteganul, Gârleanu) como material
//     receptivo de variedad, no como clave aceptable.
//   · Un marco donde la alternancia NO es libre: con clítico dativo
//     enclítico (`mi-e, ți-e, i-e, ni-e, vi-e, li-e`) sólo existe la
//     átona — `*mi-este` no existe (GALR).
//
// ══ POLARIDAD: ALLOWLIST, NO EXENCIONES ══════════════════════════════
// La regla se declara donde SE APLICA, no donde se exime. Una lista de
// exenciones sobre una regla que corre por defecto es la desincronización
// otra vez: el punto que alguien cree mañana hereda la regla en silencio
// y nadie añade la exención número 11. Aquí es al revés — y coincide con
// la regla del proyecto, «lo que no se declara, se suspende», aplicada al
// gate en vez de al ítem.
import { PUNTOS_RO } from '../../lib/data/languages/ro/inventario-puntos';

/** Los puntos donde `este` y `e` son INTERCAMBIABLES y por tanto la
 *  clave debe declarar su contraparte. Todo lo demás falla cerrado. */
export const PUNTOS_COPULA_LIBRE = new Set<string>([
  'r4-preposicion-caida-articulo',
  'r6-pe-regla-operativa',
  'r4-gd-lui-formula',
  'r2-articulo-enclitico-sg',
  'r2-articulo-enclitico-pl',
  'r4-posesivos',
  'r2-concordancia-adjetivo',
  'r6-doblado-cliticos',
  'r7-pasiva-impersonal',
  // Añadido el 2026-09-03 por el ataque al lote 18: su ítem «E important ca
  // copiii să doarmă opt ore» dejaba fuera «Este important…», que es rumano
  // correcto (DOOM3 s.v. fi¹: este / neacc. e, ninguna con etiqueta de
  // registro). El punto no estaba en NINGUNA de las dos listas de este
  // fichero, que es el único estado que el diseño no contempla: el gate
  // falla cerrado y no dijo nada, y el resultado habría sido un fallo falso
  // en el FSRS sobre una respuesta correcta.
  'r8-completivas-ca-sa',
]);

/** Los puntos donde la alternancia ES contenido y NO se declara nunca.
 *  Se listan aunque la allowlist ya los deje fuera: el motivo tiene que
 *  estar escrito donde alguien lo lea antes de añadirlos arriba. */
export const PUNTOS_COPULA_EXAMINADA: Record<string, string> = {
  'r3-dativo-experimentante': 'la amalgama `mi-e` ES el contenido; `*mi-este` no existe (GALR) y la forma plena `îmi este` es la otra cara del punto',
  'r3-irregulares-a1': '`este` y `e` son DOS CASILLAS de la entrada de DOOM3 (acentuada / neacc.); aceptar una por otra es aceptar otra casilla del paradigma que se está pidiendo',
  'r2-hora-fecha': '«e ora trei» es fórmula lexicalizada, y el punto es la trampa contra el calco *sunt trei',
  'r1-habla-conectada': 'el contenido del punto ES la reducción de formas en tempo rápido',
  'r1-variedades': 'ahí lo que está en juego es îi / îs / -i; queda fuera por seguridad y la regla NO debe crecer hacia esas formas',
  'r11-variedad-moldova': 'hermano de r1-variedades: formas moldavas receptivas',
  'r10-registro-tramite': 'adecuación de registro escrito; `este` es la elección marcada',
  'r10-tres-registros': 'coloquial / estándar escrito / administrativo contrastados: es el punto donde la diferencia ES la información',
};

/** AVISO, no exención: `r10-saludos-formulas` lleva «nu-i nimic» en su
 *  nombre, que es la forma `(fam.) -i` de DOOM3. Con la regla acotada a
 *  `este`/`e` no le pasa nada; queda escrito que el día que alguien
 *  quiera extenderla a `-i`/`îi`, ese punto es la primera víctima. */
export const AVISO_SI_SE_EXTIENDE = 'r10-saludos-formulas';

const SUELTA = (forma: 'este' | 'e') => new RegExp(`(?<![\\p{L}-])${forma}(?![\\p{L}-])`, 'iu');
/** El guion queda EXCLUIDO por los dos lados a propósito: `mi-e` no es
 *  una cópula suelta, y confundirlos es justo lo que fabricaba
 *  `*mi-este`. */
export const copulaSuelta = (s: string): 'este' | 'e' | null =>
  SUELTA('este').test(s) ? 'este' : SUELTA('e').test(s) ? 'e' : null;

export interface ItemCopula { p: string; buena: string; alt?: string[] }

/** LA INVARIANTE: toda clave de un punto de la allowlist que lleve la
 *  cópula suelta declara su contraparte. Así la declaración número
 *  catorce no la escribe nadie de memoria: la exige el gate. */
export function revisarCopula(items: ItemCopula[], etiqueta = 'COP'): string[] {
  const conocidos = new Set(PUNTOS_RO.map((p) => p.id));
  const v: string[] = [];
  items.forEach((x, i) => {
    const id = `${etiqueta}-${String(i + 1).padStart(3, '0')} (${x.p})`;
    if (!conocidos.has(x.p)) { v.push(`${id}: punto fuera del inventario`); return; }
    if (!PUNTOS_COPULA_LIBRE.has(x.p)) return;           // falla cerrado: no se declara
    const forma = copulaSuelta(x.buena);
    if (!forma) return;
    const contraparte = forma === 'este' ? 'e' : 'este';
    const cambiada = x.buena.replace(SUELTA(forma), contraparte);
    const ok = (x.alt ?? []).some((a) => a.trim().toLowerCase() === cambiada.trim().toLowerCase());
    if (!ok) v.push(`${id}: la clave lleva «${forma}» suelto y no declara la contraparte «${contraparte}» — DOOM3 admite las dos y la tarjeta compara EXACTO, así que hoy suspende rumano correcto. Alternativa esperada: «${cambiada}»`);
  });
  return v;
}

// scripts/lib/intencion.ts — EL CAMPO `intencion`, MEDIDO Y RETIRADO.
//
// ══ VEREDICTO (2026-09-03) ═══════════════════════════════════════════
// El coordinador aprobó este campo con la condición de medir el atajo de
// traducción OTRA VEZ sobre los ítems ya determinados por él, «porque
// ahora la pregunta cambia». Se midió. **El campo está RETIRADO de los
// 88 ítems de corrección rumanos y no lo pinta nadie.**
//
// El atajo de traducción está realmente muerto: **0/64** por el camino
// mecánico y **0/64** por el camino independiente, que lo comprobó en la
// dirección que el mecánico no hizo (mala + etiqueta → producción). Esta
// vez el cero era un cero. Pero la medición contestó una pregunta que no
// se había hecho:
//
//   · **redundante en 64 de 64**: la mala ya determina persona, número y
//     referente. La justificación fundacional del campo —cerrar
//     «Trebuie a pleca», que admitía să plec/pleci/plece— ya la cubre
//     OTRO mecanismo, y mejor: el gate de `corr-ro-a1.ts` que exige el
//     pronombre EN LA MALA cuando el regente es invariable. Resuelve la
//     indeterminación donde el alumno mira, no en un campo aparte. Este
//     campo era la copia N+1 de una regla que ya vivía en otro sitio.
//   · **daña en 16**: en `r6-pe-regla-operativa` las dos etiquetas
//     parten el punto en sus dos clases de respuesta, 4 y 4, sin una
//     excepción — y la regla que así enseñan es FALSA justo donde el
//     punto existe porque la regla ingenua es falsa. En
//     `r3-dativo-experimentante`, «yo» describe la frase MALA: la
//     corrección consiste en sacar a ese participante del nominativo.
//
// ══ EL ERROR DE DISEÑO, que es lo que hay que llevarse ═══════════════
// El comentario original sostenía que con etiquetas gramaticales «la
// traducción no cabe por construcción». Cierto e irrelevante: **el
// atajo que importa no es traducir, es NOMBRAR LA PREMISA DE LA REGLA.**
// Y una lista de etiquetas gramaticales es, por definición, una lista de
// rasgos gramaticales — que es exactamente aquello sobre lo que
// condicionan las reglas gramaticales. Las SEIS categorías nombraban el
// factor condicionante de puntos que ya están en el inventario, y tres
// de ellas apuntaban a puntos que vienen ahora (`tiempo` → bloque 5,
// `numero` → los plurales, `persona` → el presente).
//
// La distinción que salva la idea ya estaba escrita en el inventario, en
// el motivo de `r5-imperativo-negativo`: «en transformación la consigna
// puede decir "díselo a VARIOS" sin regalar nada, porque allí la consigna
// ES el ejercicio». En corrección el ejercicio es encontrar y reparar, y
// nombrar el factor es decir dónde mirar. La misma etiqueta es legítima
// en un formato e ilegítima en otro; el vocabulario no puede saberlo,
// sólo el par (punto, formato).
//
// **La prueba práctica, hermana de «¿misma pregunta, misma dirección?»:
// ¿la categoría de la etiqueta nombra el factor condicionante del
// punto?** Si sí, la etiqueta es la respuesta.
//
// Coste de enterrarlo hoy: CERO. `ErrorCorrectionCard` pinta `sentence`,
// `correct`, `explanationEs` y `alternatives`, y nada más — comprobado.
// Ningún alumno vio una sola de estas etiquetas. Dentro de tres lotes
// habría costado tres lotes.
//
// El módulo se queda como EVIDENCIA y con el vocabulario podado: si
// alguien lo reabre, que empiece por leer por qué murió. Si algún día
// revive, tiene que ser AL REVÉS: prohibido por defecto, con un
// `intencionPermitida` declarado punto a punto por quien pueda
// argumentar que esa categoría NO es el factor condicionante de ese
// punto, y con un test que vea en ROJO el caso que debe cazar
// (`r6-pe-regla-operativa` + «algo indeterminado»).

export const ETIQUETAS = {
  persona: ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas', 'usted', 'ustedes'],
  tiempo: ['ahora', 'antes', 'después', 'siempre', 'hoy', 'ayer', 'mañana'],
  acto: ['afirmación', 'negación', 'pregunta', 'orden', 'orden negativa', 'petición', 'ofrecimiento'],
  // PODADAS por el dictamen del 2026-09-03, y ninguna estaba en uso:
  //   · `destinatario` — construida para `r5-imperativo-negativo` y
  //     `r4-vocativo`, que son justo los dos puntos donde regala.
  //   · `cualidad` — sus tres entradas eran determinación referencial,
  //     el factor de `r6-pe-regla-operativa`, `r6-doblado-cliticos` y
  //     `r4-preposicion-caida-articulo`. Era el caballo de Troya.
  //   · `una` / `varias` — un cargador puesto: en
  //     `r2-concordancia-adjetivo` el punto es que el neutro plural
  //     concuerda COMO FEMENINO, así que `varias` habría dictado la
  //     desinencia. Nunca se usaron; se borran antes de que alguien las
  //     use, no después.
  numero: ['uno', 'varios'],
} as const;

/** Todas las etiquetas admitidas, en un conjunto. */
export const VOCABULARIO = new Set<string>(Object.values(ETIQUETAS).flat());

/** El separador es fijo: la intención es una LISTA de etiquetas, no una
 *  frase. Si alguien pudiera escribir una frase, escribiría la española. */
export const SEP = ' · ';

export interface FalloIntencion { etiqueta: string; motivo: string }

/** El gate. Devuelve los fallos; vacío es limpio. */
export function revisarIntencion(valor: string | undefined): FalloIntencion[] {
  if (valor === undefined) return [{ etiqueta: '(sin declarar)', motivo: 'la intención no está declarada — «no medido» no es «limpio»' }];
  const v = valor.trim();
  if (!v) return [{ etiqueta: '(vacía)', motivo: 'intención vacía' }];
  const fallos: FalloIntencion[] = [];
  const partes = v.split(SEP).map((p) => p.trim());
  if (partes.length > 3) fallos.push({ etiqueta: v, motivo: `${partes.length} etiquetas: más de tres deja de ser una etiqueta y empieza a ser una frase` });
  for (const p of partes) {
    if (!VOCABULARIO.has(p)) fallos.push({ etiqueta: p, motivo: 'no está en el vocabulario cerrado' });
  }
  // El cinturón sobre el tirante: aunque la lista cerrada lo hace
  // imposible, se comprueba que no haya entrado nada con forma de verbo
  // o de adjetivo español. Un gate que sólo confía en su lista se queda
  // ciego el día que alguien añade una entrada a la lista.
  for (const p of partes) {
    if (/(?<![\p{L}])\p{L}+(ar|er|ir|ando|iendo|ado|ido)(?![\p{L}])/u.test(p) && !VOCABULARIO.has(p))
      fallos.push({ etiqueta: p, motivo: 'tiene forma de verbo español' });
  }
  return fallos;
}

/** ¿La intención podría DAR la respuesta? Es la medición del atajo hecha
 *  otra vez, porque `intencion` cambia la pregunta: ahora el alumno ve
 *  algo más. Con vocabulario cerrado de etiquetas gramaticales la
 *  respuesta es no por construcción, pero eso es un argumento y esta ola
 *  entera ha ido de la diferencia entre un argumento y un dato. Se mide:
 *  ninguna etiqueta puede compartir raíz con una palabra de la BUENA. */
export function atajoPorIntencion(intencion: string | undefined, buena: string): string[] {
  if (!intencion) return [];
  const raiz = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').slice(0, 4);
  const raicesBuena = new Set(buena.split(/[^\p{L}]+/u).filter((w) => w.length > 3).map(raiz));
  const out: string[] = [];
  for (const p of intencion.split(SEP)) for (const w of p.split(/[^\p{L}]+/u).filter((x) => x.length > 3))
    if (raicesBuena.has(raiz(w))) out.push(`«${w}» comparte raíz con una palabra de la respuesta`);
  return out;
}

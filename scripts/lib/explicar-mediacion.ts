// scripts/lib/explicar-mediacion.ts
//
// LA SEGUNDA MÁQUINA DE MEDIACIÓN: explicar un efecto, no mover un texto.
//
// Las 70 unidades que quedan del bucket —alusión cultural, ironía, humor,
// leer la posición social por el habla, concordancia discutida— no son
// transposición de registro. Ahí no hay «marcador que tiene que
// desaparecer»: la fuente se queda como está y lo que el alumno produce
// es una EXPLICACIÓN para alguien que no la tiene.
//
// Forzar esos puntos a la plantilla de `lote12-mediacion` habría sido
// fingir que se enseñan, que es exactamente lo que el mapa formato↔punto
// existe para impedir. Así que la plantilla es otra, y el mecanismo que
// la sostiene es el mismo que salvó a la primera: **la rúbrica se DERIVA
// de lo declarado**, no se escribe en paralelo al modelo.
//
// Lo que se declara aquí son los PUNTOS CLAVE: las cosas que la
// explicación tiene que decir para valer. De ahí salen la rúbrica y sus
// comprobaciones, y un gate verifica casilla a casilla que el modelo
// cumple su propia rúbrica.
//
// LA CASILLA QUE ESTA FAMILIA NECESITA Y LA OTRA NO: **explicar no es
// traducir ni parafrasear**. Si el modelo se limita a devolver la fuente
// en otras palabras, no ha explicado nada — y esa es la forma natural de
// fallar en esta tarea, igual que inventar datos lo era en la otra. Se
// comprueba por script con el tope de copia literal y, sobre todo, con
// la exigencia de que cada punto clave esté DICHO.
import { copiaLarga, contiene, palabras } from '../lotes/lote12-mediacion';

export interface ItemExplica {
  id: string;
  concepto: string;
  /** El texto portugués que hay que explicar. No se toca. */
  sourceText: string;
  /** Quién no lo entiende y por qué: la explicación se calibra para él. */
  audience: string;
  /** En qué lengua se explica. Es un DATO, no un adorno: `b2c2-med-220`
   *  se publicó declarando `pt` con la fuente en español, y cualquier
   *  gate que se fíe del campo escanea la lengua equivocada. */
  lenguaExplicacion: 'es' | 'pt';
  /** La consigna: dice QUÉ explicar, no CÓMO. */
  instruccion: string;
  /** Lo que la explicación TIENE que decir.
   *
   *  `dice` es la casilla que lee el humano; `ancla` son las cadenas que
   *  el script busca en el modelo. **Están separadas a propósito.** La
   *  primera versión buscaba la casilla literal dentro del modelo y
   *  fallaba en 26 de 18 ítems: una explicación de ochenta palabras
   *  parafrasea por definición, y exigir la frase de la rúbrica dentro de
   *  ella obliga a escribir modelos que repiten el enunciado — es decir,
   *  modelos peores para que el gate esté contento.
   *
   *  Es la misma solución que el cloze: el ítem DECLARA su ancla y el
   *  gate comprueba que esté; lo que la casilla afirma lo juzga quien
   *  corrige. Basta con que una de las anclas aparezca. */
  puntosClave: { dice: string; ancla: string[] }[];
  modelo: string;
  wordRange: [number, number];
  register: string;
  address?: string;
}

/** La rúbrica, derivada. Una casilla por punto clave, más las dos que
 *  esta familia necesita: no inventar y no limitarse a parafrasear. */
export function rubricaDe(x: ItemExplica): string[] {
  const r = x.puntosClave.map((p) => `¿Dice ${p.dice}?`);
  r.push('¿NO añade nada que la fuente no permita afirmar? (casilla negativa: se marca sólo si no inventa)');
  r.push('¿EXPLICA, en vez de limitarse a traducir o parafrasear la fuente? (si sólo la repite en otras palabras, no vale)');
  r.push('¿No copia más de 6 palabras seguidas de la fuente? (comprobable por script)');
  return r;
}

/** Los gates. El modelo cumple su propia rúbrica, casilla a casilla. */
export function verificar(items: ItemExplica[]): string[] {
  const v: string[] = [];
  const fuentes = new Map<string, string>();
  for (const x of items) {
    if (!x.puntosClave.length) v.push(`${x.id}: sin puntos clave — la rúbrica saldría vacía`);
    for (const p of x.puntosClave) {
      if (!p.ancla.length) v.push(`${x.id}: el punto «${p.dice}» no declara ancla — nada que comprobar`);
      else if (!p.ancla.some((a) => contiene(x.modelo, a)))
        v.push(`${x.id}: ninguna ancla de «${p.dice}» está en el modelo (${p.ancla.join(' / ')})`);
    }

    const larga = copiaLarga(x.sourceText, x.modelo);
    if (larga) v.push(`${x.id}: el modelo copia 7 palabras seguidas de la fuente — «${larga}»`);

    const n = palabras(x.modelo).length;
    if (n < x.wordRange[0] || n > x.wordRange[1])
      v.push(`${x.id}: el modelo tiene ${n} palabras y el rango es ${x.wordRange[0]}-${x.wordRange[1]}`);

    // La fuente no puede repetirse dentro del lote: dos explicaciones del
    // mismo texto son el mismo ejercicio con otra consigna.
    const k = x.sourceText.toLowerCase().replace(/\s+/g, ' ').trim();
    if (fuentes.has(k)) v.push(`${x.id}: comparte fuente con ${fuentes.get(k)}`);
    fuentes.set(k, x.id);

    // Y la explicación tiene que estar en la lengua declarada. Se mira
    // por palabras que existen en una y no en la otra: no es un
    // detector de idioma, es un guardián contra el campo que miente.
    const SOLO_ES = /(?<![\p{L}])(el|los|las|del|con|sin|muy|pero|hoy|hasta|desde|aunque|entonces|siempre|porque|cuando|donde|que|para|una|este|esta|eso)(?![\p{L}])/giu;
    const SOLO_PT = /(?<![\p{L}])(não|também|então|porém|porque|quando|onde|para|uma|este|esta|isso|mas|com|sem|muito|hoje|até|desde)(?![\p{L}])/giu;
    const es = new Set((x.modelo.match(SOLO_ES) ?? []).map((w) => w.toLowerCase())).size;
    const pt = new Set((x.modelo.match(SOLO_PT) ?? []).map((w) => w.toLowerCase())).size;
    if (x.lenguaExplicacion === 'es' && pt > es)
      v.push(`${x.id}: declara explicar en español y el modelo parece portugués`);
    if (x.lenguaExplicacion === 'pt' && es > pt)
      v.push(`${x.id}: declara explicar en portugués y el modelo parece español`);
  }
  return v;
}

/** Números y nombres propios que el modelo trae y la fuente no. Mismo
 *  criterio acotado que en la otra familia, y por el mismo motivo: un
 *  aviso ruidoso es un aviso apagado. */
export function inventadosProbables(x: ItemExplica): string[] {
  const contexto = `${x.sourceText} ${x.audience} ${x.instruccion} ` +
    x.puntosClave.flatMap((p) => [p.dice, ...p.ancla]).join(' ');
  const NUM = /(?<![\p{L}])(um|uma|dois|duas|tr[eê]s|cuatro|quatro|cinco|seis|sete|oito|nove|dez|quinze|vinte|trinta|cem|mil|meia|meio|\d+)(?![\p{L}])/giu;
  const out: string[] = [];
  const enFuente = contexto.toLowerCase();
  for (const m of x.modelo.matchAll(NUM))
    if (!enFuente.includes(m[0].toLowerCase()) && !out.includes(m[0])) out.push(m[0]);
  for (const m of x.modelo.matchAll(/(?<=[^.!?—]\s)\p{Lu}\p{Ll}{2,}/gu))
    if (!enFuente.includes(m[0].toLowerCase()) && !out.includes(m[0])) out.push(m[0]);
  return out;
}

// scripts/lib/composiciones.ts
//
// ENUMERAR ATAJOS NO ES ENUMERAR LOS QUE SE TE OCURREN.
//
// El lote 24 del rumano se publicó roto y hubo que retirarlo: declaraba y
// medía dos rutas de transferencia, las dos al 50 % —el azar de una
// elección binaria—, y faltaba la tercera, que era **la primera MÁS una
// marca que el alumno ya sabía**. Resolvía las dos casillas con una idea y
// acertaba 8 de 8. Ocho ítems correctos, gates verdes, punto contado como
// cubierto.
//
// La forma general: **dos estrategias al 50 % pueden componerse en una al
// 100 %, y el informe sale idéntico.** Si el alumno puede ver, sin saber
// el punto, cuál de las dos aplicar, la disyuntiva no cuesta nada.
//
// Así que esto no las enumera: las BUSCA. Se le dan las estrategias ciegas
// y las PISTAS VISIBLES —lo que el alumno percibe sin saber la lengua: si
// el verbo va primero, si la palabra acaba en -a, si la celda es plural— y
// prueba exhaustivamente toda regla de la forma
//
//     «responde A cuando se ve la pista, y B cuando no»
//
// La búsqueda encuentra composiciones que a nadie se le habían ocurrido,
// que es justo lo que falló en el lote 24.
//
// Una pista sólo cuenta como pista si es VISIBLE. Meter aquí algo que
// exija saber el punto convierte la herramienta en un oráculo que se da la
// razón: la lista de pistas es la parte que hay que revisar a mano.
//
// Y hay un segundo filtro, que salió con el lote de transformación y va en
// la dirección contraria: **una pista visible que ES la regla que se
// enseña no es un atajo, es la respuesta.** En «pon el futuro de este
// verbo», la vocal temática del presente —`amat` contra `dūcit`— está a la
// vista Y decide la marca; leerla es exactamente la destreza que el punto
// examina. Meterla en la lista haría que la herramienta encontrara un
// «atajo al 100 %» que en realidad es el alumno haciéndolo bien.
//
// O sea que la lista de pistas tiene que dejar fuera dos cosas: lo que no
// se ve, y lo que se ve pero ES el punto.

export interface Estrategia<T> {
  nombre: string;
  /** Lo que responde, o '' si ante este ítem no produce nada. */
  responde: (i: T) => string;
}

export interface Pista<T> {
  nombre: string;
  vale: (i: T) => boolean;
}

/** La lista de pistas, con QUIÉN la revisó.
 *
 *  ── EL LÍMITE DE ESTA HERRAMIENTA, Y ES SU LADO PELIGROSO ────────────
 *
 *  El algoritmo es exhaustivo sobre la lista; **la lista la escribe una
 *  persona**. Y falla por los dos lados:
 *
 *    · si SOBRA, marca como atajo la pista que ES el punto —la vocal
 *      temática del presente acierta el 100 % y es la destreza— y empuja
 *      a destruir el ejercicio;
 *    · si FALTA, devuelve un número tranquilizador y **el atajo real
 *      queda sin ver**.
 *
 *  La asimetría es lo que hace peligroso el segundo: el primer error se
 *  nota porque alguien discute el hallazgo; **el segundo sale en verde**.
 *  Pasó en rumano — la búsqueda dio 6/9, y con una pista que faltaba
 *  («el lema acaba en -e») la composición subía a 8/9. La encontró el
 *  lingüista adversarial, no quien escribió el lote.
 *
 *  No tiene arreglo completo: enumerar todo lo que un alumno puede
 *  percibir no es cerrable. Lo que sí se puede es (1) **imprimir siempre
 *  la lista usada**, porque un «sin atajo» sobre cinco pistas y otro
 *  sobre veinte no dicen lo mismo y hoy se leían igual, y (2) exigir que
 *  la lista diga **quién la revisó**, porque quien escribe los ítems es
 *  el peor situado para enumerar lo que su lote regala. Es lo mismo que
 *  ya se hace con los errores diana, y por la misma razón. */
export interface PistasDeclaradas<T> {
  pistas: Pista<T>[];
  /** Quién revisó la lista. `'sin revisar'` es una respuesta válida y hace
   *  que el veredicto salga marcado: un «sin atajo» sin revisor no es un
   *  «sin atajo», es un «no encontré con lo que se me ocurrió». */
  revisadaPor: string;
}

export interface Composicion {
  regla: string;
  acierta: number;
  de: number;
  tasa: number;
}

export function buscarComposiciones<T>(
  items: T[],
  correcta: (i: T) => string,
  estrategias: Estrategia<T>[],
  pistas: Pista<T>[],
): Composicion[] {
  const n = items.length;
  const norm = (s: string) => s.normalize('NFC').toLowerCase();
  const out: Composicion[] = [];
  const mide = (regla: string, f: (i: T) => string) => {
    const a = items.filter((i) => { const r = f(i); return r !== '' && norm(r) === norm(correcta(i)); }).length;
    out.push({ regla, acierta: a, de: n, tasa: n ? a / n : 0 });
  };

  for (const e of estrategias) mide(e.nombre, e.responde);
  for (const a of estrategias) for (const b of estrategias) {
    if (a.nombre === b.nombre) continue;
    for (const p of pistas) {
      mide(`${a.nombre} si «${p.nombre}», si no ${b.nombre}`,
           (i) => (p.vale(i) ? a.responde(i) : b.responde(i)));
    }
  }
  return out.sort((x, y) => y.tasa - x.tasa);
}

// ── EL TECHO NO ES EL 50 %, Y EXIGIRLO ES UN ERROR ────────────────────
//
// La primera versión pedía que NINGUNA composición pasara del 50 %, el
// azar de la elección binaria. Aplicado al primer lote encontró una al
// 60 %; al reequilibrar esa pista, apareció otra al 70 %. No es que el
// lote empeorara: es que **con k pistas binarias y n ítems, la MEJOR de k
// supera el 50 % por puro azar**. Es el problema de las comparaciones
// múltiples, y exigir 50 % a un máximo sobre k reglas garantiza el
// hallazgo falso — el mismo error que comparar dos rangos sin preguntarse
// si el estadístico depende de cuántos datos entraron.
//
// El criterio correcto compara el máximo observado contra el máximo que
// dan pistas SIN INFORMACIÓN: se barajan los valores de cada pista entre
// los ítems, se recalcula la mejor composición, y se mira dónde cae la
// observada en esa distribución. Sólo es hallazgo si supera el percentil
// 95 de la nula.

export interface VeredictoComposicion {
  mejor: Composicion;
  nulaP95: number;
  p: number;
  hayAtajo: boolean;
  /** Sobre qué se decidió. Va en el veredicto y no aparte, porque
   *  separarlo es cómo se lee un «sin atajo» sin su denominador. */
  pistasUsadas: string[];
  revisadaPor: string;
}

export function contrastarComposiciones<T>(
  items: T[],
  correcta: (i: T) => string,
  estrategias: Estrategia<T>[],
  declaradas: Pista<T>[] | PistasDeclaradas<T>,
  repeticiones = 2000,
  semilla = 20260903,
): VeredictoComposicion {
  const { pistas, revisadaPor } = Array.isArray(declaradas)
    ? { pistas: declaradas, revisadaPor: 'sin revisar' }
    : declaradas;
  const observadas = buscarComposiciones(items, correcta, estrategias, pistas);
  const mejor = observadas[0]!;

  // Un generador propio y sembrado: la nula tiene que ser reproducible o
  // el veredicto cambia entre corridas y nadie sabe cuál creerse.
  let s = semilla >>> 0;
  const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };

  const nula: number[] = [];
  for (let r = 0; r < repeticiones; r++) {
    // Baraja los valores de CADA pista entre los ítems: conserva cuántos
    // ítems cumplen cada pista y destruye su relación con la respuesta.
    const barajadas: Pista<T>[] = pistas.map((p) => {
      const vals = items.map(p.vale);
      for (let i = vals.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [vals[i], vals[j]] = [vals[j]!, vals[i]!];
      }
      const idx = new Map(items.map((it, i) => [it, vals[i]!]));
      return { nombre: p.nombre, vale: (i: T) => idx.get(i)! };
    });
    nula.push(buscarComposiciones(items, correcta, estrategias, barajadas)[0]!.tasa);
  }
  nula.sort((a, b) => a - b);
  const p95 = nula[Math.floor(0.95 * nula.length)]!;
  const p = nula.filter((x) => x >= mejor.tasa).length / nula.length;
  return { mejor, nulaP95: p95, p, hayAtajo: p < 0.05,
    pistasUsadas: pistas.map((x) => x.nombre), revisadaPor };
}

/** ¿Hay un atajo? Sólo eso.
 *
 *  Contestó una sola pregunta desde el principio y hubo que devolverla a
 *  eso: al añadir la comprobación del revisor la metí aquí dentro, y le
 *  rompí dos tests a la otra sesión, que espera de esta función lo que
 *  siempre dio. **Un sello responde a UNA pregunta**, y «¿hay atajo?» y
 *  «¿es fiable la búsqueda?» son dos. La segunda vive en
 *  `revisarRevisionDePistas`, que se llama aparte y se lee aparte. */
export function revisarComposiciones(v: VeredictoComposicion): { item: string; clase: 'composicion-gana'; detalle: string }[] {
  if (!v.hayAtajo) return [];
  return [{ item: '(lote)', clase: 'composicion-gana',
    detalle: `«${v.mejor.regla}» acierta ${v.mejor.acierta}/${v.mejor.de} (${(100 * v.mejor.tasa).toFixed(0)} %), por encima del percentil 95 de la nula (${(100 * v.nulaP95).toFixed(0)} %), p = ${v.p.toFixed(3)}` }];
}

/** ¿Vale lo que dice el veredicto? Es la otra pregunta: un «sin atajo»
 *  sobre una lista que no ha revisado nadie no es un «sin atajo», es un
 *  «no encontré con lo que se me ocurrió». */
export function revisarRevisionDePistas(v: VeredictoComposicion): { item: string; clase: 'pistas-sin-revisar'; detalle: string }[] {
  if (v.revisadaPor !== 'sin revisar') return [];
  return [{ item: '(lote)', clase: 'pistas-sin-revisar',
    detalle: `las ${v.pistasUsadas.length} pistas no las ha revisado nadie (${v.pistasUsadas.join(', ')}): quien escribe los ítems es el peor situado para enumerar lo que su lote regala` }];
}

/** Para pegar en un commit o en un informe. Imprime SIEMPRE la lista, que
 *  es lo que faltaba: un «sin atajo» sobre cinco pistas y otro sobre
 *  veinte se leían igual. */
export function resumenComposiciones(v: VeredictoComposicion): string {
  return [
    `  mejor: «${v.mejor.regla}» ${v.mejor.acierta}/${v.mejor.de} = ${(100 * v.mejor.tasa).toFixed(0)} %`,
    `  nula p95 ${(100 * v.nulaP95).toFixed(0)} % · p = ${v.p.toFixed(3)} → ${v.hayAtajo ? 'HAY ATAJO' : 'sin atajo'}`,
    `  sobre ${v.pistasUsadas.length} pistas, revisadas por: ${v.revisadaPor}`,
    ...v.pistasUsadas.map((n) => `    · ${n}`),
  ].join('\n');
}

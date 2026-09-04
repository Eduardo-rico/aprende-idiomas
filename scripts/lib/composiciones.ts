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

export interface Estrategia<T> {
  nombre: string;
  /** Lo que responde, o '' si ante este ítem no produce nada. */
  responde: (i: T) => string;
}

export interface Pista<T> {
  nombre: string;
  vale: (i: T) => boolean;
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
}

export function contrastarComposiciones<T>(
  items: T[],
  correcta: (i: T) => string,
  estrategias: Estrategia<T>[],
  pistas: Pista<T>[],
  repeticiones = 2000,
  semilla = 20260903,
): VeredictoComposicion {
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
  return { mejor, nulaP95: p95, p, hayAtajo: p < 0.05 };
}

export function revisarComposiciones(v: VeredictoComposicion): { item: string; clase: 'composicion-gana'; detalle: string }[] {
  if (!v.hayAtajo) return [];
  return [{
    item: '(lote)', clase: 'composicion-gana',
    detalle: `«${v.mejor.regla}» acierta ${v.mejor.acierta}/${v.mejor.de} (${(100 * v.mejor.tasa).toFixed(0)} %), por encima del percentil 95 de la nula (${(100 * v.nulaP95).toFixed(0)} %), p = ${v.p.toFixed(3)}`,
  }];
}

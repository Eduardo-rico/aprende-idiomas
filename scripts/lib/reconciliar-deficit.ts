// scripts/lib/reconciliar-deficit.ts
//
// LA LÍNEA DE RECONCILIACIÓN del déficit de cobertura.
//
// Existe porque en E2#11 se publicaron 24 ítems que cerraron dos puntos
// —uno de 0→12 y otro de 1→13, o sea **−23 de déficit real**— y el total
// reportado sólo bajó **1**. Nadie lo habría notado sin mirar: un
// indicador que no reconcilia convierte el calendario en ficción.
//
// Las dos causas, ya arregladas en `split-conceptos.ts`, quedan aquí
// documentadas porque explican qué tiene que vigilar esta función:
//   1. **Un punto a CERO era invisible.** El déficit se calculaba sobre
//      los conceptos que TENÍAN ítems, así que llenar un punto vacío no
//      descontaba nada — nunca había estado contado. Eran 15 puntos y
//      180 unidades.
//   2. **La asignación se re-deriva del TEXTO en cada pasada**, así que
//      corregir el texto de un ítem puede moverlo de punto. Las 89
//      correcciones de «você» de E2#11 crearon un punto (0→1: +11 de
//      déficit) y alimentaron otro (−1).
//
// La reconciliación no es decorativa: si el residuo no es cero, hay
// ítems o puntos que aparecieron o desaparecieron sin que nadie lo
// declare, y eso es una fuga.

export type PorPunto = Record<string, number>;

export interface Reconciliacion {
  deficitAntes: number;
  deficitAhora: number;
  cambio: number;
  /** ítems netos que entraron al corpus etiquetado */
  itemsAntes: number;
  itemsAhora: number;
  itemsNetos: number;
  /** puntos que no existían en la foto anterior, con lo que aportan */
  puntosNuevos: { id: string; items: number; deficit: number }[];
  /** puntos que existían y ya no: dejaron de contar */
  puntosDesaparecidos: { id: string; deficit: number }[];
  /** puntos que siguen y cambiaron de déficit */
  movidos: { id: string; antes: number; ahora: number; delta: number }[];
  /** puntos cuyo PISO cambió entre las dos fotos. Es su propia causa y
   *  no se puede mezclar con las otras tres: bajar un piso reduce el
   *  déficit sin producir un solo ítem. */
  pisoCambiado: { id: string; pisoAntes: number; pisoAhora: number; delta: number }[];
  /** desglose del cambio, que tiene que sumar `cambio` */
  aporte: { nuevos: number; desaparecidos: number; movidos: number; piso: number };
  /** cambio observado − cambio explicado. Cero o hay fuga. */
  residuo: number;
}

const deficitDe = (n: number, piso: number) => Math.max(0, piso - n);

/** `piso` acepta un número o una función POR PUNTO. La segunda forma
 *  existe porque el proyecto tiene dos pisos desde E2#15 (C2 va a 6) y
 *  esta función se llamaba con el plano: la reconciliación llevaba desde
 *  entonces informando contra un piso que el resto del script no usa —
 *  27 unidades de diferencia en E2#17, y creciendo con cada punto de C2.
 *  El mismo defecto que el mapa bloque→nivel duplicado de E2#13. */
/** `pisoAntes` es el piso VIGENTE CUANDO SE TOMÓ LA FOTO ANTERIOR. Sin
 *  él, `deficitAntes` se recalcula con el piso de hoy y un cambio de piso
 *  REESCRIBE LA HISTORIA en silencio: la foto que decía 570 pasa a decir
 *  562 y el −8 no aparece en ninguna línea. Lo destapó `pisoCero` el
 *  2026-09-03, y es exactamente el defecto que esta función existe para
 *  impedir — «un indicador que no reconcilia convierte el calendario en
 *  ficción», pero aplicado al PISO y no a los ítems. */
export function reconciliar(
  antes: PorPunto,
  ahora: PorPunto,
  piso: number | ((id: string) => number) = 12,
  pisoAntes?: number | ((id: string) => number),
): Reconciliacion {
  const pisoDe = typeof piso === 'function' ? piso : () => piso;
  const pisoDeAntes = pisoAntes === undefined ? pisoDe : (typeof pisoAntes === 'function' ? pisoAntes : () => pisoAntes);
  const ids = new Set([...Object.keys(antes), ...Object.keys(ahora)]);
  const puntosNuevos: Reconciliacion['puntosNuevos'] = [];
  const puntosDesaparecidos: Reconciliacion['puntosDesaparecidos'] = [];
  const movidos: Reconciliacion['movidos'] = [];
  const pisoCambiado: Reconciliacion['pisoCambiado'] = [];

  for (const id of [...ids].sort()) {
    const a = antes[id], b = ahora[id];
    if (a === undefined && b !== undefined) {
      puntosNuevos.push({ id, items: b, deficit: deficitDe(b, pisoDe(id)) });
    } else if (a !== undefined && b === undefined) {
      puntosDesaparecidos.push({ id, deficit: deficitDe(a, pisoDe(id)) });
    } else if (a !== undefined && b !== undefined) {
      // El déficit de un punto puede moverse por DOS causas distintas y
      // se separan: los ítems que entraron o salieron, y el PISO que
      // alguien declaró. Mezclarlas dejaría pasar una rebaja de piso
      // disfrazada de producción.
      const pa = pisoDeAntes(id), pb = pisoDe(id);
      if (pa !== pb) pisoCambiado.push({ id, pisoAntes: pa, pisoAhora: pb, delta: deficitDe(a, pb) - deficitDe(a, pa) });
      if (a !== b) movidos.push({ id, antes: a, ahora: b, delta: deficitDe(b, pb) - deficitDe(a, pb) });
    }
  }

  const suma = (xs: number[]) => xs.reduce((x, y) => x + y, 0);
  const deficitAntes = suma(Object.entries(antes).map(([id, n]) => deficitDe(n, pisoDeAntes(id))));
  const deficitAhora = suma(Object.entries(ahora).map(([id, n]) => deficitDe(n, pisoDe(id))));
  const aporte = {
    nuevos: suma(puntosNuevos.map((p) => p.deficit)),
    desaparecidos: -suma(puntosDesaparecidos.map((p) => p.deficit)),
    movidos: suma(movidos.map((m) => m.delta)),
    piso: suma(pisoCambiado.map((m) => m.delta)),
  };
  const cambio = deficitAhora - deficitAntes;
  const explicado = aporte.nuevos + aporte.desaparecidos + aporte.movidos + aporte.piso;

  return {
    deficitAntes, deficitAhora, cambio,
    itemsAntes: suma(Object.values(antes)),
    itemsAhora: suma(Object.values(ahora)),
    itemsNetos: suma(Object.values(ahora)) - suma(Object.values(antes)),
    puntosNuevos, puntosDesaparecidos, movidos, pisoCambiado, aporte,
    residuo: cambio - explicado,
  };
}

/** El informe que la sesión tiene que pegar. Si el residuo no es cero,
 *  la línea lo grita: no se cierra una sesión con déficit sin explicar. */
export function informe(r: Reconciliacion, piso: number | string = 12): string {
  const L: string[] = [];
  L.push(`## Reconciliación del déficit (piso ${piso})`);
  L.push('');
  L.push('| concepto | unidades |');
  L.push('|---|---:|');
  L.push(`| déficit anterior | ${r.deficitAntes} |`);
  L.push(`| puntos NUEVOS que entran bajo el piso | ${r.aporte.nuevos >= 0 ? '+' : ''}${r.aporte.nuevos} |`);
  L.push(`| puntos que DESAPARECEN | ${r.aporte.desaparecidos} |`);
  L.push(`| ítems ganados o perdidos por los puntos que siguen | ${r.aporte.movidos >= 0 ? '+' : ''}${r.aporte.movidos} |`);
  if (r.aporte.piso !== 0 || r.pisoCambiado.length)
    L.push(`| **PISO declarado distinto** (no es producción) | ${r.aporte.piso >= 0 ? '+' : ''}${r.aporte.piso} |`);
  L.push(`| **déficit actual** | **${r.deficitAhora}** |`);
  L.push(`| **residuo (tiene que ser 0)** | **${r.residuo}** |`);
  L.push('');
  L.push(`Ítems etiquetados: ${r.itemsAntes} → ${r.itemsAhora} (${r.itemsNetos >= 0 ? '+' : ''}${r.itemsNetos}).`);
  if (r.itemsNetos > 0 && r.cambio > -r.itemsNetos) {
    L.push('');
    L.push(`> **Atención**: entraron ${r.itemsNetos} ítems y el déficit bajó ${-r.cambio}.`);
    L.push('> La diferencia son ítems que fueron a puntos ya cubiertos, o puntos');
    L.push('> que nacieron bajo el piso. Está desglosado arriba; si no cuadra,');
    L.push('> el residuo no sería cero.');
  }
  if (r.puntosNuevos.length) {
    L.push('');
    L.push(`**Puntos nuevos (${r.puntosNuevos.length}):** ` + r.puntosNuevos.map((p) => `\`${p.id}\` (${p.items} ítems, +${p.deficit})`).join(' · '));
  }
  if (r.puntosDesaparecidos.length) {
    L.push('');
    L.push(`**Puntos desaparecidos (${r.puntosDesaparecidos.length}):** ` + r.puntosDesaparecidos.map((p) => `\`${p.id}\` (−${p.deficit})`).join(' · '));
  }
  if (r.pisoCambiado.length) {
    L.push('');
    L.push(`**Puntos que cambiaron de PISO (${r.pisoCambiado.length}) — el déficit baja sin que se produzca nada, y por eso va en su propia línea:**`);
    for (const m of r.pisoCambiado) L.push(`- \`${m.id}\`: piso ${m.pisoAntes} → ${m.pisoAhora} (${m.delta >= 0 ? '+' : ''}${m.delta})`);
  }
  const grandes = r.movidos.filter((m) => m.delta !== 0).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 12);
  if (grandes.length) {
    L.push('');
    L.push(`**Puntos que cambiaron de déficit (${r.movidos.filter((m) => m.delta !== 0).length}, los mayores):**`);
    for (const m of grandes) L.push(`- \`${m.id}\`: ${m.antes} → ${m.ahora} ítems (${m.delta >= 0 ? '+' : ''}${m.delta})`);
  }
  return L.join('\n');
}

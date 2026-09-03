// scripts/lib/atajo-correccion.ts — LA MEDICIÓN DEL ATAJO DE TRADUCCIÓN
// en los ítems de corrección, por DOS caminos y el segundo independiente.
//
// Por qué existe: `transparenteLatin` está declarado como gate del formato
// en la definición del lingüista adversarial, y `ItemCorreccion` no tenía
// el campo. O sea que el atajo NUNCA se ha medido en corrección. Lo
// destapó el lingüista en el lote 9 («24/24 de puntos declarados
// transparentes y ningún gate lo decía») y el coordinador ordenó medirlo
// ANTES de pintar `calcoEs` en la tarjeta — porque pintar el calco es
// precisamente dar la traducción.
//
// LOS DOS CAMINOS, y el segundo no lo escribió quien escribió los ítems:
//
//   1. `atajoEs`, DECLARADO por ítem: ¿traduciendo el `calcoEs` palabra
//      por palabra se llega a la BUENA? Es el juicio del autor.
//
//   2. `calco.castellano` DEL INVENTARIO, que responde a la pregunta
//      hermana y se escribió meses antes, en otro fichero y por otro
//      proceso — y que el lingüista corrigió en 21 puntos justamente
//      porque estaba puesta desde la clase y no desde el error. Dice: ¿el
//      ERROR DIANA calcado da español bien formado?
//        · `bien` ⇒ el calco produce la MALA. El atajo lleva al error, que
//          es lo que el formato quiere: el ítem NO se resuelve traduciendo.
//        · `mal` / `no-aplica` ⇒ el calco NO produce la mala, y entonces
//          hay que mirar a dónde lleva: puede llevar a la buena, y ése es
//          justo el ítem que mide español.
//
// Un ítem donde los dos caminos discrepan es el hallazgo. Si sólo mirara
// el camino 1, el validador se estaría dando la razón a sí mismo.
import { PUNTOS_RO } from '../../lib/data/languages/ro/inventario-puntos';
import type { ItemCorreccion } from './correccion';

export interface MedicionAtajo {
  lineas: string[];
  /** Ítems donde el autor declara que traducir da la BUENA. */
  atajo: string[];
  /** Ítems sin declarar: no medidos, que no es lo mismo que limpios. */
  sinDeclarar: string[];
  /** Ítems donde los dos caminos NO dicen lo mismo. */
  discrepan: string[];
}

export function medirAtajo(items: ItemCorreccion[], etiqueta: string): MedicionAtajo {
  const punto = new Map(PUNTOS_RO.map((p) => [p.id, p]));
  const atajo: string[] = [];
  const sinDeclarar: string[] = [];
  const discrepan: string[] = [];
  const porPunto = new Map<string, { n: number; cast: string; atajo: number }>();

  items.forEach((x, i) => {
    const id = `${etiqueta}-${String(i + 1).padStart(3, '0')}`;
    const p = punto.get(x.p);
    const cast = p?.calco.castellano ?? '(punto fuera del inventario)';
    const r = porPunto.get(x.p) ?? { n: 0, cast, atajo: 0 };
    r.n += 1;
    if (x.atajoEs === undefined) sinDeclarar.push(`${id} (${x.p})`);
    else if (x.atajoEs) { atajo.push(`${id} (${x.p})`); r.atajo += 1; }
    // Camino 1 dice «traducir NO da la buena»; camino 2 dice «el calco no
    // produce la mala». Los dos pueden ser ciertos a la vez sólo si el
    // calco da una TERCERA cosa; si no, uno de los dos está mal.
    if (x.atajoEs === false && cast !== 'bien') discrepan.push(`${id} (${x.p}): declara atajoEs=false y el inventario dice castellano='${cast}' — si el calco no produce la mala, ¿qué produce?`);
    porPunto.set(x.p, r);
  });

  const lineas = [
    `### Atajo de traducción — ${etiqueta} · ${items.length} ítems`, '',
    '| punto | ítems | camino 1: atajoEs=true | camino 2: calco.castellano |',
    '|---|---:|---:|---|',
  ];
  for (const [p, r] of porPunto) lineas.push(`| \`${p}\` | ${r.n} | ${r.atajo} | ${r.cast}${r.cast === 'bien' ? ' ✓ (el calco lleva a la MALA)' : ' ⚠'} |`);
  lineas.push('', `**Camino 1** — ítems que se resuelven traduciendo: **${atajo.length}/${items.length}**${sinDeclarar.length ? ` · sin declarar: ${sinDeclarar.length}` : ''}.`);
  const malos = [...porPunto].filter(([, r]) => r.cast !== 'bien');
  lineas.push(`**Camino 2** — ítems cuyo punto NO declara \`castellano: 'bien'\`: **${malos.reduce((a, [, r]) => a + r.n, 0)}/${items.length}**${malos.length ? ` (${malos.map(([p]) => p).join(', ')})` : ''}.`);
  lineas.push(`**Discrepancias entre los dos caminos: ${discrepan.length}.**`);
  for (const d of discrepan) lineas.push(`- ${d}`);
  return { lineas, atajo, sinDeclarar, discrepan };
}

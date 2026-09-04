// scripts/lib/gate-articulo.ts
//
// EL GATE DEL ARTÍCULO. Punto: `l2-sin-articulo`.
//
// El latín no tiene artículo y el español lo exige. `puella` es «una
// niña», «la niña» o «niña» según el contexto, y el hispanohablante —que
// lo tiene obligatorio— no lo omite: **lo suple siempre igual**. El ítem
// da la frase latina y pide el artículo español que el contexto impone.
//
// ── EL PRIMER EJE DE TRES VALORES, Y EL TECHO CAMBIA ──────────────────
//
// Los cinco formatos anteriores se decidían entre DOS opciones, y ahí cada
// ruta ciega acierta la mitad: el techo era 1/2. Aquí las opciones son
// tres —definido, indefinido, ninguno— y las tres rutas parten el lote
// entre ellas, así que sus tasas suman 1 y **el techo es 1/3**.
//
// Es la misma identidad generalizada: **con k valores, cada ruta ciega se
// lleva 1/k y el techo es 1/k.** Dejarlo en 1/2 habría aprobado un lote
// donde «pon siempre el/la» acierta la mitad.
//
// ── LO QUE NO ENTRA EN LA LISTA DE PISTAS ─────────────────────────────
//
// «Si la frase lleva `est`/`sunt`, no pongas artículo» y «si el nombre ya
// salió antes, pon el definido» **son las dos reglas que el punto
// enseña**. Están a la vista y aciertan, y meterlas empujaría a destruir
// el ejercicio.
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export type ValorArticulo = 'definido' | 'indefinido' | 'ninguno';

export interface ItemArticulo {
  id: string;
  punto: string;
  /** La frase latina, que no lleva artículo porque el latín no lo tiene. */
  latin: string;
  /** La glosa española con `___` donde va el artículo (o su ausencia). */
  glosa: string;
  /** La forma que toca: «El», «Una», o cadena vacía. */
  respuesta: string;
  ejes: {
    valor: ValorArticulo;
    /** Género y número del nombre español, que deciden la FORMA del
     *  artículo. Van declarados para que la ruta ciega pueda simularse
     *  bien: quien pone siempre el definido escribe «Los», no «El». */
    gen: 'm' | 'f';
    num: 'sg' | 'pl';
  };
}

export type ClaseFalloA =
  | 'huecos-y-respuestas' | 'respuesta-no-cuadra' | 'eje-mal-declarado'
  | 'repetido' | 'estrategia-ciega' | 'orden-separable'
  | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloA { item: string; clase: ClaseFalloA; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase().trim();
const HUECO = /___/g;

const DEFINIDO = { msg: 'El', fsg: 'La', mpl: 'Los', fpl: 'Las' } as const;
const INDEFINIDO = { msg: 'Un', fsg: 'Una', mpl: 'Unos', fpl: 'Unas' } as const;
const clave = (i: ItemArticulo) => `${i.ejes.gen}${i.ejes.num}` as keyof typeof DEFINIDO;

/** Lo que responde quien pone SIEMPRE el definido, con la forma correcta:
 *  la ruta ciega no falla por concordancia, falla por elegir. */
export const rutaDefinido = (i: ItemArticulo) => DEFINIDO[clave(i)];
export const rutaIndefinido = (i: ItemArticulo) => INDEFINIDO[clave(i)];
export const rutaNinguno = () => '';

/** El techo es el azar del eje: 1/3 con tres valores. */
export const TECHO_A = 1 / 3;

export function revisarArticulo(item: ItemArticulo): FalloA[] {
  const out: FalloA[] = [];
  const push = (clase: ClaseFalloA, detalle: string) => out.push({ item: item.id, clase, detalle });

  const huecos = (item.glosa.match(HUECO) ?? []).length;
  if (huecos !== 1) push('huecos-y-respuestas', `la glosa tiene ${huecos} huecos y hace falta exactamente uno`);

  // La respuesta y el eje declarado tienen que cuadrar: el eje dice qué
  // valor es y la respuesta qué forma toma, y se desincronizan.
  const esperada = item.ejes.valor === 'definido' ? DEFINIDO[clave(item)]
    : item.ejes.valor === 'indefinido' ? INDEFINIDO[clave(item)] : '';
  if (norm(esperada) !== norm(item.respuesta)) {
    push('respuesta-no-cuadra', `declara «${item.ejes.valor}» en ${item.ejes.gen}/${item.ejes.num}, que da «${esperada}», y la respuesta es «${item.respuesta}»`);
  }
  if (item.ejes.valor === 'ninguno' && item.respuesta !== '') {
    push('eje-mal-declarado', 'declara «ninguno» y trae una forma');
  }
  return out;
}

export function tasasCiegasA(items: ItemArticulo[]) {
  const n = items.length || 1;
  const acierta = (f: (i: ItemArticulo) => string) => items.filter((i) => norm(f(i)) === norm(i.respuesta)).length / n;
  return {
    siempreDefinido: acierta(rutaDefinido),
    siempreIndefinido: acierta(rutaIndefinido),
    siempreNinguno: acierta(rutaNinguno),
  };
}

export function coberturaArticulo(items: ItemArticulo[]): Cobertura[] {
  const n = items.length;
  const porValor = (v: ValorArticulo) => items.filter((i) => i.ejes.valor === v).length;
  return [
    { comprobacion: 'la respuesta contra el eje declarado', decididos: n, total: n },
    { comprobacion: 'las tres rutas ciegas', decididos: n, total: n },
    { comprobacion: 'el valor «definido» está representado', decididos: porValor('definido'), total: n,
      motivoDeLosQueQuedanFuera: 'los otros dos valores no lo examinan' },
    { comprobacion: 'el valor «indefinido» está representado', decididos: porValor('indefinido'), total: n,
      motivoDeLosQueQuedanFuera: 'los otros dos valores no lo examinan' },
    { comprobacion: 'el valor «ninguno» está representado', decididos: porValor('ninguno'), total: n,
      motivoDeLosQueQuedanFuera: 'los otros dos valores no lo examinan' },
  ];
}

export function revisarLoteA(items: ItemArticulo[]): FalloA[] {
  const out: FalloA[] = items.flatMap(revisarArticulo);
  out.push(...revisarCobertura(coberturaArticulo(items)).map((f) => ({ item: f.item, clase: f.clase as ClaseFalloA, detalle: f.detalle })));

  // El orden, en el eje que más separa: «lleva artículo o no».
  const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.valor !== 'ninguno'));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «lleva artículo» se predice por la POSICIÓN: ${sep}` });

  const t = tasasCiegasA(items);
  for (const [nombre, valor] of [
    ['poner siempre el definido', t.siempreDefinido],
    ['poner siempre el indefinido', t.siempreIndefinido],
    ['no poner ninguno nunca', t.siempreNinguno],
  ] as const) {
    if (valor > TECHO_A + 1e-9) {
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `«${nombre}» acierta el ${(100 * valor).toFixed(0)} %, por encima del ${(100 * TECHO_A).toFixed(0)} % que es el azar de un eje de TRES valores` });
    }
  }

  const vistos = new Map<string, string>();
  for (const it of items) {
    const k = norm(it.latin);
    const antes = vistos.get(k);
    if (antes) out.push({ item: it.id, clase: 'repetido', detalle: `misma frase latina que «${antes}»` });
    else vistos.set(k, it.id);
  }
  return out;
}

// scripts/lib/gate-cantidad-fonemica.ts — EL GATE DE LA CANTIDAD FONÉMICA.
//
// Punto `l1-cantidad-fonemica`. `varia`: «qué vocal lleva la cantidad y en
// qué sílaba, y si el par es léxico (malus) o morfológico (venit)».
//
// ══ EL SUELO QUE PONE LA LENGUA, Y AQUÍ ES EXACTAMENTE LA MITAD ══════
//
// Cada par tiene DOS miembros y uno de ellos se escribe sin mácrón. Quien
// no ponga nunca un mácrón acierta el 50 % sin saber nada, y quien lo
// ponga siempre acierta el otro 50 %. **No hay margen**: las dos
// estrategias son complementarias y el máximo nunca baja de la mitad.
//
// Así que el umbral NO se pone sobre las tasas —sería imposible de
// cumplir, como ya pasó con el acento— sino sobre el EQUILIBRIO, y va
// absoluto: mitad de respuestas con mácrón y mitad sin él, ±0,15. Una
// cifra medida no entra nunca en la condición.
//
// ══ LOS DOS TIPOS NO SE BUSCAN POR SEPARADO: SALEN ═══════════════════
//
// Un par es MORFOLÓGICO si sus dos miembros vienen del mismo lema y LÉXICO
// si vienen de lemas distintos. Medido sobre las 2.835 formas del dominio:
// **61 pares, 51 morfológicos y 10 léxicos**, y los léxicos son casi todos
// la familia `lēx`/`legō` —`lēge`/`lege`, `lēgēs`/`legēs`, `lēgī`/`legī`,
// `lēgis`/`legis`— más `mīseram`/`miseram`, `īs`/`is` y `nē`/`ne`.
//
// El léxico es más caro que el morfológico y el lote tiene que traer los
// dos: en el morfológico basta con saber la casilla; en el léxico hay que
// saber además de qué palabra viene.
import { paresDeCantidad, parDe, type ParDeCantidad, type TipoDePar } from '../../lib/data/languages/la/pares-de-cantidad';
import atestacion from '../../lib/data/languages/la/atestacion-l1.json';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u');

const CONGELADO = (atestacion as { lemas: Record<string, Record<string, { forma: string; n: number }>> }).lemas;

/** ¿Cuántas veces aparece esta forma exacta en el corpus? La evidencia
 *  congelada guarda la forma CON mácrones, así que se compara con ellos:
 *  preguntar sin cantidad devolvería la suma de los dos miembros del par,
 *  que es justamente lo que este punto distingue. */
export function vecesEnElCorpus(forma: string): number {
  let n = 0;
  for (const celdas of Object.values(CONGELADO))
    for (const c of Object.values(celdas))
      if (c.forma.normalize('NFC') === forma.normalize('NFC')) n = Math.max(n, c.n);
  return n;
}

export interface ItemCantidad {
  id: string;
  punto: string;
  /** La cadena como la vería quien no mira los mácrones. */
  sinMacrones: string;
  /** El miembro que el ítem pide, CON su cantidad marcada. */
  respuesta: string;
  /** El otro miembro, que es lo que el alumno escribe si se equivoca. */
  elOtro: string;
  marco: string;
  pista: string;
  glosa: string;
  ejes: {
    tipo: TipoDePar;
    /** La vocal que lleva la cantidad y su posición en la palabra. */
    vocal: string;
    /** Si **la vocal que distingue** es larga en esta respuesta. Es el eje
     *  del equilibrio, y NO es «lleva algún mácrón»: `legēs` (futuro de
     *  `legō`) tiene una `ē` en la desinencia, pero la vocal que lo separa
     *  de `lēgēs` es la PRIMERA, y ahí es breve. Medir «lleva alguno»
     *  clasificaba ese ítem al revés y descuadraba el equilibrio del lote
     *  sin que se notara. */
    dianaLarga: boolean;
  };
}

export type ClaseFalloCant =
  | 'no-es-par'
  | 'respuesta-no-es-miembro'
  | 'el-otro-mal'
  | 'eje-mal-declarado'
  | 'sin-atestiguar'
  | 'pista-regala-la-forma'
  | 'marco-fuera-de-l1'
  | 'marco-mal'
  | 'varia-incompleto'
  | 'suelo-de-la-lengua'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloCant { item: string; clase: ClaseFalloCant; detalle: string }

export function revisarItemCantidad(item: ItemCantidad): FalloCant[] {
  const out: FalloCant[] = [];
  const push = (clase: ClaseFalloCant, detalle: string) => out.push({ item: item.id, clase, detalle });

  // EL SEGUNDO CAMINO: el par tiene que existir en el dominio, no en la
  // cabeza de quien escribió el ítem.
  const par: ParDeCantidad | null = parDe(item.sinMacrones);
  if (!par) { push('no-es-par', `«${item.sinMacrones}» no es un par mínimo de cantidad en el dominio`); return out; }

  const formas = par.miembros.map((m) => m.forma.normalize('NFC'));
  if (!formas.includes(item.respuesta.normalize('NFC')))
    push('respuesta-no-es-miembro', `«${item.respuesta}» no es uno de los miembros: son ${formas.join(', ')}`);
  if (!formas.includes(item.elOtro.normalize('NFC')) || item.elOtro === item.respuesta)
    push('el-otro-mal', `«${item.elOtro}» no es el OTRO miembro de «${item.sinMacrones}»`);

  if (par.tipo !== item.ejes.tipo) push('eje-mal-declarado', `declara ${item.ejes.tipo} y el par es ${par.tipo}`);
  if (sinM(par.vocal) !== sinM(item.ejes.vocal)) push('eje-mal-declarado', `declara la vocal «${item.ejes.vocal}» y la cantidad va en «${par.vocal}»`);
  // La vocal DIANA, en la posición donde los dos miembros difieren.
  const diana = item.respuesta.normalize('NFC')[par.posicion];
  const larga = diana !== undefined && /[āēīōūȳ]/.test(diana);
  if (larga !== item.ejes.dianaLarga)
    push('eje-mal-declarado', `declara dianaLarga=${item.ejes.dianaLarga} y la vocal que distingue («${diana}», posición ${par.posicion}) ${larga ? 'sí' : 'no'} es larga`);

  // Las DOS formas tienen que existir en el corpus: un par cuyo otro
  // miembro no aparezca no es un par, es una forma sola con una variante
  // inventada al lado.
  for (const [qué, f] of [['la respuesta', item.respuesta], ['el otro miembro', item.elOtro]] as const)
    if (vecesEnElCorpus(f) === 0) push('sin-atestiguar', `${qué} «${f}» no aparece en el corpus`);

  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa]] as const)
    if (txt.normalize('NFC').toLowerCase().includes(item.respuesta.normalize('NFC').toLowerCase()))
      push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  // El marco no puede llevar NINGUNO de los dos miembros: con el otro
  // delante, el ítem se contesta por descarte.
  const marco = item.marco.normalize('NFC').toLowerCase();
  for (const f of formas)
    if (marco.replace('___', ' ').includes(f.toLowerCase()))
      push('pista-regala-la-forma', `el marco lleva «${f}», que es uno de los dos miembros`);
  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  return out;
}

export function coberturaCantidad(items: ItemCantidad[]): Cobertura[] {
  const n = items.length;
  const lexicos = items.filter((i) => i.ejes.tipo === 'lexico').length;
  const vocales = new Set(items.map((i) => sinM(i.ejes.vocal)));
  return [
    { comprobacion: 'el par existe en el dominio', decididos: n, total: n },
    { comprobacion: 'los DOS miembros están atestiguados', decididos: n, total: n },
    { comprobacion: 'el par es LÉXICO, no sólo morfológico', decididos: lexicos, total: n,
      motivoDeLosQueQuedanFuera: 'de los 61 pares del dominio sólo 10 son léxicos; en el morfológico basta con saber la casilla y en el léxico hay que saber además de qué palabra viene' },
    { comprobacion: 'qué vocal lleva la cantidad', decididos: vocales.size, total: 5,
      motivoDeLosQueQuedanFuera: 'el varia nombra la vocal: cinco posibles, y el dominio no tiene pares en todas' },
  ];
}

export function tasasCiegasCant(items: ItemCantidad[]) {
  const n = Math.max(1, items.length);
  return {
    nuncaMacron: items.filter((i) => !i.ejes.dianaLarga).length / n,
    siempreMacron: items.filter((i) => i.ejes.dianaLarga).length / n,
  };
}

export function revisarLoteCantidad(items: ItemCantidad[]): FalloCant[] {
  const out: FalloCant[] = items.flatMap(revisarItemCantidad);

  // EL EQUILIBRIO, ABSOLUTO. Las dos estrategias son complementarias, así
  // que pedirles a las dos que bajen del 50 % es imposible: lo que se pide
  // es que ninguna decida el lote.
  const conMacron = items.filter((i) => i.ejes.dianaLarga).length;
  const p = items.length === 0 ? 0 : conMacron / items.length;
  if (items.length > 0 && Math.abs(p - 0.5) > 0.15)
    out.push({ item: '(lote)', clase: 'suelo-de-la-lengua',
      detalle: `en el ${(100 * p).toFixed(0)} % de los ítems la vocal que distingue es larga: quien ponga el mácrón siempre —o nunca— resuelve el lote sin saber la regla` });

  if (!items.some((i) => i.ejes.tipo === 'lexico'))
    out.push({ item: '(lote)', clase: 'varia-incompleto', detalle: 'el varia distingue par léxico de morfológico y no hay ninguno léxico' });
  if (!items.some((i) => i.ejes.tipo === 'morfologico'))
    out.push({ item: '(lote)', clase: 'varia-incompleto', detalle: 'ni ninguno morfológico' });

  const repetidos = new Map<string, string>();
  for (const i of items) {
    if (repetidos.has(i.sinMacrones)) out.push({ item: i.id, clase: 'varia-incompleto', detalle: `el par «${i.sinMacrones}» ya está en ${repetidos.get(i.sinMacrones)}` });
    else repetidos.set(i.sinMacrones, i.id);
  }

  const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.dianaLarga));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «lleva mácrón» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaCantidad(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloCant, detalle: f.detalle })));
  return out;
}

export function informeCantidad(items: ItemCantidad[]): string {
  const fallos = revisarLoteCantidad(items);
  const t = tasasCiegasCant(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s) · ${paresDeCantidad().length} pares en el dominio`];
  for (const c of coberturaCantidad(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · no poner nunca mácrón ${pct(t.nuncaMacron)} · ponerlo siempre ${pct(t.siempreMacron)}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

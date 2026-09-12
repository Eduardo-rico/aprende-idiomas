// scripts/lib/gate-acento-la.ts — EL GATE DE LA REGLA DE LA PENÚLTIMA.
//
// Punto `l1-acento-penultima`. `varia`: «la longitud de la palabra y si la
// penúltima es larga por naturaleza o por posición». `excepcion`: «los
// bisílabos son siempre llanos, tenga la penúltima la cantidad que tenga».
//
// ══ EL SUELO QUE PONE LA LENGUA, MEDIDO ANTES DE ELEGIR PALABRAS ═════
//
// **El 61,5 % de las 1.429 formas de L1 llevan el acento en la penúltima.**
// Quien conteste «la penúltima» a todo, sin saber una palabra de latín,
// acierta seis de cada diez. Ese es el suelo, y un lote que copie la
// proporción de la lengua se contesta adivinando.
//
// Así que el lote **rompe la proporción a propósito**: mitad llanas y mitad
// esdrújulas. Es una distorsión declarada, no un descuido, y el gate la
// exige en vez de permitirla.
//
// ══ Y LA CATEGORÍA ESCASA, QUE ES LA QUE EXAMINA EL PUNTO ════════════
//
// La penúltima puede ser larga de dos maneras y sólo una se ve:
//
//   por NATURALEZA — el mácrón está escrito: `ha-bē-re`
//   por POSICIÓN   — no hay mácrón y la sílaba está cerrada: `ma-gis-ter`
//
// La segunda es la que refuta la estrategia de mirar sólo el mácrón, y en
// las formas atestiguadas de L1 es el **3,8 %**. Un lote que respetara esa
// proporción tendría 0,76 ítems de la única categoría que examina la mitad
// difícil del punto. El lote la sobrerrepresenta hasta el 25 %, y eso
// también va declarado.
//
// (Nota para quien venga detrás: en el inventario, el `motivo` de
// `l1-larga-por-posicion` dice que «el alumno que sólo mira el mácrón se
// equivoca en la mitad de las palabras». Medido sobre las formas
// atestiguadas de L1 son el 3,8 %, no la mitad. La afirmación del material
// no cuadra con el corpus del propio proyecto.)
//
// ══ LA TERCERA CATEGORÍA NO EXISTE, Y SE DICE ════════════════════════
//
// El descriptor habla de penúltima larga «por naturaleza», que incluye el
// diptongo. **En L1 no hay ni una sola forma con diptongo en la
// penúltima**: cero de 1.429. No es que el lote no la cubra — es que la
// categoría está vacía en el lexicón, y eso es un resultado, no un hueco.
import { acentoDe } from '../../lib/lang/ortografia-la';
import { acentoLatino } from '../voz/cuanto-duele';
import { tipoDeAcento, type TipoDeAcento } from './atestar-acento';
import atestacion from '../../lib/data/languages/la/atestacion-acento.json';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

interface Congelado { silabas: string[]; tonica: string; tipo: TipoDeAcento; n: number }
const TABLA = (atestacion as { tabla: Record<string, Congelado> }).tabla;
export const SUELO_DE_LA_PENULTIMA = (atestacion as { sueloDeLaPenultima: number }).sueloDeLaPenultima;
export const POSICION_EN_LA_LENGUA = (atestacion as { posicionSobreAtestiguadas: number }).posicionSobreAtestiguadas;

export interface ItemAcento {
  id: string;
  punto: string;
  /** La palabra macronizada. El contrato importa: sin mácrons la regla no
   *  se puede aplicar y la respuesta sería una invención confiada. */
  palabra: string;
  /** La sílaba tónica, escrita a mano. */
  respuesta: string;
  pista: string;
  glosa: string;
  ejes: {
    tipo: TipoDeAcento;
    /** Cuántas sílabas tiene. Es la otra mitad del `varia`. */
    silabas: number;
  };
}

export type ClaseFalloAc =
  | 'tonica-no-derivable'
  | 'eje-mal-declarado'
  | 'sin-atestiguar'
  | 'pista-regala-la-tonica'
  | 'sin-macron'
  | 'palabras-repetidas'
  | 'varia-incompleto'
  | 'suelo-de-la-lengua'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloAc { item: string; clase: ClaseFalloAc; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();
const LLANAS: TipoDeAcento[] = ['macron', 'diptongo', 'posicion', 'bisilabo'];

export function revisarItemAcento(item: ItemAcento): FalloAc[] {
  const out: FalloAc[] = [];
  const push = (clase: ClaseFalloAc, detalle: string) => out.push({ item: item.id, clase, detalle });

  // SIN MÁCRONS LA REGLA NO EXISTE. Es el argumento entero de la decisión
  // de macronizar el material, y aquí es una precondición del ítem.
  if (!/[āēīōūȳ]/.test(item.palabra) && !/[aeiouy]/.test(item.palabra)) {
    push('sin-macron', 'la palabra no tiene vocales');
  }

  // EL SEGUNDO CAMINO, Y SON DOS: el silabeador de `scripts/voz` da la
  // sílaba tónica, y `acentoDe` de `lib/lang` da llana/esdrújula por su
  // cuenta. Los dos tienen que estar de acuerdo con lo escrito a mano.
  const t = tipoDeAcento(item.palabra);
  if (norm(t.tonica) !== norm(item.respuesta)) {
    push('tonica-no-derivable', `la respuesta es «${item.respuesta}» y la máquina saca «${t.tonica}» de ${t.silabas.join('-')}`);
  }
  const esLlana = LLANAS.includes(t.tipo);
  const segunLib = acentoDe(item.palabra);
  if (segunLib !== null && (segunLib === 'llana') !== esLlana) {
    push('tonica-no-derivable', `«${item.palabra}»: scripts/voz dice ${t.tipo} y lib/lang dice ${segunLib}`);
  }
  if (t.tipo !== item.ejes.tipo) push('eje-mal-declarado', `declara «${item.ejes.tipo}» y la máquina dice «${t.tipo}»`);
  if (t.silabas.length !== item.ejes.silabas) push('eje-mal-declarado', `declara ${item.ejes.silabas} sílabas y son ${t.silabas.length}`);

  const congelado = TABLA[item.palabra];
  if (!congelado) push('sin-atestiguar', `«${item.palabra}» no está en la tabla congelada: no es una forma que la máquina de L1 produzca`);
  else if (congelado.n === 0) push('sin-atestiguar', `«${item.palabra}» no aparece ni una vez en el corpus`);

  // ── LA FUGA DE LA PISTA, Y POR QUÉ NO ES UN `includes` ──
  //
  // La respuesta aquí es una SÍLABA, de una o dos letras, y buscarla como
  // subcadena dentro de prosa española marca todo: la primera versión de
  // este gate rechazó «Deus» porque la pista decía «¿dónde cae el acento?»
  // y «dónde» lleva «de» dentro. Marcar la mitad de los casos es tener el
  // gate apagado. Lo que regala una sílaba es NOMBRARLA, o sea que aparezca
  // como palabra suelta o entrecomillada, y eso es lo que se busca.
  //
  // Y `\b` no sirve: no funciona con letras acentuadas, y estas sílabas van
  // llenas de mácrons.
  {
    const r = new RegExp(`(?<!\\p{L})${norm(item.respuesta).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\p{L})`, 'u');
    if (r.test(norm(item.pista))) push('pista-regala-la-tonica', `la pista nombra «${item.respuesta}» como palabra suelta`);
  }
  return out;
}

export function coberturaAcento(items: ItemAcento[]): Cobertura[] {
  const n = items.length;
  const cuenta = (tipo: TipoDeAcento) => items.filter((i) => i.ejes.tipo === tipo).length;
  const largas = items.filter((i) => i.ejes.silabas >= 4).length;
  return [
    { comprobacion: 'la tónica contra la máquina, por dos caminos', decididos: n, total: n },
    { comprobacion: 'la forma aparece en el corpus', decididos: n, total: n },
    { comprobacion: 'la penúltima larga POR POSICIÓN', decididos: cuenta('posicion'), total: n,
      motivoDeLosQueQuedanFuera: 'sólo una penúltima larga sin mácrón refuta la estrategia de mirar sólo el mácrón; en las formas atestiguadas de L1 es el 3,8 %, y el lote la sobrerrepresenta a propósito' },
    { comprobacion: 'la penúltima larga POR DIPTONGO', decididos: cuenta('diptongo'), total: n,
      elCeroEsUnResultado: 'en las 1.429 formas de L1 no hay NINGUNA con diptongo en la penúltima: la categoría está vacía en el lexicón, no sin cubrir',
      motivoDeLosQueQuedanFuera: 'la categoría no existe en el lexicón' },
    { comprobacion: 'la excepción de los bisílabos', decididos: cuenta('bisilabo'), total: n,
      motivoDeLosQueQuedanFuera: 'sólo un bisílabo puede examinar que no hay antepenúltima donde caer' },
    { comprobacion: 'palabras de 4 sílabas o más', decididos: largas, total: n,
      motivoDeLosQueQuedanFuera: 'la longitud es la otra mitad del varia: con tres sílabas el alumno puede contar sin regla' },
  ];
}

export function tasasCiegasAc(items: ItemAcento[]) {
  const n = Math.max(1, items.length);
  const acierta = (f: (i: ItemAcento) => string) => items.filter((i) => norm(f(i)) === norm(i.respuesta)).length / n;
  const s = (i: ItemAcento) => acentoLatino(i.palabra).silabas;
  return {
    // La estrategia del motor italiano, y la del castellano por defecto.
    siempreLaPenultima: acierta((i) => { const x = s(i); return x[Math.max(0, x.length - 2)]!; }),
    siempreLaAntepenultima: acierta((i) => { const x = s(i); return x[Math.max(0, x.length - 3)]!; }),
    // Mirar sólo el mácrón: si la penúltima lo lleva, es llana; si no, se
    // salta a la antepenúltima (y si no hay, se queda).
    soloElMacron: acierta((i) => {
      const x = s(i);
      if (x.length < 2) return x[0]!;
      const pen = x[x.length - 2]!;
      if (/[āēīōūȳ]/.test(pen) || x.length === 2) return pen;
      return x[x.length - 3] ?? pen;
    }),
  };
}

const MINIMO_POSICION = 3;

export function revisarLoteAcento(items: ItemAcento[]): FalloAc[] {
  const out: FalloAc[] = items.flatMap(revisarItemAcento);

  const repetidas = new Map<string, string>();
  for (const i of items) {
    if (repetidas.has(norm(i.palabra))) out.push({ item: i.id, clase: 'palabras-repetidas', detalle: `«${i.palabra}» ya está en ${repetidas.get(norm(i.palabra))}` });
    else repetidas.set(norm(i.palabra), i.id);
  }

  // ── EL SUELO DE LA LENGUA, MEDIDO DONDE HAY ELECCIÓN ──
  //
  // La proporción se lee sobre los ítems de TRES O MÁS sílabas, que son
  // donde existe la elección entre penúltima y antepenúltima. En un
  // bisílabo no hay nada que elegir —no hay antepenúltima donde caer, que
  // es justamente la excepción que el punto declara— así que meterlos en la
  // cuenta corre la proporción sin que nadie decida nada.
  const conEleccion = items.filter((i) => i.ejes.silabas >= 3);
  const llanas = conEleccion.filter((i) => LLANAS.includes(i.ejes.tipo)).length;
  const proporcion = conEleccion.length === 0 ? 0 : llanas / conEleccion.length;
  if (conEleccion.length > 0 && Math.abs(proporcion - 0.5) > 0.15) {
    out.push({ item: '(lote)', clase: 'suelo-de-la-lengua',
      detalle: `de los ${conEleccion.length} ítems donde hay elección, el ${(100 * proporcion).toFixed(0)} % es llano y la lengua ya da el ${(100 * SUELO_DE_LA_PENULTIMA).toFixed(1)} %: contestar siempre lo mismo resuelve el lote sin saber la regla` });
  }

  // La categoría que examina la mitad difícil no se mide en porcentaje: es
  // tan rara en la lengua (3,8 %) que un umbral relativo la dejaría en cero.
  const posicion = items.filter((i) => i.ejes.tipo === 'posicion').length;
  if (posicion < MINIMO_POSICION) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `sólo ${posicion} ítem(s) con la penúltima larga por POSICIÓN, y hacen falta ${MINIMO_POSICION}: son los únicos que refutan mirar sólo el mácrón` });
  if (!items.some((i) => i.ejes.tipo === 'bisilabo')) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: 'el punto declara la excepción de los bisílabos y ningún ítem la examina' });
  if (!items.some((i) => i.ejes.silabas >= 4)) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: 'el varia incluye la longitud de la palabra y no hay ninguna de 4 sílabas o más' });

  const sep = separablePorPosicion(patronDe(items, (i) => LLANAS.includes(i.ejes.tipo)));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «es llana» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaAcento(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloAc, detalle: f.detalle })));

  // ── LO QUE NO SE PUEDE PEDIR, Y ME LO ENSEÑÓ EL GATE EN ROJO ──
  //
  // La primera versión exigía que «siempre la penúltima» Y «siempre la
  // antepenúltima» quedaran las dos por debajo del 50 %. **Es imposible de
  // cumplir**: entre las palabras de tres o más sílabas las dos estrategias
  // son complementarias, una acierta donde la otra falla, y el máximo de
  // las dos nunca baja del 50 %. Un gate que no se puede pasar no mide: se
  // acaba desactivando.
  //
  // Lo que sí se puede pedir es el EQUILIBRIO, y eso ya lo comprueba
  // `suelo-de-la-lengua` justo arriba. Las dos tasas se publican como
  // medida, no como línea roja.
  return out;
}

export function informeAcento(items: ItemAcento[]): string {
  const fallos = revisarLoteAcento(items);
  const t = tasasCiegasAc(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaAcento(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · siempre la penúltima ${pct(t.siempreLaPenultima)} (la lengua da ${pct(SUELO_DE_LA_PENULTIMA)}) · siempre la antepenúltima ${pct(t.siempreLaAntepenultima)} · sólo el mácrón ${pct(t.soloElMacron)}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

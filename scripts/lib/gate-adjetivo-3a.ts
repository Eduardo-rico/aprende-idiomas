// scripts/lib/gate-adjetivo-3a.ts — EL GATE DEL ADJETIVO DE LA TERCERA.
//
// Punto `l4-adjetivo-3a`. `varia`: **el número de terminaciones del
// adjetivo**. Y ese `varia` es el que obliga a escribir un gate nuevo en
// vez de reusar el de cloze derivado, que es de NOMBRES: aquí la respuesta
// depende de un adjetivo y de un nombre a la vez, y las estrategias ciegas
// que hay que medir no son las del tema sino las de la concordancia.
//
// ══ LO PRIMERO, PORQUE CAMBIA EL LOTE ENTERO ═════════════════════════
//
// Medido contra la máquina, comparando las 36 celdas de un representante
// de cada tipo (`fēlīx` · `omnis` · `ācer`):
//
//   **el número de terminaciones se ve en 6 celdas de 36**, y las seis son
//   nominativo y vocativo singular en los tres géneros.
//
// Y dentro de esas seis hay un escalón más fino que el descriptor no dice:
//
//   · `fēlīx` (UNA terminación) se separa de los otros dos en las tres:
//     m, f y n del nominativo singular son la misma palabra.
//   · `ācer` (TRES) se separa de `omnis` (DOS) **en UNA sola celda de las
//     36**: el masculino. El femenino `ācris` y el neutro `ācre` son
//     exactamente lo que da la regla de los de dos sobre el tema `ācr-`.
//
// La consecuencia es dura y hay que respetarla: un lote que «cubra el
// varia» poniendo adjetivos de los tres tipos repartidos por casillas
// cualesquiera **no examina el varia en ninguna**. Ocho ítems donde el
// rasgo diana no varía son un ítem repetido ocho veces. Por eso este gate
// mide la cobertura del `varia` sobre las celdas que pueden decidirlo, y no
// sobre el lote.
//
// ══ LAS ESTRATEGIAS CIEGAS, QUE AQUÍ NO SON LAS DEL NOMBRE ═══════════
//
//   1. **Copiar la desinencia del nombre.** Es la grande y es propia de la
//      concordancia: si el marco lleva `partium` y la respuesta es
//      `omnium`, se acierta sin saber nada mirando el final de al lado.
//      Funciona cuando el nombre es de la 3.ª y falla con uno de la 1.ª
//      (`puellārum` ≠ `omnium`), así que se mide y se acota.
//   2. **Copiar el lema.** En los de UNA terminación el nominativo
//      singular de los tres géneros ES el lema.
//   3. **La regla de los de dos aplicada a todos**: `-is` para el
//      femenino, `-e` para el neutro. Acierta en `ācris` y `ācre` y falla
//      sólo en `ācer`. Un lote sin masculino singular de `ācer` deja esta
//      estrategia al 100 % y el alumno no se entera nunca.
//   4. **El ablativo en `-ī`**, que es la otra mitad del descriptor. Se
//      examina contra el nombre de 3.ª, que hace `-e`: `in urbe` contra
//      `omnī in urbe`. Sin ese contraste el `-ī` es una desinencia más.
//
// ══ LA EXCEPCIÓN DECLARADA, Y POR QUÉ NO ES UN ADORNO ════════════════
//
// El punto declara: «los participios de presente en función verbal hacen
// ablativo en `-e` y no en `-ī`: la misma forma, dos declinaciones según la
// función». Es la excepción que el propio inventario escribe, así que el
// lote que no la examine sale rojo. `praesēns` está en el módulo justamente
// para eso.
import type { Caso, Numero } from '../../lib/data/languages/la/paradigma-la';
import { declinarAdjetivo3a, ablativoEnE, type EntradaAdjetivo3a, type GeneroAdj } from '../../lib/data/languages/la/adjetivos-3a';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export type CeldaAdj = `${GeneroAdj}.${Caso}.${Numero}`;

/** El piso de un lote de L1. Las tasas del lote no se leen por debajo:
 *  con tres ítems, uno es el 33 %. */
const PISO = 8;

export interface ItemAdjetivo3a {
  id: string;
  punto: string;
  /** El adjetivo, tal como se le enseña: lema + genitivo. */
  adjetivo: EntradaAdjetivo3a;
  celda: CeldaAdj;
  /** Escrita a mano y contrastada contra la máquina. */
  respuesta: string;
  /** La frase latina con `___`. El nombre con el que concuerda va dentro. */
  marco: string;
  /** El contexto español que fija la celda sin regalar la forma. */
  pista: string;
  /** La traducción, que es lo que el alumno lee. */
  glosa: string;
  /** El nombre con el que concuerda, TAL COMO APARECE en el marco. Va
   *  declarado para que la desinencia de abajo se pueda comprobar contra
   *  algo en vez de creerse: un marco con dos nombres se mediría contra el
   *  que no toca. */
  nombreEnElMarco: string;
  /** La TERMINACIÓN VISIBLE de ese nombre: lo que se llevaría quien copie
   *  el final, que no siempre es la desinencia del gramático.
   *
   *  La distinción no es un matiz y la cazó el propio gate: declaré `-s`
   *  para `Rēx` —que es la desinencia de verdad, porque `rēx` es `rēg` + `s`—
   *  y la forma escrita acaba en `x`. Un alumno no copia morfemas, copia
   *  letras. Lo mismo con `frāter` (`-er`, aunque el tema sea `frātr-`) y
   *  con `tempus` (`-us`, aunque el tema sea `tempor-`).
   *
   *  El gate lo comprueba contra la forma declarada del marco, así que una
   *  terminación inventada no pasa. */
  desinenciaDelNombre: string;
  ejes: {
    /** Cuántas terminaciones tiene el adjetivo. Se contrasta con el módulo. */
    terminaciones: 1 | 2 | 3;
    /** Qué examina el ítem. `terminaciones` sólo vale en nom/voc singular;
     *  declararlo en otra celda es declarar que se mide algo invariante. */
    examina: 'terminaciones' | 'ablativo-i' | 'tema-en-i' | 'participio-e';
    /** Declarado por el autor: la función del participio, cuando la hay.
     *  Es lo que separa `praesentī` de `praesente` y no se deriva de la
     *  forma, que es la misma palabra. */
    funcion?: 'adjetiva' | 'verbal';
  };
}

export type ClaseFalloA =
  | 'respuesta-no-derivable'
  | 'eje-mal-declarado'
  | 'examina-celda-invariante'
  | 'pista-regala-la-forma'
  | 'marco-mal'
  | 'copiar-la-desinencia-del-nombre'
  | 'estrategia-ciega'
  | 'sin-excepcion'
  | 'varia-incompleto'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloA { item: string; clase: ClaseFalloA; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();
const parte = (c: CeldaAdj) => c.split('.') as [GeneroAdj, Caso, Numero];

/** Las celdas donde el número de terminaciones cambia la forma. Medido, no
 *  supuesto: se compara un representante de cada tipo. */
export const CELDAS_QUE_DISTINGUEN_EL_TIPO: CeldaAdj[] =
  (['nom', 'voc'] as Caso[]).flatMap((c) => (['m', 'f', 'n'] as GeneroAdj[]).map((g) => `${g}.${c}.sg` as CeldaAdj));

/** La estrategia 3: el de dos terminaciones aplicado a cualquiera. */
export function reglaDeLosDeDos(e: EntradaAdjetivo3a, g: GeneroAdj, caso: Caso, num: Numero): string {
  const tema = e.genitivo.normalize('NFC').replace(/is$/, '');
  if (num === 'sg' && (caso === 'nom' || caso === 'voc')) return g === 'n' ? `${tema}e` : `${tema}is`;
  return declinarAdjetivo3a(e, g, caso, num);
}

export function revisarItemAdjetivo(item: ItemAdjetivo3a): FalloA[] {
  const out: FalloA[] = [];
  const push = (clase: ClaseFalloA, detalle: string) => out.push({ item: item.id, clase, detalle });
  const [g, c, n] = parte(item.celda);

  // EL SEGUNDO CAMINO: la respuesta a mano contra la que deriva la máquina.
  // El participio en función verbal es el único que no pasa por aquí,
  // porque su ablativo NO es el que deriva la tabla — que es justamente lo
  // que el punto enseña.
  const esParticipioVerbal = item.ejes.examina === 'participio-e' && item.ejes.funcion === 'verbal';
  const derivada = esParticipioVerbal ? ablativoEnE(item.adjetivo) : declinarAdjetivo3a(item.adjetivo, g, c, n);
  if (norm(derivada) !== norm(item.respuesta)) {
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina deriva «${derivada}»`);
  }
  if (esParticipioVerbal && c !== 'abl') {
    push('eje-mal-declarado', `declara participio en función verbal y la celda es ${item.celda}: la excepción es del ablativo`);
  }

  if (item.ejes.terminaciones !== item.adjetivo.terminaciones) {
    push('eje-mal-declarado', `declara ${item.ejes.terminaciones} terminaciones y «${item.adjetivo.lema}» tiene ${item.adjetivo.terminaciones}`);
  }

  // DECLARAR QUE SE EXAMINA EL VARIA EN UNA CELDA DONDE NO VARÍA es la
  // forma exacta de inflar la cobertura sin contenido.
  if (item.ejes.examina === 'terminaciones' && !CELDAS_QUE_DISTINGUEN_EL_TIPO.includes(item.celda)) {
    push('examina-celda-invariante',
      `declara examinar el número de terminaciones en ${item.celda}, y ahí los tres tipos dan la misma desinencia: el ítem no puede decidirlo`);
  }

  // LA ESTRATEGIA GRANDE DE LA CONCORDANCIA: ponerle al adjetivo la misma
  // desinencia que lleva el nombre de al lado.
  //
  // ── LA PRIMERA VERSIÓN ERA UN HEURÍSTICO DE SUFIJO Y SOBRABA ──
  //
  // Preguntaba si la respuesta ACABA en la desinencia del nombre, y eso
  // marca `ācris` junto a `mēns` porque las dos acaban en `-s`. Pero un
  // alumno que copie la desinencia de `mēns` escribe *`ācrs`, no `ācris`:
  // ahí no hay atajo, hay una letra compartida. Un gate que marca la mitad
  // de los casos es un gate apagado, así que se enuncia la estrategia
  // EXACTA en vez de un parecido: **tema del adjetivo + desinencia del
  // nombre**, y se compara con la respuesta. Sin umbral que ajustar.
  //
  //   partium  → omn + ium  = omnium   ES la respuesta → atajo
  //   marī     → omn + ī    = omnī     ES la respuesta → atajo
  //   mēns     → ācr + s    = ācrs     no lo es        → no hay atajo
  //   puellārum→ omn + ārum = omnārum  no lo es        → no hay atajo
  const temaAdj = item.adjetivo.genitivo.normalize('NFC').replace(/is$/, '');
  if (item.desinenciaDelNombre.length > 0 && norm(temaAdj + item.desinenciaDelNombre) === norm(item.respuesta)) {
    push('copiar-la-desinencia-del-nombre',
      `«${item.respuesta}» es el tema «${temaAdj}» más la desinencia «${item.desinenciaDelNombre}» del nombre del marco: se acierta copiándola`);
  }

  // EL NOMBRE DECLARADO, CONTRA EL MARCO: si no está, la desinencia que se
  // declara no es de este ítem.
  if (!item.marco.includes(item.nombreEnElMarco)) {
    push('eje-mal-declarado', `declara concordar con «${item.nombreEnElMarco}» y esa forma no está en el marco`);
  } else if (!item.nombreEnElMarco.normalize('NFC').endsWith(item.desinenciaDelNombre.normalize('NFC'))) {
    push('eje-mal-declarado', `declara la desinencia «${item.desinenciaDelNombre}» y «${item.nombreEnElMarco}» no acaba en ella`);
  }

  // Ni la pista, ni la glosa, ni el marco llevan la forma dentro.
  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa], ['el marco', item.marco]] as const) {
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  }
  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');
  // Y el marco no puede llevar OTRA forma del mismo adjetivo.
  const tema = norm(item.adjetivo.genitivo).replace(/is$/, '');
  if (tema.length >= 3 && norm(item.marco).replace('___', '').includes(tema)) {
    push('pista-regala-la-forma', `el marco lleva otra forma del mismo adjetivo (tema «${tema}»)`);
  }
  return out;
}

/** Sobre cuántos ítems decide de verdad cada comprobación. */
export function coberturaAdjetivo(items: ItemAdjetivo3a[]): Cobertura[] {
  const n = items.length;
  const enCeldaQueDistingue = items.filter((i) => CELDAS_QUE_DISTINGUEN_EL_TIPO.includes(i.celda)).length;
  const masculinoDeTres = items.filter((i) => i.ejes.terminaciones === 3 && i.celda.startsWith('m.') && i.celda.endsWith('.sg')
    && (i.celda.includes('.nom.') || i.celda.includes('.voc.'))).length;
  const ablativos = items.filter((i) => i.celda.includes('.abl.')).length;
  const participios = items.filter((i) => i.ejes.funcion !== undefined).length;
  return [
    { comprobacion: 'la respuesta contra la máquina', decididos: n, total: n },
    { comprobacion: 'copiar la desinencia del nombre', decididos: n, total: n },
    { comprobacion: 'el número de terminaciones', decididos: enCeldaQueDistingue, total: n,
      motivoDeLosQueQuedanFuera: 'sólo el nominativo y el vocativo singular distinguen los tres tipos: en las otras 30 celdas de 36 la desinencia es la misma y el ítem no puede decidirlo' },
    { comprobacion: 'la regla de los de dos aplicada a los de tres', decididos: masculinoDeTres, total: n,
      motivoDeLosQueQuedanFuera: '«ācris» y «ācre» son exactamente lo que da esa regla: sólo el masculino singular de un adjetivo de tres terminaciones la refuta' },
    { comprobacion: 'el ablativo en -ī contra el -e del nombre', decididos: ablativos, total: n,
      motivoDeLosQueQuedanFuera: 'sólo un ítem de ablativo singular puede examinarlo' },
    { comprobacion: 'la función del participio', decididos: participios, total: n,
      motivoDeLosQueQuedanFuera: 'sólo los ítems de participio declaran función; en un adjetivo corriente la pregunta no existe' },
  ];
}

/** Las tasas ciegas del lote, CADA UNA CON SU DENOMINADOR.
 *
 *  Sin denominador esta medida miente por construcción, y se vio aquí: la
 *  «regla de los de dos» coincide con la respuesta buena en las 30 celdas
 *  que no son nominativo ni vocativo singular, así que un lote de genitivos
 *  y dativos la daría al 100 % sin que la estrategia decidiera nada. La
 *  tasa se calcula sólo sobre los ítems donde el atajo es DISTINGUIBLE de
 *  saberse el punto, y el denominador viaja con ella. */
export interface TasaCiega { tasa: number; decididos: number; total: number }

export function tasasCiegasA(items: ItemAdjetivo3a[]) {
  const total = items.length;
  const mide = (aplica: (i: ItemAdjetivo3a) => boolean, f: (i: ItemAdjetivo3a) => string): TasaCiega => {
    const sub = items.filter(aplica);
    return { tasa: sub.length === 0 ? 0 : sub.filter((i) => norm(f(i)) === norm(i.respuesta)).length / sub.length,
             decididos: sub.length, total };
  };
  return {
    // Copiar el lema se puede intentar siempre: es una respuesta que el
    // alumno tiene delante en cualquier celda.
    copiarLema: mide(() => true, (i) => i.adjetivo.lema),
    // La regla de los de dos sólo se distingue de lo correcto en el
    // nominativo y el vocativo singular.
    reglaDeDos: mide((i) => CELDAS_QUE_DISTINGUEN_EL_TIPO.includes(i.celda),
      (i) => { const [g, c, nu] = parte(i.celda); return reglaDeLosDeDos(i.adjetivo, g, c, nu); }),
    // Y declinar el adjetivo como un nombre de la tercera sólo se
    // distingue en el ablativo singular.
    ablativoEnE: mide((i) => i.celda.includes('.abl.') && i.celda.endsWith('.sg'), (i) => ablativoEnE(i.adjetivo)),
  };
}

/** Cuántas letras finales comparten la respuesta y el nombre del marco.
 *  No es el atajo exacto de arriba —ése construye la forma— sino el más
 *  tonto: rimar. Se mide como tasa del lote y no se veta ítem a ítem,
 *  porque dos letras compartidas son a veces inevitables y un gate que
 *  marca la mitad de los casos es un gate que nadie lee. */
export function rima(item: ItemAdjetivo3a): number {
  const a = norm(item.respuesta), b = norm(item.nombreEnElMarco);
  let k = 0;
  while (k < a.length && k < b.length && a[a.length - 1 - k] === b[b.length - 1 - k]) k++;
  return k;
}

export function revisarLoteAdjetivo(items: ItemAdjetivo3a[]): FalloA[] {
  const out: FalloA[] = items.flatMap(revisarItemAdjetivo);

  // EL `varia` NO ES «HABER MEDIDO EL NÚMERO DE TERMINACIONES»: ES HABER
  // MEDIDO LOS TRES VALORES.
  //
  // Este hueco existió y se vio en el pase adversarial: la cobertura decía
  // «7 de 13 examinan el número de terminaciones» y los siete podrían haber
  // sido del mismo tipo. Siete ítems donde el rasgo diana no varía son un
  // ítem repetido siete veces, y la cobertura los contaba como siete.
  {
    const tipos = new Set(items.filter((i) => i.ejes.examina === 'terminaciones').map((i) => i.ejes.terminaciones));
    const faltan = ([1, 2, 3] as const).filter((t) => !tipos.has(t));
    if (faltan.length > 0) out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `el varia es el número de terminaciones y el lote no lo examina en ${faltan.map((t) => `${t}`).join(' ni ')}: los ítems que dicen examinarlo son todos de ${[...tipos].join(', ')}` });
  }

  // LA EXCEPCIÓN QUE EL INVENTARIO DECLARA: si el lote no la examina, rojo.
  if (!items.some((i) => i.ejes.examina === 'participio-e' && i.ejes.funcion === 'verbal')) {
    out.push({ item: '(lote)', clase: 'sin-excepcion',
      detalle: 'el punto declara que el participio de presente en función verbal hace ablativo en -e y no en -ī, y ningún ítem lo examina' });
  }

  // EL ORDEN DE PUBLICACIÓN: que el tipo de adjetivo no se prediga por la
  // posición en el lote.
  const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.terminaciones === 2));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable',
    detalle: `el eje «adjetivo de dos terminaciones» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaAdjetivo(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloA, detalle: f.detalle })));

  const t = tasasCiegasA(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  // El umbral es el del resto de los lotes del proyecto: por encima de la
  // mitad, la estrategia decide el lote y el lote no sale. Se lee sobre los
  // ítems donde el atajo es distinguible, no sobre el lote entero.
  const rutas: [string, TasaCiega, string][] = [
    ['copiar el lema', t.copiarLema, 'responder con el nominativo masculino que se le enseña'],
    ['la regla de los de dos', t.reglaDeDos, 'poner -is para el femenino y -e para el neutro en todos'],
    ['el ablativo en -e', t.ablativoEnE, 'declinar el adjetivo como si fuera un nombre de la tercera'],
  ];
  // La rima: tasa medida, umbral declarado. Por encima de un tercio del
  // lote, el final del nombre de al lado predice el final de la respuesta
  // demasiadas veces.
  //
  // No se lee por debajo del piso, y eso lo enseñó el propio test: en un
  // lote de dos ítems, uno que rime ya es el 50 % y la tasa no significa
  // nada. Un umbral que dispara con dos casos es un umbral apagado.
  if (items.length >= PISO) {
    const riman = items.filter((i) => rima(i) >= 2).length;
    if (riman > items.length / 3) out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `en ${riman} de ${items.length} ítems la respuesta comparte 2 o más letras finales con el nombre del marco: se rima` });
  }
  for (const [nombre, r, qué] of rutas) {
    if (r.decididos > 0 && r.tasa > 0.5) out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«${nombre}» acierta ${r.decididos === 0 ? 0 : Math.round(r.tasa * r.decididos)} de los ${r.decididos} ítems donde es distinguible (${pct(r.tasa)}, ${qué}): por encima de la mitad, el lote lo decide la estrategia` });
  }
  return out;
}

/** El informe legible, para pegarlo en el commit. */
export function informeAdjetivo(items: ItemAdjetivo3a[]): string {
  const fallos = revisarLoteAdjetivo(items);
  const t = tasasCiegasA(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaAdjetivo(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  for (const [nombre, r] of [['copiar el lema', t.copiarLema], ['regla de los de dos', t.reglaDeDos], ['ablativo en -e', t.ablativoEnE]] as [string, { tasa: number; decididos: number; total: number }][])
    lineas.push(`    ciega · ${nombre}: ${pct(r.tasa)} sobre los ${r.decididos} de ${r.total} donde es distinguible`);
  lineas.push(`    ciega · rimar con el nombre del marco: ${items.filter((i) => rima(i) >= 2).length} de ${items.length} ítems`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

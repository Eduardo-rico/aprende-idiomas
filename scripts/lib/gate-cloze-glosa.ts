// scripts/lib/gate-cloze-glosa.ts
//
// EL GATE DEL «CLOZE EN LA GLOSA», reescrito después de que el latinista
// adversarial demostrara que su primera versión no medía nada.
//
// ── LO QUE PASÓ, porque es la lección y no una nota de versión ─────────
//
// La v1 comprobaba POR ÍTEM que el orden latino contradijera al español:
// sólo OSV, OVS y VOS, porque en SOV y VSO traducir en orden ya acierta.
// Parecía la mitad del punto. Era una trampa.
//
// Al vetar por ítem todo orden en que el sujeto precede al objeto, el
// lote entero queda con el objeto primero — y entonces `respuestas` es
// SIEMPRE el reverso del orden latino. Medido sobre el primer lote:
//
//     la heurística ciega «escríbelos al revés» acierta 12 de 12
//
// **Un gate por ítem que fuerza una propiedad la vuelve constante en el
// lote, y una constante es una estrategia gratis.** Maté una lectura
// ciega instalando otra, y la hice perfecta.
//
// Y no sólo no medía: enseñaba una regla falsa. Sobre los treebanks UD,
// 4.937 cláusulas con `nsubj` y `obj` explícitos en 227.300 tokens:
//
//     SOV 38,9 %  SVO 29,4 %  OSV 15,5 %  OVS 6,3 %  VOS 5,1 %  VSO 4,8 %
//     el sujeto precede al objeto en el 73,1 % del latín real
//
// El lote de la v1 entrenaba una heurística que falla en tres de cada
// cuatro frases latinas.
//
// ── LA FORMA CORRECTA: tres estrategias ciegas, derrotadas EN EL LOTE ──
//
// Un ítem aislado no puede examinar este punto: sea cual sea su orden,
// alguna regla ciega lo acierta. Lo que se examina es el LOTE, y tiene
// que derrotar a las tres a la vez:
//
//   1. **posicional** — traducir en el orden del latín.
//   2. **inversión**  — escribirlos al revés.
//   3. **pragmática** — «¿quién haría esto?». El latinista la encontró en
//      9 de 12 ítems de la v1: padre/hijo, señor/siervo, siervos/señores…
//      la respuesta correcta era el agente esperado. Preguntando sólo eso
//      se sacaba ~10 de 12, a un cara-o-cruz del ≥85 % del descriptor.
//
// El umbral es el azar: con dos candidatos por ítem, adivinar da 50 %.
// Ninguna estrategia ciega puede pasar de ahí. Eso OBLIGA a mezclar
// órdenes —incluidos SOV y SVO, los dos más frecuentes— en vez de
// prohibirlos, que es además el latín que el alumno se va a encontrar.

import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export interface PalabraGlosada {
  la: string;
  es: string;
  rol?: 'sujeto' | 'objeto' | 'verbo';
  /** Género y número DE LA GLOSA ESPAÑOLA, obligatorios en sujeto y
   *  objeto: son lo que cierra la fuga morfológica. */
  gen?: 'm' | 'f';
  num?: 'sg' | 'pl';
}

export interface EjesItem {
  /** Los SEIS órdenes, con los seis representables. La v1 admitía tres y
   *  con eso hacía irrepresentable el caso que el gate debía cazar; luego
   *  admitió cinco y el comentario decía «los cinco» de seis que son.
   *  Quien juzga es la comprobación de lote, no el tipo. */
  orden: 'SOV' | 'SVO' | 'OSV' | 'OVS' | 'VSO' | 'VOS';
  conjugacion: 1 | 2 | 3 | 4;
  declinacion: '1ª' | '2ª' | '3ª' | '1ª-masc' | 'mixta';
  numero: 'sg' | 'pl';
  /** Cuál de los dos repartos espera la pragmática. `correcto` = el
   *  adivinador acierta; `falso` = se estrella; `neutro` = ninguno de los
   *  dos papeles es el esperado. Es lo ÚNICO comprobable contra el
   *  sentido común: `reversible` es prosa y no la cierra. */
  esperado: 'correcto' | 'falso' | 'neutro';
  /** Sólo para `l2-neutro-regla`: ¿resuelve la DESINENCIA quién es sujeto y
   *  quién objeto?
   *
   *  En latín el neutro tiene el nominativo y el acusativo iguales, así que
   *  una frase con un neutro y un no-neutro se resuelve por la desinencia
   *  DEL OTRO; una con dos neutros no se resuelve por ninguna desinencia y
   *  sólo queda el orden y el contexto.
   *
   *  Eso convierte a los ítems de dos neutros en un PISO: la estrategia
   *  posicional los acierta por construcción, no porque el ítem esté mal
   *  escrito. Sumarlos a la tasa ciega sin declararlos infla la fuga y hace
   *  imposible saber si el lote mide algo. Se declara y se descuenta. */
  resuelveLaDesinencia?: boolean;
}

export interface ItemClozeGlosa {
  id: string;
  punto: string;
  latin: string;
  palabras: PalabraGlosada[];
  glosa: string;
  respuestas: string[];
  /** Por qué los dos candidatos son plausibles en los dos papeles.
   *
   *  AVISO HONESTO, que el latinista tenía razón en exigir: el gate sólo
   *  comprueba que esto ESTÉ ESCRITO. Es prosa libre y nadie la lee, así
   *  que **este campo no cierra el sentido común** — lo cierra `esperado`
   *  con la tasa pragmática del lote. Se conserva porque obliga a quien
   *  escribe el ítem a pensarlo, no porque mida. */
  reversible: string;
  ejes: EjesItem;
}

export type ClaseFallo =
  | 'orden-separable'
  | 'huecos-y-respuestas'
  | 'no-reversible'
  | 'hueco-fuera-del-rol'
  | 'glosa-no-cuadra'
  | 'fuga-morfologica'
  | 'ejes-repetidos'
  | 'eje-mal-declarado'
  | 'estrategia-ciega'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloClozeGlosa { item: string; clase: ClaseFallo; detalle: string }

const HUECO = /___/g;
const norm = (s: string) => s.normalize('NFC').toLowerCase().replace(/[.,;:!?¿¡]/g, '').trim();
const papeles = (it: ItemClozeGlosa) => it.palabras.filter((p) => p.rol === 'sujeto' || p.rol === 'objeto');

/** Lo que rellenaría quien traduce en el orden del latín sin mirar una
 *  desinencia. No es una heurística sobre el texto: ejecuta la estrategia
 *  del alumno y devuelve su respuesta. */
export function respuestaPosicional(item: ItemClozeGlosa): string[] {
  const huecos = (item.glosa.match(HUECO) ?? []).length;
  return papeles(item).map((p) => p.es).slice(0, huecos);
}

/** La estrategia que la v1 de este gate instalaba sin querer. */
export function respuestaInvertida(item: ItemClozeGlosa): string[] {
  return [...respuestaPosicional(item)].reverse();
}

/** El orden REAL, leído de las palabras y no de la etiqueta. */
export function ordenReal(item: ItemClozeGlosa): string | null {
  const sig = item.palabras
    .map((p) => (p.rol === 'sujeto' ? 'S' : p.rol === 'objeto' ? 'O' : p.rol === 'verbo' ? 'V' : ''))
    .join('');
  return /^[SOV]{3}$/.test(sig) ? sig : null;
}

const aciertaCon = (item: ItemClozeGlosa, r: string[]) => {
  const a = r.map(norm), b = item.respuestas.map(norm);
  return a.length === b.length && a.length > 0 && a.every((x, i) => x === b[i]);
};

/** Lo que saca cada estrategia ciega sobre el lote, en tanto por uno. */
export function tasasCiegas(items: ItemClozeGlosa[]) {
  const n = items.length || 1;
  const pos = items.filter((it) => aciertaCon(it, respuestaPosicional(it))).length / n;
  const inv = items.filter((it) => aciertaCon(it, respuestaInvertida(it))).length / n;
  const prag = items.reduce((a, it) =>
    a + (it.ejes.esperado === 'correcto' ? 1 : it.ejes.esperado === 'neutro' ? 0.5 : 0), 0) / n;
  return { posicional: pos, inversion: inv, pragmatica: prag };
}

/** El azar con dos candidatos. Ninguna estrategia ciega puede superarlo. */
export const TECHO_CIEGO = 0.5;

/** EL PISO QUE PONE LA LENGUA, y sólo para UNA de las tres rutas.
 *
 *  Cuando la desinencia no resuelve —dos neutros—, lo único que queda para
 *  decidir quién es sujeto es la SEMÁNTICA: «la guerra destruye el templo» y
 *  no al revés. Así que esos ítems los gana la ruta PRAGMÁTICA por
 *  construcción, y exigirle el 50 % del azar daría por fugado un lote
 *  correcto.
 *
 *      piso pragmático = (ítems que la desinencia no resuelve)
 *                        + 0,5 · (los que sí)
 *
 *  LAS OTRAS DOS RUTAS NO SE TOCAN. La posicional no gana nada por que haya
 *  dos neutros: sólo gana si el orden se parece al español, y eso sí es una
 *  fuga de diseño. Aplicarle el piso a las tres —como hacía la primera
 *  versión de esta función— habría subido el listón justo donde no debía y
 *  dejado pasar el orden español gratis. */
export function pisoPragmatico(items: ItemClozeGlosa[]): number | null {
  if (!items.some((it) => it.ejes.resuelveLaDesinencia !== undefined)) return null;
  const n = items.length || 1;
  const sinResolver = items.filter((it) => it.ejes.resuelveLaDesinencia === false).length;
  return (sinResolver + TECHO_CIEGO * (n - sinResolver)) / n;
}

export function revisarClozeGlosa(item: ItemClozeGlosa): FalloClozeGlosa[] {
  const out: FalloClozeGlosa[] = [];
  const push = (clase: ClaseFallo, detalle: string) => out.push({ item: item.id, clase, detalle });

  const huecos = (item.glosa.match(HUECO) ?? []).length;
  if (huecos === 0) push('huecos-y-respuestas', 'la glosa no tiene ningún hueco `___`');
  if (huecos !== item.respuestas.length) push('huecos-y-respuestas', `${huecos} huecos y ${item.respuestas.length} respuestas`);

  const enItem = item.palabras.map((p) => norm(p.la)).join(' ');
  const enFrase = norm(item.latin).split(/\s+/).join(' ');
  if (enItem !== enFrase) {
    push('glosa-no-cuadra', `las palabras glosadas no reconstruyen la frase: «${enItem}» contra «${enFrase}»`);
  }

  if (!item.reversible || item.reversible.trim().length < 20) {
    push('no-reversible', 'sin declarar por qué los dos candidatos son plausibles en los dos papeles');
  }

  const roles = papeles(item);
  if (roles.length < 2) {
    push('hueco-fuera-del-rol', 'el ítem no declara DOS palabras con rol de sujeto y objeto: sin las dos no hay ambigüedad que resolver');
  }
  const esp = item.respuestas.map(norm);
  const rolesEs = new Set(roles.map((p) => norm(p.es)));
  for (const r of new Set(esp)) {
    if (!rolesEs.has(r)) push('hueco-fuera-del-rol', `la respuesta «${r}» no es ninguna palabra con rol`);
  }

  const sinRasgos = roles.filter((p) => !p.gen || !p.num);
  if (sinRasgos.length > 0) {
    push('fuga-morfologica', `sin género/número en ${sinRasgos.map((p) => `«${p.es}»`).join(', ')}`);
  } else if (roles.length >= 2 && new Set(roles.map((p) => `${p.gen}${p.num}`)).size > 1) {
    push('fuga-morfologica',
      `los candidatos no comparten género y número (${roles.map((p) => `«${p.es}» ${p.gen}/${p.num}`).join(', ')}): el artículo, el adjetivo o el clítico reparten los huecos SIN latín`);
  }

  const real = ordenReal(item);
  if (real && real !== item.ejes.orden) {
    push('eje-mal-declarado', `declara orden ${item.ejes.orden} y la frase es ${real}`);
  }
  return out;
}

/** Sobre cuántos ítems decide de verdad cada comprobación de este gate. */
export function coberturaGlosa(items: ItemClozeGlosa[]): Cobertura[] {
  const n = items.length;
  const conDosPapeles = items.filter((i) => papeles(i).length >= 2).length;
  return [
    { comprobacion: 'las tres estrategias ciegas', decididos: n, total: n },
    { comprobacion: 'la fuga morfológica', decididos: conDosPapeles, total: n,
      motivoDeLosQueQuedanFuera: conDosPapeles < n ? 'sin dos papeles no hay dos candidatos que el artículo pueda repartir' : undefined },
    { comprobacion: 'el orden declarado contra los datos', decididos: items.filter((i) => ordenReal(i) !== null).length, total: n,
      motivoDeLosQueQuedanFuera: 'una frase sin los tres papeles no tiene orden que leer' },
  ];
}

export function revisarLote(items: ItemClozeGlosa[]): FalloClozeGlosa[] {

  const out: FalloClozeGlosa[] = items.flatMap(revisarClozeGlosa);
  // ── EL ORDEN DE PUBLICACIÓN, QUE NINGÚN GATE DE LATÍN MIRABA ──
  //
  // `separablePorPosicion` está en el repositorio desde portugués y
  // ninguno de los cinco gates nuevos lo llamaba: cuatro de los cinco
  // lotes se resolvían al 100 % contando ejercicios. Un detector que
  // existe y no se llama es peor que no tenerlo, porque da sensación de
  // cobertura.
  {
    const sep = separablePorPosicion(patronDe(items, (i) => ['SOV', 'SVO', 'VSO'].includes(i.ejes.orden)));
    if (sep) out.push({ item: '(lote)', clase: 'orden-separable' as ClaseFallo,
      detalle: `el eje «el sujeto va delante» se predice por la POSICIÓN: ${sep}` });
  }
  out.push(...revisarCobertura(coberturaGlosa(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFallo, detalle: f.detalle })));

  // ── LO QUE SÓLO SE VE EN EL LOTE ──
  const t = tasasCiegas(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const pisoPrag = pisoPragmatico(items);
  for (const [nombre, valor, glosa, limite, comoSeLlama] of [
    ['posicional', t.posicional, 'traducir en el orden del latín', TECHO_CIEGO, 'del azar'],
    ['inversión', t.inversion, 'escribir los dos nombres al revés', TECHO_CIEGO, 'del azar'],
    ['pragmática', t.pragmatica, 'preguntar «¿quién haría esto?»',
      pisoPrag ?? TECHO_CIEGO, pisoPrag === null ? 'del azar' : 'del piso que pone la lengua'],
  ] as const) {
    if (valor > limite + 1e-9) {
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `la estrategia ${nombre} —${glosa}— acierta el ${pct(valor)} del lote, por encima del ${pct(limite)} ${comoSeLlama}: el lote se resuelve sin leer una desinencia` });
    }
  }

  // La clave de unicidad NO lleva la conjugación: este punto examina la
  // desinencia del NOMBRE, así que cambiar `videt` por `dūcit` no cambia
  // ninguna operación del alumno. Incluirla aprobaba `la-fpd-03` y
  // `la-fpd-10`, que eran el mismo ítem con otro verbo.
  const vistos = new Map<string, string>();
  for (const it of items) {
    const par = papeles(it).map((p) => norm(p.la)).join('+');
    const k = `${it.ejes.orden}|${it.ejes.declinacion}|${it.ejes.numero}|${par}`;
    const antes = vistos.get(k);
    if (antes) out.push({ item: it.id, clase: 'ejes-repetidos', detalle: `mismo ítem que «${antes}» desde el alumno (${k})` });
    else vistos.set(k, it.id);
  }
  return out;
}

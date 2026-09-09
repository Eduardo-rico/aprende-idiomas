// scripts/lib/gate-conjugar.ts
//
// GATE DE CONJUGAR UNA FORMA. Sirve a `l5-presente` y a `l5-imperfecto`, que
// examinan lo mismo con tiempos distintos: producir la forma de una persona.
//
// ── LOS DOS SON `regalo`, Y ESO CAMBIA QUÉ HAY QUE VIGILAR ───────────
//
// El hispanohablante conjuga desde niño: la OPERACIÓN transfiere entera y no
// hay que enseñarla. Lo que no transfiere son las desinencias concretas y,
// sobre todo, **de qué clase es cada verbo**, porque la desinencia depende
// de eso y el alumno no lo lee en el infinitivo si no mira la cantidad.
//
// Así que la ruta ciega que importa no es «contestar siempre lo mismo» —eso
// no lo hace nadie que sepa conjugar— sino **aplicar la clase equivocada**:
// tratar un verbo de 3.ª como si fuera de 2.ª. Si el lote no trae verbos de
// varias clases, esa ruta no se puede ni medir.
//
// ── EL VARIA DEL IMPERFECTO, VERIFICADO ──────────────────────────────
//
// «El infijo es `-bā-` en la 1.ª y la 2.ª y `-ēbā-` en las otras tres.»
// Comprobado contra la máquina: `amābam`, `monēbam` frente a `legēbam`,
// `audiēbam`, `capiēbam`. El lote tiene que traer los dos infijos o su eje
// no existe.
import { conjugar, esMixta, type EntradaVerbal, type Persona, type Tiempo } from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

export type ClaseVerbal = '1ª' | '2ª' | '3ª' | '4ª' | 'mixta';

export function claseDe(v: EntradaVerbal): ClaseVerbal {
  if (esMixta(v)) return 'mixta';
  const i = v.infinitivo.normalize('NFC');
  if (i.endsWith('āre')) return '1ª';
  if (i.endsWith('ēre')) return '2ª';
  if (i.endsWith('īre')) return '4ª';
  return '3ª';
}

/** El infijo del imperfecto.
 *
 *  NO SE PUEDE LEER DE LA FORMA, y eso es un hecho del punto y no una
 *  limitación de esta función. `monēbam` (2.ª) contiene la cadena «ēba»
 *  igual que `legēbam` (3.ª), porque en el primero la `ē` es la vocal del
 *  tema y en el segundo es parte del infijo. La superficie es idéntica y la
 *  segmentación depende de la CLASE.
 *
 *      monē + bam        el infijo es «-bā-»
 *      leg  + ēbam       el infijo es «-ēbā-»
 *
 *  La primera versión de esta función buscaba «ēba» en la cadena y clasificó
 *  `monēbam` como infijo largo. El test lo cazó. Es la misma figura del
 *  `capere`/`legere` del punto anterior: la forma no dice la clase, la clase
 *  dice la forma. */
export function infijoDelImperfecto(v: EntradaVerbal): 'bā' | 'ēbā' {
  const c = claseDe(v);
  return c === '1ª' || c === '2ª' ? 'bā' : 'ēbā';
}

/** El tema es el prefijo común a las SEIS personas de ese tiempo; lo que
 *  sobra es la desinencia de la clase. Separarlos así permite preguntar
 *  «¿qué pasaría si este verbo llevara la desinencia de aquella clase?», que
 *  es la única ruta ciega que un hispanohablante recorre de verdad. */
export function temaYDesinencia(v: EntradaVerbal, p: Persona, t: Tiempo): { tema: string; desinencia: string } {
  const todas = (['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'] as Persona[])
    .map((x) => conjugar(v, x, t).normalize('NFC'));
  let i = 0;
  while (i < Math.min(...todas.map((f) => f.length)) && todas.every((f) => f[i] === todas[0]![i])) i++;
  const forma = conjugar(v, p, t).normalize('NFC');
  return { tema: forma.slice(0, i), desinencia: forma.slice(i) };
}

// ── LA RUTA CIEGA DEL IMPERFECTO ES OTRA, Y HAY QUE DECIRLO ──────────
//
// En el presente la clase se ve en la DESINENCIA —«amās» contra «legis»—, y
// la ruta «poner la desinencia de otra clase» se mide con `temaYDesinencia`.
//
// En el imperfecto no: la desinencia de persona es **idéntica en las cinco
// clases** («-m, -s, -t, -mus, -tis, -nt») y lo que cambia es el infijo, que
// el prefijo común a las seis personas se traga. Medido: la separación da
// «legēb + am», «audiēb + am», «monēb + am» — todas con la misma desinencia,
// así que esa ruta devolvía el 100 % y no medía nada.
//
// La ruta que sí recorre un alumno aquí es más simple y más real: **quitarle
// el `-re` al infinitivo y pegarle la desinencia**. Es lo que funciona en la
// 1.ª y la 2.ª y falla en las otras tres:
//
//     amāre  → amā  + bam = amābam     ✓
//     monēre → monē + bam = monēbam    ✓
//     legere → lege + bam = legebam    ✗  (es «legēbam»: cantidad)
//     audīre → audī + bam = audībam    ✗  (es «audiēbam»)
//     capere → cape + bam = capebam    ✗  (es «capiēbam»)

const DESINENCIA_IMPERFECTO: Record<Persona, string> = {
  '1sg': 'm', '2sg': 's', '3sg': 't', '1pl': 'mus', '2pl': 'tis', '3pl': 'nt',
};

/** Lo que produce quien le quita el `-re` al infinitivo y pega «-ba-». */
export function imperfectoIngenuo(v: EntradaVerbal, p: Persona): string {
  const tema = v.infinitivo.normalize('NFC').replace(/re$/, '');
  // La vocal del infijo se abrevia ante -m, -t y -nt finales, que es la ley
  // de la brevis brevians: «amābam» pero «amābāmus».
  const infijo = p === '1sg' || p === '3sg' || p === '3pl' ? 'ba' : 'bā';
  return tema + infijo + DESINENCIA_IMPERFECTO[p];
}

export interface ItemConjugar {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  persona: Persona;
  tiempo: Tiempo;
  /** El marco SIN macrones. */
  marco: string;
  /** La forma CON cantidad. */
  respuesta: string;
  glosa: string;
  pista: string;
  ejes: {
    /** Declarada a mano y contrastada contra `claseDe`. */
    clase: ClaseVerbal;
  };
}

export type ClaseFalloCJ =
  | 'respuesta-no-derivada' | 'clase-mal-declarada' | 'macron-en-el-marco'
  | 'persona-sin-cubrir' | 'una-sola-clase' | 'infijo-sin-cubrir'
  | 'clase-equivocada-resuelve' | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloCJ { item: string; clase: ClaseFalloCJ; detalle: string }

const MACRON = /[āēīōūĀĒĪŌŪ]/;
const PERSONAS: Persona[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

export function revisarItemConjugar(it: ItemConjugar): FalloCJ[] {
  const out: FalloCJ[] = [];
  const push = (c: ClaseFalloCJ, d: string) => out.push({ item: it.id, clase: c, detalle: d });

  const dela = conjugar(it.verbo, it.persona, it.tiempo);
  if (dela.normalize('NFC') !== it.respuesta.normalize('NFC'))
    push('respuesta-no-derivada', `la máquina da «${dela}» y el ítem escribe «${it.respuesta}»`);
  if (MACRON.test(it.marco)) push('macron-en-el-marco', `«${it.marco}» lleva macrón`);
  if (!it.marco.includes('___')) push('respuesta-no-derivada', 'el marco no tiene hueco');

  const real = claseDe(it.verbo);
  if (real !== it.ejes.clase)
    push('clase-mal-declarada', `el ítem dice ${it.ejes.clase} y «${it.verbo.infinitivo}» es de ${real}`);

  return out;
}

export function revisarLoteConjugar(items: ItemConjugar[], opciones: {
  /** Para `l5-imperfecto`: los dos infijos son su eje. */
  exigeLosDosInfijos?: boolean;
}): { fallos: FalloCJ[]; tasaClaseEquivocada: number; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemConjugar);
  const push = (c: ClaseFalloCJ, d: string) => fallos.push({ item: '(lote)', clase: c, detalle: d });
  const n = items.length || 1;

  for (const p of PERSONAS)
    if (!items.some((it) => it.persona === p))
      push('persona-sin-cubrir', `el varia dice «la persona» y falta ${p}`);

  const clases = new Set(items.map((it) => it.ejes.clase));
  if (clases.size < 3)
    push('una-sola-clase',
      `${clases.size} clases distintas: sin varias, la ruta «aplicar la clase equivocada» no se puede ni medir, y es la única que un hispanohablante recorre de verdad`);

  if (opciones.exigeLosDosInfijos) {
    const infijos = new Set(items.map((it) => infijoDelImperfecto(it.verbo)));
    for (const i of ['bā', 'ēbā'] as const)
      if (!infijos.has(i)) push('infijo-sin-cubrir', `falta el infijo «-${i}-», y el varia del punto son los dos`);
  }

  // La ruta que importa: conjugar el verbo como si fuera de otra clase.
  //
  // LA PRIMERA VERSIÓN DE ESTO NO MEDÍA NADA. Comparaba los tres últimos
  // caracteres de la forma del verbo modelo con los de la respuesta —o sea,
  // colas de PALABRAS DISTINTAS—, así que «amās» y «legis» salían distintos
  // por ser otro verbo y no por ser otra clase. Devolvía 36 % en el presente
  // y 100 % en el imperfecto, y los dos números eran ruido.
  //
  // Ahora se hace bien: se separa el TEMA de la DESINENCIA en cada clase
  // —el tema es el prefijo común a las seis personas— y la ruta produce
  // «tema del verbo + desinencia de la clase dominante».
  const cuenta = new Map<ClaseVerbal, number>();
  for (const it of items) cuenta.set(it.ejes.clase, (cuenta.get(it.ejes.clase) ?? 0) + 1);
  let dominante: ClaseVerbal = '1ª', max = 0;
  for (const [c, k] of cuenta) if (k > max) { max = k; dominante = c; }
  const modelo = items.find((it) => it.ejes.clase === dominante)!.verbo;
  const tasa = items.filter((it) => {
    if (it.tiempo === 'imperfecto')
      return imperfectoIngenuo(it.verbo, it.persona) === it.respuesta.normalize('NFC');
    const suyo = temaYDesinencia(it.verbo, it.persona, it.tiempo);
    const delModelo = temaYDesinencia(modelo, it.persona, it.tiempo);
    return suyo.tema + delModelo.desinencia === it.respuesta.normalize('NFC');
  }).length / n;
  if (tasa > 0.6)
    push('clase-equivocada-resuelve',
      items[0]!.tiempo === 'imperfecto'
        ? `quitarle el «-re» al infinitivo y pegar la desinencia acierta el ${(100 * tasa).toFixed(0)} % de los ítems: el lote no obliga a saber qué infijo lleva cada clase`
        : `conjugar todo como ${dominante} da la misma desinencia en el ${(100 * tasa).toFixed(0)} % de los ítems: el lote no obliga a saber de qué clase es cada verbo`);

  const sep = separablePorPosicion(items.map((it) => (it.persona.endsWith('sg') ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const cobertura: Cobertura[] = [
    { comprobacion: 'la forma contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'clases verbales distintas', decididos: clases.size, total: 5,
      motivoDeLosQueQuedanFuera: 'las clases que el lote no trae. Con menos de tres, la ruta «aplicar la clase equivocada» no se puede medir' },
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, tasaClaseEquivocada: tasa, cobertura };
}

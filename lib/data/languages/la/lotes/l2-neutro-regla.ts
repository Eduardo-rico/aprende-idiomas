// lib/data/languages/la/lotes/l2-neutro-regla.ts
//
// PRIMER LOTE DE LA REGLA DEL NEUTRO. Punto: `l2-neutro-regla`.
//
// «Es la regla que salva y la que confunde: salva porque no hay que aprender
// dos formas, confunde porque la forma sola no dice si es sujeto u objeto.»
// `varia`: si la frase tiene un neutro y un no-neutro —la desinencia del
// otro resuelve— o dos neutros, donde no resuelve nada.
//
// ── EL SUELO QUE PONE LA LENGUA, CUARTA VEZ ──────────────────────────
//
// Con DOS neutros la desinencia no decide, y no es un defecto del ítem: el
// nominativo y el acusativo neutros son la misma forma en toda la lengua.
// Lo único que queda para repartir los papeles es la SEMÁNTICA.
//
// O sea que esos ítems los gana la ruta pragmática **por construcción**, y
// exigirle el 50 % del azar daría por fugado un lote correcto. El gate
// calcula su piso:
//
//     piso pragmático = (ítems de dos neutros) + 0,5 · (los de uno)
//
// Y las OTRAS dos rutas no se tocan. La posicional no gana nada por que haya
// dos neutros: sólo gana si el orden se parece al español, y eso sí sería
// fuga de diseño. Por eso los cuatro ítems de dos neutros van en orden SOV
// —el orden propio del latín, que en español sale del revés— y la ruta
// posicional se estrella con ellos igual que con los demás.
//
// ── POR QUÉ HIZO FALTA METER UN VERBO ────────────────────────────────
//
// Los once neutros del lexicón son todos INANIMADOS, y ninguno de los
// dieciséis verbos que había acepta un sujeto inanimado con asimetría
// semántica clara. Buscado en el corpus qué verbos llevan sujeto neutro
// anotado, casi todos son intransitivos —`veniō`, `maneō`, `cadō`, `stō`— y
// no forman pareja sujeto-objeto. El único transitivo frecuente es `habeō`,
// con 11 sujetos neutros distintos y 1.126 apariciones. Entra por eso, no
// por costumbre de manual.
import type { ItemClozeGlosa, PalabraGlosada, EjesItem } from '../../../../../scripts/lib/gate-cloze-glosa';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const SEMILLA_DE_ORDEN = 1;

type Rasgos = { gen: 'm' | 'f'; num: 'sg' | 'pl' };
const ART: Record<string, [string, string]> = {
  msg: ['El', 'el'], fsg: ['La', 'la'], mpl: ['Los', 'los'], fpl: ['Las', 'las'],
};

function it(
  id: string,
  suj: [string, string], obj: [string, string], verbo: [string, string],
  r: Rasgos, e: Omit<EjesItem, 'numero'>, reversible: string,
): ItemClozeGlosa {
  const S: PalabraGlosada = { la: suj[0], es: suj[1], rol: 'sujeto', ...r };
  const O: PalabraGlosada = { la: obj[0], es: obj[1], rol: 'objeto', ...r };
  const V: PalabraGlosada = { la: verbo[0], es: verbo[1], rol: 'verbo' };
  const orden: Record<EjesItem['orden'], PalabraGlosada[]> = {
    SOV: [S, O, V], SVO: [S, V, O], OSV: [O, S, V], OVS: [O, V, S], VSO: [V, S, O], VOS: [V, O, S],
  };
  const palabras = orden[e.orden];
  const [det1, det2] = ART[`${r.gen}${r.num}`]!;
  const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);
  return {
    id, punto: 'l2-neutro-regla',
    latin: palabras.map((p, i) => (i === 0 ? cap(p.la) : p.la)).join(' ') + '.',
    palabras: palabras.map((p, i) => (i === 0 ? { ...p, la: cap(p.la) } : p)),
    glosa: `${det1} ___ ${verbo[1]} ${det2} ___.`,
    respuestas: [suj[1], obj[1]],
    reversible,
    ejes: { ...e, numero: r.num },
  };
}

const FUENTE: ItemClozeGlosa[] = [
  // ── OCHO CON UN NEUTRO Y UN NO-NEUTRO ──
  //
  // La desinencia del OTRO resuelve. Y para que sea LA DESINENCIA la que
  // resuelve y no el sentido común, la pragmática de estos ocho tiene que
  // ser neutra o engañosa: la primera versión los puso todos con reparto
  // esperado y la ruta pragmática sacó el 96 % contra un piso de 67 %.
  //
  // Con animado + inanimado la dirección casi siempre está forzada —una
  // palabra no oye—, así que los neutros aquí van con `habet` y `custōdit`,
  // donde los dos repartos son plausibles de verdad.
  it('la-2n-01', ['templum', 'templo'], ['dominum', 'señor'], ['habet', 'tiene'],
    { gen: 'm', num: 'sg' }, { orden: 'SOV', conjugacion: 2, declinacion: '2ª', esperado: 'neutro', resuelveLaDesinencia: true },
    'un templo puede tener un señor y un señor puede tener un templo: ninguno de los dos repartos es el esperado, así que sólo la «-m» de «dominum» lo decide'),
  it('la-2n-02', ['dominus', 'señor'], ['templum', 'templo'], ['habet', 'tiene'],
    { gen: 'm', num: 'sg' }, { orden: 'OSV', conjugacion: 2, declinacion: '2ª', esperado: 'neutro', resuelveLaDesinencia: true },
    'el reparto contrario del anterior y con el mismo verbo: los dos siguen siendo plausibles, y aquí además el orden va del revés'),
  it('la-2n-03', ['bellum', 'guerra'], ['rēgīnam', 'reina'], ['habet', 'tiene'],
    { gen: 'f', num: 'sg' }, { orden: 'SOV', conjugacion: 2, declinacion: '1ª', esperado: 'neutro', resuelveLaDesinencia: true },
    'una guerra tiene una reina que la dirige y una reina tiene una guerra: los dos se dicen, y la «-m» de «rēgīnam» es lo único que reparte'),
  it('la-2n-04', ['domina', 'señora'], ['opus', 'obra'], ['habet', 'tiene'],
    { gen: 'f', num: 'sg' }, { orden: 'SVO', conjugacion: 2, declinacion: '3ª', esperado: 'neutro', resuelveLaDesinencia: true },
    'una señora tiene una obra y una obra tiene una señora que la firma; ninguna dirección es la esperada'),
  it('la-2n-05', ['templum', 'templo'], ['rēgem', 'rey'], ['custōdit', 'guarda'],
    { gen: 'm', num: 'sg' }, { orden: 'OVS', conjugacion: 4, declinacion: '3ª', esperado: 'falso', resuelveLaDesinencia: true },
    'lo esperado es que el rey guarde el templo, y el reparto correcto es el contrario: el templo guarda al rey. Quien conteste por sentido común se estrella'),
  it('la-2n-06', ['bellum', 'guerra'], ['rēgīnam', 'reina'], ['vocat', 'llama'],
    { gen: 'f', num: 'sg' }, { orden: 'SOV', conjugacion: 1, declinacion: '1ª', esperado: 'falso', resuelveLaDesinencia: true },
    'lo esperado es que la reina llame a la guerra; el reparto correcto es que la guerra llama a la reina, y sólo la desinencia lo dice'),
  it('la-2n-07', ['discipulī', 'discípulos'], ['dōna', 'regalos'], ['exspectant', 'esperan'],
    { gen: 'm', num: 'pl' }, { orden: 'OSV', conjugacion: 1, declinacion: '2ª', esperado: 'correcto', resuelveLaDesinencia: true },
    'unos regalos no esperan, así que aquí el sentido común sí acierta — hace falta un ítem así para que el lote no sea uniforme en el otro eje, y el orden lo contradice igualmente'),
  it('la-2n-08', ['puellae', 'niñas'], ['verba', 'palabras'], ['audiunt', 'oyen'],
    { gen: 'f', num: 'pl' }, { orden: 'OVS', conjugacion: 4, declinacion: '1ª', esperado: 'neutro', resuelveLaDesinencia: true },
    'en plural la trampa crece: «verba» además parece un femenino singular español, y el alumno lee «la palabra» donde dice «las palabras»'),

  // ── CUATRO CON DOS NEUTROS: la desinencia NO resuelve ──
  //
  // Ninguna de las dos formas dice si es sujeto u objeto, y no hay arreglo
  // posible: es la lengua. Sólo queda la semántica, así que estos cuatro los
  // gana la ruta pragmática por construcción y el gate lo descuenta.
  //
  // Y van repartidos entre SOV y OSV, no todos en SOV. La primera versión
  // los puso los cuatro en SOV pensando que así la ruta posicional perdía, y
  // es AL REVÉS: en SOV el latín da sujeto y luego objeto, que es el orden
  // en que el español los lee, así que la posicional los ganaba todos y
  // subía al 67 %. El piso es de la pragmática y de ninguna otra ruta, así
  // que las otras dos tienen que seguir estrellándose.
  it('la-2n-09', ['templum', 'templo'], ['nōmen', 'nombre'], ['habet', 'tiene'],
    { gen: 'm', num: 'sg' }, { orden: 'OSV', conjugacion: 2, declinacion: '2ª', esperado: 'correcto', resuelveLaDesinencia: false },
    'un templo tiene un nombre y un nombre no tiene un templo: sólo eso reparte los papeles, porque «templum» y «nōmen» son iguales en nominativo y en acusativo'),
  it('la-2n-10', ['mare', 'mar'], ['corpus', 'cuerpo'], ['portat', 'lleva'],
    { gen: 'm', num: 'sg' }, { orden: 'SOV', conjugacion: 1, declinacion: '3ª', esperado: 'correcto', resuelveLaDesinencia: false },
    'el mar lleva un cuerpo y un cuerpo no lleva el mar; las dos formas son idénticas en los dos casos y la desinencia no ayuda'),
  it('la-2n-11', ['verbum', 'palabra'], ['gaudium', 'alegría'], ['portat', 'lleva'],
    { gen: 'f', num: 'sg' }, { orden: 'OSV', conjugacion: 1, declinacion: '2ª', esperado: 'correcto', resuelveLaDesinencia: false },
    'una palabra trae alegría y una alegría no trae una palabra; los dos son neutros y ninguna desinencia lo dice'),
  it('la-2n-12', ['templum', 'templo'], ['dōnum', 'regalo'], ['custōdit', 'guarda'],
    { gen: 'm', num: 'sg' }, { orden: 'SOV', conjugacion: 4, declinacion: '2ª', esperado: 'correcto', resuelveLaDesinencia: false },
    'un templo guarda un regalo y un regalo no guarda un templo; los dos neutros dejan el reparto en manos del sentido'),
];

export { SEMILLA_DE_ORDEN };
export const LOTE_NEUTRO_REGLA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

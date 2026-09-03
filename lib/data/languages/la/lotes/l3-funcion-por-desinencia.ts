// lib/data/languages/la/lotes/l3-funcion-por-desinencia.ts
//
// EL PRIMER LOTE DE LATÍN — v2, después del latinista adversarial.
//
// La v1 tenía doce ítems impecables uno a uno y **no medía nada**: como el
// gate exigía por ítem que el objeto precediera al sujeto, «escríbelos al
// revés» acertaba 12 de 12. El gate v2 lo comprueba EN EL LOTE contra las
// tres estrategias ciegas, y de ahí salen las dos decisiones que gobiernan
// este fichero.
//
// ── 1. EL LOTE NO ES FIEL A LA FRECUENCIA, Y ES DELIBERADO ────────────
//
// Sobre los treebanks UD (4.937 cláusulas con `nsubj` y `obj` explícitos):
//
//     SOV 38,9 %  SVO 29,4 %  OSV 15,5 %  OVS 6,3 %  VOS 5,1 %  VSO 4,8 %
//     el sujeto precede al objeto en el 73,1 % del latín real
//
// Un lote fiel a esa distribución sería resoluble al 73 % traduciendo en
// orden, o sea por encima del azar. Las dos estrategias de orden son
// **complementarias** —cualquier ítem lo acierta exactamente una— así que
// la única mezcla que deja a las dos en el azar es 50/50. Diez ítems con
// el sujeto delante y diez con el objeto delante.
//
// Es una tensión real y se declara en vez de disimularse: el lote enseña
// a leer la desinencia, no a estimar la frecuencia del orden. Esa segunda
// cosa la enseña la lectura, no el ejercicio.
//
// ── 2. PARES SIN JERARQUÍA ────────────────────────────────────────────
//
// La v1 usaba `magister`/`discipulus` y `dominus`/`servus` declarándolos
// reversibles. No lo son: los dos sustantivos están DEFINIDOS por la
// relación que el verbo nombra (Lewis & Short: *magister*, «a teacher»;
// *discipulus*, «a pupil»), así que «el discípulo enseña al maestro»
// invierte la definición de las palabras y el alumno no necesita la
// desinencia. Aquí los pares son simétricos —amigo/vecino, hijo/amigo,
// marinero/campesino— y por eso la pragmática se queda en el azar.
//
// Retirados de la v1 y por qué:
//   · `Discipulum magister docet`  — no reversible, y `doceō` es el verbo
//     que el propio inventario marca como el que el instinto español lee
//     como dativo y acierta por el camino equivocado.
//   · `Mittit puerum magister`     — *mittere* a una persona presupone
//     autoridad sobre ella: la relación está en las palabras.
//   · `Poētam laudat agricola`     — su justificación era un error diana
//     ANGLÓFONO («el hispanohablante lee -a y da por hecha la
//     concordancia»: el español tiene *el poeta, el atleta, el mapa*, así
//     que es un regalo, no una trampa), y además `textoParaVoz('poēta')`
//     devolvía `peta`, una palabra que no existe.
//   · `pater`/`māter` — son de 3.ª declinación y sólo aparecían en
//     nominativo, donde la 3.ª no aporta ninguna desinencia que leer:
//     coste de un paradigma no desbloqueado a cambio de nada.
import type { ItemClozeGlosa, EjesItem, PalabraGlosada } from '../../../../../scripts/lib/gate-cloze-glosa';

type Rasgos = { gen: 'm' | 'f'; num: 'sg' | 'pl' };
const ART: Record<string, [string, string]> = {
  msg: ['El', 'al'], fsg: ['La', 'a la'], mpl: ['Los', 'a los'], fpl: ['Las', 'a las'],
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
    id, punto: 'l3-funcion-por-desinencia',
    latin: palabras.map((p, i) => (i === 0 ? cap(p.la) : p.la)).join(' ') + '.',
    palabras: palabras.map((p, i) => (i === 0 ? { ...p, la: cap(p.la) } : p)),
    glosa: `${det1} ___ ${verbo[1]} ${det2} ___.`,
    respuestas: [suj[1], obj[1]],
    reversible,
    ejes: { ...e, numero: r.num },
  };
}

const SIM = (a: string, b: string) =>
  `${a} y ${b} no se definen el uno por el otro ni hay jerarquía entre ellos, así que los dos papeles son igual de plausibles`;

export const LOTE_FUNCION_POR_DESINENCIA: ItemClozeGlosa[] = [
  // ── DIEZ CON EL SUJETO DELANTE (SOV, SVO, VSO) ──
  it('la-fpd-01', ['amīcus', 'amigo'], ['vīcīnum', 'vecino'], ['vocat', 'llama'],
    { gen: 'm', num: 'sg' }, { orden: 'SOV', conjugacion: 1, declinacion: '2ª', esperado: 'neutro' }, SIM('amigo', 'vecino')),
  it('la-fpd-02', ['fīlius', 'hijo'], ['amīcum', 'amigo'], ['exspectat', 'espera'],
    { gen: 'm', num: 'sg' }, { orden: 'SOV', conjugacion: 1, declinacion: '2ª', esperado: 'neutro' }, SIM('hijo', 'amigo')),
  it('la-fpd-03', ['puella', 'niña'], ['amīcam', 'amiga'], ['videt', 've'],
    { gen: 'f', num: 'sg' }, { orden: 'SOV', conjugacion: 2, declinacion: '1ª', esperado: 'neutro' }, SIM('niña', 'amiga')),
  it('la-fpd-04', ['medicus', 'médico'], ['vīcīnum', 'vecino'], ['vocat', 'llama'],
    { gen: 'm', num: 'sg' }, { orden: 'SOV', conjugacion: 1, declinacion: '2ª', esperado: 'falso' },
    'médico y vecino son los dos plausibles como agente — y aquí el reparto correcto es el que la pragmática NO espera: lo normal es que el vecino llame al médico'),
  it('la-fpd-05', ['nautae', 'marineros'], ['agricolās', 'campesinos'], ['salūtant', 'saludan'],
    { gen: 'm', num: 'pl' }, { orden: 'SOV', conjugacion: 1, declinacion: '1ª-masc', esperado: 'neutro' }, SIM('marineros', 'campesinos')),
  it('la-fpd-06', ['vīcīna', 'vecina'], ['fīliam', 'hija'], ['audit', 'oye'],
    { gen: 'f', num: 'sg' }, { orden: 'SVO', conjugacion: 4, declinacion: '1ª', esperado: 'neutro' }, SIM('vecina', 'hija')),
  it('la-fpd-07', ['discipulus', 'discípulo'], ['medicum', 'médico'], ['monet', 'advierte'],
    { gen: 'm', num: 'sg' }, { orden: 'SVO', conjugacion: 2, declinacion: '2ª', esperado: 'falso' },
    'los dos pueden advertir al otro — y el reparto correcto contradice lo esperado, que es que advierta quien más sabe'),
  it('la-fpd-08', ['amīcae', 'amigas'], ['puellās', 'niñas'], ['vocant', 'llaman'],
    { gen: 'f', num: 'pl' }, { orden: 'SVO', conjugacion: 1, declinacion: '1ª', esperado: 'neutro' }, SIM('amigas', 'niñas')),
  it('la-fpd-09', ['colōnī', 'colonos'], ['medicōs', 'médicos'], ['dūcunt', 'guían'],
    { gen: 'm', num: 'pl' }, { orden: 'SVO', conjugacion: 3, declinacion: '2ª', esperado: 'neutro' }, SIM('colonos', 'médicos')),
  it('la-fpd-10', ['agricola', 'campesino'], ['nautam', 'marinero'], ['dūcit', 'guía'],
    { gen: 'm', num: 'sg' }, { orden: 'VSO', conjugacion: 3, declinacion: '1ª-masc', esperado: 'falso' },
    'los dos pueden guiar — y el reparto correcto es el inesperado: guiar se espera del marinero, que es quien orienta'),

  // ── DIEZ CON EL OBJETO DELANTE (OSV, OVS, VOS) ──
  it('la-fpd-11', ['vīcīnus', 'vecino'], ['fīlium', 'hijo'], ['vocat', 'llama'],
    { gen: 'm', num: 'sg' }, { orden: 'OSV', conjugacion: 1, declinacion: '2ª', esperado: 'neutro' }, SIM('vecino', 'hijo')),
  it('la-fpd-12', ['amīca', 'amiga'], ['vīcīnam', 'vecina'], ['videt', 've'],
    { gen: 'f', num: 'sg' }, { orden: 'OSV', conjugacion: 2, declinacion: '1ª', esperado: 'neutro' }, SIM('amiga', 'vecina')),
  it('la-fpd-13', ['puerī', 'niños'], ['amīcōs', 'amigos'], ['exspectant', 'esperan'],
    { gen: 'm', num: 'pl' }, { orden: 'OSV', conjugacion: 1, declinacion: '2ª', esperado: 'neutro' }, SIM('niños', 'amigos')),
  it('la-fpd-14', ['puellae', 'niñas'], ['rēgīnās', 'reinas'], ['vident', 'ven'],
    { gen: 'f', num: 'pl' }, { orden: 'OSV', conjugacion: 2, declinacion: '1ª', esperado: 'falso' },
    'ver es simétrico y no presupone jerarquía — y el reparto correcto es el que nadie adivina: lo esperado es que la reina sea el agente'),
  it('la-fpd-15', ['nauta', 'marinero'], ['colōnum', 'colono'], ['invenit', 'encuentra'],
    { gen: 'm', num: 'sg' }, { orden: 'OSV', conjugacion: 4, declinacion: 'mixta', esperado: 'neutro' }, SIM('marinero', 'colono')),
  it('la-fpd-16', ['domina', 'señora'], ['rēgīnam', 'reina'], ['audit', 'oye'],
    { gen: 'f', num: 'sg' }, { orden: 'OVS', conjugacion: 4, declinacion: '1ª', esperado: 'neutro' }, SIM('señora', 'reina')),
  it('la-fpd-17', ['discipulī', 'discípulos'], ['vīcīnōs', 'vecinos'], ['mittunt', 'envían'],
    { gen: 'm', num: 'pl' }, { orden: 'OVS', conjugacion: 3, declinacion: '2ª', esperado: 'neutro' }, SIM('discípulos', 'vecinos')),
  it('la-fpd-18', ['fīliae', 'hijas'], ['amīcās', 'amigas'], ['laudant', 'alaban'],
    { gen: 'f', num: 'pl' }, { orden: 'OVS', conjugacion: 1, declinacion: '1ª', esperado: 'neutro' }, SIM('hijas', 'amigas')),
  it('la-fpd-19', ['servus', 'esclavo'], ['amīcum', 'amigo'], ['timet', 'teme'],
    { gen: 'm', num: 'sg' }, { orden: 'VOS', conjugacion: 2, declinacion: '2ª', esperado: 'neutro' }, SIM('esclavo', 'amigo')),
  it('la-fpd-20', ['vīcīnī', 'vecinos'], ['medicōs', 'médicos'], ['audiunt', 'oyen'],
    { gen: 'm', num: 'pl' }, { orden: 'VOS', conjugacion: 4, declinacion: '2ª', esperado: 'neutro' }, SIM('vecinos', 'médicos')),
];

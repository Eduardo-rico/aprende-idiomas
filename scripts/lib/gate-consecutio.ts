// scripts/lib/gate-consecutio.ts — LA CONCORDANCIA DE TIEMPOS.
//
// Punto `l7-consecutio`. «Principal en tiempo principal → subordinada en
// presente o perfecto de subjuntivo; principal en tiempo histórico →
// imperfecto o pluscuamperfecto.» `varia`: «el tiempo de la principal y si
// la subordinada es simultánea o anterior». `clase: paradigma`,
// `via: produccion`, `herencia: regalo`.
//
// ══ POR QUÉ LA INTERROGATIVA INDIRECTA ══════════════════════════════
//
// La tabla tiene cuatro casillas y dos de ellas son de ANTERIORIDAD. Las
// finales y completivas con `ut` miran hacia adelante y no la tienen
// (`l7-ut-final` ya examina la mitad simultánea). La interrogativa
// indirecta sí: «rogat cūr vēnerit». Las seis partículas indeclinables
// que la máquina produce son las de `l7-interrogativa-indirecta`.
//
// ══ LA RELACIÓN VA DECLARADA EN LA PISTA, Y POR QUÉ ═══════════════════
//
// «Rēx rogat cūr servus veniat» y «… vēnerit» son las dos latín correcto:
// sin decir si lo preguntado es simultáneo o anterior, el ítem no está
// determinado y suspendería a quien escribe la otra (§D8). Y decirlo con
// la GLOSA española completa —«pregunta por qué vino»— regala el tiempo:
// la interrogativa indirecta española aplica la MISMA concordancia en
// indicativo (viene / vino / venía / había venido), así que quien copia el
// nombre del tiempo español acierta el 100 %. Por eso la glosa lleva la
// principal y deja el verbo subordinado en «…», y la relación va en la
// pista con dos etiquetas fijas.
//
// ══ TODO SE DERIVA, NADA SE DECLARA SUELTO ═══════════════════════════
//
// El marco, la glosa, la pista y la respuesta se DERIVAN de campos
// estructurados (lema, número, tiempo, partícula, relación) y el gate los
// compara con lo escrito. Mutar cualquiera de los cuatro campos que el
// alumno lee pone el gate en rojo (§5.tricies septies: se muta por donde
// el material afirma).
//
// ══ EL SEGUNDO CAMINO ═══════════════════════════════════════════════
//
// La forma: la máquina del subjuntivo. La REGLA: el treebank
// (`atestacion-consecutio.json`), que no escribió nadie de este proyecto.
// Cada par (tiempo del regente → tiempo del subjuntivo) que el lote pide
// tiene que estar atestiguado en interrogativas indirectas.
import atestacion from '../../lib/data/languages/la/atestacion-consecutio.json';
import { subjuntivo, TIEMPOS_SUBJ, type TiempoSubj } from '../../lib/data/languages/la/subjuntivo';
import { conjugar, declinar, type EntradaNominal, type EntradaVerbal, type Numero, type Persona } from '../../lib/data/languages/la/paradigma-la';
import { NOMBRES_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { sinCantidad } from '../../lib/lang/ortografia-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { PARTICULAS, type Particula } from './gate-interrogativa-indirecta';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const AT = atestacion as { interrogativaIndirecta: Record<string, Record<string, number>>; todasLasSubordinadas: Record<string, Record<string, number>> };

/** Dos tiempos del regente, y los otros fuera con su motivo:
 *
 *  · el PERFECTO de indicativo lleva las dos secuencias (A&G §485.a): en
 *    interrogativas indirectas, 9 imperfectos, 6 pluscuamperfectos, 4
 *    perfectos y 3 presentes de subjuntivo. No determina.
 *  · el PRESENTE tampoco, en una frase suelta: puede leerse como presente
 *    HISTÓRICO, que admite secuencia secundaria (A&G §485.e), y entonces
 *    «Rēx rogat cūr servus venīret» también es correcta y la clave la
 *    suspendería (§D8). El sello trae el caso: «quaerit ex me num
 *    consuessem». Lo vio el lingüista; la primera versión del lote tenía
 *    seis presentes. El FUTURO no puede ser histórico. */
export type TiempoRegente = 'futuro' | 'imperfecto';
export type Relacion = 'simultanea' | 'anterior';
export type Secuencia = 'primaria' | 'historica';

export const SECUENCIA: Record<TiempoRegente, Secuencia> = { futuro: 'primaria', imperfecto: 'historica' };

/** LA REGLA, escrita una vez. El test la contrasta con el treebank. */
export const CONSECUTIO: Record<Secuencia, Record<Relacion, TiempoSubj>> = {
  primaria: { simultanea: 'presente', anterior: 'perfecto' },
  historica: { simultanea: 'imperfecto', anterior: 'pluscuamperfecto' },
};

/** Los tiempos con el código de la anotación UD, para leer el sello. */
export const UD_REGENTE: Record<TiempoRegente, string> = { futuro: 'Fut', imperfecto: 'Past' };
export const UD_SUBJ: Record<TiempoSubj, string> = { presente: 'Pres', imperfecto: 'Past', perfecto: 'PastPerf', pluscuamperfecto: 'Pqp' };

export const ETIQUETA: Record<Relacion, string> = {
  simultanea: 'a la vez que la pregunta',
  anterior: 'antes de la pregunta',
};

/** El verbo español de la principal, por tiempo y número. Atado a la
 *  glosa del lexicón del regente: si el regente cambia, esto no casa. */
export const REGENTE_ES: Record<string, { infinitivo: string; formas: Record<TiempoRegente, Record<Numero, string>> }> = {
  rogō: {
    infinitivo: 'preguntar',
    formas: { futuro: { sg: 'preguntará', pl: 'preguntarán' }, imperfecto: { sg: 'preguntaba', pl: 'preguntaban' } },
  },
  videō: {
    infinitivo: 'ver',
    formas: { futuro: { sg: 'verá', pl: 'verán' }, imperfecto: { sg: 'veía', pl: 'veían' } },
  },
};

export interface Sujeto { lema: string; numero: Numero }

export interface ItemConsecutio {
  id: string;
  punto: string;
  regente: EntradaVerbal;
  tiempoRegente: TiempoRegente;
  sujetoPrincipal: Sujeto;
  particula: Particula;
  sujeto: Sujeto;
  verbo: EntradaVerbal;
  relacion: Relacion;
  /** Lo que ve el alumno: SIN mácrones, como el texto real. */
  marco: string;
  /** El mismo marco con cantidad; cada palabra tiene que ser forma de la máquina. */
  marcoConCantidad: string;
  glosa: string;
  pista: string;
  respuesta: string;
  ejes: { tiempoRegente: TiempoRegente; relacion: Relacion };
}

export type ClaseFalloConsecutio =
  | 'respuesta-no-derivable' | 'marco-no-derivable' | 'marco-con-cantidad' | 'marco-fuera-de-l1'
  | 'marco-regala-la-forma' | 'glosa-no-derivable' | 'pista-no-dice-la-relacion'
  | 'perfecto-sincopable' | 'colapsa-sin-macron' | 'verbo-sin-glosa' | 'regente-sin-glosa'
  | 'eje-mal-declarado' | 'celda-sin-atestiguar' | 'celda-sin-cubrir' | 'varia-incompleto'
  | 'pista-de-marco' | 'regente-ambiguo' | 'clave-no-declarada' | 'punto-ajeno' | 'id-mal-formado' | 'estrategia-ciega' | 'orden-publicado' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloConsecutio { item: string; clase: ClaseFalloConsecutio; detalle: string }

const CLAVES = new Set(['id', 'punto', 'regente', 'tiempoRegente', 'sujetoPrincipal', 'particula', 'sujeto', 'verbo', 'relacion', 'marco', 'marcoConCantidad', 'glosa', 'pista', 'respuesta', 'ejes']);

const nombre = (l: string): EntradaNominal => {
  const n = NOMBRES_L1.find((x) => x.lema === l);
  if (!n) throw new Error(`«${l}» no está en NOMBRES_L1`);
  return n;
};
const persona = (n: Numero): Persona => (n === 'sg' ? '3sg' : '3pl');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function tiempoPedido(i: Pick<ItemConsecutio, 'tiempoRegente' | 'relacion'>): TiempoSubj {
  return CONSECUTIO[SECUENCIA[i.tiempoRegente]][i.relacion];
}

export function respuestaDeLaMaquina(i: ItemConsecutio): string | null {
  return subjuntivo(i.verbo, tiempoPedido(i), persona(i.sujeto.numero));
}

export function marcoDerivado(i: ItemConsecutio): string {
  const sp = declinar(nombre(i.sujetoPrincipal.lema), 'nom', i.sujetoPrincipal.numero);
  const reg = conjugar(i.regente, persona(i.sujetoPrincipal.numero), i.tiempoRegente);
  const ss = declinar(nombre(i.sujeto.lema), 'nom', i.sujeto.numero);
  return `${cap(sp)} ${reg} ${i.particula} ${ss} ___.`;
}

/** LAS PERSONAS que pueden preguntar, ver o ser objeto de la pregunta,
 *  con su español DECLARADO. La primera versión derivaba el artículo del
 *  género latino y el plural por regla, y el ataque por mutación le hizo
 *  exigir «el palabra», «las naciónes» y «la árbol pregunta»: un sujeto
 *  que no es persona no puede preguntar, y un plural por regla no es
 *  español. Lista cerrada; el gate la contrasta con el lexicón (singular
 *  = primera acepción de la glosa, género = el del lexicón). */
export const PERSONAS_ES: Record<string, { sg: string; pl: string; genero: 'm' | 'f' }> = {
  servus: { sg: 'esclavo', pl: 'esclavos', genero: 'm' },
  nauta: { sg: 'marinero', pl: 'marineros', genero: 'm' },
  puer: { sg: 'niño', pl: 'niños', genero: 'm' },
  discipulus: { sg: 'discípulo', pl: 'discípulos', genero: 'm' },
  magister: { sg: 'maestro', pl: 'maestros', genero: 'm' },
  rēx: { sg: 'rey', pl: 'reyes', genero: 'm' },
  rēgīna: { sg: 'reina', pl: 'reinas', genero: 'f' },
  dominus: { sg: 'señor', pl: 'señores', genero: 'm' },
  poēta: { sg: 'poeta', pl: 'poetas', genero: 'm' },
  fīlius: { sg: 'hijo', pl: 'hijos', genero: 'm' },
  fīlia: { sg: 'hija', pl: 'hijas', genero: 'f' },
  agricola: { sg: 'campesino', pl: 'campesinos', genero: 'm' },
};

export function sintagmaEs(s: Sujeto): string | null {
  const p = PERSONAS_ES[s.lema];
  if (!p) return null;
  const art = p.genero === 'f' ? (s.numero === 'sg' ? 'la' : 'las') : (s.numero === 'sg' ? 'el' : 'los');
  return `${art} ${p[s.numero]}`;
}

/** Que la tabla de personas no se separe del lexicón. */
export function personasContraElLexicon(): string[] {
  const out: string[] = [];
  for (const [l, p] of Object.entries(PERSONAS_ES)) {
    const n = NOMBRES_L1.find((x) => x.lema === l);
    if (!n) { out.push(`${l}: no está en el lexicón`); continue; }
    if (n.glosa.split(',')[0]!.trim() !== p.sg) out.push(`${l}: «${p.sg}» y el lexicón dice «${n.glosa}»`);
    if (n.genero !== p.genero) out.push(`${l}: género ${p.genero} y el lexicón dice ${n.genero}`);
  }
  return out;
}

export function glosaDerivada(i: ItemConsecutio): string | null {
  const r = REGENTE_ES[i.regente.lema];
  const a = sintagmaEs(i.sujetoPrincipal), b = sintagmaEs(i.sujeto);
  if (!r || !a || !b) return null;
  // El sujeto DETRÁS del hueco: tras «dónde», «cuándo», «cómo» el español
  // mexicano pospone el sujeto («pregunta dónde está el esclavo»). La
  // primera versión lo anteponía; lo señaló el lingüista.
  return `${cap(a)} ${r.formas[i.tiempoRegente][i.sujetoPrincipal.numero]} ${PARTICULAS[i.particula]} … ${b}`;
}

export const pistaDerivada = (i: ItemConsecutio) => `${i.verbo.lema} · ${ETIQUETA[i.relacion]}`;

const palabras = (s: string) => s.replace('___', ' ').split(/[^\p{L}]+/u).filter(Boolean).map((w) => sinCantidad(w).toLowerCase());

export function revisarItemConsecutio(i: ItemConsecutio): FalloConsecutio[] {
  const out: FalloConsecutio[] = [];
  const push = (clase: ClaseFalloConsecutio, detalle: string) => out.push({ item: i.id, clase, detalle });

  // CAMPOS QUE EL PUBLICADOR SIRVE Y ESTE GATE NO MIRARÍA. `alternativas`
  // se publica como respuesta buena y `ejes.colapsaAlLeer` aparta el ítem:
  // con cualquiera de los dos el ataque por mutación coló el error diana
  // como respuesta correcta con cero fallos (§C6). Se prohíbe toda clave
  // que el tipo no declare.
  const extra = Object.keys(i).filter((k) => !CLAVES.has(k));
  if (extra.length) push('clave-no-declarada', `el ítem trae ${extra.join(', ')}, que el publicador puede servir y este gate no valida`);
  const extraEjes = Object.keys(i.ejes).filter((k) => k !== 'tiempoRegente' && k !== 'relacion');
  if (extraEjes.length) push('clave-no-declarada', `los ejes traen ${extraEjes.join(', ')}`);
  if (i.punto !== 'l7-consecutio') push('punto-ajeno', `el punto es «${i.punto}»: el publicador lo mandaría a otra lección`);
  if (!/^la-cs-\d\d$|^(ps|pa|hs|ha)\d$/u.test(i.id)) push('id-mal-formado', `id «${i.id}»`);
  if (!(i.tiempoRegente in SECUENCIA)) {
    push('regente-ambiguo', `regente en «${String(i.tiempoRegente)}»: no determina la secuencia (presente histórico, perfecto)`);
    return out;
  }
  const dela = respuestaDeLaMaquina(i);
  if (dela === null) push('respuesta-no-derivable', `la máquina no da el subjuntivo de «${i.verbo.lema}»`);
  else if (dela !== i.respuesta)
    push('respuesta-no-derivable', `la respuesta es «${i.respuesta}» y con regente en ${i.tiempoRegente} y relación ${i.relacion} la máquina da «${dela}» (${tiempoPedido(i)})`);

  if (i.ejes.tiempoRegente !== i.tiempoRegente || i.ejes.relacion !== i.relacion)
    push('eje-mal-declarado', `los ejes dicen ${i.ejes.tiempoRegente}/${i.ejes.relacion} y el ítem es ${i.tiempoRegente}/${i.relacion}`);

  const m = marcoDerivado(i);
  if (m !== i.marcoConCantidad) push('marco-no-derivable', `el marco con cantidad es «${i.marcoConCantidad}» y se deriva «${m}»`);
  if (sinCantidad(i.marcoConCantidad) !== i.marco)
    push('marco-con-cantidad', `el marco que ve el alumno tiene que ser «${sinCantidad(i.marcoConCantidad)}» —sin mácrones, como el texto real— y es «${i.marco}»`);
  const d = palabrasDesconocidas(i.marcoConCantidad);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina no produce: ${d.join(', ')}`);
  if (palabras(i.marco).includes(sinCantidad(i.respuesta).toLowerCase()))
    push('marco-regala-la-forma', `el marco contiene «${i.respuesta}»`);

  const g = glosaDerivada(i);
  if (g === null) push('glosa-no-derivable', `no hay español declarado para el regente «${i.regente.lema}» o para «${i.sujetoPrincipal.lema}»/«${i.sujeto.lema}», que tienen que ser personas de PERSONAS_ES`);
  else if (g !== i.glosa) push('glosa-no-derivable', `la glosa es «${i.glosa}» y se deriva «${g}»`);
  const r = REGENTE_ES[i.regente.lema];
  if (!i.regente.glosa) push('regente-sin-glosa', `«${i.regente.lema}» no tiene glosa en el lexicón (importado): su español no está atado a nada`);
  else if (r && !i.regente.glosa.split(',').map((x) => x.trim()).includes(r.infinitivo))
    push('glosa-no-derivable', `el español del regente es «${r.infinitivo}» y el lexicón de «${i.regente.lema}» dice «${i.regente.glosa}»`);
  if (i.pista !== pistaDerivada(i)) push('pista-no-dice-la-relacion', `la pista es «${i.pista}» y tiene que ser «${pistaDerivada(i)}»: sin la relación el ítem admite dos tiempos`);

  if (!i.verbo.glosa) push('verbo-sin-glosa', `«${i.verbo.lema}» es importado y no tiene glosa`);
  // §D8. Un perfecto en -vī admite la forma sincopada —amāverit/amārit,
  // audīvisset/audīsset— y las dos son latín correcto: la clave única
  // suspendería a quien escribe la otra.
  if (/vī$/u.test(i.verbo.perfecto ?? ''))
    push('perfecto-sincopable', `«${i.verbo.perfecto}» admite forma sincopada, que es correcta y la clave suspendería`);
  // La alternativa sin mácrón que añade el publicador no puede aceptar otra
  // casilla de la misma tabla.
  if (dela !== null) {
    const otras = TIEMPOS_SUBJ.filter((t) => t !== tiempoPedido(i))
      .map((t) => subjuntivo(i.verbo, t, persona(i.sujeto.numero)))
      .filter((f): f is string => !!f && sinCantidad(f) === sinCantidad(dela));
    if (otras.length) push('colapsa-sin-macron', `sin mácrón «${dela}» es también «${otras.join(', ')}»`);
  }

  // SEGUNDO CAMINO DE LA REGLA: ese par existe en las interrogativas
  // indirectas del corpus. Se suman los regentes de la misma SECUENCIA
  // (presente + futuro), porque el futuro sale 9 veces y el sello es
  // pequeño. NO se usa `todasLasSubordinadas` de respaldo: ahí primario →
  // imperfecto sale 50 veces (irreales, relativas) y aprobaría justo el
  // error del punto.
  if (!atestiguado(SECUENCIA[i.tiempoRegente], tiempoPedido(i)))
    push('celda-sin-atestiguar', `secuencia ${SECUENCIA[i.tiempoRegente]} → subjuntivo ${tiempoPedido(i)}: 0 en las ${AT_TOTAL} interrogativas indirectas del corpus`);
  return out;
}

const AT_TOTAL = Object.values(AT.interrogativaIndirecta).flatMap((f) => Object.values(f)).reduce((a, b) => a + b, 0);
/** Las filas del corpus de cada secuencia. Explícitas y NO derivadas de
 *  los tiempos que el lote usa: el presente sale del lote por ambiguo en
 *  una frase suelta, pero en el corpus sus 62 casos son evidencia de la
 *  secuencia primaria (el futuro sólo trae 9). */
export const REGENTES_UD: Record<Secuencia, string[]> = { primaria: ['Pres', 'Fut'], historica: ['Past'] };
export function atestiguadas(sec: Secuencia, t: TiempoSubj): number {
  return REGENTES_UD[sec].reduce((a, r) => a + (AT.interrogativaIndirecta[r]?.[UD_SUBJ[t]] ?? 0), 0);
}
export const atestiguado = (sec: Secuencia, t: TiempoSubj) => atestiguadas(sec, t) > 0;

type Celda = `${Secuencia}-${Relacion}`;
const celda = (i: ItemConsecutio): Celda => `${SECUENCIA[i.tiempoRegente]}-${i.relacion}`;

/** Las rutas que contestan sin la regla entera. Cada una devuelve el
 *  TIEMPO que pondría; se compara con el pedido. */
export const RUTAS: Record<string, (i: ItemConsecutio) => TiempoSubj> = {
  'siempre presente': () => 'presente',
  'siempre imperfecto': () => 'imperfecto',
  'siempre perfecto': () => 'perfecto',
  'siempre pluscuamperfecto': () => 'pluscuamperfecto',
  // Sólo la etiqueta, sin mirar el regente.
  'sólo la relación (presente/perfecto)': (i) => (i.relacion === 'simultanea' ? 'presente' : 'perfecto'),
  'sólo la relación (imperfecto/pluscuamperfecto)': (i) => (i.relacion === 'simultanea' ? 'imperfecto' : 'pluscuamperfecto'),
  // Sólo el regente: la regla de `l7-ut-final`, que no tiene anterioridad.
  'sólo el regente (la regla de la final)': (i) => (SECUENCIA[i.tiempoRegente] === 'primaria' ? 'presente' : 'imperfecto'),
  // LAS DOS RUTAS DEL MEXICANO, y cada una falla una casilla distinta
  // (§D3; las dos las nombró el lingüista, y la primera versión sólo traía
  // una, con una justificación falsa: «el subjuntivo pasado español es
  // uno». No lo es: está «haya venido»).
  //
  // 1 · imperfecto tras primario: con verbos de estado el español dice
  //     «preguntará dónde ESTABA», y el nombre de escuela hace del
  //     «imperfecto de subjuntivo» el pasado por defecto. Falla pa.
  'imperfecto tras primario («dónde estaba»)': (i) =>
    (SECUENCIA[i.tiempoRegente] === 'primaria' && i.relacion === 'anterior' ? 'imperfecto' : tiempoPedido(i)),
  // 2 · el pretérito mexicano donde otros ponen pluscuamperfecto
  //     («preguntaba si VINIERON») lleva al perfecto de subjuntivo tras un
  //     regente histórico. Falla ha.
  'el pretérito mexicano («preguntaba si vinieron»)': (i) =>
    (SECUENCIA[i.tiempoRegente] === 'historica' && i.relacion === 'anterior' ? 'perfecto' : tiempoPedido(i)),
};

/** Techos ABSOLUTOS (§B7), no puestos contra la medida. */
export const TECHO: Record<string, number> = {
  'siempre presente': 0.3, 'siempre imperfecto': 0.3, 'siempre perfecto': 0.3, 'siempre pluscuamperfecto': 0.3,
  'sólo la relación (presente/perfecto)': 0.55, 'sólo la relación (imperfecto/pluscuamperfecto)': 0.55,
  'sólo el regente (la regla de la final)': 0.55,
  'imperfecto tras primario («dónde estaba»)': 0.75,
  'el pretérito mexicano («preguntaba si vinieron»)': 0.75,
};

export function tasasConsecutio(items: ItemConsecutio[]): Record<string, number> {
  return Object.fromEntries(Object.entries(RUTAS).map(([k, f]) =>
    [k, items.length === 0 ? 0 : items.filter((i) => f(i) === tiempoPedido(i)).length / items.length]));
}

export function coberturaConsecutio(items: ItemConsecutio[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'la respuesta contra la máquina', decididos: items.filter((i) => respuestaDeLaMaquina(i) === i.respuesta).length, total: n },
    { comprobacion: 'las cuatro casillas de la tabla', decididos: new Set(items.map(celda)).size, total: 4 },
    { comprobacion: 'la casilla que el español NO regala (anterior tras primario)',
      decididos: items.filter((i) => celda(i) === 'primaria-anterior').length, total: n,
      motivoDeLosQueQuedanFuera: 'las otras tres no las falla la ruta «dónde estaba»; están para que el lote no enseñe «anterior = perfecto» sin más (§D6), y la histórica-anterior es la que falla la otra ruta mexicana' },
    { comprobacion: 'las dos excepciones del punto',
      decididos: 0, total: n,
      elCeroEsUnResultado: 'el presente histórico que admite secuencia secundaria (A&G §485.e) y el perfecto de subjuntivo en la consecutiva tras histórico (§485.c) son PERMISIVAS: admiten la otra secuencia, no la exigen. En producción quien sobreaplica la regla escribe una forma correcta, así que ningún ítem puede castigar la sobreaplicación. El lote esquiva la primera sin regente en presente (el primario va siempre en futuro) y la segunda sin consecutivas',
      motivoDeLosQueQuedanFuera: 'son excepciones de LECTURA: su sitio es un ítem receptivo, no uno de producción' },
  ];
}

export function revisarLoteConsecutio(items: ItemConsecutio[]): FalloConsecutio[] {
  const out: FalloConsecutio[] = items.flatMap(revisarItemConsecutio);
  for (const d of personasContraElLexicon()) out.push({ item: '(tabla)', clase: 'glosa-no-derivable', detalle: d });
  const ids = items.map((i) => i.id);
  if (new Set(ids).size !== ids.length) out.push({ item: '(lote)', clase: 'id-mal-formado', detalle: 'ids repetidos' });
  const pantallas = items.map((i) => `${i.marco}⟦${i.glosa}·${i.pista}⟧`);
  if (new Set(pantallas).size !== pantallas.length) out.push({ item: '(lote)', clase: 'pista-de-marco', detalle: 'dos ítems con la misma pantalla' });
  for (const c of revisarCobertura(coberturaConsecutio(items))) out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  // 2k: con cuatro casillas, al menos dos ítems en cada una.
  for (const c of ['primaria-simultanea', 'primaria-anterior', 'historica-simultanea', 'historica-anterior'] as Celda[]) {
    const k = items.filter((i) => celda(i) === c).length;
    if (k < 2) out.push({ item: '(lote)', clase: 'celda-sin-cubrir', detalle: `la casilla ${c} tiene ${k} ítems y hacen falta 2` });
  }
  if (new Set(items.map((i) => SECUENCIA[i.tiempoRegente])).size < 2 || new Set(items.map((i) => i.relacion)).size < 2)
    out.push({ item: '(lote)', clase: 'varia-incompleto', detalle: 'el varia es el tiempo de la principal Y la relación: faltan valores de uno de los dos' });

  const t = tasasConsecutio(items);
  for (const [k, v] of Object.entries(t))
    if (v > TECHO[k]!) out.push({ item: '(lote)', clase: 'estrategia-ciega', detalle: `«${k}» acierta el ${(100 * v).toFixed(0)} % de ${items.length} (techo ${TECHO[k]})` });

  // PISTAS DEL MARCO: todo valor que se repite tiene que variar en los dos
  // ejes, o el valor predice medio punto sin leer el latín.
  const molestias: [string, (i: ItemConsecutio) => string][] = [
    ['partícula', (i) => i.particula], ['verbo', (i) => i.verbo.lema], ['regente', (i) => i.regente.lema],
    ['sujeto de la principal', (i) => i.sujetoPrincipal.lema], ['sujeto de la subordinada', (i) => i.sujeto.lema],
    ['número de la subordinada', (i) => i.sujeto.numero], ['número de la principal', (i) => i.sujetoPrincipal.numero],
  ];
  for (const [nom, f] of molestias) {
    const por = new Map<string, ItemConsecutio[]>();
    for (const i of items) por.set(f(i), [...(por.get(f(i)) ?? []), i]);
    for (const [v, xs] of por) {
      if (xs.length < 2) continue;
      // Por eje Y por diagonal. Mirar cada eje por separado dejaba pasar
      // un verbo que sólo sale en {ps, ha}: con la etiqueta de relación,
      // el verbo da la casilla sin leer el regente — y así estaba escrita
      // la primera versión, 16 de 16 (§C5; lo cazó el ataque por mutación).
      const cs = new Set(xs.map(celda));
      const diag = [...cs].every((c) => c === 'primaria-simultanea' || c === 'historica-anterior')
        || [...cs].every((c) => c === 'primaria-anterior' || c === 'historica-simultanea');
      if (diag || new Set(xs.map((i) => SECUENCIA[i.tiempoRegente])).size < 2 || new Set(xs.map((i) => i.relacion)).size < 2)
        out.push({ item: '(lote)', clase: 'pista-de-marco', detalle: `${nom} «${v}» sale ${xs.length} veces y siempre en ${[...new Set(xs.map(celda))].join(' / ')}: predice un eje sin leer el latín` });
    }
  }

  for (const p of [separablePorPosicion(patronDe(items, (i) => i.relacion === 'anterior')),
                   separablePorPosicion(patronDe(items, (i) => SECUENCIA[i.tiempoRegente] === 'historica'))])
    if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `se separa por la posición: ${p}` });
  return out;
}

export const LO_QUE_DICE_EL_CORPUS = AT;

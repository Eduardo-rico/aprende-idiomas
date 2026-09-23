// scripts/lib/gate-perifrastica.ts — EL AGENTE DE LA PERIFRÁSTICA PASIVA.
//
// Punto `l8-perifrastica-pasiva`. El agente de gerundivo + sum va
// NORMALMENTE en dativo (A&G §374.a: «the regular way»). `varia`: «si
// aparece el agente en dativo, que es donde el alumno pone ablativo por
// analogía con la pasiva».
//
// ══ LO QUE EL LOTE NO PUEDE AFIRMAR: QUE «ā patre» SEA AGRAMATICAL ═══
//
// No lo es. A&G §374 Nota 1: ā + ablativo «a veces» con la perifrástica,
// cuando el dativo sería ambiguo O «when a stronger expression is
// desired»; y el corpus lo trae en Cicerón («ā nātūrā petundum est»). La
// primera versión de este gate lo llamaba «exactamente el error diana» y
// la del inventario decía «y no en ablativo»: el latinista lo tumbó
// (2026-09-23). El ítem pide ahora, en la pista, la forma NORMAL del
// agente —una preferencia declarada como tal— y no afirma nada sobre la
// otra. Aceptar «ā patre» como alternativa mataría el punto; no aceptarlo
// sin decirlo sería un asterisco sin fuente.
//
//     Fīlius patrī laudandus est.    el hijo debe ser alabado POR el padre
//     Fīlius ā patre laudātur.       el hijo es alabado POR el padre
//
// ══ LO QUE REGALA EL ESPAÑOL, Y LO QUE NO (§D3) ══════════════════════
//
// El español dice «por» en las dos. En la pasiva ordinaria eso es
// transferencia pura —«por el padre» → «ā patre»— y en la perifrástica
// lleva a la forma rara y enfática en vez de a la normal: quien traduce el
// «por» escribe «ā patre». (Y el otro camino del «por», «per patrem»,
// «por medio de»: no lo cobra ninguna ruta, pero es alcanzable.)
// Por eso el lote lleva las dos mitades en igual número (§D6): sin la
// pasiva ordinaria, «siempre dativo» acertaría el 100 %.
//
// ══ DÓNDE VA EL HUECO ════════════════════════════════════════════════
//
// El hueco se traga el sintagma ENTERO del agente, preposición incluida:
// «Fīlius ___ laudandus est» → «patrī»; «Fīlius ___ laudātur» → «ā
// patre». Si la `ā` estuviera en el marco, la preposición daría el caso y
// el ítem no examinaría nada.
//
// ══ POR QUÉ SÓLO AGENTES DE LA 3.ª ═══════════════════════════════════
//
// El agente tiene que tener el dativo singular distinto del ablativo Y del
// genitivo, sin mácrones:
//   · en la 2.ª `dominō` es dativo y ablativo: el alumno sólo decidiría si
//     pone la preposición, y no PRODUCIRÍA una desinencia distinta. En la
//     3.ª (`patrī` ≠ `patre`) el ítem mide el caso, no sólo la `ā`;
//   · en la 1.ª `puellae` es dativo y genitivo: «Epistula puellae legenda
//     est» también se lee «la carta DE LA NIÑA debe ser leída». Ese
//     argumento es PROPIO: A&G §374 N.1 habla de ambigüedad entre dos
//     DATIVOS (con otro dativo en la frase), no de este sincretismo. La
//     primera versión se lo atribuía a «§374.a», que dice lo contrario.
// En la 3.ª —`patrī` / `patre` / `patris`— las tres son distintas.
//
// ══ POR QUÉ NINGÚN VERBO QUE ADMITA UN DATIVO ═══════════════════════
//
// «Epistula patrī mittenda est» es también «la carta debe ser enviada AL
// padre»: con `mittō`, `dīcō`, `dō`, `portō`, `legō` (leer EN VOZ ALTA a
// alguien) el dativo del agente se confunde con el del destinatario, y
// A&G §374 N.1 dice que entonces «a veces» va `ā` + ablativo. Tampoco
// `dūcō` (su dativo se lee destino o finalidad: «subsidiō dūcī») ni `amō`
// (`amandus` es adjetivo lexicalizado, «amable», L&S) ni `audiō`
// (`audiendus` + dativo se lee «digno de ser oído a juicio de»): los tres
// estaban en la primera versión y los sacó el latinista. La lista es
// cerrada (`VERBO_ES`) y el gate rechaza cualquier otro.
//
// ══ POR QUÉ NINGUNA PASIVA DE PERFECTO ═══════════════════════════════
//
// El participio de perfecto admite dativo de agente (A&G §375; en el
// sello, 11 de 222): «fīlius patrī laudātus est» no sería error. (§375.a
// lo extiende en poetas a casi cualquier pasiva; en prosa, con la de
// infectum, el corpus no trae ni uno de los seis verbos.) La mitad
// de contraste va en presente, imperfecto y futuro de la pasiva, donde el
// corpus da 127 `ā/ab` y 1 dativo («ea mihi probantur», que es de
// juicio).
//
// ══ EL SEGUNDO CAMINO ═══════════════════════════════════════════════
//
// La FORMA: la máquina (gerundivo, pasiva, declinación). La REGLA: el
// treebank (`atestacion-perifrastica.json`), que no escribió nadie de aquí.
// Y la `ā` frente a `ab` ante la inicial del agente, también del corpus.
import atestacion from '../../lib/data/languages/la/atestacion-perifrastica.json';
import {
  conjugar, conjugarPasiva, declinar, declinarAdjetivo,
  type EntradaNominal, type EntradaVerbal, type Numero, type Persona, type Tiempo,
} from '../../lib/data/languages/la/paradigma-la';
import { gerundivo } from '../../lib/data/languages/la/participios';
import { NOMBRES_L1, VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { sinCantidad } from '../../lib/lang/ortografia-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { PERSONAS_ES, sintagmaEs, personasContraElLexicon, type Sujeto } from './gate-consecutio';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';
import type { SelloPerifrastica } from './atestar-perifrastica';

const AT = atestacion as unknown as SelloPerifrastica;

export type Construccion = 'perifrastica' | 'pasiva';

export interface ItemPerifrastica {
  id: string;
  punto: string;
  construccion: Construccion;
  tiempo: Tiempo;
  sujeto: Sujeto;
  verbo: EntradaVerbal;
  /** Lema del agente. Tiene que estar en `AGENTES_ES`. */
  agente: string;
  /** Lo que ve el alumno: SIN mácrones, como el texto real. */
  marco: string;
  marcoConCantidad: string;
  glosa: string;
  pista: string;
  respuesta: string;
  ejes: { construccion: Construccion; tiempo: Tiempo };
}

export type ClaseFalloPerifrastica =
  | 'clave-no-declarada' | 'punto-ajeno' | 'id-mal-formado' | 'respuesta-no-derivable' | 'marco-no-derivable'
  | 'marco-con-cantidad' | 'marco-fuera-de-l1' | 'marco-regala-la-forma' | 'glosa-no-derivable' | 'pista-no-derivable'
  | 'agente-no-declarado' | 'agente-ambiguo' | 'agente-admite-ab' | 'verbo-no-declarado' | 'sujeto-es-el-agente'
  | 'eje-mal-declarado' | 'regla-sin-atestiguar' | 'mitades-desiguales' | 'celda-sin-cubrir' | 'pista-de-marco'
  | 'par-de-reencuentro' | 'estrategia-ciega' | 'orden-publicado' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloPerifrastica { item: string; clase: ClaseFalloPerifrastica; detalle: string }

const CLAVES = new Set(['id', 'punto', 'construccion', 'tiempo', 'sujeto', 'verbo', 'agente', 'marco', 'marcoConCantidad', 'glosa', 'pista', 'respuesta', 'ejes']);

/** Los agentes, con su español. Lista CERRADA y contrastada con el lexicón
 *  (primera acepción, género). Todos de la 3.ª, por lo dicho arriba, y el
 *  gate lo comprueba sobre la forma y no sobre esta declaración. */
export const AGENTES_ES: Record<string, { es: string; genero: 'm' | 'f' }> = {
  pater: { es: 'padre', genero: 'm' },
  māter: { es: 'madre', genero: 'f' },
  frāter: { es: 'hermano', genero: 'm' },
};

/** Los verbos, con su infinitivo español (atado a la glosa del lexicón) y
 *  su participio. Ninguno admite un dativo que se lea como destinatario
 *  (ver cabecera). */
export const VERBO_ES: Record<string, { infinitivo: string; participio: string }> = {
  laudō: { infinitivo: 'alabar', participio: 'alabado' },
  vocō: { infinitivo: 'llamar', participio: 'llamado' },
  moneō: { infinitivo: 'advertir', participio: 'advertido' },
  exspectō: { infinitivo: 'esperar', participio: 'esperado' },
  salūtō: { infinitivo: 'saludar', participio: 'saludado' },
  custōdiō: { infinitivo: 'custodiar', participio: 'custodiado' }, // «guardado» de una persona, en México, es cosa almacenada
};

/** El español de la perífrasis, por construcción, tiempo y número. */
export const AUX_ES: Record<Construccion, Record<Tiempo, Record<Numero, string>>> = {
  perifrastica: {
    presente: { sg: 'debe ser', pl: 'deben ser' },
    imperfecto: { sg: 'debía ser', pl: 'debían ser' },
    futuro: { sg: 'deberá ser', pl: 'deberán ser' },
  },
  pasiva: {
    presente: { sg: 'es', pl: 'son' },
    imperfecto: { sg: 'era', pl: 'eran' },
    futuro: { sg: 'será', pl: 'serán' },
  },
};

const nombre = (l: string): EntradaNominal => {
  const n = NOMBRES_L1.find((x) => x.lema === l);
  if (!n) throw new Error(`«${l}» no está en NOMBRES_L1`);
  return n;
};
const SUM = VERBOS_L1.find((x) => x.lema === 'sum')!;
const persona = (n: Numero): Persona => (n === 'sg' ? '3sg' : '3pl');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** La preposición que el corpus pone ante la inicial del agente. */
export function preposicionAnte(forma: string): 'ā' | 'ab' | null {
  const ini = sinCantidad(forma).toLowerCase().charAt(0);
  const k = /[aeiouyh]/.test(ini) ? 'V/h' : ini;
  const c = AT.aAbPorInicial[k];
  if (!c) return null;
  if (c.ab === 0) return 'ā';
  if (c.a === 0) return 'ab';
  return null; // las dos atestiguadas: la clave única suspendería una (§D8)
}

export function respuestaDerivada(i: Pick<ItemPerifrastica, 'construccion' | 'agente'>): string | null {
  if (!AGENTES_ES[i.agente]) return null;
  const n = nombre(i.agente);
  if (i.construccion === 'perifrastica') return declinar(n, 'dat', 'sg');
  const abl = declinar(n, 'abl', 'sg');
  const p = preposicionAnte(abl);
  return p ? `${p} ${abl}` : null;
}

/** El verbo del marco: gerundivo concertado + sum, o la pasiva. */
export function verboDelMarco(i: ItemPerifrastica): string {
  const g = nombre(i.sujeto.lema).genero;
  if (i.construccion === 'pasiva') return conjugarPasiva(i.verbo, persona(i.sujeto.numero), i.tiempo);
  const ger = gerundivo(i.verbo).lema.normalize('NFC');
  const adj = declinarAdjetivo({ lema: ger, tema: ger.slice(0, -2), glosa: '' }, g, 'nom', i.sujeto.numero);
  return `${adj} ${conjugar(SUM, persona(i.sujeto.numero), i.tiempo)}`;
}

export function marcoDerivado(i: ItemPerifrastica): string {
  const s = declinar(nombre(i.sujeto.lema), 'nom', i.sujeto.numero);
  return `${cap(s)} ___ ${verboDelMarco(i)}.`;
}

export function participioEs(i: ItemPerifrastica): string | null {
  const v = VERBO_ES[i.verbo.lema];
  const p = PERSONAS_ES[i.sujeto.lema];
  if (!v || !p) return null;
  const base = v.participio.slice(0, -1);
  return `${base}${p.genero === 'f' ? 'a' : 'o'}${i.sujeto.numero === 'pl' ? 's' : ''}`;
}

export function glosaDerivada(i: ItemPerifrastica): string | null {
  const s = sintagmaEs(i.sujeto), part = participioEs(i), a = AGENTES_ES[i.agente];
  if (!s || !part || !a) return null;
  return `${cap(s)} ${AUX_ES[i.construccion][i.tiempo][i.sujeto.numero]} ${part} por ${a.genero === 'f' ? 'la' : 'el'} ${a.es}`;
}

/** La pista pide la forma NORMAL, porque la otra no es agramatical (ver
 *  cabecera). Idéntica en las dos mitades: si cambiara, diría cuál es. */
export const CONSIGNA = 'el agente en el caso habitual del latín clásico';
export const pistaDerivada = (i: ItemPerifrastica) => `${i.agente} · ${CONSIGNA}`;

/** El participio regular español, DERIVADO del infinitivo: el declarado
 *  en `VERBO_ES` tiene que coincidir. Sin esto «loado» pasaba con el
 *  infinitivo «alabar» (lo cazó el ataque por mutación). Los seis verbos
 *  son regulares; uno irregular («ver» → «visto») pondría esto en rojo y
 *  tendría que declararse aparte, a propósito. */
export function participioRegular(inf: string): string {
  const raiz = inf.slice(0, -2), term = inf.slice(-2);
  if (term === 'ar') return `${raiz}ado`;
  // «oír» → «oído», «leer» → «leído»: tras vocal, la í lleva tilde.
  if (/[aeo]$/u.test(raiz)) return `${raiz}ído`;
  return `${raiz}ido`;
}

/** Que las tablas no se separen del lexicón. */
export function tablasContraElLexicon(): string[] {
  const out = [...personasContraElLexicon()];
  for (const [l, a] of Object.entries(AGENTES_ES)) {
    const n = NOMBRES_L1.find((x) => x.lema === l);
    if (!n) { out.push(`${l}: no está en el lexicón`); continue; }
    if (n.glosa.split(',')[0]!.trim() !== a.es) out.push(`${l}: «${a.es}» y el lexicón dice «${n.glosa}»`);
    if (n.genero !== a.genero) out.push(`${l}: género ${a.genero} y el lexicón dice ${n.genero}`);
  }
  for (const [l, v] of Object.entries(VERBO_ES)) {
    const e = VERBOS_L1.find((x) => x.lema === l);
    if (!e) { out.push(`${l}: no está en el lexicón`); continue; }
    if (!e.glosa.split(',').map((x) => x.trim()).includes(v.infinitivo)) out.push(`${l}: «${v.infinitivo}» y el lexicón dice «${e.glosa}»`);
    if (participioRegular(v.infinitivo) !== v.participio)
      out.push(`${l}: el participio declarado es «${v.participio}» y el de «${v.infinitivo}» es «${participioRegular(v.infinitivo)}»`);
  }
  return out;
}

/** La regla, contra el sello: la construcción pide el caso que el corpus
 *  da en al menos cinco de cada seis agentes anotados. */
export const MAYORIA = 5 / 6;
export function atestiguada(c: Construccion): { a: number; b: number; ok: boolean } {
  const s = c === 'perifrastica' ? AT.porCabeza.gerundivoConSum : AT.porCabeza.infectumPasivo;
  const a = c === 'perifrastica' ? s.dativo : s.conAb;
  // Contra la regla se cuentan también los `ā` etiquetados `obl`: son
  // candidatos, no todos agentes, y sumarlos es la cuenta desfavorable.
  const b = c === 'perifrastica' ? s.conAb + s.conAbObl.length : s.dativo;
  return { a, b, ok: a + b >= 20 && a / (a + b) >= MAYORIA };
}

const palabras = (s: string) => s.replace('___', ' ').split(/[^\p{L}]+/u).filter(Boolean).map((w) => sinCantidad(w).toLowerCase());

export function revisarItemPerifrastica(i: ItemPerifrastica): FalloPerifrastica[] {
  const out: FalloPerifrastica[] = [];
  const push = (clase: ClaseFalloPerifrastica, detalle: string) => out.push({ item: i.id, clase, detalle });

  // Todo campo que el publicador puede servir y este gate no valida
  // (`alternativas`, `ejes.colapsaAlLeer`) es por donde el error diana se
  // publica como respuesta buena (§5.tricies novies).
  const extra = Object.keys(i).filter((k) => !CLAVES.has(k));
  if (extra.length) push('clave-no-declarada', `el ítem trae ${extra.join(', ')}, que el publicador puede servir y este gate no valida`);
  const extraEjes = Object.keys(i.ejes).filter((k) => k !== 'construccion' && k !== 'tiempo');
  if (extraEjes.length) push('clave-no-declarada', `los ejes traen ${extraEjes.join(', ')}`);
  if (i.punto !== 'l8-perifrastica-pasiva') push('punto-ajeno', `el punto es «${i.punto}»`);
  if (!/^la-pp-\d\d$|^[PQ]\d{1,2}$/u.test(i.id)) push('id-mal-formado', `id «${i.id}»`);
  if (i.ejes.construccion !== i.construccion || i.ejes.tiempo !== i.tiempo)
    push('eje-mal-declarado', `los ejes dicen ${i.ejes.construccion}/${i.ejes.tiempo} y el ítem es ${i.construccion}/${i.tiempo}`);

  if (!AGENTES_ES[i.agente]) { push('agente-no-declarado', `«${i.agente}» no está en AGENTES_ES`); return out; }
  if (!VERBO_ES[i.verbo.lema]) { push('verbo-no-declarado', `«${i.verbo.lema}» no está en VERBO_ES: o admite un dativo de destinatario o su español no está atado`); return out; }
  if (!PERSONAS_ES[i.sujeto.lema]) { push('glosa-no-derivable', `el sujeto «${i.sujeto.lema}» no está en PERSONAS_ES`); return out; }
  if (i.sujeto.lema === i.agente) push('sujeto-es-el-agente', `«${i.agente}» es sujeto y agente a la vez`);

  // EL AGENTE, SOBRE LA FORMA: dativo ≠ ablativo ≠ genitivo, sin mácrones.
  const ag = nombre(i.agente);
  const dat = sinCantidad(declinar(ag, 'dat', 'sg')), abl = sinCantidad(declinar(ag, 'abl', 'sg')), gen = sinCantidad(declinar(ag, 'gen', 'sg'));
  if (dat === abl) push('agente-ambiguo', `«${i.agente}»: dativo y ablativo son «${dat}»; sólo la preposición distinguiría la respuesta mala`);
  if (dat === gen) push('agente-ambiguo', `«${i.agente}»: dativo y genitivo son «${dat}»; el dativo se lee «de», y esa ambigüedad licencia ā + ablativo (A&G §374.a)`);
  if (preposicionAnte(declinar(ag, 'abl', 'sg')) === null)
    push('agente-admite-ab', `ante la inicial de «${declinar(ag, 'abl', 'sg')}» el corpus escribe «ā» y «ab»: la clave única suspendería una`);

  const r = respuestaDerivada(i);
  if (r === null) push('respuesta-no-derivable', `no se deriva la respuesta de «${i.agente}» en ${i.construccion}`);
  else if (r !== i.respuesta) push('respuesta-no-derivable', `la respuesta es «${i.respuesta}» y en ${i.construccion} se deriva «${r}»`);

  const m = marcoDerivado(i);
  if (m !== i.marcoConCantidad) push('marco-no-derivable', `el marco con cantidad es «${i.marcoConCantidad}» y se deriva «${m}»`);
  if (sinCantidad(i.marcoConCantidad) !== i.marco)
    push('marco-con-cantidad', `el marco que ve el alumno tiene que ser «${sinCantidad(i.marcoConCantidad)}» y es «${i.marco}»`);
  const d = palabrasDesconocidas(i.marcoConCantidad);
  if (d.length) push('marco-fuera-de-l1', `el marco usa palabras que la máquina no produce: ${d.join(', ')}`);
  const pm = palabras(i.marco);
  if (pm.includes(dat) || pm.includes(abl)) push('marco-regala-la-forma', `el marco ya trae una forma del agente`);

  const g = glosaDerivada(i);
  if (g === null) push('glosa-no-derivable', `sin español para «${i.sujeto.lema}» o «${i.verbo.lema}»`);
  else if (g !== i.glosa) push('glosa-no-derivable', `la glosa es «${i.glosa}» y se deriva «${g}»`);
  if (i.pista !== pistaDerivada(i)) push('pista-no-derivable', `la pista es «${i.pista}» y tiene que ser «${pistaDerivada(i)}»`);

  const at = atestiguada(i.construccion);
  if (!at.ok) push('regla-sin-atestiguar', `${i.construccion}: el corpus da ${at.a} contra ${at.b}, por debajo de ${(100 * MAYORIA).toFixed(0)} % o con menos de 20 casos`);
  return out;
}

/** Las rutas que contestan sin la regla. Cada una devuelve la RESPUESTA
 *  que escribiría, y se compara con la clave. */
export const RUTAS: Record<string, (i: ItemPerifrastica) => string | null> = {
  // El español dice «por» en las doce: traducirlo es ā + ablativo.
  'siempre ā + ablativo (el «por» español)': (i) => respuestaDerivada({ ...i, construccion: 'pasiva' }),
  'siempre dativo': (i) => respuestaDerivada({ ...i, construccion: 'perifrastica' }),
};

/** Techos ABSOLUTOS (§B7): con dos salidas el azar es 0,5. */
export const TECHO: Record<string, number> = {
  'siempre ā + ablativo (el «por» español)': 0.6,
  'siempre dativo': 0.6,
};

export function tasasPerifrastica(items: ItemPerifrastica[]): Record<string, number> {
  return Object.fromEntries(Object.entries(RUTAS).map(([k, f]) =>
    [k, items.length === 0 ? 0 : items.filter((i) => f(i) === i.respuesta).length / items.length]));
}

export function coberturaPerifrastica(items: ItemPerifrastica[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'la respuesta contra la máquina', decididos: items.filter((i) => respuestaDerivada(i) === i.respuesta).length, total: n },
    { comprobacion: 'las dos construcciones', decididos: new Set(items.map((i) => i.construccion)).size, total: 2 },
    { comprobacion: 'la mitad que el español NO regala (perifrástica)',
      decididos: items.filter((i) => i.construccion === 'perifrastica').length, total: n,
      motivoDeLosQueQuedanFuera: 'la pasiva ordinaria es transferencia pura —«por el padre» → «ā patre»—; está para que el lote no enseñe «el agente siempre en dativo» (§D6)' },
    { comprobacion: 'ā + ablativo con gerundivo por ambigüedad o énfasis (A&G §374 N.1)',
      decididos: 0, total: n,
      elCeroEsUnResultado: 'la excepción existe (A&G §374 N.1: ambigüedad o énfasis) y el lote no la examina: el lexicón no tiene ningún verbo de dativo con glosa (pāreō, persuādeō, parcō no están; crēdō, imperō y cōnfīdō son importados sin glosa, §5.tricies octies). El ítem no la castiga como error: pide la forma NORMAL, y la pista lo dice',
      motivoDeLosQueQuedanFuera: 'falta el léxico, no la máquina' },
  ];
}

const PERIF = (i: ItemPerifrastica) => i.construccion === 'perifrastica';

export function revisarLotePerifrastica(items: ItemPerifrastica[]): FalloPerifrastica[] {
  const out: FalloPerifrastica[] = items.flatMap(revisarItemPerifrastica);
  for (const d of tablasContraElLexicon()) out.push({ item: '(tabla)', clase: 'glosa-no-derivable', detalle: d });
  const ids = items.map((i) => i.id);
  if (new Set(ids).size !== ids.length) out.push({ item: '(lote)', clase: 'id-mal-formado', detalle: 'ids repetidos' });
  const pantallas = items.map((i) => `${i.marco}⟦${i.glosa}·${i.pista}⟧`);
  if (new Set(pantallas).size !== pantallas.length) out.push({ item: '(lote)', clase: 'pista-de-marco', detalle: 'dos ítems con la misma pantalla' });
  for (const c of revisarCobertura(coberturaPerifrastica(items))) out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  // §D6: dos salidas, mitad y mitad. Y 2k: al menos dos por mitad.
  const p = items.filter(PERIF).length, q = items.length - p;
  if (p !== q) out.push({ item: '(lote)', clase: 'mitades-desiguales', detalle: `${p} perifrásticas y ${q} pasivas: la ruta de la mayoría pasa del azar` });
  if (p < 2 || q < 2) out.push({ item: '(lote)', clase: 'celda-sin-cubrir', detalle: `${p} perifrásticas y ${q} pasivas; hacen falta 2 de cada` });

  const t = tasasPerifrastica(items);
  for (const [k, v] of Object.entries(t))
    if (v > TECHO[k]!) out.push({ item: '(lote)', clase: 'estrategia-ciega', detalle: `«${k}» acierta el ${(100 * v).toFixed(0)} % de ${items.length} (techo ${TECHO[k]})` });

  // PISTAS DEL MARCO: todo valor que se repite tiene que salir en las DOS
  // mitades, o predice la construcción —y con ella el caso— sin leer.
  const molestias: [string, (i: ItemPerifrastica) => string][] = [
    ['agente', (i) => i.agente], ['verbo', (i) => i.verbo.lema], ['sujeto', (i) => i.sujeto.lema],
    ['tiempo', (i) => i.tiempo], ['número del sujeto', (i) => i.sujeto.numero],
    ['género español del sujeto', (i) => PERSONAS_ES[i.sujeto.lema]?.genero ?? '?'],
    ['género del agente', (i) => AGENTES_ES[i.agente]?.genero ?? '?'],
  ];
  for (const [nom, f] of molestias) {
    const por = new Map<string, ItemPerifrastica[]>();
    for (const i of items) por.set(f(i), [...(por.get(f(i)) ?? []), i]);
    for (const [v, xs] of por) {
      if (xs.length < 2) continue;
      if (new Set(xs.map(PERIF)).size < 2)
        out.push({ item: '(lote)', clase: 'pista-de-marco', detalle: `${nom} «${v}» sale ${xs.length} veces y siempre en ${PERIF(xs[0]!) ? 'perifrástica' : 'pasiva'}: predice el caso sin leer el latín` });
    }
  }

  // Y POR PARES DE RASGOS. Cada rasgo repartido por igual no basta: en
  // `l7-consecutio` cada verbo variaba en los dos ejes y aun así verbo +
  // etiqueta daba la casilla, 16 de 16 (la DIAGONAL, §C5). Aquí el
  // equivalente es una combinación —«imperfecto y plural»— que sólo sale
  // en una mitad.
  for (let a = 0; a < molestias.length; a++) for (let b = a + 1; b < molestias.length; b++) {
    const [na, fa] = molestias[a]!, [nb, fb] = molestias[b]!;
    const por = new Map<string, ItemPerifrastica[]>();
    for (const i of items) { const k = `${fa(i)}+${fb(i)}`; por.set(k, [...(por.get(k) ?? []), i]); }
    for (const [v, xs] of por) {
      if (xs.length < 2) continue;
      if (new Set(xs.map(PERIF)).size < 2)
        out.push({ item: '(lote)', clase: 'pista-de-marco', detalle: `${na} + ${nb} «${v}» sale ${xs.length} veces y siempre en ${PERIF(xs[0]!) ? 'perifrástica' : 'pasiva'}: la combinación predice el caso` });
    }
  }

  // EL REENCUENTRO (§5.tricies ter): dos ítems de mitades distintas con el
  // mismo verbo Y el mismo agente se reconocen, y «lo contrario de la vez
  // anterior» acierta el segundo sin leer. Se prohíbe el par.
  for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) {
    const x = items[a]!, y = items[b]!;
    if (x.verbo.lema === y.verbo.lema && x.agente === y.agente)
      out.push({ item: '(lote)', clase: 'par-de-reencuentro', detalle: `${x.id} y ${y.id} comparten verbo «${x.verbo.lema}» y agente «${x.agente}»` });
    if (x.verbo.lema === y.verbo.lema && x.sujeto.lema === y.sujeto.lema)
      out.push({ item: '(lote)', clase: 'par-de-reencuentro', detalle: `${x.id} y ${y.id} comparten verbo «${x.verbo.lema}» y sujeto «${x.sujeto.lema}»` });
  }

  const sep = separablePorPosicion(patronDe(items, PERIF));
  if (sep) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `se separa por la posición: ${sep}` });
  return out;
}

export const LO_QUE_DICE_EL_CORPUS = AT;

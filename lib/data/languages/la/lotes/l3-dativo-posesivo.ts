// lib/data/languages/la/lotes/l3-dativo-posesivo.ts
//
// `l3-dativo-posesivo` — «mihi liber est» = «TENGO un libro».
//
//     OCHO PARES, 16 ÍTEMS. Cada par es la misma frase con dos verbos:
//
//       Puero nomen est.      «El niño tiene un nombre.»
//       Puero nomen dicit.    «Le dice el nombre al niño.»
//
//     El dativo es el mismo; lo que cambia la lectura es el VERBO.
//
// ── POR QUÉ LA MITAD NO ES POSESIVA ──────────────────────────────────
//
// Un lote de sólo dativos posesivos instala «dativo ⇒ tener», que es peor
// que la regla que quita: en este nivel el dativo es, casi siempre, un
// complemento indirecto corriente —y `l3-dativo-ci` es el prerrequisito
// declarado de este punto—. Con dos lecturas las dos rutas ciegas son
// complementarias y suman 1, así que la única salida es ocho y ocho.
//
// ── EL PAR MÍNIMO SÓLO EXISTE CON UN NEUTRO ──────────────────────────
//
// Con `sum` el poseído es el SUJETO y va en nominativo; con un transitivo
// es el OBJETO y va en acusativo. El neutro es la única clase donde esas
// dos casillas coinciden, así que sólo con un neutro las dos frases del par
// difieren en UNA palabra. Con `filius`/`filium` y `rosae`/`rosas` la
// lengua obliga a cambiar dos.
//
// Los dos pares no mínimos están a propósito y no como concesión: **son
// los únicos que enseñan que el poseído de «mihi … est» es el sujeto de la
// frase**, que es medio punto. Un lote de puros neutros habría salido más
// limpio y habría enseñado menos.
//
// ── LA CONCORDANCIA CRUZADA, EN LAS DOS DIRECCIONES ──────────────────
//
// El verbo latino concuerda con el poseído y el español con el poseedor,
// así que el número salta de sitio al traducir:
//
//     Regi signa SUNT.     →  «el rey TIENE señales»        pl → sg
//     Pueris donum EST.    →  «los niños TIENEN un regalo»  sg → pl
//
// Las dos direcciones están en el lote porque con una sola el cruce sería
// una constante y no un contraste (§D5). El gate lo comprueba por ítem.
//
// ── EL MACRÓN ────────────────────────────────────────────────────────
//
// El marco va sin cantidad —0 macrones en 227.301 tokens del corpus— y
// `latinConCantidad` lleva la versión que se enseña al corregir.
import type { ItemDativoPosesivo } from '../../../../../scripts/lib/gate-dativo-posesivo';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Caso, Numero } from '../paradigma-la';

/** Encontrada contra TRES condiciones: el detector de posición, la
 *  adyacencia de los pares y el piso de distancia de `coste-del-par.ts`.
 *  La tercera sale del mismo sitio que la de `l4-reflexivo`: un lote de
 *  pares repite el marco, y «lo contrario de la vez anterior» tiene techo
 *  0,75 y no se apaga barajando. Lo único que sube es lo que cuesta
 *  reconocer el marco. Con esta semilla la distancia mínima es 3. */
export const SEMILLA_DE_ORDEN = 10;

type Par = {
  id: string;
  /** `{{}}` es el verbo; `[[]]` el poseído, que cambia de caso cuando el
   *  poseído no es neutro. */
  marco: string;
  marcoConCantidad: string;
  verboPos: string; verboCi: string; verboCiConCantidad: string;
  poseidoNom: string; poseidoNomConCantidad: string;
  poseidoAc: string; poseidoAcConCantidad: string;
  poseido: { lema: string; numero: Numero; enEspanol: string };
  dativo: { forma: string; lema: string; numero: Numero; persona: 1 | 2 | 3; enEspanol?: string };
  parMinimo: boolean;
  respuestaPos: string; dianaPos: string;
  respuestaCi: string;
};

const PARES: Par[] = [
  // ── LOS CUATRO MÍNIMOS: poseído NEUTRO ──
  { id: 'n1', parMinimo: true,
    marco: 'Puero [[]] {{}}.', marcoConCantidad: 'Puerō [[]] {{}}.',
    verboPos: 'est', verboCi: 'dicit', verboCiConCantidad: 'dīcit',
    poseidoNom: 'nomen', poseidoNomConCantidad: 'nōmen',
    poseidoAc: 'nomen', poseidoAcConCantidad: 'nōmen',
    poseido: { lema: 'nōmen', numero: 'sg', enEspanol: 'nombre' },
    dativo: { forma: 'puero', lema: 'puer', numero: 'sg', persona: 3, enEspanol: 'niño' },
    respuestaPos: 'El niño tiene un nombre.', dianaPos: 'El nombre es para el niño.',
    respuestaCi: 'Le dice el nombre al niño.' },

  // LA PRIMERA PERSONA. El español la marca en el verbo («tengo») y por
  // eso aquí no hay cruce de número que comprobar: la persona ya lo dice.
  { id: 'n2', parMinimo: true,
    marco: 'Mihi [[]] {{}}.', marcoConCantidad: 'Mihi [[]] {{}}.',
    verboPos: 'est', verboCi: 'portat', verboCiConCantidad: 'portat',
    poseidoNom: 'gaudium', poseidoNomConCantidad: 'gaudium',
    poseidoAc: 'gaudium', poseidoAcConCantidad: 'gaudium',
    poseido: { lema: 'gaudium', numero: 'sg', enEspanol: 'alegría' },
    dativo: { forma: 'mihi', lema: 'ego', numero: 'sg', persona: 1 },
    respuestaPos: 'Tengo alegría.', dianaPos: 'La alegría es para mí.',
    respuestaCi: 'Me trae alegría.' },

  // EL CRUCE, DIRECCIÓN PLURAL → SINGULAR. `sunt` es plural porque las
  // señales son el sujeto; el español dice «tiene» porque el rey es uno.
  { id: 'n3', parMinimo: true,
    marco: 'Regi [[]] {{}}.', marcoConCantidad: 'Rēgī [[]] {{}}.',
    verboPos: 'sunt', verboCi: 'mittit', verboCiConCantidad: 'mittit',
    poseidoNom: 'signa', poseidoNomConCantidad: 'signa',
    poseidoAc: 'signa', poseidoAcConCantidad: 'signa',
    poseido: { lema: 'signum', numero: 'pl', enEspanol: 'señales' },
    dativo: { forma: 'regi', lema: 'rēx', numero: 'sg', persona: 3, enEspanol: 'rey' },
    respuestaPos: 'El rey tiene señales.', dianaPos: 'Las señales son para el rey.',
    respuestaCi: 'Le envía señales al rey.' },

  // Y LA DIRECCIÓN CONTRARIA, singular → plural. Sin este par el cruce
  // sería una constante del lote y no un contraste.
  { id: 'n4', parMinimo: true,
    marco: 'Pueris [[]] {{}}.', marcoConCantidad: 'Puerīs [[]] {{}}.',
    verboPos: 'est', verboCi: 'dicit', verboCiConCantidad: 'dīcit',
    poseidoNom: 'nomen', poseidoNomConCantidad: 'nōmen',
    poseidoAc: 'nomen', poseidoAcConCantidad: 'nōmen',
    poseido: { lema: 'nōmen', numero: 'sg', enEspanol: 'nombre' },
    dativo: { forma: 'pueris', lema: 'puer', numero: 'pl', persona: 3, enEspanol: 'niños' },
    respuestaPos: 'Los niños tienen un nombre.', dianaPos: 'El nombre es para los niños.',
    respuestaCi: 'Les dice el nombre a los niños.' },

  // ── LA SEGUNDA Y LA PRIMERA DEL PLURAL ──
  // Mismo sustantivo que `n1` y `n2` a propósito: lo único que cambia es
  // la PERSONA del dativo, que es la mitad del `varia`.
  { id: 't1', parMinimo: true,
    marco: 'Tibi [[]] {{}}.', marcoConCantidad: 'Tibi [[]] {{}}.',
    verboPos: 'est', verboCi: 'dicit', verboCiConCantidad: 'dīcit',
    poseidoNom: 'nomen', poseidoNomConCantidad: 'nōmen',
    poseidoAc: 'nomen', poseidoAcConCantidad: 'nōmen',
    poseido: { lema: 'nōmen', numero: 'sg', enEspanol: 'nombre' },
    dativo: { forma: 'tibi', lema: 'tū', numero: 'sg', persona: 2 },
    respuestaPos: 'Tienes un nombre.', dianaPos: 'El nombre es para ti.',
    respuestaCi: 'Te dice el nombre.' },

  { id: 'b1', parMinimo: true,
    marco: 'Nobis [[]] {{}}.', marcoConCantidad: 'Nōbīs [[]] {{}}.',
    verboPos: 'est', verboCi: 'portat', verboCiConCantidad: 'portat',
    poseidoNom: 'gaudium', poseidoNomConCantidad: 'gaudium',
    poseidoAc: 'gaudium', poseidoAcConCantidad: 'gaudium',
    poseido: { lema: 'gaudium', numero: 'sg', enEspanol: 'alegría' },
    dativo: { forma: 'nobis', lema: 'nōs', numero: 'pl', persona: 1 },
    respuestaPos: 'Tenemos alegría.', dianaPos: 'La alegría es para nosotros.',
    respuestaCi: 'Nos trae alegría.' },

  // ── LOS DOS NO MÍNIMOS: poseído MASCULINO y FEMENINO ──
  // Aquí el poseído cambia de forma con el verbo, y eso es exactamente lo
  // que enseñan: con `est` es el SUJETO.
  { id: 'm1', parMinimo: false,
    marco: 'Regi [[]] {{}}.', marcoConCantidad: 'Rēgī [[]] {{}}.',
    verboPos: 'est', verboCi: 'mittit', verboCiConCantidad: 'mittit',
    poseidoNom: 'filius', poseidoNomConCantidad: 'fīlius',
    poseidoAc: 'filium', poseidoAcConCantidad: 'fīlium',
    poseido: { lema: 'fīlius', numero: 'sg', enEspanol: 'hijo' },
    dativo: { forma: 'regi', lema: 'rēx', numero: 'sg', persona: 3, enEspanol: 'rey' },
    respuestaPos: 'El rey tiene un hijo.', dianaPos: 'El hijo es para el rey.',
    respuestaCi: 'Le envía un hijo al rey.' },

  { id: 'f1', parMinimo: false,
    marco: 'Matri [[]] {{}}.', marcoConCantidad: 'Mātrī [[]] {{}}.',
    verboPos: 'sunt', verboCi: 'portat', verboCiConCantidad: 'portat',
    poseidoNom: 'rosae', poseidoNomConCantidad: 'rosae',
    poseidoAc: 'rosas', poseidoAcConCantidad: 'rosās',
    poseido: { lema: 'rosa', numero: 'pl', enEspanol: 'rosas' },
    dativo: { forma: 'matri', lema: 'māter', numero: 'sg', persona: 3, enEspanol: 'madre' },
    respuestaPos: 'La madre tiene rosas.', dianaPos: 'Las rosas son para la madre.',
    respuestaCi: 'Le lleva rosas a la madre.' },
];

function itemsDe(p: Par): ItemDativoPosesivo[] {
  const comun = { punto: 'l3-dativo-posesivo', pareja: p.id, parMinimo: p.parMinimo, dativo: p.dativo };
  const arma = (marco: string, poseido: string, verbo: string) =>
    marco.replace('[[]]', poseido).replace('{{}}', verbo);
  return [
    { ...comun, id: `${p.id}-a`, lectura: 'posesion',
      latin: arma(p.marco, p.poseidoNom, p.verboPos),
      latinConCantidad: arma(p.marcoConCantidad, p.poseidoNomConCantidad, p.verboPos),
      verbo: p.verboPos,
      poseido: { lema: p.poseido.lema, caso: 'nom' as Caso, numero: p.poseido.numero, enEspanol: p.poseido.enEspanol },
      respuesta: p.respuestaPos, elErrorDiana: p.dianaPos },
    { ...comun, id: `${p.id}-b`, lectura: 'ci',
      latin: arma(p.marco, p.poseidoAc, p.verboCi),
      latinConCantidad: arma(p.marcoConCantidad, p.poseidoAcConCantidad, p.verboCiConCantidad),
      verbo: p.verboCi,
      poseido: { lema: p.poseido.lema, caso: 'ac' as Caso, numero: p.poseido.numero, enEspanol: p.poseido.enEspanol },
      respuesta: p.respuestaCi, elErrorDiana: p.respuestaPos },
  ];
}

const FUENTE: ItemDativoPosesivo[] = PARES.flatMap(itemsDe);

// EL `id` NO PUEDE CANTAR LA LECTURA. Escritos `n1-a`/`n1-b`, el sufijo
// coincidía con ella en 16 de 16. Se numeran por el ORDEN PUBLICADO, que
// ya está vigilado por el detector de posición y por el piso de distancia.
export const LOTE_DATIVO_POSESIVO: ItemDativoPosesivo[] = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN)
  .map((i, k) => ({ ...i, id: `la-dp-${String(k + 1).padStart(2, '0')}` }));

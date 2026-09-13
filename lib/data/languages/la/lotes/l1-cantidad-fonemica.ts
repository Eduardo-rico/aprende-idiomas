// lib/data/languages/la/lotes/l1-cantidad-fonemica.ts
//
// PRIMER LOTE DE LA CANTIDAD FONÉMICA. Punto: `l1-cantidad-fonemica`.
//
// «mălus (malo) frente a mālus (manzano); vĕnit (viene) frente a vēnit
// (vino). El español no distingue cantidad y el alumno no la oye ni la
// busca.»
//
// ── LOS PARES NO SE LISTAN: SE BUSCAN ────────────────────────────────
//
// Un par mínimo es una cadena que **sin mácrones es la misma** y con ellos
// son dos formas. Eso es una pregunta mecánica sobre el dominio, así que la
// contesta el dominio: `pares-de-cantidad.ts` encuentra **61** sobre las
// 2.835 formas, y los clasifica solo —morfológico si los dos miembros
// vienen del mismo lema, léxico si vienen de dos—.
//
// ── Y LAS CUENTAS NO VALEN POR CADENA, QUE ES LO QUE COSTÓ ───────────
//
// El corpus NO lleva mácrones, así que buscar `venit` y `vēnit` por texto
// devuelve 236 para las dos: **el mismo número dos veces**, que es la
// señal de que la comprobación no está contestando. Un gate que exigiera
// «los dos miembros atestiguados» con esa cuenta aprobaría siempre.
//
// Contados por la ANOTACIÓN del treebank —`Tense=Pres` contra `Tense=Past`,
// `Case=Nom` contra `Case=Abl`— salen de verdad:
//
//     venit ×52   vs  vēnit ×184        hōc ×236  vs  hoc ×143
//     terra ×34   vs  terrā ×74         causa ×28 vs  causā ×129
//
// De los 61 pares, **34 tienen los dos miembros contados y por encima de
// cero**; los demás salen de casillas que no se saben traducir a rasgos UD
// y van con `null`, que no es lo mismo que cero.
//
// ── EL SUELO ES EXACTAMENTE LA MITAD, Y POR ESO EL UMBRAL ES OTRO ────
//
// Cada par tiene dos miembros y uno se escribe sin mácrón: quien no ponga
// ninguno acierta el 50 % y quien los ponga todos, el otro 50 %. Las dos
// estrategias son complementarias y **el máximo nunca baja de la mitad**,
// así que pedirles que bajen sería un gate imposible —ya pasó con el
// acento—. Lo que se pide es el EQUILIBRIO, y va absoluto: 6 y 6.
//
// ── LOS TRES LÉXICOS SON MÁS CAROS QUE LOS NUEVE MORFOLÓGICOS ────────
//
// En el morfológico basta con saber la casilla. En el léxico hay que saber
// además **de qué palabra viene**: `lēgis` es el genitivo de `lēx` y
// `legis` la segunda persona de `legō`, y no se parecen en nada salvo en
// cómo se escriben sin mácrones.
import type { ItemCantidad } from '../../../../../scripts/lib/gate-cantidad-fonemica';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { parDe } from '../pares-de-cantidad';

/** La vocal DIANA es la de la posición donde los dos miembros difieren, y
 *  no «alguna del final»: `legēs` tiene `ē` en la desinencia y la vocal que
 *  lo separa de `lēgēs` es la primera, que ahí es breve. */
function dianaEsLarga(sinMacrones: string, respuesta: string): boolean {
  const par = parDe(sinMacrones);
  if (!par) return false;
  const v = respuesta.normalize('NFC')[par.posicion];
  return v !== undefined && /[āēīōūȳ]/.test(v);
}

type Def = [id: string, sinMacrones: string, respuesta: string, elOtro: string,
            tipo: 'lexico' | 'morfologico', vocal: string,
            marco: string, pista: string, glosa: string];

const DEFS: Def[] = [
  // ── CON MÁCRÓN (6) ──
  ['la-cf-01', 'legis', 'lēgis', 'legis', 'lexico', 'e', 'Cūra ___ magna est.',
   'genitivo singular de «lēx», la ley — NO la segunda persona de «legō»', 'El cuidado de la ley es grande.'],
  ['la-cf-02', 'misero', 'mīserō', 'miserō', 'lexico', 'i', 'Ego servum ___.',
   'futuro perfecto de «mittō», enviar — NO el dativo de «miser»', 'Yo habré enviado al siervo.'],
  ['la-cf-03', 'invenit', 'invēnit', 'invenit', 'morfologico', 'e', 'Rēx aquam ___.',
   'PERFECTO, 3.ª del singular de «inveniō»', 'El rey encontró el agua.'],
  ['la-cf-04', 'causa', 'causā', 'causa', 'morfologico', 'a', 'Dē ___ dīcit.',
   'ablativo singular de «causa»', 'Habla sobre el motivo.'],
  ['la-cf-05', 'spiritus', 'spīritūs', 'spīritus', 'morfologico', 'u', 'Gaudium ___ magnum est.',
   'genitivo singular de «spīritus», de la 4.ª', 'La alegría del espíritu es grande.'],
  ['la-cf-06', 'magna', 'magnā', 'magna', 'morfologico', 'a', 'Cum ___ cūrā labōrat.',
   'ablativo femenino singular de «magnus», concordando con «cūrā»', 'Trabaja con gran cuidado.'],

  // ── SIN MÁCRÓN (6) ──
  ['la-cf-07', 'leges', 'legēs', 'lēgēs', 'lexico', 'e', 'Nōmen ___.',
   'futuro, 2.ª del singular de «legō», leer — NO el nominativo plural de «lēx»', 'Leerás el nombre.'],
  ['la-cf-08', 'venit', 'venit', 'vēnit', 'morfologico', 'e', 'Rēgīna ad urbem ___.',
   'PRESENTE, 3.ª del singular de «veniō»', 'La reina viene a la ciudad.'],
  ['la-cf-09', 'terra', 'terra', 'terrā', 'morfologico', 'a', '___ magna est.',
   'nominativo singular del nombre de la 1.ª que significa «tierra» — el ablativo es el que lleva la larga', 'La tierra es grande.'],
  ['la-cf-10', 'hoc', 'hoc', 'hōc', 'morfologico', 'o', '___ bonum est.',
   'nominativo NEUTRO singular de «hic» — NO el ablativo masculino', 'Esto es bueno.'],
  ['la-cf-11', 'domus', 'domus', 'domūs', 'morfologico', 'u', '___ bona est.',
   'nominativo singular del nombre de la 4.ª que significa «casa»', 'La casa es buena.'],
  ['la-cf-12', 'ea', 'ea', 'eā', 'morfologico', 'a', '___ rēgīna est.',
   'nominativo femenino singular del pronombre que se cita «is, id»', 'Ella es la reina.'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemCantidad[] = DEFS.map(([id, sinMacrones, respuesta, elOtro, tipo, vocal, marco, pista, glosa]) => ({
  id, punto: 'l1-cantidad-fonemica', sinMacrones, respuesta, elOtro, marco, pista, glosa,
  ejes: { tipo, vocal, dianaLarga: dianaEsLarga(sinMacrones, respuesta) },
}));

export const LOTE_CANTIDAD_FONEMICA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

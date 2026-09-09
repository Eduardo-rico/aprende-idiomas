// lib/data/languages/la/lotes/l5-sum-y-compuestos.ts
//
// PRIMER LOTE DE `sum` Y SUS COMPUESTOS. Punto: `l5-sum-y-compuestos`.
//
// «sum/es/est, possum (pot- + sum), adsum, absum, prōsum. Irregular,
// altísima frecuencia, y con la asimilación de possum como única
// complicación.» `varia`: el compuesto y la persona.
//
// ── LA «ÚNICA COMPLICACIÓN» SON DOS, Y LA SEGUNDA NO ES ASIMILACIÓN ──
//
// El punto nombra la de `possum` y tiene razón en que es la que más se ve
// —890 apariciones—: el prefijo es `pot-` y ante la `s-` de `sum` la `t` se
// asimila, «pot+sum» → «possum», mientras que ante vocal reaparece,
// «potest».
//
// Pero `prōsum` hace otra cosa distinta: ante vocal aparece una `-d-` que no
// está en el prefijo suelto, «prōd+est» → «prōdest». **Eso no es una
// asimilación sino una consonante de enlace**, y llamarlas igual haría
// esperar que `adsum` hiciera *«addest». No lo hace: `adest`.
//
// Por eso la tabla declara DOS alomorfos por compuesto en vez de una regla,
// y concatenar a ciegas —que es lo que un alumno hará— da *«potsum» y
// *«prōest», que no existen. El lote trae los tres casos: el que asimila, el
// que inserta y los tres que no hacen nada.
//
// ── EL CONTRASTE QUE HACE FALTA ──────────────────────────────────────
//
// Sin los compuestos «aburridos» —`adsum`, `absum`, `dēsum`— el alumno
// aprendería que los prefijos siempre cambian algo. Tres de los cinco no
// cambian nada, y eso es tan parte del punto como lo otro.
import type { Persona } from '../paradigma-la';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { COMPUESTOS_DE_SUM, conjugarCompuesto, type CompuestoDeSum } from '../compuestos-de-sum';
import { VERBOS_L1 } from '../lexicon-l1';
import { conjugar } from '../paradigma-la';

const C = (l: string) => COMPUESTOS_DE_SUM.find((x) => x.lema === l)!;
const SUM = VERBOS_L1.find((v) => v.lema === 'sum')!;

export interface ItemSum {
  id: string;
  punto: string;
  /** `null` para el propio `sum`. */
  compuesto: CompuestoDeSum | null;
  persona: Persona;
  tiempo: 'presente' | 'imperfecto' | 'futuro';
  marco: string;
  glosa: string;
  respuesta: string;
  ejes: {
    /** Si la forma lleva el alomorfo de ante vocal o el de ante consonante.
     *  Es el eje real del punto: sólo ahí se ve el cambio. */
    anteVocal: boolean;
    /** Si ese compuesto cambia algo entre los dos alomorfos. */
    cambia: boolean;
  };
}

type Def = [id: string, lema: string | null, persona: Persona,
            tiempo: ItemSum['tiempo'], marco: string, glosa: string];

const DEFS: Def[] = [
  // ── `sum` a secas ──
  ['la-5s-01', null, '1sg', 'presente', 'In templo ___.', 'Estoy en el templo.'],
  ['la-5s-02', null, '3pl', 'presente', 'In agro ___.', 'Están en el campo.'],
  ['la-5s-03', null, '2sg', 'imperfecto', 'In urbe ___.', 'Estabas en la ciudad.'],

  // ── `possum`: asimila ante consonante, reaparece ante vocal ──
  ['la-5s-04', 'possum', '1sg', 'presente', 'Verba legere ___.', 'Puedo leer las palabras.'],
  ['la-5s-05', 'possum', '3sg', 'presente', 'Verba legere ___.', 'Puede leer las palabras.'],
  ['la-5s-06', 'possum', '1pl', 'presente', 'Verba legere ___.', 'Podemos leer las palabras.'],
  ['la-5s-07', 'possum', '2pl', 'presente', 'Verba legere ___.', 'Pueden leer las palabras.'],
  ['la-5s-08', 'possum', '3sg', 'imperfecto', 'Verba legere ___.', 'Podía leer las palabras.'],

  // ── `prōsum`: inserta una -d- que no es asimilación ──
  ['la-5s-09', 'prōsum', '3sg', 'presente', 'Poetae ___.', 'Es útil al poeta.'],
  ['la-5s-10', 'prōsum', '3pl', 'presente', 'Poetis ___.', 'Son útiles a los poetas.'],

  // ── LOS QUE NO CAMBIAN NADA · el contraste ──
  ['la-5s-11', 'adsum', '3sg', 'presente', 'In templo ___.', 'Está presente en el templo.'],
  ['la-5s-12', 'adsum', '1pl', 'presente', 'In templo ___.', 'Estamos presentes en el templo.'],
  ['la-5s-13', 'absum', '3sg', 'presente', 'A templo ___.', 'Está ausente del templo.'],
  ['la-5s-14', 'dēsum', '3pl', 'presente', 'Verba ___.', 'Faltan las palabras.'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemSum[] = DEFS.map(([id, lema, persona, tiempo, marco, glosa]) => {
  const compuesto = lema ? C(lema) : null;
  const base = conjugar(SUM, persona, tiempo).normalize('NFC');
  const anteVocal = /^[aeiouāēīōū]/.test(base);
  return {
    id, punto: 'l5-sum-y-compuestos', compuesto, persona, tiempo, marco, glosa,
    respuesta: compuesto ? conjugarCompuesto(compuesto, persona, tiempo) : conjugar(SUM, persona, tiempo),
    ejes: {
      anteVocal,
      cambia: compuesto ? compuesto.anteConsonante !== compuesto.anteVocal : false,
    },
  };
});

export const LOTE_SUM = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// lib/data/languages/la/lotes/l2-genero-3a.ts
//
// PRIMER LOTE DEL GÉNERO DE LA 3.ª. Punto: `l2-genero-3a`.
//
// «mōns es masculino, mēns femenino, mare neutro, y las tres terminan igual
// de poco informativas. El género se guarda con el lema.» `varia`: el género
// **y si coincide o no con el del descendiente español, que es de donde
// viene el error**.
//
// ── EL EJE ES EL DESCENDIENTE, NO LA TERMINACIÓN ─────────────────────
//
// Que la terminación no informe es sólo la mitad: el alumno no está
// adivinando al azar, está **usando el género de la palabra española que
// conoce**, y ésa es la que acierta o falla.
//
//     rēx → «el rey» (m)        latín m   ✓ coincide
//     lēx → «la ley» (f)        latín f   ✓
//     vōx → «la voz» (f)        latín f   ✓   ← y las tres acaban en -x/-s
//     arbor → «el árbol» (m)    latín F   ✗   el caso canónico
//     opus → «la obra» (f)      latín N   ✗
//     tempus → «el tiempo» (m)  latín N   ✗
//
// Los NEUTROS fallan siempre, porque el español no tiene neutro: no es que
// el alumno se equivoque, es que su lengua no le da la opción. Y `arbor` es
// el caso que muestra que el problema no son sólo los neutros: femenino en
// latín, masculino en español, y las dos lenguas igual de seguras.
//
// ── LOS QUE COINCIDEN NO SON RELLENO ─────────────────────────────────
//
// Sin ellos el lote enseñaría «desconfía del español siempre», que es tan
// falso como fiarse. Coinciden ocho de los catorce, y el alumno tiene que
// salir sabiendo que su instinto acierta más de la mitad de las veces y
// falla en un tercio — no que no sirve.
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, declinacionDe } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

export interface ItemGenero3a {
  id: string;
  punto: string;
  entrada: ReturnType<typeof N>;
  /** Lo que se muestra: lema y genitivo, sin el género. */
  ficha: string;
  /** La forma que hay que producir, y que sólo sale si se sabe el género. */
  respuesta: string;
  glosa: string;
  ejes: {
    generoLatino: 'm' | 'f' | 'n';
    /** El género del descendiente español que el alumno conoce. */
    generoEspanol: 'm' | 'f';
    /** Calculado: si el instinto acierta. El español no tiene neutro, así
     *  que un neutro latino NUNCA coincide. */
    coincide: boolean;
    /** Sólo cuando no coincide: qué palabra española lo desvía. */
    laPalabraQueDesvia?: string;
  };
}

type Def = [id: string, lema: string, esp: 'm' | 'f', palabraEsp: string, marco: string, glosa: string];

// La forma se pide en un contexto donde el ADJETIVO concuerda: sin saber el
// género no se puede escribir, que es lo que hace medible el punto.
const DEFS: Def[] = [
  // ── COINCIDEN · el instinto acierta ──
  ['la-2ge-01', 'rēx', 'm', 'el rey', 'magnus ___', 'el gran rey'],
  ['la-2ge-02', 'lēx', 'f', 'la ley', 'magna ___', 'la gran ley'],
  ['la-2ge-03', 'vōx', 'f', 'la voz', 'magna ___', 'la gran voz'],
  ['la-2ge-04', 'mōns', 'm', 'el monte', 'magnus ___', 'el gran monte'],
  ['la-2ge-05', 'mēns', 'f', 'la mente', 'magna ___', 'la gran mente'],
  ['la-2ge-06', 'urbs', 'f', 'la urbe', 'magna ___', 'la gran ciudad'],
  ['la-2ge-07', 'virtūs', 'f', 'la virtud', 'magna ___', 'la gran virtud'],
  ['la-2ge-08', 'pater', 'm', 'el padre', 'magnus ___', 'el gran padre'],

  // ── NO COINCIDEN · el instinto falla ──
  ['la-2ge-09', 'arbor', 'm', 'el árbol', 'magna ___', 'el gran árbol'],
  ['la-2ge-10', 'tempus', 'm', 'el tiempo', 'magnum ___', 'el gran tiempo'],
  ['la-2ge-11', 'opus', 'f', 'la obra', 'magnum ___', 'la gran obra'],
  ['la-2ge-12', 'corpus', 'm', 'el cuerpo', 'magnum ___', 'el gran cuerpo'],
  ['la-2ge-13', 'nōmen', 'm', 'el nombre', 'magnum ___', 'el gran nombre'],
  ['la-2ge-14', 'mare', 'm', 'el mar', 'magnum ___', 'el gran mar'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemGenero3a[] = DEFS.map(([id, lema, generoEspanol, palabraEsp, marco, glosa]) => {
  const entrada = N(lema);
  const coincide = entrada.genero === generoEspanol;
  return {
    id, punto: 'l2-genero-3a', entrada,
    ficha: `${entrada.lema}, ${entrada.genitivo}`,
    respuesta: `${marco.split(' ')[0]} ${declinar(entrada, 'nom', 'sg')}`,
    glosa,
    ejes: {
      generoLatino: entrada.genero,
      generoEspanol,
      coincide,
      ...(coincide ? {} : {
        laPalabraQueDesvia: entrada.genero === 'n'
          ? `«${palabraEsp}» es ${generoEspanol === 'm' ? 'masculino' : 'femenino'} y el latín es NEUTRO: el español no tiene esa opción, así que el instinto no puede acertar`
          : `«${palabraEsp}» es ${generoEspanol === 'm' ? 'masculino' : 'femenino'} y «${entrada.lema}» es ${entrada.genero === 'f' ? 'femenino' : 'masculino'}: las dos lenguas igual de seguras y en desacuerdo`,
      }),
    },
  };
});

export const LOTE_GENERO_3A = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

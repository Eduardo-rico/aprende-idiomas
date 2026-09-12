// lib/data/languages/la/lotes/l2-plural-tantum.ts
//
// PRIMER LOTE DE LOS PLURALIA TANTUM. Punto: `l2-plural-tantum`.
//
// «La forma es plural y el sentido no siempre.»
//
// ── DOS EJES QUE SE CRUZAN, Y NINGUNO ES EL OTRO ─────────────────────
//
// El punto tiene dos cosas dentro y conviene no fundirlas:
//
//   1. **¿el SENTIDO es singular o plural?** «castra» es «el campamento»,
//      uno solo, con forma de plural. «arma» es «las armas», varias.
//   2. **¿existe un singular, y significa otra cosa?** «littera» es «la
//      letra» y «litterae» es «la carta».
//
// El primero es lo que el alumno tiene que producir al traducir; el segundo
// es lo que le hace dudar cuando encuentra el singular en otro sitio. Se
// cruzan: `litterae` tiene sentido singular Y singular con otro sentido;
// `arma` tiene sentido plural y NO tiene singular.
//
// Medido sobre las nueve palabras de la tabla:
//
//     sentido SINGULAR   castra · litterae · nūptiae · tenebrae · moenia · īnsidiae
//     sentido PLURAL     arma · cōpiae · līberī
//
// Seis y tres. El lote los trae todos, porque con sólo los de sentido
// singular el alumno aprendería «plural en latín = singular en español», que
// es falso en un tercio de los casos.
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { alternativaEscueta } from '../../../../../scripts/lib/escueto-es';
import { PLURALIA_TANTUM, claseDe, type PluralTantum } from '../plural-tantum';

const P = (l: string) => PLURALIA_TANTUM.find((x) => x.lema === l)!;

export interface ItemPT {
  id: string;
  punto: string;
  entrada: PluralTantum;
  marco: string;
  glosa: string;
  /** Lo que hay que escribir: el sintagma español. */
  respuesta: string;
  /** Las otras traducciones correctas: el latín no tiene artículo. */
  alternativas?: string[];
  ejes: {
    /** ¿El sentido español es singular? Es lo que el alumno produce. */
    sentidoSingular: boolean;
    /** ¿Tiene singular latino con otro sentido? Es lo que le hace dudar. */
    tieneSingular: boolean;
    /** ¿ESTE ítem usa el singular latino? Declarado a mano.
     *
     *  No se puede derivar: `litteram` es el acusativo del singular y
     *  `litterās` el del plural, y sin paradigma para estas palabras —que
     *  precisamente no lo tienen— no hay forma de separarlos. Comparar
     *  subcadenas fallaba por los dos lados a la vez: «litterās» CONTIENE
     *  «littera», y «Copia» no casaba con «cōpia» por el macrón y la
     *  mayúscula.
     *
     *  Lo que el gate SÍ puede comprobar es que sólo sea `true` en lemas que
     *  tienen singular, y eso es lo que comprueba. */
    usaElSingular: boolean;
  };
}

type Def = [id: string, lema: string, marco: string, glosa: string, resp: string, sg?: true];

const DEFS: Def[] = [
  // ── SENTIDO SINGULAR · la forma engaña ──
  ['la-2pt-01', 'castra', 'Exercitus castra custodit.', 'El ejército guarda ___.', 'el campamento'],
  ['la-2pt-02', 'litterae', 'Regina litteras mittit.', 'La reina envía ___.', 'la carta'],
  ['la-2pt-03', 'nūptiae', 'Nuptiae magnae sunt.', '___ es grande.', 'la boda'],
  ['la-2pt-04', 'tenebrae', 'In tenebris est.', 'Está en ___.', 'la oscuridad'],
  ['la-2pt-05', 'moenia', 'Moenia magna sunt.', '___ es grande.', 'la muralla'],
  ['la-2pt-06', 'īnsidiae', 'Insidias timet.', 'Teme ___.', 'la emboscada'],

  // ── SENTIDO PLURAL · la forma acierta, y hacen falta ──
  ['la-2pt-07', 'arma', 'Servus arma portat.', 'El esclavo lleva ___.', 'las armas'],
  ['la-2pt-08', 'cōpiae', 'Rex copias ducit.', 'El rey guía ___.', 'las tropas'],
  ['la-2pt-09', 'līberī', 'Mater liberos amat.', 'La madre ama ___.', 'a los hijos'],

  // ── EL CRUCE: los que tienen singular con otro sentido ──
  ['la-2pt-10', 'litterae', 'Poeta litteram legit.', 'El poeta lee ___.', 'la letra', true],
  ['la-2pt-11', 'cōpiae', 'Copia magna est.', '___ es grande.', 'la abundancia', true],
  ['la-2pt-12', 'castra', 'Exercitus castrum custodit.', 'El ejército guarda ___.', 'el fortín', true],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemPT[] = DEFS.map(([id, lema, marco, glosa, respuesta, usaElSingular]) => {
  const entrada = P(lema);
  // El sentido es singular si la respuesta lleva artículo singular. Se lee
  // de la respuesta y no se declara: es lo que el alumno escribe.
  const sentidoSingular = /^(el|la|un|una) /.test(respuesta);
  return {
    id, punto: 'l2-plural-tantum', entrada, marco, glosa, respuesta,
    // ⚠ La forma escueta sólo donde el español la admite —objeto y
    //   plural—, nunca en sujeto («Abundancia es grande») ni tras
    //   preposición («está en oscuridad»). Y no toca el rasgo examinado,
    //   que es el NÚMERO del sentido español: «las tropas» y «tropas» son
    //   las dos plurales, así que quien traduzca «copias» en singular
    //   sigue fallando.
    alternativas: alternativaEscueta(glosa, respuesta),
    ejes: {
      sentidoSingular,
      tieneSingular: entrada.singular !== null,
      usaElSingular: usaElSingular === true,
    },
  };
});

export const LOTE_PLURAL_TANTUM = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

/** Los ítems que usan el SINGULAR latino. Va declarado en el ítem y no
 *  derivado, por lo dicho en `usaElSingular`. */
export const USAN_EL_SINGULAR = FUENTE.filter((it) => it.ejes.usaElSingular);

/** Lo único que el gate puede comprobar sin paradigma: que ningún ítem diga
 *  usar el singular de un lema que no lo tiene. */
export function incoherentes(): ItemPT[] {
  return FUENTE.filter((it) => it.ejes.usaElSingular && !it.ejes.tieneSingular);
}

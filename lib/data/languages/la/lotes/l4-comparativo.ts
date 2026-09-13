// lib/data/languages/la/lotes/l4-comparativo.ts
//
// `l4-comparativo` — los tres superlativos, la lista, y la declinación que
// nadie enseña.
//
//     certus  → certior  / certissimus      REGLA GENERAL
//     pulcher → pulchrior / pulcherrimus    los en -er, SOBRE EL NOMINATIVO
//     facilis → facilior / facillimus       LOS SEIS en -ilis
//     bonus   → melior   / optimus          los cinco irregulares
//
// ── LA MITAD CARA ES QUE `-illimus` ES UNA LISTA, NO UN SUFIJO ───────
//
// `facilis` y `difficilis` están entre los seis y hacen `facillimus` y
// `difficillimus`. `ūtilis` y `fidēlis` acaban IGUAL, no están, y hacen
// `ūtilissimus` y `fidēlissimus`. Una regla por terminación —«los en -ilis
// hacen -illimus»— produce `*ūtillimus`, que no existe en ningún texto. Por
// eso el lote trae los dos lados: sin ellos, el alumno aprende la regla
// falsa y la aprende del material.
//
// ── Y LA DECLINACIÓN DEL COMPARATIVO, QUE ERA EL HUECO ───────────────
//
// El comparativo es un tema CONSONÁNTICO: ablativo en `-e` y genitivo plural
// en `-um`, donde `fortis` hace `-ī` y `-ium`. Esa mitad era el grueso del
// hueco de la auditoría inversa —126 entradas y 584 tokens, la tercera clase
// por tamaño— y siete de los ocho comparativos de aquí están FUERA del
// nominativo por eso. `maiōre` ×13, `maiōrum` ×7, `maiōribus` ×8.
//
// ── DIECISÉIS DE DIECISIETE FORMAS ESTÁN ATESTIGUADAS ───────────────
//
// Contadas por el rasgo `Degree` del treebank, no por la cadena. De
// `maximum` ×15 a `facillimum` ×1.
//
// La decimoséptima, `ūtilissimum`, no. Va con su motivo escrito y es el
// contraejemplo sin el cual el lote enseñaría la regla falsa: `ūtilis`
// acaba exactamente igual que `facilis` y no está entre los seis. `fidēlis`
// no vale de contraejemplo porque acaba en `-ēlis`, y de eso me enteré
// porque el test lo cazó, no porque lo hubiera visto.
import type { ItemGrado, Grado } from '../../../../../scripts/lib/gate-comparativo';
import type { ClaseDeSuperlativo, GeneroAdj } from '../grado';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Caso, Numero } from '../paradigma-la';

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, lema: string, tema: string, grado: Grado, clase: ClaseDeSuperlativo,
            genero: GeneroAdj, caso: Caso, numero: Numero,
            respuesta: string, marco: string, glosa: string, porQueSinAtestiguar?: string];

const DEFS: Def[] = [
  // ── SUPERLATIVO · las cuatro clases ──
  ['la-gr-01', 'fidēlis', 'fidēl', 'superlativo', 'issimus', 'f', 'nom', 'sg', 'fidēlissima',
   'Rēgīna ___ est.', 'La reina es fidelísima.'],
  ['la-gr-02', 'fortis', 'fort', 'superlativo', 'issimus', 'm', 'nom', 'sg', 'fortissimus',
   'Rēx ___ vir est.', 'El rey es un varón fortísimo.'],
  ['la-gr-03', 'miser', 'miser', 'superlativo', 'errimus', 'm', 'nom', 'sg', 'miserrimus',
   'Servus ___ est.', 'El esclavo es desdichadísimo.'],
  ['la-gr-04', 'pulcher', 'pulchr', 'superlativo', 'errimus', 'n', 'ac', 'sg', 'pulcherrimum',
   'Templum ___ videt.', 'Ve un templo hermosísimo.'],
  ['la-gr-05', 'difficilis', 'difficil', 'superlativo', 'illimus', 'm', 'ac', 'sg', 'difficillimum',
   'Puer ___ labōrem habet.', 'El niño tiene un trabajo dificilísimo.'],
  ['la-gr-06', 'facilis', 'facil', 'superlativo', 'illimus', 'n', 'ac', 'sg', 'facillimum',
   'Opus ___ est.', 'La obra es facilísima.'],
  ['la-gr-07', 'magnus', 'magn', 'superlativo', 'irregular', 'n', 'ac', 'sg', 'maximum',
   'Rēx ___ rēgnum habet.', 'El rey tiene un reino máximo.'],
  ['la-gr-08', 'bonus', 'bon', 'superlativo', 'irregular', 'n', 'ac', 'sg', 'optimum',
   'Rēx ___ signum videt.', 'El rey ve una señal óptima.'],

  // EL ÚNICO ÍTEM SIN ATESTIGUAR DEL LOTE, y va con su motivo porque sin él
  // el lote enseña la regla falsa. `ūtilis` acaba EXACTAMENTE igual que
  // `facilis` y no está entre los seis: es el contraejemplo que convierte
  // «-ilis → -illimus» en «estos seis → -illimus». `fidēlis` no sirve —acaba
  // en `-ēlis`— y el test lo cazó.
  ['la-gr-17', 'ūtilis', 'ūtil', 'superlativo', 'issimus', 'n', 'nom', 'sg', 'ūtilissimum',
   'Opus ___ est.', 'La obra es utilísima.',
   'no aparece en los 227.301 tokens: `ūtilis` sale 7 veces en comparativo y ninguna en superlativo. La forma NO se inventa —sale de la regla general que este mismo lote enseña— y su cero mide el tamaño del corpus, no la lengua. Va porque es el único contraejemplo posible: sin un `-ilis` que haga `-issimus`, el lote enseña que la terminación manda, y lo que manda es la lista'],

  // ── COMPARATIVO · siete de ocho FUERA del nominativo ──
  ['la-gr-09', 'magnus', 'magn', 'comparativo', 'irregular', 'f', 'ac', 'sg', 'maiōrem',
   'Rēx ___ urbem videt.', 'El rey ve una ciudad mayor.'],
  ['la-gr-10', 'magnus', 'magn', 'comparativo', 'irregular', 'm', 'abl', 'sg', 'maiōre',
   'Puer cum ___ amīcō ambulat.', 'El niño anda con un amigo mayor.'],
  ['la-gr-11', 'magnus', 'magn', 'comparativo', 'irregular', 'm', 'gen', 'pl', 'maiōrum',
   'Rēx ___ virōrum est.', 'Es el rey de varones mayores.'],
  ['la-gr-12', 'magnus', 'magn', 'comparativo', 'irregular', 'm', 'dat', 'pl', 'maiōribus',
   'Rēx ___ virīs dōna dat.', 'El rey da regalos a varones mayores.'],
  ['la-gr-13', 'magnus', 'magn', 'comparativo', 'irregular', 'n', 'nom', 'pl', 'maiōra',
   'Magna et ___ opera videt.', 'Ve obras grandes y mayores.'],
  ['la-gr-14', 'bonus', 'bon', 'comparativo', 'irregular', 'm', 'ac', 'sg', 'meliōrem',
   'Rēx ___ amīcum vocat.', 'El rey llama a un amigo mejor.'],
  ['la-gr-15', 'longus', 'long', 'comparativo', 'issimus', 'f', 'abl', 'sg', 'longiōre',
   'Puer in ___ viā stat.', 'El niño está de pie en un camino más largo.'],
  ['la-gr-16', 'ācer', 'ācr', 'comparativo', 'errimus', 'm', 'abl', 'sg', 'ācriōre',
   'Rēx cum ___ exercitū venit.', 'El rey viene con un ejército más agudo.'],
];

const FUENTE: ItemGrado[] = DEFS.map(([id, lema, tema, grado, clase, genero, caso, numero, respuesta, marco, glosa, porQue]) => ({
  id, punto: 'l4-comparativo', adjetivo: { lema, tema }, grado, genero, caso, numero, respuesta, marco, glosa,
  ...(porQue ? { porQueSinAtestiguar: porQue } : {}),
  ejes: { grado, claseDeSuperlativo: clase, caso },
}));

export const LOTE_COMPARATIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

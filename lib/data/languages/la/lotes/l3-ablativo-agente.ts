// lib/data/languages/la/lotes/l3-ablativo-agente.ts
//
// `l3-ablativo-agente` — «agente contra instrumento: la preposición
// depende de lo animado».
//
//     TRES PARES ANIMADOS, TRES INANIMADOS Y LA EXCEPCIÓN. 14 ítems.
//
//       Servus a domino vocatur.   ✓   «El esclavo es llamado por el señor.»
//       Servus domino vocatur.     ✗   falta la preposición
//       Templum gladiis capitur.   ✓   «El templo es tomado con las espadas.»
//       Templum a gladiis capitur. ✗   preposición de más
//
// ── LA PREGUNTA NO ES «¿ES GRAMATICAL?» ──────────────────────────────
//
// `Servus dominō vocātur` se puede leer como dativo —«se llama al esclavo
// para el señor»— así que preguntar por la gramaticalidad tendría
// respuesta correcta alternativa y suspendería a un alumno impecable
// (§D8). Lo que se pregunta es si el latín DICE LO QUE DICE LA GLOSA. Cada
// ítem trae su traducción y su corrección, que es además lo que el
// `motivo` del punto pide: «se corrige desde la frase mala».
//
// ── LA REGLA, MEDIDA EN EL TREEBANK ──────────────────────────────────
//
// Ninguna máquina de este proyecto sabe si `dominō` lleva preposición: la
// afirmación es sobre la lengua. El sello `atestacion-agente.json` cuenta
// los ablativos de verbo pasivo por lema, con `ā/ab` y sin preposición —
// 653 y 1.379 sobre 20.406 frases. Los seis lemas del lote:
//
//     deus     18 CON ·  0 SIN        gladius   0 CON ·  3 SIN
//     dominus  10 CON ·  0 SIN        manus     0 CON ·  9 SIN
//     pater     7 CON ·  0 SIN        bellum    0 CON · 12 SIN
//
// Y el sello ya se ha ganado el sueldo: este lote llevaba `timor` en el
// tercer inanimado, medido 0 CON en una sonda del scratchpad. El sello, con
// el filtro bien puesto, da **1 CON y 10 SIN**, y el gate se puso rojo en
// las dos clases a la vez — `papel-sin-apoyo-en-el-corpus` y
// `marca-agramatical-lo-atestiguado`.
//
// El gate NO se cree la animacidad declarada: la contrasta contra eso, y
// además impide marcar agramatical cualquier configuración que el corpus
// atestigüe (§F1).
//
// ── Y LA EXCEPCIÓN NO ES UNA NOTA AL PIE ─────────────────────────────
//
// El punto declara que «con el ablativo de causa eficiente ("ā nātūrā") la
// preposición reaparece». Medido: `natura` sale **5 CON y 5 SIN**, y el
// corte es por SENTIDO — los cinco con preposición son de Cicerón y son la
// causa eficiente (`ā nātūrā generātī sumus`); los cinco sin ella son de
// César y son instrumentales (`nātūrā locī mūnītum`, «por el
// emplazamiento»).
//
// Los dos ítems de la excepción llevan **el mismo lema** y los dos son
// correctos. Es lo único que enseña que la regla no la decide la palabra
// sino el papel — y sin ellos el lote enseñaría una regla absoluta, que es
// la forma típica del error nuevo (§E2).
import type { ItemAgente, Papel } from '../../../../../scripts/lib/gate-ablativo-agente';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Numero } from '../paradigma-la';

/** Contra el detector de posición, la adyacencia y el piso de distancia. */
export const SEMILLA_DE_ORDEN = 1;

type Par = {
  id: string;
  /** `{{}}` es donde iría la preposición. */
  marco: string; marcoConCantidad: string;
  ablativo: { lema: string; forma: string; formaConCantidad: string; numero: Numero };
  papel: Papel;
  glosa: string;
  /** Sólo la excepción: los dos ítems son correctos y dicen cosas
   *  distintas, así que cada uno trae su glosa y no hay par mínimo. */
  glosaSinPreposicion?: string;
  papelSinPreposicion?: Papel;
  excepcion?: string;
};

const LA_EXCEPCION = 'el punto declara que con la causa eficiente la preposición reaparece, y el corpus lo confirma: `natura` sale 5 veces con `ā` (Cicerón, causa eficiente) y 5 sin ella (César, instrumental). Los dos ítems son correctos y es el mismo lema: lo que decide no es la palabra, es el papel';

const PARES: Par[] = [
  // ── ANIMADOS: la preposición es obligatoria ──
  { id: 'a1',
    marco: 'Servus {{}}domino vocatur.', marcoConCantidad: 'Servus {{}}dominō vocātur.',
    ablativo: { lema: 'dominus', forma: 'domino', formaConCantidad: 'dominō', numero: 'sg' },
    papel: 'agente', glosa: 'El esclavo es llamado por el señor.' },
  { id: 'a2',
    marco: 'Puer {{}}patre docetur.', marcoConCantidad: 'Puer {{}}patre docētur.',
    ablativo: { lema: 'pater', forma: 'patre', formaConCantidad: 'patre', numero: 'sg' },
    papel: 'agente', glosa: 'El niño es enseñado por el padre.' },
  { id: 'a3',
    marco: 'Templum {{}}Deo custoditur.', marcoConCantidad: 'Templum {{}}Deō custōdītur.',
    ablativo: { lema: 'Deus', forma: 'Deo', formaConCantidad: 'Deō', numero: 'sg' },
    papel: 'agente', glosa: 'El templo es guardado por Dios.' },

  // ── INANIMADOS: la preposición sobra ──
  { id: 'i1',
    marco: 'Templum {{}}gladiis capitur.', marcoConCantidad: 'Templum {{}}gladiīs capitur.',
    ablativo: { lema: 'gladius', forma: 'gladiis', formaConCantidad: 'gladiīs', numero: 'pl' },
    papel: 'instrumento', glosa: 'El templo es tomado con las espadas.' },
  { id: 'i2',
    marco: 'Puer {{}}manu ducitur.', marcoConCantidad: 'Puer {{}}manū dūcitur.',
    ablativo: { lema: 'manus', forma: 'manu', formaConCantidad: 'manū', numero: 'sg' },
    papel: 'instrumento', glosa: 'El niño es llevado de la mano.' },
  // `bellum` es el que enseña que «inanimado» no quiere decir «objeto»: un
  // abstracto se personifica con facilidad y aun así el corpus lo da 0 con
  // y 12 sin.
  //
  // AQUÍ EL GATE CAZÓ UN ERROR MÍO, y es la razón de que el sello exista.
  // Este ítem iba con `timor`, que yo había medido 0 con y 10 sin en una
  // sonda del scratchpad. El sello, con el filtro bien puesto, da **1 con
  // y 10 sin** — y el gate se puso rojo en las dos clases a la vez:
  // `papel-sin-apoyo-en-el-corpus` y `marca-agramatical-lo-atestiguado`.
  // Una sonda que no se commitea no es un instrumento (§5.bis del relevo).
  { id: 'i3',
    marco: 'Urbs {{}}bello capitur.', marcoConCantidad: 'Urbs {{}}bellō capitur.',
    ablativo: { lema: 'bellum', forma: 'bello', formaConCantidad: 'bellō', numero: 'sg' },
    papel: 'instrumento', glosa: 'La ciudad es tomada por la guerra.' },

  // ── LA EXCEPCIÓN: el mismo lema, los dos modos, los dos correctos ──
  { id: 'e1',
    marco: 'Homines {{}}natura docentur.', marcoConCantidad: 'Hominēs {{}}nātūrā docentur.',
    ablativo: { lema: 'nātūra', forma: 'natura', formaConCantidad: 'nātūrā', numero: 'sg' },
    papel: 'causa-eficiente', glosa: 'Los hombres son enseñados por la naturaleza.',
    papelSinPreposicion: 'instrumento',
    glosaSinPreposicion: 'Los hombres son enseñados por su propia condición.',
    excepcion: LA_EXCEPCION },
];

function itemsDe(p: Par): ItemAgente[] {
  const arma = (m: string, con: boolean, f: string) => m.replace('{{}}', con ? 'a ' : '').replace(/domino|dominō|patre|Deo|Deō|gladiis|gladiīs|manu|manū|bello|bellō|natura|nātūrā/, f);
  const uno = (con: boolean): ItemAgente => {
    const papel = con ? p.papel : (p.papelSinPreposicion ?? p.papel);
    const bien = p.excepcion !== undefined || (papel === 'agente' ? con : !con);
    const latin = arma(p.marco, con, p.ablativo.forma);
    const otro = arma(p.marco, !con, p.ablativo.forma);
    return {
      id: `${p.id}-${con ? 'c' : 's'}`, punto: 'l3-ablativo-agente', pareja: p.id,
      latin, latinConCantidad: arma(p.marcoConCantidad, con, p.ablativo.formaConCantidad),
      ablativo: { lema: p.ablativo.lema, forma: p.ablativo.forma, numero: p.ablativo.numero },
      conPreposicion: con, papel, diceLoQueLaGlosa: bien,
      glosa: con ? p.glosa : (p.glosaSinPreposicion ?? p.glosa),
      correccion: bien ? latin : otro,
      ...(p.excepcion ? { esLaExcepcion: p.excepcion } : {}),
    };
  };
  return [uno(true), uno(false)];
}

const FUENTE: ItemAgente[] = PARES.flatMap(itemsDe);

// El `id` no canta el veredicto: `-c`/`-s` es la preposición, y la
// preposición NO decide —depende de lo animado—. Aun así se renumeran por
// el orden publicado, por lo mismo que los otros dos lotes.
export const LOTE_ABLATIVO_AGENTE: ItemAgente[] = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN)
  .map((i, k) => ({ ...i, id: `la-ag-${String(k + 1).padStart(2, '0')}` }));

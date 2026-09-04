// scripts/lib/gate-transformacion.ts
//
// EL GATE DE TRANSFORMACIÓN, antes del primer ítem y de lote.
//
// Punto: `l5-futuro-dos-formas` — «-bō/-bi- en la 1.ª y la 2.ª, -am/-ē- en
// la 3.ª y la 4.ª». Se da una forma de presente y se pide el futuro.
//
// ── EL EJE BINARIO, POR QUINTA VEZ ────────────────────────────────────
//
// «dos reglas presentadas como una es como se fabrica un error
// sistemático», dice el propio punto. Las dos rutas ciegas son:
//
//   · **-bi- siempre**: el que aprende `amābit` produce `dūcēbit`. No es
//     una regla inventada: es coger el imperfecto —`dūcēbat`, que sí
//     existe— y cambiarle la vocal, que es lo que funciona en la 1.ª.
//   · **-ē- siempre**: el que aprende `dūcet` produce `amet`.
//
// Complementarias sobre las cuatro conjugaciones, así que mitad y mitad.
//
// ── Y ALGO PROPIO DE ESTE FORMATO: EL ERROR QUE EXISTE ────────────────
//
// `amet` **es una palabra latina**: el presente de subjuntivo de `amō`. Un
// alumno que produzca `amet` por el futuro no obtiene una forma imposible
// sino una real con otro valor, y si la busca la encuentra. Peor todavía
// en la dirección contraria: el punto declara que `dūcam` y `audiam` son a
// la vez futuro de indicativo y presente de subjuntivo.
//
// Así que el gate mide, por ítem, si la respuesta que da la ruta perdedora
// es una forma real del mismo verbo. No para prohibirlo —eso es la lengua
// y no se puede cambiar— sino para que el lote lo DECLARE y no lo estrene
// por accidente.
import { conjugar, conjugacionDe, marcaDeFuturo, infectum,
         type EntradaVerbal, type Persona, type Tiempo } from '../../lib/data/languages/la/paradigma-la';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export interface ItemTransformacion {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  persona: Persona;
  /** Lo que se le da. */
  desde: Tiempo;
  /** Lo que se le pide. */
  hacia: Tiempo;
  /** La forma de partida, escrita a mano y contrastada. */
  entrada: string;
  /** La respuesta, idem. */
  respuesta: string;
  pista: string;
  ejes: {
    /** La marca que le toca: es lo que el punto examina. */
    marca: 'bi' | 'e';
    conjugacion: 1 | 2 | 3 | 4;
    /** Si la respuesta que da la ruta perdedora es una forma REAL del
     *  mismo verbo. Se comprueba contra la máquina, no se declara a ojo. */
    elErrorExiste: boolean;
  };
}

export type ClaseFalloT =
  | 'orden-separable'
  | 'entrada-o-respuesta-no-derivable' | 'eje-mal-declarado' | 'pista-regala-la-forma'
  | 'repetido' | 'estrategia-ciega' | 'sin-error-que-existe'
  | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloT { item: string; clase: ClaseFalloT; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();

/** Lo que responde quien aplica `-bi-` a todo: coge el imperfecto y le
 *  cambia la vocal. No es una regla inventada — es la que funciona en la
 *  1.ª y la 2.ª, aplicada donde no toca. */
export function rutaBi(item: ItemTransformacion): string {
  const imp = conjugar(item.verbo, item.persona, 'imperfecto');
  const i = imp.lastIndexOf('b');
  if (i < 0) return '';
  const FIN: Record<Persona, string> = { '1sg': 'bō', '2sg': 'bis', '3sg': 'bit', '1pl': 'bimus', '2pl': 'bitis', '3pl': 'bunt' };
  return imp.slice(0, i) + FIN[item.persona];
}

/** Lo que responde quien aplica `-am/-ē-` a todo. */
export function rutaE(item: ItemTransformacion): string {
  const FIN: Record<Persona, string> = { '1sg': 'am', '2sg': 'ēs', '3sg': 'et', '1pl': 'ēmus', '2pl': 'ētis', '3pl': 'ent' };
  const tema = item.verbo.infinitivo.normalize('NFC').replace(/(āre|ēre|īre|ere)$/, '');
  const c = conjugacionDe(item.verbo);
  return tema + (c === 4 ? 'i' : '') + FIN[item.persona];
}

/** ¿La forma que da la ruta perdedora es una forma real del mismo verbo?
 *  Se busca en el infectum, no se declara a ojo.
 *
 *  LÍMITE DECLARADO, porque este check INFRAINFORMA: sólo ve el
 *  indicativo, que es lo único que la máquina tiene. `amet` —lo que
 *  produce la ruta `-ē-` sobre `amō`— **es una palabra latina**: el
 *  presente de subjuntivo. La máquina no lo sabe, así que aquí sale
 *  `false`. Cuando el subjuntivo entre (bloque 7, L2), este check
 *  encontrará más casos, no menos. Un `false` aquí significa «no lo veo»,
 *  no «no existe», y eso hay que leerlo así. */
export function elErrorExiste(item: ItemTransformacion): boolean {
  const perdedora = item.ejes.marca === 'bi' ? rutaE(item) : rutaBi(item);
  if (!perdedora) return false;
  return Object.values(infectum(item.verbo)).some((f) => norm(f) === norm(perdedora));
}

export const TECHO_T = 0.5;

export function revisarTransformacion(item: ItemTransformacion): FalloT[] {
  const out: FalloT[] = [];
  const push = (clase: ClaseFalloT, detalle: string) => out.push({ item: item.id, clase, detalle });

  const ent = conjugar(item.verbo, item.persona, item.desde);
  const res = conjugar(item.verbo, item.persona, item.hacia);
  if (norm(ent) !== norm(item.entrada)) push('entrada-o-respuesta-no-derivable', `la entrada es «${item.entrada}» y la máquina da «${ent}»`);
  if (norm(res) !== norm(item.respuesta)) push('entrada-o-respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${res}»`);

  const c = conjugacionDe(item.verbo);
  if (item.ejes.conjugacion !== c) push('eje-mal-declarado', `declara conjugación ${item.ejes.conjugacion} y el infinitivo dice ${c}`);
  const m = marcaDeFuturo(item.verbo);
  if (item.ejes.marca !== m) push('eje-mal-declarado', `declara marca «${item.ejes.marca}» y le toca «${m}»`);
  if (item.ejes.elErrorExiste !== elErrorExiste(item)) {
    push('eje-mal-declarado', `declara elErrorExiste=${item.ejes.elErrorExiste} y la máquina dice ${elErrorExiste(item)}`);
  }

  if (norm(item.pista).includes(norm(item.respuesta))) push('pista-regala-la-forma', `la pista contiene «${item.respuesta}»`);
  return out;
}

export function tasasCiegasT(items: ItemTransformacion[]) {
  const n = items.length || 1;
  return {
    siempreBi: items.filter((i) => norm(rutaBi(i)) === norm(i.respuesta)).length / n,
    siempreE: items.filter((i) => norm(rutaE(i)) === norm(i.respuesta)).length / n,
    copiarLaEntrada: items.filter((i) => norm(i.entrada) === norm(i.respuesta)).length / n,
    conErrorQueExiste: items.filter((i) => i.ejes.elErrorExiste).length,
  };
}

export function coberturaTransformacion(items: ItemTransformacion[]): Cobertura[] {
  const n = items.length;
  const conBi = items.filter((i) => rutaBi(i) !== '').length;
  return [
    { comprobacion: 'entrada y respuesta contra la máquina', decididos: n, total: n },
    { comprobacion: 'las dos rutas de futuro', decididos: conBi, total: n,
      motivoDeLosQueQuedanFuera: 'un verbo sin imperfecto en -b- no admite la ruta -bi-, así que no la distingue' },
    { comprobacion: 'si el error es una forma real', decididos: n, total: n,
      motivoDeLosQueQuedanFuera: 'decide sobre todos, pero INFRAINFORMA: sólo mira el indicativo. `amet` es presente de subjuntivo de `amō` y la máquina todavía no lo tiene, así que ese caso sale «no» siendo «sí»' },
  ];
}

export function revisarLoteT(items: ItemTransformacion[]): FalloT[] {

  const out: FalloT[] = items.flatMap(revisarTransformacion);
  // ── EL ORDEN DE PUBLICACIÓN, QUE NINGÚN GATE DE LATÍN MIRABA ──
  //
  // `separablePorPosicion` está en el repositorio desde portugués y
  // ninguno de los cinco gates nuevos lo llamaba: cuatro de los cinco
  // lotes se resolvían al 100 % contando ejercicios. Un detector que
  // existe y no se llama es peor que no tenerlo, porque da sensación de
  // cobertura.
  {
    const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.marca === 'bi'));
    if (sep) out.push({ item: '(lote)', clase: 'orden-separable' as ClaseFalloT,
      detalle: `el eje «lleva la marca -bi-» se predice por la POSICIÓN: ${sep}` });
  }
  out.push(...revisarCobertura(coberturaTransformacion(items)).map((f) => ({ item: f.item, clase: f.clase as ClaseFalloT, detalle: f.detalle })));

  const t = tasasCiegasT(items);
  for (const [nombre, valor, glosa] of [
    ['-bi- siempre', t.siempreBi, 'el que aprende `amābit` y produce `dūcēbit`'],
    ['-ē- siempre', t.siempreE, 'el que aprende `dūcet` y produce `amet`'],
    ['copiar la entrada', t.copiarLaEntrada, 'devolver la forma que se le dio'],
  ] as const) {
    if (valor > TECHO_T) {
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `«${nombre}» —${glosa}— acierta el ${(100 * valor).toFixed(0)} %, por encima del ${(100 * TECHO_T).toFixed(0)} % del azar` });
    }
  }

  // El lote tiene que traer al menos un ítem donde el error de la ruta
  // perdedora sea una forma REAL: es el caso que el alumno puede
  // confirmar buscándolo, y no declararlo es estrenarlo por accidente.
  if (!items.some((i) => i.ejes.elErrorExiste)) {
    out.push({ item: '(lote)', clase: 'sin-error-que-existe',
      detalle: 'ningún ítem tiene una ruta perdedora que produzca una forma real del verbo: falta el caso en que el error del alumno es una palabra latina con otro valor' });
  }

  const vistos = new Map<string, string>();
  for (const it of items) {
    const k = `${norm(it.verbo.lema)}|${it.persona}|${it.desde}|${it.hacia}`;
    const antes = vistos.get(k);
    if (antes) out.push({ item: it.id, clase: 'repetido', detalle: `mismo verbo, persona y transformación que «${antes}»` });
    else vistos.set(k, it.id);
  }
  return out;
}

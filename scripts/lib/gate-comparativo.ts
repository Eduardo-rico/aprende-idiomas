// scripts/lib/gate-comparativo.ts — LOS TRES SUPERLATIVOS Y LA LISTA.
//
// Punto `l4-comparativo`. «altior/altissimus; melior/optimus, maior/maximus,
// plūs/plūrimus. Los irregulares son los mismos que en español, que es un
// regalo poco frecuente.» `varia`: «si el adjetivo es regular o de la lista,
// y si el superlativo es en `-issimus`, `-errimus` o `-illimus`».
// `excepcion`: «los en `-er` hacen superlativo en `-errimus` y los seis en
// `-ilis` en `-illimus`: el que sobreaplique `-issimus` dirá
// *`facilissimus`».
//
// ══ LA CIEGA ES EL ERROR DECLARADO Y SE PUEDE MEDIR ══════════════════
//
// `-issimus` a todo produce `*facilissimus`, `*pulchrissimus`,
// `*bonissimus`. A diferencia de otros errores diana de este proyecto, éste
// SÍ acierta a veces —en los regulares, que son la mayoría de la lengua—, y
// por eso se mide: su denominador son los ítems de superlativo, que es
// donde puede acertar y fallar. En los de comparativo no produce nada.
//
// ══ EL COMPARATIVO TIENE SU PROPIA CIEGA Y SU PROPIO DENOMINADOR ═════
//
// «Tema + `-ior`» acierta en todos menos en los cinco irregulares. Se mide
// sobre los ítems de comparativo, por lo mismo.
//
// ══ Y LA DECLINACIÓN, QUE ES LA MITAD QUE NADIE ENSEÑA ═══════════════
//
// El comparativo es un tema CONSONÁNTICO: ablativo en `-e` y genitivo plural
// en `-um`, donde `fortis` hace `-ī` y `-ium`. Esa mitad era el grueso del
// hueco de la auditoría inversa —`maiōre` ×13, `maiōrum` ×7, `maiōribus`
// ×8— y por eso el lote la examina en vez de quedarse en el nominativo.
import atestacion from '../../lib/data/languages/la/atestacion-grado.json';
import { gradosDe, declinarComparativo, superlativoIngenuo, type ClaseDeSuperlativo, type GeneroAdj } from '../../lib/data/languages/la/grado';
import { declinarAdjetivo, type Caso, type Numero } from '../../lib/data/languages/la/paradigma-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const FORMAS = (atestacion as { formas: Record<string, { cmp: number; sup: number }> }).formas;

export type Grado = 'comparativo' | 'superlativo';

export interface ItemGrado {
  id: string;
  punto: string;
  adjetivo: { lema: string; tema: string };
  grado: Grado;
  genero: GeneroAdj;
  caso: Caso;
  numero: Numero;
  respuesta: string;
  marco: string;
  glosa: string;
  ejes: { grado: Grado; claseDeSuperlativo: ClaseDeSuperlativo; caso: Caso };
  porQueSinAtestiguar?: string;
}

export type ClaseFalloGrado =
  | 'respuesta-no-derivable' | 'eje-mal-declarado' | 'sin-atestiguar'
  | 'marco-sin-hueco' | 'marco-regala-la-forma' | 'marco-fuera-de-l1'
  | 'glosa-sin-giro' | 'varia-incompleto'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloGrado { item: string; clase: ClaseFalloGrado; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase().trim();

/** SEGUNDO CAMINO: la máquina del grado más el declinador que toque —el del
 *  comparativo para el comparativo, el de adjetivos de 1.ª/2.ª para el
 *  superlativo—. */
export function formaDeLaMaquina(item: ItemGrado): string | null {
  const g = gradosDe(item.adjetivo.lema, item.adjetivo.tema);
  if (item.grado === 'comparativo') return declinarComparativo(g, item.genero, item.caso, item.numero);
  if (g.superlativo === null) return null;
  const sup = g.superlativo;
  return declinarAdjetivo({ lema: sup, tema: sup.replace(/us$/, ''), glosa: '' }, item.genero, item.caso, item.numero);
}

/** CIEGA 1 · `-issimus` a todo, que es el error que el punto declara. */
export function superlativoSobreaplicado(item: ItemGrado): string | null {
  if (item.grado !== 'superlativo') return null;
  const sup = superlativoIngenuo(item.adjetivo.tema);
  return declinarAdjetivo({ lema: sup, tema: sup.replace(/us$/, ''), glosa: '' }, item.genero, item.caso, item.numero);
}

/** CIEGA 2 · tema + `-ior`, que falla sólo en los cinco irregulares. */
export function comparativoSobreaplicado(item: ItemGrado): string | null {
  if (item.grado !== 'comparativo') return null;
  const falso = {
    comparativo: `${item.adjetivo.tema}ior`, comparativoNeutro: `${item.adjetivo.tema}ius`,
    superlativo: null, clase: 'issimus' as ClaseDeSuperlativo,
  };
  return declinarComparativo(falso, item.genero, item.caso, item.numero);
}

export function atestiguada(forma: string, grado: Grado): number {
  const f = FORMAS[forma];
  return f ? (grado === 'comparativo' ? f.cmp : f.sup) : 0;
}

export function revisarItemGrado(item: ItemGrado): FalloGrado[] {
  const out: FalloGrado[] = [];
  const push = (clase: ClaseFalloGrado, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = formaDeLaMaquina(item);
  if (dela === null) { push('respuesta-no-derivable', `«${item.adjetivo.lema}» no admite ${item.grado}`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}» para ${item.genero}.${item.caso}.${item.numero}`);

  const g = gradosDe(item.adjetivo.lema, item.adjetivo.tema);
  if (item.ejes.claseDeSuperlativo !== g.clase)
    push('eje-mal-declarado', `declara clase ${item.ejes.claseDeSuperlativo} y «${item.adjetivo.lema}» es ${g.clase}`);
  if (item.ejes.grado !== item.grado || item.ejes.caso !== item.caso)
    push('eje-mal-declarado', 'los ejes no dicen lo que el ítem es');

  if (atestiguada(item.respuesta, item.grado) === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20)
    push('sin-atestiguar', `«${item.respuesta}» no aparece como ${item.grado} en el corpus`);

  if (!item.marco.includes('___')) push('marco-sin-hueco', 'el marco latino no tiene hueco `___`');
  if (norm(item.marco.replace('___', '')).split(/\s+/).includes(norm(item.respuesta)))
    push('marco-regala-la-forma', `el marco contiene «${item.respuesta}»`);
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  if (item.glosa.trim().length < 10) push('glosa-sin-giro', 'la glosa no trae el giro español');
  return out;
}

export function tasasCiegasGrado(items: ItemGrado[]) {
  const sup = items.filter((i) => i.grado === 'superlativo');
  const cmp = items.filter((i) => i.grado === 'comparativo');
  return {
    // Cada una sobre los ítems de SU grado: en el otro no produce nada, y
    // contarlos la anularía —el pozo de denominador de §5.teretvicies—.
    issimusATodo: {
      tasa: sup.length === 0 ? 0 : sup.filter((i) => norm(superlativoSobreaplicado(i) ?? ' ') === norm(i.respuesta)).length / sup.length,
      decididos: sup.length, total: items.length,
    },
    iorATodo: {
      tasa: cmp.length === 0 ? 0 : cmp.filter((i) => norm(comparativoSobreaplicado(i) ?? ' ') === norm(i.respuesta)).length / cmp.length,
      decididos: cmp.length, total: items.length,
    },
  };
}

export function coberturaGrado(items: ItemGrado[]): Cobertura[] {
  const n = items.length;
  const sup = items.filter((i) => i.grado === 'superlativo');
  const cmp = items.filter((i) => i.grado === 'comparativo');
  return [
    { comprobacion: 'la respuesta contra la máquina',
      decididos: items.filter((i) => norm(formaDeLaMaquina(i) ?? ' ') === norm(i.respuesta)).length, total: n },
    { comprobacion: 'la forma aparece en el corpus con ese grado',
      decididos: items.filter((i) => atestiguada(i.respuesta, i.grado) > 0).length, total: n,
      motivoDeLosQueQuedanFuera: 'los que no, llevan su motivo por ítem en `porQueSinAtestiguar` y el gate lo exige; el caso que lo justifica es el contraejemplo de los seis en -ilis, que no tiene forma atestiguada y sin el cual el lote enseñaría el sufijo en vez de la lista' },
    { comprobacion: 'los dos grados', decididos: new Set(items.map((i) => i.grado)).size, total: 2 },
    { comprobacion: 'las cuatro clases de superlativo', decididos: new Set(sup.map((i) => i.ejes.claseDeSuperlativo)).size, total: 4,
      motivoDeLosQueQuedanFuera: 'la quinta clase, `perifrastico` (magis anxius), no produce forma sintetica: no hay nada que pedir' },
    { comprobacion: 'el comparativo FUERA del nominativo, que es donde vive su declinación propia',
      decididos: cmp.filter((i) => i.caso !== 'nom').length, total: cmp.length,
      motivoDeLosQueQuedanFuera: 'el nominativo es la forma de cita y no distingue el tema consonántico del temático; la distinción vive en el ablativo en -e y el genitivo plural en -um' },
  ];
}

export function revisarLoteGrado(items: ItemGrado[]): FalloGrado[] {
  const out: FalloGrado[] = items.flatMap(revisarItemGrado);
  for (const c of revisarCobertura(coberturaGrado(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  const clases = new Set(items.filter((i) => i.grado === 'superlativo').map((i) => i.ejes.claseDeSuperlativo));
  if (clases.size < 4)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `el varia son las clases de superlativo y el lote trae ${clases.size} de 4: ${[...clases].join(', ')} — sin -errimus y -illimus juntos, «-issimus a todo» no queda refutado` });

  const t = tasasCiegasGrado(items);
  if (t.issimusATodo.decididos > 0 && t.issimusATodo.tasa > 0.5)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«-issimus a todo» acierta el ${(100 * t.issimusATodo.tasa).toFixed(0)} % de los ${t.issimusATodo.decididos} superlativos: ése es el *facilissimus que el punto declara` });
  if (t.iorATodo.decididos > 0 && t.iorATodo.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«tema + -ior» acierta el ${(100 * t.iorATodo.tasa).toFixed(0)} % de los ${t.iorATodo.decididos} comparativos` });

  const p = separablePorPosicion(patronDe(items, (i) => i.grado === 'superlativo'));
  if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el grado se separa por la posición: ${p}` });
  return out;
}

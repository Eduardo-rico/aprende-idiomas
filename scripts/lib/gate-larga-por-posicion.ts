// scripts/lib/gate-larga-por-posicion.ts — LARGA POR POSICIÓN.
//
// Punto `l1-larga-por-posicion`. `varia`: «el grupo consonántico, porque
// muta cum liquida (pa-tris) puede contar como breve». `excepcion`:
// «oclusiva + líquida (tr, pr, cl…) puede NO alargar: "tenebrae" sigue
// siendo esdrújula. **El manual escolar lo presenta como absoluto y no lo
// es**».
//
// ══ LA ESTRATEGIA CIEGA ES LA REGLA DEL MANUAL ═══════════════════════
//
// «Dos consonantes alargan» acierta en todos los grupos menos en muta cum
// liquida. Es la regla que el alumno traerá si ha visto cualquier manual, y
// es la que el punto existe para acotar — así que el lote tiene que
// refutarla en la mitad de sus ítems, no en uno.
//
// Y como las dos estrategias —«alarga siempre» y «no alarga nunca»— son
// complementarias, el umbral va sobre el EQUILIBRIO y absoluto. Una cifra
// medida no entra en la condición: es la regla que ya se cobró sola tres
// veces.
//
// ══ EL LOTE ESTUVO BLOQUEADO Y SE DESBLOQUEÓ SOLO ════════════════════
//
// Este punto no se podía escribir el 2026-09-12 por la mañana: en L1 no
// había ni una forma donde la muta cum liquida decidiera el acento. Y no
// faltaba vocabulario — faltaba que la máquina declinara `tenebrae`, que
// llevaba en `PLURALIA_TANTUM` desde el principio sin producir formas.
// Ahora hay 14 formas repartidas en tres lemas: `tenebrae`, `volucris` e
// `integer`.
import { tipoDeAcento } from './atestar-acento';
import { decideLaMutaCumLiquida } from './gate-inventario-vs-lexico';
import { silabas } from '../voz/cuanto-duele';
import atestacion from '../../lib/data/languages/la/atestacion-acento.json';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const TABLA = (atestacion as { tabla: Record<string, { n: number }> }).tabla;
const VOCALES = 'aeiouāēīōūyȳ';

/** El grupo consonántico que cierra —o no— la penúltima: su coda más el
 *  arranque de la última. */
export function grupoDeLaPenultima(palabra: string): string {
  const s = silabas(palabra);
  if (s.length < 2) return '';
  const pen = s[s.length - 2]!, ult = s[s.length - 1]!;
  const coda = pen.replace(new RegExp(`^[^${VOCALES}]*[${VOCALES}]+`), '');
  const arranque = ult.match(new RegExp(`^[^${VOCALES}]*`))?.[0] ?? '';
  return coda + arranque;
}

export interface ItemLarga {
  id: string;
  punto: string;
  palabra: string;
  /** La sílaba tónica, escrita a mano. */
  respuesta: string;
  pista: string;
  glosa: string;
  ejes: {
    /** El grupo consonántico entre la penúltima y la última. */
    grupo: string;
    /** ¿Alarga la penúltima? `false` es muta cum liquida. */
    alarga: boolean;
  };
}

export type ClaseFalloLg =
  | 'tonica-no-derivable' | 'eje-mal-declarado' | 'sin-atestiguar'
  | 'penultima-larga-por-naturaleza' | 'pista-regala-la-tonica'
  | 'varia-incompleto' | 'suelo-de-la-lengua' | 'palabras-repetidas'
  | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloLg { item: string; clase: ClaseFalloLg; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();

export function revisarItemLarga(item: ItemLarga): FalloLg[] {
  const out: FalloLg[] = [];
  const push = (clase: ClaseFalloLg, detalle: string) => out.push({ item: item.id, clase, detalle });

  const t = tipoDeAcento(item.palabra);
  if (norm(t.tonica) !== norm(item.respuesta))
    push('tonica-no-derivable', `la respuesta es «${item.respuesta}» y la máquina saca «${t.tonica}» de ${t.silabas.join('-')}`);

  // SI LA PENÚLTIMA YA ES LARGA POR NATURALEZA, EL GRUPO NO DECIDE NADA.
  // Es el ítem que parece del punto y no lo es: con mácrón o diptongo en la
  // penúltima la palabra es llana pase lo que pase con las consonantes.
  const s = t.silabas;
  const pen = s[s.length - 2] ?? '';
  if (/[āēīōūȳ]/.test(pen) || ['ae', 'au', 'oe'].some((d) => pen.includes(d)))
    push('penultima-larga-por-naturaleza',
      `la penúltima «${pen}» ya es larga por naturaleza: el grupo consonántico no decide nada y el ítem no examina el punto`);

  const grupo = grupoDeLaPenultima(item.palabra);
  if (norm(grupo) !== norm(item.ejes.grupo))
    push('eje-mal-declarado', `declara el grupo «${item.ejes.grupo}» y la máquina ve «${grupo}»`);
  const alarga = !decideLaMutaCumLiquida(item.palabra);
  if (alarga !== item.ejes.alarga)
    push('eje-mal-declarado', `declara alarga=${item.ejes.alarga} y el grupo «${grupo}» ${alarga ? 'sí' : 'no'} alarga`);
  // Y las dos cosas tienen que cuadrar con el acento que sale.
  const esLlana = t.tipo !== 'breve';
  if (esLlana !== item.ejes.alarga)
    push('eje-mal-declarado', `declara alarga=${item.ejes.alarga} y la palabra sale ${esLlana ? 'llana' : 'esdrújula'}`);

  if ((TABLA[item.palabra]?.n ?? 0) === 0) push('sin-atestiguar', `«${item.palabra}» no aparece en el corpus`);

  const r = new RegExp(`(?<!\\p{L})${norm(item.respuesta).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\p{L})`, 'u');
  if (r.test(norm(item.pista))) push('pista-regala-la-tonica', `la pista nombra «${item.respuesta}» como palabra suelta`);
  return out;
}

export function coberturaLarga(items: ItemLarga[]): Cobertura[] {
  const n = items.length;
  const mcl = items.filter((i) => !i.ejes.alarga).length;
  const lemas = new Set(items.filter((i) => !i.ejes.alarga).map((i) => i.palabra.replace(/(ae|īs|ās|a|um|ōs|ēs|is|em|ā)$/, '')));
  const grupos = new Set(items.map((i) => i.ejes.grupo));
  return [
    { comprobacion: 'la tónica contra la máquina', decididos: n, total: n },
    { comprobacion: 'la forma aparece en el corpus', decididos: n, total: n },
    { comprobacion: 'la muta cum liquida, que refuta la regla del manual', decididos: mcl, total: n,
      motivoDeLosQueQuedanFuera: 'sólo un grupo oclusiva + líquida puede refutar que «dos consonantes alargan»; los demás grupos la confirman' },
    { comprobacion: 'lemas distintos entre los de muta cum liquida', decididos: lemas.size, total: 3,
      motivoDeLosQueQuedanFuera: 'en L1 sólo hay tres lemas que la produzcan: `tenebrae`, `volucris` e `integer`' },
    { comprobacion: 'grupos consonánticos distintos', decididos: grupos.size, total: n,
      motivoDeLosQueQuedanFuera: 'el varia es el grupo: repetir `nt` seis veces sería un ítem seis veces' },
  ];
}

export function tasasCiegasLg(items: ItemLarga[]) {
  const n = Math.max(1, items.length);
  return {
    // La regla del manual: dos consonantes alargan, siempre.
    reglaDelManual: items.filter((i) => i.ejes.alarga).length / n,
    nuncaAlarga: items.filter((i) => !i.ejes.alarga).length / n,
  };
}

const LEMAS_MCL_MINIMOS = 3;

export function revisarLoteLarga(items: ItemLarga[]): FalloLg[] {
  const out: FalloLg[] = items.flatMap(revisarItemLarga);

  const p = items.length === 0 ? 0 : items.filter((i) => i.ejes.alarga).length / items.length;
  if (items.length > 0 && Math.abs(p - 0.5) > 0.15)
    out.push({ item: '(lote)', clase: 'suelo-de-la-lengua',
      detalle: `el ${(100 * p).toFixed(0)} % de los ítems alarga: la regla del manual —«dos consonantes alargan»— resuelve el lote sin saber la excepción` });

  const lemas = new Set(items.filter((i) => !i.ejes.alarga)
    .map((i) => i.palabra.replace(/(ae|īs|ās|a|um|ōs|ēs|is|em|ā)$/, '')));
  if (lemas.size < LEMAS_MCL_MINIMOS)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `los ítems de muta cum liquida salen de ${lemas.size} lema(s) y hacen falta ${LEMAS_MCL_MINIMOS}: con uno solo el lote mide un lema, no la regla` });

  const repes = new Map<string, string>();
  for (const i of items) {
    if (repes.has(norm(i.palabra))) out.push({ item: i.id, clase: 'palabras-repetidas', detalle: `«${i.palabra}» ya está en ${repes.get(norm(i.palabra))}` });
    else repes.set(norm(i.palabra), i.id);
  }

  const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.alarga));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «alarga» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaLarga(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloLg, detalle: f.detalle })));
  return out;
}

export function informeLarga(items: ItemLarga[]): string {
  const fallos = revisarLoteLarga(items);
  const t = tasasCiegasLg(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaLarga(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · la regla del manual («dos consonantes alargan») ${pct(t.reglaDelManual)} · «nunca alarga» ${pct(t.nuncaAlarga)}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

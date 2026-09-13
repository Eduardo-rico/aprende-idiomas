// scripts/lib/gate-eclesiastica.ts — LOS CINCO PUNTOS DE LECTURA ECLESIÁSTICA.
//
// `l1-eclesiastica-ce`, `-ae`, `-ti`, `-gn` y `l1-h-muda`. Comparten gate
// porque comparten forma: se da una palabra latina y se pide **cómo suena**,
// escrito para un hispanohablante.
//
// ══ POR QUÉ SE EXAMINA POR ESCRITO, Y LO DICE EL INVENTARIO ══════════
//
// El `motivo` de `l1-eclesiastica-ce`: «ESCUCHA bloqueada hasta que la
// batería valide la voz; hasta entonces se examina eligiendo la
// transcripción, que es lo que sí se puede medir por escrito». La batería
// cerró en `needs-human`, así que el canal escrito es el único que hay.
//
// ══ LA TRANSCRIPCIÓN NO ES `textoParaVoz` ════════════════════════════
//
// Aquella prepara el texto para una voz ITALIANA, que ya hace sola `ce`,
// `ge` y `gn` — sus propios comentarios lo dicen. Respelizarlas allí
// produciría `chichero` y la voz leería /kikero/. Son dos preguntas
// distintas y el proyecto tenía sólo una función.
//
// ══ EL CASO NEGATIVO ES LA MITAD DEL PUNTO ═══════════════════════════
//
// Cada uno de los cuatro declara su excepción, y son las que producen el
// error del alumno que SOBREAPLICA:
//
//   ce   `ca`, `co`, `cu` siguen siendo /k/ — *«chása» por «casa»
//   ae   la diéresis rompe el dígrafo — *«ér» por «aër»
//   ti   tras `s`, `t` o `x` no se africa — `bestia`, no *«bétsia»
//   gn   —
//
// Por eso el equilibrio va sobre «aplica / no aplica» y es ABSOLUTO: un
// lote todo de casos positivos enseña la regla y no su borde, y el alumno
// sale sobreaplicando.
import { transcribir, reglasQueAplican, PUNTO_DE_LA_REGLA, type ReglaEclesiastica } from '../../lib/lang/transcripcion-eclesiastica';
import atestacion from '../../lib/data/languages/la/atestacion-acento.json';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const TABLA = (atestacion as { tabla: Record<string, { n: number }> }).tabla;

export interface ItemEclesiastica {
  id: string;
  punto: string;
  palabra: string;
  /** La transcripción, escrita a mano y contrastada contra la máquina. */
  respuesta: string;
  pista: string;
  glosa: string;
  ejes: {
    regla: ReglaEclesiastica;
    /** `false` = caso NEGATIVO: la regla NO se aplica y ésa es la lección. */
    aplica: boolean;
  };
  /** Obligatorio si la forma no aparece en el corpus. */
  porQueSinAtestiguar?: string;
}

export type ClaseFalloEc =
  | 'transcripcion-no-derivable' | 'eje-mal-declarado' | 'punto-no-corresponde'
  | 'sin-atestiguar' | 'pista-regala-la-forma' | 'palabras-repetidas'
  | 'sin-caso-negativo' | 'suelo-de-la-lengua' | 'orden-separable'
  | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloEc { item: string; clase: ClaseFalloEc; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();

export function revisarItemEclesiastica(item: ItemEclesiastica): FalloEc[] {
  const out: FalloEc[] = [];
  const push = (clase: ClaseFalloEc, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = transcribir(item.palabra);
  if (norm(dela) !== norm(item.respuesta))
    push('transcripcion-no-derivable', `la respuesta es «${item.respuesta}» y la máquina transcribe «${dela}»`);

  const aplica = reglasQueAplican(item.palabra).includes(item.ejes.regla);
  if (aplica !== item.ejes.aplica)
    push('eje-mal-declarado', `declara aplica=${item.ejes.aplica} para «${item.ejes.regla}» y en «${item.palabra}» ${aplica ? 'sí' : 'no'} se aplica`);

  if (PUNTO_DE_LA_REGLA[item.ejes.regla] !== item.punto)
    push('punto-no-corresponde', `la regla «${item.ejes.regla}» es de ${PUNTO_DE_LA_REGLA[item.ejes.regla]} y el ítem dice ${item.punto}`);

  if ((TABLA[item.palabra]?.n ?? 0) === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20)
    push('sin-atestiguar', `«${item.palabra}» no aparece en el corpus`);

  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa]] as const)
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  return out;
}

export function coberturaEclesiastica(items: ItemEclesiastica[], opc: OpcionesEc = {}): Cobertura[] {
  const n = items.length;
  const negativos = items.filter((i) => !i.ejes.aplica).length;
  const invariante = (opc.invarianciaJustificada ?? '').trim().length >= 30;
  const reglas = new Set(items.map((i) => i.ejes.regla));
  return [
    { comprobacion: 'la transcripción contra la máquina', decididos: n, total: n },
    { comprobacion: 'la forma aparece en el corpus', decididos: n, total: n },
    { comprobacion: 'el caso NEGATIVO, donde la regla no se aplica', decididos: negativos, total: n,
      ...(invariante ? { elCeroEsUnResultado: opc.invarianciaJustificada! } : {}),
      motivoDeLosQueQuedanFuera: 'los positivos enseñan la regla; sólo los negativos enseñan su borde, que es donde el alumno sobreaplica' },
    { comprobacion: 'reglas distintas dentro del punto', decididos: reglas.size, total: n,
      motivoDeLosQueQuedanFuera: 'algunos puntos agrupan varias reglas (`ce/ci`, `ge/gi`, `sc+e/i`) y otros una sola' },
  ];
}

export function tasasCiegasEc(items: ItemEclesiastica[]) {
  const n = Math.max(1, items.length);
  return {
    aplicarSiempre: items.filter((i) => i.ejes.aplica).length / n,
    noAplicarNunca: items.filter((i) => !i.ejes.aplica).length / n,
  };
}

/** Un punto puede declarar que su regla NO tiene contexto y por tanto no
 *  tiene caso negativo. `l1-h-muda` lo hace con estas palabras: «la
 *  operación es la misma en todos los contextos porque la regla no tiene
 *  excepción: es propiedad de la lengua, no del lote». Va con el motivo
 *  escrito y no como un `boolean` suelto: una exención sin motivo es un
 *  agujero que nadie revisa. */
export interface OpcionesEc { invarianciaJustificada?: string }

export function revisarLoteEclesiastica(items: ItemEclesiastica[], opc: OpcionesEc = {}): FalloEc[] {
  const out: FalloEc[] = items.flatMap(revisarItemEclesiastica);
  const invariante = (opc.invarianciaJustificada ?? '').trim().length >= 30;

  if (items.length > 0 && !invariante && !items.some((i) => !i.ejes.aplica))
    out.push({ item: '(lote)', clase: 'sin-caso-negativo',
      detalle: 'todos los ítems aplican la regla: el lote enseña la regla y no su borde, y el alumno sale sobreaplicando' });

  const p = items.length === 0 ? 0 : items.filter((i) => i.ejes.aplica).length / items.length;
  if (items.length > 0 && !invariante && Math.abs(p - 0.5) > 0.2)
    out.push({ item: '(lote)', clase: 'suelo-de-la-lengua',
      detalle: `en el ${(100 * p).toFixed(0)} % de los ítems la regla se aplica: contestar siempre lo mismo resuelve el lote` });

  const repes = new Map<string, string>();
  for (const i of items) {
    if (repes.has(norm(i.palabra))) out.push({ item: i.id, clase: 'palabras-repetidas', detalle: `«${i.palabra}» ya está en ${repes.get(norm(i.palabra))}` });
    else repes.set(norm(i.palabra), i.id);
  }

  const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.aplica));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «la regla se aplica» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaEclesiastica(items, opc)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloEc, detalle: f.detalle })));
  return out;
}

export function informeEclesiastica(items: ItemEclesiastica[], opc: OpcionesEc = {}): string {
  const fallos = revisarLoteEclesiastica(items, opc);
  const t = tasasCiegasEc(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaEclesiastica(items, opc)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · aplicar siempre ${pct(t.aplicarSiempre)} · no aplicar nunca ${pct(t.noAplicarNunca)}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

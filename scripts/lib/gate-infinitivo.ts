// scripts/lib/gate-infinitivo.ts — EL GATE DE LOS CINCO INFINITIVOS.
//
// Punto `l8-infinitivo-sustantivo`. `varia`: «el tiempo y la voz del
// infinitivo». Y el punto declara además una `invarianciaJustificada`: «la
// función sustantiva del infinitivo es idéntica a la española en todos los
// contextos: variar aquí sería inventar dificultad».
//
// ══ LO QUE ESO SIGNIFICA PARA EL GATE ════════════════════════════════
//
// Que la FUNCIÓN no se examina y la FORMA sí. Un ítem que variara el papel
// del infinitivo —sujeto, objeto, con «que» en español— estaría midiendo un
// regalo: el español hace lo mismo. Lo que hay que saber producir son cinco
// casillas, y el gate mide que estén.
//
//     presente activo    570 tokens   `amāre`
//     presente pasivo    234           `amārī` · `dīcī` · `fierī`
//     perfecto pasivo    185           `amātus esse`   perifrástico
//     perfecto activo     40           `amāvisse`
//     futuro activo       20           `amātūrus esse` perifrástico
//
// ══ LA ESTRATEGIA CIEGA ES LA MISMA QUE EN EL FUTURO ═════════════════
//
// El pasivo tiene DOS reglas, no una: la 1.ª, la 2.ª y la 4.ª cambian la
// `-e` final por `-ī` (`amāre` → `amārī`); la 3.ª pierde la sílaba entera
// (`dūcere` → `dūcī`, no *`dūcerī`). Quien aplique la primera a todo
// escribe formas que no existen, y es el mismo perfil que
// `l5-futuro-dos-formas`: dos reglas presentadas como una fabrican un error
// sistemático. Los ítems que refutan esa regla son los de 3.ª y mixta, y el
// gate cuenta cuántos hay en vez de suponerlo.
//
// ══ Y LOS PERIFRÁSTICOS NO TIENEN UNA RESPUESTA SOLA ═════════════════
//
// `amātus esse` concuerda con el sujeto: con sujeto femenino es `amāta
// esse`. Un ítem de perfecto pasivo o de futuro activo que no fije el
// género no tiene una respuesta, tiene tres. El gate lo exige.
import { todosLosInfinitivos, pasivoIngenuo, PASIVO_SUPLETIVO, type TiempoInfinitivo, type VozInfinitivo } from '../../lib/data/languages/la/infinitivos';
import type { EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';
import atestacion from '../../lib/data/languages/la/atestacion-infinitivos.json';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const LEMAS = (atestacion as { lemas: Record<string, Record<string, { forma: string; n: number; bigrama?: number }>> }).lemas;

export interface ItemInfinitivo {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  tiempo: TiempoInfinitivo;
  voz: VozInfinitivo;
  /** Escrita a mano y contrastada contra la máquina. */
  respuesta: string;
  marco: string;
  pista: string;
  glosa: string;
  ejes: {
    /** Dos palabras y concordancia. Se declara, y el gate lo contrasta. */
    perifrastico: boolean;
    /** Obligatorio en los perifrásticos: sin él la respuesta no es una. */
    genero?: 'm' | 'f' | 'n';
    /** También obligatorio en los perifrásticos, y por la misma razón. En
     *  `Rēx vīsūrus esse dīcitur` el sujeto es nominativo; en `Sē rēgem
     *  vīsūrum esse dīcit` es acusativo, y el participio lo sigue. */
    caso?: 'nom' | 'ac';
  };
  /** Obligatorio si la forma no aparece en el corpus. */
  porQueSinAtestiguar?: string;
  /** Palabras del marco que se admiten aunque no estén en L1, con su motivo
   *  en el propio lote. La lista va por ÍTEM y no global: una exención
   *  global se convierte en un agujero que nadie revisa. */
  exentasDelMarco?: string[];
}

export type ClaseFalloInf =
  | 'respuesta-no-derivable'
  | 'sin-atestiguar'
  | 'perifrastico-sin-genero'
  | 'eje-mal-declarado'
  | 'pista-regala-la-forma'
  | 'marco-mal'
  | 'marco-fuera-de-l1'
  | 'varia-incompleto'
  | 'estrategia-ciega'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloInf { item: string; clase: ClaseFalloInf; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();

export function revisarItemInfinitivo(item: ItemInfinitivo): FalloInf[] {
  const out: FalloInf[] = [];
  const push = (clase: ClaseFalloInf, detalle: string) => out.push({ item: item.id, clase, detalle });

  // Un perifrástico sin género Y CASO declarados no tiene UNA respuesta.
  if (item.ejes.perifrastico && (!item.ejes.genero || !item.ejes.caso)) {
    push('perifrastico-sin-genero',
      `«${item.respuesta}» concuerda con el sujeto en género y caso, y el ítem declara ${item.ejes.genero ? '' : 'género=no '}${item.ejes.caso ? '' : 'caso=no '}: la respuesta no es una, son seis`);
  }

  const todos = todosLosInfinitivos(item.verbo, item.ejes.genero ?? 'm', item.ejes.caso ?? 'nom');
  const dela = todos.find((i) => i.tiempo === item.tiempo && i.voz === item.voz);
  if (!dela) {
    push('respuesta-no-derivable', `«${item.verbo.lema}» no forma el infinitivo ${item.tiempo} ${item.voz}`);
    return out;
  }
  if (norm(dela.forma) !== norm(item.respuesta)) {
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela.forma}»`);
  }
  if (dela.perifrastico !== item.ejes.perifrastico) {
    push('eje-mal-declarado', `declara perifrastico=${item.ejes.perifrastico} y la máquina dice ${dela.perifrastico}`);
  }

  // La clave lleva género y caso en los perifrásticos: `factum esse` no se
  // comprueba contra la cuenta de `factus`.
  const clave = item.ejes.perifrastico
    ? `${item.tiempo}.${item.voz}.${item.ejes.genero ?? 'm'}.${item.ejes.caso ?? 'nom'}`
    : `${item.tiempo}.${item.voz}`;
  const cel = LEMAS[item.verbo.lema]?.[clave];
  if (!cel) push('sin-atestiguar', `no hay celda ${clave} de «${item.verbo.lema}» en la atestación congelada`);
  else if (cel.n === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20) {
    push('sin-atestiguar', `«${item.respuesta}» no aparece en los 227.301 tokens (y si hay motivo, hay que escribirlo)`);
  }

  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa], ['el marco', item.marco]] as const) {
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  }
  // El marco no puede llevar el infinitivo de presente, que es el dato que
  // se le enseña junto al lema.
  if (norm(item.marco).replace('___', '').includes(norm(item.verbo.infinitivo))) {
    push('pista-regala-la-forma', `el marco lleva el infinitivo «${item.verbo.infinitivo}», que va en la entrada del lexicón`);
  }
  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');

  // ── EL VOCABULARIO DEL MARCO ──
  //
  // Salió del pase adversarial sobre este mismo lote, ya verde: cuatro de
  // doce marcos usaban palabras que no están en L1 (`scīmus`, `crēdunt`,
  // `mundus`, `nūntius`, `vērum`). El gate miraba la respuesta y no el
  // contexto, así que pasaban limpios — y un ítem cuyo marco no se entiende
  // no mide la forma: mide si adivinas de qué va la frase.
  {
    const d = palabrasDesconocidas(item.marco, item.exentasDelMarco ?? []);
    if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  }
  return out;
}

export function coberturaInfinitivo(items: ItemInfinitivo[]): Cobertura[] {
  const n = items.length;
  const celdas = new Set(items.map((i) => `${i.tiempo}.${i.voz}`));
  // La regla ingenua sólo se distingue de la buena en la 3.ª y la mixta.
  const refutan = items.filter((i) => i.tiempo === 'presente' && i.voz === 'pasiva'
    && norm(pasivoIngenuo(i.verbo)) !== norm(i.respuesta)).length;
  const perif = items.filter((i) => i.ejes.perifrastico).length;
  const supletivos = items.filter((i) => PASIVO_SUPLETIVO[i.verbo.lema.normalize('NFC')] !== undefined).length;
  return [
    { comprobacion: 'la respuesta contra la máquina', decididos: n, total: n },
    { comprobacion: 'la forma aparece en el corpus', decididos: n, total: n },
    { comprobacion: 'las cinco casillas del varia', decididos: celdas.size, total: 5,
      motivoDeLosQueQuedanFuera: 'el varia son tiempo y voz: cinco casillas, y el lote tiene que tocarlas todas' },
    { comprobacion: 'la regla de la 1.ª aplicada a la 3.ª', decididos: refutan, total: n,
      motivoDeLosQueQuedanFuera: 'sólo un pasivo de 3.ª o mixta la refuta: en la 1.ª, la 2.ª y la 4.ª la regla ingenua ES la buena' },
    { comprobacion: 'la concordancia del perifrástico', decididos: perif, total: n,
      motivoDeLosQueQuedanFuera: 'sólo el perfecto pasivo y el futuro activo son de dos palabras' },
    { comprobacion: 'la supleción de `faciō`', decididos: supletivos, total: n,
      motivoDeLosQueQuedanFuera: 'sólo `faciō` la tiene en L1; `facī` sale 0 veces y `fierī` 118' },
  ];
}

export function tasasCiegasInf(items: ItemInfinitivo[]) {
  const pasivos = items.filter((i) => i.tiempo === 'presente' && i.voz === 'pasiva');
  return {
    reglaDeLaPrimera: {
      tasa: pasivos.length === 0 ? 0 : pasivos.filter((i) => norm(pasivoIngenuo(i.verbo)) === norm(i.respuesta)).length / pasivos.length,
      decididos: pasivos.length, total: items.length,
    },
    copiarElInfinitivo: {
      tasa: items.length === 0 ? 0 : items.filter((i) => norm(i.verbo.infinitivo) === norm(i.respuesta)).length / items.length,
      decididos: items.length, total: items.length,
    },
  };
}

export function revisarLoteInfinitivo(items: ItemInfinitivo[]): FalloInf[] {
  const out: FalloInf[] = items.flatMap(revisarItemInfinitivo);

  const celdas = new Set(items.map((i) => `${i.tiempo}.${i.voz}`));
  const faltan = ['presente.activa', 'presente.pasiva', 'perfecto.activa', 'perfecto.pasiva', 'futuro.activa']
    .filter((c) => !celdas.has(c));
  if (faltan.length > 0) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `el varia son el tiempo y la voz, y el lote no toca ${faltan.join(', ')}` });

  if (!items.some((i) => PASIVO_SUPLETIVO[i.verbo.lema.normalize('NFC')] !== undefined)) {
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: '`faciō` hace su pasivo con otro verbo —`fierī` ×118 contra `facī` ×0— y ningún ítem lo examina' });
  }

  const sep = separablePorPosicion(patronDe(items, (i) => i.voz === 'pasiva'));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «es pasivo» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaInfinitivo(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloInf, detalle: f.detalle })));

  const t = tasasCiegasInf(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  if (t.reglaDeLaPrimera.decididos > 0 && t.reglaDeLaPrimera.tasa > 0.5) {
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«cambiar la -e por -ī en todos» acierta ${pct(t.reglaDeLaPrimera.tasa)} de los ${t.reglaDeLaPrimera.decididos} pasivos de presente: por encima de la mitad, el lote no enseña que son dos reglas` });
  }
  if (t.copiarElInfinitivo.tasa > 0.5) {
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«copiar el infinitivo del lexicón» acierta ${pct(t.copiarElInfinitivo.tasa)} del lote` });
  }
  return out;
}

export function informeInfinitivo(items: ItemInfinitivo[]): string {
  const fallos = revisarLoteInfinitivo(items);
  const t = tasasCiegasInf(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaInfinitivo(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · la regla de la 1.ª: ${pct(t.reglaDeLaPrimera.tasa)} sobre los ${t.reglaDeLaPrimera.decididos} pasivos de presente · copiar el infinitivo: ${pct(t.copiarElInfinitivo.tasa)}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

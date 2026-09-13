// scripts/check-yo-ru.ts — EL BARRIDO DE LA Ё SOBRE TODO EL DATO RUSO PUBLICADO.
//
//   npx tsx scripts/check-yo-ru.ts
//   npx tsx scripts/check-yo-ru.ts --todo   (imprime también lo ya leído)
//
// ══ POR QUÉ ESTE FICHERO EXISTE ══════════════════════════════════════
//
// **La normalización no falla: aprueba.** `contar()`, en el gate del
// paradigma, funde las dos grafías de la ё —y funde bien, porque el corpus
// es bimodal POR EDICIÓN y buscar `сестёр` a secas se deja el 90 %—. El
// defecto fue usar esa misma función para una pregunta cuya respuesta **es**
// la distinción que ella borra.
//
// El resultado fueron dos errores VIVOS y PUBLICADOS, los dos en verde en
// todas las demás comprobaciones:
//
//   · `день` producía `*днем`; la forma es `днём` (52 con ё · 428 sin)
//   · `сестра` producía `*сестрам/*сестрами/*сестрах`; el tema oblicuo del
//     plural es `сёстр-` (4 · 29, que es la tasa exacta de ediciones ё-ificadas)
//
// Y el lexicón se contradecía a sí mismo: la `nota` de `день` ya escribía
// «дня, дню, днём, дне». La prosa lo sabía y la máquina no.
//
// Es la CUARTA vez que el proyecto paga esta forma —en rumano fueron el
// guion de la ênclise, el acento de la crase y la coma de la adversativa—.
// La lección operativa: **si el gate normaliza un rasgo, no puede examinar
// ese rasgo**, y hace falta un instrumento aparte con el nombre puesto.
//
// ══ QUÉ BARRE, Y ES «TODO EL DATO RUSO» A PROPÓSITO ══════════════════
//
// Si hay dos, es probable que haya más. Y si no hay más, ese cero es
// información y va escrito. Tres fuentes:
//
//   1. las **603 formas generadas** por la máquina de paradigmas;
//   2. los **campos del lexicón** (lemas, plurales, temas, locativos);
//   3. la **prosa de los 93 puntos del inventario** — que es dato publicado
//      igual que lo demás: de ahí salen los ejemplos de los ítems.
//
// ══ Y UNA SEÑAL NO ES UN ERROR ═══════════════════════════════════════
//
// De las 8 señales del primer barrido sobre el paradigma, 2 eran errores y
// 4 eran otra cosa: la candidata puede ser OTRA CASILLA del mismo lema
// (`сестры` gen sg frente a `сёстры` nom pl), OTRO LEMA (`берег` «orilla»
// frente a `берёг`, pasado de `беречь`) o una FÓRMULA FIJA (`живёшь-можёшь`,
// Leskov, 1 aparición). Contar no las separa; sólo leerlas. Por eso la
// salida las manda a leer y el juicio va al lexicón, nunca a un comentario.
import { candidatasConYo } from './check-paradigma-ru';
import { controles } from './corpus-ru';
import { NOMBRES_A1, VERBOS_A1 } from '../lib/data/languages/ru/lexicon-a1';
import { PUNTOS_RU } from '../lib/data/languages/ru/inventario-puntos';
import {
  paradigmaNominal, paradigmaPresente, pasado, imperativo, prepositivoSg,
} from '../lib/data/languages/ru/paradigma-ru';

export interface Senal { fuente: string; donde: string; forma: string; conYo: string; n: number; leido?: string }

/** Las formas rusas que el proyecto PUBLICA, cada una con su procedencia. */
export function datoRusoPublicado(): { fuente: string; donde: string; forma: string; leido?: string }[] {
  const out: { fuente: string; donde: string; forma: string; leido?: string }[] = [];

  // 1 · lo que la máquina genera
  for (const e of NOMBRES_A1) {
    const t = paradigmaNominal(e);
    for (const [num, celdas] of [['sg', t.sg], ['pl', t.pl]] as const) {
      if (!celdas) continue;
      for (const [caso, forma] of Object.entries(celdas))
        out.push({ fuente: 'paradigma', donde: `${e.lema} ${caso}.${num}`, forma, leido: e.lecturaYo?.[`${caso}.${num}`] });
    }
    if (e.locativo2) out.push({ fuente: 'paradigma', donde: `${e.lema} locativo2`, forma: prepositivoSg(e, e.locativo2.regente)!, leido: e.lecturaYo?.locativo2 });
  }
  for (const v of VERBOS_A1) {
    for (const [p, f] of Object.entries(paradigmaPresente(v)))
      if (f) out.push({ fuente: 'paradigma', donde: `${v.lema} pres.${p}`, forma: f, leido: v.lecturaYo?.[`pres.${p}`] });
    for (const g of ['m', 'f', 'n', 'pl'] as const) {
      const f = pasado(v, g);
      if (f) out.push({ fuente: 'paradigma', donde: `${v.lema} pas.${g}`, forma: f, leido: v.lecturaYo?.[`pas.${g}`] });
    }
    const imp = imperativo(v);
    if (imp) out.push({ fuente: 'paradigma', donde: `${v.lema} imperativo`, forma: imp, leido: v.lecturaYo?.imperativo });
  }

  // 2 · los campos guardados del lexicón. No son redundantes con (1): un
  //     campo puede estar mal y no llegar a ninguna casilla generada.
  for (const e of NOMBRES_A1)
    for (const [k, val] of Object.entries({ lema: e.lema, nomPlIrreg: e.nomPlIrreg, genPlIrreg: e.genPlIrreg, temaPl: e.temaPl, temaOblicuo: e.temaOblicuo, locativo2: e.locativo2?.forma }))
      if (val) out.push({ fuente: 'lexicon', donde: `${e.lema}.${k}`, forma: val, leido: e.lecturaYo?.[k] });
  for (const v of VERBOS_A1)
    for (const [k, val] of Object.entries({ lema: v.lema, temaPresente: v.temaPresente, tema1sg: v.tema1sg }))
      if (val) out.push({ fuente: 'lexicon', donde: `${v.lema}.${k}`, forma: val, leido: v.lecturaYo?.[k] });

  // 3 · la prosa de los 93 puntos. Es dato publicado: de ahí salen los
  //     ejemplos que acaban en los ítems.
  for (const p of PUNTOS_RU) {
    const prosa = [p.descripcion, p.cita, p.motivo, p.gratis, p.varianza ?? '', p.abierto ?? ''].join(' ');
    const enMinuscula = prosa.toLowerCase();
    // ⚠ `\w` y `\b` están PROHIBIDOS en ruso: en cirílico devuelven cero
    // limpio y SIN error. Clases unicode y nada más.
    for (const m of prosa.matchAll(/\p{Script=Cyrillic}+/gu)) {
      const w = m[0].toLowerCase();
      // ⚠ DOS FILTROS, Y LOS DOS SALIERON DE VER EL BARRIDO EN ROJO CON
      // HALLAZGOS FALSOS. Un gate nuevo da sus primeros hallazgos falsos
      // antes que los buenos, y aquí fueron 8 de 10.
      //
      // (a) **MENOS DE TRES LETRAS NO ES UNA PALABRA EN PROSA
      // METALINGÜÍSTICA**: es una letra, una desinencia o una partícula que
      // el punto MENCIONA. El barrido marcó cuatro veces la `е` suelta de
      // «-о,-е» contra «ё» 4.307, y una vez el sufijo comparativo `-ее`
      // contra `её` 2.591. Eran mi extractor fabricando el defecto, no el
      // dato. Antes de atribuir un hallazgo a los datos, hay que comprobar
      // que el extractor no lo esté produciendo.
      if (w.length < 3) continue;
      // (b) **SI EL PUNTO ESCRIBE TAMBIÉN LA VARIANTE CON Ё, NO SE EQUIVOCA:
      // ESTÁ ENSEÑANDO EL CONTRASTE.** `u1-yo-doble-ortografia` y
      // `u8-resultado-anulado` escriben `пришел/пришёл` y «он пришёл 16 + он
      // пришел 130» — el primero porque la ё ES su contenido, el segundo
      // porque está contando las dos grafías a propósito. Marcarlos sería
      // marcar al único punto del inventario cuyo tema es este rasgo, y un
      // gate que marca lo que el punto hace a propósito nadie lo lee.
      if (/[её]/.test(w) && enMinuscula.includes(w.replace(/е/g, 'ё'))) continue;
      out.push({ fuente: 'inventario', donde: p.id, forma: w });
    }
  }
  return out;
}

/** Las lecturas de las señales que NO son errores, con su motivo. Mismo
 *  criterio que `lecturaRival` del lexicón: una señal leída es un hecho
 *  sabido, y una sin leer es lo único que tumba el barrido. Viven aquí y no
 *  en el inventario porque son propiedad de ESTA medición, no del punto. */
const LEIDAS_INVENTARIO: Record<string, string> = {
  'u4-sujeto-dativo|лет': 'лёт («vuelo») sale 1 vez y es OTRO LEMA. `лет` en «мне 30 лет» es el genitivo plural de год y se escribe sin ё',
  'u13-dobletes-eslavo-eclesiasticos|берег': 'берёг (4) es el pasado masculino de беречь «guardar». `берег` «orilla» es el lema que este punto empareja con брег, y va sin ё',
};

export function barrerYo(): { senales: Senal[]; leidas: Senal[]; medidas: number } {
  const senales: Senal[] = [];
  const leidas: Senal[] = [];
  const vistos = new Set<string>();
  let medidas = 0;
  for (const d of datoRusoPublicado()) {
    const clave = `${d.fuente}|${d.donde}|${d.forma}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    medidas++;
    for (const c of candidatasConYo(d.forma)) {
      const motivo = d.leido ?? LEIDAS_INVENTARIO[`${d.donde}|${d.forma}`];
      const s: Senal = { ...d, conYo: c.forma, n: c.n, leido: motivo };
      (motivo ? leidas : senales).push(s);
    }
  }
  return { senales, leidas, medidas };
}

if (/[/\\]check-yo-ru\.ts$/.test(process.argv[1] ?? '')) {
  const c = controles();
  if (!c.ok) { console.error(`CONTROLES EN ROJO (${c.positivo}/${c.negativo}). Ningún número es fiable.`); process.exit(1); }
  console.log(`corpus OK — canario positivo ${c.positivo} · negativo ${c.negativo}\n`);

  const { senales, leidas, medidas } = barrerYo();
  console.log(`── BARRIDO DE LA Ё SOBRE TODO EL DATO RUSO PUBLICADO ──`);
  console.log(`   cadenas medidas: ${medidas}  (paradigma + lexicón + prosa de los 93 puntos)`);
  console.log(`   señales con lectura escrita: ${leidas.length}`);
  console.log(`   señales SIN leer: ${senales.length}\n`);

  const porFuente = new Map<string, number>();
  for (const s of senales) porFuente.set(s.fuente, (porFuente.get(s.fuente) ?? 0) + 1);
  if (senales.length) {
    console.log('⚠ EL DATO ESCRIBE «е» Y LA LENGUA ESCRIBE «ё» AHÍ — cada una hay que LEERLA:');
    console.log('   una candidata atestada puede ser (a) el error, (b) otra casilla del mismo');
    console.log('   lema, (c) otro lema, o (d) una fórmula fija. Contar no las separa.');
    for (const s of senales) console.log(`  [${s.fuente}] ${s.donde}\t«${s.forma}» → «${s.conYo}» ${s.n}`);
    console.log(`\n   por fuente: ${[...porFuente].map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  } else {
    console.log('CERO señales sin leer. Y ese cero es información, no ausencia de medida:');
    console.log(`el instrumento acaba de cazar ${leidas.length} candidatas reales sobre estas mismas`);
    console.log('cadenas, así que sabe devolver distinto de cero.');
  }

  if (process.argv.includes('--todo') && leidas.length) {
    console.log('\n── SEÑALES YA LEÍDAS, con su motivo ──');
    for (const s of leidas) console.log(`  [${s.fuente}] ${s.donde}\t«${s.forma}» → «${s.conYo}» ${s.n}\n      ${s.leido}`);
  }
  process.exit(senales.length ? 1 : 0);
}

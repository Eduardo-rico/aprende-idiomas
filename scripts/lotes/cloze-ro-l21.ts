// scripts/lotes/cloze-ro-l21.ts — LOTE 21: `r8-comparativo`.
//
//   npx tsx scripts/lotes/cloze-ro-l21.ts
//   npx tsx scripts/lotes/cloze-ro-l21.ts --asigna
//
// El lote nació con DOS puntos y sale con UNO. `r8-discurso-indirecto` se
// escribió, se atacó y se retiró entero: el motivo está en su entrada del
// inventario, y en una frase es que su única cara examinable no resistió.
//
// ── LO QUE LA PRECONDICIÓN Y EL CORPUS MATARON ANTES DE PUBLICAR ──────
// Dos pasadas del lingüista adversarial y una del CORPUS del proyecto
// (817 lecturas, 2,88 M de palabras). El corpus refutó al lingüista dos
// veces y lo confirmó tres. Lo que gobierna estos ítems:
//
// 1. **`mai + ADJ + ca` NO es agramatical**, así que todo hueco de término
//    de comparación tras `mai + ADJ` está INDETERMINADO. Medido, no
//    supuesto: `mai ADJ decât/decît` = 514 contra `mai ADJ ca` = 100, en
//    prosa corriente («Tu nu ești mai mare CA mine?», «alta mai frumoasă
//    CA ea»). La mitad obvia del punto no existe.
//
// 2. **`decât eu` está ATESTADO** (7, más `decât tu` 2): marcar el
//    nominativo sería el asterisco propio del §0.
//
// 3. **`din ei` está ATESTADO 319 veces**, así que el ítem que forzaba
//    `dintre` con pronombre plural —que el lingüista firmaba como
//    determinado— no lo está. Lo tumbó el corpus, no él.
//
// 4. **El eje al que el propio inventario «acotaba» el punto es el que
//    menos vale.** Y la razón que yo había escrito para descartarlo era
//    FALSA: no es que «el español reparta igual», porque `decât` y `ca`
//    son los DOS de superioridad y el `como` español es de igualdad.
//    Emparejar `ca` ↔ `como` le habría enseñado al alumno que `ca` marca
//    igualdad. Se descarta por (1), no por el calco.
//
// ── LO QUE MIDEN ESTOS ÍTEMS ──────────────────────────────────────────
// A · LA CONCORDANCIA DE `cel`, en sus cuatro casillas, **con adjetivo
//     invariable en género** y con el género español apuntando al revés.
//     Las dos condiciones son necesarias y la primera se me escapó: con
//     un adjetivo marcado el alumno copia la desinencia que ya está en la
//     frase y acierta sin mirar el nombre.
// B · LA FRONTERA DE A: la casilla SIN NOMBRE, donde `cel` es invariable.
// C · EL CORTE `bine` / `bun`, y su frontera predicativa.
//
// ── UNA ADVERTENCIA SOBRE EL ALCANCE, QUE NO SE PUEDE PERDER ──────────
// El corte `bine`/`bun` **sí se resuelve traduciendo**, por un rodeo: el
// español conserva el corte en grado positivo (*bien* / *bueno*) y sólo
// lo pierde en el comparativo, así que basta bajar al positivo — «habla
// BIEN» → `bine`, «es BUENA» → `bună`, sin excepciones. El punto es
// legítimo (el rodeo hay que conocerlo), pero la prosa NO puede venderlo
// como algo que el español no tiene. Lo decía, y era falso.
//
// Y los ítems 7 y 8 están determinados **por la pista**, no por la frase:
// sin la glosa «mejor», `mult`, `des`, `rar`, `clar` caben en el 7 y
// `multă`, `gustoasă`, `ieftină` en el 8. Es el §4.16 con nombre y
// apellidos: el día que alguien acorte o esconda la pista, los dos se
// vuelven indeterminados a la vez y en silencio.
import { verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';

const CMP = 'r8-comparativo';

export const ITEMS: ClozeRo[] = [
  // ── r8-comparativo · la concordancia de `cel`, CON ADJETIVO INVARIABLE
  //    EN GÉNERO ──────────────────────────────────────────────────────
  // El adjetivo es `mare`/`mari`, que NO marca género. La v0 usaba
  // `ieftine`, `înalți`, `bună`, y el segundo ataque la tumbó: el alumno
  // que sólo copia la desinencia del adjetivo que ya está escrito
  // acertaba tres de los cuatro sin mirar el nombre y sin tropezar nunca
  // con el español. Eran impecables y no medían el punto (§4.8). Con
  // `mare` la única pista es el nombre, que es donde vive la regla.
  //
  // Y el género español apunta al revés en las cuatro casillas: si el
  // alumno traduce, falla. Atestado el molde: «omul CEL MAI cinstit din
  // lume», «fata CEA MAI mare», «țările CELE mai bogate din lume».
  { p: CMP, r: 'cele', s: 'Hotelurile de la mare sunt ___ mai mari din țară.', pista: 'los más grandes — la marca del superlativo', ancla: 'Hotelurile', transparenteLatin: false, generoConvergeEs: false },
  { p: CMP, r: 'cei', s: 'În Făgăraș se află munții ___ mai mari din România.', pista: 'las más grandes — la marca del superlativo', ancla: 'munții', transparenteLatin: false, generoConvergeEs: false },
  { p: CMP, r: 'cel', s: 'Bucureștiul este orașul ___ mai mare al țării.', pista: 'la más grande — la marca del superlativo', ancla: 'orașul', transparenteLatin: false, generoConvergeEs: false },
  { p: CMP, r: 'cea', s: 'Aceasta este cartea ___ mai mare din bibliotecă.', pista: 'el más grande — la marca del superlativo', ancla: 'cartea', transparenteLatin: false, generoConvergeEs: false },

  // ── r8-comparativo · LA FRONTERA DE LA CONCORDANCIA (§0.6) ─────────
  // La regla no es «`cel mai` es invariable ante adverbio» —eso lo
  // refutó el corpus: «din lecția CEA MAI BINE preparată», «dascălul CEL
  // MAI BINE plătit» son correctos y ahí `cel` SÍ concuerda—. La regla
  // es: **`cel` concuerda siempre que haya un NOMBRE con el que
  // concordar; si el superlativo modifica al VERBO no hay nombre y queda
  // invariable.** Estos dos ítems son la única casilla «sin nombre» del
  // punto, y sin ellos el alumno aprende «`cel` concuerda siempre», saca
  // pleno, y luego escribe `*ea cântă cea mai bine`.
  //
  // RESPALDO, dicho como es: GALR/GBLR (referencia, no verbatim) más la
  // analogía interna del corpus, que es fuerte — `cel puțin` sale 279
  // veces y NO concuerda NUNCA, ni con referente femenino ni plural, y
  // `cel mult` 53 más. La construcción exacta (verbo + `cel mai` + adv.
  // sin nombre) NO está atestada en este corpus, y eso se escribe en vez
  // de disimularlo: la prosa del XIX resuelve ese contenido por otra vía.
  { p: CMP, r: 'cel', s: 'Dintre toate fetele din cor, ea cântă ___ mai bine.', pista: 'la marca del superlativo, aquí sin nombre al que acompañar', ancla: 'ea cântă', transparenteLatin: false, generoConvergeEs: false },
  { p: CMP, r: 'cel', s: 'Dintre toate colegele mele, ea muncește ___ mai mult.', pista: 'la marca del superlativo, aquí sin nombre al que acompañar', ancla: 'ea muncește', transparenteLatin: false, generoConvergeEs: false },

  // ── r8-comparativo · el corte `bine` / `bun` ───────────────────────
  // El español SÍ tiene el corte (bien/bueno) y lo pierde SÓLO en el
  // comparativo, donde «mejor» cubre los dos. O sea que el
  // hispanohablante tiene un procedimiento infalible —bajar al grado
  // positivo— y esto no es una laguna suya: es una que se le tapa. Se
  // dice así en el inventario, y no «el español no tiene el corte»,
  // que era falso. Atestado: «cântă mai bine» ×3, «mai bine decât» ×105.
  //
  // Las pistas dicen sólo «mejor». La v0 añadía «lo que dice de CÓMO
  // habla» / «CÓMO ES la comida», que ES LA REGLA servida: el examen
  // estaba en la pista.
  { p: CMP, r: 'bine', s: 'Sora mea vorbește românește mai ___ decât mine.', pista: 'mejor', ancla: 'vorbește românește mai', transparenteLatin: false },
  // LA FRONTERA DEL ANTERIOR: mismo «mejor» del español, y aquí NO va
  // `bine` —es predicativo y concuerda con `mâncarea`—. La
  // sobreaplicación castigada es `*Mâncarea este mai bine`. (`e mai bine`
  // existe, pero es impersonal: `mi-e mai bine`.) `decât la cantină` es
  // rumano natural: la elipsis comparativa con sintagma preposicional
  // sale 352 veces en el corpus.
  { p: CMP, r: 'bună', s: 'Mâncarea de acasă este mai ___ decât la cantină.', pista: 'mejor', ancla: 'Mâncarea de acasă este mai', transparenteLatin: false },
];

/** LOS CANDIDATOS QUE NO SE PUBLICAN, con el motivo escrito.
 *
 *  No son ítems «pendientes de escribir»: están escritos y NO pasan. Van
 *  aquí y no en un comentario suelto para que el siguiente los ataque en
 *  bloque en vez de re-descubrirlos.
 *
 *  · `dinContenedor` — `din` forzado por un contenedor singular. MUERTO
 *    por corpus: `în` está atestado exactamente en este dominio —«Huțu e
 *    cel mai mare ÎN școală», «se credea omul cel mai fericit ÎN sat»,
 *    «nu-i ea cea mai frumoasă ÎN țară»—, con `cel/cea mai ADJ + în` = 26
 *    frente a `+ din` 84 y `+ dintre` 76. Los tres viven ⇒ el hueco no
 *    está determinado. Lo único limpio ahí es que `dintre` SÍ está
 *    excluido ante colectivo singular (`dintre toat(ă) + N` = 0 en 2,88 M
 *    de palabras), pero el ítem simétrico —`___ toți elevii`— tampoco
 *    sirve, porque ahí `din` y `dintre` son los DOS buenos (`unul din ei`
 *    ×77). Este ítem no tiene versión determinada en ninguna dirección.
 *
 *  · `decatVerboFinito` — y éste NO muere por falta de lengua, muere por
 *    FALTA DE FRONTERA, que es más interesante. El argumento a favor es
 *    bueno y sobrevivió al ataque: `ca` en el comparativo es esencialmente
 *    preposicional y rige sintagmas (`mai mare ca mine`, `mai bine ca
 *    ea`, `mai bine ca Grigorescu` — en el corpus NINGUNA lleva detrás un
 *    verbo finito en indicativo), mientras que `decât` sí introduce una
 *    comparativa oracional. O sea que no es un ítem del reparto
 *    `decât`/`ca`, es un ítem de FRONTERA CATEGORIAL.
 *
 *    Y por eso no se puede publicar solo: su regla tiene un contexto donde
 *    NO se aplica —con término nominal `ca` es perfectamente correcto—, así
 *    que el §0.6 exige un ítem de sobreaplicación. Ese ítem sería
 *    `Ea cântă mai bine ___ mine` aceptando `ca` Y `decât`… que es
 *    exactamente el hueco que el gate 1 de este fichero declara
 *    INDETERMINADO, y con razón. **La frontera de esta regla no es
 *    expresable en cloze.** Publicarlo sin ella enseñaría «`ca` nunca
 *    compara», que es falso y es el defecto del §4.29. */
export const CANDIDATOS: Record<string, ClozeRo> = {
  dinContenedor: { p: CMP, r: 'din', s: 'Ion este cel mai bun elev ___ toată școala.', pista: 'de — el que introduce el conjunto en el que destaca', ancla: 'cel mai bun elev', transparenteLatin: false },
  decatVerboFinito: { p: CMP, r: 'decât', s: 'Examenul a fost mai ușor ___ credeam.', pista: 'que — el término de comparación ante un verbo conjugado', ancla: 'credeam', transparenteLatin: false },
};

/** Las formas de `cel` por casilla. Vive aquí porque hoy la usa un lote;
 *  el día que la necesite un segundo, sube a `lib/` (§4.10). */
const CEL = new Set(['cel', 'cea', 'cei', 'cele']);

/** ¿El ítem examina la casilla SIN NOMBRE — la del `cel` invariable?
 *
 *  Se decide por la PROPIEDAD ESTRUCTURAL que lo implica, no por una
 *  etiqueta que alguien tenga que acordarse de poner (§4.23): el hueco va
 *  precedido de un VERBO FINITO y seguido de `mai` + adverbio, así que no
 *  hay ningún sintagma nominal del que `cel` pueda ser determinante.
 *
 *  Vive en UN sitio y lo usan los dos gates que lo necesitan —el de la
 *  concordancia, que tiene que EXIMIRLOS, y el del conjunto, que tiene
 *  que EXIGIR que exista alguno—. Copiarlo sería la regla duplicada que
 *  falla en la copia N+1 (§4.10), y aquí el fallo sería silencioso en la
 *  dirección peor: eximir de más. */
export const VERBOS_SIN_NOMBRE = /\b(c[âa]nt[ăa]|munce[șs]te|alearg[ăa]|scrie|cite[șs]te|vorbe[șs]te|lucreaz[ăa]|g[ăa]te[șs]te)\s+___\s+mai\b/u;
export const esSinNombre = (x: ClozeRo) => VERBOS_SIN_NOMBRE.test(x.s);

/** EL GÉNERO ESPAÑOL DEL NOMBRE-ANCLA, declarado POR ÍTEM y con la FRASE
 *  como clave. No es derivable: es la propiedad que hace que el ítem mida
 *  algo. Si el género español coincide con el que el rumano obliga a
 *  elegir, el alumno acierta traduciendo y el ítem mide español (§4.8).
 *
 *  LA CLAVE ES LA FRASE Y NO LA RESPUESTA, y la v0 la tenía por respuesta.
 *  Con esa clave, un segundo ítem cuya respuesta fuera también `cele`
 *  habría leído la glosa del PRIMERO y se habría aprobado con el dato de
 *  otro ítem — el sello contestando a la pregunta de otro (§4.1). No lo
 *  cazó ningún ítem del lote, porque hoy las cuatro respuestas son
 *  distintas: lo habría cazado el primer ítem que alguien añadiera. */
export const GENERO: Record<string, { es: 'm' | 'f'; numero: 'sg' | 'pl'; glosa: string }> = {
  'Hotelurile de la mare sunt ___ mai mari din țară.': { es: 'm', numero: 'pl', glosa: 'los hoteles' },
  'În Făgăraș se află munții ___ mai mari din România.': { es: 'f', numero: 'pl', glosa: 'las montañas' },
  'Bucureștiul este orașul ___ mai mare al țării.': { es: 'f', numero: 'sg', glosa: 'la ciudad' },
  'Aceasta este cartea ___ mai mare din bibliotecă.': { es: 'm', numero: 'sg', glosa: 'el libro' },
};

/** LOS ADJETIVOS INVARIABLES EN GÉNERO, que son los únicos que pueden
 *  aparecer en un ítem de concordancia de `cel`. Con un adjetivo marcado
 *  (`ieftine`, `înalți`, `bună`) la desinencia que ya está escrita en la
 *  frase da la respuesta y el ítem se contesta copiando, sin mirar el
 *  nombre: eran impecables y no medían nada. Lista cerrada y con su
 *  plural, porque un allowlist decide RECHAZOS (§4.19). */
export const ADJ_INVARIABLE_GENERO = new Set(['mare', 'mari', 'dulce', 'dulci', 'verde', 'verzi', 'tare', 'tari', 'subțire', 'subțiri', 'limpede', 'limpezi']);

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO21-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x);
    if (!r) continue;

    // ── GATE 1 · EL HUECO DE `cel` NO PUEDE IR TRAS `mai + ADJ` ──────
    // La medición que gobierna el lote: `mai ADJ ca` sale 100 veces en el
    // corpus contra 514 de `decât`, o sea que un hueco de término de
    // comparación tras `mai + ADJ` admite las dos y NO está determinado.
    // El gate no pregunta «¿la respuesta es decât?» —eso dejaría pasar el
    // ítem que espera `ca`—, sino «¿el hueco está en esa posición?».
    if (/\bmai\s+[\p{L}]+\s+___/u.test(x.s) && /^(dec[âî]t|ca|ca și|precum)$/.test(r))
      v.push(`${id}: el hueco pide el término de comparación tras «mai + ADJ», donde «decât» y «ca» son las DOS correctas (corpus: 514 vs 100) — no está determinado`);

    // ── GATE 2 · EL PRONOMBRE TRAS `decât` NO SE EXAMINA ─────────────
    // `decât eu` está atestado (7, más `decât tu` 2): marcar el
    // nominativo sería el asterisco propio del §0.
    if (/\bdec[âî]t\s+___/u.test(x.s))
      v.push(`${id}: el hueco pide el pronombre tras «decât», y «decât eu» está atestado en el corpus — no hay mala`);

    // ── GATE 3 · `dintre` NO SE PUEDE EXIGIR CONTRA `din` ────────────
    // `din ei` ×319 en el corpus (`unul din ei` ×77).
    if (r === 'dintre')
      v.push(`${id}: exige «dintre» donde «din» está atestado ×319 en el corpus — el hueco no está determinado`);

    // ── GATE 4 · LA CONCORDANCIA SE EXAMINA SÓLO SI EL GÉNERO ESPAÑOL
    //    APUNTA AL REVÉS. Es el gate que hace que el ítem mida rumano.
    //    Escrito como el §4.23 pide: no como norma en un comentario, sino
    //    como invariante computable sobre lo declarado.
    if (CEL.has(r) && esSinNombre(x)) {
      // La casilla invariable: aquí NO hay nombre, así que declarar un
      // género sería declarar un dato que no existe. Lo que se exige es
      // lo contrario — que la respuesta sea la forma no marcada.
      if (r !== 'cel') v.push(`${id}: sin nombre al que determinar, «cel» es invariable y la respuesta no puede ser «${r}»`);
      if (GENERO[x.s]) v.push(`${id}: declara un género español y no hay nombre al que concordar — el dato sobra y confundiría al siguiente`);
    } else if (CEL.has(r)) {
      // ── GATE 4b · EL ADJETIVO NO PUEDE REGALAR LA DESINENCIA ───────
      // El adjetivo que sigue a `mai` tiene que ser INVARIABLE EN GÉNERO.
      // Con uno marcado (`ieftine`, `înalți`, `bună`) el alumno copia la
      // desinencia que ya está escrita en la frase y acierta sin mirar el
      // nombre — impecable y sin medir nada (§4.8). Lo cazó el lingüista
      // sobre la v0 de este mismo lote: tres de sus cuatro ítems se
      // contestaban así, y ninguno de mis gates lo veía.
      const tras = x.s.match(/___\s+mai\s+([\p{L}]+)/u)?.[1]?.toLowerCase();
      if (tras && !ADJ_INVARIABLE_GENERO.has(tras))
        v.push(`${id}: el adjetivo «${tras}» marca género, así que su desinencia da la respuesta sin mirar el nombre — un ítem de concordancia lo exige invariable (mare, dulce, verde, tare…)`);
      const g = GENERO[x.s];
      if (!g) { v.push(`${id}: el ítem no declara el género español de su nombre-ancla — «no medido» no es «limpio»`); continue; }
      if (x.generoConvergeEs !== false) v.push(`${id}: un ítem de concordancia de «cel» tiene que declarar generoConvergeEs:false y demostrarlo`);
      // La forma rumana que produce TRADUCIR el género español.
      const porCalco = g.numero === 'pl' ? (g.es === 'm' ? 'cei' : 'cele') : g.es === 'm' ? 'cel' : 'cea';
      if (porCalco === r)
        v.push(`${id}: traducir el género de «${g.glosa}» da «${porCalco}», que ES la respuesta — el ítem se acierta calcando y no mide la concordancia rumana`);
    }

    // ── GATE 5 · EL CORTE bine/bun EXAMINA LAS DOS CARAS ─────────────
    // Un gate que sólo viera `bine` aprobaría el lote que enseña «mejor =
    // bine siempre», que es exactamente lo que la frontera existe para
    // impedir. Se comprueba abajo, sobre el conjunto.

  }

  // ── SOBRE EL CONJUNTO ──────────────────────────────────────────────
  const cmp = items.filter((x) => x.p === CMP);
  if (cmp.length >= 4) {
    // Las cuatro casillas de `cel`, sin repetir: si faltan, el punto
    // enseña media declinación.
    const casillas = new Set(cmp.map((x) => respuestaDe(x)).filter((r): r is string => !!r && CEL.has(r)));
    for (const c of ['cel', 'cea', 'cei', 'cele'])
      if (!casillas.has(c)) v.push(`${CMP}: falta la casilla «${c}» de la concordancia de «cel» — con tres de cuatro el punto enseña media declinación`);
    // LA FRONTERA bine/bun, en las DOS caras.
    const formas = new Set(cmp.map((x) => respuestaDe(x)));
    if (formas.has('bine') && !formas.has('bună') && !formas.has('bun'))
      v.push(`${CMP}: examina «bine» y no su frontera adjetiva — el alumno aprende «mejor = bine siempre», saca ${cmp.length}/${cmp.length} y luego escribe *mâncarea este mai bine (§0.6)`);
    if ((formas.has('bună') || formas.has('bun')) && !formas.has('bine'))
      v.push(`${CMP}: examina el adjetivo y no el adverbio — la frontera necesita las DOS caras`);
  }
  if (cmp.length >= 4) {
    // LA FRONTERA DE LA CONCORDANCIA (§0.6): tiene que haber al menos un
    // ítem SIN nombre al que concordar, o el punto enseña «`cel`
    // concuerda siempre», el alumno saca pleno y luego escribe
    // `*ea cântă cea mai bine`. Se detecta por la propiedad estructural
    // que lo implica y no por una convención (§4.23): el hueco va
    // precedido de un VERBO y seguido de `mai` + adverbio, o sea que no
    // hay sintagma nominal del que `cel` pueda ser determinante.
    const sinNombre = cmp.filter(esSinNombre);
    if (!sinNombre.length)
      v.push(`${CMP}: ningún ítem examina la casilla SIN NOMBRE, donde «cel» es invariable — el alumno aprende «cel concuerda siempre», saca ${cmp.length}/${cmp.length} y luego escribe *ea cântă cea mai bine (§0.6)`);
  }
  return v;
}

if (new RegExp(`[/\\\\]cloze-ro-l21\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 21\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO — LOTE 21 — ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries())
    console.log(`${String(i + 1).padStart(2, '0')}. [${x.p}] ${x.s}\n     → **${respuestaDe(x)}**${x.alt?.length ? ` (alt: ${x.alt.join(' / ')})` : ''}  · ${x.pista}`);
  console.log(`\n## Candidatos NO publicados (${Object.keys(CANDIDATOS).length}) — motivo en el código\n`);
  for (const [k, x] of Object.entries(CANDIDATOS)) console.log(`- \`${k}\`: ${x.s} → **${respuestaDe(x)}**`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

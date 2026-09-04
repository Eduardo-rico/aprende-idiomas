// scripts/lotes/cloze-ro-b1.ts — EL LOTE 17 RUMANO: cloze derivado, B1.
//
//   npx tsx scripts/lotes/cloze-ro-b1.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-b1.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8 del bloque 7, LOS TRES A CERO y los tres del
// mismo paradigma, que es lo que amortiza el molde:
//   · r7-conjuntivo-presente   `conjunctiv()`        (máquina nueva)
//   · r7-conjuntivo-perfecto   `conjunctivPerfect()` (máquina nueva)
//   · r7-gerunziu              `gerunziu()`          (máquina nueva)
//
// Es el primer contenido de B1 del curso: el nivel entero estaba a cero.
//
// ── EL `să` VA EN LA FRASE, NO EN EL HUECO ───────────────────────────
// Los dos puntos del conjuntivo piden la FORMA, no la partícula. La
// elección `să` frente a infinitivo es otro punto —`r3-sa-vs-infinitivo`,
// ya en el piso con 8 ítems— y un hueco que se tragara el `să` mediría
// los dos a la vez, que es la familia «el ítem no mide su punto». Hay
// gate: el `să` tiene que estar escrito justo delante del hueco.
//
// ── LO QUE HACE QUE CADA PUNTO MIDA SU PUNTO ─────────────────────────
//
// **r7-conjuntivo-presente.** El inventario lo dice y el gate lo exige:
// sólo entran las casillas donde la 3.ª DIVERGE del indicativo. El gate no
// declara cuáles son: las RECALCULA, comparando `conjunctiv(v, per)` con
// `presente(v, per)`.
//
// Y COMPARA CONTRA LA CASILLA QUE EL ÍTEM DECLARA, no contra la 3.ª
// singular fija, porque la coincidencia de `a lua`, `a vrea`, `a ști` y
// `a scrie` es SÓLO DEL SINGULAR: contra la 3.ª plural (`iau`, `vor`,
// `știu`, `scriu`) las cuatro divergen, y `să ia` frente a `ei iau` es una
// divergencia tan real como las siete que sí se construyen. La v0 del
// comentario decía «la forma es la misma y el alumno copia el indicativo y
// acierta», sin el «en singular», y con eso cerraba cuatro verbos de
// altísima frecuencia por una descripción falsa de la lengua; y el gate
// heredaba el error comparando siempre contra `presente(v,'el')`, o sea
// contestando por la casilla equivocada. Lo cazó el lingüista adversarial.
// La casilla plural de esos cuatro queda ABIERTA y anotada en el
// inventario: no se construye aquí porque este lote ya está cerrado en
// 8/8/8, no porque no se pueda. Siete de los ocho son los que el inventario
// nombra (fie, aibă, dea, stea, poată, meargă, facă); el octavo, `vină`,
// no está en su lista y se declara aquí: es la misma clase, diverge, y
// `a veni` está entre los verbos más frecuentes del rumano.
//
// **r7-conjuntivo-perfecto.** La forma es INVARIABLE —`fi` + participio
// para las seis personas— y ése es exactamente el punto: el instinto la
// conjuga (*să fiu mers, calcando «que yo haya ido»). Como es invariable,
// el ítem está determinado **sin necesidad de fijar la persona**, que es
// una propiedad rara y merece decirse: en cualquier otro tiempo de este
// curso, un hueco sin testigo de persona es un ítem indeterminado. El
// gate exige que la respuesta empiece por `fi ` y que ninguna de las
// formas conjugadas de `a fi` (fiu/fii/fie/fim/fiți) aparezca en la
// frase, porque bastaría copiarla.
//
// **r7-gerunziu.** El punto NO es «formar el gerundio»: es que la
// desinencia **no la decide ni la conjugación sola ni el tema solo**, sino
// una DISYUNCIÓN — `-ind` en la 4.ª conjugación en `-i` **o** cuando el
// tema acaba en `i`; `-ând` en todo lo demás, la conjugación en `-î`
// incluida (GALR, formas no personales).
//
// LA v0 DE ESTE COMENTARIO DECÍA «la decide el final del TEMA y no la
// conjugación», y **tres ítems de este mismo lote la refutan**: los temas
// de `a vorbi`, `a citi` y `a merge` acaban los tres en consonante
// (`vorb`, `cit`, `merg`) y las desinencias son `-ind`, `-ind` y `-ând`.
// Lo que los separa es justamente la conjugación. Es media regla, y es la
// mitad contraria a la que me faltó al escribir `gerunziu()`: allí tiré la
// conjugación, aquí tiré el tema. El código lo tiene bien desde el gate
// (`gerunziuPorRegla`); la prosa que lo justificaba, no. Lo cazó el
// lingüista adversarial.
//
// Por eso el lote necesita las dos rejillas cruzadas, y hay gate que lo
// exige:
//   · `a scrie` es de 3.ª conjugación y hace `scriind`, con -ind;
//   · `a coborî` es de -î y hace `coborând`, con -ând, nunca *coborind.
// Sin esos dos, ocho gerundios en -ând de verbos en consonante enseñarían
// una regla falsa por omisión. Y hay un límite declarado: `făcând` y
// `văzând` son formas GUARDADAS (el tema alterna), así que miden memoria
// léxica además de la desinencia. Van dos, no más, y va escrito.
//
// LO QUE EL LINGÜISTA MIDIÓ Y NO ES CÓMODO: el calco español del sufijo
// (`-ando → -ând`, `-iendo → -ind`) acierta **3 de los 8**, y son
// `scriind`, `coborând` y `citind` — o sea **los dos ítems-ancla del
// punto**. Sostienen la REJILLA (sin ellos el lote enseña «-ând por
// defecto») pero para este alumno no miden nada: su instinto ya los
// produce. Se quedan, y por eso llevan `transparenteLatin: true`, que es
// lo que hace que el contador diga la verdad. Los que de verdad rompen el
// calco son `vorbind` (español -ando, rumano -ind) y `făcând`/`văzând`
// (español -iendo, rumano -ând): los que yo trataba como el límite
// tolerado son los mejores ítems del punto. Un lote futuro debe añadir
// `a tăia → tăind`: 1.ª conjugación con tema en `i`, donde el español
// «cortando» empuja a `-ând` y la respuesta es `-ind`. Ése es el ítem que
// demuestra la regla CONTRA el calco, y hoy no existe.
//
// ── EL BORDE EXACTO DE «INVARIABLE», que la palabra sola no dice ─────
// El conjuntivo perfecto es invariable **en persona**, y eso está
// confirmado: `fi` es el infinitivo corto fijado como auxiliar, el mismo
// de `aș fi mers`, `voi fi mers` y `o fi mers`, y no existe `*să fiu
// mers` en ningún registro (GALR). Pero:
//   · en la PASIVA concuerda el participio léxico (`să fi fost văzut /
//     văzută / văzuți / văzute`); invariable es `fi`, no la perífrasis.
//     `r7-pasiva-impersonal` existe en el inventario y va a chocar con la
//     palabra suelta.
//   · con verbo REFLEXIVO el clítico que precede a `fi` sí varía (`să mă
//     fi dus`, `să te fi dus`), así que ahí el hueco dejaría de estar
//     determinado sin testigo de persona. Hoy no puede pasar porque el
//     lexicón A1 no tiene reflexivos; el día que entren, la propiedad se
//     cae y ningún gate lo nota.
// Y sobre «fuera de la 3.ª el conjuntivo coincide con el indicativo salvo
// `a fi`»: es verdad DE LA NORMA. `a avea` tuvo `să aib` / `să aibi`, que
// DOOM3 deja fuera. La distinción entre «no existe» y «la norma no lo
// admite» es exactamente la que ha matado tres afirmaciones en este
// proyecto, así que va escrita.
import { verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente, conjunctiv, conjugacionDe, gerAlterna } from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const CONJ = 'r7-conjuntivo-presente';
const CONJPERF = 'r7-conjuntivo-perfecto';
const GER = 'r7-gerunziu';

export const ITEMS: ClozeRo[] = [
  // ══ r7-conjuntivo-presente (8) ════════════════════════════════════
  // Ocho verbos distintos, las siete casillas que el inventario nombra
  // más `vină`. El `să` va escrito; el hueco es sólo la forma.
  { p: CONJ, inf: 'a fi', per: 'el', t: 'conjuntivo', s: 'Părinții vor ca fiul lor să ___ (a fi) medic.', pista: 'ser — conjuntivo, 3.ª persona', ancla: 'ca fiul lor să', transparenteLatin: false },
  { p: CONJ, inf: 'a avea', per: 'el', t: 'conjuntivo', s: 'E important ca fiecare copil să ___ (a avea) o carte a lui.', pista: 'tener — conjuntivo, 3.ª persona', ancla: 'fiecare copil să', transparenteLatin: false },
  { p: CONJ, inf: 'a da', per: 'ei', t: 'conjuntivo', s: 'Profesorul vrea ca elevii să ___ (a da) un răspuns clar.', pista: 'dar — conjuntivo, 3.ª persona', ancla: 'ca elevii să', transparenteLatin: false },
  { p: CONJ, inf: 'a sta', per: 'el', t: 'conjuntivo', s: 'Doctorul a insistat ca bunicul să ___ (a sta) în casă o săptămână.', pista: 'quedarse — conjuntivo, 3.ª persona', ancla: 'ca bunicul să', transparenteLatin: false },
  { p: CONJ, inf: 'a putea', per: 'el', t: 'conjuntivo', s: 'Sper ca Maria să ___ (a putea) veni mâine cu noi la munte.', pista: 'poder — conjuntivo, 3.ª persona', ancla: 'ca Maria să', transparenteLatin: true },
  { p: CONJ, inf: 'a merge', per: 'ei', t: 'conjuntivo', s: 'Nu vreau ca ei să ___ (a merge) singuri seara prin oraș.', pista: 'ir — conjuntivo, 3.ª persona', ancla: 'ca ei să', transparenteLatin: false },
  { p: CONJ, inf: 'a face', per: 'el', t: 'conjuntivo', s: 'E posibil ca vecinul să ___ (a face) prea mult zgomot în fiecare duminică.', pista: 'hacer — conjuntivo, 3.ª persona', ancla: 'ca vecinul să', transparenteLatin: false },
  { p: CONJ, inf: 'a veni', per: 'ei', t: 'conjuntivo', s: 'Trebuie ca toți studenții să ___ (a veni) la ora nouă.', pista: 'venir — conjuntivo, 3.ª persona', ancla: 'ca toți studenții să', transparenteLatin: false },

  // ══ r7-conjuntivo-perfecto (8) ════════════════════════════════════
  // La misma forma para las seis personas: `fi` + participio. El ítem
  // está determinado sin testigo de persona porque la forma no la tiene.
  { p: CONJPERF, inf: 'a merge', t: 'conjuntivo-perfecto', s: 'E posibil ca ei să ___ (a merge) deja acasă.', pista: 'ir — conjuntivo perfecto (anterioridad)', ancla: 'ca ei să', transparenteLatin: false },
  { p: CONJPERF, inf: 'a face', t: 'conjuntivo-perfecto', s: 'Se poate ca el să ___ (a face) o greșeală de calcul la examenul de ieri.', pista: 'hacer — conjuntivo perfecto (anterioridad)', ancla: 'Se poate ca el să', transparenteLatin: false },
  { p: CONJPERF, inf: 'a spune', t: 'conjuntivo-perfecto', s: 'E puțin probabil ca ea să ___ (a spune) așa ceva atunci.', pista: 'decir — conjuntivo perfecto (anterioridad)', ancla: 'ca ea să', transparenteLatin: false },
  { p: CONJPERF, inf: 'a vedea', t: 'conjuntivo-perfecto', s: 'Trebuie să ___ (a vedea) cineva accidentul de aseară.', pista: 'ver — conjuntivo perfecto (anterioridad)', ancla: 'cineva accidentul de aseară', transparenteLatin: false },
  { p: CONJPERF, inf: 'a citi', t: 'conjuntivo-perfecto', s: 'Sper ca ea să ___ (a citi) deja scrisoarea.', pista: 'leer — conjuntivo perfecto (anterioridad)', ancla: 'ca ea să', transparenteLatin: false },
  { p: CONJPERF, inf: 'a scrie', t: 'conjuntivo-perfecto', s: 'A predat lucrarea fără să ___ (a scrie) numele pe ea.', pista: 'escribir — conjuntivo perfecto (anterioridad)', ancla: 'fără să', transparenteLatin: false },
  { p: CONJPERF, inf: 'a dormi', t: 'conjuntivo-perfecto', s: 'A venit la muncă fără să ___ (a dormi) deloc.', pista: 'dormir — conjuntivo perfecto (anterioridad)', ancla: 'la muncă fără să', transparenteLatin: false },
  { p: CONJPERF, inf: 'a pleca', t: 'conjuntivo-perfecto', s: 'Nu se poate ca autobuzul să ___ (a pleca) deja, e prea devreme.', pista: 'irse — conjuntivo perfecto (anterioridad)', ancla: 'ca autobuzul să', transparenteLatin: false },

  // ══ r7-gerunziu (8) ═══════════════════════════════════════════════
  // Las dos rejillas cruzadas: la desinencia la decide el final del tema.
  // `scriind` (3.ª conjugación, -ind) y `coborând` (-î, -ând) son los dos
  // que impiden que el lote enseñe «-ând por defecto».
  { p: GER, inf: 'a merge', t: 'gerunziu', s: '___ (a merge) pe stradă, am întâlnit un vechi prieten.', pista: 'ir — gerundio', ancla: 'pe stradă, am întâlnit', transparenteLatin: false },
  { p: GER, inf: 'a scrie', t: 'gerunziu', s: 'Îți poți îmbunătăți stilul ___ (a scrie) în fiecare zi.', pista: 'escribir — gerundio', ancla: 'îmbunătăți stilul', transparenteLatin: true },
  { p: GER, inf: 'a coborî', t: 'gerunziu', s: '___ (a coborî) din tren, mi-am uitat telefonul pe scaun.', pista: 'bajar — gerundio', ancla: 'din tren, mi-am uitat', transparenteLatin: true },
  { p: GER, inf: 'a citi', t: 'gerunziu', s: 'Am învățat româna ___ (a citi) ziare românești.', pista: 'leer — gerundio', ancla: 'Am învățat româna', transparenteLatin: true },
  { p: GER, inf: 'a face', t: 'gerunziu', s: '___ (a face) curat prin casă, am găsit o fotografie veche.', pista: 'hacer — gerundio', ancla: 'curat prin casă', transparenteLatin: false },
  { p: GER, inf: 'a vedea', t: 'gerunziu', s: '___ (a vedea) că plouă, mi-am luat umbrela de acasă.', pista: 'ver — gerundio', ancla: 'că plouă', transparenteLatin: false },
  { p: GER, inf: 'a vorbi', t: 'gerunziu', s: 'A intrat în sală ___ (a vorbi) la telefon.', pista: 'hablar — gerundio', ancla: 'A intrat în sală', transparenteLatin: false },
  { p: GER, inf: 'a pleca', t: 'gerunziu', s: '___ (a pleca) de acasă devreme, am prins trenul de opt.', pista: 'irse — gerundio', ancla: 'de acasă devreme', transparenteLatin: false },
];

const VERB = new Map(VERBOS_A1.map((v) => [v.inf, v]));
/** Las formas conjugadas de `a fi`: si alguna está en la frase, el alumno
 *  puede copiarla y el punto de la INVARIABILIDAD se evapora. */
const FI_CONJUGADO = /(?<![\p{L}-])(fiu|fii|fie|fim|fiți)(?![\p{L}-])/iu;

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO7-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x);
    if (!r) continue;                              // ya lo denunció la base
    const antes = x.s.split('___')[0] ?? '';
    const resto = x.s.replace('___', '').replace(/\([^)]*\)/g, ' ');

    // Los dos puntos del conjuntivo: el `să` va ESCRITO y pegado delante
    // del hueco. Si se lo tragara el hueco, el ítem mediría también
    // `r3-sa-vs-infinitivo`, que ya está en el piso.
    if (x.p === CONJ || x.p === CONJPERF) {
      if (!/(?<![\p{L}])să\s*$/iu.test(antes)) v.push(`${id}: el hueco no va precedido de «să» escrito — la partícula es r3-sa-vs-infinitivo y no puede caer dentro del hueco`);
      if (/(?<![\p{L}])să(?![\p{L}])/iu.test(r)) v.push(`${id}: la respuesta «${r}» incluye el «să»`);
    }

    if (x.p === CONJ) {
      const verbo = VERB.get(x.inf ?? '');
      if (!verbo) { v.push(`${id}: «${x.inf}» no está en el lexicón`); continue; }
      // EL GATE DEL PUNTO, y no se declara: se RECALCULA. Donde el
      // conjuntivo coincide con el indicativo (a lua → ia / să ia, a vrea,
      // a ști, a scrie) el alumno copia el indicativo y acierta sin saber
      // nada. El inventario manda no construir esos ítems.
      // CONTRA LA CASILLA QUE EL ÍTEM DECLARA, no contra la 3.ª singular
      // fija. La v0 comparaba siempre `presente(verbo,'el')` y con eso
      // contestaba por la casilla equivocada: `a lua` coincide en singular
      // (ia / să ia) y DIVERGE en plural (iau / să ia).
      const ind = presente(verbo, x.per ?? 'el');
      const con = conjunctiv(verbo, x.per ?? 'el');
      if (con && ind && con === ind)
        v.push(`${id}: el conjuntivo de «${x.inf}» en «${x.per}» es «${con}», IGUAL que el indicativo de esa misma casilla — el ítem se acierta copiando`);
      if (x.per !== 'el' && x.per !== 'ei')
        v.push(`${id}: persona «${x.per}» — fuera de la 3.ª el conjuntivo coincide con el indicativo (salvo «a fi») y el ítem no examina la divergencia`);
      // Y el testigo de persona: aquí sí hace falta, porque 1.ª/2.ª darían
      // otra forma. El sujeto explícito de 3.ª va entre «ca» y «să».
      if (!/(?<![\p{L}])ca\s+[^_]*?să\s*$/iu.test(antes))
        v.push(`${id}: sin sujeto explícito entre «ca» y «să» — el hueco admitiría otra persona`);
    }

    if (x.p === CONJPERF) {
      if (!/^fi /.test(r)) v.push(`${id}: la respuesta «${r}» no empieza por «fi» — el punto es que la forma es invariable`);
      if (FI_CONJUGADO.test(resto)) v.push(`${id}: la frase lleva una forma conjugada de «a fi» que el alumno puede copiar`);
      // Y el participio no puede estar ya en la frase.
      const part = r.split(' ')[1];
      if (part && new RegExp(`(?<![\\p{L}])${part}(?![\\p{L}])`, 'iu').test(resto)) v.push(`${id}: el participio «${part}» ya está en la frase`);
    }

    if (x.p === GER) {
      if (!/(ând|ind)$/.test(r)) v.push(`${id}: «${r}» no acaba en -ând ni en -ind`);
      // El gerunziu no es progresivo: `r7-anti-progresivo` es otro punto y
      // enseñar aquí «sunt mergând» sería enseñar el calco.
      if (/(?<![\p{L}])(sunt|ești|este|suntem|sunteți|e)\s+___/iu.test(x.s)) v.push(`${id}: el hueco va detrás de la cópula — eso es el progresivo calcado, que es r7-anti-progresivo`);
    }
  }

  // ── LA REGLA INGENUA, CONTADA (no supuesta) ────────────────────────
  // El mismo movimiento que `gerAlterna`: en vez de preguntarle al ítem
  // qué da la regla BUENA, se le pregunta qué daría la MALA. La regla que
  // un hispanohablante deduce del indicativo es «-e final → -ă», y este
  // proyecto ya sabe que fabrica *mergă, *vedă, *începă. El lingüista la
  // aplicó a los ocho ítems y acierta TRES por accidente (facă, poată,
  // vină): en esos tres el alumno que la aplica acierta sin aprender, así
  // que el lote no mide lo que cree medir. Se exige que al menos la mitad
  // la SOBREVIVA — hoy son cinco: fie, aibă, dea, stea y sobre todo
  // meargă, el único que exige la diptongación e → ea.
  const conjs = items.filter((x) => x.p === CONJ);
  if (conjs.length >= 4) {
    const ingenua = (ind: string) => (ind.endsWith('e') ? ind.slice(0, -1) + 'ă' : ind);
    const sobreviven = conjs.filter((x) => {
      const vb = VERB.get(x.inf ?? ''); if (!vb) return false;
      const ind = presente(vb, x.per ?? 'el'); const con = conjunctiv(vb, x.per ?? 'el');
      return !!ind && !!con && ingenua(ind) !== con;
    });
    if (sobreviven.length * 2 < conjs.length)
      v.push(`${CONJ}: sólo ${sobreviven.length} de ${conjs.length} ítems sobreviven a la regla ingenua «-e → -ă» — en los demás el alumno que aplica la regla que este proyecto sabe falsa acierta por accidente y no aprende`);
  }

  // ── LA ANTERIORIDAD, ANCLADA EN LA FRASE Y NO EN LA ETIQUETA ────────
  // El lingüista contó SIETE ítems cuya determinación descansaba sólo en
  // que la pista dijera «conjuntivo perfecto» y no «conjuntivo»: en todos
  // ellos la otra forma es lengua correcta y natural. Formalmente estaban
  // determinados —la pista se pinta— pero el día que alguien acorte la
  // pista, siete se vuelven indeterminados A LA VEZ y en silencio, porque
  // ningún gate ve una alternativa que es correcta. Ahora el léxico de la
  // frase hace el trabajo: el perfecto lleva ancla de anterioridad y el
  // presente no puede llevarla.
  const ANCLA_ANTERIOR = /(?<![\p{L}])(deja|ieri|aseară|atunci|până acum|fără să)(?![\p{L}])/iu;
  for (const [i, x] of items.entries()) {
    const id = `CLRO7-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const frase = x.s.replace(/\([^)]*\)/g, ' ');
    if (x.p === CONJPERF && !ANCLA_ANTERIOR.test(frase))
      v.push(`${id}: sin ancla de anterioridad en la FRASE (deja, ieri, aseară, atunci, până acum, fără să) — el conjuntivo presente cabe en el hueco y es lengua correcta, así que hoy sólo lo excluye la etiqueta de la pista`);
    if (x.p === CONJ && ANCLA_ANTERIOR.test(frase))
      v.push(`${id}: la frase lleva un ancla de anterioridad y el ítem pide el conjuntivo PRESENTE — el perfecto cabría igual`);
  }

  // LAS DOS REJILLAS CRUZADAS DEL GERUNZIU. El punto no es formar el
  // gerundio: es que la desinencia **no la decide ni la conjugación sola
  // ni el tema solo**, sino la disyunción de las dos (ver la cabecera de
  // este fichero, l. 55). Un lote con ocho -ând de verbos en consonante
  // enseñaría una regla falsa por omisión, y saldría verde.
  // ⚠ Esta frase era la MEDIA REGLA muerta —«la decide el final del TEMA y
  // no la conjugación»—, sobrevivió al arreglo del 2026-09-03 en la copia
  // que nadie miró, y con ella la del `objectives[0]` de la lección b7-l2,
  // que es lo que el ALUMNO lee. §4.15: arreglar el código no arregla las
  // frases que lo explican, y hay más de una.
  const gers = items.filter((x) => x.p === GER);
  if (gers.length >= 4) {
    const forma = (x: ClozeRo) => respuestaDe(x) ?? '';
    const nInd = gers.filter((x) => forma(x).endsWith('ind')).length;
    const nAnd = gers.filter((x) => forma(x).endsWith('ând')).length;
    if (nInd < 2 || nAnd < 2) v.push(`${GER}: ${nAnd} en -ând y ${nInd} en -ind — hacen falta al menos dos de cada o el lote enseña una desinencia por defecto`);
    // Y los dos casos donde la desinencia CONTRADICE la conjugación, que
    // son literalmente el contenido del punto.
    const contraIII = gers.some((x) => x.inf && conjugacionDe(x.inf) === 'III' && forma(x).endsWith('ind'));
    const contraI = gers.some((x) => x.inf && conjugacionDe(x.inf) === 'IVî' && forma(x).endsWith('ând'));
    if (!contraIII) v.push(`${GER}: falta el caso donde la desinencia contradice la conjugación por abajo (3.ª conjugación con -ind: a scrie → scriind)`);
    if (!contraI) v.push(`${GER}: falta el caso donde la desinencia contradice la conjugación por arriba (-î con -ând: a coborî → coborând, nunca *coborind)`);
    // LÍMITE DECLARADO: `făcând` y `văzând` miden memoria léxica ADEMÁS
    // de la desinencia, porque su tema ALTERNA. No son ilegítimos; son
    // otra cosa, y por encima de dos el punto dejaría de examinar la regla
    // que dice examinar.
    //
    // LA v0 DE ESTE GATE PREGUNTABA «¿está guardado?» y se leía como «¿el
    // tema alterna?». No es la misma frase: 2.ª y 3.ª conjugación se
    // guardan ENTERAS por clase, así que `a merge` y `a scrie` tienen
    // `ger` y la regla los acierta igual. El gate marcaba 4 donde hay 2, y
    // habría obligado a sacar del lote justamente `scriind`, que es el
    // ítem que sostiene el punto. Ahora lo pregunta comparando lo guardado
    // con lo que la regla daría sola (`gerAlterna`).
    const alternan = gers.filter((x) => { const vb = VERB.get(x.inf ?? ''); return vb && gerAlterna(vb); });
    if (alternan.length > 2) v.push(`${GER}: ${alternan.length} ítems con tema ALTERNANTE (${alternan.map((x) => x.inf).join(', ')}) — miden memoria léxica además de la desinencia, y el punto es la desinencia`);
  }
  return v;
}

if (new RegExp(`[/\\\\]cloze-ro-b1\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 17\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO-B1 (lote 17) — conjuntivo, conjuntivo perfecto y gerunziu · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

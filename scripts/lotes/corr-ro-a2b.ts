// scripts/lotes/corr-ro-a2b.ts — EL LOTE 16 RUMANO: corrección, A2.
//
//   npx tsx scripts/lotes/corr-ro-a2b.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-a2b.ts --asigna   # a qué punto cuenta
//
// 16 ítems, DOS puntos de clase `trampa` que estaban a CERO:
//   · r5-reflexivos-ac-dat  «me lavo las manos» → *mă spăl mâinile
//   · r6-doblado-cliticos   «veo a Ion»         → *Văd pe Ion
//
// ══ NACIÓ CON TRES PUNTOS Y SE PUBLICA CON DOS ═══════════════════════
// El tercero era `r4-dativo-oi` con la mala que el propio inventario
// nombra, `*Îi dau cartea la Maria`. **Los ocho ítems se retiraron enteros
// antes de publicar**: `la` + acusativo como objeto indirecto es el
// DATIVUL ANALITIC, descrito por GALR II («Complementul indirect») y por
// Avram como *popular/familiar*, por Iordan–Robu como *regional*
// (Transilvania, Banat, Maramureș), admitido por la lengua literaria
// cuando el nombre no puede portar la marca de caso («Am dat cărți LA TREI
// COPII») y registrado en dexonline s.v. `la` con ejemplos del DEX («Dă apă
// la vite»). O sea: **atestado como registro, no como agramatical**, que es
// exactamente lo que la regla del proyecto prohíbe. Es la repetición
// milimétrica del *viitor popular* del lote 12.
//
// Y había un segundo golpe, independiente del registro: en tres de los
// ocho, `la` tenía lectura LOCATIVA y la mala era estándar sin discusión
// —«I-am dat cheile înapoi la portar» = en la portería, «I-am trimis un
// mesaj la doctoriță» = al consultorio—, o sea que el lote corregía frases
// correctas con el clítico de doblado ya bien puesto.
//
// Antes de dar por buena la retirada se comprobó lo que manda la regla del
// coordinador —«si un lote entero de un punto cae, busca primero si el
// propio inventario enseña esa forma como correcta en otro punto»—: el
// inventario NO enseña el dativo analítico en ningún punto. La forma no se
// contradice consigo misma; simplemente la mala no era mala.
//
// El punto queda a CERO y su destino es decisión del coordinador, no de
// este fichero: o se reconstruye con la forma desnuda de nominativo-
// acusativo (`*Îi cumpăr flori profesoara`), que es agramatical de verdad
// pero es error INTRALINGUAL —el alumno lo produce leyendo la propia
// explicación «el OI no lleva preposición», no calcando el español— y por
// tanto rompe el contrato de `calcoEs`; o se declara `pisoCero` con su
// motivo. No se decide aquí, y no se promete cobertura que no existe.
//
// ══ LO QUE SEPARA r6-doblado-cliticos DE r6-pe-regla-operativa ═══════
// «pe» está en la MALA y en la BUENA: lo que falta es el CLÍTICO. Si «pe»
// entrara o saliera, el ítem sería del punto de al lado, que ya está en el
// piso. Hay gate.
//
// ══ LA MITAD SINCRÉTICA, acotada a ESTE punto ════════════════════════
// `ne` y `vă` son la misma forma en acusativo y en dativo, así que un ítem
// de 1.ª/2.ª plural no tendría nada que corregir AQUÍ. La v0 de este
// comentario decía «`ne` y `vă` no son examinables», y eso era un
// razonamiento que cierra contenido y además falso: el sincretismo **se
// rompe en clúster clítico**, donde el dativo pasa a `ni`/`vi` ante un
// acusativo de 3.ª (`ni-l dă`, `vi-o trimit`, `nu ni le-a spus`) y el
// acusativo nunca lo hace. Eso se examina —y se examina ya— en
// `r6-contracciones-cliticos`, cuya cita del inventario es literalmente
// `nu ni le-a spus`. Lo cazó el lingüista adversarial.
//
// ══ LA PASIVA REFLEJA, que habría hecho CORRECTAS seis malas ═════════
// `Se spală părul` es rumano impecable: es la diateza reflexiv-pasivă
// (GALR I), con el paciente de sujeto postverbal («el pelo se lava»). Sin
// sujeto explícito, toda mala de 3.ª persona de este punto es correcta.
// Con sujeto explícito no queda lectura de rescate: en `Andrei se usucă
// părul`, si `părul` fuera el sujeto de la refleja, `Andrei` quedaría como
// un nominativo sin papel asignable, y el rumano no tiene dislocación que
// lo licencie. Confirmado por el lingüista, que además señaló el coste:
// `El`/`Ea` explícitos son rumano MARCADO en una lengua pro-drop sin
// contraste, así que el sujeto lo llevan nombres propios.
//
// ══ EL ESPAÑOL DEL ALUMNO, enunciado con precisión ═══════════════════
// El calco produce la mala de `r6-doblado-cliticos` porque **el español de
// México no dobla el objeto DIRECTO léxico POSPUESTO** («Vi a Juan», no
// «*Lo vi a Juan»: eso es rioplatense). Enunciado sin esos dos adjetivos
// sería falso, y peligroso: el español de México SÍ dobla obligatoriamente
// con el objeto ANTEPUESTO («A María la vi ayer») y con pronombre fuerte
// («Lo veo a él»), y una glosa así se resolvería copiando el clítico del
// español. Ninguna de las ocho glosas usa esas estructuras, y ahora eso no
// es azar: hay gate.
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';
import { exenta } from '../lib/exenciones-hunspell-ro';
import { medirAtajo } from '../lib/atajo-correccion';
import { revisarCopula } from '../lib/copula-ro';
import { informeAsigna } from '../lib/asigna-ro';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente } from '../lib/paradigma-ro';

const REFL = 'r5-reflexivos-ac-dat';
const DOB = 'r6-doblado-cliticos';

export const ITEMS: ItemCorreccion[] = [
  // ══ r5-reflexivos-ac-dat (8) ══════════════════════════════════════
  // El español distingue lo mismo con UN pronombre («me lavo» / «me lavo
  // las manos»); el rumano con dos. El calco elige el acusativo, que es el
  // que la interlengua ya tiene: el alumno llega aquí después de `mă spăl`
  // / `te speli` y sólo posee mă/te/se.
  //
  // NO ESTÁ el ejemplo insignia del inventario, `îmi spăl mâinile`, y el
  // motivo hay que leerlo: `a se spăla PE mâini` es la colocación por
  // defecto del rumano (DEX s.v. `spăla`, con `a se spăla pe mâini`
  // lexicalizado hasta como locución figurada). Con esa salida disponible
  // el alumno arregla la frase AÑADIENDO «pe», sin tocar el caso del
  // reflexivo: el ítem deja de obligar a producir el dativo, que es el
  // punto entero. Y la fuga es SUYA y de ningún otro: el lingüista
  // comprobó los siete restantes uno a uno y la construcción con «pe» está
  // restringida al aseo corporal con `a se spăla` / `a se șterge pe
  // mâini`. La cita curricular del punto eligió el único lema con fuga.
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Mă suflu nasul de trei ori pe zi.', buena: 'Îmi suflu nasul de trei ori pe zi.',
    calcoEs: 'Me sueno la nariz tres veces al día.',
    explicacion: 'Con un objeto directo detrás («nasul»), el reflexivo va en DATIVO: îmi, îți, își. El acusativo «mă» ya ocuparía el sitio del objeto, y por eso no puede haber otro.' },
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Mă tai unghiile duminica.', buena: 'Îmi tai unghiile duminica.',
    calcoEs: 'Me corto las uñas los domingos.',
    explicacion: 'El español usa «me» para las dos cosas; el rumano no. «Mă tai» es «me corto (yo)», con el pronombre haciendo de objeto; para cortar OTRA cosa que es mía hace falta el dativo «îmi».' },
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Mă cumpăr un palton nou.', buena: 'Îmi cumpăr un palton nou.',
    calcoEs: 'Me compro un abrigo nuevo.',
    explicacion: 'Lo comprado es «un palton», así que el pronombre no puede ser acusativo: el beneficiario va en dativo, «îmi». Con «mă» la frase diría que uno se compra a sí mismo.' },
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Te legi șireturile sau te ajut?', buena: 'Îți legi șireturile sau te ajut?',
    calcoEs: '¿Te atas los cordones o te ayudo?',
    explicacion: 'Los dos «te» del español no son el mismo en rumano: el primero lleva objeto directo («șireturile») y pide dativo «îți»; el segundo ES el objeto de «a ajuta», que en el estándar moderno rige acusativo (a ajuta pe cineva), y se queda en «te».' },
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Te pui căciula când ieși?', buena: 'Îți pui căciula când ieși?',
    calcoEs: '¿Te pones el gorro cuando sales?',
    explicacion: 'Lo que se pone es «căciula», que es el objeto directo; el que se la pone va en dativo: «îți pui». «Te pui» sería colocarse uno mismo en algún sitio.' },
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Te ștergi ochelarii cu tricoul?', buena: 'Îți ștergi ochelarii cu tricoul?',
    calcoEs: '¿Te limpias las gafas con la camiseta?',
    explicacion: 'Lo que se limpia son «ochelarii», no tú: el sitio del objeto directo ya está ocupado y el reflexivo pasa a dativo, «îți ștergi». «Te ștergi» solo sería secarte a ti mismo.' },
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Andrei se usucă părul cu uscătorul de păr.', buena: 'Andrei își usucă părul cu uscătorul de păr.',
    calcoEs: 'Andrei se seca el pelo con el secador.',
    explicacion: 'Con «părul» de objeto directo el reflexivo de 3.ª persona es «își», no «se». El sujeto está escrito, así que la frase no puede leerse como pasiva refleja («se usucă părul» = el pelo se seca): es sencillamente el clítico equivocado.' },
  { p: REFL, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Maria se schimbă pantofii la intrare.', buena: 'Maria își schimbă pantofii la intrare.',
    calcoEs: 'María se cambia los zapatos en la entrada.',
    explicacion: '«Maria se schimbă» es cambiarse de ropa ella misma; para cambiar UNA COSA propia hace falta el dativo «își schimbă pantofii». El español dice «se» en los dos casos y de ahí sale el error.' },

  // ══ r6-doblado-cliticos (8) ═══════════════════════════════════════
  // Dos plurales escuetos de ocho, y no tres: con un objeto marcado con
  // «pe» pero NO ESPECÍFICO la duplicación no está exigida (Cornilescu,
  // Tigău; GALR al tratar el objeto marcado), así que cada plural escueto
  // depende de que el contexto fuerce la lectura específica. Los otros
  // seis llevan nombre propio, posesivo o artículo, donde el doblado es
  // obligatorio sin margen.
  //
  // Y dos perfectos compuestos de ocho, no cuatro: producir `i-am` / `l-am`
  // es también `r6-contracciones-cliticos`, que la tarjeta compara exacto,
  // así que un alumno que escriba «Îi am sunat» ha entendido el doblado y
  // suspende por la grafía del clúster. Ese punto NO está en los prereqs
  // que el inventario da a éste; el solapamiento se acota a dos ítems y
  // queda escrito en vez de taparse.
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Văd pe Ion în fiecare zi.', buena: 'Îl văd pe Ion în fiecare zi.',
    calcoEs: 'Veo a Ion todos los días.',
    explicacion: 'Cuando el objeto directo es una persona determinada, el rumano pide DOS marcas a la vez: «pe» delante del nombre y el clítico delante del verbo. El español sólo tiene la primera, así que la segunda se olvida.' },
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Aștept pe Maria în fața cinematografului.', buena: 'O aștept pe Maria în fața cinematografului.',
    calcoEs: 'Espero a María delante del cine.',
    explicacion: 'El clítico concuerda en género y número con el objeto: para un femenino singular es «o». Sin él la frase no está completa aunque el «pe» esté puesto.' },
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Cunoști pe sora mea?', buena: 'O cunoști pe sora mea?',
    calcoEs: '¿Conoces a mi hermana?',
    explicacion: 'También en pregunta y también con un nombre común determinado por un posesivo: «sora mea» es una persona concreta, así que lleva «pe» y el clítico «o» delante del verbo.' },
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Am sunat pe vecini aseară.', buena: 'I-am sunat pe vecini aseară.',
    calcoEs: 'Llamé a los vecinos anoche.',
    explicacion: 'En plural masculino el clítico es «îi», y delante de un auxiliar que empieza por vocal se apoya en él: «i-am sunat». El guion no es opcional: es la forma que tiene el clítico ahí.' },
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Profesorul felicită pe studenții lui.', buena: 'Profesorul îi felicită pe studenții lui.',
    calcoEs: 'El profesor felicita a sus estudiantes.',
    explicacion: 'El clítico va entre el sujeto y el verbo: «îi felicită». Ponerlo no es enfático en rumano, es obligatorio con objeto humano determinado — y «studenții lui» lo está.' },
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Ieri am văzut pe tatăl tău în piață.', buena: 'Ieri l-am văzut pe tatăl tău în piață.',
    calcoEs: 'Ayer vi a tu padre en el mercado.',
    explicacion: 'Masculino singular: el clítico es «îl», y ante el auxiliar «am» se reduce a «l-». «Tatăl tău» está determinado, así que el doblado es obligatorio.' },
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Directorul primește pe invitați la ușă.', buena: 'Directorul îi primește pe invitați la ușă.',
    calcoEs: 'El director recibe a los invitados en la puerta.',
    explicacion: '«Invitați» son aquí personas concretas, las de esta puerta: «pe» delante y el clítico «îi» antes del verbo. El español no tiene nada equivalente al clítico y por eso el hueco pasa desapercibido.' },
  { p: DOB, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Ajut pe colega mea la teme.', buena: 'O ajut pe colega mea la teme.',
    calcoEs: 'Ayudo a mi compañera con los deberes.',
    explicacion: 'Con verbo en presente el clítico va suelto delante: «o ajut pe colega mea». El posesivo ya determina a la persona, así que las dos marcas son obligatorias.' },
];

/** Los clíticos reflexivos ACUSATIVOS que sí se distinguen del dativo.
 *  `ne` y `vă` NO están, y el motivo está arriba: aquí son la misma forma. */
const REFL_AC = /(?<![\p{L}-])(mă|te|se)(?![\p{L}-])/iu;
const REFL_DAT = /(?<![\p{L}-])(îmi|îți|își)(?![\p{L}-])/iu;
const REFL_SINCRETICO = /(?<![\p{L}-])(ne|vă)(?![\p{L}-])/iu;

/** SUJETOS DE 3.ª ADMITIDOS, en lista CERRADA y declarada.
 *
 *  Dos heurísticas ortográficas fallaron aquí seguidas, y las dos
 *  contestaban una pregunta distinta de la que hacían:
 *    · v0 `^(el|ea|ei|ele|\p{Lu}\p{L}+)` — «Se spală părul» empieza por
 *      «Se», que es una palabra capitalizada: el gate leía el propio
 *      CLÍTICO como el sujeto que tenía que exigir, y callaba en el único
 *      caso que existe para cazar.
 *    · v1, con los clíticos excluidos — «Ieri se usucă părul» sigue
 *      pasando, porque «Ieri» también va en mayúscula. Y el lote tiene un
 *      ítem que empieza por «Ieri», así que el patrón está en su idioma.
 *      Lo cazó el lingüista adversarial.
 *  La pregunta que hay que contestar es «¿hay sujeto?» y no «¿empieza por
 *  mayúscula?», y ninguna regex de ortografía la contesta. Lista cerrada:
 *  lo que no se declara, se suspende. */
const SUJETOS_3 = new Set(['el', 'ea', 'ei', 'ele', 'andrei', 'maria']);
/** Y no basta con que el sujeto ESTÉ: tiene que ir pegado delante del
 *  clítico. «Ieri Andrei se usucă…» valdría; «Ieri se usucă…», no. */
function sujetoAntesDelClitico(frase: string): boolean {
  const t = frase.trim().split(/[\s,¿?¡!.]+/).filter(Boolean);
  const i = t.findIndex((w) => /^se$/i.test(w));
  return i > 0 && SUJETOS_3.has(t[i - 1]!.toLowerCase());
}

/** LAS FORMAS QUE SON A LA VEZ 1.ª SG Y 3.ª PL, derivadas del lexicón y
 *  no escritas a mano. Con una de ellas, «Mă spun adevărul» tiene lectura
 *  CORRECTA —«ellos me dicen la verdad», con `adevărul` fuera— y la mala
 *  deja de ser mala. Es el mismo tipo de rescate que la pasiva refleja.
 *
 *  COSTE DECLARADO: sólo cubre los 42 verbos de `lexicon-a1`. `a șterge`
 *  no está, y la v0 del ítem 6 («Mă șterg ochelarii cu tricoul», donde
 *  `șterg` es 1.ª sg y 3.ª pl) la cazó el LINGÜISTA, no este gate. El
 *  agujero se escribe; no se disimula. */
const FORMAS_1SG_3PL = new Set(
  VERBOS_A1.filter((v) => presente(v, 'eu') && presente(v, 'eu') === presente(v, 'ei')).map((v) => presente(v, 'eu')!.toLowerCase()),
);

/** Los clíticos de acusativo que hacen el doblado, sueltos o APOYADOS en
 *  el auxiliar. La v0 pedía `(?![\p{L}])` detrás de las formas con guion y
 *  entonces `i-am` no casaba nunca —detrás del guion SIEMPRE hay letra—:
 *  cuatro falsos sobre cuatro ítems correctos. */
const CLIT_AC = /(?<![\p{L}-])(îl|o|îi|le)(?![\p{L}-])|(?<![\p{L}-])(l-|i-|le-)/iu;
/** La misma regla para la MALA, menos la `o` suelta cuando va detrás de
 *  preposición: ahí es el artículo indefinido femenino («pe o colegă») y
 *  no un clítico. Sin esta salvedad el gate «la mala ya viene doblada»
 *  marcaría un ítem cuyo verdadero problema lo denuncia el gate del
 *  objeto indefinido, dos líneas más abajo. */
const clitAcEnMala = (s: string) => CLIT_AC.test(s.replace(/(?<![\p{L}])(pe|cu|la|de|pentru)\s+o(?![\p{L}])/giu, '$1 X'));

export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CORO4-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));

    // REFL: la mala lleva el reflexivo ACUSATIVO y la buena el DATIVO. La
    // pregunta que contesta este gate es «¿la corrección cambia el CASO
    // del reflexivo?», que es exactamente la del punto.
    if (x.p === REFL) {
      if (!REFL_AC.test(x.mala)) v.push(`${id}: la mala no lleva un reflexivo acusativo (mă/te/se) — el error diana de este punto no aparece`);
      if (!REFL_DAT.test(x.buena)) v.push(`${id}: la buena no lleva el reflexivo dativo (îmi/îți/își), que es lo que el punto pide producir`);
      if (REFL_DAT.test(x.mala)) v.push(`${id}: la mala ya lleva el dativo — no hay nada que corregir en el caso del reflexivo`);
      if (REFL_SINCRETICO.test(x.mala)) v.push(`${id}: la mala usa «ne»/«vă», que son la misma forma en acusativo y en dativo — no hay contraste que corregir en este punto (el contraste ni/vi se examina en r6-contracciones-cliticos)`);
      if (!/(?<![\p{L}])(me|te|se)(?![\p{L}])/iu.test(x.calcoEs))
        v.push(`${id}: el calco español no lleva el clítico «me/te/se» — sin él no hay ambigüedad española de la que salga el error`);
      // La 3.ª persona sin sujeto pegado al clítico admite lectura de
      // PASIVA REFLEJA («se spală părul» = «el pelo se lava», GALR I) y
      // entonces la mala es rumano correcto.
      if (/(?<![\p{L}-])se(?![\p{L}-])/iu.test(x.mala) && !sujetoAntesDelClitico(x.mala))
        v.push(`${id}: la mala es de 3.ª persona y no lleva un sujeto declarado pegado delante del clítico — «se + objeto» se leería como pasiva refleja y la mala sería correcta`);
      // El sincretismo 1.ª sg / 3.ª pl, que también rescata la mala.
      for (const w of x.mala.toLowerCase().split(/[^\p{L}ăâîșț]+/u))
        if (w && FORMAS_1SG_3PL.has(w))
          v.push(`${id}: «${w}» es a la vez 1.ª sg y 3.ª pl — la mala tiene lectura correcta con el objeto de sujeto postverbal («ellos me…») y deja de ser agramatical`);
    }

    // DOB: «pe» está en las DOS y lo que falta en la mala es el CLÍTICO.
    if (x.p === DOB) {
      const pe = (s: string) => /(?<![\p{L}])pe(?![\p{L}])/iu.test(s);
      if (!pe(x.mala) || !pe(x.buena)) v.push(`${id}: «pe» tiene que estar en la mala y en la buena — si entra o sale, el ítem es de r6-pe-regla-operativa, no del doblado`);
      if (clitAcEnMala(x.mala)) v.push(`${id}: la mala ya lleva un clítico de acusativo — el error diana es justamente su ausencia`);
      if (!CLIT_AC.test(x.buena)) v.push(`${id}: la buena no lleva el clítico de acusativo que el doblado exige`);
      if (/(?<![\p{L}])pe (un|o|niște)(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: el objeto tras «pe» es indefinido — ahí el doblado no es obligatorio y la mala no sería agramatical`);
      // EL ATAJO PROPIO DE ESTE PUNTO, con las DOS mitades de la regla. El
      // español de México no dobla el objeto directo léxico POSPUESTO
      // («Vi a Juan»), y de ahí sale la mala; pero SÍ dobla —y
      // obligatoriamente— con el objeto ANTEPUESTO («A María la vi ayer»)
      // y con pronombre fuerte («Lo veo a él»). La v0 sólo miraba la
      // primera mitad, que es la que no puede aparecer: comprobaba el caso
      // imposible y dejaba pasar los dos posibles.
      const dobladoPospuesto = /(?<![\p{L}])(lo|la|los|las|le|les)\s+\p{L}+\s+al?\s/iu.test(x.calcoEs);
      const dobladoAntepuesto = /^¿?\s*al?\s+\p{L}+.*?(?<![\p{L}])(lo|la|los|las|le|les)(?![\p{L}])/iu.test(x.calcoEs);
      // El pronombre fuerte lo caza YA el patrón pospuesto («Lo veo a él»
      // encaja en clítico + verbo + «a »), comprobado al correr los gates
      // con la v0 delante: de los tres, los que estaban realmente abiertos
      // eran el antepuesto y —por otra vía— el sincretismo. Se deja
      // explícito igualmente porque la coincidencia es de la FORMA de la
      // regex y no de la pregunta, y la próxima vez que alguien toque el
      // patrón pospuesto se llevaría este caso por delante sin enterarse.
      const pronombreFuerte = /(?<![\p{L}])(lo|la|los|las|le|les)\s+\p{L}+\s+a\s+(mí|ti|él|ella|ellos|ellas|usted|ustedes|nosotros)(?![\p{L}])/iu.test(x.calcoEs);
      if (dobladoPospuesto || dobladoAntepuesto || pronombreFuerte)
        v.push(`${id}: el calco español dobla el clítico — copiándolo se llega a la estructura buena y el ítem mide español`);
    }
  }
  v.push(...revisarCopula(items.map((x) => ({ p: x.p, buena: x.buena, alt: x.alt })), 'COP'));
  const m = medirAtajo(items, 'ATAJO');
  for (const id of m.sinDeclarar) v.push(`${id}: atajoEs sin declarar`);
  for (const id of m.atajo) v.push(`${id}: atajoEs=true — el ítem mide español`);
  for (const d of m.discrepan) v.push(d);
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w)))) if (!exenta(w)) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  return v;
}

if (new RegExp(`[/\\\\]corr-ro-a2b\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log('# A qué punto cuenta cada ítem del lote 16\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-A2b (lote 16) — ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ~~${x.mala}~~ → **${x.buena}**\n      calco: «${x.calcoEs}»`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\nFormas 1.ª sg = 3.ª pl derivadas del lexicón: ${FORMAS_1SG_3PL.size}.`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

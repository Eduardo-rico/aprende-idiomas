// scripts/lotes/trans-ro-l24.ts — LOTE 24: `r5-imperativo-negativo`, el
// segundo punto de la máquina de transformación y el PRIMERO que existe
// sólo porque el formato existe.
//
//   npx tsx scripts/lotes/trans-ro-l24.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l24.ts --asigna   # a qué punto cuenta cada ítem
//
// El punto llevaba ocho ítems PUBLICADOS en formato de corrección y se
// retiraron enteros el 2026-09-03: de los ocho, tres se resolvían
// traduciendo, dos declaraban como mala un error de GENERADOR que ningún
// alumno comete, y sólo tres eran corrección legítima. El diagnóstico que
// lo mandó aquí es el §0.4/3: la dificultad de este punto es lo que el
// alumno NO pone, y una tarjeta de corrección mide lo que pone de más.
//
// ══ LA REGLA, EN DOS CASILLAS ════════════════════════════════════════
//
//   2.ª SG:  `nu` + INFINITIVO CORTO   — nu veni!, nu citi!, nu mânca!
//   2.ª PL:  `nu` + la MISMA forma del afirmativo — nu veniți!, nu citiți!
//
// (GALR I, *Imperativul*; GBLR 2010, *Verbul · imperativul negativ*;
// DOOM3 2021. Las dos casillas están atestadas en el corpus del proyecto:
// ver `COMPROBACIONES`.)
//
// ══ QUÉ ES GRATIS PARA UN HISPANOHABLANTE, QUE ES LA PRIMERA PREGUNTA ═
//
// **Que la forma cambia al negar es gratis**: el español también la
// cambia (*ven* → *no vengas*, *come* → *no comas*), así que el alumno
// llega sabiendo que `Vino!` no da `*Nu vino!`. Lo que NO trae de casa es
// A QUÉ cambia: su ruta es el subjuntivo, y el subjuntivo rumano es
// `să vii`, o sea que la transferencia produce `nu vii`, nunca `nu veni`.
// Eso está escrito como estrategia y se EJECUTA (`RUTA_DEL_SUBJUNTIVO`).
//
// Y el reverso, que es el que decide el reparto del lote: **en el PLURAL
// esa misma ruta acierta**, porque la 2.ª pl. rumana es la misma forma en
// presente, conjuntivo e imperativo. Es literalmente la razón por la que
// los tres ítems de plural del lote viejo se resolvían traduciendo. Aquí
// los plurales NO están para medir: están para ser la FRONTERA (§0.6) —
// el contexto donde la regla «negativo = infinitivo» NO se aplica y
// sobreaplicarla produce `*Nu veni mâine!` dicho a dos personas, que es
// exactamente el error que la `descripcion` del punto declara.
//
// ══ LA FORMA CORRECTA QUE LA CONSIGNA CIERRA POR LA FORMA ════════════
//
// `Să nu vii mâine!` es rumano vivo y normativo, y está ATESTADO en el
// corpus del proyecto (`să nu vii` ×4). Igual que en el lote 23 con
// `Să vii!`, no se marca mal: se excluye pidiendo que la frase EMPIECE
// por la negación, que es una propiedad de la forma y no una etiqueta.
// Queda escrito aquí porque rechazarlo en silencio sería poner un
// asterisco sin fuente, que es el §0 incumplido por omisión.
//
// ══ LO QUE ESTE LOTE NO TOCA ═════════════════════════════════════════
//
// **Ni un reflexivo.** `Du-te!` → `Nu te duce!` sería la frontera obvia y
// es el punto de al lado: un fallo ahí es inatribuible entre no saber la
// forma negativa y no saber dónde va el clítico, que es
// `r6-cliticos-imperativo-gerunziu`. Misma decisión que en el lote 23.
//
// **Ni `a fi`.** `Fii cuminte!` → `Nu fi cuminte!` separa foco y núcleo
// por UNA letra —es el contraste mínimo del §0.8, ortografía disfrazada
// de morfología— y encima `nu fii` sale 30 veces en el corpus, así que
// marcarlo como error exigiría cita normativa que este lote no tiene.
//
// **Ni un verbo cuyo par se distinga sólo por el diacrítico.**
// `Lasă ușa!` → `Nu lăsa ușa!` estaba en el borrador y se cayó al
// medirlo: `lasă` y `lăsa` son la MISMA cadena una vez normalizada, o sea
// que el ítem se contesta copiando y lo único que examina es cuál de las
// dos vocales lleva la breve. Lo cazó la propia máquina.
import { verificar, informe, correr, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion, norm } from '../lib/transformacion-ro';
import { informeAsigna } from '../lib/asigna-ro';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente, infinitivoCorto } from '../lib/paradigma-ro';

const NEG = 'r5-imperativo-negativo';

/** La consigna, escrita UNA vez. Cada cláusula cierra una salida que es
 *  rumano correcto y que la tarjeta suspendería:
 *
 *   · «usa el mismo verbo» ata el LEXEMA — sin eso, `Nu mai veni!`
 *     (`nu mai veni` ×4 en el corpus) y `Stai acasă!` son maneras
 *     naturales de dar la misma prohibición.
 *   · «empieza la frase por la negación» cierra `Să nu vii mâine!` POR LA
 *     FORMA, no por una etiqueta: en español el imperativo negativo ES un
 *     subjuntivo, así que ninguna etiqueta morfológica excluye para el
 *     alumno lo que la gramática rumana trata como forma concurrente del
 *     mismo paradigma. Y cierra además `Mâine nu veni!`.
 *   · «no pongas pronombre» cierra `Nu veni tu!`, que es correcto y
 *     contrastivo — el imperativo rumano SÍ admite sujeto expreso
 *     (`tu vino` ×3 en el corpus, Eminescu), y fingir que no lo admite
 *     fue el juicio falso del lote 23 (§4.33). */
const PROHIBE_SG = 'Dile a tu amigo que NO haga eso: usa el mismo verbo, empieza la frase por la negación y no pongas pronombre.';
const PROHIBE_PL = 'Diles a tus dos amigos que NO hagan eso: usa el mismo verbo, empieza la frase por la negación y no pongas pronombre.';

export const ITEMS: ItemTransRo[] = [
  // ══ SINGULAR · LA REGLA: `nu` + INFINITIVO CORTO ══════════════════
  // La fuente es el imperativo AFIRMATIVO, que es el prerrequisito del
  // punto (`r3-imperativo-afirmativo`, publicado en el lote 23). Así el
  // ítem aísla la negación: la forma afirmativa va DADA y lo único que
  // el alumno produce es la casilla negativa.

  // El supletivo: `vino` no se parece a `veni` por ningún lado, así que
  // el ítem exige saber de qué lema sale la forma. `veni`/«venir» es el
  // único par del lote donde la raíz románica ayuda, y va declarado.
  { p: NEG, pasada: 1, espejoEs: false, transparenteLatin: true,
    s: 'Vino mâine!', instruccion: PROHIBE_SG, r: 'Nu veni mâine!',
    foco: 'vino', nucleo: 'veni' },

  // `a lua`: 1.ª conjugación con imperativo `ia`, que no comparte ni la
  // consonante inicial con el infinitivo.
  { p: NEG, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Ia banii!', instruccion: PROHIBE_SG, r: 'Nu lua banii!',
    foco: 'ia', nucleo: 'lua' },

  // El sufijo `-esc`: el afirmativo es la 3.ª sg (`citește`) y el
  // negativo tira el sufijo entero. Es el contraste más largo del lote y
  // el que más se falla al revés (`*nu citește`).
  { p: NEG, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Citește scrisoarea!', instruccion: PROHIBE_SG, r: 'Nu citi scrisoarea!',
    foco: 'citește', nucleo: 'citi' },

  // Alternancia vocálica que se DESHACE: el afirmativo lleva el tema
  // tónico (`mănâncă`) y el infinitivo el átono (`mânca`).
  { p: NEG, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Mănâncă tot!', instruccion: PROHIBE_SG, r: 'Nu mânca tot!',
    foco: 'mănâncă', nucleo: 'mânca' },

  // La otra alternancia, el diptongo `ea` que se reduce a `e`.
  { p: NEG, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Așteaptă aici!', instruccion: PROHIBE_SG, r: 'Nu aștepta aici!',
    foco: 'așteaptă', nucleo: 'aștepta' },

  // ══ LA COPIA LEGÍTIMA DENTRO DEL SINGULAR ═════════════════════════
  // 3.ª conjugación: el imperativo afirmativo YA ES el infinitivo corto,
  // así que la regla se aplica entera y no cambia nada. Sin un ítem así
  // el lote enseñaría «al negar, la forma siempre cambia», que es la
  // regularidad que deja el cierre de la estrategia de copiar — y es
  // falsa: siete verbos de 3.ª del lexicón se comportan igual.
  { p: NEG, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Începe fără mine!', instruccion: PROHIBE_SG, r: 'Nu începe fără mine!',
    foco: 'începe', nucleo: 'începe' },

  // ══ PLURAL · LA FRONTERA (§0.6) ═══════════════════════════════════
  // Aquí la regla del singular NO se aplica, y sobreaplicarla produce el
  // error que la `descripcion` del punto declara: `*Nu veni mâine!` dicho
  // a dos personas. Van emparejados uno a uno con tres de los singulares
  // —mismo verbo, mismo complemento, sólo cambia el número— porque el
  // punto ES el corte entre las dos casillas y un par mínimo lo enseña
  // mejor que dos frases sin relación.
  //
  // Los tres son `espejoEs: true` y está contado: la 2.ª pl. rumana es la
  // misma forma en presente, conjuntivo e imperativo, así que la ruta del
  // subjuntivo español acierta. No están para medir, están para impedir
  // que el alumno saque 9/9 con media regla.
  { p: NEG, pasada: 1, espejoEs: true, transparenteLatin: false, sobreaplicacion: true,
    s: 'Veniți mâine!', instruccion: PROHIBE_PL, r: 'Nu veniți mâine!',
    foco: 'veniți', nucleo: 'veniți' },
  { p: NEG, pasada: 1, espejoEs: true, transparenteLatin: false, sobreaplicacion: true,
    s: 'Citiți scrisoarea!', instruccion: PROHIBE_PL, r: 'Nu citiți scrisoarea!',
    foco: 'citiți', nucleo: 'citiți' },
  { p: NEG, pasada: 1, espejoEs: true, transparenteLatin: false, sobreaplicacion: true,
    s: 'Așteptați aici!', instruccion: PROHIBE_PL, r: 'Nu așteptați aici!',
    foco: 'așteptați', nucleo: 'așteptați' },
];

/** LA ESTRATEGIA QUE EL ALUMNO TRAE DE CASA, EJECUTADA.
 *
 *  El hispanohablante sabe que negar cambia la forma, y su ruta es el
 *  subjuntivo: *no vengas*, *no comas*, *no leas*. El equivalente rumano
 *  del subjuntivo es el conjuntivo, y el conjuntivo de 2.ª persona es
 *  homógrafo del presente (`să vii` ← `vii`, `să citiți` ← `citiți`), así
 *  que la ruta produce **la 2.ª persona del presente**. Se le pide al
 *  PARADIGMA, no a una tabla escrita a mano.
 *
 *  El número es lo que justifica el reparto del lote: acierta **los tres
 *  plurales y ninguno de los seis singulares**, porque en plural las tres
 *  casillas rumanas colapsan en una y en singular no. Es la medición que
 *  mató al lote viejo, ahora ejecutable. */
/** LA LISTA CERRADA SUPLETIVA, la misma del lote 23 y con su fuente:
 *  imperativos afirmativos que no salen de ninguna casilla del presente,
 *  así que buscarlos por `presente()` devuelve null (GALR I,
 *  *Imperativul*; DOOM3 2021; tablas de dexonline). **Sin esta tabla, las
 *  dos estrategias de abajo devolverían null sobre `vino` y saldrían
 *  artificialmente bajas: una estrategia que no puede disparar sobre
 *  parte del lote es el §4.18.** */
const SUPLETIVOS: Record<string, string> = { vino: 'a veni', 'fă': 'a face', zi: 'a zice', adu: 'a aduce' };

/** De la forma que el alumno tiene delante al LEMA, por los tres caminos
 *  por los que un imperativo afirmativo rumano puede estar formado. */
const lemaDelFoco = (foco: string) => {
  const sup = SUPLETIVOS[norm(foco)];
  return VERBOS_A1.find((l) =>
    (sup ? l.inf === sup : false)
    || (['tu', 'el', 'voi'] as const).some((p) => norm(presente(l, p) ?? '') === norm(foco))
    || norm(infinitivoCorto(l.inf)) === norm(foco)) ?? null;
};

export const RUTA_DEL_SUBJUNTIVO: Estrategia = {
  nombre: 'la ruta del subjuntivo español (2.ª persona del presente)',
  aplicar(x) {
    const per = /ți$/u.test(x.foco) ? 'voi' : 'tu';
    const v = lemaDelFoco(x.foco);
    return v ? presente(v, per) : null;
  },
};

/** LA OTRA MITAD, Y ES LA QUE EL LOTE EXISTE PARA IMPEDIR.
 *
 *  Un alumno que aprende «el imperativo negativo es el infinitivo» y no
 *  aprende que eso vale sólo en singular lo aplica a los nueve. Se
 *  escribe como función —el infinitivo se saca del lexicón, no de una
 *  lista— y se corre: acierta los seis singulares más el de 3.ª
 *  conjugación, y falla los tres plurales, que es exactamente lo que los
 *  tres plurales existen para medir.
 *
 *  **Su número no es un veredicto sobre el lote, es la razón del
 *  reparto**: si pasara del tope, el lote estaría certificando media
 *  regla como si fuera la regla (§4.29). */
export const SIEMPRE_EL_INFINITIVO: Estrategia = {
  nombre: 'sobreaplicar «negativo = infinitivo» también al plural',
  aplicar(x) {
    const v = lemaDelFoco(x.foco);
    return v ? infinitivoCorto(v.inf) : null;
  },
};

/** LA ESTRATEGIA DE FRASE ENTERA, que contra el núcleo no se ve (§ lote
 *  23, hallazgo 4): «copio la fuente y le pongo `nu` delante». Es lo que
 *  un alumno hace de punta a punta sin haber aprendido nada, y la
 *  comparación es la del PRODUCTO. */
export const ANTEPONER_NU: Estrategia = {
  nombre: 'ponerle «nu» delante a la fuente y no tocar nada más',
  objetivo: 'respuesta',
  aplicar: (x) => 'Nu ' + x.s.charAt(0).toLowerCase() + x.s.slice(1),
};

/** LAS AFIRMACIONES DEL LOTE, EJECUTABLES CONTRA LOS 2,9 M DE PALABRAS.
 *  Son las afirmaciones de las que cuelgan las decisiones de arriba, no
 *  una muestra decorativa. */
export const COMPROBACIONES: Comprobacion[] = [
  // Las dos casillas de la regla, cada una atestada por su lado.
  { afirmacion: 'la 2.ª sg negativa es «nu» + infinitivo corto', patron: 'nu veni', espera: 'presente' },
  { afirmacion: 'y también con verbo de 1.ª conjugación', patron: 'nu mânca', espera: 'presente' },
  { afirmacion: 'y con el sufijo -esc, donde el afirmativo es citește', patron: 'nu citi', espera: 'presente' },
  { afirmacion: 'la 2.ª pl negativa es la MISMA forma del afirmativo', patron: 'nu veniți', espera: 'presente' },
  // Por qué la consigna cierra `Să nu vii!` por la forma y no lo marca mal.
  { afirmacion: '«să nu» + conjuntivo es prohibitiva viva de 2.ª sg', patron: 'să nu vii', espera: 'presente' },
  // Por qué la consigna tiene que atar el LEXEMA y el orden.
  { afirmacion: '«nu mai» compite como forma natural de la misma prohibición', patron: 'nu mai veni', espera: 'presente' },
  // Por qué `a fi` queda FUERA del lote: no se le puede pedir al alumno
  // `nu fi` contra `nu fii` sin cita normativa, y el corpus trae las dos.
  { afirmacion: '«nu fii» está atestado y por eso a fi queda fuera del lote', patron: 'nu fii', espera: 'presente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  // `SIEMPRE_EL_INFINITIVO` NO va aquí, y la razón va escrita porque es
  // justo la forma que tiene una excusa: **no es una estrategia libre.**
  // Las de esta lista modelan a un alumno que no sabe nada del punto
  // —copiar, repetir la edición modal, traducir del español—, y ninguna
  // exige rumano. Sobreaplicar «negativo = infinitivo» exige saber la
  // cláusula principal de la regla que este lote enseña: no es un alumno
  // que adivina, es un alumno que aprendió media regla. Medirlo con el
  // tope del 50 % haría IMPOSIBLE cualquier punto cuya regla tenga
  // excepción minoritaria —que es la forma que el §0.6 exige— y el
  // instrumento para eso es la FRONTERA, que este lote cumple con tres
  // ítems `sobreaplicacion` y su juicio escrito. Se corre igual y su
  // número se imprime SIEMPRE, abajo, junto al informe de la máquina.
  estrategias: [RUTA_DEL_SUBJUNTIVO, ANTEPONER_NU],
  juicios: {
    copia: 'CUATRO de nueve se contestan copiando el foco, y los cuatro son la lengua, no un descuido: los TRES PLURALES, donde la 2.ª pl negativa ES la misma forma del afirmativo en todo el paradigma salvo `a fi`, y `Începe fără mine!`, donde el imperativo afirmativo de la 3.ª conjugación YA ES el infinitivo corto, así que la regla se aplica entera y no cambia nada. Quitarlos dejaría la regularidad «al negar, la forma siempre cambia», que es falsa en rumano y es la estrategia gratis que abre el cierre de la de copiar. Cuatro de nueve es el número correcto porque el punto tiene dos casillas y una de ellas no cambia nada: bajarlo exigiría inventar cambios que la lengua no hace. Medido ejecutando: copiar el foco 4/9, copiar la frase entera 0/9, ponerle «nu» delante a la fuente 4/9, la edición modal del lote 4/9.',
    frontera: 'Los TRES PLURALES son los ítems de sobreaplicación, y van emparejados uno a uno con tres singulares del mismo verbo y el mismo complemento. La regla «imperativo negativo = nu + infinitivo corto» tiene su contexto negativo exactamente en la 2.ª plural, donde la forma es la del afirmativo: un alumno que aprenda la mitad singular escribe *Nu veni mâine! a dos personas, que es el error que la propia descripción del punto declara y el que comete un generador que aplica la regla sin mirar el número. Sin estos tres, el lote sacaría 6/6 a quien sepa media regla y el corpus certificaría que sabe la regla entera. La estrategia `sobreaplicar «negativo = infinitivo» también al plural` está escrita como función y se ejecuta: acierta los seis singulares y falla los tres plurales.',
    varianza: 'La pieza «+nu» es INVARIANTE en los nueve, y es invariancia de la LENGUA, no del diseño: el rumano no tiene imperativo negativo sin `nu` —no existe forma prohibitiva que lo omita—, igual que en `r3-negacion-antepuesta`, el caso que la pasada de varianza declaró legítimo por esta misma razón. Lo que varía en su lugar, y ES el punto, es la CASILLA de la que sale la forma verbal: infinitivo corto en las seis del singular y forma del afirmativo en las tres del plural. Y dentro del singular varía la DISTANCIA entre las dos casillas, que es lo que hace que el ítem no se conteste copiando: supletivo (vino→veni, ia→lua), sufijo -esc que se tira entero (citește→citi), alternancia vocálica que se deshace (mănâncă→mânca, așteaptă→aștepta) y coincidencia de 3.ª conjugación (începe→începe). Ninguna de esas ediciones se repite, así que la edición modal del lote es la identidad y acierta sólo donde la identidad ES la respuesta.',
  },
};

if (/[/\\]trans-ro-l24\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 24 · transformación · ${ITEMS.length} ítems\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  // La media regla, ejecutada y ESCRITA aquí en vez de pasada al tope de
  // estrategias: no es un alumno que adivina (ver `OPCIONES`). Si algún
  // día llega a 9/9, el lote habrá perdido su frontera y el número lo
  // dirá en voz alta en lugar de desaparecer.
  const media = correr(SIEMPRE_EL_INFINITIVO, ITEMS);
  console.log(`\n**La MEDIA REGLA, ejecutada** (\`${media.nombre}\`): acierta ${media.aciertos}/${ITEMS.length} — los seis singulares y ninguno de los tres plurales. No es una estrategia libre y por eso no entra en el tope; es la razón del reparto del lote.`);
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}

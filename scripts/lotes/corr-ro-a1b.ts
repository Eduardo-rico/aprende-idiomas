// scripts/lotes/corr-ro-a1b.ts — EL TERCER LOTE RUMANO: corrección, A1-A2 (b).
//
//   npx tsx scripts/lotes/corr-ro-a1b.ts            # preflight + gates
//
// 24 ítems, tres puntos `trampa` con calco firme:
//   · r3-dativo-experimentante  «tengo hambre» → *am foame → mi-e foame
//   · r4-posesivos              «mi casa» → *mea casă → casa mea
//   · r4-preposicion-caida-articulo «a la escuela» → *la școala → la școală
//
// El dativo entra con la tabla que el lingüista atestó calco por calco
// (dictamen del lote 2): «am foame/sete/frig/cald/somn» NO están en DEX
// (sólo «a-i fi …»), «copilul are frig», «te lipsesc» (= privar) y «simt
// mult» (a simți = percibir) son agramaticales. Y lo que NO se toca nunca
// porque está atestado: «am teamă» (NODEX), «am frică» (Alecsandri, DLRLC),
// «am rușine» (MDA2), «am dor» (folclore). Hunspell aprueba «am foame» —
// todas las palabras existen—, así que el punto lleva gate propio.
//
// La tarjeta pinta SÓLO la frase mala: cada mala fija por sí sola la
// persona y el referente (lección del lote 2).
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';

const DAT = 'r3-dativo-experimentante';
const POS = 'r4-posesivos';
const PREP = 'r4-preposicion-caida-articulo';

export const ITEMS: ItemCorreccion[] = [
  // ══ r3-dativo-experimentante (8) ══════════════════════════════════
  // El clítico dativo ante «e»: mi-e, ți-e, i-e, ni-e, vi-e, li-e (GALR,
  // DOOM3); la forma plena «îmi este» siempre vale y va en alt. «am somn»
  // y «simt mult» salieron (D2/E6 del dictamen): coloquial real el uno,
  // no agramatical el otro.
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Am foame, mergem să mâncăm?', buena: 'Mi-e foame, mergem să mâncăm?', alt: ['Îmi este foame, mergem să mâncăm?', 'Îmi e foame, mergem să mâncăm?'],
    calcoEs: 'Tengo hambre, ¿vamos a comer?',
    explicacion: 'El hambre no se «tiene»: «le es» a uno. El experimentante va en dativo, con el clítico pegado a «e»: «mi-e foame» (= «îmi este foame»). «Am foame» calca «tengo hambre» (con determinante sí existe: «am o foame de lup»).' },
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Am sete, vreau apă.', buena: 'Mi-e sete, vreau apă.', alt: ['Îmi este sete, vreau apă.', 'Îmi e sete, vreau apă.'],
    calcoEs: 'Tengo sed, quiero agua.',
    explicacion: 'Como el hambre, la sed «le es» a uno: «mi-e sete». «Am sete» sólo vale en sentido figurado con complemento («are sete de putere»).' },
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Am frig aici, închide fereastra.', buena: 'Mi-e frig aici, închide fereastra.', alt: ['Îmi este frig aici, închide fereastra.', 'Îmi e frig aici, închide fereastra.'],
    calcoEs: 'Tengo frío aquí, cierra la ventana.',
    explicacion: 'Frío y calor van en dativo: «mi-e frig», «mi-e cald». La serie ante «e» es mi-, ți-, i-, ni-, vi-, li- (mi-e, ți-e, i-e frig…); la forma plena, «îmi este frig».' },
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Am cald, deschide geamul.', buena: 'Mi-e cald, deschide geamul.', alt: ['Îmi este cald, deschide geamul.', 'Îmi e cald, deschide geamul.'],
    calcoEs: 'Tengo calor, abre la ventana.',
    explicacion: '«Mi-e cald» (a mí me es calor). El verbo es «a fi», no «a avea»; lo que cambia es el clítico dativo: mi-e, ți-e, i-e, ni-e, vi-e, li-e.' },
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Ai frig? Închide ușa.', buena: 'Ți-e frig? Închide ușa.', alt: ['Îți este frig? Închide ușa.', 'Îți e frig? Închide ușa.'],
    calcoEs: '¿Tienes frío? Cierra la puerta.',
    explicacion: 'En 2.ª persona el clítico es «ți-»: «ți-e frig» (= «îți este frig»). «Ai frig» conjuga «tener» como el español.' },
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Copilul are frig, pune-i o haină.', buena: 'Copilului i-e frig, pune-i o haină.', alt: ['Copilului îi e frig, pune-i o haină.', 'Copilului îi este frig, pune-i o haină.', 'I-e frig copilului, pune-i o haină.'],
    calcoEs: 'El niño tiene frío, ponle un abrigo.',
    explicacion: 'Con un sustantivo como experimentante, va en DATIVO («copilului») y se dobla con el clítico de 3.ª: «copilului i-e frig» (= «îi este frig»). «Copilul are frig» calca «tiene frío».' },
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Ea are cald, deschide fereastra.', buena: 'Ei i-e cald, deschide fereastra.', alt: ['I-e cald, deschide fereastra.', 'Ei îi e cald, deschide fereastra.', 'Îi este cald, deschide fereastra.'],
    calcoEs: 'Ella tiene calor, abre la ventana.',
    explicacion: 'El pronombre experimentante va en dativo («ei») y se dobla con «i-»: «ei i-e cald»; basta «i-e cald» si el referente está claro. «Ea are cald» es el calco.' },
  { p: DAT, pasada: 1, espejoEs: false, mala: 'Te lipsesc mult.', buena: 'Îmi lipsești mult.', alt: ['Mi-e dor de tine.', 'Îmi este dor de tine.'],
    calcoEs: 'Te echo mucho de menos.',
    explicacion: '«A lipsi» funciona como «faltar»: el que falta es el sujeto y el que lo echa de menos va en dativo — «îmi lipsești» (me faltas). «Te lipsesc» significaría «te privo de algo» y necesita «de». También «mi-e dor de tine».' },

  // ══ r4-posesivos (8) ══════════════════════════════════════════════
  // El posesivo va DETRÁS del sustantivo, y el sustantivo lleva artículo:
  // «casa mea». «Mi casa» → *mea casă es español perfecto calcado.
  { p: POS, pasada: 1, espejoEs: false, mala: 'Mea casă este lângă parc.', buena: 'Casa mea este lângă parc.', alt: ['Casa mea e lângă parc.'],
    calcoEs: 'Mi casa está al lado del parque.',
    explicacion: 'El posesivo va detrás y el sustantivo lleva el artículo enclítico: «casa mea». Anteponerlo y dejar el sustantivo desnudo es el calco de «mi casa».' },
  { p: POS, pasada: 1, espejoEs: false, mala: 'Meu frate locuiește la Cluj.', buena: 'Fratele meu locuiește la Cluj.', alt: ['Frate-meu locuiește la Cluj.'],
    calcoEs: 'Mi hermano vive en Cluj.',
    explicacion: '«Fratele meu»: primero el sustantivo articulado (fratele), después el posesivo. Con «frate» el artículo es «-le».' },
  { p: POS, pasada: 1, espejoEs: false, mala: 'Ta carte este pe masă.', buena: 'Cartea ta este pe masă.', alt: ['Cartea ta e pe masă.'],
    calcoEs: 'Tu libro está en la mesa.',
    explicacion: 'Mismo orden con «ta»: «cartea ta». El posesivo concuerda con lo poseído (carte, femenino → ta) y va pospuesto.' },
  { p: POS, pasada: 1, espejoEs: false, mala: 'Noștri prieteni vin mâine.', buena: 'Prietenii noștri vin mâine.',
    calcoEs: 'Nuestros amigos vienen mañana.',
    explicacion: 'En plural igual: sustantivo con artículo plural (prietenii) y posesivo detrás (noștri). «Noștri prieteni» calca «nuestros amigos».' },
  { p: POS, pasada: 1, espejoEs: false, mala: 'Mei părinți sunt la țară.', buena: 'Părinții mei sunt la țară.',
    calcoEs: 'Mis padres están en el pueblo.',
    explicacion: '«Părinții mei»: el artículo plural «-i» se pega al sustantivo y el posesivo masculino plural «mei» va detrás.' },
  { p: POS, pasada: 1, espejoEs: false, mala: 'Mele cărți sunt în geantă.', buena: 'Cărțile mele sunt în geantă.',
    calcoEs: 'Mis libros están en el bolso.',
    explicacion: 'Femenino plural: «cărțile mele». El posesivo tiene cuatro formas (meu, mea, mei, mele) según lo poseído, y siempre pospuesto.' },
  { p: POS, pasada: 1, espejoEs: false, mala: 'Voastră mașină este nouă.', buena: 'Mașina voastră este nouă.', alt: ['Mașina voastră e nouă.'],
    calcoEs: 'Su coche (de ustedes) es nuevo.',
    explicacion: '«Mașina voastră»: sustantivo articulado + posesivo. El calco antepone «voastră» como el español antepone «vuestro».' },
  { p: POS, pasada: 1, espejoEs: false, mala: 'Lor copil are cinci ani.', buena: 'Copilul lor are cinci ani.',
    calcoEs: 'Su hijo (de ellos) tiene cinco años.',
    explicacion: 'Para «de ellos» el posesivo es «lor», invariable y pospuesto: «copilul lor». Antepuesto sólo existe con artículo posesivo y en registro literario («al lor copil»); antepuesto y con el sustantivo desnudo, nunca.' },

  // ══ r4-preposicion-caida-articulo (8) ═════════════════════════════
  // Tras preposición de acusativo, el sustantivo va SIN artículo: la
  // școală, în oraș, pe stradă. «A la escuela» → *la școala es el calco.
  // Se conserva con determinante (la școala noastră) y con «cu»
  // instrumental/comitativo (cu trenul): los dos van en el lote como
  // contraste, y el gate sabe que ahí la buena LLEVA artículo.
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Merg la școala în fiecare zi.', buena: 'Merg la școală în fiecare zi.',
    calcoEs: 'Voy a la escuela todos los días.',
    explicacion: 'Tras «la» el sustantivo pierde el artículo: «la școală» (a la escuela), aunque el español lo lleve. Sólo lo conserva si sigue un determinante: «la școala noastră».' },
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Locuim în orașul de zece ani.', buena: 'Locuim în oraș de zece ani.',
    calcoEs: 'Vivimos en la ciudad desde hace diez años.',
    explicacion: '«În oraș» (en la ciudad): sin artículo tras «în». «În orașul» sólo si sigue algo que lo determine («în orașul acesta»).' },
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Copiii se joacă pe strada.', buena: 'Copiii se joacă pe stradă.',
    calcoEs: 'Los niños juegan en la calle.',
    explicacion: '«Pe stradă» (en la calle), sin artículo. El «la» del español se calca como «-a» pegada y sobra.' },
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Tata este la biroul până seara.', buena: 'Tata este la birou până seara.', alt: ['Tata e la birou până seara.'],
    calcoEs: 'Papá está en la oficina hasta la noche.',
    explicacion: '«La birou» (en la oficina): tras «la», sin artículo. «La biroul» pide un determinante detrás («la biroul lui»).' },
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Mergem la piața sâmbăta.', buena: 'Mergem la piață sâmbăta.',
    calcoEs: 'Vamos al mercado los sábados.',
    explicacion: '«La piață» (al mercado): la preposición hace caer el artículo, salvo que siga un determinante («la piața centrală», «la piața Obor»). Sin nada detrás, sin artículo.' },
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Merg cu tren la Brașov.', buena: 'Merg cu trenul la Brașov.',
    calcoEs: 'Voy en tren a Brașov.',
    explicacion: 'Excepción que hay que saber: con «cu» (medio, compañía) el artículo se CONSERVA: «cu trenul», «cu mașina», «cu autobuzul». Aquí el español («en tren») es el que no lo lleva.' },
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Scriu mereu cu creion.', buena: 'Scriu mereu cu creionul.',
    calcoEs: 'Siempre escribo con lápiz.',
    explicacion: 'Mismo caso: «cu creionul». El instrumento con «cu» lleva artículo aunque el español diga «con lápiz».' },
  { p: PREP, pasada: 1, espejoEs: false, mala: 'Sora mea e la școala nouă, eu sunt la școala.', buena: 'Sora mea e la școala nouă, eu sunt la școală.',
    calcoEs: 'Mi hermana está en la escuela nueva, yo estoy en la escuela.',
    explicacion: 'Las dos en una frase: con determinante detrás («școala noastră») el artículo se queda; sin nada detrás («la școală») cae. Es la regla completa del punto.' },
];

export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CORO-B-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));
    // El gate del dativo: la mala usa «a avea» (o el calco atestado) y la
    // buena lleva el dativo; y NUNCA se corrige lo atestado (teamă, frică, rușine, dor).
    if (x.p === DAT) {
      if (/(teamă|frică|rușine|dor)/i.test(x.mala)) v.push(`${id}: «am ${RegExp.$1}» está atestado (NODEX/DLRLC/MDA2) — no se corrige`);
      if (!/(?<![\p{L}])(am|ai|are|avem|aveți|au|simt|lipsesc)(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala no lleva el calco de «tener/sentir/echar de menos»`);
      if (!/(?<![\p{L}])(mi-e|ți-e|i-e|ni-e|vi-e|li-e|îi e|ne e|vă e|le e|îmi|îți|îi|ne|vă|le)(?![\p{L}-])/iu.test(x.buena)) v.push(`${id}: la buena no lleva el dativo experimentante`);
    }
    if (x.p === POS && !/^(meu|mea|mei|mele|tău|ta|tăi|tale|său|sa|săi|sale|nostru|noastră|noștri|noastre|vostru|voastră|voștri|voastre|lor) /i.test(x.mala)) v.push(`${id}: la mala no antepone el posesivo`);
    // …y la BUENA lleva el sustantivo ARTICULADO delante del posesivo (D8 del
    // dictamen: los gates sólo miraban la mala; «Casă mea» pasaba).
    if (x.p === POS && !/(?<![\p{L}])\p{L}+(ul|le|ua|a|ii|i)[- ](meu|mea|mei|mele|tău|ta|tăi|tale|său|sa|săi|sale|nostru|noastră|noștri|noastre|vostru|voastră|voștri|voastre|lor)(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena no lleva el sustantivo articulado delante del posesivo`);
    if (x.p === PREP) {
      const conCu = /(?<![\p{L}])cu(?![\p{L}])/iu.test(x.buena);
      // Con «cu» la BUENA tiene que CONSERVAR el artículo («cu trenul»): antes
      // el gate se saltaba estos ítems entero y «Merg cu tren» pasaba.
      if (conCu && !/(?<![\p{L}])cu \p{L}+(ul|le|ua|a)(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: con «cu» la buena tiene que conservar el artículo`);
      if (!/(?<![\p{L}])(la|în|pe|cu|din|de la)(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala no tiene preposición`);
      // Tras la/în/pe la buena NO lleva artículo enclítico (-ul/-le/-ua/-a
      // sobre la base) y la mala SÍ: se mira la terminación articulada, no
      // la desnuda, porque la desnuda es cualquier cosa (oraș, școală, birou).
      const ART = /(?<![\p{L}])(la|în|pe) \p{L}+(ul|le|ua|a)(?![\p{L}])/u;
      // Un sintagma DETERMINADO tras la preposición (posesivo, demostrativo,
      // adjetivo, genitivo) conserva el artículo: se quita del examen.
      if (!conCu && ART.test(x.buena.replace(/(?<![\p{L}])(la|în|pe) \p{L}+(ul|le|ua|a) \p{L}+(?![\p{L}])/gu, ''))) v.push(`${id}: la buena conserva el artículo tras la preposición sin determinante`);
      if (!conCu && !/(?<![\p{L}])(la|în|pe) \p{L}+(ul|le|ua|a)(?![\p{L}])/u.test(x.mala)) v.push(`${id}: la mala no lleva el artículo que el punto quita`);
    }
  }
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió y esto no es verde');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w)))) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  return v;
}

if (process.argv[1]?.includes('corr-ro-a1b')) {
  const v = verificar(ITEMS);
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección RO-A1b — ${ITEMS.length} ítems\n`);
  for (const [p, n] of porPunto) console.log(`- \`${p}\`: ${n}`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ✗ ${x.mala}\n    ✓ ${x.buena}${x.alt?.length ? `  (alt: ${x.alt.join(' / ')})` : ''}\n    ← ${x.calcoEs}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

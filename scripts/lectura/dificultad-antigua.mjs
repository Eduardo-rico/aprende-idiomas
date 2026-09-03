// Graduación por peldaño para LENGUAS ANTIGUAS — el instrumento de la
// escalera del latín y del griego.
//
//   node scripts/lectura/dificultad-antigua.mjs --lang la
//   node scripts/lectura/dificultad-antigua.mjs --lang grc
//   node scripts/lectura/dificultad-antigua.mjs --lang la --todo   # + las obras extra
//
// ── POR QUÉ NO SE PORTA `medir-nivel.mjs` ────────────────────────────
//
// El instrumento de la biblioteca es la DENSIDAD POLISILÁBICA (% de
// palabras de tres o más sílabas), y separa el portugués narrativo del
// culto porque allí la palabra larga ES la palabra culta. En latín no:
// `dīvīsa`, `amāvērunt`, `incolunt` son palabras corrientes del texto más
// fácil del canon. El latín es polisilábico por FLEXIÓN, no por
// registro, así que la densidad no distingue a César de Tácito — y
// César es mucho más fácil.
//
// ── LO QUE SÍ MIDE, y el criterio escrito ANTES de mirar un número ────
//
// El criterio de peldaño (docs/plans/2026-09-03-la-grc-paso0.md §1.1) es
// «un sistema gramatical que hay que tener automatizado para leer el
// peldaño siguiente». Los cuatro ejes que lo operacionalizan:
//
//   1. `palabrasFrase`   — longitud media del período. Es el eje que el
//      proyecto descartó A PROPÓSITO para el portugués (el diálogo acorta
//      la frase sin facilitar el texto) y que aquí es central, porque la
//      historiografía y la oratoria no tienen diálogo.
//   2. `subordFrase`     — cláusulas subordinadas por frase (advcl, acl,
//      ccomp, xcomp, csubj). El período ciceroniano contra la parataxis
//      de César.
//   3. `arcoAdj`         — distancia media del arco `amod` entre adjetivo
//      y núcleo: el HIPÉRBATON cuantificado. Es lo que separa verso de
//      prosa sin discutir de gustos, y es el mismo rasgo que la columna
//      `ordenEnganya` del inventario mide punto a punto.
//   4. `fueraTop1000`    — % de palabras cuyo lema NO está entre los
//      1.000 más frecuentes de la lengua. César repite un léxico militar
//      pequeño; Tácito no repite nada.
//
// Y uno más, informativo, que no entra en el veredicto: `subj`, el
// porcentaje de verbos finitos en subjuntivo — la morfología cara.
//
// ── EL GATE, Y ES LO ÚNICO QUE HACE QUE ESTO VALGA ───────────────────
//
// El orden esperado de las anclas está ESCRITO EN ESTE FICHERO, antes de
// que el script se haya corrido nunca. Si el instrumento no lo
// reproduce, **el que está mal es el instrumento**, no los autores, y
// el script sale con código 1. Es el mismo contrato que `medir-nivel.mjs`
// cumplió para el portugués: reprodujo el ancla A Aia (22,6 medido contra
// 22,7 publicado) y conservó el orden de las tres.
//
// ── EL CONFUNDIDO QUE HAY QUE DECIR ──────────────────────────────────
//
// PROIEL y Perseus son DOS proyectos de anotación distintos, con
// convenciones distintas. Comparar un arco de dependencia entre
// treebanks puede estar comparando estilos de anotación y no textos.
// Por eso el script mide el PUENTE: Cicerón está en los dos treebanks
// latinos y Heródoto en los dos griegos, así que el desplazamiento entre
// proyectos se puede estimar en vez de suponerse nulo. Se imprime
// siempre, y si es grande el veredicto entre treebanks no vale.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const valor = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const LANG = valor('--lang', 'la');
const TODO = args.includes('--todo');
const CACHE = path.join(process.cwd(), 'scripts/.cache/treebanks');

// ── Las obras, con su rótulo VERIFICADO ──────────────────────────────
//
// Los ficheros de Perseus identifican la obra con un id canónico
// (`phi0972.phi001`), no con su nombre. Adivinar el número es una forma
// barata de rotular mal un corpus entero: `phi0972` PARECE Propercio por
// la vecindad de los números y es PETRONIO. Cada rótulo de aquí se
// comprobó leyendo la primera frase del texto —«Amicimur ergo diligenter
// … et Gitona», que es el Satiricón— y no por el número.
const OBRAS = {
  la: {
    proiel: {
      "Jerome's Vulgate": { autor: 'Jerónimo', obra: 'Vulgata', peldano: 'L1' },
      'Commentarii belli Gallici': { autor: 'César', obra: 'De bello Gallico', peldano: 'L2' },
      'De officiis': { autor: 'Cicerón', obra: 'De officiis', peldano: 'L3' },
      'Epistulae ad Atticum': { autor: 'Cicerón', obra: 'Ad Atticum', peldano: 'L3', extra: true },
      'Opus agriculturae': { autor: 'Paladio', obra: 'Opus agriculturae', extra: true },
    },
    perseus: {
      'phi0474.phi013': { autor: 'Cicerón', obra: 'In Catilinam', peldano: 'L3' },
      'phi0690.phi003': { autor: 'Virgilio', obra: 'Eneida', peldano: 'L4' },
      'phi1351.phi005': { autor: 'Tácito', obra: 'Historiae', peldano: 'L5' },
      'phi0959.phi006': { autor: 'Ovidio', obra: 'Metamorfosis', peldano: 'L4', extra: true },
      'phi0631.phi001': { autor: 'Salustio', obra: 'Bellum Catilinae', extra: true },
      'phi1348.abo012': { autor: 'Suetonio', obra: 'Divus Augustus', extra: true },
      'phi0975.phi001': { autor: 'Fedro', obra: 'Fabulae', extra: true },
      'phi0972.phi001': { autor: 'Petronio', obra: 'Satyricon', extra: true },
      'phi0620.phi001': { autor: 'Propercio', obra: 'Elegías', extra: true },
      'phi1221.phi007': { autor: 'Augusto', obra: 'Res gestae', extra: true },
      'tlg0031.tlg027': { autor: 'Jerónimo', obra: 'Vulgata (Apocalipsis)', extra: true },
      // AUTOCORRECCIÓN (misma sesión): esta entrada estaba EXCLUIDA porque
      // el README de UD_Latin-Perseus no la lista entre sus once obras, y
      // escribí que «no hay rótulo que verificar». Era un mal motivo: el
      // método declarado de este fichero es verificar el rótulo LEYENDO el
      // texto, no consultando una lista. Leído, es César sin duda —
      // «Bellovacorum», «Haedui», «Q Titurium Sabinum legatum», «ab
      // Iccio»: Bellum Gallicum libro 2. Entra, y con sus 24 frases a la
      // vista, porque es el ÚNICO modo de comparar César y Cicerón dentro
      // de un mismo treebank.
      'phi0448.phi001': { autor: 'César', obra: 'De bello Gallico (Perseus)', peldano: 'L2', extra: true },
    },
  },
  grc: {
    proiel: {
      'The Greek New Testament': { autor: 'NT', obra: 'Nuevo Testamento', peldano: 'G1' },
      Histories: { autor: 'Heródoto', obra: 'Historias', peldano: 'G3' },
    },
    perseus: {
      'tlg0016.tlg001': { autor: 'Heródoto', obra: 'Historias', peldano: 'G3' },
      'tlg0003.tlg001': { autor: 'Tucídides', obra: 'Guerra del Peloponeso', peldano: 'G4' },
      'tlg0012.tlg001': { autor: 'Homero', obra: 'Ilíada', peldano: 'G5' },
      'tlg0011.tlg004': { autor: 'Sófocles', obra: 'Edipo Rey', peldano: 'G4', extra: true },
      'tlg0011.tlg002': { autor: 'Sófocles', obra: 'Antígona', peldano: 'G4', extra: true },
      'tlg0085.tlg001': { autor: 'Esquilo', obra: 'Suplicantes', peldano: 'G5', extra: true },
      'tlg0020.tlg001': { autor: 'Hesíodo', obra: 'Teogonía', extra: true },
      'tlg0007.tlg015': { autor: 'Plutarco', obra: 'Alcibíades', extra: true },
      'tlg0060.tlg001': { autor: 'Diodoro', obra: 'Biblioteca histórica', extra: true },
      'tlg0008.tlg001': { autor: 'Ateneo', obra: 'Deipnosofistas', extra: true },
    },
  },
};

// ── EL ORDEN ESPERADO, escrito antes de medir ────────────────────────
//
// Sale de `docs/plans/2026-09-03-la-grc-paso0.md` §1.2, donde se declaró
// como HIPÓTESIS junto al criterio. Si la medición lo rompe, el
// documento se corrige; lo que no se hace es cambiar el orden después de
// ver los números.
//
// Dos anclas griegas del documento NO se pueden probar y se dice por qué:
// la Anábasis de Jenofonte y la Apología de Platón no están en ninguno de
// los dos treebanks griegos. El Nuevo Testamento las sustituye como
// ancla baja, y es la misma que el peldaño G1 declara.
const ESPERADO = {
  la: ['Vulgata', 'De bello Gallico', 'In Catilinam', 'Eneida', 'Historiae'],
  grc: ['Nuevo Testamento', 'Historias', 'Guerra del Peloponeso', 'Ilíada'],
};

// ── QUÉ EJE GOBIERNA CADA SALTO, y por qué esto no es mover la portería ─
//
// La primera versión del gate exigía que UNA métrica reprodujera el orden
// ENTERO. Eso presupone que la escalera es monótona en un solo eje, y la
// escalera nunca dijo eso: §1.3 y §1.4 del Paso 0 definen cada peldaño
// por SU sistema —«el período y la oratio obliqua» en L3, «orden poético»
// en L4, «verso y dialecto» en G5—, y sistemas distintos se miden con
// ejes distintos.
//
// Lo que lo destapó fue una medición que parecía un absurdo: **la Ilíada
// mide 11,6 palabras por frase y el Nuevo Testamento 11,5**, o sea Homero
// sintácticamente más simple que los Evangelios. Supuse un artefacto —que
// Perseus segmentara la Ilíada por versos— y fui a comprobarlo antes de
// tocar nada. **Era falso**: las frases de la Ilíada son sintácticas y
// abarcan varios versos. El dato es bueno y dice algo verdadero y
// conocido: la dicción homérica es PARATÁCTICA, y su dificultad no es la
// sintaxis sino el dialecto y el léxico — que es exactamente lo que el
// peldaño G5 declara y lo que el eje léxico mide (Ilíada 26,4 % fuera del
// top1000 contra 20,0 de Tucídides).
//
// Así que el eje de cada salto sale de la definición del peldaño, que se
// escribió ANTES de medir. Lo que cambia después de ver los números es el
// GATE, no la escalera, y se dice.
const EJE_DEL_SALTO = {
  la: {
    'Vulgata→De bello Gallico': ['fueraTop1000'],
    'De bello Gallico→In Catilinam': ['palabrasFrase', 'subordFrase'],
    // Misma pareja, dentro de Perseus, con las 24 frases de César que hay
    // allí. Se declara COMO SALTO APARTE en vez de sustituir el ancla en
    // silencio, que es lo que salió mal con las cartas de Cicerón.
    'De bello Gallico (Perseus)→In Catilinam': ['palabrasFrase', 'subordFrase'],
    'In Catilinam→Eneida': ['arcoAdj', 'fueraTop1000'],
    'Eneida→Historiae': ['fueraTop1000'],
  },
  grc: {
    'Nuevo Testamento→Historias': ['fueraTop1000', 'palabrasFrase'],
    'Historias→Guerra del Peloponeso': ['palabrasFrase', 'subordFrase'],
    'Guerra del Peloponeso→Ilíada': ['fueraTop1000'],
  },
};

// ── LOS PUENTES, ordenados por calidad ───────────────────────────────
//
// Un puente estima cuánto de la diferencia entre dos treebanks es
// ANOTACIÓN y no lengua. Pero no todos valen lo mismo, y la primera
// versión usó el peor sin darse cuenta:
//
//   · MISMA OBRA en los dos proyectos → el puente limpio. Todo lo que
//     difiera es anotación, punto.
//   · mismo autor, obras distintas → mezcla anotación con REGISTRO.
//   · mismo texto, libros distintos → mezcla anotación con el libro.
//
// Medido en latín, y la diferencia entre puentes es grande:
//   Cicerón (De officiis vs In Catilinam, obras distintas): 44 % · 72 % · 11 %
//   Jerónimo (Evangelios vs Apocalipsis, libros distintos): 25 % · 14 % · 33 %
//   César   (Bellum Gallicum vs Bellum Gallicum, MISMA OBRA): ver abajo
//
// El de César es el bueno, y sólo existe porque se rescataron las 24
// frases de `phi0448` que yo mismo había excluido por no venir en el
// README. El script usa el de mejor calidad disponible y los imprime
// todos, porque que dos puentes discrepen ES un dato.
const PUENTES = {
  la: [
    { autor: 'César', calidad: 'MISMA OBRA' },
    { autor: 'Jerónimo', calidad: 'mismo texto, libros distintos' },
    { autor: 'Cicerón', calidad: 'mismo autor, obras distintas' },
  ],
  grc: [{ autor: 'Heródoto', calidad: 'MISMA OBRA' }],
};

/** Parejas que NO están en la cadena declarada pero conviene medir, cada
 *  una con su motivo. Se imprimen aparte y NO cambian el veredicto: la
 *  cadena de anclas es una decisión declarada y no se toca con lo que
 *  salga aquí. */
const COMPROBACIONES_EXTRA = {
  la: [
    ['De bello Gallico (Perseus)', 'In Catilinam', ['palabrasFrase', 'subordFrase'],
     'el mismo salto L2→L3 DENTRO de Perseus, con las 24 frases de César que hay allí'],
    ['Eneida (ampliada)', 'Historiae (ampliada)', ['fueraTop1000Formas'],
     'L4→L5 con la muestra ampliada desde Wikisource: 30.759 y 52.249 formas frente a 645 y 745'],
    ['Eneida', 'Eneida (ampliada)', ['fueraTop1000Formas'],
     'control: la MISMA obra medida en el treebank y ampliada. Si difieren mucho, la ampliación no es comparable'],
    ['Historiae', 'Historiae (ampliada)', ['fueraTop1000Formas'],
     'control: ídem para Tácito'],
    // Los otros dos representantes que L5 declara y que ningún treebank
    // trae. El criterio de lectura lo fijó el coordinador ANTES de esta
    // corrida (Paso 0 §1.8): si Horacio o Plauto superan a Virgilio con
    // IC disjuntos, el ancla era el problema y L5 se queda; si los tres
    // quedan por debajo o indistinguibles, el salto no es léxico; y si
    // sale un tercer patrón, se para y se consulta.
    ['Eneida (ampliada)', 'Carmina (ampliada)', ['fueraTop1000Formas'],
     'L5 con su segundo representante declarado: Horacio, Odas'],
    ['Eneida (ampliada)', 'Comedias (ampliada)', ['fueraTop1000Formas'],
     'L5 con su tercer representante declarado: Plauto, comedias'],
    ['Historiae (ampliada)', 'Carmina (ampliada)', ['fueraTop1000Formas'],
     'los dos representantes de L5 entre sí'],
    ['Eneida', 'Historiae', ['palabrasFrase', 'subordFrase', 'arcoAdj'],
     'L4→L5 por el eje SINTÁCTICO, dentro de Perseus (sin puente de por medio): la «brevitas» de Tácito es una propiedad de la sintaxis, no del léxico'],
  ],
  grc: [],
};

const SUBORD = new Set(['advcl', 'acl', 'ccomp', 'xcomp', 'csubj']);

/** Lee un .conllu por líneas y devuelve las frases con sus tokens. */
function* frases(file) {
  let toks = [];
  let meta = {};
  for (const linea of fs.readFileSync(file, 'utf8').split('\n')) {
    if (linea.startsWith('#')) {
      const m = linea.match(/^#\s*(\w+)\s*=\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
      continue;
    }
    if (linea.trim() === '') {
      if (toks.length) yield { toks, meta };
      toks = []; meta = {};
      continue;
    }
    const c = linea.split('\t');
    if (c.length < 8) continue;
    if (!/^\d+$/.test(c[0])) continue;   // rangos «1-2» y vacíos «1.1»
    toks.push({ id: +c[0], forma: c[1], lema: c[2], upos: c[3], rasgos: c[5], head: +c[6], rel: c[7].split(':')[0] });
  }
  if (toks.length) yield { toks, meta };
}

/** La clave de obra de una frase: PROIEL la trae en `# source`, Perseus
 *  en el id canónico del `# sent_id`. */
function claveObra(meta, proyecto) {
  if (proyecto === 'proiel') return (meta.source ?? '').split(',')[0].trim();
  const sid = meta.sent_id ?? '';
  const m = sid.match(/^((?:phi|tlg)\d+\.(?:phi|tlg|abo)\d+)/);
  return m ? m[1] : '';
}

function acumular(lang) {
  const acc = new Map();          // clave → contadores
  const lemas = new Map();        // lema → frecuencia global de la lengua
  const formasGlob = new Map();   // FORMA canónica → frecuencia global
  for (const proyecto of ['proiel', 'perseus']) {
    const tabla = OBRAS[lang][proyecto];
    for (const parte of ['train', 'dev', 'test']) {
      const f = path.join(CACHE, `${lang}_${proyecto}-ud-${parte}.conllu`);
      if (!fs.existsSync(f)) continue;
      for (const { toks, meta } of frases(f)) {
        const clave = claveObra(meta, proyecto);
        const info = tabla[clave];
        if (!info) continue;
        const id = `${proyecto}:${info.obra}`;
        if (!acc.has(id)) acc.set(id, { ...info, proyecto, frases: 0, palabras: 0, subord: 0, amod: 0, amodDist: 0, finitos: 0, subj: 0, lemas: new Map(), formas: new Map(), distancias: [], fueraTok: [], fueraForma: [], largos: [], subords: [] });
        const a = acc.get(id);
        const porId = new Map(toks.map((t) => [t.id, t]));
        const palabras = toks.filter((t) => t.upos !== 'PUNCT');
        a.frases += 1;
        a.palabras += palabras.length;
        a.largos.push(palabras.length);
        let subEsta = 0;
        for (const t of palabras) {
          lemas.set(t.lema, (lemas.get(t.lema) ?? 0) + 1);
          a.lemas.set(t.lema, (a.lemas.get(t.lema) ?? 0) + 1);
          const fm = canonicalLa(t.forma);
          formasGlob.set(fm, (formasGlob.get(fm) ?? 0) + 1);
          a.formas.set(fm, (a.formas.get(fm) ?? 0) + 1);
          if (SUBORD.has(t.rel)) { a.subord += 1; subEsta += 1; }
          if (t.rel === 'amod' && porId.has(t.head)) { a.amod += 1; const d = Math.abs(t.id - t.head); a.amodDist += d; a.distancias.push(d); }
          if (/VerbForm=Fin/.test(t.rasgos)) { a.finitos += 1; if (/Mood=Sub/.test(t.rasgos)) a.subj += 1; }
        }
        a.subords.push(subEsta);
      }
    }
  }
  return { acc, lemas, formasGlob };
}

function medir(lang) {
  const { acc, lemas, formasGlob } = acumular(lang);
  // NOTA DE ORDEN: `top1000f` sale de `formasGlob`, que sólo acumula los
  // TREEBANKS — las ampliadas se añaden a `acc` después y no entran en la
  // lista de referencia. Si entraran, una obra ampliada se estaría
  // midiendo en parte contra sí misma: 52.000 palabras de Tácito moverían
  // el top-1000 hacia Tácito y bajarían su propio «% fuera».
  if (acc.size === 0) throw new Error(`sin datos para ${lang}: ¿están los .conllu en ${CACHE}?`);
  const top1000 = new Set([...lemas.entries()].sort((a, b) => b[1] - a[1]).slice(0, 1000).map(([l]) => l));
  const top1000f = new Set([...formasGlob.entries()].sort((a, b) => b[1] - a[1]).slice(0, 1000).map(([l]) => l));

  // ── Anclas AMPLIADAS con texto de Wikisource ──
  //
  // Las trae `traer-anclas-antiguas.mjs` y entran con `proyecto:
  // 'wikisource'` bien a la vista, porque NO son datos del treebank: no
  // llevan lema, ni análisis sintáctico, ni por tanto ninguna de las
  // otras tres métricas. Sólo el eje léxico POR FORMAS, y contra la misma
  // lista top-1000 que todas las demás obras — que es lo que las hace
  // comparables.
  const extraFile = path.join(CACHE, `extra-${lang}.json`);
  const ampliadas = fs.existsSync(extraFile) ? JSON.parse(fs.readFileSync(extraFile, 'utf8')) : [];
  for (const e of ampliadas) {
    const formas = new Map(Object.entries(e.cuenta).map(([k, v]) => [canonicalLa(k), v]));
    acc.set(`wikisource:${e.obra}`, {
      autor: e.autor, obra: `${e.obra} (ampliada)`, peldano: e.peldano, extra: true, proyecto: 'wikisource',
      frases: 0, palabras: e.total, subord: 0, amod: 0, amodDist: 0, finitos: 0, subj: 0,
      lemas: new Map(), formas, distancias: [], fueraTok: [], fueraForma: [], largos: [], subords: [],
    });
  }

  const filas = [...acc.values()].map((a) => {
    let fuera = 0, total = 0;
    const muestraFuera = [];
    for (const [lema, n] of a.lemas) {
      total += n;
      const esFuera = top1000.has(lema) ? 0 : 1;
      if (esFuera) fuera += n;
      for (let i = 0; i < n; i++) muestraFuera.push(100 * esFuera);
    }
    a.fueraTok = muestraFuera;
    let fueraF = 0, totalF = 0;
    const muestraF = [];
    for (const [forma, n] of a.formas) {
      totalF += n;
      const es = top1000f.has(forma) ? 0 : 1;
      if (es) fueraF += n;
      for (let i = 0; i < n; i++) muestraF.push(100 * es);
    }
    a.fueraForma = muestraF;
    return {
      fueraTop1000Formas: (100 * fueraF) / totalF,
      ...a,
      palabrasFrase: a.frases ? a.palabras / a.frases : NaN,
      subordFrase: a.frases ? a.subord / a.frases : NaN,
      arcoAdj: a.amod ? a.amodDist / a.amod : NaN,
      fueraTop1000: (100 * fuera) / total,
      subjPct: a.finitos ? (100 * a.subj) / a.finitos : NaN,
    };
  });
  return { filas, denominadorLemas: lemas.size };
}

// Cada métrica declara DE DÓNDE sale su muestra para el bootstrap. La
// primera versión lo elegía con `k === 'arcoAdj' ? 'distancias' :
// 'fueraTok'`, y por tanto daba a `palabras/frase` y a `subord/frase` el
// IC del LÉXICO: ni error, ni cero — el número de al lado, perfectamente
// creíble. En latín no se vio porque esas dos iban descalificadas por el
// puente; salió en griego, donde la descalificada es otra, y llegó a
// producir un veredicto de REFUTADO que era falso.
const METRICAS = [
  ['palabrasFrase', 'palabras/frase', 1, 'largos'],
  ['subordFrase', 'subord/frase', 2, 'subords'],
  ['arcoAdj', 'arco amod', 2, 'distancias'],
  ['fueraTop1000', '% fuera top1000', 1, 'fueraTok'],
  // El MISMO eje léxico calculado sobre FORMAS canónicas en vez de lemas.
  // Existe para poder ampliar un ancla con texto de Wikisource, que no
  // viene lematizado. Se VALIDA contra la versión por lemas sobre las
  // mismas obras: si no reproduce su orden, no sirve y no se usa.
  ['fueraTop1000Formas', '% fuera top1000 (formas)', 1, 'fueraForma'],
];

/** La canonicalización del latín que el Paso 0 §3.1 decidió, en su primer
 *  uso real: NFC, minúsculas y el mácrón FUERA. Los treebanks no traen
 *  mácrons (medido: 0 de 227.301 tokens) y Wikisource sí en las piezas
 *  macronizadas, así que sin esto `Rōma` y `Roma` serían dos formas
 *  distintas y la cuenta léxica saldría inflada justo en las obras que se
 *  quiere ampliar. */
function canonicalLa(s) {
  return s.normalize('NFD').replace(/\u0304/g, '').normalize('NFC').toLowerCase();
}

/** Desplazamiento máximo del PUENTE que se le tolera a una métrica para
 *  que pueda arbitrar ENTRE treebanks.
 *
 *  El umbral se fijó DESPUÉS de ver el puente, y hay que decirlo. Lo que
 *  lo hace defendible es que no está haciendo el trabajo: los cuatro
 *  desplazamientos medidos en latín son 44 %, 72 %, 11 % y 5 %, así que
 *  CUALQUIER umbral entre 12 % y 43 % descalifica exactamente a las dos
 *  mismas métricas. La elección de 20 % no cambia el veredicto.
 *
 *  Y el argumento, que es el que vale: una métrica que difiere un 44 %
 *  sobre el MISMO AUTOR entre dos proyectos de anotación no puede
 *  resolver diferencias entre autores más pequeñas que eso. Lo que está
 *  midiendo ahí es la convención de segmentación, no la lengua. */
const PUENTE_MAX = 20;

/** Intervalo del 95 % por bootstrap sobre la muestra. Existe porque la
 *  Eneida tiene 68 frases y las Historiae 64, y una diferencia de 2,10
 *  contra 1,91 con esas muestras puede ser ruido. Un número sin su
 *  incertidumbre, con n pequeño, es la forma más barata de creerse una
 *  inversión que no existe. */
// PRNG con semilla FIJA, y no `Math.random`. La regla del proyecto es
// que la cifra reportada es la salida pegada, y un IC que cambia en la
// tercera cifra entre corridas no se puede pegar en un commit ni
// reproducir seis meses después.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ic95(muestra, reps = 2000) {
  if (muestra.length === 0) return [NaN, NaN];
  const rnd = mulberry32(20260903);
  const medias = [];
  for (let r = 0; r < reps; r++) {
    let s = 0;
    for (let i = 0; i < muestra.length; i++) s += muestra[(rnd() * muestra.length) | 0];
    medias.push(s / muestra.length);
  }
  medias.sort((a, b) => a - b);
  return [medias[Math.floor(0.025 * reps)], medias[Math.floor(0.975 * reps)]];
}

function main() {
  if (!OBRAS[LANG]) throw new Error(`--lang ${LANG}: sólo «la» y «grc»`);
  const { filas, denominadorLemas } = medir(LANG);
  const anclas = ESPERADO[LANG];

  const vistas = filas.filter((f) => TODO || !f.extra || anclas.includes(f.obra));
  vistas.sort((a, b) => a.palabrasFrase - b.palabrasFrase);

  console.log(`\n${LANG === 'la' ? 'LATÍN' : 'GRIEGO ANTIGUO'} — dificultad medida sobre treebanks UD`);
  console.log(`denominador: ${filas.length} obras · ${filas.reduce((n, f) => n + f.frases, 0).toLocaleString('es')} frases · ` +
    `${filas.reduce((n, f) => n + f.palabras, 0).toLocaleString('es')} palabras · ${denominadorLemas.toLocaleString('es')} lemas distintos\n`);

  const cab = ['obra', 'autor', 'pel', 'proy', 'frases', ...METRICAS.map((m) => m[1]), '% subj'];
  const anchos = [26, 11, 4, 8, 7, 14, 12, 10, 15, 7];
  const linea = (celdas) => celdas.map((c, i) => String(c).padEnd(anchos[i])).join(' ');
  console.log(linea(cab));
  console.log(anchos.map((a) => '─'.repeat(a)).join(' '));
  for (const f of vistas) {
    console.log(linea([
      f.obra.slice(0, 26), f.autor, f.peldano ?? '—', f.proyecto, f.frases,
      ...METRICAS.map(([k, , d]) => f[k].toFixed(d)),
      Number.isNaN(f.subjPct) ? '—' : f.subjPct.toFixed(1),
    ]));
  }

  // ── El puente entre proyectos de anotación ──
  const desplazamiento = {};
  console.log(`\nPUENTES entre proyectos de anotación (sobre el MISMO autor). El desplazamiento que midan es anotación, no lengua:`);
  let puente = null, calidadPuente = null;
  for (const { autor, calidad } of PUENTES[LANG]) {
    const f = filas.filter((x) => x.autor === autor);
    if (new Set(f.map((x) => x.proyecto)).size < 2) { console.log(`  ${autor} (${calidad}): sólo en un treebank, no sirve de puente`); continue; }
    const linea = METRICAS.map(([k, nombre, d]) => {
      const por = Object.fromEntries(f.map((x) => [x.proyecto, x[k]]));
      const rel = (100 * Math.abs(por.proiel - por.perseus)) / ((por.proiel + por.perseus) / 2);
      return `${nombre} ${rel.toFixed(0)} %`;
    }).join(' · ');
    console.log(`  ${autor.padEnd(10)} (${calidad}): ${linea}`);
    if (!puente) { puente = f; calidadPuente = `${autor} — ${calidad}`; }
  }
  if (puente) {
    for (const [k] of METRICAS) {
      const por = Object.fromEntries(puente.map((x) => [x.proyecto, x[k]]));
      desplazamiento[k] = (100 * Math.abs(por.proiel - por.perseus)) / ((por.proiel + por.perseus) / 2);
    }
    console.log(`  ⇒ se usa el de mejor calidad: ${calidadPuente}`);
  } else {
    console.log('  ⚠ ningún puente disponible: el desplazamiento NO se puede estimar y nada se descalifica por él.');
  }
  // ── EL GATE, salto a salto y por el eje que cada peldaño declara ──
  console.log(`\nORDEN DECLARADO (antes de medir): ${anclas.join(' < ')}`);
  const porObra = new Map();
  for (const f of filas) {
    // Si una obra está en los dos treebanks se guardan las dos entradas.
    if (!porObra.has(f.obra)) porObra.set(f.obra, []);
    porObra.get(f.obra).push(f);
  }
  const faltan = anclas.filter((a) => !porObra.has(a));
  if (faltan.length) throw new Error(`anclas sin datos: ${faltan.join(', ')}`);

  const muestraDe = Object.fromEntries(METRICAS.map(([k, , , campo]) => [k, campo]));
  const decimales = Object.fromEntries(METRICAS.map(([k, , d]) => [k, d]));
  const nombreDe = Object.fromEntries(METRICAS.map(([k, n]) => [k, n]));

  /** Elige la pareja de entradas a comparar. Si la obra está en los dos
   *  treebanks, prefiere la que comparte proyecto con la otra: comparar
   *  DENTRO de un treebank esquiva el confundido de anotación por
   *  completo, y entonces el puente no descalifica nada. */
  /** Elige la pareja a comparar. Si la obra está en los DOS treebanks,
   *  prefiere la que comparte proyecto con la otra: comparar dentro de un
   *  treebank esquiva el confundido de anotación y el puente deja de
   *  aplicar.
   *
   *  Lo que NO hace, y es deliberado: sustituir el ancla por otra obra del
   *  mismo autor. Lo intenté y salió mal de una manera instructiva — la
   *  regla elegía por tamaño de muestra y para el salto César→Cicerón
   *  metió las «Epistulae ad Atticum» (3.608 frases) en lugar de «In
   *  Catilinam». Las CARTAS de Cicerón son su registro más coloquial
   *  (11,7 palabras por frase frente a 18,4 del «De officiis»), así que la
   *  comparación pasó a ser correspondencia privada contra historiografía
   *  publicada, y produjo un REFUTADO que no era sobre la escalera sino
   *  sobre el registro. Un ancla es una elección declarada; cambiarla con
   *  un algoritmo que optimiza `n` cambia en silencio lo que se mide. */
  function emparejar(a, b) {
    const A = porObra.get(a), B = porObra.get(b);
    for (const x of A) for (const y of B) if (x.proyecto === y.proyecto) return [x, y, true];
    return [A[0], B[0], false];
  }

  function juzgar(x, y, k) {
    const mx = x[muestraDe[k]] ?? [], my = y[muestraDe[k]] ?? [];
    for (const [f, m] of [[x, mx], [y, my]]) {
      const media = m.reduce((p, q) => p + q, 0) / (m.length || 1);
      if (Math.abs(media - f[k]) > 0.02 * Math.max(1, Math.abs(f[k]))) {
        throw new Error(`IC incoherente en ${nombreDe[k]}/${f.obra}: la muestra promedia ${media.toFixed(3)} y la métrica dice ${f[k].toFixed(3)}`);
      }
    }
    const [alo, ahi] = ic95(mx), [blo, bhi] = ic95(my);
    const solapan = ahi >= blo && bhi >= alo;
    return {
      estado: solapan ? 'INDISTINGUIBLE' : y[k] > x[k] ? 'ORDENADO' : 'INVERTIDO',
      txt: `${x[k].toFixed(decimales[k])} [${alo.toFixed(decimales[k])}, ${ahi.toFixed(decimales[k])}] n=${mx.length}  →  ` +
           `${y[k].toFixed(decimales[k])} [${blo.toFixed(decimales[k])}, ${bhi.toFixed(decimales[k])}] n=${my.length}`,
    };
  }

  console.log('\nSALTO A SALTO, por el eje que el peldaño declara (IC 95 % bootstrap):');
  const refutados = [], flojos = [];
  for (let i = 1; i < anclas.length; i++) {
    const a = anclas[i - 1], b = anclas[i];
    const ejes = EJE_DEL_SALTO[LANG][`${a}→${b}`];
    if (!ejes) throw new Error(`el salto ${a}→${b} no declara eje en EJE_DEL_SALTO`);
    const [x, y, mismoProy] = emparejar(a, b);
    console.log(`\n  ${a} → ${b}   [${mismoProy ? `dentro de ${x.proyecto}` : `${x.proyecto} vs ${y.proyecto}`}]`);
    let confirmado = false, refutado = false, arbitrado = false;
    for (const k of ejes) {
      // El puente sólo importa si la comparación CRUZA proyectos.
      if (!mismoProy && desplazamiento[k] !== undefined && desplazamiento[k] > PUENTE_MAX) {
        console.log(`      · ${nombreDe[k].padEnd(16)} no arbitra: cruza treebanks y el puente se mueve ${desplazamiento[k].toFixed(0)} %`);
        continue;
      }
      const v = juzgar(x, y, k);
      arbitrado = true;
      confirmado = confirmado || v.estado === 'ORDENADO';
      refutado = refutado || v.estado === 'INVERTIDO';
      const marca = v.estado === 'ORDENADO' ? '✔' : v.estado === 'INDISTINGUIBLE' ? '~' : '✘';
      console.log(`      ${marca} ${nombreDe[k].padEnd(16)} ${v.txt}   ${v.estado}`);
    }
    if (refutado) { refutados.push(`${a} → ${b}`); console.log('      ⇒ REFUTADO'); }
    else if (confirmado) console.log('      ⇒ CONFIRMADO');
    else { flojos.push(`${a} → ${b}${arbitrado ? '' : ' (sin árbitro: eje descalificado y anclas en treebanks distintos)'}`); console.log(`      ⇒ NO SEPARABLE con esta muestra`); }
  }

  // ── Comprobaciones declaradas APARTE de la cadena ──
  const extras = COMPROBACIONES_EXTRA[LANG] ?? [];
  if (extras.length) {
    console.log('\nCOMPROBACIONES EXTRA (no cambian el veredicto: la cadena de anclas es una decisión declarada):');
    for (const [a, b, ejes, motivo] of extras) {
      if (!porObra.has(a) || !porObra.has(b)) { console.log(`  ${a} → ${b}: sin datos`); continue; }
      const [x, y, mismoProy] = emparejar(a, b);
      console.log(`\n  ${a} → ${b}   [${mismoProy ? `dentro de ${x.proyecto}` : `${x.proyecto} vs ${y.proyecto}`}]  — ${motivo}`);
      for (const k of ejes) {
        const v = juzgar(x, y, k);
        const marca = v.estado === 'ORDENADO' ? '✔' : v.estado === 'INDISTINGUIBLE' ? '~' : '✘';
        console.log(`      ${marca} ${nombreDe[k].padEnd(16)} ${v.txt}   ${v.estado}`);
      }
    }
  }

  if (refutados.length) {
    console.log(`\n✖ REFUTADO en ${refutados.length} salto(s), con los IC disjuntos y por el eje que el propio peldaño declara:`);
    for (const r of refutados) console.log(`    ${r}`);
    console.log('  La escalera está mal ahí. Se corrige con la evidencia; no se sigue.');
    process.exit(1);
  }
  console.log(`\n✔ Ningún salto refutado. Confirmados ${anclas.length - 1 - flojos.length} de ${anclas.length - 1}.`);
  if (flojos.length) {
    console.log('~ Sin separar todavía (es una petición de más texto, no una inversión):');
    for (const f of flojos) console.log(`    ${f}`);
  }
}

main();

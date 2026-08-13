// scripts/lib/triage-inerte.ts
//
// La regla de la Ola V, versión 2 — la v1 NO se aplicó: dos lingüistas
// adversariales independientes la atacaron y ambos demostraron sobre el
// corpus real que habría consagrado brasileñismos («Eles a conhecem
// bem», «vais a poupar reais», vestibular ×6, precisar+infinitivo ×13,
// campos multiple_choice/matching sin escanear). Informes del
// 2026-07-29; diseño en docs/plans/2026-07-29-ola-v-triage-variante.md.
//
// Tres destinos:
//   'needs-human' — la base es demostrablemente no-europea: marcador
//                   ERROR en un campo NO didáctico y sin contraste
//                   implícito.
//   'neutral'     — variante-inerte: ninguna clase de divergencia
//                   conocida. Sellado `regla-inerte-v2`: significa «una
//                   regla determinista no encontró material divergente»,
//                   NO «un nativo lo verificó». Los sellados PERMANECEN
//                   en la cola del nativo, detrás de los unchecked: el
//                   sello ordena el trabajo, no lo cancela.
//   'unchecked'   — material de riesgo que una regla de superficie no
//                   juzga. Primera prioridad del nativo.
import {
  revisarEjercicio,
  textoPortugues,
  exento,
  contrasteImplicito,
  CAMPOS_DIDACTICOS,
  type Ex,
} from './variant-guard';

export const SELLO = 'regla-inerte-v3 (2026-08-13)';

// ── Lista blanca nasal ──
// `[êô]` ante m/n sugiere grafía BR (gênio, econômico, Antônio), PERO:
// el sufijo -ência es idéntico en las dos normas (paciência, agência —
// clase abierta), los cultismos de vocal cerrada se escriben igual en
// Portugal (ênclise, estômago, fêmea…), y ter/vir con TODOS sus
// compuestos llevan -êm europeo (têm, contêm, sobrevêm…). La v1
// retenía `paciência` y hasta `ênclise` por sospechosas — >50% de
// ruido medido por ambos revisores.
const CULTISMOS_INVARIANTES = new Set([
  'ênclise', 'ênclises', 'ênfase', 'ênfases', 'estômago', 'estômagos',
  'fêmea', 'fêmeas', 'cônjuge', 'cônjuges', 'cônsul', 'cônsules',
  'amêndoa', 'amêndoas', 'têmpora', 'têmporas', 'pêndulo', 'pêndulos',
  'côncavo', 'côncava', 'êmbolo', 'êmbolos', 'recôndito', 'recôndita',
  'cômputo', 'cômputos',
]);
function nasalSospechosa(t: string): boolean {
  const tokens = t.toLowerCase().match(/\p{L}*[êô][mn]\p{L}*(?:-\p{L}+)*/giu) ?? [];
  for (const crudo of tokens) {
    const token = crudo.replace(/(-\p{L}+)+$/u, ''); // fuera las ênclises: mantêm-se → mantêm
    if (token.endsWith('ência') || token.endsWith('ências')) continue;
    if (CULTISMOS_INVARIANTES.has(token)) continue;
    if (/\p{L}*[tv]êm$/u.test(token)) continue; // ter/vir y todos sus compuestos
    return true;
  }
  return false;
}

// ── Gerundios ──
// `…ndo` con stoplist: quando/mundo/segundo/lindo/fundo NO son
// gerundios y eran el 60% del cubo (100 de 165 ítems, medido).
const NDO_STOPLIST = new Set([
  'quando', 'mundo', 'mundos', 'segundo', 'segundos', 'fundo', 'fundos',
  'lindo', 'lindos', 'comando', 'comandos', 'bando', 'bandos', 'brando',
  'fernando', 'armando', 'orlando', 'rolando',
]);
function tieneGerundio(t: string): boolean {
  const tokens = t.toLowerCase().match(/\p{L}+ndo(?![\p{L}])/giu) ?? [];
  return tokens.some((tok) => !NDO_STOPLIST.has(tok));
}

// ── 2.ª persona singular de sujeto nulo ──
// «Vais poupar» no lleva `tu` pero NO es neutral (BR: «você vai»).
// Lista cerrada A1-B1 de alta precisión, del revisor 2.
const VERBOS_2SG = b(
  'és|estás|tens|vais|queres|podes|sabes|gostas|falas|moras|trabalhas|' +
  'estudas|precisas|achas|dizes|fazes|vens|dás|vês|lês|ouves|dormes|' +
  'ficas|chegas|sais|pões|conheces|entendes|percebes|escreves|abres|' +
  'comes|bebes|compras|pagas|levas|trazes|pensas|esperas|começas',
);

function b(patron: string): RegExp {
  return new RegExp(`(?<![\\p{L}])(?:${patron})(?![\\p{L}])`, 'iu');
}

/** Riesgos que RETIENEN (ni consagran ni cuarentenan). */
const RIESGOS: Array<{ nombre: string; test: (t: string) => boolean }> = [
  // Colocação: clíticos sueltos, sufijados (incluye mesóclisis y
  // combinados -mo/-to/-lho), y el acusativo o/a/os/as preverbal tras
  // pronombre sujeto («Eles a conhecem» — próclise BR invisible para la
  // v1). `nos` contracción em+os se retiene a propósito: distinguirla
  // es POS-tagging, no regla (12 ítems medidos, precio asumible).
  { nombre: 'clitico',
    test: (t) =>
      /(?<![\p{L}])(me|te|se|lhe|lhes|nos|vos)(?![\p{L}])|-(me|te|se|lhe|lhes|nos|vos|o|a|os|as|lo|la|los|las|no|na|mo|ma|mos|mas|to|ta|lho|lha|lhos|lhas)(?![\p{L}])/iu.test(t)
      || /(?<![\p{L}])(eu|tu|ele|ela|nós|vocês|eles|elas)\s+(o|a|os|as)\s+\p{L}+/iu.test(t) },
  { nombre: '2a-persona',
    test: (t) => b('tu|te|ti|contigo|teu|tua|teus|tuas|vós|vosso|vossa|vossos|vossas|convosco').test(t)
      || VERBOS_2SG.test(t) },
  { nombre: 'gerundio', test: tieneGerundio },
  { nombre: 'nasal-circunfleja', test: nasalSospechosa },
  { nombre: 'deixis-esse-aqui', test: (t) => /(?<![\p{L}])(ess[ea]s?|isso)\b[^.!?]{0,40}\baqui(?![\p{L}])/iu.test(t) },
  // Régimen brasileño de precisar (sin `de`), excluyendo el impersonal
  // europeo «é/foi/será preciso + inf». 13 ítems sellados por la v1.
  { nombre: 'precisar-sin-de',
    test: (t) => /(?<!(?:é|foi|será|seria|era)\s)(?<![\p{L}])precis(o|as|a|amos|am|ei|aste|ou|ámos|aram|ava|avas|ávamos|avam)\s+\p{L}+(ar|er|ir)(?![\p{L}])/iu.test(t) },
  { nombre: 'chegar-em', test: (t) => /(?<![\p{L}])cheg\p{L}+\s+(em|no|na)(?![\p{L}])/iu.test(t) },
  { nombre: 'tem-existencial',
    test: (t) => /(^|[.!?]\s*)tem\s+(um|uma|uns|umas|muit\p{L}*|pouc\p{L}*|vári\p{L}*|algum\p{L}*|tant\p{L}*|gente|\d)/iu.test(t) },
  { nombre: 'ce-coloquial', test: (t) => /(^|[.!?]\s*)c[êe](?![\p{L}-])/iu.test(t) },
  // Español dentro del campo portugués: la regla no distingue «sin
  // marcador BR» de «ni siquiera es portugués» — 19 ítems iban al sello.
  { nombre: 'espanol',
    test: (t) => /[ñ¿¡]|\p{L}+ci[óo]n(?![\p{L}])|\p{L}+dad(?![\p{L}])|(?<![\p{L}])(usted|verdad|jardín|mientras|en|el|del|una|es)(?![\p{L}])|(?<![\p{L}])y(?![\p{L}])/iu.test(t) },
  // Grafía europea pre-AO90 (directamente, óptimo, acção): inválida en
  // las DOS variantes de hoy — el sello no puede bendecirla.
  { nombre: 'grafia-pre-ao90',
    test: (t) => /(?<![\p{L}])(direct|óptim|acç|project|objectiv|correct|exact|baptiz|adopç|adopt)\p{L}*/iu.test(t) },
];

export type Destino =
  | { destino: 'needs-human'; motivo: string }
  | { destino: 'neutral'; sello: typeof SELLO }
  | { destino: 'unchecked'; riesgos: string[] };

// ── v3 (2026-08-13): los chequeos del FRENO ────────────────────────
//
// El muestreo de E2#2 halló 4/10 errores reales en la primera cola de
// inertes, y los cuatro vivían donde la regla no miraba. Estos chequeos
// MECÁNICOS cazan tres de las cuatro clases; la cuarta (falsedad
// semántica de la glosa) no es mecanizable — por eso el muestreo
// adversarial sigue siendo obligatorio: la regla propone, la muestra
// dispone.

/** Options con duplicados (9f57a67b tenía «em» dos veces). */
function optionsRotas(ex: Ex): string | null {
  const ops = (ex.data as any)?.options;
  if (!Array.isArray(ops)) return null;
  const vistos = new Set<string>();
  for (const o of ops) {
    const k = String(o).trim().toLowerCase();
    if (vistos.has(k)) return `options-duplicada:«${o}»`;
    vistos.add(k);
  }
  return null;
}

/** Ensamblado roto: la respuesta insertada en el hueco queda pegada a
 *  una copia de sí misma («sonhou ___ com» + answer «com» → «com com»),
 *  la clase que la Ola V encontró a mano en b4/b5. */
function ensambladoRoto(ex: Ex): string | null {
  const d = ex.data as any;
  const sent: string | undefined = d?.sentence;
  const answer: string | undefined = d?.answer ?? d?.blanks?.[0]?.answer;
  if (!sent || !answer || !sent.includes('___')) return null;
  const ens = sent.replace('___', String(answer));
  const w = String(answer).trim().toLowerCase();
  // Normaliza a palabras separadas por un espacio y busca la respuesta
  // pegada a una copia de sí misma. Sin lookbehind: los escapes de \p
  // ya se perdieron una vez entre generadores de código.
  const palabras = ens.toLowerCase().replace(/[^a-záéíóúâêôãõçü\s-]/gi, ' ').split(/\s+/);
  for (let i = 0; i + 1 < palabras.length; i++) {
    if (palabras[i] === w && palabras[i + 1] === w) return `ensamblado-duplica:«${w} ${w}»`;
  }
  return null;
}

/** Glosa que atribuye a la palabra rasgos que NO tiene: fragmentos
 *  citados en el esContrast («-ão», «nh») que no aparecen en el texto
 *  portugués del ítem (185d89ba decía «manhã con -ão»; 273b3166 citaba
 *  un «nh» que irmão no contiene). Sólo fragmentos CORTOS sin espacios:
 *  los largos son ejemplos legítimos de otra cosa. */
function glosaContradice(ex: Ex): string | null {
  const glosa = (ex as any).esContrast;
  if (typeof glosa !== 'string' || !glosa) return null;
  const pt = textoPortugues(ex).toLowerCase();
  if (!pt.trim()) return null;
  const citas = [
    // fragmentos entre comillas: 'nh', «ão»
    ...[...glosa.matchAll(/[«'‘"]-?([a-záéíóúâêôãõçü]{2,4})[»'’"]/gi)].map((m) => m[1]!),
    // fragmentos con guion SIN comillas: «con -ão», «termina en -nh»
    ...[...glosa.matchAll(/\s-([a-záéíóúâêôãõçü]{2,4})(?=[\s.,;)]|$)/gi)].map((m) => m[1]!),
  ].map((c) => c.toLowerCase());
  for (const c of citas) {
    if (c.length < 2) continue;
    if (!pt.includes(c)) return `glosa-cita-ausente:«${c}»`;
  }
  return null;
}

export function triage(ex: Ex): Destino {
  // Un ítem exento ENSEÑA la diferencia de variantes: contiene material
  // divergente por diseño, así que ni se consagra ni se cuarentena.
  if (exento(ex)) return { destino: 'unchecked', riesgos: ['exento'] };

  const hallazgos = revisarEjercicio(ex);
  const riesgos: string[] = [];

  for (const h of hallazgos.filter((x) => x.severidad === 'error')) {
    // Campo didáctico (la frase a corregir, los distractores, los
    // pares): el marcador está ahí a propósito o casi — retener.
    if (CAMPOS_DIDACTICOS[ex.type]?.has(h.campo)) {
      riesgos.push(`marcador-en-campo-didactico:${h.marcador}`);
      continue;
    }
    // Contraste sin etiqueta: el ítem trae también la forma europea
    // («Em Portugal, o 'ônibus' chama-se 'autocarro'») — retener.
    if (contrasteImplicito(ex, h.europeo)) {
      riesgos.push(`contraste-implicito:${h.marcador}`);
      continue;
    }
    return { destino: 'needs-human', motivo: `marcador: ${h.marcador}` };
  }

  // v3: los chequeos del freno — cualquiera de los tres retiene el ítem.
  for (const chk of [optionsRotas(ex), ensambladoRoto(ex), glosaContradice(ex)]) {
    if (chk) return { destino: 'unchecked', riesgos: [chk] };
  }

  const t = textoPortugues(ex);
  // Sin texto escaneable no hay nada que verificar: sellar lo que no se
  // leyó no es una regla, es un agujero (revisor 2, E1).
  if (t.trim() === '') return { destino: 'unchecked', riesgos: ['sin-texto-escaneable'] };

  if (hallazgos.some((x) => x.severidad === 'aviso')) riesgos.push('aviso');
  for (const r of RIESGOS) if (r.test(t)) riesgos.push(r.nombre);
  if (riesgos.length > 0) return { destino: 'unchecked', riesgos };

  return { destino: 'neutral', sello: SELLO };
}

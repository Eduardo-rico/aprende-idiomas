// scripts/lib/variant-guard.ts
//
// Gate de variante: detecta portugués BRASILEÑO dentro del contenido base,
// que desde la inversión del 2026-07-28 debe ser portugués EUROPEO.
//
// Por qué existe: el corpus se generó con un prompt que decía «usa `data` para
// la versión brasileña», y nadie lo comprobó nunca. Resultado medido: de 2.037
// ejercicios sólo 191 (9,4 %) tenían forma europea verificada. Un validador
// determinista y offline habría atrapado esto el primer día — cuesta un rato
// escribirlo y habría ahorrado meses de contenido en la variante equivocada.
//
// Diseño, aprendido de un primer intento con demasiados falsos positivos:
//  1. Sólo se miran los campos que LLEVAN PORTUGUÉS. Las glosas y preguntas en
//     español no cuentan: `El ratón grande del carro` es español, no brasileño.
//  2. `variantOverrides['pt-br']` NO se inspecciona: ahí el brasileño es lo
//     correcto por definición.
//  3. Exenciones declaradas, no implícitas: un ítem que ENSEÑA la diferencia
//     entre variantes necesita decir `trem` para hacer su trabajo.

/** Campos que contienen portugués, por tipo de ejercicio. El resto (question,
 *  hintEs, explanationEs, y el lado español de translation) es español. */
const CAMPOS_PT: Record<string, string[]> = {
  flashcard: ['back', 'example', 'audioText'],
  fill_blank: ['sentence'],
  listening: ['audioText'],
  translation: [], // se resuelve abajo: depende de sourceLang/targetLang
  verb_preposition: ['sentence'],
  sentence_construction: ['words'],
  chunk: ['chunk', 'examples'],
  error_correction: ['sentence', 'correct'],
  conjugation: ['answer', 'example'],
  matching: [],
  multiple_choice: ['sentence'],
  shadowing: ['text'],
  lesson: [],
};

export interface Marcador {
  re: RegExp;
  nombre: string;
  europeo: string;
  severidad: 'error' | 'aviso';
}

/** Límite de palabra Unicode.
 *
 *  `\b` de JavaScript está definido sobre `[A-Za-z0-9_]`, así que `\bônibus\b`
 *  NO casa con «ônibus»: la `ô` no es carácter de palabra en ASCII y el límite
 *  se evalúa al revés. El bug se comió los marcadores acentuados enteros
 *  —ônibus, xícara, açougue, café da manhã— y lo cazó el test del propio gate,
 *  no el gate. Usamos lookaround sobre la propiedad Unicode `\p{L}`. */
const b = (patron: string) => new RegExp(`(?<![\\p{L}])(?:${patron})(?![\\p{L}])`, 'iu');

/** Lista cerrada. Cada entrada es una forma que en Portugal NO se usa,
 *  con su equivalente europeo, para que el mensaje sea accionable. */
export const MARCADORES: Marcador[] = [
  // Sintaxis — los dos que más delatan
  { re: /\b(estou|estás|está|estamos|estão|estava|estive)\s+\w+ndo\b/i,
    nombre: 'gerundio con estar', europeo: 'estar a + infinitivo (estou a fazer)', severidad: 'error' },
  // OJO: sólo el SINGULAR. `vocês` es la segunda persona del plural normal
  // en Portugal («vocês são fixe!» es europeo de manual), y marcarlo como
  // brasileñismo inflaba el recuento con 44 falsos positivos. El que
  // ofende a un desconocido en Lisboa es `você`, no `vocês`.
  { re: b('voc[êe]'),
    nombre: 'você singular como 2ª persona', europeo: 'tu (informal) o 3ª persona sin pronombre (deferencia)', severidad: 'error' },

  // Léxico exclusivo de Brasil
  { re: b('[ôo]nibus'), nombre: 'ônibus', europeo: 'autocarro', severidad: 'error' },
  { re: b('caf[ée] da manh[ãa]'), nombre: 'café da manhã', europeo: 'pequeno-almoço', severidad: 'error' },
  { re: b('celular'), nombre: 'celular', europeo: 'telemóvel', severidad: 'error' },
  { re: b('geladeira'), nombre: 'geladeira', europeo: 'frigorífico', severidad: 'error' },
  { re: b('banheiro'), nombre: 'banheiro', europeo: 'casa de banho', severidad: 'error' },
  { re: b('x[íi]cara'), nombre: 'xícara', europeo: 'chávena', severidad: 'error' },
  { re: b('sorvete'), nombre: 'sorvete', europeo: 'gelado', severidad: 'error' },
  { re: b('a[çc]ougue'), nombre: 'açougue', europeo: 'talho', severidad: 'error' },
  { re: b('bonde'), nombre: 'bonde', europeo: 'elétrico', severidad: 'error' },
  { re: b('terno'), nombre: 'terno', europeo: 'fato', severidad: 'error' },
  { re: b('time'), nombre: 'time (equipo)', europeo: 'equipa', severidad: 'aviso' },
  { re: b('trem'), nombre: 'trem', europeo: 'comboio', severidad: 'error' },
  { re: b('ruim'), nombre: 'ruim', europeo: 'mau', severidad: 'aviso' },

  // Ortografía anterior al Acordo, o brasileña
  { re: b('contato'), nombre: 'contato', europeo: 'contacto', severidad: 'error' },
  { re: /\bfato de que\b/i, nombre: 'fato (hecho)', europeo: 'facto', severidad: 'aviso' },

  // Próclise en inicio absoluto: agramatical en Portugal
  { re: /(^|[.!?»"]\s+)(me|te|se|lhe|nos|o|a)\s+(diga|dê|fale|conte|ajude|chamo|dou|digo)\b/i,
    nombre: 'próclise en inicio de frase', europeo: 'ênclise (diga-me, chamo-me)', severidad: 'error' },

  // Posesivo sin artículo delante de parentesco: marca brasileña muy frecuente
  { re: /(^|\s)(Minha|Meu)\s+(mãe|pai|irmã|irmão|avó|avô|filha|filho|casa|carro|amigo|amiga)\b/,
    nombre: 'posesivo sin artículo', europeo: 'a minha mãe, o meu pai', severidad: 'aviso' },
];

export interface Hallazgo {
  id: string;
  campo: string;
  marcador: string;
  europeo: string;
  severidad: 'error' | 'aviso';
  texto: string;
}

type Json = Record<string, unknown>;
interface Ex extends Json { id: string; type: string; data: Json; tags?: string[]; esContrast?: string; }

/** Un ítem queda exento cuando su trabajo ES enseñar la diferencia entre
 *  variantes: entonces necesita decir `trem` o `contato` para hacerlo.
 *
 *  Los tres patrones salieron de falsos positivos reales del primer pase:
 *  `b21f2d27` mostraba «contacto … / 🇧🇷 BR: … contato» —las dos formas a
 *  propósito, con bandera— y el gate lo marcaba como error. Un gate que
 *  grita en falso acaba desactivado, así que esto importa tanto como
 *  detectar los verdaderos. */
export function exento(ex: Ex): boolean {
  if (ex.tags?.includes('regional')) return true;
  const contexto = `${ex.esContrast ?? ''} ${JSON.stringify(ex.data)}`;
  return (
    // menciona explícitamente el país o el gentilicio
    /\bBrasil\b|\bbrasileir[oa]/i.test(contexto) ||
    // etiqueta contrastiva en el propio texto: «BR:», «PT:», «BR/PT»
    /\b(BR|PT|PT-PT|PT-BR)\s*[:\/]/.test(contexto) ||
    // banderas usadas como marca de variante
    /🇧🇷|🇵🇹/u.test(contexto)
  );
}

function camposPortugues(ex: Ex): string[] {
  if (ex.type === 'translation') {
    // El lado portugués es el que NO está marcado como español.
    const d = ex.data as { sourceLang?: string; targetLang?: string };
    const out: string[] = [];
    if (d.sourceLang && d.sourceLang !== 'es') out.push('source');
    if (d.targetLang && d.targetLang !== 'es') out.push('target');
    return out;
  }
  return CAMPOS_PT[ex.type] ?? [];
}

/** Aplana un valor a texto escaneable (strings sueltos, arrays y objetos). */
function texto(v: unknown): string {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(texto).join(' · ');
  if (v && typeof v === 'object') return Object.values(v as Json).map(texto).join(' · ');
  return '';
}

export function revisarEjercicio(ex: Ex): Hallazgo[] {
  if (exento(ex)) return [];
  const out: Hallazgo[] = [];
  for (const campo of camposPortugues(ex)) {
    const t = texto((ex.data as Json)[campo]);
    if (!t) continue;
    for (const m of MARCADORES) {
      const hit = t.match(m.re);
      if (!hit) continue;
      out.push({
        id: ex.id, campo, marcador: m.nombre, europeo: m.europeo,
        severidad: m.severidad,
        texto: t.length > 120 ? t.slice(0, 117) + '…' : t,
      });
    }
  }
  return out;
}

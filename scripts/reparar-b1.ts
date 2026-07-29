// scripts/reparar-b1.ts
//
// Repara el bloque 1 (fonética y ortografía) — lo primero que ve cualquiera,
// lo que no se puede saltar, y lo que más repite el repaso espaciado. O sea:
// donde lo falso se fija primero y más hondo.
//
// Cada corrección de aquí es de algo DEMOSTRABLEMENTE falso, verificado ítem
// a ítem contra la revisión lingüística del 2026-07-28. Lo que es cuestión de
// oído —la mitad fonética del bloque— NO se toca: se marca para el nativo.
//
// Uso: npx tsx scripts/reparar-b1.ts [--write]

import { promises as fs } from 'node:fs';
import path from 'node:path';

const FILE = path.join(process.cwd(), 'lib/data/languages/pt/blocks/b1.json');
const COLA = path.join(process.cwd(), 'lib/data/languages/pt/variant-human-queue.json');
const WRITE = process.argv.includes('--write');

type Json = Record<string, unknown>;
interface Ex extends Json { id: string; type: string; data: Json; audio?: Json; variantStatus?: string }

/** Se BORRAN: afirman algo falso y no se pueden arreglar editando un campo,
 *  porque el ítem entero existe para enseñar la falsedad. */
const BORRAR: Record<string, string> = {
  '086de331':
    '«Minha avó mora no Brasil. Minha avô mora em Lisboa» — "Minha avô" es agramatical (posesivo femenino + sustantivo masculino) y el ítem entero enseña que avó/avô es una diferencia entre países. No lo es: avô es abuelo y avó abuela, en los dos. Está grabado en TTS.',
  'cb398595':
    '«En Portugal dicen avô y en Brasil también, aunque a veces usan avó» — falso de raíz. La oposición avó/avô es de GÉNERO (abuela/abuelo) y de altura vocálica (/ɔ/ abierta vs /o/ cerrada), no de país.',
};

/** Se ARREGLAN: la falsedad está en un campo concreto. */
const ARREGLAR: Record<string, { por_que: string; data: Json }> = {
  '7093d2de': {
    por_que:
      'Decía que el acento agudo marca vocal CERRADA, y se desmentía en su propio ejemplo: café /kaˈfɛ/ es abierta. En portugués el agudo marca vocal ABIERTA y el circunflejo la cerrada — es justo al revés.',
    data: {
      front: '¿Qué indica el acento agudo (´) frente al circunflejo (^)?',
      back: 'El AGUDO marca vocal ABIERTA y tónica: á /a/, é /ɛ/, ó /ɔ/. El CIRCUNFLEJO marca vocal CERRADA y tónica: ê /e/, ô /o/. Es la oposición que distingue avó /ɔ/ (abuela) de avô /o/ (abuelo).',
      example: 'café /kɐˈfɛ/ · pé /pɛ/ · avó /ɐˈvɔ/  ⇄  você /voˈse/ · pêssego /ˈpesegu/ · avô /ɐˈvo/',
    },
  },
  '80945c47': {
    por_que:
      'Decía que la ç se usa «antes de e, i». Es exactamente la regla invertida: la ç NUNCA aparece ante e ni i — ahí se escribe c a secas. Sólo aparece ante a, o, u.',
    data: {
      front: "¿Cuándo se escribe 'ç' en portugués?",
      back: 'Sólo ante a, o, u — para que suene /s/ donde una c sola sonaría /k/. NUNCA ante e ni i: ahí basta con c (cedo, cinco), porque ya suena /s/.',
      example: 'começar, açúcar, moço, faço  —  pero: cedo, cinema, cinco (nunca *çedo, *çinco)',
    },
  },
  '32400dc7': {
    por_que:
      'Decía 23 letras. Desde el Acordo Ortográfico de 1990 el alfabeto portugués tiene 26: se reincorporaron K, W e Y.',
    data: {
      source: 'O alfabeto português tem vinte e seis letras, incluindo K, W e Y.',
      target: 'El alfabeto portugués tiene veintiséis letras, incluidas K, W e Y.',
      sourceLang: 'pt-pt',
      targetLang: 'es',
      acceptedAlternatives: ['El alfabeto portugués tiene 26 letras, incluidas K, W e Y.'],
    },
  },
  '3e26e656': {
    por_que:
      '«dúplex» no es el nombre de ninguna letra en ninguna variedad. En Portugal la W se llama "duplo vê"; en Brasil, "dâblio".',
    data: {
      sentence: 'Em português europeu, a letra W chama-se ___ .',
      blanks: [{ position: 0, answer: 'duplo vê', alternatives: ['duplo v'] }],
    },
  },
  '045fccec': {
    por_que:
      '«livro» se tradujo como «lectura», y entre las alternativas aceptadas estaba «Aquella vez es muy difícil», que no significa nada.',
    data: {
      source: 'Aquele livro é muito difícil.',
      target: 'Aquel libro es muy difícil.',
      sourceLang: 'pt-pt',
      targetLang: 'es',
      acceptedAlternatives: ['Ese libro es muy difícil.'],
    },
  },
  '133a98bd': {
    por_que:
      'Clasificaba «hábito» como paroxítona sin tilde — y la propia pregunta la escribe CON tilde. Es proparoxítona (esdrújula), y en portugués TODAS las proparoxítonas llevan acento gráfico, sin excepción. Ésa es justamente la regla más rentable del nivel.',
    data: {
      front: '¿Por qué «hábito» lleva tilde y «habito» no es la misma palabra?',
      back: 'hábito es PROPAROXÍTONA (esdrújula) y en portugués todas la llevan, sin excepción. «habito» sin tilde es la 1.ª persona del verbo habitar. La regla: toda proparoxítona se acentúa; las paroxítonas sólo si terminan en -l, -r, -x, -n, -i, -u, -ã, -ão, -um.',
      example: 'hábito, fábrica, médico, rápido (proparoxítonas, todas con tilde) · fácil, açúcar (paroxítonas acentuadas por su final)',
    },
  },
  '0d4c1972': {
    por_que:
      'Aceptaba «fabrica» sin tilde como alternativa válida de «fábrica». No lo es: sin tilde es la 3.ª persona del verbo fabricar, y el ítem existe precisamente para enseñar la tilde de la proparoxítona.',
    data: {
      sentence: 'Ela trabalha na ___ todos os dias.',
      blanks: [{ position: 0, answer: 'fábrica', alternatives: [] }],
    },
  },
  'f5a62aac': {
    por_que:
      'Base sin artículo ante el posesivo («Minha avó»), que es la forma brasileña — en Portugal es obligatorio «A minha avó». Y la alternativa aceptada en español, «Mi abuela mora en Lisboa», no es español corriente.',
    data: {
      source: 'A minha avó mora em Lisboa.',
      target: 'Mi abuela vive en Lisboa.',
      sourceLang: 'pt-pt',
      targetLang: 'es',
      acceptedAlternatives: ['Mi abuela vive en Lisboa.'],
    },
  },
};

/** La correspondencia que FALTABA, y es la única que de verdad genera
 *  palabras nuevas: un hispanohablante que la interioriza puede producir
 *  vocabulario portugués que nunca ha visto. Mientras tanto el bloque
 *  dedicaba 21 ítems a la «h muda», que también es muda en español —
 *  o sea a un contraste inventado. */
const NUEVOS: Ex[] = [
  {
    id: 'b1-hf-01', blockId: 1, lessonId: 'b1-l3-correspondencias-es-pt',
    difficulty: 1, concepts: ['b1-corresp-h-f'], tags: ['correspondencia'],
    type: 'flashcard',
    esContrast: 'La f- inicial del latín se conservó en portugués y se perdió en español. Es la correspondencia que más palabras genera.',
    data: {
      front: 'La correspondencia que más rinde: h- española ⇄ f- portuguesa',
      back: 'Donde el español tiene h- muda inicial, el portugués casi siempre tiene f-: hijo→filho, hacer→fazer, hablar→falar, harina→farinha, hierro→ferro, hoja→folha, hormiga→formiga, humo→fumo.',
      example: 'hijo → filho · hacer → fazer · hablar → falar · hambre → fome',
    },
    variantStatus: 'unchecked',
  } as unknown as Ex,
  {
    id: 'b1-hf-02', blockId: 1, lessonId: 'b1-l3-correspondencias-es-pt',
    difficulty: 1, concepts: ['b1-corresp-h-f'], tags: ['correspondencia'],
    type: 'fill_blank',
    esContrast: 'hablar → falar. La h- española corresponde a f- portuguesa.',
    data: { sentence: 'Eu ___ português com a minha vizinha. (hablar)', blanks: [{ position: 0, answer: 'falo', alternatives: [] }] },
    variantStatus: 'unchecked',
  } as unknown as Ex,
  {
    id: 'b1-hf-03', blockId: 1, lessonId: 'b1-l3-correspondencias-es-pt',
    difficulty: 2, concepts: ['b1-corresp-h-f'], tags: ['correspondencia'],
    type: 'fill_blank',
    esContrast: 'hacer → fazer. Mismo patrón h- ⇄ f-.',
    data: { sentence: 'O que é que vais ___ amanhã? (hacer)', blanks: [{ position: 0, answer: 'fazer', alternatives: [] }] },
    variantStatus: 'unchecked',
  } as unknown as Ex,
  {
    id: 'b1-hf-04', blockId: 1, lessonId: 'b1-l3-correspondencias-es-pt',
    difficulty: 2, concepts: ['b1-corresp-h-f'], tags: ['correspondencia'],
    type: 'translation',
    esContrast: 'hijo → filho, hija → filha.',
    data: { source: 'Mi hijo habla portugués.', target: 'O meu filho fala português.', sourceLang: 'es', targetLang: 'pt-pt', acceptedAlternatives: [] },
    variantStatus: 'unchecked',
  } as unknown as Ex,
];

async function main() {
  const raw = JSON.parse(await fs.readFile(FILE, 'utf8')) as Ex[] | { exercises: Ex[] };
  const items: Ex[] = Array.isArray(raw) ? raw : raw.exercises;
  const antes = items.length;

  const cola: { id: string; motivo: string; base?: string; override?: string }[] = [];
  try { const p = JSON.parse(await fs.readFile(COLA, 'utf8')); if (Array.isArray(p)) cola.push(...p); } catch { /* vacía */ }

  const audiosHuerfanos: string[] = [];
  let borrados = 0, arreglados = 0;

  const resultado = items.filter((ex) => {
    if (BORRAR[ex.id]) {
      borrados++;
      if (ex.audio) for (const v of Object.values(ex.audio as Record<string, { hash?: string }>)) if (v?.hash) audiosHuerfanos.push(v.hash);
      console.log(`  ✗ BORRADO ${ex.id} — ${BORRAR[ex.id]!.slice(0, 90)}…`);
      return false;
    }
    return true;
  });

  for (const ex of resultado) {
    const fix = ARREGLAR[ex.id];
    if (!fix) continue;
    ex.data = fix.data;
    // El texto cambió, así que el audio grabado ya no le corresponde.
    if (ex.audio) { for (const v of Object.values(ex.audio as Record<string, { hash?: string }>)) if (v?.hash) audiosHuerfanos.push(v.hash); delete ex.audio; }
    ex.variantStatus = 'unchecked';
    arreglados++;
    console.log(`  ✓ ARREGLADO ${ex.id} — ${fix.por_que.slice(0, 90)}…`);
  }

  resultado.push(...NUEVOS);

  if (WRITE) {
    await fs.writeFile(FILE, JSON.stringify(Array.isArray(raw) ? resultado : { ...raw, exercises: resultado }, null, 2) + '\n');
    for (const [id, motivo] of Object.entries(BORRAR)) if (!cola.some((c) => c.id === id)) cola.push({ id, motivo: 'BORRADO del corpus: ' + motivo });
    await fs.writeFile(COLA, JSON.stringify(cola, null, 2) + '\n');
    if (audiosHuerfanos.length) {
      await fs.writeFile(
        path.join(process.cwd(), 'lib/data/languages/pt/audio-huerfano-b1.json'),
        JSON.stringify({ nota: 'MP3 que ya no corresponden a su texto tras la reparación del bloque 1 del 2026-07-28. No se borran aquí: se listan para que gc-audio decida.', hashes: audiosHuerfanos }, null, 2) + '\n',
      );
    }
  }

  console.log(`\n${WRITE ? '=== ESCRITO ===' : '=== DRY-RUN ==='}`);
  console.log(`  ítems antes            : ${antes}`);
  console.log(`  borrados               : ${borrados}`);
  console.log(`  arreglados             : ${arreglados}`);
  console.log(`  añadidos (h- ⇄ f-)     : ${NUEVOS.length}`);
  console.log(`  ítems después          : ${resultado.length}`);
  console.log(`  MP3 que dejan de valer : ${audiosHuerfanos.length}`);
  if (!WRITE) console.log('\nPara aplicar: npx tsx scripts/reparar-b1.ts --write');
}

main().catch((e) => { console.error(e); process.exit(1); });

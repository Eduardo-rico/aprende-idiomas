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
  // matching y multiple_choice llevaban campos que NO existen en el
  // schema real (`sentence` en MC, nada en matching): la Ola V los
  // encontró CIEGOS — 42 ítems sin un solo carácter escaneado, con
  // «café da manhã» vivo en `options`. La pregunta de MC es español;
  // las opciones y los pares son portugués.
  matching: ['pairs'],
  multiple_choice: ['options'],
  shadowing: ['text'],
  lesson: [],
  // Ola B2C2-PT: en el juicio de gramaticalidad, `sentence` puede estar
  // mal A PROPÓSITO (didáctico) y `repair` es la forma canónica. En
  // mediación, `sourceText` es CITA de la biblioteca (Eça trae grafía
  // pre-Acordo legítima) y no se escanea; `modelAnswer` puede ser
  // español si targetLang=es — tampoco se escanea por regla.
  grammaticality_judgment: ['sentence', 'repair'],
  mediation: [],
};

/** Campos DIDÁCTICOS: contienen material erróneo o contrastivo A
 *  PROPÓSITO (la frase a corregir, los distractores de una elección
 *  múltiple, los pares de un matching de variantes). Un marcador aquí
 *  no prueba que el ítem esté roto — prueba que hay que mirarlo. El
 *  triage los RETIENE en vez de cuarentenarlos. */
export const CAMPOS_DIDACTICOS: Record<string, Set<string>> = {
  error_correction: new Set(['sentence']),
  multiple_choice: new Set(['options']),
  matching: new Set(['pairs']),
  grammaticality_judgment: new Set(['sentence']),
};

export interface Marcador {
  re: RegExp;
  nombre: string;
  europeo: string;
  severidad: 'error' | 'aviso';
  /** Término europeo DISTINTIVO cuya presencia prueba que el ítem enseña
   *  el contraste. `null` desactiva la heurística para ese marcador,
   *  porque su forma europea es una palabra demasiado común para probar
   *  nada — es el caso de «você», cuyo europeo es «tu». */
  terminoEuropeo?: string | null;
  /** el marcador aparece SÓLO citado como palabra, nunca usado: no es
   *  brasileñismo del contenido. El gate lo sigue reportando —el triaje
   *  lo necesita para pedir revisión del contraste implícito— pero quien
   *  cuenta la deuda debe excluirlo. */
  mencion?: boolean;
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
    nombre: 'você singular como 2ª persona', europeo: 'tu (informal) o 3ª persona sin pronombre (deferencia)', severidad: 'error',
    // Sin heurística de contraste implícito: la forma europea es «tu», y
    // que un ítem contenga «tu» no prueba que enseñe el contraste — con
    // ese criterio quedaban exentos 237. Con la v1, que se quedaba con
    // «informal», quedaban exentos 26 que no debían. Para este marcador
    // la exención tiene que venir de una etiqueta explícita (BR/PT,
    // bandera, «Brasil»), que es lo que `exento()` ya mira.
    terminoEuropeo: null },

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

  // Grafías BR pre-2009: nunca fueron válidas en Portugal y ya no lo
  // son ni en Brasil — pero un LLM entrenado con texto viejo las emite.
  // Cero falsos positivos posibles (Ola V, revisión adversarial).
  { re: /\p{L}*ü\p{L}*/iu, nombre: 'trema (lingüiça, tranqüilo)', europeo: 'sin trema (linguiça, tranquilo)', severidad: 'error' },
  { re: b('\\p{L}*ôo[s]?'), nombre: 'circunflejo -ôo (vôo, enjôo)', europeo: 'voo, enjoo', severidad: 'error' },
  { re: b('\\p{L}*éia[s]?'), nombre: '-éia (idéia, assembléia)', europeo: 'ideia, assembleia', severidad: 'error' },

  // Próclise en inicio absoluto: agramatical en Portugal. Generalizada
  // en la Ola V — la lista cerrada de 7 verbos dejaba pasar «Me passa o
  // sal». Sólo los clíticos inequívocos (se=conjunción y nos=contracción
  // quedan fuera; o/a son homógrafos del artículo).
  { re: /(^|[.!?»"]\s+)(me|te|lhe|lhes)\s+\p{L}+/iu,
    nombre: 'próclise en inicio de frase', europeo: 'ênclise (diga-me, chamo-me)', severidad: 'error' },

  // Ênclise tras negación: agramatical en las DOS variantes.
  { re: /(?<![\p{L}])não\s+\p{L}+-(me|te|se|lhe|lhes|nos|vos|o|a|os|as|lo|la|los|las|no|na)(?![\p{L}])/iu,
    nombre: 'ênclise tras negación', europeo: 'próclise (não me diga)', severidad: 'error' },

  // Posesivo sin artículo delante de parentesco: marca brasileña muy frecuente
  { re: /(^|\s)(Minha|Meu)\s+(mãe|pai|irmã|irmão|avó|avô|filha|filho|casa|carro|amigo|amiga)\b/,
    nombre: 'posesivo sin artículo', europeo: 'a minha mãe, o meu pai', severidad: 'aviso' },

  // ── Extensión léxica de la Ola V (2026-07-29, dos revisiones
  // adversariales independientes convergentes). ERROR = en Portugal no
  // se usa y no hay homógrafo europeo; AVISO = bifronte o defendible,
  // el triage retiene para el nativo en vez de cuarentenar.
  { re: b('suco[s]?'), nombre: 'suco', europeo: 'sumo', severidad: 'error' },
  { re: b('esporte[s]?'), nombre: 'esporte', europeo: 'desporto', severidad: 'error' },
  { re: b('planej\\p{L}*'), nombre: 'planejar', europeo: 'planear', severidad: 'error' },
  { re: b('usu[áa]ri[oa]s?'), nombre: 'usuário', europeo: 'utilizador', severidad: 'error' },
  { re: b('registro[s]?'), nombre: 'registro', europeo: 'registo', severidad: 'error' },
  { re: b('equipe[s]?'), nombre: 'equipe', europeo: 'equipa', severidad: 'error' },
  { re: b('gol|gols'), nombre: 'gol', europeo: 'golo', severidad: 'error' },
  { re: b('gar[çc]o(m|ns)|gar[çc]onete[s]?'), nombre: 'garçom/garçonete', europeo: 'empregado/a de mesa', severidad: 'error' },
  { re: b('caminh[ãa]o|caminh[õo]es'), nombre: 'caminhão', europeo: 'camião', severidad: 'error' },
  { re: b('aluguel|alugu[ée]is'), nombre: 'aluguel', europeo: 'aluguer', severidad: 'error' },
  { re: b('dezesseis|dezessete|dezenove'), nombre: 'dezesseis/dezessete/dezenove', europeo: 'dezasseis/dezassete/dezanove', severidad: 'error' },
  { re: b('recep[çc]\\p{L}*|percep[çc]\\p{L}*|concep[çc]\\p{L}*|decep[çc]\\p{L}*|intercept\\p{L}*'),
    nombre: 'recepção y familia', europeo: 'receção, perceção, conceção, deceção, intercetar', severidad: 'error' },
  { re: b('torcida[s]?|torcedor\\p{L}*'), nombre: 'torcida/torcedor', europeo: 'adeptos/adepto', severidad: 'error' },
  { re: b('vestibular\\p{L}*'), nombre: 'vestibular', europeo: 'exames nacionais / provas de acesso', severidad: 'error' },
  { re: b('moletom|moletons'), nombre: 'moletom', europeo: 'camisola (com capuz)', severidad: 'error' },
  { re: b('card[áa]pio[s]?'), nombre: 'cardápio', europeo: 'ementa', severidad: 'error' },
  { re: b('todo mundo'), nombre: 'todo mundo', europeo: 'toda a gente', severidad: 'error' },
  // Sólo las formas ACENTUADAS. La tolerancia al sin-acento —que otros
  // marcadores llevan para cazar erratas— aquí es ruido puro: «bebe» y
  // «bebes» son el presente y el imperativo de *beber*, de las palabras
  // más corrientes del idioma. Marcaba `cl16-042`, «___ (beber) um pouco
  // de água», que no tiene nada de brasileño. Y el acento es justo lo que
  // separa las dos variantes: tolerarlo borra el rasgo examinado.
  { re: b('bebês?'), nombre: 'bebê', europeo: 'bebé', severidad: 'error' },
  { re: b('cad[êe]'), nombre: 'cadê', europeo: 'onde está', severidad: 'error' },
  { re: b('mam[ãa]e|papai'), nombre: 'mamãe/papai', europeo: 'mamã/papá', severidad: 'error' },
  { re: b('sobrenome[s]?'), nombre: 'sobrenome', europeo: 'apelido', severidad: 'error' },
  { re: b('mouse'), nombre: 'mouse', europeo: 'rato', severidad: 'error' },
  { re: b('delet\\p{L}*'), nombre: 'deletar', europeo: 'apagar', severidad: 'error' },
  { re: b('carona[s]?'), nombre: 'carona', europeo: 'boleia', severidad: 'error' },
  { re: b('metr[ôo]s?'), nombre: 'metrô', europeo: 'metro', severidad: 'error' },
  { re: b('c[âa]ncer\\p{L}*'), nombre: 'câncer', europeo: 'cancro', severidad: 'error' },
  { re: b('aeromo[çc]a[s]?'), nombre: 'aeromoça', europeo: 'assistente de bordo / hospedeira', severidad: 'error' },
  { re: b('encanador\\p{L}*'), nombre: 'encanador', europeo: 'canalizador', severidad: 'error' },
  { re: b('faxineir[oa]s?|faxina[s]?'), nombre: 'faxineira', europeo: 'empregada de limpeza', severidad: 'error' },
  { re: b('lanchonete[s]?'), nombre: 'lanchonete', europeo: 'café / snack-bar', severidad: 'error' },
  { re: b('sorveteria[s]?'), nombre: 'sorveteria', europeo: 'geladaria', severidad: 'error' },
  { re: b('bilheteria[s]?'), nombre: 'bilheteria', europeo: 'bilheteira', severidad: 'error' },
  { re: b('gerenci\\p{L}*'), nombre: 'gerenciar', europeo: 'gerir', severidad: 'error' },
  { re: b('apostila[s]?'), nombre: 'apostila', europeo: 'sebenta', severidad: 'error' },
  { re: b('grampeador\\p{L}*'), nombre: 'grampeador', europeo: 'agrafador', severidad: 'error' },
  { re: b('gibi[s]?|quadrinhos'), nombre: 'gibi/quadrinhos', europeo: 'banda desenhada', severidad: 'error' },
  { re: b('meia[s]?-cal[çc]a[s]?'), nombre: 'meia-calça', europeo: 'collants', severidad: 'error' },
  { re: b('mam[ãa]o|mam[õo]es'), nombre: 'mamão', europeo: 'papaia', severidad: 'error' },
  { re: b('xampu[s]?'), nombre: 'xampu', europeo: 'champô', severidad: 'error' },
  { re: b('c[âa]mera[s]?'), nombre: 'câmera', europeo: 'câmara', severidad: 'error' },
  { re: b('esparadrapo[s]?'), nombre: 'esparadrapo', europeo: 'penso (rápido)', severidad: 'error' },
  { re: b('acostamento[s]?'), nombre: 'acostamento', europeo: 'berma', severidad: 'error' },
  { re: b('ped[áa]gio[s]?'), nombre: 'pedágio', europeo: 'portagem', severidad: 'error' },
  { re: b('pedestre[s]?'), nombre: 'pedestre', europeo: 'peão', severidad: 'error' },
  { re: /\bcarteira de motorista\b/i, nombre: 'carteira de motorista', europeo: 'carta de condução', severidad: 'error' },
  { re: /\bfaixa de pedestres\b/i, nombre: 'faixa de pedestres', europeo: 'passadeira', severidad: 'error' },
  { re: /R\$/, nombre: 'R$ (moneda de Brasil)', europeo: 'euros — política de inmersión', severidad: 'error' },

  // AVISOS: bifrontes (homógrafo europeo legítimo) o defendibles.
  { re: b('legal'), nombre: 'legal (¿chévere?)', europeo: 'fixe/giro — legal jurídico es legítimo', severidad: 'aviso' },
  { re: b('oi'), nombre: 'oi (¿saludo?)', europeo: 'olá — «oi?» europeo es extrañeza', severidad: 'aviso' },
  { re: b('pra|pro|pros'), nombre: 'pra/pro', europeo: 'para a / para o', severidad: 'aviso' },
  { re: b('t[áa]'), nombre: 'tá', europeo: 'está', severidad: 'aviso' },
  { re: b('valeu'), nombre: 'valeu', europeo: 'obrigado', severidad: 'aviso' },
  { re: b('vov[ôo]s?|vov[óo]s?'), nombre: 'vovô/vovó', europeo: 'avô/avó', severidad: 'aviso' },
  { re: b('cal[çc]ada[s]?'), nombre: 'calçada (¿acera?)', europeo: 'passeio — calçada empedrada es legítima', severidad: 'aviso' },
  { re: b('sandu[íi]che[s]?'), nombre: 'sanduíche', europeo: 'sandes', severidad: 'aviso' },
  { re: b('cafezinho[s]?'), nombre: 'cafezinho', europeo: 'café / bica', severidad: 'aviso' },
  { re: b('tela[s]?'), nombre: 'tela (¿pantalla?)', europeo: 'ecrã — tela=lienzo es legítima', severidad: 'aviso' },
  { re: b('arquivo[s]?'), nombre: 'arquivo (¿fichero?)', europeo: 'ficheiro — arquivo=institución es legítimo', severidad: 'aviso' },
  { re: b('salvar'), nombre: 'salvar (¿guardar?)', europeo: 'guardar — salvar=rescatar es legítimo', severidad: 'aviso' },
  { re: b('bala[s]?'), nombre: 'bala (¿caramelo?)', europeo: 'rebuçado — bala=proyectil es legítima', severidad: 'aviso' },
  { re: b('grama[s]?'), nombre: 'grama (¿césped?)', europeo: 'relva — grama=gramo es legítimo', severidad: 'aviso' },
  { re: b('abacaxi[s]?'), nombre: 'abacaxi', europeo: 'ananás', severidad: 'aviso' },
  { re: b('freezer[s]?'), nombre: 'freezer', europeo: 'congelador / arca', severidad: 'aviso' },
  { re: b('esmalte[s]?'), nombre: 'esmalte (¿uñas?)', europeo: 'verniz', severidad: 'aviso' },
  { re: b('calcinha[s]?'), nombre: 'calcinha', europeo: 'cuecas', severidad: 'aviso' },
  { re: b('jaqueta[s]?'), nombre: 'jaqueta', europeo: 'blusão / casaco', severidad: 'aviso' },
  { re: b('durex'), nombre: 'durex (cinta)', europeo: 'fita-cola — en PT es marca de preservativos', severidad: 'aviso' },
  { re: b('bilh[ãa]o|bilh[õo]es'), nombre: 'bilhão', europeo: 'mil milhões / bilião (valores distintos)', severidad: 'aviso' },
  { re: b('cachorro[s]?'), nombre: 'cachorro (¿perro genérico?)', europeo: 'cão — cachorro=cría es legítimo', severidad: 'aviso' },
  { re: b('mo[çc][oa]s?'), nombre: 'moço/moça', europeo: 'rapaz/rapariga', severidad: 'aviso' },
  { re: b('privada[s]?'), nombre: 'privada (¿retrete?)', europeo: 'sanita — privada adjetivo es legítimo', severidad: 'aviso' },
  { re: b('controle[s]?'), nombre: 'controle (¿sustantivo?)', europeo: 'controlo — subjuntivo de controlar es legítimo', severidad: 'aviso' },
  { re: b('reais'), nombre: 'reais (¿moneda?)', europeo: 'euros — reais adjetivo es legítimo', severidad: 'aviso' },
  { re: /\bensino m[ée]dio\b/i, nombre: 'ensino médio', europeo: 'ensino secundário', severidad: 'aviso' },
  { re: b('CEP'), nombre: 'CEP', europeo: 'código postal', severidad: 'aviso' },
  { re: b('quatorze'), nombre: 'quatorze', europeo: 'catorze', severidad: 'aviso' },
  { re: b('a gente'), nombre: 'a gente (¿sujeto?)', europeo: 'nós — «a gente»=la gente es legítimo', severidad: 'aviso' },
];

export interface Hallazgo {
  id: string;
  campo: string;
  marcador: string;
  europeo: string;
  severidad: 'error' | 'aviso';
  /** copiado del marcador: `null` = sin heurística de contraste implícito */
  terminoEuropeo?: string | null;
  /** el marcador aparece SÓLO citado como palabra, nunca usado: no es
   *  brasileñismo del contenido. El gate lo sigue reportando —el triaje
   *  lo necesita para pedir revisión del contraste implícito— pero quien
   *  cuenta la deuda debe excluirlo. */
  mencion?: boolean;
  texto: string;
}

type Json = Record<string, unknown>;
export interface Ex extends Json { id: string; type: string; data: Json; tags?: string[]; esContrast?: string; }

/** Un ítem queda exento cuando su trabajo ES enseñar la diferencia entre
 *  variantes: entonces necesita decir `trem` o `contato` para hacerlo.
 *
 *  Los tres patrones salieron de falsos positivos reales del primer pase:
 *  `b21f2d27` mostraba «contacto … / 🇧🇷 BR: … contato» —las dos formas a
 *  propósito, con bandera— y el gate lo marcaba como error. Un gate que
 *  grita en falso acaba desactivado, así que esto importa tanto como
 *  detectar los verdaderos. */
/** ¿El marcador aparece SÓLO mencionado como palabra, nunca usado?
 *
 *  Una ficha de fonética que ilustra la vocal cerrada con «você /voˈse/»
 *  no está tratando a nadie de «você»: está citando la palabra. Y una que
 *  enseña el inventario de tratamiento —«tu / você / o senhor»— tiene que
 *  nombrarlo para enseñarlo. Marcarlas es exactamente el ruido que acaba
 *  desactivando un gate. Medido en E2#10: de 112 hallazgos de «você», al
 *  menos dos eran mención pura.
 *
 *  Se comprueba que TODAS las apariciones estén entre comillas, junto a
 *  una transcripción IPA, o en una enumeración con barras. Si una sola
 *  está suelta en una frase, el ítem NO queda exento. */
export function soloMencionado(texto: string, re: RegExp): boolean {
  const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  const apariciones = [...texto.matchAll(global)];
  if (!apariciones.length) return false;
  return apariciones.every((m) => {
    const i = m.index ?? 0;
    const antes = texto.slice(Math.max(0, i - 3), i);
    const despues = texto.slice(i + m[0].length, i + m[0].length + 12);
    return /['"«‘]\s?$/.test(antes)            // entrecomillado
      || /^\s?['"»’]/.test(despues)            // cierra comilla
      || /^\s*\/[^/]+\//.test(despues)         // seguido de IPA
      || /\/\s?$/.test(antes)                  // dentro de una enumeración con barras
      || /^\s*\//.test(despues);
  });
}

export function exento(ex: Ex): boolean {
  if (ex.tags?.includes('regional')) return true;
  const contexto = `${ex.esContrast ?? ''} ${JSON.stringify(ex.data)}`;
  return (
    // menciona explícitamente el país o el gentilicio
    /\bBrasil\b|\bbrasileir[oa]/i.test(contexto) ||
    // etiqueta contrastiva en el propio texto: «BR:», «PT:», «BR/PT»
    /\b(BR|PT|PT-PT|PT-BR)\s*[:\/]/.test(contexto) ||
    // etiqueta parentética «(BR)»/«(PT)», viva en los matching de léxico
    // («ônibus (BR) → autocarro») — la Ola V la encontró sin cubrir
    /\((BR|PT)\)/.test(contexto) ||
    // banderas usadas como marca de variante
    /🇧🇷|🇵🇹/u.test(contexto)
  );
}

/** ¿El ítem contiene el equivalente europeo del marcador encontrado?
 *  «Em Portugal, o 'ônibus' chama-se 'autocarro'» dispara `ônibus` pero
 *  ES contraste didáctico: cuarentenarlo retiraría justo lo que este
 *  curso quiere enseñar. Se comprueba la primera palabra portuguesa del
 *  campo `europeo` del marcador contra TODO el ítem. */
export function contrasteImplicito(ex: Ex, europeo: string | null | undefined): boolean {
  if (europeo === null) return false;
  if (!europeo) return false;
  // El campo `europeo` es prosa bilingüe y lleva glosas entre paréntesis.
  // La v1 tomaba la primera palabra de tres letras o más, y para el
  // marcador «você» —cuyo europeo es «tu (informal) o 3ª persona…»— eso
  // daba **«informal»**: cualquier ítem que contuviera esa palabra
  // quedaba exento. Medido: 26 ítems. Lo cazó un revisor, no la suite.
  // Se quitan los paréntesis primero y se admiten palabras de dos letras,
  // que es donde vive el término de verdad: «tu».
  const termino = europeo.replace(/\([^)]*\)/g, ' ').match(/\p{L}{3,}/u)?.[0];
  if (!termino) return false;
  const contexto = JSON.stringify(ex.data);
  return new RegExp(`(?<![\\p{L}])${termino}(?![\\p{L}])`, 'iu').test(contexto);
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


/** El texto de UN campo, listo para escanear.
 *
 *  Caso especial `fill_blank`: la frase se ENSAMBLA con sus respuestas
 *  antes de mirarla. Medido en E2#9 sobre los 407 fill_blank del corpus:
 *  ocho llevan un progresivo en gerundio («Eu estou ___ português» +
 *  answer «estudando») y **sólo uno** era visible escaneando `sentence`
 *  a secas, porque las dos mitades del brasileñismo nunca están en la
 *  misma cadena y el regex no puede casar. Los otros siete los encontró
 *  a mano una cola humana. */
function textoDeCampo(ex: Ex, campo: string): string {
  const d = ex.data as Json;
  if (ex.type === 'fill_blank' && campo === 'sentence') {
    let s = String(d.sentence ?? '');
    for (const b of (Array.isArray(d.blanks) ? d.blanks : []) as Json[]) {
      s = s.replace('___', String((b as Json).answer ?? ''));
    }
    return s;
  }
  return texto(d[campo]);
}

/** Todo el portugués del ítem, aplanado — la MISMA extracción que usa el
 *  gate, para que ningún consumidor (triage, informes) derive su propia
 *  copia y se desincronice. */
export function textoPortugues(ex: Ex): string {
  return camposPortugues(ex)
    .map((campo) => textoDeCampo(ex, campo))
    .filter(Boolean)
    .join(' ');
}

export function revisarEjercicio(ex: Ex): Hallazgo[] {
  if (exento(ex)) return [];
  const out: Hallazgo[] = [];
  for (const campo of camposPortugues(ex)) {
    const t = textoDeCampo(ex, campo);
    if (!t) continue;
    for (const m of MARCADORES) {
      const hit = t.match(m.re);
      if (!hit) continue;
      // Mención ≠ uso: citar la palabra no es escribir en brasileño. NO
      // se suprime ni se degrada el hallazgo —el triaje lo necesita para
      // pedir revisión del contraste implícito («Em Portugal, o 'ônibus'
      // chama-se '___'»), y un test que ya existía lo cazó las dos veces
      // que lo intenté—: se MARCA, y quien cuenta la deuda decide.
      const mencion = soloMencionado(t, m.re);
      out.push({
        id: ex.id, campo, marcador: m.nombre, europeo: m.europeo,
        severidad: m.severidad,
        terminoEuropeo: m.terminoEuropeo,
        mencion,
        texto: t.length > 120 ? t.slice(0, 117) + '…' : t,
      });
    }
  }
  return out;
}

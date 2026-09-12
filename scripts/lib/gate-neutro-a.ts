// scripts/lib/gate-neutro-a.ts
//
// GATE DE LA `-a` NEUTRA. Punto: `l2-neutro-a`.
//
// «En español `-a` marca femenino singular; en latín marca TAMBIÉN neutro
// plural, y el alumno lee `arma` como “un arma” durante meses.» El `varia`:
// si la palabra tiene además homógrafo femenino en español (bella, arma) o
// no (templa), porque la trampa sólo muerde en las primeras.
//
// ── DÓNDE MUERDE DE VERDAD: EL OBJETO, NO EL SUJETO ──────────────────
//
// Si el neutro plural es SUJETO, el verbo lo desmiente: «Bella magna sunt»
// lleva `sunt`, y el alumno que leyó «bella» en singular se estrella contra
// la concordancia. El ítem entonces mide la desinencia del VERBO, no la del
// nombre.
//
// Donde no hay red es en el OBJETO: «Bella videt» tiene el verbo en
// singular por su sujeto, y no dice nada del número del objeto. Ahí la `-a`
// es lo único que informa, y por eso todos los ítems de este lote ponen el
// neutro en acusativo.
//
// ── EL HOMÓGRAFO NO SE PUEDE VERIFICAR A MÁQUINA, Y SE DICE ──────────
//
// El eje del punto es si la forma coincide con una palabra española real.
// En esta máquina no hay diccionario de español —`hunspell` está instalado
// sin diccionario `es`, y `/usr/share/dict` sólo trae inglés—, así que la
// lista va escrita a mano.
//
// Y el corpus propio NO sirve de segundo camino: los documentos del
// proyecto están en español pero CITAN LATÍN a todas horas, así que
// «templa», «verba», «castra» y «maria» aparecen en ellos sin ser palabras
// españolas. Medido: 6, 23, 10 y 35 apariciones. Un corpus que contiene
// aquello que se quiere contrastar no es un camino independiente, y usarlo
// habría dado por homógrafo justo lo que el punto usa como contraejemplo.
//
// Por eso la lista es CORTA a propósito: sólo miembros que nadie discute.
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

export interface ItemNeutroA {
  id: string;
  punto: string;
  /** El nombre latino, en acusativo. */
  latin: string;
  /** La frase con el neutro dentro, sin macrones. */
  marco: string;
  /** La glosa española con `___` donde va el sintagma. */
  glosa: string;
  /** Lo que hay que escribir: «las guerras», «la guerra»… */
  respuesta: string;
  /** Las otras traducciones correctas. El latín no tiene artículo, así que
   *  la clave única suspende a quien escribe la otra lectura. */
  alternativas?: string[];
  ejes: {
    numero: 'sg' | 'pl';
    /** La palabra española con la que coincide la forma latina, cuando
     *  existe. Escrita a mano: en esta máquina no hay con qué comprobarla,
     *  y el corpus propio está contaminado de latín. */
    homografo?: { palabra: string; queEsEnEspanol: string };
  };
}

export type ClaseFalloNA =
  | 'macron-en-el-marco' | 'hueco-o-respuesta' | 'numero-mal-declarado'
  | 'homografo-sin-explicar' | 'sin-homografo-en-el-lote' | 'sin-contraste-de-numero'
  | 'estrategia-constante' | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloNA { item: string; clase: ClaseFalloNA; detalle: string }

const MACRON = /[āēīōūĀĒĪŌŪ]/;

export function revisarItemNeutroA(it: ItemNeutroA): FalloNA[] {
  const out: FalloNA[] = [];
  const push = (clase: ClaseFalloNA, detalle: string) => out.push({ item: it.id, clase, detalle });

  if (MACRON.test(it.marco)) push('macron-en-el-marco', `«${it.marco}» lleva macrón`);
  if (!it.glosa.includes('___')) push('hueco-o-respuesta', 'la glosa no tiene hueco');
  if (!it.respuesta.trim()) push('hueco-o-respuesta', 'sin respuesta');

  // El número declarado contra la FORMA: el neutro plural acaba en `-a` y el
  // singular en `-um` o en consonante. Es la comprobación del punto.
  const acabaEnA = /a$/.test(it.latin.normalize('NFC'));
  if (acabaEnA && it.ejes.numero !== 'pl')
    push('numero-mal-declarado', `«${it.latin}» acaba en «-a» y el ítem lo declara singular`);
  if (!acabaEnA && it.ejes.numero !== 'sg')
    push('numero-mal-declarado', `«${it.latin}» no acaba en «-a» y el ítem lo declara plural`);

  // Y contra la RESPUESTA, que es lo que el alumno escribe.
  const respPlural = /^(las|los|unos|unas)\b/.test(it.respuesta.trim().toLowerCase());
  if (respPlural !== (it.ejes.numero === 'pl'))
    push('numero-mal-declarado',
      `el ítem declara ${it.ejes.numero} y la respuesta «${it.respuesta}» va en ${respPlural ? 'plural' : 'singular'}`);

  if (it.ejes.homografo && !it.ejes.homografo.queEsEnEspanol)
    push('homografo-sin-explicar', 'declara homógrafo y no dice qué es esa palabra en español');

  return out;
}

export function revisarLoteNeutroA(items: ItemNeutroA[]): { fallos: FalloNA[]; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemNeutroA);
  const push = (clase: ClaseFalloNA, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });

  // El `varia` dice que la trampa SÓLO muerde con homógrafo. Sin ítems de
  // los dos tipos, el eje no existe.
  const con = items.filter((it) => it.ejes.homografo).length;
  if (con === 0) push('sin-homografo-en-el-lote', 'ningún ítem trae la forma que coincide con una palabra española: el lote no examina el eje del punto');
  if (con === items.length) push('sin-homografo-en-el-lote', 'todos los ítems tienen homógrafo y falta el contraste sin él');

  // Sin singulares, «contestar siempre en plural» resuelve el lote entero.
  const pl = items.filter((it) => it.ejes.numero === 'pl').length;
  if (pl === 0 || pl === items.length)
    push('sin-contraste-de-numero', `${pl} de ${items.length} en plural: contestar siempre lo mismo resuelve el lote`);
  else if (Math.abs(pl / items.length - 0.5) > 0.1)
    push('estrategia-constante',
      `${pl} de ${items.length} en plural: contestar siempre el más frecuente saca el ${(100 * Math.max(pl, items.length - pl) / items.length).toFixed(0)} %, por encima del 50 % del azar de dos valores`);

  const sep = separablePorPosicion(items.map((it) => (it.ejes.numero === 'pl' ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const cobertura: Cobertura[] = [
    { comprobacion: 'el número contra la forma y la respuesta', decididos: items.length, total: items.length },
    { comprobacion: 'ítems donde la trampa muerde de verdad', decididos: con, total: items.length,
      motivoDeLosQueQuedanFuera: 'los que no coinciden con ninguna palabra española: hacen falta como contraste, pero en ellos la trampa no muerde y el punto lo dice' },
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, cobertura };
}

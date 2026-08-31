// scripts/lib/fidelidad-mediacion.ts
//
// Los cinco gates de la familia MEDIACIÓN-ÍTEM v1 («fidelidad de relay»).
// Ver `docs/contenido/2026-08-31-familia-fidelidad-mediacion-v1.md`.
//
// La familia existe porque el lote industrial 3 midió que 12 de sus 20
// errores fueron trasvase roto rúbrica↔gold. Un ítem cerrado no tiene
// rúbrica, así que esa clase desaparece por construcción — pero aparece
// otra: que el autor se equivoque al declarar QUÉ transformación aplicó,
// o que fabrique distractores que se descartan sin leer el recado. Estos
// gates son contra eso, y son binarios: ninguno pide juicio.

export type Transformacion = 'FIEL' | 'PLAZO' | 'OMISIÓN' | 'INVENCIÓN' | 'ALTERACIÓN' | 'REASIGNACIÓN';

export interface ItemFidelidad {
  id: string;
  fuente: string;
  datos: string[];      // la lista de datos que el autor declara en la fuente
  fiel: string;         // el recado línea base
  mostrado: string;     // el recado que ve el alumno
  transformacion: Transformacion;
  opciones: string[];
  correctIndex: number;
}

// ── Tipos de dato que el gate sabe razonar ───────────────────────────
export type TipoDato = 'DIA' | 'HORA' | 'PLAZO' | 'LUGAR' | 'PRECIO' | 'AGENTE' | 'MOTIVO' | 'CONDICION' | '*';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** De la etiqueta de una opción al tipo de dato que nombra. «*» = vale
 *  para cualquier fuente (la etiqueta de invención y la de «no falla
 *  nada» no dependen de qué datos tenga el aviso). */
export function tiposDeEtiqueta(etiqueta: string): TipoDato[] {
  const e = norm(etiqueta);
  if (/no (falla|falha)|nao falha|nada/.test(e)) return ['*'];
  if (/anade|anado|acrescenta|inventa|no dice|nao diz/.test(e)) return ['*'];
  const t: TipoDato[] = [];
  if (/plazo|prazo/.test(e)) t.push('PLAZO');
  if (/\bhora|franja|horario/.test(e)) t.push('HORA');
  if (/\bdia\b|\bdias\b|fecha|data/.test(e)) t.push('DIA');
  if (/sitio|lugar|donde|onde|aula|sala|destino|direccion|morada/.test(e)) t.push('LUGAR');
  if (/precio|importe|euro|preco/.test(e)) t.push('PRECIO');
  if (/quien|quem/.test(e)) t.push('AGENTE');
  if (/motivo|porque|razon/.test(e)) t.push('MOTIVO');
  if (/condicion|condicao|opcion|opcao|excepcion|excecao|codigo|llevar|entregar|pasa despues|acontece/.test(e)) t.push('CONDICION');
  return t.length ? t : ['CONDICION'];
}

/** Los tipos que el autor DECLARA en la lista de datos del ítem. */
export function tiposDeclarados(datos: string[]): Set<TipoDato> {
  const out = new Set<TipoDato>();
  for (const d of datos) {
    for (const t of tiposDeEtiqueta(d)) if (t !== '*') out.add(t);
    // …y también por lo que el VALOR del dato enseña: «reapertura (día 16
    // a las 8h)» declara una hora aunque la etiqueta no diga «hora».
    // Mirar sólo la etiqueta hacía saltar el gate 4 contra ítems buenos.
    for (const [t, re] of Object.entries(MARCAS) as [TipoDato, RegExp][]) if (re.test(d)) out.add(t);
  }
  return out;
}

// Marcas que una máquina SÍ puede ver en la fuente. Sólo se comprueban
// los tipos bien marcados: exigirle a un regex que reconozca un AGENTE o
// un MOTIVO sería inventar precisión.
//
// OJO con `\b`: en JS sin flag `u` la frontera es ASCII, así que `\baté\b`
// NO casa con «até às 17h» — la `é` no es carácter de palabra y no hay
// frontera después. Costó un test en rojo. Aquí se usan lookarounds
// Unicode explícitos.
const NOLETRA = '(?<![\\p{L}])'; const NOLETRA_F = '(?![\\p{L}])';
const pal = (...ws: string[]) => new RegExp(`${NOLETRA}(?:${ws.join('|')})${NOLETRA_F}`, 'iu');
const MARCAS: Partial<Record<TipoDato, RegExp>> = {
  // Las horas se escriben con cifra («17h», «às 9») pero también con
  // letra («de nueve a doce»), y la franja del día es un dato horario
  // igual («amanhã de manhã»). Mirar sólo las cifras hacía saltar el
  // gate 4 contra MFID-04, que es un ítem bueno.
  HORA: /(?<![\p{L}])\d{1,2}\s?[h:]\s?\d{0,2}|(?<![\p{L}])às?\s+\d|(?<![\p{L}])a\s+las\s+\d|meio-dia|mediodía|(?<![\p{L}])(?:de|das|entre|às|a|las|às)\s+(?:una|dos|tr[eê]s|cuatro|cinco|seis|siete|sete|ocho|oito|nueve|nove|diez|dez|once|onze|doce|doze)(?![\p{L}])|(?<![\p{L}])(?:de|das|entre)\s+\d{1,2}\s*(?:h|:\d{2})?\s+(?:a|às|as|y|e)\s+\d{1,2}|(?<![\p{L}])(?:ma[nñ]ana|manh[ãa]|tarde|noche|noite|madrugada)(?![\p{L}])/iu,
  DIA: /(?<![\p{L}])(segunda|terça|quarta|quinta|sexta|sábado|domingo|lunes|martes|miércoles|jueves|viernes)|(?<![\p{L}])d[ií]a\s+\d+|(?<![\p{L}])el\s+\d{1,2}(?![\p{L}])|(?<![\p{L}])(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|enero|febrero|marzo|mayo|junio|julio|septiembre|octubre|noviembre|diciembre)(?![\p{L}])/iu,
  PLAZO: pal('at[ée]', 'hasta', 'inclusive', 'antes\\s+de', 'a\\s+partir\\s+d[\\p{L}]*'),
  PRECIO: /€|(?<![\p{L}])euros?(?![\p{L}])|\d+,\d{2}(?![\p{L}])/iu,
};

export interface Coherencia { ok: boolean; faltan: TipoDato[] }

/** Gate 3 · el dato que el autor declara tiene que estar en la fuente,
 *  para los tipos que una máquina puede ver sin fingir que entiende. */
export function coherenciaDatosFuente(datos: string[], fuente: string): Coherencia {
  const faltan: TipoDato[] = [];
  for (const t of tiposDeclarados(datos)) {
    const re = MARCAS[t];
    if (re && !re.test(fuente)) faltan.push(t);
  }
  return { ok: faltan.length === 0, faltan };
}

export interface Tramo { quitado: string; puesto: string; identicos: boolean; saltos: number }

/** Gate 1 · aísla el tramo que cambió entre el recado fiel y el mostrado.
 *  `saltos` cuenta cuántos bloques separados difieren: más de uno hace
 *  ambigua la clave, porque el alumno no sabría cuál de los dos fallos
 *  se le pregunta. */
export function tramoCambiado(fiel: string, mostrado: string): Tramo {
  // La puntuación va como token aparte: si no, «cocina.» y «cocina» son
  // palabras distintas y una adición pura al final de la frase se ve como
  // un cambio con quitado. Test en rojo que lo cazó: MFID-04.
  const tok = (s: string) => s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*|[^\s\p{L}\p{N}]/gu) ?? [];
  const a = tok(fiel), b = tok(mostrado);
  if (fiel === mostrado) return { quitado: '', puesto: '', identicos: true, saltos: 0 };

  // LCS por palabras — el diff mínimo, para no confundir un
  // desplazamiento con dos cambios.
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }
  // Una transformación que reescribe un sintagma casi siempre conserva
  // alguna palabra («ir», «el domingo 20»), y el LCS la alinea partiendo
  // el cambio en dos bloques. Por eso los bloques separados por MENOS de
  // PEGA tokens comunes se funden: son el mismo retoque. Con 3 se funden
  // «hasta el|domingo 20|incluido» y se siguen separando dos cambios
  // reales (medido en los tests).
  const PEGA = 3;
  const quitados: string[][] = []; const puestos: string[][] = [];
  const huecos: number[] = [];   // tokens comunes entre bloque y bloque
  let i = 0, j = 0, enBloque = false, comunesDesdeCierre = 0;
  let qActual: string[] = [], pActual: string[] = [];
  const cerrar = () => {
    if (!enBloque) return;
    quitados.push(qActual); puestos.push(pActual); huecos.push(comunesDesdeCierre);
    qActual = []; pActual = []; enBloque = false; comunesDesdeCierre = 0;
  };
  while (i < n && j < m) {
    if (a[i] === b[j]) { cerrar(); comunesDesdeCierre++; i++; j++; continue; }
    enBloque = true;
    if (dp[i + 1]![j]! >= dp[i]![j + 1]!) { qActual.push(a[i]!); i++; }
    else { pActual.push(b[j]!); j++; }
  }
  while (i < n) { enBloque = true; qActual.push(a[i]!); i++; }
  while (j < m) { enBloque = true; pActual.push(b[j]!); j++; }
  cerrar();

  // Fusión: el hueco[k] son los tokens comunes ANTES del bloque k.
  const qF: string[][] = []; const pF: string[][] = [];
  for (let k = 0; k < quitados.length; k++) {
    const pegaAlAnterior = k > 0 && (huecos[k] ?? 99) < PEGA;
    if (pegaAlAnterior) {
      qF[qF.length - 1]!.push(...quitados[k]!);
      pF[pF.length - 1]!.push(...puestos[k]!);
    } else { qF.push([...quitados[k]!]); pF.push([...puestos[k]!]); }
  }

  const pegar = (ts: string[]) => ts.join(' ').replace(/\s+([,.;:!?»)])/g, '$1').replace(/([«(])\s+/g, '$1').trim();
  return {
    quitado: qF.map(pegar).filter(Boolean).join(' … '),
    puesto: pF.map(pegar).filter(Boolean).join(' … '),
    identicos: false,
    saltos: qF.length,
  };
}

const CONTENIDO = (s: string) => norm(s).match(/[\p{L}\p{N}]+/gu)?.filter((w) => w.length > 3) ?? [];

export interface Veredicto { fallos: string[]; tramo: Tramo }

export function validarItem(x: ItemFidelidad): Veredicto {
  const fallos: string[] = [];
  const tramo = tramoCambiado(x.fiel, x.mostrado);

  // Gate 5 · FIEL exige recados idénticos, y sólo FIEL los admite.
  if (x.transformacion === 'FIEL' && !tramo.identicos) {
    fallos.push(`${x.id}: declarado FIEL pero el recado mostrado difiere del fiel («${tramo.quitado}» → «${tramo.puesto}»)`);
  }
  if (x.transformacion !== 'FIEL' && tramo.identicos) {
    fallos.push(`${x.id}: declarado ${x.transformacion} pero los dos recados son idénticos: no se aplicó ninguna transformación`);
  }

  // Gate 1 · una sola transformación.
  if (tramo.saltos > 1) {
    fallos.push(`${x.id}: el recado mostrado no aplica una sola transformación — cambia ${tramo.saltos} tramos separados y la clave queda ambigua`);
  }

  // Gate 3-bis · la transformación tiene que ser la que dice ser.
  if (x.transformacion === 'OMISIÓN' && tramo.puesto) {
    fallos.push(`${x.id}: declarado OMISIÓN pero el recado AÑADE «${tramo.puesto}»`);
  }
  if (x.transformacion === 'INVENCIÓN') {
    if (tramo.quitado) fallos.push(`${x.id}: declarado INVENCIÓN pero el recado también QUITA «${tramo.quitado}»`);
    // lo añadido no puede estar ya en la fuente: si está, no se inventó nada
    const fuente = new Set(CONTENIDO(x.fuente));
    const nuevas = CONTENIDO(tramo.puesto);
    const yaEstaban = nuevas.filter((w) => fuente.has(w));
    if (nuevas.length && yaEstaban.length === nuevas.length) {
      fallos.push(`${x.id}: declarado INVENCIÓN pero todo lo añadido ya está en la fuente (${yaEstaban.join(', ')}): eso no es inventar`);
    }
  }
  if (x.transformacion === 'PLAZO' && !MARCAS.PLAZO!.test(x.fuente)) {
    fallos.push(`${x.id}: declarado PLAZO pero la fuente no tiene ningún marcador inclusivo («até», «hasta», «inclusive»)`);
  }

  // Gate 3 · los datos declarados existen en la fuente.
  const coh = coherenciaDatosFuente(x.datos, x.fuente);
  if (!coh.ok) fallos.push(`${x.id}: declara datos que la fuente no trae: ${coh.faltan.join(', ')}`);

  // Gate 2 · la clave apunta a la etiqueta de la transformación aplicada.
  const clave = x.opciones[x.correctIndex] ?? '';
  const esperado: Record<Transformacion, RegExp> = {
    FIEL: /no falla nada|nao falha nada|não falha nada/i,
    PLAZO: /plazo|prazo/i,
    'OMISIÓN': /falta|falla?\b/i,
    'INVENCIÓN': /añade|anade|acrescenta|no dice|não diz/i,
    'ALTERACIÓN': /cambia|muda/i,
    'REASIGNACIÓN': /qui[eé]n|quem/i,
  };
  if (!esperado[x.transformacion].test(norm(clave) === clave ? clave : clave)) {
    fallos.push(`${x.id}: la clave «${clave}» no nombra la transformación declarada (${x.transformacion})`);
  }

  // Gate 4 · los distractores tienen que ser plausibles: cada etiqueta
  // falsa nombra un tipo de dato que la fuente CONTIENE. Si no, el ítem
  // se resuelve por eliminación sin leer el recado.
  const declarados = tiposDeclarados(x.datos);
  for (const [i, op] of x.opciones.entries()) {
    if (i === x.correctIndex) continue;
    const tipos = tiposDeEtiqueta(op);
    if (tipos.includes('*')) continue;
    if (!tipos.some((t) => declarados.has(t))) {
      fallos.push(`${x.id}: el distractor «${op}» nombra ${tipos.join('/')}, que no está entre los datos de la fuente: se descarta sin leer el recado`);
    }
  }

  // Higiene de forma.
  if (x.opciones.length !== 4) fallos.push(`${x.id}: ${x.opciones.length} opciones, la familia pide 4`);
  if (new Set(x.opciones).size !== x.opciones.length) fallos.push(`${x.id}: opciones repetidas`);

  return { fallos, tramo };
}

export interface ResumenLote {
  porPosicion: number[];
  porTransformacion: Record<string, number>;
  longitudClave: { clave: number; distractores: number };
  fallos: string[];
}

/** Los atajos que sólo se ven sobre el lote entero, no ítem a ítem. */
export function auditarLote(items: ItemFidelidad[]): ResumenLote {
  const porPosicion = [0, 0, 0, 0];
  const porTransformacion: Record<string, number> = {};
  let sumaClave = 0, nClave = 0, sumaDist = 0, nDist = 0;
  const fallos: string[] = [];
  for (const x of items) {
    porPosicion[x.correctIndex] = (porPosicion[x.correctIndex] ?? 0) + 1;
    porTransformacion[x.transformacion] = (porTransformacion[x.transformacion] ?? 0) + 1;
    for (const [i, op] of x.opciones.entries()) {
      if (i === x.correctIndex) { sumaClave += op.length; nClave++; } else { sumaDist += op.length; nDist++; }
    }
    fallos.push(...validarItem(x).fallos);
  }
  const clave = nClave ? Math.round(sumaClave / nClave) : 0;
  const distractores = nDist ? Math.round(sumaDist / nDist) : 0;
  // Atajo de posición: con 24 ítems y 4 posiciones, el uniforme es 6.
  if (items.length >= 12 && Math.max(...porPosicion) - Math.min(...porPosicion) > Math.ceil(items.length / 6)) {
    fallos.push(`LOTE: la clave se reparte ${porPosicion.join('/')} — demasiado lejos del uniforme, se acierta por posición`);
  }
  // Atajo de longitud: si la clave mide sistemáticamente distinto, se
  // acierta midiendo. 15 % es el margen que la familia se permite.
  if (clave && distractores && Math.abs(clave - distractores) / distractores > 0.15) {
    fallos.push(`LOTE: la clave mide ${clave} caracteres de media y los distractores ${distractores} — se acierta midiendo`);
  }
  const fiel = porTransformacion['FIEL'] ?? 0;
  if (items.length >= 12 && fiel / items.length < 0.2) {
    fallos.push(`LOTE: sólo ${fiel} de ${items.length} son FIEL (<20 %) — el alumno aprende que «siempre falla algo» y deja de comprobar`);
  }
  return { porPosicion, porTransformacion, longitudClave: { clave, distractores }, fallos };
}

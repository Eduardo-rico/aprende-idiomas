// scripts/lib/gate-inventario-vs-lexico.ts
//
// ¿PUEDE EL LEXICÓN SATISFACER LO QUE EL PUNTO EXIGE?
//
// Nace de haberlo descubierto CINCO VECES a mano, siempre igual: se va a
// escribir un lote, se lee el `varia`, y resulta que pide algo que el
// lexicón no tiene.
//
//   · `l5-conjugacion-por-infinitivo` — «hay que traer la mixta»: cero verbos
//     de conjugación mixta
//   · `l6-perfectum` — enumera el perfecto reduplicado: cero reduplicados
//   · `l5-sum-y-compuestos` — nombra `possum`, `adsum`, `absum`, `prōsum`:
//     ninguno existía
//   · `l2-cuarta` — «los pocos femeninos»: un solo femenino de 4.ª
//   · `l4-adjetivo-3a` — adjetivos de 3.ª: cero, y sigue así
//
// El patrón es constante: **el punto describe lo que la lengua tiene y el
// lexicón trae lo que hacía falta hasta ayer**. Descubrirlo lote a lote
// cuesta una tarde cada vez y encima tienta a escribir el lote sin esa pata,
// que es como se cuela un `varia` decorativo.
//
// ── LO QUE ESTE GATE ES Y LO QUE NO ──────────────────────────────────
//
// Es una HEURÍSTICA SOBRE PROSA: busca palabras de categoría en el texto del
// punto y comprueba si el lexicón tiene al menos un ejemplar. No entiende el
// punto, así que puede pasar por alto exigencias dichas de otra manera —y
// por eso su silencio no prueba nada—. Lo que sí hace es no callar cuando la
// exigencia está escrita con las palabras de siempre.
//
// Se declara así, en vez de venderlo como completo, por lo mismo que el
// filtro del macrón: quien lo reejecute y no vea nada tiene que saber qué no
// ha mirado.
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { declinacionDe, esMixta } from '../../lib/data/languages/la/paradigma-la';
import { COMPUESTOS_DE_SUM } from '../../lib/data/languages/la/compuestos-de-sum';

export interface Exigencia {
  /** Cómo se nombra en la prosa de los puntos. */
  patron: RegExp;
  /** Qué es, para el informe. */
  nombre: string;
  /** Cuántos ejemplares hay en el lexicón. */
  cuantosHay: () => number;
  /** Cuántos hacen falta como mínimo para que un lote pueda medir el eje.
   *  Dos, no uno: con un solo ejemplar el lote mide un lema, no una clase. */
  minimo: number;
}

/** ¿Es reduplicado este perfecto?
 *
 *  La reduplicación copia la consonante inicial y le pone una vocal:
 *  `de-dī`, `ce-cidī`, `te-tigī`, `cu-currī`. Con un grupo `s+consonante` la
 *  copiada es la SEGUNDA: `stetī` es `ste-tī`, no `se-tetī`.
 *
 *  La primera versión de esto comparaba los dos primeros caracteres con el
 *  tercero y contaba `cecidī` pero NO `stetī` — o sea, decía que había un
 *  reduplicado cuando había dos, justo después de que yo añadiera los dos.
 *  Un gate que cuenta mal el material dice que falta lo que sobra. */
export function esReduplicado(perfecto: string | undefined): boolean {
  if (!perfecto) return false;
  const p = perfecto.normalize('NFD').replace(/[\u0304\u0306]/g, '').normalize('NFC').toLowerCase();
  if (p.length < 4) return false;
  // Con `s` + consonante, la consonante copiada es la segunda.
  const i = /^s[^aeiou]/.test(p) ? 1 : 0;
  const c = p[i];
  const v = p[i + 1];
  if (!c || !v || /[aeiou]/.test(c) || !/[aeiou]/.test(v)) return false;
  return p[i + 2] === c;
}

const decl = (d: string) => () => NOMBRES_L1.filter((n) => {
  try { return declinacionDe(n) === d; } catch { return false; }
}).length;

export const EXIGENCIAS: Exigencia[] = [
  { patron: /\bmixta\b/i, nombre: 'verbos de conjugación mixta',
    cuantosHay: () => VERBOS_L1.filter(esMixta).length, minimo: 2 },
  { patron: /reduplicad/i, nombre: 'verbos de perfecto reduplicado',
    cuantosHay: () => VERBOS_L1.filter((v) => esReduplicado(v.perfecto)).length, minimo: 2 },
  { patron: /adjetivos? de (la )?(3\.ª|tercera)|\badjetivo-3a\b/i, nombre: 'adjetivos de 3.ª declinación',
    cuantosHay: () => ADJETIVOS_L1.filter((a) => !/us$|er$/.test(a.lema.normalize('NFC'))).length, minimo: 2 },
  { patron: /femenin\w+ \(manus|pocos femeninos/i, nombre: 'nombres femeninos de 4.ª',
    cuantosHay: () => NOMBRES_L1.filter((n) => {
      try { return declinacionDe(n) === '4ª' && n.genero === 'f'; } catch { return false; }
    }).length, minimo: 2 },
  { patron: /possum|adsum|absum|prōsum/i, nombre: 'compuestos de `sum`',
    cuantosHay: () => COMPUESTOS_DE_SUM.length, minimo: 2 },
  { patron: /5\.ª|quinta declinación/i, nombre: 'nombres de 5.ª', cuantosHay: decl('5ª'), minimo: 2 },
  { patron: /4\.ª|cuarta declinación/i, nombre: 'nombres de 4.ª', cuantosHay: decl('4ª'), minimo: 2 },
  { patron: /temas? en `?-i`?|tema en -i/i, nombre: 'nombres de tema en -i',
    cuantosHay: () => NOMBRES_L1.filter((n) => n.iStem).length, minimo: 2 },
  // Los irregulares de alta frecuencia que el currículo nombra. No basta con
  // que estén en el lexicón: `conjugar` tiene que saber producirlos, y hoy
  // sólo sabe `sum`. `ferō` hace «fers», «fert», «fertis» — nada de eso sale
  // de una regla.
  //
  // EL PATRÓN VA ACOTADO A LOS NOMBRES DE LOS VERBOS, no a la palabra
  // «irregulares». Con `/\birregulares\b/` salían SIETE puntos y cuatro
  // eran falsos: `l2-segunda`, `l4-comparativo` y hasta `l5-imperativo`
  // usan la palabra para otra cosa. Un gate que marca la mitad de los casos
  // no lo lee nadie, y este filtro es exactamente del tipo que ya matamos
  // una vez por ruidoso.
  // LA VOZ PASIVA. La auditoría inversa la midió: 10.669 tokens del corpus
  // anotados `Voice=Pass` y la máquina no produce ninguno. Cualquier punto
  // cuyo `varia` diga «la voz» pide algo que hoy no existe, y sin este
  // renglón se escribiría el lote con ese eje decorativo — que es justo lo
  // que este gate está para evitar.
  // EL PATRÓN ES «la voz DEL/DE» y no «la voz» a secas. Con el ancho salían
  // 15 puntos y TRES eran de fonología, donde «voz» significa el sonido:
  // «lo que hace que la voz italiana produzca el /v/», «por eso la voz
  // funciona». Es el mismo tropiezo que con `/irregulares/`, y van dos.
  { patron: /la voz (del|de la|activa|pasiva)|voz pasiva|\bpasiv[ao]s?\b|deponente/i,
    nombre: 'formas de voz pasiva', cuantosHay: () => 0, minimo: 1 },
  { patron: /eō, ferō|ferō, volō|volō, nōlō|nōlō, mālō/i, nombre: 'verbos irregulares con máquina',
    cuantosHay: () => VERBOS_L1.filter((v) => ['sum', 'eō', 'ferō', 'volō', 'nōlō', 'mālō', 'fīō'].includes(v.lema)).length,
    minimo: 3 },
  { patron: /\b800\b|núcleo de 800/i, nombre: 'lemas del núcleo de 800',
    cuantosHay: () => NOMBRES_L1.length + VERBOS_L1.length + ADJETIVOS_L1.length, minimo: 800 },
];

export interface Insatisfecho {
  punto: string;
  peldano: string;
  exigencia: string;
  hay: number;
  minimo: number;
}

export function buscarInsatisfechos(
  puntos: { id: string; peldano: string; descripcion: string; varia?: string; excepcion?: string; nombre: string }[],
): Insatisfecho[] {
  const out: Insatisfecho[] = [];
  for (const p of puntos) {
    // El `id` va DENTRO del texto buscado a propósito. La prosa de los
    // puntos nombra las categorías de muchas maneras —«adjetivos de la
    // tercera», «de 3.ª», «tema en -i»— y cada forma nueva es un fallo del
    // patrón. Los ids, en cambio, son sistemáticos: `l4-adjetivo-3a`,
    // `l2-cuarta`, `l2-quinta`. Es un segundo camino más pobre pero más
    // regular, y fue el que hizo falta: el patrón pedía «de 3.ª» y el punto
    // dice «Adjetivos de la tercera».
    const texto = [p.id, p.nombre, p.descripcion, p.varia, p.excepcion].filter(Boolean).join(' ');
    for (const e of EXIGENCIAS) {
      if (!e.patron.test(texto)) continue;
      const hay = e.cuantosHay();
      if (hay < e.minimo)
        out.push({ punto: p.id, peldano: p.peldano, exigencia: e.nombre, hay, minimo: e.minimo });
    }
  }
  return out;
}

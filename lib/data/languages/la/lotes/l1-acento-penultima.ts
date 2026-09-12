// lib/data/languages/la/lotes/l1-acento-penultima.ts
//
// PRIMER LOTE DE LA REGLA DE LA PENÚLTIMA. Punto: `l1-acento-penultima`,
// que pide 20 ítems.
//
// «Penúltima larga → tónica (amīcus); penúltima breve → antepenúltima
// (dominus). El acento latino no se escribe porque se deduce, y sólo se
// deduce si hay mácrons.»
//
// ── DOS DISTORSIONES DELIBERADAS, Y LAS DOS MEDIDAS ──────────────────
//
// 1 · **El 62,4 % de las 2.174 formas de L1 son llanas.** Quien conteste
//     «la penúltima» a todo acierta seis de cada diez sin saber latín. El
//     lote va **10 y 10** en vez de copiar la proporción de la lengua, y el
//     gate lo exige.
//
// 2 · **La penúltima larga POR POSICIÓN es el 6,3 % de las formas
//     atestiguadas.** Es la única categoría que refuta mirar sólo el
//     mácrón, así que respetar su proporción daría 1,3 ítems de la mitad
//     difícil del punto. Van **5 de 20**, o sea el 25 %.
//
// (Las dos cifras cambiaron el 2026-09-12 y la corrección importa: las
// primeras —61,5 % y 3,8 %— salieron de un enumerador que miraba tres
// tablas de diez y se dejaba 745 formas. No cambian ninguna decisión del
// lote, pero una cifra que se cita tiene que ser la que sale.)
//
// ── UNA CATEGORÍA DEL DESCRIPTOR QUE NO EXISTE ───────────────────────
//
// «Larga por naturaleza» incluye el diptongo, y **en L1 no hay ni una forma
// con diptongo en la penúltima**: cero de 2.174. No es un hueco del lote,
// es que la categoría está vacía en el lexicón. El gate lo declara como
// resultado en vez de dejar la cobertura en cero sin explicación.
//
// ── Y UNA AFIRMACIÓN DEL MATERIAL QUE EL CORPUS NO SOSTIENE ──────────
//
// El `motivo` de `l1-larga-por-posicion` decía que «el alumno que sólo mira
// el mácrón se equivoca en la mitad de las palabras». Medido: **el 6,3 % de
// las formas atestiguadas y el 0,7 % de los tokens**. Corregido en el
// inventario el 2026-09-12, con la medida y con la distinción que el
// ataque adversarial destapó: la afirmación probablemente confundía dos
// errores distintos, y el grande es el otro —el instinto castellano de
// acentuar siempre la penúltima falla en el 34,4 % de las formas y el
// 10,6 % de los tokens—, que es justo lo que enseña ESTE punto.
//
// ── LAS PALABRAS SON LAS QUE EL ALUMNO VA A LEER ─────────────────────
//
// Todas están atestiguadas y la mayoría son de altísima frecuencia:
// `dīcit` ×262, `Deus` ×271, `fīlius` ×162, `dominī` ×173. El acento de
// `Deus` es además el que un fallo del propio repositorio daba mal hasta
// hoy: las dos implementaciones lo tenían por monosílabo.
import type { ItemAcento } from '../../../../../scripts/lib/gate-acento-la';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

type Def = [id: string, palabra: string, respuesta: string, glosa: string];

// ── LLANAS: la penúltima es larga ──
const LLANAS: Def[] = [
  // por POSICIÓN · sin mácrón, la sílaba cerrada la alarga
  ['la-ac-01', 'magister', 'gis', 'el maestro'],
  ['la-ac-02', 'puella', 'el', 'la niña'],
  ['la-ac-03', 'vīdistī', 'dis', 'viste'],
  ['la-ac-04', 'fēcistis', 'cis', 'hicisteis'],
  ['la-ac-05', 'habuistis', 'is', 'tuvisteis'],
  // por MÁCRON · la cantidad está escrita
  ['la-ac-06', 'cīvitātem', 'tā', 'la ciudad (acusativo)'],
  ['la-ac-07', 'habēre', 'bē', 'tener'],
  ['la-ac-08', 'virtūte', 'tū', 'con virtud'],
  // BISÍLABOS · la excepción declarada: no hay antepenúltima donde caer
  ['la-ac-09', 'Deus', 'de', 'Dios'],
  // No lleva `dīxit`, aunque era la forma más frecuente del corpus (×517):
  // el silabeo tradicional parte `dīx-it`, porque la `x` vale por `k`+`s` y
  // cierra la sílaba, y este lote pide la CADENA de la tónica. Medido: en
  // las 85 formas de L1 con `x` el silabeo no mueve el acento ni una vez —
  // sólo cambia cómo se escribe la sílaba—, pero aquí eso basta para que la
  // respuesta sea discutible. `dīcit` no tiene el problema.
  ['la-ac-10', 'dīcit', 'dī', 'dice'],
];

// ── ESDRÚJULAS: la penúltima es breve y el acento se va atrás ──
const ESDRUJULAS: Def[] = [
  ['la-ac-11', 'dominī', 'do', 'del señor'],
  ['la-ac-12', 'fīlius', 'fī', 'el hijo'],
  ['la-ac-13', 'spīritus', 'spī', 'el espíritu'],
  ['la-ac-14', 'nōmine', 'nō', 'con el nombre'],
  ['la-ac-15', 'facere', 'fa', 'hacer'],
  ['la-ac-16', 'tempore', 'tem', 'en el tiempo'],
  ['la-ac-17', 'discipulī', 'ci', 'del discípulo'],
  ['la-ac-18', 'hominibus', 'mi', 'a los hombres'],
  ['la-ac-19', 'populī', 'po', 'del pueblo'],
  ['la-ac-20', 'manibus', 'ma', 'con las manos'],
];

export const SEMILLA_DE_ORDEN = 1;

import { tipoDeAcento } from '../../../../../scripts/lib/atestar-acento';

const FUENTE: ItemAcento[] = [...LLANAS, ...ESDRUJULAS].map(([id, palabra, respuesta, glosa]) => {
  const t = tipoDeAcento(palabra);
  return {
    id, punto: 'l1-acento-penultima', palabra, respuesta, glosa,
    // La pista dice CUÁNTAS sílabas hay —que es lo que separa este punto
    // del silabeo, otra destreza— y nada más. La primera versión decía
    // «¿dónde cae el acento?» y el gate la rechazó con razón: «dónde» lleva
    // «de» dentro, que es la respuesta de `Deus`, y «el» es la de `puella`.
    // Una pista en prosa española no puede convivir con respuestas de dos
    // letras.
    pista: `${t.silabas.length} sílabas`,
    ejes: { tipo: t.tipo, silabas: t.silabas.length },
  };
});

export const LOTE_ACENTO_PENULTIMA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// tests/unit/ayuda/fuera-de-l1.ts
//
// UNA PALABRA QUE LA MÁQUINA NO PRODUCE, calculada y no escrita.
//
// ── POR QUÉ ──────────────────────────────────────────────────────────
//
// Media docena de gates tienen un veneno que dice «este marco usa una
// palabra de fuera de L1». El veneno se escribía a mano —`Sē`, `Vērum`,
// `Mīles`— y **caduca en cuanto el lexicón crece**: las tres dejaron de
// envenenar, cada una en su día, y la última se llevó siete tests por
// delante al importar el núcleo.
//
// Un veneno que deja de envenenar no falla ruidosamente: el test se pone
// verde y deja de comprobar nada. Sólo se entera el que AFIRMA que el
// veneno envenena, y aun así hay que ir a sustituirlo a mano.
//
// La forma de que no vuelva a pasar es no escribirlo: se CALCULA contra el
// enumerador del dominio, que es la misma fuente que consulta el gate.
import { formasUnicasDeL1 } from '@/lib/data/languages/la/todas-las-formas';

const sinM = (x: string) => x.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase();

/** Candidatas con forma latina creíble. La primera que la máquina no
 *  produzca es la que vale. */
const CANDIDATAS = [
  'Cōnsōbrīnus', 'Ēlephantus', 'Vituperātiō', 'Prōpugnāculum', 'Harēna',
  'Sarcophagus', 'Crepundia', 'Obstetrīx', 'Fūnambulus', 'Quisquiliae',
];

let cache: string | null = null;

/** Una palabra latina que el enumerador del dominio NO produce. Lanza si
 *  todas las candidatas han entrado al lexicón, que es la señal de que hay
 *  que ampliar la lista — y es un fallo ruidoso, no un test que se apaga. */
export function palabraFueraDeL1(): string {
  if (cache) return cache;
  const dominio = new Set(formasUnicasDeL1().map(sinM));
  const libre = CANDIDATAS.find((c) => !dominio.has(sinM(c)));
  if (!libre) {
    throw new Error(
      'todas las candidatas de `fuera-de-l1.ts` han entrado al lexicón: '
      + 'añade otras. Un veneno que ya no envenena deja el test verde y ciego.',
    );
  }
  cache = libre;
  return libre;
}

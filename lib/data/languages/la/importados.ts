// lib/data/languages/la/importados.ts — EL PARADIGMA QUE VIENE DE FUERA.
//
// Los nombres y verbos que entran desde `macrones.json`, con su paradigma
// derivado de la plantilla de la fuente y CONFIRMADO contra el corpus.
//
// ══ POR QUÉ ESTÁN AQUÍ Y NO EN `lexicon-l1.ts` ═══════════════════════
//
// Por lo mismo que los indeclinables importados: **no se escriben a mano**.
// Salir del registro es lo que hace imposible añadir una entrada sin
// declarar de dónde viene, y tenerlos en su propio módulo deja ver de un
// vistazo cuánto del lexicón es propio y cuánto importado.
//
// ══ LOS FILTROS, Y QUÉ PARA CADA UNO ═════════════════════════════════
//
//   1. La plantilla tiene que dar el paradigma. La 3.ª declinación sin tema
//      explícito NO se propone: `gēns` hace `gentis` y `sermō` hace
//      `sermōnis`, y desde el nominativo eso no se deduce.
//   2. La 2.ª en `-er` tampoco sin tema: `puer` hace `puerī` y `ager` hace
//      `agrī`. Derivarlo produjo `*ministī`, que el corpus refutó con
//      `ministrōrum`.
//   3. Los lemas en `-or` son DEPONENTES y no van aquí: su paradigma es el
//      pasivo de una activa que no existe. Metidos como verbos activos
//      producían `*arbitrorāvī`.
//   4. Y el corpus CONFIRMA: de un nombre se exige que alguna forma de su
//      paradigma esté atestiguada y que su genitivo singular no contradiga
//      al del treebank; de un verbo, que haya forma atestiguada del
//      infectum Y del perfectum, que es lo que verifica los dos temas.
//
//   El cuarto es el que importa. La regla general acierta mucho, y «mucho»
//   en el sitio del que cuelga toda la declinación es un porcentaje de
//   formas inventadas. **La fuente propone; el corpus confirma; lo que no se
//   confirma no entra.**
//
// ══ LA GLOSA VA VACÍA, A PROPÓSITO ══════════════════════════════════
//
// La fuente da la definición en INGLÉS. Traducirla sería exactamente la
// afirmación sin fuente de la que se acaba de salir, y encima en el campo
// más inerte del proyecto —el que ningún gate puede comprobar—. Las
// entradas importadas entran con `glosa: ''` y la deuda queda contada:
// `scripts/lectura/glosas-a-revisar.ts` las lista con su definición
// inglesa al lado para el lingüista.
//
// Una glosa vacía no rompe nada: la glosa no la consume ninguna máquina
// (ver `campos-inertes.ts`). Lo que no se puede es usar estas entradas en
// un lote sin glosarlas, y de eso avisa su test.
import type { EntradaNominal, EntradaVerbal } from './paradigma-la';
import REGISTRO from './macrones.json';

interface FilaConPlantilla {
  clave: string; origen: string; plantilla?: string; posFuente?: string | null;
  paradigma?: { tipo: 'nombre'; genitivo: string; genero: 'm' | 'f' | 'n' }
    | { tipo: 'verbo'; infinitivo: string; perfecto: string; supino?: string };
  cantidad: string | null;
}

const filas = (REGISTRO as { filas: FilaConPlantilla[] }).filas;

export const NOMBRES_IMPORTADOS: EntradaNominal[] = filas
  .filter((f) => f.paradigma?.tipo === 'nombre' && f.cantidad !== null)
  .map((f) => {
    const p = f.paradigma as { genitivo: string; genero: 'm' | 'f' | 'n' };
    return { lema: f.cantidad as string, genitivo: p.genitivo, genero: p.genero, glosa: '' };
  });

export const VERBOS_IMPORTADOS: EntradaVerbal[] = filas
  .filter((f) => f.paradigma?.tipo === 'verbo' && f.cantidad !== null)
  .map((f) => {
    const p = f.paradigma as { infinitivo: string; perfecto: string; supino?: string };
    return {
      lema: f.cantidad as string, infinitivo: p.infinitivo, perfecto: p.perfecto,
      ...(p.supino ? { supino: p.supino } : {}), glosa: '',
    };
  });

/** La deuda de glosas, contada y no escondida. */
export const SIN_GLOSA: string[] = [
  ...NOMBRES_IMPORTADOS.map((n) => n.lema),
  ...VERBOS_IMPORTADOS.map((v) => v.lema),
];

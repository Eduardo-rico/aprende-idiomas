// lib/data/languages/la/lotes/_ayuda-eclesiastica.ts
//
// Lo común a los cinco lotes de lectura eclesiástica: construir el ítem
// desde una palabra y una regla, con la transcripción sacada de la máquina
// y no escrita a mano dos veces.
import type { ItemEclesiastica } from '../../../../../scripts/lib/gate-eclesiastica';
import { transcribir, reglasQueAplican, PUNTO_DE_LA_REGLA, type ReglaEclesiastica } from '../../../../lang/transcripcion-eclesiastica';

export type DefEc = [id: string, palabra: string, glosa: string, pista: string];

/** Construye los ítems de un punto. `aplica` NO se declara a mano: lo dice
 *  la máquina, y el gate lo vuelve a comprobar por su cuenta. Declararlo
 *  dos veces sería que el autor se dé la razón a sí mismo. */
export function itemsDe(regla: ReglaEclesiastica, defs: DefEc[]): ItemEclesiastica[] {
  return defs.map(([id, palabra, glosa, pista]) => ({
    id, punto: PUNTO_DE_LA_REGLA[regla], palabra, glosa, pista,
    respuesta: transcribir(palabra),
    ejes: { regla, aplica: reglasQueAplican(palabra).includes(regla) },
  }));
}

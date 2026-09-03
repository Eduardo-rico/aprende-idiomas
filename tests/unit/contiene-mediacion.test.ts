// El buscador de marcadores del gate de mediación, visto EN ROJO.
//
// `contiene` buscaba por SUBCADENA sobre el texto normalizado (sin
// diacríticos ni puntuación). En portugués nunca mordió: los marcadores
// son fórmulas largas y distintivas («Proceder-se-á»). En rumano el
// diminutivo ES la base + sufijo, así que un modelo que sustituye «cinci
// minute» por «cinci minuțele» —normalizado «cinci minutele»— parecía
// CONSERVAR el marcador que acababa de cambiar. Tres de los trece
// problemas del lote 5 rumano eran eso, y el gate estaba mandando
// «arreglar» tres modelos correctos: la clase «corregir algo que no está
// mal», entrando por la puerta de un gate.
import { describe, it, expect } from 'vitest';
import { contiene, rubricaDe, verificar } from '../../scripts/lotes/lote12-mediacion';

describe('contiene — límites de palabra', () => {
  it('ROJO: el sufijo diminutivo NO cuenta como el marcador base', () => {
    expect(contiene('Aveți puțină răbdare, cinci minuțele.', 'cinci minute')).toBe(false);
    expect(contiene('Ați avea două minuțele?', 'două minute')).toBe(false);
    expect(contiene('Mai stai, ia o prăjitură și un ceai cald!', 'ceaiuț')).toBe(false);
  });

  it('el marcador de verdad se sigue encontrando', () => {
    expect(contiene('Așteaptă cinci minute. Vin acum.', 'cinci minute')).toBe(true);
    expect(contiene('Proceder-se-á à substituição', 'Proceder-se-á')).toBe(true);
    expect(contiene('Îmi dați o supică, vă rog?', 'supică')).toBe(true);
  });

  it('la cadena vacía no está en ningún sitio (era el accidente que sostenía la convención)', () => {
    expect(contiene('cualquier texto', '')).toBe(false);
  });
});

const base = {
  id: 'T-01', concepto: 'x', registroFuente: 'formal', registroDestino: 'coloquial',
  sourceText: 'Așteptați un minuțel, vă rog.', audience: 'un compañero',
  instruccion: 'Dilo directo.', datos: [], wordRange: [1, 20] as [number, number],
  register: 'coloquial', address: 'tu',
} as any;

describe('marcador que DESAPARECE sin sustituto', () => {
  it('«» declara que el destino borra la fórmula, y el gate lo acepta', () => {
    const x = { ...base, marcadores: [['vă rog', '']], modelo: 'Stai un minut.' };
    expect(verificar([x, { ...x, id: 'T-02', registroFuente: 'coloquial', registroDestino: 'formal', marcadores: [['vă rog', '']], modelo: 'Stai un minut.' }])
      .filter((s) => s.includes('no trae ninguna'))).toEqual([]);
  });

  it('la rúbrica derivada dice QUITAR, no inventa un sustituto', () => {
    const r = rubricaDe({ ...base, marcadores: [['vă rog', '']], modelo: 'Stai un minut.' });
    expect(r.some((c) => c.includes('¿Quita «vă rog»'))).toBe(true);
    expect(r.some((c) => /Sustituye «vă rog» por «»/.test(c))).toBe(false);
  });

  it('sin la cadena vacía, un modelo que no trae el sustituto SIGUE fallando', () => {
    const x = { ...base, marcadores: [['vă rog', 'te rog']], modelo: 'Stai un minut.' };
    expect(verificar([x]).some((s) => s.includes('no trae ninguna de «te rog»'))).toBe(true);
  });
});

// ── El guardián de datos inventados: estaba EXPORTADO y APAGADO ────────
// `inventadosProbables` vivía en el lote 12 sin que ningún `verificar()`
// lo llamara. Al encenderlo cazó dos modelos rumanos que inventaban un
// nombre propio (la casilla negativa de su PROPIA rúbrica los reprueba) —
// y 15 falsos positivos sobre seis lotes portugueses YA PUBLICADOS, todos
// el artículo `um`/`uma` y dos «duas coisas» de estructura. Un gate que
// marca la mitad de los casos es un gate apagado: se acotó, y aquí queda
// escrito qué caza, qué NO caza y a qué precio.
import { inventadosProbables } from '../../scripts/lotes/lote12-mediacion';

const item = (sourceText: string, modelo: string) => ({
  id: 'X', concepto: 'c', registroFuente: 'formal', registroDestino: 'coloquial',
  audience: 'un amigo', instruccion: 'Dilo llano.', marcadores: [['x', 'y']], datos: [],
  wordRange: [1, 60] as [number, number], register: 'coloquial', address: 'tu',
  sourceText, modelo,
}) as any;

describe('inventadosProbables', () => {
  it('ROJO: caza el nombre propio que la fuente no da', () => {
    expect(inventadosProbables(item('Vă rog să-mi eliberați o adeverință.', 'Bună ziua. Cu stimă, Ana Pop.')))
      .toEqual(['Ana', 'Pop']);
  });

  it('ROJO: caza la cantidad inventada sobre algo que la fuente SÍ nombra', () => {
    expect(inventadosProbables(item('Pachetul a ajuns la poștă.', 'Auzi, au ajuns trei pachete la poștă.')))
      .toEqual(['trei']);
  });

  it('VERDE: «um / uma» es el artículo portugués, no el numeral', () => {
    expect(inventadosProbables(item('Vamos afixar o aviso.', 'Pomos um aviso na porta.'))).toEqual([]);
  });

  it('VERDE: el modelo anunciando su propia estructura no inventa un dato', () => {
    expect(inventadosProbables(item('A avaliação decorrerá em março.', 'Duas coisas: a avaliação é em março.'))).toEqual([]);
  });

  it('COSTE DECLARADO: un número pegado a un sustantivo que la fuente TAMPOCO nombra se escapa', () => {
    // Es el precio de acotar. Queda cubierto —parcialmente— por la casilla
    // de `datos` y por el gate de copia; se escribe para que nadie crea
    // que este gate responde a una pregunta que no responde.
    expect(inventadosProbables(item('Vă rugăm să prezentați chitanța la ghișeu.', 'Du-te cu chitanța la ghișeu, ai cinci zile.'))).toEqual([]);
  });
});

// tests/unit/corpus-ro.test.ts — EL SEGUNDO CAMINO, BAJO TEST.
//
// `scripts/corpus-ro.ts` pasó a ser un PASO DEL CICLO en el lote 22 (orden
// del coordinador), y un instrumento del ciclo que nadie prueba es un
// instrumento que miente en silencio. Sus dos defensas se ven aquí en
// ROJO, porque las dos nacieron de un fallo real:
//
//  · el CANARIO — una búsqueda que devuelve cero es indistinguible de una
//    búsqueda rota, y en el lote 21 un `\b` doble-escapado devolvió ceros
//    plausibles en la consulta de la que colgaba el lote entero;
//  · el RECHAZO DE `\b` — en JS `\w` es `[A-Za-z0-9_]` incluso con el flag
//    `u`, así que `ă â î ș ț` no son «palabra» y `\b` dispara DENTRO de la
//    palabra rumana. Medido: `de face\b` daba 5 y una era «unde faceți».
import { describe, it, expect } from 'vitest';
import { buscar, tanda, corpus, controles, CANARIO, CANARIO_NEGATIVO, FIN, INI } from '../../scripts/corpus-ro';

describe('corpus-ro · el canario', () => {
  it('la cadena del canario ESTÁ en el corpus — si no, no hay ceros que leer', () => {
    expect(buscar(CANARIO).n).toBeGreaterThan(0);
  });
  it('una tanda devuelve resultados mientras el canario cante', () => {
    const r = tanda(['de f(ă|a)cut' + FIN]);
    expect(r).not.toBeNull();
    expect(r![0]!.n).toBeGreaterThan(100);
  });
});

// EL SEGUNDO CONTROL. El canario positivo demuestra que la consulta
// encuentra lo que debe; NO demuestra que no encuentre lo que no debe, y
// ése es el fallo que ya se pagó una vez. Los dos casos van juntos: el
// que lo pasa y el que lo suspende.
describe('corpus-ro · el canario NEGATIVO', () => {
  it('VERDE: con el límite unicode, «mașin» no es palabra y da cero', () => {
    expect(buscar(INI + CANARIO_NEGATIVO + FIN).n).toBe(0);
    // Y el positivo canta a la vez: un cero sin el positivo no vale nada.
    expect(buscar(CANARIO).n).toBeGreaterThan(0);
  });
  it('ROJO: con \\b el mismo patrón dispara DENTRO de «mașină» — el defecto que se pagó', () => {
    // El testigo no es inventado: es la forma exacta del fallo del lote
    // 21. Si esto diera cero, el control negativo no probaría nada.
    expect(corpus().match(/mașin\b/giu)?.length ?? 0).toBeGreaterThan(0);
  });
  it('los dos controles se informan por SEPARADO, para saber cuál falló', () => {
    const c = controles();
    expect(c.ok).toBe(true);
    expect(c.negativo).toBe(0);
    expect(c.positivo).toBeGreaterThan(0);
    expect(c.fallo).toBeNull();
  });
});

describe('corpus-ro · el rechazo de \\b, visto en rojo', () => {
  it('RECHAZA el patrón con \\b', () => {
    expect(() => buscar('de face\\b')).toThrow(/no es unicode-aware/);
  });
  it('ACEPTA el mismo patrón con el límite unicode', () => {
    expect(() => buscar('de face' + FIN)).not.toThrow();
  });
  it('y los dos NO dan el mismo número: \\b contaba de más', () => {
    // El testigo es el hallazgo entero, no una muestra (§4.27): `de face`
    // con `\b` cazaba «unde faceți», donde la «ț» rompe el límite ASCII.
    const conB = corpus().match(/de face\b/giu)?.length ?? 0;
    const bien = buscar('de face' + FIN).n;
    expect(conB).toBeGreaterThan(bien);
  });
});

describe('corpus-ro · las tres reglas de uso, ejercidas sobre datos reales', () => {
  it('la PRESENCIA prueba: el supino está vivo y no se puede marcar mal', () => {
    expect(buscar('de f(ă|a)cut' + FIN).n).toBeGreaterThan(100);
    expect(buscar('de spus' + FIN).n).toBeGreaterThan(10);
  });
  it('la AUSENCIA no prohíbe: se mide, y no autoriza ningún asterisco', () => {
    // `de spăla` (infinitivo corto en posición de supino) da cero, y ese
    // cero NO es una cita normativa: sólo dice que este corpus del XIX no
    // lo trae. Marcarlo mal exige fuente aparte.
    expect(buscar('de sp(ă|a)la' + FIN).n).toBe(0);
    // Y el canario demuestra que la consulta funciona, que es lo único
    // que separa «no está» de «no busqué».
    expect(buscar(CANARIO).n).toBeGreaterThan(0);
  });
});

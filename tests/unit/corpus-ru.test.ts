import { describe, it, expect } from 'vitest';
import { buscar, controles, corpus, CANARIO, CANARIO_NEGATIVO, INI, FIN } from '@/scripts/corpus-ru';

// EL TESTIGO EN ROJO DEL CONTADOR CIRÍLICO.
//
// En rumano el `\w` de JavaScript subcontó una cuarta parte del corpus sin
// dar error (§4.42 del relevo rumano). En CIRÍLICO el mismo defecto es
// TOTAL, no parcial: `\w` es `[A-Za-z0-9_]` incluso con el flag `u`, así
// que sobre ruso casa **cero veces** y devuelve un cero perfectamente
// plausible. Estos tests existen para que el hecho esté MEDIDO sobre una
// palabra rusa y no sólo escrito en un comentario — que es exactamente el
// error que el proyecto ya cometió una vez: conocía el hecho entero y
// guardaba una sola de sus dos formas.

// POR QUÉ ESTE FICHERO DECLARA UN TIMEOUT LARGO, y no es pereza.
//
// `corpus()` parsea ~91 MB de JSON y los une en una sola cadena. En
// aislado tarda ~1 s; en la suite completa, con varios workers en
// paralelo y otra sesión compilando a la vez, se pasa del límite POR
// DEFECTO de vitest, que son 5 s. Resultado: un rojo que va y viene y
// que no es un fallo de lógica — la otra sesión ya lo había normalizado
// como «el rojo de siempre», y un rojo que se aprende a ignorar es un
// gate apagado.
//
// Es el mismo caso, con la misma causa y el mismo arreglo, que el
// catálogo de lecturas (`lecturas-catalogo.invariantes.ts`, timeout
// 120_000).
//
// ⚠ Y UN TIMEOUT MÁS LARGO PUEDE ESCONDER UN CUELGUE: si algún día
// `corpus()` devolviera vacío o se colgara a medias, esperar más sólo
// haría tardar más en fallar. Por eso el primer test comprueba que se ha
// cargado material de verdad ANTES de mirar ningún control — sin esa
// línea, subir el límite convierte «tarda» y «no lee nada» en el mismo
// verde.
describe('corpus-ru · el contador sabe leer cirílico', { timeout: 120_000 }, () => {
  it('el corpus se ha cargado de verdad (si no, el timeout largo taparía un cuelgue)', () => {
    const n = corpus().length;
    expect(n, 'corpus() devolvió menos de 1 MB: no ha leído la biblioteca').toBeGreaterThan(1_000_000);
  });

  it('los DOS controles están en verde: el positivo sale y el negativo da cero', () => {
    const c = controles();
    expect(c.positivo, `el canario «${CANARIO}» tiene que aparecer`).toBeGreaterThan(0);
    expect(c.negativo, `«${CANARIO_NEGATIVO}» sólo existe DENTRO de palabras: con límite de palabra tiene que dar 0`).toBe(0);
    expect(c.ok).toBe(true);
  });

  it('ROJO MEDIDO: `\\w` no casa cirílico, y por eso está prohibido', () => {
    // No es una opinión sobre el motor de regex: se mide aquí.
    expect(/\w/u.test('слово')).toBe(false);
    expect(/^\w+$/u.test('слово')).toBe(false);
  });

  // ══ LO QUE EL RUSO CAMBIA RESPECTO AL RUMANO, Y NO ES UN MATIZ ══════
  //
  // En rumano `\b` cuenta DE MÁS: `mașină` tiene letras ASCII pegadas a
  // `ș` y `ă`, así que `\b` dispara CUATRO veces DENTRO de la palabra y el
  // número sale inflado — un defecto que al menos se nota.
  //
  // En ruso NINGUNA letra del alfabeto es `\w`, así que dentro de un texto
  // cirílico **no hay ni una sola transición**: `\b` no dispara nunca y
  // `/\bчто\b/` es FALSO sobre «что он». O sea que en cirílico `\b` deja
  // de ser el hermano ruidoso de `\w` y se vuelve su gemelo: los dos
  // devuelven un CERO limpio y plausible, sin error y sin excepción.
  //
  // Y la mitad que lo hace peor que un cero: el único sitio donde `\b` SÍ
  // dispara es la juntura latín↔cirílico. O sea que una consulta con `\b`
  // en ruso no selecciona nada… salvo justo los tokens contaminados por
  // homóglifos latinos, que es el vector de error que este idioma tiene y
  // el rumano no. Una consulta rota que además está sesgada hacia la
  // basura es el peor instrumento posible.
  it('ROJO MEDIDO: en cirílico `\\b` no cuenta de más — no cuenta NUNCA, y sólo dispara en la juntura latina', () => {
    expect('он сказал что'.match(/\b/gu)?.length ?? 0).toBe(0);
    expect(/\bчто\b/u.test('что он')).toBe(false);
    expect(/сегодн\b/u.test('сегодня')).toBe(false);
    // En rumano el mismo `\b` dispara cuatro veces DENTRO de la palabra.
    expect('mașină'.match(/\b/gu)?.length ?? 0).toBe(4);
    // Y en ruso sólo dispara donde hay contaminación latina.
    expect('casaдом'.match(/\b/gu)?.length ?? 0).toBe(2);
    // El límite de verdad sí distingue las dos cosas.
    expect(new RegExp(INI + 'сегодн' + FIN, 'u').test('сегодня')).toBe(false);
    expect(new RegExp(INI + 'сегодня' + FIN, 'u').test('сегодня')).toBe(true);
  });

  it('ROJO: `buscar` RECHAZA un patrón con \\w o \\b en vez de devolver un cero plausible', () => {
    expect(() => buscar('\\w+ он')).toThrow(/RECHAZADO/);
    expect(() => buscar('что\\b')).toThrow(/RECHAZADO/);
    expect(() => buscar('\\W')).toThrow(/RECHAZADO/);
    // Una barra escapada de verdad NO debe disparar el rechazo.
    expect(() => buscar('что\\\\b')).not.toThrow();
  });

  it('la presencia prueba: una forma corriente aparece y una inventada no', () => {
    expect(buscar('он сказал').n).toBeGreaterThan(100);
    // Cadena bien formada ortográficamente y que no es palabra rusa: el
    // cero de aquí sólo vale porque la línea de arriba salió positiva.
    expect(buscar('щывгэюф').n).toBe(0);
  });
});

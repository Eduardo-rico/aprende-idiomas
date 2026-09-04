// tests/unit/orden-transformacion-ro.test.ts — EL ORDEN PUBLICADO ES UNA PISTA.
//
// `separablePorPosicion` lleva en el repositorio desde el portugués y lo
// llaman `preflight-lote.ts`, `pares-minimos.ts` y los cinco gates de
// latín. La máquina de transformación del rumano, construida desde cero
// el 2026-09-03, **no lo llamaba**. En latín ese mismo hueco costó cuatro
// lotes de cinco resueltos al 100 % contando ejercicios.
//
// Un detector que existe y no se llama es peor que no tenerlo: da
// sensación de cobertura. Y uno que se enchufa y sólo se ve en verde no
// está probado — el primer puerto de éste marcó los TRES lotes rumanos
// publicados y los tres hallazgos eran falsos. Así que aquí va en rojo y
// en verde, y cada testigo lleva UN SOLO defecto.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ordenSeparable, ordenDePublicacion, type ItemTransRo, type Opciones } from '@/scripts/lib/transformacion-ro';
import { blocksDir } from '@/lib/data/registry';
import { ITEMS as L23, OPCIONES as O23 } from '@/scripts/lotes/trans-ro-l23';
import { ITEMS as L24, OPCIONES as O24 } from '@/scripts/lotes/trans-ro-l24';
import { ITEMS as L25, OPCIONES as O25 } from '@/scripts/lotes/trans-ro-l25';

/** Un ítem de juguete. El foco es SIEMPRE `un` a propósito: el eje de
 *  serie es la edición `quita→pone`, así que sólo agrupa cuando el foco
 *  se escribe igual. Es la limitación que obliga a los lotes de foco
 *  variable a declarar su eje semántico. */
const it_ = (w: string, nucleo: string, instruccion: string): ItemTransRo => ({
  p: 'x', pasada: 1, s: `Aici e un caz ${w}.`, instruccion, r: `Aici sunt ${nucleo} cazuri ${w}.`,
  foco: 'un', nucleo, espejoEs: false, transparenteLatin: false,
});

const UNA = 'Di otra vez la frase hablando de 2 en vez de 1.';

/** Cuatro de una edición y cuatro de otra, AGRUPADAS, bajo una consigna
 *  única: es la forma exacta del fallo del latín. */
const AGRUPADO = [
  ...['a', 'b', 'c', 'd'].map((w) => it_(w, 'doi', UNA)),
  ...['e', 'f', 'g', 'h'].map((w) => it_(w, 'două', UNA)),
];

describe('el orden publicado de un lote de transformación', () => {
  it('ROJO · control positivo: agrupado por eje bajo una consigna única, se separa por posición', () => {
    // Sin este testigo, el verde de los lotes reales no significaría nada:
    // un detector que nunca dice que sí es indistinguible de uno roto.
    const v = ordenSeparable(AGRUPADO, 'orden-escrito');
    expect(v.join(' ')).toMatch(/se separa por posición/);
  });

  it('ROJO · un lote que no declara `semilla` se publicaría en el orden en que está escrito', () => {
    expect(ordenSeparable(AGRUPADO, undefined).join(' ')).toMatch(/no declara `semilla`/);
  });

  it('VERDE · barajar con semilla fija lo arregla, y el mismo lote pasa', () => {
    const limpias = [1, 2, 3, 4, 5, 6, 7, 8].filter((s) => ordenSeparable(AGRUPADO, s).length === 0);
    expect(limpias.length).toBeGreaterThan(0);
  });

  it('NO marca el eje que la CONSIGNA nombra — es otro instrumento, no éste', () => {
    // El primer puerto del detector marcaba los tres lotes publicados, y
    // los tres hallazgos eran falsos: cuando la consigna dice la casilla
    // («díselo a tu amigo» / «a los dos»), la posición no le añade nada
    // al alumno, que lo lee. Que la consigna determine la respuesta sí es
    // una fuga, pero la miden las `pistas` de `contrastarComposiciones`.
    const dosConsignas = [
      ...['a', 'b', 'c', 'd'].map((w) => it_(w, 'doi', 'Háblale a UNO.')),
      ...['e', 'f', 'g', 'h'].map((w) => it_(w, 'două', 'Háblales a DOS.')),
    ];
    expect(ordenSeparable(dosConsignas, 'orden-escrito')).toEqual([]);
  });

  it('NO marca una clase de UN solo ítem: se separaría siempre, por construcción', () => {
    // Un gate ruidoso es un gate apagado. Medido antes de acotarlo: con
    // las clases de un solo miembro marcaba 2 hallazgos en cada uno de
    // los tres lotes publicados, y los seis eran ruido.
    const casiTodoIgual = [
      ...['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((w) => it_(w, 'doi', UNA)),
      it_('h', 'două', UNA),
    ];
    expect(ordenSeparable(casiTodoIgual, 'orden-escrito')).toEqual([]);
  });

  const LOTES: [string, ItemTransRo[], Opciones][] = [['l23', L23, O23], ['l24', L24, O24], ['l25', L25, O25]];

  it.each(LOTES)('VERDE · el lote %s publicado no se separa por posición', (_n, items, op) => {
    expect(ordenSeparable(items, op.semilla, op.ejes)).toEqual([]);
  });

  it.each(LOTES)('el orden REALMENTE publicado de %s es el que el gate comprueba', (n, items, op) => {
    // El gate certifica `ordenDePublicacion`; si el bloque llevara otro
    // orden, estaría certificando algo que el alumno no ve. Es el mismo
    // defecto que un sello que responde a otra pregunta.
    const esperado = ordenDePublicacion(items, op.semilla ?? 'orden-escrito').map((x) => x.s);
    const publicado: string[] = [];
    for (const f of fs.readdirSync(blocksDir('ro')).filter((x) => /^b\d+\.json$/.test(x)))
      for (const ex of JSON.parse(fs.readFileSync(path.join(blocksDir('ro'), f), 'utf8')) as any[])
        if ((ex.tags ?? []).includes(`ro-trans-${n}`) && ex.variantStatus !== 'needs-human')
          publicado.push(ex.data.source);
    expect(publicado).toEqual(esperado);
  });
});

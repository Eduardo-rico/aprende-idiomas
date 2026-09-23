// tests/unit/lote-preposiciones-caso-la.test.ts — y el gate, visto en rojo.
//
// EL GATE SALIÓ ROJO LA PRIMERA VEZ QUE SE CORRIÓ, y por algo real: el
// sello del treebank va keyed por el lema como lo escribe el corpus
// (`voco`) y el gate buscaba la clave con u/v fundidas (`uoco`). `vocō`
// salía con 0 y 0 teniendo 15 y 11. Arreglado normalizando el sello.
//
// Y el ataque por MUTACIÓN sobre el lote ya escrito dejó seis mutaciones
// en verde —las glosas de un par cambiadas por otra frase, un mácron
// inventado en `latinConCantidad`, el verbo cambiado por otro del sello,
// el lugar español cambiado por otro, el punto…—. Todas están abajo, en
// rojo. Las dos que siguen en verde son silencios DECLARADOS y hay un test
// que fija cada uno.
import { describe, it, expect } from 'vitest';
import { LOTE_PREPOSICIONES_CASO as L, FUENTE_PREPOSICIONES_CASO } from '@/lib/data/languages/la/lotes/l11-preposiciones-caso';
import {
  aceptadasDe, coberturaPC, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, lecturaSoloAcusativoSingular,
  motivoDeLasOtrasPreposiciones, nombreDerivado, revisarItemPC, revisarLotePC, revisarParejasPC,
  tasasCiegasPC, techoDeLaSegundaVez, VERBOS_ES_CON_EN_DE_MOVIMIENTO, type Articulo, type ItemPrepCaso,
} from '@/scripts/lib/gate-preposiciones-caso';
import SELLO from '@/lib/data/languages/la/atestacion-in-caso.json';

const de = (p: string, lado: 'direccion' | 'situacion') => L.find((i) => i.pareja === p && i.lado === lado)!;
const clasesLote = (xs: ItemPrepCaso[]) => revisarLotePC(xs).map((f) => f.clase);
const clases = (i: ItemPrepCaso) => revisarItemPC(i).map((f) => f.clase);
/** Aplica un cambio a los DOS ítems de un par, que es como se muta sin
 *  que el rojo venga sólo de romper el par. */
const alPar = (p: string, f: (i: ItemPrepCaso) => ItemPrepCaso) => L.map((i) => (i.pareja === p ? f(i) : i));

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLotePC(L).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('doce ítems, seis y seis, en seis pares', () => {
    expect(L.length).toBe(12);
    expect(L.filter((i) => i.lado === 'direccion').length).toBe(6);
    expect(new Set(L.map((i) => i.pareja)).size).toBe(6);
  });
  it('y el nombre de cada ítem lo deriva la máquina', () => {
    for (const i of L) expect(nombreDerivado(i.nombre), i.id).not.toBeNull();
  });
});

describe('LAS RUTAS CIEGAS, y cada una puede fallar', () => {
  it('«in = en» y «siempre dirección» son complementarias y quedan en 6 de 12', () => {
    const t = tasasCiegasPC(L);
    expect(t.calcoEn.aciertos + t.siempreDireccion.aciertos).toBe(12);
    expect(t.calcoEn.tasa).toBe(0.5);
  });
  it('un lote de sólo situaciones pone el calco al 100 % y el gate lo dice', () => {
    const solo = L.filter((i) => i.lado === 'situacion');
    expect(tasasCiegasPC(solo).calcoEn.tasa).toBe(1);
    expect(clasesLote(solo)).toContain('estrategia-ciega');
    expect(clasesLote(solo)).toContain('varia-incompleto');
  });
  it('la lectura PARCIAL «-m = dirección» falla en los tres plurales de dirección', () => {
    const r = lecturaSoloAcusativoSingular(L);
    expect(r.n - r.aciertos).toBe(3);
  });
  it('y un lote de sólo singulares la deja sin contraejemplo', () => {
    const sg = L.filter((i) => i.nombre.numero === 'sg');
    expect(lecturaSoloAcusativoSingular(sg).aciertos).toBe(sg.length);
    expect(clasesLote(sg)).toContain('lectura-parcial-sin-contraejemplo');
  });
  it('dentro de cada par la glosa y el verbo son IDÉNTICOS: ninguna ruta que los lea separa el par', () => {
    for (const p of new Set(L.map((i) => i.pareja))) {
      const [a, b] = [de(p, 'direccion'), de(p, 'situacion')];
      expect(a.glosa, p).toBe(b.glosa);
      expect(a.verbo.forma, p).toBe(b.verbo.forma);
    }
  });
});

describe('LAS RESPUESTAS: derivadas, y los dos lados nunca comparten una cadena', () => {
  it('disjuntas para todos los artículos', () => {
    for (const a of ['el', 'la', 'los', 'las', ''] as Articulo[]) {
      const d = new Set(aceptadasDe('direccion', a));
      for (const s of aceptadasDe('situacion', a)) expect(d.has(s), `${a}: ${s}`).toBe(false);
    }
  });
  it('lo que añadió el lingüista está: «para», «rumbo al», «adentro de», «sobre», y «entre» sólo con plural', () => {
    expect(aceptadasDe('direccion', 'los')).toContain('para los');
    expect(aceptadasDe('direccion', 'el')).toContain('rumbo al');
    expect(aceptadasDe('situacion', 'la')).toContain('adentro de la');
    expect(aceptadasDe('situacion', 'la')).toContain('sobre la');
    expect(aceptadasDe('situacion', 'los')).toContain('entre los');
    expect(aceptadasDe('situacion', 'la')).not.toContain('entre la');
  });
  it('«a» + «el» sale «al», y «de» + «el» sale «del»', () => {
    expect(aceptadasDe('direccion', 'el')[0]).toBe('al');
    expect(aceptadasDe('situacion', 'el')).toContain('dentro del');
  });
});

describe('LOS VENENOS del ataque por mutación, todos en rojo', () => {
  const v = de('via', 'direccion');
  const u = 'urbs';
  it('el lado volteado', () => expect(clases({ ...v, lado: 'situacion' })).toContain('lado-no-lo-decide-el-caso'));
  it('la glosa de un solo ítem del par', () =>
    expect(revisarParejasPC(L.map((i) => (i === v ? { ...i, glosa: 'Los niños corren ___ calle ahora.' } : i))).map((f) => f.clase))
      .toContain('pareja-glosas-distintas'));
  it('la glosa del par cambiada por otra frase', () =>
    expect(clasesLote(alPar('via', (i) => ({ ...i, glosa: 'Los niños se sientan ___ calle.' })))).toContain('verbo-espanol-no-esta-en-la-glosa'));
  it('y cambiando también el verbo español declarado', () =>
    expect(clasesLote(alPar('via', (i) => ({ ...i, glosa: 'Los niños se sientan ___ calle.', verbo: { ...i.verbo, enEspanol: 'se sientan' } }))))
      .toContain('verbo-espanol-no-es-del-infinitivo'));
  it('y cambiando además el infinitivo, cuando el verbo tiene glosa en el lexicón', () =>
    expect(clasesLote(alPar(u, (i) => ({ ...i, glosa: 'Los discípulos se sientan ___ ciudad.', verbo: { ...i.verbo, enEspanol: 'se sientan', infinitivoEs: 'sentar' } }))))
      .toContain('verbo-espanol-no-es-la-glosa'));
  it('un verbo español que pide «en» con dirección (§D8)', () => {
    expect(VERBOS_ES_CON_EN_DE_MOVIMIENTO).toContain('entrar');
    expect(clasesLote(alPar('via', (i) => ({ ...i, glosa: 'Los niños entran ___ calle.', verbo: { ...i.verbo, enEspanol: 'entran', infinitivoEs: 'entrar' } }))))
      .toContain('verbo-espanol-con-en-de-movimiento');
  });
  it('el lugar español cambiado por otro, en la glosa y en el campo', () =>
    expect(clasesLote(alPar(u, (i) => ({ ...i, glosa: 'Los discípulos caminan ___ plaza.', nombre: { ...i.nombre, enEspanol: 'plaza' } }))))
      .toContain('lugar-no-es-la-glosa'));
  it('un mácron inventado y uno que falta, en la versión con cantidad', () => {
    expect(clases({ ...v, latinConCantidad: 'Pūerī in viam currunt.' })).toContain('cantidad-mal-puesta');
    expect(clases({ ...v, latinConCantidad: 'Pueri in viam currunt.' })).toContain('cantidad-mal-puesta');
  });
  it('el lema del verbo cambiado por otro que también está en el sello', () =>
    expect(clases({ ...v, verbo: { ...v.verbo, lema: 'veniō' } })).toContain('verbo-no-es-del-lema'));
  it('el artículo cambiado sin rehacer las respuestas', () =>
    expect(clases({ ...v, articulo: 'el' })).toContain('aceptadas-no-derivadas'));
  it('el error diana que no es la respuesta del otro lado', () =>
    expect(revisarParejasPC(L.map((i) => (i === v ? { ...i, elErrorDiana: 'por la' } : i))).map((f) => f.clase))
      .toContain('error-diana-no-es-la-respuesta-del-par'));
  it('el punto ajeno', () => expect(clases({ ...v, punto: 'l3-locativo' })).toContain('punto-ajeno'));
  it('un verbo sin los dos casos en el corpus', () =>
    expect(clases({ ...v, verbo: { ...v.verbo, lema: 'zzz' } })).toContain('verbo-sin-los-dos-casos-en-el-corpus'));
});

describe('LOS DOS SILENCIOS, declarados y fijados (§C5)', () => {
  it('el género del artículo español: «la templo» pasaría', () => {
    const c = coberturaPC(L).find((x) => x.comprobacion.includes('GÉNERO'))!;
    expect(c.decididos).toBe(0);
    expect(c.elCeroEsUnResultado).toContain('no modela el género');
  });
  it('un verbo IMPORTADO no tiene glosa, y ahí el verbo español no se ata a nada', () => {
    const v = de('via', 'direccion');
    const otro = alPar('via', (i) => ({ ...i,
      latin: i.latin.replace('currunt', 'manent'), latinConCantidad: i.latinConCantidad.replace('currunt', 'manent'),
      verbo: { ...i.verbo, forma: 'manent', lema: 'maneō' } }));
    expect(v.verbo.lema).toBe('currō');
    expect(revisarLotePC(otro)).toEqual([]);   // ← el silencio, en verde
    const c = coberturaPC(L).find((x) => x.comprobacion.includes('verbo español ATADO'))!;
    expect(c.decididos).toBeLessThan(c.total);
    expect(c.motivoDeLosQueQuedanFuera).toContain('currō');
  });
});

describe('EL SELLO, y lo que el motivo afirma de él', () => {
  const s = SELLO as unknown as { porPreposicion: Record<string, { vulgata: { ac: number; abl: number }; resto: { ac: number; abl: number } }> };
  it('la FORMA del hecho, no el número (§B7): super va más con acusativo; sub e in, más con ablativo', () => {
    const t = (p: string) => ({ ac: s.porPreposicion[p]!.vulgata.ac + s.porPreposicion[p]!.resto.ac, abl: s.porPreposicion[p]!.vulgata.abl + s.porPreposicion[p]!.resto.abl });
    expect(t('super').ac).toBeGreaterThan(t('super').abl);
    expect(t('sub').abl).toBeGreaterThan(t('sub').ac);
    expect(t('in').abl).toBeGreaterThan(t('in').ac);
  });
  it('el motivo NO afirma lo que el sello no mide: «sin movimiento» fue falso una vez', () => {
    const m = motivoDeLasOtrasPreposiciones();
    expect(m).not.toMatch(/sin movimiento/);
    expect(m).toContain('NO está medido');
  });
  it('las grafías u/v se funden al leer el sello: `vocō` no sale con 0 y 0', () => {
    const i = { ...de('via', 'direccion'), verbo: { ...de('via', 'direccion').verbo, lema: 'vocō', forma: 'vocat' } };
    expect(clases(i)).not.toContain('verbo-sin-los-dos-casos-en-el-corpus');
  });
});

describe('EL COSTE DEL PAR', () => {
  it('techo 0,75 declarado, y el piso de distancia se cumple', () => {
    expect(techoDeLaSegundaVez(L).techo).toBe(0.75);
    expect(distanciasEnElPar(L)[0]!.distancia).toBeGreaterThanOrEqual(DISTANCIA_MINIMA_EN_EL_PAR);
  });
  it('el orden de la fuente, sin barajar, no pasa: los pares salen seguidos', () => {
    expect(clasesLote(FUENTE_PREPOSICIONES_CASO)).toContain('pareja-adyacente');
  });
  it('y el id no canta el lado', () => {
    for (const i of L) expect(i.id, i.id).toMatch(/^la-pc-\d\d$/);
  });
});

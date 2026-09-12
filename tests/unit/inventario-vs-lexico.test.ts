// tests/unit/inventario-vs-lexico.test.ts
//
// El gate que pregunta si el lexicón puede satisfacer lo que el punto exige.
// Nace de haberlo descubierto CINCO VECES a mano, siempre al ir a escribir
// el lote y ya con la tarde empezada.
import { describe, it, expect } from 'vitest';
import { PUNTOS_LA } from '@/lib/data/languages/la/inventario-puntos';
import { buscarInsatisfechos, decideLaMutaCumLiquida, esReduplicado, EXIGENCIAS } from '@/scripts/lib/gate-inventario-vs-lexico';
import { todasLasFormasL1 } from '@/scripts/lib/atestar-acento';

describe('el detector de reduplicación', () => {
  it('caza los canónicos, incluido el que la primera versión no veía', () => {
    // `stetī` es `ste-tī`: con un grupo s+consonante la copiada es la
    // SEGUNDA. La versión anterior comparaba los dos primeros caracteres con
    // el tercero y decía que había un reduplicado cuando había dos, justo
    // después de que yo añadiera los dos. Un gate que cuenta mal el material
    // dice que falta lo que sobra.
    for (const p of ['stetī', 'cecidī', 'dedī', 'tetigī', 'cucurrī', 'cecinī', 'pepercī'])
      expect(esReduplicado(p), p).toBe(true);
  });

  it('y no confunde con reduplicación el alargamiento ni el -v- ni el -s-', () => {
    for (const p of ['amāvī', 'dūxī', 'vīdī', 'fuī', 'fēcī', 'cēpī', 'docuī', 'mīsī'])
      expect(esReduplicado(p), p).toBe(false);
    expect(esReduplicado(undefined)).toBe(false);
  });
});

describe('qué exige el inventario y qué tiene el lexicón', () => {
  it('los cinco casos que se descubrieron a mano ya están satisfechos', () => {
    const hay = Object.fromEntries(EXIGENCIAS.map((e) => [e.nombre, e.cuantosHay()]));
    expect(hay['verbos de conjugación mixta']).toBeGreaterThanOrEqual(2);
    expect(hay['verbos de perfecto reduplicado']).toBeGreaterThanOrEqual(2);
    expect(hay['compuestos de `sum`']).toBeGreaterThanOrEqual(2);
    expect(hay['nombres de 5.ª']).toBeGreaterThanOrEqual(2);
    expect(hay['nombres de 4.ª']).toBeGreaterThanOrEqual(2);
  });

  it('y los que siguen sin poder satisfacerse salen nombrados', () => {
    const r = buscarInsatisfechos(PUNTOS_LA as never);
    const ids = r.map((x) => x.punto);
    // `l4-adjetivo-3a` estuvo bloqueado toda la sesión y dejó de estarlo el
    // 2026-09-09: la máquina ya tiene los tres tipos.
    expect(ids).not.toContain('l4-adjetivo-3a');
    // Quedan DOS, y ninguno es de máquina: los dos son de contenido.
    //
    // · `l11-nucleo-800` pide 800 lemas y hay poco más de cien.
    // · `l1-larga-por-posicion` ENTRA EL 2026-09-12, y hasta hoy el gate lo
    //   daba limpio porque nadie le había preguntado. Su `varia` es «el
    //   grupo consonántico, porque muta cum liquida puede contar como
    //   breve», y en L1 no hay NI UNA forma donde eso decida: las cinco con
    //   oclusiva + líquida son de `magister`, y ahí la penúltima `gis` ya
    //   está cerrada por su propia `s`. En el corpus hay 113 formas donde sí
    //   decide —`tenebris` ×17, `arbitror` ×18, `obsecrō` ×17— y `tenebrae`,
    //   que es el ejemplo del propio descriptor, sale ×23 entre sus casos.
    //   Falta el lema, no la regla.
    expect(ids).toContain('l11-nucleo-800');
    expect(ids).toContain('l1-larga-por-posicion');
    expect(ids).toHaveLength(2);
    // `l2-cuarta` pedía «los pocos femeninos» de 4.ª y sólo había `manus`.
    // `domus` entró el 2026-09-09, declarado entero en `IRREGULARES` porque
    // mezcla la 2.ª con la 4.ª: «domō» y «domōs» son de segunda dentro de un
    // paradigma de cuarta.
    expect(ids).not.toContain('l2-cuarta');
    // `l5-irregulares` estuvo bloqueado toda la sesión: la máquina sólo
    // sabía `sum`. Los seis entraron el 2026-09-09.
    expect(ids).not.toContain('l5-irregulares');
    // Y NO deben salir los que sólo usan la palabra «irregulares» para otra
    // cosa: con el patrón ancho salían SIETE y cuatro eran falsos. Un gate
    // que marca la mitad de los casos no lo lee nadie.
    expect(ids).not.toContain('l2-segunda');
    expect(ids).not.toContain('l4-comparativo');
    expect(ids).not.toContain('l5-imperativo');
    // La pasiva de infectum YA existe desde 2026-09-09, así que estos dos
    // dejaron de estar bloqueados — y el test lo dice al revés que antes.
    expect(ids).not.toContain('l6-pasiva-infectum');
    expect(ids).not.toContain('l8-infinitivo-sustantivo');
    // Y el PARTICIPIO tampoco bloquea ya: los cuatro existen, así que los
    // siete puntos del bloque 8 quedaron destrabados el mismo día.
    expect(ids).not.toContain('l8-tres-participios');
    expect(ids).not.toContain('l8-ablativo-absoluto');
    expect(ids).not.toContain('l6-pasiva-perifrastica');
    // Y NO los que sólo MENCIONAN el participio: `l5-partes-principales`
    // dice «de la cuarta salen los participios» y su lote ya está escrito.
    // Tercera vez que este gate produce falsos por buscar una palabra en
    // prosa, y tercera que el arreglo es ir por el `id`.
    expect(ids).not.toContain('l5-partes-principales');
    // Y NO los de fonología, donde «voz» es el sonido y no la categoría
    // gramatical: «lo que hace que la voz italiana produzca el /v/». Con el
    // patrón ancho salían tres, y van dos veces que este gate casi se apaga
    // por lo mismo.
    expect(ids).not.toContain('l1-uv-ij');
    expect(ids).not.toContain('l1-eclesiastica-ce');
    expect(ids).not.toContain('l1-eclesiastica-ae');
  });

  it('el gate declara ser una heurística sobre prosa, y su silencio no prueba nada', () => {
    // Busca palabras de categoría en el texto del punto. No entiende el
    // punto, así que puede pasar por alto exigencias dichas de otra manera.
    // Se comprueba que al menos mira el texto entero y no sólo el nombre.
    const conVaria = PUNTOS_LA.filter((p) => p.varia?.includes('mixta'));
    expect(conVaria.length).toBeGreaterThan(0);
    const r = buscarInsatisfechos(conVaria as never);
    // Con dos mixtas en el lexicón, ninguno sale insatisfecho por eso.
    expect(r.filter((x) => x.exigencia.includes('mixta'))).toHaveLength(0);
  });
});

describe('la muta cum liquida: el punto que el lexicón no puede sostener', () => {
  it('los dos juegos de control, positivo y negativo', () => {
    // La primera versión de esta función se escribió a mano barriendo
    // vocales y FALLÓ su control positivo: `tenebrae` daba false, porque
    // `ae` cuenta como dos vocales y la penúltima salía corrida. Los
    // controles van los dos, y el negativo importa igual: `magistrum` NO
    // es un caso, porque su penúltima `gis` ya está cerrada por su propia
    // `s` y el grupo `tr` no decide nada.
    for (const w of ['tenebrae', 'tenebrās', 'volucrēs', 'integra', 'celebrat'])
      expect(decideLaMutaCumLiquida(w), w).toBe(true);
    for (const w of ['magistrum', 'magistrī', 'dominus', 'habēre', 'patris', 'puella'])
      expect(decideLaMutaCumLiquida(w), w).toBe(false);
  });

  it('y en L1 no hay NINGUNA, así que el punto está bloqueado en el lexicón', () => {
    expect(todasLasFormasL1().filter(decideLaMutaCumLiquida)).toEqual([]);
    const r = buscarInsatisfechos(PUNTOS_LA as never);
    expect(r.map((x) => x.punto)).toContain('l1-larga-por-posicion');
  });
});

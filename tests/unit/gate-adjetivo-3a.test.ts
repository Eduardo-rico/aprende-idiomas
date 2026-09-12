// tests/unit/gate-adjetivo-3a.test.ts
//
// EL GATE DEL ADJETIVO DE LA TERCERA, VISTO EN ROJO.
//
// Un gate visto sólo en verde no está probado: de los tres gates nuevos del
// latín, dos aprobaron lotes envenenados la primera vez. Así que cada clase
// de fallo tiene aquí el caso que DEBE cazar, y los venenos se quedan en el
// repositorio en vez de correrse una vez y borrarse.
import { describe, expect, it } from 'vitest';
import { ADJETIVOS_3A, declinarAdjetivo3a } from '../../lib/data/languages/la/adjetivos-3a';
import {
  CELDAS_QUE_DISTINGUEN_EL_TIPO, coberturaAdjetivo, reglaDeLosDeDos,
  revisarItemAdjetivo, revisarLoteAdjetivo, rima, tasasCiegasA, type ItemAdjetivo3a,
} from '../../scripts/lib/gate-adjetivo-3a';

const adj = (l: string) => ADJETIVOS_3A.find((a) => a.lema === l)!;

const base: ItemAdjetivo3a = {
  id: 'x', punto: 'l4-adjetivo-3a', adjetivo: adj('omnis'), celda: 'f.nom.sg',
  respuesta: 'omnis', marco: 'Cīvitās ___ magna est.', pista: 'sujeto, femenino singular',
  glosa: 'Toda la ciudad es grande.', nombreEnElMarco: 'Cīvitās', desinenciaDelNombre: 'is',
  ejes: { terminaciones: 2, examina: 'terminaciones' },
};
const con = (p: Partial<ItemAdjetivo3a>): ItemAdjetivo3a => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemAdjetivo3a) => revisarItemAdjetivo(i).map((f) => f.clase);

describe('lo que el módulo dice del punto, medido y no supuesto', () => {
  it('el número de terminaciones sólo se ve en 6 de las 36 celdas', () => {
    expect(CELDAS_QUE_DISTINGUEN_EL_TIPO).toHaveLength(6);
    for (const c of CELDAS_QUE_DISTINGUEN_EL_TIPO) expect(c).toMatch(/\.(nom|voc)\.sg$/);
  });

  it('el de TRES terminaciones se separa del de DOS en UNA sola celda', () => {
    const tres = adj('ācer'), dos = adj('omnis');
    const distintas = CELDAS_QUE_DISTINGUEN_EL_TIPO.filter((celda) => {
      const [g, c, n] = celda.split('.') as ['m' | 'f' | 'n', 'nom' | 'voc', 'sg'];
      // la desinencia, o sea la forma menos el tema
      const des = (e: typeof tres) => {
        const tema = e.genitivo.replace(/is$/, '');
        const f = declinarAdjetivo3a(e, g, c, n);
        return f.startsWith(tema) ? f.slice(tema.length) : `[${f}]`;
      };
      return des(tres) !== des(dos);
    });
    // nominativo y vocativo del masculino: la misma forma dos veces
    expect(distintas).toEqual(['m.nom.sg', 'm.voc.sg']);
    expect(declinarAdjetivo3a(tres, 'm', 'nom', 'sg')).toBe('ācer');
    expect(declinarAdjetivo3a(tres, 'f', 'nom', 'sg')).toBe('ācris');
    expect(reglaDeLosDeDos(tres, 'f', 'nom', 'sg')).toBe('ācris');   // la estrategia acierta
    expect(reglaDeLosDeDos(tres, 'm', 'nom', 'sg')).toBe('ācris');   // y sólo aquí falla
  });
});

// EL CONTROL QUE IMPIDE QUE TODO LO DE ABAJO PASE POR VACÍO. Sin él, un
// gate que marcara SIEMPRE pasaría los doce venenos y nadie se enteraría.
// Y el ítem de partida de este fichero NO es limpio a propósito: declara
// para «Cīvitās» una terminación `-is` que la palabra no tiene, y además
// «omnis» saldría de tema + esa terminación. Dos fallos a la vez, los dos
// buscados.
describe('un ítem limpio no da ningún fallo', () => {
  it('el neutro de «omnis» con un nombre en -um', () => {
    const limpio = con({
      celda: 'n.nom.sg', respuesta: 'omne', marco: '___ bellum malum est.',
      pista: 'sujeto, neutro singular', glosa: 'Toda guerra es mala.',
      nombreEnElMarco: 'bellum', desinenciaDelNombre: 'um',
      ejes: { terminaciones: 2, examina: 'terminaciones' },
    });
    expect(revisarItemAdjetivo(limpio)).toEqual([]);
  });

  it('y el de partida SÍ da uno, que es lo que lo hace un control', () => {
    expect(clases(base)).toContain('copiar-la-desinencia-del-nombre');
  });

  it('una letra compartida NO es copiar la desinencia: «ācris» junto a «mēns»', () => {
    // La primera versión del gate marcaba esto, y era falso: quien copia la
    // desinencia de «mēns» escribe *«ācrs».
    const item = con({
      adjetivo: adj('ācer'), celda: 'f.nom.sg', respuesta: 'ācris',
      marco: 'Mēns ___ est.', pista: 'sujeto, femenino singular',
      glosa: 'La mente es aguda.', nombreEnElMarco: 'Mēns', desinenciaDelNombre: 's',
      ejes: { terminaciones: 3, examina: 'terminaciones' },
    });
    expect(clases(item)).not.toContain('copiar-la-desinencia-del-nombre');
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('declarar que se examina el varia en una celda donde no varía', () => {
    expect(clases(con({ celda: 'm.gen.pl', respuesta: 'omnium', desinenciaDelNombre: 'ārum' })))
      .toContain('examina-celda-invariante');
  });

  it('la respuesta escrita a mano que no es la que deriva la máquina', () => {
    expect(clases(con({ respuesta: 'omne' }))).toContain('respuesta-no-derivable');
  });

  it('el número de terminaciones mal declarado', () => {
    expect(clases(con({ adjetivo: adj('fēlīx'), respuesta: 'fēlīx', ejes: { terminaciones: 2, examina: 'terminaciones' } })))
      .toContain('eje-mal-declarado');
  });

  it('copiar la desinencia del nombre de al lado', () => {
    expect(clases(con({
      celda: 'f.gen.pl', respuesta: 'omnium', marco: 'Cūra ___ partium magna est.',
      pista: 'posesor, femenino plural', glosa: 'El cuidado de todas las partes es grande.',
      nombreEnElMarco: 'partium', desinenciaDelNombre: 'ium',
      ejes: { terminaciones: 2, examina: 'tema-en-i' },
    }))).toContain('copiar-la-desinencia-del-nombre');
  });

  it('el marco que lleva otra forma del mismo adjetivo', () => {
    expect(clases(con({ marco: 'Cīvitās omnia et ___ sunt.', respuesta: 'omnis' })))
      .toContain('pista-regala-la-forma');
  });

  it('el marco sin hueco', () => {
    expect(clases(con({ marco: 'Cīvitās magna est.' }))).toContain('marco-mal');
  });

  it('el participio en función verbal declarado fuera del ablativo', () => {
    expect(clases(con({
      adjetivo: adj('praesēns'), celda: 'm.nom.sg', respuesta: 'praesēns',
      nombreEnElMarco: 'Cīvitās', desinenciaDelNombre: 's',
      ejes: { terminaciones: 1, examina: 'participio-e', funcion: 'verbal' },
    }))).toContain('eje-mal-declarado');
  });
});

describe('la tasa ciega sin denominador miente por construcción', () => {
  it('la regla de los de dos coincide con lo correcto fuera del nominativo singular', () => {
    const fuera = [
      con({ id: 'a', celda: 'm.gen.pl', respuesta: 'omnium', marco: 'Cūra puellārum ___ magna est.', nombreEnElMarco: 'puellārum', desinenciaDelNombre: 'ārum', ejes: { terminaciones: 2, examina: 'tema-en-i' } }),
      con({ id: 'b', celda: 'f.dat.pl', respuesta: 'omnibus', marco: 'Dōna puellīs ___ dat.', nombreEnElMarco: 'puellīs', desinenciaDelNombre: 'īs', ejes: { terminaciones: 2, examina: 'tema-en-i' } }),
    ];
    // Sobre el lote entero daría 100 % y no decidiría nada: ahí la regla de
    // los de dos ES la regla buena. El denominador lo dice.
    expect(tasasCiegasA(fuera).reglaDeDos).toEqual({ tasa: 0, decididos: 0, total: 2 });
    // Y no se anuncia como estrategia. Ni la clase sola ni el texto solo
    // sirven, y las dos versiones fallaron antes de ésta: `estrategia-ciega`
    // la comparten varias rutas, y el texto «la regla de los de dos» sale
    // también en el renglón de COBERTURA, que dice lo contrario —que no
    // decidió sobre nadie—. Hay que cruzar las dos cosas.
    const ciegas = revisarLoteAdjetivo(fuera).filter((f) => f.clase === 'estrategia-ciega');
    expect(ciegas.map((f) => f.detalle).join(' ')).not.toContain('regla de los de dos');
  });
});

describe('los venenos de LOTE, que no se ven ítem a ítem', () => {
  const limpio = (id: string, p: Partial<ItemAdjetivo3a>) => con({ id, ...p });

  it('un lote sin la excepción declarada del participio sale rojo', () => {
    const lote = [limpio('a', {}), limpio('b', { adjetivo: adj('fēlīx'), respuesta: 'fēlīx', ejes: { terminaciones: 1, examina: 'terminaciones' } })];
    expect(revisarLoteAdjetivo(lote).map((f) => f.clase)).toContain('sin-excepcion');
  });

  it('un lote sin ningún ítem en celda que distinga deja la cobertura del varia en cero', () => {
    const lote = [
      limpio('a', { celda: 'm.gen.pl', respuesta: 'omnium', marco: 'Cūra puellārum ___ magna est.', nombreEnElMarco: 'puellārum', desinenciaDelNombre: 'ārum', ejes: { terminaciones: 2, examina: 'tema-en-i' } }),
      limpio('b', { celda: 'f.dat.pl', respuesta: 'omnibus', marco: 'Dōna puellīs ___ dat.', nombreEnElMarco: 'puellīs', desinenciaDelNombre: 'īs', ejes: { terminaciones: 2, examina: 'tema-en-i' } }),
    ];
    const cob = coberturaAdjetivo(lote).find((c) => c.comprobacion === 'el número de terminaciones')!;
    expect(cob.decididos).toBe(0);
    expect(revisarLoteAdjetivo(lote).map((f) => f.clase)).toContain('cobertura-cero');
  });

  it('un lote entero de adjetivos de dos terminaciones deja la regla de los de dos al 100 %', () => {
    const lote = [
      limpio('a', {}),
      limpio('b', { celda: 'n.nom.sg', respuesta: 'omne', marco: '___ bellum malum est.', nombreEnElMarco: 'bellum', desinenciaDelNombre: 'um', ejes: { terminaciones: 2, examina: 'terminaciones' } }),
      limpio('c', { adjetivo: adj('gravis'), celda: 'f.nom.sg', respuesta: 'gravis', marco: 'Cūra ___ est.', nombreEnElMarco: 'Cūra', desinenciaDelNombre: 'a', ejes: { terminaciones: 2, examina: 'terminaciones' } }),
    ];
    const r = tasasCiegasA(lote).reglaDeDos;
    expect(r).toEqual({ tasa: 1, decididos: 3, total: 3 });
    expect(revisarLoteAdjetivo(lote).map((f) => f.clase)).toContain('estrategia-ciega');
  });
});

describe('los dos huecos que destapó el pase adversarial', () => {
  const nom = (id: string, lema: string, g: 'm' | 'f' | 'n', respuesta: string, nombre: string, des: string): ItemAdjetivo3a => ({
    id, punto: 'l4-adjetivo-3a', adjetivo: adj(lema), celda: `${g}.nom.sg`, respuesta,
    marco: `${nombre} ___ est.`, pista: 'sujeto, singular', glosa: 'Es así.',
    nombreEnElMarco: nombre, desinenciaDelNombre: des,
    ejes: { terminaciones: adj(lema).terminaciones, examina: 'terminaciones' },
  });

  it('cubrir el varia no es medirlo siete veces en el mismo tipo', () => {
    // Tres ítems que declaran examinar el número de terminaciones, y los
    // tres del mismo tipo: la cobertura antigua decía 3 de 3.
    const lote = [
      nom('a', 'omnis', 'f', 'omnis', 'Cīvitās', 'ās'),
      nom('b', 'gravis', 'f', 'gravis', 'Cūra', 'a'),
      nom('c', 'fortis', 'n', 'forte', 'Bellum', 'um'),
    ];
    const fallos = revisarLoteAdjetivo(lote).map((f) => f.clase);
    expect(fallos).toContain('varia-incompleto');
    // y la cobertura, sola, los habría dado por buenos
    expect(coberturaAdjetivo(lote).find((c) => c.comprobacion === 'el número de terminaciones')!.decididos).toBe(3);
  });

  it('rimar con el nombre del marco se mide, y dos letras es rima', () => {
    expect(rima(nom('a', 'omnis', 'f', 'omnium', 'puellārum', 'ārum'))).toBe(2);
    expect(rima(nom('b', 'fēlīx', 'm', 'fēlīx', 'Rēx', 'x'))).toBe(1);
    expect(rima(nom('c', 'ācer', 'f', 'ācris', 'Mēns', 's'))).toBe(1);
  });
});

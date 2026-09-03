// tests/unit/inventario-la.test.ts
//
// Los invariantes del inventario de puntos del latín. Cada uno existe
// porque sin él una clase entera de defecto pasa desapercibida, y casi
// todos vienen de una cicatriz de otra lengua de este proyecto.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  PUNTOS_LA, BLOQUES_LA, DESCRIPTORES_FUERA_DEL_INVENTARIO,
  formatoDeLa, PISO_LA, type PuntoLa,
} from '@/lib/data/languages/la/inventario-puntos';

const DOC = fs.readFileSync(path.join(process.cwd(), 'docs/plans/2026-07-28-curriculos-completos.md'), 'utf8');
const SECCION_LA = DOC.slice(DOC.indexOf('\n## Latín\n'));

describe('estructura', () => {
  it('los ids son únicos y llevan prefijo de bloque', () => {
    const ids = PUNTOS_LA.map((p) => p.id);
    expect(new Set(ids).size, 'ids duplicados').toBe(ids.length);
    // El prefijo `l<bloque>-` los hace de OTRA lengua: ninguna herramienta
    // de PT o RO debe casarlos por accidente.
    for (const p of PUNTOS_LA) expect(p.id, `${p.id} no lleva el prefijo de su bloque`).toMatch(new RegExp(`^l${p.bloque}-`));
  });

  it('cada punto apunta a un bloque que existe', () => {
    const bloques = new Set(BLOQUES_LA.map((b) => b.id));
    for (const p of PUNTOS_LA) expect(bloques.has(p.bloque), `${p.id}: bloque ${p.bloque} no existe`).toBe(true);
  });

  it('los prereqs apuntan a puntos que existen', () => {
    const ids = new Set(PUNTOS_LA.map((p) => p.id));
    for (const p of PUNTOS_LA) {
      for (const r of p.prereqs) expect(ids.has(r), `${p.id}: prereq «${r}» no existe`).toBe(true);
    }
  });

  it('no hay ciclos en los prereqs', () => {
    const por = new Map(PUNTOS_LA.map((p) => [p.id, p.prereqs]));
    const estado = new Map<string, number>();
    const visita = (id: string, camino: string[]): void => {
      if (estado.get(id) === 2) return;
      expect(estado.get(id), `ciclo: ${[...camino, id].join(' → ')}`).not.toBe(1);
      estado.set(id, 1);
      for (const r of por.get(id) ?? []) visita(r, [...camino, id]);
      estado.set(id, 2);
    };
    for (const p of PUNTOS_LA) visita(p.id, []);
  });
});

describe('la CITA es un sello que se comprueba', () => {
  it('cada `cita` existe TEXTUALMENTE en la sección §Latín del currículo', () => {
    // En rumano 85 de 103 `fuente` apuntaban a otra cosa porque eran
    // números de línea. Un sello que no se comprueba no responde a
    // ninguna pregunta.
    const malas = PUNTOS_LA.filter((p) => !SECCION_LA.includes(p.cita)).map((p) => `${p.id}: «${p.cita}»`);
    expect(malas, `citas que no aparecen en §Latín:\n${malas.join('\n')}`).toEqual([]);
  });

  it('y NO vale una frase de otra lengua: la cita tiene que estar en §Latín, no antes', () => {
    const antes = DOC.slice(0, DOC.indexOf('\n## Latín\n'));
    const sospechosas = PUNTOS_LA.filter((p) => antes.includes(p.cita) && !SECCION_LA.includes(p.cita));
    expect(sospechosas.map((p) => p.id)).toEqual([]);
  });
});

describe('ningún descriptor se queda sin mecanismo', () => {
  it('todo descriptor del currículo está cubierto por un punto o declarado fuera', () => {
    // En portugués 32 unidades de escucha se quedaron fuera sin que nadie
    // lo dijera. El test exige que cada descriptor esté o en `cubre` o en
    // la tabla de fuera, con su motivo.
    const declarados = new Set<string>();
    const re = /^### Latín · (L\d) — /gm;
    let m: RegExpExecArray | null;
    const secciones: { peldano: string; cuerpo: string }[] = [];
    while ((m = re.exec(SECCION_LA))) {
      const fin = SECCION_LA.indexOf('\n### ', m.index + 1);
      secciones.push({ peldano: m[1]!, cuerpo: SECCION_LA.slice(m.index, fin < 0 ? undefined : fin) });
    }
    expect(secciones.length, 'no se encontraron los peldaños en el currículo').toBeGreaterThan(0);
    for (const { peldano, cuerpo } of secciones) {
      for (const b of cuerpo.matchAll(/^- \[([^\]]+)\]/gm)) declarados.add(`${peldano}/${b[1]!.trim()}`);
    }
    const cubiertos = new Set(PUNTOS_LA.flatMap((p) => p.cubre));
    const huerfanos = [...declarados].filter((d) => !cubiertos.has(d) && !(d in DESCRIPTORES_FUERA_DEL_INVENTARIO));
    expect(huerfanos, `descriptores sin punto y sin declaración:\n${huerfanos.join('\n')}`).toEqual([]);
  });

  it('y todo lo que `cubre` un punto es un descriptor real del currículo', () => {
    // El troceo va por índices y NO por un lookahead con `$` en modo
    // multilínea: la primera versión usaba `[\s\S]*?(?=\n### |$)`, que con
    // `m` corta en el primer fin de LÍNEA y dejaba todas las secciones
    // vacías — o sea que el test marcaba los 116 `cubre` como inventados.
    // Un gate que marca de más se deja de leer.
    const declarados = new Set<string>();
    const re2 = /^### Latín · (L\d) — /gm;
    let mm: RegExpExecArray | null;
    while ((mm = re2.exec(SECCION_LA))) {
      const peldano = mm[1]!;
      const fin = SECCION_LA.indexOf('\n### ', mm.index + 1);
      const cuerpo = SECCION_LA.slice(mm.index, fin < 0 ? undefined : fin);
      for (const d of cuerpo.matchAll(/^- \[([^\]]+)\]/gm)) declarados.add(`${peldano}/${d[1]!.trim()}`);
    }
    const inventados = [...new Set(PUNTOS_LA.flatMap((p) => p.cubre))].filter((c) => !declarados.has(c));
    expect(inventados, `«cubre» que no existe en el currículo:\n${inventados.join('\n')}`).toEqual([]);
  });
});

describe('los cuatro campos que el rumano pagó por descubrir', () => {
  it('TODO punto declara qué VARÍA entre sus ítems', () => {
    // Ocho ítems correctos pueden ser uno repetido ocho veces si la
    // operación es invariante. No es propiedad de ningún ítem y ningún
    // gate por ítem lo ve.
    const sin = PUNTOS_LA.filter((p) => !p.varia || p.varia.trim().length < 15).map((p) => p.id);
    expect(sin, `puntos sin declarar qué varía:\n${sin.join('\n')}`).toEqual([]);
  });

  it('un punto cuya dificultad es la OMISIÓN no puede examinarse por corrección', () => {
    // El formato de corrección sólo enseña una frase mala y pide
    // arreglarla: mide lo que el alumno pone de más, nunca lo que deja de
    // poner. En latín es literal para el ablativo absoluto y el acusativo
    // con infinitivo.
    const malos = PUNTOS_LA.filter((p) => p.dificultadEsOmision && formatoDeLa(p) === 'correccion').map((p) => p.id);
    expect(malos, `la corrección no puede medir la subproducción:\n${malos.join('\n')}`).toEqual([]);
  });

  it('la invariancia justificada lleva MOTIVO, no es una casilla', () => {
    for (const p of PUNTOS_LA) {
      if (p.invarianciaJustificada !== undefined) {
        expect(p.invarianciaJustificada.length, `${p.id}: invariancia sin motivo`).toBeGreaterThan(30);
      }
    }
  });

  it('un `abierto` bloquea la producción y por eso se cuenta', () => {
    // No es un fallo tenerlos; es un fallo no saber cuántos hay.
    const abiertos = PUNTOS_LA.filter((p) => p.abierto);
    expect(abiertos.length, `abiertos: ${abiertos.map((p) => p.id).join(', ')}`).toBeLessThanOrEqual(5);
  });
});

describe('el juicio binario está muerto y tiene que seguir muerto', () => {
  it('ningún punto usa `juicio` sin un motivo que empiece por MEDIDO', () => {
    // Murió en portugués (E2#20) porque la glosa contiene la respuesta.
    // En latín muere además por una razón más fuerte: **no hay hablante
    // nativo en ninguna parte**, ni siquiera para quien escribe el ítem.
    const juicios = PUNTOS_LA.filter((p) => formatoDeLa(p) === 'juicio' && !p.motivo.startsWith('MEDIDO'));
    expect(juicios.map((p) => p.id)).toEqual([]);
  });
});

describe('el eje propio del latín', () => {
  it('un punto con `ordenEnganya: si` NO se examina con juicio ni con flashcard', () => {
    // Si la lectura española es coherente y falsa, el ítem tiene que
    // obligar a PARSEAR: un binario se acierta el 50 % con una moneda y
    // una flashcard no tiene sintaxis que leer.
    const malos = PUNTOS_LA
      .filter((p) => p.calco.ordenEnganya === 'si' && ['juicio', 'flashcard'].includes(formatoDeLa(p)))
      .map((p) => `${p.id} (${formatoDeLa(p)})`);
    expect(malos, `formato que no puede medir «ordenEnganya»:\n${malos.join('\n')}`).toEqual([]);
  });

  it('hay una masa real de puntos con `ordenEnganya: si` — es la dificultad maestra', () => {
    // Si esta cuenta cayera a un puñado, sería señal de que la columna se
    // está poniendo desde la clase y no desde el error concreto, que es
    // como se puso mal en rumano en 17 puntos.
    const n = PUNTOS_LA.filter((p) => p.calco.ordenEnganya === 'si').length;
    expect(n, 'muy pocos puntos declaran la trampa maestra: revisar si la columna se está poniendo mecánicamente').toBeGreaterThan(15);
  });

  it('los puntos de RECEPCIÓN no se examinan con transformación', () => {
    // Transformar es producir. Un punto declarado receptivo examinado por
    // transformación mide otra cosa que la que declara.
    const malos = PUNTOS_LA
      .filter((p) => p.calco.via === 'recepcion' && formatoDeLa(p) === 'transformacion')
      .map((p) => p.id);
    expect(malos, `receptivos examinados por producción:\n${malos.join('\n')}`).toEqual([]);
  });
});

describe('el presupuesto', () => {
  it('el piso es 8, y 6 en el peldaño más alto', () => {
    expect(PISO_LA('L1')).toBe(8);
    expect(PISO_LA('L4')).toBe(6);
  });

  it('el presupuesto a piso se puede calcular y se deja escrito', () => {
    const piso = PUNTOS_LA.reduce((a: number, p: PuntoLa) => a + PISO_LA(p.peldano), 0);
    expect(piso).toBeGreaterThan(0);
    // La cifra que GOBIERNA, frente a los 1.240 del currículo que son
    // volumen. Si esto se dispara, alguien ha metido puntos sin mirar.
    expect(piso).toBeLessThan(1400);
  });
});

// ── Invariantes que salieron del ataque del latinista adversarial ────
describe('lo que el ataque del latinista destapó, convertido en gate', () => {
  it('un punto RECEPTIVO no puede examinarse por CORRECCIÓN', () => {
    // El hallazgo sistemático del ataque (§4.4), y es el más valioso:
    // `correccion` enseña una frase mala y pide arreglarla, o sea que es
    // un formato de PRODUCCIÓN. Un punto cuya dificultad declarada es de
    // LECTURA no tiene frase mala que enseñar — en `l6-pasiva-perifrastica`
    // el error diana es leer «amātus est» como presente, y «amātus est» no
    // tiene nada que corregir.
    //
    // Siete puntos caían en esto **por defecto de clase**, sin que nadie
    // lo escribiera: `FORMATO_DE_CLASE_LA` mapea `trampa → correccion` y
    // no mira la vía. Es el mismo patrón que `dificultadEsOmision`, en la
    // dirección contraria.
    const malos = PUNTOS_LA
      .filter((p) => p.calco.via === 'recepcion' && formatoDeLa(p) === 'correccion')
      .map((p) => `${p.id} (clase ${p.clase})`);
    expect(malos, `receptivos con formato de producción:\n${malos.join('\n')}`).toEqual([]);
  });

  it('ningún punto declara `invarianciaJustificada` Y `varia` que se contradigan', () => {
    // `l1-h-muda` decía a la vez «varía la posición de la h» y «la
    // operación es la misma en todos los contextos». Uno de los dos
    // sobra, y el que sobra es el `varia`.
    for (const p of PUNTOS_LA) {
      if (p.invarianciaJustificada && p.varia.length > 60) {
        throw new Error(`${p.id}: declara invariancia justificada Y un \`varia\` largo — se contradicen`);
      }
    }
  });

  it('los prereqs no van de un peldaño ALTO a uno bajo', () => {
    // Dos puntos quedaron bloqueados detrás de una puerta de un peldaño
    // posterior: `l9-temporales` (L2) dependía de `l7-cum-historico` (L3),
    // y `l13-vulgata-sintaxis` (L1) —que explica por qué el curso empieza
    // por la Vulgata— dependía de un punto de L2.
    const orden = { L1: 1, L2: 2, L3: 3, L4: 4 } as const;
    const por = new Map(PUNTOS_LA.map((p) => [p.id, p]));
    const malos: string[] = [];
    for (const p of PUNTOS_LA) {
      for (const r of p.prereqs) {
        const q = por.get(r);
        if (q && orden[q.peldano] > orden[p.peldano]) malos.push(`${p.id} (${p.peldano}) ← ${r} (${q.peldano})`);
      }
    }
    expect(malos, `prereqs que van hacia atrás en la escalera:\n${malos.join('\n')}`).toEqual([]);
  });

  it('un punto no puede pedir más valores que el piso de su peldaño', () => {
    // `l12-licencias` pedía cubrir SIETE licencias con un piso de SEIS.
    // Aritméticamente imposible, y ningún gate por ítem lo habría visto.
    //
    // La primera versión de este test buscaba palabras de número en el
    // texto de `varia` y marcaba la redacción corregida —«las declaradas
    // son siete y se cubren seis»—, que es exactamente lo que hay que
    // escribir. Un gate que marca de más se deja de leer, así que el dato
    // se declara en un campo.
    for (const p of PUNTOS_LA) {
      if (p.valoresQueCubre === undefined) continue;
      expect(p.valoresQueCubre, `${p.id}: cubre ${p.valoresQueCubre} valores y el piso de ${p.peldano} es ${PISO_LA(p.peldano)}`)
        .toBeLessThanOrEqual(PISO_LA(p.peldano));
    }
  });
});

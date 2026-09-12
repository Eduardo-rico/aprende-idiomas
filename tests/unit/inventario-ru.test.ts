import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import {
  PUNTOS_RU, BLOQUES_RU, DESCRIPTORES_FUERA_DEL_INVENTARIO,
  formatoDeRu, pisoDePuntoRu, type NivelRu, type CapaRu,
} from '@/lib/data/languages/ru/inventario-puntos';

const DOC = 'docs/plans/2026-07-28-curriculos-completos.md';
const seccionRusa = (): string => {
  const d = fs.readFileSync(DOC, 'utf8');
  const i = d.indexOf('## Ruso');
  const j = d.indexOf('## Latín', i);
  expect(i, 'la sección §Ruso tiene que existir').toBeGreaterThan(-1);
  return d.slice(i, j > 0 ? j : undefined);
};

const ORDEN: NivelRu[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const rango = (n: NivelRu) => ORDEN.indexOf(n);

describe('inventario-ru · integridad', () => {
  it('ids únicos y bloques declarados', () => {
    const ids = PUNTOS_RU.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const bloques = new Set(BLOQUES_RU.map((b) => b.id));
    for (const p of PUNTOS_RU) expect(bloques.has(p.bloque), p.id).toBe(true);
    // El prefijo lleva el bloque: un id que mienta sobre su bloque es la
    // clase de sello que responde a otra pregunta.
    for (const p of PUNTOS_RU) expect(p.id.startsWith(`u${p.bloque}-`), p.id).toBe(true);
  });

  it('la CITA de cada punto está textualmente en §Ruso, y sólo ahí', () => {
    // En rumano la v0 llevaba un número de línea y 85 de 103 apuntaban a
    // otra cosa: un sello que no se comprueba no responde a ninguna
    // pregunta. Una frase del currículo portugués tampoco vale.
    const sec = seccionRusa();
    const malas = PUNTOS_RU.filter((p) => !sec.includes(p.cita));
    expect(malas.map((p) => `${p.id}: ${p.cita}`)).toEqual([]);
  });

  it('los prereqs existen y NO apuntan hacia adelante en el nivel', () => {
    const porId = new Map(PUNTOS_RU.map((p) => [p.id, p]));
    for (const p of PUNTOS_RU) {
      for (const q of p.prereqs) {
        const dep = porId.get(q);
        expect(dep, `${p.id} → ${q} no existe`).toBeDefined();
        expect(rango(dep!.nivel), `${p.id} (${p.nivel}) depende de ${q} (${dep!.nivel}), que es posterior`)
          .toBeLessThanOrEqual(rango(p.nivel));
      }
    }
  });
});

describe('inventario-ru · la atribución de la dificultad', () => {
  it('toda capa DADA tiene dueño: algún punto la EXAMINA en un nivel igual o anterior', () => {
    // Es el invariante que hace computable «este ítem mide su punto». Si
    // un ítem carga una capa que nadie ha enseñado todavía, su fallo no
    // dice qué reforzar — y con cuatro capas nuevas a la vez, un ítem que
    // mide «ruso» no mide nada.
    const dueños = new Map<CapaRu, number>();
    for (const p of PUNTOS_RU) {
      const r = rango(p.nivel);
      const y = dueños.get(p.capas.examina);
      if (y === undefined || r < y) dueños.set(p.capas.examina, r);
    }
    const huerfanas: string[] = [];
    for (const p of PUNTOS_RU) {
      for (const c of p.capas.dadas) {
        const r = dueños.get(c);
        if (r === undefined) huerfanas.push(`${p.id} da «${c}» y NINGÚN punto la examina`);
        else if (r > rango(p.nivel)) huerfanas.push(`${p.id} (${p.nivel}) da «${c}», que nadie examina antes de ${ORDEN[r]}`);
      }
    }
    expect(huerfanas).toEqual([]);
  });

  // ⚠ EL INVARIANTE DE ARRIBA ERA UN GUARDIÁN QUE VOLVÍA NO-OP SU PROPIA
  // DECISIÓN, y lo destapó el lingüista adversarial el 2026-09-11: comprueba
  // que la capa dada tenga DUEÑO, y los tres dueños de `acento`
  // (u2-acento-fonemico, u2-acento-movil, u15-metrica-poetica) están a
  // pisoCero. O sea que la condición salía en verde sobre una capa con CERO
  // ítems detrás, en cinco sitios. Existir no es enseñar.
  //
  // El arreglo no es bajar el criterio ni silenciarlo: es exigir que un
  // punto que carga una capa sin dueño PRODUCIBLE lo declare por escrito.
  // Es la forma del pisoCero y la de la cuarentena — el invariante no es un
  // número, es «cero capas huérfanas sin motivo escrito».
  it('toda capa dada tiene dueño PRODUCIBLE, o el punto declara el hueco', () => {
    const producibles = new Map<CapaRu, number>();
    for (const p of PUNTOS_RU) {
      if (pisoDePuntoRu(p) === 0) continue;
      const r = rango(p.nivel);
      const y = producibles.get(p.capas.examina);
      if (y === undefined || r < y) producibles.set(p.capas.examina, r);
    }
    const mudos: string[] = [];
    for (const p of PUNTOS_RU) {
      if (pisoDePuntoRu(p) === 0) continue; // un punto que no produce no carga nada
      for (const c of p.capas.dadas) {
        const r = producibles.get(c);
        const cubierta = r !== undefined && r <= rango(p.nivel);
        if (cubierta) continue;
        // El hueco es legítimo si está DECLARADO: `abierto` tiene que
        // nombrar la capa, no basta con que exista.
        if ((p.abierto ?? '').includes(c)) continue;
        mudos.push(`${p.id} (${p.nivel}) carga «${c}» y no hay punto PRODUCIBLE que la examine antes; declárala en \`abierto\``);
      }
    }
    expect(mudos.sort()).toEqual([]);
  });

  it('ningún punto se examina a sí mismo por partida doble', () => {
    for (const p of PUNTOS_RU)
      expect(p.capas.dadas, p.id).not.toContain(p.capas.examina);
  });
});

describe('inventario-ru · lo que no se puede dejar vacío', () => {
  it('TODOS declaran `gratis`, y ninguno lo despacha en una línea', () => {
    // El campo existe porque la pregunta que decidió los cinco últimos
    // lotes del rumano —¿qué trae ya hecho el alumno?— llegó con el curso
    // medio escrito. Aquí es obligatoria antes de declarar el punto.
    const flojos = PUNTOS_RU.filter((p) => (p.gratis ?? '').trim().length < 40);
    expect(flojos.map((p) => p.id)).toEqual([]);
  });

  it('`gratis` nombra a las DOS lenguas del alumno, o dice por qué no', () => {
    // En rumano media transferencia la pagaba el portugués y nadie la
    // contaba. Un `gratis` que sólo mire al español repite ese hueco.
    const mudos = PUNTOS_RU.filter((p) => {
      const g = p.gratis.toLowerCase();
      return !/portugu|dos lenguas|las dos|ninguna de las dos|nada\b/.test(g);
    });
    expect(mudos.map((p) => p.id)).toEqual([]);
  });

  it('`pisoCero` y `pisoDeclarado` llevan motivo, y el declarado dice un número', () => {
    for (const p of PUNTOS_RU) {
      if (p.pisoCero !== undefined) expect(p.pisoCero.trim().length, p.id).toBeGreaterThan(30);
      if (p.pisoDeclarado) {
        expect(p.pisoDeclarado.motivo.trim().length, p.id).toBeGreaterThan(30);
        expect(p.pisoDeclarado.piso, p.id).toBeGreaterThan(0);
        expect(p.pisoDeclarado.piso, `${p.id}: un piso declarado igual o mayor que el normal no es una reducción`)
          .toBeLessThan(p.nivel === 'C2' ? 6 : 8);
      }
      // Un punto no puede llevar los dos: son respuestas distintas a la
      // misma pregunta y tenerlas las dos es no haberla contestado.
      expect(!(p.pisoCero && p.pisoDeclarado), p.id).toBe(true);
      expect(p.motivo.trim().length, p.id).toBeGreaterThan(20);
    }
  });

  it('todo punto sin `cubre` denuncia el hueco con `sinDescriptor`', () => {
    // La lección son las 32 unidades de escucha que en portugués se
    // quedaron fuera sin que nadie lo dijera.
    const mudos = PUNTOS_RU.filter((p) => p.cubre.length === 0 && !p.sinDescriptor);
    expect(mudos.map((p) => p.id)).toEqual([]);
  });
});

describe('inventario-ru · los descriptores del currículo', () => {
  it('ningún descriptor EN ALCANCE queda sin punto y sin declaración', () => {
    const sec = seccionRusa();
    const EXCLUIDAS = new Set(['PRODUCCIÓN ORAL', 'INTERACCIÓN', 'INTERACCIÓN ORAL', 'INTERACCIÓN ESCRITA']);
    const enAlcance = new Set<string>();
    const orden = new Map<string, number>();
    let nivel: NivelRu | null = null;
    let dentro = false;
    for (const l of sec.split('\n')) {
      const h = /^### Ruso · (?:pre_A1 \+ )?(A1|A2|B1|B2|C1|C2)/.exec(l);
      if (h) { nivel = h[1] as NivelRu; continue; }
      if (/\*\*Sabrá hacer \(\d+\):\*\*/.test(l)) { dentro = true; continue; }
      if (!dentro) continue;
      if (l.trim() === '') continue;
      if (!l.startsWith('- ')) { dentro = false; continue; }
      const t = /^- \[([^\]]+)\]/.exec(l);
      if (!t || !nivel) continue;
      const etiqueta = t[1]!.trim();
      const categoria = etiqueta.split('·')[0]!.trim();
      if (EXCLUIDAS.has(categoria)) continue;
      // ⚠ CON ORDINAL. §Ruso tiene varios descriptores con el mismo nivel y
      // la misma etiqueta (dos COMPRENSIÓN ORAL en A1, TRES COMPRENSIÓN
      // LECTORA en C2), así que la clave sin ordinal funde descriptores
      // distintos y da por cubierto lo que no lo está.
      const n = (orden.get(`${nivel}/${categoria}`) ?? 0) + 1;
      orden.set(`${nivel}/${categoria}`, n);
      enAlcance.add(`${nivel}/${categoria} #${n}`);
    }
    expect(enAlcance.size, 'el parser tiene que encontrar descriptores; si da 0 no está midiendo').toBeGreaterThan(30);

    const cubiertos = new Set<string>();
    for (const p of PUNTOS_RU) for (const c of p.cubre) cubiertos.add(c.split('·')[0]!.trim());
    // Aquí sí se parte por «·»: una entrada `… #1 · dictado de números`
    // declara UNA MITAD del descriptor, y para saber si el descriptor está
    // ATENDIDO basta con que alguien lo nombre.
    const declarados = new Set(Object.keys(DESCRIPTORES_FUERA_DEL_INVENTARIO).map((k) => k.split('·')[0]!.trim()));

    const huerfanos = [...enAlcance].filter((d) => !cubiertos.has(d) && !declarados.has(d));
    expect(huerfanos.sort()).toEqual([]);
  });

  // ⚠ EL TEST DE ARRIBA SÓLO CAZA «EN NINGUNO DE LOS DOS», y el caso que
  // oculta el fallo real es «EN LOS DOS» (lingüista adversarial,
  // 2026-09-11). Un descriptor que está a la vez en `cubre` y en
  // DESCRIPTORES_FUERA afirma dos cosas incompatibles —lo cubre un punto y
  // lo cubre otro mecanismo— y nadie lo mira. Es peor que el hueco abierto,
  // porque el hueco se ve y la doble declaración parece cobertura de sobra.
  it('ningún descriptor se declara a la vez cubierto por un punto y fuera del inventario', () => {
    const cubiertos = new Set<string>();
    for (const p of PUNTOS_RU) for (const c of p.cubre) cubiertos.add(c.split('·')[0]!.trim());
    // ⚠ AQUÍ NO se parte por «·», y es la mitad que faltaba: una entrada
    // con calificador (`A1/COMPRENSIÓN ORAL #1 · dictado de números…`)
    // declara explícitamente que cubre OTRA MITAD del mismo descriptor, y
    // eso es legítimo y es justo lo que hay que poder escribir. Lo que no
    // puede haber es la MISMA clave en los dos sitios.
    const dobles = Object.keys(DESCRIPTORES_FUERA_DEL_INVENTARIO)
      .filter((k) => cubiertos.has(k.trim()));
    expect([...new Set(dobles)].sort()).toEqual([]);
  });

  it('nada en DESCRIPTORES_FUERA_DEL_INVENTARIO se declara sin motivo', () => {
    for (const [k, v] of Object.entries(DESCRIPTORES_FUERA_DEL_INVENTARIO))
      expect(v.trim().length, k).toBeGreaterThan(15);
  });
});

describe('inventario-ru · la deuda se cuenta, no se tiñe de verde', () => {
  it('los formatos SIN MÁQUINA no prometen cobertura: sus puntos van a piso cero o quedan abiertos', () => {
    // Declararle cobertura a un formato que no existe es el gate
    // declarado y ausente: la definición promete y nadie da.
    const SIN_MAQUINA = new Set(['grafico', 'posicion', 'preferencia-registro', 'juicio']);
    for (const p of PUNTOS_RU) {
      if (!SIN_MAQUINA.has(formatoDeRu(p))) continue;
      const declarado = Boolean(p.pisoCero || p.abierto);
      expect(declarado, `${p.id} tiene formato «${formatoDeRu(p)}», que no tiene máquina, y no declara ni pisoCero ni abierto`).toBe(true);
    }
  });

  it('el presupuesto a piso sale de la función, no de una constante escrita a mano', () => {
    const total = PUNTOS_RU.reduce((a, p) => a + pisoDePuntoRu(p), 0);
    // No se fija el número: se comprueba que sea coherente con las
    // declaraciones. Fijarlo obligaría a tocar el test al añadir un punto,
    // y un test que se toca de pasada deja de ser un invariante.
    // ⚠ LA v0 DE ESTA COMPARACIÓN ESTABA AL REVÉS y el test la cazó: sumaba
    // sólo los puntos SIN reducir y exigía que el total fuera menor, lo cual
    // es imposible por construcción (el total incluye además los pisos
    // reducidos). El invariante correcto compara contra el presupuesto SIN
    // ninguna declaración, que es lo que la reducción tiene que bajar.
    const techo = PUNTOS_RU.reduce((a, p) => a + (p.nivel === 'C2' ? 6 : 8), 0);
    const ahorro = techo - total;
    expect(total).toBeLessThan(techo);
    expect(total).toBeGreaterThan(0);
    // Y que el ahorro sea exactamente el que las declaraciones dicen: si no
    // cuadra, hay un piso que baja el número sin motivo escrito, que es
    // justo lo que el campo existe para impedir.
    const declarado = PUNTOS_RU.reduce((a, p) => {
      const normal = p.nivel === 'C2' ? 6 : 8;
      if (p.pisoCero) return a + normal;
      if (p.pisoDeclarado) return a + (normal - p.pisoDeclarado.piso);
      return a;
    }, 0);
    expect(ahorro).toBe(declarado);
  });
});

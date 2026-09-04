// tests/unit/inventario-ro.test.ts
//
// El inventario de puntos del rumano, cruzado contra el currículo del que
// sale. Es el gate del paso 1 de la fase F: un inventario que no cubre un
// descriptor «Sabrá hacer» de sistema deja un agujero que ningún lote va a
// llenar, y un punto que cita un descriptor que no existe se inventó fuera
// del currículo. Las dos direcciones, y el resto son invariantes de forma
// que en PT se rompieron por separado (prereqs sueltos, formato sin
// motivo, juicio por defecto).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PUNTOS_RO, BLOQUES_RO, FORMATO_DE_CLASE_RO, DESCRIPTORES_FUERA_DEL_INVENTARIO, formatoDeRo, PISO_RO , pisoDePuntoRo } from '@/lib/data/languages/ro/inventario-puntos';
import { ALL_CONCEPTS, BLOCKS } from '@/lib/data/languages/ro/curriculum';
import { parsearCurriculo } from '@/scripts/paso0-idioma';

const DOC = fs.readFileSync(path.join(process.cwd(), 'docs/plans/2026-07-28-curriculos-completos.md'), 'utf8');
const NIVELES = parsearCurriculo(DOC, 'ro');
const DESCRIPTORES = new Set(NIVELES.flatMap((n) => n.descriptores.map((d) => `${n.nivel}/${d.etiqueta}`)));
const EN_ALCANCE = new Set(NIVELES.flatMap((n) => n.descriptores.filter((d) => d.destreza !== 'EXCLUIDO').map((d) => `${n.nivel}/${d.etiqueta}`)));
// La sección §Rumano del documento, para comprobar las citas textuales.
const lineas = DOC.split('\n');
const ini = lineas.findIndex((l) => l.trim() === '## Rumano');
const fin = lineas.findIndex((l, i) => i > ini && /^## /.test(l));
const SECCION_RO = lineas.slice(ini, fin).join('\n');

describe('inventario-ro: forma', () => {
  it('ids únicos, con prefijo r<bloque>- que coincide con su bloque', () => {
    const ids = PUNTOS_RO.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PUNTOS_RO) expect(p.id.startsWith(`r${p.bloque}-`), p.id).toBe(true);
    const bloques = new Set(BLOQUES_RO.map((b) => b.id));
    for (const p of PUNTOS_RO) expect(bloques.has(p.bloque), p.id).toBe(true);
  });

  it('todos los prereqs existen y ninguno se apunta a sí mismo', () => {
    const ids = new Set(PUNTOS_RO.map((p) => p.id));
    for (const p of PUNTOS_RO) for (const q of p.prereqs) {
      expect(ids.has(q), `${p.id} → ${q}`).toBe(true);
      expect(q).not.toBe(p.id);
    }
  });

  it('cada punto lleva motivo, descripción, y una CITA textual que existe en §Rumano del currículo', () => {
    const sinCita: string[] = [];
    for (const p of PUNTOS_RO) {
      expect(p.motivo.length, p.id).toBeGreaterThan(20);
      expect(p.descripcion.length, p.id).toBeGreaterThan(20);
      expect(p.cita.length, p.id).toBeGreaterThan(12);
      if (!SECCION_RO.includes(p.cita)) sinCita.push(`${p.id}: «${p.cita}»`);
    }
    expect(sinCita, sinCita.join('\n')).toEqual([]);
  });

  it('la cita se busca SÓLO en §Rumano: una frase del portugués no vale', () => {
    expect(SECCION_RO.includes('Distingue de oído 18 de 20 pares mínimos PT-PT')).toBe(false);
    expect(DOC.includes('Distingue de oído 18 de 20 pares mínimos PT-PT')).toBe(true);
  });

  it('`cubre` vacío sólo con `sinDescriptor` escrito: el hueco del currículo se denuncia, no se tapa', () => {
    for (const p of PUNTOS_RO) {
      if (p.cubre.length === 0) expect(p.sinDescriptor, `${p.id} no cubre nada y no dice por qué`).toBeTruthy();
      else expect(p.sinDescriptor, `${p.id} cubre y a la vez declara sinDescriptor`).toBeUndefined();
    }
  });

  it('el formato sale de la clase; un override lleva su razón en el motivo', () => {
    for (const p of PUNTOS_RO) {
      if (p.formato && p.formato !== FORMATO_DE_CLASE_RO[p.clase]) {
        expect(p.motivo, `${p.id}: override ${p.formato} sin razón`).toMatch(/transformaci|cloze|mediaci|flashcard|correcci/i);
      }
      expect(formatoDeRo(p)).toBe(p.formato ?? FORMATO_DE_CLASE_RO[p.clase]);
    }
  });

  it('el JUICIO no se asigna a nada sin un motivo que empiece por MEDIDO', () => {
    for (const p of PUNTOS_RO) {
      if (formatoDeRo(p) === 'juicio') expect(p.motivo, p.id).toMatch(/^MEDIDO/);
    }
    expect(FORMATO_DE_CLASE_RO.lexico).not.toBe('juicio');
  });

  it('la prueba del calco es coherente con la clase', () => {
    for (const p of PUNTOS_RO) {
      if (p.clase === 'trampa') expect(p.calco.castellano, `${p.id}: trampa exige calco castellano BIEN formado`).toBe('bien');
      if (p.clase === 'coincide') expect(p.calco.castellano, `${p.id}: coincide exige calco castellano MAL formado`).toBe('mal');
      if (p.clase === 'fonologico' || p.clase === 'ortografico') expect(p.calco.castellano, p.id).toBe('no-aplica');
      // La casilla se contesta mirando el error, no la clase: un punto de
      // paradigma cuyo error desnudo es español perfecto dice «bien».
      if (p.clase === 'paradigma') expect(['bien', 'no-aplica']).toContain(p.calco.castellano);
    }
  });

  it('piso 8, y 6 en C2', () => {
    expect(PISO_RO('A1')).toBe(8);
    expect(PISO_RO('C2')).toBe(6);
  });
});

describe('inventario-ro: contra el currículo', () => {
  it('cada descriptor que un punto dice cubrir EXISTE en el currículo con ese nombre exacto', () => {
    const malos: string[] = [];
    for (const p of PUNTOS_RO) for (const c of p.cubre) if (!DESCRIPTORES.has(c)) malos.push(`${p.id} → ${c}`);
    expect(malos, malos.join('\n')).toEqual([]);
  });

  it('cada descriptor de SISTEMA del currículo (gramática, léxico, fonología, pragmática, cultura) tiene al menos un punto', () => {
    const cubiertos = new Set(PUNTOS_RO.flatMap((p) => p.cubre));
    const sinPunto: string[] = [];
    for (const n of NIVELES) for (const d of n.descriptores) {
      if (d.destreza !== 'sistema') continue;
      const k = `${n.nivel}/${d.etiqueta}`;
      if (!cubiertos.has(k)) sinPunto.push(k);
    }
    expect(sinPunto, sinPunto.join('\n')).toEqual([]);
  });

  it('TODO descriptor en alcance está cubierto por un punto O declarado fuera del inventario con su motivo — y no las dos cosas', () => {
    const cubiertos = new Set(PUNTOS_RO.flatMap((p) => p.cubre));
    const fuera = new Set(Object.keys(DESCRIPTORES_FUERA_DEL_INVENTARIO));
    const huerfanos = [...EN_ALCANCE].filter((k) => !cubiertos.has(k) && !fuera.has(k));
    expect(huerfanos, 'en alcance y sin nadie que lo cubra:\n' + huerfanos.join('\n')).toEqual([]);
    const dobles = [...fuera].filter((k) => cubiertos.has(k));
    expect(dobles, 'declarado fuera y cubierto a la vez:\n' + dobles.join('\n')).toEqual([]);
    const inventados = [...fuera].filter((k) => !DESCRIPTORES.has(k));
    expect(inventados, 'declarado fuera pero no existe en el currículo:\n' + inventados.join('\n')).toEqual([]);
    const excluidos = [...fuera].filter((k) => !EN_ALCANCE.has(k));
    expect(excluidos, 'declarado fuera pero ya está excluido por decisión (no hace falta):\n' + excluidos.join('\n')).toEqual([]);
    for (const [k, v] of Object.entries(DESCRIPTORES_FUERA_DEL_INVENTARIO)) expect(v.length, k).toBeGreaterThan(10);
  });

  it('los puntos con `abierto` están listados: no se produce ninguno hasta cerrarlo', () => {
    const abiertos = PUNTOS_RO.filter((p) => p.abierto).map((p) => p.id);
    // r4-vocativo se cerró en dexonline (Paso 0 §12).
    // r8-discurso-indirecto se BLOQUEÓ el 2026-09-03 (lote 21) con sus dos
    // ítems escritos, atacados y retirados: la alternancia vine/venea es
    // subproducción y la cara del futuro no tiene mala atestada. Su piso
    // NO se reduce —la deuda es real— y el motivo entero vive en `abierto`.
    expect(abiertos).toEqual(['r8-discurso-indirecto']);
    // Un punto bloqueado tiene que decir POR QUÉ, no sólo que lo está.
    for (const p of PUNTOS_RO.filter((x) => x.abierto)) expect(p.abierto!.length, p.id).toBeGreaterThan(200);
  });

  it('el gate de cobertura DISPARA: quitando los puntos que cubren A1/FONOLOGÍA, ese descriptor sale sin punto', () => {
    const sinFonologia = PUNTOS_RO.filter((p) => !p.cubre.includes('A1/FONOLOGÍA'));
    expect(sinFonologia.length).toBeLessThan(PUNTOS_RO.length);
    const cubiertos = new Set(sinFonologia.flatMap((p) => p.cubre));
    const sinPunto = NIVELES.flatMap((n) => n.descriptores
      .filter((d) => d.destreza === 'sistema')
      .map((d) => `${n.nivel}/${d.etiqueta}`)
      .filter((k) => !cubiertos.has(k)));
    expect(sinPunto).toEqual(['A1/FONOLOGÍA']);
  });

  it('el nivel de cada punto es el de alguno de los descriptores que cubre (o inferior: se enseña antes)', () => {
    const orden = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    for (const p of PUNTOS_RO) {
      if (p.cubre.length === 0) continue; // sinDescriptor: no hay con qué comparar
      const niveles = p.cubre.map((c) => orden.indexOf(c.split('/')[0] ?? ''));
      expect(orden.indexOf(p.nivel), `${p.id} está en ${p.nivel} pero cubre ${p.cubre.join(', ')}`).toBeLessThanOrEqual(Math.max(...niveles));
    }
  });

  it('ALL_CONCEPTS del rumano es el inventario; sólo existen los bloques con lecciones, y sus conceptIds son puntos del inventario', () => {
    expect(ALL_CONCEPTS.length).toBe(PUNTOS_RO.length);
    const ids = new Set(PUNTOS_RO.map((p) => p.id));
    expect(BLOCKS.length).toBeGreaterThan(0);
    for (const b of BLOCKS) {
      expect(b.lessons.length, `bloque ${b.id} sin lecciones`).toBeGreaterThan(0);
      for (const l of b.lessons) for (const c of l.conceptIds) expect(ids.has(c), `${l.id} → ${c}`).toBe(true);
    }
  });
});

// ── PISO CERO DECLARADO ────────────────────────────────────────────────
// Existe porque el motivo en prosa NO cambia el número: `r1-diacriticos-coma`
// quedó declarado «0 ítems por diseño» y la foto siguió cobrándole 8
// unidades, o sea que la declaración era una promesa que la cuenta no
// cumplía. Y por eso mismo el campo es peligroso: es la forma más barata
// de hacer desaparecer déficit sin producir nada. Estos tests son el
// precio de tenerlo.
describe('pisoCero: el piso declarado en cero', () => {
  it('baja el piso a 0, y sólo cuando está declarado', () => {
    const p = PUNTOS_RO.find((x) => x.nivel === 'A1' && !x.pisoCero)!;
    expect(pisoDePuntoRo(p)).toBe(8);
    expect(pisoDePuntoRo({ ...p, pisoCero: 'un motivo suficientemente largo para el gate' })).toBe(0);
  });

  it('ROJO: un pisoCero sin motivo de verdad no pasa', () => {
    for (const p of PUNTOS_RO) {
      if (p.pisoCero === undefined) continue;
      expect(p.pisoCero.trim().length, `${p.id} declara piso cero sin motivo`).toBeGreaterThan(60);
    }
  });

  // ESTA LISTA ES UNA TRAMPA A PROPÓSITO: declarar un piso cero baja el
  // déficit sin producir nada, así que tiene que costar tocar un test y no
  // poder hacerse de pasada. Cada entrada nueva lleva aquí quién la
  // declaró y con qué medición.
  //   · r1-diacriticos-coma — la distinción coma/cedilla no es
  //     renderizable: el ítem mediría la fuente instalada.
  //   · r4-dativo-oi (2026-09-03) — CERO ítems determinados, medido por el
  //     lingüista adversarial tras dos ataques: la mala declarada era el
  //     dativul analitic (registro popular, no agramatical), el
  //     re-encuadre a «cuándo se exige la» se contesta calcando la «a»
  //     española, y la cara que sí discrimina ya está publicada en
  //     r4-gd-definido-pl.
  it('los que lo declaran están CONTADOS y nombrados, no escondidos', () => {
    const cero = PUNTOS_RO.filter((p) => p.pisoCero);
    expect(cero.map((p) => p.id)).toEqual(['r1-diacriticos-coma', 'r4-dativo-oi']);
  });

  // MISMA TRAMPA A PROPÓSITO QUE `pisoCero`, por la misma razón: declarar un
  // piso reducido baja el déficit sin producir nada. Cada entrada nueva
  // lleva aquí su número y de dónde sale.
  //   · r7-anti-progresivo 6 (2026-09-03) — CONTADO por el lingüista
  //     adversarial ANTES de escribir ningún ítem, tras dictaminar que el
  //     error diana declarado no servía.
  //   · r7-supin 5 (2026-09-03) — CONTADO por el lingüista adversarial
  //     ANTES de escribir ninguno y con el corpus delante: dos marcos del
  //     punto (`e greu de`, `a avea`) quedaron fuera porque admiten la
  //     variante `de a` + infinitivo ATESTADA en el corpus, y tres caras
  //     más no tienen mala ninguna.
  //   · r7-disparadores-sa 2 — nació en 5 y bajó a 2 al REPARTIR el
  //     material con r8-completivas-ca-sa: tres de los cinco eran
  //     literalmente la `cita` de r8. El número no bajó por cansancio ni
  //     por dictamen de lengua, sino porque el material era de otro punto.
  it('el piso reducido está CONTADO y nombrado, no es cansancio', () => {
    const red = PUNTOS_RO.filter((p) => p.pisoDeclarado);
    expect(red.map((p) => `${p.id}:${p.pisoDeclarado!.piso}`)).toEqual(['r4-cel-proforma:2', 'r6-contracciones-cliticos:4', 'r6-cliticos-imperativo-gerunziu:2', 'r7-disparadores-sa:2', 'r7-anti-progresivo:6', 'r7-supin:5']);
    for (const p of red) {
      // El motivo tiene que decir el NÚMERO y de dónde sale, no «da para pocos».
      expect(p.pisoDeclarado!.motivo.length, p.id).toBeGreaterThan(120);
      expect(p.pisoDeclarado!.piso, p.id).toBeLessThan(8);
      expect(p.pisoDeclarado!.piso, p.id).toBeGreaterThan(0);
      expect(pisoDePuntoRo(p), p.id).toBe(p.pisoDeclarado!.piso);
    }
  });

  it('pisoCero manda sobre pisoDeclarado, y ninguno declara los dos', () => {
    for (const p of PUNTOS_RO) expect(!!(p.pisoCero && p.pisoDeclarado), p.id).toBe(false);
  });

  it('un punto con ítems publicados NO puede declarar piso cero', () => {
    // Si ya se produjo contra él, la declaración llega tarde y taparía
    // trabajo hecho en vez de un hueco imposible.
    for (const p of PUNTOS_RO.filter((x) => x.pisoCero)) {
      expect(p.formato ?? '', `${p.id}`).not.toBe('cloze-con-pista-publicado');
    }
    expect(PUNTOS_RO.filter((p) => p.pisoCero).every((p) => p.cubre.length > 0)).toBe(true);
  });
});

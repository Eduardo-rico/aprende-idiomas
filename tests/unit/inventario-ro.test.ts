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
import { PUNTOS_RO, BLOQUES_RO, FORMATO_DE_CLASE_RO, DESCRIPTORES_FUERA_DEL_INVENTARIO, formatoDeRo, PISO_RO } from '@/lib/data/languages/ro/inventario-puntos';
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
    expect(abiertos).toEqual([]); // r4-vocativo se cerró en dexonline (Paso 0 §12)
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

  it('ALL_CONCEPTS del rumano es el inventario; BLOCKS sigue vacío hasta que haya lecciones', () => {
    expect(ALL_CONCEPTS.length).toBe(PUNTOS_RO.length);
    expect(BLOCKS).toEqual([]);
  });
});

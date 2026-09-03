// tests/unit/paso0-idioma.test.ts
//
// El Paso 0 por lengua lleva un gate dentro (descriptores contados ==
// declarados en cabecera). Un gate visto sólo en verde no está probado,
// así que aquí se le da un documento que DEBE hacerlo fallar, y otro con
// una etiqueta que no conoce. Y se comprueba que la parametrización por
// lengua es real: la misma función lee la sección de PT y la de RO.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parsearCurriculo, medirCorpus, DESTREZA_DE, NIVELES } from '@/scripts/paso0-idioma';

const DOC = fs.readFileSync(path.join(process.cwd(), 'docs/plans/2026-07-28-curriculos-completos.md'), 'utf8');

const seccion = (cuerpoA1: string) => `# x\n\n## Rumano\n\nintro\n\n${NIVELES.map((n, i) =>
  `### Rumano · ${n} — ${100 + i} h\n\n${i === 0 ? cuerpoA1 : '**Sabrá hacer (1):**\n\n- [GRAMÁTICA] algo.\n'}\n`).join('\n')}\n## Checo\n`;

describe('paso0-idioma: el parser del currículo', () => {
  it('lee los seis niveles del rumano y el recuento cuadra con lo declarado', () => {
    const n = parsearCurriculo(DOC, 'ro');
    expect(n.map((x) => x.nivel)).toEqual([...NIVELES]);
    for (const x of n) expect(x.descriptores.length).toBe(x.declarados);
    expect(n.reduce((a, x) => a + x.declarados, 0)).toBe(87);
    expect(n[0]!.material).toEqual({ palabras: 12000, audioMin: 120, ejercicios: 900, tareas: 60 });
    expect(n[0]!.horas).toBe(120);
  });

  it('es la misma función para el portugués: parametrizada por lengua, no copiada', () => {
    const n = parsearCurriculo(DOC, 'pt');
    expect(n).toHaveLength(6);
    for (const x of n) expect(x.descriptores.length).toBe(x.declarados);
    expect(n[0]!.material?.palabras).toBe(12000);
    // PT no etiqueta sus descriptores: el script lo dice, no lo adivina.
    expect(n[0]!.descriptores.every((d) => d.destreza === 'SIN_ETIQUETA')).toBe(true);
    // Y las cuatro lenguas pasan el gate cabecera == contados.
    for (const lang of ['cs', 'ru'] as const) for (const x of parsearCurriculo(DOC, lang)) expect(x.descriptores.length).toBe(x.declarados);
  });

  it('FALLA cuando la cabecera declara más descriptores de los que hay', () => {
    const md = seccion('**Sabrá hacer (3):**\n\n- [GRAMÁTICA] uno.\n- [LÉXICO] dos.\n');
    expect(() => parsearCurriculo(md, 'ro')).toThrow(/A1: la cabecera declara 3 descriptores y el parser cuenta 2/);
  });

  it('FALLA ante una etiqueta que no está en DESTREZA_DE, en vez de meterla en una bolsa', () => {
    const md = seccion('**Sabrá hacer (1):**\n\n- [TELEPATÍA] uno.\n');
    expect(() => parsearCurriculo(md, 'ro')).toThrow(/etiqueta desconocida «TELEPATÍA»/);
  });

  it('las excluidas por decisión de Edu van a EXCLUIDO y no a una destreza en alcance', () => {
    for (const k of ['PRODUCCIÓN ORAL', 'INTERACCIÓN ORAL', 'INTERACCIÓN ESCRITA']) expect(DESTREZA_DE[k]).toBe('EXCLUIDO');
    const ro = parsearCurriculo(DOC, 'ro');
    const excl = ro.flatMap((x) => x.descriptores).filter((d) => d.destreza === 'EXCLUIDO').length;
    expect(excl).toBe(14); // 6 producción oral + 6 interacción oral + 2 interacción escrita
  });
});

describe('paso0-idioma: el corpus', () => {
  it('mide el rumano: inventario, bloques con lección y el primer lote publicado', async () => {
    const c = await medirCorpus('ro');
    expect(c.conceptos).toBeGreaterThan(0); // paso 1 de la fase F: el inventario
    expect(c.bloques).toBeGreaterThan(0); // b2 y b3 con lecciones (fase F)
    expect(c.ejercicios).toBeGreaterThan(0); // primer lote A1 publicado (2026-09-01)
    // Exigía servibles === ejercicios, y dejó de ser cierto el 2026-09-03
    // al retirarse 8 ítems de `r3-sa-vs-infinitivo`. La cuarentena NO es
    // deuda: el invariante del proyecto no es «no hay retirados» sino
    // «ningún retirado sin motivo escrito», y eso lo vigila
    // `cuarentena.test.ts`, que desde hoy cubre las cuatro lenguas.
    expect(c.servibles).toBeGreaterThan(0);
    expect(c.servibles).toBeLessThanOrEqual(c.ejercicios);
    // La biblioteca rumana se mezcló el 2026-09-01: 818 lecturas. El contador
    // reproduce el 2.831.967 del agente de lecturas por un camino independiente.
    expect(c.lecturas).toBeGreaterThan(800);
    expect(c.palabrasLectura).toBeGreaterThan(2_800_000);
    expect(c.voces).toEqual([]);
  });

  it('con el portugués da números del orden conocido (contador honesto)', async () => {
    const c = await medirCorpus('pt');
    expect(c.conceptos).toBeGreaterThan(40);
    expect(c.ejercicios).toBeGreaterThan(3000);
    expect(c.servibles).toBeLessThan(c.ejercicios);
    expect(c.lecturas).toBeGreaterThan(900);
    expect(c.palabrasLectura).toBeGreaterThan(3_000_000);
    expect(c.voces.length).toBeGreaterThan(0);
  });
});

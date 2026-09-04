// tests/unit/lote-pro-drop-la.test.ts
//
// El lote de pro-drop y su gate. Igual que en el relativo, el lote salió
// limpio a la primera y eso era la señal: el gate se creía al autor cuando
// declaraba qué formas españolas se funden. El control que lo destapó es el
// primero de la lista roja.
import { describe, it, expect } from 'vitest';
import { LOTE_PRO_DROP, SEMILLA_DE_ORDEN } from '@/lib/data/languages/la/lotes/l5-pro-drop';
import {
  revisarItemProDrop, revisarLoteProDrop, elEspanolFundeDeVerdad, tasaConstante,
  TECHO_CONSTANTE, type ItemProDrop,
} from '@/scripts/lib/gate-pro-drop';
import { conjugar } from '@/lib/data/languages/la/paradigma-la';

const copia = (): ItemProDrop[] =>
  LOTE_PRO_DROP.map((it) => ({ ...it, fusion: { ...it.fusion } }));

describe('lote de pro-drop · en verde', () => {
  it('el lote real pasa su gate entero', () => {
    const r = revisarLoteProDrop(LOTE_PRO_DROP);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('la forma latina de cada ítem la deriva la máquina', () => {
    for (const it of LOTE_PRO_DROP)
      expect(it.latin, it.id).toContain(conjugar(it.verbo, it.persona, it.tiempo));
  });

  it('ningún ítem lleva el sujeto expreso: eso sería otro punto', () => {
    for (const it of LOTE_PRO_DROP)
      for (const p of ['ego', 'tū', 'vōs', 'ille', 'ipse'])
        expect(it.latin.toLowerCase(), it.id).not.toContain(` ${p} `);
  });

  it('cubre los cuatro valores que el varia exige', () => {
    for (const [p, t] of [['1sg', 'imperfecto'], ['3sg', 'imperfecto'],
                          ['2pl', 'presente'], ['3pl', 'presente']] as const)
      expect(LOTE_PRO_DROP.some((it) => it.persona === p && it.tiempo === t), `${p} ${t}`).toBe(true);
  });

  it('contestar siempre lo mismo no pasa del azar con cuatro valores', () => {
    expect(tasaConstante(LOTE_PRO_DROP).tasa).toBeLessThanOrEqual(TECHO_CONSTANTE + 0.1);
  });

  it('se publica barajado', () => {
    expect(SEMILLA_DE_ORDEN).toBe(1);
    expect(LOTE_PRO_DROP.map((it) => it.id)).not.toEqual([...LOTE_PRO_DROP.map((it) => it.id)].sort());
  });
});

describe('lote de pro-drop · ROJO', () => {
  it('EL QUE SE ESCAPÓ: un ítem cuyo español no funde de verdad', () => {
    // Presente, primera del singular, con «soy» declarado como compartida.
    // La forma ESTÁ en la glosa, así que la primera versión del gate lo
    // aprobaba — y el español distingue «soy» de «es» perfectamente.
    const it = copia().find((x) => x.persona === '1sg')!;
    it.tiempo = 'presente';
    it.latin = 'In templō sum.';
    it.glosa = 'Soy del templo. → ¿quién? ___';
    it.fusion.formaCompartida = 'Soy';
    expect(revisarItemProDrop(it).some((f) => f.detalle.includes('NO funde'))).toBe(true);
  });

  it('el par 2pl/3pl no funde fuera de México, y el gate lo distingue', () => {
    expect(elEspanolFundeDeVerdad('2pl', '3pl', 'presente', 'mexico')).toBe(true);
    expect(elEspanolFundeDeVerdad('2pl', '3pl', 'presente', 'general')).toBe(false);
    const it = copia().find((x) => x.persona === '2pl')!;
    it.fusion.variedad = 'general';
    expect(revisarItemProDrop(it).some((f) => f.clase === 'el-espanol-no-funde')).toBe(true);
  });

  it('la glosa que delata la persona por otra vía', () => {
    const it = copia()[0]!;
    it.glosa = `Estaba en mi templo. → ¿quién? ___`;
    expect(revisarItemProDrop(it).some((f) => f.clase === 'fuga-por-la-glosa')).toBe(true);
  });

  it('«su» y «sus» NO delatan: son ambiguos en español y no deben marcarse', () => {
    const it = copia().find((x) => x.persona === '3sg')!;
    it.glosa = 'Veía a su reina, estaba allí. → ¿quién? ___';
    expect(revisarItemProDrop(it).some((f) => f.clase === 'fuga-por-la-glosa')).toBe(false);
  });

  it('un sujeto expreso en el latín deja de ser pro-drop', () => {
    const it = copia()[0]!;
    it.latin = 'Ego in templō eram.';
    expect(revisarItemProDrop(it).some((f) => f.clase === 'sujeto-expreso')).toBe(true);
  });

  it('una persona que la máquina no deriva', () => {
    const it = copia()[0]!;
    it.latin = 'In templō erāmus.';
    expect(revisarItemProDrop(it).some((f) => f.clase === 'persona-no-derivada')).toBe(true);
  });

  it('quitar uno de los cuatro valores suspende el lote', () => {
    const r = revisarLoteProDrop(copia().filter((it) => it.persona !== '2pl'));
    expect(r.fallos.some((f) => f.clase === 'valor-sin-cubrir')).toBe(true);
  });

  it('un lote escorado a la tercera persona lo caza la tasa constante', () => {
    // Es el reparto REAL del corpus: 3sg 2.858 contra 1sg 407, 3pl 8.167
    // contra 2pl 1.999. Un lote que lo imitara mediría mucho menos.
    const items = copia();
    const escorado = [...items.filter((it) => it.persona.startsWith('3')),
                      ...items.filter((it) => it.persona.startsWith('3')),
                      ...items.filter((it) => !it.persona.startsWith('3')).slice(0, 1)];
    expect(revisarLoteProDrop(escorado).fallos.some((f) => f.clase === 'estrategia-constante')).toBe(true);
  });
});

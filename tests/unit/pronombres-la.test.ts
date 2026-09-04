// tests/unit/pronombres-la.test.ts
//
// La tabla pronominal se comprueba contra un camino de otra naturaleza: los
// rasgos Case/Number/Gender que puso quien anotó el treebank. Y el gate se
// comprueba a su vez con venenos, porque un gate visto sólo en verde no está
// probado — este mismo empezó cazando 1 de 3.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import {
  PRONOMBRES_L1, paradigmaPronombre, declinarPronombre, llevaMarcaPronominal,
  contrastarConCorpus, esCeldaUsable, CASOS_DE_PRONOMBRE,
} from '@/lib/data/languages/la/pronombres-la';

const RUTA = 'scripts/.cache/pronombres-treebank.json';
const hayCorpus = fs.existsSync(RUTA);
const celdas: Record<string, Record<string, number>> = hayCorpus
  ? JSON.parse(fs.readFileSync(RUTA, 'utf8')).celdas : {};

describe('la marca compartida por las seis series', () => {
  it('los seis llevan genitivo en -īus y dativo en -ī, con el tema que sea', () => {
    for (const e of PRONOMBRES_L1) expect(llevaMarcaPronominal(e), e.lema).toBe(true);
  });

  it('ningún genitivo singular sale de una de las cinco declinaciones nominales', () => {
    // `illīus` no es de la 2.ª: si lo fuera, sería *«illī». Es lo que hace
    // que la tabla exista en vez de seis entradas sueltas.
    //
    // OJO CON LEER ESTO AL REVÉS: que la forma no encaje en las cinco es una
    // propiedad DE LA TABLA, no una pista para reconocerla en un texto. Al
    // revés falla —`fīlius` ×162 acaba en `-ius` y es un nominativo de 2.ª—,
    // y el punto de currículo que se apoyaba en ello murió por eso.
    for (const e of PRONOMBRES_L1) {
      const gen = declinarPronombre(e, 'm', 'gen', 'sg');
      expect(gen.endsWith('ī'), `${e.lema}: «${gen}» parece un genitivo de 2.ª`).toBe(false);
      expect(gen.endsWith('ae'), `${e.lema}: «${gen}» parece un genitivo de 1.ª`).toBe(false);
    }
  });

  it('toda divergencia de la tabla está declarada y razonada', () => {
    for (const e of PRONOMBRES_L1) {
      if (!e.excepciones || Object.keys(e.excepciones).length === 0) continue;
      expect(e.porQueDiverge, `${e.lema} diverge sin decir por qué`).toBeTruthy();
      expect(e.porQueDiverge!.length, e.lema).toBeGreaterThan(30);
    }
  });
});

describe.runIf(hayCorpus)('contra la anotación del treebank', () => {
  it('la tabla no se aparta del corpus en ninguna celda con evidencia', () => {
    const r = contrastarConCorpus(celdas);
    expect(r.desajustes, JSON.stringify(r.desajustes, null, 2)).toHaveLength(0);
    expect(r.comprobadas).toBeGreaterThanOrEqual(150);
  });

  // ── LOS CONTROLES POSITIVOS ──
  // Cada uno es un error que un latinista podría cometer de verdad. Si
  // alguno deja de fallar, el gate se apagó y hay que averiguar por qué.
  //
  // Van buscados POR LEMA y no por índice: en este proyecto ya se apagaron
  // dos controles positivos por depender de qué elemento ocupa una posición,
  // y la lista de pronombres va a crecer.
  function envenenar(lema: string, celda: string, mal: string, f: () => void): void {
    const e = PRONOMBRES_L1.find((x) => x.lema === lema);
    if (!e) throw new Error(`no hay pronombre «${lema}»: el control apunta a nada`);
    const guardado = e.excepciones;
    e.excepciones = { ...(guardado ?? {}), [celda]: mal } as never;
    try { f(); } finally { e.excepciones = guardado; }
  }

  const VENENOS: [string, string, string, string][] = [
    ['ille', 'm.dat.sg', 'illō', 'el dativo escrito como el ablativo'],
    ['is', 'm.gen.sg', 'eī', 'el genitivo de `is` escrito como su dativo'],
    ['quī', 'm.ac.sg', 'quom', 'un acusativo inventado para el relativo'],
    ['hic', 'm.gen.sg', 'hīus', 'regularizar «huius» a la marca pronominal'],
    ['ipse', 'n.nom.sg', 'ipsud', 'aplicar la tabla donde `ipse` se aparta de ella'],
  ];
  it.each(VENENOS)('caza el veneno: %s %s → %s (%s)', (lema, celda, mal) => {
    envenenar(lema, celda, mal, () => {
      const r = contrastarConCorpus(celdas);
      expect(r.desajustes.some((d) => d.lema === lema && d.celda === celda)).toBe(true);
    });
  });

  it('una sola anotación suelta no basta para bendecir una forma', () => {
    // `ille|m.dat.sg` trae `illi ×272` y `illo ×1`. Con el criterio «está
    // atestiguada alguna vez», ese único token dejaba pasar el veneno. El
    // corte se midió: todo el ruido aparece 1 vez, toda variante real ≥2.
    envenenar('ille', 'm.dat.sg', 'illō', () => {
      expect(contrastarConCorpus(celdas, 3, 1).desajustes).toHaveLength(0);  // el criterio viejo
      expect(contrastarConCorpus(celdas, 3, 2).desajustes.length).toBeGreaterThan(0);  // el nuevo
    });
  });
});

describe('el vocativo que la tabla fabrica y el corpus nunca respalda', () => {
  it('no está entre los casos utilizables', () => {
    expect(CASOS_DE_PRONOMBRE).not.toContain('voc');
    expect(esCeldaUsable('m.voc.sg')).toBe(false);
    expect(esCeldaUsable('m.nom.sg')).toBe(true);
  });

  it('la tabla lo sigue generando, y por eso hace falta la marca', () => {
    // Si algún día dejara de generarlo, `esCeldaUsable` sería letra muerta
    // y este test lo diría en vez de quedarse verde por vacío.
    const ille = PRONOMBRES_L1.find((x) => x.lema === 'ille')!;
    expect(paradigmaPronombre(ille)['m.voc.sg']).toBeTruthy();
  });
});

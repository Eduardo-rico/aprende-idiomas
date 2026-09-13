// tests/unit/macrones-la.test.ts
//
// EL GATE DE LA PROCEDENCIA DE LA CANTIDAD.
//
// Hasta el 2026-09-12 el latín estaba bloqueado por esto: el corpus se
// escribe sin mácrones, no había fuente, y todos los del repositorio salían
// del lexicón escrito a mano — que se validaba contra sí mismo. Este test
// era entonces el control de que el bloqueo seguía siendo el que decíamos.
//
// **Ahora comprueba lo contrario**: que la fuente existe, que cada cantidad
// declara de dónde viene, y que `sin-dato` es un valor y no un hueco. Se
// pone rojo si alguien mete una cantidad a mano sin declararlo.
import { describe, it, expect } from 'vitest';
import macrones from '@/lib/data/languages/la/macrones.json';
import { conciliar, lemasDelLexicon, macronesDe, argQueEsElLema, sinCantidad } from '@/scripts/lib/traer-macrones';

const M = macrones as {
  generado: string;
  procedencia: { obra: string; url: string; licencia: string; queSeImporta: string; comoSeLee: string };
  fuenteDescartada: { obra: string; porQue: string };
  loQueNoSeHace: string;
  porOrigen: Record<string, number>;
  discrepanciasConElLexicon: number;
  filas: { clave: string; cantidad: string | null; origen: string; caminos: number; enElLexicon?: string; discrepancia?: string }[];
};

describe('LA PROCEDENCIA, que es la condición 1', () => {
  it('el fichero dice qué obra, de dónde, con qué licencia y qué se importa', () => {
    expect(M.procedencia.obra).toContain('Wiktionary');
    expect(M.procedencia.url).toMatch(/^https:\/\//);
    expect(M.procedencia.licencia).toContain('CC BY-SA');
    expect(M.procedencia.queSeImporta).toContain('cantidad');
    expect(M.generado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('y dice qué fuente se DESCARTÓ y por qué, que es la mitad que se pierde', () => {
    // Lewis & Short parece la fuente obvia —dominio público, 1879— y no
    // sirve: marca lo justo para colocar el acento, no la cantidad.
    expect(M.fuenteDescartada.obra).toContain('Lewis & Short');
    expect(M.fuenteDescartada.porQue).toContain('42,5 %');
  });

  it('y deja escrito que un macronizador automático NO es una fuente', () => {
    expect(M.loQueNoSeHace).toContain('macronizadores');
    expect(M.loQueNoSeHace).toContain('no una atestación');
  });
});

describe('EL ORIGEN DE CADA CANTIDAD, que es la condición 2', () => {
  it('los tres orígenes son valores, y `sin-dato` es uno de ellos', () => {
    const orígenes = new Set(M.filas.map((f) => f.origen));
    expect([...orígenes].sort()).toEqual(['fuente-externa', 'lexicon-propio', 'sin-dato']);
    expect(M.porOrigen['sin-dato']).toBeGreaterThan(0);
  });

  it('un lema SIN DATO no lleva cantidad inventada: lleva `null`', () => {
    for (const f of M.filas.filter((x) => x.origen === 'sin-dato'))
      expect(f.cantidad, f.clave).toBeNull();
  });

  it('y todo lo que trae cantidad declara de dónde viene', () => {
    for (const f of M.filas.filter((x) => x.cantidad !== null))
      expect(['fuente-externa', 'lexicon-propio'], f.clave).toContain(f.origen);
  });

  it('TODO lema del lexicón está en el registro: no se puede meter uno a escondidas', () => {
    // Ésta es la que se pone roja si alguien añade un lema sin pasar por
    // aquí. Vale para lo que viene: quedan 800 lemas por entrar.
    const enRegistro = new Set(M.filas.map((f) => f.clave));
    const sinDeclarar = lemasDelLexicon()
      .map((l) => sinCantidad(l.lema))
      .filter((k) => !enRegistro.has(k));
    expect([...new Set(sinDeclarar)], 'lemas del lexicón que no están en macrones.json').toEqual([]);
  });
});

describe('LO QUE EL CRUCE ENCONTRÓ en 218 lemas escritos a mano', () => {
  it('las discrepancias están registradas, no borradas', () => {
    expect(M.discrepanciasConElLexicon).toBeGreaterThan(0);
    const d = M.filas.filter((f) => f.discrepancia);
    expect(d.length).toBe(M.discrepanciasConElLexicon);
    for (const f of d) expect(f.discrepancia).toContain('la fuente da');
  });

  it('las DOS de cantidad se corrigieron y el lexicón ya no discrepa en ellas', () => {
    // `bestia` → `bēstia` y `anxius` → `ānxius`. Las demás discrepancias son
    // mayúscula de nombre propio, grafía u/v, o cantidad variable (`ō̆`),
    // y ésas NO se tocan.
    const porClave = new Map(M.filas.map((f) => [f.clave, f]));
    expect(porClave.get('bestia')?.cantidad).toBe('bēstia');
    expect(porClave.get('anxius')?.cantidad).toBe('ānxius');
    for (const k of ['bestia', 'anxius']) expect(porClave.get(k)?.discrepancia, k).toBeUndefined();
  });

  it('y las que NO son de cantidad siguen discrepando, que es correcto', () => {
    const porClave = new Map(M.filas.map((f) => [f.clave, f]));
    // `Deus`/`deus` es mayúscula; `homō`/`homō̆` es cantidad variable.
    expect(porClave.get('deus')?.discrepancia).toBeDefined();
    expect(porClave.get('homo')?.discrepancia).toBeDefined();
  });
});

describe('los dos caminos de la fuente, y cuándo NO se usa', () => {
  it('el argumento se valida contra el título: en `la-verb` el primero es el código', () => {
    expect(argQueEsElLema('4.pass-impers|veniō|vēn|vent', 'venio')).toBe('veniō');
    expect(argQueEsElLema('rēx/rēg<3>|g=m|f=rēgīna', 'rex')).toBe('rēx');
    expect(argQueEsElLema('g=m|f=rēgīna', 'rex')).toBeNull();
  });

  it('dos caminos que coinciden valen; dos homógrafos NO', () => {
    expect(conciliar('rēx', 'rēx')).toEqual({ forma: 'rēx', caminos: 2 });
    // `genus` da `genūs` por la IPA (el genitivo de `genū`) y `genus` por el
    // encabezado: son dos palabras distintas en una página, y la fuente no
    // sabe cuál le estamos pidiendo.
    expect(conciliar('genūs', 'genus').forma).toBeNull();
  });

  it('la grafía j/i no es un conflicto, y la cantidad variable tampoco', () => {
    expect(conciliar('jūdex', 'iūdex').forma).toBe('iūdex');
    expect(conciliar('sciō̆', 'sciō').forma).toBe('sciō');
  });

  it('y un camino solo también vale, marcado como tal', () => {
    expect(conciliar(null, 'mēns')).toEqual({ forma: 'mēns', caminos: 1 });
    expect(conciliar(null, null)).toEqual({ forma: null, caminos: 0 });
  });
});

describe('el extractor, contra wikitexto de verdad', () => {
  it('lee las dos plantillas y encuentra la sección latina aunque empiece en 0', () => {
    const soloLatin = '==Latin==\n===Pronunciation===\n* {{la-IPA|veniō}}\n===Verb===\n{{la-verb|4.pass-impers|veniō|vēn|vent}}\n';
    expect(macronesDe(soloLatin, 'venio')).toEqual({ ipa: 'veniō', head: 'veniō' });
  });

  it('y se salta los parámetros con nombre de la plantilla de pronunciación', () => {
    const conEccl = '==Latin==\n* {{la-IPA|eccl=yes|pāx}}\n{{la-noun|pāx/pāc<3>|g=f}}\n';
    expect(macronesDe(conEccl, 'pax')).toEqual({ ipa: 'pāx', head: 'pāx' });
  });

  it('y devuelve nulos donde no hay sección latina, en vez de inventar', () => {
    expect(macronesDe('==Spanish==\n{{es-noun|f}}\n', 'paz')).toEqual({ ipa: null, head: null });
  });
});

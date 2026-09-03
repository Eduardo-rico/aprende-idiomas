// tests/unit/idioma-nuevo-completo.test.ts
//
// UN IDIOMA NUEVO NO PUEDE ENTRAR A MEDIAS.
//
// Al añadir `la` y `grc` (fase G, 2026-09-03) el typecheck avisó de dos
// sitios —`LANGUAGE_BOOST` y `TITULO`— y `lib/locales.ts` de otros tres,
// todos porque son `Record<LanguageId, …>` CERRADOS. Ése es el mecanismo
// bueno y hay que conservarlo.
//
// Lo que el typecheck NO puede ver es lo que este fichero cubre:
//
//   · que el scaffold EXISTA en disco (`lib/data/languages/<lang>/`);
//   · que los peldaños de la lengua no estén vacíos;
//   · que la lengua no herede en silencio los niveles de otra.
//
// Y una corrección a lo que yo mismo reporté al coordinador: dije que
// `lib/vocab/catalog.ts:14` era el agujero silencioso por ser
// `Partial<Record<…>>`. **Es Partial y no falla en typecheck, pero no es
// silencioso**: es un CACHÉ de runtime, legítimamente parcial, y
// `ensureCache` lanza con el nombre del idioma cuando no está iniciado.
// Falla ruidosamente, que es lo correcto. El test de abajo lo fija para
// que siga siendo así, porque lo que sí sería un fallo es que empezara a
// devolver el catálogo de PT.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LANGUAGES, LANG_LABELS, LANG_FLAGS, LANG_CHROME, type LanguageId } from '@/lib/locales';
import { NIVELES_DE, TITULO } from '@/scripts/paso0-idioma';
import { IDS_PELDANO } from '@/scripts/lib/peldanos-antiguos';
import { LANGUAGE_BOOST } from '@/scripts/config';
import { dataDir } from '@/lib/data/registry';
import { lookupVocabInLang, _resetCatalogCacheForTests } from '@/lib/vocab/catalog';

describe.each(LANGUAGES)('idioma «%s» está entero', (lang: LanguageId) => {
  // El chrome COMPLETO (title + las seis entradas de nav) ya lo recorre
  // `navbar-chrome.test.tsx` sobre `LANGUAGES`, y no se repite aquí: dos
  // copias de la misma aserción se desincronizan y la que nadie recuerda
  // es la que falla. Aquí sólo lo que aquel no mira.
  it('tiene label, marca y descripción', () => {
    expect(LANG_LABELS[lang]?.length).toBeGreaterThan(0);
    expect(LANG_FLAGS[lang]?.length).toBeGreaterThan(0);
    expect(LANG_CHROME[lang].description.length).toBeGreaterThan(0);
  });

  it('tiene título de currículo y peldaños propios, no heredados', () => {
    expect(TITULO[lang]?.length).toBeGreaterThan(0);
    expect(NIVELES_DE[lang].length).toBeGreaterThan(0);
    // Sin duplicados dentro de la lengua: un peldaño repetido haría que el
    // parser contara dos veces la misma sección.
    expect(new Set(NIVELES_DE[lang]).size).toBe(NIVELES_DE[lang].length);
  });

  it('tiene `language_boost` DECLARADO, aunque sea vacío a propósito', () => {
    expect(LANGUAGE_BOOST[lang]).toBeTypeOf('string');
  });

  it('tiene scaffold en disco con los cinco ficheros del contrato', () => {
    const d = dataDir(lang);
    expect(fs.existsSync(d), `falta ${d}`).toBe(true);
    for (const f of ['curriculum.ts', 'concepts.json', 'vocab-catalog.json', 'manifest.json', 'fallback-dictionary.ts']) {
      expect(fs.existsSync(path.join(d, f)), `falta ${lang}/${f}`).toBe(true);
    }
    for (const sub of ['blocks', 'lessons', 'stories']) {
      expect(fs.existsSync(path.join(d, sub)), `falta ${lang}/${sub}/`).toBe(true);
    }
  });
});

describe('los peldaños no son intercambiables entre lenguas', () => {
  it('las lenguas vivas usan el MCER y las antiguas NO', () => {
    for (const l of ['pt', 'ru', 'ro', 'cs'] as const) {
      expect(NIVELES_DE[l]).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
    }
    // El MCER describe lo que alguien HACE con una lengua viva. Reutilizar
    // sus etiquetas como nombres opacos de peldaño sería «un sello responde
    // a una pregunta»: quien lea «B1» creerá que significa lo de portugués.
    //
    // ⚠ La lista concreta NO se escribe aquí. Esta aserción decía
    // `['L1'…'L5']` y se quedó vieja el día que la medición disolvió L5 —
    // la CUARTA copia del mismo dato en una noche. Se DERIVA de su única
    // fuente, `IDS_PELDANO`, y lo que este test afirma es lo que de verdad
    // le toca afirmar: que las antiguas no usan el MCER.
    expect([...NIVELES_DE.la]).toEqual([...IDS_PELDANO.la]);
    expect([...NIVELES_DE.grc]).toEqual([...IDS_PELDANO.grc]);
    expect(NIVELES_DE.la.length).toBeGreaterThan(0);
    for (const l of ['la', 'grc'] as const) {
      expect(NIVELES_DE[l] as readonly string[]).not.toContain('A1');
      expect(NIVELES_DE[l] as readonly string[]).not.toContain('C2');
    }
  });

  it('`grc` es el griego ANTIGUO y no colisiona con el moderno', () => {
    // `el` es el griego moderno, declarado fase posterior. El día que
    // entre, este test es lo que impide que alguien lo meta como `grc`.
    expect(LANGUAGES).toContain('grc');
    expect(LANGUAGES as readonly string[]).not.toContain('el');
    expect(TITULO.grc).toBe('Griego antiguo');
  });
});

describe('el caché de vocabulario falla RUIDOSAMENTE para un idioma sin iniciar', () => {
  it('lanza nombrando el idioma, en vez de caer al catálogo de PT', () => {
    _resetCatalogCacheForTests();
    // El riesgo real de un `Partial<Record<LanguageId, …>>` no es que no
    // falle en typecheck: es que devuelva lo de OTRO idioma. Aquí se fija
    // que no lo hace.
    for (const lang of ['la', 'grc'] as const) {
      expect(() => lookupVocabInLang('casa', lang)).toThrow(new RegExp(`"${lang}"`));
    }
  });
});

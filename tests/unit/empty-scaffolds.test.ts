// tests/unit/empty-scaffolds.test.ts
// Phase 5 (multi-idioma): los scaffolds vacíos para ru/ro/cs exponen
// los loaders con forma "vacía pero tipada". La app renderiza el
// `EmptyState` y la home de cada idioma está navegable.
import fs from 'node:fs';
import { describe, it, expect } from "vitest";
import {
  loadCurriculum, loadAllBlocks, loadAllStories, loadDiagnostic,
  loadVocabCatalog, loadFallbackDict, loadManifest, loadConcepts,
} from "@/lib/data/loaders";
import { LANGUAGES } from "@/lib/locales";

const SCAFFOLD_LANGS = LANGUAGES.filter((l) => l !== "pt");

describe("empty scaffolds (Phase 5)", () => {
  describe.each(SCAFFOLD_LANGS)("language %s", (lang) => {
    it("loadCurriculum returns empty BLOCKS/ALL_CONCEPTS and throws on getBlock", async () => {
      const c = await loadCurriculum(lang);
      // Fase F: el rumano ya tiene inventario (ALL_CONCEPTS) y los bloques
      // que tienen lecciones. CS y RU siguen vacíos del todo.
      //
      // Y desde el lote 13 (2026-09-03) el BLOQUE 1 existe: la afirmación
      // «getBlock(1) tira» codificaba «el rumano no tiene bloque 1» y
      // dejó de ser verdad al publicar la ortografía. El test se actualiza
      // porque el hecho cambió, no porque estorbe: para CS y RU sigue
      // afirmando exactamente lo mismo que afirmaba.
      if (lang === 'ro') {
        expect(c.ALL_CONCEPTS.length).toBeGreaterThan(0);
        expect(c.BLOCKS.length).toBeGreaterThan(0);
        expect(c.getBlock(1).lessons.length).toBeGreaterThan(0);
        expect(() => c.getBlock(99)).toThrow();
      } else if (lang === 'la') {
        // Y desde el 2026-09-10 el LATÍN tampoco está vacío: tiene sus 117
        // conceptos derivados del inventario y los bloques que tienen
        // lote. Su bloque 1 (ortografía) sigue sin lecciones y por eso
        // `getBlock(1)` SÍ tira — que es la afirmación que este test hacía
        // y que en latín sigue siendo verdad, sólo que ahora por el motivo
        // concreto y no por estar el idioma entero a cero.
        //
        // ⚠ El 2026-09-23 el bloque 1 recibió su lote y su lección, y
        // `getBlock(1)` dejó de tirar: la afirmación caducó PORQUE EL
        // TRABAJO SE HIZO (§B8). Era la SEGUNDA copia de esa misma
        // afirmación —la primera, en `curriculum-la.test.ts`, se reancló el
        // mismo día y ésta se quedó atrás—. Lo que no caduca es el
        // propósito: un bloque sin lección tira, y uno con lección no.
        expect(c.ALL_CONCEPTS.length).toBeGreaterThan(0);
        expect(c.BLOCKS.length).toBeGreaterThan(0);
        for (const b of c.BLOCKS) expect(c.getBlock(b.id).lessons.length).toBeGreaterThan(0);
        const conLeccion = new Set(c.BLOCKS.map((b) => b.id));
        const sinLeccion = [...Array(20).keys()].map((i) => i + 1).filter((i) => !conLeccion.has(i));
        expect(sinLeccion.length, 'el latín tiene bloques sin lección: tiene que quedar alguno para esta comprobación').toBeGreaterThan(0);
        for (const id of sinLeccion) expect(() => c.getBlock(id)).toThrow();
      } else if (lang === 'ru') {
        // El 2026-09-11 el RUSO estrenó un tercer estado que ni el rumano ni
        // el latín tuvieron —inventario poblado y BLOCKS vacío del todo—, y
        // el 2026-09-12 salió de él: con el primer lote (12 ítems de
        // `u4-declinacion-singular`) entró `lessons/b4.json`, y con ella el
        // bloque 4. El 2026-09-13 entraron b3, b5 y b7. **Lo que este test
        // afirma no ha cambiado**: que se declara el bloque que tiene lección
        // y NINGÚN otro, y que `getBlock(1)` sigue tirando — ahora por el
        // motivo concreto (el bloque 1 no tiene lección) y no porque la lengua
        // esté entera a cero.
        //
        // ⚠ Y LA LISTA YA NO SE ESCRIBE A MANO, porque escrita a mano este test
        // se pone rojo cada vez que entra una lección legítima y el arreglo es
        // teclear el número nuevo — o sea que deja de comprobar algo y pasa a
        // ser un peaje. Medido: la v0 decía `[4]` y la entrada de b3, b5 y b7
        // lo tumbó sin que nada estuviera mal. La afirmación que SÍ vale es la
        // biyección: **los bloques declarados son exactamente los que tienen
        // fichero `lessons/bN.json`.** Se lee del directorio, que es la fuente.
        //
        // Declarar los 15 bloques sin lecciones para «adelantar» rendiría 15
        // pantallas rotas en vez del EmptyState. El test lo fija aquí para
        // que nadie lo haga creyendo que ayuda.
        expect(c.ALL_CONCEPTS.length).toBeGreaterThan(0);
        const conFichero = fs.readdirSync('lib/data/languages/ru/lessons')
          .map((f) => /^b(\d+)\.json$/.exec(f)?.[1])
          .filter((x): x is string => x !== undefined)
          .map(Number).sort((a, b) => a - b);
        expect(conFichero.length).toBeGreaterThan(0);   // si no, el test no mira nada
        expect(c.BLOCKS.map((b) => b.id)).toEqual(conFichero);
        for (const id of conFichero) expect(c.getBlock(id).lessons.length).toBeGreaterThan(0);
        // Y su CONTROL NEGATIVO: un bloque SIN fichero tiene que seguir
        // tirando. Sin él, declararlos todos pasaría igual.
        //
        // ⚠ 2026-09-13: ese control se apagó solo al entrar la ÚLTIMA lección.
        // Estaba escrito sobre «un bloque del inventario que no tiene fichero»
        // y exigía `sinFichero.length > 0`; con los 15 bloques ya declarados esa
        // lista es VACÍA y el test se puso rojo sin que nada estuviera mal —el
        // §34(2) de este mismo fichero, una expresión correcta con un solo caso
        // delante, esta vez en su forma terminal: el conjunto sobre el que
        // medía se agotó—. El arreglo NO es borrar el control, que dejaría la
        // biyección de arriba sin su mitad negativa: es colgarlo de un id que
        // NO PUEDE tener fichero nunca, o sea uno fuera del inventario. Así el
        // control sigue vivo cuando ya no queda ningún bloque sin declarar.
        const idsInventario = [...new Set(c.ALL_CONCEPTS.map((x) => x.blockId))];
        const inexistente = Math.max(...idsInventario) + 1;
        expect(conFichero).not.toContain(inexistente);
        expect(() => c.getBlock(inexistente)).toThrow();
        // Y la otra mitad del control, que es la que de verdad se perdió: los
        // bloques del inventario que NO tienen fichero (hoy ninguno) tampoco
        // pueden estar en BLOCKS. Es la biyección leída en la otra dirección.
        const sinFichero = idsInventario.filter((id) => !conFichero.includes(id));
        for (const id of sinFichero) expect(() => c.getBlock(id)).toThrow();
        // El bloque 1 ya tiene lección desde el 2026-09-13, así que aquí se
        // comprueba lo contrario de lo que decía este test hasta hoy.
        expect(c.getBlock(1).lessons.length).toBeGreaterThan(0);
        // Y que `getConceptsByIds` filtre de verdad y no devuelva [] como
        // el stub: un loader que siempre devuelve vacío es indistinguible
        // de uno roto.
        const alguno = c.ALL_CONCEPTS[0]!.id;
        expect(c.getConceptsByIds([alguno]).map((x) => x.id)).toEqual([alguno]);
        expect(c.getConceptsByIds(['no-existe'])).toEqual([]);
      } else {
        expect(c.BLOCKS).toEqual([]);
        expect(c.ALL_CONCEPTS).toEqual([]);
        expect(() => c.getBlock(1)).toThrow();
      }
    });

    it("loadAllBlocks: [] en los scaffolds vacíos; ro, la y ru ya sirven contenido", async () => {
      const blocks = await loadAllBlocks(lang);
      // `ru` entró aquí el 2026-09-12 con sus primeros 12 ejercicios
      // (`u4-declinacion-singular`). Queda `cs`, que sigue sin Paso 0.
      if (lang === 'ro' || lang === 'la' || lang === 'ru') expect(blocks.length).toBeGreaterThan(0);
      else expect(blocks).toEqual([]);
    });

    it("loadAllStories returns []", async () => {
      expect(await loadAllStories(lang)).toEqual([]);
    });

    it("loadDiagnostic returns null", async () => {
      expect(await loadDiagnostic(lang)).toBeNull();
    });

    it("loadVocabCatalog returns []", async () => {
      expect(await loadVocabCatalog(lang)).toEqual([]);
    });

    it("loadFallbackDict returns {} (an object with no keys)", async () => {
      const d = await loadFallbackDict(lang);
      expect(typeof d).toBe("object");
      expect(Object.keys(d)).toEqual([]);
    });

    it("loadManifest returns the empty manifest object", async () => {
      const m = await loadManifest(lang);
      expect(m).toEqual({
        generatedAt: "",
        modelText: "",
        modelTts: "",
        voices: {},
        blocks: {},
        audioIndex: {},
      });
    });

    it("loadConcepts: [] en los scaffolds vacíos; ro y la sirven sus conceptos", async () => {
      // ⚠ ro y la tenían `concepts.json` en `[]` teniendo currículo, y no
      //   por diseño: `scripts/generate-curriculum.ts` estaba clavado a
      //   portugués con el comentario «solo PT tiene curriculum real»,
      //   que dejó de ser verdad dos veces sin que nadie tocara el
      //   fichero. Es la misma avería que tuvo el portugués con 50 de 241
      //   conceptos. Hoy el generador resuelve la fuente por idioma.
      const cs = await loadConcepts(lang);
      if (lang === 'ro' || lang === 'la') expect(cs.length).toBeGreaterThan(0);
      else expect(cs).toEqual([]);
    });
  });

  it("PT remains non-empty (regression guard)", async () => {
    const c = await loadCurriculum("pt");
    expect(c.BLOCKS.length).toBeGreaterThan(0);
    expect(await loadAllStories("pt")).not.toEqual([]);
    expect(await loadDiagnostic("pt")).not.toBeNull();
  });
});

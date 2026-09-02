// tests/unit/lecturas-catalogo-cs.test.ts
//
// El catálogo CHECO pasa los mismos invariantes que el portugués y el
// rumano (`lecturas-catalogo.invariantes.ts`) más los suyos: texto en
// NFC CON diacríticos (háček, čárka, kroužek), la grafía de época
// medida y declarada por pieza, y el gate probado EN ROJO — un gate
// visto sólo en verde no está probado.
//
// Cifras: `node scripts/lectura/medir-catalogo.mjs cs` — nunca a ojo.
import { describe, it, expect } from 'vitest';
import { invariantesDelCatalogo, cargarCatalogo } from './lecturas-catalogo.invariantes';
// Módulo .mjs del pipeline: es la MISMA regla que usa la ingesta (allowJs).
import { normalizarDiacriticos, gateDiacriticos, sinDiacriticos, contarPalabras, medirGrafia } from '../../scripts/lectura/texto-cs.mjs';

invariantesDelCatalogo({
  lang: 'cs',
  variantes: ['cs'],
  // Medido 2026-09-02 al cierre de la tanda F-CS-T1 (Němcová, Erben,
  // T2 (Hašek), T3 (prosa: Neruda, Hálek, Světlá, Čech, Sabina, Arbes, Zeyer,
  // Klostermann, Mrštík) y T4 (poesía), tras la auditoría OCR (16 erratas
  // atestiguadas): 745 lecturas · 64 series · 1.923.739 palabras.
  lecturas: 745,
  palabras: 1_923_739,
  // cs.wikisource: navegación de capítulos («← Předchozí», «Další →»),
  // la plantilla Textinfo si se colara, llamadas de nota «[1]» huérfanas
  // y las páginas del escaneo sin transcribir.
  // Y los enlaces interwiki a las traducciones («English», «polski»,
  // «русский»), que la primera corrida de la T1 dejó como primer párrafo
  // en 10 piezas: un párrafo que es SÓLO nombres de lengua es aparato.
  // («následující» a secas es «siguiente», palabra checa corriente: el
  // gate la cazó en Mácha y Němcová la primera vez; sólo con flecha.)
  aparato: /←\s*Předchozí|Následující\s*→|Textinfo|\[\d{1,3}\]|Stránka:[^\n]*\.djvu|\^|^(?:English|polski|русский|українська|Deutsch|français|italiano|español|magyar|slovenčina|Esperanto|latina)+$/i,
  extra: (catalogo) => {
    it('todo el texto está en NFC (háček y kroužek precompuestos), en todos los campos con texto', () => {
      const rotas = catalogo
        .filter(({ l }) => l.titulo !== l.titulo.normalize('NFC') || l.parrafos.some((p) => p.texto !== p.texto.normalize('NFC')))
        .map((x) => x.archivo);
      expect(rotas).toEqual([]);
    });

    it('toda lectura pasa el gate de diacríticos (un texto sin háčky no es checo correcto)', () => {
      const rotas = catalogo
        .filter(({ l }) => !gateDiacriticos(l.parrafos.map((p) => p.texto).join('\n')).ok)
        .map((x) => x.archivo);
      expect(rotas).toEqual([]);
    });

    it('toda lectura declara su grafía medida en notaOrtografia', () => {
      for (const { archivo, l } of catalogo) {
        expect(l.notaOrtografia, archivo).toMatch(/diacríticos checos de la fuente/);
        expect(l.notaOrtografia, archivo).toMatch(/grafía|ortografía/);
      }
    });

    it('la grafía pre-1849 declarada coincide con la medida sobre el texto (w por v, au por ou)', () => {
      for (const { archivo, l } of catalogo) {
        const g = medirGrafia(l.parrafos.map((p) => p.texto).join('\n'));
        expect(/anterior a la reforma de 1849/.test(l.notaOrtografia ?? ''), `${archivo}: nota «${l.notaOrtografia?.slice(0, 80)}» vs medida «${g.etiqueta}»`).toBe(g.bratrska);
      }
    });

    it('toda lectura es modo texto (cero audio en la fase F)', () => {
      for (const { archivo, l } of catalogo) expect(l.modo, archivo).toBe('texto');
    });

    it('sólo autores muertos en 1925 o antes (MX vida+100; Čapek, Jirásek, Rais, Sova, Dyk, Herrmann no entran)', () => {
      for (const { archivo, l } of catalogo) expect(l.muerteAutor, archivo).toBeLessThanOrEqual(1925);
    });
  },
});

describe('gates del texto checo, probados en rojo', () => {
  const primera = cargarCatalogo('cs')[0];
  if (!primera) throw new Error('catálogo CS vacío');
  const muestra = primera.l.parrafos.map((p) => p.texto).join('\n');

  it('el gate de diacríticos RECHAZA el mismo texto despojado de diacríticos', () => {
    expect(gateDiacriticos(muestra).ok).toBe(true);
    const pelado = sinDiacriticos(muestra);
    expect(gateDiacriticos(pelado).ok).toBe(false);
    expect(gateDiacriticos(pelado).ratio).toBe(0);
  });

  it('el gate RECHAZA un texto con á/é/í pero sin háčky (la transcripción a medias)', () => {
    const aMedias = muestra.replace(/[ěščřžůňďťĚŠČŘŽŮŇĎŤ]/g, (c) => c.normalize('NFD').charAt(0));
    expect(gateDiacriticos(aMedias).ok).toBe(false);
  });

  it('la normalización recompone a NFC y no toca nada más', () => {
    expect(normalizarDiacriticos('česky ůž')).toBe('česky ůž');
    expect(normalizarDiacriticos('Byla jednou jedna babička, která žila v chaloupce.')).toBe('Byla jednou jedna babička, která žila v chaloupce.');
  });

  it('la medición de grafía VE la ortografía pre-1849 (w, au), y NO la ve en el mismo texto modernizado', () => {
    const viejo = 'Byl gednau geden král a ten měl tři syny. Wšak saud boží gest sprawedliwý, a kdo w noci chodí, ten swé štěstí naleze.';
    const moderno: Record<string, string> = { gednau: 'jednou', geden: 'jeden', gest: 'jest' };
    const nuevo = viejo.replace(/w/g, 'v').replace(/W/g, 'V').replace(/au/g, 'ou').replace(/gednau|geden|gest/g, (m) => moderno[m] ?? m);
    expect(medirGrafia(viejo).bratrska).toBe(true);
    expect(medirGrafia(viejo).nota).toMatch(/anterior a la reforma de 1849/);
    expect(medirGrafia(nuevo).bratrska).toBe(false);
    expect(medirGrafia(nuevo).nota).not.toMatch(/1849/);
  });

  it('la medición de grafía ve el infinitivo en «-ti» (pre-1957) y NO lo ve con «-t»', () => {
    const viejo = 'Chtěl býti dobrým a míti klid; musel jíti domů, viděti matku a dáti jí vše, co mohl dáti.';
    const nuevo = 'Chtěl být dobrým a mít klid; musel jít domů, vidět matku a dát jí vše, co mohl dát.';
    expect(medirGrafia(viejo).infTi).toBe(true);
    expect(medirGrafia(viejo).nota).toMatch(/infinitivo en «-ti»/);
    expect(medirGrafia(nuevo).infTi).toBe(false);
    expect(medirGrafia(nuevo).etiqueta).toBe('grafía actual');
    // «děti», «kosti», «části» no son infinitivos: no cuentan
    expect(medirGrafia('Děti jedly kosti a části masa; chtěl jít a dát.').infTi).toBe(false);
  });

  it('el contador cuenta PALABRAS (algo con una letra), no tokens: la raya no es una palabra', () => {
    expect(contarPalabras([{ texto: '— Ale jak? — řekl on.' }])).toBe(4);
    expect(contarPalabras([{ texto: '* * *' }])).toBe(0);
  });
});

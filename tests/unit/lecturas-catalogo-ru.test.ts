// tests/unit/lecturas-catalogo-ru.test.ts
//
// El catálogo RUSO pasa los mismos invariantes que el portugués, el
// rumano y el checo (`lecturas-catalogo.invariantes.ts`) más los suyos:
// texto en NFC sin acentos de intensidad, cirílico (ni ucraniano ni
// bielorruso), la grafía pre-1918 medida y declarada por pieza y jamás
// convertida, y los gates probados EN ROJO — un gate visto sólo en
// verde no está probado.
//
// Cifras: `node scripts/lectura/medir-catalogo.mjs ru` — nunca a ojo.
import { describe, it, expect } from 'vitest';
import { invariantesDelCatalogo, cargarCatalogo } from './lecturas-catalogo.invariantes';
// Módulo .mjs del pipeline: es la MISMA regla que usa la ingesta (allowJs).
import { normalizarDiacriticos, gateDiacriticos, sinCirilico, fingirPre1918, contarPalabras, medirGrafia, slug } from '../../scripts/lectura/texto-ru.mjs';

invariantesDelCatalogo({
  lang: 'ru',
  variantes: ['ru'],
  // Medido 2026-09-02 al cierre de la tanda F-RU-T1 (Ушинский, Толстой
  // книги для чтения y народные рассказы, Афанасьев, Мамин-Сибиряк,
  // Аксаков, Одоевский, Погорельский): 377 lecturas · 16 series ·
  // 535.913 palabras; F-RU-T2 (Chéjov: 532 relatos, 12 повести, 7 obras de teatro largas y 9 breves): 1.017 · 38 series · 1.799.015 palabras; T3 (Tolstói: Детство-Отрочество-Юность, Казаки, Хаджи-Мурат, 22 relatos, Анна Каренина, Война и мир, Воскресение) y T4 (Pushkin, Lérmontov, Gógol): 1,438 · 70 series · 3,641,530 palabras.
  lecturas: 1438,
  palabras: 3_641_530,
  // ru.wikisource: navegación de capítulos («← Предыдущая», «Следующая →»),
  // llamadas de nota «[1]» huérfanas, páginas del escaneo sin transcribir,
  // el aviso «Источник текста не указан», la frase de las páginas de
  // redacciones y las líneas de índice «… 205» de las ediciones escaneadas.
  aparato: /←\s*Предыдущ|Следующ\p{L}*\s*→|^Оглавление$|^Главы:\s*I\b|дореформенной орфографии$|\[\d{1,3}\]|Страница:[^\n]*\.(?:djvu|pdf)|\^|Источник текста не указан|список редакций|\.\.\.\s*\d{1,4}$|^(?:English|polski|Deutsch|français|italiano|español|magyar|українська|čeština)+$/iu,
  extra: (catalogo) => {
    it('todo el texto está en NFC y sin acentos de intensidad (U+0301), en todos los campos con texto', () => {
      const rotas = catalogo
        .filter(({ l }) => l.titulo !== normalizarDiacriticos(l.titulo) || l.parrafos.some((p) => p.texto !== normalizarDiacriticos(p.texto)))
        .map((x) => x.archivo);
      expect(rotas).toEqual([]);
    });

    it('toda lectura pasa el gate de lengua (cirílico ruso, sin bloques en ucraniano/bielorruso)', () => {
      const rotas = catalogo
        .filter(({ l }) => !gateDiacriticos(l.parrafos.map((p) => p.texto).join('\n')).ok)
        .map((x) => x.archivo);
      expect(rotas).toEqual([]);
    });

    it('toda lectura declara su grafía medida en notaOrtografia, y ninguna es una mezcla', () => {
      for (const { archivo, l } of catalogo) {
        expect(l.notaOrtografia, archivo).toMatch(/Texto en NFC/);
        expect(l.notaOrtografia, archivo).toMatch(/pre-1918|post-1918|1918/);
        expect(l.notaOrtografia, archivo).not.toMatch(/MEZCLADA|Mezcla incoherente/);
      }
    });

    it('la grafía pre-1918 declarada coincide con la medida sobre el texto (ѣ, і, ѳ, ѵ, ъ final), y nunca se convirtió', () => {
      for (const { archivo, l } of catalogo) {
        const g = medirGrafia(l.parrafos.map((p) => p.texto).join('\n'));
        expect(/anterior a la reforma de 1918/.test(l.notaOrtografia ?? ''), `${archivo}: nota «${l.notaOrtografia?.slice(0, 80)}» vs medida «${g.etiqueta}»`).toBe(g.pre1918);
        expect(g.mezcla, `${archivo}: ${g.etiqueta}`).toBe(false);
      }
    });

    it('toda lectura es modo texto (cero audio en la fase F)', () => {
      for (const { archivo, l } of catalogo) expect(l.modo, archivo).toBe('texto');
    });

    it('sólo autores muertos en 1925 o antes (MX vida+100; Бунин, Горький, Булгаков, Зощенко, Хармс, Куприн no entran)', () => {
      for (const { archivo, l } of catalogo) expect(l.muerteAutor, archivo).toBeLessThanOrEqual(1925);
    });

    it('A2 no queda vacío: los cuentos infantiles de Ushinski y Tolstói están declarados A2 con el criterio escrito', () => {
      const a2 = catalogo.filter(({ l }) => l.nivel === 'A2');
      expect(a2.length).toBeGreaterThanOrEqual(100);
      expect(a2.some(({ l }) => l.autor === 'Константин Ушинский')).toBe(true);
      expect(a2.some(({ l }) => l.autor === 'Лев Толстой')).toBe(true);
      for (const { archivo, l } of a2) expect(l.notaOrtografia, archivo).toMatch(/A2 DECLARADO/);
    });

    it('los ids están transliterados (sin cirílico, sin «--» vacíos)', () => {
      for (const { archivo, l } of catalogo) {
        // «serie--pieza» es el separador de colección del motor; lo que no
        // puede haber es un «--» vacío al final (id cirílico sin transliterar).
        expect(l.id, archivo).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
      }
    });
  },
});

describe('gates del texto ruso, probados en rojo', () => {
  const primera = cargarCatalogo('ru')[0];
  if (!primera) throw new Error('catálogo RU vacío');
  const muestra = primera.l.parrafos.map((p) => p.texto).join('\n');

  it('el gate de lengua RECHAZA el mismo texto transliterado al alfabeto latino', () => {
    expect(gateDiacriticos(muestra).ok).toBe(true);
    const latino = sinCirilico(muestra);
    expect(gateDiacriticos(latino).ok).toBe(false);
    expect(gateDiacriticos(latino).ratio).toBe(0);
  });

  it('el gate RECHAZA un texto ucraniano y un bloque ucraniano dentro de uno ruso, y ACEPTA el diálogo ucraniano salpicado', () => {
    const uk = 'Як були собі цар да цариця; да у їх не було дітей; да були вони такі бідні, що і їсти нічого було. Раз пішов цар на заробітки; на дорозі йому захотілось пити. ';
    expect(gateDiacriticos(uk.repeat(6)).ok).toBe(false);
    // 300 palabras rusas + un bloque ucraniano: fuera (es Afanásiev)
    expect(gateDiacriticos(`${muestra.slice(0, 2000)}\n${uk.repeat(6)}`).ok).toBe(false);
    // dos réplicas ucranianas dentro de 400 palabras rusas: dentro (es «Два старика»)
    const salpicado = `${muestra.slice(0, 1500)} — Чого тобі треба? Нема, чоловіче, нічого. Іди собі. ${muestra.slice(1500, 3000)}`;
    expect(gateDiacriticos(salpicado).ok).toBe(true);
  });

  it('la normalización recompone a NFC, quita el acento de intensidad y no toca la «ё»', () => {
    expect(normalizarDiacriticos('на́ пол по́ полу')).toBe('на пол по полу');
    expect(normalizarDiacriticos('й ё')).toBe('й ё');
    expect(normalizarDiacriticos('Жил-был старик со старухою. Ещё раз.')).toBe('Жил-был старик со старухою. Ещё раз.');
  });

  it('la medición de grafía VE la ortografía pre-1918 (ѣ, ъ final) y NO la ve en el mismo texto actual', () => {
    const actual = 'Когда император Александр Павлович окончил венский совет, то он захотел по Европе проездиться и в разных государствах чудес посмотреть.';
    const viejo = fingirPre1918(actual);
    expect(viejo).toMatch(/ъ/);
    expect(medirGrafia(viejo).pre1918).toBe(true);
    expect(medirGrafia(viejo).nota).toMatch(/anterior a la reforma de 1918/);
    expect(medirGrafia(actual).pre1918).toBe(false);
    expect(medirGrafia(actual).mezcla).toBe(false);
    expect(medirGrafia(actual).etiqueta).toBe('grafía actual (post-1918)');
  });

  it('la medición marca como MEZCLA un texto actual con páginas pre-1918 pegadas, y no lo hace con la «і» ucraniana sola', () => {
    const actual = 'Жил-был старик со старухою. Просит старик испечь колобок. Взяла старуха крылышко, по коробу поскребла, по сусеку помела. '.repeat(20);
    const pegado = `${actual} Когда императоръ Александръ Павловичъ окончилъ вѣнскій совѣтъ, то онъ захотѣлъ по Европѣ проѣздиться.`;
    expect(medirGrafia(pegado).mezcla).toBe(true);
    const ucraniano = `${actual} — Чого тобі треба? Нема, чоловіче, нічого. Іди собі.`;
    expect(medirGrafia(ucraniano).mezcla).toBe(false);
    expect(medirGrafia(ucraniano).pre1918).toBe(false);
  });

  it('el contador cuenta PALABRAS con letra cirílica: el francés de Tolstói y la raya no son palabras rusas', () => {
    expect(contarPalabras([{ texto: '— Eh bien, mon prince. Ну, здравствуйте, здравствуйте.' }])).toBe(3);
    expect(contarPalabras([{ texto: '* * *' }])).toBe(0);
  });

  it('la transliteración de ids es estable y sin cirílico', () => {
    expect(slug('Смерть чиновника')).toBe('smert-chinovnika');
    expect(slug('Ёж и щука, ъ')).toBe('yozh-i-schuka');
  });
});

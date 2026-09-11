// tests/unit/prosa-pt-falsedades.test.ts
//
// CANDADO de la auditoría de prosa (2026-09-04, cerrada el 2026-09-10).
//
// La prosa que el alumno LEE como lección afirmaba cosas falsas sobre el
// portugués. No las cazaba ningún gate: Hunspell mira palabras sueltas y
// aprueba una frase bien escrita que dice una mentira, y el ASR valida que
// un audio suene, no que la regla sea cierta. Este fichero es el segundo
// camino, y es textual a propósito: las falsedades vivían en la PROSA.
//
// Cada bloque nombra la falsedad concreta que mató, para que nadie la
// reintroduzca creyendo que aclara algo.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const PT = path.join(process.cwd(), 'lib/data/languages/pt');
const leer = (p: string) => fs.readFileSync(path.join(PT, p), 'utf8');
const mdx = (p: string) => leer(`mdx/${p}.mdx`);

/** Todo el texto que el alumno puede leer, salvo el manifest (hashes). */
function prosaTeoria(): { fichero: string; texto: string }[] {
  const out: { fichero: string; texto: string }[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'lecturas') walk(full); continue; }
      if (e.name === 'manifest.json') continue;
      if (!/\.(json|mdx|ts)$/.test(e.name)) continue;
      out.push({ fichero: path.relative(PT, full), texto: fs.readFileSync(full, 'utf8') });
    }
  };
  walk(PT);
  return out;
}

describe('prosa portuguesa: las falsedades que la auditoría cazó no vuelven', () => {
  it('el modo se llama CONJUNTIVO: «do subjuntivo» es el término brasileño', () => {
    const malos = prosaTeoria().filter((f) => f.texto.includes('do subjuntivo'));
    expect(malos.map((f) => f.fichero)).toEqual([]);
  });

  it('la condicional no se numera: los «tipos» se definían en tarjetas que ya no existen', () => {
    const malos = prosaTeoria().filter((f) => /[Tt]ipo\s*[1-4]\b/.test(f.texto));
    expect(malos.map((f) => f.fichero)).toEqual([]);
  });

  it('«se» + presente do indicativo NO se declara siempre incorrecto', () => {
    // Era la corrección más peligrosa: al matar una falsedad se escribió
    // una regla absoluta que el propio curso desmiente con un ítem
    // publicado («Se os preços são tão altos, terei de fazer um esforço»).
    const l4 = mdx('b5/l4-se-futuro-condicional');
    expect(l4).toMatch(/hecho presente|ya es así/);
    expect(l4).not.toMatch(/Tras 'se', el portugués NO pone presente de indicativo/);
  });

  it('el imperfeito y el futuro do conjuntivo salen de la 3.ª del PLURAL', () => {
    for (const f of ['b6/l2-imperfeito-conjuntivo', 'b6/l3-futuro-conjuntivo']) {
      const t = mdx(f);
      expect(t, `${f}: la base tiene que ser la 3.ª del plural`).toMatch(/PLURAL/);
      expect(t, `${f}: la base del SINGULAR no funciona en los irregulares`)
        .not.toMatch(/tercera persona del \*{0,2}singular\*{0,2} del/i);
    }
  });

  it('el futuro y el condicional tienen TRES irregulares, no catorce', () => {
    for (const f of ['b5/l1-futuro-presente', 'b5/l3-condicional']) {
      const t = mdx(f);
      // La lista vieja daba por irregulares verbos que son regulares.
      expect(t, `${f}: «poderia/quereria/saberia» no son irregulares`)
        .not.toMatch(/irregulares[^.]{0,80}(poder \(poderia\)|querer \(quereria\)|saber \(saberia\))/);
      expect(t).toMatch(/trazer|trarei|traria/);
    }
  });

  it('«futuro composto» no nombra la perífrasis ir + infinitivo', () => {
    const t = mdx('b5/l2-futuro-composto');
    expect(t).toMatch(/futuro perifrástico|futuro imediato/);
    expect(t).toMatch(/terei falado/); // lo que «futuro composto» sí significa
  });

  it('en la rama europea el progresivo es «estar a» + infinitivo', () => {
    const t = mdx('b7/l2-gerundio');
    // El fichero enseñaba «está falando» como la forma a usar, tres líneas
    // debajo de la regla que lo proscribe.
    //
    // El gate mira SÓLO los `pt="..."` de los ejemplos, que es donde una
    // forma se presenta como buena. La primera versión buscaba la cadena
    // en todo el fichero y salía roja por la propia regla, que la cita
    // para prohibirla: un gate que no distingue «enseñar X» de «avisar
    // contra X» marca lo correcto y nadie lo lee.
    const ejemplos = [...t.matchAll(/pt="([^"]*)"/g)].map((m) => m[1]!);
    expect(ejemplos.length).toBeGreaterThan(0);
    const progresivoBrasileno = ejemplos.filter((e) =>
      /\b(estou|estás|está|estamos|estão|ando|andas|anda|andamos|andam)\s+\S+(ando|endo|indo)\b/.test(e),
    );
    expect(progresivoBrasileno).toEqual([]);
    expect(t).toMatch(/está a falar/);
  });

  it('«como se» no admite futuro do conjuntivo', () => {
    expect(leer('curriculum.ts')).not.toMatch(/assim que, como se/);
  });
});

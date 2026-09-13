import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { LANGUAGES } from '@/lib/locales';

// Los seis `auditor-<lang>` comparten UNA doctrina
// (`docs/auditoria/DOCTRINA.md`). Este test existe para que siga siendo
// una y no seis: si alguien la copia dentro de un agente, falla en la
// copia N+1 que nadie sincronizó, que es §A3/§C4 de la propia doctrina.
//
// Y para que un idioma nuevo no entre sin auditor: el registro de
// lenguas es `LANGUAGES`, así que se pregunta POR LA LISTA ESPERADA y no
// se itera lo que hay — §B4, «iterar lo que hay nunca encuentra lo que
// falta».

const DIR = '.claude/agents';
const DOCTRINA = 'docs/auditoria/DOCTRINA.md';
const agente = (l: string) => `${DIR}/auditor-${l}.md`;

describe('los auditores por lengua', () => {
  it('existe uno por CADA lengua del registro', () => {
    for (const l of LANGUAGES) {
      expect(existsSync(agente(l)), `falta ${agente(l)}: una lengua sin auditor no se revisa`).toBe(true);
    }
  });

  it('y ninguno sobra: todo auditor corresponde a una lengua declarada', () => {
    const huérfanos = readdirSync(DIR)
      .filter((f) => f.startsWith('auditor-') && f.endsWith('.md'))
      .map((f) => f.slice('auditor-'.length, -'.md'.length))
      .filter((l) => !(LANGUAGES as readonly string[]).includes(l));
    expect(huérfanos, 'auditores de lenguas que no existen').toEqual([]);
  });

  it('la doctrina existe y NINGÚN auditor la copia', () => {
    expect(existsSync(DOCTRINA)).toBe(true);
    const doctrina = readFileSync(DOCTRINA, 'utf8');
    // Frases largas y distintivas de la doctrina. Si aparecen dentro de
    // un agente, es que se copió en vez de referenciarse.
    // Los titulares de cada clase: `**A1 · El fallo que ...**`. Es la
    // cadena más distintiva que existe, y si alguien copia la doctrina
    // dentro de un agente la arrastra entera.
    const marcas = [...doctrina.matchAll(/^\*\*[A-G]\d+ · (?:★ )?([^*]+?)\*\*/gm)]
      .map((m) => m[1]!.replace(/[.·]\s*$/, '').trim())
      .filter((t) => t.length > 25);
    expect(marcas.length, 'el extractor no halló frases de la doctrina: ¿cambió su formato?').toBeGreaterThan(10);

    for (const l of LANGUAGES) {
      const txt = readFileSync(agente(l), 'utf8');
      const copiadas = marcas.filter((m) => txt.includes(m));
      expect(copiadas, `auditor-${l} COPIA la doctrina en vez de leerla:\n  ${copiadas.join('\n  ')}`).toEqual([]);
    }
  });

  it('cada auditor MANDA leer la doctrina y su propio relevo', () => {
    for (const l of LANGUAGES) {
      const txt = readFileSync(agente(l), 'utf8');
      expect(txt, `auditor-${l} no apunta a la doctrina`).toContain(DOCTRINA);
      const relevos = txt.match(/docs\/plans\/[0-9a-z-]+\.md/g) ?? [];
      expect(relevos.length, `auditor-${l} no cita ningún documento de plan`).toBeGreaterThan(0);
      for (const r of relevos) {
        expect(existsSync(r), `auditor-${l} apunta a ${r}, que no existe`).toBe(true);
      }
    }
  });

  it('ninguno se declara capaz de gastar audio ni de arreglar en silencio', () => {
    for (const l of LANGUAGES) {
      const txt = readFileSync(agente(l), 'utf8');
      expect(txt, `auditor-${l} debe prohibirse arreglar sin avisar`).toMatch(/silencio/i);
      expect(txt, `auditor-${l} debe prohibirse gastar audio`).toMatch(/audio/i);
    }
  });
});

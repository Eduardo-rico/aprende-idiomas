// tests/unit/lecturas-privadas.test.ts
//
// Estante privado de lectura (2026-08-12): obras con derechos de autor
// que Edu posee como copia personal. Viven en `lecturas-privadas/`
// (gitignorado) y el loader las funde con el catálogo público.
//
// El test más importante es el ÚLTIMO: ninguna lectura privada puede
// estar trackeada por git. Publicar el repo con un cuento de Lispector
// dentro no es un bug, es distribución de una obra con derechos.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { loadLecturas, loadLectura } from '@/lib/data/loaders';

const PRIV = path.join(process.cwd(), 'lib/data/languages/pt/lecturas-privadas');
const FIXTURE_ID = 'zzz-test-fixture-privada';

const FIXTURE = {
  id: FIXTURE_ID,
  titulo: 'Fixture privada (test)',
  autor: 'Autora Viva',
  nivel: 'B1',
  fuente: 'test',
  licencia: 'copia personal — NO redistribuir',
  privada: true,
  variante: 'pt-br',
  modo: 'texto',
  parrafos: [{ texto: 'Um parágrafo de prova.' }],
};

beforeAll(async () => {
  await fs.mkdir(PRIV, { recursive: true });
  await fs.writeFile(path.join(PRIV, `${FIXTURE_ID}.json`), JSON.stringify(FIXTURE));
});
afterAll(async () => {
  await fs.rm(path.join(PRIV, `${FIXTURE_ID}.json`), { force: true });
});

describe('estante privado de lecturas', () => {
  it('loadLecturas funde el estante privado con el público', async () => {
    const todas = await loadLecturas('pt');
    const ids = todas.map((l) => l.id);
    expect(ids).toContain(FIXTURE_ID); // privada
    expect(ids).toContain('a-aia'); // pública, sigue ahí
  });

  it('loadLectura encuentra una privada por id', async () => {
    const l = await loadLectura('pt', FIXTURE_ID);
    expect(l).not.toBeNull();
    expect((l as any).privada).toBe(true);
    expect((l as any).variante).toBe('pt-br');
  });

  it('una pública NUNCA es ensombrecida por una privada con el mismo id', async () => {
    // Si algún día colisionan ids, gana la pública: es la revisada.
    const l = await loadLectura('pt', 'a-aia');
    expect(l?.autor).toContain('Eça');
  });
});

describe('la línea roja: nada privado en git', () => {
  it('git no trackea NI UN archivo de lecturas-privadas ni de ingesta-privada', () => {
    const out = execSync(
      'git ls-files lib/data/languages/pt/lecturas-privadas ingesta-privada',
      { cwd: process.cwd(), encoding: 'utf8' },
    ).trim();
    expect(out).toBe('');
  });

  it('.gitignore cubre ambos directorios', async () => {
    const gi = await fs.readFile(path.join(process.cwd(), '.gitignore'), 'utf8');
    expect(gi).toContain('ingesta-privada/');
    expect(gi).toContain('lecturas-privadas/');
  });
});

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

// Fase F (2026-09-02): la línea roja cubre TODAS las lenguas, no sólo
// PT — el estante rumano (Cărtărescu) vive en `ro/lecturas-privadas/`
// y cs/ru vendrán por el mismo camino. El .gitignore pasó de
// `pt/lecturas-privadas/` a `*/lecturas-privadas/` por eso mismo.
const LENGUAS = ['pt', 'ro', 'cs', 'ru'];
const DIRS_PRIVADOS = [...LENGUAS.map((l) => `lib/data/languages/${l}/lecturas-privadas`), 'ingesta-privada'];
const trackeados = () => execSync(`git ls-files ${DIRS_PRIVADOS.join(' ')}`, { cwd: process.cwd(), encoding: 'utf8' }).trim();

describe('la línea roja: nada privado en git', () => {
  it('git no trackea NI UN archivo de lecturas-privadas (pt/ro/cs/ru) ni de ingesta-privada', () => {
    expect(trackeados()).toBe('');
  });

  it('.gitignore cubre el estante privado de TODAS las lenguas y la carpeta de ingesta', async () => {
    const gi = await fs.readFile(path.join(process.cwd(), '.gitignore'), 'utf8');
    expect(gi).toContain('ingesta-privada/');
    expect(gi).toContain('lib/data/languages/*/lecturas-privadas/');
    // git-check-ignore es la verdad, no el texto del .gitignore
    for (const l of LENGUAS) {
      const r = execSync(`git check-ignore -q lib/data/languages/${l}/lecturas-privadas/x.json; echo $?`, { cwd: process.cwd(), encoding: 'utf8' }).trim();
      expect(r, `${l} no está ignorado`).toBe('0');
    }
  });

  // Un gate visto sólo en verde no está probado: se fuerza un dummy al
  // índice (`git add -f`, como haría un descuido) en el estante RUMANO y
  // la comprobación tiene que verlo. Se retira del índice pase lo que pase.
  it('EN ROJO: un fichero privado forzado al índice lo caza la comprobación', async () => {
    const dir = path.join(process.cwd(), 'lib/data/languages/ro/lecturas-privadas');
    const dummy = path.join(dir, 'zzz-dummy-linea-roja.json');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(dummy, '{}');
    try {
      execSync(`git add -f "${dummy}"`, { cwd: process.cwd() });
      expect(trackeados()).toContain('zzz-dummy-linea-roja.json');
    } finally {
      execSync(`git rm --cached -q -f "${dummy}"`, { cwd: process.cwd() });
      await fs.rm(dummy, { force: true });
    }
    expect(trackeados()).toBe('');
  });
});

// Fase F-2 (2026-09-02): el estante privado CHECO y RUSO. El gate de
// lengua que lo guarda se prueba aquí en VERDE y en ROJO sobre un
// directorio de fixtures, nunca sobre el estante real (que es la copia
// personal de Edu y está gitignorado).
const TMP = path.join(process.cwd(), 'lib/data/languages/cs/lecturas-privadas/.tmp-test');

const pieza = (id: string, texto: string) => ({
  id,
  titulo: 'Fixture',
  autor: 'Autor Vivo',
  nivel: 'B1',
  modo: 'texto',
  fuente: 'test',
  licencia: 'copia personal — NO redistribuir',
  privada: true,
  variante: 'cs',
  parrafos: [{ texto }],
});

// Checo real (con háček, čárka y kroužek) y el MISMO texto despojado.
const CS_OK =
  'Můj tatínek pochopil už dávno, že nejkrásnější ryby žijí v řece pod hrází. Když se setmělo, šli jsme k vodě a čekali, až se ozve šplouchnutí. Byl to večer, na který se nezapomíná.';
const CS_ROTO = CS_OK.normalize('NFD').replace(/[̀-ͯ]/g, '');

async function conFixture(nombre: string, texto: string) {
  await fs.rm(TMP, { recursive: true, force: true });
  await fs.mkdir(TMP, { recursive: true });
  await fs.writeFile(path.join(TMP, `${nombre}.json`), JSON.stringify(pieza(nombre, texto)));
  try {
    return { ok: true, salida: execSync(`node scripts/lectura/gate-privadas.mjs cs "${TMP}"`, { cwd: process.cwd(), encoding: 'utf8' }) };
  } catch (e) {
    return { ok: false, salida: String((e as { stdout?: string }).stdout ?? '') };
  }
}

describe('gate de lengua del estante privado (cs)', () => {
  afterAll(async () => {
    await fs.rm(TMP, { recursive: true, force: true });
  });

  it('EN VERDE: una pieza en checo correcto pasa', async () => {
    const r = await conFixture('ok', CS_OK);
    expect(r.salida).toContain('0 en rojo');
    expect(r.ok).toBe(true);
  });

  it('EN ROJO: el MISMO texto sin diacríticos no pasa', async () => {
    const r = await conFixture('roto', CS_ROTO);
    expect(r.ok).toBe(false);
    expect(r.salida).toContain('1 en rojo');
  });

  it('una lengua sin regla propia no aprueba en falso: lo dice', () => {
    const salida = execSync('node scripts/lectura/gate-privadas.mjs de', { cwd: process.cwd(), encoding: 'utf8' });
    expect(salida).toContain('sin gate propio');
  });
});

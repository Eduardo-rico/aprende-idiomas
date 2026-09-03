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
import { execSync as execCrudo } from 'node:child_process';

// El checkout es COMPARTIDO: otra sesión puede estar commiteando cuando
// este test invoca git. Antes se reintentaba con espera; ahora la
// colisión se quita de raíz (ver SOLO_LECTURA y el test EN ROJO), y esto
// sólo queda para que, si alguna vez vuelve, el mensaje diga lo que es en
// vez de disfrazarse de fallo de la línea roja.
function execSync(cmd: string, opts?: Parameters<typeof execCrudo>[1]): string {
  try {
    return String(execCrudo(cmd, opts) ?? '');
  } catch (e) {
    const msg = String((e as { stderr?: unknown; message?: unknown }).stderr ?? (e as Error).message ?? '');
    if (msg.includes('index.lock'))
      throw new Error(`git bloqueado por .git/index.lock — otra sesión está commiteando en este checkout; NO es un fallo de la línea roja. Comando: ${cmd}`);
    throw e;
  }
}
import path from 'node:path';
import os from 'node:os';
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

// `GIT_OPTIONAL_LOCKS=0` es la forma documentada de que git NO tome
// `.git/index.lock` en operaciones de sólo lectura. En un checkout
// compartido con otras sesiones eso quita la colisión de raíz, en vez de
// reintentarla. (Vía la sesión exe-lg, 2026-09-03.)
// El entorno se LIMPIA de todo GIT_*, no se hereda. Motivo medido el
// 2026-09-03, y caro: git exporta `GIT_INDEX_FILE` (entre otras) a sus
// hooks, así que cuando la suite corre dentro de `pre-commit` las
// llamadas de este fichero apuntaban al índice REAL aunque se les pasara
// `cwd` de un repo temporal. El aislamiento se evaporaba justo en la
// única ejecución que importa. `GIT_OPTIONAL_LOCKS=0` es además la forma
// documentada de que git no tome `.git/index.lock` al sólo leer.
// El cast es necesario: `fromEntries` pierde el tipo de ProcessEnv, que
// en este proyecto exige NODE_ENV.
const SIN_GIT_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')),
) as NodeJS.ProcessEnv;
const ENTORNO = { encoding: 'utf8' as const, env: { ...SIN_GIT_ENV, GIT_OPTIONAL_LOCKS: '0' } };
const SOLO_LECTURA = ENTORNO;

// Parametrizada por repo a propósito: LA MISMA función se prueba contra
// el checkout real (en verde) y contra un repo temporal (en rojo). Si se
// copiara para el segundo caso, la copia se desincronizaría de esta.
const trackeados = (cwd: string = process.cwd()) =>
  execSync(`git ls-files ${DIRS_PRIVADOS.join(' ')}`, { cwd, ...SOLO_LECTURA }).trim();

describe('la línea roja: nada privado en git', () => {
  it('git no trackea NI UN archivo de lecturas-privadas (pt/ro/cs/ru) ni de ingesta-privada', () => {
    expect(trackeados()).toBe('');
  });

  // El test de arriba, SOLO, es un falso verde esperando: `git ls-files`
  // sobre una ruta que no existe sale vacío y con éxito (medido
  // 2026-09-03), así que pasaría igual de bien con la lista mal escrita —
  // vigilando un sitio donde no hay nada. Esto la ancla al árbol real.
  it('cada directorio vigilado EXISTE de verdad (si no, el verde de arriba no significa nada)', async () => {
    for (const d of DIRS_PRIVADOS) {
      const st = await fs.stat(path.join(process.cwd(), d)).catch(() => null);
      expect(st?.isDirectory(), `${d} no existe: la línea roja lo cree vigilado y no vigila nada`).toBe(true);
    }
  });

  it('.gitignore cubre el estante privado de TODAS las lenguas y la carpeta de ingesta', async () => {
    const gi = await fs.readFile(path.join(process.cwd(), '.gitignore'), 'utf8');
    expect(gi).toContain('ingesta-privada/');
    expect(gi).toContain('lib/data/languages/*/lecturas-privadas/');
    // git-check-ignore es la verdad, no el texto del .gitignore. Y se
    // pregunta por LAS MISMAS rutas de DIRS_PRIVADOS, no por una plantilla
    // aparte: una regla copiada se desincroniza de la que gobierna.
    // Ojo con lo que este test NO prueba: el glob ignora también una
    // lengua inventada (`xx`, medido), así que ancla el nombre del
    // directorio pero no el de la lengua. Eso lo ancla el test de arriba.
    for (const d of DIRS_PRIVADOS) {
      const r = execSync(`git check-ignore -q ${d}/x.json; echo $?`, { cwd: process.cwd(), ...SOLO_LECTURA }).trim();
      expect(r, `${d} no está ignorado`).toBe('0');
    }
  });

  // Un gate visto sólo en verde no está probado: se fuerza un dummy al
  // índice (`git add -f`, como haría un descuido) y la comprobación tiene
  // que verlo.
  //
  // Va en un repo TEMPORAL, no en el checkout real, y la razón es que el
  // modo de fallo de la versión anterior era exactamente aquello contra lo
  // que este test existe: escribía en el índice de verdad y lo limpiaba en
  // un `finally`, de modo que si el proceso moría entre el `add` y el `rm
  // --cached` —o si el `rm` chocaba con el `index.lock` de otra sesión,
  // que fue lo que pasó— quedaba un fichero privado STAGED en el repo, y
  // un `git commit` sin rutas se lo lleva (las dos cosas, medidas el
  // 2026-09-03). Con el .gitignore REAL copiado dentro, el temporal prueba
  // lo mismo sin poder ensuciar nada.
  it('EN ROJO: un fichero privado forzado al índice lo caza la comprobación', async () => {
    const repo = await fs.mkdtemp(path.join(os.tmpdir(), 'linea-roja-'));
    try {
      execSync('git init -q .', { cwd: repo, ...ENTORNO });
      await fs.copyFile(path.join(process.cwd(), '.gitignore'), path.join(repo, '.gitignore'));
      for (const d of DIRS_PRIVADOS) await fs.mkdir(path.join(repo, d), { recursive: true });
      expect(trackeados(repo), 'el repo temporal debería arrancar limpio').toBe('');

      const rel = 'lib/data/languages/ro/lecturas-privadas/zzz-dummy-linea-roja.json';
      await fs.writeFile(path.join(repo, rel), '{}');
      // En disco pero ignorado: NO debe aparecer. Sin este paso, el test
      // no distinguiría «ve lo trackeado» de «ve lo que hay en la carpeta».
      expect(trackeados(repo)).toBe('');

      // `--git-dir/--work-tree` explícitos: aunque alguien reintroduzca un
      // GIT_DIR heredado, esta escritura no puede caer en otro repo.
      execSync(`git --git-dir="${repo}/.git" --work-tree="${repo}" add -f "${rel}"`, { cwd: repo, ...ENTORNO });
      expect(trackeados(repo)).toContain('zzz-dummy-linea-roja.json');
    } finally {
      await fs.rm(repo, { recursive: true, force: true });
    }
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

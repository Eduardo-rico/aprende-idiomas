// Quita la tipografía del transcriptor de Gutenberg que quedó DENTRO de
// las lecturas publicadas.
//
//   node scripts/lectura/limpiar-tipografia.mjs             # sólo informa
//   node scripts/lectura/limpiar-tipografia.mjs --escribir
//   node scripts/lectura/limpiar-tipografia.mjs --muestra   # contextos
//
// Tres clases, medidas sobre las 967 lecturas y 3,2M palabras:
//
//   · **53.646 guiones dobles** «--» donde va la raya. Es lo que más se
//     nota leyendo, y el diccionario emergente tropieza con «--Peça-me».
//   · **1.180 superíndices** del transcriptor: «v. ex.^a», «S^{r}», «N.^o».
//   · **270 llamadas de nota** «[1]» cuyo texto NO existe en la lectura:
//     el marcador quedó y la nota se perdió al recortar.
//
// TRES CUIDADOS, y los tres salieron de mirar antes de tocar:
//
//   1. **El guion SIMPLE no se toca.** En portugués es un rasgo, no un
//      signo: «vi-o», «dá-me», «far-lhe-á». Son 85.534 y ninguno cambia.
//   2. **No todo «--» es una raya.** Buscando pares «X--Y» que el corpus
//      TAMBIÉN escribe con guion simple salieron 17 candidatos, y al
//      leerlos uno a uno **cinco eran guiones de verdad**: la palabra
//      compuesta «mestre--eschola», dos nombres-broma hechos con el
//      padrenuestro («Padre--Nosso--Que--Estaes--No--Ceo»), y dos gritos
//      militares silabeados («hom--brô... armas!», «Mei--ãã volta!»).
//      Van en una lista de excepciones, a guion simple. Un reemplazo
//      sobre 3,2M palabras se equivoca en silencio: por eso se buscó.
//   3. **Hay DOS campos, no uno.** El karaoke NO se pinta desde `texto`
//      sino desde `palabras[].t` —`LectorKaraoke` mapea los tokens—, y
//      348 de esos tokens llevan «--» dentro. Cambiar sólo `texto`
//      dejaría el karaoke con la tipografía vieja y nadie lo vería,
//      porque cada componente lee su campo. Se cambian los dos.
//
// En `texto` la raya va ESPACIADA, que es lo que ya hace el corpus donde
// la tiene de origen (4.272 con espacios frente a 405 pegadas). En un
// token de karaoke va PEGADA, porque un token es una unidad de tiempo:
// meterle espacios sugiere palabras con tiempos propios, y no los hay.
import fs from 'node:fs';
import path from 'node:path';

const DIRS = ['lib/data/languages/pt/lecturas', 'lib/data/languages/pt/lecturas-privadas'];
const ESCRIBIR = process.argv.includes('--escribir');
const MUESTRA = process.argv.includes('--muestra');

/** Los «--» que son guion de verdad, leídos uno a uno. */
const EXCEPCIONES = [
  ['mestre--eschola', 'mestre-eschola'],
  ['Padre--Nosso--Que--Estaes--No--Ceo', 'Padre-Nosso-Que-Estaes-No-Ceo'],
  ['Dae-nos--Hoje--O--Pão--Nosso--De--Cada--Dia', 'Dae-nos-Hoje-O-Pão-Nosso-De-Cada-Dia'],
  ['hom--brô', 'hom-brô'],
  ['Hom--brô', 'Hom-brô'],
  ['Mei--ãã', 'Mei-ãã'],
];

const quitaExcepciones = (s) => EXCEPCIONES.reduce((acc, [de, a]) => acc.split(de).join(a), s);

/** Los DOS títulos con guion doble, a mano: uno es raya y el otro un
 *  intervalo de años, que pide raya CORTA. Una regla para dos casos sería
 *  más código que criterio. Los 194 `id` con «--» NO se tocan: ahí el
 *  doble guion separa obra y capítulo —«a-cidade-do-vicio--a-camisa»— y es
 *  una CLAVE, no tipografía. */
const TITULOS = new Map([
  ['Juramento--pagamento.', 'Juramento — pagamento.'],
  ['O alcaide de santarém (950--961)', 'O alcaide de santarém (950–961)'],
]);

/** Superíndices del transcriptor. `^{r}` lleva llaves; `^a`/`^o` son los
 *  indicadores ordinales, que sí tienen carácter propio. */
function superindices(s) {
  return s
    .replace(/\^\{([a-zA-Z]+)\}/g, '$1')
    .replace(/\^a\b/g, 'ª')
    .replace(/\^o\b/g, 'º')
    .replace(/\^([a-zA-Z])/g, '$1');
}

/** Llamadas de nota huérfanas. Se quitan enteras: el texto de la nota no
 *  está en la lectura, así que el marcador no lleva a ninguna parte. */
const notas = (s) => s.replace(/\[\d{1,3}\]/g, '');

/** El texto que LEE el alumno: raya espaciada.
 *
 *  NO se normalizan los espacios del párrafo. Mi primera versión colapsaba
 *  los espacios dobles y hacía `trim()` de todo, y el dry-run enseñó que
 *  eso tocaba **70 ficheros que no tienen ni un guion doble**: dentro
 *  viven los separadores de escena «*       *       *       *», cuyo
 *  espaciado ES el signo, y las comas y dos puntos espaciados de las
 *  ediciones del XIX —«Ora pois : estas meditações»—, que son la fuente y
 *  no una errata. Un limpiador que arregla lo que nadie le pidió es la
 *  misma avería que persigue.
 *
 *  Así que la raya se inserta ABSORBIENDO los espacios que ya hubiera a su
 *  lado, y no se toca ni un espacio más. */
export function limpiarTexto(s) {
  const t = notas(superindices(quitaExcepciones(s)))
    .replace(/^[ \t]*--+[ \t]*/, '— ')     // abre diálogo
    .replace(/[ \t]*--+[ \t]*/g, ' — ');   // raya interior
  // El trim SÓLO si el original no traía espacios en los bordes: si los
  // traía, son suyos.
  return s === s.trim() ? t.trim() : t;
}

/** Un token de karaoke: raya PEGADA, salvo cuando abre diálogo —ahí sí
 *  lleva espacio, porque no está uniendo dos palabras. */
export function limpiarToken(s) {
  let t = notas(superindices(quitaExcepciones(s)));
  t = t.replace(/^--+/, '— ').replace(/--+/g, '—');
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

const cuenta = (s, re) => (s.match(re) ?? []).length;
const RE = { guion: /--/g, sup: /\^\{?[a-zA-Z]\}?/g, nota: /\[\d{1,3}\]/g, simple: /(?<![-\s])-(?![-\s])/g };

let ficheros = 0, tocadas = 0;
const tot = { guion: 0, sup: 0, nota: 0 };
const simpleAntes = { n: 0 }, simpleDespues = { n: 0 };
const muestras = [];

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    const p = path.join(dir, f);
    const crudo = fs.readFileSync(p, 'utf8');
    const j = JSON.parse(crudo);
    ficheros += 1;
    if (!Array.isArray(j.parrafos)) continue;

    let cambios = 0;
    if (TITULOS.has(j.titulo)) { j.titulo = TITULOS.get(j.titulo); cambios += 1; }
    for (const par of j.parrafos) {
      const antes = String(par.texto ?? '');
      simpleAntes.n += cuenta(antes, RE.simple);
      tot.guion += cuenta(antes, RE.guion);
      tot.sup += cuenta(antes, RE.sup);
      tot.nota += cuenta(antes, RE.nota);
      const despues = limpiarTexto(antes);
      simpleDespues.n += cuenta(despues, RE.simple);
      if (despues !== antes) {
        cambios += 1;
        if (MUESTRA && muestras.length < 12) {
          const i = antes.search(/--|\^|\[\d/);
          muestras.push(`  antes:  …${antes.slice(Math.max(0, i - 42), i + 42)}…\n  después:…${despues.slice(Math.max(0, i - 42), i + 44)}…`);
        }
        par.texto = despues;
      }
      for (const w of par.palabras ?? []) {
        const t = limpiarToken(String(w.t ?? ''));
        if (t !== w.t) { w.t = t; cambios += 1; }
      }
    }
    if (!cambios) continue;
    tocadas += 1;
    // FRENO: el guion simple es un rasgo del portugués y ninguno puede
    // desaparecer. Si el fichero pierde uno, no se escribe y se avisa.
    const nuevo = JSON.stringify(j, null, 2) + '\n';
    if (cuenta(nuevo, RE.simple) < cuenta(crudo, RE.simple)) {
      console.log(`⚠ ${f}: perdería guiones simples — NO se toca`);
      continue;
    }
    if (ESCRIBIR) fs.writeFileSync(p, nuevo);
  }
}

console.log(`# Tipografía del transcriptor — ${ficheros} lecturas\n`);
console.log('| clase | ocurrencias |');
console.log('|---|---:|');
console.log(`| guion doble «--» donde va la raya | ${tot.guion} |`);
console.log(`| superíndices «v. ex.^a», «S^{r}» | ${tot.sup} |`);
console.log(`| llamadas de nota huérfanas «[1]» | ${tot.nota} |`);
console.log(`\nFicheros afectados: **${tocadas}**.`);
console.log(`Guion SIMPLE —rasgo del portugués, no se toca—: ${simpleAntes.n} antes · ${simpleDespues.n} después.`);
console.log(`Excepciones leídas a mano y dejadas como guion: ${EXCEPCIONES.length}.`);
if (MUESTRA) { console.log('\n## Muestra\n'); for (const m of muestras) console.log(m + '\n'); }
console.log(ESCRIBIR ? '\n**ESCRITO.**' : '\nDRY-RUN: no se ha tocado nada. Repite con --escribir.');

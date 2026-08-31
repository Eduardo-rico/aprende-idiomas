// scripts/lotes/lote12-pares.ts
//
//   npx tsx scripts/lotes/lote12-pares.ts > docs/contenido/2026-09-03-lote12-c2-mesoclise.md
//
// EL PRIMER LOTE CONSTRUIDO POR PARES MÍNIMOS, y el primero de C2.
//
// Cierra `b12-mesoclise-estilistica` de 0 a 12. Es uno de los ocho
// puntos de C2 que se declararon al abrir el bloque 12 en esta misma
// sesión: hasta hoy C2 eran 408 unidades de déficit sin ningún sitio
// donde aterrizar, porque `LessonSchema.blockId` topaba en 11.
//
// Por qué la mesóclise y no otro de los ocho: porque a C2 el currículo
// pide «la mesóclise como recurso estilístico consciente y **no como
// forma obligada**», y esa oposición es CATEGÓRICA en la norma europea
// — con atractor de próclise (não, ninguém, nunca, só, que…) la
// mesóclise es imposible; sin atractor, la próclise es brasileña. Un
// juicio de gramaticalidad necesita veredictos inequívocos, y los otros
// siete puntos de C2 declarados no los dan todavía: la «concordancia en
// casos discutidos» es discutida POR DEFINICIÓN, y el «régimen de
// verbos de baja frecuencia» choca con que Priberam suele registrar dos
// regímenes para justo esos verbos (`precaver-se contra` **ou** `de`).
// Esa es la clase que ya tumbó siete MAL en el lote 10.
//
// El diseño: seis pares, y en TRES el BIEN lleva mesóclise mientras en
// los otros TRES la lleva el MAL. Sin ese equilibrio, «¿hay un guion?»
// resolvería el lote sin saber portugués.
import { expandir, patronesPublicados, type ParMinimo } from '../lib/pares-minimos';
import fs from 'node:fs';
import path from 'node:path';

const CONCEPTO = 'b12-mesoclise-estilistica';

export const PARES: ParMinimo[] = [
  // ── Con atractor ⇒ la próclise es obligatoria y la mesóclise imposible
  {
    id: 'P-01', concepto: CONCEPTO,
    rasgo: 'con «não» delante, atractor de próclise, la mesóclise es imposible',
    esqueleto: 'Não {} a verdade toda enquanto o processo não estiver encerrado.',
    bien: 'lhe direi', mal: 'dir-lhe-ei',
    explicacionBien:
      'Con «não» delante, el clítico va OBLIGATORIAMENTE proclítico, y eso ' +
      'desactiva la mesóclise: «não lhe direi», nunca «não dir-lhe-ei». A C2 ' +
      'la mesóclise ya no es una forma que se aplique porque el verbo esté en ' +
      'futuro, sino una que se elige cuando NADA la impide.',
    explicacionMal:
      'La mesóclise sólo cabe cuando el futuro o el condicional abren la ' +
      'oración sin atractor delante. Aquí hay «não», que es atractor de ' +
      'próclise, así que la única colocación posible es «não lhe direi». Es el ' +
      'error del que ha aprendido la mesóclise y la aplica como regla mecánica.',
  },
  {
    id: 'P-02', concepto: CONCEPTO,
    rasgo: 'con «ninguém» sujeto, atractor de próclise, la mesóclise es imposible',
    esqueleto: 'Ninguém {} o que se passou naquela reunião de dezembro.',
    bien: 'lhes contará', mal: 'contar-lhes-á',
    explicacionBien:
      'Los cuantificadores negativos —«ninguém», «nada», «nenhum»— atraen el ' +
      'clítico igual que «não». Con «ninguém» de sujeto, próclise: «ninguém ' +
      'lhes contará».',
    explicacionMal:
      '«Ninguém» es atractor de próclise, así que la mesóclise queda excluida. ' +
      'La prueba es fácil de hacer en la cabeza: si delante del verbo hay una ' +
      'palabra negativa, el clítico se va delante y ya no hay dónde partir el ' +
      'futuro.',
  },
  {
    id: 'P-03', concepto: CONCEPTO,
    rasgo: 'con el adverbio «nunca», atractor de próclise, la mesóclise es imposible',
    esqueleto: 'O recurso está pendente e a comissão nunca {} sem ouvir as duas partes.',
    bien: 'o decidirá', mal: 'decidi-lo-á',
    explicacionBien:
      'Los adverbios de negación y de frecuencia negativa —«nunca», «jamais», ' +
      '«raramente»— son atractores. Con ellos el futuro no se parte: «nunca o ' +
      'decidirá».',
    explicacionMal:
      'La mesóclise pide que el verbo no tenga atractor a su izquierda, y ' +
      '«nunca» lo es. Nótese que la forma «decidi-lo-á» está bien construida ' +
      '—la -r cae y el clítico toma la -l-—: lo que falla no es la morfología ' +
      'sino el sitio.',
  },
  // ── Sin atractor ⇒ la mesóclise es la forma culta y la próclise es brasileña
  {
    id: 'P-04', concepto: CONCEPTO,
    rasgo: 'sin atractor y con el verbo abriendo la oración, la próclise es brasileña',
    esqueleto: 'O presidente já sabe do caso e a direção {} do resultado esta semana.',
    bien: 'informá-lo-á', mal: 'o informará',
    explicacionBien:
      'Sin nada que atraiga el clítico —«e» coordina, no atrae—, el futuro se ' +
      'parte y el pronombre se mete dentro: «informá-lo-á», con «o» = «o ' +
      'presidente». En la norma europea escrita ésta es la ' +
      'colocación por defecto, y a C2 es una elección de registro — culta, no ' +
      'obligatoria.',
    explicacionMal:
      'La próclise sin atractor es la colocación brasileña. En portugués ' +
      'europeo, con el sujeto delante y nada más, el clítico no se antepone: ' +
      'la forma es «informá-lo-á». Es el calco que sobrevive a todo porque se ' +
      'entiende igual.',
  },
  {
    id: 'P-05', concepto: CONCEPTO,
    rasgo: 'sin atractor y con el verbo abriendo la oración, la próclise es brasileña',
    esqueleto: 'O programa já está fechado e o secretariado {} aos sócios amanhã.',
    bien: 'enviá-lo-á', mal: 'o enviará',
    explicacionBien:
      'Mismo caso que el anterior con otro verbo: «enviará» + «o» (= «o ' +
      'programa») da «enviá-lo-á», con caída de la -r y el clítico en -l-. Se ' +
      'repite el patrón con otro léxico para que se vea que la regla no ' +
      'depende del verbo.',
    explicacionMal:
      'Sin atractor delante, «o enviará» es brasileño. La marca del portugués ' +
      'europeo culto aquí es partir el futuro, y es justo lo que un ' +
      'hispanohablante no produce nunca solo, porque el español antepone ' +
      'siempre.',
  },
  {
    id: 'P-06', concepto: CONCEPTO,
    rasgo: 'tras una subordinada antepuesta y coma, el clítico no puede abrir la oración principal',
    esqueleto: 'Quando o prazo terminar, {} os documentos por correio registado.',
    bien: 'enviar-te-ei', mal: 'te enviarei',
    explicacionBien:
      'La subordinada de delante NO es atractor: acabada la coma, la principal ' +
      'empieza otra vez y el clítico no puede abrirla. De ahí la mesóclise, ' +
      '«enviar-te-ei». Es el caso que más se falla, porque parece que el ' +
      '«quando» gobierna toda la frase y no gobierna más que su cláusula.',
    explicacionMal:
      'El portugués europeo no admite el pronombre átono abriendo oración, y ' +
      'tras la coma la principal empieza de cero. «Te enviarei» sólo sería ' +
      'posible con un atractor DENTRO de la principal, que aquí no hay.',
  },
];

// ── Emisión del documento ────────────────────────────────────────────
const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: { id: string; type: string; data: unknown }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex);

const items = expandir(PARES, {
  semilla: 'lote12-c2-mesoclise-e2-13',
  publicados: [...patronesPublicados(corpus).values()],
});

const L: string[] = [];
L.push('# Lote 12 — C2, la mesóclise como ELECCIÓN · **primer lote por pares mínimos**');
L.push('');
L.push('**Sesión E2#13, 2026-09-03.** Dos primicias en el mismo lote: es el');
L.push('**primer contenido de C2** del proyecto —el nivel llevaba 408 unidades');
L.push('de déficit y cero ítems porque no existía dónde ponerlos— y el primero');
L.push('construido con **pares mínimos por construcción**.');
L.push('');
L.push('| punto | antes | falta | tras el lote |');
L.push('|---|---:|---:|---:|');
L.push(`| \`${CONCEPTO}\` | **0** | 12 | **12** (cierra) |`);
L.push('');
L.push('## Por qué pares mínimos');
L.push('');
L.push('Porque el bucle de las tres sesiones anteriores era éste: cada atajo que');
L.push('se arreglaba fabricaba otro del mismo calibre. Se mató la LONGITUD (13/16)');
L.push('alargando los MAL, y como se alargaron por delante nació el ARRANQUE');
L.push('(12/16, p=0,038) — y esa misma coleta cegó de paso el gate de virginidad.');
L.push('');
L.push('Los doce ítems de aquí abajo son **seis frases**, cada una en dos');
L.push('versiones que difieren en un solo tramo. Todo rasgo que no mire ese tramo');
L.push('—la longitud, el arranque, la coma, el marcador temporal, y también el');
L.push('rasgo número doce que a nadie se le ha ocurrido— vale exactamente igual en');
L.push('los dos miembros del par: aporta un acierto y un fallo. **La batería de');
L.push('atajos deja de ser el motor del diseño y pasa a ser verificación.**');
L.push('');
L.push('Y el equilibrio que el par no da solo: en **tres** pares la mesóclise está');
L.push('en el BIEN y en **tres** en el MAL, para que «¿hay un guion?» no resuelva');
L.push('el lote. La posición BIEN/MAL va barajada con semilla');
L.push('(`lote12-c2-mesoclise-e2-13`), reproducible, y con los dos miembros de cada');
L.push('par nunca a menos de tres posiciones — la alternancia mecánica `MBMB…`');
L.push('acertaba 24/24 en un lote de la sesión pasada y nadie la había medido.');
L.push('');
L.push('**Lo que los pares NO resuelven, y por eso hay round:** que el veredicto');
L.push('sea inequívoco, que el contexto determine la respuesta, y que el rasgo');
L.push('juzgado no sea detectable por una regla superficial distinta de la');
L.push('destreza. Cada par declara en `rasgo` qué se juzga: un rasgo que detecte');
L.push('ESO es legítimo, cualquier otro es un atajo.');
L.push('');
L.push('## Los seis pares, antes de barajar');
L.push('');
L.push('| par | esqueleto | BIEN | MAL | rasgo juzgado |');
L.push('|---|---|---|---|---|');
for (const p of PARES)
  L.push(`| ${p.id} | ${p.esqueleto.replace('{}', '**___**')} | \`${p.bien}\` | \`${p.mal}\` | ${p.rasgo} |`);
L.push('');
L.push('---');
L.push('');
L.push('## Preflight — salida pegada (sin ella no se abre el round)');
L.push('');
L.push('```');
L.push('PENDIENTE-PREFLIGHT');
L.push('```');
L.push('');
L.push('---');
L.push('');
L.push(`## \`${CONCEPTO}\` — 12`);
L.push('');
for (const x of items) {
  L.push(`### ${x.id} · **${x.verdict ? 'BIEN' : 'MAL'}**`);
  L.push(`**par:** \`${x.parId}\``);
  L.push(`**sentence:** «${x.sentence}»`);
  if (x.repair) L.push(`**repair:** «${x.repair}»`);
  L.push(`**explicación:** ${x.explicacion}`);
  L.push('');
}
process.stdout.write(L.join('\n'));

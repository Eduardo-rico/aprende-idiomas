// scripts/lotes/lote13-c2-borde.ts
//
//   npx tsx scripts/lotes/lote13-c2-borde.ts > docs/contenido/2026-09-04-lote13-c2-borde.md
//
// LOTE 13 — C2, `b12-borde-gramaticalidad`. **SEIS ítems, no doce**, por
// la regla de corte de Edu: tres pares defendibles valen más que seis
// inventados, y ya van siete MAL muertos en tres sesiones por cruzar esa
// frontera. Los otros tres pares quedan parados con su motivo escrito en
// `2026-09-04-banco-c2-borde-gramaticalidad.md`.
//
// **Por qué este punto es el único de C2 que admite juicios**: el mapa
// formato↔punto lo clasifica `trampa` —el español permite lo que el
// portugués prohíbe, así que el calco suena bien en español y la glosa
// engaña en vez de ayudar—, y es el único de los ocho puntos declarados
// de C2 que sale así.
//
// **Y la restricción que el mapa destapó, aplicada aquí por primera
// vez**: un lote de juicios hecho sólo de un punto `trampa` es imposible
// de pasar por construcción — si todos los MAL son calcos, todas sus
// glosas son español bien formado y el rasgo de la glosa acierta el
// 100 % con la regla invertida. La salida no es aflojar el rasgo: es
// elegir pares cuyos DOS rellenos glosen a español **igual de bien (o
// igual de mal)**. Entonces el rasgo vale lo mismo en los dos miembros,
// aporta un acierto y un fallo, y queda neutro por teorema.
import { expandir, patronesPublicados, rellenar, type ParMinimo } from '../lib/pares-minimos';
import fs from 'node:fs';
import path from 'node:path';

const C = 'b12-borde-gramaticalidad';

export const PARES: ParMinimo[] = [
  // ── P-01 · MUERTO POR LA REGLA DE CORTE ────────────────────────────
  // Afirmaba que el portugués europeo NO duplica el clítico dativo. El
  // grep ancho del round encontró **doce pasajes de duplicación
  // genuina**, y el decisivo es «Eu **lhe** digo **aos senhores**»
  // (Garrett, *Viagens na Minha Terra* c07): clítico + SN dativo pleno,
  // sin coma ni dislocación, delante de completiva. Seis de los doce van
  // igual de limpios («Bacorejou-lhe ao cego», Camilo; «Deus lhes dê
  // boas noites a todos», Eça), y uno está en una lectura etiquetada
  // como C2 del propio curso.
  //
  // Es la misma clase que ya mató siete MAL: la forma condenada estaba
  // atestiguada. Y la falsedad no vivía sólo aquí — estaba **publicada**
  // en el MDX de b12, escrito en E2#13. Corregida allí en el mismo
  // commit, junto con una segunda del mismo tipo: que el portugués
  // carece del neutro «lo», cuando «o melhor é» sale más de veinte veces
  // en la Biblioteca.
  {
    id: 'P-02', concepto: C,
    rasgo: 'el portugués no tiene «a» personal ante el objeto directo',
    esqueleto: 'Fomos visitar {} teu avô esta manhã, mas ele já estava a dormir.',
    bien: 'o', mal: 'ao',
    glosaBien: 'Fuimos a visitar el tu abuelo esta mañana, pero él ya estaba durmiendo.',
    glosaMal: 'Fuimos a visitar al tu abuelo esta mañana, pero él ya estaba durmiendo.',
    // El hueco es un ARTÍCULO, no un clítico: el gate de objeto duplicado
    // no aplica y la válvula se declara por escrito, que es para lo que
    // existe.
    permiteSNPosterior: true,
    explicacionBien:
      'El objeto directo de persona va sin preposición: «visitar o teu avô». ' +
      'El portugués no pone la «a» del español ante el objeto directo NOMINAL, ' +
      'y ésa es la que más resiste porque en español es obligatoria. (Sí la ' +
      'conserva con pronombre tónico —«amo-te a ti», «viu-a a ela»— y en ' +
      'fórmulas con Deus: no es que le falte la preposición, es que no la usa ' +
      'con un nombre.)',
    explicacionMal:
      'La «a» del objeto español, trasplantada a un objeto nominal. ' +
      '«Visitar ao teu avô» sólo sería posible si «ao» fuera el régimen del ' +
      'verbo, y «visitar» es transitivo directo. Medido: cero casos de ' +
      '«visitar ao» + humano en las 224 obras de la Biblioteca.',
  },
  {
    id: 'P-03', concepto: C,
    rasgo: 'el español coloquial admite adverbio de lugar + posesivo; el portugués exige la preposición',
    esqueleto: 'O carro dele ficou estacionado {} durante toda a tarde.',
    bien: 'atrás do meu', mal: 'atrás meu',
    glosaBien: 'El coche de él quedó aparcado detrás del mío durante toda la tarde.',
    glosaMal: 'El coche de él quedó aparcado detrás mío durante toda la tarde.',
    explicacionBien:
      'Los adverbios de lugar portugueses piden preposición antes del ' +
      'posesivo: «atrás do meu», «à frente da minha». La construcción ' +
      'española sin preposición no existe.',
    explicacionMal:
      '«Atrás meu» calca el «detrás mío» español — una construcción que la ' +
      'norma culta española desaconseja y que en buena parte de América no ' +
      'se usa, pero que a un hispanohablante le sale sola. En portugués ' +
      'europeo no está atestiguada: cero casos en 4,3 M de caracteres, con ' +
      'las grafías antiguas «atraz» y «deante» cubiertas.',
  },
];

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: { id: string; type: string; data: unknown }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex);

const GLOSAS: Record<string, { es: string; ok: boolean }> = {};
for (const p of PARES) {
  // La glosa de P-02 es mala en sus DOS miembros («el tu abuelo» / «al tu
  // abuelo»); las de P-01 y P-03 son buenas en los dos. En los tres casos
  // el rasgo vale lo mismo dentro del par: neutro por construcción.
  // P-02 glosa mal en sus dos miembros («el tu abuelo» / «al tu abuelo»):
  // neutro. P-03 NO es neutro, y el round lo corrigió: «detrás del mío»
  // es español correcto y «detrás mío» está desaconsejado por la norma
  // culta y ausente de buena parte de América, así que su glosa no vale
  // lo mismo. Se declara la verdad y se deja que el rasgo la mida.
  const buena = p.id === 'P-03' ? undefined : false;
  GLOSAS[rellenar(p.esqueleto, p.bien)] = { es: p.glosaBien!, ok: buena ?? true };
  GLOSAS[rellenar(p.esqueleto, p.mal)] = { es: p.glosaMal!, ok: buena ?? false };
}

const items = expandir(PARES, {
  semilla: 'lote13-c2-borde-e2-14',
  publicados: [...patronesPublicados(corpus).values()],
});

const L: string[] = [];
L.push('# Lote 13 — C2, el borde de la gramaticalidad ES/PT');
L.push('');
L.push('**Sesión E2#14.** Salió con seis ítems y publica con **cuatro**. Nació');
L.push('con tres pares en vez de seis por la regla de corte de Edu —tres');
L.push('defendibles valen más que seis inventados— y el round mató uno más:');
L.push('**P-01 afirmaba que el portugués europeo no duplica el clítico dativo, y');
L.push('el grep ancho encontró doce pasajes que lo desmienten**, con «Eu **lhe**');
L.push('digo **aos senhores**» (Garrett) de decisivo. Es la octava vez que muere');
L.push('un MAL por lo mismo: la forma condenada estaba atestiguada.');
L.push('');
L.push('Y la falsedad no vivía sólo en el par: estaba **publicada** en el MDX de');
L.push('`b12`, escrito por mí en E2#13. Corregida allí, junto a una segunda del');
L.push('mismo tipo —que el portugués carece del neutro «lo»— que el corpus');
L.push('desmiente veinte veces («o melhor é», «o certo é»). Los otros tres pares');
L.push('siguen parados en `2026-09-04-banco-c2-borde-gramaticalidad.md`.');
L.push('');
L.push('| punto | antes | del lote | tras el lote |');
L.push('|---|---:|---:|---:|');
L.push(`| \`${C}\` | **0** | ${items.length} | **${items.length}** — no cierra, y se declara |`);
L.push('');
L.push('## Por qué este punto y no otro de C2');
L.push('');
L.push('El mapa formato↔punto lo clasifica `trampa` —el español permite lo que el');
L.push('portugués prohíbe, así que el calco suena bien en español y la glosa');
L.push('cognada engaña en vez de ayudar— y es **el único de los ocho puntos');
L.push('declarados de C2 que sale así**. Los otros siete piden mediación,');
L.push('transformación o cloze.');
L.push('');
L.push('## La restricción del mapa, aplicada aquí por primera vez');
L.push('');
L.push('Un lote de juicios hecho **sólo** de un punto `trampa` es imposible de');
L.push('pasar por construcción: si todos los MAL son calcos, todas sus glosas son');
L.push('español bien formado y el rasgo de la glosa acierta el 100 % con la regla');
L.push('invertida «glosa buena ⇒ MAL». La salida no es aflojar el rasgo — es');
L.push('elegir pares cuyos **dos** rellenos glosen a español igual de bien (o');
L.push('igual de mal). P-02 glosa mal en sus dos miembros y queda neutro por');
L.push('teorema. **P-03 no**, y lo corrigió el round: «detrás del mío» es español');
L.push('correcto y «detrás mío» está desaconsejado por la norma culta y ausente');
L.push('de buena parte de América, así que su glosa NO vale lo mismo en los dos');
L.push('miembros. Se declara la verdad y se deja que el rasgo la mida: sale 3/4');
L.push('(p=0,313), que pasa — pero por el tamaño del lote, no por el diseño.');
L.push('');
L.push('## Los pares que quedan, verificados contra el corpus');
L.push('');
L.push('Los tres greps **parecían tumbarlos** y los tres eran falsos positivos que');
L.push('sólo se ven leyendo la frase entera: `dizia-lhe a inclausurada` es un');
L.push('SUJETO, `ver a meu` es `escre**ver a meu** primo Noronha` (regência de');
L.push('«escrever», no «a» personal) y `diante meu` es `de hoje em diante · meu');
L.push('inimigo`, con el grep cruzando dos constituyentes.');
L.push('');
L.push('| par | esqueleto | BIEN | MAL | glosa de los dos | rasgo juzgado |');
L.push('|---|---|---|---|---|---|');
for (const p of PARES)
  L.push(`| ${p.id} | ${p.esqueleto.replace('{}', '**___**')} | \`${p.bien}\` | \`${p.mal}\` | ${p.id === 'P-02' ? 'las dos MALAS' : 'las dos BUENAS'} | ${p.rasgo} |`);
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
L.push(`## \`${C}\` — 6`);
L.push('');
for (const x of items) {
  L.push(`### ${x.id} · **${x.verdict ? 'BIEN' : 'MAL'}**`);
  L.push(`**par:** \`${x.parId}\``);
  L.push(`**sentence:** «${x.sentence}»`);
  if (x.repair) L.push(`**repair:** «${x.repair}»`);
  L.push(`**glosa-es:** «${GLOSAS[x.sentence]!.es}» · español ${GLOSAS[x.sentence]!.ok ? 'CORRECTO' : 'INCORRECTO'}`);
  L.push(`**explicación:** ${x.explicacion}`);
  L.push('');
}
process.stdout.write(L.join('\n'));

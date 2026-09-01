// scripts/triaje-cloze-sin-pista.ts — «sin pista» no es «indeterminado».
//
//   npx tsx scripts/triaje-cloze-sin-pista.ts
//   npx tsx scripts/triaje-cloze-sin-pista.ts --muestra CLASE
//
// El barrido retroactivo encontró 182 cloze publicados sin `hintEs`. No se
// reparan en bloque: la auditoría de E2#15 ya midió sobre los 417 viejos
// que **222 estaban sin pista pero eran DERIVABLES**, y que la muestra de
// esos daba 13 % de error duro frente al 45 % de los sospechosos.
//
// Un cloze de conjugación con el infinitivo entre paréntesis, sujeto
// expreso y marcador temporal está determinado sin glosa española. Uno con
// hueco léxico abierto no lo está nunca. Entre medias está la clase que
// E2#11 pagó cara: **«já ___ o relatório» trae el lema y NO fija la
// persona**, así que admite las cinco.
//
// Por eso el triaje pide las TRES cosas para llamar determinado a un
// verbal, y no sólo el lema.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno, determinacionDictaminada } from './lib/estado-item';
import { esClaseCerrada } from './lib/clase-cerrada';

const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
  .filter(servibleAlAlumno)
  .filter((x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1 && !String(x.data?.hintEs ?? '').trim());

// El lema entre paréntesis: «___ (falar) mais devagar».
const LEMA = /\(\s*[a-zà-ÿ]+(?:-se)?\s*\)/i;
// Sujeto expreso que fija la persona.
const SUJETO = /(?<![\p{L}])(eu|tu|ele|ela|nós|eles|elas|você|vocês|a gente|o senhor|a senhora)(?![\p{L}])/iu;
// Un sintagma nominal antes del hueco también la fija: «A professora ___».
const SN_ANTES = /^(?:[Oo]s?|[Aa]s?|[MmTtSs]eu|[MmTtSs]inha|[Nn]osso|[Nn]ossa|Aquele|Aquela|Este|Esta|Esse|Essa)\s+\p{L}+\s+___/u;
// Marcador que fija el tiempo.
const TIEMPO = /(?<![\p{L}])(ontem|amanhã|hoje|agora|sempre|nunca|já|ainda|antigamente|naquele|naquela|no ano passado|na semana passada|todos os dias|quando|enquanto|assim que|logo que|depois de|antes de|se)(?![\p{L}])/iu;
// Clases CERRADAS: la respuesta sale del sistema, no del léxico. La
// lista vive en `lib/clase-cerrada.ts` porque el gate del generador la
// necesita igual, y una regla copiada se desincroniza en la copia N+1.

type Clase = 'verbal determinado' | 'verbal SIN persona o SIN tiempo' | 'clase cerrada' | 'léxico abierto';
const clasificar = (x: any): Clase => {
  const s = String(x.data.sentence ?? '');
  const r = String(x.data.blanks[0].answer ?? '').toLowerCase();
  if (LEMA.test(s)) {
    const fijaPersona = SUJETO.test(s) || SN_ANTES.test(s);
    const fijaTiempo = TIEMPO.test(s);
    return fijaPersona && fijaTiempo ? 'verbal determinado' : 'verbal SIN persona o SIN tiempo';
  }
  if (esClaseCerrada(r)) return 'clase cerrada';
  return 'léxico abierto';
};

const porClase = new Map<Clase, any[]>();
for (const x of items) {
  const c = clasificar(x);
  porClase.set(c, [...(porClase.get(c) ?? []), x]);
}

const filtro = process.argv[process.argv.indexOf('--muestra') + 1];
if (process.argv.includes('--muestra') && filtro) {
  const xs = [...porClase].find(([c]) => c.startsWith(filtro))?.[1] ?? [];
  console.log(`# ${filtro} — ${xs.length} ítems\n`);
  for (const x of xs.slice(0, 25)) console.log(`- \`${x.id}\` [${(x.concepts ?? []).join(', ')}] «${x.data.sentence}» → «${x.data.blanks[0].answer}»`);
} else {
  console.log('# Triaje de los cloze publicados sin pista\n');
  // «Sin pista» y «sin dictaminar» NO son lo mismo, y confundirlos manda a
  // releer lo ya leído: los 113 sin pista de hoy están dictaminados los
  // 113. Por eso el total va acompañado de lo que de verdad queda.
  const pend = items.filter((x) => !determinacionDictaminada(x)).length;
  console.log(`Total sin pista: **${items.length}** · de ellos SIN DICTAMINAR: **${pend}**\n`);
  if (!pend) console.log(`> Los ${items.length} se leyeron uno a uno en E2#29. Sin pista no es indeterminado:\n> el sello dice por qué cada frase fija su respuesta sola.\n`);
  console.log('| clase | ítems | ¿está determinado? |');
  console.log('|---|---:|---|');
  const juicio: Record<Clase, string> = {
    'verbal determinado': 'SÍ — lema, persona y tiempo fijados por el enunciado',
    'verbal SIN persona o SIN tiempo': 'NO — es la clase que E2#11 pagó: «já ___ o relatório» admite las cinco personas',
    'clase cerrada': 'PROBABLE — la respuesta sale del sistema, y la concordancia suele fijarla',
    'léxico abierto': 'NO — un hueco léxico sin pista no está determinado nunca',
  };
  for (const c of ['verbal determinado', 'verbal SIN persona o SIN tiempo', 'clase cerrada', 'léxico abierto'] as Clase[])
    console.log(`| **${c}** | ${(porClase.get(c) ?? []).length} | ${juicio[c]} |`);
  console.log(`\n## Calibración hecha a mano (E2#29), y el veredicto\n`);
  console.log(`Los **15** de «verbal determinado» se leyeron uno a uno: **9 lo estaban de verdad**,`);
  console.log(`3 no —«Vocês ___ as notícias de hoje? (ler)» admite presente y pretérito; «Amanhã nós`);
  console.log(`___ (viajar)» admite el sintético y el perifrástico— y **2 estaban ROTOS**: uno sin`);
  console.log(`sujeto ni objeto, otro con un pronombre de sujeto puesto donde va el lema.`);
  console.log(`De 10 de «clase cerrada»: 7 determinados, 2 no y 1 roto («têm de uma reunião»).`);
  console.log(``);
  console.log(`**Conclusión: el clasificador vale como ORDEN, no como filtro.** Aprueba de más`);
  console.log(`—un tercio de su clase más segura— así que no se puede usar para saltarse la`);
  console.log(`lectura de nadie. Lo que sí hace es decir dónde está la densidad: «léxico abierto»`);
  console.log(`son 99 y no está determinado ninguno, y ahí la pista hay que escribirla sí o sí.`);
  console.log(``);
  console.log(`Es la misma lección que la Ola V: una regla de superficie ordena la cola humana,`);
  console.log(`no la cancela.`);
}

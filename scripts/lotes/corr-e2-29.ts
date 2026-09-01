// scripts/lotes/corr-e2-29.ts
//
//   npx tsx scripts/lotes/corr-e2-29.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-e2-29.ts --json     # ítems para publicar
//
// E2#29 · 10 unidades de corrección, y **diez y no veintidós a propósito**.
//
// El plan daba cuatro puntos de corrección pidiendo ≥5: `b2-indef-todo-tudo`
// (6), `b2-indef-algum-nenhum` (6), `b2-artigos` (5) y `b2-poss-formas` (5).
// Al diseñarlos, sólo los dos primeros tienen calco español defendible, y
// ni siquiera enteros:
//
//   · **todo/tudo** es de los mejores calcos del idioma: el español tiene
//     UNA palabra donde el portugués tiene dos, así que el error sale solo.
//     Seis ítems, sin forzar ninguno.
//   · **algum/nenhum** sólo diverge en cuatro sitios —la «a» personal, que
//     el portugués no tiene, y «algo (de)» frente a «alguma coisa»/«algum»—.
//     Los demás usos coinciden con el español, así que un ítem de
//     corrección ahí mediría traducción y no portugués. Cuatro y no seis.
//   · **b2-artigos** y **b2-poss-formas** NO se escriben. Sus divergencias
//     reales —el artículo con el posesivo, con el nombre propio, la crase—
//     ya viven en sus propios sub-puntos, y lo que les queda de propio
//     coincide con el español. Escribir diez correcciones ahí sería
//     inventar el error que el ítem enseña a corregir, que es exactamente
//     la condición 1 del formato. Van por lectura dirigida, que para eso
//     tienen ítems viejos.
//
// Es el mismo dictamen que se le hizo a `b3-exist-ter-br` en E2#21: el
// formato no sirve para todo punto sólo porque el mapa se lo asigne.
import { verificar, preflight, type ItemCorreccion } from '../lib/correccion';

const TUD = 'b2-indef-todo-tudo';
const ALG = 'b2-indef-algum-nenhum';

export const ITEMS: ItemCorreccion[] = [
  // ══ b2-indef-todo-tudo (6) — «tudo» es el neutro invariable y «todo»
  // el adjetivo que concuerda. El español los tiene fundidos en uno.
  { p: TUD, pasada: 1, espejoEs: false,
    mala: 'Todo o que ele disse é verdade.', buena: 'Tudo o que ele disse é verdade.',
    calcoEs: 'Todo lo que dijo es verdad.',
    explicacion: 'Delante de «o que» va el neutro invariable «tudo». «Todo» es adjetivo y necesita un sustantivo con el que concordar.',
    varianteEsperada: 'una sola palabra en español, dos en portugués' },
  { p: TUD, pasada: 1, espejoEs: false,
    mala: 'Ele sabe todo sobre carros antigos.', buena: 'Ele sabe tudo sobre carros antigos.',
    calcoEs: 'Sabe todo sobre coches antiguos.',
    explicacion: 'Sin sustantivo al que acompañar, la forma es «tudo».',
    varianteEsperada: 'una sola palabra en español, dos en portugués' },
  { p: TUD, pasada: 1, espejoEs: false,
    mala: 'Isso é todo o que tenho para te dar.', buena: 'Isso é tudo o que tenho para te dar.',
    calcoEs: 'Eso es todo lo que tengo para darte.',
    explicacion: 'Otra vez el neutro delante de «o que»: «tudo o que».',
    varianteEsperada: 'una sola palabra en español, dos en portugués' },
  { p: TUD, pasada: 1, espejoEs: false,
    mala: 'Tudo o mundo sabe disso há meses.', buena: 'Toda a gente sabe disso há meses.',
    calcoEs: 'Todo el mundo lo sabe desde hace meses.',
    explicacion: 'El español «todo el mundo» no se traduce palabra por palabra: el portugués dice «toda a gente», con el adjetivo concordando en femenino.',
    varianteEsperada: 'locución calcada palabra por palabra' },
  { p: TUD, pasada: 1, espejoEs: false,
    mala: 'Ela trabalhou tudo o dia sem parar.', buena: 'Ela trabalhou todo o dia sem parar.',
    calcoEs: 'Trabajó todo el día sin parar.',
    explicacion: 'Aquí es al revés: hay sustantivo —«o dia»—, así que toca el adjetivo «todo», que concuerda. Quien aprende la regla del neutro suele pasarse de frenada y ponerlo también donde no va.',
    varianteEsperada: 'hipercorrección del neutro' },
  { p: TUD, pasada: 1, espejoEs: false,
    mala: 'Comi todo e ainda tenho fome.', buena: 'Comi tudo e ainda tenho fome.',
    calcoEs: 'Me lo comí todo y todavía tengo hambre.',
    explicacion: 'Sin sustantivo, «tudo». Y nótese que el portugués no necesita el «lo» del español: «comi tudo», no «comi-o tudo».',
    varianteEsperada: 'una sola palabra en español, dos en portugués' },

  // ══ b2-indef-algum-nenhum (4) — sólo los cuatro sitios donde el
  // portugués y el español de verdad divergen.
  { p: ALG, pasada: 1, espejoEs: false,
    mala: 'Não vi a ninguém no corredor.', buena: 'Não vi ninguém no corredor.',
    calcoEs: 'No vi a nadie en el pasillo.',
    explicacion: 'El portugués no tiene la «a» personal del español. El complemento directo de persona va desnudo: «não vi ninguém».',
    varianteEsperada: '«a» personal calcada del español' },
  { p: ALG, pasada: 1, espejoEs: false,
    mala: 'Conheces a alguém nesta empresa?', buena: 'Conheces alguém nesta empresa?',
    calcoEs: '¿Conoces a alguien en esta empresa?',
    explicacion: 'Lo mismo en positivo: «conheces alguém», sin preposición. Es de las marcas que más rápido delatan al hispanohablante.',
    varianteEsperada: '«a» personal calcada del español' },
  { p: ALG, pasada: 1, espejoEs: false,
    mala: 'Tenho algo de dinheiro guardado para isso.', buena: 'Tenho algum dinheiro guardado para isso.',
    calcoEs: 'Tengo algo de dinero guardado para eso.',
    explicacion: 'El español «algo de + sustantivo» se dice en portugués con el indefinido: «algum dinheiro». «Algo de» existe pero significa otra cosa.',
    varianteEsperada: 'locución calcada del español' },
  { p: ALG, pasada: 1, espejoEs: false,
    mala: 'Queres algo para beber antes de sair?', buena: 'Queres alguma coisa para beber antes de sair?',
    calcoEs: '¿Quieres algo para beber antes de salir?',
    explicacion: 'En la lengua corriente el portugués dice «alguma coisa» donde el español dice «algo». «Algo» a secas existe, pero es de registro escrito y suena raro en una pregunta así.',
    varianteEsperada: 'registro escrito donde toca el corriente' },
];

if (process.argv[1]?.includes('corr-e2-29')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección E2#29 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log(`\n## Preflight\n`);
  for (const l of preflight(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

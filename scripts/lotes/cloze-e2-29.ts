// scripts/lotes/cloze-e2-29.ts
//
//   npx tsx scripts/lotes/cloze-e2-29.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-29.ts --asigna   # dónde cae cada uno
//   npx tsx scripts/lotes/cloze-e2-29.ts --json     # ítems para publicar
//
// E2#29 · 20 unidades, y son EXACTAMENTE las que el plan manda escribir:
// los nueve puntos de vía «producir» —que no tienen ni un ítem viejo que
// leer— y la mitad de producción de los cinco «mixtos». Ni una de relleno.
// El déficit de cloze son 51 unidades en 31 puntos; las otras 31 salen de
// leer ítems viejos, que sale más barato que escribirlos.
//
// Dimensionado contra el déficit recalculado HOY, después de que la
// lectura de los 60 sellara 80 ítems y lo bajara de 136 a 121. Medir
// contra el número de la pasada anterior es de donde salió el falso
// «hueco 92→62» de E2#27.
//
// LA PISTA NOMBRA EL TIEMPO, siempre. No es estilo: la lectura de los 60
// acaba de encontrar que la familia más numerosa de cloze indeterminados
// es «el lema está en el molde y nada fija el tiempo» —«Eu ___ (trazer)
// documentos para a reunião» admite «trago» y «trouxe» igual de bien—, y
// la única cura barata es decir de qué tiempo se habla. El gate del
// generador ya lo exige; aquí se cumple por convicción, no por obligación.
//
// Y como la pista nombra el tiempo, `barrido-tiempo-declarado.ts` puede
// comprobar que la respuesta lo tiene de verdad: escribir la pista bien
// convierte cada ítem en una afirmación verificable a máquina.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';
import { contarPuntos } from '../lib/conceptos-finos';

export const ITEMS: Cloze[] = [
  // ══ b8-sub-adverbiais-tempo (3) · vía PRODUCIR ════════════════════
  //
  // El punto europeo por excelencia, y una TRAMPA para el hispanohablante:
  // donde el español pone presente de subjuntivo —«cuando llegues»—, el
  // portugués tiene un tiempo que el español perdió, el futuro do
  // conjuntivo. El calco «quando chegues» es agramatical.
  { p: 'b8-sub-adverbiais-tempo', pasada: 1, lema: 'chegar', t: 'futSubj', per: 'tu',
    s: 'Assim que ___ (chegar) a casa, telefono-te.',
    pista: 'futuro do conjuntivo, 2.ª persona — el tiempo que el español perdió y que aquí NO es presente de subjuntivo',
    ancla: 'telefono-te' },
  { p: 'b8-sub-adverbiais-tempo', pasada: 1, lema: 'ter', t: 'futSubj', per: 'tu',
    s: 'Quando ___ (ter) um bocadinho, passa por cá.',
    pista: 'futuro do conjuntivo de «ter», 2.ª persona — irregular, sobre el radical del pretérito',
    ancla: 'passa por cá' },
  { p: 'b8-sub-adverbiais-tempo', pasada: 1, lema: 'saber', t: 'futSubj', per: 'tu',
    s: 'Enquanto não ___ (saber) a resposta, não digas nada a ninguém.',
    pista: 'futuro do conjuntivo de «saber», 2.ª persona — irregular, sobre el radical del pretérito',
    ancla: 'não digas nada a ninguém' },

  // ══ b5-cond-hipotetico (2) · vía PRODUCIR ═════════════════════════
  //
  // La apódosis. El ancla es siempre la prótasis en imperfeito do
  // conjuntivo, que es lo que excluye el futuro y el presente.
  { p: 'b5-cond-hipotetico', pasada: 1, lema: 'aprender', t: 'condicional', per: 'eu',
    s: 'Se eu tivesse mais tempo livre, ___ (aprender) a tocar piano.',
    pista: 'condicional simple, 1.ª persona — la consecuencia de una condición que no se cumple',
    ancla: 'Se eu tivesse mais tempo livre' },
  { p: 'b5-cond-hipotetico', pasada: 1, lema: 'dizer', t: 'condicional', per: 'tu',
    s: 'Se soubesses toda a verdade, não ___ (dizer) uma coisa dessas.',
    pista: 'condicional simple de «dizer», 2.ª persona — radical contraído, como en el futuro',
    ancla: 'Se soubesses toda a verdade' },

  // ══ b6-pres-subj-irregulares (2) · vía PRODUCIR ═══════════════════
  { p: 'b6-pres-subj-irregulares', pasada: 1, lema: 'saber', t: 'presSubj', per: 'ele',
    s: 'Duvido que ela ___ (saber) a resposta a essa pergunta.',
    pista: 'presente do conjuntivo de «saber», 3.ª persona — irregular, no sale del presente de indicativo',
    ancla: 'Duvido que ela' },
  { p: 'b6-pres-subj-irregulares', pasada: 1, lema: 'ir', t: 'presSubj', per: 'tu',
    s: 'É melhor que tu ___ (ir) já para casa, que está a ficar tarde.',
    pista: 'presente do conjuntivo de «ir», 2.ª persona — irregular y acentuado',
    ancla: 'É melhor que tu' },

  // ══ b7-part-passiva (2) · vía PRODUCIR ════════════════════════════
  //
  // Respuesta DECLARADA: son dos palabras y el paradigma conjuga una sola.
  // Lo que el punto enseña es la CONCORDANCIA del participio con el
  // sujeto, así que el ancla es el sujeto y la pista lo nombra.
  { p: 'b7-part-passiva', pasada: 1, r: 'foram enviadas',
    s: 'As cartas ___ (enviar) na semana passada pelo correio azul.',
    pista: 'voz pasiva en pretérito: el auxiliar «ser» conjugado más el participio, que concuerda con «as cartas»',
    ancla: 'pelo correio azul' },
  { p: 'b7-part-passiva', pasada: 1, r: 'foi construída',
    s: 'A ponte ___ (construir) no século XIX por um engenheiro francês.',
    pista: 'voz pasiva en pretérito, singular: el auxiliar «ser» más el participio concordando con «a ponte»',
    ancla: 'por um engenheiro francês' },

  // ══ b1-nasal-n-interior (1) · vía PRODUCIR ════════════════════════
  //
  // La glosa española DELETREARÍA («invierno» ≈ «inverno»), así que se
  // describe la cosa en vez de traducirla. Es la tercera vez esta ola que
  // el parecido entre las dos lenguas convierte la pista en la respuesta.
  { p: 'b1-nasal-n-interior', pasada: 1, r: 'inverno',
    s: 'Em Lisboa, o ___ é chuvoso mas raramente traz neve.',
    pista: 'la estación de los días cortos y el frío; su primera vocal va nasalizada por la consonante que la sigue',
    ancla: 'raramente traz neve' },

  // ══ b3-pres-alternancia (1) · vía PRODUCIR ════════════════════════
  { p: 'b3-pres-alternancia', pasada: 1, lema: 'dormir', t: 'presente', per: 'eu',
    s: 'Eu ___ (dormir) sempre oito horas por noite, mesmo ao fim de semana.',
    pista: 'presente, 1.ª persona — la vocal del radical cambia SÓLO en esta persona',
    ancla: 'sempre oito horas por noite' },

  // ══ b4-contr-narrativa (1) · vía PRODUCIR ═════════════════════════
  //
  // Fondo e suceso en la misma frase: el ancla es el suceso en pretérito,
  // que es justo lo que obliga al fondo a ir en imperfeito.
  { p: 'b4-contr-narrativa', pasada: 1, lema: 'ler', t: 'imperfeito', per: 'eu',
    s: 'Enquanto eu ___ (ler) o jornal, o telefone tocou três vezes.',
    pista: 'imperfeito, 1.ª persona — el fondo que ya estaba pasando cuando ocurrió el suceso',
    ancla: 'o telefone tocou três vezes' },

  // ══ b8-indireto-deicticos (1) · vía PRODUCIR ══════════════════════
  { p: 'b8-indireto-deicticos', pasada: 1, r: 'nesse',
    s: '«Vou-me embora hoje», disse ela. → Ela disse que se ia embora ___ dia.',
    pista: 'el «hoy» del original, trasladado al relato: preposición «em» fundida con el demostrativo de segundo grado',
    ancla: 'disse ela' },

  // ══ b8-indireto-interrogativa (1) · vía PRODUCIR ══════════════════
  { p: 'b8-indireto-interrogativa', pasada: 1, r: 'se',
    s: '«Queres vir connosco?», perguntou ele. → Ele perguntou ___ eu queria ir com eles.',
    pista: 'la conjunción que introduce una pregunta indirecta cerrada, la que admite por respuesta sólo sí o no',
    ancla: 'perguntou ele' },

  // ══ b3-pres-er (2) · mitad de producción de la vía MIXTA ══════════
  //
  // «vivemos» es la misma forma en presente y en pretérito, así que la
  // ambigüedad de tiempo que hundió a media docena de cloze viejos aquí
  // no cambia la cadena. Aun así la pista dice el tiempo: el alumno tiene
  // que saber cuál está practicando.
  { p: 'b3-pres-er', pasada: 1, lema: 'viver', t: 'presente', per: 'nós',
    s: 'Nós ___ (viver) num apartamento pequeno mesmo ao pé do rio.',
    pista: 'presente, 1.ª del plural — la forma en «-emos» de los verbos en -er',
    ancla: 'num apartamento pequeno mesmo ao pé do rio' },
  { p: 'b3-pres-er', pasada: 1, lema: 'escrever', t: 'presente', per: 'tu',
    s: 'Tu ___ (escrever) muito bem para a idade que tens.',
    pista: 'presente, 2.ª persona — la forma en «-es» de los verbos en -er',
    ancla: 'para a idade que tens' },

  // ══ b3-pres-irr-ser-estar (1) · mitad de producción ═══════════════
  { p: 'b3-pres-irr-ser-estar', pasada: 1, lema: 'estar', t: 'presente', per: 'eu',
    s: 'Hoje eu ___ (estar) muito cansado, mas amanhã já não.',
    pista: 'presente, 1.ª persona — el verbo del estado pasajero, no el de la cualidad',
    ancla: 'mas amanhã já não' },

  // ══ b5-cond-cortesia (1) · mitad de producción ════════════════════
  //
  // La forma es la misma para «eu» y para «ele», así que la persona no
  // hace falta fijarla: la cadena no cambia.
  { p: 'b5-cond-cortesia', pasada: 1, lema: 'poder', t: 'condicional', per: 'ele',
    s: 'Desculpe, ___ (poder) dizer-me as horas, por favor?',
    pista: 'condicional simple — la forma de cortesía para pedir algo a un desconocido',
    ancla: 'por favor?' },

  // ══ b6-contr-emocao (1) · mitad de producción ═════════════════════
  { p: 'b6-contr-emocao', pasada: 1, lema: 'poder', t: 'presSubj', per: 'eles',
    s: 'Lamento que vocês não ___ (poder) vir à festa de sábado.',
    pista: 'presente do conjuntivo, 3.ª del plural — los verbos de emoción lo exigen en la subordinada',
    ancla: 'Lamento que vocês não' },

  // ══ b8-con-consequencia (1) · mitad de producción ═════════════════
  { p: 'b8-con-consequencia', pasada: 1, r: 'por isso',
    s: 'Choveu toda a noite sem parar; ___ o jogo de domingo foi adiado.',
    pista: 'el conector de consecuencia formado por una preposición y un demostrativo neutro',
    ancla: 'o jogo de domingo foi adiado' },
];

if (process.argv[1]?.includes('cloze-e2-29')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  if (process.argv.includes('--asigna')) {
    // Dónde cae cada ítem DE VERDAD, no dónde digo yo que cae. El mapa
    // formato↔punto ha mandado ítems a otro punto más de una vez.
    const falsos = ITEMS.map((x, i) => ({
      id: `draft-${i}`, type: 'fill_blank', concepts: [x.p],
      data: { sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, blanks: [{ position: 0, answer: respuestaDe(x) ?? '' }] },
    }));
    const { cuenta } = contarPuntos(falsos, { incluirCuarentena: true });
    const decl = new Map<string, number>();
    for (const x of ITEMS) decl.set(x.p, (decl.get(x.p) ?? 0) + 1);
    console.log('| punto declarado | escritos | cuentan ahí |');
    console.log('|---|---:|---:|');
    for (const [p, n] of decl) console.log(`| \`${p}\` | ${n} | ${cuenta.get(p) ?? 0} |`);
    const fuera = [...cuenta].filter(([k]) => !decl.has(k));
    console.log(fuera.length ? `\n**Se van a otro punto:** ${fuera.map(([k, m]) => `${k} ${m}`).join(', ')}` : '\nNinguno se desvía.');
  } else {
    const porPunto = new Map<string, number>();
    for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
    console.log(`# Cloze E2#29 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
    console.log('| punto | ítems | respuesta |'); console.log('|---|---:|---|');
    for (const [p, n] of porPunto)
      console.log(`| \`${p}\` | ${n} | ${ITEMS.filter((x) => x.p === p).map((x) => respuestaDe(x)).join(', ')} |`);
    console.log('\n## Gates\n');
    if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
    console.log('Limpio.');
  }
}

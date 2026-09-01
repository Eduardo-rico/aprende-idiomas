// scripts/lotes/trans-e2-20.ts
//
//   npx tsx scripts/lotes/trans-e2-20.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-e2-20.ts --json     # ítems para publicar
//
// ÚLTIMO LOTE DE TRANSFORMACIÓN. 24 unidades, seis puntos, y con esto la
// línea queda en cero.
//
// Los seis pasaron la prueba de divergencia antes de escribirse, que es
// la condición que se puso al enterrar `b11-nominalizacao`. El que más
// costó y el que más enseña es `b11-ordem-foco`: parece espejo —el
// español también antepone para focalizar, «El libro lo compré yo»— pero
// tiene una divergencia dura que el español no puede imitar. **Anteponer
// un constituyente focalizado FUERZA LA PRÓCLISE**: «Disse-me o João» →
// «Só o João me disse», nunca «*Só o João disse-me». En español el
// clítico ya está delante y no hay nada que mover, así que la operación
// no se puede traducir de vuelta.
import { verificar, respuestaDe, informeEspejo, type ItemTrans } from '../lib/transformacion';

export const ITEMS: ItemTrans[] = [
  // ══ b11-ordem-foco (8) — anteponer el foco y mover el clítico.
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'Só o João me disse isso.',
    s: 'O João disse-me isso.',
    instruccion: 'Antepón un «só» al sujeto para focalizarlo y reescribe la frase entera. Fíjate en que el pronombre no puede quedarse donde estaba.',
    hint: 'un elemento focalizado delante atrae el pronombre al verbo' },
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'Também eles nos avisaram.',
    s: 'Eles avisaram-nos também.',
    instruccion: 'Pon el «também» al principio, focalizando, y reescribe la frase entera con el pronombre donde le toque.',
    hint: 'el adverbio antepuesto atrae el pronombre' },
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'Nunca lhe pediram nada.',
    s: 'Pediram-lhe alguma coisa uma vez.',
    instruccion: 'Reescribe la frase en negativo con «nunca» al principio, cambiando «alguma coisa» por «nada» y colocando el pronombre donde corresponda.',
    hint: 'la negación antepuesta también atrae el pronombre' },
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'Talvez o encontres na biblioteca.',
    s: 'Encontra-lo na biblioteca, talvez.',
    instruccion: 'Pon el «talvez» al principio y reescribe la frase entera: con el pronombre donde le corresponda y con el verbo en el modo que «talvez» exige.',
    hint: '«talvez» delante atrae el pronombre igual que la negación' },
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'Foi o Pedro que me telefonou.',
    s: 'O Pedro telefonou-me.',
    instruccion: 'Focaliza el sujeto con una construcción de relieve del tipo «foi … que» y reescribe la frase entera.',
    hint: 'la construcción de relieve deja el pronombre delante del verbo' },
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'É a esta hora que te lembras de mim?',
    s: 'Lembras-te de mim a esta hora?',
    instruccion: 'Focaliza el complemento de tiempo con «é … que» y reescribe la pregunta entera.',
    hint: 'el relieve arrastra el pronombre delante' },
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'Poucas vezes se viu coisa assim.',
    s: 'Viu-se coisa assim poucas vezes.',
    instruccion: 'Pon la expresión de frecuencia al principio y reescribe la frase entera con el pronombre donde le toque.',
    hint: 'una expresión cuantificadora antepuesta también atrae' },
  { p: 'b11-ordem-foco', pasada: 1, espejoEs: false, r: 'Ao gerente é que se deve pedir isso.',
    s: 'Deve pedir-se isso ao gerente.',
    instruccion: 'Antepón el complemento con «é que» para focalizarlo y reescribe la frase entera.',
    hint: 'el «é que» de relieve arrastra el pronombre' },

  // ══ b12-derivacao-produtiva (6) — crear la palabra con el sufijo vivo.
  // No son espejo: donde el español elige otro sufijo o directamente una
  // perífrasis, el portugués deriva.
  { p: 'b12-derivacao-produtiva', pasada: 1, espejoEs: false, r: 'a lavagem',
    s: 'lavar',
    instruccion: 'Forma el nombre de acción con el sufijo -agem, y ponle el artículo. El español aquí elige otro sufijo.',
    hint: 'femenino' },
  { p: 'b12-derivacao-produtiva', pasada: 1, espejoEs: false, r: 'a chatice',
    s: 'chato',
    instruccion: 'Forma el nombre abstracto con el sufijo -ice, y ponle el artículo. El español no tiene un derivado equivalente.',
    hint: 'femenino' },
  // El español hace exactamente lo mismo («rápido → rapidez»), así que va
  // declarado como espejo. Uno de seis es holgura, no un problema.
  { p: 'b12-derivacao-produtiva', pasada: 1, espejoEs: true, r: 'a rapidez',
    s: 'rápido',
    instruccion: 'Forma el nombre abstracto con el sufijo -ez, y ponle el artículo.',
    hint: 'femenino' },
  { p: 'b12-derivacao-produtiva', pasada: 1, espejoEs: false, r: 'uma dentada',
    s: 'dente',
    instruccion: 'Forma con el sufijo -ada el nombre del golpe dado con eso, y ponle el artículo indefinido.',
    hint: 'el sufijo del golpe: femenino' },
  { p: 'b12-derivacao-produtiva', pasada: 1, espejoEs: false, r: 'o pagamento',
    s: 'pagar',
    instruccion: 'Forma el nombre de acción con el sufijo -mento, y ponle el artículo.',
    hint: 'masculino' },
  { p: 'b12-derivacao-produtiva', pasada: 1, espejoEs: false, r: 'a arrumação',
    s: 'arrumar',
    instruccion: 'Forma el nombre de acción con el sufijo -ção, y ponle el artículo. El español resuelve esto con un verbo, no con un nombre.',
    hint: 'femenino' },

  // ══ b7-gerundio-aspectual (3) — la perífrasis europea que el español
  // no tiene: «estar a + infinitivo» donde el español pone gerundio.
  { p: 'b7-gerundio-aspectual', pasada: 1, espejoEs: false, r: 'Está a chover desde manhã.',
    s: 'Chove desde manhã.',
    instruccion: 'Reescríbelo con la perífrasis progresiva europea, la que no usa gerundio.',
    hint: 'estar + preposición + infinitivo' },
  { p: 'b7-gerundio-aspectual', pasada: 1, espejoEs: false, r: 'Andam a preparar a mudança.',
    s: 'Preparam a mudança há semanas.',
    instruccion: 'Reescríbelo con la perífrasis de «andar» que expresa acción prolongada y repetida, y quita el complemento de tiempo.',
    hint: 'andar + preposición + infinitivo' },
  { p: 'b7-gerundio-aspectual', pasada: 1, espejoEs: false, r: 'Ficou a olhar para a porta.',
    s: 'Olhou para a porta muito tempo.',
    instruccion: 'Reescríbelo con la perífrasis de «ficar» que expresa permanencia en la acción, y quita el complemento de tiempo.',
    hint: 'ficar + preposición + infinitivo' },

  // ══ b7-part-duplos (3) — el participio doble y su reparto.
  { p: 'b7-part-duplos', pasada: 1, espejoEs: false, r: 'A carta foi aceite pelo tribunal.',
    s: 'O tribunal tinha aceitado a carta.',
    instruccion: 'Pásalo a pasiva con «ser». Ojo al participio: con «ser» este verbo pide el otro, el corto.',
    hint: 'con ter/haver va el largo; con ser/estar, el corto' },
  { p: 'b7-part-duplos', pasada: 1, espejoEs: false, r: 'A conta está paga.',
    s: 'Já pagámos a conta.',
    instruccion: 'Reescríbelo con «estar» y el participio que le corresponde, hablando de la cuenta.',
    hint: 'con estar, el participio corto' },
  { p: 'b7-part-duplos', pasada: 1, espejoEs: false, r: 'Tinham entregado os papéis.',
    s: 'Os papéis foram entregues.',
    instruccion: 'Pásalo a activa con «ter», dejando el sujeto sin expresar. Ojo al participio: con «ter» este verbo pide el otro.',
    hint: 'con ter va el largo, aunque con ser vaya el corto' },

  // ══ b5-se-futuro-conj (2) y b6-fut-subj-se (2) — «se» + futuro do
  // conjuntivo. Se separan por estructura: el primero condiciona una
  // acción futura, el segundo un mandato.
  { p: 'b5-se-futuro-conj', pasada: 1, espejoEs: false,
    s: 'Tu tens tempo. → Se ____ tempo, passamos por lá.',
    instruccion: 'Pon el verbo en el tiempo que el portugués exige tras «se» cuando la condición es posible. Escribe sólo la forma verbal.',
    lema: 'ter', t: 'futSubj', per: 'tu' },
  { p: 'b5-se-futuro-conj', pasada: 1, espejoEs: false,
    s: 'Eles vêm cedo. → Se ____ cedo, ainda apanhamos o filme.',
    instruccion: 'Pon el verbo en el tiempo que el portugués exige tras «se» cuando la condición es posible. Escribe sólo la forma verbal.',
    lema: 'vir', t: 'futSubj', per: 'eles' },
  { p: 'b6-fut-subj-se', pasada: 1, espejoEs: false,
    s: 'Vocês querem. → Se ____, digam-me até sexta.',
    instruccion: 'Pon el verbo en el tiempo que «se» exige aquí. La principal es un mandato. Escribe sólo la forma verbal.',
    lema: 'querer', t: 'futSubj', per: 'eles' },
  { p: 'b6-fut-subj-se', pasada: 1, espejoEs: false,
    s: 'Nós somos precisos. → Se ____ precisos, chamem-nos.',
    instruccion: 'Pon el verbo en el tiempo que «se» exige aquí. La principal es un mandato. Escribe sólo la forma verbal.',
    lema: 'ser', t: 'futSubj', per: 'nós' },
];

if (process.argv[1]?.includes('trans-e2-20')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x, i) => ({ ...x, id: `tr20-${String(i + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, ItemTrans[]>();
  for (const x of ITEMS) { const g = porPunto.get(x.p) ?? []; g.push(x); porPunto.set(x.p, g); }
  console.log(`# Transformación E2#20 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems | respuestas |');
  console.log('|---|---:|---|');
  for (const [p, xs] of porPunto)
    console.log(`| \`${p}\` | ${xs.length} | ${xs.map((x) => respuestaDe(x)).join(' · ')} |`);
  console.log(`\n## Preflight · el atajo de traducción\n`);
  for (const l of informeEspejo(ITEMS)) console.log(l);
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

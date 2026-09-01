// scripts/lotes/cloze-e2-27b.ts
//
//   npx tsx scripts/lotes/cloze-e2-27b.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-27b.ts --json     # ítems para publicar
//
// E2#27 · segunda pasada de producción, 32 unidades sobre seis puntos
// HOJA: cinco de ortografía y fonología de b1 y el pronombre
// preposicional de b3.
//
// Todas con respuesta DECLARADA: aquí no hay paradigma verbal que
// derivar, y el gate ya avisó en la pasada anterior de que un conjugador
// que adivina consagra formas falsas. La pista da la palabra española y
// la REGLA de correspondencia, que es lo que el punto enseña — no la
// forma portuguesa.
//
// Con una excepción que el gate cazó: cuando el español y el portugués
// COINCIDEN («de ti», «contigo»), la glosa española ES la respuesta y la
// pista deja de ser pista. Ahí se nombra la regla —«la forma
// preposicional de tu»— en vez de traducir.
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b1-corresp-nh-ny (6) — la ñ española es «nh» en portugués.
  { p: 'b1-corresp-nh-ny', pasada: 1, r: 'senhor',
    s: 'Bom dia, ___! Em que posso ajudar?', pista: 'señor — la ñ española se escribe «nh»', ancla: 'Em que posso ajudar' },
  { p: 'b1-corresp-nh-ny', pasada: 1, r: 'manhã',
    s: 'Levanto-me sempre cedo de ___.', pista: 'mañana (la parte del día) — ñ → nh, y la nasal final lleva til', ancla: 'Levanto-me sempre cedo' },
  { p: 'b1-corresp-nh-ny', pasada: 1, r: 'montanha',
    s: 'Passámos o fim de semana na ___, longe de tudo.', pista: 'montaña — ñ → nh', ancla: 'longe de tudo' },
  { p: 'b1-corresp-nh-ny', pasada: 1, r: 'sonho',
    s: 'Tive um ___ muito estranho esta noite.', pista: 'sueño — ñ → nh', ancla: 'muito estranho esta noite' },
  { p: 'b1-corresp-nh-ny', pasada: 1, r: 'banho',
    s: 'Vou tomar ___ antes de sairmos.', pista: 'baño — ñ → nh', ancla: 'antes de sairmos' },
  { p: 'b1-corresp-nh-ny', pasada: 1, r: 'castanhas',
    s: 'Comprámos ___ assadas na feira de novembro.', pista: 'castañas — ñ → nh, en plural', ancla: 'na feira de novembro' },

  // ══ b1-nasal-ao-oes (6) — el plural de -ão que acaba en -ões, no en
  // -ãos. Es la clase más numerosa y la que el español no anticipa.
  { p: 'b1-nasal-ao-oes', pasada: 1, r: 'razões',
    s: 'Ela deu-me duas ___ para não ir à festa.', pista: 'razones — el plural de «razão», que no es -ãos', ancla: 'para não ir à festa' },
  { p: 'b1-nasal-ao-oes', pasada: 1, r: 'canções',
    s: 'Ouvimos várias ___ portuguesas no concerto.', pista: 'canciones — el plural de «canção»', ancla: 'portuguesas no concerto' },
  { p: 'b1-nasal-ao-oes', pasada: 1, r: 'opções',
    s: 'O menu tem poucas ___ vegetarianas.', pista: 'opciones — el plural de «opção»', ancla: 'vegetarianas' },
  { p: 'b1-nasal-ao-oes', pasada: 1, r: 'condições',
    s: 'As ___ do contrato mudaram sem aviso nenhum.', pista: 'condiciones — el plural de «condição»', ancla: 'sem aviso nenhum' },
  { p: 'b1-nasal-ao-oes', pasada: 1, r: 'refeições',
    s: 'Faço três ___ por dia, sem falhar nenhuma.', pista: 'comidas (las del día) — el plural de «refeição»', ancla: 'sem falhar nenhuma' },
  { p: 'b1-nasal-ao-oes', pasada: 1, r: 'estações',
    s: 'O comboio pára em todas as ___ até ao Porto.', pista: 'estaciones — el plural de «estação»', ancla: 'até ao Porto' },

  // ══ b1-acento-cedilha (5) — la cedilla ante a, o, u. Nunca ante e ni
  // i, donde la «c» sola ya suena /s/.
  { p: 'b1-acento-cedilha', pasada: 1, r: 'açúcar',
    s: 'Pões ___ no café ou bebe-lo amargo?', pista: 'azúcar — lleva cedilla, porque va ante «ú»', ancla: 'ou bebe-lo amargo' },
  { p: 'b1-acento-cedilha', pasada: 1, r: 'praça',
    s: 'Combinámos encontrar-nos na ___ do Comércio.', pista: 'plaza — cedilla ante «a»', ancla: 'do Comércio' },
  { p: 'b1-acento-cedilha', pasada: 1, r: 'almoço',
    s: 'O ___ é às onze e meia, que depois há reunião.', pista: 'la comida del mediodía — cedilla ante «o»', ancla: 'que depois há reunião' },
  { p: 'b1-acento-cedilha', pasada: 1, r: 'cabeça',
    s: 'Dói-me a ___ desde ontem à tarde.', pista: 'cabeza — cedilla ante «a»', ancla: 'desde ontem à tarde' },
  { p: 'b1-acento-cedilha', pasada: 1, r: 'força',
    s: 'Não tenho ___ nenhuma para acabar isto hoje.', pista: 'fuerza — cedilla ante «a»', ancla: 'para acabar isto hoje' },

  // ══ b1-nasal-m-final (5) — la nasal de final de palabra se escribe con
  // «m», nunca con «n».
  { p: 'b1-nasal-m-final', pasada: 1, r: 'bem',
    s: 'Ele fala ___ português para quem só estudou um ano.', pista: 'bien — la nasal final se escribe con «m»', ancla: 'para quem só estudou um ano' },
  { p: 'b1-nasal-m-final', pasada: 1, r: 'também',
    s: 'Vieram ___ os teus primos de Coimbra?', pista: 'también — nasal final con «m», y con acento en la última', ancla: 'os teus primos de Coimbra' },
  { p: 'b1-nasal-m-final', pasada: 1, r: 'alguém',
    s: '___ me telefonou enquanto eu estava fora.', pista: 'alguien — nasal final con «m», con acento en la última', ancla: 'enquanto eu estava fora' },
  { p: 'b1-nasal-m-final', pasada: 1, r: 'ontem',
    s: '___ à noite não saímos de casa por causa da chuva.', pista: 'ayer — nasal final con «m»', ancla: 'por causa da chuva' },
  { p: 'b1-nasal-m-final', pasada: 1, r: 'homem',
    s: 'Aquele ___ trabalha na farmácia da esquina.', pista: 'hombre — nasal final con «m»', ancla: 'na farmácia da esquina' },

  // ══ b1-corresp-on-ao (5) — la terminación española -ón sale en -ão.
  { p: 'b1-corresp-on-ao', pasada: 1, r: 'coração',
    s: 'O ___ bate-me depressa quando subo as escadas.', pista: 'corazón — la terminación española -ón da «-ão»', ancla: 'quando subo as escadas' },
  { p: 'b1-corresp-on-ao', pasada: 1, r: 'solução',
    s: 'Ainda não encontrámos uma ___ para o problema.', pista: 'solución — -ón da «-ão»', ancla: 'para o problema' },
  { p: 'b1-corresp-on-ao', pasada: 1, r: 'informação',
    s: 'Pedi uma ___ no balcão e ninguém me soube responder.', pista: 'información — -ón da «-ão»', ancla: 'e ninguém me soube responder' },
  { p: 'b1-corresp-on-ao', pasada: 1, r: 'televisão',
    s: 'À noite quase não vemos ___ lá em casa.', pista: 'televisión — -ón da «-ão»', ancla: 'lá em casa' },
  { p: 'b1-corresp-on-ao', pasada: 1, r: 'atenção',
    s: 'Presta ___ ao que ele disser na reunião.', pista: 'atención — -ón da «-ão»', ancla: 'ao que ele disser na reunião' },

  // ══ b3-pron-preposicionado (5) — la forma que va detrás de preposición
  // no es la de sujeto, y con «com» se funde en una sola palabra.
  { p: 'b3-pron-preposicionado', pasada: 1, r: 'mim',
    s: 'Este presente é para ___, não para o teu irmão.', pista: 'a mí — la forma que va detrás de preposición, que no es «eu»', ancla: 'não para o teu irmão' },
  { p: 'b3-pron-preposicionado', pasada: 1, r: 'comigo',
    s: 'Queres vir ___ ao cinema logo à noite?', pista: 'conmigo — «com» + el pronombre, fundidos en una sola palabra', ancla: 'ao cinema logo à noite' },
  { p: 'b3-pron-preposicionado', pasada: 1, r: 'ti',
    s: 'Ele falou de ___ durante todo o jantar.', pista: 'la forma preposicional de «tu», la que va detrás de «de», «para» o «sem»', ancla: 'durante todo o jantar' },
  { p: 'b3-pron-preposicionado', pasada: 1, r: 'convosco',
    s: 'Vamos ___ à praia, se ainda houver lugar no carro.', pista: 'con vosotros — «com» + el pronombre, en una sola palabra', ancla: 'se ainda houver lugar no carro' },
  { p: 'b3-pron-preposicionado', pasada: 1, r: 'contigo',
    s: 'Ela disse que contava ___ para a mudança.', pista: '«com» + la forma preposicional de «tu», fundidos en una sola palabra', ancla: 'para a mudança' },
];

if (process.argv[1]?.includes('cloze-e2-27b')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, r: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Cloze E2#27b — ${ITEMS.length} ítems · ${porPunto.size} puntos HOJA\n`);
  console.log('| punto | ítems |'); console.log('|---|---:|');
  for (const [p, n] of porPunto) console.log(`| \`${p}\` | ${n} |`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

// scripts/lotes/cloze-e2-15.ts
//
//   npx tsx scripts/lotes/cloze-e2-15.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-15.ts --json     # ítems para publicar
//   npx tsx scripts/lotes/cloze-e2-15.ts --pasada 1 # sólo una pasada
//
// LA LÍNEA DE CLOZE CON PISTA — el formato que produce el 61 % de lo que
// falta y que nunca se había producido, porque hasta E2#14 la tarjeta no
// pintaba la pista y el esquema la tiraba en silencio.
//
// Decisiones de Edu que gobiernan este lote:
//   · piso 8 por punto (C2: 6), no 12;
//   · un solo formato, cloze derivado;
//   · moratoria sobre los juicios de gramaticalidad;
//   · revisión por MUESTREO del 20 % con freno, no doble adversarial.
//
// La respuesta se DERIVA con `conjugar()` siempre que el paradigma la
// cubra, y el gate la recalcula: el autor no puede colar una forma que
// no salga del paradigma. Donde el paradigma no llega —contracciones,
// conectores, regência— se declara y el gate exige que la pista y el
// ancla existan, que es lo único comprobable.
//
// Y la cicatriz que gobierna el formato, de E2#11: **verificar que la
// respuesta es derivable NO verifica que la pregunta la determine.**
// Cada ítem declara su ANCLA, el trozo del contexto que excluye las
// alternativas, y el gate comprueba que esté literalmente en la frase.
import { conjugar, futuro, condicional, imperfeitoConjuntivo, futuroConjuntivo, mqpComposto, infinitivoPessoal, type Persona, type Tiempo } from '../lib/paradigma-pt';

export interface Cloze {
  p: string;            // punto
  pasada: number;
  s: string;            // frase con ___ y la pista entre paréntesis
  pista: string;        // hintEs: la pista que DETERMINA
  ancla: string;        // el trozo que excluye las alternativas
  /** derivada: lema + tiempo + persona; el gate recalcula */
  lema?: string; t?: Tiempo | 'futuro' | 'condicional' | 'imperfSubj' | 'futSubj' | 'mqp' | 'infPess'; per?: Persona;
  /** declarada, donde el paradigma no llega */
  r?: string;
  alt?: string[];
}

export const ITEMS: Cloze[] = [
  // ══ PASADA 1 ══════════════════════════════════════════════════════
  // b3-imper-tu · el imperativo de TU: en los regulares es la 3.ª sg del
  // presente, y los irregulares son una lista corta y cerrada.
  { p: 'b3-imper-tu', pasada: 1, lema: 'falar', t: 'imperativoTu', per: 'tu',
    s: '___ (falar) mais devagar, que não estou a perceber nada.', pista: 'habla — imperativo de tú', ancla: 'que não estou a perceber' },
  { p: 'b3-imper-tu', pasada: 1, lema: 'comer', t: 'imperativoTu', per: 'tu',
    s: '___ (comer) devagar, que ainda temos meia hora.', pista: 'imperativo de tú, de «comer»', ancla: 'que ainda temos meia hora' },
  { p: 'b3-imper-tu', pasada: 1, lema: 'abrir', t: 'imperativoTu', per: 'tu',
    s: '___ (abrir) a janela, se faz favor, que está muito calor aqui.', pista: 'imperativo de tú, de «abrir»', ancla: 'que está muito calor' },
  { p: 'b3-imper-tu', pasada: 1, lema: 'ser', t: 'imperativoTu', per: 'tu',
    s: '___ (ser) paciente com ele, que é o primeiro dia dele.', pista: 'sé — imperativo de tú, irregular', ancla: 'que é o primeiro dia dele' },
  { p: 'b3-imper-tu', pasada: 1, lema: 'fazer', t: 'imperativoTu', per: 'tu',
    s: '___ (fazer) o que te apetecer, mas avisa-me antes de saíres.', pista: 'haz — imperativo de tú, irregular', ancla: 'mas avisa-me antes' },
  { p: 'b3-imper-tu', pasada: 1, lema: 'vir', t: 'imperativoTu', per: 'tu',
    s: '___ (vir) cá um instante, quero mostrar-te uma coisa.', pista: 'ven — imperativo de tú, irregular', ancla: 'quero mostrar-te uma coisa' },
  { p: 'b3-imper-tu', pasada: 1, lema: 'pôr', t: 'imperativoTu', per: 'tu',
    s: '___ (pôr) a mesa enquanto eu acabo o jantar.', pista: 'pon — imperativo de tú, irregular', ancla: 'enquanto eu acabo o jantar' },
  { p: 'b3-imper-tu', pasada: 1, lema: 'ter', t: 'imperativoTu', per: 'tu',
    s: '___ (ter) calma, que ainda falta muito tempo para o comboio.', pista: 'ten — imperativo de tú, irregular', ancla: 'que ainda falta muito tempo' },

  // b6-pres-subj-er-ir · la raíz sale de la 1.ª sg del presente, así que
  // las irregularidades de esa persona se heredan enteras.
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'comer', t: 'presSubj', per: 'eles',
    s: 'É melhor que eles ___ (comer) alguma coisa antes de partirem.', pista: 'coman — presente de subjuntivo', ancla: 'É melhor que eles' },
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'partir', t: 'presSubj', per: 'nós',
    s: 'Convém que nós ___ (partir) cedo para evitarmos o trânsito.', pista: 'salgamos — presente de subjuntivo', ancla: 'Convém que nós' },
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'fazer', t: 'presSubj', per: 'eu',
    s: 'Ele quer que eu ___ (fazer) o relatório antes de sexta-feira.', pista: 'haga — presente de subjuntivo, irregular', ancla: 'Ele quer que eu' },
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'dizer', t: 'presSubj', per: 'tu',
    s: 'Não quero que tu ___ (dizer) nada a ninguém sobre isto.', pista: 'presente de subjuntivo, 2.ª persona — raíz irregular', ancla: 'Não quero que tu' },
  // «Espero que ele tenha…» chocaba a 0,583 con dos publicados: el gate
  // lo bloqueó y se cambió el disparador y el verbo.
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'perceber', t: 'presSubj', per: 'ele',
    s: 'Não creio que ele ___ (perceber) a gravidade da situação.', pista: 'presente de subjuntivo, 3.ª persona', ancla: 'Não creio que ele' },
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'vir', t: 'presSubj', per: 'eles',
    s: 'Duvido que eles ___ (vir) à reunião com esta chuva toda.', pista: 'vengan — presente de subjuntivo, irregular', ancla: 'Duvido que eles' },
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'escrever', t: 'presSubj', per: 'tu',
    s: 'Peço-te que ___ (escrever) o teu nome em letra de imprensa.', pista: 'escribas — presente de subjuntivo', ancla: 'Peço-te que' },
  { p: 'b6-pres-subj-er-ir', pasada: 1, lema: 'poder', t: 'presSubj', per: 'nós',
    s: 'Talvez nós ___ (poder) resolver isto sem chamar ninguém.', pista: 'podamos — presente de subjuntivo, irregular', ancla: 'Talvez' },

  // b6-pres-subj-ar · la otra conjugación, con la desinencia opuesta
  { p: 'b6-pres-subj-ar', pasada: 1, lema: 'falar', t: 'presSubj', per: 'ele',
    s: 'Prefiro que ele ___ (falar) com o senhor diretor pessoalmente.', pista: 'hable — presente de subjuntivo', ancla: 'Prefiro que ele' },
  { p: 'b6-pres-subj-ar', pasada: 1, lema: 'chegar', t: 'presSubj', per: 'eles',
    s: 'Oxalá eles ___ (chegar) antes de a loja fechar.', pista: 'lleguen — presente de subjuntivo', ancla: 'Oxalá' },
  { p: 'b6-pres-subj-ar', pasada: 1, lema: 'trabalhar', t: 'presSubj', per: 'tu',
    s: 'Não é preciso que tu ___ (trabalhar) ao fim de semana.', pista: 'trabajes — presente de subjuntivo', ancla: 'Não é preciso que' },
  { p: 'b6-pres-subj-ar', pasada: 1, lema: 'ficar', t: 'presSubj', per: 'nós',
    s: 'É pena que nós ___ (ficar) tão longe uns dos outros.', pista: 'nos quedemos — presente de subjuntivo', ancla: 'É pena que' },
  { p: 'b6-pres-subj-ar', pasada: 1, lema: 'estudar', t: 'presSubj', per: 'eu',
    s: 'A minha mãe insiste em que eu ___ (estudar) mais uma hora.', pista: 'estudie — presente de subjuntivo', ancla: 'insiste em que eu' },
  { p: 'b6-pres-subj-ar', pasada: 1, lema: 'dar', t: 'presSubj', per: 'eles',
    s: 'Espero que eles ___ (dar) conta do trabalho a tempo.', pista: 'den — presente de subjuntivo, irregular', ancla: 'Espero que' },
  { p: 'b6-pres-subj-ar', pasada: 1, lema: 'estar', t: 'presSubj', per: 'ele',
    s: 'Tomara que ele ___ (estar) melhor quando chegarmos lá.', pista: 'esté — presente de subjuntivo, irregular', ancla: 'Tomara que ele' },

  // ══ PASADA 2 ══════════════════════════════════════════════════════
  // b4-imperf-cortesia · el imperfeito que suaviza: «queria» por «quero».
  // Es de los pocos puntos donde el español hace lo mismo («quería»),
  // así que la pista da la persona y no la forma.
  { p: 'b4-imperf-cortesia', pasada: 2, lema: 'querer', t: 'imperfeito', per: 'eu',
    s: 'Boa tarde, ___ (querer) marcar uma consulta para a semana que vem.', pista: 'imperfeito de cortesía, 1.ª persona', ancla: 'Boa tarde' },
  { p: 'b4-imperf-cortesia', pasada: 2, lema: 'gostar', t: 'imperfeito', per: 'eu',
    s: '___ (gostar) de falar com o responsável, se fosse possível.', pista: 'imperfeito de cortesía, 1.ª persona', ancla: 'se fosse possível' },
  { p: 'b4-imperf-cortesia', pasada: 2, lema: 'poder', t: 'imperfeito', per: 'ele',
    s: 'O senhor ___ (poder) repetir o número, se faz favor?', pista: 'imperfeito de cortesía, 3.ª persona', ancla: 'se faz favor' },
  { p: 'b4-imperf-cortesia', pasada: 2, lema: 'desejar', t: 'imperfeito', per: 'nós',
    s: 'Nós ___ (desejar) uma mesa junto à janela, se houver.', pista: 'imperfeito de cortesía, 1.ª del plural', ancla: 'se houver' },
  { p: 'b4-imperf-cortesia', pasada: 2, lema: 'precisar', t: 'imperfeito', per: 'eu',
    s: 'Desculpe, ___ (precisar) de um impresso para a renovação.', pista: 'imperfeito de cortesía, 1.ª persona', ancla: 'Desculpe' },
  { p: 'b4-imperf-cortesia', pasada: 2, r: 'Importava-se',
    s: '___ (importar-se) o senhor de esperar cinco minutos na sala ao lado?', pista: 'imperfeito de cortesía, 3.ª persona — el verbo es reflexivo', ancla: 'o senhor' },
  { p: 'b4-imperf-cortesia', pasada: 2, lema: 'preferir', t: 'imperfeito', per: 'eu',
    s: 'Se não se incomodar, ___ (preferir) tratar disto amanhã de manhã.', pista: 'imperfeito de cortesía, 1.ª persona', ancla: 'Se não se incomodar' },
  { p: 'b4-imperf-cortesia', pasada: 2, lema: 'aceitar', t: 'imperfeito', per: 'tu',
    s: 'Não sei se tu ___ (aceitar) uma boleia até à estação.', pista: 'imperfeito de cortesía, 2.ª persona', ancla: 'Não sei se' },

  // b5-fut-suposicao · el futuro que no habla del futuro sino de la
  // conjetura: «serão dez horas» = «serán las diez».
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'ser', t: 'futuro', per: 'eles',
    s: 'Que horas são? Não sei, ___ (ser) umas dez, pelo movimento na rua.', pista: 'futuro de conjetura: no dice el futuro, dice «supongo que»', ancla: 'Não sei' },
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'estar', t: 'futuro', per: 'ele',
    s: 'A luz está acesa: ___ (estar) alguém em casa, digo eu.', pista: 'futuro de conjetura, 3.ª persona', ancla: 'digo eu' },
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'ter', t: 'futuro', per: 'ele',
    s: 'O rapaz ___ (ter) uns vinte anos, a julgar pela cara.', pista: 'futuro de conjetura, 3.ª persona', ancla: 'a julgar pela cara' },
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'custar', t: 'futuro', per: 'ele',
    s: 'Aquele casaco ___ (custar) uns duzentos euros, no mínimo.', pista: 'futuro de conjetura, 3.ª persona', ancla: 'no mínimo' },
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'andar', t: 'futuro', per: 'eles',
    s: 'Ainda não chegaram: ___ (andar) presos no trânsito, como sempre.', pista: 'futuro de conjetura, 3.ª del plural', ancla: 'como sempre' },
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'morar', t: 'futuro', per: 'ele',
    s: 'Ela ___ (morar) para os lados do Rossio, mas não tenho a certeza.', pista: 'futuro de conjetura, 3.ª persona', ancla: 'não tenho a certeza' },
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'pesar', t: 'futuro', per: 'ele',
    s: 'A mala ___ (pesar) uns vinte quilos, pelo esforço que ele fez.', pista: 'futuro de conjetura, 3.ª persona', ancla: 'pelo esforço que ele fez' },
  { p: 'b5-fut-suposicao', pasada: 2, lema: 'chegar', t: 'futuro', per: 'eles',
    s: 'Já são oito: eles ___ (chegar) a caminho, digo eu.', pista: 'futuro de conjetura, 3.ª del plural — supone, no anuncia', ancla: 'digo eu' },

  // b3-exist-ficar · «ficar» de localización, que el español no tiene:
  // dice dónde ESTÁ lo que no se mueve.
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'presente', per: 'ele',
    s: 'A farmácia ___ (ficar) já a seguir ao cruzamento, do lado direito.', pista: 'está situada — con el verbo que el español no tiene en este uso', ancla: 'do lado direito' },
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'presente', per: 'eles',
    s: 'Os correios ___ (ficar) na mesma rua da escola, mais acima.', pista: 'están situados, 3.ª del plural', ancla: 'mais acima' },
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'presente', per: 'ele',
    s: 'Sabe onde ___ (ficar) a estação de comboios, se faz favor?', pista: 'está situada, 3.ª persona', ancla: 'Sabe onde' },
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'presente', per: 'nós',
    s: 'Nós ___ (ficar) mesmo em frente ao jardim, no número doze.', pista: 'estamos situados, 1.ª del plural', ancla: 'no número doze' },
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'imperfeito', per: 'ele',
    s: 'A antiga padaria ___ (ficar) onde agora está o banco.', pista: 'estaba situada — imperfeito', ancla: 'onde agora está o banco' },
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'presente', per: 'tu',
    s: 'Tu ___ (ficar) muito longe daqui? Posso dar-te boleia.', pista: 'estás situado, 2.ª persona', ancla: 'Posso dar-te boleia' },
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'presente', per: 'ele',
    s: 'O restaurante de que te falei ___ (ficar) numa travessa estreita.', pista: 'está situado, 3.ª persona', ancla: 'numa travessa estreita' },
  { p: 'b3-exist-ficar', pasada: 2, lema: 'ficar', t: 'imperfeito', per: 'eles',
    s: 'As antigas oficinas ___ (ficar) todas do outro lado do rio.', pista: 'estaban situadas — imperfeito, 3.ª del plural', ancla: 'do outro lado do rio' },

  // ══ PASADA 3 ══════════════════════════════════════════════════════
  // b3-pres-ir · presente de la 3.ª conjugación, donde el español y el
  // portugués divergen en la 1.ª plural: «partimos» / «partimos» coincide,
  // pero «abrimos» frente a «abrimos» no da problema; lo que cuesta es
  // la 2.ª persona en -es.
  { p: 'b3-pres-ir', pasada: 3, lema: 'partir', t: 'presente', per: 'tu',
    s: 'A que horas ___ (partir) tu amanhã para o Porto?', pista: 'presente, 2.ª persona', ancla: 'A que horas' },
  { p: 'b3-pres-ir', pasada: 3, lema: 'abrir', t: 'presente', per: 'eles',
    s: 'As lojas ___ (abrir) só às dez, por causa do feriado.', pista: 'presente, 3.ª del plural', ancla: 'por causa do feriado' },
  { p: 'b3-pres-ir', pasada: 3, lema: 'decidir', t: 'presente', per: 'nós',
    s: 'Nós ___ (decidir) isso na reunião de quinta, não antes.', pista: 'presente, 1.ª del plural', ancla: 'não antes' },
  { p: 'b3-pres-ir', pasada: 3, lema: 'assistir', t: 'presente', per: 'eu',
    s: 'Eu ___ (assistir) ao noticiário todas as noites às oito.', pista: 'presente, 1.ª persona', ancla: 'todas as noites' },
  { p: 'b3-pres-ir', pasada: 3, lema: 'discutir', t: 'presente', per: 'eles',
    s: 'Eles ___ (discutir) o mesmo assunto há semanas e não decidem nada.', pista: 'presente, 3.ª del plural', ancla: 'há semanas' },
  { p: 'b3-pres-ir', pasada: 3, lema: 'resumir', t: 'presente', per: 'tu',
    s: 'Tu ___ (resumir) a reunião num parágrafo, que eu não estive lá.', pista: 'presente, 2.ª persona', ancla: 'que eu não estive lá' },
  { p: 'b3-pres-ir', pasada: 3, lema: 'permitir', t: 'presente', per: 'ele',
    s: 'O regulamento não ___ (permitir) a entrada com mochilas grandes.', pista: 'presente, 3.ª persona', ancla: 'O regulamento' },

  // b3-pres-ar · la conjugación más poblada, con la 2.ª persona en -as
  { p: 'b3-pres-ar', pasada: 3, lema: 'trabalhar', t: 'presente', per: 'tu',
    s: 'Ainda ___ (trabalhar) tu naquela empresa da avenida?', pista: 'presente, 2.ª persona', ancla: 'naquela empresa da avenida' },
  { p: 'b3-pres-ar', pasada: 3, lema: 'estudar', t: 'presente', per: 'eles',
    s: 'Os meus sobrinhos ___ (estudar) os dois na mesma escola.', pista: 'presente, 3.ª del plural', ancla: 'os dois na mesma escola' },
  { p: 'b3-pres-ar', pasada: 3, lema: 'jantar', t: 'presente', per: 'nós',
    s: 'Nós ___ (jantar) sempre por volta das oito e meia.', pista: 'presente, 1.ª del plural', ancla: 'sempre por volta das' },
  { p: 'b3-pres-ar', pasada: 3, lema: 'apanhar', t: 'presente', per: 'eu',
    s: 'Eu ___ (apanhar) o autocarro das sete para chegar a horas.', pista: 'presente, 1.ª persona', ancla: 'para chegar a horas' },
  { p: 'b3-pres-ar', pasada: 3, lema: 'arrumar', t: 'presente', per: 'ele',
    s: 'Ela ___ (arrumar) a casa toda ao sábado de manhã.', pista: 'presente, 3.ª persona', ancla: 'ao sábado de manhã' },

  // b1-tonica-desplazamiento-verbal · el acento que se mueve con la
  // persona: «falamos» llana, «falávamos» esdrújula y con tilde.
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'falar', t: 'imperfeito', per: 'nós',
    s: 'Antigamente nós ___ (falar) ao telefone quase todos os dias.', pista: 'imperfeito, 1.ª del plural — la sílaba tónica se mueve y pide tilde', ancla: 'Antigamente' },
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'comer', t: 'imperfeito', per: 'nós',
    s: 'Em pequenos nós ___ (comer) sopa antes de tudo.', pista: 'imperfeito, 1.ª del plural — con tilde en la í', ancla: 'Em pequenos' },
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'trabalhar', t: 'imperfeito', per: 'nós',
    s: 'Naquele verão nós ___ (trabalhar) os dois no mesmo café.', pista: 'imperfeito, 1.ª del plural — esdrújula, con tilde', ancla: 'Naquele verão' },
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'partir', t: 'imperfeito', per: 'nós',
    s: 'Nesses anos nós ___ (partir) sempre de madrugada.', pista: 'imperfeito, 1.ª del plural — con tilde en la í', ancla: 'Nesses anos' },
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'estudar', t: 'imperfeito', per: 'nós',
    s: 'No liceu nós ___ (estudar) latim durante três anos.', pista: 'imperfeito, 1.ª del plural — esdrújula, con tilde', ancla: 'No liceu' },
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'beber', t: 'imperfeito', per: 'nós',
    s: 'Ao domingo nós ___ (beber) um copo de vinho ao almoço.', pista: 'imperfeito, 1.ª del plural — con tilde en la í', ancla: 'Ao domingo' },
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'gostar', t: 'imperfeito', per: 'nós',
    s: 'Em miúdos nós ___ (gostar) muito de brincar na rua.', pista: 'imperfeito, 1.ª del plural — esdrújula, con tilde', ancla: 'Em miúdos' },
  { p: 'b1-tonica-desplazamiento-verbal', pasada: 3, lema: 'dormir', t: 'imperfeito', per: 'nós',
    s: 'Na casa da praia nós ___ (dormir) com a janela aberta.', pista: 'imperfeito, 1.ª del plural — con tilde en la í', ancla: 'Na casa da praia' },

  // b4-perf-er · pretérito perfeito de la 2.ª conjugación. El paradigma
  // del proyecto no lo cubre, así que se DECLARA y el gate sólo puede
  // exigir la pista y el ancla: se dice, no se finge medido.
  { p: 'b4-perf-er', pasada: 3, r: 'comi', s: 'Ontem eu ___ (comer) no restaurante da esquina.', pista: 'pretérito perfeito, 1.ª persona', ancla: 'Ontem' },
  { p: 'b4-perf-er', pasada: 3, r: 'bebeste', s: 'Quanto ___ (beber) tu na festa de sábado?', pista: 'pretérito perfeito, 2.ª persona', ancla: 'na festa de sábado' },
  { p: 'b4-perf-er', pasada: 3, r: 'perdeu', s: 'Ele ___ (perder) as chaves outra vez, no mesmo sítio.', pista: 'perdió — pretérito perfeito, 3.ª persona', ancla: 'outra vez' },
  { p: 'b4-perf-er', pasada: 3, r: 'venderam', s: 'Eles ___ (vender) a casa da aldeia no ano passado.', pista: 'vendieron — pretérito perfeito, 3.ª del plural', ancla: 'no ano passado' },

  // ══ PASADA 4 ══════════════════════════════════════════════════════
  // b3-pron-contracoes · mo, to, lho: la contracción de dos clíticos que
  // el español no tiene («me lo» son dos palabras; «mo» es una).
  { p: 'b3-pron-contracoes', pasada: 4, r: 'mo', s: 'Se tens o livro, dá-___ (me + o) amanhã na aula.', pista: 'me lo — en una sola palabra', ancla: 'Se tens o livro' },
  { p: 'b3-pron-contracoes', pasada: 4, r: 'ma', s: 'A carta é minha: podes dar-___ (me + a) quando quiseres.', pista: 'me la — en una sola palabra', ancla: 'A carta é minha' },
  { p: 'b3-pron-contracoes', pasada: 4, r: 'to', s: 'O dinheiro é teu: devolvo-___ (te + o) na segunda-feira.', pista: 'te lo — en una sola palabra', ancla: 'O dinheiro é teu' },
  { p: 'b3-pron-contracoes', pasada: 4, r: 'ta', s: 'Se a chave é tua, entrego-___ (te + a) já a seguir.', pista: 'te la — en una sola palabra', ancla: 'Se a chave é tua' },
  { p: 'b3-pron-contracoes', pasada: 4, r: 'lho', s: 'O recado é para ele: dá-___ (lhe + o) quando o vires.', pista: 'se lo (a él) — en una sola palabra', ancla: 'O recado é para ele' },
  { p: 'b3-pron-contracoes', pasada: 4, r: 'lha', s: 'A encomenda é da vizinha: entrega-___ (lhe + a) hoje mesmo.', pista: 'se la (a ella) — en una sola palabra', ancla: 'A encomenda é da vizinha' },
  { p: 'b3-pron-contracoes', pasada: 4, r: 'mos', s: 'Os documentos são meus: manda-___ (me + os) por correio.', pista: 'me los — en una sola palabra', ancla: 'Os documentos são meus' },
  { p: 'b3-pron-contracoes', pasada: 4, r: 'lhas', s: 'As fotografias são delas: mostra-___ (lhes + as) na próxima visita.', pista: 'se las (a ellas) — en una sola palabra', ancla: 'As fotografias são delas' },

  // b8-con-adicao · los conectores que suman, y que el español reparte
  // de otra manera («además» cubre varios de estos a la vez).
  { p: 'b8-con-adicao', pasada: 4, r: 'Além disso', s: 'O preço é alto. ___ (además), há a questão do prazo de entrega.', pista: 'además — la fórmula de dos palabras que abre frase', ancla: 'há a questão do prazo' },
  { p: 'b8-con-adicao', pasada: 4, r: 'Não só', s: '___ (no sólo) chegou tarde, como ainda se queixou da comida.', pista: 'no sólo… sino que — la primera mitad de la correlación', ancla: 'como ainda se queixou' },
  { p: 'b8-con-adicao', pasada: 4, r: 'bem como', s: 'Foram convidados os sócios, ___ (así como) os seus familiares.', pista: 'así como — la fórmula de registro cuidado', ancla: 'os seus familiares' },
  { p: 'b8-con-adicao', pasada: 4, r: 'ainda por cima', s: 'Perdi o comboio e, ___ (encima), começou a chover.', pista: 'encima — la locución coloquial de tres palabras', ancla: 'começou a chover' },
  { p: 'b8-con-adicao', pasada: 4, r: 'para além de', s: '___ (aparte de) trabalhar, ainda estuda à noite.', pista: 'aparte de — la locución de tres palabras', ancla: 'ainda estuda à noite' },
  { p: 'b8-con-adicao', pasada: 4, r: 'de resto', s: 'A proposta é boa e, ___ (por lo demás), não temos alternativa.', pista: 'por lo demás — la locución de dos palabras', ancla: 'não temos alternativa' },
  { p: 'b8-con-adicao', pasada: 4, r: 'a par disso', s: 'Aprovou-se o orçamento e, ___ (junto a eso), o plano de obras.', pista: 'junto a eso — la locución de tres palabras', ancla: 'o plano de obras' },
  { p: 'b8-con-adicao', pasada: 4, r: 'Acresce que', s: '___ (a lo que se añade que) o prazo termina na sexta-feira.', pista: 'a lo que hay que añadir que — la fórmula de registro formal', ancla: 'o prazo termina na sexta-feira' },

  // b12-regencia-rara · verbos de baja frecuencia cuyo régimen el
  // hablante avanzado ya no tiene de dónde sacar. Piso 6 en C2.
  { p: 'b12-regencia-rara', pasada: 4, r: 'a', s: 'O parecer alude ___ (preposición) problemas que já vinham do ano passado.', pista: 'la preposición que rige «aludir»', ancla: 'O parecer alude' },
  { p: 'b12-regencia-rara', pasada: 4, r: 'a', s: 'Nada obsta ___ (preposición) que o processo siga os seus termos.', pista: 'la preposición que rige «obstar»', ancla: 'Nada obsta' },
  { p: 'b12-regencia-rara', pasada: 4, r: 'em', s: 'O ministério não se deve imiscuir ___ (preposición) assuntos da autarquia.', pista: 'la preposición que rige «imiscuir-se»', ancla: 'não se deve imiscuir' },
  { p: 'b12-regencia-rara', pasada: 4, r: 'de', s: 'O presidente arrogou-se poderes ___ (preposición) que não dispunha.', pista: 'la preposición que pide «dispor»', ancla: 'arrogou-se poderes' },
  { p: 'b12-regencia-rara', pasada: 4, r: 'em', s: 'A defesa comprazia-se ___ (preposición) repetir o mesmo argumento.', pista: 'la preposición que rige «comprazer-se»', ancla: 'A defesa comprazia-se' },
  { p: 'b12-regencia-rara', pasada: 4, r: 'de', s: 'O relatório carece ___ (preposición) fundamentação em três pontos.', pista: 'la preposición que rige «carecer»', ancla: 'O relatório carece' },

  // b3-pres-alternancia · la alternancia vocálica de la raíz, que no se
  // deduce del infinitivo: se declara y la pista da la persona.
  { p: 'b3-pres-alternancia', pasada: 4, r: 'durmo', s: 'Eu ___ (dormir) sempre com a janela entreaberta.', pista: 'presente, 1.ª persona — la vocal de la raíz cambia', ancla: 'sempre com a janela' },
  { p: 'b3-pres-alternancia', pasada: 4, r: 'sirvo', s: 'Eu ___ (servir) o jantar às oito, se ninguém se atrasar.', pista: 'presente, 1.ª persona — la vocal de la raíz cambia', ancla: 'se ninguém se atrasar' },
  { p: 'b3-pres-alternancia', pasada: 4, r: 'peço', s: 'Eu ___ (pedir) sempre a mesma coisa neste restaurante.', pista: 'presente, 1.ª persona — la raíz cambia', ancla: 'neste restaurante' },
  { p: 'b3-pres-alternancia', pasada: 4, r: 'sobes', s: 'Tu ___ (subir) as escadas a pé para fazer exercício?', pista: 'presente, 2.ª persona — la vocal de la raíz se abre', ancla: 'para fazer exercício' },
  { p: 'b3-pres-alternancia', pasada: 4, r: 'sobe', s: 'O preço do pão ___ (subir) outra vez este mês.', pista: 'presente, 3.ª persona — la vocal de la raíz se abre', ancla: 'outra vez este mês' },
  { p: 'b3-pres-alternancia', pasada: 4, r: 'dormes', s: 'Quantas horas ___ (dormir) tu durante a semana?', pista: 'presente, 2.ª persona', ancla: 'durante a semana' },
  { p: 'b3-pres-alternancia', pasada: 4, r: 'serve', s: 'Esta chave já não ___ (servir) para nada, muda a fechadura.', pista: 'presente, 3.ª persona', ancla: 'muda a fechadura' },
];

// ── Gates ────────────────────────────────────────────────────────────
export function respuestaDe(x: Cloze): string | null {
  if (x.r) return x.r;
  if (!x.lema || !x.t || !x.per) return null;
  switch (x.t) {
    case 'futuro': return futuro(x.lema, x.per);
    case 'condicional': return condicional(x.lema, x.per);
    case 'imperfSubj': return imperfeitoConjuntivo(x.lema, x.per);
    case 'futSubj': return futuroConjuntivo(x.lema, x.per);
    case 'mqp': return mqpComposto(x.lema, x.per);
    case 'infPess': return infinitivoPessoal(x.lema, x.per);
    default: return conjugar(x.lema, x.t as Tiempo, x.per);
  }
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function verificar(items: Cloze[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  for (const [i, x] of items.entries()) {
    const id = `CL-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: el paradigma no cubre «${x.lema}» en ${x.t}/${x.per} y no hay respuesta declarada — un conjugador que adivina consagra formas falsas`); continue; }

    const huecos = x.s.split('___').length - 1;
    if (huecos !== 1) v.push(`${id}: ${huecos} huecos, tiene que haber 1 — deja uno solo y lleva el resto a otro ítem: la tarjeta validaba con blanks.some() y 33 ejercicios se aprobaban tecleando uno de tres`);
    // El paréntesis existe para NOMBRAR EL LEMA: si se pide una forma de
    // un verbo, hay que decir de cuál. Cuando escribí este gate la
    // tarjeta aún no pintaba `hintEs` y el paréntesis era el único canal;
    // desde E2#13 lo pinta (`FillBlankCard`, `data-testid="pista"`), así
    // que exigirlo a un ítem de respuesta DECLARADA —«la parte del cuerpo
    // con la que se saluda» → `mão`— pedía un paréntesis vacío de
    // contenido. Sigue siendo obligatorio donde el ítem lo necesita.
    if (x.lema && !/\([^)]+\)/.test(x.s)) v.push(`${id}: pide una forma de «${x.lema}» y no nombra el verbo entre paréntesis`);
    if (!x.pista.trim()) v.push(`${id}: sin hintEs — sin pista el hueco casi siempre admite varias formas; escribe una que DETERMINE la respuesta, no que la sugiera`);
    // LA CICATRIZ: el contexto tiene que DETERMINAR la respuesta.
    if (!x.ancla.trim()) v.push(`${id}: sin ancla declarada — el ancla es el trozo de la frase que EXCLUYE las otras respuestas posibles; si no lo encuentras, el ítem no está determinado`);
    else if (!x.s.includes(x.ancla)) v.push(`${id}: el ancla «${x.ancla}» no está en la frase — cópiala literal de la frase, que si no no excluye nada`);
    // La pista no puede deletrear la respuesta portuguesa.
    //
    // El caso que se repitió TRES veces antes de escribirse aquí: cuando
    // el español y el portugués COINCIDEN —«de ti», «contigo», «hotel»,
    // «papel»—, dar la glosa española ES deletrear, aunque no lo parezca
    // al escribirla. La salida no es quitar la pista: es **describir la
    // cosa en vez de traducirla** («el sitio donde se duerme cuando se
    // viaja») o **nombrar la regla** («la forma preposicional de tu»).
    if (new RegExp(`(?<![\\p{L}])${r}(?![\\p{L}])`, 'iu').test(norm(x.pista))) {
      const coincide = new RegExp(`(?<![\\p{L}])${r}(?![\\p{L}])`, 'iu').test(norm(x.pista.split('—')[0] ?? ''));
      v.push(`${id}: la pista deletrea la respuesta «${r}»` + (coincide
        ? ' — el español y el portugués coinciden aquí, así que traducir es deletrear: DESCRIBE la cosa o nombra la regla en vez de glosar'
        : ''));
    }
    // Ni la frase, fuera del hueco.
    if (new RegExp(`(?<![\\p{L}])${r}(?![\\p{L}])`, 'iu').test(x.s.replace('___', ''))) v.push(`${id}: la respuesta «${r}» ya está escrita en la frase — cambia la FRASE, no la respuesta: el alumno la copia de al lado y el FSRS registra un acierto falso`);
    // EL SUJETO POSPUESTO. Lo destapó el muestreo del 20 %: cuatro de
    // veinte ítems decían «comíamos nós», «aceitavas tu» — orden marcado
    // que en declarativa suena a ejercicio y no a portugués. Era un
    // artificio mío para dejar el ancla dentro de la frase teniendo el
    // hueco delante. En INTERROGATIVA la inversión es idiomática («A que
    // horas partes tu?») y se deja pasar.
    if (!x.s.includes('?') && /___ \([^)]*\)\s+(eu|tu|ele|ela|nós|eles|elas)(?![\p{L}])/u.test(x.s))
      v.push(`${id}: sujeto pospuesto al hueco en una declarativa — orden marcado que suena a ejercicio`);

    // Ni repetirse el lote a sí mismo.
    const clave = norm(x.s.replace(/\s+/g, ' ').trim());
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
  }
  // Reparto: si una respuesta domina su punto, se resuelve por frecuencia.
  const porPunto = new Map<string, Map<string, number>>();
  for (const x of items) {
    const r = respuestaDe(x); if (!r) continue;
    const m = porPunto.get(x.p) ?? new Map<string, number>();
    m.set(r, (m.get(r) ?? 0) + 1); porPunto.set(x.p, m);
  }
  for (const [p, m] of porPunto) {
    const n = [...m.values()].reduce((a, b) => a + b, 0);
    const [top, k] = [...m].sort((a, b) => b[1] - a[1])[0]!;
    if (n >= 4 && k / n > 0.5) v.push(`${p}: la respuesta «${top}» sale ${k} de ${n} veces — se resuelve por frecuencia: varía el verbo o la persona entre los ítems del punto, que si no se aprende la moda y no la regla`);
  }
  return v;
}

if (process.argv[1]?.includes('cloze-e2-15')) {
  const arg = process.argv.indexOf('--pasada');
  const sel = arg > -1 ? ITEMS.filter((x) => x.pasada === Number(process.argv[arg + 1])) : ITEMS;
  const v = verificar(sel);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(sel.map((x, i) => ({ ...x, id: `cl15-${String(ITEMS.indexOf(x) + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, number>();
  for (const x of sel) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Cloze con pista — ${sel.length} ítems\n`);
  console.log('| punto | ítems | derivados | declarados |');
  console.log('|---|---:|---:|---:|');
  for (const [p, n] of porPunto) {
    const xs = sel.filter((x) => x.p === p);
    console.log(`| \`${p}\` | ${n} | ${xs.filter((x) => !x.r).length} | ${xs.filter((x) => x.r).length} |`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: un hueco y una pista por ítem, ancla presente en la frase, respuesta recalculada');
  console.log('contra el paradigma donde el paradigma llega, y ninguna respuesta domina su punto.');
}

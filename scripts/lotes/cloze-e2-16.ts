// scripts/lotes/cloze-e2-16.ts
//
//   npx tsx scripts/lotes/cloze-e2-16.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-e2-16.ts --json     # ítems para publicar
//
// E2#16 · segunda tanda de cloze con pista. Reutiliza los gates de
// `cloze-e2-15.ts` sin copiarlos: un gate duplicado es un gate que se
// desincroniza, y esta sesión ya vio lo que hace un mapa duplicado.
//
// Los tiempos nuevos del paradigma —imperfeito e futuro do conjuntivo,
// mais-que-perfeito composto— se añadieron porque sin ellos dieciséis de
// estos ítems irían declarados en vez de derivados. Y una nota que vive
// aquí porque es aquí donde se usa: en los verbos REGULARES el futuro do
// conjuntivo es homógrafo del infinitivo pessoal («falares» vale para
// los dos), así que un ítem que quiera distinguirlos necesita un
// IRREGULAR — «vires» frente a «veres».
import { verificar, respuestaDe, type Cloze } from './cloze-e2-15';

export const ITEMS: Cloze[] = [
  // ══ b5-se-irreal · «se» + imperfeito do conjuntivo, la condición que
  // no se cumple. El español hace lo mismo, así que lo que cuesta es la
  // forma, no la elección.
  { p: 'b5-se-irreal', pasada: 1, lema: 'ter', t: 'imperfSubj', per: 'eu',
    s: 'Se eu ___ (ter) mais tempo, ia contigo à exposição.', pista: 'imperfeito do conjuntivo, 1.ª persona', ancla: 'ia contigo' },
  { p: 'b5-se-irreal', pasada: 1, lema: 'ser', t: 'imperfSubj', per: 'ele',
    s: 'Se ele ___ (ser) mais atencioso, as pessoas gostavam mais dele.', pista: 'imperfeito do conjuntivo, 3.ª persona', ancla: 'gostavam mais dele' },
  { p: 'b5-se-irreal', pasada: 1, lema: 'poder', t: 'imperfSubj', per: 'nós',
    s: 'Se ___ (poder) escolher, ficávamos os dois em casa.', pista: 'imperfeito do conjuntivo, 1.ª del plural', ancla: 'ficávamos os dois' },
  { p: 'b5-se-irreal', pasada: 1, lema: 'saber', t: 'imperfSubj', per: 'tu',
    s: 'Se tu ___ (saber) o que eu sei, não dizias isso.', pista: 'imperfeito do conjuntivo, 2.ª persona', ancla: 'não dizias isso' },
  { p: 'b5-se-irreal', pasada: 1, lema: 'morar', t: 'imperfSubj', per: 'eles',
    s: 'Se eles ___ (morar) mais perto, víamo-nos todas as semanas.', pista: 'imperfeito do conjuntivo, 3.ª del plural', ancla: 'víamo-nos todas as semanas' },
  { p: 'b5-se-irreal', pasada: 1, lema: 'fazer', t: 'imperfSubj', per: 'eu',
    s: 'Se eu ___ (fazer) tudo outra vez, mudava só uma coisa.', pista: 'imperfeito do conjuntivo, 1.ª persona', ancla: 'mudava só uma coisa' },
  { p: 'b5-se-irreal', pasada: 1, lema: 'estar', t: 'imperfSubj', per: 'ele',
    s: 'Se ela ___ (estar) cá, resolvia isto num instante.', pista: 'imperfeito do conjuntivo, 3.ª persona', ancla: 'resolvia isto num instante' },
  { p: 'b5-se-irreal', pasada: 1, lema: 'querer', t: 'imperfSubj', per: 'tu',
    s: 'Se tu ___ (querer), ainda íamos a tempo de apanhar o barco.', pista: 'imperfeito do conjuntivo, 2.ª persona', ancla: 'ainda íamos a tempo' },

  // ══ b6-se-real · «se» + futuro do conjuntivo, la condición posible.
  // Aquí sí hay divergencia: el español usa presente de indicativo.
  { p: 'b6-se-real', pasada: 1, lema: 'poder', t: 'futSubj', per: 'tu',
    s: 'Se tu ___ (poder), passa pela farmácia antes de ela fechar.', pista: 'futuro do conjuntivo, 2.ª persona — el español usa presente', ancla: 'passa pela farmácia' },
  { p: 'b6-se-real', pasada: 1, lema: 'ter', t: 'futSubj', per: 'eles',
    s: 'Se eles ___ (ter) dúvidas, que perguntem antes de assinar.', pista: 'futuro do conjuntivo, 3.ª del plural', ancla: 'que perguntem antes' },
  { p: 'b6-se-real', pasada: 1, lema: 'querer', t: 'futSubj', per: 'ele',
    s: 'Se ele ___ (querer) vir connosco, ainda há lugar no carro.', pista: 'futuro do conjuntivo, 3.ª persona', ancla: 'ainda há lugar' },
  { p: 'b6-se-real', pasada: 1, lema: 'ver', t: 'futSubj', per: 'tu',
    s: 'Se tu ___ (ver) a minha irmã, diz-lhe que já vou a caminho.', pista: 'futuro do conjuntivo, 2.ª persona — ojo, no es el infinitivo pessoal', ancla: 'diz-lhe que já vou' },
  { p: 'b6-se-real', pasada: 1, lema: 'haver', t: 'futSubj', per: 'ele',
    s: 'Se ___ (haver) lugares, compro dois bilhetes para sábado.', pista: 'futuro do conjuntivo, 3.ª persona — irregular', ancla: 'compro dois bilhetes' },
  { p: 'b6-se-real', pasada: 1, lema: 'fazer', t: 'futSubj', per: 'nós',
    s: 'Se nós ___ (fazer) as contas hoje, amanhã já sabemos o total.', pista: 'futuro do conjuntivo, 1.ª del plural', ancla: 'amanhã já sabemos' },
  { p: 'b6-se-real', pasada: 1, lema: 'ser', t: 'futSubj', per: 'ele',
    s: 'Se ___ (ser) preciso, ligo-te mais tarde para combinarmos.', pista: 'futuro do conjuntivo, 3.ª persona', ancla: 'ligo-te mais tarde' },
  { p: 'b6-se-real', pasada: 1, lema: 'dizer', t: 'futSubj', per: 'eles',
    s: 'Se eles ___ (dizer) alguma coisa, avisa-me logo por mensagem.', pista: 'futuro do conjuntivo, 3.ª del plural', ancla: 'avisa-me logo' },

  // ══ b4-mqp-anterioridade · «tinha falado»: lo que ya había pasado
  // cuando pasó lo otro. Se compone de imperfeito de «ter» + particípio.
  { p: 'b4-mqp-anterioridade', pasada: 1, lema: 'sair', t: 'mqp', per: 'ele',
    s: 'Quando cheguei, ele já ___ (sair) para o trabalho.', pista: 'ya había salido — mais-que-perfeito composto', ancla: 'Quando cheguei' },
  { p: 'b4-mqp-anterioridade', pasada: 1, lema: 'comer', t: 'mqp', per: 'eles',
    s: 'Às nove eles já ___ (comer) todos, e a mesa estava levantada.', pista: 'ya habían comido — mais-que-perfeito composto', ancla: 'a mesa estava levantada' },
  { p: 'b4-mqp-anterioridade', pasada: 1, lema: 'fechar', t: 'mqp', per: 'ele',
    s: 'A loja já ___ (fechar) quando me lembrei do pão.', pista: 'ya había cerrado — mais-que-perfeito composto', ancla: 'quando me lembrei' },
  { p: 'b4-mqp-anterioridade', pasada: 1, lema: 'estudar', t: 'mqp', per: 'eu',
    s: 'Antes da faculdade eu já ___ (estudar) dois anos em Coimbra.', pista: 'ya había estudiado — mais-que-perfeito composto', ancla: 'Antes da faculdade' },
  { p: 'b4-mqp-anterioridade', pasada: 1, lema: 'perder', t: 'mqp', per: 'nós',
    s: 'Quando o táxi chegou, nós já ___ (perder) o comboio das seis.', pista: 'ya habíamos perdido — mais-que-perfeito composto', ancla: 'Quando o táxi chegou' },
  { p: 'b4-mqp-anterioridade', pasada: 1, lema: 'avisar', t: 'mqp', per: 'ele',
    s: 'Ela ___ (avisar) toda a gente antes de tomar a decisão.', pista: 'había avisado — mais-que-perfeito composto', ancla: 'antes de tomar a decisão' },
  { p: 'b4-mqp-anterioridade', pasada: 1, lema: 'ler', t: 'mqp', per: 'eu',
    s: 'Eu já ___ (ler) o livro quando saiu o filme.', pista: 'ya había leído — mais-que-perfeito composto', ancla: 'quando saiu o filme' },

  // ══ b5-cond-hipotetico · el condicional de la apódosis
  { p: 'b5-cond-hipotetico', pasada: 1, lema: 'comprar', t: 'condicional', per: 'eu',
    s: 'Com esse dinheiro, eu ___ (comprar) a casa da esquina.', pista: 'condicional, 1.ª persona', ancla: 'Com esse dinheiro' },
  { p: 'b5-cond-hipotetico', pasada: 1, lema: 'ficar', t: 'condicional', per: 'nós',
    s: 'Sem o trânsito da ponte, nós ___ (ficar) a meia hora daqui.', pista: 'condicional, 1.ª del plural', ancla: 'Sem o trânsito da ponte' },
  { p: 'b5-cond-hipotetico', pasada: 1, lema: 'dizer', t: 'condicional', per: 'eles',
    s: 'Na tua situação, eles ___ (dizer) exatamente a mesma coisa.', pista: 'condicional, 3.ª del plural — raíz irregular', ancla: 'Na tua situação' },
  { p: 'b5-cond-hipotetico', pasada: 1, lema: 'fazer', t: 'condicional', per: 'tu',
    s: 'O que ___ (fazer) tu com uma semana livre e sem planos?', pista: 'condicional, 2.ª persona — raíz irregular', ancla: 'uma semana livre' },

  // ══ b4-imperf-formas · el imperfeito de indicativo, sin más
  { p: 'b4-imperf-formas', pasada: 1, lema: 'passar', t: 'imperfeito', per: 'eles',
    s: 'Nesses verões, eles ___ (passar) o mês inteiro na aldeia.', pista: 'imperfeito, 3.ª del plural', ancla: 'Nesses verões' },
  { p: 'b4-imperf-formas', pasada: 1, lema: 'escrever', t: 'imperfeito', per: 'ele',
    s: 'A minha avó ___ (escrever) cartas todas as semanas.', pista: 'imperfeito, 3.ª persona', ancla: 'todas as semanas' },
  { p: 'b4-imperf-formas', pasada: 1, lema: 'ter', t: 'imperfeito', per: 'nós',
    s: 'Naquela casa nós ___ (ter) um jardim enorme lá atrás.', pista: 'imperfeito, 1.ª del plural — irregular', ancla: 'Naquela casa' },

  // ══ b6-contr-duvida · el conjuntivo que dispara la duda
  { p: 'b6-contr-duvida', pasada: 1, lema: 'chegar', t: 'presSubj', per: 'eles',
    s: 'Duvido que eles ___ (chegar) a tempo com este trânsito.', pista: 'presente do conjuntivo, 3.ª del plural', ancla: 'Duvido que eles' },
  { p: 'b6-contr-duvida', pasada: 1, lema: 'ser', t: 'presSubj', per: 'ele',
    s: 'Não creio que ___ (ser) boa ideia sair com esta chuva.', pista: 'presente do conjuntivo, 3.ª persona — irregular', ancla: 'Não creio que' },
  { p: 'b6-contr-duvida', pasada: 1, lema: 'saber', t: 'presSubj', per: 'ele',
    s: 'Não me parece que ela ___ (saber) o que aconteceu ontem.', pista: 'presente do conjuntivo, 3.ª persona — irregular', ancla: 'Não me parece que' },

  // ══ b3-exist-ser-estar · ser y estar en su reparto de A2
  { p: 'b3-exist-ser-estar', pasada: 1, lema: 'estar', t: 'presente', per: 'eles',
    s: 'As chaves ___ (estar) em cima da mesa da entrada.', pista: 'presente, 3.ª del plural — situación pasajera', ancla: 'em cima da mesa' },
  { p: 'b3-exist-ser-estar', pasada: 1, lema: 'ser', t: 'presente', per: 'eu',
    s: 'Eu ___ (ser) de Braga, mas vivo em Lisboa há dez anos.', pista: 'presente, 1.ª persona — origen', ancla: 'mas vivo em Lisboa' },
  { p: 'b3-exist-ser-estar', pasada: 1, lema: 'estar', t: 'presente', per: 'nós',
    s: 'Nós ___ (estar) muito cansados depois da viagem toda.', pista: 'presente, 1.ª del plural — estado', ancla: 'depois da viagem' },
  { p: 'b3-exist-ser-estar', pasada: 1, lema: 'ser', t: 'presente', per: 'eles',
    s: 'Estes bolos ___ (ser) da pastelaria da esquina, não de casa.', pista: 'presente, 3.ª del plural — procedencia', ancla: 'da pastelaria da esquina' },
  { p: 'b3-exist-ser-estar', pasada: 1, lema: 'estar', t: 'presente', per: 'tu',
    s: 'Tu ___ (estar) com fome ou esperamos pelo jantar?', pista: 'presente, 2.ª persona — estado', ancla: 'ou esperamos pelo jantar' },
  { p: 'b3-exist-ser-estar', pasada: 1, lema: 'ser', t: 'presente', per: 'nós',
    s: 'Nós ___ (ser) cinco em casa, contando com a minha avó.', pista: 'presente, 1.ª del plural — identidad', ancla: 'contando com a minha avó' },
  { p: 'b3-exist-ser-estar', pasada: 1, lema: 'estar', t: 'imperfeito', per: 'ele',
    s: 'O café ___ (estar) fechado quando lá passei de manhã.', pista: 'imperfeito, 3.ª persona — estado en el pasado', ancla: 'quando lá passei' },

  // ══ b3-imperativo · el imperativo, en sus dos personas de tuteo
  { p: 'b3-imperativo', pasada: 1, lema: 'esperar', t: 'imperativoTu', per: 'tu',
    s: '___ (esperar) aí um bocadinho, que já venho ter contigo.', pista: 'imperativo de tú', ancla: 'que já venho ter contigo' },
  { p: 'b3-imperativo', pasada: 1, lema: 'beber', t: 'imperativoTu', per: 'tu',
    s: '___ (beber) um pouco de água antes de sair para a corrida.', pista: 'imperativo de tú', ancla: 'antes de sair para a corrida' },
  { p: 'b3-imperativo', pasada: 1, lema: 'subir', t: 'imperativoTu', per: 'tu',
    s: '___ (subir) pelas escadas, que o elevador está avariado.', pista: 'imperativo de tú', ancla: 'que o elevador está avariado' },
  { p: 'b3-imperativo', pasada: 1, lema: 'dar', t: 'imperativoTu', per: 'tu',
    s: '___ (dar) os meus cumprimentos aos teus pais quando os vires.', pista: 'imperativo de tú, irregular', ancla: 'aos teus pais' },
  { p: 'b3-imperativo', pasada: 1, lema: 'ver', t: 'imperativoTu', per: 'tu',
    s: '___ (ver) se não te esqueces do guarda-chuva outra vez.', pista: 'imperativo de tú, irregular', ancla: 'do guarda-chuva' },

  // ══ b5-perifrastico-formas · «ir + infinitivo», la perífrasis sin «a»
  { p: 'b5-perifrastico-formas', pasada: 1, lema: 'ir', t: 'presente', per: 'nós',
    s: 'Amanhã nós ___ (ir) ver a exposição antes que feche.', pista: 'presente de «ir», 1.ª del plural — sin «a» delante del infinitivo', ancla: 'antes que feche' },
  { p: 'b5-perifrastico-formas', pasada: 1, lema: 'ir', t: 'presente', per: 'tu',
    s: '___ (ir) tu falar com ele ou prefires que eu ligue?', pista: 'presente de «ir», 2.ª persona', ancla: 'ou prefires que eu ligue' },
  { p: 'b5-perifrastico-formas', pasada: 1, lema: 'ir', t: 'presente', per: 'eles',
    s: 'Os miúdos ___ (ir) dormir mais cedo hoje, que amanhã há escola.', pista: 'presente de «ir», 3.ª del plural', ancla: 'que amanhã há escola' },
  { p: 'b5-perifrastico-formas', pasada: 1, lema: 'ir', t: 'imperfeito', per: 'eu',
    s: 'Eu ___ (ir) telefonar-te, mas depois não tive tempo nenhum.', pista: 'imperfeito de «ir», 1.ª persona', ancla: 'mas depois não tive tempo' },
  // ── PASADA 3 · infinitivo pessoal y ser/estar divergente (C1) ────────
  // El infinitivo pessoal se flexiona cuando tiene sujeto propio; el
  // sujeto va DELANTE del hueco en todos, que es como se dice de verdad
  // («antes de eles saírem») y de paso no dispara el gate de posposición.
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'sair', t: 'infPess', per: 'eles',
    s: 'Antes de eles ___ (sair), quero falar com o gerente.', pista: 'infinitivo pessoal, 3.ª del plural', ancla: 'Antes de eles' },
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'comer', t: 'infPess', per: 'nós',
    s: 'Depois de nós ___ (comer), fomos dar uma volta pelo bairro.', pista: 'infinitivo pessoal, 1.ª del plural', ancla: 'Depois de nós' },
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'ficar', t: 'infPess', per: 'tu',
    s: 'É melhor tu ___ (ficar) em casa até a febre passar.', pista: 'infinitivo pessoal, 2.ª persona', ancla: 'até a febre passar' },
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'perceber', t: 'infPess', per: 'eles',
    s: 'Para vocês ___ (perceber) melhor, vou repetir devagar.', pista: 'infinitivo pessoal, 3.ª del plural («vocês»)', ancla: 'vou repetir devagar' },
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'chegar', t: 'infPess', per: 'tu',
    s: 'No caso de tu ___ (chegar) mais cedo, espera por mim no café.', pista: 'infinitivo pessoal, 2.ª persona', ancla: 'espera por mim' },
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'avisar', t: 'infPess', per: 'nós',
    s: 'Apesar de nós ___ (avisar) toda a gente, ninguém apareceu.', pista: 'infinitivo pessoal, 1.ª del plural', ancla: 'ninguém apareceu' },
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'dar', t: 'infPess', per: 'eles',
    s: 'Sem eles ___ (dar) autorização, não podemos avançar.', pista: 'infinitivo pessoal, 3.ª del plural', ancla: 'não podemos avançar' },
  { p: 'b11-alternancia-infinitivo', pasada: 3, lema: 'ver', t: 'infPess', per: 'tu',
    s: 'Até tu ___ (ver) a casa por dentro, não decidas nada.', pista: 'infinitivo pessoal, 2.ª persona — no el futuro do conjuntivo', ancla: 'não decidas nada' },

  // ser/estar donde el español elige OTRO verbo o el otro miembro.
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'estar', t: 'presente', per: 'ele',
    s: 'Hoje ___ (estar) muito frio; leva um casaco.', pista: 'el español dice «hace frío»; el portugués usa este verbo, 3.ª persona', ancla: 'leva um casaco' },
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'ser', t: 'presente', per: 'ele',
    s: 'Ele ___ (ser) casado há vinte anos e continua feliz.', pista: 'el español dice «está casado»; el portugués usa el otro, 3.ª persona', ancla: 'há vinte anos' },
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'estar', t: 'presente', per: 'ele',
    s: 'A sopa ___ (estar) boa, mas falta-lhe um pouco de sal.', pista: 'estado del plato en este momento, 3.ª persona', ancla: 'falta-lhe um pouco de sal' },
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'ser', t: 'presente', per: 'ele',
    s: 'Ela ___ (ser) professora, mas anda a trabalhar num banco.', pista: 'profesión permanente, 3.ª persona', ancla: 'anda a trabalhar num banco' },
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'estar', t: 'presente', per: 'ele',
    s: '___ (estar) calor lá fora; abre a janela da cozinha.', pista: 'el español dice «hace calor», 3.ª persona', ancla: 'abre a janela' },
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'ser', t: 'presente', per: 'ele',
    s: 'Isto ___ (ser) proibido dentro do comboio.', pista: 'el español dice «está prohibido»; el portugués usa el otro, 3.ª persona', ancla: 'dentro do comboio' },
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'estar', t: 'presente', per: 'nós',
    s: 'Nós ___ (estar) com pressa, falamos logo à noite.', pista: 'el español dice «tenemos prisa», 1.ª del plural', ancla: 'falamos logo à noite' },
  { p: 'b11-ser-estar-divergente', pasada: 3, lema: 'estar', t: 'presente', per: 'tu',
    s: 'Tu ___ (estar) com razão, fui eu que me enganei.', pista: 'el español dice «tienes razón», 2.ª persona', ancla: 'fui eu que me enganei' },

  // ── PASADA 4 · discurso indirecto y subordinadas ─────────────────────
  // La orden referida pide conjuntivo, no imperativo: ésa es la clase.
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'arrumar', t: 'imperfSubj', per: 'ele',
    s: 'A mãe pediu-lhe que ___ (arrumar) o quarto antes do jantar.', pista: 'imperfeito do conjuntivo, 3.ª persona — la orden referida', ancla: 'A mãe pediu-lhe que' },
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'fechar', t: 'imperfSubj', per: 'eles',
    s: 'O professor disse aos alunos que ___ (fechar) os livros.', pista: 'imperfeito do conjuntivo, 3.ª del plural', ancla: 'disse aos alunos que' },
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'beber', t: 'imperfSubj', per: 'eu',
    s: 'O médico recomendou-me que ___ (beber) mais água ao longo do dia.', pista: 'imperfeito do conjuntivo, 1.ª persona', ancla: 'recomendou-me que' },
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'esperar', t: 'imperfSubj', per: 'nós',
    s: 'Ela pediu-nos que ___ (esperar) mais dez minutos.', pista: 'imperfeito do conjuntivo, 1.ª del plural', ancla: 'pediu-nos que' },
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'sair', t: 'imperfSubj', per: 'eles',
    s: 'O guarda ordenou que todos ___ (sair) do edifício.', pista: 'imperfeito do conjuntivo, 3.ª del plural', ancla: 'O guarda ordenou que' },
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'dizer', t: 'imperfSubj', per: 'tu',
    s: 'Pedi-te que não ___ (dizer) nada a ninguém.', pista: 'imperfeito do conjuntivo, 2.ª persona — irregular', ancla: 'Pedi-te que não' },
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'fazer', t: 'imperfSubj', per: 'nós',
    s: 'O treinador insistiu em que nós ___ (fazer) mais dez minutos.', pista: 'imperfeito do conjuntivo, 1.ª del plural — irregular', ancla: 'insistiu em que' },
  { p: 'b8-indireto-imperativo', pasada: 4, lema: 'ter', t: 'imperfSubj', per: 'ele',
    s: 'Disseram-lhe que ___ (ter) paciência e voltasse no dia seguinte.', pista: 'imperfeito do conjuntivo, 3.ª persona — irregular', ancla: 'voltasse no dia seguinte' },

  // Temporales con futuro do conjuntivo: el español pone presente.
  { p: 'b8-sub-adverbiais-tempo', pasada: 4, lema: 'chegar', t: 'futSubj', per: 'tu',
    s: 'Quando ___ (chegar) a casa, manda-me uma mensagem.', pista: 'futuro do conjuntivo, 2.ª persona', ancla: 'manda-me uma mensagem' },
  { p: 'b8-sub-adverbiais-tempo', pasada: 4, lema: 'saber', t: 'futSubj', per: 'eles',
    s: 'Assim que eles ___ (saber) o resultado, avisam-nos.', pista: 'futuro do conjuntivo, 3.ª del plural — irregular', ancla: 'Assim que eles' },
  { p: 'b8-sub-adverbiais-tempo', pasada: 4, lema: 'poder', t: 'futSubj', per: 'nós',
    s: 'Logo que nós ___ (poder), passamos por lá para ver as obras.', pista: 'futuro do conjuntivo, 1.ª del plural — irregular', ancla: 'Logo que nós' },
  { p: 'b8-sub-adverbiais-tempo', pasada: 4, lema: 'haver', t: 'futSubj', per: 'ele',
    s: 'Enquanto ___ (haver) luz, continuamos a trabalhar no quintal.', pista: 'futuro do conjuntivo, 3.ª persona — irregular', ancla: 'continuamos a trabalhar' },

  { p: 'b8-indireto-interrogativa', pasada: 4, lema: 'ser', t: 'imperfeito', per: 'ele',
    s: 'Ele perguntou-me onde ___ (ser) a paragem do autocarro.', pista: 'imperfeito, 3.ª persona — sin inversión ni signo de interrogación', ancla: 'perguntou-me onde' },
  { p: 'b8-indireto-interrogativa', pasada: 4, lema: 'vir', t: 'presente', per: 'ele',
    s: 'Não sei se ela ___ (vir) hoje ou só amanhã de manhã.', pista: 'presente, 3.ª persona — irregular', ancla: 'Não sei se ela' },
  { p: 'b8-indireto-interrogativa', pasada: 4, lema: 'caber', t: 'imperfeito', per: 'eles',
    s: 'Perguntaram-nos quantas pessoas ___ (caber) na sala pequena.', pista: 'imperfeito, 3.ª del plural', ancla: 'Perguntaram-nos quantas pessoas' },

  { p: 'b8-coloc-infinitivo', pasada: 4, r: 'lhe',
    s: 'Vou telefonar-___ amanhã de manhã, antes das dez.', pista: 'a él / a ella — complemento indirecto enclítico al infinitivo', ancla: 'Vou telefonar-' },
  { p: 'b8-coloc-infinitivo', pasada: 4, r: 'nos',
    s: 'Ela prometeu ajudar-___ com a mudança no sábado.', pista: 'a nosotros — enclítico al infinitivo', ancla: 'prometeu ajudar-' },
  { p: 'b8-con-consequencia', pasada: 4, r: 'portanto',
    s: 'Choveu toda a noite; ___, o jogo foi adiado para domingo.', pista: 'por lo tanto', ancla: 'o jogo foi adiado' },
  { p: 'b8-con-consequencia', pasada: 4, r: 'por isso',
    s: 'Ele não estudou nada, ___ chumbou no exame.', pista: 'por eso', ancla: 'chumbou no exame' },
  { p: 'b8-indireto-deicticos', pasada: 4, r: 'naquele',
    s: 'Ela disse: «Hoje estou cansada.» → Ela disse que ___ dia estava cansada.', pista: 'aquel — el deíctico se desplaza al pasar a indirecto', ancla: 'Ela disse que' },
  { p: 'b8-indireto-deicticos', pasada: 4, r: 'ali',
    s: 'Ele disse: «Eu moro aqui.» → Ele disse que morava ___.', pista: 'allí — el deíctico se aleja al pasar a indirecto', ancla: 'Ele disse que morava' },

  // ── PASADA 5 · ortografía y léxico de b1 (respuesta declarada) ───────
  // Aquí el paradigma no llega: la respuesta se declara. La pista es una
  // DEFINICIÓN, no la traducción — una traducción entre lenguas cognadas
  // deletrea la respuesta, y ésa fue la vuelta que costó E2#15.
  { p: 'b1-nasal-n-interior', pasada: 5, r: 'banco',
    s: 'Guardo o dinheiro no ___ e não em casa.', pista: 'la institución donde se deposita el dinero — nasal escrita con n', ancla: 'Guardo o dinheiro' },
  { p: 'b1-nasal-n-interior', pasada: 5, r: 'ponte',
    s: 'Atravessámos a ___ para chegar ao outro lado do rio.', pista: 'lo que cruza un río de orilla a orilla', ancla: 'ao outro lado do rio' },
  { p: 'b1-nasal-n-interior', pasada: 5, r: 'vento',
    s: 'O ___ está muito forte hoje; segura bem o chapéu.', pista: 'el aire en movimiento', ancla: 'segura bem o chapéu' },
  { p: 'b1-nasal-n-interior', pasada: 5, r: 'tinta',
    s: 'Escreveu a carta toda com ___ azul.', pista: 'el líquido con que escribe una pluma', ancla: 'Escreveu a carta' },
  { p: 'b1-nasal-n-interior', pasada: 5, r: 'ontem',
    s: 'Ela chegou ___ à noite e ainda não desfez a mala.', pista: 'el día anterior a hoy', ancla: 'ainda não desfez a mala' },
  { p: 'b1-nasal-n-interior', pasada: 5, r: 'cinco',
    s: 'Faltam ___ minutos para o comboio partir.', pista: 'el número que sigue a cuatro', ancla: 'para o comboio partir' },
  { p: 'b1-nasal-n-interior', pasada: 5, r: 'conta',
    s: 'Pede a ___ ao empregado, se faz favor.', pista: 'el papel que se pide al final de una comida en el restaurante', ancla: 'ao empregado' },

  { p: 'b1-nasal-til', pasada: 5, r: 'mão',
    s: 'Deu-me a ___ e sorriu antes de entrar.', pista: 'la parte del cuerpo con la que se saluda — lleva tilde ondulada', ancla: 'e sorriu antes de entrar' },
  { p: 'b1-nasal-til', pasada: 5, r: 'manhã',
    s: 'De ___ tomo sempre café com leite.', pista: 'la primera parte del día', ancla: 'tomo sempre café com leite' },
  { p: 'b1-nasal-til', pasada: 5, r: 'pão',
    s: 'Comprei ___ fresco na padaria da esquina.', pista: 'lo que se hace con harina y se compra en la panadería', ancla: 'na padaria da esquina' },
  { p: 'b1-nasal-til', pasada: 5, r: 'lição',
    s: 'A ___ de hoje é sobre os verbos irregulares.', pista: 'cada una de las unidades en que se divide un curso', ancla: 'sobre os verbos irregulares' },
  { p: 'b1-nasal-til', pasada: 5, r: 'limões',
    s: 'Os ___ desta árvore são amarelos e muito ácidos.', pista: 'el plural de «limão»', ancla: 'são amarelos e muito ácidos' },

  { p: 'b1-tonica-proparoxitona', pasada: 5, r: 'médico',
    s: 'Fui ao ___ por causa das dores nas costas.', pista: 'quien receta los medicamentos — esdrújula, siempre acentuada', ancla: 'dores nas costas' },
  { p: 'b1-tonica-proparoxitona', pasada: 5, r: 'música',
    s: 'Ouço ___ enquanto trabalho ao computador.', pista: 'lo que se oye en la radio — esdrújula', ancla: 'enquanto trabalho' },
  { p: 'b1-tonica-proparoxitona', pasada: 5, r: 'sábado',
    s: 'Ao ___ vamos sempre ao mercado da praça.', pista: 'el día anterior al domingo — esdrújula', ancla: 'ao mercado da praça' },
  { p: 'b1-tonica-proparoxitona', pasada: 5, r: 'rápido',
    s: 'Este comboio é muito ___: chega em duas horas.', pista: 'lo contrario de lento — esdrújula', ancla: 'chega em duas horas' },
  { p: 'b1-tonica-proparoxitona', pasada: 5, r: 'último',
    s: 'Foi o ___ dia das férias e choveu o tempo todo.', pista: 'el final de una serie — esdrújula', ancla: 'choveu o tempo todo' },

  { p: 'b1-corresp-h-f', pasada: 5, r: 'filho',
    s: 'O meu ___ mais velho estuda medicina em Coimbra.', pista: 'el hijo — la h inicial del español es f en portugués', ancla: 'estuda medicina' },
  { p: 'b1-corresp-h-f', pasada: 5, r: 'farinha',
    s: 'Preciso de ___ e de ovos para fazer o bolo.', pista: 'la harina — h del español, f del portugués', ancla: 'para fazer o bolo' },
  { p: 'b1-corresp-h-f', pasada: 5, r: 'folha',
    s: 'Caiu uma ___ da árvore em cima da mesa.', pista: 'la hoja — h del español, f del portugués', ancla: 'da árvore' },
  { p: 'b1-corresp-h-f', pasada: 5, r: 'ferro',
    s: 'O portão é de ___ pintado de preto.', pista: 'el hierro — h del español, f del portugués', ancla: 'pintado de preto' },

  { p: 'b1-acento-crase', pasada: 5, r: 'à',
    s: 'Vou ___ praia todos os domingos de verão.', pista: 'preposición «a» + artículo femenino: contracción con acento grave', ancla: 'todos os domingos' },
  { p: 'b1-acento-crase', pasada: 5, r: 'à',
    s: 'Entregámos o relatório ___ diretora esta manhã.', pista: 'preposición «a» + artículo femenino: contracción con acento grave', ancla: 'Entregámos o relatório' },
  { p: 'b1-acento-crase', pasada: 5, r: 'à',
    s: 'Chegámos ___ estação mesmo a horas.', pista: 'preposición «a» + artículo femenino: contracción con acento grave', ancla: 'mesmo a horas' },
  { p: 'b1-acento-crase', pasada: 5, r: 'a',
    s: 'Vou ___ Lisboa amanhã de comboio.', pista: 'preposición sola, sin artículo: no lleva acento grave', ancla: 'amanhã de comboio' },
  { p: 'b1-acento-crase', pasada: 5, r: 'a',
    s: 'Ele começou ___ chorar de repente, sem dizer nada.', pista: 'preposición sola delante de infinitivo: no lleva acento grave', ancla: 'sem dizer nada' },
  { p: 'b1-acento-crase', pasada: 5, r: 'às',
    s: 'A reunião de departamento é ___ nove da manhã.', pista: 'preposición «a» + artículo femenino PLURAL, con acento grave', ancla: 'nove da manhã' },

  { p: 'b1-acento-circunflexo', pasada: 5, r: 'avô',
    s: 'O meu ___ tem oitenta anos e ainda conduz.', pista: 'el padre del padre — con acento circunflejo, no agudo', ancla: 'tem oitenta anos' },
  { p: 'b1-acento-circunflexo', pasada: 5, r: 'mês',
    s: 'Estivemos lá o ___ de agosto inteiro.', pista: 'cada una de las doce partes del año — con acento circunflejo', ancla: 'de agosto inteiro' },
  { p: 'b1-acentos', pasada: 5, r: 'café',
    s: 'O ___ da esquina está fechado ao domingo.', pista: 'el establecimiento donde se sirve la bebida negra del desayuno — acento agudo final', ancla: 'está fechado ao domingo' },

  // ── PASADA 6 · verbo, pronombre y conectores sueltos ────────────────
  { p: 'b4-contr-narrativa', pasada: 6, r: 'tocou',
    s: 'Estava a ler tranquilamente quando ___ (tocar) o telefone.', pista: 'pretérito perfeito, 3.ª persona — la acción que interrumpe', ancla: 'Estava a ler' },
  { p: 'b4-contr-narrativa', pasada: 6, r: 'pus',
    s: 'Enquanto ela cozinhava, eu ___ (pôr) a mesa.', pista: 'pretérito perfeito de «pôr», 1.ª persona', ancla: 'Enquanto ela cozinhava' },
  { p: 'b4-contr-narrativa', pasada: 6, r: 'começou',
    s: 'Era de noite e ___ (começar) a chover de repente.', pista: 'pretérito perfeito, 3.ª persona', ancla: 'Era de noite' },
  { p: 'b4-contr-narrativa', pasada: 6, r: 'chegaram',
    s: 'Todos dormiam quando os bombeiros ___ (chegar).', pista: 'pretérito perfeito, 3.ª del plural', ancla: 'Todos dormiam' },

  { p: 'b4-perf-irr-ser-ir', pasada: 6, r: 'fui',
    s: 'Ontem ___ (ir) ao cinema com os meus primos.', pista: 'pretérito perfeito, 1.ª persona — «ser» e «ir» comparten formas', ancla: 'ao cinema com os meus primos' },
  { p: 'b4-perf-irr-ser-ir', pasada: 6, r: 'foi',
    s: 'A viagem ___ (ser) cansativa, mas valeu bem a pena.', pista: 'pretérito perfeito, 3.ª persona', ancla: 'valeu bem a pena' },
  { p: 'b4-perf-irr-ser-ir', pasada: 6, r: 'fomos',
    s: 'Nós ___ (ir) de comboio até ao Porto.', pista: 'pretérito perfeito, 1.ª del plural', ancla: 'de comboio até ao Porto' },
  { p: 'b4-perf-irr-ser-ir', pasada: 6, r: 'foram',
    s: 'Eles ___ (ser) os primeiros a chegar à sala.', pista: 'pretérito perfeito, 3.ª del plural', ancla: 'os primeiros a chegar' },

  { p: 'b4-perf-irr-ive', pasada: 6, r: 'estive',
    s: 'No ano passado eu ___ (estar) em Lisboa duas semanas.', pista: 'pretérito perfeito, 1.ª persona — tema en -ive', ancla: 'No ano passado' },
  { p: 'b4-perf-irr-ive', pasada: 6, r: 'tivemos',
    s: 'Nós ___ (ter) de mudar a data por causa da chuva.', pista: 'pretérito perfeito, 1.ª del plural — tema en -ive', ancla: 'por causa da chuva' },
  { p: 'b4-perf-irr-ive', pasada: 6, r: 'estiveram',
    s: 'Eles ___ (estar) à espera mais de uma hora.', pista: 'pretérito perfeito, 3.ª del plural — tema en -ive', ancla: 'mais de uma hora' },
  { p: 'b4-perf-irr-u', pasada: 6, r: 'pude',
    s: 'Eu não ___ (poder) ir à festa por causa do trabalho.', pista: 'pretérito perfeito, 1.ª persona — tema en -ude', ancla: 'por causa do trabalho' },
  { p: 'b4-perf-irr-u', pasada: 6, r: 'soube',
    s: 'Ela só ___ (saber) a notícia no dia seguinte.', pista: 'pretérito perfeito, 3.ª persona — tema en -oube', ancla: 'no dia seguinte' },
  { p: 'b4-perf-ir', pasada: 6, r: 'partimos',
    s: 'Nós ___ (partir) às seis da manhã, ainda de noite.', pista: 'pretérito perfeito regular de -ir, 1.ª del plural', ancla: 'ainda de noite' },
  { p: 'b4-perf-ir', pasada: 6, r: 'decidiram',
    s: 'Eles ___ (decidir) mudar de casa no fim do ano.', pista: 'pretérito perfeito regular de -ir, 3.ª del plural', ancla: 'no fim do ano' },
  { p: 'b4-perfeito-regular', pasada: 6, r: 'comprei',
    s: 'Ontem eu ___ (comprar) o pão na padaria nova.', pista: 'pretérito perfeito regular de -ar, 1.ª persona', ancla: 'na padaria nova' },
  { p: 'b4-perfeito-regular', pasada: 6, r: 'comeram',
    s: 'Vocês ___ (comer) tudo o que estava na mesa.', pista: 'pretérito perfeito regular de -er, 3.ª del plural', ancla: 'tudo o que estava na mesa' },

  { p: 'b4-mais-que-perfeito', pasada: 6, lema: 'partir', t: 'mqp', per: 'ele',
    s: 'Ele já ___ (partir) quando tu telefonaste.', pista: 'ya había salido — mais-que-perfeito composto', ancla: 'quando tu telefonaste' },
  { p: 'b4-mais-que-perfeito', pasada: 6, lema: 'falar', t: 'mqp', per: 'nós',
    s: 'Nós já ___ (falar) com ela antes da reunião começar.', pista: 'ya habíamos hablado — mais-que-perfeito composto', ancla: 'antes da reunião começar' },
  { p: 'b4-mais-que-perfeito', pasada: 6, lema: 'ver', t: 'mqp', per: 'eu',
    s: 'Eu ___ (ver) esse filme muito antes de mo recomendarem.', pista: 'había visto — mais-que-perfeito composto', ancla: 'antes de mo recomendarem' },

  { p: 'b3-pres-irr-ir-dar-ver', pasada: 6, lema: 'dar', t: 'presente', per: 'eu',
    s: 'Eu ___ (dar) sempre um passeio depois do jantar.', pista: 'presente, 1.ª persona — irregular', ancla: 'depois do jantar' },
  { p: 'b3-pres-irr-ir-dar-ver', pasada: 6, lema: 'ver', t: 'presente', per: 'eles',
    s: 'Vocês ___ (ver) televisão à noite ou preferem ler?', pista: 'presente, 3.ª del plural — irregular', ancla: 'ou preferem ler' },
  { p: 'b3-pres-irr-ter-vir', pasada: 6, lema: 'vir', t: 'presente', per: 'eles',
    s: 'Eles ___ (vir) cá a casa todos os domingos.', pista: 'presente, 3.ª del plural — irregular', ancla: 'todos os domingos' },
  { p: 'b3-pres-irr-ter-vir', pasada: 6, lema: 'ter', t: 'presente', per: 'tu',
    s: 'Tu ___ (ter) toda a razão nisso que dizes.', pista: 'presente, 2.ª persona — irregular', ancla: 'nisso que dizes' },
  { p: 'b3-presente-irregular', pasada: 6, lema: 'fazer', t: 'presente', per: 'eu',
    s: 'Hoje eu ___ (fazer) o jantar; descansa tu.', pista: 'presente, 1.ª persona — irregular', ancla: 'descansa tu' },
  { p: 'b3-presente-irregular', pasada: 6, lema: 'dizer', t: 'presente', per: 'ele',
    s: 'Ela ___ (dizer) sempre a verdade, custe o que custar.', pista: 'presente, 3.ª persona — irregular', ancla: 'custe o que custar' },
  { p: 'b3-pres-er', pasada: 6, lema: 'beber', t: 'presente', per: 'nós',
    s: 'Nós ___ (beber) sempre água à refeição.', pista: 'presente regular de -er, 1.ª del plural', ancla: 'à refeição' },

  // b3-pron-directo NO va en este lote: 7 ítems escritos y aparcados con
  // su diagnóstico. Un cloze de clítico de OD necesita el antecedente en
  // la frase («Compraste o jornal? — comprei-___»), y en portugués el
  // clítico es HOMÓGRAFO del artículo que lo precede, así que la
  // respuesta —`o`, `a`, `os`, `as`— está siempre escrita ahí al lado. El
  // gate de fuga no es un falso positivo: acierta. Y la pista en español
  // tampoco sirve, porque «la revista» contiene la respuesta `a`. No es
  // un ítem que se arregle: es el formato el que no sirve para este
  // punto, y queda anotado como override en `formato-punto.ts`.
  { p: 'b3-pron-preposicionado', pasada: 6, r: 'ti',
    s: 'Este presente é para ___, não é para o teu irmão.', pista: 'la forma que toma «tu» detrás de preposición', ancla: 'não é para o teu irmão' },
  { p: 'b3-pron-preposicionado', pasada: 6, r: 'comigo',
    s: 'Queres vir ___ ao mercado logo de manhã?', pista: 'conmigo — en una sola palabra', ancla: 'ao mercado logo de manhã' },
  { p: 'b3-pronomes', pasada: 6, r: 'me',
    s: 'Ela deu-___ um livro no dia dos meus anos.', pista: 'a mí — complemento indirecto', ancla: 'no dia dos meus anos' },

  { p: 'b5-futuro-composto', pasada: 6, r: 'teremos terminado',
    s: 'Até ao fim do mês nós já ___ (terminar) as obras da cozinha.', pista: 'futuro composto, 1.ª del plural: «ter» en futuro + particípio', ancla: 'Até ao fim do mês' },
  { p: 'b5-futuro-composto', pasada: 6, r: 'terão saído',
    s: 'Quando chegares, eles já ___ (sair) para o aeroporto.', pista: 'futuro composto, 3.ª del plural: «ter» en futuro + particípio', ancla: 'Quando chegares' },
  { p: 'b5-cond-cortesia', pasada: 6, lema: 'poder', t: 'condicional', per: 'ele',
    s: '___ (poder) o senhor repetir a última frase, se faz favor?', pista: 'condicional, 3.ª persona — la forma de cortesía', ancla: 'se faz favor' },
  { p: 'b6-imperf-subj-correlacao', pasada: 6, lema: 'ir', t: 'imperfSubj', per: 'eu',
    s: 'Ele queria que eu ___ (ir) com ele ao médico.', pista: 'imperfeito do conjuntivo, 1.ª persona — lo pide el pasado de la principal', ancla: 'Ele queria que eu' },
  { p: 'b6-imperf-subj-correlacao', pasada: 6, lema: 'poder', t: 'imperfSubj', per: 'eles',
    s: 'Foi pena que eles não ___ (poder) vir ao casamento.', pista: 'imperfeito do conjuntivo, 3.ª del plural', ancla: 'ao casamento' },
  { p: 'b6-imperfeito-subj', pasada: 6, lema: 'ser', t: 'imperfSubj', per: 'eu',
    s: 'Se eu ___ (ser) mais paciente, não discutia tanto com eles.', pista: 'imperfeito do conjuntivo, 1.ª persona — irregular', ancla: 'não discutia tanto' },
  { p: 'b6-presente-subj', pasada: 6, lema: 'correr', t: 'presSubj', per: 'ele',
    s: 'Espero que ___ (correr) tudo bem amanhã na entrevista.', pista: 'presente do conjuntivo, 3.ª persona', ancla: 'na entrevista' },
  { p: 'b6-presente-subj', pasada: 6, lema: 'mudar', t: 'presSubj', per: 'nós',
    s: 'Talvez nós ___ (mudar) de ideias até lá.', pista: 'presente do conjuntivo, 1.ª del plural', ancla: 'até lá' },
  { p: 'b6-contr-certeza-indicativo', pasada: 6, lema: 'vir', t: 'presente', per: 'ele',
    s: 'Tenho a certeza de que ele ___ (vir) hoje ao ensaio.', pista: 'presente de INDICATIVO, 3.ª persona — la certeza no pide conjuntivo', ancla: 'Tenho a certeza' },
  { p: 'b7-part-passiva', pasada: 6, r: 'foi construída',
    s: 'A ponte ___ (construir) no século XIX por engenheiros franceses.', pista: 'pasiva con «ser» en pretérito + particípio concordando con «a ponte»', ancla: 'por engenheiros franceses' },
  { p: 'b7-part-passiva', pasada: 6, r: 'foram enviados',
    s: 'Os documentos ___ (enviar) ontem por correio registado.', pista: 'pasiva con «ser» en pretérito + particípio concordando con «os documentos»', ancla: 'por correio registado' },
];

if (process.argv[1]?.includes('cloze-e2-16')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x, i) => ({ ...x, id: `cl16-${String(i + 1).padStart(3, '0')}`, answer: respuestaDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Cloze E2#16 — ${ITEMS.length} ítems · ${porPunto.size} puntos\n`);
  console.log('| punto | ítems | derivados | declarados |');
  console.log('|---|---:|---:|---:|');
  for (const [p, n] of porPunto) {
    const xs = ITEMS.filter((x) => x.p === p);
    console.log(`| \`${p}\` | ${n} | ${xs.filter((x) => !x.r).length} | ${xs.filter((x) => x.r).length} |`);
  }
  console.log(`\n## Gates\n`);
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

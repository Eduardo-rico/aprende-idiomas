// tests/unit/answers-match-final.test.ts
//
// EL SIGNO FINAL DE LA CLAVE ES OPCIONAL, y sólo ése.
//
// Lo destapó una auditoría del primer lote de transformación: 7 de 24
// respuestas eran frases enteras terminadas en punto, y la comparación lo
// exigía. Quien hacía la transformación PERFECTA sin poner el punto
// quedaba suspendido, y ese fallo entra en el FSRS y hunde el mastery de
// un punto que el alumno sí sabe — la misma familia que el cloze sin
// pista y el multi-hueco.
//
// El barrido posterior encontró que el agujero era mucho mayor: **560
// traducciones publicadas** tienen la clave terminada en signo y
// `TranslationCard` comparaba en crudo, sin NFC ni recorte de la clave.
import { describe, it, expect } from 'vitest';
import { answersMatchFinal, answersMatch, answersMatchCard } from '@/lib/exercises/normalize';

describe('answersMatchFinal', () => {
  it('acepta la respuesta con y sin el punto final de la clave', () => {
    expect(answersMatchFinal('Comprei-a na estação.', 'Comprei-a na estação.')).toBe(true);
    expect(answersMatchFinal('Comprei-a na estação', 'Comprei-a na estação.')).toBe(true);
    expect(answersMatchFinal('comprei-a na estação', 'Comprei-a na estação.')).toBe(true);
  });

  it('NO acepta un signo terminal distinto del de la clave', () => {
    // Si se ignorara todo signo final, una transformación de afirmativa a
    // interrogativa dejaría de medirse: ahí el «?» ES la respuesta.
    expect(answersMatchFinal('Comprei-a na estação?', 'Comprei-a na estação.')).toBe(false);
    expect(answersMatchFinal('Comprei-a na estação!', 'Comprei-a na estação.')).toBe(false);
    expect(answersMatchFinal('Vieste.', 'Vieste?')).toBe(false);
    expect(answersMatchFinal('Vieste', 'Vieste?')).toBe(true);
  });

  // LA MITAD SIMÉTRICA, que faltaba (rumano, lote 23). El arreglo
  // original cubría «la clave lleva punto y el alumno no lo pone» y
  // dejaba abierta «la clave lleva ADMIRACIÓN y el alumno pone punto» —
  // los ocho imperativos rumanos tienen la clave en `!` y el rumano
  // escribe imperativos con punto rutinariamente («și stai lângă mine.»,
  // en el corpus del proyecto).
  it('con la clave en «!», acepta también el punto y la ausencia de signo', () => {
    expect(answersMatchFinal('Mergi la piață!', 'Mergi la piață!')).toBe(true);
    expect(answersMatchFinal('Mergi la piață.', 'Mergi la piață!')).toBe(true);
    expect(answersMatchFinal('Mergi la piață', 'Mergi la piață!')).toBe(true);
    // Y lo que NO cambia: la frase tiene que ser la misma.
    expect(answersMatchFinal('Du-te la piață.', 'Mergi la piață!')).toBe(false);
  });

  it('el «?» sigue siendo ESTRICTO: ahí el signo ES la respuesta', () => {
    // La razón por la que esto no se generalizó a todo signo terminal: en
    // una transformación de afirmativa a interrogativa, aceptar el punto
    // haría que el ítem no pudiera fallar nunca.
    expect(answersMatchFinal('Vieste.', 'Vieste?')).toBe(false);
    expect(answersMatchFinal('Vieste!', 'Vieste?')).toBe(false);
    // Y la clave en punto tampoco acepta la admiración: la apertura es en
    // UNA dirección, no en las dos.
    expect(answersMatchFinal('Comprei-a na estação!', 'Comprei-a na estação.')).toBe(false);
  });

  it('sigue exigiendo los acentos, que en portugués son lengua', () => {
    expect(answersMatchFinal('falara', 'falará')).toBe(false);
    expect(answersMatchFinal('estao', 'estão')).toBe(false);
  });

  it('normaliza NFC y recorta las dos partes', () => {
    // «ã» descompuesto (a + tilde combinante) es lo que escriben algunas
    // configuraciones de teclado y lo que `===` rechazaba.
    expect(answersMatchFinal('estão'.normalize('NFD'), 'estão')).toBe(true);
    expect(answersMatchFinal('  estão  ', 'estão ')).toBe(true);
  });

  it('coincide con answersMatch cuando la clave no lleva signo final', () => {
    for (const [a, b] of [['falo', 'falo'], ['falo', 'falas'], ['estão', 'estao']])
      expect(answersMatchFinal(a!, b!)).toBe(answersMatch(a!, b!));
  });
});

describe('answersMatchCard: la coma de la adversativa', () => {
  it('acepta la respuesta con coma cuando la clave no la lleva', () => {
    expect(answersMatchCard('Portugal é um país pequeno, mas variado.',
                            'Portugal é um país pequeno mas variado.')).toBe(true);
  });
  it('acepta la respuesta sin coma cuando la clave sí la lleva', () => {
    expect(answersMatchCard('Estudei muito mas não passei na prova.',
                            'Estudei muito, mas não passei na prova.')).toBe(true);
  });
  it('vale para porém, contudo y todavia', () => {
    expect(answersMatchCard('Tentei, porém falhei.', 'Tentei porém falhei.')).toBe(true);
    expect(answersMatchCard('Tentei contudo falhei.', 'Tentei, contudo falhei.')).toBe(true);
  });
  it('NO toca la parentética: ahí las dos comas son un par', () => {
    expect(answersMatchCard('Ele porém, não veio.', 'Ele, porém, não veio.')).toBe(false);
  });
  it('sigue distinguiendo todo lo demás: acento, signo final y palabra', () => {
    // «más» (malas) no es «mas» (pero): el acento se conserva.
    expect(answersMatchCard('Notas más, mas passei.', 'Notas mas, mas passei.')).toBe(false);
    expect(answersMatchCard('Estudei muito mas não passei?', 'Estudei muito, mas não passei.')).toBe(false);
    expect(answersMatchCard('Estudei pouco mas não passei.', 'Estudei muito, mas não passei.')).toBe(false);
  });
  it('no cambia nada en una frase sin adversativa', () => {
    for (const [a, b] of [['Comprei-a na estação', 'Comprei-a na estação.'], ['Vieste.', 'Vieste?']]) {
      expect(answersMatchCard(a!, b!)).toBe(answersMatchFinal(a!, b!));
    }
  });
});

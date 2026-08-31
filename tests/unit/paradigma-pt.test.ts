// tests/unit/paradigma-pt.test.ts
//
// El conjugador es el GATE de la familia industrial de paradigma: si se
// equivoca, el lote entero sale con formas inventadas y el gate las
// bendice. Así que se prueba contra las formas canónicas, incluidas las
// que la regla ingenua rompe.
import { describe, it, expect } from 'vitest';
import { futuro, condicional, participio, futuroComposto, mesoclise, enclise, proclise } from '@/scripts/lib/paradigma-pt';

describe('futuro y condicional', () => {
  it('se forman sobre el infinitivo ENTERO', () => {
    expect(futuro('falar', 'eu')).toBe('falarei');
    expect(futuro('comer', 'tu')).toBe('comerás');
    expect(futuro('partir', 'eles')).toBe('partirão');
    expect(condicional('falar', 'nós')).toBe('falaríamos');
    expect(condicional('ver', 'ele')).toBe('veria');   // ver es REGULAR aquí
  });

  it('sólo dizer, fazer y trazer son irregulares', () => {
    expect(futuro('dizer', 'eu')).toBe('direi');
    expect(futuro('fazer', 'ele')).toBe('fará');
    expect(futuro('trazer', 'eles')).toBe('trarão');
    expect(condicional('dizer', 'eu')).toBe('diria');
    expect(condicional('fazer', 'nós')).toBe('faríamos');
  });
});

describe('participio y futuro composto', () => {
  it('regulares por conjugación', () => {
    expect(participio('falar')).toBe('falado');
    expect(participio('comer')).toBe('comido');
    expect(participio('partir')).toBe('partido');
  });

  // Con vocal antes de la desinencia hay HIATO y el participio lleva
  // acento: sa-í-do, ca-í-do. La regla ingenua («-er/-ir → -ido») da
  // «saido», que no existe. Lo cazó el gate del lote contra el propio
  // conjugador, antes de que el ítem se publicara.
  it('acentúa el hiato: saído, caído, traído', () => {
    expect(participio('sair')).toBe('saído');
    expect(participio('cair')).toBe('caído');
    expect(participio('trair')).toBe('traído');
    expect(participio('possuir')).toBe('possuído');
  });

  it('pero NO cuando la vocal no hace hiato', () => {
    expect(participio('partir')).toBe('partido');
    expect(participio('servir')).toBe('servido');
    expect(participio('seguir')).toBe('seguido');   // la «u» de «gu» es muda
    expect(participio('construir')).toBe('construído');  // ésta sí hace hiato
  });

  it('los irregulares declarados, no adivinados', () => {
    expect(participio('fazer')).toBe('feito');
    expect(participio('dizer')).toBe('dito');
    expect(participio('ver')).toBe('visto');
    expect(participio('pôr')).toBe('posto');
    expect(participio('escrever')).toBe('escrito');
  });

  it('futuro composto = ter en futuro + participio', () => {
    expect(futuroComposto('falar', 'eu')).toBe('terei falado');
    expect(futuroComposto('fazer', 'eles')).toBe('terão feito');
    expect(futuroComposto('partir', 'nós')).toBe('teremos partido');
  });
});

describe('mesóclise — el clítico va DENTRO', () => {
  it('con clítico de 1.ª/2.ª el tema queda intacto', () => {
    expect(mesoclise('falar', 'me', 'ele')).toBe('falar-me-á');
    expect(mesoclise('dar', 'te', 'eu')).toBe('dar-te-ei');
    expect(mesoclise('escrever', 'lhe', 'eles')).toBe('escrever-lhe-ão');
  });

  it('con clítico de 3.ª cae la -r y aparece -lo/-la', () => {
    expect(mesoclise('comprar', 'o', 'ele')).toBe('comprá-lo-á');
    expect(mesoclise('vender', 'a', 'eu')).toBe('vendê-la-ei');
  });

  // La excepción que la regla ingenua esconde: los -ir NO llevan acento.
  // «Tras -r cae la consonante y el verbo se acentúa» es falso para
  // parti-lo, abri-la — y los tres ejemplos que uno pone de cabeza son
  // siempre -ar/-er.
  it('los verbos en -ir NO se acentúan: parti-lo, abri-la', () => {
    expect(mesoclise('partir', 'o', 'ele')).toBe('parti-lo-á');
    expect(mesoclise('abrir', 'a', 'eu')).toBe('abri-la-ei');
  });

  // …salvo cuando hay HIATO, que es la misma excepción que el participio
  // ya conocía tres funciones más arriba y que `fundirConR` olvidaba:
  // constru-í-lo, possu-í-lo, atra-í-lo. Bug latente, cazado por el round
  // del lote — ningún ítem lo ejercía, pero la glosa de uno documentaba
  // la regla falsa que el bug implementaba.
  it('pero SÍ los -ir con hiato: construí-lo, possuí-la, atraí-lo', () => {
    expect(mesoclise('construir', 'o', 'ele')).toBe('construí-lo-á');
    expect(mesoclise('possuir', 'a', 'eu')).toBe('possuí-la-ei');
    expect(mesoclise('atrair', 'o', 'eles')).toBe('atraí-lo-ão');
  });

  it('los tres irregulares mesoclizan sobre su raíz corta', () => {
    expect(mesoclise('dizer', 'te', 'eu')).toBe('dir-te-ei');
    expect(mesoclise('fazer', 'lhe', 'ele')).toBe('far-lhe-á');
  });

  // La v1 afirmaba «dir-lo-ão» y el test la bendecía: forma inexistente,
  // suite en verde. A los irregulares les aplica la MISMA regla que a los
  // demás, porque dir-, far- y trar- acaban en -r los tres.
  it('y con clítico de 3.ª también pierden la -r: di-lo, fá-lo, trá-lo', () => {
    expect(mesoclise('dizer', 'o', 'eles')).toBe('di-lo-ão');
    expect(mesoclise('fazer', 'o', 'ele')).toBe('fá-lo-á');
    expect(mesoclise('trazer', 'as', 'nós', 'condicional')).toBe('trá-las-íamos');
  });

  it('también en condicional', () => {
    expect(mesoclise('falar', 'me', 'ele', 'condicional')).toBe('falar-me-ia');
    expect(mesoclise('dizer', 'te', 'nós', 'condicional')).toBe('dir-te-íamos');
  });
});

describe('las formas con las que se construyen los distractores honestos', () => {
  it('ênclise: el calco del hispanohablante', () => {
    expect(enclise(futuro('falar', 'ele'), 'me')).toBe('falará-me');
  });

  it('próclise: lo que un atractor impone, y que CANCELA la mesóclise', () => {
    expect(proclise('me', futuro('falar', 'ele'))).toBe('me falará');
  });
});

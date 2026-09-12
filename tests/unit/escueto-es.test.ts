// tests/unit/escueto-es.test.ts — LA FORMA SIN DETERMINANTE.
//
// El latín no tiene artículo, así que «bella» es «las guerras», «unas
// guerras» o «guerras». La pareja definido ↔ indefinido se deriva sola;
// la escueta NO, porque en español depende de la posición sintáctica y del
// número. Aceptarla en bloque publicaría español agramatical como clave
// buena; no aceptarla suspende a quien traduce bien.
import { describe, it, expect } from 'vitest';
import { admiteEscueto, escuetoDe, alternativaEscueta } from '@/scripts/lib/escueto-es';
import { LOTE_NEUTRO_A } from '@/lib/data/languages/la/lotes/l2-neutro-a';
import { LOTE_PLURAL_TANTUM } from '@/lib/data/languages/la/lotes/l2-plural-tantum';

describe('dónde admite el español el sintagma escueto', () => {
  it('SÍ en objeto y plural', () => {
    expect(admiteEscueto('El rey ve ___.', 'las guerras')).toBe(true);
    expect(admiteEscueto('El esclavo lleva ___.', 'los regalos')).toBe(true);
    expect(admiteEscueto('El rey guía ___.', 'unas tropas')).toBe(true);
  });

  it('NO en sujeto, ni tras preposición, ni en singular contable', () => {
    expect(admiteEscueto('___ es grande.', 'la abundancia')).toBe(false);
    expect(admiteEscueto('Está en ___.', 'la oscuridad')).toBe(false);
    expect(admiteEscueto('Va a ___.', 'las tierras')).toBe(false);
    expect(admiteEscueto('El poeta lee ___.', 'la letra')).toBe(false);
    // «ama a hijos» no es español: el «a» va dentro de la respuesta.
    expect(admiteEscueto('La madre ama ___.', 'a los hijos')).toBe(false);
  });

  // ⚠ EL FALLO QUE COSTÓ ENCONTRAR Y QUE NO DABA NINGÚN SÍNTOMA.
  it('el límite de palabra es UNICODE: «guía» no acaba en la preposición «a»', () => {
    // Con `\b`, JavaScript define la frontera sobre [A-Za-z0-9_], así que
    // la «í» no es letra y hay frontera entre «guí» y «a»: el ítem perdía
    // su alternativa en silencio. Mismo caso con «í», «á», «é», «ñ».
    expect(admiteEscueto('El rey guía ___.', 'las tropas')).toBe(true);
    expect(admiteEscueto('El niño envía ___.', 'unas cartas')).toBe(true);
    expect(admiteEscueto('El señor compró ___.', 'los campos')).toBe(true);
    // Y la preposición de verdad sigue cazándose.
    expect(admiteEscueto('Habla de ___.', 'las guerras')).toBe(false);
  });

  it('el escueto quita el determinante y nada más', () => {
    expect(escuetoDe('las guerras')).toBe('guerras');
    expect(escuetoDe('unos regalos')).toBe('regalos');
    expect(escuetoDe('la letra')).toBe('la letra');
  });
});

describe('los dos lotes lo aplican, y NO tocan el rasgo que examinan', () => {
  it('ninguna alternativa cambia el NÚMERO de la clave', () => {
    // Es la condición que hace publicables estos dos lotes: el punto de
    // `l2-neutro-a` es que «-a» es neutro PLURAL y no femenino singular,
    // y el de `l2-plural-tantum` es el número del sentido español. Si una
    // alternativa cambiara el número, el ítem dejaría de poder fallar.
    const plural = (s: string) => /(^|\s)(los|las|unos|unas)\s|s$/iu.test(s.trim());
    for (const it of [...LOTE_NEUTRO_A, ...LOTE_PLURAL_TANTUM])
      for (const a of it.alternativas ?? [])
        expect(plural(a), `${it.id}: «${it.respuesta}» → «${a}» cambia el número`).toBe(plural(it.respuesta));
  });

  it('y ninguna se inventa: o es la escueta derivada, o está declarada a mano', () => {
    for (const it of [...LOTE_NEUTRO_A, ...LOTE_PLURAL_TANTUM]) {
      const derivadas = alternativaEscueta(it.glosa, it.respuesta);
      for (const a of it.alternativas ?? [])
        expect(derivadas.includes(a) || it.respuesta.includes(a), `${it.id}: «${a}»`).toBe(true);
    }
  });
});

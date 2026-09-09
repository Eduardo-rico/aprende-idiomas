// tests/unit/pasiva-la.test.ts
//
// La voz pasiva del infectum. Nueve puntos del inventario la piden y la
// máquina no la tenía; lo destapó la auditoría inversa —10.669 tokens
// anotados `Voice=Pass` y cero producidos—.
import { describe, it, expect } from 'vitest';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { conjugarPasiva, pasivaInfectum, conjugar } from '@/lib/data/languages/la/paradigma-la';
import type { Persona, Tiempo } from '@/lib/data/languages/la/paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

// Las formas que el corpus trae, una a una. No es una muestra: son todas
// las pasivas de infectum atestiguadas de los verbos del lexicón.
const ATESTIGUADAS: [string, Persona, Tiempo, string][] = [
  ['videō', '1sg', 'presente', 'videor'], ['videō', '3sg', 'presente', 'vidētur'],
  ['videō', '1pl', 'presente', 'vidēmur'], ['videō', '1sg', 'imperfecto', 'vidēbar'],
  ['videō', '3sg', 'imperfecto', 'vidēbātur'], ['videō', '3pl', 'imperfecto', 'vidēbantur'],
  ['videō', '3sg', 'futuro', 'vidēbitur'], ['videō', '1pl', 'futuro', 'vidēbimur'],
  ['videō', '3pl', 'futuro', 'vidēbuntur'], ['dūcō', '3sg', 'presente', 'dūcitur'],
  ['dūcō', '2pl', 'presente', 'dūciminī'], ['dūcō', '3pl', 'presente', 'dūcuntur'],
  ['dūcō', '2pl', 'imperfecto', 'dūcēbāminī'], ['dūcō', '2pl', 'futuro', 'dūcēminī'],
  ['dūcō', '3pl', 'futuro', 'dūcentur'], ['mittō', '3sg', 'presente', 'mittitur'],
  ['mittō', '3sg', 'futuro', 'mittētur'], ['audiō', '3sg', 'presente', 'audītur'],
  ['audiō', '3sg', 'futuro', 'audiētur'], ['portō', '3sg', 'futuro', 'portābitur'],
  ['portō', '3sg', 'imperfecto', 'portābātur'], ['amō', '1pl', 'presente', 'amāmur'],
  ['capiō', '3pl', 'imperfecto', 'capiēbantur'],
];

describe('la pasiva del infectum', () => {
  it.each(ATESTIGUADAS)('%s %s %s → %s', (lema, p, t, esperada) => {
    expect(conjugarPasiva(V(lema), p, t)).toBe(esperada);
  });

  it('las cinco clases dan paradigma completo', () => {
    for (const l of ['amō', 'videō', 'legō', 'audiō', 'capiō']) {
      const p = pasivaInfectum(V(l));
      expect(Object.keys(p)).toHaveLength(18);
      for (const [k, f] of Object.entries(p)) expect(f, `${l} ${k}`).toBeTruthy();
    }
  });
});

describe('LA TERCERA DEL SINGULAR NO SE DERIVA DE LA TERCERA DEL SINGULAR', () => {
  it('el activo acortó su vocal ante la -t final y el pasivo la recupera', () => {
    // «videt» tiene `e` breve por la ley de la brevis brevians; «vidētur»
    // la tiene larga porque la `t` ya no es final. Sustituir `-t` por `-tur`
    // daba *«videtur»: seis formas mal de veintitrés, todas la misma.
    expect(conjugar(V('videō'), '3sg', 'presente')).toBe('videt');
    expect(conjugarPasiva(V('videō'), '3sg', 'presente')).toBe('vidētur');
    expect(conjugar(V('audiō'), '3sg', 'presente')).toBe('audit');
    expect(conjugarPasiva(V('audiō'), '3sg', 'presente')).toBe('audītur');
  });

  it('y sale de la 2.ª del plural, que no sufre el acortamiento', () => {
    for (const l of ['videō', 'audiō', 'portō', 'mittō', 'legō', 'capiō'])
      for (const t of ['presente', 'imperfecto', 'futuro'] as Tiempo[]) {
        const dosPl = conjugar(V(l), '2pl', t);
        expect(conjugarPasiva(V(l), '3sg', t), `${l} ${t}`).toBe(`${dosPl.slice(0, -3)}tur`);
      }
  });

  it('las demás celdas SÍ salen de su propia activa', () => {
    expect(conjugarPasiva(V('videō'), '1sg', 'presente')).toBe('videor');   // videō → videor
    expect(conjugarPasiva(V('videō'), '1pl', 'presente')).toBe('vidēmur');  // vidēmus → vidēmur
    expect(conjugarPasiva(V('videō'), '3pl', 'presente')).toBe('videntur'); // vident → videntur
  });
});

describe('la única alternancia: la -i- breve ante «-ris»', () => {
  it('«legis» → «legeris», «capis» → «caperis», «amābis» → «amāberis»', () => {
    expect(conjugarPasiva(V('legō'), '2sg', 'presente')).toBe('legeris');
    expect(conjugarPasiva(V('capiō'), '2sg', 'presente')).toBe('caperis');
    expect(conjugarPasiva(V('amō'), '2sg', 'futuro')).toBe('amāberis');
  });

  it('y con vocal larga no pasa nada', () => {
    expect(conjugarPasiva(V('amō'), '2sg', 'presente')).toBe('amāris');
    expect(conjugarPasiva(V('videō'), '2sg', 'presente')).toBe('vidēris');
    expect(conjugarPasiva(V('audiō'), '2sg', 'presente')).toBe('audīris');
  });
});

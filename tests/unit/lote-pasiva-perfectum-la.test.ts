// tests/unit/lote-pasiva-perfectum-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_PASIVA_PERFECTUM } from '@/lib/data/languages/la/lotes/l6-pasiva-perfectum';
import {
  AUXILIAR_ESPANOL, LECTURA_LITERAL, VALOR_DEL_AUXILIAR, copiarElGeneroLatino,
  coberturaPerfectum, generoDeLaRespuesta, parAtestiguado, participioConcertado,
  revisarItemPerfectum, revisarLotePerfectum, siemprePerfecto, tasasCiegasPerfectum,
  type ItemPerfectum,
} from '@/scripts/lib/gate-pasiva-perfectum';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_PASIVA_PERFECTUM.find((i) => i.id === 'la-pf-01')!;
const con = (p: Partial<ItemPerfectum>): ItemPerfectum => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemPerfectum) => revisarItemPerfectum(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLotePerfectum(LOTE_PASIVA_PERFECTUM).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y los trece pares están atestiguados en el corpus', () => {
    for (const i of LOTE_PASIVA_PERFECTUM)
      expect(parAtestiguado(i.participio, i.auxiliar), `${i.participio} ${i.auxiliar}`).toBeGreaterThan(0);
  });
});

describe('POR QUÉ el gate NO mide la lectura literal', () => {
  it('«es/era/será» no es admisible en NINGUNO de los seis auxiliares', () => {
    // Si lo midiera, daría 0 % siempre, y un cero que no puede ser otra
    // cosa se lee como una garantía sin serlo.
    for (const [aux, literal] of Object.entries(LECTURA_LITERAL)) {
      const v = VALOR_DEL_AUXILIAR[aux as keyof typeof VALOR_DEL_AUXILIAR];
      expect(AUXILIAR_ESPANOL[v.tiempo][v.numero], aux).not.toContain(literal);
    }
  });

  it('ni el masculino singular coincide con ninguna otra casilla', () => {
    const v = V('faciō');
    const casillas = (['m', 'f', 'n'] as const).flatMap((g) => (['sg', 'pl'] as const).map((n) => participioConcertado(v, g, n)));
    const mascSg = participioConcertado(v, 'm', 'sg');
    expect(casillas.filter((c) => c === mascSg)).toHaveLength(1);
  });

  it('y «contestar siempre en perfecto» hay que medirlo sobre el lote ENTERO', () => {
    // Sobre «los que no son perfecto» daría 0 % por construcción: contra un
    // pluscuamperfecto, la respuesta en perfecto nunca es la buena.
    const noPerf = LOTE_PASIVA_PERFECTUM.filter((i) => i.ejes.tiempo !== 'perfecto');
    expect(noPerf.length).toBeGreaterThan(0);
    expect(noPerf.filter((i) => siemprePerfecto(i) === i.respuesta)).toHaveLength(0);
    // Y sobre el lote entero mide lo que hay que medir: la mayoría.
    const t = tasasCiegasPerfectum(LOTE_PASIVA_PERFECTUM);
    expect(t.siemprePerfecto.decididos).toBe(LOTE_PASIVA_PERFECTUM.length);
    expect(t.siemprePerfecto.tasa).toBeLessThanOrEqual(0.5);
  });
});

describe('la ciega que sí muerde: copiar el género latino', () => {
  it('el neutro latino se copia como masculino español', () => {
    expect(copiarElGeneroLatino(con({ ejes: { ...base.ejes, genero: 'n' } }))).toBe('m');
    expect(copiarElGeneroLatino(con({ ejes: { ...base.ejes, genero: 'f' } }))).toBe('f');
  });
  it('y el lote la deja por debajo de su listón', () => {
    expect(tasasCiegasPerfectum(LOTE_PASIVA_PERFECTUM).copiarElGeneroLatino.tasa).toBeLessThanOrEqual(0.6);
  });
  it('«Signum ... factum est» es neutro en latín y «la señal» femenino en español', () => {
    const i = LOTE_PASIVA_PERFECTUM.find((x) => x.id === 'la-pf-01')!;
    expect(i.ejes.genero).toBe('n');
    expect(i.ejes.generoEspanol).toBe('f');
    expect(copiarElGeneroLatino(i)).not.toBe(i.ejes.generoEspanol);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('el participio que no concuerda con lo declarado', () => {
    expect(clases(con({ participio: 'facta', latin: 'Signum ā Deō facta est.' }))).toContain('concordancia-mal');
  });
  it('el auxiliar singular con sujeto plural declarado', () => {
    expect(clases(con({ ejes: { ...base.ejes, numero: 'pl' } }))).toContain('auxiliar-no-concuerda');
  });
  it('la respuesta leída al pie de la letra', () => {
    expect(clases(con({ respuesta: 'es hecha' }))).toContain('valor-mal');
  });
  it('el tiempo mal declarado', () => {
    expect(clases(con({ ejes: { ...base.ejes, tiempo: 'pluscuamperfecto' } }))).toContain('valor-mal');
  });
  it('el género español mal declarado', () => {
    expect(clases(con({ ejes: { ...base.ejes, generoEspanol: 'm' } }))).toContain('genero-espanol-mal-declarado');
  });
  it('el par que no aparece en el corpus', () => {
    expect(clases(con({ verbo: V('taceō'), participio: 'tacitum', latin: 'Signum ā Deō tacitum est.', respuesta: 'fue callada' })))
      .toContain('par-sin-atestiguar');
  });
  it('la frase con vocabulario de fuera de L1', () => {
    expect(clases(con({ latin: `${palabraFueraDeL1()} ā Deō factum est.` }))).toContain('latin-fuera-de-l1');
  });
  it('la glosa sin hueco', () => {
    expect(clases(con({ glosa: 'La señal fue hecha por Dios.' }))).toContain('glosa-sin-hueco');
  });
  it('y la glosa que regala la respuesta', () => {
    expect(clases(con({ glosa: 'La señal fue hecha ___ por Dios.' }))).toContain('glosa-regala-la-respuesta');
  });
});

describe('los venenos de LOTE', () => {
  it('un lote de un solo tiempo no cubre el varia y regala la respuesta', () => {
    const lote = LOTE_PASIVA_PERFECTUM.filter((i) => i.ejes.tiempo === 'perfecto');
    const d = revisarLotePerfectum(lote).map((f) => `${f.clase}:${f.detalle}`).join(' | ');
    expect(d).toContain('tiempo');
    expect(d).toContain('contestar siempre en perfecto');
  });
  it('y un lote donde los dos géneros siempre coinciden no obliga a leer el sujeto español', () => {
    const lote = LOTE_PASIVA_PERFECTUM.filter((i) => copiarElGeneroLatino(i) === i.ejes.generoEspanol);
    expect(revisarLotePerfectum(lote).map((f) => f.detalle).join(' ')).toContain('copiar el género latino');
  });
  it('la cobertura del género que NO coincide lleva su motivo escrito', () => {
    const c = coberturaPerfectum(LOTE_PASIVA_PERFECTUM).find((x) => x.comprobacion.includes('NO coincide'))!;
    expect(c.decididos).toBeLessThan(c.total);
    expect(c.motivoDeLosQueQuedanFuera ?? '').not.toBe('');
  });
});

describe('la lectura del género español', () => {
  it('sale de la terminación del participio', () => {
    expect(generoDeLaRespuesta('fue hecha')).toBe('f');
    expect(generoDeLaRespuesta('fueron hechos')).toBe('m');
    expect(generoDeLaRespuesta('habían sido dichas')).toBe('f');
    expect(generoDeLaRespuesta('habrá sido hecho')).toBe('m');
  });
});

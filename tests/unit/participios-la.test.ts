// tests/unit/participios-la.test.ts
//
// Los participios y los adjetivos de 3.ª, que van juntos: el participio de
// presente ES un adjetivo de 3.ª de una terminación, y por eso el módulo no
// se podía escribir antes.
import { describe, it, expect } from 'vitest';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import {
  participioPresente, participioPerfecto, participioFuturo, gerundivo, gerundivoArcaico,
} from '@/lib/data/languages/la/participios';
import {
  ADJETIVOS_3A, paradigmaAdjetivo3a, declinarAdjetivo3a, ablativoEnE,
} from '@/lib/data/languages/la/adjetivos-3a';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const A = (l: string) => ADJETIVOS_3A.find((x) => x.lema === l)!;

describe('los adjetivos de 3.ª', () => {
  it('`omnis` produce sus ocho formas atestiguadas', () => {
    const p = paradigmaAdjetivo3a(A('omnis'));
    const suyas = new Set(Object.values(p));
    for (const f of ['omnis', 'omne', 'omnem', 'omnī', 'omnēs', 'omnia', 'omnium', 'omnibus'])
      expect(suyas, f).toContain(f);
  });

  it('los tres tipos difieren SÓLO en el nominativo singular', () => {
    // Es lo que el varia llama «el número de terminaciones».
    expect(['m', 'f', 'n'].map((g) => declinarAdjetivo3a(A('omnis'), g as never, 'nom', 'sg')))
      .toEqual(['omnis', 'omnis', 'omne']);
    expect(['m', 'f', 'n'].map((g) => declinarAdjetivo3a(A('fēlīx'), g as never, 'nom', 'sg')))
      .toEqual(['fēlīx', 'fēlīx', 'fēlīx']);
    expect(['m', 'f', 'n'].map((g) => declinarAdjetivo3a(A('ācer'), g as never, 'nom', 'sg')))
      .toEqual(['ācer', 'ācris', 'ācre']);
    // Y en todo lo demás son idénticos: el mismo tema y las mismas
    // desinencias de tema en -i.
    for (const l of ['omnis', 'fēlīx', 'ācer'])
      expect(declinarAdjetivo3a(A(l), 'm', 'gen', 'pl').endsWith('ium'), l).toBe(true);
  });

  it('el ablativo en -e existe y es de otra función', () => {
    // `omnī` como adjetivo, `praesente` como participio o sustantivado.
    expect(declinarAdjetivo3a(A('praesēns'), 'm', 'abl', 'sg')).toBe('praesentī');
    expect(ablativoEnE(A('praesēns'))).toBe('praesente');
  });
});

describe('el participio de presente', () => {
  it('sale del infinitivo, con una partición por clases', () => {
    expect(participioPresente(V('amō')).lema).toBe('amāns');
    expect(participioPresente(V('moneō')).lema).toBe('monēns');
    expect(participioPresente(V('legō')).lema).toBe('legēns');
    expect(participioPresente(V('audiō')).lema).toBe('audiēns');
    expect(participioPresente(V('capiō')).lema).toBe('capiēns');
  });

  it('y su genitivo ACORTA la vocal ante -nt-', () => {
    // `amāns` con ā larga y `amantis` con a breve: la misma ley que obligó a
    // sacar la 3.ª del singular pasiva de la 2.ª del plural, mordiendo al
    // revés — aquí hay que acortar, allí había que recuperar.
    expect(participioPresente(V('amō')).genitivo).toBe('amantis');
    expect(participioPresente(V('moneō')).genitivo).toBe('monentis');
    expect(participioPresente(V('audiō')).genitivo).toBe('audientis');
  });

  it('SÓLO la última vocal, y hacía falta decirlo', () => {
    // La primera versión quitaba todos los macrones y `dūcēns` daba
    // «ducentis». La `ū` del tema no tiene nada que ver con la ley.
    expect(participioPresente(V('dūcō')).genitivo).toBe('dūcentis');
    expect(gerundivo(V('salūtō')).lema).toBe('salūtandus');
    expect(gerundivo(V('custōdiō')).lema).toBe('custōdiendus');
  });

  it('es un adjetivo de 3.ª de UNA terminación y se declina como tal', () => {
    const p = participioPresente(V('videō'));
    expect(p.terminaciones).toBe(1);
    expect(p.lema).toBe('vidēns');
    const par = paradigmaAdjetivo3a(p);
    expect(par['m.gen.sg']).toBe('videntis');
    expect(par['m.dat.sg']).toBe('videntī');
    expect(par['m.abl.pl']).toBe('videntibus');
  });
});

describe('los otros tres participios', () => {
  it('perfecto y futuro salen del supino', () => {
    expect(participioPerfecto(V('amō'))!.lema).toBe('amātus');
    expect(participioFuturo(V('amō'))!.lema).toBe('amātūrus');
    expect(participioPerfecto(V('legō'))!.lema).toBe('lēctus');
    expect(participioFuturo(V('videō'))!.lema).toBe('vīsūrus');
  });

  it('y `null` cuando el verbo no tiene supino, salvo `sum`', () => {
    // `timeō` da `timuī` y no tiene supino: eso es la lengua.
    expect(participioPerfecto(V('timeō'))).toBeNull();
    // Pero `sum` SÍ tiene futuro —`futūrus`, 28 formas en el corpus— y su
    // cuarta parte principal es ese participio, no un supino. Devolver
    // `null` perdía la forma más frecuente de la casilla.
    expect(participioFuturo(V('sum'))!.lema).toBe('futūrus');
    expect(participioPerfecto(V('sum'))).toBeNull();
  });

  it('el gerundivo, con su variante arcaica en -undus', () => {
    expect(gerundivo(V('amō')).lema).toBe('amandus');
    expect(gerundivo(V('legō')).lema).toBe('legendus');
    expect(gerundivo(V('audiō')).lema).toBe('audiendus');
    // «faciundīs» y «dīcundī» salen en el corpus: no es licencia poética,
    // es la forma vieja.
    expect(gerundivoArcaico(V('faciō'))).toBe('faciundus');
    expect(gerundivoArcaico(V('dīcō'))).toBe('dīcundus');
    // Y la 1.ª y la 2.ª no la tienen.
    expect(gerundivoArcaico(V('amō'))).toBeNull();
  });
});

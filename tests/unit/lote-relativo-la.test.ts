// tests/unit/lote-relativo-la.test.ts
//
// El lote del relativo y su gate. Los controles positivos son la mitad que
// importa: la PRIMERA versión de este lote salió limpia con 14 ítems, y lo
// que había era un gate que no miraba la glosa española.
import { describe, it, expect } from 'vitest';
import { LOTE_RELATIVO, SEMILLA_DE_ORDEN } from '@/lib/data/languages/la/lotes/l4-relativo';
import {
  revisarLoteRelativo, revisarItemRelativo, mitadesQueMide, mitadesQueMideDeVerdad,
  elEspanolRegalaElCaso, pisoDeLaLengua, tasasDeMedioAlumno, type ItemRelativo,
} from '@/scripts/lib/gate-relativo';
import { declinarPronombre, PRONOMBRES_L1 } from '@/lib/data/languages/la/pronombres-la';

const QUI = PRONOMBRES_L1.find((e) => e.lema === 'quī')!;
const copia = (): ItemRelativo[] => LOTE_RELATIVO.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('lote del relativo · en verde', () => {
  it('el lote real pasa su gate entero', () => {
    const r = revisarLoteRelativo(LOTE_RELATIVO);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('ninguna respuesta está escrita a mano: todas salen de la tabla', () => {
    for (const it of LOTE_RELATIVO)
      expect(it.respuesta, it.id).toBe(
        declinarPronombre(QUI, it.antecedente.genero, it.caso, it.antecedente.numero));
  });

  it('cubre los tres casos que el punto exige y trae las dos mitades', () => {
    for (const c of ['nom', 'ac', 'gen']) expect(LOTE_RELATIVO.some((it) => it.caso === c), c).toBe(true);
    for (const m of ['fuera', 'dentro'])
      expect(LOTE_RELATIVO.some((it) => it.ejes.examina.includes(m as never)), m).toBe(true);
  });

  it('el medio alumno no pasa del suelo que pone la lengua', () => {
    const piso = pisoDeLaLengua(LOTE_RELATIVO), tasas = tasasDeMedioAlumno(LOTE_RELATIVO);
    expect(tasas.fuera).toBeLessThanOrEqual(piso.fuera + 0.15);
    expect(tasas.dentro).toBeLessThanOrEqual(piso.dentro + 0.15);
  });

  it('se publica barajado: agrupado por caso se resolvería contando', () => {
    expect(SEMILLA_DE_ORDEN).toBe(1);
    const ids = LOTE_RELATIVO.map((it) => it.id);
    expect(ids).not.toEqual([...ids].sort());
  });
});

describe('lote del relativo · ROJO', () => {
  it('un ítem no puede acreditarse una mitad que su celda no distingue', () => {
    // `quī` vale para m.sg y m.pl: la mitad de fuera no se puede cobrar.
    const it = copia().find((x) => x.respuesta === 'quī')!;
    it.ejes.examina = ['fuera', 'dentro'];
    expect(revisarItemRelativo(it).some((f) => f.clase === 'mitad-que-la-celda-no-mide')).toBe(true);
  });

  it('LA FUGA QUE SE ESCAPÓ: en el genitivo, «cuyo» ya ha dicho el caso', () => {
    // Este es el control que faltaba cuando el lote salió limpio la primera
    // vez. El gate miraba el sincretismo LATINO y no la traducción española.
    const it = copia().find((x) => x.caso === 'gen' && x.ejes.examina.includes('fuera'))!;
    it.ejes.examina = ['fuera', 'dentro'];
    const fallos = revisarItemRelativo(it);
    expect(fallos.some((f) => f.detalle.includes('la glosa española ya ha dicho el caso'))).toBe(true);
  });

  it('un ítem que no mide nada es un hallazgo si no lo declara', () => {
    const it = copia().find((x) => x.ejes.enseñaSinMedir)!;
    delete it.ejes.enseñaSinMedir;
    it.ejes.examina = [];
    expect(revisarItemRelativo(it).some((f) => f.clase === 'mitad-no-declarada')).toBe(true);
    it.ejes.porQueNoLaOtra = 'un motivo cualquiera';
    expect(revisarItemRelativo(it).some((f) => f.clase === 'item-que-no-mide-nada')).toBe(true);
  });

  it('no se puede enseñar sin medir Y cobrar una mitad a la vez', () => {
    const it = copia().find((x) => x.ejes.enseñaSinMedir)!;
    it.ejes.examina = ['fuera'];
    expect(revisarItemRelativo(it).some((f) => f.clase === 'mitad-no-declarada')).toBe(true);
  });

  it('una respuesta escrita a mano que la tabla no deriva', () => {
    const items = copia();
    items[0]!.respuesta = 'quius';
    expect(revisarItemRelativo(items[0]!).some((f) => f.clase === 'respuesta-no-derivada')).toBe(true);
  });

  it('quitar el genitivo suspende el lote: el punto lo exige', () => {
    const r = revisarLoteRelativo(copia().filter((it) => it.caso !== 'gen'));
    expect(r.fallos.some((f) => f.clase === 'caso-sin-cubrir')).toBe(true);
  });

  it('un lote entero de nominativos no mide la regla y el gate lo dice', () => {
    const r = revisarLoteRelativo(copia().filter((it) => it.caso === 'nom'));
    expect(r.fallos.length).toBeGreaterThan(0);
  });
});

describe('el suelo que pone la lengua, medido y no supuesto', () => {
  it('el español regala el caso en genitivo, dativo y ablativo, y no en nom/ac', () => {
    const de = (c: string) => elEspanolRegalaElCaso({ caso: c } as ItemRelativo);
    expect(de('gen')).toBe(true); expect(de('dat')).toBe(true); expect(de('abl')).toBe(true);
    expect(de('nom')).toBe(false); expect(de('ac')).toBe(false);
  });

  it('«cuius» no distingue género y por eso el genitivo singular no mide nada', () => {
    const it = LOTE_RELATIVO.find((x) => x.respuesta === 'cuius')!;
    expect(mitadesQueMide(it.antecedente.genero, it.caso, it.antecedente.numero)).toEqual(['dentro']);
    expect(mitadesQueMideDeVerdad(it)).toEqual([]);
  });

  it('el acusativo es donde la lengua no regala nada', () => {
    for (const it of LOTE_RELATIVO.filter((x) => x.caso === 'ac' && x.antecedente.genero !== 'n'))
      expect(mitadesQueMideDeVerdad(it), it.id).toEqual(['fuera', 'dentro']);
  });
});

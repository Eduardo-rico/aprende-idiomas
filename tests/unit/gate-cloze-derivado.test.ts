// tests/unit/gate-cloze-derivado.test.ts
//
// EL GATE DEL CLOZE DERIVADO, VISTO EN ROJO ANTES DEL PRIMER ÍTEM.
import { describe, it, expect } from 'vitest';
import {
  revisarClozeDerivado, revisarLoteD, tasasCiegasD, TECHO_D,
  respuestaIngenua, respuestaSincopada, type ItemClozeDerivado,
} from '../../scripts/lib/gate-cloze-derivado';
import { declinar, type EntradaNominal } from '../../lib/data/languages/la/paradigma-la';

const PUER: EntradaNominal = { lema: 'puer', genitivo: 'puerī', genero: 'm', glosa: 'niño' };
const AGER: EntradaNominal = { lema: 'ager', genitivo: 'agrī', genero: 'm', glosa: 'campo' };
const MAGISTER: EntradaNominal = { lema: 'magister', genitivo: 'magistrī', genero: 'm', glosa: 'maestro' };
const DOMINUS: EntradaNominal = { lema: 'dominus', genitivo: 'dominī', genero: 'm', glosa: 'señor' };
const FILIUS: EntradaNominal = { lema: 'fīlius', genitivo: 'fīliī', genero: 'm', glosa: 'hijo' };

function mk(id: string, e: EntradaNominal, celda: ItemClozeDerivado['celda'],
            clase: ItemClozeDerivado['ejes']['clase']): ItemClozeDerivado {
  const [c, n] = celda.split('.') as ['nom', 'sg'];
  return { id, punto: 'l2-segunda', entrada: e, celda, respuesta: declinar(e, c, n),
    marco: 'Dominus ___ videt.', pista: 'el contexto español que fija la celda',
    ejes: { clase, celda } };
}

describe('las dos derivaciones son COMPLEMENTARIAS sobre los -er', () => {
  it('exactamente una acierta en cada palabra', () => {
    // Es lo que obliga a mezclar mitad y mitad, igual que en el formato
    // anterior. Y lo comprueba en la dirección que destapa el fallo: la
    // primera versión de `respuestaSincopada` exigía consonante antes de
    // la `e` y por eso NO sincopaba `puer` — acertaba donde debía fallar,
    // y las dos dejaban de ser complementarias sin que nada avisara.
    for (const [e, correcta] of [[PUER, 'puerum'], [AGER, 'agrum'], [MAGISTER, 'magistrum']] as const) {
      const i = respuestaIngenua(e, 'ac.sg') === correcta;
      const s = respuestaSincopada(e, 'ac.sg') === correcta;
      expect(i, e.lema).not.toBe(s);
    }
  });
});

describe('CONTROLES DE LOTE', () => {
  it('CAZA el lote de sólo `conserva`, que se resuelve con el nominativo', () => {
    const malo = (['ac.sg', 'dat.sg', 'ac.pl', 'dat.pl'] as const).map((c, k) => mk(`c${k}`, PUER, c, 'conserva'));
    expect(tasasCiegasD(malo).temaDelNominativo).toBe(1);
    expect(revisarLoteD(malo).map((x) => x.clase)).toContain('estrategia-ciega');
  });

  it('CAZA el lote de sólo `sincopa`, que se resuelve sincopando siempre', () => {
    const malo = [...(['ac.sg', 'dat.sg'] as const).map((c, k) => mk(`s${k}`, AGER, c, 'sincopa')),
                  ...(['ac.sg', 'dat.sg'] as const).map((c, k) => mk(`t${k}`, MAGISTER, c, 'sincopa'))];
    expect(tasasCiegasD(malo).sincoparSiempre).toBe(1);
    expect(revisarLoteD(malo).map((x) => x.clase)).toContain('estrategia-ciega');
  });

  it('CAZA el lote de regulares, donde las dos derivaciones COINCIDEN', () => {
    // El caso silencioso: cada ítem es correcto, el gate de tema no puede
    // quejarse porque las dos estrategias aciertan igual, y el lote no
    // examina el punto. Se caza por el DENOMINADOR, no por la tasa.
    const malo = (['ac.sg', 'dat.sg', 'ac.pl', 'abl.sg'] as const).map((c, k) => mk(`r${k}`, DOMINUS, c, 'regular'));
    expect(tasasCiegasD(malo).discriminantes).toBe(0);
    expect(revisarLoteD(malo).map((x) => x.detalle).join(' ')).toContain('discriminan el tema');
  });

  it('CAZA el lote sin la excepción de los -ius', () => {
    // Sin un ítem de `fīlius`, el alumno saca 8/8 sobregeneralizando el
    // vocativo en -e y el corpus certifica que sabe algo que no sabe.
    const malo = [mk('a', PUER, 'ac.sg', 'conserva'), mk('b', AGER, 'ac.sg', 'sincopa'),
                  mk('c', PUER, 'dat.pl', 'conserva'), mk('d', MAGISTER, 'ac.pl', 'sincopa')];
    expect(revisarLoteD(malo).map((x) => x.clase)).toContain('sin-excepcion');
  });

  it('y el vocativo en -e falla justo en el ítem de la excepción', () => {
    const exc = mk('x', FILIUS, 'voc.sg', 'voc-ius');
    expect(exc.respuesta).toBe('fīlī');
    expect(tasasCiegasD([exc]).vocativoEnE).toBe(0);
    // Mientras que en un regular esa estrategia acierta: por eso hace
    // falta el contraste y no basta con uno de los dos.
    expect(tasasCiegasD([mk('y', DOMINUS, 'voc.sg', 'regular')]).vocativoEnE).toBe(1);
  });
});

describe('CONTROLES DE ÍTEM', () => {
  it('CAZA la respuesta escrita a mano que la máquina no deriva', () => {
    // El segundo camino DENTRO del ítem, que este formato permite y el
    // cloze en la glosa no.
    const malo = { ...mk('a', AGER, 'ac.sg', 'sincopa'), respuesta: 'agerum' };
    expect(revisarClozeDerivado(malo).map((x) => x.clase)).toContain('respuesta-no-derivable');
  });

  it('CAZA la clase declarada que los datos desmienten', () => {
    const malo = { ...mk('a', AGER, 'ac.sg', 'sincopa'), ejes: { clase: 'conserva' as const, celda: 'ac.sg' as const } };
    expect(revisarClozeDerivado(malo).map((x) => x.clase)).toContain('eje-mal-declarado');
  });

  it('CAZA la pista que lleva la forma dentro', () => {
    const malo = { ...mk('a', AGER, 'ac.sg', 'sincopa'), pista: 'el campesino ara el agrum' };
    expect(revisarClozeDerivado(malo).map((x) => x.clase)).toContain('pista-regala-la-forma');
  });

  it('CAZA la celda gratis por la PROPIEDAD, no por el nombre de la celda', () => {
    // El genitivo singular, que es el caso obvio…
    expect(revisarClozeDerivado(mk('a', DOMINUS, 'gen.sg', 'regular')).map((x) => x.clase)).toContain('celda-gratis');
    // …y el que se le escapaba a la regla por nombre: en la 2.ª el
    // NOMINATIVO PLURAL es homógrafo del genitivo singular (`puerī`), así
    // que se contesta copiando la entrada con otro nombre de celda.
    const nomPl = mk('b', PUER, 'nom.pl', 'conserva');
    expect(nomPl.respuesta).toBe('puerī');
    expect(nomPl.respuesta).toBe(PUER.genitivo);
    expect(revisarClozeDerivado(nomPl).map((x) => x.clase)).toContain('celda-gratis');
    // Y en la 1.ª declinación NO lo es, así que el gate no puede vetar la
    // celda: `puellae` de nominativo plural sí coincide, pero `agrī` de
    // nominativo plural coincide y `agrōs` de acusativo no.
    expect(revisarClozeDerivado(mk('c', PUER, 'ac.pl', 'conserva'))).toEqual([]);
  });

  it('CAZA la misma palabra en la misma celda dos veces', () => {
    const a = mk('a', PUER, 'ac.sg', 'conserva'), b = mk('b', PUER, 'ac.sg', 'conserva');
    expect(revisarLoteD([a, b]).map((x) => x.clase)).toContain('celdas-repetidas');
  });
});

describe('el MARCO latino, en su propio campo', () => {
  it('CAZA el marco sin hueco', () => {
    const malo = { ...mk('a', AGER, 'ac.sg', 'sincopa' as const), marco: 'Dominus videt.' };
    expect(revisarClozeDerivado(malo).map((x) => x.clase)).toContain('marco-mal');
  });

  it('CAZA el marco que lleva OTRA forma del mismo lema', () => {
    // La tendría a la vista y el ítem mediría copiar, no derivar.
    const malo = { ...mk('a', AGER, 'ac.sg', 'sincopa' as const), marco: 'In agrō ___ videt.' };
    expect(revisarClozeDerivado(malo).map((x) => x.clase)).toContain('pista-regala-la-forma');
  });
});

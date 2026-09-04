// tests/unit/lote-la-5f.test.ts — el gate y el primer lote de transformación.
import { describe, it, expect } from 'vitest';
import { revisarTransformacion, revisarLoteT, tasasCiegasT, coberturaTransformacion,
         rutaBi, rutaE, elErrorExiste, TECHO_T, type ItemTransformacion } from '../../scripts/lib/gate-transformacion';
import { LOTE_FUTURO as LOTE } from '../../lib/data/languages/la/lotes/l5-futuro';
import { buscarComposiciones, contrastarComposiciones, type Estrategia, type Pista } from '../../scripts/lib/composiciones';
import { conjugar } from '../../lib/data/languages/la/paradigma-la';
import { PISO_LA } from '../../lib/data/languages/la/inventario-puntos';

// Por ID y no por índice: el lote se publica BARAJADO, así que `LOTE[0]`
// ya no es el que era. Es la misma lección que motivó el barajado, en
// pequeño — una referencia posicional se rompe cuando el orden deja de
// ser el de escritura, y aquí rompió dos controles positivos.
const base = () => ({ ...LOTE.find((i) => i.id === 'la-5f-01')! });

describe('la ruta equivocada NO es inventada', () => {
  it('sale del imperfecto, que sí existe, cambiándole la vocal', () => {
    // El que aprende `amābit` produce `dūcēbit` porque coge `dūcēbat` y le
    // cambia la vocal — que es exactamente lo que funciona en la 1.ª.
    const duco = LOTE.find((i) => i.verbo.lema === 'dūcō' && i.persona === '3sg')!;
    expect(conjugar(duco.verbo, '3sg', 'imperfecto')).toBe('dūcēbat');
    expect(rutaBi(duco)).toBe('dūcēbit');
    expect(duco.respuesta).toBe('dūcet');
  });

  it('y en la 1.ª y la 2.ª esa misma ruta acierta', () => {
    const amo = LOTE.find((i) => i.verbo.lema === 'amō')!;
    expect(rutaBi(amo)).toBe(amo.respuesta);
  });
});

describe('EL ERROR QUE ES UNA FORMA REAL', () => {
  it('la ruta -ē- sobre un verbo de la 2.ª devuelve el PRESENTE', () => {
    // El alumno que se equivoca no obtiene una forma imposible: obtiene
    // una palabra correcta con otro tiempo, y si la busca la encuentra.
    const videt = LOTE.find((i) => i.verbo.lema === 'videō')!;
    expect(rutaE(videt)).toBe('videt');
    expect(conjugar(videt.verbo, '3sg', 'presente')).toBe('videt');
    expect(videt.ejes.elErrorExiste).toBe(true);
  });

  it('el lote trae al menos uno, o el caso se estrenaría por accidente', () => {
    expect(LOTE.filter((i) => i.ejes.elErrorExiste).length).toBeGreaterThanOrEqual(1);
    expect(revisarLoteT(LOTE.filter((i) => !i.ejes.elErrorExiste)).map((x) => x.clase))
      .toContain('sin-error-que-existe');
  });

  it('y la comprobación INFRAINFORMA, que hay que leerlo así', () => {
    // `amet` es el presente de subjuntivo de `amō`, o sea una palabra
    // latina, y la máquina todavía no tiene subjuntivo. Sale «no» siendo
    // «sí»: un false aquí significa «no lo veo», no «no existe».
    const amo = LOTE.find((i) => i.verbo.lema === 'amō')!;
    expect(rutaE(amo)).toBe('amet');
    expect(elErrorExiste(amo)).toBe(false);
    const cob = coberturaTransformacion(LOTE).find((c) => c.comprobacion.includes('forma real'))!;
    expect(cob.motivoDeLosQueQuedanFuera).toMatch(/INFRAINFORMA/);
  });
});

describe('CONTROLES DE ÍTEM', () => {
  it('CAZA la respuesta que la máquina no deriva', () => {
    expect(revisarTransformacion({ ...base(), respuesta: 'amēbit' }).map((x) => x.clase))
      .toContain('entrada-o-respuesta-no-derivable');
  });

  it('CAZA la marca mal declarada', () => {
    expect(revisarTransformacion({ ...base(), ejes: { ...base().ejes, marca: 'e' } }).map((x) => x.clase))
      .toContain('eje-mal-declarado');
  });

  it('CAZA el `elErrorExiste` que los datos desmienten', () => {
    expect(revisarTransformacion({ ...base(), ejes: { ...base().ejes, elErrorExiste: true } }).map((x) => x.clase))
      .toContain('eje-mal-declarado');
  });

  it('CAZA la pista que regala la forma', () => {
    expect(revisarTransformacion({ ...base(), pista: 'mañana amābit' }).map((x) => x.clase))
      .toContain('pista-regala-la-forma');
  });
});

describe('el primer lote de transformación', () => {
  it('pasa el gate entero', () => expect(revisarLoteT(LOTE)).toEqual([]));

  it('las rutas ciegas se quedan en el azar, y son complementarias', () => {
    const t = tasasCiegasT(LOTE);
    expect(t.siempreBi).toBeLessThanOrEqual(TECHO_T);
    expect(t.siempreE).toBeLessThanOrEqual(TECHO_T);
    expect(t.siempreBi + t.siempreE).toBe(1);
    expect(t.copiarLaEntrada).toBe(0);
  });

  it('pasa el piso del peldaño', () => expect(LOTE.length).toBeGreaterThanOrEqual(PISO_LA('L1')));
});

describe('UNA PISTA QUE ES LA REGLA NO ES UN ATAJO', () => {
  const E: Estrategia<ItemTransformacion>[] = [
    { nombre: '-bi- siempre', responde: rutaBi },
    { nombre: '-ē- siempre', responde: rutaE },
  ];

  it('con pistas que NO son la regla, no hay atajo', () => {
    const P: Pista<ItemTransformacion>[] = [
      { nombre: 'es plural', vale: (i) => i.persona.endsWith('pl') },
      { nombre: 'es tercera persona', vale: (i) => i.persona.startsWith('3') },
      { nombre: 'es primera persona', vale: (i) => i.persona.startsWith('1') },
      { nombre: 'la entrada es larga', vale: (i) => i.entrada.length >= 7 },
      { nombre: 'la entrada lleva mácrón', vale: (i) => /[āēīōū]/.test(i.entrada.normalize('NFC')) },
    ];
    const v = contrastarComposiciones(LOTE, (i) => i.respuesta, E,
      { pistas: P, revisadaPor: 'el autor del lote — PENDIENTE de revisión adversarial' }, 1000);
    expect(v.mejor.tasa).toBeGreaterThan(0.5);   // el techo del 50 % marcaría
    expect(v.hayAtajo).toBe(false);              // y se equivocaría
  });

  it('y la vocal temática del presente acierta el 100 %, y ESO es la destreza', () => {
    // La sutileza que hay que llevar puesta al armar la lista de pistas:
    // una pista visible que ES la regla que se enseña no es un atajo, es
    // la respuesta. Meterla haría que la herramienta encontrara un «atajo»
    // que en realidad es el alumno haciéndolo bien.
    const laRegla: Pista<ItemTransformacion>[] = [
      { nombre: 'la temática del presente es a/e', vale: (i) => /(at|et|ās|eō|āmus|ent)$/.test(i.entrada.normalize('NFC')) },
    ];
    expect(buscarComposiciones(LOTE, (i) => i.respuesta, E, laRegla)[0]!.tasa).toBe(1);
  });
});

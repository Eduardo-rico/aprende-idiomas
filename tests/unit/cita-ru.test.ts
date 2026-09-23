// La herramienta de atribución de citas, vista en ROJO con las dos que ya
// salieron mal (§71 y §78 del relevo ruso) y con su control negativo.
import { describe, expect, it } from 'vitest';
import { lecturas, localizarCita, verificarCita } from '../../scripts/cita-ru';

describe('cita-ru: de dónde sale una cita, leído del corpus', { timeout: 120_000 }, () => {
  it('guarda: mira la biblioteca entera, no un cero de «no he mirado» (§A2)', () => {
    expect(lecturas().length).toBeGreaterThan(2000);
  });

  it('ROJO: «Местов много» atribuida a Dostoievski — el E1 del §78, tal como se publicó', () => {
    const v = verificarCita({ cita: 'Местов много', autor: 'Достоевский' });
    expect(v.ok).toBe(false);
    expect(v.problemas.join(' ')).toMatch(/Чехов/);
  });

  it('ROJO: la cita de Dostoievski atribuida a Chéjov — el mismo emparejamiento, al revés', () => {
    expect(verificarCita({ cita: 'из однех местов', autor: 'Чехов' }).ok).toBe(false);
  });

  it('ROJO: una obra equivocada con el autor bueno', () => {
    expect(verificarCita({ cita: 'Местов много', autor: 'Чехов', obra: 'Счастье' }).ok).toBe(false);
  });

  it('ROJO: una cita que no está en ninguna lectura', () => {
    const v = verificarCita({ cita: 'Местов премного у нас', autor: 'Чехов' });
    expect(v.ok).toBe(false);
    expect(v.hallazgos).toHaveLength(0);
  });

  it('CONTROL NEGATIVO: las atribuciones BUENAS pasan limpias', () => {
    expect(verificarCita({ cita: 'Местов много', autor: 'Чехов', obra: 'Гордый человек' }).ok).toBe(true);
    expect(verificarCita({ cita: 'из однех местов', autor: 'Достоевский', obra: 'Преступление и наказание' }).ok).toBe(true);
  });

  it('encuentra la cita que abre réplica con mayúscula y la que va sin ё (el fallo de la v0 del §78)', () => {
    expect(localizarCita('местов много')).toHaveLength(1);
    expect(localizarCita('МЕСТОВ МНОГО')).toHaveLength(1);
  });

  it('devuelve el PÁRRAFO con sus vecinos: el hablante se lee, no se supone', () => {
    const [h] = localizarCita('Местов много');
    expect(h!.fichero).toBe('chehov-rannie-rasskazy--gordyj-chelovek.json');
    // El párrafo de antes lo dice el брюнет; la cita es la RESPUESTA, del шафер.
    expect(h!.anterior).toMatch(/усмехнулся брюнет/);
  });

  it('LÍMITE, afirmado y no supuesto: `enContexto` es necesario y NO suficiente para el hablante', () => {
    // «брюнет» está en el vecino, y el брюнет NO es quien dice la cita. Si este
    // test fallara, alguien habría convertido la condición en una prueba de
    // hablante que no es.
    expect(verificarCita({ cita: 'Местов много', autor: 'Чехов', enContexto: ['брюнет'] }).ok).toBe(true);
  });

  it('rechaza cadenas demasiado cortas para ser una cita', () => {
    expect(() => localizarCita('мест')).toThrow(/demasiado corta/);
  });
});

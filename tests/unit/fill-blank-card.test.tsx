// tests/unit/fill-blank-card.test.tsx
// @vitest-environment jsdom
//
// E2#10 destapó que `FillBlankCard` pintaba UN solo input y validaba con
// `blanks.some(...)`: en un ejercicio de tres huecos, teclear uno solo
// puntuaba correcto. **33 ejercicios del corpus tienen más de un hueco**
// (31 de dos, 2 de tres).
//
// No es un fallo cosmético: un componente que puntúa de más invalida el
// ejercicio Y la evidencia que genera, porque el acierto entra en el FSRS
// y sube el mastery de un punto que el alumno no ha demostrado.
//
// El fixture es el ejercicio REAL `b6/8d514b7e`, que además es de los que
// más se prestan al fallo: sus tres huecos son tres verbos distintos, y
// con `some()` bastaba acertar el más fácil.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { FillBlankCard } from '@/components/cards/FillBlankCard';

vi.mock('@/lib/stores/settings', () => ({ useSettings: () => ({ variant: 'pt-pt' }) }));
vi.mock('@/lib/exercise-resolver', async (orig) => ({ ...(await orig<typeof import('@/lib/exercise-resolver')>()), resolveExerciseData: (ex: any) => ex.data }));

afterEach(cleanup);

const tresHuecos = {
  id: '8d514b7e', type: 'fill_blank',
  data: {
    sentence: 'Eu ___ que ela está doente. Mas ___ que ___ mesmo. (achar / duvidar / estar)',
    blanks: [
      { position: 0, answer: 'acho', alternatives: [] },
      { position: 1, answer: 'duvido', alternatives: [] },
      { position: 2, answer: 'esteja', alternatives: [] },
    ],
  },
} as any;

const unHueco = {
  id: 'u', type: 'fill_blank',
  data: { sentence: 'Eu ___ português.', blanks: [{ position: 0, answer: 'falo', alternatives: ['estudo'] }] },
} as any;

const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const escribir = (i: number, v: string) => fireEvent.change(inputs()[i]!, { target: { value: v } });

describe('FillBlankCard con varios huecos', () => {
  it('pinta un input POR HUECO, no uno solo', () => {
    render(<FillBlankCard ex={tresHuecos} onSubmit={vi.fn()} />);
    expect(inputs()).toHaveLength(3);
  });

  it('NO da por bueno acertar un hueco de tres — el fallo que motivó el arreglo', () => {
    const onSubmit = vi.fn();
    render(<FillBlankCard ex={tresHuecos} onSubmit={onSubmit} />);
    escribir(0, 'acho');
    escribir(1, 'xxx');
    escribir(2, 'yyy');
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.any(String), false);
  });

  it('sólo da por bueno acertar los TRES', () => {
    const onSubmit = vi.fn();
    render(<FillBlankCard ex={tresHuecos} onSubmit={onSubmit} />);
    escribir(0, 'acho');
    escribir(1, 'duvido');
    escribir(2, 'esteja');
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.any(String), true);
  });

  it('cada hueco se valida contra SU respuesta, no contra cualquiera', () => {
    const onSubmit = vi.fn();
    render(<FillBlankCard ex={tresHuecos} onSubmit={onSubmit} />);
    // las tres respuestas correctas, pero en el orden equivocado
    escribir(0, 'esteja');
    escribir(1, 'acho');
    escribir(2, 'duvido');
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.any(String), false);
  });

  it('al revelar enseña TODAS las respuestas, no sólo la primera', () => {
    render(<FillBlankCard ex={tresHuecos} onSubmit={vi.fn()} />);
    escribir(0, 'x'); escribir(1, 'y'); escribir(2, 'z');
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    const texto = document.body.textContent ?? '';
    for (const r of ['acho', 'duvido', 'esteja']) expect(texto).toContain(r);
  });

  it('no deja enviar con huecos vacíos', () => {
    render(<FillBlankCard ex={tresHuecos} onSubmit={vi.fn()} />);
    escribir(0, 'acho');
    expect((screen.getByRole('button', { name: /ok/i }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('FillBlankCard con un hueco — no se rompe lo que ya funcionaba', () => {
  it('acepta la respuesta', () => {
    const onSubmit = vi.fn();
    render(<FillBlankCard ex={unHueco} onSubmit={onSubmit} />);
    escribir(0, 'falo');
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onSubmit).toHaveBeenCalledWith('falo', true);
  });

  it('acepta una alternativa declarada', () => {
    const onSubmit = vi.fn();
    render(<FillBlankCard ex={unHueco} onSubmit={onSubmit} />);
    escribir(0, 'Estudo');
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onSubmit).toHaveBeenCalledWith('Estudo', true);
  });

  it('rechaza lo que no es', () => {
    const onSubmit = vi.fn();
    render(<FillBlankCard ex={unHueco} onSubmit={onSubmit} />);
    escribir(0, 'como');
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onSubmit).toHaveBeenCalledWith('como', false);
  });
});

// ── E2#14 · LA PISTA QUE LA TARJETA NUNCA MOSTRÓ ─────────────────────
//
// El esquema acepta `hintEs` y la tarjeta no lo renderiza. Medido: de
// los 417 `fill_blank` publicados, CERO lo usan — la convención de facto
// es meter la pista entre paréntesis dentro de la frase. Es decir: un
// campo que el esquema valida, que un autor puede rellenar de buena fe y
// que el alumno no ve nunca. Un campo así no es una funcionalidad a
// medias: es una funcionalidad que no existe, y silenciosa.
//
// Lo destapó el dry-run del lote 11 v2 —un lote de «cloze CON PISTA» que
// se iba a publicar sin pista— y bloquea su publicación, así que se
// arregla aquí y no en la próxima sesión.
const conPista = {
  id: 'p', type: 'fill_blank',
  data: {
    sentence: 'Para os teus colegas ___ o comboio das seis, temos de sair já.',
    blanks: [{ position: 0, answer: 'apanharem', alternatives: [] }],
    hintEs: 'apanhar — para que tus compañeros cojan el tren',
  },
} as any;

describe('FillBlankCard · la pista', () => {
  it('MUESTRA `hintEs` cuando el ítem la trae', () => {
    render(<FillBlankCard ex={conPista} onSubmit={() => {}} />);
    expect(screen.getByText(/apanhar — para que tus compañeros/)).toBeTruthy();
  });

  it('no inventa una caja de pista cuando el ítem no la trae', () => {
    render(<FillBlankCard ex={unHueco} onSubmit={() => {}} />);
    expect(screen.queryByTestId('pista')).toBeNull();
  });

  it('la pista NO se cuenta como parte de la frase con huecos', () => {
    render(<FillBlankCard ex={conPista} onSubmit={() => {}} />);
    expect(inputs()).toHaveLength(1);
  });
});

// El ancho del input estaba calculado sobre la LONGITUD DE LA RESPUESTA
// (`size={Math.max(6, answer.length)}`), así que la caja se ensanchaba
// con la respuesta y filtraba cuántas letras tiene. Es un atajo del
// runner, no del contenido: el mismo alumno que no sabe la forma puede
// descartar candidatas por el tamaño de la caja.
describe('FillBlankCard · el ancho del input no puede filtrar la respuesta', () => {
  it('una respuesta larga y una corta pintan cajas del mismo ancho', () => {
    render(<FillBlankCard ex={unHueco} onSubmit={() => {}} />);
    const corta = inputs()[0]!.getAttribute('size');
    cleanup();
    render(<FillBlankCard ex={conPista} onSubmit={() => {}} />);
    expect(inputs()[0]!.getAttribute('size')).toBe(corta);
  });
});

// Si el alumno acierta con una ALTERNATIVA declarada, la tarjeta le decía
// «Respuesta correcta: <answer>» — otra palabra distinta de la que él
// escribió y que también era buena. Puntuaba bien y explicaba mal.
describe('FillBlankCard · al revelar, las alternativas aceptadas se ven', () => {
  it('enseña la alternativa junto a la respuesta', () => {
    render(<FillBlankCard ex={unHueco} onSubmit={() => {}} />);
    escribir(0, 'estudo');
    fireEvent.click(screen.getByText('OK'));
    expect(screen.getByText(/estudo/)).toBeTruthy();
  });
});

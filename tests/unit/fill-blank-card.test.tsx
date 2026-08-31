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

// tests/unit/multiple-choice-card.test.tsx
// @vitest-environment jsdom
//
// La familia de fidelidad de mediación (E2#9) mete la fuente portuguesa y
// el recado español en LÍNEAS SEPARADAS dentro de `question`. El runner
// las colapsaba en un párrafo. Estos tests fijan las dos mitades del
// contrato: los saltos se respetan, y los 37 multiple_choice anteriores
// —ninguno con salto— siguen centrados exactamente igual.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MultipleChoiceCard } from '@/components/cards/MultipleChoiceCard';

// La limpieza automática de testing-library no está activa en esta suite
// (los demás tests de tarjeta tienen un solo caso y nunca lo notaron): sin
// esto, el segundo render deja dos botones con el mismo texto y getByText
// falla por ambigüedad.
afterEach(cleanup);

vi.mock('@/lib/stores/settings', () => ({ useSettings: () => ({ variant: 'pt-pt' }) }));
vi.mock('@/lib/exercise-resolver', async (orig) => ({ ...(await orig<typeof import('@/lib/exercise-resolver')>()), resolveExerciseData: (ex: any) => ex.data }));

const conSaltos = {
  id: 'x', type: 'multiple_choice',
  data: {
    question: 'AVISO:\n«Entrega até sexta.»\n\nRECADO:\n«Hay que entregarlo antes del viernes.»\n\n¿Qué falla?',
    options: ['Se adelanta el plazo', 'Falta el lugar', 'Cambia quién lo hace', 'No falla nada'],
    correctIndex: 0,
    explanationEs: '«até sexta» incluye el viernes; «antes del viernes» lo deja fuera.',
  },
} as any;

const sinSaltos = {
  id: 'y', type: 'multiple_choice',
  data: { question: '¿Cuál es el plural de «pão»?', options: ['pães', 'pãos'], correctIndex: 0, explanationEs: '—' },
} as any;

const enunciado = (texto: string) => screen.getByText((_, el) => el?.textContent === texto && el?.classList.contains('text-xl'));

describe('MultipleChoiceCard', () => {
  it('respeta los saltos de línea del enunciado y lo alinea a la izquierda', () => {
    render(<MultipleChoiceCard ex={conSaltos} onSubmit={vi.fn()} />);
    const el = enunciado(conSaltos.data.question);
    expect(el.className).toContain('whitespace-pre-line');
    expect(el.className).toContain('text-left');
    expect(el.className).not.toContain('text-center');
  });

  it('deja centrado el enunciado de una sola línea — los 37 ítems previos no cambian', () => {
    render(<MultipleChoiceCard ex={sinSaltos} onSubmit={vi.fn()} />);
    expect(enunciado(sinSaltos.data.question).className).toContain('text-center');
  });

  it('acierta sólo con la opción de correctIndex', () => {
    const onSubmit = vi.fn();
    render(<MultipleChoiceCard ex={conSaltos} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Se adelanta el plazo'));
    expect(onSubmit).toHaveBeenCalledWith('Se adelanta el plazo', true);
  });

  it('marca fallo cualquier otra opción, y sólo cuenta el primer clic', () => {
    const onSubmit = vi.fn();
    render(<MultipleChoiceCard ex={conSaltos} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('No falla nada'));
    fireEvent.click(screen.getByText('Se adelanta el plazo'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('No falla nada', false);
  });
});

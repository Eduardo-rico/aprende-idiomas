// Gate de coherencia de registro (Ola B2C2-PT): un ítem que DECLARA
// registro formal/solene no puede tratar de «tu» ni de «você», y uno
// que declara address concreto no puede usar el tratamiento contrario
// en su texto. Es el gate que el currículo pedía y no existía («no se
// puede poner un gate que falle si un ítem PT-PT formal usa 'você'»).
import { describe, it, expect } from 'vitest';
import { revisarRegistro } from '@/scripts/lib/check-registro';

const item = (data: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
  ({ id: 'r1', type: 'fill_blank', data, ...extra }) as never;

describe('revisarRegistro', () => {
  it('formal + você → error', () => {
    const h = revisarRegistro(item({ sentence: 'Você pode assinar aqui.' }, { register: 'formal' }));
    expect(h.some((x) => x.severidad === 'error')).toBe(true);
  });
  it('formal + tuteo (tu/teu/2sg) → error', () => {
    const h = revisarRegistro(item({ sentence: 'Podes assinar aqui o teu contrato.' }, { register: 'formal' }));
    expect(h.some((x) => x.severidad === 'error')).toBe(true);
  });
  it('formal + 3ª sin pronombre → limpio', () => {
    expect(revisarRegistro(item({ sentence: 'O senhor pode assinar aqui.' }, { register: 'formal' }))).toEqual([]);
  });
  it('intimo/informal + tu → limpio', () => {
    expect(revisarRegistro(item({ sentence: 'Podes vir cá?' }, { register: 'informal' }))).toEqual([]);
  });
  it('address=tu con texto en o_senhor → error', () => {
    const h = revisarRegistro(item({ sentence: 'O senhor quer um café?' }, { address: 'tu', register: 'informal' }));
    expect(h.some((x) => x.severidad === 'error')).toBe(true);
  });
  it('sin register declarado → no opina (el corpus viejo no lo declara)', () => {
    expect(revisarRegistro(item({ sentence: 'Você pode assinar.' }))).toEqual([]);
  });
});

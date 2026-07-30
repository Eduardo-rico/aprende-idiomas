// La regla de triage de la Ola V (v2). Clasifica 1.826 ítems de una
// pasada, así que sus decisiones se fijan aquí ANTES del lote. Cada
// caso viene del diseño y de los DOS informes adversariales del
// 2026-07-29 (docs/plans/2026-07-29-ola-v-triage-variante.md) — los
// ejemplos con comillas son ítems vivos del corpus que la v1
// clasificaba mal.
import { describe, it, expect } from 'vitest';
import { triage, SELLO } from '@/scripts/lib/triage-inerte';

const item = (type: string, data: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
  ({ id: 't1', type, data, ...extra }) as never;
const mc = (sentence: string) => item('multiple_choice_fake_sentence' as string, { sentence });

describe('triage → needs-human (base demostrablemente no europea)', () => {
  it('marcador ERROR de la lista cerrada', () => {
    const r = triage(item('flashcard', { back: 'o ônibus', example: 'O ônibus chegou.' }));
    expect(r.destino).toBe('needs-human');
  });
  it('léxico de la extensión v2 (sobrenome, garçom, vestibular)', () => {
    expect(triage(item('fill_blank', { sentence: 'O meu sobrenome é Silva.' })).destino).toBe('needs-human');
    expect(triage(item('fill_blank', { sentence: 'Nós fizemos um pedido ao garçom.' })).destino).toBe('needs-human');
    expect(triage(item('fill_blank', { sentence: 'Terei muita sorte no vestibular.' })).destino).toBe('needs-human');
  });
  it('grafías BR pre-2009 (vôo, idéia, trema)', () => {
    expect(triage(item('flashcard', { back: 'o vôo' })).destino).toBe('needs-human');
    expect(triage(item('flashcard', { back: 'uma idéia boa' })).destino).toBe('needs-human');
    expect(triage(item('flashcard', { back: 'lingüiça' })).destino).toBe('needs-human');
  });
  it('marcador ERROR en el campo correcto de un error_correction', () => {
    const r = triage(item('error_correction', { sentence: 'x', correct: 'O ônibus chegou cedo.' }));
    expect(r.destino).toBe('needs-human');
  });
});

describe('triage → neutral (variante-inerte, sellado por regla v2)', () => {
  it('frase sin material divergente', () => {
    expect(triage(item('multiple_choice', { options: ['A casa é grande.', 'A casa é branca.'] })))
      .toEqual({ destino: 'neutral', sello: SELLO });
  });
  it('-ência y cultismos de vocal cerrada son invariantes (falso positivo de la v1)', () => {
    expect(triage(item('flashcard', { back: 'paciência', example: 'Ela demonstrou muita paciência.' })).destino).toBe('neutral');
    expect(triage(item('flashcard', { back: 'fêmea' })).destino).toBe('neutral');
  });
  it('ter/vir y compuestos con -êm son europeos legítimos', () => {
    expect(triage(item('fill_blank', { sentence: 'Eles têm duas casas.' })).destino).toBe('neutral');
    expect(triage(item('fill_blank', { sentence: 'Estas caixas contêm livros.' })).destino).toBe('neutral');
  });
  it('quando/mundo/segundo no son gerundios (60% del cubo era ruido)', () => {
    expect(triage(item('fill_blank', { sentence: 'Faremos uma festa quando as aulas começarem.' })).destino).toBe('neutral');
    expect(triage(item('fill_blank', { sentence: 'Quero viajar pelo mundo.' })).destino).toBe('neutral');
  });
  it('el impersonal «é preciso + infinitivo» es europeo impecable', () => {
    expect(triage(item('fill_blank', { sentence: 'É preciso poupar dinheiro.' })).destino).toBe('neutral');
  });
});

describe('triage → unchecked (riesgo que la regla no juzga)', () => {
  const riesgosDe = (r: ReturnType<typeof triage>) => (r as { riesgos: string[] }).riesgos;

  it('clítico sufijado y suelto', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'Ela chama-se Maria.' })))).toContain('clitico');
    expect(triage(item('fill_blank', { sentence: 'Pensa nos amigos.' })).destino).toBe('unchecked');
  });
  it('«Eles a conhecem bem» — próclise BR de acusativo, invisible para la v1', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'Eles a conhecem bem.' })))).toContain('clitico');
  });
  it('2.ª persona explícita y de sujeto nulo («vais»)', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'O teu carro é novo.' })))).toContain('2a-persona');
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'O que vais fazer este fim de semana?' })))).toContain('2a-persona');
  });
  it('gerundio real', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'Saiu correndo da sala.' })))).toContain('gerundio');
  });
  it('grafía nasal BR (gênio) — pero no los invariantes', () => {
    expect(riesgosDe(triage(item('flashcard', { back: 'gênio' })))).toContain('nasal-circunfleja');
  });
  it('«precisar + infinitivo» sin de — 13 sellados por la v1', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'Preciso falar com essa pessoa.' })))).toContain('precisar-sin-de');
  });
  it('«Tem muita gente aqui hoje» — existencial BR', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'Tem muita gente aqui hoje.' })))).toContain('tem-existencial');
  });
  it('español dentro del campo portugués', () => {
    expect(riesgosDe(triage(item('flashcard', { back: 'Actualmente, en la actualidad.' }))).some((x) => ['espanol', 'grafia-pre-ao90'].includes(x))).toBe(true);
    expect(riesgosDe(triage(item('flashcard', { back: 'Comparezca usted mismo.' })))).toContain('espanol');
  });
  it('grafía europea pre-AO90 (directamente) — inválida en ambas normas', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'Vou reclamar directamente com o director.' })))).toContain('grafia-pre-ao90');
  });
  it('deixis «esse … aqui»', () => {
    expect(riesgosDe(triage(item('fill_blank', { sentence: 'Esse relatório aqui não serve.' })))).toContain('deixis-esse-aqui');
  });
  it('sin texto escaneable no se sella (type lesson)', () => {
    expect(riesgosDe(triage(item('lesson', {})))).toContain('sin-texto-escaneable');
  });
  it('marcador en campo didáctico retiene, no cuarentena (distractores de MC, sentence de error_correction)', () => {
    const rMc = triage(item('multiple_choice', { options: ['o senhor / a senhora', 'você', 'tu'] }));
    expect(rMc.destino).toBe('unchecked');
    const rEc = triage(item('error_correction', { sentence: 'Não diga-me isso.', correct: 'Não me diga isso.' }));
    expect(rEc.destino).toBe('unchecked');
  });
  it('contraste implícito: el ítem trae la forma europea del marcador', () => {
    const r = triage(item('fill_blank', { sentence: "Em Portugal, o 'ônibus' chama-se '___'.", answer: 'autocarro' }));
    expect(r.destino).toBe('unchecked');
    expect(riesgosDe(r).some((x) => x.startsWith('contraste-implicito'))).toBe(true);
  });
  it('matching con pares (BR) es exento; con coloquialismos sin etiqueta, retenido', () => {
    const rEx = triage(item('matching', { pairs: [{ left: 'ônibus (BR)', right: 'autocarro' }] }));
    expect(riesgosDe(rEx)).toContain('exento');
    const rBr = triage(item('matching', { pairs: [{ left: 'valeu', right: 'obrigado' }] }));
    expect(rBr.destino).toBe('unchecked');
  });
  it('aviso de la lista cerrada retiene, no cuarentena', () => {
    expect(triage(item('fill_blank', { sentence: 'O time jogou bem.' })).destino).toBe('unchecked');
  });
  it('ítem exento por tag nunca se consagra ni se cuarentena', () => {
    const r = triage(item('flashcard', { back: 'comboio / trem' }, { tags: ['regional'] }));
    expect(riesgosDe(r)).toContain('exento');
  });
});

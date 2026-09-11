// tests/unit/voces-la.test.ts
//
// Las cinco voces del latín, validadas a oído por Edu el 2026-09-10, y el
// invariante que impide que se desincronicen de `EL_VOICES.la`: el mismo
// dato en dos ficheros se separa solo, y aquí el dato es un id de voz que
// entra en el HASH de cada MP3 — desincronizarlo no rompe nada visible,
// sólo empieza a pagar clips con la voz equivocada.
import { describe, it, expect } from 'vitest';
import { VOCES_LA, VOZ_LA_PRINCIPAL, SELLO_VOZ_LA, vozLaPorNombre } from '@/lib/data/languages/la/voces';
import { EL_VOICES, elevenTtsHash } from '@/scripts/lib/elevenlabs-tts';

describe('voces del latín', () => {
  it('son cinco, con id y nombre únicos', () => {
    expect(VOCES_LA).toHaveLength(5);
    expect(new Set(VOCES_LA.map((v) => v.id)).size).toBe(5);
    expect(new Set(VOCES_LA.map((v) => v.nombre)).size).toBe(5);
    for (const v of VOCES_LA) expect(v.id).toMatch(/^[A-Za-z0-9]{20}$/);
  });

  it('EL_VOICES.la apunta a la principal: los dos ficheros dicen lo mismo', () => {
    expect(EL_VOICES.la?.id).toBe(VOZ_LA_PRINCIPAL.id);
    expect(EL_VOICES.la?.name).toBe(VOZ_LA_PRINCIPAL.nombre);
    expect(vozLaPorNombre(EL_VOICES.la!.name)).toBeTruthy();
  });

  it('el sello dice QUIÉN validó, CUÁNDO y qué NO certifica', () => {
    expect(EL_VOICES.la?.validatedBy).toBe(SELLO_VOZ_LA.validatedBy);
    expect(EL_VOICES.la?.validatedAt).toBe(SELLO_VOZ_LA.validatedAt);
    expect(SELLO_VOZ_LA.validatedBy).toMatch(/oído de Edu/);
    // La cautela honesta: un oído no nativo valida dónde cae el acento,
    // no la calidad del acento italiano.
    expect(SELLO_VOZ_LA.validatedBy).toMatch(/no nativo italiano/);
    expect(SELLO_VOZ_LA.noCertifica.length).toBeGreaterThan(20);
  });

  it('el acento de cada voz está declarado, y la única no estándar lleva su aviso', () => {
    for (const v of VOCES_LA) expect(v.acento).toMatch(/^it-/);
    const noEstandar = VOCES_LA.filter((v) => v.acento !== 'it-standard');
    expect(noEstandar.map((v) => v.nombre)).toEqual(['ElevenLabs_Rita']);
    for (const v of noEstandar) expect(v.nota, `${v.nombre} no estándar sin aviso`).toMatch(/NAPOLITANA|no es estándar/);
  });

  it('hay exactamente un narrador: cinco voces son cinco papeles, no cinco corpus', () => {
    const narradores = VOCES_LA.filter((v) => v.papel === 'narrador');
    expect(narradores).toHaveLength(1);
    expect(narradores[0]!.nombre).toBe(VOZ_LA_PRINCIPAL.nombre);
    // Y los otros papeles existen: si sólo hubiera narrador, las otras
    // cuatro estarían declaradas sin sitio donde sonar.
    expect(new Set(VOCES_LA.map((v) => v.papel)).size).toBeGreaterThan(1);
  });

  it('el hash de un clip latino cambia con la voz, que es lo que impide pagar dos veces el mismo texto', () => {
    const a = elevenTtsHash({ text: 'dominus illuminatsio mea', variant: 'la' });
    const b = elevenTtsHash({ text: 'dominus illuminatsio mea', variant: 'ro' });
    expect(a).not.toBe(b);
    // Y el mismo texto con la misma voz da el mismo hash: no hay dos eras.
    expect(elevenTtsHash({ text: 'dominus illuminatsio mea', variant: 'la' })).toBe(a);
  });
});

// La adenda del lote 17: el ítem que hace que `r7-gerunziu` mida algo, y
// el gate que le pregunta al ítem QUÉ DARÍA LA REGLA MALA.
//
// El gate es la plantilla que salió del ataque al lote 17: comprobar que
// la respuesta coincide con lo que da la regla buena es darse la razón a
// uno mismo; lo que descubre algo es preguntar qué produce el ATAJO y
// exigir que no coincida. Aquí el atajo es el sufijo español —«cortando»
// empuja a `-ând` y la respuesta es `tăind`—, y la medición que lo motivó
// es que el calco acierta 3 de los 8 gerundios ya publicados.
import { describe, it, expect } from 'vitest';
import { verificar, ITEMS, desinenciaPorCalcoEs, GERUNDIO_ES } from '../../scripts/lotes/cloze-ro-b1b';
import { ITEMS as PUBLICADOS } from '../../scripts/lotes/cloze-ro-b1';
import type { ClozeRo } from '../../scripts/lotes/cloze-ro-a1';
import { gerunziu } from '../../scripts/lib/paradigma-ro';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';

const caza = (items: ClozeRo[], re: RegExp) => verificar(items).some((s) => re.test(s));

describe('la adenda', () => {
  it('sale limpia y el calco español daría la desinencia CONTRARIA', () => {
    expect(verificar(ITEMS)).toEqual([]);
    expect(desinenciaPorCalcoEs('a tăia')).toBe('ând');
    expect(gerunziu(VERBOS_A1.find((v) => v.inf === 'a tăia')!)).toBe('tăind');
  });

  // ROJO: el gate contra los ítems que YA ESTÁN PUBLICADOS y que el
  // lingüista midió como gratuitos para un hispanohablante.
  it('caza los tres gerundios publicados que el calco español resuelve', () => {
    const gratuitos = PUBLICADOS.filter((x) => x.p === 'r7-gerunziu' && ['a scrie', 'a coborî', 'a citi'].includes(x.inf ?? ''));
    expect(gratuitos.length).toBe(3);
    for (const x of gratuitos)
      expect(caza([{ ...x, transparenteLatin: false }], /se acierta calcando el sufijo/), x.inf).toBe(true);
  });

  it('y NO marca los que rompen el calco (vorbind, făcând, văzând, mergând, plecând)', () => {
    const buenos = PUBLICADOS.filter((x) => x.p === 'r7-gerunziu' && ['a vorbi', 'a face', 'a vedea', 'a merge', 'a pleca'].includes(x.inf ?? ''));
    expect(buenos.length).toBe(5);
    for (const x of buenos)
      expect(caza([{ ...x, transparenteLatin: false }], /se acierta calcando el sufijo/), x.inf).toBe(false);
  });

  it('«no medido» no es «limpio»: un lema sin gerundio español declarado se denuncia', () => {
    expect(caza([{ p: 'r7-gerunziu', inf: 'a dormi', t: 'gerunziu', transparenteLatin: false,
      s: '___ (a dormi) prost, m-am trezit obosit.', pista: 'dormir — gerundio', ancla: 'prost, m-am trezit' }],
      /el atajo no se ha medido/)).toBe(true);
    expect(GERUNDIO_ES['a dormi']).toBeUndefined();
  });
});

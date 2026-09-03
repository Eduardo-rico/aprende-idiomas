// Los gates del lote 16 (corrección A2: reflexivos ac/dat y doblado del
// clítico), CADA UNO contra un caso que DEBE cazar.
//
// Por qué existe y no basta con que el lote salga limpio: un gate visto
// sólo en verde no está probado. En este mismo lote, el gate que defiende
// la clase de error que ya se pagó seis veces —la mala que resulta ser
// rumano correcto— falló DOS veces seguidas contestando una pregunta
// distinta de la que hacía:
//   · v0 `^(el|ea|ei|ele|\p{Lu}\p{L}+)`: «Se spală părul» empieza por una
//     palabra capitalizada, así que el gate leía el propio CLÍTICO como el
//     sujeto que exigía, y callaba en el único caso que existe para cazar.
//   · v1, con los clíticos excluidos: «Ieri se usucă părul» sigue pasando,
//     porque «Ieri» también va en mayúscula — y el lote tiene un ítem que
//     empieza por «Ieri». Lo cazó el lingüista adversarial.
// La pregunta era «¿hay sujeto?» y no «¿empieza por mayúscula?». Ninguna
// regex ortográfica la contesta: hoy es una lista cerrada, y este fichero
// es lo que impide que vuelva a ser una heurística.
import { describe, it, expect } from 'vitest';
import { verificar } from '../../scripts/lotes/corr-ro-a2b';
import type { ItemCorreccion } from '../../scripts/lib/correccion';

const base = { pasada: 1, espejoEs: false, atajoEs: false } as const;
const EXPL_REFL = 'El reflexivo con objeto directo va en dativo y no en acusativo, por eso îmi.';
const EXPL_DOB = 'El objeto humano determinado se dobla con el clítico además de llevar pe delante.';

const caza = (item: ItemCorreccion, re: RegExp) => verificar([item]).some((s) => re.test(s));

describe('r5-reflexivos-ac-dat', () => {
  const it_ = (mala: string, buena: string, calcoEs: string): ItemCorreccion =>
    ({ ...base, p: 'r5-reflexivos-ac-dat', mala, buena, calcoEs, explicacion: EXPL_REFL });

  it('caza la mala sin reflexivo acusativo', () => {
    expect(caza(it_('Spăl mâinile înainte de masă.', 'Îmi spăl mâinile înainte de masă.', 'Me lavo las manos antes de comer.'), /no lleva un reflexivo acusativo/)).toBe(true);
  });
  it('caza la buena que no produce el dativo', () => {
    expect(caza(it_('Mă spăl mâinile înainte de masă.', 'Mă spăl pe mâini înainte de masă.', 'Me lavo las manos antes de comer.'), /no lleva el reflexivo dativo/)).toBe(true);
  });
  it('caza la mala que ya viene en dativo', () => {
    expect(caza(it_('Îmi spăl mâinile la baie.', 'Îmi spăl mâinile în baie.', 'Me lavo las manos en el baño.'), /la mala ya lleva el dativo/)).toBe(true);
  });
  it('caza el sincretismo ne/vă, donde no hay contraste que corregir en ESTE punto', () => {
    expect(caza(it_('Ne spălăm mâinile înainte de masă.', 'Ne spălăm mâinile înainte de cină.', 'Nos lavamos las manos antes de comer.'), /misma forma en acusativo y en dativo/)).toBe(true);
  });
  it('caza el calco español sin clítico: sin él no hay ambigüedad de la que salga el error', () => {
    expect(caza(it_('Mă spăl mâinile înainte de masă.', 'Îmi spăl mâinile înainte de masă.', 'Lavo las manos antes de comer.'), /no lleva el clítico «me\/te\/se»/)).toBe(true);
  });

  // ── LA MALA QUE ES RUMANO CORRECTO, por dos vías distintas ──────────
  it('caza la 3.ª sin sujeto: «Se spală părul» es pasiva refleja correcta', () => {
    expect(caza(it_('Se spală părul în fiecare dimineață.', 'Își spală părul în fiecare dimineață.', 'Se lava el pelo todas las mañanas.'), /pasiva refleja/)).toBe(true);
  });
  it('y caza también el sujeto FALSO que la heurística ortográfica dejaba pasar («Ieri»)', () => {
    expect(caza(it_('Ieri se usuca părul cu uscătorul.', 'Ieri își usuca părul cu uscătorul.', 'Ayer se secaba el pelo con el secador.'), /pasiva refleja/)).toBe(true);
  });
  it('y NO se dispara con un sujeto declarado pegado al clítico', () => {
    expect(caza(it_('Maria se schimbă pantofii la intrare.', 'Maria își schimbă pantofii la intrare.', 'María se cambia los zapatos en la entrada.'), /pasiva refleja/)).toBe(false);
  });
  it('caza el sincretismo 1.ª sg / 3.ª pl, que da a la mala una lectura correcta', () => {
    // «spun» es a la vez «eu spun» y «ei spun»: «Mă spun…» se lee «ellos me…».
    expect(caza(it_('Mă spun adevărul mereu.', 'Îmi spun adevărul mereu.', 'Me digo la verdad siempre.'), /1\.ª sg y 3\.ª pl/)).toBe(true);
  });
});

describe('r6-doblado-cliticos', () => {
  const it_ = (mala: string, buena: string, calcoEs: string): ItemCorreccion =>
    ({ ...base, p: 'r6-doblado-cliticos', mala, buena, calcoEs, explicacion: EXPL_DOB });

  it('caza el ítem donde «pe» entra o sale, que sería de r6-pe-regla-operativa', () => {
    expect(caza(it_('Caut pe un doctor bun.', 'Îl caut un doctor bun.', 'Busco a un médico bueno.'), /tiene que estar en la mala y en la buena/)).toBe(true);
  });
  it('caza la mala que ya viene doblada', () => {
    expect(caza(it_('Îl văd pe Ion azi.', 'Îl văd pe Ion mâine.', 'Veo a Ion hoy.'), /ya lleva un clítico de acusativo/)).toBe(true);
  });
  it('caza la buena sin clítico', () => {
    expect(caza(it_('Văd pe Ion azi.', 'Văd pe Ion mâine.', 'Veo a Ion hoy.'), /no lleva el clítico de acusativo que el doblado exige/)).toBe(true);
  });
  it('caza el objeto indefinido, donde el doblado no es obligatorio y la mala no sería agramatical', () => {
    expect(caza(it_('Aștept pe o colegă la intrare.', 'O aștept pe o colegă la intrare.', 'Espero a una compañera en la entrada.'), /es indefinido/)).toBe(true);
  });
  it('y NO confunde la «o» del indefinido con el clítico: ése lo denuncia el gate de arriba, no éste', () => {
    expect(caza(it_('Aștept pe o colegă la intrare.', 'O aștept pe o colegă la intrare.', 'Espero a una compañera en la entrada.'), /ya lleva un clítico de acusativo/)).toBe(false);
  });

  // ── LAS TRES MITADES DEL ATAJO ESPAÑOL ─────────────────────────────
  // La v0 sólo miraba el doblado POSPUESTO, que es justo el que el español
  // de México no hace: comprobaba el caso imposible y dejaba pasar los dos
  // posibles. Lo cazó el lingüista adversarial.
  it('caza el calco con doblado pospuesto («Lo veo a Ion»)', () => {
    expect(caza(it_('Văd pe Ion în fiecare zi.', 'Îl văd pe Ion în fiecare zi.', 'Lo veo a Ion todos los días.'), /el calco español dobla el clítico/)).toBe(true);
  });
  it('caza el calco con objeto ANTEPUESTO, donde el español de México dobla obligatoriamente', () => {
    expect(caza(it_('Văd pe Maria în fiecare zi.', 'O văd pe Maria în fiecare zi.', 'A María la veo todos los días.'), /el calco español dobla el clítico/)).toBe(true);
  });
  it('caza el calco con pronombre fuerte («Lo veo a él»)', () => {
    expect(caza(it_('Văd pe el în fiecare zi.', 'Îl văd pe el în fiecare zi.', 'Lo veo a él todos los días.'), /el calco español dobla el clítico/)).toBe(true);
  });
  it('y NO marca las glosas normales, que es donde el gate ruidoso se apagaría', () => {
    expect(caza(it_('Văd pe Ion în fiecare zi.', 'Îl văd pe Ion în fiecare zi.', 'Veo a Ion todos los días.'), /el calco español dobla el clítico/)).toBe(false);
    expect(caza(it_('Ajut pe colega mea la teme.', 'O ajut pe colega mea la teme.', 'Ayudo a mi compañera con los deberes.'), /el calco español dobla el clítico/)).toBe(false);
  });

  // El clítico APOYADO en el auxiliar: la v0 del gate pedía frontera de
  // palabra detrás de «i-», y detrás del guion siempre hay letra. Cuatro
  // falsos sobre cuatro ítems correctos.
  it('reconoce el clítico apoyado en el auxiliar (i-am, l-am) y no suspende un ítem bueno', () => {
    expect(caza(it_('Am sunat pe vecini aseară.', 'I-am sunat pe vecini aseară.', 'Llamé a los vecinos anoche.'), /no lleva el clítico de acusativo/)).toBe(false);
    expect(caza(it_('Ieri am văzut pe tatăl tău în piață.', 'Ieri l-am văzut pe tatăl tău în piață.', 'Ayer vi a tu padre en el mercado.'), /no lleva el clítico de acusativo/)).toBe(false);
  });
});

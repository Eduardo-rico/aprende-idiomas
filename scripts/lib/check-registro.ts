// scripts/lib/check-registro.ts — gate de coherencia de registro
// (Ola B2C2-PT, 2026-07-29).
//
// El currículo lo pedía textualmente: «no se puede poner un gate que
// falle si un ítem PT-PT formal usa 'você'». Ahora se puede. Cruza los
// campos `register`/`address` declarados por el ítem contra las marcas
// de tratamiento de su texto portugués. SOLO opina sobre ítems que
// declaran — el corpus viejo (sin campos) no dispara nada.
import { textoPortugues, type Ex, type Hallazgo } from './variant-guard';

const b = (p: string) => new RegExp(`(?<![\\p{L}])(?:${p})(?![\\p{L}])`, 'iu');

// Marcas de tuteo: pronombres/posesivos y las formas verbales 2sg de la
// lista del triage (reutilizada a mano para no importar el clasificador).
const TUTEO = b(
  'tu|te|ti|contigo|teu|tua|teus|tuas|' +
  'és|estás|tens|vais|queres|podes|sabes|gostas|falas|moras|trabalhas|' +
  'estudas|precisas|achas|dizes|fazes|vens|dás|vês|lês|ouves|dormes|' +
  'ficas|chegas|sais|pões|conheces|entendes|percebes|escreves|abres',
);
const VOCE = b('voc[êe]');
const O_SENHOR = b('o senhor|a senhora|os senhores|as senhoras');

interface ExConRegistro extends Ex {
  register?: string;
  address?: string;
}

export function revisarRegistro(ex: ExConRegistro): Hallazgo[] {
  const out: Hallazgo[] = [];
  const t = textoPortugues(ex);
  if (!t.trim()) return out;

  const marca = (marcador: string, europeo: string) =>
    out.push({
      id: ex.id, campo: 'register', marcador, europeo,
      severidad: 'error',
      texto: t.length > 120 ? t.slice(0, 117) + '…' : t,
    });

  if (ex.register === 'formal' || ex.register === 'solene') {
    if (VOCE.test(t)) marca(`registro ${ex.register} con «você»`, 'o senhor / 3.ª persona sin pronombre');
    if (TUTEO.test(t)) marca(`registro ${ex.register} con tuteo`, 'o senhor / 3.ª persona sin pronombre');
  }
  if (ex.address === 'tu' && O_SENHOR.test(t)) {
    marca('address=tu con «o senhor» en el texto', 'tratamiento coherente con el declarado');
  }
  if ((ex.address === 'o_senhor' || ex.address === 'V_Exa' || ex.address === 'nome_cargo'
    || ex.address === 'terceira_sem_pronome') && TUTEO.test(t)) {
    marca(`address=${ex.address} con tuteo en el texto`, 'tratamiento coherente con el declarado');
  }
  return out;
}

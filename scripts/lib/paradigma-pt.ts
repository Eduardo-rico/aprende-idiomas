// scripts/lib/paradigma-pt.ts
//
// El conjugador que hace DERIVABLE la familia industrial de paradigma.
//
// La línea industrial de mediación derivaba la clave aplicando una
// transformación declarada. Para un punto de MORFOLOGÍA la derivación es
// aún más limpia: la forma correcta se calcula del paradigma, así que el
// gate puede comprobar cada ítem contra el cálculo en vez de contra el
// juicio del autor — que es lo que rompió el lote de 44.
//
// Cubre lo que los dos puntos del lote necesitan: futuro y condicional
// (donde sólo hay TRES irregulares), el futuro composto, y la MESÓCLISE,
// que es el punto más característico del portugués europeo culto y el que
// el corpus tenía con un solo ítem.

export type Persona = 'eu' | 'tu' | 'ele' | 'nós' | 'eles';

/** Los únicos tres irregulares del futuro y del condicional. La regla se
 *  enuncia con la excepción delante a propósito: el resto se forma sobre
 *  el infinitivo entero, sin excepciones. */
const RAIZ_IRREGULAR: Record<string, string> = { dizer: 'dir', fazer: 'far', trazer: 'trar' };

const DES_FUTURO: Record<Persona, string> = { eu: 'ei', tu: 'ás', ele: 'á', 'nós': 'emos', eles: 'ão' };
const DES_COND: Record<Persona, string> = { eu: 'ia', tu: 'ias', ele: 'ia', 'nós': 'íamos', eles: 'iam' };

const raiz = (inf: string) => RAIZ_IRREGULAR[inf] ?? inf;

export const futuro = (inf: string, p: Persona) => raiz(inf) + DES_FUTURO[p];
export const condicional = (inf: string, p: Persona) => raiz(inf) + DES_COND[p];

/** Participio pasado. Los dobles (aceite/aceitado…) se declaran, no se
 *  adivinan: el corpus ya tuvo un ítem que negaba el doble de «matar». */
const PARTICIPIO: Record<string, string> = {
  fazer: 'feito', dizer: 'dito', ver: 'visto', vir: 'vindo', pôr: 'posto',
  escrever: 'escrito', abrir: 'aberto', cobrir: 'coberto', ganhar: 'ganho',
  gastar: 'gasto', pagar: 'pago', aceitar: 'aceite', entregar: 'entregue',
};
export function participio(inf: string): string {
  if (PARTICIPIO[inf]) return PARTICIPIO[inf]!;
  if (inf.endsWith('ar')) return inf.slice(0, -2) + 'ado';
  if (inf.endsWith('er') || inf.endsWith('ir')) {
    const tema = inf.slice(0, -2);
    // Vocal antes de la desinencia ⇒ HIATO ⇒ el participio se acentúa:
    // sa-í-do, ca-í-do, tra-í-do. La regla ingenua daba «saido», que no
    // existe; lo cazó el gate del lote contra este mismo conjugador.
    // La «u» sólo hace hiato si no es la muda de «qu»/«gu»: possu-ído y
    // constru-ído sí, seguido no.
    const hiato = /[aeo]$/.test(tema) || (/u$/.test(tema) && !/[qg]u$/.test(tema));
    return hiato ? tema + 'ído' : tema + 'ido';
  }
  if (inf.endsWith('ôr')) return 'posto';
  throw new Error(`participio: no sé formar el de «${inf}»`);
}

/** Futuro composto: ter en futuro + participio. Es el tiempo que el
 *  currículo pide y que el corpus tenía a CERO — el concepto que llevaba
 *  su nombre enseñaba el perifrástico «ir + infinitivo». */
export const futuroComposto = (inf: string, p: Persona) => `${futuro('ter', p)} ${participio(inf)}`;

export type Clitico = 'me' | 'te' | 'lhe' | 'nos' | 'lhes' | 'o' | 'a' | 'os' | 'as';

/** El clítico de 3.ª pasa a -lo/-la tras -r, -s o -z, que caen. Y el
 *  acento que aparece NO es uniforme: -ar y -er lo llevan (comprá-lo,
 *  vendê-lo) y **-ir NO** (parti-lo, abri-la). Ésa es justamente la
 *  excepción que la skill avisa de no esconder al enunciar la regla. */
function fundirConR(tema: string, c: Clitico): string {
  if (!['o', 'a', 'os', 'as'].includes(c)) return `${tema}-${c}`;
  const sinR = tema.slice(0, -1);
  const l = `l${c}`;
  if (tema.endsWith('ar')) return `${sinR.slice(0, -1)}á-${l}`;
  if (tema.endsWith('er')) return `${sinR.slice(0, -1)}ê-${l}`;
  if (tema.endsWith('ir')) {
    // …salvo con HIATO, que es la misma excepción del participio de aquí
    // arriba y que esta función olvidaba: constru-í-lo, possu-í-lo.
    const antes = sinR.slice(0, -1);
    const hiato = /[aeo]$/.test(antes) || (/u$/.test(antes) && !/[qg]u$/.test(antes));
    return hiato ? `${antes}í-${l}` : `${sinR}-${l}`;   // parti-lo, pero construí-lo
  }
  return `${sinR}-${l}`;
}

/** MESÓCLISE: en futuro y condicional el clítico va DENTRO, entre el tema
 *  (el infinitivo, o la raíz irregular) y la desinencia. */
export function mesoclise(inf: string, c: Clitico, p: Persona, tiempo: 'futuro' | 'condicional' = 'futuro'): string {
  const tema = raiz(inf);
  const des = tiempo === 'futuro' ? DES_FUTURO[p] : DES_COND[p];
  // Los irregulares NO son un caso especial. La v1 los excluía de la
  // fusión alegando que su tema «ya no acaba en -r» — pero `dir-`,
  // `far-` y `trar-` acaban en -r los tres, y la regla les aplica igual:
  // da «di-lo-ão», «fá-lo-á», «trá-las-íamos», no *«dir-lo-ão»*.
  //
  // Lo peor no fue el error sino que **un test verde lo consagraba**:
  // `expect(mesoclise('dizer','o','eles')).toBe('dir-lo-ão')` afirmaba
  // una forma inexistente y los 14 tests pasaban. Lo cazó el muestreo
  // adversarial del lote, no la suite. Un oráculo que se prueba contra
  // sí mismo no prueba nada.
  return `${fundirConR(tema, c)}-${des}`;
}

/** ÊNCLISE simple, para construir el distractor honesto: la forma que un
 *  hispanohablante produce por calco («dirá-me» en vez de «dir-me-á»). */
export const enclise = (formaConjugada: string, c: Clitico) => `${formaConjugada}-${c}`;

/** PRÓCLISE, que es lo que un atractor impone y CANCELA la mesóclise:
 *  «não me dirá», nunca «não dir-me-á». */
export const proclise = (c: Clitico, formaConjugada: string) => `${c} ${formaConjugada}`;

// ── INFINITIVO PESSOAL ───────────────────────────────────────────────
//
// La forma que el español no tiene, y por eso el mapa formato↔punto
// manda producirla (TRANSFORMACIÓN) en vez de juzgarla: reconocer una
// ausencia es fácil, producirla es el punto.
//
// Y es la conjugación más segura del portugués: se construye SIEMPRE
// sobre el infinitivo entero, sin excepciones ni siquiera en los verbos
// más irregulares —ser→sermos, ir→irem, pôr→pormos—, porque no hay raíz
// que alterar. Eso la hace derivable al 100 %, que es lo que el gate
// necesita para recalcularla y comparar.
const DES_INF_PESSOAL: Record<Persona, string> = {
  eu: '', tu: 'es', ele: '', 'nós': 'mos', eles: 'em',
};

export function infinitivoPessoal(inf: string, p: Persona): string {
  const base = inf.normalize('NFC');
  const d = DES_INF_PESSOAL[p];
  if (!d) return base;
  // «pôr» y sus compuestos pierden el circunflejo al recibir desinencia:
  // pôr → pormos, pores, porem.
  let raizBase = /ôr$/.test(base) ? base.replace(/ôr$/, 'or') : base;
  // Y los verbos en -AIR / -UIR / -OER llevan ACENTO en la i cuando la
  // desinencia abre hiato: sair → saíres, saírem (pero sairmos, sin
  // acento, porque ahí no hay hiato). Sin esto el conjugador producía
  // *sairem* y un ítem del lote lo habría publicado — la misma familia
  // de fallo que el `dir-lo-ão` que un test verde consagró en E2#11.
  if (/[aeou]ir$/i.test(raizBase) && (p === 'tu' || p === 'eles')) raizBase = raizBase.replace(/ir$/i, 'ír');
  return raizBase + d;
}

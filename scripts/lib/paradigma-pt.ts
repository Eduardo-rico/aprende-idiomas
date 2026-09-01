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

// ── LOS PARADIGMAS QUE LA LÍNEA DE CLOZE NECESITA (E2#15) ────────────
//
// El cloze con pista produce el 61 % de lo que falta, y su respuesta
// tiene que ser DERIVABLE para que el gate la recalcule en vez de
// creerse al autor — que es lo que rompió el lote de 44 y lo que en
// E2#11 dejó pasar ocho errores de 24.
//
// Sólo lo regular, más una tabla CERRADA de irregulares. Un conjugador
// que adivina es peor que no tenerlo: si un verbo no está en la tabla y
// no es regular, el gate lo dice y el ítem no se publica.

type Conj = 'ar' | 'er' | 'ir';
const conjDe = (inf: string): Conj | null =>
  /ar$/.test(inf) ? 'ar' : /er$/.test(inf) ? 'er' : /ir$/.test(inf) ? 'ir' : null;
const raizReg = (inf: string) => inf.slice(0, -2);

const DES_PRESENTE: Record<Conj, Record<Persona, string>> = {
  ar: { eu: 'o', tu: 'as', ele: 'a', 'nós': 'amos', eles: 'am' },
  er: { eu: 'o', tu: 'es', ele: 'e', 'nós': 'emos', eles: 'em' },
  ir: { eu: 'o', tu: 'es', ele: 'e', 'nós': 'imos', eles: 'em' },
};
const DES_IMPERFEITO: Record<Conj, Record<Persona, string>> = {
  ar: { eu: 'ava', tu: 'avas', ele: 'ava', 'nós': 'ávamos', eles: 'avam' },
  er: { eu: 'ia', tu: 'ias', ele: 'ia', 'nós': 'íamos', eles: 'iam' },
  ir: { eu: 'ia', tu: 'ias', ele: 'ia', 'nós': 'íamos', eles: 'iam' },
};
/** Presente do conjuntivo: -ar toma -e, -er/-ir toman -a. La raíz sale
 *  de la 1.ª sg del presente, así que las irregularidades de esa persona
 *  se heredan (faço → faça, digo → diga, tenho → tenha). */
const DES_PRES_SUBJ: Record<Conj, Record<Persona, string>> = {
  ar: { eu: 'e', tu: 'es', ele: 'e', 'nós': 'emos', eles: 'em' },
  er: { eu: 'a', tu: 'as', ele: 'a', 'nós': 'amos', eles: 'am' },
  ir: { eu: 'a', tu: 'as', ele: 'a', 'nós': 'amos', eles: 'am' },
};

/** Tabla CERRADA de irregulares. Fuera de aquí, sólo lo regular. */
const IRREGULARES: Record<string, Partial<Record<string, Partial<Record<Persona, string>>>>> = {
  ser:   { presente: { eu: 'sou', tu: 'és', ele: 'é', 'nós': 'somos', eles: 'são' },
           imperfeito: { eu: 'era', tu: 'eras', ele: 'era', 'nós': 'éramos', eles: 'eram' },
           presSubj: { eu: 'seja', tu: 'sejas', ele: 'seja', 'nós': 'sejamos', eles: 'sejam' },
           imperativoTu: { tu: 'sê' } },
  estar: { presente: { eu: 'estou', tu: 'estás', ele: 'está', 'nós': 'estamos', eles: 'estão' },
           presSubj: { eu: 'esteja', tu: 'estejas', ele: 'esteja', 'nós': 'estejamos', eles: 'estejam' },
           imperativoTu: { tu: 'está' } },
  ter:   { presente: { eu: 'tenho', tu: 'tens', ele: 'tem', 'nós': 'temos', eles: 'têm' },
           imperfeito: { eu: 'tinha', tu: 'tinhas', ele: 'tinha', 'nós': 'tínhamos', eles: 'tinham' },
           presSubj: { eu: 'tenha', tu: 'tenhas', ele: 'tenha', 'nós': 'tenhamos', eles: 'tenham' },
           imperativoTu: { tu: 'tem' } },
  ir:    { presente: { eu: 'vou', tu: 'vais', ele: 'vai', 'nós': 'vamos', eles: 'vão' },
           imperfeito: { eu: 'ia', tu: 'ias', ele: 'ia', 'nós': 'íamos', eles: 'iam' },
           presSubj: { eu: 'vá', tu: 'vás', ele: 'vá', 'nós': 'vamos', eles: 'vão' },
           imperativoTu: { tu: 'vai' } },
  fazer: { presente: { eu: 'faço', tu: 'fazes', ele: 'faz', 'nós': 'fazemos', eles: 'fazem' },
           presSubj: { eu: 'faça', tu: 'faças', ele: 'faça', 'nós': 'façamos', eles: 'façam' },
           imperativoTu: { tu: 'faz' } },
  dizer: { presente: { eu: 'digo', tu: 'dizes', ele: 'diz', 'nós': 'dizemos', eles: 'dizem' },
           presSubj: { eu: 'diga', tu: 'digas', ele: 'diga', 'nós': 'digamos', eles: 'digam' },
           imperativoTu: { tu: 'diz' } },
  vir:   { presente: { eu: 'venho', tu: 'vens', ele: 'vem', 'nós': 'vimos', eles: 'vêm' },
           presSubj: { eu: 'venha', tu: 'venhas', ele: 'venha', 'nós': 'venhamos', eles: 'venham' },
           imperativoTu: { tu: 'vem' } },
  poder: { presente: { eu: 'posso', tu: 'podes', ele: 'pode', 'nós': 'podemos', eles: 'podem' },
           presSubj: { eu: 'possa', tu: 'possas', ele: 'possa', 'nós': 'possamos', eles: 'possam' } },
  querer:{ presente: { eu: 'quero', tu: 'queres', ele: 'quer', 'nós': 'queremos', eles: 'querem' },
           presSubj: { eu: 'queira', tu: 'queiras', ele: 'queira', 'nós': 'queiramos', eles: 'queiram' } },
  saber: { presente: { eu: 'sei', tu: 'sabes', ele: 'sabe', 'nós': 'sabemos', eles: 'sabem' },
           presSubj: { eu: 'saiba', tu: 'saibas', ele: 'saiba', 'nós': 'saibamos', eles: 'saibam' } },
  dar:   { presente: { eu: 'dou', tu: 'dás', ele: 'dá', 'nós': 'damos', eles: 'dão' },
           presSubj: { eu: 'dê', tu: 'dês', ele: 'dê', 'nós': 'demos', eles: 'deem' },
           imperativoTu: { tu: 'dá' } },
  ver:   { presente: { eu: 'vejo', tu: 'vês', ele: 'vê', 'nós': 'vemos', eles: 'veem' },
           presSubj: { eu: 'veja', tu: 'vejas', ele: 'veja', 'nós': 'vejamos', eles: 'vejam' },
           imperativoTu: { tu: 'vê' } },
  pôr:   { presente: { eu: 'ponho', tu: 'pões', ele: 'põe', 'nós': 'pomos', eles: 'põem' },
           presSubj: { eu: 'ponha', tu: 'ponhas', ele: 'ponha', 'nós': 'ponhamos', eles: 'ponham' },
           imperativoTu: { tu: 'põe' } },
  haver: { presente: { ele: 'há' }, imperfeito: { ele: 'havia' }, presSubj: { ele: 'haja' } },
};

export type Tiempo = 'presente' | 'imperfeito' | 'presSubj' | 'imperativoTu';

/** Devuelve la forma, o `null` si el verbo no es regular y no está en la
 *  tabla cerrada. Devolver `null` es la parte importante: un conjugador
 *  que adivina consagra formas falsas, como el `dir-lo-ão` que un test
 *  verde dio por bueno en E2#11. */
export function conjugar(inf: string, tiempo: Tiempo, p: Persona): string | null {
  const irr = IRREGULARES[inf]?.[tiempo]?.[p];
  if (irr) return irr;
  const c = conjDe(inf);
  if (!c) return null;
  if (IRREGULARES[inf] && !IRREGULARES[inf]![tiempo]) {
    // Verbo con irregularidades declaradas pero no en ESTE tiempo: se
    // deja pasar al regular sólo si el tiempo no depende de la 1.ª sg.
    if (tiempo === 'presSubj' || tiempo === 'imperativoTu') return null;
  }
  const r = raizReg(inf);
  // CAMBIO ORTOGRÁFICO ante desinencia en -e: la raíz conserva el SONIDO
  // y cambia la letra — chegar→cheguem, ficar→fiquem, começar→comecem.
  // Sin esto el conjugador daba *chegem* y *ficemos*, y el muestreo del
  // 20 % lo cazó en un ítem publicable. Es la misma familia que el
  // `dir-lo-ão` de E2#11: una forma falsa que el gate habría bendecido
  // porque «salía del paradigma».
  const anteE = (raiz: string) =>
    /c$/.test(raiz) ? raiz.slice(0, -1) + 'qu'
    : /g$/.test(raiz) ? raiz + 'u'
    : /ç$/.test(raiz) ? raiz.slice(0, -1) + 'c'
    : raiz;
  if (tiempo === 'presente') return r + DES_PRESENTE[c][p];
  if (tiempo === 'imperfeito') return r + DES_IMPERFEITO[c][p];
  if (tiempo === 'presSubj') return (c === 'ar' ? anteE(r) : r) + DES_PRES_SUBJ[c][p];
  // El imperativo de TU de los regulares es la 3.ª sg del presente.
  if (tiempo === 'imperativoTu') return r + DES_PRESENTE[c].ele;
  return null;
}

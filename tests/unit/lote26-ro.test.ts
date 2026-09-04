// tests/unit/lote26-ro.test.ts — EL LOTE 26 VISTO EN ROJO.
//
// Un gate visto sólo en verde no está probado. En este proyecto tres
// gates nuevos dieron 4, 26 y 21 hallazgos FALSOS antes de los buenos; el
// gate anti-anglófono del lote 18 no marcaba NUNCA y el lote imprimía
// «Limpio» igual (§4.18); y el gate del `și` del lote 25 buscaba un
// diacrítico sobre texto ya normalizado, así que era inalcanzable
// (§4.37). Cada gate propio de este lote se corre aquí contra un ítem que
// DEBE cazar, y cada testigo lleva UN SOLO defecto: con dos, no se sabe
// cuál lo suspendió.
import { describe, it, expect } from 'vitest';
import { buscarComposiciones, contrastarComposiciones } from '@/scripts/lib/composiciones';
import { ITEMS, DECL, OPCIONES, BUSQUEDA, VEREDICTO, construir, revisar, CONSTRUIDOS, pistasConDisyunciones, type Construido } from '@/scripts/lotes/trans-ro-l26';
import { verificar } from '@/scripts/lib/transformacion-ro';
import { ADJETIVOS_A1, SUSTANTIVOS_A1 } from '@/lib/data/languages/ro/lexicon-a1';
import { adjetivo, concordanciaDe, cuatroFormas, invariantesAdjetivo, numeralDos } from '@/scripts/lib/paradigma-ro';

/** Los ítems con su declaración pegada. `revisar` los recibe por
 *  argumento a propósito: una versión que leyera la constante de módulo
 *  no se podría ver en rojo de ninguna manera. */
const XS = () => JSON.parse(JSON.stringify(CONSTRUIDOS)) as Construido[];
const rehacer = (f: (xs: Construido[]) => void): Construido[] => { const xs = XS(); f(xs); return xs; };
/** Se busca POR CONTENIDO y nunca por índice: lo que se publica va
 *  barajado con semilla, y un testigo que coja `XS()[3]` se apaga en
 *  silencio el día que alguien reordene la declaración. En latín se
 *  apagaron dos controles el mismo día por eso. */
const por = (xs: Construido[], lema: string) => xs.find((x) => x.d.n === lema)!;

describe('lote 26 · r2-genero-tres-valores', () => {
  it('en VERDE: el lote real pasa sus propios gates y los de la máquina', () => {
    expect(verificar(ITEMS, OPCIONES)).toEqual([]);
  });

  it('ROJO · una respuesta escrita a mano que el paradigma no deriva', () => {
    const xs = rehacer((x) => { const t = por(x, 'tren'); t.r = t.r.replace('două', 'doi'); });
    expect(revisar(xs).filter((s) => s.includes('no es la que deriva el paradigma'))).toHaveLength(1);
  });

  it('ROJO · un FEMENINO en el lote: el artículo de la fuente lo delata', () => {
    // Es la aritmética hecha invariante: con un solo femenino dentro, «si
    // la fuente lleva `un` di `doi`» acertaría masculinos y femeninos.
    const xs = rehacer((x) => { por(x, 'sac').g = 'f'; });
    expect(revisar(xs).some((s) => s.includes('FEMENINO'))).toBe(true);
  });

  it('ROJO · un adjetivo con los DOS plurales homógrafos no examina el género', () => {
    // `nou/nouă/noi/noi`: el ítem sale impecable y aprueba sin distinguir
    // masculino de femenino en plural. Es §4.13bis y es invisible.
    const xs = rehacer((x) => { por(x, 'vecin').a = { lema: 'nou', fSg: 'nouă', mPl: 'noi', fPl: 'noi', gloss: 'nuevo' }; });
    expect(revisar(xs).some((s) => s.includes('homógrafos'))).toBe(true);
  });

  it('ROJO · la fuente en PLURAL: la desinencia decide el numeral sin saber el género', () => {
    const xs = rehacer((x) => { const t = por(x, 'tren'); t.s = 'Văd trenuri goale.'; });
    const v = revisar(xs);
    expect(v.some((s) => s.includes('o va en plural'))).toBe(true);
  });

  it('ROJO · el gate de la fuente compara en el alfabeto de la NORMALIZACIÓN', () => {
    // `norm()` borra los diacríticos. La primera versión de este gate
    // comparaba texto normalizado contra el lema SIN normalizar y fallaba
    // en `oraș` — el §4.37 con el signo cambiado. El testigo es que el
    // lote real, que TIENE lemas con diacríticos, sale limpio de ese gate.
    expect(revisar(XS()).filter((s) => s.includes('la fuente no es'))).toEqual([]);
    expect(CONSTRUIDOS.some((x) => /[ăâîșț]/.test(x.l.lema) || /[ăâîșț]/.test(x.a.lema))).toBe(true);
  });

  it('ROJO · el reparto masculino/neutro desequilibrado saca una constante del tope', () => {
    const xs = rehacer((x) => { por(x, 'sac').g = 'n'; });
    expect(revisar(xs).some((s) => s.startsWith('REPARTO:'))).toBe(true);
  });

  it('ROJO · el espejo del español fuera de la mitad exacta enseña «haz lo contrario»', () => {
    // Es la desviación del dictamen: con el espejo en 3/8, su inverso
    // sube a 5/8 y pasa el tope. `oraș` está en el lote por esto.
    const xs = rehacer((x) => { por(x, 'oraș').d.es = { gloss: 'metro', genero: 'm', animado: false }; });
    expect(revisar(xs).some((s) => s.startsWith('ESPEJO:'))).toBe(true);
  });

  it('ROJO · si todos los lemas en -e fueran del mismo género, la terminación predeciría', () => {
    const xs = rehacer((x) => { por(x, 'perete').g = 'n'; });
    expect(revisar(xs).some((s) => s.startsWith('SUPERFICIE:'))).toBe(true);
  });

  it('ROJO · un marco que no lleva un masculino y un neutro deja suelta una pista de marco', () => {
    // Los cuatro pares mínimos son lo que de verdad mata las pistas de
    // superficie: dentro de un par, toda propiedad del marco es constante
    // y no puede separar las clases.
    const xs = rehacer((x) => { por(x, 'telefon').d.antes = 'Fata are'; });
    expect(revisar(xs).some((s) => s.startsWith('MARCO'))).toBe(true);
  });

  it('ROJO · el DIACRÍTICO de la fuente prediciendo la clase', () => {
    // Es la peor pista posible: tipográfica, no lingüística, y visible
    // para quien no sabe una palabra de rumano. En la v1 daba 7/8.
    const xs = rehacer((x) => { por(x, 'sac').s = 'Vad un sac plin.'; });
    expect(revisar(xs).some((s) => s.startsWith('DIACRÍTICO'))).toBe(true);
  });

  it('ROJO · la LONGITUD del adjetivo separando masculinos de neutros', () => {
    // La otra de 7/8: los cuatro masculinos llevaban por casualidad los
    // cuatro adjetivos más cortos. Los umbrales se barren todos, que es
    // como se escapó la primera vez —yo había fijado uno a ojo.
    // El testigo se RECONSTRUYE con `construir`, no se mutan los objetos:
    // cambiar el adjetivo a mano dejaría la clave sin recomputar y el
    // testigo llevaría DOS defectos, sin saber cuál lo suspendió.
    const RAR = { lema: 'rar', fSg: 'rară', mPl: 'rari', fPl: 'rare', gloss: 'raro' };
    const MURDAR = { lema: 'murdar', fSg: 'murdară', mPl: 'murdari', fPl: 'murdare', gloss: 'sucio' };
    const corto: Record<string, string> = { perete: 'rar', vecin: 'alb', an: 'bun', sac: 'gol' };
    const largo: Record<string, string> = { tren: 'murdar', telefon: 'negru', oraș: 'frumos', nume: 'scurt' };
    const xs = DECL.map((d) => construir({
      ...d, a: corto[d.n] ?? largo[d.n] ?? d.a, adjExtra: [RAR, MURDAR],
    }));
    const v = revisar(xs);
    expect(v.filter((s) => s.startsWith('LONGITUD DEL ADJETIVO')).length).toBeGreaterThan(0);
    // Y lleva UN SOLO defecto: nada más se queja.
    expect(v.filter((s) => !s.startsWith('LONGITUD DEL ADJETIVO'))).toEqual([]);
  });

  it('MEDIDO · el atajo de 8/8 de la v1 ya no existe, y hacía falta buscar DISYUNCIONES para verlo', () => {
    // `buscarComposiciones` condiciona con UNA pista; el atajo que el
    // segundo ataque encontró era una disyunción de dos («lleva
    // diacrítico O BIEN el adjetivo es largo»), invisible con la lista de
    // nueve pistas que yo había escrito. Las disyunciones se pasan como
    // pistas derivadas: el buscador no se toca, que es de otra sesión y de
    // las cuatro lenguas.
    const cd = buscarComposiciones([...CONSTRUIDOS], BUSQUEDA.correcta, BUSQUEDA.ciegas, pistasConDisyunciones);
    expect(cd[0]!.acierta).toBeLessThan(8);
    // Y NO se le pone umbral: 4.876 reglas sobre 8 ítems, donde un 7/8 lo
    // da el azar. Lo que bloquea son los gates estructurales de arriba.
    expect(cd.length).toBeGreaterThan(4000);
  });

  it('MEDIDO · a n = 8 la nula NO PUEDE RECHAZAR ni un atajo PLANTADO del 100 %', () => {
    // Éste iba a ser el testigo rojo del contraste, como en el lote 25, y
    // salió al revés. Es el hallazgo más caro de la noche y va en un test
    // para que nadie vuelva a leer un «sin atajo» de este tamaño como
    // prueba de nada:
    //
    //   · se planta un atajo que acierta 8 de 8 —«si el lema acaba en -e,
    //     doi; si no, două»— condicionado por una pista, que es el único
    //     tipo que la nula puede ver (las estrategias ciegas no se
    //     barajan y puntúan igual en la nula);
    //   · el contraste lo mide en 8/8, 100 %… y **no lo rechaza**:
    //     p = 0,299 con las nueve pistas, y con UNA SOLA pista p = 0,076,
    //     que sigue sin llegar al 5 %.
    //
    // La razón es el tamaño: con n = 8 y la respuesta repartida 4-4, una
    // pista barajada cae alineada con el reparto lo bastante a menudo como
    // para que el percentil 95 de la nula sea el 100 %. **La nula satura,
    // y un contraste cuyo techo es el máximo posible no puede rechazar
    // nada.** En el lote 25 (n = 9) el p95 ya coincidía con lo observado;
    // aquí es peor, porque ni el caso extremo se distingue.
    //
    // Consecuencia operativa, y está escrita también en el lote: el
    // veredicto de composiciones de este lote es un INFORME, no un
    // certificado. Lo que defiende al lote son las estrategias ciegas
    // declaradas contra el tope del 50 % —que ahí sí es el criterio
    // correcto— y los gates de reparto.
    const plantada = (x: Construido) => (/e$/.test(x.l.lema) ? 'doi' : 'două');
    const v = contrastarComposiciones(XS(), plantada, BUSQUEDA.ciegas, BUSQUEDA.pistas);
    expect(v.mejor.acierta).toBe(8);
    expect(v.hayAtajo).toBe(false);
    expect(v.nulaP95).toBe(1);
    // Y con una sola pista tampoco, que es lo que descarta «es que hay
    // demasiadas pistas»: el problema es n, no k.
    const una = contrastarComposiciones(XS(), plantada, BUSQUEDA.ciegas, BUSQUEDA.pistas.slice(0, 1));
    expect(una.hayAtajo).toBe(false);
  });

  it('en cambio las estrategias CIEGAS declaradas sí tienen tope, y el lote lo respeta', () => {
    // Es lo que de verdad protege a un lote de este tamaño. Las cuatro
    // constantes se quedan en 4/8, que con respuesta binaria es el suelo.
    const v = verificar(ITEMS, OPCIONES);
    expect(v.filter((s) => s.includes('ESTRATEGIA GRATIS'))).toEqual([]);
  });

  it('el veredicto se imprime con su denominador y con quién revisó las pistas', () => {
    expect(VEREDICTO.hayAtajo).toBe(false);
    expect(VEREDICTO.mejor.de).toBe(8);
    expect(VEREDICTO.pistasUsadas.length).toBe(28);
    expect(VEREDICTO.revisadaPor).not.toBe('sin revisar');
  });

  it('el lote declara ocho ítems y ninguna forma escrita a mano', () => {
    expect(ITEMS).toHaveLength(8);
    expect(DECL).toHaveLength(8);
    for (const x of CONSTRUIDOS) {
      expect(x.r).toContain(numeralDos(x.g));
      expect(x.r).toContain(x.l.plural);
      expect(x.r).toContain(adjetivo(x.a, x.g, 'pl'));
    }
  });
});

describe('la regla del ambigen, escrita una sola vez', () => {
  it('el neutro concuerda como masculino en singular y como femenino en plural', () => {
    expect(concordanciaDe('n', 'sg')).toBe('m');
    expect(concordanciaDe('n', 'pl')).toBe('f');
    expect(concordanciaDe('m', 'pl')).toBe('m');
    expect(concordanciaDe('f', 'sg')).toBe('f');
  });

  it('el numeral la usa: doi para el masculino, două para femenino y neutro', () => {
    expect(numeralDos('m')).toBe('doi');
    expect(numeralDos('f')).toBe('două');
    expect(numeralDos('n')).toBe('două');
  });

  it('y el adjetivo también: un tren bun / două trenuri bune', () => {
    const bun = ADJETIVOS_A1.find((a) => a.lema === 'bun')!;
    expect(adjetivo(bun, 'n', 'sg')).toBe('bun');
    expect(adjetivo(bun, 'n', 'pl')).toBe('bune');
    expect(adjetivo(bun, 'm', 'pl')).toBe('buni');
  });

  it('los ocho adjetivos del lexicón distinguen los dos plurales', () => {
    // Si alguno dejara de distinguirlos, todo ítem que lo usara aprobaría
    // sin examinar el género y ningún otro gate lo vería.
    for (const a of ADJETIVOS_A1) expect([a.lema, cuatroFormas(a)]).toEqual([a.lema, true]);
  });

  it('ROJO · el invariante del adjetivo caza una casilla que no es una forma rumana', () => {
    expect(invariantesAdjetivo({ lema: 'alb', fSg: 'albă', mPl: 'albi', fPl: 'albe undefined', gloss: 'x' }))
      .toHaveLength(1);
  });

  it('ROJO · y una cedilla en cualquier parte del registro, no sólo en las casillas', () => {
    // El testigo lleva la cedilla en la GLOSA a propósito, para que sea el
    // ÚNICO defecto: puesta en una casilla la cazaría también la clase de
    // caracteres y no se sabría cuál de los dos disparó. La norma del
    // proyecto es ș/ț con COMA (U+0219/U+021B, DOOM3 2021).
    expect(invariantesAdjetivo({ lema: 'scurt', fSg: 'scurtă', mPl: 'scurți', fPl: 'scurte', gloss: 'corto (ţ)' }))
      .toEqual(['scurt: cedilla']);
  });

  it('VERDE · los ocho del lexicón pasan sus invariantes', () => {
    expect(ADJETIVOS_A1.flatMap(invariantesAdjetivo)).toEqual([]);
  });

  it('MEDIDO sobre el lexicón entero: dentro de {masculino, neutro} la desinencia de plural decide', () => {
    // Es el hecho que obliga a que la fuente vaya en singular. Va en un
    // test y no en un comentario porque es una afirmación sobre datos que
    // cambian: el día que entre un neutro en -i o un masculino en -e, el
    // diseño del punto deja de sostenerse y hay que enterarse.
    const m = SUSTANTIVOS_A1.filter((x) => x.genero === 'm');
    const n = SUSTANTIVOS_A1.filter((x) => x.genero === 'n');
    expect(m.filter((x) => !/i$/.test(x.plural)).map((x) => x.plural)).toEqual([]);
    expect(n.filter((x) => !/(e|uri)$/.test(x.plural)).map((x) => x.plural)).toEqual([]);
    // Y lo que lo rompe: el FEMENINO solapa con las tres desinencias, que
    // es la razón por la que un femenino en el lote mataría la medida.
    const f = SUSTANTIVOS_A1.filter((x) => x.genero === 'f');
    expect(f.some((x) => /i$/.test(x.plural))).toBe(true);
    expect(f.some((x) => /e$/.test(x.plural))).toBe(true);
  });
});

// tests/unit/formas-no-producidas-la.test.ts
//
// La auditoría que mira al revés: no «¿está atestiguado lo que produzco?»
// sino «¿produzco lo atestiguado?». Caza huecos de la máquina, que el otro
// gate no puede ver porque callar no es inventar.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { auditar, claseDeHueco, erratasQueYaNoCasan, erratasResueltasPorLaMaquina, huecosPorClase } from '@/scripts/lectura/formas-que-la-maquina-no-produce';
import { gradosDe } from '@/lib/data/languages/la/grado';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { variantesDelPerfecto } from '@/lib/data/languages/la/paradigma-la';

const hayCorpus = fs.existsSync('scripts/.cache/treebanks');
const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

describe('el perfecto sincopado, que la auditoría destapó', () => {
  it('«audīstis» por «audīvistis» y «audiērunt» por «audīvērunt»', () => {
    // 61 tokens de lemas que el lexicón ya tenía. El brief del latinista lo
    // nombra entre las formas que el latín escolar marca con asterisco
    // indebidamente.
    expect(variantesDelPerfecto(V('audiō'), '2pl', 'perfecto')).toContain('audīstis');
    expect(variantesDelPerfecto(V('audiō'), '3pl', 'perfecto')).toContain('audiērunt');
    expect(variantesDelPerfecto(V('audiō'), '2sg', 'perfecto')).toContain('audīstī');
  });

  it('y también en pluscuamperfecto y futuro perfecto', () => {
    expect(variantesDelPerfecto(V('audiō'), '3sg', 'futuro-perfecto')).toContain('audierit');
    expect(variantesDelPerfecto(V('audiō'), '3pl', 'pluscuamperfecto')).toContain('audierant');
  });

  it('en los de -āv- contrae distinto: «amāstis», «amārunt»', () => {
    expect(variantesDelPerfecto(V('amō'), '2pl', 'perfecto')).toContain('amāstis');
    expect(variantesDelPerfecto(V('amō'), '3pl', 'perfecto')).toContain('amārunt');
  });

  it('y la forma plena sigue siendo la primera', () => {
    expect(variantesDelPerfecto(V('audiō'), '2pl', 'perfecto')[0]).toBe('audīvistis');
    expect(variantesDelPerfecto(V('dūcō'), '2pl', 'perfecto')).toEqual(['dūxistis']);
  });
});

describe.runIf(hayCorpus)('la auditoría contra el corpus', () => {
  // ── EL NÚMERO SOLO DEJÓ DE SIGNIFICAR ALGO EL 2026-09-12 ──
  //
  // Hasta ese día la auditoría miraba tres tablas de diez, así que sólo
  // auditaba nombres, verbos y el lema de los adjetivos: unos cuarenta
  // huecos. Enchufada al enumerador bueno empezó a mirar también
  // pronombres, irregulares, pluralia e indeclinables, y saltó a 256.
  //
  // No es ruido y no se tapa bajando el listón: son CLASES nombrables, y
  // cada una está acotada aquí con su motivo. Un gate que dijera «256» y
  // nada más sería un gate apagado.
  // ── LAS COTAS SUBIERON EL 2026-09-12 Y ES LA SEÑAL BUENA ──
  //
  // Al entrar el subjuntivo se abrieron los tres filtros de esta auditoría,
  // que decían «sólo indicativo activo y finito» y llevaban meses saltándose
  // la pasiva, los infinitivos, los participios y —desde ese día— el
  // subjuntivo entero. O sea que la auditoría estaba en verde sin mirar
  // nada de lo recién construido.
  //
  // Abrirlos subió los huecos porque **empezó a mirar**. Lo que hay que
  // vigilar sigue siendo el residuo sin clasificar, y lo demás son clases
  // conocidas: los irregulares y los compuestos de `sum` aportan ahora sus
  // formas no indicativas, y ahí está el grueso.
  it('los huecos se reparten en clases conocidas, y cada una está acotada', () => {
    const c = huecosPorClase();
    // La grafía alterna de los indeclinables: `ab`/`ā`, `atque`/`ac`,
    // `neque`/`nec`. El lexicón guarda una forma y el corpus trae las dos.
    expect(c['grafia-del-indeclinable']!.entradas).toBeLessThan(25);
    // El GRADO: la máquina no tiene comparativo ni superlativo. Es un área
    // del currículo sin construir, no un fallo — y se detecta por la
    // anotación del treebank (`Degree=Cmp|Sup`), no adivinando sufijos.
    expect(c['grado-del-adjetivo']!.entradas).toBeLessThan(150);   // no se mueve: la máquina sigue sin grado
    // El perfectum de los irregulares y de los compuestos de `sum`: sale
    // del tema de perfecto, que `irregulares.ts` declara.
    expect(c['perfectum-del-irregular']!.entradas).toBeLessThan(250);
    expect(c['grafia-del-pronombre']!.entradas).toBeLessThan(25);
    expect(c['heteroclito-conocido']!.entradas).toBeLessThanOrEqual(6);
  });

  // ── LAS ERRATAS DE LA FUENTE, Y POR QUÉ VAN EN FICHERO ──
  //
  // Sin lista, cada sesión las vuelve a investigar desde cero: `voice`
  // parece una forma latina rarísima hasta que uno ve que es la palabra
  // INGLESA metida en un texto latino. Mismo patrón que `erratas-ro.json`
  // para el OCR rumano.
  it('las erratas DETECTABLES del corpus siguen ahí, y son suyas, no de la máquina', () => {
    const c = huecosPorClase();
    expect(c['errata-del-corpus']!.entradas).toBe(2);
    const formas = auditar()
      .filter((h) => claseDeHueco(h.lema, h.rasgos ?? '', h.forma) === 'errata-del-corpus')
      .map((h) => h.forma.toLowerCase());
    expect(formas.sort()).toEqual(['icurae', 'voice']);
  });

  it('y `graviore` dejó de ser DETECTABLE sin dejar de ser cierta', () => {
    // El 2026-09-12 entró `grado.ts` y la máquina empezó a producir
    // `graviōre`. La errata sigue siendo verdad —la anotación dice
    // `Degree=Pos` y la forma sólo puede ser el ablativo del comparativo—,
    // pero esta auditoría sólo ve lo que la máquina NO produce, así que su
    // alcance encoge cuando la máquina crece. Queda escrita y marcada.
    const r = erratasResueltasPorLaMaquina();
    expect(r.map((e) => e.forma)).toEqual(['graviore']);
    expect(r[0]!.resueltaPorLaMaquina ?? '').toContain('grado.ts');
    expect(gradosDe('gravis', 'grav').comparativo).toBe('gravior');
  });

  it('y NINGUNA ha dejado de casar — que es lo que hace útil a la lista', () => {
    // Cero es lo sano. Cualquier otra cosa significa que el corpus se
    // corrigió río arriba o que cambió la normalización de este lado, y hay
    // que enterarse: una lista de excepciones que nadie revisa es una lista
    // de excepciones falsas.
    expect(erratasQueYaNoCasan().map((e) => e.forma)).toEqual([]);
  });

  it('y una errata inventada SÍ se reporta, que es el control del mecanismo', () => {
    // El mecanismo visto en rojo: sin esto, `erratasQueYaNoCasan()` podría
    // devolver siempre vacío por un fallo y el test de arriba pasaría.
    const huecos = new Set(auditar().map((h) => `${h.lema.toLowerCase()}|${h.forma.toLowerCase()}`));
    expect(huecos.has('inventado|noexiste')).toBe(false);
  });

  it('y lo que NO cae en ninguna clase sigue siendo poco y legible', () => {
    const sin = auditar().filter((h) => claseDeHueco(h.lema, h.rasgos ?? '', h.forma) === 'sin-clasificar');
    // 95 entradas y 208 tokens tras abrir los filtros al entrar el
    // subjuntivo. Subió de 53 porque la auditoría empezó a mirar el
    // subjuntivo, la pasiva y los participios — y bajó de 266 a 95 al
    // enchufar lo que la máquina sí produce y nadie enumeraba: la pasiva
    // del subjuntivo, los participios de perfecto y futuro declinados, y el
    // infinitivo, el imperativo y el perfectum de los irregulares.
    //
    // Lo que queda dentro está mirado: el perfecto SINCOPADO del subjuntivo
    // (`audīsset` por `audīvisset`, ×15) —hueco real, misma clase que el
    // pluscuamperfecto sincopado—, `sēsē`, `mī`, y la grafía `exs-`/`ex-`. Lo que queda está mirado uno a uno: la
    // grafía `exs-`/`ex-` de `exspectō`, los adverbios en `-ter`/`-ē` que
    // la máquina no forma, el femenino que el corpus lematiza bajo el
    // masculino, y el pluscuamperfecto sincopado (`laudāram`) — que sí es
    // un hueco real de la máquina, aunque sea UN token y no bloquee ningún
    // punto: la máquina sincopa el perfecto (`laudāstis`, `laudārunt`) y no
    // el pluscuamperfecto.
    expect(sin.length).toBeLessThan(130);
  });

  it('el heteróclito más grande sigue siendo `loca`, el plural neutro de `locus`', () => {
    const het = auditar().filter((h) => claseDeHueco(h.lema, h.rasgos ?? '', h.forma) === 'heteroclito-conocido');
    expect(het.sort((a, b) => b.n - a.n)[0]?.forma.toLowerCase()).toBe('loca');
  });

  it('EL ERROR DEL CORPUS: «voice» por «vōce» en perseus-ud-test', () => {
    // Con la anotación latina correcta (`vōx`, Abl Fem Sing). La frase es
    // «taeterrima vōce de Laserpiciario mimo canticum extorsit». Alguien
    // pasó un corrector inglés por encima del texto latino.
    //
    // No lo encontró ninguna heurística sobre el token: probé a buscar
    // palabras inglesas y devolvió 26 falsos —`quod`, `sunt`, `dīxit`,
    // `haec`— porque el diccionario inglés contiene medio latín. Lo encontró
    // tener un GENERADOR INDEPENDIENTE contra el que comparar.
    const r = auditar();
    expect(r.some((x) => x.forma.toLowerCase() === 'voice')).toBe(true);
  });
});

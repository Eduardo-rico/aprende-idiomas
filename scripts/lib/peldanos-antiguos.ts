// scripts/lib/peldanos-antiguos.ts
//
// LOS PELDAÑOS DEL LATÍN Y DEL GRIEGO, Y EL GATE DE «UNA CAJA, UN SISTEMA».
//
// ── De dónde sale este fichero ────────────────────────────────────────
//
// El peldaño L5 se declaró así: «el idiolecto de autor Y la lengua
// arcaica: brevitas y variatio; metros líricos; morfología pre-clásica».
// Al medir a sus TRES representantes salieron 21 puntos de abanico —
// Horacio 72,4 · Tácito 64,1 · Plauto 51,3— y el diagnóstico no fue de
// medición sino de definición: **L5 no era un peldaño, eran tres
// dificultades metidas en una caja**, y su propia frase lo decía en voz
// alta desde el primer día.
//
// El coordinador señaló lo que eso implica: los 5 de 7 saltos
// «confirmados» de §1.6 confirmaron **el ORDEN**, no que cada caja
// contuviera una sola cosa. Son dos preguntas distintas y la segunda no
// se había hecho nunca — un sello que responde a una pregunta usado como
// prueba de otra.
//
// ── Por qué NO es un detector de texto ────────────────────────────────
//
// La tentación era escribir una heurística que leyera la prosa y contara
// sistemas. Sería un gate ruidoso: TODOS los peldaños enumeran cosas
// («las cinco declinaciones y las cuatro conjugaciones»), y distinguir
// «varias piezas del mismo sistema» de «varios sistemas» a golpe de
// regex es justo la clase de barrido que marca de más y se deja de leer.
//
// Así que el gate es un INVARIANTE DECLARADO: cada peldaño enumera sus
// sistemas en un campo, y **más de uno es un fallo** que hay que resolver
// partiendo el peldaño o escribiendo una exención con motivo. La
// heurística de texto se queda, pero como SEGUNDO CAMINO: compara la
// prosa con lo declarado y avisa cuando la prosa parece traer más
// sistemas de los que el campo confiesa. Ninguno de los dos manda solo.

export type Lengua = 'la' | 'grc';

export interface Peldano {
  id: string;
  /** Los sistemas gramaticales que hay que tener automatizados. UNO, o
   *  el gate falla. Es la definición operativa de peldaño del Paso 0
   *  §1.1: «un sistema que hay que tener automatizado para leer sin
   *  ayuda el material del peldaño siguiente». */
  sistemas: string[];
  /** La definición en prosa, tal como está en el documento. Se conserva
   *  para que el segundo camino pueda contrastarla con `sistemas`. */
  prosa: string;
  /** Ejemplares declarados. NO es una afirmación de orden entre ellos:
   *  ordenar exige medirlos, y con un solo ejemplar no hay nada que
   *  ordenar. */
  ejemplares: string[];
  /** Sólo si `sistemas.length > 1` y se acepta a sabiendas. Debe decir
   *  POR QUÉ los sistemas no se pueden separar, no que sea cómodo. */
  exencion?: string;
}

export const PELDANOS: Record<Lengua, Peldano[]> = {
  la: [
    { id: 'L1', sistemas: ['la flexión básica: cinco declinaciones y cuatro conjugaciones en indicativo, con el caso portando la función'],
      prosa: 'Las cinco declinaciones y las cuatro conjugaciones en indicativo; el caso como portador de la función',
      ejemplares: ['Vulgata', 'Fedro'] },
    { id: 'L2', sistemas: ['la subordinación de la prosa narrativa: subjuntivo, participios, ablativo absoluto, acusativo+infinitivo'],
      prosa: 'Subjuntivo, participios, ablativo absoluto, acusativo+infinitivo',
      ejemplares: ['César', 'Nepote', 'Eutropio'] },
    { id: 'L3', sistemas: ['el PERÍODO: cum histórico, oratio obliqua sostenida, correlaciones, gerundio/gerundivo, supino'],
      prosa: 'El período: cum histórico, oratio obliqua sostenida, correlaciones, gerundio/gerundivo, supino',
      ejemplares: ['Cicerón', 'Livio', 'Salustio'] },
    { id: 'L4', sistemas: ['el ORDEN POÉTICO: hipérbaton, léxico poético, hexámetro y dístico'],
      prosa: 'Orden poético: hipérbaton, léxico poético, hexámetro y dístico',
      ejemplares: ['Virgilio', 'Ovidio'] },
    // El que destapó todo. Se deja declarado CON el defecto a la vista
    // en vez de arreglarlo por lo bajo: es el caso que el gate debe cazar
    // y el que prueba que el gate ve.
    { id: 'L5', sistemas: ['brevitas y variatio (idiolecto de prosa comprimida)', 'metros líricos', 'morfología pre-clásica'],
      prosa: 'El idiolecto de autor y la lengua arcaica: brevitas y variatio; metros líricos; morfología pre-clásica',
      ejemplares: ['Tácito', 'Horacio', 'Plauto'] },
  ],
  grc: [
    { id: 'G1', sistemas: ['el aparato elemental: alfabeto politónico, artículo y sus posiciones, tres declinaciones, presente e imperfecto, participio'],
      prosa: 'Alfabeto politónico; el artículo y sus posiciones; tres declinaciones; presente e imperfecto; el participio como forma corriente',
      ejemplares: ['Esopo', 'Nuevo Testamento'] },
    // Segundo hallazgo de la auditoría, y de otra FORMA que L5: aquí no
    // hay dos núcleos coordinados antes de los dos puntos. Hay un núcleo
    // («el ASPECTO») y luego DOS sistemas más colgados detrás en frases
    // sueltas. La voz media y los verbos contractos no son parte del
    // aspecto: se aprenden aparte y no dependen de él.
    { id: 'G2', sistemas: ['el ASPECTO: temas de presente/aoristo/perfecto y su valor fuera del indicativo', 'la voz media', 'los verbos contractos'],
      prosa: 'El ASPECTO: los temas de presente / aoristo / perfecto, y qué significan fuera del indicativo. Voz media. Verbos contractos',
      ejemplares: ['Jenofonte'] },
    { id: 'G3', sistemas: ['el aparato ático: artículo+infinitivo, discurso indirecto en sus tres construcciones, optativo y sistema de ἄν, articulación con μέν/δέ'],
      prosa: 'El aparato ático completo: artículo + infinitivo, discurso indirecto en sus tres construcciones, optativo y sistema de ἄν, articulación con μέν/δέ',
      ejemplares: ['Platón', 'Lisias', 'Heródoto'] },
    // Tercer hallazgo, y de la MISMA forma que L5: dos núcleos
    // coordinados antes de los dos puntos. La prosa de Tucídides y el
    // trímetro trágico no se necesitan el uno al otro.
    { id: 'G4', sistemas: ['la prosa ática densa: hipérbaton en prosa y elipsis', 'el trímetro yámbico del diálogo dramático'],
      prosa: 'Prosa densa y diálogo dramático: hipérbaton en prosa, elipsis, trímetro yámbico',
      ejemplares: ['Tucídides', 'Demóstenes', 'Sófocles', 'Eurípides'] },
    { id: 'G5', sistemas: ['la mezcla épica', 'el dorio de la lírica coral', 'el registro cómico y la parodia'],
      prosa: 'Verso y dialecto: mezcla épica, dorio de la lírica coral, registro cómico y parodia',
      ejemplares: ['Homero', 'Píndaro', 'Aristófanes'] },
  ],
};

export interface Hallazgo {
  peldano: string;
  clase: 'varios-sistemas' | 'prosa-delata-mas' | 'exencion-sin-motivo';
  detalle: string;
}

/** SEGUNDO CAMINO, y sólo eso: una heurística sobre la PROSA, que no
 *  puede confirmar al primero porque no mira el mismo campo.
 *
 *  Busca la forma que L5 y G4 tienen y L1-L4 no: **dos o más núcleos
 *  coordinados ANTES de los dos puntos** («el idiolecto de autor Y la
 *  lengua arcaica:», «Verso Y dialecto:», «Prosa densa Y diálogo
 *  dramático:»), frente a un solo núcleo («El período:», «Orden
 *  poético:», «El aparato ático completo:»).
 *
 *  NO detecta la forma de G2 —sistemas colgados en frases sueltas
 *  DETRÁS del núcleo— y eso se dice en vez de fingir que el detector es
 *  completo: para esa forma manda el campo declarado. */
export function nucleosCoordinados(prosa: string): number {
  const i = prosa.indexOf(':');
  const cabeza = (i > 0 ? prosa.slice(0, i) : prosa).trim();
  if (!cabeza || cabeza.length > 90) return 1;
  return cabeza.split(/\s+y\s+/i).length;
}

export function revisarPeldanos(lengua: Lengua): Hallazgo[] {
  const out: Hallazgo[] = [];
  for (const p of PELDANOS[lengua]) {
    if (p.sistemas.length > 1 && !p.exencion) {
      out.push({ peldano: p.id, clase: 'varios-sistemas',
        detalle: `declara ${p.sistemas.length} sistemas y no tiene exención: ${p.sistemas.join(' · ')}` });
    }
    if (p.exencion !== undefined && p.exencion.trim().length < 20) {
      out.push({ peldano: p.id, clase: 'exencion-sin-motivo', detalle: 'la exención no dice por qué los sistemas no se pueden separar' });
    }
    const n = nucleosCoordinados(p.prosa);
    if (n > 1 && p.sistemas.length === 1) {
      out.push({ peldano: p.id, clase: 'prosa-delata-mas',
        detalle: `la prosa coordina ${n} núcleos antes de los dos puntos pero el campo declara 1 sistema` });
    }
  }
  return out;
}

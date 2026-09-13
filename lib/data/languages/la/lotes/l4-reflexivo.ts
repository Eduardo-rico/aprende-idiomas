// lib/data/languages/la/lotes/l4-reflexivo.ts
//
// `l4-reflexivo` — «se/suus frente a is/eius: el reflexivo que el español
// no marca».
//
//     NUEVE PARES MÍNIMOS, 18 ítems. Cada frase aparece DOS veces,
//     idéntica salvo la palabra que decide, y con la MISMA glosa española:
//
//       Poeta nautam videt et suos amicos laudat.   ¿de quién? del poeta
//       Poeta nautam videt et eius amicos laudat.   ¿de quién? del marinero
//       ——— «El poeta ve al marinero y alaba a sus amigos.» las dos veces
//
// ── POR QUÉ EL PAR Y NO DOCE ÍTEMS SUELTOS ───────────────────────────
//
// El relevo (§1.octies) dice que el par mínimo hace caer sola toda pista
// que sea propiedad del marco. Aquí eso no es una precaución: es el diseño
// entero. Son CINCO las estrategias medidas y las cinco leen el marco:
//
//     contestar siempre el sujeto (= siempre reflexivo)   9 / 18
//     contestar siempre el tercero                        9 / 18
//     contestar el nombre que sale primero                9 / 18
//     contestar el nombre más cercano a la marca          9 / 18
//     contestar lo que empuja el sentido común            5 / 10
//
// La quinta va sobre los diez ítems de los cinco pares que declaran
// empujón; las otras cuatro sobre los dieciocho. Salen así porque
// cualquier propiedad del marco es constante dentro del par mientras las
// respuestas del par son opuestas.
//
// De ahí la advertencia que va en el gate y que repito aquí: **ver esas
// tasas en 0,50 no dice nada bueno del material.** Es aritmética. Lo único
// que sostiene este lote es que los nueve pares estén COMPLETOS, y ésa es
// la comprobación que el gate pone en rojo.
//
// ── LA PISTA QUE EL PROPIO PAR MÍNIMO FABRICA ────────────────────────
//
// La trajo el pase adversarial y no la había visto nadie. El par es la
// defensa contra las pistas del marco, y al serlo pone el MISMO marco dos
// veces en el lote. Quien reconozca el reencuentro y conteste lo contrario
// de la primera vez acierta los nueve segundos ítems sin leer latín:
//
//     techo = 0,5·0,5 + 0,5·1 = **0,75**
//
// Y **no baja barajando**: barajar sólo cambia la DISTANCIA entre los dos
// miembros. Por eso no entra en el umbral de las tasas —sería un rojo
// imposible de apagar, o sea un gate que se acaba desactivando (§B9)— y sí
// entra como cifra declarada más un piso a la distancia dentro del par,
// que es lo único que se puede subir: con los dos miembros a distancia 2
// reconocer el marco no cuesta memoria ninguna; con 3, sí. La semilla de
// publicación se eligió contra esa condición además de las otras dos.
//
// Generaliza, y por eso va escrito: **toda defensa que repite un marco
// paga con una pista de reencuentro.**
//
// ── LA TASA ES DEL LOTE, NO DE LA LENGUA (§D4) ───────────────────────
//
// El 9/9 está para que ninguna ruta ciega gane, no porque el latín reparta
// así. Medido sobre el sello `atestacion-acento.json` (227.300 tokens),
// deduplicando por CADENA porque el corpus no escribe cantidad y `sua`/
// `suā` son el mismo token — sin deduplicar salen 1.351 y es el mismo
// token contado dos veces:
//
//     todas las formas de `suus`            1.163
//     menos `suī`, que es el reflexivo       ×64  ← homógrafo de otro lema
//     `suus` sin ese homógrafo              1.099   45,8 %
//     genitivo de `is` (929 + 342 + 30)     1.301   54,2 %
//
// O sea que el reparto real está cerca del mitad y mitad del lote, y el
// lote no enseña nada falso sobre la frecuencia. Pero la cifra que se lee
// del lote es del LOTE.
//
// ── LA MITAD QUE EL ESPAÑOL REGALA ───────────────────────────────────
//
// El punto nombra dos mitades y no se comportan igual para un
// hispanohablante:
//
//   · el POSESIVO — «sus» vale para las dos lecturas. El español no
//     entrega nada. Ocho pares, dieciséis ítems, y ahí se mide el punto.
//   · el PRONOMBRE — «se alaba» frente a «lo alaba». **El clítico español
//     ya decide**, así que la glosa del par no puede ser la misma y el
//     ítem no mide: enseña. Un par, dos ítems, declarados con su motivo y
//     fuera de la cobertura del eje.
//
// No es un descuido que se declara: es el punto §D3 del proyecto —medir
// qué parte regala la lengua de partida y construir el contraste en lo que
// no regala— aplicado a un punto que el material anglosajón presenta como
// una sola dificultad. Para un anglófono «his own» frente a «his» **no es**
// gratis en ninguna de las dos mitades; para el nuestro, media dificultad
// ya está resuelta por el clítico.
//
// ── EL POSEEDOR PLURAL, QUE ES UNA CELDA Y NO UN ADORNO ──────────────
//
// `eōrum` (×342) frente a `eius` (×929): el español dice «sus» también
// aquí, así que el par `Dominus servos videt et suos/eorum filios vocat`
// examina algo que ningún otro par examina. Va una vez —no la mitad del
// lote— porque con cero sería una celda invariante que el alumno no
// reconocería al leer, y con seis sería el punto de otro ejercicio.
//
// ── EL MACRÓN ────────────────────────────────────────────────────────
//
// Política del 2026-09-09: el marco va SIN cantidad —es como el corpus lo
// escribe, 0 macrones en 227.301 tokens— y `latinConCantidad` lleva la
// versión que se enseña al corregir. El gate comprueba las dos y que sean
// la misma frase.
import type { ItemReflexivo } from '../../../../../scripts/lib/gate-reflexivo';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Caso, Numero } from '../paradigma-la';

/** Encontrada contra TRES condiciones: el detector de posición, la
 *  adyacencia de los pares y el piso de distancia. La tercera la trajo el
 *  pase adversarial: la regla «lo contrario de la vez anterior» tiene
 *  techo 0,75 y no se apaga barajando — lo único que sube es lo que cuesta
 *  reconocer el marco, y con los dos miembros a distancia 2 no cuesta
 *  nada. Con esta semilla la distancia mínima es 3. */
export const SEMILLA_DE_ORDEN = 43;

type Participante = { lema: string; forma: string; caso: Caso; numero: Numero; es: string; enGlosa: string };

type Par = {
  id: string;
  /** Las dos frases, sin cantidad y con ella. `{{}}` es donde va la marca. */
  marco: string;
  marcoConCantidad: string;
  marcaRefl: string; marcaReflConCantidad: string;
  marcaOtra: string; marcaOtraConCantidad: string;
  poseido?: { lema: string; caso: Caso; numero: Numero };
  poseedorSujeto?: { lema: string; numero: Numero };
  poseedorTercero?: { lema: string; numero: Numero };
  casoDelPronombre?: Caso;
  glosa: string;
  /** Sólo el par de pronombre: el español obliga a dos glosas distintas. */
  glosaOtra?: string;
  pregunta: string;
  sujeto: Participante;
  otro: Participante;
  esperado: 'reflexivo' | 'otro' | 'neutro';
  regalo?: string;
};

const EL_CLITICO = 'el clítico español ya decide el ítem: «se alaba» frente a «lo alaba». La glosa del par NO puede ser la misma, y por eso estos dos ítems enseñan `sē` pero no cuentan como cobertura del eje';

const PARES: Par[] = [
  // ── LOS OCHO DE POSESIVO, donde «sus» no entrega nada ──
  { id: 'p1',
    marco: 'Poeta nautam videt et {{}} amicos laudat.',
    marcoConCantidad: 'Poēta nautam videt et {{}} amīcōs laudat.',
    marcaRefl: 'suos', marcaReflConCantidad: 'suōs',
    marcaOtra: 'eius', marcaOtraConCantidad: 'eius',
    poseido: { lema: 'amīcus', caso: 'ac', numero: 'pl' },
    poseedorSujeto: { lema: 'poēta', numero: 'sg' },
    poseedorTercero: { lema: 'nauta', numero: 'sg' },
    glosa: 'El poeta ve al marinero y alaba a sus amigos.',
    pregunta: '¿De quién son los amigos?',
    sujeto: { lema: 'poēta', forma: 'Poeta', caso: 'nom', numero: 'sg', es: 'del poeta', enGlosa: 'El poeta' },
    otro: { lema: 'nauta', forma: 'nautam', caso: 'ac', numero: 'sg', es: 'del marinero', enGlosa: 'al marinero' },
    esperado: 'neutro' },

  // EL OBJETO DELANTE. Sin estos dos pares, «el nombre que sale primero»
  // y «el sujeto» serían la misma regla y una de las dos mediciones
  // sobraría sin que nadie lo notara (§D5).
  { id: 'p2',
    marco: 'Reginam domina salutat et {{}} filiam vocat.',
    marcoConCantidad: 'Rēgīnam domina salūtat et {{}} fīliam vocat.',
    marcaRefl: 'suam', marcaReflConCantidad: 'suam',
    marcaOtra: 'eius', marcaOtraConCantidad: 'eius',
    poseido: { lema: 'fīlia', caso: 'ac', numero: 'sg' },
    poseedorSujeto: { lema: 'domina', numero: 'sg' },
    poseedorTercero: { lema: 'rēgīna', numero: 'sg' },
    glosa: 'La señora saluda a la reina y llama a su hija.',
    pregunta: '¿De quién es la hija?',
    sujeto: { lema: 'domina', forma: 'domina', caso: 'nom', numero: 'sg', es: 'de la señora', enGlosa: 'La señora' },
    otro: { lema: 'rēgīna', forma: 'Reginam', caso: 'ac', numero: 'sg', es: 'de la reina', enGlosa: 'a la reina' },
    esperado: 'neutro' },

  { id: 'p3',
    marco: 'Rex populum videt et {{}} templa laudat.',
    marcoConCantidad: 'Rēx populum videt et {{}} templa laudat.',
    marcaRefl: 'sua', marcaReflConCantidad: 'sua',
    marcaOtra: 'eius', marcaOtraConCantidad: 'eius',
    poseido: { lema: 'templum', caso: 'ac', numero: 'pl' },
    poseedorSujeto: { lema: 'rēx', numero: 'sg' },
    poseedorTercero: { lema: 'populus', numero: 'sg' },
    glosa: 'El rey ve al pueblo y alaba sus templos.',
    pregunta: '¿De quién son los templos?',
    sujeto: { lema: 'rēx', forma: 'Rex', caso: 'nom', numero: 'sg', es: 'del rey', enGlosa: 'El rey' },
    otro: { lema: 'populus', forma: 'populum', caso: 'ac', numero: 'sg', es: 'del pueblo', enGlosa: 'al pueblo' },
    // Un rey alabando SUS templos es la lectura que el sentido común
    // propone. Declarado antes de medir, y sirve para que la estrategia
    // pragmática tenga denominador.
    esperado: 'reflexivo' },

  { id: 'p4',
    marco: 'Dominus servos videt et {{}} filios vocat.',
    marcoConCantidad: 'Dominus servōs videt et {{}} fīliōs vocat.',
    marcaRefl: 'suos', marcaReflConCantidad: 'suōs',
    marcaOtra: 'eorum', marcaOtraConCantidad: 'eōrum',
    poseido: { lema: 'fīlius', caso: 'ac', numero: 'pl' },
    poseedorSujeto: { lema: 'dominus', numero: 'sg' },
    poseedorTercero: { lema: 'servus', numero: 'pl' },
    glosa: 'El señor ve a los esclavos y llama a sus hijos.',
    pregunta: '¿De quién son los hijos?',
    sujeto: { lema: 'dominus', forma: 'Dominus', caso: 'nom', numero: 'sg', es: 'del señor', enGlosa: 'El señor' },
    otro: { lema: 'servus', forma: 'servos', caso: 'ac', numero: 'pl', es: 'de los esclavos', enGlosa: 'a los esclavos' },
    esperado: 'neutro' },

  { id: 'p5',
    marco: 'Filium pater vocat et {{}} filiam exspectat.',
    marcoConCantidad: 'Fīlium pater vocat et {{}} fīliam exspectat.',
    marcaRefl: 'suam', marcaReflConCantidad: 'suam',
    marcaOtra: 'eius', marcaOtraConCantidad: 'eius',
    poseido: { lema: 'fīlia', caso: 'ac', numero: 'sg' },
    poseedorSujeto: { lema: 'pater', numero: 'sg' },
    poseedorTercero: { lema: 'fīlius', numero: 'sg' },
    glosa: 'El padre llama al hijo y espera a su hija.',
    pregunta: '¿De quién es la hija?',
    sujeto: { lema: 'pater', forma: 'pater', caso: 'nom', numero: 'sg', es: 'del padre', enGlosa: 'El padre' },
    otro: { lema: 'fīlius', forma: 'Filium', caso: 'ac', numero: 'sg', es: 'del hijo', enGlosa: 'al hijo' },
    // El padre esperando a SU hija es la lectura que propone el sentido
    // común; la del hijo pide un paso más.
    esperado: 'reflexivo' },

  // EL DATIVO. Sin él las seis celdas de `suus` serían todas de acusativo
  // y el lote enseñaría que el reflexivo tiene una sola forma por género.
  { id: 'p6',
    marco: 'Frater agricolam videt et {{}} filiae donum mittit.',
    marcoConCantidad: 'Frāter agricolam videt et {{}} fīliae dōnum mittit.',
    marcaRefl: 'suae', marcaReflConCantidad: 'suae',
    marcaOtra: 'eius', marcaOtraConCantidad: 'eius',
    poseido: { lema: 'fīlia', caso: 'dat', numero: 'sg' },
    poseedorSujeto: { lema: 'frāter', numero: 'sg' },
    poseedorTercero: { lema: 'agricola', numero: 'sg' },
    glosa: 'El hermano ve al agricultor y envía un regalo a su hija.',
    pregunta: '¿De quién es la hija?',
    sujeto: { lema: 'frāter', forma: 'Frater', caso: 'nom', numero: 'sg', es: 'del hermano', enGlosa: 'El hermano' },
    otro: { lema: 'agricola', forma: 'agricolam', caso: 'ac', numero: 'sg', es: 'del agricultor', enGlosa: 'al agricultor' },
    esperado: 'otro' },

  // EL ABLATIVO, que sólo entra con preposición: sin este par las celdas
  // de `suus` serían todas de acusativo más un dativo, y el lote enseñaría
  // que el reflexivo tiene una forma por género y poco más.
  { id: 'p7',
    marco: 'Medicus regem videt et cum {{}} filia ambulat.',
    marcoConCantidad: 'Medicus rēgem videt et cum {{}} fīliā ambulat.',
    marcaRefl: 'sua', marcaReflConCantidad: 'suā',
    marcaOtra: 'eius', marcaOtraConCantidad: 'eius',
    poseido: { lema: 'fīlia', caso: 'abl', numero: 'sg' },
    poseedorSujeto: { lema: 'medicus', numero: 'sg' },
    poseedorTercero: { lema: 'rēx', numero: 'sg' },
    glosa: 'El médico ve al rey y pasea con su hija.',
    pregunta: '¿De quién es la hija?',
    sujeto: { lema: 'medicus', forma: 'Medicus', caso: 'nom', numero: 'sg', es: 'del médico', enGlosa: 'El médico' },
    otro: { lema: 'rēx', forma: 'regem', caso: 'ac', numero: 'sg', es: 'del rey', enGlosa: 'al rey' },
    esperado: 'reflexivo' },

  // EL DATIVO PLURAL. `suīs` no se parece a ninguna de las otras cinco
  // formas del lote, y es la celda donde el alumno que ha memorizado
  // «suus/sua/suum» se queda sin tabla.
  { id: 'p8',
    marco: 'Vicinus magistrum videt et {{}} filiis dona mittit.',
    marcoConCantidad: 'Vīcīnus magistrum videt et {{}} fīliīs dōna mittit.',
    marcaRefl: 'suis', marcaReflConCantidad: 'suīs',
    marcaOtra: 'eius', marcaOtraConCantidad: 'eius',
    poseido: { lema: 'fīlius', caso: 'dat', numero: 'pl' },
    poseedorSujeto: { lema: 'vīcīnus', numero: 'sg' },
    poseedorTercero: { lema: 'magister', numero: 'sg' },
    glosa: 'El vecino ve al maestro y envía regalos a sus hijos.',
    pregunta: '¿De quién son los hijos?',
    sujeto: { lema: 'vīcīnus', forma: 'Vicinus', caso: 'nom', numero: 'sg', es: 'del vecino', enGlosa: 'El vecino' },
    otro: { lema: 'magister', forma: 'magistrum', caso: 'ac', numero: 'sg', es: 'del maestro', enGlosa: 'al maestro' },
    esperado: 'otro' },

  // ── EL PAR DE PRONOMBRE, que el español decide ──
  { id: 'p9',
    marco: 'Rex fratrem videt et {{}} laudat.',
    marcoConCantidad: 'Rēx frātrem videt et {{}} laudat.',
    marcaRefl: 'se', marcaReflConCantidad: 'sē',
    marcaOtra: 'eum', marcaOtraConCantidad: 'eum',
    casoDelPronombre: 'ac',
    glosa: 'El rey ve al hermano y se alaba.',
    glosaOtra: 'El rey ve al hermano y lo alaba.',
    pregunta: '¿A quién alaba el rey?',
    sujeto: { lema: 'rēx', forma: 'Rex', caso: 'nom', numero: 'sg', es: 'a sí mismo', enGlosa: 'El rey' },
    otro: { lema: 'frāter', forma: 'fratrem', caso: 'ac', numero: 'sg', es: 'al hermano', enGlosa: 'al hermano' },
    esperado: 'neutro', regalo: EL_CLITICO },
];

function itemsDe(p: Par): ItemReflexivo[] {
  const comun = {
    punto: 'l4-reflexivo', pareja: p.id, pregunta: p.pregunta,
    sujeto: p.sujeto, otro: p.otro, esperado: p.esperado,
    elemento: (p.casoDelPronombre ? 'pronombre' : 'posesivo') as 'pronombre' | 'posesivo',
    ...(p.casoDelPronombre ? { casoDelPronombre: p.casoDelPronombre } : {}),
    ...(p.poseido ? { poseido: p.poseido } : {}),
    ...(p.regalo ? { elEspanolLoRegala: p.regalo } : {}),
  };
  return [
    { ...comun, id: `${p.id}-a`, reflexivo: true,
      latin: p.marco.replace('{{}}', p.marcaRefl),
      latinConCantidad: p.marcoConCantidad.replace('{{}}', p.marcaReflConCantidad),
      marca: p.marcaRefl,
      ...(p.poseedorSujeto ? { poseedor: p.poseedorSujeto } : {}),
      glosa: p.glosa, respuesta: p.sujeto.es, distractor: p.otro.es },
    { ...comun, id: `${p.id}-b`, reflexivo: false,
      latin: p.marco.replace('{{}}', p.marcaOtra),
      latinConCantidad: p.marcoConCantidad.replace('{{}}', p.marcaOtraConCantidad),
      marca: p.marcaOtra,
      ...(p.poseedorTercero ? { poseedor: p.poseedorTercero } : {}),
      glosa: p.glosaOtra ?? p.glosa, respuesta: p.otro.es, distractor: p.sujeto.es },
  ];
}

const FUENTE: ItemReflexivo[] = PARES.flatMap(itemsDe);

// EL `id` NO PUEDE CANTAR EL LADO. Escritos `p1-a`/`p1-b`, el sufijo
// coincidía con el eje en 18 de 18: hoy es una mina y no una fuga —nada
// fuera del test consume este lote— pero un `id` que se correlaciona
// perfectamente con la respuesta es exactamente lo que un día se sirve al
// alumno. Se numeran por el ORDEN PUBLICADO, que ya está vigilado.
export const LOTE_REFLEXIVO: ItemReflexivo[] = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN)
  .map((i, k) => ({ ...i, id: `la-rx-${String(k + 1).padStart(2, '0')}` }));

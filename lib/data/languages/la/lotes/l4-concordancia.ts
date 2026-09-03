// lib/data/languages/la/lotes/l4-concordancia.ts
//
// PRIMER LOTE DE CONCORDANCIA. Punto: `l4-concordancia`.
//
// El punto es «el adjetivo concuerda en género, número y caso, NO en
// declinación», y su `varia` ya dice la composición: «si las terminaciones
// coinciden (`bonus dominus`) o no (`bonus nauta`), y hay que traer las
// dos: **sólo la segunda mide algo**».
//
// Dos ejes INDEPENDIENTES, y por eso los dos necesitan vigilancia:
//
//   · **RIMAR** es una estrategia completa —produce una forma entera sin
//     saber nada— y acierta en la mayoría del latín. Eje binario, así que
//     le vale la aritmética de los dos formatos anteriores: mitad y mitad.
//     Aquí sale 5 que riman contra 7 que no.
//   · **EL GÉNERO DE LA GLOSA ESPAÑOLA** no da caso ni número, así que no
//     se le mide tasa: se exige que el lote traiga ítems donde ENGAÑE. Y
//     sólo pueden traerlos los NEUTROS, porque el español no tiene neutro:
//     `bellum` es «la guerra», `dōnum` «el regalo», `verbum` «la palabra»,
//     y ninguno de los tres géneros españoles es el correcto.
//
// El neutro plural en `-a` es el caso más caro de los dos ejes a la vez:
// `pulchra dōna` rima (así que ese eje no lo examina) y además parece un
// femenino singular español. El alumno lee «una cosa hermosa».
//
// LO QUE ESTE LOTE NO CUBRE, dicho en vez de disimulado: los ejemplos
// canónicos del descriptor —`magnum opus`, `omnis homō`, `rēs pūblica`—
// son de 3.ª y 5.ª declinación, y la máquina sólo tiene 1.ª y 2.ª. Los
// casos de declinación distinta se traen aquí con la 1.ª MASCULINA
// (`nauta`, `agricola`, `poēta`) y los `-er`, que examinan lo mismo con
// las declinaciones disponibles. Ampliar la máquina a la 3.ª es el
// siguiente paso de fondo, no una nota al pie.
import type { ItemConcordancia } from '../../../../../scripts/lib/gate-concordancia';
import { NOMBRES_L1, ADJETIVOS_L1 } from '../lexicon-l1';
import { concuerda } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
const A = (l: string) => ADJETIVOS_L1.find((x) => x.lema === l)!;

type Def = [id: string, nom: string, adj: string, celda: ItemConcordancia['celda'],
            generoEs: 'm' | 'f', marco: string, pista: string];

const DEFS: Def[] = [
  // ── SIETE QUE NO RIMAN: la 1.ª masculina y los -er ──
  ['la-4c-01', 'nauta', 'bonus', 'nom.sg', 'm', '___ nauta puellam vocat.',
   'EL BUEN marinero llama a la niña. «nauta» acaba en -a y es masculino.'],
  ['la-4c-02', 'agricola', 'magnus', 'ac.sg', 'm', 'Puella ___ agricolam videt.',
   'La niña ve AL GRAN campesino — objeto directo, masculino singular.'],
  ['la-4c-03', 'poēta', 'bonus', 'dat.sg', 'm', 'Dominus ___ poētae dōnum mittit.',
   'El señor envía un regalo AL BUEN poeta — destinatario, masculino singular.'],
  ['la-4c-04', 'puer', 'bonus', 'nom.sg', 'm', '___ puer magistrum audit.',
   'EL BUEN niño oye al maestro. «puer» no lleva desinencia: no hay nada que copiar.'],
  ['la-4c-05', 'magister', 'magnus', 'nom.sg', 'm', '___ magister discipulōs monet.',
   'EL GRAN maestro advierte a los discípulos — sujeto, masculino singular.'],
  ['la-4c-06', 'nauta', 'bonus', 'nom.pl', 'm', '___ nautae terram inveniunt.',
   'LOS BUENOS marineros encuentran la tierra — sujeto, masculino plural.'],
  ['la-4c-07', 'agricola', 'magnus', 'ac.pl', 'm', 'Puellae ___ agricolās salūtant.',
   'Las niñas saludan A LOS GRANDES campesinos — objeto directo, masculino plural.'],

  // ── CINCO QUE RIMAN, y los cinco con el género español engañando ──
  ['la-4c-08', 'bellum', 'magnus', 'ac.sg', 'f', 'Poēta ___ bellum laudat.',
   'El poeta alaba LA GRAN guerra. En español «guerra» es femenino; en latín «bellum» es NEUTRO.'],
  ['la-4c-09', 'bellum', 'magnus', 'ac.pl', 'f', 'Poētae ___ bella laudant.',
   'Los poetas alaban LAS GRANDES guerras. «bella» es neutro plural, no femenino singular.'],
  ['la-4c-10', 'dōnum', 'bonus', 'ac.sg', 'm', 'Puer ___ dōnum exspectat.',
   'El niño espera EL BUEN regalo. En español «regalo» es masculino; «dōnum» es neutro.'],
  ['la-4c-11', 'verbum', 'bonus', 'ac.pl', 'f', 'Discipulī ___ verba audiunt.',
   'Los discípulos oyen LAS BUENAS palabras. «verba» es neutro plural.'],
  ['la-4c-12', 'dōnum', 'pulcher', 'ac.pl', 'm', 'Puellae ___ dōna inveniunt.',
   'Las niñas encuentran LOS HERMOSOS regalos. El adjetivo acaba en -a y es neutro plural.'],

  // ── LOS DOS QUE ROMPEN LA COLINEALIDAD ──
  //
  // Sin ellos los cinco ítems que rimaban eran exactamente los cinco con
  // trampa de género: dos nombres para un solo eje, y la cobertura
  // declarada inflada al doble. Lo cazó el gate contra este mismo lote.
  //
  // `magnum opus` es el ejemplo canónico del descriptor, y ahora se ve por
  // qué lo es: el sustantivo acaba en `-us` y el adjetivo en `-um`, así
  // que NO rima, y «obra» es femenino en español mientras `opus` es
  // neutro, así que el género SÍ engaña. Es la única combinación que
  // separa los dos ejes, y sólo la dan los neutros de 3.ª.
  ['la-4c-13', 'opus', 'magnus', 'ac.sg', 'f', 'Discipulus ___ opus legit.',
   'El discípulo lee LA GRAN obra. «opus» acaba en -us y es NEUTRO: ni la terminación ni el género español ayudan.'],
  // Y su contrario: rima y el género español acierta. Sin este, «rima» y
  // «no engaña» tampoco aparecerían juntos.
  ['la-4c-14', 'dominus', 'bonus', 'nom.sg', 'm', '___ dominus servōs vocat.',
   'EL BUEN señor llama a los esclavos — el caso fácil, donde todo coincide.'],
];

export const LOTE_CONCORDANCIA: ItemConcordancia[] = DEFS.map(
  ([id, nom, adj, celda, generoEs, marco, pista]) => {
    const s = N(nom), a = A(adj);
    const [c, num] = celda.split('.') as ['nom', 'sg'];
    return {
      id, punto: 'l4-concordancia', sustantivo: s, adjetivo: a, celda,
      respuesta: concuerda(a, s, c, num), generoEs, marco, pista,
      ejes: { rima: false, generoEnganya: generoEs !== s.genero, celda },
    };
  });

// La etiqueta `rima` se DERIVA de los datos en vez de escribirse a mano:
// es exactamente la clase de campo que se desincroniza, y el gate la
// comprueba igual por si alguien la toca.
import { rimaDeVerdad } from '../../../../../scripts/lib/gate-concordancia';
for (const it of LOTE_CONCORDANCIA) it.ejes.rima = rimaDeVerdad(it);

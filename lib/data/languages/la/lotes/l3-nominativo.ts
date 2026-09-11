// lib/data/languages/la/lotes/l3-nominativo.ts
//
// PRIMER LOTE DEL NOMINATIVO. Punto: `l3-nominativo`.
//
// «El sujeto y, con `sum` y verbos copulativos, también el atributo:
// "Caesar imperātor est" lleva los dos en nominativo.» `varia`: **si hay uno
// o dos nominativos, y con dos, cuál es el sujeto**.
//
// ── SEXTA VEZ EL SUELO, Y EL MÁS ALTO DE TODOS ───────────────────────
//
// Con dos nominativos **ninguna desinencia dice cuál es el sujeto**: los dos
// llevan la misma marca. Sólo queda el orden o el sentido. Medido sobre las
// 1.208 frases copulativas del corpus donde sujeto y atributo son ambos
// nominales:
//
//     sujeto DELANTE    974    80,6 %
//     sujeto DETRÁS     234    19,4 %
//
// O sea que «el primero es el sujeto» acierta cuatro de cada cinco leyendo
// de verdad. Este lote equilibra el orden y lo baja al 50 %, **y ese 50 % es
// propiedad del lote**: quien lea la tasa ciega y crea que ha medido al
// alumno leyendo la Vulgata se equivoca por treinta puntos.
//
// Es el piso más alto que hemos encontrado —más que el 76 % del genitivo y
// que el 82 % de la tercera persona en pro-drop— y el que peor se ve, porque
// no hay ninguna forma que delate el problema: las dos palabras están bien
// declinadas y el ítem parece completo.
//
// ── QUÉ RESUELVE CUANDO EL ORDEN NO ──────────────────────────────────
//
// La definitud. En «Caesar imperātor est» el sujeto es el nombre propio y el
// atributo el común; invertirlo daría «un general llamado César», que no es
// lo que la frase dice. Los seis ítems de dos nominativos se apoyan en eso y
// van declarados: tres con el sujeto delante y tres detrás.
//
// ── LA EXCEPCIÓN QUE EL PUNTO YA DECLARA ─────────────────────────────
//
// Dentro de un acusativo con infinitivo el atributo va en ACUSATIVO —«dīcit
// Caesarem imperātōrem esse»—, que es justo donde el alumno espera un
// nominativo. Ese caso NO entra en este lote: pertenece al punto del
// acusativo con infinitivo y meterlo aquí sería cobrarlo dos veces. Queda
// dicho para que no parezca un olvido.
import type { ItemFuncionCaso } from '../../../../../scripts/lib/gate-funcion-caso';
import { colisionesDentro, conAlternativaDeDeterminante } from '../../../../../scripts/lib/gate-funcion-caso';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, num: 'sg' | 'pl', cuantos: 1 | 2,
            marco: string, glosa: string, respuesta: string, sujetoDelante?: boolean];

const DEFS: Def[] = [
  // ── SEIS CON UN SOLO NOMINATIVO · la desinencia decide sola ──
  ['la-3n-01', 'rēgīna', 'sg', 1, 'Regina rosam portat.', '___ lleva una rosa.', 'La reina'],
  ['la-3n-02', 'servus', 'sg', 1, 'Servus agrum custodit.', '___ guarda el campo.', 'El esclavo'],
  ['la-3n-03', 'discipulus', 'pl', 1, 'Discipuli verba audiunt.', '___ oyen las palabras.', 'Los discípulos'],
  ['la-3n-04', 'rēx', 'sg', 1, 'Templum rex custodit.', '___ guarda el templo.', 'El rey'],
  ['la-3n-05', 'puella', 'pl', 1, 'Rosas puellae portant.', '___ llevan las rosas.', 'Las niñas'],
  ['la-3n-06', 'poēta', 'sg', 1, 'Verba poeta legit.', '___ lee las palabras.', 'El poeta'],

  // ── SEIS CON DOS NOMINATIVOS · aquí no decide ninguna desinencia ──
  //
  // Tres con el sujeto delante y tres detrás, para que «el primero es el
  // sujeto» quede en el 50 % y no en el 80,6 % que da el texto real.
  ['la-3n-07', 'rēx', 'sg', 2, 'Rex dominus est.', '___ es el señor.', 'El rey', true],
  ['la-3n-08', 'rēgīna', 'sg', 2, 'Regina domina est.', '___ es la señora.', 'La reina', true],
  ['la-3n-09', 'poēta', 'sg', 2, 'Poeta magister est.', '___ es el maestro.', 'El poeta', true],
  ['la-3n-10', 'medicus', 'sg', 2, 'Amicus medicus est.', 'El amigo es ___.', 'el médico', false],
  ['la-3n-11', 'nauta', 'sg', 2, 'Vicinus nauta est.', 'El vecino es ___.', 'el marinero', false],
  ['la-3n-12', 'domina', 'sg', 2, 'Filia domina est.', 'La hija es ___.', 'la señora', false],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemFuncionCaso[] = DEFS.map(
  ([id, lema, numero, cuantos, marco, glosa, respuesta, sujetoDelante]) => {
    const entrada = N(lema);
    return {
      id, punto: 'l3-nominativo', entrada, funcion: 'sujeto' as const, numero,
      marco, glosa, respuesta,
      forma: declinar(entrada, 'nom', numero),
      ejes: {
        colisiones: colisionesDentro(entrada, 'nom', numero).length,
        cuantosNominativos: cuantos,
        ...(sujetoDelante !== undefined ? { sujetoDelante } : {}),
      },
    };
  });


// ── LA ALTERNATIVA DEL DETERMINANTE, añadida el 2026-09-11 ───────────
//
// El latín NO TIENE ARTÍCULO, así que «rosam» es «la rosa», «una rosa» o
// «rosa», y publicar una clave única suspende a quien escribe la otra.
// Lo encontró el latinista adversarial el 2026-09-10 y por eso este lote
// quedó APLAZADO. `conAlternativaDeDeterminante` cierra la familia
// mecánica —definido ↔ indefinido— y el gate lo exige por ítem.
//
// ⚠ NO DESAPLAZA EL LOTE. Quedan las dos familias que hay que escribir a
// mano: el posesivo («a la madre» / «a su madre») y, en otros lotes, el
// género que el verbo latino no marca.
export const LOTE_NOMINATIVO = ordenPublicado(FUENTE.map(conAlternativaDeDeterminante), SEMILLA_DE_ORDEN);

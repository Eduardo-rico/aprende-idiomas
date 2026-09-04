// lib/data/languages/la/lotes/l3-ablativo.ts
//
// EL LOTE DEL ABLATIVO. Punto: `l3-ablativo-abanico`, 14 ítems.
//
// «El segundo punto más caro del curso después de la función por
// desinencia», dice el inventario. Una sola forma para siete relaciones.
//
// ── CATORCE, Y EL NÚMERO SALE DE UNA CUENTA ──────────────────────────
//
// El piso del peldaño son ocho, pero ocho no llegan: con siete funciones,
// cada una saldría UNA vez y toda propiedad de ese ítem quedaría
// confundida con su función — el punto no sería examinable por
// construcción, por muchos gates que se le pongan encima. El mínimo al que
// significa algo es **2k = 14**.
//
// Y conviene no confundirlo con lo que sí está prohibido: **inflar para
// comprar una p** es añadir relleno hasta salir de la zona ciega del test;
// **dimensionar al eje** es calcular cuántos ítems hacen falta para que el
// contraste exista. Lo primero manipula el instrumento, lo segundo
// construye el examen.
//
// ── LAS DOS MITADES ──────────────────────────────────────────────────
//
// Instrumento, compañía y modo se traducen las tres por «con»: el alumno
// las acierta por TRANSFERENCIA, sin saber latín. No sobran — están para
// impedir el error simétrico, «nunca con», que aplicaría a tres de las
// siete. Son la mitad que enseña la FRONTERA.
//
// Las otras cuatro son el contenido, con respuestas uniformes y dos ítems
// cada una, y ahí el techo es 1/4.
import type { ItemAblativo, FuncionAbl } from '../../../../../scripts/lib/gate-ablativo';
import { PREPOSICION } from '../../../../../scripts/lib/gate-ablativo';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, funcion: FuncionAbl, latin: string, glosa: string];

const DEFS: Def[] = [
  // ── LA FRONTERA: las tres que el español agrupa bajo «con» ──
  ['la-3ab-01', 'instrumento', 'Magister verbō discipulōs monet.', 'El maestro advierte a los discípulos ___ la palabra.'],
  ['la-3ab-02', 'instrumento', 'Servus gladiō agrōs custōdit.', 'El esclavo guarda los campos ___ la espada.'],
  ['la-3ab-03', 'compañía', 'Nauta cum amīcō terram videt.', 'El marinero ve la tierra ___ el amigo.'],
  ['la-3ab-04', 'compañía', 'Puella cum amīcā rosās videt.', 'La niña ve las rosas ___ la amiga.'],
  ['la-3ab-05', 'modo', 'Discipulus cum cūrā verba legit.', 'El discípulo lee las palabras ___ cuidado.'],
  ['la-3ab-06', 'modo', 'Dominus cum īrā servōs vocat.', 'El señor llama a los esclavos ___ ira.'],

  // ── EL CONTENIDO: cuatro funciones, respuestas uniformes, dos cada una ──
  ['la-3ab-07', 'causa', 'Puer timōre magistrum audit.', 'El niño oye al maestro ___ miedo.'],
  ['la-3ab-08', 'causa', 'Colōnus gaudiō agrōs custōdit.', 'El colono guarda los campos ___ alegría.'],
  ['la-3ab-09', 'tiempo', 'Nautae prīmō annō terram inveniunt.', 'Los marineros encuentran la tierra ___ el primer año.'],
  ['la-3ab-10', 'tiempo', 'Colōnī bonō tempore agrōs custōdiunt.', 'Los colonos guardan los campos ___ el buen momento.'],
  ['la-3ab-11', 'lugar-de-donde', 'Magister ex templō discipulōs vocat.', 'El maestro llama a los discípulos ___ el templo.'],
  ['la-3ab-12', 'lugar-de-donde', 'Puerī ex agrō rosās portant.', 'Los niños traen las rosas ___ el campo.'],
  ['la-3ab-13', 'comparación', 'Dominus fortior servō est.', 'El señor es más fuerte ___ el esclavo.'],
  ['la-3ab-14', 'comparación', 'Fīlius sanctior magistrō est.', 'El hijo es más santo ___ el maestro.'],
];

const FUENTE: ItemAblativo[] = DEFS.map(([id, funcion, latin, glosa]) => ({
  id, punto: 'l3-ablativo-abanico', latin, glosa,
  // La respuesta se DERIVA de la función: escribirla a mano sería una
  // etiqueta encima de un dato, y se desincroniza.
  respuesta: PREPOSICION[funcion],
  ejes: { funcion },
}));

export const LOTE_ABLATIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// lib/data/languages/ru/lexicon-a1.ts — el vocabulario que la máquina de
// `paradigma-ru.ts` declina y conjuga.
//
// ══ EL CRITERIO DE ENTRADA, Y NO ES «LAS PALABRAS ÚTILES» ═════════════
//
// Una entrada está aquí por una de dos razones, y la segunda importa más:
//
//   1. es FRECUENTE en la biblioteca (7,7 M de palabras de prosa del XIX),
//      medido con `scripts/corpus-ru.ts`, y su cuenta va escrita;
//   2. es el ÚNICO lema que separa dos reglas que en todo lo demás
//      coinciden. `конь` frente a `дверь`: la misma letra final, dos
//      declinaciones. `карта` frente a `сестра`: el mismo genitivo plural
//      cero, y una mete vocal de apoyo y la otra no. Sin esos pares el
//      gate sale verde sobre una regla a la que le falta una mitad.
//
// Las cuentas son de `buscar()` —con límite de palabra unicode a los dos
// lados— y son la CIFRA QUE EL GATE CORRE, no otra sacada de un `grep`
// distinto. Que la cifra citada y la que corre el gate salgan del mismo
// instrumento es la regla del §4.38 rumano, que ya se pagó una vez.
import type { EntradaNominal, EntradaVerbal } from './paradigma-ru';

export const NOMBRES_A1: EntradaNominal[] = [
  // ── 1.ª DECLINACIÓN, TEMA DURO ────────────────────────────────────
  // `книга` es la entrada que demuestra el orden correcto de las dos
  // reglas: el tema es DURO y la desinencia de nominativo plural es `-ы`;
  // sólo DESPUÉS la regla velar la escribe `и`. Y es el control positivo
  // del gate: si la máquina llegara a producir `*книгы`, `revisarOrtografiaRu`
  // lo caza como `velar-y`.
  { lema: 'книга', genero: 'f', tema: 'duro', glosa: 'libro' },            // 388
  { lema: 'вода', genero: 'f', tema: 'duro', glosa: 'agua' },              // 561
  { lema: 'голова', genero: 'f', tema: 'duro', glosa: 'cabeza' },          // 1439
  { lema: 'школа', genero: 'f', tema: 'duro', glosa: 'escuela' },          // 59
  { lema: 'страна', genero: 'f', tema: 'duro', glosa: 'país' },            // 36
  // ⚠ EL PAR QUE DECIDE EL GENITIVO PLURAL, y es la razón de que `карта`
  // esté aquí con 21 apariciones: `карт` (91) NO mete vocal de apoyo y
  // `сестёр` (79) SÍ. Las dos son 1.ª declinación dura con desinencia
  // cero, y ninguna regla las separa — el reparto es LÉXICO. `карт` es el
  // ítem de sobreaplicación de `u5-genitivo-plural`: quien aprenda «la
  // desinencia cero hace aparecer una vocal» escribe `*карот`.
  { lema: 'карта', genero: 'f', tema: 'duro', glosa: 'mapa, carta',
    nota: 'está por el genitivo plural SIN vocal de apoyo (карт 91), que es la frontera de la regla de сестёр' },
  { lema: 'сестра', genero: 'f', tema: 'duro', glosa: 'hermana',
    nomPlIrreg: 'сёстры', genPlIrreg: 'сестёр',
    nota: 'vocal de apoyo CON ё (сестёр 79) y nominativo plural con el acento movido (сёстры)' },
  // Masculino con forma femenina: la clase que `u3-genero-por-terminacion`
  // declara como su único contenido, porque leer la terminación es gratis.
  { lema: 'папа', genero: 'm', tema: 'duro', glosa: 'papá', animado: true },   // 557
  { lema: 'дядя', genero: 'm', tema: 'blando', glosa: 'tío', animado: true, genPlIrreg: 'дядей', // 1199
    nota: 'el genitivo plural de la 1.ª blanda no tiene una sola forma: недель y деревень toman -ь (con vocal de apoyo) y дядей toma -ей (83). No hay regla que los separe desde el lema, así que la máquina pone la mayoritaria y el reparto va en el lexicón' },

  // ── 1.ª DECLINACIÓN, TEMA BLANDO ──────────────────────────────────
  // `деревня` es uno de los cuatro lemas que la v0 del inventario habría
  // roto: su plural es `деревни` (395) por TEMA blando, no por regla
  // ortográfica — `вн` no es velar ni sibilante, así que una regla
  // ortográfica produce `*деревны` y ningún gate que la recalcule lo ve.
  { lema: 'деревня', genero: 'f', tema: 'blando', glosa: 'aldea', genPlIrreg: 'деревень',
    nota: 'testigo del tema blando: деревни 395 sin velar ni sibilante delante' },
  { lema: 'неделя', genero: 'f', tema: 'blando', glosa: 'semana', genPlIrreg: 'недель' },

  // ── 2.ª DECLINACIÓN MASCULINA, TEMA DURO ──────────────────────────
  { lema: 'стол', genero: 'm', tema: 'duro', glosa: 'mesa' },              // 1473
  { lema: 'студент', genero: 'm', tema: 'duro', glosa: 'estudiante', animado: true }, // 253
  // ⚠ LA CLASE DEL NOMINATIVO PLURAL EN -А́, que es el ítem de
  // sobreaplicación de `u3-plural-nominativo`: la regla acierta la LETRA
  // (`-ы` es lo que toca) y falla la CASILLA. `города` 793.
  { lema: 'город', genero: 'm', tema: 'duro', glosa: 'ciudad', nomPlIrreg: 'города',
    nota: 'plural en -а́ tónica: la regla da *го́роды y la lengua da города́ (793)' },
  { lema: 'учитель', genero: 'm', tema: 'blando', glosa: 'maestro', animado: true, nomPlIrreg: 'учителя',
    nota: 'la clase del plural en -а́ también toca temas blandos: учителя, no *учители' },
  // ⚠ LOS CUATRO DEL SEGUNDO LOCATIVO. Están aquí en bloque porque son la
  // clase que envenena el generador, y el lexicón es el único sitio donde
  // la casilla puede vivir: no hay regla que la prediga.
  { lema: 'лес', genero: 'm', tema: 'duro', glosa: 'bosque', locativo2: { forma: 'лесу', regente: 'в' },
    nota: 'в лесу 381 frente a в лесе 3. ⚠ Y UNA CORRECCIÓN DE MI PROPIA v0: escribí que «el prepositivo regular (о лесе) sigue vivo y por eso son DOS casillas». Medido, о лесе sale **2 veces**. Sigue siendo lengua correcta y la casilla existe, pero no está viva en este corpus, y un ítem que la pida está pidiendo algo que el alumno no ha leído nunca' },
  { lema: 'сад', genero: 'm', tema: 'duro', glosa: 'jardín', locativo2: { forma: 'саду', regente: 'в' },
    nota: 'в саду 416 frente a в саде 0' },
  { lema: 'берег', genero: 'm', tema: 'duro', glosa: 'orilla', locativo2: { forma: 'берегу', regente: 'на' }, nomPlIrreg: 'берега',
    nota: 'на берегу 203; y el tema es VELAR, así que su plural regular pasa además por la regla ortográfica' },
  { lema: 'пол', genero: 'm', tema: 'duro', glosa: 'suelo',
    locativo2: { forma: 'полу', regente: 'на', rivalContaminado: 'на поле sale 105 veces y NO es ninguna forma de пол: es el prepositivo de поле «campo», un neutro distinto. La comparación 374 > 105 sale bien por la razón equivocada y por eso no se hace' },
    nota: 'на полу 374. El único lema del bloque cuyo rival choca con OTRA entrada del lexicón potencial' },
  // Supletivos de altísima frecuencia. `друг` cambia de tema entero en
  // plural y `человек` cambia de palabra: los dos van guardados, no
  // derivados.
  { lema: 'друг', genero: 'm', tema: 'duro', glosa: 'amigo', animado: true,
    nomPlIrreg: 'друзья', temaPl: 'друзь', temaPlTema: 'blando', genPlIrreg: 'друзей',
    nota: 'друзья 261, друзей 217 — tema de plural distinto (друзь-), no una desinencia rara' },
  { lema: 'человек', genero: 'm', tema: 'duro', glosa: 'persona', animado: true,
    nomPlIrreg: 'люди', temaPl: 'люд', temaPlTema: 'blando', genPlIrreg: 'людей', irregular: { 'instr.pl': 'людьми' },
    nota: 'человек 8976 · люди 3973 · людей 3578: supleción léxica entera' },
  // Sibilante final: su plural es `-и` por ORTOGRAFÍA (el tema es duro) y
  // no por tema, que es justo el par que separa las dos reglas de
  // `деревня`. Sin los dos juntos, cualquiera de las dos reglas sola
  // acierta en todo lo que tiene delante.
  { lema: 'врач', genero: 'm', tema: 'duro', glosa: 'médico', animado: true, genPlIrreg: 'врачей',
    nota: 'tema DURO con sibilante: врачи es la regla ortográfica, деревни es la de tema. El par es lo que impide publicar media regla' },
  // La vocal fugaz, con su cuenta: день 5909.
  { lema: 'день', genero: 'm', tema: 'blando', glosa: 'día', temaOblicuo: 'дн',
    nota: 'vocal fugaz: дня, дню, днём, дне, дни, дней — el nominativo singular es la ÚNICA casilla que la conserva' },

  // ── 2.ª DECLINACIÓN MASCULINA, TEMA BLANDO ────────────────────────
  // `конь` y `дверь` acaban en la misma letra y son declinaciones
  // distintas: es el par que demuestra que la declinación no se lee en la
  // terminación y que el género es dato.
  { lema: 'конь', genero: 'm', tema: 'blando', glosa: 'caballo', animado: true,
    irregular: { 'instr.sg': 'конём' }, genPlIrreg: 'коней',
    nota: 'кони 120 sin velar ni sibilante — testigo del tema blando; y конём (47) lleva ё porque la desinencia es tónica, que en el sustantivo es dato y no regla' },
  // ⚠ `словарь` ESTUVO AQUÍ Y SALIÓ, y se escribe en vez de borrarse sin
  // más: su plural `словари` sale **0 veces** en 7,7 M de palabras (el lema
  // entero, 15). Un lexicón puede tener lemas que el corpus no certifica
  // —`музей` es uno— pero sólo si aportan una regla que no aporta nadie
  // más, y el masculino blando ya lo aportan `конь` y `царь`. Guardar la
  // evidencia negativa es que el siguiente no lo reproponga.
  { lema: 'царь', genero: 'm', tema: 'blando', glosa: 'zar, rey', animado: true,
    irregular: { 'instr.sg': 'царём' }, genPlIrreg: 'царей',
    nota: 'masculino blando ANIMADO (царь 1366, царей 24): con конь hace el par que prueba que el acusativo animado sale del genitivo en las dos clases' },
  // `музей` es la cuarta forma falsa de control (`*музеы`) y entra por eso
  // aunque salga 5 veces: el corpus NO puede certificarla y el gate lo
  // dice en vez de disimularlo. Su valor es separar `-й` de `-ий`.
  { lema: 'музей', genero: 'm', tema: 'blando', glosa: 'museo',
    nota: 'BAJA ATESTACIÓN (музей 5, музеев 2). Está por la regla, no por la frecuencia: es el masculino en -й, que hace «о музее» y NO «о музеи» como la clase -ий' },

  // ── 2.ª DECLINACIÓN NEUTRA ────────────────────────────────────────
  { lema: 'окно', genero: 'n', tema: 'duro', glosa: 'ventana', genPlIrreg: 'окон',
    nota: 'окон 254: vocal de apoyo SIN ё, frente a сестёр que la lleva con ё' },
  { lema: 'место', genero: 'n', tema: 'duro', glosa: 'lugar', genPlIrreg: 'мест' },
  { lema: 'письмо', genero: 'n', tema: 'duro', glosa: 'carta', genPlIrreg: 'писем', nomPlIrreg: 'письма',
    nota: 'vocal de apoyo con pérdida del signo blando: писем, no *письм' },
  { lema: 'слово', genero: 'n', tema: 'duro', glosa: 'palabra', genPlIrreg: 'слов' },
  { lema: 'море', genero: 'n', tema: 'blando', glosa: 'mar', genPlIrreg: 'морей' },

  // ── 3.ª DECLINACIÓN ───────────────────────────────────────────────
  // El otro miembro del par con `конь`. `двери` 1834 y `ночи` 1053: los
  // dos son tema blando y ninguno lleva velar ni sibilante.
  { lema: 'дверь', genero: 'f', tema: 'blando', glosa: 'puerta', genPlIrreg: 'дверей',
    nota: 'двери 1834 — el plural sale del tema, no de la ortografía' },
  { lema: 'ночь', genero: 'f', tema: 'blando', glosa: 'noche', genPlIrreg: 'ночей' },
  { lema: 'вещь', genero: 'f', tema: 'blando', glosa: 'cosa', genPlIrreg: 'вещей' },
];

export const VERBOS_A1: EntradaVerbal[] = [
  // ── CONJUGACIÓN I, SIN ALTERNANCIA ────────────────────────────────
  { lema: 'читать', clase: 1, temaPresente: 'чита', acento2sgDesinencial: false, acento1sgDesinencial: false,
    glosa: 'leer', aspecto: 'impf' },
  { lema: 'знать', clase: 1, temaPresente: 'зна', acento2sgDesinencial: false, acento1sgDesinencial: false,
    glosa: 'saber', aspecto: 'impf' },
  { lema: 'работать', clase: 1, temaPresente: 'работа', acento2sgDesinencial: false, acento1sgDesinencial: false,
    glosa: 'trabajar', aspecto: 'impf' },
  { lema: 'делать', clase: 1, temaPresente: 'дела', acento2sgDesinencial: false, acento1sgDesinencial: false,
    glosa: 'hacer', aspecto: 'impf' },

  // ── CONJUGACIÓN I, CON ALTERNANCIA — y es la razón de que el tema sea
  //    campo OBLIGATORIO. Sin el dato, la regla ingenua produce `*писаю`,
  //    `*жиешь`, `*ждаю`: formas que no existen y que nada delataría.
  { lema: 'писать', clase: 1, temaPresente: 'пиш', acento2sgDesinencial: false, acento1sgDesinencial: true,
    glosa: 'escribir', aspecto: 'impf',
    nota: 'ALTERNANCIA с→ш. La regla ingenua da писа- y produce *писаю; la lengua da пишу (199) y *писаю sale 0 veces. Y es el lema donde los DOS acentos discrepan: пишу́ tónica (imperativo пиши́) y пи́шешь átona (sin ё)' },
  { lema: 'сказать', clase: 1, temaPresente: 'скаж', acento2sgDesinencial: false, acento1sgDesinencial: true,
    glosa: 'decir', aspecto: 'pf', nota: 'ALTERNANCIA з→ж, mismo reparto de acento que писать' },
  { lema: 'жить', clase: 1, temaPresente: 'жив', acento2sgDesinencial: true, acento1sgDesinencial: true,
    glosa: 'vivir', aspecto: 'impf',
    nota: 'el tema gana una в que el infinitivo no tiene (жив-). Y es el control ortográfico: жи- nunca se escribe жы- (жыть 0, жить 2674)' },
  { lema: 'ждать', clase: 1, temaPresente: 'жд', acento2sgDesinencial: true, acento1sgDesinencial: true,
    glosa: 'esperar', aspecto: 'impf', nota: 'el tema PIERDE la vocal: жд-, no жда-' },
  { lema: 'брать', clase: 1, temaPresente: 'бер', acento2sgDesinencial: true, acento1sgDesinencial: true,
    glosa: 'tomar', aspecto: 'impf', nota: 'alternancia бра-/бер-, que es la de `u13-alternancias-raiz` vista desde el presente' },
  { lema: 'давать', clase: 1, temaPresente: 'да', acento2sgDesinencial: true, acento1sgDesinencial: true,
    glosa: 'dar', aspecto: 'impf', imperativoIrreg: 'давай',
    nota: 'el tema pierde la sílaba -ва- (даю) pero el IMPERATIVO la conserva (давай): la regla del imperativo sale del tema de presente y aquí falla, así que va guardado' },

  // ── CONJUGACIÓN I CON PASADO SUPLETIVO ────────────────────────────
  { lema: 'идти', clase: 1, temaPresente: 'ид', acento2sgDesinencial: true, acento1sgDesinencial: true,
    glosa: 'ir (a pie, en curso)', aspecto: 'impf',
    pasadoIrreg: { m: 'шёл', f: 'шла', n: 'шло', pl: 'шли' },
    nota: 'el pasado no sale del infinitivo: шёл/шла. Y la regla del pasado ni siquiera puede intentarlo, porque идти no acaba en -ть — devuelve null y por eso el dato es obligatorio aquí' },
  { lema: 'мочь', clase: 1, temaPresente: 'мог', acento2sgDesinencial: true, acento1sgDesinencial: true,
    glosa: 'poder', aspecto: 'impf',
    irregular: { '1sg': 'могу', '2sg': 'можешь', '3sg': 'может', '1pl': 'можем', '2pl': 'можете', '3pl': 'могут' },
    pasadoIrreg: { m: 'мог', f: 'могла', n: 'могло', pl: 'могли' },
    imperativoIrreg: null,
    nota: 'alterna г/ж DENTRO del paradigma (могу/можешь/могут), que no es una alternancia de tema sino dos temas, y por eso va guardado entero. Sin imperativo: `imperativoIrreg: null` es la declaración, no un hueco' },

  // ── CONJUGACIÓN II ────────────────────────────────────────────────
  { lema: 'говорить', clase: 2, temaPresente: 'говор', acento2sgDesinencial: true, acento1sgDesinencial: true,
    glosa: 'hablar', aspecto: 'impf' },
  { lema: 'любить', clase: 2, temaPresente: 'люб', tema1sg: 'любл', acento2sgDesinencial: false, acento1sgDesinencial: true,
    glosa: 'amar', aspecto: 'impf',
    nota: 'EPÉNTESIS DE Л tras labial, y SÓLO en la 1.ª sg: люблю (1985) frente a любишь. Es la alternancia que el aviso de `temaPresente` no puede ver, porque el tema general sí coincide con el ingenuo' },
  { lema: 'видеть', clase: 2, temaPresente: 'вид', tema1sg: 'виж', acento2sgDesinencial: false, acento1sgDesinencial: false,
    glosa: 'ver', aspecto: 'impf', imperativoIrreg: null,
    nota: 'ALTERNANCIA д→ж sólo en 1.ª sg (вижу). Sin imperativo usual en ruso moderno: se declara null en vez de producir *видь' },
  { lema: 'учить', clase: 2, temaPresente: 'уч', acento2sgDesinencial: false, acento1sgDesinencial: true,
    glosa: 'enseñar, estudiar', aspecto: 'impf',
    nota: 'tema en SIBILANTE: la desinencia -ят se escribe -ат (учат) y -ю se escribe -у (учу). Es la misma regla ortográfica del sustantivo y por eso vive en una sola función' },
  { lema: 'помнить', clase: 2, temaPresente: 'помн', acento2sgDesinencial: false, acento1sgDesinencial: false,
    glosa: 'recordar', aspecto: 'impf',
    nota: 'imperativo помни y no *помнь: con la desinencia átona la regla toma -ь, salvo que el tema acabe en GRUPO consonántico. Es la mitad de la regla que un lexicón sin este lema no contiene' },

  // ── REFLEXIVO ─────────────────────────────────────────────────────
  { lema: 'учиться', clase: 2, temaPresente: 'уч', acento2sgDesinencial: false, acento1sgDesinencial: true,
    glosa: 'estudiar', aspecto: 'impf', reflexivo: true,
    nota: 'la alternancia -ся/-сь es ORTOGRÁFICA (учусь tras vocal, учишься tras consonante) y la hace la máquina; que el verbo la lleve es léxico. Es el contenido declarado de `u7-reflexivo-sya`' },
  { lema: 'нравиться', clase: 2, temaPresente: 'нрав', tema1sg: 'нравл', acento2sgDesinencial: false, acento1sgDesinencial: false,
    glosa: 'gustar', aspecto: 'impf', reflexivo: true, imperativoIrreg: null,
    nota: 'inherentemente reflexivo (no existe *нравить) y con epéntesis de л: es el verbo de `u4-sujeto-dativo`' },
];

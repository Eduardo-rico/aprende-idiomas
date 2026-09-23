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
// ⚠ `genPlIrreg` y `nomPlIrreg` DICEN «IRREGULAR», Y SE LEEN. El 2026-09-23
// se retiraron CATORCE que eran formas regulares: once genitivos plurales
// (недель, людей, коней, царей, мест, слов, лиц, морей, дверей, ночей, вещей)
// y tres nominativos (сёстры, люди, письма — los dos primeros ya salen de
// `temaPl`). Borrados, la máquina produce la MISMA cadena en los catorce: es
// lo que los hacía un motivo falso (§E3) y no un dato. Ahora el invariante
// `irregular-que-sale-de-la-regla` de `paradigma-ru.ts` se pone ROJO si uno
// de estos campos guarda lo que la regla ya da. Lo que queda guardado es lo
// que la regla NO da: la vocal de apoyo (сестёр, деревень, окон, писем,
// сердец), el -ей de la 1.ª blanda (дядей) y el -ей sin ь de друзей.
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
  { lema: 'книга', genero: 'f', tema: 'duro', glosa: 'libro',              // 388
    lecturaRival: { 'nom.pl': 'книгы sale 1 vez en 7,7 M y es DELIBERADA: «как владельцу оной бесценной книгы», la inscripción de un semianalfabeto citada entre comillas. Frente a книги 597. Es caracterización de personaje, no lengua — y es la prueba de que «la presencia atestigua» se rompe a una aparición' } },
  { lema: 'вода', genero: 'f', tema: 'duro', glosa: 'agua' },              // 561
  { lema: 'голова', genero: 'f', tema: 'duro', glosa: 'cabeza' },          // 1439
  { lema: 'школа', genero: 'f', tema: 'duro', glosa: 'escuela' },          // 59
  { lema: 'страна', genero: 'f', tema: 'duro', glosa: 'país' },            // 36
  // ⚠ EL MISMO PAR, EN LA 1.ª DECLINACIÓN, y hace falta aparte: la /o/ del
  // instrumental femenino se escribe en OTRA desinencia (`-ой/-ей`, no
  // `-ом/-ем`), así que una regla acertada en el masculino puede estar mal
  // escrita aquí. Medido: душой 275 · *душею 0 · тучей 17 · *тучой 0.
  { lema: 'душа', genero: 'f', tema: 'duro', glosa: 'alma', desinenciaOTonica: true,
    nota: 'душа 1030 · душой 275: sibilante con la /o/ TÓNICA en la 1.ª declinación. ⚠ Y su variante del XIX es la más frecuente de todo el lexicón: душою 111 frente a душой 275, el 29 % — ver `alternativasAceptadasRu`' },
  { lema: 'туча', genero: 'f', tema: 'duro', glosa: 'nube (de tormenta)', desinenciaOTonica: false,
    nota: 'туча 106 · тучей 17 · *тучой 0: sibilante con la /o/ ÁTONA. Con душа sola, «sibilante femenino ⇒ ой» acierta entera' },
  // ⚠ EL PAR QUE DECIDE EL GENITIVO PLURAL, y es la razón de que `карта`
  // esté aquí con 21 apariciones: `карт` (91) NO mete vocal de apoyo y
  // `сестёр` (79) SÍ. Las dos son 1.ª declinación dura con desinencia
  // cero, y ninguna regla las separa — el reparto es LÉXICO. `карт` es el
  // ítem de sobreaplicación de `u5-genitivo-plural`: quien aprenda «la
  // desinencia cero hace aparecer una vocal» escribe `*карот`.
  { lema: 'карта', genero: 'f', tema: 'duro', glosa: 'mapa, carta de baraja',
    nota: 'está por el genitivo plural SIN vocal de apoyo (карт 91), que es la frontera de la regla de сестёр. ⚠ LA GLOSA SE CORRIGIÓ EL 2026-09-23 y la corrección cambió las pistas de dos ítems publicados (b3 y b5): decía «mapa, carta», y para un mexicano «carta» a secas es письмо — el portugués no lo arregla, «carta» también es la del correo —, y el ítem de b5 lleva «старое письмо» en el marco. NO es «naipe»: en portugués «naipe» es el PALO de la baraja, falso amigo para este alumno. Reparto en la biblioteca (leído por el lingüista): de las 91 de карт, 87 naipe y 2 mapa; del lema entero ≈86 % naipe. «mapa» va PRIMERO por el aparato y no por la lengua: la ruta ciega de la glosa de los lotes a2/a2b lee la última letra de la primera palabra, y con «mapa» da la misma clase que antes' },
  { lema: 'сестра', genero: 'f', tema: 'duro', glosa: 'hermana',
    genPlIrreg: 'сестёр', temaPl: 'сёстр',
    lecturaYo: { 'gen.sg': 'сёстры (24) NO es una variante de сестры: es el NOMINATIVO PLURAL, otra casilla del mismo lema. La máquina tiene razón en el genitivo singular' },
    nota: '⚠ EL `temaPl: сёстр` LO ENCONTRÓ EL LINGÜISTA ADVERSARIAL EL 2026-09-12 Y ESTABA VIVO: la máquina daba *сестрам/*сестрами/*сестрах. Зализняк: мн. сёстры, сестёр, сёстрам, сёстрами, о сёстрах. Medido con ё frente a sin ё — 4/29, 4/29, 4/5 — que es la tasa exacta de ediciones ё-ificadas, y сёстер da 0, o sea que la ё del genitivo plural cae donde esta entrada dice y no donde caería la de los demás casos. Vocal de apoyo CON ё (сестёр 16 · сёстер 0)' },
  // Masculino con forma femenina: la clase que `u3-genero-por-terminacion`
  // declara como su único contenido, porque leer la terminación es gratis.
  { lema: 'папа', genero: 'm', tema: 'duro', glosa: 'papá', animado: true },   // 557
  // ⚠ ENTRÓ EL 2026-09-23 PARA `u5-genitivo-plural`, y por la regla, no por
  // la frecuencia (aunque la tiene: мужчина 426 · мужчины 364 · мужчин 241).
  // Es el único masculino del lexicón de la 1.ª declinación que se puede
  // pluralizar con naturalidad (`папа` → `пап` sale 4 veces), y el genitivo
  // plural es la casilla donde eso DECIDE: la desinencia la manda la
  // declinación (y, sólo dentro de la 2.ª, el género), así que мужчин (Ø)
  // frente a мальчиков (-ов) es el par que tumba la regla «masculino ⇒ -ов»
  // que dan los manuales de РКИ por género (*мужчинов 0). No es transferencia:
  // en español y portugués el plural lo decide la terminación (el poeta/los
  // poetas), así que el patrón le es familiar al alumno.
  { lema: 'мужчина', genero: 'm', tema: 'duro', glosa: 'hombre', animado: true },
  { lema: 'дядя', genero: 'm', tema: 'blando', glosa: 'tío', animado: true, genPlIrreg: 'дядей', // 1199
    desinenciaOTonica: false,
    nota: 'el genitivo plural de la 1.ª blanda no tiene una sola forma: недель y деревень toman -ь (con vocal de apoyo) y дядей toma -ей (83). No hay regla que los separe desde el lema, así que la máquina pone la mayoritaria y el reparto va en el lexicón' },

  // ── 1.ª DECLINACIÓN, TEMA BLANDO ──────────────────────────────────
  // `деревня` es uno de los cuatro lemas que la v0 del inventario habría
  // roto: su plural es `деревни` (395) por TEMA blando, no por regla
  // ortográfica — `вн` no es velar ni sibilante, así que una regla
  // ortográfica produce `*деревны` y ningún gate que la recalcule lo ve.
  { lema: 'деревня', genero: 'f', tema: 'blando', glosa: 'aldea', genPlIrreg: 'деревень', desinenciaOTonica: false,
    nota: 'testigo del tema blando: деревни 395 sin velar ni sibilante delante' },
  { lema: 'неделя', genero: 'f', tema: 'blando', glosa: 'semana', desinenciaOTonica: false },

  // ── 2.ª DECLINACIÓN MASCULINA, TEMA DURO ──────────────────────────
  { lema: 'стол', genero: 'm', tema: 'duro', glosa: 'mesa' },              // 1473
  { lema: 'студент', genero: 'm', tema: 'duro', glosa: 'estudiante', animado: true }, // 253
  // ⚠ ENTRÓ EL 2026-09-23 como la pareja de `мужчина` (ver arriba): masculino
  // de la 2.ª, animado, tema VELAR y genitivo plural regular en -ов
  // (мальчиков 95). `студент` ya está en otro par del mismo lote, y el marco
  // de un par tiene que servir a los dos lemas. мальчик 1070 · мальчики 123.
  { lema: 'мальчик', genero: 'm', tema: 'duro', glosa: 'niño', animado: true },
  // ⚠ LA CLASE DEL NOMINATIVO PLURAL EN -А́, que es el ítem de
  // sobreaplicación de `u3-plural-nominativo`: la regla acierta la LETRA
  // (`-ы` es lo que toca) y falla la CASILLA. `города` 793.
  { lema: 'город', genero: 'm', tema: 'duro', glosa: 'ciudad', nomPlIrreg: 'города',
    nota: 'plural en -а́ tónica: la regla da *го́роды y la lengua da города́ (793)' },
  { lema: 'учитель', genero: 'm', tema: 'blando', glosa: 'maestro', animado: true, nomPlIrreg: 'учителя',
    desinenciaOTonica: false,
    nota: 'la clase del plural en -а́ también toca temas blandos: учителя, no *учители. Y es el OTRO lado de la regla de la /o/: tema blando con desinencia ÁTONA da учителем (68) y no *учителём (0) — con конь y день solos, la regla «blando ⇒ ё» acertaría en todo lo que tiene delante' },
  // ⚠ LOS CUATRO DEL SEGUNDO LOCATIVO. Están aquí en bloque porque son la
  // clase que envenena el generador, y el lexicón es el único sitio donde
  // la casilla puede vivir: no hay regla que la prediga.
  // ⚠ `nomPlIrreg: 'леса'` ENTRÓ EL 2026-09-13 Y LA MÁQUINA PRODUCÍA `*лесы`.
  // Es la MISMA clase que `город` y `берег` —el plural en -а́ tónica— y los dos
  // la traían declarada; a `лес` se le olvidó. Зализняк: лес, мн. леса́.
  // Medido: `леса` 461 · `лесы` 6, y los oblicuos (лесов 64, лесам 52, лесами
  // 23, лесах 45) ya eran correctos: sólo fallaba el nominativo plural.
  //
  // ⚠ Y POR QUÉ EL GATE SALÍA VERDE, que es la parte que se transfiere: sus
  // 948 formas comprueban «¿está atestada?», y `лесы` SÍ está — 6 veces. Las
  // seis son OTRO LEMA: `леса́` femenino «sedal, lazo de caza» («наставит лесы,
  // зверь глуп — и попадёт», Afanásiev; «конец лесы» de una caña). Un número
  // correcto sobre una forma ambigua es un número verdadero que mide otra cosa,
  // y aquí el homógrafo estaba justo donde el dato faltaba.
  //
  // Y LO QUE NO SE PUEDE AUTOMATIZAR, escrito en vez de disimulado: un detector
  // que comparase el `-ы` generado contra el `-а` de la misma raíz marcaría
  // TODOS los masculinos de la 2.ª, porque `-а` es también su genitivo singular
  // (`стола`, `дома`) — un gate que marca media clase es un gate apagado. Lo
  // que sí queda es `*лесы` en la lista de control positivo de
  // `check-paradigma-ru.ts`, con su lectura: es un testigo, no un detector.
  { lema: 'лес', genero: 'm', tema: 'duro', glosa: 'bosque', locativo2: { forma: 'лесу', regente: 'в' }, nomPlIrreg: 'леса',
    lecturaRival: { locativo2: 'в лесе sale 3 veces y о лесе 2: el prepositivo regular de лес EXISTE y es correcto, pero está casi muerto en este corpus. No es homógrafo ni caracterización: es la casilla legítima que la clase del segundo locativo desplaza. Por eso son DOS casillas y no una corrección' },
    nota: 'в лесу 381 frente a в лесе 3. ⚠ Y UNA CORRECCIÓN DE MI PROPIA v0: escribí que «el prepositivo regular (о лесе) sigue vivo y por eso son DOS casillas». Medido, о лесе sale **2 veces**. Sigue siendo lengua correcta y la casilla existe, pero no está viva en este corpus, y un ítem que la pida está pidiendo algo que el alumno no ha leído nunca' },
  { lema: 'сад', genero: 'm', tema: 'duro', glosa: 'jardín', locativo2: { forma: 'саду', regente: 'в' },
    nota: 'в саду 416 frente a в саде 0' },
  { lema: 'берег', genero: 'm', tema: 'duro', glosa: 'orilla', locativo2: { forma: 'берегу', regente: 'на' }, nomPlIrreg: 'берега',
    lecturaYo: { 'nom.sg': 'берёг (4) es OTRO LEMA: el pasado masculino de беречь «guardar». No es una variante de берег «orilla»', 'ac.sg': 'ídem', lema: 'ídem — la misma lectura, vista desde el campo del lexicón en vez de desde la casilla generada' },
    nota: 'на берегу 203; y el tema es VELAR, así que su plural regular pasa además por la regla ortográfica' },
  { lema: 'пол', genero: 'm', tema: 'duro', glosa: 'suelo',
    locativo2: { forma: 'полу', regente: 'на' },
    lecturaRival: { locativo2: 'на поле sale 105 veces y NO es ninguna forma de пол: es el prepositivo de поле «campo», otro lema y además neutro — «выйдет в поле», «в поле съезжаться». La comparación 374 > 105 sale bien POR LA RAZÓN EQUIVOCADA, y los 12 de «в полу» son todos el suelo o el faldón («заделывая в полу щели», «вцепился в полу сюртука»)' },
    nota: 'на полу 374. El único lema del bloque cuyo rival choca con OTRA entrada del lexicón potencial' },
  // Supletivos de altísima frecuencia. `друг` cambia de tema entero en
  // plural y `человек` cambia de palabra: los dos van guardados, no
  // derivados.
  { lema: 'друг', genero: 'm', tema: 'duro', glosa: 'amigo', animado: true,
    nomPlIrreg: 'друзья', temaPl: 'друзь', temaPlTema: 'blando', genPlIrreg: 'друзей',
    nota: 'друзья 261, друзей 217 — tema de plural distinto (друзь-), no una desinencia rara' },
  { lema: 'человек', genero: 'm', tema: 'duro', glosa: 'persona', animado: true,
    temaPl: 'люд', temaPlTema: 'blando', irregular: { 'instr.pl': 'людьми' },
    nota: 'человек 8976 · люди 3973 · людей 3578: supleción léxica entera' },
  // Sibilante final: su plural es `-и` por ORTOGRAFÍA (el tema es duro) y
  // no por tema, que es justo el par que separa las dos reglas de
  // `деревня`. Sin los dos juntos, cualquiera de las dos reglas sola
  // acierta en todo lo que tiene delante.
  { lema: 'врач', genero: 'm', tema: 'duro', glosa: 'médico', animado: true,
    desinenciaOTonica: true,
    nota: 'tema DURO con sibilante: врачи es la regla ortográfica, деревни es la de tema. El par es lo que impide publicar media regla. Y con la /o/ TÓNICA da врачом (29) y no *врачем (0), que es el lado que товарищ contradice. ⚠ Y SU `genPlIrreg: врачей` SE RETIRÓ EL 2026-09-12: `врачей` es perfectamente REGULAR —tras sibilante el genitivo plural masculino es -ей, АГ-80— y guardarlo como «irregular» era un motivo escrito FALSO en un campo que el gate lee. Ahora sale de la regla, y con él ножей 27, ключей 26, мужей 80' },
  // ⚠ EL LEMA QUE SEPARA LAS DOS MITADES DE LA REGLA DE LA /o/ TRAS
  // SIBILANTE, y por eso entra. Con `врач` solo, la regla «sibilante ⇒ ом»
  // acierta en todo el lexicón: es exactamente el aspecto de una regla a la
  // que le falta una mitad. Medido: товарищем 110 · *товарищом 0.
  { lema: 'товарищ', genero: 'm', tema: 'duro', glosa: 'compañero, camarada', animado: true,
    desinenciaOTonica: false,
    nota: 'товарищ 397 · товарищем 110 · *товарищом 0. Sibilante con la /o/ ÁTONA: es la frontera de врачом, y sin él la regla de la /o/ sale verde con la mitad escrita. Su genitivo plural товарищей (323) sale de la regla desde el 2026-09-12 y ya no va como `genPlIrreg`: el acento NO lo toca, porque tras sibilante la desinencia es -ей en los dos lados' },
  // La vocal fugaz, con su cuenta: день 5909.
  { lema: 'день', genero: 'm', tema: 'blando', glosa: 'día', temaOblicuo: 'дн',
    desinenciaOTonica: true,
    nota: '⚠ EL `днём` LO ENCONTRÓ EL LINGÜISTA ADVERSARIAL EL 2026-09-12 Y ESTABA VIVO Y PUBLICADO: la máquina daba *днем, y la propia nota de esta entrada YA ESCRIBÍA «дня, дню, днём, дне». El fichero se contradecía a sí mismo y el gate salía verde, porque `contar()` funde las dos grafías de la ё a propósito y aquí el error ERA la ё. конь y царь sí llevaban su instrumental tónico; a день se le olvidó: la copia N+1 de una regla duplicada. днём 52 con ё · 428 sin. vocal fugaz: дня, дню, днём, дне, дни, дней — el nominativo singular es la ÚNICA casilla que la conserva' },

  // ── 2.ª DECLINACIÓN MASCULINA, TEMA BLANDO ────────────────────────
  // `конь` y `дверь` acaban en la misma letra y son declinaciones
  // distintas: es el par que demuestra que la declinación no se lee en la
  // terminación y que el género es dato.
  { lema: 'конь', genero: 'm', tema: 'blando', glosa: 'caballo', animado: true,
    desinenciaOTonica: true,
    nota: 'кони 120 sin velar ni sibilante — testigo del tema blando; y конём (47) lleva ё porque la /o/ de la desinencia es TÓNICA. El 2026-09-12 esta casilla dejó de ser un `irregular` escrito a mano y pasó a salir de la regla con `desinenciaOTonica`: escrita a mano estaba en конь y en царь y FALTABA en день, que es la copia N+1 de siempre' },
  // ⚠ `словарь` ESTUVO AQUÍ Y SALIÓ, y se escribe en vez de borrarse sin
  // más: su plural `словари` sale **0 veces** en 7,7 M de palabras (el lema
  // entero, 15). Un lexicón puede tener lemas que el corpus no certifica
  // —`музей` es uno— pero sólo si aportan una regla que no aporta nadie
  // más, y el masculino blando ya lo aportan `конь` y `царь`. Guardar la
  // evidencia negativa es que el siguiente no lo reproponga.
  { lema: 'царь', genero: 'm', tema: 'blando', glosa: 'zar, rey', animado: true,
    desinenciaOTonica: true,
    nota: 'masculino blando ANIMADO (царь 1366, царей 24): con конь hace el par que prueba que el acusativo animado sale del genitivo en las dos clases' },
  // `музей` es la cuarta forma falsa de control (`*музеы`) y entra por eso
  // aunque salga 5 veces: el corpus NO puede certificarla y el gate lo
  // dice en vez de disimularlo. Su valor es separar `-й` de `-ий`.
  // ⚠ EL LEMA QUE PARTIÓ EL CAMPO DEL ACENTO EN DOS, y entra por eso.
  // `край` tiene el singular ÁTONO y el plural TÓNICO —Зализняк, esquema c—,
  // y el sentinela de la /o/ vive en las dos: `краем` 10 (*краём 0) y
  // `краёв` 1 con ё · `краев` 23 sin. Un solo booleano no puede dar las dos,
  // y sin este lema el campo seguiría pareciendo uno.
  { lema: 'край', genero: 'm', tema: 'blando', glosa: 'borde, región',
    desinenciaOTonica: false, desinenciaOTonicaPl: true, nomPlIrreg: 'края',
    lecturaYo: { 'gen.pl': 'краёв sale 1 vez con ё y краев 23 sin: es la tasa de ediciones ё-ificadas, no una casilla sin ё. La forma es краёв y la tónica del plural es lo que la produce' },
    nota: 'край 281 · краем 10 · края (nom pl y gen sg) · краёв 1 con ё / краев 23 sin. ⚠ ESTÁ POR LA REGLA Y NO POR LA FRECUENCIA: es el único lema del lexicón cuyo acento de la /o/ CAE DE DISTINTO LADO en singular y en plural, o sea el que obliga a que `desinenciaOTonica` y `desinenciaOTonicaPl` sean dos campos. Lo encontró el lingüista adversarial el 2026-09-12 contra un comentario que proponía un testigo imposible' },
  { lema: 'музей', genero: 'm', tema: 'blando', glosa: 'museo', desinenciaOTonica: false,
    nota: 'BAJA ATESTACIÓN (музей 5, музеев 2). Está por la regla, no por la frecuencia: es el masculino en -й, que hace «о музее» y NO «о музеи» como la clase -ий' },

  // ── 2.ª DECLINACIÓN NEUTRA ────────────────────────────────────────
  { lema: 'окно', genero: 'n', tema: 'duro', glosa: 'ventana', genPlIrreg: 'окон',
    nota: 'окон 254: vocal de apoyo SIN ё, frente a сестёр que la lleva con ё' },
  { lema: 'место', genero: 'n', tema: 'duro', glosa: 'lugar' },
  { lema: 'письмо', genero: 'n', tema: 'duro', glosa: 'carta', genPlIrreg: 'писем',
    nota: 'vocal de apoyo con pérdida del signo blando: писем, no *письм' },
  { lema: 'слово', genero: 'n', tema: 'duro', glosa: 'palabra' },
  // ⚠ LOS DOS NEUTROS EN `ц`, y son la tercera cara de la misma regla: aquí
  // la /o/ no está sólo en el instrumental, está TAMBIÉN en el nominativo,
  // que es lo que hace que `сердце` se escriba con `е` y `лицо` con `о`.
  // `ц` entra en la regla de la /o/ y NO en la de la `ы` (отцы es correcto):
  // son dos reglas que comparten la letra, y tratarlas como una es la media
  // regla de siempre.
  { lema: 'сердце', genero: 'n', tema: 'duro', glosa: 'corazón', desinenciaOTonica: false, genPlIrreg: 'сердец',
    nota: 'сердце 3057 · сердцем 360 · *сердцом 0. El nominativo lo decide la MISMA regla que el instrumental: átona ⇒ е en las dos casillas' },
  { lema: 'лицо', genero: 'n', tema: 'duro', glosa: 'cara, persona', desinenciaOTonica: true,
    nota: 'лицо 5270 · лицом 1503. La /o/ TÓNICA, y el par con сердце es lo que impide escribir «ц ⇒ е» a secas. ⚠ Su rival `лицем` sale 2 veces y hay que LEERLO: es grafía antigua, no una casilla viva — ver `lecturaRival`',
    lecturaRival: { 'instr.sg': 'лицем (2) es grafía ANTIGUA del mismo instrumental, no otro lema ni otra casilla: «пред лицем», fórmula eclesiástica. Frente a лицом 1503. El corpus TIENE FECHA y esto es la parte de su fecha que no es ruso de hoy' } },
  { lema: 'море', genero: 'n', tema: 'blando', glosa: 'mar', desinenciaOTonica: false,
    nota: 'neutro blando con la /o/ ÁTONA en las dos casillas que la llevan: море (nominativo) y морем (54, instrumental). Su contraparte tónica sería ружьё/ружьём, que no está en el lexicón' },

  // ── 3.ª DECLINACIÓN ───────────────────────────────────────────────
  // El otro miembro del par con `конь`. `двери` 1834 y `ночи` 1053: los
  // dos son tema blando y ninguno lleva velar ni sibilante.
  { lema: 'дверь', genero: 'f', tema: 'blando', glosa: 'puerta',
    nota: 'двери 1834 — el plural sale del tema, no de la ortografía' },
  { lema: 'ночь', genero: 'f', tema: 'blando', glosa: 'noche' },
  { lema: 'вещь', genero: 'f', tema: 'blando', glosa: 'cosa' },
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
  // ⚠ `acento2sgDesinencial: false` — corregido el 2026-09-12. La v0 decía
  // `true` y es falso: **мо́жешь** lleva el acento en el tema. Era inerte
  // porque el verbo va `irregular` entero, y eso es justo lo que lo hacía
  // peligroso: un dato falso en un campo que la máquina lee, sin nada que lo
  // comprobara. Los otros 16 verbos tienen los dos acentos correctos.
  { lema: 'мочь', clase: 1, temaPresente: 'мог', acento2sgDesinencial: false, acento1sgDesinencial: true,
    glosa: 'poder', aspecto: 'impf',
    irregular: { '1sg': 'могу', '2sg': 'можешь', '3sg': 'может', '1pl': 'можем', '2pl': 'можете', '3pl': 'могут' },
    pasadoIrreg: { m: 'мог', f: 'могла', n: 'могло', pl: 'могли' },
    imperativoIrreg: null,
    lecturaYo: { 'pres.2sg': 'можёшь sale 1 vez y es la fórmula rimada «Как живёшь-можёшь?» (Leskov), donde la ё es analógica de живёшь. Una aparición en una fórmula fija no es una variante de la casilla' },
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

// ══════════════════════════════════════════════════════════════════════
// LOS ADJETIVOS
// ══════════════════════════════════════════════════════════════════════
//
// SEIS lemas, y el criterio de entrada es el mismo que el de los nombres:
// cada uno es el ÚNICO que separa dos reglas que en todo lo demás coinciden.
// La gramática escolar habla de cuatro declinaciones adjetivales; la máquina
// tiene dos filas, y estos seis lemas son la prueba de que las otras dos son
// la dura pasada por la ortografía.
//
//   новый    duro, átona       la fila desnuda
//   молодой  duro, TÓNICA      -ой en el nominativo, y nada más cambia
//   синий    blando            la segunda fila entera
//   русский  velar, átona      -ий por la regla de la ы, no por la clase
//   хороший  sibilante, átona  -ий Y la /o/ átona: хорошего, хорошем
//   большой  sibilante, TÓNICA el MISMO tema que хороший y OCHO casillas
//                              distintas, todas por un bit de acento
import type { EntradaAdjetival } from './paradigma-adj-ru';

export const ADJETIVOS_A1: EntradaAdjetival[] = [
  { lema: 'новый', tema: 'duro', desinenciaTonica: false, glosa: 'nuevo',
    nota: 'новый 732 · нового 499 · новым 272 · новое 574. La fila dura desnuda, sin velar ni sibilante que active ninguna regla ortográfica' },
  { lema: 'молодой', tema: 'duro', desinenciaTonica: true, glosa: 'joven',
    nota: 'молодой 1910 · молодого 492 · молодым 248. Con la desinencia TÓNICA el nominativo masculino va en -ой, y es la única casilla que cambia: молодого y нового tienen la misma desinencia porque el tema no es sibilante — la /o/ tras consonante dura no alterna. *молодый 0' },
  { lema: 'синий', tema: 'blando', desinenciaTonica: false, glosa: 'azul (oscuro)',
    nota: 'синий 83 · синего 40 · синим 38 · синяя 30 · синее 65. La SEGUNDA fila entera: синего y no *синого (0), синяя y no *синая. Es el único lema del lexicón que la usa, así que sin él la fila blanda no la certifica nadie' },
  { lema: 'русский', tema: 'duro', desinenciaTonica: false, glosa: 'ruso',
    nota: 'русский 519 · русского 397 · русским 204 · русская 355. ⚠ NO ES UNA TERCERA CLASE: es la fila dura con la regla velar, que escribe -ый como -ий y -ым como -им. Y la /o/ NO alterna, porque к no es sibilante: русского, русском, русской, igual que новый. *русскый 0' },
  { lema: 'хороший', tema: 'duro', desinenciaTonica: false, glosa: 'bueno',
    nota: 'хороший 649 · хорошего 415 · хорошим 141 · хорошем 89 · хорошей 125 · хорошее 342. Sibilante con la desinencia ÁTONA: activa LAS DOS reglas, la de la ы (-ий, -им) y la de la /o/ átona (-его, -ему, -ем, -ей, -ее). *хорошый 0 · *хорошой 0 · *хорошом 0' },
  { lema: 'большой', tema: 'duro', desinenciaTonica: true, glosa: 'grande',
    nota: '⚠ EL PAR QUE PRUEBA QUE EL ACENTO ES DATO DE LA LENGUA. Mismo tema sibilante que хороший, misma clase, y se diferencian SÓLO en `desinenciaTonica` — de donde salen ocho casillas distintas: большого 368 / хорошего 415, большому 94 / хорошему 37, большом 264 / хорошем 89, большой 1684 / хорошей 125, большое 478 / хорошее 342. Con uno solo de los dos, una regla que dijera «sibilante ⇒ siempre -его» o «⇒ siempre -ого» acertaría en todo el lexicón. *большый 0',
    lecturaRival: { '*': '⚠ LEÍDO EL 2026-09-12, y la lectura es de LOS DOS LEMAS y no de una casilla, por eso va en la clave `*`: las DOCE casillas de большой con rival vivo (большего 54, большем 15, большей 156, большему 6, большее 59) tienen todas el mismo rival, y ese rival es el COMPARATIVO DECLINADO `бо́льший` «mayor», que es otra palabra con su propio paradigma. Leídas las apariciones una a una con `--ctx`, no hay ni una del positivo большой en caso oblicuo: «в большей чести», «с большей силой», «ещё большей помпы», «большее удовольствие», «самое большее, лет сорок». Es el homógrafo de otro lema, la salida (b) del criterio, y contar no lo separa — sólo leerlo. Escribir esta lectura doce veces, una por casilla, sería la regla copiada que falla en la copia N+1 que nadie añadió' } },
];

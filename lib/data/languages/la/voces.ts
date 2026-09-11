// lib/data/languages/la/voces.ts — LAS VOCES DEL LATÍN, con su sello.
//
// Validadas el **2026-09-10 por el oído de Edu**, escuchando las cinco leer
// la misma batería de esdrújulas en respelización eclesiástica:
//
//   «dominus illuminatsio mea et salus mea · filium suum unigenitum dedit ·
//    discipulus non est super magistrum · agricola in agro laborat et
//    puerum vocat»
//
// La pregunta que contestaban —la única que decide para el latín— era si
// realizan el acento esdrújulo (DÓ-mi-nus, FÍ-li-um, dis-CÍ-pu-lum,
// a-GRÍ-co-la) o lo aplanan. Veredicto: **las cinco valen**, y por eso las
// cinco quedan, no una.
//
// ── POR QUÉ ESTE SELLO ES EL MÁS FUERTE DEL PROYECTO ─────────────────
//
// Es la primera voz no portuguesa validada por un oído humano. El rumano
// se selló con ASR + un agente que no oye, y se dijo así. Aquí hay un oído,
// y por eso el sello no lleva las cautelas de aquél. La que sí lleva, y hay
// que escribirla: **Edu no es hablante nativo de italiano**, así que lo
// validado es que el acento latino cae donde debe, no la calidad del acento
// italiano de cada voz.
//
// ── LO QUE ESTO CORRIGE ──────────────────────────────────────────────
//
// El relevo del latín (§5.bis) dejó la voz como el único bloqueo del audio,
// después de que la primera sonda usara una voz **británica** creyéndola
// italiana: «verificada para italiano» dice que el modelo puede leer
// italiano con esa voz, **no que la voz suene italiana**. Lo descartó el
// oído de Edu, no el código.
//
// Y dejó abierta una sospecha que la medición de hoy DESACTIVA: se temía
// que el acento napolitano de Rita estropeara la lectura eclesiástica
// —que se pronuncia a la italiana romana—. Escuchada al lado de cuatro
// estándar, no estorba. La sospecha era razonable y era falsa; queda
// escrita porque la próxima lengua traerá una igual.
//
// ── CINCO VOCES NO SON CINCO CORPUS (decisión de Edu, 2026-09-10) ────
//
// **Cada texto se sintetiza UNA sola vez, con la voz que le toca por su
// papel.** Las cinco están para que el curso suene a curso y no a una sola
// persona leyendo mil frases: narración corrida con la de cabecera, la
// segunda voz cuando un ejercicio tiene dos interlocutores, y alternancia
// para que la escucha no se fatigue.
//
// Lo que NO se hace: generar el mismo texto con las cinco. La aritmética lo
// deja claro — el latín pide 12.000 palabras de lectura de L1 más los clips
// de ejercicio; multiplicarlo por cinco serían cinco veces la cuota y cinco
// ficheros para un mismo texto, que es exactamente la avería de las dos
// eras de MP3 del portugués (5.451 ficheros para 2.576 referencias).
//
// Ninguna de las cinco está guardada en la cuenta: se usan por su id
// directamente desde la biblioteca pública, que responde HTTP 200 en
// `/v1/text-to-speech/{id}`. Así no se llena la cuenta (49 voces ya) ni se
// depende de un «añadir» que otro puede deshacer.

export type PapelVoz = 'narrador' | 'alternancia' | 'diálogo';

export interface VozLatina {
  id: string;
  nombre: string;
  /** Etiqueta de la biblioteca, tal cual: el acento es un DATO, no un adorno. */
  acento: string;
  genero: 'f' | 'm';
  /** Clonaciones en la biblioteca al 2026-09-10: cuánto la ha probado el mundo. */
  usos: number;
  papel: PapelVoz;
  /** Lo que hay que saber al elegirla. */
  nota?: string;
}

export const SELLO_VOZ_LA = {
  validatedBy: 'oído de Edu (usuario del curso; no nativo italiano)',
  validatedAt: '2026-09-10',
  bateria: 'esdrújulas latinas en respelización eclesiástica: dominus · filium · discipulus · agricola',
  /** Qué NO certifica. Un sello responde a UNA pregunta. */
  noCertifica: 'la calidad del acento italiano de cada voz, ni la pronunciación de ningún fonema que la batería no contuviera',
} as const;

export const VOCES_LA: VozLatina[] = [
  { id: 'W71zT1VwIFFx3mMGH2uZ', nombre: 'ElevenLabs_MarcoTrox', acento: 'it-standard', genero: 'm', usos: 483_626, papel: 'narrador',
    nota: 'La de cabecera: la lectura litúrgica del latín es mayoritariamente masculina, y es la más probada de las cinco por un orden de magnitud.' },
  { id: 'RXoaSpLaWTEckJgPUBG3', nombre: 'ElevenLabs_Tiziana', acento: 'it-standard', genero: 'f', usos: 32_300, papel: 'alternancia',
    nota: '«Smart, Balanced and Credible»: la femenina más neutra para explicación y lección.' },
  { id: 'uV2Bhcm1HwmAqPqkbjfl', nombre: 'ElevenLabs_Sara', acento: 'it-standard', genero: 'f', usos: 29_073, papel: 'diálogo',
    nota: 'Joven y clara: la segunda voz cuando un ejercicio necesita dos interlocutores.' },
  { id: 'fQmr8dTaOQq116mo2X7F', nombre: 'ElevenLabs_Samanta', acento: 'it-standard', genero: 'f', usos: 37_760, papel: 'alternancia',
    nota: 'Grave y pausada: para lectura corrida larga, donde la fatiga de escucha importa.' },
  { id: 'jlhiuC3oLEP3JDAx1ECk', nombre: 'ElevenLabs_Rita', acento: 'it-neapolitan', genero: 'f', usos: 1_521, papel: 'diálogo',
    nota: 'NAPOLITANA y susurrante. Aprobada a oído igual que las otras cuatro, pero es la única que no es estándar: si algún día una lectura suena rara, mirar aquí primero.' },
];

/** La voz por defecto del latín. `EL_VOICES.la` tiene que apuntar a ésta:
 *  lo comprueba un test, porque el mismo dato en dos ficheros se
 *  desincroniza solo. Cambiarla es una línea, y es reversible. */
export const VOZ_LA_PRINCIPAL = VOCES_LA[0]!;

export const vozLaPorNombre = (n: string): VozLatina | undefined => VOCES_LA.find((v) => v.nombre === n);

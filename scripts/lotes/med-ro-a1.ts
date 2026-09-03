// scripts/lotes/med-ro-a1.ts — EL QUINTO LOTE RUMANO: mediación industrial, A1-A2.
//
//   npx tsx scripts/lotes/med-ro-a1.ts            # gates + tabla
//
// 24 ítems, las dos familias de la máquina de PT, portadas tal cual (Paso
// 0 §4: «se porta»): la rúbrica se DERIVA de lo declarado y un gate
// comprueba que el modelo cumple su propia rúbrica casilla a casilla.
//   · REGISTRO (16): r10-registro-tramite (8) y r10-diminutivo-atenuador
//     (8), en las DOS direcciones cada uno — el punto es una ELECCIÓN.
//     Fuente y modelo en rumano; marcadores que tienen que desaparecer y
//     datos que tienen que sobrevivir.
//   · EXPLICAR (8): r10-poftim (4) y r10-tratamiento (4): la fuente se
//     queda, y el alumno EXPLICA en español a quien no lo entiende.
// Y lo propio del rumano: ortografía DOOM3 y Hunspell sobre fuente y
// modelo rumanos (el modelo de EXPLICAR es español y no se pasa).
import { verificar as verificarRegistro, rubricaDe as rubricaRegistro, type ItemMed } from './lote12-mediacion';
import { verificar as verificarExplicar, rubricaDe as rubricaExplicar, type ItemExplica } from '../lib/explicar-mediacion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';

const TRAM = 'r10-registro-tramite';
const DIM = 'r10-diminutivo-atenuador';
const POF = 'r10-poftim';
const TRAT = 'r10-tratamiento';

/** La lengua de fuente y modelo es rumano: el tipo de PT sólo conoce
 *  pt/es, así que se declara aparte y el publicador la escribe. */
export const LENGUA = 'ro';

export const REGISTRO: ItemMed[] = [
  // ── r10-registro-tramite · coloquial → formal (4) ────────────────
  { id: 'MEDRO-001', concepto: TRAM, registroFuente: 'coloquial', registroDestino: 'formal',
    sourceText: 'Salut! Vreau să-mi schimb buletinul, că a expirat luni. Ai vreun formular? Mersi, pa!',
    audience: 'la funcionaria de la primărie, a la que el alumno no conoce',
    instruccion: 'Reescribe el mensaje para decírselo a la funcionaria de la ventanilla: mismo asunto, mismos datos, registro formal.',
    marcadores: [['Salut', 'Bună ziua'], ['Vreau', 'Aș dori', 'Aș vrea'], ['Ai vreun', 'Aveți', 'aveți un'], ['Mersi', 'Mulțumesc', 'Vă mulțumesc'], ['pa', 'La revedere', 'O zi bună']],
    datos: [['buletinul', 'buletin'], ['a expirat luni', 'expirat luni']],
    modelo: 'Bună ziua! Aș dori să-mi schimb buletinul, pentru că a expirat luni. Aveți un formular, vă rog? Vă mulțumesc, la revedere!',
    wordRange: [15, 30], register: 'formal', address: 'dumneavoastră' },
  { id: 'MEDRO-002', concepto: TRAM, registroFuente: 'coloquial', registroDestino: 'formal',
    sourceText: 'Salutare! Dă-mi și mie o rețetă pentru pastilele de tensiune, mi s-au terminat ieri. Tu ești doctorul de familie, nu?',
    audience: 'el médico de familia, un señor mayor',
    instruccion: 'Reescribe la petición para el médico de familia: formal, con el tratamiento que le corresponde, sin perder ningún dato.',
    // El saludo de la v0 era «Bună!», que NO se puede gatear por ausencia:
    // el destino («Bună ziua») contiene la palabra del marcador. Se cambia
    // el saludo de la FUENTE, no se pierde la casilla: «Salutare» está en
    // DEX '09 y DOOM3 sin marca regional.
    marcadores: [['Salutare', 'Bună ziua'], ['Dă-mi', 'Vă rog să-mi dați', 'Ați putea să-mi dați', 'Aș avea nevoie de'], ['Tu ești', 'Dumneavoastră sunteți', 'sunteți']],
    datos: [['pastilele de tensiune', 'pastile', 'tensiune'], ['s-au terminat ieri', 'terminat ieri']],
    modelo: 'Bună ziua, domnule doctor! Aș avea nevoie de o rețetă pentru pastilele de tensiune, pentru că mi s-au terminat ieri. Dumneavoastră sunteți medicul meu de familie, nu-i așa?',
    wordRange: [18, 35], register: 'formal', address: 'dumneavoastră' },
  { id: 'MEDRO-003', concepto: TRAM, registroFuente: 'coloquial', registroDestino: 'formal',
    sourceText: 'Hei, am o problemă cu apartamentul: nu merge caloriferul de trei zile. Vino să te uiți, ok? Sunt la etajul doi.',
    audience: 'el administrador del bloque, por escrito',
    instruccion: 'Convierte el mensaje en una nota escrita al administrador: formal, misma queja, mismos datos.',
    marcadores: [['Hei', 'Bună ziua', 'Stimate domnule administrator'], ['Vino să te uiți', 'Vă rog să veniți', 'vă rog să verificați', 'v-aș ruga să'], ['ok', 'vă rog', 'dacă se poate']],
    datos: [['caloriferul', 'calorifer'], ['trei zile'], ['etajul doi']],
    modelo: 'Bună ziua, domnule administrator. Am o problemă în apartament: caloriferul nu funcționează de trei zile. V-aș ruga să veniți să verificați, dacă se poate. Locuiesc la etajul doi.',
    wordRange: [18, 35], register: 'formal', address: 'dumneavoastră' },
  { id: 'MEDRO-004', concepto: TRAM, registroFuente: 'coloquial', registroDestino: 'formal',
    sourceText: 'Salut, îmi trebuie o adeverință că lucrez aici, pentru bancă. O poți face până mâine? Mersi mult.',
    audience: 'la responsable de recursos humanos, por correo',
    instruccion: 'Reescribe la petición como correo a recursos humanos: formal, con el mismo plazo y el mismo motivo.',
    marcadores: [['Salut', 'Bună ziua', 'Stimată doamnă'], ['îmi trebuie', 'aș avea nevoie de', 'v-aș ruga să-mi eliberați'], ['O poți face', 'Ar fi posibil', 'ați putea'], ['Mersi mult', 'Vă mulțumesc', 'Cu stimă']],
    datos: [['adeverință'], ['pentru bancă', 'bancă'], ['până mâine', 'mâine']],
    modelo: 'Stimată doamnă, v-aș ruga să-mi eliberați o adeverință de salariat, pentru bancă. Ar fi posibil să o primesc până mâine? Vă mulțumesc frumos. Cu stimă.',
    wordRange: [18, 35], register: 'formal', address: 'dumneavoastră' },
  // ── r10-registro-tramite · formal → coloquial (4) ────────────────
  { id: 'MEDRO-005', concepto: TRAM, registroFuente: 'formal', registroDestino: 'coloquial',
    sourceText: 'Bună ziua. Aș dori să rezerv o masă pentru două persoane, sâmbătă, la ora opt. Vă mulțumesc anticipat.',
    audience: 'un amigo que trabaja en el restaurante y con quien el alumno se tutea',
    instruccion: 'Pásale el mismo encargo a tu amigo por mensaje, en tono coloquial, sin perder ningún dato.',
    marcadores: [['Bună ziua', 'Salut', 'Hei', 'Bună'], ['Aș dori', 'Vreau', 'Îmi ții'], ['Vă mulțumesc anticipat', 'Mersi', 'Merci', 'Mulțam']],
    datos: [['două persoane', '2 persoane'], ['sâmbătă'], ['ora opt', 'la opt']],
    modelo: 'Salut! Îmi ții o masă de două persoane sâmbătă, la opt? Mersi mult!',
    wordRange: [8, 20], register: 'coloquial', address: 'tu' },
  { id: 'MEDRO-006', concepto: TRAM, registroFuente: 'formal', registroDestino: 'coloquial',
    sourceText: 'Stimate domnule Ionescu, vă informăm că pachetul dumneavoastră a ajuns la oficiul poștal și poate fi ridicat în termen de zece zile.',
    audience: 'tu compañero de piso, Ionescu, que no ha leído el aviso',
    instruccion: 'Dile a tu compañero, de palabra y en coloquial, lo que dice el aviso: el dato del plazo tiene que llegar.',
    marcadores: [['Stimate domnule Ionescu', 'Hei', 'Auzi'], ['vă informăm că', '', 'știi că'], ['dumneavoastră', 'tău', 'al tău'], ['poate fi ridicat în termen de', 'ai … zile să-l iei', 'îl poți lua în', '']],
    datos: [['pachetul', 'pachet', 'coletul'], ['oficiul poștal', 'poștă'], ['zece zile']],
    modelo: 'Auzi, a ajuns pachetul tău la poștă. Ai zece zile să-l iei, nu uita!',
    wordRange: [8, 20], register: 'coloquial', address: 'tu' },
  { id: 'MEDRO-007', concepto: TRAM, registroFuente: 'formal', registroDestino: 'coloquial',
    sourceText: 'Vă rugăm să prezentați cartea de identitate și dovada plății la ghișeul numărul trei, între orele nouă și douăsprezece.',
    audience: 'tu hermana pequeña, que va a hacer el trámite por primera vez',
    instruccion: 'Explícale a tu hermana, en coloquial, qué tiene que llevar, adónde y cuándo.',
    marcadores: [['Vă rugăm să prezentați', 'Ia-ți', 'Du-te cu', 'trebuie să ai'], ['cartea de identitate', 'buletinul'], ['dovada plății', 'chitanța']],
    datos: [['ghișeul numărul trei', 'ghișeul trei'], ['nouă și douăsprezece', 'nouă', 'douăsprezece']],
    modelo: 'Ia-ți buletinul și chitanța și du-te la ghișeul trei, între nouă și douăsprezece. E simplu.',
    wordRange: [10, 22], register: 'coloquial', address: 'tu' },
  { id: 'MEDRO-008', concepto: TRAM, registroFuente: 'formal', registroDestino: 'coloquial',
    sourceText: 'Doamnă profesoară, vă rog să mă scuzați pentru absența de ieri: am fost la medic. Vă mulțumesc pentru înțelegere.',
    audience: 'un compañero de clase que te pregunta por qué faltaste',
    instruccion: 'Cuéntale a tu compañero lo mismo, en coloquial y de tú.',
    marcadores: [['Doamnă profesoară', 'Măi', 'Frate', 'Auzi'], ['vă rog să mă scuzați pentru absența', 'n-am venit', 'am lipsit', 'nu am fost'], ['Vă mulțumesc pentru înțelegere', 'Mersi că întrebi', 'Asta e', 'Ce să fac']],
    datos: [['ieri'], ['la medic', 'medic', 'doctor']],
    modelo: 'Auzi, n-am venit ieri pentru că am fost la medic. Asta e, mersi că întrebi!',
    wordRange: [8, 20], register: 'coloquial', address: 'tu' },
  // ── r10-diminutivo-atenuador · brusco → atenuado (4) ─────────────
  { id: 'MEDRO-009', concepto: DIM, registroFuente: 'directo', registroDestino: 'atenuado',
    sourceText: 'Dă-mi o cafea și un pahar cu apă. Repede, că am treabă.',
    audience: 'la camarera de la cafetería de siempre, con la que el alumno quiere quedar bien',
    instruccion: 'Pide lo mismo, pero suavizado como lo haría un rumano amable: con diminutivos, y la prisa dicha de forma cortés.',
    marcadores: [['Dă-mi', 'Îmi dați', 'Mi-ați da', 'Vă rog'], ['o cafea', 'o cafeluță'], ['un pahar cu apă', 'un păhărel cu apă', 'o apă'], ['Repede, că am treabă', 'când aveți un moment', 'când puteți', 'un pic mai repede, dacă se poate']],
    datos: [['cafea', 'cafeluță'], ['apă']],
    modelo: 'Îmi dați, vă rog, o cafeluță și un păhărel cu apă? Când aveți un moment, că mă cam grăbesc.',
    wordRange: [10, 22], register: 'coloquial-cortés', address: 'dumneavoastră' },
  { id: 'MEDRO-010', concepto: DIM, registroFuente: 'directo', registroDestino: 'atenuado',
    sourceText: 'Așteaptă cinci minute. Vin acum.',
    audience: 'un cliente que espera en la tienda donde trabaja el alumno',
    instruccion: 'Di lo mismo al cliente, atenuado y cortés, como se dice en una tienda rumana.',
    marcadores: [['Așteaptă', 'Așteptați', 'Aveți puțină răbdare', 'Un moment'], ['cinci minute', 'cinci minuțele', 'un pic', 'o clipă'], ['Vin acum', 'vin imediat', 'revin imediat']],
    datos: [['cinci']],
    modelo: 'Aveți puțină răbdare, vă rog, cinci minuțele. Revin imediat!',
    wordRange: [6, 16], register: 'coloquial-cortés', address: 'dumneavoastră' },
  { id: 'MEDRO-011', concepto: DIM, registroFuente: 'directo', registroDestino: 'atenuado',
    sourceText: 'Mai stai. Bea un vin și mănâncă o prăjitură.',
    audience: 'doamna Maria, la vecina mayor que ha venido de visita y quiere irse',
    instruccion: 'Insiste con cariño, como un anfitrión rumano: la misma invitación, con diminutivos.',
    marcadores: [['Mai stai', 'Mai stați puțin', 'Mai stați un pic', 'Nu plecați încă'], ['un vin', 'un vinișor', 'un păhărel de vin'], ['o prăjitură', 'o prăjiturică']],
    datos: [['vin', 'vinișor'], ['prăjitură', 'prăjiturică']],
    modelo: 'Mai stați un pic, doamna Maria! Luați un păhărel de vin și o prăjiturică, vă rog.',
    wordRange: [8, 20], register: 'coloquial-cortés', address: 'dumneavoastră' },
  { id: 'MEDRO-012', concepto: DIM, registroFuente: 'directo', registroDestino: 'atenuado',
    sourceText: 'Am o întrebare. Ai două minute?',
    audience: 'tu jefa, que está ocupada',
    instruccion: 'Pídele el mismo momento a tu jefa, atenuado: diminutivo y tratamiento formal.',
    marcadores: [['Ai', 'Aveți', 'Ați avea'], ['două minute', 'două minuțele', 'un minuțel', 'un pic de timp'], ['Am o întrebare', 'Aș avea o mică întrebare', 'o întrebare mică', 'ceva să vă întreb']],
    datos: [['întrebare', 'ceva să vă întreb']],
    modelo: 'Aș avea o mică întrebare, dacă nu vă deranjez. Ați avea două minuțele?',
    wordRange: [8, 18], register: 'formal-cortés', address: 'dumneavoastră' },
  // ── r10-diminutivo-atenuador · atenuado → directo (4) ────────────
  // La dirección contraria: quitar los diminutivos y decirlo llano, para
  // que el punto sea una ELECCIÓN y no una regla («siempre diminutivo»).
  { id: 'MEDRO-013', concepto: DIM, registroFuente: 'atenuado', registroDestino: 'directo',
    sourceText: 'Îmi dați și mie o mămăliguță și o pâinică, vă rog frumos?',
    audience: 'tu hermano, al que le pides que te ponga la comida',
    instruccion: 'Dile lo mismo a tu hermano, directo y en familia, sin diminutivos.',
    marcadores: [['Îmi dați', 'Dă-mi', 'Pune-mi'], ['o mămăliguță', 'o mămăligă', 'mămăligă'], ['o pâinică', 'o pâine', 'pâine'], ['vă rog frumos', 'te rog', 'hai']],
    datos: [['mămăliguță', 'mămăligă'], ['pâinică', 'pâine']],
    modelo: 'Pune-mi și mie mămăligă și pâine, te rog.',
    wordRange: [5, 14], register: 'coloquial', address: 'tu' },
  { id: 'MEDRO-014', concepto: DIM, registroFuente: 'atenuado', registroDestino: 'directo',
    sourceText: 'Așteptați un minuțel, vă rog, verific imediat în calculator.',
    audience: 'tu compañero de trabajo, con quien hablas sin protocolo',
    instruccion: 'Di lo mismo a tu compañero: directo, sin diminutivo ni fórmula.',
    marcadores: [['Așteptați', 'Așteaptă', 'Stai'], ['un minuțel', 'un minut', 'puțin'], ['vă rog', '']],
    datos: [['calculator']],
    modelo: 'Stai un minut, verific imediat în calculator.',
    wordRange: [5, 14], register: 'coloquial', address: 'tu' },
  { id: 'MEDRO-015', concepto: DIM, registroFuente: 'atenuado', registroDestino: 'directo',
    sourceText: 'Aș vrea o cafeluță și un pic de lapte, dacă se poate.',
    audience: 'el camarero, que tiene diez personas detrás y quiere el pedido en una línea',
    instruccion: 'Formula el pedido de forma directa, con los sustantivos sin diminutivo.',
    marcadores: [['Aș vrea', 'Vreau', 'O cafea'], ['o cafeluță', 'o cafea', 'cafea'], ['un pic de lapte', 'lapte', 'cu lapte'], ['dacă se poate', '']],
    datos: [['cafeluță', 'cafea'], ['lapte']],
    modelo: 'O cafea cu lapte.',
    wordRange: [3, 10], register: 'neutro', address: 'tu' },
  { id: 'MEDRO-016', concepto: DIM, registroFuente: 'atenuado', registroDestino: 'directo',
    sourceText: 'Mai stați puțintel, luați o prăjiturică și un vinuț bun!',
    audience: 'tu mejor amigo, en tu casa',
    instruccion: 'Ofrécele lo mismo a tu amigo, sin diminutivos y de tú.',
    marcadores: [['Mai stați puțintel', 'Mai stai', 'Stai'], ['o prăjiturică', 'o prăjitură'], ['un vinuț', 'un vin']],
    datos: [['prăjiturică', 'prăjitură'], ['vinuț', 'vin']],
    modelo: 'Mai stai, ia o prăjitură și un vin bun!',
    wordRange: [5, 14], register: 'coloquial', address: 'tu' },
];

export const EXPLICAR: ItemExplica[] = [
  { id: 'MEDRO-017', concepto: POF, lenguaExplicacion: 'es',
    sourceText: '— Îmi dați o pâine, vă rog? — Poftim. — Mulțumesc. — Cu plăcere.',
    audience: 'un amigo hispanohablante que acaba de llegar y cree que «poftim» significa «por favor»',
    instruccion: 'Explícale qué hace «poftim» en este intercambio y por qué no es «por favor».',
    puntosClave: [
      { dice: 'Aquí «poftim» acompaña la entrega: es «tenga / aquí tiene».', ancla: ['tenga', 'aquí tiene', 'toma', 'entrega'] },
      { dice: '«Por favor» en rumano es «vă rog», que sí está en la fuente.', ancla: ['vă rog'] },
      { dice: 'Poftim es una palabra multiusos: entrega, «¿cómo dice?», invitación a pasar o servirse.', ancla: ['¿cómo', 'pase', 'sírvase', 'varios', 'multiusos', 'según'] },
    ],
    modelo: 'En este diálogo «poftim» no es «por favor»: lo dice la vendedora al ENTREGAR el pan, así que vale «tenga» o «aquí tiene». El «por favor» de verdad es «vă rog», que ya está en la pregunta. Poftim es una palabra multiusos: sirve para entregar algo, para decir «¿cómo dice?» cuando no has oído, y para invitar a pasar o a servirse.',
    wordRange: [50, 90], register: 'neutro' },
  { id: 'MEDRO-018', concepto: POF, lenguaExplicacion: 'es',
    sourceText: '— Domnule, biletul dumneavoastră? — Poftim? — Biletul, vă rog. — A, poftim.',
    audience: 'tu madre, que no entiende por qué el pasajero dice dos veces la misma palabra',
    instruccion: 'Explícale los DOS valores de «poftim» en este diálogo del autobús.',
    puntosClave: [
      { dice: 'El primer «poftim?», con entonación de pregunta, es «¿cómo dice? / ¿perdón?».', ancla: ['¿cómo', 'perdón', 'no ha oído', 'no oyó', 'repita'] },
      { dice: 'El segundo «poftim» acompaña la entrega del billete: «aquí tiene».', ancla: ['aquí tiene', 'tenga', 'entrega', 'le da'] },
      { dice: 'La entonación distingue los dos usos.', ancla: ['entonación', 'tono', 'pregunta'] },
    ],
    modelo: 'Son dos usos distintos de la misma palabra. El primer «poftim?», con tono de pregunta, es «¿cómo dice?»: el pasajero no ha oído bien al revisor. El segundo, ya sin tono de pregunta, acompaña el gesto de entregar el billete: «aquí tiene». Lo que cambia es la entonación, y por eso en rumano una sola palabra hace las dos cosas.',
    wordRange: [45, 85], register: 'neutro' },
  { id: 'MEDRO-019', concepto: POF, lenguaExplicacion: 'es',
    sourceText: '— Bună ziua, am venit la domnul Popescu. — Poftiți, vă așteaptă în birou.',
    audience: 'una compañera que pregunta si «poftiți» es el plural de «poftim»',
    instruccion: 'Explica qué significa «poftiți» aquí y qué relación tiene con «poftim».',
    puntosClave: [
      { dice: 'Aquí «poftiți» es una invitación a pasar: «pase, adelante».', ancla: ['pase', 'adelante', 'entre', 'invita'] },
      { dice: 'Poftiți es la 2.ª persona del plural, la que va con «dumneavoastră»: el plural es de cortesía, no de cantidad.', ancla: ['segunda persona del plural', 'cortesía', 'dumneavoastră'] },
      { dice: 'Viene del verbo «a pofti» (invitar, desear), y por eso sirve para ofrecer e invitar.', ancla: ['a pofti', 'invitar', 'verbo'] },
    ],
    modelo: 'Aquí «poftiți» no entrega nada: invita a pasar, «adelante, pase». Es la segunda persona del plural de «a pofti», la que se usa con «dumneavoastră»: el plural es de cortesía, no de cantidad. Las dos vienen del verbo «a pofti», que significa invitar o desear, y por eso la palabra sirve tanto para ofrecer algo como para hacer pasar a alguien.',
    wordRange: [45, 85], register: 'neutro' },
  { id: 'MEDRO-020', concepto: POF, lenguaExplicacion: 'es',
    sourceText: '— Mai vreți puțină ciorbă? — Nu, mulțumesc. — Poftim, poftim, că e bună! — Bine, un pic.',
    audience: 'un amigo que cree que la anfitriona se está enfadando',
    instruccion: 'Explica qué hace «poftim, poftim» en esta escena de mesa y por qué no es un enfado.',
    puntosClave: [
      { dice: 'Es una insistencia amable para que el invitado se sirva: «venga, sírvase».', ancla: ['sírvase', 'sirva', 'venga', 'insiste', 'insistencia', 'anima'] },
      { dice: 'Repetirlo refuerza la hospitalidad, no la irritación.', ancla: ['hospitalidad', 'cariño', 'cortesía', 'amable'] },
      { dice: 'Rechazar una vez y aceptar «un pic» es el ritual esperado en una mesa rumana.', ancla: ['ritual', 'esperado', 'normal', 'costumbre'] },
    ],
    modelo: 'No hay enfado. «Poftim, poftim» es la anfitriona animando al invitado a servirse: «venga, sírvase, que está buena». Repetirlo es cortesía y hospitalidad, no irritación. Y la escena entera es un ritual normal en una mesa rumana: se rechaza una vez por educación y luego se acepta «un pic», un poquito.',
    wordRange: [45, 85], register: 'neutro' },
  { id: 'MEDRO-021', concepto: TRAT, lenguaExplicacion: 'es',
    sourceText: '— Bună ziua, doamna Ionescu, ce mai faceți? — Bine, mulțumesc. Dar tu, Andrei, ce faci?',
    audience: 'un hispanohablante que se extraña de que ella lo tutee y él no',
    instruccion: 'Explica por qué el tratamiento es asimétrico en este saludo y qué marca cada forma.',
    puntosClave: [
      { dice: 'Andrei usa «dumneavoastră» (faceți, en plural) con la señora mayor: respeto por edad y distancia.', ancla: ['faceți', 'dumneavoastră', 'plural', 'respeto'] },
      { dice: 'Ella lo tutea («tu, ce faci») porque es joven y lo conoce: la asimetría es normal.', ancla: ['tutea', 'tú', 'faci', 'asimetr', 'normal'] },
      { dice: 'El tratamiento nominal «doamna Ionescu» (señora + apellido) acompaña al dumneavoastră.', ancla: ['doamna', 'apellido', 'señora'] },
    ],
    modelo: 'Es una asimetría normal en rumano. Andrei le habla de «dumneavoastră» a la señora Ionescu, y por eso el verbo va en plural: «ce mai faceți». Marca respeto por la edad y la distancia, y lo acompaña «doamna» con el apellido. Ella, mayor y que lo conoce, lo tutea: «tu, ce faci». Que una parte tutee y la otra no es lo esperado, no una descortesía.',
    wordRange: [50, 95], register: 'neutro' },
  { id: 'MEDRO-022', concepto: TRAT, lenguaExplicacion: 'es',
    sourceText: '— Domnule doctor, mă doare capul de două zile. — Luați o pastilă seara și veniți joi la control.',
    audience: 'una compañera que quiere saber por qué no se dice «domnule Popescu» al médico',
    instruccion: 'Explica el tratamiento nominal «domnule doctor» y la forma verbal que lo acompaña.',
    puntosClave: [
      { dice: '«Domnule + cargo» (doctor, profesor) es el tratamiento cortés rumano; el apellido no hace falta.', ancla: ['cargo', 'profesión', 'doctor', 'apellido'] },
      { dice: '«Domnule» es un vocativo: la forma para dirigirse a alguien.', ancla: ['vocativo', 'dirigirse', 'llamar'] },
      { dice: 'El médico responde con dumneavoastră: «luați», «veniți», verbos en plural.', ancla: ['luați', 'veniți', 'plural', 'dumneavoastră'] },
    ],
    modelo: 'En rumano se trata al médico por su cargo, no por su apellido: «domnule doctor», y lo mismo con «domnule profesor». «Domnule» es un vocativo, la forma que toma «domn» para dirigirse a alguien. Y el médico contesta también con dumneavoastră: por eso dice «luați» y «veniți», verbos en plural aunque hable con una sola persona.',
    wordRange: [50, 95], register: 'neutro' },
  { id: 'MEDRO-023', concepto: TRAT, lenguaExplicacion: 'es',
    sourceText: '— Nea Vasile, dumneata știi unde e gara? — Știu, băiete, e drept înainte.',
    audience: 'un alumno que sólo conoce «tu» y «dumneavoastră» y no sabe qué es «dumneata»',
    instruccion: 'Explica qué grado de tratamiento es «dumneata» y con qué persona verbal va.',
    puntosClave: [
      { dice: '«Dumneata» está entre «tu» y «dumneavoastră»: respeto familiar, con mayores conocidos o en el pueblo.', ancla: ['entre', 'intermedio', 'familiar', 'pueblo', 'mayores'] },
      { dice: 'Rige 2.ª persona del SINGULAR: «dumneata știi», no «știți».', ancla: ['singular', 'știi'] },
      { dice: '«Nea» (de nene) + nombre es el tratamiento popular para un hombre mayor conocido.', ancla: ['nea', 'nene', 'popular'] },
    ],
    modelo: '«Dumneata» es un grado intermedio: más respeto que «tu», menos distancia que «dumneavoastră». Se usa con mayores conocidos, en el pueblo o en el barrio. Y ojo con el verbo: va en segunda persona del singular, «dumneata știi», no «știți». «Nea Vasile» es el tratamiento popular para un hombre mayor conocido: «nea» viene de «nene», tío.',
    wordRange: [50, 95], register: 'neutro' },
  { id: 'MEDRO-024', concepto: TRAT, lenguaExplicacion: 'es',
    sourceText: '— Scuzați-mă, dumneavoastră sunteți doamna Popescu? — Da, eu sunt. — Aveți un colet.',
    audience: 'un amigo que traduce «dumneavoastră sunteți» como «ustedes son» y cree que hay varias personas',
    instruccion: 'Explica por qué el verbo va en plural aunque se hable con una sola señora.',
    puntosClave: [
      { dice: '«Dumneavoastră» va siempre con 2.ª del PLURAL (sunteți, aveți), aunque sea una sola persona.', ancla: ['plural', 'sunteți', 'aveți', 'una sola'] },
      { dice: 'Es como el «vous» francés: el plural es de cortesía, no de número.', ancla: ['cortesía', 'vous', 'no de número'] },
      { dice: 'El «eu sunt» de la respuesta confirma que es una persona.', ancla: ['eu sunt', 'una persona', 'singular'] },
    ],
    modelo: 'Sólo hay una señora. «Dumneavoastră» se construye siempre con la segunda persona del plural —«sunteți», «aveți»— aunque hable con una sola persona: es un plural de cortesía, no de número, como el «vous» francés. Ella misma lo confirma al responder en singular, «eu sunt». Traducirlo como «ustedes son» es leer el plural del verbo como si contara personas.',
    wordRange: [50, 95], register: 'neutro' },
];

/** Formas que Hunspell `ro_RO` no tiene y que están atestadas en otra
 *  fuente. Regla del proyecto, pagada con `doctorule`: Hunspell es gate
 *  LÉXICO, no morfológico — lo que rechaza se LEE, y si está atestado se
 *  EXIME con su fuente escrita; nunca se cambia la palabra por comodidad
 *  del gate. Las cuatro que rechazó este lote se leyeron una a una y el
 *  reparto NO fue simétrico: dos están atestadas y se eximen aquí; las
 *  otras dos (`supică`, `ceaiuț`) no aparecen en DEX, MDA2, DLR ni DOOM3
 *  —`ceaiuț` además tiene forma rival lexicalizada, `ceiuț`, «At: DICȚ.»—
 *  y por eso ésas SÍ se cambiaron: no por el gate, por falta de fuente. */
const EXENCIONES_HUNSPELL: Record<string, string> = {
  minuțel: "DLR, s. n. «(Rar) Diminutiv al lui minut», cita Caragiale O. VI, 80 («un minuțel»); MDA2 (2010): minut + suf. -el",
  minuțele: 'DLR, plural declarado de «minuțel» («Pl.: minuțele»); neutro, de ahí el numeral femenino «două/cinci minuțele» (GALR, doble concordancia del neutro)',
};

export function verificar(): string[] {
  const v = [...verificarRegistro(REGISTRO), ...verificarExplicar(EXPLICAR)];
  const palabras: string[] = [];
  for (const x of REGISTRO) {
    for (const [c, t] of [['fuente', x.sourceText], ['modelo', x.modelo]] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${x.id}: ortografía en ${c}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.sourceText, x.modelo]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));
  }
  for (const x of EXPLICAR) {
    for (const h of revisarOrtografiaRo(x.sourceText)) v.push(`${x.id}: ortografía en fuente: «${h.palabra}» (${h.clase})`);
    palabras.push(...x.sourceText.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));
  }
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w))))
    if (!EXENCIONES_HUNSPELL[w]) v.push(`hunspell no reconoce «${w}» en fuente o modelo rumano`);
  return v;
}

if (process.argv[1]?.includes('med-ro-a1')) {
  const v = verificar();
  console.log(`# Mediación RO-A1 — ${REGISTRO.length} registro + ${EXPLICAR.length} explicar\n`);
  for (const x of REGISTRO) console.log(`- ${x.id} ${x.concepto} ${x.registroFuente}→${x.registroDestino}: ${x.modelo}`);
  for (const x of EXPLICAR) console.log(`- ${x.id} ${x.concepto}: ${x.modelo.slice(0, 80)}…`);
  console.log(`\n## Rúbrica derivada (${REGISTRO[0]!.id})\n`); for (const c of rubricaRegistro(REGISTRO[0]!)) console.log(`- [ ] ${c}`);
  console.log(`\n## Rúbrica derivada (${EXPLICAR[0]!.id})\n`); for (const c of rubricaExplicar(EXPLICAR[0]!)) console.log(`- [ ] ${c}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

// lib/data/languages/ro/lexicon-a1.ts — EL LEXICÓN A1 CON RASGOS.
//
// Es el input del paradigma (`scripts/lib/paradigma-ro.ts`) y, más
// adelante, del SRS: lema + lo que NO se puede derivar (plural, 1.ª/3.ª sg
// del presente, participio irregular, vocativo y su registro). Todo lo
// demás lo calcula el paradigma, y el gate `check-paradigma-ro.ts` pasa
// cada forma —guardada o derivada— por Hunspell como segundo camino.
//
// Reglas de esta lista:
//   · sólo lemas del núcleo A1 del currículo (l. 494: identidad, familia,
//     números, hora, comida, casa, piață, transporte, cuerpo, tiempo);
//   · el género NEUTRO se declara con la prueba un…/două… y se marca:
//     tren, scaun, oraș, telefon, birou son de los primeros 200;
//   · `registro` es OBLIGATORIO cuando hay vocativo marcado. Criterio del
//     lingüista (2026-09-01): -ule PRIMARIA en oficios y tratamientos
//     (doctorule, profesorule, studentule, domnule), -e primaria en
//     parentesco y trato personal (băiete, copile, bărbate, vecine,
//     prietene). Los de oficio son bruscos dirigidos a la persona: la forma
//     cortés es nominal (domnule doctor);
//   · el vocativo se rellenó con la tabla del Paso 0 §12 (dexonline lema a
//     lema); donde la página no lo atestó, no se declara;
//   · un verbo se guarda por su infinitivo CON partícula, nunca por una
//     forma finita: «*a lucrez» no existe.
import type { LemaNominal, LemaVerbal } from '@/scripts/lib/paradigma-ro';

export const SUSTANTIVOS_A1: LemaNominal[] = [
  // personas y familia
  { lema: 'om', genero: 'm', plural: 'oameni', vocSg: 'omule', registro: 'familiar', dim: 'omuleț', dimPlural: 'omuleți', dimFuente: "DEX '09 s.v. omuleț «diminutiv al lui om»; DOOM3 omuleț, pl. omuleți", gloss: 'hombre, persona' },
  { lema: 'domn', genero: 'm', plural: 'domni', vocSg: 'domnule', registro: 'neutru', gloss: 'señor' },
  { lema: 'doamnă', genero: 'f', plural: 'doamne', vocSg: null, gloss: 'señora' },
  { lema: 'băiat', genero: 'm', plural: 'băieți', vocSg: 'băiete', vocAlt: ['băiatule'], registro: 'familiar', gloss: 'chico' },
  { lema: 'fată', genero: 'f', plural: 'fete', vocSg: 'fato', registro: 'brusc', dim: 'fetiță', dimPlural: 'fetițe', dimFuente: "DEX '09 s.v. fetiță «diminutiv al lui fată»; DOOM3 fetiță, g.-d. art. fetiței, pl. fetițe", gloss: 'chica' },
  { lema: 'prieten', genero: 'm', plural: 'prieteni', vocSg: 'prietene', registro: 'neutru', gloss: 'amigo' },
  { lema: 'frate', genero: 'm', plural: 'frați', vocSg: null, gloss: 'hermano' },
  { lema: 'soră', genero: 'f', plural: 'surori', vocSg: 'soro', vocAlt: ['soră'], registro: 'familiar', gloss: 'hermana' },
  { lema: 'mamă', genero: 'f', plural: 'mame', vocSg: 'mamo', registro: 'familiar', gloss: 'madre' },
  { lema: 'tată', genero: 'm', plural: 'tați', vocSg: null, gdAlt: ['tatii', 'tatei'], gloss: 'padre' },
  { lema: 'copil', genero: 'm', plural: 'copii', vocSg: 'copile', vocAlt: ['copilule'], registro: 'familiar', dim: 'copilaș', dimPlural: 'copilași', dimFuente: "DEX '09 s.v. copilaș «diminutiv al lui copil1» (copil + suf. -aș); DOOM3 copilaș, pl. copilași", gloss: 'niño' },
  { lema: 'femeie', genero: 'f', plural: 'femei', vocSg: null, gloss: 'mujer' },
  { lema: 'bărbat', genero: 'm', plural: 'bărbați', vocSg: 'bărbate', vocAlt: ['bărbatule'], registro: 'familiar', gloss: 'hombre, varón' },
  { lema: 'student', genero: 'm', plural: 'studenți', vocSg: 'studentule', vocAlt: ['studente'], registro: 'brusc', gloss: 'estudiante' },
  { lema: 'profesor', genero: 'm', plural: 'profesori', vocSg: 'profesorule', vocAlt: ['profesore'], registro: 'brusc', gloss: 'profesor' },
  { lema: 'doctor', genero: 'm', plural: 'doctori', vocSg: 'doctorule', vocAlt: ['doctore'], registro: 'brusc', gloss: 'médico' },
  { lema: 'vecin', genero: 'm', plural: 'vecini', vocSg: 'vecine', vocAlt: ['vecinule'], registro: 'familiar', gloss: 'vecino' },
  { lema: 'bunic', genero: 'm', plural: 'bunici', vocSg: 'bunicule', registro: 'familiar', gloss: 'abuelo' },
  { lema: 'nume', genero: 'n', plural: 'nume', gloss: 'nombre' },
  // casa y ciudad
  { lema: 'casă', genero: 'f', plural: 'case', dim: 'căsuță', dimPlural: 'căsuțe', dimFuente: "DEX '09 s.v. căsuță «diminutiv al lui casă (1)»; DOOM3 căsuță, g.-d. art. căsuței, pl. căsuțe", gloss: 'casa' },
  { lema: 'masă', genero: 'f', plural: 'mese', dim: 'măsuță', dimPlural: 'măsuțe', dimFuente: "DEX '09 s.v. măsuță «diminutiv al lui masă2»; DOOM3 măsuță, g.-d. art. măsuței, pl. măsuțe", gloss: 'mesa; comida' },
  { lema: 'scaun', genero: 'n', plural: 'scaune', gloss: 'silla' },
  { lema: 'ușă', genero: 'f', plural: 'uși', gloss: 'puerta' },
  { lema: 'poartă', genero: 'f', plural: 'porți', gloss: 'portón' },
  { lema: 'fereastră', genero: 'f', plural: 'ferestre', gloss: 'ventana' },
  { lema: 'oraș', genero: 'n', plural: 'orașe', gloss: 'ciudad' },
  { lema: 'stradă', genero: 'f', plural: 'străzi', gloss: 'calle' },
  { lema: 'magazin', genero: 'n', plural: 'magazine', gloss: 'tienda' },
  { lema: 'piață', genero: 'f', plural: 'piețe', gloss: 'mercado, plaza' },
  { lema: 'birou', genero: 'n', plural: 'birouri', gloss: 'oficina, escritorio' },
  { lema: 'școală', genero: 'f', plural: 'școli', gloss: 'escuela' },
  { lema: 'țară', genero: 'f', plural: 'țări', gloss: 'país' },
  { lema: 'loc', genero: 'n', plural: 'locuri', gloss: 'lugar' },
  { lema: 'lucru', genero: 'n', plural: 'lucruri', gloss: 'cosa; trabajo' },
  // transporte
  { lema: 'tren', genero: 'n', plural: 'trenuri', gloss: 'tren' },
  { lema: 'autobuz', genero: 'n', plural: 'autobuze', gloss: 'autobús' },
  { lema: 'metrou', genero: 'n', plural: 'metrouri', gloss: 'metro' },
  { lema: 'mașină', genero: 'f', plural: 'mașini', gloss: 'coche' },
  // comida y bebida
  { lema: 'pâine', genero: 'f', plural: 'pâini', gloss: 'pan' },
  { lema: 'apă', genero: 'f', plural: 'ape', gloss: 'agua' },
  { lema: 'cafea', genero: 'f', plural: 'cafele', dim: 'cafeluță', dimPlural: 'cafeluțe', dimFuente: "DEX '09 s.v. cafeluță (Fam.) «diminutiv al lui cafea (2)»; DOOM3 cafeluță, g.-d. art. cafeluței, pl. cafeluțe", gloss: 'café' },
  { lema: 'măr', genero: 'n', plural: 'mere', gloss: 'manzana' },
  // tiempo
  { lema: 'zi', genero: 'f', plural: 'zile', gloss: 'día' },
  { lema: 'noapte', genero: 'f', plural: 'nopți', gloss: 'noche' },
  { lema: 'seară', genero: 'f', plural: 'seri', gloss: 'tarde-noche' },
  { lema: 'dimineață', genero: 'f', plural: 'dimineți', gloss: 'mañana' },
  { lema: 'an', genero: 'm', plural: 'ani', gloss: 'año' },
  { lema: 'lună', genero: 'f', plural: 'luni', gloss: 'mes; luna' },
  { lema: 'săptămână', genero: 'f', plural: 'săptămâni', gloss: 'semana' },
  { lema: 'oră', genero: 'f', plural: 'ore', gloss: 'hora' },
  { lema: 'timp', genero: 'n', plural: 'timpuri', gloss: 'tiempo' },
  // varios
  { lema: 'carte', genero: 'f', plural: 'cărți', dim: 'cărticică', dimPlural: 'cărticele', dimFuente: "DEX '09 s.v. CĂRTICEA, -ICĂ, pl. cărticele; DOOM3 cărticică, g.-d. art. cărticelei, pl. cărticele", gloss: 'libro' },
  { lema: 'cuvânt', genero: 'n', plural: 'cuvinte', gloss: 'palabra' },
  { lema: 'limbă', genero: 'f', plural: 'limbi', gloss: 'lengua' },
  { lema: 'lege', genero: 'f', plural: 'legi', gloss: 'ley' },
  { lema: 'telefon', genero: 'n', plural: 'telefoane', gloss: 'teléfono' },
  { lema: 'floare', genero: 'f', plural: 'flori', dim: 'floricică', dimPlural: 'floricele', dimFuente: "DEX '09 s.v. FLORICEA, -ICĂ, pl. floricele; DOOM3 !floricică, g.-d. art. floricelei, pl. floricele", gloss: 'flor' },
  { lema: 'leu', genero: 'm', plural: 'lei', gloss: 'leu (moneda)' },
  { lema: 'ban', genero: 'm', plural: 'bani', gloss: 'moneda; dinero (pl.)' },
  { lema: 'câine', genero: 'm', plural: 'câini', gloss: 'perro' },
  { lema: 'pisică', genero: 'f', plural: 'pisici', gloss: 'gato' },
  { lema: 'brad', genero: 'm', plural: 'brazi', gloss: 'abeto' },
  { lema: 'urs', genero: 'm', plural: 'urși', gloss: 'oso' },
  { lema: 'sac', genero: 'm', plural: 'saci', gloss: 'saco' },
  { lema: 'familie', genero: 'f', plural: 'familii', gloss: 'familia' },
];

export const VERBOS_A1: LemaVerbal[] = [
  // enteramente irregulares
  { inf: 'a fi', sg1: 'sunt', sg3: 'este', participio: 'fost', irregular: { eu: 'sunt', tu: 'ești', el: 'este', noi: 'suntem', voi: 'sunteți', ei: 'sunt' }, gloss: 'ser, estar' },
  { inf: 'a avea', sg1: 'am', sg3: 'are', participio: 'avut', impf: 'aveam', irregular: { eu: 'am', tu: 'ai', el: 'are', noi: 'avem', voi: 'aveți', ei: 'au' }, gloss: 'tener; haber' },
  { inf: 'a vrea', sg1: 'vreau', sg3: 'vrea', participio: 'vrut', impf: 'voiam', irregular: { eu: 'vreau', tu: 'vrei', el: 'vrea', noi: 'vrem', voi: 'vreți', ei: 'vor' }, gloss: 'querer' },
  { inf: 'a da', sg1: 'dau', sg3: 'dă', participio: 'dat', impf: 'dădeam', irregular: { eu: 'dau', tu: 'dai', el: 'dă', noi: 'dăm', voi: 'dați', ei: 'dau' }, gloss: 'dar' },
  { inf: 'a sta', sg1: 'stau', sg3: 'stă', participio: 'stat', impf: 'stăteam', irregular: { eu: 'stau', tu: 'stai', el: 'stă', noi: 'stăm', voi: 'stați', ei: 'stau' }, gloss: 'estar (de pie), quedarse' },
  { inf: 'a lua', sg1: 'iau', sg3: 'ia', participio: 'luat', impf: 'luam', irregular: { eu: 'iau', tu: 'iei', el: 'ia', noi: 'luăm', voi: 'luați', ei: 'iau' }, gloss: 'tomar, coger' },
  { inf: 'a bea', sg1: 'beau', sg3: 'bea', participio: 'băut', impf: 'beam', irregular: { eu: 'beau', tu: 'bei', el: 'bea', noi: 'bem', voi: 'beți', ei: 'beau' }, gloss: 'beber' },
  { inf: 'a trebui', sg1: 'trebuie', sg3: 'trebuie', participio: 'trebuit', invariable: true, gloss: 'deber, hacer falta' },
  // 1.ª conjugación (-a)
  { inf: 'a cânta', sg1: 'cânt', sg3: 'cântă', gloss: 'cantar' },
  { inf: 'a lucra', sg1: 'lucrez', sg3: 'lucrează', gloss: 'trabajar' },
  { inf: 'a pleca', sg1: 'plec', sg3: 'pleacă', gloss: 'irse, salir' },
  { inf: 'a intra', sg1: 'intru', sg3: 'intră', gloss: 'entrar' },
  { inf: 'a mânca', sg1: 'mănânc', sg3: 'mănâncă', gloss: 'comer' },
  { inf: 'a termina', sg1: 'termin', sg3: 'termină', gloss: 'terminar' },
  { inf: 'a învăța', sg1: 'învăț', sg3: 'învață', sg2: 'înveți', gloss: 'aprender, enseñar' },
  { inf: 'a lăsa', sg1: 'las', sg3: 'lasă', gloss: 'dejar' },
  { inf: 'a cumpăra', sg1: 'cumpăr', sg3: 'cumpără', sg2: 'cumperi', gloss: 'comprar' },
  { inf: 'a aștepta', sg1: 'aștept', sg3: 'așteaptă', gloss: 'esperar' },
  { inf: 'a vizita', sg1: 'vizitez', sg3: 'vizitează', gloss: 'visitar' },
  { inf: 'a dansa', sg1: 'dansez', sg3: 'dansează', gloss: 'bailar' },
  { inf: 'a desena', sg1: 'desenez', sg3: 'desenează', gloss: 'dibujar' },
  { inf: 'a fuma', sg1: 'fumez', sg3: 'fumează', gloss: 'fumar' },
  // 2.ª conjugación (-ea)
  { inf: 'a vedea', sg1: 'văd', sg3: 'vede', sg2: 'vezi', participio: 'văzut', gloss: 'ver' },
  { inf: 'a putea', sg1: 'pot', sg3: 'poate', participio: 'putut', gloss: 'poder' },
  // 3.ª conjugación (-e): participio siempre guardado
  { inf: 'a merge', sg1: 'merg', sg3: 'merge', participio: 'mers', gloss: 'ir' },
  { inf: 'a face', sg1: 'fac', sg3: 'face', participio: 'făcut', impf: 'făceam', gloss: 'hacer' },
  { inf: 'a spune', sg1: 'spun', sg3: 'spune', sg2: 'spui', participio: 'spus', gloss: 'decir' },
  { inf: 'a zice', sg1: 'zic', sg3: 'zice', participio: 'zis', gloss: 'decir' },
  { inf: 'a scrie', sg1: 'scriu', sg3: 'scrie', participio: 'scris', gloss: 'escribir' },
  { inf: 'a pune', sg1: 'pun', sg3: 'pune', sg2: 'pui', participio: 'pus', gloss: 'poner' },
  { inf: 'a începe', sg1: 'încep', sg3: 'începe', participio: 'început', gloss: 'empezar' },
  // 4.ª conjugación (-i, -î)
  { inf: 'a citi', sg1: 'citesc', sg3: 'citește', gloss: 'leer' },
  { inf: 'a vorbi', sg1: 'vorbesc', sg3: 'vorbește', gloss: 'hablar' },
  { inf: 'a dormi', sg1: 'dorm', sg3: 'doarme', gloss: 'dormir' },
  { inf: 'a veni', sg1: 'vin', sg3: 'vine', sg2: 'vii', gloss: 'venir' },
  { inf: 'a ști', sg1: 'știu', sg3: 'știe', participio: 'știut', gloss: 'saber' },
  { inf: 'a iubi', sg1: 'iubesc', sg3: 'iubește', gloss: 'amar' },
  { inf: 'a găti', sg1: 'gătesc', sg3: 'gătește', gloss: 'cocinar' },
  { inf: 'a plăti', sg1: 'plătesc', sg3: 'plătește', gloss: 'pagar' },
  { inf: 'a locui', sg1: 'locuiesc', sg3: 'locuiește', gloss: 'vivir (residir)' },
  { inf: 'a coborî', sg1: 'cobor', sg3: 'coboară', gloss: 'bajar' },
  { inf: 'a hotărî', sg1: 'hotărăsc', sg3: 'hotărăște', gloss: 'decidir' },
];

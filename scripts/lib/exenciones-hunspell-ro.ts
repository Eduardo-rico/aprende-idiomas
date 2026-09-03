// scripts/lib/exenciones-hunspell-ro.ts — LAS FORMAS QUE HUNSPELL RECHAZA
// Y ESTÁN ATESTADAS, en UN solo sitio.
//
// Hunspell `ro_RO` es gate LÉXICO, no morfológico: lo que rechaza se LEE,
// y si está atestado se EXIME con su fuente escrita — nunca se cambia la
// palabra por comodidad del gate. La regla se pagó con `doctorule` y se
// volvió a pagar con `supică`/`ceaiuț`, que NO estaban atestados y sí se
// cambiaron.
//
// Vive aquí porque ya estaba escrita DOS veces —en `check-paradigma-ro.ts`
// y en `lotes/med-ro-a1.ts`— y el lote 10 destapó que faltaba una tercera
// copia en el gate de los cloze: `doctorule` pasaba el gate del paradigma
// y lo rechazaba el del lote. Una regla copiada se desincroniza, y ésta ya
// iba por la copia N+1.
export const EXENCIONES_RO: Record<string, string> = {
  // Vocativos en -ule sobre nombres de profesión: dexonline los flexiona,
  // Hunspell no los tiene. Comprobados lema a lema (§12 del Paso 0).
  doctorule: 'dexonline, paradigma de «doctor» (2026-09-01)',
  profesorule: 'dexonline, paradigma de «profesor»',
  studentule: 'dexonline, paradigma de «student»',
  fato: "DEX '09, nota de «fată» (pop.); currículo l. 538",
  mamo: 'GALR, vocativo femenino en -o; el lingüista lo listó',
  // Diminutivos atestados que Hunspell no trae (lote 5).
  minuțel: "DLR, s. n. «(Rar) Diminutiv al lui minut», cita Caragiale O. VI, 80; MDA2: minut + suf. -el",
  minuțele: 'DLR, plural declarado de «minuțel»; neutro, de ahí «două/cinci minuțele» (GALR)',
};

export const exenta = (w: string) => Object.hasOwn(EXENCIONES_RO, w);

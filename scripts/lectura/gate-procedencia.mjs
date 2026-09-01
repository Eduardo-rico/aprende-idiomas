// El gate de procedencia y la construcción de párrafos, en UN solo sitio.
//
// Lo extrajo la Ola E3 de `generar-texto.mjs` cuando la ingesta por
// tandas necesitó el mismo gate: dos copias del gate son dos gates, y
// el segundo siempre se relaja. `generar-texto.mjs` sigue siendo la
// puerta de una pieza suelta; `ingesta-gutenberg.mjs` la de una obra
// entera — las dos entran por aquí.
//
// GATE DE PROCEDENCIA (plan maestro, Ola L), con dos vías:
// - dominio público: título, autor, año de muerte, URL de fuente, nivel;
// - original del curso (`original: true`): título, autor, nivel, y la
//   constancia de revisión adversarial (revisadoPor + fechaRevision).
// Sin los campos de su vía, no se escribe nada.

/** Campos obligatorios según la vía declarada. */
export function camposObligatorios(meta) {
  return meta.original === true
    ? ['titulo', 'autor', 'nivel', 'revisadoPor', 'fechaRevision']
    : ['titulo', 'autor', 'muerteAutor', 'fuenteUrl', 'nivel'];
}

/** Lanza si falta cualquier campo de la vía. No negocia. */
export function verificarProcedencia(meta) {
  for (const campo of camposObligatorios(meta)) {
    if (!meta[campo]) throw new Error(`meta sin «${campo}» — el gate de procedencia no negocia.`);
  }
}

/** Aritmética de dominio público, no suposición (regla de Edu).
 *  UE vida+70 · MX vida+100 · US 95 años desde la publicación.
 *  Devuelve las tres fechas de entrada al dominio público y si YA está
 *  libre en las tres jurisdicciones al año dado. */
export function dominioPublico(muerteAutor, anioPublicacion, hoy = new Date().getFullYear()) {
  const ue = muerteAutor + 71;      // libre desde el 1-I del año 71 tras la muerte
  const mx = muerteAutor + 101;
  const us = anioPublicacion ? anioPublicacion + 96 : null;
  const libre = hoy >= ue && hoy >= mx && (us === null || hoy >= us);
  return { ue, mx, us, libre };
}

/** Párrafos: bloques separados por línea en blanco, con los cortes duros
 *  de ~70 columnas de Gutenberg desenrollados. EXCEPTO cuando el meta
 *  declara `versos: true` (poesía): ahí el salto de línea interno es
 *  forma, no accidente, y se conserva. */
export function construirParrafos(texto, meta) {
  return texto
    .replace(/\r\n/g, '\n')   // Gutenberg viene en CRLF (gotcha ya pagado)
    .split(/\n\s*\n/)
    .map((p) => (meta.versos === true
      ? p.split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
      : p.replace(/\s*\n\s*/g, ' ').trim()))
    .filter((p) => p.length > 0)
    .map((texto) => ({ texto }));
}

export function contarPalabras(parrafos) {
  return parrafos.reduce((a, p) => a + p.texto.split(/\s+/).filter(Boolean).length, 0);
}

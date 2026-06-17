// lib/data/languages/ru/fallback-dictionary.ts
// Phase 5 (multi-idioma): scaffold vacío para ruso. El dynamic loader
// en `lib/data/loaders.ts` no hace `import` de este módulo para RU/RO/CS
// (solo para PT); retorna `{}` directamente. El archivo existe por
// simetría y para que un futuro `generate-fallback-dict.ts` tenga
// destino.
export const FALLBACK_DICTIONARY: Record<string, string> = {};

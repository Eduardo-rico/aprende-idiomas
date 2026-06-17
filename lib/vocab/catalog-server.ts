// lib/vocab/catalog-server.ts
// Phase 2 (multi-idioma): el catalog se carga por idioma. El consumidor
// (server component o API route) llama `loadVocabCatalog(lang)` y
// opcionalmente `initCatalog(items, lang)` para inicializar el cache
// in-memory del cliente.
//
// El cache está keyed por `lang` para que el mismo client (cambiando
// de idioma via NavBar) no mezcle vocab entre PT y RU.
import { loadVocabCatalog as loadVocabCatalogFromLoaders } from "@/lib/data/loaders";
import type { LanguageId } from "@/lib/locales";
import type { VocabCatalogItem } from "./catalog-types";

export async function loadVocabCatalog(lang: LanguageId): Promise<VocabCatalogItem[]> {
  const items = await loadVocabCatalogFromLoaders(lang);
  return items as VocabCatalogItem[];
}

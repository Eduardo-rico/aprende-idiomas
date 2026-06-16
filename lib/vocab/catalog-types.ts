// lib/vocab/catalog-types.ts
// Type-only module — safe to import from client components. The actual
// catalog data is loaded by the server component and passed as props.

export type VocabCatalogItem = {
  word: string;
  ptWord?: string;
  meaning: string;
  audioHash: { br: string; pt: string };
  conceptIds: string[];
  storyIds: string[];
};

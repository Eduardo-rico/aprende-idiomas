// lib/data/variant.ts
// A `VariantKey` identifies a per-language variant of an exercise, story,
// or audio file. It's a free string (no enum) so adding a new dialect
// (e.g. "pt-ao" for Angolan PT, "ru-ua" for Ukrainian Russian) is a
// data change, not a schema change.
//
// The original schema used `Variant = "br" | "pt"` for the two PT
// dialects. That type is preserved as an alias of `VariantKey` in
// `lib/db/schema.ts` so existing callers compile. The translation
// `"br" → "pt-br"`, `"pt" → "pt-pt"` is centralized in
// `legacyVariantToKey()` so the migration is explicit, not magic.
export type VariantKey = string;

/** Default variant for new content. PT-BR is the most common dialect
 *  and matches the current default. */
export const DEFAULT_VARIANT: VariantKey = "pt-br";

/** Type guard. Empty strings and whitespace are not valid. */
export function isVariantKey(s: string): s is VariantKey {
  return s.length > 0 && s.trim().length === s.length;
}

/** The two legacy keys used before Phase 1, mapped to their new form.
 *  Anything else passes through (already a new key, or unknown). */
export function legacyVariantToKey(v: string): VariantKey {
  if (v === "br") return "pt-br";
  if (v === "pt") return "pt-pt";
  return v;
}

/** Adapter: normalize the legacy `ptOverrides` field to the new
 *  `variantOverrides` shape (a record keyed by VariantKey). Used in
 *  the Zod preprocessor so existing PT-only data continues to parse
 *  without a content rewrite.
 *
 *  - If `variantOverrides` is present and non-empty, prefer it.
 *  - Else if `ptOverrides` is present, wrap it under `"pt-br"` (the
 *    canonical default variant) so the rest of the schema sees a
 *    uniform shape.
 *  - Else return an empty record.
 */
export function ptOverridesToVariantOverrides(input: {
  ptOverrides?: unknown;
  variantOverrides?: unknown;
}): Record<VariantKey, unknown> {
  if (
    input.variantOverrides &&
    typeof input.variantOverrides === "object" &&
    !Array.isArray(input.variantOverrides) &&
    Object.keys(input.variantOverrides as object).length > 0
  ) {
    return input.variantOverrides as Record<VariantKey, unknown>;
  }
  if (input.ptOverrides !== undefined && input.ptOverrides !== null) {
    return { "pt-br": input.ptOverrides };
  }
  return {};
}

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

/** Default variant for new users/settings. European Portuguese: the
 *  user's goal is Portugal, and PT-PT is the harder listening target —
 *  training on it makes PT-BR comprehension nearly free, not vice versa.
 *  (Base *content* remains PT-BR with pt-pt overrides; this only sets
 *  which variant the UI and voices default to.) */
export const DEFAULT_VARIANT: VariantKey = "pt-pt";

/** Type guard. Empty strings and whitespace are not valid. */
export function isVariantKey(s: string): s is VariantKey {
  return s.length > 0 && s.trim().length === s.length;
}

/** Historias y `ex.audio` guardan sus variantes bajo las claves CORTAS
 *  `br` / `pt`; los ajustes del usuario y el resto de la app usan las
 *  largas `pt-br` / `pt-pt`. Esa asimetría rompía dos sitios a la vez:
 *
 *  - `app/[lang]/(story)/stories/[id]/page.tsx` leía `variants["pt-br"]`
 *    con un `!` no nulo sobre un objeto cuyas claves son `["br","pt"]`,
 *    así que lanzaba un TypeError en el Server Component y **las 20
 *    historias eran inalcanzables**.
 *  - `components/stories/StoryReader.tsx` hacía lo mismo con `?.`, así
 *    que no reventaba: simplemente no mostraba texto nunca.
 *
 *  Una sola función para que no vuelva a divergir. */
export function shortVariantKey(variant: VariantKey): "br" | "pt" {
  return variant === "pt-br" || variant === "br" ? "br" : "pt";
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
    return { "pt-pt": input.ptOverrides };
  }
  return {};
}

/** Minimal cn: joins truthy class strings with spaces. */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ── E2#18 · las reglas que cazan un literal que se contradice ────
  //
  // `no-dupe-keys` NO estaba activa: `eslint-config-next` no trae
  // `eslint:recommended`. Se comprobó en rojo con un literal duplicado
  // real y ESLint no dijo nada.
  //
  // MATIZ IMPORTANTE, porque lo conté mal en E2#17: **TypeScript SÍ lo
  // caza** (TS1117, verificado reintroduciendo el duplicado de `pôr` en
  // `paradigma-pt.ts`). El bug no se coló por falta de herramienta sino
  // porque introduje y corregí la clave sin correr `tsc` en medio. La
  // regla se activa igual, porque salta en el editor y en `npm run lint`
  // —antes y más barato que el typecheck—, no porque tsc no llegara.
  {
    rules: {
      'no-dupe-keys': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-unsafe-finally': 'error',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

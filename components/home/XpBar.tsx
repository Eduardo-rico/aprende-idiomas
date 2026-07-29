// components/home/XpBar.tsx
// Barra de XP de la portada.
//
// Ola 2 (2026-07-28): esta barra decía «Nivel C2».
//
// La etiqueta salía de `levelFromXp()`, que repartía los seis niveles del
// MCER a 500 XP por escalón: se llegaba a «C2» antes de terminar el Bloque
// 3, sin haber producido una sola frase. No era una medida de competencia
// sino una barra de progreso con nombres prestados — y era, además, la
// única cifra de nivel que la app enseñaba.
//
// El nivel ahora vive en `lib/data/cefr.ts` y se mide por descriptores
// can-do DEMOSTRADOS con evidencia, tomando el mínimo de las destrezas.
// Aquí queda sólo lo que el XP sí puede decir con honestidad: cuánto has
// trabajado. Que no es lo mismo que cuánto sabes, y por eso ya no se
// disfraza de nivel.
interface Props {
  /** XP ganado dentro del tramo actual. */
  current: number;
  /** XP para completar el tramo. */
  nextLevel: number;
  /** XP acumulado total. */
  totalXp: number;
}

export function XpBar({ current, nextLevel, totalXp }: Props) {
  const pct = Math.min(Math.max(current / Math.max(nextLevel, 1), 0), 1) * 100;
  const remaining = Math.max(0, nextLevel - current);
  return (
    <div className="mb-12">
      <div className="text-sm text-ink-muted mb-2 flex justify-between">
        <span>{totalXp.toLocaleString("es")} XP de trabajo</span>
        <span>siguiente tramo en {remaining} XP</span>
      </div>
      <div className="h-2 bg-rule rounded-full overflow-hidden">
        <div
          className="h-full bg-lesson rounded-full transition-[width] duration-300 ease-[var(--ease)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

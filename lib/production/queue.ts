// lib/production/queue.ts
// Cola diferida para respuestas de producción libre.
// Usa db.telemetry como almacenamiento de cola local (revisión diferida 24h).
// No requiere backend — las entradas quedan en IndexedDB hasta que el usuario
// las revise o el sistema las procese.

import { db } from "@/lib/db/schema";

export interface ProductionEntry {
  topic: string;
  text: string;
  wordCount: number;
  variant: "pt-br" | "pt-pt";
  blockId: number;
}

/** Encola una respuesta de producción para revisión diferida (~24h). */
export async function enqueueProduction(entry: ProductionEntry): Promise<void> {
  await db.telemetry.add({
    ts: new Date(),
    level: "warn",
    source: "production-queue",
    message: "pending_review",
    context: {
      topic: entry.topic,
      text: entry.text,
      wordCount: entry.wordCount,
      variant: entry.variant,
      blockId: entry.blockId,
      submittedAt: new Date().toISOString(),
    },
  });
}

/** Devuelve todas las entradas de producción pendientes. */
export async function getPendingProduction(): Promise<
  Array<{ id: number; ts: Date; entry: ProductionEntry & { submittedAt: string } }>
> {
  const rows = await db.telemetry
    .where("[level+ts]")
    .between(["warn", new Date(0)], ["warn", new Date()])
    .filter((r) => r.source === "production-queue")
    .toArray();
  return rows
    .filter((r) => r.id !== undefined)
    .map((r) => ({
      id: r.id!,
      ts: r.ts,
      entry: r.context as ProductionEntry & { submittedAt: string },
    }));
}

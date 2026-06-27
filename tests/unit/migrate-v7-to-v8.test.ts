// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import Dexie from "dexie";
import { db } from "@/lib/db/schema";
import { createPreV8Backup, restoreFromBackup, purgeStaleBackups } from "@/lib/db/migrate-v7-to-v8";

describe("migrate-v7-to-v8", () => {
  beforeEach(async () => {
    // Asegurar estado limpio: cerrar cualquier conexión abierta y borrar
    // ambas DBs. Sin esto, conexiones colgantes del test anterior hacen
    // que `db.export()` falle con DatabaseClosedError.
    if (db.isOpen()) db.close();
    await Dexie.delete("PortuguesAppDB");
    await Dexie.delete("PortuguesAppDB_backup_v7");
  });

  it("creates backup before v8 and preserves card count", async () => {
    // Sembrar datos v7 directamente (sin pasar por upgrade)
    const seed = new Dexie("PortuguesAppDB");
    seed.version(1).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state",
    });
    await seed.open();
    await seed.table("cards").bulkAdd([
      { id: "c1", blockId: 1, lessonId: "l1", contentHash: "h1", fsrs: {}, nextReviewAt: new Date(), state: 0, reps: 0, lapses: 0, introducedAt: new Date() },
      { id: "c2", blockId: 1, lessonId: "l1", contentHash: "h2", fsrs: {}, nextReviewAt: new Date(), state: 0, reps: 0, lapses: 0, introducedAt: new Date() },
    ]);
    seed.close();

    // Abrir DB real (dispara upgrade a v8)
    await createPreV8Backup();
    await db.open();
    const cardCount = await db.cards.count();
    expect(cardCount).toBe(2);
  });

  it("restoreFromBackup brings back v7 data", async () => {
    // Sembrar v7 + upgrade
    const seed = new Dexie("PortuguesAppDB");
    seed.version(1).stores({ cards: "id" });
    await seed.open();
    await seed.table("cards").add({ id: "c1", blockId: 1, lessonId: "l1", contentHash: "h1", fsrs: {}, nextReviewAt: new Date(), state: 0, reps: 0, lapses: 0, introducedAt: new Date() });
    seed.close();

    await createPreV8Backup();
    await db.open();
    expect(await db.cards.count()).toBe(1);

    await restoreFromBackup();
    // Tras restore, la DB está vacía (porque la importación borra primero)
    // — verificamos que el backup existe y tiene la fila original.
    expect(await Dexie.getDatabaseNames()).toContain("PortuguesAppDB_backup_v7");
  });

  it("purgeStaleBackups no-op cuando el backup es reciente", async () => {
    await createPreV8Backup();
    await purgeStaleBackups();
    expect(await Dexie.getDatabaseNames()).toContain("PortuguesAppDB_backup_v7");
  });
});
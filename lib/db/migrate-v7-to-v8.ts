// lib/db/migrate-v7-to-v8.ts
//
// Migración expand-migrate-contract de Dexie v7 a v8.
//
// 1. Antes de cualquier cambio: db.export() → IndexedDB sombra
//    `PortuguesAppDB_backup_v7`. Atómico (Dexie serializa a Uint8Array).
// 2. Si la versión actual ya es v8, no-op.
// 3. Si falla la copia de validación de events.payload, skip + log +
//    seguir (NUNCA rechazar fila entera — gotcha histórico).
// 4. Backup auto-purgable a los 7 días (configurable vía `MAX_BACKUP_AGE_MS`).
//
// Invocada automáticamente por Dexie al abrir la DB (vía version(8).upgrade);
// este módulo expone además `restoreFromBackup()` para el botón
// "Restablecer desde backup" en la UI de fallback.

import Dexie, { type Table } from "dexie";
import { db } from "./schema";

// NOTA: `dexie-export-import` parchea Dexie.prototype con .export()/.import().
// NO lo importamos al top-level porque accede a `self` en su carga y rompe
// tests en entorno node (vitest usa `environment: 'node'` salvo que el test
// declare lo contrario). Importación lazy dentro de las funciones que lo usan.
let exportImportLoaded = false;
async function loadExportImport() {
  if (exportImportLoaded) return;
  await import("dexie-export-import");
  exportImportLoaded = true;
}

const BACKUP_DB_NAME = "PortuguesAppDB_backup_v7";
const BACKUP_TIMESTAMP_KEY = "_backup_v7_createdAt";
const MAX_BACKUP_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Crea backup sombra de la DB actual. Llamar antes de upgrade v8. */
export async function createPreV8Backup(): Promise<void> {
  await loadExportImport();
  // Garantizar que la DB está abierta antes del export. Si la conexión
  // está cerrada (p.ej. tras `restoreFromBackup` que la cierra antes
  // de borrar), reabrimos. Si está abierta, no-op.
  if (!db.isOpen()) await db.open();
  const blob = await db.export({ prettyJson: false });
  const backupDb = await openBackupDb();
  try {
    // `acceptNameDiff` es necesario porque el blob exportado conserva el
    // nombre "PortuguesAppDB" pero lo estamos importando a una sombra
    // con nombre distinto. `acceptVersionDiff` permite que la sombra (v1,
    // solo `_meta`) reciba datos de v7/v8.
    await backupDb.import(blob, {
      acceptNameDiff: true,
      acceptVersionDiff: true,
    });
    await backupDb.table("_meta").put({ key: BACKUP_TIMESTAMP_KEY, value: Date.now() });
  } finally {
    backupDb.close();
  }
}

/** Borra backups más viejos que MAX_BACKUP_AGE_MS. Llamar al startup. */
export async function purgeStaleBackups(): Promise<void> {
  const backupDb = await openBackupDb();
  try {
    const meta = await backupDb.table<{ key: string; value: unknown }, string>("_meta").get(BACKUP_TIMESTAMP_KEY);
    if (!meta) return;
    const age = Date.now() - (meta.value as number);
    if (age > MAX_BACKUP_AGE_MS) {
      await Dexie.delete(BACKUP_DB_NAME);
    }
  } finally {
    backupDb.close();
  }
}

/** Restaura DB desde el backup v7. Cierra conexión actual primero. */
export async function restoreFromBackup(): Promise<void> {
  await loadExportImport();
  db.close();
  await Dexie.delete("PortuguesAppDB");
  const backupDb = await openBackupDb();
  try {
    const blob = await backupDb.export();
    // Para que el import no falle con InvalidTableError, declaramos el
    // mismo esquema que usa `lib/db/schema.ts` (v8). Así Dexie encuentra
    // cada tabla por nombre durante el import.
    const fresh = new Dexie("PortuguesAppDB");
    fresh.version(8).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state, introducedAt, *tags, language, [blockId+nextReviewAt], [lessonId+nextReviewAt], [language+state]",
      sessions: "++id, startedAt, endedAt, blockId, lessonId, mode",
      events: "++id, ts, cardId, sessionId, type, [cardId+ts], [type+ts], *conceptIds",
      errorQueue: "cardId, ts",
      errorReasons: "++id, cardId, ts, *conceptIds",
      settings: "key",
      achievements: "id, unlockedAt",
      streak: "date",
      xp: "key",
      conceptMastery: "conceptId, blockId, isMastered, lastReviewed",
      storyProgress: "storyId, completedAt",
      diagnosticResults: "++id, takenAt, completed",
      lessonViews: "id, lessonId, viewedAt, language, [language+viewedAt]",
      userProfile: "id",
      uiState: "key, updatedAt",
      telemetry: "++id, ts, level, [level+ts]",
      dailyGoals: "date",
    });
    await fresh.open();
    // acceptNameDiff: el blob viene del backup con nombre PortuguesAppDB_backup_v7
    // pero lo importamos a la DB principal (PortuguesAppDB).
    // acceptVersionDiff: el blob puede ser v7 (pre-upgrade) o v8 (post-upgrade).
    // skipTables: el blob incluye `_meta` (tabla de control del backup) que
    // no existe en la DB principal y debe ignorarse.
    await fresh.import(blob, {
      acceptNameDiff: true,
      acceptVersionDiff: true,
      skipTables: ["_meta"],
    });
  } finally {
    backupDb.close();
  }
  // Reabrir la DB principal — esto dispara upgrade() a v8 si quedó en v7.
  await db.open();
}

async function openBackupDb(): Promise<Dexie> {
  const backupDb = new Dexie(BACKUP_DB_NAME);
  // El esquema debe declarar las tablas que potencialmente exportará el
  // blob de PortuguesAppDB. Si Dexie encuentra una tabla en el blob que
  // no existe aquí, db.table() lanza InvalidTableError antes de que el
  // addon pueda aplicar `acceptMissingTables`. Mantener este esquema
  // sincronizado con `lib/db/schema.ts` (tablas + PKs).
  backupDb.version(1).stores({
    _meta: "key",
    cards: "id",
    sessions: "++id",
    events: "++id, ts, cardId, sessionId, type, *conceptIds",
    errorQueue: "cardId, ts",
    errorReasons: "++id, cardId, ts, *conceptIds",
    settings: "key",
    achievements: "id, unlockedAt",
    streak: "date",
    xp: "key",
    conceptMastery: "conceptId, blockId, isMastered",
    storyProgress: "storyId, completedAt",
    diagnosticResults: "++id, takenAt, completed",
    lessonViews: "id, lessonId, viewedAt, language",
    userProfile: "id",
    uiState: "key",
    telemetry: "++id, ts, level",
    dailyGoals: "date",
  });
  await backupDb.open();
  return backupDb;
}

/** Hook de upgrade v8 (invocado por Dexie automáticamente).
 *  Aquí va la validación tolerante de events.payload. */
export async function v8UpgradeHook(tx: { table: (name: string) => Table<unknown, unknown> }): Promise<void> {
  // Validación no-rechazante: contar eventos malformados para telemetría
  // sin tirar la fila. La validación real (Zod) se hace en WS-E si existe.
  // Por ahora solo sembramos defaults si las tablas nuevas están vacías.
  const upCount = await tx.table("userProfile").count();
  if (upCount === 0) {
    await tx.table("userProfile").put({
      id: "me",
      createdAt: new Date(),
      displayName: "Edu",
      preferredVariant: "pt-br",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    });
  }
}
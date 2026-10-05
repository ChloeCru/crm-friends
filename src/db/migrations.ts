import type { SQLiteDatabase } from 'expo-sqlite';

import { seedIfEmpty } from './seed';

const DATABASE_VERSION = 1;

/** Passé à `onInit` de `SQLiteProvider` : crée ou met à jour le schéma. */
export async function initDatabase(db: SQLiteDatabase) {
  // Les clés étrangères (et donc le ON DELETE CASCADE) sont désactivées par défaut à chaque connexion.
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  if (version < 1) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE friend (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL CHECK (length(trim(name)) > 0),
        label TEXT NOT NULL DEFAULT '',
        rhythm_days INTEGER NOT NULL DEFAULT 21 CHECK (rhythm_days > 0),
        avatar TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        channels TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL
      );
      CREATE TABLE contact (
        id TEXT PRIMARY KEY NOT NULL,
        friend_id TEXT NOT NULL REFERENCES friend(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        channel TEXT NOT NULL CHECK (channel IN ('appel', 'message', 'cafe', 'autre')),
        created_at TEXT NOT NULL
      );
      CREATE INDEX contact_friend_date ON contact (friend_id, date DESC);
    `);
    version = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);

  if (__DEV__) await seedIfEmpty(db);
}

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "portfolio.db");

// Use a singleton pattern to avoid multiple connections
// which can cause SQLITE_BUSY errors during build
const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

function getSqlite() {
  if (!globalForDb.sqlite) {
    const sqlite = new Database(dbPath);
    // Enable WAL mode for better concurrent read performance
    sqlite.pragma("journal_mode = WAL");
    // Set busy timeout to wait up to 5s if the database is locked
    sqlite.pragma("busy_timeout = 5000");
    globalForDb.sqlite = sqlite;
  }
  return globalForDb.sqlite;
}

const sqlite = getSqlite();

export const db = drizzle(sqlite, { schema });
export { schema };

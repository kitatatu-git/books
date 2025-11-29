// src/db/client.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = "./storage/app.db";

declare global {
  var __sqlite: Database.Database | undefined;
  var __drizzle: ReturnType<typeof drizzle> | undefined;
}

const sqlite = global.__sqlite ?? new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = global.__drizzle ?? drizzle({ client: sqlite, schema });

if (!global.__sqlite) global.__sqlite = sqlite;
if (!global.__drizzle) global.__drizzle = db;

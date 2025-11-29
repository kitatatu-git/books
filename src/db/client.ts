// src/db/client.ts
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

declare global {
  var __drizzle: ReturnType<typeof drizzle> | undefined;
}

// Vercel Postgresを使用
// 環境変数 POSTGRES_URL が自動的に設定されます
export const db = global.__drizzle ?? drizzle({ client: sql, schema });

if (!global.__drizzle) global.__drizzle = db;

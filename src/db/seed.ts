// src/db/seed.ts
import { db } from "./client";
import { users } from "./schema";
import { hashPassword } from "@/lib/auth";

async function seed() {
  console.log("Seeding database...");

  // サンプルユーザーを追加
  await db.insert(users).values([
    { name: "Alice", password: hashPassword("password") },
    { name: "Bob", password: hashPassword("password") },
    { name: "Charlie", password: hashPassword("password") },
  ]);

  console.log("Seeding completed!");
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});

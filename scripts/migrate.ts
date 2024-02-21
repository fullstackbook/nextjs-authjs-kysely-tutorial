import * as path from "path";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  SqliteDialect,
  FileMigrationProvider,
  CamelCasePlugin,
  PostgresDialect,
} from "kysely";
import Database from "better-sqlite3";
import { Pool } from "pg";
import config from "@/lib/config";

async function migrateToLatest() {
  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: config.DATABASE_URL,
      }),
    }),
    plugins: [new CamelCasePlugin()],
  });

  // const db = new Kysely({
  //   dialect: new SqliteDialect({
  //     database: new Database(config.DATABASE_URL),
  //   }),
  //   plugins: [new CamelCasePlugin()],
  // });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "../db/migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();

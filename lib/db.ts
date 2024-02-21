import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { SqliteDialect } from "kysely";
import { CamelCasePlugin } from "kysely";
import Database from "better-sqlite3";

// This adapter exports a wrapper of the original `Kysely` class called `KyselyAuth`,
// that can be used to provide additional type-safety.
// While using it isn't required, it is recommended as it will verify
// that the database interface has all the fields that Auth.js expects.
import { KyselyAuth } from "@auth/kysely-adapter";

import { type GeneratedAlways } from "kysely";
import config from "./config";

interface Database {
  User: {
    id: GeneratedAlways<string>;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
  Account: {
    id: GeneratedAlways<string>;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
  };
  Session: {
    id: GeneratedAlways<string>;
    userId: string;
    sessionToken: string;
    expires: Date;
  };
  VerificationToken: {
    identifier: string;
    token: string;
    expires: Date;
  };
}

export const db = new KyselyAuth({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.DATABASE_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

// export const db = new KyselyAuth({
//   dialect: new SqliteDialect({
//     database: new Database(config.DATABASE_URL),
//   }),
//   plugins: [new CamelCasePlugin()],
// });

import "server-only";

import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";

type Database = MySql2Database<typeof schema>;

type GlobalDb = {
  __mysqlPool?: mysql.Pool;
  __drizzleDb?: Database;
};

const globalDb = globalThis as unknown as GlobalDb;

function createPool(): mysql.Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return mysql.createPool(connectionString);
}

export function getDb(): Database {
  if (!globalDb.__mysqlPool) {
    globalDb.__mysqlPool = createPool();
  }

  if (!globalDb.__drizzleDb) {
    globalDb.__drizzleDb = drizzle(globalDb.__mysqlPool, { schema, mode: "default" });
  }

  return globalDb.__drizzleDb;
}

export type { Database };
export { schema };

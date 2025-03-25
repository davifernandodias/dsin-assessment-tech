import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.POSTGRES_URL)
  throw new Error("Missing POSTGRES_URL environment variable!");
console.log(process.env.POSTGRES_URL); 


const queryClient = postgres(process.env.POSTGRES_URL);

async function testConnection() {
  try {
    await queryClient`SELECT 1 AS test`;
    console.log("✅ Conexão ao banco de dados estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Falha ao conectar ao banco de dados:", error);
    throw error;
  }
}

testConnection().catch((err) => {
  console.error("Erro crítico na inicialização da conexão:", err);
  process.exit(1);
});

export const db = drizzle(queryClient, {
  schema,
});
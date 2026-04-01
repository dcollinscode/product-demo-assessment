import { Pool } from "pg";
import logger from "../utils/logger"

// A pool reuses connections across requestsso that every request opens and closes its own DB connection —
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    
  idleTimeoutMillis: 30_000, 
  connectionTimeoutMillis: 2_000, 
});

pool.on("error", (err) => {
  // Unexpected client error — log but don't crash the process
  logger.error("Unexpected DB pool error", { error: err.message });
});

export async function checkDbConnection(): Promise<void> {
  const client = await pool.connect();
  client.release();
}

export default pool;
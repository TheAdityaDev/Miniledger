import app from "./src/app";
import { env } from "./src/config/env";
import { pool } from "./src/db/pool";

async function startServer() {
  try {
    await pool.query("SELECT 1");

    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`MiniLedger API running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start MiniLedger:", error);
    process.exit(1);
  }
}

void startServer();
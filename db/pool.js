const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase and Railway require SSL. Set PGSSL=false only for a local instance.
  ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => console.error("Unexpected PG pool error:", err));

module.exports = pool;

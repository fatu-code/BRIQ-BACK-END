// Applies db/schema.sql. Run with: npm run migrate
const fs = require("fs");
const path = require("path");
const pool = require("./pool");

(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await pool.query(sql);
    console.log("✓ Schema applied.");
  } catch (e) {
    console.error("Migration failed:", e.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();

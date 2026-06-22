// Seeds the materials catalogue. Run with: npm run seed
const pool = require("./pool");
const { MATERIALS } = require("./catalog");

(async () => {
  try {
    for (const m of MATERIALS) {
      await pool.query(
        `INSERT INTO materials (id,name,spec,group_name,unit,supplier,retail,verified)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET
           name=$2, spec=$3, group_name=$4, unit=$5, supplier=$6, retail=$7, verified=$8`,
        [m.id, m.name, m.spec, m.group, m.unit, m.supplier, m.retail, m.verified]
      );
    }
    console.log(`✓ Seeded ${MATERIALS.length} materials.`);
  } catch (e) {
    console.error("Seed failed:", e.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();

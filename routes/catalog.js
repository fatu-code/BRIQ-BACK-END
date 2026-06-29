const router = require("express").Router();
const pool = require("../db/pool");
const { asyncHandler } = require("../middleware");
const { BRIK_FEE, PACKS } = require("../db/catalog");

const withPricing = (m) => {
  const brik = Math.round(m.supplier * (1 + BRIK_FEE));
  return {
    id: m.id, name: m.name, spec: m.spec, group: m.group_name, unit: m.unit,
    supplier: m.supplier, retail: m.retail, verified: m.verified,
    brik, fee: Math.round(m.supplier * BRIK_FEE), save: m.retail - brik,
  };
};

// GET /api/materials - full catalogue with Brik pricing
router.get("/materials", asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM materials WHERE active = true ORDER BY group_name, name"
  );
  res.json({ fee: BRIK_FEE, materials: rows.map(withPricing) });
}));

// GET /api/packs - phase bundles
router.get("/packs", (req, res) => res.json({ packs: PACKS }));

module.exports = router;

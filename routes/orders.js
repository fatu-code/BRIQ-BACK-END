const router = require("express").Router();
const pool = require("../db/pool");
const { asyncHandler, requireClient } = require("../middleware");
const { BRIK_FEE } = require("../db/catalog");

const STATUS = ["Placed", "Confirming", "Out for delivery", "Delivered"];

// GET /api/orders — client's orders with items
router.get("/orders", requireClient, asyncHandler(async (req, res) => {
  const { rows: orders } = await pool.query(
    "SELECT * FROM orders WHERE client_id = $1 ORDER BY created_at DESC",
    [req.clientId]
  );
  const ids = orders.map((o) => o.id);
  let items = [];
  if (ids.length) {
    const r = await pool.query("SELECT * FROM order_items WHERE order_id = ANY($1)", [ids]);
    items = r.rows;
  }
  const out = orders.map((o) => ({
    id: o.id, project: o.project_name, site: o.site, slot: o.slot,
    statusIdx: o.status_idx, status: STATUS[o.status_idx],
    total: o.total, save: o.savings,
    date: new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    items: items.filter((it) => it.order_id === o.id).map((it) => ({ name: it.name, qty: it.qty, unit: it.unit })),
  }));
  res.json({ orders: out });
}));

// POST /api/orders  { projectId, slot, items: [{id, qty}] }
// Prices are recomputed server-side from the DB — never trust client totals.
router.post("/orders", requireClient, asyncHandler(async (req, res) => {
  const { projectId, slot, items } = req.body;
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: "Order has no items" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const ids = items.map((i) => i.id);
    const { rows: mats } = await client.query(
      "SELECT * FROM materials WHERE id = ANY($1) AND active = true", [ids]
    );
    const byId = Object.fromEntries(mats.map((m) => [m.id, m]));

    let supplierTotal = 0, total = 0, savings = 0;
    const lines = [];
    for (const it of items) {
      const m = byId[it.id];
      const qty = Math.max(1, Math.floor(it.qty || 0));
      if (!m || qty < 1) continue;
      const unitPrice = Math.round(m.supplier * (1 + BRIK_FEE));
      const lineTotal = unitPrice * qty;
      supplierTotal += m.supplier * qty;
      total += lineTotal;
      savings += (m.retail - unitPrice) * qty;
      lines.push({ material_id: m.id, name: m.name, unit: m.unit, qty, unitPrice, lineTotal });
    }
    if (lines.length === 0) throw Object.assign(new Error("No valid items"), { status: 400 });
    const feeTotal = Math.round(total - supplierTotal);

    let projectName = "No project", site = "";
    if (projectId) {
      const p = await client.query("SELECT name, site FROM projects WHERE id = $1 AND client_id = $2", [projectId, req.clientId]);
      if (p.rows[0]) { projectName = p.rows[0].name; site = p.rows[0].site || ""; }
    }

    const id = "BRK-" + Date.now().toString().slice(-6);
    await client.query(
      `INSERT INTO orders (id, client_id, project_id, project_name, site, slot, status_idx, supplier_total, fee_total, total, savings)
       VALUES ($1,$2,$3,$4,$5,$6,1,$7,$8,$9,$10)`,
      [id, req.clientId, projectId || null, projectName, site, slot || null, supplierTotal, feeTotal, total, savings]
    );
    for (const l of lines) {
      await client.query(
        `INSERT INTO order_items (order_id, material_id, name, unit, qty, unit_price, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [id, l.material_id, l.name, l.unit, l.qty, l.unitPrice, l.lineTotal]
      );
    }
    await client.query("COMMIT");
    res.status(201).json({ id, total, save: savings, slot, status: STATUS[1] });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}));

// PATCH /api/orders/:id/status  { statusIdx }  — operator side moves the order along
router.patch("/orders/:id/status", asyncHandler(async (req, res) => {
  const idx = Number(req.body.statusIdx);
  if (!(idx >= 0 && idx <= 3)) return res.status(400).json({ error: "statusIdx must be 0–3" });
  const { rowCount } = await pool.query("UPDATE orders SET status_idx = $1 WHERE id = $2", [idx, req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Order not found" });
  res.json({ id: req.params.id, statusIdx: idx, status: STATUS[idx] });
}));

module.exports = router;

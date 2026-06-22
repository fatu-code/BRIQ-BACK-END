const router = require("express").Router();
const pool = require("../db/pool");
const { asyncHandler, requireClient } = require("../middleware");

router.use(requireClient);

// GET /api/projects
router.get("/projects", asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, site FROM projects WHERE client_id = $1 ORDER BY created_at",
    [req.clientId]
  );
  res.json({ projects: rows });
}));

// POST /api/projects  { name, site }
router.post("/projects", asyncHandler(async (req, res) => {
  const { name, site } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Project name required" });
  const id = "p" + Date.now().toString(36);
  await pool.query(
    "INSERT INTO projects (id, client_id, name, site) VALUES ($1,$2,$3,$4)",
    [id, req.clientId, name.trim(), (site || "").trim()]
  );
  res.status(201).json({ project: { id, name: name.trim(), site: (site || "").trim() } });
}));

module.exports = router;

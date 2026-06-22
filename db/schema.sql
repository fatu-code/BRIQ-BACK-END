-- Brik schema. Run on Supabase (SQL editor) or via `npm run migrate`.

CREATE TABLE IF NOT EXISTS materials (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  spec        TEXT,
  group_name  TEXT NOT NULL,          -- Cement | Steel | Blocks | Aggregates | Roofing
  unit        TEXT NOT NULL,
  supplier    INTEGER NOT NULL,       -- supplier cost (UGX)
  retail      INTEGER NOT NULL,       -- what they'd pay buying alone (UGX)
  verified    BOOLEAN DEFAULT FALSE,  -- engineer-verified item
  active      BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  client_id   TEXT NOT NULL,          -- device/user identifier
  name        TEXT NOT NULL,
  site        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  client_id   TEXT NOT NULL,
  project_id  TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT,
  site        TEXT,
  slot        TEXT,
  status_idx  INTEGER DEFAULT 1,      -- 0 Placed, 1 Confirming, 2 Out for delivery, 3 Delivered
  supplier_total INTEGER NOT NULL,
  fee_total   INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  savings     INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL PRIMARY KEY,
  order_id     TEXT REFERENCES orders(id) ON DELETE CASCADE,
  material_id  TEXT,
  name         TEXT NOT NULL,
  unit         TEXT,
  qty          INTEGER NOT NULL,
  unit_price   INTEGER NOT NULL,
  line_total   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id);

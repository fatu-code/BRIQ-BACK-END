// Single source of truth for the catalogue. Edit prices here, then `npm run seed`.
const BRIK_FEE = 0.06; // your margin

const MATERIALS = [
  { id: "cem-hima", name: "Cement — Hima", spec: "50kg · OPC 42.5N", group: "Cement", unit: "bag", supplier: 38000, retail: 44000, verified: true },
  { id: "cem-tororo", name: "Cement — Tororo", spec: "50kg · OPC 42.5N", group: "Cement", unit: "bag", supplier: 36000, retail: 42000, verified: true },
  { id: "bar-y10", name: "Iron bar Y10", spec: "10mm deformed · 12m", group: "Steel", unit: "length", supplier: 27000, retail: 32000, verified: true },
  { id: "bar-y12", name: "Iron bar Y12", spec: "12mm deformed · 12m", group: "Steel", unit: "length", supplier: 38000, retail: 44000, verified: true },
  { id: "bar-y16", name: "Iron bar Y16", spec: "16mm deformed · 12m", group: "Steel", unit: "length", supplier: 68000, retail: 78000, verified: true },
  { id: "brc", name: "BRC mesh A142", spec: "Standard sheet", group: "Steel", unit: "sheet", supplier: 95000, retail: 110000, verified: true },
  { id: "wire", name: "Binding wire", spec: "Galvanised · per kg", group: "Steel", unit: "kg", supplier: 6500, retail: 7800, verified: false },
  { id: "block-6", name: 'Hollow block 6"', spec: "Vibrated · 400×200×150", group: "Blocks", unit: "block", supplier: 2200, retail: 2600, verified: true },
  { id: "block-9", name: 'Hollow block 9"', spec: "Vibrated · 400×200×225", group: "Blocks", unit: "block", supplier: 3000, retail: 3500, verified: true },
  { id: "sand-river", name: "River sand", spec: "Concrete sand · per tonne", group: "Aggregates", unit: "tonne", supplier: 45000, retail: 53000, verified: false },
  { id: "sand-lake", name: "Plaster sand", spec: "Fine lake sand · per tonne", group: "Aggregates", unit: "tonne", supplier: 60000, retail: 70000, verified: false },
  { id: "ballast", name: "Aggregate / ballast", spec: '3/4" stone · per tonne', group: "Aggregates", unit: "tonne", supplier: 75000, retail: 88000, verified: true },
  { id: "hardcore", name: "Hardcore", spec: "Foundation fill · per tonne", group: "Aggregates", unit: "tonne", supplier: 35000, retail: 41000, verified: false },
  { id: "sheet-28", name: "Iron sheets G28", spec: "Box profile · 3m", group: "Roofing", unit: "sheet", supplier: 38000, retail: 45000, verified: false },
  { id: "nails", name: "Nails", spec: "Assorted · per kg", group: "Roofing", unit: "kg", supplier: 6000, retail: 7200, verified: false },
];

const PACKS = [
  { id: "foundation", name: "Foundation", note: "Strip footing", items: { "cem-hima": 20, hardcore: 6, ballast: 4, "sand-river": 4, "bar-y12": 15, wire: 3 } },
  { id: "slab", name: "Slab", note: "Suspended floor", items: { "cem-hima": 25, ballast: 5, "sand-river": 4, "bar-y12": 20, brc: 8, wire: 4 } },
  { id: "walling", name: "Walling", note: "Block work", items: { "block-9": 400, "cem-hima": 15, "sand-lake": 6, "bar-y10": 10 } },
  { id: "roofing", name: "Roofing", note: "Iron sheet cover", items: { "sheet-28": 40, nails: 10 } },
];

module.exports = { BRIK_FEE, MATERIALS, PACKS };

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { errorHandler } = require("./middleware");
const catalog = require("./routes/catalog");
const projects = require("./routes/projects");
const orders = require("./routes/orders");

const app = express();

const origins = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, service: "brik-api" }));

app.use("/api", catalog);
app.use("/api", projects);
app.use("/api", orders);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Brik API on :${PORT}`));

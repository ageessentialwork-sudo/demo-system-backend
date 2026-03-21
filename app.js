const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ DB CONNECTION
const db = require("./db");

// ✅ ROUTES
const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Backend is LIVE 🚀");
});

// ================= TEST ROUTE =================
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ================= API ROUTES =================
app.use("/auth", authRoutes);
app.use("/wishlist", wishlistRoutes);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");

const app = express(); // ✅ FIRST create app

const db = require("./db"); // ✅ import db

const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");

app.use(cors());
app.use(express.json());


// ✅ Home route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend is LIVE 🚀");
});


// ✅ Test DB route
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});


// ✅ Other routes
app.use("/auth", authRoutes);
app.use("/wishlist", wishlistRoutes);


// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
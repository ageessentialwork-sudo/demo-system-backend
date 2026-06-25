const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ DB CONNECTION
const db = require("./db");

// ✅ ROUTES
const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");
const cartRoutes = require("./routes/cart");

const shopifyRoutes =
require("./routes/shopify")


// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "../client")
  )
);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {

  res.sendFile(

    path.join(
      __dirname,
      "../client/index.html"
    )
 
  );

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
app.use("/cart", cartRoutes);

app.use("/shopify", shopifyRoutes)


app.get("/check-wishlist", (req, res) => {
  db.query("SHOW TABLES", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

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


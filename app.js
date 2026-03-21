const express = require("express");
const cors = require("cors");

require("./db");

const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/wishlist", wishlistRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/", (req, res) => {
  res.send("Backend is LIVE 🚀");
});
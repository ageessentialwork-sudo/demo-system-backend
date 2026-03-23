const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();


// 🔐 REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {

        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
          }
          return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "User registered successfully 🚀" });
      }
    );

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// 🔐 LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {

      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        "secretkey",
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token
      });

    }
  );
});


// 🔥 GET CURRENT USER (NEW - IMPORTANT)
const authMiddleware = require("../middleware/auth");

router.get("/me", authMiddleware, (req, res) => {

  const userId = req.user.id;

  const sql = "SELECT id, name, email FROM users WHERE id=?";

  db.query(sql, [userId], (err, result) => {

    if (err)
      return res.status(500).json({ error: "database error" });

    if (result.length === 0)
      return res.json({ error: "user not found" });

    res.json(result[0]);

  });

});


module.exports = router;
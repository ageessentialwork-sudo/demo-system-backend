const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ✅ ADD PRODUCT TO WISHLIST
router.post("/add", authMiddleware, (req, res) => {

  const user_id = req.user.id; // 🔥 from token

  const {
    product_id,
    product_title,
    product_price,
    product_image,
    product_url
  } = req.body;

  const sql = `
    INSERT INTO wishlist
    (user_id, product_id, product_title, product_price, product_image, product_url)
    VALUES (?,?,?,?,?,?)
  `;

  db.query(sql,
    [user_id, product_id, product_title, product_price, product_image, product_url],
    (err, result) => {

      if (err)
        return res.status(500).json({ error: "database error" });

      res.json({ message: "Added to wishlist ✅" });

    });
});


// ✅ GET USER WISHLIST
router.get("/", authMiddleware, (req, res) => {

  const userId = req.user.id;

  const sql = "SELECT * FROM wishlist WHERE user_id=?";

  db.query(sql, [userId], (err, result) => {

    if (err)
      return res.status(500).json({ error: "database error" });

    res.json(result);

  });

});

// ✅ REMOVE PRODUCT FROM WISHLIST
router.delete("/remove/:id", authMiddleware, (req, res) => {

  const user_id = req.user.id;
  const wishlist_id = req.params.id;

  const sql = "DELETE FROM wishlist WHERE id=? AND user_id=?";

  db.query(sql, [wishlist_id, user_id], (err, result) => {

    if (err)
      return res.status(500).json({ error: "database error" });

    res.json({ message: "Removed from wishlist ❌" });

  });

});
module.exports = router;
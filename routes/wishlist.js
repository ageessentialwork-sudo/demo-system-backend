const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ========================================
// ADD TO WISHLIST
// ========================================
router.post("/add", authMiddleware, (req, res) => {

  const user_id = req.user.id;

  const {
    product_id,
    product_title,
    product_price,
    product_image,
    product_url
  } = req.body;

  // Check if already exists
  const checkSql =
    "SELECT id FROM wishlist WHERE user_id=? AND product_id=?";

  db.query(
    checkSql,
    [user_id, product_id],
    (checkErr, checkResult) => {

      if (checkErr) {
        return res.status(500).json({
          error: "database error"
        });
      }

      // Already exists
      if (checkResult.length > 0) {
        return res.json({
          message: "Already in wishlist"
        });
      }

      const insertSql = `
        INSERT INTO wishlist
        (
          user_id,
          product_id,
          product_title,
          product_price,
          product_image,
          product_url
        )
        VALUES (?,?,?,?,?,?)
      `;

      db.query(
        insertSql,
        [
          user_id,
          product_id,
          product_title,
          product_price,
          product_image,
          product_url
        ],
        (err, result) => {

          if (err) {
            return res.status(500).json({
              error: "database error"
            });
          }

          res.json({
            message: "Added to wishlist ✅"
          });

        }
      );

    }
  );

});


// ========================================
// GET USER WISHLIST
// ========================================
router.get("/", authMiddleware, (req, res) => {

  const user_id = req.user.id;

  const sql =
    "SELECT * FROM wishlist WHERE user_id=? ORDER BY id DESC";

  db.query(
    sql,
    [user_id],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          error: "database error"
        });
      }

      res.json(result);

    }
  );

});


// ========================================
// REMOVE BY WISHLIST ID
// ========================================
router.delete("/remove/:id", authMiddleware, (req, res) => {

  const user_id = req.user.id;

  const wishlist_id =
    req.params.id;

  const sql =
    "DELETE FROM wishlist WHERE id=? AND user_id=?";

  db.query(
    sql,
    [wishlist_id, user_id],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          error: "database error"
        });
      }

      res.json({
        message: "Removed from wishlist"
      });

    }
  );

});


// ========================================
// REMOVE BY PRODUCT ID
// ========================================
router.delete(
  "/remove-by-product/:productId",
  authMiddleware,
  (req, res) => {

    const user_id = req.user.id;

    const product_id =
      req.params.productId;

    const sql =
      "DELETE FROM wishlist WHERE user_id=? AND product_id=?";

    db.query(
      sql,
      [user_id, product_id],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            error: "database error"
          });
        }

        res.json({
          message: "Removed"
        });

      }
    );

  }
);

module.exports = router;
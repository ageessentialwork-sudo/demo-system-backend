const express = require("express");
console.log("✅ CART ROUTE LOADED");
const db = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// =========================
// GET USER CART
// =========================
router.get("/", authMiddleware, (req, res) => {

    const user_id = req.user.id;

    db.query(
        "SELECT * FROM cart WHERE user_id=?",
        [user_id],
        (err, result) => {

            if (err)
                return res.status(500).json({
                    error: "Database error"
                });

            res.json(result);

        }
    );

});


// =========================
// ADD TO CART
// =========================
router.post("/add", authMiddleware, (req, res) => {

    const user_id = req.user.id;

    const {
        variant_id,
        title,
        price,
        image,
        handle,
        quantity
    } = req.body;


    db.query(

        "SELECT * FROM cart WHERE user_id=? AND variant_id=?",

        [user_id, variant_id],

        (err, rows) => {

            if (err)
                return res.status(500).json({
                    error: "Database error"
                });

            // Already exists
            if (rows.length > 0) {

                db.query(

                    "UPDATE cart SET quantity=quantity+? WHERE user_id=? AND variant_id=?",

                    [
                        quantity || 1,
                        user_id,
                        variant_id
                    ],

                    (err2) => {

                        if (err2)
                            return res.status(500).json({
                                error: "Database error"
                            });

                        res.json({
                            message: "Cart updated"
                        });

                    }

                );

            }

            // New item
            else {

                db.query(

                    `INSERT INTO cart
                    (user_id,variant_id,title,price,image,handle,quantity)
                    VALUES(?,?,?,?,?,?,?)`,

                    [
                        user_id,
                        variant_id,
                        title,
                        price,
                        image,
                        handle,
                        quantity || 1
                    ],

                    (err3) => {

                        if (err3)
                            return res.status(500).json({
                                error: "Database error"
                            });

                        res.json({
                            message: "Added to cart"
                        });

                    }

                );

            }

        }

    );

});


// =========================
// UPDATE QUANTITY
// =========================
router.put("/update/:variantId", authMiddleware, (req, res) => {

    const user_id = req.user.id;

    const variant_id = req.params.variantId;

    const { quantity } = req.body;

    db.query(

        "UPDATE cart SET quantity=? WHERE user_id=? AND variant_id=?",

        [
            quantity,
            user_id,
            variant_id
        ],

        (err) => {

            if (err)
                return res.status(500).json({
                    error: "Database error"
                });

            res.json({
                message: "Quantity updated"
            });

        }

    );

});


// =========================
// REMOVE ITEM
// =========================
router.delete("/remove/:variantId", authMiddleware, (req, res) => {

    const user_id = req.user.id;

    const variant_id = req.params.variantId;

    db.query(

        "DELETE FROM cart WHERE user_id=? AND variant_id=?",

        [
            user_id,
            variant_id
        ],

        (err) => {

            if (err)
                return res.status(500).json({
                    error: "Database error"
                });

            res.json({
                message: "Removed"
            });

        }

    );

});


router.get("/test", (req, res) => {

    res.json({
        message: "Cart route working 🚀"
    });

});


module.exports = router;


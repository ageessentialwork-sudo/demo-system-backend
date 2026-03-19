const express = require("express");
const db = require("../db");

const router = express.Router();


// ADD PRODUCT TO WISHLIST
router.post("/add",(req,res)=>{

    const {
    user_id,
    product_id,
    product_title,
    product_price,
    product_image,
    product_url
    } = req.body
    
    const sql = `
    INSERT INTO wishlist
    (user_id,product_id,product_title,product_price,product_image,product_url)
    VALUES (?,?,?,?,?,?)
    `
    
    db.query(sql,
    [user_id,product_id,product_title,product_price,product_image,product_url],
    (err,result)=>{
    
    if(err)
    return res.status(500).json({error:"database error"})
    
    res.json({message:"added to wishlist"})
    
    })
    
    })

// GET USER WISHLIST
router.get("/:userId",(req,res)=>{

 const userId = req.params.userId

 const sql = "SELECT * FROM wishlist WHERE user_id=?"

 db.query(sql,[userId],(err,result)=>{

   if(err)
     return res.status(500).json({error:"database error"})

   res.json(result)

 })

})

// REMOVE PRODUCT FROM WISHLIST
router.delete("/remove",(req,res)=>{

  const {user_id, product_id} = req.body
 
  const sql = "DELETE FROM wishlist WHERE user_id=? AND product_id=?"
 
  db.query(sql,[user_id,product_id],(err,result)=>{
 
    if(err)
      return res.status(500).json({error:"database error"})
 
    res.json({message:"removed from wishlist"})
 
  })
 
 })


module.exports = router
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();


// REGISTER
router.post("/register", async (req,res)=>{

    const {name,email,password} = req.body;
   
    const hash = await bcrypt.hash(password,10);
   
    const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
   
    db.query(sql,[name,email,hash],(err,result)=>{
   
      if(err){
        console.log(err)
        return res.status(500).json({error:"database error"})
      }
   
      res.json({message:"user created"})
   
    })
   
   })


// LOGIN
router.post("/login",(req,res)=>{

 const {email,password} = req.body;

 const sql = "SELECT * FROM users WHERE email=?";

 db.query(sql,[email],async(err,result)=>{

    if(result.length===0)
        return res.json({error:"user not found"});

    const user = result[0];

    const match = await bcrypt.compare(password,user.password);

    if(!match)
        return res.json({error:"wrong password"});

    res.json({message:"login success",user_id:user.id});

 });

});


router.get("/user/:id",(req,res)=>{

    const userId = req.params.id
   
    const sql = "SELECT id,name,email FROM users WHERE id=?"
   
    db.query(sql,[userId],(err,result)=>{
   
      if(err)
        return res.status(500).json({error:"database error"})
   
      if(result.length === 0)
        return res.json({error:"user not found"})
   
      res.json(result[0])
   
    })
   
   })

module.exports = router;



const express = require("express")
const db = require("../db")

const router = express.Router()

router.post("/order-created",(req,res)=>{

const order = req.body

const email = order.email
const orderId = order.id
const product = order.line_items[0].title
const price = order.line_items[0].price
const status = order.financial_status

const sql = `
INSERT INTO orders
(user_email,shopify_order_id,product_title,product_price,order_status)
VALUES (?,?,?,?,?)
`

db.query(sql,[email,orderId,product,price,status],(err)=>{

if(err)
console.log(err)

})

res.sendStatus(200)

})

module.exports = router
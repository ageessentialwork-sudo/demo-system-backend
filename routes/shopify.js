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

// ========================================
// GET PRODUCTS
// ========================================

router.get("/products", async (req, res) => {

    const SHOP_DOMAIN =
    "1e8u6g-mp.myshopify.com"
    
    const STOREFRONT_TOKEN =
    "2a560fa17d66837970c0da9b77dba810"
    
    const query = `
    {
      products(first:10){
    
        edges{
    
          node{
    
            id
            title
            handle
    
            images(first:1){
              edges{
                node{
                  url
                }
              }
            }
    
            priceRange{
              minVariantPrice{
                amount
              }
            }
    
            variants(first:1){
              edges{
                node{
                  id
                }
              }
            }
    
          }
    
        }
    
      }
    }
    `
    
    try{
    
    const response = await fetch(
    `https://${SHOP_DOMAIN}/api/2026-01/graphql.json`,
    {
    
    method:"POST",
    
    headers:{
    "Content-Type":"application/json",
    
    "X-Shopify-Storefront-Access-Token":
    STOREFRONT_TOKEN
    },
    
    body: JSON.stringify({ query })
    
    }
    )
    
    const data = await response.json()
    
    res.json(data)
    
    }
    
    catch(err){
    
    console.error(err)
    
    res.status(500).json({
    error:"Shopify fetch failed"
    })
    
    }
    
    })

module.exports = router
const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)

router.get("/donor/get", (req, res) =>{
    const prices = await stripe.prices.list()
    const subscriptions = prices.data;
    console.log(subscriptions)
    res.send(subscriptions)
})

router.get("/org/get", async (req, res)=>{
    const prices = await stripe.prices.list()
    const subscriptions = prices.data;
    console.log(subscriptions)
    res.send(subscriptions)
})

router.get("/org/desc/:id", async (req, res)=>{
    const productId = req.params.id;
    const product = await stripe.products.retrieve(productId)
    console.log(product.description)
    const desc = product.description;
    res.send({"desc": desc})
})

router.post("/donor/end/:id", (req, res)=>{
    
})

router.post("/donor/create", (req, res)=>{

})





module.exports = router;
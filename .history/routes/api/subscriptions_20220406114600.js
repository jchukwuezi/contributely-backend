const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)

router.get("/donor/get", (req, res) =>{

})

router.get("/org/get", async (req, res)=>{
    const prices = await stripe.prices.list()
    const subscriptions = prices.data;
    console.log(subscriptions)
    res.send(subscriptions)
})

router.post("/donor/end/:id", (req, res)=>{
    
})

router.post("/donor/create", (req, res)=>{

})





module.exports = router;
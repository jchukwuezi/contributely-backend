const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)

router.get("/donor/subscriptions", (req, res) =>{

})

router.get("/org/get", (req, res)=>{
    const prices = stripe.prices.list()
    const subscriptions = prices.data;
    console.log(subscriptions)
    res.send(subscriptions)
})

router.post("/donor/end/subscription/:id", (req, res)=>{
    
})

router.post("/donor/create/subscription", (req, res)=>{

})





module.exports = router;
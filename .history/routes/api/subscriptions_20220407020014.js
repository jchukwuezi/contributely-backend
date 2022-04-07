const express = require('express')
const router = express.Router()
const Organisation = require('../../models/Organisation')
const Donor = require('../../models/Donor')
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

router.post("/donor/create/:groupId", async (req, res)=>{
    const groupId = req.params.groupId;
    const orgStripeId = await Organisation.findById(groupId).select({_id:0, stripeAccountId:1})
    const sessDonor = req.session.donor;
    if(sessDonor){
        const customerId = await Donor.findById(req.session.donor.id).select({_id:0, stripeCustomerId:1})
        const subscription = await stripe.subscriptions.create({
            customer: customerId.stripeCustomerId,
            items: [
                {
                    price: req.body.priceId
                },
            ],
            expand:["latest_invoice.payment_intent"],
            transfer_data : {
                destination: orgStripeId.stripeAccountId
            }
        })

        const status = subscription['latest_invoice']['payment_intent']['status'] 
        const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
        console.log(status)
        console.log(client_secret)
        res.send({'client_secret': client_secret, 'status': status});
    }
    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }

})





module.exports = router;
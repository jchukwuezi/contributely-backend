const express = require('express')
const router = express.Router()
const Organisation = require('../../models/Organisation')
const Donor = require('../../models/Donor')
const Subscription = require('../../models/Subscription')
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)

router.get("/donor/get", async (req, res) =>{
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

router.get("/donor/all", async(req, res)=>{
    const sessDonor = req.session.donor;
    if(sessDonor){
        const subCount = await Subscription.find({})
        .where('donor').equals(req.session.donor.id)
        .where('active').equals(true)
        .length()

        const subs = await Subscription.find({})
        .where('donor').equals(req.session.donor.id)
        .populate(
            {
                path: 'organisation',
                select: 'name tags description'
            }
        )
        .catch((err)=>{
            res.send(err)
        })
        console.log(subs)
        //res.send(subs)
        res.json({
            "subs": subs,
            "count": subCount
        })
    }
    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})

router.get("/org/all", async (req, res)=>{
    const sessOrg = req.session.org;
    if(sessOrg){
        const subs = await Subscription.find({})
        .where('organisation').equals(req.session.org.id)
        .where('active').equals(true)
        .populate(
            {
                path: 'donor',
                select: 'name'
            }
        )
        console.log(subs)
        res.send({subs: subs})
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})



router.get("/org/desc/:id", async (req, res)=>{
    const productId = req.params.id;
    const product = await stripe.products.retrieve(productId)
    console.log(product.description)
    const desc = product.description;
    res.send({"desc": desc})
})

router.post("/donor/end/:id", async (req, res)=>{
    //const stripeSubId = req.params.id
    const subId = req.params.id
    const sessDonor = req.session.donor;
    if (sessDonor){
        const sub = await Subscription.findById(subId)
        //end subscription from stripe
        const endSub = await stripe.subscriptions.del(sub.stripeSubscriptionId)
        console.log(endSub)
        /*
        //set active equal to false
        await Subscription.findOneAndUpdate({stripeSubscriptionId: stripeSubId},{active: false}, {endDate: Date.now()})
        .catch((err)=>{
            console.error(err)
            res.send(err)
        })
        */
        await Subscription.findByIdAndUpdate(sub._id, {$set:{endDate: Date.now(), active: false}})
        res.send("Subscription ended")
    }
    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }

})

router.post("/donor/subscribe/:groupId", async (req, res)=>{
    const groupId = req.params.groupId;
    const amountInEuro = req.body.unit_amount/100
    const orgStripeId = await Organisation.findById(groupId).select({_id:0, stripeAccountId:1})
    const org = await Organisation.findById(groupId).select({_id: 1})
    const sessDonor = req.session.donor;
    let payment_method = ""
    console.log(req.body.payment_method)
    if(sessDonor){
        //looking if the donor already has a stripePaymentMethodId on their account
        const stripePaymentMethodId = await Donor.findById(req.session.donor.id).select({_id:0, stripePaymentMethodId:1})
        const customerId = await Donor.findById(req.session.donor.id).select({_id:0, stripeCustomerId:1})
        console.log("stripe payment id of this user")
        console.log(stripePaymentMethodId)

        Donor.findById(req.session.donor.id, 'stripePaymentMethodId').then(async (donor)=>{
            const existingSub = await Subscription.find({})
            .where('donor').equals(req.session.donor.id)
            .where('amount').equals(amountInEuro)
            .where('interval').equals(req.body.interval)
            .where('organisation').equals(groupId)
            .where('active').equals(true)
            .catch((err)=>{
                res.send({"existingError": err})
            })

            if (existingSub.length > 0){
                return res.status(409).send(`You already have a ${req.body.nickname} subscription of set up with this organisation, click subscriptions in the navigation bar to see this information`)
            }

            if(!donor.stripePaymentMethodId){
                const attachedPayment =  await stripe.paymentMethods.attach(
                    req.body.payment_method,
                    {customer: customerId.stripeCustomerId}
                )
                await donor.update({
                    stripePaymentMethodId: attachedPayment.id
                })
                .catch((err)=>{
                    console.log(err)
                })
                const updatedMethodId = await Donor.findById(req.session.donor.id).select({_id:0, stripePaymentMethodId:1})
                payment_method = updatedMethodId.stripePaymentMethodId;
                console.log("this is the payment method")
                console.log(payment_method)
                const subscription = await stripe.subscriptions.create({
                    customer: customerId.stripeCustomerId,
                    items: [
                        {
                            price: req.body.priceId
                        },
                    ],
                    default_payment_method: payment_method,
                    expand:["latest_invoice.payment_intent"],
                    transfer_data : {
                        destination: orgStripeId.stripeAccountId
                    }
                })
        
                //creating new subscription 
                const newSubscription = new Subscription({
                    amount: amountInEuro,
                    interval: req.body.interval,
                    stripeSubscriptionId: subscription.id,
                    donor: donor._id,
                    organisation: org._id
                })
                await newSubscription.save()
                await Donor.findByIdAndUpdate(req.session.donor.id, {
                    $push:{subscriptions: newSubscription._id}
                })
                const subStatus = subscription['latest_invoice']['payment_intent']['status'] 
                const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
                console.log(subStatus)
                console.log(client_secret)
                res.json({
                    client_secret: client_secret, 
                    subStatus: subStatus
                })
            }
            else{
                payment_method = donor.stripePaymentMethodId
                const subscription = await stripe.subscriptions.create({
                    customer: customerId.stripeCustomerId,
                    items: [
                        {
                            price: req.body.priceId
                        },
                    ],
                    default_payment_method: payment_method,
                    expand:["latest_invoice.payment_intent"],
                    transfer_data : {
                        destination: orgStripeId.stripeAccountId
                    }
                })

                const amountInEuro = req.body.unit_amount/100
                //creating new subscription 
                const newSubscription = new Subscription({
                    amount: amountInEuro,
                    interval: req.body.interval,
                    stripeSubscriptionId: subscription.id,
                    donor: donor._id,
                    organisation: org._id
                })
                await newSubscription.save()
                await Donor.findByIdAndUpdate(req.session.donor.id, {
                    $push:{subscriptions: newSubscription._id}
                })
                const status = subscription['latest_invoice']['payment_intent']['status'] 
                const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
                console.log(status)
                console.log(client_secret)
                res.json({
                    client_secret: client_secret, 
                    status: status
                })
            }
        })
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }

})





module.exports = router;
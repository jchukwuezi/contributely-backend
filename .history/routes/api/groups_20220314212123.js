//this route will be for viewing the organisations from a donor perspective
const express = require('express')
const router = express.Router();
const Initiative = require('../../models/Initiative')
const Organisation = require('../../models/Organisation')
const Donor = require('../../models/Donor')
const groups = []
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)

//returning list of organisations on contributely
//getting the groups that match to a user based on the tags
router.get("/groups", async (req, res)=> {
    //const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1}) 
    const orgDetails =  await Organisation.find({}, 'name description _id')
    .catch((err) => {
        console.log(err)
    })

    //below is the code for the match that will only show certain groups, for now it will show all of them
    /*
    Organisation.find({}, 'tags _id' ).then((orgDetails)=>{
        const orgIdMatches = []
        for (i<0; i<orgDetails.length; i++){
            //finding the intersection of donor interest and organisation tag
            const intersec = interests.interests.filter(elem => orgDetails[i]["tags"].includes(elem))
            if (intersec.length !== 0){ //if there are some matches
                //make an array list of the organisation ids that it matches with
                orgIdMatches.push(orgDetails[i]["_id"])
                detailsOfMatches(orgIdMatches)
            }
        }
    })

    const detailsOfMatches = async (...idList) => {
        const matchedOrgs = []
        for(i<0; i < idList.length; i++){
            const detail = await Organisation.findOne({_id: i}, 'name description id')
            console.log(detail)
            matchedOrgs.push(detail)
            console.log(matchedOrgs)
            return res.send(matchedOrgs)
        }
    }

    */
    console.log(orgDetails)
    res.send(orgDetails)
})

//for a specific group, this route will return all of it's initatives
router.get("/:groupId/initiatives", async (req, res)=>{
    const id = req.params.groupId;
    console.log('id in paramter')
    console.log(id)
    //finding the initiatives of this group
    //query to get specific fields from the initiative list
   const populateQuery = [{
        path: 'initiativeList',
        select: ['title, description, goalAmount, creationDate']
    }]
    //const initiatives = Organisation.findOne({_id:id}).populate("initiativeList")
    const initiatives = await Organisation.findOne({_id:id}).populate('initiativeList')
    .catch((err) => {
        console.log(err)
    })
    console.log(initiatives.initiativeList)
    //console.log(initiatives)
    res.send(initiatives.initiativeList)
    //res.json(initatives.initiativeList)
})



router.get("/:groupId/initiatives/:initiativeId", async (req, res) => {
    const groupId = req.params.groupId
    const initiativeId = req.params.initiativeId
    //const sessDonor = req.session.donor;

    /*
    if(sessDonor){
        const initiative = await Organisation.findOne({_id:groupId}).find({'initiativeList._id': initiativeId})
        .catch((err) => {
            console.log(err)
        })
        console.log(initiative)
        res.send(initiative)   
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
    */
    //const initiative = await Organisation.findOne({_id:groupId}).find({'initiativeList._id': initiativeId})
    const initiative = await Initiative.findOne({_id:initiativeId})
    .catch((err) => {
        console.log(err)
    })
    console.log(initiative)
    res.send(initiative)   
})

//this route will allow user to make payment for specific initiative
router.post("/:groupId/:initiativeId/make-payment", async (req, res) => {
    const groupId = req.params.groupId
    const initiativeId = req.params.initiativeId
    console.log(req.params)
    //const sessDonor = req.session.donor;
    //elements needed from client to create pdf and payment data
    const {onBehalfOf, amount, email} = req.body;
    console.log(req.body)
    try{
        amountInCent = amount * 100;
        console.log(amountInCent)
        const orgStripeId = await Organisation.findById(groupId).select({_id:0, stripeAccountId:1})
        console.log("Stripe Id of org to make donation to")
        console.log(orgStripeId)
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: amountInCent,
            currency: 'eur',
            on_behalf_of: orgStripeId.stripeAccountId,
            transfer_data:{
                destination: orgStripeId.stripeAccountId
            }
        })
        console.log("Payment intent below")
        //console.log(paymentIntent)
        console.log(paymentIntent.client_secret)
        res.json({
            clientSecret: paymentIntent.client_secret
        })
    }
    catch(err){
        res.status(400).json({error: {message: err.message}})
    }
})

//in this route I will put organisation and initiative in stripe meta data
router.post("/:groupId/:initiativeId/donate", async (req, res)=>{
    const groupId = req.params.groupId
    const initiativeId = req.params.initiativeId
    //finding the group and initiative name for metadata section
    const orgStripeId = await Organisation.findById(groupId).select({_id:0, stripeAccountId:1})
    const groupName = await Organisation.findById(groupId).select({_id:0, name:1})
    const initiativeName = await Initiative.findById(initiativeId).select({_id:0, title:1})
    const {onBehalfOf, amount, email} = req.body;
    try{
        amountInCent = amount * 100;
        const paymentInfo = {
            initiativeName: initiativeName.title,
            groupName: groupName.name,
            inTheNameOf: onBehalfOf,
            amount: amount,
            email: email
        }
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: amountInCent,
            currency: 'eur',
            on_behalf_of: orgStripeId.stripeAccountId,
            transfer_data:{
                destination: orgStripeId.stripeAccountId
            },
            metadata:{
                paymentInfo
            }
        })
        console.log(paymentIntent.client_secret)
        res.json({
            clientSecret: paymentIntent.client_secret
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({error: {message: err.message}})
    }
})


//router.get("/")

module.exports = router;
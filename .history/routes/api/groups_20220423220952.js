//this route will be for viewing the organisations from a donor perspective
const express = require('express')
const router = express.Router();
const Initiative = require('../../models/Initiative')
const Organisation = require('../../models/Organisation')
const Donor = require('../../models/Donor')
const {generatePdf} = require('../../services/generatePdf')
const {sendGiftEmail} = require('../../services/email')
const groups = []
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)


//returning list of organisations on contributely
//getting the groups that match to a user based on the tags
router.get("/groups", async (req, res)=> {
    //const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1}) 
    const sessDonor = req.session.donor;
    if(sessDonor){
        const orgDetails =  await Organisation.find({}, 'name description _id')
        .catch((err) => {
            console.log(err)
        })
        console.log(orgDetails)
        res.send(orgDetails)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }

})

//for a specific group, this route will return all of it's initatives
router.get("/:groupId/initiatives", async (req, res)=>{
    const id = req.params.groupId;
    console.log('id in paramter')
    console.log(id)
    const activeInitiatives =  await Initiative.find({})
    .where('organisation').equals(id)
    .where('active').equals(true)    
    console.log(activeInitiatives)
    res.send(activeInitiatives)
})

//this is route will show a donor that isn't logged in a groups initiatives
router.get("/:groupCode/initiatives-na", async(req, res)=>{
    const groupCode = req.params.groupCode;
    const foundInitiatives = await Organisation.findOne({groupCode: groupCode}).populate("initiativeList")
    res.json(foundInitiatives.initiativeList)
})

router.get("/:groupCode/initiatives/:initiativeId-na", async (req, res)=>{
    const initiativeId = req.params.initiativeId
    const initiative = await Initiative.findOne({_id:initiativeId})
    .catch((err) => {
        console.log(err)
    })
    console.log(initiative)
    res.send(initiative)   
})


router.get("/:groupId/initiatives/:initiativeId", async (req, res) => {
    const groupId = req.params.groupId
    const initiativeId = req.params.initiativeId
    const sessDonor = req.session.donor;
    console.log("This is the donor in the session wanting to make a donation")
    console.log(req.session.donor)

    if(sessDonor){
        const initiative = await Initiative.findOne({_id:initiativeId})
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
})

//this route will allow user to make payment for specific initiative
//in this route I will put organisation and initiative in stripe meta data
router.post("/:groupId/:initiativeId/donate", async (req, res)=>{
    const groupId = req.params.groupId
    const initiativeId = req.params.initiativeId
    const sessDonor = req.session.donor;
    console.log("Printing out session data")
    console.log(req.session.donor)
    console.log(req.session)

    if(sessDonor){
        //finding the group and initiative name for metadata section
        const orgStripeId = await Organisation.findById(groupId).select({_id:0, stripeAccountId:1})
        const groupName = await Organisation.findById(groupId).select({_id:0, name:1})
        const initiativeName = await Initiative.findById(initiativeId).select({_id:0, title:1})
        const initiativeTags = await Initiative.findById(initiativeId).select({_id:0, tags:1})
        const userEmail = await Donor.findById(req.session.donor.id).select({_id:0, email: 1})
        const userName = await Donor.findById(req.session.donor.id).select({_id:0, name: 1})
        const {amount} = req.body;
        try{
            amountInCent = amount * 100;
            const paymentInfo = {
                initiativeName: initiativeName.title,
                groupName: groupName.name,
                amount: amount,
                email: userEmail.email
            }
            //to add to donation history of initiative
            const donation = {
                amount: amount,
                email: userEmail.email,
                name: userName.name
            }

            const transaction = {
                amount: amount,
                groupName: groupName.name,
                initiativeTags: initiativeTags.tags
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
                    initiativeName: initiativeName.title,
                    groupName: groupName.name,
                    inTheNameOf: userName.name,
                    amount: amount,
                    email: userEmail.email
                }
            })
            await Initiative.findById(initiativeId).update({
                $push: {donationHistory: donation}
            })
            .catch((err)=>{
                console.error(err)
            })

            console.log(transaction)

           const update = await Donor.findById(req.session.donor.id).update({
                $push: {transactions: transaction}
            })
            .catch((err)=>{
                console.error(err)
            })
            console.log(update)

            console.log(paymentIntent.client_secret)
            res.json({
                clientSecret: paymentIntent.client_secret,
                paymentInfo: paymentInfo
            })
        }
        catch(err){
            console.log(err)
            res.status(400).json({error: {message: err.message}})
        }
    }
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.post("/:groupId/:initiativeId/gift-donate", async (req, res)=>{
    const groupId = req.params.groupId
    const initiativeId = req.params.initiativeId
    const sessDonor = req.session.donor;

    if(sessDonor){
        //finding the group and initiative name for metadata section
        const orgStripeId = await Organisation.findById(groupId).select({_id:0, stripeAccountId:1})
        const groupName = await Organisation.findById(groupId).select({_id:0, name:1})
        const initiativeName = await Initiative.findById(initiativeId).select({_id:0, title:1})
        const goalAmount = await Initiative.findById(initiativeId).select({_id:0, goalAmount:1})
        const initiativeTags = await Initiative.findById(initiativeId).select({_id:0, tags:1})
        const userEmail = await Donor.findById(req.session.donor.id).select({_id:0, email: 1})
        const userName = await Donor.findById(req.session.donor.id).select({_id:0, name: 1})
        const {amount, name, email} = req.body;
        try{
            amountInCent = amount * 100;
            const paymentInfo = {
                initiativeName: initiativeName.title,
                groupName: groupName.name,
                amount: amount,
                email: userEmail.email
            }
            //to add to donation history of initiative
            const donation = {
                amount: amount,
                email: userEmail.email,
                name: userName.name
            }

            const contribution = {
                amount: amount,
                groupName: groupName.name,
                initiativeName: initiativeName.title,
                onBehalfOf: name,
                initiativeTags: initiativeTags.tags
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
                    initiativeName: initiativeName.title,
                    groupName: groupName.name,
                    giftedFor: name,
                    amount: amount,
                    email: userEmail.email
                }
            })
            await Initiative.findById(initiativeId).update({
                $push: {donationHistory: donation}
            })
            .catch((err)=>{
                console.error(err)
            })

            console.log(contribution)

           const update = await Donor.findById(req.session.donor.id).update({
                $push: {giftContributions: contribution}
            })
            .catch((err)=>{
                console.error(err)
            })
            console.log(update)

            const gen = await generatePdf(name, amount, initiativeName.title, groupName.name)
            console.log(gen)
            sendGiftEmail(email, gen, initiativeName.title, userName.name, goalAmount.goalAmount, groupName.name)
            
            console.log(paymentIntent.client_secret)
            res.json({
                clientSecret: paymentIntent.client_secret,
                paymentInfo: paymentInfo
            })
        }
        catch(err){
            console.log(err)
            res.status(400).json({error: {message: err.message}})
        }
    }
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.post("/:groupCode/:initiativeId/donate-na", async(req, res)=>{
    const groupCode = req.params.groupCode
    console.log(groupCode)
    const initiativeId = req.params.initiativeId
    //finding the group and initiative name for metadata section
    const orgStripeId = await Organisation.findOne({groupCode:groupCode}).select({_id:0, stripeAccountId:1})
    const groupName = await Organisation.findOne({groupCode:groupCode}).select({_id:0, name:1})
    console.log(orgStripeId, groupName)
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
        //to add to donation history of initiative
        const donation = {
            amount: amount,
            email: email,
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
                initiativeName: initiativeName.title,
                groupName: groupName.name,
                inTheNameOf: onBehalfOf,
                amount: amount,
                email: email
            }
        })
        await Initiative.findById(initiativeId).update({
            $push: {donationHistory: donation}
        })
        console.log(paymentIntent.client_secret)
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentInfo: paymentInfo
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({error: {message: err.message}})
    }
})

router.post("/notify-list/join/:groupId", async(req, res)=>{
    const groupId = req.params.groupId;
    const sessDonor = req.session.donor;
    if (sessDonor){
        //adding donor to notification list of that specific group
        await Organisation.findByIdAndUpdate(groupId, {
            $push:{notificationList: req.session.donor.id}
        })
        .catch((err)=>{
            console.log(err)
            return res.send(err)
        })

        //adding organisation to list of groups user will be notified
        await Donor.findByIdAndUpdate(req.session.donor.id, {
            $push:{groupsNotifiedBy: groupId}
        })
        .catch((err)=>{
            console.log(err)
            return res.send(err)
        })

        res.status(200).send('Notification list join successful')
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})


router.post("/notify-list/leave/:groupId", async(req, res)=>{
    const groupId = req.params.groupId;
    const sessDonor = req.session.donor;
    if (sessDonor){
        //removing organisation to list of groups user will be notified
        await Donor.findByIdAndUpdate(req.session.donor.id, {
            $pull:{groupsNotifiedBy: groupId}
        })
        .catch((err)=>{
            console.log(err)
            return res.send(err)
        })

        //removing donor to notification list of that specific group
        await Organisation.findByIdAndUpdate(groupId, {
            $pull:{notificationList: req.session.donor.id}
        })
        .catch((err)=>{
            console.log(err)
            return res.send(err)
        })

        res.status(200).send('Notification list removal successful')
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/notify-list/subs", async (req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
       const subs = await Donor.findById(req.session.donor.id).populate({
            path: 'groupsNotifiedBy',
            select: 'name description'
        })
        console.log(subs)
        res.send(subs.groupsNotifiedBy)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/list-status/:groupId", async(req, res)=>{
    const groupId = req.params.groupId;
    const sessDonor = req.session.donor;
    if (sessDonor){
        const status = await Donor.exists({groupsNotifiedBy : {$elemMatch: {$eq: groupId}}})
        .catch((err)=>{
            console.log(err)
        })
        console.log(status)
        res.send({"memberStatus": status})
    }
    
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})





module.exports = router;
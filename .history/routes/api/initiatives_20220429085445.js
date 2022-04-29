const express = require('express')
const router = express.Router();
const Initiative = require('../../models/Initiative')
const Organisation = require('../../models/Organisation')
const {sendStartEmail, sendEndEmail} = require('../../services/email')
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)


router.post("/add", (req, res) => {
    const sessOrg = req.session.org;
    console.log(req.session)
    console.log(req.body)
    console.log(req.session.org)
    const {title, description, goalAmount, tags} = req.body

    if(sessOrg){
        console.log('Sessions details')
        console.log(req.session)

        Organisation.findOne({_id:req.session.org.id}).then(async (org) => {
            if(!org){
                console.log("No user was found.")
                res.status(401).send('Unauthorized')
            }
            else{
                //creating an initiative 
                const newInitiative = new Initiative({
                    title: title,
                    organisation:org._id,
                    description: description,
                    goalAmount: goalAmount,
                    tags: tags
                })

                await newInitiative.save()
                await org.update({
                    $push: {initiativeList: newInitiative._id}
                });
                //an email to update members that are part of the email list
                const mailingList = await Organisation.findById(req.session.org.id).populate({
                    path: 'notificationList',
                    select: 'email -_id'
                })
                .catch((err)=>{
                    console.log(err)
                    res.send(err)
                })
                console.log(mailingList.notificationList)
                //console.log(mailingList.notificationList.map(a => a.email))
                if (mailingList.notificationList.length > 0){
                    sendStartEmail(org.name, title, goalAmount, mailingList.notificationList.map(a => a.email))
                }
                console.log('Initiative started but no donors have joined the notification list')
                res.status(200).send({successful: 'Initiative successfully created'})
            }
        })
    }

    else {
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/get", async (req, res) => {
    const sessOrg = req.session.org;

    if (sessOrg){
        const foundInitiatives = await Organisation.findOne({_id:req.session.org.id}).populate("initiativeList")
        res.json(foundInitiatives.initiativeList)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//route to view the details of a specfic initiative
router.get("/get/:initiativeId", async(req, res)=> {
    const initiativeId = req.params.initiativeId
    const sessOrg = req.session.org;
    if (sessOrg){
        const initiative = await Initiative.findOne({_id:initiativeId})
        .catch((err)=>{
            res.send({"closingError": err})
        })

        const donatedSoFar = initiative.donationHistory.reduce((n, {amount}) => n + amount, 0)
        console.log("Amount dontated so far")
        console.log(donatedSoFar)
        res.send({
            "initiativeData": initiative,
            "donatedSoFar": donatedSoFar
        })
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//route to update balance
router.patch("/update-balance/:initiativeId", async (req, res) => {
    const initiativeId = req.params.initiativeId
    const sessOrg = req.session.org;
    if (sessOrg){
        const donations = await Initiative.findOne({_id:initiativeId}).select({_id:0, donationHistory:1})
        const history = donations.donationHistory
        const balance = history.reduce((n, {amount}) => n + amount, 0)
        const value = await Initiative.findByIdAndUpdate(initiativeId, {$set: {amountToDateDonated: balance}})
        .catch((err)=>{
            res.send(error)
        })
        res.send(value)
        console.log(value)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/balance/:initiativeId", async (req, res)=>{
    const initiativeId = req.params.initiativeId
    const donations = await Initiative.findOne({_id:initiativeId}).select({_id:0, donationHistory:1})
    const history = donations.donationHistory
    const balance = history.reduce((n, {amount}) => n + amount, 0)
    res.send(balance)
})

//route to close an initiative
router.post("/close/:initiativeId", async(req, res)=>{
    const initiativeId = req.params.initiativeId
    const sessOrg = req.session.org;
    const donations = await Initiative.findOne({_id:initiativeId}).select({_id:0, donationHistory:1})
    const title = await Initiative.findOne({_id:initiativeId}).select({_id:0, title:1})
    const history = donations.donationHistory
    const balance = history.reduce((n, {amount}) => n + amount, 0)
    if(sessOrg){
    
    const close = await Initiative.findByIdAndUpdate(initiativeId, {$set:{closingDate: Date.now(), active: false, closingBalance: balance}})
        .catch((err)=>{
            res.send({"closingError": err})
        })
    console.log(close)
        //an email will be sent to update the members of this group
        const name = await Organisation.findById(req.session.org.id).select({_id:0, name:1})
        const mailingList = await Organisation.findById(req.session.org.id).populate({
            path: 'notificationList',
            select: 'email -_id'
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
        console.log(mailingList.notificationList)
        //console.log(mailingList.notificationList.map(a => a.email))
        if (mailingList.notificationList.length > 0){
            sendEndEmail(name.name, title.title, balance, mailingList.notificationList.map(a => a.email))
        }
        console.log('Initiative closed but no donors have joined the notification list')
        res.send('Initiative closed successfully')
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/:title", (req, res) => {
    const sessOrg = req.session.org;

    if (sessOrg){
        Initiative.findOne({title: req.params.title})
        .populate('initiativeList')
        .exec( (err, initiative) => {
            if(!err){
                res.send(initiative)
            }

            else{
                //checking the type of error
                if(err.kind === 'ObjectId'){
                    return res.status(404).send({
                        message: "Initiatives not found with given title " + req.params.title
                    }); 
                }

                return res.status(500).send({
                    message: "Error retrieving Initiatives with title " + req.params.title
                }); 
            }
        })
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})



module.exports = router;
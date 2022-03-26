const express = require('express')
const router = express.Router();
const Initiative = require('../../models/Initiative')
const Organisation = require('../../models/Organisation')


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
        res.send(initiative)
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
            res.send({"balanceError": err})
        })
        res.send(value)
        console.log(value)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//route to close an initiative
router.post("/close/:initiativeId", async(req, res)=>{
    const initiativeId = req.params.initiativeId
    const sessOrg = req.session.org;
    if(sessOrg){
        await Initiative.findById(initiativeId).update({active: false}, {closingDate:Date.now})
        .catch((err)=>{
            return res.send({"closingError": err})
        })
        return res.status(200).send('Initiative successfully closed')
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
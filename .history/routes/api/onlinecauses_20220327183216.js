//going to use these routes to organise the routes of online causes in a more intuitive way
const express = require('express')
const router = express.Router()
const Donor = require('../../models/Donor')
const OnlineCause = require('../../models/OnlineCause')


//getting the causes in the collections of the donor
router.get("/collection", async (req, res)=> {
    const sessDonor = req.session.donor;
    if (sessDonor){
        const collection = await Donor.findById(req.session.donor.id).populate("collection")
        .catch((err)=>{
            res.send({"closingError": err})
        })
        res.send(collection)
    }
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/collection/:causeId", async (req, res)=>{
    const sessDonor = req.session.donor;
    const causeId = req.params.causeId;
    if(sessDonor){
        const onlineCause = OnlineCause.findById(causeId)
        res.send(onlineCause)
    }
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//adding a cause to a collection

//global-giving cause by country
router.post("/collection/add/gg-country", async (req, res)=> {
    const sessDonor = req.session.donor;
    if (sessDonor){
        const {title, url, mission, themes} = req.body;
        const newCause = new OnlineCause({
            title: title,
            url: url,
            description: mission,
            categories: themes
        })
        await newCause.save()
        await Donor.findByIdAndUpdate(req.session.donor.id, {$push: newCause._id})
        .catch((err)=>{
            res.send({"collectionError": err})
        })
        res.send(`You have successfully added ${newCause.title} to your collection`)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//global giving cause by interest
router.post("/collection/add/gg-interest", async (req, res)=> {
    const sessDonor = req.session.donor;
    if (sessDonor){
        const {title, url, impact, themes, goal} = req.body;
        const goalNum = parseFloat(goal)
        const newCause = new OnlineCause({
            title: title,
            url: url,
            description: impact,
            categories: themes,
            goalAmount: goalNum
        })
        await newCause.save()
        await Donor.findByIdAndUpdate(req.session.donor.id, {$push: newCause._id})
        .catch((err)=>{
            res.send({"collectionError": err})
        })
        res.send(`You have successfully added ${newCause.title} to your collection`)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//go fund me cause
router.post("/collection/add/gfm", async (req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const {title, url, categories, goal} = req.body;
        const goalNum = parseFloat(goal)
        const newCause = new OnlineCause({
            title: title,
            url: url,
            categories: categories,
            goalAmount: goalNum
        })
        await newCause.save()
        await Donor.findByIdAndUpdate(req.session.donor.id, {$push: newCause._id})
        .catch((err)=>{
            res.send({"collectionError": err})
        })
        res.send(`You have successfully added ${newCause.title} to your collection`)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//deleting a cause to a collection
router.delete("/collection/remove", (req, res)=> {

})





module.exports = router;
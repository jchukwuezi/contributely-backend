//going to use these routes to organise the routes of online causes in a more intuitive way
const express = require('express')
const router = express.Router()
const Donor = require('../../models/Donor')
const OnlineCause = require('../../models/OnlineCause')


//getting the causes in the collections of the donor
router.get("/collection", async (req, res)=> {
    const sessDonor = req.session.donor;
    if (sessDonor){
        const collection = await Donor.findById(req.session.donor.id).populate("causeCollection")
        .catch((err)=>{
            res.send(err)
        })
        console.log('Printing the collection')
        console.log(collection)
        res.send(collection.causeCollection)
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
        const onlineCause = await OnlineCause.findById(causeId)
        console.log(onlineCause)
        res.send(onlineCause)
    }
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//adding a cause to a collection

//global-giving cause by country
router.post("/collection/add/gg-interest", async (req, res)=> {
    const sessDonor = req.session.donor;
    if (sessDonor){
        const {title, url, mission, themes} = req.body;
        const newCause = new OnlineCause({
            title: title,
            url: url,
            description: mission,
            categories: themes,
            savedBy: await Donor.findById(req.session.donor.id).select({_id:1})
        })
        await newCause.save()
        await Donor.findByIdAndUpdate(req.session.donor.id, {$push: {causeCollection: newCause._id}})
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
router.post("/collection/add/gg-country", async (req, res)=> {
    const sessDonor = req.session.donor;
    if (sessDonor){
        const {title, url, impact, themes, goal} = req.body;
        const goalNum = parseFloat(goal)
        const newCause = new OnlineCause({
            title: title,
            url: url,
            description: impact,
            categories: themes,
            goalAmount: goalNum,
            savedBy: await Donor.findById(req.session.donor.id).select({_id:1})
        })
        await newCause.save()
        await Donor.findByIdAndUpdate(req.session.donor.id, {$push: {causeCollection: newCause._id}})
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
    const {title, url, categories, goal} = req.body;
    if (sessDonor){
        const goalString = goal.replace('???', '')
        const goalNum = parseFloat(goalString)
        Donor.findById(req.session.donor.id).then(async (donor)=>{
            if(!donor){
                console.log("No user was found.")
                res.status(401).send('Unauthorized')
            }

            else{
                const newCause = new OnlineCause({
                    title: title,
                    url: url,
                    categories: categories,
                    goalAmount: goalNum,
                    savedBy: donor._id
                })
                await newCause.save()
                await Donor.findByIdAndUpdate(req.session.donor.id, {$push: {causeCollection: newCause._id}})
                .catch((err)=>{
                    res.send({"collectionError": err})
                })
                res.send(`You have successfully added ${newCause.title} to your collection`)
            }
        })
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.post("/collection/add/cf", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const {target, url, title, category} = req.body
        let targetNum = 0;
        //converting target string
        if (target.includes("stretch")){
           const split = target.split('stretch')
           const targetSplit = split[0]
           const targetString = targetSplit.replace('??', '')
           targetNum = parseFloat(targetString)
        }
        const targetString = target.replace('??', '')
        targetNum = parseFloat(targetString)
        Donor.findById(req.session.donor.id).then(async (donor)=>{
            if(!donor){
                console.log("No user was found.")
                res.status(401).send('Unauthorized')
            }

            else{
                const newCause = new OnlineCause({
                    title: title,
                    url: url,
                    categories: category,
                    goalAmount: targetNum,
                    savedBy: donor._id
                })
                await newCause.save()
                await Donor.findByIdAndUpdate(req.session.donor.id, {$push: {causeCollection: newCause._id}})
                .catch((err)=>{
                    res.send({"collectionError": err})
                })
                res.send(`You have successfully added ${newCause.title} to your collection`)
            }
        })

    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

//deleting a cause to a collection
router.delete("/collection/remove/:causeId", async (req, res)=> {
    const sessDonor = req.session.donor;
    const causeId = req.params.causeId;
    if (sessDonor){
        Donor.findOneAndUpdate({_id: req.session.donor.id}, {
            $pull:{
                'causeCollection': causeId
            }
        }, (err, model)=>{
            if(!err){
                OnlineCause.findByIdAndRemove({_id: causeId}, (err)=>{
                    if(err){
                        res.send(err)
                    } 
                    else{
                        res.send('Successfully removed cause from collection')
                    }
                })
            }
            else{
                res.status(500).send(err)
            }
        })
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})





module.exports = router;
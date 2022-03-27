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
router.post("/collection/add/gg", (req, res)=> {
    const sessDonor = req.session.donor;
    if (sessDonor){
        const {onlineCause} = req.body;
        const newCause = new OnlineCause({

        })
        await Donor.findById(req.session.donor.id)

    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.post("/collection/add/gfm", (req, res)=>{

})

//deleting a cause to a collection
router.delete("/collection/remove", (req, res)=> {

})





module.exports = router;
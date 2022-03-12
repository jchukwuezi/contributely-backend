//this route will be for viewing the organisations from a donor perspective
const express = require('express')
const router = express.Router();
const Initiative = require('../../models/Initiative')
const Organisation = require('../../models/Organisation')
const Donor = require('../../models/Donor')
const groups = []

//returning list of organisations on contributely
//getting the groups that match to a user based on the tags
router.get("/groups", async (req, res)=> {
    //const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1}) 
    const orgDetails =  await Organisation.find({}, 'name description _id')
    .catch((err) => {
        console.log(err)
    })
    res.send(orgDetails)
})

//router.get("/")

module.exports = router;
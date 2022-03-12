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
    const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1}) 
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
    res.send(orgDetails)
})

//router.get("/")

module.exports = router;
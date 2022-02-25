//going to use these routes to organise the routes of online causes in a more intuitive way
const express = require('express')
const router = express.Router()
const Donor = require('../../models/Donor')
const {getCountryUrl, getCausesByCountry, getCausesByInterests, causeListCountry, causeListInterest} = require('../../services/globalgiving')

//global giving causes

//getting 3 causes from country
router.get("/causes/global-giving/country", async (req, res)=>{
    const sessDonor = req.session.donor;
    if(sessDonor){
        Donor.findOne({_id:req.session.donor.id}).then((donor)=>{
            if(!donor){
                console.log("No user was found. This is funny because it works on post man")
                res.status(401).send('Unauthorized')
            }

            else{
                const countryCode = await donor.select({_id:0, countryCode:1})
                const url = getCountryUrl(countryCode.countryCode)
                await getCausesByCountry(url)
                res.send(causeListCountry)
            }
        })
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})



//getting a cause for interests
router.get("/causes/global-giving/interests", (req, res)=>{
    const sessDonor = req.session.donor;
    if(sessDonor){
        Donor.findOne({_id:req.session.donor.id}).then(async (donor)=>{
            if(!donor){
                console.log("No user was found. This is funny because it works on post man")
                res.status(401).send('Unauthorized')
            }

            else{
                const interests = await donor.select({_id:0, interests:1})
                if(interests.interests.length === 0){
                    res.send([])
                    console.log("no interests found for this user")
                }
                //const url = getCountryUrl(countryCode.countryCode)
                await getCausesByInterests(interests.interests)
                res.send(causeListInterest)
            }
        })
    }   

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
    //returning 3 causes
    //if there is 3 interests, a cause for each,
    //if there is 2 interests, a cause for one, two causes for the other
    //if there is 1 interest, a three causes for that interest
})


//go fund me causes
router.get("/causes/gofundme/interests", (req, res) => {
    //returning 3 causes 
    //want to do matching based off of interests with the array of gofundme categories
})

//getting the causes in the collections of the donor
router.get("/collection", (req, res)=> {

})

//adding a cause to a collection
router.post("/collection/add", (req, res)=> {

})

//deleting a cause to a collection
router.delete("/collection/add", (req, res)=> {

})





module.exports = router;
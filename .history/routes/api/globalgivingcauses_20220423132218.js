const express = require('express')
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const {commonThemes, globalGivingThemes} = require('../../data/cause-categories')
const Donor = require('../../models/Donor')
const router = express.Router()

router.get("/country", async (req, res)=>{
    const sessDonor = req.session.donor;

    if(sessDonor){
        console.log("User found in session, will attempt to get their tags/interests")
        const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1})
        if(interests.interests.length === 0){
            console.log("no interests found for this user")
            return res.send([])
        }

        const ggThemes = [...globalGivingThemes.keys()]

        //intersection between user interests and GlobalGiving themes
        const intersec = interests.interests.filter(elem=>ggThemes.includes(elem))
        if (intersec.length != 0){
            const random = intersec[Math.floor(Math.random()*intersec.length)]
            console.log(random)
            const category = random
            console.log("Getting GG causes for category " + globalGivingThemes.get(random))
            const url = getThemeUrl(globalGivingThemes.get(random))
            console.log(url)
            console.log("Printing out the result")
            const result = await getCausesByInterests2(url)
            console.log(result)
            await getCausesByInterests(url)
            res.send({
                "causeInfo": causeListInterest,
                "category": category
            })
        }

        else{
            console.log("no interests found for this user")
            return res.send([])
        }
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})

router.get("/", (req, res)=>{

})

router.get("/", (req, res)=>{

})


module.exports = router;
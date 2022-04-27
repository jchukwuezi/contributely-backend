const express = require('express')
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const {commonThemes, globalGivingThemes} = require('../../data/cause-categories')
const {getThemeUrl, getProjectUrl, getProjectThemes, specificIdUrl ,getCountryUrl} = require('../../services/globalgiving')
const Donor = require('../../models/Donor')
const router = express.Router()

router.get("/interests", async (req, res)=>{
    const sessDonor = req.session.donor;
    if(sessDonor){
        const causeList = []
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

            /*METHOD to turn api call data into json [Start] */
            const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
            const causeResponse = await fetch(url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            const data = await causeResponse.text()
            parser.parseStringPromise(data)
            .then(async (result) => {
        
                const project1 = result["projects"]["project"][0]
                const project2 = result["projects"]["project"][1]
                const project3 = result["projects"]["project"][2]
        
                const project1Obj = {
                    image: project1["imageLink"],
                    title: project1["title"],
                    country: project1["country"],
                    summary: project1["summary"],
                    country: project1["country"],
                    mission: project1["organization"]["mission"],
                    id: project1["id"],
                    url: await getProjectUrl(specificIdUrl(project1["id"])),
                    themes: await getProjectThemes(specificIdUrl(project1["id"]))
                }
        
                const project2Obj = {
                    image: project2["imageLink"],
                    title: project2["title"],
                    country: project2["country"],
                    summary: project2["summary"],
                    country: project2["country"],
                    mission: project2["organization"]["mission"],
                    id: project2["id"],
                    url: await getProjectUrl(specificIdUrl(project2["id"])),
                    themes: await getProjectThemes(specificIdUrl(project2["id"]))
                }
        
                const project3Obj = {
                    image: project3["imageLink"],
                    title: project3["title"],
                    country: project3["country"],
                    summary: project3["summary"],
                    country: project3["country"],
                    mission: project3["organization"]["mission"],
                    id: project3["id"],
                    url: await getProjectUrl(specificIdUrl(project3["id"])),
                    themes: await getProjectThemes(specificIdUrl(project3["id"]))
                }
                causeList.push(project1Obj, project2Obj, project3Obj)
                //console.log("Printing out cause list")
                //console.log(causeList)
                return res.send({
                    "causeInfo": causeList,
                    "category": category
                })
            })
            /*METHOD to turn api call data into json [End] */
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

router.get("/country", async (req, res)=>{
    const sessDonor = req.session.donor;
    const causesByCountry = []
    if(sessDonor){
        //finding the current user's country
        const countryCode = await Donor.findById(req.session.donor.id).select({_id:0, countryCode:1})
        const url = getCountryUrl(countryCode.countryCode)
        console.log(url)
        const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
        const causeResponse = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await causeResponse.text()
        parser.parseStringPromise(data)
        .then(async (result)=>{
            const project1 = result["projects"]["project"][0]
            const project2 = result["projects"]["project"][1]
            const project3 = result["projects"]["project"][2]
    
            const project1Obj = {
                image: project1["imageLink"],
                title: project1["title"],
                country: project1["country"],
                summary: project1["summary"],
                goal: project1["goal"],
                longTermImpact: project1["longTermImpact"],
                id: project1["id"],
                url: await getProjectUrl(specificIdUrl(project1["id"])),
                themes: await getProjectThemes(specificIdUrl(project1["id"]))
            }
    
            const project2Obj = {
                image: project2["imageLink"],
                title: project2["title"],
                country: project2["country"],
                summary: project2["summary"],
                goal: project2["goal"],
                longTermImpact: project2["longTermImpact"],
                id: project2["id"],
                url: await getProjectUrl(specificIdUrl(project2["id"])),
                themes: await getProjectThemes(specificIdUrl(project2["id"]))
            }
    
            const project3Obj = {
                image: project3["imageLink"],
                title: project3["title"],
                country: project3["country"],
                summary: project3["summary"],
                goal: project3["goal"],
                longTermImpact: project3["longTermImpact"],
                id: project3["id"],
                url: await getProjectUrl(specificIdUrl(project3["id"])),
                themes: await getProjectThemes(specificIdUrl(project3["id"]))
            }
            causesByCountry.push(project1Obj, project2Obj, project3Obj)
            return res.send(causesByCountry)
        })   
    }
    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})

router.get("/common", async (req, res)=>{
    const sessDonor = req.session.donor;
    if(sessDonor){
        const causeInfo = []
        const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1})
        if(interests.interests.length === 0){
            console.log("no interests found for this user")
            return res.send([])
        }
        const intersec = interests.interests.filter(elem=>commonThemes.includes(elem)) 
        if (intersec.length != 0){
            const url = getThemeUrl(globalGivingThemes.get(intersec[0]))
            const parser = xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray: false});
            const causeResponse = await fetch(url, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            const data = await causeResponse.text()
            parser.parseStringPromise(data)
            .then(async (result) => {
                const project1 = result["projects"]["project"][0]
                const project2 = result["projects"]["project"][1]
                const project3 = result["projects"]["project"][2]
        
                const project1Obj = {
                    image: project1["imageLink"],
                    title: project1["title"],
                    country: project1["country"],
                    summary: project1["summary"],
                    country: project1["country"],
                    mission: project1["organization"]["mission"],
                    id: project1["id"],
                    url: await getProjectUrl(specificIdUrl(project1["id"])),
                    themes: await getProjectThemes(specificIdUrl(project1["id"]))
                }
        
                const project2Obj = {
                    image: project2["imageLink"],
                    title: project2["title"],
                    country: project2["country"],
                    summary: project2["summary"],
                    country: project2["country"],
                    mission: project2["organization"]["mission"],
                    id: project2["id"],
                    url: await getProjectUrl(specificIdUrl(project2["id"])),
                    themes: await getProjectThemes(specificIdUrl(project2["id"]))
                }
        
                const project3Obj = {
                    image: project3["imageLink"],
                    title: project3["title"],
                    country: project3["country"],
                    summary: project3["summary"],
                    country: project3["country"],
                    mission: project3["organization"]["mission"],
                    id: project3["id"],
                    url: await getProjectUrl(specificIdUrl(project3["id"])),
                    themes: await getProjectThemes(specificIdUrl(project3["id"]))
                }
                causeInfo.push(project1Obj, project2Obj, project3Obj)
                return res.send(causeInfo)
            })
        }

        else{
            console.log("no common interests found")
            return res.send([])
        }
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }

})


module.exports = router;
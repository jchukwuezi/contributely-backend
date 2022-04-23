//this route will find scrape and return gofundme causes
const {commonThemes, goFundMeCategories} = require('../../data/cause-categories')
//console.log(goFundMeCategories)
const base_url = 'https://www.gofundme.com'
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')
const Donor = require("../../models/Donor")
const router = express.Router()

/*
router.get("/get", async (req, res) => {
    //add donor auth 
    //this will be used to find the user's interests
    //this will be hardcoded right now but it will be from the category map imported
    const url = base_url + goFundMeCategories.get("sports")
    const causeInfo = []
    //console.log(url)
    //finding first 3 causes
    const findCauseURLs = async() => {
        console.log(url)
        const data = await fetch(url)
        const pageBody = await data.text()
        const $ = cheerio.load(pageBody)
        //first 3 causes in that category
        const causeLinks = []
        $('div.grid-x.grid-margin-x.funds-contain.funds-contain--tiles-grid').find('div > div > a').each((index, elem) => {
            const causeUrl = $(elem).attr('href')
            causeLinks.push(causeUrl)
        })
        //console.log(causeLinks.slice(0, 3))
        //res.send('Route works')
        extractPageInfo(...causeLinks.slice(0,3))
    }

    const extractPageInfo = async (...links) =>{
        for (const link of links){
            let causeObj ={}
            const data = await fetch(link)
            const pageBody = await data.text()
            const $ = cheerio.load(pageBody)
            const title = $('h1.a-campaign-title').text()
            const description = $('div.o-campaign-description').text()
            const categories = $('a.m-campaign-byline-type.divider-prefix.meta-divider.flex-container.align-center.color-dark-gray.hrt-tertiary-button.hrt-base-button.hrt-link.hrt-link--gray-dark.hrt-link--unstyled').text()
            let summary = description.split('. ', 1)[0]
            summary = summary.replace(/(\r\n|\n|\r)/gm, "")
            const causeUrl = link
            const goalValue = $('span.text-stat.text-stat-title').text()
            const goalAmount = getGoalValue(goalValue)
            const imgDetails = $('div.a-image.a-image--background').attr('style')
            const imgUrl = getImgUrl(imgDetails)
            const dateCreated = $('span.m-campaign-byline-created.a-created-date').text()
            console.log(dateCreated)
            causeObj = {
                "title": title,
                "description": summary,
                "url": causeUrl,
                "goalAmount": goalAmount,
                "categories": categories,
                "image": imgUrl,
                "dateCreated": dateCreated
            }
            //console.log(causeObj)
            causeInfo.push(causeObj)
            //console.log(causeInfo.length) 
        }
        //console.log(causeInfo)
        res.send(causeInfo)    
    }

    //function to get the cause image url to send to client
    const getImgUrl = (url) => {
        //the url link is between two words, using a reg. expression to take it out
        const foundUrl = url.match("background-image:url((.*))")[1]
        //using another reg. expression to remove the brackets
        return foundUrl.replace(/[()]/g, '')
    }

    //function to get the goal value of a cause
    const getGoalValue = (goal) => {
        return goal.match("of(.*)goal")[1]
    }

    findCauseURLs();
})
*/

router.get("/get", (req, res)=>{
    const sessDonor = req.session.donor;
    if(sessDonor){
        //find donor interests
        const causeInfo = []
        const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1})
        if(interests.interests.length === 0){
            console.log("no interests found for this user")
            return res.send([])
        }
        const gfmThemes = [...goFundMeCategories.keys()]
        //intersection between user interests and Crowdfunder categories
        const intersec = interests.interests.filter(elem=>gfmThemes.includes(elem)) 
        if(intersec.length != 0){
            const random = intersec[Math.floor(Math.random()*intersec.length)]
            const category = random
            console.log("Scraping causes for category : " + category)
            const catUrl = goFundMeCategories.get(random)
            const url = base_url + catUrl

            /*METHODS TO SCRAPE GO FUNDME DATA [START] */
            const data = await fetch(url)
            const pageBody = await data.text()
            const $ = cheerio.load(pageBody)
            //first 3 causes in that category
            const causeLinks = []
            $('div.grid-x.grid-margin-x.funds-contain.funds-contain--tiles-grid').find('div > div > a').each((index, elem) => {
                const causeUrl = $(elem).attr('href')
                causeLinks.push(causeUrl)
            })
            extractPageInfo(...causeLinks.slice(0,3))

            const extractPageInfo = async (...links) =>{
                for (const link of links){
                    let causeObj ={}
                    const data = await fetch(link)
                    const pageBody = await data.text()
                    const $ = cheerio.load(pageBody)
                    const title = $('h1.a-campaign-title').text()
                    const description = $('div.o-campaign-description').text()
                    const categories = $('a.m-campaign-byline-type.divider-prefix.meta-divider.flex-container.align-center.color-dark-gray.hrt-tertiary-button.hrt-base-button.hrt-link.hrt-link--gray-dark.hrt-link--unstyled').text()
                    let summary = description.split('. ', 1)[0]
                    summary = summary.replace(/(\r\n|\n|\r)/gm, "")
                    const causeUrl = link
                    const goalValue = $('span.text-stat.text-stat-title').text()
                    const goalAmount = getGoalValue(goalValue)
                    const imgDetails = $('div.a-image.a-image--background').attr('style')
                    const imgUrl = getImgUrl(imgDetails)
                    const dateCreated = $('span.m-campaign-byline-created.a-created-date').text()
                    console.log(dateCreated)
                    causeObj = {
                        "title": title,
                        "description": summary,
                        "url": causeUrl,
                        "goalAmount": goalAmount,
                        "categories": categories,
                        "image": imgUrl,
                        "dateCreated": dateCreated
                    }
                    //console.log(causeObj)
                    causeInfo.push(causeObj)
                    //console.log(causeInfo.length) 
                }
                //console.log(causeInfo)
                res.send({
                    "category": category,
                    "causeInfo": causeInfo
                })    
            }
        
            //function to get the cause image url to send to client
            const getImgUrl = (url) => {
                //the url link is between two words, using a reg. expression to take it out
                const foundUrl = url.match("background-image:url((.*))")[1]
                //using another reg. expression to remove the brackets
                return foundUrl.replace(/[()]/g, '')
            }
        
            //function to get the goal value of a cause
            const getGoalValue = (goal) => {
                return goal.match("of(.*)goal")[1]
            }
        }

        else{
            console.log("no interests found that match the gofundme categories")
            return res.send([])
        }
    }
    
    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})



module.exports = router;
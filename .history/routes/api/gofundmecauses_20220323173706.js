//this route will find scrape and return gofundme causes
const {goFundMeCategories} = require('../../data/cause-categories')
console.log(goFundMeCategories)
const base_url = 'https://www.gofundme.com/'
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()

router.get("/get", async (req, res) => {
    //add donor auth 
    //this will be used to find the user's interests
    //this will be hardcoded right now but it will be from the category map imported
    const url = base_url + goFundMeCategories.get("sports")
    //finding first 3 causes
    const findCauseURLs = async(url) => {
        console.log(url)
        const data = await fetch(url)
        const pageBody = await data.text()
        const $ = cheerio.load()
    }

})















module.exports = router;
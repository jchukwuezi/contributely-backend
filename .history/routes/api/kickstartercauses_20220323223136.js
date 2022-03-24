//this route will be used to scrape kickstarter causes
const getCategoryUrl = (id) => {
    return 'https://www.kickstarter.com/discover/advanced?category_id=' + id + '&woe_id=23424803&sort=popularity'
}

const {KickstarterCategoryCodes} = require('../../data/cause-categories')

const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
}

router.get("/get", (req, res) =>{
    //add donor auth 
    //this will be used to find the user's interests
    //this will be hardcoded right now but it will be from the category map imported
    const base_url = getCategoryUrl(KickstarterCategoryCodes.get("Technology"))
    console.log(base_url)
    const findCauseURLs = async() =>{
        const data = await fetch(base_url, {
            headers: headers
        })
        const pageBody = await data.text()
        const $ = cheerio.load(pageBody)
        //finding the first 3 causes in that category
        /*
        $('div.js-project-group').find('div > div > div > div > div > a').each((index, elem) =>{
            const causeUrl = $(elem).attr('href')
            console.log(causeUrl)
        })
        */
        const test = $('title').text()
        console.log(test)
    }
    findCauseURLs()
})



module.exports = router;
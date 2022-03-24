//this route will be used to scrape kickstarter causes
const getCategoryUrl = (id) => {
    return 'https://www.kickstarter.com/discover/advanced?category_id=' + id + '&woe_id=23424803&sort=popularity'
}

const {KickstarterCategoryCodes} = require('../../data/cause-categories')

const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()

router.get("/get", (req, res) =>{
    //add donor auth 
    //this will be used to find the user's interests
    //this will be hardcoded right now but it will be from the category map imported
    const base_url = getCategoryUrl(KickstarterCategoryCodes.get("Technology"))
    console.log(base_url)
})



module.exports = router;
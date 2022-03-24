//this route will be used to scrape kickstarter causes
const getCategoryUrl = (id) => {
    return 'https://www.kickstarter.com/discover/advanced?category_id=' + id + '&woe_id=23424803&sort=popularity'
}

const {KickstarterCategoryCodes} = require('../../data/cause-categories')


const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()
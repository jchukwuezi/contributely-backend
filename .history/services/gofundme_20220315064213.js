//will find the country code of user, if it's not in english go-fund-me countries, the default will be ireland
const countries = ["ie", "ca",  "us", "au", "se", "gb", "no", "dk"]
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const {goFundMeCategoryURLs}= require('../../data/cause-categories.js')
const base_url = 'https://www.gofundme.com/'
const base_country = '/en-ie'
const goFundMeCauses = []


//find the urls of first three causes in the different categories
const findCauseURL = async(link) => {
    const random = (min, max) => {
        return Math.random() * (max - min) + min 
    }
    const url = base_url + link
    const data = await fetch(url)
    const pageBody = await data.text()
    const $ = cheerio.load(pageBody)
    //I want to get the first 3 cause urls
    const causeLinks = []
    $('div.grid-x.grid-margin-x.funds-contain.funds-contain--tiles-grid').find('div > div > a').each((index, elem) => {
        const causeUrl = $(elem).attr('href')
        causeLinks.push(causeUrl)
    })
    //console.log(causeLinks)
    //getting a random url in causeLinks array
    const randomCauseURL = causeLinks[Math.floor(Math.random()*causeLinks.length)]
    console.log(randomCauseURL)
    return randomCauseURL;
}

const extractPageInfo = async (url) => {
    let causeObj = {}
    //const causeDetails = []
    const data = await fetch(url)
    const pageBody = await data.text()
    const $ = cheerio.load(pageBody)
    const title = $('h1.a-campaign-title').text()
    const description = $('div.o-campaign-description').text()
    let summary = description.split('. ', 1)[0]
    summary = summary.replace(/(\r\n|\n|\r)/gm, "")
    //url will be set to the current link found
    const causeUrl = url
    const goalValue = $('span.text-stat.text-stat-title').text()
    //regular expression to get specific value
    const goalAmount = getGoalValue(goalValue)
    const imgDetails = $('div.a-image.a-image--background').attr('style')
    const imgUrl = getImgUrl(imgDetails)
    const dateCreated = $('span.m-campaign-byline-created.a-created-date').text()
    causeObj = {
        "title": title,
        "description": summary,
        "url": causeUrl,
        "goalAmount": goalAmount,
        "image": imgUrl,
        "dateCreated": dateCreated
    }
    console.log('Printing out page content in object....')
    console.log(causeObj)
    return causeObj;
}

//function to get imgUrl
const getImgUrl = (url) => {
    //the url link is between two words, using a reg. expression to take it out
    const foundUrl = url.match("background-image:url((.*))")[1]
    //using another reg. expression to remove the brackets
    return foundUrl.replace(/[()]/g, '')
}

const getGoalValue = (goal) => {
    return goal.match("of(.*)goal")[1]
}

const getGoFundMeCauses = async () =>{
    for(i =0; i<2; i++){
        const randomUrl = goFundMeCategoryURLs[Math.floor(Math.random()*causeLinks.length)]
        const causeUrl = await findCauseURL(randomUrl)
        const causeDetail = await extractPageInfo(causeUrl)
        goFundMeCauses.push(causeDetail)
    }
}

module.exports = {
    getGoFundMeCauses: getGoFundMeCauses,
    goFundMeCauses   
}






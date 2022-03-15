//will find the country code of user, if it's not in english go-fund-me countries, the default will be ireland
const countries = ["ie", "ca",  "us", "au", "se", "gb", "no", "dk"]
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const base_url = 'https://www.gofundme.com/'
const base_country = '/en-ie'
const goFundMeCauses = []

//find the urls of different categories
const findCategories = async () => {
    const res = await fetch(base_url);
    const pageBody = await res.text()
    const $ = cheerio.load(pageBody)
    const links = []
    $('div.section-categories.grid-x.small-up-2.medium-up-3.large-up-6').find('div > a').each((index, elem) => {
        //elem contains the result from the query
        const url = base_country + $(elem).attr('href')
        //links.push($(elem).attr('href'))
        links.push(url)
    })
    console.log(links)
    findCauses(...links)
}

//find the urls of first three causes in the different categories
const findCauses = async(...links) => {
    links.forEach(async (link) => {
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
        //getting the first 3 urls in causeLinks array
        const mainLinks = causeLinks.slice(0,3)
        console.log(mainLinks)
        extractPageInfo(...mainLinks)
    })
}

const extractPageInfo = async (...urls) => {
    let causeObj = {}
    urls.forEach((url)=>{
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
        //console.log(summary)
        /*
        console.log("Printing out goal value")
        console.log(goalValue)
        */
    })
}







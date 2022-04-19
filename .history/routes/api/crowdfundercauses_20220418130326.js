const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')
const puppeteer = require('puppeteer')
const router = express.Router()
const {CrowdfunderCategories} = require('../../data/cause-categories')

const base_url = 'https://www.crowdfunder.co.uk/search/projects?'
router.get("/get", (req, res) =>{
    const causeInfo = []
    const url = CrowdfunderCategories.get("Business")
    console.log(url)
    (async ()=>{
        //launching puppeteer browser
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(url)
        const pageData = await page.evaluate(()=>{
            return{
                html: document.documentElement.innerHTML
            }
        })
        const $ = cheerio.load(pageData.html)
        const links = []
        $('div.cf-f__c').find('div > div > div > div > div > article > a.cf-pod__box').each((index, elem)=>{
            //console.log($(elem).attr('href'))
            links.push($(elem).attr('href'))
        }) 
        console.log(links)
        getPageContent(...links.slice(0, 3))
    })();

    const getPageContent = async (...links) =>{
        for (const link of links){
            let causeObj = {}
            console.log(link)
            const data = await fetch(link)
            const pageBody = await data.text()
            const ch = cheerio.load(pageBody)
            const targetDays = ch('span.cf-text.cf-text--fixed14.cf-text--spacerHalf').text()
            const title = ch('title').text()
            const split = targetDays.split('target')
            const target = split[0]
            const daysLeft = split[1]
            console.log(title)
            console.log(target)
            console.log(daysLeft)
            const articleText = ch('article.cf-section.cf-section--collapse-top').text()
            console.log(articleText.substring(0, 250))
            causeObj ={
                "title": title,
                "daysLeft": daysLeft,
                "goalTarget": target,
                "url": link,
                "description": articleText
            }
            causeInfo.push(causeObj)
        }
        res.send(causeInfo)
    }
})



module.exports = router;
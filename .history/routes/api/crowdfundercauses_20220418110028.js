const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')
const puppeteer = require('puppeteer')
const router = express.Router()

const base_url = 'https://www.crowdfunder.co.uk/search/projects?'
router.get("/get", (req, res) =>{
    (async (url)=>{
        //launching puppeteer browser
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(url)
        const pageData = await page.evaluate(()=>{
            return{
                html: document.documentElement.innerHTML;
            }
        })
        const $ = cheerio.load(pageData.html)
        const links = []
        $('div.cf-f__c').find('div > div > div > div > div > article > a.cf-pod__box').each((index, elem)=>{
            //console.log($(elem).attr('href'))
            links.push($(elem).attr('href'))
        }) 
        console.log(links)

    })();

    const getPageContent = async (...links) =>{
        for (const link of links){
            console.log(link)
            const data = await fetch(link)
            const pageBody = await data.text()
            const ch = cheerio.load(pageBody)
            const title = ch('title').text()
            console.log(title)
            const target = ch('span.cf-text--dark.cf-text--thick').text()
            console.log(target)
            const articleText = ch('article.cf-section.cf-section--collapse-top').text()
            console.log(articleText.substring(0, 250))
        }
    }

})



module.exports = router;
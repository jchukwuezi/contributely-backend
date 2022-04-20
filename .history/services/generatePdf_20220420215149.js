const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');


const generatePdf = (name, amount, initiativeName, groupName) =>{
    
    const getPDFName = () =>{
        const d = new Date()
        const dateString = d.toDateString()
        return `${name} donation ${dateString}`
    }

    const data ={
        name: name,
        amount: amount,
        initiativeName: initiativeName,
        groupName: groupName
    }

    const compile = async () =>{
        const html = await fs.readFile('../views/giftDonation.handlebars', 'utf-8');
        return hbs.compile(html)(data)
    }
}

(async() =>{
    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.pdf({
            path
        })
    }

    catch(e){
        console.log('Error: ' + e)
    }
})

module.exports = {
    generatePdf: generatePdf
}
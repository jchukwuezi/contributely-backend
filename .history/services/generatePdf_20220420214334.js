const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');


const generatePdf = (name, amount, initiativeName, groupName) =>{
    const data ={
        name: name,
        amount: amount,
        initiativeName: initiativeName,
        groupName: groupName
    }
    
    const compile = async () =>{
        const html = await fs.readFile('../views/giftDonation.handlebars')
        return hbs.compile(html)()
    }
}

module.exports = {
    generatePdf: generatePdf
}
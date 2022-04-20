const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');


const generatePdf = (name, amount, initiativeName, groupName) =>{

    const compile = async () =>{
        const html = await fs.readFile('../views/giftDonation.handlebars')

    }
}

module.exports = {
    generatePdf: generatePdf
}
const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fse = require('fs-extra')
const randomstring = require('randomstring')
const rs = randomstring.generate({
    length: 5,
    charset: 'alphanumeric'
})

const generatePdf = async (name, amount, initiativeName, groupName) =>{
    console.log(name, amount, initiativeName, groupName)
    const data ={
        name: name,
        amount: amount,
        initiativeName: initiativeName,
        groupName: groupName
    }

    const compile = async () =>{
        const html = await fse.readFile('../backend/views/giftDonation.handlebars', 'utf-8');
        return hbs.compile(html)(data)
    }

    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const content = await compile()
        console.log(content)
        const pdfOptions = {
            path: `donation-${name}-${rs}.pdf`,
            format: 'a4',
            printBackground: true
        }
        await page.setContent(content)
       const buffer = await page.pdf(pdfOptions)
       console.log(pdfOptions.path)
        await page.close()
        await browser.close()
        return {
            'buffer': buffer,
            'pathName': pdfOptions.path
        }
    }

    catch(e){
        console.log('Error: ' + e)
    }
}

const generateContribution = async (name, amount, initiativeName, groupName) =>{
    console.log(name, amount, initiativeName, groupName)
    const data ={
        name: name,
        amount: amount,
        initiativeName: initiativeName,
        groupName: groupName
    }

    const compile = async () =>{
        const html = await fse.readFile('../backend/views/noauthDonation.handlebars', 'utf-8');
        return hbs.compile(html)(data)
    }

    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const content = await compile()
        console.log(content)
        const pdfOptions = {
            path: `records-${name}-${rs}.pdf`,
            format: 'a4',
            printBackground: true
        }
        await page.setContent(content)
       const buffer = await page.pdf(pdfOptions)
       console.log(pdfOptions.path)
        await page.close()
        await browser.close()
        return {
            'buffer': buffer,
            'pathName': pdfOptions.path
        }
    }

    catch(e){
        console.log('Error: ' + e)
    }
}


module.exports = {
    generatePdf: generatePdf,
    generateContribution: generateContribution
}
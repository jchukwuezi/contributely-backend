const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fse = require('fs-extra')


const generatePdf = async (name, amount, initiativeName, groupName, gifterName, email) =>{
    console.log(name, amount, initiativeName, groupName)
    const getPDFName = () =>{
        const d = new Date()
        const dateString = d.toDateString()
        return `${name} donation ${dateString}.pdf`
    }

    const pathName = getPDFName()

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
        await page.setContent(content)
        const buffer = await page.pdf({
            path: pathName,
            format: 'a4',
            printBackground: true
        });
        console.log(buffer)
        return pathName;
    }

    catch(e){
        console.log('Error: ' + e)
    }
}


module.exports = {
    generatePdf: generatePdf
}
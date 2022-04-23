const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fse = require('fs-extra')


const generatePdf = async (name, amount, initiativeName, groupName) =>{
    console.log(name, amount, initiativeName, groupName)
    const getPDFName = () =>{
        const d = new Date()
        const dateString = d.toDateString()
        return `${name} donation ${dateString}.pdf`
    }

    const data ={
        name: name,
        amount: amount,
        initiativeName: initiativeName,
        groupName: groupName
    }

    const compile = async () =>{
        const template = await fse.readFile('../backend/views/giftDonation.handlebars', 'utf-8');
        const rendered = template(data)
        return rendered;
    }

    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const content = await compile()
        console.log(content)
        await page.setContent(content)
        const buffer = await page.pdf({
            path: 'donation.pdf',
            format: 'a4',
            printBackground: true
        });
        
        return buffer;
    }

    catch(e){
        console.log('Error: ' + e)
    }

    /*
    (async() =>{
        try{
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            const content = await compile()
            console.log(content)
            await page.setContent(content)
            await page.pdf({
                path: 'donation.pdf',
                format: 'a4',
                printBackground: true
            });
        }
    
        catch(e){
            console.log('Error: ' + e)
        }
    })
    */
}


module.exports = {
    generatePdf: generatePdf
}
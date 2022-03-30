const dotenv = require('dotenv')
dotenv.config({path: '../config/config.env'})
const mailgun = require('mailgun-js')({apiKey: process.env.MAIL_GUN_API_KEY, domain: process.env.MAIL_GUN_DOMAIN})

const mailingList = ['jchukwuezi@gmail.com', 'c18709101@mytudublin.ie']


const msgData = {
    from: 'Contributely <ccontributely@gmail.com>',
    to: mailingList,
    subject: 'Hello from Mailgun test',
    text: 'Testing mailgun api batch sending feature'
}

mailgun.messages().send(msgData)
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.error(err)
})

console.log(process.env.MAIL_GUN_API_KEY)
console.log(process.env.MAIL_GUN_DOMAIN)
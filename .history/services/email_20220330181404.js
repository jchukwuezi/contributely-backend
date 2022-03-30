const dotenv = require('dotenv')
dotenv.config({path: '../config/config.env'})
const mailgun = require('mailgun-js')({apiKey: process.env.MAIL_GUN_API_KEY, domain: process.env.MAIL_GUN_DOMAIN})

const msgData = {
    from: 'Contributely <ccontributely@gmail.com>',
    to: 'jchukwuezi@gmail.com',
    subject: 'Hello from Mailgun test',
    text: 'Testing mailgun api'
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
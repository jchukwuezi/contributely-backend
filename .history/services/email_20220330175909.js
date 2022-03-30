const Mailgun = require('mailgun-js')
const dotenv = require('dotenv')
dotenv.config({path: '../config/config.env'})
const mailgun = new Mailgun(formData)


console.log('printing out api key ....')
console.log(process.env.MAIL_GUN_API_KEY)


const mgclient = mailgun.client({username: 'api', key: process.env.MAIL_GUN_API_KEY})
mailingList = ['jchukwuezi@gmail.com', 'c18709101@mytudublin.ie']

const msg = {
    from: 'Contributely <ccontributely@gmail.com>',
    to: mailingList,
    subject: 'Test Hello',
    text: 'Testing mail guns chain email'
}

mgclient.messages.create(process.env.MAIL_GUN_DOMAIN, msg)
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.error(err)
})

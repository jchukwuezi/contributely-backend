const dotenv = require('dotenv')
dotenv.config({path: '../config/config.env'})
const apiKey = 'b5f1cfdcde9c852ebb105b866d24bc3f-62916a6c-7ba94aa8'
const domain = 'sandbox8e140faf058c4914b20350dcb96f1493.mailgun.org'
const formData = require('form-data')
const Mailgun = require('mailgun-js')
const mailgun = new Mailgun(formData)
const mgclient = mailgun.client({username: 'api', key: apiKey})

mailingList = ['jchukwuezi@gmail.com', 'c18709101@mytudublin.ie']

const msg = {
    from: 'Contributely <ccontributely@gmail.com>',
    to: mailingList,
    subject: 'Test Hello',
    text: 'Testing mail guns chain email'
}

mgclient.messages.create(domain, msg)
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.error(err)
})

const mailer = require('@sendgrid/mail')
const dotenv = require('dotenv')
dotenv.config({path: '../config/config.env'})

mailer.setApiKey(process.env.SEND_GRID_API_KEY)

const emailList = ['jchukwuezi@gmail.com', 'c18709101@mytudublin.ie']

const msg = {
    to: emailList,
    from: process.env.CONTRIBUTELY_EMAIL,
    subject: 'Testing Nodemailer',
    text: 'Nodemailer works if you can read this. This is an example of sending chain mail.',
    html: '<h1> Nodemailer works if you can read this. </h1> <p> This is an example of sending chain mail. </p>'
}

mailer.sendMultiple(msg, (err, data)=>{
    if(err){
        console.log(err)
    }

    else{
        console.log('Message succesfully sent')
    }
})
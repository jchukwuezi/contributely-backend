const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config({path: '../config/config.env'})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CONTRIBUTELY_EMAIL,
        pass: process.env.CONTRIBUTELY_PASSWORD
    }
});

const emailList = ['jchukwuezi@gmail.com', 'c18709101@mytudublin.ie']


const createMailOptions = (recepient) =>{
    let mailOptions = {
        from: process.env.CONTRIBUTELY_EMAIL,
        to: recepient,
        subject: 'Testing Nodemailer',
        text: 'Nodemailer works if you can read this. This is an example of sending chain mail'
    }
    return mailOptions;
}

console.log(createMailOptions('jchukwuezi@gmail.com'))

const sendEmail = (emailAddress) => {
    transporter.sendMail(createMailOptions(emailAddress), (err, data) =>{
        if(err){
            console.log('Error occured')
            console.log(err)
        }
        else{
            console.log('Email sent successfully')
        }
    })
}

for (let i=0; i<emailList.length; i++){
    sendEmail(i)
}

/*
transporter.sendMail(createMailOptions('jchukwuezi@gmail.com'), (err, data) =>{
    if(err){
        console.log('Error occured')
        console.log(err)
    }
    else{
        console.log('Email sent successfully')
    }
})
*/


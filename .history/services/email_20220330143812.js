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


const createMailOptions = (recepient) =>{
    let mailOptions = {
        from: process.env.CONTRIBUTELY_EMAIL,
        to: recepient,
        subject: 'Testing Nodemailer',
        text: 'Nodemailer works if you can read this'
    }
    return mailOptions;
}

console.log(createMailOptions('jchukwuezi@gmail.com'))

transporter.sendMail(createMailOptions('jchukwuezi@gmail.com'), (err, data) =>{
    if(err){
        console.log('Error occured')
        console.log(err)
    }
    else{
        console.log('Email sent successfully')
    }
})


const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CONTRIBUTELY_EMAIL,
        pass: process.env.CONTRIBUTELY_PASSWORD
    }
});


const createMailOptions = (recepient) =>{
    let mailOptions = {
        from: process.env.CONTRIBUTELY_PASSWORD,
        to: recepient,
        subject: 'Testing Nodemailer',
        text: 'Nodemailer works if you can read this'
    }
    return mailOptions;
}

transporter.sendMail(createMailOptions('jchukwuezi@gmail.com'), (err, data) =>{
    if(err){
        return log('Error occured')
    }
    return log('Email sent successfully')
})


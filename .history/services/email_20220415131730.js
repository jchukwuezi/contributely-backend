const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

export const sendStartEmail = (groupName, initiativeTitle, goalAmount, ...mailingList) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CONTRIBUTELY_EMAIL,
            pass: process.env.CONTRIBUTELY_PASSWORD
        }
    })

    const handlebarOptions = {
        viewEngine:{
            partialsDir: path.resolve('../views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('../views/')
    }

    transporter.use('compile', hbs(handlebarOptions))

    const mailingOptions = {
        from: '"Contributely" <ccontributely@gmail.com>',
        to: mailingList,
        subject: 'Initiative Start !',
        template: 'initiativeStart',
        context:{
            groupName: groupName,
            initiativeTitle: initiativeTitle,
            goalAmount: goalAmount
        }
    }

    transporter.sendMail(mailingOptions, (err, info)=>{
        if(err){
            console.log(err)
        }
        console.log('Message sent' + info.response)
    })
}











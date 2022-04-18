const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const sendStartEmail = async (groupName, initiativeTitle, goalAmount, ...mailingList) =>{
    console.log('Mail test')
    //const emails = await mailingList.notificationList.map(a => a.email)
    console.log(mailingList)
    //const emails = mailingList.notificationList.map(a => a.email)
    //console.log(emails)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CONTRIBUTELY_EMAIL,
            pass: process.env.CONTRIBUTELY_PASSWORD
        }
    })

    const handlebarOptions = {
        viewEngine:{
            partialsDir: path.resolve('../backend/views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('../backend/views/')
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

const sendEndEmail = async (groupName, initiativeTitle, goalAmount, ...mailingList) =>{
    console.log('Mail test')
    //const emails = await mailingList.notificationList.map(a => a.email)
    console.log(mailingList)
    //const emails = mailingList.notificationList.map(a => a.email)
    //console.log(emails)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CONTRIBUTELY_EMAIL,
            pass: process.env.CONTRIBUTELY_PASSWORD
        }
    })

    const handlebarOptions = {
        viewEngine:{
            partialsDir: path.resolve('../backend/views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('../backend/views/')
    }

    transporter.use('compile', hbs(handlebarOptions))

    const mailingOptions = {
        from: '"Contributely" <ccontributely@gmail.com>',
        to: mailingList,
        subject: 'Initiative Start !',
        template: 'initiativeEnd',
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

module.exports = {
    sendStartEmail: sendStartEmail
}










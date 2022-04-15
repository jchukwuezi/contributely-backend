const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

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






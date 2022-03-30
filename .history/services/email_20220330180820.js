const dotenv = require('dotenv')
dotenv.config({path: '../config/config.env'})

console.log(process.env.MAIL_GUN_API_KEY)
console.log(process.env.MAIL_GUN_DOMAIN)
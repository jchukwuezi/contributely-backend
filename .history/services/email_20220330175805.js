const dotenv = require('dotenv')
dotenv.config({path: './config/config.env'})
console.log('printing out api key ....')
console.log(process.env.MAIL_GUN_API_KEY)


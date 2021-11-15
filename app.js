//entry point for the application
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//load config
dotenv.config({path: './config/config.env'})

connectDB()

const app = express()
const PORT = process.env.PORT || 4000

//routes
app.use('/', require('./routes/index')) //linking to the routes in index.js files

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
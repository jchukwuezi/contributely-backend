//---------------IMPORTS--------------------------
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser =  require('body-parser');
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const MAX_AGE = 1000 * 60 * 60 * 3; //three hours
//declaring donor route
const Donors = require('./routes/api/donors')
//declaring organisation route
const Organisations = require('./routes/api/organisations')

//load config
dotenv.config({path: './config/config.env'})


connectDB()

const app = express();

//setting up connect-mongodb-session store to store sessions in db
const mongoDBstore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions"  
})

//------------------------------------------MIDDLEWARE---------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: false})) 
app.use(cors({
    origin: 'http://localhost:3000', //location of the react app being connected to
    credentials: true
}))


app.use(session({
    name: process.env.COOKIE_NAME,
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: false,
    store: mongoDBstore,
    cookie:{
        maxAge: MAX_AGE,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
    }
}))

app.use("/api/donors", Donors);
app.use("/api/organisations", Organisations);

app.listen(4000, ()=>{
    console.log('Server has started')
})


const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser =  require('body-parser');
const dotenv = require('dotenv')
const Organisation = require('./models/Organisation')
const connectDB = require('./config/db')



//load config
dotenv.config({path: './config/config.env'})

connectDB()

const app = express();

//Middleware 
app.use(express.json())
app.use(express.urlencoded({extended: true})) 
app.use(cors({
    origin: 'http://localhost:3000', //location of the react app being connected to
    credentials: true
}))
app.use(cookieParser("secretcode"))
app.use(session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true
}));


//Routes

//post request login
app.post('/login', (req, res) => {
    console.log(req.body);
})

//post request register
app.post('/register', (req, res) => {
    console.log(req.body);
    //look for someone with the same email, will get an error or document as callback func
    Organisation.findOne({orgEmail: req.body.orgEmail}, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("Organisation already exists");
        if (!doc){ //if there's no doc
            const newOrg = new Organisation({
                name: req.body.orgName,
                email: req.body.orgEmail,
                password: req.body.orgPassword
            });
            await newOrg.save();
            res.send("Organisation created")
        }
    })

})

//get request login
app.get('/user', (req, res) => {
    console.log(req.body);
})

app.listen(4000, ()=>{
    console.log('Server has started')
})


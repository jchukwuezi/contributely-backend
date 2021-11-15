const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser =  require('body-parser');

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
})

//get request login
app.get('/user', (req, res) => {
    console.log(req.body);
})

app.listen(4000, ()=>{
    console.log('Server has started')
})


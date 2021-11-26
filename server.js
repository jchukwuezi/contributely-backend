const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser =  require('body-parser');
const dotenv = require('dotenv')
const Organisation = require('./models/Organisation')
const connectDB = require('./config/db')
const genuuid = require('uuid');
const {v4: uuid4} = require('uuid');
const MAX_AGE = 1000 * 60 * 60 * 3; //three hours
const Donor = require('./models/Donor')

//declaring donor route
const Donors = require('./routes/api/donors')




//load config
dotenv.config({path: './config/config.env'})


connectDB()

const app = express();

//setting up connect-mongodb-session store to store sessions in db
const mongoDBstore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions"  
})

//Middleware 
app.use(express.json())
app.use(express.urlencoded({extended: false})) 
app.use(cors({
    origin: 'http://localhost:3000', //location of the react app being connected to
    credentials: true
}))

/*
app.use(session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true
}));
*/
app.use(
    session({
         genid: function(req){
             console.log('session id created');
             return uuid4();
         },
         secret: process.env.SESS_SECRET,
         resave: true,
         saveUninitialized: false,
         store: mongoDBstore,
         cookie : {
             maxAge: MAX_AGE,
             secure: true,
             httpOnly: true,
             sameSite: 'none'
         }
    })
);
app.use(cookieParser("secretcode"))
//app.use(passport.initialize());
//app.use(passport.session());
//require('./config/passportConfig')(passport);



//Routes

//post request login //using the local strategy defined to authenticate users using 
/*
app.post('/login', (req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', (err, org, info) => {
        if (err) throw err;
        if (!org){
            res.send('No Organisation Exists');
            console.log('printing request body......' + req.body.email)
        } 
        else{
            req.logIn(org, (err) => {
                if(err) throw err;
                res.send('Successfully Authenticated')
                console.log(req.org)
            })
        }
    }) (req, res, next); //moves on to the next route
})
*/



//post request register
app.post('/register', (req, res) => {
    console.log(req.body);
    //look for someone with the same email, will get an error or document as callback func
    Organisation.findOne({email: req.body.orgEmail}, async (err, doc) => {
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

//register- donor
app.post("/register-donor", (req, res) => {
    console.log(req.body);

    //looking for donor that already has that email
    Donor.findOne({email: req.body.donorEmail}, async(err, doc) => {
        if (err) throw err;
        if (doc) res.send("Donor already exists")
        if(!doc){
            const newDonor = new Donor({
                name: req.body.donorName,
                email: req.body.donorEmail,
                password: req.body.donorPassword
            });
            await newDonor.save();
            res.send("Donor created")
        }
    })
})

//login-donor
app.post("/login-donor", (req, res) => {
    
})

//login functionality
app.post("/login", (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    //making sure fields are entered
    if(!email || !password){
        return res.status(400).send("Please enter all fields");
    }

    //checking for existing user
    Organisation.findOne({email}).then((org) =>{
        console.log(org);
        if (!org) res.status(400).send("User does not exist");
        bcrypt.compare(password, org.password).then((result) => {
            if (!result) res.status(400).send("Invalid credentials")

            const sessOrg = {
                id: org._id,
                name: org.name,
                email: org.email
            };
    
            req.session.org = sessOrg; //this is autosaving the session into the database
            //res.send("Logged in Successfully", sessOrg);
            res.status(200).send('Logged in Succesfully');
            console.log("Logged in successfully");
            console.log(sessOrg);
            console.log(sessOrg.id);
        });
    })
})

//logout functionality - will delete session
app.delete("/logout", (req, res) => {
    req.session.destroy((err) => {
        //delete session data from db store using sessionID in cookie
        if (err) throw err;
        res.clearCookie("session-id");
        res.send("Logged out succesfully");
    })
})

//authentication checker
//if auth, a success message and the user is sent, if not, 401 error is sent
app.get("/authchecker", (req, res) => {
    const sessOrg = req.session.org;
    if(sessOrg){
        return res.send('Authenticated Successfully', sessOrg)
    }
    else{
        return res.status(401).send('Unauthorized')
    }
})

//get organisation
//the reason you have this get user is so you can have the specific user that's logged in and call it at any time (stored in a session)
app.get('/org', (req, res) => {
    console.log(req.body);
    res.send(req.org); //stores user that has been authenticated inside of it
})

app.use("/api/donors", Donors);

app.listen(4000, ()=>{
    console.log('Server has started')
})


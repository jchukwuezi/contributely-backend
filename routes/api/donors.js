const express = require('express')
const router = express.Router()
const Donor = require("../../models/Donor")
const bcrypt = require('bcrypt')

//putting donor in an api folder to isolate it

//CRUD Functionality
router.post("/register", (req, res) => {
    console.log(res.body)
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

router.post("/login", (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    //making sure fields are entered //will put this error on the client side afterwards
    if(!email || !password){
        return res.status(400).send("Please enter all fields");
    }

    Donor.findOne({email}).then((donor) => {
        console.log(donor);
        if(!donor) res.status(400).send("User does not exist")
        bcrypt.compare(password, donor.password).then((result) => {
            if(!result) res.status(400).send("Invalid credentials")
            
            //saving a Donor into the sessions collection
            const sessDonor = {
                id: donor._id,
                name: donor.name,
                email: donor.email
            }
            
            req.session.donor = sessDonor;
            //saving session data in the different routes
            req.session.save();
            //res.status(200).send("Logged in Successfully")
            console.log(sessDonor)
            console.log(sessDonor.id)
            console.log(req.session.donor);
        })        
    })

})

//getting a specific donor
router.get("/donor", (req, res) => {
    //checking if they are authenticated first

    const sessDonor = req.session.donor;
    if(!sessDonor){
        res.status(400).send("There is no user in this session, please log in");
    }
    

    const email =  sessDonor.email;
    Donor.findOne({email}).then((donor) => {
        if (!donor)  res.status(400).send("There is no user in this session, please log in");
        res.send(donor);
    })
})

//getting the donor name in the session
router.get("/donor/name", (req, res) => {
    /*
    const sessDonor = req.session.donor;
    if(!sessDonor){
        res.status(400).send("There is no user in this session, please log in");
    }
    const name = sessDonor.name;
    res.send(name);
    */
   res.send(req.session.donor);
})

//checking if donor is authenticated 

//this line is needed to access this api route from the app.js folder
module.exports = router;
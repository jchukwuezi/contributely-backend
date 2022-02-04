const express = require('express')
const router = express.Router();
const Organisation = require('../../models/Organisation')
const bcrypt = require('bcryptjs')


//to register an organisation
router.post("/register", (req, res) => {
    const {name, email, description, password} = req.body;
    console.log('Register is being attempted')
    console.log(req.body)

    if(!name || !email || !password){
        return res.status(400).send('Please enter all fields');
    }

    Organisation.findOne({email: email}).then((org) => {
        if(org){
            console.log("a dupilcate has been found, hopefully the client sees this error")
           return res.status(400).send({error: 'Organisation already exists'})
        } 

        else{
            const newOrg = new Organisation({
                name,
                email,
                description,
                password
            });

            //hashing the password
            bcrypt.genSalt((err, salt) => 
                bcrypt.hash(newOrg.password, salt, (err, hash) => {
                    if(err) throw err;
                    newOrg.password = hash;
                    //save new organisation
                    newOrg.save()
                    .then(() => {
                        res.status(200).send({successful: `${newOrg.name} has registered for Contributely`})
                    })
                    .catch((err) => console.log(err));
                })
            );
        }
    })
})

//to log in a user and save them to the session
router.post("/login", (req, res) => {
    const {email, password} = req.body;
    console.log('Login is being attempted')
    if(!email || !password){
        return res.status(400).send('Please enter all fields')
    }

    Organisation.findOne({ email }).then((org) => {
        if(!org) return res.status(400).send('User does not exist')

        bcrypt.compare(password, org.password).then((isMatch) => {
            if(!isMatch) return res.status(400).send('Invalid credentials')
            const sessOrg = {
                id: org._id,
                name: org.name,
                email: org.email
            }

            req.session.org = sessOrg;
            console.log('Details of sessOrg')
            console.log(sessOrg)

            console.log('--------------------------------------')

            console.log('Details of req.session.org')
            console.log(req.session.org)
            req.session.save();

            console.log('Details of the entire session')
            console.log(req.session)

            res.status(200).send(`${sessOrg.name} has successfully logged in to the application`)
            console.log('User has been found')
        })

    })
})


//to check if organisation is authenticated
router.get("/auth/org", (req, res) => {
    console.log('Someone is trying to authenticate users')
    console.log('Sessions details')
    console.log(req.session)
    console.log(req.session.org)
    const sessOrg = req.session.org;
    if(sessOrg){
        console.log('User was successfully authenticated')
        //return res.json({msg: 'Authenticated Successfully', sessUser})
        //return res.status(200).send(sessUser)
        //return res.json(sessUser)
        res.send(sessOrg)
    } else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})





module.exports = router;
const express = require('express')
const router = express.Router()
const Donor = require("../../models/Donor")
const bcrypt = require('bcryptjs')


//putting donor in an api folder to isolate it

//CRUD Functionality
router.post("/register", (req, res) => {
    const {name, email, password} = req.body;
    console.log('Register is being attempted')
    console.log(req.body)

    if(!name || !email || !password){
        return res.status(400).send('Please enter all fields');
    }

    Donor.findOne({email: email}).then((donor) => {
        if (donor){
            console.log("a dupilcate has been found, hopefully the client sees this error")
           return res.status(400).send({error: 'Donor already exists'})
        } 

        else{
            const newDonor = new Donor({
                name,
                email,
                password
            });
    
            //hashing the password
            bcrypt.genSalt((err, salt) => 
                bcrypt.hash(newDonor.password, salt, (err, hash) => {
                    if(err) throw err;
                    newDonor.password = hash;
                    //save new donor
                    newDonor.save()
                    .then(() => {
                        res.status(200).send({successful: 'Sucessfully registered'})
                    })
                    .catch((err) => console.log(err));
                })
            );
        }
    })
})

router.post("/login", (req, res) => {
    const {email, password} = req.body;
    console.log('Login is being attempted')
    if(!email || !password){
        return res.status(400).send('Please enter all fields')
    }

    Donor.findOne({ email }).then((donor) => {
        if(!donor) return res.status(400).send('Donor does not exist')

        bcrypt.compare(password, donor.password).then((isMatch) => {
            if(!isMatch) return res.status(400).send('Invalid credentials')
            const sessDonor = {
                id: donor._id,
                name: donor.name,
                email: donor.email
            }

            req.session.donor = sessDonor;
            console.log('Details of sessDonor')
            console.log(sessDonor)

            console.log('--------------------------------------')

            console.log('Details of req.session.donor')
            console.log(req.session.donor)
            req.session.save();

            console.log('Details of the entire session')
            console.log(req.session)

            res.status(200).send(`${sessDonor.name} has successfully logged in to the application`)
            console.log('Donor has been found')
        })

    })
})

//to check if donor is authenticated
router.get("/auth/donor", (req, res) => {
    console.log('Someone is trying to authenticate users')
    console.log('Sessions details')
    console.log(req.session)
    console.log('Donor details stored in the session')
    console.log(req.session.donor)
    const sessDonor = req.session.donor;
    if(sessDonor){
        console.log('User was successfully authenticated')
        res.send(sessDonor)
    } else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})


//CRUD Functionality for adding tags 
router.post("/add-interests", (req, res) => {
    const sessDonor = req.session.donor;
    const tagsInput = req.body.tags
    console.log(tagsInput);

    if(sessDonor){
        console.log('User found in session, will attempt to add tags to this users account')

        //finding the current donor's details in the database and adding the tags
        Donor.findOne({_id:req.session.donor.id}).then(async (donor) => {
            if(!donor){
                console.log("No user was found. This is funny because it works on post man")
                res.status(401).send('Unauthorized')
            }

            else{
                //using find one and update
                //add to set will insure no duplicates
                await donor.update({
                    $addToSet: {
                        interests: {
                            $each : tagsInput
                        }
                    }
                })
            }
        })
    }
    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})

router.get("/get-interests", (req, res) => {
    const sessDonor = req.session.donor;

    if(sessDonor){
        console.log("User found in session, will attempt to get their tags/interests")
        Donor.findOne({_id:req.session.donor.id}).then(async(donor) => {
            if(!donor){
                console.log("No user was found. This is funny because it works on post man")
                res.status(401).send('Unauthorized')
            }
            else{
                //add code to find interests
                const interests = await Donor.findById(req.session.donor.id).select({_id:0, interests:1})
                res.send(interests)
                console.log(interests)
            }
        })
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})


//this line is needed to access this api route from the app.js folder
module.exports = router;
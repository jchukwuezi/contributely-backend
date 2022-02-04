const express = require('express')
const router = express.Router()
const Donor = require("../../models/Donor")
const bcrypt = require('bcryptjs')
const {getThemeUrl, getCountryUrl, causeListCountry, causeListInterest, getCausesByInterest, getCausesByCountry} = require('../../services/globalgiving')

//putting donor in an api folder to isolate its

//CRUD Functionality
router.post("/register", (req, res) => {
    const {name, email, password, country, countryCode} = req.body;
    console.log('Register is being attempted')
    console.log(req.body)

    if(!name || !email || !password || !country){
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
                password,
                country,
                countryCode
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
                        interests: /*tagsInput*/
                        {
                            $each : [tagsInput]
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
                //interests.interests will remove the interest title from the response
                res.send(interests.interests)
                console.log(interests.interests)
            }
        })
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})

router.get("/get-causes/interest", (req, res) => {
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
                //interests.interests will remove the interest title from the response
                //res.send(interests.interests)
                if(interests.interests.length === 0){
                    res.send([])
                    console.log("no interests found for this user")
                }

                else{
                    const url = getThemeUrl(interests.interests[0])
                    console.log(url)
                    await getCausesByInterest(url)
                   //console.log(causeList)
                    res.send(causeListInterest)
                    console.log(interests.interests)
                }

                /*
                const url = getThemeUrl(interests.interests[0])
                console.log(url)
                await getCauses(url)
               //console.log(causeList)
                res.send(causeList)
                console.log(interests.interests)
                */
            }
        })
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})

router.get("/get/country-code", async (req, res) => {
    const sessDonor = req.session.donor;

    if(sessDonor){
        //finding the current user's country
        const countryCode = await Donor.findById(req.session.donor.id).select({_id:0, countryCode:1})
        res.send(countryCode)
    }

    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})

router.get("/get-causes/country", async (req, res) => {
    const sessDonor = req.session.donor;
    if(sessDonor){
        //finding the current user's country
        const countryCode = await Donor.findById(req.session.donor.id).select({_id:0, countryCode:1})
        const url = getCountryUrl(countryCode.countryCode)
        console.log(url)
        await getCausesByCountry(url)
        res.send(causeListCountry)
    }
    else{
        console.log("No user was found. This is funny because it works on post man")
        res.status(401).send('Unauthorized')
    }
})



//this line is needed to access this api route from the app.js folder
module.exports = router;
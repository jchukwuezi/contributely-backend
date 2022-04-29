const express = require('express')
const router = express.Router()
const Donor = require("../../models/Donor")
const Subscription = require("../../models/Subscription")
const Token = require('../../models/Token')
const bcrypt = require('bcryptjs')
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)
const crypto = require('crypto')
const {sendVerificationEmail} = require('../../services/email')

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
                bcrypt.hash(newDonor.password, salt, async (err, hash) => {
                    if(err) throw err;
                    newDonor.password = hash;
                    const customer = await stripe.customers.create({
                        email: newDonor.email,
                        name: newDonor.name
                    })
                    newDonor.stripeCustomerId = customer.id
                    //save new donor
                    newDonor.save()
                    //create token
                    const token = await new Token({
                        donorId: newDonor._id,
                        token: crypto.randomBytes(32).toString("hex")
                    }).save()
                    const url = `http://localhost:4000/api/donors/verify/${newDonor._id}/${token.token}`
                    console.log(url)
                    await sendVerificationEmail(newDonor.email, url)
                    .then(() => {
                        res.status(200).send({successful: 'Sucessfully registered'})
                    })
                    .catch((err) => console.log(err));
                })
            );
        }
    })
})

router.get("/verify/:donorId/:token", async (req, res)=>{
    const donorId = req.params.donorId
    const donor = await Donor.findById(donorId)
    if(!donor){
        res.status(400).send("Invalid verification link")
    }

    const token = await Token.findOne({
        donorId: donor._id,
        token: req.params.token
    })

    if(!token){
        res.status(400).send("Invalid verification link")
    }

    //update verification to true
    await Donor.findByIdAndUpdate(donor._id, {verified: true})

    //delete token
    await Token.findByIdAndRemove(token._id)

    res.send("email verified successfully")
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
    console.log(req.body);
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


router.get("/contributions", async (req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const transactions = await Donor.findById(req.session.donor.id).populate("transactions")
        .catch((err)=>{
            res.send(err)
        })
        const contributions = transactions.transactions;
        res.send(contributions)
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/no-of-contributions", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const transactions = await Donor.findById(req.session.donor.id).populate("transactions")
        .catch((err)=>{
            res.send(err)
        })
        const contributionNum = transactions.transactions.length
        res.send({"count": contributionNum})
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/amount-contributed", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const donations = await Donor.findById(req.session.donor.id).select({_id:0, transactions:1})
        .catch((err)=>{
            res.send(err)
        })
        const amount = donations.transactions.reduce((n, {amount}) => n + amount, 0)
        res.send({"amount": amount})
    }
    
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/collection-no", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const transactions = await Donor.findById(req.session.donor.id).populate("transactions")
        .catch((err)=>{
            res.send(err)
        })
        const contributionNum = transactions.transactions.length
        res.send({"count": contributionNum})
    }
    
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/amount-gifted", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const gifts = await Donor.findById(req.session.donor.id).select({_id:0, giftContributions:1})
        .catch((err)=>{
            res.send(err)
        })
        const amount = gifts.giftContributions.reduce((n, {amount}) => n + amount, 0)
        res.send({"amount": amount})
    }
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/notifiedBy", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        const list = await Donor.findById(req.session.donor.id).populate({
            path: 'groupsNotifiedBy',
            select: 'name description tags _id'
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
        res.send({
            "groupsNotifiedBy": list.groupsNotifiedBy
        })
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/categories-donated", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        let allTags = []
        const transactions = await Donor.findById(req.session.donor.id).populate("transactions")
        .catch((err)=>{
            res.send(err)
        })

        for (let i=0; i<transactions.transactions.length; i++){
           for (let j =0; j<transactions.transactions[i].initiativeTags.length; j++){
               allTags.push(transactions.transactions[i].initiativeTags[j])
           }
        }

        console.log(allTags)
        const count = {}
        for (const elem of allTags){
            if(count[elem]){
                count[elem] += 1;
            }
            else{
                count[elem] = 1
            }
        }
        console.log(count)
        console.log(Object.keys(count))
        console.log(Object.values(count))
        //put it into the piechart on client side 
        res.send({
            categoryKeys: Object.keys(count),
            categoryValues: Object.values(count)
        }) 
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/subs-categories", async(req, res)=>{
    const sessDonor = req.session.donor;
    if (sessDonor){
        let allTags = []

        //finding tags for the organisations
        const allSubs = await Subscription.find({})
        .where('donor').equals(req.session.donor.id)
        .populate(
            {
                path: 'organisation',
                select: 'tags'
            }
        )
        .catch((err)=>{
            res.send(err)
        })

        console.log(allSubs[0].organisation.tags)

        for (let i=0; i<allSubs.length; i++){
            allSubs[i].organisation.tags.forEach(elem => {
                allTags.push(elem)
            });
        }

        console.log(allTags)
        const count = {}
        for (const elem of allTags){
            if(count[elem]){
                count[elem] += 1;
            }
            else{
                count[elem] = 1
            }
        }
        console.log(count)
        console.log(Object.keys(count))
        console.log(Object.values(count))
        res.send({
            categoryKeys: Object.keys(count),
            categoryValues: Object.values(count)
        }) 
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})


//for logging out
router.delete("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.clearCookie("session-id");
        res.send("Logged out successfully")
    })
})



//this line is needed to access this api route from the app.js folder
module.exports = router;
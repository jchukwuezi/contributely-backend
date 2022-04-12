const express = require('express')
const router = express.Router();
const Organisation = require('../../models/Organisation')
const Initiative = require('../../models/Initiative')
const bcrypt = require('bcryptjs')
const stripe = require('stripe')(process.env.STRIPE_API_TEST_KEY)
const randomstring = require('randomstring')

//to register an organisation
router.post("/register", (req, res) => {
    const {name, email, description, password, tags} = req.body;
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
                password,
                tags
            });

            //hashing the password
            bcrypt.genSalt((err, salt) => 
                bcrypt.hash(newOrg.password, salt, async (err, hash) => {
                    if(err) throw err;
                    newOrg.password = hash;

                    //creating express account in stripe
                    const account = await stripe.accounts.create({
                        email: newOrg.email,
                        country: 'IE',
                        type: 'express',
                        capabilities: {
                            card_payments: {requested: true},
                            transfers: {requested: true}
                        },
                        business_type: 'non_profit',
                        business_profile: {
                            name: newOrg.name,
                            product_description: newOrg.description
                        }
                    })
                    .catch((err)=>{
                        console.error(err)
                    })

                    console.log(account)
                    //save new organisation
                    newOrg.stripeAccountId = account.id
                    newOrg.groupCode = randomstring.generate({
                        length: 5,
                        charset: 'alphanumeric'
                    })
                    await newOrg.save()
                    res.send(account)
                    /*
                    .then(() => {
                        res.status(200).send({successful: `${newOrg.name} has registered for Contributely`})
                    })
                    .catch((err) => console.log(err));
                    */
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

        bcrypt.compare(password, org.password).then(async (isMatch) => {
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

            //res.status(200).send(`${sessOrg.name} has successfully logged in to the application`)
            //im going to have to check if org has onboarded in this route, if not a new link will be created.
            if (org.stripeActivationStatus === false){
                const accountLink = await stripe.accountLinks.create({
                    account: org.stripeAccountId,
                    refresh_url: 'http://localhost:3000/org/stripe/onboard/failure',
                    return_url: 'http://localhost:3000/org/stripe/onboard/success',
                    type: 'account_onboarding'
                })
                console.log("User still needs to be onboarded, the link for this is here:")
                console.log(accountLink)
                return res.status(202).send(accountLink.url)
            }

            console.log('User has been found and has already onboarded')
            res.status(200).send(`${sessOrg.name} has successfully logged in to the application`)
        })

    })
})

router.post("/activate-stripe", async (req, res) => {
    //const id = req.params.orgId;
    const stripeStatus = await Organisation.findById(req.session.org.id).select({_id:0, stripeActivationStatus:1})
    console.log(stripeStatus)
    if (stripeStatus) {
        await Organisation.findByIdAndUpdate(req.session.org.id, {stripeActivationStatus: true})
        .catch((err)=>{
            res.status(404).send(err)
        })
        res.send('Stripe onboarding successful')
    }
    
    else{
        res.status(409).send('Organisation has already onboarded on stripe')
    }
})

router.get("/stripe-status", async (req, res) => {
    //const id = req.params.orgId;
    const stripeStatus = await Organisation.findById(req.session.org.id).select({_id:0, stripeActivationStatus:1})
    .catch((err)=>{
        res.status(404).send(err)
    })
    console.log(stripeStatus.stripeActivationStatus)
    res.send(stripeStatus.stripeActivationStatus)
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


router.get("/available-balance", async (req, res)=>{
    const sessOrg = req.session.org;
    if (sessOrg){
        const stripeId = await Organisation.findById(req.session.org.id).select({_id:0, stripeAccountId:1})
        const accountBalance = await stripe.balance.retrieve({
            stripeAccount: stripeId.stripeAccountId
        })
        .catch((err)=>{
            res.send(err)
        })
        const trueBalance = accountBalance.available.reduce((n, {amount})=> n+amount, 0)
        console.log(trueBalance/100)
        res.send({"trueBalance": trueBalance/100})
    }   

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})
router.get("/pending-balance", async (req, res)=>{
    const sessOrg = req.session.org;
    if (sessOrg){
        const stripeId = await Organisation.findById(req.session.org.id).select({_id:0, stripeAccountId:1})
        const accountBalance = await stripe.balance.retrieve({
            stripeAccount: stripeId.stripeAccountId
        })
        .catch((err)=>{
            res.send(err)
        })
        const pendingBalance = accountBalance.pending.reduce((n, {amount})=> n+amount, 0)
        console.log(pendingBalance/100)
        res.send({"pendingBalance" : pendingBalance/100})
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/contribution-total", async (req, res) =>{
    const sessOrg = req.session.org;
    if (sessOrg){
        const activeInitiatives =  await Initiative.find({})
        .where('organisation').equals(req.session.org.id)
        let totals = []
        activeInitiatives.forEach((initiative)=>{
            const total = initiative.donationHistory.reduce((n, {amount}) => n + amount, 0)
            totals.push(total)
        })
        console.log(totals)
        const contributionTotal = totals.reduce((a, b) => a + b, 0)
        console.log(contributionTotal)
        res.send({"amount": contributionTotal})
    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/initiative-categories", async (req, res)=>{
    const sessOrg = req.session.org;
    if (sessOrg){
        let allTags = []

        const initiatives =  await Initiative.find({})
        .where('organisation').equals(req.session.org.id)

        for(let i=0; i<initiatives.length; i++){
            for(let j=0; j<initiatives[i].tags.length; j++){
                allTags.push(initatives.tags[j])
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

router.get("/subscribers", async (req, res)=>{
    const sessOrg = req.session.org;
    if (sessOrg){

    }

    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})


router.get("/initiative-count", async (req, res)=>{
    const sessOrg = req.session.org;
    if (sessOrg){
        const activeInitiatives =  await Initiative.find({})
        .where('organisation').equals(req.session.org.id)
        .catch((err)=>{
            res.send(err)
        })
        console.log(activeInitiatives.length)
        res.send({"count": activeInitiatives.length})
    }
    
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})

router.get("/contribution-count", async (req, res)=>{
    const sessOrg = req.session.org;
    if (sessOrg){
        const activeInitiatives =  await Initiative.find({})
        .where('organisation').equals(req.session.org.id)
        .catch((err)=>{
            res.send(err)
        })
        let donationNos = []
        activeInitiatives.forEach((initiative)=>{
            const history = initiative.donationHistory.length
            donationNos.push(history)
        })
        const totalDonationNo = donationNos.reduce((a, b) => a + b, 0)
        console.log(totalDonationNo)
        res.send({"count": totalDonationNo})
        //console.log(activeInitiatives.length())
        //res.send(activeInitiatives.length())
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




module.exports = router;
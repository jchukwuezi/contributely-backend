const express = require('express')
const router = express.Router();
const Initiative = require('../../models/Initiative')


router.post("/add", (req, res) => {
    const sessOrg = req.session.org;
    const {title, description, goalAmount, tags} = req.body

    //checking if there is an organisation logged in so that they can create the initiative
    if(sessOrg){
        console.log('Sessions details')
        console.log(req.session)

    }
    else{
        console.log("No user was found.")
        res.status(401).send('Unauthorized')
    }
})
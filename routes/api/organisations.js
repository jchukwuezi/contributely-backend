const express = require('express')
const router = express.Router();
const Organisation = require('../../models/Organisation')
const bcrypt = require('bcrypt')

//to register an organisation
router.post("/register", (req, res) => {
    console.log(req.body)
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

//to log in an organisation, checks if user is authenticated 





module.exports = router;
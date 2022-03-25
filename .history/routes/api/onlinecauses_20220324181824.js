//going to use these routes to organise the routes of online causes in a more intuitive way
const express = require('express')
const router = express.Router()
const Donor = require('../../models/Donor')


//getting the causes in the collections of the donor
router.get("/collection", (req, res)=> {

})

//adding a cause to a collection
router.post("/collection/add", (req, res)=> {

})

//deleting a cause to a collection
router.delete("/collection/remove", (req, res)=> {

})





module.exports = router;
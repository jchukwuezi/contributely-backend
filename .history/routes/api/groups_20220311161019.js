//this route will be for viewing the organisations from a donor perspective
const express = require('express')
const router = express.Router();
const Initiative = require('../../models/Initiative')
const Organisation = require('../../models/Organisation')
const Donor = require('/../models/Donor')
const groups = []

//returning list of organisations on contributely
router.get("/groups", (req, res)=> {
    Organisation.find({}, '')
})

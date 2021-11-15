//any route that isn't followed by something will be here
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const router = express.Router()
const Organisation = require('../models/Organisation')

//register route
/*
router.post('/register', (req, res) =>{
    console.log(req.body)
    const {name, email, password} = req.body;
    Organisation.findOne({email:email}, (err,organisation) =>{
        if(organisation){ //if organisation email already exists
            res.send({message:'user already exists'})
        }

        else{
            const organisation= new Organisation({name, email, password}) //creating user 
            organisation.save(err=>{
                if(err){
                    res.send({message: 'Succesful registration'})
                }
            })
        }         
    })
})
*/

router.post('/register', async (req, res) => {
    try {
        //creating a new organisation
        const newOrganisation ={
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        console.log(newOrganisation)
        await Organisation.create(newOrganisation)
        res.send({message: 'Succesful registration'})
    } catch (error) {
        res.json({status: 'error', error: 'Registration unsuccessful'})
    }
})

//login route
router.post('/login', (req,res) =>{
    const {email, password} = req.body;
    Organisation.findOne({email:email}, (err,organisation) =>{
        if(organisation){
            if(password === organisation.password){
                res.send({message: 'login success', organisation:organisation})
            }
            else{
                res.send({message: 'wrong credentials'})
            }
        }

        else{
            res.send('not registered')
        }
    })
})

module.exports = router
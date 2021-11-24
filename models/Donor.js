//creating donor model
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const DonorSchema = new mongoose.Schema({
    id:{
        type: mongoose.Types.ObjectId 
    },

    name: {
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    image:{
        type: String
    },

    createdAt:{
        type: Date,
        default: Date.now
    },

    interests: [

    ]
})

//hashing a password before it's being stored
DonorSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next(); //middleware function to save to DB
})
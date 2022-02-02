//creating donor model
const mongoose = require('mongoose')

const DonorSchema = new mongoose.Schema({
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

    interests: [{
        type: String
    }]
})


module.exports = mongoose.model('Donor', DonorSchema)
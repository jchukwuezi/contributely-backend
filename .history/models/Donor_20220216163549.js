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

    country:{
        type:String,
        required: true
    },

    countryCode:{ 
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
        
    ],

    //list of any causes that they may be interested in
    causeCollection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OnlineCause'
        }
    ]
        
})


module.exports = mongoose.model('Donor', DonorSchema)
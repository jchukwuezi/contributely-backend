//creating organisation model
const mongoose = require('mongoose')

const OrganisationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    description:{
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


    tags: [

    ],

    stripeAccountId:{
        type: 'String',
        required: true
    },

    memberList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor'
        }
    ],

    initiativeList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Initiative'
        }
    ]

})

module.exports = mongoose.model('Organisation', OrganisationSchema)

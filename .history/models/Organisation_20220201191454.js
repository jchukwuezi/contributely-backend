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


    tags: [{
            type: String
        }
    ],

    memberList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor'
        }
    ]

})

module.exports = mongoose.model('Organisation', OrganisationSchema)

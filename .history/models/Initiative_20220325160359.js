const mongoose = require("mongoose")

const InitiativeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    //referencing the organisaiton that created the initiative
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation'
    },

    description:{
        type: String,
        required: true
    },

    goalAmount:{
        type: Number,
        required: true,
        default: 0
    },

    totalAmountDonated:{
        type: Number,
        default: 0
    },

    tags: [

    ],

    creationDate:{
        type: Date,
        default: Date.now
    },

    active:{
        type: Boolean,
        default: false
    },

    closingDate:{
        type: Date,
    },

    donationHistory: [
        {
            amount: Number,
            email: String,
            date: Date
        }
    ]

})

module.exports = mongoose.model('Initiative', InitiativeSchema)
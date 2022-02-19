const mongoose = require('mongoose')

//this needs to be as flexible as possible for all causes found online
const OnlineCauseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    url:{
        type: String,
        required: true
    },

    description:{
        type: String
    },

    image:{
        type: String
    },

    goalAmount:{
        type: Number
    },

    totalAmountDonated:{
        type: Number
    },

    savedAt: {
        type: Date,
        default: Date.now
    },

    savedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor"
    }
    
})

module.exports = mongoose.model('OnlineCause', DonorSchema)
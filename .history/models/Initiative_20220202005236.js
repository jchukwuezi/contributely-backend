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

    tags: [{
        type: String
    }],

    creationDate:{
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        required: true
    },

    endedAt:{
        type: Date,
    }

})

module.exports = mongoose.model('Initiative', InitiativeSchema)
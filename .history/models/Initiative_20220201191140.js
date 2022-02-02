const mongoose = require("mongoose")

const InitiativeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
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

    creationDate:{
        type: Date,
        default: Date.now
    },

    endedAt:{
        type: Date,
    }

})
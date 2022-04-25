const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: true
    },

    token:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Token', TokenSchema)
const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },

    startDate:{
        type: Date,
        default: Date.now
    },

    interval:{
        type: String,
        required: true
    },

    cancelDate:{
        type: Date,
    },

    stripeSubscriptionId:{
        type: String,
        required: true
    },

    donor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor"
    },

    organisation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organisation"
    }
})

module.exports = mongoose.model('Subscription', SubscriptionSchema)
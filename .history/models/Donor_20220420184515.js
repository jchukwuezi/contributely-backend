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

    stripeCustomerId: {
        type: String,
        required: true
    },

    stripePaymentMethodId:{
        type: String
    },

    //list of any causes that they may be interested in
    causeCollection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OnlineCause'
        }
    ],

    transactions: [
        {
            amount: {type: Number},
            date:{
                type: Date,
                default: Date.now
            },
            groupName:{
                type: String
            },
            initiativeTags:[

            ]
        }
    ],

    giftContributions:[
        {
            amount: {type: Number},
            date:{
                type: Date,
                default: Date.now
            },
            onBehalfOf:{
                type: String
            },
            groupName:{
                type: String
            },
            initiativeName:{
                type: String
            },
            
            initiativeTags:[

            ]
        }
    ],

    groupsNotifiedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organisation'
        }
    ],
    
    subscriptions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscription'
        }
    ]
        
})


module.exports = mongoose.model('Donor', DonorSchema)
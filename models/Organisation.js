//creating user model
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const OrganisationSchema = new.mongoose.Schema({
    id:{
        type: mongoose.Types.ObjectId
    },

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


    tags: [

    ],

    members: [

    ]

})

//before saving it, this function will be called
OrganisationSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    //taking the password
    this.password = await bcrypt.hash(this.password, salt)
    next(); //middleware function to save to DB
})

module.exports = mongoose.model('Organisation', OrganisationSchema)
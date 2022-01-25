const mongoose = require('mongoose')

//connecting to the database
const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1); //1 = exit process with failure
    }
}

module.exports = connectDB;
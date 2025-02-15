const mongoose = require('mongoose')


const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology :true ,useNewUrlParser: true})
        console.log('MongoDB connected')
    }catch(err)
    {
        console.log(err.message)
        process.exit(1)
    }
}
module.exports = connectDB
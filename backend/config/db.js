// const mongoose = require('mongoose')


// const connectDB = async ()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology :true ,useNewUrlParser: true})
//         console.log('MongoDB connected')
//     }catch(err)
//     {
//         console.log(err.message)
//         process.exit(1)
//     }
// }
// module.exports = connectDB
import { connect } from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing. Add your MongoDB connection string to backend/.env.');
    return false;
  }

  try {
    await connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    return false;
  }
};

export default connectDB;

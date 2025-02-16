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
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

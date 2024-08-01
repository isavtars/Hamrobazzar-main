const mongoose = require("mongoose");



const connectDatabase =()=>{
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.DB_URL,{}).then(()=>{
          
      console.log("dbconnected sucessfully");
  }).catch((err)=>{
      console.log(err)
  })
}

module.exports = connectDatabase;


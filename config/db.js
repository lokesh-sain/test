require('dotenv').config();
const mongoose = require('mongoose');

function connectDB(){
    //db connection 

    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true })
        
     const connection = mongoose.connection;

     connection.once('open',()=>{
        console.log('Database connected');
     }).on('error', function (err) {
        console.log(err);
        throw err;
      });
     
}

module.exports=connectDB;
const connectDB = require('../config/db')
connectDB();
const fs = require('fs');
const File = require('../models/file');

async function deleteData(){
    //convert the milseconds into date.
    const pastDate = new Date(Date.now() - (24*60*60*1000));
     const files = await File.find({createdAt:{$lt:pastDate}});
    if(files.length){
        for(const file of files){
           try{
            fs.unlinkSync(file.path);
            await file.remove();
            console.log(`successfully deleted ${file.fileName}`);
           }catch(err){
            console.log(`Error while deleting file ${err}`);
           }
        }
        console.log(`Job Done!`);
    }else{
        console.log(`all files in the range of 24hr.`);
    }
}
module.exports=deleteData;
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4: uuid4} = require('uuid');


let storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'uploads/')},
    filename:(req,file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
});

let upload = multer({
    storage:storage,
    limits:{fileSize:1000000 * 100}
}).single('myFile');

const calculateFileSize=(bytes,decimalPoint)=> {
    if(bytes == 0) return '0 Bytes';
    let k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }


router.post("/",(req,res)=>{
    // store file
    upload(req,res, async (err)=>{
    //validate request
   
    if(!req.file){
        return res.json({error:"File is required for uploading.."});
    }

        if(err){
            return res.status(500).send({error:err.message});
        }
        // add into database
        const fileSave = new File({
            fileName: req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:calculateFileSize(req.file.size)
        });
        const response = await fileSave.save();
        return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
    });
})

router.post("/send",async(req,res)=>{

    const {uuid,emailTo,emailFrom}= req.body;

    if(!uuid|| !emailTo || !emailFrom ){
      return res.status(422).send({Error:"All fields are required."});
    }

   
    const fetchRecord= await File.findOne({uuid:uuid});
    
    if(fetchRecord.sender){
       return res.status(422).send({Error:"Email Already Sent."});
    }

    //update details in db
    fetchRecord.sender = emailFrom;
    fetchRecord.receiver = emailTo;
 
        const savetoDb = await fetchRecord.save();
  

    //send email
    const sendMail = require('../services/emailService');
   const emailResponse =  sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'QuickShare - Easy File Sharing || Download Your File',
        text:`${emailFrom} shared a file with you.`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${fetchRecord.uuid}`,
            size: fetchRecord.size,
            expires:"24 Hours"
        })
    });
    if(emailResponse){
        return res.send({success:true});
    }else{
        return res.send({error:'Something Went Wrong.'});
    }

})
module.exports = router;
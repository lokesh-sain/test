const router = require('express').Router();
const File = require('../models/file');

router.get("/:uuid",async(req,res)=>{
    try{
        const fetchFile = await File.findOne({uuid:req.params.uuid});
        if(!fetchFile){
            return res.status(410).render('error404',{error:'Link has been expired or page not exist.',title:"QuickShare - Page Not Exist!"});
        }
        const filePath = `${__dirname}/../${fetchFile.path}`;
        res.download(filePath);
    }catch(err){
        return res.status(500).render('error404',{error:'Something Went Wrong',title:"500 Internal Error"});
    }
});
module.exports=router;
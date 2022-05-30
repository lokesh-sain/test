const router = require('express').Router();
const File = require('../models/file');


router.get("/:uuid",async (req,res)=>{
   try{
    const fetchFile = await File.findOne({uuid:req.params.uuid});
        if(!fetchFile){
            return res.status(404).render('error404',{error:'404 Page Not Found.',title:'QuickShare - Page Not Exist.'});
        }
        return res.render('download',{
            uuid:fetchFile.uuid,
            filename:fetchFile.fileName,
            size:fetchFile.size,
            downloadLink:`${process.env.APP_BASE_URL}/files/download/${fetchFile.uuid}`,
            title:"QuickShare - Download Your File"
        });
   }catch(err){
        return res.render('error404',{error:'Something Went Wrong',title:'QuickShare Please Try Again.'});
   }
})

module.exports=router;
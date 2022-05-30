const express = require('express');
const app =express();
const PORT =  process.env.PORT || 3000;
const cors = require('cors');

//enable json data
app.use(express.json());

//db settings
const connectDB = require('./config/db')
connectDB();

//cors configurations
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions));


//Routes configurations
app.use('/api/files/',require('./routes/files'));
app.use('/files',require('./routes/downloadPage'));
app.use('/files/download',require('./routes/startDownload'));

//template engine
app.set("view engine","ejs");

//static files serve
app.use(express.static('static'));


//default routes
app.get("/",(req,res)=>{
   return res.render('index',{title:"QuickShare - Easy File Sharing"});
});

app.get("*",(req,res)=>{
    return res.status(404).render('error404',{error:'404 Page Not Found.',title:'QuickShare - Page Not Found.'});
 });

//scheduler 
const cron = require('node-cron');
const scheduler = require('./services/scheduler')
cron.schedule('*/10 * * * *', () => {
    scheduler();
});

app.listen(PORT,()=>{console.log(`running on port ${PORT}`)});
const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get('/',(req,res)=>{
    //
    console.log("session값",req.session);
    console.log("nickname",req.session.nickname);
    if(req.session.is_logined){
        res.redirect(`/home?${req.session.nickname}`);
    }
    else{
    console.log('login page!!');
    
    fs.readFile("./views/login.html",(err,data)=>{
        if(err){
            res.send("error");
        }else{
            res.write(data);
            console.log("안 열어??")
            
            res.end();

        }
    });}
});

router.get('/home',(req,res)=>{
    console.log('home page!!');
    if(req.session.is_logined){
    fs.readFile('./views/home.html',(err,data)=>{
        if(err){
            res.send('error');
        }else{
            res.write(data);
            res.end();
        }
    })}
    else{
        res.redirect('/');
    }
})

module.exports = router;

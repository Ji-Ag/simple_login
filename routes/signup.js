const express = require('express');
const router = express.Router();
const fs = require('fs');
const verifyToken = require('../express_session');

router.get('/',(req,res)=>{
    console.log(req.verifyToken);
    console.log('sign up page!');
    if(req.session.is_logined){
        res.redirect(`/home?${req.session.nickname}`);
    }
    fs.readFile('./views/signup.html',(err,data)=>{
        if(err){
            res.send(err);
        }else{
            res.write(data);
            res.end();
        }
    });
});

module.exports = router;
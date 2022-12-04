const express = require('express');
const router = express.Router();
const mysql = require("../../mysql/users.js");
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var jwt = require('jsonwebtoken');
//var FileStore= require('session-file-store');
var {verifyToken} = require('../.././express_session')
require("dotenv").config();

router.get("/checking_userid",async(req,res)=>{
    console.log("here is server");
     var index ='0';
   const existid = await mysql.query("getID");

  //body에 값이 전달되지 않아 query형태로 전달받음
  console.log(req.query);
 //req.on()메서드로 클라이언트와 바인딩. 없으면 동작x
     let body =''; //왜 body는 null?
        req.on('data',(data)=>{
         body += data;
     });
   
    req.on('end',()=>{
        
        console.log('받은 이름',req.query); 
        for(i in existid){
            
            if(req.query.id===existid[i].userid){
                index = '-1';
                console.log("같아");
                res.data = index;
                return res.end(index); //res.end()해야 클라이언트에게 정보 전달하고 끝남
               // res.end(index);
                //같은 id 발견하자마자 res.end 하고싶어
            }
        }
        res.end(index);
       
    })

});


router.post("/registerUser", async(req,res)=>{
    console.log("신규회원 등록중");
        let body ='';
            req.on('data',(data)=>{
            body += data;
            
        });
        //디코딩
        var decodedPwd = Buffer.from(req.body[1], "base64").toString('utf8');
        console.log("디코딩한 비번", decodedPwd);
   
        //암호화
        var userSalt = '';
        
    var opts = {
      password: decodedPwd,
     // salt : 10
    };
    
    hasher(opts, async function(err, pass, salt, hash) {
      opts.salt = salt;
      
        userSalt = salt;
        
        

    var sql={
        userid : req.body[0],
        pwd : hash,
        salt : salt
    }
    await mysql.query("userInsert", sql);
    res.data = "회원가입성공";
    var token = jwt.sign(
        {
            id: req.body[0]
        }, process.env.SECRETE,
        {
            expiresIn :"15m",
            issuer : "토큰발급자",
           // store:new FileStore(),
            
        },
        
    )
    
   return res.status(200).json({

        data : 1,
        code: 200,
        message:"toekn is created",
        token : token,
    });; 
        });
    //  });
   // });
    
      
    
});

router.get("/logincheck",async (req,res)=>{
    console.log("유효성체크중")
   
    const existid = await mysql.query("getID");
    
    var body = '';
    req.on('data',(data)=>{
        body += data;
    })
    req.on('end',async ()=>{
        console.log(req.query.userid);
        console.log(req.query.userpwd);
        for(i in existid){
            if(req.query.userid===existid[i].userid){
                console.log("등록된 회원, 비번일치하는지 확인하자")
               //디코딩
               var decodedPwd = Buffer.from(req.query.userpwd, "base64").toString('utf8');
                const existpwd = await mysql.query("getPassword", req.query.userid);
               
                 //암호화
                var opts = {
                password: decodedPwd,
                salt : existpwd[0].salt
                };
              
                hasher(opts,async function(err, pass,salt, hash) {
                    if(existpwd[0].pwd === hash){
                        console.log("로그인 성공!");
                        var token = jwt.sign(
                            {
                                id: req.query.userid,
                            }, process.env.SECRETE,
                            {
                                expiresIn :"1m",
                                issuer : "토큰발급자",
                              
                            },
                            
                        )//res 하기 전에 req.session내용 저장
                        req.session.is_logined = true;
                        req.session.nickname = req.query.userid,
                        console.log("session값:",req.session);

                        res.status(200).json({
                            data : 1,
                            code: 200,
                            message:"token is created",
                            token : token,
                        });; 
                        //session setting
                        
                        return ;
                    }else{
                            res.end("비밀번호 일치하지 않음");
                            return;
                        }   
                    }) //
                   
                
            }
           


        } //hasher보다 먼저 실행되어 1초 기다리게 함
        setTimeout(()=>{res.end("존재하지 않는 아이디")},100)
        
        
    })
    
});

    router.post('/logout',(req,res)=>{
        console.log("로그아웃 전 세션",req.session);
        req.session.destroy((err)=>{
          //  res.clearCookie();
            console.log("destroyed session!!!");
            res.end();
            //res.redirect('/');  여기서 호출하면 login페이지로 이동이 안 됨=> req에서 호출 

            
        });
        
    })

//토큰 유효성 확인
router.get('/payload', verifyToken, (req, res) => {
    const id = req.decoded.id;
   
    return res.status(200).json({
      code: 200,
      message: '토큰은 정상입니다.',
      data: {
        id: id,
       
      }
    });
  });

module.exports = router;

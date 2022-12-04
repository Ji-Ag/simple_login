var express = require('express');
var path = require('path');
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bkfd2Password = require('pbkdf2-password');
var session = require('express-session')
var FileStore= require('session-file-store')(session);
require("dotenv").config();

// console.log(process.env.LIMIT)
// console.log(process.env.HOST)
// console.log(process.env.PORT)
// console.log(process.env.DB_USER)
// console.log(process.env.PASSWORD)
// console.log(process.env.DB)

var jwt = require('jsonwebtoken');

var app = express();


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));//이거없이 html에서 stylesheets접근 불가 

app.use(session({
    secret :  "secrete_key",
    resave : false,
    saveUninitialized : true,
    store : new FileStore({logFn: function(){}}),
    is_logined : false,
    
}))

var loginRouter = require("./routes/login");
var singupRouter = require("./routes/signup");

var usersRouter = require("./routes/api/users");


app.use('/', loginRouter);
app.use('/signup', singupRouter);

//crud 수행할 라우터
app.use('/serverclient',usersRouter);




app.use(bkfd2Password);//얘 위로 올리니 오류남
//app.use(hasher);
module.exports = app;
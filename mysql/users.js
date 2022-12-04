const mysql = require('mysql');
const sql = require('./sql.js');
require("dotenv").config();

const pool = mysql.createPool({
    connectionLimit : process.env.LIMIT, //10, //
    host :process.env.HOST, //'localhost', // 로컬호스트로 하니까 오류남
    port : process.env.PORT, //'3306',//
    user : process.env.DB_USER, //'dev01',//
    password : process.env.PASSWORD, //'1234',//
    database :  process.env.DB // 'kwic',//
});

const query = async (alias,values)=>{
    return new Promise((reslove,reject)=>
    pool.query(sql[alias],values,(error,results)=>{
        if(error){
            console.log(error);
            reject({
                error,
            });
        }else reslove(results);
        })
    );
};

module.exports ={
    query,
}
//

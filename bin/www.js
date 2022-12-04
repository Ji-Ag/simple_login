const express = require('express');
const http = require('http');

const app = require('../app.js');
var PORT = 4000;

var server = http.createServer(app);

server.listen(PORT,()=>{
    console.log('4000PORT listening');
});


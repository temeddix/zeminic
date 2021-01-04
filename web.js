const express = require('express');
const fs = require('fs')
const bp = require('body-parser');
const util = require("util");
const Base = require("./deok-modules/ajax/base/base");

const MongoConnection = require("./deok-modules/ajax/static/MongoConnection");
MongoConnection.connect();
const Login = require("./deok-modules/ajax/Login");
const UsersAPI = require('./deok-modules/ajax/UsersAPI');

const app = express();


app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use(Login);
app.use(UsersAPI);
app.use(function(req,res,next){
    console.log("디버깅용 : 로그인여부 ",req.isAuthenticated());
    next();
});

app.use(express.static("public"));


let myport = 80;
app.listen(process.env.PORT || myport, () => console.log('app listening on port',myport,'!'));
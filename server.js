
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶NPM 모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const http = require('http');
//http server를 열기 위한 모듈
const fs = require('fs');
//파일 io를 위한 모듈
const url = require('url');
//url string parsing module
const mongoose = require('mongoose'); 
//mongo db를 편하게 액세스 하기 위한 모듈
const express = require('express');
//http 라우팅을 편리하게 할 수 있는 모듈
const path = require('path');
const expressSession = require('express-session');
//middleware for session management
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportLocal = require('passport-local');
const connectMongo = require('connect-mongo');
const compression = require('compression');
const util = require("util");








/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-클라이언트 연결관계
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

let server = new express();
server.set('view engine', 'ejs');
//간단한 서버쪽 렌더링(SSR) ejs 템플릿엔진을 사용 가능하게 해 줌. NPM까지 알아서 로드하나 보네.
server.set('views', './ejs-template/')
//그럼 템플릿엔진이 어떤 폴더에서 템플릿 파일(views)들을 꺼낼 것인가? 바로 이 폴더다.
server.use(cookieParser());
//request.cookies 를 만들어 줌.
server.use(bodyParser.urlencoded({ extended: false }));
// HTTP 요청(request) 중 형식(type)이 'application/x-www-form-urlencoded'인 것들에게 request.body를 만들어 줌.
server.use(bodyParser.json());
// HTTP 요청(request) 중 내용 형식(type)이 'application/json'인 것들에게 request.body를 만들어 줌.
server.use(bodyParser.text());
// HTTP 요청(request) 중 내용 형식(type)이 'text/plain'인 것들에게 request.body를 만들어 줌.
server.use(compression());
//응답(response)을 보낼 때 압축해서 보내서 빨라짐.
server.use(express.static('public'));
//이 폴더들 속 파일에 클라이언트가 맘대로 접근 가능. 즉 개방됨.

//덕 백엔드 @DEOK
const Login = require("./server-modules/ajax/Login"); //로그인 api
const UsersAPI = require('./server-modules/ajax/UsersAPI'); //회원 api
const ComicsAPI = require("./server-modules/ajax/ComicsAPI"); //웹툰정보 api

server.use(Login);
server.use(UsersAPI);
server.use(ComicsAPI);
server.use(function(req,res,next){
    console.log("디버깅용 : 로그인여부 ",req.isAuthenticated());
    next();
});
server.use("/test",express.static("server-modules\\test"));







/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-데이터베이스 연결관계
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const MongoConnection = require("./server-modules/ajax/static/MongoConnection"); //덕이 쓰고 동현이 옮겨옴
MongoConnection.connect(); //덕이 쓰고 동현이 옮겨옴







/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶뷰(Vue) 페이지 요청에 대한 응답
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

server.get
(
    '/*',
    function(req, res){
        res.sendFile('./public/index.html')
    }
);








/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶가동 시작!!
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const port = process.env.PORT || 80;
server.listen
(
    port,
    function(){ console.log(`Example app listening at http://localhost:${port}`); }
);
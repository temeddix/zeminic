
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶NPM 모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
const express = require('express');
//http 라우팅을 편리하게 할 수 있는 모듈

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const historyFallback = require('connect-history-api-fallback');
// single-page-app을 만들기 위해 주소를 기본값인 /로 속여서 index.html을 응답하는 역할



/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-클라이언트 연결관계
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

let server = new express();
server.use(cookieParser());//request.cookies 를 만들어 줌.
server.use(bodyParser.urlencoded({ extended: false }));// HTTP 요청(request) 중 형식(type)이 'application/x-www-form-urlencoded'인 것들에게 request.body를 만들어 줌.
server.use(bodyParser.json());// HTTP 요청(request) 중 내용 형식(type)이 'application/json'인 것들에게 request.body를 만들어 줌.
server.use(bodyParser.text());// HTTP 요청(request) 중 내용 형식(type)이 'text/plain'인 것들에게 request.body를 만들어 줌.
server.use(compression());//응답(response)을 보낼 때 압축해서 보내서 빨라짐.
server.use(historyFallback());//잘못된 주소를 모두 static 폴더로 안내해 줌. 즉 잘못된 주소로는 모두 index.html이 응답됨. 404는 없는 셈.
server.use(express.static('dist'));//이 폴더들 속 파일에 클라이언트가 맘대로 접근 가능. 즉 개방됨.

//덕 백엔드 @DEOK
const Login = require("./backend/ajax/Login"); //로그인 api
const UsersAPI = require('./backend/ajax/UsersAPI'); //회원 api
const ComicsAPI = require("./backend/ajax/ComicsAPI"); //웹툰정보 api
const ChaptersAPI = require("./backend/ajax/ChaptersAPI");

server.use(Login);
server.use(UsersAPI);
server.use(ComicsAPI);
server.use(ChaptersAPI);
server.use(function(req,res,next){
    console.log("디버깅용 : 로그인여부 ",req.isAuthenticated());
    next();
});
server.use("/test",express.static("./backend/test"));






/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-데이터베이스 연결관계
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const MongoConnection = require("./backend/ajax/static/MongoConnection"); //덕이 쓰고 동현이 옮겨옴
MongoConnection.connect(); //덕이 쓰고 동현이 옮겨옴







/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶뷰(Vue) 페이지 요청에 대한 응답
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

server.get
(
    '/*',
    function(req, res){
        res.sendFile('./dist/index.html');
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
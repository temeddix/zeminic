







/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶NPM 모듈 로드
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/*
	어맛 내코드 누가 건드렸어! 하고 화들짝 놀라지 마셈
	여기 모듈로드부분에 주석단거 말고는 안건드렸어 ㅋㅋㅋ
    이렇게 모듈 로드 코드별로 간단하게 모듈 소개를 해주면 좋을듯함 -덕 (2020.07.16 12:53am)
    오키 알았어
    참고로 이제 'Passport-좀-되게-해보자' 브랜치(branch)에서 병합중이야 - 동현
*/
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
const ejs = require('ejs');
const compression = require('compression');








/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-클라이언트 연결관계
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

let router = new express();
router.set('view engine', 'ejs');
//간단한 서버쪽 렌더링(SSR) ejs 템플릿엔진을 사용 가능하게 해 줌. NPM까지 알아서 로드하나 보네.
router.set('views', './ejs-template/')
//그럼 템플릿엔진이 어떤 폴더에서 템플릿 파일(views)들을 꺼낼 것인가? 바로 이 폴더다.
router.use(cookieParser());
//request.cookies 를 만들어 줌.
router.use(bodyParser.urlencoded({ extended: false }));
// HTTP 요청(request) 중 형식(type)이 'application/x-www-form-urlencoded'인 것들에게 request.body를 만들어 줌.
router.use(bodyParser.json());
// HTTP 요청(request) 중 내용 형식(type)이 'application/json'인 것들에게 request.body를 만들어 줌.
router.use(bodyParser.text());
// HTTP 요청(request) 중 내용 형식(type)이 'text/plain'인 것들에게 request.body를 만들어 줌.
router.use(compression());
//응답(response)을 보낼 때 압축해서 보내서 빨라짐.
router.use(express.static('public'));
//이 폴더들 속 파일에 클라이언트가 맘대로 접근 가능. 즉 개방됨.


//@DEOK
//덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕
//덕 백엔드 @DEOK
const packet = require("./server-modules/packet.js");
const authentication = require('./server-modules/authentication.js');
const artwork = require('./server-modules/artwork.js');
const simplepay = require('./server-modules/simplepay.js');
const credit = require('./server-modules/credit-card.js');

//덕 db서버로 연결                                                  
const mongoConnection = require("./server-modules/static-modules/MongoConnection.js");
mongoConnection.connect("MongoDB connected!!");

router.use(packet);
//↑↑↑ 이상 패킷 감지 (ex : 너무 많은 요청)                
router.use(authentication);
//↑↑↑ 인증 api                                       
router.use(simplepay);
//↑↑↑ 간편결제 api                            
router.use(artwork);
//↑↑↑ 게시판 api       
router.use(credit);
//↑↑↑ 카드 등록 api
//덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕덕





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-데이터베이스 연결관계
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

let ourConnection = mongoose.createConnection
(
    'mongodb+srv://kundukdong:3workingtogether@cluster0-ughe6.azure.mongodb.net/sample_restaurants?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true}
);
//몽고DB(아틀라스 서비스)와의 연결 수립.
//보다시피 sample_restaurants 컬렉션(collection)과의 연결임.
//우리가 쓰는 클러스터(cluster, 일종의 저장소)를 직접 눈으로 보려면 아래 링크로
//https://cloud.mongodb.com/v2/5eee9a6c9f7e9e320c7bd10e#clusters
let ourSchema = new mongoose.Schema
(
    { owner: String, name: String, text: String }
);
//데이터베이스 문서(document)을 추가할 때 사용될 양식(schema)을 마련함!
let ourModel = ourConnection.model('neighborhoods', ourSchema);
//컬렉션에 속한 'neighborhoods' 데이터베이스에 ourSchema 양식을 사용하겠다는 모델 준비 완료








/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-클라이언트 세션과 사용자 인증
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/*
let mongoStore = new connectMongo(expressSession);
let localStrategy = passportLocal.Strategy;

let databaseConnection = mongoose.createConnection
(
    'mongodb+srv://kundukdong:3workingtogether@cluster0-ughe6.azure.mongodb.net/zeminem-playground-database?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true}
);
let accountSchema = new mongoose.Schema
(
    { email: String, password: String, nickname: String }
);
let accountsModel = databaseConnection.model('accounts', accountSchema);

router.use
(
    expressSession
    (
        {
            secret: 'the-secret-string',
            resave: false,
            saveUninitialized: true,
            store: new mongoStore
            ({ mongooseConnection: databaseConnection, collection : 'sessions' })
        }
    )
);
router.use(passport.initialize()); //express가 호출될 때마다 passport가 개입할 수 있게 됨
router.use(passport.session());

passport.serializeUser
(
    function (account, done)
    {
        console.log( '세션에 인증정보 기록함!' );
        console.log( account );
        done(null, account.email);
        //done(null, user.id);
    }
);

passport.deserializeUser
(
    function(email, done)
    {
        console.log( '데이터베이스에서 세션 인증정보와 일치하는 계정정보 가져옴!' );
        console.log( email );
        accountsModel.findOne
        (
            { email: email },
            function(err, account)
            {
                done(err, account);
            }
        );
    }
);

passport.use
(
    'local',
    new localStrategy
    (
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(request, email, password, done)
        {
            console.log ('로그인 인증요청 들어옴!', email, password);
            accountsModel.findOne
            (
                { email: email },
                function(err, account)
                {
                    if (err) { return done(err); }
                    else if (!account)
                    {
                        return done(null, false);
                        console.log('그런 이메일 없음!');
                    }
                    else if (account.password != password)
                    {
                        return done(null, false);
                        console.log('암호가 틀린가 봐');
                    }
                    else
                    {
                        console.log('계정 일치하네!');
                        return done(null, account);
                    }
                }
            );
            
            if(username === account.email && password === account.password)
            {
                console.log('계정 일치하네!');
                return done(null, account);
            }
            else
            {
                console.log('우리가 아는 그 계정이 아닌걸?');
                return done(null, false);
            }
        }
    )
);

*/





/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶서버-클라이언트 간 HTTP 요청과 응답
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

/*
router.put
(
    '/ajax-tunnel/sign-in',
    passport.authenticate //Passport 미들웨어(middleware)
    (
        'local',
        {
            successRedirect: '/ajax-tunnel/sign-in-process-done',
            //왜 그런진 모르겠지만 '리다이렉트(redirct) 없는 ajax 로그인'에도 필요함.
            //없애면 작동 잘 안 됨.
            failureRedirect: '/ajax-tunnel/sign-in-process-done',
            //이것도 마찬가지. 원래는 리다이렉트(redirect) 새로고침 로그인에나 필요한 기능인데...
            //이상하네. 일단 없애지 말자.
            failureFlash: false
        }
    ),
    function(request, response)
    {
        // 인증이 '성공했을 경우에만' 여기까지 도달해서 이 콜백(callback) 함수가 실행됨
        // 'request.user' 객체에는 인증된 사용자의 정보가 담겨있음. Passport NPM이 담아줌.

        //이미 위쪽 passport.authenticate 함수가 response를 보냄.
        //다시 response를 보내면 당연히 오류가 뜬다! 여기선 보내면 안 됨.
        
        console.log('띠용? 로그인에 성공했네?');
        console.log(request.user);
    }
);

router.put
(
    '/ajax-tunnel/sign-out',
    function(request, response)
    {
        console.log(request.body);
        request.logout(); //Passport NPM에서 만들어준 자식 함수
        response.send('여기는 서버, 로그아웃 완료됨!');
    }
);

router.put
(
    '/ajax-tunnel/sign-in-process-done',
    function(request, response)
    {
        response.send('로그인 처리 완료됨! 성공인지 실패인지는 알아서 확인할 것');
    }
);*/

router.get
(
    '/ajax-tunnel/sign-status',
    function(request, response)
    {
        if(request.isAuthenticated())
        {
            let payload = {
                isAuthenticated: true,
                description: '안녕하세요 '+request.user.email+'!'
            }
            response.send(JSON.stringify(payload));
            console.log(JSON.stringify(payload));
        }
        else
        {
            let payload = {
                isAuthenticated: false,
                description: '아직 로그인을 안 하셨네요'
            }
            response.send(JSON.stringify(payload));
        }
    }
);

router.get
(
    '/ajax-tunnel/item-list/:text',
    function(request,response)
    {
        (async function()
        {
            console.log('▶ 요청된 검색 문자열: '+ request.params.text);
            let neighborhoodsData = await ourModel.find
            (
                { name: { "$regex": request.params.text, "$options": "i" } },
                null,
                { limit: 50 }
            );
            /* console.log('▶ 몽고DB에서 데이터 받아옴!');
            console.log('\t항목 개수:', neighborhoodsData.length);
            console.log('\t길이:', JSON.stringify(neighborhoodsData).length);
            console.log('\n\t미리보기:', JSON.stringify(neighborhoodsData).slice(0,350)); */
            let payload = {
                itemNumber: await ourModel.countDocuments(),
                data: JSON.parse(JSON.stringify(neighborhoodsData))
            }
            response.send(JSON.stringify(payload));
        }
        )();
    }
);

router.get
(
    '/ajax-tunnel/item-list',
    function(request,response)
    {
        (async function()
        {
            /* console.log('▶ 요청된 검색 문자열: '+ request.params.text);
            let neighborhoodsData = await ourModel.find( null, null, { limit: 50 });
            console.log('▶ 몽고DB에서 데이터 받아옴!');
            console.log('\t항목 개수:', neighborhoodsData.length);
            console.log('\t길이:', JSON.stringify(neighborhoodsData).length);
            console.log('\n\t미리보기:', JSON.stringify(neighborhoodsData).slice(0,350)); */
            let payload = {
                itemNumber: await ourModel.countDocuments(),
                data: JSON.parse(JSON.stringify(neighborhoodsData))
            }
            response.send(JSON.stringify(payload));
        }
        )();
    }
);

router.post
(
    '/ajax-tunnel/new-item',
    function(request,response)
    {
        console.log('▶ 아이템 생성요청 들어옴!');
        console.log('\t내용 : ', JSON.stringify(request.body));
        ourModel.create
        (
            {
                owner: 'anonymous',
                name: request.body.name,
                text: request.body.text
            },
            function (error, small)
            {
                if (error)
                { return handleError(error); }
                else
                { response.send('여기는 서버, 아이템 생성 완료됨!'); }
            }
        );
    }
);

router.get
(
    '/account',
    function(request, response)
    {
        response.render( 'core-html.ejs', {pageFilePath: 'account-page.ejs'} );
    }
);

router.get
(
    '/artwork',
    function(request, response)
    {
        response.render( 'core-html.ejs', {pageFilePath: 'artwork-page.ejs'} );
    }
);

router.get
(
    '/',
    function(request, response)
    {
        response.render( 'core-html.ejs', {
            pageFilePath: 'main-page.ejs',
        } );
    }
);








/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
▶▶가동 시작!!
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/

const port = process.env.PORT || 80;
router.listen
(
    port,
    function(){ console.log(`Example app listening at http://localhost:${port}`); }
);
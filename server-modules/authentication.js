//commonly required 
const express = require('express');
const router = express.Router();

//auth modules
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//etc modules
const User = require('./static-modules/UserModel.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');

//인증 미들웨어 등록
router.use(session({ secret: 'wtfisthis', resave: true, saveUninitialized: false }));//TODO : study this deeper
router.use(passport.initialize());
router.use(passport.session()); //TODO:study

//유저->세션
passport.serializeUser((_user, done) => {
	//console.log("serializeUser user =", _user);

	done(null, _user.userEmail);
});

//세션->유저
passport.deserializeUser((_userEmail, done) => {
	//console.log("deserializeUser", _userEmail);
	User.findOne({ userEmail: _userEmail }, function (err, data) {
		if (data == undefined) {
			console.log("deserializeUser().findOne() : undefined");
		}
		done(null, data);
	});
});

//로그인 요청 처리 로직
passport.use(new LocalStrategy(
	{
		usernameField: 'userEmail', //html form 'name' attribute
		passwordField: 'userPw',
		session: true
	},

	function (userEmail, userPw, done) {
		console.log("LocalStrategy");

		User.findOne({ "userEmail": userEmail }, function (err, data) {

			//db 쿼리 에러
			if (err) {
				console.log("error : passport Local Strategy : dberror");
				done(err);
			}

			//쿼리한 유저가 db에 없을때
			if (data == undefined) {
				console.log("LocalStrategy().findOne() : no user");
				done(null, false);
				return;
			}

			//비밀번호 해싱
			var hashedpw = crypto.createHash('sha512').update(userPw).digest('base64');


			if (hashedpw != data.userPw) {
				console.log("Password incorrect");
				done(null, false);
				return;
			} else {
				console.log("Password corrent");
				done(null, data);
			}
		});
	}
));

//회원가입을 위한 함수들
function validateEmail(email) { //아이디 체크
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
function validatePassword(pwstr) { //패스워드 체크
	let reg = RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*\?])(?=.{8,})");

	//실패시 msg
	if (!reg.test(pwstr)) {
		return "비밀번호 형식이 맞지 않습니다. 소문자,숫자,특수문자로 조합된 8글자 이상의 형식이어야 합니다.";
	}

	//성공시 0
	return 0;
}

//회원가입
router.post('/ajax-tunnel/signup', function (req, res) {
	"TITLE 회원가입";//title for api profiler

	let userEmail = req.body.userEmail;
	let userPw = req.body.userPw;
	let repeat = req.body.repeat;
	let userAlias = req.body.userAlias;

	if (userEmail == "" ||
		userPw == "" ||
		repeat == "" ||
		userAlias == "") {
		console.log('/ajax-tunnel/signup : ERROR! argument blank');
		res.status(200).json({ isOk: false, message: "필수 인자가 비어있습니다." });
		return;
	}

	//id, password validation
	if (!validateEmail(userEmail)) {
		res.status(200).json({ isOk: false, message: "이메일 형식이 맞지 않습니다." });
		return;
	}
	let ret = validatePassword(userPw);
	if (ret != 0) {
		res.status(200).json({ isOk: false, message: "비밀번호 형식이 맞지 않습니다. 소문자,숫자,특수문자로 조합된 8글자 이상의 형식이어야 합니다." });
		return;
	}


	//password confirmation
	if (userPw != repeat) {
		console.log("signup() : password confirmation failed");
		res.status(200).json({ isOk: false, message: "비밀번호가 일치하지 않습니다." });
		return;
	}

	//콜백
	function createCallback(err) {
		if (err) {
			console.log("signup() : error occured while creating account");
			console.log("err :", err);
			res.status(200).json({ isOk: false, message: "계정을 생성하는 중 에러가 발생했습니다" });//ca=creating account
		} else {
			console.log("signup() succeeded : ", userEmail, userPw);
			res.status(200).json({ isOk: true, message: "계정 생성에 성공했습니다." });;
		}
	}
	userPw = crypto.createHash('sha512').update(userPw).digest('base64');
	User.create(
		{
			userEmail: userEmail,
			userAlias: userAlias,
			userPw: userPw,
			paymentMethod: [],
			uploads: [],
			income: 0,
			purchased: []
		}, createCallback);

});

//아이디 중복 체크
router.post('/ajax-tunnel/can-sign-up', function (req, res) {
	"TITLE 아이디 중복 체크";//title for api profiler

	let userEmail = req.body.userEmail;
	console.log("/can-sign-up input userEmail = " + userEmail);

	function findCallback(err, data) {
		if (err) {
			console.log("/can-sign-up findOne() : err");
			console.log(err);
			res.status(200).json({ isOk: false, message: "아이디 데이터베이스에 쿼리하는 도중 에러가 발생했습니다." });
			return;
		}

		console.log("/can-sign-up data=", data);
		if (data == null) {
			res.status(200).json({ isOk: true, message: "생성할 수 있는 아이디입니다." });
			return;
		} else {
			res.status(200).json({ isOk: false, message: "아이디가 이미 존재합니다." });
			return;
		}
	}

	User.findOne({ userEmail: userEmail }, findCallback);
});

//회원탈퇴
router.post('/ajax-tunnel/withdraw', function (request, response) {
	"TITLE 회원탈퇴";//title for api profiler

	console.log('/withdraw', request.body);

	if (!request.isAuthenticated()) {
		console.log("/withdraw user not authenticated");
		response.status(200).json({ isOk: false, message: "로그인 되어 있지 않습니다." });;
		return;
	}

	let userEmail = request.user.userEmail;
	let userPw = request.body.userPw;

	userPw = crypto.createHash('sha512').update(userPw).digest('base64');
	User.findOneAndRemove({ userEmail: userEmail, userPw: userPw }, function (error, response1) {
		if (error) {
			console.log("/withdraw error occured (findOneAndRemove failed)");
			console.log("error=", error);
			response.status(200).json({ isOk: false, message: "계정 정보를 삭제하는 도중 에러가 발생했습니다." });
		} else {
			if (response1 == null) {
				console.log("/withdraw no matching user found");
				response.status(200).json({ isOk: false, message: "암호를 잘못 입력하셨습니다." });
			} else {
				console.log("/withdraw Response=", response1);
				request.logout();
				response.status(200).json({ isOk: true, message: "성공적으로 계정을 삭제했습니다." });
			}
		}
	});
});


//로그인
router.post('/ajax-tunnel/sign-in', function (req, res, next) {
	"TITLE 로그인";//title for api profiler

	if (!req.body.userEmail || !req.body.userPw) {
		console.log("error : field empty");
		res.status(200).json({ isOk: false, message: "필수 인자가 빠져있습니다." });
		return;
	}

	passport.authenticate('local', function (err, user, info) {
		//case 1 : error occured
		if (err) {
			console.log("passport error");
			res.status(200).json({ isOk: false, message: "passport 에러" });
			next(err);
		}

		//case 2 : login failed
		if (!user) {
			return res.status(200).json({ isOk: false, message: "로그인 실패 : user가 존재하지 않습니다" });
		}

		//case 3 : login succeeded
		req.logIn(user, function (err) {
			if (err) {
				console.log("passport logIn() error");
				res.status(200).json({ isOk: false, message: "로그인 실패 : passport logIn()에러" });
				next(err);
			}
			return res.status(200).json({ isOk: true, userEmail: user.userEmail, userAlias: user.userAlias, message: "로그인 성공" });
		});
	})(req, res, next);
});

//로그아웃
router.post('/ajax-tunnel/sign-out', function (req, res) {
	"TITLE 로그아웃";//title for api profiler

	if (req.isAuthenticated()) {
		console.log(req.user.userEmail + " logout!");
		req.logout();
	}
	res.status(200).json({ isOk: true, message: "로그아웃 성공" });
}
);

//로그인 여부 체크
router.post('/ajax-tunnel/sign-in-check', function (req, res) {
	"TITLE 로그인 여부 체크";//title for api profiler

	if (req.isAuthenticated()) {
		console.log("current state : logined");
		res.status(200).json({ isOk: true, user:req.user, isAuthenticated: true,  message: "로그인 되어 있습니다." });
	} else {
		console.log("current state : not logined");
		res.status(200).json({ isOk: false, isAuthenticated: false, message: "로그인 되어 있지 않습니다." });
	}
}
);

module.exports = router;
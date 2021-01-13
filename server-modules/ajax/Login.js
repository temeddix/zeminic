const express = require('express');
const router = express.Router();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require("./static/Users");
const Base = require("./base/base");
const Crypto = require('crypto');

router.use(session({ secret: 'wtfisthis', resave: true, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session()); 

//유저->세션
passport.serializeUser((user, done) => {
	//console.log("serializeUser user =", _user);

	done(null, user.email);
});

//세션->유저
passport.deserializeUser((email, done) => {
	//console.log("deserializeUser", _userEmail);
	Users.findOne({ email: email }, function (err, data) {
		if (data == undefined) {
			console.log("deserializeUser().findOne() : undefined");
		}
		done(null, data);
	});
});

//로그인 요청 처리 로직
passport.use(new LocalStrategy(
	{
		usernameField: 'email', //html form 'name' attribute
		passwordField: 'pw',
		session: true
	},

	function (email, pw, done) {

		Users.findOne({ "email": email }, function (err, data) {

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
			var hashedpw = Crypto.createHash('sha512').update(pw).digest('base64');

			if (hashedpw != data.pw) {
				console.log("Password incorrect");
				done(null, false);
				return;
			} else {
				console.log("Password correct");
				done(null, data);
			}
		});
	}
));

//로그인
router.post('/ajax/login', function (req, res, next) {

	if (!req.body.email || !req.body.pw) {
		console.log("error : field empty");
		Base.resNo(res,"필수 인자가 비어있습니다",[req.body.email,req.body.pw]);
		return;
	}

	passport.authenticate('local', function (err, user, info) {
		//case 1 : error occured
		if (err) {
			console.log("passport error");
			Base.resNo(res,"인증모듈 에러",err);
            next(err);
            return;
		}

		//case 2 : login failed
		if (!user) {
            Base.resNo(res,"로그인 실패 : 존재하지 않는 유저입니다.",null);
            return;
		}

		//case 3 : login succeeded
		req.logIn(user, function (err) {
			if (err) {
				console.log("passport logIn() error");
				Base.resNo(res,"인증모듈 로그인에러",err);
                next(err);
                return;
			}
			return res.status(200).json({ isOk: true, msg: "로그인 성공" , ref:user });
		});
	})(req, res, next);
});

//로그아웃
router.post('/ajax/logout', function (req, res) {

	if (req.isAuthenticated()) {
		console.log(req.user.email + " logout!");
		Base.resYes(res,"로그아웃 성공",req.user.email);
		req.logout();
		return;
	} else{
		Base.resNo(res,"로그인 되어 있지 않습니다",null);
	}
	
}
);

//로그인 여부 체크
router.post('/ajax/login-check', function (req, res) {

	if (req.isAuthenticated()) {
		console.log("current state : logined");
        Base.resYes(res,"로그인 되어 있습니다",req.user.email);
        return;
	} else {
		console.log("current state : not logined");
        Base.resYes(res,"로그인 되어 있지 않습니다",req.user.email);
        return;
	}
}
);

module.exports = router;
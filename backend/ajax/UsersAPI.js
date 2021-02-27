const express = require("express");
const Users = require("./static/Users");
const Base = require("./base/base");
const Crypto = require("crypto");


const router = express.Router();

//회원가입을 위한 함수들
function validateEmail(email) {
	//아이디 체크
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
function validatePassword(pwstr) {
	//패스워드 체크
	//알파벳,숫자 포함 8글자이상
	let reg = RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,})");

	//실패시 false
	if (!reg.test(pwstr)) {
		return false;
	}

	//성공시
	return true;
}

//회원 등록
let notVerified_token = {};
let notVerified_info = {};
router.post("/ajax/signup", async function (req, res) {
	let email = req.body.email;
	let pw = req.body.pw;
	let nickname = req.body.nickname;

	if (!email || !pw || !nickname) {
		Base.resNo(res, "필수 인자가 비어있습니다", [email, pw, nickname]);
		return;
	}

	if (!validateEmail(email)) {
		Base.resNo(res, "이메일 형식이 맞지 않습니다", email);
		return;
	}
	if (!validatePassword(pw)) {
		Base.resNo(res, "비밀번호 형식이 맞지 않습니다", pw);
		return;
	}

	//TODO 3 : unique check (email verification)
	let emailAlready = await Users.findOne({ email: email });
	let nicknameAlready = await Users.findOne({ nickname: nickname });
	if (emailAlready) {
		Base.resNo(res, "Email already exists!", emailAlready.email);
		return;
	}
	if (nicknameAlready) {
		Base.resNo(res, "Nickname already exists!", nicknameAlready.nickname);
		return;
	}
	notVerified_token[email] = Base.randomToken().slice(0,6);
	try {
		Base.sendMail(email, "인증 토큰 : " + notVerified_token[email]);
		pw = Crypto.createHash("sha512").update(pw).digest("base64");

		let newUser = {
			_id: Base.newObjectId(),
			email: email,
			pw: pw,
			nickname: nickname,
			registration: Base.getTime(),
        };
        notVerified_info[notVerified_token[email]] = newUser;
        Base.logInfo("Veification request",[email,notVerified_token[email]]);

		Base.logInfo("Request succeeded", newUser.email);
		Base.resYes(res, "회원가입 요청 성공(이메일 인증대기중)", newUser.registration);

	} catch (err) {
		Base.logErr("Signup request failed", err);
		Base.resNo(res, "회원가입 요청 실패", err);
		return;
	}
});
router.post("/ajax/verify", async function (req, res, next) {
    let token = req.body.token;

    if(!notVerified_info[token]){
        Base.logInfo("No token",token);
        Base.resNo(res,"회원가입 요청을 먼저 진행해주십시오.",null);
        return;
    }

    try {
		let userobj = notVerified_info[token];
		
		if(Base.getTime()>userobj.registration+1000*60*3){
			Base.logInfo("Timeout",{cur:Base.getTime(), registration:userobj.registration});
			Base.resNo(res,"Timeout(3min)",{cur:Base.getTime(), registration:userobj.registration});
			delete notVerified_info[token];
			return;
		}

        let newUser = new Users(userobj);
        await newUser.save();
        delete userobj.pw;
        Base.logInfo("Signup success",userobj);
        Base.resYes(res,"회원가입 성공",userobj);
        delete notVerified_info[token];
    } catch (err){
        Base.logErr("Signup failure",err);
        Base.resNo(res,"회원가입 실패",err);
    }
});

//회원탈퇴
router.post("/ajax/withdraw", async function (req, res) {
	let email = req.body.email;
	let pw = req.body.pw;

	if (!email || !pw) {
		Base.resNo(res, "필수 인자가 비어있습니다", [email, pw, nickname]);
		return;
	}

	pw = Crypto.createHash("sha512").update(pw).digest("base64");

	let found = await Users.findOne({ email: email });
	if (!found) {
		Base.resNo(res, "회원탈퇴할 유저가 존재하지 않습니다", email);
		return;
	}

	if (pw == found.pw) {
		let result = await Users.deleteOne({ email: email });

		Base.logInfo("result", result);

		if (result.ok == 1) {
			Base.resYes(res, "회원탈퇴가 성공적으로 처리되었습니다", result);
			Base.logInfo("회원탈퇴 성공", result);
		} else {
			Base.resNo(res, "회원탈퇴에 실패했습니다", null);
			Base.logInfo("회원탈퇴 실패");
		}
	} else {
		Base.resNo(res, "회원탈퇴 실패 : 비밀번호가 다릅니다.");
		Base.logInfo("회원탈퇴 실패 : 비밀번호가 다릅니다");
	}
});

//비밀번호 변경
router.post("/ajax/chpw", async function (req, res) {

	if(!req.isAuthenticated()){
		Base.resNo(res,"Login first");
		return;
	}

	
	let crypted = Crypto.createHash("sha512").update(req.body.pw).digest("base64");
	let newcrypt = Crypto.createHash("sha512").update(req.body.newpw).digest("base64");

	if(req.user.pw == crypted){
		req.user.pw = newcrypt;
		await req.user.save();
		Base.resYes(res,"password changed");
		return;
	} else {
		Base.resNo(res,"password incorrect");
		return;
	}

});

//현재 로그인된 유저 정보 get
router.post("/ajax/userinfo", function (req, res) {
	if (req.isAuthenticated()) {
		let user = JSON.parse(JSON.stringify(req.user));
		delete user["pw"];
		Base.resYes(res, "Successfully found user info", user);
	} else {
		Base.resNo(res, "Not logined", null);
	}

	return;
});

module.exports = router;

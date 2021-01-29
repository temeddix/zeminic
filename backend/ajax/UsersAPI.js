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
			regi: Base.getTime(),
        };
        notVerified_info[notVerified_token[email]] = newUser;
        Base.logInfo("인증 요청된 유저와 토큰",[email,notVerified_token[email]]);

		Base.logInfo("회원가입 요청 성공 (이메일 인증대기중)", newUser.email);
		Base.resYes(res, "회원가입 요청 성공(이메일 인증대기중)", newUser.email);

	} catch (err) {
		Base.logErr("회원가입 요청 실패", err);
		Base.resNo(res, "회원가입 요청 실패", err);
		return;
	}
});
router.post("/ajax/verify", async function (req, res, next) {
    let token = req.body.token;

    if(!notVerified_info[token]){
        Base.logInfo("토큰이 존재하지 않습니다",token);
        Base.resNo(res,"회원가입 요청을 먼저 진행해주십시오.",null);
        return;
    }

    try {
        let userobj = notVerified_info[token];
        let newUser = new Users(userobj);
        await newUser.save();
        delete userobj.pw;
        Base.logInfo("회원가입 성공",userobj);
        Base.resYes(res,"회원가입 성공",userobj);
        delete notVerified_info[token];
    } catch (err){
        Base.logErr("회원가입 실패",err);
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
	let email = req.body.email;
	let pw = req.body.pw;
	let newpw = req.body.newpw;
	let repeat = req.body.repeat;

	if (newpw != repeat) {
		Base.resNo(res, "New password and repeat password do not match", null);
		return;
	}

	let result = await Users.findOne({ email: email });
	let crypted = Crypto.createHash("sha512").update(pw).digest("base64");

	if (result.pw == crypted) {
		let newcrypt = Crypto.createHash("sha512")
			.update(newpw)
			.digest("base64");
		let changed = await Users.updateOne(
			{ email: email },
			{ $set: { pw: newcrypt } }
		);

		if (changed.ok) {
			Base.resYes(res, "Password changed", changed.ok);
			return;
		} else {
			Base.resNo(res, "Error occured", changed.ok);
			return;
		}
	} else {
		Base.resNo(res, "password incorrect", null);
		return;
	}
});

//현재 로그인된 유저 정보 get
router.post("/ajax/userinfo", function (req, res) {
	if (req.isAuthenticated()) {
		let user = JSON.parse(JSON.stringify(req.user));
		delete user["pw"];
		delete user["billingKey"];
		Base.resYes(res, "Successfully found user info", user);
	} else {
		Base.resNo(res, "Not logined", null);
	}

	return;
});

module.exports = router;

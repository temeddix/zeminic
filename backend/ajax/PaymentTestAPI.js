const express = require('express');
const router = express.Router();
const Base = require("./base/base");

const { Iamporter, IamporterError } = require('iamporter');

//상수 초기화
//가맹점 식별코드 imp48416773
// const APIKEY = "4165658327188490";
// const SECRET = "ny2ZHdkcnZH2zAmRnxFc0BdtqDA6nnvLVxKDL5P84xaE7wvu4aG4LUxcx8iVvOHrlr46wUeBrpfzWL30";

// const iamporter = new Iamporter({ //for production
// 	apiKey: APIKEY,
// 	secret: SECRET
// });

const iamporter = new Iamporter();


//로그인 검사
router.use("/test/payment",function(req,res,next){
	if(!req.isAuthenticated()){
		Base.resNo(res,"Login first");
		return;
	} else {
		next();
	}
});

//For debugging : process iamporter promise
function processIamporterPromiseForDebugging(res,promise){
	promise.then(result=>{
		Base.logInfo("payment api result",result);
		Base.resYes(res,"payment result",result);
	})
	.catch(err => {
		if(err instanceof IamporterError){
			Base.logErr("payment Iamporter Error",err);
			Base.resNo(res,"payment module error");
		} else {
			Base.logErr("payment error",err);
			Base.resNo(res,"server error");
		}
	});
}

//빌링키 생성
router.post("/test/payment/subscription/create", function(req,res){
	processIamporterPromiseForDebugging(
		res,
		iamporter.createSubscription({
			"customer_uid" : req.body.customer_uid,
			"card_number" : req.body.card_number,//'1234-1234-1234-1234'
			"expiry" : req.body.expiry,//'2021-11'
			"birth" : req.body.birth,///'971002'
			"pwd_2digit" : req.body.pwd_2digit//'99'
		})
	);
});

//빌링키 조회
router.post("/test/payment/subscription/get",function(req,res){
	processIamporterPromiseForDebugging(
		res,
		iamporter.getSubscription(req.body.customer_uid)
	);
});

//빌링키 삭제
router.post("/test/payment/subscription/delete",function(req,res){
	processIamporterPromiseForDebugging(
		res,
		iamporter.deleteSubscription(req.body.customer_uid)
	);
});

//빌링키 결제
router.post("/test/payment/subscription/pay",function(req,res){
	processIamporterPromiseForDebugging(
		res,
		iamporter.paySubscription({
			"customer_uid" : req.body.customer_uid,
			"merchant_uid" : req.body.merchant_uid,
			"amount" : Number(req.body.amount)
		})
	);
});

//비인증 일회성 결제
router.post("/test/payment/onetime/pay",function(req,res){
	processIamporterPromiseForDebugging(
		res,
		iamporter.payOnetime({
			'merchant_uid':req.body.merchant_uid,
			'amount' : Number(req.body.amount),
			'card_number' : req.body.card_number,
			'expiry' : req.body.expiry,
			'birth' : req.body.birth,
			'pwd_2digit' : req.body.pwd_2digit
		})
	);
});

//해외카드 비인증 결제
router.post("/test/payment/foreign/pay",function(req,res){
	processIamporterPromiseForDebugging(
		res,
		iamporter.payForeign({
		  'merchant_uid': req.body.merchant_uid,
		  'amount': Number(req.body.amount),
		  'card_number': req.body.card_number,
		  'expiry': req.body.expiry,
		})
	);
});



//결제 취소 : 상점 고유 아이디
router.post("/test/payment/cancel/merchant",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//조회 : 상점 고유 아이디
router.post("/test/payment/find/merchant",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});




module.exports = router;
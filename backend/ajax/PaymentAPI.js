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

//훅
router.post("/payment/notification",function(req,res){
	Base.logInfo("Payment Hooked",req.body);
	res.end("OK");
});

//로그인 검사
router.use("/ajax/payment",function(req,res,next){
	if(!req.isAuthenticated()){
		Base.resNo(res,"Login first");
		return;
	} else {
		next();
	}
});

//For debugging : process iamporter promise
function processIamporterPromiseForDebugging(promise){
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
router.post("/ajax/payment/subscription/create", function(req,res){
	processIamporterPromiseForDebugging(
		iamporter.createSubscription({
			"customoer_uid" : req.body.customoer_uid,
			"card_number" : req.body.card_number,//'1234-1234-1234-1234'
			"expiry" : req.body.expiry,//'2021-11'
			"birth" : req.body.birth,///'971002'
			"pwd_2digit" : req.body.pwd_2digit//'99'
		})
	);
});

//빌링키 조회
router.post("/ajax/payment/subscription/get",function(req,res){
	processIamporterPromiseForDebugging(
		iamporter.getSubscription(req.body.customoer_uid)
	);
});

//빌링키 삭제
router.post("/ajax/payment/subscription/delete",function(req,res){
	processIamporterPromiseForDebugging(
		iamporter.deleteSubscription(req.body.customoer_uid)
	);
});

//빌링키 결제
router.post("/ajax/payment/subscription/pay",function(req,res){
	processIamporterPromiseForDebugging(
		iamporter.paySubscription({
			"customoer_uid" : req.body.customoer_uid,
			"merchant_uid" : req.body.merchant_uid,
			"amount" : Number(req.body.amount)
		})
	);
});

//비인증 일회성 결제
router.post("/ajax/payment/onetime/pay",function(req,res){
	processIamporterPromiseForDebugging(
		
	);
});

//해외카드 비인증 결제
router.post("/ajax/payment/foreign/pay",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//결제 취소 : 아임포트 고유 아이디 : 설정된 계좌로 환불
router.post("/ajax/payment/cancel/iamport/refund",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//결제 취소 : 아임포트 고유 아이디
router.post("/ajax/payment/cancel/iamport",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//결제 취소 : 상점 고유 아이디 : 부분 취소
router.post("/ajax/payment/cancel/merchant/part",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//결제 취소 : 상점 고유 아이디
router.post("/ajax/payment/cancel/merchant",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//조회 : 아임포트 고유 아이디
router.post("/ajax/payment/find/iamport",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//조회 : 상점 고유 아이디
router.post("/ajax/payment/find/merchant",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//조회 : 결제 상태
router.post("/ajax/payment/findall/status",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//조회 : 예약된 결제건
router.post("/ajax/payment/find/prepared",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//예약
router.post("/ajax/payment/prepare",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});

//가상 계좌 발급
router.post("/ajax/payment/vbank",function(req,res){
	processIamporterPromiseForDebugging(
		
		);
});


module.exports = router;
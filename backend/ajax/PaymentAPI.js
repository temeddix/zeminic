const express = require('express');
const router = express.Router();
const Base = require("./base/base");
const Strtest = Base.Strtest;

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

//빌링키 문자열 생성
function genCustomerUid(user,alias){
	/*
		user : req.user (몽구스 Users 인스턴스)
		alias : String
	*/
	return user.email+"_"+String(user.billingKey.length)+"_"+alias;
}

//구매id 생성 
function genMerchantUid(user, merchantType, merchant){
	/*
		user : req.user
		merchantType : 상품 타입 (Series, Episodes, Novels, Chapters 등)
		merchant : 상품의 Mongoose 인스턴스
	*/
	return user.email + "_" + merchantType + "_" + String(merchant._id);
}

//훅
router.post("/payment/notification",function(req,res){
	Base.logInfo("Payment Hooked",req.body);

	/*
		TODO : 로깅하기
	*/

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

function catchPaymentError(res,promise){
	promise.catch(err => {
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

	let alias = req.body.alias;
	let card_number = req.body.card_number;
	let expiry = req.body.expiry;
	let birth = req.body.birth;
	let pwd_2digit = req.body.pwd_2digit;

	let customer_uid = genCustomerUid(req.user,alias);

	if(!Strtest.testLen(alias,1,20)){
		Base.resNo(res,"카드 별칭 길이는 1~20",alias);
		return;
	}

	catchPaymentError(
		res,
		iamporter.createSubscription({
			"customer_uid" : customer_uid,
			"card_number" :card_number,//'1234-1234-1234-1234'
			"expiry" : expiry,//'2021-11'
			"birth" : birth,///'971002'
			"pwd_2digit" : pwd_2digit//'99'
		}).then(async result=>{
			Base.logInfo("create subscription result",result);

			req.user.billingKey.push({alias:alias,key:customer_uid});
			await req.user.save();
		})
	);
});

//빌링키 조회
router.post("/ajax/payment/subscription/get",function(req,res){
	catchPaymentError(
		res,
		iamporter.getSubscription(req.body.customer_uid)
	);
});

//빌링키 삭제
router.post("/ajax/payment/subscription/delete",function(req,res){
	catchPaymentError(
		res,
		iamporter.deleteSubscription(req.body.customer_uid)
	);
});

//빌링키 결제
router.post("/ajax/payment/subscription/pay",function(req,res){
	catchPaymentError(
		res,
		iamporter.paySubscription({
			"customer_uid" : req.body.customer_uid,
			"merchant_uid" : req.body.merchant_uid,
			"amount" : Number(req.body.amount)
		})
	);
});

//비인증 일회성 결제
router.post("/ajax/payment/onetime/pay",function(req,res){
	catchPaymentError(
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
router.post("/ajax/payment/foreign/pay",function(req,res){
	catchPaymentError(
		res,
		iamporter.payForeign({
		  'merchant_uid': req.body.merchant_uid,
		  'amount': Number(req.body.amount),
		  'card_number': req.body.card_number,
		  'expiry': req.body.expiry,
		})
	);
});

//결제 취소 : 아임포트 고유 아이디 : 설정된 계좌로 환불
router.post("/ajax/payment/cancel/iamport/refund",function(req,res){
	catchPaymentError(

		);
});

//결제 취소 : 아임포트 고유 아이디
router.post("/ajax/payment/cancel/iamport",function(req,res){
	catchPaymentError(
		
		);
});

//결제 취소 : 상점 고유 아이디 : 부분 취소
router.post("/ajax/payment/cancel/merchant/part",function(req,res){
	catchPaymentError(
		
		);
});

//결제 취소 : 상점 고유 아이디
router.post("/ajax/payment/cancel/merchant",function(req,res){
	catchPaymentError(
		
		);
});

//조회 : 아임포트 고유 아이디
router.post("/ajax/payment/find/iamport",function(req,res){
	catchPaymentError(
		
		);
});

//조회 : 상점 고유 아이디
router.post("/ajax/payment/find/merchant",function(req,res){
	catchPaymentError(
		
		);
});

//조회 : 결제 상태
router.post("/ajax/payment/findall/status",function(req,res){
	catchPaymentError(
		
		);
});

//조회 : 예약된 결제건
router.post("/ajax/payment/find/prepared",function(req,res){
	catchPaymentError(
		
		);
});

//예약
router.post("/ajax/payment/prepare",function(req,res){
	catchPaymentError(
		
		);
});

//가상 계좌 발급
router.post("/ajax/payment/vbank",function(req,res){
	catchPaymentError(
		
		);
});


module.exports = router;
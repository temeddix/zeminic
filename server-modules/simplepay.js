const { Iamporter, IamporterError } = require('iamporter');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const Relay = require('./custom-modules/Relay3.js');
const Artwork = require('./static-modules/ArtworkModel.js');
const User = require('./static-modules/UserModel.js');
const ApiKey = require('./static-modules/ApiKey.js');

//IAMPORT
const IMPID = ApiKey["iamport"]['IMPID'];
const APIKEY = ApiKey["iamport"]['APIKEY'];
const SECRET = ApiKey["iamport"]['SECRET'];
//const iamporter = new Iamporter(); //for test
const iamporter = new Iamporter({ //for production
	apiKey: APIKEY,
	secret: SECRET
})

function getToken(apikey, secret, callback) { //callback(error,token)
	iamporter.getToken(apikey, secret)
		.then(function (result) {
			if (result.status == 200 && result.message == null) {
				let token = result.data.access_token;
				callback(false, token);
				return;
			}
			callback(true, result.message);
		})
}
function prepare(token, merchantUid, amount, callback) {//callback(error,result)
	axios.post(
		"https://api.iamport.kr/payments/prepare",
		{
			merchant_uid: merchantUid,
			amount: amount
		},
		{
			headers: {
				"Authorization": token
			}
		}
	)
		.then(function (result) {
			result = result.data;
			if (result.code == 0 && result.message == null) {
				callback(false, result);
				return;
			}

			callback(true, result.message);
		});
}
//Onetime 비인증 결제
function payOneTime(mUid,amount,cardNum,expiry,birth,pwd2, callback) {//return : isSuccessful, message, result

    iamporter.payOnetime({
        'merchant_uid': mUid,
        'amount': amount,
        'card_number': cardNum,
        'expiry': expiry, //ex : 2022-11
        'birth': birth,
        'pwd_2digit': pwd2
    }).then(result => {
		
        if (result.status == 200 && result.message == null) {
            let retval = {
				isOk:true,
				message : "결제 성공",

				result : {
					amount : result.data.amount,
					apply_num : result.data.apply_num,
					card_name : result.data.card_name,
					merchant_uid : result.data.merchant_uid,
					paid_at : result.data.paid_at,
					receipt_url : result.data.receipt_url
				}
			};
			callback(retval);
			return;
        } else {
			console.log("Payment failed",result);
			let retval = {
				isOk:false,
				message : "결제 중 오류 발생",
				result : result
			};
			callback(retval);
			return;
        }

    }).catch(err => {
        if (err instanceof IamporterError) {
			console.log("ERROR", err);
			let retval = {
				isOk:false,
				message : "서버 에러 :"+String(err),
				result : err
			};
			callback(retval);
			return;
        }

    });
}

/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
							▲ 함수들 ▲
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■






■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
						   ▼ 라우터들 ▼
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/

router.use("/payment_noti/ajtwlswjdejr",function(request,response){
	console.log("new payment noti!");
	console.log(request.body);
	response.end("OK");

	console.log("iamport noti :",request.body);

	if(request.body.status != 'paid'){
		console.log("status :",request.body.status);
		return;
	}

	//db 쿼리해서 업뎃
	let merchant_uid = request.body.merchant_uid;
	let userEmail = merchant_uid.split(':')[0];
	let artworkId = merchant_uid.split(':')[1];

	User.findOneAndUpdate({userEmail:userEmail},{"$push":{"purchased":Number(artworkId)}},
		function(error,doc,result){
			if(error){
				console.log("pay noti error",error);
				return;
			}

			console.log("user purchased!",doc);
		}
	);
	
});

/*
	결제방식	pg변수		paymentMethod변수
	
	카카오페이	kakaopay	card
	페이팔		paypal		card
	폰 소액		nice		phone
	카드결제	nice 		card
	네이버페이	naverpay	card
*/
const PAYMENT_METHOD = {
	"kakaopay": ["kakaopay", "card"],
	"paypal": ["paypal", "card"],
	"card": ["nice", "card"],
	"phone": ["nice", "phone"],
	"naverpay": ["naverpay", "card"]
};
router.post("/ajax-tunnel/get-imp-param", function (request, response) {
	//IMP request에 들어가야 될 오브젝트 반환해주기

	/*
		<상태 순서>
		1.  HTTP 요청 대기
		2.  요청 수신 완료 < 요청수신(결제방법,게시물아이디)
		3.  db 응답 대기 < 게시물 db 쿼리
		4.  db 수신 완료 < db 응답
		5.  응답 데이터 준비 < db 응답 유효성 검사 통과
		6.  응답 준비 < pg,pay_method,merchant_uid,name,amount 준비
		7.  응답 완료 < json 응답

	*/

	// 시작 : 상태2 : 요청 수신 완료
	let user;
	if(!request.isAuthenticated()){ // 유저 로그인체크
		console.log("/get-imp-param : not Authed");
		response.status(200).json({
			isOk:false,
			message : "not authenticated"});

		return;
	}
	user = request.user;
		//test
		//user = { userEmail: "smallstepwalker@gmail.com" };

	let artworkId = request.body.artworkId; //게시물 아이디
	let paymentMethod = request.body.paymentMethod; //결제방법: "kakaopay", "paypal", "card", "phone", "naverpay"

	if (!Object.keys(PAYMENT_METHOD).includes(paymentMethod)) {
		console.log("/get-imp-param : unknown payment method", paymentMethod);
		response.status(200).json({
			isOk: false,
			message: "unknown payment method"
		});
		return;
	}
	if (Number(artworkId) == NaN) {
		console.log("/get-imp-param : artworkId NaN");
		response.status(200).json({
			isOk: false,
			message: "artwork id NaN"
		});
		return;
	}
	artworkId = Number(artworkId);

	let artworkData, pg, pay_method, merchantUid,
		name,amount,responseData;
	Relay(
		function (relay) {
			Artwork.findOne({ id: artworkId }, relay.callback);
			//상태 3 : db응답 대기
		},
		function (err, result, relay) {
			//상태 4: db 수신 완료

			if (err) {
				console.log("/get-imp-param error");
				console.log(err);
				response.status(200).json({
					isOk: false,
					message: "state2 : Artwork db query failed"
				});
				return;
			}

			if (!result) {
				console.log("result empty", result);
				response.status(200).json({
					isOk: false,
					message: "state 4 : empty result (no artwork was found)"
				});
				return;
			}

			//상태 5 : 응답 데이터 준비

			artworkData = result;

			relay.callback();
		},
		function (relay) {

			pg = PAYMENT_METHOD[paymentMethod][0]; //PAYMENT_METHOD 배열 첫번째 원소
			pay_method = PAYMENT_METHOD[paymentMethod][1]; //PAYMENT_METHOD 배열 두번째 원소
			merchantUid = user.userEmail + ":" + String(artworkId); //여기서 자체 생성한 id
			name = artworkData.title; //db에서 받아온 게시물 제목
			amount = artworkData.price; //db에서 받아온 게시물 가격
			responseData = {
				"pg": pg,
				"pay_method": pay_method,
				"merchant_uid": merchantUid,
				"name": name,
				"amount": amount
			};

			//상태 6 : 응답 준비

			getToken(APIKEY, SECRET, relay.callback);
		}, function (error, token, relay) {
			if (error) {
				console.log("getToken error");
				response.status(200).json({
					isOk: false,
					message: "cannot get payment token"
				});
				return;
			}
			prepare(token, merchantUid, amount, relay.callback);
		}, function (error, result) {
			if (error && result!="결제정보 사전등록에 실패하였습니다(이미 등록된 merchant_uid입니다).") {
				console.log("prepare error",error,result);
				response.status(200).json({
					isOk: false,
					message: "cannot prepare payment"
				});
				return;
			}

			response.status(200).json({
				isOk: true,
				message: "IMP 결제 정보 응답 성공",
				impParam: responseData,
				impId: IMPID
			});
			//상태 7 : 응답 완료
		}
	);
});

/*
//back payment : onetime
router.post("/ajax-tunnel/pay-card", function(request,response){

	if(!request.isAuthenticated()){
		console.log("not authed");
		response.json({
			isOk:false,
			message:"로그인 되어 있지 않습니다"
		});
		return;
	}
	let buyer = request.user.userEmail;

	//요청 정보 : 게시물 아이디, 카드 정보
	let artworkId = request.body.artworkId;
	let cardNumber = request.body.cardNumber;
	let cardExpiry = request.body.cardExpiry;
	let cardBirth = request.body.cardBirth;
	let cardPwd2 = request.body.cardPwd2;

	//merchant uid __ user.userEmail + ":" + String(artworkId);
	//payOneTime 인자 준비
	//payOneTime(mUid,amount,cardNum,expiry,birth,pwd2, callback)
	let mUid;
	let amount;
	artworkId = Number(artworkId);
	let cardNum = String(cardNumber);
	let expiry = String(cardExpiry);
	let birth = String(cardBirth);
	let pwd2 = String(cardPwd2);

	Relay(
		function(relay){
			User.findOne({userEmail:buyer}, function(err,res){
				if(err){
					console.log("pay error");
					response.json({
						isSuccessful : false,
						message : "유저를 찾는 도중 에러가 발생했습니다"
					})
					return;
				}		

				if(res == null || res == undefined){
					console.log("result null");
					response.json({
						isSuccessful : false,
						message : "현재 유저를 db에서 찾을 수 없습니다"
					})
					return;
				}

				if(res.purchased.includes(artworkId)){
					response.json({
						isSuccessful : false,
						message : "이미 결제한 작품입니다"
					})
					return;
				}

				relay.callback();
			});
		}
		,
		function(relay){
			Artwork.findOne({id:artworkId}, function(error,doc){
				if(error){
					response.json({
						isOk:false,
						message : "error occured (db)"});
					return;
				}
				mUid = buyer + ":" + String(doc.id);
				console.log("결제시도 mUid",mUid);
				amount = doc.price;
				relay.callback();
			});
		},

		function(relay){
			payOneTime(mUid,amount,cardNum,expiry,birth,pwd2,relay.callback);
		},

		function(retjson,relay){
			if(!retjson.isOk){
				console.log(retjson.message);
				response.status(200).json({
					isSuccessful : false,
					message : retjson.message,
					result : retjson.result
				});
				return;
			}

			response.status(200).json({
				isOk:true,
				message : "결제 성공",
				result : retjson.result
			});

		}
	);

});*/

//back payment : using card alias
router.post("/ajax-tunnel/pay-card-alias", function(request,response){

	/*
		request variables

		cardAlias : String : 내 카드 별칭
		artworkId : String : 구매할 작품 id
	*/

	if(!request.isAuthenticated()){
		console.log("not authed");
		response.json({
			isOk:false,
			message:"로그인 되어 있지 않습니다"
		});
		return;
	}
	let buyer = request.user.userEmail;
	let cardAlias = request.body.cardAlias;
	let targetCard = undefined;
	let paymentMethod = request.user.paymentMethod;

	for(var tmp in paymentMethod){
		if(tmp == undefined){
			return;
		}

		if(paymentMethod[tmp]['alias']==cardAlias){
			targetCard = paymentMethod[tmp];
		}
	}	

	if(targetCard == undefined){
		response.json({
			isOk:false,
			message : "별칭이랑 매칭되는 카드가 없습니다"
		});
		return;
	}

	//요청 정보 : 게시물 아이디, 카드 정보
	let artworkId = request.body.artworkId;
	let cardNumber = targetCard.cardNumber;
	let cardExpiry = targetCard.expireDate;
	let cardBirth = targetCard.birth;
	let cardPwd2 = targetCard.pwd2digit;

	//merchant uid __ user.userEmail + ":" + String(artworkId);
	//payOneTime 인자 준비
	//payOneTime(mUid,amount,cardNum,expiry,birth,pwd2, callback)
	let mUid;
	let amount;
	artworkId = Number(artworkId);
	let cardNum = String(cardNumber);
	let expiry = String(cardExpiry);
	let birth = String(cardBirth);
	let pwd2 = String(cardPwd2);

	Relay(
		function(relay){
			//TODO : 이거 지워도 될듯
			User.findOne({userEmail:buyer}, function(err,res){
				if(err){
					console.log("pay error");
					response.json({
						isSuccessful : false,
						message : "유저를 찾는 도중 에러가 발생했습니다"
					})
					return;
				}		

				if(res == null || res == undefined){
					console.log("result null");
					response.json({
						isSuccessful : false,
						message : "현재 유저를 db에서 찾을 수 없습니다"
					})
					return;
				}

				if(res.purchased.includes(artworkId)){
					response.json({
						isSuccessful : false,
						message : "이미 결제한 작품입니다"
					})
					return;
				}

				relay.callback();
			});
		}
		,
		function(relay){
			Artwork.findOne({id:artworkId}, function(error,doc){
				if(error){
					response.json({
						isOk:false,
						message : "게시물을 찾는도중 에러 발생"});
					return;
				}

				if(doc == undefined){
					response.json({
						isOk:false,
						message : "요청하신 게시물이 없습니다."});
					return;
				}

				mUid = buyer + ":" + String(doc.id);
				console.log("결제 mUid",mUid);
				amount = doc.price;
				relay.callback();
			});
		},

		function(relay){
			payOneTime(mUid,amount,cardNum,expiry,birth,pwd2,relay.callback);
		},

		function(retjson,relay){
			if(!retjson.isOk){
				console.log(retjson.message);
				response.status(200).json({
					isSuccessful : false,
					message : retjson.message,
					response : retjson.result
				});
				return;
			}

			response.status(200).json({
				isOk:true,
				message : "결제 성공",
				response : retjson.result
			});

		}
	);

});


module.exports = router;
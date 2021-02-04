const { Iamporter, IamporterError } = require('iamporter');
const axios = require('axios');
const express = require('express');
const router = express.Router();

//IAMPORT
const IMPID = "imp48416773";
const APIKEY = "4165658327188490";
const SECRET = "ny2ZHdkcnZH2zAmRnxFc0BdtqDA6nnvLVxKDL5P84xaE7wvu4aG4LUxcx8iVvOHrlr46wUeBrpfzWL30";
//const iamporter = new Iamporter(); //for test
const iamporter = new Iamporter({ //for production
	apiKey: APIKEY,
	secret: SECRET
})

//토큰 얻기
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

//결제 예약
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

//카드 정보로 결제
function payOneTime(mUid,amount,cardNum,expiry,birth,pwd2, callback) {//callback : {isOk, msg, ref}

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
				msg : "결제 성공",

				ref : {
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
				msg : "결제 중 오류 발생",
				ref : result
			};
			callback(retval);
			return;
        }

    }).catch(err => {
        if (err instanceof IamporterError) {
			console.log("ERROR", err);
			let retval = {
				isOk:false,
				msg : "서버 에러 :"+String(err),
				ref : err
			};
			callback(retval);
			return;
        }

    });
}


module.exports = router;
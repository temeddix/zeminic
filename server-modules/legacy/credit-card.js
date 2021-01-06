const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('./static-modules/UserModel.js');
const Artwork = require('./static-modules/ArtworkModel.js');
const Relay = require('./custom-modules/Relay3.js');

/*
    function identifyCardByNumber
    summary : 카드 숫자의 간단한 유효성 체크, 카드 종류 식별
    warn : 이 함수의 검사를 다 통과해도 유효한 카드가 아닐 수 있음.
            직접 결제모듈에 넘겨보기 전까진 완벽하겐 알수없다.

    "BC", "VISA", "MASTER", "DISCOVER",
    "AMERICANEXPRESS", "DINERSCLUB", "JCB"

*/
function identifyCardByNumber(cardstr) {
    cardstr = cardstr.replace(/\D/g, "");

    function validateCardNumber(cardstr) {

        function sumPV(num) { //sum of place values
            let sum = 0;

            num = parseInt(num);
            while (num > 0) {
                sum += num % 10;
                num /= 10;
                num = parseInt(num);
            }

            return sum;
        }

        let i, sum = 0;
        let cardlen = cardstr.length;
        if (cardlen % 2 == 0) {
            //i%2 == 0
            for (i in cardstr) {
                if (i % 2 == 0) {
                    sum += sumPV(Number(cardstr[i]) * 2);
                } else {
                    sum += Number(cardstr[i]);
                }
            }
        } else {
            //i%2 == 1
            for (i in cardstr) {
                if (i % 2 == 1) {
                    sum += sumPV(Number(cardstr[i]) * 2);
                } else {
                    sum += Number(cardstr[i]);
                }
            }
        }
        return sum % 10 == 0;
    }

    if (!validateCardNumber(cardstr)) {
        return { code: 454 };
    }

    let cardlen = cardstr.length;
    let head;

    //VISA : 1. start with '4' 2. len=12,16
    //Discover  2.start with '5' & len=15
    head = cardstr.substr(0, 1);
    switch (head) {
        case '4':
            if (cardlen == 12 || cardlen == 16) {
                return { code: 200, type: "VISA" };
            }
            break;

        case '5':
            if (cardlen == 15) {
                return { code: 200, type: "DISCOVER" };
            }
            break;
    }

    //American Express : 1.start with '34'/'37' 2.len=15
    //JCB :   2.start with '35' & len=16
    //Diners Club 1. start with '36','38' & len=14
    //MasterCard : 1. start with '51'~'55' 2. len=16
    //BC : 1. start with '94' 2. len=14
    head = cardstr.substr(0, 2);
    switch (head) {
        case '34':
        case '37':
            if (cardlen == 15) {
                return { code: 200, type: "AMERICANEXPRESS" };
            }
            break;

        case '35':
            if (cardlen == 16) {
                return { code: 200, type: "JCB" };
            }
            break;

        case '36':
        case '38':
            if (cardlen == 14) {
                return { code: 200, type: "DINERSCLUB" };
            }
            break;

        case '51':
        case '52':
        case '53':
        case '54':
        case '55':
            if (cardlen == 16) {
                return { code: 200, type: "MASTER" };
            }
            break;
        case '94':
            if (cardlen == 14) {
                return { code: 200, type: "BC" };
            }
            break;
    }



    //Diners Club : 2. start with '300'~'305' & len = 14
    head = cardstr.substr(0, 3);
    switch (head) {
        case '300':
        case '301':
        case '302':
        case '303':
        case '304':
        case '305':
            if (cardlen == 14) {
                return { code: 200, type: "DINERSCLUB" };
            }
    }

    //JCB : 1.start with '2131'/'1800' & len=15
    //Discover : 1. start with 6011 & len=16
    head = cardstr.substr(0, 4);
    switch (head) {
        case '2131':
        case '1800':
            if (cardlen == 15) {
                return { code: 200, type: "JCB" };
            }
            break;

        case '6011':
            if (cardlen == 16) {
                return { code: 200, type: "DISCOVER" };
            }
    }

    return { code: 400 };
}


router.post('/ajax-tunnel/list-payment-method', function (req, res) {
    "TITLE 결제수단 리스팅";//title for api profiler

    console.log("payment.js /list-payment-method");

    let user;
    if (req.isAuthenticated()) {
        user = req.user;
    } else {
        res.status(200).json({isSuccessful: false, message: "로그인 되어 있지 않습니다." });
        return;
    }

    res.status(200).json({ isSuccessful: true,"paymentMethod": user.paymentMethod });
});

router.post('/ajax-tunnel/create-payment-method', function (req, res) {
    "TITLE 결제수단 등록";//title for api profiler

    console.log("payment.js /create_payment-method");

    let alias = req.body.alias;
    let cardNumber = req.body.cardNumber;
    let cvcNumber = req.body.cvcNumber;
    let expireDate = req.body.expireDate;

    let userEmail;
    if (req.isAuthenticated()) {
        userEmail = req.user.userEmail;
    } else {
        res.status(200).json({isSuccessful: false, message: "로그인 되어 있지 않습니다" });
        return;
    }

    if (alias == undefined ||
        cardNumber == undefined ||
        cvcNumber == undefined ||
        expireDate == undefined) {
        console.log("/create_payment-method : errorblank");
        res.status(400).json({isSuccessful: false, message: "필수인자가 비어있습니다." });
        return;
    }

    //만료년월 체크
    let expireMonth = Number(expireDate.substr(0, 2));
    let expireYear = Number(expireDate.substr(2, 2));
    if (expireMonth > 12 || expireMonth < 1 || expireYear < new Date().getYear() - 100) {
        console.log("expire date error :", expireMonth, expireYear);
        res.status(400).json({isSuccessful: false, message: "만료연월 형식에 문제가 있습니다." });
        return;
    }

    //카드 종류 체크
    let idCard = identifyCardByNumber(cardNumber);
    if (idCard.code != 200) {
        console.log("/create_payment-method error(idCard) :", idCard.code);
        res.status(400).json({ isSuccessful: false, message: "카드를 식별할 수 없습니다." });
        return;
    }

    //사용자가 입력한 카드->object
    let cardType = idCard.type;
    let accToPush = {
        "alias": alias,
        "cardNumber": cardNumber,
        "cvcNumber": cvcNumber,
        "expireDate": expireDate,
        "type": cardType
    };

    //alias나 cardNumber가 중복될때
    let accArray = req.user.paymentMethod;
    let i;
    for (i in accArray) {
        if (accArray[i].alias == alias || accArray[i].cardNumber == cardNumber) {
            console.log("/create-payment-method error : card already exists. check alias and card number");
            res.status(200).json({ isSuccessful: false, message: "별칭 혹은 카드번호가 같은 결제 수단이 이미 존재합니다." });
            return;
        }
    }

    //db 업데이트 쿼리
    User.updateOne({ userEmail: userEmail }, { "$push": { paymentMethod: accToPush } }, function (err, result) {
        if (err) {
            console.log("error occured : /create_payment-method updateOne()");
            res.status(500).json({isSuccessful: false, message: "결제 수단을 업데이트하는 도중 에러가 발생했습니다." });
            return;
        }

        console.log("/create_payment-method : created");
        res.status(200).json({
            isSuccessful:true,
            message: "결제 수단 등록에 성공했습니다",
            cardAlias: alias,
            type: cardType
        });
        return;
    });

});

router.post('/ajax-tunnel/delete-payment-method', function (req, res) {
    "TITLE 결제수단 삭제";//title for api profiler

    console.log("payment.js /delete_payment-method");

    let alias = req.body.alias;

    let userEmail;
    if (req.isAuthenticated()) {
        userEmail = req.user.userEmail;
    } else {
        res.status(200).json({isSuccessful: false, message: "로그인 되어 있지 않습니다." });
        return;
    }

    User.updateOne({ userEmail: userEmail }, { "$pull": { paymentMethod: { "alias": alias } } }, function (err, result) {
        if (err) {
            console.log("error occured : /delete_payment-method updateOne()", err);
            res.status(500).json({isSuccessful: false,message: "결제수단을 삭제하는 도중 에러가 발생했습니다." });
            return;
        }

        if (result.nModified == 0) {
            console.log("/delete_payment-method : no account matched with alias \"" + alias + "\"");
            res.status(200).json({isSuccessful: false, message: "매칭되는 결제 수단이 없습니다" });
            return;
        }
        console.log("/delete_payment-method : deleted");
        res.status(200).json({ isSuccessful: true,message: "결제수단을 성공적으로 삭제했습니다." });
        return;
    });

});

router.post('/ajax-tunnel/modify-payment-method', function (req, res) {
    "TITLE 결제수단 별칭 변경";//title for api profiler

    console.log("payment.js /modify_payment-method");

    let alias = req.body.alias;
    let newAlias = req.body.newAlias;

    let userEmail;
    if (req.isAuthenticated()) {
        userEmail = req.user.userEmail;
    } else {
        res.status(200).json({ isSuccessful: false,message: "로그인 되어 있지 않습니다." });
        return;
    }

    User.updateOne({ userEmail: userEmail, "paymentMethod.alias": alias },
        { "$set": { "paymentMethod.$.alias": newAlias } },

        function (err, result) {
            if (err) {
                console.log("error occured : /modify_payment-method updateOne()", err);
                res.status(500).json({ isSuccessful: false,message: "결제 수단 정보를 업데이트 하는 도중 에러가 발생했습니다." });
                return;
            }

            console.log("/modify_payment-method : modified");
            res.status(200).json({
                isSuccessful: true,
                message:"결제 수단 업데이트를 성공했습니다",
                cardNewAlias:alias
            });
            return;
        });

});

router.post('/ajax-tunnel/pay', function (request, response) {
    "TITLE 결제 (결제연동 미구현)";//title for api profiler

    console.log("payment.js /pay");

    let artworkId = Number(request.body.artworkId);

    let userEmail;
    if (request.isAuthenticated()) {
        userEmail = request.user.userEmail;
    } else {
        response.status(200).json({ isSuccessful: false,message: "로그인 되어 있지 않습니다." });
        return;
    }

    Relay(
        //Relay 0
        function startup(relay) {
            console.log("Relay 0");
            relay.callback();
        },


        //Relay 1. get posting info from Artwork model
        function getArtworkInfo(relay) {
            console.log("Relay 1 get artwork info");
            Artwork.findOne({ id: artworkId }, function (error, artworkData) {
                if (error) {
                    console.log(error);
                    response.status(500).json({isSuccessful: false, message: "매칭되는 artwork를 찾는 도중 db서버에서 에러가 발생했습니다." });
                    return;
                }
                if (artworkData == undefined) {
                    console.log("No matching artwork (id=" + artworkId + ")");
                    response.status(404).json({isSuccessful: false, message: "매칭되는 artwork가 없습니다." });
                    relay.callback(true);
                }

                relay.callback(artworkData);
            });
        },

        //Relay 2. check exception (1.tried to buy mine 2.already paid)
        function checkExistence(artworkData, relay) {
            console.log("Relay 2 check existence");


            //check if this is my artwork
            if (artworkData.userEmail == userEmail) {
                console.log("Error : tried to buy my artwork");
                response.status(403).json({ isSuccessful: false,message: "자기 자신의 작품을 구매할 수는 없습니다" });
                return;
            }

            //Check if already purchased
            if (request.user.purchased.includes(artworkData.id)) {
                console.log("Error : already purchased");
                response.status(403).json({ isSuccessful: false,message: "이미 구매한 작품입니다." });
                return;
            }

            relay.$.artworkData = artworkData;
            relay.callback();

        },


        //Relay 3. TODO : ADD VISA PAYMENT API TEST CODE
        function pay(relay) {
            console.log("Relay 3 pay API (not implemented yet)");
            relay.callback();
        },

        //Relay 4. make object : {sellerId:String, buyerId:String, artworkId:Number}
        function makeObj(relay) {
            console.log("Relay 4 make deal object");
            relay.$.dealObject = {
                "sellerId": relay.$.artworkData.userEmail,
                "buyerId": userEmail,
                "artworkId": relay.$.artworkData.id,
                "price": relay.$.artworkData.price
            };

            relay.callback();
        },

        //Relay 5. update the object to USER db
        function updateUserDB(relay) {
            console.log("Relay 5 update USER DB");

            relay.$.updateUserDB = 0;//check if both update succeeded

            //buyer
            User.updateOne(
                { userEmail: relay.$.dealObject.buyerId },
                { "$push": { "purchased": artworkId } },
                relay.callback);

            //seller
            User.updateOne(
                { userEmail: relay.$.dealObject.sellerId },
                { "$inc": { "income": relay.$.dealObject.price } },
                relay.callback);

        },

        //Relay 6 : update USER db callback
        function updateCallback(error, doc, relay) {
            console.log("Relay 6 USER db update Callback");
            if (error) {
                console.log(error);
                if(!response.headersSent){
                    response.status(500).json({ isSuccessful: false,message: "데이터베이스 업데이트 에러" });
                }
                return;
            }

            if(doc.purchased.includes(artworkId)){
                console.log("Buyer DB updated successfully");
            } else {
                console.log("Seller DB updated successfully");
            }

            relay.$.updateUserDB++;
            if(relay.$.updateUserDB==2){
                relay.callback();
            }
            relay._.decPointer();
        },

        //Relay 7: finishing
        function finishing(relay){
            console.log("Relay 6 finishing");
            response.status(200).json({ isSuccessful: true,message: "구매 성공" });
            relay.callback();
        }

    );
});

module.exports = router;
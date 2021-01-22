const express = require('express');
const fs = require('fs');

const router = express.Router();

//function : detect user agent
function detectUserAgent(userAgent){
	if(userAgent.includes("iPhone")){
		return "IPHONE";
	} else if(userAgent.includes("Linux")){
		if(userAgent.includes("Android")){
			return "ANDROID";
		} else {
			return "LINUX";
		}
	} else if(userAgent.includes("Windows")){
		return "WINDOWS";
	} else {
		return "UNKNOWN";
	}
}
function isMobile(userAgent){
	let agentValue = detectUserAgent(userAgent);
    if(agentValue == "ANDROID" || agentValue == "IPHONE"){
        return true;
    }
    else return false;
}

/***********************************************************************************
                           Function-Router boundary
************************************************************************************/

//info adder
router.use(function (request, response, next) {
    let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    let now = new Date().getTime();
    let userAgent = detectUserAgent(request.headers['user-agent']);

    request.clientIP = ip; //클라이언트 ip
    request.now = now; //접속시간
    request.userAgent = userAgent; //유저 환경 : "IPHONE", "ANDROID", "WINDOWS", "LINUX", "UNKNOWN"
    request.isMobile = isMobile(userAgent); //모바일 여부 : true, false

    next();
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Base = require("./base/base");


//noti
router.use("/payment/notification",function(request,response){
	Base.logInfo("Payment Hooked",request.body);
	response.end("OK");

	if(request.body.status != 'paid'){
		console.log("status :",request.body.status);
		return;
	}
});


module.exports = router;
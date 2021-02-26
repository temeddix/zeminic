const express = require("express");
const router = express.Router();

let correct = [0,0];

router.post("/konq/quiz1",function(req,res){

	if(req.body.answer = "녹턴"){
		correct[0] = 1;
		res.end("correct");
	} else {
		res.end("wrong");
	}
});

router.post("/konq/quiz2",function(req,res){

	if(req.body.answer = "티모"){
		correct[1] = 1;
		res.end("correct");
	} else {
		res.end("wrong");
	}
});

router.post("/konq/check",function(req,res){
	if(correct[0]+correct[1]==2){
		res.end("사실 이게 세 번째 과제였다. 고생했다 ;)");
	} else {
		res.end("quiz 1,2를 푸시오!");
	}
});

router.post("/konq/clear",function(req,res){
	correct = [0,0];
	res.json(correct);
});

module.exports = router;
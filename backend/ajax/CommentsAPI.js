const express = require('express');
const Chapters = require("./static/Chapters");
const Comics = require('./static/Comics');
const Comments = require("./static/Comments");
const Base = require("./base/base");
const mongoose = require("mongoose");

const router = express.Router();

//댓글 등록
router.post("/ajax/comments/create", async function(req,res){
});

//댓글 리스팅
router.post("/ajax/comments/list",async function(req,res,next){
  
});

//댓글 삭제
router.post("/ajax/comments/delete", async function(req,res){
    
});

module.exports = router;
//미완. 아직 쓰지 마세효~

const express = require('express');
const Chapters = require("./static/Chapters");
const Base = require("./base/base");
const mongoose = require("mongoose");

const router = express.Router();

//회원 등록
router.post("/ajax/createChapter", async function(req,res){
    let thumbnail = req.body.thumbnail;
    let title = req.body.title;
    let comicID = req.body.comic;//ObjectIdString
    comicID = mongoose.Types.ObjectId(comicID);
    let chargeMethod = req.body.chargeMethod;
    let releaseDate = Number(req.body.releaseDate);
    let price = Number(req.body.price);

    //TODO : 이미지 업로드

    //TODO : Auth 체크

    //TODO : 수정
    let newChapter = new Chapters({
        title : title,
        thumbnail : thumbnail,
        comic : comicID,
        chargeMethod:chargeMethod,
        releaseDate:releaseDate,
        price:price
    });
    //newUser._id.toString()
    //var id = mongoose.Types.ObjectId(hashstring);

    try {
        let result = await newChapter.save();
        Base.logInfo("회차등록 성공",result);
        Base.resYes(res,"회차등록 성공",result);
    } catch (err){
        Base.logErr("회차등록 실패",err);
        Base.resNo(res,"회차등록 실패",err);
    }
} );

router.post("/ajax/removeChapter", async function(req,res){
    //TODO : req
    let _id = req.body.chapterID;
    _id = mongoose.Types.ObjectId(_id);
    //TODO : Auth

    try{
        let result = await Chapters.deleteOne({_id:_id});
        Base.resYes(res,"회차삭제가 성공적으로 처리되었습니다",result);
        Base.logInfo("회차삭제 성공",result);
    } catch(err) {
        Base.resNo(res,"회차삭제 실패 : 비밀번호가 다릅니다.",err);
        Base.logInfo("회차삭제 실패 : 비밀번호가 다릅니다",err);
    }
});

module.exports = router;
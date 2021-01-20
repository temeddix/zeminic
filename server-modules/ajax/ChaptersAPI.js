//미완. 아직 쓰지 마세효~

const express = require('express');
const Chapters = require("./static/Chapters");
const Comics = require('./static/Comics');
const Base = require("./base/base");
const mongoose = require("mongoose");

const router = express.Router();

//챕터 등록
router.post("/ajax/create/chapter", async function(req,res){

    //Auth 체크
    if(!req.isAuthenticated()){
        Base.logInfo("failed to upload chapter. not logined");
        Base.resNo(res,"Login first");
        return;
    }

    //이미지 업로드
    Base.parseForm(req,async function(err,fileds,files){
        if(err){
            Base.logErr("Error occured while parsing form",err);
            Base.resNo(res,"Error occured while parsing form");
            return;
        }

        let title = fields['title'][0];
        let comicTitle = fields['comicTitle'][0];
            let comicID = await Comics.find({title:comicTitle});
            if(!comicID){
                Base.logInfo("failed to create chapter. Comics does not exist",comicTitle);
                Base.resNo(res,"Comics doesn't exist",comicTitle);
                return;
            }
            comicID = comicID._id;
        let chargeMethod = fields['chargeMethod'][0];
        let releaseDate = Number(fields['releaseDate'][0]);
        let price = Number(fields['price'][0]);

        let thumbnail = Base.filenameFromPath(files['thumbnail'][0]['path']);
    },1024*1024*10);

    
    // let newChapter = new Chapters({
    //     title : title,
    //     thumbnail : thumbnail,
    //     comic : comicID,
    //     chargeMethod:chargeMethod,
    //     releaseDate:releaseDate,
    //     price:price
    // });
    // //newUser._id.toString()
    // //var id = mongoose.Types.ObjectId(hashstring);

    // try {
    //     let result = await newChapter.save();
    //     Base.logInfo("회차등록 성공",result);
    //     Base.resYes(res,"회차등록 성공",result);
    // } catch (err){
    //     Base.logErr("회차등록 실패",err);
    //     Base.resNo(res,"회차등록 실패",err);
    // }
} );

//챕터 삭제
router.post("/ajax/delete/Chapter", async function(req,res){
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
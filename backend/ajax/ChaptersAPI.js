const express = require('express');
const Chapters = require("./static/Chapters");
const Comics = require('./static/Comics');
const Comments = require("./static/Comments");
const Base = require("./base/base");
const mongoose = require("mongoose");

const router = express.Router();

//챕터 등록
router.post("/ajax/chapters/create", async function(req,res){

    //Auth 체크
    if(!req.isAuthenticated()){
        Base.logInfo("failed to upload chapter. not logined");
        Base.resNo(res,"Login first");
        return;
    }

    //이미지 업로드
    Base.parseForm(req,async function(err,fields,files){
        if(err){
            Base.logErr("Error occured while parsing form",err);
            Base.resNo(res,"Error occured while parsing form");
            return;
        }

        let title = fields['title'][0];
        let comicTitle = fields['comicTitle'][0];
        let comicID = await Comics.findOne({title:comicTitle});
        if(!comicID){
            Base.logInfo("failed to create chapter. Comics does not exist",comicTitle);
            Base.resNo(res,"Comics doesn't exist",comicTitle);
            return;
        }
        Base.logInfo("Found Coimic info",comicID);
        comicID = comicID['_id'];
        Base.logInfo("comicsId",comicID);
        let chargeMethod = fields['chargeMethod'][0];
        let releaseDate = Number(fields['releaseDate'][0]);
        let price = Number(fields['price'][0]);

        let thumbnail = Base.filenameFromPath(files['thumbnail'][0]['path']);
        Base.uploadBlob(files['thumbnail'][0]['path']);

        let imagesList = []
        for(let i in files['imagesList']){
            Base.uploadBlob(files['imagesList'][i]['path']);
            let filename = Base.filenameFromPath(files['imagesList'][i]['path']);
            imagesList.push(filename);
            //Base.logInfo("blob upload request",files['imagesList'][i]);
        }

        let newChapter = new Chapters({
            _id : Base.newObjectId(),
            title : title,
            thumbnail : thumbnail,
            comicsId : comicID,
            chargeMethod:chargeMethod,
            releaseDate:releaseDate,
            imagesList:imagesList,
            price:price
        });

        
        Base.logInfo("new chapter",newChapter);

        try {
            let result = await newChapter.save();
            Base.logInfo("회차등록 성공",result);
            Base.resYes(res,"회차등록 성공",result);
        } catch (err){
            Base.logErr("회차등록 실패",err);
            Base.resNo(res,"회차등록 실패",err);
        }
    },1024*1024*10);

} );

//챕터 조회
router.post("/ajax/chapters/search",async function(req,res,next){
    let comicTitle = req.body.comicTitle;
    let chapTitle = req.body.chapTitle;

    try{
        let comic = await Comics.findOne({title:comicTitle});

        if(!comic){
            Base.logInfo("No comic found");
            Base.resNo(res,"No comic found");
            return;
        }
        Base.logInfo("Found comic "+comicTitle,comic);

        let chapter =await Chapters.findOne({title:chapTitle,comicsId:comic._id});
        if(!chapter){
            Base.logInfo("No chapter found");
            Base.resNo(res,"Comic exists but no chapter found");
            return;
        }
        Base.logInfo("Found chapter "+chapTitle,chapter);
        Base.resYes(res,"Found chapter "+chapTitle,chapter);
    
    } catch(err){
        Base.logErr("ajax/chapters/search error occured",err);
        Base.resNo(res,"ajax/chapters/search error occured");
    }
    
});

//챕터 리스팅 by comics
router.post("/ajax/chapters/list",async function(req,res,next){
    let comicsId = req.body.comicsId;
    comicsId = Base.newObjectId(comicsId);

    let chapters = await Chapters.find({comicsId:comicsId});
    Base.resYes(res,"found",chapters);
});

//챕터 삭제
router.post("/ajax/chapters/delete", async function(req,res){
    
    if(!req.isAuthenticated()){
        Base.logInfo("Failed to delete Chapter! not logined..");
        Base.resNo(res,"Login first");
        return;
    }

    let chaptersId = Base.newObjectId(req.body.chaptersId);

    //find Chapter
    let chapter = await Chapters.findOne({_id:chaptersId});
    if(!chapter){
        Base.logInfo("cannot find Chapter!");
        Base.resNo(res,"Cannot find chapter");
        return;
    }
    Base.logInfo("Found",chapter);

    //fidn comics
    let comic = await Comics.findOne({_id:chapter.comicsId});
    if(!comic){
        Base.logInfo("cannot find comic");
        Base.resNo(res,"Cannot find comic");
        return;
    }
    Base.logInfo("Found",comic);

    //Check if user==writer
    if(req.user._id.toString() != comic.writerId.toString()){
        Base.logInfo("Failed to delete chapter! id does not match",req.user._id);
        Base.resNo(res,"Writer ID does not match");
        return;
    }

    //try to delete chapter
    try{
        let result = await Chapters.deleteOne({_id:chapter._id});
        Base.resYes(res,"회차삭제가 성공적으로 처리되었습니다",chapter.title);
        Base.logInfo("회차삭제 성공",result);

        result = await Comments.deleteMany({chaptersId:chapter._id});
        Base.logInfo("회차 댓글 삭제 결과",result);
    } catch(err) {
        Base.resNo(res,"회차삭제 실패 : 비밀번호가 다릅니다.");
        Base.logInfo("회차삭제 실패 : 비밀번호가 다릅니다",err);
    }

    //delete chapters thumbnail and images
    let thumbnail = chapter.thumbnail;
    let imagesList = chapter.imagesList;
    Base.logInfo("Trying to delete images",{thumbnail:thumbnail,imgList:imagesList});

    Base.deleteBlob(thumbnail);
    for(let i in imagesList){
        Base.deleteBlob(imagesList[i]);
    }
});

module.exports = router;
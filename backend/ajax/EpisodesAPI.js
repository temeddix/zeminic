const express = require('express');
const Episodes = require("./static/Episodes");
const Series = require('./static/Series');
const Comments = require("./static/Comments");
const Base = require("./base/base");
const mongoose = require("mongoose");
const fs = require("fs");
const Path = require('path');
const Strtest = Base.Strtest;
const FileType = require('file-type');

const router = express.Router();

//에피 등록 단계0 : 로긴첵
let tmpEpisode = {};
tmpEpisode["sampleUser"]={title:"sampleTitle"};
router.post("/ajax/episodes/create",function(req,res,next){
    if(!req.isAuthenticated()){
        Base.resNo(res,"Login first");
        return;
    }
    next();
});

//에피 등록 단계1 : 소속웹툰
router.post("/ajax/episodes/create/seriesId", function(req,res){
    let seriesId = req.body.seriesId;

    //인자체크
    if(seriesId.length != 24){
        Base.resNo(res,"id must be 24-length string");
        return;
    } 

    //초기화
    tmpEpisode[req.user.email] = {};

    //소속웹툰 찾기
    seriesId = Base.newObjectId(seriesId);
    Series.findOne({_id:seriesId})
    .exec()
    .then(result=>{
        if(result){
            tmpEpisode[req.user.email]['seriesId'] = seriesId;
            Base.resYes(res,"Found series",seriesId);
        } else {
            Base.resNo(res,"No series. check id again");
        }
    })
    .catch(err=>{
        Base.logErr("Error : Epi create 1",err);
        Base.resNo(res,"Error occured");
    });

});

//에피 등록 단계2 : 제목, 타입
router.post("/ajax/episodes/create/title", async function(req,res){
    let title = req.body.title;
    let episodeType = req.body.episodeType;

    if(Strtest.testSpc(title)){
        Base.resNo(res,"special characters are not allowed in title");
        return;
    }
    if(!Strtest.testLen(title,2,20)){
        Base.resNo(res,"title len : 2~20 allowed");
        return;
    }
    tmpEpisode[req.user.email]['title'] = title;

    if(episodeType!="text" && episodeType!="illust" && episodeType!="comic"){
        Base.resNo(res,"episodeType : one of text,illust,comic");
        return;
    }
    tmpEpisode[req.user.email]['episodeType'] = episodeType;

    Base.resYes(res,"ok",tmpEpisode[req.user.email]);
});

//에피 등록 단계3 : 결제방식, 공개날짜, 챕터
router.post("/ajax/episodes/create/charging", async function(req,res){
    let chapterTitle = req.body.chapterTitle;
    if(Strtest.testSpc(chapterTitle)){
        Base.resNo(res,"special characters are not allowed in chapterTitle");
        return;
    }
    if(!Strtest.testLen(chapterTitle,2,20)){
        Base.resNo(res,"chapterTitle len : 2~20 allowed");
        return;
    }

    let chargeMethod = req.body.chargeMethod;
    if(chargeMethod!="free" && chargeMethod!="charged" && chargeMethod!="waitCharged"){
        Base.resNo(res,"chargeMethod : one of free,charged,waitCharged");
        return;
    }

    if(isNaN(req.body.price)){
        Base.resNo(res,"price must be number");
        return;
    }
    let price = Number(req.body.price);

    if(isNaN(req.body.releaseDate)){
        Base.resNo(res,"releaseDate must be number");
        return;
    }
    let releaseDate = Number(req.body.releaseDate);

    tmpEpisode[req.user.email]['price'] = price;
    tmpEpisode[req.user.email]['chapterTitle'] = chapterTitle;
    tmpEpisode[req.user.email]['chargeMethod'] = chargeMethod;
    tmpEpisode[req.user.email]['releaseDate'] = releaseDate;

    Base.resYes(res,"ok",tmpEpisode[req.user.email]);
});

//에피 등록 단계4 : 썸네일, 이미지
router.post("/ajax/episodes/create/images", async function(req,res){
    Base.parseForm(req,async function(err,fields,files){
        if(err){
            Base.logErr("parsing error",err);
            Base.resNo(res,"parsing error");
            return;
        }

        let thumbnail = files['thumbnail'][0];
        let imagesList = files['imagesList'];

        //check mime type
        let filetype = await FileType.fromFile(thumbnail['path']);
        if(!filetype ||filetype['mime'].slice(0,5)!="image"){
        	Base.resNo(res,"Thumbnail type is not image",filetype);
        	return;
        }
        for(let i = 0; i < imagesList.length; i++){
        	filetype = await FileType.fromFile(imagesList[i]['path']);
        	if(!filetype ||filetype['mime'].slice(0,5)!="image"){
        		Base.resNo(res,"some images in imagesList are not image",filetype);
        		return;
        	}
        }

        //upload
        Base.uploadBlob(thumbnail['path']);
        thumbnail = Base.filenameFromPath(thumbnail['path']);
        for(let i = 0; i < imagesList.length; i++){
            Base.uploadBlob(imagesList[i]['path']);
            imagesList[i] = Base.filenameFromPath(imagesList[i]['path']);
        }

        tmpEpisode[req.user.email]['thumbnail'] = thumbnail;
        tmpEpisode[req.user.email]['imagesList'] = imagesList;

        Base.resYes(res,"ok",tmpEpisode[req.user.email]);
    }, 1024*1024*8);
});

//에피 등록 단계5 : 최종 확인
router.post("/ajax/episodes/create/check",async function(req,res){
    Base.resYes(res,"check this out!",tmpEpisode[req.user.email]);
});
router.post("/ajax/episodes/create/confirm",async function(req,res){
    let tmp = tmpEpisode[req.user.email];

    if(!tmp.seriesId){
        Base.resNo(res,"seriesId blank");
        return;
    }

    if(!tmp.title){
        Base.resNo(res,"title blank");
        return;
    }

    if(!tmp.episodeType){
        Base.resNo(res,"episodeType blank");
        return;
    }

    let cce = await Series.findOne({_id:tmp.seriesId});
    if(!tmp.chapterTitle && cce.chapterClasscificationEnabled){
        Base.resNo(res,"chapterTitle blank");
        return;
    }

    if(!tmp.chargeMethod){
        Base.resNo(res,"chargeMethod blank");
        return;
    }

    if(!tmp.releaseDate){
        Base.resNo(res,"releaseDate blank");
        return;
    }

    if(!tmp.thumbnail && tmp.episodeType=="comic"){
        Base.resNo(res,"thumbnail blank");
        return;
    }

    if(!tmp.imagesList && tmp.episodeType=="comic"){
        Base.resNo(res,"imagesList blank");
        return;
    }

    tmp._id = Base.newObjectId();
    tmp.registration = Base.getTime();
    tmp.likes = 0;
    tmp.dislikes = 0;
    tmp.viewed = 0;

    if(tmp.episodeType!="comic"){
        tmp.episodeNumber = -1;
    } else {
        tmp.episodeNumber = await Episodes.find({seriesId:tmp.seriesId}).sort({episodeNumber:-1}).limit(1);

        Base.logInfo("found result",tmp.episodeNumber);

        if(tmp.episodeNumber.length == 0){
            tmp.episodeNumber = 0;
        } else{
            tmp.episodeNumber = tmp.episodeNumber[0].episodeNumber+1;
        }
    }

    console.log(tmp.episodeNumber);

    let episode = new Episodes(tmp);
    let result = await episode.save();

    Base.logInfo("episode create result",result);
    Base.resYes(res,"episode created",episode);
});

//에피 등록 : 초기화
router.post("/ajax/episodes/create/clear",async function(req,res){
    tmpEpisode[req.user.email]=null;
    Base.resYes(res,"Thank you!");
});


//에피 조회
router.post("/ajax/episodes/search",async function(req,res,next){
    let seriesTitle = req.body.seriesTitle;
    let epTitle = req.body.epTitle;

    try{
        let series = await Series.findOne({title:seriesTitle});

        if(!series){
            Base.logInfo("No series found");
            Base.resNo(res,"No series found");
            return;
        }
        Base.logInfo("Found series "+seriesTitle,series);

        let episode =await Episodes.findOne({title:epTitle,seriesId:series._id});
        if(!episode){
            Base.logInfo("No episode found");
            Base.resNo(res,"Series exists but no episode found");
            return;
        }
        Base.logInfo("Found episode "+epTitle,episode);
        Base.resYes(res,"Found episode "+epTitle,episode);
    
    } catch(err){
        Base.logErr("ajax/episodes/search error occured",err);
        Base.resNo(res,"ajax/episodes/search error occured");
    }
    
});

//에피 리스팅 by series
router.post("/ajax/episodes/list",async function(req,res,next){
    let seriesId = req.body.seriesId;
    seriesId = Base.newObjectId(seriesId);

    let episodes = await Episodes.find({seriesId:seriesId});
    Base.resYes(res,"found",episodes);
});

//에피 삭제
router.post("/ajax/episodes/delete", async function(req,res){
    
    if(!req.isAuthenticated()){
        Base.logInfo("Failed to delete Episode! not logined..");
        Base.resNo(res,"Login first");
        return;
    }

    let episodesId = Base.newObjectId(req.body.episodesId);

    //find Episode
    let episode = await Episodes.findOne({_id:episodesId});
    if(!episode){
        Base.logInfo("cannot find Episode!");
        Base.resNo(res,"Cannot find episode");
        return;
    }
    Base.logInfo("Found",episode);

    //find series
    let series = await Series.findOne({_id:episode.seriesId});
    if(!series){
        Base.logInfo("cannot find series");
        Base.resNo(res,"Cannot find series");
        return;
    }
    Base.logInfo("Found",series);

    //Check if user==writer
    if(req.user._id.toString() != series.writerId.toString()){
        Base.logInfo("Failed to delete episode! id does not match",req.user._id);
        Base.resNo(res,"Writer ID does not match");
        return;
    }

    //try to delete episode
    try{
        let result = await Episodes.deleteOne({_id:episode._id});
        Base.resYes(res,"회차삭제가 성공적으로 처리되었습니다",episode.title);
        Base.logInfo("회차삭제 성공",result);

        result = await Comments.deleteMany({episodesId:episode._id});
        Base.logInfo("회차 댓글 삭제 결과",result);
    } catch(err) {
        Base.resNo(res,"회차삭제 실패 : 비밀번호가 다릅니다.");
        Base.logInfo("회차삭제 실패 : 비밀번호가 다릅니다",err);
    }

    //delete episodes thumbnail and images
    let thumbnail = episode.thumbnail;
    let imagesList = episode.imagesList;
    Base.logInfo("Trying to delete images",{thumbnail:thumbnail,imgList:imagesList});

    Base.deleteBlob(thumbnail);
    Base.deleteBlob(Base.createHash(series.title+episode.chapterTitle));
    for(let i in imagesList){
        Base.deleteBlob(imagesList[i]);
    }
});

module.exports = router;
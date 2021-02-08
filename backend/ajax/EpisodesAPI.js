const express = require('express');
const Episodes = require("./static/Episodes");
const Series = require('./static/Series');
const Comments = require("./static/Comments");
const Base = require("./base/base");
const mongoose = require("mongoose");
const fs = require("fs");
const Path = require('path');

const router = express.Router();

//에피 등록 (구)
router.post("/ajax/episodes/create", async function(req,res){

    //Auth 체크
    if(!req.isAuthenticated()){
        Base.logInfo("failed to upload episode. not logined");
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

        let title = fields['title'][0]; //제목
        let seriesTitle = fields['seriesTitle'][0]; //웹툰제목
        let chapterTitle = null;

        //챕터 있으면 등록
        if(fields['chapterTitle'][0] && files['chapterPoster'][0]){
            Base.logInfo("chapter enabled",fields['chapterTitle'][0]);
            chapterClassificationEnabled = true;
            chapterTitle = fields['chapterTitle'][0];
            let posterPath = files['chapterPoster'][0]['path'];
            let hashedName = Base.createHash(seriesTitle+chapterTitle);
            let newPosterPath = posterPath.replace(Path.basename(posterPath).split(".")[0], hashedName);
            fs.renameSync(posterPath,newPosterPath);
            Base.logInfo("poster path and hashed path",{posterPath:posterPath, hashedName : hashedName});
            Base.uploadBlob(newPosterPath);
        }

        //소속웹툰 찾기
        let seriesID = await Series.findOne({title:seriesTitle});
        if(!seriesID){
            Base.logInfo("failed to create episode. Series does not exist",seriesTitle);
            Base.resNo(res,"Series doesn't exist",seriesTitle);
            return;
        }
        Base.logInfo("Found Series info",seriesID);
        seriesID = seriesID['_id'];
        Base.logInfo("seriesId",seriesID);

        //변수 초기화
        let chargeMethod = fields['chargeMethod'][0]; //결제방식
        let releaseDate = Number(fields['releaseDate'][0]); //공개날짜
        let price = Number(fields['price'][0]); //가격

        //썸네일 등록
        let thumbnail = Base.filenameFromPath(files['thumbnail'][0]['path']);
        Base.uploadBlob(files['thumbnail'][0]['path']);

        //이미지들 등록
        let imagesList = []
        for(let i in files['imagesList']){
            Base.uploadBlob(files['imagesList'][i]['path']);
            let filename = Base.filenameFromPath(files['imagesList'][i]['path']);
            imagesList.push(filename);
            //Base.logInfo("blob upload request",files['imagesList'][i]);
        }

        let newEpisode = new Episodes({
            _id : Base.newObjectId(),
            title : title,
            chapterTitle : chapterTitle,
            thumbnail : thumbnail,
            seriesId : seriesID,
            chargeMethod:chargeMethod,
            releaseDate:releaseDate,
            imagesList:imagesList,
            price:price,
            registration:Base.getTime()
        });

        
        Base.logInfo("new episode",newEpisode);

        try {
            let result = await newEpisode.save();
            Base.logInfo("회차등록 성공",result);
            Base.resYes(res,"회차등록 성공",result);
        } catch (err){
            Base.logErr("회차등록 실패",err);
            Base.resNo(res,"회차등록 실패",err);
        }
    },1024*1024*10);

} );

//에피 등록 단계0 : 이전꺼 확인
let tmpEpisode = {};
tmpEpisode["sampleUser"]={title:"sampleTitle"};
router.post("/ajax/episode/create/ready",async function(req,res){

});

//에피 등록 단계1 : 소속웹툰
router.post("/ajax/episodes/create/seriesId", async function(req,res){

});

//에피 등록 단계2 : 제목, 타입
router.post("/ajax/episodes/create/title", async function(req,res){

});

//에피 등록 단계3 : 결제방식, 공개날짜, 챕터
router.post("/ajax/episodes/create/charging", async function(req,res){

});

//에피 등록 단계4 : 썸네일, 이미지
router.post("/ajax/episodes/create/images", async function(req,res){

});

//에피 등록 단계5 : 최종 확인
router.post("/ajax/episodes/create/confirm",async function(req,res){

});

//에피 등록 취소
router.post("/ajax/episodes/create/cancel",async function(req,res){
    delete tmpEpisode[req.user.email];
    Base.resYes(res,"Thank you!",{to:"Donghyun", from:"Deok", msg:"Thank you, co-worker", type:"Easter egg"});
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
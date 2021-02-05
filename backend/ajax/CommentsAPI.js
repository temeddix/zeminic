const express = require('express');
const Episodes = require("./static/Episodes");
const Series = require('./static/Series');
const Comments = require("./static/Comments");
const Base = require("./base/base");
const mongoose = require("mongoose");

const router = express.Router();

//댓글 등록
router.post("/ajax/comments/create", async function(req,res){

    if(!req.isAuthenticated()){
        Base.resNo(res,"Login first");
        return;
    }

    try {
        let seriesTitle = req.body.seriesTitle;
        let chapTitle = req.body.chapTitle;
        let text = req.body.text;

        let series = await Series.findOne({title:seriesTitle});

        if(!series){
            Base.resNo(res,"cannot find series",seriesTitle);
            return;
        }
        Base.logInfo("found series",series);

        let episode = await Episodes.findOne({title:chapTitle,seriesId:series._id});
        if(!episode){
            Base.resNo(res,"cannot find episode",chapTitle);
            return;
        }
        Base.logInfo("found episode",episode);

        let dict = {
            _id : Base.newObjectId(),
            writerId : req.user._id,
            text : text,
            registration : Date.now(),
            seriesId : series._id,
            episodesId : episode._id
        };
        Base.logInfo("Comments to create",dict);
        let comment = new Comments(dict);
        

        let result = await comment.save();
        Base.logInfo("/comments/create result",result);
        Base.resYes(res,"comment created",text);

     } catch(err){
         Base.logInfo("/comments/create error",err);
         Base.resNo(res,"/comments/create error");
         return;
     }

});

//댓글 리스팅
router.post("/ajax/comments/list",async function(req,res,next){
    let episodeId = req.body.episodeId;

    episodeId = Base.newObjectId(episodeId);

    let episode = await Episodes.findOne({_id:episodeId});

    if(!episode){
        Base.resNo(res,"No such episode");
        return;
    }
    Base.logInfo("Found episode",episode);

    let comments = await Comments.find({episodesId:episodeId});
    Base.logInfo("Found comments", comments.length);
    Base.resYes(res,"found comments",comments);

});

//댓글 삭제
router.post("/ajax/comments/delete", async function(req,res){
    if(!req.isAuthenticated()){
        Base.resNo(res,"Login first");
        return;
    }

    try {
        let commentId = Base.newObjectId(req.body.commentId);

        let result = await Comments.deleteOne({_id:commentId});
        Base.logInfo("Comment id to delete",commentId);

        if(!result.deletedCount){
            Base.logInfo("No comment deleted",result);
            Base.resNo(res,"No comment deleted",result);
            return;
        }

        Base.logInfo("/comments/delete succeeded",result);
        Base.resYes(res,"comment deleted");

     } catch(err){
         Base.logInfo("/comments/delete error",err);
         Base.resNo(res,"/comments/delete error");
         return;
     }
});

module.exports = router;
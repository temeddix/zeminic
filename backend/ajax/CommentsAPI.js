const express = require('express');
const Chapters = require("./static/Chapters");
const Comics = require('./static/Comics');
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
        let comicTitle = req.body.comicTitle;
        let chapTitle = req.body.chapTitle;
        let text = req.body.text;

        let comic = await Comics.findOne({title:comicTitle});

        if(!comic){
            Base.resNo(res,"cannot find comic",comicTitle);
            return;
        }
        Base.logInfo("found comic",comic);

        let chapter = await Chapters.findOne({title:chapTitle,comicsId:comic._id});
        if(!chapter){
            Base.resNo(res,"cannot find chapter",chapTitle);
            return;
        }
        Base.logInfo("found chapter",chapter);

        let dict = {
            _id : Base.newObjectId(),
            writerId : req.user._id,
            text : text,
            registration : Date.now(),
            comicsId : comic._id,
            chaptersId : chapter._id
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
    let chapterId = req.body.chapterId;

    chapterId = Base.newObjectId(chapterId);

    let chapter = await Chapters.findOne({_id:chapterId});

    if(!chapter){
        Base.resNo(res,"No such chapter");
        return;
    }
    Base.logInfo("Found chapter",chapter);

    let comments = await Comments.find({chaptersId:chapterId});
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
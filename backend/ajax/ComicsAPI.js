const express = require("express");
const Comics = require("./static/Comics");
const Users = require("./static/Users");
const Chapters = require("./static/Chapters");
const Comments = require("./static/Comments");
const Base = require("./base/base");
const Crypto = require("crypto");
const fs = require("fs");

const router = express.Router();

//Comics 등록
router.post("/ajax/comics/create",function(req,res,next){
    if(!req.isAuthenticated()){
        Base.resNo(res,"Login first");
        return;
    }

    Base.parseForm(req,async function(err,fields,files){

        if(err){
            Base.logErr("error parsing form",err);
            Base.resNo(res,"error occured while parsing form");
            return;
        }

        if(files){
            /*  parameter "files" is
                array of
                {"fieldName":"","originalFilename":"","path":"","headers":{"content-disposition":"form-data; name=\"files\"; filename=\"다운로드 (1).jpg\"","content-type":"image/jpeg"},"size":}
            */
            let description = fields.description[0];
            let genre = fields['genre'][0];
            let title = fields['title'][0];
            let poster = "";
            let thumbnail = "";

            if(Object.keys(files).length != 2){
                Base.resNo(res,"just one of thumb/poster uploaded.",files[0].fieldName);
                return;
            }

            Base.logInfo("Form upload fields",fields);
            Base.logInfo("Form upload files",files);

            poster = Base.filenameFromPath(files['poster'][0]['path']);
            thumbnail = Base.filenameFromPath(files['thumbnail'][0]['path']);

            Base.uploadBlob(files['poster'][0]['path']);
            Base.uploadBlob(files['thumbnail'][0]['path']);

            Base.logInfo("Before uploading comics, check info",{
                title : title,
                description : description,
                genre : genre,
                poster : poster,
                thumbnail : thumbnail
            });

            let comics = null;
            let result = null;
            try {
                comics = new Comics({
                    _id : Base.newObjectId() ,
                    title : title,
                    description : description,
                    genre : genre,
                    poster : poster,
                    thumbnail : thumbnail,
                    writerId : req.user._id
                });
    
                result = await comics.save();

                Base.logInfo("Successfully uploaded comics!!",result);
                Base.resYes(res,"Successfully uploaded comics",result);
                return;
            } catch(err){
                Base.logInfo("Error occured while uploading comcis",err);
                Base.resNo(res,"Error occured",err);
                return;
            }
            
        } else {
           Base.resNo(res,"No images uploaded");
           return;
        }
    }, 1024*1024*10);

});

//Comics 조회
router.post("/ajax/comics/search",async function(req,res,next){
    let title = req.body.title;

    try{
        let found = await Comics.find({$text:{$search:title}}, {score:{$meta:"textScore"}}).sort({score: { $meta: "textScore"} });

        if(!found){
            Base.logInfo("No comic found");
            Base.resNo(res,"No comic found");
            return;
        }

        Base.logInfo("Search result",found);
        Base.resYes(res,"search result",found);
    
    } catch(err){
        Base.logErr("error occured while searching comics",err);
        Base.resNo(res,"error occured while searching comics",err);
    }
    
});

//Comics 삭제
router.post("/ajax/comics/delete", async function(req,res,next){
    let comicsId = req.body.comicsId;
    comicsId = Base.newObjectId(comicsId);

    if(!req.isAuthenticated()){
        Base.resNo(res,"Login first");
        return;
    }

    try{
        let found = await Comics.findOne({_id:comicsId});
        let title = found.title;

        if(!found){
            Base.logInfo("No comic found");
            Base.resNo(res,"No comic found");
            return;
        }

        Base.logInfo("Found Comic "+title,found);

        if(found.writerId.toString() != req.user._id.toString()){
            Base.logInfo("cannot delete comic because WRITER ID != USER ID",[found.writerId,req.user._id]);
            Base.resNo(res,"cannot delete comics because you are not writer", req.user.email);
            return;
        }

        let result = await Comics.deleteOne({_id:found._id});
        Base.logInfo("Comics deleteOne result",result);
        
        if(result.ok){
            Base.resYes(res,"Comic "+title+" deleted",result);
        } else {
            Base.resNo(res,"Comic "+title+" not deleted",result);
        }

        Base.deleteBlob(found.thumbnail);
        Base.deleteBlob(found.poster);

        let chapters = Chapters.find({comicsId:found._id});
        for(let i in chapters){
            let thumbnail = chapters[i].thumbnail;
            let imgList = chapters[i].imagesList;
            Base.deleteBlob(thumbnail);
            for(let j in imgList){
                Base.deleteBlob(imgList[j]);
            }
            Comments.deleteMany({_id:chapters[i]._id},(err)=>{
                if(err){
                    Base.logErr("Error occured while deleting comments",{error:err,chapterId:chapters[i]._id});
                }
            });
        }
    
    } catch(err){
        Base.logErr("error occured",err);
        Base.resNo(res,"error occured");
    }
});

module.exports = router;
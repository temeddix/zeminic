const express = require("express");
const Series = require("./static/Series");
const Users = require("./static/Users");
const Episodes = require("./static/Episodes");
const Comments = require("./static/Comments");
const Base = require("./base/base");
const Crypto = require("crypto");
const fs = require("fs");

const router = express.Router();

//Series 등록
router.post("/ajax/series/create",function(req,res,next){
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

            Base.logInfo("Before uploading series, check info",{
                title : title,
                description : description,
                genre : genre,
                poster : poster,
                thumbnail : thumbnail
            });

            let series = null;
            let result = null;
            try {
                series = new Series({
                    _id : Base.newObjectId() ,
                    title : title,
                    description : description,
                    genre : genre,
                    poster : poster,
                    thumbnail : thumbnail,
                    writerId : req.user._id,
                    registration:Base.getTime()
                });
    
                result = await series.save();

                Base.logInfo("Successfully uploaded series!!",result);
                Base.resYes(res,"Successfully uploaded series",result);
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

//Series 조회
router.post("/ajax/series/search",async function(req,res,next){
    let title = req.body.title;

    try{
        let found = await Series.find({$text:{$search:title}}, {score:{$meta:"textScore"}}).sort({score: { $meta: "textScore"} });

        if(!found){
            Base.logInfo("No series found");
            Base.resNo(res,"No series found");
            return;
        }

        Base.logInfo("Search result",found);
        Base.resYes(res,"search result",found);
    
    } catch(err){
        Base.logErr("error occured while searching series",err);
        Base.resNo(res,"error occured while searching series",err);
    }
    
});

//Series 삭제
router.post("/ajax/series/delete", async function(req,res,next){
    let seriesId = req.body.seriesId;
    seriesId = Base.newObjectId(seriesId);

    if(!req.isAuthenticated()){
        Base.resNo(res,"Login first");
        return;
    }

    try{
        let found = await Series.findOne({_id:seriesId});
        let title = found.title;

        if(!found){
            Base.logInfo("No series found");
            Base.resNo(res,"No series found");
            return;
        }

        Base.logInfo("Found Series "+title,found);

        if(found.writerId.toString() != req.user._id.toString()){
            Base.logInfo("cannot delete series because WRITER ID != USER ID",[found.writerId,req.user._id]);
            Base.resNo(res,"cannot delete series because you are not writer", req.user.email);
            return;
        }

        let result = await Series.deleteOne({_id:found._id});
        Base.logInfo("Series deleteOne result",result);
        
        if(result.ok){
            Base.resYes(res,"Series "+title+" deleted",result);
        } else {
            Base.resNo(res,"Series "+title+" not deleted",result);
        }

        Base.deleteBlob(found.thumbnail);
        Base.deleteBlob(found.poster);

        let episodes = Episodes.find({seriesId:found._id});
        for(let i in episodes){
            let thumbnail = episodes[i].thumbnail;
            let imgList = episodes[i].imagesList;
            Base.deleteBlob(thumbnail);
            for(let j in imgList){
                Base.deleteBlob(imgList[j]);
            }
            Comments.deleteMany({_id:episodes[i]._id},(err)=>{
                if(err){
                    Base.logErr("Error occured while deleting comments",{error:err,episodeId:episodes[i]._id});
                }
            });
        }
    
    } catch(err){
        Base.logErr("error occured",err);
        Base.resNo(res,"error occured");
    }
});

module.exports = router;
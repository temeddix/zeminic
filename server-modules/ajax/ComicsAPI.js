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
            let genre = fields.genre[0];
            let title = fields.title[0];
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
router.post("/ajax/comics/search",function(req,res,next){
    
});

//Comics 삭제
router.post("/ajax/comics/remove", function(req,res,next){

});

module.exports = router;
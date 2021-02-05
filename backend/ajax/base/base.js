const mongoose = require('mongoose');
const sendMail = require("./sendMail");
const Log = require("./log");
const Crypto = require('crypto');
const Path = require('path');
const Blob = require('./blob');
const Multiparty = require('multiparty');

module.exports = {
    getTime : function(){
        return Date.now();
    },

    newObjectId : mongoose.Types.ObjectId,

    logInfo : Log.logInfo,

    logErr : Log.logErr,

    resYes : function(res,msg,data){
        res.json({isOk:true,msg:msg,ref:data});
    },
    
    resNo : function(res,msg,data){
        res.json({isOk:false,msg:msg,ref:data});
    },

    filenameFromPath : function(path){
        return Path.basename(path);
    }
    ,

    createHash : function(str){
        return Crypto.createHash("sha512").update(str).digest("base64");
    },

    sendMail : sendMail,

    randomToken : function f(){
        return Crypto.randomBytes(48).toString('hex');
    },

    uploadBlob : Blob.uploadBlob,
    deleteBlob : Blob.deleteBlob,
    genTmpSASUri : Blob.genTmpSASUri,

    parseForm : function(req, callback, maxFilesSize){
        if(!maxFilesSize){
            maxFilesSize = 1024*1024*8;
        }
        let form = new Multiparty.Form({
            uploadDir:Path.join(__dirname,"tmpblobs"),
            maxFilesSize : maxFilesSize
        });

        form.parse(req, callback);//callback(err,fileds,files)
    }
    
};
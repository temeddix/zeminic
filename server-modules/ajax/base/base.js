const mongoose = require('mongoose');

module.exports = {
    getTime : function(){
        return Date.now();
    },

    newObjectId : function(){
        return mongoose.Types.ObjectId();
    },

    logInfo : function(msg,data){
        console.log("INFO :",msg,data);
    },

    logErr : function(msg,data){
        console.log("ERROR :",msg,data);
    },

    resYes : function(res,msg,data){
        res.json({isOk:true,msg:msg,ref:data});
    },
    
    resNo : function(res,msg,data){
        res.json({isOk:false,msg:msg,ref:data});
    }
};
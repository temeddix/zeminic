const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "series";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,

    //기본 필수 정보
    title : {type:String, default : "no title"},
    description : {type:String,default:"no description"},
    tags : {type:String,default:null},
    writerId : {type:mongoose.Schema.Types.ObjectId, ref:"users"},

    //이미지
    thumbnail : {type:String,default:"undefined"},
    poster : {type:String,default:"undefined"},

    //옵셔널 정보
    ads5secsEnabled : {type:Boolean, default:false},
    adsEdgebannerEnabled : {type:Boolean, default:false},
    chapterClassificationEnabled : {type:Boolean, default:false},


    //서버에서 자동등록
    likes : {type:Number,default:0},
    dislikes : {type:Number,default:0},
    numOfSubscribers : {type:Number,default:0},
    registration : {type:Number, default:0}
    
});
//userSchema.index({"$**":"text"});
userSchema.index({title:"text"});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
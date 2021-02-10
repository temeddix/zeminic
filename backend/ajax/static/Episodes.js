const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "episodes";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    
    //단계별 등록 순서대로 나열

    //1. 어떤 웹툰 소속인가
    seriesId : {type:mongoose.Schema.Types.ObjectId, ref:"series", default:null},
    
    //2. 회차 제목과 타입
    title : {type:String, default : "no title"}, 
    episodeType : {type:String, default:"comic"}, //text, illust, comic

    //3. 소속 챕터 설정, 결제방식, 공개날짜
    chapterTitle : {type:String, default:null},
    price : {type:Number,default:0},
    chargeMethod : {type:String,default:"free"}, //유료 charged, 기무 waitCharged
    releaseDate : {type:Number,default:0},
    
    //4. 이미지 등록
    thumbnail : {type:String,default:"undefined"},
    imagesList : [String],


    //서버에서 자동 등록 
    registration : {type:Number, default:0},
    episodeNumber : {type:Number, default:-1},
    likes : {type:Number,default:0},
    dislikes : {type:Number,default:0},
    viewed : {type:Number,default:0}
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
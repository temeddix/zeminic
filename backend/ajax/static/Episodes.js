const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "episodes";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {type:String, default : "no title"},
    likes : {type:Number,default:0},
    dislikes : {type:Number,default:0},
    viewed : {type:Number,default:0},
    episodeType : {type:String, default:"webtoon"},
    thumbnail : {type:String,default:"undefined"},
    title : {type:String,default:"notitle"},
    imagesList : [String],
    seriesId : {type:mongoose.Schema.Types.ObjectId, ref:"series", default:null},
    chapterTitle : {type:String, default:null},
    registration : {type:Number, default:0},
    chargeMethod : {type:String,default:"free"}, //유료 charged, 기무 waitCharged
    releaseDate : {type:Number,default:0},
    price : {type:Number,default:0}
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
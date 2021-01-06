const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "chapters";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    likes : {type:Number,default:0},
    dislikes : {type:Number,default:0},
    viewed : {type:Number,default:0},
    thumbnail : {type:String,default:"undefined"},
    title : {type:String,default:"notitle"},
    imagesList : [Number],
    comic : {type:mongoose.Schema.Types.ObjectId, ref:"comics"},
    commentsList : [{type : mongoose.Schema.Types.ObjectId,ref:"comments"}],
    registration : {type:Number, default:Date.now()},
    chargeMethod : {type:String,default:"무료"},
    releaseDate : {type:Number,default:Date.now()+1000*60*60*24*7},
    price : {type:Number,default:0}
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
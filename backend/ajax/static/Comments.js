const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "comments";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    writerId : {type:mongoose.Schema.Types.ObjectId, ref:"users",default:"undefined"},
    likes : {type:Number,default:0},
    dislikes : {type:Number,default:0},
    text : {type:String, default:"undefined"},
    registration : {type:Number, default:0},
    comicsId : {type:mongoose.Schema.Types.ObjectId, ref:"comics"},
    chaptersId : {type:mongoose.Schema.Types.ObjectId, ref:"chapters"}
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
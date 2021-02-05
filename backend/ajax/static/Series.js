const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "series";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {type:String, default : "no title"},
    description : {type:String,default:"no description"},
    genre : {type:String,default:"genre not specified"},
    thumbnail : {type:String,default:"undefined"},
    poster : {type:String,default:"undefined"},
    writerId : {type:mongoose.Schema.Types.ObjectId, ref:"users"},
    //episodeList : [{type:mongoose.Schema.Types.ObjectId, ref:"episodes"}],
    likes : {type:Number,default:0},
    dislikes : {type:Number,default:0},
    numOfSubscribers : {type:Number,default:0},
    chapterClassificationEnabled : {type:Boolean, default:false},
    posterPerChapters : [String],
    //chaptersList : [[{type:mongoose.Schema.Types.ObjectId, ref:"episodes"}]],
    registration : {type:Number, default:0},
    ads5secsEnabled : {type:Boolean, default:false},
    adsEdgebannerEnabled : {type:Boolean, default:false}
});
//userSchema.index({"$**":"text"});
userSchema.index({title:"text"});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
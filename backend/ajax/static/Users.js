const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "users";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email:{type:String,unique:true},
    pw:String,
    nickname:{type:String,unique:true},
    income:{type:Number, default:0},
    billingKey:[],
    bankAccount:{type:String, default:"undefined"},
    uploads:[{type:mongoose.Schema.Types.ObjectId, ref:"series"}],
    purchased:[{type:mongoose.Schema.Types.ObjectId, ref:"episodes"}],
    subscribed:[{type:mongoose.Schema.Types.ObjectId, ref:"series"}],
    recentlyViewed:[{type:mongoose.Schema.Types.ObjectId, ref:"episodes"}],
    liked:[{type:mongoose.Schema.Types.ObjectId, ref:"series"}],
    disliked:[{type:mongoose.Schema.Types.ObjectId, ref:"series"}],
    registration:{type:Number, default:0},
    searchHistroy:[String]
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
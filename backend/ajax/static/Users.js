const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "users";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email:{type:String,unique:true},
    pw:String,
    nickname:{type:String,unique:true},
    billingKey:[String],
    bankAccount:{type:String, default:"undefined"},
    uploads:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    purchased:[{type:mongoose.Schema.Types.ObjectId, ref:"chapters"}],
    subscribed:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    recentlyViewed:[{type:mongoose.Schema.Types.ObjectId, ref:"chapters"}],
    liked:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    disliked:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    registration:{type:Number, default:0},
    searchHistroy:[String]
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
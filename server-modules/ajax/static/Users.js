const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "users";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email:{type:String,unique:true},
    pw:String,
    nickname:{type:String,unique:true},
    billingKey:{type:String, default:"undefined"},
    bankAccount:{type:String, default:"undefined"},
    uploads:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    purchased:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    subscribed:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    recentlyViewed:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    liked:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    disliked:[{type:mongoose.Schema.Types.ObjectId, ref:"comics"}],
    registration:{type:Number, default:Date.now()},
    searchHistroy:[String]
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
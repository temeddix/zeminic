const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = "payments";
const userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    impuid : String,
    registration:Number,
    merchant_uid : String,
    buyerId : {type:mongoose.Types.ObjectId,ref:"users"},
    chaptersId : {type:mongoose.Types.ObjectId,ref:"chapters"}
});

let mongomodel = mongoose.model(collectionName, userSchema, collectionName);

module.exports = mongomodel;
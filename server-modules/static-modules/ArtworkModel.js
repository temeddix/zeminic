const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoConnection = require("./MongoConnection.js");

//schema for user account
const boardSchema = new Schema({
    id:Number,
    imgs:Array,
    thumbnail:String,
    userEmail:String,
    userAlias:String,
    uploadTime:Number,
    price:Number,
    title:String,
    content:String

    //for meta
    ,
    count:Number,
    maxIndex:Number
});

var  mongomodel = mongoose.model('Board', boardSchema, mongoConnection.Collections["ARTWORK"]);

module.exports = mongomodel;
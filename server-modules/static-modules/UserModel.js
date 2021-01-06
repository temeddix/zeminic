const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoConnection = require("./MongoConnection.js");

//schema for user account
const userSchema = new Schema({
	userEmail:String,
	userPw:String,
	paymentMethod:[],
	uploads:[],
	income:Number,
	purchased:[],
	userAlias:String,
	profileImage:String
});

var mongomodel = mongoose.model('User', userSchema, mongoConnection.Collections["LOGIN"]);

module.exports = mongomodel;
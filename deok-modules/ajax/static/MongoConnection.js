const mongoose = require('mongoose');

var connectedFlag = false;
var callbacklist = [];

//functions that must be exectued after mongo connection success
function _postConnectCallback(cbfunc){
    if(connectedFlag){
        cbfunc();
    } else {
        callbacklist.push(cbfunc);
    }
}

function connectMongo(logmsg, option) {

    const conOption = {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
    };

    if (logmsg == undefined) {
        logmsg = "mongo connected";
    }
    if (option == undefined) {
        option = conOption;
    }

    const mongourl = "mongodb+srv://kundukdong:3workingtogether@cluster0-ughe6.azure.mongodb.net/Zeminem";

    console.log("trying to connect mongo...")

    mongoose.connect(mongourl, option, function (err) {

        if (err) {
            console.log("Error occured while connecting to mongodb.");
            console.log("Maybe your ip is not whitelisted in atlas");
            console.log("Error log : ");
            console.log(err);
            console.log("halting node server..");
            process.exit(-1);
        } else {
            //when mongo connected
            console.log(logmsg);
            connectedFlag = true;
        }

        var i;
        console.log("MongoConnection.js : there are",callbacklist.length,"callbacks");
        for(i in callbacklist){
            console.log("calling callback",i+1);
            callbacklist[i]();
        }
    });
}

module.exports = {
    connect: connectMongo,
    addCallback : _postConnectCallback,
};
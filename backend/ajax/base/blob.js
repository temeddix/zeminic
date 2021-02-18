const Key1 = "b2vwLRTxP8eAkVXVppvzWAH9wt4nXkb/U4ikQsfg9HySGBuytk+TZAyaO62ck1l0lUvTg9SJ1O6Xwd5cUoBWzQ==";
const ConString1 = "DefaultEndpointsProtocol=https;AccountName=kddsa;AccountKey=b2vwLRTxP8eAkVXVppvzWAH9wt4nXkb/U4ikQsfg9HySGBuytk+TZAyaO62ck1l0lUvTg9SJ1O6Xwd5cUoBWzQ==;EndpointSuffix=core.windows.net";
const Key2 = "nEmq50tH65+gcQX03Gr18rEGW8ojEx+WyYAAQVwtvSUukCDBR+pi/bkJC/cTPIYs6pdiL65Q80tGXDXch3rQTA==";
const ConString2 = "DefaultEndpointsProtocol=https;AccountName=kddsa;AccountKey=nEmq50tH65+gcQX03Gr18rEGW8ojEx+WyYAAQVwtvSUukCDBR+pi/bkJC/cTPIYs6pdiL65Q80tGXDXch3rQTA==;EndpointSuffix=core.windows.net";

const Azure = require("azure-storage");
const Log = require("./log");

const CONTAINER_NAME = "imgs";
const STORAGE_NAME = "kddsa";

const fs = require('fs');
const path = require('path');

const Sharp = require('sharp');

if (!fs.existsSync("./backend/ajax/base/tmpblobs")) {
    fs.mkdirSync("./backend/ajax/base/tmpblobs");
}

const BLOBSVC = Azure.createBlobService(
	STORAGE_NAME,
	Key1
);
BLOBSVC.createContainerIfNotExists(CONTAINER_NAME, function (error, result, response) {
	if (error) {
		console.log("error occured while creating container");
		console.log(error);
		return;
	}

	console.log("create Container result", result.created);
	console.log("create Container response", response.isSuccessful, response.statusCode);
});

function resize(imgPath,w,h, outImg, callback) { //callback : err, resizeImage
	sharp(imgPath).resize(w,h).toFile(outImg, callback);
}

//upload blob
function uploadBlob(filepath) {

	let fileNameToUpload = path.basename(filepath);
	BLOBSVC.createBlockBlobFromLocalFile(CONTAINER_NAME, fileNameToUpload, filepath, (err,data)=>{
		Log.logInfo("Blob upload result",[err,data]);
	});

}

function deleteBlob(blobname) {//callback : err,response
	BLOBSVC.deleteBlob(CONTAINER_NAME, blobname, (err,data)=>{
		Log.logInfo("Blob delete result",[err,data]);
	});
}

function genTmpSASUri(blobname) {
	var startDate = new Date();
	var expiryDate = new Date(startDate);
	expiryDate.setMinutes(startDate.getMinutes() + 1);
	startDate.setMinutes(startDate.getMinutes() - 100);
	var sharedAccessPolicy = {
		AccessPolicy: {
			Permissions: Azure.BlobUtilities.SharedAccessPermissions.READ,
			Start: startDate,
			Expiry: expiryDate
		},
	};
	var token = BLOBSVC.generateSharedAccessSignature(CONTAINER_NAME, blobname, sharedAccessPolicy);
	var sasurl = BLOBSVC.getUrl(CONTAINER_NAME, blobname, token);

	return sasurl;
}

//파일 삭제
function cleanFile(filepath, name) {
	if (name == undefined) {
		name = "cleanFile()";
	}

	fs.unlink(filepath, function (error) {
		if (error) {
			console.log(name + " unlink error");
		} else {
			console.log("successfuly unlinked", filepath);
		}
	});
}

//디렉토리 비우기
function cleanDir(dirpath, name) {//폴더경로, 호출자 이름
	if (name == undefined) {
		name = "cleanDir()";
	}

	fs.readdir(dirpath, function (error, files) {
		if (error) {
			console.log(name + " readdir error");
		}

		for (var file of files) {
			fs.unlink(path.join(dirpath, file), function (error) {
				if (error) {
					console.log(name + " unlink error");
				}
			});
		}
	});
}

module.exports = {
	uploadBlob : uploadBlob,
	deleteBlob : deleteBlob,
	genTmpSASUri : genTmpSASUri,
	cleanFile : cleanFile,
	cleanDir : cleanDir,
	resize : resize
};
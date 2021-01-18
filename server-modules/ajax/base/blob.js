const Key1 = "H7hAYCYaifLeL2arLA7uO4MiqXTsmOzb0BQWo4J4yWOQDo6NuISP0SDiUWeNVu3xfsdNClRYYH3a5Y2+bEXqtQ==";
const ConString1 = "DefaultEndpointsProtocol=https;AccountName=kddsa;AccountKey=H7hAYCYaifLeL2arLA7uO4MiqXTsmOzb0BQWo4J4yWOQDo6NuISP0SDiUWeNVu3xfsdNClRYYH3a5Y2+bEXqtQ==;EndpointSuffix=core.windows.net";
const Key2 = "PC3VFxU6l+QbPCOlhne2mt53i+fo3En5xiWyshZNi1ow4dBkj1M+gfXHNnvD1rXzEvIFxteXp0OBWvnqN25o9A==";
const ConString2 = "DefaultEndpointsProtocol=https;AccountName=kddsa;AccountKey=PC3VFxU6l+QbPCOlhne2mt53i+fo3En5xiWyshZNi1ow4dBkj1M+gfXHNnvD1rXzEvIFxteXp0OBWvnqN25o9A==;EndpointSuffix=core.windows.net";

const Azure = require("azure-storage");
const Log = require("./log");

const CONTAINER_NAME = "imgs";
const STORAGE_NAME = "kddsa";

const fs = require('fs');
const path = require('path');

const Sharp = require('sharp');

if (!fs.existsSync("tmpblobs")) {
    fs.mkdirSync("tmpblobs");
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
	let fileNameToUpload = filepath.replace(/^.*[\\\/]/, '');
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
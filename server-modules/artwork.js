//tip : Ctrl+K+0, Ctrl+K+J

//commonly required
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

//file upload module
const formidable = require('formidable');

//Deok's modules
const Artwork = require("./static-modules/ArtworkModel.js");
const User = require("./static-modules/UserModel.js");
const Relay = require("./custom-modules/Relay3.js");

//constants for azure blob
const ApiKey = require('./static-modules/ApiKey.js');
const azure = require('azure-storage');
const CONTAINER_NAME = "minigallery";
const STORAGE_NAME = "kddsa";
const AZURE_KEY0 = ApiKey['azure0'];
const AZURE_KEY1 = ApiKey['azure1']; //spare key

//img resizing module for thumbnails
const sharp = require('sharp');

//init artwork maxid, mkdir upload&download folder
var artworkMaxIndex = -1;
function initMaxIndex() {
	console.log("initMaxIndex() called");

	var minSearchIndex = -1;

	Artwork.find({ "id": { "$gt": minSearchIndex } })
		.sort({ "id": -1 })
		.limit(1).exec()
		.then(function (doc) {
			//console.log("doc",doc);
			artworkMaxIndex = doc[0].id;
			console.log("initMaxIndex() : current max index =" + artworkMaxIndex);
		})
		.catch(function (error) {
			console.log("initMaxIndex() error occured. halting process");
			console.log(error);
			process.exit(-1);
		});

	if (!fs.existsSync("temporary-blobs")) {
		fs.mkdirSync("temporary-blobs");
	}
	if (!fs.existsSync("temporary-blobs/upload")) {
		fs.mkdirSync("temporary-blobs/upload");
	}
	if (!fs.existsSync("temporary-blobs/download")) {
		fs.mkdirSync("temporary-blobs/download");
	}
}
require('./static-modules/MongoConnection.js').postConnectCallback(initMaxIndex);

//azure blob connection info & init
const BLOBSVC = azure.createBlobService(
	STORAGE_NAME,
	AZURE_KEY0
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

//image resizing (making thumbnail image)
function resize(imgPath, outImg, callback) { //callback : err, resizeImage
	sharp(imgPath).resize(376, 282).toFile(outImg, callback);
}

//upload blob f_getFileNameFromFilePath
function f_getFileNameFromFilePath(filepath) {
	let splitted = filepath.split("/");
	if (splitted.length <= 1) {
		splitted = filepath.split("\\");
	}
	let fname = splitted[splitted.length - 1];
	return fname;
}
//upload blob
function uploadBlob(filepath, cb_func) {
	let fileNameToUpload = f_getFileNameFromFilePath(filepath);
	BLOBSVC.createBlockBlobFromLocalFile(CONTAINER_NAME, fileNameToUpload, filepath, cb_func);

}

//delete blob when artwork error occured
function deleteBlob(blobname, cb_func) {//callback : err,response
	BLOBSVC.deleteBlob(CONTAINER_NAME, blobname, cb_func);
}

//make temp url
function genTmpSASUri(blobname) {
	var startDate = new Date();
	var expiryDate = new Date(startDate);
	expiryDate.setMinutes(startDate.getMinutes() + 1);
	startDate.setMinutes(startDate.getMinutes() - 100);
	var sharedAccessPolicy = {
		AccessPolicy: {
			Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
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

function getUnixTimeStamp() {
	return new Date().getTime();
}


/*
◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆

								함수 - 라우터 경계선
								위로는 함수 아래로는 라우터

◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
*/

//게시글 업로드
//↓ 업로드할 이미지 임시 보관폴더 경로
const uploadPath = './temporary-blobs';
router.post("/admin/clear-tmp", function(request,response){
	cleanDir(uploadPath, "clear-tmp");
});
router.post("/ajax-tunnel/artwork-post", function (request, response) {
	"TITLE 게시물 업로드";//title for api profiler

	//※ 주의 : 여기선 body-parser로 post 요청 데이터를 받을 수 없음. 이유가 궁금하면 Deok에게 질문할것
	//↓ api 프로파일러를 위한 인자 표시
	"req.body.title;req.body.content;req.body.price";

	//↓ 없으면 생성
	if (!fs.existsSync(uploadPath)) {
		fs.mkdir(uploadPath, function (error) {
			if (error) {
				console.log("/artwork-post error occured while generating upload path");
				response.status(200).json({ isSuccessful: false, message: "upload path를 생성도중 에러가 발생했습니다." });
			} else {
				console.log("upload path successfully created!", uploadPath);
			}
		});
	}


	//사용자가 로그인한 상태인지 확인
	if (!request.isAuthenticated()) {
		console.log("/artwork-post error : not authenticated..");
		response.status(200).json({ isSuccessful: false, message: "로그인 되어 있지 않습니다." });
		return;
	}

	//↓ function-scoped variables 선언 (어지러워서 하나로 모아둠)
	let artworkNextIndex = artworkMaxIndex + 1; //게시물 db에 id값으로 들어감
	let userEmail = request.user.userEmail; //게시물 db에 userEmail값으로 들어감
	let userAlias = request.user.userAlias; //게시물 db에 userAlias값으로 들어감
	let filenum = 0; //업로드 파일 개수 카운트
	let title, content, price; //게시글 제목과 내용을 저장할 변수 -> 게시물 db로 들어감.
	let imgarr = []; //게시글 db에 들어갈 이미지 배열
	let thumbnail; //게시글 썸네일 이미지 블롭네임
	let firstImage;//first img path for thumbnail


	//↓ 폼 데이터 받을 준비
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.uploadDir = uploadPath;
	form.keepExtensions = true;
	form.maxFileSize = 20 * 1024 * 1024;//mb
	form.hash = false;
	form.multiples = true;


	//폼 이벤트리스너 : 파일 하나 들어올때마다 호출
	form.on('file', function (field, file) {
		if (file.name == '' && file.size == 0) { //파일 없으면 에러
			filenum = 0;
			if (response.headersSent) {
				return;
			}
			response.status(200).json({ isSuccessful: false, message: "파일이 없습니다" });
			return;
		}

		//file.name : 클라이언트의 ㅇ파일 원본 이름
		//file.path : 내 서버에 저장된 파일명 (경로포함, upload_랜덤숫자 형식으로 생성됨)
		//file.size : 파일 크기 (단위 : bytes)
		filenum++;
		console.log("upload file info:", file.name, "to", file.path, " (", file.size, "bytes )");
	});

	//input form 데이터 받기
	form.on('field', function (field, value) {
		console.log("field", field, "value", value);
		switch (field) {
			case "title"://<input ... name='title' ... />
				title = value;
				if (value == "") {
					console.log("/upload-image error : title blank..");
					if (response.headersSent) {
						return;
					}
					response.status(200).json({ isSuccessful: false, message: "제목이 비었습니다" });
					return;
				}
				break;
			case "content"://<input .. name='content' ... />
				content = value;
				if (value == "") {
					console.log("/upload-image error : content blank..");
					if (response.headersSent) {
						return;
					}
					response.status(200).json({ isSuccessful: false, message: "본문이 비었습니다" });
					return;
				}
				break;
			case "price":
				console.log("price", value);
				if (value == "") {
					console.log("/upload-image error : price blank..");
					if (response.headersSent) {
						return;
					}
					response.status(200).json({ isSuccessful: false, message: "가격이 설정되어 있지 않습니다" });
					return;
				}
				price = Number(value);
				break;
		}
	});

	//폼 이벤트 리스너 : 업로드 완료 이벤트
	form.on('end', function () {
		console.log("\nUpload completed");
	});

	Relay(
		//Relay 0 : call parse()
		function startPoint(relay) {
			console.log("Relay 0 : Artwork-post");
			form.parse(request, relay.callback);
		},

		//Relay 1 : 애저 블롭 업로드
		function afterParsingForm(error, fields, files, relay) {
			console.log("Relay 1 : Artwork-post");

			//에러 처리
			if (error) {
				console.log("/upload form.parse() error");
				console.log(error);
				if (response.headersSent) {
					return;
				}
				response.status(200).json({ isSuccessful: false, message: "form 파싱중 에러가 발생했습니다." });
				return;
			}

			//
			if (price == 0 || title == "" || content == "") {
				console.log("필수 인자가 비어있습니다.");
				return;
			}

			//미디어서버(azure storage)에 이미지 업로드
			let i;
			relay.$.countCb = 0;

			if (filenum == 0) {
				console.log("no image");
				response.json({
					isSuccessful: false,
					message: "이미지가 없습니다."
				});
				return;
			} else if (filenum == 1) {
				console.log("files[fileobj]=", files["fileobj"].path);
				uploadBlob(files["fileobj"].path, relay.callback);
				firstImage = files["fileobj"].path;
			} else {
				files = files['fileobj'];
				for (i in files) {
					uploadBlob(files[i].path, relay.callback);
				}
				firstImage = files[0].path;
			}

			// //썸네일 업로드
			// console.log("making thumbnail");
			// console.log("first image :", firstImage); //firstImage = 첫 이미지 경로 (내 코드 서버로 업로드된.)
			// console.log("img file num", filenum);
			// console.log("trying to resize first img to make thumbnail");

			// let outpath = String(artworkNextIndex) + "t";
			// console.log("outpath", outpath);
			// resize(firstImage, outpath, function (err, resized) {
			// 	if (err) {
			// 		thumbnail = "ERROR";
			// 		console.log("error occured while making thumbnail", err);
			// 	} else {
			// 		console.log("resizing completed");

			// 		uploadBlob(outpath, function (error, result, res) {
			// 			if (error) {
			// 				console.log("thumbnail upload error");
			// 				console.log(error);
			// 				if (response.headersSent) {
			// 					return;
			// 				}
			// 				response.status(200).json({ isSuccessful: false, message: "blob thumbnail upload 도중 에러가 발생했습니다." });
			// 				return;
			// 			}

			// 			console.log("thumbnail created!!",outpath);
			// 			thumbnail = outpath;
			// 		});
			// 	}
			// });

		},

		//Relay 2 업로드 콜백, 다 업로드되면 다음relay로 "진행시켜"
		function uploadCallback(error, result, res, relay) {
			relay.$.countCb++;

			if (error) {
				console.log("/artwork-post blob upload error");
				console.log(error);
				if (response.headersSent) {
					return;
				}
				response.status(200).json({ isSuccessful: false, message: "blob upload 도중 에러가 발생했습니다." });
				return;
			}

			if (res.isSuccessful == true) {
				console.log(res.statusCode, "Blob upload succeeded");
				imgarr.push(result.name);
				console.log("\tTO", result.container, "AS", "\"" + result.name + "\"");
			}

			if (relay.$.countCb == filenum) {
				relay.callback();
			} else {
				relay._.decPointer();
			}
		},

		//Relay 1.5
		function thumbnailUpload(relay) {
			console.log("Relay 1.5 thumbnail");

			//썸네일 업로드
			console.log("making thumbnail");
			console.log("first image :", firstImage); //firstImage = 첫 이미지 경로 (내 코드 서버로 업로드된.)


			let splitted;
			if(firstImage.includes("\\")){
				splitted = firstImage.split("\\");
			} else {
				splitted = firstImage.split("/");
			}
			console.log("splitted",splitted);
			let outpath = splitted[0] + "/T" + splitted[1];

			console.log("outpath", outpath);
			resize(firstImage, outpath, function (err, resized) {
				if (err) {
					console.log("error occured while making thumbnail", err);
					response.status(200).json({ isSuccessful: false, message: "blob thumbnail 생성 도중 에러가 발생했습니다." });
					return;
				} else {
					console.log("resizing completed");

					uploadBlob(outpath, function (error, result, res) {
						if (error) {
							console.log("thumbnail upload error");
							console.log(error);
							if (response.headersSent) {
								return;
							}
							response.status(200).json({ isSuccessful: false, message: "blob thumbnail upload 도중 에러가 발생했습니다." });
							return;
						}

						console.log("thumbnail created!!", outpath);
						thumbnail = outpath.split("/")[1];
						relay.callback();
					});
				}
			});

			
		},

		//Relay 3 게시글db 업뎃
		function afterAllimagesUploaded(relay) {
			console.log("Relay 2 : Artwork-post");

			if (price == 0 || price == "" || price == undefined || title == "" || content == "") {
				console.log("필수 인자가 비어있습니다!!!");
				return;
			}

			//데이터베이스 서버에 게시글 업로드
			let artworkDataToUpload;
			artworkDataToUpload = {
				"id": artworkNextIndex,
				"imgs": imgarr,
				"thumbnail": thumbnail,
				"userEmail": userEmail,
				"userAlias": userAlias,
				"uploadTime": getUnixTimeStamp(),
				"price": price,
				"title": title,
				"content": content
			};
			relay.$.userEmail = artworkDataToUpload.userEmail;
			Artwork.create(artworkDataToUpload, relay.callback);
		},

		//Relay 4 유저db uploads(내가올린 게시물) 업데이트
		function artworkUploadCallback(error, result, relay) {
			console.log("Relay 3 : Artwork-post");

			if (error) {
				console.log("error occured while posting : Artwork.create()");
				artworkMaxIndex += 1;//duplicate key error면 이걸로 바로 해결됨
				console.log(error);
				if (response.headersSent) {
					return;
				}
				response.status(200).json({ isSuccessful: false, message: "데이터베이스에 artwork를 등록하는 도중 에러가 발생했습니다." });
				return;
			}
			artworkMaxIndex += 1;//전역변수

			User.findOneAndUpdate({ userEmail: relay.$.userEmail },
				{ $push: { uploads: artworkNextIndex } }, relay.callback);
		},

		//Relay 5 유저db업뎃콜백
		function userDBCallback(error, doc, relay) {
			console.log("Relay 4 : Artwork-post");

			if (error) {
				console.log("/upload findOneAndUpdate() error");
				if (response.headersSent) {
					return;
				}
				response.status(200).json({ isSuccessful: false, message: "사용자 데이터베이스를 업데이트 하는 도중 에러가 발생했습니다." });
				return;
			}

			if (response.headersSent) {
				return;
			}
			response.status(200).json({ isSuccessful: true, message: "게시물 업로드를 성공했습니다." });

			//임시 폴더 비우기
			//cleanDir(uploadPath, "artwork upload");

			relay.callback();
		}

	);
});

//(API아님) 게시글 보기 요청
router.get("/artwork/:artworkID", function (request, response) {
	"TITLE (API아님)게시물 보기 요청 처리";//title for api profiler

	//▽▽▽responseArtworkHTML때문에 function-scoped
	let imgpatharr;//이미지 저장 경로 배열
	let ArtworkData; //게시물db에 올라갈 게시물 오브젝트 


	function tmpErrorFunc(code, msg) {
		response.render('core-html.ejs', { pageFilePath: 'artwork-page.ejs', status: code, message: msg });
	}

	function responseArtworkHTML() {
		response.render('core-html.ejs', { pageFilePath: 'artwork-page.ejs', status: 200, artwork: ArtworkData, imgs: imgpatharr });
	}


	//GET으로 온 변수 (게시글 번호)
	let artworkid = Number(request.params.artworkID);
	if (isNaN(artworkid)) {
		tmpErrorFunc(400, "게시글 번호는 숫자여야 합니다");
		return;
	}

	Relay(
		//Relay 0
		function startup(relay) {
			//이미지 다운로드 완료 체크를 위한 변수들
			console.log("Relay 0 : artwork.js GET post");
			relay.callback();
		},

		//Relay 1 게시물id로 찾기
		function artworkFindPost(relay) {
			console.log("Relay 1 : find post");
			Artwork.findOne({ id: artworkid }, relay.callback);
		},

		//Relay 2 콜백
		function findOneCallback(error, artworkData, relay) {
			console.log("Relay 2 : prepare to download images");

			if (error) {
				console.log("findOne() error");
				console.log(error);
				tmpErrorFunc(513, "db에서 게시물을 찾는중에 에러가 발생했습니다.");
				return;
			}

			// ↓ 예외처리 : 조건에 맞는 게시물이 없을 때
			if (artworkData == undefined) {
				console.log("no post matched");
				tmpErrorFunc(404, "조건에 맞는 게시물이 없습니다");
				return;
			}

			// //전역변수같은 전역변수아닌 전역변수인척하는 놈에게 value를 assign
			ArtworkData = artworkData;


			//넘어가기
			relay.callback();


		},

		//Relay 3 SAS url생성
		function (relay) {
			console.log("Relay 3 : gen img url");


			//임시 url 생성
			let i;
			imgpatharr = [];

			for (i in ArtworkData.imgs) {
				imgpatharr.push(genTmpSASUri(ArtworkData.imgs[i]));
			}

			relay.callback();

		},

		//Relay 4 마무리
		function (relay) {
			console.log("Relay 4 : call response function");
			responseArtworkHTML();
			relay.callback();
		}
	);//RELAY

});

//삭제
router.post("/ajax-tunnel/delete-post", function (request, response) {
	"TITLE 게시물 삭제";//title for api profiler
	let userEmail, postId;

	postId = request.body.artworkId;

	if (!request.isAuthenticated()) {
		response.status(200).json({ isSuccessful: false, message: "로그인 되어 있지 않습니다" });
		return;
	}
	userEmail = request.user.userEmail;

	Relay(


		//Relay 0
		function startup(relay) {
			console.log("Relay 0 : delete-post");

			Artwork.findOneAndRemove(
				{ userEmail: userEmail, id: postId },
				relay.callback
			);
		},


		//Relay 1
		function afterRemovingPost(error, document, relay) {
			console.log("Relay 1 : delete-post");

			if (error) {
				console.log("error occured in artwork.js /ajax-tunnel/delete-post");
				console.log(error);
				response.status(200).json({ isSuccessful: false, message: "게시글을 삭제하는 도중 에러가 발생했습니다." });
				return;
			}

			if (document == undefined) {
				response.status(200).json({ isSuccessful: false, message: "게시물을 삭제할 수 없습니다." });
				return;
			}

			response.status(200).json({ isSuccessful: true, document: document, message: "게시물을 성공적으로 삭제했습니다" });
			relay.callback();

			//TODO : 유저 uploads 배열에서 pull
			User.updateOne({ userEmail: userEmail }, { "$pull": { "uploads": postId } }, function (err) {

			});
		}
	);
});

//(최대한 사용 지양) db에 있는 게시물 모두 리스트
router.post("/ajax-tunnel/list-artwork", function (request, response) {
	"TITLE (test용)DB의 모든 게시물 리스팅";//title for api profiler

	Artwork.find({ id: { $gt: 0 } }, { id: 1, userAlias:1, userEmail: 1, title: 1, content: 1, thumbnail:1 }, function (err, artworkList) {
		if (err) throw err;

		
		for(var i in artworkList){
			//console.log("thumbnail",artworkList[i].thumbnail);
			artworkList[i].thumbnail = genTmpSASUri(artworkList[i].thumbnail);
		}

		response.status(200).json({
			isSuccessful: true,
			artworkList: artworkList,
			message: "게시물을 성공적으로 로드했습니다"
		});
	});
});

//내가쓴 게시물 모두 리스트
router.post("/ajax-tunnel/list-my-artwork", function (request, response) {
	"TITLE 내가 쓴 게시물 모두 리스팅";//title for api profiler

	if (!request.isAuthenticated()) {
		console.log("/ajax-tunnel/list-my-artwork : user not authenticated");
		response.status(200).json({ isSuccessful: false, message: "로그인 되어 있지 않습니다." });
		return;
	}

	var userEmail = request.user.userEmail;
	Artwork.find({ id: { $gt: 0 }, userEmail: userEmail }, { id: 1, title: 1, content: 1 }, function (err, myArtworkList) {
		if (err) {
			console.log(err);
			response.status(200).json({ isSuccessful: false, message: "데이터베이스를 불러오는동안 에러가 발생했습니다." });
			return;
		}

		response.status(200).json({
			isSuccessful: true,
			message: "게시물을 성공적으로 로드했습니다",
			myArtworkList: myArtworkList
		});
	});
});

//내가 구입한 아트워크 리스트
router.post("/ajax-tunnel/list-purchased", function (request, response) {
	"TITLE 내가 산 작품 모두 리스팅";//title for api profiler

	if (!request.isAuthenticated()) {
		console.log("/ajax-tunnel/list-purchased : user not authenticated");
		response.status(200).json({ isSuccessful: false, message: "로그인 되어 있지 않습니다." });
		return;
	}

	var purchased = request.user.purchased;
	Artwork.find({ id: { "$in": purchased } }, { id: 1, title: 1 }, function (err, purchasedList) {
		if (err) {
			console.log(err);
			response.status(200).json({ isSuccessful: false, message: "데이터베이스를 불러오는동안 에러가 발생했습니다." });
			return;
		}

		response.status(200).json({
			isSuccessful: true,
			message: "게시물을 성공적으로 로드했습니다",
			purchasedList: purchasedList
		});
	});
});

//특정 아이디로 검색
router.post("/ajax-tunnel/list-sb-artwork", function (request, response) {
	"TITLE 특정 유저의 게시물 리스팅";//title for api profiler

	let userEmail = request.body.userEmail;

	Artwork.find({ userEmail: userEmail }, { id: 1, title: 1, content: 1 })
		.sort({ "id": -1 }).exec()
		.then(function (docs) {
			response.status(200).json({
				isSuccessful: true,
				message: "게시물을 성공적으로 로드했습니다",
				documents: docs
			});
		})
		.catch(function (error) {
			console.log("list-sb-artwork error occured.");
			console.log(error);
			response.status(200).json({ isSuccessful: false, message: "데이터베이스를 불러오는동안 에러가 발생했습니다." });

		});
	return;
});

//최근 30(N)리스팅(cached)
const CACHING_PERIOD_RECENT_ARTWORK = 60 * 12;//minutes
const AMOUNT_LIST_RECENT = 30;
let listRecentLastUpdate = 0;
let listRecentCache = [];
router.post("/ajax-tunnel/list-recent", function (request, response) {
	"TITLE 최근 게시물 30개 리스팅";//title for api profiler

	//if not cached yet
	if (getUnixTimeStamp() - listRecentLastUpdate > CACHING_PERIOD_RECENT_ARTWORK * 1000 * 60) {
		listRecentLastUpdate = getUnixTimeStamp();
		Artwork.find({}, { id: 1, title: 1, content: 1 })
			.sort({ "id": -1 })
			.limit(AMOUNT_LIST_RECENT).exec()
			.then(function (docs) {
				response.status(200).json({
					isSuccessful: true,
					message: "게시물을 성공적으로 로드했습니다",
					documents: docs
				});
				listRecentCache = docs;
			})
			.catch(function (error) {
				console.log("list-recent error occured.");
				console.log(error);
				response.status(200).json({ isSuccessful: false, message: "데이터베이스를 불러오는동안 에러가 발생했습니다." });
			});
		return;
	}

	//if cached
	response.status(200).json({
		isSuccessful: true,
		message: "게시물을 성공적으로 로드했습니다 (캐시)",
		documents: listRecentCache
	});
});

//TODO: id, amount, direction 리스팅
router.post("/ajax-tunnel/list-id-limited", function (request, response) {
	"TITLE 게시물 리스팅 : 게시물id, 그로부터 몇개(limit), 숫자가 더 큰거 or 작은거(direction,값은 1 or -1)";//title for api profiler

	let artworkId = Number(request.body.artworkId);
	let limit = Number(request.body.limit);
	let direction = Number(request.body.direction);

	//check arguments
	if (artworkId == undefined ||
		limit == undefined ||
		direction == undefined) {
		response.status(200).json({ isSuccessful: false, message: "필수인자가 비어있습니다." });
		return;
	}
	if (direction != 1 && direction != -1) {
		response.status(200).json({ isSuccessful: false, message: "direction은 1이거나 -1이어야 합니다" });
		return;
	}

	//db callback
	function findThen(docs) {
		response.status(200).json({
			isSuccessful: true,
			message: "게시물을 성공적으로 로드했습니다",
			documents: docs
		});
	}
	function findCatch(error) {
		console.log("list-id-limited error occured.");
		console.log(error);
		response.status(200).json({ isSuccessful: false, message: "데이터베이스를 불러오는동안 에러가 발생했습니다." });
	}

	//db query
	let idDirection;
	if (direction == 1) {//위로
		idDirection = { $gte: artworkId };
	} else {//아래로
		idDirection = { $lte: artworkId };
	}

	Artwork.find({ id: idDirection }, { id: 1, title: 1, content: 1 })
		.sort({ id: direction })
		.limit(limit)
		.exec()
		.then(findThen)
		.catch(findCatch);
	return;
});

//게시물 검색
router.post('/ajax-tunnel/search-artwork', function (request, response) {
	let keyword = request.body.keyword;
	let uploaderAlias = request.body.uploaderAlias;

	if (keyword == undefined) {
		console.log("search artwork error : no keyword");
		response.status(200).json({ isSuccessful: false, message: "필수 인자가 비었습니다 : keyword" });
		return;
	}

	let query;
	if (uploaderAlias == undefined) {
		query = Artwork.find({ "$text": { "$search": keyword } }, { userAlias:1, thumbnail:1,  id: 1, title: 1, content: 1 });
	} else {
		query = Artwork.find({ "$text": { "$search": keyword }, "userAlias": uploaderAlias }, { userAlias:1, thumbnail:1, id: 1, title: 1, content: 1 });
	}

	query.exec()
		.then(function (result) {
			if (result.length == 0) {
				response.status(200).json({ isSuccessful: true, message: "검색 결과가 없습니다", data: [] });
				console.log("no search result");
				return;
			}

			console.log(result);

			for(var i in result){
				result[i].thumbnail = genTmpSASUri(result[i].thumbnail);
			}

			response.status(200).json({ isSuccessful: true, message: "검색 쿼리 성공", data: result });
		})
		.catch(function (e) {
			console.log("search error");
			console.log(e);

			response.status(200).json({ isSuccessful: false, message: "오류 발생", error: e });
		});
});

module.exports = router;
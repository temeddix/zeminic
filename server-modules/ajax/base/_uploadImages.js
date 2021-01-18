const fs = require('fs');
const Log = require("./log");
const FileType = require('file-type');
const Multiparty = require('multiparty');
const path = require('path');

// const router = express.Router();

//TODO : 이거 라우터로 하지말고 웹툰 등록, 챕터 등록 라우터에 파일 받는걸 포함시키기.
//TODO : 아니면 파일받는걸 함수화시키기?
// router.post("/upload/images",async function(req,res){
//     uploadImages(req,function(num){
//         if(num==0){
//             Base.resNo(res,"no image uploaded",num);
//             return;
//         }else{
//             Base.resYes(res,"uploaded images",num);
//         }
//     });

// });

function uploadImages(req, resultcb, maxFilesSize){

    if(!req){
        Log.logErr("uploadImages() Error : req must not be \'undefined\'",null);
        return;
    }

    if(!resultcb){
        resultcb = function(files){
            Log.logInfo("uploadImages() files",files);
        }
    }

    if(!maxFilesSize){
        maxFilesSize = 1024 * 1024 * 10;
    }

    let form = new Multiparty.Form({
        uploadDir:path.join(__dirname,"tmpblobs"),
        maxFilesSize : maxFilesSize
    });

    form.parse(req, async function(err,fields,files){
        Log.logInfo("multiparty file upload result\n",{
            error : err,
            fields : fields,
            files: files
        });
        Log.logInfo("files",files);

        if(err){
            resultcb(null, fileds);
            return;
        }

        let numOfImgs = files['files'].length;
        let removed = 0;
        let imgs = JSON.parse(JSON.stringify(files['files']));

        for(let i in files['files']){
            let result = await FileType.fromFile(files['files'][i]['path']);
            Log.logInfo("file type info", result);

            if(!result || (result.ext!="jpg" && result.ext!="png")){
                Log.logInfo("File removed",files['files'][i]['path']);
                fs.unlinkSync(files['files'][i]['path']);
                removed += 1;
                imgs.splice(i,1);
            }
        }

        Log.logInfo("Total uploaded images", numOfImgs-removed);
        resultcb(imgs,fields);
        return;
    });
}

module.exports = uploadImages;
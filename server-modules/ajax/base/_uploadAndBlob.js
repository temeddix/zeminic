const uploadImages = require('./uploadImages');
const Blob = require('./blob');
const Log = require("./log");

function uploadAndBlob(req, resultcb, maxFilesSize){
    uploadImages(req,
        function(files,fields){
            for(let i in files){
                Blob.uploadBlob(files[i]['path']);
            }

            resultcb(files,fields);
            /*
                array of
                {"fieldName":"","originalFilename":"","path":"","headers":{"content-disposition":"form-data; name=\"files\"; filename=\"다운로드 (1).jpg\"","content-type":"image/jpeg"},"size":}
            */
        },

        maxFilesSize
    );
}

module.exports ={
    uploadAndBlob:uploadAndBlob,
    deleteBlob:Blob.deleteBlob,
    genTmpSASUri:Blob.genTmpSASUri
};
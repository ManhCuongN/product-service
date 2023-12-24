const { SuccessResponse, BadRequestError } = require("../core/success.response");
const UploadService = require("../services/upload.service")
class UploadController {

    uploadImageFromURL = async(req,res,next) => {
        const urlImage =  req.body;
        const shopId =  req.user.userId
        new SuccessResponse ({
            message: 'Upload  success',
            metadata: await UploadService.uploadImageFromURL( urlImage,shopId)
        }).send(res)
    }

    uploadImageThumb = async(req,res,next) => {
        const {file} = req
        if(!file) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse ({
            message: 'Upload  success',
            metadata: await UploadService.uploadImageLocal({
               path: file.path,
               shopId: req.user.userId
            })
        }).send(res)
    }
    uploadImageThumb2 = async(req,res,next) => {
        const {file} = req
        console.log("filew",file.path );
        if(!file) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse ({
            message: 'Upload  success',
            metadata: await UploadService.uploadImageLocal2({
               path: file.path,
            })
        }).send(res)
    }

    uploadListImage = async(req,res,next) => {
        const {file} = req
        if(!file) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse ({
            message: 'Upload  success',
            metadata: await UploadService.uploadListImageLocal({
               path: file.path,
               shopId: req.user.userId
            })
        }).send(res)
    }

    uploadListImageLocalFiles = async(req,res,next) => {
        const {files} = req
        if(!files.length) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse ({
            message: 'Upload  success',
            metadata: await UploadService.uploadListImageLocalFiles({
               files,
               shopId: req.user.userId
            })
        }).send(res)
    }

    
    
}

module.exports = new UploadController();

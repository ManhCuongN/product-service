'use strict'

const express = require('express')
const { authenticationV2 } = require('../../auth/authUtils')
const { asyncHandler } = require('../../helpers/asyncHandler')
const uploadController = require('../../controllers/upload.controller')
const router = express.Router()
const upload= require("../../configs/config.cloudinary")
const {uploadDisk} = require("../../configs/multer.config")
router.post("/image/avatar",uploadDisk.single("file"), asyncHandler(uploadController.uploadImageThumb2))

router.use(authenticationV2)
router.post("/image", asyncHandler(uploadController.uploadImageFromURL))
router.post("/image/thumb",uploadDisk.single("file"), asyncHandler(uploadController.uploadImageThumb))
router.post("/image/multiple",uploadDisk.array("files", 3), asyncHandler(uploadController.uploadListImageLocalFiles))



router.post("/image/list-of-thumb",uploadDisk.single("file2"), asyncHandler(uploadController.uploadListImage))







module.exports = router

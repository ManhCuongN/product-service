'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()


router.patch('/update/:commentId',asyncHandler(commentController.updateComment))
router.get('/',asyncHandler(commentController.getListCommentsByUser))

router.post('/',asyncHandler(commentController.createComment))
router.delete('/',asyncHandler(commentController.deleteComment))



module.exports = router

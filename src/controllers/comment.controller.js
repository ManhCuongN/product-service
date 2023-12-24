'use strict'
const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {

    createComment = async(req,res,next) => {
        new SuccessResponse ({
            message: 'Create Comment  success',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    getListCommentsByUser = async(req,res,next) => {
        new SuccessResponse ({
            message: 'Get List Comment Success',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

   deleteComment = async(req,res,next) => {
        new SuccessResponse ({
            message: 'Delete Comment Success',
            metadata: await CommentService.deleteComments(req.body)
        }).send(res)
    }

    updateComment = async(req,res,next) => {
        const {commentId} = req.params
        const bodyUpdate = req.body
        new SuccessResponse ({
            message: 'Update Comment Success',
            metadata: await CommentService.updateComment(commentId, bodyUpdate)
        }).send(res)
    }

   
}

module.exports = new CommentController();

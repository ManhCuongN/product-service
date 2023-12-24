'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const { permission } = require('../../auth/checkAuth')
const router = express.Router()


//signup
router.post('/shop/signup',asyncHandler(accessController.signUp))
router.post('/shop/login',asyncHandler(accessController.login))
router.post('/forgot-password',asyncHandler(accessController.forgotPassword))
router.get('/shop/getInfo/:id',asyncHandler(accessController.getInfo))
router.post('/list/shop/',asyncHandler(accessController.getListShop))
router.post('/update/role/shop/',asyncHandler(accessController.updateRolesForShop))




//authencation
router.use(authenticationV2)


router.post('/shop/logout',asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken',asyncHandler(accessController.handlerRefreshToken))
router.patch('/shop/update',asyncHandler(accessController.updateShop))




module.exports = router

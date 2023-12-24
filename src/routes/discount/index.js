'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller.js')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()



router.post("/amount",asyncHandler(discountController.getDiscountAmount))
router.get("/list_product_code",asyncHandler(discountController.getAllDiscountCodesWithProducts))
router.post("/discount_of_product",asyncHandler(discountController.getAllDiscountOfProduct))
router.patch("/update/v2",asyncHandler(discountController.updateDiscountV2))




//authencation
router.use(authenticationV2)

router.post("/",asyncHandler(discountController.createDiscountCode))
router.get("/discount_follow_specific",asyncHandler(discountController.findDiscountFollowSpecificIds))
router.get("/",asyncHandler(discountController.getAllDiscountCodes))
router.patch("/update/:id",asyncHandler(discountController.updateDiscount))
router.delete("/:id",asyncHandler(discountController.deleteDiscount))



module.exports = router

'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()



router.post("/search/",asyncHandler(productController.getListSearchProduct))
router.post("/search/multi/",asyncHandler(productController.searchMulti))
router.patch("/updateV2",asyncHandler(productController.updateQuantityProduct))


router.get("/",asyncHandler(productController.getAllProducts))
router.get("/time-product",asyncHandler(productController.getProductFollowTime))
router.get("/:product_id",asyncHandler(productController.getFindProduct))
router.get("/write/csv",asyncHandler(productController.writeDataCSV))
router.post("/write/csv/v2",asyncHandler(productController.writeDataCSVv2))




//authencation
router.use(authenticationV2)


router.post("/",asyncHandler(productController.createProduct))
router.patch("/:productId",asyncHandler(productController.updateProduct))
router.post("/published/:id",asyncHandler(productController.publishedProductByShop))
router.post("/unpublished/:id",asyncHandler(productController.unPublishedProductByShop))
router.get("/",asyncHandler(productController.getAllProducts))
router.get("/all/in",asyncHandler(productController.findAllProductsByShop))

router.patch("/delete/:product_id",asyncHandler(productController.deleteProduct))


//Query
router.get("/drafts/all",asyncHandler(productController.getAllDraftsForShop))
router.get("/published/all",asyncHandler(productController.getAllPulishedForShop))






module.exports = router

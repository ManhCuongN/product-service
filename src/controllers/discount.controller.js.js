const { SuccessResponse } = require("../core/success.response");
const DiscountService = require('../services/discount.service')

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new discount code success',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    updateDiscount = async (req, res, next) => {
        const {id} = req.params
        const body = req.body
        new SuccessResponse({
            message: 'Update new discount success',
            metadata: await DiscountService.updateDiscount(id,
                body
            )
        }).send(res)
    }

    updateDiscountV2 = async (req, res, next) => {
        
        const {discountId, userId} = req.body
        new SuccessResponse({
            message: 'Update new discount success',
            metadata: await DiscountService.updateDiscountV2(discountId,
                +userId
            )
        }).send(res)
    }

    deleteDiscount = async (req, res, next) => {
        const {id} = req.params
        new SuccessResponse({
            message: 'Delete discount success',
            metadata: await DiscountService.deleteDiscount(id)
        }).send(res)
    }


    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Succesful Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Succesful Discount Amount Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,

            })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'getAllDiscountCodesWithProducts Found',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }

    findDiscountFollowSpecificIds = async (req, res, next) => {
        new SuccessResponse({
            message: 'getAllDiscountCodesWithProducts Found',
            metadata: await DiscountService.findDiscountFollowSpecificIds({
                ...req.query,
            })
        }).send(res)
    }

    getAllDiscountOfProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'getAllDiscountCodesWithProducts Found',
            metadata: await DiscountService.getAllDiscountOfProduct({
                ...req.body,
            })
        }).send(res)
    }







}

module.exports = new DiscountController();

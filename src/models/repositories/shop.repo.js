'use strict'

const shopModel = require('../../models/shop.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils/')


const getFollowByShop = async (shopId) => {
    console.log("shopId", shopId);
    return await shopModel.findOne({_id: convertToObjectIdMongodb(shopId)}).lean()
}




module.exports = {
    getFollowByShop
}
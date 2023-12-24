'use strict'

const shopModel = require("../models/shop.model")

const findByEmail = async({email, select = {
    email: 1, password: 2, name: 1, roles: 1, status:1, verify:1
}}) => {
    return await shopModel.findOne({email}).select(select).lean()
}

const updateShopById = async(shopId, payload, isNew = true) => {
    console.log("s2",shopId, payload);
    return await shopModel.findByIdAndUpdate(shopId, payload,{new: isNew})
}





module.exports = {
    findByEmail,
    updateShopById,
   
}
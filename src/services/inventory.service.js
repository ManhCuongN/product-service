'use strict'

const { BadRequestError } = require("../core/error.response")
const { inventory } = require("../models/inventory.model")
const { product } = require("../models/product.model")
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToInventory ({
        stock,
        productId,
        shopId,
        location = '123, Da Nang'
    }) {
        const product = await getProductById(productId)
        if(product) throw new BadRequestError('The product does not exists')

        const query = {inven_shopId: shopId,
                       inven_productId: productId}

        const updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = {upsert: true, new : true}

        return await inventory.findOneAndUpdate(query, updateSet, options)

       
    }

    static async updateInventoryQuantities(items) {
       console.log("items", items);
        try {
            for (const item of items) {
                const productId = item.productId;
                const quantity = item.quantity;
    
                // Tìm kiếm bản ghi Inventory theo productId
                const productRecord = await product.findOne({ _id: productId }).maxTimeMS(5000);
               const inventoryRecord = await inventory.findOne({ inven_productId: productId }).maxTimeMS(5000);
                
                if ( productRecord) {
                    // Nếu tìm thấy bản ghi, trừ đi số lượng từ trường inven_stock
                   const newStock = inventoryRecord.inven_stock - quantity;
                    const newStockProduct = productRecord.product_quantity - quantity;

                    await product.updateOne({ _id: productId }, { product_quantity: newStockProduct });
    
                    // Cập nhật bản ghi với số lượng mới
                   await inventory.updateOne({ inven_productId: productId }, { inven_stock: newStock });

                    
    
                    
                } else {
                    console.log(`Inventory not found for productId ${productId}`);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = InventoryService
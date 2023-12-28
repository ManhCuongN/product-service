'use strict'

const { product, clothing, electronic, furniture, variationClothing } = require('../models/product.model')
const { discount } = require('../models/discount.model')

const { BadRequestError } = require('../core/error.response')
const { findAllDraftsForShop,
    publishProductByShop,
    findAllPulishedForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProductsByShop,
    searchMulti,
    findAllProducts, findProduct, updateProductById, deleteProduct
} = require('../models/repositories/product.repo')
const { getFollowByShop } = require("../models/repositories/shop.repo")
const { removeUndefinedObject, updateNestedObjectParse } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')
const { pushNotiToSystem } = require('./notification.service')
const { TYPE_NOTIFICATIONS } = require('../constants')
const { runProducerCreateNewNoti } = require('../rabbitMQ/service.consumer')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const csv = require('csv-parser');
const fs = require('fs');

const csv = require('csvtojson');
// define factory class to create product
const axios = require('axios');
class ProductFactory {
    /* 
      type: 'Clothing',
    */

    static productRegistry = {} //key-class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);
        return new productClass(payload).createProduct()

    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);
        return new productClass(payload).updateProduct(productId)

    }

    static async getProductFollowTime() {
        const produc = await discount.find();
        const specificDiscounts = produc.filter(discount => 
          discount.discount_applies_to === 'specific' && discount.discount_is_active &&
          new Date(discount.discount_end_date) > new Date() 
        );
        
        // Lấy ra mảng discount_product_ids và discount_end_date từ các discount thỏa mãn điều kiện
        const specificProductsWithEndDate = specificDiscounts.map(discount => ({
          discount_product_ids: discount.discount_product_ids,
          discount_end_date: discount.discount_end_date,
        }));
      
        const arr = [];
      
        for (let index = 0; index < specificProductsWithEndDate.length; index++) {
          const pro = await product.findById(specificProductsWithEndDate[index].discount_product_ids);
          arr.push({
            product: pro,
            expried: specificProductsWithEndDate[index].discount_end_date,
          });
        }
      
        return arr;
      }
      

    //START PUT

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }





    //END PUT


    //query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true, isDeleted: false }
        return await findAllDraftsForShop({ query, limit, skip })

    }

    static async findAllPulishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPulished: true, isDeleted: false }
        return await findAllPulishedForShop({ query, limit, skip })

    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPulished: true, isDeleted: false } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_description', 'product_shop', 'product_price', 'product_thumb', 'product_ratingAverage', 'product_type', 'product_slug', 'product_images', 'product_attributes']
        })
    }

    static async searchMulti({ limit = 50, sort = 'ctime', page = 1, filter = {} }) {
        const parsedFilter = filter ? JSON.parse(filter) : {};
        return await searchMulti({
            limit, sort, page, filter: parsedFilter,
            select: ['product_name', 'product_description', 'product_shop', 'product_price', 'product_thumb', 'product_ratingAverage', 'product_type', 'product_slug', 'product_images', 'product_attributes']
        })
    }

    static async writeDataCSV({ limit = 50, sort = 'ctime', page = 1, filter = { isPulished: true, isDeleted: false } }) {
        const data = await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_description', 'product_shop', 'product_price', 'product_thumb', 'product_ratingAverage', 'product_type', 'product_slug', 'product_images', 'product_attributes']
        })
        const dataWithPaymentMethod = data.map(item => {


            return { ...item, paymentMethod: 'COD/VNPAY', Brand: item.product_attributes.brand };


        });
        //console.log("data",data);
        const csvWriter = await createCsvWriter({
            path: 'C:/Users/nguye/Desktop/DATN/test.csv',
            header: [
                { id: '_id', title: 'Product ID' },
                { id: 'product_name', title: 'Product Name' },
                { id: 'product_thumb', title: 'Product Thumbnail' },
                { id: 'product_description', title: 'Product Description' },
                { id: 'product_price', title: 'Product Price' },
                { id: 'product_type', title: 'Product Type' },
                { id: 'product_shop', title: 'Product Shop' },
                { id: 'product_ratingAverage', title: 'Product Rating Average' },
                { id: 'isDraft', title: 'Is Draft' },
                { id: 'product_slug', title: 'Product Slug' },
                { id: 'paymentMethod', title: 'Payment Method' },
                { id: 'Brand', title: 'Brand' },



            ]
        });

        csvWriter
            .writeRecords(dataWithPaymentMethod)
            .then(() => console.log('CSV file created successfully.'))
            .catch(error => console.error(error));
    }






    

    
    static async writeDataCSVv2(data) {
    
        const filePath = 'C:/Users/nguye/Desktop/DATN/file.csv';
    
        try {
            // Kiểm tra xem tệp CSV đã tồn tại hay chưa
            if (!fs.existsSync(filePath)) {
                // Nếu không tồn tại, tạo mới tệp CSV với header tương ứng
                const csvWriter = createCsvWriter({
                    path: filePath,
                    header: [
                        { id: 'ID', title: 'ID' },
                        { id: 'Name', title: 'Name' },
                        { id: 'Wishlist', title: 'Wishlist' },
                        { id: 'Interests', title: 'Interests' },
                        { id: 'ShopID_Purchase', title: 'ShopID_Purchase' },
                        { id: 'brand', title: 'brand' },
                        { id: 'name_product', title: 'name_product' },
                    ],
                });
    
                // Ghi dữ liệu vào tệp CSV mới
                csvWriter.writeRecords(data)
                    .then(() => console.log('CSV file created with data'))
                    .catch((error) => console.error('Error writing CSV file:', error));
            } else {
                // Nếu tệp CSV đã tồn tại, đọc dữ liệu hiện tại
                const existingData = fs.readFileSync(filePath, 'utf8');
                let jsonData = [];
    
                // Kiểm tra xem dữ liệu hiện tại có đúng định dạng CSV hay không
                try {
                    jsonData = await csv().fromString(existingData);
                } catch (parseError) {
                    console.error('Error parsing existing CSV data:', parseError.message);
                    return;
                }
              
                // Kiểm tra xem ID đã tồn tại trong tệp CSV hay chưa
                const existingItemIndex = jsonData.findIndex((item) => item.ID == data[0].ID);
    
                if (existingItemIndex !== -1) { 
                   
                    // Nếu ID đã tồn tại, cập nhật giá trị trong hàng hiện tại của ID đó
                    Object.entries(data[0]).forEach(([key, value]) => {
                      
                        if (key !== 'ID') {
                            jsonData[existingItemIndex][key] += `,${value}`;
                        }
                    });
                } else {
                   

                    // Nếu ID không tồn tại, thêm một hàng mới
                    jsonData.push(data[0]);
                }
    
                // Ghi dữ liệu vào tệp CSV hiện tại
                const csvWriter = createCsvWriter({
                    path: filePath,
                    header: [
                        { id: 'ID', title: 'ID' },
                        { id: 'Name', title: 'Name' },
                        { id: 'Wishlist', title: 'Wishlist' },
                        { id: 'Interests', title: 'Interests' },
                        { id: 'ShopID_Purchase', title: 'ShopID_Purchase' },
                        { id: 'brand', title: 'brand' },
                        { id: 'name_product', title: 'name_product' },
                    ],
                });
    
                csvWriter.writeRecords(jsonData)
                    .then(() => console.log('CSV file updated with data'))
                    .catch((error) => console.error('Error updating CSV file:', error));
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    
   



    static async writeDataCSV2() {
        const res = await axios.get("http://localhost:3055/v1/api/product")
        const dataWithPaymentMethod = res.data.metadata.map(item => {
            return { ...item, paymentMethod: 'COD/VNPAY', Brand: item.product_attributes.brand };


        });
        //console.log("data",data);
        const csvWriter = await createCsvWriter({
            path: 'C:/Users/nguye/Desktop/DATN/products.csv',
            header: [
                { id: '_id', title: 'Product_ID' },
                { id: 'product_name', title: 'Product_Name' },
                { id: 'product_thumb', title: 'Product_Thumbnail' },
                { id: 'product_description', title: 'Product_Description' },
                { id: 'product_price', title: 'Product_Price' },
                { id: 'product_type', title: 'Product_Type' },
                { id: 'product_shop', title: 'Product_Shop' },
                { id: 'product_ratingAverage', title: 'Product_Rating_Average' },
                { id: 'isDraft', title: 'Is Draft' },
                { id: 'product_slug', title: 'Product_Slug' },
                { id: 'paymentMethod', title: 'Payment_Method' },
                { id: 'Brand', title: 'Brand' },


            ]
        });

        csvWriter
            .writeRecords(dataWithPaymentMethod)
            .then(() => console.log('CSV file created successfully.'))
            .catch(error => console.error(error));
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }

    static async findAllProductsByShop({ product_shop, limit = 6, skip = 0 }) {
        const query = { product_shop, isDeleted: false }
        return await findAllProductsByShop({ query, limit, skip })

    }

    static async deleteProduct({ product_id }) {
        return await deleteProduct({ product_id })
    }



}



//define base product class
class Product {
    constructor({
        product_name, product_thumb, product_images,
        product_description, product_price, product_quantity,
        product_type, product_shop, product_attributes, product_variation
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_images = product_images
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_variation = product_variation

    }

    //create new product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if (newProduct) {
            const followShop = await getFollowByShop(this.product_shop)
            if (followShop) {
                var arrFollower = followShop.follower
                var nameShop = followShop.name
            }


            //add product stock in inventory
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })



            await runProducerCreateNewNoti({
                type: TYPE_NOTIFICATIONS.SHOP_001,
                senderId: this.product_shop,
                receivedId: arrFollower,
                options: {
                    product_name: this.product_name,
                    shop_name: nameShop
                }
            })
            // // push notification
            // pushNotiToSystem({
            //     type: TYPE_NOTIFICATIONS.SHOP_001,
            //     senderId: this.product_shop,
            //     receivedId: 1,
            //     options: {
            //         product_name: this.product_name,
            //         shop_name: this.product_shop
            //     }
            // }).then(rs => console.log(rs)).catch(console.error)

        }
        return newProduct
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })

    }


}

//Define sub-class for diffrent product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        const newVariationClothing = await variationClothing.create(this.product_variation)

        if (!newClothing) throw new BadRequestError(`Create new Clothing error`)
        if (!newVariationClothing) throw new BadRequestError(`Create new Clothing error`)


        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError(`Create new Product error`)

        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParse(objectParams.product_attributes), model: clothing })
        }

        if (objectParams.product_variation) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParse(objectParams.product_variation), model: clothing })
        }

        // if (objectParams.product_variation) {
        //     const newElement = this.product_variation[0]
        //     const findProduct = â
        //     objectParams.product_variation = [...objectParams.product_variation, newElement];

        // }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
        return updateProduct
    }
}


//Define sub-class for diffrent product types Electronic
class Electronics extends Product {
    async createProduct() {
        try {
            const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop })
            if (!newElectronic) throw new BadRequestError(`Create new Electronics error`)

            const newProduct = await super.createProduct(newElectronic._id)
            if (!newProduct) throw new BadRequestError(`Create new Product error`)

            return newProduct
        } catch (error) {
            console.log(error);
        }

    }
    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParse(objectParams.product_attributes), model: electronic })
        }

        if (objectParams.product_variation) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParse(objectParams.product_variation), model: electronic })
        }

        // if (objectParams.product_variation) {
        //     const newElement = this.product_variation[0]
        //     const findProduct = â
        //     objectParams.product_variation = [...objectParams.product_variation, newElement];

        // }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
        return updateProduct
    }
}

//Define sub-class for diffrent product types Furniture


class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop })
        if (!newFurniture) throw new BadRequestError(`Create new Furniture error`)

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError(`Create new Product error`)

        return newProduct
    }
    async updateProduct(productId) {
        console.log("this", this);
        const objectParams = this

        if (objectParams.product_attributes) {
            return await updateProductById({ productId, objectParams, model: furniture })
        }

        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

//register producttypes
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;
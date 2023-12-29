'use strict'

const { product, electronic, clothing, furniture } = require('../../models/product.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils/')
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPulishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllProductsByShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
    // Kiểm tra nếu keySearch trống thì trả về một giá trị mặc định hoặc mảng rỗng
    if (!keySearch.trim()) {
      return []; // hoặc trả về một giá trị mặc định khác tùy vào yêu cầu của bạn
    }
  
    try {
      const results = await product
        .find(
          {
            $or: [
              { product_name: { $regex: new RegExp(keySearch, 'i') } },
              { product_description: { $regex: new RegExp(keySearch, 'i') } },
            ],
            isPulished: true,
            isDeleted: false
          }
        )
        .limit(4); // Giới hạn số lượng kết quả trả về tối đa là 4 sản phẩm
  
      return results;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error searching for products:", error);
      throw error; // Ném lỗi để bên gọi hàm có thể xử lý tiếp
    }
  };
  

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPulished = true;

    await foundShop.save(); // Use save() to update the document

    return 1; // Assuming you're returning 1 on successful update
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPulished = false;

    await foundShop.save(); // Use save() to update the document

    return foundShop; // Assuming you're returning 1 on successful update
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    console.log("limi", limit);
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()


    return products
}

const searchMulti = async ({ limit, sort, page, filter, select }) => {
    
    // Đảm bảo filter là một đối tượng
    const filterObject = filter || {};

    // Thêm điều kiện tìm kiếm cho product_price dưới một số tiền cụ thể
    if (filterObject.product_price) {
        filterObject.product_price = { $lt: filterObject.product_price };
    }
    filterObject.isPulished = true;

    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    // Thực hiện tìm kiếm với điều kiện filter mới
    const products = await product.find(filterObject)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return products;
};

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}


const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).
        populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
    console.log("body", bodyUpdate);
    return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

const getProductById = async (productId) => {
    return await product.findOne({ _id: convertToObjectIdMongodb(productId) }).lean()
}






const deleteProduct = async ({ product_id }) => {
    console.log("p", product_id); const foundShop = await product.findOne({
        _id: new Types.ObjectId(product_id)
    });
    if (!foundShop) return null;

    foundShop.isDeleted = true;

    await foundShop.save(); // Use save() to update the document

    return foundShop; // Assuming you're returning 1 on successful update

}



module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPulishedForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    findAllProductsByShop,
    deleteProduct, searchMulti
}
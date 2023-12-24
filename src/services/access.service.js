'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData, convertToObjectIdMongodb } = require("../utils")
const { BadRequestError, ForbiddenError, ConflictRequestError, AuthFailureError, NotFoundError } = require("../core/error.response")
const { findByEmail, updateShopById } = require("./shop.service")


const RoleShop = {
    SHOP: '01',
    GUEST: '000',
    ADMIN: '00'
}

class AccessService {

    /* 
       check this token used?
    */
    static handlerRefresh = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            // delete
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError(`Something wrong happend !! Pls relogin`)
        }
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not registed')

        //verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registed')

        //create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        //upate token
        await KeyTokenService.updateKeyToken(
            { _id: holderToken._id }, // Điều kiện tìm kiếm
            {
                $set: {
                    refreshToken: tokens.refreshToken,
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken
                }
            }
        );
        return {
            user: { userId, email },
            tokens
        }
    }

    // V2
    static handlerRefreshV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError(`Something wrong happend !! Pls relogin`)
        }

        if (keyStore.refreshToken !== refreshToken) throw new ForbiddenError(`Shop not registeted`)
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registed')

        //create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        //upate token
        await KeyTokenService.updateKeyToken(
            { _id: keyStore._id }, // Điều kiện tìm kiếm
            {
                $set: {
                    refreshToken: tokens.refreshToken,
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken
                }
            }
        );
        return {
            user,
            tokens
        }
    }




    static signUp = async ({ name, email, password, address, phone, identification }) => {

        //step1: check email exists??
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already register!')
        }
        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.GUEST], address, phone, identification
        })

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error'
                }
            }


            //createTokenPair
            const tokens = await createTokenPair(
                {
                    userId: newShop._id,
                    email,
                },
                publicKey,
                privateKey
            )


            return {

                shop: getInfoData(
                    {
                        fileds: ['_id', 'name', 'email', 'status', 'avatar', 'verify', 'roles', 'phone', 'address', 'identification'],
                        objects: newShop
                    }
                ),
                tokens

            }

        }
        return {
            code: 200,
            metadata: null
        }

    }

    /*
        1- check email in dbs
        2- match pwd
        3- create AT vs RT and save
        4- genarate tokens
        5- get data return login 
    */
    static login = async ({ email, password, refreshToken = null }) => {

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop Not Registed')
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication Error')

        //3.
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const { _id: userId } = foundShop
        const tokens = await createTokenPair({
            userId, email
        }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey, publicKey
        })

        return {

            shop: getInfoData(
                {
                    fileds: ['_id', 'name', 'email', 'status', 'avatar', 'verify', 'roles', 'phone', 'address', 'identification'],
                    objects: foundShop
                }
            ),
            tokens

        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore.key._id)
        console.log({ delKey })
        return delKey
    }

    static getInfoShop = async (id) => {
        const shop = await shopModel.findById(convertToObjectIdMongodb(id))
        if (!shop) throw new NotFoundError(`Shop Not Found`)
        return shop
    }

    static updateShop = async (shopId, payload) => {
        const shop = await shopModel.findById(convertToObjectIdMongodb(shopId))
        if (!shop) throw new NotFoundError(`Shop Not Found`)
        return await updateShopById(shopId, payload)
    }

    static updatePasswordShop = async (email, newPassword) => {
        const shop = await shopModel.findOne({email})
        if (!shop) throw new NotFoundError(`Shop Not Found`)
        const newPasss = await bcrypt.hash(newPassword, 10)
        const result = await shopModel.findOneAndUpdate(
            { _id: shop._id },
            { $set: { password: newPasss } },
            { new: true }
          );
          return result
        
    }

    static insertFollower = async (shopId, userId) => {
        console.log("mess return", shopId, userId);
        const shop = await shopModel.findById((shopId))
        if (!shop) throw new NotFoundError(`Shop Not Found`)
        // // Thêm idToFollow vào mảng follower
        const updatedUser = await shopModel.findByIdAndUpdate(
            shopId,
            { $addToSet: { follower: userId }, $inc: { numFollow: 1 } },
            { new: true } // Trả về bản ghi đã được cập nhật
        );
        return updatedUser;
    }

    static removeFollow = async (shopId, userId) => {
        console.log("shop", shopId, userId);
        // Kiểm tra xem shop có tồn tại không
        const shop = await shopModel.findById(shopId);
        if (!shop) throw new NotFoundError(`Shop Not Found`);

        // Xóa userId khỏi mảng follower và giảm numFollow đi 1
        const updatedUser = await shopModel.findByIdAndUpdate(
            shopId,
            { $pull: { follower: userId }, $inc: { numFollow: -1 } },
            { new: true } // Trả về bản ghi đã được cập nhật
        );

        return updatedUser;
    };

    static getListShop = async (status) => {
        return await shopModel.find({ status }).lean()
    }



    // Cập nhật role cho một shop cụ thể
    static updateShopRole = async (shopId, newRoles) => {
        try {
            // Lấy thông tin cũ của shop
            const existingShop = await shopModel.findById(shopId);
        
            if (!existingShop) {
              console.log('Shop không tồn tại.');
              return;
            }
        
            // Chuyển đổi giá trị status
            const newStatus = existingShop.status === 'active' ? 'inactive' : 'active';
        
            // Cập nhật roles và status
            const result = await shopModel.findOneAndUpdate(
              { _id: shopId },
              { $set: { roles: newRoles, status: newStatus } },
              { new: true } 
            );
        
            console.log(result);
            return result
          } catch (error) {
            console.error(error);
          }
    };

    


}

module.exports = AccessService
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {

    handlerRefreshToken = async(req,res,next) => {
        // new SuccessResponse ({
        //     message: 'Get token success',
        //     metadata: await AccessService.handlerRefresh(req.body.refreshToken)

        // }).send(res)

        //V2
        new SuccessResponse ({
            message: 'Get token success',
            metadata: await AccessService.handlerRefreshV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })

        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login Succesfully',
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
  
    signUp = async (req, res, next) => {   
        new CREATED({
            message: 'Register Shop Success',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }

    logout = async(req,res,next) => {
        
        new SuccessResponse({
            message: 'Logout Success!!',
            metadata: await AccessService.logout(req.keyStore )
        }).send(res)
    }

    getInfo = async(req,res,next) => {
       
        new SuccessResponse({
            message: 'Get Info Success!!',
            metadata: await AccessService.getInfoShop(req.params)
        }).send(res)
    }

    updateShop = async(req,res,next) => {
       const shopId =  req.user.userId
       const payload = req.body

        new SuccessResponse({
            message: 'Updated Successfully!!',
            metadata: await AccessService.updateShop(shopId, payload)
        }).send(res)
    }

    forgotPassword = async(req,res,next) => {
        
        const {email, newPassword} = req.body
         new SuccessResponse({
             message: 'Updated Successfully!!',
             metadata: await AccessService.updatePasswordShop(email,newPassword)
         }).send(res)
     }
 

    getListShop = async(req,res, next) => {
        const {status} = req.body
        new SuccessResponse({
            message: 'Get List Shop Successfully!!',
            metadata: await AccessService.getListShop(status)
        }).send(res)
    }

    updateRolesForShop = async(req,res, next) => {
        const {shopId, role} = req.body
        new SuccessResponse({
            message: 'Get List Shop Successfully!!',
            metadata: await AccessService.updateShopRole(shopId, role)
        }).send(res)
    }
}

module.exports = new AccessController();

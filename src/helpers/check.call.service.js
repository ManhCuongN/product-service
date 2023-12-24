'use strict'
const axios = require('axios')
const checkUserExists = async({userId}) => 
   {
    try {
        const response =  axios.post(`user-service.railway.internal/api/v1/user/check/exist`, {userId});
       console.log("res",response);
    } catch (error) {
        console.error(error);
        return false; // Xem xét xử lý lỗi cụ thể
    }
}
module.exports = {
  checkUserExists
}
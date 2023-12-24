'use strict'
const cloudinary = require('../configs/config.cloudinary')

class UploadService {
//1. upload from url image
   static uploadImageFromURL = async(urlImage,shopId) => {
    
    try {
        const folderName = `product/${shopId}`, newFileName = "testdemo"
        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName
        })
        console.log(result);
        return result;
        // return result
    } catch (error) {
         console.error(`Error uploading image`, error);
    }
}


//1. upload from url image
static uploadImageLocal = async ({ path, shopId }) => {
    try {
        const folderName = `product/thumb/${shopId}`;
       
        // Thêm timestamp hoặc giá trị duy nhất khác vào public_id để đảm bảo tính duy nhất
        const timestamp = new Date().getTime();
        const publicId = `thumb_${timestamp}`;

        const result = await cloudinary.uploader.upload(path, {
            public_id: publicId,
            folder: folderName
        });
        return {
            image_url: result.secure_url,
            shopId,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 269,
                width: 269,
                format: 'jpg'
            })
        };
    } catch (error) {
        console.error(`Error uploading image`, error);
    }
};

//1. upload from url image
static uploadImageLocal2 = async({path}) => {
    
    try {
        const folderName = `user/avatar/}`, newFileName = "testdemo"
        const result = await cloudinary.uploader.upload(path, {
            public_id: "avatar",
            folder: folderName
        })
        console.log(result);
        return {
            image_url: result.secure_url,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 269,
                width: 269,
                format:'jpg'
            })
        }
        // return result
    } catch (error) {
         console.error(`Error uploading image`, error);
    }
}

//1. upload from url image
static uploadListImageLocal = async({path, shopId}) => {
    console.log("path", path);
    // try {
    //     const folderName = `product/thumb/${shopId}`
    //     const result = await cloudinary.uploader.upload(path, {
    //         public_id: "thumb",
    //         folder: folderName
    //     })
    //     return {
    //         image_url: result.secure_url,
    //         shopId,
    //         thumb_url: await cloudinary.url(result.public_id, {
    //             height: 269,
    //             width: 269,
    //             format:'jpg'
    //         })
    //     }
    //     // return result
    // } catch (error) {
    //      console.error(`Error uploading image`, error);
    // }
}

//1. upload from url images
static uploadListImageLocalFiles = async({files, shopId}) => {
    console.log("files", files);
    try {
        const folderName = `product/thumb/${shopId}`
        if(!files.length) return
        const uploadedUrls = []
        for(const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName
            })
            uploadedUrls.push({
                image_url: result.secure_url,
            shopId,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 269,
                width: 269,
                format:'jpg'
            })
            })
        }
        
        return uploadedUrls
        // return result
    } catch (error) {
         console.error(`Error uploading image`, error);
    }
}

}


module.exports = UploadService
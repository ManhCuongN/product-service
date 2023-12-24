// // Require the cloudinary library
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name:"datnecommerce2023",
  api_key: "842729965617165",
  api_secret:"YTxKzPr0nJXuorHAj0r8Kyrkg9U"
});



// const storage = new CloudinaryStorage({
//     cloudinary,
//       folder: 'fd', // Thay "your_folder_name" bằng tên thư mục bạn muốn sử dụng
//       allowedFormats: ['jpg', 'png'],
//       filename: function (req, file, cb) {
//         cb(null, file.originalname); 
//       }
   
//   });

// const uploadCloud = multer({ storage });

// module.exports = uploadCloud
// const multer  = require("multer");

// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 2 * 1024 * 1024, // 2 MB
//         files: 1,
//     },
// });

module.exports = cloudinary

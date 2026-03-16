const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// cloudinary.config({
//    cloud_name:process.env.CLOUD_NAME,
//    api_key:process.env.CLOUD_API_KEY,
//    api_secret: process.env.CLOUD_API_SECRET
// });

 
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'wanderlust_DEV',
//     allowedformats: ["png","jpg","jpeg"],  
//   },
// });

// Temporary local storage for development
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

module.exports={
   cloudinary,
   storage, 
}
// Re-export the shared multer instance so routes can use upload.single('img')
const { upload } = require('../config/cloudinary')
module.exports = upload

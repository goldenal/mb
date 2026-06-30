const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { Readable } = require('stream')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Single multer instance using memory storage — works with any Cloudinary version
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
    cb(allowed.includes(file.mimetype) ? null : new Error('Unsupported image format'), allowed.includes(file.mimetype))
  },
})

async function uploadBuffer(buffer, folder = 'general') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `matture-beddings/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    )
    Readable.from(buffer).pipe(stream)
  })
}

async function deleteImage(publicId) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.warn('Cloudinary delete failed for', publicId, err.message)
  }
}

module.exports = { cloudinary, upload, uploadBuffer, deleteImage }

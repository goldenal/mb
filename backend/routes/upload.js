const router = require('express').Router()
const requireAuth = require('../middleware/auth')
const upload = require('../middleware/upload')
const { uploadBuffer } = require('../config/cloudinary')

const VALID_FOLDERS = ['beds', 'mattresses', 'pillows', 'duvets', 'general']

// POST /api/upload?folder=beds — admin, generic image upload
router.post('/', requireAuth, upload.single('img'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const folder = VALID_FOLDERS.includes(req.query.folder) ? req.query.folder : 'general'
  const result = await uploadBuffer(req.file.buffer, folder)

  res.json({
    url: result.secure_url,
    publicId: result.public_id,
  })
})

module.exports = router

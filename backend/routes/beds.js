const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const Bed = require('../models/Bed')
const requireAuth = require('../middleware/auth')
const upload = require('../middleware/upload')
const { uploadBuffer, deleteImage } = require('../config/cloudinary')

// GET /api/beds — public
router.get('/', async (req, res) => {
  const beds = await Bed.findAll({ order: [['sort_order', 'ASC'], ['createdAt', 'ASC']] })
  res.json({ beds })
})

// GET /api/beds/:id — public
router.get('/:id', async (req, res) => {
  const bed = await Bed.findByPk(req.params.id)
  if (!bed) return res.status(404).json({ error: 'Bed not found' })
  res.json({ bed })
})

// POST /api/beds — admin
router.post(
  '/',
  requireAuth,
  upload.single('img'),
  [
    body('name').trim().notEmpty(),
    body('sub').trim().notEmpty(),
    body('thickness').trim().notEmpty(),
    body('feel').trim().notEmpty(),
    body('price').trim().notEmpty(),
    body('desc').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    let img = req.body.img || ''
    let imgPublicId = ''
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'beds')
      img = result.secure_url
      imgPublicId = result.public_id
    }

    const order = await Bed.count()
    const bed = await Bed.create({ ...req.body, img, imgPublicId, order })
    res.status(201).json({ bed })
  },
)

// PUT /api/beds/reorder — admin
router.put('/reorder', requireAuth, async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' })
  await Promise.all(ids.map((id, i) => Bed.update({ order: i }, { where: { id } })))
  res.json({ message: 'Order updated' })
})

// PUT /api/beds/:id — admin
router.put('/:id', requireAuth, upload.single('img'), async (req, res) => {
  const bed = await Bed.findByPk(req.params.id)
  if (!bed) return res.status(404).json({ error: 'Bed not found' })

  const update = {}
  if (req.file) {
    await deleteImage(bed.imgPublicId)
    const result = await uploadBuffer(req.file.buffer, 'beds')
    update.img = result.secure_url
    update.imgPublicId = result.public_id
  }

  const fields = ['name', 'sub', 'thickness', 'feel', 'price', 'desc', 'order']
  fields.forEach((f) => { if (req.body[f] !== undefined) update[f] = req.body[f] })

  await bed.update(update)
  res.json({ bed })
})

// DELETE /api/beds/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const bed = await Bed.findByPk(req.params.id)
  if (!bed) return res.status(404).json({ error: 'Bed not found' })
  await deleteImage(bed.imgPublicId)
  await bed.destroy()
  res.json({ message: 'Bed deleted' })
})

module.exports = router

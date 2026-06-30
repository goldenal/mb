const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const Mattress = require('../models/Mattress')
const requireAuth = require('../middleware/auth')
const upload = require('../middleware/upload')
const { uploadBuffer, deleteImage } = require('../config/cloudinary')

// GET /api/mattresses — public
router.get('/', async (req, res) => {
  const mattresses = await Mattress.findAll({ order: [['sort_order', 'ASC'], ['createdAt', 'ASC']] })
  res.json({ mattresses })
})

// GET /api/mattresses/:id — public
router.get('/:id', async (req, res) => {
  const mattress = await Mattress.findByPk(req.params.id)
  if (!mattress) return res.status(404).json({ error: 'Mattress not found' })
  res.json({ mattress })
})

// POST /api/mattresses — admin
router.post(
  '/',
  requireAuth,
  upload.single('img'),
  [
    body('name').trim().notEmpty(),
    body('tag').trim().notEmpty(),
    body('desc').trim().notEmpty(),
    body('price').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    let img = req.body.img || ''
    let imgPublicId = ''
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'mattresses')
      img = result.secure_url
      imgPublicId = result.public_id
    }

    const order = await Mattress.count()
    const mattress = await Mattress.create({ ...req.body, img, imgPublicId, order })
    res.status(201).json({ mattress })
  },
)

// PUT /api/mattresses/reorder — admin
router.put('/reorder', requireAuth, async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' })
  await Promise.all(ids.map((id, i) => Mattress.update({ order: i }, { where: { id } })))
  res.json({ message: 'Order updated' })
})

// PUT /api/mattresses/:id — admin
router.put('/:id', requireAuth, upload.single('img'), async (req, res) => {
  const mattress = await Mattress.findByPk(req.params.id)
  if (!mattress) return res.status(404).json({ error: 'Mattress not found' })

  const update = {}
  if (req.file) {
    await deleteImage(mattress.imgPublicId)
    const result = await uploadBuffer(req.file.buffer, 'mattresses')
    update.img = result.secure_url
    update.imgPublicId = result.public_id
  }

  const fields = ['name', 'tag', 'dotColor', 'desc', 'price', 'order']
  fields.forEach((f) => { if (req.body[f] !== undefined) update[f] = req.body[f] })

  await mattress.update(update)
  res.json({ mattress })
})

// DELETE /api/mattresses/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const mattress = await Mattress.findByPk(req.params.id)
  if (!mattress) return res.status(404).json({ error: 'Mattress not found' })
  await deleteImage(mattress.imgPublicId)
  await mattress.destroy()
  res.json({ message: 'Mattress deleted' })
})

module.exports = router

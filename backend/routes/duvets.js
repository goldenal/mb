const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const Duvet = require('../models/Duvet')
const requireAuth = require('../middleware/auth')
const upload = require('../middleware/upload')
const { uploadBuffer, deleteImage } = require('../config/cloudinary')

// GET /api/duvets — public
router.get('/', async (req, res) => {
  const duvets = await Duvet.findAll({
    order: [['is_featured', 'DESC'], ['sort_order', 'ASC'], ['createdAt', 'ASC']],
  })
  res.json({ duvets })
})

// GET /api/duvets/:id — public
router.get('/:id', async (req, res) => {
  const duvet = await Duvet.findByPk(req.params.id)
  if (!duvet) return res.status(404).json({ error: 'Duvet not found' })
  res.json({ duvet })
})

// POST /api/duvets — admin
router.post(
  '/',
  requireAuth,
  upload.single('img'),
  [
    body('name').trim().notEmpty(),
    body('desc').trim().notEmpty(),
    body('price').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    let img = req.body.img || ''
    let imgPublicId = ''
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'duvets')
      img = result.secure_url
      imgPublicId = result.public_id
    }

    const order = await Duvet.count()
    const duvet = await Duvet.create({
      ...req.body,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      img,
      imgPublicId,
      order,
    })
    res.status(201).json({ duvet })
  },
)

// PUT /api/duvets/reorder — admin
router.put('/reorder', requireAuth, async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' })
  await Promise.all(ids.map((id, i) => Duvet.update({ order: i }, { where: { id } })))
  res.json({ message: 'Order updated' })
})

// PUT /api/duvets/:id — admin
router.put('/:id', requireAuth, upload.single('img'), async (req, res) => {
  const duvet = await Duvet.findByPk(req.params.id)
  if (!duvet) return res.status(404).json({ error: 'Duvet not found' })

  const update = {}
  if (req.file) {
    await deleteImage(duvet.imgPublicId)
    const result = await uploadBuffer(req.file.buffer, 'duvets')
    update.img = result.secure_url
    update.imgPublicId = result.public_id
  }

  const fields = ['name', 'desc', 'price', 'category', 'order']
  fields.forEach((f) => { if (req.body[f] !== undefined) update[f] = req.body[f] })
  if (req.body.isFeatured !== undefined) {
    update.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true
  }

  await duvet.update(update)
  res.json({ duvet })
})

// DELETE /api/duvets/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const duvet = await Duvet.findByPk(req.params.id)
  if (!duvet) return res.status(404).json({ error: 'Duvet not found' })
  await deleteImage(duvet.imgPublicId)
  await duvet.destroy()
  res.json({ message: 'Duvet deleted' })
})

module.exports = router

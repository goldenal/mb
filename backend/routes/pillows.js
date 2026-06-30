const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const Pillow = require('../models/Pillow')
const requireAuth = require('../middleware/auth')
const upload = require('../middleware/upload')
const { uploadBuffer, deleteImage } = require('../config/cloudinary')

// GET /api/pillows?featured=true — public
router.get('/', async (req, res) => {
  const where = req.query.featured === 'true' ? { featured: true } : {}
  const order = req.query.featured === 'true'
    ? [['featured_order', 'ASC'], ['sort_order', 'ASC']]
    : [['sort_order', 'ASC'], ['createdAt', 'ASC']]
  const pillows = await Pillow.findAll({ where, order })
  res.json({ pillows })
})

// GET /api/pillows/:slug — public (by slug or id)
router.get('/:slug', async (req, res) => {
  const pillow =
    (await Pillow.findOne({ where: { slug: req.params.slug } })) ||
    (await Pillow.findByPk(req.params.slug))
  if (!pillow) return res.status(404).json({ error: 'Pillow not found' })
  res.json({ pillow })
})

// POST /api/pillows — admin
router.post(
  '/',
  requireAuth,
  upload.single('img'),
  [
    body('slug').trim().notEmpty().toLowerCase(),
    body('name').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    let img = req.body.img || ''
    let imgPublicId = ''
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'pillows')
      img = result.secure_url
      imgPublicId = result.public_id
    }

    let sizes = []
    try { sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [] } catch { /* ignore */ }

    const order = await Pillow.count()
    const pillow = await Pillow.create({ ...req.body, sizes, img, imgPublicId, order })
    res.status(201).json({ pillow })
  },
)

// PUT /api/pillows/reorder — admin
router.put('/reorder', requireAuth, async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' })
  await Promise.all(ids.map((id, i) => Pillow.update({ order: i }, { where: { id } })))
  res.json({ message: 'Order updated' })
})

// PUT /api/pillows/featured — admin; body: { slugs: ['vita-throw', ...] }
router.put('/featured', requireAuth, async (req, res) => {
  const { slugs } = req.body
  if (!Array.isArray(slugs)) return res.status(400).json({ error: 'slugs must be an array' })
  await Pillow.update({ featured: false, featuredOrder: 0 }, { where: {} })
  await Promise.all(
    slugs.map((slug, i) => Pillow.update({ featured: true, featuredOrder: i }, { where: { slug } })),
  )
  res.json({ message: 'Featured pillows updated' })
})

// PUT /api/pillows/:id — admin
router.put('/:id', requireAuth, upload.single('img'), async (req, res) => {
  const pillow = await Pillow.findByPk(req.params.id)
  if (!pillow) return res.status(404).json({ error: 'Pillow not found' })

  const update = {}
  if (req.file) {
    await deleteImage(pillow.imgPublicId)
    const result = await uploadBuffer(req.file.buffer, 'pillows')
    update.img = result.secure_url
    update.imgPublicId = result.public_id
  }

  const fields = ['slug', 'name', 'desc', 'price', 'featured', 'featuredOrder', 'order']
  fields.forEach((f) => { if (req.body[f] !== undefined) update[f] = req.body[f] })
  if (req.body.sizes) {
    try { update.sizes = JSON.parse(req.body.sizes) } catch { /* ignore */ }
  }

  await pillow.update(update)
  res.json({ pillow })
})

// DELETE /api/pillows/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const pillow = await Pillow.findByPk(req.params.id)
  if (!pillow) return res.status(404).json({ error: 'Pillow not found' })
  await deleteImage(pillow.imgPublicId)
  await pillow.destroy()
  res.json({ message: 'Pillow deleted' })
})

module.exports = router

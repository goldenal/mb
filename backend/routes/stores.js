const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const Store = require('../models/Store')
const requireAuth = require('../middleware/auth')

// GET /api/stores — public
router.get('/', async (req, res) => {
  const stores = await Store.findAll({ order: [['sort_order', 'ASC'], ['createdAt', 'ASC']] })
  res.json({ stores })
})

// GET /api/stores/:id — public
router.get('/:id', async (req, res) => {
  const store = await Store.findByPk(req.params.id)
  if (!store) return res.status(404).json({ error: 'Store not found' })
  res.json({ store })
})

// POST /api/stores — admin
router.post(
  '/',
  requireAuth,
  [
    body('name').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('hours').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const order = await Store.count()
    const store = await Store.create({ ...req.body, order })
    res.status(201).json({ store })
  },
)

// PUT /api/stores/reorder — admin
router.put('/reorder', requireAuth, async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' })
  await Promise.all(ids.map((id, i) => Store.update({ order: i }, { where: { id } })))
  res.json({ message: 'Order updated' })
})

// PUT /api/stores/:id — admin
router.put(
  '/:id',
  requireAuth,
  [
    body('name').optional().trim().notEmpty(),
    body('address').optional().trim().notEmpty(),
    body('hours').optional().trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const store = await Store.findByPk(req.params.id)
    if (!store) return res.status(404).json({ error: 'Store not found' })
    await store.update(req.body)
    res.json({ store })
  },
)

// DELETE /api/stores/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  const store = await Store.findByPk(req.params.id)
  if (!store) return res.status(404).json({ error: 'Store not found' })
  await store.destroy()
  res.json({ message: 'Store deleted' })
})

module.exports = router

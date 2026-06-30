const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const Admin = require('../models/Admin')
const requireAuth = require('../middleware/auth')

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
}

// POST /api/auth/setup — create the first admin (only if none exists)
router.post(
  '/setup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const existing = await Admin.findOne()
    if (existing) return res.status(403).json({ error: 'Admin already set up' })

    const { email, password, name } = req.body
    const passwordHash = await Admin.hashPassword(password)
    const admin = await Admin.create({ email, passwordHash, name: name || 'Admin' })
    res.status(201).json({
      token: signToken(admin),
      admin: { id: admin.id, email: admin.email, name: admin.name },
    })
  },
)

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const admin = await Admin.findOne({ where: { email: req.body.email } })
    if (!admin || !(await admin.comparePassword(req.body.password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    res.json({
      token: signToken(admin),
      admin: { id: admin.id, email: admin.email, name: admin.name },
    })
  },
)

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const admin = await Admin.findByPk(req.admin.id, {
    attributes: { exclude: ['passwordHash'] },
  })
  if (!admin) return res.status(404).json({ error: 'Admin not found' })
  res.json({ admin })
})

// PUT /api/auth/password
router.put(
  '/password',
  requireAuth,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const admin = await Admin.findByPk(req.admin.id)
    if (!admin || !(await admin.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    await admin.update({ passwordHash: await Admin.hashPassword(req.body.newPassword) })
    res.json({ message: 'Password updated' })
  },
)

module.exports = router

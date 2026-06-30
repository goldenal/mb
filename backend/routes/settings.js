const router = require('express').Router()
const Settings = require('../models/Settings')
const requireAuth = require('../middleware/auth')

async function getOrCreate() {
  const [instance] = await Settings.findOrCreate({ where: { id: 'main' }, defaults: { data: {} } })
  return instance
}

// GET /api/settings — public
router.get('/', async (req, res) => {
  const instance = await getOrCreate()
  res.json({ settings: instance.toResponse() })
})

// PUT /api/settings — admin (partial update)
router.put('/', requireAuth, async (req, res) => {
  const allowed = [
    'siteName', 'siteTagline',
    'heroLines',
    'aboutEyebrow', 'aboutHeading', 'aboutBody', 'aboutTiles',
    'bedsHeading',
    'mattressesEyebrow', 'mattressesHeading', 'mattressesSub',
    'pillowsEyebrow', 'pillowsHeading', 'pillowsSub',
    'duvetsEyebrow', 'duvetsHeading', 'duvetsSub',
    'deliveryEyebrow', 'deliveryHeading', 'deliveryBody', 'deliveryStats',
    'contactHeading', 'contactSub',
    'whatsappNumber', 'whatsappDisplay', 'whatsappSub',
    'phone', 'phoneSub',
    'email', 'emailSub',
    'storesHeading', 'deliveryNote',
    'footerCtaHeading', 'footerButtonText', 'footerCopyright',
  ]

  const update = {}
  allowed.forEach((key) => { if (req.body[key] !== undefined) update[key] = req.body[key] })

  const instance = await getOrCreate()
  await instance.update({ data: { ...instance.data, ...update } })
  res.json({ settings: instance.toResponse() })
})

module.exports = router

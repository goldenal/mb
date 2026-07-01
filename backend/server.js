require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')

// Register all models so Sequelize knows about them before sync()
require('./models/Admin')
require('./models/Bed')
require('./models/Mattress')
require('./models/Pillow')
require('./models/Duvet')
require('./models/Store')
require('./models/Settings')

const app = express()

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: [
      process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      'https://mb-indol-omega.vercel.app',
      'www.maturebeddings.com.ng',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', require('./routes/auth'))
app.use('/api/beds', require('./routes/beds'))
app.use('/api/mattresses', require('./routes/mattresses'))
app.use('/api/pillows', require('./routes/pillows'))
app.use('/api/duvets', require('./routes/duvets'))
app.use('/api/stores', require('./routes/stores'))
app.use('/api/settings', require('./routes/settings'))
app.use('/api/upload', require('./routes/upload'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ─── Error handler ────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err)

  // Multer file-size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Image exceeds 10 MB limit' })
  }
  // Multer file-type error
  if (err.message && err.message.includes('allowed_formats')) {
    return res.status(415).json({ error: 'Unsupported image format' })
  }

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
})

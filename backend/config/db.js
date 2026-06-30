const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { rejectUnauthorized: false } },
  logging: false,
})

async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('PostgreSQL connected')
    await sequelize.sync()
    console.log('Schema synced')
  } catch (err) {
    console.error('Database connection error:', err.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }

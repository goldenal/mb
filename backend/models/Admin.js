const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')
const bcrypt = require('bcryptjs')

class Admin extends Model {
  comparePassword(plain) {
    return bcrypt.compare(plain, this.passwordHash)
  }

  static hashPassword(plain) {
    return bcrypt.hash(plain, 12)
  }
}

Admin.init(
  {
    email:        { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.TEXT, allowNull: false },
    name:         { type: DataTypes.STRING, defaultValue: 'Admin' },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    underscored: true,
  },
)

module.exports = Admin
